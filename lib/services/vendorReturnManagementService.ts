'use client';

import { getAuthToken } from '@/lib/utils/cookies';

export interface VendorReturnRequest {
    _id: string;
    returnId: string;
    status: string;
    refundAmount: number;
    requestedAt: string;
    orderId: {
        _id: string;
        orderNumber: string;
        customerPhone: string;
        customerName: string;
        items: Array<{
            productName: string;
            image: string;
            manufacturer: string;
            quantity: number;
            category: string;
        }>;
        returnInfo?: {
            id: string;
            reason: string;
            notes?: string;
            processedAt?: string;
        };
    };
}

export interface VendorReturnSummary {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalRefundAmount: number;
}

export interface VendorReturnResponse {
    success: boolean;
    data: {
        returnedOrders: VendorReturnRequest[];
        summary: VendorReturnSummary;
        pagination: {
            current: number;
            total: number;
            count: number;
            totalRecords: number;
        };
    };
}

class VendorReturnManagementService {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    private getHeaders(): HeadersInit {
        const token = getAuthToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Get all returned orders for a vendor
     */
    async getVendorReturns(
        vendorId: string,
        options?: {
            status?: string;
            page?: number;
            limit?: number;
        }
    ): Promise<VendorReturnResponse> {
        const params = new URLSearchParams({
            page: (options?.page || 1).toString(),
            limit: (options?.limit || 10).toString(),
        });

        if (options?.status) {
            params.append('status', options.status);
        }

        const endpoint = `${this.baseUrl}/vendors/${vendorId}/returned-orders?${params}`;
        return this.makeRequest<VendorReturnResponse>(endpoint);
    }

    /**
     * Process a return request (approve/reject)
     */
    async processReturn(
        returnId: string,
        action: 'approved' | 'rejected',
        notes?: string
    ): Promise<{ success: boolean; message: string }> {
        const endpoint = `${this.baseUrl}/orders/return/${returnId}/process`;
        
        return this.makeRequest<{ success: boolean; message: string }>(endpoint, {
            method: 'PUT',
            body: JSON.stringify({
                status: action,
                notes: notes || `Return ${action} by vendor`,
            }),
        });
    }

    /**
     * Process refund for an approved return
     */
    async processRefund(
        returnId: string,
        refundNotes?: string
    ): Promise<{ success: boolean; message: string }> {
        const endpoint = `${this.baseUrl}/orders/return/${returnId}/refund`;
        
        return this.makeRequest<{ success: boolean; message: string }>(endpoint, {
            method: 'PUT',
            body: JSON.stringify({
                refundNotes: refundNotes || 'Refund processed from vendor dashboard',
            }),
        });
    }

    /**
     * Get return statistics for a vendor
     */
    async getReturnStats(vendorId: string): Promise<{
        success: boolean;
        data: VendorReturnSummary;
    }> {
        const endpoint = `${this.baseUrl}/vendors/${vendorId}/returns/stats`;
        return this.makeRequest<{ success: boolean; data: VendorReturnSummary }>(endpoint);
    }

    /**
     * Get return details by return ID
     */
    async getReturnById(returnId: string): Promise<{
        success: boolean;
        data: VendorReturnRequest;
    }> {
        const endpoint = `${this.baseUrl}/orders/return/${returnId}`;
        return this.makeRequest<{ success: boolean; data: VendorReturnRequest }>(endpoint);
    }

    /**
     * Update return status with custom notes
     */
    async updateReturnStatus(
        returnId: string,
        status: string,
        notes?: string
    ): Promise<{ success: boolean; message: string }> {
        const endpoint = `${this.baseUrl}/orders/return/${returnId}/status`;
        
        return this.makeRequest<{ success: boolean; message: string }>(endpoint, {
            method: 'PUT',
            body: JSON.stringify({
                status,
                notes,
            }),
        });
    }

    /**
     * Bulk process returns
     */
    async bulkProcessReturns(
        returnIds: string[],
        action: 'approved' | 'rejected',
        notes?: string
    ): Promise<{ success: boolean; processed: number; failed: number }> {
        const endpoint = `${this.baseUrl}/orders/returns/bulk-process`;
        
        return this.makeRequest<{ success: boolean; processed: number; failed: number }>(endpoint, {
            method: 'PUT',
            body: JSON.stringify({
                returnIds,
                action,
                notes,
            }),
        });
    }

    /**
     * Get vendor return analytics
     */
    async getReturnAnalytics(
        vendorId: string,
        dateRange?: { start: string; end: string }
    ): Promise<{
        success: boolean;
        data: {
            totalReturns: number;
            returnRate: number;
            avgRefundAmount: number;
            topReasons: Array<{ reason: string; count: number }>;
            monthlyTrend: Array<{ month: string; returns: number; refunds: number }>;
        };
    }> {
        const params = new URLSearchParams();
        if (dateRange?.start) params.append('startDate', dateRange.start);
        if (dateRange?.end) params.append('endDate', dateRange.end);

        const endpoint = `${this.baseUrl}/vendors/${vendorId}/returns/analytics?${params}`;
        return this.makeRequest<{
            success: boolean;
            data: {
                totalReturns: number;
                returnRate: number;
                avgRefundAmount: number;
                topReasons: Array<{ reason: string; count: number }>;
                monthlyTrend: Array<{ month: string; returns: number; refunds: number }>;
            };
        }>(endpoint);
    }
}

// Export singleton instance
export const vendorReturnManagementService = new VendorReturnManagementService();
