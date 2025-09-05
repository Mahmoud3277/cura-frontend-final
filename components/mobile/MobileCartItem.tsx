'use client';

import Link from 'next/link';

interface MobileCartItemProps {
    id: string;
    productId: string;
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    maxQuantity?: number;
    category: string;
    pharmacy: string;
    cityName: string;
    manufacturer: string;
    packSize: string;
    prescription?: boolean;
    inStock?: boolean;
    image?: string;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
}

export function MobileCartItem({
    id,
    productId,
    name,
    price,
    originalPrice,
    quantity,
    maxQuantity = 99,
    category,
    pharmacy,
    cityName,
    manufacturer,
    packSize,
    prescription = false,
    inStock = true,
    image,
    onRemove,
    onUpdateQuantity,
}: MobileCartItemProps) {
    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: string } = {
            prescription: '💊',
            supplements: '🍿',
            skincare: '🧴',
            baby: '👶',
            medical: '🩹',
        };
        return icons[category] || '💊';
    };

    const hasDiscount = originalPrice && originalPrice > price;

    return (
        <div
            className="bg-white rounded-lg border border-gray-100 p-3 mb-3 shadow-sm"
            data-oid="kw_07mu"
        >
            <div className="flex space-x-3" data-oid="4:2ffx:">
                {/* Product Image */}
                <div
                    className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                    data-oid="s9deeeg"
                >
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                            }}
                            data-oid="mobile-product-image"
                        />
                    ) : null}
                    <div className={`text-2xl ${image ? 'hidden' : ''}`} data-oid="-ymnais">
                        {getCategoryIcon(category)}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0" data-oid="4jsfln7">
                    {/* Product Name and Remove Button */}
                    <div className="flex items-start justify-between mb-1" data-oid="1__lp2s">
                        <Link
                            href={`/product/${productId}`}
                            className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 hover:text-[#1F1F6F] transition-colors"
                            data-oid="uhgmc50"
                        >
                            {name}
                        </Link>
                        <button
                            onClick={() => onRemove(id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2 flex-shrink-0"
                            title="Remove item"
                            data-oid="a:ep:ke"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="ufo3-4m"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    data-oid="l2u0f77"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Pharmacy and Location */}
                    <p className="text-xs text-gray-600 mb-1" data-oid="ovq235f">
                        {pharmacy} • {cityName}
                    </p>

                    {/* Manufacturer and Pack Size */}
                    <p className="text-xs text-gray-500 mb-2" data-oid="lo2yrcu">
                        {manufacturer} • {packSize}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3" data-oid="oy-u-tt">
                        {prescription && (
                            <span
                                className="inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full"
                                data-oid="j8j1a.9"
                            >
                                Prescription Required
                            </span>
                        )}
                        {!inStock && (
                            <span
                                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
                                data-oid="2pmtvjo"
                            >
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Quantity and Price Row */}
                    <div className="flex items-center justify-between" data-oid="34hd-:r">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2" data-oid="x_tl3nt">
                            <button
                                onClick={() => onUpdateQuantity(id, quantity - 1)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity <= 1}
                                data-oid="g10f4op"
                            >
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="g-1r1qi"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                        data-oid="il1arrl"
                                    />
                                </svg>
                            </button>
                            <span
                                className="font-semibold text-gray-900 text-sm w-6 text-center"
                                data-oid="gijx6vu"
                            >
                                {quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(id, quantity + 1)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity >= maxQuantity}
                                data-oid=".v3x:.x"
                            >
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="i:mi7xo"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        data-oid="slowxs-"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Price */}
                        <div className="text-right" data-oid=":5nvkn1">
                            <p className="font-bold text-[#1F1F6F] text-sm" data-oid="il0t4en">
                                EGP {(price * quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500" data-oid="he-yv9v">
                                EGP {price.toFixed(2)} each
                            </p>
                            {hasDiscount && (
                                <p
                                    className="text-xs text-gray-400 line-through"
                                    data-oid="uf8pe.m"
                                >
                                    EGP {originalPrice!.toFixed(2)} each
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
