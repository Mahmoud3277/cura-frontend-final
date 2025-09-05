'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pharmacyOrderService, PharmacyOrder } from '@/lib/services/pharmacyOrderService';
import { OrderDetailsModal } from '@/components/pharmacy/OrderDetailsModal';

export default function SuspendedOrdersPage() {
    const router = useRouter();
    const [suspendedOrders, setSuspendedOrders] = useState<PharmacyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const pharmacyId = 'healthplus-ismailia'; // In real app, get from auth context

    useEffect(() => {
        const loadSuspendedOrders = () => {
            // Get orders that were suspended by pharmacy due to prescription issues
            const allOrders = pharmacyOrderService.getOrdersForPharmacy(pharmacyId);
            const prescriptionSuspendedOrders = allOrders.filter(
                (order) =>
                    (order.prescriptionRequired && order.prescriptionVerified === false) && // Pharmacy actively rejected prescription
                    order.status === 'cancelled' &&
                    order.cancelReason === 'Prescription verification failed',
            );
            setSuspendedOrders(prescriptionSuspendedOrders);
            setLoading(false);
        };

        loadSuspendedOrders();

        // Subscribe to updates
        const unsubscribe = pharmacyOrderService.subscribe((orders) => {
            const allOrders = orders.filter((order) => order.pharmacyId === pharmacyId);
            const prescriptionSuspendedOrders = allOrders.filter(
                (order) =>
                    (order.prescriptionRequired && order.prescriptionVerified === false) && // Pharmacy actively rejected prescription
                    order.status === 'cancelled' &&
                    order.cancelReason === 'Prescription verification failed',
            );
            setSuspendedOrders(prescriptionSuspendedOrders);
        });

        return unsubscribe;
    }, [pharmacyId]);

    // Force close any modals on page load and add escape key handler
    useEffect(() => {
        setShowEditModal(false);
        setSelectedOrder(null);

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowEditModal(false);
                setSelectedOrder(null);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleViewOrder = (order: PharmacyOrder) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleContactCustomer = async (orderId: string) => {
        try {
            alert(
                '📞 Customer contact initiated. Please call the customer to resolve the prescription issue.',
            );
        } catch (error) {
            alert('❌ Error initiating customer contact');
        }
    };

    const getPriorityColor = (priority: PharmacyOrder['priority']) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-500 text-white';
            case 'high':
                return 'bg-orange-500 text-white';
            case 'normal':
                return 'bg-blue-500 text-white';
            case 'low':
                return 'bg-gray-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getStatusColor = (status: PharmacyOrder['status']) => {
        switch (status) {
            case 'cancelled':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="v-lx6y4">
                <div className="text-center" data-oid="4uuc7zn">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-cura-primary mx-auto mb-4"
                        data-oid="qhoyrfv"
                    ></div>
                    <p className="text-gray-600" data-oid="q7eu6wv">
                        Loading suspended orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6" data-oid="beca3sh">
            {/* Simple Header */}
            <div
                className="bg-gradient-to-r from-cura-primary to-cura-secondary rounded-xl p-6 text-white shadow-lg"
                data-oid="ru1jmqy"
            >
                <div className="flex items-center justify-between" data-oid="gpqnvoa">
                    <div className="flex items-center space-x-4" data-oid="_zdyu4z">
                        <div
                            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                            data-oid="sjruy1n"
                        >
                            <span className="text-2xl" data-oid="uq3b7d7">
                                ⚠️
                            </span>
                        </div>
                        <div data-oid=":uhr_yd">
                            <h1 className="text-2xl font-bold" data-oid="w_99rzs">
                                Suspended Orders
                            </h1>
                            <p className="text-blue-100 opacity-90" data-oid="y5uz5v6">
                                Orders that were suspended after prescription review
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        data-oid="9:q5-r-"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* Simple Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="kj6ok-f">
                <div
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    data-oid="itrgogy"
                >
                    <div className="text-center" data-oid="rt896ax">
                        <div className="text-2xl font-bold text-red-600" data-oid="ophffmp">
                            {suspendedOrders.length}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="4i-4yte">
                            Prescription Issues
                        </div>
                    </div>
                </div>
                <div
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    data-oid="4.x7phc"
                >
                    <div className="text-center" data-oid="kz1puq7">
                        <div className="text-2xl font-bold text-yellow-600" data-oid="0092a7q">
                            {
                                suspendedOrders.filter(
                                    (o) =>
                                        new Date(o.updatedAt).getTime() >
                                        Date.now() - 24 * 60 * 60 * 1000,
                                ).length
                            }
                        </div>
                        <div className="text-sm text-gray-600" data-oid="kzwxk-z">
                            Last 24 Hours
                        </div>
                    </div>
                </div>
                <div
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    data-oid="z.tvnpv"
                >
                    <div className="text-center" data-oid="6g8.m-u">
                        <div className="text-2xl font-bold text-cura-primary" data-oid="jlo:jcs">
                            {
                                suspendedOrders.filter(
                                    (o) => o.priority === 'urgent' || o.priority === 'high',
                                ).length
                            }
                        </div>
                        <div className="text-sm text-gray-600" data-oid="9wyl13r">
                            High Priority
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-200"
                data-oid="y2k7myc"
            >
                <div
                    className="bg-gradient-to-r from-cura-primary to-cura-secondary p-4 rounded-t-xl"
                    data-oid="1cixgtq"
                >
                    <h3 className="text-lg font-semibold text-white" data-oid="n-.r6f3">
                        Prescription Issues ({suspendedOrders.length})
                    </h3>
                </div>

                <div className="p-6" data-oid="ixo7f54">
                    {suspendedOrders.length === 0 ? (
                        <div className="text-center py-12" data-oid=":p-.qjl">
                            <div
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="apsq_fp"
                            >
                                <span className="text-3xl" data-oid="_8e.1wz">
                                    ✅
                                </span>
                            </div>
                            <h3
                                className="text-lg font-medium text-gray-900 mb-2"
                                data-oid="m7q:bd7"
                            >
                                No Suspended Orders
                            </h3>
                            <p className="text-gray-600" data-oid="f-8pd4n">
                                No orders have been suspended due to prescription issues. Orders
                                that need prescription review can be found in the main Orders page.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4" data-oid="uhids7_">
                            {suspendedOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    data-oid="ey2:a0j"
                                >
                                    {/* Order Header */}
                                    <div
                                        className="flex items-center justify-between mb-4"
                                        data-oid="w79rp.s"
                                    >
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="tmzv:zk"
                                        >
                                            <div
                                                className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white"
                                                data-oid="rsrfixc"
                                            >
                                                📋
                                            </div>
                                            <div data-oid=".-a6.2h">
                                                <h4
                                                    className="font-semibold text-gray-900"
                                                    data-oid="oqrlrhc"
                                                >
                                                    {order.orderNumber}
                                                </h4>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="vgmaj-b"
                                                >
                                                    {order.customerName} • {order.customerPhone}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="f:82_c:"
                                        >
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}
                                                data-oid="0jehcj-"
                                            >
                                                {order.priority.toUpperCase()}
                                            </span>
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                data-oid="4h7f7w_"
                                            >
                                                SUSPENDED
                                            </span>
                                        </div>
                                    </div>

                                    {/* Issue Details */}
                                    <div
                                        className="bg-red-50 rounded-lg p-3 mb-4"
                                        data-oid="0gbwf.m"
                                    >
                                        <div
                                            className="flex items-start space-x-2"
                                            data-oid="hxmx475"
                                        >
                                            <span
                                                className="text-red-500 text-sm"
                                                data-oid="3.kpr6e"
                                            >
                                                ⚠️
                                            </span>
                                            <div data-oid="ths1qqf">
                                                <h5
                                                    className="font-medium text-red-800 text-sm"
                                                    data-oid="qdr2476"
                                                >
                                                    Prescription Issue Found
                                                </h5>
                                                <p
                                                    className="text-sm text-red-700 mt-1"
                                                    data-oid="r_qxh1u"
                                                >
                                                    {order.pharmacyNotes ||
                                                        'Prescription verification failed during pharmacy review'}
                                                </p>
                                                <p
                                                    className="text-xs text-red-600 mt-1"
                                                    data-oid="16lp92q"
                                                >
                                                    Suspended on:{' '}
                                                    {new Date(order.updatedAt).toLocaleDateString()}{' '}
                                                    at{' '}
                                                    {new Date(order.updatedAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                                        data-oid=":f857-z"
                                    >
                                        <div data-oid="6x:qq9a">
                                            <h6
                                                className="font-medium text-gray-900 text-sm mb-2"
                                                data-oid="43z.uvb"
                                            >
                                                Order Items ({order.items.length})
                                            </h6>
                                            <div className="space-y-1" data-oid="1mc-cxd">
                                                {order.items.slice(0, 2).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between text-sm"
                                                        data-oid="3u-kl.t"
                                                    >
                                                        <span
                                                            className="text-gray-900"
                                                            data-oid="wh.vyn8"
                                                        >
                                                            {item.productName}
                                                            {item.prescription && (
                                                                <span
                                                                    className="ml-1 text-red-600"
                                                                    data-oid="1r8n_re"
                                                                >
                                                                    📋
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span
                                                            className="text-gray-600"
                                                            data-oid="ev392ow"
                                                        >
                                                            {item.quantity} • EGP {item.unitPrice}
                                                        </span>
                                                    </div>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <p
                                                        className="text-xs text-gray-500"
                                                        data-oid="rbf8_3z"
                                                    >
                                                        +{order.items.length - 2} more items
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div data-oid="j63i--2">
                                            <h6
                                                className="font-medium text-gray-900 text-sm mb-2"
                                                data-oid=":3i.ebs"
                                            >
                                                Order Total
                                            </h6>
                                            <div
                                                className="text-lg font-semibold text-cura-primary"
                                                data-oid="hc.3r0k"
                                            >
                                                EGP {order.totalAmount.toFixed(2)}
                                            </div>
                                            {order.prescriptionId && (
                                                <p
                                                    className="text-xs text-gray-500 mt-1"
                                                    data-oid="j8yk6fr"
                                                >
                                                    Prescription ID: {order.prescriptionId}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div
                                        className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200"
                                        data-oid="hkjsjtu"
                                    >
                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                                            data-oid="qk1dtkh"
                                        >
                                            👁️ View Details
                                        </button>
                                        <button
                                            onClick={() => handleContactCustomer(order.id)}
                                            className="px-3 py-2 bg-cura-primary text-white rounded-lg hover:bg-cura-secondary text-sm font-medium transition-colors"
                                            data-oid="sph3njb"
                                        >
                                            📞 Contact Customer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <OrderDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedOrder(null);
                    }}
                    order={selectedOrder}
                    data-oid="4xq:7x3"
                />
            )}
        </div>
    );
}
