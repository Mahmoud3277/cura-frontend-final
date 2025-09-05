'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { vendorManagementService, VendorDetails } from '@/lib/services/vendorManagementService';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Target,
    RotateCcw,
    AlertCircle,
    BarChart3,
} from 'lucide-react';

interface VendorRevenueAnalyticsProps {
    vendor: VendorDetails;
    timeframe?: string;
}

export function VendorRevenueAnalytics({ vendor, timeframe = '1m' }: VendorRevenueAnalyticsProps) {
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

    useEffect(() => {
        loadAnalytics();
    }, [vendor.id]); // Only reload when vendor changes, not timeframe

    const loadAnalytics = async () => {
        setIsLoading(true);
        // Simulate API call only on initial load
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Static data that doesn't change
        const data = {
            periods: [
                {
                    period: 'Today',
                    revenue: 2340,
                    orders: 18,
                    sales: 67,
                    returns: 2,
                    avgOrder: 130,
                },
                {
                    period: '7 Days',
                    revenue: 18450,
                    orders: 142,
                    sales: 523,
                    returns: 8,
                    avgOrder: 130,
                },
                {
                    period: '1 Month',
                    revenue: 45678,
                    orders: 342,
                    sales: 1247,
                    returns: 23,
                    avgOrder: 134,
                },
                {
                    period: '6 Months',
                    revenue: 234567,
                    orders: 1823,
                    sales: 6891,
                    returns: 127,
                    avgOrder: 129,
                },
                {
                    period: '1 Year',
                    revenue: 567890,
                    orders: 4234,
                    sales: 15678,
                    returns: 289,
                    avgOrder: 134,
                },
                {
                    period: 'All Time',
                    revenue: 1234567,
                    orders: 9876,
                    sales: 34567,
                    returns: 567,
                    avgOrder: 125,
                },
            ],

            performance: {
                score: 93.2,
                avgOrder: 134,
                returnRate: 6.8,
                efficiency: 3.7,
            },
            growth: {
                revenue: 25.3,
                orders: 28.9,
                sales: 24.1,
            },
        };

        setAnalytics(data);
        setIsLoading(false);
    };

    // Function to get current period data based on selected timeframe
    const getCurrentPeriodData = () => {
        if (!analytics) return null;

        const periodMap: { [key: string]: string } = {
            today: 'Today',
            '7d': '7 Days',
            '1m': '1 Month',
            '6m': '6 Months',
            '1y': '1 Year',
            all: 'All Time',
        };

        const periodName = periodMap[selectedTimeframe] || '1 Month';
        const currentPeriod = analytics.periods.find((p: any) => p.period === periodName);
        return currentPeriod || analytics.periods[2]; // Default to 1 Month
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

    if (isLoading) {
        return (
            <div className="space-y-6" data-oid="bw-d82p">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-200 animate-pulse rounded-xl h-32"
                        data-oid="g93uxlc"
                    ></div>
                ))}
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-8" data-oid="e75nedw">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" data-oid="vw8xbn7" />

                <p className="text-gray-500" data-oid="m6ue3bu">
                    Unable to load revenue analytics
                </p>
            </div>
        );
    }

    const currentData = getCurrentPeriodData();
    if (!currentData) return null;

    return (
        <div className="space-y-6" data-oid="de4-d:g">
            {/* Header with Timeframe Selector */}
            <div className="flex items-center justify-between" data-oid="bm0-1ei">
                <h3 className="text-lg font-semibold" data-oid="fh:bke:">
                    Vendor Analytics Overview
                </h3>
                <select
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    data-oid="too6j49"
                >
                    <option value="today" data-oid="wftavl4">
                        Today
                    </option>
                    <option value="7d" data-oid="_8w:k89">
                        7 Days
                    </option>
                    <option value="1m" data-oid="axgdc:.">
                        1 Month
                    </option>
                    <option value="6m" data-oid="kf9vmm.">
                        6 Months
                    </option>
                    <option value="1y" data-oid="pbqtc-1">
                        1 Year
                    </option>
                    <option value="all" data-oid="gx:noo2">
                        All Time
                    </option>
                </select>
            </div>

            {/* Summary Cards */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                data-oid="lrgz:ke"
            >
                <Card
                    className="bg-gradient-to-br from-cura-primary/10 to-cura-primary/20 border-cura-primary/30"
                    data-oid="gupojd2"
                >
                    <CardContent className="p-6" data-oid="xpjr2pm">
                        <div className="flex items-center justify-between mb-4" data-oid="mkho2ct">
                            <div data-oid="0c2rpfg">
                                <h4
                                    className="text-sm font-medium text-cura-primary"
                                    data-oid="7vbwvyw"
                                >
                                    My Revenue from Vendor
                                </h4>
                                <p className="text-xs text-cura-primary/70" data-oid="htxx27s">
                                    Commission & fees earned
                                </p>
                            </div>
                            <div className="p-2 bg-cura-primary/20 rounded-lg" data-oid="n6o_ere">
                                <DollarSign
                                    className="h-5 w-5 text-cura-primary"
                                    data-oid="cnub1l-"
                                />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-primary mb-2"
                            data-oid="tkyw2yn"
                        >
                            {formatCurrency(Math.round(currentData.revenue * 0.15))}
                        </div>
                        <div className="flex items-center text-sm" data-oid="xqlrua6">
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="wysw3cj"
                            />

                            <span className="text-green-600 font-medium" data-oid=":dsbyx3">
                                +18.2%
                            </span>
                            <span className="text-cura-primary/70 ml-1" data-oid="37c8rhs">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-cura-secondary/10 to-cura-secondary/20 border-cura-secondary/30"
                    data-oid="qg_:0eu"
                >
                    <CardContent className="p-6" data-oid="5fttw7.">
                        <div className="flex items-center justify-between mb-4" data-oid="g3.qmky">
                            <div data-oid="8k_2dro">
                                <h4
                                    className="text-sm font-medium text-cura-secondary"
                                    data-oid="bkawau8"
                                >
                                    Vendor Total Revenue
                                </h4>
                                <p className="text-xs text-cura-secondary/70" data-oid="edt1esy">
                                    Gross sales revenue
                                </p>
                            </div>
                            <div className="p-2 bg-cura-secondary/20 rounded-lg" data-oid="x6jqq0-">
                                <BarChart3
                                    className="h-5 w-5 text-cura-secondary"
                                    data-oid="rhf7i0t"
                                />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-secondary mb-2"
                            data-oid="vzadmty"
                        >
                            {formatCurrency(currentData.revenue)}
                        </div>
                        <div className="flex items-center text-sm" data-oid="ak9l-g1">
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="gwkp:vh"
                            />

                            <span className="text-green-600 font-medium" data-oid="39lxbx.">
                                +25.3%
                            </span>
                            <span className="text-cura-secondary/70 ml-1" data-oid="vkp9a_-">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-cura-accent/10 to-cura-accent/20 border-cura-accent/30"
                    data-oid="nm7hpa."
                >
                    <CardContent className="p-6" data-oid="s160uo:">
                        <div className="flex items-center justify-between mb-4" data-oid="7q5zl_z">
                            <div data-oid="5bmtbtd">
                                <h4
                                    className="text-sm font-medium text-cura-accent"
                                    data-oid="1sz_5yf"
                                >
                                    Vendor{"'"}s Net Revenue
                                </h4>
                                <p className="text-xs text-cura-accent/70" data-oid="s82rpqx">
                                    After commission deduction
                                </p>
                            </div>
                            <div className="p-2 bg-cura-accent/20 rounded-lg" data-oid="4w-ipc7">
                                <Target className="h-5 w-5 text-cura-accent" data-oid="axh0qo_" />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-accent mb-2"
                            data-oid="8dh_:52"
                        >
                            {formatCurrency(Math.round(currentData.revenue * 0.85))}
                        </div>
                        <div className="flex items-center text-sm" data-oid="dz0q2c5">
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="bjvtd0:"
                            />

                            <span className="text-green-600 font-medium" data-oid="xnn:aas">
                                +21.8%
                            </span>
                            <span className="text-cura-accent/70 ml-1" data-oid="079lpnm">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/15 border-cura-primary/20"
                    data-oid="q2batci"
                >
                    <CardContent className="p-6" data-oid="9sax:m0">
                        <div className="flex items-center justify-between mb-4" data-oid="7p83z84">
                            <div data-oid="efskj2z">
                                <h4
                                    className="text-sm font-medium text-cura-primary/80"
                                    data-oid="rqmvfzx"
                                >
                                    Total Sales Volume
                                </h4>
                                <p className="text-xs text-cura-primary/60" data-oid="0j5_-0n">
                                    Units sold & orders
                                </p>
                            </div>
                            <div className="p-2 bg-cura-primary/15 rounded-lg" data-oid="d5gwjcg">
                                <ShoppingCart
                                    className="h-5 w-5 text-cura-primary/80"
                                    data-oid="n8-a5k4"
                                />
                            </div>
                        </div>
                        <div
                            className="text-3xl font-bold text-cura-primary/90 mb-2"
                            data-oid="hg59gjo"
                        >
                            {currentData.sales.toLocaleString()}
                        </div>
                        <div
                            className="flex items-center justify-between text-sm"
                            data-oid="lc0uasv"
                        >
                            <div className="flex items-center" data-oid="6fjybx3">
                                <TrendingUp
                                    className="h-4 w-4 text-green-600 mr-1"
                                    data-oid="-6t2btn"
                                />

                                <span className="text-green-600 font-medium" data-oid="eckwqhq">
                                    +24.1%
                                </span>
                            </div>
                            <div className="text-cura-primary/70" data-oid="bxfacs2">
                                {currentData.orders} orders
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Trends Section */}
            <div data-oid="03q.5-5">
                <h3 className="text-lg font-semibold mb-4" data-oid="g63r_h7">
                    Revenue Trends
                </h3>

                {/* Detailed Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-oid="fbshe.y">
                    <Card data-oid="85ayc.d">
                        <CardContent className="p-4" data-oid="scr_5jj">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="6w00853"
                            >
                                <span className="text-sm text-gray-600" data-oid="vdlf3va">
                                    Revenue
                                </span>
                                <DollarSign className="h-4 w-4 text-gray-400" data-oid="_cwj_vm" />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="2d_p1.m"
                            >
                                {formatCurrency(currentData.revenue)}
                            </div>
                            <div className="text-xs text-cura-secondary" data-oid="33.gai4">
                                +25.3% vs last period
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="88g.y92">
                        <CardContent className="p-4" data-oid="mb8w1dz">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="4ybzj74"
                            >
                                <span className="text-sm text-gray-600" data-oid="dmcg9fg">
                                    Orders
                                </span>
                                <ShoppingCart
                                    className="h-4 w-4 text-gray-400"
                                    data-oid="crbcv-1"
                                />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="544:k1a"
                            >
                                {currentData.orders.toLocaleString()}
                            </div>
                            <div className="text-xs text-cura-secondary" data-oid="xc7680k">
                                +28.9% vs last period
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="m9np-h1">
                        <CardContent className="p-4" data-oid="nfhb1mi">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="02_5vns"
                            >
                                <span className="text-sm text-gray-600" data-oid="89x2_r8">
                                    Sales
                                </span>
                                <Target className="h-4 w-4 text-gray-400" data-oid="6you6g1" />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="m-mnybf"
                            >
                                {currentData.sales.toLocaleString()}
                            </div>
                            <div className="text-xs text-cura-secondary" data-oid="m93uki_">
                                +24.1% vs last period
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="a-w6gw1">
                        <CardContent className="p-4" data-oid="z:52iaq">
                            <div
                                className="flex items-center justify-between mb-2"
                                data-oid="2nb7fbb"
                            >
                                <span className="text-sm text-gray-600" data-oid="z-ju8qb">
                                    Returns
                                </span>
                                <RotateCcw className="h-4 w-4 text-gray-400" data-oid="-p7rv.6" />
                            </div>
                            <div
                                className="text-2xl font-bold text-cura-primary"
                                data-oid="xcaz.-5"
                            >
                                {currentData.returns}
                            </div>
                            <div className="text-xs text-red-500" data-oid="zp4kgr_">
                                -8.7% vs last period
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analytics Table */}
                <Card data-oid="aoni7:s">
                    <CardHeader data-oid="5rpxhnb">
                        <CardTitle data-oid="-ahxcw2">Detailed Analytics</CardTitle>
                    </CardHeader>
                    <CardContent data-oid="6wojwty">
                        <div className="overflow-x-auto" data-oid="u.ku.bt">
                            <table className="w-full" data-oid="t097nw2">
                                <thead data-oid="o930tw:">
                                    <tr className="border-b" data-oid="ax_yc1x">
                                        <th
                                            className="text-left py-2 text-sm font-medium text-gray-600"
                                            data-oid="_xz.8xj"
                                        >
                                            Period
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="1nm:873"
                                        >
                                            Revenue
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="u6:yh:d"
                                        >
                                            Orders
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="pgqrtdk"
                                        >
                                            Sales
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="o_j.wyj"
                                        >
                                            Returns
                                        </th>
                                        <th
                                            className="text-right py-2 text-sm font-medium text-gray-600"
                                            data-oid="pu2x.:f"
                                        >
                                            Avg Order
                                        </th>
                                    </tr>
                                </thead>
                                <tbody data-oid="w4d_65l">
                                    {analytics.periods.map((period: any, index: number) => {
                                        const isSelected =
                                            period.period === getCurrentPeriodData()?.period;
                                        return (
                                            <tr
                                                key={index}
                                                className={`border-b ${isSelected ? 'bg-blue-50' : ''}`}
                                                data-oid="g8vxjm2"
                                            >
                                                <td className="py-2 text-sm" data-oid="o.5_g:.">
                                                    {period.period}
                                                    {isSelected && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2 text-xs"
                                                            data-oid="mrfh7lq"
                                                        >
                                                            Selected
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right font-medium text-cura-primary"
                                                    data-oid="waz4bji"
                                                >
                                                    {formatCurrency(period.revenue)}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid="xrb8ia0"
                                                >
                                                    {period.orders}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid="f5is2n_"
                                                >
                                                    {period.sales}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid="k2pnag1"
                                                >
                                                    {period.returns}
                                                </td>
                                                <td
                                                    className="py-2 text-sm text-right"
                                                    data-oid="ifmrymb"
                                                >
                                                    {formatCurrency(period.avgOrder)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics and Growth Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="2c5qnve">
                    <Card data-oid="rqr5_5z">
                        <CardHeader data-oid="h4h0rl6">
                            <CardTitle className="flex items-center space-x-2" data-oid="l6l3hco">
                                <BarChart3 className="w-5 h-5" data-oid="dj90v.9" />
                                <span data-oid="7d.xs8g">Performance Metrics</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="nrwg.20">
                            <div
                                className="flex items-center justify-center mb-6"
                                data-oid="zhvlp.:"
                            >
                                <div className="relative w-32 h-32" data-oid="6xahgl5">
                                    <svg
                                        className="w-32 h-32 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                        data-oid="c7:i_k7"
                                    >
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="2"
                                            data-oid="ki22r-g"
                                        />

                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#1F1F6F"
                                            strokeWidth="2"
                                            strokeDasharray={`${analytics.performance.score}, 100`}
                                            data-oid="i:ucp78"
                                        />
                                    </svg>
                                    <div
                                        className="absolute inset-0 flex items-center justify-center"
                                        data-oid="3n1tw6s"
                                    >
                                        <div className="text-center" data-oid="xe4ac6h">
                                            <div
                                                className="text-2xl font-bold text-cura-primary"
                                                data-oid="b2yl:o7"
                                            >
                                                {analytics.performance.score}%
                                            </div>
                                            <div
                                                className="text-xs text-gray-500"
                                                data-oid="-_lu1z9"
                                            >
                                                Score
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3" data-oid="1trpt2i">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="_1aj1jg"
                                >
                                    <span className="text-sm text-gray-600" data-oid="__sox7o">
                                        Avg Order
                                    </span>
                                    <span className="font-medium" data-oid="44us5da">
                                        {formatCurrency(analytics.performance.avgOrder)}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="..9eave"
                                >
                                    <span className="text-sm text-gray-600" data-oid="a74voq.">
                                        Return Rate
                                    </span>
                                    <span className="font-medium" data-oid="p8g_sfy">
                                        {analytics.performance.returnRate}%
                                    </span>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="47qqgah"
                                >
                                    <span className="text-sm text-gray-600" data-oid="zvhcro_">
                                        Efficiency
                                    </span>
                                    <span className="font-medium" data-oid="iojntrn">
                                        {analytics.performance.efficiency}%
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="t6l1z7v">
                        <CardHeader data-oid="79ek25_">
                            <CardTitle className="flex items-center space-x-2" data-oid="b9-zxll">
                                <TrendingUp className="w-5 h-5" data-oid="bogk8ov" />
                                <span data-oid="oi3pfvj">Growth Analytics</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="qf5z0vg">
                            <div className="space-y-4" data-oid="epls:f4">
                                <div data-oid="hrcjwyn">
                                    <div
                                        className="flex items-center justify-between mb-2"
                                        data-oid=".fryu4f"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="ej8ss:h">
                                            Revenue Growth
                                        </span>
                                        <span
                                            className="font-bold text-cura-secondary"
                                            data-oid="ahou7u1"
                                        >
                                            +{analytics.growth.revenue}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid=":a204f_"
                                    >
                                        <div
                                            className="bg-cura-secondary h-2 rounded-full"
                                            style={{
                                                width: `${Math.min(analytics.growth.revenue * 2, 100)}%`,
                                            }}
                                            data-oid="-cwym:v"
                                        ></div>
                                    </div>
                                </div>
                                <div data-oid="j2vk:m7">
                                    <div
                                        className="flex items-center justify-between mb-2"
                                        data-oid="-01ym70"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="u1afg77">
                                            Orders Growth
                                        </span>
                                        <span
                                            className="font-bold text-cura-secondary"
                                            data-oid="gukptko"
                                        >
                                            +{analytics.growth.orders}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid="cpe0jpo"
                                    >
                                        <div
                                            className="bg-cura-primary h-2 rounded-full"
                                            style={{
                                                width: `${Math.min(analytics.growth.orders * 2, 100)}%`,
                                            }}
                                            data-oid="3it:ytq"
                                        ></div>
                                    </div>
                                </div>
                                <div data-oid="c5-4b.n">
                                    <div
                                        className="flex items-center justify-between mb-2"
                                        data-oid="vfda3oc"
                                    >
                                        <span className="text-sm text-gray-600" data-oid="kiuay8m">
                                            Sales Growth
                                        </span>
                                        <span
                                            className="font-bold text-cura-secondary"
                                            data-oid="oc3278d"
                                        >
                                            +{analytics.growth.sales}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid="9nirj5w"
                                    >
                                        <div
                                            className="bg-cura-accent h-2 rounded-full"
                                            style={{
                                                width: `${Math.min(analytics.growth.sales * 2, 100)}%`,
                                            }}
                                            data-oid="dhv..91"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-center" data-oid="6eqiiyl">
                                <div
                                    className="text-lg font-bold text-cura-secondary"
                                    data-oid=".glfvif"
                                >
                                    Excellent
                                </div>
                                <div className="text-sm text-gray-500" data-oid="dk6i5x3">
                                    Overall Performance
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
