'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    providerOrderService
} from '@/lib/services/vendorManagementService';
import { orderMonitoringService, Order } from '@/lib/services/orderMonitoringService';
import { orderReturnService } from '@/lib/services/orderReturnService';
import { ReturnDetailsModal } from '@/components/admin/ReturnDetailsModal';
import { VendorOrderDetailsModal } from '@/components/vendor/VendorOrderDetailsModal';

import { VendorReturnsManager } from '@/components/vendor/VendorReturnsManager';
import { VendorRevenueAnalytics } from '@/components/vendor/VendorRevenueAnalytics';
import { VendorAnalyticsDashboard } from '@/components/analytics/VendorAnalyticsDashboard';
import { OrderReturn } from '@/lib/types';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    DollarSign,
    TrendingUp,
    Clock,
    Package,
    AlertCircle,
    Eye,
    Trash2,
    RefreshCw,
    Search,
    Filter,
    Download,
    Plus,
    X,
    Star,
    Users,
    ShoppingCart,
    RotateCcw,
    FileText,
    BarChart3,
} from 'lucide-react';

interface VendorDetailsModalProps {
    vendor: VendorDetails | null;
    isOpen: boolean;
    onClose: () => void;
    onViewReturnDetails: (returnItem: OrderReturn) => void;
    onViewOrderDetails: (order: Order) => void;
}

function VendorDetailsModal({
    vendor,
    isOpen,
    onClose,
    onViewReturnDetails,
    onViewOrderDetails,
}: VendorDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'orders' | 'revenue' | 'returns'>(
        'details',
    );
    const [orders, setOrders] = useState<Order[]>([]);
    const [realtimeOrders, setRealtimeOrders] = useState<Order[]>([]);
    const [vendorReturns, setVendorReturns] = useState<OrderReturn[]>([]);
    const [totalOrders, settotalOrders] = useState(0);
    useEffect(() => {
        console.log('vendor : ', vendor)
        if (vendor && isOpen) {
            const loadOrders = async()=>{
                console.log('Loading orders for vendor:', vendor.id, vendor.vendorName);
                const vendorOrders = await providerOrderService.getAllOrders({}, vendor._id);
                console.log('Found vendor orders:', vendorOrders);
                setOrders(vendorOrders.data);
                settotalOrders(vendorOrders.pagination.totalRecords)
            }
            loadOrders();
            // Load vendor returns
            loadVendorReturns();

            // Simulate real-time orders - only for this vendor
            const realtimeInterval = setInterval(() => {
                const newRealtimeOrders = providerOrderService.getAllOrders({
                    status: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery'],
                }, vendor.id);
                console.log('Real-time orders for vendor:', newRealtimeOrders.length);
                setRealtimeOrders(newRealtimeOrders.data);
            }, 3000);

            return () => clearInterval(realtimeInterval);
        }
    }, [vendor, isOpen]);

    const loadVendorReturns = async () => {
        try {
            const allReturns = await orderReturnService.getAllReturns();
            // Filter returns for this vendor (in a real app, this would be done server-side)
            const filteredReturns = allReturns.filter((returnItem) => {
                // For demo purposes, we'll show all returns
                // In reality, you'd filter by vendor ID from the order
                return true;
            });
            setVendorReturns(filteredReturns);
        } catch (error) {
            console.error('Error loading vendor returns:', error);
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            setOrders(orders.filter((order) => order.id !== orderId));
            setRealtimeOrders(realtimeOrders.filter((order) => order.id !== orderId));
        }
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
    const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString();

    if (!vendor) return null;

    const tabs = [
        { id: 'details', label: 'Details', icon: Building2 },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'revenue', label: 'Revenue', icon: DollarSign },
        { id: 'returns', label: 'Returns', icon: RotateCcw },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="in7.th9">
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-oid="vak21ei">
                <DialogHeader data-oid="tkkuj6s">
                    <DialogTitle className="flex items-center space-x-3" data-oid="twtqsdg">
                        <div
                            className="w-12 h-12 bg-cura-primary text-white rounded-full flex items-center justify-center text-lg font-bold"
                            data-oid="ljqje41"
                        >
                            {vendor.vendorName.charAt(0)}
                        </div>
                        <div data-oid="e1jaayx">
                            <h2 className="text-xl font-bold" data-oid="99wsqpu">
                                {vendor.vendorName}
                            </h2>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200" data-oid="a6tk1w3">
                    <nav className="flex space-x-8" data-oid="8ygycz7">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    activeTab === tab.id
                                        ? 'border-cura-primary text-cura-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="o8k0uff"
                            >
                                <tab.icon className="w-4 h-4" data-oid="3_v1zj_" />
                                <span data-oid="h59miiu">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6" data-oid="9qty_2e">
                    {activeTab === 'details' && (
                        <div className="space-y-6" data-oid="sj2b1g6">
                            {/* Basic Information */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="r9n:60q"
                            >
                                <Card data-oid="pm46nus">
                                    <CardHeader data-oid="lhfrxap">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="nas0pjo"
                                        >
                                            <Building2 className="w-5 h-5" data-oid="aqkwwip" />
                                            <span data-oid="tjwawi0">Basic Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="t.rj-7a">
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="g:clr:g"
                                        >
                                            <Mail
                                                className="w-4 h-4 text-cura-primary"
                                                data-oid="zh:vmj_"
                                            />

                                            <span className="text-sm" data-oid="kd6c_k0">
                                                {vendor.email}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="4w.m:zy"
                                        >
                                            <Phone
                                                className="w-4 h-4 text-cura-primary"
                                                data-oid="cus2kxs"
                                            />

                                            <span className="text-sm" data-oid="u4mdsdv">
                                                {vendor.phone}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="2vn-jwc"
                                        >
                                            <MapPin
                                                className="w-4 h-4 text-cura-primary"
                                                data-oid="pta24rd"
                                            />

                                            <span className="text-sm" data-oid="evopa5a">
                                                {`${vendor.address.cityId}, ${vendor.address.area}, ${vendor.address.street}`}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid=".cq0kve"
                                        >
                                            <Badge
                                                className={`${
                                                    vendor.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : vendor.status === 'pending'
                                                          ? 'bg-yellow-100 text-yellow-800'
                                                          : vendor.status === 'suspended'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}
                                                data-oid="jh0btjp"
                                            >
                                                {vendor.status}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card data-oid="8z2-_k1">
                                    <CardHeader data-oid="nbwlk1w">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid=".oxgnr-"
                                        >
                                            <Users
                                                className="w-5 h-5 text-cura-primary"
                                                data-oid="p6dy79c"
                                            />

                                            <span data-oid="irysm:k">Contact Person</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="h0ebi00">
                                        <div data-oid="gnt8gac">
                                            <p className="font-medium" data-oid="uamvux-">
                                                {vendor.contactPerson}
                                            </p>
                                            <p className="text-sm text-gray-600" data-oid="_fw1r19">
                                                {vendor.contactPerson}
                                            </p>
                                        </div>
                                        <div data-oid="4k2oade">
                                            <p className="text-sm text-gray-600" data-oid="f8se3c_">
                                                {vendor.contactPerson}
                                            </p>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid=".sb4vva"
                                        >
                                            <Phone
                                                className="w-4 h-4 text-cura-primary"
                                                data-oid="8yzexlr"
                                            />

                                            <span className="text-sm" data-oid="ay01ns0">
                                                {vendor.phone}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="y83o-x4"
                                        >
                                            <Mail
                                                className="w-4 h-4 text-cura-primary"
                                                data-oid="-ittwe4"
                                            />

                                            <span className="text-sm" data-oid="5ivug0-">
                                                {vendor.email}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Performance & Commission */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                data-oid="zeqrtop"
                            >
                                <Card data-oid="xe9s_:o">
                                    <CardHeader data-oid="1wrzbmk">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="hxkcibx"
                                        >
                                            <Star
                                                className="w-5 h-5 text-cura-primary"
                                                data-oid="mb1hx_6"
                                            />

                                            <span data-oid="r-3jhfv">Performance</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="mtbdzfz">
                                        <div data-oid="o1u6mro">
                                            <p className="text-sm text-gray-600" data-oid="__jugp1">
                                                Fulfillment Rate
                                            </p>
                                            <p className="font-medium" data-oid="0rbbb.a">
                                                NA
                                            </p>
                                        </div>
                                        <div data-oid="99r_.e1">
                                            <p className="text-sm text-gray-600" data-oid="ewb-n1b">
                                                Total Orders
                                            </p>
                                            <p className="font-medium" data-oid="p4_5l0d">
                                                {totalOrders}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card data-oid="r-0yw0p">
                                    <CardHeader data-oid="3gwd23-">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="04yvh5_"
                                        >
                                            <DollarSign
                                                className="w-5 h-5 text-cura-primary"
                                                data-oid="9:qmi8k"
                                            />

                                            <span data-oid="d5hdk_a">Commission</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="82qnh0v">
                                        <div data-oid="if9iuy0">
                                            <p className="text-sm text-gray-600" data-oid="_s7d6cw">
                                                Commission Rate
                                            </p>
                                            <p className="font-medium" data-oid="b_e-us1">
                                                {vendor.commision}
                                            </p>
                                        </div>
                                        <div data-oid=":3ftvlo">
                                            <p className="text-sm text-gray-600" data-oid="ant9qt-">
                                                Type
                                            </p>
                                            <p
                                                className="font-medium capitalize"
                                                data-oid="01mxrb0"
                                            >
                                                NA
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card data-oid="uk6.q1r">
                                    <CardHeader data-oid="-ayma41">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="1.hock7"
                                        >
                                            <Package
                                                className="w-5 h-5 text-cura-primary"
                                                data-oid="dq47ykz"
                                            />

                                            <span data-oid="n9v.04b">Inventory</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="thvsp_r">
                                        <div data-oid="enrsvfd">
                                            <p className="text-sm text-gray-600" data-oid="2ns:go-">
                                                Total Products
                                            </p>
                                            <p className="font-medium" data-oid="6jtzcg4">
                                                {vendor.products.length}
                                            </p>
                                        </div>
                                        <div data-oid="2pyiq72">
                                            <p className="text-sm text-gray-600" data-oid="r9fubh6">
                                                Low Stock Items
                                            </p>
                                            <p
                                                className="font-medium text-orange-600"
                                                data-oid="c_4.quc"
                                            >
                                                NA
                                            </p>
                                        </div>
                                        <div data-oid="xxzi3tb">
                                            <p className="text-sm text-gray-600" data-oid="vp_.7jv">
                                                Out of Stock
                                            </p>
                                            <p
                                                className="font-medium text-red-600"
                                                data-oid="7yu:ww5"
                                            >
                                                NA
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-6" data-oid="7aqms39">
                            {/* Real-time Orders */}
                            <Card data-oid="t.xmyhx">
                                <CardHeader data-oid="6haiy6a">
                                    <CardTitle
                                        className="flex items-center justify-between"
                                        data-oid="u4ivg5w"
                                    >
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="1vj43-."
                                        >
                                            <RefreshCw
                                                className="w-5 h-5 text-cura-primary"
                                                data-oid="cphkmlz"
                                            />

                                            <span data-oid="qdd:3_v">Real-time Orders</span>
                                            <Badge
                                                variant="outline"
                                                className="ml-2"
                                                data-oid="jsqnser"
                                            >
                                                Live
                                            </Badge>
                                        </div>
                                        {realtimeOrders && realtimeOrders.length > 0 && (
                                            <div
                                                className="text-sm text-gray-500"
                                                data-oid="0gozqs_"
                                            >
                                                {realtimeOrders.length} active orders
                                            </div>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent data-oid="uod7ti8">
                                    { realtimeOrders && realtimeOrders.length === 0 ? (
                                        <p
                                            className="text-gray-500 text-center py-4"
                                            data-oid="rcminwc"
                                        >
                                            No active orders for {vendor.vendorName}
                                        </p>
                                    ) : (
                                        <div
                                            className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                            data-oid="-xckobg"
                                        >
                                            <div className="space-y-3 pr-2" data-oid="svr5zy8">
                                                { realtimeOrders && realtimeOrders.map((order) => (
                                                    <div
                                                        key={order.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                                        onClick={() => onViewOrderDetails(order)}
                                                        data-oid="z:14y4y"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-3 flex-1"
                                                            data-oid="58924o-"
                                                        >
                                                            <div
                                                                className="w-10 h-10 bg-cura-primary/10 text-cura-primary rounded-full flex items-center justify-center text-sm font-bold"
                                                                data-oid=":civ9ik"
                                                            >
                                                                #{order.orderNumber.slice(-3)}
                                                            </div>
                                                            <div
                                                                className="flex-1"
                                                                data-oid="8t_wcvh"
                                                            >
                                                                <div
                                                                    className="flex items-center justify-between"
                                                                    data-oid="sfnm4dy"
                                                                >
                                                                    <div data-oid="1dbfswc">
                                                                        <p
                                                                            className="font-medium"
                                                                            data-oid="aj65_.9"
                                                                        >
                                                                            {order.customerName}
                                                                        </p>
                                                                        <p
                                                                            className="text-sm text-gray-600"
                                                                            data-oid="0q9ahzw"
                                                                        >
                                                                            {order.orderNumber} •{' '}
                                                                            {order.items.length}{' '}
                                                                            items
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className="text-right"
                                                                        data-oid="8i3i4pq"
                                                                    >
                                                                        <p
                                                                            className="font-semibold text-lg"
                                                                            data-oid="ysn4piw"
                                                                        >
                                                                            {formatCurrency(
                                                                                order.totalAmount,
                                                                            )}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs text-gray-500"
                                                                            data-oid="tkvful9"
                                                                        >
                                                                            {order.paymentMethod} •{' '}
                                                                            {order.paymentStatus}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="flex items-center justify-between mt-2"
                                                                    data-oid="ydhwzpu"
                                                                >
                                                                    <div
                                                                        className="flex items-center space-x-2"
                                                                        data-oid="yh:19yn"
                                                                    >
                                                                        <Badge
                                                                            className={`${
                                                                                order.status ===
                                                                                'pending'
                                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                                    : order.status ===
                                                                                        'confirmed'
                                                                                      ? 'bg-blue-100 text-blue-800'
                                                                                      : order.status ===
                                                                                          'preparing'
                                                                                        ? 'bg-orange-100 text-orange-800'
                                                                                        : order.status ===
                                                                                            'ready'
                                                                                          ? 'bg-green-100 text-green-800'
                                                                                          : 'bg-purple-100 text-purple-800'
                                                                            }`}
                                                                            data-oid="zblwl1t"
                                                                        >
                                                                            {order.status
                                                                                .replace('-', ' ')
                                                                                .toUpperCase()}
                                                                        </Badge>
                                                                    </div>
                                                                    <div
                                                                        className="flex items-center space-x-2"
                                                                        data-oid="a-cn805"
                                                                    >
                                                                        <p
                                                                            className="text-xs text-gray-500"
                                                                            data-oid="supiz:g"
                                                                        >
                                                                            {formatTime(
                                                                                order.createdAt,
                                                                            )}
                                                                        </p>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onViewOrderDetails(
                                                                                    order,
                                                                                );
                                                                            }}
                                                                            className="text-cura-primary hover:text-cura-secondary"
                                                                            data-oid="300xcx."
                                                                        >
                                                                            <Eye
                                                                                className="w-4 h-4"
                                                                                data-oid=":c:ywes"
                                                                            />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteOrder(
                                                                                    order.id,
                                                                                );
                                                                            }}
                                                                            className="text-red-600 hover:text-red-800"
                                                                            data-oid="6bhfsdc"
                                                                        >
                                                                            <Trash2
                                                                                className="w-4 h-4"
                                                                                data-oid=":vd4-w9"
                                                                            />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* All Orders */}
                            <Card data-oid="ew17_ve">
                                <CardHeader data-oid="rubb7eu">
                                    <CardTitle
                                        className="flex items-center justify-between"
                                        data-oid="c3e_8ql"
                                    >
                                        <span data-oid="_e7vfn1">All Orders</span>
                                        {orders.length > 0 && (
                                            <div
                                                className="text-sm text-gray-500"
                                                data-oid="47xhboj"
                                            >
                                                {orders.length} total orders
                                            </div>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent data-oid="mots3.7">
                                    {orders.length === 0 ? (
                                        <div className="text-center py-8" data-oid="cx9hapn">
                                            <ShoppingCart
                                                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                                                data-oid="g7tzi38"
                                            />

                                            <p className="text-gray-500" data-oid="_awbte:">
                                                No orders found for {vendor.vendorName}
                                            </p>
                                            <p
                                                className="text-sm text-gray-400 mt-2"
                                                data-oid=".19ie1."
                                            >
                                                Orders will appear here when customers place orders
                                                with this vendor.
                                            </p>
                                        </div>
                                    ) : (
                                        <div
                                            className="max-h-96 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                            data-oid="-ws:0e2"
                                        >
                                            <div className="overflow-x-auto" data-oid="d-rs3m8">
                                                <table
                                                    className="w-full border-collapse"
                                                    data-oid="-vnfupo"
                                                >
                                                    <thead
                                                        className="sticky top-0 bg-white z-10"
                                                        data-oid="jh-s5i:"
                                                    >
                                                        <tr
                                                            className="border-b border-gray-200"
                                                            data-oid="1slmquq"
                                                        >
                                                            <th
                                                                className="text-left p-3 font-semibold text-gray-900 bg-white"
                                                                data-oid="s83tbr9"
                                                            >
                                                                Order
                                                            </th>
                                                            <th
                                                                className="text-left p-3 font-semibold text-gray-900 bg-white"
                                                                data-oid="0h93e7w"
                                                            >
                                                                Customer
                                                            </th>
                                                            <th
                                                                className="text-left p-3 font-semibold text-gray-900 bg-white"
                                                                data-oid="1_1-jly"
                                                            >
                                                                Amount
                                                            </th>
                                                            <th
                                                                className="text-left p-3 font-semibold text-gray-900 bg-white"
                                                                data-oid="cm2lfu."
                                                            >
                                                                Status
                                                            </th>
                                                            <th
                                                                className="text-left p-3 font-semibold text-gray-900 bg-white"
                                                                data-oid="lcmasew"
                                                            >
                                                                Date
                                                            </th>
                                                            <th
                                                                className="text-left p-3 font-semibold text-gray-900 bg-white"
                                                                data-oid="cuq7d7w"
                                                            >
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody data-oid=":os2h.4">
                                                        {orders.map((order) => (
                                                            <tr
                                                                key={order.id}
                                                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                                                onClick={() =>
                                                                    onViewOrderDetails(order)
                                                                }
                                                                data-oid="aj5htec"
                                                            >
                                                                <td
                                                                    className="p-3"
                                                                    data-oid="pe:tyo."
                                                                >
                                                                    <div data-oid="js96kct">
                                                                        <p
                                                                            className="font-medium text-cura-primary"
                                                                            data-oid="8uw90ey"
                                                                        >
                                                                            {order.orderNumber}
                                                                        </p>
                                                                        <p
                                                                            className="text-sm text-gray-600"
                                                                            data-oid="o.gns7d"
                                                                        >
                                                                            {order.items.length}{' '}
                                                                            items •{' '}
                                                                            {order.paymentMethod}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    className="p-3"
                                                                    data-oid="qqyvrmb"
                                                                >
                                                                    <div data-oid="lsp5y42">
                                                                        <p
                                                                            className="font-medium"
                                                                            data-oid="2z6c-ab"
                                                                        >
                                                                            {order.customerName}
                                                                        </p>
                                                                        <p
                                                                            className="text-sm text-gray-600"
                                                                            data-oid="9wrddg8"
                                                                        >
                                                                            {order.customerPhone}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs text-gray-500"
                                                                            data-oid="lwctm3m"
                                                                        >
                                                                            {order.customerEmail}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    className="p-3"
                                                                    data-oid="6hroiy7"
                                                                >
                                                                    <div data-oid="rhvvna.">
                                                                        <p
                                                                            className="font-medium text-lg"
                                                                            data-oid="3agf:ex"
                                                                        >
                                                                            {formatCurrency(
                                                                                order.totalAmount,
                                                                            )}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs text-gray-500"
                                                                            data-oid="lefm2k8"
                                                                        >
                                                                            Subtotal:{' '}
                                                                            {formatCurrency(
                                                                                order.subtotal,
                                                                            )}
                                                                        </p>
                                                                        {order.discount > 0 && (
                                                                            <p
                                                                                className="text-xs text-green-600"
                                                                                data-oid="olihmbt"
                                                                            >
                                                                                Discount: -{' '}
                                                                                {formatCurrency(
                                                                                    order.discount,
                                                                                )}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    className="p-3"
                                                                    data-oid="ns-:ewe"
                                                                >
                                                                    <Badge
                                                                        className={`${
                                                                            order.status ===
                                                                            'delivered'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : order.status ===
                                                                                    'cancelled'
                                                                                  ? 'bg-red-100 text-red-800'
                                                                                  : order.status ===
                                                                                      'pending'
                                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                                    : order.status ===
                                                                                        'confirmed'
                                                                                      ? 'bg-blue-100 text-blue-800'
                                                                                      : order.status ===
                                                                                          'preparing'
                                                                                        ? 'bg-orange-100 text-orange-800'
                                                                                        : order.status ===
                                                                                            'ready'
                                                                                          ? 'bg-green-100 text-green-800'
                                                                                          : 'bg-purple-100 text-purple-800'
                                                                        }`}
                                                                        data-oid="om3qdvs"
                                                                    >
                                                                        {order.status
                                                                            .replace('-', ' ')
                                                                            .toUpperCase()}
                                                                    </Badge>
                                                                </td>
                                                                <td
                                                                    className="p-3"
                                                                    data-oid="sor_y69"
                                                                >
                                                                    <div data-oid="lx2555v">
                                                                        <p
                                                                            className="text-sm font-medium"
                                                                            data-oid="4u_e_vy"
                                                                        >
                                                                            {formatDate(
                                                                                order.createdAt,
                                                                            )}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs text-gray-500"
                                                                            data-oid="u5ub-g-"
                                                                        >
                                                                            {formatTime(
                                                                                order.createdAt,
                                                                            )}
                                                                        </p>
                                                                        <p
                                                                            className="text-xs text-gray-500"
                                                                            data-oid="f7ta9at"
                                                                        >
                                                                            Est:{' '}
                                                                            {
                                                                                order.estimatedDeliveryTime
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    className="p-3"
                                                                    data-oid="5w0fb7f"
                                                                >
                                                                    <div
                                                                        className="flex items-center space-x-2"
                                                                        data-oid="lpx-v0."
                                                                    >
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onViewOrderDetails(
                                                                                    order,
                                                                                );
                                                                            }}
                                                                            className="text-cura-primary hover:text-cura-secondary"
                                                                            data-oid="ddni007"
                                                                        >
                                                                            <Eye
                                                                                className="w-4 h-4"
                                                                                data-oid="vx8fmdu"
                                                                            />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteOrder(
                                                                                    order.id,
                                                                                );
                                                                            }}
                                                                            className="text-red-600 hover:text-red-800"
                                                                            data-oid="1:5n05n"
                                                                        >
                                                                            <Trash2
                                                                                className="w-4 h-4"
                                                                                data-oid="vrgw7sr"
                                                                            />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Revenue Tab - Phase 3 Implementation */}
                    {activeTab === 'revenue' && (
                        <VendorRevenueAnalytics vendor={vendor} data-oid="63efode" />
                    )}

                    {/* Returns Tab - Now Implemented */}
                    {activeTab === 'returns' && (
                        <VendorReturnsManager vendorId={vendor.id} data-oid="pbm5m.k" />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function VendorManagementPage() {
    const [vendors, setVendors] = useState<VendorDetails[]>([]);
    const [stats, setStats] = useState<VendorStats | null>({
        total:'NA',
        growth:'NA',
        active:true,
        totalPlatformRevenue:'NA',
        totalVendorRevenue:'NA',
        totalProducts:'NA',
        averageCommission:'NA',
        activeProducts:'NA',
    });
    const [filters, setFilters] = useState<VendorFilters>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState<VendorDetails | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReturn, setSelectedReturn] = useState<OrderReturn | null>(null);
    const [showReturnDetails, setShowReturnDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [activeView, setActiveView] = useState<'management' | 'analytics'>('management');

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);
const [vendorTypes, setvendorTypes] = useState([]);
    const loadData = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const filteredVendors = await providerOrderService.getAllVendors(filters);
        const vendorStats = await providerOrderService.getVendorStats();
        setvendorTypes(vendorTypes)
        setVendors(filteredVendors.data);
        setIsLoading(false);
    };

    const handleFilterChange = (key: keyof VendorFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value === '' ? undefined : value }));
    };

    const handleViewVendor = (vendor: VendorDetails) => {
        setSelectedVendor(vendor);
        setShowDetailsModal(true);
    };

    const handleViewReturnDetails = (returnItem: OrderReturn) => {
        setSelectedReturn(returnItem);
        setShowReturnDetails(true);
    };

    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

    // FIXED: Removed extra parenthesis and comma
    const filteredVendors = vendors.filter(
        (vendor) =>
            vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.cityName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (isLoading && !stats) {
        return (
            <div className="space-y-6" data-oid="rr1ytb3">
                <div
                    className="bg-white rounded-lg border border-gray-200 px-6 py-4"
                    data-oid="jzg:ggt"
                >
                    <div className="animate-pulse" data-oid="pt4dxge">
                        <div
                            className="h-8 bg-gray-200 rounded w-1/4 mb-2"
                            data-oid="jpvt61a"
                        ></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2" data-oid=":5_9_sc"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="or:3vhe">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="p8q-e6s"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="_p:0jpq">
            <Tabs
                value={activeView}
                onValueChange={(value) => setActiveView(value as any)}
                className="w-full"
                data-oid="g0gnttj"
            >
                <TabsList
                    className="grid w-full grid-cols-2 bg-white rounded-xl shadow-sm border border-gray-100 p-1"
                    data-oid="xpk5jao"
                >
                    <TabsTrigger
                        value="management"
                        className="flex items-center gap-2"
                        data-oid="wt1t:7v"
                    >
                        <Building2 className="h-4 w-4" data-oid="i:pux4:" />
                        Vendor Management
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-2"
                        data-oid="nbvbj.r"
                    >
                        <BarChart3 className="h-4 w-4" data-oid="jj1gj0d" />
                        Vendor Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="management" className="space-y-6" data-oid=".oiacwt">
                    {/* Statistics Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="db0hexq">
                            <Card className="bg-cura-gradient text-white" data-oid="82w4p7n">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid="txr9qu5"
                                >
                                    <CardTitle
                                        className="text-sm font-medium opacity-90"
                                        data-oid="qq5e1:s"
                                    >
                                        Total Vendors
                                    </CardTitle>
                                    <Building2 className="h-4 w-4 opacity-90" data-oid="7zlr8q1" />
                                </CardHeader>
                                <CardContent data-oid="13agp4o">
                                    <div className="text-2xl font-bold" data-oid="6vzm0t8">
                                        {stats.total}
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs opacity-90"
                                        data-oid="l2-tyjy"
                                    >
                                        <span data-oid="rjzo1xr">
                                            +{stats.growth}% from last month
                                        </span>
                                    </div>
                                    <div className="mt-2" data-oid="7cgramy">
                                        <Badge
                                            variant="secondary"
                                            className="bg-white/20 text-white"
                                            data-oid="r6metc2"
                                        >
                                            {stats.active} active vendors
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card data-oid="-6990x9">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid="gxc7qjp"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="qljnqh3"
                                    >
                                        My Total Commission
                                    </CardTitle>
                                    <DollarSign
                                        className="h-4 w-4 text-gray-400"
                                        data-oid="5lxk4zk"
                                    />
                                </CardHeader>
                                <CardContent data-oid="7prjc_n">
                                    <div
                                        className="text-2xl font-bold text-green-600"
                                        data-oid=".fsih2c"
                                    >
                                        {stats.totalPlatformRevenue}
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs text-gray-600"
                                        data-oid="vbtfbuf"
                                    >
                                        <span data-oid="rzleca3">
                                            {stats.averageCommission}% avg rate
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card data-oid="f9uyt23">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid="5h34qku"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="25c_rv-"
                                    >
                                        Vendor Total Sales
                                    </CardTitle>
                                    <TrendingUp
                                        className="h-4 w-4 text-gray-400"
                                        data-oid=":odnaon"
                                    />
                                </CardHeader>
                                <CardContent data-oid="r6dbwzq">
                                    <div
                                        className="text-2xl font-bold text-cura-primary"
                                        data-oid="uq_hbtc"
                                    >
                                        {stats.totalVendorRevenue}
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs text-gray-600"
                                        data-oid="7g1aq0y"
                                    >
                                        <span data-oid="h-:j132">All vendors combined</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card data-oid="m-d:ewk">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid="f4_i0ec"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="ddqa4m7"
                                    >
                                        Total Products
                                    </CardTitle>
                                    <Package className="h-4 w-4 text-gray-400" data-oid="txjz30h" />
                                </CardHeader>
                                <CardContent data-oid="k5ktrx8">
                                    <div
                                        className="text-2xl font-bold text-gray-900"
                                        data-oid="sp.9yhp"
                                    >
                                        {stats.totalProducts}
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs text-gray-600"
                                        data-oid="nceovzm"
                                    >
                                        <span data-oid="4g0mebx">
                                            {(
                                                (stats.activeProducts / stats.totalProducts) *
                                                100
                                            ).toFixed(1)}
                                            % active
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Search and Filters */}
                    <Card data-oid="vb:v7tv">
                        <CardContent className="pt-6" data-oid="8ta:6xv">
                            <div className="flex items-center space-x-4 mb-6" data-oid="ltiahox">
                                <div className="flex-1 relative" data-oid="mzcsbdb">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                        data-oid="j:dpdwi"
                                    />

                                    <Input
                                        placeholder="Search vendors by name, email, or location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        data-oid="nv9vvx5"
                                    />
                                </div>
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-transparent"
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    data-oid="-hx14t-"
                                >
                                    <option value="" data-oid="ver2dj_">
                                        {' '}
                                        All Statuses{' '}
                                    </option>
                                    <option value="active" data-oid="8ljh:kj">
                                        {' '}
                                        Active{' '}
                                    </option>
                                    <option value="pending" data-oid="n_0lqlw">
                                        {' '}
                                        Pending{' '}
                                    </option>
                                    <option value="suspended" data-oid="hq5z9ar">
                                        {' '}
                                        Suspended{' '}
                                    </option>
                                </select>
                                {/* <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cura-primary focus:border-transparent"
                                    value={filters.vendorType || ''}
                                    onChange={(e) =>
                                        handleFilterChange('vendorType', e.target.value)
                                    }
                                    data-oid="2zg1pdq"
                                >
                                    <option value="" data-oid="db0l9dj">
                                        {' '}
                                        All Types{' '}
                                    </option>
                                    {providerOrderService.getVendorTypes().map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                            data-oid="2ddlpnk"
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select> */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vendors List */}
                    <Card data-oid="5fi:n0p">
                        <CardHeader data-oid="zrd2fgj">
                            <CardTitle data-oid="eb9p1i4">All Vendors</CardTitle>
                            <CardDescription data-oid="95p__12">
                                Click on any vendor to view detailed information, orders, and
                                revenue
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="ckrocj_">
                            <div className="space-y-4" data-oid="4cqic9o">
                                {filteredVendors.map((vendor) => (
                                    <div
                                        key={vendor.id}
                                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handleViewVendor(vendor)}
                                        data-oid="_abiqad"
                                    >
                                        <div
                                            className="flex items-start justify-between"
                                            data-oid="79p6adv"
                                        >
                                            <div
                                                className="flex items-start space-x-4 flex-1"
                                                data-oid="qoajv9m"
                                            >
                                                <div
                                                    className="w-12 h-12 bg-cura-primary text-white rounded-full flex items-center justify-center text-lg font-bold"
                                                    data-oid="j0p8n:s"
                                                >
                                                    {vendor.vendorName.charAt(0)}
                                                </div>
                                                <div className="flex-1" data-oid="dalej4h">
                                                    <div
                                                        className="flex items-center space-x-3 mb-2"
                                                        data-oid="-ittmd0"
                                                    >
                                                        <h3
                                                            className="text-lg font-semibold text-gray-900"
                                                            data-oid="d3ay-r1"
                                                        >
                                                            {vendor.vendorName}
                                                        </h3>
                                                        <Badge
                                                            className={`${
                                                                vendor.status === 'active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : vendor.status === 'pending'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : vendor.status ===
                                                                          'suspended'
                                                                        ? 'bg-orange-100 text-orange-800'
                                                                        : 'bg-red-100 text-red-800'
                                                            }`}
                                                            data-oid="rn4d4uw"
                                                        >
                                                            {vendor.status}
                                                        </Badge>
                                                    </div>
                                                    <p
                                                        className="text-sm text-gray-600 mb-3"
                                                        data-oid="_-:00zb"
                                                    >
                                                        {vendor.tradeName}
                                                    </p>
                                                    <div
                                                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                                                        data-oid="qk5vqgk"
                                                    >
                                                        <div data-oid="m75ft4z">
                                                            <h4
                                                                className="font-medium text-gray-900 mb-1"
                                                                data-oid="3y9t8f6"
                                                            >
                                                                Location
                                                            </h4>
                                                            <div
                                                                className="flex items-center space-x-1 text-sm text-gray-600"
                                                                data-oid="on9btl6"
                                                            >
                                                                <MapPin
                                                                    className="w-4 h-4"
                                                                    data-oid="41r8tlh"
                                                                />

                                                                <span data-oid="ujs6z90">
                                                                    {vendor.cityName},{' '}
                                                                    {vendor.governorateName}
                                                                </span>
                                                            </div>
                                                            <p
                                                                className="text-sm text-gray-500"
                                                                data-oid="1-dwukr"
                                                            >
                                                                 {`${vendor.address.cityId}, ${vendor.address.area}, ${vendor.address.street}`}
                                                            </p>
                                                        </div>

                                                        <div data-oid="x1f294b">
                                                            <h4
                                                                className="font-medium text-gray-900 mb-1"
                                                                data-oid="1ypx8mb"
                                                            >
                                                                Contact
                                                            </h4>
                                                            <div
                                                                className="flex items-center space-x-1 text-sm text-gray-600 mb-1"
                                                                data-oid="5at:4yt"
                                                            >
                                                                <Phone
                                                                    className="w-4 h-4"
                                                                    data-oid="dzd3xk6"
                                                                />

                                                                <span data-oid="g5y-sek">
                                                                    {vendor.phone}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-1 text-sm text-gray-600"
                                                                data-oid="4wwxdu5"
                                                            >
                                                                <Mail
                                                                    className="w-4 h-4"
                                                                    data-oid=":q2nb82"
                                                                />

                                                                <span data-oid=".luap2.">
                                                                    {vendor.email}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div data-oid="1xlfbpx">
                                                            <h4
                                                                className="font-medium text-gray-900 mb-1"
                                                                data-oid="dua72.4"
                                                            >
                                                                My Commission
                                                            </h4>
                                                            <p
                                                                className="text-lg font-semibold text-green-600"
                                                                data-oid="432:954"
                                                            >
                                                                Na
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-500"
                                                                data-oid="vuif5it"
                                                            >
                                                                {vendor.commission}% rate
                                                            </p>
                                                        </div>

                                                        <div data-oid="mczly6m">
                                                            <h4
                                                                className="font-medium text-gray-900 mb-1"
                                                                data-oid="i--:x68"
                                                            >
                                                                Their Revenue
                                                            </h4>
                                                            <p
                                                                className="text-lg font-semibold text-cura-primary"
                                                                data-oid="dth.emv"
                                                            >
                                                                NA
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-500"
                                                                data-oid="qatxdlt"
                                                            >
                                                                {vendor.totalProducts}{' '}
                                                                products
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="v8u7p4y"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewVendor(vendor);
                                                    }}
                                                    data-oid="dff5fmh"
                                                >
                                                    <Eye
                                                        className="w-4 h-4 mr-2"
                                                        data-oid="m1jkrvw"
                                                    />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vendor Details Modal */}
                    <VendorDetailsModal
                        vendor={selectedVendor}
                        isOpen={showDetailsModal}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedVendor(null);
                        }}
                        onViewReturnDetails={handleViewReturnDetails}
                        onViewOrderDetails={handleViewOrderDetails}
                        data-oid="c:8p6-2"
                    />

                    {/* Vendor Order Details Modal */}
                    <VendorOrderDetailsModal
                        order={selectedOrder}
                        isOpen={showOrderDetails}
                        onClose={() => {
                            setShowOrderDetails(false);
                            setSelectedOrder(null);
                        }}
                        data-oid="fvxv0hq"
                    />

                    {/* Return Details Modal */}
                    <ReturnDetailsModal
                        returnOrder={selectedReturn}
                        isOpen={showReturnDetails}
                        onClose={() => {
                            setShowReturnDetails(false);
                            setSelectedReturn(null);
                        }}
                        data-oid="p.8z8wn"
                    />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6" data-oid="jod9cir">
                    <VendorAnalyticsDashboard data-oid="11rx6j4" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
