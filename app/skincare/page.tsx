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

export default function SkincarePage() {
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
            { id: 'all', name: 'All Skincare', count: 0 },
            { id: 'skincare', name: 'Skincare Products', count: 0 },
        ],
        priceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        inStockOnly: false,
        prescriptionOnly: false,
        minRating: 0,
        selectedCities: [] as string[],
        selectedPharmacies: [] as string[],
    });

    const skincareCategories = ['skincare'];

    // Memoize the available pharmacies for efficiency
    const availablePharmacies = useMemo(async() => {
        let pharmacies: Pharmacy[] = [];
        if (selectedCity) {
            pharmacies = await getPharmaciesByCity(selectedCity.id);
        } else {
            pharmacies = await getPharmaciesInEnabledCities(adminSettings.enabledCityIds);
        }
        console.log(pharmacies, 'from skincare')
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
                    categories: skincareCategories,
                    priceRange: filters.priceRange,
                    inStockOnly: filters.inStockOnly,
                    prescriptionOnly: filters.prescriptionOnly,
                    minRating: filters.minRating,
                    pharmacyIds:
                        filters.selectedPharmacies.length > 0 ? filters.selectedPharmacies : undefined,
                });
                console.log(fetchedProducts, 'fetched products')
                
                // Apply the client-side skincare and search filters
                const finalProducts = fetchedProducts.products.filter((product) => {
                    // Skincare specific filter
                    const isSkincareProduct = skincareCategories.includes(product.category);

                    if (!isSkincareProduct) {
                        console.log('not a skincare product')
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
        console.log('Added skincare product to cart:', productId);
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid=".e50j3z"
        >
            <ResponsiveHeader data-oid="0r3:q8k" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="-h9g2jk">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="y-77bk8" />}
                    data-oid="-7:vo.p"
                >
                    <CategoriesBar data-oid="51_c43i" />
                </ClientOnly>
            </div>

            {/* Mobile Header Section */}
            <div className="md:hidden bg-white border-b border-gray-200" data-oid="mobile-header">
                <div className="px-4 py-3" data-oid="mobile-header-content">
                    <h1 className="text-lg font-bold text-gray-900" data-oid="mobile-title">
                        Skin Care Products
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8" data-oid="6y0nf5k">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8" data-oid="fw5lpdy">
                    {/* Sidebar - Filters - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:w-1/4" data-oid="q_9hva8">
                        <div id="desktop-filters" className="block" data-oid="filters-container">
                            <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedCategory="all"
                                onCategoryChange={() => {}}
                                availablePharmacies={availablePharmacies}
                                data-oid="eozyd9y"
                            />
                        </div>
                    </div>

                    {/* Main Content - Products */}
                    <div className="w-full lg:w-3/4" data-oid="v4w2g71">
                        {/* Desktop Results Header */}
                        <div
                            className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                            data-oid="toim:ta"
                        >
                            <div data-oid="6pja9ed">
                                <h2
                                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="u_3v7e4"
                                >
                                    Skin Care Products
                                </h2>
                                <p
                                    className="text-sm lg:text-base text-gray-600"
                                    data-oid="v1ma5lx"
                                >
                                    Showing {sortedProducts.length} of {sortedProducts.length}{' '}
                                    skincare products
                                    {selectedCity && (
                                        <span
                                            className="block text-sm text-gray-500 mt-1"
                                            data-oid="dz9oa2d"
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
                                data-oid="9b4qhnj"
                            >
                                <span
                                    className="text-sm text-gray-600 whitespace-nowrap"
                                    data-oid="z0iab6g"
                                >
                                    Sort by:
                                </span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFiltersChange({ sortBy: e.target.value })
                                    }
                                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-pink-600 text-sm"
                                    data-oid="nbs.t02"
                                >
                                    <option value="name" data-oid="vimv-23">
                                        Name A-Z
                                    </option>
                                    <option value="name-desc" data-oid="rh1p-2m">
                                        Name Z-A
                                    </option>
                                    <option value="price-low" data-oid="bb588ba">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high" data-oid=".s1h5vf">
                                        Price: High to Low
                                    </option>
                                    <option value="rating" data-oid="as7-mak">
                                        Highest Rated
                                    </option>
                                    <option value="reviews" data-oid="q-i5ms8">
                                        Most Reviews
                                    </option>
                                    <option value="newest" data-oid="49k7_3k">
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-600 focus:border-pink-600 text-sm bg-white shadow-sm"
                                data-oid="mobile-sort-select"
                            >
                                <option value="name" data-oid="35n3etc">
                                    Name A-Z
                                </option>
                                <option value="name-desc" data-oid=".rp9mn0">
                                    Name Z-A
                                </option>
                                <option value="price-low" data-oid="0wvqml.">
                                    Price: Low to High
                                </option>
                                <option value="price-high" data-oid="zgebwt9">
                                    Price: High to Low
                                </option>
                                <option value="rating" data-oid=":75ynnq">
                                    Highest Rated
                                </option>
                                <option value="reviews" data-oid="t16l7ec">
                                    Most Reviews
                                </option>
                                <option value="newest" data-oid="f-ad5tv">
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
                            data-oid="km46l74"
                        />

                        {/* No Products Found */}
                        {!loading && sortedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="no-products">
                                <div className="text-6xl mb-4" data-oid="no-products-icon">
                                    🧴
                                </div>
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="no-products-title"
                                >
                                    No skincare products found
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="no-products-desc">
                                    We couldn{"'"}t find any skincare products in your selected area.
                                </p>
                                <button
                                    onClick={() => (window.location.href = '/shop')}
                                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
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
            <div className="hidden md:block" data-oid="2h6.ng5">
                <ClientOnly data-oid="k7--8xy">
                    <Footer data-oid=":zmi.xy" />
                </ClientOnly>
            </div>
        </div>
    );
}