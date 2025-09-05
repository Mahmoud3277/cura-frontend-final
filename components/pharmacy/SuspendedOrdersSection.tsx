'use client';

import { useState, useEffect } from 'react';
import { suspendedOrderService, SuspendedOrder } from '@/lib/services/suspendedOrderService';
import { OrderEditModal } from './OrderEditModal';

interface SuspendedOrdersSectionProps {
    pharmacyId: string;
}

export function SuspendedOrdersSection({ pharmacyId }: SuspendedOrdersSectionProps) {
    const [suspendedOrders, setSuspendedOrders] = useState<SuspendedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<SuspendedOrder | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const loadSuspendedOrders = () => {
            const orders = suspendedOrderService.getSuspendedOrders({
                pharmacyId: pharmacyId,
                status: ['suspended', 'in-progress'],
            });
            setSuspendedOrders(orders);
            setLoading(false);
        };

        loadSuspendedOrders();

        // Subscribe to updates
        const unsubscribe = suspendedOrderService.subscribe((orders) => {
            const pharmacyOrders = orders.filter(
                (order) =>
                    order.pharmacyId === pharmacyId &&
                    ['suspended', 'in-progress'].includes(order.status),
            );
            setSuspendedOrders(pharmacyOrders);
        });

        return unsubscribe;
    }, [pharmacyId]);

    const handleEditOrder = (order: SuspendedOrder) => {
        setSelectedOrder(order);
        setShowEditModal(true);
    };

    const handleApproveOrder = async (orderId: string) => {
        try {
            // In a real implementation, this would call the pharmacy order service
            // to move the order back to normal processing
            alert('✅ Order approved and moved back to processing queue!');
        } catch (error) {
            alert('❌ Error approving order');
        }
    };

    const getPriorityColor = (priority: SuspendedOrder['priority']) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'low':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: SuspendedOrder['status']) => {
        switch (status) {
            case 'suspended':
                return 'bg-red-100 text-red-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32" data-oid="c7g1mik">
                <div className="text-center" data-oid="zvtkqhn">
                    <div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F1F6F] mx-auto mb-2"
                        data-oid="hfkskqf"
                    ></div>
                    <p className="text-gray-600 text-sm" data-oid="b6lb-eg">
                        Loading suspended orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100" data-oid="70v84nd">
            <div className="p-6 border-b border-gray-200" data-oid="qsvqj55">
                <div className="flex items-center justify-between" data-oid="mom-rzy">
                    <div data-oid="p2k5msg">
                        <h3 className="text-lg font-semibold text-gray-900" data-oid="h-pf5um">
                            Suspended Orders
                        </h3>
                        <p className="text-sm text-gray-600 mt-1" data-oid="3wqi4ga">
                            Orders that require your attention and action
                        </p>
                    </div>
                    <div className="flex items-center space-x-2" data-oid="9kd._4q">
                        <span
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                            data-oid="l:0t4q:"
                        >
                            {suspendedOrders.length} Suspended
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6" data-oid="s0:thc0">
                {suspendedOrders.length === 0 ? (
                    <div className="text-center py-8" data-oid="3z40jkd">
                        <div
                            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid=".3__rq7"
                        >
                            <span className="text-2xl" data-oid="9k38.gl">
                                ✅
                            </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="40zemv_">
                            No Suspended Orders
                        </h3>
                        <p className="text-gray-600" data-oid="ltnn6m:">
                            All orders are processing normally!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4" data-oid="yrrtn-m">
                        {suspendedOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                data-oid="msylwz:"
                            >
                                <div
                                    className="flex items-start justify-between mb-3"
                                    data-oid="bjhfsl-"
                                >
                                    <div data-oid="e5ikehm">
                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="4lqt:zt"
                                        >
                                            {order.orderNumber}
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="8z.u6xx">
                                            Customer: {order.customerName} • {order.customerPhone}
                                        </p>
                                        <p className="text-xs text-gray-500" data-oid="fc6:_-0">
                                            Suspended {new Date(order.suspendedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="3slh8:6">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}
                                            data-oid="a0wkwr6"
                                        >
                                            {order.priority.toUpperCase()}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                                            data-oid="qvvyi5r"
                                        >
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-red-50 rounded-lg p-3 mb-4" data-oid="nwkm_:c">
                                    <div className="flex items-start space-x-2" data-oid="dxrke2u">
                                        <span className="text-red-500 text-sm" data-oid="2to0n26">
                                            ⚠️
                                        </span>
                                        <div data-oid=".8edxw5">
                                            <h5
                                                className="font-medium text-red-800 text-sm"
                                                data-oid="tlim.4c"
                                            >
                                                Issue:{' '}
                                                {order.issueType.replace('-', ' ').toUpperCase()}
                                            </h5>
                                            <p
                                                className="text-sm text-red-700 mt-1"
                                                data-oid="lnu4id7"
                                            >
                                                {order.issueNotes}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                                    data-oid="0q6ozsc"
                                >
                                    <div data-oid="lx3o9p:">
                                        <h6
                                            className="font-medium text-gray-900 text-sm mb-2"
                                            data-oid="hs564a8"
                                        >
                                            Order Items ({order.originalItems.length})
                                        </h6>
                                        <div className="space-y-2" data-oid="m4bsuhd">
                                            {order.originalItems.slice(0, 2).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between text-sm"
                                                    data-oid="5jeqoza"
                                                >
                                                    <div className="flex-1" data-oid="5oxgoq:">
                                                        <span
                                                            className="text-gray-900"
                                                            data-oid="jwxln72"
                                                        >
                                                            {item.productName}
                                                        </span>
                                                        {item.issueReason && (
                                                            <span
                                                                className="text-red-600 ml-2"
                                                                data-oid="6_at:y3"
                                                            >
                                                                ⚠️
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="text-gray-600"
                                                        data-oid="65_apcu"
                                                    >
                                                        {item.quantity} {item.unitType} • EGP{' '}
                                                        {item.totalPrice}
                                                    </div>
                                                </div>
                                            ))}
                                            {order.originalItems.length > 2 && (
                                                <p
                                                    className="text-xs text-gray-500"
                                                    data-oid="c71l:8p"
                                                >
                                                    +{order.originalItems.length - 2} more items
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div data-oid=":8gj8o:">
                                        <h6
                                            className="font-medium text-gray-900 text-sm mb-2"
                                            data-oid="i7z_6np"
                                        >
                                            Order Total
                                        </h6>
                                        <div
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="ehzcl9."
                                        >
                                            EGP {order.totalAmount.toFixed(2)}
                                        </div>
                                        {order.modifiedItems && (
                                            <div
                                                className="text-sm text-blue-600 mt-1"
                                                data-oid="j_jaabx"
                                            >
                                                Modified: EGP{' '}
                                                {order.modifiedItems
                                                    .reduce((sum, item) => sum + item.totalPrice, 0)
                                                    .toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className="flex items-center justify-between pt-4 border-t border-gray-200"
                                    data-oid="y8qx:xj"
                                >
                                    <div
                                        className="flex items-center space-x-4 text-sm text-gray-600"
                                        data-oid="bcpw2po"
                                    >
                                        {order.prescriptionId && (
                                            <span className="flex items-center" data-oid="b-hhkpe">
                                                📋 Prescription Required
                                            </span>
                                        )}
                                        {order.escalationLevel > 0 && (
                                            <span
                                                className="flex items-center text-red-600"
                                                data-oid="ldpb5xp"
                                            >
                                                🔺 Escalated (Level {order.escalationLevel})
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="b8kzj6p">
                                        <button
                                            onClick={() => handleEditOrder(order)}
                                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                                            data-oid="663jj93"
                                        >
                                            ✏️ Edit Order
                                        </button>
                                        {order.status === 'in-progress' && order.modifiedItems && (
                                            <button
                                                onClick={() => handleApproveOrder(order.id)}
                                                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors"
                                                data-oid="4aifvqr"
                                            >
                                                ✅ Approve & Process
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Edit Modal */}
            {showEditModal && selectedOrder && (
                <OrderEditModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedOrder(null);
                    }}
                    onSave={(modifiedOrder) => {
                        // Update the order in the list
                        setSuspendedOrders((prev) =>
                            prev.map((order) =>
                                order.id === modifiedOrder.id ? modifiedOrder : order,
                            ),
                        );
                        setShowEditModal(false);
                        setSelectedOrder(null);
                    }}
                    data-oid=".cz2th0"
                />
            )}
        </div>
    );
}
