// Doctor Analytics Service - Comprehensive analytics for doctor dashboard
export interface DoctorReferralAnalytics {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
    conversionRate: number;
    monthlyReferrals: number;
    referralTrend: {
        date: string;
        referrals: number;
        conversions: number;
    }[];
    referralSources: {
        source: 'qr_code' | 'referral_link' | 'direct_contact' | 'social_media';
        count: number;
        conversionRate: number;
        revenue: number;
    }[];
    topReferredProducts: {
        id: string;
        name: string;
        category: string;
        referrals: number;
        conversions: number;
        revenue: number;
    }[];
    patientSegments: {
        segment: string;
        count: number;
        conversionRate: number;
        averageOrderValue: number;
    }[];
}

export interface DoctorCommissionAnalytics {
    totalEarned: number;
    monthlyEarnings: number;
    pendingCommissions: number;
    paidCommissions: number;
    commissionRate: number;
    earningsGrowth: number;
    earningsTrend: {
        date: string;
        amount: number;
        referrals: number;
    }[];
    commissionBreakdown: {
        category: string;
        amount: number;
        percentage: number;
        orders: number;
    }[];
    paymentHistory: {
        date: string;
        amount: number;
        referrals: number;
        status: 'paid' | 'pending' | 'processing';
    }[];
    projectedEarnings: {
        nextMonth: number;
        nextQuarter: number;
        confidence: number;
    };
}

export interface DoctorPatientAnalytics {
    totalPatients: number;
    activePatients: number;
    newPatients: number;
    returningPatients: number;
    patientRetentionRate: number;
    averagePatientValue: number;
    patientLifetimeValue: number;
    patientDemographics: {
        ageGroups: {
            group: string;
            count: number;
            percentage: number;
        }[];
        conditions: {
            condition: string;
            count: number;
            averageOrderValue: number;
        }[];
        locations: {
            city: string;
            count: number;
            conversionRate: number;
        }[];
    };
    patientBehavior: {
        averageOrderFrequency: number;
        preferredCategories: string[];
        seasonalPatterns: {
            season: string;
            orderIncrease: number;
            commonConditions: string[];
        }[];
    };
}

export interface DoctorPerformanceMetrics {
    overallRating: number;
    totalReviews: number;
    responseTime: number; // hours
    professionalScore: number;
    trustScore: number;
    recommendationScore: number;
    performanceTrend: {
        month: string;
        rating: number;
        referrals: number;
        conversions: number;
    }[];
    competitiveRanking: {
        rank: number;
        totalDoctors: number;
        specialization: string;
        cityRank: number;
        cityTotal: number;
    };
    strengths: string[];
    improvementAreas: string[];
}

export interface DoctorMarketInsights {
    specialization: {
        name: string;
        marketSize: number;
        growth: number;
        competition: number;
        opportunities: string[];
    };
    trends: {
        trend: string;
        impact: 'positive' | 'negative' | 'neutral';
        description: string;
        actionable: string;
    }[];
    seasonalOpportunities: {
        season: string;
        conditions: string[];
        expectedIncrease: number;
        recommendations: string[];
    }[];
    competitorAnalysis: {
        topCompetitors: {
            name: string;
            specialization: string;
            referrals: number;
            conversionRate: number;
            strengths: string[];
        }[];
        marketPosition: string;
        differentiators: string[];
    };
}

export interface DoctorEngagementAnalytics {
    qrCodeScans: number;
    linkClicks: number;
    socialMediaReach: number;
    contentEngagement: {
        healthTips: number;
        articles: number;
        videos: number;
        webinars: number;
    };
    digitalPresence: {
        profileViews: number;
        contactRequests: number;
        appointmentBookings: number;
        followersGrowth: number;
    };
    communicationMetrics: {
        responseRate: number;
        averageResponseTime: number;
        patientSatisfaction: number;
        followUpRate: number;
    };
}

export interface DoctorDashboardAnalytics {
    referrals: DoctorReferralAnalytics;
    commissions: DoctorCommissionAnalytics;
    patients: DoctorPatientAnalytics;
    performance: DoctorPerformanceMetrics;
    market: DoctorMarketInsights;
    engagement: DoctorEngagementAnalytics;
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
            type: 'opportunity' | 'warning' | 'info';
            message: string;
            action: string;
        }[];
    };
}

class DoctorAnalyticsService {
    // Get comprehensive doctor analytics
    getDoctorAnalytics(doctorId: string): DoctorDashboardAnalytics {
        return {
            referrals: this.getReferralAnalytics(doctorId),
            commissions: this.getCommissionAnalytics(doctorId),
            patients: this.getPatientAnalytics(doctorId),
            performance: this.getPerformanceMetrics(doctorId),
            market: this.getMarketInsights(doctorId),
            engagement: this.getEngagementAnalytics(doctorId),
            insights: this.getInsights(doctorId),
        };
    }

    private getReferralAnalytics(doctorId: string): DoctorReferralAnalytics {
        // Generate referral trend data
        const referralTrend = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const baseReferrals = 8 + Math.random() * 6;
            const conversions = Math.round(baseReferrals * (0.6 + Math.random() * 0.3));

            referralTrend.push({
                date: date.toISOString().split('T')[0],
                referrals: Math.round(baseReferrals),
                conversions,
            });
        }

        return {
            totalReferrals: 456,
            successfulReferrals: 312,
            pendingReferrals: 23,
            conversionRate: 68.4,
            monthlyReferrals: 38,
            referralTrend,
            referralSources: [
                { source: 'qr_code', count: 189, conversionRate: 72.5, revenue: 28456.8 },
                { source: 'referral_link', count: 156, conversionRate: 65.8, revenue: 23567.5 },
                { source: 'direct_contact', count: 78, conversionRate: 78.2, revenue: 18945.25 },
                { source: 'social_media', count: 33, conversionRate: 54.5, revenue: 7890.45 },
            ],
            topReferredProducts: [
                {
                    id: 'prod-001',
                    name: 'Blood Pressure Monitor',
                    category: 'Medical Devices',
                    referrals: 89,
                    conversions: 67,
                    revenue: 8040.0,
                },
                {
                    id: 'prod-002',
                    name: 'Diabetes Test Strips',
                    category: 'Medical Supplies',
                    referrals: 67,
                    conversions: 52,
                    revenue: 6240.0,
                },
                {
                    id: 'prod-003',
                    name: 'Heart Health Supplements',
                    category: 'Supplements',
                    referrals: 45,
                    conversions: 34,
                    revenue: 4080.0,
                },
            ],
            patientSegments: [
                {
                    segment: 'Chronic Care Patients',
                    count: 234,
                    conversionRate: 78.5,
                    averageOrderValue: 156.75,
                },
                {
                    segment: 'Preventive Care',
                    count: 123,
                    conversionRate: 65.2,
                    averageOrderValue: 89.5,
                },
                {
                    segment: 'Acute Care',
                    count: 99,
                    conversionRate: 58.6,
                    averageOrderValue: 234.25,
                },
            ],
        };
    }

    private getCommissionAnalytics(doctorId: string): DoctorCommissionAnalytics {
        // Generate earnings trend data
        const earningsTrend = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const baseAmount = 1200 + Math.random() * 800;
            const referrals = 25 + Math.random() * 15;

            earningsTrend.push({
                date: date.toISOString().split('T')[0],
                amount: Math.round(baseAmount),
                referrals: Math.round(referrals),
            });
        }

        return {
            totalEarned: 18456.75,
            monthlyEarnings: 1678.5,
            pendingCommissions: 456.25,
            paidCommissions: 18000.5,
            commissionRate: 3.5,
            earningsGrowth: 22.8,
            earningsTrend,
            commissionBreakdown: [
                {
                    category: 'Prescription Medications',
                    amount: 8945.25,
                    percentage: 48.5,
                    orders: 234,
                },
                { category: 'Medical Devices', amount: 4567.8, percentage: 24.7, orders: 89 },
                { category: 'Supplements', amount: 3234.5, percentage: 17.5, orders: 156 },
                { category: 'OTC Medications', amount: 1709.2, percentage: 9.3, orders: 67 },
            ],
            paymentHistory: [
                { date: '2024-01-05', amount: 1567.8, referrals: 34, status: 'paid' },
                { date: '2023-12-05', amount: 1423.5, referrals: 31, status: 'paid' },
                { date: '2023-11-05', amount: 1789.25, referrals: 38, status: 'paid' },
                { date: '2023-10-05', amount: 1234.75, referrals: 28, status: 'paid' },
            ],
            projectedEarnings: {
                nextMonth: 1845.6,
                nextQuarter: 5536.8,
                confidence: 78.5,
            },
        };
    }

    private getPatientAnalytics(doctorId: string): DoctorPatientAnalytics {
        return {
            totalPatients: 456,
            activePatients: 312,
            newPatients: 45,
            returningPatients: 267,
            patientRetentionRate: 85.6,
            averagePatientValue: 234.5,
            patientLifetimeValue: 1456.75,
            patientDemographics: {
                ageGroups: [
                    { group: '18-30', count: 67, percentage: 14.7 },
                    { group: '31-45', count: 123, percentage: 27.0 },
                    { group: '46-60', count: 156, percentage: 34.2 },
                    { group: '60+', count: 110, percentage: 24.1 },
                ],
                conditions: [
                    { condition: 'Hypertension', count: 189, averageOrderValue: 156.75 },
                    { condition: 'Diabetes', count: 134, averageOrderValue: 234.5 },
                    { condition: 'Heart Disease', count: 89, averageOrderValue: 345.25 },
                    { condition: 'Arthritis', count: 67, averageOrderValue: 123.8 },
                ],
                locations: [
                    { city: 'Cairo', count: 234, conversionRate: 72.5 },
                    { city: 'Giza', count: 123, conversionRate: 68.3 },
                    { city: 'Alexandria', count: 67, conversionRate: 65.7 },
                    { city: 'Ismailia', count: 32, conversionRate: 78.1 },
                ],
            },
            patientBehavior: {
                averageOrderFrequency: 2.8, // orders per month
                preferredCategories: ['Prescription Medications', 'Medical Devices', 'Supplements'],
                seasonalPatterns: [
                    {
                        season: 'Winter',
                        orderIncrease: 35.2,
                        commonConditions: ['Respiratory Issues', 'Joint Pain', 'Immune Support'],
                    },
                    {
                        season: 'Summer',
                        orderIncrease: 18.7,
                        commonConditions: ['Skin Care', 'Hydration', 'Travel Health'],
                    },
                ],
            },
        };
    }

    private getPerformanceMetrics(doctorId: string): DoctorPerformanceMetrics {
        const performanceTrend = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const rating = 4.3 + Math.random() * 0.6;
            const referrals = 25 + Math.random() * 15;
            const conversions = Math.round(referrals * (0.6 + Math.random() * 0.2));

            performanceTrend.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                rating: Math.round(rating * 10) / 10,
                referrals: Math.round(referrals),
                conversions,
            });
        }

        return {
            overallRating: 4.7,
            totalReviews: 234,
            responseTime: 2.3,
            professionalScore: 92.5,
            trustScore: 89.7,
            recommendationScore: 94.2,
            performanceTrend,
            competitiveRanking: {
                rank: 3,
                totalDoctors: 156,
                specialization: 'Cardiology',
                cityRank: 2,
                cityTotal: 45,
            },
            strengths: [
                'Excellent patient communication',
                'High referral conversion rate',
                'Strong professional reputation',
                'Consistent performance',
            ],
            improvementAreas: [
                'Increase social media presence',
                'Expand to new patient segments',
                'Improve response time during peak hours',
            ],
        };
    }

    private getMarketInsights(doctorId: string): DoctorMarketInsights {
        return {
            specialization: {
                name: 'Cardiology',
                marketSize: 2456789,
                growth: 15.8,
                competition: 156,
                opportunities: [
                    'Telemedicine expansion',
                    'Preventive care programs',
                    'Digital health monitoring',
                    'Patient education content',
                ],
            },
            trends: [
                {
                    trend: 'Increased demand for preventive care',
                    impact: 'positive',
                    description: 'More patients seeking preventive health solutions',
                    actionable: 'Develop preventive care referral programs',
                },
                {
                    trend: 'Digital health adoption',
                    impact: 'positive',
                    description: 'Growing acceptance of digital health tools',
                    actionable: 'Partner with digital health platforms',
                },
                {
                    trend: 'Cost-conscious healthcare',
                    impact: 'neutral',
                    description: 'Patients more price-sensitive in healthcare decisions',
                    actionable: 'Focus on value-based referrals',
                },
            ],
            seasonalOpportunities: [
                {
                    season: 'Winter',
                    conditions: ['Heart Health', 'Blood Pressure', 'Cholesterol Management'],
                    expectedIncrease: 25.8,
                    recommendations: [
                        'Promote heart health supplements',
                        'Increase blood pressure monitoring referrals',
                        'Focus on winter wellness programs',
                    ],
                },
                {
                    season: 'Summer',
                    conditions: ['Travel Health', 'Hydration', 'Exercise Support'],
                    expectedIncrease: 18.3,
                    recommendations: [
                        'Travel health consultations',
                        'Exercise and nutrition guidance',
                        'Hydration and electrolyte products',
                    ],
                },
            ],
            competitorAnalysis: {
                topCompetitors: [
                    {
                        name: 'Dr. Sarah Ahmed',
                        specialization: 'Cardiology',
                        referrals: 567,
                        conversionRate: 72.3,
                        strengths: ['Strong social media presence', 'Patient education content'],
                    },
                    {
                        name: 'Dr. Mohamed Hassan',
                        specialization: 'Cardiology',
                        referrals: 489,
                        conversionRate: 68.7,
                        strengths: ['Hospital affiliations', 'Research publications'],
                    },
                ],
                marketPosition: 'Strong performer with growth potential',
                differentiators: [
                    'High patient satisfaction scores',
                    'Excellent referral conversion rates',
                    'Strong professional network',
                ],
            },
        };
    }

    private getEngagementAnalytics(doctorId: string): DoctorEngagementAnalytics {
        return {
            qrCodeScans: 1234,
            linkClicks: 2456,
            socialMediaReach: 5678,
            contentEngagement: {
                healthTips: 456,
                articles: 234,
                videos: 123,
                webinars: 67,
            },
            digitalPresence: {
                profileViews: 3456,
                contactRequests: 234,
                appointmentBookings: 156,
                followersGrowth: 23.5,
            },
            communicationMetrics: {
                responseRate: 94.2,
                averageResponseTime: 2.3,
                patientSatisfaction: 4.7,
                followUpRate: 87.6,
            },
        };
    }

    private getInsights(doctorId: string): {
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
            type: 'opportunity' | 'warning' | 'info';
            message: string;
            action: string;
        }[];
    } {
        return {
            keyMetrics: [
                { metric: 'Monthly Referrals', value: '38', change: 15.8, trend: 'up' },
                { metric: 'Conversion Rate', value: '68.4%', change: 5.2, trend: 'up' },
                { metric: 'Monthly Earnings', value: 'EGP 1,679', change: 22.8, trend: 'up' },
                { metric: 'Patient Rating', value: '4.7/5', change: 8.5, trend: 'up' },
                { metric: 'Response Time', value: '2.3h', change: -12.3, trend: 'up' },
                { metric: 'QR Code Scans', value: '1,234', change: 18.7, trend: 'up' },
            ],
            recommendations: [
                {
                    priority: 'high',
                    category: 'Patient Engagement',
                    title: 'Expand Digital Presence',
                    description: 'Increase social media activity and patient education content',
                    expectedImpact: '25% increase in referrals',
                },
                {
                    priority: 'high',
                    category: 'Revenue Growth',
                    title: 'Focus on High-Value Referrals',
                    description: 'Target medical devices and chronic care products',
                    expectedImpact: '30% increase in commission earnings',
                },
                {
                    priority: 'medium',
                    category: 'Market Expansion',
                    title: 'Develop Preventive Care Programs',
                    description: 'Create referral programs for preventive health products',
                    expectedImpact: '20% increase in patient base',
                },
                {
                    priority: 'medium',
                    category: 'Efficiency',
                    title: 'Automate Follow-up Communications',
                    description: 'Implement automated patient follow-up systems',
                    expectedImpact: '15% improvement in patient retention',
                },
                {
                    priority: 'low',
                    category: 'Technology',
                    title: 'Integrate Telemedicine Platform',
                    description: 'Add telemedicine capabilities to expand reach',
                    expectedImpact: '10% increase in consultation bookings',
                },
            ],
            alerts: [
                {
                    type: 'opportunity',
                    message: 'Winter season showing 35% increase in heart health referrals',
                    action: 'Promote heart health products and monitoring devices',
                },
                {
                    type: 'info',
                    message: 'QR code scans increased by 18.7% this month',
                    action: 'Consider expanding QR code placement strategies',
                },
                {
                    type: 'opportunity',
                    message: 'High conversion rate in chronic care segment (78.5%)',
                    action: 'Focus marketing efforts on chronic care patients',
                },
            ],
        };
    }

    // Get referral performance by time period
    getReferralPerformance(
        doctorId: string,
        timeframe: '7d' | '30d' | '90d' | '1y',
    ): {
        referrals: number;
        conversions: number;
        revenue: number;
        conversionRate: number;
        averageOrderValue: number;
        topProducts: string[];
    } {
        const multiplier =
            timeframe === '7d' ? 0.25 : timeframe === '30d' ? 1 : timeframe === '90d' ? 3 : 12;

        return {
            referrals: Math.round(38 * multiplier),
            conversions: Math.round(26 * multiplier),
            revenue: Math.round(4567.8 * multiplier),
            conversionRate: 68.4,
            averageOrderValue: 175.68,
            topProducts: [
                'Blood Pressure Monitor',
                'Diabetes Test Strips',
                'Heart Health Supplements',
            ],
        };
    }

    // Get patient journey analytics
    getPatientJourney(doctorId: string): {
        stages: {
            stage: string;
            patients: number;
            conversionRate: number;
            averageTime: number; // days
        }[];
        dropoffPoints: {
            point: string;
            dropoffRate: number;
            reasons: string[];
        }[];
        optimizationOpportunities: string[];
    } {
        return {
            stages: [
                { stage: 'Initial Contact', patients: 456, conversionRate: 100, averageTime: 0 },
                {
                    stage: 'Information Review',
                    patients: 389,
                    conversionRate: 85.3,
                    averageTime: 1,
                },
                { stage: 'Product Selection', patients: 334, conversionRate: 73.2, averageTime: 2 },
                { stage: 'Order Placement', patients: 312, conversionRate: 68.4, averageTime: 3 },
                { stage: 'Order Completion', patients: 298, conversionRate: 65.4, averageTime: 5 },
            ],
            dropoffPoints: [
                {
                    point: 'Information Review',
                    dropoffRate: 14.7,
                    reasons: ['Price concerns', 'Product availability', 'Complexity'],
                },
                {
                    point: 'Product Selection',
                    dropoffRate: 12.1,
                    reasons: ['Too many options', 'Unclear benefits', 'Comparison shopping'],
                },
                {
                    point: 'Order Placement',
                    dropoffRate: 4.8,
                    reasons: ['Payment issues', 'Delivery concerns', 'Changed mind'],
                },
            ],
            optimizationOpportunities: [
                'Simplify product selection process',
                'Provide clearer pricing information',
                'Improve product benefit explanations',
                'Streamline checkout process',
            ],
        };
    }
}

export const doctorAnalyticsService = new DoctorAnalyticsService();
