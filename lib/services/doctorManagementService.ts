// Doctor Management Service - Comprehensive doctor administration with referral system
export interface DoctorDetails {
    id: string;
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    whatsapp?: string;
    specialization: string;
    specializationAr: string;
    licenseNumber: string;
    licenseExpiry: string;
    medicalCouncilId: string;
    clinicHospital: string;
    clinicHospitalAr: string;
    address: string;
    addressAr: string;
    cityId: string;
    cityName: string;
    governorateId: string;
    governorateName: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    status: 'active' | 'inactive' | 'pending' | 'suspended' | 'rejected';
    commission: {
        rate: number; // Percentage for referrals
        type: 'fixed' | 'tiered';
        minimumReferral: number;
        tieredRates?: {
            threshold: number;
            rate: number;
        }[];
    };
    referralSystem: {
        referralCode: string;
        qrCode: string;
        referralLink: string;
        isActive: boolean;
        customMessage?: string;
    };
    performance: {
        totalReferrals: number;
        successfulReferrals: number;
        conversionRate: number;
        totalCommissionEarned: number;
        monthlyReferrals: number;
        averageOrderValue: number;
        rating: number;
        reviewCount: number;
    };
    workingHours: {
        monday: { open: string; close: string; isAvailable: boolean };
        tuesday: { open: string; close: string; isAvailable: boolean };
        wednesday: { open: string; close: string; isAvailable: boolean };
        thursday: { open: string; close: string; isAvailable: boolean };
        friday: { open: string; close: string; isAvailable: boolean };
        saturday: { open: string; close: string; isAvailable: boolean };
        sunday: { open: string; close: string; isAvailable: boolean };
    };
    services: string[];
    languages: string[];
    education: {
        degree: string;
        university: string;
        graduationYear: number;
        certifications: string[];
    };
    experience: {
        yearsOfExperience: number;
        previousPositions: {
            position: string;
            hospital: string;
            duration: string;
        }[];
    };
    documents: {
        license: string;
        medicalCouncilCertificate: string;
        cv: string;
        photo: string;
        clinicLicense?: string;
    };
    contactPreferences: {
        preferredContactMethod: 'phone' | 'whatsapp' | 'email';
        availableForEmergency: boolean;
        responseTime: number; // in minutes
    };
    financials: {
        totalCommissionEarned: number;
        pendingCommissions: number;
        monthlyCommission: number;
        lastCommissionPayment: string;
        bankAccount: {
            accountNumber: string;
            bankName: string;
            iban: string;
        };
    };
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    approvedBy?: string;
    rejectionReason?: string;
    notes?: string;
}

export interface DoctorReferral {
    id: string;
    doctorId: string;
    doctorName: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    orderId?: string;
    prescriptionId?: string;
    referralCode: string;
    referralSource: 'qr_code' | 'link' | 'direct';
    status: 'pending' | 'converted' | 'expired' | 'cancelled';
    orderValue?: number;
    commissionAmount?: number;
    commissionRate: number;
    createdAt: string;
    convertedAt?: string;
    expiresAt: string;
    notes?: string;
}

export interface DoctorFilters {
    status?: string;
    cityId?: string;
    governorateId?: string;
    specialization?: string;
    commissionRange?: { min: number; max: number };
    ratingRange?: { min: number; max: number };
    search?: string;
    service?: string;
    language?: string;
    experience?: { min: number; max: number };
}

export interface DoctorStats {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    rejected: number;
    averageCommission: number;
    totalCommissionPaid: number;
    totalReferrals: number;
    successfulReferrals: number;
    averageConversionRate: number;
    averageRating: number;
    bySpecialization: {
        specialization: string;
        count: number;
        totalReferrals: number;
        commissionEarned: number;
    }[];
    byCity: {
        cityId: string;
        cityName: string;
        count: number;
        totalReferrals: number;
        commissionEarned: number;
    }[];
    byStatus: {
        active: number;
        pending: number;
        suspended: number;
        rejected: number;
    };
    recentApplications: number;
    growth: number;
    topPerformers: {
        doctorId: string;
        doctorName: string;
        totalReferrals: number;
        commissionEarned: number;
        conversionRate: number;
    }[];
}

export interface CommissionPayment {
    id: string;
    doctorId: string;
    doctorName: string;
    period: string;
    amount: number;
    commissionRate: number;
    referralsCount: number;
    totalOrderValue: number;
    status: 'pending' | 'processing' | 'paid' | 'failed';
    dueDate: string;
    paidDate?: string;
    paymentMethod: string;
    transactionId?: string;
    notes?: string;
}

class DoctorManagementService {
    private doctors: DoctorDetails[] = [
        {
            id: 'dr-ahmed-hassan',
            name: 'Dr. Ahmed Hassan',
            nameAr: 'د. أحمد حسن',
            email: 'ahmed.hassan@medicenter.com',
            phone: '+20 100 123 4567',
            whatsapp: '+20 100 123 4567',
            specialization: 'Internal Medicine',
            specializationAr: 'الطب الباطني',
            licenseNumber: 'MD-EG-2018-001234',
            licenseExpiry: '2025-12-31',
            medicalCouncilId: 'EMC-123456',
            clinicHospital: 'Cairo Medical Center',
            clinicHospitalAr: 'مركز القاهرة الطبي',
            address: '123 Tahrir Square, Cairo',
            addressAr: '123 ميدان التحرير، القاهرة',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            governorateName: 'Cairo',
            coordinates: { lat: 30.0444, lng: 31.2357 },
            status: 'active',
            commission: {
                rate: 15,
                type: 'fixed',
                minimumReferral: 100,
            },
            referralSystem: {
                referralCode: 'DR-AHMED-001',
                qrCode: '/qr-codes/dr-ahmed-hassan.png',
                referralLink: 'https://cura.com/ref/DR-AHMED-001',
                isActive: true,
                customMessage:
                    "Get your medicines delivered with Dr. Ahmed Hassan's trusted recommendation",
            },
            performance: {
                totalReferrals: 156,
                successfulReferrals: 134,
                conversionRate: 85.9,
                totalCommissionEarned: 12450.75,
                monthlyReferrals: 23,
                averageOrderValue: 285.5,
                rating: 4.8,
                reviewCount: 89,
            },
            workingHours: {
                monday: { open: '09:00', close: '17:00', isAvailable: true },
                tuesday: { open: '09:00', close: '17:00', isAvailable: true },
                wednesday: { open: '09:00', close: '17:00', isAvailable: true },
                thursday: { open: '09:00', close: '17:00', isAvailable: true },
                friday: { open: '09:00', close: '15:00', isAvailable: true },
                saturday: { open: '10:00', close: '14:00', isAvailable: true },
                sunday: { open: '00:00', close: '00:00', isAvailable: false },
            },
            services: ['consultation', 'prescription_review', 'chronic_care', 'emergency'],
            languages: ['arabic', 'english'],
            education: {
                degree: 'MD - Internal Medicine',
                university: 'Cairo University Faculty of Medicine',
                graduationYear: 2015,
                certifications: [
                    'Board Certified Internal Medicine',
                    'Diabetes Management Certificate',
                ],
            },
            experience: {
                yearsOfExperience: 9,
                previousPositions: [
                    {
                        position: 'Senior Resident',
                        hospital: 'Kasr Al Ainy Hospital',
                        duration: '2018-2021',
                    },
                    {
                        position: 'Consultant',
                        hospital: 'Cairo Medical Center',
                        duration: '2021-Present',
                    },
                ],
            },
            documents: {
                license: '/documents/dr-ahmed-license.pdf',
                medicalCouncilCertificate: '/documents/dr-ahmed-council.pdf',
                cv: '/documents/dr-ahmed-cv.pdf',
                photo: '/images/doctors/dr-ahmed-hassan.jpg',
                clinicLicense: '/documents/dr-ahmed-clinic.pdf',
            },
            contactPreferences: {
                preferredContactMethod: 'whatsapp',
                availableForEmergency: true,
                responseTime: 30,
            },
            financials: {
                totalCommissionEarned: 12450.75,
                pendingCommissions: 1875.25,
                monthlyCommission: 1875.25,
                lastCommissionPayment: '2024-01-15T10:30:00Z',
                bankAccount: {
                    accountNumber: '1234567890',
                    bankName: 'National Bank of Egypt',
                    iban: 'EG380003000000000001234567890',
                },
            },
            createdAt: '2023-11-01T08:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z',
            approvedAt: '2023-11-05T10:20:00Z',
            approvedBy: 'admin-001',
        },
        {
            id: 'dr-fatima-ali',
            name: 'Dr. Fatima Ali',
            nameAr: 'د. فاطمة علي',
            email: 'fatima.ali@pediatriccenter.com',
            phone: '+20 101 234 5678',
            whatsapp: '+20 101 234 5678',
            specialization: 'Pediatrics',
            specializationAr: 'طب الأطفال',
            licenseNumber: 'MD-EG-2019-005678',
            licenseExpiry: '2026-06-30',
            medicalCouncilId: 'EMC-567890',
            clinicHospital: "Children's Medical Center",
            clinicHospitalAr: 'مركز الأطفال الطبي',
            address: '45 Nile Corniche, Cairo',
            addressAr: '45 كورنيش النيل، القاهرة',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            governorateName: 'Cairo',
            coordinates: { lat: 30.0626, lng: 31.2497 },
            status: 'active',
            commission: {
                rate: 12,
                type: 'tiered',
                minimumReferral: 50,
                tieredRates: [
                    { threshold: 500, rate: 12 },
                    { threshold: 2000, rate: 10 },
                    { threshold: 5000, rate: 8 },
                ],
            },
            referralSystem: {
                referralCode: 'DR-FATIMA-002',
                qrCode: '/qr-codes/dr-fatima-ali.png',
                referralLink: 'https://cura.com/ref/DR-FATIMA-002',
                isActive: true,
                customMessage:
                    "Trusted pediatric care - get your child's medicines with Dr. Fatima's recommendation",
            },
            performance: {
                totalReferrals: 89,
                successfulReferrals: 76,
                conversionRate: 85.4,
                totalCommissionEarned: 8750.5,
                monthlyReferrals: 18,
                averageOrderValue: 195.75,
                rating: 4.9,
                reviewCount: 67,
            },
            workingHours: {
                monday: { open: '08:00', close: '16:00', isAvailable: true },
                tuesday: { open: '08:00', close: '16:00', isAvailable: true },
                wednesday: { open: '08:00', close: '16:00', isAvailable: true },
                thursday: { open: '08:00', close: '16:00', isAvailable: true },
                friday: { open: '08:00', close: '14:00', isAvailable: true },
                saturday: { open: '09:00', close: '13:00', isAvailable: true },
                sunday: { open: '00:00', close: '00:00', isAvailable: false },
            },
            services: ['pediatric_consultation', 'vaccination', 'growth_monitoring', 'emergency'],
            languages: ['arabic', 'english', 'french'],
            education: {
                degree: 'MD - Pediatrics',
                university: 'Alexandria University Faculty of Medicine',
                graduationYear: 2016,
                certifications: [
                    'Board Certified Pediatrics',
                    'Neonatal Care Certificate',
                    'Child Development Specialist',
                ],
            },
            experience: {
                yearsOfExperience: 8,
                previousPositions: [
                    {
                        position: 'Pediatric Resident',
                        hospital: "Alexandria Children's Hospital",
                        duration: '2016-2019',
                    },
                    {
                        position: 'Pediatric Consultant',
                        hospital: "Children's Medical Center",
                        duration: '2019-Present',
                    },
                ],
            },
            documents: {
                license: '/documents/dr-fatima-license.pdf',
                medicalCouncilCertificate: '/documents/dr-fatima-council.pdf',
                cv: '/documents/dr-fatima-cv.pdf',
                photo: '/images/doctors/dr-fatima-ali.jpg',
                clinicLicense: '/documents/dr-fatima-clinic.pdf',
            },
            contactPreferences: {
                preferredContactMethod: 'phone',
                availableForEmergency: true,
                responseTime: 20,
            },
            financials: {
                totalCommissionEarned: 8750.5,
                pendingCommissions: 1245.75,
                monthlyCommission: 1245.75,
                lastCommissionPayment: '2024-01-10T09:15:00Z',
                bankAccount: {
                    accountNumber: '0987654321',
                    bankName: 'Banque Misr',
                    iban: 'EG210003000000000000987654321',
                },
            },
            createdAt: '2023-12-15T10:00:00Z',
            updatedAt: '2024-01-18T12:20:00Z',
            approvedAt: '2023-12-20T14:30:00Z',
            approvedBy: 'admin-001',
        },
        {
            id: 'dr-omar-mahmoud',
            name: 'Dr. Omar Mahmoud',
            nameAr: 'د. عمر محمود',
            email: 'omar.mahmoud@orthocenter.com',
            phone: '+20 102 345 6789',
            whatsapp: '+20 102 345 6789',
            specialization: 'Orthopedics',
            specializationAr: 'جراحة العظام',
            licenseNumber: 'MD-EG-2017-009876',
            licenseExpiry: '2025-09-15',
            medicalCouncilId: 'EMC-987654',
            clinicHospital: 'Ismailia Orthopedic Center',
            clinicHospitalAr: 'مركز الإسماعيلية لجراحة العظام',
            address: '67 El Tahrir Street, Ismailia',
            addressAr: '67 شارع التحرير، الإسماعيلية',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            governorateName: 'Ismailia',
            coordinates: { lat: 30.5965, lng: 32.2715 },
            status: 'pending',
            commission: {
                rate: 18,
                type: 'fixed',
                minimumReferral: 200,
            },
            referralSystem: {
                referralCode: 'DR-OMAR-003',
                qrCode: '/qr-codes/dr-omar-mahmoud.png',
                referralLink: 'https://cura.com/ref/DR-OMAR-003',
                isActive: false,
                customMessage:
                    "Specialized orthopedic care - get your medications with Dr. Omar's recommendation",
            },
            performance: {
                totalReferrals: 0,
                successfulReferrals: 0,
                conversionRate: 0,
                totalCommissionEarned: 0,
                monthlyReferrals: 0,
                averageOrderValue: 0,
                rating: 0,
                reviewCount: 0,
            },
            workingHours: {
                monday: { open: '10:00', close: '18:00', isAvailable: true },
                tuesday: { open: '10:00', close: '18:00', isAvailable: true },
                wednesday: { open: '10:00', close: '18:00', isAvailable: true },
                thursday: { open: '10:00', close: '18:00', isAvailable: true },
                friday: { open: '10:00', close: '16:00', isAvailable: true },
                saturday: { open: '10:00', close: '14:00', isAvailable: true },
                sunday: { open: '00:00', close: '00:00', isAvailable: false },
            },
            services: ['orthopedic_consultation', 'sports_medicine', 'joint_care', 'fracture_care'],
            languages: ['arabic', 'english'],
            education: {
                degree: 'MD - Orthopedic Surgery',
                university: 'Ain Shams University Faculty of Medicine',
                graduationYear: 2014,
                certifications: [
                    'Board Certified Orthopedic Surgery',
                    'Sports Medicine Certificate',
                ],
            },
            experience: {
                yearsOfExperience: 10,
                previousPositions: [
                    {
                        position: 'Orthopedic Resident',
                        hospital: 'Ain Shams University Hospital',
                        duration: '2014-2017',
                    },
                    {
                        position: 'Orthopedic Consultant',
                        hospital: 'Ismailia Orthopedic Center',
                        duration: '2017-Present',
                    },
                ],
            },
            documents: {
                license: '/documents/dr-omar-license.pdf',
                medicalCouncilCertificate: '/documents/dr-omar-council.pdf',
                cv: '/documents/dr-omar-cv.pdf',
                photo: '/images/doctors/dr-omar-mahmoud.jpg',
                clinicLicense: '/documents/dr-omar-clinic.pdf',
            },
            contactPreferences: {
                preferredContactMethod: 'email',
                availableForEmergency: false,
                responseTime: 60,
            },
            financials: {
                totalCommissionEarned: 0,
                pendingCommissions: 0,
                monthlyCommission: 0,
                lastCommissionPayment: '',
                bankAccount: {
                    accountNumber: '5555666677',
                    bankName: 'Commercial International Bank',
                    iban: 'EG330003000000000005555666677',
                },
            },
            createdAt: '2024-01-19T14:30:00Z',
            updatedAt: '2024-01-19T14:30:00Z',
        },
        {
            id: 'dr-sara-mohamed',
            name: 'Dr. Sara Mohamed',
            nameAr: 'د. سارة محمد',
            email: 'sara.mohamed@dermatology.com',
            phone: '+20 103 456 7890',
            whatsapp: '+20 103 456 7890',
            specialization: 'Dermatology',
            specializationAr: 'الأمراض الجلدية',
            licenseNumber: 'MD-EG-2020-001122',
            licenseExpiry: '2027-03-20',
            medicalCouncilId: 'EMC-112233',
            clinicHospital: 'Skin Care Clinic',
            clinicHospitalAr: 'عيادة العناية بالبشرة',
            address: '89 Kasr El Nil Street, Cairo',
            addressAr: '89 شارع قصر النيل، القاهرة',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            governorateName: 'Cairo',
            coordinates: { lat: 30.0454, lng: 31.2367 },
            status: 'suspended',
            commission: {
                rate: 10,
                type: 'fixed',
                minimumReferral: 75,
            },
            referralSystem: {
                referralCode: 'DR-SARA-004',
                qrCode: '/qr-codes/dr-sara-mohamed.png',
                referralLink: 'https://cura.com/ref/DR-SARA-004',
                isActive: false,
                customMessage:
                    "Expert dermatological care - get your skincare products with Dr. Sara's recommendation",
            },
            performance: {
                totalReferrals: 45,
                successfulReferrals: 38,
                conversionRate: 84.4,
                totalCommissionEarned: 3250.25,
                monthlyReferrals: 8,
                averageOrderValue: 165.5,
                rating: 4.6,
                reviewCount: 34,
            },
            workingHours: {
                monday: { open: '11:00', close: '19:00', isAvailable: true },
                tuesday: { open: '11:00', close: '19:00', isAvailable: true },
                wednesday: { open: '11:00', close: '19:00', isAvailable: true },
                thursday: { open: '11:00', close: '19:00', isAvailable: true },
                friday: { open: '11:00', close: '17:00', isAvailable: true },
                saturday: { open: '11:00', close: '15:00', isAvailable: true },
                sunday: { open: '00:00', close: '00:00', isAvailable: false },
            },
            services: [
                'dermatology_consultation',
                'acne_treatment',
                'cosmetic_dermatology',
                'skin_cancer_screening',
            ],
            languages: ['arabic', 'english'],
            education: {
                degree: 'MD - Dermatology',
                university: 'Cairo University Faculty of Medicine',
                graduationYear: 2017,
                certifications: ['Board Certified Dermatology', 'Cosmetic Dermatology Certificate'],
            },
            experience: {
                yearsOfExperience: 7,
                previousPositions: [
                    {
                        position: 'Dermatology Resident',
                        hospital: 'Cairo University Hospital',
                        duration: '2017-2020',
                    },
                    {
                        position: 'Dermatology Consultant',
                        hospital: 'Skin Care Clinic',
                        duration: '2020-Present',
                    },
                ],
            },
            documents: {
                license: '/documents/dr-sara-license.pdf',
                medicalCouncilCertificate: '/documents/dr-sara-council.pdf',
                cv: '/documents/dr-sara-cv.pdf',
                photo: '/images/doctors/dr-sara-mohamed.jpg',
                clinicLicense: '/documents/dr-sara-clinic.pdf',
            },
            contactPreferences: {
                preferredContactMethod: 'whatsapp',
                availableForEmergency: false,
                responseTime: 45,
            },
            financials: {
                totalCommissionEarned: 3250.25,
                pendingCommissions: 825.5,
                monthlyCommission: 825.5,
                lastCommissionPayment: '2023-12-20T11:45:00Z',
                bankAccount: {
                    accountNumber: '1111222233',
                    bankName: 'Arab African International Bank',
                    iban: 'EG120003000000000001111222233',
                },
            },
            createdAt: '2023-10-20T13:15:00Z',
            updatedAt: '2024-01-10T16:30:00Z',
            approvedAt: '2023-10-25T10:20:00Z',
            approvedBy: 'admin-001',
            rejectionReason: 'Suspended due to customer complaints about consultation quality',
        },
    ];

    private referrals: DoctorReferral[] = [
        {
            id: 'ref-001',
            doctorId: 'dr-ahmed-hassan',
            doctorName: 'Dr. Ahmed Hassan',
            customerId: 'cust-001',
            customerName: 'Mohamed Ali',
            customerPhone: '+20 100 111 2222',
            orderId: 'order-001',
            prescriptionId: 'rx-001',
            referralCode: 'DR-AHMED-001',
            referralSource: 'qr_code',
            status: 'converted',
            orderValue: 285.5,
            commissionAmount: 42.83,
            commissionRate: 15,
            createdAt: '2024-01-15T10:30:00Z',
            convertedAt: '2024-01-15T14:20:00Z',
            expiresAt: '2024-02-15T10:30:00Z',
        },
        {
            id: 'ref-002',
            doctorId: 'dr-fatima-ali',
            doctorName: 'Dr. Fatima Ali',
            customerId: 'cust-002',
            customerName: 'Aisha Hassan',
            customerPhone: '+20 101 222 3333',
            orderId: 'order-002',
            referralCode: 'DR-FATIMA-002',
            referralSource: 'link',
            status: 'converted',
            orderValue: 195.75,
            commissionAmount: 23.49,
            commissionRate: 12,
            createdAt: '2024-01-18T09:15:00Z',
            convertedAt: '2024-01-18T16:45:00Z',
            expiresAt: '2024-02-18T09:15:00Z',
        },
        {
            id: 'ref-003',
            doctorId: 'dr-ahmed-hassan',
            doctorName: 'Dr. Ahmed Hassan',
            customerId: 'cust-003',
            customerName: 'Khaled Mahmoud',
            customerPhone: '+20 102 333 4444',
            referralCode: 'DR-AHMED-001',
            referralSource: 'direct',
            status: 'pending',
            commissionRate: 15,
            createdAt: '2024-01-20T11:00:00Z',
            expiresAt: '2024-02-20T11:00:00Z',
            notes: 'Customer contacted for prescription consultation',
        },
    ];

    // Get all doctors with filtering
    getDoctors(filters?: DoctorFilters): DoctorDetails[] {
        let filteredDoctors = [...this.doctors];

        if (filters) {
            if (filters.status) {
                filteredDoctors = filteredDoctors.filter((d) => d.status === filters.status);
            }
            if (filters.cityId) {
                filteredDoctors = filteredDoctors.filter((d) => d.cityId === filters.cityId);
            }
            if (filters.governorateId) {
                filteredDoctors = filteredDoctors.filter(
                    (d) => d.governorateId === filters.governorateId,
                );
            }
            if (filters.specialization) {
                filteredDoctors = filteredDoctors.filter(
                    (d) =>
                        d.specialization
                            .toLowerCase()
                            .includes(filters.specialization!.toLowerCase()) ||
                        d.specializationAr.includes(filters.specialization!),
                );
            }
            if (filters.commissionRange) {
                filteredDoctors = filteredDoctors.filter(
                    (d) =>
                        d.commission.rate >= filters.commissionRange!.min &&
                        d.commission.rate <= filters.commissionRange!.max,
                );
            }
            if (filters.ratingRange) {
                filteredDoctors = filteredDoctors.filter(
                    (d) =>
                        d.performance.rating >= filters.ratingRange!.min &&
                        d.performance.rating <= filters.ratingRange!.max,
                );
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredDoctors = filteredDoctors.filter(
                    (d) =>
                        d.name.toLowerCase().includes(searchTerm) ||
                        d.nameAr.includes(filters.search!) ||
                        d.email.toLowerCase().includes(searchTerm) ||
                        d.phone.includes(searchTerm) ||
                        d.licenseNumber.toLowerCase().includes(searchTerm) ||
                        d.specialization.toLowerCase().includes(searchTerm) ||
                        d.specializationAr.includes(filters.search!),
                );
            }
            if (filters.service) {
                filteredDoctors = filteredDoctors.filter((d) =>
                    d.services.includes(filters.service!),
                );
            }
            if (filters.language) {
                filteredDoctors = filteredDoctors.filter((d) =>
                    d.languages.includes(filters.language!),
                );
            }
            if (filters.experience) {
                filteredDoctors = filteredDoctors.filter(
                    (d) =>
                        d.experience.yearsOfExperience >= filters.experience!.min &&
                        d.experience.yearsOfExperience <= filters.experience!.max,
                );
            }
        }

        return filteredDoctors;
    }

    // Get all active doctors for customers (no location filtering)
    getDoctorsForCustomerLocation(cityId?: string, governorateId?: string): DoctorDetails[] {
        // Return all active doctors regardless of customer location
        // Doctors are not location-dependent like products/medicines
        return this.doctors.filter((d) => d.status === 'active');
    }

    // Get available doctors by specialization (no location filtering)
    getDoctorsBySpecializationForLocation(
        specialization: string,
        cityId?: string,
        governorateId?: string,
    ): DoctorDetails[] {
        // Return all active doctors with matching specialization regardless of location
        return this.doctors
            .filter((d) => d.status === 'active')
            .filter(
                (d) =>
                    d.specialization.toLowerCase().includes(specialization.toLowerCase()) ||
                    d.specializationAr.includes(specialization),
            );
    }

    // Get all active doctors (no location restrictions)
    getAllActiveDoctors(): DoctorDetails[] {
        return this.doctors.filter((d) => d.status === 'active');
    }

    // Get doctors by specialization (no location restrictions)
    getDoctorsBySpecialization(specialization: string): DoctorDetails[] {
        return this.doctors
            .filter((d) => d.status === 'active')
            .filter(
                (d) =>
                    d.specialization.toLowerCase().includes(specialization.toLowerCase()) ||
                    d.specializationAr.includes(specialization),
            );
    }

    // Get doctor by ID
    getDoctorById(id: string): DoctorDetails | undefined {
        return this.doctors.find((d) => d.id === id);
    }

    // Get doctor statistics
    getDoctorStats(): DoctorStats {
        const total = this.doctors.length;
        const active = this.doctors.filter((d) => d.status === 'active').length;
        const pending = this.doctors.filter((d) => d.status === 'pending').length;
        const suspended = this.doctors.filter((d) => d.status === 'suspended').length;
        const rejected = this.doctors.filter((d) => d.status === 'rejected').length;

        const averageCommission =
            this.doctors.reduce((sum, d) => sum + d.commission.rate, 0) / total;
        const totalCommissionPaid = this.doctors.reduce(
            (sum, d) => sum + d.performance.totalCommissionEarned,
            0,
        );
        const totalReferrals = this.doctors.reduce(
            (sum, d) => sum + d.performance.totalReferrals,
            0,
        );
        const successfulReferrals = this.doctors.reduce(
            (sum, d) => sum + d.performance.successfulReferrals,
            0,
        );
        const averageConversionRate =
            this.doctors
                .filter((d) => d.performance.totalReferrals > 0)
                .reduce((sum, d) => sum + d.performance.conversionRate, 0) /
                this.doctors.filter((d) => d.performance.totalReferrals > 0).length || 0;
        const averageRating =
            this.doctors
                .filter((d) => d.performance.rating > 0)
                .reduce((sum, d) => sum + d.performance.rating, 0) /
                this.doctors.filter((d) => d.performance.rating > 0).length || 0;

        // Group by specialization
        const specializationGroups = this.doctors.reduce(
            (acc, doctor) => {
                const existing = acc.find((s) => s.specialization === doctor.specialization);
                if (existing) {
                    existing.count++;
                    existing.totalReferrals += doctor.performance.totalReferrals;
                    existing.commissionEarned += doctor.performance.totalCommissionEarned;
                } else {
                    acc.push({
                        specialization: doctor.specialization,
                        count: 1,
                        totalReferrals: doctor.performance.totalReferrals,
                        commissionEarned: doctor.performance.totalCommissionEarned,
                    });
                }
                return acc;
            },
            [] as {
                specialization: string;
                count: number;
                totalReferrals: number;
                commissionEarned: number;
            }[],
        );

        // Group by city
        const cityGroups = this.doctors.reduce(
            (acc, doctor) => {
                const existing = acc.find((c) => c.cityId === doctor.cityId);
                if (existing) {
                    existing.count++;
                    existing.totalReferrals += doctor.performance.totalReferrals;
                    existing.commissionEarned += doctor.performance.totalCommissionEarned;
                } else {
                    acc.push({
                        cityId: doctor.cityId,
                        cityName: doctor.cityName,
                        count: 1,
                        totalReferrals: doctor.performance.totalReferrals,
                        commissionEarned: doctor.performance.totalCommissionEarned,
                    });
                }
                return acc;
            },
            [] as {
                cityId: string;
                cityName: string;
                count: number;
                totalReferrals: number;
                commissionEarned: number;
            }[],
        );

        // Top performers
        const topPerformers = this.doctors
            .filter((d) => d.status === 'active' && d.performance.totalReferrals > 0)
            .sort(
                (a, b) => b.performance.totalCommissionEarned - a.performance.totalCommissionEarned,
            )
            .slice(0, 5)
            .map((d) => ({
                doctorId: d.id,
                doctorName: d.name,
                totalReferrals: d.performance.totalReferrals,
                commissionEarned: d.performance.totalCommissionEarned,
                conversionRate: d.performance.conversionRate,
            }));

        return {
            total,
            active,
            pending,
            suspended,
            rejected,
            averageCommission,
            totalCommissionPaid,
            totalReferrals,
            successfulReferrals,
            averageConversionRate,
            averageRating,
            bySpecialization: specializationGroups,
            byCity: cityGroups,
            byStatus: { active, pending, suspended, rejected },
            recentApplications: 2,
            growth: 18.5,
            topPerformers,
        };
    }

    // Update doctor status
    updateDoctorStatus(
        doctorId: string,
        status: DoctorDetails['status'],
        reason?: string,
    ): boolean {
        const doctorIndex = this.doctors.findIndex((d) => d.id === doctorId);
        if (doctorIndex !== -1) {
            this.doctors[doctorIndex].status = status;
            this.doctors[doctorIndex].updatedAt = new Date().toISOString();

            if (status === 'active') {
                this.doctors[doctorIndex].approvedAt = new Date().toISOString();
                this.doctors[doctorIndex].approvedBy = 'admin-current';
                this.doctors[doctorIndex].referralSystem.isActive = true;
            } else if (status === 'rejected' || status === 'suspended') {
                this.doctors[doctorIndex].rejectionReason = reason;
                this.doctors[doctorIndex].referralSystem.isActive = false;
            }

            return true;
        }
        return false;
    }

    // Update commission rate
    updateCommissionRate(doctorId: string, newRate: number): boolean {
        const doctorIndex = this.doctors.findIndex((d) => d.id === doctorId);
        if (doctorIndex !== -1) {
            this.doctors[doctorIndex].commission.rate = newRate;
            this.doctors[doctorIndex].updatedAt = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Get referrals
    getReferrals(doctorId?: string): DoctorReferral[] {
        if (doctorId) {
            return this.referrals.filter((r) => r.doctorId === doctorId);
        }
        return this.referrals;
    }

    // Get commission payments
    getCommissionPayments(): CommissionPayment[] {
        return [
            {
                id: 'pay-dr-001',
                doctorId: 'dr-ahmed-hassan',
                doctorName: 'Dr. Ahmed Hassan',
                period: '2024-01',
                amount: 1875.25,
                commissionRate: 15,
                referralsCount: 23,
                totalOrderValue: 12501.67,
                status: 'pending',
                dueDate: '2024-02-05T00:00:00Z',
                paymentMethod: 'Bank Transfer',
                notes: 'Monthly commission payment for January 2024',
            },
            {
                id: 'pay-dr-002',
                doctorId: 'dr-fatima-ali',
                doctorName: 'Dr. Fatima Ali',
                period: '2024-01',
                amount: 1245.75,
                commissionRate: 12,
                referralsCount: 18,
                totalOrderValue: 10381.25,
                status: 'processing',
                dueDate: '2024-02-05T00:00:00Z',
                paymentMethod: 'Bank Transfer',
                notes: 'Monthly commission payment for January 2024',
            },
            {
                id: 'pay-dr-003',
                doctorId: 'dr-sara-mohamed',
                doctorName: 'Dr. Sara Mohamed',
                period: '2023-12',
                amount: 825.5,
                commissionRate: 10,
                referralsCount: 8,
                totalOrderValue: 8255.0,
                status: 'paid',
                dueDate: '2024-01-05T00:00:00Z',
                paidDate: '2024-01-03T14:30:00Z',
                paymentMethod: 'Bank Transfer',
                transactionId: 'TXN-DR-789123456',
                notes: 'Monthly commission payment for December 2023',
            },
        ];
    }

    // Get available specializations
    getSpecializations() {
        return [
            { value: 'internal_medicine', label: 'Internal Medicine', labelAr: 'الطب الباطني' },
            { value: 'pediatrics', label: 'Pediatrics', labelAr: 'طب الأطفال' },
            { value: 'orthopedics', label: 'Orthopedics', labelAr: 'جراحة العظام' },
            { value: 'dermatology', label: 'Dermatology', labelAr: 'الأمراض الجلدية' },
            { value: 'cardiology', label: 'Cardiology', labelAr: 'أمراض القلب' },
            { value: 'neurology', label: 'Neurology', labelAr: 'الأمراض العصبية' },
            { value: 'psychiatry', label: 'Psychiatry', labelAr: 'الطب النفسي' },
            { value: 'gynecology', label: 'Gynecology', labelAr: 'أمراض النساء' },
            { value: 'ophthalmology', label: 'Ophthalmology', labelAr: 'طب العيون' },
            { value: 'ent', label: 'ENT', labelAr: 'الأنف والأذن والحنجرة' },
            { value: 'general_surgery', label: 'General Surgery', labelAr: 'الجراحة العامة' },
            { value: 'family_medicine', label: 'Family Medicine', labelAr: 'طب الأسرة' },
        ];
    }

    // Get available services
    getServices() {
        return [
            { value: 'consultation', label: 'General Consultation', labelAr: 'استشارة عامة' },
            {
                value: 'prescription_review',
                label: 'Prescription Review',
                labelAr: 'مراجعة الوصفات',
            },
            {
                value: 'chronic_care',
                label: 'Chronic Care Management',
                labelAr: 'إدارة الأمراض المزمنة',
            },
            { value: 'emergency', label: 'Emergency Consultation', labelAr: 'استشارة طوارئ' },
            {
                value: 'pediatric_consultation',
                label: 'Pediatric Consultation',
                labelAr: 'استشارة أطفال',
            },
            { value: 'vaccination', label: 'Vaccination', labelAr: 'التطعيمات' },
            { value: 'growth_monitoring', label: 'Growth Monitoring', labelAr: 'متابعة النمو' },
            {
                value: 'orthopedic_consultation',
                label: 'Orthopedic Consultation',
                labelAr: 'استشارة عظام',
            },
            { value: 'sports_medicine', label: 'Sports Medicine', labelAr: 'طب رياضي' },
            { value: 'joint_care', label: 'Joint Care', labelAr: 'رعاية المفاصل' },
            { value: 'fracture_care', label: 'Fracture Care', labelAr: 'رعاية الكسور' },
            {
                value: 'dermatology_consultation',
                label: 'Dermatology Consultation',
                labelAr: 'استشارة جلدية',
            },
            { value: 'acne_treatment', label: 'Acne Treatment', labelAr: 'علاج حب الشباب' },
            {
                value: 'cosmetic_dermatology',
                label: 'Cosmetic Dermatology',
                labelAr: 'الأمراض الجلدية التجميلية',
            },
            {
                value: 'skin_cancer_screening',
                label: 'Skin Cancer Screening',
                labelAr: 'فحص سرطان الجلد',
            },
        ];
    }

    // Get available languages
    getLanguages() {
        return [
            { value: 'arabic', label: 'Arabic', labelAr: 'العربية' },
            { value: 'english', label: 'English', labelAr: 'الإنجليزية' },
            { value: 'french', label: 'French', labelAr: 'الفرنسية' },
            { value: 'german', label: 'German', labelAr: 'الألمانية' },
            { value: 'italian', label: 'Italian', labelAr: 'الإيطالية' },
        ];
    }

    // Get status options
    getStatusOptions() {
        return [
            { value: 'active', label: 'Active', labelAr: 'نشط', color: 'green' },
            {
                value: 'pending',
                label: 'Pending Approval',
                labelAr: 'في انتظار الموافقة',
                color: 'yellow',
            },
            { value: 'suspended', label: 'Suspended', labelAr: 'موقوف', color: 'orange' },
            { value: 'rejected', label: 'Rejected', labelAr: 'مرفوض', color: 'red' },
            { value: 'inactive', label: 'Inactive', labelAr: 'غير نشط', color: 'gray' },
        ];
    }

    // Generate QR code for doctor
    generateQRCode(doctorId: string, type: 'code' | 'link' | 'vcard' = 'code'): string {
        const doctor = this.getDoctorById(doctorId);
        if (!doctor) return '';

        switch (type) {
            case 'code':
                return doctor.referralSystem.referralCode;
            case 'link':
                return doctor.referralSystem.referralLink;
            case 'vcard':
                return `BEGIN:VCARD
VERSION:3.0
FN:${doctor.name}
ORG:${doctor.clinicHospital}
TITLE:${doctor.specialization}
TEL:${doctor.phone}
EMAIL:${doctor.email}
ADR:;;${doctor.address};${doctor.cityName};;;Egypt
URL:${doctor.referralSystem.referralLink}
NOTE:${doctor.referralSystem.customMessage || 'Trusted medical referrals'}
END:VCARD`;
            default:
                return doctor.referralSystem.referralCode;
        }
    }

    // Generate QR code data with custom message
    generateQRCodeWithMessage(doctorId: string, includeMessage: boolean = false): string {
        const doctor = this.getDoctorById(doctorId);
        if (!doctor) return '';

        let data = doctor.referralSystem.referralLink;
        if (includeMessage && doctor.referralSystem.customMessage) {
            data += `\n\n${doctor.referralSystem.customMessage}`;
        }
        return data;
    }

    // Update doctor's custom message
    updateCustomMessage(doctorId: string, message: string): boolean {
        const doctorIndex = this.doctors.findIndex((d) => d.id === doctorId);
        if (doctorIndex !== -1) {
            this.doctors[doctorIndex].referralSystem.customMessage = message;
            this.doctors[doctorIndex].updatedAt = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Toggle referral system status
    toggleReferralSystem(doctorId: string): boolean {
        const doctorIndex = this.doctors.findIndex((d) => d.id === doctorId);
        if (doctorIndex !== -1) {
            this.doctors[doctorIndex].referralSystem.isActive =
                !this.doctors[doctorIndex].referralSystem.isActive;
            this.doctors[doctorIndex].updatedAt = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Calculate commission for a doctor
    calculateCommission(doctorId: string, orderValue: number): number {
        const doctor = this.getDoctorById(doctorId);
        if (!doctor) return 0;

        if (doctor.commission.type === 'fixed') {
            return (orderValue * doctor.commission.rate) / 100;
        } else if (doctor.commission.type === 'tiered' && doctor.commission.tieredRates) {
            // Find applicable tier
            const applicableTier = doctor.commission.tieredRates
                .reverse()
                .find((tier) => orderValue >= tier.threshold);

            const rate = applicableTier ? applicableTier.rate : doctor.commission.rate;
            return (orderValue * rate) / 100;
        }

        return 0;
    }

    // Process commission payment
    processCommissionPayment(
        paymentId: string,
        status: 'paid' | 'failed',
        transactionId?: string,
    ): boolean {
        // Mock implementation
        console.log(`Processing doctor commission payment ${paymentId} with status ${status}`);
        return true;
    }

    // Create referral
    createReferral(
        doctorId: string,
        customerId: string,
        customerName: string,
        customerPhone: string,
        source: 'qr_code' | 'link' | 'direct',
    ): DoctorReferral | null {
        const doctor = this.getDoctorById(doctorId);
        if (!doctor || !doctor.referralSystem.isActive) return null;

        const referral: DoctorReferral = {
            id: `ref-${Date.now()}`,
            doctorId,
            doctorName: doctor.name,
            customerId,
            customerName,
            customerPhone,
            referralCode: doctor.referralSystem.referralCode,
            referralSource: source,
            status: 'pending',
            commissionRate: doctor.commission.rate,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        };

        this.referrals.push(referral);
        return referral;
    }

    // Convert referral to order
    convertReferral(referralId: string, orderId: string, orderValue: number): boolean {
        const referralIndex = this.referrals.findIndex((r) => r.id === referralId);
        if (referralIndex !== -1) {
            const referral = this.referrals[referralIndex];
            referral.status = 'converted';
            referral.orderId = orderId;
            referral.orderValue = orderValue;
            referral.commissionAmount = this.calculateCommission(referral.doctorId, orderValue);
            referral.convertedAt = new Date().toISOString();

            // Update doctor performance
            const doctorIndex = this.doctors.findIndex((d) => d.id === referral.doctorId);
            if (doctorIndex !== -1) {
                this.doctors[doctorIndex].performance.successfulReferrals++;
                this.doctors[doctorIndex].performance.totalCommissionEarned +=
                    referral.commissionAmount || 0;
                this.doctors[doctorIndex].performance.conversionRate =
                    (this.doctors[doctorIndex].performance.successfulReferrals /
                        this.doctors[doctorIndex].performance.totalReferrals) *
                    100;
            }

            return true;
        }
        return false;
    }
}

export const doctorManagementService = new DoctorManagementService();
