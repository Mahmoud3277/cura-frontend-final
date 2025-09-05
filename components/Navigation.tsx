'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav
            className="bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200 sticky top-0 z-50"
            data-oid="pxs7qy1"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="r6afy72">
                <div className="flex items-center justify-between h-16" data-oid="wz1oajo">
                    {/* Logo */}
                    <Logo size="md" variant="gradient" showIcon={true} data-oid="pd4qhj6" />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8" data-oid="-zrjkhi">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-cura-primary transition-colors"
                            data-oid="g_pd7--"
                        >
                            Home
                        </Link>
                        <Link
                            href="/shop"
                            className="text-gray-600 hover:text-cura-primary transition-colors"
                            data-oid="e_qg93k"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/store-locator"
                            className="text-gray-600 hover:text-cura-primary transition-colors"
                            data-oid="4it4bs6"
                        >
                            Store Locator
                        </Link>
                        <Link
                            href="/cart"
                            className="relative text-gray-600 hover:text-cura-primary transition-colors"
                            data-oid="5corywj"
                        >
                            Cart
                            <span
                                className="absolute -top-2 -right-2 bg-cura-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                data-oid="-o02uvl"
                            >
                                3
                            </span>
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4" data-oid="9y8s6-:">
                        <Link
                            href="/auth/login"
                            className="text-gray-600 hover:text-cura-primary px-3 py-2 rounded-lg transition-colors"
                            data-oid="8r0obpw"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/register"
                            className="bg-cura-gradient text-white px-4 py-2 rounded-lg hover:bg-cura-gradient-light transition-all duration-300"
                            data-oid="4ttv-o-"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-cura-primary transition-colors"
                        data-oid="_1t2x40"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="i7dwxn:"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                                data-oid="nci.y4e"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200" data-oid="mdbby.r">
                        <div className="flex flex-col space-y-2" data-oid="6dx4g7l">
                            <Link
                                href="/"
                                className="px-3 py-2 text-gray-600 hover:text-cura-primary transition-colors"
                                data-oid="c0:c8f3"
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className="px-3 py-2 text-gray-600 hover:text-cura-primary transition-colors"
                                data-oid="f:x49p4"
                            >
                                Shop
                            </Link>
                            <Link
                                href="/store-locator"
                                className="px-3 py-2 text-gray-600 hover:text-cura-primary transition-colors"
                                data-oid="uuz2l2_"
                            >
                                Store Locator
                            </Link>
                            <Link
                                href="/cart"
                                className="px-3 py-2 text-gray-600 hover:text-cura-primary transition-colors"
                                data-oid="1lkz2eo"
                            >
                                Cart
                            </Link>
                            <div className="border-t border-gray-200 pt-2 mt-2" data-oid="lcgrue_">
                                <Link
                                    href="/auth/login"
                                    className="block px-3 py-2 text-gray-600 hover:text-cura-primary transition-colors"
                                    data-oid="8_32sl4"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="block px-3 py-2 text-gray-600 hover:text-cura-primary transition-colors"
                                    data-oid="9.qb90b"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
