// Revenue Calculation Service
export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    pharmacyId: string;
    pharmacyName: string;
    commission: number;
    category: string;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: 'cash_on_delivery';
    orderDate: string;
    deliveryDate?: string;
    cityId: string;
    cityName: string;
    governorateId: string;
    isPrescriptionOrder: boolean;
    prescriptionId?: string;
}

export interface CommissionBreakdown {
    pharmacyCommission: number;
    doctorCommission: number;
    platformRevenue: number;
    totalCommission: number;
}

export interface RevenueMetrics {
    totalRevenue: number;
    netRevenue: number;
    grossProfit: number;
    commissionPaid: number;
    platformRevenue: number;
    averageOrderValue: number;
    totalOrders: number;
    revenueGrowth: number;
    totalReturns: number;
    returnRate: number;
    refundAmount: number;
    netRevenueAfterReturns: number;
}

export interface PharmacyRevenue {
    pharmacyId: string;
    pharmacyName: string;
    cityId: string;
    cityName: string;
    totalSales: number;
    totalOrders: number;
    commissionRate: number;
    commissionEarned: number;
    platformRevenue: number;
    averageOrderValue: number;
    growth: number;
}

export interface CategoryRevenue {
    category: string;
    categoryName: string;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    growth: number;
    topProducts: {
        productId: number;
        productName: string;
        revenue: number;
        orders: number;
    }[];
}

export interface CityRevenue {
    cityId: string;
    cityName: string;
    governorateId: string;
    totalRevenue: number;
    totalOrders: number;
    pharmaciesCount: number;
    averageOrderValue: number;
    growth: number;
    topPharmacies: {
        pharmacyId: string;
        pharmacyName: string;
        revenue: number;
        orders: number;
    }[];
}

export interface DoctorRevenue {
    doctorId: string;
    doctorName: string;
    specialization: string;
    referrals: number;
    successfulOrders: number;
    conversionRate: number;
    commissionRate: number;
    commissionEarned: number;
    totalRevenue: number;
    growth: number;
}

export interface RevenueTimeframe {
    label: string;
    value: string;
    days: number;
}

export interface RevenueAnalytics {
    overview: RevenueMetrics;
    byPharmacy: PharmacyRevenue[];
    byCategory: CategoryRevenue[];
    byCity: CityRevenue[];
    byDoctor: DoctorRevenue[];
    timeSeriesData: {
        date: string;
        revenue: number;
        orders: number;
        commission: number;
        platformRevenue: number;
    }[];
    commissionBreakdown: CommissionBreakdown;
}

class RevenueCalculationService {
    private mockOrders: Order[] = [];

    constructor() {
        this.mockOrders = this.generateMockOrders();
    }

    private generateMockOrders(): Order[] {
        const orders: Order[] = [];
        const now = Date.now();

        for (let i = 0; i < 30; i++) {
            const orderDate = new Date(now - i * 24 * 60 * 60 * 1000);

            orders.push({
                id: `ORD-2024-${String(i).padStart(3, '0')}`,
                customerId: `customer-${i}`,
                customerName: 'Test Customer',
                items: [
                    {
                        productId: 1,
                        productName: 'Test Product',
                        quantity: 1,
                        unitPrice: 100,
                        totalPrice: 100,
                        pharmacyId: 'test-pharmacy',
                        pharmacyName: 'Test Pharmacy',
                        commission: 10,
                        category: 'otc',
                    },
                ],
                subtotal: 100,
                deliveryFee: 10,
                discount: 0,
                total: 110,
                status: 'delivered',
                paymentMethod: 'cash_on_delivery',
                orderDate: orderDate.toISOString(),
                cityId: 'test-city',
                cityName: 'Test City',
                governorateId: 'test-gov',
                isPrescriptionOrder: false,
            });
        }

        return orders;
    }

    getTimeframes(): RevenueTimeframe[] {
        return [
            { label: 'Last 7 Days', value: '7d', days: 7 },
            { label: 'Last 30 Days', value: '30d', days: 30 },
            { label: 'Last 90 Days', value: '90d', days: 90 },
        ];
    }

    getRevenueAnalytics(timeframe: string = '30d'): RevenueAnalytics {
        const totalRevenue = this.mockOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = this.mockOrders.length;

        // Mock return data
        const totalReturns = Math.floor(totalOrders * 0.05); // 5% return rate
        const refundAmount = totalRevenue * 0.03; // 3% of revenue refunded
        const netRevenueAfterReturns = totalRevenue - refundAmount;

        // Enhanced pharmacy data with different commission rates
        const pharmacyData = [
            {
                pharmacyId: 'healthplus-ismailia',
                pharmacyName: 'HealthPlus Pharmacy',
                cityId: 'ismailia-city',
                cityName: 'Ismailia',
                totalSales: 45678,
                totalOrders: 234,
                commissionRate: 12,
                commissionEarned: 5481.36,
                platformRevenue: 40196.64,
                averageOrderValue: 195.2,
                growth: 18.5,
            },
            {
                pharmacyId: 'medicare-cairo',
                pharmacyName: 'MediCare Pharmacy',
                cityId: 'cairo-city',
                cityName: 'Cairo',
                totalSales: 67890,
                totalOrders: 345,
                commissionRate: 8,
                commissionEarned: 5431.2,
                platformRevenue: 62458.8,
                averageOrderValue: 196.8,
                growth: 22.3,
            },
            {
                pharmacyId: 'wellness-cairo',
                pharmacyName: 'Wellness Pharmacy',
                cityId: 'cairo-city',
                cityName: 'Cairo',
                totalSales: 34567,
                totalOrders: 189,
                commissionRate: 10,
                commissionEarned: 3456.7,
                platformRevenue: 31110.3,
                averageOrderValue: 182.9,
                growth: 15.7,
            },
        ];

        return {
            overview: {
                totalRevenue: pharmacyData.reduce((sum, p) => sum + p.totalSales, 0),
                netRevenue: pharmacyData.reduce((sum, p) => sum + p.platformRevenue, 0),
                grossProfit: pharmacyData.reduce((sum, p) => sum + p.totalSales, 0) * 0.8,
                commissionPaid: pharmacyData.reduce((sum, p) => sum + p.commissionEarned, 0),
                platformRevenue: pharmacyData.reduce((sum, p) => sum + p.platformRevenue, 0),
                averageOrderValue:
                    pharmacyData.reduce((sum, p) => sum + p.averageOrderValue, 0) /
                    pharmacyData.length,
                totalOrders: pharmacyData.reduce((sum, p) => sum + p.totalOrders, 0),
                revenueGrowth: 18.5,
                totalReturns,
                returnRate: (totalReturns / totalOrders) * 100,
                refundAmount,
                netRevenueAfterReturns,
            },
            byPharmacy: pharmacyData,
            byCategory: [
                {
                    category: 'prescription',
                    categoryName: 'Prescription Medicines',
                    totalRevenue: 89456,
                    totalOrders: 456,
                    averageOrderValue: 196.2,
                    growth: 22.1,
                    topProducts: [
                        {
                            productId: 1,
                            productName: 'Paracetamol 500mg',
                            revenue: 12345,
                            orders: 234,
                        },
                        {
                            productId: 2,
                            productName: 'Amoxicillin 250mg',
                            revenue: 9876,
                            orders: 189,
                        },
                    ],
                },
                {
                    category: 'otc',
                    categoryName: 'Over-the-Counter',
                    totalRevenue: 34567,
                    totalOrders: 234,
                    averageOrderValue: 147.8,
                    growth: 15.3,
                    topProducts: [
                        {
                            productId: 3,
                            productName: 'Vitamin C 1000mg',
                            revenue: 8765,
                            orders: 156,
                        },
                        {
                            productId: 4,
                            productName: 'Ibuprofen 400mg',
                            revenue: 6543,
                            orders: 123,
                        },
                    ],
                },
                {
                    category: 'supplements',
                    categoryName: 'Supplements & Vitamins',
                    totalRevenue: 24012,
                    totalOrders: 178,
                    averageOrderValue: 134.9,
                    growth: 18.7,
                    topProducts: [
                        {
                            productId: 5,
                            productName: 'Omega-3 Fish Oil',
                            revenue: 5432,
                            orders: 89,
                        },
                        {
                            productId: 6,
                            productName: 'Multivitamin Complex',
                            revenue: 4321,
                            orders: 67,
                        },
                    ],
                },
            ],
            byCity: [
                {
                    cityId: 'cairo-city',
                    cityName: 'Cairo',
                    governorateId: 'cairo',
                    totalRevenue: 102457,
                    totalOrders: 534,
                    pharmaciesCount: 2,
                    averageOrderValue: 191.9,
                    growth: 19.8,
                    topPharmacies: [
                        {
                            pharmacyId: 'medicare-cairo',
                            pharmacyName: 'MediCare Pharmacy',
                            revenue: 67890,
                            orders: 345,
                        },
                        {
                            pharmacyId: 'wellness-cairo',
                            pharmacyName: 'Wellness Pharmacy',
                            revenue: 34567,
                            orders: 189,
                        },
                    ],
                },
                {
                    cityId: 'ismailia-city',
                    cityName: 'Ismailia',
                    governorateId: 'ismailia',
                    totalRevenue: 45678,
                    totalOrders: 234,
                    pharmaciesCount: 1,
                    averageOrderValue: 195.2,
                    growth: 18.5,
                    topPharmacies: [
                        {
                            pharmacyId: 'healthplus-ismailia',
                            pharmacyName: 'HealthPlus Pharmacy',
                            revenue: 45678,
                            orders: 234,
                        },
                    ],
                },
            ],
            byDoctor: [
                {
                    doctorId: 'dr-ahmed-hassan',
                    doctorName: 'Dr. Ahmed Hassan',
                    specialization: 'Cardiology',
                    referrals: 45,
                    successfulOrders: 38,
                    conversionRate: 84.4,
                    commissionRate: 5,
                    commissionEarned: 1234.5,
                    totalRevenue: 24690,
                    growth: 28.3,
                },
                {
                    doctorId: 'dr-sarah-mohamed',
                    doctorName: 'Dr. Sarah Mohamed',
                    specialization: 'Pediatrics',
                    referrals: 32,
                    successfulOrders: 28,
                    conversionRate: 87.5,
                    commissionRate: 5,
                    commissionEarned: 987.6,
                    totalRevenue: 19752,
                    growth: 22.7,
                },
            ],
            timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                revenue: 4500 + Math.random() * 1500 + Math.sin(i * 0.2) * 500,
                orders: 25 + Math.floor(Math.random() * 15) + Math.floor(Math.sin(i * 0.3) * 5),
                commission: 450 + Math.random() * 150 + Math.sin(i * 0.2) * 50,
                platformRevenue: 4050 + Math.random() * 1350 + Math.sin(i * 0.2) * 450,
            })).reverse(),
            commissionBreakdown: {
                pharmacyCommission: pharmacyData.reduce((sum, p) => sum + p.commissionEarned, 0),
                doctorCommission: 2222.1,
                platformRevenue: pharmacyData.reduce((sum, p) => sum + p.platformRevenue, 0),
                totalCommission:
                    pharmacyData.reduce((sum, p) => sum + p.commissionEarned, 0) + 2222.1,
            },
        };
    }

    getRevenueSummary(timeframe: string = '30d') {
        const analytics = this.getRevenueAnalytics(timeframe);
        return {
            totalRevenue: analytics.overview.totalRevenue,
            platformRevenue: analytics.overview.platformRevenue,
            commissionPaid: analytics.overview.commissionPaid,
            totalOrders: analytics.overview.totalOrders,
            averageOrderValue: analytics.overview.averageOrderValue,
            growth: analytics.overview.revenueGrowth,
            topPharmacy: analytics.byPharmacy[0] || null,
            topCategory: analytics.byCategory[0] || null,
            topCity: analytics.byCity[0] || null,
        };
    }

    exportRevenueData(type: string, format: string, timeframe: string = '30d'): string {
        const timestamp = new Date().toISOString().split('T')[0];
        return `cura_revenue_${type}_${timestamp}.${format}`;
    }

    getRealTimeRevenueMetrics() {
        return {
            totalRevenue: 45000 + Math.floor(Math.random() * 1000),
            todayRevenue: 2456 + Math.floor(Math.random() * 500),
            todayOrders: 23 + Math.floor(Math.random() * 10),
            pendingCommissions: 1234 + Math.floor(Math.random() * 200),
            lastUpdated: new Date().toISOString(),
        };
    }

    // Calculate real-time KPIs for admin dashboard
    calculateRealTimeKPIs() {
        const analytics = this.getRevenueAnalytics('30d');
        const totalOrders = analytics.overview.totalOrders;
        const completedOrders = Math.floor(totalOrders * 0.92); // 92% completion rate
        const totalCustomers = 1247; // Mock data
        const returningCustomers = Math.floor(totalCustomers * 0.685); // 68.5% retention
        const prescriptionOrders = Math.floor(totalOrders * 0.45); // 45% prescription orders

        return {
            // Revenue KPIs
            totalRevenue: analytics.overview.totalRevenue,
            platformRevenue: analytics.overview.platformRevenue,
            averageOrderValue: analytics.overview.averageOrderValue,
            revenueGrowth: analytics.overview.revenueGrowth,

            // Order KPIs
            totalOrders: totalOrders,
            completedOrders: completedOrders,
            orderCompletionRate: (completedOrders / totalOrders) * 100,

            // Prescription KPIs
            totalPrescriptions: prescriptionOrders,
            prescriptionUploadRate: (prescriptionOrders / totalOrders) * 100,

            // Customer KPIs
            totalCustomers: totalCustomers,
            returningCustomers: returningCustomers,
            customerRetentionRate: (returningCustomers / totalCustomers) * 100,
            newCustomersThisMonth: 89,

            // Pharmacy KPIs
            totalPharmacies: analytics.byPharmacy.length,
            activePharmacies: analytics.byPharmacy.filter((p) => p.totalOrders > 0).length,

            // Real-time metrics
            ordersToday: 23 + Math.floor(Math.random() * 10),
            revenueToday: 2456 + Math.floor(Math.random() * 500),
            prescriptionsProcessedToday: 15 + Math.floor(Math.random() * 8),

            lastUpdated: new Date().toISOString(),
        };
    }

    // Calculate commission for each pharmacy based on their individual rates
    calculatePharmacyCommission(pharmacyId: string, orderValue: number): number {
        const commissionRates: Record<string, number> = {
            'healthplus-ismailia': 12,
            'medicare-cairo': 8,
            'wellness-cairo': 10,
            'newlife-giza': 10,
            'family-care-ismailia': 11,
        };

        const rate = commissionRates[pharmacyId] || 10; // Default 10%
        return (orderValue * rate) / 100;
    }

    // Calculate platform revenue (order value minus commission)
    calculatePlatformRevenue(pharmacyId: string, orderValue: number): number {
        const commission = this.calculatePharmacyCommission(pharmacyId, orderValue);
        return orderValue - commission;
    }

    // Get pharmacy-specific analytics
    getPharmacyAnalytics(pharmacyId: string, timeframe: string = '30d') {
        const analytics = this.getRevenueAnalytics(timeframe);
        const pharmacyData = analytics.byPharmacy.find((p) => p.pharmacyId === pharmacyId);

        if (!pharmacyData) {
            return null;
        }

        return {
            ...pharmacyData,
            // Additional calculated metrics
            conversionRate: 85.2, // Mock conversion rate
            averageDeliveryTime: 32, // minutes
            customerSatisfaction: 4.8, // out of 5
            returnRate: 2.1, // percentage
            topSellingProducts: [
                { name: 'Paracetamol 500mg', sales: 1234, revenue: 2468 },
                { name: 'Vitamin C 1000mg', sales: 987, revenue: 1974 },
                { name: 'Amoxicillin 250mg', sales: 765, revenue: 3825 },
            ],
            monthlyTrend: Array.from({ length: 12 }, (_, i) => ({
                month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
                revenue: pharmacyData.totalSales * (0.7 + Math.random() * 0.6),
                orders: Math.floor(pharmacyData.totalOrders * (0.7 + Math.random() * 0.6)),
                commission: pharmacyData.commissionEarned * (0.7 + Math.random() * 0.6),
            })),
        };
    }
}

export const revenueCalculationService = new RevenueCalculationService();
