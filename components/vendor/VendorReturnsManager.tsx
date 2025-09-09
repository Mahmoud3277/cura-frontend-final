'use client';

import { useState, useEffect } from 'react';
import { orderReturnService } from '@/lib/services/orderReturnService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { getProductImageUrl } from '@/lib/utils/image-helpers';

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

// Helper function to get product image URL, utilizing the provided getProductImageUrl utility
const getProductImage = (imageString: string) => {
    try {
        const imageObject = JSON.parse(imageString);
        return getProductImageUrl(imageObject);
    } catch (error) {
        return '/placeholder-product.png'; // fallback image
    }
};

const formatQuantity = (quantity: number, category: string) => {
    // This helper function seems fine as is
    return `Qty: ${quantity}`;
};

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
    }, [statusFilter, processingId]); // Add processingId to dependencies

    const loadReturns = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: '1',
                limit: '10',
            });

            if (statusFilter) {
                params.append('status', statusFilter);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/vendors/${vendorId}/returned-orders?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(Cookies.get('authToken') && { Authorization: `Bearer ${Cookies.get('authToken')}` }),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch returned orders: ${response.status}`);
            }

            const apiResponse = await response.json();
            console.log('Vendor returns API response:', apiResponse);

            setSummary(apiResponse.data.summary);
            setPagination(apiResponse.data.pagination);
            setReturns(apiResponse.data.returnedOrders);
        } catch (error) {
            console.error('Error loading returns:', error);
            setReturns([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (returnId: string, newStatus: string) => {
        setProcessingId(returnId);
        try {
            console.log('New status for vendor return:', newStatus);

            if (newStatus === 'approved' || newStatus === 'rejected') {
                const endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/return/${returnId}/process`;
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('authToken')}`,
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        notes: `Return ${newStatus} by vendor`,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to ${newStatus} return`);
                }
            } else if (newStatus === 'refunded') {
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
            case 'return-requested':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'refunded':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'return-requested':
                return 'Pending Review';
            case 'approved':
                return 'Approved';
            case 'refunded':
                return 'Refunded';
            case 'rejected':
                return 'Rejected';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-cura-primary mx-auto mb-4"
                    ></div>
                    <p className="text-cura-light">
                        Loading returns...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-6 rounded-full border-2 border-cura-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-cura-primary rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Returns & Refunds
                </h2>
            </div>
            
            <div className="space-y-4">
                {returns.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Returns Found
                        </h3>
                        <p className="text-gray-600">
                            No return requests yet.
                        </p>
                    </div>
                ) : (
                    returns.map((returnItem) => {
                        const firstItem = returnItem.orderId.items[0];
                        const productImage = getProductImage(firstItem.image);

                        return (
                            <div
                                key={returnItem._id}
                                className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-cura-primary rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">
                                                    {returnItem.orderId.orderNumber?.split('-')[2] || 'ORD'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    Order: {returnItem.orderId.orderNumber || returnItem.orderId._id}
                                                </h4>
                                                <p className="text-sm text-cura-light">
                                                    {returnItem.orderId.customerPhone} • {returnItem.orderId.customerName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Badge
                                                className={`${getStatusColor(returnItem.status)} uppercase text-xs font-medium px-3 py-1 border`}
                                            >
                                                {getStatusLabel(returnItem.status)}
                                            </Badge>
                                            <span className="text-lg font-bold text-cura-secondary">
                                                EGP {returnItem.refundAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="font-medium text-gray-900 mb-3">
                                            Returned Product{returnItem.orderId.items.length > 1 ? 's' : ''}
                                        </h5>
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-cura-light/20">
                                                <img
                                                    src={productImage}
                                                    alt={firstItem.productName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/placeholder-product.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h6 className="font-medium text-gray-900">
                                                            {firstItem.productName}
                                                            {returnItem.orderId.items.length > 1 && (
                                                                <span className="text-sm text-cura-light ml-2">
                                                                    +{returnItem.orderId.items.length - 1} more
                                                                </span>
                                                            )}
                                                        </h6>
                                                        <p className="text-sm text-cura-light">
                                                            {firstItem.manufacturer}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-cura-secondary">
                                                            {formatQuantity(firstItem.quantity, firstItem.category)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {returnItem.orderId.returnInfo && (
                                        <div className="mb-4 p-4 bg-cura-primary/5 rounded-lg">
                                            <div className="flex items-start space-x-2">
                                                <svg
                                                    className="w-5 h-5 text-cura-primary mt-0.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <div className="flex-1">
                                                    <h6 className="font-medium text-cura-secondary mb-1">
                                                        Return Reason: {returnItem.orderId.returnInfo.reason}
                                                    </h6>
                                                    {returnItem.orderId.returnInfo.notes && (
                                                        <p className="text-sm text-cura-accent">
                                                            {returnItem.orderId.returnInfo.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2 text-sm text-cura-light">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>
                                                {new Date(returnItem.requestedAt).toLocaleDateString('en-GB')}
                                                {' '}
                                                •{' '}
                                                {new Date(returnItem.requestedAt).toLocaleTimeString('en-GB', { hour12: false })}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
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
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-cura-primary text-white hover:bg-cura-secondary"
                                                        onClick={() =>
                                                            handleUpdateStatus(returnItem.returnId, 'approved')
                                                        }
                                                        disabled={processingId === returnItem.returnId}
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
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
                                                >
                                                    {processingId === returnItem.returnId
                                                        ? 'Processing...'
                                                        : 'Complete Refund'}
                                                </Button>
                                            )}
                                            {(returnItem.status === 'rejected' || returnItem.status === 'refunded') && (
                                                <div className="text-sm text-cura-light">
                                                    {returnItem.orderId.returnInfo?.processedAt && (
                                                        <>
                                                            Processed on{' '}
                                                            {new Date(returnItem.orderId.returnInfo.processedAt).toLocaleDateString('en-GB')}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}