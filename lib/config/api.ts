import { getAuthToken } from '@/lib/utils/cookies';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Create authenticated headers
export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.HEADERS,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// API request wrapper with proper error handling
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  console.log('Making API request to:', url);
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Specific API endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN: {
    SUBSCRIPTIONS: '/admin/subscriptions',
    SUBSCRIPTION_BY_ID: (id: string) => `/admin/subscriptions/${id}`,
    PLACE_ORDER: (id: string) => `/admin/subscriptions/${id}/place-order`,
    UPDATE_STATUS: (id: string) => `/admin/subscriptions/${id}/status`,
  },
  
  // Pharmacy endpoints
  PHARMACIES: {
    BASE: '/pharmacies',
    BY_ID: (id: string) => `/pharmacies/searchPharmacyById/${id}`,
    BY_CITY: '/pharmacies/city',
    BY_GOVERNORATE: (id: string) => `/pharmacies/governorate/${id}`,
    BY_SPECIALTY: (specialty: string) => `/pharmacies/specialty/${specialty}`,
    NEARBY: '/pharmacies/nearby/location',
    CUSTOMER_LOCATION: '/pharmacies/customer-location/available',
    SEARCH: '/pharmacies/search',
    STATS: '/pharmacies/stats/summary',
    REVIEWS: '/pharmacies/reviews',
    METRICS: '/pharmacies/metrics',
    PRODUCT_STATS: '/pharmacies/product-stats',
  },
  
  // Subscription endpoints
  SUBSCRIPTIONS: {
    BASE: '/subscriptions',
    BY_ID: (id: string) => `/subscriptions/${id}`,
    BY_CUSTOMER: (customerId: string) => `/subscriptions/customer/${customerId}`,
  }
};
