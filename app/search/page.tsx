'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { ClientOnly } from '@/components/common/ClientOnly';
import { ComprehensiveSearch } from '@/components/search/ComprehensiveSearch';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import { searchService, SearchResult, SearchFilters } from '@/lib/services/searchService';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import Link from 'next/link';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, adminSettings } = useCity();

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const resultsPerPage = 12;

    // Initialize search from URL parameters
    useEffect(() => {
        const q = searchParams.get('q') || '';
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const inStock = searchParams.get('inStock');
        const prescription = searchParams.get('prescription');
        const rating = searchParams.get('rating');
        const sort = searchParams.get('sort');

        setQuery(q);

        const newFilters: SearchFilters = {};
        if (category) newFilters.category = category.split(',');
        if (minPrice || maxPrice) {
            newFilters.priceRange = {
                min: minPrice ? Number(minPrice) : 0,
                max: maxPrice ? Number(maxPrice) : 1000,
            };
        }
        if (inStock === 'true') newFilters.inStockOnly = true;
        if (prescription === 'true') newFilters.prescriptionOnly = true;
        if (rating) newFilters.rating = Number(rating);
        if (sort) newFilters.sortBy = sort as any;

        setFilters(newFilters);

        // Perform search
        if (q) {
            performSearch(q, newFilters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Perform search
    const performSearch = async (searchQuery: string, searchFilters: SearchFilters = {}) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setTotalResults(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const enabledCityIds = selectedCity ? [selectedCity.id] : adminSettings.enabledCityIds;
            const searchResults = await searchService.search(
                searchQuery,
                searchFilters,
                enabledCityIds,
                locale as 'en' | 'ar',
            );
            setResults(searchResults);
            setTotalResults(searchResults.length);
            setCurrentPage(1);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    // Get paginated results
    const paginatedResults = results.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage,
    );

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    // Render result item
    const renderResultItem = (result: SearchResult) => {
        return (
            <Link
                key={result.id}
                href={result.url}
                className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#1F1F6F]/20 group"
                data-oid="mffyj6h"
            >
                <div className="p-6" data-oid="6:-le5k">
                    <div className="flex items-start space-x-4" data-oid="b7axtsb">
                        {/* Icon/Image */}
                        <div className="flex-shrink-0" data-oid="7xzw.:-">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-[#1F1F6F]/10 to-[#14274E]/10 rounded-lg flex items-center justify-center group-hover:from-[#1F1F6F]/20 group-hover:to-[#14274E]/20 transition-all duration-300"
                                data-oid="scabkdi"
                            >
                                {result.type === 'product' && (
                                    <span className="text-2xl" data-oid="lu-jgbq">
                                        💊
                                    </span>
                                )}
                                {result.type === 'pharmacy' && (
                                    <span className="text-2xl" data-oid="ln.lmib">
                                        🏥
                                    </span>
                                )}
                                {result.type === 'category' && (
                                    <span className="text-2xl" data-oid="4_ihxeb">
                                        {result.metadata?.icon || '📂'}
                                    </span>
                                )}
                                {result.type === 'condition' && (
                                    <span className="text-2xl" data-oid=".cuysa5">
                                        🩺
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0" data-oid="4-zd2mh">
                            <div className="flex items-start justify-between" data-oid="ky0qufu">
                                <div className="flex-1" data-oid="moxqld5">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 group-hover:text-[#1F1F6F] transition-colors duration-300 truncate"
                                        data-oid="wr7bgev"
                                    >
                                        {result.title}
                                    </h3>
                                    {result.subtitle && (
                                        <p
                                            className="text-sm text-gray-600 mt-1"
                                            data-oid=".mb.seh"
                                        >
                                            {result.subtitle}
                                        </p>
                                    )}
                                    {result.description && (
                                        <p
                                            className="text-sm text-gray-500 mt-2 line-clamp-2"
                                            data-oid="cf0_upl"
                                        >
                                            {result.description}
                                        </p>
                                    )}
                                </div>

                                {/* Price/Rating */}
                                <div className="flex-shrink-0 ml-4 text-right" data-oid="t:w7wly">
                                    {result.metadata?.price && (
                                        <div
                                            className="text-lg font-bold text-[#1F1F6F]"
                                            data-oid="ks:u3ud"
                                        >
                                            EGP {result.metadata.price}
                                        </div>
                                    )}
                                    {result.metadata?.rating && (
                                        <div className="flex items-center mt-1" data-oid="t-9jo59">
                                            <span
                                                className="text-yellow-400 text-sm"
                                                data-oid="_ddt32h"
                                            >
                                                ★
                                            </span>
                                            <span
                                                className="text-sm text-gray-600 ml-1"
                                                data-oid="brazdrz"
                                            >
                                                {result.metadata.rating}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center space-x-4 mt-3" data-oid="ul:pzr9">
                                {result.metadata?.inStock !== undefined && (
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            result.metadata.inStock
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                        data-oid="2:wqn6v"
                                    >
                                        {result.metadata.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                )}
                                {result.metadata?.prescription && (
                                    <span
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        data-oid="hva1g91"
                                    >
                                        Prescription Required
                                    </span>
                                )}
                                {result.metadata?.city && (
                                    <span className="text-xs text-gray-500" data-oid="izkj3ux">
                                        📍 {result.metadata.city}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    // Render pagination
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-center space-x-2 mt-8" data-oid="t.mqena">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    data-oid="yftsw-c"
                >
                    Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 border rounded-lg ${
                                currentPage === page
                                    ? 'bg-[#1F1F6F] text-white border-[#1F1F6F]'
                                    : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            data-oid="kbog3j8"
                        >
                            {page}
                        </button>
                    );
                })}

                {totalPages > 5 && (
                    <>
                        <span className="px-2" data-oid="12ya6.l">
                            ...
                        </span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`px-3 py-2 border rounded-lg ${
                                currentPage === totalPages
                                    ? 'bg-[#1F1F6F] text-white border-[#1F1F6F]'
                                    : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            data-oid="x7wwpzq"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    data-oid="-hth_cz"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="0vqc-9u"
        >
            <ResponsiveHeader data-oid="3x:jtni" />

            {/* Search Header */}
            <div className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] py-12" data-oid=".614nn5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="gau59n4">
                    <div className="text-center mb-8" data-oid="q7x7vqf">
                        <h1 className="text-3xl font-bold text-white mb-4" data-oid="59e8_sg">
                            Search Results
                        </h1>
                        {query && (
                            <p className="text-xl text-white/90" data-oid="w6o7fon">
                                Results for {"'"}{query}{"'"}
                            </p>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto" data-oid="h6zld5t">
                        <ComprehensiveSearch
                            variant="page"
                            showFilters={true}
                            placeholder="Search medicines, pharmacies, categories..."
                            className="w-full"
                            data-oid="q1_388m"
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="-i03rcy">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6" data-oid="3u509kd">
                    <div data-oid="he45e9x">
                        <h2 className="text-2xl font-bold text-gray-900" data-oid="ib521xh">
                            {loading ? 'Searching...' : `${totalResults} Results`}
                        </h2>
                        {query && !loading && (
                            <p className="text-gray-600 mt-1" data-oid="lo04scr">
                                Showing results for {"'"}{query}{"'"}
                                {selectedCity && ` in ${selectedCity.nameEn}`}
                            </p>
                        )}
                    </div>

                    {/* Results per page */}
                    {totalResults > 0 && (
                        <div className="text-sm text-gray-600" data-oid="_bedu5.">
                            Showing {(currentPage - 1) * resultsPerPage + 1}-
                            {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12" data-oid="i279y87">
                        <div className="flex items-center space-x-3" data-oid="ingflbn">
                            <div
                                className="w-6 h-6 border-2 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                                data-oid="yg.rcp0"
                            ></div>
                            <span className="text-gray-600" data-oid="nb.jdap">
                                Searching...
                            </span>
                        </div>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && paginatedResults.length > 0 && (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        data-oid="no:soyq"
                    >
                        {paginatedResults.map(renderResultItem)}
                    </div>
                )}

                {/* No Results */}
                {!loading && results.length === 0 && query && (
                    <div className="text-center py-12" data-oid="r0w8yep">
                        <div className="text-6xl mb-4" data-oid="txi7.cm">
                            🔍
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2" data-oid="cgo6:60">
                            No results found
                        </h3>
                        <p className="text-gray-600 mb-6" data-oid="i_sk0rd">
                            We couldn{"'"}t find anything matching {'"'}{query}{'"'}. Try adjusting your search
                            terms.
                        </p>
                        <div className="space-y-2 text-sm text-gray-500" data-oid="8js51:m">
                            <p data-oid="ync-q-8">• Check your spelling</p>
                            <p data-oid=".uutlpj">• Try more general terms</p>
                            <p data-oid="f_:yldi">• Use different keywords</p>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {renderPagination()}
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="bmgqi90">
                <ClientOnly data-oid="-13lg6r">
                    <Footer data-oid="guvl25:" />
                </ClientOnly>
            </div>

            {/* Mobile Floating Navigation - Only for Mobile */}
            <div className="block md:hidden" data-oid="2kj.::h">
                <ClientOnly data-oid="0:ejdvp">
                    <FloatingNavigation data-oid="search-mobile-nav" />
                </ClientOnly>
            </div>

            {/* Mobile Bottom Padding - Only for Mobile */}
            <div className="h-20 md:hidden" data-oid="haw8se9"></div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div
                    className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center"
                    data-oid="4x6bhux"
                >
                    <div className="flex items-center space-x-3" data-oid="p5uavj8">
                        <div
                            className="w-6 h-6 border-2 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                            data-oid="seh66v."
                        ></div>
                        <span className="text-gray-600" data-oid="rxknw45">
                            Loading search...
                        </span>
                    </div>
                </div>
            }
            data-oid="kd5rnr_"
        >
            <SearchPageContent data-oid="jny6iia" />
        </Suspense>
    );
}
