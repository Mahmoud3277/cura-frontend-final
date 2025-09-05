'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { revenueCalculationService } from '@/lib/services/revenueCalculationService';
import { kpiAnalyticsService } from '@/lib/services/kpiAnalyticsService';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    RefreshCw,
    Clock,
    Target,
    BarChart3,
} from 'lucide-react';

interface RealTimeMetrics {
    currentRevenue: number;
    todayRevenue: number;
    todayOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
    ordersGrowth: number;
    pendingCommissions: number;
    platformShare: number;
    lastUpdated: string;
}

interface RevenueTarget {
    daily: number;
    monthly: number;
    progress: number;
}

export function RealTimeRevenueTracker() {
    const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
    const [targets, setTargets] = useState<RevenueTarget | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        loadRevenueData();
        const interval = autoRefresh ? setInterval(loadRevenueData, 15000) : null;
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const loadRevenueData = async () => {
        try {
            const revenueData = revenueCalculationService.getRealTimeRevenueMetrics();
            const kpiData = kpiAnalyticsService.calculateRealTimeKPIs();
            const revenueMetrics = kpiAnalyticsService.calculateRevenueMetrics();

            const realTimeMetrics: RealTimeMetrics = {
                currentRevenue: revenueMetrics.totalSales,
                todayRevenue: revenueData.todayRevenue,
                todayOrders: revenueData.todayOrders,
                averageOrderValue: revenueMetrics.averageOrderValue,
                revenueGrowth: revenueMetrics.revenueGrowth,
                ordersGrowth: 15.3, // Mock growth
                pendingCommissions: revenueData.pendingCommissions,
                platformShare: revenueMetrics.totalPlatformRevenue,
                lastUpdated: new Date().toISOString(),
            };

            const revenueTargets: RevenueTarget = {
                daily: 5000, // Daily target
                monthly: 150000, // Monthly target
                progress: (realTimeMetrics.todayRevenue / 5000) * 100,
            };

            setMetrics(realTimeMetrics);
            setTargets(revenueTargets);
        } catch (error) {
            console.error('Error loading revenue data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;
    const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

    if (isLoading) {
        return (
            <Card className="bg-white border border-[#9BA4B4]/20 shadow-sm" data-oid="p71huyu">
                <CardContent className="p-6" data-oid="7_x1:w3">
                    <div className="animate-pulse space-y-4" data-oid="nogx5cg">
                        <div className="h-4 bg-gray-200 rounded w-1/4" data-oid="lh3g-b_"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2" data-oid="d_j9sde"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3" data-oid=":4pmhnw"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6" data-oid="uxetm9e">
            {/* Main Revenue Card */}
            <Card
                className="bg-gradient-to-br from-[#14274E] to-[#394867] text-white border-0 shadow-lg"
                data-oid="iufft2w"
            >
                <CardHeader data-oid="jax6.cl">
                    <div className="flex items-center justify-between" data-oid="3ziotp9">
                        <div data-oid=":gbb.sq">
                            <CardTitle className="text-white/90 text-lg" data-oid="fhiunvw">
                                Real-Time Revenue
                            </CardTitle>
                            <CardDescription className="text-white/70" data-oid="8-2uup:">
                                Live platform revenue tracking
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="4rtp.23">
                            <div
                                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                data-oid="ocxa8v7"
                            ></div>
                            <span className="text-sm text-white/80" data-oid="j92_cm1">
                                Live
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                data-oid="vluzq-k"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`}
                                    data-oid="g30.spw"
                                />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6" data-oid="4t04awz">
                    {/* Current Revenue */}
                    <div className="text-center" data-oid="bjw_d.g">
                        <div className="text-4xl font-bold mb-2" data-oid="b6qs_2x">
                            {formatCurrency(metrics?.currentRevenue || 0)}
                        </div>
                        <div className="text-white/80 text-sm" data-oid="bugxtdk">
                            Total Platform Revenue
                        </div>
                    </div>

                    {/* Today's Metrics */}
                    <div className="grid grid-cols-2 gap-4" data-oid="-exmrt1">
                        <div className="text-center" data-oid="c5j0r5-">
                            <div className="text-2xl font-bold" data-oid="f88hx8o">
                                {formatCurrency(metrics?.todayRevenue || 0)}
                            </div>
                            <div className="text-white/70 text-sm" data-oid="98:3.sf">
                                Today{"'"}s Revenue
                            </div>
                            <div
                                className="flex items-center justify-center mt-1 text-green-300"
                                data-oid="kuwlys5"
                            >
                                <TrendingUp className="w-3 h-3 mr-1" data-oid="n5hj4j2" />
                                <span className="text-xs" data-oid="u8jm29s">
                                    +{metrics?.revenueGrowth || 0}%
                                </span>
                            </div>
                        </div>
                        <div className="text-center" data-oid="lzxqd6i">
                            <div className="text-2xl font-bold" data-oid="4cu-wv5">
                                {metrics?.todayOrders || 0}
                            </div>
                            <div className="text-white/70 text-sm" data-oid="rfn890e">
                                Today{"'"}s Orders
                            </div>
                            <div
                                className="flex items-center justify-center mt-1 text-green-300"
                                data-oid="6-x668u"
                            >
                                <TrendingUp className="w-3 h-3 mr-1" data-oid=":qeflv." />
                                <span className="text-xs" data-oid="2.77lko">
                                    +{metrics?.ordersGrowth || 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Daily Target Progress */}
                    <div className="space-y-2" data-oid="w9v311n">
                        <div
                            className="flex items-center justify-between text-sm"
                            data-oid="lf.uztt"
                        >
                            <span className="text-white/80" data-oid="_w3njq3">
                                Daily Target Progress
                            </span>
                            <span className="text-white" data-oid="lf6r:.3">
                                {formatPercentage(targets?.progress || 0)}
                            </span>
                        </div>
                        <Progress
                            value={targets?.progress || 0}
                            className="h-2 bg-white/20"
                            data-oid="me:o97b"
                        />

                        <div
                            className="flex items-center justify-between text-xs text-white/70"
                            data-oid="g:8ryxn"
                        >
                            <span data-oid="0ig27iw">
                                {formatCurrency(metrics?.todayRevenue || 0)}
                            </span>
                            <span data-oid="rguuvio">
                                Target: {formatCurrency(targets?.daily || 0)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="5u1wwnb">
                {/* Average Order Value */}
                <Card className="bg-white border border-[#9BA4B4]/20 shadow-sm" data-oid="00jwxnp">
                    <CardHeader className="pb-3" data-oid="1q1zt9u">
                        <div className="flex items-center justify-between" data-oid="6n62_n5">
                            <CardTitle
                                className="text-sm font-medium text-[#394867]"
                                data-oid="gc.ii4-"
                            >
                                Average Order Value
                            </CardTitle>
                            <Target className="h-4 w-4 text-[#394867]" data-oid="zmq6.r_" />
                        </div>
                    </CardHeader>
                    <CardContent data-oid="smibgfy">
                        <div className="text-2xl font-bold text-[#14274E] mb-2" data-oid="83b38zs">
                            {formatCurrency(metrics?.averageOrderValue || 0)}
                        </div>
                        <div className="flex items-center space-x-2 text-sm" data-oid="hjos769">
                            <TrendingUp className="h-3 w-3 text-green-500" data-oid="wmacc8l" />
                            <span className="text-green-600" data-oid="omhrjol">
                                +8.2% vs yesterday
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Platform Share */}
                <Card className="bg-white border border-[#9BA4B4]/20 shadow-sm" data-oid="phqolqn">
                    <CardHeader className="pb-3" data-oid="p0v0gyy">
                        <div className="flex items-center justify-between" data-oid="s7147de">
                            <CardTitle
                                className="text-sm font-medium text-[#394867]"
                                data-oid="qqd-:xr"
                            >
                                Platform Share
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-[#394867]" data-oid="3q2jwf." />
                        </div>
                    </CardHeader>
                    <CardContent data-oid="2ovtdwo">
                        <div className="text-2xl font-bold text-[#14274E] mb-2" data-oid="beqsg80">
                            {formatCurrency(metrics?.platformShare || 0)}
                        </div>
                        <div className="text-sm text-[#9BA4B4]" data-oid="7y0fmhr">
                            After commissions
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Commissions */}
                <Card className="bg-white border border-[#9BA4B4]/20 shadow-sm" data-oid="y7we2mb">
                    <CardHeader className="pb-3" data-oid="paqu4pu">
                        <div className="flex items-center justify-between" data-oid="rghuv57">
                            <CardTitle
                                className="text-sm font-medium text-[#394867]"
                                data-oid="8sm9n.d"
                            >
                                Pending Commissions
                            </CardTitle>
                            <Clock className="h-4 w-4 text-[#394867]" data-oid="d:-3xxl" />
                        </div>
                    </CardHeader>
                    <CardContent data-oid="tq9lm:r">
                        <div className="text-2xl font-bold text-orange-600 mb-2" data-oid="e_muvy7">
                            {formatCurrency(metrics?.pendingCommissions || 0)}
                        </div>
                        <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-200"
                            data-oid="7h1e:d1"
                        >
                            Awaiting payment
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Insights */}
            <Card className="bg-white border border-[#9BA4B4]/20 shadow-sm" data-oid="ymg:r54">
                <CardHeader data-oid="2y42db0">
                    <div className="flex items-center justify-between" data-oid="8g78r7v">
                        <div data-oid="695-2mb">
                            <CardTitle className="text-[#14274E]" data-oid="b9a_x5v">
                                Revenue Insights
                            </CardTitle>
                            <CardDescription className="text-[#9BA4B4]" data-oid="nj8kh4x">
                                Key performance indicators and trends
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-[#394867]/20 text-[#394867] hover:bg-[#394867]/5"
                            data-oid="zre8j3f"
                        >
                            <Download className="w-4 h-4 mr-2" data-oid="bpkzbd1" />
                            Export Report
                        </Button>
                    </div>
                </CardHeader>
                <CardContent data-oid="fd4y.y4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="v48b_0x">
                        {/* Performance Metrics */}
                        <div className="space-y-4" data-oid="xe58fy-">
                            <h4 className="font-semibold text-[#14274E]" data-oid="c9431o0">
                                Performance Metrics
                            </h4>
                            <div className="space-y-3" data-oid="5duzww6">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="ju-7jat"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="rx1h:6a">
                                        Revenue Growth Rate
                                    </span>
                                    <div className="flex items-center space-x-2" data-oid="hk66_09">
                                        <TrendingUp
                                            className="w-4 h-4 text-green-500"
                                            data-oid="77xg.e7"
                                        />

                                        <span
                                            className="font-semibold text-green-600"
                                            data-oid="yptvi8w"
                                        >
                                            +{metrics?.revenueGrowth || 0}%
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="mcg1jj-"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="e18g:1f">
                                        Order Growth Rate
                                    </span>
                                    <div className="flex items-center space-x-2" data-oid="0zo4fuf">
                                        <TrendingUp
                                            className="w-4 h-4 text-green-500"
                                            data-oid="jwmkwh0"
                                        />

                                        <span
                                            className="font-semibold text-green-600"
                                            data-oid="92xe92m"
                                        >
                                            +{metrics?.ordersGrowth || 0}%
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="dopbxh3"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="gtkmh56">
                                        Daily Target Achievement
                                    </span>
                                    <span
                                        className="font-semibold text-[#14274E]"
                                        data-oid="boy-gdw"
                                    >
                                        {formatPercentage(targets?.progress || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Targets */}
                        <div className="space-y-4" data-oid="kqljxox">
                            <h4 className="font-semibold text-[#14274E]" data-oid="0.5f6zv">
                                Revenue Targets
                            </h4>
                            <div className="space-y-3" data-oid="4jcurrc">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="xbnfaua"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="s1z-v6b">
                                        Daily Target
                                    </span>
                                    <span
                                        className="font-semibold text-[#14274E]"
                                        data-oid="0delct3"
                                    >
                                        {formatCurrency(targets?.daily || 0)}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="77jazm5"
                                >
                                    <span className="text-sm text-[#394867]" data-oid=".-onyhy">
                                        Monthly Target
                                    </span>
                                    <span
                                        className="font-semibold text-[#14274E]"
                                        data-oid=".e42wbl"
                                    >
                                        {formatCurrency(targets?.monthly || 0)}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="ai3hy5h"
                                >
                                    <span className="text-sm text-[#394867]" data-oid="-h9-ty1">
                                        Projected Monthly
                                    </span>
                                    <span
                                        className="font-semibold text-green-600"
                                        data-oid=".poxe5h"
                                    >
                                        {formatCurrency((metrics?.todayRevenue || 0) * 30)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="mt-6 pt-4 border-t border-[#9BA4B4]/10" data-oid="51ql3ri">
                        <div
                            className="flex items-center justify-between text-sm text-[#9BA4B4]"
                            data-oid="cth1vr7"
                        >
                            <span data-oid="e726ohr">
                                Last updated: {new Date().toLocaleTimeString()}
                            </span>
                            <span data-oid="oqhrfpq">
                                Auto-refresh: {autoRefresh ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
