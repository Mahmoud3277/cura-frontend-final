// Vendor data structure for product availability
export interface VendorProductInfo {
    vendorId: string;
    vendorName: string;
    vendorNameAr: string;
    vendorType: 'manufacturer' | 'distributor' | 'wholesaler' | 'importer' | 'retailer';
    cityId: string;
    cityName: string;
    governorateId: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    deliveryTime: string;
    deliveryFee: number;
    minimumOrderQuantity: number;
    bulkPricing?: {
        quantity: number;
        price: number;
    }[];
    rating: number;
    reviewCount: number;
    specialOffers?: string[];
}

// Mock vendor data for products - in a real implementation, this would come from a database
export const vendorProductData: { [productName: string]: VendorProductInfo[] } = {
    'Paracetamol 500mg': [
        {
            vendorId: 'vendor-pharmatech',
            vendorName: 'PharmaTech Solutions',
            vendorNameAr: 'شركة فارماتك للحلول',
            vendorType: 'manufacturer',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            price: 21.0,
            originalPrice: 25.0,
            inStock: true,
            deliveryTime: '1-2 days',
            deliveryFee: 25,
            minimumOrderQuantity: 10,
            bulkPricing: [
                { quantity: 50, price: 19.5 },
                { quantity: 100, price: 18.0 },
            ],
            rating: 4.7,
            reviewCount: 189,
            specialOffers: ['Bulk discount available', 'Free delivery on orders over EGP 500'],
        },
        {
            vendorId: 'vendor-mediplus',
            vendorName: 'MediPlus Distribution',
            vendorNameAr: 'شركة ميدي بلس للتوزيع',
            vendorType: 'distributor',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            price: 22.5,
            originalPrice: 28.0,
            inStock: true,
            deliveryTime: '2-3 days',
            deliveryFee: 20,
            minimumOrderQuantity: 5,
            bulkPricing: [
                { quantity: 25, price: 21.0 },
                { quantity: 50, price: 19.5 },
            ],
            rating: 4.5,
            reviewCount: 134,
            specialOffers: ['Next day delivery available'],
        },
    ],
    'Vitamin D3 1000IU': [
        {
            vendorId: 'vendor-globalhealth',
            vendorName: 'Global Health Imports',
            vendorNameAr: 'شركة الصحة العالمية للاستيراد',
            vendorType: 'importer',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            price: 38.0,
            originalPrice: 45.0,
            inStock: true,
            deliveryTime: '3-5 days',
            deliveryFee: 30,
            minimumOrderQuantity: 3,
            bulkPricing: [
                { quantity: 10, price: 36.0 },
                { quantity: 20, price: 34.0 },
            ],
            rating: 4.4,
            reviewCount: 92,
            specialOffers: ['Import quality guarantee', 'Extended warranty'],
        },
        {
            vendorId: 'vendor-wellness',
            vendorName: 'Wellness Products Co.',
            vendorNameAr: 'شركة منتجات العافية',
            vendorType: 'wholesaler',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            price: 40.0,
            originalPrice: 50.0,
            inStock: true,
            deliveryTime: '2-4 days',
            deliveryFee: 25,
            minimumOrderQuantity: 2,
            bulkPricing: [
                { quantity: 6, price: 38.0 },
                { quantity: 12, price: 36.0 },
            ],
            rating: 4.2,
            reviewCount: 78,
            specialOffers: ['Wellness bundle discounts'],
        },
    ],
    'Omega-3 Fish Oil': [
        {
            vendorId: 'vendor-globalhealth',
            vendorName: 'Global Health Imports',
            vendorNameAr: 'شركة الصحة العالمية للاستيراد',
            vendorType: 'importer',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            price: 80.0,
            originalPrice: 95.0,
            inStock: true,
            deliveryTime: '3-5 days',
            deliveryFee: 30,
            minimumOrderQuantity: 2,
            bulkPricing: [
                { quantity: 5, price: 75.0 },
                { quantity: 10, price: 70.0 },
            ],
            rating: 4.6,
            reviewCount: 145,
            specialOffers: ['Premium quality imported', 'Lab tested'],
        },
    ],
    'Multivitamin Complex': [
        {
            vendorId: 'vendor-wellness',
            vendorName: 'Wellness Products Co.',
            vendorNameAr: 'شركة منتجات العافية',
            vendorType: 'wholesaler',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            price: 68.0,
            originalPrice: 80.0,
            inStock: true,
            deliveryTime: '2-4 days',
            deliveryFee: 25,
            minimumOrderQuantity: 1,
            bulkPricing: [
                { quantity: 3, price: 65.0 },
                { quantity: 6, price: 62.0 },
            ],
            rating: 4.3,
            reviewCount: 167,
            specialOffers: ['Complete nutrition package'],
        },
    ],
    'Baby Formula Powder': [
        {
            vendorId: 'vendor-pharmatech',
            vendorName: 'PharmaTech Solutions',
            vendorNameAr: 'شركة فارماتك للحلول',
            vendorType: 'manufacturer',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            price: 105.0,
            originalPrice: 120.0,
            inStock: true,
            deliveryTime: '1-2 days',
            deliveryFee: 25,
            minimumOrderQuantity: 2,
            bulkPricing: [
                { quantity: 6, price: 100.0 },
                { quantity: 12, price: 95.0 },
            ],
            rating: 4.8,
            reviewCount: 203,
            specialOffers: ['Baby care bundle available', 'Pediatrician recommended'],
        },
    ],
};

// Helper functions
export function getVendorsByProduct(productName: string, cityId?: string): VendorProductInfo[] {
    const vendors = vendorProductData[productName] || [];

    if (cityId) {
        return vendors.filter((vendor) => vendor.cityId === cityId && vendor.inStock);
    }

    return vendors.filter((vendor) => vendor.inStock);
}

export function getVendorById(
    vendorId: string,
    productName: string,
): VendorProductInfo | undefined {
    const vendors = vendorProductData[productName] || [];
    return vendors.find((vendor) => vendor.vendorId === vendorId);
}

export function getVendorsByCity(cityId: string): VendorProductInfo[] {
    const allVendors: VendorProductInfo[] = [];

    Object.values(vendorProductData).forEach((productVendors) => {
        productVendors.forEach((vendor) => {
            if (vendor.cityId === cityId && vendor.inStock) {
                allVendors.push(vendor);
            }
        });
    });

    return allVendors;
}

export function getVendorsByType(vendorType: VendorProductInfo['vendorType']): VendorProductInfo[] {
    const allVendors: VendorProductInfo[] = [];

    Object.values(vendorProductData).forEach((productVendors) => {
        productVendors.forEach((vendor) => {
            if (vendor.vendorType === vendorType && vendor.inStock) {
                allVendors.push(vendor);
            }
        });
    });

    return allVendors;
}

export function getBestPriceVendor(productName: string, cityId?: string): VendorProductInfo | null {
    const vendors = getVendorsByProduct(productName, cityId);

    if (vendors.length === 0) return null;

    return vendors.reduce((best, current) => (current.price < best.price ? current : best));
}

export function getVendorStats() {
    const allVendors: VendorProductInfo[] = [];

    Object.values(vendorProductData).forEach((productVendors) => {
        productVendors.forEach((vendor) => {
            allVendors.push(vendor);
        });
    });

    const uniqueVendors = Array.from(new Set(allVendors.map((v) => v.vendorId))).map(
        (id) => allVendors.find((v) => v.vendorId === id)!,
    );

    return {
        totalVendors: uniqueVendors.length,
        activeVendors: uniqueVendors.filter((v) => v.inStock).length,
        averageRating: uniqueVendors.reduce((sum, v) => sum + v.rating, 0) / uniqueVendors.length,
        totalProducts: allVendors.length,
        byType: uniqueVendors.reduce(
            (acc, vendor) => {
                acc[vendor.vendorType] = (acc[vendor.vendorType] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        ),
        byCity: uniqueVendors.reduce(
            (acc, vendor) => {
                acc[vendor.cityName] = (acc[vendor.cityName] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        ),
    };
}
