'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { ClientOnly } from '@/components/common/ClientOnly';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import {
    filterProducts,
    sortProducts,
    getProductsByPharmacy,
} from '@/lib/data/products';
import { getPharmaciesInEnabledCities, getPharmaciesByCity, Pharmacy } from '@/lib/data/pharmacies';

export default function SexualWellnessPage() {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, adminSettings } = useCity();

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // Initial state for filters
    const [filters, setFilters] = useState({
        categories: [
            { id: 'all', name: 'All Sexual Wellness', count: 0 },
            { id: 'medical', name: 'Medical Products', count: 0 },
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

    const sexualWellnessCategories = ['medical', 'supplements'];

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
                    categories: sexualWellnessCategories,
                    priceRange: filters.priceRange,
                    inStockOnly: filters.inStockOnly,
                    prescriptionOnly: filters.prescriptionOnly,
                    minRating: filters.minRating,
                    pharmacyIds:
                        filters.selectedPharmacies.length > 0 ? filters.selectedPharmacies : undefined,
                });
                console.log(fetchedProducts, 'fetched products')
                
                // Apply the client-side sexual wellness and search filters
                const finalProducts = fetchedProducts.products.filter((product) => {
                    // Sexual wellness specific filter
                    const isSexualWellnessProduct =
                        product.tags.some(
                            (tag) =>
                                tag.includes('sexual-wellness') ||
                                tag.includes('intimate-care') ||
                                tag.includes('lubricant'),
                        ) ||
                        product.name.toLowerCase().includes('lubricant') ||
                        product.name.toLowerCase().includes('intimate') ||
                        product.description.toLowerCase().includes('intimate') ||
                        product.description.toLowerCase().includes('sexual') ||
                        product.description.toLowerCase().includes('wellness');

                    if (!isSexualWellnessProduct) {
                        console.log('not a sexual wellness product')
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
        console.log('Added sexual wellness product to cart:', productId);
    };
    const displayedProducts = sortedProducts;

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="87qec.4"
        >
            <ResponsiveHeader data-oid="t57gl8h" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="09vz2r2">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="categories-fallback" />}
                    data-oid="categories-client"
                >
                    <CategoriesBar data-oid="categories-bar" />
                </ClientOnly>
            </div>

            {/* Mobile Header Section */}
            <div className="md:hidden bg-white border-b border-gray-200" data-oid="mobile-header">
                <div className="px-4 py-4" data-oid="mobile-header-content">
                    <h1 className="text-xl font-bold text-gray-900" data-oid="mobile-title">
                        Sexual Wellness
                    </h1>
                    <p className="text-sm text-gray-600 mt-1" data-oid="mobile-subtitle">
                        {displayedProducts.length} products available
                        {selectedCity && (
                            <span
                                className="block text-xs text-gray-500 mt-1"
                                data-oid="mobile-city"
                            >
                                in {selectedCity.nameEn}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8" data-oid="vk2bn0-">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8" data-oid="-9yypgf">
                    {/* Mobile Filters Toggle */}
                    <div className="md:hidden mb-4" data-oid="mobile-filters-toggle">
                        <button
                            onClick={() => {
                                const filtersEl = document.getElementById('mobile-filters');
                                if (filtersEl) {
                                    filtersEl.classList.toggle('hidden');
                                }
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50"
                            data-oid="filters-toggle-btn"
                        >
                            <span className="flex items-center" data-oid="filters-toggle-text">
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="filter-icon"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                                        data-oid="-:zlt56"
                                    />
                                </svg>
                                Filters & Sort
                            </span>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="chevron-icon"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                    data-oid="fm-dkdg"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Sidebar - Filters */}
                    <div className="lg:w-1/4" data-oid="1uelbq3">
                        <div
                            id="mobile-filters"
                            className="hidden md:block"
                            data-oid="filters-container"
                        >
                            <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedCategory="all"
                                onCategoryChange={() => {}}
                                availablePharmacies={availablePharmacies}
                                data-oid="hb0dbd8"
                            />
                        </div>
                    </div>

                    {/* Main Content - Products */}
                    <div className="lg:w-3/4" data-oid="ysue2m-">
                        {/* Desktop Results Header */}
                        <div
                            className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                            data-oid="3-03m8u"
                        >
                            <div data-oid="-j5ea_5">
                                <h2
                                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="ucpb:er"
                                >
                                    Sexual Wellness Products
                                </h2>
                                <p
                                    className="text-sm lg:text-base text-gray-600"
                                    data-oid="cflxz0v"
                                >
                                    Showing {displayedProducts.length} of {sortedProducts.length}{' '}
                                    wellness products
                                    {selectedCity && (
                                        <span
                                            className="block text-sm text-gray-500 mt-1"
                                            data-oid="sj:wm_4"
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
                                data-oid="qelvbtb"
                            >
                                <span
                                    className="text-sm text-gray-600 whitespace-nowrap"
                                    data-oid="7-vyx8m"
                                >
                                    Sort by:
                                </span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFiltersChange({ sortBy: e.target.value })
                                    }
                                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm"
                                    data-oid="-p136t0"
                                >
                                    <option value="name" data-oid="652a76p">
                                        Name A-Z
                                    </option>
                                    <option value="name-desc" data-oid="ex6-jo9">
                                        Name Z-A
                                    </option>
                                    <option value="price-low" data-oid="zykpm1v">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high" data-oid="jnuslz6">
                                        Price: High to Low
                                    </option>
                                    <option value="rating" data-oid=":ohwh28">
                                        Highest Rated
                                    </option>
                                    <option value="reviews" data-oid="upcdx62">
                                        Most Reviews
                                    </option>
                                    <option value="newest" data-oid="nyb0rqk">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm bg-white"
                                data-oid="mobile-sort-select"
                            >
                                <option value="name" data-oid="-u4vs:w">
                                    Name A-Z
                                </option>
                                <option value="name-desc" data-oid="k4o2c5d">
                                    Name Z-A
                                </option>
                                <option value="price-low" data-oid="cfhogzx">
                                    Price: Low to High
                                </option>
                                <option value="price-high" data-oid="4dl_i09">
                                    Price: High to Low
                                </option>
                                <option value="rating" data-oid="l4amf5b">
                                    Highest Rated
                                </option>
                                <option value="reviews" data-oid="9:yzb5b">
                                    Most Reviews
                                </option>
                                <option value="newest" data-oid="d-l9th7">
                                    Newest First
                                </option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid
                            products={displayedProducts}
                            loading={loading}
                            onAddToCart={handleAddToCart}
                            data-oid="pn2hh9:"
                        />

                        {/* No Products Found */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="no-products">
                                <div className="text-6xl mb-4" data-oid="no-products-icon">
                                    ❤️
                                </div>
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="no-products-title"
                                >
                                    No wellness products found
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="no-products-desc">
                                    We couldn{"'"}t find any sexual wellness products in your selected
                                    area.
                                </p>
                                <button
                                    onClick={() => (window.location.href = '/shop')}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
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
                    <Footer data-oid="3bd53a_" />
                </ClientOnly>
            </div>
        </div>
    );
}
