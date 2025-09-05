'use client';

import Link from 'next/link';
import { Medicine } from '@/lib/data/medicineData';
import { useCart } from '@/lib/contexts/CartContext';
import { useState, useEffect } from 'react';
interface ProductCardProps {
    product: Medicine;
    onAddToCart?: (productId: string) => void;
    isMobile?: boolean;
}

export function ProductCard({ product, onAddToCart, isMobile = false }: ProductCardProps) {
    const { isInCart, getItemQuantity } = useCart();
    const [isInStock, setinStock] = useState(false);

    console.log('product card :', product)
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.requiresPrescription) {
            // For prescription medicines, redirect to prescription upload
            window.location.href = '/prescription/upload';
            return;
        }

        // Always redirect to product detail page for pharmacy selection
        window.location.href = `/product/${product._id}`;
    };

    // Use the correct ID field and pharmacy ID
    const productId = product._id;
    const pharmacyId = product.pharmacyId || '';
    const itemQuantity = getItemQuantity(productId, pharmacyId);
    const inCart = isInCart(productId, pharmacyId);

    // Calculate discount percentage
    const discountPercentage = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    const [stockQuantity, setstockQuantity] = useState(0);
    // Determine stock status
    const getStats = ()=>{
        product?.pharmacyStocks.map((pharmacy)=>{
            if(pharmacy.inStock){
                if(pharmacy.stockQuantity > stockQuantity){
                    setstockQuantity(pharmacy.stockQuantity)
                }
                setinStock(true);
            }
        });
    }
    useEffect(() => {
        if(product){
            getStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    if (isMobile) {
        return (
            <Link
                href={`/product/${productId}`}
                className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                data-oid="mobile-product-card"
            >
                {/* Mobile Product Image */}
                <div
                    className="h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative rounded-t-2xl overflow-hidden"
                    data-oid="mobile-product-image"
                >
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            data-oid="mobile-product-image-img"
                        />
                    ) : (
                        <div className="text-3xl opacity-60" data-oid="mobile-product-icon">
                            {product.category === 'prescription' || product.requiresPrescription
                                ? '💊'
                                : product.category === 'supplements'
                                  ? '🍿'
                                  : product.category === 'skincare'
                                    ? '🧴'
                                    : product.category === 'baby'
                                      ? '👶'
                                      : product.category === 'medical'
                                        ? '🩹'
                                        : '💊'}
                        </div>
                    )}

                    {/* Mobile Badges */}
                    {product.requiresPrescription && (
                        <div
                            className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                            data-oid="mobile-rx-badge"
                        >
                            Rx
                        </div>
                    )}
                    {!isInStock && (
                        <div
                            className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                            data-oid="mobile-stock-badge"
                        >
                            Out
                        </div>
                    )}
                    {discountPercentage > 0 && !product.requiresPrescription && (
                        <div
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                            data-oid="mobile-discount-badge"
                        >
                            -{discountPercentage}%
                        </div>
                    )}
                </div>

                {/* Mobile Product Info */}
                <div className="p-3" data-oid="mobile-product-info">
                    <h4
                        className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 leading-tight h-8"
                        data-oid="mobile-product-title"
                    >
                        {product.name}
                    </h4>

                    {/* Mobile Rating - Show for all categories but with different logic */}
                    {product.rating && product.rating > 0 && (
                        <div className="flex items-center mb-2" data-oid="mobile-rating">
                            <div className="flex items-center" data-oid="mobile-rating-stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-3 h-3 ${
                                            i < Math.floor(product.rating || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="mobile-rating-star"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span
                                className="text-xs text-gray-500 ml-1"
                                data-oid="mobile-rating-text"
                            >
                                {product.rating} {product.reviews && `(${product.reviews})`}
                            </span>
                        </div>
                    )}

                    {/* Mobile Price */}
                    <div className="flex items-center justify-between mb-2" data-oid="mobile-price-section">
                        <div className="flex items-center space-x-1" data-oid="mobile-price-container">
                            {product.price && product.price || product?.priceReference || product?.overallAveragePrice > 0 ? (
                                <>
                                    <span className="text-base font-bold text-[#1F1F6F]" data-oid="mobile-price">
                                        {product.pharmacyStocks[0].price} EGP
                                    </span>
                                    {product.originalPrice && product.originalPrice || product?.priceReference || product?.overallAveragePrice > product.price && (
                                        <span
                                            className="text-sm text-gray-500 line-through"
                                            data-oid="mobile-original-price"
                                        >
                                            {product?.price  || product.priceReference  || product?.overallAveragePrice } EGP
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-sm text-gray-500" data-oid="mobile-price-na">
                                    Price on request
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mobile Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                            !isInStock
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : product.requiresPrescription
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                                  : inCart
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                    : 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white hover:from-[#14274E] hover:to-[#394867]'
                        }`}
                        data-oid="mobile-add-to-cart"
                    >
                        {!isInStock
                            ? 'Out of Stock'
                            : product.requiresPrescription
                              ? 'Upload Rx'
                              : inCart
                                ? `In Cart (${itemQuantity})`
                                : 'View Options'}
                    </button>
                </div>
            </Link>
        );
    }

    // Desktop version
    return (
        <Link
            href={`/product/${productId}`}
            className="group block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 card-hover animate-fade-in-up"
            data-oid="desktop-product-card"
        >
            {/* Desktop Product Image */}
            <div
                className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden"
                data-oid="desktop-product-image"
            >
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        data-oid="desktop-product-image-img"
                    />
                ) : (
                    <div
                        className="text-center group-hover:scale-110 transition-transform duration-500"
                        data-oid="desktop-product-icon-container"
                    >
                        <div className="text-6xl mb-2" data-oid="desktop-product-icon">
                            {product.category === 'prescription' || product.requiresPrescription
                                ? '💊'
                                : product.category === 'supplements'
                                  ? '🍿'
                                  : product.category === 'skincare'
                                    ? '🧴'
                                    : product.category === 'baby'
                                      ? '👶'
                                      : product.category === 'medical'
                                        ? '🩹'
                                        : '💊'}
                        </div>
                        <span
                            className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300 text-sm"
                            data-oid="desktop-product-placeholder"
                        >
                            Product Image
                        </span>
                    </div>
                )}

                {/* Desktop Badges */}
                <div
                    className="absolute top-3 left-3 flex flex-col gap-2"
                    data-oid="desktop-badges"
                >
                    {product.requiresPrescription && (
                        <div
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                            data-oid="desktop-rx-badge"
                        >
                            Rx Required
                        </div>
                    )}
                    {!isInStock && (
                        <div
                            className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                            data-oid="desktop-stock-badge"
                        >
                            Out of Stock
                        </div>
                    )}
                    {product.delivery?.availableForDelivery && (
                        <div
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                            data-oid="desktop-delivery-badge"
                        >
                            {product.delivery.estimatedDeliveryTime || '1-2 days'}
                        </div>
                    )}
                </div>

                {discountPercentage > 0 && (
                    <div
                        className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold"
                        data-oid="desktop-discount-badge"
                    >
                        -{discountPercentage}%
                    </div>
                )}

                {/* Desktop Quick View Button */}
                <div
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    data-oid="desktop-quick-view-overlay"
                >
                    <button
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 btn-animate hover-scale"
                        data-oid="desktop-quick-view-button"
                    >
                        Quick View
                    </button>
                </div>
            </div>

            {/* Desktop Product Info */}
            <div className="p-5" data-oid="desktop-product-info">
                <div className="mb-3 space-y-2" data-oid="desktop-product-details">
                    <h3
                        className="text-base font-bold text-gray-900 group-hover:text-[#1F1F6F] transition-colors duration-300 leading-tight"
                        data-oid="desktop-product-title"
                    >
                        {product.name}
                    </h3>
                    {product.description && (
                        <p
                            className="text-sm text-gray-600 leading-relaxed"
                            data-oid="desktop-product-description"
                        >
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Desktop Rating - Show for all products that have ratings */}
                {product.rating && product.rating > 0 && (
                    <div className="flex items-center mb-3" data-oid="desktop-product-rating">
                        <div className="flex items-center" data-oid="desktop-rating-stars">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(product.rating || 0)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid="desktop-rating-star"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2" data-oid="desktop-rating-text">
                            {product.rating} {product.reviewCount && `(${product.reviewCount})`}
                        </span>
                    </div>
                )}

                {/* Desktop Price & Add to Cart */}
                <div className="flex items-center justify-between" data-oid="desktop-price-section">
                    <div className="flex items-center space-x-2" data-oid="desktop-price-container">
                    {product.price && product.price || product?.priceReference || product?.overallAveragePrice > 0 ? (
                                <>
                                    <span className="text-base font-bold text-[#1F1F6F]" data-oid="mobile-price">
                                        {product.pharmacyStocks.length > 0 && product?.pharmacyStocks[0]?.price} EGP
                                    </span>
                                    {product.originalPrice && product.originalPrice || product?.priceReference || product?.overallAveragePrice > product.price && (
                                        <span
                                            className="text-sm text-gray-500 line-through"
                                            data-oid="mobile-original-price"
                                        >
                                            {product?.price  || product.priceReference  || product?.overallAveragePrice } EGP
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-sm text-gray-500" data-oid="mobile-price-na">
                                    Price on request
                                </span>
                            )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg btn-animate hover-scale ${
                            !isInStock
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : product.requiresPrescription
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                                  : inCart
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white hover:from-[#14274E] hover:to-[#394867] hover-glow'
                        }`}
                        data-oid="desktop-add-to-cart"
                    >
                        {!isInStock
                            ? 'Out of Stock'
                            : product.requiresPrescription
                              ? 'Upload Rx'
                              : inCart
                                ? `In Cart (${itemQuantity})`
                                : 'View Options'}
                    </button>
                </div>
            </div>
        </Link>
    );
}