'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { revenueCalculationService } from '@/lib/services/revenueCalculationService';
import { kpiAnalyticsService } from '@/lib/services/kpiAnalyticsService';
import { adminAnalyticsService } from '@/lib/services/adminAnalyticsService';
import {
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingCart,
    DollarSign,
    Activity,
    Bell,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    FileText,
    Building,
    Stethoscope,
    Package,
    CreditCard,
    MapPin,
    UserPlus,
    BarChart3,
    Target,
    Heart,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    ExternalLink,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Zap,
} from 'lucide-react';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';
import {
    ComposedChart,
    Bar,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface ComprehensiveKPIs {
    // Core Revenue & Financial KPIs
    totalRevenue: number;
    platformRevenue: number;
    averageOrderValue: number;
    revenueGrowth: number;
    customerAcquisitionCost: number;
    customerLifetimeValue: number;
    // Order & Prescription KPIs
    totalOrders: number;
    prescriptionOrders: number;
    prescriptionUploadRate: number;
    orderCompletionRate: number;
    ordersToday: number;
    prescriptionsProcessedToday: number;
    // Customer KPIs
    totalCustomers: number;
    activeCustomers: number;
    customerRetentionRate: number;
    customerSatisfactionScore: number;
    newCustomersThisMonth: number;
    // Platform & System KPIs
    totalPharmacies: number;
    activePharmacies: number;
    pendingPharmacies: number;
    systemUptime: number;
    // Money & Transactions
    totalTransactions: number;
    pendingPayments: number;
    commissionsPaid: number;
    lastUpdated: string;
}

interface AdminModuleOverview {
    id: string;
    name: string;
    description: string;
    icon: any;
    stats: {
        total: number;
        active?: number;
        pending?: number;
        growth?: number;
    };
    status: 'healthy' | 'warning' | 'critical';
    lastActivity: string;
    quickActions: string[];
}

export default function AdminDashboard() {
    const [kpiMetrics, setKpiMetrics] = useState<ComprehensiveKPIs | null>(null);
    const [moduleOverviews, setModuleOverviews] = useState<AdminModuleOverview[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        loadDashboardData();
        const interval = autoRefresh ? setInterval(loadDashboardData, 30000) : null;
        return () => {
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRefresh, selectedPeriod]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            // Simulate loading time for real-time feel
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Get comprehensive analytics
            const revenueAnalytics = revenueCalculationService.getRevenueAnalytics(selectedPeriod);
            const realTimeKPIs = kpiAnalyticsService.calculateRealTimeKPIs();
            const customerAnalytics = kpiAnalyticsService.calculateCustomerAnalytics();
            const adminKPIs = adminAnalyticsService.getKPIs();
            const activities = adminAnalyticsService.getRecentActivities();
            const alerts = adminAnalyticsService.getSystemAlerts();

            // Calculate comprehensive KPIs
            const comprehensiveKPIs: ComprehensiveKPIs = {
                // Core Revenue & Financial KPIs
                totalRevenue: revenueAnalytics.overview.totalRevenue,
                platformRevenue: revenueAnalytics.overview.platformRevenue,
                averageOrderValue: revenueAnalytics.overview.averageOrderValue,
                customerAcquisitionCost: 45.5, // Mock CAC
                customerLifetimeValue: customerAnalytics.averageLifetimeValue,
                revenueGrowth: revenueAnalytics.overview.revenueGrowth,

                // Order & Prescription KPIs
                totalOrders: realTimeKPIs.totalOrders,
                prescriptionOrders: realTimeKPIs.totalPrescriptions,
                prescriptionUploadRate: realTimeKPIs.prescriptionUploadRate,
                orderCompletionRate: realTimeKPIs.orderCompletionRate,
                ordersToday: realTimeKPIs.ordersToday,
                prescriptionsProcessedToday: realTimeKPIs.prescriptionsProcessedToday,

                // Customer & Retention KPIs
                totalCustomers: realTimeKPIs.totalCustomers,
                activeCustomers: customerAnalytics.activeCustomers,
                customerRetentionRate: realTimeKPIs.customerRetentionRate,
                customerSatisfactionScore: 4.7, // Mock satisfaction score
                newCustomersThisMonth: realTimeKPIs.newCustomersThisMonth,

                // Platform & System KPIs
                totalPharmacies: realTimeKPIs.totalPharmacies,
                activePharmacies: realTimeKPIs.activePharmacies,
                pendingPharmacies: realTimeKPIs.pendingPharmacies,
                systemUptime: realTimeKPIs.systemUptime,

                // Money & Transactions
                totalTransactions: 2847,
                pendingPayments: 12,
                commissionsPaid: revenueAnalytics.commissionBreakdown.totalCommission,
                lastUpdated: new Date().toISOString(),
            };

            // Generate module overviews for all admin sections
            const modules: AdminModuleOverview[] = [
                {
                    id: 'users',
                    name: 'User Management',
                    description: 'Manage all platform users and roles',
                    icon: Users,
                    stats: {
                        total: adminKPIs.users.total,
                        active: adminKPIs.users.customers,
                        growth: 12.5,
                    },
                    status: 'healthy',
                    lastActivity: '2 minutes ago',
                    quickActions: ['Add User', 'View Reports', 'Manage Roles'],
                },
                {
                    id: 'pharmacies',
                    name: 'Pharmacy Management',
                    description: 'Monitor and manage pharmacy partners',
                    icon: Building,
                    stats: {
                        total: comprehensiveKPIs.totalPharmacies,
                        active: comprehensiveKPIs.activePharmacies,
                        pending: comprehensiveKPIs.pendingPharmacies,
                    },
                    status: comprehensiveKPIs.pendingPharmacies > 0 ? 'warning' : 'healthy',
                    lastActivity: '15 minutes ago',
                    quickActions: [
                        'Review Applications',
                        'Performance Analytics',
                        'Commission Settings',
                    ],
                },
                {
                    id: 'orders',
                    name: 'Order Management',
                    description: 'Track and process customer orders',
                    icon: ShoppingCart,
                    stats: {
                        total: comprehensiveKPIs.totalOrders,
                        active: comprehensiveKPIs.ordersToday,
                        growth: 18.3,
                    },
                    status: 'healthy',
                    lastActivity: '1 minute ago',
                    quickActions: ['Process Orders', 'View Analytics', 'Handle Returns'],
                },
                {
                    id: 'prescriptions',
                    name: 'Prescription Processing',
                    description: 'Manage prescription uploads and processing',
                    icon: FileText,
                    stats: {
                        total: comprehensiveKPIs.prescriptionOrders,
                        active: comprehensiveKPIs.prescriptionsProcessedToday,
                        growth: 22.1,
                    },
                    status: 'healthy',
                    lastActivity: '5 minutes ago',
                    quickActions: ['Review Queue', 'Reader Analytics', 'Quality Control'],
                },
                {
                    id: 'doctors',
                    name: 'Doctor Network',
                    description: 'Manage healthcare provider partnerships',
                    icon: Stethoscope,
                    stats: {
                        total: adminKPIs.users.doctors,
                        active: 142,
                        growth: 8.7,
                    },
                    status: 'healthy',
                    lastActivity: '30 minutes ago',
                    quickActions: ['Verify Doctors', 'QR Management', 'Commission Tracking'],
                },
                {
                    id: 'vendors',
                    name: 'Vendor Management',
                    description: 'Oversee product suppliers and inventory',
                    icon: Package,
                    stats: {
                        total: adminKPIs.users.vendors,
                        active: 38,
                        growth: 15.2,
                    },
                    status: 'healthy',
                    lastActivity: '1 hour ago',
                    quickActions: [
                        'Inventory Review',
                        'Performance Metrics',
                        'Contract Management',
                    ],
                },
                {
                    id: 'transactions',
                    name: 'Financial Transactions',
                    description: 'Monitor payments and financial flows',
                    icon: CreditCard,
                    stats: {
                        total: comprehensiveKPIs.totalTransactions,
                        pending: comprehensiveKPIs.pendingPayments,
                        growth: 16.8,
                    },
                    status: comprehensiveKPIs.pendingPayments > 10 ? 'warning' : 'healthy',
                    lastActivity: '3 minutes ago',
                    quickActions: ['Process Payments', 'Commission Reports', 'Refund Management'],
                },
                {
                    id: 'cities',
                    name: 'Geographic Coverage',
                    description: 'Manage city operations and expansion',
                    icon: MapPin,
                    stats: {
                        total: adminKPIs.cities.total,
                        active: adminKPIs.cities.enabled,
                        growth: 5.3,
                    },
                    status: 'healthy',
                    lastActivity: '2 hours ago',
                    quickActions: ['Expand Coverage', 'City Analytics', 'Pharmacy Assignment'],
                },
            ];

            setKpiMetrics(comprehensiveKPIs);
            setModuleOverviews(modules);
            setRecentActivities(activities);
            setSystemAlerts(alerts);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
    const formatNumber = (value: number) => value.toLocaleString();

    const exportData = (section: string) => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `cura_${section}_${timestamp}.csv`;
        console.log(`Exporting ${section} data to ${filename}`);
        // In real implementation, this would trigger actual export
    };

    if (isLoading && !kpiMetrics) {
        return (
            <div className="min-h-screen bg-[#F1F6F9] p-6" data-oid="7a7nhn1">
                <div className="max-w-7xl mx-auto space-y-6" data-oid="4_x9nfi">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="082p6ex">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-white/50 animate-pulse rounded-xl h-32 border border-[#9BA4B4]/20"
                                data-oid="-59aex:"
                            />
                        ))}
                    </div>
                    <div
                        className="bg-white/50 animate-pulse rounded-xl h-96 border border-[#9BA4B4]/20"
                        data-oid="8lzx8cu"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F6F9] space-y-6" data-oid="erzp2ro">
            {/* Main Dashboard Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
                data-oid="3c-rrp7"
            >
                <TabsList
                    className="bg-white border border-[#9BA4B4]/20 p-1 rounded-xl"
                    data-oid="-pw:_id"
                >
                    <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-[#14274E] data-[state=active]:text-white"
                        data-oid="k92y3.-"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" data-oid="u4il7-_" />
                        Overview & KPIs
                    </TabsTrigger>
                    <TabsTrigger
                        value="modules"
                        className="data-[state=active]:bg-[#14274E] data-[state=active]:text-white"
                        data-oid="8mak.wn"
                    >
                        <Activity className="w-4 h-4 mr-2" data-oid="iqsl3ns" />
                        Module Analytics
                    </TabsTrigger>
                    <TabsTrigger
                        value="realtime"
                        className="data-[state=active]:bg-[#14274E] data-[state=active]:text-white"
                        data-oid="olhtf:g"
                    >
                        <Zap className="w-4 h-4 mr-2" data-oid="2:d480." />
                        Real-time Metrics
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab - Core KPIs */}
                <TabsContent value="overview" className="space-y-6" data-oid="mwy26ab">
                    {/* Primary KPI Cards */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6"
                        data-oid="z1g5-iy"
                    >
                        {/* Total Revenue */}
                        <Card
                            className="bg-gradient-to-br from-[#14274E] to-[#394867] text-white border-0 shadow-lg"
                            data-oid="uzpc3l-"
                        >
                            <CardHeader className="pb-3" data-oid="kpt95q:">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="z19yaow"
                                >
                                    <CardTitle
                                        className="text-sm font-medium opacity-90"
                                        data-oid="xftc_k9"
                                    >
                                        Total Revenue
                                    </CardTitle>
                                    <DollarSign className="h-5 w-5 opacity-90" data-oid="_f4.piw" />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="h20i_og">
                                <div className="text-3xl font-bold mb-2" data-oid="f8tkyvf">
                                    {formatCurrency(kpiMetrics?.totalRevenue || 0)}
                                </div>
                                <div
                                    className="flex items-center space-x-2 text-sm opacity-90"
                                    data-oid="_-3icg1"
                                >
                                    <TrendingUp className="h-4 w-4" data-oid=":o4t3p8" />
                                    <span data-oid="r-.6p3f">
                                        +{kpiMetrics?.revenueGrowth || 0}% from last period
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-3 text-white/80 hover:text-white hover:bg-white/10"
                                    onClick={() => exportData('revenue')}
                                    data-oid="-:jun3o"
                                >
                                    <Download className="w-3 h-3 mr-1" data-oid="vl-dnv3" />
                                    Export
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Average Order Value (AOV) */}
                        <Card
                            className="bg-white border border-[#9BA4B4]/20 shadow-sm hover:shadow-md transition-shadow"
                            data-oid="phsx5zz"
                        >
                            <CardHeader className="pb-3" data-oid="nuu:2i_">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="51unzx:"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-[#394867]"
                                        data-oid="9tfgbi:"
                                    >
                                        Average Order Value
                                    </CardTitle>
                                    <ShoppingCart
                                        className="h-5 w-5 text-[#394867]"
                                        data-oid="dam-.7y"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="mukh3:0">
                                <div
                                    className="text-3xl font-bold text-[#14274E] mb-2"
                                    data-oid="9zmtr.e"
                                >
                                    {formatCurrency(kpiMetrics?.averageOrderValue || 0)}
                                </div>
                                <div
                                    className="flex items-center space-x-2 text-sm text-green-600"
                                    data-oid="jgx53d:"
                                >
                                    <TrendingUp className="h-4 w-4" data-oid="j9vvtqt" />
                                    <span data-oid="qs.:ek2">+12.5% from last period</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="mt-2 text-[#394867] border-[#394867]/20"
                                    data-oid="hh.4c_4"
                                >
                                    {formatNumber(kpiMetrics?.totalOrders || 0)} orders
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Secondary KPI Cards */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        data-oid="yeckw2w"
                    >
                        {/* Prescription Upload Rate */}
                        <Card
                            className="bg-white border border-[#9BA4B4]/20 shadow-sm"
                            data-oid="qvj758h"
                        >
                            <CardHeader className="pb-3" data-oid="4_82k7c">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="tg0dbxb"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-[#394867]"
                                        data-oid="7-gpxcm"
                                    >
                                        Prescription Upload Rate
                                    </CardTitle>
                                    <FileText
                                        className="h-5 w-5 text-[#394867]"
                                        data-oid="lb8lm25"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="nm4umqx">
                                <div
                                    className="text-2xl font-bold text-[#14274E] mb-2"
                                    data-oid="c.t6ha9"
                                >
                                    {formatPercentage(kpiMetrics?.prescriptionUploadRate || 0)}
                                </div>
                                <div className="text-sm text-[#9BA4B4]" data-oid="til7s0.">
                                    {formatNumber(kpiMetrics?.prescriptionOrders || 0)} prescription
                                    orders
                                </div>
                            </CardContent>
                        </Card>

                        {/* Platform Revenue */}
                        <Card
                            className="bg-white border border-[#9BA4B4]/20 shadow-sm"
                            data-oid="-w0iikb"
                        >
                            <CardHeader className="pb-3" data-oid="f8c3nwp">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="q6s_myu"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-[#394867]"
                                        data-oid="qci60z7"
                                    >
                                        Platform Revenue
                                    </CardTitle>
                                    <BarChart3
                                        className="h-5 w-5 text-[#394867]"
                                        data-oid="8fld_ez"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="v_nzez-">
                                <div
                                    className="text-2xl font-bold text-[#14274E] mb-2"
                                    data-oid="_1si6:y"
                                >
                                    {formatCurrency(kpiMetrics?.platformRevenue || 0)}
                                </div>
                                <div className="text-sm text-[#9BA4B4]" data-oid="wmt0dxo">
                                    After commissions:{' '}
                                    {formatCurrency(kpiMetrics?.commissionsPaid || 0)}
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Uptime */}
                        <Card
                            className="bg-white border border-[#9BA4B4]/20 shadow-sm"
                            data-oid="b6plyj-"
                        >
                            <CardHeader className="pb-3" data-oid="twul4uz">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="1jqs-ye"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-[#394867]"
                                        data-oid="du:y_ec"
                                    >
                                        System Uptime
                                    </CardTitle>
                                    <Activity
                                        className="h-5 w-5 text-[#394867]"
                                        data-oid="u7vjwg1"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="6b767et">
                                <div
                                    className="text-2xl font-bold text-[#14274E] mb-2"
                                    data-oid="fz0naci"
                                >
                                    {formatPercentage(kpiMetrics?.systemUptime || 0)}
                                </div>
                                <div className="flex items-center space-x-2" data-oid="wv_n9yk">
                                    <div
                                        className="w-2 h-2 bg-green-500 rounded-full"
                                        data-oid="8lr6-i."
                                    />

                                    <span className="text-sm text-green-600" data-oid="ol4dwn4">
                                        All systems operational
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Revenue Analytics - Simplified */}
                    <Card
                        className="bg-white border border-[#9BA4B4]/20 shadow-sm"
                        data-oid="v_iawb7"
                    >
                        <CardHeader data-oid="7sr43xk">
                            <CardTitle className="text-[#14274E]" data-oid="px1hi-r">
                                Revenue Analytics
                            </CardTitle>
                            <CardDescription className="text-[#9BA4B4]" data-oid=":-ea:i-">
                                Platform vs Commission distribution
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="_1p4u8x">
                            <div className="grid grid-cols-1 gap-6" data-oid="-rmdxzv">
                                <ChartContainer
                                    config={{
                                        platformRevenue: {
                                            label: 'Platform Revenue',
                                            color: '#14274E',
                                        },
                                        pharmacyCommission: {
                                            label: 'Pharmacy Commission',
                                            color: '#394867',
                                        },
                                        doctorCommission: {
                                            label: 'Doctor Commission',
                                            color: '#9BA4B4',
                                        },
                                    }}
                                    className="h-[200px]"
                                    data-oid="ezh4fmm"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                        data-oid="yazyqjp"
                                    >
                                        <PieChart data-oid="v0b:92i">
                                            <Pie
                                                data={[
                                                    {
                                                        name: 'Platform Revenue',
                                                        value: kpiMetrics?.platformRevenue || 0,
                                                        fill: '#14274E',
                                                    },
                                                    {
                                                        name: 'Pharmacy Commission',
                                                        value: revenueCalculationService.getRevenueAnalytics(
                                                            selectedPeriod,
                                                        ).commissionBreakdown.pharmacyCommission,
                                                        fill: '#394867',
                                                    },
                                                    {
                                                        name: 'Doctor Commission',
                                                        value: revenueCalculationService.getRevenueAnalytics(
                                                            selectedPeriod,
                                                        ).commissionBreakdown.doctorCommission,
                                                        fill: '#9BA4B4',
                                                    },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                                data-oid="u77shju"
                                            >
                                                {[
                                                    { fill: '#14274E' },
                                                    { fill: '#394867' },
                                                    { fill: '#9BA4B4' },
                                                ].map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.fill}
                                                        data-oid="kr2oin-"
                                                    />
                                                ))}
                                            </Pie>
                                            <ChartTooltip
                                                content={<ChartTooltipContent data-oid="i8jgwjj" />}
                                                formatter={(value) => [
                                                    formatCurrency(Number(value)),
                                                    '',
                                                ]}
                                                data-oid="6zrqnj2"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>

                                {/* Revenue Summary Cards */}
                                <div className="grid grid-cols-3 gap-3" data-oid="iz-sy0h">
                                    <div
                                        className="text-center p-3 bg-[#F1F6F9] rounded-lg border border-[#9BA4B4]/10"
                                        data-oid="qa8:67e"
                                    >
                                        <div
                                            className="text-lg font-bold text-[#14274E]"
                                            data-oid="e1s7aa."
                                        >
                                            {formatCurrency(kpiMetrics?.platformRevenue || 0)}
                                        </div>
                                        <div className="text-xs text-[#9BA4B4]" data-oid="hbq:x8u">
                                            Platform Share
                                        </div>
                                    </div>
                                    <div
                                        className="text-center p-3 bg-[#F1F6F9] rounded-lg border border-[#9BA4B4]/10"
                                        data-oid="6b7lclg"
                                    >
                                        <div
                                            className="text-lg font-bold text-[#394867]"
                                            data-oid="eus-uh5"
                                        >
                                            {formatCurrency(
                                                revenueCalculationService.getRevenueAnalytics(
                                                    selectedPeriod,
                                                ).commissionBreakdown.pharmacyCommission,
                                            )}
                                        </div>
                                        <div className="text-xs text-[#9BA4B4]" data-oid="lsak98m">
                                            Pharmacy Commission
                                        </div>
                                    </div>
                                    <div
                                        className="text-center p-3 bg-[#F1F6F9] rounded-lg border border-[#9BA4B4]/10"
                                        data-oid="vcfz55o"
                                    >
                                        <div
                                            className="text-lg font-bold text-[#9BA4B4]"
                                            data-oid="pf2mz6d"
                                        >
                                            {formatCurrency(
                                                revenueCalculationService.getRevenueAnalytics(
                                                    selectedPeriod,
                                                ).commissionBreakdown.doctorCommission,
                                            )}
                                        </div>
                                        <div className="text-xs text-[#9BA4B4]" data-oid="mt0r:u2">
                                            Doctor Commission
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Module Analytics Tab */}
                <TabsContent value="modules" className="space-y-6" data-oid="5g6mm.6">
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        data-oid="tbkd4ch"
                    >
                        {moduleOverviews.map((module) => (
                            <Card
                                key={module.id}
                                className="bg-white border border-[#9BA4B4]/20 shadow-sm hover:shadow-md transition-all duration-200"
                                data-oid="byx17yk"
                            >
                                <CardHeader className="pb-3" data-oid="blrulvg">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="0f-xi24"
                                    >
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="x23sv_m"
                                        >
                                            <div
                                                className="p-2 bg-[#F1F6F9] rounded-lg"
                                                data-oid="s9yv1b."
                                            >
                                                <module.icon
                                                    className="h-5 w-5 text-[#14274E]"
                                                    data-oid="1.f-i__"
                                                />
                                            </div>
                                            <div data-oid="r-zebmj">
                                                <CardTitle
                                                    className="text-[#14274E] text-lg"
                                                    data-oid="ws80na_"
                                                >
                                                    {module.name}
                                                </CardTitle>
                                                <CardDescription
                                                    className="text-[#9BA4B4] text-sm"
                                                    data-oid="rz2-gof"
                                                >
                                                    {module.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                module.status === 'healthy'
                                                    ? 'bg-green-500'
                                                    : module.status === 'warning'
                                                      ? 'bg-yellow-500'
                                                      : 'bg-red-500'
                                            }`}
                                            data-oid="-puxilk"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4" data-oid="pqubh-f">
                                    <div className="grid grid-cols-2 gap-4" data-oid="8b:qlu2">
                                        <div data-oid="qys2cn_">
                                            <div
                                                className="text-2xl font-bold text-[#14274E]"
                                                data-oid="ay:x2gl"
                                            >
                                                {formatNumber(module.stats.total)}
                                            </div>
                                            <div
                                                className="text-sm text-[#9BA4B4]"
                                                data-oid="g_y9wlz"
                                            >
                                                Total
                                            </div>
                                        </div>

                                        {module.stats.active !== undefined && (
                                            <div data-oid=":5_fl29">
                                                <div
                                                    className="text-2xl font-bold text-[#394867]"
                                                    data-oid="fi3yekx"
                                                >
                                                    {formatNumber(module.stats.active)}
                                                </div>
                                                <div
                                                    className="text-sm text-[#9BA4B4]"
                                                    data-oid="hm:bi.x"
                                                >
                                                    Active
                                                </div>
                                            </div>
                                        )}

                                        {module.stats.pending !== undefined &&
                                            module.stats.pending > 0 && (
                                                <div data-oid="xgf-d_p">
                                                    <div
                                                        className="text-2xl font-bold text-orange-600"
                                                        data-oid="n.fiqru"
                                                    >
                                                        {formatNumber(module.stats.pending)}
                                                    </div>
                                                    <div
                                                        className="text-sm text-[#9BA4B4]"
                                                        data-oid="im14qmt"
                                                    >
                                                        Pending
                                                    </div>
                                                </div>
                                            )}

                                        {module.stats.growth !== undefined && (
                                            <div data-oid="b.h1dr-">
                                                <div
                                                    className="text-lg font-bold text-green-600"
                                                    data-oid="6:s75j2"
                                                >
                                                    +{module.stats.growth}%
                                                </div>
                                                <div
                                                    className="text-sm text-[#9BA4B4]"
                                                    data-oid="4lto_6u"
                                                >
                                                    Growth
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Fixed the closing div tag here */}
                                    <div
                                        className="pt-3 border-t border-[#9BA4B4]/10"
                                        data-oid="67m7_qk"
                                    >
                                        <div
                                            className="text-xs text-[#9BA4B4] text-center"
                                            data-oid="ltrm8dy"
                                        >
                                            Last activity: {module.lastActivity}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Real-time Metrics Tab */}
                <TabsContent value="realtime" className="space-y-6" data-oid="l_hylsw">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-oid="fsl60f_">
                        {/* Real-time Activity Feed */}
                        <div className="lg:col-span-2" data-oid=".sxhsl1">
                            <Card
                                className="bg-white border border-[#9BA4B4]/20 shadow-sm"
                                data-oid=".4778wn"
                            >
                                <CardHeader data-oid="yfdtp_p">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="_mi5h_e"
                                    >
                                        <div data-oid="ol7t86a">
                                            <CardTitle
                                                className="text-[#14274E]"
                                                data-oid="6zptbw1"
                                            >
                                                Live Activity Feed
                                            </CardTitle>
                                            <CardDescription
                                                className="text-[#9BA4B4]"
                                                data-oid="50lf:4j"
                                            >
                                                Real-time platform activities and updates
                                            </CardDescription>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid=".h8v8.o"
                                        >
                                            <div
                                                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                                data-oid="hbvh2am"
                                            />

                                            <span
                                                className="text-sm text-[#394867]"
                                                data-oid="qh703:l"
                                            >
                                                Live
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent data-oid="h.-5b74">
                                    <div
                                        className="space-y-4 max-h-96 overflow-y-auto"
                                        data-oid="sl2shxy"
                                    >
                                        {recentActivities.slice(0, 8).map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-[#F1F6F9] transition-colors"
                                                data-oid="hbi.7wy"
                                            >
                                                <Avatar
                                                    className="h-8 w-8 flex-shrink-0"
                                                    data-oid="2a64mu_"
                                                >
                                                    <AvatarFallback
                                                        className="bg-[#14274E] text-white text-xs"
                                                        data-oid="6w5bldw"
                                                    >
                                                        {activity.title.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0" data-oid="x2sxpfa">
                                                    <p
                                                        className="text-sm font-medium text-[#14274E] truncate"
                                                        data-oid="w0q:fr4"
                                                    >
                                                        {activity.title}
                                                    </p>
                                                    <p
                                                        className="text-xs text-[#9BA4B4] truncate"
                                                        data-oid="pkosxrl"
                                                    >
                                                        {activity.subtitle}
                                                    </p>
                                                </div>
                                                <div
                                                    className="flex items-center space-x-2 flex-shrink-0"
                                                    data-oid="0ptanj-"
                                                >
                                                    {activity.value && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs border-[#394867]/20 text-[#394867]"
                                                            data-oid="kkdv9ns"
                                                        >
                                                            {activity.value}
                                                        </Badge>
                                                    )}
                                                    <span
                                                        className="text-xs text-[#9BA4B4]"
                                                        data-oid="x2gh_tp"
                                                    >
                                                        {activity.time}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Today's Metrics */}
                        <Card
                            className="bg-white border border-[#9BA4B4]/20 shadow-sm"
                            data-oid="fv_hne:"
                        >
                            <CardHeader data-oid="c982z_x">
                                <CardTitle className="text-[#14274E]" data-oid=".h.ei_w">
                                    Today{"'"}s Metrics
                                </CardTitle>
                                <CardDescription className="text-[#9BA4B4]" data-oid="mxcr_28">
                                    Real-time daily performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="hbnkbh2">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="t6_58el"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="0:wk0oq">
                                        Orders Today
                                    </span>
                                    <span
                                        className="text-lg font-bold text-[#14274E]"
                                        data-oid="g521u.:"
                                    >
                                        {kpiMetrics?.ordersToday || 0}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="vv45:_z"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="gyhw1u-">
                                        Prescriptions Processed
                                    </span>
                                    <span
                                        className="text-lg font-bold text-[#14274E]"
                                        data-oid="w88.bnu"
                                    >
                                        {kpiMetrics?.prescriptionsProcessedToday || 0}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="-so084e"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="s7t3ko9">
                                        Pending Payments
                                    </span>
                                    <span
                                        className="text-lg font-bold text-orange-600"
                                        data-oid="pchj-nf"
                                    >
                                        {kpiMetrics?.pendingPayments || 0}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="27_wep:"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="bscwn05">
                                        Active Pharmacies
                                    </span>
                                    <span
                                        className="text-lg font-bold text-green-600"
                                        data-oid="nim:hhx"
                                    >
                                        {kpiMetrics?.activePharmacies || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
