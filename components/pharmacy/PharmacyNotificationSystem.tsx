'use client';

import { useState, useEffect, useRef } from 'react';
import { NotificationService, NotificationData } from '@/lib/services/notificationService';
import { pharmacyOrderService } from '@/lib/services/pharmacyOrderService';
import { UserRole } from '@/lib/types';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface PharmacyNotificationSystemProps {
    userId: string;
    userRole: UserRole;
}

interface PharmacyNotificationAlert {
    id: string;
    type: 'new-order' | 'urgent-order' | 'low-stock' | 'system';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    timestamp: Date;
    actionUrl?: string;
    actionLabel?: string;
    autoHide?: boolean;
    duration?: number;
}

export function PharmacyNotificationSystem({ userId, userRole }: PharmacyNotificationSystemProps) {
    const { t } = useTranslation();
    const [alerts, setAlerts] = useState<PharmacyNotificationAlert[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [lastOrderCount, setLastOrderCount] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Initialize audio context
    useEffect(() => {
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
            audioContextRef.current = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
        }
    }, []);

    // Enhanced sound system with different tones for different priorities
    const playNotificationSound = (priority: string) => {
        if (!soundEnabled || !audioContextRef.current) return;

        try {
            const audioContext = audioContextRef.current;

            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            // Different frequencies and patterns for different priorities
            const soundConfig = {
                urgent: { frequency: 1000, duration: 0.5, pattern: [0.1, 0.1, 0.1, 0.1, 0.1] },
                high: { frequency: 800, duration: 0.4, pattern: [0.2, 0.1, 0.2] },
                medium: { frequency: 600, duration: 0.3, pattern: [0.3] },
                low: { frequency: 400, duration: 0.2, pattern: [0.2] },
            };

            const config = soundConfig[priority as keyof typeof soundConfig] || soundConfig.medium;

            config.pattern.forEach((duration, index) => {
                setTimeout(
                    () => {
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();

                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);

                        oscillator.frequency.value = config.frequency;
                        oscillator.type = 'sine';

                        // Volume envelope
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
                        gainNode.gain.exponentialRampToValueAtTime(
                            0.001,
                            audioContext.currentTime + duration,
                        );

                        oscillator.start(audioContext.currentTime);
                        oscillator.stop(audioContext.currentTime + duration);

                        oscillator.onended = () => {
                            oscillator.disconnect();
                            gainNode.disconnect();
                        };
                    },
                    index * (duration + 0.1) * 1000,
                );
            });

            console.log(`Played ${priority} priority notification sound`);
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    };

    // Monitor pharmacy orders for real-time alerts
    useEffect(() => {
        if (userRole !== 'pharmacy') return;

        const checkForNewOrders = () => {
            const stats = pharmacyOrderService.getOrderStats();
            const currentOrderCount = stats.newOrders;
            const urgentOrders = pharmacyOrderService.getUrgentOrders();

            // Check for new orders
            if (currentOrderCount > lastOrderCount) {
                const newOrdersCount = currentOrderCount - lastOrderCount;
                addAlert({
                    id: `new-orders-${Date.now()}`,
                    type: 'new-order',
                    title: `${newOrdersCount} New Order${newOrdersCount > 1 ? 's' : ''}`,
                    message: `${newOrdersCount} new order${newOrdersCount > 1 ? 's have' : ' has'} been assigned to your pharmacy`,
                    priority: 'high',
                    timestamp: new Date(),
                    actionUrl: '/pharmacy/orders',
                    actionLabel: 'View Orders',
                    autoHide: true,
                    duration: 8000,
                });

                playNotificationSound('high');
                setLastOrderCount(currentOrderCount);
            }

            // Check for urgent orders
            if (urgentOrders.length > 0) {
                const hasUrgentAlert = alerts.some(
                    (alert) =>
                        alert.type === 'urgent-order' &&
                        Date.now() - alert.timestamp.getTime() < 300000, // 5 minutes
                );

                if (!hasUrgentAlert) {
                    addAlert({
                        id: `urgent-orders-${Date.now()}`,
                        type: 'urgent-order',
                        title: 'Urgent Orders Require Attention',
                        message: `${urgentOrders.length} urgent order${urgentOrders.length > 1 ? 's' : ''} need immediate processing`,
                        priority: 'urgent',
                        timestamp: new Date(),
                        actionUrl: '/pharmacy/orders',
                        actionLabel: 'Process Now',
                        autoHide: false,
                    });

                    playNotificationSound('urgent');
                }
            }
        };

        // Initial check
        const stats = pharmacyOrderService.getOrderStats();
        setLastOrderCount(stats.newOrders);

        // Subscribe to order updates
        const unsubscribe = pharmacyOrderService.subscribe(() => {
            checkForNewOrders();
        });

        // Periodic check every 30 seconds
        const interval = setInterval(checkForNewOrders, 30000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole, lastOrderCount, alerts]);

    // Subscribe to general notifications
    useEffect(() => {
        const unsubscribe = NotificationService.subscribe(
            `pharmacy-system-${userId}`,
            (notifications) => {
                // Find new high/urgent priority notifications for this user
                const newNotifications = notifications.filter(
                    (notification) =>
                        notification.userId === userId &&
                        notification.userRole === userRole &&
                        (notification.priority === 'high' || notification.priority === 'urgent') &&
                        !notification.isRead &&
                        Date.now() - notification.createdAt.getTime() < 60000, // Last minute
                );

                newNotifications.forEach((notification) => {
                    addAlert({
                        id: `notification-${notification.id}`,
                        type: notification.type === 'inventory' ? 'low-stock' : 'system',
                        title: notification.title,
                        message: notification.message,
                        priority: notification.priority,
                        timestamp: notification.createdAt,
                        actionUrl: notification.actionUrl,
                        actionLabel: notification.actionLabel,
                        autoHide: true,
                        duration: 6000,
                    });

                    playNotificationSound(notification.priority);
                });
            },
        );

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, userRole]);

    const addAlert = (alert: PharmacyNotificationAlert) => {
        setAlerts((prev) => [alert, ...prev.slice(0, 4)]); // Keep max 5 alerts
        setIsVisible(true);

        // Auto-hide if specified
        if (alert.autoHide) {
            setTimeout(() => {
                removeAlert(alert.id);
            }, alert.duration || 5000);
        }
    };

    const removeAlert = (alertId: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    };

    const clearAllAlerts = () => {
        setAlerts([]);
    };

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);

        // Play a test sound when enabling
        if (!soundEnabled) {
            playNotificationSound('medium');
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500 border-red-600 text-white';
            case 'high':
                return 'bg-orange-500 border-orange-600 text-white';
            case 'medium':
                return 'bg-blue-500 border-blue-600 text-white';
            case 'low':
                return 'bg-gray-500 border-gray-600 text-white';
            default:
                return 'bg-blue-500 border-blue-600 text-white';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'new-order':
                return '📦';
            case 'urgent-order':
                return '🚨';
            case 'low-stock':
                return '📋';
            case 'system':
                return '⚙️';
            default:
                return '🔔';
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        return `${Math.floor(diffInMinutes / 60)}h ago`;
    };

    if (userRole !== 'pharmacy' || alerts.length === 0) return null;

    return (
        <>
            {/* Floating Alert System */}
            <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm" data-oid=".xlxug4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300 ease-in-out ${
                            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        } ${getPriorityColor(alert.priority)}`}
                        data-oid="5wd4zlr"
                    >
                        <div className="flex items-start" data-oid="21m6sc_">
                            <div className="flex-shrink-0 mr-3" data-oid="xd9nerf">
                                <span className="text-2xl" data-oid="2xdr0ip">
                                    {getTypeIcon(alert.type)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0" data-oid="g0prhk1">
                                <div
                                    className="flex items-center justify-between mb-1"
                                    data-oid="h9ku3mk"
                                >
                                    <h4 className="font-semibold text-sm" data-oid="eatprm1">
                                        {alert.title}
                                    </h4>
                                    <span className="text-xs opacity-75" data-oid="6pu5mka">
                                        {formatTime(alert.timestamp)}
                                    </span>
                                </div>
                                <p className="text-sm opacity-90 mb-3" data-oid="f:9kt87">
                                    {alert.message}
                                </p>

                                <div
                                    className="flex items-center justify-between"
                                    data-oid="cimx8tk"
                                >
                                    {alert.actionUrl && (
                                        <button
                                            onClick={() => {
                                                window.location.href = alert.actionUrl!;
                                                removeAlert(alert.id);
                                            }}
                                            className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1 rounded transition-colors"
                                            data-oid="s.0k4wu"
                                        >
                                            {alert.actionLabel || 'View'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeAlert(alert.id)}
                                        className="text-white/80 hover:text-white ml-auto"
                                        data-oid="1sc2rsr"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            data-oid="n05lu_s"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                                data-oid="_rosrfs"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sound Control Panel */}
            {alerts.length > 0 && (
                <div className="fixed bottom-4 right-4 z-50" data-oid="admcdeu">
                    <div
                        className="bg-white rounded-lg shadow-lg border border-gray-200 p-3"
                        data-oid="ct62ofn"
                    >
                        <div className="flex items-center space-x-3" data-oid="7-sxumw">
                            <button
                                onClick={toggleSound}
                                className={`p-2 rounded-lg transition-colors ${
                                    soundEnabled
                                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                                title={soundEnabled ? 'Sound enabled' : 'Sound disabled'}
                                data-oid=".._3xfy"
                            >
                                {soundEnabled ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="m7:z0:r"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM16 8a2 2 0 11-4 0 2 2 0 014 0z"
                                            clipRule="evenodd"
                                            data-oid="oonsg4q"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="9f--axe"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                            data-oid="1uh5_g_"
                                        />
                                    </svg>
                                )}
                            </button>

                            {alerts.length > 1 && (
                                <button
                                    onClick={clearAllAlerts}
                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                    data-oid="visww42"
                                >
                                    Clear All ({alerts.length})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
