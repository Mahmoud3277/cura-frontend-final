'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { City } from '@/lib/data/cities';
import { Governorate } from '@/lib/data/governorates';

interface FilterState {
    search: string;
    cityId: string;
    governorateId: string;
    specialties: string[];
    features: string[];
    rating: number;
    isOpen: boolean;
    hasDelivery: boolean;
    maxDistance: number;
}

interface StoreFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: Partial<FilterState>) => void;
    onClearFilters: () => void;
    availableCities: City[];
    availableGovernorates: Governorate[];
}

export function StoreFilters({
    filters,
    onFilterChange,
    onClearFilters,
    availableCities,
    availableGovernorates,
}: StoreFiltersProps) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    const specialtyOptions = [
        {
            value: 'prescription',
            label: t('subscription.storeLocator.filters.specialties.prescription'),
        },
        { value: 'otc', label: t('subscription.storeLocator.filters.specialties.otc') },
        {
            value: 'supplements',
            label: t('subscription.storeLocator.filters.specialties.supplements'),
        },
        { value: 'skincare', label: t('subscription.storeLocator.filters.specialties.skincare') },
        { value: 'baby', label: t('subscription.storeLocator.filters.specialties.baby') },
        { value: 'medical', label: t('subscription.storeLocator.filters.specialties.medical') },
        { value: 'vitamins', label: t('subscription.storeLocator.filters.specialties.vitamins') },
        { value: 'cosmetics', label: t('subscription.storeLocator.filters.specialties.cosmetics') },
    ];

    const featureOptions = [
        {
            value: 'home_delivery',
            label: t('subscription.storeLocator.filters.features.homeDelivery'),
        },
        {
            value: 'consultation',
            label: t('subscription.storeLocator.filters.features.consultation'),
        },
        {
            value: 'prescription_reading',
            label: t('subscription.storeLocator.filters.features.prescriptionReading'),
        },
        { value: 'emergency', label: t('subscription.storeLocator.filters.features.emergency') },
        { value: '24_hours', label: t('subscription.storeLocator.filters.features.24Hours') },
        { value: 'baby_care', label: t('subscription.storeLocator.filters.features.babyCare') },
        {
            value: 'nutrition_advice',
            label: t('subscription.storeLocator.filters.features.nutritionAdvice'),
        },
        {
            value: 'beauty_consultation',
            label: t('subscription.storeLocator.filters.features.beautyConsultation'),
        },
    ];

    const handleSpecialtyChange = (specialty: string) => {
        const newSpecialties = filters.specialties.includes(specialty)
            ? filters.specialties.filter((s) => s !== specialty)
            : [...filters.specialties, specialty];
        onFilterChange({ specialties: newSpecialties });
    };

    const handleFeatureChange = (feature: string) => {
        const newFeatures = filters.features.includes(feature)
            ? filters.features.filter((f) => f !== feature)
            : [...filters.features, feature];
        onFilterChange({ features: newFeatures });
    };

    const getCitiesForGovernorate = (governorateId: string) => {
        return availableCities.filter((city) => city.governorateId === governorateId);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            data-oid="r45i77s"
        >
            <div className="flex items-center justify-between mb-6" data-oid="y-:y25q">
                <h3 className="text-lg font-semibold text-gray-900" data-oid="sxsj2vx">
                    {t('subscription.storeLocator.filters.title')}
                </h3>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-cura-primary hover:text-cura-primary/80 transition-colors"
                    data-oid="5gjqnx7"
                >
                    {t('subscription.storeLocator.filters.clearAll')}
                </button>
            </div>

            <div className="space-y-6" data-oid="7oy4c7w">
                {/* Search */}
                <div data-oid="j4ph:aw">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        data-oid="jcnlavn"
                    >
                        {t('subscription.storeLocator.filters.search')}
                    </label>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        placeholder={t('subscription.storeLocator.filters.searchPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-transparent"
                        data-oid="1q95j_-"
                    />
                </div>

                {/* Location Filters */}
                <div data-oid="4ffivvp">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        data-oid="u55wisp"
                    >
                        {t('subscription.storeLocator.filters.governorate')}
                    </label>
                    <select
                        value={filters.governorateId}
                        onChange={(e) => {
                            onFilterChange({
                                governorateId: e.target.value,
                                cityId: '', // Reset city when governorate changes
                            });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-transparent"
                        data-oid="s414o:k"
                    >
                        <option value="" data-oid="l9ny9j-">
                            {t('subscription.storeLocator.filters.allGovernorates')}
                        </option>
                        {availableGovernorates.map((governorate) => (
                            <option key={governorate.id} value={governorate.id} data-oid="x2a1j6n">
                                {governorate.nameEn}
                            </option>
                        ))}
                    </select>
                </div>

                <div data-oid="jyc.45c">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        data-oid="asd5fd8"
                    >
                        {t('subscription.storeLocator.filters.city')}
                    </label>
                    <select
                        value={filters.cityId}
                        onChange={(e) => onFilterChange({ cityId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-transparent"
                        data-oid="n0ksb5w"
                    >
                        <option value="" data-oid="tocq5h8">
                            {t('subscription.storeLocator.filters.allCities')}
                        </option>
                        {(filters.governorateId
                            ? getCitiesForGovernorate(filters.governorateId)
                            : availableCities
                        ).map((city) => (
                            <option key={city.id} value={city.id} data-oid="z6:am-5">
                                {city.nameEn}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quick Filters */}
                <div data-oid="cgowdtn">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-3"
                        data-oid="p04q.-p"
                    >
                        {t('subscription.storeLocator.filters.quickFilters')}
                    </label>
                    <div className="space-y-2" data-oid="xmefv:6">
                        <label className="flex items-center" data-oid="k9f:bex">
                            <input
                                type="checkbox"
                                checked={filters.isOpen}
                                onChange={(e) => onFilterChange({ isOpen: e.target.checked })}
                                className="rounded border-gray-300 text-cura-primary focus:ring-cura-primary"
                                data-oid="dlaqaiw"
                            />

                            <span className="ml-2 text-sm text-gray-700" data-oid="iv2sm:p">
                                {t('subscription.storeLocator.filters.openNow')}
                            </span>
                        </label>
                        <label className="flex items-center" data-oid="3nocv4s">
                            <input
                                type="checkbox"
                                checked={filters.hasDelivery}
                                onChange={(e) => onFilterChange({ hasDelivery: e.target.checked })}
                                className="rounded border-gray-300 text-cura-primary focus:ring-cura-primary"
                                data-oid="xo1t.3n"
                            />

                            <span className="ml-2 text-sm text-gray-700" data-oid="_.__hsk">
                                {t('subscription.storeLocator.filters.hasDelivery')}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Rating Filter */}
                <div data-oid="m9ogs4w">
                    <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        data-oid="hibso31"
                    >
                        {t('subscription.storeLocator.filters.minimumRating')}
                    </label>
                    <select
                        value={filters.rating}
                        onChange={(e) => onFilterChange({ rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-transparent"
                        data-oid="dsej_6s"
                    >
                        <option value={0} data-oid="wvq5xtu">
                            {t('subscription.storeLocator.filters.anyRating')}
                        </option>
                        <option value={4} data-oid="tskh0n0">
                            4+ ⭐
                        </option>
                        <option value={4.5} data-oid="-i50:0w">
                            4.5+ ⭐
                        </option>
                    </select>
                </div>

                {/* Advanced Filters Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full text-left text-sm font-medium text-cura-primary hover:text-cura-primary/80 transition-colors"
                    data-oid="pvhgo9t"
                >
                    {isExpanded ? '▼' : '▶'}{' '}
                    {t('subscription.storeLocator.filters.advancedFilters')}
                </button>

                {/* Advanced Filters */}
                {isExpanded && (
                    <div className="space-y-6 pt-4 border-t border-gray-200" data-oid="ylhdhi.">
                        {/* Specialties */}
                        <div data-oid="3d18fo9">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-3"
                                data-oid="zhm9or3"
                            >
                                {t('subscription.storeLocator.filters.specialties.title')}
                            </label>
                            <div className="space-y-2 max-h-40 overflow-y-auto" data-oid="omr-pfs">
                                {specialtyOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center"
                                        data-oid="qy1u5:l"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.specialties.includes(option.value)}
                                            onChange={() => handleSpecialtyChange(option.value)}
                                            className="rounded border-gray-300 text-cura-primary focus:ring-cura-primary"
                                            data-oid="s.pe1tf"
                                        />

                                        <span
                                            className="ml-2 text-sm text-gray-700"
                                            data-oid="4z82p6u"
                                        >
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div data-oid="ml5l:by">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-3"
                                data-oid="m2bx2s4"
                            >
                                {t('subscription.storeLocator.filters.features.title')}
                            </label>
                            <div className="space-y-2 max-h-40 overflow-y-auto" data-oid="kmotbcr">
                                {featureOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center"
                                        data-oid="6wulb4y"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.features.includes(option.value)}
                                            onChange={() => handleFeatureChange(option.value)}
                                            className="rounded border-gray-300 text-cura-primary focus:ring-cura-primary"
                                            data-oid="87b-gu3"
                                        />

                                        <span
                                            className="ml-2 text-sm text-gray-700"
                                            data-oid="wvj3c5p"
                                        >
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Distance Filter */}
                        <div data-oid="nexewb2">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="rh7hwj6"
                            >
                                {t('subscription.storeLocator.filters.maxDistance')} (
                                {filters.maxDistance} km)
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={filters.maxDistance}
                                onChange={(e) =>
                                    onFilterChange({ maxDistance: Number(e.target.value) })
                                }
                                className="w-full"
                                data-oid="h_83eyi"
                            />

                            <div
                                className="flex justify-between text-xs text-gray-500 mt-1"
                                data-oid="p8pdol0"
                            >
                                <span data-oid="qrsl20a">5 km</span>
                                <span data-oid="bx8pc2z">100 km</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
