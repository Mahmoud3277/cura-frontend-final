// Cross-City Ordering Service - Comprehensive cross-city ordering management
import { Pharmacy } from '@/lib/data/pharmacies';
import { AdminCitySettings } from '@/lib/data/adminSettings';

export interface CrossCityOrderingSettings {
    globalCrossCityEnabled: boolean;
    maxDeliveryDistance: number; // in kilometers
    crossCityDeliveryFee: number; // additional fee for cross-city orders
    estimatedCrossCityDeliveryTime: string; // e.g., "60-90 min"
    allowedCrossCityOrderTypes: string[]; // e.g., ["prescription", "emergency"]
    minimumCrossCityOrderAmount: number;
    lastUpdated: string;
}

export interface PharmacyCrossCitySettings {
    pharmacyId: string;
    allowsCrossCityOrders: boolean;
    maxDeliveryRadius: number; // in kilometers
    crossCityDeliveryFee: number;
    crossCityMinOrderAmount: number;
    deliveryZones: DeliveryZone[];
    workingCities: string[]; // city IDs where this pharmacy delivers
    estimatedDeliveryTimes: { [cityId: string]: string };
    specialCrossCityServices: string[]; // e.g., ["emergency", "prescription_only"]
    lastUpdated: string;
}

export interface DeliveryZone {
    id: string;
    name: string;
    nameAr: string;
    cityIds: string[];
    governorateIds: string[];
    deliveryFee: number;
    estimatedDeliveryTime: string;
    minOrderAmount: number;
    isActive: boolean;
    coordinates: {
        center: { lat: number; lng: number };
        radius: number; // in kilometers
    };
    restrictions: {
        prescriptionOnly: boolean;
        emergencyOnly: boolean;
        timeRestrictions: {
            startTime: string;
            endTime: string;
        };
    };
}

export interface CrossCityOrderRequest {
    customerId: string;
    customerCityId: string;
    pharmacyId: string;
    pharmacyCityId: string;
    orderType: 'regular' | 'prescription' | 'emergency';
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    deliveryAddress: {
        street: string;
        cityId: string;
        governorateId: string;
        coordinates: { lat: number; lng: number };
    };
    estimatedDeliveryTime: string;
    crossCityDeliveryFee: number;
    totalAmount: number;
    specialInstructions?: string;
}

export interface CrossCityOrderAnalytics {
    totalCrossCityOrders: number;
    crossCityRevenue: number;
    averageCrossCityOrderValue: number;
    topCrossCityRoutes: {
        fromCity: string;
        toCity: string;
        orderCount: number;
        revenue: number;
    }[];
    pharmacyCrossCityPerformance: {
        pharmacyId: string;
        pharmacyName: string;
        crossCityOrders: number;
        crossCityRevenue: number;
        averageDeliveryTime: number;
        customerSatisfaction: number;
    }[];
    cityCrossCityStats: {
        cityId: string;
        cityName: string;
        ordersReceived: number;
        ordersSent: number;
        netOrderFlow: number;
    }[];
}

class CrossCityOrderingService {
    private globalSettings: CrossCityOrderingSettings = {
        globalCrossCityEnabled: true,
        maxDeliveryDistance: 100, // 100km max
        crossCityDeliveryFee: 25, // EGP 25 base fee
        estimatedCrossCityDeliveryTime: '60-90 min',
        allowedCrossCityOrderTypes: ['prescription', 'emergency', 'regular'],
        minimumCrossCityOrderAmount: 100, // EGP 100 minimum
        lastUpdated: new Date().toISOString(),
    };

    private pharmacySettings: PharmacyCrossCitySettings[] = [
        {
            pharmacyId: 'healthplus-ismailia',
            allowsCrossCityOrders: true,
            maxDeliveryRadius: 50,
            crossCityDeliveryFee: 20,
            crossCityMinOrderAmount: 75,
            deliveryZones: [
                {
                    id: 'zone-ismailia-cairo',
                    name: 'Ismailia to Cairo Zone',
                    nameAr: 'منطقة الإسماعيلية إلى القاهرة',
                    cityIds: ['cairo-city', 'new-cairo', 'helwan'],
                    governorateIds: ['cairo'],
                    deliveryFee: 30,
                    estimatedDeliveryTime: '90-120 min',
                    minOrderAmount: 100,
                    isActive: true,
                    coordinates: {
                        center: { lat: 30.3, lng: 31.7 },
                        radius: 80,
                    },
                    restrictions: {
                        prescriptionOnly: false,
                        emergencyOnly: false,
                        timeRestrictions: {
                            startTime: '08:00',
                            endTime: '20:00',
                        },
                    },
                },
                {
                    id: 'zone-ismailia-local',
                    name: 'Ismailia Local Zone',
                    nameAr: 'المنطقة المحلية للإسماعيلية',
                    cityIds: ['fayed', 'abu-suwir', 'qantara'],
                    governorateIds: ['ismailia'],
                    deliveryFee: 15,
                    estimatedDeliveryTime: '45-60 min',
                    minOrderAmount: 50,
                    isActive: true,
                    coordinates: {
                        center: { lat: 30.6, lng: 32.3 },
                        radius: 30,
                    },
                    restrictions: {
                        prescriptionOnly: false,
                        emergencyOnly: false,
                        timeRestrictions: {
                            startTime: '07:00',
                            endTime: '22:00',
                        },
                    },
                },
            ],
            workingCities: ['ismailia-city', 'fayed', 'abu-suwir', 'cairo-city', 'new-cairo'],
            estimatedDeliveryTimes: {
                'ismailia-city': '30-45 min',
                fayed: '45-60 min',
                'abu-suwir': '50-65 min',
                'cairo-city': '90-120 min',
                'new-cairo': '100-130 min',
            },
            specialCrossCityServices: ['prescription', 'emergency'],
            lastUpdated: new Date().toISOString(),
        },
        {
            pharmacyId: 'medicare-cairo',
            allowsCrossCityOrders: true,
            maxDeliveryRadius: 75,
            crossCityDeliveryFee: 25,
            crossCityMinOrderAmount: 100,
            deliveryZones: [
                {
                    id: 'zone-cairo-giza',
                    name: 'Cairo to Giza Zone',
                    nameAr: 'منطقة القاهرة إلى الجيزة',
                    cityIds: ['giza-city', '6th-october'],
                    governorateIds: ['giza'],
                    deliveryFee: 20,
                    estimatedDeliveryTime: '45-60 min',
                    minOrderAmount: 75,
                    isActive: true,
                    coordinates: {
                        center: { lat: 30.02, lng: 31.22 },
                        radius: 25,
                    },
                    restrictions: {
                        prescriptionOnly: false,
                        emergencyOnly: false,
                        timeRestrictions: {
                            startTime: '06:00',
                            endTime: '23:00',
                        },
                    },
                },
                {
                    id: 'zone-cairo-alexandria',
                    name: 'Cairo to Alexandria Zone',
                    nameAr: 'منطقة القاهرة إلى الإسكندرية',
                    cityIds: ['alexandria-city', 'borg-el-arab'],
                    governorateIds: ['alexandria'],
                    deliveryFee: 40,
                    estimatedDeliveryTime: '120-150 min',
                    minOrderAmount: 150,
                    isActive: true,
                    coordinates: {
                        center: { lat: 30.6, lng: 30.6 },
                        radius: 100,
                    },
                    restrictions: {
                        prescriptionOnly: true,
                        emergencyOnly: false,
                        timeRestrictions: {
                            startTime: '08:00',
                            endTime: '18:00',
                        },
                    },
                },
            ],
            workingCities: ['cairo-city', 'new-cairo', 'helwan', 'giza-city', 'alexandria-city'],
            estimatedDeliveryTimes: {
                'cairo-city': '20-35 min',
                'new-cairo': '35-50 min',
                helwan: '40-55 min',
                'giza-city': '45-60 min',
                'alexandria-city': '120-150 min',
            },
            specialCrossCityServices: ['prescription', 'emergency', '24_hours'],
            lastUpdated: new Date().toISOString(),
        },
        {
            pharmacyId: 'alexandria-central',
            allowsCrossCityOrders: true,
            maxDeliveryRadius: 60,
            crossCityDeliveryFee: 30,
            crossCityMinOrderAmount: 80,
            deliveryZones: [
                {
                    id: 'zone-alexandria-cairo',
                    name: 'Alexandria to Cairo Zone',
                    nameAr: 'منطقة الإسكندرية إلى القاهرة',
                    cityIds: ['cairo-city', 'giza-city'],
                    governorateIds: ['cairo', 'giza'],
                    deliveryFee: 45,
                    estimatedDeliveryTime: '120-180 min',
                    minOrderAmount: 150,
                    isActive: true,
                    coordinates: {
                        center: { lat: 30.6, lng: 30.6 },
                        radius: 120,
                    },
                    restrictions: {
                        prescriptionOnly: true,
                        emergencyOnly: false,
                        timeRestrictions: {
                            startTime: '09:00',
                            endTime: '17:00',
                        },
                    },
                },
            ],
            workingCities: ['alexandria-city', 'borg-el-arab', 'cairo-city', 'giza-city'],
            estimatedDeliveryTimes: {
                'alexandria-city': '25-40 min',
                'borg-el-arab': '45-60 min',
                'cairo-city': '120-180 min',
                'giza-city': '130-190 min',
            },
            specialCrossCityServices: ['prescription'],
            lastUpdated: new Date().toISOString(),
        },
        {
            pharmacyId: 'giza-modern',
            allowsCrossCityOrders: true,
            maxDeliveryRadius: 40,
            crossCityDeliveryFee: 18,
            crossCityMinOrderAmount: 60,
            deliveryZones: [
                {
                    id: 'zone-giza-cairo',
                    name: 'Giza to Cairo Zone',
                    nameAr: 'منطقة الجيزة إلى القاهرة',
                    cityIds: ['cairo-city', 'new-cairo', 'helwan'],
                    governorateIds: ['cairo'],
                    deliveryFee: 22,
                    estimatedDeliveryTime: '40-60 min',
                    minOrderAmount: 70,
                    isActive: true,
                    coordinates: {
                        center: { lat: 30.02, lng: 31.22 },
                        radius: 30,
                    },
                    restrictions: {
                        prescriptionOnly: false,
                        emergencyOnly: false,
                        timeRestrictions: {
                            startTime: '07:00',
                            endTime: '21:00',
                        },
                    },
                },
            ],
            workingCities: ['giza-city', '6th-october', 'cairo-city', 'new-cairo'],
            estimatedDeliveryTimes: {
                'giza-city': '20-35 min',
                '6th-october': '30-45 min',
                'cairo-city': '40-60 min',
                'new-cairo': '50-70 min',
            },
            specialCrossCityServices: ['prescription'],
            lastUpdated: new Date().toISOString(),
        },
    ];

    private mockAnalytics: CrossCityOrderAnalytics = {
        totalCrossCityOrders: 1247,
        crossCityRevenue: 156780,
        averageCrossCityOrderValue: 125.8,
        topCrossCityRoutes: [
            {
                fromCity: 'Cairo City',
                toCity: 'Giza City',
                orderCount: 342,
                revenue: 42650,
            },
            {
                fromCity: 'Ismailia City',
                toCity: 'Cairo City',
                orderCount: 198,
                revenue: 28940,
            },
            {
                fromCity: 'Alexandria City',
                toCity: 'Cairo City',
                orderCount: 156,
                revenue: 24780,
            },
            {
                fromCity: 'Giza City',
                toCity: 'Cairo City',
                orderCount: 234,
                revenue: 31200,
            },
        ],
        pharmacyCrossCityPerformance: [
            {
                pharmacyId: 'medicare-cairo',
                pharmacyName: 'MediCare Pharmacy',
                crossCityOrders: 456,
                crossCityRevenue: 67890,
                averageDeliveryTime: 75,
                customerSatisfaction: 4.7,
            },
            {
                pharmacyId: 'healthplus-ismailia',
                pharmacyName: 'HealthPlus Pharmacy',
                crossCityOrders: 298,
                crossCityRevenue: 42340,
                averageDeliveryTime: 95,
                customerSatisfaction: 4.5,
            },
            {
                pharmacyId: 'alexandria-central',
                pharmacyName: 'Alexandria Central Pharmacy',
                crossCityOrders: 187,
                crossCityRevenue: 28950,
                averageDeliveryTime: 135,
                customerSatisfaction: 4.3,
            },
            {
                pharmacyId: 'giza-modern',
                pharmacyName: 'Giza Modern Pharmacy',
                crossCityOrders: 306,
                crossCityRevenue: 17600,
                averageDeliveryTime: 52,
                customerSatisfaction: 4.8,
            },
        ],
        cityCrossCityStats: [
            {
                cityId: 'cairo-city',
                cityName: 'Cairo City',
                ordersReceived: 567,
                ordersSent: 234,
                netOrderFlow: 333,
            },
            {
                cityId: 'giza-city',
                cityName: 'Giza City',
                ordersReceived: 342,
                ordersSent: 306,
                netOrderFlow: 36,
            },
            {
                cityId: 'ismailia-city',
                cityName: 'Ismailia City',
                ordersReceived: 89,
                ordersSent: 298,
                netOrderFlow: -209,
            },
            {
                cityId: 'alexandria-city',
                cityName: 'Alexandria City',
                ordersReceived: 156,
                ordersSent: 187,
                netOrderFlow: -31,
            },
        ],
    };

    // Global cross-city settings management
    getGlobalCrossCitySettings(): CrossCityOrderingSettings {
        return { ...this.globalSettings };
    }

    updateGlobalCrossCitySettings(settings: Partial<CrossCityOrderingSettings>): boolean {
        this.globalSettings = {
            ...this.globalSettings,
            ...settings,
            lastUpdated: new Date().toISOString(),
        };
        return true;
    }

    toggleGlobalCrossCityOrdering(enabled: boolean): boolean {
        this.globalSettings.globalCrossCityEnabled = enabled;
        this.globalSettings.lastUpdated = new Date().toISOString();
        return true;
    }

    // Pharmacy-specific cross-city settings
    getPharmacyCrossCitySettings(pharmacyId: string): PharmacyCrossCitySettings | undefined {
        return this.pharmacySettings.find((p) => p.pharmacyId === pharmacyId);
    }

    updatePharmacyCrossCitySettings(
        pharmacyId: string,
        settings: Partial<PharmacyCrossCitySettings>,
    ): boolean {
        const index = this.pharmacySettings.findIndex((p) => p.pharmacyId === pharmacyId);
        if (index !== -1) {
            this.pharmacySettings[index] = {
                ...this.pharmacySettings[index],
                ...settings,
                lastUpdated: new Date().toISOString(),
            };
            return true;
        }
        return false;
    }

    togglePharmacyCrossCityOrdering(pharmacyId: string, enabled: boolean): boolean {
        const index = this.pharmacySettings.findIndex((p) => p.pharmacyId === pharmacyId);
        if (index !== -1) {
            this.pharmacySettings[index].allowsCrossCityOrders = enabled;
            this.pharmacySettings[index].lastUpdated = new Date().toISOString();
            return true;
        }
        return false;
    }

    getAllPharmacyCrossCitySettings(): PharmacyCrossCitySettings[] {
        return [...this.pharmacySettings];
    }

    // Delivery zone management
    getDeliveryZones(pharmacyId?: string): DeliveryZone[] {
        if (pharmacyId) {
            const pharmacySettings = this.getPharmacyCrossCitySettings(pharmacyId);
            return pharmacySettings?.deliveryZones || [];
        }

        // Return all delivery zones from all pharmacies
        return this.pharmacySettings.flatMap((p) => p.deliveryZones);
    }

    addDeliveryZone(pharmacyId: string, zone: Omit<DeliveryZone, 'id'>): boolean {
        const index = this.pharmacySettings.findIndex((p) => p.pharmacyId === pharmacyId);
        if (index !== -1) {
            const newZone: DeliveryZone = {
                ...zone,
                id: `zone-${Date.now()}`,
            };
            this.pharmacySettings[index].deliveryZones.push(newZone);
            this.pharmacySettings[index].lastUpdated = new Date().toISOString();
            return true;
        }
        return false;
    }

    updateDeliveryZone(
        pharmacyId: string,
        zoneId: string,
        updates: Partial<DeliveryZone>,
    ): boolean {
        const pharmacyIndex = this.pharmacySettings.findIndex((p) => p.pharmacyId === pharmacyId);
        if (pharmacyIndex !== -1) {
            const zoneIndex = this.pharmacySettings[pharmacyIndex].deliveryZones.findIndex(
                (z) => z.id === zoneId,
            );
            if (zoneIndex !== -1) {
                this.pharmacySettings[pharmacyIndex].deliveryZones[zoneIndex] = {
                    ...this.pharmacySettings[pharmacyIndex].deliveryZones[zoneIndex],
                    ...updates,
                };
                this.pharmacySettings[pharmacyIndex].lastUpdated = new Date().toISOString();
                return true;
            }
        }
        return false;
    }

    deleteDeliveryZone(pharmacyId: string, zoneId: string): boolean {
        const pharmacyIndex = this.pharmacySettings.findIndex((p) => p.pharmacyId === pharmacyId);
        if (pharmacyIndex !== -1) {
            this.pharmacySettings[pharmacyIndex].deliveryZones = this.pharmacySettings[
                pharmacyIndex
            ].deliveryZones.filter((z) => z.id !== zoneId);
            this.pharmacySettings[pharmacyIndex].lastUpdated = new Date().toISOString();
            return true;
        }
        return false;
    }

    // Cross-city order validation and calculation
    canDeliverCrossCity(
        pharmacyId: string,
        fromCityId: string,
        toCityId: string,
        orderType: string = 'regular',
    ): boolean {
        if (!this.globalSettings.globalCrossCityEnabled) return false;

        const pharmacySettings = this.getPharmacyCrossCitySettings(pharmacyId);
        if (!pharmacySettings || !pharmacySettings.allowsCrossCityOrders) return false;

        // Check if pharmacy serves the target city
        if (!pharmacySettings.workingCities.includes(toCityId)) return false;

        // Check delivery zones
        const applicableZone = pharmacySettings.deliveryZones.find(
            (zone) => zone.isActive && zone.cityIds.includes(toCityId),
        );

        if (!applicableZone) return false;

        // Check order type restrictions
        if (applicableZone.restrictions.prescriptionOnly && orderType !== 'prescription') {
            return false;
        }

        if (applicableZone.restrictions.emergencyOnly && orderType !== 'emergency') {
            return false;
        }

        return true;
    }

    calculateCrossCityDeliveryFee(
        pharmacyId: string,
        fromCityId: string,
        toCityId: string,
        orderAmount: number,
    ): number {
        const pharmacySettings = this.getPharmacyCrossCitySettings(pharmacyId);
        if (!pharmacySettings) return 0;

        const applicableZone = pharmacySettings.deliveryZones.find(
            (zone) => zone.isActive && zone.cityIds.includes(toCityId),
        );

        if (applicableZone) {
            return applicableZone.deliveryFee;
        }

        return pharmacySettings.crossCityDeliveryFee;
    }

    getEstimatedCrossCityDeliveryTime(
        pharmacyId: string,
        fromCityId: string,
        toCityId: string,
    ): string {
        const pharmacySettings = this.getPharmacyCrossCitySettings(pharmacyId);
        if (!pharmacySettings) return this.globalSettings.estimatedCrossCityDeliveryTime;

        return (
            pharmacySettings.estimatedDeliveryTimes[toCityId] ||
            this.globalSettings.estimatedCrossCityDeliveryTime
        );
    }

    getMinimumCrossCityOrderAmount(
        pharmacyId: string,
        fromCityId: string,
        toCityId: string,
    ): number {
        const pharmacySettings = this.getPharmacyCrossCitySettings(pharmacyId);
        if (!pharmacySettings) return this.globalSettings.minimumCrossCityOrderAmount;

        const applicableZone = pharmacySettings.deliveryZones.find(
            (zone) => zone.isActive && zone.cityIds.includes(toCityId),
        );

        if (applicableZone) {
            return applicableZone.minOrderAmount;
        }

        return pharmacySettings.crossCityMinOrderAmount;
    }

    // Cross-city order processing
    validateCrossCityOrder(orderRequest: CrossCityOrderRequest): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check global settings
        if (!this.globalSettings.globalCrossCityEnabled) {
            errors.push('Cross-city ordering is currently disabled');
        }

        // Check pharmacy settings
        const pharmacySettings = this.getPharmacyCrossCitySettings(orderRequest.pharmacyId);
        if (!pharmacySettings || !pharmacySettings.allowsCrossCityOrders) {
            errors.push('This pharmacy does not accept cross-city orders');
        }

        // Check delivery capability
        if (
            !this.canDeliverCrossCity(
                orderRequest.pharmacyId,
                orderRequest.pharmacyCityId,
                orderRequest.customerCityId,
                orderRequest.orderType,
            )
        ) {
            errors.push('Delivery not available to your city');
        }

        // Check minimum order amount
        const minAmount = this.getMinimumCrossCityOrderAmount(
            orderRequest.pharmacyId,
            orderRequest.pharmacyCityId,
            orderRequest.customerCityId,
        );

        if (orderRequest.totalAmount < minAmount) {
            errors.push(`Minimum order amount for cross-city delivery is EGP ${minAmount}`);
        }

        // Check time restrictions
        if (pharmacySettings) {
            const applicableZone = pharmacySettings.deliveryZones.find(
                (zone) => zone.isActive && zone.cityIds.includes(orderRequest.customerCityId),
            );

            if (applicableZone && applicableZone.restrictions.timeRestrictions) {
                const now = new Date();
                const currentTime = now.getHours() * 100 + now.getMinutes();
                const startTime = parseInt(
                    applicableZone.restrictions.timeRestrictions.startTime.replace(':', ''),
                );
                const endTime = parseInt(
                    applicableZone.restrictions.timeRestrictions.endTime.replace(':', ''),
                );

                if (currentTime < startTime || currentTime > endTime) {
                    warnings.push(
                        `Cross-city delivery is only available between ${applicableZone.restrictions.timeRestrictions.startTime} and ${applicableZone.restrictions.timeRestrictions.endTime}`,
                    );
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    // Analytics and reporting
    getCrossCityAnalytics(): CrossCityOrderAnalytics {
        return { ...this.mockAnalytics };
    }

    getCrossCityOrdersByRoute(fromCityId: string, toCityId: string): any[] {
        // Mock data for cross-city orders by route
        return [
            {
                id: 'order-001',
                customerId: 'customer-001',
                pharmacyId: 'medicare-cairo',
                fromCity: fromCityId,
                toCity: toCityId,
                orderAmount: 125.5,
                deliveryFee: 25,
                status: 'delivered',
                orderDate: '2024-01-20T10:30:00Z',
                deliveryTime: 75, // minutes
            },
            // Add more mock orders...
        ];
    }

    // Helper functions for customer interface
    getAvailableCrossCityPharmacies(customerCityId: string): {
        pharmacy: Pharmacy;
        deliveryFee: number;
        estimatedTime: string;
        minOrderAmount: number;
    }[] {
        const availablePharmacies: any[] = [];

        this.pharmacySettings.forEach((pharmacySettings) => {
            if (
                pharmacySettings.allowsCrossCityOrders &&
                pharmacySettings.workingCities.includes(customerCityId)
            ) {
                const deliveryFee = this.calculateCrossCityDeliveryFee(
                    pharmacySettings.pharmacyId,
                    '', // We don't have pharmacy city here, but it's calculated in the zone
                    customerCityId,
                    0,
                );

                const estimatedTime = this.getEstimatedCrossCityDeliveryTime(
                    pharmacySettings.pharmacyId,
                    '',
                    customerCityId,
                );

                const minOrderAmount = this.getMinimumCrossCityOrderAmount(
                    pharmacySettings.pharmacyId,
                    '',
                    customerCityId,
                );

                availablePharmacies.push({
                    pharmacyId: pharmacySettings.pharmacyId,
                    deliveryFee,
                    estimatedTime,
                    minOrderAmount,
                });
            }
        });

        return availablePharmacies;
    }

    // City coverage analysis
    getCityCoverageMap(): { [cityId: string]: string[] } {
        const coverageMap: { [cityId: string]: string[] } = {};

        this.pharmacySettings.forEach((pharmacySettings) => {
            if (pharmacySettings.allowsCrossCityOrders) {
                pharmacySettings.workingCities.forEach((cityId) => {
                    if (!coverageMap[cityId]) {
                        coverageMap[cityId] = [];
                    }
                    coverageMap[cityId].push(pharmacySettings.pharmacyId);
                });
            }
        });

        return coverageMap;
    }
}

export const crossCityOrderingService = new CrossCityOrderingService();
