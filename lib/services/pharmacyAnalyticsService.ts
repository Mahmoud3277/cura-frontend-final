// Pharmacy Analytics Service - Comprehensive analytics for pharmacy dashboard
export interface PharmacyPerformanceMetrics {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    averageOrderValue: number;
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    orderFulfillmentRate: number;
    averageProcessingTime: number; // in minutes
    customerSatisfactionScore: number;
    repeatCustomerRate: number;
}

export interface PharmacyInventoryAnalytics {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    overstockedItems: number;
    inventoryTurnoverRate: number;
    averageStockLevel: number;
    stockValue: number;
    topSellingProducts: {
        id: string;
        name: string;
        category: string;
        unitsSold: number;
        revenue: number;
        stockLevel: number;
        turnoverRate: number;
    }[];
    categoryPerformance: {
        category: string;
        products: number;
        revenue: number;
        margin: number;
        growth: number;
    }[];
    stockAlerts: {
        id: string;
        productName: string;
        currentStock: number;
        minimumStock: number;
        daysUntilStockout: number;
        priority: 'low' | 'medium' | 'high' | 'critical';
    }[];
}

export interface PharmacyOrderAnalytics {
    orderTrends: {
        date: string;
        orders: number;
        revenue: number;
    }[];
    hourlyDistribution: {
        hour: number;
        orders: number;
        averageValue: number;
    }[];
    orderSources: {
        source: 'walk-in' | 'online' | 'prescription' | 'referral';
        count: number;
        percentage: number;
        revenue: number;
    }[];
    prescriptionOrders: {
        total: number;
        urgent: number;
        regular: number;
        averageProcessingTime: number;
        completionRate: number;
    };
    deliveryMetrics: {
        averageDeliveryTime: number;
        onTimeDeliveryRate: number;
        deliveryAreas: {
            area: string;
            orders: number;
            averageTime: number;
        }[];
    };
}

export interface PharmacyCustomerAnalytics {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
    averageCustomerValue: number;
    customerLifetimeValue: number;
    topCustomers: {
        id: string;
        name: string;
        totalOrders: number;
        totalSpent: number;
        lastOrder: string;
        loyaltyTier: string;
    }[];
    customerSegments: {
        segment: string;
        count: number;
        averageValue: number;
        characteristics: string[];
    }[];
    customerFeedback: {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            rating: number;
            count: number;
        }[];
        commonComplaints: string[];
        commonPraises: string[];
    };
}

export interface PharmacyFinancialAnalytics {
    revenue: {
        total: number;
        monthly: number;
        daily: number;
        growth: number;
        forecast: number;
    };
    costs: {
        inventory: number;
        operational: number;
        staff: number;
        utilities: number;
        total: number;
    };
    profitability: {
        grossProfit: number;
        netProfit: number;
        profitMargin: number;
        roi: number;
    };
    cashFlow: {
        inflow: number;
        outflow: number;
        netCashFlow: number;
        trend: 'positive' | 'negative' | 'stable';
    };
    commissions: {
        platformCommission: number;
        doctorCommissions: number;
        totalCommissionsPaid: number;
        commissionRate: number;
    };
}

export interface PharmacyCompetitiveAnalytics {
    marketPosition: {
        rank: number;
        totalPharmacies: number;
        marketShare: number;
        competitiveAdvantage: string[];
    };
    benchmarking: {
        averageOrderValue: {
            pharmacy: number;
            cityAverage: number;
            difference: number;
        };
        customerSatisfaction: {
            pharmacy: number;
            cityAverage: number;
            difference: number;
        };
        deliveryTime: {
            pharmacy: number;
            cityAverage: number;
            difference: number;
        };
    };
    opportunities: {
        title: string;
        description: string;
        impact: 'low' | 'medium' | 'high';
        effort: 'low' | 'medium' | 'high';
    }[];
}

export interface PharmacyDashboardAnalytics {
    performance: PharmacyPerformanceMetrics;
    inventory: PharmacyInventoryAnalytics;
    orders: PharmacyOrderAnalytics;
    customers: PharmacyCustomerAnalytics;
    financial: PharmacyFinancialAnalytics;
    competitive: PharmacyCompetitiveAnalytics;
    insights: {
        keyInsights: string[];
        recommendations: string[];
        alerts: {
            type: 'warning' | 'info' | 'success' | 'error';
            message: string;
            action?: string;
        }[];
    };
}

class PharmacyAnalyticsService {
    // Get comprehensive pharmacy analytics
    getPharmacyAnalytics(pharmacyId: string): PharmacyDashboardAnalytics {
        return {
            performance: this.getPerformanceMetrics(pharmacyId),
            inventory: this.getInventoryAnalytics(pharmacyId),
            orders: this.getOrderAnalytics(pharmacyId),
            customers: this.getCustomerAnalytics(pharmacyId),
            financial: this.getFinancialAnalytics(pharmacyId),
            competitive: this.getCompetitiveAnalytics(pharmacyId),
            insights: this.getInsights(pharmacyId),
        };
    }

    private getPerformanceMetrics(pharmacyId: string): PharmacyPerformanceMetrics {
        return {
            totalOrders: 1247,
            completedOrders: 1189,
            pendingOrders: 34,
            cancelledOrders: 24,
            averageOrderValue: 156.75,
            totalRevenue: 195456.5,
            monthlyRevenue: 18945.25,
            revenueGrowth: 15.8,
            orderFulfillmentRate: 95.3,
            averageProcessingTime: 18.5,
            customerSatisfactionScore: 4.7,
            repeatCustomerRate: 68.2,
        };
    }

    private getInventoryAnalytics(pharmacyId: string): PharmacyInventoryAnalytics {
        return {
            totalProducts: 1456,
            lowStockItems: 23,
            outOfStockItems: 8,
            overstockedItems: 15,
            inventoryTurnoverRate: 8.5,
            averageStockLevel: 78.5,
            stockValue: 234567.8,
            topSellingProducts: [
                {
                    id: 'prod-001',
                    name: 'Paracetamol 500mg',
                    category: 'Pain Relief',
                    unitsSold: 456,
                    revenue: 11400.0,
                    stockLevel: 234,
                    turnoverRate: 12.5,
                },
                {
                    id: 'prod-002',
                    name: 'Vitamin D3 1000IU',
                    category: 'Supplements',
                    unitsSold: 234,
                    revenue: 10530.0,
                    stockLevel: 156,
                    turnoverRate: 9.8,
                },
                {
                    id: 'prod-003',
                    name: 'Amoxicillin 250mg',
                    category: 'Antibiotics',
                    unitsSold: 189,
                    revenue: 9450.0,
                    stockLevel: 89,
                    turnoverRate: 15.2,
                },
                {
                    id: 'prod-004',
                    name: 'Baby Formula Powder',
                    category: 'Baby Care',
                    unitsSold: 123,
                    revenue: 14760.0,
                    stockLevel: 67,
                    turnoverRate: 6.8,
                },
            ],
            categoryPerformance: [
                {
                    category: 'Prescription Drugs',
                    products: 456,
                    revenue: 89456.5,
                    margin: 22.5,
                    growth: 18.3,
                },
                {
                    category: 'OTC Medications',
                    products: 234,
                    revenue: 45678.25,
                    margin: 28.7,
                    growth: 12.8,
                },
                {
                    category: 'Supplements',
                    products: 189,
                    revenue: 34567.8,
                    margin: 35.2,
                    growth: 25.4,
                },
                {
                    category: 'Baby Care',
                    products: 123,
                    revenue: 23456.9,
                    margin: 18.9,
                    growth: 8.7,
                },
            ],
            stockAlerts: [
                {
                    id: 'alert-001',
                    productName: 'Insulin Pen Needles',
                    currentStock: 5,
                    minimumStock: 20,
                    daysUntilStockout: 2,
                    priority: 'critical',
                },
                {
                    id: 'alert-002',
                    productName: 'Blood Pressure Monitor',
                    currentStock: 8,
                    minimumStock: 15,
                    daysUntilStockout: 5,
                    priority: 'high',
                },
                {
                    id: 'alert-003',
                    productName: 'Thermometer Digital',
                    currentStock: 12,
                    minimumStock: 25,
                    daysUntilStockout: 8,
                    priority: 'medium',
                },
            ],
        };
    }

    private getOrderAnalytics(pharmacyId: string): PharmacyOrderAnalytics {
        // Generate order trends for last 30 days
        const orderTrends = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const baseOrders = 35 + Math.random() * 20;
            const baseRevenue = baseOrders * (120 + Math.random() * 80);

            orderTrends.push({
                date: date.toISOString().split('T')[0],
                orders: Math.round(baseOrders),
                revenue: Math.round(baseRevenue),
            });
        }

        // Generate hourly distribution
        const hourlyDistribution = [];
        for (let hour = 0; hour < 24; hour++) {
            const isBusinessHours = hour >= 8 && hour <= 20;
            const baseOrders = isBusinessHours ? 15 + Math.random() * 10 : 2 + Math.random() * 3;
            const avgValue = 140 + Math.random() * 40;

            hourlyDistribution.push({
                hour,
                orders: Math.round(baseOrders),
                averageValue: Math.round(avgValue),
            });
        }

        return {
            orderTrends,
            hourlyDistribution,
            orderSources: [
                { source: 'walk-in', count: 456, percentage: 36.6, revenue: 71456.8 },
                { source: 'online', count: 389, percentage: 31.2, revenue: 60789.5 },
                { source: 'prescription', count: 278, percentage: 22.3, revenue: 43567.2 },
                { source: 'referral', count: 124, percentage: 9.9, revenue: 19643.0 },
            ],
            prescriptionOrders: {
                total: 278,
                urgent: 45,
                regular: 233,
                averageProcessingTime: 22.5,
                completionRate: 96.8,
            },
            deliveryMetrics: {
                averageDeliveryTime: 2.3,
                onTimeDeliveryRate: 94.2,
                deliveryAreas: [
                    { area: 'Downtown', orders: 156, averageTime: 1.8 },
                    { area: 'Suburbs', orders: 234, averageTime: 2.5 },
                    { area: 'Industrial', orders: 89, averageTime: 3.2 },
                    { area: 'Residential', orders: 345, averageTime: 2.1 },
                ],
            },
        };
    }

    private getCustomerAnalytics(pharmacyId: string): PharmacyCustomerAnalytics {
        return {
            totalCustomers: 2456,
            newCustomers: 89,
            returningCustomers: 1678,
            customerRetentionRate: 68.3,
            averageCustomerValue: 156.75,
            customerLifetimeValue: 1245.6,
            topCustomers: [
                {
                    id: 'cust-001',
                    name: 'Ahmed Hassan',
                    totalOrders: 23,
                    totalSpent: 3456.8,
                    lastOrder: '2024-01-18',
                    loyaltyTier: 'Gold',
                },
                {
                    id: 'cust-002',
                    name: 'Fatima Ali',
                    totalOrders: 18,
                    totalSpent: 2789.5,
                    lastOrder: '2024-01-17',
                    loyaltyTier: 'Silver',
                },
                {
                    id: 'cust-003',
                    name: 'Mohamed Salah',
                    totalOrders: 15,
                    totalSpent: 2345.25,
                    lastOrder: '2024-01-16',
                    loyaltyTier: 'Silver',
                },
            ],
            customerSegments: [
                {
                    segment: 'Chronic Care Patients',
                    count: 456,
                    averageValue: 234.5,
                    characteristics: ['Regular prescriptions', 'High loyalty', 'Price sensitive'],
                },
                {
                    segment: 'Wellness Enthusiasts',
                    count: 234,
                    averageValue: 189.75,
                    characteristics: ['Supplements focus', 'Brand conscious', 'Online shoppers'],
                },
                {
                    segment: 'Occasional Buyers',
                    count: 1234,
                    averageValue: 89.25,
                    characteristics: ['OTC medications', 'Price conscious', 'Walk-in customers'],
                },
            ],
            customerFeedback: {
                averageRating: 4.7,
                totalReviews: 456,
                ratingDistribution: [
                    { rating: 5, count: 234 },
                    { rating: 4, count: 156 },
                    { rating: 3, count: 45 },
                    { rating: 2, count: 15 },
                    { rating: 1, count: 6 },
                ],
                commonComplaints: [
                    'Long waiting times during peak hours',
                    'Limited parking space',
                    'Some medications out of stock',
                ],
                commonPraises: [
                    'Knowledgeable and helpful staff',
                    'Clean and well-organized pharmacy',
                    'Fast prescription processing',
                    'Good selection of products',
                ],
            },
        };
    }

    private getFinancialAnalytics(pharmacyId: string): PharmacyFinancialAnalytics {
        return {
            revenue: {
                total: 195456.5,
                monthly: 18945.25,
                daily: 631.51,
                growth: 15.8,
                forecast: 21890.45,
            },
            costs: {
                inventory: 123456.8,
                operational: 15678.9,
                staff: 12345.6,
                utilities: 3456.7,
                total: 154937.0,
            },
            profitability: {
                grossProfit: 72000.5,
                netProfit: 40519.5,
                profitMargin: 20.7,
                roi: 18.5,
            },
            cashFlow: {
                inflow: 195456.5,
                outflow: 154937.0,
                netCashFlow: 40519.5,
                trend: 'positive',
            },
            commissions: {
                platformCommission: 9772.83, // 5% of revenue
                doctorCommissions: 3891.13, // 2% of revenue
                totalCommissionsPaid: 13663.96,
                commissionRate: 7.0,
            },
        };
    }

    private getCompetitiveAnalytics(pharmacyId: string): PharmacyCompetitiveAnalytics {
        return {
            marketPosition: {
                rank: 3,
                totalPharmacies: 25,
                marketShare: 12.8,
                competitiveAdvantage: [
                    'Fast prescription processing',
                    'Wide product selection',
                    'Excellent customer service',
                    'Strategic location',
                ],
            },
            benchmarking: {
                averageOrderValue: {
                    pharmacy: 156.75,
                    cityAverage: 142.3,
                    difference: 10.2,
                },
                customerSatisfaction: {
                    pharmacy: 4.7,
                    cityAverage: 4.3,
                    difference: 9.3,
                },
                deliveryTime: {
                    pharmacy: 2.3,
                    cityAverage: 2.8,
                    difference: -17.9,
                },
            },
            opportunities: [
                {
                    title: 'Expand Online Presence',
                    description: 'Increase digital marketing and online ordering capabilities',
                    impact: 'high',
                    effort: 'medium',
                },
                {
                    title: 'Loyalty Program Enhancement',
                    description: 'Improve customer retention through better rewards',
                    impact: 'medium',
                    effort: 'low',
                },
                {
                    title: 'Inventory Optimization',
                    description: 'Reduce stockouts and overstock situations',
                    impact: 'medium',
                    effort: 'medium',
                },
            ],
        };
    }

    private getInsights(pharmacyId: string): {
        keyInsights: string[];
        recommendations: string[];
        alerts: {
            type: 'warning' | 'info' | 'success' | 'error';
            message: string;
            action?: string;
        }[];
    } {
        return {
            keyInsights: [
                'Revenue growth of 15.8% exceeds city average of 12.3%',
                'Customer satisfaction score of 4.7 is above industry benchmark',
                'Prescription processing time is 18% faster than competitors',
                'Inventory turnover rate indicates healthy stock management',
                'Peak order hours are 10 AM - 2 PM and 6 PM - 8 PM',
            ],
            recommendations: [
                'Consider expanding supplement category due to high margins',
                'Implement automated reorder system for critical medications',
                'Increase staff during peak hours to reduce waiting times',
                'Launch targeted marketing for chronic care patients',
                'Optimize delivery routes to improve efficiency',
            ],
            alerts: [
                {
                    type: 'error',
                    message: '8 products are currently out of stock',
                    action: 'Review and reorder immediately',
                },
                {
                    type: 'warning',
                    message: '23 products have low stock levels',
                    action: 'Check reorder points and supplier availability',
                },
                {
                    type: 'info',
                    message: 'New customer acquisition increased by 12% this month',
                },
                {
                    type: 'success',
                    message: 'Customer satisfaction improved by 0.3 points',
                },
            ],
        };
    }

    // Get real-time pharmacy metrics
    getRealTimeMetrics(pharmacyId: string): {
        activeOrders: number;
        todayRevenue: number;
        pendingPrescriptions: number;
        lowStockAlerts: number;
        customerWaitTime: number;
        lastUpdated: string;
    } {
        return {
            activeOrders: 12 + Math.floor(Math.random() * 8),
            todayRevenue: 1245.5 + Math.floor(Math.random() * 500),
            pendingPrescriptions: 5 + Math.floor(Math.random() * 10),
            lowStockAlerts: 23,
            customerWaitTime: 8 + Math.floor(Math.random() * 15),
            lastUpdated: new Date().toISOString(),
        };
    }

    // Get inventory forecasting
    getInventoryForecast(
        pharmacyId: string,
        productId: string,
    ): {
        currentStock: number;
        averageDailySales: number;
        daysUntilStockout: number;
        recommendedReorderQuantity: number;
        optimalReorderDate: string;
        seasonalFactors: {
            month: string;
            factor: number;
        }[];
    } {
        return {
            currentStock: 45,
            averageDailySales: 3.2,
            daysUntilStockout: 14,
            recommendedReorderQuantity: 100,
            optimalReorderDate: '2024-01-25',
            seasonalFactors: [
                { month: 'Jan', factor: 1.2 },
                { month: 'Feb', factor: 1.1 },
                { month: 'Mar', factor: 0.9 },
                { month: 'Apr', factor: 0.8 },
                { month: 'May', factor: 0.9 },
                { month: 'Jun', factor: 1.0 },
                { month: 'Jul', factor: 1.1 },
                { month: 'Aug', factor: 1.0 },
                { month: 'Sep', factor: 1.1 },
                { month: 'Oct', factor: 1.2 },
                { month: 'Nov', factor: 1.3 },
                { month: 'Dec', factor: 1.4 },
            ],
        };
    }
}

export const pharmacyAnalyticsService = new PharmacyAnalyticsService();
