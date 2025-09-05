import {
    masterProductDatabase,
    businessDatabase,
    MasterProduct,
    Business,
    BusinessInventory,
} from '@/lib/database/masterProductDatabase';

export interface ProductWithInventory extends MasterProduct {
    inventory?: BusinessInventory;
    businessInfo?: Business;
    price?: number;
    originalPrice?: number;
    stock?: number;
    inStock?: boolean;
    rating?: number;
    reviews?: number;
    deliveryFee?: number;
    estimatedDeliveryTime?: string;
}

export interface RoleBasedFilters {
    businessType: 'pharmacy' | 'vendor';
    businessId?: string;
    cityId?: string;
    governorateId?: string;
    category?: string;
    priceRange?: { min: number; max: number };
    inStockOnly?: boolean;
    prescriptionOnly?: boolean;
    searchQuery?: string;
    sortBy?: 'name' | 'price' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Role-Based Access Service
 * Implements the Single Master Database with Role-Based Access approach
 *
 * Key Features:
 * - Single source of truth for all products
 * - Role-based filtering (pharmacy vs vendor)
 * - Regulatory compliance (medicines only for pharmacies)
 * - Business-specific inventory management
 * - Location-based filtering
 */
export class RoleBasedAccessService {
    private static instance: RoleBasedAccessService;

    private constructor() {}

    public static getInstance(): RoleBasedAccessService {
        if (!RoleBasedAccessService.instance) {
            RoleBasedAccessService.instance = new RoleBasedAccessService();
        }
        return RoleBasedAccessService.instance;
    }

    /**
     * Get products for pharmacies
     * Pharmacies can see ALL products (medicines + medical supplies)
     */
    public getProductsForPharmacy(filters?: Partial<RoleBasedFilters>): ProductWithInventory[] {
        return this.filterProducts({
            businessType: 'pharmacy',
            ...filters,
        });
    }

    /**
     * Get products for vendors
     * Vendors can ONLY see medical supplies, hygiene supplies, and medical devices
     * NO medicines allowed
     */
    public getProductsForVendor(filters?: Partial<RoleBasedFilters>): ProductWithInventory[] {
        return this.filterProducts({
            businessType: 'vendor',
            ...filters,
        });
    }

    /**
     * Get products for a specific business
     */
    public getProductsForBusiness(
        businessId: string,
        filters?: Partial<RoleBasedFilters>,
    ): ProductWithInventory[] {
        const business = this.getBusinessById(businessId);
        if (!business) {
            return [];
        }

        return this.filterProducts({
            businessType: business.type,
            businessId,
            ...filters,
        });
    }

    /**
     * Core filtering logic with role-based access control
     */
    private filterProducts(filters: RoleBasedFilters): ProductWithInventory[] {
        let products = [...masterProductDatabase];

        // STEP 1: Apply role-based filtering (MOST IMPORTANT)
        if (filters.businessType === 'pharmacy') {
            // Pharmacies can see all products that are pharmacy-eligible
            products = products.filter((product) => product.pharmacyEligible);
        } else if (filters.businessType === 'vendor') {
            // Vendors can ONLY see non-medicine products that are vendor-eligible
            products = products.filter(
                (product) =>
                    product.vendorEligible &&
                    product.type !== 'medicine' &&
                    !product.prescriptionRequired,
            );
        }

        // STEP 2: Apply additional filters
        if (filters.category) {
            products = products.filter(
                (product) => product.category.toLowerCase() === filters.category!.toLowerCase(),
            );
        }

        if (filters.prescriptionOnly !== undefined) {
            products = products.filter(
                (product) => product.prescriptionRequired === filters.prescriptionOnly,
            );
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            products = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.nameAr.includes(filters.searchQuery!) ||
                    product.description.toLowerCase().includes(query) ||
                    product.manufacturer.toLowerCase().includes(query) ||
                    product.activeIngredient.toLowerCase().includes(query) ||
                    product.keywords.some((keyword) => keyword.toLowerCase().includes(query)) ||
                    product.tags.some((tag) => tag.toLowerCase().includes(query)),
            );
        }

        // STEP 3: Enhance products with business-specific data
        const enhancedProducts = products.map((product) =>
            this.enhanceProductWithBusinessData(product, filters.businessId, filters.businessType),
        );

        // STEP 4: Apply inventory-based filters
        if (filters.inStockOnly) {
            enhancedProducts.filter((product) => product.inStock);
        }

        if (filters.priceRange) {
            enhancedProducts.filter(
                (product) =>
                    product.price &&
                    product.price >= filters.priceRange!.min &&
                    product.price <= filters.priceRange!.max,
            );
        }

        // STEP 5: Apply sorting
        if (filters.sortBy) {
            this.sortProducts(enhancedProducts, filters.sortBy, filters.sortOrder || 'asc');
        }

        return enhancedProducts;
    }

    /**
     * Enhance product with business-specific inventory and pricing data
     */
    private enhanceProductWithBusinessData(
        product: MasterProduct,
        businessId?: string,
        businessType?: 'pharmacy' | 'vendor',
    ): ProductWithInventory {
        const enhanced: ProductWithInventory = { ...product };

        // Add mock inventory data (in real app, this would come from database)
        if (businessId) {
            const business = this.getBusinessById(businessId);
            if (business) {
                enhanced.businessInfo = business;
                enhanced.inventory = this.generateMockInventory(product, business);
                enhanced.price = enhanced.inventory.price;
                enhanced.originalPrice = enhanced.inventory.originalPrice;
                enhanced.stock = enhanced.inventory.stock;
                enhanced.inStock = enhanced.inventory.status === 'in-stock';
                enhanced.deliveryFee = business.deliveryOptions.deliveryFee;
                enhanced.estimatedDeliveryTime = business.deliveryOptions.estimatedDeliveryTime;
                enhanced.rating = business.rating;
                enhanced.reviews = business.reviewCount;
            }
        } else {
            // Generate average data across all eligible businesses
            const eligibleBusinesses = businessDatabase.filter(
                (business) => business.type === businessType && business.isActive,
            );

            if (eligibleBusinesses.length > 0) {
                const avgPrice = this.calculateAveragePrice(product, eligibleBusinesses);
                enhanced.price = avgPrice;
                enhanced.inStock = true; // Assume available somewhere
                enhanced.rating =
                    eligibleBusinesses.reduce((sum, b) => sum + b.rating, 0) /
                    eligibleBusinesses.length;
                enhanced.reviews = eligibleBusinesses.reduce((sum, b) => sum + b.reviewCount, 0);
            }
        }

        return enhanced;
    }

    /**
     * Generate mock inventory data for a product at a specific business
     */
    private generateMockInventory(product: MasterProduct, business: Business): BusinessInventory {
        const basePrice = this.getBasePrice(product);
        const markup = business.type === 'pharmacy' ? 1.5 : 1.3; // Pharmacies have higher markup
        const price = Math.round(basePrice * markup * 100) / 100;
        const stock = Math.floor(Math.random() * 200) + 10;

        return {
            id: `inv_${business.id}_${product.id}`,
            productId: product.id,
            businessId: business.id,
            businessType: business.type,
            stock,
            price,
            originalPrice: Math.random() > 0.7 ? Math.round(price * 1.2 * 100) / 100 : undefined,
            expiryDate: new Date(
                Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            batchNumber: `BATCH${Date.now()}${Math.floor(Math.random() * 1000)}`,
            sku: `${business.type.toUpperCase()}-${product.id}-${Math.floor(Math.random() * 10000)}`,
            minStockThreshold: Math.floor(Math.random() * 20) + 5,
            maxStockCapacity: Math.floor(Math.random() * 500) + 100,
            location: `${String.fromCharCode(65 + Math.floor(Math.random() * 3))}-${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 20) + 1}`,
            supplier: `${product.manufacturer} Distribution`,
            supplierContact: `+20 ${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
            costPrice: Math.round(basePrice * 100) / 100,
            discount: Math.random() > 0.8 ? Math.floor(Math.random() * 20) + 5 : undefined,
            status: stock > 20 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-of-stock',
            lastRestocked: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastSold:
                Math.random() > 0.3
                    ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
                    : undefined,
            totalSold: Math.floor(Math.random() * 1000),
            notes: Math.random() > 0.8 ? 'Special storage requirements' : undefined,
            createdAt: new Date(
                Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }

    /**
     * Calculate base price for a product based on type and complexity
     */
    private getBasePrice(product: MasterProduct): number {
        let basePrice = 10; // Default base price

        // Price based on product type
        switch (product.type) {
            case 'medicine':
                basePrice = product.prescriptionRequired ? 50 : 25;
                break;
            case 'medical-device':
                basePrice = 100;
                break;
            case 'medical-supply':
                basePrice = 15;
                break;
            case 'hygiene-supply':
                basePrice = 8;
                break;
        }

        // Adjust based on category
        const categoryMultipliers: Record<string, number> = {
            antibiotics: 2.0,
            diabetes: 3.0,
            analgesics: 1.2,
            vitamins: 1.5,
            'medical-devices': 5.0,
            'emergency-care': 2.5,
        };

        const multiplier = categoryMultipliers[product.category] || 1.0;
        return Math.round(basePrice * multiplier * 100) / 100;
    }

    /**
     * Calculate average price across multiple businesses
     */
    private calculateAveragePrice(product: MasterProduct, businesses: Business[]): number {
        const prices = businesses.map((business) => {
            const inventory = this.generateMockInventory(product, business);
            return inventory.price;
        });

        return (
            Math.round((prices.reduce((sum, price) => sum + price, 0) / prices.length) * 100) / 100
        );
    }

    /**
     * Sort products based on criteria
     */
    private sortProducts(
        products: ProductWithInventory[],
        sortBy: string,
        sortOrder: 'asc' | 'desc',
    ): void {
        products.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price || 0;
                    bValue = b.price || 0;
                    break;
                case 'rating':
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                case 'newest':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortOrder === 'desc' ? 1 : -1;
            if (aValue > bValue) return sortOrder === 'desc' ? -1 : 1;
            return 0;
        });
    }

    /**
     * Get business by ID
     */
    public getBusinessById(businessId: string): Business | undefined {
        return businessDatabase.find((business) => business.id === businessId);
    }

    /**
     * Get all businesses by type
     */
    public getBusinessesByType(type: 'pharmacy' | 'vendor'): Business[] {
        return businessDatabase.filter((business) => business.type === type && business.isActive);
    }

    /**
     * Get businesses by location
     */
    public getBusinessesByLocation(cityId?: string, governorateId?: string): Business[] {
        return businessDatabase.filter((business) => {
            if (cityId && business.cityId !== cityId) return false;
            if (governorateId && business.governorateId !== governorateId) return false;
            return business.isActive;
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
        const product = masterProductDatabase.find((p) => p.id === productId);
        if (!product) return null;

        // Apply role-based access control
        if (businessType === 'vendor' && (product.type === 'medicine' || !product.vendorEligible)) {
            return null; // Vendors cannot access medicines
        }

        if (businessType === 'pharmacy' && !product.pharmacyEligible) {
            return null; // Product not available for pharmacies
        }

        return this.enhanceProductWithBusinessData(product, businessId, businessType);
    }

    /**
     * Get available categories for a business type
     */
    public getAvailableCategories(businessType: 'pharmacy' | 'vendor'): string[] {
        const products = this.filterProducts({ businessType });
        const categories = new Set(products.map((product) => product.category));
        return Array.from(categories).sort();
    }

    /**
     * Get available manufacturers for a business type
     */
    public getAvailableManufacturers(businessType: 'pharmacy' | 'vendor'): string[] {
        const products = this.filterProducts({ businessType });
        const manufacturers = new Set(products.map((product) => product.manufacturer));
        return Array.from(manufacturers).sort();
    }

    /**
     * Get statistics for a business type
     */
    public getBusinessTypeStatistics(businessType: 'pharmacy' | 'vendor'): {
        totalProducts: number;
        totalMedicines: number;
        totalMedicalSupplies: number;
        totalHygieneSupplies: number;
        totalMedicalDevices: number;
        prescriptionProducts: number;
        otcProducts: number;
        averagePrice: number;
    } {
        const products = this.filterProducts({ businessType });

        const totalProducts = products.length;
        const totalMedicines = products.filter((p) => p.type === 'medicine').length;
        const totalMedicalSupplies = products.filter((p) => p.type === 'medical-supply').length;
        const totalHygieneSupplies = products.filter((p) => p.type === 'hygiene-supply').length;
        const totalMedicalDevices = products.filter((p) => p.type === 'medical-device').length;
        const prescriptionProducts = products.filter((p) => p.prescriptionRequired).length;
        const otcProducts = products.filter((p) => !p.prescriptionRequired).length;

        const prices = products.map((p) => p.price || 0).filter((price) => price > 0);
        const averagePrice =
            prices.length > 0
                ? Math.round(
                      (prices.reduce((sum, price) => sum + price, 0) / prices.length) * 100,
                  ) / 100
                : 0;

        return {
            totalProducts,
            totalMedicines,
            totalMedicalSupplies,
            totalHygieneSupplies,
            totalMedicalDevices,
            prescriptionProducts,
            otcProducts,
            averagePrice,
        };
    }

    /**
     * Validate if a business can sell a specific product
     */
    public canBusinessSellProduct(businessId: string, productId: number): boolean {
        const business = this.getBusinessById(businessId);
        const product = masterProductDatabase.find((p) => p.id === productId);

        if (!business || !product) return false;

        // Check role-based eligibility
        if (business.type === 'pharmacy') {
            return product.pharmacyEligible;
        } else if (business.type === 'vendor') {
            return (
                product.vendorEligible &&
                product.type !== 'medicine' &&
                !product.prescriptionRequired
            );
        }

        return false;
    }

    /**
     * Get recommended products based on current product and business type
     */
    public getRecommendedProducts(
        currentProductId: number,
        businessType: 'pharmacy' | 'vendor',
        limit: number = 5,
    ): ProductWithInventory[] {
        const currentProduct = masterProductDatabase.find((p) => p.id === currentProductId);
        if (!currentProduct) return [];

        const allProducts = this.filterProducts({ businessType });

        // Find similar products based on category, manufacturer, or tags
        const recommendations = allProducts
            .filter((product) => product.id !== currentProductId)
            .map((product) => {
                let score = 0;

                // Same category
                if (product.category === currentProduct.category) score += 3;

                // Same manufacturer
                if (product.manufacturer === currentProduct.manufacturer) score += 2;

                // Similar tags
                const commonTags = product.tags.filter((tag) => currentProduct.tags.includes(tag));
                score += commonTags.length;

                // Same type
                if (product.type === currentProduct.type) score += 1;

                return { product, score };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => item.product);

        return recommendations;
    }
}

// Export singleton instance
export const roleBasedAccessService = RoleBasedAccessService.getInstance();

// Utility functions for backward compatibility
export const getProductsForPharmacy = (filters?: Partial<RoleBasedFilters>) =>
    roleBasedAccessService.getProductsForPharmacy(filters);

export const getProductsForVendor = (filters?: Partial<RoleBasedFilters>) =>
    roleBasedAccessService.getProductsForVendor(filters);

export const getMedicinesOnly = () =>
    masterProductDatabase.filter((product) => product.type === 'medicine');

export const getMedicalSuppliesOnly = () =>
    masterProductDatabase.filter(
        (product) =>
            product.type === 'medical-supply' ||
            product.type === 'hygiene-supply' ||
            product.type === 'medical-device',
    );
