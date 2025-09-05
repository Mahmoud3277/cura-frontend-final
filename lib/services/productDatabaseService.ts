import { products, Product } from '@/lib/data/products';
import { extendedMedicineData, ExtendedMedicine } from '@/lib/data/medicineData';
import {
    roleBasedAccessService,
    ProductWithInventory,
    RoleBasedFilters,
} from './roleBasedAccessService';
import { masterProductDatabase, MasterProduct } from '@/lib/database/masterProductDatabase';

export interface DatabaseProduct {
    id: string;
    name: string;
    nameAr?: string;
    category: string;
    manufacturer: string;
    activeIngredient?: string;
    description?: string;
    image?: string;
    averagePrice: number;
    priceRange: {
        min: number;
        max: number;
    };
    availability: 'in-stock' | 'low-stock' | 'out-of-stock';
    requiresPrescription: boolean;
    type: 'medicine' | 'medical-supply' | 'hygiene-supply' | 'medical-device';
    tags: string[];
    pharmacyCount: number;
    popularityScore: number;
    vendorEligible: boolean;
    pharmacyEligible: boolean;
    businessType?: 'pharmacy' | 'vendor';
}

export interface ProductSearchFilters {
    query?: string;
    category?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    requiresPrescription?: boolean;
    availability?: string;
    manufacturer?: string;
    businessType?: 'pharmacy' | 'vendor';
    businessId?: string;
    cityId?: string;
    governorateId?: string;
    inStockOnly?: boolean;
    sortBy?: 'name' | 'price' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
}

export class ProductDatabaseService {
    private static instance: ProductDatabaseService;
    private databaseProducts: DatabaseProduct[] = [];

    private constructor() {
        this.initializeDatabase();
    }

    public static getInstance(): ProductDatabaseService {
        if (!ProductDatabaseService.instance) {
            ProductDatabaseService.instance = new ProductDatabaseService();
        }
        return ProductDatabaseService.instance;
    }

    private initializeDatabase(): void {
        // ONLY use master products - Single Source of Truth
        const masterProductItems: DatabaseProduct[] = masterProductDatabase.map((product) => ({
            id: `master-${product.id}`,
            name: product.name,
            nameAr: product.nameAr,
            category: product.category,
            manufacturer: product.manufacturer,
            activeIngredient: product.activeIngredient,
            description: product.description,
            image: product.image,
            averagePrice: this.calculateAveragePrice(product),
            priceRange: this.calculatePriceRange(product),
            availability: 'in-stock', // Default availability
            requiresPrescription: product.prescriptionRequired,
            type: product.type,
            tags: product.tags,
            pharmacyCount: this.calculateBusinessCount(product, 'pharmacy'),
            popularityScore: this.calculatePopularityScore(product),
            vendorEligible: product.vendorEligible,
            pharmacyEligible: product.pharmacyEligible,
        }));

        // Use ONLY master database products for consistency
        this.databaseProducts = masterProductItems;
    }

    private calculateAveragePrice(product: MasterProduct): number {
        // Mock price calculation based on product type and category
        let basePrice = 10;

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

    private calculatePriceRange(product: MasterProduct): { min: number; max: number } {
        const avgPrice = this.calculateAveragePrice(product);
        return {
            min: Math.round(avgPrice * 0.8 * 100) / 100,
            max: Math.round(avgPrice * 1.3 * 100) / 100,
        };
    }

    private calculateBusinessCount(
        product: MasterProduct,
        businessType: 'pharmacy' | 'vendor',
    ): number {
        if (businessType === 'pharmacy') {
            return product.pharmacyEligible ? Math.floor(Math.random() * 10) + 3 : 0;
        } else {
            return product.vendorEligible ? Math.floor(Math.random() * 5) + 1 : 0;
        }
    }

    private calculatePopularityScore(product: MasterProduct): number {
        // Calculate based on product type and tags
        let score = 50; // Base score

        if (product.tags.includes('popular')) score += 30;
        if (product.tags.includes('otc')) score += 20;
        if (product.type === 'medicine') score += 15;
        if (product.prescriptionRequired) score -= 10;

        return Math.min(100, Math.max(0, score));
    }

    public getAllProducts(): DatabaseProduct[] {
        return this.databaseProducts;
    }

    public searchProducts(filters: ProductSearchFilters): DatabaseProduct[] {
        let filtered = [...this.databaseProducts];

        // STEP 1: Apply role-based filtering first (CRITICAL - REGULATORY COMPLIANCE)
        if (filters.businessType) {
            if (filters.businessType === 'pharmacy') {
                // Pharmacies can see ALL products they're eligible for
                filtered = filtered.filter((product) => product.pharmacyEligible);
            } else if (filters.businessType === 'vendor') {
                // Vendors can ONLY see non-medicine products they're eligible for
                filtered = filtered.filter(
                    (product) =>
                        product.vendorEligible &&
                        product.type !== 'medicine' &&
                        !product.requiresPrescription,
                );
            }
        } else {
            // If no business type specified, show nothing (force role selection)
            return [];
        }

        // STEP 2: Apply other filters
        // Text search
        if (filters.query && filters.query.trim()) {
            const query = filters.query.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    (product.nameAr && product.nameAr.includes(filters.query!)) ||
                    product.manufacturer.toLowerCase().includes(query) ||
                    (product.activeIngredient &&
                        product.activeIngredient.toLowerCase().includes(query)) ||
                    product.tags.some((tag) => tag.toLowerCase().includes(query)),
            );
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter((product) => product.category === filters.category);
        }

        // Price range filter
        if (filters.priceRange) {
            filtered = filtered.filter(
                (product) =>
                    product.averagePrice >= filters.priceRange!.min &&
                    product.averagePrice <= filters.priceRange!.max,
            );
        }

        // Prescription filter
        if (filters.requiresPrescription !== undefined) {
            filtered = filtered.filter(
                (product) => product.requiresPrescription === filters.requiresPrescription,
            );
        }

        // Availability filter
        if (filters.availability && filters.availability !== 'all') {
            filtered = filtered.filter((product) => product.availability === filters.availability);
        }

        // Manufacturer filter
        if (filters.manufacturer && filters.manufacturer !== 'all') {
            filtered = filtered.filter((product) => product.manufacturer === filters.manufacturer);
        }

        // In-stock only filter
        if (filters.inStockOnly) {
            filtered = filtered.filter((product) => product.availability === 'in-stock');
        }

        // STEP 3: Apply sorting
        if (filters.sortBy) {
            this.sortProducts(filtered, filters.sortBy, filters.sortOrder || 'asc');
        }

        return filtered;
    }

    private sortProducts(
        products: DatabaseProduct[],
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
                    aValue = a.averagePrice;
                    bValue = b.averagePrice;
                    break;
                case 'rating':
                    aValue = a.popularityScore;
                    bValue = b.popularityScore;
                    break;
                case 'newest':
                    aValue = a.id; // Use ID as proxy for newness
                    bValue = b.id;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortOrder === 'desc' ? 1 : -1;
            if (aValue > bValue) return sortOrder === 'desc' ? -1 : 1;
            return 0;
        });
    }

    public getProductById(id: string): DatabaseProduct | null {
        return this.databaseProducts.find((product) => product.id === id) || null;
    }

    public getProductsByCategory(category: string): DatabaseProduct[] {
        return this.databaseProducts.filter((product) => product.category === category);
    }

    public getPopularProducts(limit: number = 10): DatabaseProduct[] {
        return this.databaseProducts
            .sort((a, b) => b.popularityScore - a.popularityScore)
            .slice(0, limit);
    }

    public getRecentlyAddedProducts(limit: number = 10): DatabaseProduct[] {
        // For demo purposes, return products sorted by ID (newer IDs = more recent)
        return this.databaseProducts.sort((a, b) => b.id.localeCompare(a.id)).slice(0, limit);
    }

    public getProductsByManufacturer(manufacturer: string): DatabaseProduct[] {
        return this.databaseProducts.filter(
            (product) => product.manufacturer.toLowerCase() === manufacturer.toLowerCase(),
        );
    }

    public getAvailableCategories(businessType?: 'pharmacy' | 'vendor'): string[] {
        let products = this.databaseProducts;

        if (businessType) {
            products = this.searchProducts({ businessType });
        }

        const categories = new Set(products.map((product) => product.category));
        return Array.from(categories).sort();
    }

    public getAvailableManufacturers(businessType?: 'pharmacy' | 'vendor'): string[] {
        let products = this.databaseProducts;

        if (businessType) {
            products = this.searchProducts({ businessType });
        }

        const manufacturers = new Set(products.map((product) => product.manufacturer));
        return Array.from(manufacturers).sort();
    }

    public getProductsForBusinessType(businessType: 'pharmacy' | 'vendor'): DatabaseProduct[] {
        return this.searchProducts({ businessType });
    }

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
        const products = this.searchProducts({ businessType });

        const totalProducts = products.length;
        const totalMedicines = products.filter((p) => p.type === 'medicine').length;
        const totalMedicalSupplies = products.filter((p) => p.type === 'medical-supply').length;
        const totalHygieneSupplies = products.filter((p) => p.type === 'hygiene-supply').length;
        const totalMedicalDevices = products.filter((p) => p.type === 'medical-device').length;
        const prescriptionProducts = products.filter((p) => p.requiresPrescription).length;
        const otcProducts = products.filter((p) => !p.requiresPrescription).length;

        const averagePrice =
            products.length > 0
                ? Math.round(
                      (products.reduce((sum, p) => sum + p.averagePrice, 0) / products.length) *
                          100,
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

    public getPriceRange(): { min: number; max: number } {
        const prices = this.databaseProducts.map((product) => product.averagePrice);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }

    public getProductStatistics(): {
        totalProducts: number;
        totalMedicines: number;
        prescriptionProducts: number;
        otcProducts: number;
        averagePrice: number;
        categoryCounts: Record<string, number>;
    } {
        const totalProducts = this.databaseProducts.filter((p) => p.type === 'product').length;
        const totalMedicines = this.databaseProducts.filter((p) => p.type === 'medicine').length;
        const prescriptionProducts = this.databaseProducts.filter(
            (p) => p.requiresPrescription,
        ).length;
        const otcProducts = this.databaseProducts.filter((p) => !p.requiresPrescription).length;
        const averagePrice =
            this.databaseProducts.reduce((sum, p) => sum + p.averagePrice, 0) /
            this.databaseProducts.length;

        const categoryCounts: Record<string, number> = {};
        this.databaseProducts.forEach((product) => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });

        return {
            totalProducts,
            totalMedicines,
            prescriptionProducts,
            otcProducts,
            averagePrice,
            categoryCounts,
        };
    }

    public addProductToPharmacyInventory(
        productId: string,
        pharmacyId: string,
        inventoryData: {
            stock: number;
            price: number;
            expiryDate: string;
            batchNumber: string;
            location: string;
            minStockThreshold: number;
            supplier: string;
            notes?: string;
        },
    ): boolean {
        const product = this.getProductById(productId);
        if (!product) {
            return false;
        }

        // In a real application, this would save to a database
        // For now, we'll just return true to indicate success
        console.log(
            `Added product ${product.name} to pharmacy ${pharmacyId} inventory:`,
            inventoryData,
        );
        return true;
    }

    public getRecommendedProducts(currentProductId: string, limit: number = 5): DatabaseProduct[] {
        const currentProduct = this.getProductById(currentProductId);
        if (!currentProduct) {
            return [];
        }

        // Find products with similar categories, manufacturers, or active ingredients
        const recommendations = this.databaseProducts
            .filter((product) => product.id !== currentProductId)
            .map((product) => {
                let score = 0;

                // Same category
                if (product.category === currentProduct.category) score += 3;

                // Same manufacturer
                if (product.manufacturer === currentProduct.manufacturer) score += 2;

                // Similar active ingredient
                if (
                    product.activeIngredient &&
                    currentProduct.activeIngredient &&
                    product.activeIngredient === currentProduct.activeIngredient
                )
                    score += 4;

                // Similar prescription requirement
                if (product.requiresPrescription === currentProduct.requiresPrescription)
                    score += 1;

                // Similar price range (within 50%)
                const priceDiff =
                    Math.abs(product.averagePrice - currentProduct.averagePrice) /
                    currentProduct.averagePrice;
                if (priceDiff <= 0.5) score += 1;

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
export const productDatabaseService = ProductDatabaseService.getInstance();
