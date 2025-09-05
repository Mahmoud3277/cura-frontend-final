// Enhanced Payout Scheduling Service - Comprehensive alert and tracking system

export interface PayoutAlert {
    id: string;
    entityId: string;
    entityName: string;
    entityType: 'pharmacy' | 'vendor' | 'doctor';
    alertType:
        | 'collection_due'
        | 'collection_overdue'
        | 'payout_due'
        | 'payout_overdue'
        | 'amount_threshold';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    amount: number;
    dueDate: string;
    daysPastDue?: number;
    isRead: boolean;
    isResolved: boolean;
    createdAt: string;
    resolvedAt?: string;
    metadata?: Record<string, any>;
}

export interface EnhancedPayoutSchedule {
    id: string;
    entityId: string;
    entityName: string;
    entityType: 'pharmacy' | 'vendor' | 'doctor';
    scheduleType: 'collection' | 'payout'; // Collection from pharmacy/vendor, Payout to doctor
    frequency: 'weekly' | 'biweekly' | 'monthly';
    nextDueDate: string;
    lastProcessedDate?: string;
    pendingAmount: number;
    totalAmount: number;
    status: 'active' | 'paused' | 'overdue' | 'cancelled';
    alertSettings: {
        enableAlerts: boolean;
        alertDaysBefore: number; // Alert X days before due date
        enableOverdueAlerts: boolean;
        escalationDays: number; // Escalate after X days overdue
    };
    paymentMethod: 'cash' | 'bank_transfer' | 'mobile_wallet' | 'check';
    minimumAmount: number;
    autoProcess: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    // Tracking fields
    totalCollected?: number; // For pharmacy/vendor collections
    totalPaid?: number; // For doctor payouts
    successfulTransactions: number;
    failedTransactions: number;
    averageProcessingTime: number; // in hours
    lastFailureReason?: string;
}

export interface PayoutTransaction {
    id: string;
    scheduleId: string;
    entityId: string;
    entityName: string;
    entityType: 'pharmacy' | 'vendor' | 'doctor';
    transactionType: 'collection' | 'payout';
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    scheduledDate: string;
    processedDate?: string;
    confirmedDate?: string;
    paymentMethod: string;
    reference: string;
    notes?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
}

export interface PayoutDashboardMetrics {
    totalActiveSchedules: number;
    overdueCollections: number;
    overduePayouts: number;
    totalPendingCollections: number;
    totalPendingPayouts: number;
    alertsCount: {
        total: number;
        unread: number;
        critical: number;
        high: number;
    };
    upcomingDue: {
        today: number;
        thisWeek: number;
        nextWeek: number;
    };
    performance: {
        onTimeRate: number;
        averageDelayDays: number;
        successRate: number;
    };
}

class PayoutSchedulingService {
    private mockSchedules: EnhancedPayoutSchedule[] = [];
    private mockAlerts: PayoutAlert[] = [];
    private mockTransactions: PayoutTransaction[] = [];

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        this.mockSchedules = this.generateMockSchedules();
        this.mockAlerts = this.generateMockAlerts();
        this.mockTransactions = this.generateMockTransactions();
    }

    private generateMockSchedules(): EnhancedPayoutSchedule[] {
        const now = Date.now();
        return [
            // Pharmacy Collection Schedules
            {
                id: 'SCHED-PCOL-001',
                entityId: 'pharmacy-0',
                entityName: 'HealthPlus Pharmacy',
                entityType: 'pharmacy',
                scheduleType: 'collection',
                frequency: 'weekly',
                nextDueDate: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(), // Due in 2 days
                lastProcessedDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 1234.5,
                totalAmount: 4567.8,
                status: 'active',
                alertSettings: {
                    enableAlerts: true,
                    alertDaysBefore: 1,
                    enableOverdueAlerts: true,
                    escalationDays: 3,
                },
                paymentMethod: 'cash',
                minimumAmount: 500,
                autoProcess: false,
                createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                totalCollected: 3333.3,
                successfulTransactions: 4,
                failedTransactions: 0,
                averageProcessingTime: 2.5,
            },
            {
                id: 'SCHED-PCOL-002',
                entityId: 'pharmacy-1',
                entityName: 'MediCare Pharmacy',
                entityType: 'pharmacy',
                scheduleType: 'collection',
                frequency: 'biweekly',
                nextDueDate: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // Overdue by 1 day
                lastProcessedDate: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 2156.8,
                totalAmount: 5431.2,
                status: 'overdue',
                alertSettings: {
                    enableAlerts: true,
                    alertDaysBefore: 2,
                    enableOverdueAlerts: true,
                    escalationDays: 5,
                },
                paymentMethod: 'bank_transfer',
                minimumAmount: 1000,
                autoProcess: false,
                createdAt: new Date(now - 45 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                totalCollected: 3274.4,
                successfulTransactions: 3,
                failedTransactions: 1,
                averageProcessingTime: 4.2,
                lastFailureReason: 'Bank transfer failed - insufficient account details',
            },
            // Vendor Collection Schedules
            {
                id: 'SCHED-VCOL-001',
                entityId: 'vendor-0',
                entityName: 'HealthTech Supplies',
                entityType: 'vendor',
                scheduleType: 'collection',
                frequency: 'biweekly',
                nextDueDate: new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString(),
                lastProcessedDate: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 2890.5,
                totalAmount: 11835,
                status: 'active',
                alertSettings: {
                    enableAlerts: true,
                    alertDaysBefore: 2,
                    enableOverdueAlerts: true,
                    escalationDays: 7,
                },
                paymentMethod: 'bank_transfer',
                minimumAmount: 2000,
                autoProcess: false,
                createdAt: new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                totalCollected: 8944.5,
                successfulTransactions: 5,
                failedTransactions: 0,
                averageProcessingTime: 3.8,
            },
            // Doctor Payout Schedules
            {
                id: 'SCHED-DPAY-001',
                entityId: 'doctor-0',
                entityName: 'Dr. Ahmed Hassan',
                entityType: 'doctor',
                scheduleType: 'payout',
                frequency: 'monthly',
                nextDueDate: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
                lastProcessedDate: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 567.8,
                totalAmount: 1234.5,
                status: 'active',
                alertSettings: {
                    enableAlerts: true,
                    alertDaysBefore: 3,
                    enableOverdueAlerts: true,
                    escalationDays: 2,
                },
                paymentMethod: 'mobile_wallet',
                minimumAmount: 200,
                autoProcess: false,
                createdAt: new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
                totalPaid: 666.7,
                successfulTransactions: 3,
                failedTransactions: 0,
                averageProcessingTime: 1.2,
            },
            {
                id: 'SCHED-DPAY-002',
                entityId: 'doctor-1',
                entityName: 'Dr. Sarah Mohamed',
                entityType: 'doctor',
                scheduleType: 'payout',
                frequency: 'monthly',
                nextDueDate: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // Overdue by 3 days
                lastProcessedDate: new Date(now - 33 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 432.1,
                totalAmount: 987.6,
                status: 'overdue',
                alertSettings: {
                    enableAlerts: true,
                    alertDaysBefore: 2,
                    enableOverdueAlerts: true,
                    escalationDays: 1,
                },
                paymentMethod: 'bank_transfer',
                minimumAmount: 200,
                autoProcess: false,
                createdAt: new Date(now - 75 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                totalPaid: 555.5,
                successfulTransactions: 2,
                failedTransactions: 1,
                averageProcessingTime: 2.1,
                lastFailureReason: 'Doctor bank account temporarily frozen',
            },
        ];
    }

    private generateMockAlerts(): PayoutAlert[] {
        const now = Date.now();
        return [
            {
                id: 'ALERT-001',
                entityId: 'pharmacy-1',
                entityName: 'MediCare Pharmacy',
                entityType: 'pharmacy',
                alertType: 'collection_overdue',
                severity: 'high',
                title: 'Commission Collection Overdue',
                message:
                    'Commission collection from MediCare Pharmacy is 1 day overdue. Amount: EGP 2,156.8',
                amount: 2156.8,
                dueDate: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                daysPastDue: 1,
                isRead: false,
                isResolved: false,
                createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                metadata: {
                    scheduleId: 'SCHED-PCOL-002',
                    paymentMethod: 'bank_transfer',
                    lastAttempt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                },
            },
            {
                id: 'ALERT-002',
                entityId: 'doctor-1',
                entityName: 'Dr. Sarah Mohamed',
                entityType: 'doctor',
                alertType: 'payout_overdue',
                severity: 'critical',
                title: 'Doctor Payout Overdue',
                message:
                    'Commission payout to Dr. Sarah Mohamed is 3 days overdue. Amount: EGP 432.1',
                amount: 432.1,
                dueDate: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                daysPastDue: 3,
                isRead: false,
                isResolved: false,
                createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                metadata: {
                    scheduleId: 'SCHED-DPAY-002',
                    paymentMethod: 'bank_transfer',
                    escalated: true,
                },
            },
            {
                id: 'ALERT-003',
                entityId: 'pharmacy-0',
                entityName: 'HealthPlus Pharmacy',
                entityType: 'pharmacy',
                alertType: 'collection_due',
                severity: 'medium',
                title: 'Commission Collection Due Tomorrow',
                message:
                    'Commission collection from HealthPlus Pharmacy is due tomorrow. Amount: EGP 1,234.5',
                amount: 1234.5,
                dueDate: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
                isRead: false,
                isResolved: false,
                createdAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
                metadata: {
                    scheduleId: 'SCHED-PCOL-001',
                    paymentMethod: 'cash',
                },
            },
            {
                id: 'ALERT-004',
                entityId: 'vendor-0',
                entityName: 'HealthTech Supplies',
                entityType: 'vendor',
                alertType: 'amount_threshold',
                severity: 'medium',
                title: 'High Commission Amount Pending',
                message:
                    'HealthTech Supplies has accumulated EGP 2,890.5 in pending commission. Consider early collection.',
                amount: 2890.5,
                dueDate: new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString(),
                isRead: true,
                isResolved: false,
                createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                metadata: {
                    scheduleId: 'SCHED-VCOL-001',
                    threshold: 2500,
                    currentAmount: 2890.5,
                },
            },
            {
                id: 'ALERT-005',
                entityId: 'doctor-0',
                entityName: 'Dr. Ahmed Hassan',
                entityType: 'doctor',
                alertType: 'payout_due',
                severity: 'low',
                title: 'Doctor Payout Due in 3 Days',
                message:
                    'Commission payout to Dr. Ahmed Hassan is due in 3 days. Amount: EGP 567.8',
                amount: 567.8,
                dueDate: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
                isRead: true,
                isResolved: false,
                createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
                metadata: {
                    scheduleId: 'SCHED-DPAY-001',
                    paymentMethod: 'mobile_wallet',
                },
            },
        ];
    }

    private generateMockTransactions(): PayoutTransaction[] {
        const now = Date.now();
        return [
            {
                id: 'PTXN-001',
                scheduleId: 'SCHED-PCOL-001',
                entityId: 'pharmacy-0',
                entityName: 'HealthPlus Pharmacy',
                entityType: 'pharmacy',
                transactionType: 'collection',
                amount: 1100.0,
                status: 'completed',
                scheduledDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
                processedDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
                confirmedDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'cash',
                reference: 'COL-PHARM-001-20241201',
                notes: 'Collected in person during routine visit',
                createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'PTXN-002',
                scheduleId: 'SCHED-DPAY-001',
                entityId: 'doctor-0',
                entityName: 'Dr. Ahmed Hassan',
                entityType: 'doctor',
                transactionType: 'payout',
                amount: 234.5,
                status: 'completed',
                scheduledDate: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
                processedDate: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
                confirmedDate: new Date(now - 29 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'mobile_wallet',
                reference: 'PAY-DOC-001-20241101',
                notes: 'Monthly commission payout for referrals',
                createdAt: new Date(now - 31 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 29 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'PTXN-003',
                scheduleId: 'SCHED-PCOL-002',
                entityId: 'pharmacy-1',
                entityName: 'MediCare Pharmacy',
                entityType: 'pharmacy',
                transactionType: 'collection',
                amount: 1800.0,
                status: 'failed',
                scheduledDate: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                processedDate: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'bank_transfer',
                reference: 'COL-PHARM-002-20241207',
                failureReason: 'Bank transfer failed - insufficient account details',
                notes: 'Need to update pharmacy bank account information',
                createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    // Public methods for managing schedules
    getPayoutSchedules(filters?: {
        entityType?: 'pharmacy' | 'vendor' | 'doctor';
        scheduleType?: 'collection' | 'payout';
        status?: string;
    }): EnhancedPayoutSchedule[] {
        let schedules = [...this.mockSchedules];

        if (filters?.entityType) {
            schedules = schedules.filter((s) => s.entityType === filters.entityType);
        }
        if (filters?.scheduleType) {
            schedules = schedules.filter((s) => s.scheduleType === filters.scheduleType);
        }
        if (filters?.status) {
            schedules = schedules.filter((s) => s.status === filters.status);
        }

        return schedules.sort(
            (a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime(),
        );
    }

    getPayoutAlerts(filters?: {
        entityType?: 'pharmacy' | 'vendor' | 'doctor';
        severity?: string;
        isRead?: boolean;
        isResolved?: boolean;
    }): PayoutAlert[] {
        let alerts = [...this.mockAlerts];

        if (filters?.entityType) {
            alerts = alerts.filter((a) => a.entityType === filters.entityType);
        }
        if (filters?.severity) {
            alerts = alerts.filter((a) => a.severity === filters.severity);
        }
        if (filters?.isRead !== undefined) {
            alerts = alerts.filter((a) => a.isRead === filters.isRead);
        }
        if (filters?.isResolved !== undefined) {
            alerts = alerts.filter((a) => a.isResolved === filters.isResolved);
        }

        return alerts.sort((a, b) => {
            // Sort by severity first, then by creation date
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
            if (severityDiff !== 0) return severityDiff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    getPayoutTransactions(scheduleId?: string): PayoutTransaction[] {
        let transactions = [...this.mockTransactions];

        if (scheduleId) {
            transactions = transactions.filter((t) => t.scheduleId === scheduleId);
        }

        return transactions.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    getDashboardMetrics(): PayoutDashboardMetrics {
        const now = Date.now();
        const today = new Date(now);
        const thisWeekEnd = new Date(now + 7 * 24 * 60 * 60 * 1000);
        const nextWeekEnd = new Date(now + 14 * 24 * 60 * 60 * 1000);

        const activeSchedules = this.mockSchedules.filter((s) => s.status === 'active').length;
        const overdueCollections = this.mockSchedules.filter(
            (s) => s.scheduleType === 'collection' && s.status === 'overdue',
        ).length;
        const overduePayouts = this.mockSchedules.filter(
            (s) => s.scheduleType === 'payout' && s.status === 'overdue',
        ).length;

        const totalPendingCollections = this.mockSchedules
            .filter((s) => s.scheduleType === 'collection')
            .reduce((sum, s) => sum + s.pendingAmount, 0);

        const totalPendingPayouts = this.mockSchedules
            .filter((s) => s.scheduleType === 'payout')
            .reduce((sum, s) => sum + s.pendingAmount, 0);

        const alerts = this.mockAlerts;
        const unreadAlerts = alerts.filter((a) => !a.isRead);
        const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
        const highAlerts = alerts.filter((a) => a.severity === 'high');

        const dueTodayCount = this.mockSchedules.filter((s) => {
            const dueDate = new Date(s.nextDueDate);
            return dueDate.toDateString() === today.toDateString();
        }).length;

        const dueThisWeekCount = this.mockSchedules.filter((s) => {
            const dueDate = new Date(s.nextDueDate);
            return dueDate >= today && dueDate <= thisWeekEnd;
        }).length;

        const dueNextWeekCount = this.mockSchedules.filter((s) => {
            const dueDate = new Date(s.nextDueDate);
            return dueDate > thisWeekEnd && dueDate <= nextWeekEnd;
        }).length;

        // Calculate performance metrics
        const completedTransactions = this.mockTransactions.filter((t) => t.status === 'completed');
        const failedTransactions = this.mockTransactions.filter((t) => t.status === 'failed');
        const totalTransactions = this.mockTransactions.length;

        const successRate =
            totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 100;

        // Calculate on-time rate and average delay
        const overdueSchedules = this.mockSchedules.filter((s) => s.status === 'overdue');
        const onTimeRate =
            this.mockSchedules.length > 0
                ? ((this.mockSchedules.length - overdueSchedules.length) /
                      this.mockSchedules.length) *
                  100
                : 100;

        const averageDelayDays =
            overdueSchedules.length > 0
                ? overdueSchedules.reduce((sum, s) => {
                      const daysPastDue = Math.floor(
                          (now - new Date(s.nextDueDate).getTime()) / (24 * 60 * 60 * 1000),
                      );
                      return sum + daysPastDue;
                  }, 0) / overdueSchedules.length
                : 0;

        return {
            totalActiveSchedules: activeSchedules,
            overdueCollections,
            overduePayouts,
            totalPendingCollections,
            totalPendingPayouts,
            alertsCount: {
                total: alerts.length,
                unread: unreadAlerts.length,
                critical: criticalAlerts.length,
                high: highAlerts.length,
            },
            upcomingDue: {
                today: dueTodayCount,
                thisWeek: dueThisWeekCount,
                nextWeek: dueNextWeekCount,
            },
            performance: {
                onTimeRate,
                averageDelayDays,
                successRate,
            },
        };
    }

    // Schedule management methods
    async createPayoutSchedule(scheduleData: Partial<EnhancedPayoutSchedule>): Promise<string> {
        const newSchedule: EnhancedPayoutSchedule = {
            id: `SCHED-${Date.now()}`,
            entityId: scheduleData.entityId || '',
            entityName: scheduleData.entityName || '',
            entityType: scheduleData.entityType || 'pharmacy',
            scheduleType: scheduleData.scheduleType || 'collection',
            frequency: scheduleData.frequency || 'monthly',
            nextDueDate:
                scheduleData.nextDueDate ||
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            pendingAmount: scheduleData.pendingAmount || 0,
            totalAmount: scheduleData.totalAmount || 0,
            status: 'active',
            alertSettings: scheduleData.alertSettings || {
                enableAlerts: true,
                alertDaysBefore: 2,
                enableOverdueAlerts: true,
                escalationDays: 3,
            },
            paymentMethod: scheduleData.paymentMethod || 'bank_transfer',
            minimumAmount: scheduleData.minimumAmount || 100,
            autoProcess: scheduleData.autoProcess || false,
            notes: scheduleData.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalCollected: scheduleData.scheduleType === 'collection' ? 0 : undefined,
            totalPaid: scheduleData.scheduleType === 'payout' ? 0 : undefined,
            successfulTransactions: 0,
            failedTransactions: 0,
            averageProcessingTime: 0,
        };

        this.mockSchedules.push(newSchedule);
        return newSchedule.id;
    }

    async updatePayoutSchedule(
        scheduleId: string,
        updates: Partial<EnhancedPayoutSchedule>,
    ): Promise<boolean> {
        const scheduleIndex = this.mockSchedules.findIndex((s) => s.id === scheduleId);
        if (scheduleIndex === -1) return false;

        this.mockSchedules[scheduleIndex] = {
            ...this.mockSchedules[scheduleIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        return true;
    }

    async processPayoutTransaction(scheduleId: string, notes?: string): Promise<boolean> {
        const schedule = this.mockSchedules.find((s) => s.id === scheduleId);
        if (!schedule || schedule.pendingAmount <= 0) return false;

        const transaction: PayoutTransaction = {
            id: `PTXN-${Date.now()}`,
            scheduleId,
            entityId: schedule.entityId,
            entityName: schedule.entityName,
            entityType: schedule.entityType,
            transactionType: schedule.scheduleType,
            amount: schedule.pendingAmount,
            status: 'processing',
            scheduledDate: schedule.nextDueDate,
            paymentMethod: schedule.paymentMethod,
            reference: `${schedule.scheduleType.toUpperCase()}-${schedule.entityType.toUpperCase()}-${Date.now()}`,
            notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.mockTransactions.unshift(transaction);

        // Simulate processing delay
        setTimeout(() => {
            transaction.status = 'completed';
            transaction.processedDate = new Date().toISOString();
            transaction.confirmedDate = new Date().toISOString();
            transaction.updatedAt = new Date().toISOString();

            // Update schedule
            if (schedule.scheduleType === 'collection') {
                schedule.totalCollected = (schedule.totalCollected || 0) + schedule.pendingAmount;
            } else {
                schedule.totalPaid = (schedule.totalPaid || 0) + schedule.pendingAmount;
            }

            schedule.pendingAmount = 0;
            schedule.lastProcessedDate = new Date().toISOString();
            schedule.successfulTransactions += 1;
            schedule.status = 'active';

            // Calculate next due date
            const nextDue = new Date(schedule.nextDueDate);
            switch (schedule.frequency) {
                case 'weekly':
                    nextDue.setDate(nextDue.getDate() + 7);
                    break;
                case 'biweekly':
                    nextDue.setDate(nextDue.getDate() + 14);
                    break;
                case 'monthly':
                    nextDue.setMonth(nextDue.getMonth() + 1);
                    break;
            }
            schedule.nextDueDate = nextDue.toISOString();
            schedule.updatedAt = new Date().toISOString();

            // Resolve related alerts
            this.resolveAlertsForEntity(schedule.entityId);
        }, 2000);

        return true;
    }

    async markAlertAsRead(alertId: string): Promise<boolean> {
        const alert = this.mockAlerts.find((a) => a.id === alertId);
        if (!alert) return false;

        alert.isRead = true;
        return true;
    }

    async resolveAlert(alertId: string): Promise<boolean> {
        const alert = this.mockAlerts.find((a) => a.id === alertId);
        if (!alert) return false;

        alert.isResolved = true;
        alert.resolvedAt = new Date().toISOString();
        return true;
    }

    private resolveAlertsForEntity(entityId: string): void {
        this.mockAlerts
            .filter((a) => a.entityId === entityId && !a.isResolved)
            .forEach((alert) => {
                alert.isResolved = true;
                alert.resolvedAt = new Date().toISOString();
            });
    }

    // Analytics and reporting
    getScheduleAnalytics(timeframe: string = '30d') {
        const now = Date.now();
        const timeframeDays = parseInt(timeframe.replace('d', ''));
        const startDate = new Date(now - timeframeDays * 24 * 60 * 60 * 1000);

        const recentTransactions = this.mockTransactions.filter(
            (t) => new Date(t.createdAt) >= startDate,
        );

        const collectionTransactions = recentTransactions.filter(
            (t) => t.transactionType === 'collection',
        );
        const payoutTransactions = recentTransactions.filter((t) => t.transactionType === 'payout');

        const totalCollected = collectionTransactions
            .filter((t) => t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalPaid = payoutTransactions
            .filter((t) => t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            timeframe,
            totalTransactions: recentTransactions.length,
            totalCollected,
            totalPaid,
            netCashFlow: totalCollected - totalPaid,
            collectionSuccess:
                collectionTransactions.length > 0
                    ? (collectionTransactions.filter((t) => t.status === 'completed').length /
                          collectionTransactions.length) *
                      100
                    : 100,
            payoutSuccess:
                payoutTransactions.length > 0
                    ? (payoutTransactions.filter((t) => t.status === 'completed').length /
                          payoutTransactions.length) *
                      100
                    : 100,
            averageCollectionAmount:
                collectionTransactions.length > 0
                    ? totalCollected /
                      collectionTransactions.filter((t) => t.status === 'completed').length
                    : 0,
            averagePayoutAmount:
                payoutTransactions.length > 0
                    ? totalPaid / payoutTransactions.filter((t) => t.status === 'completed').length
                    : 0,
        };
    }

    // Utility methods
    calculateNextDueDate(frequency: string, lastDate: string): string {
        const date = new Date(lastDate);
        switch (frequency) {
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'biweekly':
                date.setDate(date.getDate() + 14);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
        }
        return date.toISOString();
    }

    getDaysUntilDue(dueDate: string): number {
        const now = new Date();
        const due = new Date(dueDate);
        return Math.ceil((due.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    }

    getDaysPastDue(dueDate: string): number {
        const now = new Date();
        const due = new Date(dueDate);
        const daysPast = Math.floor((now.getTime() - due.getTime()) / (24 * 60 * 60 * 1000));
        return daysPast > 0 ? daysPast : 0;
    }
}

export const payoutSchedulingService = new PayoutSchedulingService();
