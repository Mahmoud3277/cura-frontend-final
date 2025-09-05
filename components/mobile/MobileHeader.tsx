'use client';

import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { CitySelector } from '@/components/city/CitySelector';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { MobileSearchOverlay } from '@/components/mobile/MobileSearchOverlay';
import { useAuth } from '@/lib/contexts/AuthContext';

export function MobileHeader() {
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const handleSearchClick = () => {
        setShowSearchOverlay(true);
    };

    const handleCloseSearch = () => {
        setShowSearchOverlay(false);
    };

    return (
        <>
            <header
                className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 h-16"
                data-oid="w0duh4h"
            >
                <div className="px-4 h-full flex items-center" data-oid="v8ri7km">
                    {/* Left side - City Selection */}
                    <div className="flex items-center w-20" data-oid="left-section">
                        <CitySelector variant="mobile" data-oid="gsty202" />
                    </div>

                    {/* Center - Logo (Absolutely centered) */}
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2"
                        data-oid="center-section"
                    >
                        <Logo size="md" variant="gradient" showIcon={true} data-oid="8d6hgyw" />
                    </div>

                    {/* Right side - Search and Notifications */}
                    <div
                        className="flex items-center space-x-3 ml-auto w-20 justify-end"
                        data-oid="right-section"
                    >
                        {/* Search Icon */}
                        <button
                            onClick={handleSearchClick}
                            className="p-2 text-cura-primary hover:text-cura-secondary transition-colors rounded-full hover:bg-gray-50"
                            aria-label="Search"
                            data-oid="search-btn"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="search-icon"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    data-oid="search-path"
                                />
                            </svg>
                        </button>

                        {/* Notification Bell - Only show when authenticated */}
                        {isAuthenticated && user && (
                            <NotificationBell
                                userId={user.id}
                                userRole={user.role}
                                data-oid="notification-bell"
                            />
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Search Overlay */}
            <MobileSearchOverlay
                isOpen={showSearchOverlay}
                onClose={handleCloseSearch}
                data-oid="mobile-search-overlay"
            />
        </>
    );
}
