'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    RotateCcw,
    User,
    Package,
    DollarSign,
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    Truck,
    CreditCard,
} from 'lucide-react';
import { OrderReturn } from '@/lib/types';

interface ReturnDetailsModalProps {
    returnOrder: OrderReturn | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ReturnDetailsModal({ returnOrder, isOpen, onClose }: ReturnDetailsModalProps) {
    const [workflowStep, setWorkflowStep] = useState(0);

    useEffect(() => {
        if (returnOrder) {
            // Determine workflow step based on status
            switch (returnOrder.status) {
                case 'requested':
                    setWorkflowStep(0);
                    break;
                case 'approved':
                case 'processing':
                    setWorkflowStep(1);
                    break;
                case 'completed':
                    setWorkflowStep(2);
                    break;
                case 'rejected':
                    setWorkflowStep(-1);
                    break;
                default:
                    setWorkflowStep(0);
            }
        }
    }, [returnOrder]);

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatDate = (date: Date) => new Date(date).toLocaleDateString();
    const formatTime = (date: Date) => new Date(date).toLocaleTimeString();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'unopened':
                return 'bg-green-100 text-green-800';
            case 'opened':
                return 'bg-yellow-100 text-yellow-800';
            case 'damaged':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const workflowSteps = [
        {
            title: 'Return Requested',
            description: 'Customer submitted return request',
            icon: FileText,
            status: 'completed',
        },
        {
            title: 'Processing Return',
            description: 'Return approved and being processed',
            icon: Truck,
            status: workflowStep >= 1 ? 'completed' : workflowStep === -1 ? 'skipped' : 'pending',
        },
        {
            title: 'Refund Completed',
            description: 'Refund processed to customer wallet',
            icon: CreditCard,
            status: workflowStep >= 2 ? 'completed' : workflowStep === -1 ? 'skipped' : 'pending',
        },
    ];

    if (!returnOrder) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="hao5x1e">
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-oid="0qza:v9">
                <DialogHeader data-oid="dc:rqk_">
                    <DialogTitle className="flex items-center space-x-3" data-oid="gldldag">
                        <div
                            className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"
                            data-oid="rljgpu."
                        >
                            <RotateCcw className="w-5 h-5" data-oid="5pfs-q4" />
                        </div>
                        <div data-oid="-3oe04d">
                            <h2 className="text-xl font-bold" data-oid="4h3j5xc">
                                Return Request Details
                            </h2>
                            <p className="text-sm text-gray-600" data-oid="wdh-ibw">
                                Return ID: {returnOrder.id}
                            </p>
                        </div>
                        <Badge className={getStatusColor(returnOrder.status)} data-oid="xn_bl:b">
                            {returnOrder.status.toUpperCase()}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6" data-oid="xln4ud0">
                    {/* Return Workflow */}
                    <Card data-oid="49htdoy">
                        <CardHeader data-oid="-rz4ibk">
                            <CardTitle className="flex items-center space-x-2" data-oid="kl:v561">
                                <Clock className="w-5 h-5" data-oid="n7ys-43" />
                                <span data-oid="e8a79f-">Return Workflow</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="ttp2ipz">
                            <div className="space-y-4" data-oid="k.mam-7">
                                {workflowSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4"
                                        data-oid="ga339pe"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                step.status === 'completed'
                                                    ? 'bg-green-100 text-green-600'
                                                    : step.status === 'skipped'
                                                      ? 'bg-gray-100 text-gray-400'
                                                      : 'bg-blue-100 text-blue-600'
                                            }`}
                                            data-oid="t9mupdg"
                                        >
                                            {step.status === 'completed' ? (
                                                <CheckCircle
                                                    className="w-5 h-5"
                                                    data-oid="ovexw3k"
                                                />
                                            ) : step.status === 'skipped' ? (
                                                <XCircle className="w-5 h-5" data-oid="0.sy:8x" />
                                            ) : (
                                                <step.icon className="w-5 h-5" data-oid="cp08k:v" />
                                            )}
                                        </div>
                                        <div className="flex-1" data-oid="8srwc8c">
                                            <h4 className="font-medium" data-oid="vwunsv6">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-gray-600" data-oid="8m__skp">
                                                {step.description}
                                            </p>
                                        </div>
                                        {step.status === 'completed' && (
                                            <Badge
                                                className="bg-green-100 text-green-800"
                                                data-oid="9uofh1e"
                                            >
                                                Completed
                                            </Badge>
                                        )}
                                        {step.status === 'skipped' && (
                                            <Badge
                                                className="bg-gray-100 text-gray-800"
                                                data-oid="5b-twc:"
                                            >
                                                Skipped
                                            </Badge>
                                        )}
                                        {step.status === 'pending' && (
                                            <Badge
                                                className="bg-blue-100 text-blue-800"
                                                data-oid="mkkb8dq"
                                            >
                                                Pending
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="x418nm7">
                        {/* Return Information */}
                        <Card data-oid="r9qpcyj">
                            <CardHeader data-oid="-ya56ag">
                                <CardTitle
                                    className="flex items-center space-x-2"
                                    data-oid="ekycdj3"
                                >
                                    <FileText className="w-5 h-5" data-oid="397al9f" />
                                    <span data-oid="g:nzbhn">Return Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="e6sfa0o">
                                <div data-oid="3.8vnzi">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="sl4iyo0"
                                    >
                                        Order ID
                                    </label>
                                    <p className="font-medium" data-oid="_bxpe:w">
                                        {returnOrder.orderId}
                                    </p>
                                </div>
                                <div data-oid="7q7wc1a">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="1kjwt5m"
                                    >
                                        Customer ID
                                    </label>
                                    <p className="font-medium" data-oid=":d_g9xq">
                                        {returnOrder.customerId}
                                    </p>
                                </div>
                                <div data-oid="as0hm49">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="pferet."
                                    >
                                        Return Reason
                                    </label>
                                    <p className="font-medium" data-oid=":nxpmvh">
                                        {returnOrder.reason}
                                    </p>
                                </div>
                                {returnOrder.description && (
                                    <div data-oid="7s68en-">
                                        <label
                                            className="text-sm font-medium text-gray-600"
                                            data-oid="91srw6z"
                                        >
                                            Description
                                        </label>
                                        <p className="text-sm" data-oid="blh:ivv">
                                            {returnOrder.description}
                                        </p>
                                    </div>
                                )}
                                <div data-oid="g81pw2b">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="29v26iu"
                                    >
                                        Requested Date
                                    </label>
                                    <p className="text-sm" data-oid="ysj3y9.">
                                        {formatDate(returnOrder.requestedAt)} at{' '}
                                        {formatTime(returnOrder.requestedAt)}
                                    </p>
                                </div>
                                {returnOrder.processedAt && (
                                    <div data-oid="9m_n0ko">
                                        <label
                                            className="text-sm font-medium text-gray-600"
                                            data-oid="z.r52_g"
                                        >
                                            Processed Date
                                        </label>
                                        <p className="text-sm" data-oid="wc320tw">
                                            {formatDate(returnOrder.processedAt)} at{' '}
                                            {formatTime(returnOrder.processedAt)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Financial Information */}
                        <Card data-oid="6:p1rj.">
                            <CardHeader data-oid="slrcdfw">
                                <CardTitle
                                    className="flex items-center space-x-2"
                                    data-oid="1txoij3"
                                >
                                    <DollarSign className="w-5 h-5" data-oid="25im5n." />
                                    <span data-oid="m38c_k2">Financial Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="db_xvc2">
                                <div data-oid="6xf2326">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="lmitx:2"
                                    >
                                        Refund Amount
                                    </label>
                                    <p
                                        className="text-2xl font-bold text-green-600"
                                        data-oid="4k2979e"
                                    >
                                        {formatCurrency(returnOrder.refundAmount)}
                                    </p>
                                </div>
                                <div data-oid=".pzybl7">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid=".xxkr_b"
                                    >
                                        Refund Method
                                    </label>
                                    <p className="font-medium capitalize" data-oid="79oo6fz">
                                        {returnOrder.refundMethod.replace('_', ' ')}
                                    </p>
                                </div>
                                <div data-oid="umvmmto">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="ajimwtz"
                                    >
                                        Status
                                    </label>
                                    <Badge
                                        className={getStatusColor(returnOrder.status)}
                                        data-oid="g3l5p:z"
                                    >
                                        {returnOrder.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Return Items */}
                    <Card data-oid="j.evrzn">
                        <CardHeader data-oid="dyp9-4n">
                            <CardTitle className="flex items-center space-x-2" data-oid="tljcfe2">
                                <Package className="w-5 h-5" data-oid="5_gkmvt" />
                                <span data-oid="msby..i">Return Items</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="o88vs0f">
                            <div className="space-y-4" data-oid=":k4an2u">
                                {returnOrder.returnItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4"
                                        data-oid="ceyli9-"
                                    >
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-4 gap-4"
                                            data-oid="ic59no1"
                                        >
                                            <div data-oid="7x_k5.x">
                                                <label
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="0nvcwy4"
                                                >
                                                    Product ID
                                                </label>
                                                <p className="font-medium" data-oid="p2:4_cs">
                                                    {item.productId}
                                                </p>
                                            </div>
                                            <div data-oid="__v6erg">
                                                <label
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="lp-d-gk"
                                                >
                                                    Quantity
                                                </label>
                                                <p className="font-medium" data-oid="u3l8c1n">
                                                    {item.quantity}
                                                </p>
                                            </div>
                                            <div data-oid="p7t8r.r">
                                                <label
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="30c.rgy"
                                                >
                                                    Condition
                                                </label>
                                                <Badge
                                                    className={getConditionColor(item.condition)}
                                                    data-oid="d7no1yg"
                                                >
                                                    {item.condition.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div data-oid="kkemt36">
                                                <label
                                                    className="text-sm font-medium text-gray-600"
                                                    data-oid="4.ikt:0"
                                                >
                                                    Refund Amount
                                                </label>
                                                <p
                                                    className="font-medium text-green-600"
                                                    data-oid="07f5doi"
                                                >
                                                    {formatCurrency(item.refundAmount)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3" data-oid="rrqh5h2">
                                            <label
                                                className="text-sm font-medium text-gray-600"
                                                data-oid="xqt.eyr"
                                            >
                                                Reason
                                            </label>
                                            <p className="text-sm" data-oid="c82qc-1">
                                                {item.reason}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="icx.x6z">
                        {/* Customer Notes */}
                        {returnOrder.customerNotes && (
                            <Card data-oid="e85v_lc">
                                <CardHeader data-oid="484.kp7">
                                    <CardTitle
                                        className="flex items-center space-x-2"
                                        data-oid="m_v2d3n"
                                    >
                                        <User className="w-5 h-5" data-oid=".zxj_m8" />
                                        <span data-oid="uh360lz">Customer Notes</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent data-oid="zymfih2">
                                    <p className="text-sm" data-oid="t9f4q2a">
                                        {returnOrder.customerNotes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pharmacy Notes */}
                        <Card data-oid="z4wv:tv">
                            <CardHeader data-oid="s7rfz:z">
                                <CardTitle
                                    className="flex items-center space-x-2"
                                    data-oid="v9go4u-"
                                >
                                    <MessageSquare className="w-5 h-5" data-oid="_1ggemj" />
                                    <span data-oid="ft15mxf">Pharmacy Notes</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent data-oid="lt0_...">
                                <p className="text-sm" data-oid="fj3.9n-">
                                    {returnOrder.adminNotes || 'No pharmacy notes yet.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admin View Notice */}
                    {returnOrder.status === 'requested' && (
                        <Card data-oid="ohe-0_d">
                            <CardContent className="pt-6" data-oid="12plou:">
                                <div className="flex items-center space-x-3" data-oid="i7-83ja">
                                    <AlertCircle
                                        className="w-6 h-6 text-blue-600"
                                        data-oid="0u:92rf"
                                    />

                                    <div data-oid="3fgz4s.">
                                        <p className="text-blue-600 font-medium" data-oid="_uqmfy:">
                                            Pending Pharmacy Action
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="y-zqgup">
                                            This return request is waiting for the pharmacy to
                                            approve or reject it.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Processing Status */}
                    {returnOrder.status === 'processing' && (
                        <Card data-oid="gg0kv68">
                            <CardContent className="pt-6" data-oid="2x:q_8m">
                                <div className="flex items-center space-x-3" data-oid="bz0houg">
                                    <div
                                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                                        data-oid="kaf7mci"
                                    ></div>
                                    <p className="text-blue-600 font-medium" data-oid="3e-2333">
                                        Processing refund to customer wallet...
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Completion Status */}
                    {returnOrder.status === 'completed' && (
                        <Card data-oid="i.gp_bk">
                            <CardContent className="pt-6" data-oid="7d-vcfc">
                                <div className="flex items-center space-x-3" data-oid="zqj0:07">
                                    <CheckCircle
                                        className="w-6 h-6 text-green-600"
                                        data-oid="z6dhtiy"
                                    />

                                    <div data-oid="4kx1yig">
                                        <p
                                            className="text-green-600 font-medium"
                                            data-oid="..t.c5p"
                                        >
                                            Return completed successfully!
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="0h_g33d">
                                            Refund of {formatCurrency(returnOrder.refundAmount)} has
                                            been added to customer{"'"}s wallet.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Rejection Status */}
                    {returnOrder.status === 'rejected' && (
                        <Card data-oid="fqa0ax6">
                            <CardContent className="pt-6" data-oid="n4ugc1u">
                                <div className="flex items-center space-x-3" data-oid="ofo81cg">
                                    <XCircle className="w-6 h-6 text-red-600" data-oid="rueaxsh" />
                                    <div data-oid="jvgl1pc">
                                        <p className="text-red-600 font-medium" data-oid="3lh2ak_">
                                            Return request rejected
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="oo-gac1">
                                            {returnOrder.adminNotes || 'No reason provided.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
