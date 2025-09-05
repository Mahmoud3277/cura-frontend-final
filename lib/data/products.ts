// Enhanced Product interface remains the same as defined in the original file
export interface Product {
    _id: number;
    name: string;
    nameAr: string;
    category: string;
    price: number;
    originalPrice?: number;
    priceReference?: number;
    images: Array<{url: string; key: string; filename: string; originalName: string; type: string; size: number; uploadedAt: Date}>;
    pharmacyId: string;
    pharmacy: string;
    pharmacyAr: string;
    cityId: string;
    cityName: string;
    governorateId: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    prescription: boolean;
    description: string;
    descriptionAr: string;
    discount?: number;
    manufacturer: string;
    manufacturerAr: string;
    activeIngredient: string;
    activeIngredientAr: string;
    dosage?: string;
    dosageAr?: string;
    packSize: string;
    packSizeAr: string;
    expiryDate: string;
    batchNumber: string;
    barcode: string;
    tags: string[];
    availability: {
        inStock: boolean;
        quantity: number;
        lowStockThreshold: number;
        estimatedRestockDate?: string;
    };
    delivery: {
        availableForDelivery: boolean;
        estimatedDeliveryTime: string;
        deliveryFee: number;
    };
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Helper function to build query parameters
const buildQueryParams = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                searchParams.append(key, value.join(','));
            } else {
                searchParams.append(key, value.toString());
            }
        }
    });
    
    return searchParams.toString();
};

// Convert API response to Product interface (mapping MongoDB _id to id)
const mapApiProductToInterface = (apiProduct: any): Product => {
    return {
        _id: apiProduct._id || apiProduct.id,
        name: apiProduct.name,
        nameAr: apiProduct.nameAr,
        category: apiProduct.category,
        price: apiProduct.price,
        originalPrice: apiProduct.originalPrice,
        priceReference: apiProduct.priceReference,
        images: apiProduct.images || [],
        pharmacyId: apiProduct.pharmacyId,
        pharmacy: apiProduct.pharmacy,
        pharmacyAr: apiProduct.pharmacyAr,
        cityId: apiProduct.cityId,
        cityName: apiProduct.cityName,
        governorateId: apiProduct.governorateId,
        rating: apiProduct.rating,
        reviews: apiProduct.reviews,
        inStock: apiProduct.inStock,
        prescription: apiProduct.prescription,
        description: apiProduct.description,
        descriptionAr: apiProduct.descriptionAr,
        discount: apiProduct.discount || apiProduct.discountPercentage,
        manufacturer: apiProduct.manufacturer,
        manufacturerAr: apiProduct.manufacturerAr,
        activeIngredient: apiProduct.activeIngredient,
        activeIngredientAr: apiProduct.activeIngredientAr,
        dosage: apiProduct.dosage,
        dosageAr: apiProduct.dosageAr,
        packSize: apiProduct.packSize,
        packSizeAr: apiProduct.packSizeAr,
        expiryDate: apiProduct.expiryDate,
        batchNumber: apiProduct.batchNumber,
        barcode: apiProduct.barcode,
        tags: apiProduct.tags || [],
        availability: apiProduct.availability,
        delivery: apiProduct.delivery
    };
};

// Enhanced function to get single product by ID
export async function getProductById(id: number | string): Promise<Product | undefined> {
    try {
        const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`);
        const data = await handleApiResponse(response);
        return data.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return undefined;
    }
}

// Enhanced function to get products by city
export async function getProductsByCity(
    cityId: string, 
    options: { page?: number; limit?: number; sortBy?: string } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            cityId,
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}/city/${cityId}?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching products by city:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}
export async function fetchRelatedProducts2(id: string): Promise<Product[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/products/related/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch related products: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return (data.relatedProducts || data || []).map(mapApiProductToInterface);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
  }

// Enhanced function to get products by pharmacy
export async function getProductsByPharmacy(
    pharmacyId: string,
    options: { page?: number; limit?: number; sortBy?: string; inStockOnly?: boolean } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name',
            inStockOnly: options.inStockOnly !== false ? 'true' : 'false'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}/pharmacy/${pharmacyId}?${queryParams}`);
        const data = await handleApiResponse(response);
        console.log(data, 'from server')
        return {
            products: data.products.length > 1 ? data.products.map(mapApiProductToInterface) : data.products[0],
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching products by pharmacy:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Simplified function for backward compatibility
export async function getInStockProductsByPharmacy(pharmacyId: string): Promise<Product[]> {
    const result = await getProductsByPharmacy(pharmacyId, { inStockOnly: true });
    return result.products;
}

// Enhanced function to get products by governorate
export async function getProductsByGovernorate(
    governorateId: string,
    options: { page?: number; limit?: number; sortBy?: string } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            governorateId,
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching products by governorate:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Enhanced function to get products by category
export async function getProductsByCategory(
    category: string,
    options: { page?: number; limit?: number; sortBy?: string } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            categories: [category],
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Enhanced function to get all available products
export async function getAvailableProducts(
    options: { page?: number; limit?: number; sortBy?: string } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            inStockOnly: 'true',
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching available products:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Function to get products in enabled cities
export async function getProductsInEnabledCities(
    enabledCityIds: string[],
    options: { page?: number; limit?: number; sortBy?: string } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            cityName: enabledCityIds,
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching products in enabled cities:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Enhanced function to get products for customer location
export async function getProductsForCustomerLocation(
    cityId?: string, 
    governorateId?: string,
    options: { page?: number; limit?: number; sortBy?: string } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    if (!cityId && !governorateId) {
        // Return empty result if no location is selected
        return { products: [], total: 0, totalPages: 0 };
    }

    try {
        const queryParams = buildQueryParams({
            cityId,
            governorateId,
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching products for customer location:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Function to get available pharmacies for customer location
export async function getPharmaciesForCustomerLocation(
    cityId?: string, 
    governorateId?: string
): Promise<string[]> {
    try {
        const result = await getProductsForCustomerLocation(cityId, governorateId, { limit: 1000 });
        const pharmacyIds = Array.from(new Set(result.products.map(product => product.pharmacyId)));
        return pharmacyIds;
    } catch (error) {
        console.error('Error fetching pharmacies for customer location:', error);
        return [];
    }
}

// Function to get in-stock products for customer location
export async function getInStockProductsForCustomerLocation(
    cityId?: string, 
    governorateId?: string,
    options: { page?: number; limit?: number; sortBy?: string } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    if (!cityId && !governorateId) {
        return { products: [], total: 0, totalPages: 0 };
    }

    try {
        const queryParams = buildQueryParams({
            cityId,
            governorateId,
            inStockOnly: 'true',
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error fetching in-stock products for customer location:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Enhanced search function
export async function searchProducts(
    query: string, 
    language: 'en' | 'ar' = 'en',
    options: { 
        page?: number; 
        limit?: number; 
        sortBy?: string;
        cityId?: string;
        governorateId?: string;
        categories?: string[];
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        inStockOnly?: boolean;
    } = {}
): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            search: query,
            language,
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'name',
            cityId: options.cityId,
            governorateId: options.governorateId,
            categories: options.categories,
            minPrice: options.minPrice,
            maxPrice: options.maxPrice,
            minRating: options.minRating,
            inStockOnly: options.inStockOnly ? 'true' : undefined
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}/search?${queryParams}`);
        const data = await handleApiResponse(response);
        
        return {
            products: data.products.map(mapApiProductToInterface),
            total: data.totalResults,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error searching products:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Enhanced filter function
export async function filterProducts(filters: {
    cityIds?: string[];
    categories?: string[];
    priceRange?: { min: number; max: number };
    inStockOnly?: boolean;
    prescriptionOnly?: boolean;
    minRating?: number;
    pharmacyIds?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
}): Promise<{ products: Product[]; total: number; totalPages: number }> {
    try {
        const queryParams = buildQueryParams({
            cityName: filters.cityIds,
            categories: filters.categories,
            minPrice: filters.priceRange?.min,
            maxPrice: filters.priceRange?.max,
            inStockOnly: filters.inStockOnly ? 'true' : undefined,
            prescriptionOnly: filters.prescriptionOnly ? 'true' : filters.prescriptionOnly === false ? 'false' : undefined,
            minRating: filters.minRating,
            pharmacyIds: filters.pharmacyIds,
            page: filters.page || 1,
            limit: filters.limit || 20,
            sortBy: filters.sortBy || 'name'
        });

        const response = await fetch(`${PRODUCTS_ENDPOINT}?${queryParams}`);
        const data = await handleApiResponse(response);
        console.log(data)
        return {
            products: data.data,
            total: data.total,
            totalPages: data.totalPages
        };
    } catch (error) {
        console.error('Error filtering products:', error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

// Sort function (now handled by backend, but keeping for compatibility)
export function sortProducts(products: Product[], sortBy: string): Product[] {
    // This function is now mainly for client-side sorting of already fetched data
    // The main sorting should be handled by the backend API
    const sortedProducts = [...products];

    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'reviews':
            return sortedProducts.sort((a, b) => b.reviews - a.reviews);
        case 'name-desc':
            return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sortedProducts.sort((a, b) => b._id - a._id);
        case 'name':
        default:
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
}

// New utility functions for working with the API

// Get product categories
export async function getProductCategories(): Promise<string[]> {
    try {
        const response = await fetch(`${PRODUCTS_ENDPOINT}/meta/categories`);
        const data = await handleApiResponse(response);
        return data.categories;
    } catch (error) {
        console.error('Error fetching product categories:', error);
        return ['otc', 'prescription', 'supplements', 'vitamins', 'baby', 'medical', 'skincare'];
    }
}

// Get product statistics
export async function getProductStatistics(): Promise<{
    general: {
        totalProducts: number;
        inStockProducts: number;
        averagePrice: number;
    };
    categories: Array<{
        _id: string;
        count: number;
        averagePrice: number;
    }>;
}> {
    try {
        const response = await fetch(`${PRODUCTS_ENDPOINT}/meta/statistics`);
        const data = await handleApiResponse(response);
        return data;
    } catch (error) {
        console.error('Error fetching product statistics:', error);
        return {
            general: { totalProducts: 0, inStockProducts: 0, averagePrice: 0 },
            categories: []
        };
    }
}

// Function to create a new product (for pharmacy owners)
export async function createProduct(productData: Partial<Product>, authToken: string, imageFiles?: File[]): Promise<Product | null> {
    try {
        const formData = new FormData();
        
        // Add all product data to FormData
        Object.entries(productData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    // Handle arrays (tags, keywords)
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        // Add image files if provided
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file, index) => {
                formData.append(`images`, file);
            });
        }

        const response = await fetch(PRODUCTS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
                // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
            },
            body: formData
        });

        const data = await handleApiResponse(response);
        return data.data;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
}

// Function to update a product (for pharmacy owners)
export async function updateProduct(
    productId: string | number, 
    updateData: Partial<Product>, 
    authToken: string
): Promise<Product | null> {
    try {
        const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updateData)
        });

        const data = await handleApiResponse(response);
        return data.data;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
}

// Function to update product inventory (for pharmacy owners)
export async function updateProductInventory(
    productId: string | number,
    inventoryData: {
        quantity?: number;
        price?: number;
        availability?: Partial<Product['availability']>;
        delivery?: Partial<Product['delivery']>;
    },
    authToken: string
): Promise<Product | null> {
    try {
        const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}/inventory`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(inventoryData)
        });

        const data = await handleApiResponse(response);
        return mapApiProductToInterface(data.product);
    } catch (error) {
        console.error('Error updating product inventory:', error);
        return null;
    }
}

// Function to delete a product (for pharmacy owners)
export async function deleteProduct(productId: string | number, authToken: string): Promise<boolean> {
    try {
        const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        await handleApiResponse(response);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}