'use client';

import { Product, products } from '@/lib/data/products';
import { NotificationService } from './notificationService';
import { roleBasedAccessService, ProductWithInventory } from './roleBasedAccessService';
import { masterProductDatabase, MasterProduct } from '@/lib/database/masterProductDatabase';

// Inventory item interface
export interface InventoryItem {
    id: string;
    productId: number;
    pharmacyId: string;
    currentStock: number;
    minStockThreshold: number;
    maxStockCapacity: number;
    reorderPoint: number;
    reorderQuantity: number;
    lastRestocked: string;
    nextRestockDate?: string;
    supplier: string;
    supplierContact: string;
    costPrice: number;
    sellingPrice: number;
    expiryDate: string;
    batchNumber: string;
    location: string; // Storage location in pharmacy
    status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'discontinued';
    notes?: string;
    lastUpdated: string;
    updatedBy: string;
}

// Inventory filters
export interface InventoryFilters {
    status?: string[];
    category?: string[];
    searchQuery?: string;
    lowStockOnly?: boolean;
    expiringWithin?: number; // days
    supplier?: string[];
    location?: string[];
    priceRange?: { min: number; max: number };
}

// Inventory statistics
export interface InventoryStats {
    totalItems: number;
    inStockItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    expiringSoonItems: number;
    totalValue: number;
    averageStockLevel: number;
    reorderRequiredItems: number;
    discontinuedItems: number;
}

// Stock movement record
export interface StockMovement {
    id: string;
    inventoryItemId: string;
    type: 'restock' | 'sale' | 'adjustment' | 'expired' | 'damaged' | 'returned';
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    reference?: string; // Order ID, supplier invoice, etc.
    timestamp: string;
    performedBy: string;
    notes?: string;
}

// Generate mock inventory data using role-based access
const generateInventoryData = (pharmacyId: string): InventoryItem[] => {
    // Get products that pharmacies can sell using role-based access
    const pharmacyProducts = roleBasedAccessService.getProductsForPharmacy({
        businessId: pharmacyId,
    });

    const suppliers = [
        'Egyptian Pharmaceutical Company',
        'Cairo Medical Supplies',
        'Alexandria Pharma',
        'Delta Medical Distribution',
        'Nile Valley Pharmaceuticals',
    ];

    const locations = [
        'Shelf A1',
        'Shelf A2',
        'Shelf B1',
        'Shelf B2',
        'Shelf C1',
        'Shelf C2',
        'Refrigerator 1',
        'Refrigerator 2',
        'Storage Room',
        'Counter Display',
    ];

    return pharmacyProducts.map((product, index) => {
        const currentStock = Math.floor(Math.random() * 200) + 10;
        const minThreshold = Math.floor(Math.random() * 20) + 5;
        const maxCapacity = Math.floor(Math.random() * 300) + 100;
        const reorderPoint = minThreshold + Math.floor(Math.random() * 10) + 5;
        const reorderQuantity = Math.floor(Math.random() * 100) + 50;
        const costPrice = (product.price || 25) * (0.6 + Math.random() * 0.2); // 60-80% of selling price

        let status: InventoryItem['status'] = 'in-stock';
        if (currentStock === 0) status = 'out-of-stock';
        else if (currentStock <= minThreshold) status = 'low-stock';

        const lastRestocked = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const expiryDate = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000);

        return {
            id: `inv_${pharmacyId}_${product.id}`,
            productId: product.id,
            pharmacyId,
            currentStock,
            minStockThreshold: minThreshold,
            maxStockCapacity: maxCapacity,
            reorderPoint,
            reorderQuantity,
            lastRestocked: lastRestocked.toISOString(),
            nextRestockDate:
                status === 'low-stock' || status === 'out-of-stock'
                    ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
                    : undefined,
            supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
            supplierContact: `+20 1${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
            costPrice: Math.round(costPrice * 100) / 100,
            sellingPrice: product.price || 25,
            expiryDate: expiryDate.toISOString().split('T')[0],
            batchNumber: `BATCH${Date.now()}${Math.floor(Math.random() * 1000)}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            status,
            notes: Math.random() > 0.8 ? 'Special storage requirements' : undefined,
            lastUpdated: new Date().toISOString(),
            updatedBy: 'pharmacy_staff',
        };
    });
};

// Generate mock stock movements
const generateStockMovements = (inventoryItems: InventoryItem[]): StockMovement[] => {
    const movements: StockMovement[] = [];
    const types: StockMovement['type'][] = [
        'restock',
        'sale',
        'adjustment',
        'expired',
        'damaged',
        'returned',
    ];

    inventoryItems.forEach((item) => {
        // Generate 3-10 movements per item
        const movementCount = Math.floor(Math.random() * 8) + 3;
        let currentStock = item.currentStock;

        for (let i = 0; i < movementCount; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            let quantity: number;
            let reason: string;

            switch (type) {
                case 'restock':
                    quantity = Math.floor(Math.random() * 100) + 20;
                    reason = 'Regular restock from supplier';
                    break;
                case 'sale':
                    quantity = -(Math.floor(Math.random() * 10) + 1);
                    reason = 'Customer purchase';
                    break;
                case 'adjustment':
                    quantity = Math.floor(Math.random() * 20) - 10;
                    reason = 'Inventory count adjustment';
                    break;
                case 'expired':
                    quantity = -(Math.floor(Math.random() * 5) + 1);
                    reason = 'Expired products removed';
                    break;
                case 'damaged':
                    quantity = -(Math.floor(Math.random() * 3) + 1);
                    reason = 'Damaged products removed';
                    break;
                case 'returned':
                    quantity = Math.floor(Math.random() * 5) + 1;
                    reason = 'Customer return';
                    break;
                default:
                    quantity = 0;
                    reason = 'Unknown';
            }

            const previousStock = currentStock;
            currentStock = Math.max(0, currentStock + quantity);

            movements.push({
                id: `movement_${item.id}_${i}`,
                inventoryItemId: item.id,
                type,
                quantity: Math.abs(quantity),
                previousStock,
                newStock: currentStock,
                reason,
                reference:
                    type === 'sale'
                        ? `ORDER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
                        : undefined,
                timestamp: timestamp.toISOString(),
                performedBy: 'pharmacy_staff',
                notes: Math.random() > 0.8 ? 'Additional notes' : undefined,
            });
        }
    });

    return movements.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
};

// Pharmacy Inventory Service
class PharmacyInventoryService {
    private inventoryItems: InventoryItem[] = [];
    private stockMovements: StockMovement[] = [];
    private pharmacyId: string;
    private listeners: Map<string, (items: InventoryItem[]) => void> = new Map();

    constructor(pharmacyId: string = 'healthplus-ismailia') {
        this.pharmacyId = pharmacyId;
        this.inventoryItems = generateInventoryData(pharmacyId);
        this.stockMovements = generateStockMovements(this.inventoryItems);
    }

    // Get inventory items with optional filtering
    getInventoryItems(filters?: InventoryFilters): InventoryItem[] {
        let filteredItems = [...this.inventoryItems];

        if (filters) {
            // Status filter
            if (filters.status && filters.status.length > 0) {
                filteredItems = filteredItems.filter((item) =>
                    filters.status!.includes(item.status),
                );
            }

            // Category filter (based on product category)
            if (filters.category && filters.category.length > 0) {
                filteredItems = filteredItems.filter((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    return product && filters.category!.includes(product.category);
                });
            }

            // Search query filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                filteredItems = filteredItems.filter((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    return (
                        product &&
                        (product.name.toLowerCase().includes(query) ||
                            product.nameAr.includes(filters.searchQuery!) ||
                            item.batchNumber.toLowerCase().includes(query) ||
                            item.supplier.toLowerCase().includes(query) ||
                            item.location.toLowerCase().includes(query))
                    );
                });
            }

            // Low stock only filter
            if (filters.lowStockOnly) {
                filteredItems = filteredItems.filter(
                    (item) => item.status === 'low-stock' || item.status === 'out-of-stock',
                );
            }

            // Expiring within filter
            if (filters.expiringWithin) {
                const expiryDate = new Date(
                    Date.now() + filters.expiringWithin * 24 * 60 * 60 * 1000,
                );
                filteredItems = filteredItems.filter(
                    (item) => new Date(item.expiryDate) <= expiryDate,
                );
            }

            // Supplier filter
            if (filters.supplier && filters.supplier.length > 0) {
                filteredItems = filteredItems.filter((item) =>
                    filters.supplier!.includes(item.supplier),
                );
            }

            // Location filter
            if (filters.location && filters.location.length > 0) {
                filteredItems = filteredItems.filter((item) =>
                    filters.location!.includes(item.location),
                );
            }

            // Price range filter
            if (filters.priceRange) {
                filteredItems = filteredItems.filter(
                    (item) =>
                        item.sellingPrice >= filters.priceRange!.min &&
                        item.sellingPrice <= filters.priceRange!.max,
                );
            }
        }

        return filteredItems;
    }

    // Get inventory item by ID
    getInventoryItemById(id: string): InventoryItem | undefined {
        return this.inventoryItems.find((item) => item.id === id);
    }

    // Get inventory statistics
    getInventoryStats(): InventoryStats {
        const totalItems = this.inventoryItems.length;
        const inStockItems = this.inventoryItems.filter(
            (item) => item.status === 'in-stock',
        ).length;
        const lowStockItems = this.inventoryItems.filter(
            (item) => item.status === 'low-stock',
        ).length;
        const outOfStockItems = this.inventoryItems.filter(
            (item) => item.status === 'out-of-stock',
        ).length;

        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const expiringSoonItems = this.inventoryItems.filter(
            (item) => new Date(item.expiryDate) <= expiryDate && item.status !== 'expired',
        ).length;

        const totalValue = this.inventoryItems.reduce(
            (sum, item) => sum + item.currentStock * item.costPrice,
            0,
        );

        const averageStockLevel =
            totalItems > 0
                ? this.inventoryItems.reduce((sum, item) => sum + item.currentStock, 0) / totalItems
                : 0;

        const reorderRequiredItems = this.inventoryItems.filter(
            (item) => item.currentStock <= item.reorderPoint,
        ).length;

        const discontinuedItems = this.inventoryItems.filter(
            (item) => item.status === 'discontinued',
        ).length;

        return {
            totalItems,
            inStockItems,
            lowStockItems,
            outOfStockItems,
            expiringSoonItems,
            totalValue,
            averageStockLevel,
            reorderRequiredItems,
            discontinuedItems,
        };
    }

    // Update stock quantity
    async updateStock(
        itemId: string,
        newQuantity: number,
        type: StockMovement['type'],
        reason: string,
        reference?: string,
        notes?: string,
    ): Promise<boolean> {
        const item = this.inventoryItems.find((i) => i.id === itemId);
        if (!item) return false;

        const previousStock = item.currentStock;
        const quantityChange = newQuantity - previousStock;

        // Update item
        item.currentStock = Math.max(0, newQuantity);
        item.lastUpdated = new Date().toISOString();
        item.updatedBy = 'pharmacy_staff';

        // Update status based on new quantity
        if (item.currentStock === 0) {
            item.status = 'out-of-stock';
        } else if (item.currentStock <= item.minStockThreshold) {
            item.status = 'low-stock';
        } else {
            item.status = 'in-stock';
        }

        // Create stock movement record
        const movement: StockMovement = {
            id: `movement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            inventoryItemId: itemId,
            type,
            quantity: Math.abs(quantityChange),
            previousStock,
            newStock: item.currentStock,
            reason,
            reference,
            timestamp: new Date().toISOString(),
            performedBy: 'pharmacy_staff',
            notes,
        };

        this.stockMovements.unshift(movement);
        this.notifyListeners();

        // Create low stock notification if needed
        if (item.status === 'low-stock' || item.status === 'out-of-stock') {
            const product = products.find((p) => p.id === item.productId);
            if (product) {
                await NotificationService.createNotification({
                    userId: this.pharmacyId,
                    userRole: 'pharmacy',
                    type: 'inventory',
                    priority: item.status === 'out-of-stock' ? 'urgent' : 'high',
                    title:
                        item.status === 'out-of-stock' ? 'Out of Stock Alert' : 'Low Stock Alert',
                    message: `${product.name} is ${item.status === 'out-of-stock' ? 'out of stock' : 'running low'} (${item.currentStock} remaining)`,
                    actionUrl: '/pharmacy/inventory',
                    actionLabel: 'Manage Inventory',
                    isRead: false,
                    isArchived: false,
                    data: { itemId: item.id, productId: item.productId },
                });
            }
        }

        return true;
    }

    // Restock item
    async restockItem(
        itemId: string,
        quantity: number,
        supplier?: string,
        batchNumber?: string,
        expiryDate?: string,
        costPrice?: number,
        notes?: string,
    ): Promise<boolean> {
        const item = this.inventoryItems.find((i) => i.id === itemId);
        if (!item) return false;

        // Update item details if provided
        if (supplier) item.supplier = supplier;
        if (batchNumber) item.batchNumber = batchNumber;
        if (expiryDate) item.expiryDate = expiryDate;
        if (costPrice) item.costPrice = costPrice;

        item.lastRestocked = new Date().toISOString();
        item.nextRestockDate = undefined; // Clear next restock date

        return await this.updateStock(
            itemId,
            item.currentStock + quantity,
            'restock',
            'Manual restock',
            undefined,
            notes,
        );
    }

    // Get stock movements for an item
    getStockMovements(itemId?: string, limit?: number): StockMovement[] {
        let movements = [...this.stockMovements];

        if (itemId) {
            movements = movements.filter((m) => m.inventoryItemId === itemId);
        }

        if (limit) {
            movements = movements.slice(0, limit);
        }

        return movements;
    }

    // Get low stock items
    getLowStockItems(): InventoryItem[] {
        return this.inventoryItems.filter(
            (item) => item.status === 'low-stock' || item.status === 'out-of-stock',
        );
    }

    // Get expiring items
    getExpiringItems(withinDays: number = 30): InventoryItem[] {
        const expiryDate = new Date(Date.now() + withinDays * 24 * 60 * 60 * 1000);
        return this.inventoryItems.filter(
            (item) => new Date(item.expiryDate) <= expiryDate && item.status !== 'expired',
        );
    }

    // Get items requiring reorder
    getReorderRequiredItems(): InventoryItem[] {
        return this.inventoryItems.filter((item) => item.currentStock <= item.reorderPoint);
    }

    // Subscribe to inventory updates
    subscribe(callback: (items: InventoryItem[]) => void): () => void {
        const id = Math.random().toString(36).substr(2, 9);
        this.listeners.set(id, callback);

        return () => {
            this.listeners.delete(id);
        };
    }

    // Notify all listeners
    private notifyListeners(): void {
        this.listeners.forEach((callback) => {
            callback([...this.inventoryItems]);
        });
    }

    // Get product details for inventory item (PHARMACY ONLY - includes medicines)
    getProductDetails(productId: number): ProductWithInventory | null {
        return roleBasedAccessService.getProductById(productId, 'pharmacy', this.pharmacyId);
    }

    // Get all available products for pharmacy (ALL products including medicines)
    getAvailableProducts(): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForPharmacy({ businessId: this.pharmacyId });
    }

    // Get products by category for pharmacy (includes medicines if category matches)
    getProductsByCategory(category: string): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForPharmacy({
            businessId: this.pharmacyId,
            category,
        });
    }

    // Check if pharmacy can sell a specific product (pharmacies can sell medicines)
    canSellProduct(productId: number): boolean {
        return roleBasedAccessService.canBusinessSellProduct(this.pharmacyId, productId);
    }

    // Get medicines only (pharmacy exclusive)
    getMedicinesOnly(): ProductWithInventory[] {
        return roleBasedAccessService
            .getProductsForPharmacy({
                businessId: this.pharmacyId,
            })
            .filter((product) => product.type === 'medicine');
    }

    // Get medical supplies only
    getMedicalSuppliesOnly(): ProductWithInventory[] {
        return roleBasedAccessService
            .getProductsForPharmacy({
                businessId: this.pharmacyId,
            })
            .filter((product) => product.type !== 'medicine');
    }

    // Get unique suppliers
    getSuppliers(): string[] {
        return [...new Set(this.inventoryItems.map((item) => item.supplier))];
    }

    // Get unique locations
    getLocations(): string[] {
        return [...new Set(this.inventoryItems.map((item) => item.location))];
    }

    // Get unique categories
    getCategories(): string[] {
        const categories = new Set<string>();
        this.inventoryItems.forEach((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (product) categories.add(product.category);
        });
        return Array.from(categories);
    }
}

// Export singleton instance
export const pharmacyInventoryService = new PharmacyInventoryService();
