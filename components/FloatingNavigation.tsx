'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';

export function FloatingNavigation() {
    const pathname = usePathname();
    const { items } = useCart();
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

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
            name: 'Home',
            href: '/',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="e6g690e"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        data-oid="16n7qem"
                    />
                </svg>
            ),
        },
        {
            name: 'Products',
            href: '/shop',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="36w6bnp"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        data-oid="t6ze6gf"
                    />
                </svg>
            ),
        },
        {
            name: 'Prescription',
            href: '/prescription/upload',
            icon: (
                <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="z-kla2m"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        data-oid="quq4f0h"
                    />
                </svg>
            ),

            isCenter: true,
        },
        {
            name: 'Cart',
            href: '/cart',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="z7:pupf"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                        data-oid="u6y6587"
                    />
                </svg>
            ),

            badge: cartItemsCount > 0 ? cartItemsCount : undefined,
        },
        {
            name: 'Profile',
            href: isAuthenticated ? '/customer/mobile-dashboard' : '/auth/login',
            icon: (
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="djux2ws"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        data-oid="avneqai"
                    />
                </svg>
            ),
        },
    ];

    return (
        <nav
            className={`fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out z-50 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            data-oid="fvqc_k."
        >
            {/* Main Navigation Container */}
            <div className="relative" data-oid="832n8zk">
                {/* Background with glassmorphism effect */}
                <div
                    className="bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/30 px-4 sm:px-6 md:px-8 py-3 sm:py-4 relative overflow-hidden"
                    data-oid="xx.ry-."
                >
                    {/* Subtle gradient overlay */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-cura-primary/5 via-transparent to-cura-secondary/5 rounded-full"
                        data-oid="jpnj:6e"
                    ></div>

                    {/* Navigation Items */}
                    <div
                        className="flex items-center justify-between space-x-4 sm:space-x-6 md:space-x-8 relative z-10"
                        data-oid="piz-y5q"
                    >
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href;

                            if (item.isCenter) {
                                return (
                                    <div key={item.name} className="relative" data-oid="6yhf_02">
                                        <Link
                                            href={item.href}
                                            className="block hover:scale-110 transition-all duration-300"
                                            data-oid="j4ms6oc"
                                        >
                                            <div
                                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-cura-primary to-cura-secondary rounded-full flex items-center justify-center shadow-xl border-3 sm:border-4 border-white hover:shadow-2xl transition-all duration-300"
                                                data-oid=":32n5.y"
                                            >
                                                {item.icon}
                                            </div>
                                        </Link>
                                        {/* Center item label - hidden on mobile */}
                                        <div
                                            className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap hidden sm:block"
                                            data-oid="19rbha3"
                                        >
                                            <span
                                                className="text-xs font-medium text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
                                                data-oid="rspwij6"
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
                                    className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-2xl transition-all duration-300 group ${
                                        isActive
                                            ? 'text-cura-primary bg-cura-primary/10 scale-105'
                                            : 'text-gray-500 hover:text-cura-primary hover:bg-cura-primary/5 hover:scale-105'
                                    }`}
                                    data-oid="xma-55x"
                                >
                                    <div className="relative" data-oid="4wp16p7">
                                        {item.icon}
                                        {item.badge && (
                                            <span
                                                className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-gradient-to-r from-cura-primary to-cura-secondary text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg animate-pulse"
                                                data-oid="_ey2ali"
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs font-medium transition-colors hidden sm:block ${
                                            isActive
                                                ? 'text-cura-primary'
                                                : 'text-gray-500 group-hover:text-cura-primary'
                                        }`}
                                        data-oid="jpp9-e2"
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Floating shadow effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-cura-primary/20 to-cura-secondary/20 rounded-full blur-xl scale-110 -z-10 opacity-30"
                    data-oid=".weq3tt"
                ></div>
            </div>
        </nav>
    );
}
