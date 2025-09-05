'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Subscription } from '@/lib/types';
import { products } from '@/lib/data/products';
import { subscriptionService } from '@/lib/services/subscriptionService';

interface SubscriptionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription | null;
}

export function SubscriptionDetailsModal({
    isOpen,
    onClose,
    subscription,
}: SubscriptionDetailsModalProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const getSubscriptionProducts = () => {
        if (!subscription) return [];
        return subscription.products
            .map((subProduct) => {
                const product = products.find((p) => p.id.toString() === subProduct.productId);
                return {
                    ...subProduct,
                    product,
                };
            })
            .filter((item) => item.product);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getFrequencyText = (frequency: string) => {
        return t(`subscription.frequency.${frequency}`);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const getDaysUntilDelivery = () => {
        if (!subscription?.nextDelivery) return null;
        const today = new Date();
        const nextDelivery = new Date(subscription.nextDelivery);
        const diffTime = nextDelivery.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (!isOpen || !subscription) return null;
    if (!mounted) return null;

    const subscriptionProducts = getSubscriptionProducts();
    const plan = subscription.planId
        ? subscriptionService.getSubscriptionPlan(subscription.planId)
        : null;
    const daysUntilDelivery = getDaysUntilDelivery();

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            style={{
                zIndex: 99999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
            data-oid="bt7.koi"
        >
            <div
                className="bg-white rounded-3xl max-w-4xl w-full min-h-[600px] max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 my-4"
                onClick={(e) => e.stopPropagation()}
                data-oid="vvj-_.1"
            >
                {/* Header */}
                <div
                    className="bg-white border-b border-gray-200 px-6 sm:px-8 py-4 sm:py-6 rounded-t-3xl"
                    data-oid="f6njfb7"
                >
                    <div className="flex items-center justify-between" data-oid="8la6imo">
                        <div className="flex items-center space-x-4" data-oid="bzk_-p0">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center"
                                data-oid="n7a1-j7"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid=":gzkk.4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        data-oid="6s8fyl6"
                                    />
                                </svg>
                            </div>
                            <div data-oid="j5d-663">
                                <h2 className="text-2xl font-bold text-gray-900" data-oid="uap2at1">
                                    {subscription.id}
                                </h2>
                                <p className="text-gray-600" data-oid="fa-e1ad">
                                    {t('subscription.details')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            data-oid="qxj1m9z"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="nlm9erz"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid="_l1y0d7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Status and Frequency */}
                    <div className="flex items-center space-x-4 mt-4" data-oid=".cgf-n4">
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}
                            data-oid="hm.hekn"
                        >
                            {t(`subscription.status.${subscription.status}`)}
                        </span>
                        <span className="text-sm text-gray-600" data-oid=":-8du11">
                            <strong data-oid="5cccyx4">{t('subscription.frequency.label')}:</strong>{' '}
                            {getFrequencyText(subscription.frequency)}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1" data-oid="3xzhvac">
                    {/* Next Delivery Info */}
                    {subscription.status === 'active' && subscription.nextDelivery && (
                        <div
                            className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 mb-6"
                            data-oid="a8qbwoc"
                        >
                            <div className="flex items-center justify-between" data-oid="6qpr5xi">
                                <div data-oid="r8z72bf">
                                    <p
                                        className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-1"
                                        data-oid="ryg6:ew"
                                    >
                                        {t('subscription.nextDelivery')}
                                    </p>
                                    <p className="text-blue-700 font-medium" data-oid="72:g7jh">
                                        {formatDate(subscription.nextDelivery)}
                                        {daysUntilDelivery !== null && (
                                            <span className="ml-2 text-sm" data-oid="jhojx9i">
                                                (
                                                {daysUntilDelivery > 0
                                                    ? t('subscription.inDays', {
                                                          days: daysUntilDelivery,
                                                      })
                                                    : daysUntilDelivery === 0
                                                      ? t('subscription.today')
                                                      : t('subscription.overdue')}
                                                )
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-right" data-oid="pmu_y:w">
                                    <p
                                        className="text-sm text-blue-600 font-semibold"
                                        data-oid="qnpheca"
                                    >
                                        {t('subscription.deliveryAddress')}
                                    </p>
                                    <p
                                        className="text-sm text-blue-800 font-medium"
                                        data-oid="zpdw7oj"
                                    >
                                        {subscription.deliveryAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products List */}
                    <div className="space-y-4 mb-6" data-oid="3a_9foj">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4" data-oid="fb9v:dm">
                            {t('subscription.products')} ({subscriptionProducts.length})
                        </h4>
                        {subscriptionProducts.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200"
                                data-oid="u6h4g7x"
                            >
                                <div
                                    className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200"
                                    data-oid="9y:2w6n"
                                >
                                    <img
                                        src={item.product!.image}
                                        alt={item.product!.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                        data-oid="8dhwu3u"
                                    />
                                </div>
                                <div className="flex-1" data-oid="u-4cz8n">
                                    <p
                                        className="font-semibold text-gray-900 text-lg"
                                        data-oid="f.s0voq"
                                    >
                                        {locale === 'ar'
                                            ? item.product!.nameAr
                                            : item.product!.name}
                                    </p>
                                    <p
                                        className="text-sm text-gray-600 font-medium"
                                        data-oid="hb.szq:"
                                    >
                                        {locale === 'ar'
                                            ? item.product!.pharmacyAr
                                            : item.product!.pharmacy}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="hoesbxo">
                                        {t('subscription.quantity')}: {item.quantity}{' '}
                                        {item.quantity > 1 ? 'units' : 'unit'}
                                    </p>
                                </div>
                                <div className="text-right" data-oid="b:sqt6r">
                                    <p
                                        className="text-lg font-bold text-[#1F1F6F]"
                                        data-oid="vx5i3u8"
                                    >
                                        {item.product!.price.toFixed(2)} {t('common.currency')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Subscription Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="jsm_n6j">
                        {/* Subscription Information */}
                        <div className="bg-gray-50 rounded-xl p-6" data-oid=":bdgtao">
                            <h5 className="font-semibold text-gray-900 mb-4" data-oid="sqw:1mc">
                                {t('subscription.details')}
                            </h5>
                            <div className="space-y-3 text-sm" data-oid="1j0n5cs">
                                <div className="flex justify-between" data-oid="p6dkt6t">
                                    <span className="text-gray-600" data-oid=".2pcknn">
                                        {t('subscription.created')}:
                                    </span>
                                    <span className="text-gray-900 font-medium" data-oid="9r_f7od">
                                        {formatDate(subscription.createdAt)}
                                    </span>
                                </div>
                                {subscription.updatedAt && (
                                    <div className="flex justify-between" data-oid="n8a6q-p">
                                        <span className="text-gray-600" data-oid="z-1-8k-">
                                            {t('subscription.lastUpdated')}:
                                        </span>
                                        <span
                                            className="text-gray-900 font-medium"
                                            data-oid="68:xg2:"
                                        >
                                            {formatDate(subscription.updatedAt)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between" data-oid="v79v_5s">
                                    <span className="text-gray-600" data-oid="t6s:bjk">
                                        {t('subscription.totalAmount')}:
                                    </span>
                                    <span className="text-gray-900 font-bold" data-oid="hn2jfyq">
                                        {subscription.totalAmount.toFixed(2)} {t('common.currency')}
                                    </span>
                                </div>
                                {subscription.deliveryInstructions && (
                                    <div data-oid="wu66g09">
                                        <span className="text-gray-600" data-oid="w.ix3u1">
                                            {t('subscription.deliveryInstructions')}:
                                        </span>
                                        <p className="text-gray-900 mt-1" data-oid="lm._kbs">
                                            {subscription.deliveryInstructions}
                                        </p>
                                    </div>
                                )}
                                {subscription.pauseReason && (
                                    <div data-oid="627eacn">
                                        <span className="text-gray-600" data-oid="ag8vhz1">
                                            {t('subscription.pauseReason')}:
                                        </span>
                                        <p className="text-gray-900 mt-1" data-oid="ct747x7">
                                            {subscription.pauseReason}
                                        </p>
                                    </div>
                                )}
                                {subscription.pausedUntil && (
                                    <div className="flex justify-between" data-oid="vdt3awz">
                                        <span className="text-gray-600" data-oid="hr8os.3">
                                            {t('subscription.pausedUntil')}:
                                        </span>
                                        <span
                                            className="text-gray-900 font-medium"
                                            data-oid="40zfwpd"
                                        >
                                            {formatDate(subscription.pausedUntil)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delivery History */}
                        <div className="bg-gray-50 rounded-xl p-6" data-oid="h-3o_wh">
                            <h5 className="font-semibold text-gray-900 mb-4" data-oid="rf3m7th">
                                {t('subscription.deliveryHistory')}
                            </h5>
                            {subscription.deliveryHistory &&
                            subscription.deliveryHistory.length > 0 ? (
                                <div className="space-y-3" data-oid="g05utl1">
                                    {subscription.deliveryHistory.slice(0, 5).map((delivery) => (
                                        <div
                                            key={delivery.id}
                                            className="flex justify-between items-center text-sm bg-white p-3 rounded-lg"
                                            data-oid="n-y33j6"
                                        >
                                            <span className="text-gray-600" data-oid=".-8fh5g">
                                                {formatDate(delivery.deliveryDate)}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}
                                                data-oid="cz2fz0j"
                                            >
                                                {t(
                                                    `subscription.deliveryStatus.${delivery.status}`,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                    {subscription.deliveryHistory.length > 5 && (
                                        <p
                                            className="text-xs text-gray-500 text-center"
                                            data-oid="ywk._0d"
                                        >
                                            {t('subscription.moreDeliveries', {
                                                count: subscription.deliveryHistory.length - 5,
                                            })}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500" data-oid="echk6zv">
                                    {t('subscription.noDeliveries')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-b-3xl"
                    data-oid="4xbhuht"
                >
                    <div className="flex justify-center" data-oid="akrzsf.">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            data-oid="0zv.9o9"
                        >
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Use portal to render modal at document body level
    return createPortal(modalContent, document.body);
}
