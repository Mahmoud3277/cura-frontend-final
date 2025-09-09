import { Order, OrderReturn, ReturnItem } from '@/lib/types';
import { getAuthToken } from '../utils/cookies';

export interface ReturnRequest {
    orderId: string;
    customerId: string;
    reason: string;
    description?: string;
    returnItems: {
        orderItemId: string;
        productId: string;
        quantity: number;
        reason: string;
        condition: 'unopened' | 'opened' | 'damaged' | 'expired';
    }[];
    customerNotes?: string;
}

export interface ReturnPolicy {
    maxReturnDays: number;
    allowedReasons: string[];
    refundPercentages: {
        unopened: number;
        opened: number;
        damaged: number;
        expired: number;
    };
    nonReturnableCategories: string[];
}

class OrderReturnService {
    private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    private returnPolicy: ReturnPolicy = {
        maxReturnDays: 2,
        allowedReasons: [
            'Product damaged/defective',
            'Wrong item received',
            'Product expired',
            'No longer needed',
            'Doctor changed prescription',
            'Other',
        ],
        refundPercentages: {
            unopened: 100,
            opened: 80,
            damaged: 50,
            expired: 100,
        },
        nonReturnableCategories: [
            'prescription-controlled',
            'liquid-medicine',
            'opened-supplements',
        ],
    };

    // Helper method to get auth token (to be implemented based on your auth context)
    private getAuthToken2(): string | null {
        const token = getAuthToken();
        if(token){
            return token;
        }
        return null;
    }

    getReturnPolicy(): ReturnPolicy {
        return this.returnPolicy;
    }

    canReturnOrder(order: Order): { canReturn: boolean; reason?: string } {
        // Check if order is within return window
        const orderDate = new Date(order.createdAt);
        const daysSinceOrder = Math.floor(
            (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysSinceOrder > this.returnPolicy.maxReturnDays) {
            return {
                canReturn: false,
                reason: `Return window expired. Orders can only be returned within ${this.returnPolicy.maxReturnDays} days.`,
            };
        }

        // Check order status
        if (order.status !== 'delivered') {
            return {
                canReturn: false,
                reason: 'Order must be delivered before it can be returned.',
            };
        }

        // Check if already returned
        if (order.returnInfo && order.returnInfo.status !== 'rejected') {
            return {
                canReturn: false,
                reason: 'This order has already been returned or has a pending return request.',
            };
        }

        return { canReturn: true };
    }

    calculateRefundAmount(order: Order, returnItems: ReturnItem[]): number {
        let totalRefund = 0;

        returnItems.forEach((returnItem) => {
            const orderItem = order.items.find((item) => item.productId === returnItem.productId);

            if (orderItem) {
                const itemTotal = orderItem.price * returnItem.quantity;
                const refundPercentage = this.returnPolicy.refundPercentages[returnItem.condition];
                const itemRefund = (itemTotal * refundPercentage) / 100;
                totalRefund += itemRefund;
            }
        });

        return Math.round(totalRefund * 100) / 100; // Round to 2 decimal places
    }

    async submitReturnRequest(
        request: ReturnRequest,
    ): Promise<{ success: boolean; returnId?: string; error?: string }> {
        try {
            const token = this.getAuthToken2();
            if (!token) {
                return {
                    success: false,
                    error: 'Authentication required. Please log in again.'
                };
            }

            const response = await fetch(`${this.apiUrl}/orders/${request.orderId}/return`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    reason: request.reason,
                    description: request.description,
                    returnItems: request.returnItems,
                    customerNotes: request.customerNotes
                }),
            });

            const data = await response.json();

            if (!response) {
                return { 
                    success: false, 
                    error: data.error || 'Failed to submit return request' 
                };
            }

            return { 
                success: true, 
                returnId: data.data.returnId 
            };

        } catch (error) {
            console.error('Error submitting return request:', error);
            return { 
                success: false, 
                error: 'Network error. Please check your connection and try again.' 
            };
        }
    }

    async getCustomerReturns(): Promise<OrderReturn[]> {
        try {
            const token = this.getAuthToken2();
            if (!token) {
                throw new Error('No auth token found');
            }

            const response = await fetch(`${this.apiUrl}/orders/customer/returns`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response) {
                throw new Error(data.error || 'Failed to fetch returns');
            }

            return data.data || [];

        } catch (error) {
            console.error('Error fetching customer returns:', error);
            return [];
        }
    }

    async processReturn(
        returnId: string,
        action: 'approved' | 'reject',
        adminNotes?: string,
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const token = this.getAuthToken2();
            if (!token) {
                return {
                    success: false,
                    error: 'Authentication required'
                };
            }

            const response = await fetch(`${this.apiUrl}/orders/return/${returnId}/process`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    action,
                    adminNotes
                }),
            });

            const data = await response.json();

            if (!response) {
                return { 
                    success: false, 
                    error: data.error || 'Failed to process return' 
                };
            }

            return { success: true };

        } catch (error) {
            console.error('Error processing return:', error);
            return { 
                success: false, 
                error: 'Failed to process return' 
            };
        }
    }

    getReturnStatistics() {
        // This would typically come from the backend
        return {
            totalReturns: 0,
            approvedReturns: 0,
            rejectedReturns: 0,
            pendingReturns: 0,
            totalRefundAmount: 0,
            averageRefundAmount: 0,
            returnRate: 0,
        };
    }
}

export const orderReturnService = new OrderReturnService();