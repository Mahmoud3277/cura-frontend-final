'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

export function CustomerDashboard() {
    const { user } = useAuth();
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');
    const router = useRouter();

    const handleEditProfile = () => {
        router.push('/customer/settings');
    };

    const handleSettings = () => {
        router.push('/customer/profile');
    };

    const handleEditPersonalInfo = () => {
        router.push('/customer/profile');
    };

    return (
        <div className="w-full space-y-4 md:space-y-6 lg:space-y-8" data-oid="0:j1uqz">
            {/* Profile Header Section */}
            <div
                className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                data-oid="y-bfrhm"
            >
                {/* Cover Background - Smaller on mobile */}
                <div
                    className="h-20 md:h-32 bg-gradient-to-r from-[#1F1F6F] via-[#14274E] to-[#394867] relative"
                    data-oid="dkd-kir"
                >
                    <div className="absolute inset-0 bg-black/10" data-oid="aq9q2j1"></div>
                </div>

                {/* Profile Content - More compact on mobile */}
                <div
                    className="px-3 md:px-4 lg:px-8 py-4 md:py-6 lg:py-8 relative"
                    data-oid="yg:ga0a"
                >
                    {/* Profile Picture and Info */}
                    <div
                        className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 md:space-x-6"
                        data-oid="zd3kys-"
                    >
                        <div className="relative mb-3 sm:mb-0 -mt-12 md:-mt-20" data-oid="0-ohej8">
                            <div
                                className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold border-3 md:border-4 border-white shadow-lg"
                                data-oid="j6r8asy"
                            >
                                {user?.name?.charAt(0) || 'J'}
                            </div>
                            <div
                                className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white"
                                data-oid="us:v91t"
                            ></div>
                        </div>

                        {/* Profile Info - More compact on mobile */}
                        <div className="flex-1" data-oid="niozgh3">
                            <h1
                                className="text-xl md:text-2xl font-bold text-gray-900 mb-1"
                                data-oid="nqy2n.."
                            >
                                {user?.name || 'John Customer'}
                            </h1>
                            <p
                                className="text-sm md:text-base text-gray-600 mb-2"
                                data-oid="a4zz_xg"
                            >
                                {user?.email || 'customer@cura.com'}
                            </p>
                            <div
                                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs md:text-sm text-gray-500 space-y-1 sm:space-y-0"
                                data-oid=".lq0o:9"
                            >
                                <span className="flex items-center" data-oid="8x:0exc">
                                    <svg
                                        className="w-3 h-3 md:w-4 md:h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid=":w:.t6n"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                            data-oid="rj9pp-9"
                                        />
                                    </svg>
                                    Ismailia, Egypt
                                </span>
                                <span className="flex items-center" data-oid="ybo.:tj">
                                    <svg
                                        className="w-3 h-3 md:w-4 md:h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="myymvde"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                            data-oid=".5d.t0p"
                                        />
                                    </svg>
                                    {tCustomer('personalInfo.memberSince', { date: 'Jan 2024' })}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons - Smaller on mobile */}
                        <div
                            className="flex space-x-2 md:space-x-3 mt-3 sm:mt-0"
                            data-oid="-sq__pg"
                        >
                            <button
                                onClick={handleEditProfile}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors text-xs md:text-sm font-medium"
                                data-oid="3:6f851"
                            >
                                {tCustomer('personalInfo.editProfile')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information - More compact on mobile */}
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 lg:p-6"
                data-oid="cb-s139"
            >
                <div className="flex items-center justify-between mb-4 md:mb-6" data-oid="_5ognaz">
                    <h2
                        className="text-base md:text-lg font-semibold text-gray-900"
                        data-oid="saql26:"
                    >
                        {tCustomer('personalInfo.title')}
                    </h2>
                </div>

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6"
                    data-oid="3v3:fe3"
                >
                    <div data-oid="cccocq7">
                        <label
                            className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                            data-oid="rn7zq0:"
                        >
                            {tCustomer('personalInfo.lastName')}
                        </label>
                        <div
                            className="text-sm md:text-base text-gray-900 bg-gray-50 px-2 md:px-3 py-1.5 md:py-2 rounded-lg"
                            data-oid="sdubd34"
                        >
                            {user?.name}
                        </div>
                    </div>
                    <div data-oid="nx_aioc">
                        <label
                            className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                            data-oid="3-ulzhi"
                        >
                            {tCustomer('personalInfo.email')}
                        </label>
                        <div
                            className="text-sm md:text-base text-gray-900 bg-gray-50 px-2 md:px-3 py-1.5 md:py-2 rounded-lg break-all"
                            data-oid="-2ih3ko"
                        >
                            {user?.email}
                        </div>
                    </div>
                    <div data-oid="vjd1:h0">
                        <label
                            className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                            data-oid="-xxz5on"
                        >
                            {tCustomer('personalInfo.phone')}
                        </label>
                        <div
                            className="text-sm md:text-base text-gray-500 bg-gray-50 px-2 md:px-3 py-1.5 md:py-2 rounded-lg"
                            data-oid="oheu_zo"
                        >
                            {user?.phone}
                        </div>
                    </div>
                    <div className="sm:col-span-2" data-oid="28ryp.m">
                        <label
                            className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                            data-oid="qw_t220"
                        >
                            {tCustomer('personalInfo.address')}
                        </label>
                        <div
                            className="text-sm md:text-base text-gray-900 bg-gray-50 px-2 md:px-3 py-1.5 md:py-2 rounded-lg"
                            data-oid="gko_3q3"
                        >
                            {user?.addresses && user.addresses.length > 0
                                ? `${user.addresses[0].street || ''}, ${user.addresses[0].city || ''}, ${user.addresses[0].governorate || ''}, Egypt`.replace(/^,?\s*,?\s*,?\s*,?\s*/, '').replace(/,\s*,/g, ', ')
                                : 'No address provided'
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity - More compact on mobile */}
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 lg:p-6"
                data-oid="5p8ome1"
            >
                <h2
                    className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6"
                    data-oid="2nmsq0q"
                >
                    Recent Activity
                </h2>

                <div className="space-y-3 md:space-y-4" data-oid="omb_hjo">
                    <div
                        className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-blue-50 rounded-lg"
                        data-oid="n8s4amn"
                    >
                        <div
                            className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                            data-oid="5ner.dl"
                        >
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="_e.i-dd"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z"
                                    clipRule="evenodd"
                                    data-oid="46db9wb"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0" data-oid="p6tuza_">
                            <p
                                className="text-sm md:text-base text-gray-900 font-medium"
                                data-oid="n5vwixe"
                            >
                                Order ORD-001 delivered
                            </p>
                            <p className="text-xs md:text-sm text-gray-600" data-oid="8t9-n_i">
                                Paracetamol, Vitamin D - $29.99
                            </p>
                            <p className="text-xs text-gray-500" data-oid="ut:le17">
                                2 hours ago
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
