'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Percent,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

interface AnalyticsData {
    platformRevenue: {
        total: number;
        growth: number;
        monthly: Array<{ month: string; revenue: number; growth: number }>;
    };
    vendorNetRevenue: {
        total: number;
        growth: number;
        monthly: Array<{ month: string; revenue: number; growth: number }>;
    };
    totalSales: {
        total: number;
        growth: number;
        monthly: Array<{ month: string; sales: number; orders: number }>;
    };
    ordersGrowth: {
        total: number;
        growth: number;
        weekly: Array<{ week: string; orders: number; growth: number }>;
    };
    averageCommission: {
        rate: number;
        growth: number;
        monthly: Array<{ month: string; rate: number; vendors: number }>;
    };
}

const timeFrameOptions = [
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last3months', label: 'Last 3 months' },
];

export function VendorAnalyticsDashboard() {
    const [timeFrame, setTimeFrame] = useState('last3months');

    // Mock data - in real app, this would come from API based on timeFrame
    const [analyticsData] = useState<AnalyticsData>({
        platformRevenue: {
            total: 156231.89,
            growth: 20.1,
            monthly: [
                { month: 'Apr 9', revenue: 12500, growth: 15.2 },
                { month: 'Apr 17', revenue: 15800, growth: 18.5 },
                { month: 'Apr 25', revenue: 14200, growth: 12.8 },
                { month: 'May 3', revenue: 18900, growth: 25.3 },
                { month: 'May 11', revenue: 16700, growth: 19.7 },
                { month: 'May 19', revenue: 21400, growth: 28.1 },
                { month: 'May 27', revenue: 19800, growth: 22.4 },
                { month: 'Jun 4', revenue: 23100, growth: 31.2 },
                { month: 'Jun 12', revenue: 20900, growth: 26.8 },
                { month: 'Jun 20', revenue: 25600, growth: 35.4 },
                { month: 'Jun 30', revenue: 28200, growth: 38.9 },
            ],
        },
        vendorNetRevenue: {
            total: 624927.56,
            growth: 18.7,
            monthly: [
                { month: 'Apr 9', revenue: 50000, growth: 12.1 },
                { month: 'Apr 17', revenue: 63200, growth: 15.8 },
                { month: 'Apr 25', revenue: 56800, growth: 10.5 },
                { month: 'May 3', revenue: 75600, growth: 22.3 },
                { month: 'May 11', revenue: 66800, growth: 16.7 },
                { month: 'May 19', revenue: 85600, growth: 25.1 },
                { month: 'May 27', revenue: 79200, growth: 19.4 },
                { month: 'Jun 4', revenue: 92400, growth: 28.2 },
                { month: 'Jun 12', revenue: 83600, growth: 23.8 },
                { month: 'Jun 20', revenue: 102400, growth: 32.4 },
                { month: 'Jun 30', revenue: 112800, growth: 35.9 },
            ],
        },
        totalSales: {
            total: 781159.45,
            growth: 19.2,
            monthly: [
                { month: 'Apr 9', sales: 62500, orders: 145 },
                { month: 'Apr 17', sales: 79000, orders: 178 },
                { month: 'Apr 25', sales: 71000, orders: 162 },
                { month: 'May 3', sales: 94500, orders: 210 },
                { month: 'May 11', sales: 83500, orders: 189 },
                { month: 'May 19', sales: 107000, orders: 235 },
                { month: 'May 27', sales: 99000, orders: 218 },
                { month: 'Jun 4', sales: 115500, orders: 256 },
                { month: 'Jun 12', sales: 104500, orders: 231 },
                { month: 'Jun 20', sales: 128000, orders: 278 },
                { month: 'Jun 30', sales: 141000, orders: 298 },
            ],
        },
        ordersGrowth: {
            total: 2350,
            growth: 180.1,
            weekly: [
                { week: 'Mon', orders: 45, growth: 12.5 },
                { week: 'Tue', orders: 52, growth: 18.2 },
                { week: 'Wed', orders: 48, growth: 15.1 },
                { week: 'Thu', orders: 61, growth: 25.8 },
                { week: 'Fri', orders: 58, growth: 22.3 },
                { week: 'Sat', orders: 42, growth: 8.7 },
                { week: 'Sun', orders: 38, growth: 5.2 },
            ],
        },
        averageCommission: {
            rate: 12.5,
            growth: 2.3,
            monthly: [
                { month: 'Apr 9', rate: 11.8, vendors: 24 },
                { month: 'Apr 17', rate: 12.1, vendors: 26 },
                { month: 'Apr 25', rate: 11.9, vendors: 25 },
                { month: 'May 3', rate: 12.3, vendors: 28 },
                { month: 'May 11', rate: 12.0, vendors: 27 },
                { month: 'May 19', rate: 12.6, vendors: 30 },
                { month: 'May 27', rate: 12.4, vendors: 29 },
                { month: 'Jun 4', rate: 12.8, vendors: 32 },
                { month: 'Jun 12', rate: 12.5, vendors: 31 },
                { month: 'Jun 20', rate: 12.9, vendors: 34 },
                { month: 'Jun 30', rate: 13.1, vendors: 36 },
            ],
        },
    });

    const formatCurrency = (amount: number) => `${amount.toLocaleString()}`;

    const MetricCard = ({
        title,
        value,
        change,
        icon: Icon,
        trend = 'up',
        subtitle,
    }: {
        title: string;
        value: string;
        change: number;
        icon: any;
        trend?: 'up' | 'down';
        subtitle?: string;
    }) => (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="flex items-center mt-1">
                    {trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                        className={`text-sm font-medium ${
                            trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {change > 0 ? '+' : ''}
                        {change}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </CardContent>
        </Card>
    );

    const chartConfig = {
        revenue: {
            label: 'Revenue',
            color: 'hsl(var(--chart-1))',
        },
        orders: {
            label: 'Orders',
            color: 'hsl(var(--chart-2))',
        },
        commission: {
            label: 'Commission',
            color: 'hsl(var(--chart-3))',
        },
    };

    return (
        <div className="space-y-6">
            {/* Time Frame Selector */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Vendor Analytics</h2>
                    <p className="text-gray-600">
                        Comprehensive analytics for vendor performance and revenue
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {timeFrameOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={timeFrame === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeFrame(option.value)}
                            className="text-xs"
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <MetricCard
                    title="Platform Revenue"
                    value={formatCurrency(analyticsData.platformRevenue.total)}
                    change={analyticsData.platformRevenue.growth}
                    icon={DollarSign}
                    subtitle="Commission from all vendors"
                />
                <MetricCard
                    title="Vendor Net Revenue"
                    value={formatCurrency(analyticsData.vendorNetRevenue.total)}
                    change={analyticsData.vendorNetRevenue.growth}
                    icon={TrendingUp}
                    subtitle="After commission deduction"
                />
                <MetricCard
                    title="Total Sales"
                    value={formatCurrency(analyticsData.totalSales.total)}
                    change={analyticsData.totalSales.growth}
                    icon={ShoppingCart}
                    subtitle="Gross sales volume"
                />
                <MetricCard
                    title="Orders Growth"
                    value={`+${analyticsData.ordersGrowth.total}`}
                    change={analyticsData.ordersGrowth.growth}
                    icon={TrendingUp}
                    subtitle="New orders this period"
                />
                <MetricCard
                    title="Avg Commission"
                    value={`${analyticsData.averageCommission.rate}%`}
                    change={analyticsData.averageCommission.growth}
                    icon={Percent}
                    subtitle="Average commission rate"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Revenue Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Platform Revenue</CardTitle>
                                <CardDescription>
                                    Commission earnings from all vendors over time
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-200">
                                +{analyticsData.platformRevenue.growth}%
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                            <AreaChart data={analyticsData.platformRevenue.monthly}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                <XAxis
                                    dataKey="month"
                                    className="text-xs"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Orders Growth Chart */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Orders Growth</CardTitle>
                                <CardDescription>
                                    Weekly order volume and growth trends
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                                +{analyticsData.ordersGrowth.growth}%
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                            <LineChart data={analyticsData.ordersGrowth.weekly}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                <XAxis dataKey="week" className="text-xs" tick={{ fontSize: 12 }} />
                                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#82ca9d"
                                    strokeWidth={3}
                                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Comparison Chart */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Revenue Comparison</CardTitle>
                            <CardDescription>
                                Platform commission vs vendor net revenue over time
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Platform Revenue</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Vendor Net Revenue</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[400px]">
                        <BarChart
                            data={analyticsData.platformRevenue.monthly.map((item, index) => ({
                                month: item.month,
                                platformRevenue: item.revenue,
                                vendorRevenue:
                                    analyticsData.vendorNetRevenue.monthly[index]?.revenue || 0,
                            }))}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                            <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                            <YAxis
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="platformRevenue" fill="#3b82f6" name="Platform Revenue" />
                            <Bar dataKey="vendorRevenue" fill="#10b981" name="Vendor Revenue" />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Average Commission Trends */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Average Commission Trends</CardTitle>
                            <CardDescription>
                                Commission rate changes and vendor count over time
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                            {analyticsData.averageCommission.rate}% avg rate
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                        <LineChart data={analyticsData.averageCommission.monthly}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                            <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                            <YAxis
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
('use client');

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Target,
    RotateCcw,
    AlertCircle,
    BarChart3,
    Users,
    Calendar,
    Activity,
    Store,
    Package,
    Building2,
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

export function VendorAnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState('3m');

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Admin analytics data for ALL vendors
        const data = {
            // Total revenue from all vendors
            totalRevenue: 2847231.89,
            totalRevenueGrowth: 22.3,

            // Total vendors count
            totalVendors: 47,
            vendorsGrowth: 15.2,

            // Revenue timeline data (last 3 months) - ALL vendors combined
            revenueTimeline: [
                { date: 'Apr 9', revenue: 185000, orders: 1245, vendors: 42, commission: 27750 },
                { date: 'Apr 17', revenue: 192000, orders: 1352, vendors: 43, commission: 28800 },
                { date: 'Apr 25', revenue: 201000, orders: 1458, vendors: 43, commission: 30150 },
                { date: 'May 3', revenue: 212000, orders: 1565, vendors: 44, commission: 31800 },
                { date: 'May 11', revenue: 228000, orders: 1672, vendors: 45, commission: 34200 },
                { date: 'May 19', revenue: 235000, orders: 1778, vendors: 45, commission: 35250 },
                { date: 'May 27', revenue: 242000, orders: 1882, vendors: 46, commission: 36300 },
                { date: 'Jun 4', revenue: 251000, orders: 1989, vendors: 46, commission: 37650 },
                { date: 'Jun 12', revenue: 262000, orders: 2095, vendors: 47, commission: 39300 },
                { date: 'Jun 20', revenue: 278000, orders: 2202, vendors: 47, commission: 41700 },
                { date: 'Jun 30', revenue: 295000, orders: 2315, vendors: 47, commission: 44250 },
            ],

            // Order growth data (weekly) - ALL vendors
            orderGrowth: [
                { week: 'Week 1', currentWeek: 2245, previousWeek: 1998 },
                { week: 'Week 2', currentWeek: 2367, previousWeek: 2115 },
                { week: 'Week 3', currentWeek: 2489, previousWeek: 2234 },
                { week: 'Week 4', currentWeek: 2612, previousWeek: 2367 },
                { week: 'Week 5', currentWeek: 2734, previousWeek: 2489 },
                { week: 'Week 6', currentWeek: 2856, previousWeek: 2612 },
                { week: 'Week 7', currentWeek: 2978, previousWeek: 2734 },
            ],

            // Performance metrics over time - ALL vendors average
            performanceTimeline: [
                { month: 'Jan', efficiency: 82, satisfaction: 85, delivery: 89, commission: 28500 },
                { month: 'Feb', efficiency: 84, satisfaction: 87, delivery: 91, commission: 31200 },
                { month: 'Mar', efficiency: 86, satisfaction: 89, delivery: 93, commission: 34800 },
                { month: 'Apr', efficiency: 88, satisfaction: 91, delivery: 94, commission: 37500 },
                { month: 'May', efficiency: 90, satisfaction: 93, delivery: 96, commission: 41200 },
                { month: 'Jun', efficiency: 92, satisfaction: 95, delivery: 97, commission: 44250 },
            ],

            // Current period summary - ALL vendors
            currentPeriod: {
                totalRevenue: 2847231.89,
                totalOrders: 18947,
                totalSales: 52340,
                avgOrderValue: 150.32,
                totalCommission: 427084.78,
                topVendor: 'PharmaTech Solutions',
                topVendorRevenue: 534567.89,
            },

            // Performance metrics - ALL vendors average
            performance: {
                overallScore: 91.5,
                efficiency: 92,
                customerSatisfaction: 95,
                deliveryRate: 97,
                returnRate: 3.2,
                avgCommissionRate: 15.0,
            },

            // Vendor distribution by type
            vendorTypes: [
                { type: 'Pharmaceutical', count: 18, revenue: 1245000, percentage: 43.7 },
                { type: 'Medical Equipment', count: 12, revenue: 856000, percentage: 30.1 },
                { type: 'Healthcare Supplies', count: 10, revenue: 523000, percentage: 18.4 },
                { type: 'Wellness Products', count: 7, revenue: 223000, percentage: 7.8 },
            ],
        };

        setAnalytics(data);
        setIsLoading(false);
    };

    const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

    if (isLoading) {
        return (
            <div className="space-y-6" data-oid="yi5pz:-">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-200 animate-pulse rounded-xl h-32"
                        data-oid="73q:0jd"
                    ></div>
                ))}
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-8" data-oid=".gsovq5">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" data-oid="332ha_m" />
                <p className="text-gray-500" data-oid=":32fatj">
                    Unable to load vendor analytics
                </p>
            </div>
        );
    }

    const chartConfig = {
        revenue: {
            label: 'Revenue',
            color: 'hsl(var(--chart-1))',
        },
        orders: {
            label: 'Orders',
            color: 'hsl(var(--chart-2))',
        },
        commission: {
            label: 'Commission',
            color: 'hsl(var(--chart-3))',
        },
        currentWeek: {
            label: 'Current Week',
            color: 'hsl(var(--chart-1))',
        },
        previousWeek: {
            label: 'Previous Week',
            color: 'hsl(var(--chart-2))',
        },
        efficiency: {
            label: 'Efficiency',
            color: 'hsl(var(--chart-1))',
        },
        satisfaction: {
            label: 'Satisfaction',
            color: 'hsl(var(--chart-2))',
        },
        delivery: {
            label: 'Delivery Rate',
            color: 'hsl(var(--chart-3))',
        },
    };

    return (
        <div className="space-y-6" data-oid="c-9je.p">
            {/* Header with Time Period Selector */}
            <div className="flex items-center justify-between mb-8" data-oid="ooqylu_">
                <h3 className="text-2xl font-bold text-gray-900" data-oid="g4d_07q">
                    All Vendors Analytics Dashboard
                </h3>
                <div className="flex items-center space-x-2" data-oid="do0u75.">
                    <Button
                        variant={selectedTimeframe === '3m' ? 'default' : 'outline'}
                        size="sm"
                        className="bg-gray-800 text-white border-gray-700"
                        data-oid="0f:iuw2"
                    >
                        Last 3 months
                    </Button>
                    <Button
                        variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
                        size="sm"
                        data-oid="y6hl-2p"
                    >
                        Last 30 days
                    </Button>
                    <Button
                        variant={selectedTimeframe === '7d' ? 'default' : 'outline'}
                        size="sm"
                        data-oid="im-q7mz"
                    >
                        Last 7 days
                    </Button>
                </div>
            </div>

            {/* Top Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" data-oid="sri.hfb">
                {/* Total Revenue from All Vendors */}
                <Card className="bg-gray-900 text-white border-0" data-oid="fq0k3kq">
                    <CardContent className="p-6" data-oid="hr:z2st">
                        <div className="flex items-center justify-between mb-4" data-oid="9.5d826">
                            <div data-oid="cm6_gne">
                                <h4 className="text-sm text-gray-400 mb-1" data-oid="gfpvb-a">
                                    Total Revenue from All Vendors
                                </h4>
                                <div className="text-3xl font-bold" data-oid="-noudq9">
                                    {formatCurrency(analytics.totalRevenue)}
                                </div>
                                <div
                                    className="flex items-center text-sm text-green-400 mt-2"
                                    data-oid=":o8sdkl"
                                >
                                    <TrendingUp className="h-4 w-4 mr-1" data-oid="ffao5ml" />+
                                    {analytics.totalRevenueGrowth}% from last month
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-400 border-gray-600 hover:bg-gray-800"
                                data-oid="gh8pbok"
                            >
                                View More
                            </Button>
                        </div>
                        {/* Mini Revenue Chart */}
                        <div className="h-16 flex items-end space-x-1" data-oid="_88-r7u">
                            {analytics.revenueTimeline.slice(-12).map((point: any, i: number) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-sm flex-1"
                                    style={{ height: `${(point.revenue / 300000) * 100}%` }}
                                    data-oid="94kdlzu"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* My Total Commission */}
                <Card className="bg-gray-900 text-white border-0" data-oid="k7d3g9c">
                    <CardContent className="p-6" data-oid="9v1-9du">
                        <div className="flex items-center justify-between mb-4" data-oid="ntp4q6x">
                            <div data-oid="dco.h8e">
                                <h4 className="text-sm text-gray-400 mb-1" data-oid="_hdb92-">
                                    My Total Commission
                                </h4>
                                <div className="text-3xl font-bold" data-oid="e276eho">
                                    {formatCurrency(analytics.currentPeriod.totalCommission)}
                                </div>
                                <div
                                    className="flex items-center text-sm text-green-400 mt-2"
                                    data-oid=":7v:a4c"
                                >
                                    <TrendingUp className="h-4 w-4 mr-1" data-oid="2hffo9_" />+
                                    {analytics.performance.avgCommissionRate}% avg rate
                                </div>
                            </div>
                        </div>
                        {/* Mini Commission Chart */}
                        <div className="h-16 flex items-end justify-center" data-oid="bsaq16j">
                            <svg viewBox="0 0 200 60" className="w-full h-full" data-oid="_5tvy45">
                                <path
                                    d="M10,50 Q50,35 100,25 T190,10"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                    data-oid=".th7.sw"
                                />

                                <circle cx="10" cy="50" r="2" fill="white" data-oid="mjvh19i" />
                                <circle cx="50" cy="35" r="2" fill="white" data-oid="lihx3f." />
                                <circle cx="100" cy="25" r="2" fill="white" data-oid="ql6nsg0" />
                                <circle cx="150" cy="15" r="2" fill="white" data-oid="g3f8:c8" />
                                <circle cx="190" cy="10" r="2" fill="white" data-oid="5b8q3-1" />
                            </svg>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue & Commission Timeline Chart */}
            <Card className="bg-gray-900 text-white border-0 mb-8" data-oid="6w8.c0i">
                <CardContent className="p-6" data-oid="uz2:e45">
                    <div className="flex items-center justify-between mb-6" data-oid="miijmg1">
                        <div data-oid="rhkdwo4">
                            <h4 className="text-lg font-semibold mb-1" data-oid="k9v.myf">
                                Revenue & Commission Timeline
                            </h4>
                            <p className="text-sm text-gray-400" data-oid="_xlq3em">
                                Revenue and commission trends from all vendors over the last 3
                                months
                            </p>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="zed0r0k">
                            <div className="flex items-center space-x-2" data-oid="x0920li">
                                <div
                                    className="w-3 h-3 bg-blue-400 rounded-full"
                                    data-oid="zc4d6bq"
                                ></div>
                                <span className="text-sm text-gray-400" data-oid="o_9prgg">
                                    Revenue
                                </span>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="j9l17:6">
                                <div
                                    className="w-3 h-3 bg-green-400 rounded-full"
                                    data-oid="avtb1gw"
                                ></div>
                                <span className="text-sm text-gray-400" data-oid="4o5m40.">
                                    Commission
                                </span>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="u2_srsz">
                                <div
                                    className="w-3 h-3 bg-purple-400 rounded-full"
                                    data-oid="5ww5ldx"
                                ></div>
                                <span className="text-sm text-gray-400" data-oid="yahrsdm">
                                    Orders
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="h-80" data-oid="kgukk6i">
                        <ChartContainer config={chartConfig} data-oid="bu2-cyv">
                            <ResponsiveContainer width="100%" height="100%" data-oid="fyojd-c">
                                <AreaChart data={analytics.revenueTimeline} data-oid="onaiy1t">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#374151"
                                        data-oid="6_3_98_"
                                    />

                                    <XAxis
                                        dataKey="date"
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        data-oid=":mqqr1l"
                                    />

                                    <YAxis stroke="#9CA3AF" fontSize={12} data-oid="3ata9_z" />
                                    <ChartTooltip
                                        content={<ChartTooltipContent data-oid="33ly9c0" />}
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#F9FAFB',
                                        }}
                                        data-oid="_6jy-rs"
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#60A5FA"
                                        fill="#60A5FA"
                                        fillOpacity={0.3}
                                        strokeWidth={2}
                                        name="Revenue"
                                        data-oid="mwiabzs"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="commission"
                                        stroke="#34D399"
                                        strokeWidth={2}
                                        dot={{ fill: '#34D399', strokeWidth: 2, r: 4 }}
                                        name="Commission"
                                        data-oid="8_nj31v"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#A78BFA"
                                        strokeWidth={2}
                                        dot={{ fill: '#A78BFA', strokeWidth: 2, r: 4 }}
                                        name="Orders"
                                        data-oid="rvgiz7h"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Order Growth Chart */}
            <Card className="bg-gray-900 text-white border-0 mb-8" data-oid="2vv6w1m">
                <CardContent className="p-6" data-oid="j0fot40">
                    <div className="mb-6" data-oid="nqbwu7_">
                        <h4 className="text-lg font-semibold mb-1" data-oid="i-ahw2k">
                            Order Growth Comparison
                        </h4>
                        <p className="text-sm text-gray-400" data-oid="tf8y:od">
                            Weekly order comparison across all vendors showing growth trends
                        </p>
                    </div>

                    <div className="h-64" data-oid="05ya9ug">
                        <ChartContainer config={chartConfig} data-oid="su7waef">
                            <ResponsiveContainer width="100%" height="100%" data-oid="mmayiuu">
                                <BarChart
                                    data={analytics.orderGrowth}
                                    barGap={10}
                                    data-oid="4o83wac"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#374151"
                                        data-oid="ijhm978"
                                    />

                                    <XAxis
                                        dataKey="week"
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        data-oid="2rl:xoe"
                                    />

                                    <YAxis stroke="#9CA3AF" fontSize={12} data-oid="vjd2tkq" />
                                    <ChartTooltip
                                        content={<ChartTooltipContent data-oid=".nhp0vn" />}
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#F9FAFB',
                                        }}
                                        data-oid=":70dv0w"
                                    />

                                    <Bar
                                        dataKey="previousWeek"
                                        fill="#6B7280"
                                        radius={[2, 2, 0, 0]}
                                        name="Previous Week"
                                        data-oid="ctj9.wg"
                                    />

                                    <Bar
                                        dataKey="currentWeek"
                                        fill="#F9FAFB"
                                        radius={[2, 2, 0, 0]}
                                        name="Current Week"
                                        data-oid="g8526mx"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Timeline */}
            <Card className="bg-gray-900 text-white border-0 mb-8" data-oid="usq427f">
                <CardContent className="p-6" data-oid="vq8u80u">
                    <div className="mb-6" data-oid="h1tb3ro">
                        <h4 className="text-lg font-semibold mb-1" data-oid="9klnmuy">
                            Performance Timeline
                        </h4>
                        <p className="text-sm text-gray-400" data-oid="v7-i8ij">
                            Track average efficiency, satisfaction, and delivery performance across
                            all vendors
                        </p>
                    </div>

                    <div className="h-64" data-oid="e21f6en">
                        <ChartContainer config={chartConfig} data-oid="b_s:um7">
                            <ResponsiveContainer width="100%" height="100%" data-oid="3q7:q2:">
                                <LineChart data={analytics.performanceTimeline} data-oid="cx0ay2o">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#374151"
                                        data-oid="cccm340"
                                    />

                                    <XAxis
                                        dataKey="month"
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        data-oid="7e7rmfv"
                                    />

                                    <YAxis
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        domain={[75, 100]}
                                        data-oid="y1t_3mf"
                                    />

                                    <ChartTooltip
                                        content={<ChartTooltipContent data-oid=".c39.ku" />}
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#F9FAFB',
                                        }}
                                        data-oid="p92pj6b"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="efficiency"
                                        stroke="#60A5FA"
                                        strokeWidth={2}
                                        dot={{ fill: '#60A5FA', strokeWidth: 2, r: 4 }}
                                        name="Efficiency"
                                        data-oid="xnkx.ef"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="satisfaction"
                                        stroke="#34D399"
                                        strokeWidth={2}
                                        dot={{ fill: '#34D399', strokeWidth: 2, r: 4 }}
                                        name="Customer Satisfaction"
                                        data-oid="8:vilg-"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="delivery"
                                        stroke="#FBBF24"
                                        strokeWidth={2}
                                        dot={{ fill: '#FBBF24', strokeWidth: 2, r: 4 }}
                                        name="Delivery Rate"
                                        data-oid="urbjhiu"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                data-oid="c4xuns0"
            >
                <Card
                    className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30"
                    data-oid="gizr-n7"
                >
                    <CardContent className="p-6" data-oid="h-d.7cb">
                        <div className="flex items-center justify-between mb-4" data-oid="3nh:0h3">
                            <div data-oid="svqz_zi">
                                <h4
                                    className="text-sm font-medium text-blue-700"
                                    data-oid="x1idsyu"
                                >
                                    Total Revenue
                                </h4>
                                <p className="text-xs text-blue-600/70" data-oid="-yad9ph">
                                    From all vendors
                                </p>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg" data-oid="2nf.kos">
                                <DollarSign className="h-5 w-5 text-blue-600" data-oid="t49jth." />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-700 mb-2" data-oid=":3:o0:k">
                            {formatCurrency(analytics.currentPeriod.totalRevenue)}
                        </div>
                        <div className="flex items-center text-sm" data-oid="7ujjs2r">
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="-n7jhoh"
                            />

                            <span className="text-green-600 font-medium" data-oid="k.iw57p">
                                +{analytics.totalRevenueGrowth}%
                            </span>
                            <span className="text-blue-600/70 ml-1" data-oid="paa6bjp">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30"
                    data-oid="39p_t-r"
                >
                    <CardContent className="p-6" data-oid="dbw.4jk">
                        <div className="flex items-center justify-between mb-4" data-oid="hi4s3:v">
                            <div data-oid="q822el.">
                                <h4
                                    className="text-sm font-medium text-green-700"
                                    data-oid="opr8nih"
                                >
                                    Total Orders
                                </h4>
                                <p className="text-xs text-green-600/70" data-oid="n61rjx-">
                                    Across all vendors
                                </p>
                            </div>
                            <div className="p-2 bg-green-500/20 rounded-lg" data-oid="5f40gtb">
                                <ShoppingCart
                                    className="h-5 w-5 text-green-600"
                                    data-oid="x5:4pqw"
                                />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-green-700 mb-2" data-oid="y6dvx90">
                            {analytics.currentPeriod.totalOrders.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm" data-oid="1zbnsef">
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="9a8a5n-"
                            />

                            <span className="text-green-600 font-medium" data-oid="vqow4fx">
                                +28.5%
                            </span>
                            <span className="text-green-600/70 ml-1" data-oid="oxljz5-">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/30"
                    data-oid="_bb9mn0"
                >
                    <CardContent className="p-6" data-oid="7tr81i6">
                        <div className="flex items-center justify-between mb-4" data-oid="nh29nwn">
                            <div data-oid="c_td764">
                                <h4
                                    className="text-sm font-medium text-purple-700"
                                    data-oid="352qyyi"
                                >
                                    Total Sales Volume
                                </h4>
                                <p className="text-xs text-purple-600/70" data-oid="nb0bzkr">
                                    Units sold
                                </p>
                            </div>
                            <div className="p-2 bg-purple-500/20 rounded-lg" data-oid="wtu7m_a">
                                <Package className="h-5 w-5 text-purple-600" data-oid="zgh9xw." />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-purple-700 mb-2" data-oid="yhj8bif">
                            {analytics.currentPeriod.totalSales.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm" data-oid=".ufl0so">
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="n59f9ri"
                            />

                            <span className="text-green-600 font-medium" data-oid="phyiw0v">
                                +24.1%
                            </span>
                            <span className="text-purple-600/70 ml-1" data-oid="bfv_4_0">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/30"
                    data-oid="3d78thb"
                >
                    <CardContent className="p-6" data-oid="ey8gn.8">
                        <div className="flex items-center justify-between mb-4" data-oid=".773c.o">
                            <div data-oid="2.qp.xa">
                                <h4
                                    className="text-sm font-medium text-orange-700"
                                    data-oid="0_ijj_z"
                                >
                                    Active Vendors
                                </h4>
                                <p className="text-xs text-orange-600/70" data-oid="nkd02sw">
                                    Total partners
                                </p>
                            </div>
                            <div className="p-2 bg-orange-500/20 rounded-lg" data-oid="vzbzn-k">
                                <Building2 className="h-5 w-5 text-orange-600" data-oid="k9_54_l" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-orange-700 mb-2" data-oid="vraim7a">
                            {analytics.totalVendors}
                        </div>
                        <div className="flex items-center text-sm" data-oid="d_axrl2">
                            <TrendingUp
                                className="h-4 w-4 text-green-600 mr-1"
                                data-oid="14m37xq"
                            />

                            <span className="text-green-600 font-medium" data-oid="u_4-t50">
                                +{analytics.vendorsGrowth}%
                            </span>
                            <span className="text-orange-600/70 ml-1" data-oid="apo.6fw">
                                growth
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Vendor Distribution by Type */}
            <Card data-oid="vd:mb:b">
                <CardHeader data-oid="v1d.u9z">
                    <CardTitle data-oid="noa9oan">Vendor Distribution by Type</CardTitle>
                    <CardDescription data-oid="lpq5emu">
                        Revenue and vendor count breakdown by business category
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="mt5q5k1">
                    <div className="space-y-4" data-oid="kxnhton">
                        {analytics.vendorTypes.map((type: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                data-oid="ski27zm"
                            >
                                <div className="flex items-center space-x-4" data-oid="k0-qkke">
                                    <div
                                        className="w-8 h-8 bg-cura-primary text-white rounded-full flex items-center justify-center text-sm font-bold"
                                        data-oid="tnretur"
                                    >
                                        {type.count}
                                    </div>
                                    <div data-oid="7qbmz4i">
                                        <h4
                                            className="font-medium text-gray-900"
                                            data-oid=".ftuty3"
                                        >
                                            {type.type}
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="sivbcnx">
                                            {type.count} vendors
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right" data-oid="ib_e2hh">
                                    <p className="font-semibold text-lg" data-oid="t-sjz.2">
                                        {formatCurrency(type.revenue)}
                                    </p>
                                    <p className="text-sm text-cura-secondary" data-oid="wbf:37q">
                                        {type.percentage}% of total
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
