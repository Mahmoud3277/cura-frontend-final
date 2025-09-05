// lib/api/productss.ts - Updated API helpers matching your database structure

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Interface matching your actual database structure
export interface DatabaseMedicine {
    _id: string;
    name: string;
    nameAr: string;
    category: string;
    price: number;
    originalPrice?: number;
    priceReference?: number;
    images?: Array<{url: string; key: string; filename: string; originalName: string; type: string; size: number; uploadedAt: Date}>;
    pharmacyId: string;
    pharmacy: string;
    pharmacyAr: string;
    cityId: string;
    governorateId: string;
    rating?: number;
    reviews?: number;
    inStock: boolean;
    prescription: boolean;
    description?: string;
    descriptionAr?: string;
    manufacturer?: string;
    manufacturerAr?: string;
    activeIngredient?: string;
    activeIngredientAr?: string;
    dosage?: string;
    dosageAr?: string;
    packSize?: string;
    packSizeAr?: string;
    expiryDate?: string;
    batchNumber?: string;
    barcode?: string;
    tags?: string[];
    availability?: {
        inStock: boolean;
        quantity: number;
        lowStockThreshold: number;
    };
    delivery?: {
        availableForDelivery: boolean;
        estimatedDeliveryTime: string;
        deliveryFee?: number;
    };
}

// Transform database structure to component-expected structure
export function transformMedicineData(dbMedicine: DatabaseMedicine): Medicine {
    return {
        _id: dbMedicine._id,
        id: parseInt(dbMedicine._id) || 0,
        name: dbMedicine.name,
        nameAr: dbMedicine.nameAr,
        genericName: dbMedicine.activeIngredient,
        brand: dbMedicine.manufacturer,
        category: dbMedicine.category,
        form: dbMedicine.dosage || 'tablet', // Default form if not specified
        strength: dbMedicine.dosage || '',
        description: dbMedicine.description,
        requiresPrescription: dbMedicine.prescription,
        isActive: true,
        images: dbMedicine.images || [],
        rating: dbMedicine.rating || 0,
        reviews: dbMedicine.reviews || 0,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Price information
        price: dbMedicine.price,
        originalPrice: dbMedicine.originalPrice,
        priceReference: dbMedicine.priceReference,
        
        // Stock information
        inStock: dbMedicine.inStock,
        stockCount: dbMedicine.availability?.quantity || 0,
        
        // Availability object
        availability: {
            inStock: dbMedicine.inStock,
            totalPharmacies: 1, // Single pharmacy per record in your structure
            quantity: dbMedicine.availability?.quantity || 0,
        },
        
        // Delivery information
        delivery: dbMedicine.delivery || {
            availableForDelivery: true,
            estimatedDeliveryTime: '30-45 min',
        },
        
        // Pharmacy information
        pharmacyId: dbMedicine.pharmacyId,
        
        // Location information
        cityId: dbMedicine.cityId,
        governorateId: dbMedicine.governorateId,
        
        // Additional fields for compatibility
        manufacturer: dbMedicine.manufacturer,
        manufacturerAr: dbMedicine.manufacturerAr,
        activeIngredient: dbMedicine.activeIngredient,
        activeIngredientAr: dbMedicine.activeIngredientAr,
        packSize: dbMedicine.packSize,
        packSizeAr: dbMedicine.packSizeAr,
        tags: dbMedicine.tags || [],
    };
}

// Updated API functions
export async function fetchMedicines(params: Record<string, any> = {}): Promise<{
    medicines: Medicine[];
    total: number;
    totalPages: number;
    currentPage: number;
} | null> {
    try {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
        // queryParams.append("productType", 'medicine')
        const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch medicines: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
            console.log(data)
        // Transform the database records to expected format
        const transformedMedicines = data.data;
        
        return {
            medicines: transformedMedicines,
            total: data.pagination.totalItems || transformedMedicines.length,
            totalPages: data.totalPages || 1,
            currentPage: data.currentPage || 1,
        };
    } catch (error) {
        console.error('Error fetching medicines:', error);
        return null;
    }
}

// Add this function to your lib/api/products.ts file

export async function fetchRelatedProducts2(id: string): Promise<Medicine[]> {
  try {
      const response = await fetch(`${API_BASE_URL}/products/related/${id}`);
      
      if (!response.ok) {
          throw new Error(`Failed to fetch related products: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return data.data;
  } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
  }
}


export async function fetchMedicineById2(id: string): Promise<Medicine | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch medicine: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        console.log('getting product by id: ', data)
        return data.data;
    } catch (error) {
        console.error('Error fetching medicine by ID:', error);
        return null;
    }
}




export async function searchAlternatives(
    searchTerm: string, 
    excludeIds: (string | number)[] = [], 
    limit: number = 50
): Promise<Medicine[]> {
    try {
        const params = new URLSearchParams({
            search: searchTerm,
            limit: limit.toString()
        });
        
        if (excludeIds.length > 0) {
            params.append('excludeIds', excludeIds.join(','));
        }

        const response = await fetch(`${API_BASE_URL}/products/search/alternatives?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`Failed to search alternatives: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return (data.medicines || data || []).map(transformMedicineData);
    } catch (error) {
        console.error('Error searching alternatives:', error);
        return [];
    }
}

export async function fetchCategories(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/products/meta/categories`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }

        const categories = await response.json();
        return Array.isArray(categories) ? categories : ['otc', 'prescription'];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return ['otc', 'prescription']; // Default categories
    }
}

export async function fetchForms(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/products/meta/forms`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch forms: ${response.status} ${response.statusText}`);
        }

        const forms = await response.json();
        return Array.isArray(forms) ? forms : ['tablet', 'capsule', 'syrup', 'injection'];
    } catch (error) {
        console.error('Error fetching forms:', error);
        return ['tablet', 'capsule', 'syrup', 'injection']; // Default forms
    }
}

// Enhanced helper functions with proper error handling
export async function getProductById2(id: string | number): Promise<Medicine | null> {
    try {
        return await fetchMedicineById2(id.toString());
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return null;
    }
}

export async function getProductsByCity(cityId: string): Promise<Medicine[]> {
    try {
        const data = await fetchMedicines({ 'cityId':cityId });
        return data?.medicines || [];
    } catch (error) {
        console.error('Error fetching products by city:', error);
        return [];
    }
}

export async function getProductsByPharmacy(pharmacyId: string): Promise<Medicine[]> {
    try {
        const data = await fetchMedicines({ pharmacyId });
        return data?.medicines || [];
    } catch (error) {
        console.error('Error fetching products by pharmacy:', error);
        return [];
    }
}

export async function getInStockProductsByPharmacy2(pharmacyId: string): Promise<Medicine[]> {
    try {
        const data = await fetchMedicines({ pharmacyId, inStockOnly: true });
        return data?.medicines || [];
    }
    catch (error) {
        console.error('Error fetching in-stock products by pharmacy:', error);
        return [];
    }
}

export async function getProductsByCategory(category: string): Promise<Medicine[]> {
    try {
        const data = await fetchMedicines({ category });
        return data?.medicines || [];
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}

export async function getAvailableProducts(): Promise<Medicine[]> {
    try {
        const data = await fetchMedicines({ inStockOnly: true });
        return data?.medicines || [];
    } catch (error) {
        console.error('Error fetching available products:', error);
        return [];
    }
}

export async function getProductsForCustomerLocation(
    cityId?: string, 
    governorateId?: string
): Promise<Medicine[]> {
    try {
        const params: Record<string, any> = {};
        if (cityId) params.cityId = cityId;
        else if (governorateId) params.governorateId = governorateId;
        else return [];

        const data = await fetchMedicines(params);
        return data?.medicines || [];
    } catch (error) {
        console.error('Error fetching products for customer location:', error);
        return [];
    }
}

export async function getInStockProductsForCustomerLocation(
    cityId?: string, 
    governorateId?: string
): Promise<Medicine[]> {
    try {
        const params: Record<string, any> = { inStockOnly: true };
        if (cityId) params.cityId = cityId;
        else if (governorateId) params.governorateId = governorateId;
        else return [];

        const data = await fetchMedicines(params);
        return data?.medicines || [];
    } catch (error) {
        console.error('Error fetching in-stock products for location:', error);
        return [];
    }
}

export async function searchProducts(query: string, language: 'en' | 'ar' = 'en'): Promise<Medicine[]> {
    try {
        const data = await fetchMedicines({ search: query });
        return data?.medicines || [];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

export async function filterProducts(filters: {
    categories?: string[];
    priceRange?: { min: number; max: number };
    inStockOnly?: boolean;
    prescriptionOnly?: boolean;
    minRating?: number;
    pharmacyIds?: string[];
    cityIds?: string[];
}): Promise<Medicine[]> {
    try {
        const params: Record<string, any> = {};
        
        if (filters.categories?.length) params.category = filters.categories[0];
        if (filters.priceRange) {
            params.minPrice = filters.priceRange.min;
            params.maxPrice = filters.priceRange.max;
        }
        if (filters.inStockOnly) params.inStockOnly = true;
        if (filters.prescriptionOnly !== undefined) params.prescriptionOnly = filters.prescriptionOnly;
        if (filters.minRating) params.minRating = filters.minRating;
        if (filters.pharmacyIds?.length) params.pharmacyId = filters.pharmacyIds[0];
        if (filters.cityIds?.length) params.cityId = filters.cityIds[0];

        const data = await fetchMedicines(params);
        return data?.medicines || [];
    } catch (error) {
        console.error('Error filtering products:', error);
        return [];
    }
}

export function sortProducts(products: Medicine[], sortBy: string): Medicine[] {
    const sortedProducts = [...products];

    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        case 'price-high':
            return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        case 'rating':
            return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'reviews':
            return sortedProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        case 'name-desc':
            return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sortedProducts.sort((a, b) => (b.id || 0) - (a.id || 0));
        case 'name':
        default:
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
}

// Type definitions to match your database structure
export interface Medicine {
    _id: string;
    id: number;
    name: string;
    nameAr?: string;
    genericName?: string;
    brand?: string;
    category: string;
    form: string;
    strength: string;
    description?: string;
    descriptionAr?: string;
    requiresPrescription: boolean;
    prescriptionRequired?: boolean; // Alternative property name
    isActive: boolean;
    images?: Array<{url: string; key: string; filename: string; originalName: string; type: string; size: number; uploadedAt: Date}>;
    rating?: number;
    reviews?: number;
    viewCount?: number;
    createdAt: string;
    updatedAt: string;
    price?: number;
    originalPrice?: number;
    priceReference?: number;
    inStock?: boolean;
    stockCount?: number;
    availability?: {
        inStock: boolean;
        totalPharmacies: number;
        quantity:number
    };
    delivery?: {
        availableForDelivery: boolean;
        estimatedDeliveryTime?: string;
    };
    pharmacyId?: string;
    cityId?: string;
    governorateId?: string;
    manufacturer?: string;
    manufacturerAr?: string;
    activeIngredient?: string;
    activeIngredientAr?: string;
    packSize?: string;
    packSizeAr?: string;
    tags?: string[];
    
    // Additional properties for pharmacy and vendor stocks
    pharmacyStocks?: Array<{
        id: string;
        providerName: string;
        providerType: 'pharmacy';
        price: number;
        originalPrice?: number;
        inStock: boolean;
        quantity: number;
        deliveryFee: number;
        estimatedDeliveryTime: string;
    }>;
    
    vendorStocks?: Array<{
        id: string;
        providerName: string;
        providerType: 'vendor';
        price: number;
        originalPrice?: number;
        inStock: boolean;
        quantity: number;
        deliveryFee: number;
        estimatedDeliveryTime: string;
    }>;
    
    // Additional properties for eligibility
    pharmacyEligible?: boolean;
    vendorEligible?: boolean;
}

// Export all the functions with both old and new names for compatibility
export {
    fetchMedicines as fetchAllMedicines,
    fetchMedicineById2 as fetchMedicineById,
    searchAlternatives as searchMedicineAlternatives,
    fetchCategories as fetchMedicineCategories,
    fetchForms as fetchMedicineForms,
    getProductById2 as getProductById,
    getProductsByCity as fetchMedicinesByCity,
    getProductsByPharmacy as fetchMedicinesByPharmacy,
    getInStockProductsByPharmacy2 as getInStockProductsByPharmacy,
    getProductsByCategory as fetchMedicinesByCategory,
    getAvailableProducts as fetchAvailableMedicines,
    getProductsForCustomerLocation as fetchMedicinesForCustomerLocation,
    getInStockProductsForCustomerLocation as fetchInStockMedicinesForCustomerLocation,
    searchProducts as searchMedicines,
    filterProducts as filterMedicines,
    sortProducts as sortMedicines,
    fetchRelatedProducts2 as fetchRelatedProducts
};

export async function fetchPharmaciesForCustomerLocation(
    cityId?: string, 
    governorateId?: string
): Promise<string[]> {
    try {
        const params: Record<string, any> = {};
        
        // Extract string values if objects are passed
        if (cityId) {
            // If cityId is an object, extract the actual city name
            if (typeof cityId === 'object' && cityId !== null) {
                const cityObj = cityId as any;
                params.cityId = cityObj.nameEn || cityObj.id || cityObj._id;
                // Optionally also use governorate if available
                if (cityObj.governorateId) {
                    params.governorateId = cityObj.governorateId;
                }
            } else {
                params.cityId = cityId;
            }
        } else if (governorateId) {
            // Similar handling for governorateId if it's an object
            if (typeof governorateId === 'object' && governorateId !== null) {
                const govObj = governorateId as any;
                params.governorateId = govObj.id || govObj._id || govObj.governorateId;
            } else {
                params.governorateId = governorateId;
            }
        } else {
            return [];
        }

        const url = new URL(`${API_BASE_URL}/pharmacies/city`);
        Object.entries(params).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                url.searchParams.append(key, value);
            }
        });

        console.log('Final URL:', url.toString()); // Debug log
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error(`Failed to fetch pharmacies: ${response.status} ${response.statusText}`);
        }

        const pharmacies = await response.json();
        return Array.isArray(pharmacies) 
            ? pharmacies.map(p => p.id || p._id || p.pharmacyId).filter(Boolean)
            : [];
    } catch (error) {
        console.error('Error fetching pharmacies for location:', error);
        return [];
    }
}
