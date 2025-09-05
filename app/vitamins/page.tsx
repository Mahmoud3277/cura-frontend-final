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
import { useIsMobile } from '@/hooks/use-mobile';
import {
    filterProducts,
    sortProducts,
    getProductsByPharmacy,
} from '@/lib/data/products';
import { getPharmaciesInEnabledCities, getPharmaciesByCity, Pharmacy } from '@/lib/data/pharmacies';

export default function VitaminsPage() {
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
            { id: 'all', name: 'All Vitamins', count: 0 },
            { id: 'vitamins', name: 'Vitamins', count: 0 },
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

    const vitaminCategories = ['vitamins', 'supplements'];

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
                    categories: vitaminCategories,
                    priceRange: filters.priceRange,
                    inStockOnly: filters.inStockOnly,
                    prescriptionOnly: filters.prescriptionOnly,
                    minRating: filters.minRating,
                    pharmacyIds:
                        filters.selectedPharmacies.length > 0 ? filters.selectedPharmacies : undefined,
                });
                console.log(fetchedProducts, 'fetched products')
                
                // Apply the client-side vitamins and search filters
                const finalProducts = fetchedProducts.products.filter((product) => {
                    // Vitamins specific filter
                    const isVitaminProduct = vitaminCategories.includes(product.category);

                    if (!isVitaminProduct) {
                        console.log('not a vitamin product')
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
        console.log('Added vitamin to cart:', productId);
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="iym177_"
        >
            <ResponsiveHeader data-oid="2ebwm40" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="6zsy_5j">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="vz8qntf" />}
                    data-oid="7d50.n7"
                >
                    <CategoriesBar data-oid="k6m.faw" />
                </ClientOnly>
            </div>

            {/* Mobile Header Section */}
            <div className="md:hidden bg-white border-b border-gray-200" data-oid="mobile-header">
                <div className="px-4 py-3" data-oid="mobile-header-content">
                    <h1 className="text-lg font-bold text-gray-900" data-oid="mobile-title">
                        Vitamins & Supplements
                    </h1>
                    <p className="text-sm text-gray-600 mt-1" data-oid="mobile-subtitle">
                        {filteredProducts.length} products available
                        {selectedCity && (
                            <span className="text-xs text-gray-500 ml-1" data-oid="mobile-city">
                                in {selectedCity.nameEn}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8" data-oid="v3-hk7t">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8" data-oid="lqk5-7g">
                    {/* Sidebar - Filters - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:w-1/4" data-oid="plm0kwh">
                        <div id="desktop-filters" className="block" data-oid="filters-container">
                            <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedCategory="all"
                                onCategoryChange={() => {}}
                                availablePharmacies={availablePharmacies}
                                data-oid="cwu5yuc"
                            />
                        </div>
                    </div>

                    {/* Main Content - Products */}
                    <div className="w-full lg:w-3/4" data-oid="z869:s-">
                        {/* Desktop Results Header */}
                        <div
                            className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                            data-oid="6f031tf"
                        >
                            <div data-oid="4ys4xm.">
                                <h2
                                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="hnt:hvz"
                                >
                                    Vitamins & Supplements
                                </h2>
                                <p
                                    className="text-sm lg:text-base text-gray-600"
                                    data-oid="ilvvu9d"
                                >
                                    Showing {sortedProducts.length} of {sortedProducts.length}{' '}
                                    vitamins & supplements
                                    {selectedCity && (
                                        <span
                                            className="block text-sm text-gray-500 mt-1"
                                            data-oid="jiw2_3z"
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
                                data-oid="m5qvdgl"
                            >
                                <span
                                    className="text-sm text-gray-600 whitespace-nowrap"
                                    data-oid="slfx4nn"
                                >
                                    Sort by:
                                </span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFiltersChange({ sortBy: e.target.value })
                                    }
                                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    data-oid="r7sae0a"
                                >
                                    <option value="name" data-oid=".-due8x">
                                        Name A-Z
                                    </option>
                                    <option value="name-desc" data-oid="0vkwxzh">
                                        Name Z-A
                                    </option>
                                    <option value="price-low" data-oid="b_btf9a">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high" data-oid="5hszzjv">
                                        Price: High to Low
                                    </option>
                                    <option value="rating" data-oid="ry538xs">
                                        Highest Rated
                                    </option>
                                    <option value="reviews" data-oid="p9w7glf">
                                        Most Reviews
                                    </option>
                                    <option value="newest" data-oid=":cv7tef">
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white shadow-sm"
                                data-oid="mobile-sort-select"
                            >
                                <option value="name" data-oid="qnolk7y">
                                    Name A-Z
                                </option>
                                <option value="name-desc" data-oid="gc0hxx_">
                                    Name Z-A
                                </option>
                                <option value="price-low" data-oid="27jd640">
                                    Price: Low to High
                                </option>
                                <option value="price-high" data-oid="ch_imdn">
                                    Price: High to Low
                                </option>
                                <option value="rating" data-oid="u72fh0d">
                                    Highest Rated
                                </option>
                                <option value="reviews" data-oid="we6.8h4">
                                    Most Reviews
                                </option>
                                <option value="newest" data-oid="eg3qxc:">
                                    Newest First
                                </option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid
                            products={sortedProducts}
                            loading={loading}
                            onAddToCart={handleAddToCart}
                            isMobile={isMobile}
                            data-oid="3eks2hi"
                        />

                        {/* No Products Found */}
                        {!loading && sortedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="4ukmwwf">
                                <div className="text-6xl mb-4" data-oid="bda65hw">
                                    💊
                                </div>
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="2:ptmv."
                                >
                                    No vitamins found
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="7yq.xtk">
                                    We couldn{"'"}t find any vitamins or supplements in your selected
                                    area.
                                </p>
                                <button
                                    onClick={() => (window.location.href = '/shop')}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                                    data-oid="aku8j5_"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="0f856ec">
                <ClientOnly data-oid="50rz2gc">
                    <Footer data-oid="htkc7iz" />
                </ClientOnly>
            </div>
        </div>
    );
}