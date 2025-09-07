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

export default function HaircarePage() {
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
            { id: 'all', name: 'All Hair Care', count: 0 },
            { id: 'skincare', name: 'Hair Care Products', count: 0 },
        ],
        priceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        inStockOnly: false,
        prescriptionOnly: false,
        minRating: 0,
        selectedCities: [] as string[],
        selectedPharmacies: [] as string[],
    });

    const haircareCategories = ['hair'];

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
                const fetchedProducts = await filterProducts({});
                console.log(fetchedProducts, 'fetched products')
                // Apply the client-side hair care and search filters
                const finalProducts = fetchedProducts.products.filter((product) => {
                    // Hair care specific filter
                    const isHairCareProduct =
                        product.tags.some((tag) => tag.includes('hair')) ||
                        product.name.toLowerCase().includes('hair') ||
                        product.name.toLowerCase().includes('shampoo') ||
                        product.name.toLowerCase().includes('dandruff') ||
                        product.description.toLowerCase().includes('hair') ||
                        product.description.toLowerCase().includes('scalp');

                    if (!isHairCareProduct) {
                        console.log('not a hair product')
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
        console.log('Added hair care product to cart:', productId);
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="i_n14f-"
        >
            <ResponsiveHeader data-oid="qn:82kw" />
            <div className="hidden md:block" data-oid="m1-dtau">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="categories-fallback" />}
                    data-oid="categories-client"
                >
                    <CategoriesBar data-oid="categories-bar" />
                </ClientOnly>
            </div>
            <div className="md:hidden bg-white border-b border-gray-200" data-oid="mobile-header">
                <div className="px-4 py-3" data-oid="mobile-header-content">
                    <h1 className="text-lg font-bold text-gray-900" data-oid="mobile-title">
                        Hair Care Products
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8" data-oid="uy9b4ju">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8" data-oid="c6splca">
                    <div className="hidden lg:block lg:w-1/4" data-oid="1o0lih2">
                        <div id="desktop-filters" className="block" data-oid="filters-container">
                            <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedCategory="all"
                                onCategoryChange={() => {}}
                                availablePharmacies={availablePharmacies}
                                data-oid="qfo.me3"
                            />
                        </div>
                    </div>
                    <div className="w-full lg:w-3/4" data-oid="h-a4:vl">
                        <div
                            className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                            data-oid="vsik-u1"
                        >
                            <div data-oid="ur.kh7_">
                                <h2
                                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="570:vc0"
                                >
                                    Hair Care Products
                                </h2>
                                <p
                                    className="text-sm lg:text-base text-gray-600"
                                    data-oid="er:rc56"
                                >
                                    Showing {sortedProducts.length} of {sortedProducts.length}{' '}
                                    hair care products
                                    {selectedCity && (
                                        <span
                                            className="block text-sm text-gray-500 mt-1"
                                            data-oid="-n3j58."
                                        >
                                            in {selectedCity.nameEn} • {availablePharmacies.length}{' '}
                                            pharmacies available
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto"
                                data-oid="p.ohbk7"
                            >
                                <span
                                    className="text-sm text-gray-600 whitespace-nowrap"
                                    data-oid="kiagh08"
                                >
                                    Sort by:
                                </span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFiltersChange({ sortBy: e.target.value })
                                    }
                                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-sm"
                                    data-oid="uw:9b6n"
                                >
                                    <option value="name" data-oid=":hj.o8.">Name A-Z</option>
                                    <option value="name-desc" data-oid=".m8vteh">Name Z-A</option>
                                    <option value="price-low" data-oid="_k_:r11">Price: Low to High</option>
                                    <option value="price-high" data-oid="xg9oc.u">Price: High to Low</option>
                                    <option value="rating" data-oid="0bw:tt6">Highest Rated</option>
                                    <option value="reviews" data-oid="y82w.20">Most Reviews</option>
                                    <option value="newest" data-oid="6ehzg.d">Newest First</option>
                                </select>
                            </div>
                        </div>
                        <div className="md:hidden mb-4" data-oid="mobile-sort">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFiltersChange({ sortBy: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-sm bg-white shadow-sm"
                                data-oid="mobile-sort-select"
                            >
                                <option value="name" data-oid="1s8wqip">Name A-Z</option>
                                <option value="name-desc" data-oid="hvy:l07">Name Z-A</option>
                                <option value="price-low" data-oid="d3kjhgx">Price: Low to High</option>
                                <option value="price-high" data-oid="48h1fm-">Price: High to Low</option>
                                <option value="rating" data-oid="8li5rgf">Highest Rated</option>
                                <option value="reviews" data-oid="36b7-ps">Most Reviews</option>
                                <option value="newest" data-oid="uakxkam">Newest First</option>
                            </select>
                        </div>
                        <ProductGrid
                            products={sortedProducts}
                            loading={loading}
                            onAddToCart={handleAddToCart}
                            isMobile={isMobile}
                            data-oid="4e.l1.s"
                        />
                        {!loading && sortedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="no-products">
                                <div className="text-6xl mb-4" data-oid="no-products-icon">
                                    💇‍♀️
                                </div>
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="no-products-title"
                                >
                                    No hair care products found
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="no-products-desc">
                                    We couldn{"'"}t find any hair care products in your selected area.
                                </p>
                                <button
                                    onClick={() => (window.location.href = '/shop')}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                                    data-oid="browse-all-btn"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="hidden md:block" data-oid="desktop-footer">
                <ClientOnly data-oid="footer-client">
                    <Footer data-oid="i3_1bof" />
                </ClientOnly>
            </div>
        </div>
    );
}