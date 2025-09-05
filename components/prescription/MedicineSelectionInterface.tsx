'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCity } from '@/lib/contexts/CityContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useMedicineSelection, PrescriptionMedicine, PharmacyAvailabilityInfo } from '@/lib/contexts/MedicineSelectionContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { MedicineSelectionCheckoutService } from '@/lib/services/medicineSelectionCheckoutService';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { prescriptionAPIService } from '@/lib/data/prescriptionWorkflow';

interface MedicineSelectionInterfaceProps {
    prescriptionId: string;
}

export default function MedicineSelectionInterface({
    prescriptionId,
}: MedicineSelectionInterfaceProps) {
    // Add custom scrollbar styles
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      .pharmacy-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .pharmacy-scroll::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 3px;
      }
      .pharmacy-scroll::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }
      .pharmacy-scroll::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
    `;
        document.head.appendChild(style);
        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    const router = useRouter();
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');
    const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([]);
    const { selectedCity } = useCity();
    const { addPrescriptionItems, setPrescriptionMetadata } = useCart();
    const { state, actions } = useMedicineSelection();

    // Helper function to translate packaging option
    const translatePackagingOption = (option: any) => {
        const translatedName =
            option.type === 'blister'
                ? tCustomer('medicineSelection.medicine.perBlister')
                : tCustomer('medicineSelection.medicine.perBox');

        let translatedDescription = option.description;
        if (option.type === 'blister') {
            const tabletCount = option.description.match(/(\d+)\s+tablets/)?.[1] || '10';
            translatedDescription = tCustomer(
                'medicineSelection.medicine.tabletsPerBlister',
            ).replace('{count}', tabletCount);
        } else if (option.type === 'box') {
            const blisterMatch = option.description.match(/(\d+)\s+blisters/);
            const tabletMatch = option.description.match(/\((\d+)\s+tablets\)/);
            const blisterCount = blisterMatch?.[1] || '2';
            const tabletCount = tabletMatch?.[1] || '20';
            translatedDescription = tCustomer('medicineSelection.medicine.blistersPerBox')
                .replace('{blisters}', blisterCount)
                .replace('{count}', tabletCount);
        }

        return {
            ...option,
            name: translatedName,
            description: translatedDescription,
        };
    };

    // Helper function to translate medicine instructions
    const translateInstructions = (instructions: string) => {
        if (!instructions) return instructions;
        // Add your translation logic here if needed
        return instructions;
    };

    // Helper function to translate medicine units
    const translateUnit = (unit: string) => {
        if (unit === 'tablets' || unit === 'capsules') {
            return tCustomer('medicineSelection.medicine.tablets');
        } else if (unit === 'capsules') {
            return tCustomer('medicineSelection.medicine.capsules');
        }
        return unit;
    };

    // Helper function to translate medicine forms
    const translateForm = (form: string) => {
        const formLower = form?.toLowerCase();
        if (formLower === 'tablet') {
            return tCustomer('medicineSelection.medicine.forms.tablet');
        } else if (formLower === 'capsule') {
            return tCustomer('medicineSelection.medicine.forms.capsule');
        } else if (formLower === 'syrup') {
            return tCustomer('medicineSelection.medicine.forms.syrup');
        } else if (formLower === 'injection') {
            return tCustomer('medicineSelection.medicine.forms.injection');
        } else if (formLower === 'cream') {
            return tCustomer('medicineSelection.medicine.forms.cream');
        } else if (formLower === 'drops') {
            return tCustomer('medicineSelection.medicine.forms.drops');
        }
        return form;
    };

    // Generate packaging options from medicine data
    const generatePackagingOptions = (medicine: PrescriptionMedicine) => {
        const medicineData = medicine.id;
        const packSize = medicineData.packSize || '';
        const price = parseFloat(medicineData.price) || 0;
        
        // Extract number from pack size (e.g., "21 capsules" -> 21)
        const unitCount = parseInt(packSize.match(/(\d+)/)?.[1] || '1');
        
        return [
            {
                type: 'blister' as const,
                name: 'Per Blister',
                description: `${Math.ceil(unitCount / 2)} ${medicineData.unit} per blister`,
                price: price * 0.6, // Assuming blister is 60% of box price
                unitsPerPackage: Math.ceil(unitCount / 2)
            },
            {
                type: 'box' as const,
                name: 'Per Box',
                description: `${unitCount} ${medicineData.unit} per box`,
                price: price,
                unitsPerPackage: unitCount
            }
        ];
    };

    // Get available pharmacies from medicine's pharmacyStocks - UPDATED to match your exact server data
    const getAvailablePharmacies = (medicine: PrescriptionMedicine): PharmacyAvailabilityInfo[] => {
        const medicineData = medicine.id;
        if (!medicineData.pharmacyStocks || !Array.isArray(medicineData.pharmacyStocks)) {
            return [];
        }
        
        const filteredPharmacies = medicineData.pharmacyStocks
            .filter((stock: any) => stock.inStock && stock.stockQuantity > 0) // Only show pharmacies with stock
            .map((stock: any) => {
                const pharmacyPrice = parseFloat(stock.price) || 0;
                const deliveryFee = parseFloat(stock.deliveryFee) || 0;
                
                return {
                    pharmacyId: stock.providerId || `pharmacy-${Math.random().toString(36).substr(2, 9)}`,
                    pharmacyName: stock.providerName || `Pharmacy ${stock.providerId}`,
                    distance: Math.random() * 10 + 1, // Random distance between 1-11 km since your data doesn't include distance
                    packagingPrices: {
                        blister: pharmacyPrice * 0.6, // 60% of box price for blister
                        box: pharmacyPrice,
                    },
                    stockInfo: {
                        stockQuantity: stock.stockQuantity || 0,
                        price: pharmacyPrice,
                        originalPrice: stock.originalPrice || pharmacyPrice,
                        discount: stock.discount || 0,
                        stockLevel: stock.stockLevel || 'in-stock',
                    },
                    deliveryInfo: {
                        deliveryFee: deliveryFee,
                        deliveryTime: stock.deliveryTime || '30-45 min',
                        deliveryAvailable: stock.deliveryAvailable !== false,
                    },
                    isOpen: stock.inStock !== false,
                    deliveryFee: deliveryFee,
                    stock: stock.stockQuantity || 0,
                    availability: stock.stockLevel || (stock.inStock ? 'in-stock' : 'out-of-stock'),
                    lastUpdated: stock.lastUpdated,
                    
                    // Additional pharmacy info for better display
                    providerType: stock.providerType || 'pharmacy'
                };
            });
        
        return filteredPharmacies;
    };

    // Get the correct medicine ID
    const getMedicineId = (medicine: any) => {
        const id = medicine.id._id;
        return String(id); // Explicitly convert to string
    };

    // Handle alternative selection
    

    useEffect(() => {
        actions.setPrescriptionId(prescriptionId);
        loadPrescriptionMedicines();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prescriptionId]);

    const loadPrescriptionMedicines = async () => {
        try {
            actions.setLoading(true);
            actions.setError(null);
            
            // Ensure the API service has the current auth token
            prescriptionAPIService.ensureAuthToken();
            
            const response = await prescriptionAPIService.getPrescriptionById(prescriptionId);

            // Extract prescription data from the response
            const prescriptionData = response?.data || response;

            // Extract medications from the response - using your exact data structure
            const medicationsArray = (prescriptionData as any)?.medications || [];
            
            // Transform server data to match our interface
            const transformedMedicines: PrescriptionMedicine[] = medicationsArray.map((med: any) => 
                actions.transformServerMedicine(med)
            );
            
            setMedicines(transformedMedicines);
            
            // Initialize selections for each medicine
            const prescribedQuantities: Record<string, number> = {};
            transformedMedicines.forEach(med => {
                const medicineId = getMedicineId(med);
                prescribedQuantities[medicineId] = med.quantity || 1;
            });
            
            actions.initializeSelections(transformedMedicines, prescribedQuantities);
        } catch (error) {
            console.error('Error loading prescription medicines:', error);
            actions.setError('Failed to load prescription medicines');
        } finally {
            actions.setLoading(false);
        }
    };

    const handleQuantityChange = (medicineId: string, quantity: number) => {
        const safeId = String(medicineId).trim();
        actions.updateQuantity(safeId, quantity);
    };
    
    const handlePackagingChange = (medicineId: string, packaging: any, quantity: number) => {
        const safeId = String(medicineId).trim();
        actions.updatePackaging(safeId, packaging, quantity);
    };
    
    const handleAlternativeSelect = (medicineId: string, alternative: any) => {
        const safeId = String(medicineId).trim();
        actions.updateAlternative(safeId, alternative);
    };

    const handlePharmacySelect = (medicineId: string, pharmacyId: string) => {
        const safeId = String(medicineId).trim(); // Ensure string preservation
        const medicine = medicines.find(m => String(m.id._id).trim() === safeId);
        if (!medicine) return;
    
        const availablePharmacies = getAvailablePharmacies(medicine);
        const pharmacy = availablePharmacies.find((p) => p.pharmacyId === pharmacyId);
        actions.updatePharmacy(safeId, pharmacy || null);
    };

    const handleProceedToCheckout = async () => {
        try {
            // Get auth token for API calls
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
            
            // Create basic delivery address - this can be improved later
            const deliveryAddress = {
                address: 'Default Address', // This should come from user preferences
                cityId: selectedCity?.id || '1',
                cityName: (selectedCity as any)?.name || 'Default City'
            };
            
            const result = await MedicineSelectionCheckoutService.processSelectionToCheckout(
                state?.selections,
                prescriptionId,
                token,
                deliveryAddress,
                () => {
                    router.push(MedicineSelectionCheckoutService.getCheckoutUrl(prescriptionId));
                },
            );

            if (!result.success) {
                alert(result.error || 'Failed to process checkout');
                return;
            }
        } catch (error) {
            console.error('Error in checkout process:', error);
            alert('Error processing checkout. Please try again.');
        }
    };

    if (state.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 md:py-20">
                <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-base md:text-lg text-center px-4">
                    {tCustomer('medicineSelection.loadingMedicines')}
                </p>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="text-center py-12 md:py-20 px-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <span className="text-2xl md:text-3xl">❌</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                    {tCustomer('medicineSelection.errors.loadingMedicinesError')}
                </h3>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                    {state.error}
                </p>
                <button
                    onClick={loadPrescriptionMedicines}
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 text-sm md:text-base"
                >
                    {tCustomer('medicineSelection.tryAgain')}
                </button>
            </div>
        );
    }

    if (!medicines || medicines.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No medicines found in prescription</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            {/* All Medicines List */}
            <div className="space-y-4 md:space-y-6">
                {medicines.map((medicine, index) => {
                    const medicineId = getMedicineId(medicine);
                    const medicineData = medicine.id;
                    const selection = state?.selections[medicineId];
                    
                    if (!selection) {
                        return null;
                    }

                    const availablePharmacies = getAvailablePharmacies(medicine);
                    const packagingOptions = generatePackagingOptions(medicine);
                    const isCompleted = selection.selectedPharmacy && selection.selectedQuantity > 0;

                    return (
                        <div
                            key={medicineId}
                            className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
                                isCompleted
                                    ? 'border-green-200 ring-2 ring-green-100'
                                    : 'border-gray-100 hover:shadow-md'
                            }`}
                        >
                            {/* Mobile-First Layout: Stack on mobile, side-by-side on desktop */}
                            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                {/* Left Column - Medicine Header + Packaging + Alternatives */}
                                <div className="space-y-4 md:space-y-6">
                                    {/* Medicine Header - Mobile Optimized */}
                                    <div className="bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 p-4 md:p-6 rounded-xl">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selection.isSelected !== false}
                                                onChange={(e) => {
                                                    actions.updateMedicineSelection(
                                                        medicineId,
                                                        e.target.checked,
                                                    );
                                                }}
                                                className="w-5 h-5 text-[#1F1F6F] border-2 border-gray-300 rounded focus:ring-[#1F1F6F] focus:ring-2 mt-1 flex-shrink-0"
                                            />

                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {medicineData.image || (medicine as any).image ? (
                                                    <img
                                                        src={medicineData.image || (medicine as any).image}
                                                        alt={medicine.name || medicineData.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.currentTarget as HTMLElement;
                                                            const sibling = target.nextElementSibling as HTMLElement;
                                                            target.style.display = 'none';
                                                            if (sibling) sibling.style.display = 'block';
                                                        }}
                                                    />
                                                ) : null}
                                                <span 
                                                    className="text-xl md:text-2xl"
                                                    style={{ display: (medicineData.image || (medicine as any).image) ? 'none' : 'block' }}
                                                >
                                                    💊
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                                                        {medicine.name || medicineData.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {isCompleted && selection.isSelected !== false && (
                                                            <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 text-xs md:text-sm font-medium rounded-full whitespace-nowrap">
                                                                ✓ {tCustomer('medicineSelection.medicine.selected')}
                                                            </span>
                                                        )}
                                                        {selection.isSelected === false && (
                                                            <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 text-xs md:text-sm font-medium rounded-full whitespace-nowrap">
                                                                {tCustomer('medicineSelection.medicine.skipped')}
                                                            </span>
                                                        )}
                                                        {selection.selectedAlternative && (
                                                            <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 text-xs md:text-sm font-medium rounded-full whitespace-nowrap">
                                                                {tCustomer('medicineSelection.medicine.alternativeSelected')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                                                    <div>
                                                        <span className="text-gray-500">
                                                            {tCustomer('medicineSelection.medicine.strength')}
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {medicineData.strength}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">
                                                            {tCustomer('medicineSelection.medicine.form')}
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {translateForm(medicineData.form)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">
                                                            {tCustomer('medicineSelection.medicine.prescribed')}
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {medicine.quantity} {translateUnit(medicineData.unit)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Additional Medicine Details */}
                                                <div className="mt-3 space-y-1 text-xs text-gray-600">
                                                    {medicineData.manufacturer && (
                                                        <div>
                                                            <span className="text-gray-500">Manufacturer:</span>
                                                            <span className="ml-2 font-medium">{medicineData.manufacturer}</span>
                                                        </div>
                                                    )}
                                                    {medicineData.activeIngredient && (
                                                        <div>
                                                            <span className="text-gray-500">Active Ingredient:</span>
                                                            <span className="ml-2 font-medium">{medicineData.activeIngredient}</span>
                                                        </div>
                                                    )}
                                                    {medicineData.dosage && (
                                                        <div>
                                                            <span className="text-gray-500">Dosage:</span>
                                                            <span className="ml-2 font-medium">{medicineData.dosage}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Packaging Selection - Mobile Optimized */}
                                    <div className={selection.isSelected === false ? 'opacity-50 pointer-events-none' : ''}>
                                        <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                                            {tCustomer('medicineSelection.medicine.selectPackaging')}
                                        </h4>
                                        {/* Packaging Options */}
                                        <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                                            {packagingOptions.map((option) => {
                                                const translatedOption = translatePackagingOption(option);
                                                const pharmacyPrice = selection.selectedPharmacy?.packagingPrices?.[option.type] || option.price;
                                                return (
                                                    <div 
                                                        key={option.type}
                                                        className={`border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all ${
                                                            selection.selectedPackaging === option.type ? 'border-[#1F1F6F] bg-[#1F1F6F]/5' : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                        onClick={() => {
                                                            if (selection.isSelected !== false) {
                                                                handlePackagingChange(
                                                                    medicineId,
                                                                    option.type,
                                                                    selection.packagingQuantity,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                                                        selection.selectedPackaging === option.type ? 'border-[#1F1F6F] bg-[#1F1F6F]' : 'border-gray-300'
                                                                    }`}>
                                                                        {selection.selectedPackaging === option.type && (
                                                                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-sm md:text-base font-semibold text-gray-900">
                                                                        {translatedOption.name}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs md:text-sm text-gray-600 ml-6">
                                                                    {translatedOption.description}
                                                                </p>
                                                            </div>
                                                            <div className="text-right md:text-right">
                                                                <div className="text-base md:text-lg font-bold text-gray-900">
                                                                    EGP {pharmacyPrice.toFixed(2)} {tCustomer('medicineSelection.medicine.per')} {option.type}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Alternatives Section - Updated to match your server data */}
                                    {(medicineData.genericAlternatives?.length > 0 || medicineData.brandAlternatives?.length > 0 || medicineData.strengthAlternatives?.length > 0) && (
                                        <div className={selection.isSelected === false ? 'opacity-50 pointer-events-none' : ''}>
                                            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                                                {tCustomer('medicineSelection.medicine.genericAlternatives.title')}
                                            </h4>
                                            <div className="space-y-2 md:space-y-3">
                                                {/* Original Medicine Option */}
                                                <div
                                                    key={medicineId}
                                                    className={`border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all ${
                                                        !selection.selectedAlternative
                                                            ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => handleAlternativeSelect(medicineId, null)}
                                                >
                                                    <div className="flex items-start gap-3 md:gap-4">
                                                        <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                                                            !selection.selectedAlternative
                                                                ? 'border-[#1F1F6F] bg-[#1F1F6F]'
                                                                : 'border-gray-300'
                                                        }`}>
                                                            {!selection.selectedAlternative && (
                                                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                                                    {medicineData.name}
                                                                </span>
                                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                                    {tCustomer('medicineSelection.medicine.original')}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                                                <span>
                                                                    {tCustomer('medicineSelection.medicine.manufacturer')}:{' '}
                                                                    <span className="font-medium">{medicineData.manufacturer}</span>
                                                                </span>
                                                                <span>
                                                                    {tCustomer('medicineSelection.medicine.price')}:{' '}
                                                                    <span className="font-medium">EGP {parseFloat(medicineData.price).toFixed(2)}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Generic Alternatives */}
                                                {medicineData.genericAlternatives?.map((alternative: any) => (
                                                    <div
                                                        key={alternative._id}
                                                        className={`border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all ${
                                                            selection.selectedAlternative?.id === alternative._id
                                                                ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                        onClick={() => handleAlternativeSelect(medicineId, alternative)}
                                                    >
                                                        <div className="flex items-start gap-3 md:gap-4">
                                                            <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                                                                selection.selectedAlternative?.id === alternative._id
                                                                    ? 'border-[#1F1F6F] bg-[#1F1F6F]'
                                                                    : 'border-gray-300'
                                                            }`}>
                                                                {selection.selectedAlternative?.id === alternative._id && (
                                                                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm md:text-base font-semibold text-gray-900 block truncate">
                                                                        {alternative.name}
                                                                    </span>
                                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                                                                        Generic
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                                                    <span>
                                                                        {tCustomer('medicineSelection.medicine.manufacturer')}:{' '}
                                                                        <span className="font-medium">{alternative.manufacturer}</span>
                                                                    </span>
                                                                    <span>
                                                                        {tCustomer('medicineSelection.medicine.price')}:{' '}
                                                                        <span className="font-medium">EGP {parseFloat(alternative.price || '0').toFixed(2)}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Brand Alternatives */}
                                                {medicineData.brandAlternatives?.map((alternative: any) => (
                                                    <div
                                                        key={alternative._id}
                                                        className={`border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all ${
                                                            selection.selectedAlternative?.id === alternative._id
                                                                ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                        onClick={() => handleAlternativeSelect(medicineId, alternative)}
                                                    >
                                                        <div className="flex items-start gap-3 md:gap-4">
                                                            <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                                                                selection.selectedAlternative?.id === alternative._id
                                                                    ? 'border-[#1F1F6F] bg-[#1F1F6F]'
                                                                    : 'border-gray-300'
                                                            }`}>
                                                                {selection.selectedAlternative?.id === alternative._id && (
                                                                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm md:text-base font-semibold text-gray-900 block truncate">
                                                                        {alternative.name}
                                                                    </span>
                                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                                                                        Brand
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                                                    <span>
                                                                        {tCustomer('medicineSelection.medicine.manufacturer')}:{' '}
                                                                        <span className="font-medium">{alternative.manufacturer}</span>
                                                                    </span>
                                                                    <span>
                                                                        {tCustomer('medicineSelection.medicine.price')}:{' '}
                                                                        <span className="font-medium">EGP {parseFloat(alternative.price || '0').toFixed(2)}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Strength Alternatives */}
                                                {medicineData.strengthAlternatives?.map((alternative: any) => (
                                                    <div
                                                        key={alternative._id}
                                                        className={`border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all ${
                                                            selection.selectedAlternative?.id === alternative._id
                                                                ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                        onClick={() => handleAlternativeSelect(medicineId, alternative)}
                                                    >
                                                        <div className="flex items-start gap-3 md:gap-4">
                                                            <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                                                                selection.selectedAlternative?.id === alternative._id
                                                                    ? 'border-[#1F1F6F] bg-[#1F1F6F]'
                                                                    : 'border-gray-300'
                                                            }`}>
                                                                {selection.selectedAlternative?.id === alternative._id && (
                                                                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm md:text-base font-semibold text-gray-900 block truncate">
                                                                        {alternative.name}
                                                                    </span>
                                                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                                                                        Different Strength
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                                                    <span>
                                                                        Strength: <span className="font-medium">{alternative.strength}</span>
                                                                    </span>
                                                                    <span>
                                                                        {tCustomer('medicineSelection.medicine.manufacturer')}:{' '}
                                                                        <span className="font-medium">{alternative.manufacturer}</span>
                                                                    </span>
                                                                    <span>
                                                                        {tCustomer('medicineSelection.medicine.price')}:{' '}
                                                                        <span className="font-medium">EGP {parseFloat(alternative.price || '0').toFixed(2)}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Pharmacy Availability */}
                                <div className="space-y-4">
                                    <h4 className="text-base md:text-lg font-semibold text-gray-900">
                                        {tCustomer('medicineSelection.medicine.selectPharmacy')}
                                    </h4>
                                    <div className={`flex flex-col space-y-3 p-4 md:p-6 bg-gray-50 rounded-xl max-h-96 overflow-y-auto pharmacy-scroll transition-all duration-300 ${
                                        selection.isSelected === false ? 'opacity-50 pointer-events-none' : ''
                                    }`}>
                                        {availablePharmacies.length > 0 ? (
                                            availablePharmacies.map((pharmacy) => (
                                                <div
                                                    key={pharmacy.pharmacyId}
                                                    onClick={() => handlePharmacySelect(medicineId, pharmacy.pharmacyId)}
                                                    className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                                        selection.selectedPharmacy?.pharmacyId === pharmacy.pharmacyId
                                                            ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                            : 'border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                                                                    selection.selectedPharmacy?.pharmacyId === pharmacy.pharmacyId ? 'border-[#1F1F6F] bg-[#1F1F6F]' : 'border-gray-300'
                                                                }`}>
                                                                    {selection.selectedPharmacy?.pharmacyId === pharmacy.pharmacyId && (
                                                                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                    )}
                                                                </div>
                                                                <span className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                                                    {pharmacy.pharmacyName}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 ml-6 mt-1 flex items-center gap-2">
                                                                <span>{tCustomer('medicineSelection.distance')} {pharmacy.distance.toFixed(1)} km</span>
                                                                <span>Stock: {pharmacy.stock}</span>
                                                                {pharmacy.stock < 10 && (
                                                                    <span className="px-2 py-0.5 text-xs text-orange-700 bg-orange-100 rounded-full">
                                                                        {tCustomer('medicineSelection.lowStock')}
                                                                    </span>
                                                                )}
                                                                {pharmacy.isOpen && (
                                                                    <span className="px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full">
                                                                        Open
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <span className="text-sm md:text-base font-bold text-gray-900">
                                                                EGP {pharmacy.packagingPrices.box.toFixed(2)}
                                                            </span>
                                                            <div className="text-xs text-gray-500">per box</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <span className="text-gray-400 text-xl">🏪</span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {tCustomer('medicineSelection.noPharmaciesAvailable')}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    No pharmacies have this medicine in stock
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex items-center justify-between text-xs md:text-sm text-gray-600 border-t border-gray-200 pt-4 mt-4 ${
                                        selection.isSelected === false ? 'opacity-50 pointer-events-none' : ''
                                    }`}>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                                                i
                                            </div>
                                            <span>
                                                {tCustomer('medicineSelection.info.pricesAreEstimates')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity and Notes Section */}
                            <div className={`px-4 pb-4 md:px-6 md:pb-6 space-y-4 ${
                                selection.isSelected === false ? 'opacity-50 pointer-events-none' : ''
                            }`}>
                                <div className="border-t border-gray-200 pt-4 md:pt-6">
                                    <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                                        {tCustomer('medicineSelection.medicine.quantityAndNotes')}
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <label
                                            className="text-gray-600 whitespace-nowrap"
                                            htmlFor={`quantity-${medicineId}`}
                                        >
                                            {tCustomer('medicineSelection.medicine.quantity')}:
                                        </label>
                                        <input
                                            type="number"
                                            id={`quantity-${medicineId}`}
                                            value={selection.selectedQuantity}
                                            onChange={(e) => {
                                                const newQuantity = parseInt(e.target.value, 10);
                                                handleQuantityChange(medicineId, newQuantity);
                                            }}
                                            min="1"
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F1F6F] transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Checkout Summary - Fixed bottom on mobile, static on desktop */}
            <div className="fixed bottom-0 left-0 right-0 md:static bg-white md:bg-transparent shadow-t-lg md:shadow-none z-50 p-4 md:p-0 border-t md:border-t-0 border-gray-200 transition-transform duration-300">
                {Object.keys(state?.selections).length > 0 &&
                    Object.values(state?.selections).some((s) => s.isSelected) ? (
                    <>
                        {/* Summary Block - Desktop Only */}
                        <div className="hidden md:block bg-gray-50 rounded-xl p-6 mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {tCustomer('medicineSelection.checkout.orderSummary')}
                            </h3>
                            <div className="space-y-3">
                                {/* Medicine List */}
                                <div className="space-y-2">
                                    {Object.values(state?.selections)
                                        .filter((s) => s.isSelected && s.selectedPharmacy)
                                        .map((selection) => (
                                            <div
                                                key={selection.medicineId}
                                                className="flex items-center justify-between text-sm text-gray-700"
                                            >
                                                <span>
                                                    {selection.selectedQuantity}x{' '}
                                                    {selection.selectedMedicine.name || selection.selectedMedicine.id.name}
                                                </span>
                                                <span className="font-semibold">
                                                    EGP{' '}
                                                    {(selection.selectedPharmacy!.packagingPrices[selection.selectedPackaging] * selection.packagingQuantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                <div className="border-t border-dashed border-gray-300 pt-3">
                                    <div className="flex items-center justify-between font-semibold text-gray-800">
                                        <span>{tCustomer('medicineSelection.checkout.totalPrice')}</span>
                                        <span>EGP {state.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:px-0">
                            <button
                                onClick={handleProceedToCheckout}
                                disabled={!actions.canProceedToCheckout()}
                                className={`w-full py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                                    actions.canProceedToCheckout()
                                        ? 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white hover:from-[#14274E] hover:to-[#394867]'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {actions.canProceedToCheckout()
                                    ? tCustomer('medicineSelection.checkout.completeOrder')
                                    : tCustomer('medicineSelection.checkout.completeSelections')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-6 md:py-8 text-gray-500">
                        <p className="text-sm md:text-lg">
                            {tCustomer('medicineSelection.checkout.selectToSeeOrder')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}