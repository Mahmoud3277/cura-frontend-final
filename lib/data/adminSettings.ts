// Admin settings for city and governorate management
export interface AdminCitySettings {
    allowCrossCityOrders: boolean;
    enabledGovernorateIds: string[];
    enabledCityIds: string[];
    defaultCity: string;
    canAddNewCities: boolean;
    lastUpdated: string;
}

// Default admin settings (Multiple major cities enabled)
export const defaultAdminSettings: AdminCitySettings = {
    allowCrossCityOrders: false,
    enabledGovernorateIds: ['ismailia', 'cairo', 'alexandria', 'giza', 'dakahlia', 'gharbia'], // Major governorates enabled
    enabledCityIds: [
        'ismailia-city', // Original default
        'cairo-city', // Major city
        'alexandria-city', // Major city
        'giza-city', // Major city
        'mansoura', // Major city
        'tanta', // Major city
    ],
    defaultCity: 'ismailia-city',
    canAddNewCities: true,
    lastUpdated: new Date().toISOString(),
};

// Helper functions for admin settings
export function isGovernorateEnabled(governorateId: string, settings: AdminCitySettings): boolean {
    return settings.enabledGovernorateIds.includes(governorateId);
}

export function isCityEnabled(cityId: string, settings: AdminCitySettings): boolean {
    return settings.enabledCityIds.includes(cityId);
}

export function enableGovernorate(
    governorateId: string,
    settings: AdminCitySettings,
): AdminCitySettings {
    return {
        ...settings,
        enabledGovernorateIds: [...new Set([...settings.enabledGovernorateIds, governorateId])],
        lastUpdated: new Date().toISOString(),
    };
}

export function disableGovernorate(
    governorateId: string,
    settings: AdminCitySettings,
): AdminCitySettings {
    return {
        ...settings,
        enabledGovernorateIds: settings.enabledGovernorateIds.filter((id) => id !== governorateId),
        lastUpdated: new Date().toISOString(),
    };
}

export function enableCity(cityId: string, settings: AdminCitySettings): AdminCitySettings {
    return {
        ...settings,
        enabledCityIds: [...new Set([...settings.enabledCityIds, cityId])],
        lastUpdated: new Date().toISOString(),
    };
}

export function disableCity(cityId: string, settings: AdminCitySettings): AdminCitySettings {
    return {
        ...settings,
        enabledCityIds: settings.enabledCityIds.filter((id) => id !== cityId),
        lastUpdated: new Date().toISOString(),
    };
}

// Interface for adding new cities dynamically
export interface NewCityData {
    nameEn: string;
    nameAr: string;
    governorateId: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    estimatedPharmacyCount?: number;
    estimatedDoctorCount?: number;
}

// Helper function to enable multiple cities for testing
export function enableMultipleCities(
    cityIds: string[],
    settings: AdminCitySettings,
): AdminCitySettings {
    return {
        ...settings,
        enabledCityIds: [...new Set([...settings.enabledCityIds, ...cityIds])],
        lastUpdated: new Date().toISOString(),
    };
}

// Helper function to enable multiple governorates for testing
export function enableMultipleGovernorates(
    governorateIds: string[],
    settings: AdminCitySettings,
): AdminCitySettings {
    return {
        ...settings,
        enabledGovernorateIds: [...new Set([...settings.enabledGovernorateIds, ...governorateIds])],
        lastUpdated: new Date().toISOString(),
    };
}

// Preset settings for testing with multiple cities enabled
export const testAdminSettings: AdminCitySettings = {
    allowCrossCityOrders: true,
    enabledGovernorateIds: ['ismailia', 'cairo', 'alexandria', 'giza', 'port-said'],
    enabledCityIds: [
        'ismailia-city',
        'fayed',
        'abu-suwir',
        'qantara',
        'cairo-city',
        'new-cairo',
        'helwan',
        'maadi',
        'alexandria-city',
        'borg-el-arab',
        'giza-city',
        '6th-october',
        'port-said-city',
        'port-fouad',
    ],
    defaultCity: 'ismailia-city',
    canAddNewCities: true,
    lastUpdated: new Date().toISOString(),
};
