'use client';

import { useState } from 'react';
import { UserRole } from '@/lib/types';
import { SimpleNotificationCenter } from './SimpleNotificationCenter';

interface SimpleNotificationBellProps {
    userId: string;
    userRole: UserRole;
}

export function SimpleNotificationBell({ userId, userRole }: SimpleNotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = 3; // Fixed count for testing

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:text-[#1F1F6F] transition-all duration-200"
                title="Notifications"
                data-oid="v060:i:"
            >
                {/* Bell Icon */}
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="w88wb9a"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        data-oid="3u:-xkf"
                    />
                </svg>

                {/* Unread Count Badge */}
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                        data-oid=":r8p-m1"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}

                {/* Pulse Animation for New Notifications */}
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 animate-ping opacity-75"
                        data-oid="7o4:znc"
                    ></span>
                )}
            </button>

            {/* Notification Center */}
            <SimpleNotificationCenter
                userId={userId}
                userRole={userRole}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                data-oid="6z9kins"
            />
        </>
    );
}
