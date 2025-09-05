'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface Category {
    name: string;
    icon: string;
    href: string;
    color?: string;
}

interface MobileCategoriesGridProps {
    categories?: Category[];
    className?: string;
}

const defaultCategories: Category[] = [
    {
        name: 'Medications',
        icon: '💊',
        href: '/shop?category=medications',
        color: 'from-blue-50 to-blue-100',
    },
    {
        name: 'Hair Care',
        icon: '💇‍♀️',
        href: '/shop?category=hair-care',
        color: 'from-pink-50 to-pink-100',
    },
    {
        name: 'Skin Care',
        icon: '🧴',
        href: '/shop?category=skin-care',
        color: 'from-green-50 to-green-100',
    },
    {
        name: 'Daily Essentials',
        icon: '🧼',
        href: '/shop?category=daily-essentials',
        color: 'from-yellow-50 to-yellow-100',
    },
    {
        name: 'Mom & Baby',
        icon: '👶',
        href: '/shop?category=mom-baby',
        color: 'from-purple-50 to-purple-100',
    },
    {
        name: 'Makeup',
        icon: '💄',
        href: '/shop?category=makeup',
        color: 'from-red-50 to-red-100',
    },
    {
        name: 'Health Devices',
        icon: '🩺',
        href: '/shop?category=health-devices',
        color: 'from-indigo-50 to-indigo-100',
    },
    {
        name: 'Vitamins',
        icon: '💊',
        href: '/shop?category=vitamins',
        color: 'from-orange-50 to-orange-100',
    },
];

export function MobileCategoriesGrid({
    categories = defaultCategories,
    className = '',
}: MobileCategoriesGridProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    return (
        <div className={`px-4 py-6 ${className}`} data-oid="ivz3eim">
            <div className="flex items-center justify-between mb-4" data-oid="t.7lxn4">
                <h2 className="text-lg font-bold text-gray-900" data-oid="h.5wf68">
                    {t('categories')}
                </h2>
                <Link
                    href="/shop"
                    className="text-sm text-[#1F1F6F] font-medium hover:text-[#14274E] transition-colors"
                    data-oid="upz4mlr"
                >
                    {t('viewAll')}
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-3" data-oid="e_7e4zc">
                {categories.map((category, index) => (
                    <Link key={index} href={category.href} className="group" data-oid="_iq1k_t">
                        <div className="flex flex-col items-center space-y-2" data-oid="yc54o5:">
                            <div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color || 'from-gray-50 to-gray-100'} flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm`}
                                data-oid="8gqsq74"
                            >
                                <span className="text-2xl" data-oid="cq.m2qc">
                                    {category.icon}
                                </span>
                            </div>
                            <span
                                className="text-xs font-medium text-gray-700 text-center leading-tight"
                                data-oid="hhh33sa"
                            >
                                {category.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
