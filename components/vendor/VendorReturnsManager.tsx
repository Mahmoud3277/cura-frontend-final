'use client';

import { useState, useEffect } from 'react';
import { OrderReturn } from '@/lib/types';
import { orderReturnService } from '@/lib/services/orderReturnService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import Cookies from 'js-cookie';

interface VendorReturnsManagerProps {
    vendorId: string;
}

// Enhanced return interface matching the actual API response
interface EnhancedReturn {
    _id: string;
    returnId: string;
    status: string;
    refundAmount: number;
    requestedAt: string;
    orderId: {
        id: string;
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

export function VendorReturnsManager({ vendorId }: VendorReturnsManagerProps) {
    const [returns, setReturns] = useState<EnhancedReturn[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [summary, setSummary] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalRefundAmount: 0,
    });
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        count: 0,
        totalRecords: 0,
    });
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        loadReturns();
    }, [statusFilter]);

    const loadReturns = async () => {
        setLoading(true);
        try {
            // Build query parameters
            const params = new URLSearchParams({
                page: '1',
                limit: '10', // Default limit
            });

            if (statusFilter) {
                params.append('status', statusFilter);
            }

            // Make API call to fetch returned orders for vendor
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/vendors/${vendorId}/returned-orders?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Use cookies for token like the rest of the app
                    ...(Cookies.get('authToken') && { Authorization: `Bearer ${Cookies.get('authToken')}` }),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch returned orders: ${response.status}`);
            }

            const apiResponse = await response.json();
            console.log('Vendor returns API response:', apiResponse);
            // Update summary and pagination state
            setSummary(apiResponse.data.summary);
            setPagination(apiResponse.data.pagination);

            // Just use the API response data directly
            setReturns(apiResponse.data.returnedOrders);
        } catch (error) {
            console.error('Error loading returns:', error);
            // Set empty array on error to prevent crashes
            setReturns([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (returnId: string, newStatus: string) => {
        setProcessingId(returnId);
        try {
            console.log('New status for vendor return:', newStatus);
            // Use the order return service to update status
            if (newStatus === 'approved') {
                console.log('Approving return:', returnId);
                await orderReturnService.processReturn(returnId, 'approved');
            } else if (newStatus === 'rejected') {
                await orderReturnService.processReturn(returnId, 'reject');
            } else if (newStatus === 'refund-approved') {
                // TODO: Implement refund approval - for now using processReturn
                console.log('Refund approval for:', returnId);
                // await orderReturnService.processRefund(returnId, 'approve');
            } else if (newStatus === 'refunded') {
                // Process refund for approved returns
                const refundResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/return/${returnId}/refund`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('authToken')}`,
                    },
                    body: JSON.stringify({
                        refundNotes: 'Refund processed from vendor dashboard'
                    }),
                });

                if (!refundResponse.ok) {
                    const errorData = await refundResponse.json();
                    throw new Error(errorData.error || 'Failed to process refund');
                }

                const refundData = await refundResponse.json();
                console.log('Refund processed successfully:', refundData);
            }

            // Refresh data after status update
            loadReturns();
        } catch (error) {
            console.error('Error updating return status:', error);
            alert(`Failed to update return status to ${newStatus}. Please try again.`);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'return-requested':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'refunded':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved':
                return 'approved-refunded';
            case 'return-requested':
                return 'return-requested';
            case 'refunded':
                return 'refunded';
            case 'rejected':
                return 'rejected';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="0:ttsah">
                <div className="text-center" data-oid="1k88ywi">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-cura-primary mx-auto mb-4"
                        data-oid="4ob6uzt"
                    ></div>
                    <p className="text-cura-light" data-oid="q4hqe_s">
                        Loading returns...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="49aj-14">
            {/* Header with Returns & Refunds title */}
            <div className="flex items-center space-x-2 mb-6" data-oid="2e7tkj:">
                <div
                    className="w-6 h-6 rounded-full border-2 border-cura-primary flex items-center justify-center"
                    data-oid="5-ed0-q"
                >
                    <div className="w-2 h-2 bg-cura-primary rounded-full" data-oid="4ck:4_7"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900" data-oid="xrwwllb">
                    Returns & Refunds
                </h2>
            </div>

            {/* Enhanced Returns List */}
            <div className="space-y-4" data-oid="fubppp8">
                {returns.length === 0 ? (
                    <div className="text-center py-12" data-oid="e8dk2.i">
                        <div className="text-6xl mb-4" data-oid="_q1gr.x">
                            📦
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="qg8qg2u">
                            No Returns Found
                        </h3>
                        <p className="text-gray-600" data-oid="0.cptpv">
                            No return requests yet.
                        </p>
                    </div>
                ) : (
                    returns.map((returnItem) => {
                        // Get the first item from the order for display
                        const firstItem = returnItem.orderId.items[0];
                        const productImage = getProductImage(firstItem.image);

                        return (
                            <div
                                key={returnItem._id}
                                className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden"
                                data-oid="enhanced-return-card"
                            >
                                <div className="p-6" data-oid="return-card-content">
                                    {/* Header with Order ID and Status */}
                                    <div
                                        className="flex items-center justify-between mb-4"
                                        data-oid="return-header"
                                    >
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="return-order-info"
                                        >
                                            <div
                                                className="w-10 h-10 bg-cura-primary rounded-lg flex items-center justify-center"
                                                data-oid="return-order-icon"
                                            >
                                                <span
                                                    className="text-white font-bold text-sm"
                                                    data-oid="return-order-number"
                                                >
                                                    {returnItem.orderId.orderNumber?.split('-')[2] || 'ORD'}
                                                </span>
                                            </div>
                                            <div data-oid="return-order-details">
                                                <h4
                                                    className="font-semibold text-gray-900"
                                                    data-oid="return-order-id"
                                                >
                                                    {returnItem.orderId.orderNumber || returnItem.orderId.id}
                                                </h4>
                                                <p
                                                    className="text-sm text-cura-light"
                                                    data-oid="return-customer-phone"
                                                >
                                                    {returnItem.orderId.customerPhone} • {returnItem.orderId.customerName}
                                                </p>
                                            </div>
                                        </div>
                                    <div
                                        className="flex items-center space-x-3"
                                        data-oid="return-status-amount"
                                    >
                                        <Badge
                                            className={`${getStatusColor(returnItem.status)} uppercase text-xs font-medium px-3 py-1 border`}
                                            data-oid="return-status-badge"
                                        >
                                            {getStatusLabel(returnItem.status)}
                                        </Badge>
                                        <span
                                            className="text-lg font-bold text-cura-secondary"
                                            data-oid="return-amount"
                                        >
                                            EGP {returnItem.refundAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Information with Image */}
                                <div className="mb-4" data-oid="return-product-section">
                                    <h5
                                        className="font-medium text-gray-900 mb-3"
                                        data-oid="return-product-title"
                                    >
                                        Returned Product{returnItem.orderId.items.length > 1 ? 's' : ''}
                                    </h5>
                                    <div
                                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                                        data-oid="return-product-info"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-lg overflow-hidden border border-cura-light/20"
                                            data-oid="return-product-image-container"
                                        >
                                            <img
                                                src={productImage}
                                                alt={firstItem.productName}
                                                className="w-full h-full object-cover"
                                                data-oid="return-product-image"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1" data-oid="return-product-details">
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="return-product-info-row"
                                            >
                                                <div data-oid="return-product-name-manufacturer">
                                                    <h6
                                                        className="font-medium text-gray-900"
                                                        data-oid="return-product-name"
                                                    >
                                                        {firstItem.productName}
                                                        {returnItem.orderId.items.length > 1 && (
                                                            <span className="text-sm text-cura-light ml-2">
                                                                +{returnItem.orderId.items.length - 1} more
                                                            </span>
                                                        )}
                                                    </h6>
                                                    <p
                                                        className="text-sm text-cura-light"
                                                        data-oid="return-product-manufacturer"
                                                    >
                                                        {firstItem.manufacturer}
                                                    </p>
                                                </div>
                                                <div
                                                    className="text-right"
                                                    data-oid="return-product-quantity"
                                                >
                                                    <p
                                                        className="text-sm font-medium text-cura-secondary"
                                                        data-oid="return-quantity-label"
                                                    >
                                                        {formatQuantity(firstItem.quantity, firstItem.category)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Return Reason */}
                                {returnItem.orderId.returnInfo && (
                                    <div
                                        className="mb-4 p-4 bg-cura-primary/5 rounded-lg"
                                        data-oid="return-reason-section"
                                    >
                                        <div
                                            className="flex items-start space-x-2"
                                            data-oid="return-reason-content"
                                        >
                                            <svg
                                                className="w-5 h-5 text-cura-primary mt-0.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="return-reason-icon"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    data-oid="return-reason-path"
                                                />
                                            </svg>
                                            <div className="flex-1" data-oid="return-reason-text">
                                                <h6
                                                    className="font-medium text-cura-secondary mb-1"
                                                    data-oid="return-reason-title"
                                                >
                                                    Return Reason: {returnItem.orderId.returnInfo.reason}
                                                </h6>
                                                {returnItem.orderId.returnInfo.notes && (
                                                    <p
                                                        className="text-sm text-cura-accent"
                                                        data-oid="return-reason-notes"
                                                    >
                                                        {returnItem.orderId.returnInfo.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Footer with Actions */}
                                <div
                                    className="flex items-center justify-between pt-4 border-t border-gray-200"
                                    data-oid="return-footer"
                                >
                                    <div
                                        className="flex items-center space-x-2 text-sm text-cura-light"
                                        data-oid="return-timestamp"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="return-clock-icon"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="return-clock-path"
                                            />
                                        </svg>
                                        <span data-oid="return-date">
                                            {new Date(returnItem.requestedAt).toLocaleDateString(
                                                'en-GB',
                                            )}{' '}
                                            •{' '}
                                            {new Date(returnItem.requestedAt).toLocaleTimeString(
                                                'en-GB',
                                                { hour12: false },
                                            )}
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center space-x-2"
                                        data-oid="return-actions"
                                    >
                                        {returnItem.status === 'return-requested' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() =>
                                                        handleUpdateStatus(returnItem.returnId, 'rejected')
                                                    }
                                                    disabled={processingId === returnItem.returnId}
                                                    data-oid="reject-return-btn"
                                                >
                                                    <X
                                                        className="w-4 h-4 mr-1"
                                                        data-oid="0j0v80u"
                                                    />
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-cura-primary text-white hover:bg-cura-secondary"
                                                    onClick={() =>
                                                        handleUpdateStatus(returnItem.returnId, 'approved')
                                                    }
                                                    disabled={processingId === returnItem.returnId}
                                                    data-oid="approve-return-btn"
                                                >
                                                    <Check
                                                        className="w-4 h-4 mr-1"
                                                        data-oid="pmmcten"
                                                    />

                                                    {processingId === returnItem.returnId
                                                        ? 'Processing...'
                                                        : 'Approve Return'}
                                                </Button>
                                            </>
                                        )}
                                        {returnItem.status === 'approved' && (
                                            <Button
                                                size="sm"
                                                className="bg-green-600 text-white hover:bg-green-700"
                                                onClick={() =>
                                                    handleUpdateStatus(returnItem.returnId, 'refunded')
                                                }
                                                disabled={processingId === returnItem.returnId}
                                                data-oid="complete-refund-btn"
                                            >
                                                {processingId === returnItem.returnId
                                                    ? 'Processing...'
                                                    : 'Complete Refund'}
                                            </Button>
                                        )}
                                        {returnItem.status !== 'return-requested' && returnItem.status !== 'approved' && (
                                            <div
                                                className="text-sm text-cura-light"
                                                data-oid="return-processed-info"
                                            >
                                                {returnItem.orderId.returnInfo?.processedAt && (
                                                    <>
                                                        Processed on{' '}
                                                        {new Date(
                                                            returnItem.orderId.returnInfo.processedAt,
                                                        ).toLocaleDateString('en-GB')}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
