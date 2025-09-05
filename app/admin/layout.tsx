'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>(['core', 'management']);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sign out handler using AuthContext
    const handleSignOut = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('Starting sign out process...');

        // Close dropdown immediately
        setIsAccountDropdownOpen(false);

        try {
            // Use AuthContext logout method which handles everything
            logout();

            console.log('AuthContext logout called');

            // Clear any additional storage items that might exist
            const additionalKeysToRemove = [
                'authToken',
                'userRole',
                'userData',
                'adminData',
                'accessToken',
                'refreshToken',
            ];

            additionalKeysToRemove.forEach((key) => {
                if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
                }
            });

            // Clear session storage
            sessionStorage.clear();

            console.log('Additional cleanup completed');

            // Force redirect to login page
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 100);
        } catch (error) {
            console.error('Error during sign out:', error);
            // Fallback: clear everything manually and redirect
            localStorage.clear();
            sessionStorage.clear();
            document.cookie = 'cura_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            window.location.href = '/auth/login';
        }
    };

    // Icon components
    const SectionIcon = ({ type }: { type: string }) => {
        const iconClass = 'w-5 h-5';
        switch (type) {
            case 'core':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="hbnvw.u"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                            data-oid="nvdd01b"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                            data-oid="g4ksqs9"
                        />
                    </svg>
                );

            case 'management':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="e6zih5_"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            data-oid="r33:f_r"
                        />
                    </svg>
                );

            case 'operations':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="5kv8qkl"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            data-oid="z4pth6m"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            data-oid=":8bj7od"
                        />
                    </svg>
                );

            case 'analytics':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="yyyeaj-"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            data-oid="30i5i-e"
                        />
                    </svg>
                );

            default:
                return null;
        }
    };

    const ItemIcon = ({ type }: { type: string }) => {
        const iconClass = 'w-4 h-4';
        switch (type) {
            case 'dashboard':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="gu_la7s"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            data-oid="up9fpwg"
                        />
                    </svg>
                );

            case 'prescription':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="fz5wwg_"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            data-oid="r3ee2vg"
                        />
                    </svg>
                );

            case 'data-input':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="n53_1ff"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            data-oid="vgvoug5"
                        />
                    </svg>
                );

            case 'user':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="knii9l5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            data-oid="_k7lf73"
                        />
                    </svg>
                );

            case 'users':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="mxizz0t"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            data-oid="qf_1f4p"
                        />
                    </svg>
                );

            case 'building':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="8hwmvji"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            data-oid="o7ev.1t"
                        />
                    </svg>
                );

            case 'package':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="lvw5u81"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            data-oid="e2dlpq3"
                        />
                    </svg>
                );

            case 'location':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="f8s0l61"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            data-oid="urj27mj"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            data-oid="7gc8a1w"
                        />
                    </svg>
                );

            case 'chart':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="dm4evxc"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            data-oid="mjn96hm"
                        />
                    </svg>
                );

            case 'document':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="1bp9.rh"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            data-oid="g-d9g51"
                        />
                    </svg>
                );

            case 'subscription':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="aol.q16"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            data-oid="sv2d:za"
                        />
                    </svg>
                );

            case 'money':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="hvqc897"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            data-oid="3odr5-6"
                        />
                    </svg>
                );

            case 'messages':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="lsw.gsd"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            data-oid="t1x34n-"
                        />
                    </svg>
                );

            case 'userPlus':
                return (
                    <svg
                        className={iconClass}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="x5o1ce8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            data-oid="_n2ba3e"
                        />
                    </svg>
                );

            default:
                return null;
        }
    };

    const navigationSections = [
        {
            id: 'core',
            title: 'Core Operations',
            iconType: 'core',
            items: [
                {
                    name: 'Dashboard',
                    href: '/admin/dashboard',
                    current: pathname === '/admin/dashboard',
                    iconType: 'dashboard',
                },
            ],
        },
        {
            id: 'management',
            title: 'User Management',
            iconType: 'management',
            items: [
                {
                    name: 'Users',
                    href: '/admin/users',
                    current: pathname === '/admin/users',
                    iconType: 'users',
                },
                {
                    name: 'Account Creation',
                    href: '/admin/account-creation',
                    current: pathname === '/admin/account-creation',
                    iconType: 'userPlus',
                },
                {
                    name: 'Prescription Reader',
                    href: '/admin/prescription-reader',
                    current: pathname === '/admin/prescription-reader',
                    iconType: 'prescription',
                },
                {
                    name: 'Data Input',
                    href: '/admin/data-input',
                    current: pathname === '/admin/data-input',
                    iconType: 'data-input',
                },
                {
                    name: 'Doctors',
                    href: '/admin/doctors',
                    current: pathname === '/admin/doctors',
                    iconType: 'user',
                },
                {
                    name: 'Customers',
                    href: '/admin/customers',
                    current: pathname === '/admin/customers',
                    iconType: 'user',
                },
                {
                    name: 'Pharmacies',
                    href: '/admin/pharmacies',
                    current: pathname === '/admin/pharmacies',
                    iconType: 'building',
                },
                {
                    name: 'Vendors',
                    href: '/admin/vendors',
                    current: pathname === '/admin/vendors',
                    iconType: 'building',
                },
            ],
        },
        {
            id: 'operations',
            title: 'Operations',
            iconType: 'operations',
            items: [
                {
                    name: 'Orders',
                    href: '/admin/orders',
                    current: pathname === '/admin/orders',
                    iconType: 'package',
                },
                {
                    name: 'Subscriptions',
                    href: '/admin/subscriptions',
                    current: pathname === '/admin/subscriptions',
                    iconType: 'subscription',
                },
                {
                    name: 'Money Transactions',
                    href: '/admin/money-transactions',
                    current: pathname === '/admin/money-transactions',
                    iconType: 'money',
                },
                {
                    name: 'Messages',
                    href: '/admin/messages',
                    current: pathname === '/admin/messages',
                    iconType: 'messages',
                },
                {
                    name: 'Prescriptions',
                    href: '/admin/prescriptions',
                    current: pathname === '/admin/prescriptions',
                    iconType: 'prescription',
                },
                {
                    name: 'Cities',
                    href: '/admin/cities',
                    current: pathname === '/admin/cities',
                    iconType: 'location',
                },
            ],
        },
    ];

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
        );
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsAccountDropdownOpen(false);
            }
        };

        if (isAccountDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAccountDropdownOpen]);

    const getPageTitle = () => {
        switch (pathname) {
            case '/admin/dashboard':
                return 'Admin Dashboard';
            case '/admin/prescription-reader':
                return 'Prescription Reader';
            case '/admin/data-input':
                return 'Data Input Management';
            case '/admin/doctors':
                return 'Doctor Management';
            case '/admin/customers':
                return 'Customer Management';
            case '/admin/users':
                return 'User Management';
            case '/admin/account-creation':
                return 'Account Creation Center';
            case '/admin/pharmacies':
                return 'Pharmacy Management';
            case '/admin/orders':
                return 'Order Management';
            case '/admin/subscriptions':
                return 'Subscription Management';
            case '/admin/money-transactions':
                return 'Money Transactions';
            case '/admin/messages':
                return 'Messages';
            case '/admin/prescriptions':
                return 'Prescription Management';

            case '/admin/cities':
                return 'City Management';
            case '/admin/vendors':
                return 'Vendor Management';
            case '/admin/notifications':
                return 'Notification Center';
            case '/admin/revenue':
                return 'Revenue Analytics';
            case '/admin/pharmacy-assignments':
                return 'Pharmacy Assignments';
            case '/admin/database-users':
                return 'Database Users';
            default:
                return 'Admin Panel';
        }
    };

    return (
        <div className="min-h-screen bg-white" data-oid="9l2adt1">
            {/* Compact Header */}
            <header
                className="bg-white shadow-lg border-b border-slate-200/50 sticky top-0 z-40"
                data-oid="-lc5m6a"
            >
                {/* Brand accent line */}
                <div className="h-1 bg-cura-gradient w-full" data-oid="hhjh6ac" />

                <div className="px-4 py-2" data-oid="-bgqxgx">
                    <div className="flex items-center justify-between" data-oid="0p1gr:9">
                        {/* Left Section - Logo and Title */}
                        <div className="flex items-center space-x-4" data-oid="7:b1g7:">
                            <Logo size="sm" variant="gradient" data-oid="wemfy5_" />
                            <div
                                className="h-6 w-px bg-gray-300 hidden lg:block"
                                data-oid="04_xl.t"
                            />

                            <div className="hidden lg:block" data-oid="v9:635h">
                                <h1 className="text-lg font-bold text-gray-900" data-oid="01y.e3d">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs text-gray-500" data-oid="u5cgc04">
                                    Administrative Control Panel
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Account Menu */}
                        <div className="flex items-center space-x-3" data-oid="96x48u0">
                            {/* Account Dropdown */}
                            <div className="relative" ref={dropdownRef} data-oid="v0km7dx">
                                <button
                                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    data-oid="nonmv:h"
                                >
                                    <div className="relative" data-oid="t2su:zb">
                                        <div
                                            className="w-8 h-8 bg-cura-gradient rounded-full flex items-center justify-center shadow-md"
                                            data-oid="kddv1xd"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="w.dqa-9"
                                            >
                                                A
                                            </span>
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            data-oid="4zmx5i0"
                                        ></div>
                                    </div>
                                    <div className="hidden lg:block text-left" data-oid="p:-iyd5">
                                        <p
                                            className="text-sm font-semibold text-gray-800"
                                            data-oid="uer31g."
                                        >
                                            CURA Administrator
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="8.axkrd">
                                            System Administrator
                                        </p>
                                    </div>
                                    <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="7u_q9z2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                            data-oid="5n7h1ts"
                                        />
                                    </svg>
                                </button>

                                {/* Simple Dropdown Menu */}
                                {isAccountDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-slide-down"
                                        data-oid="mh_ccay"
                                    >
                                        {/* User Info Header */}
                                        <div
                                            className="px-4 py-2 border-b border-gray-100"
                                            data-oid="egerra_"
                                        >
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="agk1uux"
                                            >
                                                CURA Administrator
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 truncate"
                                                data-oid="a:c4gaq"
                                            >
                                                admin@cura.com
                                            </p>
                                        </div>

                                        {/* Navigation Items */}
                                        <Link
                                            href="/admin/dashboard"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="vchj463"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/admin/users"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="8owbzi7"
                                        >
                                            Users
                                        </Link>

                                        {/* Logout */}
                                        <div
                                            className="border-t border-gray-100 mt-2 pt-2"
                                            data-oid="o_5u8f5"
                                        >
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                data-oid="gh:ejk8"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex" data-oid="28bz8g4">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
                    data-oid="e3i3tiy"
                >
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-gray-200" data-oid="4au5uw2">
                        <div className="flex items-center justify-between" data-oid="8kfgly8">
                            {!sidebarCollapsed && (
                                <div data-oid="-s38kzt">
                                    <h2
                                        className="text-sm font-bold text-gray-900"
                                        data-oid="ih1l3lm"
                                    >
                                        Admin Navigation
                                    </h2>
                                    <p className="text-xs text-gray-500" data-oid="h.vp63e">
                                        System Management
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                data-oid="ouzomq-"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="d6jq.ez"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="3e02o6l"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-2 space-y-2" data-oid="6k._t7u">
                        <div
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2"
                            data-oid="eg.cwdd"
                        >
                            {!sidebarCollapsed && 'ADMIN MENU'}
                        </div>

                        {navigationSections.map((section) => (
                            <div key={section.id} className="space-y-1" data-oid="56mbs:p">
                                {/* Section Header */}
                                <button
                                    onClick={() => !sidebarCollapsed && toggleSection(section.id)}
                                    className={`w-full flex items-center px-2 py-2 rounded-lg text-left transition-all duration-200 group ${
                                        sidebarCollapsed ? 'justify-center' : 'hover:bg-gray-100'
                                    }`}
                                    data-oid="kmuaq54"
                                >
                                    <div className="text-gray-600 mr-2" data-oid="0xuw9l6">
                                        <SectionIcon type={section.iconType} data-oid="c:6how4" />
                                    </div>
                                    {!sidebarCollapsed && (
                                        <>
                                            <span
                                                className="flex-1 font-semibold text-sm text-gray-700"
                                                data-oid="y5ayp09"
                                            >
                                                {section.title}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                                    expandedSections.includes(section.id)
                                                        ? 'rotate-90'
                                                        : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="z:yyry4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                    data-oid="o9.mp:p"
                                                />
                                            </svg>
                                        </>
                                    )}
                                </button>

                                {/* Section Items */}
                                {(sidebarCollapsed || expandedSections.includes(section.id)) && (
                                    <div
                                        className={`space-y-1 ${sidebarCollapsed ? '' : 'ml-4'}`}
                                        data-oid="uedgfk6"
                                    >
                                        {section.items.map((item:any) => (
                                            <button
                                                key={item.name}
                                                onClick={() => router.push(item.href)}
                                                className={`w-full flex items-center px-2 py-2 rounded-lg text-left transition-all duration-200 group ${
                                                    item.current
                                                        ? 'bg-cura-gradient text-white shadow-md'
                                                        : 'text-gray-600 hover:bg-cura-primary/5 hover:text-cura-primary'
                                                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                                title={sidebarCollapsed ? item.name : ''}
                                                data-oid="em.v99-"
                                            >
                                                {sidebarCollapsed ? (
                                                    <div
                                                        className="text-gray-600"
                                                        data-oid="pdv4igz"
                                                    >
                                                        <ItemIcon
                                                            type={item.iconType}
                                                            data-oid="22ogt14"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="text-gray-600 mr-2"
                                                            data-oid="zi0uyyi"
                                                        >
                                                            <ItemIcon
                                                                type={item.iconType}
                                                                data-oid="88u9v2k"
                                                            />
                                                        </div>
                                                        <span
                                                            className="flex-1 font-medium text-sm"
                                                            data-oid="-32kpyp"
                                                        >
                                                            {item.name}
                                                        </span>
                                                        {item.badge && (
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                                    item.current
                                                                        ? 'bg-white/20 text-white'
                                                                        : 'bg-red-500 text-white'
                                                                }`}
                                                                data-oid="gnz6uee"
                                                            >
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0" data-oid="kfpzft4">
                    <div className="p-2 lg:p-4" data-oid=".i6429.">
                        {children}
                    </div>
                </div>
            </div>
            
            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
