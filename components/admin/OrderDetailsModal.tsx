'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/lib/services/orderMonitoringService';
import { PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import { PrescriptionViewModal } from './PrescriptionViewModal';
import { PrescriptionImageViewer } from './PrescriptionImageViewer';
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

interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'items' | 'timeline' | 'delivery'>(
        'details',
    );
    const [prescription, setPrescription] = useState<PrescriptionWorkflow | null>(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showPrescriptionImageViewer, setShowPrescriptionImageViewer] = useState(false);
    const [loadingPrescription, setLoadingPrescription] = useState(false);

    useEffect(() => {
        if (order?.prescriptionId && isOpen) {
            console.log(
                'Loading prescription for order:',
                order.orderNumber,
                'prescriptionId:',
                order.prescriptionId,
            );
            loadPrescription();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.prescriptionId, isOpen]);

    const loadPrescription = async () => {
        if (!order?.prescriptionId) return;
        console.log('Attempting to load prescription:', order.prescriptionId);
        setLoadingPrescription(true);
        try {
            const prescriptionData = await PrescriptionWorkflowService.getPrescriptionById(
                order.prescriptionId,
            );
            console.log('Prescription data loaded:', prescriptionData);
            setPrescription(prescriptionData);
        } catch (error) {
            console.error('Error loading prescription:', error);
        } finally {
            setLoadingPrescription(false);
        }
    };

    const handleViewPrescription = () => {
        if (prescription) {
            setShowPrescriptionModal(true);
        }
    };

    const handleViewPrescriptionImage = () => {
        if (prescription) {
            setShowPrescriptionImageViewer(true);
        }
    };

    // Mock prescription image URL for preview
    const getPrescriptionPreviewUrl = () => {
        return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop';
    };

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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'normal':
                return 'bg-blue-100 text-blue-800';
            case 'low':
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
    console.log(order)
    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="_z5x4_c">
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-oid="z1du:b6">
                <DialogHeader data-oid="qy-21j2">
                    <DialogTitle className="flex items-center justify-between" data-oid="vm3uvv2">
                        <div className="flex items-center space-x-3" data-oid="h1ahik:">
                            <div
                                className="w-10 h-10 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center"
                                data-oid="6nwwwy0"
                            >
                                <Package className="w-5 h-5" data-oid="tlp__7v" />
                            </div>
                            <div data-oid="rgbt__-">
                                <h2 className="text-xl font-bold" data-oid="crwbpd6">
                                    {order.orderNumber}
                                </h2>
                                <p className="text-sm text-gray-600" data-oid="-kc0-ha">
                                    Order placed on {formatDateTime(order.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="f63l_k9">
                            <Badge className={getStatusColor(order.status)} data-oid="-azsqv9">
                                {order.status.toUpperCase()}
                            </Badge>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200" data-oid="nqf-t5i">
                    <nav className="flex space-x-8" data-oid="ewjk_qz">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    activeTab === tab.id
                                        ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="mhudba."
                            >
                                <tab.icon className="w-4 h-4" data-oid="27t-4iq" />
                                <span data-oid="9ey-pxb">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6" data-oid="txtq4yt">
                    {activeTab === 'details' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="l-2x5z4">
                            {/* Customer Information */}
                            <Card data-oid=".k0:7fp">
                                <CardHeader data-oid="qlqstl2">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid=":l5f7-f"
                                    >
                                        <User className="w-5 h-5" data-oid="dkdfqkg" />
                                        <span data-oid="m3:5irf">Customer Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="r4j4w62">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="9pf76:1"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="styl0a3">
                                            Name:
                                        </span>
                                        <span className="font-medium" data-oid="fzawclh">
                                            {order.customerName}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="r3k-qif"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="c2xvwjf">
                                            Phone:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="8e3z0s5"
                                        >
                                            <span className="font-medium" data-oid="z-f7yyy">
                                                {order.customerPhone}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(order.customerPhone)}
                                                data-oid=".92oj4f"
                                            >
                                                <Copy className="w-3 h-3" data-oid="umv6gx-" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="la-vxvw"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="rn3dv53">
                                            Email:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="nam9f2r"
                                        >
                                            <span className="font-medium" data-oid="xmeh0.:">
                                                {order.customerEmail}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(order.customerEmail)}
                                                data-oid="b15wf2n"
                                            >
                                                <Copy className="w-3 h-3" data-oid="du1pymr" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="xscbyo7"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="jymwaoq">
                                            Customer ID:
                                        </span>
                                        <span
                                            className="font-medium text-xs bg-gray-100 px-2 py-1 rounded"
                                            data-oid="qv4z_eb"
                                        >
                                            {order.customerId._id}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pharmacy Information */}
                            <Card data-oid="vxqpd8-">
                                <CardHeader data-oid="npqqqfo">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="rsfn8y_"
                                    >
                                        <Building2 className="w-5 h-5" data-oid="36:ditm" />
                                        <span data-oid="pgdw54j">Pharmacy Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="qdrcw4n">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="q9h2c7m"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="kbt2.cx">
                                            Name:
                                        </span>
                                        <span className="font-medium" data-oid="hj9yhpz">
                                            {order.pharmacyName}
                                        </span>
                                    </div>
                                    {/* <div
                                        className="flex items-center justify-between"
                                        data-oid="o2r4u7r"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="2rjc.9f">
                                            Phone:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="j4r31mt"
                                        >
                                            <span className="font-medium" data-oid="f9q9sh9">
                                                {order.pharmacy.phone}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(order.pharmacy.phone)
                                                }
                                                data-oid="ntmlt7g"
                                            >
                                                <Copy className="w-3 h-3" data-oid=".s7b906" />
                                            </Button>
                                        </div>
                                    </div> */}
                                    {/* <div
                                        className="flex items-center justify-between"
                                        data-oid=":rbb74_"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="byid8p1">
                                            City:
                                        </span>
                                        <span className="font-medium" data-oid="h3ang5c">
                                            {order.pharmacy.city}
                                        </span>
                                    </div> */}
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid=":h-mu2l"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="36gltnk">
                                            Pharmacy ID:
                                        </span>
                                        <span
                                            className="font-medium text-xs bg-gray-100 px-2 py-1 rounded"
                                            data-oid="ytyxi5:"
                                        >
                                            {order.pharmacyId}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card data-oid="ay6fk4h">
                                <CardHeader data-oid="2cum0o4">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="elw7b7q"
                                    >
                                        <CreditCard className="w-5 h-5" data-oid="bq0_9cz" />
                                        <span data-oid="g3ivqzv">Payment Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="pob:i06">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="._0j:v6"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="raf72nn">
                                            Method:
                                        </span>
                                        <span className="font-medium capitalize" data-oid="oxdpacn">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="f1c_6m-"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="wbzuo81">
                                            Status:
                                        </span>
                                        <Badge
                                            className={getPaymentStatusColor(order.paymentStatus)}
                                            data-oid="js7nj1a"
                                        >
                                            {order.paymentStatus.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <Separator data-oid="zccxj:w" />
                                    <div className="space-y-2" data-oid="psqsdpw">
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="6sj_bf7"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="mgtecq1"
                                            >
                                                Subtotal:
                                            </span>
                                            <span className="font-medium" data-oid="0y6dqub">
                                                {formatCurrency(order.subtotal)}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="ow30-s2"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="h93.5hp"
                                            >
                                                Delivery Fee:
                                            </span>
                                            <span className="font-medium" data-oid="j0zal1:">
                                                {formatCurrency(order.deliveryFee)}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="7eh:tqt"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="a9l1uth"
                                            >
                                                Discount:
                                            </span>
                                            <span
                                                className="font-medium text-green-600"
                                                data-oid="mxfwe8n"
                                            >
                                                -{formatCurrency(order.discount)}
                                            </span>
                                        </div>
                                        <Separator data-oid="uumg_u:" />
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="j3nd94v"
                                        >
                                            <span className="font-semibold" data-oid="a39gzem">
                                                Total Amount:
                                            </span>
                                            <span className="font-bold text-lg" data-oid="ljr4q_i">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Information */}
                            <Card data-oid="a0ink7t">
                                <CardHeader data-oid="qaalhnc">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="p0.g8yp"
                                    >
                                        <AlertCircle className="w-5 h-5" data-oid="7-hmzi6" />
                                        <span data-oid="oj5nolv">Additional Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="w57:t-u">
                                    {order.prescriptionId && (
                                        <div data-oid="zojr1.1">
                                            <div
                                                className="flex items-center justify-between mb-3"
                                                data-oid="pw978.h"
                                            >
                                                <span
                                                    className="text-sm text-gray-600"
                                                    data-oid="1o67b15"
                                                >
                                                    Prescription ID:
                                                </span>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="35a2_jk"
                                                >
                                                    <span
                                                        className="font-medium text-xs bg-blue-100 px-2 py-1 rounded"
                                                        data-oid=".i.uwcd"
                                                    >
                                                        {order.prescriptionId}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={handleViewPrescription}
                                                        disabled={
                                                            loadingPrescription || !prescription
                                                        }
                                                        data-oid="jclyteo"
                                                    >
                                                        <Eye
                                                            className="w-3 h-3"
                                                            data-oid="zx69h8:"
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div
                                                className="bg-blue-50 p-3 rounded-lg"
                                                data-oid="q2rt0ii"
                                            >
                                                <div
                                                    className="flex items-center space-x-2 mb-2"
                                                    data-oid="y4kum8:"
                                                >
                                                    <FileText
                                                        className="w-4 h-4 text-blue-600"
                                                        data-oid="zh_e1f:"
                                                    />

                                                    <span
                                                        className="text-sm font-medium text-blue-800"
                                                        data-oid="yafyz0e"
                                                    >
                                                        Order with Prescription
                                                    </span>
                                                </div>

                                                {prescription && (
                                                    <div className="space-y-3" data-oid="owwpen6">
                                                        {/* Prescription Preview */}
                                                        <div
                                                            className="flex space-x-3"
                                                            data-oid="t:ddkuh"
                                                        >
                                                            <div
                                                                className="relative w-20 h-16 bg-white rounded-lg border-2 border-blue-200 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors group"
                                                                onClick={
                                                                    handleViewPrescriptionImage
                                                                }
                                                                data-oid="p6.7ftj"
                                                            >
                                                                <img
                                                                    src={getPrescriptionPreviewUrl()}
                                                                    alt="Prescription preview"
                                                                    className="w-full h-full object-cover"
                                                                    data-oid=".zrrucx"
                                                                />

                                                                <div
                                                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center"
                                                                    data-oid="e:6sg8e"
                                                                >
                                                                    <Eye
                                                                        className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        data-oid="1-ibl79"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex-1 space-y-1 text-xs text-blue-700"
                                                                data-oid="p3tuie-"
                                                            >
                                                                <p data-oid="zjjg804">
                                                                    Patient:{' '}
                                                                    {prescription.patientName}
                                                                </p>
                                                                <p data-oid="tn_tyv3">
                                                                    Status:{' '}
                                                                    <Badge
                                                                        className="text-xs bg-blue-100 text-blue-800"
                                                                        data-oid="87oddm2"
                                                                    >
                                                                        {prescription.currentStatus.toUpperCase()}
                                                                    </Badge>
                                                                </p>
                                                                <p
                                                                    className="text-gray-600"
                                                                    data-oid=":wyqdo6"
                                                                >
                                                                    {prescription.files?.length ||
                                                                        0}{' '}
                                                                    file(s) attached
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* Action Buttons */}
                                                        <div
                                                            className="flex space-x-2"
                                                            data-oid="9yi_539"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                onClick={
                                                                    handleViewPrescriptionImage
                                                                }
                                                                data-oid="00oo14u"
                                                            >
                                                                <Eye
                                                                    className="w-3 h-3 mr-1"
                                                                    data-oid="g6goro."
                                                                />
                                                                View Prescription
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                onClick={handleViewPrescription}
                                                                data-oid="q2bhf1m"
                                                            >
                                                                <FileText
                                                                    className="w-3 h-3 mr-1"
                                                                    data-oid="mhsecu_"
                                                                />
                                                                Full Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                                {loadingPrescription && (
                                                    <p
                                                        className="text-xs text-blue-600"
                                                        data-oid="z4l0vjq"
                                                    >
                                                        Loading prescription details...
                                                    </p>
                                                )}
                                                {!loadingPrescription && !prescription && (
                                                    <p
                                                        className="text-xs text-red-600"
                                                        data-oid="on:o1kr"
                                                    >
                                                        Prescription data not found for ID:{' '}
                                                        {order.prescriptionId}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="8-lt3_i"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="u1p1.x1">
                                            Estimated Delivery:
                                        </span>
                                        <span className="font-medium" data-oid="bkv-mu5">
                                            {order.estimatedDeliveryTime}
                                        </span>
                                    </div>
                                    {order.actualDeliveryTime && (
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="umjabyg"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="auv9wce"
                                            >
                                                Actual Delivery:
                                            </span>
                                            <span className="font-medium" data-oid="8jw5t74">
                                                {order.actualDeliveryTime}
                                            </span>
                                        </div>
                                    )}
                                    {order.notes && (
                                        <div data-oid="amk-gpy">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="v0s9x_v"
                                            >
                                                Notes:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-gray-50 p-2 rounded"
                                                data-oid="x3566t8"
                                            >
                                                {order.notes}
                                            </p>
                                        </div>
                                    )}
                                    {order.cancelReason && (
                                        <div data-oid="q_fmf5x">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="7xb7zk6"
                                            >
                                                Cancel Reason:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-red-50 p-2 rounded text-red-800"
                                                data-oid="9:wtsct"
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
                        <div className="space-y-4" data-oid="_-bl4l4">
                            <div className="flex items-center justify-between" data-oid="k5g60lr">
                                <h3 className="text-lg font-semibold" data-oid="dtp0_b7">
                                    Order Items ({order.items.length})
                                </h3>
                                <div className="text-sm text-gray-600" data-oid="c3-m:w.">
                                    Total: {formatCurrency(order.subtotal)}
                                </div>
                            </div>
                            {order.items.map((item, index) => (
                                <Card key={item.id} data-oid="go6.lnx">
                                    <CardContent className="p-4" data-oid="vhe-d5f">
                                        <div
                                            className="flex items-start space-x-4"
                                            data-oid="btika3_"
                                        >
                                            <div
                                                className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                                                data-oid="9yq-4.q"
                                            >
                                                <Pill
                                                    className="w-8 h-8 text-gray-400"
                                                    data-oid="5l2yg8t"
                                                />
                                            </div>
                                            <div className="flex-1" data-oid="omhxuk9">
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid="uj168ix"
                                                >
                                                    <div data-oid="lytt4lw">
                                                        <h4
                                                            className="font-semibold"
                                                            data-oid="iqbgfe0"
                                                        >
                                                            {item.productName}
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="ah5qwym"
                                                        >
                                                            {item.productNameAr}
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-4 mt-2"
                                                            data-oid="0ep:0wr"
                                                        >
                                                            <span
                                                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                                                                data-oid="nnx11z5"
                                                            >
                                                                {item.category}
                                                            </span>
                                                            <span
                                                                className="text-xs text-gray-500"
                                                                data-oid="6sinydt"
                                                            >
                                                                {item.manufacturer}
                                                            </span>
                                                            {item.prescription && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                                    data-oid="rcx2cs0"
                                                                >
                                                                    <FileText
                                                                        className="w-3 h-3 mr-1"
                                                                        data-oid="gh6.h:i"
                                                                    />
                                                                    Prescription Item
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right" data-oid="4rf0mni">
                                                        <div
                                                            className="font-semibold"
                                                            data-oid="cvv_oxb"
                                                        >
                                                            {formatCurrency(item.totalPrice)}
                                                        </div>
                                                        <div
                                                            className="text-sm text-gray-600"
                                                            data-oid="a0mp87g"
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
                        <div className="space-y-4" data-oid="y2s_45h">
                            <h3 className="text-lg font-semibold" data-oid=".fn7bgq">
                                Order Timeline
                            </h3>
                            <div className="space-y-4" data-oid="gsy2lr5">
                                {order.statusHistory.map((history, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4"
                                        data-oid=".eeblh6"
                                    >
                                        <div className="flex-shrink-0" data-oid="khxiq01">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    history.status === 'delivered'
                                                        ? 'bg-green-100'
                                                        : history.status === 'cancelled'
                                                          ? 'bg-red-100'
                                                          : 'bg-blue-100'
                                                }`}
                                                data-oid="1oy47k2"
                                            >
                                                {history.status === 'delivered' ? (
                                                    <CheckCircle
                                                        className="w-4 h-4 text-green-600"
                                                        data-oid="dnhkqxh"
                                                    />
                                                ) : history.status === 'cancelled' ? (
                                                    <XCircle
                                                        className="w-4 h-4 text-red-600"
                                                        data-oid="-5opnzr"
                                                    />
                                                ) : (
                                                    <Clock
                                                        className="w-4 h-4 text-blue-600"
                                                        data-oid="stbfq6y"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1" data-oid="hb9ngco">
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="yexujt7"
                                            >
                                                <h4
                                                    className="font-medium capitalize"
                                                    data-oid="19kl-mw"
                                                >
                                                    {history.status.replace('-', ' ')}
                                                </h4>
                                                <span
                                                    className="text-sm text-gray-500"
                                                    data-oid="km03v9c"
                                                >
                                                    {formatDateTime(history.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600" data-oid="fkc0q68">
                                                Updated by: {history.updatedBy}
                                            </p>
                                            {history.notes && (
                                                <p
                                                    className="text-sm text-gray-500 mt-1"
                                                    data-oid="gac3-a0"
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
                        <div className="space-y-6" data-oid="j9vkbie">
                            <Card data-oid="f1xvu04">
                                <CardHeader data-oid="t0_vxly">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="vthhmu."
                                    >
                                        <MapPin className="w-5 h-5" data-oid="iv2jcbz" />
                                        <span data-oid="y6yltnx">Delivery Address</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="5z0-2x4">
                                    <div data-oid="jd2spol">
                                        <span className="text-sm text-gray-600" data-oid="nklsno3">
                                            Street Address:
                                        </span>
                                        <p className="font-medium" data-oid="dwa11uu">
                                            {order.deliveryAddress.street}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4" data-oid=".pnn0-0">
                                        <div data-oid="h7oec:2">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="2os3:.x"
                                            >
                                                City:
                                            </span>
                                            <p className="font-medium" data-oid="s4z-d5m">
                                                {order.deliveryAddress.city}
                                            </p>
                                        </div>
                                        <div data-oid="bfygkcf">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="xwebu25"
                                            >
                                                Governorate:
                                            </span>
                                            <p className="font-medium" data-oid="gywdrj.">
                                                {order.deliveryAddress.governorate}
                                            </p>
                                        </div>
                                    </div>
                                    <div data-oid="y:ysk5h">
                                        <span className="text-sm text-gray-600" data-oid="_.dedza">
                                            Contact Phone:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="si1oo30"
                                        >
                                            <p className="font-medium" data-oid="i_nhc._">
                                                {order.deliveryAddress.phone}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(order.deliveryAddress.phone)
                                                }
                                                data-oid=":-2kir:"
                                            >
                                                <Copy className="w-3 h-3" data-oid="777k5an" />
                                            </Button>
                                        </div>
                                    </div>
                                    {order.deliveryAddress.notes && (
                                        <div data-oid="pkk7.g8">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="0b82r0e"
                                            >
                                                Delivery Notes:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-blue-50 p-2 rounded"
                                                data-oid="q2q-mcq"
                                            >
                                                {order.deliveryAddress.notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card data-oid="4yua7ve">
                                <CardHeader data-oid="dxdk.xa">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="256qfwf"
                                    >
                                        <Truck className="w-5 h-5" data-oid="ox0eyoc" />
                                        <span data-oid="8_-ge32">Delivery Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="wv2ly3n">
                                    <div className="grid grid-cols-2 gap-4" data-oid="tlo2bu:">
                                        <div data-oid="gmeqa:p">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid=":.detub"
                                            >
                                                Estimated Time:
                                            </span>
                                            <p className="font-medium" data-oid="wh9kx77">
                                                {order.estimatedDeliveryTime}
                                            </p>
                                        </div>
                                        {order.actualDeliveryTime && (
                                            <div data-oid="u1r2cyg">
                                                <span
                                                    className="text-sm text-gray-600"
                                                    data-oid="1hr48:t"
                                                >
                                                    Actual Time:
                                                </span>
                                                <p className="font-medium" data-oid="qki9zfb">
                                                    {order.actualDeliveryTime}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4" data-oid="::8kgkq">
                                        <div data-oid="epy_o-p">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="e4vqy6f"
                                            >
                                                Delivery Fee:
                                            </span>
                                            <p className="font-medium" data-oid="upe7on2">
                                                {formatCurrency(order.deliveryFee)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Prescription View Modal */}
                <PrescriptionViewModal
                    prescription={prescription}
                    isOpen={showPrescriptionModal}
                    onClose={() => setShowPrescriptionModal(false)}
                    data-oid="i5y156a"
                />

                {/* Prescription Image Viewer */}
                <PrescriptionImageViewer
                    prescription={prescription}
                    isOpen={showPrescriptionImageViewer}
                    onClose={() => setShowPrescriptionImageViewer(false)}
                    data-oid="oznuufz"
                />
            </DialogContent>
        </Dialog>
    );
}
