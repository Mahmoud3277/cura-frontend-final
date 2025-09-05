'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Vendor Order interface
interface VendorOrder {
    id: string;
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
    status: 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt?: string;
    paymentMethod: string;
    vendorNotes?: string;
}

export default function CompletedOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<VendorOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Load orders - Mock data for vendor
    useEffect(() => {
        const loadOrders = () => {
            try {
                // Mock vendor completed orders data
                const mockVendorOrders: VendorOrder[] = [
                    {
                        id: 'vendor-001',
                        orderNumber: 'VND-001',
                        customerName: 'Ahmed Hassan',
                        customerPhone: '+20 11 690 7244',
                        deliveryAddress: {
                            street: '15 Tahrir Square',
                            area: 'Downtown',
                            city: 'Cairo',
                            governorate: 'Cairo',
                            notes: 'Near the metro station',
                        },
                        items: [
                            {
                                productName: 'Wireless Headphones',
                                quantity: 1,
                                unitPrice: 450,
                                manufacturer: 'Sony',
                                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
                            },
                            {
                                productName: 'Phone Case',
                                quantity: 2,
                                unitPrice: 85,
                                manufacturer: 'Apple',
                                image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop&crop=center',
                            },
                        ],

                        totalAmount: 620,
                        status: 'delivered',
                        createdAt: '2024-01-15T10:30:00Z',
                        updatedAt: '2024-01-16T14:20:00Z',
                        paymentMethod: 'card',
                    },
                    {
                        id: 'vendor-002',
                        orderNumber: 'VND-002',
                        customerName: 'Fatima Ali',
                        customerPhone: '+20 12 731 7479',
                        deliveryAddress: {
                            street: '50 Main Street, Apt 5',
                            area: 'Zamalek',
                            city: 'Giza',
                            governorate: 'Giza',
                        },
                        items: [
                            {
                                productName: 'Medicine Pack',
                                quantity: 3,
                                unitPrice: 78,
                                manufacturer: 'Egyptian Pharmaceutical Company',
                                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center',
                            },
                        ],

                        totalAmount: 398,
                        status: 'delivered',
                        createdAt: '2024-01-14T09:15:00Z',
                        updatedAt: '2024-01-15T11:30:00Z',
                        paymentMethod: 'cash',
                    },
                ];

                // Filter only delivered orders
                const completedOrders = mockVendorOrders.filter(
                    (order) => order.status === 'delivered',
                );
                setOrders(completedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error loading orders:', error);
                setLoading(false);
            }
        };

        loadOrders();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="d3f:763">
                <div className="text-center" data-oid="2ps3xo0">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-cura-primary mx-auto mb-4"
                        data-oid="x0qrv8:"
                    ></div>
                    <p className="text-cura-light" data-oid="r9cwnoc">
                        Loading completed orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="gaxk8vp">
            {/* Header */}
            <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                data-oid="kd3_9ap"
            >
                <div className="flex items-center justify-between" data-oid="xgoeih2">
                    <div data-oid="738wj4j">
                        <h1 className="text-2xl font-bold text-gray-900" data-oid="0zyf84:">
                            Completed Orders
                        </h1>
                        <p className="text-gray-600 mt-1" data-oid="3db.2i4">
                            View all successfully delivered orders
                        </p>
                    </div>
                    <div className="text-right" data-oid="1a7j-jp">
                        <div className="text-3xl font-bold text-cura-primary" data-oid="oykbuvk">
                            {orders.length}
                        </div>
                        <div className="text-sm text-cura-light" data-oid="rl62p1m">
                            Total Completed
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4" data-oid="qj9hw5m">
                {filteredOrders.length === 0 ? (
                    <div
                        className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
                        data-oid="tj6pijv"
                    >
                        <div className="text-gray-400 text-6xl mb-4" data-oid="t8qid8:">
                            📦
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="i0c4x2x">
                            No Completed Orders
                        </h3>
                        <p className="text-gray-600" data-oid="cid2n-m">
                            {orders.length === 0
                                ? "You don't have any completed orders yet."
                                : 'No orders match your search.'}
                        </p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            data-oid="hd:re.w"
                        >
                            {/* Order Header */}
                            <div
                                className="bg-gray-50 px-6 py-4 border-b border-gray-200"
                                data-oid="kl5tyzl"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="1:b47oe"
                                >
                                    <div className="flex items-center space-x-3" data-oid="_bh16fh">
                                        <div
                                            className="w-10 h-10 bg-cura-primary rounded-lg flex items-center justify-center"
                                            data-oid="t5vhwwu"
                                        >
                                            <span
                                                className="text-white font-bold text-sm"
                                                data-oid="dbooc5s"
                                            >
                                                {order.orderNumber.split('-')[1]}
                                            </span>
                                        </div>
                                        <div data-oid="sf1ct:l">
                                            <h3
                                                className="text-lg font-bold text-gray-900"
                                                data-oid="an-m-yw"
                                            >
                                                {order.orderNumber}
                                            </h3>
                                            <p
                                                className="text-sm text-cura-light"
                                                data-oid="5owa9n_"
                                            >
                                                Order delivered successfully
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right" data-oid="_:ev1ib">
                                        <div
                                            className="flex items-center space-x-2 mb-1"
                                            data-oid="hzlqu0z"
                                        >
                                            <span
                                                className="px-3 py-1 bg-cura-primary/10 text-cura-primary text-sm font-medium rounded-full"
                                                data-oid="4v4ppp2"
                                            >
                                                Delivered
                                            </span>
                                            <span
                                                className="text-lg font-bold text-cura-secondary"
                                                data-oid="k4l55ws"
                                            >
                                                EGP {order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-6" data-oid="anm:y:l">
                                {/* Order Items */}
                                <div className="mb-6" data-oid="bvpkgm8">
                                    <h4
                                        className="text-sm font-medium text-gray-900 mb-3"
                                        data-oid="1sos74c"
                                    >
                                        Order Items ({order.items.length})
                                    </h4>
                                    <div className="space-y-3" data-oid="bbvc_yu">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-3"
                                                data-oid="en9hh_e"
                                            >
                                                <div
                                                    className="flex items-center space-x-3"
                                                    data-oid=".8wcjtk"
                                                >
                                                    <div
                                                        className="w-12 h-12 rounded-lg overflow-hidden border border-cura-light/20"
                                                        data-oid="z021_sa"
                                                    >
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                                data-oid="product-image"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="w-full h-full bg-cura-light/10 flex items-center justify-center"
                                                                data-oid=":jl.cui"
                                                            >
                                                                <span
                                                                    className="text-cura-light text-xl"
                                                                    data-oid="2m:wuns"
                                                                >
                                                                    📦
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div data-oid="9wr3gmz">
                                                        <h5
                                                            className="font-medium text-gray-900"
                                                            data-oid="n8t8435"
                                                        >
                                                            {item.productName}
                                                        </h5>
                                                        <p
                                                            className="text-sm text-cura-light"
                                                            data-oid="9i:d_cl"
                                                        >
                                                            {item.manufacturer}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right" data-oid="u2xakb_">
                                                    <div
                                                        className="font-medium text-cura-secondary"
                                                        data-oid="gr3:0:_"
                                                    >
                                                        EGP {item.unitPrice}
                                                    </div>
                                                    <div
                                                        className="text-sm text-cura-light"
                                                        data-oid="k-s-ce8"
                                                    >
                                                        Qty: {item.quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Information */}
                                <div
                                    className="bg-cura-primary/5 rounded-lg p-4 mb-4"
                                    data-oid="6on0:ak"
                                >
                                    <div className="flex items-start space-x-2" data-oid="2:7dece">
                                        <svg
                                            className="w-5 h-5 text-cura-primary mt-0.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            data-oid="s8e7u_6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                                data-oid="2q861xe"
                                            />
                                        </svg>
                                        <div className="flex-1" data-oid="tsuynrt">
                                            <h6
                                                className="font-medium text-cura-secondary mb-1"
                                                data-oid="xomvbzp"
                                            >
                                                Delivery to {order.deliveryAddress.city}
                                            </h6>
                                            <p
                                                className="text-sm text-cura-accent"
                                                data-oid="15okqol"
                                            >
                                                {order.deliveryAddress.street}
                                            </p>
                                            <p
                                                className="text-sm text-cura-accent"
                                                data-oid="2nlq1js"
                                            >
                                                {order.deliveryAddress.city}
                                            </p>
                                            {order.deliveryAddress.notes && (
                                                <div
                                                    className="mt-2 p-2 bg-cura-primary/10 rounded text-sm text-cura-secondary"
                                                    data-oid="2ilr:_w"
                                                >
                                                    <span
                                                        className="font-medium"
                                                        data-oid="6uz70r8"
                                                    >
                                                        Note:
                                                    </span>{' '}
                                                    {order.deliveryAddress.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div
                                    className="flex items-center justify-between pt-4 border-t border-gray-200"
                                    data-oid="_74p7-0"
                                >
                                    <div
                                        className="flex items-center space-x-2 text-sm text-cura-light"
                                        data-oid="fc85ao8"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="vk3iwo6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="uqk5sb_"
                                            />
                                        </svg>
                                        <span data-oid="fd2ioen">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB')}{' '}
                                            •{' '}
                                            {new Date(order.createdAt).toLocaleTimeString('en-GB', {
                                                hour12: false,
                                            })}
                                        </span>
                                    </div>
                                    <button
                                        className="px-6 py-2 bg-cura-primary text-white rounded-lg font-medium hover:bg-cura-secondary transition-colors flex items-center space-x-2"
                                        data-oid="2_ju1k1"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="jg_s5qz"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                                data-oid="..bp5lw"
                                            />
                                        </svg>
                                        <span data-oid="pgf7p_6">Completed</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
