'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { providerOrderService, vendorManagementService } from '@/lib/services/vendorManagementService';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { VendorAnalyticsDashboard } from '@/components/analytics/VendorAnalyticsDashboard';
import { VendorInventoryManagement } from '@/components/inventory/VendorInventoryManagement';
import { VendorReturnsManager } from '@/components/vendor/VendorReturnsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    paymentMethod: string;
    vendorNotes?: string;
}

export default function VendorDashboardPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        newOrders: 'NA',
        preparingOrders: 'NA',
        readyOrders: 'NA',
        todayRevenue: 'NA',
        averagePreparationTime: 'NA',
    });
    const [revenueData, setRevenueData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const handleOrderClick = (order: VendorOrder) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    const closeOrderModal = () => {
        setIsOrderModalOpen(false);
        setSelectedOrder(null);
    };
    const getUser = async():Promise<string>=>{
        const token = Cookies.get('authToken')
        const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`,{
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
        const data = await user.json()
        console.log(data.data.vendor._id)
        return data.data.vendor._id;
    }
    useEffect(() => {
        const loadData = async() => {
            try {
                
                const userId = await getUser()
                const allOrders = await providerOrderService.getAllOrders({},userId);
                // const orderStats = await providerOrderService.getOrderStats();
                const mockStats = {
                    totalOrders: allOrders.pagination.totalRecords,
                    newOrders: 'NA',
                    preparingOrders: 'NA',
                    readyOrders: 'NA',
                    todayRevenue: 'NA',
                    averagePreparationTime: 'NA',
                };
                const mockRevenue = {
                    total: 'NA',
                    growth: 'NA',
                    monthly: [
                        { month: 'Jan', amount: 'NA' },
                        { month: 'Feb', amount: 'NA' },
                        { month: 'Mar', amount: 'NA' },
                        { month: 'Apr', amount: 'NA' },
                        { month: 'May', amount: 'NA' },
                        { month: 'Jun', amount: 'NA' },
                    ],
                };

                setOrders(allOrders.data);
                setStats(mockStats);
                setRevenueData(mockRevenue);
                setLoading(false);
            } catch (error) {
                console.error('Error loading vendor data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="nrx.tnf"
            >
                <div className="text-center" data-oid="8buw927">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F] mx-auto mb-4"
                        data-oid="qxjem8v"
                    ></div>
                    <p className="text-gray-600" data-oid="wk30rsh">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="bmcs_wb">
            {/* Main Dashboard Content */}
            <div className="p-6 space-y-6" data-oid="-wl6zn4">
                {/* Dashboard Tabs */}
                <Tabs defaultValue="analytics" className="space-y-6" data-oid="qbcsijz">
                    <TabsList className="grid w-full grid-cols-4" data-oid="lvqoy9.">
                        <TabsTrigger value="analytics" data-oid="_yg381b">
                            Analytics Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="operations" data-oid="rhv6nv8">
                            Operations View
                        </TabsTrigger>
                        <TabsTrigger value="completed" data-oid="completed-tab">
                            Completed Orders
                        </TabsTrigger>
                        <TabsTrigger value="returns" data-oid="u1xv-4u">
                            Returns Management
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="analytics" data-oid="t2.jy_6">
                        <VendorAnalyticsDashboard data-oid="172h5xg" />
                    </TabsContent>

                    <TabsContent value="operations" data-oid="s8-m:6o">
                        <VendorInventoryManagement data-oid="utpfw3o" />
                    </TabsContent>

                    <TabsContent value="completed" data-oid="completed-content">
                        <div className="space-y-6" data-oid="completed-orders-section">
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                                data-oid="completed-orders-container"
                            >
                                <div
                                    className="flex items-center justify-between mb-6"
                                    data-oid="completed-orders-header"
                                >
                                    <div data-oid="completed-orders-title">
                                        <h2
                                            className="text-xl font-semibold text-gray-900"
                                            data-oid="completed-orders-heading"
                                        >
                                            Completed Orders
                                        </h2>
                                        <p
                                            className="text-gray-600 mt-1"
                                            data-oid="completed-orders-subtitle"
                                        >
                                            All completed and delivered orders
                                        </p>
                                    </div>
                                    <div
                                        className="flex items-center space-x-2"
                                        data-oid="completed-orders-badge"
                                    >
                                        <span
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                            data-oid="completed-orders-count"
                                        >
                                            {
                                                orders.filter(
                                                    (order) => order.status === 'delivered',
                                                ).length
                                            }{' '}
                                            Orders
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4" data-oid="completed-orders-list">
                                    {orders.filter((order) => order.status === 'delivered')
                                        .length === 0 ? (
                                        <div
                                            className="text-center py-12"
                                            data-oid="no-completed-orders"
                                        >
                                            <svg
                                                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid="no-orders-icon"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                    data-oid="checkmark-path"
                                                />
                                            </svg>
                                            <h3
                                                className="text-lg font-medium text-gray-900 mb-2"
                                                data-oid="no-orders-title"
                                            >
                                                No Completed Orders
                                            </h3>
                                            <p
                                                className="text-gray-600"
                                                data-oid="no-orders-description"
                                            >
                                                Completed orders will appear here once delivered.
                                            </p>
                                        </div>
                                    ) : (
                                        orders
                                            .filter((order) => order.status === 'delivered')
                                            .map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-l-4 cursor-pointer"
                                                    style={{ borderLeftColor: '#1F1F6F' }}
                                                    onClick={() => handleOrderClick(order)}
                                                    data-oid="completed-order-card"
                                                >
                                                    <div
                                                        className="p-6"
                                                        data-oid="order-card-content"
                                                    >
                                                        {/* Order Header */}
                                                        <div
                                                            className="flex items-center justify-between mb-4"
                                                            data-oid="order-header"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-4"
                                                                data-oid="order-info"
                                                            >
                                                                <div
                                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                                    style={{
                                                                        backgroundColor: '#1F1F6F',
                                                                    }}
                                                                    data-oid="order-icon"
                                                                >
                                                                    <svg
                                                                        className="w-5 h-5 text-white"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                        data-oid="order-icon-svg"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                                                            clipRule="evenodd"
                                                                            data-oid="order-icon-path"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div data-oid="order-details">
                                                                    <div
                                                                        className="flex items-center space-x-2"
                                                                        data-oid="order-number-row"
                                                                    >
                                                                        <h4
                                                                            className="text-lg font-semibold text-gray-900"
                                                                            data-oid="order-number"
                                                                        >
                                                                            {order.orderNumber}
                                                                        </h4>
                                                                    </div>
                                                                    <p
                                                                        className="text-sm text-gray-600"
                                                                        data-oid="customer-info"
                                                                    >
                                                                        {order.customerName} •{' '}
                                                                        {order.customerPhone}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-3"
                                                                data-oid="order-status-price"
                                                            >
                                                                <span
                                                                    className="px-3 py-1 rounded-full text-sm font-medium border bg-green-100 text-green-800 border-green-200"
                                                                    data-oid="delivered-badge"
                                                                >
                                                                    Delivered
                                                                </span>
                                                                <span
                                                                    className="text-lg font-bold text-gray-900"
                                                                    data-oid="order-total"
                                                                >
                                                                    EGP{' '}
                                                                    {order.totalAmount.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Order Items Section */}
                                                        <div
                                                            className="mb-4"
                                                            data-oid="order-items-section"
                                                        >
                                                            <h5
                                                                className="font-medium text-gray-900 mb-3"
                                                                data-oid="items-title"
                                                            >
                                                                Order Items ({order.items.length})
                                                            </h5>
                                                            <div
                                                                className="space-y-3"
                                                                data-oid="items-list"
                                                            >
                                                                {order.items.map(
                                                                    (item, itemIndex) => (
                                                                        <div
                                                                            key={itemIndex}
                                                                            className="flex items-center space-x-3"
                                                                            data-oid="item-row"
                                                                        >
                                                                            <div
                                                                                className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden"
                                                                                data-oid="item-image-container"
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        item.image ||
                                                                                        `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=50&h=50&fit=crop&crop=center`
                                                                                    }
                                                                                    alt={
                                                                                        item.productName
                                                                                    }
                                                                                    className="w-full h-full object-cover"
                                                                                    onError={(
                                                                                        e,
                                                                                    ) => {
                                                                                        const target =
                                                                                            e.target as HTMLImageElement;
                                                                                        target.src = `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop&crop=center`;
                                                                                    }}
                                                                                    data-oid="item-image"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                className="flex-1"
                                                                                data-oid="item-details"
                                                                            >
                                                                                <div
                                                                                    className="flex items-center justify-between"
                                                                                    data-oid="item-info-row"
                                                                                >
                                                                                    <div data-oid="item-name-manufacturer">
                                                                                        <h6
                                                                                            className="font-medium text-gray-900"
                                                                                            data-oid="item-name"
                                                                                        >
                                                                                            {
                                                                                                item.productName
                                                                                            }
                                                                                        </h6>
                                                                                        <p
                                                                                            className="text-sm text-gray-600"
                                                                                            data-oid="item-manufacturer"
                                                                                        >
                                                                                            {
                                                                                                item.manufacturer
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                    <div
                                                                                        className="text-right"
                                                                                        data-oid="item-price-qty"
                                                                                    >
                                                                                        <p
                                                                                            className="font-medium text-green-600"
                                                                                            data-oid="item-price"
                                                                                        >
                                                                                            EGP{' '}
                                                                                            {
                                                                                                item.unitPrice
                                                                                            }
                                                                                        </p>
                                                                                        <p
                                                                                            className="text-sm text-gray-600"
                                                                                            data-oid="item-quantity"
                                                                                        >
                                                                                            Qty:{' '}
                                                                                            {
                                                                                                item.quantity
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Delivery Information */}
                                                        <div
                                                            className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                                                            data-oid="delivery-info"
                                                        >
                                                            <div
                                                                className="flex items-start space-x-3"
                                                                data-oid="delivery-content"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5 text-blue-600 mt-0.5"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    data-oid="location-icon"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                                        clipRule="evenodd"
                                                                        data-oid="location-path"
                                                                    />
                                                                </svg>
                                                                <div
                                                                    className="flex-1"
                                                                    data-oid="delivery-address"
                                                                >
                                                                    <h6
                                                                        className="font-medium text-blue-900 mb-1"
                                                                        data-oid="delivery-title"
                                                                    >
                                                                        Delivery to{' '}
                                                                        {order.deliveryAddress.city}
                                                                    </h6>
                                                                    <p
                                                                        className="text-sm text-blue-800"
                                                                        data-oid="delivery-street"
                                                                    >
                                                                        {
                                                                            order.deliveryAddress
                                                                                .street
                                                                        }
                                                                    </p>
                                                                    <p
                                                                        className="text-sm text-blue-800"
                                                                        data-oid="delivery-governorate"
                                                                    >
                                                                        {
                                                                            order.deliveryAddress
                                                                                .governorate
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Footer with timestamp and action */}
                                                        <div
                                                            className="flex items-center justify-between pt-4 border-t border-gray-200"
                                                            data-oid="order-footer"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-2 text-sm text-gray-600"
                                                                data-oid="order-timestamp"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    data-oid="clock-icon"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                                        clipRule="evenodd"
                                                                        data-oid="clock-path"
                                                                    />
                                                                </svg>
                                                                <span data-oid="order-date">
                                                                    {new Date(
                                                                        order.updatedAt,
                                                                    ).toLocaleDateString()}{' '}
                                                                    •{' '}
                                                                    {new Date(
                                                                        order.updatedAt,
                                                                    ).toLocaleTimeString()}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOrderClick(order);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                                data-oid="view-details-btn"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="returns" data-oid=":f_pobc">
                        <VendorReturnsManager vendorId="electroplus-vendor" data-oid="bk9h1xd" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
