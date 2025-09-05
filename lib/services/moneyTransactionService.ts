// Money Transaction Service - Comprehensive financial tracking system

export interface MoneyTransaction {
    id: string;
    type: 'order' | 'commission' | 'refund' | 'payout' | 'adjustment';
    subType?: 'pharmacy_commission' | 'doctor_commission' | 'platform_revenue' | 'customer_refund';
    amount: number;
    currency: string;
    description: string;
    reference: string; // Order ID, Commission ID, etc.
    entityId: string; // Pharmacy ID, Doctor ID, Customer ID
    entityType: 'pharmacy' | 'vendor' | 'doctor' | 'customer' | 'platform';
    entityName: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    createdAt: string;
    processedAt?: string;
    scheduledAt?: string;
    metadata?: Record<string, any>;
}

export interface PharmacyCommission {
    id: string;
    pharmacyId: string;
    name: string;
    city: string;
    commissionRate: number; // Percentage you take from each order (e.g., 10%)
    totalSales: number; // Total cash received by pharmacy from customers
    pharmacyRevenue: number; // What pharmacy keeps after commission (totalSales - commissionOwed)
    commissionOwed: number; // Total commission pharmacy owes you
    pendingAmount: number; // Commission amount pending collection from pharmacy
    lastCollection?: string; // Last time you collected commission from pharmacy
    collectionStatus: 'pending' | 'scheduled' | 'completed';
    collectionFrequency: 'weekly' | 'biweekly' | 'monthly';
    nextCollectionDate: string;
    totalOrders: number;
    averageOrderValue: number;
    // New fields for better tracking
    totalCommissionCollected: number; // Total commission already collected
    outstandingBalance: number; // Total amount pharmacy still owes you
    lastOrderDate?: string; // Date of last order from this pharmacy
    paymentMethod: 'cash' | 'bank_transfer' | 'mobile_wallet'; // How pharmacy pays you
}

export interface VendorCommission {
    id: string;
    vendorId: string;
    name: string;
    city: string;
    category: string; // Product category they sell
    commissionRate: number; // Percentage you take from each order (e.g., 15%)
    totalSales: number; // Total cash received by vendor from customers
    vendorRevenue: number; // What vendor keeps after commission (totalSales - commissionOwed)
    commissionOwed: number; // Total commission vendor owes you
    pendingAmount: number; // Commission amount pending collection from vendor
    lastCollection?: string; // Last time you collected commission from vendor
    collectionStatus: 'pending' | 'scheduled' | 'completed';
    collectionFrequency: 'weekly' | 'biweekly' | 'monthly';
    nextCollectionDate: string;
    totalOrders: number;
    averageOrderValue: number;
    // New fields for better tracking
    totalCommissionCollected: number; // Total commission already collected
    outstandingBalance: number; // Total amount vendor still owes you
    lastOrderDate?: string; // Date of last order from this vendor
    paymentMethod: 'cash' | 'bank_transfer' | 'mobile_wallet'; // How vendor pays you
}

export interface DoctorCommission {
    id: string;
    doctorId: string;
    name: string;
    email: string;
    specialization: string;
    commissionRate: number;
    totalReferrals: number;
    successfulOrders: number;
    conversionRate: number;
    commissionEarned: number;
    pendingAmount: number;
    lastPayout?: string;
    payoutStatus: 'pending' | 'scheduled' | 'completed';
    payoutFrequency: 'weekly' | 'biweekly' | 'monthly';
    nextPayoutDate: string;
}

export interface RefundRequest {
    id: string;
    orderId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'processed';
    requestedAt: string;
    processedAt?: string;
    processedBy?: string;
    refundMethod: 'wallet' | 'original_payment' | 'bank_transfer';
    notes?: string;
}

export interface PayoutSchedule {
    id: string;
    entityId: string;
    entityName: string;
    entityType: 'pharmacy' | 'doctor';
    frequency: 'weekly' | 'biweekly' | 'monthly';
    nextPayout: string;
    pendingAmount: number;
    status: 'active' | 'paused' | 'cancelled';
    minimumAmount: number;
    paymentMethod: 'bank_transfer' | 'mobile_wallet' | 'check';
    bankDetails?: {
        accountNumber: string;
        bankName: string;
        accountHolder: string;
    };
    createdAt: string;
    lastPayout?: string;
}

export interface TransactionMetrics {
    totalRevenue: number; // Platform's actual net revenue (commission collected - doctor payouts)
    grossTransactionVolume: number; // Total money customers paid to pharmacies/vendors
    platformCommission: number;
    pharmacyCommissions: number;
    vendorCommissions: number;
    doctorCommissions: number;
    pendingRefunds: number;
    processedRefunds: number;
    pendingPayouts: number;
    completedPayouts: number;
    lastUpdated: string;
}

export interface TransactionSummary {
    totalTransactions: number;
    totalAmount: number;
    pendingAmount: number;
    completedAmount: number;
    refundedAmount: number;
}

class MoneyTransactionService {
    private mockTransactions: MoneyTransaction[] = [];
    private mockPharmacyCommissions: PharmacyCommission[] = [];
    private mockVendorCommissions: VendorCommission[] = [];
    private mockDoctorCommissions: DoctorCommission[] = [];
    private mockRefunds: RefundRequest[] = [];
    private mockPayoutSchedules: PayoutSchedule[] = [];

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        // Generate mock transactions
        this.mockTransactions = this.generateMockTransactions();
        this.mockPharmacyCommissions = this.generateMockPharmacyCommissions();
        this.mockVendorCommissions = this.generateMockVendorCommissions();
        this.mockDoctorCommissions = this.generateMockDoctorCommissions();
        this.mockRefunds = this.generateMockRefunds();
        this.mockPayoutSchedules = this.generateMockPayoutSchedules();
    }

    private generateMockTransactions(): MoneyTransaction[] {
        const transactions: MoneyTransaction[] = [];
        const now = Date.now();

        // Pharmacy Order transactions - reflecting your business model
        for (let i = 0; i < 30; i++) {
            const orderDate = new Date(now - i * 24 * 60 * 60 * 1000);
            const orderAmount = 150 + Math.random() * 300;
            const platformCommission = orderAmount * 0.1; // 10% commission you collect
            const pharmacyRevenue = orderAmount - platformCommission; // 90% pharmacy keeps

            // Order payment (customer pays pharmacy directly)
            transactions.push({
                id: `TXN-PORD-${String(i).padStart(4, '0')}`,
                type: 'order',
                amount: orderAmount,
                currency: 'EGP',
                description: `Pharmacy order payment #PORD-2024-${String(i).padStart(3, '0')} (Cash to Pharmacy)`,
                reference: `PORD-2024-${String(i).padStart(3, '0')}`,
                entityId: `pharmacy-${i % 5}`,
                entityType: 'pharmacy',
                entityName: `Pharmacy ${i % 5}`,
                status: i < 25 ? 'completed' : 'pending',
                createdAt: orderDate.toISOString(),
                processedAt: i < 25 ? orderDate.toISOString() : undefined,
                metadata: {
                    paymentMethod: 'cash_on_delivery',
                    commissionRate: 10,
                    platformCommission: platformCommission,
                    pharmacyRevenue: pharmacyRevenue,
                },
            });

            // Platform commission (what you need to collect from pharmacy)
            if (i < 25) {
                transactions.push({
                    id: `TXN-PCOM-${String(i).padStart(4, '0')}`,
                    type: 'commission',
                    subType: 'platform_revenue',
                    amount: platformCommission,
                    currency: 'EGP',
                    description: `Platform commission from pharmacy order #PORD-2024-${String(i).padStart(3, '0')} (To be collected from pharmacy)`,
                    reference: `PORD-2024-${String(i).padStart(3, '0')}`,
                    entityId: `pharmacy-${i % 5}`,
                    entityType: 'pharmacy',
                    entityName: `Pharmacy ${i % 5}`,
                    status: 'pending', // Pending collection from pharmacy
                    createdAt: orderDate.toISOString(),
                    metadata: {
                        commissionType: 'platform_collection',
                        orderAmount: orderAmount,
                        commissionRate: 10,
                    },
                });
            }
        }

        // Vendor Order transactions
        for (let i = 0; i < 20; i++) {
            const orderDate = new Date(now - i * 2 * 24 * 60 * 60 * 1000);
            const orderAmount = 300 + Math.random() * 700;
            const platformCommission = orderAmount * 0.15; // 15% commission you collect from vendors
            const vendorRevenue = orderAmount - platformCommission; // 85% vendor keeps

            // Order payment (customer pays vendor directly)
            transactions.push({
                id: `TXN-VORD-${String(i).padStart(4, '0')}`,
                type: 'order',
                amount: orderAmount,
                currency: 'EGP',
                description: `Vendor order payment #VORD-2024-${String(i).padStart(3, '0')} (Cash to Vendor)`,
                reference: `VORD-2024-${String(i).padStart(3, '0')}`,
                entityId: `vendor-${i % 4}`,
                entityType: 'vendor',
                entityName: `Vendor ${i % 4}`,
                status: i < 18 ? 'completed' : 'pending',
                createdAt: orderDate.toISOString(),
                processedAt: i < 18 ? orderDate.toISOString() : undefined,
                metadata: {
                    paymentMethod: 'cash_on_delivery',
                    commissionRate: 15,
                    platformCommission: platformCommission,
                    vendorRevenue: vendorRevenue,
                },
            });

            // Platform commission (what you need to collect from vendor)
            if (i < 18) {
                transactions.push({
                    id: `TXN-VCOM-${String(i).padStart(4, '0')}`,
                    type: 'commission',
                    subType: 'platform_revenue',
                    amount: platformCommission,
                    currency: 'EGP',
                    description: `Platform commission from vendor order #VORD-2024-${String(i).padStart(3, '0')} (To be collected from vendor)`,
                    reference: `VORD-2024-${String(i).padStart(3, '0')}`,
                    entityId: `vendor-${i % 4}`,
                    entityType: 'vendor',
                    entityName: `Vendor ${i % 4}`,
                    status: 'pending', // Pending collection from vendor
                    createdAt: orderDate.toISOString(),
                    metadata: {
                        commissionType: 'platform_collection',
                        orderAmount: orderAmount,
                        commissionRate: 15,
                    },
                });
            }
        }

        // Doctor commission transactions
        for (let i = 0; i < 15; i++) {
            const commissionDate = new Date(now - i * 2 * 24 * 60 * 60 * 1000);
            const commissionAmount = 50 + Math.random() * 100;

            transactions.push({
                id: `TXN-DCOM-${String(i).padStart(4, '0')}`,
                type: 'commission',
                subType: 'doctor_commission',
                amount: commissionAmount,
                currency: 'EGP',
                description: `Doctor referral commission`,
                reference: `REF-2024-${String(i).padStart(3, '0')}`,
                entityId: `doctor-${i % 8}`,
                entityType: 'doctor',
                entityName: `Dr. Doctor ${i % 8}`,
                status: i < 12 ? 'completed' : 'pending',
                createdAt: commissionDate.toISOString(),
                processedAt: i < 12 ? commissionDate.toISOString() : undefined,
            });
        }

        // Refund transactions
        for (let i = 0; i < 8; i++) {
            const refundDate = new Date(now - i * 3 * 24 * 60 * 60 * 1000);
            const refundAmount = 100 + Math.random() * 200;

            transactions.push({
                id: `TXN-REF-${String(i).padStart(4, '0')}`,
                type: 'refund',
                subType: 'customer_refund',
                amount: refundAmount,
                currency: 'EGP',
                description: `Refund for returned order`,
                reference: `ORD-2024-${String(i + 100).padStart(3, '0')}`,
                entityId: `customer-${i % 10}`,
                entityType: 'customer',
                entityName: `Customer ${i % 10}`,
                status: i < 5 ? 'completed' : 'pending',
                createdAt: refundDate.toISOString(),
                processedAt: i < 5 ? refundDate.toISOString() : undefined,
            });
        }

        return transactions.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    private generateMockPharmacyCommissions(): PharmacyCommission[] {
        return [
            {
                id: 'PCOM-001',
                pharmacyId: 'pharmacy-0',
                name: 'HealthPlus Pharmacy',
                city: 'Cairo',
                commissionRate: 10, // You take 10% from each order
                totalSales: 45678, // Total cash they received from customers
                pharmacyRevenue: 41110.2, // What they keep (90%)
                commissionOwed: 4567.8, // Total commission they owe you
                pendingAmount: 1234.5, // Commission pending collection from pharmacy
                lastCollection: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'pending',
                collectionFrequency: 'weekly',
                nextCollectionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 234,
                averageOrderValue: 195.2,
                totalCommissionCollected: 3333.3, // Already collected commission
                outstandingBalance: 1234.5, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'cash',
            },
            {
                id: 'PCOM-002',
                pharmacyId: 'pharmacy-1',
                name: 'MediCare Pharmacy',
                city: 'Giza',
                commissionRate: 8, // You take 8% from each order
                totalSales: 67890, // Total cash they received from customers
                pharmacyRevenue: 62458.8, // What they keep (92%)
                commissionOwed: 5431.2, // Total commission they owe you
                pendingAmount: 2156.8, // Commission pending collection from pharmacy
                lastCollection: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'scheduled',
                collectionFrequency: 'biweekly',
                nextCollectionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 345,
                averageOrderValue: 196.8,
                totalCommissionCollected: 3274.4, // Already collected commission
                outstandingBalance: 2156.8, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'bank_transfer',
            },
            {
                id: 'PCOM-003',
                pharmacyId: 'pharmacy-2',
                name: 'Wellness Pharmacy',
                city: 'Alexandria',
                commissionRate: 12, // You take 12% from each order
                totalSales: 34567, // Total cash they received from customers
                pharmacyRevenue: 30418.96, // What they keep (88%)
                commissionOwed: 4148.04, // Total commission they owe you
                pendingAmount: 987.6, // Commission pending collection from pharmacy
                lastCollection: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'completed',
                collectionFrequency: 'monthly',
                nextCollectionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 189,
                averageOrderValue: 182.9,
                totalCommissionCollected: 3160.44, // Already collected commission
                outstandingBalance: 987.6, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'mobile_wallet',
            },
            {
                id: 'PCOM-004',
                pharmacyId: 'pharmacy-3',
                name: 'Family Care Pharmacy',
                city: 'Ismailia',
                commissionRate: 11, // You take 11% from each order
                totalSales: 23456, // Total cash they received from customers
                pharmacyRevenue: 20875.84, // What they keep (89%)
                commissionOwed: 2580.16, // Total commission they owe you
                pendingAmount: 1567.3, // Commission pending collection from pharmacy
                lastCollection: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'pending',
                collectionFrequency: 'weekly',
                nextCollectionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 156,
                averageOrderValue: 150.4,
                totalCommissionCollected: 1012.86, // Already collected commission
                outstandingBalance: 1567.3, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'cash',
            },
            {
                id: 'PCOM-005',
                pharmacyId: 'pharmacy-4',
                name: 'NewLife Pharmacy',
                city: 'Mansoura',
                commissionRate: 9, // You take 9% from each order
                totalSales: 56789, // Total cash they received from customers
                pharmacyRevenue: 51677.99, // What they keep (91%)
                commissionOwed: 5111.01, // Total commission they owe you
                pendingAmount: 2345.7, // Commission pending collection from pharmacy
                lastCollection: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'scheduled',
                collectionFrequency: 'biweekly',
                nextCollectionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 278,
                averageOrderValue: 204.3,
                totalCommissionCollected: 2765.31, // Already collected commission
                outstandingBalance: 2345.7, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'bank_transfer',
            },
        ];
    }

    private generateMockVendorCommissions(): VendorCommission[] {
        return [
            {
                id: 'VCOM-001',
                vendorId: 'vendor-0',
                name: 'HealthTech Supplies',
                city: 'Cairo',
                category: 'Medical Equipment',
                commissionRate: 15, // You take 15% from each order
                totalSales: 78900, // Total cash they received from customers
                vendorRevenue: 67065, // What they keep (85%)
                commissionOwed: 11835, // Total commission they owe you
                pendingAmount: 2890.5, // Commission pending collection from vendor
                lastCollection: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'pending',
                collectionFrequency: 'biweekly',
                nextCollectionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 156,
                averageOrderValue: 505.8,
                totalCommissionCollected: 8944.5, // Already collected commission
                outstandingBalance: 2890.5, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'bank_transfer',
            },
            {
                id: 'VCOM-002',
                vendorId: 'vendor-1',
                name: 'WellCare Products',
                city: 'Alexandria',
                category: 'Health Supplements',
                commissionRate: 12, // You take 12% from each order
                totalSales: 45600,
                vendorRevenue: 40128, // What they keep (88%)
                commissionOwed: 5472,
                pendingAmount: 1567.8, // Commission pending collection from vendor
                lastCollection: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'scheduled',
                collectionFrequency: 'weekly',
                nextCollectionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 203,
                averageOrderValue: 224.6,
                totalCommissionCollected: 3904.2, // Already collected commission
                outstandingBalance: 1567.8, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'mobile_wallet',
            },
            {
                id: 'VCOM-003',
                vendorId: 'vendor-2',
                name: 'MedDevice Solutions',
                city: 'Giza',
                category: 'Diagnostic Tools',
                commissionRate: 18, // You take 18% from each order
                totalSales: 92300,
                vendorRevenue: 75686, // What they keep (82%)
                commissionOwed: 16614,
                pendingAmount: 3456.7, // Commission pending collection from vendor
                lastCollection: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'pending',
                collectionFrequency: 'monthly',
                nextCollectionDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 89,
                averageOrderValue: 1037.1,
                totalCommissionCollected: 13157.3, // Already collected commission
                outstandingBalance: 3456.7, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'bank_transfer',
            },
            {
                id: 'VCOM-004',
                vendorId: 'vendor-3',
                name: 'Wellness Mart',
                city: 'Mansoura',
                category: 'Personal Care',
                commissionRate: 10, // You take 10% from each order
                totalSales: 34500,
                vendorRevenue: 31050, // What they keep (90%)
                commissionOwed: 3450,
                pendingAmount: 1234.5, // Commission pending collection from vendor
                lastCollection: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                collectionStatus: 'completed',
                collectionFrequency: 'biweekly',
                nextCollectionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                totalOrders: 178,
                averageOrderValue: 193.8,
                totalCommissionCollected: 2215.5, // Already collected commission
                outstandingBalance: 1234.5, // Still owe you this amount
                lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'cash',
            },
        ];
    }

    private generateMockDoctorCommissions(): DoctorCommission[] {
        return [
            {
                id: 'DCOM-001',
                doctorId: 'doctor-0',
                name: 'Dr. Ahmed Hassan',
                email: 'ahmed.hassan@cura.com',
                specialization: 'Cardiology',
                commissionRate: 5,
                totalReferrals: 45,
                successfulOrders: 38,
                conversionRate: 84.4,
                commissionEarned: 1234.5,
                pendingAmount: 567.8,
                lastPayout: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                payoutStatus: 'pending',
                payoutFrequency: 'monthly',
                nextPayoutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'DCOM-002',
                doctorId: 'doctor-1',
                name: 'Dr. Sarah Mohamed',
                email: 'sarah.mohamed@cura.com',
                specialization: 'Pediatrics',
                commissionRate: 5,
                totalReferrals: 32,
                successfulOrders: 28,
                conversionRate: 87.5,
                commissionEarned: 987.6,
                pendingAmount: 432.1,
                lastPayout: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                payoutStatus: 'scheduled',
                payoutFrequency: 'monthly',
                nextPayoutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'DCOM-003',
                doctorId: 'doctor-2',
                name: 'Dr. Omar Ali',
                email: 'omar.ali@cura.com',
                specialization: 'Internal Medicine',
                commissionRate: 5,
                totalReferrals: 67,
                successfulOrders: 54,
                conversionRate: 80.6,
                commissionEarned: 1876.3,
                pendingAmount: 789.4,
                payoutStatus: 'completed',
                payoutFrequency: 'biweekly',
                nextPayoutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'DCOM-004',
                doctorId: 'doctor-3',
                name: 'Dr. Fatima Nour',
                email: 'fatima.nour@cura.com',
                specialization: 'Dermatology',
                commissionRate: 5,
                totalReferrals: 23,
                successfulOrders: 19,
                conversionRate: 82.6,
                commissionEarned: 654.2,
                pendingAmount: 298.7,
                lastPayout: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                payoutStatus: 'pending',
                payoutFrequency: 'weekly',
                nextPayoutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    private generateMockRefunds(): RefundRequest[] {
        return [
            {
                id: 'REF-001',
                orderId: 'ORD-2024-101',
                customerId: 'customer-1',
                customerName: 'Ahmed Mohamed',
                customerEmail: 'ahmed.mohamed@email.com',
                amount: 156.8,
                reason: 'Product damaged during delivery',
                status: 'pending',
                requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                refundMethod: 'wallet',
            },
            {
                id: 'REF-002',
                orderId: 'ORD-2024-102',
                customerId: 'customer-2',
                customerName: 'Sara Ali',
                customerEmail: 'sara.ali@email.com',
                amount: 89.5,
                reason: 'Wrong medication received',
                status: 'approved',
                requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                processedBy: 'admin-1',
                refundMethod: 'wallet',
            },
            {
                id: 'REF-003',
                orderId: 'ORD-2024-103',
                customerId: 'customer-3',
                customerName: 'Mohamed Hassan',
                customerEmail: 'mohamed.hassan@email.com',
                amount: 234.7,
                reason: 'Order cancelled by customer',
                status: 'processed',
                requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                processedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                processedBy: 'admin-2',
                refundMethod: 'original_payment',
            },
            {
                id: 'REF-004',
                orderId: 'ORD-2024-104',
                customerId: 'customer-4',
                customerName: 'Nour Ibrahim',
                customerEmail: 'nour.ibrahim@email.com',
                amount: 67.3,
                reason: 'Expired medication',
                status: 'pending',
                requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                refundMethod: 'wallet',
            },
            {
                id: 'REF-005',
                orderId: 'ORD-2024-105',
                customerId: 'customer-5',
                customerName: 'Youssef Omar',
                customerEmail: 'youssef.omar@email.com',
                amount: 178.9,
                reason: 'Pharmacy out of stock',
                status: 'rejected',
                requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                processedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                processedBy: 'admin-1',
                refundMethod: 'wallet',
                notes: 'Alternative medication was provided',
            },
        ];
    }

    private generateMockPayoutSchedules(): PayoutSchedule[] {
        return [
            {
                id: 'SCHED-001',
                entityId: 'pharmacy-0',
                entityName: 'HealthPlus Pharmacy',
                entityType: 'pharmacy',
                frequency: 'weekly',
                nextPayout: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 1234.5,
                status: 'active',
                minimumAmount: 500,
                paymentMethod: 'bank_transfer',
                bankDetails: {
                    accountNumber: '****1234',
                    bankName: 'National Bank of Egypt',
                    accountHolder: 'HealthPlus Pharmacy LLC',
                },
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                lastPayout: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'SCHED-002',
                entityId: 'pharmacy-1',
                entityName: 'MediCare Pharmacy',
                entityType: 'pharmacy',
                frequency: 'biweekly',
                nextPayout: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 2156.8,
                status: 'active',
                minimumAmount: 1000,
                paymentMethod: 'bank_transfer',
                bankDetails: {
                    accountNumber: '****5678',
                    bankName: 'Commercial International Bank',
                    accountHolder: 'MediCare Pharmacy Ltd',
                },
                createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                lastPayout: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'SCHED-003',
                entityId: 'doctor-0',
                entityName: 'Dr. Ahmed Hassan',
                entityType: 'doctor',
                frequency: 'monthly',
                nextPayout: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 567.8,
                status: 'active',
                minimumAmount: 200,
                paymentMethod: 'mobile_wallet',
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                lastPayout: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'SCHED-004',
                entityId: 'doctor-1',
                entityName: 'Dr. Sarah Mohamed',
                entityType: 'doctor',
                frequency: 'monthly',
                nextPayout: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 432.1,
                status: 'active',
                minimumAmount: 200,
                paymentMethod: 'bank_transfer',
                bankDetails: {
                    accountNumber: '****9012',
                    bankName: 'Banque Misr',
                    accountHolder: 'Dr. Sarah Mohamed',
                },
                createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
                lastPayout: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'SCHED-005',
                entityId: 'pharmacy-2',
                entityName: 'Wellness Pharmacy',
                entityType: 'pharmacy',
                frequency: 'monthly',
                nextPayout: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
                pendingAmount: 987.6,
                status: 'paused',
                minimumAmount: 800,
                paymentMethod: 'bank_transfer',
                bankDetails: {
                    accountNumber: '****3456',
                    bankName: 'Arab African International Bank',
                    accountHolder: 'Wellness Pharmacy Co.',
                },
                createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    // Public methods
    getTransactionMetrics(timeframe: string = '30d'): TransactionMetrics {
        // Calculate commission already collected from pharmacies
        const pharmacyCommissionCollected = this.mockPharmacyCommissions.reduce(
            (sum, p) => sum + p.totalCommissionCollected,
            0,
        );

        // Calculate commission already collected from vendors
        const vendorCommissionCollected = this.mockVendorCommissions.reduce(
            (sum, v) => sum + v.totalCommissionCollected,
            0,
        );

        // Calculate total commission already paid to doctors
        const doctorCommissionsPaid = this.mockDoctorCommissions.reduce(
            (sum, d) => sum + (d.commissionEarned - d.pendingAmount),
            0,
        );

        // Calculate gross transaction volume (total money customers paid to all entities)
        const grossTransactionVolume = this.mockTransactions
            .filter((t) => t.type === 'order' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate platform's actual net revenue
        // = Commission collected from pharmacies + Commission collected from vendors - Commission paid to doctors
        const totalRevenue =
            pharmacyCommissionCollected + vendorCommissionCollected - doctorCommissionsPaid;

        // Platform commission is the same as total revenue in this context
        const platformCommission = totalRevenue;

        const pharmacyCommissions = this.mockTransactions
            .filter((t) => t.subType === 'pharmacy_commission' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const vendorCommissions = this.mockTransactions
            .filter(
                (t) =>
                    t.entityType === 'vendor' &&
                    t.subType === 'platform_revenue' &&
                    t.status === 'completed',
            )
            .reduce((sum, t) => sum + t.amount, 0);

        const doctorCommissions = this.mockTransactions
            .filter((t) => t.subType === 'doctor_commission' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const pendingRefunds = this.mockTransactions
            .filter((t) => t.type === 'refund' && t.status === 'pending')
            .reduce((sum, t) => sum + t.amount, 0);

        const processedRefunds = this.mockTransactions
            .filter((t) => t.type === 'refund' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const pendingPayouts = this.mockPayoutSchedules
            .filter((s) => s.status === 'active')
            .reduce((sum, s) => sum + s.pendingAmount, 0);

        const completedPayouts = this.mockPayoutSchedules
            .filter((s) => s.lastPayout)
            .reduce((sum, s) => sum + s.pendingAmount * 0.8, 0); // Mock completed amount

        return {
            totalRevenue,
            grossTransactionVolume,
            platformCommission,
            pharmacyCommissions,
            vendorCommissions,
            doctorCommissions,
            pendingRefunds,
            processedRefunds,
            pendingPayouts,
            completedPayouts,
            lastUpdated: new Date().toISOString(),
        };
    }

    getTransactionSummary(timeframe: string = '30d'): TransactionSummary {
        const totalTransactions = this.mockTransactions.length;
        const totalAmount = this.mockTransactions.reduce((sum, t) => sum + t.amount, 0);
        const pendingAmount = this.mockTransactions
            .filter((t) => t.status === 'pending')
            .reduce((sum, t) => sum + t.amount, 0);
        const completedAmount = this.mockTransactions
            .filter((t) => t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);
        const refundedAmount = this.mockTransactions
            .filter((t) => t.type === 'refund' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalTransactions,
            totalAmount,
            pendingAmount,
            completedAmount,
            refundedAmount,
        };
    }

    getAllTransactions(): MoneyTransaction[] {
        return this.mockTransactions;
    }

    getPharmacyCommissions(): PharmacyCommission[] {
        return this.mockPharmacyCommissions;
    }

    getVendorCommissions(): VendorCommission[] {
        return this.mockVendorCommissions;
    }

    getDoctorCommissions(): DoctorCommission[] {
        return this.mockDoctorCommissions;
    }

    getRefunds(): RefundRequest[] {
        return this.mockRefunds;
    }

    getPayoutSchedules(): PayoutSchedule[] {
        return this.mockPayoutSchedules;
    }

    // Transaction management methods
    async processRefund(
        refundId: string,
        action: 'approve' | 'reject',
        notes?: string,
    ): Promise<boolean> {
        const refund = this.mockRefunds.find((r) => r.id === refundId);
        if (!refund) return false;

        refund.status = action === 'approve' ? 'approved' : 'rejected';
        refund.processedAt = new Date().toISOString();
        refund.processedBy = 'current-admin';
        if (notes) refund.notes = notes;

        if (action === 'approve') {
            // Create refund transaction
            const refundTransaction: MoneyTransaction = {
                id: `TXN-REF-${Date.now()}`,
                type: 'refund',
                subType: 'customer_refund',
                amount: refund.amount,
                currency: 'EGP',
                description: `Approved refund for order ${refund.orderId}`,
                reference: refund.orderId,
                entityId: refund.customerId,
                entityType: 'customer',
                entityName: refund.customerName,
                status: 'completed',
                createdAt: new Date().toISOString(),
                processedAt: new Date().toISOString(),
            };
            this.mockTransactions.unshift(refundTransaction);
        }

        return true;
    }

    async collectPharmacyCommission(pharmacyId: string): Promise<boolean> {
        const pharmacy = this.mockPharmacyCommissions.find((p) => p.pharmacyId === pharmacyId);
        if (!pharmacy || pharmacy.pendingAmount <= 0) return false;

        // Create commission collection transaction
        const collectionTransaction: MoneyTransaction = {
            id: `TXN-COLLECT-${Date.now()}`,
            type: 'commission',
            subType: 'platform_revenue',
            amount: pharmacy.pendingAmount,
            currency: 'EGP',
            description: `Commission collected from ${pharmacy.name}`,
            reference: `COLLECTION-${Date.now()}`,
            entityId: pharmacy.pharmacyId,
            entityType: 'pharmacy',
            entityName: pharmacy.name,
            status: 'completed',
            createdAt: new Date().toISOString(),
            processedAt: new Date().toISOString(),
            metadata: {
                collectionType: 'scheduled_commission',
                commissionRate: pharmacy.commissionRate,
            },
        };

        this.mockTransactions.unshift(collectionTransaction);

        // Update pharmacy commission data
        pharmacy.lastCollection = new Date().toISOString();
        pharmacy.pendingAmount = 0;
        pharmacy.collectionStatus = 'completed';

        return true;
    }

    async collectVendorCommission(vendorId: string): Promise<boolean> {
        const vendor = this.mockVendorCommissions.find((v) => v.vendorId === vendorId);
        if (!vendor || vendor.pendingAmount <= 0) return false;

        // Create commission collection transaction
        const collectionTransaction: MoneyTransaction = {
            id: `TXN-VCOLLECT-${Date.now()}`,
            type: 'commission',
            subType: 'platform_revenue',
            amount: vendor.pendingAmount,
            currency: 'EGP',
            description: `Commission collected from ${vendor.name}`,
            reference: `VCOLLECTION-${Date.now()}`,
            entityId: vendor.vendorId,
            entityType: 'vendor',
            entityName: vendor.name,
            status: 'completed',
            createdAt: new Date().toISOString(),
            processedAt: new Date().toISOString(),
            metadata: {
                collectionType: 'scheduled_commission',
                commissionRate: vendor.commissionRate,
            },
        };

        this.mockTransactions.unshift(collectionTransaction);

        // Update vendor commission data
        vendor.lastCollection = new Date().toISOString();
        vendor.pendingAmount = 0;
        vendor.collectionStatus = 'completed';

        return true;
    }

    // Keep the old method name for backward compatibility but redirect to new logic
    async processPharmacyPayout(pharmacyId: string): Promise<boolean> {
        return this.collectPharmacyCommission(pharmacyId);
    }

    async processDoctorPayout(doctorId: string): Promise<boolean> {
        const doctor = this.mockDoctorCommissions.find((d) => d.doctorId === doctorId);
        if (!doctor || doctor.pendingAmount <= 0) return false;

        // Create payout transaction
        const payoutTransaction: MoneyTransaction = {
            id: `TXN-DPAYOUT-${Date.now()}`,
            type: 'payout',
            amount: doctor.pendingAmount,
            currency: 'EGP',
            description: `Commission payout to ${doctor.name}`,
            reference: `DPAYOUT-${Date.now()}`,
            entityId: doctor.doctorId,
            entityType: 'doctor',
            entityName: doctor.name,
            status: 'completed',
            createdAt: new Date().toISOString(),
            processedAt: new Date().toISOString(),
        };

        this.mockTransactions.unshift(payoutTransaction);

        // Update doctor commission data
        doctor.lastPayout = new Date().toISOString();
        doctor.pendingAmount = 0;
        doctor.payoutStatus = 'completed';

        return true;
    }

    // Analytics and reporting
    getCommissionAnalytics(timeframe: string = '30d') {
        const pharmacyTotal = this.mockPharmacyCommissions.reduce(
            (sum, p) => sum + p.commissionOwed,
            0,
        );
        const doctorTotal = this.mockDoctorCommissions.reduce(
            (sum, d) => sum + d.commissionEarned,
            0,
        );
        const platformTotal = this.getTransactionMetrics(timeframe).platformCommission;

        return {
            pharmacy: {
                total: pharmacyTotal,
                pending: this.mockPharmacyCommissions.reduce((sum, p) => sum + p.pendingAmount, 0),
                count: this.mockPharmacyCommissions.length,
            },
            doctor: {
                total: doctorTotal,
                pending: this.mockDoctorCommissions.reduce((sum, d) => sum + d.pendingAmount, 0),
                count: this.mockDoctorCommissions.length,
            },
            platform: {
                total: platformTotal,
                percentage: (platformTotal / (pharmacyTotal + doctorTotal + platformTotal)) * 100,
            },
        };
    }

    getRefundAnalytics(timeframe: string = '30d') {
        const totalRefunds = this.mockRefunds.length;
        const pendingRefunds = this.mockRefunds.filter((r) => r.status === 'pending').length;
        const approvedRefunds = this.mockRefunds.filter(
            (r) => r.status === 'approved' || r.status === 'processed',
        ).length;
        const rejectedRefunds = this.mockRefunds.filter((r) => r.status === 'rejected').length;
        const totalRefundAmount = this.mockRefunds.reduce((sum, r) => sum + r.amount, 0);

        return {
            total: totalRefunds,
            pending: pendingRefunds,
            approved: approvedRefunds,
            rejected: rejectedRefunds,
            totalAmount: totalRefundAmount,
            averageAmount: totalRefunds > 0 ? totalRefundAmount / totalRefunds : 0,
            approvalRate: totalRefunds > 0 ? (approvedRefunds / totalRefunds) * 100 : 0,
        };
    }

    // Get platform revenue breakdown for better understanding
    getPlatformRevenueBreakdown(timeframe: string = '30d') {
        const pharmacyCommissionCollected = this.mockPharmacyCommissions.reduce(
            (sum, p) => sum + p.totalCommissionCollected,
            0,
        );

        const vendorCommissionCollected = this.mockVendorCommissions.reduce(
            (sum, v) => sum + v.totalCommissionCollected,
            0,
        );

        const doctorCommissionsPaid = this.mockDoctorCommissions.reduce(
            (sum, d) => sum + (d.commissionEarned - d.pendingAmount),
            0,
        );

        const grossTransactionVolume = this.mockTransactions
            .filter((t) => t.type === 'order' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const netRevenue =
            pharmacyCommissionCollected + vendorCommissionCollected - doctorCommissionsPaid;

        return {
            grossTransactionVolume,
            pharmacyCommissionCollected,
            vendorCommissionCollected,
            totalCommissionCollected: pharmacyCommissionCollected + vendorCommissionCollected,
            doctorCommissionsPaid,
            netRevenue,
            revenueMargin:
                grossTransactionVolume > 0 ? (netRevenue / grossTransactionVolume) * 100 : 0,
        };
    }

    // Export functionality
    exportTransactionData(
        type: 'all' | 'commissions' | 'refunds' | 'payouts',
        format: 'csv' | 'excel' = 'csv',
    ): string {
        const timestamp = new Date().toISOString().split('T')[0];
        return `cura_money_transactions_${type}_${timestamp}.${format}`;
    }
}

export const moneyTransactionService = new MoneyTransactionService();
