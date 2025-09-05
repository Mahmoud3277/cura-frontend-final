'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    realTimeAnalyticsService,
    RevenueAnalytics,
    OrderAnalytics,
    UserAnalytics,
    PrescriptionAnalytics,
    PharmacyAnalytics,
    SystemAnalytics,
    LiveMetrics,
    AnalyticsTimeframe,
} from '@/lib/services/realTimeAnalyticsService';
import {
    BarChart3,
    DollarSign,
    Package,
    Users,
    Activity,
    TrendingUp,
    Download,
    RefreshCw,
    Filter,
    Clock,
} from 'lucide-react';
import { OrderTimingAnalytics } from '@/components/admin/OrderTimingAnalytics';
import { DashboardCard, cardGradients } from '@/components/dashboard/DashboardCard';
import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState<
        | 'overview'
        | 'revenue'
        | 'orders'
        | 'users'
        | 'prescriptions'
        | 'pharmacies'
        | 'system'
        | 'timing'
    >('overview');
    const [timeframe, setTimeframe] = useState('30d');
    const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
    const [orderData, setOrderData] = useState<OrderAnalytics | null>(null);
    const [userData, setUserData] = useState<UserAnalytics | null>(null);
    const [prescriptionData, setPrescriptionData] = useState<PrescriptionAnalytics | null>(null);
    const [pharmacyData, setPharmacyData] = useState<PharmacyAnalytics | null>(null);
    const [systemData, setSystemData] = useState<SystemAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const timeframes = realTimeAnalyticsService.getTimeframes();

    useEffect(() => {
        loadAnalyticsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeframe]);

    useEffect(() => {
        // Subscribe to live metrics updates
        const unsubscribe = realTimeAnalyticsService.subscribe((data) => {
            setLiveMetrics(data);
        });

        return unsubscribe;
    }, []);

    const loadAnalyticsData = async () => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setRevenueData(realTimeAnalyticsService.getRevenueAnalytics(timeframe));
        setOrderData(realTimeAnalyticsService.getOrderAnalytics(timeframe));
        setUserData(realTimeAnalyticsService.getUserAnalytics(timeframe));
        setPrescriptionData(realTimeAnalyticsService.getPrescriptionAnalytics(timeframe));
        setPharmacyData(realTimeAnalyticsService.getPharmacyAnalytics(timeframe));
        setSystemData(realTimeAnalyticsService.getSystemAnalytics(timeframe));
        setLiveMetrics(realTimeAnalyticsService.getLiveMetrics());

        setIsLoading(false);
    };

    const handleExport = (type: string, format: string) => {
        const filename = realTimeAnalyticsService.exportData(type as any, format as any);
        alert(`Exporting data: ${filename}`);
    };

    const formatCurrency = (amount: number) => {
        return `EGP ${amount.toLocaleString()}`;
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    const getStatusColor = (severity: string) => {
        switch (severity) {
            case 'low':
                return 'bg-blue-100 text-blue-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'revenue', label: 'Revenue', icon: '💰' },
        { id: 'orders', label: 'Orders', icon: '📦' },
        { id: 'timing', label: 'Order Timing', icon: '🕐' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
        { id: 'pharmacies', label: 'Pharmacies', icon: '🏥' },
        { id: 'system', label: 'System', icon: '⚙️' },
    ];

    if (isLoading && !liveMetrics) {
        return (
            <div className="space-y-6" data-oid="8x28tty">
                <div
                    className="bg-white rounded-lg border border-gray-200 px-6 py-4"
                    data-oid="6qnlagp"
                >
                    <div className="animate-pulse" data-oid="svjbwyc">
                        <div
                            className="h-8 bg-gray-200 rounded w-1/4 mb-2"
                            data-oid="o8-67e1"
                        ></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2" data-oid="icojv-l"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="3d3ox8k">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="mf39s04"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="dq:7j3e">
            {/* Page Header */}
            <div
                className="bg-white rounded-lg border border-gray-200 px-6 py-4"
                data-oid="9x-xq:c"
            >
                <div className="flex items-center justify-between" data-oid="z-x9.c_">
                    <div data-oid="q:o9.4n">
                        <h1 className="text-2xl font-bold text-gray-900" data-oid="ml0qu2h">
                            Analytics & Insights
                        </h1>
                        <p className="text-sm text-gray-600" data-oid="xkvb::y">
                            Real-time analytics and performance insights for the platform
                        </p>
                    </div>
                    <div className="flex items-center space-x-4" data-oid="l2x3rmg">
                        <Button variant="outline" size="sm" data-oid="hn1nez3">
                            <Filter className="w-4 h-4 mr-2" data-oid="k2sddfg" />
                            Filters
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(activeTab, 'csv')}
                            data-oid="29edeio"
                        >
                            <Download className="w-4 h-4 mr-2" data-oid="lqban_w" />
                            Export CSV
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleExport(activeTab, 'excel')}
                            data-oid="3diq8z2"
                        >
                            <Download className="w-4 h-4 mr-2" data-oid="xfe61oa" />
                            Export Excel
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-6" data-oid="dzzummb">
                {/* Live Metrics Bar */}
                {liveMetrics && (
                    <div
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-4 rounded-xl"
                        data-oid="lmn-j8d"
                    >
                        <div className="flex items-center justify-between" data-oid="gona1-x">
                            <div className="flex items-center space-x-6" data-oid="d7mdf_.">
                                <div className="flex items-center space-x-2" data-oid="se7odo5">
                                    <div
                                        className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                                        data-oid="s6g8v4e"
                                    ></div>
                                    <span className="text-sm font-medium" data-oid="3k.2qlm">
                                        Live Data
                                    </span>
                                </div>
                                <div className="text-sm" data-oid="_ir4vzy">
                                    <span className="opacity-80" data-oid="g:rf0kr">
                                        Active Users:
                                    </span>
                                    <span className="font-bold ml-1" data-oid="ys4dzap">
                                        {liveMetrics.activeUsers}
                                    </span>
                                </div>
                                <div className="text-sm" data-oid="w2:vl8k">
                                    <span className="opacity-80" data-oid="jp86ykl">
                                        Orders Today:
                                    </span>
                                    <span className="font-bold ml-1" data-oid="2v8f1ft">
                                        {liveMetrics.ordersToday}
                                    </span>
                                </div>
                                <div className="text-sm" data-oid="cob-ox8">
                                    <span className="opacity-80" data-oid="9uol6ci">
                                        Revenue Today:
                                    </span>
                                    <span className="font-bold ml-1" data-oid="st6fo5v">
                                        {formatCurrency(liveMetrics.revenueToday)}
                                    </span>
                                </div>
                                <div className="text-sm" data-oid="8874f.k">
                                    <span className="opacity-80" data-oid="b_vj2c7">
                                        System Load:
                                    </span>
                                    <span className="font-bold ml-1" data-oid="xd855ni">
                                        {liveMetrics.systemLoad}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs opacity-80" data-oid="e7zzf01">
                                Last updated:{' '}
                                {new Date(liveMetrics.lastUpdated).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between" data-oid=":nhr0fa">
                    <div className="flex items-center space-x-4" data-oid="y:5_aj.">
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="bq00rs3"
                        >
                            {timeframes.map((tf) => (
                                <option key={tf.value} value={tf.value} data-oid="u57ml8.">
                                    {tf.label}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                autoRefresh
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                            data-oid="83t.tf4"
                        >
                            {autoRefresh ? '🔄 Auto Refresh' : '⏸️ Paused'}
                        </button>
                    </div>
                    <div className="flex items-center space-x-2" data-oid="aeh7l_c">
                        <button
                            onClick={() => handleExport(activeTab, 'csv')}
                            className="px-3 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] text-sm"
                            data-oid="ew42qts"
                        >
                            📊 Export CSV
                        </button>
                        <button
                            onClick={() => handleExport(activeTab, 'excel')}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            data-oid="c1xntjn"
                        >
                            📈 Export Excel
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200" data-oid="5iri63f">
                    <nav className="flex space-x-8" data-oid="x1z9:1q">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="5cul9_w"
                            >
                                <span className="mr-2" data-oid="jkk1j7x">
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6" data-oid="0f64mkh">
                        {/* Overview KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid=":.-l-0s">
                            <Card
                                className="relative overflow-hidden border-cura-primary/20 bg-gradient-to-br from-cura-primary/5 to-cura-secondary/5"
                                data-oid="w30iun3"
                            >
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid=".vpgch8"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-cura-accent"
                                        data-oid="zj5.w2l"
                                    >
                                        Total Revenue
                                    </CardTitle>
                                    <DollarSign
                                        className="h-4 w-4 text-cura-primary"
                                        data-oid="9v25aby"
                                    />
                                </CardHeader>
                                <CardContent data-oid="c:qvc11">
                                    <div
                                        className="text-2xl font-bold text-cura-primary"
                                        data-oid="f8-uneo"
                                    >
                                        {formatCurrency(revenueData?.total || 0)}
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs text-cura-light"
                                        data-oid="19q5llb"
                                    >
                                        <span data-oid="twns_8i">All time</span>
                                    </div>
                                    <div className="mt-2" data-oid=".q1rs9m">
                                        <Badge
                                            variant="outline"
                                            className="text-cura-primary border-cura-primary/20 bg-cura-primary/5"
                                            data-oid="2:204ae"
                                        >
                                            +{revenueData?.growth || 0}% growth
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="relative overflow-hidden border-cura-secondary/20 bg-gradient-to-br from-cura-secondary/5 to-cura-accent/5"
                                data-oid="--vk_ja"
                            >
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid="56ar4ib"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-cura-accent"
                                        data-oid="7qqfxz2"
                                    >
                                        Total Orders
                                    </CardTitle>
                                    <Package
                                        className="h-4 w-4 text-cura-secondary"
                                        data-oid="bubwzyv"
                                    />
                                </CardHeader>
                                <CardContent data-oid="-drdo29">
                                    <div
                                        className="text-2xl font-bold text-cura-secondary"
                                        data-oid="c_.9j-6"
                                    >
                                        {(orderData?.total || 0).toLocaleString()}
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs text-cura-light"
                                        data-oid="7xj_qla"
                                    >
                                        <span data-oid="m3qfvd8">
                                            Avg: {formatCurrency(orderData?.averageValue || 0)}
                                        </span>
                                    </div>
                                    <div className="mt-2" data-oid="tisefre">
                                        <Badge
                                            variant="outline"
                                            className="text-cura-secondary border-cura-secondary/20 bg-cura-secondary/5"
                                            data-oid="8m22d76"
                                        >
                                            +{orderData?.growth || 0}% growth
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="relative overflow-hidden border-cura-accent/20 bg-gradient-to-br from-cura-accent/5 to-cura-light/5"
                                data-oid="rd702:6"
                            >
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid=":tnjk_s"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-cura-accent"
                                        data-oid="r3ai72i"
                                    >
                                        Active Users
                                    </CardTitle>
                                    <Users
                                        className="h-4 w-4 text-cura-accent"
                                        data-oid="a.1yp2v"
                                    />
                                </CardHeader>
                                <CardContent data-oid="8k9m1w:">
                                    <div
                                        className="text-2xl font-bold text-cura-accent"
                                        data-oid="ctqmf0b"
                                    >
                                        {(userData?.active || 0).toLocaleString()}
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs text-cura-light"
                                        data-oid="3lvz4p_"
                                    >
                                        <span data-oid="5cmbc-5">
                                            {userData?.newUsers || 0} new this month
                                        </span>
                                    </div>
                                    <div className="mt-2" data-oid="0by3ec0">
                                        <Badge
                                            variant="outline"
                                            className="text-cura-accent border-cura-accent/20 bg-cura-accent/5"
                                            data-oid="c663ddb"
                                        >
                                            +{userData?.growth || 0}% growth
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="relative overflow-hidden border-cura-primary/20 bg-gradient-to-br from-cura-primary/5 to-cura-accent/5"
                                data-oid="clo7pae"
                            >
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2"
                                    data-oid="yctspoa"
                                >
                                    <CardTitle
                                        className="text-sm font-medium text-cura-accent"
                                        data-oid="ndb1j44"
                                    >
                                        System Uptime
                                    </CardTitle>
                                    <Activity
                                        className="h-4 w-4 text-cura-primary"
                                        data-oid="j7ngnm."
                                    />
                                </CardHeader>
                                <CardContent data-oid="0leh-lq">
                                    <div
                                        className="text-2xl font-bold text-cura-primary"
                                        data-oid="5nlslgf"
                                    >
                                        {systemData?.uptime || 0}%
                                    </div>
                                    <div
                                        className="flex items-center space-x-2 text-xs text-cura-light"
                                        data-oid="42.fi_y"
                                    >
                                        <span data-oid=".spumc1">
                                            {systemData?.responseTime || 0}ms avg response
                                        </span>
                                    </div>
                                    <div className="mt-2" data-oid="i6sinro">
                                        <Badge
                                            variant="outline"
                                            className="text-cura-primary border-cura-primary/20 bg-cura-primary/5"
                                            data-oid="togcuci"
                                        >
                                            +0.2% improvement
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        <div className="space-y-6" data-oid="jwbd7bm">
                            <ChartAreaInteractive data-oid="usnh4z-" />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="5n.xzul">
                            <Card data-oid="0zrdi3m">
                                <CardHeader data-oid="55adku.">
                                    <CardTitle data-oid="estgim1">Revenue by Category</CardTitle>
                                </CardHeader>
                                <CardContent data-oid="17_s00c">
                                    <div className="space-y-3" data-oid="a-9u_o8">
                                        {revenueData &&
                                            Object.entries(revenueData.byCategory).map(
                                                ([category, amount]) => (
                                                    <div
                                                        key={category}
                                                        className="flex justify-between items-center"
                                                        data-oid="0xjumoy"
                                                    >
                                                        <span
                                                            className="capitalize text-gray-600"
                                                            data-oid="c33z_ij"
                                                        >
                                                            {category}
                                                        </span>
                                                        <span
                                                            className="font-semibold text-[#1F1F6F]"
                                                            data-oid="hcniegu"
                                                        >
                                                            {formatCurrency(amount)}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card data-oid=".bag3w7">
                                <CardHeader data-oid="68uiva8">
                                    <CardTitle data-oid="3fen.1m">
                                        Top Performing Pharmacies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent data-oid="zkftuw6">
                                    <div className="space-y-3" data-oid="w.l1-kg">
                                        {pharmacyData?.topPerformers
                                            .slice(0, 5)
                                            .map((pharmacy, index) => (
                                                <div
                                                    key={pharmacy.id}
                                                    className="flex items-center justify-between"
                                                    data-oid="1nk6nv6"
                                                >
                                                    <div
                                                        className="flex items-center space-x-3"
                                                        data-oid="cut-v34"
                                                    >
                                                        <div
                                                            className="w-6 h-6 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center text-xs font-bold"
                                                            data-oid="vd56g:b"
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <div data-oid="k2jz:hj">
                                                            <div
                                                                className="font-medium text-sm"
                                                                data-oid="5ufhu2n"
                                                            >
                                                                {pharmacy.name}
                                                            </div>
                                                            <div
                                                                className="text-xs text-gray-500"
                                                                data-oid="_9hc5qp"
                                                            >
                                                                {pharmacy.city}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right" data-oid="bv7vwbv">
                                                        <div
                                                            className="font-semibold text-[#1F1F6F] text-sm"
                                                            data-oid="wjqtg8o"
                                                        >
                                                            {formatCurrency(pharmacy.revenue)}
                                                        </div>
                                                        <div
                                                            className="text-xs text-green-600"
                                                            data-oid="mp09gfe"
                                                        >
                                                            +{pharmacy.growth}%
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'revenue' && revenueData && (
                    <div className="space-y-6" data-oid=":sul4uh">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-oid="ejr.uq9">
                            <DashboardCard
                                title="Total Revenue"
                                value={formatCurrency(revenueData.total)}
                                subtitle="All time"
                                gradient={cardGradients.primary}
                                trend={{ value: `+${revenueData.growth}%`, isPositive: true }}
                                icon="💰"
                                data-oid="ldxdx03"
                            />

                            <DashboardCard
                                title="Commission Earned"
                                value={formatCurrency(revenueData.commission.total)}
                                subtitle="Platform earnings"
                                gradient={cardGradients.success}
                                trend={{ value: '+15.2%', isPositive: true }}
                                icon="💳"
                                data-oid="lb9e01a"
                            />

                            <DashboardCard
                                title="Average Daily"
                                value={formatCurrency(revenueData.total / 30)}
                                subtitle="Last 30 days"
                                gradient={cardGradients.info}
                                trend={{ value: '+8.7%', isPositive: true }}
                                icon="📈"
                                data-oid="jiw4a.b"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="33jl_tn">
                            <DashboardWidget title="Revenue by Category" data-oid="7.:o8.d">
                                <div className="space-y-4" data-oid="q:he1rf">
                                    {Object.entries(revenueData.byCategory).map(
                                        ([category, amount]) => {
                                            const percentage = (amount / revenueData.total) * 100;
                                            return (
                                                <div key={category} data-oid="i72drbz">
                                                    <div
                                                        className="flex justify-between items-center mb-1"
                                                        data-oid="39uwpdk"
                                                    >
                                                        <span
                                                            className="capitalize text-gray-600"
                                                            data-oid="4_ksl60"
                                                        >
                                                            {category}
                                                        </span>
                                                        <span
                                                            className="font-semibold text-[#1F1F6F]"
                                                            data-oid="mpalt7_"
                                                        >
                                                            {formatCurrency(amount)}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="w-full bg-gray-200 rounded-full h-2"
                                                        data-oid="3jqwqxc"
                                                    >
                                                        <div
                                                            className="bg-[#1F1F6F] h-2 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                            data-oid="xlzmp0f"
                                                        ></div>
                                                    </div>
                                                    <div
                                                        className="text-xs text-gray-500 mt-1"
                                                        data-oid="z9d8rop"
                                                    >
                                                        {formatPercentage(percentage)}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </DashboardWidget>

                            <DashboardWidget title="Commission Breakdown" data-oid="tng1b:8">
                                <div className="space-y-4" data-oid="jsdgn2s">
                                    {Object.entries(revenueData.commission).map(
                                        ([type, amount]) => {
                                            if (type === 'total') return null;
                                            const percentage =
                                                (amount / revenueData.commission.total) * 100;
                                            return (
                                                <div key={type} data-oid="azfa6_5">
                                                    <div
                                                        className="flex justify-between items-center mb-1"
                                                        data-oid="0ug5sb9"
                                                    >
                                                        <span
                                                            className="capitalize text-gray-600"
                                                            data-oid="b.qir59"
                                                        >
                                                            {type}
                                                        </span>
                                                        <span
                                                            className="font-semibold text-[#1F1F6F]"
                                                            data-oid="onzutpd"
                                                        >
                                                            {formatCurrency(amount)}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="w-full bg-gray-200 rounded-full h-2"
                                                        data-oid="4af8iv7"
                                                    >
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                            data-oid="y6ku2:g"
                                                        ></div>
                                                    </div>
                                                    <div
                                                        className="text-xs text-gray-500 mt-1"
                                                        data-oid="vqiqw3v"
                                                    >
                                                        {formatPercentage(percentage)}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </DashboardWidget>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && orderData && (
                    <div className="space-y-6" data-oid="9g:uts:">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid=".1:bytj">
                            <DashboardCard
                                title="Total Orders"
                                value={orderData.total.toLocaleString()}
                                subtitle="All time"
                                gradient={cardGradients.primary}
                                trend={{ value: `+${orderData.growth}%`, isPositive: true }}
                                icon="📦"
                                data-oid="9em673t"
                            />

                            <DashboardCard
                                title="Completed"
                                value={orderData.completed.toLocaleString()}
                                subtitle={`${((orderData.completed / orderData.total) * 100).toFixed(1)}% success rate`}
                                gradient={cardGradients.success}
                                trend={{ value: '+2.3%', isPositive: true }}
                                icon="✅"
                                data-oid="crmml9c"
                            />

                            <DashboardCard
                                title="Pending"
                                value={orderData.pending.toString()}
                                subtitle="Awaiting processing"
                                gradient={cardGradients.warning}
                                trend={{ value: '-5.2%', isPositive: true }}
                                icon="⏳"
                                data-oid="k066fm-"
                            />

                            <DashboardCard
                                title="Average Value"
                                value={formatCurrency(orderData.averageValue)}
                                subtitle="Per order"
                                gradient={cardGradients.info}
                                trend={{ value: '+12.8%', isPositive: true }}
                                icon="💵"
                                data-oid="-gx05.w"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="gmf5yp9">
                            <DashboardWidget title="Order Status Distribution" data-oid="x_06r1r">
                                <div className="space-y-3" data-oid="bi:dcyf">
                                    {Object.entries(orderData.statusDistribution).map(
                                        ([status, count]) => {
                                            const percentage = (count / orderData.total) * 100;
                                            const colors = {
                                                pending: 'bg-yellow-500',
                                                processing: 'bg-blue-500',
                                                shipped: 'bg-purple-500',
                                                delivered: 'bg-green-500',
                                                cancelled: 'bg-red-500',
                                            };
                                            return (
                                                <div key={status} data-oid="7udlv9f">
                                                    <div
                                                        className="flex justify-between items-center mb-1"
                                                        data-oid="c9goboz"
                                                    >
                                                        <span
                                                            className="capitalize text-gray-600"
                                                            data-oid="i6:lv.:"
                                                        >
                                                            {status}
                                                        </span>
                                                        <span
                                                            className="font-semibold text-[#1F1F6F]"
                                                            data-oid="-3g2-s."
                                                        >
                                                            {count}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="w-full bg-gray-200 rounded-full h-2"
                                                        data-oid="ffha4up"
                                                    >
                                                        <div
                                                            className={`${colors[status as keyof typeof colors]} h-2 rounded-full`}
                                                            style={{ width: `${percentage}%` }}
                                                            data-oid="bq92z19"
                                                        ></div>
                                                    </div>
                                                    <div
                                                        className="text-xs text-gray-500 mt-1"
                                                        data-oid="xkfy9-6"
                                                    >
                                                        {formatPercentage(percentage)}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </DashboardWidget>

                            <DashboardWidget title="Top Products by Orders" data-oid="vxspctp">
                                <div className="space-y-3" data-oid="_k6j:a1">
                                    {orderData.topProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between"
                                            data-oid="bou4tsa"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="_uy-0pq"
                                            >
                                                <div
                                                    className="w-6 h-6 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center text-xs font-bold"
                                                    data-oid="z.c2wt0"
                                                >
                                                    {index + 1}
                                                </div>
                                                <div data-oid="jmyd36h">
                                                    <div
                                                        className="font-medium text-sm"
                                                        data-oid="gdwaovq"
                                                    >
                                                        {product.name}
                                                    </div>
                                                    <div
                                                        className="text-xs text-gray-500"
                                                        data-oid="1yye:di"
                                                    >
                                                        {product.orders} orders
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right" data-oid="c5c97ae">
                                                <div
                                                    className="font-semibold text-[#1F1F6F] text-sm"
                                                    data-oid="576.2s2"
                                                >
                                                    {formatCurrency(product.revenue)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardWidget>
                        </div>
                    </div>
                )}

                {activeTab === 'timing' && (
                    <OrderTimingAnalytics
                        onExportCSV={() => handleExport('timing', 'csv')}
                        onExportExcel={() => handleExport('timing', 'excel')}
                        data-oid="v5z17v3"
                    />
                )}

                {activeTab === 'system' && systemData && (
                    <div className="space-y-6" data-oid="ifqkmew">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="9amvcl0">
                            <DashboardCard
                                title="System Uptime"
                                value={`${systemData.uptime}%`}
                                subtitle="Last 30 days"
                                gradient={cardGradients.success}
                                trend={{ value: '+0.2%', isPositive: true }}
                                icon="⚡"
                                data-oid="rww3em7"
                            />

                            <DashboardCard
                                title="Response Time"
                                value={`${systemData.responseTime}ms`}
                                subtitle="Average"
                                gradient={cardGradients.info}
                                trend={{ value: '-15ms', isPositive: true }}
                                icon="⏱️"
                                data-oid="6b2ka_r"
                            />

                            <DashboardCard
                                title="Error Rate"
                                value={`${systemData.errorRate}%`}
                                subtitle="Last 24 hours"
                                gradient={cardGradients.warning}
                                trend={{ value: '-0.01%', isPositive: true }}
                                icon="⚠️"
                                data-oid="8fcb.jv"
                            />

                            <DashboardCard
                                title="Active Users"
                                value={systemData.activeUsers.toLocaleString()}
                                subtitle="Currently online"
                                gradient={cardGradients.primary}
                                trend={{ value: '+45', isPositive: true }}
                                icon="👥"
                                data-oid="dw78drv"
                            />
                        </div>

                        <DashboardWidget title="Recent System Errors" data-oid="hmrzeqv">
                            <div className="space-y-3" data-oid="2_osmcs">
                                {systemData.errorLog.map((error, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        data-oid="odfz97-"
                                    >
                                        <div className="flex-1" data-oid="drcx.kr">
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="6gr.6r6"
                                            >
                                                <span
                                                    className="font-medium text-gray-900"
                                                    data-oid="aqi49n1"
                                                >
                                                    {error.type}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(error.severity)}`}
                                                    data-oid="ig-.3ip"
                                                >
                                                    {error.severity}
                                                </span>
                                            </div>
                                            <p
                                                className="text-sm text-gray-600 mt-1"
                                                data-oid="6waw::n"
                                            >
                                                {error.message}
                                            </p>
                                        </div>
                                        <div className="text-right" data-oid="smpq_xl">
                                            <p className="text-xs text-gray-500" data-oid="bym4plk">
                                                {new Date(error.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>
                    </div>
                )}
            </div>
        </div>
    );
}
