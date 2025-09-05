import { Product } from '@/lib/data/products';
import {
    ExtendedMedicine,
    MedicineAlternative,
    PharmacyStock,
    extendedMedicineData,
} from '@/lib/data/medicineData';

/**
 * Utility functions to convert between Product and ExtendedMedicine formats
 */
export class MedicineConverter {
    /**
     * Convert Product to ExtendedMedicine format
     */
    static productToMedicine(product: Product): ExtendedMedicine {
        // Extract pharmacy information from product
        const pharmacyStocks: PharmacyStock[] = product.pharmacies.map((pharmacy) => ({
            pharmacyId: pharmacy.id,
            pharmacyName: pharmacy.name,
            inStock: pharmacy.inStock,
            stockLevel: pharmacy.inStock ? 'medium' : 'out',
            stockQuantity: pharmacy.inStock ? 100 : 0,
            price: pharmacy.price,
            lastUpdated: new Date(),
            reorderLevel: 20,
            maxStock: 500,
            supplier: product.manufacturer || 'Unknown',
        }));

        // Calculate pricing information
        const availablePrices = pharmacyStocks.filter((s) => s.inStock).map((s) => s.price);
        const averagePrice =
            availablePrices.length > 0
                ? availablePrices.reduce((sum, price) => sum + price, 0) / availablePrices.length
                : 0;
        const lowestPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : 0;
        const highestPrice = availablePrices.length > 0 ? Math.max(...availablePrices) : 0;
        const availabilityPercentage =
            (pharmacyStocks.filter((s) => s.inStock).length / pharmacyStocks.length) * 100;

        return {
            id: product.id,
            name: product.name,
            activeIngredient: product.name.split(' ')[0], // Simple extraction
            strength: product.name.match(/\d+mg|\d+ml|\d+g/)?.[0] || '',
            form: 'Tablet', // Default form
            manufacturer: product.manufacturer || 'Unknown',
            category: product.category,
            requiresPrescription: product.requiresPrescription || false,
            controlledSubstance: false,
            therapeuticClass: product.category,
            indication: [product.description || 'General use'],
            dosage: 'As directed',
            frequency: 'As needed',
            route: 'Oral',
            instructions: 'Follow package instructions or consult your pharmacist',
            alternatives: [], // Will be populated separately
            pharmacyMapping: {
                medicineId: product.id,
                pharmacyStocks,
                totalPharmacies: pharmacyStocks.length,
                averagePrice,
                lowestPrice,
                highestPrice,
                availabilityPercentage,
                lastPriceUpdate: new Date(),
            },
            image: product.image,
            description: product.description,
            packSize: 1,
            unit: 'unit',
            expiryWarningDays: 90,
            keywords: [product.name.toLowerCase()],
            tags: [product.category.toLowerCase()],
            searchTerms: [product.name.toLowerCase()],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            isPopular: product.rating >= 4.0,
            salesRank: Math.floor(Math.random() * 100) + 1,
        };
    }

    /**
     * Convert ExtendedMedicine to Product format for backward compatibility
     */
    static medicineToProduct(medicine: ExtendedMedicine): Product {
        // Convert pharmacy stocks back to pharmacy format
        const pharmacies = medicine.pharmacyMapping.pharmacyStocks.map((stock) => ({
            id: stock.pharmacyId,
            name: stock.pharmacyName,
            price: stock.price,
            inStock: stock.inStock,
            deliveryTime: '30-45 mins', // Default delivery time
            rating: 4.0, // Default rating
        }));

        return {
            id: medicine.id,
            name: medicine.name,
            category: medicine.category,
            price: medicine.pharmacyMapping.lowestPrice,
            originalPrice: medicine.pharmacyMapping.highestPrice,
            image: medicine.image || '/images/placeholder-medicine.jpg',
            rating: 4.0, // Default rating
            reviews: 50, // Default review count
            inStock: medicine.pharmacyMapping.availabilityPercentage > 0,
            requiresPrescription: medicine.requiresPrescription,
            description: medicine.description || '',
            manufacturer: medicine.manufacturer,
            pharmacies,
        };
    }

    /**
     * Get all medicines in Product format for backward compatibility
     */
    static getAllMedicinesAsProducts(): Product[] {
        return extendedMedicineData.map((medicine) => this.medicineToProduct(medicine));
    }

    /**
     * Search medicines and return in Product format
     */
    static searchMedicinesAsProducts(query: string): Product[] {
        const lowercaseQuery = query.toLowerCase();
        const matchingMedicines = extendedMedicineData.filter(
            (medicine) =>
                medicine.name.toLowerCase().includes(lowercaseQuery) ||
                medicine.genericName?.toLowerCase().includes(lowercaseQuery) ||
                medicine.activeIngredient.toLowerCase().includes(lowercaseQuery) ||
                medicine.keywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery)),
        );

        return matchingMedicines.map((medicine) => this.medicineToProduct(medicine));
    }

    /**
     * Get medicine alternatives in a format suitable for the AlternativeMedicinesList component
     */
    static getMedicineAlternativesForComponent(medicineId: string): Array<{
        id: string;
        name: string;
        genericName?: string;
        strength: string;
        form: string;
        manufacturer: string;
        price: number;
        availability: 'in-stock' | 'low-stock' | 'out-of-stock';
        pharmacyCount: number;
        averagePrice: number;
        priceRange: { min: number; max: number };
        description?: string;
        activeIngredient: string;
        equivalentDose: string;
        image?: string;
        advantages?: string[];
        considerations?: string[];
    }> {
        const medicine = extendedMedicineData.find((m) => m.id === medicineId);
        if (!medicine) return [];

        return medicine.alternatives.map((alt) => ({
            id: alt.id,
            name: alt.name,
            genericName: alt.genericName,
            strength: alt.strength,
            form: alt.form,
            manufacturer: alt.manufacturer,
            price: alt.averagePrice,
            availability: alt.availability,
            pharmacyCount: alt.pharmacyCount,
            averagePrice: alt.averagePrice,
            priceRange: alt.priceRange,
            description: alt.description,
            activeIngredient: alt.activeIngredient,
            equivalentDose: alt.equivalentDose,
            image: alt.image,
            advantages: alt.advantages,
            considerations: alt.considerations,
        }));
    }

    /**
     * Get pharmacy availability in format suitable for components
     */
    static getPharmacyAvailabilityForComponent(medicineId: string): Array<{
        id: string;
        name: string;
        price: number;
        inStock: boolean;
        deliveryTime: string;
        deliveryFee: number;
        rating: number;
        distance: string;
    }> {
        const medicine = extendedMedicineData.find((m) => m.id === medicineId);
        if (!medicine) return [];

        return medicine.pharmacyMapping.pharmacyStocks.map((stock) => ({
            id: stock.pharmacyId,
            name: stock.pharmacyName,
            price: stock.price,
            inStock: stock.inStock,
            deliveryTime: '30-45 mins', // Default - would come from pharmacy data
            deliveryFee: 15.0, // Default - would come from pharmacy data
            rating: 4.0, // Default - would come from pharmacy data
            distance: '2.5 km', // Default - would be calculated based on location
        }));
    }
}
import { Product } from '@/lib/data/products';
import { ExtendedMedicine, MedicineAlternative, PharmacyStock } from '@/lib/data/medicineData';

/**
 * Utility functions to convert between Product and ExtendedMedicine formats
 */
export class MedicineConverter {
    /**
     * Convert Product to ExtendedMedicine format
     */
    static productToMedicine(product: Product): ExtendedMedicine {
        // Extract pharmacy information from product
        const pharmacyStocks: PharmacyStock[] = product.pharmacies.map((pharmacy) => ({
            pharmacyId: pharmacy.id,
            pharmacyName: pharmacy.name,
            inStock: pharmacy.inStock,
            stockLevel: pharmacy.inStock ? 'medium' : 'out',
            stockQuantity: pharmacy.inStock ? 100 : 0,
            price: pharmacy.price,
            lastUpdated: new Date(),
            reorderLevel: 20,
            maxStock: 500,
            supplier: product.manufacturer || 'Unknown',
        }));

        // Calculate pricing information
        const availablePrices = pharmacyStocks.filter((s) => s.inStock).map((s) => s.price);
        const averagePrice =
            availablePrices.length > 0
                ? availablePrices.reduce((sum, price) => sum + price, 0) / availablePrices.length
                : 0;
        const lowestPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : 0;
        const highestPrice = availablePrices.length > 0 ? Math.max(...availablePrices) : 0;
        const availabilityPercentage =
            (pharmacyStocks.filter((s) => s.inStock).length / pharmacyStocks.length) * 100;

        return {
            id: product.id,
            name: product.name,
            activeIngredient: product.name.split(' ')[0], // Simple extraction
            strength: product.name.match(/\d+mg|\d+ml|\d+g/)?.[0] || '',
            form: 'Tablet', // Default form
            manufacturer: product.manufacturer || 'Unknown',
            category: product.category,
            requiresPrescription: product.requiresPrescription || false,
            controlledSubstance: false,
            therapeuticClass: product.category,
            indication: [product.description || 'General use'],
            dosage: 'As directed',
            frequency: 'As needed',
            route: 'Oral',
            instructions: 'Follow package instructions or consult your pharmacist',
            alternatives: [], // Will be populated separately
            pharmacyMapping: {
                medicineId: product.id,
                pharmacyStocks,
                totalPharmacies: pharmacyStocks.length,
                averagePrice,
                lowestPrice,
                highestPrice,
                availabilityPercentage,
                lastPriceUpdate: new Date(),
            },
            image: product.image,
            description: product.description,
            packSize: 1,
            unit: 'unit',
            expiryWarningDays: 90,
            keywords: [product.name.toLowerCase()],
            tags: [product.category.toLowerCase()],
            searchTerms: [product.name.toLowerCase()],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            isPopular: product.rating >= 4.0,
            salesRank: Math.floor(Math.random() * 100) + 1,
        };
    }

    /**
     * Convert ExtendedMedicine to Product format for backward compatibility
     */
    static medicineToProduct(medicine: ExtendedMedicine): Product {
        // Convert pharmacy stocks back to pharmacy format
        const pharmacies = medicine.pharmacyMapping.pharmacyStocks.map((stock) => ({
            id: stock.pharmacyId,
            name: stock.pharmacyName,
            price: stock.price,
            inStock: stock.inStock,
            deliveryTime: '30-45 mins', // Default delivery time
            rating: 4.0, // Default rating
        }));

        return {
            id: medicine.id,
            name: medicine.name,
            category: medicine.category,
            price: medicine.pharmacyMapping.lowestPrice,
            originalPrice: medicine.pharmacyMapping.highestPrice,
            image: medicine.image || '/images/placeholder-medicine.jpg',
            rating: 4.0, // Default rating
            reviews: 50, // Default review count
            inStock: medicine.pharmacyMapping.availabilityPercentage > 0,
            requiresPrescription: medicine.requiresPrescription,
            description: medicine.description || '',
            manufacturer: medicine.manufacturer,
            pharmacies,
        };
    }

    /**
     * Get all medicines in Product format for backward compatibility
     */
    static getAllMedicinesAsProducts(): Product[] {
        return extendedMedicineData.map((medicine) => this.medicineToProduct(medicine));
    }

    /**
     * Search medicines and return in Product format
     */
    static searchMedicinesAsProducts(query: string): Product[] {
        const lowercaseQuery = query.toLowerCase();
        const matchingMedicines = extendedMedicineData.filter(
            (medicine) =>
                medicine.name.toLowerCase().includes(lowercaseQuery) ||
                medicine.genericName?.toLowerCase().includes(lowercaseQuery) ||
                medicine.activeIngredient.toLowerCase().includes(lowercaseQuery) ||
                medicine.keywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery)),
        );

        return matchingMedicines.map((medicine) => this.medicineToProduct(medicine));
    }

    /**
     * Get medicine alternatives in a format suitable for the AlternativeMedicinesList component
     */
    static getMedicineAlternativesForComponent(medicineId: string): Array<{
        id: string;
        name: string;
        genericName?: string;
        strength: string;
        form: string;
        manufacturer: string;
        price: number;
        availability: 'in-stock' | 'low-stock' | 'out-of-stock';
        pharmacyCount: number;
        averagePrice: number;
        priceRange: { min: number; max: number };
        description?: string;
        activeIngredient: string;
        equivalentDose: string;
        image?: string;
        advantages?: string[];
        considerations?: string[];
    }> {
        const medicine = extendedMedicineData.find((m) => m.id === medicineId);
        if (!medicine) return [];

        return medicine.alternatives.map((alt) => ({
            id: alt.id,
            name: alt.name,
            genericName: alt.genericName,
            strength: alt.strength,
            form: alt.form,
            manufacturer: alt.manufacturer,
            price: alt.averagePrice,
            availability: alt.availability,
            pharmacyCount: alt.pharmacyCount,
            averagePrice: alt.averagePrice,
            priceRange: alt.priceRange,
            description: alt.description,
            activeIngredient: alt.activeIngredient,
            equivalentDose: alt.equivalentDose,
            image: alt.image,
            advantages: alt.advantages,
            considerations: alt.considerations,
        }));
    }

    /**
     * Get pharmacy availability in format suitable for components
     */
    static getPharmacyAvailabilityForComponent(medicineId: string): Array<{
        id: string;
        name: string;
        price: number;
        inStock: boolean;
        deliveryTime: string;
        deliveryFee: number;
        rating: number;
        distance: string;
    }> {
        const medicine = extendedMedicineData.find((m) => m.id === medicineId);
        if (!medicine) return [];

        return medicine.pharmacyMapping.pharmacyStocks.map((stock) => ({
            id: stock.pharmacyId,
            name: stock.pharmacyName,
            price: stock.price,
            inStock: stock.inStock,
            deliveryTime: '30-45 mins', // Default - would come from pharmacy data
            deliveryFee: 15.0, // Default - would come from pharmacy data
            rating: 4.0, // Default - would come from pharmacy data
            distance: '2.5 km', // Default - would be calculated based on location
        }));
    }
}
