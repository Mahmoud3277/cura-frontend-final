'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/contexts/AuthContext';

interface AppServicesLayoutProps {
    children: React.ReactNode;
}

export default function AppServicesLayout({ children }: AppServicesLayoutProps) {
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
                'appServicesData',
                'accessToken',
                'refreshToken',
            ];

            additionalKeysToRemove.forEach((key) => {
                localStorage.removeItem(key);
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

    const navigation = [
        {
            name: 'Dashboard',
            href: '/app-services/dashboard',
            badge: null,
            current: pathname === '/app-services/dashboard',
        },
        {
            name: 'Suspended Orders',
            href: '/app-services/suspended-orders',
            badge: 2,
            current: pathname === '/app-services/suspended-orders',
        },
        {
            name: 'Suspended Prescriptions',
            href: '/app-services/suspended-prescriptions',
            badge: 0,
            current: pathname === '/app-services/suspended-prescriptions',
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
            case '/app-services/dashboard':
                return 'App Services Dashboard';
            case '/app-services/suspended-orders':
                return 'Suspended Orders';
            case '/app-services/customer-service':
                return 'Customer Service';
            case '/app-services/pharmacy-coordination':
                return 'Pharmacy Coordination';
            case '/app-services/order-management':
                return 'Order Management';
            case '/app-services/prescription-issues':
                return 'Prescription Issues';
            case '/app-services/analytics':
                return 'Analytics & Reports';
            case '/app-services/agents':
                return 'Agent Management';
            default:
                return 'App Services';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" data-oid="fsr7vuz">
            {/* Compact Header */}
            <header
                className="bg-white shadow-lg border-b border-slate-200/50 sticky top-0 z-40"
                data-oid="_jr:8mk"
            >
                {/* Brand accent line */}
                <div className="h-1 bg-cura-gradient w-full" data-oid="9xtr48w" />

                <div className="px-4 py-2" data-oid="c195b5.">
                    <div className="flex items-center justify-between" data-oid="f77x2x8">
                        {/* Left Section - Logo and Title */}
                        <div className="flex items-center space-x-4" data-oid="cgmz611">
                            <Logo size="sm" variant="gradient" data-oid="::3qv_2" />
                            <div
                                className="h-6 w-px bg-gray-300 hidden lg:block"
                                data-oid="6r5y1t0"
                            />

                            <div className="hidden lg:block" data-oid="brkgqi5">
                                <h1 className="text-lg font-bold text-gray-900" data-oid="q1wdy9i">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs text-gray-500" data-oid="bd0ixyy">
                                    Customer Service & Issue Management Center
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Account Menu */}
                        <div className="flex items-center space-x-3" data-oid="n_qm3vj">
                            {/* Account Dropdown */}
                            <div className="relative" ref={dropdownRef} data-oid="cuj3vb4">
                                <button
                                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    data-oid="-kh6x:v"
                                >
                                    <div className="relative" data-oid="fw1dpgd">
                                        <div
                                            className="w-8 h-8 bg-cura-gradient rounded-full flex items-center justify-center shadow-md"
                                            data-oid="9jitblj"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="el5rl42"
                                            >
                                                🎧
                                            </span>
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            data-oid="w0542rm"
                                        ></div>
                                    </div>
                                    <div className="hidden lg:block text-left" data-oid="_:6ax-l">
                                        <p
                                            className="text-sm font-semibold text-gray-800"
                                            data-oid="o9:mpv6"
                                        >
                                            App Services Team
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="ritg52q">
                                            Customer Support Agent
                                        </p>
                                    </div>
                                    <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="9g4ns_-"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                            data-oid="zmlew4x"
                                        />
                                    </svg>
                                </button>

                                {/* Simple Dropdown Menu */}
                                {isAccountDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-slide-down"
                                        data-oid="kif2ypu"
                                    >
                                        {/* User Info Header */}
                                        <div
                                            className="px-4 py-2 border-b border-gray-100"
                                            data-oid="z-isu8o"
                                        >
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="s_f4828"
                                            >
                                                App Services Team
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 truncate"
                                                data-oid="e7ib--z"
                                            >
                                                support@cura.com
                                            </p>
                                        </div>

                                        {/* Navigation Items */}
                                        <Link
                                            href="/app-services/dashboard"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="i295jm0"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/app-services/suspended-orders"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="zfshybi"
                                        >
                                            Suspended Orders
                                        </Link>
                                        <Link
                                            href="/app-services/customer-service"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="cx7vidx"
                                        >
                                            Customer Service
                                        </Link>

                                        {/* Logout */}
                                        <div
                                            className="border-t border-gray-100 mt-2 pt-2"
                                            data-oid="wfr2rlf"
                                        >
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                data-oid="u5g-dhj"
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

            <div className="flex" data-oid="1qcaw-c">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
                    data-oid="jft9:zg"
                >
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-gray-200" data-oid="t50pmp4">
                        <div className="flex items-center justify-between" data-oid="cazm_xo">
                            {!sidebarCollapsed && (
                                <div data-oid="uk-e256">
                                    <h2
                                        className="text-sm font-bold text-gray-900"
                                        data-oid="0kt6iu:"
                                    >
                                        Quick Navigation
                                    </h2>
                                    <p className="text-xs text-gray-500" data-oid=":2ttfqv">
                                        App Services Tools
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                data-oid="mbk2e66"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="xv-ge7i"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="asfrbuu"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-2 space-y-1" data-oid="p:o7mx5">
                        <div
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2"
                            data-oid="jgozaml"
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
                                data-oid="ce06lql"
                            >
                                {!sidebarCollapsed && (
                                    <>
                                        <span
                                            className="flex-1 font-medium text-sm"
                                            data-oid="fnwxa9p"
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
                                                data-oid="3do6ol3"
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
                <div className="flex-1" data-oid="1h4fzg.">
                    <div className="p-4" data-oid="vuixarj">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
