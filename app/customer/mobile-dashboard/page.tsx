'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useEffect, useState } from 'react';

export default function MobileCustomerDashboard() {
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSignOut = () => {
        if (logout) {
            logout();
        }
    };

    // Show loading state until component is mounted on client
    if (!mounted) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
                data-oid="8qnv634"
            >
                {/* Header with Account Info */}
                <div
                    className="bg-gradient-to-br from-slate-50 via-white to-gray-50 text-gray-800 relative overflow-hidden border-b border-gray-100"
                    data-oid="6o9yyld"
                >
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-5" data-oid="37c1c6r">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-cura-primary/10 via-transparent to-cura-secondary/10"
                            data-oid="00n__tt"
                        ></div>
                        <div
                            className="absolute top-0 right-0 w-32 h-32 bg-cura-primary/5 rounded-full -translate-y-16 translate-x-16"
                            data-oid="1urgjdn"
                        ></div>
                        <div
                            className="absolute bottom-0 left-0 w-24 h-24 bg-cura-secondary/5 rounded-full translate-y-12 -translate-x-12"
                            data-oid="4k_fiy0"
                        ></div>
                    </div>

                    <div className="relative px-6 py-6" data-oid="edbvv1-">
                        {/* Top Row - Language Switcher */}
                        <div className="flex justify-end mb-6" data-oid="e146q:e">
                            <div
                                className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"
                                data-oid="zki7_or"
                            ></div>
                        </div>

                        {/* Account Info */}
                        <div className="flex items-center space-x-4 mb-4" data-oid="sfj_k3h">
                            <div
                                className="w-16 h-16 bg-gray-200 rounded-full animate-pulse ring-4 ring-white shadow-lg"
                                data-oid="e8112_q"
                            ></div>
                            <div className="flex-1" data-oid="mjuf34w">
                                <div
                                    className="h-5 bg-gray-200 rounded mb-2 animate-pulse"
                                    data-oid="1j6h_y-"
                                ></div>
                                <div
                                    className="h-4 bg-gray-200 rounded w-40 mb-2 animate-pulse"
                                    data-oid="h-3e7uz"
                                ></div>
                                <div
                                    className="h-4 bg-gray-200 rounded w-32 animate-pulse"
                                    data-oid="m4dh-vt"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading skeleton for menu */}
                <div className="px-6 space-y-8 mt-8" data-oid="o6jh95r">
                    <div className="space-y-3" data-oid="2q1gqi9">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-gray-200 rounded-xl animate-pulse"
                                data-oid="d42ok7h"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white" data-oid="-clqbjf">
            {/* Header with Account Info */}
            <div
                className="bg-gradient-to-br from-slate-50 via-white to-gray-50 text-gray-800 relative overflow-hidden border-b border-gray-100"
                data-oid="0sjaoty"
            >
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-5" data-oid="o1:6jua">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-cura-primary/10 via-transparent to-cura-secondary/10"
                        data-oid=".rlm9f."
                    ></div>
                    <div
                        className="absolute top-0 right-0 w-32 h-32 bg-cura-primary/5 rounded-full -translate-y-16 translate-x-16"
                        data-oid="t91znmq"
                    ></div>
                    <div
                        className="absolute bottom-0 left-0 w-24 h-24 bg-cura-secondary/5 rounded-full translate-y-12 -translate-x-12"
                        data-oid="9h-9cq6"
                    ></div>
                </div>

                <div className="relative px-6 py-6" data-oid="23urfki">
                    {/* Top Row - Language Switcher */}
                    <div className="flex justify-end mb-6" data-oid="n4bl4.y">
                        <LanguageSwitcher className="z-10" data-oid="ap-iw03" />
                    </div>

                    {/* Account Info */}
                    <div className="flex items-center space-x-4 mb-4" data-oid="buv70mq">
                        <div
                            className="w-16 h-16 bg-gradient-to-br from-cura-primary to-cura-secondary rounded-full flex items-center justify-center shadow-lg ring-4 ring-white"
                            data-oid="9l-ou1k"
                        >
                            <span className="text-xl font-bold text-white" data-oid="03wue0f">
                                {user?.name?.charAt(0)?.toUpperCase() || 'J'}
                            </span>
                        </div>
                        <div className="flex-1" data-oid="xn_z8bp">
                            <h1 className="text-xl font-bold text-gray-900 mb-1" data-oid="c9irv:m">
                                {user?.name || 'John Customer'}
                            </h1>
                            <p className="text-gray-600 text-sm mb-2" data-oid="rs6v4et">
                                {user?.email || 'customer@cura.com'}
                            </p>
                            <Link
                                href="/customer/profile"
                                className="text-cura-primary hover:text-cura-secondary text-sm font-medium inline-flex items-center transition-colors"
                                data-oid="k6c030c"
                            >
                                View profile settings
                                <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid=":.yapv2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                        data-oid="25xbz54"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Content */}
            <div className="px-6 space-y-8" data-oid="t0gw99j">
                {/* GENERAL Section */}
                <div data-oid="s3.soz0">
                    <h2
                        className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide"
                        data-oid="iljss.g"
                    >
                        General
                    </h2>
                    <div className="space-y-3" data-oid="7-z1wmt">
                        <Link
                            href="/customer/profile"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-cura-primary/20 transition-all duration-200 group"
                            data-oid="s4et_q2"
                        >
                            <div className="flex items-center space-x-4" data-oid="v0jrujr">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10 rounded-xl flex items-center justify-center text-cura-primary group-hover:from-cura-primary/20 group-hover:to-cura-secondary/20 transition-all duration-200"
                                    data-oid=":8rjxs6"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="5htky.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            data-oid="p.vz3a5"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="font-medium text-gray-900 group-hover:text-cura-primary transition-colors"
                                    data-oid="_n:yufd"
                                >
                                    Profile
                                </span>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-cura-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="gqh-1z7"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                    data-oid="qhe5ukz"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/customer/orders"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-cura-primary/20 transition-all duration-200 group"
                            data-oid=".ugxj8g"
                        >
                            <div className="flex items-center space-x-4" data-oid="8rzsfol">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10 rounded-xl flex items-center justify-center text-cura-primary group-hover:from-cura-primary/20 group-hover:to-cura-secondary/20 transition-all duration-200"
                                    data-oid="fjqf2qt"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="2gj1xg2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            data-oid="1s5cjk9"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="font-medium text-gray-900 group-hover:text-cura-primary transition-colors"
                                    data-oid="ux4c0n1"
                                >
                                    Orders
                                </span>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-cura-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="vgkyo8l"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                    data-oid="17uzyro"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/customer/prescriptions"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-cura-primary/20 transition-all duration-200 group"
                            data-oid="vn_v2:m"
                        >
                            <div className="flex items-center space-x-4" data-oid="e6ef9da">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10 rounded-xl flex items-center justify-center text-cura-primary group-hover:from-cura-primary/20 group-hover:to-cura-secondary/20 transition-all duration-200"
                                    data-oid="bcv8ucx"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="cee3vo8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            data-oid="0t6o3o-"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="font-medium text-gray-900 group-hover:text-cura-primary transition-colors"
                                    data-oid="re_1k5s"
                                >
                                    Prescriptions
                                </span>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-cura-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="qh15xzi"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                    data-oid="mvwbizt"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/customer/subscriptions"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-cura-primary/20 transition-all duration-200 group"
                            data-oid="0beavti"
                        >
                            <div className="flex items-center space-x-4" data-oid="s1qx3u.">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10 rounded-xl flex items-center justify-center text-cura-primary group-hover:from-cura-primary/20 group-hover:to-cura-secondary/20 transition-all duration-200"
                                    data-oid="epf3o85"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="xly5bxm"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            data-oid="8b8:_7y"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="font-medium text-gray-900 group-hover:text-cura-primary transition-colors"
                                    data-oid="7dfe0fl"
                                >
                                    Subscriptions
                                </span>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-cura-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="6xlf:4m"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                    data-oid="diy-zvi"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/customer/wallet"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-cura-primary/20 transition-all duration-200 group"
                            data-oid="bt_t1x9"
                        >
                            <div className="flex items-center space-x-4" data-oid="l6tzc92">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10 rounded-xl flex items-center justify-center text-cura-primary group-hover:from-cura-primary/20 group-hover:to-cura-secondary/20 transition-all duration-200"
                                    data-oid="xmwfv6_"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="prxwl4:"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                            data-oid="52arydw"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="font-medium text-gray-900 group-hover:text-cura-primary transition-colors"
                                    data-oid="yqthlw7"
                                >
                                    Wallet
                                </span>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-cura-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="_vc:5os"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                    data-oid="y-zfmxg"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* ACCOUNT Section */}
                <div data-oid="5v.ls8k">
                    <h2
                        className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide"
                        data-oid="9389rkq"
                    >
                        Account
                    </h2>
                    <div className="space-y-3" data-oid="szw-0wj">
                        <Link
                            href="/customer/settings"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-cura-primary/20 transition-all duration-200 group"
                            data-oid="xtfupcv"
                        >
                            <div className="flex items-center space-x-4" data-oid="pm9aeua">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10 rounded-xl flex items-center justify-center text-cura-primary group-hover:from-cura-primary/20 group-hover:to-cura-secondary/20 transition-all duration-200"
                                    data-oid="l5kc:ee"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="1iy6udf"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            data-oid="-t13lqr"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            data-oid="ivky7w."
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="font-medium text-gray-900 group-hover:text-cura-primary transition-colors"
                                    data-oid="4.sa:24"
                                >
                                    Settings
                                </span>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-cura-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="_kwz48z"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                    data-oid="vjc1a1-"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* OTHER Section */}
                <div data-oid="7bxubwl">
                    <h2
                        className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wide"
                        data-oid="bd48cpf"
                    >
                        Other
                    </h2>
                    <div className="space-y-3" data-oid="mg1mh-r">
                        <Link
                            href="/customer/support"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-cura-primary/20 transition-all duration-200 group"
                            data-oid="zca.xm2"
                        >
                            <div className="flex items-center space-x-4" data-oid="ybzp:tf">
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10 rounded-xl flex items-center justify-center text-cura-primary group-hover:from-cura-primary/20 group-hover:to-cura-secondary/20 transition-all duration-200"
                                    data-oid="b4i352a"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="ez7ezml"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="exofg0n"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className="font-medium text-gray-900 group-hover:text-cura-primary transition-colors"
                                    data-oid="evwehea"
                                >
                                    Support
                                </span>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-cura-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="r8mkasc"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                    data-oid="7ae019g"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-4 border-t border-gray-200" data-oid="-_4kf-u">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center space-x-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 font-medium"
                        data-oid="l2dmg99"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="3vlotgz"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                data-oid="18gwdps"
                            />
                        </svg>
                        <span data-oid="kpkpyzq">Sign out</span>
                    </button>
                </div>
            </div>

            {/* Bottom Spacing */}
            <div className="h-8" data-oid="sb.1nzj"></div>
        </div>
    );
}
