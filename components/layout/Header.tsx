'use client';

import { useState, memo, useCallback, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { CitySelector } from '@/components/city/CitySelector';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAuth, getDashboardRoute } from '@/lib/contexts/AuthContext';
import { useCity } from '@/lib/contexts/CityContext';
import { useCart } from '@/lib/contexts/CartContext';

// Lazy load heavy components
const ComprehensiveSearch = dynamic(
    () =>
        import('@/components/search/ComprehensiveSearch').then((mod) => ({
            default: mod.ComprehensiveSearch,
        })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" data-oid="50yqr2e" />
        ),
    },
);

interface HeaderProps {
    className?: string;
    variant?: 'default' | 'dashboard';
}

const Header = memo(function Header({ className = '', variant = 'default' }: HeaderProps) {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { user, isAuthenticated, logout } = useAuth();
    const { totalItems, loadCartFromServer } = useCart();

    // Memoize callbacks to prevent unnecessary re-renders
    const toggleProfileDropdown = useCallback(() => setIsProfileDropdownOpen((prev) => !prev), []);
    const closeProfileDropdown = useCallback(() => setIsProfileDropdownOpen(false), []);
    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
    const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

    const handleLogout = useCallback(() => {
        logout();
        closeMobileMenu();
        closeProfileDropdown();
    }, [logout, closeMobileMenu, closeProfileDropdown]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target as Node)
            ) {
                closeProfileDropdown();
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen, closeProfileDropdown]);

    
    // Memoize user info to prevent re-renders
    const userInfo = useMemo(() => {
        if (!user) return null;
        return {
            initial: user.name.charAt(0).toUpperCase(),
            name: user.name,
            email: user.email,
            role: user.role,
        };

    }, [user]);

    // Memoize navigation items
    const customerNavItems = useMemo(
        () => [
            { href: '/customer/dashboard', label: t('myDashboard') },
            { href: '/cart', label: t('myCart') },
            { href: '/customer/orders', label: t('myOrders') },
        ],

        [t],
    );

const guestNavItems = useMemo(
    () => [
        { href: '/auth/login', label: t('login') },
    ],

    [t],
);

    return (
        <header
            className={`bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200 sticky top-0 z-50 transition-all duration-500 animate-slide-down ${className}`}
            data-oid="i1_zy:z"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="t_sit_a">
                <div className="flex items-center justify-between h-16" data-oid="r_4esm2">
                    {/* Logo */}
                    <div className="flex-shrink-0 group hover-scale" data-oid="xfb.9wl">
                        <Logo size="md" variant="gradient" data-oid="-5_pvp8" />
                    </div>

                    {/* Search Bar (only for default variant on desktop) */}
                    {variant === 'default' && (
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8" data-oid="2zglhpt">
                            <ComprehensiveSearch
                                variant="header"
                                placeholder={t('search.placeholder')}
                                className="w-full"
                                data-oid="rpba6.q"
                            />
                        </div>
                    )}

                    {/* Desktop Navigation Items */}
                    <nav
                        className="hidden md:flex items-center space-x-2 lg:space-x-4"
                        aria-label="Main navigation"
                        role="navigation"
                        data-oid="fmdjgbv"
                    >
                        {/* City Selector */}
                        <CitySelector variant="header" data-oid="krk.417" />

                        <LanguageSwitcher className="hidden lg:block" data-oid="3qf1qsz" />

                        {/* Cart Icon */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-600 hover:text-[#1F1F6F] transition-all duration-300 hover-scale group"
                            data-oid="c_q4__r"
                        >
                            <svg
                                className="w-6 h-6 group-hover:animate-wiggle"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="qr7.as2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                                    data-oid="c4z_j75"
                                />
                            </svg>
                            {totalItems > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 bg-[#1F1F6F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in animate-pulse-cura"
                                    data-oid="y_v98al"
                                >
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileDropdownRef} data-oid="1v632bx">
                            <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={toggleProfileDropdown}
                                data-oid="bsk60ck"
                            >
                                {isAuthenticated && userInfo ? (
                                    <div className="flex items-center space-x-2" data-oid="qz87daa">
                                        <div
                                            className="w-10 h-10 bg-cura-gradient rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                                            data-oid="gm42sdl"
                                        >
                                            <span
                                                className="text-white text-sm font-semibold"
                                                data-oid="15ldj.q"
                                            >
                                                {userInfo.initial}
                                            </span>
                                        </div>
                                        <div className="hidden lg:block" data-oid="g2kam8f">
                                            <p
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="jpu:7a3"
                                            >
                                                {userInfo.name}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="w-10 h-10 bg-cura-gradient rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        data-oid="59.qvrm"
                                    >
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="1nsr-fu"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                data-oid="pkze6ge"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {isProfileDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-slide-down"
                                    data-oid=".v8no6z"
                                >
                                    {isAuthenticated && userInfo ? (
                                        <>
                                            {userInfo.role === 'customer' ? (
                                                <>
                                                    <div
                                                        className="px-4 py-2 border-b border-gray-100"
                                                        data-oid="ojstxs_"
                                                    >
                                                        <p
                                                            className="text-sm font-medium text-gray-900 truncate"
                                                            data-oid="1_lhh9."
                                                        >
                                                            {userInfo.name}
                                                        </p>
                                                        <p
                                                            className="text-xs text-gray-500 truncate"
                                                            data-oid="6uwmxrm"
                                                        >
                                                            {userInfo.email}
                                                        </p>
                                                    </div>
                                                    {customerNavItems.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                                            onClick={closeProfileDropdown}
                                                            data-oid="m9olv4g"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </>
                                            ) : (
                                                <Link
                                                    href={getDashboardRoute(userInfo.role)}
                                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                                    onClick={closeProfileDropdown}
                                                    data-oid="a8fnkvi"
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                            <div
                                                className="border-t border-gray-100 mt-2 pt-2"
                                                data-oid="qp558cf"
                                            >
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
                                                    data-oid="4pm2_gw"
                                                >
                                                    {t('signOut')}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {guestNavItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-200 rounded-lg mx-2"
                                                    onClick={closeProfileDropdown}
                                                    data-oid=":24llak"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Desktop Login/Register Buttons - Only show when not authenticated */}
                        {!isAuthenticated && (
                            <div
                                className="hidden lg:flex items-center space-x-2"
                                data-oid="-2xw37x"
                            >
                                <Link
                                    href="/auth/login"
                                    className="text-gray-600 hover:text-[#1F1F6F] px-3 py-2 rounded-lg transition-colors"
                                    data-oid="uqgjieg"
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-cura-gradient text-white px-4 py-2 rounded-lg hover:bg-cura-gradient-light transition-all duration-300"
                                    data-oid="loj3gkf"
                                >
                                    {t('register')}
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2" data-oid="lgkq9mh">
                        {/* Mobile Cart Icon */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-600 hover:text-[#1F1F6F] transition-all duration-300"
                            data-oid="c7.rz27"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="_zedk3d"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                                    data-oid="nwl27zg"
                                />
                            </svg>
                            {totalItems > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 bg-[#1F1F6F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    data-oid="kanpgr8"
                                >
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 text-gray-600 hover:text-[#1F1F6F] transition-colors"
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                            data-oid="2sq6fw."
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="l7ges:s"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                        data-oid="ntv9u4g"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                        data-oid="dvz_c9i"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar (only for default variant) */}
                {variant === 'default' && (
                    <div className="lg:hidden py-3 border-t border-gray-100" data-oid="4vewu2i">
                        <ComprehensiveSearch
                            variant="header"
                            placeholder={t('search')}
                            className="w-full"
                            data-oid="kngj-w-"
                        />
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        className="md:hidden border-t border-gray-100 py-4 space-y-2"
                        data-oid="g2nuks1"
                    >
                        {/* City Selector */}
                        <div className="px-2 py-2" data-oid="byw.qg1">
                            <CitySelector variant="header" data-oid="6x3.p-u" />
                        </div>

                        {/* Language Switcher */}
                        <div className="px-2 py-2" data-oid="19zuov_">
                            <LanguageSwitcher data-oid="f9y-t3e" />
                        </div>

                        {/* Navigation Links */}
                        {isAuthenticated && user ? (
                            <>
                                <div
                                    className="px-4 py-2 border-b border-gray-100"
                                    data-oid="r7bed0r"
                                >
                                    <p
                                        className="text-sm font-medium text-gray-900 truncate"
                                        data-oid="wvs5ieo"
                                    >
                                        {user.name}
                                    </p>
                                </div>

                                {userInfo?.role === 'customer' ? (
                                    <>
                                        {customerNavItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={closeMobileMenu}
                                                data-oid="83c_h5w"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </>
                                ) : (
                                    <Link
                                        href={getDashboardRoute(userInfo?.role || 'customer')}
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={closeMobileMenu}
                                        data-oid="z:ip:ke"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    data-oid="8fz-ebd"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {guestNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={closeMobileMenu}
                                        data-oid="o:51dgk"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
});

export { Header };
