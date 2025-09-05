'use client';
import * as React from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

// Platform Revenue Data
const platformRevenueData = [
    { month: 'Jan', revenue: 45000, growth: 12 },
    { month: 'Feb', revenue: 52000, growth: 15.5 },
    { month: 'Mar', revenue: 48000, growth: -7.7 },
    { month: 'Apr', revenue: 61000, growth: 27.1 },
    { month: 'May', revenue: 55000, growth: -9.8 },
    { month: 'Jun', revenue: 67000, growth: 21.8 },
];

// Pharmacy Net Revenue Data
const pharmacyRevenueData = [
    { month: 'Jan', netRevenue: 38000, commission: 7000 },
    { month: 'Feb', netRevenue: 42000, commission: 10000 },
    { month: 'Mar', netRevenue: 39000, commission: 9000 },
    { month: 'Apr', netRevenue: 51000, commission: 10000 },
    { month: 'May', netRevenue: 46000, commission: 9000 },
    { month: 'Jun', netRevenue: 58000, commission: 9000 },
];

// Total Sales Data (Units sold)
const totalSalesData = [
    { month: 'Jan', units: 1250 },
    { month: 'Feb', units: 1420 },
    { month: 'Mar', units: 1180 },
    { month: 'Apr', units: 1650 },
    { month: 'May', units: 1380 },
    { month: 'Jun', units: 1820 },
];

// Order Growth Data
const orderGrowthData = [
    { month: 'Jan', orders: 890, growth: 8.5 },
    { month: 'Feb', orders: 1020, growth: 14.6 },
    { month: 'Mar', orders: 950, growth: -6.9 },
    { month: 'Apr', orders: 1180, growth: 24.2 },
    { month: 'May', orders: 1050, growth: -11.0 },
    { month: 'Jun', orders: 1350, growth: 28.6 },
];

// Enhanced brand color configurations for better visual appeal
const platformRevenueConfig = {
    revenue: {
        label: 'Revenue',
        color: '#1F1F6F',
    },
} satisfies ChartConfig;

const pharmacyRevenueConfig = {
    netRevenue: {
        label: 'Net Revenue',
        color: '#10B981',
    },
    commission: {
        label: 'Commission',
        color: '#3B82F6',
    },
} satisfies ChartConfig;

const totalSalesConfig = {
    units: {
        label: 'Units Sold',
        color: '#8B5CF6', // Purple for sales units
    },
} satisfies ChartConfig;

const orderGrowthConfig = {
    orders: {
        label: 'Total Orders',
        color: '#F59E0B', // Warning orange for order growth
    },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
    return (
        <div className="space-y-6" data-oid="9lbvo.u">
            {/* Platform Revenue and Pharmacy Net Revenue Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-oid="iov8:.d">
                {/* Platform Revenue Chart */}
                <Card data-oid="txsopfr">
                    <CardHeader data-oid="-6rf5wu">
                        <div className="flex items-center justify-between" data-oid="m1gihcn">
                            <div data-oid="re4:a9:">
                                <CardTitle data-oid="es1vnwy">Platform Revenue</CardTitle>
                                <CardDescription data-oid="hkg2y:v">
                                    Monthly revenue across all services
                                </CardDescription>
                            </div>
                            <div className="text-right" data-oid="9r9-06w">
                                <div className="text-2xl font-bold text-cura-primary" data-oid="bjnvhuc">
                                    $67K
                                </div>
                                <div className="text-sm text-cura-primary" data-oid=".6044_d">
                                    +21.8% from last month
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="85c7b1f">
                        <ChartContainer
                            config={platformRevenueConfig}
                            className="h-[200px]"
                            data-oid="xf9_jq-"
                        >
                            <AreaChart data={platformRevenueData} data-oid="be24oyt">
                                <defs data-oid="2gp-vw5">
                                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1" data-oid="ys-9qc2">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-revenue)"
                                            stopOpacity={0.9}
                                            data-oid="ex1roqs"
                                        />
                                        <stop
                                            offset="50%"
                                            stopColor="var(--color-revenue)"
                                            stopOpacity={0.4}
                                            data-oid="middle-stop"
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-revenue)"
                                            stopOpacity={0.05}
                                            data-oid="mwodtwi"
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" data-oid="x697_ty" />
                                <XAxis dataKey="month" data-oid="1rw4h9w" />
                                <YAxis data-oid="zklr5b:" />
                                <ChartTooltip
                                    content={<ChartTooltipContent data-oid="gdhaa6r" />}
                                    data-oid="cqrtjkq"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-revenue)"
                                    fillOpacity={1}
                                    fill="url(#fillRevenue)"
                                    data-oid="eb0n3fb"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                {/* Pharmacy Net Revenue Chart */}
                <Card data-oid="g0zlrl-">
                    <CardHeader data-oid="-vcici.">
                        <div className="flex items-center justify-between" data-oid="c24quj9">
                            <div data-oid="w.xhcik">
                                <CardTitle data-oid="99x1p6_">Pharmacy Net Revenue</CardTitle>
                                <CardDescription data-oid="k11vm1k">
                                    Revenue distribution across pharmacies
                                </CardDescription>
                            </div>
                            <div className="text-right" data-oid=".ssk-b3">
                                <div className="text-2xl font-bold text-cura-secondary" data-oid="62ad4jg">
                                    $58K
                                </div>
                                <div className="text-sm text-cura-secondary" data-oid="snvt7co">
                                    Net revenue this month
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="dic:te.">
                        <ChartContainer
                            config={pharmacyRevenueConfig}
                            className="h-[200px]"
                            data-oid="bqqgqpz"
                        >
                            <BarChart data={pharmacyRevenueData} data-oid="m6u3x0x">
                                <CartesianGrid strokeDasharray="3 3" data-oid="fipr042" />
                                <XAxis dataKey="month" data-oid="qkfmhcw" />
                                <YAxis data-oid=":oehhse" />
                                <ChartTooltip
                                    content={<ChartTooltipContent data-oid="mck0z1u" />}
                                    data-oid="ip2va:1"
                                />
                                <Bar
                                    dataKey="netRevenue"
                                    fill="var(--color-netRevenue)"
                                    radius={[4, 4, 0, 0]}
                                    data-oid="gb:dhp7"
                                />
                                <Bar
                                    dataKey="commission"
                                    fill="var(--color-commission)"
                                    radius={[4, 4, 0, 0]}
                                    data-oid="f2mx_yl"
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            {/* Total Sales and Order Growth Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-oid="usng8:8">
                {/* Total Sales Chart */}
                <Card data-oid=":0y23oo">
                    <CardHeader data-oid="et2:xxu">
                        <div className="flex items-center justify-between" data-oid="6q92y43">
                            <div data-oid="y5grv2:">
                                <CardTitle data-oid="s687-my">Total Sales</CardTitle>
                                <CardDescription data-oid="j71re-z">
                                    Units sold across all pharmacies
                                </CardDescription>
                            </div>
                            <div className="text-right" data-oid="cfki:-a">
                                <div className="text-2xl font-bold text-cura-accent" data-oid="ag28zl.">
                                    1,820
                                </div>
                                <div className="text-sm text-cura-accent" data-oid="ygs1-.u">
                                    +22.1%
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="e07i094">
                        <ChartContainer
                            config={totalSalesConfig}
                            className="h-[200px]"
                            data-oid="dtbcznd"
                        >
                            <LineChart data={totalSalesData} data-oid="lyw.7lb">
                                <CartesianGrid strokeDasharray="3 3" data-oid="-x_axm6" />
                                <XAxis dataKey="month" data-oid="35j1k4w" />
                                <YAxis data-oid="snc1q5s" />
                                <ChartTooltip
                                    content={<ChartTooltipContent data-oid="pcwwd4k" />}
                                    data-oid="-k3vsn."
                                />
                                <Line
                                    type="monotone"
                                    dataKey="units"
                                    stroke="var(--color-units)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--color-units)', strokeWidth: 2, stroke: '#fff', r: 5 }}
                                    activeDot={{ r: 7, fill: 'var(--color-units)', stroke: '#fff', strokeWidth: 2 }}
                                    data-oid="e31gu:8"
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                {/* Order Growth Chart */}
                <Card data-oid="9twqw1-">
                    <CardHeader data-oid="z5u2jpz">
                        <div className="flex items-center justify-between" data-oid="b530:5g">
                            <div data-oid="e:g5yhs">
                                <CardTitle data-oid="kjgvs2d">Order Growth</CardTitle>
                                <CardDescription data-oid="i.km501">
                                    Total orders this period from last month
                                </CardDescription>
                            </div>
                            <div className="text-right" data-oid=":79qhve">
                                <div className="text-2xl font-bold text-cura-primary" data-oid="bsbp0yk">
                                    1,350
                                </div>
                                <div className="text-sm text-cura-primary" data-oid="dx8sw30">
                                    +18.5%
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="r0iypyg">
                        <ChartContainer
                            config={orderGrowthConfig}
                            className="h-[200px]"
                            data-oid="z0undl6"
                        >
                            <BarChart data={orderGrowthData} data-oid="1iu87ua">
                                <CartesianGrid strokeDasharray="3 3" data-oid="v9q4ra-" />
                                <XAxis dataKey="month" data-oid="d0pv501" />
                                <YAxis data-oid="lxn.1h9" />
                                <ChartTooltip
                                    content={<ChartTooltipContent data-oid="_o2i7fy" />}
                                    data-oid="3kpv-:z"
                                />
                                <Bar
                                    dataKey="orders"
                                    fill="var(--color-orders)"
                                    radius={[4, 4, 0, 0]}
                                    data-oid="sjx:v-o"
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}