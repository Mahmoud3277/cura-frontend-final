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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8"
                    data-oid="ww45710"
                >
                    {/* Brand Section */}
                    <div data-oid="70uqojn">
                        <h4 className="text-xl font-bold mb-4" data-oid="cl2h3g3">
                            CURA
                        </h4>
                    </div>



                    {/* Categories */}
                    <div data-oid="d1.vg6x">
                        <h5 className="font-semibold mb-4" data-oid=".00stma">
                            {t('footer.categories')}
                        </h5>
                        <ul className="space-y-2 text-gray-300" data-oid="eq_adfq">
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
