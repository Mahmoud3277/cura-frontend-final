'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    section: 'general' | 'account' | 'other';
    badge?: number;
}

export function CustomerMobileSideNavigation() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();
    const { user } = useAuth();
    const { items } = useCart();
    const isMobile = useIsMobile();

    // Calculate cart items count for badge
    const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

    // Only show on mobile devices
    if (!isMobile) {
        return null;
    }

    const navigationItems: NavigationItem[] = [
        // GENERAL Section
        {
            name: 'Dashboard',
            href: '/customer/dashboard',
            section: 'general',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="dashboard-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        data-oid="dashboard-path"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                        data-oid="dashboard-path-2"
                    />
                </svg>
            ),
        },
        {
            name: 'Profile',
            href: '/customer/profile',
            section: 'general',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="g0cywqj"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        data-oid="pnmhelo"
                    />
                </svg>
            ),
        },
        {
            name: 'Orders',
            href: '/customer/orders',
            section: 'general',
            badge: cartItemsCount > 0 ? cartItemsCount : undefined,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="6v9.73f"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        data-oid="llhh71d"
                    />
                </svg>
            ),
        },

        {
            name: 'Wallet',
            href: '/customer/wallet',
            section: 'general',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="20.x7c9"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        data-oid="3:wulbf"
                    />
                </svg>
            ),
        },
        {
            name: 'Prescriptions',
            href: '/customer/prescriptions',
            section: 'general',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="5c4it.-"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        data-oid="b8_ipi."
                    />
                </svg>
            ),
        },
        {
            name: 'Subscriptions',
            href: '/customer/subscriptions',
            section: 'general',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="zlc:neq"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        data-oid=":2tj263"
                    />
                </svg>
            ),
        },
        // ACCOUNT Section
        {
            name: 'Settings',
            href: '/customer/settings',
            section: 'account',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="dy:cj2s"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        data-oid="wmefns4"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        data-oid="1qppaa."
                    />
                </svg>
            ),
        },
        // OTHER Section
        {
            name: 'Support',
            href: '/customer/support',
            section: 'other',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="rird6q3"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        data-oid="z4g9egq"
                    />
                </svg>
            ),
        },
    ];

    const sections = {
        general: navigationItems.filter((item) => item.section === 'general'),
        account: navigationItems.filter((item) => item.section === 'account'),
        other: navigationItems.filter((item) => item.section === 'other'),
    };

    const handleSignOut = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/auth/login';
        }
    };

    return (
        <>
            {/* Overlay */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsExpanded(false)}
                    data-oid="jful4l1"
                />
            )}

            {/* Side Navigation */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out ${
                    isExpanded ? 'w-80' : 'w-16'
                }`}
                data-oid="k_.6wvv"
            >
                {/* Header */}
                <div
                    className="h-16 border-b border-gray-100 flex items-center justify-between px-4"
                    data-oid="y528u5c"
                >
                    {isExpanded && (
                        <div className="flex items-center space-x-3" data-oid="-es3r:6">
                            <div
                                className="w-8 h-8 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                data-oid="48qd8aw"
                            >
                                {user?.name?.charAt(0) || 'C'}
                            </div>
                            <div className="flex-1 min-w-0" data-oid="ycjtc7:">
                                <p
                                    className="text-sm font-semibold text-gray-900 truncate"
                                    data-oid="8m6hih6"
                                >
                                    {user?.name || 'Customer'}
                                </p>
                                <p className="text-xs text-gray-500 truncate" data-oid="wb0j_b2">
                                    {user?.email || 'customer@cura.com'}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        data-oid="85em9-e"
                    >
                        <svg
                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="jj.20h-"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                                data-oid="oc2t9h9"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto py-4" data-oid="99823i-">
                    {/* GENERAL Section */}
                    <div className="px-4 mb-6" data-oid="v675eye">
                        {isExpanded && (
                            <h3
                                className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
                                data-oid="u10sml:"
                            >
                                GENERAL
                            </h3>
                        )}
                        <nav className="space-y-1" data-oid="a.u0-1z">
                            {sections.general.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsExpanded(false)}
                                        className={`flex items-center rounded-lg transition-all duration-200 relative ${
                                            isExpanded ? 'px-3 py-2.5' : 'p-2 justify-center'
                                        } ${
                                            isActive
                                                ? 'bg-[#1F1F6F] text-white shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#1F1F6F]'
                                        }`}
                                        title={!isExpanded ? item.name : undefined}
                                        data-oid=":l_fze."
                                    >
                                        <span
                                            className={`flex-shrink-0 relative ${isExpanded ? 'mr-3' : ''}`}
                                            data-oid="57ks5bb"
                                        >
                                            {item.icon}
                                            {item.badge && item.badge > 0 && (
                                                <span
                                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg animate-pulse"
                                                    data-oid="nav-badge"
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </span>
                                        {isExpanded && (
                                            <span
                                                className="font-medium text-sm"
                                                data-oid="831.loq"
                                            >
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* ACCOUNT Section */}
                    <div className="px-4 mb-6" data-oid="fsvdtoh">
                        {isExpanded && (
                            <h3
                                className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
                                data-oid="hbjh45_"
                            >
                                ACCOUNT
                            </h3>
                        )}
                        <nav className="space-y-1" data-oid="kf259oy">
                            {sections.account.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsExpanded(false)}
                                        className={`flex items-center rounded-lg transition-all duration-200 relative ${
                                            isExpanded ? 'px-3 py-2.5' : 'p-2 justify-center'
                                        } ${
                                            isActive
                                                ? 'bg-[#1F1F6F] text-white shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#1F1F6F]'
                                        }`}
                                        title={!isExpanded ? item.name : undefined}
                                        data-oid="_5kn8ak"
                                    >
                                        <span
                                            className={`flex-shrink-0 relative ${isExpanded ? 'mr-3' : ''}`}
                                            data-oid="cxeez83"
                                        >
                                            {item.icon}
                                            {item.badge && item.badge > 0 && (
                                                <span
                                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg animate-pulse"
                                                    data-oid="74f5_6g"
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </span>
                                        {isExpanded && (
                                            <span
                                                className="font-medium text-sm"
                                                data-oid="ewvrysc"
                                            >
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* OTHER Section */}
                    <div className="px-4 mb-6" data-oid="m.ovu.c">
                        {isExpanded && (
                            <h3
                                className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
                                data-oid="g1bhlmf"
                            >
                                OTHER
                            </h3>
                        )}
                        <nav className="space-y-1" data-oid="j3910dr">
                            {sections.other.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsExpanded(false)}
                                        className={`flex items-center rounded-lg transition-all duration-200 relative ${
                                            isExpanded ? 'px-3 py-2.5' : 'p-2 justify-center'
                                        } ${
                                            isActive
                                                ? 'bg-[#1F1F6F] text-white shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#1F1F6F]'
                                        }`}
                                        title={!isExpanded ? item.name : undefined}
                                        data-oid="1q_2kcg"
                                    >
                                        <span
                                            className={`flex-shrink-0 relative ${isExpanded ? 'mr-3' : ''}`}
                                            data-oid="ndbozyb"
                                        >
                                            {item.icon}
                                            {item.badge && item.badge > 0 && (
                                                <span
                                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg animate-pulse"
                                                    data-oid="-azdnnq"
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </span>
                                        {isExpanded && (
                                            <span
                                                className="font-medium text-sm"
                                                data-oid="pe4gg4u"
                                            >
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Sign Out Button */}
                <div className="border-t border-gray-100 p-4" data-oid="xr0hd16">
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center w-full text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors ${
                            isExpanded ? 'px-3 py-2.5' : 'p-2 justify-center'
                        }`}
                        title={!isExpanded ? 'Sign out' : undefined}
                        data-oid="0.h:z::"
                    >
                        <svg
                            className={`w-5 h-5 ${isExpanded ? 'mr-3' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="-n:7sc:"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                data-oid="flrxuol"
                            />
                        </svg>
                        {isExpanded && (
                            <span className="font-medium text-sm" data-oid="r8vkfv6">
                                Sign out
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
