'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/contexts/AuthContext';

interface DoctorLayoutProps {
    children: React.ReactNode;
}

export default function DoctorLayout({ children }: DoctorLayoutProps) {
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
                'doctorData',
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
            if (typeof window !== 'undefined') {

                localStorage.clear();
                sessionStorage.clear();
            }
            document.cookie = 'cura_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            window.location.href = '/auth/login';
        }
    };

    const navigation = [
        {
            name: 'Referrals',
            href: '/doctor/referrals',
            current: pathname === '/doctor/referrals',
        },
        {
            name: 'QR Codes',
            href: '/doctor/qr-codes',
            current: pathname === '/doctor/qr-codes',
        },
        {
            name: 'Analytics',
            href: '/doctor/analytics',
            current: pathname === '/doctor/analytics',
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
            case '/doctor/referrals':
                return 'Referral Management';
            case '/doctor/qr-codes':
                return 'QR Code Generator';
            case '/doctor/analytics':
                return 'Analytics & Reports';
            default:
                return 'Referral Management';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" data-oid="zw8tsg9">
            {/* Compact Header */}
            <header
                className="bg-white shadow-lg border-b border-slate-200/50 sticky top-0 z-40"
                data-oid="8_ly3z9"
            >
                {/* Brand accent line */}
                <div className="h-1 bg-cura-gradient w-full" data-oid="l8fr4mg" />

                <div className="px-4 py-2" data-oid="s2ab0j2">
                    <div className="flex items-center justify-between" data-oid=":njqwx0">
                        {/* Left Section - Logo and Title */}
                        <div className="flex items-center space-x-4" data-oid="g.pgayj">
                            <Logo size="sm" variant="gradient" data-oid="mm2:c0p" />
                            <div
                                className="h-6 w-px bg-gray-300 hidden lg:block"
                                data-oid="tlfa9y7"
                            />

                            <div className="hidden lg:block" data-oid="a378nd2">
                                <h1 className="text-lg font-bold text-gray-900" data-oid=".9r7w30">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs text-gray-500" data-oid="n.zw-bu">
                                    Doctor Referral System
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Account Menu */}
                        <div className="flex items-center space-x-3" data-oid="wkhlinr">
                            {/* Account Dropdown */}
                            <div className="relative" ref={dropdownRef} data-oid="nds_y-2">
                                <button
                                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    data-oid="7g6nrzn"
                                >
                                    <div className="relative" data-oid="wewarh3">
                                        <div
                                            className="w-8 h-8 bg-cura-gradient rounded-full flex items-center justify-center shadow-md"
                                            data-oid="gparhtj"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="ih0k_g6"
                                            >
                                                D
                                            </span>
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            data-oid=":erieiz"
                                        ></div>
                                    </div>
                                    <div className="hidden lg:block text-left" data-oid="mn-:nxc">
                                        <p
                                            className="text-sm font-semibold text-gray-800"
                                            data-oid="f9y0suh"
                                        >
                                            Dr. Ahmed Hassan
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="42onk4:">
                                            Cardiologist
                                        </p>
                                    </div>
                                    <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="3o-.mnf"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                            data-oid="ua3l6rn"
                                        />
                                    </svg>
                                </button>

                                {/* Simple Dropdown Menu */}
                                {isAccountDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-slide-down"
                                        data-oid="ldbix8j"
                                    >
                                        {/* User Info Header */}
                                        <div
                                            className="px-4 py-2 border-b border-gray-100"
                                            data-oid="2avwy8-"
                                        >
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="9-f61vd"
                                            >
                                                Dr. Ahmed Hassan
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 truncate"
                                                data-oid="x:vdxe8"
                                            >
                                                ahmed.hassan@doctor.com
                                            </p>
                                        </div>

                                        {/* Navigation Items */}
                                        <Link
                                            href="/doctor/referrals"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="ibrngf:"
                                        >
                                            Referrals
                                        </Link>
                                        <Link
                                            href="/doctor/qr-codes"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="eraq8f_"
                                        >
                                            QR Codes
                                        </Link>

                                        {/* Logout */}
                                        <div
                                            className="border-t border-gray-100 mt-2 pt-2"
                                            data-oid="cop2-cw"
                                        >
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                data-oid="gygkvii"
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

            <div className="flex" data-oid="vg1:wzh">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
                    data-oid="ktri1e0"
                >
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-gray-200" data-oid="q8_ox-v">
                        <div className="flex items-center justify-between" data-oid="nmaao9f">
                            {!sidebarCollapsed && (
                                <div data-oid="st-cy_t">
                                    <h2
                                        className="text-sm font-bold text-gray-900"
                                        data-oid="amspeob"
                                    >
                                        Quick Navigation
                                    </h2>
                                    <p className="text-xs text-gray-500" data-oid="d7f2:xb">
                                        Doctor Tools
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                data-oid="d15:6s2"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="p.mv-pq"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="8t.x30a"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-2 space-y-1" data-oid="xjvhc6c">
                        <div
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2"
                            data-oid="7-imwov"
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
                                data-oid="wxtxzno"
                            >
                                {!sidebarCollapsed && (
                                    <span className="flex-1 font-medium text-sm" data-oid="x3y07do">
                                        {item.name}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1" data-oid="mahpao:">
                    <div className="p-4" data-oid="03m9uy3">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
