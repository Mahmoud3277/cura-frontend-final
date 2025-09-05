'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationData } from '@/lib/services/notificationService';

interface PrescriptionNotificationCardProps {
    notifications: NotificationData[];
    onMarkAsRead: (notificationId: string) => void;
    onClose: () => void;
}

export function PrescriptionNotificationCard({
    notifications,
    onMarkAsRead,
    onClose,
}: PrescriptionNotificationCardProps) {
    const router = useRouter();

    const handleNotificationClick = async (notification: NotificationData) => {
        // Mark as read
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }

        // Close notification panel
        onClose();

        // Navigate to medicine selection if prescription is approved
        if (notification.data?.canSelectMedicines && notification.data?.status === 'approved') {
            router.push(`/prescription/medicines/${notification.data.prescriptionId}`);
        } else {
            router.push('/prescription/status');
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        return date.toLocaleDateString();
    };

    if (notifications.length === 0) return null;

    return (
        <div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            data-oid="r8v.hdo"
        >
            {/* Header */}
            <div
                className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"
                data-oid="b9q:a5t"
            >
                <div className="flex items-center justify-between" data-oid="mimx7x4">
                    <h3 className="font-semibold text-gray-900 text-sm" data-oid="zon:-ft">
                        Notifications
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        data-oid="96y8ae6"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="oz6fflr"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                                data-oid="_mpl:5t"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto" data-oid="vm9sqw8">
                {notifications.slice(0, 3).map((notification) => (
                    <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                            !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        data-oid="z3mkhuf"
                    >
                        <div className="flex items-start space-x-3" data-oid="bn-j-p8">
                            {/* Icon */}
                            <div
                                className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"
                                data-oid="c3s0juf"
                            >
                                <span className="text-lg" data-oid="14hi_q7">
                                    💊
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0" data-oid="pxq:6kt">
                                <div
                                    className="flex items-start justify-between"
                                    data-oid=":2wn2yk"
                                >
                                    <div className="flex-1" data-oid="6wssbx7">
                                        <h4
                                            className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}
                                            data-oid="luixckl"
                                        >
                                            {notification.title}
                                        </h4>
                                        <p
                                            className="text-sm text-gray-600 mt-1 line-clamp-2"
                                            data-oid="z8pvddf"
                                        >
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div
                                            className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"
                                            data-oid=":o8a0go"
                                        ></div>
                                    )}
                                </div>

                                <div
                                    className="flex items-center justify-between mt-2"
                                    data-oid="zw9h5nt"
                                >
                                    <span className="text-xs text-gray-500" data-oid="9rwqze4">
                                        {formatTimeAgo(notification.createdAt)}
                                    </span>
                                    {notification.data?.canSelectMedicines && (
                                        <span
                                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium"
                                            data-oid="z5uz979"
                                        >
                                            Tap to select medicines
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            {notifications.length > 3 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100" data-oid="1w-a5vt">
                    <button
                        onClick={() => {
                            onClose();
                            router.push('/customer/dashboard?tab=notifications');
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                        data-oid="ovqfa9v"
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
}
