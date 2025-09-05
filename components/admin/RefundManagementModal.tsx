'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    DollarSign,
    Calendar,
    User,
    ShoppingCart,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Wallet,
    CreditCard,
    FileText,
} from 'lucide-react';

interface RefundManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    refundData: any;
}

export function RefundManagementModal({ isOpen, onClose, refundData }: RefundManagementModalProps) {
    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-orange-500" data-oid="8e4vbev" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-500" data-oid="-59nv4l" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" data-oid="tf2xqzn" />;
            case 'processed':
                return <CheckCircle className="w-5 h-5 text-blue-500" data-oid="6cuhag5" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" data-oid="v.nn.e_" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { variant: 'secondary' as const, label: 'Pending Pharmacy Review' },
            approved: { variant: 'default' as const, label: 'Approved by Pharmacy' },
            rejected: { variant: 'destructive' as const, label: 'Rejected by Pharmacy' },
            processed: { variant: 'default' as const, label: 'Processed' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return (
            <Badge variant={config.variant} data-oid="one-v_t">
                {config.label}
            </Badge>
        );
    };

    const getRefundMethodIcon = (method: string) => {
        switch (method) {
            case 'wallet':
                return <Wallet className="w-4 h-4" data-oid="2q7487b" />;
            case 'original_payment':
                return <CreditCard className="w-4 h-4" data-oid="ah_x04n" />;
            case 'bank_transfer':
                return <DollarSign className="w-4 h-4" data-oid="_vbz3.7" />;
            default:
                return <DollarSign className="w-4 h-4" data-oid="6f5wilt" />;
        }
    };

    if (!refundData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="zxjf80_">
            <DialogContent
                className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto"
                data-oid=":a:p670"
            >
                <DialogHeader data-oid="3o8mf61">
                    <DialogTitle className="flex items-center gap-2" data-oid="l2xx4aj">
                        <FileText className="w-5 h-5" data-oid="p4s0sqx" />
                        Refund Request Details
                    </DialogTitle>
                    <DialogDescription data-oid="f8ykx-.">
                        Monitor and review this refund request (Pharmacy handles approval/rejection)
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pb-6" data-oid="jj13bqg">
                    {/* Status Overview */}
                    <Card data-oid="mdmgcw:">
                        <CardHeader data-oid="6y5ak9v">
                            <CardTitle
                                className="text-lg flex items-center gap-2"
                                data-oid="9qif7n7"
                            >
                                {getStatusIcon(refundData.status)}
                                Refund Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="2vuc-u3">
                            <div className="flex items-center justify-between" data-oid="l2p8b:y">
                                <div data-oid="e1bz9s9">
                                    <p className="text-2xl font-bold" data-oid="5zm53mk">
                                        {formatCurrency(refundData.amount)}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="b73e_0s">
                                        Refund Amount
                                    </p>
                                </div>
                                <div className="text-right" data-oid="9c:mmo9">
                                    {getStatusBadge(refundData.status)}
                                    <p className="text-sm text-gray-600 mt-1" data-oid="hhw19l-">
                                        Requested{' '}
                                        {new Date(refundData.requestedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order and Customer Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-oid="wazpnxs">
                        <Card data-oid="1ea479j">
                            <CardHeader data-oid="4hboi88">
                                <CardTitle
                                    className="text-lg flex items-center gap-2"
                                    data-oid="t8tho-t"
                                >
                                    <ShoppingCart className="w-5 h-5" data-oid="i8e4r08" />
                                    Order Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3" data-oid="fj2:p4.">
                                <div data-oid="4l.en6v">
                                    <Label className="text-sm text-gray-600" data-oid="vhoj4rt">
                                        Order ID
                                    </Label>
                                    <p className="font-mono font-semibold" data-oid="66-3..e">
                                        {refundData.orderId}
                                    </p>
                                </div>
                                <div data-oid="yz2ze1v">
                                    <Label className="text-sm text-gray-600" data-oid="bbx8crn">
                                        Refund Method
                                    </Label>
                                    <div className="flex items-center gap-2" data-oid="40_8rmo">
                                        {getRefundMethodIcon(refundData.refundMethod)}
                                        <span className="capitalize" data-oid="-8-f:o.">
                                            {refundData.refundMethod.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card data-oid="z5d0pn7">
                            <CardHeader data-oid="3692n:4">
                                <CardTitle
                                    className="text-lg flex items-center gap-2"
                                    data-oid="q9j.k57"
                                >
                                    <User className="w-5 h-5" data-oid="1bg4rzi" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3" data-oid="simyhjg">
                                <div data-oid=":_t.gum">
                                    <Label className="text-sm text-gray-600" data-oid="by6ns.d">
                                        Customer Name
                                    </Label>
                                    <p className="font-semibold" data-oid="dobdm4:">
                                        {refundData.customerName}
                                    </p>
                                </div>
                                <div data-oid="_cyh4_r">
                                    <Label className="text-sm text-gray-600" data-oid="29dzw46">
                                        Email
                                    </Label>
                                    <p className="text-sm" data-oid="l1zrevr">
                                        {refundData.customerEmail}
                                    </p>
                                </div>
                                <div data-oid="r.zbywd">
                                    <Label className="text-sm text-gray-600" data-oid="gv.x2st">
                                        Customer ID
                                    </Label>
                                    <p className="font-mono text-sm" data-oid=".mu43ri">
                                        {refundData.customerId}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Refund Reason */}
                    <Card data-oid="7omz.94">
                        <CardHeader data-oid="6qmjrcw">
                            <CardTitle className="text-lg" data-oid=".azt-bc">
                                Refund Reason
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="dpcxfi4">
                            <div className="bg-gray-50 border rounded-lg p-4" data-oid="xytl3zw">
                                <p className="text-gray-800" data-oid="hm0jvge">
                                    {refundData.reason}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Processing Information */}
                    {(refundData.processedAt || refundData.processedBy) && (
                        <Card data-oid="z:02p:y">
                            <CardHeader data-oid="rxvar5q">
                                <CardTitle className="text-lg" data-oid="1jbvdi0">
                                    Processing Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3" data-oid="dqqg73a">
                                {refundData.processedAt && (
                                    <div data-oid="3sozb5y">
                                        <Label className="text-sm text-gray-600" data-oid="94xh3qj">
                                            Processed Date
                                        </Label>
                                        <p className="font-semibold" data-oid="3f4z:p_">
                                            {new Date(refundData.processedAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {refundData.processedBy && (
                                    <div data-oid="s2-:i6k">
                                        <Label className="text-sm text-gray-600" data-oid="0qrz_yi">
                                            Processed By
                                        </Label>
                                        <p className="font-semibold" data-oid="5gcu72b">
                                            {refundData.processedBy}
                                        </p>
                                    </div>
                                )}
                                {refundData.notes && (
                                    <div data-oid="a4ahi4e">
                                        <Label className="text-sm text-gray-600" data-oid="fb8y_sp">
                                            Admin Notes
                                        </Label>
                                        <div
                                            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                                            data-oid="vul-5bd"
                                        >
                                            <p className="text-blue-800" data-oid="1x:zsrt">
                                                {refundData.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Admin Monitoring Section - For pending refunds */}
                    {refundData.status === 'pending' && (
                        <Card data-oid="t4-anvr">
                            <CardHeader data-oid="zo1v-q1">
                                <CardTitle className="text-lg" data-oid="_d2-ez_">
                                    Admin Monitoring
                                </CardTitle>
                                <CardDescription data-oid=".ef9qn3">
                                    This refund request is awaiting pharmacy review and action
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="bo:16w2">
                                <div
                                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                    data-oid="j.vudwo"
                                >
                                    <div
                                        className="flex items-center gap-2 mb-2"
                                        data-oid="v-t5j7e"
                                    >
                                        <Clock
                                            className="w-5 h-5 text-blue-600"
                                            data-oid="k-q_b8_"
                                        />

                                        <span
                                            className="font-semibold text-blue-800"
                                            data-oid="uwrdnn:"
                                        >
                                            Pending Pharmacy Review
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-700" data-oid="5q1-6m2">
                                        This refund request is currently pending review by the
                                        pharmacy. The pharmacy will handle the approval or rejection
                                        of this request.
                                    </p>
                                </div>

                                <Separator data-oid="33cn35z" />

                                <div className="flex justify-end" data-oid="tj.qda4">
                                    <Button variant="outline" onClick={onClose} data-oid="37e23sb">
                                        Close
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Completed Status */}
                    {refundData.status !== 'pending' && (
                        <Card data-oid="h2h01y1">
                            <CardContent className="p-6 text-center" data-oid="osksito">
                                {getStatusIcon(refundData.status)}
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2 mt-4"
                                    data-oid="n2yfbu8"
                                >
                                    Refund{' '}
                                    {refundData.status === 'rejected' ? 'Rejected' : 'Completed'}
                                </h3>
                                <p className="text-gray-600" data-oid="3k-tjsv">
                                    {refundData.status === 'rejected'
                                        ? 'This refund request has been rejected.'
                                        : 'This refund has been processed and completed.'}
                                </p>
                                {refundData.processedAt && (
                                    <p className="text-sm text-gray-500 mt-2" data-oid="udujju9">
                                        Processed on{' '}
                                        {new Date(refundData.processedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
