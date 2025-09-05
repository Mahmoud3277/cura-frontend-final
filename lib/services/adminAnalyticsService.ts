// Admin Analytics Service - Mock data for comprehensive KPIs
export interface AdminKPIs {
    users: {
        total: number;
        customers: number;
        pharmacies: number;
        doctors: number;
        vendors: number;
        prescriptionReaders: number;
        databaseInputUsers: number;
        growth: number;
        newThisMonth: number;
    };
    orders: {
        total: number;
        pending: number;
        processing: number;
        completed: number;
        cancelled: number;
        totalValue: number;
        averageOrderValue: number;
        growth: number;
    };
    prescriptions: {
        total: number;
        pending: number;
        processing: number;
        completed: number;
        rejected: number;
        averageProcessingTime: number;
        growth: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        growth: number;
        commissionEarned: number;
        averageCommission: number;
    };
    cities: {
        enabled: number;
        total: number;
        activePharmacies: number;
        coverage: number;
    };
    system: {
        serverStatus: 'online' | 'offline' | 'maintenance';
        databaseStatus: 'connected' | 'disconnected' | 'slow';
        paymentGateway: 'active' | 'inactive' | 'error';
        notificationService: 'active' | 'delayed' | 'error';
        uptime: number;
    };
}

export interface RecentActivity {
    id: string;
    type:
        | 'user_registration'
        | 'order'
        | 'prescription'
        | 'pharmacy_registration'
        | 'system_alert'
        | 'payment';
    title: string;
    subtitle: string;
    time: string;
    status: {
        label: string;
        variant: 'success' | 'warning' | 'danger' | 'info';
    };
    value?: string;
    userId?: string;
    orderId?: string;
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
    }[];
}

class AdminAnalyticsService {
    // Mock KPI data
    getKPIs(): AdminKPIs {
        return {
            users: {
                total: 1247,
                customers: 892,
                pharmacies: 89,
                doctors: 156,
                vendors: 45,
                prescriptionReaders: 34,
                databaseInputUsers: 31,
                growth: 12.5,
                newThisMonth: 89,
            },
            orders: {
                total: 3456,
                pending: 45,
                processing: 123,
                completed: 3201,
                cancelled: 87,
                totalValue: 456789,
                averageOrderValue: 132.15,
                growth: 18.3,
            },
            prescriptions: {
                total: 1234,
                pending: 23,
                processing: 67,
                completed: 1089,
                rejected: 55,
                averageProcessingTime: 2.5, // hours
                growth: 15.7,
            },
            revenue: {
                total: 456789,
                thisMonth: 45678,
                lastMonth: 38945,
                growth: 17.3,
                commissionEarned: 34567,
                averageCommission: 11.2,
            },
            cities: {
                enabled: 8,
                total: 27,
                activePharmacies: 89,
                coverage: 29.6, // percentage
            },
            system: {
                serverStatus: 'online',
                databaseStatus: 'connected',
                paymentGateway: 'active',
                notificationService: 'delayed',
                uptime: 99.8,
            },
        };
    }

    // Mock recent activities
    getRecentActivities(): RecentActivity[] {
        return [
            {
                id: '1',
                type: 'pharmacy_registration',
                title: 'New pharmacy registered',
                subtitle: 'Al-Shifa Pharmacy - Ismailia',
                time: '2 hours ago',
                status: { label: 'Pending Review', variant: 'warning' },
            },
            {
                id: '2',
                type: 'order',
                title: 'High-value order completed',
                subtitle: 'Customer: Ahmed Hassan - Order #1234',
                time: '3 hours ago',
                status: { label: 'Completed', variant: 'success' },
                value: 'EGP 567.50',
                orderId: '1234',
            },
            {
                id: '3',
                type: 'prescription',
                title: 'Prescription processing delayed',
                subtitle: 'Prescription #5678 - Urgent priority',
                time: '4 hours ago',
                status: { label: 'Delayed', variant: 'danger' },
            },
            {
                id: '4',
                type: 'user_registration',
                title: 'New doctor joined',
                subtitle: 'Dr. Sarah Mohamed - Cardiology',
                time: '6 hours ago',
                status: { label: 'Verified', variant: 'success' },
            },
            {
                id: '5',
                type: 'system_alert',
                title: 'Low stock alert',
                subtitle: 'Paracetamol 500mg - HealthPlus Pharmacy',
                time: '8 hours ago',
                status: { label: 'Alert', variant: 'warning' },
            },
            {
                id: '6',
                type: 'payment',
                title: 'Commission payment processed',
                subtitle: 'WellCare Pharmacy - Monthly commission',
                time: '1 day ago',
                status: { label: 'Paid', variant: 'success' },
                value: 'EGP 2,345.00',
            },
            {
                id: '7',
                type: 'user_registration',
                title: 'New customer registered',
                subtitle: 'Fatima Ali - Cairo',
                time: '1 day ago',
                status: { label: 'Active', variant: 'info' },
            },
            {
                id: '8',
                type: 'order',
                title: 'Prescription order cancelled',
                subtitle: 'Order #9876 - Payment failed',
                time: '2 days ago',
                status: { label: 'Cancelled', variant: 'danger' },
                value: 'EGP 234.00',
            },
        ];
    }

    // Mock chart data for revenue trends
    getRevenueChartData(): ChartData {
        return {
            labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            datasets: [
                {
                    label: 'Revenue (EGP)',
                    data: [
                        25000, 28000, 32000, 29000, 35000, 38000, 42000, 39000, 45000, 48000, 52000,
                        55000,
                    ],
                    borderColor: '#1F1F6F',
                    backgroundColor: 'rgba(31, 31, 111, 0.1)',
                },
                {
                    label: 'Commission (EGP)',
                    data: [2800, 3100, 3500, 3200, 3900, 4200, 4600, 4300, 4900, 5300, 5700, 6100],
                    borderColor: '#14274E',
                    backgroundColor: 'rgba(20, 39, 78, 0.1)',
                },
            ],
        };
    }

    // Mock chart data for order trends
    getOrderChartData(): ChartData {
        return {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Orders',
                    data: [245, 289, 312, 356],
                    borderColor: '#394867',
                    backgroundColor: 'rgba(57, 72, 103, 0.1)',
                },
                {
                    label: 'Prescriptions',
                    data: [89, 102, 118, 134],
                    borderColor: '#9BA4B4',
                    backgroundColor: 'rgba(155, 164, 180, 0.1)',
                },
            ],
        };
    }

    // Mock top performing pharmacies
    getTopPharmacies() {
        return [
            {
                id: 'medicare-cairo',
                name: 'MediCare Pharmacy',
                city: 'Cairo',
                orders: 234,
                revenue: 45678,
                rating: 4.9,
                growth: 23.5,
            },
            {
                id: 'healthplus-ismailia',
                name: 'HealthPlus Pharmacy',
                city: 'Ismailia',
                orders: 189,
                revenue: 38945,
                rating: 4.8,
                growth: 18.2,
            },
            {
                id: 'wellness-cairo',
                name: 'Wellness Pharmacy',
                city: 'Cairo',
                orders: 156,
                revenue: 32456,
                rating: 4.7,
                growth: 15.8,
            },
            {
                id: 'family-care-ismailia',
                name: 'Family Care Pharmacy',
                city: 'Ismailia',
                orders: 134,
                revenue: 28934,
                rating: 4.7,
                growth: 12.4,
            },
        ];
    }

    // Mock city performance data
    getCityPerformance() {
        return [
            {
                cityId: 'cairo-city',
                name: 'Cairo',
                pharmacies: 15,
                orders: 1234,
                revenue: 123456,
                growth: 22.5,
                coverage: 85.2,
            },
            {
                cityId: 'ismailia-city',
                name: 'Ismailia',
                pharmacies: 8,
                orders: 567,
                revenue: 67890,
                growth: 18.3,
                coverage: 92.1,
            },
            {
                cityId: 'alexandria-city',
                name: 'Alexandria',
                pharmacies: 12,
                orders: 789,
                revenue: 89012,
                growth: 15.7,
                coverage: 78.9,
            },
            {
                cityId: 'giza-city',
                name: 'Giza',
                pharmacies: 10,
                orders: 456,
                revenue: 56789,
                growth: 12.1,
                coverage: 81.4,
            },
        ];
    }

    // Mock alerts and notifications
    getSystemAlerts() {
        return [
            {
                id: '1',
                type: 'critical',
                title: 'Low Stock Alert',
                message: '5 pharmacies have critical stock levels',
                time: '30 min ago',
                count: 5,
            },
            {
                id: '2',
                type: 'warning',
                title: 'Delayed Prescriptions',
                message: '12 prescriptions exceed processing time',
                time: '1 hour ago',
                count: 12,
            },
            {
                id: '3',
                type: 'info',
                title: 'New Registrations',
                message: '8 new pharmacy applications pending review',
                time: '2 hours ago',
                count: 8,
            },
            {
                id: '4',
                type: 'success',
                title: 'System Update',
                message: 'Notification service performance improved',
                time: '4 hours ago',
                count: 0,
            },
        ];
    }
}

export const adminAnalyticsService = new AdminAnalyticsService();
