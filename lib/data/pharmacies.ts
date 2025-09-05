import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Pharmacy data structure with city associations
export interface Pharmacy {
    id: string;
    name: string;
    nameAr: string;
    cityId: string;
    cityName: string;
    governorateId: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
    addressAr: string;
    phone: string;
    email: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    isActive: boolean;
    isVerified: boolean;
    verificationStatus: string;
    rating: number;
    reviewCount: number;
    deliveryTime: string;
    deliveryFee: number;
    minOrderAmount: number;
    commission: number;
    specialties: string[];
    services: string[];
    specializations: string[];
    workingHours: {
        open: string;
        close: string;
        is24Hours: boolean;
    };
    operatingHours: any;
    features: string[];
    deliveryService: boolean;
    productCount?: number;
    hasProducts?: boolean;
    productStatistics?: {
        totalProducts: number;
        inStockProducts: number;
        averageRating: number;
        categoryCount: number;
    };
}

// City object interfaces for parameter handling
interface CityObject {
    id?: string;
    _id?: string;
    nameEn?: string;
    nameAr?: string;
    cityId?: string;
    cityName?: string;
    governorateId?: string;
    governorateName?: string;
    governorateNameAr?: string;
    coordinates?: { lat: number; lng: number };
    isEnabled?: boolean;
    pharmacyCount?: number;
    doctorCount?: number;
}

interface GovernorateObject {
    id?: string;
    _id?: string;
    governorateId?: string;
    name?: string;
    nameEn?: string;
    nameAr?: string;
}

// Product interface for pharmacy products
export interface PharmacyProduct {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    originalPrice?: number;
    availability: {
        quantity: number;
        inStock: boolean;
    };
    delivery: {
        available: boolean;
        estimatedTime: string;
        fee: number;
    };
    description: string;
    descriptionAr: string;
    manufacturer: string;
    manufacturerAr: string;
    activeIngredient: string;
    activeIngredientAr: string;
    packSize: string;
    packSizeAr: string;
    rating: number;
    reviews: number;
    prescription: boolean;
    image: string;
    tags: string[];
    category: string;
    inStock: boolean;
    isActive: boolean;
}

// API response interfaces
export interface PharmacySearchResponse {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    pharmacies: Pharmacy[];
}

export interface PharmacyProductsResponse {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    products: PharmacyProduct[];
}

export interface PharmacyStatistics {
    pharmacy: {
        id: string;
        name: string;
        nameAr: string;
    };
    general: {
        totalProducts: number;
        inStockProducts: number;
        outOfStockProducts: number;
        averagePrice: number;
        totalInventoryValue: number;
    };
    categories: Array<{
        _id: string;
        count: number;
        inStock: number;
        averagePrice: number;
    }>;
}

// Search parameters interface
export interface PharmacySearchParams {
    page?: number;
    limit?: number;
    sortBy?: 'distance' | 'rating' | 'delivery' | 'name';
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
    services?: string;
    specializations?: string;
    medicineId?: string;
    cityId?: string;
    productId?: string;
}

// Product search parameters
export interface ProductSearchParams {
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
    inStockOnly?: boolean;
    category?: string;
    search?: string;
}

// Utility functions to extract string values from objects
function extractCityId(cityInput: string | CityObject | undefined): string | undefined {
    if (!cityInput) return undefined;
    if (typeof cityInput === 'string') return cityInput;
    return cityInput.id || cityInput._id || cityInput.cityId || cityInput.nameEn;
}

function extractGovernorateId(governorateInput: string | GovernorateObject | undefined): string | undefined {
    if (!governorateInput) return undefined;
    if (typeof governorateInput === 'string') return governorateInput;
    return governorateInput.governorateId || governorateInput.id || governorateInput._id;
}

// API Helper Functions
export class PharmacyAPI {
    private static async makeRequest<T>(endpoint: string, params?: any): Promise<T> {
        try {
            const response = await axios.get(`${API_BASE_URL}/pharmacies${endpoint}`, { params });
            return response.data;
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    private static async makePostRequest<T>(endpoint: string, data: any, token?: string): Promise<T> {
        try {
            const headers: any = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            const response = await axios.post(`${API_BASE_URL}/pharmacies${endpoint}`, data, { headers });
            return response.data;
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    // Search for pharmacies with enhanced filtering
    static async searchPharmacies(params: PharmacySearchParams = {}): Promise<PharmacySearchResponse> {
        return this.makeRequest<PharmacySearchResponse>('/search', params);
    }
    static async searchPharmaciesByLocation(params: PharmacySearchParams = {}): Promise<PharmacySearchResponse> {
        return this.makeRequest<PharmacySearchResponse>('/city', params);
    }

    // Get pharmacy by ID with product statistics
    static async getPharmacyById(id: string): Promise<Pharmacy> {
        return this.makeRequest<Pharmacy>(`/${id}`);
    }

    // Get pharmacy products with filtering and pagination
    static async getPharmacyProducts(
        pharmacyId: string, 
        params: ProductSearchParams = {}
    ): Promise<PharmacyProductsResponse> {
        return this.makeRequest<PharmacyProductsResponse>(`/${pharmacyId}/products`, params);
    }

    // Get pharmacy statistics
    static async getPharmacyStatistics(pharmacyId: string): Promise<PharmacyStatistics> {
        return this.makeRequest<PharmacyStatistics>(`/${pharmacyId}/statistics`);
    }

    // Get specific product details from a pharmacy
    static async getPharmacyProduct(pharmacyId: string, productId: string): Promise<{
        pharmacy: Partial<Pharmacy>;
        product: PharmacyProduct;
    }> {
        return this.makeRequest(`/${pharmacyId}/product/${productId}`);
    }

    // Legacy: Get medicine details from a pharmacy
    static async getPharmacyMedicine(pharmacyId: string, medicineId: string): Promise<{
        pharmacy: Partial<Pharmacy>;
        inventory: any;
    }> {
        return this.makeRequest(`/${pharmacyId}/medicine/${medicineId}`);
    }

    // Find nearby pharmacies with a specific product
    static async getNearbyPharmaciesWithProduct(
        productId: string, 
        params: { lat?: number; lng?: number; radius?: number; limit?: number } = {}
    ): Promise<{
        totalResults: number;
        pharmacies: Array<{
            pharmacy: Pharmacy;
            product: {
                id: string;
                price: number;
                availability: any;
                delivery: any;
            };
        }>;
    }> {
        return this.makeRequest(`/nearby/product/${productId}`, params);
    }

    // Get pharmacy inventory (legacy support)
    static async getPharmacyInventory(pharmacyId: string, token: string): Promise<any[]> {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_BASE_URL}/pharmacies/inventory/${pharmacyId}`, { headers });
        return response.data;
    }

    // Create/Update pharmacy profile (requires authentication)
    static async updatePharmacyProfile(profileData: any, token: string): Promise<{
        message: string;
        pharmacy: Pharmacy;
    }> {
        return this.makePostRequest('/profile', profileData, token);
    }

    // Update medicine inventory (legacy, requires authentication)
    static async updateMedicineInventory(inventoryData: any, token: string): Promise<{
        message: string;
        inventory: any;
    }> {
        return this.makePostRequest('/inventory', inventoryData, token);
    }
}

// Enhanced Helper Functions (now using API calls with proper parameter handling)
export async function getPharmacyById(id: string): Promise<Pharmacy | null> {
    try {
        return await PharmacyAPI.getPharmacyById(id);
    } catch (error) {
        console.error('Error fetching pharmacy by ID:', error);
        return null;
    }
}

export async function getPharmaciesByCity(
    cityInput: string | CityObject, 
    params: Omit<PharmacySearchParams, 'cityId'> = {}
): Promise<Pharmacy[]> {
    try {
        const cityId = extractCityId(cityInput);
        if (!cityId) {
            console.warn('No valid city ID found in input:', cityInput);
            return [];
        }

        const response = await PharmacyAPI.searchPharmaciesByLocation({ ...params, cityId });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching pharmacies by city:', error);
        return [];
    }
}

export async function getPharmaciesByGovernorate(
    governorateInput: string | GovernorateObject, 
    params: Omit<PharmacySearchParams, 'state'> = {}
): Promise<Pharmacy[]> {
    try {
        const governorateId = extractGovernorateId(governorateInput);
        if (!governorateId) {
            console.warn('No valid governorate ID found in input:', governorateInput);
            return [];
        }

        const response = await PharmacyAPI.searchPharmacies({ ...params, state: governorateId });
        return response.pharmacies;
    } catch (error) {
        console.error('Error fetching pharmacies by governorate:', error);
        return [];
    }
}

export async function getActivePharmacies(params: PharmacySearchParams = {}): Promise<Pharmacy[]> {
    try {
        const response = await PharmacyAPI.searchPharmacies(params);
        return response.pharmacies.filter(pharmacy => pharmacy.isActive);
    } catch (error) {
        console.error('Error fetching active pharmacies:', error);
        return [];
    }
}

export async function searchPharmacies(
    query: string, 
    language: 'en' | 'ar' = 'en',
    params: PharmacySearchParams = {}
): Promise<Pharmacy[]> {
    try {
        // For search functionality, you might want to add a search parameter to your API
        // For now, we'll get all pharmacies and filter client-side
        const response = await PharmacyAPI.searchPharmacies(params);
        const searchTerm = query.toLowerCase();
        
        return response.pharmacies.filter((pharmacy) => {
            if (!pharmacy.isActive) return false;

            if (language === 'ar') {
                return pharmacy.nameAr?.includes(query) || pharmacy.addressAr?.includes(query);
            }
            return (
                pharmacy.name.toLowerCase().includes(searchTerm) ||
                pharmacy.address.city.toLowerCase().includes(searchTerm) ||
                pharmacy.address.street?.toLowerCase().includes(searchTerm)
            );
        });
    } catch (error) {
        console.error('Error searching pharmacies:', error);
        return [];
    }
}

export async function getPharmaciesBySpecialty(
    specialty: string,
    params: PharmacySearchParams = {}
): Promise<Pharmacy[]> {
    try {
        const response = await PharmacyAPI.searchPharmacies({
            ...params,
            specializations: specialty
        });
        return response.pharmacies;
    } catch (error) {
        console.error('Error fetching pharmacies by specialty:', error);
        return [];
    }
}

export async function getPharmaciesByServices(
    services: string[],
    params: PharmacySearchParams = {}
): Promise<Pharmacy[]> {
    try {
        const response = await PharmacyAPI.searchPharmacies({
            ...params,
            services: services.join(',')
        });
        return response.pharmacies;
    } catch (error) {
        console.error('Error fetching pharmacies by services:', error);
        return [];
    }
}

export async function getPharmaciesInEnabledCities(
    enabledCityIds: (string | CityObject)[]
): Promise<Pharmacy[]> {
    try {
        // Get pharmacies for each enabled city and combine results
        const pharmacyPromises = enabledCityIds.map(cityInput => 
            getPharmaciesByCity(cityInput)
        );
        const pharmacyArrays = await Promise.all(pharmacyPromises);
        return pharmacyArrays.flat();
    } catch (error) {
        console.error('Error fetching pharmacies in enabled cities:', error);
        return [];
    }
}

// Enhanced function to get pharmacies strictly for customer's location with proper parameter handling
export async function getPharmaciesForCustomerLocation(
    cityInput?: string | CityObject,
    governorateInput?: string | GovernorateObject,
    params: PharmacySearchParams = {}
): Promise<Pharmacy[]> {
    try {
        const cityId = extractCityId(cityInput);
        const governorateId = extractGovernorateId(governorateInput);

        if (cityId) {
            // If city is selected, only show pharmacies from that specific city
            return getPharmaciesByCity(cityInput!, params);
        } else if (governorateId) {
            // If only governorate is selected, show pharmacies from all cities in that governorate
            return getPharmaciesByGovernorate(governorateInput!, params);
        }
        // If no location selected, return empty array (customer must select location)
        return [];
    } catch (error) {
        console.error('Error fetching pharmacies for customer location:', error);
        return [];
    }
}

// New helper functions for product-related operations
export async function getPharmacyProductsByCategory(
    pharmacyId: string,
    category: string,
    params: Omit<ProductSearchParams, 'category'> = {}
): Promise<PharmacyProduct[]> {
    try {
        const response = await PharmacyAPI.getPharmacyProducts(pharmacyId, { ...params, category });
        return response.products;
    } catch (error) {
        console.error('Error fetching pharmacy products by category:', error);
        return [];
    }
}

export async function searchPharmacyProducts(
    pharmacyId: string,
    searchTerm: string,
    params: Omit<ProductSearchParams, 'search'> = {}
): Promise<PharmacyProduct[]> {
    try {
        const response = await PharmacyAPI.getPharmacyProducts(pharmacyId, { ...params, search: searchTerm });
        return response.products;
    } catch (error) {
        console.error('Error searching pharmacy products:', error);
        return [];
    }
}

export async function findPharmaciesWithProduct(
    productId: string,
    location?: { lat: number; lng: number; radius?: number },
    limit: number = 10
): Promise<Pharmacy[]> {
    try {
        const params = location ? { ...location, limit } : { limit };
        const response = await PharmacyAPI.getNearbyPharmaciesWithProduct(productId, params);
        return response.pharmacies.map(item => item.pharmacy);
    } catch (error) {
        console.error('Error finding pharmacies with product:', error);
        return [];
    }
}

// Utility function to get pharmacies with geolocation support
export async function getNearbyPharmacies(
    lat: number,
    lng: number,
    radius: number = 10,
    params: Omit<PharmacySearchParams, 'lat' | 'lng'> = {}
): Promise<Pharmacy[]> {
    try {
        const response = await PharmacyAPI.searchPharmacies({
            ...params,
            lat,
            lng,
            sortBy: 'distance'
        });
        return response.pharmacies;
    } catch (error) {
        console.error('Error fetching nearby pharmacies:', error);
        return [];
    }
}

// Legacy helper function that extracts pharmacy IDs (updated to handle objects properly)
export async function fetchPharmaciesForCustomerLocation(
    cityInput?: string | CityObject, 
    governorateInput?: string | GovernorateObject
): Promise<string[]> {
    try {
        const pharmacies = await getPharmaciesForCustomerLocation(cityInput, governorateInput);
        return pharmacies.map(p => p.id || p._id).filter(Boolean) as string[];
    } catch (error) {
        console.error('Error fetching pharmacies for location:', error);
        return [];
    }
}