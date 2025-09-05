'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Updated interfaces to match your exact server data structure
export interface PrescriptionMedicine {
    duration: string;
    frequency: string;
    id: {
        _id: string;
        name: string;
        nameAr: string;
        activeIngredient: string;
        activeIngredientAr: string;
        strength: string;
        form: string;
        unit: string;
        packSize: string;
        price: string;
        manufacturer: string;
        manufacturerAr: string;
        image?: { url: string };
        genericAlternatives: any[];
        brandAlternatives: any[];
        strengthAlternatives: any[];
        pharmacyStocks: PharmacyStock[];
        overallAveragePrice: number;
        overallHighestPrice: number;
        overallLowestPrice: number;
        pharmacyAveragePrice: number;
        pharmacyHighestPrice: number;
        pharmacyLowestPrice: number;
        dosage: string;
        dosageAr: string;
        frequency: string;
        instructions: string;
        indication: string[];
        contraindications: string[];
        warnings: string[];
        sideEffects: string[];
        drugInteractions: string[];
        specialInstructions: string[];
        // ... other medicine properties from your data
    };
    instructions: string;
    name: string;
    notes: string;
    packagingUnit: string;
    quantity: number;
}

export interface PharmacyStock {
    providerId: string;
    providerName: string;
    providerType: string;
    id: string;
    inStock: boolean;
    stock: number;
    price: number;
    lastUpdated: string;
    distance?: number;
    availability: string;
}

export interface PharmacyAvailabilityInfo {
    pharmacyId: string;
    pharmacyName: string;
    pharmacy?: {
        nameAr?: string;
    };
    distance: number;
    packagingPrices: {
        blister: number;
        box: number;
    };
    stockInfo: {
        stockQuantity: number;
        price: number;
    };
    deliveryInfo?: {
        deliveryFee: number;
        deliveryTime: string;
    };
    isOpen: boolean;
    deliveryFee: number;
    stock: number;
    availability: string;
}

export interface MedicineSelection {
    medicineId: string;
    originalMedicine: PrescriptionMedicine;
    selectedMedicine: PrescriptionMedicine;
    selectedAlternative?: any;
    selectedPharmacy?: PharmacyAvailabilityInfo;
    selectedQuantity: number;
    prescribedQuantity: number;
    selectedPackaging: 'blister' | 'box';
    packagingQuantity: number;
    notes?: string;
    isSelected: boolean;
    isValid: boolean;
    validationErrors: string[];
    lastUpdated: Date;
}

export interface SelectionValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface MedicineSelectionState {
    prescriptionId: string | null;
    selections: Record<string, MedicineSelection>;
    isLoading: boolean;
    error: string | null;
    totalPrice: number;
    totalDeliveryFees: number;
    grandTotal: number;
    isComplete: boolean;
    completionPercentage: number;
    pharmaciesInvolved: string[];
    estimatedDeliveryTime: string;
    lastSaved: Date | null;
    isDirty: boolean;
    validation: SelectionValidation;
}

// Action Types
type MedicineSelectionAction =
    | { type: 'SET_PRESCRIPTION_ID'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | {
          type: 'INITIALIZE_SELECTIONS';
          payload: { medicines: PrescriptionMedicine[]; prescribedQuantities: Record<string, number> };
      }
    | {
          type: 'UPDATE_MEDICINE_SELECTION';
          payload: { medicineId: string; isSelected: boolean };
      }
    | {
          type: 'UPDATE_ALTERNATIVE';
          payload: { medicineId: string; alternative: any | null };
      }
    | {
          type: 'UPDATE_PHARMACY';
          payload: { medicineId: string; pharmacy: PharmacyAvailabilityInfo | null };
      }
    | { type: 'UPDATE_QUANTITY'; payload: { medicineId: string; quantity: number } }
    | {
          type: 'UPDATE_PACKAGING';
          payload: { medicineId: string; packaging: 'blister' | 'box'; quantity: number };
      }
    | { type: 'UPDATE_NOTES'; payload: { medicineId: string; notes: string } }
    | { type: 'VALIDATE_SELECTION'; payload: { medicineId: string } }
    | { type: 'VALIDATE_ALL_SELECTIONS' }
    | { type: 'CLEAR_SELECTIONS' }
    | { type: 'MARK_AS_SAVED' }
    | { type: 'RESET_STATE' };

// Initial state
const initialState: MedicineSelectionState = {
    prescriptionId: null,
    selections: {},
    isLoading: false,
    error: null,
    totalPrice: 0,
    totalDeliveryFees: 0,
    grandTotal: 0,
    isComplete: false,
    completionPercentage: 0,
    pharmaciesInvolved: [],
    estimatedDeliveryTime: '',
    lastSaved: null,
    isDirty: false,
    validation: {
        isValid: false,
        errors: [],
        warnings: [],
    },
};

// Helper functions
const validateSelection = (selection: MedicineSelection): SelectionValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!selection.selectedPharmacy) {
        errors.push('No pharmacy selected');
    }

    if (selection.selectedQuantity <= 0) {
        errors.push('Quantity must be greater than 0');
    }

    // Stock validation
    if (
        selection.selectedPharmacy &&
        selection.selectedQuantity > selection.selectedPharmacy.stockInfo.stockQuantity
    ) {
        errors.push(
            `Quantity exceeds available stock (${selection.selectedPharmacy.stockInfo.stockQuantity} available)`,
        );
    }

    // Pharmacy availability validation
    if (selection.selectedPharmacy && !selection.selectedPharmacy.isOpen) {
        warnings.push('Selected pharmacy is currently closed');
    }

    // Quantity vs prescribed validation
    if (selection.selectedQuantity !== selection.prescribedQuantity) {
        const difference = Math.abs(selection.selectedQuantity - selection.prescribedQuantity);
        const percentageDiff = (difference / selection.prescribedQuantity) * 100;

        if (percentageDiff > 50) {
            warnings.push(
                `Quantity differs significantly from prescribed amount (${selection.prescribedQuantity})`,
            );
        }
    }

    // Alternative medicine warning
    if (selection.selectedAlternative) {
        warnings.push('Alternative medicine selected - please consult with pharmacist');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};

const calculateTotals = (selections: Record<string, MedicineSelection>) => {
    let totalPrice = 0;
    let totalDeliveryFees = 0;
    const pharmaciesInvolved: string[] = [];

    Object.values(selections).forEach((selection) => {
        if (selection.selectedPharmacy && selection.isSelected) {
            // Calculate medicine cost based on pharmacy-specific packaging prices
            const packagingPrice = selection.selectedPharmacy.packagingPrices[selection.selectedPackaging];
            if (packagingPrice) {
                totalPrice += packagingPrice * selection.packagingQuantity;
            }

            // Track unique pharmacies for delivery fee calculation
            if (!pharmaciesInvolved.includes(selection.selectedPharmacy.pharmacyId)) {
                pharmaciesInvolved.push(selection.selectedPharmacy.pharmacyId);
                totalDeliveryFees += selection.selectedPharmacy.deliveryFee || 0;
            }
        }
    });

    const grandTotal = totalPrice + totalDeliveryFees;

    // Calculate estimated delivery time (longest among selected pharmacies)
    const deliveryTimes = Object.values(selections)
        .filter((s) => s.selectedPharmacy && s.isSelected)
        .map((s) => s.selectedPharmacy!.deliveryInfo?.deliveryTime || '30-45 mins');

    const estimatedDeliveryTime =
        deliveryTimes.length > 0
            ? deliveryTimes.sort((a, b) => {
                  const aMax = parseInt(a.split('-')[1]) || 0;
                  const bMax = parseInt(b.split('-')[1]) || 0;
                  return bMax - aMax;
              })[0]
            : '';

    return {
        totalPrice,
        totalDeliveryFees,
        grandTotal,
        pharmaciesInvolved,
        estimatedDeliveryTime,
    };
};

const validateAllSelections = (selections: Record<string, MedicineSelection>): SelectionValidation => {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    Object.values(selections).forEach((selection) => {
        const validation = validateSelection(selection);
        allErrors.push(...validation.errors);
        allWarnings.push(...validation.warnings);
    });

    // Global validations
    const completedSelections = Object.values(selections).filter(
        (s) => s.selectedPharmacy && s.selectedQuantity > 0 && s.isSelected,
    );
    const selectedSelections = Object.values(selections).filter((s) => s.isSelected);
    const totalSelections = selectedSelections.length;

    if (completedSelections.length === 0 && totalSelections > 0) {
        allErrors.push('No medicines have been completed');
    }

    if (completedSelections.length < totalSelections) {
        allWarnings.push(
            `${totalSelections - completedSelections.length} selected medicine(s) still need pharmacy selection`,
        );
    }

    return {
        isValid: allErrors.length === 0,
        errors: [...new Set(allErrors)],
        warnings: [...new Set(allWarnings)],
    };
};

// Helper function to transform server data to the format expected by the context
const transformServerMedicine = (serverMedicine) => {
    // Safe extraction with fallbacks
    const productId = serverMedicine?.id?._id || '';
    const productData = serverMedicine?.id || {};
    
    // Extract pharmacy stocks for pricing
    const pharmacyStocks = productData.pharmacyStocks || [];
    
    // Get pharmacy-specific pricing (use first available pharmacy stock)
    const primaryPharmacyStock = pharmacyStocks[0] || {};
    const pharmacyPrice = primaryPharmacyStock.price || productData.pharmacyAveragePrice || productData.overallAveragePrice || 0;
    
    const transformed = {
        // Medication-specific fields from prescription
        duration: serverMedicine.duration || '',
        frequency: serverMedicine.frequency || '',
        instructions: serverMedicine.instructions || '',
        dosage: serverMedicine.dosage || productData.dosage || '',
        notes: serverMedicine.notes || '',
        packagingUnit: serverMedicine.packagingUnit || productData.packSize || '',
        quantity: serverMedicine.quantity || 1,
        
        // Product data with enhanced structure
        id: {
            _id: String(productId), // Ensure _id is string
            name: productData.name || serverMedicine.name || '',
            nameAr: productData.nameAr || '',
            activeIngredient: productData.activeIngredient || '',
            activeIngredientAr: productData.activeIngredientAr || '',
            strength: productData.strength || productData.dosage || '',
            form: productData.form || productData.productType || '',
            unit: productData.unit || '',
            packSize: productData.packSize || '',
            price: pharmacyPrice, // Use pharmacy price, not product price
            manufacturer: productData.manufacturer || '',
            manufacturerAr: productData.manufacturerAr || '',
            image: productData.images?.[0]?.url || serverMedicine.image || '',
            category: productData.category || '',
            subcategory: productData.subcategory || '',
            requiresPrescription: productData.requiresPrescription || productData.prescriptionRequired || false,
            
            // Availability data
            inStock: productData.overallAvailability === 'in-stock',
            stockLevel: productData.overallAvailability || 'unknown',
            
            // Enhanced pharmacy stocks with proper structure
            pharmacyStocks: pharmacyStocks.map(stock => ({
                providerId: stock.providerId || stock.pharmacyId || '',
                providerName: stock.providerName || stock.pharmacyName || '',
                providerType: stock.providerType || 'pharmacy',
                price: stock.price || 0,
                originalPrice: stock.originalPrice || stock.price || 0,
                discount: stock.discount || 0,
                inStock: stock.inStock !== false,
                stockQuantity: stock.stockQuantity || stock.quantity || 0,
                stockLevel: stock.stockLevel || (stock.inStock ? 'in-stock' : 'out-of-stock'),
                deliveryAvailable: stock.deliveryAvailable !== false,
                deliveryFee: stock.deliveryFee || 0,
                deliveryTime: stock.deliveryTime || '30-45 min',
                lastUpdated: stock.lastUpdated || new Date().toISOString()
            })),
            
            // Alternative medicines
            genericAlternatives: productData.genericAlternatives || [],
            brandAlternatives: productData.brandAlternatives || [],
            strengthAlternatives: productData.strengthAlternatives || [],
            
            // Additional product info
            warnings: productData.warnings || [],
            sideEffects: productData.sideEffects || [],
            contraindications: productData.contraindications || [],
            drugInteractions: productData.drugInteractions || [],
            specialInstructions: productData.specialInstructions || [],
            indication: productData.indication || [],
            storageConditions: productData.storageConditions || '',
            
            // Pricing summary (use pharmacy data)
            overallAveragePrice: productData.pharmacyAveragePrice || productData.overallAveragePrice || 0,
            overallHighestPrice: productData.pharmacyHighestPrice || productData.overallHighestPrice || 0,
            overallLowestPrice: productData.pharmacyLowestPrice || productData.overallLowestPrice || 0,
            pharmacyAveragePrice: productData.pharmacyAveragePrice || 0,
            pharmacyHighestPrice: productData.pharmacyHighestPrice || 0,
            pharmacyLowestPrice: productData.pharmacyLowestPrice || 0
        },
        
        // Medicine name for display
        name: productData.name || serverMedicine.name || '',
        
        // Image URL
        image: productData.images?.[0]?.url || serverMedicine.image || ''
    };
    
    return transformed;
};

// Helper function to convert pharmacy stock to availability info
const transformPharmacyStock = (stock: PharmacyStock, medicinePrice: number): PharmacyAvailabilityInfo => {
    return {
        pharmacyId: stock.providerId,
        pharmacyName: stock.providerName,
        distance: stock.distance || Math.random() * 10 + 1, // Random distance between 1-11 km
        packagingPrices: {
            blister: medicinePrice * 0.6, // 60% of box price for blister
            box: medicinePrice,
        },
        stockInfo: {
            stockQuantity: stock.stock,
            price: stock.price || medicinePrice,
        },
        deliveryInfo: {
            deliveryFee: 20, // Default delivery fee
            deliveryTime: '30-45 mins',
        },
        isOpen: stock.inStock, // Use inStock as isOpen
        deliveryFee: 20,
        stock: stock.stock,
        availability: stock.inStock ? 'in-stock' : 'out-of-stock',
    };
};

// Reducer
function medicineSelectionReducer(
    state: MedicineSelectionState,
    action: MedicineSelectionAction,
): MedicineSelectionState {
    switch (action.type) {
        case 'SET_PRESCRIPTION_ID':
            return {
                ...state,
                prescriptionId: action.payload,
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        case 'INITIALIZE_SELECTIONS': {
            const { medicines, prescribedQuantities } = action.payload;
            const selections: Record<string, MedicineSelection> = {};

            medicines.forEach((medicine, index) => {
                const medicineId = String(medicine.id._id); // Ensure string
                
                // Validate medicine ID - TEMPORARILY REMOVED LENGTH CHECK
                if (!medicineId) {
                    console.error('Missing medicine ID detected:', {
                        medicineId,
                        originalId: medicine.id._id,
                        medicine: medicine
                    });
                    return; // Skip this medicine
                }
                
                // Temporarily comment out length validation to see if that's the issue
                // if (medicineId.length < 20) {
                //     console.error('Medicine ID too short:', {
                //         medicineId,
                //         length: medicineId.length,
                //         originalId: medicine.id._id,
                //         medicine: medicine
                //     });
                //     return; // Skip this medicine
                // }
                
                const prescribedQuantity = prescribedQuantities[medicineId] || medicine.quantity || 1;
                
                selections[medicineId] = {
                    medicineId,
                    originalMedicine: medicine,
                    selectedMedicine: medicine,
                    selectedQuantity: prescribedQuantity,
                    prescribedQuantity,
                    selectedPackaging: 'box',
                    packagingQuantity: 1,
                    isSelected: true,
                    isValid: false,
                    validationErrors: ['No pharmacy selected'],
                    lastUpdated: new Date(),
                };
            });

            const totals = calculateTotals(selections);
            const validation = validateAllSelections(selections);
            const selectedMedicines = Object.values(selections).filter((s) => s.isSelected);
            const completedCount = selectedMedicines.filter((s) => s.selectedPharmacy).length;
            const completionPercentage =
                selectedMedicines.length > 0 ? (completedCount / selectedMedicines.length) * 100 : 0;

            return {
                ...state,
                selections,
                ...totals,
                validation,
                completionPercentage,
                isComplete:
                    validation.isValid &&
                    completedCount === selectedMedicines.length &&
                    selectedMedicines.length > 0,
                isDirty: false,
                error: null,
            };
        }

        case 'UPDATE_MEDICINE_SELECTION': {
            const { medicineId, isSelected } = action.payload;
            if (!state.selections[medicineId]) return state;

            const updatedSelection = {
                ...state.selections[medicineId],
                isSelected,
                lastUpdated: new Date(),
            };

            // If deselecting, clear pharmacy selection
            if (!isSelected) {
                updatedSelection.selectedPharmacy = undefined;
            }

            const updatedSelections = {
                ...state.selections,
                [medicineId]: updatedSelection,
            };

            const totals = calculateTotals(updatedSelections);
            const validation = validateAllSelections(updatedSelections);
            const selectedMedicines = Object.values(updatedSelections).filter((s) => s.isSelected);
            const completedCount = selectedMedicines.filter((s) => s.selectedPharmacy).length;
            const completionPercentage =
                selectedMedicines.length > 0 ? (completedCount / selectedMedicines.length) * 100 : 0;

            return {
                ...state,
                selections: updatedSelections,
                ...totals,
                validation,
                completionPercentage,
                isComplete:
                    validation.isValid &&
                    completedCount === selectedMedicines.length &&
                    selectedMedicines.length > 0,
                isDirty: true,
            };
        }

        case 'UPDATE_ALTERNATIVE': {
            const { medicineId, alternative } = action.payload;
            if (!state.selections[medicineId]) return state;

            const updatedSelection = {
                ...state.selections[medicineId],
                selectedAlternative: alternative,
                selectedMedicine: alternative || state.selections[medicineId].originalMedicine,
                selectedPharmacy: undefined,
                lastUpdated: new Date(),
            };

            const updatedSelections = {
                ...state.selections,
                [medicineId]: updatedSelection,
            };

            const totals = calculateTotals(updatedSelections);
            const validation = validateAllSelections(updatedSelections);
            const selectedMedicines = Object.values(updatedSelections).filter((s) => s.isSelected);
            const completedCount = selectedMedicines.filter((s) => s.selectedPharmacy).length;
            const completionPercentage =
                selectedMedicines.length > 0 ? (completedCount / selectedMedicines.length) * 100 : 0;

            return {
                ...state,
                selections: updatedSelections,
                ...totals,
                validation,
                completionPercentage,
                isComplete:
                    validation.isValid &&
                    completedCount === selectedMedicines.length &&
                    selectedMedicines.length > 0,
                isDirty: true,
            };
        }

        case 'UPDATE_PHARMACY': {
            const { medicineId, pharmacy } = action.payload;
            const safeId = String(medicineId).trim(); // Ensure string
    
    if (!state.selections[safeId]) return state;

    const updatedSelection = {
        ...state.selections[safeId],
        selectedPharmacy: pharmacy || undefined,
        lastUpdated: new Date(),
    };

            // Validate the updated selection
            const selectionValidation = validateSelection(updatedSelection);
            updatedSelection.isValid = selectionValidation.isValid;
            updatedSelection.validationErrors = selectionValidation.errors;

            const updatedSelections = {
                ...state.selections,
                [medicineId]: updatedSelection,
            };

            const totals = calculateTotals(updatedSelections);
            const validation = validateAllSelections(updatedSelections);
            const selectedMedicines = Object.values(updatedSelections).filter((s) => s.isSelected);
            const completedCount = selectedMedicines.filter((s) => s.selectedPharmacy).length;
            const completionPercentage =
                selectedMedicines.length > 0 ? (completedCount / selectedMedicines.length) * 100 : 0;

            return {
                ...state,
                selections: updatedSelections,
                ...totals,
                validation,
                completionPercentage,
                isComplete:
                    validation.isValid &&
                    completedCount === selectedMedicines.length &&
                    selectedMedicines.length > 0,
                isDirty: true,
            };
        }

        case 'UPDATE_QUANTITY': {
            const { medicineId, quantity } = action.payload;
            if (!state.selections[medicineId]) return state;

            const clampedQuantity = Math.max(1, quantity);
            const updatedSelection = {
                ...state.selections[medicineId],
                selectedQuantity: clampedQuantity,
                lastUpdated: new Date(),
            };

            // Validate the updated selection
            const selectionValidation = validateSelection(updatedSelection);
            updatedSelection.isValid = selectionValidation.isValid;
            updatedSelection.validationErrors = selectionValidation.errors;

            const updatedSelections = {
                ...state.selections,
                [medicineId]: updatedSelection,
            };

            const totals = calculateTotals(updatedSelections);
            const validation = validateAllSelections(updatedSelections);
            const selectedMedicines = Object.values(updatedSelections).filter((s) => s.isSelected);
            const completedCount = selectedMedicines.filter((s) => s.selectedPharmacy).length;
            const completionPercentage =
                selectedMedicines.length > 0 ? (completedCount / selectedMedicines.length) * 100 : 0;

            return {
                ...state,
                selections: updatedSelections,
                ...totals,
                validation,
                completionPercentage,
                isComplete:
                    validation.isValid &&
                    completedCount === selectedMedicines.length &&
                    selectedMedicines.length > 0,
                isDirty: true,
            };
        }

        case 'UPDATE_PACKAGING': {
            const { medicineId, packaging, quantity } = action.payload;
            if (!state.selections[medicineId]) return state;

            const selection = state.selections[medicineId];
            
            // Calculate units based on packaging type and pack size
            const packSize = selection.selectedMedicine.id.packSize || '';
            const unitCount = parseInt(packSize.match(/(\d+)/)?.[1] || '1');
            let totalUnits = quantity;
            
            if (packaging === 'blister') {
                // Assume blister is half the pack size
                totalUnits = Math.ceil(unitCount / 2) * quantity;
            } else {
                // Box is the full pack size
                totalUnits = unitCount * quantity;
            }

            const updatedSelection = {
                ...selection,
                selectedPackaging: packaging,
                packagingQuantity: quantity,
                selectedQuantity: totalUnits,
                lastUpdated: new Date(),
            };

            // Validate the updated selection
            const selectionValidation = validateSelection(updatedSelection);
            updatedSelection.isValid = selectionValidation.isValid;
            updatedSelection.validationErrors = selectionValidation.errors;

            const updatedSelections = {
                ...state.selections,
                [medicineId]: updatedSelection,
            };

            const totals = calculateTotals(updatedSelections);
            const validation = validateAllSelections(updatedSelections);
            const selectedMedicines = Object.values(updatedSelections).filter((s) => s.isSelected);
            const completedCount = selectedMedicines.filter((s) => s.selectedPharmacy).length;
            const completionPercentage =
                selectedMedicines.length > 0 ? (completedCount / selectedMedicines.length) * 100 : 0;

            return {
                ...state,
                selections: updatedSelections,
                ...totals,
                validation,
                completionPercentage,
                isComplete:
                    validation.isValid &&
                    completedCount === selectedMedicines.length &&
                    selectedMedicines.length > 0,
                isDirty: true,
            };
        }

        case 'UPDATE_NOTES': {
            const { medicineId, notes } = action.payload;
            if (!state.selections[medicineId]) return state;

            const updatedSelection = {
                ...state.selections[medicineId],
                notes,
                lastUpdated: new Date(),
            };

            const updatedSelections = {
                ...state.selections,
                [medicineId]: updatedSelection,
            };

            return {
                ...state,
                selections: updatedSelections,
                isDirty: true,
            };
        }

        case 'VALIDATE_SELECTION': {
            const { medicineId } = action.payload;
            if (!state.selections[medicineId]) return state;

            const selection = state.selections[medicineId];
            const validation = validateSelection(selection);

            const updatedSelection = {
                ...selection,
                isValid: validation.isValid,
                validationErrors: validation.errors,
            };

            const updatedSelections = {
                ...state.selections,
                [medicineId]: updatedSelection,
            };

            const globalValidation = validateAllSelections(updatedSelections);

            return {
                ...state,
                selections: updatedSelections,
                validation: globalValidation,
            };
        }

        case 'VALIDATE_ALL_SELECTIONS': {
            const updatedSelections = { ...state.selections };

            Object.keys(updatedSelections).forEach((medicineId) => {
                const selection = updatedSelections[medicineId];
                const validation = validateSelection(selection);
                updatedSelections[medicineId] = {
                    ...selection,
                    isValid: validation.isValid,
                    validationErrors: validation.errors,
                };
            });

            const globalValidation = validateAllSelections(updatedSelections);
            const selectedMedicines = Object.values(updatedSelections).filter((s) => s.isSelected);
            const completedCount = selectedMedicines.filter((s) => s.selectedPharmacy).length;
            const completionPercentage =
                selectedMedicines.length > 0 ? (completedCount / selectedMedicines.length) * 100 : 0;

            return {
                ...state,
                selections: updatedSelections,
                validation: globalValidation,
                completionPercentage,
                isComplete:
                    globalValidation.isValid &&
                    completedCount === selectedMedicines.length &&
                    selectedMedicines.length > 0,
            };
        }

        case 'CLEAR_SELECTIONS':
            return {
                ...initialState,
                prescriptionId: state.prescriptionId,
            };

        case 'MARK_AS_SAVED':
            return {
                ...state,
                lastSaved: new Date(),
                isDirty: false,
            };

        case 'RESET_STATE':
            return initialState;

        default:
            return state;
    }
}

// Context interfaces
interface MedicineSelectionContextType {
    state: MedicineSelectionState;
    actions: {
        setPrescriptionId: (id: string) => void;
        setLoading: (loading: boolean) => void;
        setError: (error: string | null) => void;
        initializeSelections: (
            medicines: PrescriptionMedicine[],
            prescribedQuantities?: Record<string, number>,
        ) => void;
        updateAlternative: (medicineId: string, alternative: any | null) => void;
        updatePharmacy: (medicineId: string, pharmacy: PharmacyAvailabilityInfo | null) => void;
        updateQuantity: (medicineId: string, quantity: number) => void;
        updatePackaging: (
            medicineId: string,
            packaging: 'blister' | 'box',
            quantity: number,
        ) => void;
        updateMedicineSelection: (medicineId: string, isSelected: boolean) => void;
        updateNotes: (medicineId: string, notes: string) => void;
        validateSelection: (medicineId: string) => void;
        validateAllSelections: () => void;
        clearSelections: () => void;
        markAsSaved: () => void;
        resetState: () => void;
        canProceedToCheckout: () => boolean;
        transformServerMedicine: (serverMedicine: any) => PrescriptionMedicine;
        transformPharmacyStock: (stock: PharmacyStock, medicinePrice: number) => PharmacyAvailabilityInfo;
    };
}

const MedicineSelectionContext = createContext<MedicineSelectionContextType | undefined>(undefined);

// Provider
export function MedicineSelectionProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(medicineSelectionReducer, initialState);

    // Auto-save effect
    useEffect(() => {
        if (state.isDirty && state.prescriptionId) {
            console.log('Medicine selection state changed:', state);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isDirty, state.prescriptionId]);

    const actions = {
        setPrescriptionId: (id: string) => {
            dispatch({ type: 'SET_PRESCRIPTION_ID', payload: id });
        },

        setLoading: (loading: boolean) => {
            dispatch({ type: 'SET_LOADING', payload: loading });
        },

        setError: (error: string | null) => {
            dispatch({ type: 'SET_ERROR', payload: error });
        },

        initializeSelections: (
            medicines: PrescriptionMedicine[],
            prescribedQuantities: Record<string, number> = {},
        ) => {
            dispatch({
                type: 'INITIALIZE_SELECTIONS',
                payload: { medicines, prescribedQuantities },
            });
        },

        updateAlternative: (medicineId: string, alternative: any | null) => {
            dispatch({ type: 'UPDATE_ALTERNATIVE', payload: { medicineId, alternative } });
        },

        updatePharmacy: (medicineId: string, pharmacy: PharmacyAvailabilityInfo | null) => {
            dispatch({ type: 'UPDATE_PHARMACY', payload: { medicineId, pharmacy } });
        },

        updateQuantity: (medicineId: string, quantity: number) => {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { medicineId, quantity } });
        },

        updatePackaging: (medicineId: string, packaging: 'blister' | 'box', quantity: number) => {
            dispatch({ type: 'UPDATE_PACKAGING', payload: { medicineId, packaging, quantity } });
        },

        updateMedicineSelection: (medicineId: string, isSelected: boolean) => {
            dispatch({ type: 'UPDATE_MEDICINE_SELECTION', payload: { medicineId, isSelected } });
        },

        updateNotes: (medicineId: string, notes: string) => {
            dispatch({ type: 'UPDATE_NOTES', payload: { medicineId, notes } });
        },

        validateSelection: (medicineId: string) => {
            dispatch({ type: 'VALIDATE_SELECTION', payload: { medicineId } });
        },

        validateAllSelections: () => {
            dispatch({ type: 'VALIDATE_ALL_SELECTIONS' });
        },

        clearSelections: () => {
            dispatch({ type: 'CLEAR_SELECTIONS' });
        },

        markAsSaved: () => {
            dispatch({ type: 'MARK_AS_SAVED' });
        },

        resetState: () => {
            dispatch({ type: 'RESET_STATE' });
        },

        canProceedToCheckout: (): boolean => {
            const selectedMedicines = Object.values(state.selections).filter((s) => s.isSelected);
            if (selectedMedicines.length === 0) return false;

            const completedSelectedMedicines = selectedMedicines.filter(
                (s) => s.selectedPharmacy && s.selectedQuantity > 0,
            );

            return completedSelectedMedicines.length === selectedMedicines.length;
        },

        transformServerMedicine,
        transformPharmacyStock,
    };

    return (
        <MedicineSelectionContext.Provider value={{ state, actions }}>
            {children}
        </MedicineSelectionContext.Provider>
    );
}

// Hook
export function useMedicineSelection() {
    const context = useContext(MedicineSelectionContext);
    if (context === undefined) {
        throw new Error('useMedicineSelection must be used within a MedicineSelectionProvider');
    }
    return context;
}