'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface FooterProps {
    className?: string;
}

export function Footer({ className = '' }: FooterProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    return (
        <footer
            className={`bg-gradient-to-r from-[#1F1F6F] via-[#14274E] to-[#394867] text-white py-16 mt-16 ${className}`}
            data-oid="jwrhiqr"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="umflv2-">
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                    data-oid="ww45710"
                >
                    {/* Brand Section */}
                    <div data-oid="70uqojn">
                        <h4 className="text-xl font-bold mb-4" data-oid="cl2h3g3">
                            CURA
                        </h4>
                    </div>

                    {/* Quick Links */}
                    <div data-oid="5y891dl">
                        <h5 className="font-semibold mb-4" data-oid="bttujw-">
                            {t('footer.quickLinks')}
                        </h5>
                        <ul className="space-y-2 text-gray-300" data-oid="y.74sh9">
                            <li data-oid="7mmh21q">
                                <Link
                                    href="/contact"
                                    className="hover:text-white transition-colors"
                                    data-oid="1hki5f7"
                                >
                                    {t('navigation.contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div data-oid="d1.vg6x">
                        <h5 className="font-semibold mb-4" data-oid=".00stma">
                            {t('footer.categories')}
                        </h5>
                        <ul className="space-y-2 text-gray-300" data-oid="eq_adfq">
                            <li data-oid="ifb1cae">
                                <Link
                                    href="/shop?category=prescription"
                                    className="hover:text-white transition-colors"
                                    data-oid="e3kfbvv"
                                >
                                    {t('footer.medicines')}
                                </Link>
                            </li>
                            <li data-oid="qoirvbu">
                                <Link
                                    href="/shop?category=supplements"
                                    className="hover:text-white transition-colors"
                                    data-oid="ngx.g_b"
                                >
                                    {t('categories.vitamins')}
                                </Link>
                            </li>
                            <li data-oid="w7s7t6v">
                                <Link
                                    href="/shop?category=skincare"
                                    className="hover:text-white transition-colors"
                                    data-oid="g7oza4n"
                                >
                                    {t('categories.skinCare')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Pharmacies */}
                    <div data-oid="ld:4791">
                        <h5 className="font-semibold mb-4" data-oid="6rs2h88">
                            {t('footer.forPharmacies')}
                        </h5>
                        <ul className="space-y-2 text-gray-300" data-oid="38jb1uu">
                            <li data-oid="f_o.g8a">
                                <Link
                                    href="/register-pharmacy"
                                    className="hover:text-white transition-colors"
                                    data-oid="y7xnguy"
                                >
                                    {t('footer.registerPharmacy')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div
                    className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300"
                    data-oid="csl5zj6"
                >
                    <p data-oid="0ulhd_b">{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
}
