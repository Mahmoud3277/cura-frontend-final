'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface MobileProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    images?: Array<{url: string; key: string; filename: string; originalName: string; type: string; size: number; uploadedAt: Date}>;
    category: string;
    description: string;
    requiresPrescription?: boolean;
    href: string;
    onAddToCart?: () => void;
    isInCart?: boolean;
    cartQuantity?: number;
}

export function MobileProductCard({
    id,
    name,
    price,
    originalPrice,
    image,
    images,
    category,
    description,
    requiresPrescription = false,
    href,
    onAddToCart,
    isInCart = false,
    cartQuantity = 0,
}: MobileProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart();
        }
    };

    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: string } = {
            'Pain Relievers': '💊',
            'Supplements & Vitamins': '💊',
            'Baby Essentials': '👶',
            'Skin Care Products': '🧴',
            'Health Devices': '🩺',
            Medicine: '💊',
        };
        return icons[category] || '💊';
    };

    const hasDiscount = originalPrice && originalPrice > price;
    const discountPercentage = hasDiscount
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <Link href={href} className="block" data-oid="8b8idvt">
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                data-oid="bgkkgq_"
            >
                {/* Image Container */}
                <div
                    className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100"
                    data-oid="ukt5ej1"
                >
                    {!imageError && (images && images.length > 0 ? images[0].url : image) ? (
                        <img
                            src={images && images.length > 0 ? images[0].url : image}
                            alt={name}
                            className="w-full h-full object-contain"
                            onError={() => setImageError(true)}
                            data-oid="yg68_de"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            data-oid="k658esq"
                        >
                            <div className="text-4xl opacity-60" data-oid="zze51ib">
                                {getCategoryIcon(category)}
                            </div>
                        </div>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div
                            className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                            data-oid="365uoei"
                        >
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Prescription Required Badge */}
                    {requiresPrescription && (
                        <div
                            className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                            data-oid="0oz5.1r"
                        >
                            Rx
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3" data-oid="dc74b1k">
                    {/* Product Name */}
                    <h3
                        className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 leading-tight"
                        data-oid="q_m8v98"
                    >
                        {name}
                    </h3>

                    {/* Description */}
                    <p
                        className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed"
                        data-oid="pq0sy8d"
                    >
                        {description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3" data-oid="6lk6pyl">
                        <div className="flex items-center space-x-2" data-oid="4co:693">
                            <span className="text-lg font-bold text-[#1F1F6F]" data-oid="42j7iq5">
                                {price} EGP
                            </span>
                            {hasDiscount && (
                                <span
                                    className="text-sm text-gray-500 line-through"
                                    data-oid="4d0wcna"
                                >
                                    {originalPrice} EGP
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                            isInCart
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white hover:from-[#14274E] hover:to-[#394867]'
                        }`}
                        data-oid="w92z_v0"
                    >
                        {isInCart ? (
                            <div
                                className="flex items-center justify-center space-x-2"
                                data-oid="4bfh4e5"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="0dm3fp7"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                        data-oid="vw3sy:u"
                                    />
                                </svg>
                                <span data-oid="y1ukdfl">In Cart ({cartQuantity})</span>
                            </div>
                        ) : (
                            t('addToCart')
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}
