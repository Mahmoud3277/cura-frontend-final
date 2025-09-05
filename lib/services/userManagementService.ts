// User Management Service - Mock data for comprehensive user management
export interface User {
    id: string;
    email: string;
    name: string;
    nameAr: string;
    phone: string;
    userType:
        | 'customer'
        | 'admin'
        | 'pharmacy'
        | 'prescription-reader'
        | 'doctor'
        | 'vendor'
        | 'database-input';
    status: 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
    createdAt: string;
    lastLogin: string;
    city: string;
    governorate: string;
    profileComplete: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    avatar?: string;
    metadata: {
        ordersCount?: number;
        totalSpent?: number;
        commission?: number;
        specialization?: string;
        licenseNumber?: string;
        pharmacyName?: string;
        rating?: number;
        reviewsCount?: number;
    };
}

export interface UserFilters {
    userType?: string;
    status?: string;
    city?: string;
    governorate?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    dateRange?: {
        start: string;
        end: string;
    };
    search?: string;
}

export interface UserStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    suspended: number;
    banned: number;
    byType: {
        customer: number;
        admin: number;
        pharmacy: number;
        'prescription-reader': number;
        doctor: number;
        vendor: number;
        'database-input': number;
    };
    newThisMonth: number;
    growth: number;
}

class UserManagementService {
    private users: User[] = [
        // Customers
        {
            id: 'user-001',
            email: 'ahmed.hassan@email.com',
            name: 'Ahmed Hassan',
            nameAr: 'أحمد حسن',
            phone: '+20 100 123 4567',
            userType: 'customer',
            status: 'active',
            createdAt: '2024-01-15T10:30:00Z',
            lastLogin: '2024-01-20T14:22:00Z',
            city: 'Cairo City',
            governorate: 'Cairo',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            avatar: '/api/placeholder/100/100',
            metadata: {
                ordersCount: 23,
                totalSpent: 2456.5,
            },
        },
        {
            id: 'user-002',
            email: 'fatima.ali@email.com',
            name: 'Fatima Ali',
            nameAr: 'فاطمة علي',
            phone: '+20 101 234 5678',
            userType: 'customer',
            status: 'active',
            createdAt: '2024-01-18T09:15:00Z',
            lastLogin: '2024-01-20T16:45:00Z',
            city: 'Ismailia City',
            governorate: 'Ismailia',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: false,
            metadata: {
                ordersCount: 8,
                totalSpent: 567.25,
            },
        },
        {
            id: 'user-003',
            email: 'omar.mohamed@email.com',
            name: 'Omar Mohamed',
            nameAr: 'عمر محمد',
            phone: '+20 102 345 6789',
            userType: 'customer',
            status: 'pending',
            createdAt: '2024-01-20T11:20:00Z',
            lastLogin: '2024-01-20T11:20:00Z',
            city: 'Alexandria City',
            governorate: 'Alexandria',
            profileComplete: false,
            emailVerified: false,
            phoneVerified: false,
            metadata: {
                ordersCount: 0,
                totalSpent: 0,
            },
        },

        // Pharmacies
        {
            id: 'user-004',
            email: 'manager@healthplus-ismailia.com',
            name: 'Dr. Mahmoud Farid',
            nameAr: 'د. محمود فريد',
            phone: '+20 64 391 2345',
            userType: 'pharmacy',
            status: 'active',
            createdAt: '2023-12-01T08:00:00Z',
            lastLogin: '2024-01-20T13:30:00Z',
            city: 'Ismailia City',
            governorate: 'Ismailia',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                pharmacyName: 'HealthPlus Pharmacy',
                licenseNumber: 'PH-ISM-2023-001',
                commission: 12,
                rating: 4.8,
                reviewsCount: 124,
                ordersCount: 234,
            },
        },
        {
            id: 'user-005',
            email: 'admin@medicare-cairo.com',
            name: 'Dr. Sarah Abdel Rahman',
            nameAr: 'د. سارة عبد الرحمن',
            phone: '+20 2 2391 5678',
            userType: 'pharmacy',
            status: 'active',
            createdAt: '2023-11-15T10:00:00Z',
            lastLogin: '2024-01-20T15:45:00Z',
            city: 'Cairo City',
            governorate: 'Cairo',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                pharmacyName: 'MediCare Pharmacy',
                licenseNumber: 'PH-CAI-2023-002',
                commission: 8,
                rating: 4.9,
                reviewsCount: 267,
                ordersCount: 456,
            },
        },
        {
            id: 'user-006',
            email: 'contact@newpharmacy-giza.com',
            name: 'Dr. Khaled Mostafa',
            nameAr: 'د. خالد مصطفى',
            phone: '+20 2 3391 9999',
            userType: 'pharmacy',
            status: 'pending',
            createdAt: '2024-01-19T14:30:00Z',
            lastLogin: '2024-01-19T14:30:00Z',
            city: 'Giza City',
            governorate: 'Giza',
            profileComplete: false,
            emailVerified: true,
            phoneVerified: false,
            metadata: {
                pharmacyName: 'New Life Pharmacy',
                licenseNumber: 'PH-GIZ-2024-001',
                commission: 10,
            },
        },

        // Doctors
        {
            id: 'user-007',
            email: 'dr.ahmed.cardio@hospital.com',
            name: 'Dr. Ahmed Youssef',
            nameAr: 'د. أحمد يوسف',
            phone: '+20 100 987 6543',
            userType: 'doctor',
            status: 'active',
            createdAt: '2023-10-20T09:00:00Z',
            lastLogin: '2024-01-20T12:15:00Z',
            city: 'Cairo City',
            governorate: 'Cairo',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                specialization: 'Cardiology',
                licenseNumber: 'DR-CAI-2023-001',
                commission: 15,
                rating: 4.9,
                reviewsCount: 89,
            },
        },
        {
            id: 'user-008',
            email: 'dr.mona.pediatric@clinic.com',
            name: 'Dr. Mona Salah',
            nameAr: 'د. منى صلاح',
            phone: '+20 101 876 5432',
            userType: 'doctor',
            status: 'active',
            createdAt: '2023-11-10T11:30:00Z',
            lastLogin: '2024-01-20T10:20:00Z',
            city: 'Ismailia City',
            governorate: 'Ismailia',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                specialization: 'Pediatrics',
                licenseNumber: 'DR-ISM-2023-002',
                commission: 18,
                rating: 4.7,
                reviewsCount: 156,
            },
        },

        // Prescription Readers
        {
            id: 'user-009',
            email: 'reader1@cura-platform.com',
            name: 'Pharmacist Nour Hassan',
            nameAr: 'صيدلي نور حسن',
            phone: '+20 102 765 4321',
            userType: 'prescription-reader',
            status: 'active',
            createdAt: '2023-12-05T13:00:00Z',
            lastLogin: '2024-01-20T16:30:00Z',
            city: 'Cairo City',
            governorate: 'Cairo',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                licenseNumber: 'PR-CAI-2023-001',
                specialization: 'Prescription Analysis',
            },
        },
        {
            id: 'user-010',
            email: 'reader2@cura-platform.com',
            name: 'Pharmacist Youssef Ali',
            nameAr: 'صيدلي يوسف علي',
            phone: '+20 103 654 3210',
            userType: 'prescription-reader',
            status: 'active',
            createdAt: '2023-12-10T14:15:00Z',
            lastLogin: '2024-01-20T14:45:00Z',
            city: 'Ismailia City',
            governorate: 'Ismailia',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                licenseNumber: 'PR-ISM-2023-002',
                specialization: 'Prescription Analysis',
            },
        },

        // Vendors
        {
            id: 'user-011',
            email: 'supplier@pharma-egypt.com',
            name: 'Mohamed Farouk',
            nameAr: 'محمد فاروق',
            phone: '+20 100 543 2109',
            userType: 'vendor',
            status: 'active',
            createdAt: '2023-09-15T10:00:00Z',
            lastLogin: '2024-01-20T11:30:00Z',
            city: 'Cairo City',
            governorate: 'Cairo',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                licenseNumber: 'VN-CAI-2023-001',
                specialization: 'Pharmaceutical Supplier',
            },
        },

        // Database Input Users
        {
            id: 'user-012',
            email: 'data.entry@cura-platform.com',
            name: 'Aya Mahmoud',
            nameAr: 'آية محمود',
            phone: '+20 101 432 1098',
            userType: 'database-input',
            status: 'active',
            createdAt: '2023-11-01T09:30:00Z',
            lastLogin: '2024-01-20T15:20:00Z',
            city: 'Cairo City',
            governorate: 'Cairo',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                specialization: 'Product Data Management',
            },
        },

        // Admins
        {
            id: 'user-013',
            email: 'admin@cura-platform.com',
            name: 'System Administrator',
            nameAr: 'مدير النظام',
            phone: '+20 100 000 0000',
            userType: 'admin',
            status: 'active',
            createdAt: '2023-08-01T08:00:00Z',
            lastLogin: '2024-01-20T17:00:00Z',
            city: 'Cairo City',
            governorate: 'Cairo',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                specialization: 'System Administration',
            },
        },

        // More users for testing...
        {
            id: 'user-014',
            email: 'suspended.user@email.com',
            name: 'Suspended User',
            nameAr: 'مستخدم موقوف',
            phone: '+20 104 321 0987',
            userType: 'customer',
            status: 'suspended',
            createdAt: '2024-01-10T12:00:00Z',
            lastLogin: '2024-01-15T10:30:00Z',
            city: 'Alexandria City',
            governorate: 'Alexandria',
            profileComplete: true,
            emailVerified: true,
            phoneVerified: true,
            metadata: {
                ordersCount: 5,
                totalSpent: 234.5,
            },
        },
    ];

    // Get all users with filtering
    getUsers(filters?: UserFilters): User[] {
        let filteredUsers = [...this.users];

        if (filters) {
            if (filters.userType) {
                filteredUsers = filteredUsers.filter((user) => user.userType === filters.userType);
            }
            if (filters.status) {
                filteredUsers = filteredUsers.filter((user) => user.status === filters.status);
            }
            if (filters.city) {
                filteredUsers = filteredUsers.filter((user) => user.city === filters.city);
            }
            if (filters.governorate) {
                filteredUsers = filteredUsers.filter(
                    (user) => user.governorate === filters.governorate,
                );
            }
            if (filters.emailVerified !== undefined) {
                filteredUsers = filteredUsers.filter(
                    (user) => user.emailVerified === filters.emailVerified,
                );
            }
            if (filters.phoneVerified !== undefined) {
                filteredUsers = filteredUsers.filter(
                    (user) => user.phoneVerified === filters.phoneVerified,
                );
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredUsers = filteredUsers.filter(
                    (user) =>
                        user.name.toLowerCase().includes(searchTerm) ||
                        user.email.toLowerCase().includes(searchTerm) ||
                        user.phone.includes(searchTerm) ||
                        user.nameAr.includes(filters.search!),
                );
            }
        }

        return filteredUsers;
    }

    // Get user by ID
    getUserById(id: string): User | undefined {
        return this.users.find((user) => user.id === id);
    }

    // Get user statistics
    getUserStats(): UserStats {
        const total = this.users.length;
        const active = this.users.filter((u) => u.status === 'active').length;
        const inactive = this.users.filter((u) => u.status === 'inactive').length;
        const pending = this.users.filter((u) => u.status === 'pending').length;
        const suspended = this.users.filter((u) => u.status === 'suspended').length;
        const banned = this.users.filter((u) => u.status === 'banned').length;

        const byType = {
            customer: this.users.filter((u) => u.userType === 'customer').length,
            admin: this.users.filter((u) => u.userType === 'admin').length,
            pharmacy: this.users.filter((u) => u.userType === 'pharmacy').length,
            'prescription-reader': this.users.filter((u) => u.userType === 'prescription-reader')
                .length,
            doctor: this.users.filter((u) => u.userType === 'doctor').length,
            vendor: this.users.filter((u) => u.userType === 'vendor').length,
            'database-input': this.users.filter((u) => u.userType === 'database-input').length,
        };

        // Mock new users this month
        const newThisMonth = 23;
        const growth = 12.5;

        return {
            total,
            active,
            inactive,
            pending,
            suspended,
            banned,
            byType,
            newThisMonth,
            growth,
        };
    }

    // Update user status
    updateUserStatus(userId: string, status: User['status']): boolean {
        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].status = status;
            return true;
        }
        return false;
    }

    // Delete user
    deleteUser(userId: string): boolean {
        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return true;
        }
        return false;
    }

    // Get user types for filtering
    getUserTypes() {
        return [
            { value: 'customer', label: 'Customer', labelAr: 'عميل' },
            { value: 'pharmacy', label: 'Pharmacy', labelAr: 'صيدلية' },
            { value: 'doctor', label: 'Doctor', labelAr: 'طبيب' },
            { value: 'prescription-reader', label: 'Prescription Reader', labelAr: 'قارئ الوصفات' },
            { value: 'vendor', label: 'Vendor', labelAr: 'مورد' },
            { value: 'database-input', label: 'Database Input', labelAr: 'إدخال البيانات' },
            { value: 'admin', label: 'Admin', labelAr: 'مدير' },
        ];
    }

    // Get status options
    getStatusOptions() {
        return [
            { value: 'active', label: 'Active', labelAr: 'نشط', color: 'green' },
            { value: 'inactive', label: 'Inactive', labelAr: 'غير نشط', color: 'gray' },
            { value: 'pending', label: 'Pending', labelAr: 'في الانتظار', color: 'yellow' },
            { value: 'suspended', label: 'Suspended', labelAr: 'موقوف', color: 'orange' },
            { value: 'banned', label: 'Banned', labelAr: 'محظور', color: 'red' },
        ];
    }
}

export const userManagementService = new UserManagementService();
