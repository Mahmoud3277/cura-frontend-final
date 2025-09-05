'use client';

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
  assignedTo?: string; // The pharmacy or vendor ID this order is assigned to
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

// Vendor interfaces
export interface Vendor {
  _id: string;
  vendorName: string;
  vendorNameAr?: string;
  vendorCode: string;
  vendorType: 'pharmacy' | 'vendor';
  phone: string;
  email: string;
  address: VendorAddress;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  products: VendorProduct[];
  owner?: string;
  createdAt: string;
  updatedAt: string;
  performanceMetrics?: PerformanceMetrics;
  onTimeDeliveryRate?: number;
}

export interface VendorAddress {
  street: string;
  area?: string;
  cityId: string;
  cityName: string;
  governorateId: string;
  governorateName: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface VendorProduct {
  _id: string;
  productName: string;
  productNameAr?: string;
  category: string;
  manufacturer?: string;
  activeIngredient?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  quantity: number;
  isActive: boolean;
  prescription: boolean;
  deliveryTime?: string;
  deliveryFee?: number;
  minimumOrderQuantity?: number;
  bulkPricing?: BulkPricing[];
  specialOffers?: SpecialOffer[];
  lastUpdated: string;
}

export interface BulkPricing {
  minQuantity: number;
  price: number;
  discount?: number;
}

export interface SpecialOffer {
  type: 'discount' | 'buy_get' | 'free_shipping';
  value: number;
  description: string;
  validUntil?: string;
}

export interface PerformanceMetrics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageRating: number;
  responseTime: number;
  onTimeDeliveries: number;
  totalDeliveries: number;
}

// Enhanced filters for orders and vendors
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

export interface VendorFilters {
  vendorType?: 'pharmacy' | 'vendor';
  cityId?: string;
  governorateId?: string;
  isActive?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

// Order statistics interface
export interface OrderStats {
  total: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
  };
  today: {
    todayOrders: number;
    todayRevenue: number;
  };
  completionRate: number;
  cancellationRate: number;
  statusBreakdown: Record<string, { count: number; revenue: number }>;
}

export interface VendorStats {
  totalVendors: number;
  activeVendors: number;
  averageRating: number;
  totalProducts: number;
  byType: Record<string, number>;
  byCity: Record<string, number>;
}

// API Response interfaces
export interface PaginatedOrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface PaginatedVendorsResponse {
  success: boolean;
  data: Vendor[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface SingleOrderResponse {
  success: boolean;
  data: Order;
}

export interface SingleVendorResponse {
  success: boolean;
  data: Vendor;
}

export interface OrderStatsResponse {
  success: boolean;
  data: OrderStats;
}

export interface VendorStatsResponse {
  success: boolean;
  data: VendorStats;
}

export interface VendorProductResponse {
  success: boolean;
  data: VendorProduct;
}

export interface VendorsByProductResponse {
  success: boolean;
  data: Array<{
    vendorId: string;
    vendorName: string;
    vendorNameAr?: string;
    vendorType: 'pharmacy' | 'vendor';
    cityId: string;
    cityName: string;
    governorateId: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    deliveryTime?: string;
    deliveryFee?: number;
    minimumOrderQuantity?: number;
    bulkPricing?: BulkPricing[];
    rating: number;
    reviewCount: number;
    specialOffers?: SpecialOffer[];
  }>;
}

// Enhanced Pharmacy/Vendor Order Service
class EnhancedProviderOrderService {
  private baseUrl = 'http://localhost:5000/api';
  private ordersUrl = `${this.baseUrl}/orders`;
  private vendorsUrl = `${this.baseUrl}/vendors`;
  private token: string | null = null;
  private listeners: Map<string, (orders: Order[]) => void> = new Map();

  constructor() {
    // Get token from cookies
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
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response) {
      throw new Error(`Request failed: ${response.statusText}`);
    }
    
    return await response.json();
  }

  // ===================
  // ORDER METHODS
  // ===================

  // Get all orders with filters
  async getAllOrders(filters?: OrderFilters, id?: string): Promise<PaginatedOrdersResponse> {
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
      if (id) params.append('assignedTo', id);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.orderType) params.append('orderType', filters.orderType);
      if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start);
      if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = `${this.ordersUrl}/vendor${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest<PaginatedOrdersResponse>(endpoint);
  }

  // Get vendor orders
  async getVendorOrders(
    vendorId?: string, 
    filters?: OrderFilters
  ): Promise<PaginatedOrdersResponse> {
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
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start);
      if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end);
      if (filters.isAssigned !== undefined) params.append('isAssigned', filters.isAssigned.toString());
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const vendorPath = vendorId ? `/vendor/${vendorId}` : '/vendor';
    const endpoint = `${this.ordersUrl}${vendorPath}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<PaginatedOrdersResponse>(endpoint);
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<SingleOrderResponse> {
    return this.makeRequest<SingleOrderResponse>(`${this.ordersUrl}/${orderId}`);
  }

  // Get pending/unassigned orders
  async getPendingOrders(orderType?: 'pharmacy' | 'vendor'): Promise<{ success: boolean; data: Order[] }> {
    const params = new URLSearchParams();
    if (orderType) params.append('orderType', orderType);
    
    const queryString = params.toString();
    const endpoint = `${this.ordersUrl}/pending/unassigned${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<{ success: boolean; data: Order[] }>(endpoint);
  }

  // Get order statistics
  async getOrderStats(
    providerId?: string, 
    orderType?: 'pharmacy' | 'vendor'
  ): Promise<OrderStatsResponse> {
    const params = new URLSearchParams();
    if (providerId) params.append('providerId', providerId);
    if (orderType) params.append('orderType', orderType);
    
    const queryString = params.toString();
    const endpoint = `${this.ordersUrl}/analytics/stats${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<OrderStatsResponse>(endpoint);
  }

  // Update order status
  async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    notes?: string
  ): Promise<SingleOrderResponse> {
    return this.makeRequest<SingleOrderResponse>(`${this.ordersUrl}/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
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
    
    return this.makeRequest<SingleOrderResponse>(`${this.ordersUrl}/${orderId}/assign`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // Accept order (pharmacy/vendor)
  async acceptOrder(
    orderId: string, 
    estimatedPreparationTime?: number, 
    notes?: string
  ): Promise<SingleOrderResponse> {
    return this.updateOrderStatus(orderId, 'confirmed', notes);
  }

  // Reject order
  async rejectOrder(orderId: string, reason: string): Promise<SingleOrderResponse> {
    return this.makeRequest<SingleOrderResponse>(`${this.ordersUrl}/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<SingleOrderResponse> {
    return this.makeRequest<SingleOrderResponse>(`${this.ordersUrl}/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Update order items (for pharmacy/vendor before preparing)
  async updateOrderItems(
    orderId: string, 
    items: OrderItem[]
  ): Promise<SingleOrderResponse> {
    return this.makeRequest<SingleOrderResponse>(`${this.ordersUrl}/${orderId}/items`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  // ===================
  // VENDOR METHODS
  // ===================

  // Get all vendors (unified method that handles all vendor queries)
  async getAllVendors(
    options?: {
      // Basic filters
      vendorType?: 'pharmacy' | 'vendor';
      cityId?: string;
      governorateId?: string;
      isActive?: boolean;
      isVerified?: boolean;
      search?: string;
      
      // Specific queries
      productName?: string; // Get vendors selling this product
      bestPrice?: boolean; // Get best price vendor (requires productName)
      
      // Pagination
      page?: number;
      limit?: number;
      
      // Special modes
      activeProductsOnly?: boolean; // Only vendors with active products
      inStockOnly?: boolean; // Only vendors with products in stock
      minRating?: number; // Minimum rating filter
      status:string;
      // Location-based recommendations
      userLocation?: { cityId: string; governorateId: string };
      recommendations?: boolean; // Get recommended vendors (requires productName)
    }
  ): Promise<PaginatedVendorsResponse | VendorsByProductResponse | { success: boolean; data: any }> {
    
    // Handle special cases first
    
    // Best price vendor query
    if (options?.bestPrice && options?.productName) {
      return this.getBestPriceVendor(options.productName, options.cityId);
    }
    
    // Vendors by product query
    if (options?.productName && !options?.recommendations) {
      return this.getVendorsByProduct(options.productName, options.cityId);
    }
    
    // Vendors by city query (legacy support)
    if (options?.cityId && !options?.productName && !options?.vendorType && !options?.search) {
      return this.getVendorsByCity(options.cityId);
    }
    
    // Vendors by type query (legacy support)
    if (options?.vendorType && !options?.productName && !options?.cityId && !options?.search) {
      return this.getVendorsByType(options.vendorType);
    }
    
    // Default: Get all vendors with comprehensive filtering
    const params = new URLSearchParams();
    
    if (options) {
      // Basic filters
      if (options.vendorType) params.append('vendorType', options.vendorType);
      if (options.cityId) params.append('cityId', options.cityId);
      if (options.governorateId) params.append('governorateId', options.governorateId);
      if (options.isActive !== undefined) params.append('isActive', options.isActive.toString());
      if (options.isVerified !== undefined) params.append('isVerified', options.isVerified.toString());
      if (options.search) params.append('search', options.search);
      
      // Pagination
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = `${this.vendorsUrl}${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await this.makeRequest<PaginatedVendorsResponse>(endpoint);
      // Apply client-side filters for advanced options
      if (options && response.data) {
        let filteredVendors = [...response.data];
        
        // Filter by minimum rating
        if (options.minRating !== undefined) {
          filteredVendors = this.filterVendorsByRating(filteredVendors, options.minRating);
        }
        
        // Filter vendors with active products only
        if (options.activeProductsOnly) {
          filteredVendors = filteredVendors.filter(vendor =>
            vendor.products.some(product => product.isActive)
          );
        }
        
        // Filter vendors with products in stock
        if (options.inStockOnly) {
          filteredVendors = this.getVendorsWithStock(filteredVendors);
        }
        
        // Get recommendations for a product
        if (options.recommendations && options.productName) {
          filteredVendors = this.getRecommendedVendors(
            filteredVendors, 
            options.productName, 
            options.userLocation
          );
        }
        
        // Update response with filtered data
        response.data = filteredVendors;
        response.pagination.count = filteredVendors.length;
      }
      console.log(response)
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch vendors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get vendor by ID
  async getVendorById(vendorId: string): Promise<SingleVendorResponse> {
    return this.makeRequest<SingleVendorResponse>(`${this.vendorsUrl}/${vendorId}`);
  }

  // Get vendors by product
  async getVendorsByProduct(productName: string, cityId?: string): Promise<VendorsByProductResponse> {
    const params = new URLSearchParams();
    if (cityId) params.append('cityId', cityId);
    
    const queryString = params.toString();
    const endpoint = `${this.vendorsUrl}/product/${encodeURIComponent(productName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<VendorsByProductResponse>(endpoint);
  }

  // Get vendors by city
  async getVendorsByCity(cityId: string): Promise<{ success: boolean; data: Vendor[] }> {
    return this.makeRequest<{ success: boolean; data: Vendor[] }>(`${this.vendorsUrl}/city/${cityId}`);
  }

  // Get vendors by type
  async getVendorsByType(vendorType: 'pharmacy' | 'vendor'): Promise<{ success: boolean; data: Vendor[] }> {
    return this.makeRequest<{ success: boolean; data: Vendor[] }>(`${this.vendorsUrl}/type/${vendorType}`);
  }

  // Get best price vendor for a product
  async getBestPriceVendor(productName: string, cityId?: string): Promise<{ success: boolean; data: any }> {
    const params = new URLSearchParams();
    if (cityId) params.append('cityId', cityId);
    
    const queryString = params.toString();
    const endpoint = `${this.vendorsUrl}/best-price/${encodeURIComponent(productName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<{ success: boolean; data: any }>(endpoint);
  }

  // Get vendor statistics
  async getVendorStats(): Promise<VendorStatsResponse> {
    return this.makeRequest<VendorStatsResponse>(`${this.vendorsUrl}/stats/summary`);
  }

  // Create vendor (admin only)
  async createVendor(vendorData: Partial<Vendor>): Promise<SingleVendorResponse> {
    return this.makeRequest<SingleVendorResponse>(this.vendorsUrl, {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  }

  // Update vendor (vendor owner or admin)
  async updateVendor(vendorId: string, vendorData: Partial<Vendor>): Promise<SingleVendorResponse> {
    return this.makeRequest<SingleVendorResponse>(`${this.vendorsUrl}/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  }

  // Delete vendor (admin only)
  async deleteVendor(vendorId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(`${this.vendorsUrl}/${vendorId}`, {
      method: 'DELETE',
    });
  }

  // Add product to vendor
  async addProductToVendor(vendorId: string, productData: Partial<VendorProduct>): Promise<VendorProductResponse> {
    return this.makeRequest<VendorProductResponse>(`${this.vendorsUrl}/${vendorId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Update vendor product
  async updateVendorProduct(
    vendorId: string, 
    productId: string, 
    productData: Partial<VendorProduct>
  ): Promise<VendorProductResponse> {
    return this.makeRequest<VendorProductResponse>(`${this.vendorsUrl}/${vendorId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Update product stock
  async updateProductStock(
    vendorId: string, 
    productId: string, 
    newQuantity: number
  ): Promise<VendorProductResponse> {
    return this.makeRequest<VendorProductResponse>(`${this.vendorsUrl}/${vendorId}/products/${productId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ newQuantity }),
    });
  }

  // Remove product from vendor
  async removeProductFromVendor(
    vendorId: string, 
    productId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(`${this.vendorsUrl}/${vendorId}/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Get vendor's active products
  async getVendorActiveProducts(vendorId: string): Promise<{ success: boolean; data: VendorProduct[] }> {
    return this.makeRequest<{ success: boolean; data: VendorProduct[] }>(`${this.vendorsUrl}/${vendorId}/products/active`);
  }

  // Update vendor performance metrics (admin only)
  async updateVendorMetrics(
    vendorId: string, 
    metrics: Partial<PerformanceMetrics>
  ): Promise<SingleVendorResponse> {
    return this.makeRequest<SingleVendorResponse>(`${this.vendorsUrl}/${vendorId}/metrics`, {
      method: 'PUT',
      body: JSON.stringify(metrics),
    });
  }

  // ===================
  // AUTHENTICATION METHODS
  // ===================

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      setAuthToken(token);
    }
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      removeAuthToken();
    }
  }

  // ===================
  // SUBSCRIPTION METHODS
  // ===================

  // Subscribe to real-time order updates
  subscribe(callback: (orders: Order[]) => void): () => void {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.set(id, callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }

  // Notify listeners of order updates
  private notifyListeners(orders: Order[]): void {
    this.listeners.forEach((callback) => {
      callback([...orders]);
    });
  }

  // ===================
  // UTILITY METHODS
  // ===================

  // Check if order can be accepted
  canAcceptOrder(order: Order): boolean {
    return order.status === 'pending' && order.isAssigned;
  }

  // Check if order can be cancelled
  canCancelOrder(order: Order): boolean {
    return ['pending', 'confirmed', 'preparing'].includes(order.status);
  }

  // Check if order requires prescription
  requiresPrescription(order: Order): boolean {
    return order.items.some(item => item.prescription) || !!order.prescriptionId;
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
  filterOrdersByStatus(orders: Order[], statuses: OrderStatus[]): Order[] {
    return orders.filter(order => statuses.includes(order.status));
  }

  // Filter orders by priority
  filterOrdersByPriority(orders: Order[], priorities: OrderPriority[]): Order[] {
    return orders.filter(order => priorities.includes(order.priority));
  }

  // Search orders
  searchOrders(orders: Order[], query: string): Order[] {
    if (!query.trim()) return orders;
    
    const searchTerm = query.toLowerCase();
    return orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.customerPhone.includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchTerm)
    );
  }

  // Search vendors
  searchVendors(vendors: Vendor[], query: string): Vendor[] {
    if (!query.trim()) return vendors;
    
    const searchTerm = query.toLowerCase();
    return vendors.filter(vendor =>
      vendor.vendorName.toLowerCase().includes(searchTerm) ||
      vendor.vendorNameAr?.toLowerCase().includes(searchTerm) ||
      vendor.vendorCode.toLowerCase().includes(searchTerm) ||
      vendor.phone.includes(searchTerm) ||
      vendor.email.toLowerCase().includes(searchTerm)
    );
  }

  // Sort orders
  sortOrders(orders: Order[], field: keyof Order, direction: 'asc' | 'desc' = 'desc'): Order[] {
    return [...orders].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Sort vendors
  sortVendors(vendors: Vendor[], field: keyof Vendor, direction: 'asc' | 'desc' = 'desc'): Vendor[] {
    return [...vendors].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Group orders by status
  groupOrdersByStatus(orders: Order[]): Record<OrderStatus, Order[]> {
    return orders.reduce((groups, order) => {
      if (!groups[order.status]) {
        groups[order.status] = [];
      }
      groups[order.status].push(order);
      return groups;
    }, {} as Record<OrderStatus, Order[]>);
  }

  // Group vendors by type
  groupVendorsByType(vendors: Vendor[]): Record<string, Vendor[]> {
    return vendors.reduce((groups, vendor) => {
      if (!groups[vendor.vendorType]) {
        groups[vendor.vendorType] = [];
      }
      groups[vendor.vendorType].push(vendor);
      return groups;
    }, {} as Record<string, Vendor[]>);
  }

  // Calculate order metrics
  calculateOrderMetrics(orders: Order[]): {
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

  // Calculate vendor metrics
  calculateVendorMetrics(vendors: Vendor[]): {
    totalVendors: number;
    activeVendors: number;
    verifiedVendors: number;
    averageRating: number;
    totalProducts: number;
    pharmacyCount: number;
    vendorCount: number;
  } {
    const totalVendors = vendors.length;
    const activeVendors = vendors.filter(v => v.isActive).length;
    const verifiedVendors = vendors.filter(v => v.isVerified).length;
    const totalRating = vendors.reduce((sum, v) => sum + (v.rating || 0), 0);
    const totalProducts = vendors.reduce((sum, v) => sum + v.products.length, 0);
    const pharmacyCount = vendors.filter(v => v.vendorType === 'pharmacy').length;
    const vendorCount = vendors.filter(v => v.vendorType === 'vendor').length;
    
    return {
      totalVendors,
      activeVendors,
      verifiedVendors,
      averageRating: totalVendors > 0 ? totalRating / totalVendors : 0,
      totalProducts,
      pharmacyCount,
      vendorCount,
    };
  }

  // Filter vendors by rating
  filterVendorsByRating(vendors: Vendor[], minRating: number): Vendor[] {
    return vendors.filter(vendor => vendor.rating >= minRating);
  }

  // Get vendors with products in stock
  getVendorsWithStock(vendors: Vendor[]): Vendor[] {
    return vendors.filter(vendor => 
      vendor.products.some(product => product.inStock && product.isActive)
    );
  }

  // Get product availability across vendors
  getProductAvailability(vendors: Vendor[], productName: string): Array<{
    vendor: Vendor;
    product: VendorProduct;
    available: boolean;
  }> {
    const availability: Array<{
      vendor: Vendor;
      product: VendorProduct;
      available: boolean;
    }> = [];

    vendors.forEach(vendor => {
      const product = vendor.products.find(p => 
        p.productName.toLowerCase().includes(productName.toLowerCase())
      );
      
      if (product) {
        availability.push({
          vendor,
          product,
          available: product.inStock && product.isActive
        });
      }
    });

    return availability.sort((a, b) => {
      // Sort by availability first, then by price
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      return a.product.price - b.product.price;
    });
  }

  // Get vendor performance rating
  getVendorPerformanceRating(vendor: Vendor): {
    overallScore: number;
    breakdown: {
      rating: number;
      deliveryRate: number;
      responseTime: number;
      stockAvailability: number;
    };
  } {
    const activeProducts = vendor.products.filter(p => p.isActive);
    const inStockProducts = activeProducts.filter(p => p.inStock);
    const stockAvailability = activeProducts.length > 0 ? 
      (inStockProducts.length / activeProducts.length) * 100 : 0;
    
    const deliveryRate = vendor.onTimeDeliveryRate || 0;
    const rating = vendor.rating || 0;
    const responseTime = vendor.performanceMetrics?.responseTime || 0;
    
    // Normalize response time (assuming lower is better, max 24 hours)
    const normalizedResponseTime = Math.max(0, 100 - (responseTime / 24) * 100);
    
    const overallScore = (
      rating * 0.3 + 
      deliveryRate * 0.3 + 
      normalizedResponseTime * 0.2 + 
      stockAvailability * 0.2
    );
    
    return {
      overallScore,
      breakdown: {
        rating,
        deliveryRate,
        responseTime: normalizedResponseTime,
        stockAvailability
      }
    };
  }

  // Get recommended vendors for a product
  getRecommendedVendors(
    vendors: Vendor[], 
    productName: string, 
    userLocation?: { cityId: string; governorateId: string }
  ): Vendor[] {
    let availableVendors = vendors.filter(vendor =>
      vendor.isActive && 
      vendor.isVerified &&
      vendor.products.some(p => 
        p.productName.toLowerCase().includes(productName.toLowerCase()) &&
        p.inStock && 
        p.isActive
      )
    );

    // Prioritize local vendors
    if (userLocation) {
      availableVendors.sort((a, b) => {
        const aIsLocal = a.address.cityId === userLocation.cityId;
        const bIsLocal = b.address.cityId === userLocation.cityId;
        
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        
        // Secondary sort by rating
        return b.rating - a.rating;
      });
    } else {
      // Sort by rating if no location provided
      availableVendors.sort((a, b) => b.rating - a.rating);
    }

    return availableVendors.slice(0, 10); // Return top 10 recommendations
  }

  // Bulk update vendor products
  async bulkUpdateVendorProducts(
    vendorId: string,
    updates: Array<{
      productId: string;
      updates: Partial<VendorProduct>;
    }>
  ): Promise<{ success: boolean; results: VendorProductResponse[] }> {
    try {
      const results = await Promise.all(
        updates.map(({ productId, updates: productUpdates }) =>
          this.updateVendorProduct(vendorId, productId, productUpdates)
        )
      );
      
      return { success: true, results };
    } catch (error) {
      throw new Error(`Bulk update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Bulk update product stocks
  async bulkUpdateProductStocks(
    vendorId: string,
    stockUpdates: Array<{
      productId: string;
      quantity: number;
    }>
  ): Promise<{ success: boolean; results: VendorProductResponse[] }> {
    try {
      const results = await Promise.all(
        stockUpdates.map(({ productId, quantity }) =>
          this.updateProductStock(vendorId, productId, quantity)
        )
      );
      
      return { success: true, results };
    } catch (error) {
      throw new Error(`Bulk stock update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get vendor dashboard data
  async getVendorDashboardData(vendorId: string): Promise<{
    vendor: Vendor;
    orders: {
      pending: number;
      confirmed: number;
      completed: number;
      total: number;
    };
    products: {
      total: number;
      active: number;
      inStock: number;
      outOfStock: number;
    };
    performance: {
      rating: number;
      completionRate: number;
      onTimeDelivery: number;
    };
    recentOrders: Order[];
  }> {
    try {
      const [vendorResponse, ordersResponse, orderStatsResponse] = await Promise.all([
        this.getVendorById(vendorId),
        this.getVendorOrders(vendorId, { limit: 10, page: 1 }),
        this.getOrderStats(vendorId)
      ]);

      const vendor = vendorResponse.data;
      const recentOrders = ordersResponse.data;
      const orderStats = orderStatsResponse.data;

      const totalProducts = vendor.products.length;
      const activeProducts = vendor.products.filter(p => p.isActive).length;
      const inStockProducts = vendor.products.filter(p => p.inStock && p.isActive).length;
      const outOfStockProducts = activeProducts - inStockProducts;

      return {
        vendor,
        orders: {
          pending: orderStats.statusBreakdown.pending?.count || 0,
          confirmed: orderStats.statusBreakdown.confirmed?.count || 0,
          completed: orderStats.statusBreakdown.delivered?.count || 0,
          total: orderStats.total.totalOrders
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          inStock: inStockProducts,
          outOfStock: outOfStockProducts
        },
        performance: {
          rating: vendor.rating,
          completionRate: orderStats.completionRate,
          onTimeDelivery: vendor.onTimeDeliveryRate || 0
        },
        recentOrders
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export vendor data
  exportVendorData(vendors: Vendor[], format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = [
        'ID', 'Name', 'Name (Arabic)', 'Code', 'Type', 'Phone', 'Email',
        'City', 'Governorate', 'Active', 'Verified', 'Rating', 'Products Count'
      ];
      
      const rows = vendors.map(vendor => [
        vendor._id,
        vendor.vendorName,
        vendor.vendorNameAr || '',
        vendor.vendorCode,
        vendor.vendorType,
        vendor.phone,
        vendor.email,
        vendor.address.cityName,
        vendor.address.governorateName,
        vendor.isActive ? 'Yes' : 'No',
        vendor.isVerified ? 'Yes' : 'No',
        vendor.rating.toString(),
        vendor.products.length.toString()
      ]);
      
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    } else {
      return JSON.stringify(vendors, null, 2);
    }
  }

  // Import vendor data
  async importVendorData(data: string, format: 'json' | 'csv' = 'json'): Promise<{
    success: boolean;
    imported: number;
    failed: number;
    errors: string[];
  }> {
    const results = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [] as string[]
    };

    try {
      let vendorsToImport: Partial<Vendor>[] = [];

      if (format === 'json') {
        vendorsToImport = JSON.parse(data);
      } else {
        // Parse CSV (basic implementation)
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length === headers.length) {
            const vendor: Partial<Vendor> = {};
            headers.forEach((header, index) => {
              (vendor as any)[header.toLowerCase()] = values[index];
            });
            vendorsToImport.push(vendor);
          }
        }
      }

      for (const vendorData of vendorsToImport) {
        try {
          await this.createVendor(vendorData);
          results.imported++;
        } catch (error) {
          results.failed++;
          results.errors.push(
            `Failed to import vendor ${vendorData.vendorName}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
      }

      results.success = results.failed === 0;
      return results;
    } catch (error) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  // Validate vendor data
  validateVendorData(vendorData: Partial<Vendor>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!vendorData.vendorName) errors.push('Vendor name is required');
    if (!vendorData.vendorCode) errors.push('Vendor code is required');
    if (!vendorData.phone) errors.push('Phone number is required');
    if (!vendorData.email) errors.push('Email is required');
    if (!vendorData.vendorType) errors.push('Vendor type is required');

    // Email validation
    if (vendorData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorData.email)) {
      errors.push('Invalid email format');
    }

    // Phone validation
    if (vendorData.phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(vendorData.phone)) {
      warnings.push('Phone number format may be invalid');
    }

    // Address validation
    if (!vendorData.address?.cityId) errors.push('City ID is required');
    if (!vendorData.address?.governorateId) errors.push('Governorate ID is required');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const providerOrderService = new EnhancedProviderOrderService();

// Initialize token if available
if (typeof window !== 'undefined') {
  const token = getAuthToken();
  if (token) {
    providerOrderService.setToken(token);
  }
}

// Export the service class for custom instances
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/cookies';

export { EnhancedProviderOrderService };
