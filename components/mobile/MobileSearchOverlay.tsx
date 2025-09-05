'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import { searchService, SearchResult, SearchSuggestion } from '@/lib/services/searchService';

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, adminSettings } = useCity();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }

        // Get initial suggestions when overlay opens
        if (isOpen) {
            getSuggestions('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Debounced search
    const debouncedSearch = useCallback(
        async (searchQueryValue: string) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(async () => {
                if (searchQueryValue.trim()) {
                    setIsLoading(true);
                    try {
                        const enabledCityIds = selectedCity
                            ? [selectedCity.id]
                            : adminSettings.enabledCityIds;
                        const searchResults = await searchService.search(
                            searchQueryValue,
                            {},
                            enabledCityIds,
                            locale as 'en' | 'ar',
                        );
                        setResults(searchResults);
                        setSuggestions([]);
                    } catch (error) {
                        console.error('Search error:', error);
                        setResults([]);
                    } finally {
                        setIsLoading(false);
                    }
                } else {
                    // Get suggestions for empty query
                    getSuggestions('');
                    setResults([]);
                }
            }, 300);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedCity, adminSettings.enabledCityIds, locale],
    );

    // Get suggestions
    const getSuggestions = async (searchQueryValue: string) => {
        const enabledCityIds = selectedCity ? [selectedCity.id] : adminSettings.enabledCityIds;
        const searchSuggestions = await searchService.getSuggestions(
            searchQueryValue,
            enabledCityIds,
        );
        setSuggestions(searchSuggestions);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSelectedIndex(-1);
        debouncedSearch(value);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const totalItems = searchQuery.trim() ? results.length : suggestions.length;

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
                    if (searchQuery.trim()) {
                        handleResultSelect(results[selectedIndex]);
                    } else {
                        handleSuggestionSelect(suggestions[selectedIndex]);
                    }
                } else if (searchQuery.trim()) {
                    handleSearch(searchQuery);
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };

    const handleSearch = (query: string) => {
        if (query.trim()) {
            // Save to recent searches
            const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));

            // Navigate to search results
            onClose();
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    // Handle result selection
    const handleResultSelect = (result: SearchResult) => {
        onClose();
        router.push(result.url);
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
        if (suggestion.type === 'recent') {
            setSearchQuery(suggestion.text);
            debouncedSearch(suggestion.text);
        } else {
            handleSearch(suggestion.text);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchQuery);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    if (!isOpen) return null;

    const hasQuery = searchQuery.trim();
    const showResults = hasQuery && results.length > 0;
    const showSuggestions = !hasQuery && suggestions.length > 0;
    const showRecentSearches = !hasQuery && recentSearches.length > 0;
    const showNoResults = hasQuery && results.length === 0 && !isLoading;

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col" data-oid="9pa7o80">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-200" data-oid="vjbeqy_">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
                    data-oid="jbhpher"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid=":qvncr9"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                            data-oid="87trhmu"
                        />
                    </svg>
                </button>

                <form onSubmit={handleSubmit} className="flex-1 ml-3" data-oid="zv.7k.v">
                    <div className="relative" data-oid="5z19fst">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={t('search.placeholder')}
                            className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1F1F6F] focus:bg-white transition-all"
                            data-oid="vb4jrhr"
                        />

                        {/* Loading Spinner */}
                        {isLoading ? (
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                data-oid="w4kx7l1"
                            >
                                <div
                                    className="w-5 h-5 border-2 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                                    data-oid="svtor93"
                                ></div>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1F1F6F] transition-colors"
                                data-oid="sx8rg23"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="z2p3zcx"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        data-oid="ajoimpu"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto" data-oid="pyiua5u">
                {/* Loading State */}
                {isLoading && (
                    <div className="p-4 text-center text-gray-500" data-oid="k9ijfea">
                        <div
                            className="flex items-center justify-center space-x-2"
                            data-oid="rz5dqzk"
                        >
                            <div
                                className="w-4 h-4 border-2 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                                data-oid="fshidaz"
                            ></div>
                            <span data-oid=".mg.pfx">Searching...</span>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {showResults && (
                    <div data-oid="uzz62m9">
                        <div
                            className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600"
                            data-oid="x28xyhx"
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
                                data-oid="z:9t68y"
                            >
                                <div className="flex items-center space-x-3" data-oid="1vatu.s">
                                    <div className="flex-1 min-w-0" data-oid="zip383d">
                                        <div
                                            className="font-medium text-gray-900 truncate"
                                            data-oid="oi_jn2t"
                                        >
                                            {result.title}
                                        </div>
                                        {result.subtitle && (
                                            <div
                                                className="text-sm text-gray-500 truncate"
                                                data-oid="2v3g1py"
                                            >
                                                {result.subtitle}
                                            </div>
                                        )}
                                        {result.metadata?.price && (
                                            <div
                                                className="text-sm font-medium text-[#1F1F6F]"
                                                data-oid="ew_ahia"
                                            >
                                                EGP {result.metadata.price}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0" data-oid="m.gpxn2">
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="64u3dfs"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="z.rpleg"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {results.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-100" data-oid="wlfl8zq">
                                <button
                                    onClick={() => handleSearch(searchQuery)}
                                    className="w-full text-center text-[#1F1F6F] hover:text-[#14274E] font-medium"
                                    data-oid="5.6xxvp"
                                >
                                    View all results for {'"'}{searchQuery}{'"'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Suggestions */}
                {showSuggestions && (
                    <div data-oid="snmbkq0">
                        <div
                            className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600"
                            data-oid="2.-nulr"
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
                                data-oid="66b1p.-"
                            >
                                <div className="flex items-center space-x-3" data-oid="xkuaxe:">
                                    <svg
                                        className="w-4 h-4 text-gray-400 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="cmg0us4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            data-oid="qcdiwt9"
                                        />
                                    </svg>
                                    <div className="flex-1" data-oid=".4gp4_q">
                                        <div
                                            className="font-medium text-gray-900"
                                            data-oid="ckg0kin"
                                        >
                                            {suggestion.text}
                                        </div>
                                        {suggestion.count && (
                                            <div
                                                className="text-sm text-gray-500"
                                                data-oid="0oh.clp"
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

                {/* Recent Searches */}
                {showRecentSearches && (
                    <div className="p-4" data-oid=":hbbq79">
                        <div className="flex items-center justify-between mb-3" data-oid="gf0ej_g">
                            <h3 className="text-sm font-semibold text-gray-900" data-oid=".2g5bss">
                                {t('search.recent')}
                            </h3>
                            <button
                                onClick={clearRecentSearches}
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                data-oid="a-zetgz"
                            >
                                {t('clear')}
                            </button>
                        </div>
                        <div className="space-y-2" data-oid="gwtmfqa">
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSearch(search)}
                                    className="flex items-center w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                    data-oid="vyuschh"
                                >
                                    <svg
                                        className="w-4 h-4 text-gray-400 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid=".d7md0f"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="3_.v78v"
                                        />
                                    </svg>
                                    <span className="text-gray-700" data-oid="-2m.xuy">
                                        {search}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {showNoResults && (
                    <div className="p-6 text-center text-gray-500" data-oid="9qjzpas">
                        <div className="font-medium mb-1" data-oid="v15vx11">
                            No medicines found
                        </div>
                        <div className="text-sm" data-oid="0o4g2:8">
                            Try adjusting your search terms
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
