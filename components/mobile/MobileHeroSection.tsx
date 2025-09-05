'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface MobileHeroSectionProps {
    onUploadPrescription?: () => void;
}

export function MobileHeroSection({ onUploadPrescription }: MobileHeroSectionProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { t: tHomepage } = useTranslation(locale, 'homepage');

    return (
        <div
            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] px-4 py-8 text-white relative overflow-hidden"
            data-oid="nc5p_qn"
        >
            {/* Background Pattern */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"
                data-oid="e1xsx2q"
            ></div>
            <div
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
                data-oid="65-crfz"
            ></div>
            <div
                className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"
                data-oid="-g8-lrs"
            ></div>

            <div className="relative text-center" data-oid="um.8i_y">
                {/* Badge */}
                <div
                    className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4"
                    data-oid="jz7.c2s"
                >
                    <span className="text-lg" data-oid="_z52_4:">
                        🏥
                    </span>
                    <span data-oid="zee3mx4">Egypt{"'"}s Leading Online Pharmacy</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold mb-2 leading-tight" data-oid="rti1anj">
                    Your Health, Our{' '}
                    <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200"
                        data-oid="f79p4.a"
                    >
                        Priority
                    </span>
                </h1>

                {/* Description */}
                <p
                    className="text-blue-100 mb-6 text-sm leading-relaxed max-w-sm mx-auto"
                    data-oid="8eku:jb"
                >
                    Get your medicines delivered to your doorstep. Licensed, trusted, and quality
                    guaranteed.
                </p>

                {/* Features */}
                <div
                    className="flex justify-center space-x-6 mb-6 text-xs text-blue-100"
                    data-oid="9z0tmzm"
                >
                    <div className="flex items-center space-x-1" data-oid="eo25aup">
                        <div className="w-2 h-2 bg-green-400 rounded-full" data-oid="mc13q7g"></div>
                        <span data-oid="sd8h8:t">Licensed & Trusted</span>
                    </div>
                    <div className="flex items-center space-x-1" data-oid="_zn__v0">
                        <div className="w-2 h-2 bg-green-400 rounded-full" data-oid="06ftwnw"></div>
                        <span data-oid="g6v1ehb">Free Delivery</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3" data-oid="x06slop">
                    <button
                        onClick={onUploadPrescription}
                        className="bg-white text-[#1F1F6F] px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-all duration-300 shadow-md"
                        data-oid="jxpnqva"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="nce.x9i"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                data-oid="y5g10qy"
                            />
                        </svg>
                        <span data-oid=".k.wv--">Upload Prescription</span>
                    </button>
                    <Link
                        href="/shop"
                        className="border border-white text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-white hover:text-[#1F1F6F] transition-all duration-300"
                        data-oid="s6rl3pn"
                    >
                        Browse Products
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-white/20" data-oid="yr3bmtm">
                    <div
                        className="flex items-center justify-center space-x-4 text-xs text-blue-200"
                        data-oid="6ecype2"
                    >
                        <div className="flex items-center space-x-1" data-oid="0xa_kfd">
                            <span data-oid="-.3-zgw">⭐</span>
                            <span data-oid="5mb0p8a">4.8 Rating</span>
                        </div>
                        <div className="flex items-center space-x-1" data-oid="c8bbhgf">
                            <span data-oid="koyf804">🚚</span>
                            <span data-oid=":e17286">30min Delivery</span>
                        </div>
                        <div className="flex items-center space-x-1" data-oid="vbv._y6">
                            <span data-oid="uit_a2b">💊</span>
                            <span data-oid="gpzahqr">10k+ Products</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
