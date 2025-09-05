'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/lib/services/orderMonitoringService';
import {
    Package,
    User,
    MapPin,
    Phone,
    Mail,
    CreditCard,
    Clock,
    FileText,
    Truck,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    DollarSign,
    Pill,
    Building2,
    Copy,
    ExternalLink,
    Eye,
} from 'lucide-react';

interface VendorOrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export function VendorOrderDetailsModal({ order, isOpen, onClose }: VendorOrderDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'items' | 'timeline' | 'delivery'>(
        'details',
    );

    if (!order) return null;

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
    const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString();
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-orange-100 text-orange-800';
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'out-for-delivery':
                return 'bg-purple-100 text-purple-800';
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

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const tabs = [
        { id: 'details', label: 'Order Details', icon: FileText },
        { id: 'items', label: 'Items', icon: Package },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'delivery', label: 'Delivery', icon: Truck },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="eipy.2n">
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-oid="0y1e_ns">
                <DialogHeader data-oid="v1e_sih">
                    <DialogTitle className="flex items-center justify-between" data-oid="2y352o2">
                        <div className="flex items-center space-x-3" data-oid="y0yrrvn">
                            <div
                                className="w-10 h-10 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center"
                                data-oid=".21xfnb"
                            >
                                <Package className="w-5 h-5" data-oid="aq3gkqe" />
                            </div>
                            <div data-oid="n8h2:sz">
                                <h2 className="text-xl font-bold" data-oid="o3myed.">
                                    {order.orderNumber}
                                </h2>
                                <p className="text-sm text-gray-600" data-oid="ov6cy3v">
                                    Order placed on {formatDateTime(order.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="rsmaa1z">
                            <Badge className={getStatusColor(order.status)} data-oid="60gl.ab">
                                {order.status.toUpperCase()}
                            </Badge>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200" data-oid="r6doz97">
                    <nav className="flex space-x-8" data-oid="rz-mkpl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    activeTab === tab.id
                                        ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="s-49ps7"
                            >
                                <tab.icon className="w-4 h-4" data-oid="-6p-xu1" />

                                <span data-oid="87taqsu">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6" data-oid="uf5yv7l">
                    {activeTab === 'details' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="se8m2x5">
                            {/* Customer Information */}
                            <Card data-oid="qt_0v0j">
                                <CardHeader data-oid="ai4h012">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="j3u7bqp"
                                    >
                                        <User className="w-5 h-5" data-oid="xjear7c" />
                                        <span data-oid="2.qs9o7">Customer Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="qnf_2r1">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="4ce0eb4"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="_1g1yl.">
                                            Name:
                                        </span>
                                        <span className="font-medium" data-oid="2tb4yi9">
                                            {order.customerName}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="9jim66i"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="630_uz1">
                                            Phone:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="dao1_ct"
                                        >
                                            <span className="font-medium" data-oid="y66.tmd">
                                                {order.customerPhone}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(order.customerPhone)}
                                                data-oid="wg05ewd"
                                            >
                                                <Copy className="w-3 h-3" data-oid=".lk2q9h" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="vugp15j"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="f6s:svl">
                                            Email:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="wgv5fpv"
                                        >
                                            <span className="font-medium" data-oid="g-rlp_i">
                                                {order.customerEmail}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(order.customerEmail)}
                                                data-oid="nqjs2ff"
                                            >
                                                <Copy className="w-3 h-3" data-oid="1te-0i5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="awe3--u"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="1:oq12g">
                                            Customer ID:
                                        </span>
                                        <span
                                            className="font-medium text-xs bg-gray-100 px-2 py-1 rounded"
                                            data-oid="baubqva"
                                        >
                                            {order.customerId}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Vendor Information */}
                            <Card data-oid="x_xqnaj">
                                <CardHeader data-oid="l6e9x9:">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="gi555zj"
                                    >
                                        <Building2 className="w-5 h-5" data-oid="--2gf3d" />

                                        <span data-oid="10z694u">Vendor Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="6lju8-j">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="ttqx742"
                                    >
                                        <span className="text-sm text-gray-600" data-oid=":fkjws:">
                                            Name:
                                        </span>
                                        <span className="font-medium" data-oid="jwx1-gd">
                                            PharmaTech Solutions
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="wqiu8.r"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="2.95_4-">
                                            Phone:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="dea6guu"
                                        >
                                            <span className="font-medium" data-oid="wv73bk4">
                                                +20 2 2391 5555
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard('+20 2 2391 5555')}
                                                data-oid=":o3--q0"
                                            >
                                                <Copy className="w-3 h-3" data-oid="-.:glbg" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="5s8qiee"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="d4:7_w6">
                                            City:
                                        </span>
                                        <span className="font-medium" data-oid="8s_f123">
                                            6th of October City
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="l8_do8t"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="xai7808">
                                            Vendor ID:
                                        </span>
                                        <span
                                            className="font-medium text-xs bg-gray-100 px-2 py-1 rounded"
                                            data-oid="7--6iiv"
                                        >
                                            pharmatech-001
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card data-oid="si8i:ou">
                                <CardHeader data-oid="5jjzi_v">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="-f:5dqw"
                                    >
                                        <CreditCard className="w-5 h-5" data-oid="vggsw8." />

                                        <span data-oid="o_a32j2">Payment Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="jf:xl88">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="eyt4o_r"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="d1jirv0">
                                            Method:
                                        </span>
                                        <span className="font-medium capitalize" data-oid="2j_-e.k">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="pa6b0jh"
                                    >
                                        <span className="text-sm text-gray-600" data-oid=".07ze5j">
                                            Status:
                                        </span>
                                        <Badge
                                            className={getPaymentStatusColor(order.paymentStatus)}
                                            data-oid="fkwbsvo"
                                        >
                                            {order.paymentStatus.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <Separator data-oid="8i:d6l0" />
                                    <div className="space-y-2" data-oid="hm9t.b5">
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid=":87xej6"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="uu:g1z_"
                                            >
                                                Subtotal:
                                            </span>
                                            <span className="font-medium" data-oid="aj-yws6">
                                                {formatCurrency(order.subtotal)}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="s:ip_sw"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="-uxm0ge"
                                            >
                                                Delivery Fee:
                                            </span>
                                            <span className="font-medium" data-oid="rdq9p:c">
                                                {formatCurrency(order.deliveryFee)}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="m.2hz9t"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="6hwr2gh"
                                            >
                                                Discount:
                                            </span>
                                            <span
                                                className="font-medium text-green-600"
                                                data-oid="xeemr7-"
                                            >
                                                -{formatCurrency(order.discount)}
                                            </span>
                                        </div>
                                        <Separator data-oid="9:rkx0t" />
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="br4fn2p"
                                        >
                                            <span className="font-semibold" data-oid="h2y_n-f">
                                                Total Amount:
                                            </span>
                                            <span className="font-bold text-lg" data-oid="c.tv1vx">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Information - NO PRESCRIPTION INFO */}
                            <Card data-oid="mc66lnh">
                                <CardHeader data-oid="vg1es8v">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="u4g6jwx"
                                    >
                                        <AlertCircle className="w-5 h-5" data-oid="mcqvq6h" />

                                        <span data-oid="10e0ak0">Additional Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="fox3lic">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="s:ag69u"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="4hogqr:">
                                            Estimated Delivery:
                                        </span>
                                        <span className="font-medium" data-oid="k.r2:0j">
                                            {order.estimatedDeliveryTime}
                                        </span>
                                    </div>
                                    {order.actualDeliveryTime && (
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="xy11p1s"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="x2ahk36"
                                            >
                                                Actual Delivery:
                                            </span>
                                            <span className="font-medium" data-oid="3evxkex">
                                                {order.actualDeliveryTime}
                                            </span>
                                        </div>
                                    )}
                                    {order.notes && (
                                        <div data-oid="26yatcs">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="zt-o8_b"
                                            >
                                                Notes:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-gray-50 p-2 rounded"
                                                data-oid="zgvh38h"
                                            >
                                                {order.notes}
                                            </p>
                                        </div>
                                    )}
                                    {order.cancelReason && (
                                        <div data-oid="p.0497v">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="o2bhndp"
                                            >
                                                Cancel Reason:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-red-50 p-2 rounded text-red-800"
                                                data-oid="tx3hhmh"
                                            >
                                                {order.cancelReason}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'items' && (
                        <div className="space-y-4" data-oid="28:vll-">
                            <div className="flex items-center justify-between" data-oid="d5omo0w">
                                <h3 className="text-lg font-semibold" data-oid=":4h_kwr">
                                    Order Items ({order.items.length})
                                </h3>
                                <div className="text-sm text-gray-600" data-oid="nex_bzr">
                                    Total: {formatCurrency(order.subtotal)}
                                </div>
                            </div>
                            {order.items.map((item, index) => (
                                <Card key={item.id} data-oid="bno1pqm">
                                    <CardContent className="p-4" data-oid="l5_8iw2">
                                        <div
                                            className="flex items-start space-x-4"
                                            data-oid="uttyqal"
                                        >
                                            <div
                                                className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                                                data-oid="32ykdgk"
                                            >
                                                <Pill
                                                    className="w-8 h-8 text-gray-400"
                                                    data-oid="j1du-i3"
                                                />
                                            </div>
                                            <div className="flex-1" data-oid="ydmm0id">
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid=":4gbg-x"
                                                >
                                                    <div data-oid="-p_tu07">
                                                        <h4
                                                            className="font-semibold"
                                                            data-oid="1exb279"
                                                        >
                                                            {item.productName}
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="nfiq4u_"
                                                        >
                                                            {item.productNameAr}
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-4 mt-2"
                                                            data-oid="uvsp56o"
                                                        >
                                                            <span
                                                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                                                                data-oid="8y6xwae"
                                                            >
                                                                {item.category}
                                                            </span>
                                                            <span
                                                                className="text-xs text-gray-500"
                                                                data-oid="0-mtmv:"
                                                            >
                                                                {item.manufacturer}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right" data-oid="ler-.ww">
                                                        <div
                                                            className="font-semibold"
                                                            data-oid="ii7t7a:"
                                                        >
                                                            {formatCurrency(item.totalPrice)}
                                                        </div>
                                                        <div
                                                            className="text-sm text-gray-600"
                                                            data-oid="p71typ."
                                                        >
                                                            {formatCurrency(item.unitPrice)} ×{' '}
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="space-y-4" data-oid="s9kaq85">
                            <h3 className="text-lg font-semibold" data-oid="2qu9vgs">
                                Order Timeline
                            </h3>
                            <div className="space-y-4" data-oid="jaetv2g">
                                {order.statusHistory.map((history, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4"
                                        data-oid="wc72.rv"
                                    >
                                        <div className="flex-shrink-0" data-oid=".:fgws4">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    history.status === 'delivered'
                                                        ? 'bg-green-100'
                                                        : history.status === 'cancelled'
                                                          ? 'bg-red-100'
                                                          : 'bg-blue-100'
                                                }`}
                                                data-oid="-_brgo."
                                            >
                                                {history.status === 'delivered' ? (
                                                    <CheckCircle
                                                        className="w-4 h-4 text-green-600"
                                                        data-oid="kfoudu."
                                                    />
                                                ) : history.status === 'cancelled' ? (
                                                    <XCircle
                                                        className="w-4 h-4 text-red-600"
                                                        data-oid="tcg70yk"
                                                    />
                                                ) : (
                                                    <Clock
                                                        className="w-4 h-4 text-blue-600"
                                                        data-oid="ggcm7g-"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1" data-oid="urx:3ib">
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid=":jts6a5"
                                            >
                                                <h4
                                                    className="font-medium capitalize"
                                                    data-oid=".rt0vua"
                                                >
                                                    {history.status.replace('-', ' ')}
                                                </h4>
                                                <span
                                                    className="text-sm text-gray-500"
                                                    data-oid="quus:oc"
                                                >
                                                    {formatDateTime(history.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600" data-oid="1229h27">
                                                Updated by: {history.updatedBy}
                                            </p>
                                            {history.notes && (
                                                <p
                                                    className="text-sm text-gray-500 mt-1"
                                                    data-oid="rx1-2b1"
                                                >
                                                    {history.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'delivery' && (
                        <div className="space-y-6" data-oid="gpba6s4">
                            <Card data-oid="fxuzia7">
                                <CardHeader data-oid="gnl87qo">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="jcwm48h"
                                    >
                                        <MapPin className="w-5 h-5" data-oid="o5db798" />

                                        <span data-oid="zn:o:75">Delivery Address</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="fqkbsgw">
                                    <div data-oid="deefef-">
                                        <span className="text-sm text-gray-600" data-oid="n3sfx3w">
                                            Street Address:
                                        </span>
                                        <p className="font-medium" data-oid="tr:3uk6">
                                            {order.deliveryAddress.street}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4" data-oid=".vac9xu">
                                        <div data-oid="2okxvz3">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="rashqki"
                                            >
                                                City:
                                            </span>
                                            <p className="font-medium" data-oid="0_6_qg2">
                                                {order.deliveryAddress.city}
                                            </p>
                                        </div>
                                        <div data-oid="eq7mpur">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="6bye1m1"
                                            >
                                                Governorate:
                                            </span>
                                            <p className="font-medium" data-oid="q.t1gka">
                                                {order.deliveryAddress.governorate}
                                            </p>
                                        </div>
                                    </div>
                                    <div data-oid="w1f8jso">
                                        <span className="text-sm text-gray-600" data-oid="q4h1nm8">
                                            Contact Phone:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="tmey0xr"
                                        >
                                            <p className="font-medium" data-oid="g.76jcq">
                                                {order.deliveryAddress.phone}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(order.deliveryAddress.phone)
                                                }
                                                data-oid="biei::p"
                                            >
                                                <Copy className="w-3 h-3" data-oid="kj0zh6b" />
                                            </Button>
                                        </div>
                                    </div>
                                    {order.deliveryAddress.notes && (
                                        <div data-oid="q60i8_l">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="7fq7qzp"
                                            >
                                                Delivery Notes:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-blue-50 p-2 rounded"
                                                data-oid="nysjfa_"
                                            >
                                                {order.deliveryAddress.notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card data-oid="azblx1r">
                                <CardHeader data-oid="6867-z4">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="ykun7mw"
                                    >
                                        <Truck className="w-5 h-5" data-oid="ba8.2o:" />

                                        <span data-oid="9m5wppk">Delivery Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="54dy886">
                                    <div className="grid grid-cols-2 gap-4" data-oid="zw60w-i">
                                        <div data-oid="68vzltp">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="gqr31_1"
                                            >
                                                Estimated Time:
                                            </span>
                                            <p className="font-medium" data-oid="rztk8ko">
                                                {order.estimatedDeliveryTime}
                                            </p>
                                        </div>
                                        {order.actualDeliveryTime && (
                                            <div data-oid="c.lmf5m">
                                                <span
                                                    className="text-sm text-gray-600"
                                                    data-oid="82r075l"
                                                >
                                                    Actual Time:
                                                </span>
                                                <p className="font-medium" data-oid="i5_lgky">
                                                    {order.actualDeliveryTime}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4" data-oid="9rcsdi.">
                                        <div data-oid="gmi___t">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="qx2indu"
                                            >
                                                Delivery Fee:
                                            </span>
                                            <p className="font-medium" data-oid="umikd:s">
                                                {formatCurrency(order.deliveryFee)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
