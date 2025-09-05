import { roleBasedAccessService, ProductWithInventory } from './roleBasedAccessService';
import { masterProductDatabase, MasterProduct } from '@/lib/database/masterProductDatabase';

// Vendor Inventory Service - Comprehensive inventory management for vendors
export interface VendorInventoryItem {
    id: string;
    vendorId: string;
    productName: string;
    productNameAr: string;
    sku: string;
    barcode?: string;
    category: string;
    brand: string;
    description: string;
    descriptionAr: string;
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    reorderPoint: number;
    unitCost: number;
    sellingPrice: number;
    originalPrice?: number;
    discountPrice?: number;
    discountPercentage?: number;
    discountType?: 'percentage' | 'fixed' | 'none';
    discountStartDate?: string;
    discountEndDate?: string;
    supplier: string;
    supplierContact: string;
    batchNumber?: string;
    expiryDate?: string;
    manufacturingDate?: string;
    location: string; // Warehouse location
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
    lastRestocked: string;
    lastSold: string;
    totalSold: number;
    totalValue: number;
    images: string[];
    specifications: {
        [key: string]: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface InventoryMovement {
    id: string;
    vendorId: string;
    productId: string;
    productName: string;
    movementType: 'restock' | 'sale' | 'adjustment' | 'return' | 'damage' | 'expired';
    quantity: number;
    previousStock: number;
    newStock: number;
    unitCost?: number;
    totalValue: number;
    reason: string;
    reference?: string; // Order ID, supplier invoice, etc.
    batchNumber?: string;
    expiryDate?: string;
    performedBy: string;
    notes?: string;
    createdAt: string;
}

export interface InventoryAlert {
    id: string;
    vendorId: string;
    productId: string;
    productName: string;
    alertType: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired' | 'overstock';
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    currentStock: number;
    threshold?: number;
    expiryDate?: string;
    isResolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
    createdAt: string;
}

export interface InventoryStats {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    expiringSoonItems: number;
    expiredItems: number;
    averageStockLevel: number;
    stockTurnoverRate: number;
    topSellingProducts: {
        productId: string;
        productName: string;
        totalSold: number;
        revenue: number;
    }[];
    categoryBreakdown: {
        category: string;
        productCount: number;
        totalValue: number;
        averageStock: number;
    }[];
    supplierBreakdown: {
        supplier: string;
        productCount: number;
        totalValue: number;
    }[];
    monthlyMovements: {
        month: string;
        restocks: number;
        sales: number;
        adjustments: number;
    }[];
}

export interface InventoryFilters {
    category?: string;
    brand?: string;
    supplier?: string;
    status?: string;
    location?: string;
    stockLevel?: 'all' | 'low' | 'out' | 'normal' | 'overstock';
    expiryStatus?: 'all' | 'expiring_soon' | 'expired' | 'valid';
    search?: string;
    sortBy?: 'name' | 'stock' | 'value' | 'lastRestocked' | 'lastSold';
    sortOrder?: 'asc' | 'desc';
}

class VendorInventoryService {
    private generateInventoryFromMasterDatabase(vendorId: string): VendorInventoryItem[] {
        // Get products that vendors can sell using role-based access
        const vendorProducts = roleBasedAccessService.getProductsForVendor({
            businessId: vendorId,
        });

        return vendorProducts.map((product, index) => {
            const currentStock = Math.floor(Math.random() * 1000) + 50;
            const minimumStock = Math.floor(Math.random() * 100) + 20;
            const maximumStock = Math.floor(Math.random() * 2000) + 500;
            const unitCost = (product.price || 10) * 0.7; // 70% of selling price
            const sellingPrice = product.price || 10;

            // Add discount logic - 40% chance of having a discount for better visibility
            const hasDiscount = Math.random() < 0.4;
            let discountData = {};

            if (hasDiscount) {
                const discountPercentage = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
                const discountPrice =
                    Math.round(sellingPrice * (1 - discountPercentage / 100) * 100) / 100;
                // Ensure discount is currently active
                const startDate = new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000); // Started up to 5 days ago
                const endDate = new Date(
                    Date.now() + (Math.random() * 20 + 10) * 24 * 60 * 60 * 1000,
                ); // Ends 10-30 days from now

                discountData = {
                    originalPrice: sellingPrice,
                    discountPrice,
                    discountPercentage,
                    discountType: 'percentage' as const,
                    discountStartDate: startDate.toISOString().split('T')[0],
                    discountEndDate: endDate.toISOString().split('T')[0],
                };
            } else {
                discountData = {
                    discountType: 'none' as const,
                };
            }

            return {
                id: `inv-${vendorId}-${product.id}`,
                vendorId,
                productName: product.name,
                productNameAr: product.nameAr || product.name,
                sku: `VD-${product.id}-${Math.floor(Math.random() * 10000)}`,
                barcode: product.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`,
                category: product.category,
                brand: product.manufacturer,
                description: product.description,
                descriptionAr: product.descriptionAr || product.description,
                currentStock,
                minimumStock,
                maximumStock,
                reorderPoint: minimumStock + Math.floor(Math.random() * 50),
                unitCost: Math.round(unitCost * 100) / 100,
                sellingPrice,
                ...discountData,
                supplier: `${product.manufacturer} Distribution`,
                supplierContact: `+20 ${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
                batchNumber: `BATCH${Date.now()}${Math.floor(Math.random() * 1000)}`,
                expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0],
                manufacturingDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0],
                location: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 20) + 1}`,
                status:
                    currentStock > minimumStock
                        ? 'in_stock'
                        : currentStock > 0
                          ? 'low_stock'
                          : 'out_of_stock',
                lastRestocked: new Date(
                    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                lastSold:
                    Math.random() > 0.3
                        ? new Date(
                              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
                          ).toISOString()
                        : new Date().toISOString(),
                totalSold: Math.floor(Math.random() * 5000),
                totalValue: Math.round(currentStock * unitCost * 100) / 100,
                images: product.images || [product.image || '/images/placeholder.jpg'],
                specifications: {
                    'Active Ingredient': product.activeIngredient,
                    'Pack Size': product.packSize,
                    'Dosage Form': product.form,
                    Storage: 'Store in cool, dry place',
                    Manufacturer: product.manufacturer,
                },
                createdAt: new Date(
                    Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                updatedAt: new Date().toISOString(),
            };
        });
    }

    private inventoryItems: VendorInventoryItem[] = [];

    constructor() {
        // Initialize with products from master database for a default vendor
        this.inventoryItems = this.generateInventoryFromMasterDatabase('vendor-pharmatech');
    }

    // Method to refresh inventory data (useful for testing discount functionality)
    refreshInventoryData(vendorId: string): void {
        // Remove existing items for this vendor
        this.inventoryItems = this.inventoryItems.filter((item) => item.vendorId !== vendorId);
        // Generate fresh data with new discounts
        const newItems = this.generateInventoryFromMasterDatabase(vendorId);
        this.inventoryItems.push(...newItems);
    }

    // Legacy inventory items for backward compatibility
    private legacyInventoryItems: VendorInventoryItem[] = [
        {
            id: 'inv-001',
            vendorId: 'vendor-pharmatech',
            productName: 'Hand Sanitizer 500ml',
            productNameAr: 'معقم اليدين ٥٠٠ مل',
            sku: 'PT-SAN-500-100',
            barcode: '1234567890123',
            category: 'hygiene',
            brand: 'MedClean',
            description: 'Alcohol-based hand sanitizer with 70% ethanol',
            descriptionAr: 'معقم يدين كحولي يحتوي على ٧٠٪ إيثانول',
            currentStock: 2500,
            minimumStock: 500,
            maximumStock: 5000,
            reorderPoint: 750,
            unitCost: 5.25,
            sellingPrice: 8.5,
            supplier: 'Global Hygiene Supplies',
            supplierContact: '+20 2 2555 1234',
            batchNumber: 'PT2024001',
            expiryDate: '2026-12-31',
            manufacturingDate: '2024-01-15',
            location: 'A-01-001',
            status: 'in_stock',
            lastRestocked: '2024-01-15T10:30:00Z',
            lastSold: '2024-01-20T14:20:00Z',
            totalSold: 15000,
            totalValue: 13125.0,
            images: ['/images/products/hand-sanitizer-500ml.jpg'],
            specifications: {
                'Active Ingredient': 'Ethanol 70%',
                'Pack Size': '500ml bottle',
                Form: 'Gel',
                Storage: 'Store below 25°C',
            },
            createdAt: '2023-11-01T08:00:00Z',
            updatedAt: '2024-01-20T14:20:00Z',
        },
        {
            id: 'inv-002',
            vendorId: 'vendor-pharmatech',
            productName: 'Amoxicillin 250mg Capsules',
            productNameAr: 'كبسولات أموكسيسيلين 250 مجم',
            sku: 'PT-AMX-250-50',
            barcode: '1234567890124',
            category: 'Antibiotics',
            brand: 'PharmaTech',
            description: 'Broad-spectrum antibiotic for bacterial infections',
            descriptionAr: 'مضاد حيوي واسع المجال للعدوى البكتيرية',
            currentStock: 150,
            minimumStock: 200,
            maximumStock: 1000,
            reorderPoint: 300,
            unitCost: 1.5,
            sellingPrice: 3.0,
            supplier: 'MediCorp International',
            supplierContact: '+20 2 2666 5678',
            batchNumber: 'MC2024002',
            expiryDate: '2025-06-30',
            manufacturingDate: '2023-12-01',
            location: 'B-02-015',
            status: 'low_stock',
            lastRestocked: '2023-12-15T09:00:00Z',
            lastSold: '2024-01-19T16:45:00Z',
            totalSold: 850,
            totalValue: 225.0,
            images: ['/images/products/amoxicillin-250mg.jpg'],
            specifications: {
                'Active Ingredient': 'Amoxicillin 250mg',
                'Pack Size': '50 capsules',
                'Dosage Form': 'Capsule',
                Storage: 'Store below 25°C, protect from moisture',
            },
            createdAt: '2023-11-01T08:00:00Z',
            updatedAt: '2024-01-19T16:45:00Z',
        },
        {
            id: 'inv-003',
            vendorId: 'vendor-pharmatech',
            productName: 'Vitamin D3 1000 IU Tablets',
            productNameAr: 'أقراص فيتامين د3 1000 وحدة دولية',
            sku: 'PT-VD3-1000-60',
            barcode: '1234567890125',
            category: 'Vitamins',
            brand: 'PharmaTech',
            description: 'Essential vitamin D3 supplement for bone health',
            descriptionAr: 'مكمل فيتامين د3 الأساسي لصحة العظام',
            currentStock: 0,
            minimumStock: 100,
            maximumStock: 500,
            reorderPoint: 150,
            unitCost: 0.75,
            sellingPrice: 1.5,
            supplier: 'Vitamin World Supplies',
            supplierContact: '+20 2 2777 9012',
            batchNumber: 'VW2023003',
            expiryDate: '2025-03-31',
            manufacturingDate: '2023-09-15',
            location: 'C-03-008',
            status: 'out_of_stock',
            lastRestocked: '2023-12-01T11:30:00Z',
            lastSold: '2024-01-18T13:15:00Z',
            totalSold: 500,
            totalValue: 0,
            images: ['/images/products/vitamin-d3-1000iu.jpg'],
            specifications: {
                'Active Ingredient': 'Cholecalciferol (Vitamin D3) 1000 IU',
                'Pack Size': '60 tablets',
                'Dosage Form': 'Tablet',
                Storage: 'Store in a cool, dry place',
            },
            createdAt: '2023-11-01T08:00:00Z',
            updatedAt: '2024-01-18T13:15:00Z',
        },
        {
            id: 'inv-004',
            vendorId: 'vendor-pharmatech',
            productName: 'Omega-3 Fish Oil Capsules',
            productNameAr: 'كبسولات زيت السمك أوميجا 3',
            sku: 'PT-OM3-1000-90',
            barcode: '1234567890126',
            category: 'Supplements',
            brand: 'PharmaTech',
            description: 'High-quality omega-3 fatty acids for heart health',
            descriptionAr: 'أحماض أوميجا 3 الدهنية عالية الجودة لصحة القلب',
            currentStock: 800,
            minimumStock: 200,
            maximumStock: 1200,
            reorderPoint: 300,
            unitCost: 2.25,
            sellingPrice: 4.5,
            supplier: 'Marine Nutrition Ltd',
            supplierContact: '+20 2 2888 3456',
            batchNumber: 'MN2024001',
            expiryDate: '2025-12-31',
            manufacturingDate: '2024-01-10',
            location: 'D-01-012',
            status: 'in_stock',
            lastRestocked: '2024-01-10T14:00:00Z',
            lastSold: '2024-01-20T10:30:00Z',
            totalSold: 400,
            totalValue: 1800.0,
            images: ['/images/products/omega3-fish-oil.jpg'],
            specifications: {
                'Active Ingredient': 'Omega-3 Fatty Acids 1000mg',
                EPA: '300mg',
                DHA: '200mg',
                'Pack Size': '90 capsules',
                'Dosage Form': 'Soft gel capsule',
                Storage: 'Store below 25°C',
            },
            createdAt: '2023-11-01T08:00:00Z',
            updatedAt: '2024-01-20T10:30:00Z',
        },
        {
            id: 'inv-005',
            vendorId: 'vendor-pharmatech',
            productName: 'Ibuprofen 400mg Tablets',
            productNameAr: 'أقراص إيبوبروفين 400 مجم',
            sku: 'PT-IBU-400-30',
            barcode: '1234567890127',
            category: 'Pain Relief',
            brand: 'PharmaTech',
            description: 'Anti-inflammatory pain reliever',
            descriptionAr: 'مسكن للألم مضاد للالتهابات',
            currentStock: 1200,
            minimumStock: 300,
            maximumStock: 2000,
            reorderPoint: 450,
            unitCost: 0.4,
            sellingPrice: 0.8,
            supplier: 'Global Pharma Supplies',
            supplierContact: '+20 2 2555 1234',
            batchNumber: 'GP2024003',
            expiryDate: '2026-08-31',
            manufacturingDate: '2024-01-05',
            location: 'A-02-005',
            status: 'in_stock',
            lastRestocked: '2024-01-05T09:15:00Z',
            lastSold: '2024-01-20T15:45:00Z',
            totalSold: 800,
            totalValue: 480.0,
            images: ['/images/products/ibuprofen-400mg.jpg'],
            specifications: {
                'Active Ingredient': 'Ibuprofen 400mg',
                'Pack Size': '30 tablets',
                'Dosage Form': 'Film-coated tablet',
                Storage: 'Store below 25°C, protect from light',
            },
            createdAt: '2023-11-01T08:00:00Z',
            updatedAt: '2024-01-20T15:45:00Z',
        },
    ];

    private movements: InventoryMovement[] = [
        {
            id: 'mov-001',
            vendorId: 'vendor-pharmatech',
            productId: 'inv-001',
            productName: 'Paracetamol 500mg Tablets',
            movementType: 'restock',
            quantity: 1000,
            previousStock: 1500,
            newStock: 2500,
            unitCost: 0.25,
            totalValue: 250.0,
            reason: 'Regular restock from supplier',
            reference: 'PO-2024-001',
            batchNumber: 'PT2024001',
            expiryDate: '2026-12-31',
            performedBy: 'Ahmed Mansour',
            notes: 'Quality checked and approved',
            createdAt: '2024-01-15T10:30:00Z',
        },
        {
            id: 'mov-002',
            vendorId: 'vendor-pharmatech',
            productId: 'inv-001',
            productName: 'Paracetamol 500mg Tablets',
            movementType: 'sale',
            quantity: -100,
            previousStock: 2500,
            newStock: 2400,
            totalValue: -50.0,
            reason: 'Customer order fulfillment',
            reference: 'ORD-2024-156',
            performedBy: 'System',
            createdAt: '2024-01-20T14:20:00Z',
        },
        {
            id: 'mov-003',
            vendorId: 'vendor-pharmatech',
            productId: 'inv-002',
            productName: 'Amoxicillin 250mg Capsules',
            movementType: 'sale',
            quantity: -50,
            previousStock: 200,
            newStock: 150,
            totalValue: -150.0,
            reason: 'Customer order fulfillment',
            reference: 'ORD-2024-157',
            performedBy: 'System',
            createdAt: '2024-01-19T16:45:00Z',
        },
        {
            id: 'mov-004',
            vendorId: 'vendor-pharmatech',
            productId: 'inv-003',
            productName: 'Vitamin D3 1000 IU Tablets',
            movementType: 'sale',
            quantity: -25,
            previousStock: 25,
            newStock: 0,
            totalValue: -37.5,
            reason: 'Customer order fulfillment',
            reference: 'ORD-2024-158',
            performedBy: 'System',
            createdAt: '2024-01-18T13:15:00Z',
        },
        {
            id: 'mov-005',
            vendorId: 'vendor-pharmatech',
            productId: 'inv-004',
            productName: 'Omega-3 Fish Oil Capsules',
            movementType: 'restock',
            quantity: 500,
            previousStock: 300,
            newStock: 800,
            unitCost: 2.25,
            totalValue: 1125.0,
            reason: 'New stock arrival',
            reference: 'PO-2024-002',
            batchNumber: 'MN2024001',
            expiryDate: '2025-12-31',
            performedBy: 'Ahmed Mansour',
            notes: 'Fresh batch with extended expiry',
            createdAt: '2024-01-10T14:00:00Z',
        },
    ];

    private alerts: InventoryAlert[] = [
        {
            id: 'alert-001',
            vendorId: 'vendor-pharmatech',
            productId: 'inv-002',
            productName: 'Amoxicillin 250mg Capsules',
            alertType: 'low_stock',
            priority: 'high',
            message: 'Stock level below minimum threshold',
            currentStock: 150,
            threshold: 200,
            isResolved: false,
            createdAt: '2024-01-19T16:45:00Z',
        },
        {
            id: 'alert-002',
            vendorId: 'vendor-pharmatech',
            productId: 'inv-003',
            productName: 'Vitamin D3 1000 IU Tablets',
            alertType: 'out_of_stock',
            priority: 'critical',
            message: 'Product is completely out of stock',
            currentStock: 0,
            threshold: 100,
            isResolved: false,
            createdAt: '2024-01-18T13:15:00Z',
        },
    ];

    // Get inventory items with filtering
    getInventoryItems(vendorId: string, filters?: InventoryFilters): VendorInventoryItem[] {
        // Ensure we have inventory for this vendor
        if (!this.inventoryItems.some((item) => item.vendorId === vendorId)) {
            const newItems = this.generateInventoryFromMasterDatabase(vendorId);
            this.inventoryItems.push(...newItems);
        }

        let items = this.inventoryItems.filter((item) => item.vendorId === vendorId);

        if (filters) {
            if (filters.category) {
                items = items.filter((item) =>
                    item.category.toLowerCase().includes(filters.category!.toLowerCase()),
                );
            }
            if (filters.brand) {
                items = items.filter((item) =>
                    item.brand.toLowerCase().includes(filters.brand!.toLowerCase()),
                );
            }
            if (filters.supplier) {
                items = items.filter((item) =>
                    item.supplier.toLowerCase().includes(filters.supplier!.toLowerCase()),
                );
            }
            if (filters.status) {
                items = items.filter((item) => item.status === filters.status);
            }
            if (filters.location) {
                items = items.filter((item) =>
                    item.location.toLowerCase().includes(filters.location!.toLowerCase()),
                );
            }
            if (filters.stockLevel && filters.stockLevel !== 'all') {
                switch (filters.stockLevel) {
                    case 'low':
                        items = items.filter((item) => item.status === 'low_stock');
                        break;
                    case 'out':
                        items = items.filter((item) => item.status === 'out_of_stock');
                        break;
                    case 'normal':
                        items = items.filter((item) => item.status === 'in_stock');
                        break;
                    case 'overstock':
                        items = items.filter((item) => item.currentStock > item.maximumStock);
                        break;
                }
            }
            if (filters.expiryStatus && filters.expiryStatus !== 'all') {
                const now = new Date();
                const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

                switch (filters.expiryStatus) {
                    case 'expiring_soon':
                        items = items.filter((item) => {
                            if (!item.expiryDate) return false;
                            const expiryDate = new Date(item.expiryDate);
                            return expiryDate <= thirtyDaysFromNow && expiryDate > now;
                        });
                        break;
                    case 'expired':
                        items = items.filter((item) => {
                            if (!item.expiryDate) return false;
                            return new Date(item.expiryDate) <= now;
                        });
                        break;
                    case 'valid':
                        items = items.filter((item) => {
                            if (!item.expiryDate) return true;
                            return new Date(item.expiryDate) > thirtyDaysFromNow;
                        });
                        break;
                }
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                items = items.filter(
                    (item) =>
                        item.productName.toLowerCase().includes(searchTerm) ||
                        item.productNameAr.includes(filters.search!) ||
                        item.sku.toLowerCase().includes(searchTerm) ||
                        item.barcode?.toLowerCase().includes(searchTerm) ||
                        item.brand.toLowerCase().includes(searchTerm) ||
                        item.category.toLowerCase().includes(searchTerm),
                );
            }

            // Sorting
            if (filters.sortBy) {
                items.sort((a, b) => {
                    let aValue: any, bValue: any;

                    switch (filters.sortBy) {
                        case 'name':
                            aValue = a.productName.toLowerCase();
                            bValue = b.productName.toLowerCase();
                            break;
                        case 'stock':
                            aValue = a.currentStock;
                            bValue = b.currentStock;
                            break;
                        case 'value':
                            aValue = a.totalValue;
                            bValue = b.totalValue;
                            break;
                        case 'lastRestocked':
                            aValue = new Date(a.lastRestocked);
                            bValue = new Date(b.lastRestocked);
                            break;
                        case 'lastSold':
                            aValue = new Date(a.lastSold);
                            bValue = new Date(b.lastSold);
                            break;
                        default:
                            return 0;
                    }

                    if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
                    if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
                    return 0;
                });
            }
        }

        return items;
    }

    // Get inventory item by ID
    getInventoryItemById(itemId: string): VendorInventoryItem | undefined {
        return this.inventoryItems.find((item) => item.id === itemId);
    }

    // Get inventory movements
    getInventoryMovements(vendorId: string, productId?: string): InventoryMovement[] {
        let movements = this.movements.filter((movement) => movement.vendorId === vendorId);

        if (productId) {
            movements = movements.filter((movement) => movement.productId === productId);
        }

        return movements.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    // Get inventory alerts
    getInventoryAlerts(vendorId: string, includeResolved: boolean = false): InventoryAlert[] {
        let alerts = this.alerts.filter((alert) => alert.vendorId === vendorId);

        if (!includeResolved) {
            alerts = alerts.filter((alert) => !alert.isResolved);
        }

        return alerts.sort((a, b) => {
            // Sort by priority first, then by creation date
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority];
            const bPriority = priorityOrder[b.priority];

            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    // Get inventory statistics
    getInventoryStats(vendorId: string): InventoryStats {
        const items = this.getInventoryItems(vendorId);
        const movements = this.getInventoryMovements(vendorId);

        const totalProducts = items.length;
        const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
        const lowStockItems = items.filter((item) => item.status === 'low_stock').length;
        const outOfStockItems = items.filter((item) => item.status === 'out_of_stock').length;

        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringSoonItems = items.filter((item) => {
            if (!item.expiryDate) return false;
            const expiryDate = new Date(item.expiryDate);
            return expiryDate <= thirtyDaysFromNow && expiryDate > now;
        }).length;

        const expiredItems = items.filter((item) => {
            if (!item.expiryDate) return false;
            return new Date(item.expiryDate) <= now;
        }).length;

        const averageStockLevel =
            items.length > 0
                ? items.reduce(
                      (sum, item) => sum + (item.currentStock / item.maximumStock) * 100,
                      0,
                  ) / items.length
                : 0;

        // Calculate stock turnover rate (simplified)
        const totalSales = movements
            .filter((m) => m.movementType === 'sale')
            .reduce((sum, m) => sum + Math.abs(m.quantity), 0);
        const averageInventory =
            items.reduce((sum, item) => sum + item.currentStock, 0) / items.length;
        const stockTurnoverRate = averageInventory > 0 ? totalSales / averageInventory : 0;

        // Top selling products
        const topSellingProducts = items
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5)
            .map((item) => ({
                productId: item.id,
                productName: item.productName,
                totalSold: item.totalSold,
                revenue: item.totalSold * item.sellingPrice,
            }));

        // Category breakdown
        const categoryMap = new Map<
            string,
            { productCount: number; totalValue: number; totalStock: number }
        >();
        items.forEach((item) => {
            const existing = categoryMap.get(item.category) || {
                productCount: 0,
                totalValue: 0,
                totalStock: 0,
            };
            categoryMap.set(item.category, {
                productCount: existing.productCount + 1,
                totalValue: existing.totalValue + item.totalValue,
                totalStock: existing.totalStock + item.currentStock,
            });
        });

        const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
            category,
            productCount: data.productCount,
            totalValue: data.totalValue,
            averageStock: data.totalStock / data.productCount,
        }));

        // Supplier breakdown
        const supplierMap = new Map<string, { productCount: number; totalValue: number }>();
        items.forEach((item) => {
            const existing = supplierMap.get(item.supplier) || { productCount: 0, totalValue: 0 };
            supplierMap.set(item.supplier, {
                productCount: existing.productCount + 1,
                totalValue: existing.totalValue + item.totalValue,
            });
        });

        const supplierBreakdown = Array.from(supplierMap.entries()).map(([supplier, data]) => ({
            supplier,
            productCount: data.productCount,
            totalValue: data.totalValue,
        }));

        // Monthly movements (simplified - last 6 months)
        const monthlyMovements = [
            { month: '2023-08', restocks: 5, sales: 45, adjustments: 2 },
            { month: '2023-09', restocks: 8, sales: 52, adjustments: 1 },
            { month: '2023-10', restocks: 6, sales: 48, adjustments: 3 },
            { month: '2023-11', restocks: 7, sales: 55, adjustments: 2 },
            { month: '2023-12', restocks: 9, sales: 62, adjustments: 4 },
            { month: '2024-01', restocks: 4, sales: 38, adjustments: 1 },
        ];

        return {
            totalProducts,
            totalValue,
            lowStockItems,
            outOfStockItems,
            expiringSoonItems,
            expiredItems,
            averageStockLevel,
            stockTurnoverRate,
            topSellingProducts,
            categoryBreakdown,
            supplierBreakdown,
            monthlyMovements,
        };
    }

    // Update stock level
    updateStock(
        itemId: string,
        newStock: number,
        movementType: InventoryMovement['movementType'],
        reason: string,
        performedBy: string,
        reference?: string,
        notes?: string,
    ): boolean {
        const itemIndex = this.inventoryItems.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) return false;

        const item = this.inventoryItems[itemIndex];
        const previousStock = item.currentStock;
        const quantity = newStock - previousStock;

        // Update item
        this.inventoryItems[itemIndex] = {
            ...item,
            currentStock: newStock,
            totalValue: newStock * item.unitCost,
            status: this.calculateStockStatus(newStock, item.minimumStock, item.maximumStock),
            updatedAt: new Date().toISOString(),
        };

        // Add movement record
        const movement: InventoryMovement = {
            id: `mov-${Date.now()}`,
            vendorId: item.vendorId,
            productId: item.id,
            productName: item.productName,
            movementType,
            quantity,
            previousStock,
            newStock,
            unitCost: movementType === 'restock' ? item.unitCost : undefined,
            totalValue: quantity * item.unitCost,
            reason,
            reference,
            performedBy,
            notes,
            createdAt: new Date().toISOString(),
        };

        this.movements.unshift(movement);

        // Check for alerts
        this.checkAndCreateAlerts(item.vendorId, itemId);

        return true;
    }

    // Restock item
    restockItem(
        itemId: string,
        quantity: number,
        unitCost: number,
        supplier: string,
        batchNumber?: string,
        expiryDate?: string,
        performedBy: string = 'System',
        reference?: string,
        notes?: string,
    ): boolean {
        const itemIndex = this.inventoryItems.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) return false;

        const item = this.inventoryItems[itemIndex];
        const newStock = item.currentStock + quantity;

        // Update item
        this.inventoryItems[itemIndex] = {
            ...item,
            currentStock: newStock,
            unitCost,
            totalValue: newStock * unitCost,
            supplier,
            batchNumber: batchNumber || item.batchNumber,
            expiryDate: expiryDate || item.expiryDate,
            status: this.calculateStockStatus(newStock, item.minimumStock, item.maximumStock),
            lastRestocked: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Add movement record
        const movement: InventoryMovement = {
            id: `mov-${Date.now()}`,
            vendorId: item.vendorId,
            productId: item.id,
            productName: item.productName,
            movementType: 'restock',
            quantity,
            previousStock: item.currentStock,
            newStock,
            unitCost,
            totalValue: quantity * unitCost,
            reason: 'Stock replenishment',
            reference,
            batchNumber,
            expiryDate,
            performedBy,
            notes,
            createdAt: new Date().toISOString(),
        };

        this.movements.unshift(movement);

        // Check for alerts
        this.checkAndCreateAlerts(item.vendorId, itemId);

        return true;
    }

    // Calculate stock status
    private calculateStockStatus(
        currentStock: number,
        minimumStock: number,
        maximumStock: number,
    ): VendorInventoryItem['status'] {
        if (currentStock === 0) return 'out_of_stock';
        if (currentStock <= minimumStock) return 'low_stock';
        return 'in_stock';
    }

    // Check and create alerts
    private checkAndCreateAlerts(vendorId: string, itemId: string): void {
        const item = this.getInventoryItemById(itemId);
        if (!item) return;

        // Remove existing unresolved alerts for this item
        this.alerts = this.alerts.filter(
            (alert) => !(alert.productId === itemId && !alert.isResolved),
        );

        // Check for stock alerts
        if (item.currentStock === 0) {
            this.alerts.push({
                id: `alert-${Date.now()}`,
                vendorId,
                productId: itemId,
                productName: item.productName,
                alertType: 'out_of_stock',
                priority: 'critical',
                message: 'Product is completely out of stock',
                currentStock: item.currentStock,
                threshold: item.minimumStock,
                isResolved: false,
                createdAt: new Date().toISOString(),
            });
        } else if (item.currentStock <= item.minimumStock) {
            this.alerts.push({
                id: `alert-${Date.now()}`,
                vendorId,
                productId: itemId,
                productName: item.productName,
                alertType: 'low_stock',
                priority: 'high',
                message: 'Stock level below minimum threshold',
                currentStock: item.currentStock,
                threshold: item.minimumStock,
                isResolved: false,
                createdAt: new Date().toISOString(),
            });
        }

        // Check for expiry alerts
        if (item.expiryDate) {
            const now = new Date();
            const expiryDate = new Date(item.expiryDate);
            const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

            if (expiryDate <= now) {
                this.alerts.push({
                    id: `alert-${Date.now()}-exp`,
                    vendorId,
                    productId: itemId,
                    productName: item.productName,
                    alertType: 'expired',
                    priority: 'critical',
                    message: 'Product has expired',
                    currentStock: item.currentStock,
                    expiryDate: item.expiryDate,
                    isResolved: false,
                    createdAt: new Date().toISOString(),
                });
            } else if (expiryDate <= thirtyDaysFromNow) {
                this.alerts.push({
                    id: `alert-${Date.now()}-exp`,
                    vendorId,
                    productId: itemId,
                    productName: item.productName,
                    alertType: 'expiring_soon',
                    priority: 'medium',
                    message: 'Product expires within 30 days',
                    currentStock: item.currentStock,
                    expiryDate: item.expiryDate,
                    isResolved: false,
                    createdAt: new Date().toISOString(),
                });
            }
        }
    }

    // Resolve alert
    resolveAlert(alertId: string, resolvedBy: string): boolean {
        const alertIndex = this.alerts.findIndex((alert) => alert.id === alertId);
        if (alertIndex === -1) return false;

        this.alerts[alertIndex] = {
            ...this.alerts[alertIndex],
            isResolved: true,
            resolvedAt: new Date().toISOString(),
            resolvedBy,
        };

        return true;
    }

    // Get available categories
    getCategories(): string[] {
        const categories = new Set(this.inventoryItems.map((item) => item.category));
        return Array.from(categories).sort();
    }

    // Get available brands
    getBrands(): string[] {
        const brands = new Set(this.inventoryItems.map((item) => item.brand));
        return Array.from(brands).sort();
    }

    // Get available suppliers
    getSuppliers(): string[] {
        const suppliers = new Set(this.inventoryItems.map((item) => item.supplier));
        return Array.from(suppliers).sort();
    }

    // Get available locations
    getLocations(): string[] {
        const locations = new Set(this.inventoryItems.map((item) => item.location));
        return Array.from(locations).sort();
    }

    // Helper function to check if item has active discount
    hasActiveDiscount(item: VendorInventoryItem): boolean {
        if (item.discountType === 'none' || !item.discountStartDate || !item.discountEndDate) {
            return false;
        }
        const now = new Date();
        const startDate = new Date(item.discountStartDate);
        const endDate = new Date(item.discountEndDate);
        return now >= startDate && now <= endDate;
    }

    // Helper function to format discount badge
    formatDiscountBadge(item: VendorInventoryItem): string | null {
        if (!this.hasActiveDiscount(item)) return null;

        if (item.discountType === 'percentage' && item.discountPercentage) {
            return `${item.discountPercentage}% OFF`;
        }
        return 'DISCOUNT';
    }

    // Get items with active discounts
    getItemsWithDiscounts(vendorId: string): VendorInventoryItem[] {
        const items = this.getInventoryItems(vendorId);
        return items.filter((item) => this.hasActiveDiscount(item));
    }

    // Get discount statistics
    getDiscountStats(vendorId: string): {
        totalWithDiscounts: number;
        averageDiscountPercentage: number;
        totalDiscountValue: number;
    } {
        const items = this.getInventoryItems(vendorId);
        const discountedItems = items.filter((item) => this.hasActiveDiscount(item));

        const totalWithDiscounts = discountedItems.length;
        const averageDiscountPercentage =
            discountedItems.length > 0
                ? discountedItems.reduce((sum, item) => sum + (item.discountPercentage || 0), 0) /
                  discountedItems.length
                : 0;

        const totalDiscountValue = discountedItems.reduce((sum, item) => {
            if (item.originalPrice && item.discountPrice) {
                return sum + (item.originalPrice - item.discountPrice) * item.currentStock;
            }
            return sum;
        }, 0);

        return {
            totalWithDiscounts,
            averageDiscountPercentage,
            totalDiscountValue,
        };
    }

    // Get all available products for vendor (NO MEDICINES - medical supplies only)
    getAvailableProducts(vendorId: string): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForVendor({ businessId: vendorId });
    }

    // Get products by category for vendor (NO MEDICINES - filtered automatically)
    getProductsByCategory(vendorId: string, category: string): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForVendor({
            businessId: vendorId,
            category,
        });
    }

    // Check if vendor can sell a specific product (NO MEDICINES allowed)
    canSellProduct(vendorId: string, productId: number): boolean {
        const canSell = roleBasedAccessService.canBusinessSellProduct(vendorId, productId);

        // Double-check: vendors cannot sell medicines
        const product = roleBasedAccessService.getProductById(productId, 'vendor', vendorId);
        if (product && product.type === 'medicine') {
            console.warn(
                `REGULATORY VIOLATION PREVENTED: Vendor ${vendorId} attempted to access medicine ${productId}`,
            );
            return false;
        }

        return canSell;
    }

    // Get product details for vendor (NO MEDICINES - will return null for medicines)
    getProductDetails(productId: number, vendorId: string): ProductWithInventory | null {
        const product = roleBasedAccessService.getProductById(productId, 'vendor', vendorId);

        // Additional safety check: ensure no medicines leak through
        if (product && product.type === 'medicine') {
            console.warn(
                `REGULATORY VIOLATION PREVENTED: Vendor ${vendorId} attempted to access medicine details for ${productId}`,
            );
            return null;
        }

        return product;
    }

    // Get medical supplies only (vendor's allowed products)
    getMedicalSuppliesOnly(vendorId: string): ProductWithInventory[] {
        return roleBasedAccessService.getProductsForVendor({ businessId: vendorId });
    }

    // Explicitly prevent access to medicines
    getMedicines(vendorId: string): ProductWithInventory[] {
        console.warn(
            `REGULATORY VIOLATION PREVENTED: Vendor ${vendorId} attempted to access medicines`,
        );
        return []; // Vendors cannot access medicines
    }

    // Get vendor statistics (excluding medicines)
    getVendorProductStats(vendorId: string): {
        totalProducts: number;
        medicalSupplies: number;
        hygieneSupplies: number;
        medicalDevices: number;
        medicines: number; // Always 0 for vendors
    } {
        const products = this.getAvailableProducts(vendorId);

        return {
            totalProducts: products.length,
            medicalSupplies: products.filter((p) => p.type === 'medical-supply').length,
            hygieneSupplies: products.filter((p) => p.type === 'hygiene-supply').length,
            medicalDevices: products.filter((p) => p.type === 'medical-device').length,
            medicines: 0, // Vendors cannot sell medicines
        };
    }

    // Add new product to vendor inventory (only if vendor can sell it)
    addProductToInventory(
        vendorId: string,
        productId: number,
        inventoryData: {
            currentStock: number;
            minimumStock: number;
            maximumStock: number;
            unitCost: number;
            sellingPrice: number;
            supplier: string;
            location: string;
            batchNumber?: string;
            expiryDate?: string;
        },
    ): boolean {
        // Check if vendor can sell this product
        if (!this.canSellProduct(vendorId, productId)) {
            console.error(`Vendor ${vendorId} is not authorized to sell product ${productId}`);
            return false;
        }

        const product = roleBasedAccessService.getProductById(productId, 'vendor', vendorId);
        if (!product) {
            console.error(`Product ${productId} not found or not available for vendors`);
            return false;
        }

        const newInventoryItem: VendorInventoryItem = {
            id: `inv-${vendorId}-${productId}-${Date.now()}`,
            vendorId,
            productName: product.name,
            productNameAr: product.nameAr || product.name,
            sku: `VD-${productId}-${Math.floor(Math.random() * 10000)}`,
            barcode: product.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`,
            category: product.category,
            brand: product.manufacturer,
            description: product.description,
            descriptionAr: product.descriptionAr || product.description,
            currentStock: inventoryData.currentStock,
            minimumStock: inventoryData.minimumStock,
            maximumStock: inventoryData.maximumStock,
            reorderPoint: inventoryData.minimumStock + Math.floor(inventoryData.minimumStock * 0.5),
            unitCost: inventoryData.unitCost,
            sellingPrice: inventoryData.sellingPrice,
            supplier: inventoryData.supplier,
            supplierContact: `+20 ${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
            batchNumber:
                inventoryData.batchNumber ||
                `BATCH${Date.now()}${Math.floor(Math.random() * 1000)}`,
            expiryDate:
                inventoryData.expiryDate ||
                new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            manufacturingDate: new Date().toISOString().split('T')[0],
            location: inventoryData.location,
            status:
                inventoryData.currentStock > inventoryData.minimumStock
                    ? 'in_stock'
                    : inventoryData.currentStock > 0
                      ? 'low_stock'
                      : 'out_of_stock',
            lastRestocked: new Date().toISOString(),
            lastSold: new Date().toISOString(),
            totalSold: 0,
            totalValue: Math.round(inventoryData.currentStock * inventoryData.unitCost * 100) / 100,
            images: product.images || [product.image || '/images/placeholder.jpg'],
            specifications: {
                'Active Ingredient': product.activeIngredient,
                'Pack Size': product.packSize,
                'Dosage Form': product.form,
                Storage: 'Store in cool, dry place',
                Manufacturer: product.manufacturer,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.inventoryItems.push(newInventoryItem);
        return true;
    }
}

export const vendorInventoryService = new VendorInventoryService();
