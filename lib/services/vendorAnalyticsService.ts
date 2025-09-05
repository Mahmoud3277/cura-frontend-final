// Vendor Analytics Service - Comprehensive analytics for vendor dashboard
export interface VendorSalesAnalytics {
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    averageOrderValue: number;
    salesTrend: {
        date: string;
        revenue: number;
        orders: number;
    }[];
    topSellingProducts: {
        id: string;
        name: string;
        category: string;
        unitsSold: number;
        revenue: number;
        margin: number;
        growth: number;
    }[];
    salesByCategory: {
        category: string;
        revenue: number;
        orders: number;
        growth: number;
        margin: number;
    }[];
    salesByPharmacy: {
        pharmacyId: string;
        pharmacyName: string;
        city: string;
        orders: number;
        revenue: number;
        growth: number;
    }[];
}

export interface VendorProductAnalytics {
    totalProducts: number;
    activeProducts: number;
    newProducts: number;
    discontinuedProducts: number;
    productPerformance: {
        id: string;
        name: string;
        category: string;
        status: 'active' | 'inactive' | 'discontinued';
        unitsSold: number;
        revenue: number;
        profitMargin: number;
        inventoryLevel: number;
        reorderPoint: number;
        lastSaleDate: string;
        rating: number;
        reviews: number;
    }[];
    categoryAnalysis: {
        category: string;
        products: number;
        revenue: number;
        averageMargin: number;
        marketShare: number;
        growth: number;
        opportunities: string[];
    }[];
    productLifecycle: {
        introduction: number;
        growth: number;
        maturity: number;
        decline: number;
    };
    qualityMetrics: {
        averageRating: number;
        totalReviews: number;
        returnRate: number;
        complaintRate: number;
        qualityScore: number;
    };
}

export interface VendorMarketAnalytics {
    marketShare: {
        overall: number;
        byCategory: {
            category: string;
            share: number;
            rank: number;
            competitors: number;
        }[];
        byCity: {
            city: string;
            share: number;
            revenue: number;
            growth: number;
        }[];
    };
    competitivePosition: {
        rank: number;
        totalVendors: number;
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    marketTrends: {
        trend: string;
        impact: 'positive' | 'negative' | 'neutral';
        description: string;
        recommendation: string;
    }[];
    customerSegments: {
        segment: string;
        size: number;
        revenue: number;
        growth: number;
        characteristics: string[];
    }[];
}

export interface VendorOperationalAnalytics {
    orderFulfillment: {
        fulfillmentRate: number;
        averageProcessingTime: number;
        onTimeDeliveryRate: number;
        orderAccuracy: number;
        cancellationRate: number;
    };
    inventoryMetrics: {
        totalInventoryValue: number;
        inventoryTurnover: number;
        stockoutRate: number;
        overstockRate: number;
        averageStockLevel: number;
        warehouseUtilization: number;
    };
    supplierPerformance: {
        totalSuppliers: number;
        averageLeadTime: number;
        supplierReliability: number;
        qualityScore: number;
        costEfficiency: number;
    };
    logistics: {
        averageShippingTime: number;
        shippingCostPerOrder: number;
        deliverySuccessRate: number;
        returnRate: number;
        damagedGoodsRate: number;
    };
}

export interface VendorFinancialAnalytics {
    revenue: {
        total: number;
        monthly: number;
        quarterly: number;
        yearly: number;
        growth: number;
        forecast: number;
    };
    costs: {
        cogs: number; // Cost of Goods Sold
        operational: number;
        marketing: number;
        logistics: number;
        administrative: number;
        total: number;
    };
    profitability: {
        grossProfit: number;
        netProfit: number;
        grossMargin: number;
        netMargin: number;
        ebitda: number;
        roi: number;
    };
    cashFlow: {
        operatingCashFlow: number;
        freeCashFlow: number;
        cashConversionCycle: number;
        daysPayableOutstanding: number;
        daysInventoryOutstanding: number;
    };
    commissions: {
        platformCommission: number;
        commissionRate: number;
        totalCommissionsPaid: number;
        commissionTrend: {
            date: string;
            amount: number;
        }[];
    };
}

export interface VendorCustomerAnalytics {
    customerBase: {
        totalCustomers: number;
        activeCustomers: number;
        newCustomers: number;
        churnedCustomers: number;
        customerRetentionRate: number;
    };
    customerSegmentation: {
        segment: string;
        customers: number;
        revenue: number;
        averageOrderValue: number;
        frequency: number;
        lifetime: number;
    }[];
    customerSatisfaction: {
        overallScore: number;
        nps: number; // Net Promoter Score
        csat: number; // Customer Satisfaction Score
        feedbackTrends: {
            month: string;
            score: number;
            responses: number;
        }[];
    };
    customerBehavior: {
        averageOrderFrequency: number;
        seasonalPatterns: {
            season: string;
            orderIncrease: number;
            popularCategories: string[];
        }[];
        purchasePatterns: {
            pattern: string;
            percentage: number;
            description: string;
        }[];
    };
}

export interface VendorDashboardAnalytics {
    sales: VendorSalesAnalytics;
    products: VendorProductAnalytics;
    market: VendorMarketAnalytics;
    operations: VendorOperationalAnalytics;
    financial: VendorFinancialAnalytics;
    customers: VendorCustomerAnalytics;
    insights: {
        keyMetrics: {
            metric: string;
            value: string;
            change: number;
            trend: 'up' | 'down' | 'stable';
        }[];
        recommendations: {
            priority: 'high' | 'medium' | 'low';
            category: string;
            title: string;
            description: string;
            expectedImpact: string;
        }[];
        alerts: {
            type: 'critical' | 'warning' | 'info';
            message: string;
            action: string;
        }[];
    };
}

class VendorAnalyticsService {
    // Get comprehensive vendor analytics
    getVendorAnalytics(vendorId: string): VendorDashboardAnalytics {
        return {
            sales: this.getSalesAnalytics(vendorId),
            products: this.getProductAnalytics(vendorId),
            market: this.getMarketAnalytics(vendorId),
            operations: this.getOperationalAnalytics(vendorId),
            financial: this.getFinancialAnalytics(vendorId),
            customers: this.getCustomerAnalytics(vendorId),
            insights: this.getInsights(vendorId),
        };
    }

    private getSalesAnalytics(vendorId: string): VendorSalesAnalytics {
        // Generate sales trend data
        const salesTrend = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const baseRevenue = 15000 + Math.random() * 8000;
            const baseOrders = 45 + Math.random() * 25;

            salesTrend.push({
                date: date.toISOString().split('T')[0],
                revenue: Math.round(baseRevenue),
                orders: Math.round(baseOrders),
            });
        }

        return {
            totalRevenue: 456789.5,
            monthlyRevenue: 38945.75,
            revenueGrowth: 18.5,
            totalOrders: 1247,
            averageOrderValue: 366.45,
            salesTrend,
            topSellingProducts: [
                {
                    id: 'prod-001',
                    name: 'Paracetamol 500mg (100 tablets)',
                    category: 'Pain Relief',
                    unitsSold: 2456,
                    revenue: 61400.0,
                    margin: 35.2,
                    growth: 23.5,
                },
                {
                    id: 'prod-002',
                    name: 'Vitamin D3 1000IU (60 capsules)',
                    category: 'Supplements',
                    unitsSold: 1890,
                    revenue: 85050.0,
                    margin: 42.8,
                    growth: 31.2,
                },
                {
                    id: 'prod-003',
                    name: 'Amoxicillin 250mg (20 capsules)',
                    category: 'Antibiotics',
                    unitsSold: 1234,
                    revenue: 61700.0,
                    margin: 28.5,
                    growth: 15.8,
                },
                {
                    id: 'prod-004',
                    name: 'Baby Formula Powder (400g)',
                    category: 'Baby Care',
                    unitsSold: 567,
                    revenue: 68040.0,
                    margin: 22.3,
                    growth: 8.7,
                },
            ],
            salesByCategory: [
                {
                    category: 'Prescription Drugs',
                    revenue: 189456.5,
                    orders: 456,
                    growth: 22.3,
                    margin: 28.5,
                },
                {
                    category: 'Supplements',
                    revenue: 123456.75,
                    orders: 234,
                    growth: 35.7,
                    margin: 42.1,
                },
                {
                    category: 'OTC Medications',
                    revenue: 89012.25,
                    orders: 189,
                    growth: 18.9,
                    margin: 32.8,
                },
                {
                    category: 'Baby Care',
                    revenue: 54864.0,
                    orders: 123,
                    growth: 12.4,
                    margin: 25.6,
                },
            ],
            salesByPharmacy: [
                {
                    pharmacyId: 'pharm-001',
                    pharmacyName: 'MediCare Pharmacy',
                    city: 'Cairo',
                    orders: 234,
                    revenue: 85678.5,
                    growth: 25.8,
                },
                {
                    pharmacyId: 'pharm-002',
                    pharmacyName: 'HealthPlus Pharmacy',
                    city: 'Ismailia',
                    orders: 189,
                    revenue: 69234.25,
                    growth: 18.3,
                },
                {
                    pharmacyId: 'pharm-003',
                    pharmacyName: 'Wellness Pharmacy',
                    city: 'Cairo',
                    orders: 156,
                    revenue: 57123.75,
                    growth: 22.1,
                },
            ],
        };
    }

    private getProductAnalytics(vendorId: string): VendorProductAnalytics {
        const productPerformance = [
            {
                id: 'prod-001',
                name: 'Paracetamol 500mg',
                category: 'Pain Relief',
                status: 'active' as const,
                unitsSold: 2456,
                revenue: 61400.0,
                profitMargin: 35.2,
                inventoryLevel: 5670,
                reorderPoint: 1000,
                lastSaleDate: '2024-01-19',
                rating: 4.8,
                reviews: 234,
            },
            {
                id: 'prod-002',
                name: 'Vitamin D3 1000IU',
                category: 'Supplements',
                status: 'active' as const,
                unitsSold: 1890,
                revenue: 85050.0,
                profitMargin: 42.8,
                inventoryLevel: 3450,
                reorderPoint: 800,
                lastSaleDate: '2024-01-19',
                rating: 4.9,
                reviews: 189,
            },
            {
                id: 'prod-003',
                name: 'Expired Product X',
                category: 'OTC',
                status: 'discontinued' as const,
                unitsSold: 0,
                revenue: 0,
                profitMargin: 0,
                inventoryLevel: 0,
                reorderPoint: 0,
                lastSaleDate: '2023-12-15',
                rating: 3.2,
                reviews: 45,
            },
        ];

        return {
            totalProducts: 1456,
            activeProducts: 1389,
            newProducts: 23,
            discontinuedProducts: 44,
            productPerformance,
            categoryAnalysis: [
                {
                    category: 'Prescription Drugs',
                    products: 456,
                    revenue: 189456.5,
                    averageMargin: 28.5,
                    marketShare: 15.8,
                    growth: 22.3,
                    opportunities: ['Expand diabetes medications', 'Add cardiovascular drugs'],
                },
                {
                    category: 'Supplements',
                    products: 234,
                    revenue: 123456.75,
                    averageMargin: 42.1,
                    marketShare: 22.4,
                    growth: 35.7,
                    opportunities: ['Introduce protein powders', 'Add immune boosters'],
                },
                {
                    category: 'Baby Care',
                    products: 123,
                    revenue: 54864.0,
                    averageMargin: 25.6,
                    marketShare: 8.9,
                    growth: 12.4,
                    opportunities: ['Organic baby products', 'Expand diaper range'],
                },
            ],
            productLifecycle: {
                introduction: 23,
                growth: 456,
                maturity: 789,
                decline: 188,
            },
            qualityMetrics: {
                averageRating: 4.6,
                totalReviews: 2456,
                returnRate: 2.3,
                complaintRate: 1.8,
                qualityScore: 92.5,
            },
        };
    }

    private getMarketAnalytics(vendorId: string): VendorMarketAnalytics {
        return {
            marketShare: {
                overall: 12.8,
                byCategory: [
                    { category: 'Supplements', share: 22.4, rank: 2, competitors: 15 },
                    { category: 'Prescription Drugs', share: 15.8, rank: 3, competitors: 25 },
                    { category: 'Baby Care', share: 8.9, rank: 5, competitors: 12 },
                    { category: 'OTC Medications', share: 18.2, rank: 4, competitors: 18 },
                ],
                byCity: [
                    { city: 'Cairo', share: 18.5, revenue: 189456.5, growth: 22.3 },
                    { city: 'Ismailia', share: 25.8, revenue: 123456.75, growth: 28.7 },
                    { city: 'Alexandria', share: 12.4, revenue: 89012.25, growth: 15.2 },
                ],
            },
            competitivePosition: {
                rank: 3,
                totalVendors: 45,
                strengths: [
                    'Strong supplement portfolio',
                    'Excellent quality ratings',
                    'Fast delivery times',
                    'Competitive pricing',
                ],
                weaknesses: [
                    'Limited prescription drug range',
                    'Smaller market presence in Alexandria',
                    'Higher operational costs',
                ],
                opportunities: [
                    'Expand into chronic care medications',
                    'Develop private label products',
                    'Enter new geographic markets',
                    'Digital health partnerships',
                ],
                threats: [
                    'New international competitors',
                    'Regulatory changes',
                    'Supply chain disruptions',
                    'Price pressure from larger vendors',
                ],
            },
            marketTrends: [
                {
                    trend: 'Increased demand for supplements',
                    impact: 'positive',
                    description: 'Growing health consciousness driving supplement sales',
                    recommendation: 'Expand supplement portfolio and marketing',
                },
                {
                    trend: 'Digital health integration',
                    impact: 'positive',
                    description: 'Pharmacies adopting digital health solutions',
                    recommendation: 'Develop digital health product offerings',
                },
                {
                    trend: 'Generic drug preference',
                    impact: 'neutral',
                    description: 'Shift towards generic medications for cost savings',
                    recommendation: 'Balance branded and generic product mix',
                },
            ],
            customerSegments: [
                {
                    segment: 'Large Chain Pharmacies',
                    size: 15,
                    revenue: 234567.8,
                    growth: 18.5,
                    characteristics: [
                        'High volume orders',
                        'Price sensitive',
                        'Long-term contracts',
                    ],
                },
                {
                    segment: 'Independent Pharmacies',
                    size: 67,
                    revenue: 189456.5,
                    growth: 22.3,
                    characteristics: [
                        'Flexible ordering',
                        'Quality focused',
                        'Personal relationships',
                    ],
                },
                {
                    segment: 'Hospital Pharmacies',
                    size: 8,
                    revenue: 32665.2,
                    growth: 12.7,
                    characteristics: [
                        'Specialized products',
                        'Strict quality requirements',
                        'Bulk orders',
                    ],
                },
            ],
        };
    }

    private getOperationalAnalytics(vendorId: string): VendorOperationalAnalytics {
        return {
            orderFulfillment: {
                fulfillmentRate: 96.8,
                averageProcessingTime: 4.2, // hours
                onTimeDeliveryRate: 94.5,
                orderAccuracy: 98.7,
                cancellationRate: 2.3,
            },
            inventoryMetrics: {
                totalInventoryValue: 2456789.5,
                inventoryTurnover: 8.5,
                stockoutRate: 3.2,
                overstockRate: 12.8,
                averageStockLevel: 78.5,
                warehouseUtilization: 85.2,
            },
            supplierPerformance: {
                totalSuppliers: 45,
                averageLeadTime: 7.5, // days
                supplierReliability: 92.3,
                qualityScore: 94.8,
                costEfficiency: 87.6,
            },
            logistics: {
                averageShippingTime: 1.8, // days
                shippingCostPerOrder: 25.5,
                deliverySuccessRate: 97.2,
                returnRate: 1.8,
                damagedGoodsRate: 0.5,
            },
        };
    }

    private getFinancialAnalytics(vendorId: string): VendorFinancialAnalytics {
        // Generate commission trend data
        const commissionTrend = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const baseCommission = 1200 + Math.random() * 600;

            commissionTrend.push({
                date: date.toISOString().split('T')[0],
                amount: Math.round(baseCommission),
            });
        }

        return {
            revenue: {
                total: 456789.5,
                monthly: 38945.75,
                quarterly: 116837.25,
                yearly: 456789.5,
                growth: 18.5,
                forecast: 542567.8,
            },
            costs: {
                cogs: 273456.8,
                operational: 45678.9,
                marketing: 12345.6,
                logistics: 23456.7,
                administrative: 15678.9,
                total: 370616.9,
            },
            profitability: {
                grossProfit: 183332.7,
                netProfit: 86172.6,
                grossMargin: 40.1,
                netMargin: 18.9,
                ebitda: 102456.8,
                roi: 22.5,
            },
            cashFlow: {
                operatingCashFlow: 95678.5,
                freeCashFlow: 78456.3,
                cashConversionCycle: 45.2, // days
                daysPayableOutstanding: 32.5,
                daysInventoryOutstanding: 67.8,
            },
            commissions: {
                platformCommission: 22839.48, // 5% of revenue
                commissionRate: 5.0,
                totalCommissionsPaid: 22839.48,
                commissionTrend,
            },
        };
    }

    private getCustomerAnalytics(vendorId: string): VendorCustomerAnalytics {
        return {
            customerBase: {
                totalCustomers: 89,
                activeCustomers: 78,
                newCustomers: 8,
                churnedCustomers: 3,
                customerRetentionRate: 87.6,
            },
            customerSegmentation: [
                {
                    segment: 'High Value',
                    customers: 12,
                    revenue: 234567.8,
                    averageOrderValue: 1245.6,
                    frequency: 8.5,
                    lifetime: 24.5,
                },
                {
                    segment: 'Medium Value',
                    customers: 34,
                    revenue: 156789.5,
                    averageOrderValue: 567.8,
                    frequency: 4.2,
                    lifetime: 18.3,
                },
                {
                    segment: 'Low Value',
                    customers: 43,
                    revenue: 65432.2,
                    averageOrderValue: 234.5,
                    frequency: 2.1,
                    lifetime: 12.7,
                },
            ],
            customerSatisfaction: {
                overallScore: 4.6,
                nps: 72,
                csat: 89.5,
                feedbackTrends: [
                    { month: 'Jan', score: 4.6, responses: 45 },
                    { month: 'Dec', score: 4.5, responses: 52 },
                    { month: 'Nov', score: 4.4, responses: 38 },
                    { month: 'Oct', score: 4.3, responses: 41 },
                ],
            },
            customerBehavior: {
                averageOrderFrequency: 4.2, // orders per month
                seasonalPatterns: [
                    {
                        season: 'Winter',
                        orderIncrease: 25.8,
                        popularCategories: ['Cold & Flu', 'Vitamins', 'Immune Support'],
                    },
                    {
                        season: 'Summer',
                        orderIncrease: 15.2,
                        popularCategories: ['Sunscreen', 'Hydration', 'Travel Health'],
                    },
                ],
                purchasePatterns: [
                    {
                        pattern: 'Bulk Orders',
                        percentage: 35.2,
                        description: 'Large quantity orders for inventory',
                    },
                    {
                        pattern: 'Regular Reorders',
                        percentage: 45.8,
                        description: 'Consistent monthly orders',
                    },
                    {
                        pattern: 'Seasonal Spikes',
                        percentage: 19.0,
                        description: 'Increased orders during specific seasons',
                    },
                ],
            },
        };
    }

    private getInsights(vendorId: string): {
        keyMetrics: {
            metric: string;
            value: string;
            change: number;
            trend: 'up' | 'down' | 'stable';
        }[];
        recommendations: {
            priority: 'high' | 'medium' | 'low';
            category: string;
            title: string;
            description: string;
            expectedImpact: string;
        }[];
        alerts: {
            type: 'critical' | 'warning' | 'info';
            message: string;
            action: string;
        }[];
    } {
        return {
            keyMetrics: [
                { metric: 'Monthly Revenue', value: 'EGP 38,946', change: 18.5, trend: 'up' },
                { metric: 'Order Fulfillment', value: '96.8%', change: 2.3, trend: 'up' },
                { metric: 'Customer Satisfaction', value: '4.6/5', change: 4.5, trend: 'up' },
                { metric: 'Market Share', value: '12.8%', change: 8.2, trend: 'up' },
                { metric: 'Inventory Turnover', value: '8.5x', change: -5.2, trend: 'down' },
                { metric: 'Profit Margin', value: '18.9%', change: 12.1, trend: 'up' },
            ],
            recommendations: [
                {
                    priority: 'high',
                    category: 'Inventory',
                    title: 'Optimize Inventory Management',
                    description:
                        'Implement automated reorder system to reduce stockouts and overstock',
                    expectedImpact: '15% reduction in inventory costs',
                },
                {
                    priority: 'high',
                    category: 'Market Expansion',
                    title: 'Expand Supplement Portfolio',
                    description: 'Capitalize on growing supplement market with new product lines',
                    expectedImpact: '25% increase in supplement revenue',
                },
                {
                    priority: 'medium',
                    category: 'Customer Retention',
                    title: 'Implement Loyalty Program',
                    description: 'Develop pharmacy loyalty program to increase retention',
                    expectedImpact: '10% improvement in customer retention',
                },
                {
                    priority: 'medium',
                    category: 'Operations',
                    title: 'Improve Delivery Efficiency',
                    description: 'Optimize delivery routes and logistics partnerships',
                    expectedImpact: '20% reduction in shipping costs',
                },
                {
                    priority: 'low',
                    category: 'Technology',
                    title: 'Digital Platform Enhancement',
                    description: 'Upgrade ordering platform with better analytics and automation',
                    expectedImpact: '5% improvement in order processing efficiency',
                },
            ],
            alerts: [
                {
                    type: 'warning',
                    message: 'Inventory turnover rate has decreased by 5.2%',
                    action: 'Review slow-moving products and adjust procurement strategy',
                },
                {
                    type: 'info',
                    message: 'Supplement category showing 35.7% growth',
                    action: 'Consider expanding supplement product lines',
                },
                {
                    type: 'critical',
                    message: '12 products are approaching stockout levels',
                    action: 'Immediate reorder required for critical products',
                },
            ],
        };
    }

    // Get vendor performance comparison
    getPerformanceComparison(vendorId: string): {
        metrics: {
            metric: string;
            vendor: number;
            industry: number;
            percentile: number;
            status: 'excellent' | 'good' | 'average' | 'below_average';
        }[];
        ranking: {
            overall: number;
            byCategory: {
                category: string;
                rank: number;
                total: number;
            }[];
        };
    } {
        return {
            metrics: [
                {
                    metric: 'Revenue Growth',
                    vendor: 18.5,
                    industry: 12.3,
                    percentile: 85,
                    status: 'excellent',
                },
                {
                    metric: 'Customer Satisfaction',
                    vendor: 4.6,
                    industry: 4.2,
                    percentile: 78,
                    status: 'good',
                },
                {
                    metric: 'Order Fulfillment Rate',
                    vendor: 96.8,
                    industry: 94.2,
                    percentile: 72,
                    status: 'good',
                },
                {
                    metric: 'Profit Margin',
                    vendor: 18.9,
                    industry: 15.6,
                    percentile: 68,
                    status: 'good',
                },
                {
                    metric: 'Inventory Turnover',
                    vendor: 8.5,
                    industry: 9.2,
                    percentile: 45,
                    status: 'average',
                },
            ],
            ranking: {
                overall: 3,
                byCategory: [
                    { category: 'Supplements', rank: 2, total: 15 },
                    { category: 'Prescription Drugs', rank: 5, total: 25 },
                    { category: 'Baby Care', rank: 4, total: 12 },
                    { category: 'OTC Medications', rank: 6, total: 18 },
                ],
            },
        };
    }

    // Get product recommendation engine results
    getProductRecommendations(vendorId: string): {
        newProducts: {
            id: string;
            name: string;
            category: string;
            marketDemand: number;
            competitionLevel: number;
            profitPotential: number;
            recommendation: 'high' | 'medium' | 'low';
            reasoning: string;
        }[];
        discontinueProducts: {
            id: string;
            name: string;
            category: string;
            performance: number;
            recommendation: string;
        }[];
        priceOptimization: {
            id: string;
            name: string;
            currentPrice: number;
            suggestedPrice: number;
            expectedImpact: string;
        }[];
    } {
        return {
            newProducts: [
                {
                    id: 'new-001',
                    name: 'Probiotics Advanced Formula',
                    category: 'Supplements',
                    marketDemand: 85,
                    competitionLevel: 45,
                    profitPotential: 78,
                    recommendation: 'high',
                    reasoning: 'High demand, low competition, excellent profit margins',
                },
                {
                    id: 'new-002',
                    name: 'Organic Baby Food',
                    category: 'Baby Care',
                    marketDemand: 72,
                    competitionLevel: 60,
                    profitPotential: 65,
                    recommendation: 'medium',
                    reasoning: 'Growing organic trend, moderate competition',
                },
            ],
            discontinueProducts: [
                {
                    id: 'disc-001',
                    name: 'Outdated Pain Relief Formula',
                    category: 'Pain Relief',
                    performance: 15,
                    recommendation:
                        'Discontinue due to poor sales and newer alternatives available',
                },
            ],
            priceOptimization: [
                {
                    id: 'opt-001',
                    name: 'Vitamin D3 1000IU',
                    currentPrice: 45.0,
                    suggestedPrice: 48.5,
                    expectedImpact: '8% increase in revenue with minimal demand impact',
                },
                {
                    id: 'opt-002',
                    name: 'Baby Formula Premium',
                    currentPrice: 120.0,
                    suggestedPrice: 115.0,
                    expectedImpact: '12% increase in volume, 5% increase in total revenue',
                },
            ],
        };
    }
}

export const vendorAnalyticsService = new VendorAnalyticsService();
