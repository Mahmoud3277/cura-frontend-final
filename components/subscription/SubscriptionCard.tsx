'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Subscription } from '@/lib/types';
import { filterProducts } from '@/lib/data/products';
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
    const [plan, setPlan] = useState<any>(null);

    // Map subscription products - they should already be populated from backend
    const subscriptionProducts = subscription.products.map((subProduct) => ({
        ...subProduct,
        product: typeof subProduct.productId === 'object' ? subProduct.productId : null,
    })).filter((item) => item.product);
    console.log(subscriptionProducts, 'subscriptionProducts')
    useEffect(() => {
        const loadPlan = async () => {
            if (subscription.planId && typeof subscription.planId === 'string') {
                const subscriptionPlan = await subscriptionService.getSubscriptionPlan(subscription.planId);
                setPlan(subscriptionPlan);
            } else if (typeof subscription.planId === 'object') {
                setPlan(subscription.planId);
            }
        };
        loadPlan();
    }, [subscription.planId]);

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleCancelSubmit = () => {
        onCancel(subscription.id || subscription._id || '', cancelReason);
        setShowCancelModal(false);
        setCancelReason('');
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                {/* Desktop Layout */}
                {!isMobile ? (
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#1F1F6F] to-[#2D2D8F] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {subscription.products.length}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {t('subscription.title')} #{(subscription.id || subscription._id)?.slice(-6)}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {plan?.name || t('subscription.plan.loading')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                    {t(`subscription.status.${subscription.status}`)}
                                </span>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                {t('subscription.products')} ({subscriptionProducts.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {subscriptionProducts.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                            <img
                                                src={item.product!.images?.[0]?.url || item.product!.image || '/placeholder-medicine.png'}
                                                alt={item.product!.name}
                                                className="w-8 h-8 object-contain rounded"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {locale === 'ar' ? item.product!.nameAr : item.product!.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {item.product!.manufacturer || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#1F1F6F]">
                                                {item.product!.pricePerBox ? (item.product!.pricePerBox * item.quantity).toFixed(2) : 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.product!.pricePerBox ? t('common.currency') : 'Price'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                                <p className="text-sm text-gray-600">
                                    {subscription.status === 'active' ? 'Next delivery' : 'Status'}
                                </p>
                                <p className="text-sm text-gray-800 font-medium">
                                    {subscription.status === 'active'
                                        ? formatDate(subscription.nextDelivery!.toString())
                                        : t(`subscription.status.${subscription.status}`)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowDetailsModal(true)}
                                    className="px-4 py-2 text-sm font-medium text-[#1F1F6F] bg-[#1F1F6F]/10 rounded-lg hover:bg-[#1F1F6F]/20 transition-colors"
                                >
                                    {t('common.viewDetails')}
                                </button>
                                {subscription.status === 'active' && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        {t('subscription.cancel')}
                                    </button>
                                )}
                                {subscription.status === 'paused' && (
                                    <button
                                        onClick={() => onResume(subscription.id || subscription._id || '')}
                                        className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        {t('subscription.resume')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Mobile Layout */
                    <div className="p-4">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#1F1F6F] to-[#2D2D8F] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {subscription.products.length}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {t('subscription.title')} #{(subscription.id || subscription._id)?.slice(-6)}
                                    </h3>
                                    <p className="text-xs text-gray-600">
                                        {plan?.name || t('subscription.plan.loading')}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                {t(`subscription.status.${subscription.status}`)}
                            </span>
                        </div>

                        {/* Mobile Products List */}
                        <div className="mb-3">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                {t('subscription.products')} ({subscriptionProducts.length})
                            </h4>
                            <div className="space-y-2">
                                {subscriptionProducts.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                            <img
                                                src={item.product!.images?.[0]?.url || item.product!.image || '/placeholder-medicine.png'}
                                                alt={item.product!.name}
                                                className="w-6 h-6 object-contain rounded"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {locale === 'ar' ? item.product!.nameAr : item.product!.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {item.product!.manufacturer || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Quantity: {item.quantity} {item.quantity > 1 ? 'units' : 'unit'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#1F1F6F]">
                                                {item.product!.price?.toFixed(2) || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.product!.price ? t('common.currency') : 'Price'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Footer */}
                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-xs text-gray-600">
                                        {subscription.status === 'active' ? 'Next delivery' : 'Status'}
                                    </p>
                                    <p className="text-xs text-gray-800 font-medium">
                                        {subscription.status === 'active'
                                            ? formatDate(subscription.nextDelivery!.toString())
                                            : t(`subscription.status.${subscription.status}`)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#1F1F6F]">
                                        {subscription.totalAmount?.toFixed(2) || '0.00'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t('common.currency')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setShowDetailsModal(true)}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-[#1F1F6F] bg-[#1F1F6F]/10 rounded-lg hover:bg-[#1F1F6F]/20 transition-colors"
                                >
                                    {t('common.viewDetails')}
                                </button>
                                {subscription.status === 'active' && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        {t('subscription.cancel')}
                                    </button>
                                )}
                                {subscription.status === 'paused' && (
                                    <button
                                        onClick={() => onResume(subscription.id || subscription._id || '')}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        {t('subscription.resume')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showDetailsModal && (
                <SubscriptionDetailsModal
                    isOpen={showDetailsModal}
                    subscription={subscription}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}

            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('subscription.cancelConfirm')}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {t('subscription.cancelDescription')}
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder={t('subscription.cancelReason')}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none mb-4"
                            rows={3}
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleCancelSubmit}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {t('subscription.confirmCancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
