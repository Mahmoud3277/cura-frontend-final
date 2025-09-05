// Customer Analytics Service - Comprehensive analytics for customer dashboard
export interface CustomerSpendingAnalytics {
    totalSpent: number;
    monthlySpending: number;
    averageOrderValue: number;
    savingsFromDiscounts: number;
    spendingTrend: {
        date: string;
        amount: number;
    }[];
    categoryBreakdown: {
        prescription: number;
        otc: number;
        supplements: number;
        skincare: number;
        baby: number;
        medical: number;
    };
    monthlyComparison: {
        thisMonth: number;
        lastMonth: number;
        growth: number;
    };
}

export interface CustomerOrderAnalytics {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    averageDeliveryTime: number;
    orderFrequency: number; // orders per month
    orderHistory: {
        id: string;
        date: string;
        total: number;
        status: string;
        items: number;
        pharmacy: string;
    }[];
    statusDistribution: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    preferredPharmacies: {
        name: string;
        orders: number;
        totalSpent: number;
        rating: number;
    }[];
}

export interface CustomerHealthInsights {
    prescriptionAdherence: number;
    chronicConditions: string[];
    medicationReminders: {
        medication: string;
        frequency: string;
        nextDose: string;
        adherenceRate: number;
    }[];
    healthCategories: {
        category: string;
        frequency: number;
        lastPurchase: string;
    }[];
    doctorReferrals: {
        doctorName: string;
        specialization: string;
        referralDate: string;
        ordersFromReferral: number;
    }[];
}

export interface CustomerLoyaltyMetrics {
    loyaltyPoints: number;
    membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
    pointsEarned: number;
    pointsRedeemed: number;
    nextTierRequirement: number;
    rewardsHistory: {
        date: string;
        type: 'earned' | 'redeemed';
        points: number;
        description: string;
    }[];
    availableRewards: {
        id: string;
        title: string;
        pointsRequired: number;
        description: string;
        category: string;
    }[];
}

export interface CustomerRecommendations {
    personalizedProducts: {
        id: string;
        name: string;
        category: string;
        price: number;
        reason: string;
        confidence: number;
    }[];
    reorderSuggestions: {
        id: string;
        name: string;
        lastOrdered: string;
        frequency: string;
        nextSuggestedOrder: string;
    }[];
    healthTips: {
        title: string;
        description: string;
        category: string;
        relevance: number;
    }[];
    seasonalRecommendations: {
        id: string;
        name: string;
        category: string;
        reason: string;
        discount?: number;
    }[];
}

export interface CustomerDashboardAnalytics {
    spending: CustomerSpendingAnalytics;
    orders: CustomerOrderAnalytics;
    health: CustomerHealthInsights;
    loyalty: CustomerLoyaltyMetrics;
    recommendations: CustomerRecommendations;
    summary: {
        totalSavings: number;
        healthScore: number;
        satisfactionRating: number;
        memberSince: string;
    };
}

class CustomerAnalyticsService {
    // Get comprehensive customer analytics
    getCustomerAnalytics(customerId: string): CustomerDashboardAnalytics {
        // Mock data - in real implementation, this would fetch from database
        return {
            spending: this.getSpendingAnalytics(customerId),
            orders: this.getOrderAnalytics(customerId),
            health: this.getHealthInsights(customerId),
            loyalty: this.getLoyaltyMetrics(customerId),
            recommendations: this.getRecommendations(customerId),
            summary: {
                totalSavings: 1250.5,
                healthScore: 85,
                satisfactionRating: 4.7,
                memberSince: '2023-03-15',
            },
        };
    }

    private getSpendingAnalytics(customerId: string): CustomerSpendingAnalytics {
        // Generate mock spending trend data
        const spendingTrend = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const baseAmount = 450 + Math.random() * 200;
            spendingTrend.push({
                date: date.toISOString().split('T')[0],
                amount: Math.round(baseAmount),
            });
        }

        return {
            totalSpent: 5420.75,
            monthlySpending: 485.5,
            averageOrderValue: 125.3,
            savingsFromDiscounts: 340.25,
            spendingTrend,
            categoryBreakdown: {
                prescription: 2150.0,
                otc: 1200.5,
                supplements: 890.25,
                skincare: 650.0,
                baby: 320.0,
                medical: 210.0,
            },
            monthlyComparison: {
                thisMonth: 485.5,
                lastMonth: 420.75,
                growth: 15.4,
            },
        };
    }

    private getOrderAnalytics(customerId: string): CustomerOrderAnalytics {
        const orderHistory = [
            {
                id: 'ORD-2024-001',
                date: '2024-01-18',
                total: 156.75,
                status: 'delivered',
                items: 4,
                pharmacy: 'MediCare Pharmacy',
            },
            {
                id: 'ORD-2024-002',
                date: '2024-01-15',
                total: 89.5,
                status: 'delivered',
                items: 2,
                pharmacy: 'HealthPlus Pharmacy',
            },
            {
                id: 'ORD-2024-003',
                date: '2024-01-12',
                total: 234.25,
                status: 'delivered',
                items: 6,
                pharmacy: 'MediCare Pharmacy',
            },
            {
                id: 'ORD-2024-004',
                date: '2024-01-08',
                total: 67.0,
                status: 'delivered',
                items: 3,
                pharmacy: 'Wellness Pharmacy',
            },
            {
                id: 'ORD-2024-005',
                date: '2024-01-05',
                total: 145.8,
                status: 'cancelled',
                items: 5,
                pharmacy: 'Family Care Pharmacy',
            },
        ];

        return {
            totalOrders: 43,
            completedOrders: 39,
            cancelledOrders: 4,
            averageDeliveryTime: 2.3, // days
            orderFrequency: 4.2, // orders per month
            orderHistory,
            statusDistribution: {
                pending: 1,
                processing: 2,
                shipped: 1,
                delivered: 39,
                cancelled: 4,
            },
            preferredPharmacies: [
                {
                    name: 'MediCare Pharmacy',
                    orders: 18,
                    totalSpent: 2340.5,
                    rating: 4.9,
                },
                {
                    name: 'HealthPlus Pharmacy',
                    orders: 12,
                    totalSpent: 1560.25,
                    rating: 4.7,
                },
                {
                    name: 'Wellness Pharmacy',
                    orders: 8,
                    totalSpent: 980.0,
                    rating: 4.6,
                },
                {
                    name: 'Family Care Pharmacy',
                    orders: 5,
                    totalSpent: 540.0,
                    rating: 4.5,
                },
            ],
        };
    }

    private getHealthInsights(customerId: string): CustomerHealthInsights {
        return {
            prescriptionAdherence: 87.5,
            chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
            medicationReminders: [
                {
                    medication: 'Metformin 500mg',
                    frequency: 'Twice daily',
                    nextDose: '2024-01-20T08:00:00Z',
                    adherenceRate: 92.0,
                },
                {
                    medication: 'Lisinopril 10mg',
                    frequency: 'Once daily',
                    nextDose: '2024-01-20T09:00:00Z',
                    adherenceRate: 85.5,
                },
                {
                    medication: 'Vitamin D3 1000IU',
                    frequency: 'Once daily',
                    nextDose: '2024-01-20T20:00:00Z',
                    adherenceRate: 78.0,
                },
            ],
            healthCategories: [
                {
                    category: 'Diabetes Management',
                    frequency: 12,
                    lastPurchase: '2024-01-18',
                },
                {
                    category: 'Heart Health',
                    frequency: 8,
                    lastPurchase: '2024-01-15',
                },
                {
                    category: 'Vitamins & Supplements',
                    frequency: 15,
                    lastPurchase: '2024-01-12',
                },
                {
                    category: 'Pain Relief',
                    frequency: 6,
                    lastPurchase: '2024-01-10',
                },
            ],
            doctorReferrals: [
                {
                    doctorName: 'Dr. Ahmed Hassan',
                    specialization: 'Cardiology',
                    referralDate: '2023-11-15',
                    ordersFromReferral: 8,
                },
                {
                    doctorName: 'Dr. Fatima Ali',
                    specialization: 'Endocrinology',
                    referralDate: '2023-09-20',
                    ordersFromReferral: 12,
                },
            ],
        };
    }

    private getLoyaltyMetrics(customerId: string): CustomerLoyaltyMetrics {
        const rewardsHistory = [
            {
                date: '2024-01-18',
                type: 'earned' as const,
                points: 15,
                description: 'Order completion bonus',
            },
            {
                date: '2024-01-15',
                type: 'earned' as const,
                points: 8,
                description: 'Purchase reward',
            },
            {
                date: '2024-01-10',
                type: 'redeemed' as const,
                points: -50,
                description: 'Free delivery voucher',
            },
            {
                date: '2024-01-08',
                type: 'earned' as const,
                points: 12,
                description: 'Prescription order bonus',
            },
        ];

        return {
            loyaltyPoints: 1250,
            membershipTier: 'gold',
            pointsEarned: 1450,
            pointsRedeemed: 200,
            nextTierRequirement: 750, // points needed for platinum
            rewardsHistory,
            availableRewards: [
                {
                    id: 'reward-001',
                    title: 'Free Delivery',
                    pointsRequired: 50,
                    description: 'Free delivery on your next order',
                    category: 'shipping',
                },
                {
                    id: 'reward-002',
                    title: '10% Discount',
                    pointsRequired: 100,
                    description: '10% off on supplements',
                    category: 'discount',
                },
                {
                    id: 'reward-003',
                    title: 'Health Consultation',
                    pointsRequired: 200,
                    description: 'Free 30-minute health consultation',
                    category: 'service',
                },
                {
                    id: 'reward-004',
                    title: 'Premium Membership',
                    pointsRequired: 500,
                    description: '3 months of premium benefits',
                    category: 'membership',
                },
            ],
        };
    }

    private getRecommendations(customerId: string): CustomerRecommendations {
        return {
            personalizedProducts: [
                {
                    id: 'prod-001',
                    name: 'Omega-3 Fish Oil 1000mg',
                    category: 'supplements',
                    price: 89.5,
                    reason: 'Supports heart health based on your condition',
                    confidence: 92,
                },
                {
                    id: 'prod-002',
                    name: 'Blood Glucose Test Strips',
                    category: 'medical',
                    price: 125.0,
                    reason: 'Essential for diabetes monitoring',
                    confidence: 95,
                },
                {
                    id: 'prod-003',
                    name: 'Magnesium Supplement 400mg',
                    category: 'supplements',
                    price: 67.25,
                    reason: 'May help with blood pressure management',
                    confidence: 78,
                },
            ],
            reorderSuggestions: [
                {
                    id: 'prod-004',
                    name: 'Metformin 500mg',
                    lastOrdered: '2024-01-05',
                    frequency: 'Monthly',
                    nextSuggestedOrder: '2024-02-05',
                },
                {
                    id: 'prod-005',
                    name: 'Vitamin D3 1000IU',
                    lastOrdered: '2024-01-12',
                    frequency: 'Every 2 months',
                    nextSuggestedOrder: '2024-03-12',
                },
            ],
            healthTips: [
                {
                    title: 'Monitor Blood Sugar Regularly',
                    description: 'Check your blood glucose levels as recommended by your doctor',
                    category: 'diabetes',
                    relevance: 95,
                },
                {
                    title: 'Heart-Healthy Diet',
                    description: 'Include omega-3 rich foods in your diet for better heart health',
                    category: 'nutrition',
                    relevance: 88,
                },
                {
                    title: 'Medication Adherence',
                    description: 'Take your medications at the same time each day for best results',
                    category: 'medication',
                    relevance: 92,
                },
            ],
            seasonalRecommendations: [
                {
                    id: 'prod-006',
                    name: 'Vitamin C 1000mg',
                    category: 'supplements',
                    reason: 'Boost immunity during winter season',
                    discount: 15,
                },
                {
                    id: 'prod-007',
                    name: 'Moisturizing Hand Cream',
                    category: 'skincare',
                    reason: 'Protect skin from winter dryness',
                    discount: 20,
                },
            ],
        };
    }

    // Get spending analytics for a specific timeframe
    getSpendingTrend(
        customerId: string,
        timeframe: '7d' | '30d' | '90d' | '1y',
    ): {
        date: string;
        amount: number;
    }[] {
        const days =
            timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
        const trend = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            const baseAmount = timeframe === '7d' ? 15 : timeframe === '30d' ? 12 : 8;
            const variance = Math.random() * baseAmount * 0.5;

            trend.push({
                date: date.toISOString().split('T')[0],
                amount: Math.round(baseAmount + variance),
            });
        }

        return trend;
    }

    // Get health score calculation
    calculateHealthScore(customerId: string): {
        overall: number;
        factors: {
            prescriptionAdherence: number;
            regularCheckups: number;
            preventiveCare: number;
            lifestyleFactors: number;
        };
        recommendations: string[];
    } {
        return {
            overall: 85,
            factors: {
                prescriptionAdherence: 87,
                regularCheckups: 78,
                preventiveCare: 92,
                lifestyleFactors: 83,
            },
            recommendations: [
                'Schedule regular check-ups with your doctor',
                'Consider adding more preventive supplements',
                'Maintain consistent medication schedule',
                'Track your health metrics regularly',
            ],
        };
    }

    // Get medication adherence insights
    getMedicationAdherence(customerId: string): {
        overall: number;
        byMedication: {
            name: string;
            adherence: number;
            missedDoses: number;
            trend: 'improving' | 'stable' | 'declining';
        }[];
        insights: string[];
    } {
        return {
            overall: 87.5,
            byMedication: [
                {
                    name: 'Metformin 500mg',
                    adherence: 92.0,
                    missedDoses: 3,
                    trend: 'stable',
                },
                {
                    name: 'Lisinopril 10mg',
                    adherence: 85.5,
                    missedDoses: 5,
                    trend: 'improving',
                },
                {
                    name: 'Vitamin D3 1000IU',
                    adherence: 78.0,
                    missedDoses: 8,
                    trend: 'declining',
                },
            ],
            insights: [
                'Your adherence to Metformin is excellent - keep it up!',
                'Lisinopril adherence is improving - great progress',
                'Consider setting reminders for Vitamin D3',
                'Overall adherence is above average for your condition',
            ],
        };
    }
}

export const customerAnalyticsService = new CustomerAnalyticsService();
