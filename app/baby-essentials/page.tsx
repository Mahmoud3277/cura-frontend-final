'use client';

import React, { useState, useEffect , useMemo} from 'react';
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

export default function BabyEssentialsPage() {
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
            { id: 'all', name: 'All Baby Products', count: 0 },
            { id: 'baby_care', name: 'Baby Essentials', count: 0 },
        ],
        priceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        inStockOnly: false,
        prescriptionOnly: false,
        minRating: 0,
        selectedCities: [] as string[],
        selectedPharmacies: [] as string[],
    });

    const babyEssentialsCategories = ['baby_care'];

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
                
                // Apply the client-side baby essentials and search filters
                const finalProducts = fetchedProducts.products.filter((product) => {
                    // Baby essentials specific filter
                    const isBabyProduct = babyEssentialsCategories.includes(product.category);

                    if (!isBabyProduct) {
                        console.log('not a baby product')
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
        console.log('Added baby product to cart:', productId);
    };
    const displayedProducts = sortedProducts;

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="a8v-:2c"
        >
            <ResponsiveHeader data-oid="7-vldn2" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="ut.pmv2">
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
                        Baby Essentials
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8" data-oid=".c4hg42">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8" data-oid="h6ls:6b">
                    {/* Sidebar - Filters - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:w-1/4" data-oid="_8ka28b">
                        <div id="desktop-filters" className="block" data-oid="filters-container">
                            <ProductFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                selectedCategory="all"
                                onCategoryChange={() => {}}
                                availablePharmacies={availablePharmacies}
                                data-oid="fm-4b3p"
                            />
                        </div>
                    </div>

                    {/* Main Content - Products */}
                    <div className="w-full lg:w-3/4" data-oid="p1x0sgf">
                        {/* Desktop Results Header */}
                        <div
                            className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                            data-oid="n899fpl"
                        >
                            <div data-oid="-5dwsss">
                                <h2
                                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="7o6bg4q"
                                >
                                    Baby Essentials
                                </h2>
                                <p
                                    className="text-sm lg:text-base text-gray-600"
                                    data-oid=":znue2y"
                                >
                                    Showing {displayedProducts.length} of {sortedProducts.length}{' '}
                                    baby products
                                    {selectedCity && (
                                        <span
                                            className="block text-sm text-gray-500 mt-1"
                                            data-oid="r4_-yjb"
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
                                data-oid=":6q6:rl"
                            >
                                <span
                                    className="text-sm text-gray-600 whitespace-nowrap"
                                    data-oid=":dgjx-5"
                                >
                                    Sort by:
                                </span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFiltersChange({ sortBy: e.target.value })
                                    }
                                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    data-oid="uqiqcu7"
                                >
                                    <option value="name" data-oid="ig:7880">
                                        Name A-Z
                                    </option>
                                    <option value="name-desc" data-oid="kb69m1q">
                                        Name Z-A
                                    </option>
                                    <option value="price-low" data-oid="fp-dvju">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high" data-oid="q5.rl.z">
                                        Price: High to Low
                                    </option>
                                    <option value="rating" data-oid="joemxxa">
                                        Highest Rated
                                    </option>
                                    <option value="reviews" data-oid="sl2l2af">
                                        Most Reviews
                                    </option>
                                    <option value="newest" data-oid="9gp2ywo">
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                                data-oid="mobile-sort-select"
                            >
                                <option value="name" data-oid="ywfvyn_">
                                    Name A-Z
                                </option>
                                <option value="name-desc" data-oid="t3w:1u:">
                                    Name Z-A
                                </option>
                                <option value="price-low" data-oid="urby71w">
                                    Price: Low to High
                                </option>
                                <option value="price-high" data-oid="cu.bzoj">
                                    Price: High to Low
                                </option>
                                <option value="rating" data-oid="wf.wuk5">
                                    Highest Rated
                                </option>
                                <option value="reviews" data-oid="6-fginz">
                                    Most Reviews
                                </option>
                                <option value="newest" data-oid="zk7u_nu">
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
                            data-oid="1clt1qr"
                        />

                        {/* No Products Found */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="-zcfjim">
                                <div className="text-6xl mb-4" data-oid="1jstru6">
                                    👶
                                </div>
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="mqa4gr4"
                                >
                                    No baby products found
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="nzf__ee">
                                    We couldn{"'"}t find any baby products in your selected area.
                                </p>
                                <button
                                    onClick={() => (window.location.href = '/shop')}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                    data-oid="cwsqfq-"
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
                    <Footer data-oid=":bqky2s" />
                </ClientOnly>
            </div>
        </div>
    );
}
