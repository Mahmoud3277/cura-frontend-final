// Integrated Account Service - Connects account creation with city management
import { cityManagementService, CityWithStatus } from './cityManagementService';
import { userManagementService, User } from './userManagementService';
import { cities } from '@/lib/data/cities';

export interface AccountCreationData {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    nationalId: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | '';
    // Location Information
    governorate: string;
    city: string;
    address: string;
    // Account Information
    userType:
        | 'customer'
        | 'pharmacy'
        | 'doctor'
        | 'vendor'
        | 'prescription-reader'
        | 'database-input'
        | 'admin';
    status: 'active' | 'pending' | 'suspended';
    // Role-Specific Information
    roleSpecificData: {
        // Pharmacy specific
        pharmacyName?: string;
        pharmacyNameArabic?: string;
        pharmacyLicense?: string;
        operatingHoursOpen?: string;
        operatingHoursClose?: string;
        commissionRate?: number;
        servicesOffered?: string[];
        whatsappNumber?: string;
        // Doctor specific
        specialization?: string;
        medicalLicense?: string;
        clinicName?: string;
        clinicAddress?: string;
        availableDays?: string[];
        availableHoursStart?: string;
        availableHoursEnd?: string;
        // Vendor specific
        companyName?: string;
        businessLicense?: string;
        productCategories?: string[];
        supplierType?: 'manufacturer' | 'distributor' | 'wholesaler';
        // Staff specific
        department?: string;
        position?: string;
        permissions?: string[];
        // Prescription Reader specific
        shiftStartTime?: string;
        shiftEndTime?: string;
        experienceLevel?: 'junior' | 'senior' | 'expert';
        languagesSpoken?: string[];
        certifications?: string[];
        // Database Input specific
        workingHoursStart?: string;
        workingHoursEnd?: string;
        specializedCategories?: string[];
    };
}

export interface CityStatistics {
    cityId: string;
    cityName: string;
    governorate: string;
    totalPharmacies: number;
    activePharmacies: number;
    pendingPharmacies: number;
    totalDoctors: number;
    activeDoctors: number;
    pendingDoctors: number;
    totalVendors: number;
    activeVendors: number;
    pendingVendors: number;
    totalCustomers: number;
    activeCustomers: number;
    lastUpdated: string;
}

export interface AccountCreationResult {
    success: boolean;
    userId?: string;
    message: string;
    cityUpdated: boolean;
    newCityStats?: CityStatistics;
}

class IntegratedAccountService {
    // Create a new account and update city statistics
    async createAccount(accountData: AccountCreationData): Promise<AccountCreationResult> {
        try {
            // Validate required fields
            if (
                !accountData.firstName ||
                !accountData.lastName ||
                !accountData.email ||
                !accountData.city ||
                !accountData.governorate
            ) {
                return {
                    success: false,
                    message: 'Missing required fields',
                    cityUpdated: false,
                };
            }

            // Generate unique user ID
            const userId = this.generateUserId(accountData.userType);

            // Create user object
            const newUser: User = {
                id: userId,
                email: accountData.email,
                name: `${accountData.firstName} ${accountData.lastName}`,
                nameAr: `${accountData.firstName} ${accountData.lastName}`, // In real app, you'd have Arabic names
                phone: accountData.phone,
                userType: accountData.userType,
                status: accountData.status,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                city: accountData.city,
                governorate: accountData.governorate,
                profileComplete: true,
                emailVerified: accountData.status === 'active',
                phoneVerified: accountData.status === 'active',
                metadata: this.buildUserMetadata(accountData),
            };

            // Add user to user management system
            const userCreated = this.addUserToSystem(newUser);

            if (!userCreated) {
                return {
                    success: false,
                    message: 'Failed to create user account',
                    cityUpdated: false,
                };
            }

            // Update city statistics based on account type
            const cityUpdated = await this.updateCityStatistics(
                accountData.city,
                accountData.userType,
                'add',
            );

            // Get updated city statistics
            const updatedStats = this.getCityStatistics(accountData.city);

            // Log the account creation for tracking
            this.logAccountCreation(userId, accountData);

            return {
                success: true,
                userId: userId,
                message: `${accountData.userType} account created successfully`,
                cityUpdated: cityUpdated,
                newCityStats: updatedStats,
            };
        } catch (error) {
            console.error('Error creating account:', error);
            return {
                success: false,
                message: 'An error occurred while creating the account',
                cityUpdated: false,
            };
        }
    }

    // Update city statistics when accounts are created/deleted/status changed
    private async updateCityStatistics(
        cityName: string,
        userType: string,
        action: 'add' | 'remove' | 'activate' | 'deactivate',
    ): Promise<boolean> {
        try {
            // Find the city in the cities data
            const city = cities.find((c) => c.nameEn === cityName);
            if (!city) {
                console.error(`City not found: ${cityName}`);
                return false;
            }

            // Update the appropriate counter based on user type
            switch (userType) {
                case 'pharmacy':
                    if (action === 'add') {
                        city.pharmacyCount += 1;
                    } else if (action === 'remove') {
                        city.pharmacyCount = Math.max(0, city.pharmacyCount - 1);
                    }
                    break;

                case 'doctor':
                    if (action === 'add') {
                        city.doctorCount += 1;
                    } else if (action === 'remove') {
                        city.doctorCount = Math.max(0, city.doctorCount - 1);
                    }
                    break;

                case 'vendor':
                    // Vendors affect pharmacy count (as they supply to pharmacies)
                    // You might want to track vendors separately
                    break;

                default:
                    // For other user types (customers, admin, etc.), no city stats update needed
                    break;
            }

            // Update the city management service's last updated timestamp
            cityManagementService.updateAdminSettings({
                ...cityManagementService.getAdminSettings(),
                lastUpdated: new Date().toISOString(),
            });

            console.log(`Updated ${cityName} statistics: ${userType} ${action}`);
            return true;
        } catch (error) {
            console.error('Error updating city statistics:', error);
            return false;
        }
    }

    // Get comprehensive city statistics including real user counts
    getCityStatistics(cityName: string): CityStatistics | null {
        try {
            const city = cities.find((c) => c.nameEn === cityName);
            if (!city) return null;

            // Get real user counts from user management service
            const allUsers = userManagementService.getUsers();
            const cityUsers = allUsers.filter((user) => user.city === cityName);

            const pharmacies = cityUsers.filter((user) => user.userType === 'pharmacy');
            const doctors = cityUsers.filter((user) => user.userType === 'doctor');
            const vendors = cityUsers.filter((user) => user.userType === 'vendor');
            const customers = cityUsers.filter((user) => user.userType === 'customer');

            return {
                cityId: city.id,
                cityName: city.nameEn,
                governorate: city.governorateName,
                totalPharmacies: pharmacies.length,
                activePharmacies: pharmacies.filter((p) => p.status === 'active').length,
                pendingPharmacies: pharmacies.filter((p) => p.status === 'pending').length,
                totalDoctors: doctors.length,
                activeDoctors: doctors.filter((d) => d.status === 'active').length,
                pendingDoctors: doctors.filter((d) => d.status === 'pending').length,
                totalVendors: vendors.length,
                activeVendors: vendors.filter((v) => v.status === 'active').length,
                pendingVendors: vendors.filter((v) => v.status === 'pending').length,
                totalCustomers: customers.length,
                activeCustomers: customers.filter((c) => c.status === 'active').length,
                lastUpdated: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Error getting city statistics:', error);
            return null;
        }
    }

    // Get statistics for all cities
    getAllCityStatistics(): CityStatistics[] {
        return cities
            .map((city) => this.getCityStatistics(city.nameEn))
            .filter(Boolean) as CityStatistics[];
    }

    // Update account status and reflect in city stats
    async updateAccountStatus(userId: string, newStatus: User['status']): Promise<boolean> {
        try {
            const user = userManagementService.getUserById(userId);
            if (!user) return false;

            const oldStatus = user.status;
            const updated = userManagementService.updateUserStatus(userId, newStatus);

            if (updated && oldStatus !== newStatus) {
                // Update city statistics based on status change
                if (oldStatus === 'pending' && newStatus === 'active') {
                    await this.updateCityStatistics(user.city, user.userType, 'activate');
                } else if (
                    oldStatus === 'active' &&
                    (newStatus === 'suspended' || newStatus === 'inactive')
                ) {
                    await this.updateCityStatistics(user.city, user.userType, 'deactivate');
                }
            }

            return updated;
        } catch (error) {
            console.error('Error updating account status:', error);
            return false;
        }
    }

    // Delete account and update city stats
    async deleteAccount(userId: string): Promise<boolean> {
        try {
            const user = userManagementService.getUserById(userId);
            if (!user) return false;

            const deleted = userManagementService.deleteUser(userId);

            if (deleted) {
                await this.updateCityStatistics(user.city, user.userType, 'remove');
            }

            return deleted;
        } catch (error) {
            console.error('Error deleting account:', error);
            return false;
        }
    }

    // Helper methods
    private generateUserId(userType: string): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5);
        const prefix = userType.substring(0, 3).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }

    private buildUserMetadata(accountData: AccountCreationData): User['metadata'] {
        const metadata: User['metadata'] = {};

        switch (accountData.userType) {
            case 'pharmacy':
                metadata.pharmacyName = accountData.roleSpecificData.pharmacyName;
                metadata.licenseNumber = accountData.roleSpecificData.pharmacyLicense;
                metadata.commission = accountData.roleSpecificData.commissionRate || 10;
                metadata.rating = 0;
                metadata.reviewsCount = 0;
                metadata.ordersCount = 0;
                break;

            case 'doctor':
                metadata.specialization = accountData.roleSpecificData.specialization;
                metadata.licenseNumber = accountData.roleSpecificData.medicalLicense;
                metadata.commission = accountData.roleSpecificData.commissionRate || 15;
                metadata.rating = 0;
                metadata.reviewsCount = 0;
                break;

            case 'vendor':
                metadata.specialization = accountData.roleSpecificData.supplierType;
                metadata.licenseNumber = accountData.roleSpecificData.businessLicense;
                break;

            case 'customer':
                metadata.ordersCount = 0;
                metadata.totalSpent = 0;
                break;

            default:
                metadata.specialization = accountData.roleSpecificData.department || 'General';
                break;
        }

        return metadata;
    }

    private addUserToSystem(user: User): boolean {
        try {
            // In a real application, this would make an API call to create the user
            // For now, we'll add it to the mock data
            const users = userManagementService.getUsers();
            users.push(user);
            console.log('User added to system:', user.id);
            return true;
        } catch (error) {
            console.error('Error adding user to system:', error);
            return false;
        }
    }

    private logAccountCreation(userId: string, accountData: AccountCreationData): void {
        console.log('Account Creation Log:', {
            userId,
            userType: accountData.userType,
            city: accountData.city,
            governorate: accountData.governorate,
            timestamp: new Date().toISOString(),
        });
    }

    // Get account creation analytics
    getAccountCreationAnalytics() {
        const users = userManagementService.getUsers();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentUsers = users.filter((user) => new Date(user.createdAt) >= thirtyDaysAgo);

        return {
            totalAccounts: users.length,
            recentAccounts: recentUsers.length,
            accountsByType: {
                pharmacy: users.filter((u) => u.userType === 'pharmacy').length,
                doctor: users.filter((u) => u.userType === 'doctor').length,
                vendor: users.filter((u) => u.userType === 'vendor').length,
                customer: users.filter((u) => u.userType === 'customer').length,
                other: users.filter(
                    (u) => !['pharmacy', 'doctor', 'vendor', 'customer'].includes(u.userType),
                ).length,
            },
            accountsByCity: this.getAccountsByCity(),
            accountsByStatus: {
                active: users.filter((u) => u.status === 'active').length,
                pending: users.filter((u) => u.status === 'pending').length,
                suspended: users.filter((u) => u.status === 'suspended').length,
                inactive: users.filter((u) => u.status === 'inactive').length,
            },
        };
    }

    private getAccountsByCity() {
        const users = userManagementService.getUsers();
        const cityGroups: { [key: string]: number } = {};

        users.forEach((user) => {
            cityGroups[user.city] = (cityGroups[user.city] || 0) + 1;
        });

        return Object.entries(cityGroups)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count);
    }
}

export const integratedAccountService = new IntegratedAccountService();
