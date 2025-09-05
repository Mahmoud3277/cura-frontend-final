'use client';
import React, { useState } from 'react';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { ClientOnly } from '@/components/common/ClientOnly';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { LocationPrompt } from '@/components/common/LocationPrompt';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import {
    products,
    filterProducts,
    sortProducts,
    Product,
    getProductsInEnabledCities,
    getProductsByCity,
    getProductsByPharmacy,
    getInStockProductsByPharmacy,
} from '@/lib/data/products';
import { getPharmaciesInEnabledCities, getPharmaciesByCity, Pharmacy } from '@/lib/data/pharmacies';

export default function ShopPage() {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, availableCities, adminSettings } = useCity();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        categories: [
            { id: 'all', name: 'All Products', count: 1200 },
            { id: 'medications', name: 'Medications', count: 500 },
            { id: 'haircare', name: 'Hair Care', count: 200 },
            { id: 'skincare', name: 'Skin Care', count: 300 },
            { id: 'daily-essentials', name: 'Daily Essentials', count: 250 },
            { id: 'baby-essentials', name: 'Baby Essentials', count: 150 },
            { id: 'vitamins', name: 'Vitamins', count: 180 },
            { id: 'sexual-wellness', name: 'Sexual Wellness', count: 120 },
            { id: 'otc', name: 'OTC', count: 300 },
        ],

        priceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        inStockOnly: false,
        prescriptionOnly: false,
        minRating: 0,
        selectedCities: [] as string[],
        selectedPharmacies: [] as string[],
    });

    // Get available pharmacies based on customer's selected location - ONLY show pharmacies with in-stock products
    const availablePharmacies: Array<{
        id: string;
        name: string;
        cityName: string;
        count: number;
    }> = React.useMemo(() => {
        let pharmacies: Pharmacy[] = [];
        if (selectedCity) {
            // If a city is selected, show only pharmacies from that specific city
            pharmacies = getPharmaciesByCity(selectedCity.id);
        } else {
            // If no city selected, don't show any pharmacies (customer must select location)
            pharmacies = [];
        }

        // Only include pharmacies that have at least one in-stock product for the customer's location
        return pharmacies
            .map((pharmacy) => {
                const inStockProducts = getInStockProductsByPharmacy(pharmacy.id);
                return {
                    id: pharmacy.id,
                    name: pharmacy.name,
                    cityName: pharmacy.cityName,
                    count: inStockProducts.length,
                };
            })
            .filter((pharmacy) => pharmacy.count > 0); // Only show pharmacies with in-stock products
    }, [selectedCity]);

    // Get products based on customer's selected location - STRICT FILTERING
    const allProducts: Product[] = React.useMemo(() => {
        if (selectedCity) {
            // If city is selected, only show products from that specific city
            return getProductsByCity(selectedCity.id);
        } else {
            // If no city selected, show empty array (customer must select location first)
            return [];
        }
    }, [selectedCity]);

    // Apply all filters - STRICT CITY-BASED FILTERING
    const filteredProducts = React.useMemo(() => {
        // If no city selected, return empty array
        if (!selectedCity) {
            return [];
        }

        return filterProducts({
            cityIds: [selectedCity.id], // ONLY products from selected city
            categories: selectedCategory === 'all' ? undefined : [selectedCategory],
            priceRange: filters.priceRange,
            inStockOnly: filters.inStockOnly,
            prescriptionOnly: filters.prescriptionOnly,
            minRating: filters.minRating,
            pharmacyIds:
                filters.selectedPharmacies.length > 0 ? filters.selectedPharmacies : undefined,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allProducts, selectedCategory, searchQuery, filters, selectedCity]);

    // Sort products
    const sortedProducts = React.useMemo(() => {
        return sortProducts(filteredProducts, filters.sortBy);
    }, [filteredProducts, filters.sortBy]);

    const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleAddToCart = (productId: number) => {
        // Simulate adding to cart
        console.log('Added product to cart:', productId);
        // Here you would typically update cart state or make an API call
    };

    const handleResetFilters = () => {
        // Reset all filters to default values
        setSelectedCategory('all');
        setSearchQuery('');
        setFilters({
            categories: [
                { id: 'all', name: 'All Products', count: 1200 },
                { id: 'medications', name: 'Medications', count: 500 },
                { id: 'haircare', name: 'Hair Care', count: 200 },
                { id: 'skincare', name: 'Skin Care', count: 300 },
                { id: 'daily-essentials', name: 'Daily Essentials', count: 250 },
                { id: 'baby-essentials', name: 'Baby Essentials', count: 150 },
                { id: 'vitamins', name: 'Vitamins', count: 180 },
                { id: 'sexual-wellness', name: 'Sexual Wellness', count: 120 },
                { id: 'otc', name: 'OTC', count: 300 },
            ],

            priceRange: { min: 0, max: 1000 },
            sortBy: 'name',
            inStockOnly: false,
            prescriptionOnly: false,
            minRating: 0,
            selectedCities: [] as string[],
            selectedPharmacies: [] as string[],
        });
    };

    const displayedProducts = sortedProducts;

    return (
        <div
            className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="un0c5eg"
        >
            <ResponsiveHeader data-oid="mw0zxdr" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="byhrycd">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="s:wnzl3" />}
                    data-oid="qz77bxp"
                >
                    <CategoriesBar data-oid="8q5floq" />
                </ClientOnly>
            </div>

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
                            {displayedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() =>
                                        (window.location.href = `/product/${product.id}`)
                                    }
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 flex flex-col h-full"
                                    data-oid="mobile-product-card"
                                >
                                    {/* Product Image */}
                                    <div
                                        className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative flex-shrink-0"
                                        data-oid="mobile-product-image"
                                    >
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
                                                    {product.price} EGP
                                                </span>
                                                {product.originalPrice && (
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
                                                window.location.href = `/product/${product.id}`;
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
                                            {t('shop.results.of')} {sortedProducts.length}{' '}
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
