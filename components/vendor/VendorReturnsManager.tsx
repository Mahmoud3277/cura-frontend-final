'use client';

import { useState, useEffect } from 'react';
import { OrderReturn } from '@/lib/types';
import { orderReturnService } from '@/lib/services/orderReturnService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';

interface VendorReturnsManagerProps {
    vendorId: string;
}

// Enhanced return interface with product details
interface EnhancedReturn extends OrderReturn {
    productName: string;
    productImage: string;
    manufacturer: string;
    customerPhone: string;
    quantity: number;
}

export function VendorReturnsManager({ vendorId }: VendorReturnsManagerProps) {
    const [returns, setReturns] = useState<EnhancedReturn[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadReturns();
    }, []);

    const loadReturns = async () => {
        setLoading(true);
        try {
            // Mock enhanced returns data with product details
            const mockReturns: EnhancedReturn[] = [
                {
                    id: 'return-001',
                    orderId: 'ORD-2024-001',
                    customerId: '1',
                    customerPhone: '+20 11 690 7244',
                    productName: 'Wireless Headphones',
                    productImage:
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
                    manufacturer: 'Sony',
                    quantity: 1,
                    reason: 'Product damaged/defective',
                    status: 'requested',
                    refundAmount: 125.5,
                    requestedAt: '2024-01-07T10:30:00Z',
                    processedAt: null,
                    notes: 'Customer reported that the headphones arrived with a cracked headband',
                },
                {
                    id: 'return-002',
                    orderId: 'ORD-2024-002',
                    customerId: '2',
                    customerPhone: '+20 12 731 7479',
                    productName: 'Phone Case',
                    productImage:
                        'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop&crop=center',
                    manufacturer: 'Apple',
                    quantity: 2,
                    reason: 'Wrong item received',
                    status: 'approved',
                    refundAmount: 67.25,
                    requestedAt: '2024-01-06T14:20:00Z',
                    processedAt: '2024-01-07T09:15:00Z',
                    notes: 'Customer ordered iPhone 14 case but received iPhone 13 case',
                },
                {
                    id: 'return-003',
                    orderId: 'ORD-2024-003',
                    customerId: '3',
                    customerPhone: '+20 10 555 1234',
                    productName: 'Bluetooth Speaker',
                    productImage:
                        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
                    manufacturer: 'JBL',
                    quantity: 1,
                    reason: 'No longer needed',
                    status: 'completed',
                    refundAmount: 89.75,
                    requestedAt: '2024-01-05T16:45:00Z',
                    processedAt: '2024-01-07T11:30:00Z',
                    notes: 'Customer changed mind about purchase',
                },
                {
                    id: 'return-004',
                    orderId: 'ORD-2024-004',
                    customerId: '4',
                    customerPhone: '+20 11 777 8888',
                    productName: 'Gaming Mouse',
                    productImage:
                        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center',
                    manufacturer: 'Logitech',
                    quantity: 3,
                    reason: 'Product expired',
                    status: 'rejected',
                    refundAmount: 0.0,
                    requestedAt: '2024-01-04T12:00:00Z',
                    processedAt: '2024-01-05T10:20:00Z',
                    notes: 'Return request submitted after 30-day return window',
                },
            ];

            setReturns(mockReturns);
        } catch (error) {
            console.error('Error loading returns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReturn = async (returnId: string) => {
        setProcessingId(returnId);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setReturns((prev) =>
                prev.map((ret) =>
                    ret.id === returnId
                        ? { ...ret, status: 'approved', processedAt: new Date().toISOString() }
                        : ret,
                ),
            );
        } catch (error) {
            console.error('Error approving return:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectReturn = async (returnId: string) => {
        setProcessingId(returnId);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setReturns((prev) =>
                prev.map((ret) =>
                    ret.id === returnId
                        ? {
                              ...ret,
                              status: 'rejected',
                              processedAt: new Date().toISOString(),
                              refundAmount: 0,
                          }
                        : ret,
                ),
            );
        } catch (error) {
            console.error('Error rejecting return:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-cura-primary/10 text-cura-primary border-cura-primary/20';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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
                    returns.map((returnItem) => (
                        <div
                            key={returnItem.id}
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
                                                {returnItem.orderId.split('-')[2]}
                                            </span>
                                        </div>
                                        <div data-oid="return-order-details">
                                            <h4
                                                className="font-semibold text-gray-900"
                                                data-oid="return-order-id"
                                            >
                                                {returnItem.orderId}
                                            </h4>
                                            <p
                                                className="text-sm text-cura-light"
                                                data-oid="return-customer-phone"
                                            >
                                                {returnItem.customerPhone}
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
                                            {returnItem.status}
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
                                        Returned Product
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
                                                src={returnItem.productImage}
                                                alt={returnItem.productName}
                                                className="w-full h-full object-cover"
                                                data-oid="return-product-image"
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
                                                        {returnItem.productName}
                                                    </h6>
                                                    <p
                                                        className="text-sm text-cura-light"
                                                        data-oid="return-product-manufacturer"
                                                    >
                                                        {returnItem.manufacturer}
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
                                                        Qty: {returnItem.quantity || 1}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Return Reason */}
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
                                                Return Reason: {returnItem.reason}
                                            </h6>
                                            {returnItem.notes && (
                                                <p
                                                    className="text-sm text-cura-accent"
                                                    data-oid="return-reason-notes"
                                                >
                                                    {returnItem.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

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
                                        {returnItem.status === 'requested' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() =>
                                                        handleRejectReturn(returnItem.id)
                                                    }
                                                    disabled={processingId === returnItem.id}
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
                                                        handleApproveReturn(returnItem.id)
                                                    }
                                                    disabled={processingId === returnItem.id}
                                                    data-oid="approve-return-btn"
                                                >
                                                    <Check
                                                        className="w-4 h-4 mr-1"
                                                        data-oid="pmmcten"
                                                    />

                                                    {processingId === returnItem.id
                                                        ? 'Processing...'
                                                        : 'Approve'}
                                                </Button>
                                            </>
                                        )}
                                        {returnItem.status !== 'requested' && (
                                            <div
                                                className="text-sm text-cura-light"
                                                data-oid="return-processed-info"
                                            >
                                                {returnItem.processedAt && (
                                                    <>
                                                        Processed on{' '}
                                                        {new Date(
                                                            returnItem.processedAt,
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
