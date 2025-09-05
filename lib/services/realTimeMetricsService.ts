import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../utils/cookies';

export interface MetricsData {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  averageOrderValue: number;
  lastUpdated: string;
}

export interface OrderEvent {
  orderId: string;
  totalAmount: number;
  pharmacyId?: string;
  vendorId?: string;
  timestamp: string;
}

class RealTimeMetricsService {
  private socket: Socket | null = null;
  private listeners: Map<string, (data: any) => void> = new Map();
  private currentMetrics: MetricsData | null = null;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (typeof window === 'undefined') return;

    try {
      this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', {
        transports: ['websocket'],
        upgrade: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to metrics socket');
        this.isConnected = true;
        this.notifyListeners('connection', { connected: true });
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from metrics socket');
        this.isConnected = false;
        this.notifyListeners('connection', { connected: false });
      });

      // Listen for order events
      this.socket.on('order_created', (data: OrderEvent) => {
        this.handleOrderCreated(data);
      });

      this.socket.on('order_delivered', (data: OrderEvent) => {
        this.handleOrderDelivered(data);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  private handleOrderCreated(data: OrderEvent) {
    if (this.currentMetrics) {
      this.currentMetrics = {
        ...this.currentMetrics,
        totalOrders: this.currentMetrics.totalOrders + 1,
        pendingOrders: this.currentMetrics.pendingOrders + 1,
        todayOrders: this.currentMetrics.todayOrders + 1,
        lastUpdated: new Date().toISOString(),
      };
    }

    this.notifyListeners('order_created', data);
    this.notifyListeners('metrics_updated', this.currentMetrics);
  }

  private handleOrderDelivered(data: OrderEvent) {
    if (this.currentMetrics) {
      this.currentMetrics = {
        ...this.currentMetrics,
        deliveredOrders: this.currentMetrics.deliveredOrders + 1,
        pendingOrders: Math.max(0, this.currentMetrics.pendingOrders - 1),
        totalRevenue: this.currentMetrics.totalRevenue + data.totalAmount,
        todayRevenue: this.currentMetrics.todayRevenue + data.totalAmount,
        averageOrderValue: this.currentMetrics.deliveredOrders > 0 
          ? this.currentMetrics.totalRevenue / this.currentMetrics.deliveredOrders 
          : 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    this.notifyListeners('order_delivered', data);
    this.notifyListeners('metrics_updated', this.currentMetrics);
  }

  private notifyListeners(event: string, data: any) {
    this.listeners.forEach((callback, key) => {
      if (key.startsWith(event)) {
        callback(data);
      }
    });
  }

  // Fetch initial metrics from API
  async fetchMetrics(): Promise<MetricsData | null> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/metrics/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        this.currentMetrics = result.data;
        this.notifyListeners('metrics_updated', this.currentMetrics);
        return result.data;
      }

      throw new Error(result.error || 'Failed to fetch metrics');
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return null;
    }
  }

  // Subscribe to metrics updates
  onMetricsUpdate(callback: (metrics: MetricsData) => void): () => void {
    const id = `metrics_updated_${Date.now()}_${Math.random()}`;
    this.listeners.set(id, callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }

  // Subscribe to order created events
  onOrderCreated(callback: (data: OrderEvent) => void): () => void {
    const id = `order_created_${Date.now()}_${Math.random()}`;
    this.listeners.set(id, callback);

    return () => {
      this.listeners.delete(id);
    };
  }

  // Subscribe to order delivered events
  onOrderDelivered(callback: (data: OrderEvent) => void): () => void {
    const id = `order_delivered_${Date.now()}_${Math.random()}`;
    this.listeners.set(id, callback);

    return () => {
      this.listeners.delete(id);
    };
  }

  // Subscribe to connection status
  onConnectionChange(callback: (data: { connected: boolean }) => void): () => void {
    const id = `connection_${Date.now()}_${Math.random()}`;
    this.listeners.set(id, callback);

    return () => {
      this.listeners.delete(id);
    };
  }

  // Get current metrics without fetching
  getCurrentMetrics(): MetricsData | null {
    return this.currentMetrics;
  }

  // Check if socket is connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Manually refresh metrics
  async refreshMetrics(): Promise<MetricsData | null> {
    return await this.fetchMetrics();
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Reconnect socket
  reconnect() {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    } else if (!this.socket) {
      this.connect();
    }
  }
}

// Export singleton instance
export const realTimeMetricsService = new RealTimeMetricsService();

// Export the service class for custom instances
export { RealTimeMetricsService };

