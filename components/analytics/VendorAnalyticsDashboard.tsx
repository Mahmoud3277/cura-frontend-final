'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Package,
    AlertTriangle,
    DollarSign,
    ShoppingCart,
    Activity,
    Clock,
    CheckCircle,
} from 'lucide-react';

interface AnalyticsData {
    revenue: {
        total: number;
        growth: number;
        monthly: Array<{ month: string; amount: number }>;
    };
    orders: {
        total: number;
        pending: number;
        completed: number;
        growth: number;
        hourly: Array<{ hour: string; orders: number }>;
    };
    inventory: {
        total: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
        categories: Array<{ name: string; value: number; color: string }>;
    };
    customers: {
        total: number;
        active: number;
        new: number;
        growth: number;
    };
}

// Enhanced brand color palette for better chart visualization
const BRAND_CHART_COLORS = {
    // Primary brand colors with variations
    primary: '#1F1F6F',
    primaryLight: '#3B3B8F',
    primaryDark: '#0F0F4F',

    // Secondary brand colors with variations
    secondary: '#14274E',
    secondaryLight: '#2A4A7E',
    secondaryDark: '#0A1A3E',

    // Accent colors
    accent: '#394867',
    accentLight: '#5A6B87',
    accentDark: '#293847',

    // Additional vibrant colors for variety
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
    pink: '#EC4899',
    teal: '#14B8A6',
    orange: '#F97316',
};

// Color arrays for different chart types
const PIE_CHART_COLORS = [
    BRAND_CHART_COLORS.primary,
    BRAND_CHART_COLORS.secondary,
    BRAND_CHART_COLORS.accent,
    BRAND_CHART_COLORS.success,
    BRAND_CHART_COLORS.info,
];

const BAR_CHART_COLORS = {
    revenue: BRAND_CHART_COLORS.primary,
    revenueGradient: `linear-gradient(135deg, ${BRAND_CHART_COLORS.primary} 0%, ${BRAND_CHART_COLORS.primaryLight} 100%)`,
};

const LINE_CHART_COLORS = {
    growth: BRAND_CHART_COLORS.success,
    revenue: BRAND_CHART_COLORS.secondary,
};

export function VendorAnalyticsDashboard() {
    const [timeframe, setTimeframe] = useState('30d');

    // Function to generate analytics data based on timeframe
    const getAnalyticsData = (timeframe: string): AnalyticsData => {
        const dataConfigs = {
            '7d': {
                periods: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                revenue: { total: 45000, growth: 8.5 },
                orders: { total: 157, pending: 12, completed: 145, growth: 5.3 },
                inventory: { total: 1892, inStock: 1654, lowStock: 198, outOfStock: 40 },
                customers: { total: 2847, active: 1923, new: 156, growth: 15.2 },
                multiplier: 0.2,
            },
            '30d': {
                periods: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                revenue: { total: 328000, growth: 12.5 },
                orders: { total: 1247, pending: 23, completed: 1189, growth: 8.3 },
                inventory: { total: 1892, inStock: 1654, lowStock: 198, outOfStock: 40 },
                customers: { total: 2847, active: 1923, new: 156, growth: 15.2 },
                multiplier: 1,
            },
            '3m': {
                periods: ['Month 1', 'Month 2', 'Month 3'],
                revenue: { total: 892000, growth: 18.5 },
                orders: { total: 3741, pending: 45, completed: 3567, growth: 24.7 },
                inventory: { total: 1892, inStock: 1654, lowStock: 198, outOfStock: 40 },
                customers: { total: 2847, active: 1923, new: 156, growth: 15.2 },
                multiplier: 3,
            },
            '6m': {
                periods: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                revenue: { total: 1784000, growth: 22.3 },
                orders: { total: 7482, pending: 67, completed: 7134, growth: 32.1 },
                inventory: { total: 1892, inStock: 1654, lowStock: 198, outOfStock: 40 },
                customers: { total: 2847, active: 1923, new: 156, growth: 15.2 },
                multiplier: 6,
            },
            '1y': {
                periods: ['Q1', 'Q2', 'Q3', 'Q4'],
                revenue: { total: 3568000, growth: 28.7 },
                orders: { total: 14964, pending: 89, completed: 14268, growth: 36.5 },
                inventory: { total: 1892, inStock: 1654, lowStock: 198, outOfStock: 40 },
                customers: { total: 2847, active: 1923, new: 156, growth: 15.2 },
                multiplier: 12,
            },
        };

        const config = dataConfigs[timeframe as keyof typeof dataConfigs] || dataConfigs['30d'];

        return {
            revenue: {
                total: config.revenue.total,
                growth: config.revenue.growth,
                monthly: config.periods.map((period, index) => ({
                    month: period,
                    amount: Math.round(45000 * config.multiplier * (1 + index * 0.1)),
                })),
            },
            orders: {
                total: config.orders.total,
                pending: config.orders.pending,
                completed: config.orders.completed,
                growth: config.orders.growth,
                hourly: [
                    { hour: '00', orders: Math.round(2 * config.multiplier) },
                    { hour: '04', orders: Math.round(1 * config.multiplier) },
                    { hour: '08', orders: Math.round(15 * config.multiplier) },
                    { hour: '12', orders: Math.round(25 * config.multiplier) },
                    { hour: '16', orders: Math.round(18 * config.multiplier) },
                    { hour: '20', orders: Math.round(12 * config.multiplier) },
                ],
            },
            inventory: {
                total: config.inventory.total,
                inStock: config.inventory.inStock,
                lowStock: config.inventory.lowStock,
                outOfStock: config.inventory.outOfStock,
                categories: [
                    { name: 'Electronics', value: 425, color: BRAND_CHART_COLORS.primary },
                    { name: 'Home & Garden', value: 312, color: BRAND_CHART_COLORS.secondary },
                    { name: 'Sports & Fitness', value: 278, color: BRAND_CHART_COLORS.success },
                    { name: 'Beauty & Personal Care', value: 234, color: BRAND_CHART_COLORS.info },
                    { name: 'Others', value: 643, color: BRAND_CHART_COLORS.accent },
                ],
            },
            customers: {
                total: config.customers.total,
                active: config.customers.active,
                new: config.customers.new,
                growth: config.customers.growth,
            },
        };
    };

    const analyticsData = getAnalyticsData(timeframe);

    const MetricCard = ({
        title,
        value,
        change,
        icon: Icon,
        trend = 'up',
    }: {
        title: string;
        value: string | number;
        change: number;
        icon: any;
        trend?: 'up' | 'down';
    }) => (
        <Card data-oid="l5lh50b">
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="jybcxnl"
            >
                <CardTitle className="text-sm font-medium" data-oid="r6oo83t">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" data-oid="nvki3ox" />
            </CardHeader>
            <CardContent data-oid="7h2ogcb">
                <div className="text-2xl font-bold" data-oid="6rgl124">
                    {value}
                </div>
                <div className="flex items-center text-xs text-muted-foreground" data-oid="_ziyjkl">
                    {trend === 'up' ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" data-oid="qtdrcv_" />
                    ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-red-500" data-oid="mf5i0u6" />
                    )}
                    <span
                        className={trend === 'up' ? 'text-green-500' : 'text-red-500'}
                        data-oid="ludt9o2"
                    >
                        {change > 0 ? '+' : ''}
                        {change}%
                    </span>
                    <span className="ml-1" data-oid="d90fzi0">
                        from last month
                    </span>
                </div>
            </CardContent>
        </Card>
    );

    const lowStockItems = [
        { name: 'Wireless Headphones', stock: 8, minStock: 25, category: 'Electronics' },
        { name: 'Garden Hose Set', stock: 12, minStock: 30, category: 'Home & Garden' },
        { name: 'Yoga Mat Premium', stock: 5, minStock: 20, category: 'Sports & Fitness' },
        { name: 'Face Moisturizer', stock: 3, minStock: 15, category: 'Beauty & Personal Care' },
    ];

    // Custom tooltip formatter for revenue charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
                    data-oid="uaa7p.e"
                >
                    <p className="font-medium" data-oid="j6:mfbo">{`${label}`}</p>
                    <p className="text-blue-600" data-oid=".n3o.yi">
                        {`Revenue: EGP ${payload[0].value.toLocaleString()}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Format Y-axis to show EGP values
    const formatYAxis = (value: number) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };

    return (
        <div className="space-y-6" data-oid="u9lj0qy">
            {/* Header */}
            <div className="flex items-center justify-between" data-oid="232k8rq">
                <div data-oid="i:q_6vg">
                    <h2 className="text-3xl font-bold tracking-tight" data-oid="_qpq88u">
                        Vendor Analytics
                    </h2>
                    <p className="text-muted-foreground" data-oid="t_e4voc">
                        Comprehensive insights into vendor performance and operations
                    </p>
                </div>
                <div className="flex items-center space-x-2" data-oid="ctrf324">
                    <Select value={timeframe} onValueChange={setTimeframe} data-oid="_0-y_7p">
                        <SelectTrigger className="w-[180px]" data-oid="apyh7td">
                            <SelectValue placeholder="Select timeframe" data-oid="xl9r06l" />
                        </SelectTrigger>
                        <SelectContent data-oid="nwl_wkr">
                            <SelectItem value="7d" data-oid="k-bik3-">
                                Last 7 days
                            </SelectItem>
                            <SelectItem value="30d" data-oid="3cu1mml">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="3m" data-oid="nnc-cff">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="6m" data-oid="9xanzyo">
                                Last 6 months
                            </SelectItem>
                            <SelectItem value="1y" data-oid="977_n21">
                                Last year
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-3" data-oid="6pluiu5">
                <MetricCard
                    title="Total Revenue"
                    value={`EGP ${analyticsData.revenue.total.toLocaleString()}`}
                    change={analyticsData.revenue.growth}
                    icon={DollarSign}
                    data-oid="e7w62is"
                />

                <MetricCard
                    title="Total Orders"
                    value={analyticsData.orders.total}
                    change={analyticsData.orders.growth}
                    icon={ShoppingCart}
                    data-oid="d2nmd6h"
                />

                <MetricCard
                    title="Inventory Items"
                    value={analyticsData.inventory.total}
                    change={-2.1}
                    icon={Package}
                    trend="down"
                    data-oid="h-j6sv3"
                />
            </div>

            {/* Alerts */}
            <div className="grid gap-4 md:grid-cols-2" data-oid="u8_iwfo">
                <Alert className="border-orange-200 bg-orange-50" data-oid="wbis3q9">
                    <AlertTriangle className="h-4 w-4 text-orange-600" data-oid="nd6dnaf" />
                    <AlertTitle className="text-orange-800" data-oid="xj2tyjc">
                        Low Stock Alert
                    </AlertTitle>
                    <AlertDescription className="text-orange-700" data-oid="nzmr4h:">
                        {analyticsData.inventory.lowStock} items are running low on stock
                    </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50" data-oid="9py6:w5">
                    <AlertTriangle className="h-4 w-4 text-red-600" data-oid="4.1k16o" />
                    <AlertTitle className="text-red-800" data-oid="438:o6q">
                        Out of Stock
                    </AlertTitle>
                    <AlertDescription className="text-red-700" data-oid="5gthzz9">
                        {analyticsData.inventory.outOfStock} items are completely out of stock
                    </AlertDescription>
                </Alert>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-4" data-oid="4llf7m4">
                <TabsList data-oid="k3h3pa1">
                    <TabsTrigger value="overview" data-oid="bf3ce56">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="revenue" data-oid="zay6utm">
                        Revenue
                    </TabsTrigger>
                    <TabsTrigger value="inventory" data-oid="pwlf816">
                        Inventory
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4" data-oid="m.-i.d3">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7" data-oid="2jcmtk3">
                        <Card className="col-span-4" data-oid="_:f5:vq">
                            <CardHeader data-oid="s3m8iqb">
                                <CardTitle data-oid="uu.wdxk">Revenue Overview</CardTitle>
                                <CardDescription data-oid="x9vr-af">
                                    Monthly revenue for the last 6 months
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2" data-oid="_9h:t_f">
                                <ResponsiveContainer width="100%" height={300} data-oid="ts3z6i0">
                                    <BarChart
                                        data={analyticsData.revenue.monthly}
                                        data-oid="e2tntsx"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" data-oid="wjkvwf7" />
                                        <XAxis dataKey="month" data-oid="ngzmz9b" />
                                        <YAxis tickFormatter={formatYAxis} data-oid="zpdegid" />
                                        <Tooltip
                                            content={<CustomTooltip data-oid="a35bm7:" />}
                                            data-oid="wj1.ng6"
                                        />

                                        <Bar
                                            dataKey="amount"
                                            fill={BRAND_CHART_COLORS.primary}
                                            radius={[4, 4, 0, 0]}
                                            data-oid="ty110wg"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3" data-oid="ob-kj7h">
                            <CardHeader data-oid="j0axfcq">
                                <CardTitle data-oid="w3ab8ys">Inventory Distribution</CardTitle>
                                <CardDescription data-oid="tpfrc0x">
                                    Products by category
                                </CardDescription>
                            </CardHeader>
                            <CardContent data-oid="4e_2_.u">
                                <ResponsiveContainer width="100%" height={300} data-oid="n:i96wf">
                                    <PieChart data-oid="3dl9bip">
                                        <Pie
                                            data={analyticsData.inventory.categories}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            data-oid="6rnru_r"
                                        >
                                            {analyticsData.inventory.categories.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            PIE_CHART_COLORS[
                                                                index % PIE_CHART_COLORS.length
                                                            ]
                                                        }
                                                        data-oid="1it8ch2"
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip data-oid="7xhjod2" />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2" data-oid="9bt6-.d">
                                    {analyticsData.inventory.categories.map((category, index) => (
                                        <div
                                            key={category.name}
                                            className="flex items-center justify-between"
                                            data-oid="bgwa_.2"
                                        >
                                            <div className="flex items-center" data-oid="va03sn8">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{
                                                        backgroundColor:
                                                            PIE_CHART_COLORS[
                                                                index % PIE_CHART_COLORS.length
                                                            ],
                                                    }}
                                                    data-oid="0v.5cf5"
                                                />

                                                <span className="text-sm" data-oid="2lt0.gd">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <Badge variant="secondary" data-oid="1u6tjhj">
                                                {category.value}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2" data-oid="k0iqj8-">
                        <Card data-oid="tzvp0vq">
                            <CardHeader data-oid="jfr-i9x">
                                <CardTitle data-oid="e1v1c76">Stock Status</CardTitle>
                                <CardDescription data-oid="l-g4rpd">
                                    Current inventory status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="dev_4-y">
                                <div className="space-y-2" data-oid="2a135ra">
                                    <div
                                        className="flex justify-between text-sm"
                                        data-oid="qpmishj"
                                    >
                                        <span data-oid="e10-l-d">In Stock</span>
                                        <span data-oid="feyy03s">
                                            {analyticsData.inventory.inStock} items
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            (analyticsData.inventory.inStock /
                                                analyticsData.inventory.total) *
                                            100
                                        }
                                        className="h-2"
                                        data-oid="e9qus3y"
                                    />
                                </div>
                                <div className="space-y-2" data-oid="f:y962z">
                                    <div
                                        className="flex justify-between text-sm"
                                        data-oid="qoy_xx_"
                                    >
                                        <span data-oid="wt2..mk">Low Stock</span>
                                        <span data-oid="k3o8l2j">
                                            {analyticsData.inventory.lowStock} items
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            (analyticsData.inventory.lowStock /
                                                analyticsData.inventory.total) *
                                            100
                                        }
                                        className="h-2"
                                        data-oid="x57spn3"
                                    />
                                </div>
                                <div className="space-y-2" data-oid="fb_u-j0">
                                    <div
                                        className="flex justify-between text-sm"
                                        data-oid="zj_._0m"
                                    >
                                        <span data-oid="bzbxv2m">Out of Stock</span>
                                        <span data-oid="6sl9cfv">
                                            {analyticsData.inventory.outOfStock} items
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            (analyticsData.inventory.outOfStock /
                                                analyticsData.inventory.total) *
                                            100
                                        }
                                        className="h-2"
                                        data-oid=".bpw-ge"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card data-oid="s9kq0u8">
                            <CardHeader data-oid="rbtxt7w">
                                <CardTitle data-oid="4nv7mkm">Order Status</CardTitle>
                                <CardDescription data-oid="4a0k:s_">
                                    Current order processing status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="dqoaew9">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="e5zvxo5"
                                >
                                    <div className="flex items-center" data-oid="7nsb.1.">
                                        <Clock
                                            className="mr-2 h-4 w-4 text-orange-500"
                                            data-oid="wba0dcd"
                                        />

                                        <span className="text-sm" data-oid="fhcn:6u">
                                            Pending Orders
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="text-orange-600 border-orange-200"
                                        data-oid="nx4ftwo"
                                    >
                                        {analyticsData.orders.pending}
                                    </Badge>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="-:dx:ci"
                                >
                                    <div className="flex items-center" data-oid="midh37-">
                                        <CheckCircle
                                            className="mr-2 h-4 w-4 text-green-500"
                                            data-oid="q54v_wk"
                                        />

                                        <span className="text-sm" data-oid="m9yz1nm">
                                            Completed Orders
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="text-green-600 border-green-200"
                                        data-oid="k-pp45l"
                                    >
                                        {analyticsData.orders.completed}
                                    </Badge>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="r:ru0sk"
                                >
                                    <div className="flex items-center" data-oid="au5b.zv">
                                        <Activity
                                            className="mr-2 h-4 w-4 text-blue-500"
                                            data-oid="1aroufz"
                                        />

                                        <span className="text-sm" data-oid="d1mce66">
                                            Total Orders
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="text-blue-600 border-blue-200"
                                        data-oid="nxz4h:0"
                                    >
                                        {analyticsData.orders.total}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4" data-oid="n06emjt">
                    <Card data-oid="_m14jnn">
                        <CardHeader data-oid="ehm51cd">
                            <CardTitle data-oid="euf.dnm">Low Stock Items</CardTitle>
                            <CardDescription data-oid="rigzkbq">
                                Items that need immediate attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="75i:osr">
                            <Table data-oid="e9j66gn">
                                <TableHeader data-oid="uxiywef">
                                    <TableRow data-oid="dae5io9">
                                        <TableHead data-oid="k5a2wi_">Product Name</TableHead>
                                        <TableHead data-oid="ft8div6">Category</TableHead>
                                        <TableHead data-oid="n6sq87b">Current Stock</TableHead>
                                        <TableHead data-oid=":xgkdnr">Min Stock</TableHead>
                                        <TableHead data-oid="4bb:a3q">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="qcl-wj6">
                                    {lowStockItems.map((item, index) => (
                                        <TableRow key={index} data-oid="n43_q8u">
                                            <TableCell className="font-medium" data-oid="vkh5alr">
                                                {item.name}
                                            </TableCell>
                                            <TableCell data-oid="yjxv1qr">
                                                {item.category}
                                            </TableCell>
                                            <TableCell data-oid="p3rs13g">{item.stock}</TableCell>
                                            <TableCell data-oid="xgi47h2">
                                                {item.minStock}
                                            </TableCell>
                                            <TableCell data-oid="9127285">
                                                <Badge
                                                    variant={
                                                        item.stock === 0
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        item.stock === 0
                                                            ? ''
                                                            : 'text-orange-600 bg-orange-100'
                                                    }
                                                    data-oid="ez_2:22"
                                                >
                                                    {item.stock === 0
                                                        ? 'Out of Stock'
                                                        : 'Low Stock'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="revenue" className="space-y-4" data-oid="fnfgfss">
                    <Card data-oid="gcuj2mq">
                        <CardHeader data-oid="z-szv7w">
                            <CardTitle data-oid="_3_dfvd">Revenue Trends</CardTitle>
                            <CardDescription data-oid="ydt_9kq">
                                Monthly revenue analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="vl4.9y6">
                            <ResponsiveContainer width="100%" height={400} data-oid="5i4szp4">
                                <LineChart data={analyticsData.revenue.monthly} data-oid="ud6yoo6">
                                    <CartesianGrid strokeDasharray="3 3" data-oid="bxi6tjo" />
                                    <XAxis dataKey="month" data-oid="5eoogn:" />
                                    <YAxis tickFormatter={formatYAxis} data-oid="iver5j5" />
                                    <Tooltip
                                        content={<CustomTooltip data-oid="5zcfb1a" />}
                                        data-oid="g.3:a3_"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke={BRAND_CHART_COLORS.secondary}
                                        strokeWidth={3}
                                        dot={{
                                            fill: BRAND_CHART_COLORS.secondary,
                                            strokeWidth: 2,
                                            stroke: '#fff',
                                            r: 6,
                                        }}
                                        activeDot={{
                                            r: 8,
                                            fill: BRAND_CHART_COLORS.primary,
                                            stroke: '#fff',
                                            strokeWidth: 2,
                                        }}
                                        data-oid="h7:l7n3"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
