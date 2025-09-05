'use client';

import { useState, useEffect } from 'react';
import { suspendedOrderService, SuspendedOrder } from '@/lib/services/suspendedOrderService';

export default function SimpleAppServicesDashboard() {
    const [suspendedOrders, setSuspendedOrders] = useState<SuspendedOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const orders = suspendedOrderService.getSuspendedOrders();
            setSuspendedOrders(orders);
            setLoading(false);
        } catch (error) {
            console.error('Error loading orders:', error);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="kp8ozg_">
                <div className="text-center" data-oid="xp3ckjh">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                        data-oid="1cohvl1"
                    ></div>
                    <p className="text-gray-600" data-oid=":--7yf.">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6" data-oid="yhk2vfu">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="i13c71u">
                <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="m:_xpg-">
                    App Services Dashboard
                </h1>
                <p className="text-gray-600" data-oid="64.zo6t">
                    Comprehensive customer service and issue management center
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-oid="gajpph3">
                <div className="bg-white rounded-xl border border-gray-200 p-4" data-oid="w:08de-">
                    <div className="text-center" data-oid="v0l:c2l">
                        <div className="text-2xl font-bold text-red-600" data-oid="9ukhk7a">
                            {suspendedOrders.filter((o) => o.status === 'suspended').length}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="1iufweh">
                            Suspended Orders
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4" data-oid="n1.7z2o">
                    <div className="text-center" data-oid="t5:lyjy">
                        <div className="text-2xl font-bold text-yellow-600" data-oid="m0auydc">
                            {suspendedOrders.filter((o) => o.customerContacted).length}
                        </div>
                        <div className="text-sm text-gray-600" data-oid=":wu5-z4">
                            Customer Contacted
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4" data-oid="h8wevk6">
                    <div className="text-center" data-oid="9-ccka3">
                        <div className="text-2xl font-bold text-blue-600" data-oid="7dm3r:j">
                            {suspendedOrders.filter((o) => o.pharmacyContacted).length}
                        </div>
                        <div className="text-sm text-gray-600" data-oid=":-8i46c">
                            Pharmacy Contacted
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4" data-oid="wqkli4y">
                    <div className="text-center" data-oid="az957ki">
                        <div className="text-2xl font-bold text-green-600" data-oid="e6wh8kp">
                            {suspendedOrders.filter((o) => o.status === 'resolved').length}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="qc4alk8">
                            Resolved
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="2z8-pzj">
                <h3 className="text-lg font-semibold mb-4" data-oid="s_39mb:">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-oid="3mkd205">
                    <button
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        data-oid="0cit:cv"
                    >
                        <div className="text-2xl mb-2" data-oid="v_kls2v">
                            📞
                        </div>
                        <div className="text-sm font-medium" data-oid="4:lw8h1">
                            Contact Customer
                        </div>
                    </button>
                    <button
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        data-oid="-eoac4y"
                    >
                        <div className="text-2xl mb-2" data-oid="dz7r.be">
                            🏥
                        </div>
                        <div className="text-sm font-medium" data-oid="jctqz-4">
                            Contact Pharmacy
                        </div>
                    </button>
                    <button
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        data-oid="qhdna00"
                    >
                        <div className="text-2xl mb-2" data-oid="cxpc60v">
                            ✏️
                        </div>
                        <div className="text-sm font-medium" data-oid="tyzikxr">
                            Edit Order
                        </div>
                    </button>
                    <button
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        data-oid="0s13qud"
                    >
                        <div className="text-2xl mb-2" data-oid="083v7dm">
                            🔺
                        </div>
                        <div className="text-sm font-medium" data-oid=":wao92o">
                            Escalate Issue
                        </div>
                    </button>
                </div>
            </div>

            {/* Suspended Orders */}
            <div className="bg-white rounded-xl border border-gray-200" data-oid="c8e_uma">
                <div className="p-4 border-b border-gray-200" data-oid="txujddc">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid="7sttlc:">
                        Suspended Orders ({suspendedOrders.length})
                    </h3>
                </div>
                {suspendedOrders.length === 0 ? (
                    <div className="p-12 text-center" data-oid="34d3.0.">
                        <div className="text-6xl mb-4" data-oid="p0_qcc6">
                            ✅
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="m:sngi3">
                            No Suspended Orders
                        </h3>
                        <p className="text-gray-600" data-oid="zjkv5kn">
                            All orders are running smoothly!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 p-6" data-oid="tqcoauc">
                        {suspendedOrders.slice(0, 5).map((order) => (
                            <div
                                key={order.id}
                                className="border border-gray-200 rounded-xl p-4"
                                data-oid="y64arcp"
                            >
                                <div
                                    className="flex items-start justify-between mb-2"
                                    data-oid="t2tqxwf"
                                >
                                    <div data-oid="ipk7h-0">
                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="o5j063i"
                                        >
                                            {order.orderNumber}
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="6m_9xh4">
                                            Customer: {order.customerName} • Pharmacy:{' '}
                                            {order.pharmacyName}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="m.712j6">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'suspended'
                                                    ? 'bg-red-100 text-red-800'
                                                    : order.status === 'in-progress'
                                                      ? 'bg-yellow-100 text-yellow-800'
                                                      : 'bg-green-100 text-green-800'
                                            }`}
                                            data-oid="aabd981"
                                        >
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-3" data-oid="uuioumd">
                                    <p className="text-sm text-red-700" data-oid="_ufz4fj">
                                        {order.issueNotes}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-oid="4ezu-bx">
                <h3 className="text-lg font-semibold mb-4" data-oid="0bdp9en">
                    App Services Features
                </h3>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    data-oid="kxe5wxn"
                >
                    <a
                        href="/app-services/dashboard"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block"
                        data-oid="mn8bvqy"
                    >
                        <div className="text-lg mb-2" data-oid="h7v5a9o">
                            📊
                        </div>
                        <div className="font-medium" data-oid="-1avxto">
                            Full Dashboard
                        </div>
                        <div className="text-sm text-gray-600" data-oid=":z7w5rs">
                            Complete overview and management
                        </div>
                    </a>
                    <div
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                        data-oid="uxh2pd3"
                    >
                        <div className="text-lg mb-2" data-oid="ny77rsj">
                            🎧
                        </div>
                        <div className="font-medium" data-oid=":865986">
                            Customer Service
                        </div>
                        <div className="text-sm text-gray-600" data-oid="0815d:d">
                            Handle customer tickets and support
                        </div>
                    </div>
                    <div
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                        data-oid="-f6osyk"
                    >
                        <div className="text-lg mb-2" data-oid="::.7h7t">
                            🏥
                        </div>
                        <div className="font-medium" data-oid="_p6lxeu">
                            Pharmacy Coordination
                        </div>
                        <div className="text-sm text-gray-600" data-oid="-2tkf8g">
                            Coordinate with pharmacy partners
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
