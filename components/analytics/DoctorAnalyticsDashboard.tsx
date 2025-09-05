'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Users,
    DollarSign,
    Activity,
    CheckCircle,
    Clock,
    Target,
} from 'lucide-react';

interface DoctorAnalyticsData {
    referrals: {
        total: number;
        successful: number;
        pending: number;
        growth: number;
        monthly: Array<{ month: string; referrals: number; successful: number }>;
    };
    commission: {
        total: number;
        pending: number;
        thisMonth: number;
        growth: number;
        monthly: Array<{ month: string; amount: number }>;
    };
    performance: {
        conversionRate: number;
        averageOrderValue: number;
        rating: number;
        reviewCount: number;
    };
    topPharmacies: Array<{
        name: string;
        orders: number;
        revenue: number;
        conversionRate: number;
    }>;
}

const COLORS = ['#1F1F6F', '#394867', '#9BA4B4', '#F1F6F9', '#14274E'];

export function DoctorAnalyticsDashboard() {
    const [analyticsData, setAnalyticsData] = useState<DoctorAnalyticsData>({
        referrals: {
            total: 1247,
            successful: 892,
            pending: 45,
            growth: 15.3,
            monthly: [
                { month: 'Jan', referrals: 145, successful: 98 },
                { month: 'Feb', referrals: 167, successful: 124 },
                { month: 'Mar', referrals: 189, successful: 142 },
                { month: 'Apr', referrals: 203, successful: 156 },
                { month: 'May', referrals: 234, successful: 178 },
                { month: 'Jun', referrals: 309, successful: 194 },
            ],
        },
        commission: {
            total: 45600,
            pending: 3200,
            thisMonth: 8900,
            growth: 22.1,
            monthly: [
                { month: 'Jan', amount: 4500 },
                { month: 'Feb', amount: 5200 },
                { month: 'Mar', amount: 6100 },
                { month: 'Apr', amount: 7300 },
                { month: 'May', amount: 8200 },
                { month: 'Jun', amount: 8900 },
            ],
        },
        performance: {
            conversionRate: 71.5,
            averageOrderValue: 285,
            rating: 4.8,
            reviewCount: 156,
        },
        topPharmacies: [
            { name: 'HealthPlus Pharmacy', orders: 234, revenue: 67800, conversionRate: 78.2 },
            { name: 'MediCare Center', orders: 189, revenue: 52400, conversionRate: 72.1 },
            { name: 'City Pharmacy', orders: 156, revenue: 43200, conversionRate: 69.8 },
            { name: 'Quick Meds', orders: 134, revenue: 38900, conversionRate: 65.4 },
        ],
    });

    const MetricCard = ({
        title,
        value,
        change,
        icon: Icon,
        trend = 'up',
        subtitle,
    }: {
        title: string;
        value: string | number;
        change: number;
        icon: any;
        trend?: 'up' | 'down';
        subtitle?: string;
    }) => (
        <Card data-oid="n8klxjh">
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="_e7zwsu"
            >
                <CardTitle className="text-sm font-medium" data-oid="trxer.7">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" data-oid="730lfns" />
            </CardHeader>
            <CardContent data-oid="etfzm2a">
                <div className="text-2xl font-bold" data-oid="q2p76-j">
                    {value}
                </div>
                <div className="flex items-center text-xs text-muted-foreground" data-oid="ut3e9qy">
                    {trend === 'up' ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" data-oid="woqitbh" />
                    ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-red-500" data-oid="x--wxzx" />
                    )}
                    <span
                        className={trend === 'up' ? 'text-green-500' : 'text-red-500'}
                        data-oid="rgyk59k"
                    >
                        {change > 0 ? '+' : ''}
                        {change}%
                    </span>
                    <span className="ml-1" data-oid="dema-jj">
                        {subtitle || 'from last month'}
                    </span>
                </div>
            </CardContent>
        </Card>
    );

    const formatCurrency = (amount: number) => {
        return `EGP ${amount.toLocaleString()}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
                    data-oid=".dgjv4m"
                >
                    <p className="font-medium" data-oid="ngprhn6">{`${label}`}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} data-oid=".v4_xq.">
                            {`${entry.dataKey}: ${
                                entry.dataKey === 'amount'
                                    ? formatCurrency(entry.value)
                                    : entry.value
                            }`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6" data-oid=":n95g1w">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-3" data-oid=".7nllbm">
                <MetricCard
                    title="Total Referrals"
                    value={analyticsData.referrals.total}
                    change={analyticsData.referrals.growth}
                    icon={Users}
                    data-oid="32aj8pw"
                />

                <MetricCard
                    title="Successful Referrals"
                    value={analyticsData.referrals.successful}
                    change={12.8}
                    icon={CheckCircle}
                    data-oid="8-uoe7x"
                />

                <MetricCard
                    title="Total Commission"
                    value={formatCurrency(analyticsData.commission.total)}
                    change={analyticsData.commission.growth}
                    icon={DollarSign}
                    data-oid="vw_3v.1"
                />
            </div>

            {/* Performance Overview */}
            <div className="grid gap-4 md:grid-cols-2" data-oid="k7jofpj">
                <Card data-oid="m-0vr-z">
                    <CardHeader data-oid="mngexf:">
                        <CardTitle className="text-sm font-medium" data-oid="0bk.v6u">
                            Commission Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="0g-wz-l">
                        <div className="flex items-center justify-between" data-oid="3mg-kr2">
                            <div className="flex items-center" data-oid="m_b40mq">
                                <DollarSign
                                    className="mr-2 h-4 w-4 text-green-500"
                                    data-oid="rf.mnfu"
                                />

                                <span className="text-sm" data-oid="j2-mwb7">
                                    Total Earned
                                </span>
                            </div>
                            <Badge
                                variant="outline"
                                className="text-green-600 border-green-200"
                                data-oid="or8xv7w"
                            >
                                {formatCurrency(analyticsData.commission.total)}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between" data-oid="p34zbqs">
                            <div className="flex items-center" data-oid="5vhwgg5">
                                <Clock
                                    className="mr-2 h-4 w-4 text-orange-500"
                                    data-oid="u70f78q"
                                />

                                <span className="text-sm" data-oid="60cw21m">
                                    Pending
                                </span>
                            </div>
                            <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-200"
                                data-oid="2j.61wc"
                            >
                                {formatCurrency(analyticsData.commission.pending)}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between" data-oid=":9i72qm">
                            <div className="flex items-center" data-oid="zot1b6z">
                                <Activity
                                    className="mr-2 h-4 w-4 text-blue-500"
                                    data-oid="h_b4ns2"
                                />

                                <span className="text-sm" data-oid="q660ldp">
                                    This Month
                                </span>
                            </div>
                            <Badge
                                variant="outline"
                                className="text-blue-600 border-blue-200"
                                data-oid="aor5tsn"
                            >
                                {formatCurrency(analyticsData.commission.thisMonth)}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="u-dfkf5">
                    <CardHeader data-oid=".oig2zi">
                        <CardTitle className="text-sm font-medium" data-oid="_ff_1qu">
                            Quick Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="yao:8r1">
                        <div className="text-center" data-oid="obey:_1">
                            <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="93ipd_0">
                                {analyticsData.referrals.pending}
                            </div>
                            <p className="text-xs text-gray-500" data-oid="k64nua5">
                                Pending Referrals
                            </p>
                        </div>
                        <div className="text-center" data-oid="95uxsu9">
                            <div className="text-2xl font-bold text-green-600" data-oid="-xoocr5">
                                {Math.round(
                                    (analyticsData.referrals.successful /
                                        analyticsData.referrals.total) *
                                        100,
                                )}
                                %
                            </div>
                            <p className="text-xs text-gray-500" data-oid="e8p6067">
                                Success Rate
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-4" data-oid="__s8_d1">
                <TabsList data-oid="7s1h190">
                    <TabsTrigger value="overview" data-oid="pym93e-">
                        Overview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4" data-oid="ktl24fa">
                    <div className="grid gap-4 md:grid-cols-2" data-oid="jc3vm8z">
                        <Card data-oid="hntuas:">
                            <CardHeader data-oid="y7grahg">
                                <CardTitle data-oid="-vpdod0">Referral Trends</CardTitle>
                                <CardDescription data-oid="jdj1irq">
                                    Monthly referral performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent data-oid="zwm461p">
                                <ResponsiveContainer width="100%" height={300} data-oid="hdkb:nk">
                                    <BarChart
                                        data={analyticsData.referrals.monthly}
                                        data-oid="eszc6gm"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" data-oid="nm3ow6_" />
                                        <XAxis dataKey="month" data-oid=".h9.3e8" />
                                        <YAxis data-oid="h4zea2_" />
                                        <Tooltip
                                            content={<CustomTooltip data-oid="py3jpmf" />}
                                            data-oid="c4z_3xe"
                                        />

                                        <Bar
                                            dataKey="referrals"
                                            fill="#1F1F6F"
                                            name="Total Referrals"
                                            data-oid="3yqbi68"
                                        />

                                        <Bar
                                            dataKey="successful"
                                            fill="#394867"
                                            name="Successful"
                                            data-oid="1wsa32w"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card data-oid="qizmm48">
                            <CardHeader data-oid="1vwxrn1">
                                <CardTitle data-oid="cc1k6.:">Commission Growth</CardTitle>
                                <CardDescription data-oid="e6:sqhx">
                                    Monthly commission earnings
                                </CardDescription>
                            </CardHeader>
                            <CardContent data-oid="4:o15q_">
                                <ResponsiveContainer width="100%" height={300} data-oid="y4.vdo5">
                                    <LineChart
                                        data={analyticsData.commission.monthly}
                                        data-oid="fheszx_"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" data-oid="uqb__th" />
                                        <XAxis dataKey="month" data-oid="tab9_kf" />
                                        <YAxis data-oid="l1ymtmk" />
                                        <Tooltip
                                            content={<CustomTooltip data-oid="jyi6724" />}
                                            data-oid="82cc2e-"
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#1F1F6F"
                                            strokeWidth={2}
                                            dot={{ fill: '#1F1F6F' }}
                                            data-oid="eecawi8"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
