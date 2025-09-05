// Location-based filtering service for products, doctors, and pharmacies
import { Product, getProductsByCity, getProductsByGovernorate } from '@/lib/data/products';
import { Pharmacy, getPharmaciesByCity, getPharmaciesByGovernorate } from '@/lib/data/pharmacies';
import { DoctorDetails, doctorManagementService } from './doctorManagementService';

export interface LocationFilterOptions {
    cityId?: string;
    governorateId?: string;
    includeOutOfStock?: boolean;
    includeInactive?: boolean;
}

class LocationFilteringService {
    /**
     * Get products available for customer's location
     * Strictly filters by selected city/governorate
     */
    getProductsForLocation(options: LocationFilterOptions): Product[] {
        const { cityId, governorateId, includeOutOfStock = false } = options;

        let products: Product[] = [];

        if (cityId) {
            // If city is selected, only show products from that specific city
            products = getProductsByCity(cityId);
        } else if (governorateId) {
            // If only governorate is selected, show products from all cities in that governorate
            products = getProductsByGovernorate(governorateId);
        } else {
            // If no location selected, return empty array (customer must select location)
            return [];
        }

        // Filter by stock availability if required
        if (!includeOutOfStock) {
            products = products.filter((product) => product.availability.inStock);
        }

        return products;
    }

    /**
     * Get pharmacies available for customer's location
     * Strictly filters by selected city/governorate
     */
    getPharmaciesForLocation(options: LocationFilterOptions): Pharmacy[] {
        const { cityId, governorateId, includeInactive = false } = options;

        let pharmacies: Pharmacy[] = [];

        if (cityId) {
            // If city is selected, only show pharmacies from that specific city
            pharmacies = getPharmaciesByCity(cityId);
        } else if (governorateId) {
            // If only governorate is selected, show pharmacies from all cities in that governorate
            pharmacies = getPharmaciesByGovernorate(governorateId);
        } else {
            // If no location selected, return empty array (customer must select location)
            return [];
        }

        // Filter by active status if required
        if (!includeInactive) {
            pharmacies = pharmacies.filter((pharmacy) => pharmacy.isActive);
        }

        return pharmacies;
    }

    /**
     * Get all active doctors (no location filtering)
     * Doctors are not location-dependent like products/medicines
     */
    getDoctorsForLocation(options: LocationFilterOptions): DoctorDetails[] {
        const { includeInactive = false } = options;

        // Get all doctors regardless of customer location
        let doctors = doctorManagementService.getAllActiveDoctors();

        // Filter by active status if required
        if (!includeInactive) {
            doctors = doctors.filter((doctor) => doctor.status === 'active');
        }

        return doctors;
    }

    /**
     * Get pharmacies that have in-stock products for customer's location
     */
    getPharmaciesWithStockForLocation(options: LocationFilterOptions): Array<{
        pharmacy: Pharmacy;
        inStockProductCount: number;
    }> {
        const pharmacies = this.getPharmaciesForLocation(options);
        const products = this.getProductsForLocation({ ...options, includeOutOfStock: false });

        return pharmacies
            .map((pharmacy) => {
                const pharmacyProducts = products.filter(
                    (product) => product.pharmacyId === pharmacy.id,
                );
                return {
                    pharmacy,
                    inStockProductCount: pharmacyProducts.length,
                };
            })
            .filter((item) => item.inStockProductCount > 0)
            .sort((a, b) => b.inStockProductCount - a.inStockProductCount);
    }

    /**
     * Get available categories for customer's location
     */
    getAvailableCategoriesForLocation(options: LocationFilterOptions): Array<{
        category: string;
        count: number;
    }> {
        const products = this.getProductsForLocation(options);
        const categoryMap = new Map<string, number>();

        products.forEach((product) => {
            const currentCount = categoryMap.get(product.category) || 0;
            categoryMap.set(product.category, currentCount + 1);
        });

        return Array.from(categoryMap.entries())
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Check if customer has selected a valid location
     */
    hasValidLocation(cityId?: string, governorateId?: string): boolean {
        return !!(cityId || governorateId);
    }

    /**
     * Get location summary for customer
     */
    getLocationSummary(
        cityId?: string,
        governorateId?: string,
    ): {
        hasLocation: boolean;
        productCount: number;
        pharmacyCount: number;
        doctorCount: number;
        locationName?: string;
    } {
        const hasLocation = this.hasValidLocation(cityId, governorateId);

        if (!hasLocation) {
            return {
                hasLocation: false,
                productCount: 0,
                pharmacyCount: 0,
                doctorCount: 0, // Still show 0 when no location selected for consistency
            };
        }

        const options: LocationFilterOptions = { cityId, governorateId };
        const products = this.getProductsForLocation(options);
        const pharmacies = this.getPharmaciesForLocation(options);
        // Get all active doctors regardless of location
        const doctors = doctorManagementService.getAllActiveDoctors();

        // Get location name
        let locationName = '';
        if (cityId) {
            const city = products[0]?.cityName || pharmacies[0]?.cityName;
            locationName = city || 'Selected City';
        } else if (governorateId) {
            const governorate = products[0]?.governorateId || pharmacies[0]?.governorateId;
            locationName = governorate || 'Selected Governorate';
        }

        return {
            hasLocation: true,
            productCount: products.length,
            pharmacyCount: pharmacies.length,
            doctorCount: doctors.length, // All active doctors available
            locationName,
        };
    }

    /**
     * Validate if a product is available for customer's location
     */
    isProductAvailableForLocation(
        productId: number,
        cityId?: string,
        governorateId?: string,
    ): boolean {
        const products = this.getProductsForLocation({
            cityId,
            governorateId,
            includeOutOfStock: true,
        });
        return products.some((product) => product.id === productId);
    }

    /**
     * Validate if a pharmacy is available for customer's location
     */
    isPharmacyAvailableForLocation(
        pharmacyId: string,
        cityId?: string,
        governorateId?: string,
    ): boolean {
        const pharmacies = this.getPharmaciesForLocation({
            cityId,
            governorateId,
            includeInactive: true,
        });
        return pharmacies.some((pharmacy) => pharmacy.id === pharmacyId);
    }

    /**
     * Validate if a doctor is available (no location restrictions)
     */
    isDoctorAvailableForLocation(
        doctorId: string,
        cityId?: string,
        governorateId?: string,
    ): boolean {
        // Check if doctor exists and is active (no location restrictions)
        const doctor = doctorManagementService.getDoctorById(doctorId);
        return doctor ? doctor.status === 'active' : false;
    }
}

export const locationFilteringService = new LocationFilteringService();
