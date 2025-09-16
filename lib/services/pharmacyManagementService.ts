// Pharmacy Management Service - Integrated with Backend API
import axios, { AxiosResponse } from 'axios';
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/cookies';
import { API_CONFIG, getAuthHeaders, apiRequest, API_ENDPOINTS } from '@/lib/config/api';

// Use centralized API configuration
const PHARMACY_ENDPOINTS = API_ENDPOINTS.PHARMACIES;

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Response Types
interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface PaginationInfo {
  current: number;
  total: number;
  count: number;
  totalRecords: number;
}

interface PaginatedResponse<T> extends APIResponse<T> {
  pagination: PaginationInfo;
}

// Enhanced interfaces based on backend implementation
export interface BackendPharmacy {
  _id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    area: string;
    city: string;
    governorate: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  addressAr?: string;
  cityId: string;
  governorateId: string;
  isActive: boolean;
  isVerified: boolean;
  specialties: string[];
  deliveryService: boolean;
  deliveryFee?: number;
  rating: number;
  reviewCount: number;
  viewCount: number;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  licenseNumber?: string;
  licenseExpiry?: string;
  workingHours?: {
    [key: string]: { open: string; close: string; is24Hours: boolean };
  };
  features?: string[];
  documents?: {
    license?: string;
    taxCertificate?: string;
    bankStatement?: string;
    ownershipProof?: string;
  };
  contactPerson?: {
    name: string;
    nameAr?: string;
    position: string;
    phone: string;
    email: string;
  };
  reviews?: Array<{
    user: string;
    rating: number;
    comment: string;
    aspects?: {
      service: number;
      delivery: number;
      pricing: number;
      availability: number;
    };
    date: string;
  }>;
  metrics?: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    averageDeliveryTime: number;
    fulfillmentRate: number;
    responseTime: number;
  };
  productStats?: {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    lastUpdated: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Frontend query parameters
export interface PharmacyQueryParams {
  cityId?: string;
  governorateId?: string;
  specialty?: string;
  isActive?: boolean;
  isVerified?: boolean;
  deliveryAvailable?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  language?: 'en' | 'ar';
  sortBy?: 'rating' | 'name' | 'deliveryFee' | 'distance';
  lat?: number;
  lng?: number;
  maxDistance?: number;
}

export interface PharmacyFilters {
  status?: string;
  cityId?: string;
  governorateId?: string;
  commissionRange?: { min: number; max: number };
  ratingRange?: { min: number; max: number };
  search?: string;
  specialty?: string;
  feature?: string;
}

export interface PharmacyReview {
  rating: number;
  comment: string;
  aspects?: {
    service: number;
    delivery: number;
    pricing: number;
    availability: number;
  };
}

export interface PharmacyMetrics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageDeliveryTime: number;
  fulfillmentRate: number;
  responseTime: number;
}

export interface ProductStatistics {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  lastUpdated?: string;
}

// Utility functions
const createApiClient = () => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
  });

  // Add auth token if available
  client.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle response errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

// Convert backend pharmacy to frontend format
const convertBackendPharmacy = (backendPharmacy: BackendPharmacy): PharmacyDetails => {
  return {
    id: backendPharmacy._id,
    name: backendPharmacy.name,
    nameAr: backendPharmacy.nameAr || '',
    email: backendPharmacy.email,
    phone: backendPharmacy.phone,
    address: `${backendPharmacy.address.street}, ${backendPharmacy.address.area}, ${backendPharmacy.address.city}`,
    addressAr: backendPharmacy.addressAr || '',
    cityId: backendPharmacy.cityId,
    cityName: backendPharmacy.address.city,
    governorateId: backendPharmacy.governorateId,
    governorateName: backendPharmacy.address.governorate,
    coordinates: backendPharmacy.address.coordinates || { lat: 0, lng: 0 },
    status: backendPharmacy.isActive && backendPharmacy.isVerified ? 'active' : 
             backendPharmacy.isActive && !backendPharmacy.isVerified ? 'pending' : 'inactive',
    isActive: backendPharmacy.isActive,
    isVerified: backendPharmacy.isVerified,
    licenseNumber: backendPharmacy.licenseNumber || '',
    licenseExpiry: backendPharmacy.licenseExpiry || '',
    taxId: '', // Not in backend model
    bankAccount: {
      accountNumber: '',
      bankName: '',
      iban: ''
    }, // Not in backend model
    commission: {
      rate: 10, // Default value
      type: 'fixed',
      minimumOrder: 0
    }, // Not in backend model
    performance: {
      rating: backendPharmacy.rating,
      reviewCount: backendPharmacy.reviewCount,
      totalOrders: backendPharmacy.metrics?.totalOrders || 0,
      completedOrders: backendPharmacy.metrics?.completedOrders || 0,
      cancelledOrders: backendPharmacy.metrics?.cancelledOrders || 0,
      averageDeliveryTime: backendPharmacy.metrics?.averageDeliveryTime || 0,
      fulfillmentRate: backendPharmacy.metrics?.fulfillmentRate || 0,
      responseTime: backendPharmacy.metrics?.responseTime || 0
    },
    financials: {
      pharmacyTotalSales: 0, // Not in backend model
      pharmacyMonthlySales: 0, // Not in backend model
      monthlyRevenue: 0, // Not in backend model
      platformCommissionEarned: 0, // Not in backend model
      platformPendingCommissions: 0, // Not in backend model
      platformMonthlyCommission: 0, // Not in backend model
      lastCommissionPayment: '' // Not in backend model
    },
    inventory: {
      totalProducts: backendPharmacy.productStats?.totalProducts || 0,
      lowStockItems: backendPharmacy.productStats?.lowStockItems || 0,
      outOfStockItems: backendPharmacy.productStats?.outOfStockItems || 0,
      lastUpdated: backendPharmacy.productStats?.lastUpdated || new Date().toISOString()
    },
    workingHours: {
      monday: { open: '09:00', close: '21:00', is24Hours: false },
      tuesday: { open: '09:00', close: '21:00', is24Hours: false },
      wednesday: { open: '09:00', close: '21:00', is24Hours: false },
      thursday: { open: '09:00', close: '21:00', is24Hours: false },
      friday: { open: '09:00', close: '21:00', is24Hours: false },
      saturday: { open: '09:00', close: '21:00', is24Hours: false },
      sunday: { open: '09:00', close: '21:00', is24Hours: false }
    },
    features: backendPharmacy.features || [],
    specialties: backendPharmacy.specialties || [],
    documents: {
      license: backendPharmacy.documents?.license || '',
      taxCertificate: backendPharmacy.documents?.taxCertificate || '',
      bankStatement: backendPharmacy.documents?.bankStatement || '',
      ownershipProof: backendPharmacy.documents?.ownershipProof || ''
    },
    contactPerson: {
      name: backendPharmacy.contactPerson?.name || backendPharmacy.owner?.name || '',
      nameAr: backendPharmacy.contactPerson?.nameAr || '',
      position: backendPharmacy.contactPerson?.position || 'Owner',
      phone: backendPharmacy.contactPerson?.phone || backendPharmacy.owner?.phone || '',
      email: backendPharmacy.contactPerson?.email || backendPharmacy.owner?.email || ''
    },
    createdAt: backendPharmacy.createdAt,
    updatedAt: backendPharmacy.updatedAt
  };
};

// Keep the original interfaces for compatibility
export interface PharmacyDetails {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  cityId: string;
  cityName: string;
  governorateId: string;
  governorateName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'rejected';
  isActive: boolean;
  isVerified: boolean;
  licenseNumber: string;
  licenseExpiry: string;
  taxId: string;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    iban: string;
  };
  commission: {
    rate: number;
    type: 'fixed' | 'tiered';
    minimumOrder: number;
    tieredRates?: {
      threshold: number;
      rate: number;
    }[];
  };
  performance: {
    rating: number;
    reviewCount: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    averageDeliveryTime: number;
    fulfillmentRate: number;
    responseTime: number;
  };
  financials: {
    pharmacyTotalSales: number;
    pharmacyMonthlySales: number;
    monthlyRevenue: number;
    platformCommissionEarned: number;
    platformPendingCommissions: number;
    platformMonthlyCommission: number;
    lastCommissionPayment: string;
  };
  inventory: {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    lastUpdated: string;
  };
  workingHours: {
    monday: { open: string; close: string; is24Hours: boolean };
    tuesday: { open: string; close: string; is24Hours: boolean };
    wednesday: { open: string; close: string; is24Hours: boolean };
    thursday: { open: string; close: string; is24Hours: boolean };
    friday: { open: string; close: string; is24Hours: boolean };
    saturday: { open: string; close: string; is24Hours: boolean };
    sunday: { open: string; close: string; is24Hours: boolean };
  };
  features: string[];
  specialties: string[];
  documents: {
    license: string;
    taxCertificate: string;
    bankStatement: string;
    ownershipProof: string;
  };
  contactPerson: {
    name: string;
    nameAr: string;
    position: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface PharmacyStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  rejected: number;
  averageCommission: number;
  totalRevenue: number;
  totalPharmacySales: number;
  averageRating: number;
  byCity: {
    cityId: string;
    cityName: string;
    count: number;
    revenue: number;
    pharmacySales: number;
  }[];
  byStatus: {
    active: number;
    pending: number;
    suspended: number;
    rejected: number;
  };
  recentApplications: number;
  growth: number;
}

export interface CommissionPayment {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  period: string;
  amount: number;
  commissionRate: number;
  ordersCount: number;
  totalRevenue: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  dueDate: string;
  paidDate?: string;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}

class PharmacyManagementService {
  // Get all pharmacies with filtering and pagination
  async getPharmacies(params?: PharmacyQueryParams): Promise<{
    data: PharmacyDetails[];
    pagination: PaginationInfo;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response: AxiosResponse<PaginatedResponse<BackendPharmacy[]>> = await apiClient.get(
        `${PHARMACY_ENDPOINTS.BASE}?${queryParams.toString()}`
      );

      if (!response) {
        throw new Error('Failed to fetch pharmacies');
      }

      console.log(response)
      const convertedPharmacies = response.data.data;
      return {
        data: convertedPharmacies,
        pagination: response.data.pagination
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch pharmacies');
    }
  }

  // Get pharmacy by ID
  async getPharmacyById(id: string): Promise<PharmacyDetails> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy>> = await apiClient.get(
        PHARMACY_ENDPOINTS.BY_ID(id)
      );

      if (!response) {
        throw new Error('Pharmacy not found');
      }
      console.log(response, 'getting pharmacies by id')
      return response.data.data;
    } catch (error: any) {
      throw new Error('Failed to fetch pharmacy');
    }
  }

  // Get pharmacies by city
  async getPharmaciesByCity(cityId: string): Promise<PharmacyDetails[]> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy[]>> = await apiClient.get(
        `${PHARMACY_ENDPOINTS.BY_CITY}?cityId=${cityId}`
      );


      return response.data.data.map(convertBackendPharmacy);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch pharmacies by city');
    }
  }

  // Get pharmacies by governorate
  async getPharmaciesByGovernorate(governorateId: string): Promise<PharmacyDetails[]> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy[]>> = await apiClient.get(
        PHARMACY_ENDPOINTS.BY_GOVERNORATE(governorateId)
      );

      return response.data.data.map(convertBackendPharmacy);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch pharmacies by governorate');
    }
  }

  // Get pharmacies by specialty
  async getPharmaciesBySpecialty(specialty: string): Promise<PharmacyDetails[]> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy[]>> = await apiClient.get(
        PHARMACY_ENDPOINTS.BY_SPECIALTY(specialty)
      );


      return response.data.data.map(convertBackendPharmacy);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch pharmacies by specialty');
    }
  }

  // Get nearby pharmacies
  async getNearbyPharmacies(lat: number, lng: number, maxDistance: number = 10000): Promise<PharmacyDetails[]> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy[]>> = await apiClient.get(
        `${PHARMACY_ENDPOINTS.NEARBY}?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`
      );

      return response.data.data.map(convertBackendPharmacy);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch nearby pharmacies');
    }
  }

  // Get pharmacies for customer location
  async getPharmaciesForCustomerLocation(cityId?: string, governorateId?: string): Promise<PharmacyDetails[]> {
    try {
      const queryParams = new URLSearchParams();
      if (cityId) queryParams.append('cityId', cityId);
      if (governorateId) queryParams.append('governorateId', governorateId);

      const response: AxiosResponse<APIResponse<BackendPharmacy[]>> = await apiClient.get(
        `${PHARMACY_ENDPOINTS.CUSTOMER_LOCATION}?${queryParams.toString()}`
      );

      return response.data.data.map(convertBackendPharmacy);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch pharmacies for location');
    }
  }

  // Search pharmacies
  async searchPharmacies(searchTerm: string): Promise<PharmacyDetails[]> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy[]>> = await apiClient.get(
        `${PHARMACY_ENDPOINTS.SEARCH}?search=${encodeURIComponent(searchTerm)}`
      );

      return response.data.data.map(convertBackendPharmacy);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to search pharmacies');
    }
  }

  // Get pharmacy statistics
  async getPharmacyStats(): Promise<PharmacyStats> {
    try {
      const response: AxiosResponse<APIResponse<any>> = await apiClient.get(
        PHARMACY_ENDPOINTS.STATS
      );


      // Convert backend stats to frontend format
      const backendStats = response.data.data;
      return {
        total: backendStats.total || 0,
        active: backendStats.active || 0,
        pending: backendStats.pending || 0,
        suspended: backendStats.suspended || 0,
        rejected: backendStats.rejected || 0,
        averageCommission: 10, // Default value
        totalRevenue: backendStats.totalRevenue || 0,
        totalPharmacySales: backendStats.totalSales || 0,
        averageRating: backendStats.averageRating || 0,
        byCity: backendStats.byCity || [],
        byStatus: {
          active: backendStats.active || 0,
          pending: backendStats.pending || 0,
          suspended: backendStats.suspended || 0,
          rejected: backendStats.rejected || 0
        },
        recentApplications: backendStats.recentApplications || 0,
        growth: backendStats.growth || 0
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch pharmacy statistics');
    }
  }

  // Create pharmacy
  async createPharmacy(pharmacyData: Partial<BackendPharmacy>): Promise<PharmacyDetails> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy>> = await apiClient.post(
        PHARMACY_ENDPOINTS.BASE,
        pharmacyData
      );

     

      return convertBackendPharmacy(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to create pharmacy');
    }
  }

  // Update pharmacy
  async updatePharmacy(id: string, pharmacyData: Partial<BackendPharmacy>): Promise<PharmacyDetails> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy>> = await apiClient.put(
        `${PHARMACY_ENDPOINTS.BASE}/${id}`,
        pharmacyData
      );


      return convertBackendPharmacy(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to update pharmacy');
    }
  }

  // Add review to pharmacy
  async addPharmacyReview(pharmacyId: string, review: PharmacyReview): Promise<void> {
    try {
      const response: AxiosResponse<APIResponse<any>> = await apiClient.post(
        PHARMACY_ENDPOINTS.REVIEWS(pharmacyId),
        review
      );

    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to add review');
    }
  }

  // Update pharmacy metrics (admin only)
  async updatePharmacyMetrics(pharmacyId: string, metrics: PharmacyMetrics): Promise<PharmacyDetails> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy>> = await apiClient.put(
        PHARMACY_ENDPOINTS.METRICS(pharmacyId),
        metrics
      );

      if (!response) {
        throw new Error(response.data.error || 'Failed to update pharmacy metrics');
      }

      return convertBackendPharmacy(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to update pharmacy metrics');
    }
  }

  // Update product statistics
  async updateProductStatistics(pharmacyId: string, stats: ProductStatistics): Promise<PharmacyDetails> {
    try {
      const response: AxiosResponse<APIResponse<BackendPharmacy>> = await apiClient.put(
        PHARMACY_ENDPOINTS.PRODUCT_STATS(pharmacyId),
        stats
      );

      if (!response) {
        throw new Error(response.data.error || 'Failed to update product statistics');
      }

      return convertBackendPharmacy(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to update product statistics');
    }
  }

  // Delete pharmacy
  async deletePharmacy(pharmacyId: string): Promise<void> {
    try {
      const response: AxiosResponse<APIResponse<any>> = await apiClient.delete(
        `${PHARMACY_ENDPOINTS.BASE}/${pharmacyId}`
      );

      if (!response) {
        throw new Error(response.data.error || 'Failed to delete pharmacy');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to delete pharmacy');
    }
  }

  // Legacy methods for compatibility (using mock data for features not in backend)

  // Update pharmacy status (mock implementation)
  updatePharmacyStatus(
    pharmacyId: string,
    status: PharmacyDetails['status'],
    reason?: string,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // This would need to be implemented in the backend
      console.log(`Mock: Updating pharmacy ${pharmacyId} status to ${status}, reason: ${reason}`);
      resolve(true);
    });
  }

  // Update commission rate (mock implementation)
  updateCommissionRate(pharmacyId: string, newRate: number): Promise<boolean> {
    return new Promise((resolve) => {
      // This would need to be implemented in the backend
      console.log(`Mock: Updating pharmacy ${pharmacyId} commission rate to ${newRate}%`);
      resolve(true);
    });
  }

  // Get commission payments (mock implementation)
  getCommissionPayments(): Promise<CommissionPayment[]> {
    return new Promise((resolve) => {
      // Mock data - this would need to be implemented in the backend
      resolve([
        {
          id: 'pay-001',
          pharmacyId: 'healthplus-ismailia',
          pharmacyName: 'HealthPlus Pharmacy',
          period: '2024-01',
          amount: 5478.5,
          commissionRate: 12,
          ordersCount: 234,
          totalRevenue: 45654.17,
          status: 'pending',
          dueDate: '2024-02-05T00:00:00Z',
          paymentMethod: 'Bank Transfer',
          notes: 'Monthly commission payment for January 2024',
        },
      ]);
    });
  }

  // Process commission payment (mock implementation)
  processCommissionPayment(
    paymentId: string,
    status: 'paid' | 'failed',
    transactionId?: string,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // This would need to be implemented in the backend
      console.log(`Mock: Processing payment ${paymentId} with status ${status}, txn: ${transactionId}`);
      resolve(true);
    });
  }

  // Calculate commission (mock implementation)
  calculateCommission(pharmacyId: string, orderValue: number): Promise<number> {
    return new Promise((resolve) => {
      // Mock calculation - this would need to be implemented in the backend
      const defaultRate = 10; // 10%
      resolve((orderValue * defaultRate) / 100);
    });
  }

  // Get available specialties
  getSpecialties() {
    return [
      {
        value: 'prescription',
        label: 'Prescription Medicines',
        labelAr: 'الأدوية بوصفة طبية',
      },
      { value: 'otc', label: 'Over-the-Counter', labelAr: 'أدوية بدون وصفة' },
      { value: 'supplements', label: 'Supplements', labelAr: 'المكملات الغذائية' },
      { value: 'vitamins', label: 'Vitamins', labelAr: 'الفيتامينات' },
      { value: 'skincare', label: 'Skincare', labelAr: 'العناية بالبشرة' },
      { value: 'medical', label: 'Medical Equipment', labelAr: 'المعدات الطبية' },
      { value: 'baby', label: 'Baby Care', labelAr: 'رعاية الأطفال' },
      { value: 'emergency', label: 'Emergency Medicines', labelAr: 'أدوية الطوارئ' },
    ];
  }

  // Get available features
  getFeatures() {
    return [
      { value: 'home_delivery', label: 'Home Delivery', labelAr: 'التوصيل المنزلي' },
      { value: 'consultation', label: 'Consultation', labelAr: 'الاستشارة' },
      {
        value: 'prescription_reading',
        label: 'Prescription Reading',
        labelAr: 'قراءة الوصفات',
      },
      { value: 'emergency', label: 'Emergency Service', labelAr: 'خدمة الطوارئ' },
      { value: '24_hours', label: '24 Hours Service', labelAr: 'خدمة 24 ساعة' },
      { value: 'baby_care', label: 'Baby Care', labelAr: 'رعاية الأطفال' },
      { value: 'nutrition_advice', label: 'Nutrition Advice', labelAr: 'نصائح التغذية' },
      {
        value: 'beauty_consultation',
        label: 'Beauty Consultation',
        labelAr: 'استشارة التجميل',
      },
    ];
  }

  // Get status options
  getStatusOptions() {
    return [
      { value: 'active', label: 'Active', labelAr: 'نشط', color: 'green' },
      {
        value: 'pending',
        label: 'Pending Approval',
        labelAr: 'في انتظار الموافقة',
        color: 'yellow',
      },
      { value: 'suspended', label: 'Suspended', labelAr: 'موقوف', color: 'orange' },
      { value: 'rejected', label: 'Rejected', labelAr: 'مرفوض', color: 'red' },
      { value: 'inactive', label: 'Inactive', labelAr: 'غير نشط', color: 'gray' },
    ];
  }

  // Utility method to set auth token
  setAuthToken(token: string): void {
    setAuthToken(token);
  }

  // Utility method to clear auth token
  clearAuthToken(): void {
    removeAuthToken();
  }

  // Batch operations
  async batchUpdatePharmacyStatus(
    pharmacyIds: string[],
    status: PharmacyDetails['status'],
    reason?: string
  ): Promise<{ success: string[]; failed: string[] }> {
    const results = { success: [], failed: [] };
    
    for (const id of pharmacyIds) {
      try {
        await this.updatePharmacyStatus(id, status, reason);
        results.success.push(id);
      } catch (error) {
        results.failed.push(id);
        console.error(`Failed to update pharmacy ${id}:`, error);
      }
    }
    
    return results;
  }

  // Advanced filtering method
  async getFilteredPharmacies(filters: PharmacyFilters): Promise<PharmacyDetails[]> {
    const params: PharmacyQueryParams = {
      cityId: filters.cityId,
      governorateId: filters.governorateId,
      specialty: filters.specialty,
      search: filters.search,
      isActive: filters.status !== 'inactive',
      isVerified: filters.status === 'active',
    };

    const result = await this.getPharmacies(params);
    let pharmacies = result.data;

    // Apply additional frontend filters
    if (filters.ratingRange) {
      pharmacies = pharmacies.filter(
        p => p.performance.rating >= filters.ratingRange!.min &&
             p.performance.rating <= filters.ratingRange!.max
      );
    }

    if (filters.feature) {
      pharmacies = pharmacies.filter(p => p.features.includes(filters.feature!));
    }

    return pharmacies;
  }

  // Export data methods
  exportPharmaciesCSV(pharmacies: PharmacyDetails[]): string {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'City',
      'Status',
      'Rating',
      'Total Orders',
      'Created At'
    ];

    const csvContent = [
      headers.join(','),
      ...pharmacies.map(p => [
        p.id,
        `"${p.name}"`,
        p.email,
        p.phone,
        `"${p.cityName}"`,
        p.status,
        p.performance.rating,
        p.performance.totalOrders,
        p.createdAt
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Analytics methods
  async getPharmacyAnalytics(pharmacyId: string, period: 'week' | 'month' | 'year' = 'month') {
    // This would typically call a backend analytics endpoint
    // For now, returning mock data based on pharmacy performance
    const pharmacy = await this.getPharmacyById(pharmacyId);
    
    return {
      pharmacyId,
      period,
      metrics: {
        totalOrders: pharmacy.performance.totalOrders,
        completedOrders: pharmacy.performance.completedOrders,
        cancelledOrders: pharmacy.performance.cancelledOrders,
        revenue: pharmacy.financials.monthlyRevenue,
        averageOrderValue: pharmacy.financials.monthlyRevenue / (pharmacy.performance.totalOrders || 1),
        customerSatisfaction: pharmacy.performance.rating,
        fulfillmentRate: pharmacy.performance.fulfillmentRate,
        responseTime: pharmacy.performance.responseTime
      },
      trends: {
        ordersGrowth: 15.2,
        revenueGrowth: 12.8,
        ratingChange: 0.3,
        newCustomers: 45
      },
      topProducts: [], // Would come from backend
      customerFeedback: [] // Would come from backend
    };
  }

  // Real-time updates (using WebSocket or polling)
  subscribeToPharmacyUpdates(
    pharmacyId: string, 
    callback: (pharmacy: PharmacyDetails) => void
  ): () => void {
    // Mock implementation - in real app, this would use WebSocket
    const interval = setInterval(async () => {
      try {
        const updatedPharmacy = await this.getPharmacyById(pharmacyId);
        callback(updatedPharmacy);
      } catch (error) {
        console.error('Error fetching pharmacy updates:', error);
      }
    }, 30000); // Poll every 30 seconds

    // Return unsubscribe function
    return () => clearInterval(interval);
  }

  // Validation helpers
  validatePharmacyData(pharmacyData: Partial<BackendPharmacy>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!pharmacyData.name?.trim()) {
      errors.push('Pharmacy name is required');
    }

    if (!pharmacyData.email?.trim() || !this.isValidEmail(pharmacyData.email)) {
      errors.push('Valid email is required');
    }

    if (!pharmacyData.phone?.trim()) {
      errors.push('Phone number is required');
    }

    if (!pharmacyData.address?.street?.trim()) {
      errors.push('Street address is required');
    }

    if (!pharmacyData.cityId?.trim()) {
      errors.push('City is required');
    }

    if (!pharmacyData.governorateId?.trim()) {
      errors.push('Governorate is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Cache management
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private setCacheItem(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getCacheItem(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // Enhanced getPharmacies with caching
  async getPharmaciesWithCache(params?: PharmacyQueryParams): Promise<{
    data: PharmacyDetails[];
    pagination: PaginationInfo;
  }> {
    const cacheKey = `pharmacies_${JSON.stringify(params || {})}`;
    const cached = this.getCacheItem(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await this.getPharmacies(params);
    this.setCacheItem(cacheKey, result);
    
    return result;
  }

  // Error handling wrapper
  private async handleApiCall<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      console.error(`${errorMessage}:`, error);
      
      // Log error for monitoring
      this.logError(errorMessage, error);
      
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        errorMessage
      );
    }
  }

  private logError(operation: string, error: any): void {
    // In production, this would send to monitoring service
    console.error('Pharmacy Service Error:', {
      operation,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  // Retry mechanism for failed requests
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; timestamp: string }> {
    try {
      await apiClient.get('/health');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const pharmacyManagementService = new PharmacyManagementService();

// Export utility functions
export const PharmacyUtils = {
  formatPharmacyAddress: (pharmacy: PharmacyDetails, language: 'en' | 'ar' = 'en'): string => {
    return language === 'ar' && pharmacy.addressAr 
      ? pharmacy.addressAr 
      : pharmacy.address;
  },

  formatPharmacyName: (pharmacy: PharmacyDetails, language: 'en' | 'ar' = 'en'): string => {
    return language === 'ar' && pharmacy.nameAr 
      ? pharmacy.nameAr 
      : pharmacy.name;
  },

  getStatusColor: (status: PharmacyDetails['status']): string => {
    const colors = {
      active: 'green',
      pending: 'yellow',
      suspended: 'orange',
      rejected: 'red',
      inactive: 'gray'
    };
    return colors[status] || 'gray';
  },

  calculateDistance: (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  },

  isPharmacyOpen: (pharmacy: PharmacyDetails): boolean => {
    const now = new Date();
    const dayName = now.toLocaleLowerCase().substring(0, 3) + 'day';
    const currentTime = now.toTimeString().substring(0, 5);
    
    const todayHours = pharmacy.workingHours[dayName as keyof typeof pharmacy.workingHours];
    
    if (!todayHours || todayHours.is24Hours) {
      return todayHours?.is24Hours || false;
    }
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  },

  formatRating: (rating: number): string => {
    return rating.toFixed(1);
  },

  formatCurrency: (amount: number, currency: string = 'EGP'): string => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
};

// Types for React hooks
export type UsePharmaciesParams = PharmacyQueryParams;

export type UsePharmaciesReturn = {
  data: PharmacyDetails[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  refetch: () => Promise<void>;
};

export type UsePharmacyReturn = {
  data: PharmacyDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Default export
export default pharmacyManagementService;
