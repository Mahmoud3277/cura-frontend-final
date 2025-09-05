// Database Input Analytics Service - Comprehensive analytics for database input users
export interface DatabaseInputProductivityAnalytics {
    dailyProductivity: {
        date: string;
        productsAdded: number;
        productsReviewed: number;
        categoriesCompleted: number;
        hoursWorked: number;
        efficiency: number;
    }[];
    weeklyStats: {
        week: string;
        totalProducts: number;
        averageQuality: number;
        tasksCompleted: number;
        productivity: number;
    }[];
    monthlyTargets: {
        productsToAdd: number;
        productsToReview: number;
        categoriesTarget: number;
        achieved: {
            productsAdded: number;
            productsReviewed: number;
            categoriesCompleted: number;
        };
        completion: {
            products: number;
            reviews: number;
            categories: number;
        };
    };
}

export interface DatabaseInputQualityAnalytics {
    accuracyTrends: {
        date: string;
        accuracy: number;
        errorsFound: number;
        correctionsNeeded: number;
    }[];
    qualityMetrics: {
        dataAccuracy: number;
        completenessScore: number;
        consistencyScore: number;
        errorRate: number;
        improvementRate: number;
    };
    errorAnalysis: {
        errorType: string;
        frequency: number;
        impact: 'high' | 'medium' | 'low';
        trend: 'increasing' | 'stable' | 'decreasing';
    }[];
    qualityComparison: {
        userScore: number;
        teamAverage: number;
        departmentAverage: number;
        companyAverage: number;
    };
}

export interface DatabaseInputTaskAnalytics {
    taskCompletion: {
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        overdueTasks: number;
        completionRate: number;
        averageCompletionTime: number;
    };
    tasksByCategory: {
        category: string;
        assigned: number;
        completed: number;
        pending: number;
        completionRate: number;
        averageTime: number;
    }[];
    tasksByPriority: {
        priority: 'urgent' | 'high' | 'medium' | 'low';
        assigned: number;
        completed: number;
        averageTime: number;
        onTimeCompletion: number;
    }[];
    taskTrends: {
        date: string;
        assigned: number;
        completed: number;
        efficiency: number;
    }[];
}

export interface DatabaseInputPerformanceAnalytics {
    overallScore: number;
    performanceFactors: {
        productivity: number;
        quality: number;
        consistency: number;
        timeliness: number;
        collaboration: number;
    };
    performanceTrends: {
        month: string;
        score: number;
        productivity: number;
        quality: number;
        ranking: number;
    }[];
    achievements: {
        title: string;
        description: string;
        dateEarned: string;
        category: string;
    }[];
    goals: {
        title: string;
        target: number;
        current: number;
        deadline: string;
        status: 'on_track' | 'at_risk' | 'behind';
    }[];
}

export interface DatabaseInputLearningAnalytics {
    skillAssessment: {
        skill: string;
        level: number;
        maxLevel: number;
        progress: number;
        lastAssessed: string;
    }[];
    trainingProgress: {
        course: string;
        progress: number;
        completedModules: number;
        totalModules: number;
        estimatedCompletion: string;
        certification: boolean;
    }[];
    learningPath: {
        currentLevel: string;
        nextLevel: string;
        requirements: string[];
        progress: number;
        estimatedTime: string;
    };
    knowledgeAreas: {
        area: string;
        proficiency: number;
        recentActivity: string;
        improvementSuggestions: string[];
    }[];
}

export interface DatabaseInputDashboardAnalytics {
    productivity: DatabaseInputProductivityAnalytics;
    quality: DatabaseInputQualityAnalytics;
    tasks: DatabaseInputTaskAnalytics;
    performance: DatabaseInputPerformanceAnalytics;
    learning: DatabaseInputLearningAnalytics;
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

class DatabaseInputAnalyticsService {
    // Get comprehensive database input analytics
    getDatabaseInputAnalytics(userId: string): DatabaseInputDashboardAnalytics {
        return {
            productivity: this.getProductivityAnalytics(userId),
            quality: this.getQualityAnalytics(userId),
            tasks: this.getTaskAnalytics(userId),
            performance: this.getPerformanceAnalytics(userId),
            learning: this.getLearningAnalytics(userId),
            insights: this.getInsights(userId),
        };
    }

    private getProductivityAnalytics(userId: string): DatabaseInputProductivityAnalytics {
        // Generate daily productivity data for the last 30 days
        const dailyProductivity = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            const baseProducts = 15 + Math.random() * 10;
            const baseReviews = 8 + Math.random() * 7;
            const baseCategories = 2 + Math.random() * 3;
            const hoursWorked = 7 + Math.random() * 2;

            dailyProductivity.push({
                date: date.toISOString().split('T')[0],
                productsAdded: Math.round(baseProducts),
                productsReviewed: Math.round(baseReviews),
                categoriesCompleted: Math.round(baseCategories),
                hoursWorked: Math.round(hoursWorked * 10) / 10,
                efficiency: Math.round(((baseProducts + baseReviews) / hoursWorked) * 10) / 10,
            });
        }

        // Generate weekly stats for the last 12 weeks
        const weeklyStats = [];
        for (let i = 11; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - i * 7);

            weeklyStats.push({
                week: `Week ${52 - i}`,
                totalProducts: Math.round(80 + Math.random() * 40),
                averageQuality: Math.round((85 + Math.random() * 10) * 10) / 10,
                tasksCompleted: Math.round(15 + Math.random() * 10),
                productivity: Math.round((75 + Math.random() * 20) * 10) / 10,
            });
        }

        return {
            dailyProductivity,
            weeklyStats,
            monthlyTargets: {
                productsToAdd: 350,
                productsToReview: 200,
                categoriesTarget: 25,
                achieved: {
                    productsAdded: 312,
                    productsReviewed: 185,
                    categoriesCompleted: 23,
                },
                completion: {
                    products: 89.1,
                    reviews: 92.5,
                    categories: 92.0,
                },
            },
        };
    }

    private getQualityAnalytics(userId: string): DatabaseInputQualityAnalytics {
        // Generate accuracy trends for the last 30 days
        const accuracyTrends = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            const baseAccuracy = 88 + Math.random() * 8;

            accuracyTrends.push({
                date: date.toISOString().split('T')[0],
                accuracy: Math.round(baseAccuracy * 10) / 10,
                errorsFound: Math.round(Math.random() * 5),
                correctionsNeeded: Math.round(Math.random() * 3),
            });
        }

        return {
            accuracyTrends,
            qualityMetrics: {
                dataAccuracy: 92.5,
                completenessScore: 94.8,
                consistencyScore: 89.2,
                errorRate: 3.2,
                improvementRate: 12.5,
            },
            errorAnalysis: [
                {
                    errorType: 'Missing Product Information',
                    frequency: 15,
                    impact: 'medium',
                    trend: 'decreasing',
                },
                {
                    errorType: 'Incorrect Category Assignment',
                    frequency: 8,
                    impact: 'high',
                    trend: 'stable',
                },
                {
                    errorType: 'Pricing Inconsistencies',
                    frequency: 12,
                    impact: 'medium',
                    trend: 'decreasing',
                },
                {
                    errorType: 'Duplicate Entries',
                    frequency: 5,
                    impact: 'low',
                    trend: 'decreasing',
                },
            ],
            qualityComparison: {
                userScore: 92.5,
                teamAverage: 87.3,
                departmentAverage: 85.1,
                companyAverage: 82.8,
            },
        };
    }

    private getTaskAnalytics(userId: string): DatabaseInputTaskAnalytics {
        // Generate task trends for the last 30 days
        const taskTrends = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            const assigned = Math.round(3 + Math.random() * 4);
            const completed = Math.round(assigned * (0.8 + Math.random() * 0.2));

            taskTrends.push({
                date: date.toISOString().split('T')[0],
                assigned,
                completed,
                efficiency: Math.round((completed / assigned) * 100),
            });
        }

        return {
            taskCompletion: {
                totalTasks: 156,
                completedTasks: 142,
                pendingTasks: 12,
                overdueTasks: 2,
                completionRate: 91.0,
                averageCompletionTime: 4.2, // hours
            },
            tasksByCategory: [
                {
                    category: 'Product Entry',
                    assigned: 85,
                    completed: 78,
                    pending: 7,
                    completionRate: 91.8,
                    averageTime: 3.5,
                },
                {
                    category: 'Data Review',
                    assigned: 45,
                    completed: 42,
                    pending: 3,
                    completionRate: 93.3,
                    averageTime: 2.8,
                },
                {
                    category: 'Category Management',
                    assigned: 26,
                    completed: 22,
                    pending: 2,
                    completionRate: 84.6,
                    averageTime: 6.2,
                },
            ],
            tasksByPriority: [
                {
                    priority: 'urgent',
                    assigned: 12,
                    completed: 11,
                    averageTime: 2.1,
                    onTimeCompletion: 91.7,
                },
                {
                    priority: 'high',
                    assigned: 34,
                    completed: 32,
                    averageTime: 3.8,
                    onTimeCompletion: 94.1,
                },
                {
                    priority: 'medium',
                    assigned: 78,
                    completed: 71,
                    averageTime: 4.5,
                    onTimeCompletion: 91.0,
                },
                {
                    priority: 'low',
                    assigned: 32,
                    completed: 28,
                    averageTime: 5.2,
                    onTimeCompletion: 87.5,
                },
            ],
            taskTrends,
        };
    }

    private getPerformanceAnalytics(userId: string): DatabaseInputPerformanceAnalytics {
        // Generate performance trends for the last 12 months
        const performanceTrends = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = month.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
            });

            performanceTrends.push({
                month: monthName,
                score: Math.round((85 + Math.random() * 10) * 10) / 10,
                productivity: Math.round((80 + Math.random() * 15) * 10) / 10,
                quality: Math.round((88 + Math.random() * 8) * 10) / 10,
                ranking: Math.round(3 + Math.random() * 7),
            });
        }

        return {
            overallScore: 91.2,
            performanceFactors: {
                productivity: 89.5,
                quality: 92.5,
                consistency: 87.8,
                timeliness: 94.2,
                collaboration: 88.9,
            },
            performanceTrends,
            achievements: [
                {
                    title: 'Quality Champion',
                    description: 'Achieved 95%+ accuracy for 3 consecutive months',
                    dateEarned: '2024-01-15',
                    category: 'Quality',
                },
                {
                    title: 'Productivity Star',
                    description: 'Exceeded monthly targets by 20%',
                    dateEarned: '2024-01-10',
                    category: 'Productivity',
                },
                {
                    title: 'Team Player',
                    description: 'Helped 5+ colleagues with complex tasks',
                    dateEarned: '2024-01-05',
                    category: 'Collaboration',
                },
            ],
            goals: [
                {
                    title: 'Achieve 95% Accuracy',
                    target: 95.0,
                    current: 92.5,
                    deadline: '2024-02-28',
                    status: 'on_track',
                },
                {
                    title: 'Complete Advanced Training',
                    target: 100.0,
                    current: 75.0,
                    deadline: '2024-03-15',
                    status: 'on_track',
                },
                {
                    title: 'Reduce Error Rate to <2%',
                    target: 2.0,
                    current: 3.2,
                    deadline: '2024-02-15',
                    status: 'at_risk',
                },
            ],
        };
    }

    private getLearningAnalytics(userId: string): DatabaseInputLearningAnalytics {
        return {
            skillAssessment: [
                {
                    skill: 'Product Data Entry',
                    level: 8,
                    maxLevel: 10,
                    progress: 80,
                    lastAssessed: '2024-01-15',
                },
                {
                    skill: 'Quality Control',
                    level: 7,
                    maxLevel: 10,
                    progress: 70,
                    lastAssessed: '2024-01-12',
                },
                {
                    skill: 'Category Management',
                    level: 6,
                    maxLevel: 10,
                    progress: 60,
                    lastAssessed: '2024-01-10',
                },
                {
                    skill: 'Database Systems',
                    level: 9,
                    maxLevel: 10,
                    progress: 90,
                    lastAssessed: '2024-01-18',
                },
            ],
            trainingProgress: [
                {
                    course: 'Advanced Product Classification',
                    progress: 75,
                    completedModules: 6,
                    totalModules: 8,
                    estimatedCompletion: '2024-02-05',
                    certification: true,
                },
                {
                    course: 'Data Quality Management',
                    progress: 45,
                    completedModules: 3,
                    totalModules: 7,
                    estimatedCompletion: '2024-02-20',
                    certification: true,
                },
                {
                    course: 'Pharmaceutical Product Knowledge',
                    progress: 90,
                    completedModules: 9,
                    totalModules: 10,
                    estimatedCompletion: '2024-01-25',
                    certification: true,
                },
            ],
            learningPath: {
                currentLevel: 'Advanced Data Specialist',
                nextLevel: 'Senior Data Analyst',
                requirements: [
                    'Complete Advanced Product Classification course',
                    'Achieve 95%+ accuracy for 6 months',
                    'Lead 2+ training sessions',
                    'Complete Data Quality Management certification',
                ],
                progress: 65,
                estimatedTime: '4-6 months',
            },
            knowledgeAreas: [
                {
                    area: 'Pharmaceutical Products',
                    proficiency: 85,
                    recentActivity: 'Completed drug interaction training',
                    improvementSuggestions: [
                        'Study rare disease medications',
                        'Learn about new drug approvals',
                    ],
                },
                {
                    area: 'Medical Devices',
                    proficiency: 70,
                    recentActivity: 'Reviewed device classification guidelines',
                    improvementSuggestions: [
                        'Complete medical device certification',
                        'Study FDA regulations',
                    ],
                },
                {
                    area: 'Supplements & Vitamins',
                    proficiency: 90,
                    recentActivity: 'Updated supplement database',
                    improvementSuggestions: [
                        'Learn about new supplement trends',
                        'Study international standards',
                    ],
                },
            ],
        };
    }

    private getInsights(userId: string): {
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
                { metric: 'Data Accuracy', value: '92.5%', change: 5.2, trend: 'up' },
                { metric: 'Productivity Score', value: '89.5%', change: 8.1, trend: 'up' },
                { metric: 'Task Completion', value: '91.0%', change: 3.5, trend: 'up' },
                { metric: 'Quality Score', value: '94.8%', change: 6.8, trend: 'up' },
                { metric: 'Error Rate', value: '3.2%', change: -15.2, trend: 'down' },
                { metric: 'Training Progress', value: '75%', change: 25.0, trend: 'up' },
            ],
            recommendations: [
                {
                    priority: 'high',
                    category: 'Quality Improvement',
                    title: 'Focus on Category Management Skills',
                    description:
                        'Your category management accuracy is below target. Consider additional training.',
                    expectedImpact: '10% improvement in overall accuracy',
                },
                {
                    priority: 'medium',
                    category: 'Productivity',
                    title: 'Optimize Data Entry Workflow',
                    description:
                        'Implement keyboard shortcuts and templates to increase entry speed.',
                    expectedImpact: '15% increase in daily productivity',
                },
                {
                    priority: 'medium',
                    category: 'Learning',
                    title: 'Complete Advanced Training',
                    description:
                        'Finish the Advanced Product Classification course for career advancement.',
                    expectedImpact: 'Qualification for senior role',
                },
                {
                    priority: 'low',
                    category: 'Collaboration',
                    title: 'Mentor New Team Members',
                    description: 'Share your expertise with new hires to improve team performance.',
                    expectedImpact: 'Enhanced team collaboration score',
                },
            ],
            alerts: [
                {
                    type: 'warning',
                    message: 'Error rate increased by 0.5% this week',
                    action: 'Review recent entries and identify common error patterns',
                },
                {
                    type: 'info',
                    message: 'New pharmaceutical products training available',
                    action: 'Enroll in the course to stay updated with latest products',
                },
                {
                    type: 'critical',
                    message: '2 tasks are overdue',
                    action: 'Complete overdue tasks immediately to maintain performance rating',
                },
            ],
        };
    }

    // Get productivity comparison with team
    getProductivityComparison(userId: string): {
        userStats: {
            dailyAverage: number;
            weeklyAverage: number;
            monthlyTotal: number;
            accuracy: number;
        };
        teamStats: {
            dailyAverage: number;
            weeklyAverage: number;
            monthlyTotal: number;
            accuracy: number;
        };
        ranking: {
            position: number;
            totalMembers: number;
            percentile: number;
        };
    } {
        return {
            userStats: {
                dailyAverage: 18.5,
                weeklyAverage: 92.5,
                monthlyTotal: 370,
                accuracy: 92.5,
            },
            teamStats: {
                dailyAverage: 15.2,
                weeklyAverage: 76.0,
                monthlyTotal: 304,
                accuracy: 87.3,
            },
            ranking: {
                position: 3,
                totalMembers: 12,
                percentile: 75,
            },
        };
    }

    // Get learning recommendations
    getLearningRecommendations(userId: string): {
        recommendedCourses: {
            title: string;
            description: string;
            duration: string;
            difficulty: 'beginner' | 'intermediate' | 'advanced';
            relevance: number;
        }[];
        skillGaps: {
            skill: string;
            currentLevel: number;
            targetLevel: number;
            priority: 'high' | 'medium' | 'low';
        }[];
        certifications: {
            name: string;
            provider: string;
            value: string;
            timeToComplete: string;
        }[];
    } {
        return {
            recommendedCourses: [
                {
                    title: 'Advanced Pharmaceutical Data Management',
                    description:
                        'Learn advanced techniques for managing complex pharmaceutical data',
                    duration: '6 weeks',
                    difficulty: 'advanced',
                    relevance: 95,
                },
                {
                    title: 'Quality Assurance in Healthcare Data',
                    description: 'Master quality control processes for healthcare databases',
                    duration: '4 weeks',
                    difficulty: 'intermediate',
                    relevance: 88,
                },
                {
                    title: 'Medical Device Classification',
                    description: 'Comprehensive guide to medical device categorization',
                    duration: '3 weeks',
                    difficulty: 'intermediate',
                    relevance: 75,
                },
            ],
            skillGaps: [
                {
                    skill: 'Category Management',
                    currentLevel: 6,
                    targetLevel: 8,
                    priority: 'high',
                },
                {
                    skill: 'Quality Control',
                    currentLevel: 7,
                    targetLevel: 9,
                    priority: 'medium',
                },
                {
                    skill: 'Data Analysis',
                    currentLevel: 5,
                    targetLevel: 7,
                    priority: 'medium',
                },
            ],
            certifications: [
                {
                    name: 'Certified Healthcare Data Specialist',
                    provider: 'Healthcare Data Institute',
                    value: 'Industry recognition and salary increase',
                    timeToComplete: '3-4 months',
                },
                {
                    name: 'Pharmaceutical Data Management Certificate',
                    provider: 'Pharma Education Council',
                    value: 'Specialized expertise in pharmaceutical data',
                    timeToComplete: '2-3 months',
                },
            ],
        };
    }
}

export const databaseInputAnalyticsService = new DatabaseInputAnalyticsService();
