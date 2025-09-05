'use client';

import { useState, useEffect } from 'react';
import { NotificationData, NotificationService } from '@/lib/services/notificationService';
import { UserRole } from '@/lib/types';

interface NotificationToastProps {
    userId: string;
    userRole: UserRole;
}

interface ToastNotification extends NotificationData {
    isVisible: boolean;
}

export function NotificationToast({ userId, userRole }: NotificationToastProps) {
    const [toasts, setToasts] = useState<ToastNotification[]>([]);

    const [lastNotificationTime, setLastNotificationTime] = useState<number>(Date.now());

    useEffect(() => {
        // Subscribe to real-time notifications with a unique key for this component
        const unsubscribe = NotificationService.subscribe(
            `notification-toast-${userId}`,
            (allNotifications) => {
                // Find new notifications (created after the last check)
                const newNotifications = allNotifications
                    .filter(
                        (notification) =>
                            notification.userId === userId &&
                            notification.userRole === userRole &&
                            notification.createdAt.getTime() > lastNotificationTime &&
                            (notification.priority === 'high' ||
                                notification.priority === 'urgent'),
                    )
                    .map((notification) => ({ ...notification, isVisible: true }));

                if (newNotifications.length > 0) {
                    console.log('New notifications to show as toasts:', newNotifications.length);

                    // Update last notification time to prevent showing the same notifications again
                    const latestTime = Math.max(
                        ...newNotifications.map((n) => n.createdAt.getTime()),
                    );
                    setLastNotificationTime(latestTime);

                    setToasts((prev) => [...newNotifications, ...prev].slice(0, 3)); // Keep max 3 toasts

                    // Play sound for high/urgent priority notifications when toast is shown
                    console.log('Playing sound for high priority notification');
                    NotificationService.playNotificationSound();

                    // Auto-hide toasts after 5 seconds
                    newNotifications.forEach((notification) => {
                        setTimeout(() => {
                            setToasts((prev) =>
                                prev.filter((toast) => toast.id !== notification.id),
                            );
                        }, 5000);
                    });
                }
            },
        );

        return unsubscribe;
    }, [userId, userRole, lastNotificationTime]);

    const handleDismiss = (notificationId: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== notificationId));
    };

    const handleClick = (notification: ToastNotification) => {
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
        handleDismiss(notification.id);
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500 border-red-600';
            case 'high':
                return 'bg-orange-500 border-orange-600';
            default:
                return 'bg-blue-500 border-blue-600';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'order':
                return '📦';
            case 'prescription':
                return '💊';
            case 'inventory':
                return '📋';
            case 'system':
                return '⚙️';
            case 'commission':
                return '💰';
            default:
                return '🔔';
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2" data-oid="vp8cg5x">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden transform transition-all duration-300 ease-in-out ${
                        toast.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
                    data-oid="84v3pq8"
                >
                    <div
                        className={`p-4 ${getPriorityStyles(toast.priority)} border-l-4`}
                        data-oid="lq7_iew"
                    >
                        <div className="flex items-start" data-oid="yoy48gg">
                            <div className="flex-shrink-0" data-oid="qvp.-if">
                                <span className="text-2xl" data-oid="pdzx2m3">
                                    {getTypeIcon(toast.type)}
                                </span>
                            </div>
                            <div className="ml-3 w-0 flex-1" data-oid="jeh8wdq">
                                <p className="text-sm font-medium text-white" data-oid=".7hosxz">
                                    {toast.title}
                                </p>
                                <p className="mt-1 text-sm text-white/90" data-oid="1c3hxt2">
                                    {toast.message}
                                </p>
                                {toast.actionUrl && (
                                    <div className="mt-3" data-oid="nd1kr_0">
                                        <button
                                            onClick={() => handleClick(toast)}
                                            className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1 rounded transition-colors"
                                            data-oid="oy-i3oo"
                                        >
                                            {toast.actionLabel || 'View'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex-shrink-0 flex" data-oid="-1k:zi0">
                                <button
                                    onClick={() => handleDismiss(toast.id)}
                                    className="inline-flex text-white/80 hover:text-white focus:outline-none"
                                    data-oid="ja79gz."
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        data-oid="d8xj8r8"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                            data-oid="zm3ty22"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
