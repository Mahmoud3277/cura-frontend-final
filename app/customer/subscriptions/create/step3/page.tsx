'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { subscriptionService } from '@/lib/services/subscriptionService';
import Link from 'next/link';

interface DeliveryAddress {
    firstName: string;
    lastName: string;
    phone: string;
    whatsapp?: string;
    governorate: string;
    city: string;
    area: string;
    street: string;
    building: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    notes?: string;
}

export default function CreateSubscriptionStep3() {
    const router = useRouter();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'>(
        'monthly',
    );
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
        firstName: '',
        lastName: '',
        phone: '',
        whatsapp: '',
        governorate: '',
        city: '',
        area: '',
        street: '',
        building: '',
        floor: '',
        apartment: '',
        landmark: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(true);

    useEffect(() => {
        let savedStep1Data, savedStep2Data;
        // Load saved data from previous steps
        if (typeof window !== 'undefined') {
            savedStep1Data = localStorage.getItem('subscription_step1_data');
            savedStep2Data = localStorage.getItem('subscription_step2_data');
        }

        if (!savedStep1Data || !savedStep2Data) {
            router.push('/customer/subscriptions/create/step1');
            return;
        }

        try {
            const step1Data = JSON.parse(savedStep1Data);
            const step2Data = JSON.parse(savedStep2Data);

            setSelectedProducts(step1Data.selectedProducts || []);
            setSelectedPlan(step2Data.selectedPlan);
        } catch (error) {
            console.error('Error loading saved data:', error);
            router.push('/customer/subscriptions/create/step1');
        }

        // Load saved step 3 data
        const savedStep3Data = localStorage.getItem('subscription_step3_data');
        if (savedStep3Data) {
            try {
                const data = JSON.parse(savedStep3Data);
                if (data.deliveryAddress) {
                    setDeliveryAddress(data.deliveryAddress);
                }
                if (data.frequency) {
                    setFrequency(data.frequency);
                }
            } catch (error) {
                console.error('Error loading step 3 data:', error);
            }
        }
    }, [router]);

    // Save data to localStorage whenever data changes
    useEffect(() => {
        const dataToSave = {
            deliveryAddress,
            frequency,
        };
        if (typeof window !== 'undefined') {
            localStorage.setItem('subscription_step3_data', JSON.stringify(dataToSave));
        }
    }, [deliveryAddress, frequency]);

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

    const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
        setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
    };

    const validateAddress = (): boolean => {
        return !!(
            deliveryAddress.firstName &&
            deliveryAddress.lastName &&
            deliveryAddress.phone &&
            deliveryAddress.whatsapp &&
            deliveryAddress.governorate &&
            deliveryAddress.city &&
            deliveryAddress.area &&
            deliveryAddress.street &&
            deliveryAddress.building
        );
    };

    const handleCreateSubscription = async () => {
        if (selectedProducts.length === 0 || !validateAddress()) {
            return;
        }

        setLoading(true);

        try {
            const addressString = `${deliveryAddress.building} ${deliveryAddress.street}, ${deliveryAddress.area}, ${deliveryAddress.city}, ${deliveryAddress.governorate}`;
            await subscriptionService.createSubscription({
                customerId: 'customer-001', // This should come from auth context
                products: selectedProducts.map((item) => ({
                    productId: item.productId,
                    pharmacyId: item.pharmacyId,
                    quantity: item.quantity,
                    unitType: item.unitType,
                })),
                frequency,
                deliveryAddress: addressString,
                deliveryInstructions: undefined,
            });

            // Clear saved data
            if (typeof window !== 'undefined') {

                localStorage.removeItem('subscription_step1_data');
                localStorage.removeItem('subscription_step2_data');
                localStorage.removeItem('subscription_step3_data');
            }

            // Redirect to success page or subscriptions list
            router.push('/customer/subscriptions?success=true');
        } catch (error) {
            console.error('Error creating subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        router.push('/customer/subscriptions/create/step2');
    };

    const orderSummary = calculateOrderSummary();

    return (
        <div className="min-h-screen bg-gray-50" data-oid="vlby:l0">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10" data-oid="qixi0rc">
                <div className="flex items-center justify-between px-4 py-3" data-oid="k9jbg.l">
                    <div className="flex items-center space-x-3" data-oid="w.qnyci">
                        <button
                            onClick={handlePrevious}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            data-oid="566o2g3"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="ym2e03p"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                    data-oid="mj8qkrd"
                                />
                            </svg>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900" data-oid="87f1xj3">
                            {t('subscription.create.title')}
                        </h1>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center px-4 pb-3" data-oid="yvsybsh">
                    {[
                        { number: 1, label: t('subscription.create.step1') },
                        { number: 2, label: t('subscription.create.choosePlan') },
                        { number: 3, label: t('subscription.create.confirmOrder') },
                    ].map((stepInfo, index) => (
                        <div key={stepInfo.number} className="flex items-center" data-oid="0_oez03">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    3 >= stepInfo.number
                                        ? 'bg-[#1F1F6F] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                                data-oid="z0rzi35"
                            >
                                {stepInfo.number}
                            </div>
                            <span
                                className={`ml-1 text-xs ${
                                    3 >= stepInfo.number
                                        ? 'text-[#1F1F6F] font-medium'
                                        : 'text-gray-500'
                                }`}
                                data-oid="82w19w5"
                            >
                                {stepInfo.label}
                            </span>
                            {index < 2 && (
                                <div
                                    className={`w-6 h-0.5 mx-2 ${
                                        3 > stepInfo.number ? 'bg-[#1F1F6F]' : 'bg-gray-200'
                                    }`}
                                    data-oid="mjxh257"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-24" data-oid="mxm3:nm">
                <div className="space-y-4" data-oid=".:7m0sv">
                    <h3 className="text-base font-semibold text-gray-900 mb-4" data-oid="m5ijl:3">
                        {t('subscription.create.confirmOrder')}
                    </h3>

                    {/* Delivery Address */}
                    <div
                        className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
                        data-oid="8-c7th:"
                    >
                        <h4
                            className="text-base font-semibold text-gray-900 mb-4"
                            data-oid="4wc2iws"
                        >
                            {t('subscription.create.deliveryAddress')}
                        </h4>

                        <div className="grid grid-cols-1 gap-3" data-oid="p6vj75f">
                            <div data-oid="xck:5dt">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="p.5gp6:"
                                >
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={deliveryAddress.firstName}
                                    onChange={(e) =>
                                        handleAddressChange('firstName', e.target.value)
                                    }
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="Enter first name"
                                    data-oid="n8skw:y"
                                />
                            </div>
                            <div data-oid="b2cqm2t">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="bd-:r21"
                                >
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={deliveryAddress.lastName}
                                    onChange={(e) =>
                                        handleAddressChange('lastName', e.target.value)
                                    }
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="Enter last name"
                                    data-oid="-fzq50-"
                                />
                            </div>
                            <div data-oid="5-:6y:4">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="ccu8q-u"
                                >
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    value={deliveryAddress.phone}
                                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="+20 1XX XXX XXXX"
                                    data-oid="b71gst."
                                />
                            </div>
                            <div data-oid="oeesr6l">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="h8veq_6"
                                >
                                    WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    value={deliveryAddress.whatsapp}
                                    onChange={(e) =>
                                        handleAddressChange('whatsapp', e.target.value)
                                    }
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="+20 1XX XXX XXXX"
                                    data-oid="qcp39xz"
                                />
                            </div>
                            <div data-oid="n95e9wr">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="a.s96og"
                                >
                                    Governorate *
                                </label>
                                <select
                                    value={deliveryAddress.governorate}
                                    onChange={(e) =>
                                        handleAddressChange('governorate', e.target.value)
                                    }
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    data-oid="4d20pej"
                                >
                                    <option value="" data-oid="59byv7v">
                                        Select Governorate
                                    </option>
                                    <option value="Ismailia" data-oid="184robr">
                                        Ismailia
                                    </option>
                                    <option value="Cairo" data-oid="972tegb">
                                        Cairo
                                    </option>
                                    <option value="Alexandria" data-oid=":j:z.5n">
                                        Alexandria
                                    </option>
                                    <option value="Giza" data-oid="x5k8c14">
                                        Giza
                                    </option>
                                </select>
                            </div>
                            <div data-oid=".d_tee3">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="pp6n05_"
                                >
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={deliveryAddress.city}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="Enter city"
                                    data-oid="nrabv7."
                                />
                            </div>
                            <div data-oid="mxt.y2x">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="xaanehc"
                                >
                                    Area *
                                </label>
                                <input
                                    type="text"
                                    value={deliveryAddress.area}
                                    onChange={(e) => handleAddressChange('area', e.target.value)}
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="Enter area"
                                    data-oid="ww51qc."
                                />
                            </div>
                            <div data-oid="e0xos-y">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="jrv9su:"
                                >
                                    Street *
                                </label>
                                <input
                                    type="text"
                                    value={deliveryAddress.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="Enter street"
                                    data-oid="9m5-j-h"
                                />
                            </div>
                            <div data-oid="a_mk7d:">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="1wpaewe"
                                >
                                    Building *
                                </label>
                                <input
                                    type="text"
                                    value={deliveryAddress.building}
                                    onChange={(e) =>
                                        handleAddressChange('building', e.target.value)
                                    }
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="Building number"
                                    data-oid="zmg10wx"
                                />
                            </div>
                            <div data-oid="sl3v7-.">
                                <label
                                    className="block text-xs font-medium text-gray-700 mb-1"
                                    data-oid="kx46:p:"
                                >
                                    Floor (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={deliveryAddress.floor || ''}
                                    onChange={(e) => handleAddressChange('floor', e.target.value)}
                                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                    placeholder="Floor number"
                                    data-oid="8m7e3yd"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Final Summary */}
                    <div className="bg-blue-50 rounded-lg p-3 mt-4" data-oid="70boc_w">
                        <h4 className="text-sm font-medium text-blue-900 mb-3" data-oid="0gj847m">
                            Summary
                        </h4>
                        <div className="space-y-2 text-xs text-blue-800" data-oid="0_0vm-0">
                            <div className="flex justify-between" data-oid="_bvuu9w">
                                <span data-oid="u8fdiyk">Products:</span>
                                <span data-oid="27rtf7b">{selectedProducts.length} items</span>
                            </div>
                            <div className="flex justify-between" data-oid="lz.gtrm">
                                <span data-oid="dwikv3f">Frequency:</span>
                                <span data-oid="9ln_njj">Monthly</span>
                            </div>
                            <div className="flex justify-between" data-oid="t8jm7ty">
                                <span data-oid="gw52-s1">Total to pay:</span>
                                <span className="font-medium" data-oid="n325p74">
                                    {orderSummary.finalTotal.toFixed(2)} EGP
                                </span>
                            </div>
                            {selectedPlan && (
                                <>
                                    <div className="flex justify-between" data-oid="ldz4xlk">
                                        <span data-oid="j1f3b0n">Plan:</span>
                                        <span data-oid="r.guy9k">
                                            {locale === 'ar'
                                                ? selectedPlan.nameAr
                                                : selectedPlan.name}
                                        </span>
                                    </div>
                                    {orderSummary.totalSavings > 0 && (
                                        <div
                                            className="flex justify-between text-green-600"
                                            data-oid="ve2r9wm"
                                        >
                                            <span data-oid="2xf9-4c">Monthly savings:</span>
                                            <span data-oid="m7hkcof">
                                                +{orderSummary.totalSavings.toFixed(2)} EGP
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3"
                data-oid="n1ssndj"
            >
                <div className="flex gap-2" data-oid="pv7v:nw">
                    <button
                        onClick={handlePrevious}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        data-oid="qjw4663"
                    >
                        {t('subscription.create.previous')}
                    </button>
                    <button
                        onClick={handleCreateSubscription}
                        disabled={loading || selectedProducts.length === 0 || !validateAddress()}
                        className="flex-1 px-4 py-2.5 text-sm bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="8iorae-"
                    >
                        {loading
                            ? t('subscription.create.creating')
                            : t('subscription.create.create')}
                    </button>
                </div>
            </div>
        </div>
    );
}
