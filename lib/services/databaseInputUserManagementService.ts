// Database Input User Management Service - Comprehensive database input user administration
export interface DatabaseInputUserDetails {
    id: string;
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    whatsapp?: string;
    employeeId: string;
    department: string;
    position: string;
    positionAr: string;
    accessLevel: 'basic' | 'advanced' | 'supervisor' | 'manager';
    status: 'active' | 'inactive' | 'pending' | 'suspended' | 'training';
    permissions: {
        canAddProducts: boolean;
        canEditProducts: boolean;
        canDeleteProducts: boolean;
        canManageCategories: boolean;
        canManageBrands: boolean;
        canApproveProducts: boolean;
        canExportData: boolean;
        canImportData: boolean;
        canViewReports: boolean;
        canManageInventory: boolean;
    };
    specializations: string[];
    assignedCategories: string[];
    assignedVendors: string[];
    performance: {
        totalProductsAdded: number;
        totalProductsEdited: number;
        totalProductsApproved: number;
        totalProductsRejected: number;
        averageProcessingTime: number; // in minutes
        accuracyRate: number; // percentage
        productivityScore: number;
        monthlyTargets: {
            productsToAdd: number;
            productsToReview: number;
            categoriesTarget: number;
        };
        monthlyAchieved: {
            productsAdded: number;
            productsReviewed: number;
            categoriesCompleted: number;
        };
        qualityMetrics: {
            dataAccuracy: number;
            completenessScore: number;
            consistencyScore: number;
            errorRate: number;
        };
    };
    workSchedule: {
        workingHours: {
            monday: { start: string; end: string; isWorking: boolean };
            tuesday: { start: string; end: string; isWorking: boolean };
            wednesday: { start: string; end: string; isWorking: boolean };
            thursday: { start: string; end: string; isWorking: boolean };
            friday: { start: string; end: string; isWorking: boolean };
            saturday: { start: string; end: string; isWorking: boolean };
            sunday: { start: string; end: string; isWorking: boolean };
        };
        shiftType: 'morning' | 'evening' | 'night' | 'flexible';
        overtimeHours: number;
        breakTime: number; // in minutes
    };
    trainingInfo: {
        completedTraining: string[];
        pendingTraining: string[];
        certifications: string[];
        lastTrainingDate: string;
        nextTrainingDue: string;
        trainingScore: number;
    };
    systemAccess: {
        lastLogin: string;
        totalLogins: number;
        averageSessionTime: number; // in minutes
        systemsAccess: string[];
        ipRestrictions: string[];
        deviceRestrictions: string[];
    };
    contactInfo: {
        emergencyContact: {
            name: string;
            relationship: string;
            phone: string;
        };
        address: string;
        addressAr: string;
        cityId: string;
        cityName: string;
        governorateId: string;
        governorateName: string;
    };
    employmentInfo: {
        hireDate: string;
        contractType: 'full_time' | 'part_time' | 'contract' | 'intern';
        salary: number;
        benefits: string[];
        reportingManager: string;
        teamMembers: string[];
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    lastModifiedBy: string;
    notes?: string;
}

export interface DatabaseInputTask {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    type:
        | 'product_entry'
        | 'product_review'
        | 'category_management'
        | 'inventory_update'
        | 'data_cleanup'
        | 'quality_check';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    assignedTo: string;
    assignedBy: string;
    category: string;
    vendor?: string;
    estimatedTime: number; // in minutes
    actualTime?: number; // in minutes
    dueDate: string;
    startedAt?: string;
    completedAt?: string;
    progress: number; // percentage
    requirements: string[];
    deliverables: string[];
    qualityChecks: {
        dataAccuracy: boolean;
        completeness: boolean;
        consistency: boolean;
        formatting: boolean;
    };
    feedback?: string;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
}

export interface DatabaseInputUserFilters {
    status?: string;
    accessLevel?: string;
    department?: string;
    specialization?: string;
    cityId?: string;
    governorateId?: string;
    search?: string;
    contractType?: string;
    shiftType?: string;
}

export interface DatabaseInputUserStats {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    training: number;
    averageProductivity: number;
    averageAccuracy: number;
    totalProductsProcessed: number;
    totalTasksCompleted: number;
    byAccessLevel: {
        level: string;
        count: number;
        productivity: number;
        accuracy: number;
    }[];
    byDepartment: {
        department: string;
        count: number;
        productivity: number;
        tasksCompleted: number;
    }[];
    bySpecialization: {
        specialization: string;
        userCount: number;
        productsProcessed: number;
        accuracy: number;
    }[];
    byCity: {
        cityId: string;
        cityName: string;
        count: number;
        productivity: number;
    }[];
    byStatus: {
        active: number;
        pending: number;
        suspended: number;
        training: number;
    };
    recentHires: number;
    growth: number;
    topPerformers: {
        userId: string;
        userName: string;
        productivity: number;
        accuracy: number;
        tasksCompleted: number;
        specialization: string;
    }[];
    monthlyTargets: {
        totalTargets: number;
        achieved: number;
        percentage: number;
    };
}

class DatabaseInputUserManagementService {
    private users: DatabaseInputUserDetails[] = [
        {
            id: 'db-user-001',
            name: 'Amira Hassan',
            nameAr: 'أميرة حسن',
            email: 'amira.hassan@cura.com',
            phone: '+20 100 123 4567',
            whatsapp: '+20 100 123 4567',
            employeeId: 'EMP-DB-001',
            department: 'Data Management',
            position: 'Senior Data Entry Specialist',
            positionAr: 'أخصائي إدخال بيانات أول',
            accessLevel: 'advanced',
            status: 'active',
            permissions: {
                canAddProducts: true,
                canEditProducts: true,
                canDeleteProducts: false,
                canManageCategories: true,
                canManageBrands: true,
                canApproveProducts: true,
                canExportData: true,
                canImportData: true,
                canViewReports: true,
                canManageInventory: true,
            },
            specializations: ['prescription_medicines', 'medical_equipment'],
            assignedCategories: ['prescription', 'medical', 'equipment'],
            assignedVendors: ['vendor-pharmatech', 'vendor-mediplus'],
            performance: {
                totalProductsAdded: 1245,
                totalProductsEdited: 567,
                totalProductsApproved: 890,
                totalProductsRejected: 45,
                averageProcessingTime: 8.5,
                accuracyRate: 96.8,
                productivityScore: 92.5,
                monthlyTargets: {
                    productsToAdd: 150,
                    productsToReview: 200,
                    categoriesTarget: 5,
                },
                monthlyAchieved: {
                    productsAdded: 142,
                    productsReviewed: 189,
                    categoriesCompleted: 4,
                },
                qualityMetrics: {
                    dataAccuracy: 96.8,
                    completenessScore: 94.2,
                    consistencyScore: 95.5,
                    errorRate: 3.2,
                },
            },
            workSchedule: {
                workingHours: {
                    monday: { start: '09:00', end: '17:00', isWorking: true },
                    tuesday: { start: '09:00', end: '17:00', isWorking: true },
                    wednesday: { start: '09:00', end: '17:00', isWorking: true },
                    thursday: { start: '09:00', end: '17:00', isWorking: true },
                    friday: { start: '09:00', end: '15:00', isWorking: true },
                    saturday: { start: '00:00', end: '00:00', isWorking: false },
                    sunday: { start: '00:00', end: '00:00', isWorking: false },
                },
                shiftType: 'morning',
                overtimeHours: 5,
                breakTime: 60,
            },
            trainingInfo: {
                completedTraining: ['Product Data Entry', 'Quality Control', 'System Security'],
                pendingTraining: ['Advanced Analytics'],
                certifications: ['Data Management Certified', 'Quality Assurance Level 2'],
                lastTrainingDate: '2024-01-10T10:00:00Z',
                nextTrainingDue: '2024-04-10T10:00:00Z',
                trainingScore: 88.5,
            },
            systemAccess: {
                lastLogin: '2024-01-20T08:30:00Z',
                totalLogins: 245,
                averageSessionTime: 420,
                systemsAccess: ['Product Management', 'Inventory System', 'Quality Control'],
                ipRestrictions: ['192.168.1.0/24'],
                deviceRestrictions: ['desktop', 'laptop'],
            },
            contactInfo: {
                emergencyContact: {
                    name: 'Mohamed Hassan',
                    relationship: 'Husband',
                    phone: '+20 101 234 5678',
                },
                address: '15 Nasr City, Cairo',
                addressAr: '15 مدينة نصر، القاهرة',
                cityId: 'cairo-city',
                cityName: 'Cairo City',
                governorateId: 'cairo',
                governorateName: 'Cairo',
            },
            employmentInfo: {
                hireDate: '2023-06-01T00:00:00Z',
                contractType: 'full_time',
                salary: 8000,
                benefits: ['Health Insurance', 'Transportation', 'Training Budget'],
                reportingManager: 'db-user-supervisor-001',
                teamMembers: ['db-user-002', 'db-user-003'],
            },
            createdAt: '2023-06-01T08:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z',
            createdBy: 'admin-001',
            lastModifiedBy: 'admin-001',
        },
        {
            id: 'db-user-002',
            name: 'Khaled Mahmoud',
            nameAr: 'خالد محمود',
            email: 'khaled.mahmoud@cura.com',
            phone: '+20 101 234 5678',
            whatsapp: '+20 101 234 5678',
            employeeId: 'EMP-DB-002',
            department: 'Data Management',
            position: 'Data Entry Specialist',
            positionAr: 'أخصائي إدخال بيانات',
            accessLevel: 'basic',
            status: 'active',
            permissions: {
                canAddProducts: true,
                canEditProducts: true,
                canDeleteProducts: false,
                canManageCategories: false,
                canManageBrands: false,
                canApproveProducts: false,
                canExportData: false,
                canImportData: false,
                canViewReports: true,
                canManageInventory: false,
            },
            specializations: ['supplements', 'vitamins'],
            assignedCategories: ['supplements', 'vitamins', 'skincare'],
            assignedVendors: ['vendor-wellness'],
            performance: {
                totalProductsAdded: 678,
                totalProductsEdited: 234,
                totalProductsApproved: 0,
                totalProductsRejected: 0,
                averageProcessingTime: 12.3,
                accuracyRate: 89.2,
                productivityScore: 78.5,
                monthlyTargets: {
                    productsToAdd: 100,
                    productsToReview: 0,
                    categoriesTarget: 3,
                },
                monthlyAchieved: {
                    productsAdded: 95,
                    productsReviewed: 0,
                    categoriesCompleted: 3,
                },
                qualityMetrics: {
                    dataAccuracy: 89.2,
                    completenessScore: 87.5,
                    consistencyScore: 88.8,
                    errorRate: 10.8,
                },
            },
            workSchedule: {
                workingHours: {
                    monday: { start: '10:00', end: '18:00', isWorking: true },
                    tuesday: { start: '10:00', end: '18:00', isWorking: true },
                    wednesday: { start: '10:00', end: '18:00', isWorking: true },
                    thursday: { start: '10:00', end: '18:00', isWorking: true },
                    friday: { start: '10:00', end: '16:00', isWorking: true },
                    saturday: { start: '00:00', end: '00:00', isWorking: false },
                    sunday: { start: '00:00', end: '00:00', isWorking: false },
                },
                shiftType: 'morning',
                overtimeHours: 2,
                breakTime: 60,
            },
            trainingInfo: {
                completedTraining: ['Basic Data Entry', 'System Navigation'],
                pendingTraining: ['Quality Control', 'Advanced Product Management'],
                certifications: ['Basic Data Entry Certified'],
                lastTrainingDate: '2023-12-15T10:00:00Z',
                nextTrainingDue: '2024-03-15T10:00:00Z',
                trainingScore: 75.2,
            },
            systemAccess: {
                lastLogin: '2024-01-19T09:15:00Z',
                totalLogins: 156,
                averageSessionTime: 380,
                systemsAccess: ['Product Management'],
                ipRestrictions: ['192.168.1.0/24'],
                deviceRestrictions: ['desktop'],
            },
            contactInfo: {
                emergencyContact: {
                    name: 'Fatima Mahmoud',
                    relationship: 'Sister',
                    phone: '+20 102 345 6789',
                },
                address: '45 Ismailia City',
                addressAr: '45 مدينة الإسماعيلية',
                cityId: 'ismailia-city',
                cityName: 'Ismailia City',
                governorateId: 'ismailia',
                governorateName: 'Ismailia',
            },
            employmentInfo: {
                hireDate: '2023-09-15T00:00:00Z',
                contractType: 'full_time',
                salary: 5500,
                benefits: ['Health Insurance', 'Transportation'],
                reportingManager: 'db-user-001',
                teamMembers: [],
            },
            createdAt: '2023-09-15T08:00:00Z',
            updatedAt: '2024-01-19T12:20:00Z',
            createdBy: 'admin-001',
            lastModifiedBy: 'db-user-001',
        },
        {
            id: 'db-user-003',
            name: 'Sara Ahmed',
            nameAr: 'سارة أحمد',
            email: 'sara.ahmed@cura.com',
            phone: '+20 102 345 6789',
            whatsapp: '+20 102 345 6789',
            employeeId: 'EMP-DB-003',
            department: 'Quality Control',
            position: 'Quality Control Specialist',
            positionAr: 'أخصائي مراقبة الجودة',
            accessLevel: 'supervisor',
            status: 'active',
            permissions: {
                canAddProducts: false,
                canEditProducts: true,
                canDeleteProducts: false,
                canManageCategories: false,
                canManageBrands: false,
                canApproveProducts: true,
                canExportData: true,
                canImportData: false,
                canViewReports: true,
                canManageInventory: false,
            },
            specializations: ['quality_control', 'data_validation'],
            assignedCategories: ['prescription', 'otc', 'supplements', 'medical'],
            assignedVendors: ['vendor-pharmatech', 'vendor-mediplus', 'vendor-wellness'],
            performance: {
                totalProductsAdded: 0,
                totalProductsEdited: 456,
                totalProductsApproved: 1234,
                totalProductsRejected: 89,
                averageProcessingTime: 6.8,
                accuracyRate: 98.5,
                productivityScore: 95.2,
                monthlyTargets: {
                    productsToAdd: 0,
                    productsToReview: 300,
                    categoriesTarget: 0,
                },
                monthlyAchieved: {
                    productsAdded: 0,
                    productsReviewed: 287,
                    categoriesCompleted: 0,
                },
                qualityMetrics: {
                    dataAccuracy: 98.5,
                    completenessScore: 97.8,
                    consistencyScore: 98.2,
                    errorRate: 1.5,
                },
            },
            workSchedule: {
                workingHours: {
                    monday: { start: '08:00', end: '16:00', isWorking: true },
                    tuesday: { start: '08:00', end: '16:00', isWorking: true },
                    wednesday: { start: '08:00', end: '16:00', isWorking: true },
                    thursday: { start: '08:00', end: '16:00', isWorking: true },
                    friday: { start: '08:00', end: '14:00', isWorking: true },
                    saturday: { start: '00:00', end: '00:00', isWorking: false },
                    sunday: { start: '00:00', end: '00:00', isWorking: false },
                },
                shiftType: 'morning',
                overtimeHours: 3,
                breakTime: 45,
            },
            trainingInfo: {
                completedTraining: [
                    'Quality Control Advanced',
                    'Data Validation',
                    'Team Leadership',
                ],
                pendingTraining: ['Process Improvement'],
                certifications: ['Quality Control Expert', 'Data Validation Specialist'],
                lastTrainingDate: '2024-01-05T10:00:00Z',
                nextTrainingDue: '2024-07-05T10:00:00Z',
                trainingScore: 94.8,
            },
            systemAccess: {
                lastLogin: '2024-01-20T07:45:00Z',
                totalLogins: 198,
                averageSessionTime: 360,
                systemsAccess: ['Product Management', 'Quality Control', 'Reports'],
                ipRestrictions: ['192.168.1.0/24'],
                deviceRestrictions: ['desktop', 'laptop'],
            },
            contactInfo: {
                emergencyContact: {
                    name: 'Ahmed Ali',
                    relationship: 'Father',
                    phone: '+20 103 456 7890',
                },
                address: '78 Giza City',
                addressAr: '78 مدينة الجيزة',
                cityId: 'giza-city',
                cityName: 'Giza City',
                governorateId: 'giza',
                governorateName: 'Giza',
            },
            employmentInfo: {
                hireDate: '2023-04-01T00:00:00Z',
                contractType: 'full_time',
                salary: 9500,
                benefits: [
                    'Health Insurance',
                    'Transportation',
                    'Training Budget',
                    'Performance Bonus',
                ],
                reportingManager: 'db-user-manager-001',
                teamMembers: ['db-user-001', 'db-user-002'],
            },
            createdAt: '2023-04-01T08:00:00Z',
            updatedAt: '2024-01-20T10:15:00Z',
            createdBy: 'admin-001',
            lastModifiedBy: 'admin-001',
        },
        {
            id: 'db-user-004',
            name: 'Omar Khalil',
            nameAr: 'عمر خليل',
            email: 'omar.khalil@cura.com',
            phone: '+20 103 456 7890',
            whatsapp: '+20 103 456 7890',
            employeeId: 'EMP-DB-004',
            department: 'Data Management',
            position: 'Junior Data Entry Specialist',
            positionAr: 'أخصائي إدخال بيانات مبتدئ',
            accessLevel: 'basic',
            status: 'training',
            permissions: {
                canAddProducts: true,
                canEditProducts: false,
                canDeleteProducts: false,
                canManageCategories: false,
                canManageBrands: false,
                canApproveProducts: false,
                canExportData: false,
                canImportData: false,
                canViewReports: false,
                canManageInventory: false,
            },
            specializations: ['baby_care', 'skincare'],
            assignedCategories: ['baby', 'skincare'],
            assignedVendors: ['vendor-wellness'],
            performance: {
                totalProductsAdded: 123,
                totalProductsEdited: 0,
                totalProductsApproved: 0,
                totalProductsRejected: 0,
                averageProcessingTime: 18.5,
                accuracyRate: 72.3,
                productivityScore: 65.8,
                monthlyTargets: {
                    productsToAdd: 50,
                    productsToReview: 0,
                    categoriesTarget: 2,
                },
                monthlyAchieved: {
                    productsAdded: 35,
                    productsReviewed: 0,
                    categoriesCompleted: 1,
                },
                qualityMetrics: {
                    dataAccuracy: 72.3,
                    completenessScore: 68.9,
                    consistencyScore: 71.5,
                    errorRate: 27.7,
                },
            },
            workSchedule: {
                workingHours: {
                    monday: { start: '09:00', end: '17:00', isWorking: true },
                    tuesday: { start: '09:00', end: '17:00', isWorking: true },
                    wednesday: { start: '09:00', end: '17:00', isWorking: true },
                    thursday: { start: '09:00', end: '17:00', isWorking: true },
                    friday: { start: '09:00', end: '15:00', isWorking: true },
                    saturday: { start: '00:00', end: '00:00', isWorking: false },
                    sunday: { start: '00:00', end: '00:00', isWorking: false },
                },
                shiftType: 'morning',
                overtimeHours: 0,
                breakTime: 60,
            },
            trainingInfo: {
                completedTraining: ['Basic System Training'],
                pendingTraining: ['Product Data Entry', 'Quality Standards', 'System Security'],
                certifications: [],
                lastTrainingDate: '2024-01-15T10:00:00Z',
                nextTrainingDue: '2024-02-15T10:00:00Z',
                trainingScore: 68.5,
            },
            systemAccess: {
                lastLogin: '2024-01-19T10:30:00Z',
                totalLogins: 45,
                averageSessionTime: 240,
                systemsAccess: ['Product Management (Limited)'],
                ipRestrictions: ['192.168.1.0/24'],
                deviceRestrictions: ['desktop'],
            },
            contactInfo: {
                emergencyContact: {
                    name: 'Mona Khalil',
                    relationship: 'Mother',
                    phone: '+20 104 567 8901',
                },
                address: '23 Alexandria City',
                addressAr: '23 مدينة الإسكندرية',
                cityId: 'alexandria-city',
                cityName: 'Alexandria City',
                governorateId: 'alexandria',
                governorateName: 'Alexandria',
            },
            employmentInfo: {
                hireDate: '2024-01-01T00:00:00Z',
                contractType: 'full_time',
                salary: 4500,
                benefits: ['Health Insurance'],
                reportingManager: 'db-user-001',
                teamMembers: [],
            },
            createdAt: '2024-01-01T08:00:00Z',
            updatedAt: '2024-01-19T16:45:00Z',
            createdBy: 'admin-001',
            lastModifiedBy: 'db-user-001',
        },
    ];

    private tasks: DatabaseInputTask[] = [
        {
            id: 'task-001',
            title: 'Add New Vitamin Products',
            titleAr: 'إضافة منتجات فيتامينات جديدة',
            description: 'Add 50 new vitamin products from Wellness vendor catalog',
            descriptionAr: 'إضافة 50 منتج فيتامين جديد من كتالوج مورد العافية',
            type: 'product_entry',
            priority: 'medium',
            status: 'in_progress',
            assignedTo: 'db-user-002',
            assignedBy: 'db-user-001',
            category: 'vitamins',
            vendor: 'vendor-wellness',
            estimatedTime: 300,
            actualTime: 180,
            dueDate: '2024-01-25T17:00:00Z',
            startedAt: '2024-01-20T10:00:00Z',
            progress: 60,
            requirements: [
                'Product specifications',
                'Pricing information',
                'Images',
                'Vendor approval',
            ],
            deliverables: ['Product entries', 'Category assignments', 'Inventory setup'],
            qualityChecks: {
                dataAccuracy: true,
                completeness: false,
                consistency: true,
                formatting: true,
            },
            attachments: ['/documents/vitamin-catalog.pdf'],
            createdAt: '2024-01-20T09:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z',
        },
        {
            id: 'task-002',
            title: 'Quality Review - Medical Equipment',
            titleAr: 'مراجعة الجودة - المعدات الطبية',
            description: 'Review and approve 100 medical equipment products',
            descriptionAr: 'مراجعة والموافقة على 100 منتج من المعدات الطبية',
            type: 'quality_check',
            priority: 'high',
            status: 'pending',
            assignedTo: 'db-user-003',
            assignedBy: 'db-user-001',
            category: 'medical',
            vendor: 'vendor-mediplus',
            estimatedTime: 480,
            dueDate: '2024-01-22T16:00:00Z',
            progress: 0,
            requirements: ['Product verification', 'Compliance check', 'Documentation review'],
            deliverables: ['Approval status', 'Quality report', 'Recommendations'],
            qualityChecks: {
                dataAccuracy: false,
                completeness: false,
                consistency: false,
                formatting: false,
            },
            attachments: ['/documents/medical-equipment-list.xlsx'],
            createdAt: '2024-01-19T14:00:00Z',
            updatedAt: '2024-01-19T14:00:00Z',
        },
    ];

    // Get all database input users with filtering
    getDatabaseInputUsers(filters?: DatabaseInputUserFilters): DatabaseInputUserDetails[] {
        let filteredUsers = [...this.users];

        if (filters) {
            if (filters.status) {
                filteredUsers = filteredUsers.filter((u) => u.status === filters.status);
            }
            if (filters.accessLevel) {
                filteredUsers = filteredUsers.filter((u) => u.accessLevel === filters.accessLevel);
            }
            if (filters.department) {
                filteredUsers = filteredUsers.filter((u) => u.department === filters.department);
            }
            if (filters.specialization) {
                filteredUsers = filteredUsers.filter((u) =>
                    u.specializations.includes(filters.specialization!),
                );
            }
            if (filters.cityId) {
                filteredUsers = filteredUsers.filter(
                    (u) => u.contactInfo.cityId === filters.cityId,
                );
            }
            if (filters.governorateId) {
                filteredUsers = filteredUsers.filter(
                    (u) => u.contactInfo.governorateId === filters.governorateId,
                );
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredUsers = filteredUsers.filter(
                    (u) =>
                        u.name.toLowerCase().includes(searchTerm) ||
                        u.nameAr.includes(filters.search!) ||
                        u.email.toLowerCase().includes(searchTerm) ||
                        u.phone.includes(searchTerm) ||
                        u.employeeId.toLowerCase().includes(searchTerm) ||
                        u.position.toLowerCase().includes(searchTerm) ||
                        u.positionAr.includes(filters.search!),
                );
            }
            if (filters.contractType) {
                filteredUsers = filteredUsers.filter(
                    (u) => u.employmentInfo.contractType === filters.contractType,
                );
            }
            if (filters.shiftType) {
                filteredUsers = filteredUsers.filter(
                    (u) => u.workSchedule.shiftType === filters.shiftType,
                );
            }
        }

        return filteredUsers;
    }

    // Get user by ID
    getDatabaseInputUserById(id: string): DatabaseInputUserDetails | undefined {
        return this.users.find((u) => u.id === id);
    }

    // Get database input user statistics
    getDatabaseInputUserStats(): DatabaseInputUserStats {
        const total = this.users.length;
        const active = this.users.filter((u) => u.status === 'active').length;
        const pending = this.users.filter((u) => u.status === 'pending').length;
        const suspended = this.users.filter((u) => u.status === 'suspended').length;
        const training = this.users.filter((u) => u.status === 'training').length;

        const averageProductivity =
            this.users.reduce((sum, u) => sum + u.performance.productivityScore, 0) / total;
        const averageAccuracy =
            this.users.reduce((sum, u) => sum + u.performance.accuracyRate, 0) / total;
        const totalProductsProcessed = this.users.reduce(
            (sum, u) => sum + u.performance.totalProductsAdded + u.performance.totalProductsEdited,
            0,
        );
        const totalTasksCompleted = this.users.reduce(
            (sum, u) =>
                sum +
                u.performance.monthlyAchieved.productsAdded +
                u.performance.monthlyAchieved.productsReviewed,
            0,
        );

        // Group by access level
        const accessLevelGroups = this.users.reduce(
            (acc, user) => {
                const existing = acc.find((a) => a.level === user.accessLevel);
                if (existing) {
                    existing.count++;
                    existing.productivity += user.performance.productivityScore;
                    existing.accuracy += user.performance.accuracyRate;
                } else {
                    acc.push({
                        level: user.accessLevel,
                        count: 1,
                        productivity: user.performance.productivityScore,
                        accuracy: user.performance.accuracyRate,
                    });
                }
                return acc;
            },
            [] as { level: string; count: number; productivity: number; accuracy: number }[],
        );

        // Calculate averages for access levels
        accessLevelGroups.forEach((group) => {
            group.productivity = group.productivity / group.count;
            group.accuracy = group.accuracy / group.count;
        });

        // Group by department
        const departmentGroups = this.users.reduce(
            (acc, user) => {
                const existing = acc.find((d) => d.department === user.department);
                const tasksCompleted =
                    user.performance.monthlyAchieved.productsAdded +
                    user.performance.monthlyAchieved.productsReviewed;
                if (existing) {
                    existing.count++;
                    existing.productivity += user.performance.productivityScore;
                    existing.tasksCompleted += tasksCompleted;
                } else {
                    acc.push({
                        department: user.department,
                        count: 1,
                        productivity: user.performance.productivityScore,
                        tasksCompleted,
                    });
                }
                return acc;
            },
            [] as {
                department: string;
                count: number;
                productivity: number;
                tasksCompleted: number;
            }[],
        );

        // Calculate averages for departments
        departmentGroups.forEach((group) => {
            group.productivity = group.productivity / group.count;
        });

        // Group by specialization
        const specializationGroups = this.users.reduce(
            (acc, user) => {
                user.specializations.forEach((specialization) => {
                    const existing = acc.find((s) => s.specialization === specialization);
                    const productsProcessed =
                        user.performance.totalProductsAdded + user.performance.totalProductsEdited;
                    if (existing) {
                        existing.userCount++;
                        existing.productsProcessed += productsProcessed;
                        existing.accuracy += user.performance.accuracyRate;
                    } else {
                        acc.push({
                            specialization,
                            userCount: 1,
                            productsProcessed,
                            accuracy: user.performance.accuracyRate,
                        });
                    }
                });
                return acc;
            },
            [] as {
                specialization: string;
                userCount: number;
                productsProcessed: number;
                accuracy: number;
            }[],
        );

        // Calculate averages for specializations
        specializationGroups.forEach((group) => {
            group.accuracy = group.accuracy / group.userCount;
        });

        // Group by city
        const cityGroups = this.users.reduce(
            (acc, user) => {
                const existing = acc.find((c) => c.cityId === user.contactInfo.cityId);
                if (existing) {
                    existing.count++;
                    existing.productivity += user.performance.productivityScore;
                } else {
                    acc.push({
                        cityId: user.contactInfo.cityId,
                        cityName: user.contactInfo.cityName,
                        count: 1,
                        productivity: user.performance.productivityScore,
                    });
                }
                return acc;
            },
            [] as { cityId: string; cityName: string; count: number; productivity: number }[],
        );

        // Calculate averages for cities
        cityGroups.forEach((group) => {
            group.productivity = group.productivity / group.count;
        });

        // Top performers
        const topPerformers = this.users
            .filter((u) => u.status === 'active')
            .sort((a, b) => b.performance.productivityScore - a.performance.productivityScore)
            .slice(0, 5)
            .map((u) => ({
                userId: u.id,
                userName: u.name,
                productivity: u.performance.productivityScore,
                accuracy: u.performance.accuracyRate,
                tasksCompleted:
                    u.performance.monthlyAchieved.productsAdded +
                    u.performance.monthlyAchieved.productsReviewed,
                specialization: u.specializations[0] || 'General',
            }));

        // Monthly targets
        const totalTargets = this.users.reduce(
            (sum, u) =>
                sum +
                u.performance.monthlyTargets.productsToAdd +
                u.performance.monthlyTargets.productsToReview,
            0,
        );
        const achieved = this.users.reduce(
            (sum, u) =>
                sum +
                u.performance.monthlyAchieved.productsAdded +
                u.performance.monthlyAchieved.productsReviewed,
            0,
        );

        return {
            total,
            active,
            pending,
            suspended,
            training,
            averageProductivity,
            averageAccuracy,
            totalProductsProcessed,
            totalTasksCompleted,
            byAccessLevel: accessLevelGroups,
            byDepartment: departmentGroups,
            bySpecialization: specializationGroups,
            byCity: cityGroups,
            byStatus: { active, pending, suspended, training },
            recentHires: 1,
            growth: 25.0,
            topPerformers,
            monthlyTargets: {
                totalTargets,
                achieved,
                percentage: (achieved / totalTargets) * 100,
            },
        };
    }

    // Update user status
    updateUserStatus(
        userId: string,
        status: DatabaseInputUserDetails['status'],
        reason?: string,
    ): boolean {
        const userIndex = this.users.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].status = status;
            this.users[userIndex].updatedAt = new Date().toISOString();
            this.users[userIndex].lastModifiedBy = 'admin-current';

            if (reason) {
                this.users[userIndex].notes = reason;
            }

            return true;
        }
        return false;
    }

    // Update user permissions
    updateUserPermissions(
        userId: string,
        permissions: Partial<DatabaseInputUserDetails['permissions']>,
    ): boolean {
        const userIndex = this.users.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].permissions = {
                ...this.users[userIndex].permissions,
                ...permissions,
            };
            this.users[userIndex].updatedAt = new Date().toISOString();
            this.users[userIndex].lastModifiedBy = 'admin-current';
            return true;
        }
        return false;
    }

    // Get tasks
    getTasks(userId?: string): DatabaseInputTask[] {
        if (userId) {
            return this.tasks.filter((t) => t.assignedTo === userId);
        }
        return this.tasks;
    }

    // Get available access levels
    getAccessLevels() {
        return [
            {
                value: 'basic',
                label: 'Basic',
                labelAr: 'أساسي',
                description: 'Basic data entry permissions',
            },
            {
                value: 'advanced',
                label: 'Advanced',
                labelAr: 'متقدم',
                description: 'Advanced data management permissions',
            },
            {
                value: 'supervisor',
                label: 'Supervisor',
                labelAr: 'مشرف',
                description: 'Supervisory and approval permissions',
            },
            {
                value: 'manager',
                label: 'Manager',
                labelAr: 'مدير',
                description: 'Full management permissions',
            },
        ];
    }

    // Get available departments
    getDepartments() {
        return [
            { value: 'data_management', label: 'Data Management', labelAr: 'إدارة البيانات' },
            { value: 'quality_control', label: 'Quality Control', labelAr: 'مراقبة الجودة' },
            {
                value: 'inventory_management',
                label: 'Inventory Management',
                labelAr: 'إدارة المخزون',
            },
            { value: 'category_management', label: 'Category Management', labelAr: 'إدارة الفئات' },
        ];
    }

    // Get available specializations
    getSpecializations() {
        return [
            {
                value: 'prescription_medicines',
                label: 'Prescription Medicines',
                labelAr: 'الأدوية الموصوفة',
            },
            { value: 'otc_medicines', label: 'OTC Medicines', labelAr: 'أدوية بدون وصفة' },
            { value: 'supplements', label: 'Supplements', labelAr: 'المكملات الغذائية' },
            { value: 'vitamins', label: 'Vitamins', labelAr: 'الفيتامينات' },
            { value: 'skincare', label: 'Skincare', labelAr: 'العناية بالبشرة' },
            { value: 'medical_equipment', label: 'Medical Equipment', labelAr: 'المعدات الطبية' },
            { value: 'baby_care', label: 'Baby Care', labelAr: 'رعاية الأطفال' },
            { value: 'quality_control', label: 'Quality Control', labelAr: 'مراقبة الجودة' },
            { value: 'data_validation', label: 'Data Validation', labelAr: 'التحقق من البيانات' },
        ];
    }

    // Get status options
    getStatusOptions() {
        return [
            { value: 'active', label: 'Active', labelAr: 'نشط', color: 'green' },
            { value: 'pending', label: 'Pending', labelAr: 'في الانتظار', color: 'yellow' },
            { value: 'suspended', label: 'Suspended', labelAr: 'موقوف', color: 'orange' },
            { value: 'training', label: 'In Training', labelAr: 'في التدريب', color: 'blue' },
            { value: 'inactive', label: 'Inactive', labelAr: 'غير نشط', color: 'gray' },
        ];
    }

    // Assign task to user
    assignTask(taskId: string, userId: string): boolean {
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].assignedTo = userId;
            this.tasks[taskIndex].updatedAt = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Update task status
    updateTaskStatus(
        taskId: string,
        status: DatabaseInputTask['status'],
        progress?: number,
    ): boolean {
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = status;
            this.tasks[taskIndex].updatedAt = new Date().toISOString();

            if (progress !== undefined) {
                this.tasks[taskIndex].progress = progress;
            }

            if (status === 'in_progress' && !this.tasks[taskIndex].startedAt) {
                this.tasks[taskIndex].startedAt = new Date().toISOString();
            }

            if (status === 'completed') {
                this.tasks[taskIndex].completedAt = new Date().toISOString();
                this.tasks[taskIndex].progress = 100;
            }

            return true;
        }
        return false;
    }
}

export const databaseInputUserManagementService = new DatabaseInputUserManagementService();
