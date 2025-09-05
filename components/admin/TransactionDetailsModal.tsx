'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    DollarSign,
    Calendar,
    User,
    Building,
    CreditCard,
    FileText,
    Copy,
    Download,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
} from 'lucide-react';

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: any;
}

export function TransactionDetailsModal({
    isOpen,
    onClose,
    transaction,
}: TransactionDetailsModalProps) {
    const [copied, setCopied] = useState(false);

    if (!transaction) return null;

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" data-oid="i5_r:m7" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" data-oid="g9nqw5g" />;
            case 'processing':
                return <AlertCircle className="w-5 h-5 text-blue-500" data-oid="fhwxu3f" />;
            case 'failed':
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" data-oid="diaaw8w" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" data-oid=".9xq2n3" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            completed: { variant: 'default' as const, color: 'bg-green-500', label: 'Completed' },
            pending: { variant: 'secondary' as const, color: 'bg-yellow-500', label: 'Pending' },
            processing: { variant: 'outline' as const, color: 'bg-blue-500', label: 'Processing' },
            failed: { variant: 'destructive' as const, color: 'bg-red-500', label: 'Failed' },
            cancelled: { variant: 'outline' as const, color: 'bg-gray-500', label: 'Cancelled' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return (
            <Badge variant={config.variant} className="flex items-center gap-2" data-oid="fdaj62s">
                <div className={`w-2 h-2 rounded-full ${config.color}`} data-oid="j2h:k_b" />
                {config.label}
            </Badge>
        );
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <CreditCard className="w-5 h-5 text-blue-600" data-oid="s37hsq5" />;
            case 'commission':
                return <DollarSign className="w-5 h-5 text-green-600" data-oid="8.ml-kp" />;
            case 'refund':
                return <FileText className="w-5 h-5 text-red-600" data-oid="l:v3nit" />;
            case 'payout':
                return <Building className="w-5 h-5 text-purple-600" data-oid="o.vpmbj" />;
            default:
                return <DollarSign className="w-5 h-5 text-gray-600" data-oid="6b38788" />;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadReceipt = () => {
        // Mock download functionality
        const element = document.createElement('a');
        const file = new Blob(
            [
                `Transaction Receipt\n\nTransaction ID: ${transaction.id}\nType: ${transaction.type}\nAmount: ${formatCurrency(transaction.amount)}\nStatus: ${transaction.status}\nDate: ${formatDate(transaction.createdAt)}\nDescription: ${transaction.description}\nReference: ${transaction.reference}\nEntity: ${transaction.entityName}`,
            ],

            { type: 'text/plain' },
        );
        element.href = URL.createObjectURL(file);
        element.download = `transaction_${transaction.id}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="77x9gqs">
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-oid="66960ho">
                <DialogHeader data-oid="z6k6rk2">
                    <DialogTitle className="flex items-center gap-3" data-oid="m_0-w0f">
                        {getTypeIcon(transaction.type)}
                        Transaction Details
                    </DialogTitle>
                    <DialogDescription data-oid="6_n956w">
                        Complete information about transaction {transaction.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6" data-oid="jp-9x62">
                    {/* Transaction Overview */}
                    <div className="bg-gray-50 rounded-lg p-4" data-oid="82t85be">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="dx85bp:">
                            <div data-oid="6903v4h">
                                <label
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="8n0:crd"
                                >
                                    Transaction ID
                                </label>
                                <div className="flex items-center gap-2 mt-1" data-oid="ojc5z6t">
                                    <span className="font-mono text-sm" data-oid="an7lqmo">
                                        {transaction.id}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(transaction.id)}
                                        className="h-6 w-6 p-0"
                                        data-oid="y41z222"
                                    >
                                        <Copy className="w-3 h-3" data-oid="3b:xhrf" />
                                    </Button>
                                    {copied && (
                                        <span className="text-xs text-green-600" data-oid="quxussf">
                                            Copied!
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div data-oid="b5zu.83">
                                <label
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="4ybcv.r"
                                >
                                    Status
                                </label>
                                <div className="mt-1" data-oid="1:18h83">
                                    {getStatusBadge(transaction.status)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amount and Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="erzeb22">
                        <div className="space-y-4" data-oid="dqw8wf2">
                            <div data-oid="usxjiwj">
                                <label
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="6xkba:h"
                                >
                                    Amount
                                </label>
                                <div
                                    className="text-2xl font-bold text-gray-900 mt-1"
                                    data-oid="7t3ifwz"
                                >
                                    {formatCurrency(transaction.amount)}
                                </div>
                            </div>
                            <div data-oid="47srb8_">
                                <label
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="mslz:lv"
                                >
                                    Type
                                </label>
                                <div className="flex items-center gap-2 mt-1" data-oid="llxwrvp">
                                    {getTypeIcon(transaction.type)}
                                    <span className="capitalize font-medium" data-oid="1a.x:ft">
                                        {transaction.type}
                                    </span>
                                    {transaction.subType && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                            data-oid="4ruonho"
                                        >
                                            {transaction.subType.replace('_', ' ')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4" data-oid="uy4u54m">
                            <div data-oid="yt7k4e8">
                                <label
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="i07peuc"
                                >
                                    Created Date
                                </label>
                                <div className="flex items-center gap-2 mt-1" data-oid="kmo3a3c">
                                    <Calendar
                                        className="w-4 h-4 text-gray-400"
                                        data-oid="b-2.gdi"
                                    />

                                    <span data-oid="s41g-so">
                                        {formatDate(transaction.createdAt)}
                                    </span>
                                </div>
                            </div>
                            {transaction.processedAt && (
                                <div data-oid="bp9.n1c">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="v93jr-w"
                                    >
                                        Processed Date
                                    </label>
                                    <div
                                        className="flex items-center gap-2 mt-1"
                                        data-oid="_0-gvu."
                                    >
                                        <Calendar
                                            className="w-4 h-4 text-gray-400"
                                            data-oid="b-rj-gw"
                                        />

                                        <span data-oid="m.e3xyn">
                                            {formatDate(transaction.processedAt)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator data-oid="vkbzbh4" />

                    {/* Entity Information */}
                    <div data-oid="j_cem.3">
                        <h3 className="text-lg font-semibold mb-3" data-oid="_5y__ob">
                            Entity Information
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4" data-oid="ypkg2._">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="nepwpsl"
                            >
                                <div data-oid="mkc:3l.">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="26mqw80"
                                    >
                                        Entity Name
                                    </label>
                                    <div
                                        className="flex items-center gap-2 mt-1"
                                        data-oid="pk3hbac"
                                    >
                                        <User
                                            className="w-4 h-4 text-gray-400"
                                            data-oid="1gkgor9"
                                        />

                                        <span className="font-medium" data-oid="15mix3t">
                                            {transaction.entityName}
                                        </span>
                                    </div>
                                </div>
                                <div data-oid="jnlmadq">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="5y0dvp6"
                                    >
                                        Entity Type
                                    </label>
                                    <div
                                        className="flex items-center gap-2 mt-1"
                                        data-oid="_hvy:dc"
                                    >
                                        <Building
                                            className="w-4 h-4 text-gray-400"
                                            data-oid="6bw:lpe"
                                        />

                                        <span className="capitalize" data-oid="pnq2chs">
                                            {transaction.entityType}
                                        </span>
                                    </div>
                                </div>
                                <div data-oid="bg92vp3">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="n6zjw2u"
                                    >
                                        Entity ID
                                    </label>
                                    <div className="font-mono text-sm mt-1" data-oid="dataygv">
                                        {transaction.entityId}
                                    </div>
                                </div>
                                <div data-oid=".1:rgaz">
                                    <label
                                        className="text-sm font-medium text-gray-600"
                                        data-oid="7hp_.jn"
                                    >
                                        Reference
                                    </label>
                                    <div className="font-mono text-sm mt-1" data-oid="_r-d8v:">
                                        {transaction.reference}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator data-oid="gvrnv32" />

                    {/* Description */}
                    <div data-oid="61vkf:b">
                        <h3 className="text-lg font-semibold mb-3" data-oid="rm724_c">
                            Description
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4" data-oid="o07snzl">
                            <p className="text-gray-700" data-oid="-d1csy3">
                                {transaction.description}
                            </p>
                        </div>
                    </div>

                    {/* Metadata */}
                    {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                        <>
                            <Separator data-oid="170lund" />
                            <div data-oid="3:_1qyx">
                                <h3 className="text-lg font-semibold mb-3" data-oid=":pd_he-">
                                    Additional Information
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4" data-oid="53if:fx">
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        data-oid="d-:6v8."
                                    >
                                        {Object.entries(transaction.metadata).map(
                                            ([key, value]) => (
                                                <div key={key} data-oid="7prebl3">
                                                    <label
                                                        className="text-sm font-medium text-gray-600"
                                                        data-oid="-8qqi8f"
                                                    >
                                                        {key
                                                            .replace(/([A-Z])/g, ' $1')
                                                            .replace(/^./, (str) =>
                                                                str.toUpperCase(),
                                                            )}
                                                    </label>
                                                    <div className="mt-1" data-oid="f222c94">
                                                        {typeof value === 'number' &&
                                                        key.toLowerCase().includes('amount')
                                                            ? formatCurrency(value)
                                                            : String(value)}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4" data-oid="qn378vx">
                        <Button
                            variant="outline"
                            onClick={handleDownloadReceipt}
                            data-oid="ot93jma"
                        >
                            <Download className="w-4 h-4 mr-2" data-oid="ue.vjwb" />
                            Download Receipt
                        </Button>
                        <Button onClick={onClose} data-oid="nd4zvhv">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
