'use client';

import { useState, useEffect, useRef } from 'react';
import { NotificationService } from '@/lib/services/notificationService';
import { UserRole } from '@/lib/types';
import { DropdownNotificationCenter } from './DropdownNotificationCenter';

interface ImprovedNotificationBellProps {
    userId: string;
    userRole: UserRole;
}

export function ImprovedNotificationBell({ userId, userRole }: ImprovedNotificationBellProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);
    const previousUnreadCount = useRef(0);

    useEffect(() => {
        console.log('ImprovedNotificationBell mounted with userId:', userId, 'userRole:', userRole);

        // Initialize notifications for this user
        NotificationService.initializeForUser(userId, userRole);

        // Load initial unread count
        loadUnreadCount();

        // Subscribe to real-time updates with a unique key for this component
        const unsubscribe = NotificationService.subscribe(
            `improved-notification-bell-${userId}`,
            () => {
                console.log(
                    'ImprovedNotificationBell: Received notification update, reloading count...',
                );
                loadUnreadCount();
            },
        );

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, userRole]);

    const loadUnreadCount = async () => {
        try {
            const count = await NotificationService.getUnreadCount(userId, userRole);

            // Check if there's a new notification (count increased)
            if (count > previousUnreadCount.current && previousUnreadCount.current >= 0) {
                setHasNewNotification(true);
                // Play sound for new notifications
                NotificationService.playNotificationSound();

                // Trigger bell animation
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 1000);

                // Reset new notification flag after animation
                setTimeout(() => setHasNewNotification(false), 3000);
            }

            previousUnreadCount.current = count;
            setUnreadCount(count);
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        // Reset new notification indicator when opening
        if (!isOpen) {
            setHasNewNotification(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        await NotificationService.markAllAsRead(userId, userRole);
        setUnreadCount(0);
        setHasNewNotification(false);
        setIsAnimating(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={bellRef} className="relative">
            <button
                onClick={handleToggle}
                className={`relative p-2 text-gray-600 hover:text-[#1F1F6F] transition-all duration-300 rounded-lg hover:bg-gray-50 ${
                    isAnimating ? 'animate-bounce' : ''
                } ${hasNewNotification ? 'animate-pulse' : ''}`}
                title="Notifications"
                data-oid="improved-notification-bell"
            >
                {/* Bell Icon with enhanced styling */}
                <div className="relative">
                    <svg
                        className={`w-6 h-6 transition-all duration-300 ${
                            hasNewNotification ? 'text-[#1F1F6F] scale-110' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>

                    {/* Enhanced Unread Count Badge */}
                    {unreadCount > 0 && (
                        <span
                            className={`absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg transform transition-all duration-300 ${
                                hasNewNotification ? 'scale-125 animate-pulse' : 'scale-100'
                            }`}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}

                    {/* Pulse Animation Ring for New Notifications */}
                    {hasNewNotification && (
                        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full h-5 w-5 animate-ping opacity-75"></span>
                    )}

                    {/* Glow Effect for New Notifications */}
                    {hasNewNotification && (
                        <div className="absolute inset-0 rounded-lg bg-[#1F1F6F] opacity-20 animate-pulse"></div>
                    )}
                </div>
            </button>

            {/* Enhanced Dropdown Notification Center */}
            <DropdownNotificationCenter
                userId={userId}
                userRole={userRole}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onMarkAllAsRead={handleMarkAllAsRead}
            />
        </div>
    );
}
('use client');

import { useState, useEffect, useRef } from 'react';
import { UserRole } from '@/lib/types';
import { DropdownNotificationCenter } from './DropdownNotificationCenter';

interface ImprovedNotificationBellProps {
    userId: string;
    userRole: UserRole;
}

export function ImprovedNotificationBell({ userId, userRole }: ImprovedNotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);
    const previousUnreadCount = useRef(unreadCount);

    // Play notification sound for new notifications only
    const playNotificationSound = () => {
        try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Notification sound not available');
        }
    };

    // Simulate new notifications (for demo purposes)
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly add new notifications
            if (Math.random() > 0.7) {
                setUnreadCount((prev) => {
                    const newCount = prev + 1;
                    // Only play sound if count increased (new notification)
                    if (newCount > previousUnreadCount.current) {
                        playNotificationSound();
                        setIsAnimating(true);
                        setTimeout(() => setIsAnimating(false), 1000);
                    }
                    previousUnreadCount.current = newCount;
                    return newCount;
                });
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        // Mark notifications as seen when opening
        if (!isOpen && unreadCount > 0) {
            setTimeout(() => {
                setUnreadCount(0);
            }, 500);
        }
    };

    return (
        <div ref={bellRef} className="relative" data-oid="cmp42zm">
            <button
                onClick={handleToggle}
                className={`relative p-2 text-gray-600 hover:text-[#1F1F6F] transition-all duration-200 rounded-lg hover:bg-gray-100 ${
                    isAnimating ? 'animate-bounce' : ''
                } ${isOpen ? 'bg-gray-100 text-[#1F1F6F]' : ''}`}
                title="Notifications"
                data-oid="mtexw3w"
            >
                {/* Bell Icon */}
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="gqef7dw"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        data-oid="ji5iapd"
                    />
                </svg>

                {/* Unread Count Badge */}
                {unreadCount > 0 && (
                    <span
                        className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg ${
                            isAnimating ? 'animate-pulse' : ''
                        }`}
                        data-oid="b3ypip9"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}

                {/* Pulse Animation for New Notifications */}
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 animate-ping opacity-75"
                        data-oid="xc.lqxy"
                    ></span>
                )}
            </button>

            {/* Dropdown Notification Center */}
            <DropdownNotificationCenter
                userId={userId}
                userRole={userRole}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                data-oid="_ds4yo1"
            />
        </div>
    );
}
