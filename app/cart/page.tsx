'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { ClientOnly } from '@/components/common/ClientOnly';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { MobileCartItem } from '@/components/mobile/MobileCartItem';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CartPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const isMobile = useIsMobile();
    
    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated (as fallback to middleware)
    if (!isAuthenticated || !user) {
        window.location.href = '/auth/login';
        return null;
    }
    const {
        items,
        totalItems,
        subtotal,
        deliveryFee,
        discount,
        total,
        appliedPromo,
        removeItem,
        updateQuantity,
        applyPromoCode,
        removePromoCode,
        clearCart,
        loadCartFromServer
    } = useCart();
    console.log(items)
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');

    const handleApplyPromo = () => {
        setPromoError('');
        const success = applyPromoCode(promoCode);
        if (success) {
            setPromoCode('');
        } else {
            setPromoError('Invalid promo code or minimum order not met');
        }
    };

    const handleRemovePromo = () => {
        removePromoCode();
        setPromoError('');
    };

    const prescriptionItems = items.filter((item) => item.prescription);
    console.log(prescriptionItems, 'prescription-items')
    const uniquePharmacies = new Set(items.map((item) => item.pharmacy));
    const fetchCartFromServer = async()=>{
        const cart = await loadCartFromServer()
        console.log(cart)
        return cart

    }
    useEffect(() => {
        fetchCartFromServer()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="kymr142"
        >
            <ResponsiveHeader data-oid="9ig3m4u" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="73_lt7y">
                {/* Breadcrumb - Hidden on Mobile */}
                {!isMobile && (
                    <nav
                        className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
                        data-oid="enlh:n5"
                    >
                        <Link
                            href="/"
                            className="hover:text-[#1F1F6F] transition-colors"
                            data-oid="jdlkjmz"
                        >
                            Home
                        </Link>
                        <span data-oid=".8qi:mf">›</span>
                        <span className="text-gray-900 font-medium" data-oid="74v6hrx">
                            Shopping Cart
                        </span>
                    </nav>
                )}

                <div className="mb-6 md:mb-8" data-oid="7_q1k:_">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900" data-oid="tel2p4t">
                        Shopping Cart
                    </h1>
                    <p
                        className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base"
                        data-oid="p0l3sck"
                    >
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                        {uniquePharmacies.size > 1 && (
                            <span className="ml-2 text-xs md:text-sm" data-oid="a_ej-ku">
                                • From {uniquePharmacies.size} pharmacies
                            </span>
                        )}
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-12 md:py-16" data-oid="vjbcq88">
                        <div
                            className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="7-7wvy_"
                        >
                            <svg
                                className="w-10 h-10 md:w-12 md:h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="lwsguff"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                                    data-oid="yu34ev:"
                                />
                            </svg>
                        </div>
                        <h3
                            className="text-lg md:text-xl font-semibold text-gray-900 mb-2"
                            data-oid="ktjsb25"
                        >
                            Your cart is empty
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm md:text-base" data-oid="cy12v3q">
                            Add some products to get started
                        </p>
                        <Link
                            href="/shop"
                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 text-sm md:text-base"
                            data-oid="yl.-nda"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div
                        className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8"
                        data-oid="g7ruhhk"
                    >
                        {/* Cart Items */}
                        <div className="lg:col-span-2" data-oid="yjb_4c_">
                            {/* Prescription Notice */}
                            {prescriptionItems && prescriptionItems.length>0 && prescriptionItems[0].requiresPrescription && (
                                <div
                                    className="bg-amber-50 border border-amber-200 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6"
                                    data-oid="np5x0_v"
                                >
                                    <div className="flex items-start" data-oid="g8uu345">
                                        <svg
                                            className="w-4 h-4 md:w-5 md:h-5 text-amber-600 mt-0.5 mr-2 md:mr-3 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="sszmgrt"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                data-oid="5l093oh"
                                            />
                                        </svg>
                                        <div data-oid="xkppnko">
                                            <h4
                                                className="font-semibold text-amber-800 text-sm md:text-base"
                                                data-oid="zr1_fr_"
                                            >
                                                Prescription Required
                                            </h4>
                                            <p
                                                className="text-amber-700 text-xs md:text-sm mt-1"
                                                data-oid="pi:9pal"
                                            >
                                                You have {prescriptionItems.length} prescription
                                                item(s) in your cart. You{"'"}ll need to upload a valid
                                                prescription before checkout.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Clear Cart Button */}
                            {items.length > 0 && (
                                <div
                                    className="flex justify-between items-center mb-4 md:mb-6"
                                    data-oid="vyecv9:"
                                >
                                    <h2
                                        className="text-base md:text-lg font-semibold text-gray-900"
                                        data-oid="q.d8:z_"
                                    >
                                        Cart Items
                                    </h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium transition-colors"
                                        data-oid="_llp36g"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            )}

                            {/* Mobile Cart Items */}
                            {isMobile ? (
                                <div className="space-y-3" data-oid="-0rb6c5">
                                    {items.map((item) => (
                                        <MobileCartItem
                                            key={item.id}
                                            id={item.id}
                                            productId={item.productId}
                                            name={item.name}
                                            price={item.price}
                                            originalPrice={item.originalPrice}
                                            quantity={item.quantity}
                                            maxQuantity={item.maxQuantity}
                                            category={item.category}
                                            pharmacy={item.pharmacy}
                                            cityName={item.cityName}
                                            manufacturer={item.manufacturer}
                                            packSize={item.packSize}
                                            prescription={item.prescription}
                                            inStock={item.inStock}
                                            image={item.image}
                                            onRemove={removeItem}
                                            onUpdateQuantity={updateQuantity}
                                            data-oid="u7og91l"
                                        />
                                    ))}
                                </div>
                            ) : (
                                /* Desktop Cart Items */
                                <div
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                                    data-oid="__xo8fq"
                                >
                                    {items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`p-6 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
                                            data-oid="z.egyha"
                                        >
                                            <div
                                                className="flex items-center space-x-4"
                                                data-oid="7sxzz_o"
                                            >
                                                {/* Product Image */}
                                                <div
                                                    className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                                                    data-oid="4f_4p6:"
                                                >
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.productName}
                                                            className="w-full h-full object-contain rounded-lg"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                target.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                            data-oid="product-image"
                                                        />
                                                    ) : null}
                                                    <div className={`text-center ${item.image ? 'hidden' : ''}`} data-oid="y868j4u">
                                                        <div
                                                            className="text-3xl mb-1"
                                                            data-oid="aw2by1e"
                                                        >
                                                            {item.category === 'prescription'
                                                                ? '💊'
                                                                : item.category === 'supplements'
                                                                  ? '🍿'
                                                                  : item.category === 'skincare'
                                                                    ? '🧴'
                                                                    : item.category === 'baby'
                                                                      ? '👶'
                                                                      : item.category === 'medical'
                                                                        ? '🩹'
                                                                        : '💊'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1" data-oid="crj3c_3">
                                                    <div
                                                        className="flex items-start justify-between"
                                                        data-oid="r67kl8_"
                                                    >
                                                        <div data-oid="dqnamd:">
                                                            <Link
                                                                href={`/product/${item.productId}`}
                                                                className="font-semibold text-gray-900 hover:text-[#1F1F6F] transition-colors"
                                                                data-oid="lq.g:f_"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                            <p
                                                                className="text-sm text-gray-600 mt-1"
                                                                data-oid=".epx8o."
                                                            >
                                                                {item.pharmacy} • {item.cityName}
                                                            </p>
                                                            <p
                                                                className="text-xs text-gray-500 mt-1"
                                                                data-oid="33cpw7c"
                                                            >
                                                                {item.manufacturer} •{' '}
                                                                {item.packSize}
                                                            </p>
                                                            {item.requiresPrescription && (
                                                                <span
                                                                    className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-2"
                                                                    data-oid="j.cgs:."
                                                                >
                                                                    Prescription Required
                                                                </span>
                                                            )}
                                                            {!item.inStock && (
                                                                <span
                                                                    className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-2 ml-2"
                                                                    data-oid="9ra3wq1"
                                                                >
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                            title="Remove item"
                                                            data-oid="xp0ast7"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="_e:gkyc"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    data-oid="2-q9-5-"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Quantity and Price */}
                                                    <div
                                                        className="flex items-center justify-between mt-4"
                                                        data-oid="gt4ow10"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-3"
                                                            data-oid="rdkg_gx"
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity - 1,
                                                                    )
                                                                }
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                disabled={item.quantity <= 1}
                                                                data-oid="tplvsz:"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid="u0ck-v8"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M20 12H4"
                                                                        data-oid="mdfg.bd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <span
                                                                className="font-semibold text-gray-900 w-8 text-center"
                                                                data-oid="w-52isv"
                                                            >
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity + 1,
                                                                    )
                                                                }
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                disabled={
                                                                    item.quantity >=
                                                                    (item.maxQuantity || 99)
                                                                }
                                                                data-oid="vc4z9p4"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid="8p:zrpc"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                        data-oid="wm5gyg2"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div
                                                            className="text-right"
                                                            data-oid="nkjycav"
                                                        >
                                                            <p
                                                                className="font-bold text-[#1F1F6F]"
                                                                data-oid="wbetqem"
                                                            >
                                                                EGP{' '}
                                                                {(
                                                                    item?.price * item?.quantity
                                                                ).toFixed(2)}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-500"
                                                                data-oid="2eo0q1l"
                                                            >
                                                                EGP {item?.price.toFixed(2)} each
                                                            </p>
                                                            {item.originalPrice &&
                                                                item.originalPrice > item.price && (
                                                                    <p
                                                                        className="text-xs text-gray-400 line-through"
                                                                        data-oid=".qls6-t"
                                                                    >
                                                                        EGP{' '}
                                                                        {item?.originalPrice.toFixed(
                                                                            2,
                                                                        )}{' '}
                                                                        each
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1" data-oid="968lgpv">
                            <div
                                className={`bg-white rounded-lg md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 ${
                                    isMobile ? '' : 'sticky top-24'
                                }`}
                                data-oid="dfsd60g"
                            >
                                <h3
                                    className="text-base md:text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="pgfk3d6"
                                >
                                    Order Summary
                                </h3>

                                {/* Promo Code */}
                                <div className="mb-4 md:mb-6" data-oid="0wz83nc">
                                    <label
                                        className="block text-xs md:text-sm font-medium text-gray-700 mb-2"
                                        data-oid="fyh:lju"
                                    >
                                        Promo Code
                                    </label>
                                    {appliedPromo ? (
                                        <div
                                            className="p-3 bg-green-50 border border-green-200 rounded-lg"
                                            data-oid="d:m111h"
                                        >
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="vjuxa4h"
                                            >
                                                <div data-oid="jisdgp7">
                                                    <p
                                                        className="text-xs md:text-sm font-medium text-green-800"
                                                        data-oid="ffl_5vb"
                                                    >
                                                        {appliedPromo.code}
                                                    </p>
                                                    <p
                                                        className="text-xs text-green-600"
                                                        data-oid="215t0f5"
                                                    >
                                                        {appliedPromo.description}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleRemovePromo}
                                                    className="text-green-600 hover:text-green-700 text-xs md:text-sm"
                                                    data-oid="rw1rxrf"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2" data-oid="w59kmpr">
                                            <div className="flex space-x-2" data-oid="vhhxu2:">
                                                <input
                                                    type="text"
                                                    value={promoCode}
                                                    onChange={(e) =>
                                                        setPromoCode(e.target.value.toUpperCase())
                                                    }
                                                    placeholder="Enter code"
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                    data-oid="cg8vigt"
                                                />

                                                <button
                                                    onClick={handleApplyPromo}
                                                    disabled={!promoCode.trim()}
                                                    className="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                                                    data-oid="r.y-lov"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {promoError && (
                                                <p
                                                    className="text-xs text-red-600"
                                                    data-oid="wa8shlc"
                                                >
                                                    {promoError}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div
                                    className="space-y-2 md:space-y-3 mb-4 md:mb-6"
                                    data-oid="8w7.4._"
                                >
                                    <div className="flex justify-between" data-oid="tbl4csd">
                                        <span
                                            className="text-gray-600 text-sm md:text-base"
                                            data-oid="9lhilhv"
                                        >
                                            Subtotal
                                        </span>
                                        <span
                                            className="font-semibold text-sm md:text-base"
                                            data-oid="ug33r47"
                                        >
                                            EGP {subtotal?.toFixed(2)}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div
                                            className="flex justify-between text-green-600"
                                            data-oid="4-3ujh."
                                        >
                                            <span
                                                className="text-sm md:text-base"
                                                data-oid="sofq6z:"
                                            >
                                                Discount ({appliedPromo?.code})
                                            </span>
                                            <span
                                                className="text-sm md:text-base"
                                                data-oid="arvt_mv"
                                            >
                                                -EGP {discount?.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between" data-oid="zj-3vv0">
                                        <span
                                            className="text-gray-600 text-sm md:text-base"
                                            data-oid="7lx:-y_"
                                        >
                                            Delivery Fee
                                        </span>
                                        <span
                                            className="font-semibold text-sm md:text-base"
                                            data-oid="f71824i"
                                        >
                                            {deliveryFee === 0
                                                ? 'FREE'
                                                : `EGP ${deliveryFee?.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div
                                        className="border-t border-gray-200 pt-2 md:pt-3"
                                        data-oid="-7a-:ge"
                                    >
                                        <div className="flex justify-between" data-oid="9zz-gfo">
                                            <span
                                                className="text-base md:text-lg font-semibold"
                                                data-oid="hn9tdtk"
                                            >
                                                Total
                                            </span>
                                            <span
                                                className="text-base md:text-lg font-bold text-[#1F1F6F]"
                                                data-oid="_p3an23"
                                            >
                                                EGP {total?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    className="block w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-4 rounded-lg md:rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 shadow-lg hover:shadow-xl mb-3 md:mb-4 text-center text-sm md:text-base"
                                    data-oid="6w5eaj."
                                >
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    href="/shop"
                                    className="block w-full text-center text-gray-600 hover:text-[#1F1F6F] transition-colors text-sm md:text-base"
                                    data-oid="iwtaw3x"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Security Notice */}
                                <div
                                    className="mt-4 md:mt-6 p-3 bg-gray-50 rounded-lg"
                                    data-oid="su77:gu"
                                >
                                    <div
                                        className="flex items-center text-xs md:text-sm text-gray-600"
                                        data-oid="qrla627"
                                    >
                                        <svg
                                            className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="tt4sjuc"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                data-oid="m0r-fcp"
                                            />
                                        </svg>
                                        Secure checkout • Cash on delivery
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="dl7unz:">
                <ClientOnly data-oid="3zca:6g">
                    <Footer data-oid="dsr.37a" />
                </ClientOnly>
            </div>

            {/* Mobile Floating Navigation - Removed for Cart Page */}

            {/* Mobile Bottom Padding - Only for Mobile */}
            <div className="h-24 md:hidden" data-oid="uvu7c0h"></div>
        </div>
    );
}
