'use client';

import { getAuthToken } from "../utils/cookies";

// Add PharmacyOrder interface that matches frontend expectations
export interface PharmacyOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: OrderStatus;
  priority: OrderPriority;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  taxAmount?: number;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  pharmacyId?: string;
  pharmacyName?: string;
  vendorId?: string;
  vendorName?: string;
  assignedTo?: string;
  isAssigned: boolean;
  assignedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  orderType: 'pharmacy' | 'vendor' | 'regular';
  cityId: string;
  cityName: string;
  governorateId: string;
  governorateName: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  notes?: string;
  cancelReason?: string;
  refundAmount?: number;
  prescriptionId?: string;
  prescriptionRequired?: boolean;
  prescriptionVerified?: boolean;
  requiresPrescription?: boolean; // Add this computed field
}

// Enhanced Order interface with proper typing
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: OrderStatus;
  priority: OrderPriority;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  taxAmount?: number;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  providerId?: string;
  providerName?: string;
  assignedTo?: string;
  isAssigned: boolean;
  assignedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  orderType: 'pharmacy' | 'vendor' | 'regular';
  cityId: string;
  cityName: string;
  governorateId: string;
  governorateName: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  notes?: string;
  cancelReason?: string;
  refundAmount?: number;
  prescriptionId?: string;
  prescriptionRequired?: boolean;
  prescriptionVerified?: boolean;
}

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

export interface OrderItem {
  id: string;
  productId: string | number;
  productName: string;
  productNameAr?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  providerId?: string;
  prescription: boolean;
  category?: string;
  manufacturer?: string;
  image?: string;
  activeIngredient?: string;
}

export interface DeliveryAddress {
  street: string;
  area?: string;
  city: string;
  governorate: string;
  phone: string;
  notes?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  updatedByName?: string;
  userRole?: string;
  notes?: string;
}

// Enhanced filters for orders
export interface OrderFilters {
  status?: OrderStatus | OrderStatus[];
  priority?: OrderPriority | OrderPriority[];
  paymentStatus?: string;
  orderType?: 'pharmacy' | 'vendor';
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  prescriptionOnly?: boolean;
  isAssigned?: boolean;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

// Order statistics interface
export interface OrderStats {
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  'out-for-delivery': number;
  delivered: number;
  cancelled: number;
  total: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
}

// API Response interfaces
export interface PaginatedOrdersResponse {
  success: boolean;
  data: PharmacyOrder[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface SingleOrderResponse {
  success: boolean;
  data: PharmacyOrder;
}

export interface OrderStatsResponse {
  success: boolean;
  data: OrderStats;
}

// Enhanced Pharmacy/Vendor Order Service
class EnhancedProviderOrderService {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders`;
  private token: string | null = null;
  private listeners: Map<string, (orders: PharmacyOrder[]) => void> = new Map();

  constructor() {
    // Get token from localStorage or other auth method
    if (typeof window !== 'undefined') {
      this.token = getAuthToken() || null;
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

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  }

  // Transform backend order to frontend format
  private transformOrder(order: any): PharmacyOrder {
    return {
      ...order,
      id: order._id || order.id,
      pharmacyId: order.pharmacyId,
      vendorId: order.vendorId,
      requiresPrescription: order.prescriptionRequired || this.checkIfRequiresPrescription(order),
      prescriptionRequired: order.prescriptionRequired,
      prescriptionVerified: order.prescriptionVerified,
      cityName: order.cityId,
      governorateName: order.governorateId,
    };
  }

  private checkIfRequiresPrescription(order: any): boolean {
    return order.items?.some((item: any) => item.prescription === true) || false;
  }

  // Get all orders with filters
  async getAllOrders(filters?: OrderFilters, pharmacyId?: string): Promise<PaginatedOrdersResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          filters.status.forEach(s => params.append('status', s));
        } else {
          params.append('status', filters.status);
        }
      }
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          filters.priority.forEach(p => params.append('priority', p));
        } else {
          params.append('priority', filters.priority);
        }
      }
      if (pharmacyId) {
        params.append('assignedTo', pharmacyId);
      }
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.orderType) params.append('orderType', filters.orderType);
      if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start);
      if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    } else if (pharmacyId) {
      params.append('assignedTo', pharmacyId);
    }

    const queryString = params.toString();
    const endpoint = `/pharmacy${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.makeRequest<any>(endpoint);
    console.log('response: ', response)
    return {
      ...response,
      data: response.data
    };
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<SingleOrderResponse> {
    const response = await this.makeRequest<any>(`/${orderId}`);
    return {
      ...response,
      data: this.transformOrder(response.data)
    };
  }

  // Get order statistics - fixed to return proper format
  getOrderStats(pharmacyId?: string): OrderStats {
    // Return mock stats for now, you can implement real stats later
    return {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      'out-for-delivery': 0,
      delivered: 0,
      cancelled: 0,
      total: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      pendingOrders: 0
    };
  }

  // Update order status
  async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    notes?: string
  ): Promise<SingleOrderResponse> {
    const response = await this.makeRequest<any>(`/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
    
    return {
      ...response,
      data: this.transformOrder(response.data)
    };
  }

  // Accept order (pharmacy/vendor)
  async acceptOrder(
    orderId: string, 
    estimatedPreparationTime?: number, 
    notes?: string
  ): Promise<SingleOrderResponse> {
    // First assign the order, then confirm it
    try {
      await this.assignOrder(orderId);
      return await this.updateOrderStatus(orderId, 'confirmed', notes);
    } catch (error) {
      throw new Error(`Failed to accept order: ${error.message}`);
    }
  }

  // Assign order to pharmacy/vendor
  async assignOrder(
    orderId: string, 
    assigneeId?: string, 
    assigneeName?: string
  ): Promise<SingleOrderResponse> {
    const body: any = {};
    if (assigneeId) body.assigneeId = assigneeId;
    if (assigneeName) body.assigneeName = assigneeName;
    
    const response = await this.makeRequest<any>(`/${orderId}/assign`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    
    return {
      ...response,
      data: this.transformOrder(response.data)
    };
  }

  // Reject order
  async rejectOrder(orderId: string, reason: string): Promise<SingleOrderResponse> {
    const response = await this.makeRequest<any>(`/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    
    return {
      ...response,
      data: this.transformOrder(response.data)
    };
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<SingleOrderResponse> {
    const response = await this.makeRequest<any>(`/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    
    return {
      ...response,
      data: this.transformOrder(response.data)
    };
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    // Token is now stored in cookies via cookie utils, not localStorage
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    // Token clearing is handled by cookie utils, not localStorage
  }

  // Subscribe to real-time order updates
  subscribe(callback: (orders: PharmacyOrder[]) => void): () => void {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.set(id, callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }

  // Notify listeners of order updates
  private notifyListeners(orders: PharmacyOrder[]): void {
    this.listeners.forEach((callback) => {
      callback([...orders]);
    });
  }

  // Helper methods for order validation and business logic

  // Check if order can be accepted - FIXED
  canAcceptOrder(order: PharmacyOrder): boolean {
    if (order.status !== 'pending') {
      return false;
    }
    
    // If order requires prescription verification, check if it's verified
    if (this.requiresPrescription(order)) {
      return order.prescriptionRequired && order.prescriptionVerified === true;
    }
    
    // For non-prescription orders, can accept if pending
    return true;
  }

  // Check if order can be cancelled
  canCancelOrder(order: PharmacyOrder): boolean {
    return ['pending', 'confirmed', 'preparing'].includes(order.status);
  }

  // Check if order requires prescription - FIXED
  requiresPrescription(order: PharmacyOrder): boolean {
    return order.requiresPrescription || false
  }

  // Get order status badge color
  getStatusColor(status: OrderStatus): string {
    const colors = {
      pending: 'yellow',
      confirmed: 'blue',
      preparing: 'orange',
      ready: 'purple',
      'out-for-delivery': 'indigo',
      delivered: 'green',
      cancelled: 'red',
      refunded: 'gray',
    };
    return colors[status] || 'gray';
  }

  // Get priority badge color
  getPriorityColor(priority: OrderPriority): string {
    const colors = {
      low: 'gray',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority] || 'gray';
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  }

  // Get order progress percentage
  getOrderProgress(status: OrderStatus): number {
    const progressMap = {
      pending: 10,
      confirmed: 25,
      preparing: 50,
      ready: 70,
      'out-for-delivery': 90,
      delivered: 100,
      cancelled: 0,
      refunded: 0,
    };
    return progressMap[status] || 0;
  }

  // Filter orders by status
  filterOrdersByStatus(orders: PharmacyOrder[], statuses: OrderStatus[]): PharmacyOrder[] {
    return orders.filter(order => statuses.includes(order.status));
  }

  // Filter orders by priority
  filterOrdersByPriority(orders: PharmacyOrder[], priorities: OrderPriority[]): PharmacyOrder[] {
    return orders.filter(order => priorities.includes(order.priority));
  }

  // Search orders
  searchOrders(orders: PharmacyOrder[], query: string): PharmacyOrder[] {
    if (!query.trim()) return orders;
    
    const searchTerm = query.toLowerCase();
    return orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.customerPhone.includes(searchTerm) ||
      order.customerEmail?.toLowerCase().includes(searchTerm)
    );
  }

  // Sort orders
  sortOrders(orders: PharmacyOrder[], field: keyof PharmacyOrder, direction: 'asc' | 'desc' = 'desc'): PharmacyOrder[] {
    return [...orders].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Group orders by status
  groupOrdersByStatus(orders: PharmacyOrder[]): Record<OrderStatus, PharmacyOrder[]> {
    return orders.reduce((groups, order) => {
      if (!groups[order.status]) {
        groups[order.status] = [];
      }
      groups[order.status].push(order);
      return groups;
    }, {} as Record<OrderStatus, PharmacyOrder[]>);
  }

  // Calculate order metrics
  calculateOrderMetrics(orders: PharmacyOrder[]): {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    completionRate: number;
    cancellationRate: number;
  } {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    return {
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      cancellationRate: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,
    };
  }
}

// Export singleton instance
export const providerOrderService = new EnhancedProviderOrderService();

// Initialize token if available
const token = getAuthToken()
if(token){
  providerOrderService.setToken(token)
}
else{
  console.log("No token found")
}

// Export the service class for custom instances
export { EnhancedProviderOrderService };