'use client';

import { useState, useEffect } from 'react';
import { subscriptionService, SubscriptionPlan } from '@/lib/services/subscriptionService';
import { products } from '@/lib/data/products';

interface MedicineAvailabilityUpdate {
    productId: string;
    isAvailable: boolean;
    alternativeProductId?: string;
    priceChange?: number;
    reason?: string;
}

export function SubscriptionManagement() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [medicineUpdates, setMedicineUpdates] = useState<MedicineAvailabilityUpdate[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [showPlanEditor, setShowPlanEditor] = useState(false);
    const [showMedicineManager, setShowMedicineManager] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setPlans(subscriptionService.getSubscriptionPlans());
        setSubscriptions(subscriptionService.getAllSubscriptions());
    };

    const updatePlanPricing = async (planId: string, updates: Partial<SubscriptionPlan>) => {
        // In a real app, this would call an API
        const updatedPlans = plans.map((plan) =>
            plan.id === planId ? { ...plan, ...updates } : plan,
        );
        setPlans(updatedPlans);

        // Update all active subscriptions with this plan
        const affectedSubscriptions = subscriptions.filter(
            (sub) => sub.planId === planId && sub.isActive,
        );
        for (const subscription of affectedSubscriptions) {
            await subscriptionService.updateSubscription(subscription.id, {
                totalAmount: calculateNewSubscriptionTotal(subscription, updates),
            });
        }

        alert(`Updated ${affectedSubscriptions.length} active subscriptions with new pricing`);
        loadData();
    };

    const calculateNewSubscriptionTotal = (
        subscription: any,
        planUpdates: Partial<SubscriptionPlan>,
    ) => {
        const totalMedicines = subscription.products.reduce(
            (sum: number, product: any) => sum + product.quantity,
            0,
        );
        const medicinesCost = subscription.products.reduce((sum: number, product: any) => {
            const productData = products.find((p) => p.id.toString() === product.productId);
            return sum + (productData?.price || 0) * product.quantity;
        }, 0);

        const medicineDiscount = (planUpdates.medicineDiscount || 0) * totalMedicines;
        const monthlyFee = planUpdates.monthlyFee || 0;

        return medicinesCost - medicineDiscount + monthlyFee;
    };

    const handleMedicineAvailabilityUpdate = async (update: MedicineAvailabilityUpdate) => {
        // Find all subscriptions that contain this medicine
        const affectedSubscriptions = subscriptions.filter(
            (sub) =>
                sub.isActive && sub.products.some((p: any) => p.productId === update.productId),
        );

        if (!update.isAvailable) {
            // Medicine is not available - notify customers and offer alternatives
            for (const subscription of affectedSubscriptions) {
                // In a real app, this would send notifications to customers
                console.log(
                    `Notifying customer ${subscription.customerId} about unavailable medicine ${update.productId}`,
                );

                if (update.alternativeProductId) {
                    // Update subscription with alternative medicine
                    const updatedProducts = subscription.products.map((p: any) =>
                        p.productId === update.productId
                            ? { ...p, productId: update.alternativeProductId }
                            : p,
                    );

                    await subscriptionService.updateSubscription(subscription.id, {
                        products: updatedProducts,
                    });
                }
            }
        }

        if (update.priceChange) {
            // Medicine price changed - update all affected subscriptions
            for (const subscription of affectedSubscriptions) {
                const newTotal = calculateNewSubscriptionTotal(
                    subscription,
                    plans.find((p) => p.id === subscription.planId) || {},
                );

                await subscriptionService.updateSubscription(subscription.id, {
                    totalAmount: newTotal,
                });
            }
        }

        setMedicineUpdates([...medicineUpdates, update]);
        alert(
            `Updated ${affectedSubscriptions.length} subscriptions for medicine availability/price change`,
        );
        loadData();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
                    <p className="text-gray-600">
                        Manage subscription plans, pricing, and medicine availability
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowPlanEditor(true)}
                        className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                    >
                        Edit Plans
                    </button>
                    <button
                        onClick={() => setShowMedicineManager(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Manage Medicines
                    </button>
                </div>
            </div>

            {/* Current Plans Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                <p className="text-gray-600 text-sm">{plan.description}</p>
                            </div>
                            {plan.isPopular && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Popular
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Fee:</span>
                                <span className="font-medium">{plan.monthlyFee} EGP</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Medicine Discount:</span>
                                <span className="font-medium text-green-600">
                                    {plan.medicineDiscount} EGP per medicine
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Min Order Value:</span>
                                <span className="font-medium">{plan.minOrderValue} EGP</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedPlan(plan);
                                setShowPlanEditor(true);
                            }}
                            className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Edit Plan
                        </button>
                    </div>
                ))}
            </div>

            {/* Active Subscriptions Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Subscriptions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[#1F1F6F]">
                            {subscriptions.filter((s) => s.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Total Active</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {
                                subscriptions.filter(
                                    (s) => s.planId === 'smart-bundle' && s.isActive,
                                ).length
                            }
                        </div>
                        <div className="text-sm text-gray-600">Smart Bundle</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {
                                subscriptions.filter(
                                    (s) => s.planId === 'premium-plan' && s.isActive,
                                ).length
                            }
                        </div>
                        <div className="text-sm text-gray-600">Premium Plan</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {subscriptions
                                .reduce((sum, s) => (s.isActive ? sum + s.totalAmount : sum), 0)
                                .toFixed(0)}{' '}
                            EGP
                        </div>
                        <div className="text-sm text-gray-600">Monthly Revenue</div>
                    </div>
                </div>
            </div>

            {/* Plan Editor Modal */}
            {showPlanEditor && selectedPlan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Edit {selectedPlan.name}
                        </h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const updates = {
                                    monthlyFee: Number(formData.get('monthlyFee')),
                                    medicineDiscount: Number(formData.get('medicineDiscount')),
                                    minOrderValue: Number(formData.get('minOrderValue')),
                                };
                                updatePlanPricing(selectedPlan.id, updates);
                                setShowPlanEditor(false);
                                setSelectedPlan(null);
                            }}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Fee (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        name="monthlyFee"
                                        defaultValue={selectedPlan.monthlyFee}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Discount (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        name="orderDiscount"
                                        defaultValue={selectedPlan.orderDiscount}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Order Value (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        name="minOrderValue"
                                        defaultValue={selectedPlan.minOrderValue}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPlanEditor(false);
                                        setSelectedPlan(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                >
                                    Update Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Medicine Manager Modal */}
            {showMedicineManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Medicine Availability Manager
                        </h3>

                        <div className="space-y-4">
                            {products.slice(0, 10).map((product) => (
                                <div
                                    key={product.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                {product.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {product.price} EGP
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.availability.inStock
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {product.availability.inStock
                                                ? 'In Stock'
                                                : 'Out of Stock'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleMedicineAvailabilityUpdate({
                                                    productId: product.id.toString(),
                                                    isAvailable: false,
                                                    reason: 'Out of stock',
                                                })
                                            }
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                                        >
                                            Mark Unavailable
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleMedicineAvailabilityUpdate({
                                                    productId: product.id.toString(),
                                                    isAvailable: true,
                                                    priceChange: 5, // Example price increase
                                                })
                                            }
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                                        >
                                            Update Price (+5 EGP)
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleMedicineAvailabilityUpdate({
                                                    productId: product.id.toString(),
                                                    isAvailable: false,
                                                    alternativeProductId: products
                                                        .find((p) => p.id !== product.id)
                                                        ?.id.toString(),
                                                })
                                            }
                                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors"
                                        >
                                            Offer Alternative
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowMedicineManager(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
('use client');

import { useState, useEffect } from 'react';
import { subscriptionService, SubscriptionPlan } from '@/lib/services/subscriptionService';
import { products } from '@/lib/data/products';

interface MedicineAvailabilityUpdate {
    productId: string;
    isAvailable: boolean;
    alternativeProductId?: string;
    priceChange?: number;
    reason?: string;
}

export function SubscriptionManagement() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [medicineUpdates, setMedicineUpdates] = useState<MedicineAvailabilityUpdate[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [showPlanEditor, setShowPlanEditor] = useState(false);
    const [showMedicineManager, setShowMedicineManager] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setPlans(subscriptionService.getSubscriptionPlans());
        setSubscriptions(subscriptionService.getAllSubscriptions());
    };

    const updatePlanPricing = async (planId: string, updates: Partial<SubscriptionPlan>) => {
        // In a real app, this would call an API
        const updatedPlans = plans.map((plan) =>
            plan.id === planId ? { ...plan, ...updates } : plan,
        );
        setPlans(updatedPlans);

        // Update all active subscriptions with this plan
        const affectedSubscriptions = subscriptions.filter(
            (sub) => sub.planId === planId && sub.isActive,
        );
        for (const subscription of affectedSubscriptions) {
            await subscriptionService.updateSubscription(subscription.id, {
                totalAmount: calculateNewSubscriptionTotal(subscription, updates),
            });
        }

        alert(`Updated ${affectedSubscriptions.length} active subscriptions with new pricing`);
        loadData();
    };

    const calculateNewSubscriptionTotal = (
        subscription: any,
        planUpdates: Partial<SubscriptionPlan>,
    ) => {
        const totalMedicines = subscription.products.reduce(
            (sum: number, product: any) => sum + product.quantity,
            0,
        );
        const medicinesCost = subscription.products.reduce((sum: number, product: any) => {
            const productData = products.find((p) => p.id.toString() === product.productId);
            return sum + (productData?.price || 0) * product.quantity;
        }, 0);

        const medicineDiscount = (planUpdates.medicineDiscount || 0) * totalMedicines;
        const monthlyFee = planUpdates.monthlyFee || 0;

        return medicinesCost - medicineDiscount + monthlyFee;
    };

    const handleMedicineAvailabilityUpdate = async (update: MedicineAvailabilityUpdate) => {
        // Find all subscriptions that contain this medicine
        const affectedSubscriptions = subscriptions.filter(
            (sub) =>
                sub.isActive && sub.products.some((p: any) => p.productId === update.productId),
        );

        if (!update.isAvailable) {
            // Medicine is not available - notify customers and offer alternatives
            for (const subscription of affectedSubscriptions) {
                // In a real app, this would send notifications to customers
                console.log(
                    `Notifying customer ${subscription.customerId} about unavailable medicine ${update.productId}`,
                );

                if (update.alternativeProductId) {
                    // Update subscription with alternative medicine
                    const updatedProducts = subscription.products.map((p: any) =>
                        p.productId === update.productId
                            ? { ...p, productId: update.alternativeProductId }
                            : p,
                    );

                    await subscriptionService.updateSubscription(subscription.id, {
                        products: updatedProducts,
                    });
                }
            }
        }

        if (update.priceChange) {
            // Medicine price changed - update all affected subscriptions
            for (const subscription of affectedSubscriptions) {
                const newTotal = calculateNewSubscriptionTotal(
                    subscription,
                    plans.find((p) => p.id === subscription.planId) || {},
                );

                await subscriptionService.updateSubscription(subscription.id, {
                    totalAmount: newTotal,
                });
            }
        }

        setMedicineUpdates([...medicineUpdates, update]);
        alert(
            `Updated ${affectedSubscriptions.length} subscriptions for medicine availability/price change`,
        );
        loadData();
    };

    return (
        <div className="space-y-6" data-oid="iig90cl">
            {/* Header */}
            <div className="flex justify-between items-center" data-oid="u_7uoa-">
                <div data-oid="bnpm_:t">
                    <h2 className="text-2xl font-bold text-gray-900" data-oid="8ez:kvz">
                        Subscription Management
                    </h2>
                    <p className="text-gray-600" data-oid="2wl0nwt">
                        Manage subscription plans, pricing, and medicine availability
                    </p>
                </div>
                <div className="flex gap-3" data-oid="3ut7x9x">
                    <button
                        onClick={() => setShowPlanEditor(true)}
                        className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                        data-oid="er:z_51"
                    >
                        Edit Plans
                    </button>
                    <button
                        onClick={() => setShowMedicineManager(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        data-oid="kta:7rm"
                    >
                        Manage Medicines
                    </button>
                </div>
            </div>

            {/* Current Plans Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="2vo85-3">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-white rounded-lg border border-gray-200 p-6"
                        data-oid="j.iyxnb"
                    >
                        <div className="flex justify-between items-start mb-4" data-oid=":swt.fp">
                            <div data-oid="2r1qhp.">
                                <h3
                                    className="text-lg font-semibold text-gray-900"
                                    data-oid="yjmx:ms"
                                >
                                    {plan.name}
                                </h3>
                                <p className="text-gray-600 text-sm" data-oid="klaw.ry">
                                    {plan.description}
                                </p>
                            </div>
                            {plan.isPopular && (
                                <span
                                    className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
                                    data-oid="s:zo723"
                                >
                                    Popular
                                </span>
                            )}
                        </div>

                        <div className="space-y-3" data-oid="blypjqc">
                            <div className="flex justify-between" data-oid="94twxe.">
                                <span className="text-gray-600" data-oid="1-:un2m">
                                    Monthly Fee:
                                </span>
                                <span className="font-medium" data-oid="854d8.f">
                                    {plan.monthlyFee} EGP
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="xuyw31z">
                                <span className="text-gray-600" data-oid="8ag5s9r">
                                    Medicine Discount:
                                </span>
                                <span className="font-medium text-green-600" data-oid=".fj:cf2">
                                    {plan.medicineDiscount} EGP per medicine
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="xyj:sjo">
                                <span className="text-gray-600" data-oid="gcswv.8">
                                    Min Order Value:
                                </span>
                                <span className="font-medium" data-oid="-mms9gf">
                                    {plan.minOrderValue} EGP
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedPlan(plan);
                                setShowPlanEditor(true);
                            }}
                            className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            data-oid=".5w9hv6"
                        >
                            Edit Plan
                        </button>
                    </div>
                ))}
            </div>

            {/* Active Subscriptions Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6" data-oid="xk:0rof">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="pt3.pvc">
                    Active Subscriptions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-oid=".uwd5-8">
                    <div className="text-center" data-oid="x0hnfwh">
                        <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="52.m:ny">
                            {subscriptions.filter((s) => s.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="zpcv--n">
                            Total Active
                        </div>
                    </div>
                    <div className="text-center" data-oid="mbz1ris">
                        <div className="text-2xl font-bold text-green-600" data-oid="tfd-0qc">
                            {
                                subscriptions.filter(
                                    (s) => s.planId === 'smart-bundle' && s.isActive,
                                ).length
                            }
                        </div>
                        <div className="text-sm text-gray-600" data-oid="nmhb46y">
                            Smart Bundle
                        </div>
                    </div>
                    <div className="text-center" data-oid="dq37jsf">
                        <div className="text-2xl font-bold text-purple-600" data-oid="ualt46w">
                            {
                                subscriptions.filter(
                                    (s) => s.planId === 'premium-plan' && s.isActive,
                                ).length
                            }
                        </div>
                        <div className="text-sm text-gray-600" data-oid="abgdez2">
                            Premium Plan
                        </div>
                    </div>
                    <div className="text-center" data-oid="8c2kc:z">
                        <div className="text-2xl font-bold text-orange-600" data-oid="ksrk45t">
                            {subscriptions
                                .reduce((sum, s) => (s.isActive ? sum + s.totalAmount : sum), 0)
                                .toFixed(0)}{' '}
                            EGP
                        </div>
                        <div className="text-sm text-gray-600" data-oid="l_2:y90">
                            Monthly Revenue
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Editor Modal */}
            {showPlanEditor && selectedPlan && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="fnvifd6"
                >
                    <div
                        className="bg-white rounded-xl max-w-md w-full mx-4 p-6"
                        data-oid="vn712w."
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="qc7d7lo">
                            Edit {selectedPlan.name}
                        </h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const updates = {
                                    monthlyFee: Number(formData.get('monthlyFee')),
                                    medicineDiscount: Number(formData.get('medicineDiscount')),
                                    minOrderValue: Number(formData.get('minOrderValue')),
                                };
                                updatePlanPricing(selectedPlan.id, updates);
                                setShowPlanEditor(false);
                                setSelectedPlan(null);
                            }}
                            data-oid="omxtn9:"
                        >
                            <div className="space-y-4" data-oid="ifk5raj">
                                <div data-oid="kxf07en">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="agol3ih"
                                    >
                                        Monthly Fee (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        name="monthlyFee"
                                        defaultValue={selectedPlan.monthlyFee}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        data-oid="puctkfz"
                                    />
                                </div>

                                <div data-oid="t5j.w9s">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="p_ngoj."
                                    >
                                        Medicine Discount per Item (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        name="medicineDiscount"
                                        defaultValue={selectedPlan.medicineDiscount}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        data-oid="y:f-hq-"
                                    />
                                </div>

                                <div data-oid="n3-pg1o">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="rinfpsb"
                                    >
                                        Minimum Order Value (EGP)
                                    </label>
                                    <input
                                        type="number"
                                        name="minOrderValue"
                                        defaultValue={selectedPlan.minOrderValue}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        data-oid="jthks6x"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6" data-oid="kihdhnc">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPlanEditor(false);
                                        setSelectedPlan(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    data-oid="8oh-:.v"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                    data-oid="yjjy8ld"
                                >
                                    Update Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Medicine Manager Modal */}
            {showMedicineManager && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="13z_ses"
                >
                    <div
                        className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-y-auto"
                        data-oid="mdnbqkp"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="2.p5vgs">
                            Medicine Availability Manager
                        </h3>

                        <div className="space-y-4" data-oid="l5zcje3">
                            {products.slice(0, 10).map((product) => (
                                <div
                                    key={product.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                    data-oid="v9dft5x"
                                >
                                    <div
                                        className="flex justify-between items-start mb-3"
                                        data-oid="qncn1:x"
                                    >
                                        <div data-oid="8ap:-x2">
                                            <h4
                                                className="font-medium text-gray-900"
                                                data-oid=".njo__c"
                                            >
                                                {product.name}
                                            </h4>
                                            <p className="text-sm text-gray-600" data-oid="8b8lcz2">
                                                {product.price} EGP
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.availability.inStock
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                            data-oid="0:x0i46"
                                        >
                                            {product.availability.inStock
                                                ? 'In Stock'
                                                : 'Out of Stock'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2" data-oid="by:xr6t">
                                        <button
                                            onClick={() =>
                                                handleMedicineAvailabilityUpdate({
                                                    productId: product.id.toString(),
                                                    isAvailable: false,
                                                    reason: 'Out of stock',
                                                })
                                            }
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                                            data-oid="ivpeo7_"
                                        >
                                            Mark Unavailable
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleMedicineAvailabilityUpdate({
                                                    productId: product.id.toString(),
                                                    isAvailable: true,
                                                    priceChange: 5, // Example price increase
                                                })
                                            }
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                                            data-oid="9xeljv:"
                                        >
                                            Update Price (+5 EGP)
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleMedicineAvailabilityUpdate({
                                                    productId: product.id.toString(),
                                                    isAvailable: false,
                                                    alternativeProductId: products
                                                        .find((p) => p.id !== product.id)
                                                        ?.id.toString(),
                                                })
                                            }
                                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors"
                                            data-oid="gkct69z"
                                        >
                                            Offer Alternative
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-6" data-oid="jfrim7g">
                            <button
                                onClick={() => setShowMedicineManager(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                data-oid="7-yop_g"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
