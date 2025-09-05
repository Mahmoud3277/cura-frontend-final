'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCity } from '@/lib/contexts/CityContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import {
    pharmacies,
    getPharmaciesByCity,
    getPharmaciesByGovernorate,
    searchPharmacies,
} from '@/lib/data/pharmacies';
import { cities } from '@/lib/data/cities';
import { StoreMap } from './StoreMap';
import { PharmacyCard } from './PharmacyCard';
import { StoreFilters } from './StoreFilters';

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

export function StoreLocator() {
    const { t } = useTranslation();
    const { selectedCity, availableCities, availableGovernorates } = useCity();
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        cityId: selectedCity?.id || '',
        governorateId: selectedCity?.governorateId || '',
        specialties: [],
        features: [],
        rating: 0,
        isOpen: false,
        hasDelivery: false,
        maxDistance: 50,
    });
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

    // Update filters when selected city changes
    useEffect(() => {
        if (selectedCity) {
            setFilters((prev) => ({
                ...prev,
                cityId: selectedCity.id,
                governorateId: selectedCity.governorateId,
            }));
        }
    }, [selectedCity]);

    // Filter pharmacies based on current filters
    const filteredPharmacies = useMemo(() => {
        let result = pharmacies.filter((pharmacy) => pharmacy.isActive);

        // Filter by enabled cities only
        const enabledCityIds = availableCities.map((city) => city.id);
        result = result.filter((pharmacy) => enabledCityIds.includes(pharmacy.cityId));

        // Search filter
        if (filters.search) {
            result = searchPharmacies(filters.search).filter((pharmacy) =>
                enabledCityIds.includes(pharmacy.cityId),
            );
        }

        // City filter
        if (filters.cityId) {
            result = result.filter((pharmacy) => pharmacy.cityId === filters.cityId);
        } else if (filters.governorateId) {
            // If no specific city, filter by governorate
            result = result.filter((pharmacy) => pharmacy.governorateId === filters.governorateId);
        }

        // Specialty filter
        if (filters.specialties.length > 0) {
            result = result.filter((pharmacy) =>
                filters.specialties.some((specialty) => pharmacy.specialties.includes(specialty)),
            );
        }

        // Features filter
        if (filters.features.length > 0) {
            result = result.filter((pharmacy) =>
                filters.features.some((feature) => pharmacy.features.includes(feature)),
            );
        }

        // Rating filter
        if (filters.rating > 0) {
            result = result.filter((pharmacy) => pharmacy.rating >= filters.rating);
        }

        // Open now filter
        if (filters.isOpen) {
            const now = new Date();
            const currentHour = now.getHours();
            result = result.filter((pharmacy) => {
                if (pharmacy.workingHours.is24Hours) return true;
                const openHour = parseInt(pharmacy.workingHours.open.split(':')[0]);
                const closeHour = parseInt(pharmacy.workingHours.close.split(':')[0]);
                return currentHour >= openHour && currentHour < closeHour;
            });
        }

        // Delivery filter
        if (filters.hasDelivery) {
            result = result.filter((pharmacy) => pharmacy.features.includes('home_delivery'));
        }

        // Sort by rating and distance (mock distance for now)
        result.sort((a, b) => {
            // Prioritize selected city pharmacies
            if (selectedCity) {
                if (a.cityId === selectedCity.id && b.cityId !== selectedCity.id) return -1;
                if (b.cityId === selectedCity.id && a.cityId !== selectedCity.id) return 1;
            }
            // Then sort by rating
            return b.rating - a.rating;
        });

        return result;
    }, [filters, availableCities, selectedCity]);

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            cityId: selectedCity?.id || '',
            governorateId: selectedCity?.governorateId || '',
            specialties: [],
            features: [],
            rating: 0,
            isOpen: false,
            hasDelivery: false,
            maxDistance: 50,
        });
    };

    const getCityName = (cityId: string) => {
        const city = cities.find((c) => c.id === cityId);
        return city?.nameEn || cityId;
    };

    return (
        <div className="space-y-6" data-oid="q0poodr">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between" data-oid="2j7xom-">
                <div className="flex items-center space-x-4" data-oid="zsro89u">
                    <h2 className="text-xl font-semibold text-gray-900" data-oid="n4i0x01">
                        {t('storeLocator.pharmaciesFound', { count: filteredPharmacies.length })}
                    </h2>
                    {filters.cityId && (
                        <span className="text-sm text-gray-600" data-oid="4d9a3kq">
                            {t('storeLocator.inCity', { city: getCityName(filters.cityId) })}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-2" data-oid="-vpmpdp">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            viewMode === 'list'
                                ? 'bg-cura-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        data-oid="dxy_iap"
                    >
                        📋 {t('subscription.storeLocator.listView')}
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            viewMode === 'map'
                                ? 'bg-cura-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        data-oid="4.kku_q"
                    >
                        🗺️ {t('subscription.storeLocator.mapView')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" data-oid="ynni_ns">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1" data-oid=":44vfg2">
                    <StoreFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                        availableCities={availableCities}
                        availableGovernorates={availableGovernorates}
                        data-oid="f5r6-00"
                    />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3" data-oid="pjnky5u">
                    {viewMode === 'list' ? (
                        <div className="space-y-4" data-oid="878vn1.">
                            {filteredPharmacies.length > 0 ? (
                                filteredPharmacies.map((pharmacy) => (
                                    <PharmacyCard
                                        key={pharmacy.id}
                                        pharmacy={pharmacy}
                                        isSelected={selectedPharmacy === pharmacy.id}
                                        onSelect={() =>
                                            setSelectedPharmacy(
                                                selectedPharmacy === pharmacy.id
                                                    ? null
                                                    : pharmacy.id,
                                            )
                                        }
                                        showDistance={true}
                                        selectedCity={selectedCity}
                                        data-oid="wk2v:vd"
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12" data-oid="u3fquso">
                                    <div className="text-6xl mb-4" data-oid="_mruh9s">
                                        🏪
                                    </div>
                                    <h3
                                        className="text-lg font-medium text-gray-900 mb-2"
                                        data-oid="apxcxfa"
                                    >
                                        {t('subscription.storeLocator.noPharmaciesFound')}
                                    </h3>
                                    <p className="text-gray-600 mb-4" data-oid=":6v.ylz">
                                        {t('subscription.storeLocator.noPharmaciesDescription')}
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="bg-cura-primary text-white px-4 py-2 rounded-lg hover:bg-cura-primary/90 transition-colors"
                                        data-oid=".6jocas"
                                    >
                                        {t('subscription.storeLocator.clearFilters')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            data-oid="mbg8707"
                        >
                            <StoreMap
                                pharmacies={filteredPharmacies}
                                selectedPharmacy={selectedPharmacy}
                                onPharmacySelect={setSelectedPharmacy}
                                selectedCity={selectedCity}
                                data-oid="5u53838"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
