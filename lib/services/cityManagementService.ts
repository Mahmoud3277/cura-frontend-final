// City Management Service - Comprehensive city and governorate administration
// Integrated with backend API endpoints

import { cities as originalCities, City, getCitiesByGovernorate } from '@/lib/data/cities';
import { governorates, Governorate } from '@/lib/data/governorates';
import { AdminCitySettings, defaultAdminSettings } from '@/lib/data/adminSettings';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface CityManagementStats {
    totalCities: number;
    enabledCities: number;
    totalGovernorates: number;
    enabledGovernorates: number;
    totalPharmacies: number;
    totalDoctors: number;
    coverage: number;
    crossCityOrdersEnabled: boolean;
    lastUpdated: string;
}

export interface GovernorateWithStats extends Governorate {
    totalCities: number;
    enabledCities: number;
    enabledPharmacies: number;
    enabledDoctors: number;
    coveragePercentage: number;
}

export interface CityWithStatus extends City {
    isEnabled: boolean;
    isDefault: boolean;
    governorateEnabled: boolean;
    _id:any
}

export interface NewCityRequest {
    nameEn: string;
    nameAr: string;
    governorateId: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    estimatedPharmacyCount: number;
    estimatedDoctorCount: number;
}

export interface NewGovernorateRequest {
    nameEn: string;
    nameAr: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export interface CityFilters {
    governorateId?: string;
    status?: 'enabled' | 'disabled' | 'all';
    search?: string;
    sortBy?: 'name' | 'governorate' | 'pharmacies' | 'doctors' | 'status';
    sortOrder?: 'asc' | 'desc';
    language?: 'en' | 'ar';
}

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class CityManagementService {
    private adminSettings: AdminCitySettings = defaultAdminSettings;
    private cities: City[] = [...originalCities]; // Create a mutable copy
    private isOnline: boolean = true; // Track if we should use API or fallback to local data

    constructor() {
        // Initialize with data from backend on construction
        this.initializeFromBackend();
    }

    // Initialize service with backend data
    private async initializeFromBackend(): Promise<void> {
        try {
            await this.loadAdminSettings();
            await this.loadCitiesFromBackend();
        } catch (error) {
            console.warn('Failed to initialize from backend, using local data:', error);
            this.isOnline = false;
        }
    }

    // API Helper Methods
    private async apiRequest<T>(endpoint: string, options?: RequestInit): Promise<APIResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            const data = await response.json();
            return data as APIResponse<T>;
        } catch (error) {
            console.error('API Request failed:', error);
            this.isOnline = false;
            throw error;
        }
    }

    // Load admin settings from backend
    private async loadAdminSettings(): Promise<void> {
        try {
            const response = await this.apiRequest<AdminCitySettings>('/locations/settings/admin');
            if (response.success && response.data) {
                this.adminSettings = {
                    ...this.adminSettings,
                    ...response.data,
                    lastUpdated: new Date().toISOString(),
                };
            }
        } catch (error) {
            console.error('Failed to load admin settings:', error);
        }
    }

    // Load cities from backend
    private async loadCitiesFromBackend(): Promise<void> {
        try {
            const response = await this.apiRequest<City[]>('/locations/cities');
            if (response.success && response.data) {
                this.cities = response.data;
            }
        } catch (error) {
            console.error('Failed to load cities from backend:', error);
        }
    }

    // Get current admin settings
    getAdminSettings(): AdminCitySettings {
        return { ...this.adminSettings };
    }

    // Update admin settings (integrated with backend)
    async updateAdminSettings(settings: AdminCitySettings): Promise<boolean> {
        try {
            if (this.isOnline) {
                // Update via API
                const response = await this.apiRequest('/locations/settings/admin', {
                    method: 'PUT',
                    body: JSON.stringify(settings),
                });

                if (response.success) {
                    this.adminSettings = {
                        ...settings,
                        lastUpdated: new Date().toISOString(),
                    };
                    return true;
                }
                return false;
            } else {
                // Fallback to local update
                this.adminSettings = {
                    ...settings,
                    lastUpdated: new Date().toISOString(),
                };
                return true;
            }
        } catch (error) {
            console.error('Failed to update admin settings:', error);
            return false;
        }
    }

    // Get comprehensive statistics (integrated with backend)
    async getStats(): Promise<CityManagementStats> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest<any>('/locations/stats');
                if (response.success && response.data) {
                    const { overview } = response.data;
                    return {
                        totalCities: overview.totalCities,
                        enabledCities: overview.enabledCities,
                        totalGovernorates: overview.totalGovernorates,
                        enabledGovernorates: overview.enabledGovernorates,
                        totalPharmacies: 0, // Calculate from additional API if needed
                        totalDoctors: 0, // Calculate from additional API if needed
                        coverage: (overview.enabledCities / overview.totalCities) * 100,
                        crossCityOrdersEnabled: this.adminSettings.allowCrossCityOrders,
                        lastUpdated: this.adminSettings.lastUpdated,
                    };
                }
            }

            // Fallback to local calculation
            const totalCities = this.cities.length;
            const enabledCities = this.cities.filter((city) =>
                this.adminSettings.enabledCityIds.includes(city.id),
            ).length;

            const totalGovernorates = governorates.length;
            const enabledGovernorates = governorates.filter((gov) =>
                this.adminSettings.enabledGovernorateIds.includes(gov.id),
            ).length;

            const totalPharmacies = this.cities.reduce((sum, city) => sum + city.pharmacyCount, 0);
            const totalDoctors = this.cities.reduce((sum, city) => sum + city.doctorCount, 0);
            const coverage = (enabledCities / totalCities) * 100;

            return {
                totalCities,
                enabledCities,
                totalGovernorates,
                enabledGovernorates,
                totalPharmacies,
                totalDoctors,
                coverage,
                crossCityOrdersEnabled: this.adminSettings.allowCrossCityOrders,
                lastUpdated: this.adminSettings.lastUpdated,
            };
        } catch (error) {
            console.error('Failed to get stats:', error);
            throw error;
        }
    }

    // Get governorates with detailed statistics (integrated with backend)
    async getGovernoratesWithStats(): Promise<GovernorateWithStats[]> {
        try {
            if (this.isOnline) {
                const [governoratesResponse, statsResponse] = await Promise.all([
                    this.apiRequest<Governorate[]>('/locations/governorates'),
                    this.apiRequest<any>('/locations/stats')
                ]);

                if (governoratesResponse.success && statsResponse.success) {
                    const governoratesData = governoratesResponse.data || [];
                    const citiesByGovernorate = statsResponse.data?.citiesByGovernorate || {};

                    return governoratesData.map((governorate) => {
                        const govStats = citiesByGovernorate[governorate.id] || { total: 0, enabled: 0 };
                        const coveragePercentage = govStats.total > 0 ? (govStats.enabled / govStats.total) * 100 : 0;

                        return {
                            ...governorate,
                            totalCities: govStats.total,
                            enabledCities: govStats.enabled,
                            enabledPharmacies: 0, // Calculate from additional API if needed
                            enabledDoctors: 0, // Calculate from additional API if needed
                            coveragePercentage,
                        };
                    });
                }
            }

            // Fallback to local calculation
            return governorates.map((governorate) => {
                const govCities = getCitiesByGovernorate(governorate.id);
                const enabledCities = govCities.filter((city) =>
                    this.adminSettings.enabledCityIds.includes(city.id),
                ).length;

                const enabledPharmacies = govCities
                    .filter((city) => this.adminSettings.enabledCityIds.includes(city.id))
                    .reduce((sum, city) => sum + city.pharmacyCount, 0);

                const enabledDoctors = govCities
                    .filter((city) => this.adminSettings.enabledCityIds.includes(city.id))
                    .reduce((sum, city) => sum + city.doctorCount, 0);

                const coveragePercentage =
                    govCities.length > 0 ? (enabledCities / govCities.length) * 100 : 0;

                return {
                    ...governorate,
                    totalCities: govCities.length,
                    enabledCities,
                    enabledPharmacies,
                    enabledDoctors,
                    coveragePercentage,
                };
            });
        } catch (error) {
            console.error('Failed to get governorates with stats:', error);
            throw error;
        }
    }

    // Get cities with status information (integrated with backend)
    async getCitiesWithStatus(filters?: CityFilters): Promise<CityWithStatus[]> {
        try {
            if (this.isOnline) {
                // Build query parameters
                const params = new URLSearchParams();
                if (filters?.governorateId && filters.governorateId !== 'all') {
                    params.append('governorateId', filters.governorateId);
                }
                if (filters?.status === 'enabled') {
                    params.append('enabled', 'true');
                }
                if (filters?.search) {
                    params.append('search', filters.search);
                }
                if (filters?.language) {
                    params.append('language', filters.language);
                }

                const queryString = params.toString();
                const endpoint = `/locations/cities${queryString ? `?${queryString}` : ''}`;
                
                const response = await this.apiRequest<City[]>(endpoint);
                if (response.success && response.data) {
                    let citiesData = response.data.map((city) => ({
                        ...city,
                        isDefault: this.adminSettings.defaultCity === city.id,
                       
                    }));

                    // Apply additional client-side filtering if needed
                    if (filters?.status === 'disabled') {
                        citiesData = citiesData.filter(city => !city.isEnabled);
                    }

                    // Apply sorting
                    if (filters?.sortBy) {
                        citiesData = this.sortCities(citiesData, filters);
                    }
                    console.log(citiesData, 'from server')
                    return citiesData;
                }
            }

            // Fallback to local filtering
            let filteredCities = this.cities.map((city) => ({
                ...city,
                isEnabled: this.adminSettings.enabledCityIds.includes(city.id),
                isDefault: this.adminSettings.defaultCity === city.id,
                governorateEnabled: this.adminSettings.enabledGovernorateIds.includes(city.governorateId),
            }));

            if (filters) {
                filteredCities = this.applyLocalFilters(filteredCities, filters);
            }

            return filteredCities;
        } catch (error) {
            console.error('Failed to get cities with status:', error);
            throw error;
        }
    }

    // Helper method to sort cities
    private sortCities(cities: CityWithStatus[], filters: CityFilters): CityWithStatus[] {
        return cities.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (filters.sortBy) {
                case 'name':
                    aValue = a.nameEn;
                    bValue = b.nameEn;
                    break;
                case 'governorate':
                    aValue = a.governorateName;
                    bValue = b.governorateName;
                    break;
                case 'pharmacies':
                    aValue = a.pharmacyCount;
                    bValue = b.pharmacyCount;
                    break;
                case 'doctors':
                    aValue = a.doctorCount;
                    bValue = b.doctorCount;
                    break;
                case 'status':
                    aValue = a.isEnabled ? 1 : 0;
                    bValue = b.isEnabled ? 1 : 0;
                    break;
                default:
                    return 0;
            }

            if (typeof aValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return filters.sortOrder === 'desc' ? -comparison : comparison;
            } else {
                const comparison = aValue - bValue;
                return filters.sortOrder === 'desc' ? -comparison : comparison;
            }
        });
    }

    // Helper method to apply local filters
    private applyLocalFilters(cities: CityWithStatus[], filters: CityFilters): CityWithStatus[] {
        let filteredCities = cities;

        // Filter by governorate
        if (filters.governorateId && filters.governorateId !== 'all') {
            filteredCities = filteredCities.filter(
                (city) => city.governorateId === filters.governorateId,
            );
        }

        // Filter by status
        if (filters.status && filters.status !== 'all') {
            filteredCities = filteredCities.filter((city) =>
                filters.status === 'enabled' ? city.isEnabled : !city.isEnabled,
            );
        }

        // Filter by search term
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredCities = filteredCities.filter(
                (city) =>
                    city.nameEn.toLowerCase().includes(searchTerm) ||
                    city.nameAr.includes(filters.search!) ||
                    city.governorateName.toLowerCase().includes(searchTerm) ||
                    city.governorateNameAr.includes(filters.search!),
            );
        }

        // Sort results
        if (filters.sortBy) {
            filteredCities = this.sortCities(filteredCities, filters);
        }

        return filteredCities;
    }

    // Search cities (using backend endpoint)
    async searchCities(query: string, language: 'en' | 'ar' = 'en'): Promise<City[]> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest<City[]>('/locations/cities/search', {
                    method: 'POST',
                    body: JSON.stringify({
                        query,
                        enabledCityIds: this.adminSettings.enabledCityIds,
                        language,
                    }),
                });

                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to local search
            const searchTerm = query.toLowerCase();
            return this.cities.filter((city) => {
                if (!this.adminSettings.enabledCityIds.includes(city.id)) return false;
                
                if (language === 'ar') {
                    return city.nameAr.includes(query) || city.governorateNameAr.includes(query);
                } else {
                    return city.nameEn.toLowerCase().includes(searchTerm) ||
                           city.governorateName.toLowerCase().includes(searchTerm);
                }
            });
        } catch (error) {
            console.error('Failed to search cities:', error);
            return [];
        }
    }

    // Get enabled cities (using backend endpoint)
    async getEnabledCities(): Promise<City[]> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest<City[]>('/locations/cities/enabled/all');
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to local filtering
            return this.cities.filter((city) => 
                this.adminSettings.enabledCityIds.includes(city.id)
            );
        } catch (error) {
            console.error('Failed to get enabled cities:', error);
            return [];
        }
    }

    // Get cities by governorate (using backend endpoint)
    async getCitiesByGovernorate(governorateId: string, enabledOnly: boolean = false): Promise<City[]> {
        try {
            if (this.isOnline) {
                const params = new URLSearchParams();
                if (enabledOnly) {
                    params.append('enabled', 'true');
                }

                const endpoint = enabledOnly 
                    ? `/locations/cities/governorate/${governorateId}/enabled`
                    : `/locations/cities/governorate/${governorateId}?${params.toString()}`;

                const response = await this.apiRequest<City[]>(endpoint);
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to local filtering
            let cities = getCitiesByGovernorate(governorateId);
            if (enabledOnly) {
                cities = cities.filter((city) => 
                    this.adminSettings.enabledCityIds.includes(city.id)
                );
            }
            return cities;
        } catch (error) {
            console.error('Failed to get cities by governorate:', error);
            return [];
        }
    }

    // Validate location (using backend endpoint)
    async validateLocation(cityId?: string, governorateId?: string): Promise<{
        isValid: boolean;
        location?: any;
    }> {
        try {
            if (this.isOnline) {
                const params = new URLSearchParams();
                if (cityId) params.append('cityId', cityId);
                if (governorateId) params.append('governorateId', governorateId);

                const response = await this.apiRequest<any>(`/locations/validate?${params.toString()}`);
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to local validation
            let isValid = false;
            let location = null;

            if (cityId) {
                const city = this.cities.find(c => c.id === cityId && 
                    this.adminSettings.enabledCityIds.includes(c.id));
                if (city) {
                    isValid = true;
                    location = { type: 'city', city };
                }
            } else if (governorateId) {
                const governorate = governorates.find(g => g.id === governorateId &&
                    this.adminSettings.enabledGovernorateIds.includes(g.id));
                if (governorate) {
                    isValid = true;
                    location = { type: 'governorate', governorate };
                }
            }

            return { isValid, location };
        } catch (error) {
            console.error('Failed to validate location:', error);
            return { isValid: false };
        }
    }

    // Get delivery zones for a city (using backend endpoint)
    async getDeliveryZones(cityId: string): Promise<any[]> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest<any[]>(`/locations/cities/${cityId}/delivery-zones`);
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to empty array or local data if available
            return [];
        } catch (error) {
            console.error('Failed to get delivery zones:', error);
            return [];
        }
    }

    // Calculate delivery fee (using backend endpoint)
    async calculateDeliveryFee(cityId: string, address: string, orderValue: number = 0): Promise<{
        deliveryFee: number;
        reason?: string;
        baseDeliveryFee?: number;
        freeDeliveryThreshold?: number;
    }> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest<any>('/locations/delivery-fee', {
                    method: 'POST',
                    body: JSON.stringify({ cityId, address, orderValue }),
                });

                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to default delivery fee calculation
            const baseDeliveryFee = 15;
            const freeDeliveryThreshold = 200;

            if (orderValue >= freeDeliveryThreshold) {
                return {
                    deliveryFee: 0,
                    reason: 'Free delivery threshold met',
                    baseDeliveryFee,
                    freeDeliveryThreshold,
                };
            }

            return {
                deliveryFee: baseDeliveryFee,
                baseDeliveryFee,
                freeDeliveryThreshold,
            };
        } catch (error) {
            console.error('Failed to calculate delivery fee:', error);
            return { deliveryFee: 15 };
        }
    }

    // Enable/disable city (integrated with backend)
    async toggleCityStatus(cityId: string): Promise<boolean> {
        const canToggle = this.canDisableCity(cityId);
        if (!canToggle.canDisable) {
            console.error(canToggle.reason);
            return false;
        }

        try {
            if (this.isOnline) {
                // Call backend API to toggle city status
                const response = await this.apiRequest('/locations/cities/toggle-status', {
                    method: 'POST',
                    body: JSON.stringify({ cityId }),
                });

                if (response.success) {
                    // Update local state
                    const isEnabled = this.adminSettings.enabledCityIds.includes(cityId);
                    if (isEnabled) {
                        this.adminSettings.enabledCityIds = this.adminSettings.enabledCityIds.filter(
                            (id) => id !== cityId,
                        );
                    } else {
                        this.adminSettings.enabledCityIds.push(cityId);
                    }
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local toggle
                const isEnabled = this.adminSettings.enabledCityIds.includes(cityId);

                if (isEnabled) {
                    this.adminSettings.enabledCityIds = this.adminSettings.enabledCityIds.filter(
                        (id) => id !== cityId,
                    );
                } else {
                    this.adminSettings.enabledCityIds.push(cityId);
                }

                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to toggle city status:', error);
            return false;
        }
    }

    // Enable/disable governorate (integrated with backend)
    async toggleGovernorateStatus(governorateId: string): Promise<boolean> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest('/locations/governorates/toggle-status', {
                    method: 'POST',
                    body: JSON.stringify({ governorateId }),
                });

                if (response.success) {
                    // Update local state
                    const isEnabled = this.adminSettings.enabledGovernorateIds.includes(governorateId);
                    if (isEnabled) {
                        this.adminSettings.enabledGovernorateIds =
                            this.adminSettings.enabledGovernorateIds.filter((id) => id !== governorateId);
                    } else {
                        this.adminSettings.enabledGovernorateIds.push(governorateId);
                    }
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local toggle
                const isEnabled = this.adminSettings.enabledGovernorateIds.includes(governorateId);

                if (isEnabled) {
                    this.adminSettings.enabledGovernorateIds =
                        this.adminSettings.enabledGovernorateIds.filter((id) => id !== governorateId);
                } else {
                    this.adminSettings.enabledGovernorateIds.push(governorateId);
                }

                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to toggle governorate status:', error);
            return false;
        }
    }

    // Bulk enable cities
    async bulkEnableCities(cityIds: string[]): Promise<boolean> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest('/locations/cities/bulk-enable', {
                    method: 'POST',
                    body: JSON.stringify({ cityIds }),
                });

                if (response.success) {
                    this.adminSettings.enabledCityIds = [
                        ...new Set([...this.adminSettings.enabledCityIds, ...cityIds]),
                    ];
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation
                this.adminSettings.enabledCityIds = [
                    ...new Set([...this.adminSettings.enabledCityIds, ...cityIds]),
                ];
                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to bulk enable cities:', error);
            return false;
        }
    }

    // Bulk disable cities
    async bulkDisableCities(cityIds: string[]): Promise<boolean> {
        try {
            // Don't disable the default city
            const citiesToDisable = cityIds.filter((id) => id !== this.adminSettings.defaultCity);

            if (this.isOnline) {
                const response = await this.apiRequest('/locations/cities/bulk-disable', {
                    method: 'POST',
                    body: JSON.stringify({ cityIds: citiesToDisable }),
                });

                if (response.success) {
                    this.adminSettings.enabledCityIds = this.adminSettings.enabledCityIds.filter(
                        (id) => !citiesToDisable.includes(id),
                    );
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation
                this.adminSettings.enabledCityIds = this.adminSettings.enabledCityIds.filter(
                    (id) => !citiesToDisable.includes(id),
                );
                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to bulk disable cities:', error);
            return false;
        }
    }

    // Set default city (integrated with backend)
    async setDefaultCity(cityId: string): Promise<boolean> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest('/locations/settings/default-city', {
                    method: 'PUT',
                    body: JSON.stringify({ defaultCity: cityId }),
                });

                if (response.success) {
                    // Ensure the city is enabled
                    if (!this.adminSettings.enabledCityIds.includes(cityId)) {
                        this.adminSettings.enabledCityIds.push(cityId);
                    }
                    this.adminSettings.defaultCity = cityId;
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation
                if (!this.adminSettings.enabledCityIds.includes(cityId)) {
                    this.adminSettings.enabledCityIds.push(cityId);
                }
                this.adminSettings.defaultCity = cityId;
                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to set default city:', error);
            return false;
        }
    }

    // Toggle cross-city orders (integrated with backend)
    async toggleCrossCityOrders(): Promise<boolean> {
        try {
            const newValue = !this.adminSettings.allowCrossCityOrders;

            if (this.isOnline) {
                const response = await this.apiRequest('/locations/settings/cross-city-orders', {
                    method: 'PUT',
                    body: JSON.stringify({ allowCrossCityOrders: newValue }),
                });

                if (response.success) {
                    this.adminSettings.allowCrossCityOrders = newValue;
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation
                this.adminSettings.allowCrossCityOrders = newValue;
                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to toggle cross-city orders:', error);
            return false;
        }
    }

    // Add new city (integrated with backend)
    async addNewCity(cityData: NewCityRequest): Promise<boolean> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest('/locations/cities', {
                    method: 'POST',
                    body: JSON.stringify(cityData),
                });

                if (response.success) {
                    // Reload cities from backend to get the new city
                    await this.loadCitiesFromBackend();
                    
                    // If the governorate is enabled, enable the new city
                    if (this.adminSettings.enabledGovernorateIds.includes(cityData.governorateId)) {
                        const newCityId = response.data?.id || `${cityData.governorateId}-${cityData.nameEn.toLowerCase().replace(/\s+/g, '-')}`;
                        this.adminSettings.enabledCityIds.push(newCityId);
                    }

                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation (mock)
                console.log('Adding new city (offline mode):', cityData);
                if (this.adminSettings.enabledGovernorateIds.includes(cityData.governorateId)) {
                    const newCityId = `${cityData.governorateId}-${cityData.nameEn.toLowerCase().replace(/\s+/g, '-')}`;
                    this.adminSettings.enabledCityIds.push(newCityId);
                }
                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to add new city:', error);
            return false;
        }
    }

    // Update existing city (integrated with backend)
    async updateCity(cityData: {
        id: string;
        nameEn: string;
        nameAr: string;
        governorateId: string;
        pharmacyCount: number;
        doctorCount: number;
    }): Promise<boolean> {
        try {
            // Validate input data
            if (!cityData.id || !cityData.nameEn || !cityData.nameAr || !cityData.governorateId) {
                console.error('Invalid city data provided');
                return false;
            }

            if (this.isOnline) {
                const response = await this.apiRequest(`/locations/cities/${cityData.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(cityData),
                });

                if (response.success) {
                    // Update local cities array
                    const cityIndex = this.cities.findIndex(city => city.id === cityData.id);
                    if (cityIndex !== -1) {
                        this.cities[cityIndex] = { ...this.cities[cityIndex], ...cityData };
                    }

                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation (mock)
                console.log('Updating city (offline mode):', cityData);
                
                // Update local cities array
                const cityIndex = this.cities.findIndex(city => city.id === cityData.id);
                if (cityIndex !== -1) {
                    this.cities[cityIndex] = { ...this.cities[cityIndex], ...cityData };
                }

                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Error updating city:', error);
            return false;
        }
    }

    // Add new governorate (integrated with backend)
    async addNewGovernorate(governorateData: NewGovernorateRequest): Promise<boolean> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest('/locations/governorates', {
                    method: 'POST',
                    body: JSON.stringify(governorateData),
                });

                if (response.success) {
                    // Reload governorates from backend if needed
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation (mock)
                console.log('Adding new governorate (offline mode):', governorateData);
                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to add new governorate:', error);
            return false;
        }
    }

    // Delete city (integrated with backend)
    async deleteCity(cityId: string): Promise<boolean> {
        // Don't allow deleting the default city
        if (this.adminSettings.defaultCity === cityId) {
            console.error('Cannot delete the default city');
            return false;
        }

        try {
            if (this.isOnline) {
                const response = await this.apiRequest(`/locations/cities/${cityId}`, {
                    method: 'DELETE',
                });

                if (response.success) {
                    // Remove from enabled cities if it exists
                    this.adminSettings.enabledCityIds = this.adminSettings.enabledCityIds.filter(
                        (id) => id !== cityId,
                    );

                    // Remove from local cities array
                    const cityIndex = this.cities.findIndex(city => city.id === cityId);
                    if (cityIndex !== -1) {
                        this.cities.splice(cityIndex, 1);
                    }

                    console.log('City deleted successfully:', cityId);
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    return true;
                }
                return false;
            } else {
                // Fallback to local operation
                const cityIndex = this.cities.findIndex(city => city.id === cityId);
                if (cityIndex === -1) {
                    console.error('City not found:', cityId);
                    return false;
                }

                // Remove from enabled cities if it exists
                this.adminSettings.enabledCityIds = this.adminSettings.enabledCityIds.filter(
                    (id) => id !== cityId,
                );

                // Actually remove the city from the cities array
                this.cities.splice(cityIndex, 1);

                console.log('City deleted successfully:', cityId);
                this.adminSettings.lastUpdated = new Date().toISOString();
                return true;
            }
        } catch (error) {
            console.error('Failed to delete city:', error);
            return false;
        }
    }

    // Remove default status from a city
    async removeDefaultCity(cityId: string): Promise<boolean> {
        if (this.adminSettings.defaultCity === cityId) {
            try {
                if (this.isOnline) {
                    const response = await this.apiRequest('/locations/settings/default-city', {
                        method: 'DELETE',
                        body: JSON.stringify({ cityId }),
                    });

                    if (response.success) {
                        this.adminSettings.defaultCity = '';
                        this.adminSettings.lastUpdated = new Date().toISOString();
                        console.log('Removed default status from city:', cityId);
                        return true;
                    }
                    return false;
                } else {
                    // Fallback to local operation
                    this.adminSettings.defaultCity = '';
                    this.adminSettings.lastUpdated = new Date().toISOString();
                    console.log('Removed default status from city:', cityId);
                    return true;
                }
            } catch (error) {
                console.error('Failed to remove default city:', error);
                return false;
            }
        }
        return false;
    }

    // Get current default city
    getDefaultCity(): string {
        return this.adminSettings.defaultCity;
    }

    // Get all cities (for internal use)
    getAllCities(): City[] {
        return [...this.cities];
    }

    // Check if a city can be deleted
    canDeleteCity(cityId: string): { canDelete: boolean; reason?: string } {
        if (this.adminSettings.defaultCity === cityId) {
            return {
                canDelete: false,
                reason: 'Cannot delete the default city. Please set another city as default first.',
            };
        }
        return { canDelete: true };
    }

    // Check if a city can be disabled
    canDisableCity(cityId: string): { canDisable: boolean; reason?: string } {
        if (this.adminSettings.defaultCity === cityId) {
            return {
                canDisable: false,
                reason: 'Cannot disable the default city. Please set another city as default first.',
            };
        }
        return { canDisable: true };
    }

    // Get city coverage by governorate
    getCoverageByGovernorate(): {
        governorateId: string;
        name: string;
        coverage: number;
        enabled: boolean;
    }[] {
        return governorates.map((gov) => {
            const govCities = getCitiesByGovernorate(gov.id);
            const enabledCities = govCities.filter((city) =>
                this.adminSettings.enabledCityIds.includes(city.id),
            ).length;

            const coverage = govCities.length > 0 ? (enabledCities / govCities.length) * 100 : 0;

            return {
                governorateId: gov.id,
                name: gov.nameEn,
                coverage,
                enabled: this.adminSettings.enabledGovernorateIds.includes(gov.id),
            };
        });
    }

    // Get pharmacy distribution
    getPharmacyDistribution(): {
        cityId: string;
        cityName: string;
        pharmacyCount: number;
        enabled: boolean;
    }[] {
        return this.cities
            .filter((city) => this.adminSettings.enabledCityIds.includes(city.id))
            .map((city) => ({
                cityId: city.id,
                cityName: city.nameEn,
                pharmacyCount: city.pharmacyCount,
                enabled: true,
            }))
            .sort((a, b) => b.pharmacyCount - a.pharmacyCount);
    }

    // Get products for customer location (using backend endpoint)
    async getProductsForLocation(cityId?: string, governorateId?: string): Promise<any[]> {
        try {
            if (this.isOnline) {
                const params = new URLSearchParams();
                if (cityId) params.append('cityId', cityId);
                if (governorateId) params.append('governorateId', governorateId);

                const response = await this.apiRequest<any[]>(`/locations/products/customer-location?${params.toString()}`);
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to empty array
            return [];
        } catch (error) {
            console.error('Failed to get products for location:', error);
            return [];
        }
    }

    // Get in-stock products for customer location (using backend endpoint)
    async getInStockProductsForLocation(cityId?: string, governorateId?: string): Promise<any[]> {
        try {
            if (this.isOnline) {
                const params = new URLSearchParams();
                if (cityId) params.append('cityId', cityId);
                if (governorateId) params.append('governorateId', governorateId);

                const response = await this.apiRequest<any[]>(`/locations/products/customer-location/in-stock?${params.toString()}`);
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to empty array
            return [];
        } catch (error) {
            console.error('Failed to get in-stock products for location:', error);
            return [];
        }
    }

    // Get pharmacies for customer location (using backend endpoint)
    async getPharmaciesForLocation(cityId?: string, governorateId?: string): Promise<any[]> {
        try {
            if (this.isOnline) {
                const params = new URLSearchParams();
                if (cityId) params.append('cityId', cityId);
                if (governorateId) params.append('governorateId', governorateId);

                const response = await this.apiRequest<any[]>(`/locations/pharmacies/customer-location?${params.toString()}`);
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to empty array
            return [];
        } catch (error) {
            console.error('Failed to get pharmacies for location:', error);
            return [];
        }
    }

    // Get available pharmacies for customer location (using backend endpoint)
    async getAvailablePharmaciesForLocation(cityId?: string, governorateId?: string): Promise<any[]> {
        try {
            if (this.isOnline) {
                const params = new URLSearchParams();
                if (cityId) params.append('cityId', cityId);
                if (governorateId) params.append('governorateId', governorateId);

                const response = await this.apiRequest<any[]>(`/locations/pharmacies/customer-location/available?${params.toString()}`);
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to empty array
            return [];
        } catch (error) {
            console.error('Failed to get available pharmacies for location:', error);
            return [];
        }
    }

    // Get recent city management activities (enhanced with backend integration)
    async getRecentActivities(): Promise<Array<{
        id: string;
        type:
            | 'city_enabled'
            | 'city_disabled'
            | 'governorate_enabled'
            | 'governorate_disabled'
            | 'settings_updated';
        title: string;
        description: string;
        timestamp: string;
        user: string;
    }>> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest<any[]>('/locations/activities/recent');
                if (response.success && response.data) {
                    return response.data;
                }
            }

            // Fallback to mock data
            return [
                {
                    id: '1',
                    type: 'city_enabled',
                    title: 'City Enabled',
                    description: 'Cairo City was enabled for service',
                    timestamp: '2024-01-20T10:30:00Z',
                    user: 'Admin User',
                },
                {
                    id: '2',
                    type: 'governorate_enabled',
                    title: 'Governorate Enabled',
                    description: 'Alexandria Governorate was enabled',
                    timestamp: '2024-01-20T09:15:00Z',
                    user: 'Admin User',
                },
                {
                    id: '3',
                    type: 'settings_updated',
                    title: 'Settings Updated',
                    description: 'Cross-city orders were enabled',
                    timestamp: '2024-01-19T16:45:00Z',
                    user: 'Admin User',
                },
                {
                    id: '4',
                    type: 'city_disabled',
                    title: 'City Disabled',
                    description: 'Port Said was temporarily disabled',
                    timestamp: '2024-01-19T14:20:00Z',
                    user: 'Admin User',
                },
            ];
        } catch (error) {
            console.error('Failed to get recent activities:', error);
            return [];
        }
    }

    // Export settings for backup (integrated with backend)
    async exportSettings(): Promise<string> {
        try {
            if (this.isOnline) {
                const response = await this.apiRequest<any>('/locations/settings/export');
                if (response.success && response.data) {
                    return JSON.stringify(response.data, null, 2);
                }
            }

            // Fallback to local settings
            return JSON.stringify(this.adminSettings, null, 2);
        } catch (error) {
            console.error('Failed to export settings:', error);
            return JSON.stringify(this.adminSettings, null, 2);
        }
    }

    // Import settings from backup (integrated with backend)
    async importSettings(settingsJson: string): Promise<boolean> {
        try {
            const settings = JSON.parse(settingsJson);

            if (this.isOnline) {
                const response = await this.apiRequest('/locations/settings/import', {
                    method: 'POST',
                    body: JSON.stringify({ settings }),
                });

                if (response.success) {
                    this.adminSettings = {
                        ...settings,
                        lastUpdated: new Date().toISOString(),
                    };
                    return true;
                }
                return false;
            } else {
                // Fallback to local import
                this.adminSettings = {
                    ...settings,
                    lastUpdated: new Date().toISOString(),
                };
                return true;
            }
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }

    // Sync with backend (force reload all data)
    async syncWithBackend(): Promise<boolean> {
        try {
            if (!this.isOnline) {
                this.isOnline = true; // Try to reconnect
            }

            await this.loadAdminSettings();
            await this.loadCitiesFromBackend();
            
            console.log('Successfully synced with backend');
            return true;
        } catch (error) {
            console.error('Failed to sync with backend:', error);
            this.isOnline = false;
            return false;
        }
    }

    // Check if service is online
    isServiceOnline(): boolean {
        return this.isOnline;
    }

    // Force offline mode
    setOfflineMode(offline: boolean): void {
        this.isOnline = !offline;
    }
}

export const cityManagementService = new CityManagementService();