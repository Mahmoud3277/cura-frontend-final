'use client';

import { useState } from 'react';
import { PrescriptionNotificationService } from '@/lib/services/prescriptionNotificationService';
import { useAuth } from '@/lib/contexts/AuthContext';

export function PrescriptionNotificationDemo() {
    const [isCreating, setIsCreating] = useState(false);
    const { user } = useAuth();

    const createTestNotification = async (type: 'approved' | 'rejected' | 'under_review') => {
        if (!user) return;

        setIsCreating(true);
        try {
            const prescriptionId = `RX-${Date.now().toString().slice(-6)}`;
            const prescriptionData = {
                prescriptionId,
                patientName: 'Ahmed Hassan',
                customerId: user.id,
                status: type,
                approvedAt: type === 'approved' ? new Date() : undefined,
                rejectedAt: type === 'rejected' ? new Date() : undefined,
                rejectionReason:
                    type === 'rejected' ? 'Prescription image unclear, please resubmit' : undefined,
                medicinesCount: type === 'approved' ? 3 : undefined,
            };

            switch (type) {
                case 'approved':
                    await PrescriptionNotificationService.createPrescriptionApprovedNotification(
                        prescriptionData,
                    );
                    break;
                case 'rejected':
                    await PrescriptionNotificationService.createPrescriptionRejectedNotification(
                        prescriptionData,
                    );
                    break;
                case 'under_review':
                    await PrescriptionNotificationService.createPrescriptionUnderReviewNotification(
                        prescriptionData,
                    );
                    break;
            }

            console.log(`Created ${type} notification for prescription ${prescriptionId}`);
        } catch (error) {
            console.error('Error creating test notification:', error);
        } finally {
            setIsCreating(false);
        }
    };

    if (!user) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Please log in to test prescription notifications</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Prescription Notification Demo
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Test the prescription notification system by creating sample notifications. Check
                the notification bell in the header to see them.
            </p>

            <div className="space-y-3">
                <button
                    onClick={() => createTestNotification('approved')}
                    disabled={isCreating}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    {isCreating ? 'Creating...' : 'Create Approved Prescription Notification'}
                </button>

                <button
                    onClick={() => createTestNotification('rejected')}
                    disabled={isCreating}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                    {isCreating ? 'Creating...' : 'Create Rejected Prescription Notification'}
                </button>

                <button
                    onClick={() => createTestNotification('under_review')}
                    disabled={isCreating}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {isCreating ? 'Creating...' : 'Create Under Review Notification'}
                </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Approved prescription notifications will be clickable and
                    navigate directly to the medicine selection page. Other notifications will
                    navigate to the prescription status page.
                </p>
            </div>
        </div>
    );
}