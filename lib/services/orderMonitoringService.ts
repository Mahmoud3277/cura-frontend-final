'use client';

import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/cookies';

// Order Status Types
export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'out-for-delivery'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

// Order Interface (updated to match backend)
export interface Order {
    id:string;
    orders:{
        _id: string;
    orderNumber: string;
    customerId: string | {
        _id: string;
        name: string;
        phone: string;
        email: string;
    };
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    status: OrderStatus;
    priority: OrderPriority;
    totalAmount: number;
    subtotal: number;
    deliveryFee: number;
    taxAmount: number;
    discount?: number;
    paymentMethod: 'cash' | 'card' | 'wallet';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    items: OrderItem[];
    deliveryAddress: {
        street: string;
        city: string;
        governorate: string;
        phone: string;
        notes?: string;
    };
    pharmacyId?: string | {
        _id: string;
        businessName: string;
        phone: string;
    };
    pharmacyName?: string;
    vendorId?: string | {
        _id: string;
        vendorName: string;
        phone: string;
    };
    prescriptionId?: string;
    orderType: 'regular' | 'prescription' | 'urgent';
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
    createdAt: string;
    updatedAt: string;
    statusHistory: OrderStatusHistory[];
    notes?: string;
    deliveryInstructions?: string;
    cancelReason?: string;
    refundAmount?: number;
    isAssigned: boolean;
    assignedTo?: string;
    assignedAt?: string;
    acceptedAt?: string;
    cityId: string;
    governorateId: string;
    prescriptionRequired: boolean;
    cancelledBy?: string;
    }[];
    pagination:any
}

export interface OrderItem {
    _id?: string;
    productId: string | {
        _id: string;
        name: string;
        image: string;
        category: string;
        manufacturer: string;
    };
    medicineId?: string;
    productName: string;
    productNameAr: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    pharmacyId?: string;
    vendorId?: string;
    prescription: boolean;
    category: string;
    manufacturer: string;
    image: string;
    activeIngredient?: string;
}

export interface OrderStatusHistory {
    status: OrderStatus;
    timestamp: string;
    updatedBy: string;
    notes?: string;
}

// Order Analytics Interface
export interface OrderAnalytics {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    preparingOrders: number;
    readyOrders: number;
    outForDeliveryOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    averageDeliveryTime?: number;
    completedOrders: number;
    ordersByCity?: { city: string; count: number; revenue: number }[];
    ordersByPharmacy?: { pharmacy: string; count: number; revenue: number }[];
    ordersByTimeframe?: { date: string; orders: number; revenue: number }[];
    topProducts?: { productName: string; quantity: number; revenue: number }[];
    customerSatisfaction?: number;
    onTimeDeliveryRate?: number;
    statusBreakdown: Record<string, number>;
    paymentBreakdown: Record<string, { count: number; revenue: number }>;
}

// Order Filters Interface
export interface OrderFilters {
    status?: OrderStatus[];
    priority?: OrderPriority[];
    city?: string[];
    pharmacy?: string[];
    paymentStatus?: string[];
    paymentMethod?: string[];
    orderType?: string[];
    dateRange?: {
        start: string;
        end: string;
    };
    searchQuery?: string;
    prescriptionOnly?: boolean;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    limit?: number;
}

// API Response Interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    pagination?: {
        current: number;
        total: number;
        count: number;
        totalRecords: number;
    };
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Helper class
class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        // Get token from localStorage or your auth system
        if (typeof window !== 'undefined') {
            this.token = getAuthToken();
        }
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private buildUrl(endpoint: string, params?: Record<string, any>): string {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        // Handle array parameters
                        value.forEach(v => url.searchParams.append(key, v.toString()));
                    } else {
                        url.searchParams.append(key, value.toString());
                    }
                }
            });
        }

        return url.toString();
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        try {
            const url = this.buildUrl(endpoint, params);
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API GET error:', error);
            throw error;
        }
    }

    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API POST error:', error);
            throw error;
        }
    }

    async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API PUT error:', error);
            throw error;
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API DELETE error:', error);
            throw error;
        }
    }

    setAuthToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            setAuthToken(token);
        }
    }

    clearAuthToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            removeAuthToken();
        }
    }
}

// Order Monitoring Service
class OrderMonitoringService {
    private apiClient: ApiClient;
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    constructor() {
        this.apiClient = new ApiClient(API_BASE_URL);
    }

    // Cache management
    private getCachedData(key: string): any | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    private setCachedData(key: string, data: any): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    private clearCache(): void {
        this.cache.clear();
    }

    // Authentication
    setAuthToken(token: string): void {
        this.apiClient.setAuthToken(token);
        this.clearCache(); // Clear cache when auth changes
    }

    clearAuthToken(): void {
        this.apiClient.clearAuthToken();
        this.clearCache();
    }

    // Get all orders with optional filtering
    async getOrders(filters?: OrderFilters): Promise<{ orders: Order[]; pagination?: any }> {
        try {
            const cacheKey = `orders-${JSON.stringify(filters)}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            // Build query parameters
            const params: Record<string, any> = {};
            
            if (filters) {
                if (filters.status && filters.status.length > 0) {
                    params.status = filters.status;
                }
                if (filters.priority && filters.priority.length > 0) {
                    params.priority = filters.priority;
                }
                if (filters.paymentMethod && filters.paymentMethod.length > 0) {
                    params.paymentMethod = filters.paymentMethod[0]; // Backend expects single value
                }
                if (filters.paymentStatus && filters.paymentStatus.length > 0) {
                    params.paymentStatus = filters.paymentStatus[0]; // Backend expects single value
                }
                if (filters.orderType && filters.orderType.length > 0) {
                    params.orderType = filters.orderType[0]; // Backend expects single value
                }
                if (filters.dateRange) {
                    params.startDate = filters.dateRange.start;
                    params.endDate = filters.dateRange.end;
                }
                if (filters.page) {
                    params.page = filters.page;
                }
                if (filters.limit) {
                    params.limit = filters.limit;
                }
            }

            const response = await this.apiClient.get<Order[]>('/orders', params);
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch orders');
            }

            const result = {
                orders: response.data,
                pagination: response.pagination
            };

            this.setCachedData(cacheKey, result);
            return result;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    // Get orders by pharmacy
    async getPharmacyOrders(pharmacyId: string, filters?: OrderFilters): Promise<{ orders: Order[]; pagination?: any }> {
        try {
            const params: Record<string, any> = {
                assignedTo: pharmacyId
            };

            if (filters) {
                Object.assign(params, {
                    status: filters.status,
                    priority: filters.priority,
                    paymentMethod: filters.paymentMethod?.[0],
                    paymentStatus: filters.paymentStatus?.[0],
                    orderType: filters.orderType?.[0],
                    page: filters.page,
                    limit: filters.limit
                });

                if (filters.dateRange) {
                    params.startDate = filters.dateRange.start;
                    params.endDate = filters.dateRange.end;
                }
            }

            const response = await this.apiClient.get<Order[]>('/orders/pharmacy', params);
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch pharmacy orders');
            }

            return {
                orders: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error fetching pharmacy orders:', error);
            throw error;
        }
    }

    // Get orders by vendor
    async getVendorOrders(vendorId: string, filters?: OrderFilters): Promise<{ orders: Order[]; pagination?: any }> {
        try {
            const params: Record<string, any> = {
                assignedTo: vendorId
            };

            if (filters) {
                Object.assign(params, {
                    status: filters.status,
                    priority: filters.priority,
                    paymentMethod: filters.paymentMethod?.[0],
                    paymentStatus: filters.paymentStatus?.[0],
                    orderType: filters.orderType?.[0],
                    page: filters.page,
                    limit: filters.limit
                });

                if (filters.dateRange) {
                    params.startDate = filters.dateRange.start;
                    params.endDate = filters.dateRange.end;
                }
            }

            const response = await this.apiClient.get<Order[]>('/orders/vendor', params);
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch vendor orders');
            }

            return {
                orders: response.data,
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Error fetching vendor orders:', error);
            throw error;
        }
    }

    // Get order by ID
    async getOrderById(id: string): Promise<Order> {
        try {
            const cacheKey = `order-${id}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            const response = await this.apiClient.get<Order>(`/orders/${id}`);
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch order');
            }

            this.setCachedData(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            throw error;
        }
    }

    // Get pending unassigned orders
    async getPendingUnassignedOrders(): Promise<Order[]> {
        try {
            const response = await this.apiClient.get<Order[]>('/orders/pending/unassigned');
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch pending orders');
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching pending orders:', error);
            throw error;
        }
    }

    // Create new order
    async createOrder(orderData: any): Promise<Order> {
        try {
            const response = await this.apiClient.post<Order>('/orders', orderData);
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to create order');
            }

            this.clearCache(); // Clear cache after creating new order
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Update order status
    async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<Order> {
        try {
            const response = await this.apiClient.put<Order>(`/orders/${orderId}/status`, {
                status,
                notes
            });
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to update order status');
            }

            this.clearCache(); // Clear cache after status update
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    // Assign order to pharmacy/vendor
    async assignOrder(orderId: string, assigneeData: { 
        assigneeId?: string; 
        assigneeName?: string; 
        assigneeType?: 'pharmacy' | 'vendor' 
    }): Promise<Order> {
        try {
            const response = await this.apiClient.put<Order>(`/orders/${orderId}/assign`, assigneeData);
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to assign order');
            }

            this.clearCache();
            return response.data;
        } catch (error) {
            console.error('Error assigning order:', error);
            throw error;
        }
    }

    // Update order items
    async updateOrderItems(orderId: string, items: OrderItem[]): Promise<Order> {
        try {
            const response = await this.apiClient.put<Order>(`/orders/${orderId}/items`, { items });
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to update order items');
            }

            this.clearCache();
            return response.data;
        } catch (error) {
            console.error('Error updating order items:', error);
            throw error;
        }
    }

    // Cancel order
    async cancelOrder(orderId: string, reason: string): Promise<Order> {
        try {
            const response = await this.apiClient.put<Order>(`/orders/${orderId}/cancel`, { reason });
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to cancel order');
            }

            this.clearCache();
            return response.data;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    }

    // Get order analytics
    async getOrderAnalytics(filters?: OrderFilters): Promise<OrderAnalytics> {
        try {
            const cacheKey = `analytics-${JSON.stringify(filters)}`;
            const cached = this.getCachedData(cacheKey);
            if (cached) {
                return cached;
            }

            // For now, we'll use the summary endpoint and extend it
            const response = await this.apiClient.get<any>('/orders/analytics/summary');
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch analytics');
            }

            const { summary, statusBreakdown, paymentBreakdown } = response.data;

            const analytics: OrderAnalytics = {
                totalOrders: summary.totalOrders || 0,
                pendingOrders: summary.pendingOrders || 0,
                confirmedOrders: statusBreakdown.confirmed || 0,
                preparingOrders: statusBreakdown.preparing || 0,
                readyOrders: statusBreakdown.ready || 0,
                outForDeliveryOrders: statusBreakdown['out-for-delivery'] || 0,
                deliveredOrders: summary.completedOrders || 0,
                cancelledOrders: summary.cancelledOrders || 0,
                totalRevenue: summary.totalRevenue || 0,
                averageOrderValue: summary.averageOrderValue || 0,
                completedOrders: summary.completedOrders || 0,
                statusBreakdown,
                paymentBreakdown,
                customerSatisfaction: 4.2 + Math.random() * 0.6, // Mock for now
                onTimeDeliveryRate: 85 + Math.random() * 10 // Mock for now
            };

            this.setCachedData(cacheKey, analytics);
            return analytics;
        } catch (error) {
            console.error('Error fetching order analytics:', error);
            throw error;
        }
    }

    // Get real-time order updates (simulated)
    getRealtimeUpdates(): { newOrders: number; statusUpdates: number; urgentOrders: number } {
        // This would be implemented with websockets or polling in a real application
        return {
            newOrders: Math.floor(Math.random() * 5),
            statusUpdates: Math.floor(Math.random() * 10),
            urgentOrders: Math.floor(Math.random() * 3)
        };
    }

    // Get order status distribution for charts
    async getStatusDistribution(): Promise<{ status: string; count: number; percentage: number }[]> {
        try {
            const analytics = await this.getOrderAnalytics();
            const total = analytics.totalOrders;

            if (total === 0) {
                return [];
            }

            return Object.entries(analytics.statusBreakdown).map(([status, count]) => ({
                status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
                count,
                percentage: (count / total) * 100
            }));
        } catch (error) {
            console.error('Error getting status distribution:', error);
            return [];
        }
    }

    // Delete order (admin only)
    async deleteOrder(orderId: string): Promise<boolean> {
        try {
            const response = await this.apiClient.delete(`/orders/${orderId}`);
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete order');
            }

            this.clearCache();
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const orderMonitoringService = new OrderMonitoringService();
