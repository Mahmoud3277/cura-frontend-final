'use client';

import { useState } from 'react';
import { products } from '@/lib/data/products';
import { pharmacies } from '@/lib/data/pharmacies';

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

interface SubscriptionDetailsModalProps {
    subscription: Subscription | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (subscriptionId: string, status: 'active' | 'paused' | 'cancelled') => void;
}

export function SubscriptionDetailsModal({
    subscription,
    isOpen,
    onClose,
    onUpdateStatus,
}: SubscriptionDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'history' | 'products'>('details');

    if (!isOpen || !subscription) return null;

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

    const subscriptionProducts = subscription.products.map((p) => {
        const product = products.find((prod) => prod.id.toString() === p.productId);
        const pharmacy = pharmacies.find((pharm) => pharm.id === p.pharmacyId);
        return {
            ...p,
            productName: product?.name || 'Unknown Product',
            productPrice: product?.price || 0,
            pharmacyName: pharmacy?.name || 'Unknown Pharmacy',
        };
    });

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            data-oid="owf-5g4"
        >
            <div
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                data-oid="25yi6on"
            >
                {/* Header */}
                <div
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] p-6 text-white"
                    data-oid="fb88p9-"
                >
                    <div className="flex justify-between items-start" data-oid="22f0s2o">
                        <div data-oid="xbji_h-">
                            <h2 className="text-2xl font-bold mb-2" data-oid="_g.l2vc">
                                Subscription Details
                            </h2>
                            <div className="flex items-center gap-3" data-oid="_firnn6">
                                <span className="text-blue-100" data-oid="91r4nxu">
                                    ID: {subscription.id}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}
                                    data-oid="du:4ny7"
                                >
                                    {subscription.status.charAt(0).toUpperCase() +
                                        subscription.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                            data-oid="j2y25q1"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="t3muug4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid=".z9rl9j"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200" data-oid="g-q2tqt">
                    <nav className="flex space-x-8 px-6" data-oid="mkhckss">
                        {[
                            { id: 'details', label: 'Details' },
                            { id: 'products', label: 'Products' },
                            { id: 'history', label: 'Delivery History' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="czwl2se"
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto" data-oid="7ezm47p">
                    {activeTab === 'details' && (
                        <div className="space-y-6" data-oid="aowmxj-">
                            {/* Customer Information */}
                            <div className="bg-gray-50 rounded-lg p-4" data-oid="972xlkp">
                                <h3 className="font-semibold text-gray-900 mb-3" data-oid="06s7gub">
                                    Customer Information
                                </h3>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    data-oid="5zy4um."
                                >
                                    <div data-oid="s0ywm2y">
                                        <span className="text-gray-500 text-sm" data-oid="_oi--v2">
                                            Name:
                                        </span>
                                        <div className="font-medium" data-oid="sxg6hf5">
                                            {subscription.customerName}
                                        </div>
                                    </div>
                                    <div data-oid="13zhm1v">
                                        <span className="text-gray-500 text-sm" data-oid="sk1jdq9">
                                            Phone:
                                        </span>
                                        <div className="font-medium" data-oid="9y_sk:y">
                                            {subscription.customerPhone}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2" data-oid="vzbf4fh">
                                        <span className="text-gray-500 text-sm" data-oid="ytkndrv">
                                            Delivery Address:
                                        </span>
                                        <div className="font-medium" data-oid="3z:t1:h">
                                            {subscription.deliveryAddress}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Information */}
                            <div className="bg-gray-50 rounded-lg p-4" data-oid="1r1l50a">
                                <h3 className="font-semibold text-gray-900 mb-3" data-oid="982qa1y">
                                    Subscription Information
                                </h3>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                    data-oid="cd:eug3"
                                >
                                    <div data-oid=".grd_nr">
                                        <span className="text-gray-500 text-sm" data-oid="ds7pssq">
                                            Frequency:
                                        </span>
                                        <div className="font-medium" data-oid="vfkoyfm">
                                            {getFrequencyText(subscription.frequency)}
                                        </div>
                                    </div>
                                    <div data-oid="wjicqql">
                                        <span className="text-gray-500 text-sm" data-oid="-4vbkqb">
                                            Next Delivery:
                                        </span>
                                        <div className="font-medium" data-oid="xxhru3b">
                                            {subscription.nextDelivery.toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div data-oid="u6gl8l:">
                                        <span className="text-gray-500 text-sm" data-oid="vbb2ulz">
                                            Total Amount:
                                        </span>
                                        <div
                                            className="font-medium text-[#1F1F6F]"
                                            data-oid="mxaq5am"
                                        >
                                            {subscription.totalAmount.toFixed(2)} EGP
                                        </div>
                                    </div>
                                    <div data-oid="g92ra76">
                                        <span className="text-gray-500 text-sm" data-oid="fik-a0u">
                                            Created:
                                        </span>
                                        <div className="font-medium" data-oid="hirsis7">
                                            {subscription.createdAt.toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div data-oid="6ewnh_j">
                                        <span className="text-gray-500 text-sm" data-oid="2ictx:2">
                                            Plan ID:
                                        </span>
                                        <div className="font-medium" data-oid="bkn0i_5">
                                            {subscription.planId || 'N/A'}
                                        </div>
                                    </div>
                                    <div data-oid="-7--ki_">
                                        <span className="text-gray-500 text-sm" data-oid="67w6.3n">
                                            Status:
                                        </span>
                                        <div className="font-medium" data-oid="n8rmb8x">
                                            {subscription.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Management */}
                            <div className="bg-gray-50 rounded-lg p-4" data-oid="ft5vbid">
                                <h3 className="font-semibold text-gray-900 mb-3" data-oid="ijh-9:c">
                                    Status Management
                                </h3>
                                <div className="flex gap-2" data-oid="whqxuur">
                                    <button
                                        onClick={() => onUpdateStatus(subscription.id, 'active')}
                                        disabled={subscription.status === 'active'}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        data-oid="-w2_not"
                                    >
                                        Activate
                                    </button>
                                    <button
                                        onClick={() => onUpdateStatus(subscription.id, 'paused')}
                                        disabled={subscription.status === 'paused'}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        data-oid="7s5_wnd"
                                    >
                                        Pause
                                    </button>
                                    <button
                                        onClick={() => onUpdateStatus(subscription.id, 'cancelled')}
                                        disabled={subscription.status === 'cancelled'}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        data-oid="s.nvrh8"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="space-y-4" data-oid="yqcu9qm">
                            <h3 className="font-semibold text-gray-900" data-oid="hw0birp">
                                Subscription Products
                            </h3>
                            <div className="space-y-3" data-oid="venw0eo">
                                {subscriptionProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4"
                                        data-oid="xs_m02z"
                                    >
                                        <div
                                            className="flex justify-between items-start"
                                            data-oid="nwfnnu6"
                                        >
                                            <div className="flex-1" data-oid="bx-gpqs">
                                                <h4
                                                    className="font-medium text-gray-900"
                                                    data-oid="t2.i-36"
                                                >
                                                    {product.productName}
                                                </h4>
                                                <p
                                                    className="text-sm text-gray-500 mt-1"
                                                    data-oid="ofpd2kc"
                                                >
                                                    Pharmacy: {product.pharmacyName}
                                                </p>
                                                <div
                                                    className="flex items-center gap-4 mt-2 text-sm"
                                                    data-oid="8erv33e"
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="tuv0qzc"
                                                    >
                                                        Quantity:{' '}
                                                        <span
                                                            className="font-medium"
                                                            data-oid=":afd4l2"
                                                        >
                                                            {product.quantity} {product.unitType}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="q.5e0m9"
                                                    >
                                                        Unit Price:{' '}
                                                        <span
                                                            className="font-medium"
                                                            data-oid="o2-7.3_"
                                                        >
                                                            {product.productPrice} EGP
                                                        </span>
                                                    </span>
                                                    <span
                                                        className="text-[#1F1F6F] font-medium"
                                                        data-oid="c.mfbyp"
                                                    >
                                                        Total:{' '}
                                                        {(
                                                            product.productPrice * product.quantity
                                                        ).toFixed(2)}{' '}
                                                        EGP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4" data-oid="n5fmysi">
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="dqtz9vg"
                                >
                                    <span
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="-1bc06n"
                                    >
                                        Total Subscription Value:
                                    </span>
                                    <span
                                        className="text-xl font-bold text-[#1F1F6F]"
                                        data-oid="y:en372"
                                    >
                                        {subscription.totalAmount.toFixed(2)} EGP
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4" data-oid="cl_e_6o">
                            <h3 className="font-semibold text-gray-900" data-oid="6afnvru">
                                Delivery History
                            </h3>
                            {subscription.deliveryHistory &&
                            subscription.deliveryHistory.length > 0 ? (
                                <div className="space-y-3" data-oid="ck5s099">
                                    {subscription.deliveryHistory.map((delivery) => (
                                        <div
                                            key={delivery.id}
                                            className="border border-gray-200 rounded-lg p-4"
                                            data-oid="p0tfnkr"
                                        >
                                            <div
                                                className="flex justify-between items-start"
                                                data-oid="97fhu1."
                                            >
                                                <div data-oid="snh54ku">
                                                    <div
                                                        className="flex items-center gap-2 mb-2"
                                                        data-oid="q6iico6"
                                                    >
                                                        <span
                                                            className="font-medium text-gray-900"
                                                            data-oid="f8k3ggd"
                                                        >
                                                            Delivery #{delivery.id}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                delivery.status === 'delivered'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                            data-oid="0078r9e"
                                                        >
                                                            {delivery.status}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-600 space-y-1"
                                                        data-oid="oi0v9h:"
                                                    >
                                                        <div data-oid="wge2is-">
                                                            Date:{' '}
                                                            {delivery.deliveryDate.toLocaleDateString()}
                                                        </div>
                                                        {delivery.trackingNumber && (
                                                            <div data-oid="-gq6lxg">
                                                                Tracking: {delivery.trackingNumber}
                                                            </div>
                                                        )}
                                                        {delivery.deliveredBy && (
                                                            <div data-oid="02-cc2c">
                                                                Delivered by: {delivery.deliveredBy}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500" data-oid="6szn8tx">
                                    <div className="text-lg" data-oid="fgb93zb">
                                        No delivery history yet
                                    </div>
                                    <div className="text-sm mt-1" data-oid="z5-cfqu">
                                        Deliveries will appear here once orders are placed
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6" data-oid="kxgwf_n">
                    <div className="flex justify-end" data-oid="li:r-z_">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            data-oid=".5y8oxh"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
