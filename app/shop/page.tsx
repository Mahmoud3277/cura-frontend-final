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
    getProductsByCity,
    filterProducts,
    Product,
} from '@/lib/data/products';

interface FilterOptions {
    categories: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    sortBy: string;
    inStockOnly: boolean;
    prescriptionOnly: boolean;
    minRating: number;
    selectedCities: string[];
    selectedPharmacies: string[];
}

interface ProductFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    cityId?: string;
    search?: string;
    category?: string;
    inStockOnly?: boolean;
    prescriptionOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    pharmacyId?: string;
}

const ITEMS_PER_PAGE = 20;

export default function ShopPage() {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, availableCities, adminSettings } = useCity();
    const isMobile = useIsMobile();

    // Refs for preventing unnecessary re-renders
    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const lastFetchParamsRef = useRef<string>('');

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [availablePharmacies, setAvailablePharmacies] = useState<string[]>([]);

    // Filter state - memoized to prevent unnecessary re-renders
    const [filters, setFilters] = useState<FilterOptions>(() => ({
        categories: [],
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
        // For now, return empty array - we'll handle async loading in useEffect
        return [];
    }, [selectedCity?.nameEn, availableCities]);

    // Load pharmacies asynchronously
    const [pharmaciesState, setPharmaciesState] = useState<Pharmacy[]>([]);

    useEffect(() => {
        const loadPharmacies = async () => {
            if (!selectedCity) {
                const pharmacies = await getPharmaciesInEnabledCities(availableCities);
                setPharmaciesState(pharmacies);
                return;
            }

            const pharmacies = await getPharmaciesByCity(selectedCity.nameEn);
            setPharmaciesState(pharmacies);
        };

        loadPharmacies();
    }, [selectedCity?.nameEn, availableCities]);

    // Memoized product filters to prevent unnecessary API calls
    const productFilters = useMemo(() => {
        if (!selectedCity) return null;

        const apiFilters: ProductFilters = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortBy: filters.sortBy,
            cityId: selectedCity.id,
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
                // Get categories from existing products in the city
                const cityProducts = await getProductsByCity(selectedCity.id, { limit: 1000 });
                const uniqueCategories = Array.from(new Set(cityProducts.products.map(p => p.category)));
                const pharmacyIds = Array.from(new Set(cityProducts.products.map(p => p.pharmacyId)));

                if (!mounted) return;

                setCategories(uniqueCategories);
                setAvailablePharmacies(pharmacyIds);

                // Update filters only if they've changed
                setFilters(prev => {
                    const categoryOptions = [
                        { id: 'all', name: 'All Products', count: cityProducts.total },
                        ...uniqueCategories.map(cat => ({
                            id: cat,
                            name: cat.charAt(0).toUpperCase() + cat.slice(1),
                            count: cityProducts.products.filter(p => p.category === cat).length,
                        }))
                    ];

                    // Only update if different to prevent re-render
                    if (JSON.stringify(prev.categories) !== JSON.stringify(categoryOptions)) {
                        return {
                            ...prev,
                            categories: categoryOptions,
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
    }, [selectedCity?.id]);

    // Optimized product loading with debouncing and deduplication
    const loadProducts = useCallback(async (force = false) => {
        if (!productFilters) return;

        // Create unique key for current fetch parameters
        const fetchKey = JSON.stringify(productFilters);

        // Skip if same parameters and not forced
        if (!force && fetchKey === lastFetchParamsRef.current) {
            return;
        }

        lastFetchParamsRef.current = fetchKey;
        setLoading(true);
        setError(null);

        try {
            const result = await filterProducts(productFilters);

            if (result.products) {
                setProducts(result.products);
                setTotalPages(result.totalPages || 1);
                setTotalCount(result.total || 0);
            } else {
                setProducts([]);
                setTotalPages(1);
                setTotalCount(0);
                setError('Failed to fetch products. Please check your connection and try again.');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('An unexpected error occurred. Please try again later.');
            setProducts([]);
            setTotalPages(1);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [productFilters]);

    // Load products with debouncing for search
    useEffect(() => {
        if (!productFilters) return;

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search queries, load immediately for other changes
        const delay = searchQuery ? 500 : 100;

        searchTimeoutRef.current = setTimeout(() => {
            loadProducts();
        }, delay);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [loadProducts, searchQuery]);

    // Reset page when key filters change (but not when page changes)
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [searchQuery, selectedCategory, filters.sortBy, filters.inStockOnly, filters.prescriptionOnly]);

    // Optimized event handlers with useCallback
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleFiltersChange = useCallback((newFilters: Partial<FilterOptions>) => {
        setFilters(prev => {
            const updated = { ...prev, ...newFilters };
            return JSON.stringify(prev) !== JSON.stringify(updated) ? updated : prev;
        });
    }, []);

    const handlePaginationChange = useCallback((newPage: number) => {
        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
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
        loadProducts(true);
    }, [loadProducts]);

    const handleAddToCart = (productId: number) => {
        console.log('Added product to cart:', productId);
    };

    const handleResetFilters = () => {
        handleClearFilters();
    };

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

    const displayedProducts = products;

    console.log('Shop Page Products:', displayedProducts);
    console.log('First product:', displayedProducts[0]);

    return (
        <div
            className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="un0c5eg"
        >
            <ResponsiveHeader data-oid="mw0zxdr" />

            {/* Mobile Layout */}
            <div className="md:hidden" data-oid="i676980">
                {/* Location Prompt - Show when no city is selected */}
                {!selectedCity && (
                    <div className="px-4 py-6" data-oid="mobile-location-prompt">
                        <LocationPrompt
                            title="Select Your City"
                            description="Choose your city to view available products, pharmacies, and doctors in your area."
                            data-oid="mobile-location"
                        />
                    </div>
                )}

                {/* Mobile Categories - Swipeable like homepage */}
                {selectedCity && (
                    <div className="bg-white" data-oid="mobile-categories-section">
                        <div className="py-4" data-oid="mobile-categories-container">
                            <div className="px-4 mb-4" data-oid="mobile-categories-header">
                                <h2
                                    className="text-lg font-bold text-gray-900"
                                    data-oid="mobile-categories-title"
                                >
                                    Categories
                                </h2>
                            </div>
                            <div
                                className="overflow-x-auto scrollbar-hide"
                                data-oid="mobile-categories-scroll"
                            >
                                <div
                                    className="flex space-x-3 px-4 pb-2"
                                    data-oid="mobile-categories-list"
                                >
                                    {[
                                        { id: 'all', name: 'All Products' },
                                        { id: 'medications', name: 'Medications' },
                                        { id: 'haircare', name: 'Hair Care' },
                                        { id: 'skincare', name: 'Skin Care' },
                                        { id: 'daily-essentials', name: 'Daily Essentials' },
                                        { id: 'baby-essentials', name: 'Baby Essentials' },
                                        { id: 'vitamins', name: 'Vitamins' },
                                        { id: 'sexual-wellness', name: 'Sexual Wellness' },
                                        { id: 'otc', name: 'OTC' },
                                    ].map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all duration-200 shadow-sm whitespace-nowrap ${
                                                selectedCategory === category.id
                                                    ? 'bg-[#1F1F6F] border-[#1F1F6F] text-white shadow-md'
                                                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                            }`}
                                            data-oid="mobile-category-button"
                                        >
                                            <span
                                                className="text-sm font-medium"
                                                data-oid="mobile-category-name"
                                            >
                                                {category.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Products Grid */}
                {selectedCity && (
                    <div className="px-4 py-6" data-oid="mobile-products-section">
                        {/* Results Header */}
                        <div
                            className="flex items-center justify-between mb-4"
                            data-oid="mobile-results-header"
                        >
                            <div data-oid="mobile-results-info">
                                <h3
                                    className="text-base font-semibold text-gray-900"
                                    data-oid="mobile-results-title"
                                >
                                    {selectedCategory === 'all' ? 'All Products' : selectedCategory}
                                </h3>
                                <p
                                    className="text-sm text-gray-600"
                                    data-oid="mobile-results-count"
                                >
                                    {displayedProducts.length} products found
                                </p>
                            </div>

                            {/* Simple Sort */}
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFiltersChange({ sortBy: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                data-oid="mobile-sort-select"
                            >
                                <option value="name" data-oid="ptfn00i">
                                    Name A-Z
                                </option>
                                <option value="price-low" data-oid="8htc93-">
                                    Price Low
                                </option>
                                <option value="price-high" data-oid="28e59._">
                                    Price High
                                </option>
                                <option value="newest" data-oid="n6p0lk:">
                                    Newest
                                </option>
                            </select>
                        </div>

                        {/* Mobile Product Grid - 2 columns, smaller cards */}
                        <div className="grid grid-cols-2 gap-3" data-oid="mobile-products-grid">
                            {displayedProducts.map((product: Product) => (
                                <div
                                    key={product._id}
                                    onClick={() =>
                                        (window.location.href = `/product/${product._id}`)
                                    }
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 flex flex-col h-full"
                                    data-oid="mobile-product-card"
                                >
                                    {/* Product Image */}
                                        <div
                                            className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative flex-shrink-0"
                                            data-oid="mobile-product-image"
                                        >
                                            {/* Show actual product image if available */}
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                    data-oid="mobile-product-image"
                                                />
                                            ) : (
                                                <div
                                                    className="text-sm font-semibold text-gray-500 bg-gray-200 rounded-lg px-3 py-2"
                                                    data-oid="mobile-product-icon"
                                                >
                                                    {product.category === 'medications'
                                                        ? 'MED'
                                                        : product.category === 'haircare'
                                                          ? 'HAIR'
                                                          : product.category === 'skincare'
                                                            ? 'SKIN'
                                                            : product.category === 'daily-essentials'
                                                              ? 'DAILY'
                                                              : product.category === 'baby-essentials'
                                                                ? 'BABY'
                                                                : product.category === 'vitamins'
                                                                  ? 'VIT'
                                                                  : product.category === 'sexual-wellness'
                                                                    ? 'WELLNESS'
                                                                    : product.category === 'otc'
                                                                      ? 'OTC'
                                                                      : 'PROD'}
                                                </div>
                                            )}

                                            {/* Badges */}
                                            {product.prescription && (
                                                <div
                                                    className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                                                    data-oid="cnut210"
                                                >
                                                    Rx
                                                </div>
                                            )}
                                            {!product.availability.inStock && (
                                                <div
                                                    className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                                                    data-oid="_x5-sq3"
                                                >
                                                    Out
                                                </div>
                                            )}
                                        </div>

                                    {/* Product Info - Flexible container */}
                                    <div
                                        className="p-3 flex flex-col flex-grow"
                                        data-oid="mobile-product-info"
                                    >
                                        {/* Product Name */}
                                        <h4
                                            className="font-semibold text-gray-900 text-sm mb-2 leading-tight"
                                            data-oid="4cwtppq"
                                        >
                                            {product.name}
                                        </h4>

                                        {/* Description */}
                                        <p
                                            className="text-xs text-gray-600 mb-3 leading-relaxed flex-grow"
                                            data-oid="2no35_v"
                                        >
                                            {product.description}
                                        </p>

                                        {/* Price */}
                                        <div
                                            className="flex items-center justify-between mb-3"
                                            data-oid="qtp4yfj"
                                        >
                                            <div
                                                className="flex items-center space-x-1"
                                                data-oid="pe5lc8b"
                                            >
                                                <span
                                                    className="text-base font-bold text-[#1F1F6F]"
                                                    data-oid="uyt2edc"
                                                >
                                                    {product.price || 0} EGP
                                                </span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span
                                                        className="text-xs text-gray-500 line-through"
                                                        data-oid="ehobjla"
                                                    >
                                                        {product.originalPrice} EGP
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* View Options Button - Always at bottom */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/product/${product._id}`;
                                            }}
                                            disabled={!product.availability.inStock}
                                            className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 mt-auto ${
                                                !product.availability.inStock
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-[#1F1F6F] text-white hover:bg-[#14274E]'
                                            }`}
                                            data-oid="qx7kugn"
                                        >
                                            {!product.availability.inStock
                                                ? 'Out of Stock'
                                                : 'View Options'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Products Message */}
                        {displayedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="mobile-no-products">
                                <div
                                    className="text-lg font-bold text-gray-400 mb-4"
                                    data-oid="mhc_-ir"
                                >
                                    No Products
                                </div>
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="rvqs7yr"
                                >
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-4" data-oid="3.mrzag">
                                    Try selecting a different category or check back later.
                                </p>
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="bg-[#1F1F6F] text-white px-6 py-3 rounded-xl font-semibold"
                                    data-oid="o9e1tfz"
                                >
                                    View All Products
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block" data-oid="sdihdox">
                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                    data-oid="desktop-container"
                >
                    <div
                        className={`flex flex-col gap-6 lg:gap-8 ${
                            selectedCity ? 'lg:flex-row' : ''
                        }`}
                        data-oid="desktop-layout"
                    >
                        {/* Sidebar - Filters - Only show when city is selected */}
                        {selectedCity && (
                            <div className="lg:w-1/4" data-oid="desktop-sidebar">
                                <ProductFilters
                                    filters={filters}
                                    onFiltersChange={handleFiltersChange}
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={setSelectedCategory}
                                    availablePharmacies={availablePharmacies}
                                    data-oid="desktop-filters"
                                />
                            </div>
                        )}

                        {/* Main Content - Products */}
                        <div
                            className={selectedCity ? 'lg:w-3/4' : 'w-full'}
                            data-oid="desktop-main"
                        >
                            {/* Location Prompt - Show when no city is selected */}
                            {!selectedCity && (
                                <div className="mb-8" data-oid="desktop-location-prompt">
                                    <LocationPrompt
                                        title="Select Your City"
                                        description="Choose your city to view available products, pharmacies, and doctors in your area. We only show items that are actually available for delivery to your location."
                                        data-oid="desktop-location"
                                    />
                                </div>
                            )}

                            {/* Results Header - Only show when city is selected */}
                            {selectedCity && (
                                <div
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                                    data-oid="desktop-results-header"
                                >
                                    <div data-oid="desktop-results-info">
                                        <h2
                                            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                            data-oid="desktop-results-title"
                                        >
                                            {selectedCategory === 'all'
                                                ? t('shop.categories.all')
                                                : t(`shop.categories.${selectedCategory}`)}
                                        </h2>
                                        <p
                                            className="text-sm lg:text-base text-gray-600"
                                            data-oid="desktop-results-description"
                                        >
                                            {t('shop.results.showing')} {displayedProducts.length}{' '}
                                            {t('shop.results.of')} {totalCount}{' '}
                                            {t('shop.results.products')}
                                            {selectedCity && (
                                                <span
                                                    className="block text-sm text-gray-500 mt-1"
                                                    data-oid="desktop-results-location"
                                                >
                                                    in {selectedCity.nameEn} •{' '}
                                                    {availablePharmacies.length} pharmacies
                                                    available
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Quick Sort */}
                                    <div
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto"
                                        data-oid="desktop-sort-container"
                                    >
                                        <span
                                            className="text-sm text-gray-600 whitespace-nowrap"
                                            data-oid="desktop-sort-label"
                                        >
                                            {t('shop.filters.sortBy')}:
                                        </span>
                                        <select
                                            value={filters.sortBy}
                                            onChange={(e) =>
                                                handleFiltersChange({ sortBy: e.target.value })
                                            }
                                            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                                            data-oid="desktop-sort-select"
                                        >
                                            <option value="name" data-oid="sort-name">
                                                {t('shop.sortOptions.name')}
                                            </option>
                                            <option value="name-desc" data-oid="sort-name-desc">
                                                {t('shop.sortOptions.nameDesc')}
                                            </option>
                                            <option value="price-low" data-oid="sort-price-low">
                                                {t('shop.sortOptions.priceLow')}
                                            </option>
                                            <option value="price-high" data-oid="sort-price-high">
                                                {t('shop.sortOptions.priceHigh')}
                                            </option>
                                            <option value="rating" data-oid="sort-rating">
                                                {t('shop.sortOptions.rating')}
                                            </option>
                                            <option value="reviews" data-oid="sort-reviews">
                                                {t('shop.sortOptions.reviews')}
                                            </option>
                                            <option value="newest" data-oid="sort-newest">
                                                {t('shop.sortOptions.newest')}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Products Grid - Only show when city is selected */}
                            {selectedCity && (
                                <ProductGrid
                                    products={displayedProducts}
                                    loading={loading}
                                    onAddToCart={handleAddToCart}
                                    onResetFilters={handleResetFilters}
                                    data-oid="desktop-products-grid"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="desktop-footer">
                <ClientOnly data-oid="desktop-footer-client">
                    <Footer data-oid="desktop-footer-component" />
                </ClientOnly>
            </div>
        </div>
    );
}
