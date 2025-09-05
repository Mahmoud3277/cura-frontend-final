'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import { SearchFilters } from '@/lib/services/searchService';

interface AdvancedSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialQuery?: string;
    initialFilters?: SearchFilters;
}

export function AdvancedSearchModal({
    isOpen,
    onClose,
    initialQuery = '',
    initialFilters = {},
}: AdvancedSearchModalProps) {
    const router = useRouter();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { selectedCity, availableCities } = useCity();

    const [query, setQuery] = useState(initialQuery);
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);

    const categories = [
        { id: 'prescription', name: 'Prescription Medicines' },
        { id: 'otc', name: 'Over-the-Counter' },
        { id: 'supplements', name: 'Supplements' },
        { id: 'skincare', name: 'Skincare' },
        { id: 'baby', name: 'Baby Care' },
        { id: 'medical', name: 'Medical Supplies' },
        { id: 'vitamins', name: 'Vitamins' },
    ];

    const handleSearch = () => {
        const searchParams = new URLSearchParams();

        if (query.trim()) {
            searchParams.set('q', query.trim());
        }

        // Add filters to URL
        if (filters.category && filters.category.length > 0) {
            searchParams.set('category', filters.category.join(','));
        }
        if (filters.priceRange) {
            if (filters.priceRange.min > 0) {
                searchParams.set('minPrice', filters.priceRange.min.toString());
            }
            if (filters.priceRange.max < 1000) {
                searchParams.set('maxPrice', filters.priceRange.max.toString());
            }
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

        onClose();
        router.push(`/search?${searchParams.toString()}`);
    };

    const handleCategoryToggle = (categoryId: string) => {
        setFilters((prev) => {
            const currentCategories = prev.category || [];
            const newCategories = currentCategories.includes(categoryId)
                ? currentCategories.filter((id) => id !== categoryId)
                : [...currentCategories, categoryId];

            return {
                ...prev,
                category: newCategories.length > 0 ? newCategories : undefined,
            };
        });
    };

    const clearFilters = () => {
        setFilters({});
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            data-oid="63zxm:5"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                data-oid="fa1-voh"
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-6 border-b border-gray-200"
                    data-oid="d2w9o-w"
                >
                    <h2 className="text-2xl font-bold text-gray-900" data-oid="dmi27_:">
                        Advanced Search
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        data-oid="0kq:a3o"
                    >
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="la0fb1l"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                                data-oid="l92lny4"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6" data-oid="osorntj">
                    {/* Search Query */}
                    <div data-oid="vcn9v31">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="iq97ssb"
                        >
                            Search Terms
                        </label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter medicines, conditions, or pharmacy names..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                            data-oid="78vs4t7"
                        />
                    </div>

                    {/* Categories */}
                    <div data-oid="sk-q:t_">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-3"
                            data-oid="t69zk97"
                        >
                            Categories
                        </label>
                        <div className="grid grid-cols-2 gap-3" data-oid="-caetdl">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center"
                                    data-oid="58zq_of"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.category?.includes(category.id) || false}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                                        data-oid="s8pr:-9"
                                    />

                                    <span className="ml-2 text-sm text-gray-700" data-oid="eqxepv.">
                                        {category.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div data-oid="vk77-u_">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-3"
                            data-oid="z7n8kc5"
                        >
                            Price Range (EGP)
                        </label>
                        <div className="grid grid-cols-2 gap-3" data-oid="8n0ey-z">
                            <div data-oid="e:0fdzz">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="7a891:k"
                                >
                                    Minimum
                                </label>
                                <input
                                    type="number"
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
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    data-oid="56hnn5r"
                                />
                            </div>
                            <div data-oid="e05w50p">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="pui1uak"
                                >
                                    Maximum
                                </label>
                                <input
                                    type="number"
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
                                    placeholder="1000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    data-oid="r0ge5c2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div data-oid="653mvme">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-3"
                            data-oid="gmrramz"
                        >
                            Minimum Rating
                        </label>
                        <select
                            value={filters.rating || ''}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    rating: e.target.value ? Number(e.target.value) : undefined,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                            data-oid="rte91z5"
                        >
                            <option value="" data-oid="1oo567x">
                                Any Rating
                            </option>
                            <option value="4" data-oid="70y714e">
                                4+ Stars
                            </option>
                            <option value="3" data-oid="vb5bq.x">
                                3+ Stars
                            </option>
                            <option value="2" data-oid="75fit9p">
                                2+ Stars
                            </option>
                            <option value="1" data-oid="vc_oxs3">
                                1+ Stars
                            </option>
                        </select>
                    </div>

                    {/* Availability Options */}
                    <div data-oid="icbh81l">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-3"
                            data-oid="z.lo07r"
                        >
                            Availability
                        </label>
                        <div className="space-y-2" data-oid="idf8cr_">
                            <label className="flex items-center" data-oid="fkz4awk">
                                <input
                                    type="checkbox"
                                    checked={filters.inStockOnly || false}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            inStockOnly: e.target.checked,
                                        }))
                                    }
                                    className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                                    data-oid="mdql7h5"
                                />

                                <span className="ml-2 text-sm text-gray-700" data-oid="y50zw2c">
                                    In Stock Only
                                </span>
                            </label>
                            <label className="flex items-center" data-oid="-5tlxpq">
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
                                    data-oid="cvyhc7w"
                                />

                                <span className="ml-2 text-sm text-gray-700" data-oid="z4tzv3t">
                                    Prescription Only
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div data-oid="d:.812p">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-3"
                            data-oid="n52r6im"
                        >
                            Sort Results By
                        </label>
                        <select
                            value={filters.sortBy || 'relevance'}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    sortBy: e.target.value as any,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                            data-oid="ptfbrw8"
                        >
                            <option value="relevance" data-oid="1qg-xh8">
                                Relevance
                            </option>
                            <option value="price-low" data-oid="ralrh05">
                                Price: Low to High
                            </option>
                            <option value="price-high" data-oid="08ec:pu">
                                Price: High to Low
                            </option>
                            <option value="rating" data-oid="n9x4x:y">
                                Highest Rated
                            </option>
                            <option value="name" data-oid="pcar9zw">
                                Name A-Z
                            </option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="flex items-center justify-between p-6 border-t border-gray-200"
                    data-oid="4ret.y6"
                >
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:text-gray-800"
                        data-oid="ajaqqoy"
                    >
                        Clear All Filters
                    </button>
                    <div className="flex items-center space-x-3" data-oid="2mdjpvc">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            data-oid="src:bn3"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-lg font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                            data-oid="13dffrv"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
