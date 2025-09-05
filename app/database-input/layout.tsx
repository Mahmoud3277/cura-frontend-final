'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/contexts/AuthContext';

interface DatabaseInputLayoutProps {
    children: React.ReactNode;
}

export default function DatabaseInputLayout({ children }: DatabaseInputLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
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
                'databaseInputData',
                'accessToken',
                'refreshToken',
            ];
            if (typeof window !== 'undefined') {
                additionalKeysToRemove.forEach((key) => {
                    localStorage.removeItem(key);
                });
            }

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

    const navigation = [
        {
            name: 'Dashboard',
            href: '/database-input/dashboard',
            current: pathname === '/database-input/dashboard',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="hd7p0l0"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        data-oid="s.n--wo"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                        data-oid="jxfh1-6"
                    />
                </svg>
            ),
        },
        {
            name: 'All Products',
            href: '/database-input/products',
            current: pathname === '/database-input/products',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="ajnu_wg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        data-oid="tjqd:l5"
                    />
                </svg>
            ),
        },
        {
            name: 'Add Product',
            href: '/database-input/products/add',
            current: pathname === '/database-input/products/add',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="rnfh2kw"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        data-oid="y4227:b"
                    />
                </svg>
            ),
        },
        {
            name: 'Bulk Import',
            href: '/database-input/bulk-import',
            current: pathname === '/database-input/bulk-import',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="k24hka9"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        data-oid="ia38cil"
                    />
                </svg>
            ),
        },
        {
            name: 'Categories',
            href: '/database-input/categories',
            current: pathname === '/database-input/categories',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="8rn0h0-"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        data-oid="16pttt9"
                    />
                </svg>
            ),
        },
    ];

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
            case '/database-input/dashboard':
                return 'Database Input Dashboard';
            case '/database-input/products':
                return 'Product Management';
            case '/database-input/products/add':
                return 'Add New Product';
            case '/database-input/bulk-import':
                return 'Bulk Import';

            case '/database-input/categories':
                return 'Category Management';
            default:
                return 'Database Input Panel';
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden" data-oid="r31:l_b">
            {/* Compact Header */}
            <header
                className="bg-white shadow-lg border-b border-slate-200/50 z-40 flex-shrink-0"
                data-oid="u.ma1a7"
            >
                {/* Brand accent line */}
                <div className="h-1 bg-cura-gradient w-full" data-oid="rvw1ljm" />

                <div className="px-4 py-2" data-oid="zbusqga">
                    <div className="flex items-center justify-between" data-oid="-6epd1y">
                        {/* Left Section - Logo and Title */}
                        <div className="flex items-center space-x-4" data-oid="9:zvfas">
                            <Logo size="sm" variant="gradient" data-oid="a5hs8kn" />
                            <div
                                className="h-6 w-px bg-gray-300 hidden lg:block"
                                data-oid="qgprirr"
                            />

                            <div className="hidden lg:block" data-oid="i2cngy5">
                                <h1 className="text-lg font-bold text-gray-900" data-oid="dgparj8">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs text-gray-500" data-oid="nw_cf1z">
                                    Database Management System
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Account Menu */}
                        <div className="flex items-center space-x-3" data-oid=".6xgjuo">
                            {/* Account Dropdown */}
                            <div className="relative" ref={dropdownRef} data-oid="52a4xey">
                                <button
                                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    data-oid="zv07z62"
                                >
                                    <div className="relative" data-oid="b-n_ilw">
                                        <div
                                            className="w-8 h-8 bg-cura-gradient rounded-full flex items-center justify-center shadow-md"
                                            data-oid="hs1q6tl"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="_t3m5qi"
                                            >
                                                D
                                            </span>
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            data-oid="tnb.y50"
                                        ></div>
                                    </div>
                                    <div className="hidden lg:block text-left" data-oid=":_es0xd">
                                        <p
                                            className="text-sm font-semibold text-gray-800"
                                            data-oid="p9-1rtd"
                                        >
                                            Data Entry User
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="omux.ts">
                                            Database Manager
                                        </p>
                                    </div>
                                    <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="a2-9ai8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                            data-oid="rpposos"
                                        />
                                    </svg>
                                </button>

                                {/* Simple Dropdown Menu */}
                                {isAccountDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-slide-down"
                                        data-oid="5f4_c:_"
                                    >
                                        {/* User Info Header */}
                                        <div
                                            className="px-4 py-2 border-b border-gray-100"
                                            data-oid="d9mmhfw"
                                        >
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="lb4e389"
                                            >
                                                Data Entry User
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 truncate"
                                                data-oid="oia0-bm"
                                            >
                                                dataentry@cura.com
                                            </p>
                                        </div>

                                        {/* Navigation Items */}
                                        <Link
                                            href="/database-input/dashboard"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="p78mb4_"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/database-input/products"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="rog977c"
                                        >
                                            All Products
                                        </Link>
                                        <Link
                                            href="/database-input/products/add"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="6wou44l"
                                        >
                                            Add Product
                                        </Link>

                                        {/* Logout */}
                                        <div
                                            className="border-t border-gray-100 mt-2 pt-2"
                                            data-oid="31323cg"
                                        >
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                data-oid="ksjc82u"
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

            <div className="flex flex-1 overflow-hidden" data-oid="voy..od">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 h-full overflow-y-auto ${
                        sidebarCollapsed ? 'w-16' : 'w-64'
                    }`}
                    data-oid="o2gylcr"
                >
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-gray-200" data-oid="ssvnacw">
                        <div className="flex items-center justify-between" data-oid="ohjqw.y">
                            {!sidebarCollapsed && (
                                <div data-oid="4q_514g">
                                    <h2
                                        className="text-sm font-bold text-gray-900"
                                        data-oid="l2z:m52"
                                    >
                                        Quick Navigation
                                    </h2>
                                    <p className="text-xs text-gray-500" data-oid="n5v0klz">
                                        Database Tools
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                data-oid="45o:g5y"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        sidebarCollapsed ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="c4c.a8a"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="1-b:gz:"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-2 space-y-1" data-oid="93-gkd:">
                        <div
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2"
                            data-oid="i2i:.62"
                        >
                            {!sidebarCollapsed && 'MAIN MENU'}
                        </div>
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center px-2 py-2 rounded-lg text-left transition-all duration-200 group ${
                                    item.current
                                        ? 'bg-cura-gradient text-white shadow-md'
                                        : 'text-gray-700 hover:bg-cura-primary/5 hover:text-cura-primary'
                                }`}
                                title={sidebarCollapsed ? item.name : undefined}
                                data-oid="59exj0q"
                            >
                                {/* Icon */}
                                <div
                                    className={`flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}
                                    data-oid="w_llf8p"
                                >
                                    {item.icon}
                                </div>

                                {/* Text and Badge - only show when not collapsed */}
                                {!sidebarCollapsed && (
                                    <>
                                        <span
                                            className="flex-1 font-medium text-sm"
                                            data-oid="a75:7p0"
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
                                                data-oid="jmuqwvj"
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto" data-oid="u:xbx22">
                    <div className="p-4" data-oid="-ck3oci">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
