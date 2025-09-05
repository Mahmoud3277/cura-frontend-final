'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Subscription } from '@/lib/types';
import { products } from '@/lib/data/products';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { SubscriptionDetailsModal } from './SubscriptionDetailsModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubscriptionCardProps {
    subscription: Subscription;
    onResume: (subscriptionId: string) => void;
    onCancel: (subscriptionId: string, reason?: string) => void;
}

export function SubscriptionCard({ subscription, onResume, onCancel }: SubscriptionCardProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const getSubscriptionProducts = () => {
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
        if (!subscription.nextDelivery) return null;
        const today = new Date();
        const nextDelivery = new Date(subscription.nextDelivery);
        const diffTime = nextDelivery.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const subscriptionProducts = getSubscriptionProducts();
    const plan = subscription.planId
        ? subscriptionService.getSubscriptionPlan(subscription.planId)
        : null;
    const daysUntilDelivery = getDaysUntilDelivery();

    const subscriptionIndex = 1; // This would be passed as prop in real implementation

    // Mobile Layout
    if (isMobile) {
        return (
            <div className="relative" data-oid="mobile-subscription-card">
                {/* Mobile Subscription Number Badge */}
                <div className="absolute -top-2 left-3 z-10" data-oid="mobile-badge">
                    <span
                        className="bg-[#1F1F6F] text-white px-2 py-1 rounded-full text-xs font-semibold"
                        data-oid="piwza-l"
                    >
                        Subscription #{subscriptionIndex}
                    </span>
                </div>

                {/* Mobile Subscription Card */}
                <div
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-4 relative"
                    data-oid="ga_1mwi"
                >
                    {/* Mobile Header */}
                    <div className="flex items-start justify-between mb-3 pt-2" data-oid="t_lqpm-">
                        <div className="flex items-center space-x-3" data-oid="gr:mkia">
                            <div
                                className="w-10 h-10 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-lg flex items-center justify-center"
                                data-oid="ad0zeb4"
                            >
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="laxj-jy"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        data-oid="ik4wek1"
                                    />
                                </svg>
                            </div>
                            <div data-oid="dlsliuk">
                                <h3 className="text-sm font-bold text-gray-900" data-oid="zhem_3s">
                                    {subscription.id}
                                </h3>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}
                                    data-oid="8llu:5k"
                                >
                                    {t(`subscription.status.${subscription.status}`)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Frequency */}
                    <div className="mb-3" data-oid="7pazn42">
                        <span className="text-xs text-gray-600" data-oid="ud7o:q0">
                            <strong data-oid="t9me6vk">{t('subscription.frequency.label')}:</strong>{' '}
                            {getFrequencyText(subscription.frequency)}
                        </span>
                    </div>

                    {/* Mobile Next Delivery Info */}
                    {subscription.status === 'active' && subscription.nextDelivery && (
                        <div
                            className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3"
                            data-oid="vpjtk3g"
                        >
                            <p
                                className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1"
                                data-oid="mxui0vx"
                            >
                                {t('subscription.nextDelivery')}
                            </p>
                            <p className="text-sm text-blue-700 font-medium" data-oid="9prrzwc">
                                {formatDate(subscription.nextDelivery)}
                                {daysUntilDelivery !== null && (
                                    <span className="ml-1 text-xs" data-oid="ue:h1f-">
                                        (
                                        {daysUntilDelivery > 0
                                            ? t('subscription.inDays', { days: daysUntilDelivery })
                                            : daysUntilDelivery === 0
                                              ? t('subscription.today')
                                              : t('subscription.overdue')}
                                        )
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-blue-600 mt-1" data-oid="f40d31x">
                                {subscription.deliveryAddress}
                            </p>
                        </div>
                    )}

                    {/* Mobile Products List */}
                    <div className="mb-3" data-oid="1nrrve_">
                        <h4
                            className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2"
                            data-oid="uyjzqeo"
                        >
                            {t('subscription.products')} ({subscriptionProducts.length})
                        </h4>
                        <div className="space-y-2" data-oid="b.b9pt-">
                            {subscriptionProducts.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                                    data-oid="1ythaw-"
                                >
                                    <div
                                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200"
                                        data-oid="7l651uk"
                                    >
                                        <img
                                            src={item.product!.image}
                                            alt={item.product!.name}
                                            className="w-6 h-6 object-contain rounded"
                                            data-oid="q9vf0dk"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0" data-oid="ytotjba">
                                        <p
                                            className="text-sm font-semibold text-gray-900 truncate"
                                            data-oid="83wlt1n"
                                        >
                                            {locale === 'ar'
                                                ? item.product!.nameAr
                                                : item.product!.name}
                                        </p>
                                        <p className="text-xs text-gray-600" data-oid="--znrpp">
                                            {locale === 'ar'
                                                ? item.product!.pharmacyAr
                                                : item.product!.pharmacy}
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="w.vk370">
                                            Quantity: {item.quantity}{' '}
                                            {item.quantity > 1 ? 'units' : 'unit'}
                                        </p>
                                    </div>
                                    <div className="text-right" data-oid="207o9k0">
                                        <p
                                            className="text-sm font-bold text-[#1F1F6F]"
                                            data-oid="w:g1e.g"
                                        >
                                            {item.product!.price.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="tpmmopm">
                                            {t('common.currency')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Footer */}
                    <div className="border-t border-gray-200 pt-3" data-oid="byyry5t">
                        <div className="flex items-center justify-between mb-3" data-oid="y52._lj">
                            <div data-oid="h36o4fb">
                                <p className="text-xs text-gray-600" data-oid="w1zz55p">
                                    {subscription.status === 'active' ? 'Next delivery' : 'Status'}
                                </p>
                                <p className="text-xs text-gray-800 font-medium" data-oid="i43k2z:">
                                    {subscription.status === 'active'
                                        ? formatDate(subscription.nextDelivery!)
                                        : t(`subscription.status.${subscription.status}`)}
                                </p>
                            </div>
                            <div className="text-right" data-oid="vago25n">
                                <p className="text-lg font-bold text-[#1F1F6F]" data-oid="i0az.xp">
                                    {subscription.totalAmount.toFixed(2)} {t('common.currency')}
                                </p>
                            </div>
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className="flex gap-2" data-oid="q8iifhf">
                            <button
                                onClick={() => setShowDetailsModal(true)}
                                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-xs font-semibold"
                                data-oid="5ys86m0"
                            >
                                {t('subscription.viewDetails')}
                            </button>
                            {subscription.status === 'active' && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="flex-1 px-3 py-2 bg-[#394867] text-white rounded-lg hover:bg-[#14274E] transition-all text-xs font-semibold"
                                    data-oid="ra7-0v6"
                                >
                                    {t('subscription.cancel')}
                                </button>
                            )}
                            {subscription.status === 'paused' && (
                                <button
                                    onClick={() => onResume(subscription.id)}
                                    className="flex-1 px-3 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-all text-xs font-semibold"
                                    data-oid="1yqcj0v"
                                >
                                    {t('subscription.resume')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Subscription Details Modal */}
                <SubscriptionDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    subscription={subscription}
                    data-oid="6q74o9o"
                />

                {/* Mobile Cancel Modal */}
                {showCancelModal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        data-oid="ki631df"
                    >
                        <div className="bg-white rounded-xl p-4 w-full max-w-sm" data-oid="v.f-453">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-3"
                                data-oid="pokn79o"
                            >
                                {t('subscription.cancelModal.title')}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3" data-oid="okirr43">
                                {t('subscription.cancelModal.description')}
                            </p>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder={t('subscription.cancelModal.reasonPlaceholder')}
                                className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
                                rows={3}
                                data-oid="boorw9h"
                            />

                            <div className="flex gap-2 mt-4" data-oid="-8ipxww">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
                                    data-oid="aokjudq"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={() => {
                                        onCancel(subscription.id, cancelReason);
                                        setShowCancelModal(false);
                                        setCancelReason('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-[#394867] text-white rounded-lg hover:bg-[#14274E] transition-all text-sm font-semibold"
                                    data-oid="c_yitdi"
                                >
                                    {t('subscription.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Desktop Layout (unchanged)
    return (
        <div className="relative" data-oid="ty2k_2b">
            {/* Subscription Number Badge */}
            <div className="absolute -top-3 left-6 z-10" data-oid="o:p1ix6">
                <span
                    className="bg-[#1F1F6F] text-white px-3 py-1 rounded-full text-xs font-semibold"
                    data-oid="tfxuzn0"
                >
                    Subscription #{subscriptionIndex}
                </span>
            </div>

            {/* Subscription Card */}
            <div
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl hover:border-[#1F1F6F]/20 transition-all duration-300 relative"
                data-oid="txj23-y"
            >
                {/* Decorative Corner */}
                <div
                    className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#1F1F6F]/10 to-transparent rounded-tr-2xl"
                    data-oid="17hzi.w"
                ></div>

                {/* Subscription Header */}
                <div
                    className="flex items-center justify-between mb-6 relative z-10"
                    data-oid="ov:76ad"
                >
                    <div className="flex items-center space-x-4" data-oid="q6kb7:.">
                        <div
                            className="w-14 h-14 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-xl flex items-center justify-center shadow-lg"
                            data-oid="emwpf7h"
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="aoikzxl"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    data-oid="6pyr0ll"
                                />
                            </svg>
                        </div>
                        <div data-oid="0r:z1q_">
                            <div className="flex items-center space-x-2 mb-1" data-oid="r2kmtby">
                                <h3 className="text-xl font-bold text-gray-900" data-oid="0u46ohz">
                                    {subscription.id}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}
                                    data-oid="d_pegvk"
                                >
                                    {t(`subscription.status.${subscription.status}`)}
                                </span>
                            </div>
                            <div
                                className="flex flex-wrap items-center gap-4 text-sm text-gray-600"
                                data-oid="-i7yce-"
                            >
                                <span data-oid="v01xt5.">
                                    <strong data-oid="-ry1wj_">
                                        {t('subscription.frequency.label')}:
                                    </strong>{' '}
                                    {getFrequencyText(subscription.frequency)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator Line */}
                <div
                    className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"
                    data-oid="ygq630a"
                ></div>

                {/* Next Delivery Info */}
                {subscription.status === 'active' && subscription.nextDelivery && (
                    <div
                        className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 mb-6"
                        data-oid="j_s2fhg"
                    >
                        <div className="flex items-center justify-between" data-oid="aflgvaf">
                            <div data-oid="twc8b01">
                                <p
                                    className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-1"
                                    data-oid=".czad:-"
                                >
                                    {t('subscription.nextDelivery')}
                                </p>
                                <p className="text-blue-700 font-medium" data-oid="w_8d82:">
                                    {formatDate(subscription.nextDelivery)}
                                    {daysUntilDelivery !== null && (
                                        <span className="ml-2 text-sm" data-oid="zkls5p4">
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
                            <div className="text-right" data-oid="aoy2-k_">
                                <p
                                    className="text-sm text-blue-600 font-semibold"
                                    data-oid="e0u9c98"
                                >
                                    {t('subscription.deliveryAddress')}
                                </p>
                                <p className="text-sm text-blue-800 font-medium" data-oid="ywmdo:v">
                                    {subscription.deliveryAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products List */}
                <div className="space-y-4 mb-6" data-oid="emjvgyv">
                    <h4
                        className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3"
                        data-oid=":9bryed"
                    >
                        {t('subscription.products')} ({subscriptionProducts.length})
                    </h4>
                    {subscriptionProducts.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200"
                            data-oid=":88p2__"
                        >
                            <div
                                className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-200"
                                data-oid="ydbz1fz"
                            >
                                <img
                                    src={item.product!.images && item.product!.images.length > 0 ? item.product!.images[0].url : item.product!.image}
                                    alt={item.product!.name}
                                    className="w-10 h-10 object-contain rounded-lg"
                                    data-oid="ut3hco3"
                                />
                            </div>
                            <div className="flex-1" data-oid="oia4zcu">
                                <p
                                    className="font-semibold text-gray-900 text-lg"
                                    data-oid="fjmq_o:"
                                >
                                    {locale === 'ar' ? item.product!.nameAr : item.product!.name}
                                </p>
                                <p className="text-sm text-gray-600 font-medium" data-oid=":.tuuko">
                                    {locale === 'ar'
                                        ? item.product!.pharmacyAr
                                        : item.product!.pharmacy}{' '}
                                    • Quantity: {item.quantity}{' '}
                                    {item.quantity > 1 ? 'units' : 'unit'}
                                </p>
                            </div>
                            <div className="text-right" data-oid="8.f3zfj">
                                <p className="text-lg font-bold text-[#1F1F6F]" data-oid="fx7a:kt">
                                    {item.product!.price.toFixed(2)} {t('common.currency')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Separator Line */}
                <div
                    className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"
                    data-oid="_p6zs.b"
                ></div>

                {/* Subscription Footer */}
                <div className="flex items-center justify-between" data-oid="-sxyvx4">
                    <div data-oid="q0lfsr4">
                        <p className="text-sm text-gray-600 mb-2" data-oid="re.2jnr">
                            {subscription.status === 'active' ? 'Next delivery' : 'Status'}:{' '}
                            {subscription.status === 'active'
                                ? formatDate(subscription.nextDelivery!)
                                : t(`subscription.status.${subscription.status}`)}
                        </p>
                        <p className="text-2xl font-bold text-[#1F1F6F]" data-oid="64qyey0">
                            Total: {subscription.totalAmount.toFixed(2)} {t('common.currency')}
                        </p>
                    </div>
                    <div className="flex space-x-3" data-oid="nykk78:">
                        <button
                            onClick={() => setShowDetailsModal(true)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-semibold"
                            data-oid="7kqkb.q"
                        >
                            {t('subscription.viewDetails')}
                        </button>
                        {subscription.status === 'active' && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="px-6 py-3 bg-[#394867] text-white rounded-xl hover:bg-[#14274E] transition-all text-sm font-semibold shadow-lg"
                                data-oid="p:sbmus"
                            >
                                {t('subscription.cancel')}
                            </button>
                        )}
                        {subscription.status === 'paused' && (
                            <button
                                onClick={() => onResume(subscription.id)}
                                className="px-6 py-3 bg-[#1F1F6F] text-white rounded-xl hover:bg-[#14274E] transition-all text-sm font-semibold shadow-lg"
                                data-oid=".ip9bov"
                            >
                                {t('subscription.resume')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Subscription Details Modal */}
            <SubscriptionDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                subscription={subscription}
                data-oid="2ghka6:"
            />

            {/* Cancel Modal */}
            {showCancelModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="jclds4j"
                >
                    <div
                        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                        data-oid="l9u7ox:"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="c59t_i8">
                            {t('subscription.cancelModal.title')}
                        </h3>
                        <p className="text-gray-600 mb-4" data-oid="tigxl1z">
                            {t('subscription.cancelModal.description')}
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder={t('subscription.cancelModal.reasonPlaceholder')}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                            rows={3}
                            data-oid="l:tq3y_"
                        />

                        <div className="flex gap-3 mt-6" data-oid="4hceqip">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-semibold"
                                data-oid="wkxci3j"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    onCancel(subscription.id, cancelReason);
                                    setShowCancelModal(false);
                                    setCancelReason('');
                                }}
                                className="flex-1 px-6 py-3 bg-[#394867] text-white rounded-xl hover:bg-[#14274E] transition-all text-sm font-semibold shadow-lg"
                                data-oid="sz_40vj"
                            >
                                {t('subscription.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
