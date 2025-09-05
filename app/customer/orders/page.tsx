'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, Banknote, Eye, RotateCcw, ShoppingCart } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useCart } from '@/lib/contexts/CartContext';
import { OrderDetailsModal } from '@/components/customer/OrderDetailsModal';
import { ReturnOrderModal } from '@/components/customer/ReturnOrderModal';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAuth } from '@/lib/contexts/AuthContext';
interface Order {
    _id: string;
    date: string;
    items: { productName: string; quantity: number; image: string; prescription?: any[] }[];
    total: string;
    status: string;
    pharmacyName: string;
    deliveryAddress: string;
    estimatedDate: string;
    prescriptionRequired?: boolean;
    prescriptionId?: string;
    returnInfo?: {
        id: string;
        status: 'requested' | 'approved' | 'rejected' | 'processing' | 'completed';
        refundAmount: number;
    };
    customerId: string;
    createdAt: Date;
    updatedAt: Date;
    totalAmount: number;
    city: string;
}

export default function CustomerOrdersPage() {
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');
    const { getCustomerOrders } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [orderFilter, setOrderFilter] = useState<
        'all' | 'delivered' | 'processing' | 'cancelled' | 'returned'
    >('all');
    const {user} = useAuth()
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            
            const result = await getCustomerOrders(user);
            if (result.success) {
                // Assuming the API returns a list of orders. You might need to adjust the date and total to match the Order interface.
                console.log(result)
                setOrders(
                    result.orders.map((order: any) => ({
                        ...order,
                        date: new Date(order.createdAt).toLocaleDateString(),
                        total: `${order.totalAmount.toFixed(2)} EGP`,
                    }))
                );
                
            } else {
                setError(result.error);
            }
            setLoading(false);
        };

        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredOrders = orders.filter((order) => {
        if (orderFilter === 'all') return true;
        if (orderFilter === 'returned') return order.returnInfo;
        return order.status.toLowerCase() === orderFilter;
    });

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    const handleReturnOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsReturnModalOpen(true);
    };

    const handleBuyAgain = (order: Order) => {
        // ... (your existing buy again logic) ...
        router.push('/cart');
    };

    const handleReturnSubmitted = (returnId: string) => {
        console.log('Return submitted:', returnId);
        alert('Return request submitted successfully!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p>Error loading orders: {error}</p>;
    }

    return (
        <>
            {/* Mobile Layout */}
            <div className="block md:hidden min-h-screen bg-gray-50" data-oid="mobile-layout">
                <ResponsiveHeader data-oid="mobile-header" />

                <div className="px-4 py-6" data-oid="mobile-content">
                    <div className="mb-6" data-oid="mobile-title">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="mobile-h1">
                            {tCustomer('orders.title')}
                        </h1>
                        <div
                            className="h-1 w-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full"
                            data-oid="mobile-divider"
                        ></div>
                    </div>

                    {/* Mobile Filters */}
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
                        data-oid="mobile-filters"
                    >
                        <div className="flex flex-wrap gap-2" data-oid="mobile-filter-buttons">
                            {[
                                { key: 'all', label: tCustomer('orders.filters.all') },
                                { key: 'delivered', label: tCustomer('orders.filters.delivered') },
                                {
                                    key: 'processing',
                                    label: tCustomer('orders.filters.processing'),
                                },
                                { key: 'returned', label: tCustomer('orders.filters.returned') },
                            ].map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => setOrderFilter(filter.key as any)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        orderFilter === filter.key
                                            ? 'bg-[#1F1F6F] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    data-oid="mobile-filter-btn"
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Orders List */}
                    <div className="space-y-4" data-oid="mobile-orders">
                        {filteredOrders.length === 0 ? (
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
                                data-oid="mobile-no-orders"
                            >
                                <Package
                                    className="w-12 h-12 text-gray-300 mx-auto mb-4"
                                    data-oid="mobile-package-icon"
                                />

                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="mobile-no-orders-title"
                                >
                                    {tCustomer('orders.noOrders')}
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="mobile-no-orders-desc">
                                    {tCustomer('orders.noOrdersDescription')}
                                </p>
                                <button
                                    className="bg-[#1F1F6F] text-white px-6 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                                    data-oid="mobile-start-shopping"
                                >
                                    {tCustomer('orders.startShopping')}
                                </button>
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                                    data-oid="mobile-order-card"
                                >
                                    <div
                                        className="flex items-start justify-between mb-3"
                                        data-oid="mobile-order-header"
                                    >
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="mobile-order-info"
                                        >
                                            <div
                                                className="w-10 h-10 bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                                                data-oid="mobile-order-icon"
                                            >
                                                <Package
                                                    className="w-5 h-5 text-[#1F1F6F]"
                                                    data-oid="mobile-package"
                                                />
                                            </div>
                                            <div data-oid="mobile-order-details">
                                                <h3
                                                    className="text-base font-semibold text-gray-900"
                                                    data-oid="mobile-order-id"
                                                >
                                                    {order._id}
                                                </h3>
                                                <div
                                                    className="flex items-center space-x-3 text-xs text-gray-600"
                                                    data-oid="mobile-order-meta"
                                                >
                                                    <span
                                                        className="flex items-center"
                                                        data-oid="mobile-order-date"
                                                    >
                                                        <Calendar
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="mobile-calendar"
                                                        />

                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span
                                                        className="flex items-center"
                                                        data-oid="mobile-order-total"
                                                    >
                                                        <Banknote
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="mobile-banknote"
                                                        />

                                                        {order.totalAmount.toFixed(2)} EGP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="flex flex-col items-end space-y-1"
                                            data-oid="mobile-order-status"
                                        >
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                                                data-oid="mobile-status-badge"
                                            >
                                                {tCustomer(`orders.statuses.${order.status}`)}
                                            </span>
                                            {order.returnInfo && (
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        order.returnInfo.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.returnInfo.status === 'approved'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : order.returnInfo.status ===
                                                                  'rejected'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                    data-oid="mobile-return-badge"
                                                >
                                                    Return: {order.returnInfo.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Order Items - Scrollable with Images */}
                                    <div className="mb-3" data-oid="mobile-order-items">
                                        <div className="mb-2" data-oid="g0:sqvm">
                                            <span
                                                className="text-xs font-medium text-gray-600"
                                                data-oid="xj03t5q"
                                            >
                                                {tCustomer('orders.labels.items')} (
                                                {order.items.length})
                                            </span>
                                        </div>
                                        <div
                                            className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide"
                                            data-oid="mobile-items-scroll"
                                            style={{
                                                scrollbarWidth: 'none',
                                                msOverflowStyle: 'none',
                                            }}
                                        >
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex-shrink-0 bg-gray-50 rounded-lg p-2 min-w-[120px]"
                                                    data-oid="mobile-item-card"
                                                >
                                                    <div
                                                        className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 mx-auto mb-2"
                                                        data-oid="mobile-item-image"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.productName}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                // Fallback to a placeholder image if the product image fails to load
                                                                e.currentTarget.src =
                                                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
                                                            }}
                                                            data-oid="msrwha:"
                                                        />
                                                    </div>
                                                    <div className="text-center" data-oid="xd3ma6-">
                                                        <p
                                                            className="text-xs text-gray-700 font-medium line-clamp-2 mb-1"
                                                            data-oid="mobile-item-name"
                                                            style={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            {item.productName}
                                                        </p>
                                                        <span
                                                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium"
                                                            data-oid="mobile-item-qty"
                                                        >
                                                            ×{item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {order.items.length > 2 && (
                                            <div className="text-center mt-1" data-oid="1rqcad6">
                                                <span
                                                    className="text-xs text-gray-400"
                                                    data-oid=":yjro72"
                                                >
                                                    ← Scroll to see all items →
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Action Buttons */}
                                    <div
                                        className="flex justify-between items-center pt-3 border-t border-gray-100"
                                        data-oid="mobile-actions"
                                    >
                                        <div
                                            className="flex space-x-2"
                                            data-oid="mobile-action-buttons"
                                        >
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="flex items-center space-x-1 text-[#1F1F6F] hover:text-[#14274E] font-medium text-sm"
                                                data-oid="mobile-view-btn"
                                            >
                                                <Eye className="w-3 h-3" data-oid="mobile-eye" />
                                                <span data-oid="mobile-view-text">View</span>
                                            </button>
                                            {order.status === 'delivered' && !order.returnInfo && (
                                                <button
                                                    onClick={() => handleReturnOrder(order)}
                                                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm"
                                                    data-oid="mobile-return-btn"
                                                >
                                                    <RotateCcw
                                                        className="w-3 h-3"
                                                        data-oid="mobile-return-icon"
                                                    />

                                                    <span data-oid="mobile-return-text">
                                                        Return
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                        {(order.status === 'delivered' ||
                                            order.status === 'processing') && (
                                            <button
                                                onClick={() => handleBuyAgain(order)}
                                                className="flex items-center space-x-1 bg-[#1F1F6F] text-white px-3 py-1.5 rounded-lg hover:bg-[#14274E] transition-colors text-sm"
                                                data-oid="mobile-buy-again"
                                            >
                                                <ShoppingCart
                                                    className="w-3 h-3"
                                                    data-oid="mobile-cart"
                                                />

                                                <span data-oid="mobile-buy-text">Buy Again</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Padding - reduced since no floating nav */}
                <div className="h-4 md:hidden" data-oid="mobile-bottom-padding"></div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block" data-oid="desktop-layout">
                <DashboardLayout
                    title={tCustomer('orders.title')}
                    userType="customer"
                    data-oid="7kqz6:f"
                >
                    <div className="min-h-screen bg-gray-50 py-8" data-oid="t5xqcfh">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="7w.6j4w">
                            {/* Header */}
                            <div className="mb-8" data-oid="nsykvc2">
                                <h1
                                    className="text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="8pppcm_"
                                >
                                    {tCustomer('orders.title')}
                                </h1>
                                <p className="text-gray-600" data-oid="lx0ywlw">
                                    {tCustomer('orders.subtitle')}
                                </p>
                            </div>

                            {/* Filters */}
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
                                data-oid="2ms7ldh"
                            >
                                <div className="flex flex-wrap gap-2" data-oid="yaonpq.">
                                    {[
                                        { key: 'all', label: tCustomer('orders.filters.all') },
                                        {
                                            key: 'delivered',
                                            label: tCustomer('orders.filters.delivered'),
                                        },
                                        {
                                            key: 'processing',
                                            label: tCustomer('orders.filters.processing'),
                                        },
                                        {
                                            key: 'returned',
                                            label: tCustomer('orders.filters.returned'),
                                        },
                                    ].map((filter) => (
                                        <button
                                            key={filter.key}
                                            onClick={() => setOrderFilter(filter.key as any)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                orderFilter === filter.key
                                                    ? 'bg-[#1F1F6F] text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                            data-oid="z6blyaz"
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="space-y-4" data-oid="qbx00vd">
                                {filteredOrders.length === 0 ? (
                                    <div
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
                                        data-oid="ofb947k"
                                    >
                                        <Package
                                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                            data-oid="9yao4j8"
                                        />

                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-2"
                                            data-oid="yiotkl."
                                        >
                                            {tCustomer('orders.noOrders')}
                                        </h3>
                                        <p className="text-gray-600 mb-6" data-oid="lk1-eb6">
                                            {tCustomer('orders.noOrdersDescription')}
                                        </p>
                                        <button
                                            className="bg-[#1F1F6F] text-white px-6 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                                            data-oid="p.d8:ix"
                                        >
                                            {tCustomer('orders.startShopping')}
                                        </button>
                                    </div>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <div
                                            key={order._id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                            data-oid="8cv:9wa"
                                        >
                                            <div
                                                className="flex items-start justify-between mb-4"
                                                data-oid="bhm8fnf"
                                            >
                                                <div
                                                    className="flex items-center space-x-4"
                                                    data-oid="qmtd7bu"
                                                >
                                                    <div
                                                        className="w-12 h-12 bg-[#1F1F6F]/10 rounded-xl flex items-center justify-center"
                                                        data-oid="7a5jhbw"
                                                    >
                                                        <Package
                                                            className="w-6 h-6 text-[#1F1F6F]"
                                                            data-oid="tuzp6m0"
                                                        />
                                                    </div>
                                                    <div data-oid=".tkdsbj">
                                                        <h3
                                                            className="text-lg font-semibold text-gray-900"
                                                            data-oid=":64q6.g"
                                                        >
                                                            {order._id}
                                                        </h3>
                                                        <div
                                                            className="flex items-center space-x-4 text-sm text-gray-600"
                                                            data-oid="-aaigyd"
                                                        >
                                                            <span
                                                                className="flex items-center"
                                                                data-oid="yccz31f"
                                                            >
                                                                <Calendar
                                                                    className="w-4 h-4 mr-1"
                                                                    data-oid="8pdbdpr"
                                                                />

                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span
                                                                className="flex items-center"
                                                                data-oid="3q0r366"
                                                            >
                                                                <Banknote
                                                                    className="w-4 h-4 mr-1"
                                                                    data-oid="e511m9."
                                                                />

                                                                {order.totalAmount.toFixed(2)} EGP
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex items-center space-x-3"
                                                    data-oid="v1772wl"
                                                >
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                            order.status,
                                                        )}`}
                                                        data-oid="-zqd_s2"
                                                    >
                                                        {tCustomer(
                                                            `orders.statuses.${order.status}`,
                                                        )}
                                                    </span>
                                                    {order.returnInfo && (
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                order.returnInfo.status ===
                                                                'completed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : order.returnInfo.status ===
                                                                        'approved'
                                                                      ? 'bg-blue-100 text-blue-800'
                                                                      : order.returnInfo.status ===
                                                                          'rejected'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                            data-oid="r69ddog"
                                                        >
                                                            {tCustomer(
                                                                'orders.labels.returnStatus',
                                                                {
                                                                    status: order.returnInfo.status,
                                                                },
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="mb-4" data-oid="z-wl_61">
                                                <div
                                                    className="flex flex-wrap gap-2"
                                                    data-oid="-wti0.q"
                                                >
                                                    {order.items.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2"
                                                            data-oid="n7kohyl"
                                                        >
                                                            <div
                                                                className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0"
                                                                data-oid="3.az:ee"
                                                            >
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.productName}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        // Fallback to a placeholder image if the product image fails to load
                                                                        e.currentTarget.src =
                                                                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
                                                                    }}
                                                                    data-oid="3db2rez"
                                                                />
                                                            </div>
                                                            <span
                                                                className="text-sm text-gray-700"
                                                                data-oid="5ast:ag"
                                                            >
                                                                {item.productName}
                                                            </span>
                                                            <span
                                                                className="text-xs text-gray-500"
                                                                data-oid="vqk0i5g"
                                                            >
                                                                ×{item.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Pharmacy and Prescription Info */}
                                            <div
                                                className="mb-4 text-sm text-gray-600"
                                                data-oid="s:sxj:y"
                                            >
                                                <p data-oid="hizy3pw">
                                                    <strong data-oid="w6hovmj">
                                                        {tCustomer('orders.labels.pharmacy')}:
                                                    </strong>{' '}
                                                    {order.pharmacyName}
                                                </p>
                                                {order.prescriptionRequired && (
                                                    <p data-oid="4.cv0ka">
                                                        <strong data-oid="tr5c.aa">
                                                            {tCustomer(
                                                                'orders.labels.prescriptionId',
                                                            )}
                                                            :
                                                        </strong>{' '}
                                                        {order.prescriptionId}
                                                    </p>
                                                )}
                                                {order.returnInfo &&
                                                    order.returnInfo.status === 'completed' && (
                                                        <p
                                                            className="text-green-600"
                                                            data-oid="rn_d8ku"
                                                        >
                                                            <strong data-oid="o.1aqw-">
                                                                {tCustomer(
                                                                    'orders.labels.refunded',
                                                                )}
                                                                :
                                                            </strong>{' '}
                                                            {order.returnInfo.refundAmount.toFixed(
                                                                2,
                                                            )}{' '}
                                                            EGP
                                                        </p>
                                                    )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div
                                                className="flex justify-between items-center pt-4 border-t border-gray-100"
                                                data-oid="k0rwpe0"
                                            >
                                                <div className="flex space-x-3" data-oid=":0do8io">
                                                    <button
                                                        onClick={() => handleViewOrder(order)}
                                                        className="flex items-center space-x-2 text-[#1F1F6F] hover:text-[#14274E] font-medium"
                                                        data-oid="6v0nulh"
                                                    >
                                                        <Eye
                                                            className="w-4 h-4"
                                                            data-oid="ltxbjiu"
                                                        />

                                                        <span data-oid="aj:6_m6">
                                                            {tCustomer('orders.viewDetails')}
                                                        </span>
                                                    </button>
                                                    {order.status === 'delivered' &&
                                                        !order.returnInfo && (
                                                            <button
                                                                onClick={() =>
                                                                    handleReturnOrder(order)
                                                                }
                                                                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                                                                data-oid="74y84:c"
                                                            >
                                                                <RotateCcw
                                                                    className="w-4 h-4"
                                                                    data-oid="y:8rq5l"
                                                                />

                                                                <span data-oid="ep7.:b:">
                                                                    {tCustomer(
                                                                        'orders.returnOrder',
                                                                    )}
                                                                </span>
                                                            </button>
                                                        )}
                                                </div>
                                                {(order.status === 'delivered' ||
                                                    order.status === 'processing') && (
                                                    <button
                                                        onClick={() => handleBuyAgain(order)}
                                                        className="flex items-center space-x-2 bg-[#1F1F6F] text-white px-4 py-2 rounded-lg hover:bg-[#14274E] transition-colors"
                                                        data-oid="wp0j9xu"
                                                    >
                                                        <ShoppingCart
                                                            className="w-4 h-4"
                                                            data-oid="c.ccaxk"
                                                        />

                                                        <span data-oid="5vw5.hl">
                                                            {tCustomer('orders.buyAgain')}
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Order Details Modal */}
                            <OrderDetailsModal
                                order={selectedOrder}
                                isOpen={isOrderModalOpen}
                                onClose={() => {
                                    setIsOrderModalOpen(false);
                                    setSelectedOrder(null);
                                }}
                                onBuyAgain={handleBuyAgain}
                                onReturnOrder={handleReturnOrder}
                                data-oid="0.vn7d8"
                            />

                            {/* Return Order Modal */}
                            <ReturnOrderModal
                                order={selectedOrder}
                                isOpen={isReturnModalOpen}
                                onClose={() => {
                                    setIsReturnModalOpen(false);
                                    setSelectedOrder(null);
                                }}
                                onReturnSubmitted={handleReturnSubmitted}
                                data-oid="heuez14"
                            />
                        </div>
                    </div>
                </DashboardLayout>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isOrderModalOpen}
                onClose={() => {
                    setIsOrderModalOpen(false);
                    setSelectedOrder(null);
                }}
                onBuyAgain={handleBuyAgain}
                onReturnOrder={handleReturnOrder}
                data-oid="8yywc_r"
            />

            {/* Return Order Modal */}
            <ReturnOrderModal
                order={selectedOrder}
                isOpen={isReturnModalOpen}
                onClose={() => {
                    setIsReturnModalOpen(false);
                    setSelectedOrder(null);
                }}
                onReturnSubmitted={handleReturnSubmitted}
                data-oid="m.73hbs"
            />
        </>
    );
}