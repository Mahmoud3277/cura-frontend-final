'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';
import {
    FileText,
    User,
    Calendar,
    Clock,
    AlertCircle,
    Download,
    Eye,
    Pill,
    Building2,
    Phone,
    MapPin,
    DollarSign,
    CheckCircle,
    XCircle,
    Copy,
} from 'lucide-react';

interface PrescriptionViewModalProps {
    prescription: PrescriptionWorkflow | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PrescriptionViewModal({
    prescription,
    isOpen,
    onClose,
}: PrescriptionViewModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'files' | 'medicines' | 'timeline'>(
        'details',
    );

    if (!prescription) return null;

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatDate = (date: Date) => date.toLocaleDateString();
    const formatDateTime = (date: Date) => {
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'reviewing':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            case 'suspended':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'normal':
                return 'bg-blue-100 text-blue-800';
            case 'routine':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const tabs = [
        { id: 'details', label: 'Prescription Details', icon: FileText },
        { id: 'files', label: 'Files', icon: Eye },
        { id: 'medicines', label: 'Medicines', icon: Pill },
        { id: 'timeline', label: 'Timeline', icon: Clock },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="vgkvrgw">
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-oid="wt2._.r">
                <DialogHeader data-oid="6re48z2">
                    <DialogTitle className="flex items-center justify-between" data-oid="3mdzorx">
                        <div className="flex items-center space-x-3" data-oid="uahwon8">
                            <div
                                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center"
                                data-oid="vr78rch"
                            >
                                <FileText className="w-5 h-5" data-oid="u95t.ny" />
                            </div>
                            <div data-oid="8ohgjaw">
                                <h2 className="text-xl font-bold" data-oid="2h2rxvf">
                                    Prescription {prescription.id}
                                </h2>
                                <p className="text-sm text-gray-600" data-oid="qeat.10">
                                    Created on {formatDateTime(prescription.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="oa65z09">
                            <Badge
                                className={getStatusColor(prescription.currentStatus)}
                                data-oid="isiz60v"
                            >
                                {prescription.currentStatus.toUpperCase()}
                            </Badge>
                            <Badge
                                className={getUrgencyColor(prescription.urgency)}
                                data-oid="nzb0ul7"
                            >
                                {prescription.urgency.toUpperCase()}
                            </Badge>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200" data-oid="90xvh77">
                    <nav className="flex space-x-8" data-oid="7hkleof">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="wqw48uc"
                            >
                                <tab.icon className="w-4 h-4" data-oid="k4fvacv" />
                                <span data-oid="3nfnwmw">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6" data-oid="ey0vku:">
                    {activeTab === 'details' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="henq16k">
                            {/* Patient Information */}
                            <Card data-oid="o-1zx0z">
                                <CardHeader data-oid="c8enqo6">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="6nekm0x"
                                    >
                                        <User className="w-5 h-5" data-oid="_l-.ftv" />
                                        <span data-oid="79py3i4">Patient Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="zk2.xoo">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="g6jyudr"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="xwlbe3k">
                                            Patient Name:
                                        </span>
                                        <span className="font-medium" data-oid=":witu.w">
                                            {prescription.patientName}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="yftx39k"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="7.-ovwr">
                                            Customer Name:
                                        </span>
                                        <span className="font-medium" data-oid="jov4wu_">
                                            {prescription.customerName}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="l3v_r-e"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="3sa2d3x">
                                            Phone:
                                        </span>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="uy.dl8n"
                                        >
                                            <span className="font-medium" data-oid="o:3ko3m">
                                                {prescription.customerPhone}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(prescription.customerPhone)
                                                }
                                                data-oid="3m0o_ut"
                                            >
                                                <Copy className="w-3 h-3" data-oid="m87oc07" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="y0j4pu9"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="3ec595p">
                                            Customer ID:
                                        </span>
                                        <span
                                            className="font-medium text-xs bg-gray-100 px-2 py-1 rounded"
                                            data-oid="a:15sem"
                                        >
                                            {prescription.customerId}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Doctor Information */}
                            <Card data-oid="vj9fioq">
                                <CardHeader data-oid="_p96mx:">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="bunhhb_"
                                    >
                                        <Building2 className="w-5 h-5" data-oid="kqk7a6z" />
                                        <span data-oid="qljn4ph">Doctor Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="6:j0ml0">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="9hay5v8"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="wh8_a3f">
                                            Doctor Name:
                                        </span>
                                        <span className="font-medium" data-oid="n0mijys">
                                            {prescription.doctorName || 'Not specified'}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="oa169wz"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="apih6a1">
                                            Hospital/Clinic:
                                        </span>
                                        <span className="font-medium" data-oid="e9u:c5:">
                                            {prescription.hospitalClinic || 'Not specified'}
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="ex8iqha"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="7ylp3_s">
                                            Prescription Date:
                                        </span>
                                        <span className="font-medium" data-oid="0cggm6e">
                                            {prescription.prescriptionDate || 'Not specified'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prescription Status */}
                            <Card data-oid="sj5c..q">
                                <CardHeader data-oid="p6k81ny">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="7js.bbl"
                                    >
                                        <AlertCircle className="w-5 h-5" data-oid="1:b23n1" />
                                        <span data-oid="-wygb4e">Status Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="r089coy">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="x-tkrnw"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="qkm1tn:">
                                            Current Status:
                                        </span>
                                        <Badge
                                            className={getStatusColor(prescription.currentStatus)}
                                            data-oid="7f82f-x"
                                        >
                                            {prescription.currentStatus.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="rg3tdjd"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="9a2.oq-">
                                            Urgency:
                                        </span>
                                        <Badge
                                            className={getUrgencyColor(prescription.urgency)}
                                            data-oid="mp712lb"
                                        >
                                            {prescription.urgency.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="sx-:q:_"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="nj.wju0">
                                            Estimated Completion:
                                        </span>
                                        <span className="font-medium" data-oid="n-qcnvz">
                                            {formatDateTime(prescription.estimatedCompletion)}
                                        </span>
                                    </div>
                                    {prescription.actualCompletion && (
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="d_vp93u"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="nnlgo6n"
                                            >
                                                Actual Completion:
                                            </span>
                                            <span className="font-medium" data-oid="a741.5n">
                                                {formatDateTime(prescription.actualCompletion)}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Additional Information */}
                            <Card data-oid="7txx2jn">
                                <CardHeader data-oid="13tzhen">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="2ki9q0r"
                                    >
                                        <FileText className="w-5 h-5" data-oid="kqxtuad" />
                                        <span data-oid="x:yn6u.">Additional Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3" data-oid="65yjt9r">
                                    {prescription.notes && (
                                        <div data-oid=".zueq3e">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="787d_3q"
                                            >
                                                Notes:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-gray-50 p-2 rounded"
                                                data-oid="j-cxo14"
                                            >
                                                {prescription.notes}
                                            </p>
                                        </div>
                                    )}
                                    {prescription.rejectionReason && (
                                        <div data-oid="rmfyihf">
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="v8kj1l1"
                                            >
                                                Rejection Reason:
                                            </span>
                                            <p
                                                className="mt-1 text-sm bg-red-50 p-2 rounded text-red-800"
                                                data-oid="vd49mix"
                                            >
                                                {prescription.rejectionReason}
                                            </p>
                                        </div>
                                    )}
                                    {prescription.deliveryAddress && (
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="kj26dxz"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="njxzsck"
                                            >
                                                Delivery Address:
                                            </span>
                                            <span className="font-medium" data-oid="cfd3f78">
                                                {prescription.deliveryAddress}
                                            </span>
                                        </div>
                                    )}
                                    {prescription.totalAmount && (
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="2fhxmtv"
                                        >
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="8j:yl_2"
                                            >
                                                Total Amount:
                                            </span>
                                            <span className="font-bold text-lg" data-oid="zx7aaux">
                                                {formatCurrency(prescription.totalAmount)}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div className="space-y-4" data-oid="pcx:xv-">
                            <h3 className="text-lg font-semibold" data-oid="95-uqg7">
                                Prescription Files ({prescription.files.length})
                            </h3>
                            {prescription.files.length === 0 ? (
                                <div className="text-center py-8" data-oid="tg934a4">
                                    <FileText
                                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                                        data-oid="6742l-f"
                                    />

                                    <p className="text-gray-500" data-oid="q6sq5ag">
                                        No files uploaded
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                    data-oid="3au0dx9"
                                >
                                    {prescription.files.map((file) => (
                                        <Card
                                            key={file.id}
                                            className="hover:shadow-md transition-shadow"
                                            data-oid="8qm.833"
                                        >
                                            <CardContent className="p-4" data-oid="iq7r4_f">
                                                <div
                                                    className="flex items-center space-x-3"
                                                    data-oid="p:on22v"
                                                >
                                                    <div
                                                        className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                                                        data-oid="ows5_d."
                                                    >
                                                        <FileText
                                                            className="w-6 h-6 text-blue-600"
                                                            data-oid="1wk41ur"
                                                        />
                                                    </div>
                                                    <div className="flex-1" data-oid="_-ct9fx">
                                                        <h4
                                                            className="font-medium"
                                                            data-oid="5w.nvya"
                                                        >
                                                            {file.name}
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600 capitalize"
                                                            data-oid="mz2cgr8"
                                                        >
                                                            {file.type} file
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex items-center space-x-2 mt-3"
                                                    data-oid="d729v2c"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        data-oid="drj5d1z"
                                                    >
                                                        <Eye
                                                            className="w-4 h-4 mr-2"
                                                            data-oid="pz:s2.s"
                                                        />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        data-oid="uzr4_id"
                                                    >
                                                        <Download
                                                            className="w-4 h-4 mr-2"
                                                            data-oid="efgr9-a"
                                                        />
                                                        Download
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'medicines' && (
                        <div className="space-y-4" data-oid="rsm4iaf">
                            <div className="flex items-center justify-between" data-oid="5tt6x8v">
                                <h3 className="text-lg font-semibold" data-oid="3-x122s">
                                    Processed Medicines (
                                    {prescription.processedMedicines?.length || 0})
                                </h3>
                                {prescription.totalAmount && (
                                    <div className="text-sm text-gray-600" data-oid=".sks3ch">
                                        Total: {formatCurrency(prescription.totalAmount)}
                                    </div>
                                )}
                            </div>
                            {!prescription.processedMedicines ||
                            prescription.processedMedicines.length === 0 ? (
                                <div className="text-center py-8" data-oid="030p788">
                                    <Pill
                                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                                        data-oid="43ys_p_"
                                    />

                                    <p className="text-gray-500" data-oid="bk2x32h">
                                        No medicines processed yet
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2" data-oid="qxsnmvt">
                                        Medicines will appear here after prescription approval
                                    </p>
                                </div>
                            ) : (
                                prescription.processedMedicines.map((medicine, index) => (
                                    <Card key={medicine.id} data-oid="8.b7l8i">
                                        <CardContent className="p-4" data-oid="qmt9h0s">
                                            <div
                                                className="flex items-start space-x-4"
                                                data-oid="b9rgs-2"
                                            >
                                                <div
                                                    className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                                                    data-oid="7wmavoe"
                                                >
                                                    <Pill
                                                        className="w-8 h-8 text-gray-400"
                                                        data-oid="tnwury4"
                                                    />
                                                </div>
                                                <div className="flex-1" data-oid="gj2-we3">
                                                    <div
                                                        className="flex items-start justify-between"
                                                        data-oid="1it4wj7"
                                                    >
                                                        <div data-oid="ba.7ccb">
                                                            <h4
                                                                className="font-semibold"
                                                                data-oid="eao7mov"
                                                            >
                                                                {medicine.productName}
                                                            </h4>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="fpdu7ha"
                                                            >
                                                                Dosage: {medicine.dosage} •
                                                                Quantity: {medicine.quantity}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-600 mt-1"
                                                                data-oid=".8lajz7"
                                                            >
                                                                {medicine.instructions}
                                                            </p>
                                                            <div
                                                                className="flex items-center space-x-2 mt-2"
                                                                data-oid="ul1479k"
                                                            >
                                                                <Badge
                                                                    variant={
                                                                        medicine.isAvailable
                                                                            ? 'default'
                                                                            : 'destructive'
                                                                    }
                                                                    data-oid="p:tv59q"
                                                                >
                                                                    {medicine.isAvailable
                                                                        ? 'Available'
                                                                        : 'Out of Stock'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="text-right"
                                                            data-oid="uzq2:24"
                                                        >
                                                            <div
                                                                className="font-semibold"
                                                                data-oid="8wgmy6m"
                                                            >
                                                                {formatCurrency(medicine.price)}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-600"
                                                                data-oid="v96iylu"
                                                            >
                                                                {formatCurrency(
                                                                    medicine.price /
                                                                        medicine.quantity,
                                                                )}{' '}
                                                                per unit
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="space-y-4" data-oid="lox5diq">
                            <h3 className="text-lg font-semibold" data-oid="c3c_zi_">
                                Prescription Timeline
                            </h3>
                            <div className="space-y-4" data-oid="m0b7wk4">
                                {prescription.statusHistory.map((history, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4"
                                        data-oid="k92evm3"
                                    >
                                        <div className="flex-shrink-0" data-oid="ti:m08o">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    history.status === 'approved'
                                                        ? 'bg-green-100'
                                                        : history.status === 'rejected'
                                                          ? 'bg-red-100'
                                                          : 'bg-blue-100'
                                                }`}
                                                data-oid="7e:4h_b"
                                            >
                                                {history.status === 'approved' ? (
                                                    <CheckCircle
                                                        className="w-4 h-4 text-green-600"
                                                        data-oid="99eso.z"
                                                    />
                                                ) : history.status === 'rejected' ? (
                                                    <XCircle
                                                        className="w-4 h-4 text-red-600"
                                                        data-oid=":_o3.io"
                                                    />
                                                ) : (
                                                    <Clock
                                                        className="w-4 h-4 text-blue-600"
                                                        data-oid="kc_.qxn"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1" data-oid="5fwtn0:">
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="a0tjynb"
                                            >
                                                <h4
                                                    className="font-medium capitalize"
                                                    data-oid="ebg2x5n"
                                                >
                                                    {history.status.replace('-', ' ')}
                                                </h4>
                                                <span
                                                    className="text-sm text-gray-500"
                                                    data-oid="r5cd8vn"
                                                >
                                                    {formatDateTime(history.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600" data-oid="d:zv4fc">
                                                Updated by: {history.userName} ({history.userRole})
                                            </p>
                                            {history.notes && (
                                                <p
                                                    className="text-sm text-gray-500 mt-1"
                                                    data-oid="_qdhr2m"
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
