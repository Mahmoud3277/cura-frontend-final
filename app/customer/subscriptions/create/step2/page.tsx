'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { subscriptionService, SubscriptionPlan } from '@/lib/services/subscriptionService';
import Link from 'next/link';

export default function CreateSubscriptionStep2() {
    const router = useRouter();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load saved data from step 1
        let savedStep1Data;
        if (typeof window !== 'undefined') {
            savedStep1Data = localStorage.getItem('subscription_step1_data');
        }
        if (savedStep1Data) {
            try {
                const data = JSON.parse(savedStep1Data);
                setSelectedProducts(data.selectedProducts || []);
            } catch (error) {
                console.error('Error loading step 1 data:', error);
                router.push('/customer/subscriptions/create/step1');
                return;
            }
        } else {
            router.push('/customer/subscriptions/create/step1');
            return;
        }

        // Load saved data from step 2
        const savedStep2Data = localStorage.getItem('subscription_step2_data');
        if (savedStep2Data) {
            try {
                const data = JSON.parse(savedStep2Data);
                if (data.selectedPlan) {
                    setSelectedPlan(data.selectedPlan);
                }
            } catch (error) {
                console.error('Error loading step 2 data:', error);
            }
        }

        // Load plans
        loadPlans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // Save data to localStorage whenever selectedPlan changes
    useEffect(() => {
        if (selectedPlan) {
            const dataToSave = {
                selectedPlan,
            };
            if (typeof window !== 'undefined') {
                localStorage.setItem('subscription_step2_data', JSON.stringify(dataToSave));
            }
        }
    }, [selectedPlan]);

    const loadPlans = async () => {
        try {
            const subscriptionPlans = subscriptionService.getSubscriptionPlans();
            setPlans(subscriptionPlans);

            // Auto-select plan based on order value if none selected
            if (!selectedPlan && selectedProducts.length > 0) {
                const subtotal = selectedProducts.reduce((sum, item) => {
                    const unitPrice =
                        item.unitType === 'blister' &&
                        ['otc', 'prescription'].includes(item.product.category)
                            ? item.product.price * 0.4
                            : item.product.price;
                    return sum + unitPrice * item.quantity;
                }, 0);

                const availablePlan = subscriptionPlans.find(
                    (plan) => subtotal >= plan.minOrderValue,
                );
                if (availablePlan) {
                    setSelectedPlan(availablePlan);
                }
            }
        } catch (error) {
            console.error('Error loading plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOrderSummary = () => {
        const subtotal = selectedProducts.reduce((sum, item) => {
            const unitPrice =
                item.unitType === 'blister' &&
                ['otc', 'prescription'].includes(item.product.category)
                    ? item.product.price * 0.4
                    : item.product.price;
            return sum + unitPrice * item.quantity;
        }, 0);

        const totalMedicineCount = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
        const medicineDiscount = selectedPlan
            ? selectedPlan.medicineDiscount * totalMedicineCount
            : 0;
        const orderDiscount = selectedPlan ? selectedPlan.orderDiscount : 0;
        const monthlyFee = selectedPlan ? selectedPlan.monthlyFee : 0;
        const finalTotal = subtotal - orderDiscount + monthlyFee;
        const totalSavings = orderDiscount - monthlyFee;

        return {
            subtotal,
            orderDiscount,
            monthlyFee,
            finalTotal,
            totalSavings,
        };
    };

    const handleNext = () => {
        if (selectedPlan) {
            router.push('/customer/subscriptions/create/step3');
        }
    };

    const handlePrevious = () => {
        router.push('/customer/subscriptions/create/step1');
    };

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="a0z8lto"
            >
                <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F1F6F]"
                    data-oid="znp.xwf"
                ></div>
                <span className="ml-2 text-gray-600" data-oid="blxhcyr">
                    Loading plans...
                </span>
            </div>
        );
    }

    const orderSummary = calculateOrderSummary();

    return (
        <div className="min-h-screen bg-gray-50" data-oid="t671rw_">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10" data-oid=".r90gln">
                <div className="flex items-center justify-between px-4 py-3" data-oid="ozi7r2y">
                    <div className="flex items-center space-x-3" data-oid="wooa7cz">
                        <button
                            onClick={handlePrevious}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            data-oid="8u6u1os"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="kbtyu7l"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                    data-oid="k::kahr"
                                />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900" data-oid="8fukxj:">
                            {t('subscription.create.title')}
                        </h1>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center px-4 pb-3" data-oid="xy660op">
                    {[
                        { number: 1, label: t('subscription.create.step1') },
                        { number: 2, label: t('subscription.create.choosePlan') },
                        { number: 3, label: t('subscription.create.confirmOrder') },
                    ].map((stepInfo, index) => (
                        <div key={stepInfo.number} className="flex items-center" data-oid="ol2_iqz">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    2 >= stepInfo.number
                                        ? 'bg-[#1F1F6F] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                                data-oid="kqh9y3j"
                            >
                                {stepInfo.number}
                            </div>
                            <span
                                className={`ml-1 text-xs ${
                                    2 >= stepInfo.number
                                        ? 'text-[#1F1F6F] font-medium'
                                        : 'text-gray-500'
                                }`}
                                data-oid="pi0hu5h"
                            >
                                {stepInfo.label}
                            </span>
                            {index < 2 && (
                                <div
                                    className={`w-6 h-0.5 mx-2 ${
                                        2 > stepInfo.number ? 'bg-[#1F1F6F]' : 'bg-gray-200'
                                    }`}
                                    data-oid="kpoltzp"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-24" data-oid="pun7dv3">
                <div className="space-y-4" data-oid="hmkid:6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4" data-oid="no_tq2d">
                        {t('subscription.create.choosePlan')}
                    </h3>

                    {/* Plan Selection */}
                    <div className="grid grid-cols-1 gap-4 mb-6" data-oid="_03nq.2">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                    selectedPlan?.id === plan.id
                                        ? 'border-[#1F1F6F] bg-blue-50 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                                onClick={() => setSelectedPlan(plan)}
                                data-oid="tn0lf_z"
                            >
                                {plan.isPopular && (
                                    <div
                                        className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                                        data-oid="j76mysi"
                                    >
                                        <span
                                            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium"
                                            data-oid="9ow6yrf"
                                        >
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-3" data-oid="ekezp7t">
                                    <h4
                                        className="text-lg font-bold text-gray-900 mb-2"
                                        data-oid="0sot6yt"
                                    >
                                        {locale === 'ar' ? plan.nameAr : plan.name}
                                    </h4>
                                    <p className="text-gray-600 text-xs" data-oid="ejesrfc">
                                        {locale === 'ar' ? plan.descriptionAr : plan.description}
                                    </p>
                                </div>

                                {/* Pricing Display */}
                                <div
                                    className="text-center mb-3 p-3 bg-white rounded-lg border"
                                    data-oid="bf5ns_m"
                                >
                                    <div
                                        className="text-2xl font-bold text-[#1F1F6F] mb-1"
                                        data-oid="ahs9wuk"
                                    >
                                        {plan.monthlyFee} EGP
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2" data-oid="kwkzu:5">
                                        Monthly fee
                                    </div>
                                    <div
                                        className="text-sm font-semibold text-green-600"
                                        data-oid="8--d1e1"
                                    >
                                        Save {plan.medicineDiscount} EGP per medicine
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-1 mb-3" data-oid="p15ub.b">
                                    {(locale === 'ar' ? plan.featuresAr : plan.features)
                                        .slice(0, 3)
                                        .map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2 text-xs text-gray-600"
                                                data-oid="g4im2r3"
                                            >
                                                <svg
                                                    className="w-3 h-3 text-green-500 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    data-oid="9q2fo3h"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                        data-oid="b:gd-pj"
                                                    />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                </ul>

                                {/* Medicine Guarantee */}
                                <div
                                    className="bg-green-50 border border-green-200 rounded-lg p-2 mt-3"
                                    data-oid="u19g2we"
                                >
                                    <div
                                        className="flex items-center gap-1 text-green-800"
                                        data-oid="lcze-z0"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="zj2x:mv"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="8wh3bh:"
                                            />
                                        </svg>
                                        <span className="text-xs font-medium" data-oid="tpnxd1:">
                                            Medicine Guarantee
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-700 mt-1" data-oid="n8vw6.b">
                                        CURA will provide exact medicine or call for alternatives.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-3 mt-4" data-oid="zossp3c">
                        <h4 className="text-sm font-medium text-gray-900 mb-3" data-oid="dgmftvs">
                            {t('subscription.create.orderSummary')}
                        </h4>
                        <div className="space-y-2 text-xs" data-oid="4tmqzw9">
                            <div className="flex justify-between" data-oid="upnwv5c">
                                <span data-oid="vd842al">Medicine cost:</span>
                                <span data-oid="yc:_cfy">
                                    {orderSummary.subtotal.toFixed(2)} EGP
                                </span>
                            </div>
                            {selectedPlan && (
                                <>
                                    <div
                                        className="flex justify-between text-green-600"
                                        data-oid="5bk8wyt"
                                    >
                                        <span data-oid="u:5rq_p">Order discount:</span>
                                        <span data-oid="quo1gjv">
                                            -{orderSummary.orderDiscount.toFixed(2)} EGP
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between text-gray-600"
                                        data-oid="yz806op"
                                    >
                                        <span data-oid="n4xjidy">Subscription fee:</span>
                                        <span data-oid="m24iz:y">
                                            +{orderSummary.monthlyFee.toFixed(2)} EGP
                                        </span>
                                    </div>
                                </>
                            )}
                            <div
                                className="flex justify-between font-medium text-lg border-t pt-2"
                                data-oid="qjnwsi_"
                            >
                                <span data-oid="u7thi9k">Total to pay:</span>
                                <span data-oid="dfxqu..">
                                    {orderSummary.finalTotal.toFixed(2)} EGP
                                </span>
                            </div>
                            {selectedPlan && orderSummary.totalSavings > 0 && (
                                <div
                                    className="bg-green-100 rounded-lg p-2 mt-2"
                                    data-oid="mwh3b7a"
                                >
                                    <div
                                        className="flex justify-between text-green-800 font-medium"
                                        data-oid="-i:2r7n"
                                    >
                                        <span data-oid="vipnk4d">You save this month:</span>
                                        <span data-oid="88hxbeq">
                                            {orderSummary.totalSavings.toFixed(2)} EGP
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3"
                data-oid=".tzyie-"
            >
                <div className="flex gap-2" data-oid="cfq8:c8">
                    <button
                        onClick={handlePrevious}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        data-oid="xi1qkok"
                    >
                        {t('subscription.create.previous')}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!selectedPlan}
                        className="flex-1 px-4 py-2.5 text-sm bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="iq.5ztv"
                    >
                        {t('subscription.create.next')}
                    </button>
                </div>
            </div>
        </div>
    );
}
