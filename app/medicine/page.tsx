'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { ClientOnly } from '@/components/common/ClientOnly';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { LocationPrompt } from '@/components/common/LocationPrompt';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    getPharmaciesInEnabledCities,
    getPharmaciesByCity,
    Pharmacy,
} from '@/lib/data/pharmacies';
import {
    fetchAllMedicines,
    fetchMedicineCategories,
    fetchMedicineForms,
    fetchPharmaciesForCustomerLocation,
    Medicine,
    MedicineFilters,
} from '@/lib/data/medicineData';

interface FilterOptions {
    categories: Array<{ id: string; name: string; count: number }>;
    forms: Array<{ id: string; name: string }>;
    priceRange: { min: number; max: number };
    sortBy: string;
    inStockOnly: boolean;
    prescriptionOnly: boolean;
    minRating: number;
    selectedCities: string[];
    selectedPharmacies: string[];
}

const ITEMS_PER_PAGE = 20;

export default function MedicinePage() {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { t: tProducts } = useTranslation(locale, 'products');
    const { selectedCity, availableCities, adminSettings } = useCity();
    const isMobile = useIsMobile();

    // Refs for preventing unnecessary re-renders
    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const lastFetchParamsRef = useRef<string>('');

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [forms, setForms] = useState<string[]>([]);
    const [availablePharmacies, setAvailablePharmacies] = useState<string[]>([]);

    // Filter state - memoized to prevent unnecessary re-renders
    const [filters, setFilters] = useState<FilterOptions>(() => ({
        categories: [],
        forms: [],
        priceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        inStockOnly: false,
        prescriptionOnly: false,
        minRating: 0,
        selectedCities: [],
        selectedPharmacies: [],
    }));

    // Memoized pharmacies to prevent recalculation
    const pharmacies: Pharmacy[] = useMemo(() => {
        return selectedCity
            ? getPharmaciesByCity(selectedCity.nameEn)
            : getPharmaciesInEnabledCities(availableCities);
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity?.nameEn, availableCities]);

    // Memoized medicine filters to prevent unnecessary API calls
    const medicineFilters = useMemo(() => {
        if (!selectedCity) return null;

        const apiFilters: MedicineFilters = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortBy: filters.sortBy,
            cityName: selectedCity.id,
        };

        // Only add non-empty values
        if (searchQuery?.trim()) apiFilters.search = searchQuery.trim();
        if (selectedCategory !== 'all') apiFilters.category = selectedCategory;
        if (filters.inStockOnly) apiFilters.inStockOnly = true;
        if (filters.prescriptionOnly) apiFilters.prescriptionOnly = true;
        if (filters.minRating > 0) apiFilters.minRating = filters.minRating;
        if (filters.priceRange.min > 0) apiFilters.minPrice = filters.priceRange.min;
        if (filters.priceRange.max < 1000) apiFilters.maxPrice = filters.priceRange.max;
        if (filters.selectedPharmacies.length > 0) apiFilters.pharmacyId = filters.selectedPharmacies[0];

        return apiFilters;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedCity?.id,
        currentPage,
        searchQuery,
        selectedCategory,
        filters.sortBy,
        filters.inStockOnly,
        filters.prescriptionOnly,
        filters.minRating,
        filters.priceRange.min,
        filters.priceRange.max,
        filters.selectedPharmacies,
    ]);

    // Load metadata only once per city change
    useEffect(() => {
        if (!selectedCity) return;

        let mounted = true;

        const loadMetadata = async () => {
            try {
                const [categoriesData, formsData, pharmacyIds] = await Promise.all([
                    fetchMedicineCategories(),
                    fetchMedicineForms(),
                    fetchPharmaciesForCustomerLocation(selectedCity.id),
                ]);

                if (!mounted) return;

                setCategories(categoriesData);
                setForms(formsData);
                setAvailablePharmacies(pharmacyIds);

                // Update filters only if they've changed
                setFilters(prev => {
                    const categoryOptions = [
                        { id: 'all', name: 'All Products', count: 0 },
                        ...categoriesData.map(cat => ({
                            id: cat,
                            name: cat.charAt(0).toUpperCase() + cat.slice(1),
                            count: 0,
                        }))
                    ];

                    const formOptions = formsData.map(form => ({
                        id: form,
                        name: form.charAt(0).toUpperCase() + form.slice(1),
                    }));

                    // Only update if different to prevent re-render
                    if (JSON.stringify(prev.categories) !== JSON.stringify(categoryOptions) ||
                        JSON.stringify(prev.forms) !== JSON.stringify(formOptions)) {
                        return {
                            ...prev,
                            categories: categoryOptions,
                            forms: formOptions,
                        };
                    }
                    return prev;
                });

            } catch (error) {
                if (mounted) {
                    console.error('Error loading metadata:', error);
                }
            }
        };

        loadMetadata();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity?.id]);

    // Optimized medicine loading with debouncing and deduplication
    const loadMedicines = useCallback(async (force = false) => {
        if (!medicineFilters) return;

        // Create unique key for current fetch parameters
        const fetchKey = JSON.stringify(medicineFilters);
        
        // Skip if same parameters and not forced
        if (!force && fetchKey === lastFetchParamsRef.current) {
            return;
        }

        lastFetchParamsRef.current = fetchKey;
        setLoading(true);
        setError(null);

        try {
            const fetchedData = await fetchAllMedicines(medicineFilters);

            if (fetchedData) {
                setMedicines(fetchedData.medicines);
                setTotalPages(fetchedData.totalPages);
                setTotalCount(fetchedData.total);

                // Update category counts only on first load
                if (currentPage === 1 && !searchQuery && selectedCategory === 'all') {
                    setFilters(prev => ({
                        ...prev,
                        categories: prev.categories.map(cat => 
                            cat.id === 'all' 
                                ? { ...cat, count: fetchedData.total }
                                : cat
                        ),
                    }));
                }
            } else {
                setMedicines([]);
                setTotalPages(1);
                setTotalCount(0);
                setError('Failed to fetch medicines. Please check your connection and try again.');
            }
        } catch (err) {
            console.error('Error fetching medicines:', err);
            setError('An unexpected error occurred. Please try again later.');
            setMedicines([]);
            setTotalPages(1);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [medicineFilters, currentPage, searchQuery, selectedCategory]);

    // Load medicines with debouncing for search
    useEffect(() => {
        if (!medicineFilters) return;

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search queries, load immediately for other changes
        const delay = searchQuery ? 500 : 100;

        searchTimeoutRef.current = setTimeout(() => {
            loadMedicines();
        }, delay);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadMedicines, searchQuery]);

    // Reset page when key filters change (but not when page changes)
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, selectedCategory, filters.sortBy, filters.inStockOnly, filters.prescriptionOnly]);

    // Optimized event handlers with useCallback
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleCategoryChange = useCallback((category: string) => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
        }
    }, [selectedCategory]);

    const handleFiltersChange = useCallback((newFilters: Partial<FilterOptions>) => {
        setFilters(prev => {
            const updated = { ...prev, ...newFilters };
            // Only update if actually different
            return JSON.stringify(prev) !== JSON.stringify(updated) ? updated : prev;
        });
    }, []);

    const handlePaginationChange = useCallback((newPage: number) => {
        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage, totalPages]);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedCategory('all');
        setCurrentPage(1);
        setFilters(prev => ({
            ...prev,
            priceRange: { min: 0, max: 1000 },
            sortBy: 'name',
            inStockOnly: false,
            prescriptionOnly: false,
            minRating: 0,
            selectedCities: [],
            selectedPharmacies: [],
        }));
    }, []);

    const handleRetry = useCallback(() => {
        setError(null);
        loadMedicines(true); // Force reload
    }, [loadMedicines]);

    // Active filters check - memoized to prevent re-renders
    const hasActiveFilters = useMemo(() => (
        searchQuery || 
        selectedCategory !== 'all' || 
        filters.inStockOnly || 
        filters.prescriptionOnly || 
        filters.selectedPharmacies.length > 0 ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 1000 ||
        filters.minRating > 0
    ), [searchQuery, selectedCategory, filters]);

    // Show location prompt if no city is selected
    if (!selectedCity) {
        return <LocationPrompt availableCities={availableCities} />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {isMobile && <ResponsiveHeader />}

            <ClientOnly>
                <CategoriesBar />
            </ClientOnly>

            {/* Main content container */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="lg:flex lg:gap-8">
                    {/* Desktop Filters Sidebar */}
                    <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
                        <ProductFilters
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                            isMedicinePage={true}
                            availablePharmacies={availablePharmacies}
                            pharmacies={pharmacies}
                            totalProducts = {totalCount}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Search Bar */}
                        <div className="lg:hidden mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search medicines..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-gray-900 placeholder-gray-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        <div className="lg:hidden mb-6">
                            <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedCategory={selectedCategory}
                                onCategoryChange={handleCategoryChange}
                                isMedicinePage={true}
                                availablePharmacies={availablePharmacies}
                                pharmacies={pharmacies}
                            />
                        </div>

                        {/* Desktop Search and Results Info */}
                        <div className="hidden lg:block mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search medicines..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-gray-900 placeholder-gray-500"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {!loading && !error && medicines.length > 0 && (
                                    <div className="text-sm text-gray-600">
                                        Showing {medicines.length} of {totalCount} medicines in {selectedCity.nameEn}
                                        {searchQuery && ` for "${searchQuery}"`}
                                        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {searchQuery && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Search: {"'"}{searchQuery}{"'"}
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {selectedCategory !== 'all' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Category: {selectedCategory}
                                        <button
                                            onClick={() => setSelectedCategory('all')}
                                            className="ml-1 text-green-600 hover:text-green-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {filters.inStockOnly && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        In Stock Only
                                        <button
                                            onClick={() => handleFiltersChange({ inStockOnly: false })}
                                            className="ml-1 text-purple-600 hover:text-purple-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {filters.prescriptionOnly && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                        Prescription Only
                                        <button
                                            onClick={() => handleFiltersChange({ prescriptionOnly: false })}
                                            className="ml-1 text-orange-600 hover:text-orange-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {filters.selectedPharmacies.length > 0 && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {filters.selectedPharmacies.length} Pharmacy(ies)
                                        <button
                                            onClick={() => handleFiltersChange({ selectedPharmacies: [] })}
                                            className="ml-1 text-yellow-600 hover:text-yellow-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={handleClearFilters}
                                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Content Area */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1F1F6F] mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading medicines...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 rounded-xl border border-red-200 bg-red-50">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-red-900 mb-2">
                                    Error Loading Medicines
                                </h3>
                                <p className="text-red-700 mb-6 max-w-md mx-auto">
                                    {error}
                                </p>
                                <button
                                    onClick={handleRetry}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : medicines.length > 0 ? (
                            <>
                                <ProductGrid
                                    products={medicines}
                                    pharmacies={pharmacies}
                                    selectedCityId={selectedCity.id}
                                    locale={locale}
                                />

                                {/* Pagination controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-8 space-x-2">
                                        <button
                                            onClick={() => handlePaginationChange(currentPage - 1)}
                                            disabled={currentPage <= 1}
                                            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#1F1F6F] hover:bg-[#14274E] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        
                                        {/* Page numbers */}
                                        <div className="flex space-x-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePaginationChange(pageNum)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            currentPage === pageNum
                                                                ? 'bg-[#1F1F6F] text-white'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePaginationChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages}
                                            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#1F1F6F] hover:bg-[#14274E] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}

                                {/* Results summary */}
                                {!loading && (
                                    <div className="mt-6 text-center text-sm text-gray-500">
                                        Page {currentPage} of {totalPages} • {totalCount} total medicines
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-3xl">
                                    💊
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No medicines found
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {searchQuery 
                                        ? `We couldn't find any medicines matching "${searchQuery}" in ${selectedCity.nameEn}.`
                                        : `No medicines are currently available in ${selectedCity.nameEn} with the selected filters.`
                                    }
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleClearFilters}
                                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                                    >
                                        Clear All Filters
                                    </button>
                                    {searchQuery && (
                                        <div>
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="text-[#1F1F6F] hover:text-[#14274E] font-medium"
                                            >
                                                Clear search only
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="hidden md:block">
                <ClientOnly>
                    <Footer />
                </ClientOnly>
            </div>

            {isMobile && <FloatingNavigation />}
        </div>
    );
}