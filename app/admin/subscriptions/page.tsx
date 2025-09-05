'use client';

import { useState, useEffect } from 'react';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { pharmacies } from '@/lib/data/pharmacies';
import { products } from '@/lib/data/products';
import { SubscriptionDetailsModal } from '@/components/admin/SubscriptionDetailsModal';
import { EnhancedPharmacySelector } from '@/components/admin/EnhancedPharmacySelector';

interface Subscription {
    id: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    products: Array<{
        productId: string;
        pharmacyId: string;
        quantity: number;
        unitType: string;
    }>;
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
    nextDelivery: Date;
    isActive: boolean;
    totalAmount: number;
    deliveryAddress: string;
    status: 'active' | 'paused' | 'cancelled';
    planId?: string;
    createdAt: Date;
    deliveryHistory?: Array<{
        id: string;
        deliveryDate: Date;
        status: string;
        trackingNumber?: string;
        deliveredBy?: string;
    }>;
}

interface OrderPlacementModal {
    subscription: Subscription | null;
    isOpen: boolean;
}

interface DetailsModal {
    subscription: Subscription | null;
    isOpen: boolean;
}

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>(
        'all',
    );
    const [orderModal, setOrderModal] = useState<OrderPlacementModal>({
        subscription: null,
        isOpen: false,
    });
    const [detailsModal, setDetailsModal] = useState<DetailsModal>({
        subscription: null,
        isOpen: false,
    });
    const [selectedPharmacy, setSelectedPharmacy] = useState('');
    const [orderNotes, setOrderNotes] = useState('');
    const [placingOrder, setPlacingOrder] = useState(false);
    const [deliveryType, setDeliveryType] = useState<'customer' | 'custom'>('customer');
    const [customAddress, setCustomAddress] = useState('');
    const [productPharmacies, setProductPharmacies] = useState<Record<string, string>>({});

    useEffect(() => {
        loadSubscriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        filterSubscriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscriptions, searchTerm, statusFilter]);

    const calculateNextDelivery = (frequency: string, lastDelivery?: Date) => {
        const baseDate = lastDelivery || new Date();
        const nextDelivery = new Date(baseDate);

        switch (frequency) {
            case 'weekly':
                nextDelivery.setDate(nextDelivery.getDate() + 7);
                break;
            case 'bi-weekly':
                nextDelivery.setDate(nextDelivery.getDate() + 14);
                break;
            case 'monthly':
                nextDelivery.setMonth(nextDelivery.getMonth() + 1);
                break;
            case 'quarterly':
                nextDelivery.setMonth(nextDelivery.getMonth() + 3);
                break;
            default:
                nextDelivery.setMonth(nextDelivery.getMonth() + 1);
        }

        return nextDelivery;
    };

    const loadSubscriptions = async () => {
        try {
            setLoading(true);
            // Get all subscriptions from service
            const allSubscriptions = subscriptionService.getAllSubscriptions();

            // Add mock customer data and enhanced delivery calculations
            const subscriptionsWithCustomers = allSubscriptions.map((sub) => {
                // Calculate accurate next delivery based on frequency and last delivery
                const lastDeliveryDate =
                    sub.deliveryHistory && sub.deliveryHistory.length > 0
                        ? new Date(sub.deliveryHistory[sub.deliveryHistory.length - 1].deliveryDate)
                        : sub.createdAt;

                const accurateNextDelivery = calculateNextDelivery(sub.frequency, lastDeliveryDate);

                return {
                    ...sub,
                    customerName: `Customer ${sub.customerId.split('-')[1]}`,
                    customerPhone: `+20 10 ${Math.floor(Math.random() * 90000000) + 10000000}`,
                    nextDelivery: accurateNextDelivery,
                    deliveryHistory: sub.deliveryHistory || [],
                };
            });

            // Sort by next delivery date (closest first)
            subscriptionsWithCustomers.sort(
                (a, b) => new Date(a.nextDelivery).getTime() - new Date(b.nextDelivery).getTime(),
            );

            setSubscriptions(subscriptionsWithCustomers);
        } catch (error) {
            console.error('Error loading subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterSubscriptions = () => {
        let filtered = subscriptions;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (sub) =>
                    sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.customerPhone.includes(searchTerm),
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((sub) => sub.status === statusFilter);
        }

        setFilteredSubscriptions(filtered);
    };

    const handlePlaceOrder = async () => {
        if (!orderModal.subscription) return;

        // Validate that all products have pharmacies selected
        const allProductsHavePharmacies = orderModal.subscription.products.every(
            (product, index) => productPharmacies[`${product.productId}-${index}`],
        );

        if (!allProductsHavePharmacies) {
            alert('Please select a pharmacy for each product.');
            return;
        }

        // Validate delivery address
        if (deliveryType === 'custom' && !customAddress.trim()) {
            alert('Please enter a custom delivery address.');
            return;
        }

        setPlacingOrder(true);
        try {
            // Simulate API call to place order
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Update subscription's next delivery date
            const updatedSubscriptions = subscriptions.map((sub) => {
                if (sub.id === orderModal.subscription!.id) {
                    // Calculate next delivery based on current delivery date
                    const currentDeliveryDate = new Date();
                    const nextDelivery = calculateNextDelivery(sub.frequency, currentDeliveryDate);

                    // Create delivery address
                    const deliveryAddress =
                        deliveryType === 'customer' ? sub.deliveryAddress : customAddress;

                    // Add to delivery history
                    const newDelivery = {
                        id: `DEL-${Date.now()}`,
                        deliveryDate: currentDeliveryDate,
                        status: 'ordered',
                        trackingNumber: `TRK-${Date.now()}`,
                        deliveredBy: 'Multiple Pharmacies',
                        deliveryAddress: deliveryAddress,
                        notes: orderNotes,
                    };

                    return {
                        ...sub,
                        nextDelivery,
                        deliveryHistory: [...(sub.deliveryHistory || []), newDelivery],
                    };
                }
                return sub;
            });

            setSubscriptions(updatedSubscriptions);
            setOrderModal({ subscription: null, isOpen: false });
            setSelectedPharmacy('');
            setOrderNotes('');
            setDeliveryType('customer');
            setCustomAddress('');
            setProductPharmacies({});

            alert('Order placed successfully! All pharmacies have been notified.');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleUpdateSubscriptionStatus = async (
        subscriptionId: string,
        status: 'active' | 'paused' | 'cancelled',
    ) => {
        try {
            // Update subscription status
            const updatedSubscriptions = subscriptions.map((sub) => {
                if (sub.id === subscriptionId) {
                    return {
                        ...sub,
                        status,
                        isActive: status === 'active',
                        updatedAt: new Date(),
                    };
                }
                return sub;
            });

            setSubscriptions(updatedSubscriptions);

            // Close the details modal
            setDetailsModal({ subscription: null, isOpen: false });

            alert(`Subscription ${status} successfully!`);
        } catch (error) {
            console.error('Error updating subscription status:', error);
            alert('Failed to update subscription status. Please try again.');
        }
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
        switch (frequency) {
            case 'weekly':
                return 'Weekly';
            case 'bi-weekly':
                return 'Bi-weekly';
            case 'monthly':
                return 'Monthly';
            case 'quarterly':
                return 'Quarterly';
            default:
                return frequency;
        }
    };

    const getDaysUntilDelivery = (deliveryDate: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        const delivery = new Date(deliveryDate);
        delivery.setHours(0, 0, 0, 0);
        const diffTime = delivery.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getUrgencyColor = (daysUntil: number) => {
        if (daysUntil < 0) return 'text-red-700 font-bold'; // Overdue
        if (daysUntil === 0) return 'text-red-600 font-bold'; // Today
        if (daysUntil <= 2) return 'text-orange-600 font-semibold'; // Within 2 days
        if (daysUntil <= 7) return 'text-yellow-600 font-medium'; // Within a week
        return 'text-gray-600';
    };

    const getUrgencyBadge = (daysUntil: number) => {
        if (daysUntil < 0)
            return { text: 'OVERDUE', class: 'bg-red-100 text-red-800 border-red-200' };
        if (daysUntil === 0)
            return { text: 'TODAY', class: 'bg-red-100 text-red-800 border-red-200' };
        if (daysUntil === 1)
            return { text: 'TOMORROW', class: 'bg-orange-100 text-orange-800 border-orange-200' };
        if (daysUntil <= 3)
            return { text: 'URGENT', class: 'bg-orange-100 text-orange-800 border-orange-200' };
        if (daysUntil <= 7)
            return { text: 'SOON', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        return null;
    };

    const formatDeliveryDate = (date: Date, daysUntil: number) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        };

        const formattedDate = date.toLocaleDateString('en-US', options);

        if (daysUntil < 0) return `${formattedDate} (${Math.abs(daysUntil)} days overdue)`;
        if (daysUntil === 0) return `${formattedDate} (Today)`;
        if (daysUntil === 1) return `${formattedDate} (Tomorrow)`;
        return `${formattedDate} (${daysUntil} days)`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" data-oid="zh1yxa7">
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F]"
                    data-oid="m.wn1bd"
                ></div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="vp9ho2j">
            {/* Stats Cards */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                data-oid="-i4y1k4"
            >
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    data-oid="usg28xp"
                >
                    <div className="flex items-center" data-oid="m_a9q5g">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg" data-oid="adrk4wp">
                            <svg
                                className="w-6 h-6 text-[#394867]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="t-frzjb"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    data-oid=":dxr.qv"
                                />
                            </svg>
                        </div>
                        <div className="ml-4" data-oid="--57pxt">
                            <p className="text-sm font-medium text-[#9BA4B4]" data-oid=":vhh049">
                                Total Subscriptions
                            </p>
                            <p className="text-2xl font-bold text-[#14274E]" data-oid="l06lnh-">
                                {subscriptions.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    data-oid="uca1l9p"
                >
                    <div className="flex items-center" data-oid="ghl.z:u">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg" data-oid=":n1rpf7">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="87t_ys-"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="8.p0ffk"
                                />
                            </svg>
                        </div>
                        <div className="ml-4" data-oid="k2mjtym">
                            <p className="text-sm font-medium text-[#9BA4B4]" data-oid="-qszgn4">
                                Active
                            </p>
                            <p className="text-2xl font-bold text-[#14274E]" data-oid="a7l5arw">
                                {subscriptions.filter((s) => s.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    data-oid="w-kt8.7"
                >
                    <div className="flex items-center" data-oid="cvv8337">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg" data-oid="etk69zp">
                            <svg
                                className="w-6 h-6 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="g18cg70"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="5pag-t0"
                                />
                            </svg>
                        </div>
                        <div className="ml-4" data-oid="o0v_ilc">
                            <p className="text-sm font-medium text-[#9BA4B4]" data-oid="lfwyx_s">
                                Due Soon
                            </p>
                            <p className="text-2xl font-bold text-[#394867]" data-oid="4e31p:_">
                                {
                                    subscriptions.filter(
                                        (s) => getDaysUntilDelivery(s.nextDelivery) <= 3,
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    data-oid="ml4hngf"
                >
                    <div className="flex items-center" data-oid="ayvu2:f">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg" data-oid="gg-3zd_">
                            <svg
                                className="w-6 h-6 text-[#394867]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="k70-ogn"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    data-oid="-ohi1xh"
                                />
                            </svg>
                        </div>
                        <div className="ml-4" data-oid="x_ubrei">
                            <p className="text-sm font-medium text-[#9BA4B4]" data-oid="2eu8gb3">
                                Total Value
                            </p>
                            <p className="text-2xl font-bold text-[#14274E]" data-oid="iozddmu">
                                {subscriptions
                                    .reduce((sum, s) => sum + s.totalAmount, 0)
                                    .toFixed(0)}{' '}
                                EGP
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                data-oid="erkxb8g"
            >
                <div className="flex flex-col md:flex-row gap-4" data-oid="q4gapd6">
                    <div className="flex-1" data-oid="o619qs7">
                        <input
                            type="text"
                            placeholder="Search by customer name, ID, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="rqhv0sg"
                        />
                    </div>
                    <div data-oid="9e.o1cp">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="k.w1qhn"
                        >
                            <option value="all" data-oid="ttg3q0q">
                                All Status
                            </option>
                            <option value="active" data-oid=":e4_tld">
                                Active
                            </option>
                            <option value="paused" data-oid="j.wz19w">
                                Paused
                            </option>
                            <option value="cancelled" data-oid="3o6ediw">
                                Cancelled
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscriptions List */}
            <div className="space-y-4" data-oid="jl752ll">
                {filteredSubscriptions.map((subscription) => {
                    const daysUntil = getDaysUntilDelivery(subscription.nextDelivery);
                    const subscriptionProducts = subscription.products.map((p) => {
                        const product = products.find((prod) => prod.id.toString() === p.productId);
                        return { ...p, productName: product?.name || 'Unknown Product' };
                    });

                    return (
                        <div
                            key={subscription.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            data-oid="wpb1_ck"
                        >
                            <div
                                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                data-oid="eiv13bb"
                            >
                                {/* Subscription Info */}
                                <div className="flex-1" data-oid="69li5k7">
                                    <div
                                        className="flex items-center gap-3 mb-3"
                                        data-oid="ms422la"
                                    >
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="yl3amx:"
                                        >
                                            {subscription.customerName}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}
                                            data-oid="gw04b.5"
                                        >
                                            {subscription.status.charAt(0).toUpperCase() +
                                                subscription.status.slice(1)}
                                        </span>
                                        <span className="text-sm text-gray-500" data-oid="5ls.3ha">
                                            ID: {subscription.id}
                                        </span>
                                    </div>

                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm"
                                        data-oid="nvxz46c"
                                    >
                                        <div data-oid="x7df_22">
                                            <span className="text-gray-500" data-oid="kuq5y.i">
                                                Phone:
                                            </span>
                                            <div className="font-medium" data-oid="fr3hyg5">
                                                {subscription.customerPhone}
                                            </div>
                                        </div>
                                        <div data-oid="9qdu02v">
                                            <span className="text-gray-500" data-oid="9i4qo29">
                                                Frequency:
                                            </span>
                                            <div className="font-medium" data-oid="1s318jb">
                                                {getFrequencyText(subscription.frequency)}
                                            </div>
                                        </div>
                                        <div data-oid="44suh9q">
                                            <span className="text-gray-500" data-oid="r716a_1">
                                                Next Delivery:
                                            </span>
                                            <div
                                                className="flex items-center gap-2 mt-1"
                                                data-oid="xd4s2je"
                                            >
                                                <div
                                                    className={`font-medium ${getUrgencyColor(daysUntil)}`}
                                                    data-oid="mwts1.y"
                                                >
                                                    {formatDeliveryDate(
                                                        subscription.nextDelivery,
                                                        daysUntil,
                                                    )}
                                                </div>
                                                {getUrgencyBadge(daysUntil) && (
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                                            getUrgencyBadge(daysUntil)!.class
                                                        }`}
                                                        data-oid="1310yjn"
                                                    >
                                                        {getUrgencyBadge(daysUntil)!.text}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div data-oid="zslsytj">
                                            <span className="text-gray-500" data-oid="_pm7l2v">
                                                Total Amount:
                                            </span>
                                            <div
                                                className="font-medium text-[#1F1F6F]"
                                                data-oid="xl:iuv_"
                                            >
                                                {subscription.totalAmount.toFixed(2)} EGP
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div className="mt-3" data-oid="3l_5o2o">
                                        <span className="text-gray-500 text-sm" data-oid="r7x1au0">
                                            Products:
                                        </span>
                                        <div
                                            className="flex flex-wrap gap-3 mt-2"
                                            data-oid="ccuz-88"
                                        >
                                            {subscriptionProducts.map((product, index) => {
                                                const productData = products.find(
                                                    (p) => p.id.toString() === product.productId,
                                                );
                                                const unitText =
                                                    product.unitType === 'box' ? 'box' : 'blister';
                                                const packInfo = productData?.packSize || '';

                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2"
                                                        data-oid="4k.ed6i"
                                                    >
                                                        {/* Product Image */}
                                                        <div
                                                            className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden"
                                                            data-oid="3ubgpun"
                                                        >
                                                            {productData?.image ? (
                                                                <img
                                                                    src={productData.image}
                                                                    alt={productData.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display =
                                                                            'none';
                                                                        e.currentTarget.nextElementSibling.style.display =
                                                                            'flex';
                                                                    }}
                                                                    data-oid=".ok-a29"
                                                                />
                                                            ) : null}
                                                            <div
                                                                className="w-full h-full bg-gradient-to-br from-[#1F1F6F] to-[#14274E] flex items-center justify-center"
                                                                data-oid="wa8o6t1"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5 text-white"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid="-yiu:bw"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                                                        data-oid="ktsvujb"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        {/* Product Info */}
                                                        <div
                                                            className="flex-1 min-w-0"
                                                            data-oid="px-c7vk"
                                                        >
                                                            <div
                                                                className="text-sm font-medium text-gray-900 truncate"
                                                                data-oid="87vvq05"
                                                            >
                                                                {product.productName}
                                                            </div>
                                                            <div
                                                                className="text-xs text-gray-500"
                                                                data-oid="1_20s1w"
                                                            >
                                                                {product.quantity} {unitText}
                                                                {product.quantity > 1 ? 'es' : ''}
                                                                {packInfo && (
                                                                    <span
                                                                        className="ml-1"
                                                                        data-oid="voiox2n"
                                                                    >
                                                                        ({packInfo})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        {productData && (
                                                            <div
                                                                className="text-sm font-medium text-[#1F1F6F]"
                                                                data-oid="y5ei51b"
                                                            >
                                                                {(
                                                                    productData.price *
                                                                    product.quantity
                                                                ).toFixed(0)}{' '}
                                                                EGP
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="mt-2" data-oid="mb70oeb">
                                        <span className="text-gray-500 text-sm" data-oid="c706za1">
                                            Address:
                                        </span>
                                        <div className="text-sm text-gray-700" data-oid="xst0_:t">
                                            {subscription.deliveryAddress}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 lg:w-48" data-oid="1y:.59-">
                                    {subscription.status === 'active' && (
                                        <button
                                            onClick={() =>
                                                setOrderModal({ subscription, isOpen: true })
                                            }
                                            className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors font-medium"
                                            data-oid="xspw067"
                                        >
                                            Place Order
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            setDetailsModal({ subscription, isOpen: true })
                                        }
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        data-oid="x7tw:3f"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredSubscriptions.length === 0 && (
                    <div className="text-center py-12" data-oid="ji:jgyl">
                        <div className="text-gray-500 text-lg" data-oid="9vy26ay">
                            No subscriptions found
                        </div>
                        <div className="text-gray-400 text-sm mt-1" data-oid="vo45d8q">
                            Try adjusting your search or filter criteria
                        </div>
                    </div>
                )}
            </div>

            {/* Order Placement Modal */}
            {orderModal.isOpen && orderModal.subscription && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    data-oid="l4p.s68"
                >
                    <div
                        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        data-oid="2so78qk"
                    >
                        <div className="p-6" data-oid="rdaqu1h">
                            <h3 className="text-xl font-bold text-gray-900 mb-4" data-oid="37u6y2i">
                                Place Order for {orderModal.subscription.customerName}
                            </h3>

                            {/* Subscription Details */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6" data-oid="rgtpk5w">
                                <h4 className="font-semibold text-gray-900 mb-2" data-oid="rspx6jy">
                                    Subscription Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm" data-oid="0tug0.h">
                                    <div data-oid="s02tfbu">
                                        <span className="text-gray-500" data-oid="s.7whw0">
                                            Subscription ID:
                                        </span>
                                        <div className="font-medium" data-oid="2vk-v-5">
                                            {orderModal.subscription.id}
                                        </div>
                                    </div>
                                    <div data-oid="l06:mtq">
                                        <span className="text-gray-500" data-oid="c45wgws">
                                            Total Amount:
                                        </span>
                                        <div
                                            className="font-medium text-[#1F1F6F]"
                                            data-oid="23ykicl"
                                        >
                                            {orderModal.subscription.totalAmount.toFixed(2)} EGP
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products with Enhanced Pharmacy Selection */}
                            <div className="mb-6" data-oid="uqanvd6">
                                <h4 className="font-semibold text-gray-900 mb-3" data-oid="af0ygr4">
                                    Products & Pharmacy Selection
                                </h4>
                                <div className="space-y-6" data-oid="::4sdq:">
                                    {orderModal.subscription.products.map((product, index) => {
                                        const productData = products.find(
                                            (p) => p.id.toString() === product.productId,
                                        );
                                        const productKey = `${product.productId}-${index}`;

                                        const enhancedProduct = {
                                            productId: product.productId,
                                            quantity: product.quantity,
                                            unitType: product.unitType,
                                            name: productData?.name,
                                            price: productData?.price,
                                            packSize: productData?.packSize,
                                            image: productData?.image,
                                        };

                                        return (
                                            <EnhancedPharmacySelector
                                                key={index}
                                                product={enhancedProduct}
                                                productIndex={index}
                                                pharmacies={pharmacies}
                                                selectedPharmacyId={productPharmacies[productKey]}
                                                onPharmacySelect={(pharmacyId) =>
                                                    setProductPharmacies((prev) => ({
                                                        ...prev,
                                                        [productKey]: pharmacyId,
                                                    }))
                                                }
                                                data-oid="8che3ey"
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Delivery Address Selection */}
                            <div className="mb-6" data-oid="wnv:xw:">
                                <h4 className="font-semibold text-gray-900 mb-3" data-oid="d-tpxrz">
                                    Delivery Address
                                </h4>
                                <div className="space-y-3" data-oid="71d6.s6">
                                    <div className="flex gap-4" data-oid="m02w:v5">
                                        <label className="flex items-center" data-oid="qe9f2:t">
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                value="customer"
                                                checked={deliveryType === 'customer'}
                                                onChange={(e) =>
                                                    setDeliveryType(
                                                        e.target.value as 'customer' | 'custom',
                                                    )
                                                }
                                                className="mr-2"
                                                data-oid="jst744j"
                                            />
                                            Customer Address
                                        </label>
                                        <label className="flex items-center" data-oid="0ex9.4.">
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                value="custom"
                                                checked={deliveryType === 'custom'}
                                                onChange={(e) =>
                                                    setDeliveryType(
                                                        e.target.value as 'customer' | 'custom',
                                                    )
                                                }
                                                className="mr-2"
                                                data-oid="qa39it3"
                                            />
                                            Custom Address
                                        </label>
                                    </div>

                                    {deliveryType === 'customer' ? (
                                        <div
                                            className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700"
                                            data-oid="o-3q22f"
                                        >
                                            <strong data-oid="yejvbek">Customer Address:</strong>
                                            <br data-oid="7i_sn27" />
                                            {orderModal.subscription.deliveryAddress}
                                        </div>
                                    ) : (
                                        <div data-oid="um6ugrj">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="emjnmn9"
                                            >
                                                Enter Custom Delivery Address:
                                            </label>
                                            <textarea
                                                value={customAddress}
                                                onChange={(e) => setCustomAddress(e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                                placeholder="Enter the delivery address..."
                                                required={deliveryType === 'custom'}
                                                data-oid="qwfms46"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="mb-6" data-oid=":6fn:_j">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="k6bsdiv"
                                >
                                    Order Notes (Optional)
                                </label>
                                <textarea
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    placeholder="Any special instructions for the pharmacies..."
                                    data-oid="gvk:z7:"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3" data-oid="8q.s5w6">
                                <button
                                    onClick={() => {
                                        setOrderModal({ subscription: null, isOpen: false });
                                        setProductPharmacies({});
                                        setDeliveryType('customer');
                                        setCustomAddress('');
                                        setOrderNotes('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={placingOrder}
                                    data-oid="r75561d"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placingOrder}
                                    className="flex-1 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="i-97spw"
                                >
                                    {placingOrder ? (
                                        <div
                                            className="flex items-center justify-center gap-2"
                                            data-oid="c_3hldb"
                                        >
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                                                data-oid="q6j2-0z"
                                            ></div>
                                            Placing Order...
                                        </div>
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription Details Modal */}
            <SubscriptionDetailsModal
                subscription={detailsModal.subscription}
                isOpen={detailsModal.isOpen}
                onClose={() => setDetailsModal({ subscription: null, isOpen: false })}
                onUpdateStatus={handleUpdateSubscriptionStatus}
                data-oid="u443fnp"
            />
        </div>
    );
}
