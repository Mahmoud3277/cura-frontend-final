'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import { PrescriptionUploadModal } from '@/components/prescription/PrescriptionUploadModal';
import {
    searchService,
    SearchResult,
    SearchSuggestion,
    SearchFilters,
} from '@/lib/services/searchService';

interface ComprehensiveSearchProps {
    variant?: 'header' | 'page' | 'modal';
    placeholder?: string;
    showFilters?: boolean;
    autoFocus?: boolean;
    onResultSelect?: (result: SearchResult) => void;
    className?: string;
}

export function ComprehensiveSearch({
    variant = 'header',
    placeholder,
    showFilters = false,
    autoFocus = false,
    onResultSelect,
    className = '',
}: ComprehensiveSearchProps) {
    const router = useRouter();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, adminSettings } = useCity();

    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Auto focus
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    const debouncedSearch = useCallback(
        async (searchQuery: string) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(async () => {
                if (searchQuery.trim()) {
                    setIsLoading(true);
                    try {
                        const enabledCityIds = selectedCity
                            ? [selectedCity.id]
                            : adminSettings.enabledCityIds;
                        const searchResults = await searchService.search(
                            searchQuery,
                            filters,
                            enabledCityIds,
                            locale as 'en' | 'ar',
                        );
                        setResults(searchResults);
                    } catch (error) {
                        console.error('Search error:', error);
                        setResults([]);
                    } finally {
                        setIsLoading(false);
                    }
                } else {
                    // Get suggestions for empty query
                    const enabledCityIds = selectedCity
                        ? [selectedCity.id]
                        : adminSettings.enabledCityIds;
                    const searchSuggestions = await searchService.getSuggestions(
                        '',
                        enabledCityIds,
                    );
                    setSuggestions(searchSuggestions);
                    setResults([]);
                }
            }, 300);
        },
        [filters, selectedCity, adminSettings.enabledCityIds, locale],
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedIndex(-1);

        if (value.trim()) {
            debouncedSearch(value);
        } else {
            // Get suggestions for empty query
            getSuggestions('');
        }

        if (!isOpen) setIsOpen(true);
    };

    // Get suggestions
    const getSuggestions = async (searchQuery: string) => {
        const enabledCityIds = selectedCity ? [selectedCity.id] : adminSettings.enabledCityIds;
        const searchSuggestions = await searchService.getSuggestions(searchQuery, enabledCityIds);
        setSuggestions(searchSuggestions);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        const totalItems = query.trim() ? results.length : suggestions.length;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : -1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > -1 ? prev - 1 : totalItems - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    if (query.trim()) {
                        handleResultSelect(results[selectedIndex]);
                    } else {
                        handleSuggestionSelect(suggestions[selectedIndex]);
                    }
                } else if (query.trim()) {
                    handleSearch();
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    // Handle search submission
    const handleSearch = () => {
        if (query.trim()) {
            setIsOpen(false);
            const searchParams = new URLSearchParams();
            searchParams.set('q', query.trim());

            // Add filters to URL
            if (filters.category && filters.category.length > 0) {
                searchParams.set('category', filters.category.join(','));
            }
            if (filters.priceRange) {
                searchParams.set('minPrice', filters.priceRange.min.toString());
                searchParams.set('maxPrice', filters.priceRange.max.toString());
            }
            if (filters.inStockOnly) {
                searchParams.set('inStock', 'true');
            }
            if (filters.prescriptionOnly) {
                searchParams.set('prescription', 'true');
            }
            if (filters.rating) {
                searchParams.set('rating', filters.rating.toString());
            }
            if (filters.sortBy) {
                searchParams.set('sort', filters.sortBy);
            }

            router.push(`/search?${searchParams.toString()}`);
        }
    };

    // Handle result selection
    const handleResultSelect = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');

        if (onResultSelect) {
            onResultSelect(result);
        } else {
            router.push(result.url);
        }
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
        if (suggestion.type === 'recent') {
            setQuery(suggestion.text);
            debouncedSearch(suggestion.text);
        } else {
            setQuery(suggestion.text);
            handleSearch();
        }
    };

    // Handle focus
    const handleFocus = () => {
        setIsOpen(true);
        if (!query.trim()) {
            getSuggestions('');
        }
    };

    // Render search input
    const renderSearchInput = () => (
        <div className="relative flex-1" data-oid="w5:_geh">
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                placeholder={placeholder || t('common.search')}
                aria-label={placeholder || t('common.search') || 'Search'}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                role="combobox"
                className={`w-full px-4 py-3 pl-12 ${!query ? 'pr-32' : 'pr-4'} border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300 hover:shadow-md focus:shadow-lg bg-white/80 backdrop-blur-sm ${
                    variant === 'page' ? 'text-lg py-4' : ''
                }`}
                data-oid="82dkmsc"
            />

            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center" data-oid="b5903g9">
                <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="4.4rmyw"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        data-oid="33rfy-r"
                    />
                </svg>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
                <div
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    data-oid="b7dvb6t"
                >
                    <div
                        className="w-5 h-5 border-2 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                        data-oid="o2ch4o."
                    ></div>
                </div>
            )}

            {/* Upload Prescription Button - Small button inside search bar */}
            {!query && (
                <button
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="absolute inset-y-0 right-2 flex items-center transition-all duration-300"
                    title="Upload Your Prescription"
                    data-oid="0v9d.u0"
                >
                    <div
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-2 py-1 rounded-md hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 font-medium text-[10px] hover:scale-105 shadow-sm hover:shadow-md whitespace-nowrap"
                        data-oid="b0j7pa8"
                    >
                        <span data-oid="oj33v16">{t('uploadPrescription') || 'Upload Rx'}</span>
                    </div>
                </button>
            )}

            {/* Clear Button */}
            {query && (
                <button
                    onClick={() => {
                        setQuery('');
                        setResults([]);
                        setSuggestions([]);
                        setIsOpen(false);
                        inputRef.current?.focus();
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                    data-oid="rs478g7"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="au:yftp"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                            data-oid=".b155wy"
                        />
                    </svg>
                </button>
            )}
        </div>
    );

    // Render search results
    const renderResults = () => {
        if (!isOpen) return null;

        const hasQuery = query.trim();
        const items = hasQuery ? results : suggestions;
        const showResults = hasQuery && results.length > 0;
        const showSuggestions = !hasQuery && suggestions.length > 0;
        const showNoResults = hasQuery && results.length === 0 && !isLoading;

        return (
            <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
                data-oid="e5c-ym7"
            >
                {isLoading && (
                    <div className="p-4 text-center text-gray-500" data-oid="b4h64-m">
                        <div
                            className="flex items-center justify-center space-x-2"
                            data-oid="lksr_0c"
                        >
                            <div
                                className="w-4 h-4 border-2 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                                data-oid="t:fo_c."
                            ></div>
                            <span data-oid="8yayxe2">Searching...</span>
                        </div>
                    </div>
                )}

                {showResults && (
                    <div data-oid="05he-uy">
                        <div
                            className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600"
                            data-oid="._q_nwr"
                        >
                            Found {results.length} result{results.length !== 1 ? 's' : ''}
                        </div>
                        {results.map((result, index) => (
                            <button
                                key={result.id}
                                onClick={() => handleResultSelect(result)}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors ${
                                    selectedIndex === index ? 'bg-blue-50' : ''
                                }`}
                                data-oid="hhtvgfm"
                            >
                                <div className="flex items-center space-x-3" data-oid="4zg_4vs">
                                    <div className="flex-1 min-w-0" data-oid="s_5hbjv">
                                        <div
                                            className="font-medium text-gray-900 truncate"
                                            data-oid="1mwifrf"
                                        >
                                            {result.title}
                                        </div>
                                        {result.subtitle && (
                                            <div
                                                className="text-sm text-gray-500 truncate"
                                                data-oid="h:5wq5u"
                                            >
                                                {result.subtitle}
                                            </div>
                                        )}
                                        {result.metadata?.price && (
                                            <div
                                                className="text-sm font-medium text-[#1F1F6F]"
                                                data-oid="z1kd-io"
                                            >
                                                EGP {result.metadata.price}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0" data-oid="00t6gug">
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="8mjxh71"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid=".7rsbse"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {results.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-100" data-oid="5pywux6">
                                <button
                                    onClick={handleSearch}
                                    className="w-full text-center text-[#1F1F6F] hover:text-[#14274E] font-medium"
                                    data-oid="60pg2gv"
                                >
                                    View all results for {"'"}{query}{"'"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {showSuggestions && (
                    <div data-oid="j14zfb.">
                        <div
                            className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600"
                            data-oid="_lhwgfj"
                        >
                            Suggestions
                        </div>
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleSuggestionSelect(suggestion)}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors ${
                                    selectedIndex === index ? 'bg-blue-50' : ''
                                }`}
                                data-oid="-omho5l"
                            >
                                <div className="flex items-center space-x-3" data-oid="xi:81:v">
                                    <div className="flex-1" data-oid="p34uhwn">
                                        <div
                                            className="font-medium text-gray-900"
                                            data-oid="9p67srs"
                                        >
                                            {suggestion.text}
                                        </div>
                                        {suggestion.count && (
                                            <div
                                                className="text-sm text-gray-500"
                                                data-oid="bc:vg-9"
                                            >
                                                {suggestion.count} results
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {showNoResults && (
                    <div className="p-6 text-center text-gray-500" data-oid="ab9mgrv">
                        <div className="font-medium mb-1" data-oid="ztytgm6">
                            No medicines found
                        </div>
                        <div className="text-sm" data-oid="0f2gb1f">
                            Try adjusting your search terms
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render filters (for page variant)
    const renderFilters = () => {
        if (!showFilters || variant !== 'page') return null;

        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg" data-oid="4id3r3s">
                <div className="flex items-center justify-between mb-3" data-oid="h-k9t8i">
                    <h3 className="font-medium text-gray-900" data-oid="mt7nbl3">
                        Search Filters
                    </h3>
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="text-sm text-[#1F1F6F] hover:text-[#14274E]"
                        data-oid="hraxsrr"
                    >
                        {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
                    </button>
                </div>

                {/* Basic Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3" data-oid="6nx_kcd">
                    <label className="flex items-center" data-oid="3q5okbl">
                        <input
                            type="checkbox"
                            checked={filters.inStockOnly || false}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            aria-label="In Stock Only"
                            data-oid="3-_xnuf"
                        />

                        <span className="ml-2 text-sm text-gray-700" data-oid=":l437k3">
                            In Stock Only
                        </span>
                    </label>

                    <label className="flex items-center" data-oid="6qq8.o8">
                        <input
                            type="checkbox"
                            checked={filters.prescriptionOnly || false}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    prescriptionOnly: e.target.checked,
                                }))
                            }
                            className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            aria-label="Prescription Only"
                            data-oid="1nt3w6b"
                        />

                        <span className="ml-2 text-sm text-gray-700" data-oid="j72b7ze">
                            Prescription Only
                        </span>
                    </label>

                    <select
                        value={filters.sortBy || 'relevance'}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                        aria-label="Sort by"
                        data-oid="wu9:4c5"
                    >
                        <option value="relevance" data-oid="2bg9j5i">
                            Sort by Relevance
                        </option>
                        <option value="price-low" data-oid="z0.xnmw">
                            Price: Low to High
                        </option>
                        <option value="price-high" data-oid="och4ip1">
                            Price: High to Low
                        </option>
                        <option value="rating" data-oid="n3d7nq3">
                            Highest Rated
                        </option>
                        <option value="name" data-oid="f4q9v31">
                            Name A-Z
                        </option>
                    </select>

                    <select
                        value={filters.rating || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                rating: e.target.value ? Number(e.target.value) : undefined,
                            }))
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                        aria-label="Filter by rating"
                        data-oid="sqy-lw0"
                    >
                        <option value="" data-oid="rxnpyys">
                            Any Rating
                        </option>
                        <option value="4" data-oid="bbr430r">
                            4+ Stars
                        </option>
                        <option value="3" data-oid=".a2z535">
                            3+ Stars
                        </option>
                        <option value="2" data-oid="u24f-wx">
                            2+ Stars
                        </option>
                    </select>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                    <div className="space-y-3 pt-3 border-t border-gray-200" data-oid="99g-aqj">
                        {/* Price Range */}
                        <div data-oid="kogv7r:">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="fq_zzqx"
                            >
                                Price Range (EGP)
                            </label>
                            <div className="flex items-center space-x-2" data-oid="xs2uspv">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.priceRange?.min || ''}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            priceRange: {
                                                min: Number(e.target.value) || 0,
                                                max: prev.priceRange?.max || 1000,
                                            },
                                        }))
                                    }
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                                    aria-label="Minimum price"
                                    data-oid="6y:cd3_"
                                />

                                <span className="text-gray-500" data-oid="b.n5-d:">
                                    -
                                </span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.priceRange?.max || ''}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            priceRange: {
                                                min: prev.priceRange?.min || 0,
                                                max: Number(e.target.value) || 1000,
                                            },
                                        }))
                                    }
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                                    aria-label="Maximum price"
                                    data-oid="k3yezb3"
                                />
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() => setFilters({})}
                            className="text-sm text-red-600 hover:text-red-700"
                            data-oid="irav6ig"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <React.Fragment>
            <div ref={searchRef} className={`relative ${className}`} data-oid="v8:ytsg">
                <div className="flex items-center space-x-2" data-oid="6w6e859">
                    {renderSearchInput()}

                    {variant === 'page' && (
                        <React.Fragment>
                            <button
                                onClick={() => setIsPrescriptionModalOpen(true)}
                                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-4 py-3 rounded-xl hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 font-semibold flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-xl"
                                title="Upload Your Prescription"
                                data-oid="e-cx5xi"
                            >
                                <span className="text-lg" data-oid="or8z-9j">
                                    📄
                                </span>
                                <span data-oid="58._q9b">Upload Prescription</span>
                            </button>
                            <button
                                onClick={handleSearch}
                                className="px-6 py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                                data-oid="4s02qc2"
                            >
                                Search
                            </button>
                        </React.Fragment>
                    )}
                </div>

                {renderResults()}
                {renderFilters()}
            </div>

            {/* Prescription Upload Modal - Rendered outside to avoid z-index issues */}
            {isPrescriptionModalOpen && (
                <PrescriptionUploadModal
                    isOpen={isPrescriptionModalOpen}
                    onClose={() => setIsPrescriptionModalOpen(false)}
                    onUploadComplete={(files, formData) => {
                        console.log('Prescription uploaded:', { files, formData });
                        setIsPrescriptionModalOpen(false);
                        // You can add additional logic here like showing a success message
                    }}
                    data-oid="ji2m6g7"
                />
            )}
        </React.Fragment>
    );
}
