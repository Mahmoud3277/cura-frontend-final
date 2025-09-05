'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { ClientOnly } from '@/components/common/ClientOnly';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    filterProducts,
    sortProducts,
    getProductsByPharmacy,
} from '@/lib/data/products';
import { getPharmaciesInEnabledCities, getPharmaciesByCity, Pharmacy } from '@/lib/data/pharmacies';

export default function DailyEssentialsPage() {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, adminSettings } = useCity();
    const isMobile = useIsMobile();

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // Initial state for filters
    const [filters, setFilters] = useState({
        categories: [
            { id: 'all', name: 'All Daily Essentials', count: 0 },
            { id: 'otc', name: 'Over-the-Counter', count: 0 },
            { id: 'medical', name: 'Medical Devices', count: 0 },
            { id: 'supplements', name: 'Supplements', count: 0 },
        ],
        priceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        inStockOnly: false,
        prescriptionOnly: false,
        minRating: 0,
        selectedCities: [] as string[],
        selectedPharmacies: [] as string[],
    });

    const dailyEssentialsCategories = ['otc', 'medical', 'supplements'];

    // Memoize the available pharmacies for efficiency
    const availablePharmacies = useMemo(async() => {
        let pharmacies: Pharmacy[] = [];
        if (selectedCity) {
            pharmacies = await getPharmaciesByCity(selectedCity.id);
        } else {
            pharmacies = await getPharmaciesInEnabledCities(adminSettings.enabledCityIds);
        }
        console.log(pharmacies)
        return pharmacies.map((pharmacy) => ({
            id: pharmacy.id,
            name: pharmacy.name,
            cityName: pharmacy.cityName,
            count: getProductsByPharmacy(pharmacy.id).length,
        }));
    }, [selectedCity, adminSettings.enabledCityIds]);

    // Use a single useEffect hook to fetch and filter products
    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            setLoading(true);
            try {
                // Fetch products based on the current filters
                const fetchedProducts = await filterProducts({
                    cityIds: selectedCity ? [selectedCity.id] : adminSettings.enabledCityIds,
                    categories: dailyEssentialsCategories,
                    priceRange: filters.priceRange,
                    inStockOnly: filters.inStockOnly,
                    prescriptionOnly: filters.prescriptionOnly,
                    minRating: filters.minRating,
                    pharmacyIds:
                        filters.selectedPharmacies.length > 0 ? filters.selectedPharmacies : undefined,
                });
                console.log(fetchedProducts, 'fetched products')
                
                // Apply the client-side daily essentials and search filters
                const finalProducts = fetchedProducts.products.filter((product) => {
                    // Daily essentials specific filter
                    const isDailyEssentialProduct = dailyEssentialsCategories.includes(product.category);

                    if (!isDailyEssentialProduct) {
                        console.log('not a daily essential product')
                        return false;
                    }

                    // Additional search filter
                    if (searchQuery === '') return true;
                    
                    const searchTerm = searchQuery.toLowerCase();
                    return (
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm) ||
                        product.pharmacy.toLowerCase().includes(searchTerm) ||
                        product.cityName.toLowerCase().includes(searchTerm) ||
                        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
                    );
                });

                setFilteredProducts(finalProducts);
            } catch (error) {
                console.error('Failed to fetch and filter products:', error);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilterProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, filters, selectedCity, adminSettings.enabledCityIds]);

    // Sort products using useMemo to avoid re-sorting on every render
    const sortedProducts = useMemo(() => {
        return sortProducts(filteredProducts, filters.sortBy);
    }, [filteredProducts, filters.sortBy]);

    const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleAddToCart = (productId: string) => {
        console.log('Added daily essential to cart:', productId);
    };

    const displayedProducts = sortedProducts;

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="cf4ll4q"
        >
            <ResponsiveHeader data-oid="16qm8p2" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="wz.6oqc">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="categories-fallback" />}
                    data-oid="categories-client"
                >
                    <CategoriesBar data-oid="categories-bar" />
                </ClientOnly>
            </div>

            {/* Mobile Header Section */}
            <div className="md:hidden bg-white border-b border-gray-200" data-oid="mobile-header">
                <div className="px-4 py-3" data-oid="mobile-header-content">
                    <h1 className="text-lg font-bold text-gray-900" data-oid="mobile-title">
                        Daily Essentials
                    </h1>
                    <p className="text-sm text-gray-600 mt-1" data-oid="mobile-subtitle">
                        {displayedProducts.length} products available
                        {selectedCity && (
                            <span className="text-xs text-gray-500 ml-1" data-oid="mobile-city">
                                in {selectedCity.nameEn}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8" data-oid="a2.:ikh">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8" data-oid="d32cfnr">
                    {/* Sidebar - Filters - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:w-1/4" data-oid="uwzf6c0">
                        <div id="desktop-filters" className="block" data-oid="filters-container">
                            <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedCategory="all"
                                onCategoryChange={() => {}}
                                availablePharmacies={availablePharmacies}
                                data-oid="0j8ka7-"
                            />
                        </div>
                    </div>

                    {/* Main Content - Products */}
                    <div className="w-full lg:w-3/4" data-oid="v1g-9h9">
                        {/* Desktop Results Header */}
                        <div
                            className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                            data-oid="0odpyl8"
                        >
                            <div data-oid="9z.ypyg">
                                <h2
                                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="xj68qnj"
                                >
                                    Daily Essentials
                                </h2>
                                <p
                                    className="text-sm lg:text-base text-gray-600"
                                    data-oid="x21mhjo"
                                >
                                    Showing {displayedProducts.length} of {sortedProducts.length}{' '}
                                    daily essentials
                                    {selectedCity && (
                                        <span
                                            className="block text-sm text-gray-500 mt-1"
                                            data-oid="rw-cca4"
                                        >
                                            in {selectedCity.nameEn} • {availablePharmacies.length}{' '}
                                            pharmacies available
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Quick Sort */}
                            <div
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto"
                                data-oid="cm6:wd."
                            >
                                <span
                                    className="text-sm text-gray-600 whitespace-nowrap"
                                    data-oid="vv8xu0i"
                                >
                                    Sort by:
                                </span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFiltersChange({ sortBy: e.target.value })
                                    }
                                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm"
                                    data-oid="uky2g_0"
                                >
                                    <option value="name" data-oid="fh2xizx">
                                        Name A-Z
                                    </option>
                                    <option value="name-desc" data-oid="2edc7np">
                                        Name Z-A
                                    </option>
                                    <option value="price-low" data-oid="h12jwih">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high" data-oid="wvrbqa2">
                                        Price: High to Low
                                    </option>
                                    <option value="rating" data-oid="nv4ltva">
                                        Highest Rated
                                    </option>
                                    <option value="reviews" data-oid="i:-3ss7">
                                        Most Reviews
                                    </option>
                                    <option value="newest" data-oid=":9siyc8">
                                        Newest First
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Sort */}
                        <div className="md:hidden mb-4" data-oid="mobile-sort">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFiltersChange({ sortBy: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm bg-white shadow-sm"
                                data-oid="mobile-sort-select"
                            >
                                <option value="name" data-oid="._gv0mi">
                                    Name A-Z
                                </option>
                                <option value="name-desc" data-oid="6zj7klp">
                                    Name Z-A
                                </option>
                                <option value="price-low" data-oid="g.57qiq">
                                    Price: Low to High
                                </option>
                                <option value="price-high" data-oid="9uu92y7">
                                    Price: High to Low
                                </option>
                                <option value="rating" data-oid=".x:60ea">
                                    Highest Rated
                                </option>
                                <option value="reviews" data-oid="8fdgcj9">
                                    Most Reviews
                                </option>
                                <option value="newest" data-oid="oz-3bfv">
                                    Newest First
                                </option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid
                            products={displayedProducts}
                            loading={loading}
                            onAddToCart={handleAddToCart}
                            isMobile={isMobile}
                            data-oid="cy1d4:l"
                        />

                        {/* No Products Found */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="no-products">
                                <div className="text-6xl mb-4" data-oid="no-products-icon">
                                    🏠
                                </div>
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="no-products-title"
                                >
                                    No daily essentials found
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="no-products-desc">
                                    We couldn{"'"}t find any daily essentials in your selected area.
                                </p>
                                <button
                                    onClick={() => (window.location.href = '/shop')}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                                    data-oid="browse-all-btn"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="desktop-footer">
                <ClientOnly data-oid="footer-client">
                    <Footer data-oid="yn7.ldv" />
                </ClientOnly>
            </div>
        </div>
    );
}
