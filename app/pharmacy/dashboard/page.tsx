'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { revenueCalculationService } from '@/lib/services/revenueCalculationService';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { PharmacyAnalyticsDashboard } from '@/components/analytics/PharmacyAnalyticsDashboard';
import { InventoryManagement } from '@/components/inventory/InventoryManagement';
import { PharmacyReturnsManager } from '@/components/pharmacy/PharmacyReturnsManager';
import { OrderDetailsModal } from '@/components/pharmacy/OrderDetailsModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { filterProducts } from '@/lib/data/products';
import { providerOrderService } from '@/lib/services/pharmacyOrderService';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getAuthToken } from '@/lib/utils/cookies';
export default function PharmacyDashboardPage() {
    const {user} = useAuth()
    const { t } = useTranslation();
    const router = useRouter();
    const [orders, setOrders] = useState<PharmacyOrder[]>([]);
    const [stats, setStats] = useState(0);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [productData, setproductData] = useState([]);
    const [pharmacyId, setPharmacyId] = useState<string>('');
    // Mock data for demonstration
    const loadProducts = async()=>{
        try {  
            const productData = await filterProducts({})
            console.log(productData)
            setproductData(productData)
        } catch (error) {
            console.log(error)
        }
        
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const handleOrderClick = (order: PharmacyOrder) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    const closeOrderModal = () => {
        setIsOrderModalOpen(false);
        setSelectedOrder(null);
    };
    const getUser = async():Promise<string>=>{
        const token = getAuthToken();
        if(token){     
            const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`,{
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            })
            const data = await user.json()
            console.log(data)
            const pharmacyId = data.data.pharmacy.id;
            setPharmacyId(pharmacyId); // Store pharmacy ID in state
            return pharmacyId;
        }
    }
    useEffect(() => {
        const loadData = async () => {
            try {
                const userId = await getUser()
                const allOrders = await providerOrderService.getAllOrders({},userId);
                // const orderStats = await providerOrderService.getOrderStats();
                const revenue = await revenueCalculationService.getRevenueSummary();
                loadProducts();
                setOrders(allOrders.data);
                setStats(allOrders.pagination.totalRecords);
                setRevenueData(revenue);
                setLoading(false);
            } catch (error) {
                console.error('Error loading pharmacy data:', error);
                setLoading(false);
            }
        };

        loadData();
        // const unsubscribe = providerOrderService.subscribe((updatedOrders) => {
        //     setOrders(updatedOrders);
        //     setStats(providerOrderService.getOrderStats());
        // });
        // providerOrderService.startRealTimeSimulation();
        // return unsubscribe;
    }, []);

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="zf7gevc"
            >
                <div className="text-center" data-oid="qe2gr5j">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F] mx-auto mb-4"
                        data-oid="15of:ap"
                    ></div>
                    <p className="text-gray-600" data-oid="vj2j-m9">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="k3x_3ek">
            {/* Main Dashboard Content */}
            <div className="p-6 space-y-6" data-oid="46qmf7a">
                {/* Dashboard Tabs */}
                <Tabs defaultValue="analytics" className="space-y-6" data-oid="n68p6f.">
                    <TabsList className="grid w-full grid-cols-5" data-oid="qz6_1hg">
                        <TabsTrigger value="analytics" data-oid="-4woz_5">
                            Analytics Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="operations" data-oid="bpqav_s">
                            Operations View
                        </TabsTrigger>
                        <TabsTrigger value="completed" data-oid="wyxk7jq">
                            Completed Orders
                        </TabsTrigger>
                        <TabsTrigger value="suspended" data-oid="uc8puq1">
                            Suspended Orders
                        </TabsTrigger>
                        <TabsTrigger value="returns" data-oid="krfzbkj">
                            Returns Management
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="analytics" data-oid="gq3svaf">
                        <PharmacyAnalyticsDashboard data-oid="ftb_9dw" />
                    </TabsContent>

                    <TabsContent value="operations" data-oid="wkp-kmq">
                        <InventoryManagement data-oid="250y:dy" />
                    </TabsContent>

                    <TabsContent value="completed" data-oid="pad5llm">
                        <div className="space-y-6" data-oid="slmgkop">
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                                data-oid="hv_s6dw"
                            >
                                <div
                                    className="flex items-center justify-between mb-6"
                                    data-oid="t.4sw0p"
                                >
                                    <div data-oid="kr76vq_">
                                        <h2
                                            className="text-xl font-semibold text-gray-900"
                                            data-oid="wfqdp3p"
                                        >
                                            Completed Orders
                                        </h2>
                                        <p className="text-gray-600 mt-1" data-oid="ybcj62j">
                                            All completed and delivered orders
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="b72n6vc">
                                        <span
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                            data-oid="77xygf6"
                                        >
                                            {orders && 
                                                orders.filter(
                                                    (order) => order.status === 'delivered',
                                                ).length
                                            }{' '}
                                            Orders
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4" data-oid="sy2g373">
                                    {orders.filter((order) => order.status === 'delivered')
                                        .length === 0 ? (
                                        <div className="text-center py-12" data-oid=".y:te8b">
                                            <svg
                                                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid="6s01q:x"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                    data-oid="jf4fo06"
                                                />
                                            </svg>
                                            <h3
                                                className="text-lg font-medium text-gray-900 mb-2"
                                                data-oid="ncw8ctk"
                                            >
                                                No Completed Orders
                                            </h3>
                                            <p className="text-gray-600" data-oid="-ex_3r3">
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
                                                    data-oid="w1b8g-5"
                                                >
                                                    <div className="p-6" data-oid="9i5c-be">
                                                        {/* Order Header */}
                                                        <div
                                                            className="flex items-center justify-between mb-4"
                                                            data-oid="nv02ycs"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-4"
                                                                data-oid="q5w4a6n"
                                                            >
                                                                <div
                                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                                    style={{
                                                                        backgroundColor: '#1F1F6F',
                                                                    }}
                                                                    data-oid="x0w3w:w"
                                                                >
                                                                    <svg
                                                                        className="w-5 h-5 text-white"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                        data-oid="38dh:7w"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                                                            clipRule="evenodd"
                                                                            data-oid="l64fvm3"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div data-oid="gvvy4fj">
                                                                    <div
                                                                        className="flex items-center space-x-2"
                                                                        data-oid="any65i4"
                                                                    >
                                                                        <h4
                                                                            className="text-lg font-semibold text-gray-900"
                                                                            data-oid="p4ajd:7"
                                                                        >
                                                                            {order.orderNumber}
                                                                        </h4>
                                                                        {order.prescriptionId && (
                                                                            <span
                                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                                                data-oid="34z.oe2"
                                                                            >
                                                                                <svg
                                                                                    className="w-3 h-3 mr-1"
                                                                                    fill="currentColor"
                                                                                    viewBox="0 0 20 20"
                                                                                    data-oid="c_.2933"
                                                                                >
                                                                                    <path
                                                                                        fillRule="evenodd"
                                                                                        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                                                                        clipRule="evenodd"
                                                                                        data-oid=".lbgw:t"
                                                                                    />
                                                                                </svg>
                                                                                Rx
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p
                                                                        className="text-sm text-gray-600"
                                                                        data-oid="5:vv6ut"
                                                                    >
                                                                        {order.customerName} •{' '}
                                                                        {order.customerPhone}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex items-center space-x-3"
                                                                data-oid="4d_h99a"
                                                            >
                                                                <span
                                                                    className="px-3 py-1 rounded-full text-sm font-medium border bg-green-100 text-green-800 border-green-200"
                                                                    data-oid="0r5dwd-"
                                                                >
                                                                    Delivered
                                                                </span>
                                                                <span
                                                                    className="text-lg font-bold text-gray-900"
                                                                    data-oid="tri0ln7"
                                                                >
                                                                    EGP{' '}
                                                                    {order.totalAmount.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Order Items Section */}
                                                        <div className="mb-4" data-oid="pjmvrk_">
                                                            <h5
                                                                className="font-medium text-gray-900 mb-3"
                                                                data-oid="20nnbu_"
                                                            >
                                                                Order Items ({order.items.length})
                                                            </h5>
                                                            <div
                                                                className="space-y-3"
                                                                data-oid="fuu21yo"
                                                            >
                                                                {order.items.map(
                                                                    (item, itemIndex) => (
                                                                        <div
                                                                            key={itemIndex}
                                                                            className="flex items-center space-x-3"
                                                                            data-oid="ftxx-e_"
                                                                        >
                                                                            <div
                                                                                className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden"
                                                                                data-oid="kghlx7i"
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        item.productId?.images?.[itemIndex]?.url ||
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
                                                                                    data-oid="flinnls"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                className="flex-1"
                                                                                data-oid="0xs_h9t"
                                                                            >
                                                                                <div
                                                                                    className="flex items-center justify-between"
                                                                                    data-oid="prdlpfz"
                                                                                >
                                                                                    <div data-oid="c.0ow0n">
                                                                                        <h6
                                                                                            className="font-medium text-gray-900"
                                                                                            data-oid="g9ucgsq"
                                                                                        >
                                                                                            {
                                                                                                item.productName
                                                                                            }
                                                                                        </h6>
                                                                                        <p
                                                                                            className="text-sm text-gray-600"
                                                                                            data-oid="7oyup9h"
                                                                                        >
                                                                                            {
                                                                                                item.manufacturer
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                    <div
                                                                                        className="text-right"
                                                                                        data-oid="n55jq7w"
                                                                                    >
                                                                                        <p
                                                                                            className="font-medium text-green-600"
                                                                                            data-oid="g:er:f-"
                                                                                        >
                                                                                            EGP{' '}
                                                                                            {
                                                                                                item.unitPrice
                                                                                            }
                                                                                        </p>
                                                                                        <p
                                                                                            className="text-sm text-gray-600"
                                                                                            data-oid="voxsrbm"
                                                                                        >
                                                                                            Qty:{' '}
                                                                                            {
                                                                                                item.quantity
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {item.prescription && (
                                                                                <span
                                                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                                                    data-oid="u33m7jg"
                                                                                >
                                                                                    <svg
                                                                                        className="w-3 h-3 mr-1"
                                                                                        fill="currentColor"
                                                                                        viewBox="0 0 20 20"
                                                                                        data-oid="ad-zjo8"
                                                                                    >
                                                                                        <path
                                                                                            fillRule="evenodd"
                                                                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                                                            clipRule="evenodd"
                                                                                            data-oid="utm55ya"
                                                                                        />
                                                                                    </svg>
                                                                                    Rx
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Delivery Information */}
                                                        <div
                                                            className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                                                            data-oid="6lwk:eu"
                                                        >
                                                            <div
                                                                className="flex items-start space-x-3"
                                                                data-oid="h1.ilq3"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5 text-blue-600 mt-0.5"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    data-oid="5h-amwx"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                                        clipRule="evenodd"
                                                                        data-oid="gjtmu:f"
                                                                    />
                                                                </svg>
                                                                <div
                                                                    className="flex-1"
                                                                    data-oid="8tidfz9"
                                                                >
                                                                    <h6
                                                                        className="font-medium text-blue-900 mb-1"
                                                                        data-oid="v5caf0_"
                                                                    >
                                                                        Delivery to{' '}
                                                                        {order.deliveryAddress.city}
                                                                    </h6>
                                                                    <p
                                                                        className="text-sm text-blue-800"
                                                                        data-oid="otujko-"
                                                                    >
                                                                        {
                                                                            order.deliveryAddress
                                                                                .street
                                                                        }
                                                                    </p>
                                                                    <p
                                                                        className="text-sm text-blue-800"
                                                                        data-oid="qqr2u0:"
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
                                                            data-oid="563zg:9"
                                                        >
                                                            <div
                                                                className="flex items-center space-x-2 text-sm text-gray-600"
                                                                data-oid="nphc57b"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    data-oid="04u_2xb"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                                        clipRule="evenodd"
                                                                        data-oid="::pb9l2"
                                                                    />
                                                                </svg>
                                                                <span data-oid="e1wofax">
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
                                                                data-oid="4-.le_y"
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

                    <TabsContent value="suspended" data-oid="w-wf4oo">
                        <div className="space-y-6" data-oid="k-c3x40">
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                                data-oid="_q4a9u5"
                            >
                                <div
                                    className="flex items-center justify-between mb-6"
                                    data-oid="cqg6ecy"
                                >
                                    <div data-oid="hvmpvk.">
                                        <h2
                                            className="text-xl font-semibold text-gray-900"
                                            data-oid=".zu2b0h"
                                        >
                                            Suspended Orders
                                        </h2>
                                        <p className="text-gray-600 mt-1" data-oid="j6ma5m5">
                                            All orders requiring prescription verification or with
                                            issues
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="7xfbph5">
                                        <span
                                            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                                            data-oid="yro_1gw"
                                        >
                                            {
                                                orders.filter(
                                                    (order) =>
                                                        (order.prescriptionRequired && order.prescriptionVerified === false) ||
                                                        (providerOrderService.requiresPrescription(
                                                            order,
                                                        ) &&
                                                            order.prescriptionRequired && order.prescriptionVerified ===
                                                                undefined &&
                                                            order.status === 'pending'),
                                                ).length
                                            }{' '}
                                            Orders
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4" data-oid="8jglf0k">
                                    {orders.filter(
                                        (order) =>
                                            (order.prescriptionRequired && order.prescriptionVerified === false) ||
                                            (providerOrderService.requiresPrescription(
                                                order,
                                            ) &&
                                                order.prescriptionRequired && order.prescriptionVerified === undefined &&
                                                order.status === 'pending'),
                                    ).length === 0 ? (
                                        <div className="text-center py-12" data-oid="h02vvh:">
                                            <svg
                                                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid="tqmlox1"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                    data-oid="q5vrjo4"
                                                />
                                            </svg>
                                            <h3
                                                className="text-lg font-medium text-gray-900 mb-2"
                                                data-oid="a_zgtts"
                                            >
                                                No Suspended Orders
                                            </h3>
                                            <p className="text-gray-600" data-oid="dbkjgj5">
                                                Orders requiring attention will appear here.
                                            </p>
                                        </div>
                                    ) : (
                                        orders
                                            .filter(
                                                (order) =>
                                                    (order.prescriptionRequired && order.prescriptionVerified === false) ||
                                                    (providerOrderService.requiresPrescription(
                                                        order,
                                                    ) &&
                                                        order.prescriptionRequired && order.prescriptionVerified === undefined &&
                                                        order.status === 'pending'),
                                            )
                                            .map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="border border-amber-200 rounded-lg p-4 bg-amber-50 hover:shadow-md transition-shadow cursor-pointer"
                                                    onClick={() => handleOrderClick(order)}
                                                    data-oid="psss28z"
                                                >
                                                    <div
                                                        className="flex items-center justify-between"
                                                        data-oid="us:3vq5"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-4"
                                                            data-oid="ml9blvj"
                                                        >
                                                            <div
                                                                className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"
                                                                data-oid="9zfao0c"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5 text-amber-600"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                    data-oid="0zgjmy0"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                        clipRule="evenodd"
                                                                        data-oid="nly72_e"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div data-oid="5cfk2-w">
                                                                <div
                                                                    className="flex items-center space-x-2"
                                                                    data-oid="u8w9fpe"
                                                                >
                                                                    <h4
                                                                        className="font-semibold text-gray-900"
                                                                        data-oid="1::9mx5"
                                                                    >
                                                                        {order.orderNumber}
                                                                    </h4>
                                                                    {order.prescriptionId && (
                                                                        <span
                                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                                            data-oid="oq.t9a9"
                                                                        >
                                                                            <svg
                                                                                className="w-3 h-3 mr-1"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                                data-oid="kespn89"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                                                                    clipRule="evenodd"
                                                                                    data-oid=".nl83w4"
                                                                                />
                                                                            </svg>
                                                                            Rx
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p
                                                                    className="text-sm text-gray-600"
                                                                    data-oid="-8g:jqh"
                                                                >
                                                                    {order.customerName} •{' '}
                                                                    {order.customerPhone}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="text-right"
                                                            data-oid="uvzi6af"
                                                        >
                                                            <p
                                                                className="font-semibold text-gray-900"
                                                                data-oid="rkdjpr7"
                                                            >
                                                                EGP {order.totalAmount.toFixed(2)}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid=".u5wd0_"
                                                            >
                                                                {formatTime(order.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="mt-3 flex items-center justify-between"
                                                        data-oid="b:tvy4j"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="ihc97r4"
                                                        >
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    order.prescriptionRequired && order.prescriptionVerified ===
                                                                    false
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-amber-100 text-amber-800'
                                                                }`}
                                                                data-oid="az999fr"
                                                            >
                                                                {order.prescriptionRequired && order.prescriptionVerified ===
                                                                false
                                                                    ? 'Prescription Rejected'
                                                                    : 'Prescription Review Required'}
                                                            </span>
                                                            {providerOrderService.requiresPrescription(
                                                                order,
                                                            ) && (
                                                                <span
                                                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                                                    data-oid="hztlgmi"
                                                                >
                                                                    Rx Required
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOrderClick(order);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                            data-oid="zx_6zkb"
                                                        >
                                                            Review Order
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="returns" data-oid="6jq3p9j">
                        <PharmacyReturnsManager
                            pharmacyId={pharmacyId}
                            data-oid="d5u4nq1"
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={isOrderModalOpen}
                onClose={closeOrderModal}
                order={selectedOrder}
                data-oid="4v4zh0c"
            />
        </div>
    );
}
