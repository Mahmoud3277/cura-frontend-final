'use client';

import { NotificationService } from './notificationService';

export interface SuspendedOrder {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    pharmacyId: string;
    pharmacyName: string;
    pharmacyPhone: string;
    prescriptionId?: string;
    originalOrderId: string;
    issueType:
        | 'prescription-issue'
        | 'medicine-unavailable'
        | 'customer-request'
        | 'pharmacy-issue'
        | 'payment-issue'
        | 'other';
    issueNotes: string;
    suspendedAt: string;
    suspendedBy: string; // 'pharmacy' | 'customer' | 'system' | 'app-services'
    status: 'suspended' | 'in-progress' | 'resolved' | 'cancelled';
    priority: 'low' | 'normal' | 'high' | 'urgent';

    // Contact tracking
    customerContacted: boolean;
    customerContactedAt?: string;
    customerContactNotes?: string;
    pharmacyContacted: boolean;
    pharmacyContactedAt?: string;
    pharmacyContactNotes?: string;

    // Resolution tracking
    resolvedAt?: string;
    resolvedBy?: string;
    resolutionNotes?: string;
    resolutionAction?:
        | 'order-modified'
        | 'order-cancelled'
        | 'issue-resolved'
        | 'alternative-provided';

    // Order details
    originalItems: SuspendedOrderItem[];
    modifiedItems?: SuspendedOrderItem[];
    totalAmount: number;
    originalTotalAmount: number;

    // App services tracking
    assignedToAgent?: string;
    agentNotes?: string;
    escalationLevel: number; // 0 = normal, 1 = escalated, 2 = urgent

    createdAt: string;
    updatedAt: string;
}

export interface SuspendedOrderItem {
    id: string;
    productId: string;
    productName: string;
    productNameAr: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    unitType: 'box' | 'blister' | 'piece' | 'bottle' | 'tube';
    prescription: boolean;
    category: string;
    manufacturer: string;
    activeIngredient: string;
    dosage?: string;
    instructions?: string;
    alternatives?: string[]; // product IDs
    issueReason?: string; // specific issue with this item
    status: 'pending' | 'approved' | 'rejected' | 'modified' | 'substituted';
}

export interface SuspendOrderRequest {
    orderId: string;
    issueType: SuspendedOrder['issueType'];
    issueNotes: string;
    suspendedBy: string;
    priority?: SuspendedOrder['priority'];
    affectedItems?: string[]; // product IDs that have issues
}

export interface OrderModification {
    orderId: string;
    modifiedBy: string;
    modifications: {
        itemsToRemove: string[]; // item IDs
        itemsToAdd: SuspendedOrderItem[];
        itemsToModify: {
            itemId: string;
            newQuantity?: number;
            newUnitType?: SuspendedOrderItem['unitType'];
            substitutedProductId?: string;
        }[];
    };
    notes: string;
}

// Mock data for development
let mockSuspendedOrders: SuspendedOrder[] = [
    {
        id: 'suspended-001',
        orderNumber: 'CURA-240115-001',
        customerId: 'customer-001',
        customerName: 'Ahmed Mohamed',
        customerPhone: '+20 10 1234 5678',
        customerEmail: 'ahmed.mohamed@email.com',
        pharmacyId: 'healthplus-ismailia',
        pharmacyName: 'HealthPlus Pharmacy',
        pharmacyPhone: '+20 64 123 4567',
        prescriptionId: 'prescription-001',
        originalOrderId: 'order-001',
        issueType: 'prescription-issue',
        issueNotes:
            'Prescription image is unclear, cannot read dosage for Amoxicillin. Customer needs to provide clearer image or visit pharmacy.',
        suspendedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        suspendedBy: 'pharmacy',
        status: 'suspended',
        priority: 'high',
        customerContacted: false,
        pharmacyContacted: false,
        escalationLevel: 0,
        originalItems: [
            {
                id: 'item-001',
                productId: '4',
                productName: 'Amoxicillin 250mg',
                productNameAr: 'أموكسيسيلين 250 مجم',
                quantity: 2,
                unitPrice: 65.0,
                totalPrice: 130.0,
                unitType: 'box',
                prescription: true,
                category: 'prescription',
                manufacturer: 'Cairo Pharmaceuticals',
                activeIngredient: 'Amoxicillin',
                dosage: '250mg',
                instructions: 'Take 1 capsule three times daily',
                issueReason: 'Unclear dosage on prescription',
                status: 'pending',
            },
            {
                id: 'item-002',
                productId: '1',
                productName: 'Paracetamol 500mg',
                productNameAr: 'باراسيتامول 500 مجم',
                quantity: 1,
                unitPrice: 25.0,
                totalPrice: 25.0,
                unitType: 'box',
                prescription: false,
                category: 'otc',
                manufacturer: 'Egyptian Pharmaceutical Company',
                activeIngredient: 'Paracetamol',
                dosage: '500mg',
                status: 'approved',
            },
        ],
        totalAmount: 155.0,
        originalTotalAmount: 155.0,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'suspended-002',
        orderNumber: 'CURA-240115-002',
        customerId: 'customer-002',
        customerName: 'Fatima Ali',
        customerPhone: '+20 11 2345 6789',
        customerEmail: 'fatima.ali@email.com',
        pharmacyId: 'wellcare-ismailia',
        pharmacyName: 'WellCare Pharmacy',
        pharmacyPhone: '+20 64 234 5678',
        originalOrderId: 'order-002',
        issueType: 'medicine-unavailable',
        issueNotes:
            'Insulin pen is out of stock. Customer needs urgent alternative or transfer to another pharmacy.',
        suspendedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        suspendedBy: 'pharmacy',
        status: 'in-progress',
        priority: 'urgent',
        customerContacted: true,
        customerContactedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        customerContactNotes:
            'Customer informed about stock issue, agreed to wait for alternative solution',
        pharmacyContacted: true,
        pharmacyContactedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        pharmacyContactNotes: 'Pharmacy confirmed out of stock, checking with other branches',
        escalationLevel: 1,
        assignedToAgent: 'agent-001',
        agentNotes:
            'Urgent case - diabetic patient needs insulin. Coordinating with other pharmacies.',
        originalItems: [
            {
                id: 'item-003',
                productId: '12',
                productName: 'Insulin Pen',
                productNameAr: 'قلم الأنسولين',
                quantity: 1,
                unitPrice: 180.0,
                totalPrice: 180.0,
                unitType: 'piece',
                prescription: true,
                category: 'prescription',
                manufacturer: 'Diabetes Solutions Egypt',
                activeIngredient: 'Insulin delivery system',
                issueReason: 'Out of stock',
                status: 'pending',
            },
        ],
        totalAmount: 180.0,
        originalTotalAmount: 180.0,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: 'suspended-003',
        orderNumber: 'CURA-240115-003',
        customerId: 'customer-003',
        customerName: 'Omar Hassan',
        customerPhone: '+20 12 3456 7890',
        customerEmail: 'omar.hassan@email.com',
        pharmacyId: 'family-care-ismailia',
        pharmacyName: 'Family Care Pharmacy',
        pharmacyPhone: '+20 64 345 6789',
        originalOrderId: 'order-003',
        issueType: 'customer-request',
        issueNotes:
            'Customer wants to change baby formula brand after placing order. Requesting substitution.',
        suspendedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        suspendedBy: 'customer',
        status: 'suspended',
        priority: 'normal',
        customerContacted: false,
        pharmacyContacted: false,
        escalationLevel: 0,
        originalItems: [
            {
                id: 'item-004',
                productId: '3',
                productName: 'Baby Formula Powder',
                productNameAr: 'حليب أطفال بودرة',
                quantity: 2,
                unitPrice: 120.0,
                totalPrice: 240.0,
                unitType: 'box',
                prescription: false,
                category: 'baby',
                manufacturer: 'Baby Nutrition Egypt',
                activeIngredient: 'Milk proteins, vitamins, minerals',
                issueReason: 'Customer wants different brand',
                status: 'pending',
            },
        ],
        totalAmount: 240.0,
        originalTotalAmount: 240.0,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
];

// Listeners for real-time updates
const listeners: Map<string, (orders: SuspendedOrder[]) => void> = new Map();

class SuspendedOrderService {
    // Get all suspended orders
    getSuspendedOrders(filters?: {
        status?: SuspendedOrder['status'][];
        priority?: SuspendedOrder['priority'][];
        issueType?: SuspendedOrder['issueType'][];
        pharmacyId?: string;
        customerId?: string;
        assignedToAgent?: string;
        escalationLevel?: number;
    }): SuspendedOrder[] {
        let filtered = [...mockSuspendedOrders];

        if (filters) {
            if (filters.status && filters.status.length > 0) {
                filtered = filtered.filter((order) => filters.status!.includes(order.status));
            }
            if (filters.priority && filters.priority.length > 0) {
                filtered = filtered.filter((order) => filters.priority!.includes(order.priority));
            }
            if (filters.issueType && filters.issueType.length > 0) {
                filtered = filtered.filter((order) => filters.issueType!.includes(order.issueType));
            }
            if (filters.pharmacyId) {
                filtered = filtered.filter((order) => order.pharmacyId === filters.pharmacyId);
            }
            if (filters.customerId) {
                filtered = filtered.filter((order) => order.customerId === filters.customerId);
            }
            if (filters.assignedToAgent) {
                filtered = filtered.filter(
                    (order) => order.assignedToAgent === filters.assignedToAgent,
                );
            }
            if (filters.escalationLevel !== undefined) {
                filtered = filtered.filter(
                    (order) => order.escalationLevel === filters.escalationLevel,
                );
            }
        }

        return filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    // Get suspended order by ID
    getSuspendedOrderById(id: string): SuspendedOrder | undefined {
        return mockSuspendedOrders.find((order) => order.id === id);
    }

    // Suspend an order
    async suspendOrder(request: SuspendOrderRequest): Promise<SuspendedOrder> {
        try {
            // In production, this would call an API
            await new Promise((resolve) => setTimeout(resolve, 500));

            const newSuspendedOrder: SuspendedOrder = {
                id: `suspended-${Date.now()}`,
                orderNumber: `CURA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
                customerId: 'customer-temp',
                customerName: 'Customer Name',
                customerPhone: '+20 10 0000 0000',
                customerEmail: 'customer@email.com',
                pharmacyId: 'pharmacy-temp',
                pharmacyName: 'Pharmacy Name',
                pharmacyPhone: '+20 64 000 0000',
                originalOrderId: request.orderId,
                issueType: request.issueType,
                issueNotes: request.issueNotes,
                suspendedAt: new Date().toISOString(),
                suspendedBy: request.suspendedBy,
                status: 'suspended',
                priority: request.priority || 'normal',
                customerContacted: false,
                pharmacyContacted: false,
                escalationLevel: 0,
                originalItems: [], // Would be populated from original order
                totalAmount: 0,
                originalTotalAmount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            mockSuspendedOrders.unshift(newSuspendedOrder);
            this.notifyListeners();

            // Create notifications
            await this.createSuspensionNotifications(newSuspendedOrder);

            return newSuspendedOrder;
        } catch (error) {
            console.error('Error suspending order:', error);
            throw new Error('Failed to suspend order');
        }
    }

    // Mark customer as contacted
    async markCustomerContacted(orderId: string, notes: string): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const order = mockSuspendedOrders.find((o) => o.id === orderId);
            if (!order) throw new Error('Order not found');

            order.customerContacted = true;
            order.customerContactedAt = new Date().toISOString();
            order.customerContactNotes = notes;
            order.updatedAt = new Date().toISOString();

            // Update status if both customer and pharmacy contacted
            if (order.pharmacyContacted && order.status === 'suspended') {
                order.status = 'in-progress';
            }

            this.notifyListeners();

            // Create notification
            await NotificationService.createNotification({
                userId: order.customerId,
                userRole: 'customer',
                type: 'order',
                priority: 'high',
                title: 'Support Contact - Suspended Order',
                message: `Our support team has contacted you regarding your suspended order ${order.orderNumber}. Please check your phone for details.`,
                actionUrl: '/customer/orders',
                actionLabel: 'View Order',
                isRead: false,
                isArchived: false,
                data: { orderId: order.id, contactNotes: notes },
            });

            return true;
        } catch (error) {
            console.error('Error marking customer contacted:', error);
            throw new Error('Failed to update contact status');
        }
    }

    // Mark pharmacy as contacted
    async markPharmacyContacted(orderId: string, notes: string): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const order = mockSuspendedOrders.find((o) => o.id === orderId);
            if (!order) throw new Error('Order not found');

            order.pharmacyContacted = true;
            order.pharmacyContactedAt = new Date().toISOString();
            order.pharmacyContactNotes = notes;
            order.updatedAt = new Date().toISOString();

            // Update status if both customer and pharmacy contacted
            if (order.customerContacted && order.status === 'suspended') {
                order.status = 'in-progress';
            }

            this.notifyListeners();

            // Create notification
            await NotificationService.createNotification({
                userId: order.pharmacyId,
                userRole: 'pharmacy',
                type: 'order',
                priority: 'high',
                title: 'Support Contact - Suspended Order',
                message: `Our support team has contacted you regarding suspended order ${order.orderNumber}. Please check your phone for details.`,
                actionUrl: '/pharmacy/orders',
                actionLabel: 'View Order',
                isRead: false,
                isArchived: false,
                data: { orderId: order.id, contactNotes: notes },
            });

            return true;
        } catch (error) {
            console.error('Error marking pharmacy contacted:', error);
            throw new Error('Failed to update contact status');
        }
    }

    // Resolve suspended order
    async resolveOrder(
        orderId: string,
        resolutionNotes: string,
        resolutionAction?: SuspendedOrder['resolutionAction'],
    ): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const order = mockSuspendedOrders.find((o) => o.id === orderId);
            if (!order) throw new Error('Order not found');

            order.status = 'resolved';
            order.resolvedAt = new Date().toISOString();
            order.resolvedBy = 'app-services';
            order.resolutionNotes = resolutionNotes;
            order.resolutionAction = resolutionAction || 'issue-resolved';
            order.updatedAt = new Date().toISOString();

            this.notifyListeners();

            // Create notifications
            await Promise.all([
                NotificationService.createNotification({
                    userId: order.customerId,
                    userRole: 'customer',
                    type: 'order',
                    priority: 'medium',
                    title: 'Order Issue Resolved',
                    message: `Great news! The issue with your order ${order.orderNumber} has been resolved. ${resolutionNotes}`,
                    actionUrl: '/customer/orders',
                    actionLabel: 'View Order',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id, resolutionAction, resolutionNotes },
                }),
                NotificationService.createNotification({
                    userId: order.pharmacyId,
                    userRole: 'pharmacy',
                    type: 'order',
                    priority: 'medium',
                    title: 'Suspended Order Resolved',
                    message: `The suspended order ${order.orderNumber} has been resolved by our support team.`,
                    actionUrl: '/pharmacy/orders',
                    actionLabel: 'View Order',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id, resolutionAction, resolutionNotes },
                }),
            ]);

            return true;
        } catch (error) {
            console.error('Error resolving order:', error);
            throw new Error('Failed to resolve order');
        }
    }

    // Modify suspended order (pharmacy function)
    async modifyOrder(modification: OrderModification): Promise<SuspendedOrder> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const order = mockSuspendedOrders.find((o) => o.id === modification.orderId);
            if (!order) throw new Error('Order not found');

            // Create modified items array
            let modifiedItems = [...order.originalItems];

            // Remove items
            if (modification.modifications.itemsToRemove.length > 0) {
                modifiedItems = modifiedItems.filter(
                    (item) => !modification.modifications.itemsToRemove.includes(item.id),
                );
            }

            // Add new items
            if (modification.modifications.itemsToAdd.length > 0) {
                modifiedItems.push(...modification.modifications.itemsToAdd);
            }

            // Modify existing items
            modification.modifications.itemsToModify.forEach((mod) => {
                const itemIndex = modifiedItems.findIndex((item) => item.id === mod.itemId);
                if (itemIndex !== -1) {
                    if (mod.newQuantity) {
                        modifiedItems[itemIndex].quantity = mod.newQuantity;
                        modifiedItems[itemIndex].totalPrice =
                            mod.newQuantity * modifiedItems[itemIndex].unitPrice;
                    }
                    if (mod.newUnitType) {
                        modifiedItems[itemIndex].unitType = mod.newUnitType;
                    }
                    if (mod.substitutedProductId) {
                        // In production, would fetch product details
                        modifiedItems[itemIndex].status = 'substituted';
                    }
                    modifiedItems[itemIndex].status = 'modified';
                }
            });

            // Update order
            order.modifiedItems = modifiedItems;
            order.totalAmount = modifiedItems.reduce((sum, item) => sum + item.totalPrice, 0);
            order.status = 'in-progress';
            order.updatedAt = new Date().toISOString();

            // Add modification notes
            if (order.agentNotes) {
                order.agentNotes += `\n\nOrder Modified by ${modification.modifiedBy}: ${modification.notes}`;
            } else {
                order.agentNotes = `Order Modified by ${modification.modifiedBy}: ${modification.notes}`;
            }

            this.notifyListeners();

            // Create notifications
            await Promise.all([
                NotificationService.createNotification({
                    userId: order.customerId,
                    userRole: 'customer',
                    type: 'order',
                    priority: 'high',
                    title: 'Order Modified',
                    message: `Your order ${order.orderNumber} has been modified by the pharmacy. Please review the changes.`,
                    actionUrl: '/customer/orders',
                    actionLabel: 'Review Changes',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id, modifications: modification.modifications },
                }),
                NotificationService.createNotification({
                    userId: 'app-services',
                    userRole: 'admin',
                    type: 'order',
                    priority: 'medium',
                    title: 'Order Modified by Pharmacy',
                    message: `Order ${order.orderNumber} has been modified by ${order.pharmacyName}.`,
                    actionUrl: '/app-services/dashboard',
                    actionLabel: 'View Order',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id, modifications: modification.modifications },
                }),
            ]);

            return order;
        } catch (error) {
            console.error('Error modifying order:', error);
            throw new Error('Failed to modify order');
        }
    }

    // Approve modified order (customer function)
    async approveModifiedOrder(orderId: string, customerId: string): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const order = mockSuspendedOrders.find((o) => o.id === orderId);
            if (!order || order.customerId !== customerId) throw new Error('Order not found');

            if (order.modifiedItems) {
                order.modifiedItems.forEach((item) => {
                    if (item.status === 'modified' || item.status === 'substituted') {
                        item.status = 'approved';
                    }
                });
            }

            order.status = 'resolved';
            order.resolvedAt = new Date().toISOString();
            order.resolvedBy = 'customer';
            order.resolutionAction = 'order-modified';
            order.resolutionNotes = 'Customer approved the modified order';
            order.updatedAt = new Date().toISOString();

            this.notifyListeners();

            // Create notifications
            await Promise.all([
                NotificationService.createNotification({
                    userId: order.pharmacyId,
                    userRole: 'pharmacy',
                    type: 'order',
                    priority: 'high',
                    title: 'Modified Order Approved',
                    message: `Customer has approved the modifications for order ${order.orderNumber}. You can now process the order.`,
                    actionUrl: '/pharmacy/orders',
                    actionLabel: 'Process Order',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id },
                }),
                NotificationService.createNotification({
                    userId: 'app-services',
                    userRole: 'admin',
                    type: 'order',
                    priority: 'medium',
                    title: 'Modified Order Approved',
                    message: `Customer approved modifications for order ${order.orderNumber}.`,
                    actionUrl: '/app-services/dashboard',
                    actionLabel: 'View Order',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id },
                }),
            ]);

            return true;
        } catch (error) {
            console.error('Error approving modified order:', error);
            throw new Error('Failed to approve modified order');
        }
    }

    // Escalate order
    async escalateOrder(orderId: string, escalationReason: string): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const order = mockSuspendedOrders.find((o) => o.id === orderId);
            if (!order) throw new Error('Order not found');

            order.escalationLevel = Math.min(order.escalationLevel + 1, 2);
            order.priority = order.escalationLevel === 2 ? 'urgent' : 'high';
            order.updatedAt = new Date().toISOString();

            if (order.agentNotes) {
                order.agentNotes += `\n\nEscalated (Level ${order.escalationLevel}): ${escalationReason}`;
            } else {
                order.agentNotes = `Escalated (Level ${order.escalationLevel}): ${escalationReason}`;
            }

            this.notifyListeners();

            return true;
        } catch (error) {
            console.error('Error escalating order:', error);
            throw new Error('Failed to escalate order');
        }
    }

    // Subscribe to updates
    subscribe(callback: (orders: SuspendedOrder[]) => void): () => void {
        const id = Math.random().toString(36).substr(2, 9);
        listeners.set(id, callback);

        return () => {
            listeners.delete(id);
        };
    }

    // Notify all listeners
    private notifyListeners(): void {
        listeners.forEach((callback) => {
            callback([...mockSuspendedOrders]);
        });
    }

    // Create notifications when order is suspended
    private async createSuspensionNotifications(order: SuspendedOrder): Promise<void> {
        try {
            await Promise.all([
                // Notify customer
                NotificationService.createNotification({
                    userId: order.customerId,
                    userRole: 'customer',
                    type: 'order',
                    priority: order.priority === 'urgent' ? 'urgent' : 'high',
                    title: 'Order Suspended',
                    message: `Your order ${order.orderNumber} has been suspended due to: ${order.issueNotes}. Our support team will contact you shortly.`,
                    actionUrl: '/customer/orders',
                    actionLabel: 'View Order',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id, issueType: order.issueType },
                }),

                // Notify pharmacy
                NotificationService.createNotification({
                    userId: order.pharmacyId,
                    userRole: 'pharmacy',
                    type: 'order',
                    priority: 'high',
                    title: 'Order Suspended',
                    message: `Order ${order.orderNumber} has been suspended. Issue: ${order.issueNotes}`,
                    actionUrl: '/pharmacy/orders',
                    actionLabel: 'View Order',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id, issueType: order.issueType },
                }),

                // Notify app services
                NotificationService.createNotification({
                    userId: 'app-services',
                    userRole: 'admin',
                    type: 'order',
                    priority: order.priority === 'urgent' ? 'urgent' : 'high',
                    title: 'New Suspended Order',
                    message: `Order ${order.orderNumber} has been suspended and requires attention. Issue: ${order.issueType}`,
                    actionUrl: '/app-services/dashboard',
                    actionLabel: 'Handle Issue',
                    isRead: false,
                    isArchived: false,
                    data: { orderId: order.id, issueType: order.issueType },
                }),
            ]);
        } catch (error) {
            console.error('Error creating suspension notifications:', error);
        }
    }

    // Get statistics
    getStatistics(): {
        total: number;
        byStatus: Record<SuspendedOrder['status'], number>;
        byPriority: Record<SuspendedOrder['priority'], number>;
        byIssueType: Record<SuspendedOrder['issueType'], number>;
        escalated: number;
        avgResolutionTime: number; // in hours
    } {
        const orders = this.getSuspendedOrders();

        const byStatus = orders.reduce(
            (acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            },
            {} as Record<SuspendedOrder['status'], number>,
        );

        const byPriority = orders.reduce(
            (acc, order) => {
                acc[order.priority] = (acc[order.priority] || 0) + 1;
                return acc;
            },
            {} as Record<SuspendedOrder['priority'], number>,
        );

        const byIssueType = orders.reduce(
            (acc, order) => {
                acc[order.issueType] = (acc[order.issueType] || 0) + 1;
                return acc;
            },
            {} as Record<SuspendedOrder['issueType'], number>,
        );

        const escalated = orders.filter((order) => order.escalationLevel > 0).length;

        const resolvedOrders = orders.filter(
            (order) => order.status === 'resolved' && order.resolvedAt,
        );
        const avgResolutionTime =
            resolvedOrders.length > 0
                ? resolvedOrders.reduce((sum, order) => {
                      const suspendedTime = new Date(order.suspendedAt).getTime();
                      const resolvedTime = new Date(order.resolvedAt!).getTime();
                      return sum + (resolvedTime - suspendedTime);
                  }, 0) /
                  resolvedOrders.length /
                  (1000 * 60 * 60) // Convert to hours
                : 0;

        return {
            total: orders.length,
            byStatus,
            byPriority,
            byIssueType,
            escalated,
            avgResolutionTime,
        };
    }
}

// Export singleton instance
export const suspendedOrderService = new SuspendedOrderService();
