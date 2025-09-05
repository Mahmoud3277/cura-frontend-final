'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { City, cities, getCityById, getEnabledCities } from '@/lib/data/cities';
import { Governorate, governorates, getEnabledGovernorates } from '@/lib/data/governorates';
import {
    AdminCitySettings,
    defaultAdminSettings,
    testAdminSettings,
} from '@/lib/data/adminSettings';

interface CityContextType {
    selectedCity: City | null;
    setSelectedCity: (city: City | null) => void;
    isLoading: boolean;
    availableCities: City[]; // Only enabled cities
    allCities: City[]; // All cities (for admin)
    availableGovernorates: Governorate[]; // Only enabled governorates
    allGovernorates: Governorate[]; // All governorates (for admin)
    adminSettings: AdminCitySettings;
    updateAdminSettings: (settings: AdminCitySettings) => void;
    refreshCities: () => void;
    enableTestSettings: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
    const [selectedCity, setSelectedCityState] = useState<City | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [adminSettings, setAdminSettings] = useState<AdminCitySettings>(defaultAdminSettings);

    // Get enabled cities and governorates based on admin settings
    const availableCities = cities.filter((city) => adminSettings.enabledCityIds.includes(city.id));
    const availableGovernorates = governorates.filter((gov) =>
        adminSettings.enabledGovernorateIds.includes(gov.id),
    );

    // Debug logging (commented out for production)
    // console.log('CityContext Debug:', {
    //     adminSettings,
    //     enabledCityIds: adminSettings.enabledCityIds,
    //     availableCitiesCount: availableCities.length,
    //     availableCities: availableCities.map((c) => c.nameEn),
    //     totalCities: cities.length,
    // });

    useEffect(() => {
        // Load admin settings from localStorage
        const savedSettings = localStorage.getItem('cura_admin_city_settings');
        let currentSettings = defaultAdminSettings;

        if (savedSettings) {
            try {
                currentSettings = JSON.parse(savedSettings);
                setAdminSettings(currentSettings);
            } catch (error) {
                console.error('Error loading admin settings:', error);
            }
        }

        // Load selected city from localStorage
        const savedCityId = localStorage.getItem('cura_selected_city');
        if (savedCityId) {
            const city = getCityById(savedCityId);
            // Only set if city is enabled by admin settings
            if (city && currentSettings.enabledCityIds.includes(city.id)) {
                setSelectedCityState(city);
            } else {
                // If saved city is disabled, clear it and set default
                localStorage.removeItem('cura_selected_city');
                const defaultCity = getCityById(currentSettings.defaultCity);
                if (defaultCity && currentSettings.enabledCityIds.includes(defaultCity.id)) {
                    setSelectedCityState(defaultCity);
                    localStorage.setItem('cura_selected_city', defaultCity.id);
                }
            }
        } else {
            // No saved city, set default (Ismailia)
            const defaultCity = getCityById(currentSettings.defaultCity);
            if (defaultCity && currentSettings.enabledCityIds.includes(defaultCity.id)) {
                setSelectedCityState(defaultCity);
                localStorage.setItem('cura_selected_city', defaultCity.id);
            }
        }

        setIsLoading(false);
    }, []);

    const setSelectedCity = (city: City | null) => {
        // Only allow selection of cities enabled by admin settings
        if (city && !adminSettings.enabledCityIds.includes(city.id)) {
            console.warn('Cannot select disabled city:', city.nameEn);
            return;
        }

        setSelectedCityState(city);
        if (city) {
            localStorage.setItem('cura_selected_city', city.id);
        } else {
            localStorage.removeItem('cura_selected_city');
        }
    };

    const updateAdminSettings = (settings: AdminCitySettings) => {
        setAdminSettings(settings);
        localStorage.setItem('cura_admin_city_settings', JSON.stringify(settings));

        // Update city enabled status based on admin settings
        cities.forEach((city) => {
            city.isEnabled = settings.enabledCityIds.includes(city.id);
        });

        // Update governorate enabled status based on admin settings
        governorates.forEach((gov) => {
            gov.isEnabled = settings.enabledGovernorateIds.includes(gov.id);
        });

        // If current selected city is now disabled, clear it
        if (selectedCity && !settings.enabledCityIds.includes(selectedCity.id)) {
            setSelectedCity(null);
        }

        // Force re-render by updating the state
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 100);
    };

    const refreshCities = () => {
        // Force refresh of city data (useful after admin changes)
        const savedCityId = localStorage.getItem('cura_selected_city');
        if (savedCityId) {
            const city = getCityById(savedCityId);
            if (city && city.isEnabled) {
                setSelectedCityState(city);
            } else {
                setSelectedCity(null);
            }
        }
    };

    const enableTestSettings = () => {
        // Enable test settings with multiple cities for testing
        console.log('Enabling test settings...');
        console.log('Current admin settings:', adminSettings);
        console.log('Test admin settings:', testAdminSettings);
        updateAdminSettings(testAdminSettings);
        console.log('Test settings enabled!');
    };

    const value: CityContextType = {
        selectedCity,
        setSelectedCity,
        isLoading,
        availableCities,
        allCities: cities,
        availableGovernorates,
        allGovernorates: governorates,
        adminSettings,
        updateAdminSettings,
        refreshCities,
        enableTestSettings,
    };

    return (
        <CityContext.Provider value={value} data-oid="hi0tzay">
            {children}
        </CityContext.Provider>
    );
}

export function useCity() {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
}

// Helper hook for admin-only features
export function useCityAdmin() {
    const context = useCity();
    return {
        allCities: context.allCities,
        allGovernorates: context.allGovernorates,
        adminSettings: context.adminSettings,
        updateAdminSettings: context.updateAdminSettings,
        refreshCities: context.refreshCities,
    };
}
