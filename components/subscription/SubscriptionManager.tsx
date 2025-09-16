'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { subscriptionService, SubscriptionPlan } from '@/lib/services/subscriptionService';
import { Subscription } from '@/lib/types';
import { SubscriptionCard } from './SubscriptionCard';
import { CreateSubscriptionModal } from './CreateSubscriptionModal';
import { useRouter } from 'next/navigation';
import { SubscriptionPlansModal } from './SubscriptionPlansModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubscriptionManagerProps {
    customerId: string;
}

export function SubscriptionManager({ customerId }: SubscriptionManagerProps) {
    const { locale } = useLanguage();
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPlansModal, setShowPlansModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'cancelled'>('active');

    useEffect(() => {
        loadSubscriptions();
        loadPlans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    const loadSubscriptions = async () => {
        try {
            setLoading(true);
            console.log('Loading subscriptions for customer:', customerId);
            const customerSubscriptions = await subscriptionService.getCustomerSubscriptions(customerId);
            console.log('Loaded subscriptions:', customerSubscriptions);
            // Ensure we have an array, fallback to empty array if null/undefined
            setSubscriptions(Array.isArray(customerSubscriptions) ? customerSubscriptions : []);
        } catch (error) {
            console.error('Error loading subscriptions:', error);
            // Set empty array on error to prevent filter issues
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    const loadPlans = async () => {
        try {
            const subscriptionPlans = await subscriptionService.getSubscriptionPlans();
            // Ensure we have an array, fallback to empty array if null/undefined
            setPlans(Array.isArray(subscriptionPlans) ? subscriptionPlans : []);
        } catch (error) {
            console.error('Error loading plans:', error);
            // Set empty array on error
            setPlans([]);
        }
    };

    const handleResumeSubscription = async (subscriptionId: string) => {
        try {
            await subscriptionService.resumeSubscription(subscriptionId);
            loadSubscriptions();
        } catch (error) {
            console.error('Error resuming subscription:', error);
        }
    };

    const handleCancelSubscription = async (subscriptionId: string, reason?: string) => {
        try {
            await subscriptionService.cancelSubscription(subscriptionId, reason);
            loadSubscriptions();
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        }
    };

    const filteredSubscriptions = Array.isArray(subscriptions) ? subscriptions.filter((sub) => {
        switch (activeTab) {
            case 'active':
                return sub.isActive && sub.status === 'active';
            case 'cancelled':
                return sub.status === 'cancelled';
            default:
                return true;
        }
    }) : [];

    const getTabCount = (status: 'active' | 'cancelled') => {
        if (!Array.isArray(subscriptions)) return 0;
        return subscriptions.filter((sub) => {
            switch (status) {
                case 'active':
                    return sub.isActive && sub.status === 'active';
                case 'cancelled':
                    return sub.status === 'cancelled';
                default:
                    return false;
            }
        }).length;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12" data-oid=".05.sd6">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F1F6F]"
                    data-oid="a:37ddm"
                ></div>
                <span className="ml-2 text-gray-600" data-oid="8jewe-p">
                    {t('subscription.loading')}
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6" data-oid="hc7e_.4">
            {/* Header - Mobile Optimized */}
            <div
                className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4"
                data-oid="5g1ddzo"
            >
                <div className="hidden md:block" data-oid="7x:.16-">
                    <h2 className="text-2xl font-bold text-gray-900" data-oid="8-j8wdx">
                        {t('subscription.title') || 'My Subscriptions'}
                    </h2>
                    <p className="text-gray-600 mt-1" data-oid="uf8ifoo">
                        {t('subscription.description') ||
                            'Manage your medicine subscriptions for regular deliveries'}
                    </p>
                </div>
                <div className="flex gap-3" data-oid="5rcxhqw">
                    <button
                        onClick={() => {
                            if (isMobile) {
                                // Clear any existing subscription creation data
                                localStorage.removeItem('subscription_step1_data');
                                localStorage.removeItem('subscription_step2_data');
                                localStorage.removeItem('subscription_step3_data');
                                // Navigate to mobile flow
                                router.push('/customer/subscriptions/create/step1');
                            } else {
                                setShowCreateModal(true);
                            }
                        }}
                        className={`${
                            isMobile ? 'w-full px-4 py-2.5 text-sm' : 'w-auto px-6 py-3 text-sm'
                        } bg-[#1F1F6F] text-white rounded-xl hover:bg-[#14274E] transition-all font-semibold shadow-lg`}
                        data-oid="621cjsh"
                    >
                        {isMobile
                            ? t('subscription.createNew') || 'Create Subscription'
                            : t('subscription.createNew') || 'Create New Subscription'}
                    </button>
                </div>
            </div>

            {/* Tabs - Mobile Optimized */}
            <div className="border-b border-gray-200" data-oid="mrifa85">
                <nav className="flex space-x-4 md:space-x-8" data-oid="myf:3q-">
                    {(['active', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 md:py-4 px-1 md:px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex-1 md:flex-none ${
                                activeTab === tab
                                    ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            data-oid="m6bml26"
                        >
                            <span className="block md:inline" data-oid="nr_wd:u">
                                {t(`subscription.tabs.${tab}`)}
                            </span>
                            <span
                                className="ml-1 md:ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs"
                                data-oid="90b1wwx"
                            >
                                {getTabCount(tab)}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Subscriptions List - Mobile Optimized */}
            {filteredSubscriptions.length === 0 ? (
                <div className="text-center py-8 md:py-12" data-oid="3i5.-s3">
                    <div
                        className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                        data-oid="ekh:9h7"
                    >
                        <svg
                            className="w-6 h-6 md:w-8 md:h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="kgk.vxr"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                data-oid="ber-:d_"
                            />
                        </svg>
                    </div>
                    <h3
                        className="text-base md:text-lg font-medium text-gray-900 mb-2"
                        data-oid="rymmt8b"
                    >
                        {t(`subscription.empty.${activeTab}.title`)}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-6 px-4" data-oid="pkfgybc">
                        {t(`subscription.empty.${activeTab}.description`)}
                    </p>
                    {activeTab === 'active' && (
                        <button
                            onClick={() => {
                                if (isMobile) {
                                    // Clear any existing subscription creation data
                                    localStorage.removeItem('subscription_step1_data');
                                    localStorage.removeItem('subscription_step2_data');
                                    localStorage.removeItem('subscription_step3_data');
                                    // Navigate to mobile flow
                                    router.push('/customer/subscriptions/create/step1');
                                } else {
                                    setShowCreateModal(true);
                                }
                            }}
                            className={`${
                                isMobile
                                    ? 'w-full max-w-xs mx-auto px-4 py-2.5 text-sm'
                                    : 'w-auto px-6 py-3 text-sm'
                            } bg-[#1F1F6F] text-white rounded-xl hover:bg-[#14274E] transition-all font-semibold shadow-lg`}
                            data-oid="9..4w9u"
                        >
                            {isMobile
                                ? t('subscription.createFirst') || 'Create First'
                                : t('subscription.createFirst') || 'Create your first subscription'}
                        </button>
                    )}
                </div>
            ) : (
                <div className={`${isMobile ? 'space-y-3' : 'space-y-8'}`} data-oid="cra8yjj">
                    {filteredSubscriptions.map((subscription, index) => (
                        <div key={subscription.id} className="relative" data-oid="d.ks_zq">
                            <SubscriptionCard
                                subscription={subscription}
                                onResume={handleResumeSubscription}
                                onCancel={handleCancelSubscription}
                                data-oid="aj6vwsd"
                            />

                            {/* Bottom Separator for extra visual separation */}
                            {index < filteredSubscriptions.length - 1 && (
                                <div
                                    className={`${
                                        isMobile ? 'mt-3' : 'mt-8'
                                    } flex items-center justify-center`}
                                    data-oid="-fv_bk-"
                                >
                                    <div
                                        className={`${
                                            isMobile ? 'w-16 h-0.5' : 'w-32 h-1'
                                        } bg-gradient-to-r from-transparent via-[#1F1F6F]/20 to-transparent rounded-full`}
                                        data-oid="iicc346"
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateSubscriptionModal
                    customerId={customerId}
                    plans={plans}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        console.log('Subscription created successfully - refreshing list');
                        setShowCreateModal(false);
                        loadSubscriptions();
                    }}
                    data-oid="rl9enm7"
                />
            )}
            {showPlansModal && (
                <SubscriptionPlansModal
                    plans={plans}
                    onClose={() => setShowPlansModal(false)}
                    onSelectPlan={() => {
                        setShowPlansModal(false);
                        setShowCreateModal(true);
                    }}
                    data-oid="64-u66o"
                />
            )}
        </div>
    );
}
