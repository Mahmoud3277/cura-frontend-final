'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    orderMonitoringService,
    OrderStatus,
} from '@/lib/services/orderMonitoringService';
import { PrescriptionImageViewer } from '@/components/admin/PrescriptionImageViewer';
import { PrescriptionViewModal } from '@/components/admin/PrescriptionViewModal';
import { prescriptionAPIService } from '@/lib/data/prescriptionWorkflow';
import {
    Package,
    Clock,
    Truck,
    CheckCircle,
    Search,
    Filter,
    Download,
    RefreshCw,
    Eye,
    Building2,
    MapPin,
    Phone,
    User,
    Calendar,
    DollarSign,
    FileText,
    Pill,
    AlertCircle,
    Copy,
    ExternalLink,
    ShoppingCart,
    Activity,
} from 'lucide-react';
import pharmacyManagementService, { PharmacyDetails } from '@/lib/services/pharmacyManagementService';

type OrderType = 'all' | 'normal' | 'prescription' | 'subscription';
type OrderSection = 'live' | 'completed';
interface Order {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    totalAmount: number;
    paymentStatus: 'paid' | 'unpaid' | 'failed'; // Assuming these statuses
    status: OrderStatus;
    createdAt: string; // ISO 8601 date string
    prescriptionId?: string; // Optional since not all orders have one
    pharmacy: Pharmacy;
    items: OrderItem[];
    deliveryAddress: DeliveryAddress;
    statusHistory: StatusHistoryItem[];
}

interface OrderAnalytics {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    preparingOrders: number;
    readyOrders: number;
    outForDeliveryOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    averageDeliveryTime: number;
    completedOrders: number;
    ordersByCity: string[];
    ordersByPharmacy: string[];
    ordersByTimeframe: string[];
    topProducts: string[];
    customerSatisfaction: string;
    onTimeDeliveryRate: number;
    statusBreakdown: { [key in OrderStatus]?: number }; // Assuming key is OrderStatus
    paymentBreakdown: { [key: string]: { count: number; revenue: number } };
}

interface OrderFilters {
    searchQuery?: string;
    status?: OrderStatus[];
    prescriptionOnly?: boolean;
}

// Interfaces for nested objects within Order
interface OrderItem {
    id: string;
    productName: string;
    pharmacy: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    unit?: string;
    prescription?: boolean;
    category?: string;
    image: string; // Assuming an image URL string
}

interface Pharmacy {
    name: string;
    city: string;
    phone: string;
    _id: string;
}

interface DeliveryAddress {
    street: string;
    city: string;
    governorate: string;
    phone: string;
    notes?: string;
}

interface StatusHistoryItem {
    status: OrderStatus;
    timestamp: string; // ISO 8601 date string
    updatedBy: string;
    notes?: string;
}
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [analytics, setAnalytics] = useState(null);
    const [filters, setFilters] = useState<OrderFilters>({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [activeSection, setActiveSection] = useState<OrderSection>('live');
    const [orderType, setOrderType] = useState<OrderType>('all');
    const [pharmacy, setpharmacy] = useState([{name:"HealthCare Pharmacy"}]);
    const [isViewingState, setIsViewingState] = useState(false);

    const [isPrescriptionViewerOpen, setIsPrescriptionViewerOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

    useEffect(() => {
        loadData();
        const interval = setInterval(() => {
            loadData();
        }, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, activeSection, orderType]);

    useEffect(() => {
        console.log(selectedOrder)
    }, [selectedOrder]);
    const loadData = async () => {
        setIsLoading(true);
    
        let statusFilters: OrderStatus[] = [];
        if (activeSection === 'live') {
            statusFilters = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery'];
        } else {
            statusFilters = ['delivered', 'cancelled', 'refunded'];
        }
        const pharmacyData = await pharmacyManagementService.getPharmacies();
        if(pharmacyData.data){
            console.log(pharmacyData.data);
            setpharmacy(pharmacyData.data);
        }
        const currentFilters = {
            ...filters,
            searchQuery: searchQuery || undefined,
            status: statusFilters,
            prescriptionOnly: orderType === 'prescription' ? true : undefined,
        };
    
        const apiResponse = await orderMonitoringService.getOrders(currentFilters);
        if(apiResponse.orders){
            // The API returns an object with an 'orders' property, so we extract the array.
            let typeFilteredOrders = apiResponse.orders;
            if (orderType === 'prescription') {
                typeFilteredOrders = typeFilteredOrders.filter((order) => order.prescriptionId);
            } else if (orderType === 'subscription') {
                typeFilteredOrders = typeFilteredOrders.filter((order) =>
                    order.items.some((item) => item.category === 'subscription'),
                );
            } else if (orderType === 'normal') {
                typeFilteredOrders = typeFilteredOrders.filter(
                    (order) =>
                        !order.prescriptionId &&
                        !order.items.some((item) => item.category === 'subscription'),
                );
            }
        
            setOrders(typeFilteredOrders);
        }
    
        // Filter the orders based on the selected order type
        
        setAnalytics({
            totalOrders: "NA",
            pendingOrders: "NA",
            confirmedOrders: "NA",
            preparingOrders: "NA",
            readyOrders: "NA",
            outForDeliveryOrders: "NA",
            deliveredOrders: "NA",
            cancelledOrders: "NA",
            totalRevenue: "NA",
            averageOrderValue: "NA",
            averageDeliveryTime: "NA",
            completedOrders: "NA",
            ordersByCity: ["NA"],
            ordersByPharmacy: ["NA"],
            ordersByTimeframe: ["NA"],
            topProducts: ["NA"],
            customerSatisfaction: "NA",
            onTimeDeliveryRate: "NA",
            statusBreakdown: { "NA": "NA" },
            paymentBreakdown: { "NA": { count: "NA", revenue: "NA" } },
        });
        setIsLoading(false);
    };

    const handleStatusUpdate = async(orderId: string, newStatus: OrderStatus) => {
        const success = await orderMonitoringService.updateOrderStatus(
            orderId,
            newStatus,
            'admin',
        );
        if (success) {
            loadData();
            if (selectedOrder?._id === orderId) {
                const updatedOrder = await orderMonitoringService.getOrderById(orderId);
                if(updatedOrder){
                    setSelectedOrder(updatedOrder);
                    // Keep the viewing state active so modal stays open
                    setIsViewingState(true);
                }
            }
        }
    };

    const handleViewPrescription = async(prescriptionId: string) => {
        const prescription = await prescriptionAPIService.getPrescriptionById(prescriptionId);
        if (prescription) {
            setSelectedPrescription(prescription);
            setIsPrescriptionViewerOpen(true);
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-purple-100 text-purple-800';
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'out-for-delivery':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status: OrderStatus) => {
        return status
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getOrderTypeIcon = (order: Order, isInCircle = false) => {
        const iconColor = isInCircle ? 'text-white' : '';

        if (order.prescriptionId)
            return (
                <Pill
                    className={`w-4 h-4 ${isInCircle ? iconColor : 'text-purple-600'}`}
                    data-oid="eie:-fn"
                />
            );

        if (order.items.some((item) => item.category === 'subscription'))
            return (
                <Activity
                    className={`w-4 h-4 ${isInCircle ? iconColor : 'text-blue-600'}`}
                    data-oid="bic.f:t"
                />
            );

        return (
            <ShoppingCart
                className={`w-4 h-4 ${isInCircle ? iconColor : 'text-gray-600'}`}
                data-oid=".c_15dx"
            />
        );
    };

    const getOrderTypeLabel = (order: Order) => {
        if (order.prescriptionId) return 'Prescription';
        if (order.items.some((item) => item.category === 'subscription')) return 'Subscription';
        return 'Normal Order';
    };

    // Show all orders without pagination
    const currentOrders = orders;

    if (isLoading || !analytics) {
        return (
            <div className="space-y-6" data-oid="73t3:.e">
                <div
                    className="bg-white rounded-lg border border-gray-200 px-6 py-4"
                    data-oid="3jk9tih"
                >
                    <div className="animate-pulse" data-oid="9vzgyza">
                        <div
                            className="h-8 bg-gray-200 rounded w-1/4 mb-2"
                            data-oid="o:97tw3"
                        ></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2" data-oid="jl6:p3f"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="_l9mj4f">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="1durmp2"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen" data-oid="jg82f_o">
            <div className="space-y-4 p-2" data-oid="o4ww:2o">
                {/* Analytics Cards */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"
                    data-oid="vl42o3u"
                >
                    <Card
                        className="bg-gradient-to-br from-[#1F1F6F] to-[#14274E] text-white"
                        data-oid="ztmuot7"
                    >
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                            data-oid="gicc819"
                        >
                            <CardTitle
                                className="text-sm font-medium opacity-90"
                                data-oid="n:kf-po"
                            >
                                Total Orders
                            </CardTitle>
                            <Package className="h-4 w-4 opacity-90" data-oid="z5mn9b2" />
                        </CardHeader>
                        <CardContent data-oid="whciywx">
                            <div className="text-2xl font-bold" data-oid="fk5j1ul">
                                {analytics.totalOrders.toLocaleString()}
                            </div>
                            <div
                                className="flex items-center space-x-2 text-xs opacity-90"
                                data-oid=":9:4jjr"
                            >
                                <span data-oid="dsf_9ap">
                                    EGP {analytics.totalRevenue.toLocaleString()} revenue
                                </span>
                            </div>
                            <div className="mt-2" data-oid="4s:8f9h">
                                <Badge
                                    variant="secondary"
                                    className="bg-white/20 text-white"
                                    data-oid="6sxpcir"
                                >
                                    EGP {analytics.averageOrderValue} avg
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="2df6cam">
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                            data-oid="aywev9o"
                        >
                            <CardTitle
                                className="text-sm font-medium text-gray-600"
                                data-oid="5-zb31d"
                            >
                                Live Orders
                            </CardTitle>
                            <Activity className="h-4 w-4 text-gray-400" data-oid="yqe9ic_" />
                        </CardHeader>
                        <CardContent data-oid="sx6.k:3">
                            <div className="text-2xl font-bold text-gray-900" data-oid=":9n-f5s">
                                {analytics.pendingOrders +
                                    analytics.confirmedOrders +
                                    analytics.preparingOrders +
                                    analytics.readyOrders +
                                    analytics.outForDeliveryOrders}
                            </div>
                            <div
                                className="flex items-center space-x-2 text-xs text-gray-600"
                                data-oid="-:ta8:t"
                            >
                                <span data-oid="essc_p8">{analytics.pendingOrders} pending</span>
                            </div>
                            <div className="mt-2" data-oid="drsy:v_">
                                <Badge
                                    variant="outline"
                                    className="text-blue-600 border-blue-200"
                                    data-oid="auo.nyv"
                                >
                                    {analytics.preparingOrders} preparing
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="_wg5_9f">
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                            data-oid="w3-b9wx"
                        >
                            <CardTitle
                                className="text-sm font-medium text-gray-600"
                                data-oid="qe_jq65"
                            >
                                Prescription Orders
                            </CardTitle>
                            <Pill className="h-4 w-4 text-gray-400" data-oid="hbjgxve" />
                        </CardHeader>
                        <CardContent data-oid="q19hy65">
                            <div className="text-2xl font-bold text-gray-900" data-oid="g:xsqg7">
                                {orders && orders.length>0 && orders.filter((order) => order.prescriptionId).length}
                            </div>
                            <div
                                className="flex items-center space-x-2 text-xs text-gray-600"
                                data-oid="l1yg437"
                            >
                                <span data-oid="8d9kffb">Prescription-based orders</span>
                            </div>
                            <div className="mt-2" data-oid="skr:jaw">
                                <Badge
                                    variant="outline"
                                    className="text-purple-600 border-purple-200"
                                    data-oid="es7ez4b"
                                >
                                    Medical orders
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="l83mwk_">
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                            data-oid="n-5n0s2"
                        >
                            <CardTitle
                                className="text-sm font-medium text-gray-600"
                                data-oid="9l5z4zo"
                            >
                                Delivered Today
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-gray-400" data-oid="reu8.dk" />
                        </CardHeader>
                        <CardContent data-oid="crp1368">
                            <div className="text-2xl font-bold text-gray-900" data-oid="tud1ob9">
                                {analytics.deliveredOrders}
                            </div>
                            <div
                                className="flex items-center space-x-2 text-xs text-gray-600"
                                data-oid="3xool.i"
                            >
                                <span data-oid="3kp5i29">
                                    {analytics.onTimeDeliveryRate}% on time
                                </span>
                            </div>
                            <div className="mt-2" data-oid="acosu1y">
                                <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-200"
                                    data-oid="r248kes"
                                >
                                    {analytics.cancelledOrders} cancelled
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content with Tabs */}
                <div className="w-full" data-oid="3t6b:j7">
                    <Tabs
                        value={activeSection}
                        onValueChange={(value) => setActiveSection(value as OrderSection)}
                        data-oid="9yw3fmc"
                    >
                        <div
                            className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4"
                            data-oid="sdol52w"
                        >
                            <TabsList className="grid w-fit grid-cols-2" data-oid="_g48v1p">
                                <TabsTrigger
                                    value="live"
                                    className="flex items-center space-x-2"
                                    data-oid="hhoz3y9"
                                >
                                    <Activity className="w-4 h-4" data-oid="3gfnhu9" />
                                    <span data-oid="2.fm35:">Live Orders</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="completed"
                                    className="flex items-center space-x-2"
                                    data-oid="t_88le4"
                                >
                                    <CheckCircle className="w-4 h-4" data-oid="cp-u9f2" />
                                    <span data-oid="r.1xrdh">Completed Orders</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Order Type Filter */}
                            <div className="flex items-center space-x-4" data-oid="1sqv6g4">
                                <Select
                                    value={orderType}
                                    onValueChange={(value) => setOrderType(value as OrderType)}
                                    data-oid=":ewz2cr"
                                >
                                    <SelectTrigger className="w-48" data-oid="enzxqu4">
                                        <SelectValue
                                            placeholder="Filter by order type"
                                            data-oid="_sy.47l"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="5stj:4z">
                                        <SelectItem value="all" data-oid="t84s_ea">
                                            All Orders
                                        </SelectItem>
                                        <SelectItem value="normal" data-oid="b0z6gon">
                                            Normal Orders
                                        </SelectItem>
                                        <SelectItem value="prescription" data-oid="unr0uf2">
                                            Prescription Orders
                                        </SelectItem>
                                        <SelectItem value="subscription" data-oid="brl2:nh">
                                            Subscription Orders
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value={activeSection} className="space-y-4" data-oid="_vqg6z1">
                            {/* Search and Filters */}
                            <Card data-oid="0ksbd:-">
                                <CardHeader data-oid="inbwh1r">
                                    <CardTitle data-oid="wq_h0g0">Search & Filter Orders</CardTitle>
                                    <CardDescription data-oid="6k:8oa-">
                                        Find specific orders using various search criteria
                                    </CardDescription>
                                </CardHeader>
                                <CardContent data-oid="p86i78o">
                                    <div
                                        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                                        data-oid="-xfwaca"
                                    >
                                        <div data-oid="au2mzhe">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="o6ycvhc"
                                            >
                                                Search Orders
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Order number, customer name, phone..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full"
                                                data-oid="-ib3me:"
                                            />
                                        </div>

                                        <div data-oid="e07h45e">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="l5u-.tl"
                                            >
                                                Pharmacy/Vendor
                                            </label>
                                            <Select data-oid="cqjuzwv">
  <SelectTrigger data-oid="qn.mamb">
    <SelectValue
      placeholder="Select pharmacy"
      data-oid="rou1del"
    />
  </SelectTrigger>
  <SelectContent data-oid="7m6z2k3">
    {pharmacy && pharmacy.length > 0 && pharmacy.map((pharmacy) => (
      <SelectItem
        key={pharmacy._id} // Add a unique key for each item
        value={pharmacy.name} // Set the value dynamically
        data-oid={`v030x-${pharmacy._id}`} // Optional: Make the data-oid unique as well
      >
        {pharmacy.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                                        </div>

                                        <div className="flex items-end" data-oid="f_pibhi">
                                            <Button
                                                onClick={loadData}
                                                className="w-full"
                                                data-oid="skv7_16"
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Orders Table */}
                            <Card data-oid="cje8sqc">
                                <CardHeader data-oid="i5_rq2w">
                                    <div data-oid="28r50hg">
                                        <CardTitle data-oid="512gc4e">
                                            {activeSection === 'live'
                                                ? 'Live Orders'
                                                : 'Completed Orders'}{' '}
                                            ({orders.length} total)
                                        </CardTitle>
                                        <CardDescription data-oid="e6ilyv:">
                                            {activeSection === 'live'
                                                ? 'Orders that are currently being processed and not yet delivered'
                                                : 'Orders that have been delivered, cancelled, or refunded'}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0" data-oid="08rcyu6">
                                    <div
                                        className="border-b border-gray-200 max-h-[70vh] overflow-y-auto"
                                        data-oid="if78utk"
                                    >
                                        <table
                                            className="w-full divide-y divide-gray-200"
                                            data-oid="ejerops"
                                        >
                                            <thead className="bg-gray-50" data-oid="9eovvnx">
                                                <tr data-oid="14jlbwr">
                                                    <th
                                                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="y5x_xkk"
                                                    >
                                                        Order Details
                                                    </th>
                                                    <th
                                                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="n:vf4y:"
                                                    >
                                                        Customer
                                                    </th>
                                                    <th
                                                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="3xt6yn-"
                                                    >
                                                        Status
                                                    </th>
                                                    <th
                                                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="_7h_xpz"
                                                    >
                                                        Amount
                                                    </th>
                                                    <th
                                                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="4il.v8c"
                                                    >
                                                        Pharmacy/Vendor
                                                    </th>
                                                    <th
                                                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="b190m2a"
                                                    >
                                                        Created
                                                    </th>
                                                    <th
                                                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        data-oid="6:cwoit"
                                                    >
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody
                                                className="bg-white divide-y divide-gray-200"
                                                data-oid=":k1bkfq"
                                            >
                                                {currentOrders && currentOrders.length>0 && currentOrders.map((order) => (
                                                    <tr
                                                        key={order._id}
                                                        className="hover:bg-gray-50"
                                                        data-oid=":x_._v5"
                                                    >
                                                        <td
                                                            className="px-3 py-4"
                                                            data-oid="bcdj6yt"
                                                        >
                                                            <div
                                                                className="overflow-hidden"
                                                                data-oid="jd9lbgz"
                                                            >
                                                                <div
                                                                    className="flex items-center space-x-2"
                                                                    data-oid="nwbm4o8"
                                                                >
                                                                    {getOrderTypeIcon(order)}
                                                                    <div
                                                                        className="text-sm font-medium text-gray-900 truncate"
                                                                        data-oid="hx1.n17"
                                                                    >
                                                                        {order.orderNumber}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="text-sm text-gray-500 truncate"
                                                                    data-oid="h870-tn"
                                                                >
                                                                    {order.items.length} item(s) •{' '}
                                                                    {getOrderTypeLabel(order)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-3 py-4"
                                                            data-oid="zj4tuuq"
                                                        >
                                                            <div
                                                                className="overflow-hidden"
                                                                data-oid="sbi.l.t"
                                                            >
                                                                <div
                                                                    className="text-sm font-medium text-gray-900 truncate"
                                                                    data-oid="givzg3-"
                                                                >
                                                                    {order.customerName}
                                                                </div>
                                                                <div
                                                                    className="text-sm text-gray-500 truncate"
                                                                    data-oid="_dhcw:q"
                                                                >
                                                                    {order.customerPhone}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-3 py-4"
                                                            data-oid="-jik7au"
                                                        >
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                                                                data-oid="fgwkzom"
                                                            >
                                                                {formatStatus(order.status)}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-3 py-4"
                                                            data-oid="n9zhycz"
                                                        >
                                                            <div
                                                                className="text-sm font-medium text-gray-900"
                                                                data-oid="u03n_55"
                                                            >
                                                                EGP {order.totalAmount.toFixed(2)}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="ciz_izh"
                                                            >
                                                                {order.paymentStatus}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-3 py-4"
                                                            data-oid="mxprjkt"
                                                        >
                                                            <div
                                                                className="text-sm text-gray-900 truncate"
                                                                data-oid="0zegwrq"
                                                            >
                                                                {order.pharmacy?.name}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500 truncate"
                                                                data-oid="xkbts-q"
                                                            >
                                                                {order.pharmacy?.city}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className="px-3 py-4 text-sm text-gray-500"
                                                            data-oid="u.epkrz"
                                                        >
                                                            {new Date(
                                                                order.createdAt,
                                                            ).toLocaleDateString()}
                                                            <br data-oid="2jdcnvw" />
                                                            {new Date(
                                                                order.createdAt,
                                                            ).toLocaleTimeString()}
                                                        </td>
                                                        <td
                                                            className="px-3 py-4 text-sm font-medium"
                                                            data-oid="rwtldcw"
                                                        >
                                                            <div
                                                                className="flex items-center gap-1 flex-nowrap"
                                                                data-oid="g_g-6e2"
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-xs px-2 py-1 h-8 min-w-[60px]"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setIsViewingState(true);
                                                                    }}
                                                                    data-oid="if6.x9g"
                                                                >
                                                                    <Eye
                                                                        className="w-3 h-3 mr-1"
                                                                        data-oid="n32lzm3"
                                                                    />
                                                                    View
                                                                </Button>
                                                                {order.prescriptionId && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 text-xs px-2 py-1 h-8 min-w-[70px]"
                                                                        onClick={() =>
                                                                            handleViewPrescription(
                                                                                order.prescriptionId!,
                                                                            )
                                                                        }
                                                                        data-oid="od9ete0"
                                                                    >
                                                                        <Pill
                                                                            className="w-3 h-3 mr-1"
                                                                            data-oid="kbxm4ko"
                                                                        />
                                                                        View Rx
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Show total count */}
                                    <div
                                        className="flex items-center justify-center px-4 py-3 bg-gray-50 border-t border-gray-200"
                                        data-oid="dr86xu8"
                                    >
                                        <span className="text-sm text-gray-700" data-oid="vlu848h">
                                            Showing all {orders.length} orders
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && isViewingState && (
                <Dialog
                    open={isViewingState && !!selectedOrder}
                    onOpenChange={() => {
                        setIsViewingState(false);
                        setSelectedOrder(null);
                    }}
                    data-oid="xxe:3ly"
                >
                    <DialogContent
                        className="max-w-6xl max-h-[90vh] overflow-y-auto"
                        data-oid="zzewrys"
                    >
                        <DialogHeader data-oid="aceup2h">
                            <DialogTitle
                                className="flex items-center justify-between"
                                data-oid="ahdg3zk"
                            >
                                <div className="flex items-center space-x-3" data-oid="1n16kza">
                                    <div
                                        className="w-10 h-10 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] text-white rounded-full flex items-center justify-center shadow-lg"
                                        data-oid="q-sgz48"
                                    >
                                        {getOrderTypeIcon(selectedOrder, true)}
                                    </div>
                                    <div data-oid="rg.nwx:">
                                        <h2 className="text-xl font-bold" data-oid="qu62b5b">
                                            Order Details - {selectedOrder?.orderNumber}
                                        </h2>
                                        <p className="text-sm text-gray-600" data-oid="pyn6y24">
                                            {getOrderTypeLabel(selectedOrder)} • Created on{' '}
                                            {new Date(selectedOrder?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2" data-oid=":po.5z:">
                                    <Badge
                                        className={getStatusColor(selectedOrder?.status)}
                                        data-oid="1-4r7b3"
                                    >
                                        {formatStatus(selectedOrder?.status)}
                                    </Badge>
                                </div>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="abplv48">
                            {/* Order Information */}
                            <div className="space-y-4" data-oid="nyj2pd4">
                                <Card data-oid="a8:9svd">
                                    <CardHeader data-oid="by_t35j">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="m1cn_y1"
                                        >
                                            <Package className="w-5 h-5" data-oid="p8_wky." />
                                            <span data-oid="_62m_2v">Order Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="af5ejga">
                                        <div className="flex justify-between" data-oid="fdqzsjp">
                                            <span className="text-gray-600" data-oid="070i2x.">
                                                Order Type:
                                            </span>
                                            <span className="font-medium" data-oid="p2l-3kj">
                                                {getOrderTypeLabel(selectedOrder)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid="35g40rr">
                                            <span className="text-gray-600" data-oid="5pzabr5">
                                                Status:
                                            </span>
                                            <Badge
                                                className={getStatusColor(selectedOrder?.status)}
                                                data-oid="8fewyix"
                                            >
                                                {formatStatus(selectedOrder?.status)}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between" data-oid="_ag6o6z">
                                            <span className="text-gray-600" data-oid="eyjb60y">
                                                Total Amount:
                                            </span>
                                            <span className="font-medium" data-oid="3dci2y_">
                                                EGP {selectedOrder?.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid=":xyys9t">
                                            <span className="text-gray-600" data-oid="_v_yda7">
                                                Payment Status:
                                            </span>
                                            <span className="font-medium" data-oid="1so-jy7">
                                                {selectedOrder?.paymentStatus}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid="xn2.4zi">
                                            <span className="text-gray-600" data-oid="vvkgy8i">
                                                Created:
                                            </span>
                                            <span data-oid="5vwwfs3">
                                                {new Date(selectedOrder?.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {selectedOrder?.prescriptionId && (
                                            <div
                                                className="flex justify-between"
                                                data-oid="qys2hoh"
                                            >
                                                <span className="text-gray-600" data-oid="vmhhm8l">
                                                    Prescription:
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleViewPrescription(
                                                            selectedOrder?.prescriptionId!,
                                                        )
                                                    }
                                                    data-oid="_v2vzp9"
                                                >
                                                    <Eye
                                                        className="w-4 h-4 mr-1"
                                                        data-oid="w:zuati"
                                                    />
                                                    View Prescription
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Customer Information */}
                                <Card data-oid="l5lpql0">
                                    <CardHeader data-oid="sozd0bv">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="oo_lzmi"
                                        >
                                            <User className="w-5 h-5" data-oid="14u5r8y" />
                                            <span data-oid="ymn80vz">Customer Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="gibtin.">
                                        <div className="flex justify-between" data-oid="s-ie0mv">
                                            <span className="text-gray-600" data-oid="30mmkst">
                                                Name:
                                            </span>
                                            <span className="font-medium" data-oid="tl19qke">
                                                {selectedOrder?.customerName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid="e1s_-1h">
                                            <span className="text-gray-600" data-oid="752n_px">
                                                Phone:
                                            </span>
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="q4:50-x"
                                            >
                                                <span className="font-medium" data-oid="3lz1h3y">
                                                    {selectedOrder?.customerPhone}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            selectedOrder?.customerPhone,
                                                        )
                                                    }
                                                    data-oid="mxmmkb1"
                                                >
                                                    <Copy className="w-3 h-3" data-oid="s3:_axs" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between" data-oid="2p9_9v1">
                                            <span className="text-gray-600" data-oid="_x_1kn4">
                                                Email:
                                            </span>
                                            <span className="font-medium" data-oid="kqhx0rh">
                                                {selectedOrder?.customerEmail}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pharmacy/Vendor Information */}
                                <Card data-oid="9m-0p:4">
                                    <CardHeader data-oid="l7:10e3">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="p83b5ek"
                                        >
                                            <Building2 className="w-5 h-5" data-oid="soppe3g" />
                                            <span data-oid="1zp4k2p">
                                                Pharmacy/Vendor Information
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3" data-oid="7:y9rl:">
                                        <div className="flex justify-between" data-oid="06-93iy">
                                            <span className="text-gray-600" data-oid="m661-h8">
                                                Name:
                                            </span>
                                            <span className="font-medium" data-oid="-gh732:">
                                                {selectedOrder?.pharmacy?.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid="u5opw2w">
                                            <span className="text-gray-600" data-oid="2jsvpv0">
                                                Phone:
                                            </span>
                                            <span className="font-medium" data-oid="r9-3svx">
                                                {selectedOrder?.pharmacy?.phone}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid="ccc0id0">
                                            <span className="text-gray-600" data-oid="u7wn08k">
                                                City:
                                            </span>
                                            <span className="font-medium" data-oid="xgk1ecj">
                                                {selectedOrder?.pharmacy?.city}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Delivery Address */}
                                <Card data-oid="zzzm17i">
                                    <CardHeader data-oid="dh-dslo">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="4r4rv0u"
                                        >
                                            <MapPin className="w-5 h-5" data-oid="rj:iddp" />
                                            <span data-oid="ef6heyi">Delivery Address</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent data-oid="nr_6mi8">
                                        <div className="text-sm" data-oid="c939oi2">
                                            <p data-oid="st-h.sl">
                                                {selectedOrder?.deliveryAddress.street}
                                            </p>
                                            <p data-oid="ci86a4h">
                                                {selectedOrder?.deliveryAddress.city},{' '}
                                                {selectedOrder?.deliveryAddress.governorate}
                                            </p>
                                            <p data-oid="n.9k7hk">
                                                Phone: {selectedOrder?.deliveryAddress.phone}
                                            </p>
                                            {selectedOrder?.deliveryAddress.notes && (
                                                <p
                                                    className="mt-2 text-gray-600"
                                                    data-oid="v:z1jbx"
                                                >
                                                    Notes: {selectedOrder?.deliveryAddress.notes}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Items and Status History */}
                            <div className="space-y-4" data-oid="6q.kuud">
                                {/* Order Items */}
                                <Card data-oid="mgy8vyh">
                                    <CardHeader data-oid="3gv8_.3">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="zoi1xr1"
                                        >
                                            <ShoppingCart className="w-5 h-5" data-oid="uf.pkj0" />
                                            <span data-oid="knp264b">Order Items</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent data-oid="6ki_v7z">
                                        <div className="space-y-3" data-oid="rco4o_1">
                                            {selectedOrder?.items.map((item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded border"
                                                    data-oid="6djvmkf"
                                                >
                                                    <img
                                                        src={
                                                            item?.productId?.images[index]?.url ||
                                                            (() => {
                                                                try {
                                                                    const imageData = typeof item.image === 'string'
                                                                        ? JSON.parse(item.image)
                                                                        : item.image;
                                                                    return imageData?.url || '/images/cura-logo.png';
                                                                } catch (error) {
                                                                    return typeof item.image === 'string' && item.image.startsWith('http')
                                                                        ? item.image
                                                                        : '/images/cura-logo.png';
                                                                }
                                                            })()
                                                        }
                                                        alt={item.productName}
                                                        className="w-12 h-12 object-cover rounded"
                                                        data-oid="b4:x2j-"
                                                        onError={(e) => {
                                                            e.target.src = '/images/cura-logo.png';
                                                        }}
                                                    />

                                                    <div className="flex-1" data-oid="6vmrj:k">
                                                        <p
                                                            className="font-medium text-sm"
                                                            data-oid="87b0wvi"
                                                        >
                                                            {item.productName}
                                                        </p>
                                                        <p
                                                            className="text-xs text-gray-600"
                                                            data-oid="coc40cs"
                                                        >
                                                            {item.pharmacy}
                                                        </p>
                                                        <p
                                                            className="text-xs text-gray-600"
                                                            data-oid="r6oze_6"
                                                        >
                                                            Qty: {item.quantity}{' '}
                                                            {item.unit || 'units'} × EGP{' '}
                                                            {item.unitPrice.toFixed(2)}
                                                        </p>

                                                        {/* Display Prescription Files if they exist */}
                                                        {item.prescription && item.prescription.length > 0 && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-gray-500 mb-1">Prescription Files:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {item.prescription.map((prescriptionItem, prescriptionIndex) => (
                                                                        <div key={prescriptionIndex} className="flex flex-col items-center">
                                                                            {prescriptionItem.prescription?.files && prescriptionItem.prescription.files.map((file, fileIndex) => (
                                                                                <div key={fileIndex} className="flex items-center space-x-1">
                                                                                    <img
                                                                                        src={file.url}
                                                                                        alt={file.filename}
                                                                                        className="w-8 h-8 object-cover rounded border"
                                                                                    />
                                                                                    <span className="text-xs text-gray-600">{file.filename}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right" data-oid="y1ksk2.">
                                                        <p
                                                            className="font-medium text-sm"
                                                            data-oid="xdafh68"
                                                        >
                                                            EGP {item.totalPrice.toFixed(2)}
                                                        </p>
                                                        {item.prescription && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-purple-600 border-purple-200"
                                                                data-oid="i5c9u2h"
                                                            >
                                                                Rx
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Status History */}
                                <Card data-oid="4o501pq">
                                    <CardHeader data-oid="n71764a">
                                        <CardTitle
                                            className="flex items-center space-x-2"
                                            data-oid="ovka6p4"
                                        >
                                            <Clock className="w-5 h-5" data-oid="1ko0:mf" />
                                            <span data-oid="re5-zpv">Status History</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent data-oid="u64._:7">
                                        <div className="space-y-3" data-oid="gmhib-z">
                                            {selectedOrder?.statusHistory.map((history, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start space-x-3"
                                                    data-oid="tb77s3y"
                                                >
                                                    <div
                                                        className="w-2 h-2 bg-[#1F1F6F] rounded-full mt-2"
                                                        data-oid="5rfu2bx"
                                                    ></div>
                                                    <div className="flex-1" data-oid="zr3zech">
                                                        <p
                                                            className="text-sm font-medium"
                                                            data-oid="_zwi735"
                                                        >
                                                            {formatStatus(history.status)}
                                                        </p>
                                                        <p
                                                            className="text-xs text-gray-600"
                                                            data-oid="7wb8x2k"
                                                        >
                                                            {new Date(
                                                                history.timestamp,
                                                            ).toLocaleString()}
                                                        </p>
                                                        <p
                                                            className="text-xs text-gray-600"
                                                            data-oid="z3-0i_8"
                                                        >
                                                            Updated by: {history.updatedBy}
                                                        </p>
                                                        {history.notes && (
                                                            <p
                                                                className="text-xs text-gray-600 mt-1"
                                                                data-oid="dn72afo"
                                                            >
                                                                {history.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Prescription Viewer */}
            {isPrescriptionViewerOpen && selectedPrescription && (
                <PrescriptionImageViewer
                    files={selectedPrescription?.files || []}
                    selectedIndex={0}
                    onClose={() => {
                        setIsPrescriptionViewerOpen(false);
                        setSelectedPrescription(null);
                    }}
                    onIndexChange={(index) => {
                        // Handle index change if needed
                        console.log('Index changed to:', index);
                    }}
                    data-oid="0evg347"
                />
            )}
        </div>
    );
}
