// KPI Analytics Service - Real-time calculation of all admin dashboard KPIs
export interface RealTimeKPIs {
    // Revenue KPIs
    totalRevenue: number;
    platformRevenue: number;
    averageOrderValue: number;
    revenueGrowth: number;

    // Order KPIs
    totalOrders: number;
    completedOrders: number;
    orderCompletionRate: number;
    ordersToday: number;

    // Prescription KPIs
    totalPrescriptions: number;
    prescriptionUploadRate: number;
    prescriptionsProcessedToday: number;

    // Customer KPIs
    totalCustomers: number;
    customerRetentionRate: number;
    newCustomersThisMonth: number;

    // Pharmacy KPIs
    totalPharmacies: number;
    activePharmacies: number;
    pendingPharmacies: number;

    // System KPIs
    systemUptime: number;
    lastUpdated: string;
}

export interface PharmacyKPIs {
    pharmacyId: string;
    pharmacyName: string;
    cityName: string;

    // Sales & Revenue
    totalSales: number;
    monthlySales: number;
    totalOrders: number;
    monthlyOrders: number;
    averageOrderValue: number;

    // Commission & Platform Revenue
    commissionRate: number;
    totalCommissionPaid: number;
    monthlyCommissionPaid: number;
    platformRevenue: number;
    monthlyPlatformRevenue: number;

    // Performance Metrics
    orderCompletionRate: number;
    customerSatisfaction: number;
    averageDeliveryTime: number;
    returnRate: number;

    // Growth Metrics
    salesGrowth: number;
    orderGrowth: number;

    // Status
    isActive: boolean;
    isOpen: boolean;
    lastOrderDate: string;
}

export interface CustomerAnalytics {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    returningCustomers: number;

    // Retention & Engagement
    customerRetentionRate: number;
    averageOrdersPerCustomer: number;
    averageLifetimeValue: number;

    // Prescription Behavior
    prescriptionUploadRate: number;
    prescriptionToOrderConversion: number;

    // Order Completion
    orderCompletionRate: number;
    orderAbandonmentRate: number;

    // Geographic Distribution
    customersByCity: {
        cityId: string;
        cityName: string;
        customerCount: number;
        percentage: number;
    }[];
}

class KPIAnalyticsService {
    // Calculate real-time KPIs for admin dashboard
    calculateRealTimeKPIs(): RealTimeKPIs {
        // Mock data - in real implementation, this would fetch from database
        const totalOrders = 3456;
        const completedOrders = Math.floor(totalOrders * 0.92); // 92% completion rate
        const totalCustomers = 1247;
        const returningCustomers = Math.floor(totalCustomers * 0.685); // 68.5% retention
        const prescriptionOrders = Math.floor(totalOrders * 0.45); // 45% prescription orders
        const totalRevenue = 148135; // Total platform revenue
        const platformRevenue = totalRevenue * 0.88; // Platform keeps 88% after commissions

        return {
            // Revenue KPIs
            totalRevenue: totalRevenue,
            platformRevenue: platformRevenue,
            averageOrderValue: totalRevenue / totalOrders,
            revenueGrowth: 18.5,

            // Order KPIs
            totalOrders: totalOrders,
            completedOrders: completedOrders,
            orderCompletionRate: (completedOrders / totalOrders) * 100,
            ordersToday: 23 + Math.floor(Math.random() * 10),

            // Prescription KPIs
            totalPrescriptions: prescriptionOrders,
            prescriptionUploadRate: (prescriptionOrders / totalOrders) * 100,
            prescriptionsProcessedToday: 15 + Math.floor(Math.random() * 8),

            // Customer KPIs
            totalCustomers: totalCustomers,
            customerRetentionRate: (returningCustomers / totalCustomers) * 100,
            newCustomersThisMonth: 89,

            // Pharmacy KPIs
            totalPharmacies: 4,
            activePharmacies: 3,
            pendingPharmacies: 1,

            // System KPIs
            systemUptime: 99.8,
            lastUpdated: new Date().toISOString(),
        };
    }

    // Calculate pharmacy-specific KPIs
    calculatePharmacyKPIs(pharmacyId: string): PharmacyKPIs | null {
        // Mock pharmacy data - in real implementation, fetch from database
        const pharmacyData: Record<string, any> = {
            'healthplus-ismailia': {
                pharmacyName: 'HealthPlus Pharmacy',
                cityName: 'Ismailia',
                totalSales: 45678,
                monthlySales: 8934,
                totalOrders: 234,
                monthlyOrders: 45,
                commissionRate: 12,
                isActive: true,
                isOpen: true,
                customerSatisfaction: 4.8,
                averageDeliveryTime: 32,
                returnRate: 2.1,
                salesGrowth: 18.5,
                orderGrowth: 22.3,
                lastOrderDate: '2024-01-20T14:30:00Z',
            },
            'medicare-cairo': {
                pharmacyName: 'MediCare Pharmacy',
                cityName: 'Cairo',
                totalSales: 67890,
                monthlySales: 12456,
                totalOrders: 345,
                monthlyOrders: 67,
                commissionRate: 8,
                isActive: true,
                isOpen: true,
                customerSatisfaction: 4.9,
                averageDeliveryTime: 28,
                returnRate: 1.8,
                salesGrowth: 22.3,
                orderGrowth: 25.7,
                lastOrderDate: '2024-01-20T16:45:00Z',
            },
            'wellness-cairo': {
                pharmacyName: 'Wellness Pharmacy',
                cityName: 'Cairo',
                totalSales: 34567,
                monthlySales: 6789,
                totalOrders: 189,
                monthlyOrders: 34,
                commissionRate: 10,
                isActive: false, // Suspended
                isOpen: false,
                customerSatisfaction: 4.5,
                averageDeliveryTime: 45,
                returnRate: 3.2,
                salesGrowth: 15.7,
                orderGrowth: 12.1,
                lastOrderDate: '2024-01-15T09:20:00Z',
            },
            'newlife-giza': {
                pharmacyName: 'New Life Pharmacy',
                cityName: 'Giza',
                totalSales: 0,
                monthlySales: 0,
                totalOrders: 0,
                monthlyOrders: 0,
                commissionRate: 10,
                isActive: false, // Pending
                isOpen: false,
                customerSatisfaction: 0,
                averageDeliveryTime: 0,
                returnRate: 0,
                salesGrowth: 0,
                orderGrowth: 0,
                lastOrderDate: '',
            },
        };

        const data = pharmacyData[pharmacyId];
        if (!data) return null;

        const averageOrderValue = data.totalOrders > 0 ? data.totalSales / data.totalOrders : 0;
        const totalCommissionPaid = data.totalSales * (data.commissionRate / 100);
        const monthlyCommissionPaid = data.monthlySales * (data.commissionRate / 100);
        const platformRevenue = data.totalSales - totalCommissionPaid;
        const monthlyPlatformRevenue = data.monthlySales - monthlyCommissionPaid;
        const orderCompletionRate = data.totalOrders > 0 ? 92.5 : 0; // Mock completion rate

        return {
            pharmacyId,
            pharmacyName: data.pharmacyName,
            cityName: data.cityName,

            // Sales & Revenue
            totalSales: data.totalSales,
            monthlySales: data.monthlySales,
            totalOrders: data.totalOrders,
            monthlyOrders: data.monthlyOrders,
            averageOrderValue,

            // Commission & Platform Revenue
            commissionRate: data.commissionRate,
            totalCommissionPaid,
            monthlyCommissionPaid,
            platformRevenue,
            monthlyPlatformRevenue,

            // Performance Metrics
            orderCompletionRate,
            customerSatisfaction: data.customerSatisfaction,
            averageDeliveryTime: data.averageDeliveryTime,
            returnRate: data.returnRate,

            // Growth Metrics
            salesGrowth: data.salesGrowth,
            orderGrowth: data.orderGrowth,

            // Status
            isActive: data.isActive,
            isOpen: data.isOpen,
            lastOrderDate: data.lastOrderDate,
        };
    }

    // Calculate customer analytics
    calculateCustomerAnalytics(): CustomerAnalytics {
        const totalCustomers = 1247;
        const activeCustomers = Math.floor(totalCustomers * 0.78); // 78% active
        const newCustomers = 89;
        const returningCustomers = Math.floor(totalCustomers * 0.685); // 68.5% retention
        const totalOrders = 3456;
        const prescriptionOrders = Math.floor(totalOrders * 0.45); // 45% prescription orders
        const completedOrders = Math.floor(totalOrders * 0.92); // 92% completion rate

        return {
            totalCustomers,
            activeCustomers,
            newCustomers,
            returningCustomers,

            // Retention & Engagement
            customerRetentionRate: (returningCustomers / totalCustomers) * 100,
            averageOrdersPerCustomer: totalOrders / totalCustomers,
            averageLifetimeValue: 187.5, // Mock LTV

            // Prescription Behavior
            prescriptionUploadRate: (prescriptionOrders / totalOrders) * 100,
            prescriptionToOrderConversion: 78.5, // Mock conversion rate

            // Order Completion
            orderCompletionRate: (completedOrders / totalOrders) * 100,
            orderAbandonmentRate: ((totalOrders - completedOrders) / totalOrders) * 100,

            // Geographic Distribution
            customersByCity: [
                { cityId: 'cairo-city', cityName: 'Cairo', customerCount: 567, percentage: 45.5 },
                {
                    cityId: 'ismailia-city',
                    cityName: 'Ismailia',
                    customerCount: 234,
                    percentage: 18.8,
                },
                {
                    cityId: 'alexandria-city',
                    cityName: 'Alexandria',
                    customerCount: 189,
                    percentage: 15.2,
                },
                { cityId: 'giza-city', cityName: 'Giza', customerCount: 156, percentage: 12.5 },
                { cityId: 'other', cityName: 'Other Cities', customerCount: 101, percentage: 8.1 },
            ],
        };
    }

    // Get all pharmacies with their KPIs
    getAllPharmaciesKPIs(): PharmacyKPIs[] {
        const pharmacyIds = [
            'healthplus-ismailia',
            'medicare-cairo',
            'wellness-cairo',
            'newlife-giza',
        ];
        return pharmacyIds
            .map((id) => this.calculatePharmacyKPIs(id))
            .filter((kpi) => kpi !== null) as PharmacyKPIs[];
    }

    // Calculate commission breakdown for all pharmacies
    calculateCommissionBreakdown() {
        const pharmacies = this.getAllPharmaciesKPIs();

        return pharmacies.map((pharmacy) => ({
            pharmacyId: pharmacy.pharmacyId,
            pharmacyName: pharmacy.pharmacyName,
            cityName: pharmacy.cityName,
            totalSales: pharmacy.totalSales,
            commissionRate: pharmacy.commissionRate,
            commissionEarned: pharmacy.totalCommissionPaid,
            platformRevenue: pharmacy.platformRevenue,
            monthlyCommission: pharmacy.monthlyCommissionPaid,
            monthlyPlatformRevenue: pharmacy.monthlyPlatformRevenue,
            isActive: pharmacy.isActive,
        }));
    }

    // Calculate real-time revenue metrics
    calculateRevenueMetrics() {
        const pharmacies = this.getAllPharmaciesKPIs();
        const totalSales = pharmacies.reduce((sum, p) => sum + p.totalSales, 0);
        const totalCommissions = pharmacies.reduce((sum, p) => sum + p.totalCommissionPaid, 0);
        const totalPlatformRevenue = pharmacies.reduce((sum, p) => sum + p.platformRevenue, 0);
        const totalOrders = pharmacies.reduce((sum, p) => sum + p.totalOrders, 0);

        return {
            totalSales,
            totalCommissions,
            totalPlatformRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
            averageCommissionRate:
                pharmacies.length > 0
                    ? pharmacies.reduce((sum, p) => sum + p.commissionRate, 0) / pharmacies.length
                    : 0,
            revenueGrowth: 18.5, // Mock growth rate
            lastUpdated: new Date().toISOString(),
        };
    }

    // Export KPI data for reporting
    exportKPIData(format: 'csv' | 'excel' | 'pdf'): string {
        const timestamp = new Date().toISOString().split('T')[0];
        return `cura_kpi_report_${timestamp}.${format}`;
    }
}

export const kpiAnalyticsService = new KPIAnalyticsService();
