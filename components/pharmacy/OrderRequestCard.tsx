'use client';

import { useState } from 'react';
import { PharmacyOrder } from '@/lib/services/pharmacyOrderService';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface OrderRequestCardProps {
    order: PharmacyOrder;
    onAccept: (orderId: string, estimatedTime?: number, notes?: string) => void;
    onReject: (orderId: string, reason: string) => void;
    onViewDetails: (orderId: string) => void;
    onPrescriptionReview?: (orderId: string, prescriptionId: string) => void;
}

export function OrderRequestCard({
    order,
    onAccept,
    onReject,
    onViewDetails,
    onPrescriptionReview,
}: OrderRequestCardProps) {
    const { t } = useTranslation();
    const [showActions, setShowActions] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(30);
    const [notes, setNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'low':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'preparing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ready':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            await onAccept(order.id, estimatedTime, notes);
            setShowActions(false);
            setNotes('');
        } catch (error) {
            console.error('Error accepting order:', error);
            if (error instanceof Error && error.message.includes('Prescription must be verified')) {
                alert('Please verify the prescription before accepting this order.');
            } else {
                alert('Error accepting order. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) return;

        setIsProcessing(true);
        try {
            await onReject(order.id, rejectionReason);
            setShowRejectModal(false);
            setRejectionReason('');
        } catch (error) {
            console.error('Error rejecting order:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <>
            <div
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                data-oid="ejbdfq9"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4" data-oid="p6336_4">
                    <div className="flex-1" data-oid="wi1e7wk">
                        <div className="flex items-center gap-3 mb-2" data-oid="qbpbkyn">
                            <h3 className="font-semibold text-gray-900" data-oid="rzqw:ax">
                                {order.orderNumber}
                            </h3>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}
                                data-oid="tm7mtv9"
                            >
                                {order.priority.toUpperCase()}
                            </span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                                data-oid="8y8lt90"
                            >
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600" data-oid=":rr51v-">
                            {order.customerName} • {formatTime(order.createdAt)}
                        </p>
                    </div>
                    <div className="text-right" data-oid="6yrqhm-">
                        <p className="font-semibold text-lg text-gray-900" data-oid="v--:u8m">
                            EGP {order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500" data-oid="6.bhwag">
                            {order.items.length} item(s)
                        </p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3 mb-4" data-oid="sl3c1lw">
                    <div className="flex items-center justify-between text-sm" data-oid="sg2:3fd">
                        <span className="text-gray-600" data-oid="hjpv6an">
                            Customer:
                        </span>
                        <span className="font-medium" data-oid="usbepir">
                            {order.customerName}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm" data-oid="-ks84jd">
                        <span className="text-gray-600" data-oid="eiufdo:">
                            Phone:
                        </span>
                        <span className="font-medium" data-oid="jmw7:_w">
                            {order.customerPhone}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm" data-oid="8e8_zup">
                        <span className="text-gray-600" data-oid="re-shoc">
                            Address:
                        </span>
                        <span
                            className="font-medium text-right max-w-xs truncate"
                            data-oid="zagf:5:"
                        >
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}
                        </span>
                    </div>
                    {order.prescriptionId && (
                        <div
                            className="flex items-center justify-between text-sm"
                            data-oid="9z3gl1o"
                        >
                            <span className="text-gray-600" data-oid="-827t2:">
                                Prescription:
                            </span>
                            <div className="flex items-center gap-2" data-oid="r44y5o9">
                                <span
                                    className={`font-medium ${
                                        order.prescriptionRequired && order.prescriptionVerified === true
                                            ? 'text-green-600'
                                            : order.prescriptionRequired && order.prescriptionVerified === false
                                              ? 'text-red-600'
                                              : 'text-yellow-600'
                                    }`}
                                    data-oid="5m4fzqp"
                                >
                                    {order.prescriptionRequired && order.prescriptionVerified === true
                                        ? 'Verified ✓'
                                        : order.prescriptionRequired && order.prescriptionVerified === false
                                          ? 'Issue Found ❌'
                                          : 'Pending Review ⏳'}
                                </span>
                                {order.prescriptionRequired && order.prescriptionVerified === undefined &&
                                    onPrescriptionReview && (
                                        <button
                                            onClick={() =>
                                                onPrescriptionReview(
                                                    order.id,
                                                    order.prescriptionId!,
                                                )
                                            }
                                            className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
                                            data-oid="sfeafc3"
                                        >
                                            Review
                                        </button>
                                    )}
                            </div>
                        </div>
                    )}
                    {order.notes && (
                        <div className="text-sm" data-oid="85sl:-5">
                            <span className="text-gray-600" data-oid="pb6z19n">
                                Notes:
                            </span>
                            <p className="text-gray-900 mt-1" data-oid="x3nx2le">
                                {order.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Items Preview */}
                <div className="border-t border-gray-100 pt-3 mb-4" data-oid="i.026-e">
                    <h4 className="text-sm font-medium text-gray-900 mb-2" data-oid="kjq2dxd">
                        Order Items:
                    </h4>
                    <div className="space-y-2" data-oid="1gz7w7y">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                                data-oid="hnsq1r:"
                            >
                                <div className="flex-1" data-oid=".-op1q6">
                                    <span className="font-medium" data-oid="pbuosqi">
                                        {item.productName}
                                    </span>
                                    {item.prescription && (
                                        <span
                                            className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                                            data-oid=".av1_u-"
                                        >
                                            Rx
                                        </span>
                                    )}
                                </div>
                                <div className="text-right" data-oid="5zr26_n">
                                    <span className="text-gray-600" data-oid="k-lih.n">
                                        Qty: {item.quantity}
                                    </span>
                                    <span className="ml-3 font-medium" data-oid="m4acxkh">
                                        EGP {item.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2" data-oid="a3v0-at">
                    <button
                        onClick={() => onViewDetails(order.id)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        data-oid="woktmje"
                    >
                        View Details
                    </button>

                    {order.status === 'pending' && (
                        <>
                            {/* Accept button - disabled if prescription verification required */}
                            <button
                                onClick={() => setShowActions(!showActions)}
                                disabled={
                                    order.prescriptionId &&
                                    order.items.some((item) => item.prescription) &&
                                    order.prescriptionRequired && order.prescriptionVerified !== true
                                }
                                className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                    order.prescriptionId &&
                                    order.items.some((item) => item.prescription) &&
                                    order.prescriptionRequired && order.prescriptionVerified !== true
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                                title={
                                    order.prescriptionId &&
                                    order.items.some((item) => item.prescription) &&
                                    order.prescriptionRequired && order.prescriptionVerified !== true
                                        ? 'Please verify prescription before accepting'
                                        : 'Accept this order'
                                }
                                data-oid="dxbw1ho"
                            >
                                {order.prescriptionId &&
                                order.items.some((item) => item.prescription) &&
                                order.prescriptionRequired && order.prescriptionVerified !== true
                                    ? 'Verify Prescription First'
                                    : 'Accept Order'}
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                data-oid="lsvp954"
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>

                {/* Accept Order Form */}
                {showActions && order.status === 'pending' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border" data-oid="5.30sea">
                        <h4 className="font-medium text-gray-900 mb-3" data-oid="gsgf54h">
                            Accept Order Details
                        </h4>
                        <div className="space-y-3" data-oid="5se4qf-">
                            <div data-oid="xwl1h7x">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="e1fn_1j"
                                >
                                    Estimated Preparation Time (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={estimatedTime}
                                    onChange={(e) =>
                                        setEstimatedTime(parseInt(e.target.value) || 30)
                                    }
                                    min="15"
                                    max="180"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    data-oid="eg2lthf"
                                />
                            </div>
                            <div data-oid="0ikhftd">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="2htiaa8"
                                >
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any special instructions or notes..."
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    data-oid="::giif9"
                                />
                            </div>
                            <div className="flex gap-2" data-oid="r7fa_iq">
                                <button
                                    onClick={handleAccept}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                    data-oid="4.52guc"
                                >
                                    {isProcessing ? 'Processing...' : 'Confirm Accept'}
                                </button>
                                <button
                                    onClick={() => setShowActions(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                    data-oid="-ya.:j1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="2ugbaah"
                >
                    <div
                        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
                        data-oid="g6ryo8m"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="yxp9n5y">
                            Reject Order
                        </h3>
                        <p className="text-gray-600 mb-4" data-oid="3tghw2n">
                            Please provide a reason for rejecting order {order.orderNumber}:
                        </p>
                        <div className="space-y-3 mb-4" data-oid="d__292z">
                            {[
                                'Out of stock',
                                'Unable to fulfill prescription',
                                'Delivery area not covered',
                                'Payment issue',
                                'Other',
                            ].map((reason) => (
                                <label
                                    key={reason}
                                    className="flex items-center"
                                    data-oid="zr7ugyt"
                                >
                                    <input
                                        type="radio"
                                        name="rejectionReason"
                                        value={reason}
                                        checked={rejectionReason === reason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="mr-3 text-red-600 focus:ring-red-500"
                                        data-oid="fu8-ocj"
                                    />

                                    <span className="text-sm text-gray-700" data-oid="mts.k5f">
                                        {reason}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {rejectionReason === 'Other' && (
                            <textarea
                                placeholder="Please specify the reason..."
                                value={rejectionReason === 'Other' ? '' : rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                                data-oid="y8fx0e5"
                            />
                        )}
                        <div className="flex gap-3" data-oid="-i.1wjq">
                            <button
                                onClick={handleReject}
                                disabled={!rejectionReason.trim() || isProcessing}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                data-oid="1rjk5yh"
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Reject'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                data-oid="l02kky6"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
