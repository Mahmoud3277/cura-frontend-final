// // Pharmacy Availability Service for Medicine Selection System
// // Task 3.2: Create Pharmacy Availability System

// import {
//     PharmacyStock,
//     MedicinePharmacyMapping,
//     ExtendedMedicine,
//     MedicineDataManager,
//     extendedMedicineData,
// } from '../data/medicineData';
// import { Pharmacy, getPharmacyById, getPharmaciesByCity } from '../data/pharmacies';

// export type StockLevel = 'high' | 'medium' | 'low' | 'critical' | 'out';
// export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

// export interface PharmacyAvailabilityInfo {
//     pharmacyId: string;
//     pharmacyName: string;
//     pharmacy: Pharmacy;
//     stockInfo: PharmacyStock;
//     isAvailable: boolean;
//     stockStatus: StockStatus;
//     estimatedRestockDate?: Date;
//     alternativeAvailable: boolean;
//     deliveryInfo: {
//         deliveryTime: string;
//         deliveryFee: number;
//         minOrderAmount: number;
//     };
//     packagingPrices: {
//         blister: number;
//         box: number;
//     };
// }

// export interface MedicineAvailabilityReport {
//     medicineId: string;
//     medicineName: string;
//     totalPharmacies: number;
//     availablePharmacies: number;
//     availabilityPercentage: number;
//     lowestPrice: number;
//     highestPrice: number;
//     averagePrice: number;
//     pharmacyAvailability: PharmacyAvailabilityInfo[];
//     recommendedPharmacies: PharmacyAvailabilityInfo[];
//     outOfStockPharmacies: PharmacyAvailabilityInfo[];
//     lastUpdated: Date;
// }

// export interface RestockSimulation {
//     medicineId: string;
//     pharmacyId: string;
//     currentStock: number;
//     newStock: number;
//     restockDate: Date;
//     restockQuantity: number;
//     supplier: string;
//     estimatedDeliveryDays: number;
// }

// export class PharmacyAvailabilityService {
//     private static instance: PharmacyAvailabilityService;
//     private restockSimulations: Map<string, RestockSimulation[]> = new Map();

//     static getInstance(): PharmacyAvailabilityService {
//         if (!PharmacyAvailabilityService.instance) {
//             PharmacyAvailabilityService.instance = new PharmacyAvailabilityService();
//         }
//         return PharmacyAvailabilityService.instance;
//     }

//     /**
//      * Get comprehensive availability report for a medicine
//      */
//     getMedicineAvailabilityReport(
//         medicineId: string,
//         cityId?: string,
//     ): MedicineAvailabilityReport | null {
//         const medicine = MedicineDataManager.getMedicineById(medicineId);
//         if (!medicine) return null;

//         const pharmacyStocks = medicine.pharmacyMapping.pharmacyStocks;
//         let filteredStocks = pharmacyStocks;

//         // Filter by city if specified
//         if (cityId) {
//             filteredStocks = pharmacyStocks.filter((stock) => {
//                 const pharmacy = getPharmacyById(stock.pharmacyId);
//                 return pharmacy?.cityId === cityId;
//             });
//         }

//         const pharmacyAvailability: PharmacyAvailabilityInfo[] = filteredStocks.map((stock) => {
//             const pharmacy = getPharmacyById(stock.pharmacyId);
//             if (!pharmacy) {
//                 throw new Error(`Pharmacy not found: ${stock.pharmacyId}`);
//             }

//             return {
//                 pharmacyId: stock.pharmacyId,
//                 pharmacyName: pharmacy.nameAr, // Always use Arabic name regardless of locale
//                 pharmacy,
//                 stockInfo: stock,
//                 isAvailable: stock.inStock && stock.stockQuantity > 0,
//                 stockStatus: this.getStockStatus(stock),
//                 estimatedRestockDate: this.getEstimatedRestockDate(medicineId, stock.pharmacyId),
//                 alternativeAvailable: this.hasAlternativesAvailable(medicineId, stock.pharmacyId),
//                 deliveryInfo: {
//                     deliveryTime: pharmacy.deliveryTime,
//                     deliveryFee: pharmacy.deliveryFee,
//                     minOrderAmount: pharmacy.minOrderAmount,
//                 },
//                 packagingPrices: this.getPharmacyPackagingPrices(medicineId, stock.pharmacyId),
//             };
//         });

//         const availablePharmacies = pharmacyAvailability.filter((p) => p.isAvailable);
//         const outOfStockPharmacies = pharmacyAvailability.filter((p) => !p.isAvailable);
//         const recommendedPharmacies = this.getRecommendedPharmacies(availablePharmacies);

//         return {
//             medicineId,
//             medicineName: medicine.name,
//             totalPharmacies: pharmacyAvailability.length,
//             availablePharmacies: availablePharmacies.length,
//             availabilityPercentage:
//                 (availablePharmacies.length / pharmacyAvailability.length) * 100,
//             lowestPrice: medicine.pharmacyMapping.lowestPrice,
//             highestPrice: medicine.pharmacyMapping.highestPrice,
//             averagePrice: medicine.pharmacyMapping.averagePrice,
//             pharmacyAvailability,
//             recommendedPharmacies,
//             outOfStockPharmacies,
//             lastUpdated: new Date(),
//         };
//     }

//     /**
//      * Get available pharmacies for a medicine in a specific city
//      */
//     getAvailablePharmacies(medicineId: string, cityId?: string): PharmacyAvailabilityInfo[] {
//         const report = this.getMedicineAvailabilityReport(medicineId, cityId);
//         return report?.recommendedPharmacies || [];
//     }

//     /**
//      * Filter pharmacies based on availability
//      */
//     filterPharmaciesByAvailability(
//         medicineId: string,
//         pharmacyIds: string[],
//         includeOutOfStock: boolean = false,
//     ): PharmacyAvailabilityInfo[] {
//         const medicine = MedicineDataManager.getMedicineById(medicineId);
//         if (!medicine) return [];

//         const filteredStocks = medicine.pharmacyMapping.pharmacyStocks.filter((stock) =>
//             pharmacyIds.includes(stock.pharmacyId),
//         );

//         const pharmacyAvailability: PharmacyAvailabilityInfo[] = filteredStocks
//             .map((stock) => {
//                 const pharmacy = getPharmacyById(stock.pharmacyId);
//                 if (!pharmacy) return null;

//                 return {
//                     pharmacyId: stock.pharmacyId,
//                     pharmacyName: pharmacy.nameAr, // Always use Arabic name regardless of locale
//                     pharmacy,
//                     stockInfo: stock,
//                     isAvailable: stock.inStock && stock.stockQuantity > 0,
//                     stockStatus: this.getStockStatus(stock),
//                     estimatedRestockDate: this.getEstimatedRestockDate(
//                         medicineId,
//                         stock.pharmacyId,
//                     ),
//                     alternativeAvailable: this.hasAlternativesAvailable(
//                         medicineId,
//                         stock.pharmacyId,
//                     ),
//                     deliveryInfo: {
//                         deliveryTime: pharmacy.deliveryTime,
//                         deliveryFee: pharmacy.deliveryFee,
//                         minOrderAmount: pharmacy.minOrderAmount,
//                     },
//                     packagingPrices: this.getPharmacyPackagingPrices(medicineId, stock.pharmacyId),
//                 };
//             })
//             .filter((item): item is PharmacyAvailabilityInfo => item !== null);

//         if (includeOutOfStock) {
//             return pharmacyAvailability;
//         }

//         return pharmacyAvailability.filter((p) => p.isAvailable);
//     }

//     /**
//      * Get stock status based on stock level
//      */
//     private getStockStatus(stock: PharmacyStock): StockStatus {
//         if (!stock.inStock || stock.stockQuantity === 0) {
//             return 'out-of-stock';
//         }

//         if (stock.stockLevel === 'critical' || stock.stockLevel === 'low') {
//             return 'low-stock';
//         }

//         return 'in-stock';
//     }

//     /**
//      * Get recommended pharmacies (sorted by availability, price, and rating)
//      */
//     private getRecommendedPharmacies(
//         availablePharmacies: PharmacyAvailabilityInfo[],
//     ): PharmacyAvailabilityInfo[] {
//         return availablePharmacies.sort((a, b) => {
//             // First priority: Stock level (higher is better)
//             const stockPriority =
//                 this.getStockPriority(a.stockInfo.stockLevel) -
//                 this.getStockPriority(b.stockInfo.stockLevel);
//             if (stockPriority !== 0) return stockPriority;

//             // Second priority: Price (lower is better)
//             const priceDiff = a.stockInfo.price - b.stockInfo.price;
//             if (Math.abs(priceDiff) > 1) return priceDiff;

//             // Third priority: Pharmacy rating (higher is better)
//             return b.pharmacy.rating - a.pharmacy.rating;
//         });
//     }

//     /**
//      * Get stock priority for sorting (higher number = better stock)
//      */
//     private getStockPriority(stockLevel: StockLevel): number {
//         const priorities = {
//             high: 5,
//             medium: 4,
//             low: 3,
//             critical: 2,
//             out: 1,
//         };
//         return priorities[stockLevel] || 1;
//     }

//     /**
//      * Get pharmacy-specific packaging prices for a medicine
//      */
//     private getPharmacyPackagingPrices(
//         medicineId: string,
//         pharmacyId: string,
//     ): { blister: number; box: number } {
//         // Get packaging prices from mock data if available
//         const mockData = mockPharmacyAvailability[medicineId];
//         if (mockData) {
//             const pharmacyData = mockData.find((p) => p.pharmacyId === pharmacyId);
//             if (pharmacyData && pharmacyData.packagingPrices) {
//                 return pharmacyData.packagingPrices;
//             }
//         }

//         // Fallback to default pricing based on pharmacy
//         const basePrice = this.getBasePriceForMedicine(medicineId);
//         const pharmacyMultiplier = this.getPharmacyPriceMultiplier(pharmacyId);

//         return {
//             blister: Math.round(basePrice * 0.5 * pharmacyMultiplier * 100) / 100,
//             box: Math.round(basePrice * pharmacyMultiplier * 100) / 100,
//         };
//     }

//     /**
//      * Get base price for a medicine
//      */
//     private getBasePriceForMedicine(medicineId: string): number {
//         const basePrices: Record<string, number> = {
//             'med-001': 12.99,
//             'med-002': 45.99,
//             'med-003': 85.99,
//         };
//         return basePrices[medicineId] || 20.0;
//     }

//     /**
//      * Get price multiplier for a pharmacy
//      */
//     private getPharmacyPriceMultiplier(pharmacyId: string): number {
//         const multipliers: Record<string, number> = {
//             'pharmacy-001': 1.0, // City Pharmacy - standard pricing
//             'pharmacy-002': 0.89, // Health Plus - budget option
//             'pharmacy-003': 1.08, // MediCare Express - premium pricing
//             'pharmacy-004': 0.85, // Green Cross - cheapest option
//             'pharmacy-005': 0.96, // QuickMeds - competitive pricing
//             'pharmacy-006': 0.95, // Family Health - good value
//             'pharmacy-007': 1.03, // Wellness - slightly premium
//             'pharmacy-008': 0.92, // Express Care - competitive pricing
//             'pharmacy-009': 1.12, // Prime Health - premium 24/7 service
//             'pharmacy-010': 0.82, // Community Care - budget option
//         };
//         return multipliers[pharmacyId] || 1.0;
//     }

//     /**
//      * Check if alternatives are available at a pharmacy
//      */
//     private hasAlternativesAvailable(medicineId: string, pharmacyId: string): boolean {
//         const medicine = MedicineDataManager.getMedicineById(medicineId);
//         if (!medicine || !medicine.alternatives.length) return false;

//         // Check if any alternatives are available at this pharmacy
//         return medicine.alternatives.some((alternative) => {
//             const altMedicine = MedicineDataManager.getMedicineById(alternative.id);
//             if (!altMedicine) return false;

//             const altStock = altMedicine.pharmacyMapping.pharmacyStocks.find(
//                 (stock) => stock.pharmacyId === pharmacyId,
//             );
//             return altStock?.inStock && altStock.stockQuantity > 0;
//         });
//     }

//     /**
//      * Get estimated restock date for a medicine at a pharmacy
//      */
//     private getEstimatedRestockDate(medicineId: string, pharmacyId: string): Date | undefined {
//         const key = `${medicineId}-${pharmacyId}`;
//         const simulations = this.restockSimulations.get(key);

//         if (simulations && simulations.length > 0) {
//             // Return the earliest restock date
//             return simulations.reduce(
//                 (earliest, sim) => (sim.restockDate < earliest ? sim.restockDate : earliest),
//                 simulations[0].restockDate,
//             );
//         }

//         // If no simulation exists, estimate based on stock level
//         const medicine = MedicineDataManager.getMedicineById(medicineId);
//         const stock = medicine?.pharmacyMapping.pharmacyStocks.find(
//             (s) => s.pharmacyId === pharmacyId,
//         );

//         if (stock && (!stock.inStock || stock.stockQuantity <= stock.reorderLevel)) {
//             // Estimate 3-7 days for restock
//             const estimatedDays = Math.floor(Math.random() * 5) + 3;
//             const restockDate = new Date();
//             restockDate.setDate(restockDate.getDate() + estimatedDays);
//             return restockDate;
//         }

//         return undefined;
//     }

//     /**
//      * Simulate restock for demo purposes
//      */
//     simulateRestock(
//         medicineId: string,
//         pharmacyId: string,
//         restockQuantity?: number,
//     ): RestockSimulation {
//         const medicine = MedicineDataManager.getMedicineById(medicineId);
//         const stock = medicine?.pharmacyMapping.pharmacyStocks.find(
//             (s) => s.pharmacyId === pharmacyId,
//         );

//         if (!medicine || !stock) {
//             throw new Error('Medicine or pharmacy stock not found');
//         }

//         const currentStock = stock.stockQuantity;
//         const newQuantity = restockQuantity || Math.floor(Math.random() * 200) + 100;
//         const estimatedDays = Math.floor(Math.random() * 5) + 2; // 2-7 days
//         const restockDate = new Date();
//         restockDate.setDate(restockDate.getDate() + estimatedDays);

//         const simulation: RestockSimulation = {
//             medicineId,
//             pharmacyId,
//             currentStock,
//             newStock: currentStock + newQuantity,
//             restockDate,
//             restockQuantity: newQuantity,
//             supplier: stock.supplier || 'Default Supplier',
//             estimatedDeliveryDays: estimatedDays,
//         };

//         // Store simulation
//         const key = `${medicineId}-${pharmacyId}`;
//         const existingSimulations = this.restockSimulations.get(key) || [];
//         existingSimulations.push(simulation);
//         this.restockSimulations.set(key, existingSimulations);

//         return simulation;
//     }

//     /**
//      * Execute restock simulation (update actual stock)
//      */
//     executeRestockSimulation(medicineId: string, pharmacyId: string): boolean {
//         const key = `${medicineId}-${pharmacyId}`;
//         const simulations = this.restockSimulations.get(key);

//         if (!simulations || simulations.length === 0) {
//             return false;
//         }

//         const simulation = simulations[0]; // Execute the first simulation
//         const success = MedicineDataManager.updateStock(
//             medicineId,
//             pharmacyId,
//             simulation.newStock,
//         );

//         if (success) {
//             // Remove executed simulation
//             simulations.shift();
//             if (simulations.length === 0) {
//                 this.restockSimulations.delete(key);
//             } else {
//                 this.restockSimulations.set(key, simulations);
//             }
//         }

//         return success;
//     }

//     /**
//      * Get all pending restock simulations
//      */
//     getPendingRestockSimulations(): RestockSimulation[] {
//         const allSimulations: RestockSimulation[] = [];
//         this.restockSimulations.forEach((simulations) => {
//             allSimulations.push(...simulations);
//         });
//         return allSimulations.sort((a, b) => a.restockDate.getTime() - b.restockDate.getTime());
//     }

//     /**
//      * Auto-execute restock simulations that are due
//      */
//     autoExecuteRestockSimulations(): RestockSimulation[] {
//         const now = new Date();
//         const executedSimulations: RestockSimulation[] = [];

//         this.restockSimulations.forEach((simulations, key) => {
//             const dueSimulations = simulations.filter((sim) => sim.restockDate <= now);

//             dueSimulations.forEach((simulation) => {
//                 const success = this.executeRestockSimulation(
//                     simulation.medicineId,
//                     simulation.pharmacyId,
//                 );
//                 if (success) {
//                     executedSimulations.push(simulation);
//                 }
//             });
//         });

//         return executedSimulations;
//     }

//     /**
//      * Get stock alerts for low inventory
//      */
//     getStockAlerts(cityId?: string): Array<{
//         medicine: ExtendedMedicine;
//         pharmacy: Pharmacy;
//         stock: PharmacyStock;
//         alertLevel: 'critical' | 'low';
//     }> {
//         const alerts: Array<{
//             medicine: ExtendedMedicine;
//             pharmacy: Pharmacy;
//             stock: PharmacyStock;
//             alertLevel: 'critical' | 'low';
//         }> = [];

//         extendedMedicineData.forEach((medicine) => {
//             medicine.pharmacyMapping.pharmacyStocks.forEach((stock) => {
//                 const pharmacy = getPharmacyById(stock.pharmacyId);
//                 if (!pharmacy) return;

//                 // Filter by city if specified
//                 if (cityId && pharmacy.cityId !== cityId) return;

//                 if (stock.stockLevel === 'critical' || stock.stockLevel === 'low') {
//                     alerts.push({
//                         medicine,
//                         pharmacy,
//                         stock,
//                         alertLevel: stock.stockLevel === 'critical' ? 'critical' : 'low',
//                     });
//                 }
//             });
//         });

//         return alerts.sort((a, b) => {
//             // Critical alerts first
//             if (a.alertLevel === 'critical' && b.alertLevel === 'low') return -1;
//             if (a.alertLevel === 'low' && b.alertLevel === 'critical') return 1;

//             // Then by stock quantity (lowest first)
//             return a.stock.stockQuantity - b.stock.stockQuantity;
//         });
//     }

//     /**
//      * Get medicines with best availability in a city
//      */
//     getBestAvailabilityMedicines(cityId: string, limit: number = 10): MedicineAvailabilityReport[] {
//         const reports = extendedMedicineData
//             .map((medicine) => this.getMedicineAvailabilityReport(medicine.id, cityId))
//             .filter((report): report is MedicineAvailabilityReport => report !== null)
//             .sort((a, b) => {
//                 // Sort by availability percentage (higher is better)
//                 const availabilityDiff = b.availabilityPercentage - a.availabilityPercentage;
//                 if (availabilityDiff !== 0) return availabilityDiff;

//                 // Then by number of available pharmacies
//                 return b.availablePharmacies - a.availablePharmacies;
//             });

//         return reports.slice(0, limit);
//     }

//     /**
//      * Get pharmacy performance metrics
//      */
//     getPharmacyPerformanceMetrics(pharmacyId: string): {
//         totalMedicines: number;
//         inStockMedicines: number;
//         lowStockMedicines: number;
//         outOfStockMedicines: number;
//         stockPercentage: number;
//         averageStockLevel: number;
//         needsRestockCount: number;
//     } {
//         let totalMedicines = 0;
//         let inStockMedicines = 0;
//         let lowStockMedicines = 0;
//         let outOfStockMedicines = 0;
//         let totalStockLevel = 0;
//         let needsRestockCount = 0;

//         extendedMedicineData.forEach((medicine) => {
//             const stock = medicine.pharmacyMapping.pharmacyStocks.find(
//                 (s) => s.pharmacyId === pharmacyId,
//             );
//             if (stock) {
//                 totalMedicines++;

//                 if (stock.inStock && stock.stockQuantity > 0) {
//                     inStockMedicines++;
//                 } else {
//                     outOfStockMedicines++;
//                 }

//                 if (stock.stockLevel === 'low' || stock.stockLevel === 'critical') {
//                     lowStockMedicines++;
//                 }

//                 if (stock.stockQuantity <= stock.reorderLevel) {
//                     needsRestockCount++;
//                 }

//                 // Convert stock level to numeric value for average calculation
//                 const stockLevelValue = this.getStockPriority(stock.stockLevel);
//                 totalStockLevel += stockLevelValue;
//             }
//         });

//         return {
//             totalMedicines,
//             inStockMedicines,
//             lowStockMedicines,
//             outOfStockMedicines,
//             stockPercentage: totalMedicines > 0 ? (inStockMedicines / totalMedicines) * 100 : 0,
//             averageStockLevel: totalMedicines > 0 ? totalStockLevel / totalMedicines : 0,
//             needsRestockCount,
//         };
//     }

//     /**
//      * Initialize demo restock simulations
//      */
//     initializeDemoRestockSimulations(): void {
//         // Create some demo restock simulations for out-of-stock items
//         extendedMedicineData.forEach((medicine) => {
//             medicine.pharmacyMapping.pharmacyStocks.forEach((stock) => {
//                 if (!stock.inStock || stock.stockLevel === 'critical') {
//                     // 70% chance to create a restock simulation
//                     if (Math.random() < 0.7) {
//                         this.simulateRestock(medicine.id, stock.pharmacyId);
//                     }
//                 }
//             });
//         });
//     }
// }

// // Mock pharmacy availability data
// const mockPharmacyAvailability: Record<string, PharmacyAvailabilityInfo[]> = {
//     'med-001': [
//         {
//             pharmacyId: 'healthplus-ismailia',
//             pharmacyName: 'صيدلية هيلث بلس',
//             address: '23 El Tahrir Street, Ismailia',
//             distance: 2.5,
//             deliveryTime: '30-45 mins',
//             deliveryFee: 15.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 100,
//                 price: 12.99,
//                 expiryDate: '2025-12-31',
//             },
//             packagingPrices: {
//                 blister: 6.5,
//                 box: 12.99,
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '8:00 AM - 10:00 PM',
//         },
//         {
//             pharmacyId: 'wellcare-ismailia',
//             pharmacyName: 'صيدلية ويل كير',
//             address: '45 Ahmed Orabi Street, Ismailia',
//             distance: 3.2,
//             deliveryTime: '25-40 mins',
//             deliveryFee: 12.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 25,
//                 price: 11.49,
//                 expiryDate: '2025-11-30',
//             },
//             packagingPrices: {
//                 blister: 5.99,
//                 box: 11.49,
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '9:00 AM - 11:00 PM',
//         },
//         {
//             pharmacyId: 'family-care-ismailia',
//             pharmacyName: 'صيدلية العائلة للرعاية',
//             address: '12 El Gomhoria Street, Ismailia',
//             distance: 1.8,
//             deliveryTime: '35-50 mins',
//             deliveryFee: 18.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 75,
//                 price: 13.99,
//                 expiryDate: '2026-01-15',
//             },
//             packagingPrices: {
//                 blister: 7.25,
//                 box: 13.99,
//             },
//             rating: 4.7,
//             isOpen: true,
//             openingHours: '7:00 AM - 12:00 AM',
//         },
//         {
//             pharmacyId: 'little-ones-ismailia',
//             pharmacyName: 'Little Ones Pharmacy',
//             address: '67 El Salam Street, Ismailia',
//             distance: 4.1,
//             deliveryTime: '20-35 mins',
//             deliveryFee: 10.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 12,
//                 price: 10.99,
//                 expiryDate: '2025-09-30',
//             },
//             packagingPrices: {
//                 blister: 5.75,
//                 box: 10.99,
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '8:00 AM - 8:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-005',
//             pharmacyName: 'QuickMeds Pharmacy',
//             address: '654 Maple Ave, Eastside',
//             distance: 2.9,
//             deliveryTime: '35-50 mins',
//             deliveryFee: 4.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 40,
//                 price: 12.49,
//                 expiryDate: '2025-12-15',
//             },
//             packagingPrices: {
//                 blister: 6.25,
//                 box: 12.49,
//             },
//             rating: 4.7,
//             isOpen: false,
//             openingHours: '8:00 AM - 8:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-006',
//             pharmacyName: 'Family Health Pharmacy',
//             address: '987 Cedar Blvd, Southside',
//             distance: 3.7,
//             deliveryTime: '40-55 mins',
//             deliveryFee: 3.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 35,
//                 price: 12.99,
//                 expiryDate: '2025-12-31',
//             },
//             packagingPrices: {
//                 blister: 6.5,
//                 box: 12.99,
//             },
//             rating: 4.5,
//             isOpen: true,
//             openingHours: '8:30 AM - 9:30 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-007',
//             pharmacyName: 'Wellness Pharmacy',
//             address: '159 Birch St, Central',
//             distance: 2.1,
//             deliveryTime: '25-40 mins',
//             deliveryFee: 4.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 28,
//                 price: 13.49,
//                 expiryDate: '2025-11-30',
//             },
//             packagingPrices: {
//                 blister: 6.75,
//                 box: 13.49,
//             },
//             rating: 4.3,
//             isOpen: true,
//             openingHours: '9:00 AM - 8:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-008',
//             pharmacyName: 'Express Care Pharmacy',
//             address: '741 Oak Ridge Dr, Northside',
//             distance: 3.8,
//             deliveryTime: '45-65 mins',
//             deliveryFee: 2.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 60,
//                 price: 11.99,
//                 expiryDate: '2026-01-31',
//             },
//             packagingPrices: {
//                 blister: 6.0,
//                 box: 11.99,
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '7:00 AM - 11:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-009',
//             pharmacyName: 'Prime Health Pharmacy',
//             address: '852 Valley View Rd, Downtown',
//             distance: 1.5,
//             deliveryTime: '15-30 mins',
//             deliveryFee: 5.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 45,
//                 price: 14.49,
//                 expiryDate: '2026-02-28',
//             },
//             packagingPrices: {
//                 blister: 7.25,
//                 box: 14.49,
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '24/7',
//         },
//     ],
//     'med-002': [
//         {
//             pharmacyId: 'pharmacy-001',
//             pharmacyName: 'City Pharmacy',
//             address: '123 Main St, Downtown',
//             distance: 2.5,
//             deliveryTime: '30-45 mins',
//             deliveryFee: 5.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 30,
//                 price: 45.99,
//                 expiryDate: '2025-10-15',
//             },
//             packagingPrices: {
//                 blister: 16.0,
//                 box: 45.99,
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '8:00 AM - 10:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-002',
//             pharmacyName: 'Health Plus Pharmacy',
//             address: '456 Oak Ave, Midtown',
//             distance: 3.2,
//             deliveryTime: '45-60 mins',
//             deliveryFee: 3.5,
//             stockInfo: {
//                 availability: 'low-stock',
//                 quantity: 8,
//                 price: 42.49,
//                 expiryDate: '2025-11-30',
//             },
//             packagingPrices: {
//                 blister: 14.99,
//                 box: 42.49,
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '9:00 AM - 9:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-003',
//             pharmacyName: 'MediCare Express',
//             address: '789 Pine St, Uptown',
//             distance: 1.8,
//             deliveryTime: '20-35 mins',
//             deliveryFee: 6.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 45,
//                 price: 47.99,
//                 expiryDate: '2026-01-15',
//             },
//             packagingPrices: {
//                 blister: 17.25,
//                 box: 47.99,
//             },
//             rating: 4.9,
//             isOpen: true,
//             openingHours: '24/7',
//         },
//         {
//             pharmacyId: 'pharmacy-006',
//             pharmacyName: 'Family Health Pharmacy',
//             address: '987 Cedar Blvd, Southside',
//             distance: 3.7,
//             deliveryTime: '40-55 mins',
//             deliveryFee: 3.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 20,
//                 price: 43.99,
//                 expiryDate: '2025-12-31',
//             },
//             packagingPrices: {
//                 blister: 15.5,
//                 box: 43.99,
//             },
//             rating: 4.5,
//             isOpen: true,
//             openingHours: '8:30 AM - 9:30 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-007',
//             pharmacyName: 'Wellness Pharmacy',
//             address: '159 Birch St, Central',
//             distance: 2.1,
//             deliveryTime: '25-40 mins',
//             deliveryFee: 4.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 15,
//                 price: 46.99,
//                 expiryDate: '2025-10-31',
//             },
//             packagingPrices: {
//                 blister: 16.5,
//                 box: 46.99,
//             },
//             rating: 4.3,
//             isOpen: true,
//             openingHours: '9:00 AM - 8:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-008',
//             pharmacyName: 'Express Care Pharmacy',
//             address: '741 Oak Ridge Dr, Northside',
//             distance: 3.8,
//             deliveryTime: '45-65 mins',
//             deliveryFee: 2.5,
//             stockInfo: {
//                 availability: 'low-stock',
//                 quantity: 8,
//                 price: 41.99,
//                 expiryDate: '2025-09-30',
//             },
//             packagingPrices: {
//                 blister: 14.5,
//                 box: 41.99,
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '7:00 AM - 11:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-009',
//             pharmacyName: 'Prime Health Pharmacy',
//             address: '852 Valley View Rd, Downtown',
//             distance: 1.5,
//             deliveryTime: '15-30 mins',
//             deliveryFee: 5.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 35,
//                 price: 48.99,
//                 expiryDate: '2026-02-28',
//             },
//             packagingPrices: {
//                 blister: 17.25,
//                 box: 48.99,
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '24/7',
//         },
//     ],
//     'med-003': [
//         {
//             pharmacyId: 'pharmacy-001',
//             pharmacyName: 'City Pharmacy',
//             address: '123 Main St, Downtown',
//             distance: 2.5,
//             deliveryTime: '30-45 mins',
//             deliveryFee: 5.0,
//             stockInfo: {
//                 availability: 'out-of-stock',
//                 quantity: 0,
//                 price: 0,
//                 expiryDate: '',
//             },
//             packagingPrices: {
//                 blister: 0,
//                 box: 0,
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '8:00 AM - 10:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-003',
//             pharmacyName: 'MediCare Express',
//             address: '789 Pine St, Uptown',
//             distance: 1.8,
//             deliveryTime: '20-35 mins',
//             deliveryFee: 6.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 60,
//                 price: 85.99,
//                 expiryDate: '2026-02-28',
//             },
//             packagingPrices: {
//                 blister: 29.99,
//                 box: 85.99,
//             },
//             rating: 4.9,
//             isOpen: true,
//             openingHours: '24/7',
//         },
//         {
//             pharmacyId: 'pharmacy-004',
//             pharmacyName: 'Green Cross Pharmacy',
//             address: '321 Elm St, Westside',
//             distance: 4.1,
//             deliveryTime: '50-70 mins',
//             deliveryFee: 2.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 35,
//                 price: 82.49,
//                 expiryDate: '2025-11-30',
//             },
//             packagingPrices: {
//                 blister: 27.99,
//                 box: 82.49,
//             },
//             rating: 4.4,
//             isOpen: true,
//             openingHours: '7:00 AM - 11:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-007',
//             pharmacyName: 'Wellness Pharmacy',
//             address: '159 Birch St, Central',
//             distance: 2.1,
//             deliveryTime: '25-40 mins',
//             deliveryFee: 4.5,
//             stockInfo: {
//                 availability: 'low-stock',
//                 quantity: 5,
//                 price: 88.99,
//                 expiryDate: '2025-10-31',
//             },
//             packagingPrices: {
//                 blister: 31.5,
//                 box: 88.99,
//             },
//             rating: 4.3,
//             isOpen: true,
//             openingHours: '9:00 AM - 8:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-008',
//             pharmacyName: 'Express Care Pharmacy',
//             address: '741 Oak Ridge Dr, Northside',
//             distance: 3.8,
//             deliveryTime: '45-65 mins',
//             deliveryFee: 2.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 25,
//                 price: 84.99,
//                 expiryDate: '2026-01-31',
//             },
//             packagingPrices: {
//                 blister: 29.5,
//                 box: 84.99,
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '7:00 AM - 11:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-009',
//             pharmacyName: 'Prime Health Pharmacy',
//             address: '852 Valley View Rd, Downtown',
//             distance: 1.5,
//             deliveryTime: '15-30 mins',
//             deliveryFee: 5.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 40,
//                 price: 89.99,
//                 expiryDate: '2026-02-28',
//             },
//             packagingPrices: {
//                 blister: 31.99,
//                 box: 89.99,
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '24/7',
//         },
//         {
//             pharmacyId: 'pharmacy-010',
//             pharmacyName: 'Community Care Pharmacy',
//             address: '963 Sunset Blvd, Westside',
//             distance: 4.5,
//             deliveryTime: '55-75 mins',
//             deliveryFee: 2.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 50,
//                 price: 81.99,
//                 expiryDate: '2025-12-31',
//             },
//             packagingPrices: {
//                 blister: 28.5,
//                 box: 81.99,
//             },
//             rating: 4.4,
//             isOpen: true,
//             openingHours: '8:00 AM - 10:00 PM',
//         },
//     ],
//     // Add data for alternative medicines using their actual IDs
//     'med-001-alt-1': [
//         {
//             pharmacyId: 'pharmacy-002',
//             pharmacyName: 'Health Plus Pharmacy',
//             address: '456 Oak Ave, Midtown',
//             distance: 3.2,
//             deliveryTime: '45-60 mins',
//             deliveryFee: 3.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 40,
//                 price: 16.99,
//                 expiryDate: '2025-12-31',
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '9:00 AM - 9:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-003',
//             pharmacyName: 'MediCare Express',
//             address: '789 Pine St, Uptown',
//             distance: 1.8,
//             deliveryTime: '20-35 mins',
//             deliveryFee: 6.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 55,
//                 price: 17.49,
//                 expiryDate: '2026-01-15',
//             },
//             rating: 4.9,
//             isOpen: true,
//             openingHours: '24/7',
//         },
//         {
//             pharmacyId: 'pharmacy-004',
//             pharmacyName: 'Green Cross Pharmacy',
//             address: '321 Elm St, Westside',
//             distance: 4.1,
//             deliveryTime: '50-70 mins',
//             deliveryFee: 2.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 30,
//                 price: 15.99,
//                 expiryDate: '2025-11-30',
//             },
//             rating: 4.4,
//             isOpen: true,
//             openingHours: '7:00 AM - 11:00 PM',
//         },
//     ],
//     'med-001-alt-2': [
//         {
//             pharmacyId: 'pharmacy-001',
//             pharmacyName: 'City Pharmacy',
//             address: '123 Main St, Downtown',
//             distance: 2.5,
//             deliveryTime: '30-45 mins',
//             deliveryFee: 5.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 25,
//                 price: 11.99,
//                 expiryDate: '2025-12-31',
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '8:00 AM - 10:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-003',
//             pharmacyName: 'MediCare Express',
//             address: '789 Pine St, Uptown',
//             distance: 1.8,
//             deliveryTime: '20-35 mins',
//             deliveryFee: 6.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 50,
//                 price: 12.49,
//                 expiryDate: '2026-02-28',
//             },
//             rating: 4.9,
//             isOpen: true,
//             openingHours: '24/7',
//         },
//         {
//             pharmacyId: 'pharmacy-006',
//             pharmacyName: 'Family Health Pharmacy',
//             address: '987 Cedar Blvd, Southside',
//             distance: 3.7,
//             deliveryTime: '40-55 mins',
//             deliveryFee: 3.0,
//             stockInfo: {
//                 availability: 'low-stock',
//                 quantity: 10,
//                 price: 10.99,
//                 expiryDate: '2025-10-31',
//             },
//             rating: 4.5,
//             isOpen: true,
//             openingHours: '8:30 AM - 9:30 PM',
//         },
//     ],
//     'med-002-alt-1': [
//         {
//             pharmacyId: 'pharmacy-002',
//             pharmacyName: 'Health Plus Pharmacy',
//             address: '456 Oak Ave, Midtown',
//             distance: 3.2,
//             deliveryTime: '45-60 mins',
//             deliveryFee: 3.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 35,
//                 price: 68.99,
//                 expiryDate: '2025-11-30',
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '9:00 AM - 9:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-004',
//             pharmacyName: 'Green Cross Pharmacy',
//             address: '321 Elm St, Westside',
//             distance: 4.1,
//             deliveryTime: '50-70 mins',
//             deliveryFee: 2.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 45,
//                 price: 65.99,
//                 expiryDate: '2025-12-15',
//             },
//             rating: 4.4,
//             isOpen: true,
//             openingHours: '7:00 AM - 11:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-007',
//             pharmacyName: 'Wellness Pharmacy',
//             address: '159 Birch St, Central',
//             distance: 2.1,
//             deliveryTime: '25-40 mins',
//             deliveryFee: 4.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 20,
//                 price: 72.99,
//                 expiryDate: '2026-01-31',
//             },
//             rating: 4.3,
//             isOpen: true,
//             openingHours: '9:00 AM - 8:00 PM',
//         },
//     ],
//     'med-003-alt-1': [
//         {
//             pharmacyId: 'pharmacy-001',
//             pharmacyName: 'City Pharmacy',
//             address: '123 Main St, Downtown',
//             distance: 2.5,
//             deliveryTime: '30-45 mins',
//             deliveryFee: 5.0,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 60,
//                 price: 78.99,
//                 expiryDate: '2025-12-31',
//             },
//             rating: 4.8,
//             isOpen: true,
//             openingHours: '8:00 AM - 10:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-002',
//             pharmacyName: 'Health Plus Pharmacy',
//             address: '456 Oak Ave, Midtown',
//             distance: 3.2,
//             deliveryTime: '45-60 mins',
//             deliveryFee: 3.5,
//             stockInfo: {
//                 availability: 'in-stock',
//                 quantity: 40,
//                 price: 75.99,
//                 expiryDate: '2025-11-30',
//             },
//             rating: 4.6,
//             isOpen: true,
//             openingHours: '9:00 AM - 9:00 PM',
//         },
//         {
//             pharmacyId: 'pharmacy-004',
//             pharmacyName: 'Green Cross Pharmacy',
//             address: '321 Elm St, Westside',
//             distance: 4.1,
//             deliveryTime: '50-70 mins',
//             deliveryFee: 2.5,
//             stockInfo: {
//                 availability: 'low-stock',
//                 quantity: 15,
//                 price: 73.99,
//                 expiryDate: '2025-10-31',
//             },
//             rating: 4.4,
//             isOpen: true,
//             openingHours: '7:00 AM - 11:00 PM',
//         },
//     ],
// };

// // Simple interface for pharmacy info that matches the interface expectations
// export interface SimplePharmacyInfo {
//     pharmacyId: string;
//     pharmacyName: string;
//     address: string;
//     distance: number;
//     deliveryTime: string;
//     deliveryFee: number;
//     stockInfo: {
//         availability: 'in-stock' | 'low-stock' | 'out-of-stock';
//         quantity: number;
//         price: number;
//         expiryDate: string;
//     };
//     packagingPrices: {
//         blister: number;
//         box: number;
//     };
//     rating: number;
//     isOpen: boolean;
//     openingHours: string;
// }

// // Add the missing method to the PharmacyAvailabilityService class
// PharmacyAvailabilityService.prototype.getPharmaciesWithMedicine = function (
//     medicineId: string,
//     cityId?: string,
// ): SimplePharmacyInfo[] {
//     // Return mockup data for the medicine
//     const pharmacies = mockPharmacyAvailability[medicineId] || [];

//     // Filter out out-of-stock pharmacies and return only available ones with sufficient stock
//     return pharmacies.filter((pharmacy) => {
//         // Must be in stock and have quantity available
//         const hasStock =
//             pharmacy.stockInfo.availability === 'in-stock' && pharmacy.stockInfo.quantity > 0;

//         // Must be open (if specified)
//         const isOpen = pharmacy.isOpen !== false;

//         // Must have valid pricing
//         const hasValidPricing =
//             pharmacy.packagingPrices &&
//             (pharmacy.packagingPrices.blister > 0 || pharmacy.packagingPrices.box > 0);

//         return hasStock && isOpen && hasValidPricing;
//     });
// };

// // Export singleton instance
// export const pharmacyAvailabilityService = PharmacyAvailabilityService.getInstance();

// // Initialize demo data
// pharmacyAvailabilityService.initializeDemoRestockSimulations();
