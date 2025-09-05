'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { providerOrderService } from '@/lib/services/vendorManagementService';
interface VendorOrder {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: {
        street: string;
        area: string;
        city: string;
        governorate: string;
        notes?: string;
    };
    items: Array<{
        productName: string;
        quantity: number;
        unitPrice: number;
        image?: string;
        manufacturer?: string;
    }>;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
    createdAt: string;
    paymentMethod: string;
    vendorNotes?: string;
}

const BRAND_COLORS = {
    primary: '#1F1F6F',
    secondary: '#14274E',
    accent: '#394867',
};

export default function VendorOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<VendorOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [VendorId, setVendorId] = useState("");
    // Mock data for demonstration
    const getUser = async():Promise<string>=>{
        const token = Cookies.get('authToken')
        const user = await fetch('http://localhost:5000/api/auth/me',{
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
        const data = await user.json()
        console.log(data)
        setVendorId(data.data.vendor._id)
        return data.data.vendor._id;
    }
    const loadData = async() => {
        try {
            const vendorId = await getUser();
            // const pharmacyId = await getUser();
            if(vendorId){
                const allOrders =await  providerOrderService.getAllOrders({},vendorId);
                console.log(allOrders.data)
            setOrders(allOrders.data);
            setLoading(false);
            }
            
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
       
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Apply filters based on search and exclude delivered orders
    useEffect(() => {
        let filtered = [...orders];

        // Exclude delivered orders (they should only appear in dashboard)
        filtered = filtered.filter((order) => order.status !== 'delivered');

        // Apply search
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

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const order = orders.find((o) => o._id === orderId);
            if (!order) {
                alert('Order not found');
                return;
            }
            if (newStatus === 'confirmed') {
                // Check if order can be accepted
                if (!providerOrderService.canAcceptOrder(order)) {
                    if (providerOrderService.requiresPrescription(order)) {
                        alert(
                            '⚠️ Prescription Verification Required\n\nThis order contains prescription medicines that must be verified before acceptance. Please review the prescription first by clicking the "Review Prescription" button.',
                        );
                        return;
                    } else {
                        alert('This order cannot be accepted at this time.');
                        return;
                    }
                }
                // Accept the order
                await providerOrderService.acceptOrder(orderId);
                loadData()
                // Removed success alert - order acceptance works silently
            } else {
                await providerOrderService.updateOrderStatus(orderId, newStatus as any);
                loadData()
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            if (error instanceof Error) {
                alert(`❌ Error: ${error.message}`);
            } else {
                alert('Error updating order status. Please try again.');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'preparing':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ready':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'out-for-delivery':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getNextStatus = (currentStatus: string) => {
        switch (currentStatus) {
            case 'pending':
                return 'confirmed';
            case 'confirmed':
                return 'preparing';
            case 'preparing':
                return 'ready';
            case 'ready':
                return 'out-for-delivery';
            case 'out-for-delivery':
                return 'delivered';
            default:
                return null;
        }
    };

    const getNextStatusLabel = (currentStatus: string) => {
        switch (currentStatus) {
            case 'pending':
                return 'Accept Order';
            case 'confirmed':
                return 'Start Preparing';
            case 'preparing':
                return 'Mark Ready';
            case 'ready':
                return 'Out for Delivery';
            case 'out-for-delivery':
                return 'Mark Delivered';
            default:
                return null;
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="_clv_xe">
                <div className="text-center" data-oid="p9k4lgt">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                        style={{ borderColor: BRAND_COLORS.primary }}
                        data-oid="j1c80o_"
                    ></div>
                    <p className="text-gray-600" data-oid="xy4l3cj">
                        Loading orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }} data-oid="veducg_">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 mb-6" data-oid="jx6aeus">
                <div className="px-6 py-4" data-oid="u_08onk">
                    <div className="flex items-center justify-between" data-oid="mxxugji">
                        <div className="flex items-center space-x-4" data-oid="-jep-wd">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
                                }}
                                data-oid="_26_:do"
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid="3ke3_tb"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                                        clipRule="evenodd"
                                        data-oid="blpb9z5"
                                    />
                                </svg>
                            </div>
                            <div data-oid="o3h9hdg">
                                <h1 className="text-2xl font-bold text-gray-900" data-oid="v395l.q">
                                    Vendor Orders
                                </h1>
                                <p className="text-gray-600" data-oid="jm028-8">
                                    Manage customer orders and products
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex items-center space-x-4" data-oid=".4x34bb">
                            <div className="relative" data-oid="tric2s6">
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid="4f99_:p"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                        data-oid="yeb1z5t"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search orders..."
                                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                                    style={{ focusRingColor: BRAND_COLORS.primary }}
                                    data-oid="66kd_1c"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="px-6" data-oid="ybnux5y">
                <div className="mb-6" data-oid="j1r:.ue">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="441cop4">
                        Active Orders ({filteredOrders.length})
                    </h3>

                    {filteredOrders.length === 0 ? (
                        <div className="p-12 text-center" data-oid="kdr8d-:">
                            <svg
                                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="gsqb5-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                    clipRule="evenodd"
                                    data-oid="wne4v1d"
                                />
                            </svg>
                            <h3
                                className="text-lg font-medium text-gray-900 mb-2"
                                data-oid=":qgpeji"
                            >
                                No Orders Found
                            </h3>
                            <p className="text-gray-600" data-oid="wjjjhps">
                                {orders.filter((order) => order.status !== 'delivered').length === 0
                                    ? "You don't have any active orders. Completed orders can be found in the dashboard."
                                    : 'No active orders match your current filters.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6" data-oid="hv5-rat">
                            {filteredOrders.map((order, index) => (
                                <div
                                    key={order.id}
                                    className={`border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-l-4 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                    }`}
                                    style={{ borderLeftColor: BRAND_COLORS.primary }}
                                    data-oid="zyb5-84"
                                >
                                    <div className="p-6" data-oid="egce:_2">
                                        {/* Order Header */}
                                        <div
                                            className="flex items-center justify-between mb-4"
                                            data-oid="x06w:21"
                                        >
                                            <div
                                                className="flex items-center space-x-4"
                                                data-oid="nowe_d_"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: BRAND_COLORS.primary,
                                                    }}
                                                    data-oid="ox82ato"
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        data-oid="2emvfr9"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                                            clipRule="evenodd"
                                                            data-oid="sbxzofp"
                                                        />
                                                    </svg>
                                                </div>
                                                <div data-oid="30e_kx1">
                                                    <h4
                                                        className="text-lg font-semibold text-gray-900"
                                                        data-oid="w2tx6.a"
                                                    >
                                                        {order.orderNumber}
                                                    </h4>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="c5l.qp-"
                                                    >
                                                        {order.customerName} • {order.customerPhone}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="w1d_:-6"
                                            >
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}
                                                    data-oid="h6ttrle"
                                                >
                                                    {order.status.charAt(0).toUpperCase() +
                                                        order.status.slice(1).replace('-', ' ')}
                                                </span>
                                                <span
                                                    className="text-lg font-bold text-gray-900"
                                                    data-oid="ok5zsil"
                                                >
                                                    EGP {order.totalAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="mb-4" data-oid="ltr1hm.">
                                            <h5
                                                className="font-medium text-gray-900 mb-3"
                                                data-oid="-8jd:l_"
                                            >
                                                Order Items ({order.items.length})
                                            </h5>
                                            <div
                                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                                data-oid="55jiulm"
                                            >
                                                {order.items.map((item, itemIndex) => (
                                                    <div
                                                        key={itemIndex}
                                                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                                        data-oid="_zg91zu"
                                                    >
                                                        <div
                                                            className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden"
                                                            data-oid="hb9_you"
                                                        >
                                                            <img
                                                                src={
                                                                    item.image ||
                                                                    `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=50&h=50&fit=crop&crop=center`
                                                                }
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target =
                                                                        e.target as HTMLImageElement;
                                                                    target.src = `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop&crop=center`;
                                                                }}
                                                                data-oid="bsqix:3"
                                                            />
                                                        </div>
                                                        <div className="flex-1" data-oid="xs2457d">
                                                            <h6
                                                                className="font-medium text-gray-900"
                                                                data-oid="xyc.txk"
                                                            >
                                                                {item.productName}
                                                            </h6>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="e8iyp9o"
                                                            >
                                                                {item.manufacturer}
                                                            </p>
                                                            <div
                                                                className="flex items-center justify-between mt-1"
                                                                data-oid="z7n5j54"
                                                            >
                                                                <span
                                                                    className="text-sm font-medium text-green-600"
                                                                    data-oid="ggd_qdb"
                                                                >
                                                                    EGP {item.unitPrice}
                                                                </span>
                                                                <span
                                                                    className="text-sm font-medium text-gray-900"
                                                                    data-oid="j0aqrff"
                                                                >
                                                                    Qty: {item.quantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Delivery Information */}
                                        <div
                                            className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                                            data-oid="nhd1ipd"
                                        >
                                            <div
                                                className="flex items-start space-x-3"
                                                data-oid="3zl71k_"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-blue-600 mt-0.5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    data-oid="ge-d1i8"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                        clipRule="evenodd"
                                                        data-oid="hxkx3kp"
                                                    />
                                                </svg>
                                                <div className="flex-1" data-oid="uot8nf_">
                                                    <h6
                                                        className="font-medium text-blue-900 mb-1"
                                                        data-oid="jb-6o7v"
                                                    >
                                                        Delivery to {order.deliveryAddress.city}
                                                    </h6>
                                                    <p
                                                        className="text-sm text-blue-800"
                                                        data-oid="j3uci91"
                                                    >
                                                        {order.deliveryAddress.street}
                                                    </p>
                                                    <p
                                                        className="text-sm text-blue-800"
                                                        data-oid="rsz981k"
                                                    >
                                                        {order.deliveryAddress.governorate}
                                                    </p>
                                                    {order.deliveryAddress.notes && (
                                                        <p
                                                            className="text-sm text-blue-700 mt-2 italic"
                                                            data-oid=".i5t5u9"
                                                        >
                                                            Note: {order.deliveryAddress.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div
                                            className="flex items-center justify-between pt-4 border-t border-gray-200"
                                            data-oid="m7yobbl"
                                        >
                                            <div
                                                className="flex items-center space-x-2 text-sm text-gray-600"
                                                data-oid="rvklqid"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    data-oid="kfz:6l7"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                        clipRule="evenodd"
                                                        data-oid="obz4nmd"
                                                    />
                                                </svg>
                                                <span data-oid="8vmrpvn">
                                                    {new Date(order.createdAt).toLocaleDateString()}{' '}
                                                    •{' '}
                                                    {new Date(order.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>

                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="scj8k94"
                                            >
                                                {getNextStatus(order.status) && (
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                order.id,
                                                                getNextStatus(order.status)!,
                                                            )
                                                        }
                                                        className="px-4 py-2 rounded-lg font-medium transition-colors text-white hover:opacity-90"
                                                        style={{
                                                            backgroundColor: BRAND_COLORS.primary,
                                                        }}
                                                        data-oid="wgejo4s"
                                                    >
                                                        {getNextStatusLabel(order.status)}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
