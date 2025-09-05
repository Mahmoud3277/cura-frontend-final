/**
 * Master Database Service
 *
 * This service implements the Single Master Database with Role-Based Access approach
 * as recommended for pharmacy management systems. It ensures:
 *
 * 1. Single Source of Truth - One master database for all products
 * 2. Role-Based Filtering - Pharmacies vs Vendors see different products
 * 3. Regulatory Compliance - Medicines only available to pharmacies
 * 4. Business-Specific Inventory - Each business manages their own stock
 * 5. Consistent Data - Same product info across all platforms
 */

import {
    masterProductDatabase,
    businessDatabase,
    MasterProduct,
    Business,
    BusinessInventory,
    getProductsForPharmacy,
    getProductsForVendor,
    getMedicinesOnly,
    getMedicalSuppliesOnly,
} from '@/lib/database/masterProductDatabase';

import { roleBasedAccessService, ProductWithInventory } from './roleBasedAccessService';

export interface DatabaseQuery {
    businessType: 'pharmacy' | 'vendor';
    businessId?: string;
    cityId?: string;
    governorateId?: string;
    category?: string;
    searchQuery?: string;
    priceRange?: { min: number; max: number };
    inStockOnly?: boolean;
    prescriptionOnly?: boolean;
    sortBy?: 'name' | 'price' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface DatabaseStats {
    totalProducts: number;
    pharmacyProducts: number;
    vendorProducts: number;
    medicineProducts: number;
    medicalSupplyProducts: number;
    hygieneSupplyProducts: number;
    medicalDeviceProducts: number;
    prescriptionProducts: number;
    otcProducts: number;
    businessCount: {
        pharmacies: number;
        vendors: number;
        activeBusinesses: number;
    };
    categoryBreakdown: Record<string, number>;
    manufacturerBreakdown: Record<string, number>;
}

/**
 * Master Database Service
 * Centralized service for all database operations with role-based access
 */
export class MasterDatabaseService {
    private static instance: MasterDatabaseService;

    private constructor() {}

    public static getInstance(): MasterDatabaseService {
        if (!MasterDatabaseService.instance) {
            MasterDatabaseService.instance = new MasterDatabaseService();
        }
        return MasterDatabaseService.instance;
    }

    /**
     * Get products with role-based filtering
     */
    public getProducts(query: DatabaseQuery): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForBusiness(query.businessId || 'default', {
            businessType: query.businessType,
            cityId: query.cityId,
            governorateId: query.governorateId,
            category: query.category,
            searchQuery: query.searchQuery,
            priceRange: query.priceRange,
            inStockOnly: query.inStockOnly,
            prescriptionOnly: query.prescriptionOnly,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        });
    }

    /**
     * Get products for pharmacy (all products including medicines)
     */
    public getPharmacyProducts(query?: Partial<DatabaseQuery>): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForPharmacy({
            businessId: query?.businessId,
            cityId: query?.cityId,
            governorateId: query?.governorateId,
            category: query?.category,
            searchQuery: query?.searchQuery,
            priceRange: query?.priceRange,
            inStockOnly: query?.inStockOnly,
            prescriptionOnly: query?.prescriptionOnly,
            sortBy: query?.sortBy,
            sortOrder: query?.sortOrder,
        });
    }

    /**
     * Get products for vendor (medical supplies only, NO medicines)
     */
    public getVendorProducts(query?: Partial<DatabaseQuery>): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForVendor({
            businessId: query?.businessId,
            cityId: query?.cityId,
            governorateId: query?.governorateId,
            category: query?.category,
            searchQuery: query?.searchQuery,
            priceRange: query?.priceRange,
            inStockOnly: query?.inStockOnly,
            prescriptionOnly: query?.prescriptionOnly,
            sortBy: query?.sortBy,
            sortOrder: query?.sortOrder,
        });
    }

    /**
     * Get product by ID with role-based access
     */
    public getProductById(
        productId: number,
        businessType: 'pharmacy' | 'vendor',
        businessId?: string,
    ): ProductWithInventory | null {
        return roleBasedAccessService.getProductById(productId, businessType, businessId);
    }

    /**
     * Get medicines only (pharmacy exclusive)
     */
    public getMedicines(): MasterProduct[] {
        return getMedicinesOnly();
    }

    /**
     * Get medical supplies only (both pharmacy and vendor)
     */
    public getMedicalSupplies(): MasterProduct[] {
        return getMedicalSuppliesOnly();
    }

    /**
     * Get all businesses by type
     */
    public getBusinesses(type?: 'pharmacy' | 'vendor'): Business[] {
        if (type) {
            return roleBasedAccessService.getBusinessesByType(type);
        }
        return businessDatabase.filter((business) => business.isActive);
    }

    /**
     * Get business by ID
     */
    public getBusinessById(businessId: string): Business | undefined {
        return roleBasedAccessService.getBusinessById(businessId);
    }

    /**
     * Get businesses by location
     */
    public getBusinessesByLocation(cityId?: string, governorateId?: string): Business[] {
        return roleBasedAccessService.getBusinessesByLocation(cityId, governorateId);
    }

    /**
     * Check if business can sell a specific product
     */
    public canBusinessSellProduct(businessId: string, productId: number): boolean {
        return roleBasedAccessService.canBusinessSellProduct(businessId, productId);
    }

    /**
     * Get available categories for business type
     */
    public getAvailableCategories(businessType: 'pharmacy' | 'vendor'): string[] {
        return roleBasedAccessService.getAvailableCategories(businessType);
    }

    /**
     * Get available manufacturers for business type
     */
    public getAvailableManufacturers(businessType: 'pharmacy' | 'vendor'): string[] {
        return roleBasedAccessService.getAvailableManufacturers(businessType);
    }

    /**
     * Get database statistics
     */
    public getDatabaseStats(): DatabaseStats {
        const allProducts = masterProductDatabase;
        const pharmacyProducts = getProductsForPharmacy();
        const vendorProducts = getProductsForVendor();
        const medicines = getMedicinesOnly();
        const medicalSupplies = getMedicalSuppliesOnly();

        const totalProducts = allProducts.length;
        const medicineProducts = medicines.length;
        const medicalSupplyProducts = allProducts.filter((p) => p.type === 'medical-supply').length;
        const hygieneSupplyProducts = allProducts.filter((p) => p.type === 'hygiene-supply').length;
        const medicalDeviceProducts = allProducts.filter((p) => p.type === 'medical-device').length;
        const prescriptionProducts = allProducts.filter((p) => p.prescriptionRequired).length;
        const otcProducts = allProducts.filter((p) => !p.prescriptionRequired).length;

        const businesses = businessDatabase.filter((b) => b.isActive);
        const pharmacies = businesses.filter((b) => b.type === 'pharmacy');
        const vendors = businesses.filter((b) => b.type === 'vendor');

        // Category breakdown
        const categoryBreakdown: Record<string, number> = {};
        allProducts.forEach((product) => {
            categoryBreakdown[product.category] = (categoryBreakdown[product.category] || 0) + 1;
        });

        // Manufacturer breakdown
        const manufacturerBreakdown: Record<string, number> = {};
        allProducts.forEach((product) => {
            manufacturerBreakdown[product.manufacturer] =
                (manufacturerBreakdown[product.manufacturer] || 0) + 1;
        });

        return {
            totalProducts,
            pharmacyProducts: pharmacyProducts.length,
            vendorProducts: vendorProducts.length,
            medicineProducts,
            medicalSupplyProducts,
            hygieneSupplyProducts,
            medicalDeviceProducts,
            prescriptionProducts,
            otcProducts,
            businessCount: {
                pharmacies: pharmacies.length,
                vendors: vendors.length,
                activeBusinesses: businesses.length,
            },
            categoryBreakdown,
            manufacturerBreakdown,
        };
    }

    /**
     * Get business type statistics
     */
    public getBusinessTypeStats(businessType: 'pharmacy' | 'vendor') {
        return roleBasedAccessService.getBusinessTypeStatistics(businessType);
    }

    /**
     * Get recommended products
     */
    public getRecommendedProducts(
        currentProductId: number,
        businessType: 'pharmacy' | 'vendor',
        limit: number = 5,
    ): ProductWithInventory[] {
        return roleBasedAccessService.getRecommendedProducts(currentProductId, businessType, limit);
    }

    /**
     * Search products with role-based access
     */
    public searchProducts(
        searchQuery: string,
        businessType: 'pharmacy' | 'vendor',
        filters?: Partial<DatabaseQuery>,
    ): ProductWithInventory[] {
        if (businessType === 'pharmacy') {
            return this.getPharmacyProducts({
                searchQuery,
                ...filters,
            });
        } else {
            return this.getVendorProducts({
                searchQuery,
                ...filters,
            });
        }
    }

    /**
     * Get products by category with role-based access
     */
    public getProductsByCategory(
        category: string,
        businessType: 'pharmacy' | 'vendor',
        businessId?: string,
    ): ProductWithInventory[] {
        if (businessType === 'pharmacy') {
            return this.getPharmacyProducts({ category, businessId });
        } else {
            return this.getVendorProducts({ category, businessId });
        }
    }

    /**
     * Validate product access for business
     */
    public validateProductAccess(
        productId: number,
        businessId: string,
    ): {
        canAccess: boolean;
        reason?: string;
        businessType?: 'pharmacy' | 'vendor';
    } {
        const business = this.getBusinessById(businessId);
        if (!business) {
            return {
                canAccess: false,
                reason: 'Business not found',
            };
        }

        const product = masterProductDatabase.find((p) => p.id === productId);
        if (!product) {
            return {
                canAccess: false,
                reason: 'Product not found',
                businessType: business.type,
            };
        }

        // Check role-based access
        if (business.type === 'pharmacy') {
            if (!product.pharmacyEligible) {
                return {
                    canAccess: false,
                    reason: 'Product not available for pharmacies',
                    businessType: business.type,
                };
            }
        } else if (business.type === 'vendor') {
            if (!product.vendorEligible) {
                return {
                    canAccess: false,
                    reason: 'Product not available for vendors',
                    businessType: business.type,
                };
            }
            if (product.type === 'medicine') {
                return {
                    canAccess: false,
                    reason: 'Vendors cannot sell medicines',
                    businessType: business.type,
                };
            }
            if (product.prescriptionRequired) {
                return {
                    canAccess: false,
                    reason: 'Vendors cannot sell prescription products',
                    businessType: business.type,
                };
            }
        }

        return {
            canAccess: true,
            businessType: business.type,
        };
    }

    /**
     * Get product eligibility summary
     */
    public getProductEligibilitySummary(): {
        pharmacyOnly: number;
        vendorOnly: number;
        both: number;
        neither: number;
        medicines: number;
        medicalSupplies: number;
        prescriptionRequired: number;
        otc: number;
    } {
        const products = masterProductDatabase;

        let pharmacyOnly = 0;
        let vendorOnly = 0;
        let both = 0;
        let neither = 0;
        let medicines = 0;
        let medicalSupplies = 0;
        let prescriptionRequired = 0;
        let otc = 0;

        products.forEach((product) => {
            // Eligibility counts
            if (product.pharmacyEligible && product.vendorEligible) {
                both++;
            } else if (product.pharmacyEligible) {
                pharmacyOnly++;
            } else if (product.vendorEligible) {
                vendorOnly++;
            } else {
                neither++;
            }

            // Type counts
            if (product.type === 'medicine') {
                medicines++;
            } else {
                medicalSupplies++;
            }

            // Prescription counts
            if (product.prescriptionRequired) {
                prescriptionRequired++;
            } else {
                otc++;
            }
        });

        return {
            pharmacyOnly,
            vendorOnly,
            both,
            neither,
            medicines,
            medicalSupplies,
            prescriptionRequired,
            otc,
        };
    }
}

// Export singleton instance
export const masterDatabaseService = MasterDatabaseService.getInstance();

// Utility functions for backward compatibility
export const getProductsForBusinessType = (businessType: 'pharmacy' | 'vendor') => {
    if (businessType === 'pharmacy') {
        return masterDatabaseService.getPharmacyProducts();
    } else {
        return masterDatabaseService.getVendorProducts();
    }
};

export const searchProductsWithRoleAccess = (
    query: string,
    businessType: 'pharmacy' | 'vendor',
) => {
    return masterDatabaseService.searchProducts(query, businessType);
};

export const validateBusinessProductAccess = (productId: number, businessId: string) => {
    return masterDatabaseService.validateProductAccess(productId, businessId);
};
