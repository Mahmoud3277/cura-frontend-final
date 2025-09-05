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
import { Textarea } from '@/components/ui/textarea';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    payoutSchedulingService,
    type EnhancedPayoutSchedule,
    type PayoutAlert,
    type PayoutDashboardMetrics,
} from '@/lib/services/payoutSchedulingService';
import { pharmacyManagementService } from '@/lib/services/pharmacyManagementService';
import { vendorManagementService } from '@/lib/services/vendorManagementService';
import { doctorManagementService } from '@/lib/services/doctorManagementService';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    Building,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    Bell,
    BellRing,
    Eye,
    Settings,
    Plus,
    Play,
    Pause,
    RotateCcw,
    Download,
    Filter,
    Search,
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    Info,
    Zap,
    Target,
    Activity,
    BarChart3,
    PieChart,
    TrendingUpIcon,
    HandCoins,
    Banknote,
    Timer,
    CalendarClock,
    AlertOctagon,
    CheckCheck,
    X,
    RefreshCw,
    User,
    MapPin,
    Phone,
    Mail,
    Star,
    Percent,
} from 'lucide-react';

interface EnhancedPayoutSchedulesProps {
    className?: string;
}

export function EnhancedPayoutSchedules({ className }: EnhancedPayoutSchedulesProps) {
    const [schedules, setSchedules] = useState<EnhancedPayoutSchedule[]>([]);
    const [alerts, setAlerts] = useState<PayoutAlert[]>([]);
    const [metrics, setMetrics] = useState<PayoutDashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState<EnhancedPayoutSchedule | null>(null);
    const [selectedAlert, setSelectedAlert] = useState<PayoutAlert | null>(null);

    // Entity data
    const [availablePharmacies, setAvailablePharmacies] = useState<any[]>([]);
    const [availableVendors, setAvailableVendors] = useState<any[]>([]);
    const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<any>(null);

    // Filters
    const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
    const [scheduleTypeFilter, setScheduleTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [entitySearchTerm, setEntitySearchTerm] = useState('');

    // Modals
    const [createScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);
    const [scheduleDetailsModalOpen, setScheduleDetailsModalOpen] = useState(false);
    const [alertDetailsModalOpen, setAlertDetailsModalOpen] = useState(false);
    const [processTransactionModalOpen, setProcessTransactionModalOpen] = useState(false);

    // Form states
    const [newScheduleData, setNewScheduleData] = useState<Partial<EnhancedPayoutSchedule>>({
        entityType: 'pharmacy',
        scheduleType: 'collection',
        frequency: 'monthly',
        paymentMethod: 'bank_transfer',
        minimumAmount: 500,
        alertSettings: {
            enableAlerts: true,
            alertDaysBefore: 2,
            enableOverdueAlerts: true,
            escalationDays: 3,
        },
        autoProcess: false,
    });

    const [transactionNotes, setTransactionNotes] = useState('');

    useEffect(() => {
        loadData();
        loadEntityData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const schedulesData = payoutSchedulingService.getPayoutSchedules();
            const alertsData = payoutSchedulingService.getPayoutAlerts();
            const metricsData = payoutSchedulingService.getDashboardMetrics();
            setSchedules(schedulesData);
            setAlerts(alertsData);
            setMetrics(metricsData);
        } catch (error) {
            console.error('Error loading payout data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadEntityData = async () => {
        try {
            // Load active pharmacies, vendors, and doctors
            const pharmacies = pharmacyManagementService.getPharmacies({ status: 'active' });
            const vendors = vendorManagementService.getVendors({ status: 'active' });
            const doctors = doctorManagementService.getDoctors({ status: 'active' });
            setAvailablePharmacies(pharmacies);
            setAvailableVendors(vendors);
            setAvailableDoctors(doctors);
        } catch (error) {
            console.error('Error loading entity data:', error);
        }
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
    const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { variant: 'default' as const, color: 'bg-emerald-500', label: 'Active' },
            overdue: { variant: 'destructive' as const, color: 'bg-rose-500', label: 'Overdue' },
            paused: { variant: 'secondary' as const, color: 'bg-amber-500', label: 'Paused' },
            cancelled: { variant: 'outline' as const, color: 'bg-slate-500', label: 'Cancelled' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1" data-oid=":yojjzb">
                <div className={`w-2 h-2 rounded-full ${config.color}`} data-oid="2c3g1z-" />
                {config.label}
            </Badge>
        );
    };

    const getSeverityBadge = (severity: string) => {
        const severityConfig = {
            low: { variant: 'outline' as const, color: 'text-blue-600', icon: Info },
            medium: {
                variant: 'secondary' as const,
                color: 'text-yellow-600',
                icon: AlertTriangle,
            },
            high: { variant: 'destructive' as const, color: 'text-orange-600', icon: AlertCircle },
            critical: { variant: 'destructive' as const, color: 'text-red-600', icon: Zap },
        };

        const config =
            severityConfig[severity as keyof typeof severityConfig] || severityConfig.low;
        const IconComponent = config.icon;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1" data-oid="2u.brs:">
                <IconComponent className="w-3 h-3" data-oid="qv9_yau" />
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Badge>
        );
    };

    const getDaysUntilDue = (dueDate: string) => payoutSchedulingService.getDaysUntilDue(dueDate);
    const getDaysPastDue = (dueDate: string) => payoutSchedulingService.getDaysPastDue(dueDate);

    const handleCreateSchedule = async () => {
        try {
            await payoutSchedulingService.createPayoutSchedule(newScheduleData);
            setCreateScheduleModalOpen(false);
            setNewScheduleData({
                entityType: 'pharmacy',
                scheduleType: 'collection',
                frequency: 'monthly',
                paymentMethod: 'bank_transfer',
                minimumAmount: 500,
                alertSettings: {
                    enableAlerts: true,
                    alertDaysBefore: 2,
                    enableOverdueAlerts: true,
                    escalationDays: 3,
                },
                autoProcess: false,
            });
            loadData();
        } catch (error) {
            console.error('Error creating schedule:', error);
        }
    };

    const handleProcessTransaction = async () => {
        if (!selectedSchedule) return;
        try {
            await payoutSchedulingService.processPayoutTransaction(
                selectedSchedule.id,
                transactionNotes,
            );
            setProcessTransactionModalOpen(false);
            setTransactionNotes('');
            setSelectedSchedule(null);
            loadData();
        } catch (error) {
            console.error('Error processing transaction:', error);
        }
    };

    const handleMarkAlertAsRead = async (alertId: string) => {
        try {
            await payoutSchedulingService.markAlertAsRead(alertId);
            loadData();
        } catch (error) {
            console.error('Error marking alert as read:', error);
        }
    };

    const handleResolveAlert = async (alertId: string) => {
        try {
            await payoutSchedulingService.resolveAlert(alertId);
            loadData();
        } catch (error) {
            console.error('Error resolving alert:', error);
        }
    };

    const getFilteredEntities = () => {
        const entities =
            newScheduleData.entityType === 'pharmacy'
                ? availablePharmacies
                : newScheduleData.entityType === 'vendor'
                  ? availableVendors
                  : availableDoctors;

        return entities.filter(
            (entity) =>
                entity.name?.toLowerCase().includes(entitySearchTerm.toLowerCase()) ||
                entity.companyName?.toLowerCase().includes(entitySearchTerm.toLowerCase()) ||
                entity.email?.toLowerCase().includes(entitySearchTerm.toLowerCase()),
        );
    };

    const handleEntityTypeChange = (value: string) => {
        setNewScheduleData((prev) => ({
            ...prev,
            entityType: value,
            scheduleType: value === 'doctor' ? 'payout' : 'collection',
        }));
        setSelectedEntity(null);
    };

    const handleEntitySelection = (entity: any) => {
        setSelectedEntity(entity);
        setNewScheduleData((prev) => ({
            ...prev,
            entityId: entity.id,
            entityName: entity.name || entity.companyName,
        }));
    };

    const filteredSchedules = schedules.filter((schedule) => {
        const matchesEntityType =
            entityTypeFilter === 'all' || schedule.entityType === entityTypeFilter;
        const matchesScheduleType =
            scheduleTypeFilter === 'all' || schedule.scheduleType === scheduleTypeFilter;
        const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
        const matchesSearch =
            searchTerm === '' ||
            schedule.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.id.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesEntityType && matchesScheduleType && matchesStatus && matchesSearch;
    });

    const filteredAlerts = alerts.filter((alert) => {
        const matchesEntityType =
            entityTypeFilter === 'all' || alert.entityType === entityTypeFilter;
        const matchesSeverity =
            alertSeverityFilter === 'all' || alert.severity === alertSeverityFilter;
        const matchesSearch =
            searchTerm === '' ||
            alert.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.message.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesEntityType && matchesSeverity && matchesSearch;
    });

    if (isLoading && !metrics) {
        return (
            <div className="space-y-6" data-oid="qucrisd">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="ijgh9y0">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="au9jflr"
                        />
                    ))}
                </div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-96" data-oid="enp7fv1" />
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`} data-oid="lxp77bf">
            {/* Dashboard Metrics - Cards removed as requested */}

            {/* Main Content Tabs */}
            <Tabs defaultValue="schedules" className="space-y-6" data-oid="f_qjf93">
                <div className="flex items-center justify-between" data-oid="_in6020">
                    <TabsList className="grid w-fit grid-cols-1" data-oid="ndc9kvv">
                        <TabsTrigger
                            value="schedules"
                            className="flex items-center gap-2"
                            data-oid="aptsu:1"
                        >
                            <DollarSign className="w-4 h-4" data-oid="5w6ow55" />
                            Collection & Payout Agreements
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center space-x-4" data-oid="b72mciq">
                        <div className="relative" data-oid="yc:zj.6">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                data-oid="fbuqpyu"
                            />

                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                                data-oid="ig207av"
                            />
                        </div>

                        <Dialog
                            open={createScheduleModalOpen}
                            onOpenChange={setCreateScheduleModalOpen}
                            data-oid="8g66sb."
                        >
                            <DialogTrigger asChild data-oid="dj4icj1">
                                <Button
                                    className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
                                    data-oid="m:waz.4"
                                >
                                    <Plus className="w-4 h-4 mr-2" data-oid="r-c39nx" />
                                    <Calendar className="w-4 h-4 mr-2" data-oid="w_kfpym" />
                                    Create New Agreement
                                </Button>
                            </DialogTrigger>

                            <DialogContent
                                className="max-w-4xl max-h-[90vh] overflow-y-auto"
                                data-oid="x8683hv"
                            >
                                <DialogHeader data-oid="22zer3y">
                                    <DialogTitle
                                        className="text-lg flex items-center gap-2"
                                        data-oid="m_bmwv1"
                                    >
                                        <Calendar
                                            className="w-5 h-5 text-slate-700"
                                            data-oid="st57efp"
                                        />
                                        Create New Payment Agreement
                                    </DialogTitle>
                                    <DialogDescription className="text-sm" data-oid="o8ogb8.">
                                        Set up payment schedules with your existing partners.
                                    </DialogDescription>

                                    {/* Quick Stats */}
                                    <div
                                        className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg text-xs"
                                        data-oid="entity-stats"
                                    >
                                        <div className="text-center" data-oid="_9_o:mu">
                                            <div
                                                className="text-lg font-bold text-cyan-600"
                                                data-oid="9:3hor:"
                                            >
                                                {availablePharmacies.length}
                                            </div>
                                            <div
                                                className="text-xs text-slate-600"
                                                data-oid="yyosiyy"
                                            >
                                                Pharmacies
                                            </div>
                                        </div>
                                        <div className="text-center" data-oid=".e3cmi8">
                                            <div
                                                className="text-lg font-bold text-indigo-600"
                                                data-oid="lrqqh_x"
                                            >
                                                {availableVendors.length}
                                            </div>
                                            <div
                                                className="text-xs text-slate-600"
                                                data-oid=":j3t9em"
                                            >
                                                Vendors
                                            </div>
                                        </div>
                                        <div className="text-center" data-oid="i80r1gr">
                                            <div
                                                className="text-lg font-bold text-emerald-600"
                                                data-oid="jmfop4u"
                                            >
                                                {availableDoctors.length}
                                            </div>
                                            <div
                                                className="text-xs text-slate-600"
                                                data-oid="8lbmdo8"
                                            >
                                                Doctors
                                            </div>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="space-y-3" data-oid="ta3r53e">
                                    <div className="grid grid-cols-2 gap-3" data-oid="486pb__">
                                        <div data-oid="lfmcxo8">
                                            <Label
                                                htmlFor="entity-type"
                                                className="text-sm"
                                                data-oid="qfw4c:2"
                                            >
                                                Entity Type
                                            </Label>
                                            <Select
                                                value={newScheduleData.entityType}
                                                onValueChange={handleEntityTypeChange}
                                                data-oid="ms7spw-"
                                            >
                                                <SelectTrigger className="h-9" data-oid="0ytl857">
                                                    <SelectValue data-oid="rc_djrm" />
                                                </SelectTrigger>
                                                <SelectContent data-oid="9oqunz_">
                                                    <SelectItem value="pharmacy" data-oid="2-0n45s">
                                                        <div
                                                            className="flex items-center gap-2"
                                                            data-oid="44gtqlj"
                                                        >
                                                            <Building
                                                                className="w-4 h-4 text-cyan-600"
                                                                data-oid="d8gn5fp"
                                                            />
                                                            Pharmacy
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="vendor" data-oid="31lfbwl">
                                                        <div
                                                            className="flex items-center gap-2"
                                                            data-oid="m8d174j"
                                                        >
                                                            <Building
                                                                className="w-4 h-4 text-indigo-600"
                                                                data-oid="p2o.yg4"
                                                            />
                                                            Vendor
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="doctor" data-oid="2w16j.k">
                                                        <div
                                                            className="flex items-center gap-2"
                                                            data-oid="-gd.6h9"
                                                        >
                                                            <User
                                                                className="w-4 h-4 text-emerald-600"
                                                                data-oid="bixbkzq"
                                                            />
                                                            Doctor
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div data-oid="3933z.r">
                                            <Label
                                                htmlFor="schedule-type"
                                                className="text-sm"
                                                data-oid="g0-x9v9"
                                            >
                                                Schedule Type
                                            </Label>
                                            <Select
                                                value={newScheduleData.scheduleType}
                                                onValueChange={(value: any) =>
                                                    setNewScheduleData((prev) => ({
                                                        ...prev,
                                                        scheduleType: value,
                                                    }))
                                                }
                                                data-oid="v7tlp74"
                                                disabled={newScheduleData.entityType === 'doctor'}
                                            >
                                                <SelectTrigger className="h-9" data-oid="4:g:-o6">
                                                    <SelectValue data-oid="8n-5tk5" />
                                                </SelectTrigger>
                                                <SelectContent data-oid="laozjh0">
                                                    {newScheduleData.entityType !== 'doctor' && (
                                                        <SelectItem
                                                            value="collection"
                                                            data-oid="rhpul4i"
                                                        >
                                                            <div
                                                                className="flex items-center gap-2"
                                                                data-oid="u2nboo-"
                                                            >
                                                                <ArrowDownRight
                                                                    className="w-4 h-4 text-emerald-600"
                                                                    data-oid="v:5q48t"
                                                                />
                                                                Collection Agreement
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                    {newScheduleData.entityType === 'doctor' && (
                                                        <SelectItem
                                                            value="payout"
                                                            data-oid="r3qq5_."
                                                        >
                                                            <div
                                                                className="flex items-center gap-2"
                                                                data-oid="nhef3-n"
                                                            >
                                                                <ArrowUpRight
                                                                    className="w-4 h-4 text-rose-600"
                                                                    data-oid=":wwal02"
                                                                />
                                                                Payout Agreement
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Entity Selection Section */}
                                    <div data-oid="entity-selection">
                                        <div
                                            className="flex items-center justify-between mb-2"
                                            data-oid="w0qne1e"
                                        >
                                            <Label
                                                className="text-sm"
                                                data-oid="entity-selection-label"
                                            >
                                                Choose{' '}
                                                {newScheduleData.entityType === 'pharmacy'
                                                    ? 'Pharmacy'
                                                    : newScheduleData.entityType === 'vendor'
                                                      ? 'Vendor'
                                                      : 'Doctor'}
                                            </Label>
                                            <div
                                                className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center gap-1"
                                                data-oid="1:8yd64"
                                            >
                                                {newScheduleData.entityType === 'pharmacy' && (
                                                    <>
                                                        <ArrowDownRight
                                                            className="w-3 h-3 text-emerald-600"
                                                            data-oid="2ar15a4"
                                                        />
                                                        Collect from
                                                    </>
                                                )}
                                                {newScheduleData.entityType === 'vendor' && (
                                                    <>
                                                        <ArrowDownRight
                                                            className="w-3 h-3 text-emerald-600"
                                                            data-oid="m1-2sqz"
                                                        />
                                                        Collect from
                                                    </>
                                                )}
                                                {newScheduleData.entityType === 'doctor' && (
                                                    <>
                                                        <ArrowUpRight
                                                            className="w-3 h-3 text-rose-600"
                                                            data-oid="0o3l-h5"
                                                        />
                                                        Pay to
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="space-y-2"
                                            data-oid="entity-selection-content"
                                        >
                                            <div className="relative" data-oid="entity-search">
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                                    data-oid="zr98fp9"
                                                />

                                                <Input
                                                    placeholder={`Search ${newScheduleData.entityType}s...`}
                                                    value={entitySearchTerm}
                                                    onChange={(e) =>
                                                        setEntitySearchTerm(e.target.value)
                                                    }
                                                    className="pl-10 h-9"
                                                    data-oid=":k61.hc"
                                                />
                                            </div>

                                            {selectedEntity ? (
                                                <div
                                                    className="p-3 border rounded-lg bg-emerald-50 border-emerald-200"
                                                    data-oid="selected-entity"
                                                >
                                                    <div
                                                        className="flex items-center justify-between"
                                                        data-oid="3nl:pfz"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="yzg4xr8"
                                                        >
                                                            <div
                                                                className="p-1 bg-emerald-100 rounded"
                                                                data-oid="es-xtfv"
                                                            >
                                                                {newScheduleData.entityType ===
                                                                    'pharmacy' && (
                                                                    <Building
                                                                        className="w-4 h-4 text-cyan-600"
                                                                        data-oid="6:j.7k7"
                                                                    />
                                                                )}
                                                                {newScheduleData.entityType ===
                                                                    'vendor' && (
                                                                    <Building
                                                                        className="w-4 h-4 text-indigo-600"
                                                                        data-oid="0nwyp:r"
                                                                    />
                                                                )}
                                                                {newScheduleData.entityType ===
                                                                    'doctor' && (
                                                                    <User
                                                                        className="w-4 h-4 text-emerald-600"
                                                                        data-oid="2n2oi6n"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div data-oid="3fy.eob">
                                                                <p
                                                                    className="font-medium text-slate-800 text-sm"
                                                                    data-oid="js6iiqk"
                                                                >
                                                                    {selectedEntity.name ||
                                                                        selectedEntity.companyName}
                                                                </p>
                                                                <div
                                                                    className="flex items-center space-x-3 text-xs text-slate-600"
                                                                    data-oid="vo2l_lg"
                                                                >
                                                                    <span
                                                                        className="flex items-center space-x-1"
                                                                        data-oid="hmyj:pa"
                                                                    >
                                                                        <MapPin
                                                                            className="w-3 h-3"
                                                                            data-oid="j-kngrj"
                                                                        />

                                                                        <span data-oid="8l66c64">
                                                                            {
                                                                                selectedEntity.cityName
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    {selectedEntity.commission
                                                                        ?.rate && (
                                                                        <span
                                                                            className="flex items-center space-x-1"
                                                                            data-oid="oyp7:-w"
                                                                        >
                                                                            <Percent
                                                                                className="w-3 h-3"
                                                                                data-oid="-cqhf-7"
                                                                            />

                                                                            <span data-oid="k_nr4on">
                                                                                {
                                                                                    selectedEntity
                                                                                        .commission
                                                                                        .rate
                                                                                }{' '}
                                                                                %
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedEntity(null);
                                                                setNewScheduleData((prev) => ({
                                                                    ...prev,
                                                                    entityId: undefined,
                                                                    entityName: undefined,
                                                                }));
                                                            }}
                                                            data-oid="rwq_lpp"
                                                        >
                                                            <X
                                                                className="w-4 h-4"
                                                                data-oid="dvq-rvb"
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="max-h-32 overflow-y-auto border rounded-lg"
                                                    data-oid="entity-list"
                                                >
                                                    {getFilteredEntities().length > 0 ? (
                                                        getFilteredEntities().map((entity) => (
                                                            <div
                                                                key={entity.id}
                                                                className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                                                onClick={() =>
                                                                    handleEntitySelection(entity)
                                                                }
                                                                data-oid="c_7w.:l"
                                                            >
                                                                <div
                                                                    className="flex items-center space-x-2"
                                                                    data-oid="yb:bwcz"
                                                                >
                                                                    <div
                                                                        className="p-1 bg-slate-100 rounded"
                                                                        data-oid=".e1afbi"
                                                                    >
                                                                        {newScheduleData.entityType ===
                                                                            'pharmacy' && (
                                                                            <Building
                                                                                className="w-3 h-3 text-cyan-600"
                                                                                data-oid="6ksmga5"
                                                                            />
                                                                        )}
                                                                        {newScheduleData.entityType ===
                                                                            'vendor' && (
                                                                            <Building
                                                                                className="w-3 h-3 text-indigo-600"
                                                                                data-oid="r06:lhy"
                                                                            />
                                                                        )}
                                                                        {newScheduleData.entityType ===
                                                                            'doctor' && (
                                                                            <User
                                                                                className="w-3 h-3 text-emerald-600"
                                                                                data-oid="bo2j.30"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="flex-1"
                                                                        data-oid="4v.hppn"
                                                                    >
                                                                        <p
                                                                            className="font-medium text-sm"
                                                                            data-oid="1enfpd7"
                                                                        >
                                                                            {entity.name ||
                                                                                entity.companyName}
                                                                        </p>
                                                                        <div
                                                                            className="flex items-center space-x-3 text-xs text-gray-500"
                                                                            data-oid="yi_mm3e"
                                                                        >
                                                                            <span
                                                                                className="flex items-center space-x-1"
                                                                                data-oid="o-p.fhm"
                                                                            >
                                                                                <MapPin
                                                                                    className="w-2 h-2"
                                                                                    data-oid="99y9.za"
                                                                                />

                                                                                <span data-oid="1nhr6qd">
                                                                                    {
                                                                                        entity.cityName
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                            {entity.commission
                                                                                ?.rate && (
                                                                                <span
                                                                                    className="flex items-center space-x-1"
                                                                                    data-oid="5wnga_4"
                                                                                >
                                                                                    <Percent
                                                                                        className="w-2 h-2"
                                                                                        data-oid="ena7g-g"
                                                                                    />

                                                                                    <span data-oid="oy7q7ag">
                                                                                        {
                                                                                            entity
                                                                                                .commission
                                                                                                .rate
                                                                                        }{' '}
                                                                                        %
                                                                                    </span>
                                                                                </span>
                                                                            )}
                                                                            {newScheduleData.entityType ===
                                                                                'doctor' &&
                                                                                entity.specialization && (
                                                                                    <span
                                                                                        className="text-emerald-600"
                                                                                        data-oid="c3iswao"
                                                                                    >
                                                                                        {
                                                                                            entity.specialization
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div
                                                            className="p-3 text-center text-gray-500 text-sm"
                                                            data-oid="828w-q0"
                                                        >
                                                            {entitySearchTerm
                                                                ? `No ${newScheduleData.entityType}s found`
                                                                : `No active ${newScheduleData.entityType}s available`}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3" data-oid="_6_rawo">
                                        <div data-oid="f-dblcz">
                                            <Label
                                                htmlFor="frequency"
                                                className="text-sm"
                                                data-oid=".s2o7d:"
                                            >
                                                Frequency
                                            </Label>
                                            <Select
                                                value={newScheduleData.frequency}
                                                onValueChange={(value: any) =>
                                                    setNewScheduleData((prev) => ({
                                                        ...prev,
                                                        frequency: value,
                                                    }))
                                                }
                                                data-oid="wbajcrf"
                                            >
                                                <SelectTrigger className="h-9" data-oid="gqd_y:6">
                                                    <SelectValue data-oid="9022.se" />
                                                </SelectTrigger>
                                                <SelectContent data-oid="_mik_af">
                                                    <SelectItem value="weekly" data-oid="lpat2ey">
                                                        Weekly
                                                    </SelectItem>
                                                    <SelectItem value="biweekly" data-oid="cncqnqi">
                                                        Bi-weekly
                                                    </SelectItem>
                                                    <SelectItem value="monthly" data-oid="nhy6--c">
                                                        Monthly
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div data-oid="3lx8nmx">
                                            <Label
                                                htmlFor="payment-method"
                                                className="text-sm"
                                                data-oid="6d.:3np"
                                            >
                                                Payment Method
                                            </Label>
                                            <Select
                                                value={newScheduleData.paymentMethod}
                                                onValueChange={(value: any) =>
                                                    setNewScheduleData((prev) => ({
                                                        ...prev,
                                                        paymentMethod: value,
                                                    }))
                                                }
                                                data-oid="d-4stpx"
                                            >
                                                <SelectTrigger className="h-9" data-oid="v0amwf.">
                                                    <SelectValue data-oid="lm9479s" />
                                                </SelectTrigger>
                                                <SelectContent data-oid="8dfuvym">
                                                    <SelectItem value="cash" data-oid="-r6lhy9">
                                                        Cash
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="bank_transfer"
                                                        data-oid="h8agd.g"
                                                    >
                                                        Bank Transfer
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="mobile_wallet"
                                                        data-oid="6rkvtks"
                                                    >
                                                        Mobile Wallet
                                                    </SelectItem>
                                                    <SelectItem value="check" data-oid="b3amhn2">
                                                        Check
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div data-oid="he59_9h">
                                            <Label
                                                htmlFor="minimum-amount"
                                                className="text-sm"
                                                data-oid="dlxcd9y"
                                            >
                                                Minimum Amount (EGP)
                                            </Label>
                                            <Input
                                                type="number"
                                                value={newScheduleData.minimumAmount || ''}
                                                onChange={(e) =>
                                                    setNewScheduleData((prev) => ({
                                                        ...prev,
                                                        minimumAmount:
                                                            parseFloat(e.target.value) || 0,
                                                    }))
                                                }
                                                placeholder="500"
                                                className="h-9"
                                                data-oid="klv9o7f"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-2 gap-3"
                                        data-oid="alert-settings"
                                    >
                                        <div data-oid="f0_s1_f">
                                            <Label className="text-sm" data-oid="h74fdg7">
                                                Alert Days Before
                                            </Label>
                                            <Input
                                                type="number"
                                                value={
                                                    newScheduleData.alertSettings
                                                        ?.alertDaysBefore || ''
                                                }
                                                onChange={(e) =>
                                                    setNewScheduleData((prev) => ({
                                                        ...prev,
                                                        alertSettings: {
                                                            ...prev.alertSettings!,
                                                            alertDaysBefore:
                                                                parseInt(e.target.value) || 2,
                                                        },
                                                    }))
                                                }
                                                placeholder="2"
                                                className="h-9"
                                                data-oid="ceo6or6"
                                            />
                                        </div>

                                        <div data-oid="a40xn1s">
                                            <Label className="text-sm" data-oid="oyhb-1c">
                                                Escalation Days
                                            </Label>
                                            <Input
                                                type="number"
                                                value={
                                                    newScheduleData.alertSettings?.escalationDays ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setNewScheduleData((prev) => ({
                                                        ...prev,
                                                        alertSettings: {
                                                            ...prev.alertSettings!,
                                                            escalationDays:
                                                                parseInt(e.target.value) || 3,
                                                        },
                                                    }))
                                                }
                                                placeholder="3"
                                                className="h-9"
                                                data-oid="g6_3n7d"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2" data-oid=".ddz_aq">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setCreateScheduleModalOpen(false);
                                            setSelectedEntity(null);
                                            setEntitySearchTerm('');
                                            setNewScheduleData({
                                                entityType: 'pharmacy',
                                                scheduleType: 'collection',
                                                frequency: 'monthly',
                                                paymentMethod: 'bank_transfer',
                                                minimumAmount: 500,
                                                alertSettings: {
                                                    enableAlerts: true,
                                                    alertDaysBefore: 2,
                                                    enableOverdueAlerts: true,
                                                    escalationDays: 3,
                                                },
                                                autoProcess: false,
                                            });
                                        }}
                                        data-oid="v0optd."
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateSchedule}
                                        data-oid="nq.pcud"
                                        disabled={!selectedEntity}
                                    >
                                        Create Schedule
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Payment Schedules Tab */}
                <TabsContent value="schedules" className="space-y-6" data-oid="o2tdmps">
                    <Card data-oid="anv:ucn">
                        <CardHeader data-oid="eb9gjx7">
                            <div className="flex items-center justify-between" data-oid="mblj9.5">
                                <div data-oid="rxtz3cr">
                                    <CardTitle data-oid="5evt4f4">Payment Schedules</CardTitle>
                                    <CardDescription data-oid="jjtm8ux">
                                        Manage automated collection and payout schedules
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-4" data-oid="j8za30p">
                                    <Select
                                        value={entityTypeFilter}
                                        onValueChange={setEntityTypeFilter}
                                        data-oid="khofl3q"
                                    >
                                        <SelectTrigger className="w-32" data-oid="-o2oi5j">
                                            <SelectValue data-oid="ce3qcfs" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="._hwk3j">
                                            <SelectItem value="all" data-oid="igsxtkd">
                                                All Types
                                            </SelectItem>
                                            <SelectItem value="pharmacy" data-oid="raemgdm">
                                                Pharmacy
                                            </SelectItem>
                                            <SelectItem value="vendor" data-oid="l88u0i8">
                                                Vendor
                                            </SelectItem>
                                            <SelectItem value="doctor" data-oid="1f:c-st">
                                                Doctor
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={scheduleTypeFilter}
                                        onValueChange={setScheduleTypeFilter}
                                        data-oid="hus-0.d"
                                    >
                                        <SelectTrigger className="w-32" data-oid="dgjhmr6">
                                            <SelectValue data-oid="re3vssl" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="qidsq_u">
                                            <SelectItem value="all" data-oid="fsczep9">
                                                All Schedules
                                            </SelectItem>
                                            <SelectItem value="collection" data-oid="dtwgh3d">
                                                Collections
                                            </SelectItem>
                                            <SelectItem value="payout" data-oid="9pe9dum">
                                                Payouts
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                        data-oid="w_mxia0"
                                    >
                                        <SelectTrigger className="w-32" data-oid="f.xkzsl">
                                            <SelectValue data-oid="0mrkq38" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="d_38kps">
                                            <SelectItem value="all" data-oid=":sm99ij">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="active" data-oid="esgzfl8">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="overdue" data-oid="wvwjcua">
                                                Overdue
                                            </SelectItem>
                                            <SelectItem value="paused" data-oid="xpf_n2d">
                                                Paused
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent data-oid="0z:p-vo">
                            <Table data-oid="g5xy8ld">
                                <TableHeader data-oid="-esbl3u">
                                    <TableRow data-oid="y.6sh:6">
                                        <TableHead data-oid="o-w8ax:">Entity</TableHead>
                                        <TableHead data-oid="kb826ph">Type</TableHead>
                                        <TableHead data-oid="c9y_r4u">Frequency</TableHead>
                                        <TableHead data-oid="ez21:_0">Next Due</TableHead>
                                        <TableHead data-oid="::3e0n_">Pending Amount</TableHead>
                                        <TableHead data-oid="2jq8wde">Status</TableHead>
                                        <TableHead data-oid="x5or6rr">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody data-oid="p14b6om">
                                    {filteredSchedules.map((schedule) => {
                                        const daysUntilDue = getDaysUntilDue(schedule.nextDueDate);
                                        const daysPastDue = getDaysPastDue(schedule.nextDueDate);

                                        return (
                                            <TableRow key={schedule.id} data-oid="vxc5fge">
                                                <TableCell data-oid="ed5q972">
                                                    <div data-oid="4_.8or1">
                                                        <p
                                                            className="font-medium"
                                                            data-oid="scjldv5"
                                                        >
                                                            {schedule.entityName}
                                                        </p>
                                                        <p
                                                            className="text-sm text-gray-500 capitalize"
                                                            data-oid="wjrjs-t"
                                                        >
                                                            {schedule.entityType}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell data-oid=".i3vk8o">
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="bx6cuwz"
                                                    >
                                                        {schedule.scheduleType === 'collection' ? (
                                                            <ArrowDownRight
                                                                className="w-4 h-4 text-emerald-600"
                                                                data-oid="nkgksh9"
                                                            />
                                                        ) : (
                                                            <ArrowUpRight
                                                                className="w-4 h-4 text-rose-600"
                                                                data-oid="bz2-.wy"
                                                            />
                                                        )}
                                                        <span
                                                            className="capitalize"
                                                            data-oid="v80vrsf"
                                                        >
                                                            {schedule.scheduleType}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell
                                                    className="capitalize"
                                                    data-oid="gf6kavz"
                                                >
                                                    {schedule.frequency}
                                                </TableCell>

                                                <TableCell data-oid="_rv5qqf">
                                                    <div data-oid="gfwj9ow">
                                                        <p
                                                            className="font-medium"
                                                            data-oid="pdu-rup"
                                                        >
                                                            {formatDate(schedule.nextDueDate)}
                                                        </p>
                                                        {schedule.status === 'overdue' ? (
                                                            <p
                                                                className="text-sm text-red-600"
                                                                data-oid="_c2o9i6"
                                                            >
                                                                {daysPastDue} days overdue
                                                            </p>
                                                        ) : daysUntilDue <= 3 ? (
                                                            <p
                                                                className="text-sm text-amber-600"
                                                                data-oid="zo8dcm0"
                                                            >
                                                                Due in {daysUntilDue} days
                                                            </p>
                                                        ) : (
                                                            <p
                                                                className="text-sm text-slate-500"
                                                                data-oid="h7cy0.3"
                                                            >
                                                                Due in {daysUntilDue} days
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell
                                                    className="font-semibold"
                                                    data-oid="hox2__v"
                                                >
                                                    {formatCurrency(schedule.pendingAmount)}
                                                </TableCell>

                                                <TableCell data-oid="_k89nj-">
                                                    {getStatusBadge(schedule.status)}
                                                </TableCell>

                                                <TableCell data-oid="gbvy-bk">
                                                    <div
                                                        className="flex space-x-2"
                                                        data-oid="kx_8_ep"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedSchedule(schedule);
                                                                setScheduleDetailsModalOpen(true);
                                                            }}
                                                            data-oid=":0av64v"
                                                        >
                                                            <Eye
                                                                className="w-4 h-4"
                                                                data-oid="0a3_zth"
                                                            />
                                                        </Button>

                                                        {schedule.pendingAmount > 0 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedSchedule(schedule);
                                                                    setProcessTransactionModalOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                                data-oid="8ezxxvu"
                                                            >
                                                                <Play
                                                                    className="w-4 h-4 mr-1"
                                                                    data-oid="q:e2maq"
                                                                />
                                                                Process Now
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Schedule Details Modal */}
            <Dialog
                open={scheduleDetailsModalOpen}
                onOpenChange={setScheduleDetailsModalOpen}
                data-oid="q7p6:w7"
            >
                <DialogContent
                    className="max-w-3xl max-h-[90vh] overflow-y-auto"
                    data-oid="js_cbn8"
                >
                    <DialogHeader data-oid="f74ki50">
                        <DialogTitle className="flex items-center gap-2 text-xl" data-oid="cz94fu1">
                            <Eye className="w-5 h-5 text-slate-700" data-oid="5y4itzc" />
                            Payment Schedule Details
                        </DialogTitle>
                        <DialogDescription data-oid="ybsiz0s">
                            View complete information about this payment schedule
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSchedule && (
                        <div className="space-y-6" data-oid="lfe79fy">
                            {/* Header Info */}
                            <div className="grid grid-cols-2 gap-6" data-oid="tt4.3he">
                                <div className="space-y-4" data-oid="k4m7qlc">
                                    <div data-oid="f.ox_:1">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="30sd9xu"
                                        >
                                            Entity
                                        </Label>
                                        <div
                                            className="flex items-center gap-2 mt-1"
                                            data-oid="304b-0y"
                                        >
                                            {selectedSchedule.entityType === 'pharmacy' && (
                                                <Building
                                                    className="w-4 h-4 text-cyan-600"
                                                    data-oid="a1am0ml"
                                                />
                                            )}
                                            {selectedSchedule.entityType === 'vendor' && (
                                                <Building
                                                    className="w-4 h-4 text-indigo-600"
                                                    data-oid="0i:pm78"
                                                />
                                            )}
                                            {selectedSchedule.entityType === 'doctor' && (
                                                <User
                                                    className="w-4 h-4 text-emerald-600"
                                                    data-oid="oz69m.5"
                                                />
                                            )}
                                            <div data-oid="tfy96i3">
                                                <p className="font-medium" data-oid="kcstulm">
                                                    {selectedSchedule.entityName}
                                                </p>
                                                <p
                                                    className="text-sm text-slate-500 capitalize"
                                                    data-oid="whc0:up"
                                                >
                                                    {selectedSchedule.entityType}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div data-oid="w_4t28l">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="g_ef7sn"
                                        >
                                            Schedule Type
                                        </Label>
                                        <div
                                            className="flex items-center gap-2 mt-1"
                                            data-oid="tqaiyp_"
                                        >
                                            {selectedSchedule.scheduleType === 'collection' ? (
                                                <ArrowDownRight
                                                    className="w-4 h-4 text-emerald-600"
                                                    data-oid="ad7ufc9"
                                                />
                                            ) : (
                                                <ArrowUpRight
                                                    className="w-4 h-4 text-rose-600"
                                                    data-oid="d0ll872"
                                                />
                                            )}
                                            <span
                                                className="font-medium capitalize"
                                                data-oid="gfz5:uz"
                                            >
                                                {selectedSchedule.scheduleType} Agreement
                                            </span>
                                        </div>
                                    </div>

                                    <div data-oid="o:y48b0">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="jz:4sod"
                                        >
                                            Status
                                        </Label>
                                        <div className="mt-1" data-oid="255hopg">
                                            {getStatusBadge(selectedSchedule.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4" data-oid=".q-q_g0">
                                    <div data-oid="tevx.i4">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="2q8v4w7"
                                        >
                                            Frequency
                                        </Label>
                                        <p
                                            className="font-medium capitalize mt-1"
                                            data-oid="_qp296b"
                                        >
                                            {selectedSchedule.frequency}
                                        </p>
                                    </div>

                                    <div data-oid="-ju0o4j">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="_9w2sqs"
                                        >
                                            Payment Method
                                        </Label>
                                        <div
                                            className="flex items-center gap-2 mt-1"
                                            data-oid="s6x2ldo"
                                        >
                                            <CreditCard
                                                className="w-4 h-4 text-slate-500"
                                                data-oid="hzxtpeq"
                                            />

                                            <span
                                                className="font-medium capitalize"
                                                data-oid="-m3kxg2"
                                            >
                                                {selectedSchedule.paymentMethod?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div data-oid="tk6d98e">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="-ul_00o"
                                        >
                                            Minimum Amount
                                        </Label>
                                        <p className="font-medium mt-1" data-oid="-lvyub6">
                                            {formatCurrency(selectedSchedule.minimumAmount || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div
                                className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg"
                                data-oid="opl_7te"
                            >
                                <div className="text-center" data-oid="4kc9xh3">
                                    <p
                                        className="text-2xl font-bold text-slate-800"
                                        data-oid="jijc2xv"
                                    >
                                        {formatCurrency(selectedSchedule.pendingAmount)}
                                    </p>
                                    <p className="text-sm text-slate-600" data-oid="we6_17n">
                                        Pending Amount
                                    </p>
                                </div>
                                <div className="text-center" data-oid=".9ynzmf">
                                    <p
                                        className="text-2xl font-bold text-emerald-600"
                                        data-oid="ez_r13:"
                                    >
                                        {formatCurrency(selectedSchedule.totalCollected || 0)}
                                    </p>
                                    <p className="text-sm text-slate-600" data-oid="byc9h4i">
                                        Total Collected
                                    </p>
                                </div>
                                <div className="text-center" data-oid="vtrmge7">
                                    <p
                                        className="text-2xl font-bold text-slate-800"
                                        data-oid="c9ayoty"
                                    >
                                        {selectedSchedule.transactionCount || 0}
                                    </p>
                                    <p className="text-sm text-slate-600" data-oid="mzu2_40">
                                        Transactions
                                    </p>
                                </div>
                            </div>

                            {/* Schedule Information */}
                            <div className="grid grid-cols-2 gap-6" data-oid="8xa6dey">
                                <div className="space-y-4" data-oid="y371qr3">
                                    <div data-oid="d_m9t8k">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="xtxsqt3"
                                        >
                                            Next Due Date
                                        </Label>
                                        <div
                                            className="flex items-center gap-2 mt-1"
                                            data-oid="cff631s"
                                        >
                                            <Calendar
                                                className="w-4 h-4 text-slate-500"
                                                data-oid="e9tg7ho"
                                            />

                                            <span className="font-medium" data-oid=":llp2yp">
                                                {formatDate(selectedSchedule.nextDueDate)}
                                            </span>
                                        </div>
                                        {selectedSchedule.status === 'overdue' ? (
                                            <p
                                                className="text-sm text-rose-600 mt-1"
                                                data-oid="2k:uqp0"
                                            >
                                                {getDaysPastDue(selectedSchedule.nextDueDate)} days
                                                overdue
                                            </p>
                                        ) : (
                                            <p
                                                className="text-sm text-slate-500 mt-1"
                                                data-oid=":_atvjo"
                                            >
                                                Due in{' '}
                                                {getDaysUntilDue(selectedSchedule.nextDueDate)} days
                                            </p>
                                        )}
                                    </div>

                                    <div data-oid="u9jj8cx">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="ge1hnrj"
                                        >
                                            Created Date
                                        </Label>
                                        <p className="font-medium mt-1" data-oid="l:fe3bx">
                                            {formatDate(
                                                selectedSchedule.createdAt ||
                                                    new Date().toISOString(),
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4" data-oid="2et4ozs">
                                    <div data-oid="b8ozh-0">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="2c2z.r8"
                                        >
                                            Last Updated
                                        </Label>
                                        <p className="font-medium mt-1" data-oid="b86b:x_">
                                            {formatDateTime(
                                                selectedSchedule.updatedAt ||
                                                    new Date().toISOString(),
                                            )}
                                        </p>
                                    </div>

                                    <div data-oid="dck7m3t">
                                        <Label
                                            className="text-sm font-medium text-slate-600"
                                            data-oid="cuyybo3"
                                        >
                                            Auto Process
                                        </Label>
                                        <div
                                            className="flex items-center gap-2 mt-1"
                                            data-oid="1t_zk4z"
                                        >
                                            {selectedSchedule.autoProcess ? (
                                                <CheckCircle
                                                    className="w-4 h-4 text-emerald-600"
                                                    data-oid="k:.5ug6"
                                                />
                                            ) : (
                                                <XCircle
                                                    className="w-4 h-4 text-slate-400"
                                                    data-oid="6:s69_n"
                                                />
                                            )}
                                            <span className="font-medium" data-oid="8027wqt">
                                                {selectedSchedule.autoProcess
                                                    ? 'Enabled'
                                                    : 'Disabled'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Alert Settings */}
                            {selectedSchedule.alertSettings && (
                                <div className="space-y-4" data-oid=".t.jxrh">
                                    <Label
                                        className="text-lg font-medium text-slate-800"
                                        data-oid="f2::lid"
                                    >
                                        Alert Settings
                                    </Label>
                                    <div
                                        className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg"
                                        data-oid="-hecm6u"
                                    >
                                        <div data-oid="ltpni30">
                                            <Label
                                                className="text-sm font-medium text-slate-600"
                                                data-oid="167mk-."
                                            >
                                                Alerts Enabled
                                            </Label>
                                            <div
                                                className="flex items-center gap-2 mt-1"
                                                data-oid="8wir_b4"
                                            >
                                                {selectedSchedule.alertSettings.enableAlerts ? (
                                                    <Bell
                                                        className="w-4 h-4 text-emerald-600"
                                                        data-oid="b97h6lo"
                                                    />
                                                ) : (
                                                    <BellRing
                                                        className="w-4 h-4 text-slate-400"
                                                        data-oid=".jq2lo:"
                                                    />
                                                )}
                                                <span className="font-medium" data-oid="ab2oafu">
                                                    {selectedSchedule.alertSettings.enableAlerts
                                                        ? 'Yes'
                                                        : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                        <div data-oid="027rrcn">
                                            <Label
                                                className="text-sm font-medium text-slate-600"
                                                data-oid="9:4tl4i"
                                            >
                                                Alert Days Before
                                            </Label>
                                            <p className="font-medium mt-1" data-oid="ic:xslc">
                                                {selectedSchedule.alertSettings.alertDaysBefore ||
                                                    2}{' '}
                                                days
                                            </p>
                                        </div>
                                        <div data-oid="ii8eq.m">
                                            <Label
                                                className="text-sm font-medium text-slate-600"
                                                data-oid="gy9hes-"
                                            >
                                                Overdue Alerts
                                            </Label>
                                            <div
                                                className="flex items-center gap-2 mt-1"
                                                data-oid="cmqk:a2"
                                            >
                                                {selectedSchedule.alertSettings
                                                    .enableOverdueAlerts ? (
                                                    <AlertTriangle
                                                        className="w-4 h-4 text-amber-600"
                                                        data-oid="otps9e5"
                                                    />
                                                ) : (
                                                    <XCircle
                                                        className="w-4 h-4 text-slate-400"
                                                        data-oid="ts2l-st"
                                                    />
                                                )}
                                                <span className="font-medium" data-oid="46krr6z">
                                                    {selectedSchedule.alertSettings
                                                        .enableOverdueAlerts
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </span>
                                            </div>
                                        </div>
                                        <div data-oid="fca_ouu">
                                            <Label
                                                className="text-sm font-medium text-slate-600"
                                                data-oid="bfbem5p"
                                            >
                                                Escalation Days
                                            </Label>
                                            <p className="font-medium mt-1" data-oid="2avysah">
                                                {selectedSchedule.alertSettings.escalationDays || 3}{' '}
                                                days
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedSchedule.notes && (
                                <div data-oid="1xhkn4-">
                                    <Label
                                        className="text-sm font-medium text-slate-600"
                                        data-oid="ugkud7f"
                                    >
                                        Notes
                                    </Label>
                                    <div
                                        className="mt-1 p-3 bg-slate-50 rounded-lg"
                                        data-oid=":ysq893"
                                    >
                                        <p className="text-slate-700" data-oid="283pm71">
                                            {selectedSchedule.notes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4 border-t" data-oid="menrm3g">
                        <Button
                            variant="outline"
                            onClick={() => setScheduleDetailsModalOpen(false)}
                            data-oid="l_9yq-h"
                        >
                            Close
                        </Button>
                        {selectedSchedule?.pendingAmount && selectedSchedule.pendingAmount > 0 && (
                            <Button
                                onClick={() => {
                                    setScheduleDetailsModalOpen(false);
                                    setProcessTransactionModalOpen(true);
                                }}
                                className={
                                    selectedSchedule.scheduleType === 'collection'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-rose-600 hover:bg-rose-700'
                                }
                                data-oid="qsj2d4."
                            >
                                <Play className="w-4 h-4 mr-2" data-oid="alyd56." />
                                Process Transaction
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Enhanced Process Transaction Modal */}
            <AlertDialog
                open={processTransactionModalOpen}
                onOpenChange={setProcessTransactionModalOpen}
                data-oid="09ez8jr"
            >
                <AlertDialogContent className="max-w-2xl" data-oid="oo13r6d">
                    <AlertDialogHeader data-oid="4-9uegq">
                        <AlertDialogTitle
                            className="flex items-center space-x-2 text-xl"
                            data-oid="mdkhwfj"
                        >
                            {selectedSchedule?.scheduleType === 'collection' ? (
                                <>
                                    <HandCoins
                                        className="w-6 h-6 text-emerald-600"
                                        data-oid="p.t2:0f"
                                    />

                                    <span data-oid="0clq9bh">Confirm Commission Collection</span>
                                </>
                            ) : (
                                <>
                                    <Banknote
                                        className="w-6 h-6 text-rose-600"
                                        data-oid="nk_zkxq"
                                    />

                                    <span data-oid="4r3tcp0">Confirm Doctor Payout</span>
                                </>
                            )}
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-lg" data-oid="cxni9jm">
                            {selectedSchedule?.scheduleType === 'collection' ? (
                                <div className="space-y-2" data-oid="7655w_g">
                                    <p data-oid="2glua15">
                                        You are about to confirm that you have{' '}
                                        <strong data-oid="a1dr5fw">collected commission</strong>{' '}
                                        from:
                                    </p>
                                    <div
                                        className="bg-emerald-50 p-4 rounded-lg border border-emerald-200"
                                        data-oid="a-n-v_4"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="rqzr98j"
                                        >
                                            <div data-oid=":8ncxs5">
                                                <p
                                                    className="font-semibold text-slate-800"
                                                    data-oid="ma7t4_l"
                                                >
                                                    {selectedSchedule?.entityName}
                                                </p>
                                                <p
                                                    className="text-slate-600 capitalize"
                                                    data-oid="q0na_gk"
                                                >
                                                    {selectedSchedule?.entityType}
                                                </p>
                                            </div>
                                            <div className="text-right" data-oid="w3wngak">
                                                <p
                                                    className="text-2xl font-bold text-emerald-700"
                                                    data-oid="fs1kv:r"
                                                >
                                                    {formatCurrency(
                                                        selectedSchedule?.pendingAmount || 0,
                                                    )}
                                                </p>
                                                <p
                                                    className="text-sm text-emerald-600"
                                                    data-oid="me:0_ad"
                                                >
                                                    Commission to collect
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-2 text-sm text-slate-600"
                                        data-oid="7z4tw_u"
                                    >
                                        <AlertTriangle
                                            className="w-4 h-4 text-amber-500"
                                            data-oid="vly:5y-"
                                        />
                                        Only confirm this if you have actually received the money
                                        from the {selectedSchedule?.entityType}.
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2" data-oid="astllyn">
                                    <p data-oid="c_5gzwe">
                                        You are about to confirm that you have{' '}
                                        <strong data-oid="jgy8x7c">paid commission</strong> to:
                                    </p>
                                    <div
                                        className="bg-rose-50 p-4 rounded-lg border border-rose-200"
                                        data-oid="paof:.p"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="aj8x_j:"
                                        >
                                            <div data-oid="1fywqd2">
                                                <p
                                                    className="font-semibold text-slate-800"
                                                    data-oid="ae4qfvm"
                                                >
                                                    {selectedSchedule?.entityName}
                                                </p>
                                                <p className="text-slate-600" data-oid="qaggumq">
                                                    Doctor - Referral Commission
                                                </p>
                                            </div>
                                            <div className="text-right" data-oid="5bx0is_">
                                                <p
                                                    className="text-2xl font-bold text-rose-700"
                                                    data-oid="vdl1fak"
                                                >
                                                    {formatCurrency(
                                                        selectedSchedule?.pendingAmount || 0,
                                                    )}
                                                </p>
                                                <p
                                                    className="text-sm text-rose-600"
                                                    data-oid="7yo7-cy"
                                                >
                                                    Commission to pay
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-2 text-sm text-slate-600"
                                        data-oid="9lxm2zc"
                                    >
                                        <AlertTriangle
                                            className="w-4 h-4 text-amber-500"
                                            data-oid="ik62l4p"
                                        />
                                        Only confirm this if you have actually sent the money to the
                                        doctor.
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-4" data-oid="1w:fmq4">
                        <div data-oid="cum6a5:">
                            <Label
                                htmlFor="transaction-notes"
                                className="text-base font-medium"
                                data-oid="5_tnmde"
                            >
                                Transaction Notes
                            </Label>
                            <Textarea
                                id="transaction-notes"
                                value={transactionNotes}
                                onChange={(e) => setTransactionNotes(e.target.value)}
                                placeholder={
                                    selectedSchedule?.scheduleType === 'collection'
                                        ? 'e.g., Collected cash during pharmacy visit, Bank transfer received, etc.'
                                        : 'e.g., Paid via bank transfer, Mobile wallet payment sent, etc.'
                                }
                                className="min-h-[100px]"
                                data-oid=":nt1b19"
                            />
                        </div>

                        {/* Payment Method Info */}
                        <div className="bg-gray-50 p-4 rounded-lg" data-oid="5w6g56m">
                            <div className="flex items-center space-x-2 mb-2" data-oid="9kxr:p:">
                                <CreditCard className="w-4 h-4 text-gray-600" data-oid="er8_mji" />
                                <span className="font-medium text-gray-700" data-oid="lg2tjis">
                                    Payment Method
                                </span>
                            </div>
                            <p className="text-gray-600 capitalize" data-oid="o-t7-3k">
                                {selectedSchedule?.paymentMethod?.replace('_', ' ')}
                            </p>
                        </div>
                    </div>

                    <AlertDialogFooter className="flex-col space-y-2" data-oid="5vnrb6j">
                        <div className="flex justify-between w-full" data-oid="f25:tf_">
                            <AlertDialogCancel
                                onClick={() => setTransactionNotes('')}
                                data-oid="kxvhdp7"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleProcessTransaction}
                                className={`${
                                    selectedSchedule?.scheduleType === 'collection'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-rose-600 hover:bg-rose-700'
                                } min-w-[200px]`}
                                data-oid="yh4-gzd"
                            >
                                {selectedSchedule?.scheduleType === 'collection' ? (
                                    <>
                                        <HandCoins className="w-4 h-4 mr-2" data-oid="_6l9h8:" />
                                        Confirm Collection
                                    </>
                                ) : (
                                    <>
                                        <Banknote className="w-4 h-4 mr-2" data-oid="mgkelc4" />
                                        Confirm Payout
                                    </>
                                )}
                            </AlertDialogAction>
                        </div>
                        <p className="text-xs text-gray-500 text-center" data-oid="ob9gx6l">
                            This action will mark the {selectedSchedule?.scheduleType} as completed
                            and schedule the next one.
                        </p>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
