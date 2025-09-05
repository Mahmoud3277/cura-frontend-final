// Pharmacy-City Assignment Service - Manage pharmacy coverage areas and city assignments
import { pharmacies, Pharmacy } from '@/lib/data/pharmacies';
import { cities, City } from '@/lib/data/cities';
import { governorates, Governorate } from '@/lib/data/governorates';

export interface PharmacyCityAssignment {
    id: string;
    pharmacyId: string;
    pharmacyName: string;
    cityId: string;
    cityName: string;
    governorateId: string;
    governorateName: string;
    isPrimary: boolean; // Primary location for the pharmacy
    isActive: boolean;
    deliveryRadius: number; // in kilometers
    deliveryFee: number;
    minimumOrderAmount: number;
    estimatedDeliveryTime: string;
    commissionRate: number; // City-specific commission rate
    coverageAreas: string[]; // Specific areas within the city
    workingHours: {
        monday: { open: string; close: string; is24Hours: boolean };
        tuesday: { open: string; close: string; is24Hours: boolean };
        wednesday: { open: string; close: string; is24Hours: boolean };
        thursday: { open: string; close: string; is24Hours: boolean };
        friday: { open: string; close: string; is24Hours: boolean };
        saturday: { open: string; close: string; is24Hours: boolean };
        sunday: { open: string; close: string; is24Hours: boolean };
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CoverageArea {
    id: string;
    name: string;
    nameAr: string;
    cityId: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    radius: number; // in kilometers
    isActive: boolean;
}

export interface PharmacyCoverageStats {
    totalAssignments: number;
    activeCities: number;
    totalCoverageArea: number; // in square kilometers
    averageDeliveryTime: number;
    averageCommissionRate: number;
    byCityStats: {
        cityId: string;
        cityName: string;
        pharmacyCount: number;
        averageCommission: number;
        totalOrders: number;
        revenue: number;
    }[];
    byGovernorateStats: {
        governorateId: string;
        governorateName: string;
        pharmacyCount: number;
        cityCount: number;
        averageCommission: number;
        totalRevenue: number;
    }[];
}

export interface AssignmentFilters {
    pharmacyId?: string;
    cityId?: string;
    governorateId?: string;
    status?: 'active' | 'inactive' | 'all';
    isPrimary?: boolean;
    search?: string;
    sortBy?: 'pharmacy' | 'city' | 'commission' | 'deliveryTime' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface NewAssignmentRequest {
    pharmacyId: string;
    cityId: string;
    isPrimary: boolean;
    deliveryRadius: number;
    deliveryFee: number;
    minimumOrderAmount: number;
    estimatedDeliveryTime: string;
    commissionRate: number;
    coverageAreas: string[];
    workingHours: PharmacyCityAssignment['workingHours'];
}

class PharmacyCityAssignmentService {
    private assignments: PharmacyCityAssignment[] = [
        // ISMAILIA ASSIGNMENTS
        {
            id: 'assign-001',
            pharmacyId: 'healthplus-ismailia',
            pharmacyName: 'HealthPlus Pharmacy',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            governorateName: 'Ismailia',
            isPrimary: true,
            isActive: true,
            deliveryRadius: 15,
            deliveryFee: 15,
            minimumOrderAmount: 50,
            estimatedDeliveryTime: '30-45 min',
            commissionRate: 12,
            coverageAreas: ['Downtown', 'El Tahrir District', 'El Salam District'],
            workingHours: {
                monday: { open: '08:00', close: '22:00', is24Hours: false },
                tuesday: { open: '08:00', close: '22:00', is24Hours: false },
                wednesday: { open: '08:00', close: '22:00', is24Hours: false },
                thursday: { open: '08:00', close: '22:00', is24Hours: false },
                friday: { open: '08:00', close: '22:00', is24Hours: false },
                saturday: { open: '08:00', close: '22:00', is24Hours: false },
                sunday: { open: '10:00', close: '20:00', is24Hours: false },
            },
            createdAt: '2023-12-01T08:00:00Z',
            updatedAt: '2024-01-20T10:30:00Z',
            createdBy: 'admin-001',
        },
        {
            id: 'assign-002',
            pharmacyId: 'wellcare-ismailia',
            pharmacyName: 'WellCare Pharmacy',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            governorateName: 'Ismailia',
            isPrimary: true,
            isActive: true,
            deliveryRadius: 12,
            deliveryFee: 12,
            minimumOrderAmount: 40,
            estimatedDeliveryTime: '25-40 min',
            commissionRate: 10,
            coverageAreas: ['Ahmed Orabi District', 'El Mahatta District'],
            workingHours: {
                monday: { open: '09:00', close: '23:00', is24Hours: false },
                tuesday: { open: '09:00', close: '23:00', is24Hours: false },
                wednesday: { open: '09:00', close: '23:00', is24Hours: false },
                thursday: { open: '09:00', close: '23:00', is24Hours: false },
                friday: { open: '09:00', close: '23:00', is24Hours: false },
                saturday: { open: '09:00', close: '23:00', is24Hours: false },
                sunday: { open: '10:00', close: '21:00', is24Hours: false },
            },
            createdAt: '2023-12-05T09:00:00Z',
            updatedAt: '2024-01-18T14:20:00Z',
            createdBy: 'admin-001',
        },
        {
            id: 'assign-003',
            pharmacyId: 'family-care-ismailia',
            pharmacyName: 'Family Care Pharmacy',
            cityId: 'ismailia-city',
            cityName: 'Ismailia City',
            governorateId: 'ismailia',
            governorateName: 'Ismailia',
            isPrimary: true,
            isActive: true,
            deliveryRadius: 18,
            deliveryFee: 18,
            minimumOrderAmount: 60,
            estimatedDeliveryTime: '35-50 min',
            commissionRate: 15,
            coverageAreas: ['El Gomhoria District', 'Industrial Area', 'New Ismailia'],
            workingHours: {
                monday: { open: '07:00', close: '24:00', is24Hours: false },
                tuesday: { open: '07:00', close: '24:00', is24Hours: false },
                wednesday: { open: '07:00', close: '24:00', is24Hours: false },
                thursday: { open: '07:00', close: '24:00', is24Hours: false },
                friday: { open: '07:00', close: '24:00', is24Hours: false },
                saturday: { open: '07:00', close: '24:00', is24Hours: false },
                sunday: { open: '08:00', close: '22:00', is24Hours: false },
            },
            createdAt: '2023-12-10T11:00:00Z',
            updatedAt: '2024-01-15T16:45:00Z',
            createdBy: 'admin-001',
        },

        // CAIRO ASSIGNMENTS
        {
            id: 'assign-004',
            pharmacyId: 'medicare-cairo',
            pharmacyName: 'MediCare Pharmacy',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            governorateName: 'Cairo',
            isPrimary: true,
            isActive: true,
            deliveryRadius: 25,
            deliveryFee: 20,
            minimumOrderAmount: 75,
            estimatedDeliveryTime: '20-35 min',
            commissionRate: 8,
            coverageAreas: ['Tahrir Square', 'Downtown Cairo', 'Garden City', 'Zamalek'],
            workingHours: {
                monday: { open: '00:00', close: '23:59', is24Hours: true },
                tuesday: { open: '00:00', close: '23:59', is24Hours: true },
                wednesday: { open: '00:00', close: '23:59', is24Hours: true },
                thursday: { open: '00:00', close: '23:59', is24Hours: true },
                friday: { open: '00:00', close: '23:59', is24Hours: true },
                saturday: { open: '00:00', close: '23:59', is24Hours: true },
                sunday: { open: '00:00', close: '23:59', is24Hours: true },
            },
            createdAt: '2023-11-15T10:00:00Z',
            updatedAt: '2024-01-18T12:20:00Z',
            createdBy: 'admin-001',
        },
        {
            id: 'assign-005',
            pharmacyId: 'wellness-cairo',
            pharmacyName: 'Wellness Pharmacy',
            cityId: 'cairo-city',
            cityName: 'Cairo City',
            governorateId: 'cairo',
            governorateName: 'Cairo',
            isPrimary: true,
            isActive: false, // Suspended
            deliveryRadius: 20,
            deliveryFee: 18,
            minimumOrderAmount: 50,
            estimatedDeliveryTime: '25-40 min',
            commissionRate: 12,
            coverageAreas: ['Kasr El Nil', 'Opera Square', 'Abdeen'],
            workingHours: {
                monday: { open: '08:00', close: '22:00', is24Hours: false },
                tuesday: { open: '08:00', close: '22:00', is24Hours: false },
                wednesday: { open: '08:00', close: '22:00', is24Hours: false },
                thursday: { open: '08:00', close: '22:00', is24Hours: false },
                friday: { open: '08:00', close: '22:00', is24Hours: false },
                saturday: { open: '08:00', close: '22:00', is24Hours: false },
                sunday: { open: '10:00', close: '20:00', is24Hours: false },
            },
            createdAt: '2023-10-20T13:15:00Z',
            updatedAt: '2024-01-10T16:30:00Z',
            createdBy: 'admin-001',
        },

        // CROSS-CITY ASSIGNMENTS
        {
            id: 'assign-006',
            pharmacyId: 'healthplus-ismailia',
            pharmacyName: 'HealthPlus Pharmacy',
            cityId: 'fayed',
            cityName: 'Fayed',
            governorateId: 'ismailia',
            governorateName: 'Ismailia',
            isPrimary: false,
            isActive: true,
            deliveryRadius: 10,
            deliveryFee: 25,
            minimumOrderAmount: 75,
            estimatedDeliveryTime: '45-60 min',
            commissionRate: 14, // Higher commission for cross-city delivery
            coverageAreas: ['Fayed Center', 'Fayed Port Area'],
            workingHours: {
                monday: { open: '09:00', close: '20:00', is24Hours: false },
                tuesday: { open: '09:00', close: '20:00', is24Hours: false },
                wednesday: { open: '09:00', close: '20:00', is24Hours: false },
                thursday: { open: '09:00', close: '20:00', is24Hours: false },
                friday: { open: '09:00', close: '20:00', is24Hours: false },
                saturday: { open: '09:00', close: '20:00', is24Hours: false },
                sunday: { open: '10:00', close: '18:00', is24Hours: false },
            },
            createdAt: '2024-01-10T14:00:00Z',
            updatedAt: '2024-01-20T09:15:00Z',
            createdBy: 'admin-001',
        },

        // ALEXANDRIA ASSIGNMENTS
        {
            id: 'assign-007',
            pharmacyId: 'beauty-health-alexandria',
            pharmacyName: 'Beauty Health Store',
            cityId: 'alexandria-city',
            cityName: 'Alexandria City',
            governorateId: 'alexandria',
            governorateName: 'Alexandria',
            isPrimary: true,
            isActive: true,
            deliveryRadius: 20,
            deliveryFee: 16,
            minimumOrderAmount: 45,
            estimatedDeliveryTime: '30-45 min',
            commissionRate: 14,
            coverageAreas: ['Corniche', 'Stanley', 'Sidi Gaber'],
            workingHours: {
                monday: { open: '09:00', close: '21:00', is24Hours: false },
                tuesday: { open: '09:00', close: '21:00', is24Hours: false },
                wednesday: { open: '09:00', close: '21:00', is24Hours: false },
                thursday: { open: '09:00', close: '21:00', is24Hours: false },
                friday: { open: '09:00', close: '21:00', is24Hours: false },
                saturday: { open: '09:00', close: '21:00', is24Hours: false },
                sunday: { open: '10:00', close: '19:00', is24Hours: false },
            },
            createdAt: '2023-12-15T12:00:00Z',
            updatedAt: '2024-01-12T11:30:00Z',
            createdBy: 'admin-001',
        },
    ];

    private coverageAreas: CoverageArea[] = [
        // ISMAILIA COVERAGE AREAS
        {
            id: 'area-001',
            name: 'Downtown Ismailia',
            nameAr: 'وسط الإسماعيلية',
            cityId: 'ismailia-city',
            coordinates: { lat: 30.5965, lng: 32.2715 },
            radius: 3,
            isActive: true,
        },
        {
            id: 'area-002',
            name: 'El Tahrir District',
            nameAr: 'حي التحرير',
            cityId: 'ismailia-city',
            coordinates: { lat: 30.5975, lng: 32.2725 },
            radius: 2.5,
            isActive: true,
        },
        {
            id: 'area-003',
            name: 'El Salam District',
            nameAr: 'حي السلام',
            cityId: 'ismailia-city',
            coordinates: { lat: 30.5985, lng: 32.2735 },
            radius: 2,
            isActive: true,
        },

        // CAIRO COVERAGE AREAS
        {
            id: 'area-004',
            name: 'Tahrir Square Area',
            nameAr: 'منطقة ميدان التحرير',
            cityId: 'cairo-city',
            coordinates: { lat: 30.0444, lng: 31.2357 },
            radius: 5,
            isActive: true,
        },
        {
            id: 'area-005',
            name: 'Zamalek District',
            nameAr: 'حي الزمالك',
            cityId: 'cairo-city',
            coordinates: { lat: 30.0626, lng: 31.2197 },
            radius: 4,
            isActive: true,
        },

        // ALEXANDRIA COVERAGE AREAS
        {
            id: 'area-006',
            name: 'Corniche Area',
            nameAr: 'منطقة الكورنيش',
            cityId: 'alexandria-city',
            coordinates: { lat: 31.2001, lng: 29.9187 },
            radius: 6,
            isActive: true,
        },
    ];

    // Get all assignments with filtering
    getAssignments(filters?: AssignmentFilters): PharmacyCityAssignment[] {
        let filteredAssignments = [...this.assignments];

        if (filters) {
            if (filters.pharmacyId) {
                filteredAssignments = filteredAssignments.filter(
                    (a) => a.pharmacyId === filters.pharmacyId,
                );
            }
            if (filters.cityId) {
                filteredAssignments = filteredAssignments.filter(
                    (a) => a.cityId === filters.cityId,
                );
            }
            if (filters.governorateId) {
                filteredAssignments = filteredAssignments.filter(
                    (a) => a.governorateId === filters.governorateId,
                );
            }
            if (filters.status && filters.status !== 'all') {
                filteredAssignments = filteredAssignments.filter((a) =>
                    filters.status === 'active' ? a.isActive : !a.isActive,
                );
            }
            if (filters.isPrimary !== undefined) {
                filteredAssignments = filteredAssignments.filter(
                    (a) => a.isPrimary === filters.isPrimary,
                );
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredAssignments = filteredAssignments.filter(
                    (a) =>
                        a.pharmacyName.toLowerCase().includes(searchTerm) ||
                        a.cityName.toLowerCase().includes(searchTerm) ||
                        a.governorateName.toLowerCase().includes(searchTerm),
                );
            }

            // Sort results
            if (filters.sortBy) {
                filteredAssignments.sort((a, b) => {
                    let aValue: any, bValue: any;

                    switch (filters.sortBy) {
                        case 'pharmacy':
                            aValue = a.pharmacyName;
                            bValue = b.pharmacyName;
                            break;
                        case 'city':
                            aValue = a.cityName;
                            bValue = b.cityName;
                            break;
                        case 'commission':
                            aValue = a.commissionRate;
                            bValue = b.commissionRate;
                            break;
                        case 'deliveryTime':
                            aValue = parseInt(a.estimatedDeliveryTime.split('-')[0]);
                            bValue = parseInt(b.estimatedDeliveryTime.split('-')[0]);
                            break;
                        case 'createdAt':
                            aValue = new Date(a.createdAt).getTime();
                            bValue = new Date(b.createdAt).getTime();
                            break;
                        default:
                            return 0;
                    }

                    if (typeof aValue === 'string') {
                        const comparison = aValue.localeCompare(bValue);
                        return filters.sortOrder === 'desc' ? -comparison : comparison;
                    } else {
                        const comparison = aValue - bValue;
                        return filters.sortOrder === 'desc' ? -comparison : comparison;
                    }
                });
            }
        }

        return filteredAssignments;
    }

    // Get assignment by ID
    getAssignmentById(id: string): PharmacyCityAssignment | undefined {
        return this.assignments.find((a) => a.id === id);
    }

    // Get assignments for a specific pharmacy
    getPharmacyAssignments(pharmacyId: string): PharmacyCityAssignment[] {
        return this.assignments.filter((a) => a.pharmacyId === pharmacyId);
    }

    // Get assignments for a specific city
    getCityAssignments(cityId: string): PharmacyCityAssignment[] {
        return this.assignments.filter((a) => a.cityId === cityId && a.isActive);
    }

    // Get coverage statistics
    getCoverageStats(): PharmacyCoverageStats {
        const totalAssignments = this.assignments.length;
        const activeCities = new Set(
            this.assignments.filter((a) => a.isActive).map((a) => a.cityId),
        ).size;

        const totalCoverageArea = this.assignments
            .filter((a) => a.isActive)
            .reduce((sum, a) => sum + Math.PI * Math.pow(a.deliveryRadius, 2), 0);

        const averageDeliveryTime =
            this.assignments
                .filter((a) => a.isActive)
                .reduce((sum, a) => {
                    const time = parseInt(a.estimatedDeliveryTime.split('-')[0]);
                    return sum + time;
                }, 0) / this.assignments.filter((a) => a.isActive).length;

        const averageCommissionRate =
            this.assignments
                .filter((a) => a.isActive)
                .reduce((sum, a) => sum + a.commissionRate, 0) /
            this.assignments.filter((a) => a.isActive).length;

        // Group by city
        const cityGroups = this.assignments
            .filter((a) => a.isActive)
            .reduce(
                (acc, assignment) => {
                    const existing = acc.find((c) => c.cityId === assignment.cityId);
                    if (existing) {
                        existing.pharmacyCount++;
                        existing.averageCommission =
                            (existing.averageCommission + assignment.commissionRate) / 2;
                    } else {
                        acc.push({
                            cityId: assignment.cityId,
                            cityName: assignment.cityName,
                            pharmacyCount: 1,
                            averageCommission: assignment.commissionRate,
                            totalOrders: Math.floor(Math.random() * 1000) + 100, // Mock data
                            revenue: Math.floor(Math.random() * 50000) + 10000, // Mock data
                        });
                    }
                    return acc;
                },
                [] as PharmacyCoverageStats['byCityStats'],
            );

        // Group by governorate
        const governorateGroups = this.assignments
            .filter((a) => a.isActive)
            .reduce((acc, assignment) => {
                const existing = acc.find((g) => g.governorateId === assignment.governorateId);
                if (existing) {
                    existing.pharmacyCount++;
                    // Add cityId to the cities set for this governorate
                    existing.cities.add(assignment.cityId);
                    existing.averageCommission =
                        (existing.averageCommission + assignment.commissionRate) / 2;
                } else {
                    acc.push({
                        governorateId: assignment.governorateId,
                        governorateName: assignment.governorateName,
                        pharmacyCount: 1,
                        cities: new Set([assignment.cityId]), // Use Set to track unique cities
                        averageCommission: assignment.commissionRate,
                        totalRevenue: Math.floor(Math.random() * 100000) + 20000, // Mock data
                    });
                }
                return acc;
            }, [] as any[])
            .map((g) => ({
                governorateId: g.governorateId,
                governorateName: g.governorateName,
                pharmacyCount: g.pharmacyCount,
                cityCount: g.cities.size, // Convert Set size to number
                averageCommission: g.averageCommission,
                totalRevenue: g.totalRevenue,
            }));

        return {
            totalAssignments,
            activeCities,
            totalCoverageArea,
            averageDeliveryTime,
            averageCommissionRate,
            byCityStats: cityGroups,
            byGovernorateStats: governorateGroups,
        };
    }

    // Create new assignment
    createAssignment(assignmentData: NewAssignmentRequest): string {
        const newAssignment: PharmacyCityAssignment = {
            id: `assign-${Date.now()}`,
            ...assignmentData,
            pharmacyName:
                pharmacies.find((p) => p.id === assignmentData.pharmacyId)?.name || 'Unknown',
            cityName: cities.find((c) => c.id === assignmentData.cityId)?.nameEn || 'Unknown',
            governorateId: cities.find((c) => c.id === assignmentData.cityId)?.governorateId || '',
            governorateName:
                cities.find((c) => c.id === assignmentData.cityId)?.governorateName || 'Unknown',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'admin-current',
        };

        this.assignments.push(newAssignment);
        return newAssignment.id;
    }

    // Update assignment
    updateAssignment(id: string, updates: Partial<PharmacyCityAssignment>): boolean {
        const index = this.assignments.findIndex((a) => a.id === id);
        if (index !== -1) {
            this.assignments[index] = {
                ...this.assignments[index],
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            return true;
        }
        return false;
    }

    // Toggle assignment status
    toggleAssignmentStatus(id: string): boolean {
        const assignment = this.assignments.find((a) => a.id === id);
        if (assignment) {
            assignment.isActive = !assignment.isActive;
            assignment.updatedAt = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Delete assignment
    deleteAssignment(id: string): boolean {
        const index = this.assignments.findIndex((a) => a.id === id);
        if (index !== -1) {
            this.assignments.splice(index, 1);
            return true;
        }
        return false;
    }

    // Get coverage areas for a city
    getCoverageAreas(cityId: string): CoverageArea[] {
        return this.coverageAreas.filter((area) => area.cityId === cityId && area.isActive);
    }

    // Get all available pharmacies
    getAvailablePharmacies(): Pharmacy[] {
        return pharmacies.filter((p) => p.isActive);
    }

    // Get all available cities
    getAvailableCities(): City[] {
        return cities.filter((c) => c.isEnabled);
    }

    // Get all available governorates
    getAvailableGovernorates(): Governorate[] {
        return governorates;
    }

    // Bulk update commission rates
    bulkUpdateCommissionRates(
        assignmentIds: string[],
        newRate: number,
        applyToGovernorate?: boolean,
    ): boolean {
        if (applyToGovernorate) {
            // Apply to all assignments in the same governorate
            const governorateIds = new Set(
                assignmentIds
                    .map((id) => this.assignments.find((a) => a.id === id)?.governorateId)
                    .filter(Boolean),
            );

            this.assignments.forEach((assignment) => {
                if (governorateIds.has(assignment.governorateId)) {
                    assignment.commissionRate = newRate;
                    assignment.updatedAt = new Date().toISOString();
                }
            });
        } else {
            // Apply only to selected assignments
            assignmentIds.forEach((id) => {
                const assignment = this.assignments.find((a) => a.id === id);
                if (assignment) {
                    assignment.commissionRate = newRate;
                    assignment.updatedAt = new Date().toISOString();
                }
            });
        }

        return true;
    }

    // Get pharmacy coverage summary
    getPharmacyCoverageSummary(pharmacyId: string): {
        totalCities: number;
        activeCities: number;
        totalCoverageArea: number;
        averageCommission: number;
        primaryCity: string;
    } {
        const pharmacyAssignments = this.getPharmacyAssignments(pharmacyId);
        const activeAssignments = pharmacyAssignments.filter((a) => a.isActive);

        const totalCities = pharmacyAssignments.length;
        const activeCities = activeAssignments.length;
        const totalCoverageArea = activeAssignments.reduce(
            (sum, a) => sum + Math.PI * Math.pow(a.deliveryRadius, 2),
            0,
        );
        const averageCommission =
            activeAssignments.reduce((sum, a) => sum + a.commissionRate, 0) / activeCities || 0;
        const primaryCity = pharmacyAssignments.find((a) => a.isPrimary)?.cityName || 'Not set';

        return {
            totalCities,
            activeCities,
            totalCoverageArea,
            averageCommission,
            primaryCity,
        };
    }

    // Get city coverage summary
    getCityCoverageSummary(cityId: string): {
        totalPharmacies: number;
        activePharmacies: number;
        averageDeliveryTime: number;
        averageCommission: number;
        coverageAreas: string[];
    } {
        const cityAssignments = this.getCityAssignments(cityId);

        const totalPharmacies = cityAssignments.length;
        const activePharmacies = cityAssignments.filter((a) => a.isActive).length;
        const averageDeliveryTime =
            cityAssignments.reduce((sum, a) => {
                const time = parseInt(a.estimatedDeliveryTime.split('-')[0]);
                return sum + time;
            }, 0) / totalPharmacies || 0;
        const averageCommission =
            cityAssignments.reduce((sum, a) => sum + a.commissionRate, 0) / totalPharmacies || 0;
        const coverageAreas = [...new Set(cityAssignments.flatMap((a) => a.coverageAreas))];

        return {
            totalPharmacies,
            activePharmacies,
            averageDeliveryTime,
            averageCommission,
            coverageAreas,
        };
    }
}

export const pharmacyCityAssignmentService = new PharmacyCityAssignmentService();
