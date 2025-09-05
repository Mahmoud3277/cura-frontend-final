// Prescription Reader Analytics Service - Comprehensive analytics for prescription reader dashboard
export interface PrescriptionProcessingAnalytics {
    totalProcessed: number;
    dailyProcessed: number;
    weeklyProcessed: number;
    monthlyProcessed: number;
    averageProcessingTime: number; // minutes
    processingSpeed: number; // prescriptions per hour
    accuracyRate: number;
    errorRate: number;
    processingTrend: {
        date: string;
        processed: number;
        averageTime: number;
        accuracy: number;
    }[];
    timeDistribution: {
        hour: number;
        processed: number;
        averageTime: number;
        efficiency: number;
    }[];
    complexityAnalysis: {
        simple: { count: number; averageTime: number; accuracy: number };
        moderate: { count: number; averageTime: number; accuracy: number };
        complex: { count: number; averageTime: number; accuracy: number };
        urgent: { count: number; averageTime: number; accuracy: number };
    };
}

export interface PrescriptionQualityMetrics {
    overallAccuracy: number;
    medicineIdentificationAccuracy: number;
    dosageAccuracy: number;
    instructionAccuracy: number;
    qualityTrend: {
        date: string;
        accuracy: number;
        errors: number;
        corrections: number;
    }[];
    errorTypes: {
        type: string;
        count: number;
        percentage: number;
        impact: 'low' | 'medium' | 'high' | 'critical';
    }[];
    qualityScore: number;
    improvementAreas: string[];
    bestPractices: string[];
}

export interface PrescriptionWorkloadAnalytics {
    currentWorkload: number;
    averageWorkload: number;
    peakWorkload: number;
    workloadDistribution: {
        timeSlot: string;
        workload: number;
        efficiency: number;
    }[];
    queueMetrics: {
        averageWaitTime: number;
        longestWaitTime: number;
        queueLength: number;
        urgentInQueue: number;
    };
    capacityUtilization: number;
    burnoutRisk: 'low' | 'medium' | 'high';
    workloadForecast: {
        nextHour: number;
        nextDay: number;
        nextWeek: number;
    };
}

export interface PrescriptionCategoryAnalytics {
    categoryBreakdown: {
        category: string;
        count: number;
        percentage: number;
        averageTime: number;
        accuracy: number;
        complexity: number;
    }[];
    medicineTypes: {
        type: string;
        frequency: number;
        processingTime: number;
        errorRate: number;
        specialization: boolean;
    }[];
    urgencyDistribution: {
        urgent: number;
        high: number;
        medium: number;
        low: number;
    };
    seasonalPatterns: {
        season: string;
        commonCategories: string[];
        volumeIncrease: number;
        processingChallenges: string[];
    }[];
}

export interface PrescriptionReaderPerformance {
    productivityScore: number;
    efficiencyRating: number;
    qualityRating: number;
    consistencyScore: number;
    improvementRate: number;
    performanceRank: {
        overall: number;
        accuracy: number;
        speed: number;
        quality: number;
        totalReaders: number;
    };
    achievements: {
        title: string;
        description: string;
        dateEarned: string;
        category: string;
    }[];
    milestones: {
        milestone: string;
        target: number;
        current: number;
        progress: number;
        estimatedCompletion: string;
    }[];
}

export interface PrescriptionLearningAnalytics {
    skillDevelopment: {
        skill: string;
        level: number;
        progress: number;
        recommendations: string[];
    }[];
    trainingModules: {
        module: string;
        completed: boolean;
        score: number;
        timeSpent: number;
        lastAccessed: string;
    }[];
    knowledgeGaps: {
        area: string;
        severity: 'low' | 'medium' | 'high';
        impact: string;
        recommendations: string[];
    }[];
    certifications: {
        name: string;
        status: 'active' | 'expired' | 'pending';
        expiryDate: string;
        renewalRequired: boolean;
    }[];
}

export interface PrescriptionReaderDashboardAnalytics {
    processing: PrescriptionProcessingAnalytics;
    quality: PrescriptionQualityMetrics;
    workload: PrescriptionWorkloadAnalytics;
    categories: PrescriptionCategoryAnalytics;
    performance: PrescriptionReaderPerformance;
    learning: PrescriptionLearningAnalytics;
    insights: {
        keyMetrics: {
            metric: string;
            value: string;
            change: number;
            trend: 'up' | 'down' | 'stable';
            benchmark: string;
        }[];
        recommendations: {
            priority: 'high' | 'medium' | 'low';
            category: string;
            title: string;
            description: string;
            expectedImpact: string;
        }[];
        alerts: {
            type: 'performance' | 'quality' | 'workload' | 'training';
            severity: 'info' | 'warning' | 'critical';
            message: string;
            action: string;
        }[];
    };
}

class PrescriptionReaderAnalyticsService {
    // Get comprehensive prescription reader analytics
    getPrescriptionReaderAnalytics(readerId: string): PrescriptionReaderDashboardAnalytics {
        return {
            processing: this.getProcessingAnalytics(readerId),
            quality: this.getQualityMetrics(readerId),
            workload: this.getWorkloadAnalytics(readerId),
            categories: this.getCategoryAnalytics(readerId),
            performance: this.getPerformanceMetrics(readerId),
            learning: this.getLearningAnalytics(readerId),
            insights: this.getInsights(readerId),
        };
    }

    private getProcessingAnalytics(readerId: string): PrescriptionProcessingAnalytics {
        // Generate processing trend data
        const processingTrend = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const baseProcessed = 25 + Math.random() * 15;
            const baseTime = 12 + Math.random() * 8;
            const accuracy = 92 + Math.random() * 6;

            processingTrend.push({
                date: date.toISOString().split('T')[0],
                processed: Math.round(baseProcessed),
                averageTime: Math.round(baseTime * 10) / 10,
                accuracy: Math.round(accuracy * 10) / 10,
            });
        }

        // Generate hourly distribution
        const timeDistribution = [];
        for (let hour = 8; hour <= 17; hour++) {
            const baseProcessed =
                hour >= 9 && hour <= 16 ? 8 + Math.random() * 6 : 3 + Math.random() * 3;
            const avgTime = 12 + Math.random() * 6;
            const efficiency = 75 + Math.random() * 20;

            timeDistribution.push({
                hour,
                processed: Math.round(baseProcessed),
                averageTime: Math.round(avgTime * 10) / 10,
                efficiency: Math.round(efficiency),
            });
        }

        return {
            totalProcessed: 1247,
            dailyProcessed: 32,
            weeklyProcessed: 224,
            monthlyProcessed: 967,
            averageProcessingTime: 14.5,
            processingSpeed: 4.1,
            accuracyRate: 94.8,
            errorRate: 5.2,
            processingTrend,
            timeDistribution,
            complexityAnalysis: {
                simple: { count: 567, averageTime: 8.5, accuracy: 97.2 },
                moderate: { count: 456, averageTime: 15.2, accuracy: 94.8 },
                complex: { count: 189, averageTime: 28.7, accuracy: 89.5 },
                urgent: { count: 35, averageTime: 12.3, accuracy: 92.1 },
            },
        };
    }

    private getQualityMetrics(readerId: string): PrescriptionQualityMetrics {
        // Generate quality trend data
        const qualityTrend = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const accuracy = 92 + Math.random() * 6;
            const errors = Math.round(Math.random() * 3);
            const corrections = Math.round(Math.random() * 2);

            qualityTrend.push({
                date: date.toISOString().split('T')[0],
                accuracy: Math.round(accuracy * 10) / 10,
                errors,
                corrections,
            });
        }

        return {
            overallAccuracy: 94.8,
            medicineIdentificationAccuracy: 96.2,
            dosageAccuracy: 93.7,
            instructionAccuracy: 94.1,
            qualityTrend,
            errorTypes: [
                { type: 'Medicine Name Misread', count: 23, percentage: 35.4, impact: 'high' },
                { type: 'Dosage Interpretation', count: 18, percentage: 27.7, impact: 'critical' },
                {
                    type: 'Frequency Misunderstanding',
                    count: 12,
                    percentage: 18.5,
                    impact: 'medium',
                },
                { type: 'Doctor Handwriting', count: 8, percentage: 12.3, impact: 'medium' },
                { type: 'Incomplete Information', count: 4, percentage: 6.1, impact: 'low' },
            ],
            qualityScore: 92.5,
            improvementAreas: [
                'Improve handwriting recognition skills',
                'Enhance dosage calculation accuracy',
                'Better understanding of medical abbreviations',
                'Strengthen medicine name recognition',
            ],
            bestPractices: [
                'Double-check critical medications',
                'Use reference materials for unclear prescriptions',
                'Verify dosages against standard ranges',
                'Consult with pharmacists for complex cases',
            ],
        };
    }

    private getWorkloadAnalytics(readerId: string): PrescriptionWorkloadAnalytics {
        const workloadDistribution = [
            { timeSlot: '08:00-10:00', workload: 15, efficiency: 85 },
            { timeSlot: '10:00-12:00', workload: 22, efficiency: 92 },
            { timeSlot: '12:00-14:00', workload: 18, efficiency: 78 },
            { timeSlot: '14:00-16:00', workload: 25, efficiency: 88 },
            { timeSlot: '16:00-18:00', workload: 12, efficiency: 82 },
        ];

        return {
            currentWorkload: 23,
            averageWorkload: 32,
            peakWorkload: 45,
            workloadDistribution,
            queueMetrics: {
                averageWaitTime: 45, // minutes
                longestWaitTime: 120,
                queueLength: 12,
                urgentInQueue: 3,
            },
            capacityUtilization: 78.5,
            burnoutRisk: 'medium',
            workloadForecast: {
                nextHour: 8,
                nextDay: 35,
                nextWeek: 245,
            },
        };
    }

    private getCategoryAnalytics(readerId: string): PrescriptionCategoryAnalytics {
        return {
            categoryBreakdown: [
                {
                    category: 'Cardiovascular',
                    count: 234,
                    percentage: 18.8,
                    averageTime: 16.5,
                    accuracy: 95.2,
                    complexity: 7.5,
                },
                {
                    category: 'Diabetes',
                    count: 189,
                    percentage: 15.2,
                    averageTime: 14.2,
                    accuracy: 96.8,
                    complexity: 6.8,
                },
                {
                    category: 'Antibiotics',
                    count: 156,
                    percentage: 12.5,
                    averageTime: 12.8,
                    accuracy: 94.5,
                    complexity: 5.5,
                },
                {
                    category: 'Pain Management',
                    count: 134,
                    percentage: 10.7,
                    averageTime: 18.7,
                    accuracy: 92.3,
                    complexity: 8.2,
                },
                {
                    category: 'Mental Health',
                    count: 123,
                    percentage: 9.9,
                    averageTime: 22.5,
                    accuracy: 89.7,
                    complexity: 9.1,
                },
            ],
            medicineTypes: [
                {
                    type: 'Tablets',
                    frequency: 567,
                    processingTime: 12.5,
                    errorRate: 4.2,
                    specialization: false,
                },
                {
                    type: 'Injections',
                    frequency: 234,
                    processingTime: 18.7,
                    errorRate: 6.8,
                    specialization: true,
                },
                {
                    type: 'Syrups',
                    frequency: 189,
                    processingTime: 15.2,
                    errorRate: 5.5,
                    specialization: false,
                },
                {
                    type: 'Topical',
                    frequency: 156,
                    processingTime: 14.8,
                    errorRate: 4.9,
                    specialization: false,
                },
            ],
            urgencyDistribution: {
                urgent: 45,
                high: 123,
                medium: 567,
                low: 512,
            },
            seasonalPatterns: [
                {
                    season: 'Winter',
                    commonCategories: ['Respiratory', 'Cold & Flu', 'Immune Support'],
                    volumeIncrease: 35.2,
                    processingChallenges: ['Complex dosing schedules', 'Multiple medications'],
                },
                {
                    season: 'Summer',
                    commonCategories: ['Skin Care', 'Allergies', 'Travel Medicine'],
                    volumeIncrease: 18.7,
                    processingChallenges: [
                        'Topical application instructions',
                        'Allergy interactions',
                    ],
                },
            ],
        };
    }

    private getPerformanceMetrics(readerId: string): PrescriptionReaderPerformance {
        return {
            productivityScore: 87.5,
            efficiencyRating: 92.3,
            qualityRating: 94.8,
            consistencyScore: 89.7,
            improvementRate: 12.5,
            performanceRank: {
                overall: 3,
                accuracy: 2,
                speed: 5,
                quality: 3,
                totalReaders: 34,
            },
            achievements: [
                {
                    title: 'Quality Excellence',
                    description: 'Maintained 95%+ accuracy for 3 consecutive months',
                    dateEarned: '2024-01-15',
                    category: 'Quality',
                },
                {
                    title: 'Speed Demon',
                    description: 'Processed 50+ prescriptions in a single day',
                    dateEarned: '2024-01-10',
                    category: 'Productivity',
                },
                {
                    title: 'Consistency Champion',
                    description: 'Maintained consistent performance for 6 months',
                    dateEarned: '2023-12-20',
                    category: 'Reliability',
                },
            ],
            milestones: [
                {
                    milestone: '1000 Prescriptions Processed',
                    target: 1000,
                    current: 1247,
                    progress: 100,
                    estimatedCompletion: 'Completed',
                },
                {
                    milestone: '95% Accuracy Rate',
                    target: 95,
                    current: 94.8,
                    progress: 99.8,
                    estimatedCompletion: '2024-01-25',
                },
                {
                    milestone: 'Expert Level Certification',
                    target: 100,
                    current: 87,
                    progress: 87,
                    estimatedCompletion: '2024-03-15',
                },
            ],
        };
    }

    private getLearningAnalytics(readerId: string): PrescriptionLearningAnalytics {
        return {
            skillDevelopment: [
                {
                    skill: 'Handwriting Recognition',
                    level: 8.5,
                    progress: 15.2,
                    recommendations: [
                        'Practice with challenging handwriting samples',
                        'Complete advanced recognition training module',
                    ],
                },
                {
                    skill: 'Medical Terminology',
                    level: 9.2,
                    progress: 8.7,
                    recommendations: [
                        'Review latest pharmaceutical terminology updates',
                        'Study specialized medical abbreviations',
                    ],
                },
                {
                    skill: 'Dosage Calculations',
                    level: 7.8,
                    progress: 22.5,
                    recommendations: [
                        'Complete advanced dosage calculation course',
                        'Practice with complex dosing scenarios',
                    ],
                },
                {
                    skill: 'Quality Control',
                    level: 9.0,
                    progress: 12.3,
                    recommendations: [
                        'Implement systematic quality checks',
                        'Learn advanced error detection techniques',
                    ],
                },
            ],
            trainingModules: [
                {
                    module: 'Advanced Prescription Reading',
                    completed: true,
                    score: 92,
                    timeSpent: 4.5,
                    lastAccessed: '2024-01-15',
                },
                {
                    module: 'Medical Abbreviations Mastery',
                    completed: true,
                    score: 88,
                    timeSpent: 3.2,
                    lastAccessed: '2024-01-10',
                },
                {
                    module: 'Complex Dosage Calculations',
                    completed: false,
                    score: 0,
                    timeSpent: 1.5,
                    lastAccessed: '2024-01-18',
                },
                {
                    module: 'Quality Assurance Protocols',
                    completed: true,
                    score: 95,
                    timeSpent: 2.8,
                    lastAccessed: '2024-01-12',
                },
            ],
            knowledgeGaps: [
                {
                    area: 'Pediatric Dosing',
                    severity: 'medium',
                    impact: "May affect accuracy in children's prescriptions",
                    recommendations: [
                        'Complete pediatric pharmacy course',
                        'Study age-based dosing guidelines',
                    ],
                },
                {
                    area: 'Oncology Medications',
                    severity: 'high',
                    impact: 'Critical for cancer treatment prescriptions',
                    recommendations: [
                        'Enroll in oncology pharmacy specialization',
                        'Shadow experienced oncology pharmacist',
                    ],
                },
            ],
            certifications: [
                {
                    name: 'Certified Prescription Reader',
                    status: 'active',
                    expiryDate: '2024-12-31',
                    renewalRequired: false,
                },
                {
                    name: 'Advanced Medical Terminology',
                    status: 'active',
                    expiryDate: '2024-06-30',
                    renewalRequired: true,
                },
                {
                    name: 'Quality Assurance Specialist',
                    status: 'pending',
                    expiryDate: '2025-01-31',
                    renewalRequired: false,
                },
            ],
        };
    }

    private getInsights(readerId: string): {
        keyMetrics: {
            metric: string;
            value: string;
            change: number;
            trend: 'up' | 'down' | 'stable';
            benchmark: string;
        }[];
        recommendations: {
            priority: 'high' | 'medium' | 'low';
            category: string;
            title: string;
            description: string;
            expectedImpact: string;
        }[];
        alerts: {
            type: 'performance' | 'quality' | 'workload' | 'training';
            severity: 'info' | 'warning' | 'critical';
            message: string;
            action: string;
        }[];
    } {
        return {
            keyMetrics: [
                {
                    metric: 'Daily Processed',
                    value: '32',
                    change: 12.5,
                    trend: 'up',
                    benchmark: '30',
                },
                {
                    metric: 'Accuracy Rate',
                    value: '94.8%',
                    change: 2.3,
                    trend: 'up',
                    benchmark: '95%',
                },
                {
                    metric: 'Processing Speed',
                    value: '4.1/hr',
                    change: 8.7,
                    trend: 'up',
                    benchmark: '4.0/hr',
                },
                {
                    metric: 'Quality Score',
                    value: '92.5',
                    change: 5.2,
                    trend: 'up',
                    benchmark: '90',
                },
                {
                    metric: 'Error Rate',
                    value: '5.2%',
                    change: -15.3,
                    trend: 'up',
                    benchmark: '5%',
                },
                {
                    metric: 'Workload Utilization',
                    value: '78.5%',
                    change: 3.8,
                    trend: 'up',
                    benchmark: '80%',
                },
            ],
            recommendations: [
                {
                    priority: 'high',
                    category: 'Quality Improvement',
                    title: 'Focus on Dosage Accuracy',
                    description: 'Improve dosage calculation skills to reduce critical errors',
                    expectedImpact: '15% reduction in dosage-related errors',
                },
                {
                    priority: 'high',
                    category: 'Skill Development',
                    title: 'Complete Complex Dosage Training',
                    description: 'Finish the complex dosage calculations training module',
                    expectedImpact: '20% improvement in complex prescription accuracy',
                },
                {
                    priority: 'medium',
                    category: 'Efficiency',
                    title: 'Optimize Peak Hour Performance',
                    description: 'Improve processing efficiency during 14:00-16:00 peak hours',
                    expectedImpact: '10% increase in daily throughput',
                },
                {
                    priority: 'medium',
                    category: 'Specialization',
                    title: 'Develop Oncology Expertise',
                    description: 'Gain specialized knowledge in oncology medications',
                    expectedImpact: 'Ability to handle specialized prescriptions',
                },
                {
                    priority: 'low',
                    category: 'Technology',
                    title: 'Utilize AI Assistance Tools',
                    description: 'Leverage AI tools for handwriting recognition support',
                    expectedImpact: '5% improvement in processing speed',
                },
            ],
            alerts: [
                {
                    type: 'quality',
                    severity: 'warning',
                    message: 'Accuracy rate slightly below 95% target',
                    action: 'Focus on quality improvement training',
                },
                {
                    type: 'training',
                    severity: 'info',
                    message: 'Complex Dosage Calculations module 50% complete',
                    action: 'Schedule time to complete remaining training',
                },
                {
                    type: 'workload',
                    severity: 'info',
                    message: 'Workload utilization at 78.5% - room for growth',
                    action: 'Consider taking on additional prescriptions',
                },
                {
                    type: 'performance',
                    severity: 'info',
                    message: 'Ranked 3rd overall among prescription readers',
                    action: 'Continue current performance strategies',
                },
            ],
        };
    }

    // Get real-time processing metrics
    getRealTimeMetrics(readerId: string): {
        currentQueue: number;
        processingRate: number;
        accuracyToday: number;
        timeToTarget: number;
        urgentPending: number;
        lastUpdated: string;
    } {
        return {
            currentQueue: 12 + Math.floor(Math.random() * 8),
            processingRate: 3.8 + Math.random() * 1.0,
            accuracyToday: 93.5 + Math.random() * 3.0,
            timeToTarget: 45 + Math.floor(Math.random() * 30),
            urgentPending: 2 + Math.floor(Math.random() * 4),
            lastUpdated: new Date().toISOString(),
        };
    }

    // Get error pattern analysis
    getErrorPatternAnalysis(readerId: string): {
        patterns: {
            pattern: string;
            frequency: number;
            timeOfDay: string;
            complexity: string;
            recommendation: string;
        }[];
        trends: {
            improving: string[];
            declining: string[];
            stable: string[];
        };
        rootCauses: {
            cause: string;
            impact: number;
            solutions: string[];
        }[];
    } {
        return {
            patterns: [
                {
                    pattern: 'Handwriting misinterpretation',
                    frequency: 35.2,
                    timeOfDay: 'Late afternoon',
                    complexity: 'High',
                    recommendation: 'Take breaks during peak fatigue hours',
                },
                {
                    pattern: 'Dosage calculation errors',
                    frequency: 22.8,
                    timeOfDay: 'Morning rush',
                    complexity: 'Medium',
                    recommendation: 'Double-check calculations during busy periods',
                },
                {
                    pattern: 'Medical abbreviation confusion',
                    frequency: 18.5,
                    timeOfDay: 'All day',
                    complexity: 'Low',
                    recommendation: 'Review abbreviation reference guide',
                },
            ],
            trends: {
                improving: ['Medicine name recognition', 'Processing speed'],
                declining: ['Dosage accuracy during peak hours'],
                stable: ['Overall quality score', 'Consistency rating'],
            },
            rootCauses: [
                {
                    cause: 'Fatigue during long shifts',
                    impact: 25.5,
                    solutions: [
                        'Regular breaks',
                        'Workload distribution',
                        'Ergonomic improvements',
                    ],
                },
                {
                    cause: 'Complex prescription formats',
                    impact: 18.7,
                    solutions: ['Additional training', 'Reference materials', 'Peer consultation'],
                },
                {
                    cause: 'Time pressure during peaks',
                    impact: 15.2,
                    solutions: ['Better scheduling', 'Priority systems', 'Support staff'],
                },
            ],
        };
    }
}

export const prescriptionReaderAnalyticsService = new PrescriptionReaderAnalyticsService();
