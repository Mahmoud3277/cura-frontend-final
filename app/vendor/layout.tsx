'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/contexts/AuthContext';
import { providerOrderService } from '@/lib/services/vendorManagementService';
import { getAuthToken } from '@/lib/utils/cookies';

interface VendorLayoutProps {
    children: React.ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
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
                'vendorData',
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
    const [totalOrders, settotalOrders] = useState(0);
    const [totalReturnOrders, settotalReturnOrders] = useState(0);
    const [vendorData, setVendorData] = useState<any>(null);
    
    const getUser = async(): Promise<any> => {
        const token = getAuthToken();
        if (token) {
            const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
            const data = await user.json();
            console.log(data);
            setVendorData(data.data);
            return data.data.vendor;
        }
        return undefined;
    }
    
    const fetchTotalOrders = async() => {
        const vendor = await getUser();
        if (vendor) {
            console.log('getting orders for vendor:', vendor);
            console.log('vendor._id:', vendor._id);
            const data = await providerOrderService.getAllOrders({}, vendor._id);
            console.log('order : ',data);
            if (data) {
                // Filter orders that are not delivered and not in return process
                const activeOrders = data.data.filter((order: any) =>
                    order.status !== "delivered" &&
                    order.status !== "approved" &&
                    order.status !== "rejected" &&
                    order.status !== "refunded" &&
                    order.status !== "return-requested"
                );
                settotalOrders(activeOrders.length);

                // Count return-related orders
                const returnOrders = data.data.filter((order: any) =>
                    order.status === "approved" ||
                    order.status === "rejected" ||
                    order.status === "refunded" ||
                    order.status === "return-requested"
                );
                settotalReturnOrders(returnOrders.length);
            }
        }
    }
    useEffect(() => {
        fetchTotalOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const navigation = [
        {
            name: 'Orders',
            href: '/vendor/orders',
            badge: totalOrders,
            current: pathname === '/vendor/orders',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="1q5rzun"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        data-oid="ieh3v1-"
                    />
                </svg>
            ),
        },
        {
            name: 'Dashboard',
            href: '/vendor/dashboard',
            current: pathname === '/vendor/dashboard',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="171u5t4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        data-oid="63t:1.:"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                        data-oid="9tdv15f"
                    />
                </svg>
            ),
        },
        {
            name: 'Products',
            href: '/vendor/products',
            current: pathname === '/vendor/products',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="dph743u"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        data-oid="t6oxof3"
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
            case '/vendor/orders':
                return 'Order Management';
            case '/vendor/orders/completed':
                return 'Completed Orders';
            case '/vendor/dashboard':
                return 'Dashboard';
            case '/vendor/products':
                return 'Product Management';
            default:
                return 'Vendor Panel';
        }
    };

    return (
        <div
            className="min-h-screen bg-gray-50 w-full overflow-hidden vendor-layout"
            data-oid="2jtqu53"
        >
            {/* Compact Header */}
            <header
                className="bg-white shadow-lg border-b border-slate-200/50 sticky top-0 z-40"
                data-oid="p70n3m9"
            >
                {/* Brand accent line */}
                <div className="h-1 bg-cura-gradient w-full" data-oid="i2lngat" />
                <div className="px-4 py-2" data-oid="t72b-a.">
                    <div className="flex items-center justify-between" data-oid="qlmnw7w">
                        {/* Left Section - Logo and Title */}
                        <div className="flex items-center space-x-4" data-oid="f_ctrb.">
                            <Logo size="sm" variant="gradient" data-oid="kywn71i" />
                            <div
                                className="h-6 w-px bg-gray-300 hidden lg:block"
                                data-oid="4l4ytgg"
                            />

                            <div className="hidden lg:block" data-oid="4x0_2c:">
                                <h1 className="text-lg font-bold text-gray-900" data-oid="0emmpj.">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs text-gray-500" data-oid="ala6l4h">
                                    Vendor Management System
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Account Menu */}
                        <div className="flex items-center space-x-3" data-oid="wvjtyvw">
                            {/* Account Dropdown */}
                            <div className="relative" ref={dropdownRef} data-oid="829c8mw">
                                <button
                                    className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    data-oid="sefu5s9"
                                >
                                    <div className="relative" data-oid="-89lbeg">
                                        <div
                                            className="w-8 h-8 bg-cura-gradient rounded-full flex items-center justify-center shadow-md"
                                            data-oid="woltizm"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="1qt1rbg"
                                            >
                                                {vendorData?.vendor?.vendorName?.charAt(0)?.toUpperCase() || 'V'}
                                            </span>
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                            data-oid="n--au20"
                                        ></div>
                                    </div>
                                    <div className="hidden lg:block text-left" data-oid="_m968wf">
                                        <p
                                            className="text-sm font-semibold text-gray-800"
                                            data-oid="nxv2vuz"
                                        >
                                            {vendorData?.vendor?.vendorName || 'Vendor'}
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid=".upl69v">
                                            {vendorData?.vendor?.vendorType || 'Vendor Manager'}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="ceufhlu"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                            data-oid="e:1b.ui"
                                        />
                                    </svg>
                                </button>

                                {/* Simple Dropdown Menu */}
                                {isAccountDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-slide-down"
                                        data-oid="4t.k5zw"
                                    >
                                        {/* User Info Header */}
                                        <div
                                            className="px-4 py-2 border-b border-gray-100"
                                            data-oid="2ebg8sg"
                                        >
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="a-6olsv"
                                            >
                                                {vendorData?.vendor?.vendorName || 'Vendor'}
                                            </p>
                                            <p
                                                className="text-xs text-gray-500 truncate"
                                                data-oid="tqyixr8"
                                            >
                                                {vendorData?.vendor?.email || vendorData?.user?.email || 'vendor@cura.com'}
                                            </p>
                                        </div>

                                        {/* Navigation Items */}
                                        <Link
                                            href="/vendor/dashboard"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="og5to3."
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/vendor/orders"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="t7ivsia"
                                        >
                                            Orders
                                        </Link>

                                        <Link
                                            href="/vendor/products"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                            onClick={() => setIsAccountDropdownOpen(false)}
                                            data-oid="1nnrc_v"
                                        >
                                            Products
                                        </Link>

                                        {/* Logout */}
                                        <div
                                            className="border-t border-gray-100 mt-2 pt-2"
                                            data-oid=":8suui9"
                                        >
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                data-oid="s7z-u1e"
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

            <div className="flex min-h-screen w-full overflow-hidden" data-oid="echrzb7">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 ${
                        sidebarCollapsed ? 'w-16 min-w-[4rem]' : 'w-64 min-w-[16rem]'
                    }`}
                    style={{
                        width: sidebarCollapsed ? '4rem' : '16rem',
                        minWidth: sidebarCollapsed ? '4rem' : '16rem',
                    }}
                    data-oid="t3if94z"
                >
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-gray-200" data-oid="-bvq-vc">
                        <div className="flex items-center justify-between" data-oid="v5crdfg">
                            {!sidebarCollapsed && (
                                <div data-oid="f_r5p73">
                                    <h2
                                        className="text-sm font-bold text-gray-900"
                                        data-oid="bhq2jlo"
                                    >
                                        Quick Navigation
                                    </h2>
                                    <p className="text-xs text-gray-500" data-oid="8:bempk">
                                        Vendor Tools
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                data-oid="3b8o0.h"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        sidebarCollapsed ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="ns8.k7j"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="dktkjzk"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-2 space-y-1" data-oid="7939hu9">
                        <div
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2"
                            data-oid="_v3ua4v"
                        >
                            {!sidebarCollapsed && 'MAIN MENU'}
                        </div>
                        {navigation.map((item) => (
                            <div key={item.name} className="relative group" data-oid="19wdzb-">
                                <button
                                    onClick={() => router.push(item.href)}
                                    className={`w-full flex items-center px-2 py-2 rounded-lg text-left transition-all duration-200 group ${
                                        item.current
                                            ? 'bg-cura-gradient text-white shadow-md'
                                            : 'text-gray-700 hover:bg-cura-primary/5 hover:text-cura-primary'
                                    }`}
                                    data-oid="g365-0v"
                                >
                                    <div
                                        className="flex items-center space-x-3 flex-1"
                                        data-oid="--q1xbx"
                                    >
                                        <div className="flex-shrink-0" data-oid="cn1k-gk">
                                            {item.icon}
                                        </div>
                                        {!sidebarCollapsed && (
                                            <span
                                                className="flex-1 font-medium text-sm"
                                                data-oid="j_ew4gz"
                                            >
                                                {item.name}
                                            </span>
                                        )}
                                    </div>
                                    {!sidebarCollapsed && item.badge && (
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                item.current
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-red-500 text-white'
                                            }`}
                                            data-oid="fqqe:j3"
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </button>

                                {/* Tooltip for collapsed state */}
                                {sidebarCollapsed && (
                                    <div
                                        className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                                        data-oid="jxuiv2o"
                                    >
                                        {item.name}
                                        {item.badge && (
                                            <span
                                                className="ml-2 px-1.5 py-0.5 bg-red-500 rounded-full text-xs"
                                                data-oid="ua0qfl5"
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
                {/* Fixed closing tag here - added > character */}

                {/* Main Content */}
                <div className="flex-1 min-w-0 overflow-hidden" data-oid="b9c941i">
                    <div className="p-4 w-full max-w-full overflow-x-hidden" data-oid="dd8tl69">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
