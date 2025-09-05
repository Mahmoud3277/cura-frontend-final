'use client';

import { useState, useEffect } from 'react';
import { useCity } from '@/lib/contexts/CityContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { fetchMedicineCategories, fetchMedicineForms } from '@/lib/data/medicineData';

interface FilterOptions {
    categories: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    sortBy: string;
    inStockOnly: boolean;
    prescriptionOnly: boolean;
    minRating: number;
    selectedCities: string[];
    selectedPharmacies: string[];
}

interface ProductFiltersProps {
    filters: FilterOptions;
    onFiltersChange: (filters: Partial<FilterOptions>) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    availablePharmacies?: Array<{ id: string; name: string; cityName: string; count: number }>;
    isMedicinePage?: boolean;
    totalProducts:number
}

export function ProductFilters({
    filters,
    onFiltersChange,
    selectedCategory,
    onCategoryChange,
    availablePharmacies = [],
    isMedicinePage = false,
    totalProducts
}: ProductFiltersProps) {
    console.log(totalProducts)
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    
    const [priceRange, setPriceRange] = useState({
        min: filters.priceRange.min,
        max: filters.priceRange.max,
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>([]);
    const [forms, setForms] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Load categories and forms from API
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                setLoading(true);
                const [categoriesData, formsData] = await Promise.all([
                    fetchMedicineCategories(),
                    fetchMedicineForms(),
                ]);

                // Process categories with mock counts (in real app, you'd get these from API)
                const processedCategories = [
                    { id: 'all', name: 'All Products', count: totalProducts },
                    ...categoriesData.map(cat => ({
                        id: cat,
                        name: formatCategoryName(cat),
                        count: Math.floor(Math.random() * 200) + 50, // Mock count
                    }))
                ];

                // Filter categories for medicine pages
                const filteredCategories = isMedicinePage 
                    ? processedCategories.filter(cat => 
                        ['all', 'otc', 'prescription'].includes(cat.id) || 
                        ['analgesic', 'antibiotic', 'antacid', 'vitamin'].includes(cat.id)
                    )
                    : processedCategories;

                setCategories(filteredCategories);
                setForms(formsData);
            } catch (error) {
                console.error('Error loading filter options:', error);
                // Fallback data
                setCategories([
                    { id: 'all', name: 'All Products', count: 1200 },
                    { id: 'otc', name: 'OTC', count: 300 },
                    { id: 'prescription', name: 'Prescription Medicines', count: 500 },
                ]);
                setForms(['tablet', 'capsule', 'syrup', 'injection']);
            } finally {
                setLoading(false);
            }
        };

        loadFilterOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMedicinePage]);

    // Update local price range when filters change
    useEffect(() => {
        setPriceRange(filters.priceRange);
    }, [filters.priceRange]);

    const formatCategoryName = (category: string): string => {
        return category
            .split(/[-_\s]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        const newRange = { ...priceRange, [type]: value };
        setPriceRange(newRange);
        onFiltersChange({ priceRange: newRange });
    };

    const clearAllFilters = () => {
        onCategoryChange('all');
        const defaultRange = { min: 0, max: 1000 };
        setPriceRange(defaultRange);
        onFiltersChange({
            priceRange: defaultRange,
            sortBy: 'name',
            inStockOnly: false,
            prescriptionOnly: false,
            minRating: 0,
            selectedCities: [],
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 lg:sticky lg:top-24">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 lg:sticky lg:top-24">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <span className="text-lg font-semibold text-gray-900">
                        Filters
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Filter Content */}
            <div className={`${isExpanded ? 'block' : 'hidden'} lg:block p-4 lg:p-6`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Filters
                    </h3>
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-[#1F1F6F] hover:text-[#14274E] font-medium transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                {/* Categories */}
                {/* <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                        Categories
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onCategoryChange(category.id);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                type="button"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">
                                        {category.name}
                                    </span>
                                    <span
                                        className={`text-xs ${
                                            selectedCategory === category.id
                                                ? 'text-white/80'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {category.count}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div> */}

                {/* Price Range - Hidden for medicine pages */}
                {!isMedicinePage && (
                    <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                            Price Range (EGP)
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) =>
                                        handlePriceChange('min', Number(e.target.value))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                                />
                                <span className="text-gray-500">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) =>
                                        handlePriceChange('max', Number(e.target.value))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>EGP 0</span>
                                <span>EGP 1000+</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Medicine Form Filter - Only for medicine pages */}
                {isMedicinePage && forms.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                            Form
                        </h4>
                        <select
                            onChange={(e) => onFiltersChange({ selectedForm: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                        >
                            <option value="">All Forms</option>
                            {forms.map((form) => (
                                <option key={form} value={form}>
                                    {formatCategoryName(form)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Rating Filter - Hidden for medicine categories and medicine pages */}
                {!isMedicinePage &&
                    !['prescription', 'otc', 'medications'].includes(selectedCategory) && (
                        <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">
                                Minimum Rating
                            </h4>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => onFiltersChange({ minRating: rating })}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                                            filters.minRating === rating
                                                ? 'bg-[#1F1F6F]/10 text-[#1F1F6F] border border-[#1F1F6F]/20'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-2 text-sm">& up</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                {/* Availability Filters */}
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                        Availability
                    </h4>
                    <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.inStockOnly}
                                onChange={(e) => onFiltersChange({ inStockOnly: e.target.checked })}
                                className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                In Stock Only
                            </span>
                        </label>
                        
                        {isMedicinePage && (
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.prescriptionOnly}
                                    onChange={(e) =>
                                        onFiltersChange({ prescriptionOnly: e.target.checked })
                                    }
                                    className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Prescription Required
                                </span>
                            </label>
                        )}
                    </div>
                </div>

                {/* Sort Options */}
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                        Sort By
                    </h4>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm"
                    >
                        <option value="name">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        {!isMedicinePage && (
                            <>
                                <option value="price-low">Price (Low to High)</option>
                                <option value="price-high">Price (High to Low)</option>
                                <option value="rating">Highest Rated</option>
                                <option value="reviews">Most Reviewed</option>
                            </>
                        )}
                        <option value="newest">Newest First</option>
                    </select>
                </div>
            </div>
        </div>
    );
}