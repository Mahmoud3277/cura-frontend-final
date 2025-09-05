'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useSidebar } from '@/lib/contexts/SidebarContext';
import { useMemo } from 'react';

interface SidebarProps {
    className?: string;
    userType?:
        | 'customer'
        | 'admin'
        | 'pharmacy'
        | 'prescription-reader'
        | 'database-input'
        | 'doctor'
        | 'vendor';
}

interface MenuItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
    section?: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

export function Sidebar({ className = '', userType = 'customer' }: SidebarProps) {
    const { isCollapsed, toggleSidebar } = useSidebar();
    const pathname = usePathname();
    const { user } = useAuth();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    // Define menu items based on user type
    

    const menuSections: MenuSection[] = useMemo(() => {
        const getMenuSections = (): MenuSection[] => {
            switch (userType) {
                case 'customer':
                    return [
                        {
                            title: 'GENERAL',
                            items: [
                                {
                                    label: 'Profile',
                                    href: '/customer/profile',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="gmxzrpy"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                data-oid="ks1ufho"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Orders',
                                    href: '/customer/orders',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="p9zu2yg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                data-oid="ca_-35h"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Prescriptions',
                                    href: '/customer/prescriptions',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="s9s17f:"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                data-oid="djlr567"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Subscriptions',
                                    href: '/customer/subscriptions',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="xzjvak1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                data-oid="vvvyl_7"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Wallet',
                                    href: '/customer/wallet',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="hksiit8"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                data-oid="aosymr3"
                                            />
                                        </svg>
                                    ),
                                },
                            ],
                        },
                        {
                            title: 'ACCOUNT',
                            items: [
                                {
                                    label: 'Settings',
                                    href: '/customer/settings',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="5ols_32"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                data-oid="ermx8qz"
                                            />
    
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                data-oid="_ilmzn-"
                                            />
                                        </svg>
                                    ),
                                },
                            ],
                        },
                        {
                            title: 'OTHER',
                            items: [
                                {
                                    label: 'Support',
                                    href: '/customer/support',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="hqr2irk"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="wspx1r7"
                                            />
                                        </svg>
                                    ),
                                },
                            ],
                        },
                    ];
    
                case 'admin':
                    return [
                        {
                            title: 'OVERVIEW',
                            items: [
                                {
                                    label: 'Dashboard',
                                    href: '/admin/dashboard',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="1v00zd-"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                                data-oid=".4-_g6f"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Analytics',
                                    href: '/admin/analytics',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="-1evuwq"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                data-oid="tpdj4pv"
                                            />
                                        </svg>
                                    ),
                                },
                            ],
                        },
                        {
                            title: 'MANAGEMENT',
                            items: [
                                { label: 'Orders', href: '/admin/orders', icon: '📦' },
                                {
                                    label: 'Prescriptions',
                                    href: '/admin/prescriptions',
                                    icon: '📋',
                                },
                                { label: 'Users', href: '/admin/users', icon: '👥' },
                                { label: 'Pharmacies', href: '/admin/pharmacies', icon: '🏥' },
                                { label: 'Doctors', href: '/admin/doctors', icon: '👨‍⚕️' },
                                { label: 'Vendors', href: '/admin/vendors', icon: '🏪' },
                            ],
                        },
                    ];
    
                case 'pharmacy':
                    return [
                        {
                            title: 'GENERAL',
                            items: [
                                { label: 'Dashboard', href: '/pharmacy/dashboard', icon: '📊' },
                                { label: 'Orders', href: '/pharmacy/orders', icon: '📦' },
                                { label: 'Inventory', href: '/pharmacy/inventory', icon: '📋' },
                            ],
                        },
                    ];
    
                case 'prescription-reader':
                    return [
                        {
                            title: 'PRESCRIPTION WORKFLOW',
                            items: [
                                {
                                    label: 'Dashboard',
                                    href: '/prescription-reader/dashboard',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="nybjw.w"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                data-oid="a38p0z8"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Prescription Queue',
                                    href: '/prescription-reader/queue',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="bdum37t"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                data-oid="e-4571s"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'Completed',
                                    href: '/prescription-reader/completed',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="lz29s8a"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="_g0ofy4"
                                            />
                                        </svg>
                                    ),
                                },
                            ],
                        },
                        {
                            title: 'TOOLS & RESOURCES',
                            items: [
                                {
                                    label: 'Medicine Database',
                                    href: '/prescription-reader/database',
                                    icon: (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="g11dou1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                data-oid="vghck3b"
                                            />
                                        </svg>
                                    ),
                                },
                            ],
                        },
                    ];
    
                case 'doctor':
                    return [
                        {
                            title: 'GENERAL',
                            items: [
                                { label: 'Dashboard', href: '/doctor/dashboard', icon: '📊' },
                                { label: 'Referrals', href: '/doctor/referrals', icon: '🔗' },
                            ],
                        },
                    ];
    
                case 'vendor':
                    return [
                        {
                            title: 'GENERAL',
                            items: [
                                { label: 'Dashboard', href: '/vendor/dashboard', icon: '📊' },
                                { label: 'Products', href: '/vendor/products', icon: '📦' },
                                { label: 'Inventory', href: '/vendor/inventory', icon: '📋' },
                            ],
                        },
                    ];
    
                case 'database-input':
                    // Database input uses its own custom layout, return empty to avoid conflicts
                    return [];
    
                default:
                    return [];
            }
        }
        return getMenuSections();
    }, [userType]);

    // For customer, render the new compact design
    if (userType === 'customer') {
        return (
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-100 z-20 overflow-hidden flex flex-col transition-[width] duration-300 ease-in-out ${
                    isCollapsed ? 'w-20' : 'w-80'
                } ${className}`}
                data-oid=":-je_yh"
            >
                {/* User Profile Section */}
                <div
                    className={`border-b border-gray-100 relative flex-shrink-0 ${isCollapsed ? 'p-2' : 'p-6'}`}
                    data-oid="4fvsrxx"
                >
                    {isCollapsed ? (
                        <div className="flex flex-col items-center" data-oid="vfox.q9">
                            <div
                                className="w-8 h-8 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center text-white text-xs font-semibold mb-2"
                                data-oid="vxayuoa"
                            >
                                {user?.name?.charAt(0) || 'J'}
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="p-1 rounded-lg hover:bg-gray-100"
                                data-oid="n9_h305"
                            >
                                <svg
                                    className="w-4 h-4 text-gray-500 rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="dl8_esw"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="a.v7lyg"
                                    />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center space-x-3" data-oid="2z6pww4">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                    data-oid=".1fonng"
                                >
                                    {user?.name?.charAt(0) || 'J'}
                                </div>
                                <div className="flex-1 min-w-0" data-oid="5jv:jxt">
                                    <p
                                        className="text-sm font-semibold text-gray-900 truncate"
                                        data-oid="8ou.x6z"
                                    >
                                        {user?.name || 'John Customer'}
                                    </p>
                                    <p
                                        className="text-xs text-gray-500 truncate"
                                        data-oid="a3scer."
                                    >
                                        {user?.email || 'customer@cura.com'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={toggleSidebar}
                                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100"
                                data-oid="v_wn0ex"
                            >
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="vckmjlu"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="083.sm1"
                                    />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav
                    className={`${isCollapsed ? 'p-2' : 'p-4'} flex-1 overflow-y-auto`}
                    data-oid="h:97o_."
                >
                    {menuSections && menuSections.map((section: MenuSection, sectionIndex: number) => (
                        <div
                            key={section.title}
                            className={sectionIndex > 0 ? (isCollapsed ? 'mt-4' : 'mt-8') : ''}
                            data-oid="6gpk.je"
                        >
                            {!isCollapsed && (
                                <h3
                                    className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
                                    data-oid="eo5834q"
                                >
                                    {section.title}
                                </h3>
                            )}
                            <ul
                                className={`${isCollapsed ? 'space-y-2' : 'space-y-1'}`}
                                data-oid="41ptvbb"
                            >
                                {section.items.map((item: MenuItem) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.href} data-oid="gnwbvqd">
                                            <Link
                                                href={item.href}
                                                className={`flex items-center rounded-lg group relative ${
                                                    isCollapsed
                                                        ? 'p-2 justify-center'
                                                        : 'px-3 py-2.5'
                                                } ${
                                                    isActive
                                                        ? 'bg-[#1F1F6F] text-white shadow-sm'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#1F1F6F]'
                                                }`}
                                                title={isCollapsed ? item.label : undefined}
                                                data-oid="pgp6_ye"
                                            >
                                                <span
                                                    className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}
                                                    data-oid="af5ym.4"
                                                >
                                                    {item.icon}
                                                </span>
                                                {!isCollapsed && (
                                                    <>
                                                        <span
                                                            className="font-medium flex-1 text-sm"
                                                            data-oid="afc1i9j"
                                                        >
                                                            {item.label}
                                                        </span>
                                                        {item.badge && (
                                                            <span
                                                                className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium"
                                                                data-oid="4q:nr-4"
                                                            >
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                                {isCollapsed && item.badge && (
                                                    <span
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                                                        data-oid="me455tk"
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Sign Out Section */}
                <div
                    className={`flex-shrink-0 border-t border-gray-100 bg-white ${
                        isCollapsed ? 'p-2' : 'p-4'
                    }`}
                    data-oid="gzjq_:b"
                >
                    <button
                        onClick={() => {
                            // Handle sign out
                            if (typeof window !== 'undefined') {
                                // Clear any stored auth data
                                localStorage.removeItem('auth_token');
                                localStorage.removeItem('user_data');
                                // Redirect to login or home page
                                window.location.href = '/auth/login';
                            }
                        }}
                        className={`flex items-center w-full text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors ${
                            isCollapsed ? 'p-2 justify-center' : 'px-3 py-2.5'
                        }`}
                        title={isCollapsed ? 'Sign out' : undefined}
                        data-oid="8jt3c2o"
                    >
                        <svg
                            className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="1m4b5le"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                data-oid="denj1ud"
                            />
                        </svg>
                        {!isCollapsed && (
                            <span className="font-medium text-sm" data-oid="tixnmig">
                                Sign out
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        );
    }

    // For database-input, return null since it uses its own custom layout
    if (userType === 'database-input') {
        return null;
    }

    // For other user types, keep the original design but make it smaller
    // Special styling for prescription-reader to emphasize workflow
    const isPrescriptionReader = userType === 'prescription-reader';

    return (
        <aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] shadow-lg border-r transition-all duration-300 z-30 overflow-y-auto ${
                isPrescriptionReader
                    ? 'bg-gradient-to-b from-[#1F1F6F]/5 to-white border-[#1F1F6F]/20'
                    : 'bg-white border-gray-200'
            } ${isCollapsed ? 'w-16' : 'w-64'} ${className}`}
            data-oid="hxl8j20"
        >
            {/* Sidebar Header */}
            <div
                className={`p-4 border-b ${isPrescriptionReader ? 'border-[#1F1F6F]/20 bg-gradient-to-r from-[#1F1F6F] to-[#14274E]' : 'border-gray-200'}`}
                data-oid="bc9._b9"
            >
                <div className="flex items-center justify-between" data-oid="4-e2a-2">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-2" data-oid="bfhpedd">
                            {isPrescriptionReader && (
                                <span className="text-2xl" data-oid="baj_b3y">
                                    🔬
                                </span>
                            )}
                            <h2
                                className={`text-lg font-semibold capitalize ${
                                    isPrescriptionReader ? 'text-white' : 'text-gray-800'
                                }`}
                                data-oid="7fy29pu"
                            >
                                {isPrescriptionReader ? 'Prescription Reader' : `${userType} Panel`}
                            </h2>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className={`p-2 rounded-lg transition-colors ${
                            isPrescriptionReader
                                ? 'hover:bg-white/20 text-white'
                                : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        data-oid="eg_:soh"
                    >
                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${
                                isCollapsed ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="a-8lc6y"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                data-oid="wjde-m5"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4" data-oid="7rpxrvp">
                {menuSections.map((section: MenuSection, sectionIndex: number) => (
                    <div key={section.title} className="mb-6" data-oid="kq:1ztl">
                        {!isCollapsed && (
                            <h3
                                className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                                    isPrescriptionReader &&
                                    section.title === 'PRESCRIPTION WORKFLOW'
                                        ? 'text-[#1F1F6F] font-bold'
                                        : 'text-gray-400'
                                }`}
                                data-oid="s_0qpp3"
                            >
                                {section.title}
                            </h3>
                        )}
                        <ul className="space-y-2" data-oid="th77kqm">
                            {section.items.map((item: MenuItem) => {
                                const isActive = pathname === item.href;
                                const isWorkflowSection =
                                    isPrescriptionReader &&
                                    section.title === 'PRESCRIPTION WORKFLOW';

                                return (
                                    <li key={item.href} data-oid=":egor5i">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white shadow-lg'
                                                    : isWorkflowSection
                                                      ? 'text-[#1F1F6F] hover:bg-gradient-to-r hover:from-[#1F1F6F]/10 hover:to-[#14274E]/10 hover:text-[#1F1F6F] border border-[#1F1F6F]/20'
                                                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 hover:text-[#1F1F6F]'
                                            }`}
                                            data-oid="rfi8jp5"
                                        >
                                            {isWorkflowSection && !isActive && (
                                                <div
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1F1F6F] to-[#14274E] rounded-r"
                                                    data-oid="rw4tsqa"
                                                ></div>
                                            )}
                                            <span
                                                className="text-lg mr-3 flex-shrink-0"
                                                data-oid="g191cqa"
                                            >
                                                {typeof item.icon === 'string'
                                                    ? item.icon
                                                    : item.icon}
                                            </span>
                                            {!isCollapsed && (
                                                <>
                                                    <span
                                                        className={`font-medium flex-1 ${
                                                            isWorkflowSection ? 'font-semibold' : ''
                                                        }`}
                                                        data-oid="3ry5v6e"
                                                    >
                                                        {item.label}
                                                    </span>
                                                    {item.badge && (
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                                isActive
                                                                    ? 'bg-white/20 text-white'
                                                                    : isWorkflowSection
                                                                      ? 'bg-[#1F1F6F] text-white'
                                                                      : 'bg-red-500 text-white'
                                                            }`}
                                                            data-oid="b680wzw"
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
