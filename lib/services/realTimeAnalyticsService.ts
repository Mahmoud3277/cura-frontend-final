// Real-time Analytics Service - Enhanced analytics with live data updates
export interface AnalyticsTimeframe {
    label: string;
    value: string;
    days: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

export interface RevenueAnalytics {
    total: number;
    growth: number;
    daily: ChartDataPoint[];
    weekly: ChartDataPoint[];
    monthly: ChartDataPoint[];
    byCategory: {
        prescription: number;
        otc: number;
        supplements: number;
        skincare: number;
        medical: number;
        baby: number;
    };
    commission: {
        total: number;
        pharmacy: number;
        doctor: number;
        platform: number;
    };
}

export interface OrderAnalytics {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    averageValue: number;
    growth: number;
    hourlyDistribution: ChartDataPoint[];
    statusDistribution: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    topProducts: {
        id: string;
        name: string;
        orders: number;
        revenue: number;
    }[];
}

export interface UserAnalytics {
    total: number;
    active: number;
    newUsers: number;
    growth: number;
    registrationTrend: ChartDataPoint[];
    activityTrend: ChartDataPoint[];
    userTypeDistribution: {
        customer: number;
        pharmacy: number;
        doctor: number;
        vendor: number;
        'prescription-reader': number;
        'database-input': number;
        admin: number;
    };
    topCities: {
        city: string;
        users: number;
        growth: number;
    }[];
}

export interface PrescriptionAnalytics {
    total: number;
    processed: number;
    pending: number;
    rejected: number;
    averageProcessingTime: number;
    processingTrend: ChartDataPoint[];
    urgencyDistribution: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    };
    readerPerformance: {
        readerId: string;
        name: string;
        processed: number;
        averageTime: number;
        accuracy: number;
    }[];
}

export interface PharmacyAnalytics {
    total: number;
    active: number;
    topPerformers: {
        id: string;
        name: string;
        city: string;
        orders: number;
        revenue: number;
        rating: number;
        growth: number;
    }[];
    performanceMetrics: {
        averageRating: number;
        averageDeliveryTime: number;
        orderFulfillmentRate: number;
        customerSatisfaction: number;
    };
    cityDistribution: {
        city: string;
        pharmacies: number;
        orders: number;
        revenue: number;
    }[];
}

export interface SystemAnalytics {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeUsers: number;
    peakHours: ChartDataPoint[];
    systemLoad: ChartDataPoint[];
    apiCalls: ChartDataPoint[];
    errorLog: {
        timestamp: string;
        type: string;
        message: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
    }[];
}

export interface LiveMetrics {
    activeUsers: number;
    ordersToday: number;
    revenueToday: number;
    prescriptionsProcessed: number;
    systemLoad: number;
    lastUpdated: string;
}

class RealTimeAnalyticsService {
    private updateInterval: NodeJS.Timeout | null = null;
    private subscribers: ((data: LiveMetrics) => void)[] = [];

    // Get available timeframes
    getTimeframes(): AnalyticsTimeframe[] {
        return [
            { label: 'Last 7 Days', value: '7d', days: 7 },
            { label: 'Last 30 Days', value: '30d', days: 30 },
            { label: 'Last 90 Days', value: '90d', days: 90 },
            { label: 'Last 6 Months', value: '6m', days: 180 },
            { label: 'Last Year', value: '1y', days: 365 },
        ];
    }

    // Generate mock chart data
    private generateChartData(
        days: number,
        baseValue: number,
        variance: number = 0.2,
    ): ChartDataPoint[] {
        const data: ChartDataPoint[] = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            const randomVariance = (Math.random() - 0.5) * variance * 2;
            const value = Math.max(0, baseValue * (1 + randomVariance));

            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.round(value),
            });
        }

        return data;
    }

    // Get revenue analytics
    getRevenueAnalytics(timeframe: string = '30d'): RevenueAnalytics {
        const days = this.getTimeframes().find((t) => t.value === timeframe)?.days || 30;

        return {
            total: 456789,
            growth: 17.3,
            daily: this.generateChartData(days, 1500, 0.3),
            weekly: this.generateChartData(Math.ceil(days / 7), 10500, 0.2),
            monthly: this.generateChartData(Math.ceil(days / 30), 45000, 0.15),
            byCategory: {
                prescription: 189234,
                otc: 123456,
                supplements: 89012,
                skincare: 34567,
                medical: 15678,
                baby: 4842,
            },
            commission: {
                total: 45678,
                pharmacy: 32456,
                doctor: 8912,
                platform: 4310,
            },
        };
    }

    // Get order analytics
    getOrderAnalytics(timeframe: string = '30d'): OrderAnalytics {
        const days = this.getTimeframes().find((t) => t.value === timeframe)?.days || 30;

        // Generate hourly distribution (24 hours)
        const hourlyData: ChartDataPoint[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const baseOrders = hour >= 9 && hour <= 21 ? 45 : 15; // Higher during business hours
            const variance = Math.random() * 20;
            hourlyData.push({
                date: `${hour.toString().padStart(2, '0')}:00`,
                value: Math.round(baseOrders + variance),
                label: `${hour}:00`,
            });
        }

        return {
            total: 3456,
            completed: 3201,
            pending: 123,
            cancelled: 132,
            averageValue: 132.15,
            growth: 18.3,
            hourlyDistribution: hourlyData,
            statusDistribution: {
                pending: 45,
                processing: 123,
                shipped: 234,
                delivered: 3021,
                cancelled: 33,
            },
            topProducts: [
                { id: '1', name: 'Paracetamol 500mg', orders: 234, revenue: 5850 },
                { id: '2', name: 'Vitamin D3 1000IU', orders: 189, revenue: 8505 },
                { id: '3', name: 'Baby Formula Powder', orders: 156, revenue: 18720 },
                { id: '4', name: 'Omega-3 Fish Oil', orders: 134, revenue: 12730 },
                { id: '5', name: 'Moisturizing Face Cream', orders: 112, revenue: 9520 },
            ],
        };
    }

    // Get user analytics
    getUserAnalytics(timeframe: string = '30d'): UserAnalytics {
        const days = this.getTimeframes().find((t) => t.value === timeframe)?.days || 30;

        return {
            total: 1247,
            active: 892,
            newUsers: 89,
            growth: 12.5,
            registrationTrend: this.generateChartData(days, 3, 0.5),
            activityTrend: this.generateChartData(days, 285, 0.2),
            userTypeDistribution: {
                customer: 892,
                pharmacy: 89,
                doctor: 156,
                vendor: 45,
                'prescription-reader': 34,
                'database-input': 31,
                admin: 5,
            },
            topCities: [
                { city: 'Cairo', users: 456, growth: 15.2 },
                { city: 'Alexandria', users: 234, growth: 12.8 },
                { city: 'Giza', users: 189, growth: 18.5 },
                { city: 'Ismailia', users: 123, growth: 22.1 },
                { city: 'Mansoura', users: 89, growth: 9.7 },
            ],
        };
    }

    // Get prescription analytics
    getPrescriptionAnalytics(timeframe: string = '30d'): PrescriptionAnalytics {
        const days = this.getTimeframes().find((t) => t.value === timeframe)?.days || 30;

        return {
            total: 1234,
            processed: 1089,
            pending: 67,
            rejected: 78,
            averageProcessingTime: 2.5,
            processingTrend: this.generateChartData(days, 41, 0.3),
            urgencyDistribution: {
                low: 456,
                medium: 567,
                high: 156,
                urgent: 55,
            },
            readerPerformance: [
                {
                    readerId: 'reader-001',
                    name: 'Nour Hassan',
                    processed: 234,
                    averageTime: 2.1,
                    accuracy: 98.5,
                },
                {
                    readerId: 'reader-002',
                    name: 'Youssef Ali',
                    processed: 189,
                    averageTime: 2.3,
                    accuracy: 97.8,
                },
                {
                    readerId: 'reader-003',
                    name: 'Mona Salah',
                    processed: 156,
                    averageTime: 2.8,
                    accuracy: 96.9,
                },
                {
                    readerId: 'reader-004',
                    name: 'Ahmed Farid',
                    processed: 134,
                    averageTime: 3.1,
                    accuracy: 95.2,
                },
            ],
        };
    }

    // Get pharmacy analytics
    getPharmacyAnalytics(timeframe: string = '30d'): PharmacyAnalytics {
        return {
            total: 89,
            active: 87,
            topPerformers: [
                {
                    id: 'medicare-cairo',
                    name: 'MediCare Pharmacy',
                    city: 'Cairo',
                    orders: 456,
                    revenue: 67890,
                    rating: 4.9,
                    growth: 23.5,
                },
                {
                    id: 'healthplus-ismailia',
                    name: 'HealthPlus Pharmacy',
                    city: 'Ismailia',
                    orders: 234,
                    revenue: 45678,
                    rating: 4.8,
                    growth: 18.2,
                },
                {
                    id: 'wellness-cairo',
                    name: 'Wellness Pharmacy',
                    city: 'Cairo',
                    orders: 189,
                    revenue: 34567,
                    rating: 4.7,
                    growth: 15.8,
                },
                {
                    id: 'family-care-ismailia',
                    name: 'Family Care Pharmacy',
                    city: 'Ismailia',
                    orders: 156,
                    revenue: 28934,
                    rating: 4.7,
                    growth: 12.4,
                },
                {
                    id: 'alexandria-central',
                    name: 'Alexandria Central',
                    city: 'Alexandria',
                    orders: 134,
                    revenue: 23456,
                    rating: 4.6,
                    growth: 9.8,
                },
            ],
            performanceMetrics: {
                averageRating: 4.7,
                averageDeliveryTime: 32.5,
                orderFulfillmentRate: 96.8,
                customerSatisfaction: 94.2,
            },
            cityDistribution: [
                { city: 'Cairo', pharmacies: 25, orders: 1234, revenue: 189456 },
                { city: 'Alexandria', pharmacies: 18, orders: 789, revenue: 123456 },
                { city: 'Giza', pharmacies: 15, orders: 567, revenue: 89012 },
                { city: 'Ismailia', pharmacies: 12, orders: 456, revenue: 67890 },
                { city: 'Mansoura', pharmacies: 8, orders: 234, revenue: 34567 },
            ],
        };
    }

    // Get system analytics
    getSystemAnalytics(timeframe: string = '30d'): SystemAnalytics {
        const days = this.getTimeframes().find((t) => t.value === timeframe)?.days || 30;

        // Generate peak hours data (24 hours)
        const peakHours: ChartDataPoint[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const baseLoad = hour >= 9 && hour <= 21 ? 75 : 25;
            const variance = Math.random() * 20;
            peakHours.push({
                date: `${hour.toString().padStart(2, '0')}:00`,
                value: Math.round(baseLoad + variance),
                label: `${hour}:00`,
            });
        }

        return {
            uptime: 99.8,
            responseTime: 245,
            errorRate: 0.02,
            activeUsers: 1247,
            peakHours,
            systemLoad: this.generateChartData(days, 65, 0.3),
            apiCalls: this.generateChartData(days, 15000, 0.4),
            errorLog: [
                {
                    timestamp: '2024-01-20T14:30:00Z',
                    type: 'Database Connection',
                    message: 'Temporary connection timeout',
                    severity: 'medium',
                },
                {
                    timestamp: '2024-01-20T12:15:00Z',
                    type: 'Payment Gateway',
                    message: 'API rate limit exceeded',
                    severity: 'high',
                },
                {
                    timestamp: '2024-01-20T09:45:00Z',
                    type: 'File Upload',
                    message: 'Large file upload failed',
                    severity: 'low',
                },
                {
                    timestamp: '2024-01-19T16:20:00Z',
                    type: 'Authentication',
                    message: 'Multiple failed login attempts',
                    severity: 'medium',
                },
            ],
        };
    }

    // Get live metrics
    getLiveMetrics(): LiveMetrics {
        const baseMetrics = {
            activeUsers: 1247 + Math.floor(Math.random() * 100) - 50,
            ordersToday: 156 + Math.floor(Math.random() * 20) - 10,
            revenueToday: 12456 + Math.floor(Math.random() * 2000) - 1000,
            prescriptionsProcessed: 67 + Math.floor(Math.random() * 10) - 5,
            systemLoad: 65 + Math.floor(Math.random() * 20) - 10,
            lastUpdated: new Date().toISOString(),
        };

        return baseMetrics;
    }

    // Subscribe to live updates
    subscribe(callback: (data: LiveMetrics) => void): () => void {
        this.subscribers.push(callback);

        // Start real-time updates if this is the first subscriber
        if (this.subscribers.length === 1) {
            this.startRealTimeUpdates();
        }

        // Return unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter((sub) => sub !== callback);

            // Stop updates if no more subscribers
            if (this.subscribers.length === 0) {
                this.stopRealTimeUpdates();
            }
        };
    }

    // Start real-time updates
    private startRealTimeUpdates(): void {
        this.updateInterval = setInterval(() => {
            const liveData = this.getLiveMetrics();
            this.subscribers.forEach((callback) => callback(liveData));
        }, 5000); // Update every 5 seconds
    }

    // Stop real-time updates
    private stopRealTimeUpdates(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Export data functionality
    exportData(
        type: 'revenue' | 'orders' | 'users' | 'prescriptions' | 'pharmacies',
        format: 'csv' | 'json' | 'excel',
    ): string {
        // Mock export functionality
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `cura_${type}_analytics_${timestamp}.${format}`;

        // In a real implementation, this would generate and download the actual file
        console.log(`Exporting ${type} data as ${format}: ${filename}`);

        return filename;
    }

    // Get analytics summary for dashboard
    getAnalyticsSummary() {
        return {
            revenue: {
                total: 456789,
                growth: 17.3,
                trend: 'up',
            },
            orders: {
                total: 3456,
                growth: 18.3,
                trend: 'up',
            },
            users: {
                total: 1247,
                growth: 12.5,
                trend: 'up',
            },
            prescriptions: {
                total: 1234,
                growth: 15.7,
                trend: 'up',
            },
            systemHealth: {
                uptime: 99.8,
                responseTime: 245,
                status: 'excellent',
            },
        };
    }
}

export const realTimeAnalyticsService = new RealTimeAnalyticsService();
