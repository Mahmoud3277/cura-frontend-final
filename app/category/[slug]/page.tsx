'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
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
} from '@/lib/data/products';
import { getPharmaciesInEnabledCities, getPharmaciesByCity, Pharmacy } from '@/lib/data/pharmacies';

// Category mapping from URL slug to product categories and display info
const categoryMapping: Record<
    string,
    {
        productCategories: string[];
        title: string;
        titleAr: string;
        description: string;
        descriptionAr: string;
        icon: string;
    }
> = {
    medications: {
        productCategories: ['prescription', 'otc'],
        title: 'Medications',
        titleAr: 'الأدوية',
        description: 'Prescription and over-the-counter medications',
        descriptionAr: 'الأدوية الموصوفة والأدوية التي لا تحتاج وصفة طبية',
        icon: '💊',
    },
    'hair-care': {
        productCategories: ['skincare', 'supplements'], // Hair care products would be in skincare/supplements
        title: 'Hair Care',
        titleAr: 'العناية بالشعر',
        description: 'Shampoos, conditioners, and hair treatment products',
        descriptionAr: 'الشامبو والبلسم ومنتجات علاج الشعر',
        icon: '💇‍♀️',
    },
    'skin-care': {
        productCategories: ['skincare'],
        title: 'Skin Care',
        titleAr: 'العناية بالبشرة',
        description: 'Moisturizers, cleansers, and skin treatment products',
        descriptionAr: 'المرطبات والمنظفات ومنتجات علاج البشرة',
        icon: '🧴',
    },
    'daily-essentials': {
        productCategories: ['otc', 'medical', 'supplements'],
        title: 'Daily Essentials',
        titleAr: 'الضروريات اليومية',
        description: 'Everyday health and wellness products',
        descriptionAr: 'منتجات الصحة والعافية اليومية',
        icon: '🏠',
    },
    'baby-essentials': {
        productCategories: ['baby'],
        title: 'Baby Essentials',
        titleAr: 'مستلزمات الأطفال',
        description: 'Baby care products, formula, and essentials',
        descriptionAr: 'منتجات رعاية الأطفال والحليب والمستلزمات',
        icon: '👶',
    },
    vitamins: {
        productCategories: ['vitamins', 'supplements'],
        title: 'Vitamins & Supplements',
        titleAr: 'الفيتامينات والمكملات',
        description: 'Vitamins, minerals, and nutritional supplements',
        descriptionAr: 'الفيتامينات والمعادن والمكملات الغذائية',
        icon: '💊',
    },
    'sexual-wellness': {
        productCategories: ['medical', 'supplements'], // Sexual wellness products would be in medical/supplements
        title: 'Sexual Wellness',
        titleAr: 'الصحة الجنسية',
        description: 'Sexual health and wellness products',
        descriptionAr: 'منتجات الصحة والعافية الجنسية',
        icon: '❤️',
    },
};

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, availableCities, adminSettings } = useCity();

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        categories: [
            { id: 'all', name: 'All Products', count: 1200 },
            { id: 'prescription', name: 'Prescription Medicines', count: 500 },
            { id: 'otc', name: 'Over-the-Counter', count: 300 },
            { id: 'supplements', name: 'Supplements', count: 250 },
            { id: 'skincare', name: 'Skincare', count: 150 },
            { id: 'baby', name: 'Baby Care', count: 80 },
            { id: 'medical', name: 'Medical Supplies', count: 120 },
            { id: 'vitamins', name: 'Vitamins', count: 90 },
        ],

        priceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        inStockOnly: false,
        prescriptionOnly: false,
        minRating: 0,
        selectedCities: [] as string[],
        selectedPharmacies: [] as string[],
    });

    // Get category info
    const categoryInfo = categoryMapping[slug];

    // If category not found, redirect to shop
    useEffect(() => {
        if (!categoryInfo) {
            window.location.href = '/shop';
        }
    }, [categoryInfo]);

    // Get available pharmacies based on enabled cities and selected city
    const availablePharmacies: Array<{
        id: string;
        name: string;
        cityName: string;
        count: number;
    }> = React.useMemo(() => {
        let pharmacies: Pharmacy[] = [];

        if (selectedCity) {
            pharmacies = getPharmaciesByCity(selectedCity.id);
        } else {
            pharmacies = getPharmaciesInEnabledCities(adminSettings.enabledCityIds);
        }

        return pharmacies.map((pharmacy) => ({
            id: pharmacy.id,
            name: pharmacy.name,
            cityName: pharmacy.cityName,
            count: getProductsByPharmacy(pharmacy.id).length,
        }));
    }, [selectedCity, adminSettings.enabledCityIds]);

    // Get products based on city selection and category
    const allProducts: Product[] = React.useMemo(() => {
        let baseProducts = products;

        // Filter by selected city first
        if (selectedCity) {
            baseProducts = getProductsByCity(selectedCity.id);
        } else {
            baseProducts = getProductsInEnabledCities(adminSettings.enabledCityIds);
        }

        // Filter by category
        if (categoryInfo) {
            baseProducts = baseProducts.filter((product) =>
                categoryInfo.productCategories.includes(product.category),
            );
        }

        return baseProducts;
    }, [selectedCity, adminSettings.enabledCityIds, categoryInfo]);

    // Apply all filters
    const filteredProducts = React.useMemo(() => {
        return filterProducts({
            cityIds: selectedCity ? [selectedCity.id] : adminSettings.enabledCityIds,
            categories: categoryInfo ? categoryInfo.productCategories : undefined,
            priceRange: filters.priceRange,
            inStockOnly: filters.inStockOnly,
            prescriptionOnly: filters.prescriptionOnly,
            minRating: filters.minRating,
            pharmacyIds:
                filters.selectedPharmacies.length > 0 ? filters.selectedPharmacies : undefined,
        }).filter((product) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        allProducts,
        searchQuery,
        filters,
        selectedCity,
        adminSettings.enabledCityIds,
        categoryInfo,
    ]);

    // Sort products
    const sortedProducts = React.useMemo(() => {
        return sortProducts(filteredProducts, filters.sortBy);
    }, [filteredProducts, filters.sortBy]);

    const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    const handleAddToCart = (productId: number) => {
        console.log('Added product to cart:', productId);
    };

    const handleLoadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setLoading(false);
        }, 1000);
    };

    const productsPerPage = 9;
    const displayedProducts = sortedProducts.slice(0, currentPage * productsPerPage);
    const hasMoreProducts = sortedProducts.length > displayedProducts.length;

    if (!categoryInfo) {
        return null; // Will redirect
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50"
            data-oid="8k-ihi7"
        >
            <Header data-oid="d57s8of" />

            {/* Page Header */}

            <div className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] py-16" data-oid="15xq0s6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="98:.hzo">
                    <div className="text-center" data-oid="zk:jhz2">
                        <div className="flex items-center justify-center mb-4" data-oid="_i::bd:">
                            <span className="text-4xl mr-3" data-oid="xajnixy">
                                {categoryInfo.icon}
                            </span>
                            <h1 className="text-4xl font-bold text-white" data-oid="_we6l9s">
                                {locale === 'ar' ? categoryInfo.titleAr : categoryInfo.title}
                            </h1>
                        </div>
                        <p className="text-xl text-white/90 mb-4" data-oid="r:1hrba">
                            {locale === 'ar'
                                ? categoryInfo.descriptionAr
                                : categoryInfo.description}
                        </p>

                        {/* City Status Indicator */}
                        {selectedCity ? (
                            <div
                                className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                                data-oid="q:cjo1a"
                            >
                                <svg
                                    className="w-4 h-4 text-white/80 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="zm-cqwz"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        data-oid="js8vb2s"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        data-oid="91l:tvr"
                                    />
                                </svg>
                                <span className="text-white/90 text-sm" data-oid="fklseuf">
                                    Showing products from{' '}
                                    <span className="font-semibold" data-oid="7fuma4p">
                                        {selectedCity.nameEn}
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <div
                                className="inline-flex items-center bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                                data-oid="u7t0wot"
                            >
                                <svg
                                    className="w-4 h-4 text-yellow-300 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="qdz0kxb"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                                        data-oid="tc.8sy3"
                                    />
                                </svg>
                                <span className="text-yellow-100 text-sm" data-oid="k3.dg-s">
                                    Please select a city to see available products
                                </span>
                            </div>
                        )}

                        {/* Enhanced Search Bar */}
                        <div className="max-w-2xl mx-auto" data-oid="ln2eb..">
                            <div className="relative" data-oid="tzlt2l1">
                                <input
                                    type="text"
                                    placeholder={`Search ${categoryInfo.title.toLowerCase()}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-6 py-4 pl-12 pr-4 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
                                    data-oid="a7ki3tw"
                                />

                                <div
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center"
                                    data-oid="3k1_3wf"
                                >
                                    <svg
                                        className="h-6 w-6 text-white/70"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="5sg8_p2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            data-oid="f1_0:3_"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="y45qlmu">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8" data-oid="edki0l7">
                    {/* Sidebar - Filters */}
                    <div className="lg:w-1/4" data-oid="k8l21fn">
                        <ProductFilters
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            selectedCategory="all"
                            onCategoryChange={() => {}} // Disabled since we're on a category page
                            availablePharmacies={availablePharmacies}
                            isMedicinePage={slug === 'medications'}
                            data-oid="ewci079"
                        />
                    </div>

                    {/* Main Content - Products */}
                    <div className="lg:w-3/4" data-oid="12yry9w">
                        {/* Results Header */}
                        <div
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4"
                            data-oid="zphm9bw"
                        >
                            <div data-oid="_8j3_--">
                                <h2
                                    className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="nqma3.u"
                                >
                                    {locale === 'ar' ? categoryInfo.titleAr : categoryInfo.title}
                                </h2>
                                <p
                                    className="text-sm lg:text-base text-gray-600"
                                    data-oid="o49cl_."
                                >
                                    Showing {displayedProducts.length} of {sortedProducts.length}{' '}
                                    products
                                    {selectedCity && (
                                        <span
                                            className="block text-sm text-gray-500 mt-1"
                                            data-oid="t21g1ht"
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
                                data-oid="n53rw62"
                            >
                                <span
                                    className="text-sm text-gray-600 whitespace-nowrap"
                                    data-oid="n:ks:gq"
                                >
                                    Sort by:
                                </span>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFiltersChange({ sortBy: e.target.value })
                                    }
                                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                                    data-oid="lgr_m:q"
                                >
                                    <option value="name" data-oid="c-hy.vp">
                                        Name A-Z
                                    </option>
                                    <option value="name-desc" data-oid="6gzufqw">
                                        Name Z-A
                                    </option>
                                    <option value="price-low" data-oid="jo136ku">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high" data-oid="u:njy5q">
                                        Price: High to Low
                                    </option>
                                    <option value="rating" data-oid="nv-h11a">
                                        Highest Rated
                                    </option>
                                    <option value="reviews" data-oid="y808-2_">
                                        Most Reviews
                                    </option>
                                    <option value="newest" data-oid="lyp:mcn">
                                        Newest First
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid
                            products={displayedProducts}
                            loading={loading}
                            onAddToCart={handleAddToCart}
                            data-oid=".pag.vg"
                        />

                        {/* Load More Button */}
                        {hasMoreProducts && (
                            <div className="text-center mt-12" data-oid="i30mn4h">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="4963omb"
                                >
                                    {loading ? (
                                        <div className="flex items-center" data-oid="fcizxml">
                                            <div
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                                data-oid="26ti4yt"
                                            ></div>
                                            Loading...
                                        </div>
                                    ) : (
                                        'Load More Products'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* No Products Found */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-12" data-oid="spxwcj5">
                                <div className="text-6xl mb-4" data-oid="ui46hm0">
                                    {categoryInfo.icon}
                                </div>
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="78z_rde"
                                >
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="kgac0u3">
                                    We couldn{"'"}t find any {categoryInfo.title.toLowerCase()} in your
                                    selected area.
                                </p>
                                <button
                                    onClick={() => (window.location.href = '/shop')}
                                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                                    data-oid="dw3rbv-"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer data-oid="a9l9ut7" />
        </div>
    );
}
