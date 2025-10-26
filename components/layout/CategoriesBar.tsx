'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface Category {
    nameKey: string;
    icon: string;
    href: string;
}

const categories: Category[] = [
    { nameKey: 'hairCare', icon: '', href: '/haircare' },
    { nameKey: 'skinCare', icon: '', href: '/skincare' },
    { nameKey: 'dailyEssentials', icon: '', href: '/daily-essentials' },
    { nameKey: 'babyEssentials', icon: '', href: '/baby-essentials' },
    { nameKey: 'vitamins', icon: '', href: '/vitamins' },
    { nameKey: 'sexualWellness', icon: '', href: '/sexual-wellness' },
];

interface CategoriesBarProps {
    className?: string;
}

const CategoriesBar = memo(function CategoriesBar({ className = '' }: CategoriesBarProps) {
    const { t } = useTranslation();

    return (
        <div
            className={`bg-white border-b border-gray-200 shadow-md ${className}`}
            data-oid="ieyqahn"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="mhbgt2a">
                {/* Desktop Categories */}
                <div className="hidden lg:flex items-center justify-center py-3" data-oid="0k.ly0t">
                    {/* Categories List */}
                    <div
                        className="flex items-center justify-center space-x-2 overflow-x-auto scrollbar-hide"
                        data-oid="8qz.436"
                    >
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={category.href}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#1F1F6F]/5 hover:to-[#14274E]/5 transition-all duration-300 group whitespace-nowrap border border-transparent hover:border-[#1F1F6F]/10"
                                data-oid="vxt2i2z"
                            >
                                <span
                                    className="text-base group-hover:scale-110 transition-transform duration-300"
                                    data-oid="py9oe1u"
                                >
                                    {category.icon}
                                </span>
                                <span
                                    className="text-sm font-medium text-gray-700 group-hover:text-[#1F1F6F] transition-colors duration-300"
                                    data-oid="-g:t1c0"
                                >
                                    {t(`categories.${category.nameKey}`)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mobile Categories */}
                <div className="lg:hidden py-4" data-oid="hs0-986">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="ep38tcn">
                        {t('categories.title')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3" data-oid=".g-um_f">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={category.href}
                                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#1F1F6F]/5 hover:to-[#14274E]/5 transition-all duration-300 border border-gray-100 hover:border-[#1F1F6F]/20"
                                data-oid="1cr5vji"
                            >
                                <span className="text-lg" data-oid="fo8elo8">
                                    {category.icon}
                                </span>
                                <span
                                    className="text-sm font-medium text-gray-700"
                                    data-oid="-p-u2dr"
                                >
                                    {t(`categories.${category.nameKey}`)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export { CategoriesBar };
