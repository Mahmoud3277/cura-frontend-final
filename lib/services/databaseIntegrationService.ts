/**
 * Database Integration Service
 *
 * This service ensures all components throughout the app use the
 * Single Master Database with Role-Based Access approach consistently.
 *
 * It provides a unified interface for all database operations while
 * enforcing regulatory compliance and role-based access control.
 */

import { masterDatabaseService } from './masterDatabaseService';
import { roleBasedAccessService, ProductWithInventory } from './roleBasedAccessService';
import { pharmacyInventoryService } from './pharmacyInventoryService';
import { vendorInventoryService } from './vendorInventoryService';
import { MasterProduct, Business } from '@/lib/database/masterProductDatabase';

export interface UnifiedProductQuery {
    userRole: 'customer' | 'pharmacy' | 'vendor' | 'admin';
    businessId?: string;
    businessType?: 'pharmacy' | 'vendor';
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

export interface UnifiedProductResponse {
    products: ProductWithInventory[];
    totalCount: number;
    hasMore: boolean;
    filters: {
        availableCategories: string[];
        availableManufacturers: string[];
        priceRange: { min: number; max: number };
    };
    businessInfo?: Business;
    accessLevel: 'full' | 'restricted' | 'none';
    restrictions?: string[];
}

/**
 * Database Integration Service
 * Unified interface for all database operations with role-based access
 */
export class DatabaseIntegrationService {
    private static instance: DatabaseIntegrationService;

    private constructor() {}

    public static getInstance(): DatabaseIntegrationService {
        if (!DatabaseIntegrationService.instance) {
            DatabaseIntegrationService.instance = new DatabaseIntegrationService();
        }
        return DatabaseIntegrationService.instance;
    }

    /**
     * Universal product query with role-based access
     */
    public async queryProducts(query: UnifiedProductQuery): Promise<UnifiedProductResponse> {
        let products: ProductWithInventory[] = [];
        let accessLevel: 'full' | 'restricted' | 'none' = 'none';
        let restrictions: string[] = [];
        let businessInfo: Business | undefined;

        // Determine access level and get products based on user role
        switch (query.userRole) {
            case 'admin':
                // Admins can see all products
                products = this.getAllProductsForAdmin(query);
                accessLevel = 'full';
                break;

            case 'pharmacy':
                // Pharmacies can see all products (medicines + medical supplies)
                if (query.businessId) {
                    businessInfo = masterDatabaseService.getBusinessById(query.businessId);
                    if (businessInfo?.type === 'pharmacy') {
                        products = masterDatabaseService.getPharmacyProducts({
                            businessId: query.businessId,
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
                        accessLevel = 'full';
                    } else {
                        restrictions.push('Invalid pharmacy business ID');
                    }
                } else {
                    restrictions.push('Pharmacy business ID required');
                }
                break;

            case 'vendor':
                // Vendors can ONLY see medical supplies (NO medicines)
                if (query.businessId) {
                    businessInfo = masterDatabaseService.getBusinessById(query.businessId);
                    if (businessInfo?.type === 'vendor') {
                        products = masterDatabaseService.getVendorProducts({
                            businessId: query.businessId,
                            cityId: query.cityId,
                            governorateId: query.governorateId,
                            category: query.category,
                            searchQuery: query.searchQuery,
                            priceRange: query.priceRange,
                            inStockOnly: query.inStockOnly,
                            prescriptionOnly: false, // Vendors cannot sell prescription items
                            sortBy: query.sortBy,
                            sortOrder: query.sortOrder,
                        });
                        accessLevel = 'restricted';
                        restrictions.push('Medicines not available for vendors');
                        restrictions.push('Prescription products not available for vendors');
                    } else {
                        restrictions.push('Invalid vendor business ID');
                    }
                } else {
                    restrictions.push('Vendor business ID required');
                }
                break;

            case 'customer':
                // Customers see products based on their location and selected business type
                products = this.getProductsForCustomer(query);
                accessLevel = 'restricted';
                restrictions.push('Products filtered by location and business availability');
                break;

            default:
                restrictions.push('Invalid user role');
        }

        // Apply pagination
        const totalCount = products.length;
        if (query.limit && query.offset !== undefined) {
            products = products.slice(query.offset, query.offset + query.limit);
        }

        // Get filter options
        const businessType = query.businessType || businessInfo?.type;
        const availableCategories = businessType
            ? masterDatabaseService.getAvailableCategories(businessType)
            : [];
        const availableManufacturers = businessType
            ? masterDatabaseService.getAvailableManufacturers(businessType)
            : [];

        // Calculate price range
        const prices = products.map((p) => p.price || 0).filter((p) => p > 0);
        const priceRange =
            prices.length > 0
                ? { min: Math.min(...prices), max: Math.max(...prices) }
                : { min: 0, max: 0 };

        return {
            products,
            totalCount,
            hasMore: query.limit ? (query.offset || 0) + products.length < totalCount : false,
            filters: {
                availableCategories,
                availableManufacturers,
                priceRange,
            },
            businessInfo,
            accessLevel,
            restrictions: restrictions.length > 0 ? restrictions : undefined,
        };
    }

    /**
     * Get all products for admin (no restrictions)
     */
    private getAllProductsForAdmin(query: UnifiedProductQuery): ProductWithInventory[] {
        // Admins can see products from both pharmacy and vendor perspectives
        const pharmacyProducts = masterDatabaseService.getPharmacyProducts(query);
        const vendorProducts = masterDatabaseService.getVendorProducts(query);

        // Combine and deduplicate
        const allProducts = [...pharmacyProducts];
        vendorProducts.forEach((vendorProduct) => {
            if (!allProducts.find((p) => p.id === vendorProduct.id)) {
                allProducts.push(vendorProduct);
            }
        });

        return allProducts;
    }

    /**
     * Get products for customer based on location and business availability
     */
    private getProductsForCustomer(query: UnifiedProductQuery): ProductWithInventory[] {
        // Customers see products from businesses in their location
        const businesses = masterDatabaseService.getBusinessesByLocation(
            query.cityId,
            query.governorateId,
        );

        let allProducts: ProductWithInventory[] = [];

        businesses.forEach((business) => {
            let businessProducts: ProductWithInventory[] = [];

            if (business.type === 'pharmacy') {
                businessProducts = masterDatabaseService.getPharmacyProducts({
                    businessId: business.id,
                    category: query.category,
                    searchQuery: query.searchQuery,
                    priceRange: query.priceRange,
                    inStockOnly: query.inStockOnly,
                    prescriptionOnly: query.prescriptionOnly,
                });
            } else if (business.type === 'vendor') {
                businessProducts = masterDatabaseService.getVendorProducts({
                    businessId: business.id,
                    category: query.category,
                    searchQuery: query.searchQuery,
                    priceRange: query.priceRange,
                    inStockOnly: query.inStockOnly,
                    prescriptionOnly: false, // Vendors don't sell prescription items
                });
            }

            allProducts = [...allProducts, ...businessProducts];
        });

        // Remove duplicates and sort
        const uniqueProducts = allProducts.filter(
            (product, index, self) => index === self.findIndex((p) => p.id === product.id),
        );

        return uniqueProducts;
    }

    /**
     * Get product by ID with role-based access validation
     */
    public async getProductById(
        productId: number,
        userRole: string,
        businessId?: string,
    ): Promise<{
        product: ProductWithInventory | null;
        canAccess: boolean;
        reason?: string;
    }> {
        // Validate access first
        if (businessId) {
            const validation = masterDatabaseService.validateProductAccess(productId, businessId);
            if (!validation.canAccess) {
                return {
                    product: null,
                    canAccess: false,
                    reason: validation.reason,
                };
            }

            // Get product with business context
            const product = masterDatabaseService.getProductById(
                productId,
                validation.businessType!,
                businessId,
            );

            return {
                product,
                canAccess: true,
            };
        }

        // For admin or general access
        if (userRole === 'admin') {
            const product = masterDatabaseService.getProductById(productId, 'pharmacy');
            return {
                product,
                canAccess: true,
            };
        }

        return {
            product: null,
            canAccess: false,
            reason: 'Business ID required for product access',
        };
    }

    /**
     * Search products with role-based filtering
     */
    public async searchProducts(
        searchQuery: string,
        userRole: string,
        businessType?: 'pharmacy' | 'vendor',
        businessId?: string,
    ): Promise<ProductWithInventory[]> {
        if (!businessType) {
            return [];
        }

        return masterDatabaseService.searchProducts(searchQuery, businessType, {
            businessId,
        });
    }

    /**
     * Get products by category with role-based access
     */
    public async getProductsByCategory(
        category: string,
        userRole: string,
        businessType?: 'pharmacy' | 'vendor',
        businessId?: string,
    ): Promise<ProductWithInventory[]> {
        if (!businessType) {
            return [];
        }

        return masterDatabaseService.getProductsByCategory(category, businessType, businessId);
    }

    /**
     * Get inventory for business
     */
    public async getBusinessInventory(businessId: string, filters?: any) {
        const business = masterDatabaseService.getBusinessById(businessId);
        if (!business) {
            throw new Error('Business not found');
        }

        if (business.type === 'pharmacy') {
            return pharmacyInventoryService.getInventoryItems(filters);
        } else if (business.type === 'vendor') {
            return vendorInventoryService.getInventoryItems(businessId, filters);
        }

        throw new Error('Invalid business type');
    }

    /**
     * Get database statistics with role-based breakdown
     */
    public async getDatabaseStatistics() {
        const stats = masterDatabaseService.getDatabaseStats();
        const eligibility = masterDatabaseService.getProductEligibilitySummary();
        const pharmacyStats = masterDatabaseService.getBusinessTypeStats('pharmacy');
        const vendorStats = masterDatabaseService.getBusinessTypeStats('vendor');

        return {
            overview: stats,
            eligibility,
            businessTypeStats: {
                pharmacy: pharmacyStats,
                vendor: vendorStats,
            },
            compliance: {
                medicinesRestrictedToPharmacies: eligibility.medicines,
                vendorRestrictedProducts: eligibility.vendorOnly,
                sharedProducts: eligibility.both,
                regulatoryCompliance: true,
            },
        };
    }

    /**
     * Validate business permissions for product operations
     */
    public validateBusinessPermissions(
        businessId: string,
        operation: 'view' | 'sell' | 'manage',
        productId?: number,
    ): {
        allowed: boolean;
        reason?: string;
        businessType?: 'pharmacy' | 'vendor';
    } {
        const business = masterDatabaseService.getBusinessById(businessId);
        if (!business) {
            return { allowed: false, reason: 'Business not found' };
        }

        if (!business.isActive) {
            return {
                allowed: false,
                reason: 'Business is not active',
                businessType: business.type,
            };
        }

        if (productId) {
            const validation = masterDatabaseService.validateProductAccess(productId, businessId);
            return {
                allowed: validation.canAccess,
                reason: validation.reason,
                businessType: business.type,
            };
        }

        return {
            allowed: true,
            businessType: business.type,
        };
    }
}

// Export singleton instance
export const databaseIntegrationService = DatabaseIntegrationService.getInstance();

// Utility functions for easy access
export const queryProductsWithRoleAccess = (query: UnifiedProductQuery) => {
    return databaseIntegrationService.queryProducts(query);
};

export const getProductWithRoleValidation = (
    productId: number,
    userRole: string,
    businessId?: string,
) => {
    return databaseIntegrationService.getProductById(productId, userRole, businessId);
};

export const validateBusinessProductPermissions = (
    businessId: string,
    operation: 'view' | 'sell' | 'manage',
    productId?: number,
) => {
    return databaseIntegrationService.validateBusinessPermissions(businessId, operation, productId);
};
