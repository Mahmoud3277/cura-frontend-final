// Utility functions for Pharmacy Availability System
// Task 3.2: Create Pharmacy Availability System - Utilities

import { PharmacyStock, StockLevel } from '../data/medicineData';
import { Pharmacy } from '../data/pharmacies';

export interface StockLevelInfo {
    level: StockLevel;
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
    icon: string;
    priority: number;
}

export interface AvailabilityStatus {
    status: 'available' | 'low-stock' | 'out-of-stock';
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
    icon: string;
}

/**
 * Get stock level information with styling and labels
 */
export function getStockLevelInfo(stockLevel: StockLevel): StockLevelInfo {
    const stockLevelMap: Record<StockLevel, StockLevelInfo> = {
        high: {
            level: 'high',
            label: 'High Stock',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            icon: '📦',
            priority: 5,
        },
        medium: {
            level: 'medium',
            label: 'Medium Stock',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            icon: '📋',
            priority: 4,
        },
        low: {
            level: 'low',
            label: 'Low Stock',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            icon: '⚠️',
            priority: 3,
        },
        critical: {
            level: 'critical',
            label: 'Critical Stock',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-800',
            icon: '🚨',
            priority: 2,
        },
        out: {
            level: 'out',
            label: 'Out of Stock',
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            icon: '❌',
            priority: 1,
        },
    };

    return stockLevelMap[stockLevel];
}

/**
 * Get availability status information
 */
export function getAvailabilityStatus(stock: PharmacyStock): AvailabilityStatus {
    if (!stock.inStock || stock.stockQuantity === 0) {
        return {
            status: 'out-of-stock',
            label: 'Out of Stock',
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            icon: '❌',
        };
    }

    if (stock.stockLevel === 'critical' || stock.stockLevel === 'low') {
        return {
            status: 'low-stock',
            label: 'Low Stock',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            icon: '⚠️',
        };
    }

    return {
        status: 'available',
        label: 'Available',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: '✅',
    };
}

/**
 * Calculate stock percentage
 */
export function calculateStockPercentage(stock: PharmacyStock): number {
    if (stock.maxStock === 0) return 0;
    return Math.min((stock.stockQuantity / stock.maxStock) * 100, 100);
}

/**
 * Get stock urgency level
 */
export function getStockUrgency(stock: PharmacyStock): 'urgent' | 'moderate' | 'normal' {
    const percentage = calculateStockPercentage(stock);

    if (percentage <= 10 || stock.stockQuantity <= stock.reorderLevel) {
        return 'urgent';
    }

    if (percentage <= 25 || stock.stockLevel === 'low') {
        return 'moderate';
    }

    return 'normal';
}

/**
 * Format stock quantity display
 */
export function formatStockQuantity(stock: PharmacyStock, unit: string = 'units'): string {
    if (stock.stockQuantity === 0) {
        return 'Out of stock';
    }

    if (stock.stockQuantity === 1) {
        return `1 ${unit.slice(0, -1)}`; // Remove 's' for singular
    }

    return `${stock.stockQuantity} ${unit}`;
}

/**
 * Get estimated restock time in human-readable format
 */
export function formatRestockTime(restockDate: Date): string {
    const now = new Date();
    const diffTime = restockDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return 'Available today';
    }

    if (diffDays === 1) {
        return 'Tomorrow';
    }

    if (diffDays <= 7) {
        return `In ${diffDays} days`;
    }

    return `In ${Math.ceil(diffDays / 7)} week${diffDays > 14 ? 's' : ''}`;
}

/**
 * Calculate delivery cost and time
 */
export function calculateDeliveryInfo(
    pharmacy: Pharmacy,
    orderAmount: number,
): {
    deliveryFee: number;
    deliveryTime: string;
    freeDelivery: boolean;
    minOrderMet: boolean;
} {
    const minOrderMet = orderAmount >= pharmacy.minOrderAmount;
    const freeDelivery = minOrderMet && pharmacy.deliveryFee === 0;

    return {
        deliveryFee: minOrderMet ? pharmacy.deliveryFee : pharmacy.deliveryFee + 5, // Extra fee for small orders
        deliveryTime: pharmacy.deliveryTime,
        freeDelivery,
        minOrderMet,
    };
}

/**
 * Sort pharmacies by best availability and value
 */
export function sortPharmaciesByValue(
    pharmacies: Array<{
        pharmacy: Pharmacy;
        stock: PharmacyStock;
        price: number;
    }>,
): Array<{
    pharmacy: Pharmacy;
    stock: PharmacyStock;
    price: number;
    score: number;
}> {
    return pharmacies
        .map((item) => ({
            ...item,
            score: calculatePharmacyScore(item.pharmacy, item.stock, item.price),
        }))
        .sort((a, b) => b.score - a.score);
}

/**
 * Calculate pharmacy score for ranking
 */
function calculatePharmacyScore(pharmacy: Pharmacy, stock: PharmacyStock, price: number): number {
    let score = 0;

    // Stock availability (40% of score)
    const stockInfo = getStockLevelInfo(stock.stockLevel);
    score += stockInfo.priority * 8; // Max 40 points

    // Pharmacy rating (25% of score)
    score += pharmacy.rating * 5; // Max 25 points (5 stars * 5)

    // Price competitiveness (20% of score) - lower price = higher score
    const maxPrice = 200; // Assume max price for normalization
    const priceScore = Math.max(0, ((maxPrice - price) / maxPrice) * 20);
    score += priceScore;

    // Delivery factors (15% of score)
    const deliveryScore = calculateDeliveryScore(pharmacy);
    score += deliveryScore;

    return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate delivery score component
 */
function calculateDeliveryScore(pharmacy: Pharmacy): number {
    let score = 0;

    // Delivery fee (lower is better)
    if (pharmacy.deliveryFee === 0) {
        score += 5;
    } else if (pharmacy.deliveryFee <= 10) {
        score += 3;
    } else if (pharmacy.deliveryFee <= 20) {
        score += 1;
    }

    // Delivery time (faster is better)
    const deliveryTimeMatch = pharmacy.deliveryTime.match(/(\d+)-(\d+)/);
    if (deliveryTimeMatch) {
        const avgTime = (parseInt(deliveryTimeMatch[1]) + parseInt(deliveryTimeMatch[2])) / 2;
        if (avgTime <= 30) {
            score += 5;
        } else if (avgTime <= 45) {
            score += 3;
        } else if (avgTime <= 60) {
            score += 1;
        }
    }

    // 24-hour availability
    if (pharmacy.workingHours.is24Hours) {
        score += 2;
    }

    // Special features
    if (pharmacy.features.includes('emergency')) {
        score += 1;
    }

    if (pharmacy.features.includes('consultation')) {
        score += 1;
    }

    return Math.min(score, 15); // Cap at 15 points
}

/**
 * Get stock trend indicator
 */
export function getStockTrend(
    currentStock: number,
    previousStock: number,
): 'increasing' | 'decreasing' | 'stable' {
    const difference = currentStock - previousStock;
    const threshold = Math.max(1, previousStock * 0.1); // 10% threshold

    if (difference > threshold) {
        return 'increasing';
    }

    if (difference < -threshold) {
        return 'decreasing';
    }

    return 'stable';
}

/**
 * Generate stock alert message
 */
export function generateStockAlertMessage(
    medicineName: string,
    pharmacyName: string,
    stock: PharmacyStock,
): string {
    const urgency = getStockUrgency(stock);

    if (stock.stockQuantity === 0) {
        return `${medicineName} is out of stock at ${pharmacyName}. Restock needed immediately.`;
    }

    if (urgency === 'urgent') {
        return `Critical: Only ${stock.stockQuantity} units of ${medicineName} left at ${pharmacyName}. Reorder level reached.`;
    }

    if (urgency === 'moderate') {
        return `Warning: Low stock of ${medicineName} at ${pharmacyName}. ${stock.stockQuantity} units remaining.`;
    }

    return `${medicineName} stock level is normal at ${pharmacyName}.`;
}

/**
 * Check if pharmacy is currently open
 */
export function isPharmacyOpen(pharmacy: Pharmacy): boolean {
    if (pharmacy.workingHours.is24Hours) {
        return true;
    }

    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format

    const openTime = parseInt(pharmacy.workingHours.open.replace(':', ''));
    const closeTime = parseInt(pharmacy.workingHours.close.replace(':', ''));

    if (openTime <= closeTime) {
        // Same day (e.g., 08:00 - 22:00)
        return currentTime >= openTime && currentTime <= closeTime;
    } else {
        // Crosses midnight (e.g., 22:00 - 06:00)
        return currentTime >= openTime || currentTime <= closeTime;
    }
}

/**
 * Get next opening time for closed pharmacy
 */
export function getNextOpeningTime(pharmacy: Pharmacy): Date | null {
    if (pharmacy.workingHours.is24Hours || isPharmacyOpen(pharmacy)) {
        return null;
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const openTime = pharmacy.workingHours.open.split(':');
    const nextOpening = new Date(now);
    nextOpening.setHours(parseInt(openTime[0]), parseInt(openTime[1]), 0, 0);

    // If opening time has passed today, set for tomorrow
    if (nextOpening <= now) {
        nextOpening.setDate(nextOpening.getDate() + 1);
    }

    return nextOpening;
}

/**
 * Format pharmacy working hours
 */
export function formatWorkingHours(pharmacy: Pharmacy): string {
    if (pharmacy.workingHours.is24Hours) {
        return '24 Hours';
    }

    return `${pharmacy.workingHours.open} - ${pharmacy.workingHours.close}`;
}
