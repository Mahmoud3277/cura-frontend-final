'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/contexts/AuthContext';

interface AppServicesLayoutProps {
    children: React.ReactNode;
}

export default function EnhancedAppServicesLayout({ children }: AppServicesLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSignOut = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAccountDropdownOpen(false);

        try {
            logout();
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 100);
        } catch (error) {
            console.error('Error during sign out:', error);
            if (typeof window !== 'undefined') {

                localStorage.clear();
                sessionStorage.clear();
            }
            window.location.href = '/auth/login';
        }
    };

    const navigation = [
        {
            name: 'Dashboard',
            href: '/app-services',
            current: pathname === '/app-services' || pathname === '/app-services/dashboard',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="moy-ja3"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        data-oid="_:ja97q"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                        data-oid="0vd7m_t"
                    />
                </svg>
            ),
        },
        {
            name: 'Suspended Orders',
            href: '/app-services/suspended-orders',
            current: pathname === '/app-services/suspended-orders',
            badge: '3',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="xjqlnp5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        data-oid=":akxef-"
                    />
                </svg>
            ),
        },
        {
            name: 'Customer Service',
            href: '/app-services/customer-service',
            current: pathname === '/app-services/customer-service',
            badge: '5',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="wx.c9.z"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        data-oid="p.sywu-"
                    />
                </svg>
            ),
        },
        {
            name: 'Analytics',
            href: '/app-services/analytics',
            current: pathname === '/app-services/analytics',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="e5.iu84"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        data-oid="t140.nw"
                    />
                </svg>
            ),
        },
    ];

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
            case '/app-services':
                return 'App Services Dashboard';
            case '/app-services/suspended-orders':
                return 'Suspended Orders';
            case '/app-services/customer-service':
                return 'Customer Service';
            case '/app-services/analytics':
                return 'Analytics & Reports';
            default:
                return 'App Services Panel';
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden" data-oid="esg4i6c">
            {/* Header */}
            <header
                className="bg-white shadow-lg border-b border-slate-200/50 z-40 flex-shrink-0"
                data-oid="gp7s5u-"
            >
                <div
                    className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 w-full"
                    data-oid="r34wulc"
                />

                <div className="px-4 py-2" data-oid="qg0ujet">
                    <div className="flex items-center justify-between" data-oid="tege8vf">
                        <div className="flex items-center space-x-4" data-oid="rvhfrpg">
                            <Logo size="sm" variant="gradient" data-oid="_bfg1po" />
                            <div
                                className="h-6 w-px bg-gray-300 hidden lg:block"
                                data-oid="kckaxi:"
                            />

                            <div className="hidden lg:block" data-oid="8qtaabl">
                                <h1 className="text-lg font-bold text-gray-900" data-oid="mx1sj.q">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs text-gray-500" data-oid=".jx-ngb">
                                    Customer Service & Issue Management
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3" data-oid="7z1us2:">
                            <div className="relative" ref={dropdownRef} data-oid="11xgnpn">
                                <button
                                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    data-oid="dr5noex"
                                >
                                    <div className="relative" data-oid="scteurc">
                                        <div
                                            className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md"
                                            data-oid="2aq2k9o"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="x5esiwt"
                                            >
                                                A
                                            </span>
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            data-oid="m8h.50_"
                                        ></div>
                                    </div>
                                    <div className="hidden lg:block text-left" data-oid="03lx7ic">
                                        <p
                                            className="text-sm font-semibold text-gray-800"
                                            data-oid="0d.epzz"
                                        >
                                            App Services Agent
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="etfzz4d">
                                            Customer Support
                                        </p>
                                    </div>
                                    <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="e9er9e_"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                            data-oid="rhf6dvc"
                                        />
                                    </svg>
                                </button>

                                {isAccountDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100"
                                        data-oid="whvqb4h"
                                    >
                                        <div
                                            className="px-4 py-2 border-b border-gray-100"
                                            data-oid="sksrq4x"
                                        >
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="g1u3ch5"
                                            >
                                                App Services Agent
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 truncate"
                                                data-oid="_-pg3td"
                                            >
                                                appservices@cura.com
                                            </p>
                                        </div>
                                        <Link
                                            href="/app-services"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="94ec2fe"
                                        >
                                            Dashboard
                                        </Link>
                                        <div
                                            className="border-t border-gray-100 mt-2 pt-2"
                                            data-oid="go6w:qt"
                                        >
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                data-oid="276uwpv"
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

            <div className="flex flex-1 overflow-hidden" data-oid="ijmxgm7">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 h-full overflow-y-auto ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
                    data-oid="zpso4y6"
                >
                    <div className="p-3 border-b border-gray-200" data-oid="hn:ar.6">
                        <div className="flex items-center justify-between" data-oid="f0qivlg">
                            {!sidebarCollapsed && (
                                <div data-oid="ohiq0k1">
                                    <h2
                                        className="text-sm font-bold text-gray-900"
                                        data-oid="7l1b7zo"
                                    >
                                        Quick Navigation
                                    </h2>
                                    <p className="text-xs text-gray-500" data-oid="t-yjgs3">
                                        App Services Tools
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                data-oid="bn74o-e"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="3nx314f"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="wo50-n4"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <nav className="p-2 space-y-1" data-oid="ototdat">
                        <div
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2"
                            data-oid="ovzjb5z"
                        >
                            {!sidebarCollapsed && 'MAIN MENU'}
                        </div>
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center px-2 py-2 rounded-lg text-left transition-all duration-200 group ${
                                    item.current
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                                title={sidebarCollapsed ? item.name : undefined}
                                data-oid="a1.t5de"
                            >
                                <div
                                    className={`flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}
                                    data-oid="oedyt3w"
                                >
                                    {item.icon}
                                </div>
                                {!sidebarCollapsed && (
                                    <>
                                        <span
                                            className="flex-1 font-medium text-sm"
                                            data-oid=".k3p71m"
                                        >
                                            {item.name}
                                        </span>
                                        {item.badge && (
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.current ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}
                                                data-oid="15-q-.r"
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
                <main className="flex-1 overflow-y-auto" data-oid="ww4-nvn">
                    <div className="p-4" data-oid="hqfwtja">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
