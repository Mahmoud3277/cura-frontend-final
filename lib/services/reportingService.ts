// Comprehensive Reporting Service for CURA Platform
import { realTimeAnalyticsService } from './realTimeAnalyticsService';

export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    category: 'financial' | 'operational' | 'performance' | 'compliance' | 'custom';
    type: 'summary' | 'detailed' | 'comparison' | 'trend';
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    parameters: ReportParameter[];
    lastGenerated?: string;
    isActive: boolean;
}

export interface ReportParameter {
    id: string;
    name: string;
    type: 'date' | 'dateRange' | 'select' | 'multiSelect' | 'number' | 'text';
    required: boolean;
    defaultValue?: any;
    options?: { label: string; value: any }[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
}

export interface GeneratedReport {
    id: string;
    templateId: string;
    name: string;
    generatedAt: string;
    generatedBy: string;
    parameters: Record<string, any>;
    status: 'generating' | 'completed' | 'failed' | 'expired';
    format: 'pdf' | 'excel' | 'csv' | 'json';
    size: string;
    downloadUrl?: string;
    expiresAt: string;
    data?: any;
}

export interface ReportSchedule {
    id: string;
    templateId: string;
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string; // HH:MM format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    recipients: string[];
    format: 'pdf' | 'excel' | 'csv';
    isActive: boolean;
    lastRun?: string;
    nextRun: string;
}

export interface ReportAnalytics {
    totalReports: number;
    reportsThisMonth: number;
    mostUsedTemplates: {
        templateId: string;
        name: string;
        usage: number;
    }[];
    reportsByCategory: Record<string, number>;
    reportsByFormat: Record<string, number>;
    averageGenerationTime: number;
    scheduledReports: number;
    activeSchedules: number;
}

class ReportingService {
    private templates: ReportTemplate[] = [];
    private generatedReports: GeneratedReport[] = [];
    private schedules: ReportSchedule[] = [];

    constructor() {
        this.initializeTemplates();
        this.initializeMockReports();
        this.initializeMockSchedules();
    }

    // Initialize predefined report templates
    private initializeTemplates(): void {
        this.templates = [
            // Financial Reports
            {
                id: 'revenue-summary',
                name: 'Revenue Summary Report',
                description:
                    'Comprehensive revenue analysis with breakdowns by category, pharmacy, and commission',
                category: 'financial',
                type: 'summary',
                frequency: 'monthly',
                isActive: true,
                parameters: [
                    {
                        id: 'dateRange',
                        name: 'Date Range',
                        type: 'dateRange',
                        required: true,
                        defaultValue: { start: '2024-01-01', end: '2024-01-31' },
                    },
                    {
                        id: 'includeCommissions',
                        name: 'Include Commission Details',
                        type: 'select',
                        required: false,
                        defaultValue: 'yes',
                        options: [
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ],
                    },
                ],
            },
            {
                id: 'commission-breakdown',
                name: 'Commission Breakdown Report',
                description: 'Detailed commission analysis for pharmacies and doctors',
                category: 'financial',
                type: 'detailed',
                frequency: 'monthly',
                isActive: true,
                parameters: [
                    {
                        id: 'dateRange',
                        name: 'Date Range',
                        type: 'dateRange',
                        required: true,
                    },
                    {
                        id: 'userType',
                        name: 'User Type',
                        type: 'select',
                        required: false,
                        defaultValue: 'all',
                        options: [
                            { label: 'All', value: 'all' },
                            { label: 'Pharmacies', value: 'pharmacy' },
                            { label: 'Doctors', value: 'doctor' },
                        ],
                    },
                ],
            },
            // Operational Reports
            {
                id: 'order-performance',
                name: 'Order Performance Report',
                description:
                    'Analysis of order volumes, completion rates, and delivery performance',
                category: 'operational',
                type: 'detailed',
                frequency: 'weekly',
                isActive: true,
                parameters: [
                    {
                        id: 'dateRange',
                        name: 'Date Range',
                        type: 'dateRange',
                        required: true,
                    },
                    {
                        id: 'city',
                        name: 'City Filter',
                        type: 'multiSelect',
                        required: false,
                        options: [
                            { label: 'Cairo', value: 'cairo' },
                            { label: 'Alexandria', value: 'alexandria' },
                            { label: 'Giza', value: 'giza' },
                            { label: 'Ismailia', value: 'ismailia' },
                        ],
                    },
                ],
            },
            {
                id: 'prescription-analytics',
                name: 'Prescription Processing Report',
                description:
                    'Analysis of prescription processing times, accuracy, and reader performance',
                category: 'operational',
                type: 'detailed',
                frequency: 'weekly',
                isActive: true,
                parameters: [
                    {
                        id: 'dateRange',
                        name: 'Date Range',
                        type: 'dateRange',
                        required: true,
                    },
                    {
                        id: 'urgencyLevel',
                        name: 'Urgency Level',
                        type: 'select',
                        required: false,
                        defaultValue: 'all',
                        options: [
                            { label: 'All', value: 'all' },
                            { label: 'Low', value: 'low' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'High', value: 'high' },
                            { label: 'Urgent', value: 'urgent' },
                        ],
                    },
                ],
            },
            // Performance Reports
            {
                id: 'pharmacy-performance',
                name: 'Pharmacy Performance Report',
                description: 'Comprehensive pharmacy performance metrics and rankings',
                category: 'performance',
                type: 'comparison',
                frequency: 'monthly',
                isActive: true,
                parameters: [
                    {
                        id: 'dateRange',
                        name: 'Date Range',
                        type: 'dateRange',
                        required: true,
                    },
                    {
                        id: 'minOrders',
                        name: 'Minimum Orders',
                        type: 'number',
                        required: false,
                        defaultValue: 10,
                        validation: { min: 1, max: 1000 },
                    },
                ],
            },
            {
                id: 'user-engagement',
                name: 'User Engagement Report',
                description: 'User activity, retention, and engagement metrics',
                category: 'performance',
                type: 'trend',
                frequency: 'monthly',
                isActive: true,
                parameters: [
                    {
                        id: 'dateRange',
                        name: 'Date Range',
                        type: 'dateRange',
                        required: true,
                    },
                    {
                        id: 'userType',
                        name: 'User Type',
                        type: 'multiSelect',
                        required: false,
                        options: [
                            { label: 'Customers', value: 'customer' },
                            { label: 'Pharmacies', value: 'pharmacy' },
                            { label: 'Doctors', value: 'doctor' },
                            { label: 'Vendors', value: 'vendor' },
                        ],
                    },
                ],
            },
            // Compliance Reports
            {
                id: 'regulatory-compliance',
                name: 'Regulatory Compliance Report',
                description:
                    'Compliance tracking for prescriptions, pharmacy licenses, and regulations',
                category: 'compliance',
                type: 'summary',
                frequency: 'monthly',
                isActive: true,
                parameters: [
                    {
                        id: 'dateRange',
                        name: 'Date Range',
                        type: 'dateRange',
                        required: true,
                    },
                    {
                        id: 'complianceType',
                        name: 'Compliance Type',
                        type: 'select',
                        required: false,
                        defaultValue: 'all',
                        options: [
                            { label: 'All', value: 'all' },
                            { label: 'Prescription Validation', value: 'prescription' },
                            { label: 'Pharmacy Licensing', value: 'licensing' },
                            { label: 'Data Privacy', value: 'privacy' },
                        ],
                    },
                ],
            },
        ];
    }

    // Initialize mock generated reports
    private initializeMockReports(): void {
        const now = new Date();
        this.generatedReports = [
            {
                id: 'report-001',
                templateId: 'revenue-summary',
                name: 'Revenue Summary - January 2024',
                generatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                generatedBy: 'admin@cura.com',
                parameters: { dateRange: { start: '2024-01-01', end: '2024-01-31' } },
                status: 'completed',
                format: 'pdf',
                size: '2.4 MB',
                downloadUrl: '/reports/revenue-summary-jan-2024.pdf',
                expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'report-002',
                templateId: 'order-performance',
                name: 'Order Performance - Week 3',
                generatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                generatedBy: 'admin@cura.com',
                parameters: { dateRange: { start: '2024-01-15', end: '2024-01-21' } },
                status: 'completed',
                format: 'excel',
                size: '1.8 MB',
                downloadUrl: '/reports/order-performance-week3.xlsx',
                expiresAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'report-003',
                templateId: 'pharmacy-performance',
                name: 'Pharmacy Performance - Q4 2023',
                generatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                generatedBy: 'admin@cura.com',
                parameters: { dateRange: { start: '2023-10-01', end: '2023-12-31' } },
                status: 'completed',
                format: 'pdf',
                size: '3.2 MB',
                downloadUrl: '/reports/pharmacy-performance-q4-2023.pdf',
                expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'report-004',
                templateId: 'prescription-analytics',
                name: 'Prescription Analytics - January 2024',
                generatedAt: now.toISOString(),
                generatedBy: 'admin@cura.com',
                parameters: { dateRange: { start: '2024-01-01', end: '2024-01-31' } },
                status: 'generating',
                format: 'csv',
                size: 'Calculating...',
                expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    // Initialize mock schedules
    private initializeMockSchedules(): void {
        const now = new Date();
        this.schedules = [
            {
                id: 'schedule-001',
                templateId: 'revenue-summary',
                name: 'Monthly Revenue Report',
                frequency: 'monthly',
                time: '09:00',
                dayOfMonth: 1,
                recipients: ['admin@cura.com', 'finance@cura.com'],
                format: 'pdf',
                isActive: true,
                lastRun: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                nextRun: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'schedule-002',
                templateId: 'order-performance',
                name: 'Weekly Order Report',
                frequency: 'weekly',
                time: '08:00',
                dayOfWeek: 1, // Monday
                recipients: ['admin@cura.com', 'operations@cura.com'],
                format: 'excel',
                isActive: true,
                lastRun: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                nextRun: new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'schedule-003',
                templateId: 'regulatory-compliance',
                name: 'Monthly Compliance Report',
                frequency: 'monthly',
                time: '10:00',
                dayOfMonth: 5,
                recipients: ['admin@cura.com', 'compliance@cura.com'],
                format: 'pdf',
                isActive: false,
                lastRun: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
                nextRun: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    // Get all report templates
    getTemplates(category?: string): ReportTemplate[] {
        if (category) {
            return this.templates.filter((template) => template.category === category);
        }
        return this.templates;
    }

    // Get template by ID
    getTemplate(id: string): ReportTemplate | undefined {
        return this.templates.find((template) => template.id === id);
    }

    // Get generated reports
    getGeneratedReports(templateId?: string): GeneratedReport[] {
        if (templateId) {
            return this.generatedReports.filter((report) => report.templateId === templateId);
        }
        return this.generatedReports.sort(
            (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
        );
    }

    // Generate a new report
    async generateReport(
        templateId: string,
        parameters: Record<string, any>,
        format: 'pdf' | 'excel' | 'csv' = 'pdf',
    ): Promise<GeneratedReport> {
        const template = this.getTemplate(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        const reportId = `report-${Date.now()}`;
        const now = new Date();

        const newReport: GeneratedReport = {
            id: reportId,
            templateId,
            name: `${template.name} - ${now.toLocaleDateString()}`,
            generatedAt: now.toISOString(),
            generatedBy: 'admin@cura.com', // In real app, get from auth context
            parameters,
            status: 'generating',
            format,
            size: 'Calculating...',
            expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        this.generatedReports.unshift(newReport);

        // Simulate report generation
        setTimeout(() => {
            const report = this.generatedReports.find((r) => r.id === reportId);
            if (report) {
                report.status = 'completed';
                report.size = `${(Math.random() * 3 + 0.5).toFixed(1)} MB`;
                report.downloadUrl = `/reports/${reportId}.${format}`;

                // Generate mock data based on template
                report.data = this.generateMockReportData(templateId, parameters);
            }
        }, 3000); // 3 second delay

        return newReport;
    }

    // Generate mock report data
    private generateMockReportData(templateId: string, parameters: Record<string, any>): any {
        const analytics = realTimeAnalyticsService;

        switch (templateId) {
            case 'revenue-summary':
                return {
                    summary: analytics.getRevenueAnalytics(),
                    period: parameters.dateRange,
                    generatedAt: new Date().toISOString(),
                };

            case 'order-performance':
                return {
                    summary: analytics.getOrderAnalytics(),
                    period: parameters.dateRange,
                    generatedAt: new Date().toISOString(),
                };

            case 'pharmacy-performance':
                return {
                    summary: analytics.getPharmacyAnalytics(),
                    period: parameters.dateRange,
                    generatedAt: new Date().toISOString(),
                };

            default:
                return {
                    message: 'Report data generated successfully',
                    parameters,
                    generatedAt: new Date().toISOString(),
                };
        }
    }

    // Get report schedules
    getSchedules(): ReportSchedule[] {
        return this.schedules.sort(
            (a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime(),
        );
    }

    // Create new schedule
    createSchedule(schedule: Omit<ReportSchedule, 'id' | 'nextRun'>): ReportSchedule {
        const newSchedule: ReportSchedule = {
            ...schedule,
            id: `schedule-${Date.now()}`,
            nextRun: this.calculateNextRun(
                schedule.frequency,
                schedule.time,
                schedule.dayOfWeek,
                schedule.dayOfMonth,
            ),
        };

        this.schedules.push(newSchedule);
        return newSchedule;
    }

    // Update schedule
    updateSchedule(id: string, updates: Partial<ReportSchedule>): ReportSchedule | undefined {
        const scheduleIndex = this.schedules.findIndex((s) => s.id === id);
        if (scheduleIndex === -1) return undefined;

        this.schedules[scheduleIndex] = { ...this.schedules[scheduleIndex], ...updates };

        // Recalculate next run if frequency or time changed
        if (updates.frequency || updates.time || updates.dayOfWeek || updates.dayOfMonth) {
            const schedule = this.schedules[scheduleIndex];
            schedule.nextRun = this.calculateNextRun(
                schedule.frequency,
                schedule.time,
                schedule.dayOfWeek,
                schedule.dayOfMonth,
            );
        }

        return this.schedules[scheduleIndex];
    }

    // Delete schedule
    deleteSchedule(id: string): boolean {
        const initialLength = this.schedules.length;
        this.schedules = this.schedules.filter((s) => s.id !== id);
        return this.schedules.length < initialLength;
    }

    // Calculate next run time for schedule
    private calculateNextRun(
        frequency: string,
        time: string,
        dayOfWeek?: number,
        dayOfMonth?: number,
    ): string {
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);

        let nextRun = new Date();
        nextRun.setHours(hours, minutes, 0, 0);

        switch (frequency) {
            case 'daily':
                if (nextRun <= now) {
                    nextRun.setDate(nextRun.getDate() + 1);
                }
                break;

            case 'weekly':
                if (dayOfWeek !== undefined) {
                    const daysUntilTarget = (dayOfWeek - nextRun.getDay() + 7) % 7;
                    nextRun.setDate(nextRun.getDate() + daysUntilTarget);
                    if (nextRun <= now) {
                        nextRun.setDate(nextRun.getDate() + 7);
                    }
                }
                break;

            case 'monthly':
                if (dayOfMonth !== undefined) {
                    nextRun.setDate(dayOfMonth);
                    if (nextRun <= now) {
                        nextRun.setMonth(nextRun.getMonth() + 1);
                    }
                }
                break;

            case 'quarterly':
                nextRun.setMonth(Math.ceil((nextRun.getMonth() + 1) / 3) * 3);
                nextRun.setDate(1);
                if (nextRun <= now) {
                    nextRun.setMonth(nextRun.getMonth() + 3);
                }
                break;
        }

        return nextRun.toISOString();
    }

    // Get reporting analytics
    getReportingAnalytics(): ReportAnalytics {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const reportsThisMonth = this.generatedReports.filter(
            (report) => new Date(report.generatedAt) >= thisMonth,
        ).length;

        // Count template usage
        const templateUsage = this.generatedReports.reduce(
            (acc, report) => {
                acc[report.templateId] = (acc[report.templateId] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        const mostUsedTemplates = Object.entries(templateUsage)
            .map(([templateId, usage]) => ({
                templateId,
                name: this.getTemplate(templateId)?.name || 'Unknown',
                usage,
            }))
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 5);

        // Count by category
        const reportsByCategory = this.generatedReports.reduce(
            (acc, report) => {
                const template = this.getTemplate(report.templateId);
                if (template) {
                    acc[template.category] = (acc[template.category] || 0) + 1;
                }
                return acc;
            },
            {} as Record<string, number>,
        );

        // Count by format
        const reportsByFormat = this.generatedReports.reduce(
            (acc, report) => {
                acc[report.format] = (acc[report.format] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return {
            totalReports: this.generatedReports.length,
            reportsThisMonth,
            mostUsedTemplates,
            reportsByCategory,
            reportsByFormat,
            averageGenerationTime: 2.3, // Mock average in minutes
            scheduledReports: this.schedules.length,
            activeSchedules: this.schedules.filter((s) => s.isActive).length,
        };
    }

    // Export report data
    exportReport(reportId: string): Promise<Blob> {
        return new Promise((resolve) => {
            // Mock export functionality
            setTimeout(() => {
                const mockData = 'Report data would be here...';
                const blob = new Blob([mockData], { type: 'text/plain' });
                resolve(blob);
            }, 1000);
        });
    }

    // Delete generated report
    deleteReport(reportId: string): boolean {
        const initialLength = this.generatedReports.length;
        this.generatedReports = this.generatedReports.filter((r) => r.id !== reportId);
        return this.generatedReports.length < initialLength;
    }

    // Get report categories
    getCategories(): { value: string; label: string; count: number }[] {
        const categories = ['financial', 'operational', 'performance', 'compliance', 'custom'];
        return categories.map((category) => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1),
            count: this.templates.filter((t) => t.category === category).length,
        }));
    }
}

export const reportingService = new ReportingService();
