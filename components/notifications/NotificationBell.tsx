'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    NotificationService,
    NotificationData,
    NotificationType,
} from '@/lib/services/notificationService';
import { UserRole } from '@/lib/types';

interface NotificationBellProps {
    userId: string;
    userRole: UserRole;
}

export function NotificationBell({ userId, userRole }: NotificationBellProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        console.log('NotificationBell mounted with userId:', userId, 'userRole:', userRole);

        // Initialize notifications for this user
        NotificationService.initializeForUser(userId, userRole);

        // Load initial unread count
        loadUnreadCount();

        // Subscribe to real-time updates with a unique key for this component
        const unsubscribe = NotificationService.subscribe(`notification-bell-${userId}`, () => {
            console.log('NotificationBell: Received notification update, reloading count...');
            loadUnreadCount();
            if (isOpen) {
                loadNotifications();
            }
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, userRole, isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const loadUnreadCount = async () => {
        try {
            // For customers, only count prescription notifications
            if (userRole === 'customer') {
                const prescriptionNotifications = await NotificationService.getNotifications(
                    userId,
                    userRole,
                    {
                        type: 'prescription',
                        isRead: false,
                        isArchived: false,
                    },
                );
                setUnreadCount(prescriptionNotifications.length);
            } else {
                const count = await NotificationService.getUnreadCount(userId, userRole);
                setUnreadCount(count);
            }
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    };

    const loadNotifications = async () => {
        setLoading(true);
        try {
            // For customers, only show prescription notifications
            const filters =
                userRole === 'customer'
                    ? { type: 'prescription' as NotificationType, limit: 5 }
                    : { limit: 5 };

            const data = await NotificationService.getNotifications(userId, userRole, filters);
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            loadNotifications();
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        await NotificationService.markAsRead(notificationId);
        loadUnreadCount();
        loadNotifications();
    };

    const handleNotificationClick = async (notification: NotificationData) => {
        // Mark as read first
        if (!notification.isRead) {
            await handleMarkAsRead(notification.id);
        }

        // Close dropdown
        setIsOpen(false);

        // Handle prescription notifications specially
        if (notification.type === 'prescription' && notification.data?.prescriptionId) {
            const prescriptionId = notification.data.prescriptionId;

            // For customers, always navigate to medicine selection if prescription is approved
            if (
                userRole === 'customer' &&
                notification.data?.canSelectMedicines &&
                notification.data?.status === 'approved'
            ) {
                router.push(`/prescription/medicines/${prescriptionId}`);
            } else if (userRole === 'customer') {
                // For rejected or under review prescriptions, go to status page
                router.push('/prescription/status');
            } else {
                // For other user roles, use the actionUrl
                router.push(notification.actionUrl || '/prescription/status');
            }
        } else if (notification.actionUrl) {
            // Handle other notification types with actionUrl
            router.push(notification.actionUrl);
        }
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

    return (
        <div className="relative" ref={dropdownRef} data-oid="notification-bell-container">
            <button
                onClick={handleToggle}
                className="relative p-2 text-cura-primary hover:text-cura-secondary transition-colors rounded-full hover:bg-gray-50"
                title="Notifications"
                data-oid="9gb-6hm"
            >
                {/* Bell Icon */}
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="msqdw1a"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        data-oid="o7gz:_3"
                    />
                </svg>

                {/* Unread Count Badge with animation */}
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-cura-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse"
                        data-oid="rv_aziu"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Simple Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
                    data-oid="notification-dropdown"
                >
                    {/* Header */}
                    <div
                        className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5 rounded-t-2xl"
                        data-oid="dropdown-header"
                    >
                        <div className="flex items-center justify-between" data-oid="o.6irfq">
                            <h3 className="font-semibold text-gray-900" data-oid="vgbtxcr">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span
                                    className="text-xs text-cura-primary font-medium bg-cura-primary/10 px-2 py-1 rounded-full"
                                    data-oid="qtsyn0u"
                                >
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-80 overflow-y-auto" data-oid="dropdown-content">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500" data-oid="loading">
                                <div
                                    className="animate-spin rounded-full h-6 w-6 border-b-2 border-cura-primary mx-auto mb-2"
                                    data-oid="mzame0q"
                                ></div>
                                <p className="text-sm" data-oid="3rhef90">
                                    Loading...
                                </p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500" data-oid="empty">
                                <div className="text-3xl mb-2" data-oid="srn-p2o">
                                    🔔
                                </div>
                                <p className="font-medium" data-oid="a8y90jd">
                                    No notifications
                                </p>
                                <p className="text-sm" data-oid="b1pifk7">
                                    You{"'"}re all caught up!
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100" data-oid="notifications-list">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                            !notification.isRead
                                                ? 'bg-blue-50 border-l-4 border-l-cura-primary'
                                                : ''
                                        } ${
                                            notification.type === 'prescription' &&
                                            notification.data?.canSelectMedicines
                                                ? 'hover:bg-green-50'
                                                : ''
                                        }`}
                                        data-oid="notification-item"
                                    >
                                        <div
                                            className="flex items-start space-x-3"
                                            data-oid="bos6x4_"
                                        >
                                            <div className="text-lg flex-shrink-0" data-oid="icon">
                                                {getTypeIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0" data-oid="cdusawi">
                                                <h4
                                                    className={`text-sm font-medium ${
                                                        !notification.isRead
                                                            ? 'text-gray-900'
                                                            : 'text-gray-700'
                                                    }`}
                                                    data-oid="f5hhb-i"
                                                >
                                                    {notification.title}
                                                </h4>
                                                <p
                                                    className="text-sm text-gray-600 mt-1 line-clamp-2"
                                                    data-oid="b-6:w5a"
                                                >
                                                    {notification.message}
                                                </p>
                                                <div
                                                    className="flex items-center justify-between mt-2 w-full"
                                                    data-oid="ip:i.p9"
                                                >
                                                    <span
                                                        className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0"
                                                        data-oid="evinxqu"
                                                    >
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </span>
                                                    <div
                                                        className="flex items-center gap-2 flex-shrink-0"
                                                        data-oid="7-60r0f"
                                                    >
                                                        {/* Action button for prescription notifications */}
                                                        {notification.type === 'prescription' &&
                                                            notification.data
                                                                ?.canSelectMedicines && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setIsOpen(false);
                                                                        // Navigate to prescription status page instead of medicine selection
                                                                        router.push(
                                                                            '/prescription/status',
                                                                        );
                                                                    }}
                                                                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium whitespace-nowrap hover:bg-green-200 transition-colors"
                                                                    data-oid="hhs3kcu"
                                                                >
                                                                    Select Medicines
                                                                </button>
                                                            )}
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(
                                                                        notification.id,
                                                                    );
                                                                }}
                                                                className="text-xs text-cura-primary hover:text-cura-secondary font-medium whitespace-nowrap"
                                                                data-oid="mark-read-btn"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
