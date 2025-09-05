'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';

interface DropdownNotificationCenterProps {
    userId: string;
    userRole: UserRole;
    isOpen: boolean;
    onClose: () => void;
}

export function DropdownNotificationCenter({
    userId,
    userRole,
    isOpen,
    onClose,
}: DropdownNotificationCenterProps) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen, userId, userRole]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            // Create some sample notifications for testing
            const sampleNotifications = [
                {
                    id: '1',
                    title: 'Welcome to CURA!',
                    message: 'Thank you for joining our platform.',
                    type: 'system',
                    priority: 'medium',
                    isRead: false,
                    createdAt: new Date(),
                },
                {
                    id: '2',
                    title: 'New Order Received',
                    message: 'You have a new order to process.',
                    type: 'order',
                    priority: 'high',
                    isRead: false,
                    createdAt: new Date(Date.now() - 30 * 60 * 1000),
                },
                {
                    id: '3',
                    title: 'System Update',
                    message: 'The system has been updated with new features.',
                    type: 'system',
                    priority: 'low',
                    isRead: true,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                },
                {
                    id: '4',
                    title: 'Prescription Ready',
                    message: 'Your prescription is ready for pickup.',
                    type: 'prescription',
                    priority: 'high',
                    isRead: false,
                    createdAt: new Date(Date.now() - 45 * 60 * 1000),
                },
                {
                    id: '5',
                    title: 'Low Stock Alert',
                    message: 'Paracetamol is running low in inventory.',
                    type: 'inventory',
                    priority: 'medium',
                    isRead: true,
                    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                },
            ];

            setNotifications(sampleNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = (notificationId: string) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} data-oid="_8284y6" />

            {/* Dropdown Panel */}
            <div
                className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
                data-oid="pzi96o2"
            >
                {/* Header */}
                <div
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-4 rounded-t-xl"
                    data-oid="crj3g7x"
                >
                    <div className="flex items-center justify-between" data-oid="k0gnr-s">
                        <h3 className="text-lg font-semibold" data-oid="fg:bde8">
                            Notifications
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                            data-oid="y068d3w"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="q-xepp0"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid="jsn1hmx"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Stats */}
                    <div
                        className="flex items-center justify-between mt-3 text-sm"
                        data-oid="nit358d"
                    >
                        <span className="text-white/80" data-oid="hnle724">
                            {unreadCount} unread of {notifications.length} total
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-white/80 hover:text-white text-xs font-medium underline"
                                data-oid="tgqlkx:"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto" data-oid="5nvbomv">
                    {loading ? (
                        <div className="p-6 text-center text-gray-500" data-oid="ri:av7y">
                            <div
                                className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1F1F6F] mx-auto mb-2"
                                data-oid="vqasnop"
                            ></div>
                            <span className="text-sm" data-oid="1u23045">
                                Loading...
                            </span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500" data-oid="ohsapm5">
                            <div className="text-3xl mb-3" data-oid="rhcl7ld">
                                🔔
                            </div>
                            <p className="font-medium mb-1" data-oid="lmptba2">
                                No notifications
                            </p>
                            <p className="text-sm text-gray-400" data-oid="6i5o1ak">
                                You{"'"}re all caught up!
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100" data-oid="gvz4:9k">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                        !notification.isRead
                                            ? 'bg-blue-50/50 border-l-4 border-l-[#1F1F6F]'
                                            : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                    data-oid="evuf-ub"
                                >
                                    <div className="flex items-start space-x-3" data-oid="5ysc085">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 text-xl" data-oid="8j.kbtw">
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0" data-oid="fbcbsgv">
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid="ka-4ffv"
                                            >
                                                <div className="flex-1" data-oid="y6v4:45">
                                                    <h4
                                                        className={`text-sm font-medium ${
                                                            !notification.isRead
                                                                ? 'text-gray-900'
                                                                : 'text-gray-700'
                                                        }`}
                                                        data-oid="73-:1f-"
                                                    >
                                                        {notification.title}
                                                    </h4>
                                                    <p
                                                        className="text-sm text-gray-600 mt-1 line-clamp-2"
                                                        data-oid="5w8039x"
                                                    >
                                                        {notification.message}
                                                    </p>
                                                </div>

                                                {/* Priority Badge */}
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ml-2 ${getPriorityColor(notification.priority)}`}
                                                    data-oid="m4aqz7n"
                                                >
                                                    {notification.priority}
                                                </span>
                                            </div>

                                            {/* Footer */}
                                            <div
                                                className="flex items-center justify-between mt-2"
                                                data-oid="4bf2ywb"
                                            >
                                                <span
                                                    className="text-xs text-gray-500"
                                                    data-oid="bc-ajwp"
                                                >
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>

                                                {!notification.isRead && (
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="ubdj_.5"
                                                    >
                                                        <div
                                                            className="w-2 h-2 bg-[#1F1F6F] rounded-full"
                                                            data-oid="jg-3u9i"
                                                        ></div>
                                                    </div>
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
                        className="p-3 bg-gray-50 border-t border-gray-100 rounded-b-xl"
                        data-oid="1h.rn45"
                    >
                        <button
                            className="w-full text-center text-sm text-[#1F1F6F] hover:text-[#14274E] font-medium"
                            data-oid="l28m7hc"
                        >
                            View all notifications
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
