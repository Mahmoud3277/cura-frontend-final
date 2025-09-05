import { PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';

// Types for Medicine Selection
export interface MedicineSelection {
    id: string;
    prescriptionId: string;
    medicineId: string;
    selectedPharmacyId: string;
    selectedQuantity: number;
    unitPrice: number;
    totalPrice: number;
    deliveryFee: number;
    estimatedDeliveryTime: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Medicine {
    id: string;
    name: string;
    genericName?: string;
    activeIngredient: string;
    strength: string;
    form: string; // tablet, capsule, syrup, etc.
    manufacturer: string;
    prescribedQuantity: number;
    prescribedInstructions: string;
    dosage: string;
    frequency: string;
    duration?: string;
    timing?: string[];
    foodInstructions?: string;
    specialInstructions?: string[];
    warnings?: string[];
    sideEffects?: string[];
    contraindications?: string[];
    storageInstructions?: string;
    image?: string;
    category: string;
    requiresPrescription: boolean;
    alternatives?: Medicine[];
}

export interface PharmacyMedicineAvailability {
    pharmacyId: string;
    pharmacyName: string;
    pharmacyAddress: string;
    pharmacyPhone: string;
    pharmacyRating: number;
    pharmacyReviewCount: number;
    distance: string;
    deliveryTime: string;
    deliveryFee: number;
    isOpen: boolean;
    workingHours: string;
    specialties: string[];
    features: string[];
    medicinePrice: number;
    inStock: boolean;
    stockLevel: 'high' | 'medium' | 'low' | 'out';
    stockQuantity: number;
    lastUpdated: Date;
}

export interface PrescriptionMedicineData {
    medicine: Medicine;
    pharmacyAvailability: PharmacyMedicineAvailability[];
    alternatives: Medicine[];
    recommendedPharmacy?: string;
    lowestPrice?: number;
    averagePrice?: number;
}

export interface SelectionSummary {
    prescriptionId: string;
    selections: MedicineSelection[];
    totalAmount: number;
    totalDeliveryFees: number;
    grandTotal: number;
    estimatedDeliveryTime: string;
    pharmaciesInvolved: string[];
    isComplete: boolean;
    missingSelections: string[];
}

// Mock data for development
const mockMedicines: Medicine[] = [
    {
        id: 'med-1',
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        activeIngredient: 'Paracetamol',
        strength: '500mg',
        form: 'Tablet',
        manufacturer: 'Pharco Pharmaceuticals',
        prescribedQuantity: 20,
        prescribedInstructions: 'Take 1 tablet every 6 hours as needed for pain or fever',
        dosage: '500mg',
        frequency: 'Every 6 hours as needed',
        duration: '5-7 days',
        timing: ['Morning', 'Afternoon', 'Evening', 'Night'],
        foodInstructions: 'Can be taken with or without food',
        specialInstructions: [
            'Do not exceed 4 tablets in 24 hours',
            'Drink plenty of water',
            'Stop if symptoms persist for more than 3 days',
        ],
        warnings: [
            'Do not use with other paracetamol-containing medicines',
            'Consult doctor if you have liver problems',
        ],
        sideEffects: ['Nausea', 'Stomach upset (rare)', 'Allergic reactions (very rare)'],
        contraindications: ['Severe liver disease', 'Known allergy to paracetamol'],
        storageInstructions:
            'Store in a cool, dry place below 25°C. Keep out of reach of children.',
        image: '/images/medicines/paracetamol-500mg.jpg',
        category: 'Pain Relief',
        requiresPrescription: false,
        alternatives: [
            {
                id: 'med-1-alt-1',
                name: 'Panadol 500mg',
                genericName: 'Acetaminophen',
                activeIngredient: 'Paracetamol',
                strength: '500mg',
                form: 'Tablet',
                manufacturer: 'GlaxoSmithKline',
                prescribedQuantity: 20,
                prescribedInstructions: 'Take 1 tablet every 6 hours as needed for pain or fever',
                dosage: '500mg',
                frequency: 'Every 6 hours as needed',
                category: 'Pain Relief',
                requiresPrescription: false,
            },
            {
                id: 'med-1-alt-2',
                name: 'Cetal 500mg',
                genericName: 'Acetaminophen',
                activeIngredient: 'Paracetamol',
                strength: '500mg',
                form: 'Tablet',
                manufacturer: 'Amoun Pharmaceutical',
                prescribedQuantity: 20,
                prescribedInstructions: 'Take 1 tablet every 6 hours as needed for pain or fever',
                dosage: '500mg',
                frequency: 'Every 6 hours as needed',
                category: 'Pain Relief',
                requiresPrescription: false,
            },
        ],
    },
    {
        id: 'med-2',
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        activeIngredient: 'Amoxicillin',
        strength: '500mg',
        form: 'Capsule',
        manufacturer: 'Hikma Pharmaceuticals',
        prescribedQuantity: 21,
        prescribedInstructions: 'Take 1 capsule three times daily for 7 days',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        timing: ['Morning', 'Afternoon', 'Evening'],
        foodInstructions: 'Take with food to reduce stomach upset',
        specialInstructions: [
            'Complete the full course even if you feel better',
            'Take at evenly spaced intervals',
            'Drink plenty of fluids',
        ],
        warnings: [
            'Tell your doctor about any allergies',
            'May reduce effectiveness of birth control pills',
        ],
        sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Skin rash', 'Yeast infections'],
        contraindications: ['Allergy to penicillin or amoxicillin', 'Severe kidney disease'],
        storageInstructions: 'Store in a cool, dry place. Keep refrigerated if liquid form.',
        image: '/images/medicines/amoxicillin-500mg.jpg',
        category: 'Antibiotics',
        requiresPrescription: true,
        alternatives: [
            {
                id: 'med-2-alt-1',
                name: 'Augmentin 500mg',
                genericName: 'Amoxicillin/Clavulanate',
                activeIngredient: 'Amoxicillin + Clavulanic Acid',
                strength: '500mg/125mg',
                form: 'Tablet',
                manufacturer: 'GlaxoSmithKline',
                prescribedQuantity: 21,
                prescribedInstructions: 'Take 1 tablet three times daily for 7 days',
                dosage: '500mg/125mg',
                frequency: 'Three times daily',
                category: 'Antibiotics',
                requiresPrescription: true,
            },
        ],
    },
    {
        id: 'med-3',
        name: 'Vitamin D3 1000IU',
        genericName: 'Cholecalciferol',
        activeIngredient: 'Vitamin D3',
        strength: '1000IU',
        form: 'Capsule',
        manufacturer: 'Eva Pharma',
        prescribedQuantity: 30,
        prescribedInstructions: 'Take 1 capsule daily with food',
        dosage: '1000IU',
        frequency: 'Once daily',
        duration: '3 months',
        timing: ['Morning'],
        foodInstructions: 'Take with food for better absorption',
        specialInstructions: [
            'Take consistently at the same time each day',
            'Regular blood tests may be needed',
        ],
        warnings: [
            'Do not exceed recommended dose',
            'Tell your doctor about other vitamin supplements',
        ],
        sideEffects: ['Nausea (if taken on empty stomach)', 'Constipation (rare)'],
        contraindications: ['Hypercalcemia', 'Kidney stones'],
        storageInstructions: 'Store in a cool, dry place away from light.',
        image: '/images/medicines/vitamin-d3-1000iu.jpg',
        category: 'Vitamins',
        requiresPrescription: false,
        alternatives: [
            {
                id: 'med-3-alt-1',
                name: 'D-Cure 1000IU',
                genericName: 'Cholecalciferol',
                activeIngredient: 'Vitamin D3',
                strength: '1000IU',
                form: 'Tablet',
                manufacturer: 'Amoun Pharmaceutical',
                prescribedQuantity: 30,
                prescribedInstructions: 'Take 1 tablet daily with food',
                dosage: '1000IU',
                frequency: 'Once daily',
                category: 'Vitamins',
                requiresPrescription: false,
            },
        ],
    },
];

const mockPharmacyAvailability: Record<string, PharmacyMedicineAvailability[]> = {
    'med-1': [
        {
            pharmacyId: 'pharmacy-1',
            pharmacyName: 'Al Ezaby Pharmacy',
            pharmacyAddress: '123 Tahrir Square, Cairo',
            pharmacyPhone: '+20 2 1234 5678',
            pharmacyRating: 4.5,
            pharmacyReviewCount: 150,
            distance: '2.5 km',
            deliveryTime: '30-45 mins',
            deliveryFee: 15.0,
            isOpen: true,
            workingHours: '8:00 AM - 11:00 PM',
            specialties: ['General Medicine', 'Pain Relief', 'Vitamins'],
            features: ['24/7 Delivery', 'Pharmacist Consultation', 'Insurance Accepted'],
            medicinePrice: 12.5,
            inStock: true,
            stockLevel: 'high',
            stockQuantity: 500,
            lastUpdated: new Date(),
        },
        {
            pharmacyId: 'pharmacy-2',
            pharmacyName: 'Seif Pharmacy',
            pharmacyAddress: '456 Nasr City, Cairo',
            pharmacyPhone: '+20 2 2345 6789',
            pharmacyRating: 4.2,
            pharmacyReviewCount: 89,
            distance: '3.8 km',
            deliveryTime: '45-60 mins',
            deliveryFee: 20.0,
            isOpen: true,
            workingHours: '9:00 AM - 10:00 PM',
            specialties: ['General Medicine', 'Chronic Conditions'],
            features: ['Home Delivery', 'Online Consultation'],
            medicinePrice: 11.75,
            inStock: true,
            stockLevel: 'medium',
            stockQuantity: 150,
            lastUpdated: new Date(),
        },
        {
            pharmacyId: 'pharmacy-3',
            pharmacyName: 'Dawaya Pharmacy',
            pharmacyAddress: '789 Heliopolis, Cairo',
            pharmacyPhone: '+20 2 3456 7890',
            pharmacyRating: 4.0,
            pharmacyReviewCount: 67,
            distance: '5.2 km',
            deliveryTime: '60-75 mins',
            deliveryFee: 25.0,
            isOpen: false,
            workingHours: '10:00 AM - 9:00 PM',
            specialties: ['Specialized Medicine', 'Rare Drugs'],
            features: ['Prescription Reading', 'Medicine Information'],
            medicinePrice: 13.25,
            inStock: false,
            stockLevel: 'out',
            stockQuantity: 0,
            lastUpdated: new Date(),
        },
    ],
    'med-2': [
        {
            pharmacyId: 'pharmacy-1',
            pharmacyName: 'Al Ezaby Pharmacy',
            pharmacyAddress: '123 Tahrir Square, Cairo',
            pharmacyPhone: '+20 2 1234 5678',
            pharmacyRating: 4.5,
            pharmacyReviewCount: 150,
            distance: '2.5 km',
            deliveryTime: '30-45 mins',
            deliveryFee: 15.0,
            isOpen: true,
            workingHours: '8:00 AM - 11:00 PM',
            specialties: ['General Medicine', 'Antibiotics', 'Prescription Medicine'],
            features: ['24/7 Delivery', 'Pharmacist Consultation', 'Insurance Accepted'],
            medicinePrice: 45.0,
            inStock: true,
            stockLevel: 'high',
            stockQuantity: 200,
            lastUpdated: new Date(),
        },
        {
            pharmacyId: 'pharmacy-2',
            pharmacyName: 'Seif Pharmacy',
            pharmacyAddress: '456 Nasr City, Cairo',
            pharmacyPhone: '+20 2 2345 6789',
            pharmacyRating: 4.2,
            pharmacyReviewCount: 89,
            distance: '3.8 km',
            deliveryTime: '45-60 mins',
            deliveryFee: 20.0,
            isOpen: true,
            workingHours: '9:00 AM - 10:00 PM',
            specialties: ['General Medicine', 'Antibiotics'],
            features: ['Home Delivery', 'Online Consultation'],
            medicinePrice: 42.5,
            inStock: true,
            stockLevel: 'low',
            stockQuantity: 25,
            lastUpdated: new Date(),
        },
    ],
    'med-3': [
        {
            pharmacyId: 'pharmacy-1',
            pharmacyName: 'Al Ezaby Pharmacy',
            pharmacyAddress: '123 Tahrir Square, Cairo',
            pharmacyPhone: '+20 2 1234 5678',
            pharmacyRating: 4.5,
            pharmacyReviewCount: 150,
            distance: '2.5 km',
            deliveryTime: '30-45 mins',
            deliveryFee: 15.0,
            isOpen: true,
            workingHours: '8:00 AM - 11:00 PM',
            specialties: ['General Medicine', 'Vitamins', 'Supplements'],
            features: ['24/7 Delivery', 'Pharmacist Consultation', 'Insurance Accepted'],
            medicinePrice: 85.0,
            inStock: true,
            stockLevel: 'high',
            stockQuantity: 300,
            lastUpdated: new Date(),
        },
        {
            pharmacyId: 'pharmacy-2',
            pharmacyName: 'Seif Pharmacy',
            pharmacyAddress: '456 Nasr City, Cairo',
            pharmacyPhone: '+20 2 2345 6789',
            pharmacyRating: 4.2,
            pharmacyReviewCount: 89,
            distance: '3.8 km',
            deliveryTime: '45-60 mins',
            deliveryFee: 20.0,
            isOpen: true,
            workingHours: '9:00 AM - 10:00 PM',
            specialties: ['General Medicine', 'Vitamins'],
            features: ['Home Delivery', 'Online Consultation'],
            medicinePrice: 82.0,
            inStock: true,
            stockLevel: 'medium',
            stockQuantity: 100,
            lastUpdated: new Date(),
        },
        {
            pharmacyId: 'pharmacy-3',
            pharmacyName: 'Dawaya Pharmacy',
            pharmacyAddress: '789 Heliopolis, Cairo',
            pharmacyPhone: '+20 2 3456 7890',
            pharmacyRating: 4.0,
            pharmacyReviewCount: 67,
            distance: '5.2 km',
            deliveryTime: '60-75 mins',
            deliveryFee: 25.0,
            isOpen: false,
            workingHours: '10:00 AM - 9:00 PM',
            specialties: ['Specialized Medicine', 'Vitamins'],
            features: ['Prescription Reading', 'Medicine Information'],
            medicinePrice: 88.5,
            inStock: true,
            stockLevel: 'low',
            stockQuantity: 15,
            lastUpdated: new Date(),
        },
    ],
};

// Mock storage for selections (in production, this would be a database)
let mockSelections: Record<string, MedicineSelection[]> = {};

export class MedicineSelectionService {
    /**
     * Get prescription medicines with alternatives and pharmacy availability
     */
    static async getPrescriptionMedicines(
        prescriptionId: string,
    ): Promise<PrescriptionMedicineData[]> {
        try {
            // In production, this would fetch from API
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

            // For demo, we'll return mock data for approved prescriptions
            const prescriptionMedicines: PrescriptionMedicineData[] = [];

            for (const medicine of mockMedicines) {
                const pharmacyAvailability = mockPharmacyAvailability[medicine.id] || [];
                const alternatives = medicine.alternatives || [];

                // Calculate pricing info
                const availablePrices = pharmacyAvailability
                    .filter((p) => p.inStock)
                    .map((p) => p.medicinePrice);

                const lowestPrice =
                    availablePrices.length > 0 ? Math.min(...availablePrices) : undefined;
                const averagePrice =
                    availablePrices.length > 0
                        ? availablePrices.reduce((sum, price) => sum + price, 0) /
                          availablePrices.length
                        : undefined;

                // Find recommended pharmacy (lowest price + good rating)
                const recommendedPharmacy = pharmacyAvailability
                    .filter((p) => p.inStock)
                    .sort((a, b) => {
                        const scoreA = 5 - a.medicinePrice / 10 + a.pharmacyRating;
                        const scoreB = 5 - b.medicinePrice / 10 + b.pharmacyRating;
                        return scoreB - scoreA;
                    })[0]?.pharmacyId;

                prescriptionMedicines.push({
                    medicine,
                    pharmacyAvailability,
                    alternatives,
                    recommendedPharmacy,
                    lowestPrice,
                    averagePrice,
                });
            }

            return prescriptionMedicines;
        } catch (error) {
            console.error('Error fetching prescription medicines:', error);
            throw new Error('Failed to load prescription medicines');
        }
    }

    /**
     * Get pharmacy availability for a specific medicine
     */
    static async getPharmacyAvailability(
        medicineId: string,
    ): Promise<PharmacyMedicineAvailability[]> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate API delay
            return mockPharmacyAvailability[medicineId] || [];
        } catch (error) {
            console.error('Error fetching pharmacy availability:', error);
            throw new Error('Failed to load pharmacy availability');
        }
    }

    /**
     * Filter pharmacies by stock availability
     */
    static async getAvailablePharmacies(
        medicineId: string,
    ): Promise<PharmacyMedicineAvailability[]> {
        try {
            const allPharmacies = await this.getPharmacyAvailability(medicineId);
            return allPharmacies.filter(
                (pharmacy) => pharmacy.inStock && pharmacy.stockQuantity > 0,
            );
        } catch (error) {
            console.error('Error filtering available pharmacies:', error);
            throw new Error('Failed to filter pharmacies');
        }
    }

    /**
     * Save customer medicine selection
     */
    static async saveMedicineSelection(
        selection: Omit<MedicineSelection, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<MedicineSelection> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

            const newSelection: MedicineSelection = {
                ...selection,
                id: `selection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Store in mock storage
            if (!mockSelections[selection.prescriptionId]) {
                mockSelections[selection.prescriptionId] = [];
            }

            // Remove existing selection for this medicine if any
            mockSelections[selection.prescriptionId] = mockSelections[
                selection.prescriptionId
            ].filter((s) => s.medicineId !== selection.medicineId);

            // Add new selection
            mockSelections[selection.prescriptionId].push(newSelection);

            return newSelection;
        } catch (error) {
            console.error('Error saving medicine selection:', error);
            throw new Error('Failed to save selection');
        }
    }

    /**
     * Get saved selections for a prescription
     */
    static async getSavedSelections(prescriptionId: string): Promise<MedicineSelection[]> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate API delay
            return mockSelections[prescriptionId] || [];
        } catch (error) {
            console.error('Error fetching saved selections:', error);
            throw new Error('Failed to load saved selections');
        }
    }

    /**
     * Update medicine selection
     */
    static async updateMedicineSelection(
        selectionId: string,
        updates: Partial<MedicineSelection>,
    ): Promise<MedicineSelection> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

            // Find and update selection
            for (const prescriptionId in mockSelections) {
                const selectionIndex = mockSelections[prescriptionId].findIndex(
                    (s) => s.id === selectionId,
                );
                if (selectionIndex !== -1) {
                    mockSelections[prescriptionId][selectionIndex] = {
                        ...mockSelections[prescriptionId][selectionIndex],
                        ...updates,
                        updatedAt: new Date(),
                    };
                    return mockSelections[prescriptionId][selectionIndex];
                }
            }

            throw new Error('Selection not found');
        } catch (error) {
            console.error('Error updating medicine selection:', error);
            throw new Error('Failed to update selection');
        }
    }

    /**
     * Delete medicine selection
     */
    static async deleteMedicineSelection(
        prescriptionId: string,
        medicineId: string,
    ): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate API delay

            if (mockSelections[prescriptionId]) {
                mockSelections[prescriptionId] = mockSelections[prescriptionId].filter(
                    (s) => s.medicineId !== medicineId,
                );
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error deleting medicine selection:', error);
            throw new Error('Failed to delete selection');
        }
    }

    /**
     * Get selection summary for checkout
     */
    static async getSelectionSummary(prescriptionId: string): Promise<SelectionSummary> {
        try {
            const selections = await this.getSavedSelections(prescriptionId);
            const prescriptionMedicines = await this.getPrescriptionMedicines(prescriptionId);

            const totalAmount = selections.reduce(
                (sum, selection) => sum + selection.totalPrice,
                0,
            );
            const totalDeliveryFees = selections.reduce(
                (sum, selection) => sum + selection.deliveryFee,
                0,
            );
            const grandTotal = totalAmount + totalDeliveryFees;

            const pharmaciesInvolved = [...new Set(selections.map((s) => s.selectedPharmacyId))];

            // Calculate estimated delivery time (longest time among selected pharmacies)
            const deliveryTimes = selections.map((s) => s.estimatedDeliveryTime);
            const estimatedDeliveryTime =
                deliveryTimes.length > 0
                    ? deliveryTimes.sort((a, b) => {
                          const aMax = parseInt(a.split('-')[1]) || 0;
                          const bMax = parseInt(b.split('-')[1]) || 0;
                          return bMax - aMax;
                      })[0]
                    : '30-45 mins';

            // Check for missing selections
            const selectedMedicineIds = selections.map((s) => s.medicineId);
            const allMedicineIds = prescriptionMedicines.map((pm) => pm.medicine.id);
            const missingSelections = allMedicineIds.filter(
                (id) => !selectedMedicineIds.includes(id),
            );

            return {
                prescriptionId,
                selections,
                totalAmount,
                totalDeliveryFees,
                grandTotal,
                estimatedDeliveryTime,
                pharmaciesInvolved,
                isComplete: missingSelections.length === 0,
                missingSelections,
            };
        } catch (error) {
            console.error('Error generating selection summary:', error);
            throw new Error('Failed to generate summary');
        }
    }

    /**
     * Validate selection before saving
     */
    static async validateSelection(
        selection: Omit<MedicineSelection, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<{
        isValid: boolean;
        errors: string[];
    }> {
        try {
            const errors: string[] = [];

            // Check if pharmacy has the medicine in stock
            const pharmacyAvailability = await this.getPharmacyAvailability(selection.medicineId);
            const selectedPharmacy = pharmacyAvailability.find(
                (p) => p.pharmacyId === selection.selectedPharmacyId,
            );

            if (!selectedPharmacy) {
                errors.push('Selected pharmacy not found');
            } else {
                if (!selectedPharmacy.inStock) {
                    errors.push('Medicine is out of stock at selected pharmacy');
                }
                if (selectedPharmacy.stockQuantity < selection.selectedQuantity) {
                    errors.push(
                        `Insufficient stock. Available: ${selectedPharmacy.stockQuantity}, Requested: ${selection.selectedQuantity}`,
                    );
                }
                if (!selectedPharmacy.isOpen) {
                    errors.push('Selected pharmacy is currently closed');
                }
            }

            // Validate quantity
            if (selection.selectedQuantity <= 0) {
                errors.push('Quantity must be greater than 0');
            }

            // Validate price
            if (selection.unitPrice <= 0) {
                errors.push('Invalid unit price');
            }

            return {
                isValid: errors.length === 0,
                errors,
            };
        } catch (error) {
            console.error('Error validating selection:', error);
            return {
                isValid: false,
                errors: ['Validation failed'],
            };
        }
    }

    /**
     * Get alternative medicines for a specific medicine
     */
    static async getAlternativeMedicines(medicineId: string): Promise<Medicine[]> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate API delay

            const medicine = mockMedicines.find((m) => m.id === medicineId);
            return medicine?.alternatives || [];
        } catch (error) {
            console.error('Error fetching alternative medicines:', error);
            throw new Error('Failed to load alternatives');
        }
    }

    /**
     * Search medicines by name or active ingredient
     */
    static async searchMedicines(query: string): Promise<Medicine[]> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

            const lowercaseQuery = query.toLowerCase();
            return mockMedicines.filter(
                (medicine) =>
                    medicine.name.toLowerCase().includes(lowercaseQuery) ||
                    medicine.genericName?.toLowerCase().includes(lowercaseQuery) ||
                    medicine.activeIngredient.toLowerCase().includes(lowercaseQuery),
            );
        } catch (error) {
            console.error('Error searching medicines:', error);
            throw new Error('Failed to search medicines');
        }
    }

    /**
     * Clear all selections for a prescription
     */
    static async clearAllSelections(prescriptionId: string): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate API delay

            delete mockSelections[prescriptionId];
            return true;
        } catch (error) {
            console.error('Error clearing selections:', error);
            throw new Error('Failed to clear selections');
        }
    }
}
