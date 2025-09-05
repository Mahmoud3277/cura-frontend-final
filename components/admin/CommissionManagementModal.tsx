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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { moneyTransactionService } from '@/lib/services/moneyTransactionService';
import {
    DollarSign,
    Calendar,
    Building,
    User,
    CreditCard,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
} from 'lucide-react';

interface CommissionManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    entityType: 'pharmacy' | 'vendor' | 'doctor';
    entityId: string;
    entityData?: any;
}

export function CommissionManagementModal({
    isOpen,
    onClose,
    entityType,
    entityId,
    entityData,
}: CommissionManagementModalProps) {
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutNotes, setPayoutNotes] = useState('');
    const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
    const [isProcessing, setIsProcessing] = useState(false);

    console.log('CommissionManagementModal - isOpen:', isOpen, 'entityData:', entityData);

    const handleProcessPayout = async () => {
        setIsProcessing(true);
        try {
            let success = false;
            if (entityType === 'pharmacy') {
                // For pharmacies, we collect commission from them
                success = await moneyTransactionService.collectPharmacyCommission(entityId);
                console.log('Commission collected from pharmacy successfully');
            } else if (entityType === 'vendor') {
                // For vendors, we collect commission from them
                success = await moneyTransactionService.collectVendorCommission(entityId);
                console.log('Commission collected from vendor successfully');
            } else {
                // For doctors, we pay commission to them
                success = await moneyTransactionService.processDoctorPayout(entityId);
                console.log('Payout processed to doctor successfully');
            }

            if (success) {
                onClose();
                // Optionally trigger a refresh of the parent component
                window.location.reload();
            }
        } catch (error) {
            console.error('Error processing transaction:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="d40y7a8">
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-oid="6fff3et">
                <DialogHeader data-oid="1.z4vcw">
                    <DialogTitle className="flex items-center gap-2" data-oid="bl:1qqx">
                        {entityType === 'pharmacy' ? (
                            <Building className="w-5 h-5" data-oid="nourtga" />
                        ) : entityType === 'vendor' ? (
                            <Building className="w-5 h-5" data-oid="vendor-icon" />
                        ) : (
                            <User className="w-5 h-5" data-oid="9s_sya-" />
                        )}
                        Commission Management - {entityData?.name || 'Unknown'}
                    </DialogTitle>
                    <DialogDescription data-oid="dqj7j7a">
                        Manage commission {entityType === 'doctor' ? 'payments' : 'collection'} and
                        payout schedules for this {entityType}
                    </DialogDescription>
                </DialogHeader>

                {!entityData ? (
                    <div className="p-6 text-center" data-oid="3__z4.0">
                        <p className="text-gray-500" data-oid="fao06ak">
                            No data available for this entity.
                        </p>
                        <Button onClick={onClose} className="mt-4" data-oid="uwn52-2">
                            Close
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6" data-oid="ngrd_x.">
                        {/* Entity Overview */}
                        <Card data-oid="iqsn-o7">
                            <CardHeader data-oid="vlen5y4">
                                <CardTitle className="text-lg" data-oid="u8i-hwf">
                                    Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="-k280iy">
                                <div className="grid grid-cols-2 gap-4" data-oid="ax2.dd8">
                                    <div data-oid="nanao_d">
                                        <Label className="text-sm text-gray-600" data-oid="o93v8kc">
                                            Entity Name
                                        </Label>
                                        <p className="font-semibold" data-oid="pfjd:l-">
                                            {entityData.name || 'N/A'}
                                        </p>
                                    </div>
                                    {entityType === 'pharmacy' && entityData.city && (
                                        <div data-oid="gczy6sb">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="cwkbmyl"
                                            >
                                                City
                                            </Label>
                                            <p className="font-semibold" data-oid="vqimn0-">
                                                {entityData.city}
                                            </p>
                                        </div>
                                    )}
                                    {entityType === 'vendor' && entityData.category && (
                                        <div data-oid="vendor-category">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="vendor-category-label"
                                            >
                                                Category
                                            </Label>
                                            <p
                                                className="font-semibold"
                                                data-oid="vendor-category-text"
                                            >
                                                {entityData.category}
                                            </p>
                                        </div>
                                    )}
                                    {entityType === 'doctor' && entityData.specialization && (
                                        <div data-oid="28-2z:p">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="xq.99g1"
                                            >
                                                Specialization
                                            </Label>
                                            <p className="font-semibold" data-oid="7gc2ndc">
                                                {entityData.specialization}
                                            </p>
                                        </div>
                                    )}
                                    <div data-oid=":77tfby">
                                        <Label className="text-sm text-gray-600" data-oid="mj62he8">
                                            Commission Rate
                                        </Label>
                                        <p className="font-semibold" data-oid="o8xha1v">
                                            {entityData.commissionRate || 0}%
                                        </p>
                                    </div>
                                    <div data-oid="v.:cx6n">
                                        <Label className="text-sm text-gray-600" data-oid="j6c4i1j">
                                            Payout Frequency
                                        </Label>
                                        <p className="font-semibold capitalize" data-oid="j:vt9u7">
                                            {entityData.payoutFrequency || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="m9-a:2v">
                            <Card data-oid="rllj4rq">
                                <CardContent className="p-4" data-oid="ytd-4rd">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="f_56bu9"
                                    >
                                        <div data-oid="rhqv2h_">
                                            <p className="text-sm text-gray-600" data-oid="bdw6pfj">
                                                Total Earned
                                            </p>
                                            <p
                                                className="text-xl font-bold text-green-600"
                                                data-oid="9l4j8fz"
                                            >
                                                {formatCurrency(entityData.commissionEarned || 0)}
                                            </p>
                                        </div>
                                        <TrendingUp
                                            className="w-8 h-8 text-green-500"
                                            data-oid="ba8zcua"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card data-oid="7ix_l.h">
                                <CardContent className="p-4" data-oid="owne1ap">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="78w2zel"
                                    >
                                        <div data-oid="9cmhpdm">
                                            <p className="text-sm text-gray-600" data-oid="e98q5zk">
                                                Pending Amount
                                            </p>
                                            <p
                                                className="text-xl font-bold text-orange-600"
                                                data-oid="_poxrc:"
                                            >
                                                {formatCurrency(entityData.pendingAmount || 0)}
                                            </p>
                                        </div>
                                        <Clock
                                            className="w-8 h-8 text-orange-500"
                                            data-oid="dqiq6:8"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card data-oid="7.xpd6-">
                                <CardContent className="p-4" data-oid=":llbrma">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="p:y:-4s"
                                    >
                                        <div data-oid=":bgxtah">
                                            <p className="text-sm text-gray-600" data-oid="q3h.qns">
                                                Last Payout
                                            </p>
                                            <p className="text-sm font-semibold" data-oid="99qsfvb">
                                                {entityData.lastPayout
                                                    ? new Date(
                                                          entityData.lastPayout,
                                                      ).toLocaleDateString()
                                                    : 'Never'}
                                            </p>
                                        </div>
                                        <Calendar
                                            className="w-8 h-8 text-blue-500"
                                            data-oid="b6hjn02"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Performance Metrics */}
                        {entityType === 'pharmacy' && (
                            <Card data-oid="ifqkx.m">
                                <CardHeader data-oid="9ruq1kl">
                                    <CardTitle className="text-lg" data-oid="1qr44hc">
                                        Performance Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4" data-oid="fgkkzth">
                                    <div className="grid grid-cols-2 gap-4" data-oid="hdajw_l">
                                        <div data-oid="oa988pe">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="9.x23kk"
                                            >
                                                Total Sales
                                            </Label>
                                            <p className="font-semibold" data-oid="vk4eygz">
                                                {formatCurrency(entityData.totalSales || 0)}
                                            </p>
                                        </div>
                                        <div data-oid="6j8gp02">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="mj-jzjv"
                                            >
                                                Total Orders
                                            </Label>
                                            <p className="font-semibold" data-oid="g0g67jw">
                                                {entityData.totalOrders || 0}
                                            </p>
                                        </div>
                                        <div data-oid="t8_usbg">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="xebwv9s"
                                            >
                                                Average Order Value
                                            </Label>
                                            <p className="font-semibold" data-oid="y1xx3d4">
                                                {formatCurrency(entityData.averageOrderValue || 0)}
                                            </p>
                                        </div>
                                        <div data-oid="2l8tbj8">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="id-3cvn"
                                            >
                                                Payout Status
                                            </Label>
                                            <Badge
                                                variant={
                                                    entityData.payoutStatus === 'completed'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                data-oid="8p2gvjw"
                                            >
                                                {entityData.payoutStatus || 'pending'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {entityType === 'doctor' && (
                            <Card data-oid="_fk5nn.">
                                <CardHeader data-oid="s7g7kc2">
                                    <CardTitle className="text-lg" data-oid="a3.f6-c">
                                        Referral Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4" data-oid="622nnim">
                                    <div className="grid grid-cols-2 gap-4" data-oid="u_3m9jq">
                                        <div data-oid="0msvoq8">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="d.fl1gq"
                                            >
                                                Total Referrals
                                            </Label>
                                            <p className="font-semibold" data-oid="j_:h-5b">
                                                {entityData.totalReferrals || 0}
                                            </p>
                                        </div>
                                        <div data-oid=".9gvj_z">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="yudo:8w"
                                            >
                                                Successful Orders
                                            </Label>
                                            <p className="font-semibold" data-oid="mi0tyqi">
                                                {entityData.successfulOrders || 0}
                                            </p>
                                        </div>
                                        <div data-oid="g53lp8e">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="nj53626"
                                            >
                                                Conversion Rate
                                            </Label>
                                            <p className="font-semibold" data-oid="59rtqrh">
                                                {entityData.conversionRate || 0}%
                                            </p>
                                        </div>
                                        <div data-oid="pyzskhj">
                                            <Label
                                                className="text-sm text-gray-600"
                                                data-oid="8ychl-8"
                                            >
                                                Payout Status
                                            </Label>
                                            <Badge
                                                variant={
                                                    entityData.payoutStatus === 'completed'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                data-oid="6gh4awf"
                                            >
                                                {entityData.payoutStatus || 'pending'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Commission Collection/Payout Processing */}
                        {(entityData.pendingAmount || 0) > 0 && (
                            <Card data-oid="rex0xm:">
                                <CardHeader data-oid="fnu7xjw">
                                    <CardTitle
                                        className="text-lg flex items-center gap-2"
                                        data-oid="kh85us6"
                                    >
                                        <CreditCard className="w-5 h-5" data-oid="v1fulpa" />
                                        {entityType === 'pharmacy' || entityType === 'vendor'
                                            ? 'Collect Commission'
                                            : 'Process Payout'}
                                    </CardTitle>
                                    <CardDescription data-oid="xgnrd0d">
                                        {entityType === 'pharmacy'
                                            ? 'Collect commission payment from pharmacy'
                                            : entityType === 'vendor'
                                              ? 'Collect commission payment from vendor'
                                              : 'Process commission payout to doctor'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4" data-oid="28:-39s">
                                    <div
                                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                        data-oid="cc7zi-0"
                                    >
                                        <div
                                            className="flex items-center gap-2 mb-2"
                                            data-oid="om5n7tr"
                                        >
                                            <AlertCircle
                                                className="w-5 h-5 text-blue-600"
                                                data-oid="5gap3g1"
                                            />

                                            <span
                                                className="font-semibold text-blue-800"
                                                data-oid="76u0vod"
                                            >
                                                {entityType === 'pharmacy' ||
                                                entityType === 'vendor'
                                                    ? 'Collection Information'
                                                    : 'Payout Information'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-700" data-oid="id5-iux">
                                            {entityType === 'pharmacy' || entityType === 'vendor'
                                                ? 'Amount to collect'
                                                : 'Amount to pay'}
                                            :{' '}
                                            <span className="font-bold" data-oid="4jw4yet">
                                                {formatCurrency(entityData.pendingAmount || 0)}
                                            </span>
                                        </p>
                                        {(entityType === 'pharmacy' || entityType === 'vendor') && (
                                            <p className="text-sm text-blue-700" data-oid="23zqmpx">
                                                Payment method: {entityData.paymentMethod || 'Cash'}
                                            </p>
                                        )}
                                        {entityData.nextPayoutDate && (
                                            <p className="text-sm text-blue-700" data-oid="om7x9aj">
                                                Next scheduled{' '}
                                                {entityType === 'pharmacy' ||
                                                entityType === 'vendor'
                                                    ? 'collection'
                                                    : 'payout'}
                                                :{' '}
                                                {new Date(
                                                    entityData.nextPayoutDate ||
                                                        entityData.nextCollectionDate,
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-4" data-oid="yl:5:.a">
                                        <div data-oid="xah.4x3">
                                            <Label htmlFor="payout-amount" data-oid="sk02h_q">
                                                {entityType === 'pharmacy' ||
                                                entityType === 'vendor'
                                                    ? 'Collection Amount'
                                                    : 'Payout Amount'}
                                            </Label>
                                            <Input
                                                id="payout-amount"
                                                type="number"
                                                value={
                                                    payoutAmount || entityData.pendingAmount || ''
                                                }
                                                onChange={(e) => setPayoutAmount(e.target.value)}
                                                placeholder="Enter amount"
                                                data-oid="7n9kgbf"
                                            />
                                        </div>

                                        <div data-oid="-d1me88">
                                            <Label htmlFor="payout-method" data-oid="a0xbgmr">
                                                Payment Method
                                            </Label>
                                            <Select
                                                value={payoutMethod}
                                                onValueChange={setPayoutMethod}
                                                data-oid="l5nzhus"
                                            >
                                                <SelectTrigger data-oid="68e3zbe">
                                                    <SelectValue data-oid="kn8o1mi" />
                                                </SelectTrigger>
                                                <SelectContent data-oid="zsrp64_">
                                                    <SelectItem
                                                        value="bank_transfer"
                                                        data-oid="bbkp9re"
                                                    >
                                                        Bank Transfer
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="mobile_wallet"
                                                        data-oid="-kbn0ua"
                                                    >
                                                        Mobile Wallet
                                                    </SelectItem>
                                                    <SelectItem value="check" data-oid=".a0o3t5">
                                                        Check
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div data-oid="eogewdp">
                                            <Label htmlFor="payout-notes" data-oid="6.:6ie6">
                                                Notes (Optional)
                                            </Label>
                                            <Textarea
                                                id="payout-notes"
                                                value={payoutNotes}
                                                onChange={(e) => setPayoutNotes(e.target.value)}
                                                placeholder="Add any notes for this payout..."
                                                rows={3}
                                                data-oid="zoqt5e."
                                            />
                                        </div>
                                    </div>

                                    <Separator data-oid="s_okoy." />

                                    <div className="flex justify-end space-x-3" data-oid="7_ul:p3">
                                        <Button
                                            variant="outline"
                                            onClick={onClose}
                                            data-oid="x_h6:l1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleProcessPayout}
                                            disabled={isProcessing}
                                            className={
                                                entityType === 'pharmacy' || entityType === 'vendor'
                                                    ? 'bg-orange-600 hover:bg-orange-700'
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }
                                            data-oid=".1163:e"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Clock
                                                        className="w-4 h-4 mr-2 animate-spin"
                                                        data-oid="slm1s2s"
                                                    />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle
                                                        className="w-4 h-4 mr-2"
                                                        data-oid="3rt7au:"
                                                    />

                                                    {entityType === 'pharmacy' ||
                                                    entityType === 'vendor'
                                                        ? 'Collect Commission'
                                                        : 'Process Payout'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* No Pending Amount */}
                        {(entityData.pendingAmount || 0) === 0 && (
                            <Card data-oid="ooubv2l">
                                <CardContent className="p-6 text-center" data-oid="dz-e7rf">
                                    <CheckCircle
                                        className="w-12 h-12 text-green-500 mx-auto mb-4"
                                        data-oid="g9e1ge1"
                                    />

                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="u8g-4i2"
                                    >
                                        All Caught Up!
                                    </h3>
                                    <p className="text-gray-600" data-oid="z:3.mvj">
                                        No pending commission payments for this {entityType}.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
