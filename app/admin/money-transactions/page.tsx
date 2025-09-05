'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { moneyTransactionService } from '@/lib/services/moneyTransactionService';
import { pharmacyManagementService } from '@/lib/services/pharmacyManagementService';
import { providerOrderService } from '@/lib/services/vendorManagementService';
import { doctorManagementService } from '@/lib/services/doctorManagementService';
import { CommissionManagementModal } from '@/components/admin/CommissionManagementModal';
import { RefundManagementModal } from '@/components/admin/RefundManagementModal';
import { TransactionDetailsModal } from '@/components/admin/TransactionDetailsModal';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    User,
    Building,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    Eye,
    CheckCircle,
    Clock,
    AlertCircle,
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Plus,
    Settings,
} from 'lucide-react';

interface MoneyTransactionMetrics {
    totalRevenue: number;
    grossTransactionVolume: number;
    platformCommission: number;
    pharmacyCommissions: number;
    vendorCommissions: number;
    doctorCommissions: number;
    pendingRefunds: number;
    processedRefunds: number;
    pendingPayouts: number;
    completedPayouts: number;
    lastUpdated: string;
}

interface TransactionSummary {
    totalTransactions: number;
    totalAmount: number;
    pendingAmount: number;
    completedAmount: number;
    refundedAmount: number;
}

export default function MoneyTransactionsPage() {
    const [metrics, setMetrics] = useState<MoneyTransactionMetrics | null>(null);
    const [transactionSummary, setTransactionSummary] = useState<TransactionSummary | null>(null);
    const [allTransactions, setAllTransactions] = useState<any[]>([]);
    const [pharmacyCommissions, setPharmacyCommissions] = useState<any[]>([]);
    const [vendorCommissions, setVendorCommissions] = useState<any[]>([]);
    const [doctorCommissions, setDoctorCommissions] = useState<any[]>([]);
    const [refunds, setRefunds] = useState<any[]>([]);
    const [payoutSchedules, setPayoutSchedules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedCommission, setSelectedCommission] = useState<any>(null);
    const [selectedRefund, setSelectedRefund] = useState<any>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [commissionModalOpen, setCommissionModalOpen] = useState(false);
    const [refundModalOpen, setRefundModalOpen] = useState(false);
    const [transactionDetailsModalOpen, setTransactionDetailsModalOpen] = useState(false);
    const [refundStatusFilter, setRefundStatusFilter] = useState('all');
    const [refundSearchTerm, setRefundSearchTerm] = useState('');

    // Enhanced Schedule Dialog State
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [selectedEntityType, setSelectedEntityType] = useState<'pharmacy' | 'vendor' | 'doctor'>(
        'pharmacy',
    );
    const [selectedEntityId, setSelectedEntityId] = useState('');
    const [scheduleFrequency, setScheduleFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>(
        'monthly',
    );
    const [reminderDays, setReminderDays] = useState(3);
    const [scheduleNotes, setScheduleNotes] = useState('');
    const [availableEntities, setAvailableEntities] = useState<any[]>([]);

    // Edit schedule state
    const [editScheduleDialogOpen, setEditScheduleDialogOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

    useEffect(() => {
        loadTransactionData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPeriod]);

    const loadTransactionData = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const data = moneyTransactionService.getTransactionMetrics(selectedPeriod);
            const summary = moneyTransactionService.getTransactionSummary(selectedPeriod);
            const transactions = moneyTransactionService.getAllTransactions();
            const pharmacyComm = moneyTransactionService.getPharmacyCommissions();
            const vendorComm = moneyTransactionService.getVendorCommissions();
            const doctorComm = moneyTransactionService.getDoctorCommissions();
            const refundData = moneyTransactionService.getRefunds();
            const schedules = moneyTransactionService.getPayoutSchedules();

            setMetrics(data);
            setTransactionSummary(summary);
            setAllTransactions(transactions);
            setPharmacyCommissions(pharmacyComm);
            setVendorCommissions(vendorComm);
            setDoctorCommissions(doctorComm);
            setRefunds(refundData);
            setPayoutSchedules(schedules);
        } catch (error) {
            console.error('Error loading transaction data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load available entities based on selected type
    const loadAvailableEntities = async() => {
        let entities: any[] = [];

        if (selectedEntityType === 'pharmacy') {
            const pharmacies =await pharmacyManagementService.getPharmacies();
            const pharmacyCommissionData = moneyTransactionService.getPharmacyCommissions();

            entities = pharmacies.data.map((pharmacy) => {
                const commissionData = pharmacyCommissionData.find(
                    (pc) => pc.pharmacyId === pharmacy.id,
                );
                return {
                    id: pharmacy.id,
                    name: pharmacy.name,
                    pendingAmount: commissionData?.pendingAmount || 0,
                    city: pharmacy.cityName,
                    type: 'pharmacy' as const,
                };
            });
        } else if (selectedEntityType === 'vendor') {
            const vendors = await providerOrderService.getAllOrders();
            const vendorCommissionData = moneyTransactionService.getVendorCommissions();

            entities = vendors.data.map((vendor:any) => {
                const commissionData = vendorCommissionData.find((vc) => vc.vendorId === vendor.id);
                return {
                    id: vendor.id,
                    name: vendor.name,
                    pendingAmount: commissionData?.pendingAmount || 0,
                    city: vendor.cityName,
                    type: 'vendor' as const,
                };
            });
        } else if (selectedEntityType === 'doctor') {
            const doctors = doctorManagementService.getDoctors({ status: 'active' });
            const doctorCommissionData = moneyTransactionService.getDoctorCommissions();

            entities = doctors.map((doctor) => {
                const commissionData = doctorCommissionData.find((dc) => dc.doctorId === doctor.id);
                return {
                    id: doctor.id,
                    name: doctor.name,
                    pendingAmount: commissionData?.pendingAmount || 0,
                    specialization: doctor.specialization,
                    type: 'doctor' as const,
                };
            });
        }

        setAvailableEntities(entities);
    };

    // Calculate reminder alerts
    const getPayoutReminders = () => {
        const now = new Date();
        const reminders: any[] = [];

        payoutSchedules.forEach((schedule) => {
            const nextPayoutDate = new Date(schedule.nextPayout);
            const daysDiff = Math.ceil(
                (nextPayoutDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
            );

            let urgency = 'upcoming';
            if (daysDiff < 0) urgency = 'overdue';
            else if (daysDiff <= 3) urgency = 'due-soon';

            if (urgency !== 'upcoming' || daysDiff <= 7) {
                reminders.push({
                    ...schedule,
                    daysDiff,
                    urgency,
                    actionType: schedule.entityType === 'doctor' ? 'payout' : 'collection',
                });
            }
        });

        return reminders.sort((a, b) => a.daysDiff - b.daysDiff);
    };
    const handleCreateSchedule = () => {
        if (!selectedEntityId) return;

        const selectedEntity = availableEntities.find((e) => e.id === selectedEntityId);
        if (!selectedEntity) return;

        // Create new schedule (in real app, this would be an API call)
        const newSchedule = {
            id: `SCHED-${Date.now()}`,
            entityId: selectedEntityId,
            entityName: selectedEntity.name,
            entityType: selectedEntityType,
            frequency: scheduleFrequency,
            nextPayout: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            pendingAmount: selectedEntity.pendingAmount,
            status: 'active' as const,
            minimumAmount: 100,
            paymentMethod: 'bank_transfer' as const,
            createdAt: new Date().toISOString(),
            reminderDays,
            notes: scheduleNotes,
        };

        setPayoutSchedules((prev) => [...prev, newSchedule]);

        // Reset form
        setScheduleDialogOpen(false);
        setSelectedEntityType('pharmacy');
        setSelectedEntityId('');
        setScheduleFrequency('monthly');
        setReminderDays(3);
        setScheduleNotes('');
    };

    // Handle collect/pay action
    const handleCollectPay = (schedule: any) => {
        // Update schedule status to completed
        const updatedSchedules = payoutSchedules.map((s) =>
            s.id === schedule.id
                ? {
                      ...s,
                      status: 'completed',
                      pendingAmount: 0,
                      processedAt: new Date().toISOString(),
                  }
                : s,
        );
        setPayoutSchedules(updatedSchedules);
    };

    // Handle edit schedule
    const handleEditSchedule = (schedule: any) => {
        setSelectedSchedule(schedule);
        setSelectedEntityType(schedule.entityType);
        setSelectedEntityId(schedule.entityId);
        setScheduleFrequency(schedule.frequency);
        setReminderDays(schedule.reminderDays || 3);
        setScheduleNotes(schedule.notes || '');
        setEditScheduleDialogOpen(true);
    };

    // Handle update schedule
    const handleUpdateSchedule = () => {
        if (!selectedSchedule) return;

        const updatedSchedules = payoutSchedules.map((s) =>
            s.id === selectedSchedule.id
                ? {
                      ...s,
                      frequency: scheduleFrequency,
                      reminderDays,
                      notes: scheduleNotes,
                      updatedAt: new Date().toISOString(),
                  }
                : s,
        );
        setPayoutSchedules(updatedSchedules);

        // Reset form
        setEditScheduleDialogOpen(false);
        setSelectedSchedule(null);
        setSelectedEntityType('pharmacy');
        setSelectedEntityId('');
        setScheduleFrequency('monthly');
        setReminderDays(3);
        setScheduleNotes('');
    };

    // Handle delete schedule
    const handleDeleteSchedule = () => {
        if (!selectedSchedule) return;

        // Remove schedule from array
        const updatedSchedules = payoutSchedules.filter((s) => s.id !== selectedSchedule.id);
        setPayoutSchedules(updatedSchedules);

        // Close dialog and reset form
        setEditScheduleDialogOpen(false);
        setSelectedSchedule(null);
        setSelectedEntityType('pharmacy');
        setSelectedEntityId('');
        setScheduleFrequency('monthly');
        setReminderDays(3);
        setScheduleNotes('');
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            completed: { variant: 'default' as const, color: 'bg-green-500', label: 'Completed' },
            pending: { variant: 'secondary' as const, color: 'bg-yellow-500', label: 'Pending' },
            processing: { variant: 'outline' as const, color: 'bg-blue-500', label: 'Processing' },
            failed: { variant: 'destructive' as const, color: 'bg-red-500', label: 'Failed' },
            cancelled: { variant: 'outline' as const, color: 'bg-gray-500', label: 'Cancelled' },
            approved: { variant: 'default' as const, color: 'bg-green-500', label: 'Approved' },
            processed: { variant: 'default' as const, color: 'bg-green-600', label: 'Processed' },
            rejected: { variant: 'destructive' as const, color: 'bg-red-500', label: 'Rejected' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1" data-oid="qc30._.">
                <div className={`w-2 h-2 rounded-full ${config.color}`} data-oid="w6ds:38" />
                {config.label}
            </Badge>
        );
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <CreditCard className="w-4 h-4" data-oid="5v:di7t" />;
            case 'commission':
                return <DollarSign className="w-4 h-4" data-oid="euh71zx" />;
            case 'refund':
                return <ArrowDownRight className="w-4 h-4" data-oid="fb7g4rf" />;
            case 'payout':
                return <ArrowUpRight className="w-4 h-4" data-oid="b74w23l" />;
            default:
                return <Wallet className="w-4 h-4" data-oid="0oy6vgf" />;
        }
    };

    if (isLoading && !metrics) {
        return (
            <div className="space-y-6" data-oid="gn9hy:d">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="bv3eepk">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="-r9bdx1"
                        />
                    ))}
                </div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-96" data-oid="mws4_58" />
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="::q9dw_">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="h:v6ru_">
                <Card
                    className="bg-gradient-to-br from-[#1F1F6F] to-[#14274E] text-white"
                    data-oid="fth1ud1"
                >
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="42.dqn8"
                    >
                        <CardTitle className="text-sm font-medium opacity-90" data-oid="msa8caa">
                            Platform Net Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 opacity-90" data-oid="3vrdz_3" />
                    </CardHeader>
                    <CardContent data-oid="lvl9vnr">
                        <div className="text-2xl font-bold" data-oid="6d4-038">
                            {formatCurrency(metrics?.totalRevenue || 0)}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs opacity-90"
                            data-oid="c6fb5-."
                        >
                            <TrendingUp className="h-3 w-3" data-oid="q-8jpn8" />
                            <span data-oid="q2kg6vy">
                                Commission collected minus doctor payouts
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="9t.k19k">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="28pqn5u"
                    >
                        <CardTitle className="text-sm font-medium text-gray-600" data-oid="pt1czx4">
                            Commission to Collect
                        </CardTitle>
                        <Building className="h-4 w-4 text-gray-400" data-oid="fh:xg87" />
                    </CardHeader>
                    <CardContent data-oid="xbofs0y">
                        <div className="text-2xl font-bold text-orange-600" data-oid="l.5f03h">
                            {formatCurrency(
                                pharmacyCommissions.reduce((sum, p) => sum + p.pendingAmount, 0),
                            )}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs text-gray-600"
                            data-oid="kd4qbcg"
                        >
                            <Clock className="h-3 w-3 text-orange-500" data-oid="5-w:d5h" />
                            <span data-oid="qk6hsq4">
                                From {pharmacyCommissions.filter((p) => p.pendingAmount > 0).length}{' '}
                                pharmacies
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="1n03ksb">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="_iscafx"
                    >
                        <CardTitle className="text-sm font-medium text-gray-600" data-oid="g60zocd">
                            Doctor Payouts Due
                        </CardTitle>
                        <User className="h-4 w-4 text-gray-400" data-oid="v3qbil9" />
                    </CardHeader>
                    <CardContent data-oid="wwex7mh">
                        <div className="text-2xl font-bold text-red-600" data-oid="9p-9vs9">
                            {formatCurrency(
                                doctorCommissions.reduce((sum, d) => sum + d.pendingAmount, 0),
                            )}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs text-gray-600"
                            data-oid="9-sva99"
                        >
                            <AlertCircle className="h-3 w-3 text-red-500" data-oid="4.9bauz" />
                            <span data-oid="2zf-sp6">
                                You owe{' '}
                                {doctorCommissions.filter((d) => d.pendingAmount > 0).length}{' '}
                                doctors for referrals
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="w8j3xzj">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="mjchx2r"
                    >
                        <CardTitle className="text-sm font-medium text-gray-600" data-oid="9rq7jsq">
                            Pending Refunds
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-gray-400" data-oid="-ocqvt1" />
                    </CardHeader>
                    <CardContent data-oid="egn9.v2">
                        <div className="text-2xl font-bold text-gray-900" data-oid="g_4b_ej">
                            {formatCurrency(metrics?.pendingRefunds || 0)}
                        </div>
                        <div
                            className="flex items-center space-x-2 text-xs text-gray-600"
                            data-oid="p.:iuwk"
                        >
                            <Clock className="h-3 w-3 text-blue-500" data-oid="r.ge2nl" />
                            <span data-oid="0ny2sis">Awaiting approval</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6" data-oid="zz.pqzu">
                <TabsList className="grid w-full grid-cols-7" data-oid="5kpcmc8">
                    <TabsTrigger value="overview" data-oid="igv9::p">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="transactions" data-oid="30e.0xg">
                        All Transactions
                    </TabsTrigger>
                    <TabsTrigger value="pharmacy-commissions" data-oid="eas-cla">
                        Pharmacy Commissions
                    </TabsTrigger>
                    <TabsTrigger value="vendor-commissions" data-oid="lddmd3x">
                        Vendor Commissions
                    </TabsTrigger>
                    <TabsTrigger value="doctor-commissions" data-oid="tbt53ne">
                        Doctor Commissions
                    </TabsTrigger>
                    <TabsTrigger value="refunds" data-oid="huvw88h">
                        Refunds
                    </TabsTrigger>
                    <TabsTrigger value="payout-schedules" data-oid="5.u7gyo">
                        Payout Schedules
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6" data-oid="kn.yyh_">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="actdtlk">
                        {/* Transaction Summary */}
                        <Card data-oid="w4fiypz">
                            <CardHeader data-oid="s39g1ut">
                                <CardTitle data-oid="vxwrg79">Transaction Summary</CardTitle>
                                <CardDescription data-oid="2v:khbp">
                                    Overview of all financial activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="c9mjtkk">
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="atsaimy"
                                >
                                    <span className="text-sm text-gray-600" data-oid="635_:lj">
                                        Total Transactions
                                    </span>
                                    <span className="font-semibold" data-oid="nxp6f2i">
                                        {transactionSummary?.totalTransactions || 0}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="tw-z3k2"
                                >
                                    <span className="text-sm text-gray-600" data-oid="hhpk.r7">
                                        Total Amount
                                    </span>
                                    <span className="font-semibold" data-oid="qg.dqri">
                                        {formatCurrency(transactionSummary?.totalAmount || 0)}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="m4t8gmz"
                                >
                                    <span className="text-sm text-gray-600" data-oid="t421hbj">
                                        Completed
                                    </span>
                                    <span
                                        className="font-semibold text-green-600"
                                        data-oid="05_879x"
                                    >
                                        {formatCurrency(transactionSummary?.completedAmount || 0)}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="1cfzgt_"
                                >
                                    <span className="text-sm text-gray-600" data-oid="e5rurq1">
                                        Pending
                                    </span>
                                    <span
                                        className="font-semibold text-orange-600"
                                        data-oid="96_1.3v"
                                    >
                                        {formatCurrency(transactionSummary?.pendingAmount || 0)}
                                    </span>
                                </div>
                                <div
                                    className="flex justify-between items-center"
                                    data-oid="l22anr5"
                                >
                                    <span className="text-sm text-gray-600" data-oid="l6abqcv">
                                        Refunded
                                    </span>
                                    <span className="font-semibold text-red-600" data-oid=":-3:1zv">
                                        {formatCurrency(transactionSummary?.refundedAmount || 0)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Commission Breakdown */}
                        <Card data-oid="ow7p9sy">
                            <CardHeader data-oid="3xaydsp">
                                <CardTitle data-oid="t9am-s9">
                                    Commission Collection Status
                                </CardTitle>
                                <CardDescription data-oid="eizsolw">
                                    Track commission collection from pharmacies and doctor payouts
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="gvy_upp">
                                <div data-oid="dltnk4d">
                                    <div
                                        className="flex justify-between items-center mb-2"
                                        data-oid="3f7ny4g"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="bqdy64h">
                                            Pending Collection from Pharmacies
                                        </span>
                                        <span
                                            className="font-semibold text-orange-600"
                                            data-oid="xc7xz7:"
                                        >
                                            {formatCurrency(
                                                pharmacyCommissions.reduce(
                                                    (sum, p) => sum + p.pendingAmount,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                    <Progress value={65} className="h-2" data-oid="z72_3d5" />
                                    <p className="text-xs text-gray-500 mt-1" data-oid="a1deo-g">
                                        Commission you need to collect from pharmacies
                                    </p>
                                </div>
                                <div data-oid="p0.33u.">
                                    <div
                                        className="flex justify-between items-center mb-2"
                                        data-oid="_-x337-"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="31pvp._">
                                            Pending Collection from Vendors
                                        </span>
                                        <span
                                            className="font-semibold text-purple-600"
                                            data-oid="lm-3303"
                                        >
                                            {formatCurrency(
                                                vendorCommissions.reduce(
                                                    (sum, v) => sum + v.pendingAmount,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                    <Progress value={45} className="h-2" data-oid=":ra8vcm" />

                                    <p className="text-xs text-gray-500 mt-1" data-oid="ybaa:b7">
                                        Commission you need to collect from vendors
                                    </p>
                                </div>
                                <div data-oid="52j:6t-">
                                    <div
                                        className="flex justify-between items-center mb-2"
                                        data-oid="e6la96o"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="3b.6o56">
                                            Pending Doctor Payouts
                                        </span>
                                        <span
                                            className="font-semibold text-red-600"
                                            data-oid="4t3i3zu"
                                        >
                                            {formatCurrency(
                                                doctorCommissions.reduce(
                                                    (sum, d) => sum + d.pendingAmount,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                    <Progress value={25} className="h-2" data-oid="02oqfgx" />
                                    <p className="text-xs text-gray-500 mt-1" data-oid="5s2ktb.">
                                        Commission you owe doctors for successful referrals
                                    </p>
                                </div>
                                <div data-oid="9sfsw4:">
                                    <div
                                        className="flex justify-between items-center mb-2"
                                        data-oid="8jx_7q9"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="drg4d7g">
                                            Platform Revenue (Collected)
                                        </span>
                                        <span
                                            className="font-semibold text-green-600"
                                            data-oid="mkziu7_"
                                        >
                                            {formatCurrency(metrics?.platformCommission || 0)}
                                        </span>
                                    </div>
                                    <Progress value={85} className="h-2" data-oid="inh_dh2" />
                                    <p className="text-xs text-gray-500 mt-1" data-oid="wjt2vsl">
                                        Commission already collected from pharmacies
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Transactions */}
                    <Card data-oid="3nn2zy3">
                        <CardHeader data-oid="fs8t.cj">
                            <CardTitle data-oid="7j1i3ft">Recent Transactions</CardTitle>
                            <CardDescription data-oid="t93dh:5">
                                Latest financial activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="5rb_2xo">
                            <div className="space-y-4" data-oid="jg819rw">
                                {allTransactions.slice(0, 10).map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                        data-oid="cfh_4nw"
                                    >
                                        <div
                                            className="flex items-center space-x-4"
                                            data-oid="rp4l4eg"
                                        >
                                            <div
                                                className="p-2 bg-gray-100 rounded-lg"
                                                data-oid="kknmm0f"
                                            >
                                                {getTypeIcon(transaction.type)}
                                            </div>
                                            <div data-oid="sis70ah">
                                                <p className="font-medium" data-oid="cxbab59">
                                                    {transaction.description}
                                                </p>
                                                <p
                                                    className="text-sm text-gray-500"
                                                    data-oid="cp57r0m"
                                                >
                                                    {transaction.reference}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right" data-oid="_rv7tg3">
                                            <p className="font-semibold" data-oid="..ow-t2">
                                                {formatCurrency(transaction.amount)}
                                            </p>
                                            {getStatusBadge(transaction.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* All Transactions Tab */}
                <TabsContent value="transactions" className="space-y-6" data-oid="y2t3.ab">
                    <Card data-oid="k8if_45">
                        <CardHeader data-oid="ydtn_8c">
                            <div className="flex items-center justify-between" data-oid="78j1qtq">
                                <div data-oid="qw257vb">
                                    <CardTitle data-oid="y.1odz-">All Transactions</CardTitle>
                                    <CardDescription data-oid="9jof2_-">
                                        Complete transaction history
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-4" data-oid="2.r4vlg">
                                    <div className="relative" data-oid="fm7v50t">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                            data-oid="-x5hahm"
                                        />

                                        <Input
                                            placeholder="Search transactions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-64"
                                            data-oid="b-n8t7."
                                        />
                                    </div>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                        data-oid="9ryu0k_"
                                    >
                                        <SelectTrigger className="w-32" data-oid="5.bb8a-">
                                            <SelectValue data-oid="hx0.6ro" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="5pgc1ls">
                                            <SelectItem value="all" data-oid="ve84f.8">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="completed" data-oid="cy8o8aq">
                                                Completed
                                            </SelectItem>
                                            <SelectItem value="pending" data-oid="vn4t2y-">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="failed" data-oid="533d1-s">
                                                Failed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={typeFilter}
                                        onValueChange={setTypeFilter}
                                        data-oid="l_qlz.w"
                                    >
                                        <SelectTrigger className="w-32" data-oid="it2p7id">
                                            <SelectValue data-oid="1nu8pzy" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="8.iiyfw">
                                            <SelectItem value="all" data-oid="wenwhy2">
                                                All Types
                                            </SelectItem>
                                            <SelectItem value="order" data-oid="ip.jqe2">
                                                Orders
                                            </SelectItem>
                                            <SelectItem value="commission" data-oid="aolfi:a">
                                                Commissions
                                            </SelectItem>
                                            <SelectItem value="refund" data-oid="lffvr-9">
                                                Refunds
                                            </SelectItem>
                                            <SelectItem value="payout" data-oid="a13ay05">
                                                Payouts
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent data-oid="4monz09">
                            <Table data-oid="uxoap-e">
                                <TableHeader data-oid="u7_y5ff">
                                    <TableRow data-oid="hsc40lu">
                                        <TableHead data-oid="973rsvd">Transaction ID</TableHead>
                                        <TableHead data-oid="pctat9p">Type</TableHead>
                                        <TableHead data-oid="3mhs.2d">Description</TableHead>
                                        <TableHead data-oid="85sks6h">Amount</TableHead>
                                        <TableHead data-oid="1:_-p70">Status</TableHead>
                                        <TableHead data-oid="eyw6ly9">Date</TableHead>
                                        <TableHead data-oid="lx2nusr">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="na:d9l3">
                                    {allTransactions
                                        .filter(
                                            (t) =>
                                                (statusFilter === 'all' ||
                                                    t.status === statusFilter) &&
                                                (typeFilter === 'all' || t.type === typeFilter) &&
                                                (searchTerm === '' ||
                                                    t.description
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase()) ||
                                                    t.reference
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase())),
                                        )
                                        .slice(0, 20)
                                        .map((transaction) => (
                                            <TableRow key={transaction.id} data-oid="03.xqot">
                                                <TableCell
                                                    className="font-mono text-sm"
                                                    data-oid="jmgz5v2"
                                                >
                                                    {transaction.id}
                                                </TableCell>
                                                <TableCell data-oid="8snumdp">
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="svugyef"
                                                    >
                                                        {getTypeIcon(transaction.type)}
                                                        <span
                                                            className="capitalize"
                                                            data-oid="h2w5r7i"
                                                        >
                                                            {transaction.type}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell data-oid="elcy1w2">
                                                    {transaction.description}
                                                </TableCell>
                                                <TableCell
                                                    className="font-semibold"
                                                    data-oid="zt8.v1h"
                                                >
                                                    {formatCurrency(transaction.amount)}
                                                </TableCell>
                                                <TableCell data-oid="h-1kyg:">
                                                    {getStatusBadge(transaction.status)}
                                                </TableCell>
                                                <TableCell data-oid="hf:sxqf">
                                                    {new Date(
                                                        transaction.createdAt,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell data-oid=".wcd7i9">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedTransaction(transaction);
                                                            setTransactionDetailsModalOpen(true);
                                                        }}
                                                        data-oid="kwwhkkj"
                                                    >
                                                        <Eye
                                                            className="w-4 h-4"
                                                            data-oid="-1-11:s"
                                                        />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pharmacy Commissions Tab */}
                <TabsContent value="pharmacy-commissions" className="space-y-6" data-oid="jvoe9cr">
                    <Card data-oid="osdu:el">
                        <CardHeader data-oid="6e08xq-">
                            <CardTitle data-oid="g228uwk">Pharmacy Commission Collection</CardTitle>
                            <CardDescription data-oid="24obz0k">
                                Track commission collection from pharmacies (money they owe you)
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="rgc87xa">
                            <Table data-oid="3aho3t9">
                                <TableHeader data-oid="w8lm14m">
                                    <TableRow data-oid="0tpwa1f">
                                        <TableHead data-oid="vfj2ri-">Pharmacy</TableHead>
                                        <TableHead data-oid="ln195ir">Commission Rate</TableHead>
                                        <TableHead data-oid="ewertix">Total Cash Sales</TableHead>
                                        <TableHead data-oid="nziqqu4">Commission Owed</TableHead>
                                        <TableHead data-oid="b63khe1">Last Collection</TableHead>
                                        <TableHead data-oid="5mjtwl6">Pending Collection</TableHead>
                                        <TableHead data-oid="p7czop1">Collection Status</TableHead>
                                        <TableHead data-oid="x8iurey">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="5fji07n">
                                    {pharmacyCommissions.map((pharmacy) => (
                                        <TableRow key={pharmacy.id} data-oid="qmf958o">
                                            <TableCell data-oid="vxnuqa9">
                                                <div data-oid="qe8rf1q">
                                                    <p className="font-medium" data-oid="zdu4.qk">
                                                        {pharmacy.name}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-500"
                                                        data-oid=":_it1f_"
                                                    >
                                                        {pharmacy.city}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="73hw6o.">
                                                {pharmacy.commissionRate}%
                                            </TableCell>
                                            <TableCell className="font-semibold" data-oid="dm-o4ye">
                                                {formatCurrency(pharmacy.totalSales)}
                                                <p
                                                    className="text-xs text-gray-500"
                                                    data-oid="3ux5pgj"
                                                >
                                                    Cash received by pharmacy
                                                </p>
                                            </TableCell>
                                            <TableCell className="font-semibold" data-oid="mcef35y">
                                                {formatCurrency(pharmacy.commissionOwed)}
                                                <p
                                                    className="text-xs text-gray-500"
                                                    data-oid="a:vh14a"
                                                >
                                                    Total they owe you
                                                </p>
                                            </TableCell>
                                            <TableCell data-oid="m8:fkvb">
                                                {pharmacy.lastCollection
                                                    ? new Date(
                                                          pharmacy.lastCollection,
                                                      ).toLocaleDateString()
                                                    : 'Never'}
                                            </TableCell>
                                            <TableCell
                                                className="font-semibold text-orange-600"
                                                data-oid="9hwp7:o"
                                            >
                                                {formatCurrency(pharmacy.pendingAmount)}
                                            </TableCell>
                                            <TableCell data-oid="bhdk:lg">
                                                {getStatusBadge(pharmacy.collectionStatus)}
                                            </TableCell>
                                            <TableCell data-oid="k3db4k7">
                                                <div className="flex space-x-2" data-oid="vi3z-9d">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Create a transaction object for pharmacy commission
                                                            const transactionData = {
                                                                id: `PCOM-${pharmacy.id}`,
                                                                type: 'commission',
                                                                subType: 'pharmacy_commission',
                                                                amount: pharmacy.pendingAmount,
                                                                currency: 'EGP',
                                                                description: `Pending commission collection from ${pharmacy.name}`,
                                                                reference: pharmacy.id,
                                                                entityId: pharmacy.pharmacyId,
                                                                entityType: 'pharmacy',
                                                                entityName: pharmacy.name,
                                                                status: pharmacy.collectionStatus,
                                                                createdAt:
                                                                    pharmacy.lastCollection ||
                                                                    new Date().toISOString(),
                                                                metadata: {
                                                                    commissionRate:
                                                                        pharmacy.commissionRate,
                                                                    totalSales: pharmacy.totalSales,
                                                                    commissionOwed:
                                                                        pharmacy.commissionOwed,
                                                                    collectionFrequency:
                                                                        pharmacy.collectionFrequency,
                                                                    nextCollectionDate:
                                                                        pharmacy.nextCollectionDate,
                                                                    paymentMethod:
                                                                        pharmacy.paymentMethod,
                                                                    city: pharmacy.city,
                                                                    totalOrders:
                                                                        pharmacy.totalOrders,
                                                                    averageOrderValue:
                                                                        pharmacy.averageOrderValue,
                                                                },
                                                            };
                                                            setSelectedTransaction(transactionData);
                                                            setTransactionDetailsModalOpen(true);
                                                        }}
                                                        data-oid="8y2p_si"
                                                    >
                                                        <Eye
                                                            className="w-4 h-4"
                                                            data-oid="6ee-xzr"
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedCommission(pharmacy);
                                                            setCommissionModalOpen(true);
                                                        }}
                                                        data-oid="wliaxpm"
                                                    >
                                                        Manage
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Vendor Commissions Tab */}
                <TabsContent value="vendor-commissions" className="space-y-6" data-oid="b2511ut">
                    <Card data-oid=":hkbrlt">
                        <CardHeader data-oid="a.xu0y:">
                            <CardTitle data-oid="o51qbcp">Vendor Commission Collection</CardTitle>
                            <CardDescription data-oid="af2zd39">
                                Track commission collection from vendors (money they owe you)
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="13q0zof">
                            <Table data-oid="vefdf35">
                                <TableHeader data-oid="dclsiox">
                                    <TableRow data-oid="amoo14y">
                                        <TableHead data-oid="rx:agka">Vendor</TableHead>
                                        <TableHead data-oid="yy6aiuk">Category</TableHead>
                                        <TableHead data-oid="vxvggzu">Commission Rate</TableHead>
                                        <TableHead data-oid="ukkw6ks">Total Cash Sales</TableHead>
                                        <TableHead data-oid="a5.-i7d">Commission Owed</TableHead>
                                        <TableHead data-oid="txh4v2-">Last Collection</TableHead>
                                        <TableHead data-oid="d53hw5i">Pending Collection</TableHead>
                                        <TableHead data-oid="8klx8-7">Collection Status</TableHead>
                                        <TableHead data-oid="h4v0b_7">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="9wae2mn">
                                    {vendorCommissions.map((vendor) => (
                                        <TableRow key={vendor.id} data-oid="mny4kgc">
                                            <TableCell data-oid="lm-cp_b">
                                                <div data-oid="nobt0c.">
                                                    <p className="font-medium" data-oid="woh78e-">
                                                        {vendor.name}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-500"
                                                        data-oid="evs1v1."
                                                    >
                                                        {vendor.city}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="i_.bg_:">
                                                {vendor.category}
                                            </TableCell>
                                            <TableCell data-oid="9oukwvv">
                                                {vendor.commissionRate}%
                                            </TableCell>
                                            <TableCell className="font-semibold" data-oid="o_tm2k6">
                                                {formatCurrency(vendor.totalSales)}
                                                <p
                                                    className="text-xs text-gray-500"
                                                    data-oid="55fvefh"
                                                >
                                                    Cash received by vendor
                                                </p>
                                            </TableCell>
                                            <TableCell className="font-semibold" data-oid="mx0zfmb">
                                                {formatCurrency(vendor.commissionOwed)}
                                                <p
                                                    className="text-xs text-gray-500"
                                                    data-oid="glb4lby"
                                                >
                                                    Total they owe you
                                                </p>
                                            </TableCell>
                                            <TableCell data-oid="muqr4h6">
                                                {vendor.lastCollection
                                                    ? new Date(
                                                          vendor.lastCollection,
                                                      ).toLocaleDateString()
                                                    : 'Never'}
                                            </TableCell>
                                            <TableCell
                                                className="font-semibold text-orange-600"
                                                data-oid="546jeiy"
                                            >
                                                {formatCurrency(vendor.pendingAmount)}
                                            </TableCell>
                                            <TableCell data-oid="zwi5g2w">
                                                {getStatusBadge(vendor.collectionStatus)}
                                            </TableCell>
                                            <TableCell data-oid="vglm.cw">
                                                <div className="flex space-x-2" data-oid="3_wqfpe">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Create a transaction object for vendor commission
                                                            const transactionData = {
                                                                id: `VCOM-${vendor.id}`,
                                                                type: 'commission',
                                                                subType: 'vendor_commission',
                                                                amount: vendor.pendingAmount,
                                                                currency: 'EGP',
                                                                description: `Pending commission collection from ${vendor.name}`,
                                                                reference: vendor.id,
                                                                entityId: vendor.vendorId,
                                                                entityType: 'vendor',
                                                                entityName: vendor.name,
                                                                status: vendor.collectionStatus,
                                                                createdAt:
                                                                    vendor.lastCollection ||
                                                                    new Date().toISOString(),
                                                                metadata: {
                                                                    commissionRate:
                                                                        vendor.commissionRate,
                                                                    totalSales: vendor.totalSales,
                                                                    commissionOwed:
                                                                        vendor.commissionOwed,
                                                                    collectionFrequency:
                                                                        vendor.collectionFrequency,
                                                                    nextCollectionDate:
                                                                        vendor.nextCollectionDate,
                                                                    paymentMethod:
                                                                        vendor.paymentMethod,
                                                                    city: vendor.city,
                                                                    category: vendor.category,
                                                                    totalOrders: vendor.totalOrders,
                                                                    averageOrderValue:
                                                                        vendor.averageOrderValue,
                                                                },
                                                            };
                                                            setSelectedTransaction(transactionData);
                                                            setTransactionDetailsModalOpen(true);
                                                        }}
                                                        data-oid="0s19kak"
                                                    >
                                                        <Eye
                                                            className="w-4 h-4"
                                                            data-oid="09m49o2"
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedCommission(vendor);
                                                            setCommissionModalOpen(true);
                                                        }}
                                                        data-oid="ft_vft6"
                                                    >
                                                        Manage
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Doctor Commissions Tab */}
                <TabsContent value="doctor-commissions" className="space-y-6" data-oid="-3:9-ml">
                    <Card data-oid="55a1t5x">
                        <CardHeader data-oid="d9c7e84">
                            <CardTitle data-oid="1qhau0h">Doctor Commission Payouts</CardTitle>
                            <CardDescription data-oid="yksn1o2">
                                Track commission payments you need to make to doctors for successful
                                referrals
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="wrtz:ez">
                            <Table data-oid="2ghibza">
                                <TableHeader data-oid="m7e-hc6">
                                    <TableRow data-oid="f6-2uef">
                                        <TableHead data-oid="sn58.7t">Doctor</TableHead>
                                        <TableHead data-oid="5:lbjj2">Specialization</TableHead>
                                        <TableHead data-oid="sl00735">Total Referrals</TableHead>
                                        <TableHead data-oid="tecqliu">
                                            First Orders (Successful)
                                        </TableHead>
                                        <TableHead data-oid="prje16s">Commission Rate</TableHead>
                                        <TableHead data-oid="wms23l1">
                                            Total Commission Earned
                                        </TableHead>
                                        <TableHead data-oid="vabg4ek">
                                            Amount You Owe Doctor
                                        </TableHead>
                                        <TableHead data-oid="4dvyra2">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="hsl_.kh">
                                    {doctorCommissions.map((doctor) => (
                                        <TableRow key={doctor.id} data-oid="1xesdwm">
                                            <TableCell data-oid="1_fgd.y">
                                                <div data-oid="1wz9q3.">
                                                    <p className="font-medium" data-oid="kwd42va">
                                                        {doctor.name}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-500"
                                                        data-oid="lckc4g7"
                                                    >
                                                        {doctor.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="tdomsj8">
                                                {doctor.specialization}
                                            </TableCell>
                                            <TableCell data-oid="-:p_u-f">
                                                {doctor.totalReferrals}
                                            </TableCell>
                                            <TableCell data-oid="bsq0f3t">
                                                {doctor.successfulOrders}
                                            </TableCell>
                                            <TableCell data-oid="fkysi6p">
                                                {doctor.commissionRate}%
                                            </TableCell>
                                            <TableCell className="font-semibold" data-oid="s3dn9-a">
                                                {formatCurrency(doctor.commissionEarned)}
                                                <p
                                                    className="text-xs text-gray-500"
                                                    data-oid="zz-7wdx"
                                                >
                                                    Total earned from referrals
                                                </p>
                                            </TableCell>
                                            <TableCell
                                                className="font-semibold text-red-600"
                                                data-oid="m7e8z.b"
                                            >
                                                {formatCurrency(doctor.pendingAmount)}
                                                <p
                                                    className="text-xs text-gray-500"
                                                    data-oid="_bxcds4"
                                                >
                                                    Amount you need to pay
                                                </p>
                                            </TableCell>
                                            <TableCell data-oid="8to9300">
                                                <div className="flex space-x-2" data-oid="kxi832h">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Create a transaction object for doctor commission
                                                            const transactionData = {
                                                                id: `DCOM-${doctor.id}`,
                                                                type: 'payout',
                                                                subType: 'doctor_commission',
                                                                amount: doctor.pendingAmount,
                                                                currency: 'EGP',
                                                                description: `Commission payout due to ${doctor.name} for ${doctor.successfulOrders} successful referrals`,
                                                                reference: `DR-REF-${doctor.id}`,
                                                                entityId: doctor.doctorId,
                                                                entityType: 'doctor',
                                                                entityName: doctor.name,
                                                                status: doctor.payoutStatus,
                                                                createdAt:
                                                                    doctor.lastPayout ||
                                                                    new Date().toISOString(),
                                                                metadata: {
                                                                    commissionRate: `${doctor.commissionRate}% per successful first order`,
                                                                    totalReferrals: `${doctor.totalReferrals} customers referred`,
                                                                    successfulOrders: `${doctor.successfulOrders} first orders completed`,
                                                                    conversionRate: `${doctor.conversionRate}% conversion rate`,
                                                                    totalCommissionEarned:
                                                                        doctor.commissionEarned,
                                                                    payoutFrequency:
                                                                        doctor.payoutFrequency,
                                                                    nextPayoutDate:
                                                                        doctor.nextPayoutDate,
                                                                    specialization:
                                                                        doctor.specialization,
                                                                    email: doctor.email,
                                                                    businessModel:
                                                                        'Doctor refers customers → Customer makes first order → Doctor earns commission → You pay doctor from your collected commission',
                                                                },
                                                            };
                                                            setSelectedTransaction(transactionData);
                                                            setTransactionDetailsModalOpen(true);
                                                        }}
                                                        data-oid="5cf1tb1"
                                                    >
                                                        <Eye
                                                            className="w-4 h-4"
                                                            data-oid="53dti_9"
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedCommission(doctor);
                                                            setCommissionModalOpen(true);
                                                        }}
                                                        data-oid="ij:jwgh"
                                                    >
                                                        Manage
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Refunds Tab */}
                <TabsContent value="refunds" className="space-y-6" data-oid="bevbbnj">
                    <Card data-oid="0w5bmnb">
                        <CardHeader data-oid="mqk.0s_">
                            <div className="flex items-center justify-between" data-oid="cfnw_u9">
                                <div data-oid="qtof9p3">
                                    <CardTitle data-oid="yt7pc21">Refunds Management</CardTitle>
                                    <CardDescription data-oid="oshiqpa">
                                        Track and manage customer refunds
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-4" data-oid="w.3nqy1">
                                    <div className="relative" data-oid="zv7tm4g">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                            data-oid="fanuq5l"
                                        />

                                        <Input
                                            placeholder="Search refunds..."
                                            value={refundSearchTerm}
                                            onChange={(e) => setRefundSearchTerm(e.target.value)}
                                            className="pl-10 w-64"
                                            data-oid="mpe8.67"
                                        />
                                    </div>
                                    <Select
                                        value={refundStatusFilter}
                                        onValueChange={setRefundStatusFilter}
                                        data-oid="-4qh1lf"
                                    >
                                        <SelectTrigger className="w-40" data-oid="o6w9tlm">
                                            <SelectValue data-oid="tax6sus" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="6_ze1pa">
                                            <SelectItem value="all" data-oid="so9okml">
                                                All Refunds
                                            </SelectItem>
                                            <SelectItem value="pending" data-oid="b-39czb">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="approved" data-oid="8pc0wiy">
                                                Approved
                                            </SelectItem>
                                            <SelectItem value="processed" data-oid="lzao9p1">
                                                Processed
                                            </SelectItem>
                                            <SelectItem value="rejected" data-oid="o4-8kb3">
                                                Rejected
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent data-oid="xvsyhjp">
                            {/* Refund Summary Cards */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
                                data-oid="dewu9zp"
                            >
                                <Card className="p-4" data-oid="-wgjb92">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="fgta4mb"
                                    >
                                        <div data-oid="5l9yz.b">
                                            <p
                                                className="text-sm font-medium text-gray-600"
                                                data-oid="i8w-u0p"
                                            >
                                                Total Refunds
                                            </p>
                                            <p className="text-2xl font-bold" data-oid="s9nth0c">
                                                {refunds.length}
                                            </p>
                                        </div>
                                        <div
                                            className="p-2 bg-blue-100 rounded-lg"
                                            data-oid="joo:y9s"
                                        >
                                            <ArrowDownRight
                                                className="w-5 h-5 text-blue-600"
                                                data-oid="no_6om6"
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-4" data-oid="ic5vw7q">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="ibgudl5"
                                    >
                                        <div data-oid="h:v6z-:">
                                            <p
                                                className="text-sm font-medium text-gray-600"
                                                data-oid=":5d1d9u"
                                            >
                                                Pending
                                            </p>
                                            <p
                                                className="text-2xl font-bold text-yellow-600"
                                                data-oid="ol_coc:"
                                            >
                                                {
                                                    refunds.filter((r) => r.status === 'pending')
                                                        .length
                                                }
                                            </p>
                                        </div>
                                        <div
                                            className="p-2 bg-yellow-100 rounded-lg"
                                            data-oid="96lmb.b"
                                        >
                                            <Clock
                                                className="w-5 h-5 text-yellow-600"
                                                data-oid="of3:-o4"
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-4" data-oid="4h6nl._">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="p56g175"
                                    >
                                        <div data-oid="eix0_k1">
                                            <p
                                                className="text-sm font-medium text-gray-600"
                                                data-oid="srtnv_u"
                                            >
                                                Completed
                                            </p>
                                            <p
                                                className="text-2xl font-bold text-green-600"
                                                data-oid="7yd:7ge"
                                            >
                                                {
                                                    refunds.filter(
                                                        (r) =>
                                                            r.status === 'approved' ||
                                                            r.status === 'processed',
                                                    ).length
                                                }
                                            </p>
                                        </div>
                                        <div
                                            className="p-2 bg-green-100 rounded-lg"
                                            data-oid="4c8ed:8"
                                        >
                                            <CheckCircle
                                                className="w-5 h-5 text-green-600"
                                                data-oid="8d_sar7"
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-4" data-oid="tgbrjhl">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="jkvmez7"
                                    >
                                        <div data-oid="pgdd0ox">
                                            <p
                                                className="text-sm font-medium text-gray-600"
                                                data-oid="bccitin"
                                            >
                                                Total Amount
                                            </p>
                                            <p className="text-2xl font-bold" data-oid=".6whcsf">
                                                {formatCurrency(
                                                    refunds.reduce((sum, r) => sum + r.amount, 0),
                                                )}
                                            </p>
                                        </div>
                                        <div
                                            className="p-2 bg-gray-100 rounded-lg"
                                            data-oid="l7smgrd"
                                        >
                                            <DollarSign
                                                className="w-5 h-5 text-gray-600"
                                                data-oid="8it_c_h"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <Table data-oid="y.czb5n">
                                <TableHeader data-oid="pe8:9oq">
                                    <TableRow data-oid="tr-1ioy">
                                        <TableHead data-oid="9uamoz4">Order ID</TableHead>
                                        <TableHead data-oid="mgizcsi">Customer</TableHead>
                                        <TableHead data-oid="yd:u40i">Refund Amount</TableHead>
                                        <TableHead data-oid=":ukvlhk">Reason</TableHead>
                                        <TableHead data-oid=":fuj2o9">Status</TableHead>
                                        <TableHead data-oid="5_l0owc">Requested Date</TableHead>
                                        <TableHead data-oid="bqmlqr4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="iuy80w3">
                                    {refunds
                                        .filter((refund) => {
                                            const matchesStatus =
                                                refundStatusFilter === 'all' ||
                                                refund.status === refundStatusFilter;
                                            const matchesSearch =
                                                refundSearchTerm === '' ||
                                                refund.orderId
                                                    .toLowerCase()
                                                    .includes(refundSearchTerm.toLowerCase()) ||
                                                refund.customerName
                                                    .toLowerCase()
                                                    .includes(refundSearchTerm.toLowerCase()) ||
                                                refund.customerEmail
                                                    .toLowerCase()
                                                    .includes(refundSearchTerm.toLowerCase()) ||
                                                refund.reason
                                                    .toLowerCase()
                                                    .includes(refundSearchTerm.toLowerCase());
                                            return matchesStatus && matchesSearch;
                                        })
                                        .map((refund) => (
                                            <TableRow key={refund.id} data-oid="0fpujrm">
                                                <TableCell className="font-mono" data-oid="ou0itfi">
                                                    {refund.orderId}
                                                </TableCell>
                                                <TableCell data-oid=".6.w9v2">
                                                    <div data-oid="lcd952u">
                                                        <p
                                                            className="font-medium"
                                                            data-oid="tn2x3d8"
                                                        >
                                                            {refund.customerName}
                                                        </p>
                                                        <p
                                                            className="text-sm text-gray-500"
                                                            data-oid="c0a9efo"
                                                        >
                                                            {refund.customerEmail}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    className="font-semibold"
                                                    data-oid="yd:n_qb"
                                                >
                                                    {formatCurrency(refund.amount)}
                                                </TableCell>
                                                <TableCell data-oid="a1w:_2t">
                                                    {refund.reason}
                                                </TableCell>
                                                <TableCell data-oid="dyaf6pw">
                                                    {getStatusBadge(refund.status)}
                                                </TableCell>
                                                <TableCell data-oid="-wgfqzt">
                                                    {new Date(
                                                        refund.requestedAt,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell data-oid="w60w_l.">
                                                    <div
                                                        className="flex space-x-2"
                                                        data-oid="z84s9p5"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRefund(refund);
                                                                setRefundModalOpen(true);
                                                            }}
                                                            data-oid="a2z:w.9"
                                                        >
                                                            <Eye
                                                                className="w-4 h-4"
                                                                data-oid="kx7:b_b"
                                                            />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payout Schedules Tab */}
                <TabsContent value="payout-schedules" className="space-y-6" data-oid=".wdqt13">
                    <Card data-oid="hs93roj">
                        <CardHeader data-oid="76-8.1d">
                            <div className="flex items-center justify-between" data-oid="y9dim5s">
                                <div data-oid="t7c78kh">
                                    <CardTitle data-oid="w:u.uh1">Payout Schedules</CardTitle>
                                    <CardDescription data-oid="ydv9y96">
                                        Schedule when to collect commission from pharmacies/vendors
                                        or pay commissions to doctors
                                    </CardDescription>
                                </div>
                                <Dialog
                                    open={scheduleDialogOpen}
                                    onOpenChange={setScheduleDialogOpen}
                                    data-oid="srdkbzk"
                                >
                                    <DialogTrigger asChild data-oid="ulx:3sh">
                                        <Button
                                            className="bg-[#14274E] hover:bg-[#394867]"
                                            data-oid="2dag7l5"
                                        >
                                            <Plus className="w-4 h-4 mr-2" data-oid="xf6rl.q" />
                                            Add Schedule
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl" data-oid="wn9stvv">
                                        <DialogHeader data-oid="pwe0501">
                                            <DialogTitle data-oid="8bmanjc">
                                                Create Payment Schedule
                                            </DialogTitle>
                                            <DialogDescription data-oid="9jps63f">
                                                Set up automated reminders for commission
                                                collections or doctor payouts
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-6" data-oid="ia5773f">
                                            {/* Entity Type Selection */}
                                            <div data-oid="1g62:z:">
                                                <Label
                                                    className="text-base font-medium mb-3 block"
                                                    data-oid="v.qnq6z"
                                                >
                                                    Entity Type
                                                </Label>
                                                <div
                                                    className="grid grid-cols-3 gap-3"
                                                    data-oid="q443vrw"
                                                >
                                                    {[
                                                        {
                                                            value: 'pharmacy',
                                                            label: 'Pharmacy',
                                                            desc: 'Collect commission',
                                                            icon: 'M19 7l-.867-12.142A2 2 0 0016.138 0H7.862a2 2 0 00-1.995 1.858L5 14h14v-7z',
                                                        },
                                                        {
                                                            value: 'vendor',
                                                            label: 'Vendor',
                                                            desc: 'Collect commission',
                                                            icon: 'M16 11V3a2 2 0 00-2-2h-4a2 2 0 00-2 2v8M8 7h8',
                                                        },
                                                        {
                                                            value: 'doctor',
                                                            label: 'Doctor',
                                                            desc: 'Pay commission',
                                                            icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
                                                        },
                                                    ].map((type) => (
                                                        <div
                                                            key={type.value}
                                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                                selectedEntityType === type.value
                                                                    ? 'border-[#14274E] bg-[#F1F6F9]'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                            onClick={() =>
                                                                setSelectedEntityType(
                                                                    type.value as any,
                                                                )
                                                            }
                                                            data-oid="i3uj5vw"
                                                        >
                                                            <div
                                                                className="text-center"
                                                                data-oid="1s5_3sc"
                                                            >
                                                                <svg
                                                                    className="w-8 h-8 mx-auto mb-2 text-[#14274E]"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid="ul_mk8z"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d={type.icon}
                                                                        data-oid="7va7qms"
                                                                    />
                                                                </svg>
                                                                <h3
                                                                    className="font-semibold text-gray-900"
                                                                    data-oid="6fttmsq"
                                                                >
                                                                    {type.label}
                                                                </h3>
                                                                <p
                                                                    className="text-xs text-gray-600"
                                                                    data-oid="4jo3_de"
                                                                >
                                                                    {type.desc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Entity Selection */}
                                            <div data-oid="j9g4haq">
                                                <Label
                                                    className="text-base font-medium"
                                                    data-oid="r52vtbp"
                                                >
                                                    Select {selectedEntityType}
                                                </Label>
                                                <Select
                                                    value={selectedEntityId}
                                                    onValueChange={setSelectedEntityId}
                                                    data-oid="ya-g-8-"
                                                >
                                                    <SelectTrigger
                                                        className="mt-2"
                                                        data-oid="dtd2lqs"
                                                    >
                                                        <SelectValue
                                                            placeholder={`Choose a ${selectedEntityType}`}
                                                            data-oid="5u674zl"
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent data-oid="kcqa:tn">
                                                        {availableEntities.map((entity) => (
                                                            <SelectItem
                                                                key={entity.id}
                                                                value={entity.id}
                                                                data-oid="4z6817x"
                                                            >
                                                                <div
                                                                    className="flex items-center justify-between w-full"
                                                                    data-oid="nrdyoq0"
                                                                >
                                                                    <div data-oid="qd51quk">
                                                                        <div
                                                                            className="font-medium"
                                                                            data-oid="q.lv37z"
                                                                        >
                                                                            {entity.name}
                                                                        </div>
                                                                        <div
                                                                            className="text-sm text-gray-500"
                                                                            data-oid="-og5imw"
                                                                        >
                                                                            {entity.city ||
                                                                                entity.specialization}{' '}
                                                                            • Pending:{' '}
                                                                            {formatCurrency(
                                                                                entity.pendingAmount,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Payment Frequency */}
                                            <div data-oid="4swgkgx">
                                                <Label
                                                    className="text-base font-medium"
                                                    data-oid="ei2j4ea"
                                                >
                                                    Payment Frequency
                                                </Label>
                                                <Select
                                                    value={scheduleFrequency}
                                                    onValueChange={(value: any) =>
                                                        setScheduleFrequency(value)
                                                    }
                                                    data-oid="bsjct1g"
                                                >
                                                    <SelectTrigger
                                                        className="mt-2"
                                                        data-oid="2sqq9ra"
                                                    >
                                                        <SelectValue data-oid="jeb58hx" />
                                                    </SelectTrigger>
                                                    <SelectContent data-oid="6iom7r.">
                                                        <SelectItem
                                                            value="weekly"
                                                            data-oid="m8yx8rl"
                                                        >
                                                            Weekly
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="biweekly"
                                                            data-oid="j44n6o4"
                                                        >
                                                            Bi-weekly
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="monthly"
                                                            data-oid="88-p3dn"
                                                        >
                                                            Monthly
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Reminder Settings */}
                                            <div data-oid="m8o_:22">
                                                <Label
                                                    className="text-base font-medium"
                                                    data-oid="s4rmm9u"
                                                >
                                                    Reminder Days
                                                </Label>
                                                <Select
                                                    value={reminderDays.toString()}
                                                    onValueChange={(value) =>
                                                        setReminderDays(parseInt(value))
                                                    }
                                                    data-oid="yprpgql"
                                                >
                                                    <SelectTrigger
                                                        className="mt-2"
                                                        data-oid="rmvmgr9"
                                                    >
                                                        <SelectValue data-oid="ufnhqvk" />
                                                    </SelectTrigger>
                                                    <SelectContent data-oid="v42gr-n">
                                                        {[1, 2, 3, 5, 7].map((days) => (
                                                            <SelectItem
                                                                key={days}
                                                                value={days.toString()}
                                                                data-oid="onb1zxo"
                                                            >
                                                                {days} day{days > 1 ? 's' : ''}{' '}
                                                                before due date
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Notes */}
                                            <div data-oid="evf9axn">
                                                <Label
                                                    className="text-base font-medium"
                                                    data-oid="e-dld_r"
                                                >
                                                    Notes (Optional)
                                                </Label>
                                                <Input
                                                    value={scheduleNotes}
                                                    onChange={(e) =>
                                                        setScheduleNotes(e.target.value)
                                                    }
                                                    placeholder="Add any notes about this schedule..."
                                                    className="mt-2"
                                                    data-oid="kq9caj5"
                                                />
                                            </div>

                                            <div
                                                className="flex justify-end space-x-3 pt-4 border-t"
                                                data-oid="ehoxjn9"
                                            >
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setScheduleDialogOpen(false)}
                                                    data-oid="aq5jg_-"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleCreateSchedule}
                                                    disabled={!selectedEntityId}
                                                    className="bg-[#14274E] hover:bg-[#394867]"
                                                    data-oid="1vbqlnt"
                                                >
                                                    Create Schedule
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Edit Schedule Dialog */}
                                <Dialog
                                    open={editScheduleDialogOpen}
                                    onOpenChange={setEditScheduleDialogOpen}
                                    data-oid=".kletvn"
                                >
                                    <DialogContent className="max-w-2xl" data-oid="gwgj.-:">
                                        <DialogHeader data-oid="-9f:wzo">
                                            <DialogTitle data-oid="84kfmcs">
                                                Edit Payment Schedule
                                            </DialogTitle>
                                            <DialogDescription data-oid=":2bejyy">
                                                Modify the schedule settings for{' '}
                                                {selectedSchedule?.entityName}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-6" data-oid="83wuxkp">
                                            {/* Entity Info (Read-only) */}
                                            <div data-oid="oaac4_x">
                                                <Label
                                                    className="text-base font-medium mb-3 block"
                                                    data-oid="tv1m68x"
                                                >
                                                    Entity Information
                                                </Label>
                                                <div
                                                    className="bg-gray-50 p-4 rounded-lg"
                                                    data-oid="kdhqlyz"
                                                >
                                                    <div
                                                        className="flex items-center gap-3"
                                                        data-oid="rkka0qu"
                                                    >
                                                        <div
                                                            className="w-10 h-10 bg-[#14274E] rounded-lg flex items-center justify-center"
                                                            data-oid="x7qi1p1"
                                                        >
                                                            <span
                                                                className="text-white font-semibold text-sm"
                                                                data-oid="m1.0fzh"
                                                            >
                                                                {selectedSchedule?.entityName?.charAt(
                                                                    0,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div data-oid="-tvvcw4">
                                                            <h4
                                                                className="font-semibold text-gray-900"
                                                                data-oid="kwh:-lc"
                                                            >
                                                                {selectedSchedule?.entityName}
                                                            </h4>
                                                            <p
                                                                className="text-sm text-gray-600 capitalize"
                                                                data-oid="dih-87b"
                                                            >
                                                                {selectedSchedule?.entityType}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Frequency */}
                                            <div data-oid="wssup.p">
                                                <Label
                                                    className="text-base font-medium"
                                                    data-oid="i-n6jte"
                                                >
                                                    Payment Frequency
                                                </Label>
                                                <Select
                                                    value={scheduleFrequency}
                                                    onValueChange={(value: any) =>
                                                        setScheduleFrequency(value)
                                                    }
                                                    data-oid="3mat8g5"
                                                >
                                                    <SelectTrigger
                                                        className="mt-2"
                                                        data-oid="s7nqnks"
                                                    >
                                                        <SelectValue data-oid="bli72y5" />
                                                    </SelectTrigger>
                                                    <SelectContent data-oid="cbb5flv">
                                                        <SelectItem
                                                            value="weekly"
                                                            data-oid="04evzh:"
                                                        >
                                                            Weekly
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="biweekly"
                                                            data-oid="wpd89lo"
                                                        >
                                                            Bi-weekly
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="monthly"
                                                            data-oid="b598q7s"
                                                        >
                                                            Monthly
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Reminder Settings */}
                                            <div data-oid="2b-r_6f">
                                                <Label
                                                    className="text-base font-medium"
                                                    data-oid="p:jsuvy"
                                                >
                                                    Reminder Days
                                                </Label>
                                                <Select
                                                    value={reminderDays.toString()}
                                                    onValueChange={(value) =>
                                                        setReminderDays(parseInt(value))
                                                    }
                                                    data-oid="wvs-l.m"
                                                >
                                                    <SelectTrigger
                                                        className="mt-2"
                                                        data-oid="yq_1843"
                                                    >
                                                        <SelectValue data-oid="f25_sb." />
                                                    </SelectTrigger>
                                                    <SelectContent data-oid="vqpc00:">
                                                        {[1, 2, 3, 5, 7].map((days) => (
                                                            <SelectItem
                                                                key={days}
                                                                value={days.toString()}
                                                                data-oid="5q5blyj"
                                                            >
                                                                {days} day{days > 1 ? 's' : ''}{' '}
                                                                before due date
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Notes */}
                                            <div data-oid="onj133p">
                                                <Label
                                                    className="text-base font-medium"
                                                    data-oid=".jvc6kx"
                                                >
                                                    Notes (Optional)
                                                </Label>
                                                <Input
                                                    value={scheduleNotes}
                                                    onChange={(e) =>
                                                        setScheduleNotes(e.target.value)
                                                    }
                                                    placeholder="Add any notes about this schedule..."
                                                    className="mt-2"
                                                    data-oid="xc0528:"
                                                />
                                            </div>

                                            <div
                                                className="flex justify-between items-center pt-4 border-t"
                                                data-oid="l-7n3_u"
                                            >
                                                <Button
                                                    variant="outline"
                                                    onClick={handleDeleteSchedule}
                                                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                                    data-oid="gvh48.-"
                                                >
                                                    Delete Schedule
                                                </Button>
                                                <div className="flex space-x-3" data-oid="i5tr0s:">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setEditScheduleDialogOpen(false)
                                                        }
                                                        data-oid="aov20v3"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleUpdateSchedule}
                                                        className="bg-[#14274E] hover:bg-[#394867]"
                                                        data-oid="j24afgo"
                                                    >
                                                        Update Schedule
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent data-oid=":lpqr19">
                            {(() => {
                                const collectionSchedules = payoutSchedules.filter(
                                    (s) => s.entityType === 'pharmacy' || s.entityType === 'vendor',
                                );
                                const payoutSchedulesList = payoutSchedules.filter(
                                    (s) => s.entityType === 'doctor',
                                );

                                const ScheduleTable = ({
                                    schedules,
                                    title,
                                    actionType,
                                    bgColor,
                                }: any) => (
                                    <div className="space-y-4" data-oid="fo95w.6">
                                        <div className="flex items-center gap-3" data-oid="e382g82">
                                            <div
                                                className={`w-4 h-4 rounded ${bgColor}`}
                                                data-oid="69caew-"
                                            ></div>
                                            <h3
                                                className="text-lg font-semibold text-gray-900"
                                                data-oid=":wqooue"
                                            >
                                                {title}
                                            </h3>
                                            <Badge variant="outline" data-oid="qwu0ign">
                                                {schedules.length} schedules
                                            </Badge>
                                        </div>

                                        <Table data-oid="i1vmr69">
                                            <TableHeader data-oid="t0r9ne0">
                                                <TableRow data-oid="uojdy.t">
                                                    <TableHead data-oid="30aok:g">Entity</TableHead>
                                                    <TableHead data-oid="i0y.qwg">Type</TableHead>
                                                    <TableHead data-oid="lvj-...">
                                                        Frequency
                                                    </TableHead>
                                                    <TableHead data-oid="lxob-5v">
                                                        Next Due
                                                    </TableHead>
                                                    <TableHead data-oid="s1rm4em">
                                                        Days Until Due
                                                    </TableHead>
                                                    <TableHead data-oid="cje8vlq">
                                                        Pending Amount
                                                    </TableHead>
                                                    <TableHead data-oid="tdxid46">Status</TableHead>
                                                    <TableHead data-oid=".:yjd9_">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody data-oid="hsulv9t">
                                                {schedules.length === 0 ? (
                                                    <TableRow data-oid="85rnfpt">
                                                        <TableCell
                                                            colSpan={8}
                                                            className="text-center py-8 text-gray-500"
                                                            data-oid="g565n3y"
                                                        >
                                                            <div
                                                                className="flex flex-col items-center gap-2"
                                                                data-oid="sm1vi4q"
                                                            >
                                                                <svg
                                                                    className="w-8 h-8 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    data-oid="vw9:eyj"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                                        data-oid="yvn5rp2"
                                                                    />
                                                                </svg>
                                                                <p data-oid="xvgzlo0">
                                                                    No {title.toLowerCase()}{' '}
                                                                    scheduled
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    schedules.map((schedule: any) => {
                                                        const nextPayoutDate = new Date(
                                                            schedule.nextPayout,
                                                        );
                                                        const now = new Date();
                                                        const daysDiff = Math.ceil(
                                                            (nextPayoutDate.getTime() -
                                                                now.getTime()) /
                                                                (1000 * 3600 * 24),
                                                        );

                                                        return (
                                                            <TableRow
                                                                key={schedule.id}
                                                                className={
                                                                    daysDiff < 0
                                                                        ? 'bg-red-50'
                                                                        : daysDiff <= 3
                                                                          ? 'bg-orange-50'
                                                                          : daysDiff <= 7
                                                                            ? 'bg-blue-50'
                                                                            : ''
                                                                }
                                                                data-oid="_kvcokb"
                                                            >
                                                                <TableCell data-oid="87rmk36">
                                                                    <div data-oid="v.v37dx">
                                                                        <p
                                                                            className="font-medium"
                                                                            data-oid="9.da:mr"
                                                                        >
                                                                            {schedule.entityName}
                                                                        </p>
                                                                        <p
                                                                            className="text-sm text-gray-500"
                                                                            data-oid="c3km7yy"
                                                                        >
                                                                            {schedule.entityId}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell data-oid="duqeml_">
                                                                    <div
                                                                        className="flex items-center gap-2"
                                                                        data-oid="e69e0ov"
                                                                    >
                                                                        {schedule.entityType ===
                                                                        'pharmacy' ? (
                                                                            <svg
                                                                                className="w-4 h-4 text-blue-600"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                                data-oid="kr.58.7"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                                                    data-oid="33v5xmj"
                                                                                />
                                                                            </svg>
                                                                        ) : schedule.entityType ===
                                                                          'vendor' ? (
                                                                            <svg
                                                                                className="w-4 h-4 text-purple-600"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                                data-oid="rgwmf.r"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11h8"
                                                                                    data-oid="1xfk473"
                                                                                />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg
                                                                                className="w-4 h-4 text-green-600"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                                data-oid="l3owzt9"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                                    data-oid="liu3_dy"
                                                                                />
                                                                            </svg>
                                                                        )}
                                                                        <span
                                                                            className="capitalize"
                                                                            data-oid="5bqn5aq"
                                                                        >
                                                                            {schedule.entityType}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell
                                                                    className="capitalize"
                                                                    data-oid="i58h:kv"
                                                                >
                                                                    {schedule.frequency}
                                                                </TableCell>
                                                                <TableCell data-oid="zw4c0n4">
                                                                    {nextPayoutDate.toLocaleDateString()}
                                                                </TableCell>
                                                                <TableCell data-oid="xjw_kyi">
                                                                    <span
                                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                            daysDiff < 0
                                                                                ? 'bg-red-100 text-red-800'
                                                                                : daysDiff <= 3
                                                                                  ? 'bg-orange-100 text-orange-800'
                                                                                  : daysDiff <= 7
                                                                                    ? 'bg-blue-100 text-blue-800'
                                                                                    : 'bg-gray-100 text-gray-800'
                                                                        }`}
                                                                        data-oid="mj3ts6y"
                                                                    >
                                                                        {daysDiff < 0
                                                                            ? `${Math.abs(daysDiff)}d overdue`
                                                                            : daysDiff === 0
                                                                              ? 'Today'
                                                                              : `${daysDiff}d left`}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    className="font-semibold"
                                                                    data-oid="rj_g432"
                                                                >
                                                                    {formatCurrency(
                                                                        schedule.pendingAmount,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell data-oid="bz8bf-k">
                                                                    {getStatusBadge(
                                                                        schedule.status,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell data-oid="y_wcrnl">
                                                                    <div
                                                                        className="flex space-x-2"
                                                                        data-oid="uc74utr"
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleEditSchedule(
                                                                                    schedule,
                                                                                )
                                                                            }
                                                                            data-oid="sg1br6."
                                                                        >
                                                                            <Settings
                                                                                className="w-4 h-4"
                                                                                data-oid="9vq31vl"
                                                                            />
                                                                        </Button>
                                                                        {schedule.status ===
                                                                            'active' &&
                                                                            schedule.pendingAmount >
                                                                                0 && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    className="bg-[#14274E] hover:bg-[#394867] text-white"
                                                                                    onClick={() =>
                                                                                        handleCollectPay(
                                                                                            schedule,
                                                                                        )
                                                                                    }
                                                                                    data-oid="ji-nbuf"
                                                                                >
                                                                                    {actionType}
                                                                                </Button>
                                                                            )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                );

                                return (
                                    <div className="space-y-8" data-oid="yvrj46:">
                                        <ScheduleTable
                                            schedules={collectionSchedules}
                                            title="Commission Collections"
                                            actionType="Collect"
                                            bgColor="bg-green-500"
                                            data-oid="xg7mbaw"
                                        />

                                        <ScheduleTable
                                            schedules={payoutSchedulesList}
                                            title="Doctor Payouts"
                                            actionType="Pay"
                                            bgColor="bg-red-500"
                                            data-oid="1-37p7s"
                                        />
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <CommissionManagementModal
                isOpen={commissionModalOpen}
                onClose={() => {
                    setCommissionModalOpen(false);
                    setSelectedCommission(null);
                }}
                entityType={
                    selectedCommission?.pharmacyId
                        ? 'pharmacy'
                        : selectedCommission?.vendorId
                          ? 'vendor'
                          : 'doctor'
                }
                entityId={
                    selectedCommission?.pharmacyId ||
                    selectedCommission?.vendorId ||
                    selectedCommission?.doctorId ||
                    ''
                }
                entityData={selectedCommission}
                data-oid="fy5ke9k"
            />

            <RefundManagementModal
                isOpen={refundModalOpen}
                onClose={() => {
                    setRefundModalOpen(false);
                    setSelectedRefund(null);
                }}
                refundData={selectedRefund}
                data-oid="4vk_xm6"
            />

            <TransactionDetailsModal
                isOpen={transactionDetailsModalOpen}
                onClose={() => {
                    setTransactionDetailsModalOpen(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
                data-oid="6e24dy_"
            />
        </div>
    );
}
