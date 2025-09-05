'use client';

import { useState } from 'react';
import { NotificationService } from '@/lib/services/notificationService';
import { pharmacyOrderService } from '@/lib/services/pharmacyOrderService';
import { BRAND_COLORS } from '@/lib/constants';

interface PrescriptionReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    prescriptionId: string;
    customerName: string;
    customerPhone: string;
    orderNumber: string;
    customerId: string;
}

export function PrescriptionReviewModal({
    isOpen,
    onClose,
    orderId,
    prescriptionId,
    customerName,
    customerPhone,
    orderNumber,
    customerId,
}: PrescriptionReviewModalProps) {
    const [reviewNotes, setReviewNotes] = useState('');
    const [issueType, setIssueType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            const notes =
                reviewNotes.trim() || 'Prescription reviewed and approved - no issues found';
            await pharmacyOrderService.verifyPrescription(orderId, true, notes);

            await NotificationService.createNotification({
                userId: 'pharmacy-user',
                userRole: 'pharmacy',
                type: 'prescription',
                priority: 'medium',
                title: 'Prescription Approved',
                message: `Prescription for order ${orderNumber} has been verified and approved. The order can now be accepted.`,
                actionUrl: '/pharmacy/orders',
                actionLabel: 'View Order',
                isRead: false,
                isArchived: false,
                data: { orderId, prescriptionId, approved: true },
            });

            onClose();
        } catch (error) {
            console.error('Error approving prescription:', error);
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Error approving prescription. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuspend = async () => {
        if (!issueType || !reviewNotes.trim()) {
            alert(
                'Missing Information\n\nPlease select an issue type and provide detailed review notes before suspending the order.',
            );
            return;
        }

        setIsSubmitting(true);
        try {
            await pharmacyOrderService.verifyPrescription(
                orderId,
                false,
                `Issue: ${issueType} - Details: ${reviewNotes}`,
            );

            await NotificationService.createNotification({
                userId: customerId,
                userRole: 'customer',
                type: 'prescription',
                priority: 'high',
                title: 'Prescription Issue - Order Suspended',
                message: `We found an issue with your prescription for order ${orderNumber}. Our pharmacy team will contact you shortly to resolve this. Issue: ${issueType}`,
                actionUrl: '/customer/orders',
                actionLabel: 'View Order',
                isRead: false,
                isArchived: false,
                data: { orderId, prescriptionId, issueType, notes: reviewNotes },
            });

            await NotificationService.createNotification({
                userId: 'pharmacy-user',
                userRole: 'pharmacy',
                type: 'prescription',
                priority: 'high',
                title: 'Order Suspended - Contact Customer',
                message: `Order ${orderNumber} has been suspended due to prescription issue: ${issueType}. Please contact customer at ${customerPhone} to resolve.`,
                actionUrl: '/pharmacy/orders',
                actionLabel: 'View Order',
                isRead: false,
                isArchived: false,
                data: { orderId, prescriptionId, issueType, notes: reviewNotes, customerPhone },
            });

            onClose();
        } catch (error) {
            console.error('Error suspending order:', error);
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Error suspending order. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            data-oid="wz3mg5_"
        >
            <div
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                data-oid="m7i7xrt"
            >
                {/* Header */}
                <div
                    className="p-6 text-white rounded-t-2xl"
                    style={{
                        background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
                    }}
                    data-oid="u0-lf76"
                >
                    <div className="flex items-center justify-between" data-oid="-:ut9u2">
                        <div className="flex items-center space-x-3" data-oid="i3phuek">
                            <div
                                className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"
                                data-oid="lpqrvt6"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid="n4x8y0z"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                        clipRule="evenodd"
                                        data-oid="pahod2y"
                                    />
                                </svg>
                            </div>
                            <div data-oid="ejenp1o">
                                <h3 className="text-xl font-bold" data-oid="nxjtt.4">
                                    Prescription Review
                                </h3>
                                <p className="text-blue-100 text-sm" data-oid="x0:t36a">
                                    Order: {orderNumber}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                            disabled={isSubmitting}
                            data-oid="ikv12.y"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="p9rv531"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                    data-oid="g22b8h1"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6" data-oid="m.2y2g8">
                    {/* Customer Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg" data-oid="0qtl-95">
                        <div className="flex items-center space-x-3" data-oid="jo38jcv">
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="mlo6v0."
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                    data-oid="zdg0jqt"
                                />
                            </svg>
                            <div data-oid="dptgbks">
                                <p className="font-medium text-gray-900" data-oid="snogw_:">
                                    {customerName}
                                </p>
                                <p className="text-sm text-gray-600" data-oid="0a1.._5">
                                    {customerPhone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Prescription Image Placeholder */}
                    <div
                        className="bg-gray-100 rounded-xl p-8 mb-6 text-center border-2 border-dashed border-gray-300"
                        data-oid=":g26_9b"
                    >
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            data-oid="3g4v07m"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                                data-oid="ppzmczy"
                            />
                        </svg>
                        <h4 className="font-semibold text-gray-900 mb-2" data-oid="30:znpx">
                            Prescription Image
                        </h4>
                        <p className="text-sm text-gray-600" data-oid="_l1kh1z">
                            In a real implementation, the prescription image would be displayed here
                        </p>
                        <p className="text-xs text-gray-500 mt-2" data-oid="3zh:rlj">
                            ID: {prescriptionId}
                        </p>
                    </div>

                    {/* Issue Type Selection */}
                    <div className="mb-6" data-oid="o3tlqfj">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="005v32c"
                        >
                            If there{"'"}s an issue, select the type:
                        </label>
                        <select
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ focusRingColor: BRAND_COLORS.primary }}
                            data-oid="9xqj194"
                        >
                            <option value="" data-oid="gm-ihc1">
                                No issues found
                            </option>
                            <option value="missing-signature" data-oid="-86be_b">
                                Missing doctor signature
                            </option>
                            <option value="missing-license" data-oid="r-rxj1j">
                                Missing license number
                            </option>
                            <option value="suspicious-alteration" data-oid="qsixady">
                                Suspicious alterations
                            </option>
                            <option value="drug-drug-interaction" data-oid="ngvgn99">
                                Drug-drug interaction
                            </option>
                            <option value="expired-prescription" data-oid=".tr2rix">
                                Expired prescription
                            </option>
                            <option value="unclear-handwriting" data-oid="m_trusk">
                                Unclear handwriting
                            </option>
                            <option value="other" data-oid="4yy86hb">
                                Other issue
                            </option>
                        </select>
                    </div>

                    {/* Review Notes */}
                    <div className="mb-6" data-oid="wgpy82v">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="k1i0-ws"
                        >
                            Review Notes:
                        </label>
                        <textarea
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder="Add any notes about the prescription review..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ focusRingColor: BRAND_COLORS.primary }}
                            data-oid="mp:9261"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4" data-oid="j54s_wn">
                        <button
                            onClick={handleApprove}
                            disabled={isSubmitting || issueType !== ''}
                            className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                            title={
                                issueType !== ''
                                    ? 'Cannot approve if issues are selected'
                                    : 'Approve this prescription'
                            }
                            data-oid="a2wdwk-"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="u_suj3:"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                    data-oid="zd_m534"
                                />
                            </svg>
                            <span data-oid="hyl--cl">
                                {isSubmitting ? 'Processing...' : 'Approve Prescription'}
                            </span>
                        </button>
                        <button
                            onClick={handleSuspend}
                            disabled={isSubmitting || !issueType || !reviewNotes.trim()}
                            className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                            title={
                                !issueType
                                    ? 'Please select an issue type'
                                    : !reviewNotes.trim()
                                      ? 'Please provide detailed notes'
                                      : 'Suspend this order'
                            }
                            data-oid="b-3j82h"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="g5wnq1n"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                    data-oid="e_luz4e"
                                />
                            </svg>
                            <span data-oid="6kxpu0f">
                                {isSubmitting ? 'Processing...' : 'Suspend Order'}
                            </span>
                        </button>
                    </div>

                    <div className="mt-4 text-center" data-oid="6uvcfkn">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            data-oid="3wkoekf"
                        >
                            Cancel Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
