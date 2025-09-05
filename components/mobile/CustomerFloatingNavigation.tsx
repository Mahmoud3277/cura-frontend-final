'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';

export function CustomerFloatingNavigation() {
    const pathname = usePathname();
    const { items } = useCart();
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);

    const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    // Scrolling down
                    setIsVisible(false);
                } else {
                    // Scrolling up
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    const navItems = [
        {
            name: 'Orders',
            href: '/customer/orders',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="orders-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        data-oid="orders-path"
                    />
                </svg>
            ),
        },
        {
            name: 'Prescriptions',
            href: '/customer/prescriptions',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="prescriptions-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        data-oid="prescriptions-path"
                    />
                </svg>
            ),
        },
        {
            name: 'Dashboard',
            href: '/customer/mobile-dashboard',
            icon: (
                <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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

            isCenter: true,
        },
        {
            name: 'Subscriptions',
            href: '/customer/subscriptions',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="subscriptions-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        data-oid="subscriptions-path"
                    />
                </svg>
            ),
        },
        {
            name: 'Wallet',
            href: '/customer/wallet',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="wallet-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        data-oid="wallet-path"
                    />
                </svg>
            ),
        },
    ];

    // Secondary navigation items that will be shown in an expandable menu or modal
    const secondaryNavItems = [
        {
            name: 'Settings',
            href: '/customer/settings',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="settings-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        data-oid="settings-path-1"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        data-oid="settings-path-2"
                    />
                </svg>
            ),
        },
        {
            name: 'Support',
            href: '/customer/support',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="support-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        data-oid="support-path"
                    />
                </svg>
            ),
        },
    ];

    return (
        <>
            <nav
                className={`fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out z-50 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                data-oid="customer-floating-nav"
            >
                {/* Main Navigation Container */}
                <div className="relative" data-oid="nav-container">
                    {/* Background with glassmorphism effect */}
                    <div
                        className="bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/30 px-3 sm:px-4 md:px-6 py-3 sm:py-4 relative overflow-hidden"
                        data-oid="nav-background"
                    >
                        {/* Subtle gradient overlay */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-cura-primary/5 via-transparent to-cura-secondary/5 rounded-full"
                            data-oid="nav-gradient"
                        ></div>

                        {/* Navigation Items */}
                        <div
                            className="flex items-center justify-between space-x-2 sm:space-x-3 md:space-x-4 relative z-10"
                            data-oid="nav-items"
                        >
                            {navItems.map((item, index) => {
                                const isActive = pathname === item.href;

                                if (item.isCenter) {
                                    return (
                                        <div
                                            key={item.name}
                                            className="relative"
                                            data-oid="center-item"
                                        >
                                            <Link
                                                href={item.href}
                                                className="block hover:scale-110 transition-all duration-300"
                                                data-oid="center-link"
                                            >
                                                <div
                                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-cura-primary to-cura-secondary rounded-full flex items-center justify-center shadow-xl border-3 sm:border-4 border-white hover:shadow-2xl transition-all duration-300"
                                                    data-oid="center-button"
                                                >
                                                    {item.icon}
                                                </div>
                                            </Link>
                                            {/* Center item label - hidden on mobile */}
                                            <div
                                                className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden sm:block"
                                                data-oid="center-label"
                                            >
                                                <span
                                                    className="text-xs font-medium text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
                                                    data-oid="center-text"
                                                >
                                                    {item.name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex flex-col items-center space-y-1 py-2 px-1.5 sm:px-2 rounded-2xl transition-all duration-300 group ${
                                            isActive
                                                ? 'text-cura-primary bg-cura-primary/10 scale-105'
                                                : 'text-gray-500 hover:text-cura-primary hover:bg-cura-primary/5 hover:scale-105'
                                        }`}
                                        data-oid="nav-item"
                                    >
                                        <div className="relative" data-oid="nav-icon-container">
                                            {item.icon}
                                            {item.name === 'Orders' && cartItemsCount > 0 && (
                                                <span
                                                    className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-gradient-to-r from-cura-primary to-cura-secondary text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg animate-pulse"
                                                    data-oid="cart-badge"
                                                >
                                                    {cartItemsCount}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-medium transition-colors hidden sm:block ${
                                                isActive
                                                    ? 'text-cura-primary'
                                                    : 'text-gray-500 group-hover:text-cura-primary'
                                            }`}
                                            data-oid="nav-label"
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}

                            {/* Menu Button for Secondary Items */}
                            <button
                                onClick={() => setShowSecondaryMenu(true)}
                                className="flex flex-col items-center space-y-1 py-2 px-1.5 sm:px-2 rounded-2xl transition-all duration-300 group text-gray-500 hover:text-cura-primary hover:bg-cura-primary/5 hover:scale-105"
                                data-oid="menu-button"
                            >
                                <div className="relative" data-oid="menu-icon-container">
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="menu-icon"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                            data-oid="menu-path"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="text-xs font-medium transition-colors hidden sm:block text-gray-500 group-hover:text-cura-primary"
                                    data-oid="menu-label"
                                >
                                    More
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Floating shadow effect */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-cura-primary/20 to-cura-secondary/20 rounded-full blur-xl scale-110 -z-10 opacity-30"
                        data-oid="nav-shadow"
                    ></div>
                </div>
            </nav>

            {/* Secondary Menu Modal */}
            {showSecondaryMenu && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center"
                    onClick={() => setShowSecondaryMenu(false)}
                    data-oid="secondary-menu-overlay"
                >
                    <div
                        className="bg-white rounded-t-3xl w-full max-w-md mx-4 mb-4 p-6 shadow-2xl transform transition-all duration-300 ease-out"
                        onClick={(e) => e.stopPropagation()}
                        data-oid="secondary-menu-content"
                    >
                        {/* Menu Header */}
                        <div
                            className="flex items-center justify-between mb-6"
                            data-oid="menu-header"
                        >
                            <h3
                                className="text-lg font-semibold text-gray-900"
                                data-oid="menu-title"
                            >
                                More Options
                            </h3>
                            <button
                                onClick={() => setShowSecondaryMenu(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                data-oid="menu-close"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="close-icon"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                        data-oid="close-path"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Secondary Menu Items */}
                        <div className="space-y-2" data-oid="secondary-menu-items">
                            {secondaryNavItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setShowSecondaryMenu(false)}
                                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? 'bg-cura-primary text-white shadow-lg'
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                        data-oid="secondary-menu-item"
                                    >
                                        <div
                                            className={`flex-shrink-0 ${
                                                isActive ? 'text-white' : 'text-cura-primary'
                                            }`}
                                            data-oid="secondary-item-icon"
                                        >
                                            {item.icon}
                                        </div>
                                        <span
                                            className="font-medium"
                                            data-oid="secondary-item-name"
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
