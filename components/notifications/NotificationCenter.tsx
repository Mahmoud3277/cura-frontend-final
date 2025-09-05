'use client';

import { useState, useEffect } from 'react';
import {
    NotificationService,
    NotificationData,
    NotificationType,
    NotificationPriority,
} from '@/lib/services/notificationService';
import { UserRole } from '@/lib/types';

interface NotificationCenterProps {
    userId: string;
    userRole: UserRole;
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationCenter({ userId, userRole, isOpen, onClose }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<{
        type?: NotificationType;
        priority?: NotificationPriority;
        isRead?: boolean;
    }>({});
    const [stats, setStats] = useState<{
        total: number;
        unread: number;
        byType: Record<NotificationType, number>;
        byPriority: Record<NotificationPriority, number>;
    } | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Initialize notifications for this user
            NotificationService.initializeForUser(userId, userRole);

            loadNotifications();
            loadStats();

            // Subscribe to real-time updates
            const unsubscribe = NotificationService.subscribe(userId, () => {
                loadNotifications();
                loadStats();
            });

            return unsubscribe;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, userId, userRole, filter]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            console.log('Loading notifications for user:', userId, 'role:', userRole);

            // For customers, only show prescription notifications unless specifically filtered
            const finalFilter =
                userRole === 'customer' && !filter.type
                    ? { ...filter, type: 'prescription' as NotificationType, limit: 50 }
                    : { ...filter, limit: 50 };

            const data = await NotificationService.getNotifications(userId, userRole, finalFilter);
            console.log('Loaded notifications:', data);
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await NotificationService.getNotificationStats(userId, userRole);

            // For customers, only show prescription notification stats
            if (userRole === 'customer') {
                const prescriptionNotifications = await NotificationService.getNotifications(
                    userId,
                    userRole,
                    {
                        type: 'prescription',
                        isArchived: false,
                    },
                );
                const unreadPrescriptions = prescriptionNotifications.filter((n) => !n.isRead);

                setStats({
                    total: prescriptionNotifications.length,
                    unread: unreadPrescriptions.length,
                    byType: { prescription: prescriptionNotifications.length } as Record<
                        NotificationType,
                        number
                    >,

                    byPriority: prescriptionNotifications.reduce(
                        (acc, n) => {
                            acc[n.priority] = (acc[n.priority] || 0) + 1;
                            return acc;
                        },
                        {} as Record<NotificationPriority, number>,
                    ),
                });
            } else {
                setStats(statsData);
            }
        } catch (error) {
            console.error('Error loading notification stats:', error);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        await NotificationService.markAsRead(notificationId);
    };

    const handleMarkAllAsRead = async () => {
        await NotificationService.markAllAsRead(userId, userRole);
    };

    const handleArchive = async (notificationId: string) => {
        await NotificationService.archiveNotification(notificationId);
    };

    const handleDelete = async (notificationId: string) => {
        await NotificationService.deleteNotification(notificationId);
    };

    const getPriorityColor = (priority: NotificationPriority) => {
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50"
            data-oid="x9b9ry6"
        >
            <div
                className="bg-white w-full max-w-md h-full shadow-xl overflow-hidden"
                data-oid="l:z04hp"
            >
                {/* Header */}
                <div
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-4"
                    data-oid="yk4qdh0"
                >
                    <div className="flex items-center justify-between mb-4" data-oid="7y2gth1">
                        <h2 className="text-xl font-bold" data-oid="tlw8plp">
                            Notifications
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                            data-oid="9zhpb94"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="320jmr."
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid=":jpthzl"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 gap-4 text-sm" data-oid="531nqb-">
                            <div
                                className="bg-white/10 rounded-lg p-2 text-center"
                                data-oid="esj3m.7"
                            >
                                <div className="font-bold text-lg" data-oid="x3svo5s">
                                    {stats.total}
                                </div>
                                <div className="opacity-80" data-oid="j_hke9y">
                                    Total
                                </div>
                            </div>
                            <div
                                className="bg-white/10 rounded-lg p-2 text-center"
                                data-oid="5vaz_rk"
                            >
                                <div className="font-bold text-lg" data-oid="nnuec9x">
                                    {stats.unread}
                                </div>
                                <div className="opacity-80" data-oid="5xmq_d_">
                                    Unread
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-200" data-oid="8p4huc:">
                    <div className="flex items-center justify-between mb-3" data-oid="llbv9w0">
                        <h3 className="font-semibold text-gray-900" data-oid="kjfhdii">
                            Filters
                        </h3>
                        {stats && stats.unread > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-sm text-[#1F1F6F] hover:text-[#14274E] font-medium"
                                data-oid="f:32hqb"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2" data-oid="yink9za">
                        {/* Type Filter */}
                        <select
                            value={filter.type || ''}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    type: (e.target.value as NotificationType) || undefined,
                                })
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            data-oid="waq30br"
                        >
                            <option value="" data-oid="tjws._:">
                                All Types
                            </option>
                            <option value="order" data-oid="xdi_zo4">
                                Orders
                            </option>
                            <option value="prescription" data-oid="9vtmm8u">
                                Prescriptions
                            </option>
                            <option value="inventory" data-oid="cjrxurw">
                                Inventory
                            </option>
                            <option value="system" data-oid="ww.kvbg">
                                System
                            </option>
                            <option value="commission" data-oid="j1cgs:j">
                                Commission
                            </option>
                            <option value="user" data-oid="0gek6to">
                                Users
                            </option>
                            <option value="pharmacy" data-oid="5d0p_yf">
                                Pharmacy
                            </option>
                            <option value="doctor" data-oid="kpady8t">
                                Doctor
                            </option>
                            <option value="vendor" data-oid="ymok2eb">
                                Vendor
                            </option>
                        </select>

                        {/* Read Status Filter */}
                        <select
                            value={filter.isRead === undefined ? '' : filter.isRead.toString()}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    isRead:
                                        e.target.value === ''
                                            ? undefined
                                            : e.target.value === 'true',
                                })
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            data-oid="65ugxhy"
                        >
                            <option value="" data-oid="_xpwapr">
                                All
                            </option>
                            <option value="false" data-oid="-gyyomf">
                                Unread
                            </option>
                            <option value="true" data-oid="sbh0dol">
                                Read
                            </option>
                        </select>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto" data-oid="n3we:ao">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500" data-oid="s5lkg:u">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F1F6F] mx-auto mb-2"
                                data-oid="0bfwb36"
                            ></div>
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500" data-oid="7e3-i75">
                            <div className="text-4xl mb-4" data-oid="evx1ec1">
                                🔔
                            </div>
                            <p className="text-lg font-medium mb-2" data-oid="-6:hna2">
                                No notifications
                            </p>
                            <p className="text-sm" data-oid="a7een-:">
                                You{"'"}re all caught up!
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200" data-oid="s7869w1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors ${
                                        !notification.isRead
                                            ? 'bg-blue-50 border-l-4 border-l-[#1F1F6F]'
                                            : ''
                                    }`}
                                    data-oid="3fsjhmt"
                                >
                                    <div className="flex items-start space-x-3" data-oid="x58pw9l">
                                        {/* Type Icon */}
                                        <div className="text-2xl flex-shrink-0" data-oid="iu6q.49">
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0" data-oid="6nc47ri">
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid="7hwzp7u"
                                            >
                                                <div className="flex-1" data-oid="uev44di">
                                                    <h4
                                                        className={`text-sm font-medium ${
                                                            !notification.isRead
                                                                ? 'text-gray-900'
                                                                : 'text-gray-700'
                                                        }`}
                                                        data-oid="ozce17p"
                                                    >
                                                        {notification.title}
                                                    </h4>
                                                    <p
                                                        className="text-sm text-gray-600 mt-1"
                                                        data-oid="f:tif4n"
                                                    >
                                                        {notification.message}
                                                    </p>
                                                </div>

                                                {/* Priority Badge */}
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ml-2 ${getPriorityColor(
                                                        notification.priority,
                                                    )}`}
                                                    data-oid="2e85bm-"
                                                >
                                                    {notification.priority}
                                                </span>
                                            </div>

                                            {/* Time and Actions */}
                                            <div
                                                className="flex items-center justify-between mt-2"
                                                data-oid="dfrn59:"
                                            >
                                                <span
                                                    className="text-xs text-gray-500"
                                                    data-oid="h-ks_mz"
                                                >
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>

                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="7s-lwro"
                                                >
                                                    {notification.actionUrl && (
                                                        <a
                                                            href={notification.actionUrl}
                                                            className="text-xs text-[#1F1F6F] hover:text-[#14274E] font-medium"
                                                            onClick={onClose}
                                                            data-oid="dqa1o9-"
                                                        >
                                                            {notification.actionLabel || 'View'}
                                                        </a>
                                                    )}

                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() =>
                                                                handleMarkAsRead(notification.id)
                                                            }
                                                            className="text-xs text-gray-500 hover:text-gray-700"
                                                            title="Mark as read"
                                                            data-oid="53aj61s"
                                                        >
                                                            ✓
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            handleArchive(notification.id)
                                                        }
                                                        className="text-xs text-gray-500 hover:text-gray-700"
                                                        title="Archive"
                                                        data-oid="-hmskj2"
                                                    >
                                                        📁
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(notification.id)
                                                        }
                                                        className="text-xs text-red-500 hover:text-red-700"
                                                        title="Delete"
                                                        data-oid="_ry5_6n"
                                                    >
                                                        🗑️
                                                    </button>
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
        </div>
    );
}
