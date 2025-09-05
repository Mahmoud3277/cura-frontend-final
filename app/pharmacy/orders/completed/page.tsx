'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pharmacyOrderService, PharmacyOrder } from '@/lib/services/pharmacyOrderService';

export default function CompletedOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<PharmacyOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<PharmacyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Load orders
    useEffect(() => {
        const loadOrders = () => {
            try {
                const allOrders = pharmacyOrderService.getOrders();
                // Filter only delivered orders (exclude cancelled orders)
                const completedOrders = allOrders.filter((order) => order.status === 'delivered');
                setOrders(completedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error loading orders:', error);
                setLoading(false);
            }
        };

        loadOrders();

        // Subscribe to order updates
        const unsubscribe = pharmacyOrderService.subscribe((updatedOrders) => {
            const completedOrders = updatedOrders.filter((order) => order.status === 'delivered');
            setOrders(completedOrders);
        });

        return unsubscribe;
    }, []);

    // Apply search filter
    useEffect(() => {
        let filtered = [...orders];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(query) ||
                    order.customerName.toLowerCase().includes(query) ||
                    order.customerPhone.includes(query),
            );
        }

        setFilteredOrders(filtered);
    }, [orders, searchQuery]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="qu1hsnc">
                <div className="text-center" data-oid=":z5fv29">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-cura-primary mx-auto mb-4"
                        data-oid="50_yudj"
                    ></div>
                    <p className="text-gray-600" data-oid="sq8q.s8">
                        Loading completed orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="l1k73:g">
            {/* Total Completed Orders Summary Card */}
            <div
                className="bg-gradient-to-br from-cura-primary via-cura-secondary to-cura-accent rounded-2xl shadow-xl overflow-hidden"
                data-oid="rl011-g"
            >
                <div className="p-6 text-white" data-oid="t8sn7un">
                    <div className="flex items-center justify-between" data-oid="y:9crhg">
                        <div className="flex items-center space-x-4" data-oid="9i8a8zo">
                            <div
                                className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                                data-oid="9wr678x"
                            >
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="jtcq1fi"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        data-oid="6.v56.k"
                                    />
                                </svg>
                            </div>
                            <div data-oid="aqgfum9">
                                <h2 className="text-3xl font-bold mb-1" data-oid="j4s87.u">
                                    {orders.length}
                                </h2>
                                <p className="text-white/90 text-lg font-medium" data-oid="mgwgmrf">
                                    Total Completed Orders
                                </p>
                                <p className="text-white/70 text-sm" data-oid="wqslg.p">
                                    Successfully delivered to customers
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 font-medium group backdrop-blur-sm"
                            data-oid=".grfnk4"
                        >
                            <svg
                                className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="_yntz8o"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                    data-oid="ygasnnc"
                                />
                            </svg>
                            Back
                        </button>
                    </div>
                </div>
            </div>

            {/* CURA Branded Search */}
            <div
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                data-oid=":2u5.ph"
            >
                <div className="relative" data-oid="2or_eud">
                    <div
                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        data-oid="_2p_q41"
                    >
                        <svg
                            className="h-5 w-5 text-cura-light"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="p29v6.e"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                data-oid="7zt5etd"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by order number, customer name, or phone..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-cura-primary focus:border-cura-primary transition-all duration-200"
                        data-oid="fzw_ivw"
                    />

                    {searchQuery && (
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            data-oid="la66:0q"
                        >
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-gray-400 hover:text-cura-primary transition-colors"
                                data-oid="5uc:z6j"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="vw2cdv4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                        data-oid="ln7cph9"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Orders List */}
            <div
                className="bg-white rounded-xl border border-gray-200 shadow-sm"
                data-oid="0t499-p"
            >
                <div
                    className="bg-gradient-to-r from-cura-primary via-cura-secondary to-cura-accent p-4 rounded-t-xl"
                    data-oid="r2coy_c"
                >
                    <div className="flex items-center justify-between" data-oid="xn_jlru">
                        <h3 className="text-lg font-semibold text-white" data-oid="8lx8h:d">
                            Successfully Delivered Orders ({filteredOrders.length})
                        </h3>
                        <div className="flex items-center space-x-2" data-oid="bf0mww3">
                            <div
                                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                                data-oid="biigh2v"
                            >
                                <span className="text-white text-sm" data-oid="x_1hojv">
                                    ✅
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6" data-oid="3omvte3">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12" data-oid="hno8.zd">
                            <div
                                className="w-16 h-16 bg-gradient-to-br from-cura-primary to-cura-secondary rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="qfk3dml"
                            >
                                <span className="text-3xl text-white" data-oid="2lcjt3i">
                                    ✅
                                </span>
                            </div>
                            <h3
                                className="text-lg font-medium text-gray-900 mb-2"
                                data-oid=":p34azr"
                            >
                                No Completed Orders
                            </h3>
                            <p className="text-gray-600" data-oid="dmleugm">
                                {orders.length === 0
                                    ? "You don't have any successfully delivered orders yet."
                                    : 'No orders match your search.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8" data-oid=".64l5bi">
                            {filteredOrders.map((order, index) => (
                                <div key={order.id} className="relative" data-oid="azssip5">
                                    {/* Beautiful floating badge */}
                                    <div className="absolute -top-4 left-8 z-10" data-oid="coi--fy">
                                        <div
                                            className="bg-gradient-to-r from-cura-primary to-cura-secondary text-white px-4 py-2 rounded-full shadow-lg"
                                            data-oid="k_gx.7g"
                                        >
                                            <span
                                                className="text-sm font-semibold"
                                                data-oid="7vvnn92"
                                            >
                                                Order #{index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Beautiful order card */}
                                    <div
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        data-oid="72ytmi-"
                                    >
                                        {/* Elegant header */}
                                        <div
                                            className="bg-gradient-to-r from-cura-primary via-cura-secondary to-cura-accent p-6 relative"
                                            data-oid="nmu64po"
                                        >
                                            <div
                                                className="absolute inset-0 bg-black/5"
                                                data-oid="2z7we.r"
                                            ></div>
                                            <div className="relative" data-oid="85puqz9">
                                                <div
                                                    className="flex items-center justify-between"
                                                    data-oid="usuv-cl"
                                                >
                                                    <div
                                                        className="flex items-center space-x-4"
                                                        data-oid="o5jvhke"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-3"
                                                            data-oid=".78ecbw"
                                                        >
                                                            <div
                                                                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                                                                data-oid="6tz89_a"
                                                            >
                                                                <span
                                                                    className="text-white text-lg"
                                                                    data-oid="xp9k0ky"
                                                                >
                                                                    ✅
                                                                </span>
                                                            </div>
                                                            <div data-oid="fzhmt24">
                                                                <h4
                                                                    className="font-bold text-xl text-white"
                                                                    data-oid="b:fp397"
                                                                >
                                                                    {order.orderNumber}
                                                                </h4>
                                                                <p
                                                                    className="text-white/80 text-sm"
                                                                    data-oid="h0396:h"
                                                                >
                                                                    Successfully Delivered:{' '}
                                                                    {new Date(
                                                                        order.updatedAt ||
                                                                            order.createdAt,
                                                                    ).toLocaleDateString()}{' '}
                                                                    •{' '}
                                                                    {new Date(
                                                                        order.updatedAt ||
                                                                            order.createdAt,
                                                                    ).toLocaleTimeString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="i_zts7c"
                                                    >
                                                        <span
                                                            className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 shadow-md"
                                                            data-oid="e8-x39s"
                                                        >
                                                            ✅ Delivered
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Beautiful content */}
                                        <div className="p-6 space-y-6" data-oid="qtsklox">
                                            {/* Delivery card */}
                                            <div
                                                className="bg-gradient-to-br from-cura-primary/5 to-cura-secondary/5 rounded-xl p-4 border border-cura-primary/20"
                                                data-oid="y3ejqm1"
                                            >
                                                <div
                                                    className="flex items-start space-x-3"
                                                    data-oid="6sbui:7"
                                                >
                                                    <div
                                                        className="w-10 h-10 bg-gradient-to-br from-cura-primary to-cura-secondary rounded-full flex items-center justify-center"
                                                        data-oid="yn--boq"
                                                    >
                                                        <span
                                                            className="text-white"
                                                            data-oid="4.9n4hn"
                                                        >
                                                            📍
                                                        </span>
                                                    </div>
                                                    <div className="flex-1" data-oid="k2x_aw.">
                                                        <h6
                                                            className="font-semibold text-gray-900 mb-1"
                                                            data-oid="0b.wq6c"
                                                        >
                                                            Successfully Delivered to{' '}
                                                            {order.deliveryAddress.city}
                                                        </h6>
                                                        <p
                                                            className="text-sm text-gray-600 mb-1"
                                                            data-oid="pia-va_"
                                                        >
                                                            {order.deliveryAddress.street}
                                                        </p>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="8gnp-g5"
                                                        >
                                                            {order.deliveryAddress.governorate}
                                                        </p>
                                                        {order.deliveryAddress.notes && (
                                                            <div
                                                                className="mt-2 p-2 bg-cura-primary/10 rounded-lg"
                                                                data-oid="6s9qv-m"
                                                            >
                                                                <p
                                                                    className="text-sm text-cura-primary"
                                                                    data-oid="9.f7dtw"
                                                                >
                                                                    📝 {order.deliveryAddress.notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Beautiful medicines grid */}
                                            <div data-oid="_-1489w">
                                                <div
                                                    className="flex items-center space-x-2 mb-4"
                                                    data-oid="vdre3nv"
                                                >
                                                    <div
                                                        className="w-8 h-8 bg-cura-primary rounded-full flex items-center justify-center"
                                                        data-oid="k1s3di2"
                                                    >
                                                        <span
                                                            className="text-white text-sm"
                                                            data-oid="37byh3m"
                                                        >
                                                            💊
                                                        </span>
                                                    </div>
                                                    <h6
                                                        className="font-semibold text-gray-900"
                                                        data-oid="vl157:b"
                                                    >
                                                        Medicines ({order.items.length} items)
                                                    </h6>
                                                </div>

                                                <div
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                    data-oid="xt06opa"
                                                >
                                                    {order.items.map((item, itemIndex) => (
                                                        <div
                                                            key={itemIndex}
                                                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                                                            data-oid="h8a:dxg"
                                                        >
                                                            <div
                                                                className="flex items-start space-x-4"
                                                                data-oid="f:9w.g_"
                                                            >
                                                                <div
                                                                    className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm"
                                                                    data-oid="sei_51_"
                                                                >
                                                                    {item.image ? (
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.productName}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                (
                                                                                    e.target as HTMLImageElement
                                                                                ).style.display =
                                                                                    'none';
                                                                                (
                                                                                    e.target as HTMLImageElement
                                                                                ).nextElementSibling!.classList.remove(
                                                                                    'hidden',
                                                                                );
                                                                            }}
                                                                            data-oid="na-oixs"
                                                                        />
                                                                    ) : null}
                                                                    <div
                                                                        className={`text-2xl ${item.image ? 'hidden' : ''}`}
                                                                        data-oid="e.jkutq"
                                                                    >
                                                                        💊
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="flex-1"
                                                                    data-oid="w-9i6gi"
                                                                >
                                                                    <h6
                                                                        className="font-semibold text-gray-900 leading-tight mb-1"
                                                                        data-oid="5plik7_"
                                                                    >
                                                                        {item.productName}
                                                                    </h6>
                                                                    <p
                                                                        className="text-sm text-gray-600 mb-2"
                                                                        data-oid="vdb09_0"
                                                                    >
                                                                        {item.manufacturer}
                                                                    </p>
                                                                    <div
                                                                        className="flex items-center justify-between"
                                                                        data-oid="q2qcnjs"
                                                                    >
                                                                        <span
                                                                            className="text-sm font-medium text-green-600"
                                                                            data-oid=".7_z_ua"
                                                                        >
                                                                            EGP {item.unitPrice}
                                                                        </span>
                                                                        {item.prescription && (
                                                                            <span
                                                                                className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium"
                                                                                data-oid="7m4vgv_"
                                                                            >
                                                                                🔒 Prescription
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="text-center"
                                                                    data-oid="ldan.zm"
                                                                >
                                                                    <div
                                                                        className="bg-cura-primary text-white px-3 py-2 rounded-full shadow-sm"
                                                                        data-oid="fjax5qw"
                                                                    >
                                                                        <span
                                                                            className="text-sm font-bold"
                                                                            data-oid="q93vn.z"
                                                                        >
                                                                            x{item.quantity}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Beautiful summary */}
                                            <div
                                                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                                                data-oid="6avmp-e"
                                            >
                                                <div
                                                    className="flex justify-between items-start"
                                                    data-oid="z201thu"
                                                >
                                                    <div className="space-y-2" data-oid="-b9kj26">
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="b-d7fhv"
                                                        >
                                                            <span
                                                                className="w-2 h-2 bg-cura-primary rounded-full"
                                                                data-oid=":jcgc7j"
                                                            ></span>
                                                            <span
                                                                className="text-sm text-gray-600"
                                                                data-oid="xfv9_-3"
                                                            >
                                                                {order.items.length} items •{' '}
                                                                {order.paymentMethod}
                                                            </span>
                                                        </div>
                                                        {order.pharmacyNotes && (
                                                            <div
                                                                className="bg-cura-primary/10 p-2 rounded-lg"
                                                                data-oid="cca31-1"
                                                            >
                                                                <p
                                                                    className="text-sm text-cura-primary"
                                                                    data-oid="ouqya_o"
                                                                >
                                                                    📝 {order.pharmacyNotes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right" data-oid="fo-wiqe">
                                                        <div
                                                            className="text-2xl font-bold text-gray-900"
                                                            data-oid="zpf8idw"
                                                        >
                                                            EGP {order.totalAmount.toFixed(2)}
                                                        </div>
                                                        <div
                                                            className="text-sm text-gray-500"
                                                            data-oid="b5nzl_s"
                                                        >
                                                            Total Amount
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Beautiful separator */}
                                    {index < filteredOrders.length - 1 && (
                                        <div
                                            className="flex items-center justify-center my-8"
                                            data-oid=":txcf0x"
                                        >
                                            <div
                                                className="flex-1 border-t border-dashed border-gray-300"
                                                data-oid="91y32j2"
                                            ></div>
                                            <div
                                                className="px-6 py-2 bg-gray-100 rounded-full"
                                                data-oid="3ljrn8i"
                                            >
                                                <span
                                                    className="text-gray-400 text-sm"
                                                    data-oid="c2hwrol"
                                                >
                                                    • • •
                                                </span>
                                            </div>
                                            <div
                                                className="flex-1 border-t border-dashed border-gray-300"
                                                data-oid="-y5qc.z"
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
