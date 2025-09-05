'use client';

import { useState, useEffect } from 'react';
import {
    NotificationService,
    NotificationData,
    NotificationType,
} from '@/lib/services/notificationService';
import { UserRole } from '@/lib/types';

interface SimpleNotificationCenterProps {
    userId: string;
    userRole: UserRole;
    isOpen: boolean;
    onClose: () => void;
}

export function SimpleNotificationCenter({
    userId,
    userRole,
    isOpen,
    onClose,
}: SimpleNotificationCenterProps) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            // Initialize notifications for this user
            NotificationService.initializeForUser(userId, userRole);
            loadNotifications();

            // Subscribe to real-time updates
            const unsubscribe = NotificationService.subscribe(`simple-center-${userId}`, () => {
                loadNotifications();
            });

            return unsubscribe;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, userId, userRole]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await NotificationService.getNotifications(userId, userRole, {
                limit: 10,
            });
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        await NotificationService.markAsRead(notificationId);
        loadNotifications();
    };

    const getTypeIcon = (type: NotificationType) => {
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
            case 'user':
                return '👤';
            case 'pharmacy':
                return '🏥';
            case 'doctor':
                return '👨‍⚕️';
            case 'vendor':
                return '🏪';
            default:
                return '🔔';
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString();
    };

    if (!isOpen) return null;

    return (
        <div
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
            data-oid="simple-notification-center"
        >
            {/* Header */}
            <div className="bg-cura-gradient text-white p-4 rounded-t-xl" data-oid="header">
                <div className="flex items-center justify-between" data-oid="nrlgc.3">
                    <h3 className="font-semibold" data-oid="qdkgbm5">
                        Notifications
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                        data-oid="close-btn"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="close-icon"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                                data-oid="close-path"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto" data-oid="content">
                {loading ? (
                    <div className="p-4 text-center text-gray-500" data-oid="loading">
                        <div
                            className="animate-spin rounded-full h-6 w-6 border-b-2 border-cura-primary mx-auto mb-2"
                            data-oid="3tlu835"
                        ></div>
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500" data-oid="empty">
                        <div className="text-3xl mb-2" data-oid="m2fql5_">
                            🔔
                        </div>
                        <p className="font-medium" data-oid="g38h8x7">
                            No notifications
                        </p>
                        <p className="text-sm" data-oid="0vyvnm6">
                            You{"'"}re all caught up!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100" data-oid="notifications-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${
                                    !notification.isRead
                                        ? 'bg-blue-50 border-l-4 border-l-cura-primary'
                                        : ''
                                }`}
                                data-oid="notification-item"
                            >
                                <div className="flex items-start space-x-3" data-oid="s5mesjv">
                                    <div className="text-lg flex-shrink-0" data-oid="icon">
                                        {getTypeIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0" data-oid="816vs9k">
                                        <h4
                                            className={`text-sm font-medium ${
                                                !notification.isRead
                                                    ? 'text-gray-900'
                                                    : 'text-gray-700'
                                            }`}
                                            data-oid=":c_df05"
                                        >
                                            {notification.title}
                                        </h4>
                                        <p
                                            className="text-sm text-gray-600 mt-1 line-clamp-2"
                                            data-oid="0s0ca7q"
                                        >
                                            {notification.message}
                                        </p>
                                        <div
                                            className="flex items-center justify-between mt-2"
                                            data-oid="chm7n6."
                                        >
                                            <span
                                                className="text-xs text-gray-500"
                                                data-oid="1:lifgf"
                                            >
                                                {formatTimeAgo(notification.createdAt)}
                                            </span>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() =>
                                                        handleMarkAsRead(notification.id)
                                                    }
                                                    className="text-xs text-cura-primary hover:text-cura-secondary font-medium"
                                                    data-oid="mark-read-btn"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div
                    className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl"
                    data-oid="footer"
                >
                    <button
                        onClick={onClose}
                        className="w-full text-center text-sm text-cura-primary hover:text-cura-secondary font-medium"
                        data-oid="view-all-btn"
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
}
