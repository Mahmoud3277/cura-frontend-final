'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
} from 'recharts';
import axios from 'axios';
import {
    TrendingUp,
    TrendingDown,
    Users,
    UserCheck,
    DollarSign,
    Repeat,
    X,
    Eye,
    FileText,
    Download,
    BarChart3,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    ShoppingBag,
    Target,
    Activity,
    Stethoscope,
    UserPlus,
    CreditCard,
    TrendingUpIcon,
    Edit,
    MoreHorizontal,
} from 'lucide-react';
import { AnyARecord } from 'node:dns';

// Enhanced analytics interfaces for comprehensive doctor management
interface DoctorAnalytics {
    totalDoctors: number;
    activeDoctors: number;
    offlineDoctors: number;
    doctorGrowth: {
        monthly: number;
        percentage: number;
        trend: 'up' | 'down' | 'stable';
    };
    revenueFromDoctors: {
        total: number;
        monthly: number;
        monthlyTrend: {
            month: string;
            revenue: number;
            orders: number;
            doctors: number;
        }[];
    };
    referralSystem: {
        totalOrders: number;
        monthlyOrders: number;
        conversionRate: number;
        averageOrderValue: number;
        topReferralSources: {
            source: string;
            orders: number;
            revenue: number;
            conversionRate: number;
        }[];
    };
    customerRetention: {
        totalCustomers: number;
        returningCustomers: number;
        retentionRate: number;
        repeatOrderRate: number;
        customerLifetimeValue: number;
        repeatOrdersByDoctor: any;
    };
    userActivity: {
        activeUsers: number;
        offlineUsers: number;
        dailyActiveUsers: number;
        weeklyActiveUsers: number;
        userEngagement: {
            averageSessionTime: number;
            pagesPerSession: number;
            bounceRate: number;
        };
        usersByDoctor: {
            doctorId: string;
            doctorName: string;
            totalUsers: number;
            activeUsers: number;
            offlineUsers: number;
            lastActiveDate: string;
        }[];
    };
    commissionBreakdown: {
        totalCommissionPaid: number;
        monthlyCommission: number;
        averageCommissionRate: number;
        doctorEarnings: {
            doctorId: string;
            doctorName: string;
            totalEarned: number;
            monthlyEarned: number;
            commissionRate: number;
            ordersGenerated: number;
            revenueGenerated: number;
        }[];
        platformRevenue: {
            total: number;
            monthly: number;
            afterCommissions: number;
            profitMargin: number;
        };
    };
}

interface DoctorData {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    status: 'active' | 'pending' | 'inactive';
    totalReferrals: number;
    totalEarnings: number;
    monthlyEarnings: number;
    commissionRate: number;
    joinedDate: string;
    lastActive: string;
    qrCodeScans: number;
    conversionRate: number;
}

export default function AdminDoctorsPage() {
    const [activeTab, setActiveTab] = useState<'analytics' | 'doctors' | 'revenue' | 'performance'>(
        'analytics',
    );
    const [analytics, setAnalytics] = useState<DoctorAnalytics | null>(null);
    const [doctorData, setDoctorData] = useState<DoctorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

    useEffect(() => {
        loadAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeframe]);

    const exportToCSV = () => {
        const csvHeaders = [
            'Doctor ID',
            'Name',
            'Email',
            'Phone',
            'Specialization',
            'Status',
            'Total Referrals',
            'Total Earnings (EGP)',
            'Monthly Earnings (EGP)',
            'Commission Rate (%)',
            'Joined Date',
            'Last Active',
            'QR Code Scans',
            'Conversion Rate (%)',
        ];

        const csvData = doctorData.map((doctor) => [
            doctor.id,
            doctor.name,
            doctor.email,
            doctor.phone,
            doctor.specialization,
            doctor.status,
            doctor.totalReferrals,
            doctor.totalEarnings,
            doctor.monthlyEarnings,
            doctor.commissionRate,
            doctor.joinedDate,
            doctor.lastActive,
            doctor.qrCodeScans,
            doctor.conversionRate,
        ]);

        const csvContent = [csvHeaders, ...csvData]
            .map((row) => row.map((field) => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            `doctors_export_${new Date().toISOString().split('T')[0]}.csv`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = () => {
        const excelData = doctorData.map((doctor) => ({
            'Doctor ID': doctor.id,
            Name: doctor.name,
            Email: doctor.email,
            Phone: doctor.phone,
            Specialization: doctor.specialization,
            Status: doctor.status,
            'Total Referrals': doctor.totalReferrals,
            'Total Earnings (EGP)': doctor.totalEarnings,
            'Monthly Earnings (EGP)': doctor.monthlyEarnings,
            'Commission Rate (%)': doctor.commissionRate,
            'Joined Date': doctor.joinedDate,
            'Last Active': doctor.lastActive,
            'QR Code Scans': doctor.qrCodeScans,
            'Conversion Rate (%)': doctor.conversionRate,
        }));

        // Create a simple Excel-compatible format
        const headers = Object.keys(excelData[0] || {});
        const csvContent = [
            headers.join('\t'),
            ...excelData.map((row:any) => headers.map((header:any) => row[header]).join('\t')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            `doctors_export_${new Date().toISOString().split('T')[0]}.xlsx`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const loadAnalytics = async () => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate comprehensive analytics data
        const mockAnalytics: DoctorAnalytics = {
            totalDoctors: 156,
            activeDoctors: 134,
            offlineDoctors: 22,
            doctorGrowth: {
                monthly: 12,
                percentage: 8.3,
                trend: 'up',
            },
            revenueFromDoctors: {
                total: 2456789.5,
                monthly: 234567.8,
                monthlyTrend: generateMonthlyTrend(),
            },
            referralSystem: {
                totalOrders: 8945,
                monthlyOrders: 1234,
                conversionRate: 68.4,
                averageOrderValue: 275.6,
                topReferralSources: [
                    { source: 'QR Code', orders: 3456, revenue: 952340.8, conversionRate: 72.5 },
                    {
                        source: 'Referral Link',
                        orders: 2789,
                        revenue: 768923.4,
                        conversionRate: 65.8,
                    },
                    {
                        source: 'Direct Contact',
                        orders: 1890,
                        revenue: 520845.6,
                        conversionRate: 78.2,
                    },
                    {
                        source: 'Social Media',
                        orders: 810,
                        revenue: 223456.7,
                        conversionRate: 54.5,
                    },
                ],
            },
            customerRetention: {
                totalCustomers: 12456,
                returningCustomers: 8934,
                retentionRate: 71.7,
                repeatOrderRate: 45.8,
                customerLifetimeValue: 456.75,
                repeatOrdersByDoctor: generateDoctorRetentionData(),
            },
            userActivity: {
                activeUsers: 9876,
                offlineUsers: 2580,
                dailyActiveUsers: 3456,
                weeklyActiveUsers: 7890,
                userEngagement: {
                    averageSessionTime: 8.5,
                    pagesPerSession: 4.2,
                    bounceRate: 23.4,
                },
                usersByDoctor: generateUserActivityData(),
            },
            commissionBreakdown: {
                totalCommissionPaid: 123456.75,
                monthlyCommission: 18456.8,
                averageCommissionRate: 3.8,
                doctorEarnings: generateDoctorEarningsData(),
                platformRevenue: {
                    total: 2333332.75,
                    monthly: 216110.2,
                    afterCommissions: 2209876.0,
                    profitMargin: 89.9,
                },
            },
        };

        // Generate doctor data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`);
        const fetchedUsers = response.data;
        let filteredUsers = fetchedUsers;
        const newUsers = filteredUsers.filter(
            (user:any) => user.role == 'doctor'
          );

        setAnalytics(mockAnalytics);
        setDoctorData(newUsers);
        setIsLoading(false);
    };

    // Helper functions to generate mock data
    const generateMonthlyTrend = () => {
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        return months.slice(-6).map((month) => ({
            month,
            revenue: 180000 + Math.random() * 80000,
            orders: 800 + Math.random() * 400,
            doctors: 120 + Math.random() * 20,
        }));
    };

    const generateDoctorRetentionData = () => {
        const doctors = [
            'Dr. Ahmed Hassan',
            'Dr. Fatima Ali',
            'Dr. Mohamed Salah',
            'Dr. Nour Ibrahim',
            'Dr. Omar Khaled',
        ];

        return doctorData.map((name, index) => ({
            doctorId: `doc-${index + 1}`,
            doctorName: name,
            totalCustomers: Math.floor(200 + Math.random() * 300),
            repeatCustomers: Math.floor(150 + Math.random() * 200),
            repeatOrders: Math.floor(300 + Math.random() * 400),
            retentionRate: Math.floor(65 + Math.random() * 20),
        }));
    };

    const generateUserActivityData = () => {
        const doctors = [
            'Dr. Ahmed Hassan',
            'Dr. Fatima Ali',
            'Dr. Mohamed Salah',
            'Dr. Nour Ibrahim',
            'Dr. Omar Khaled',
        ];

        return doctors.map((name, index) => ({
            doctorId: `doc-${index + 1}`,
            doctorName: name,
            totalUsers: Math.floor(500 + Math.random() * 1000),
            activeUsers: Math.floor(400 + Math.random() * 600),
            offlineUsers: Math.floor(50 + Math.random() * 200),
            lastActiveDate: new Date(
                Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
        }));
    };

    const generateDoctorEarningsData = () => {
        const doctors = [
            'Dr. Ahmed Hassan',
            'Dr. Fatima Ali',
            'Dr. Mohamed Salah',
            'Dr. Nour Ibrahim',
            'Dr. Omar Khaled',
        ];

        return doctors.map((name, index) => ({
            doctorId: `doc-${index + 1}`,
            doctorName: name,
            totalEarned: Math.floor(15000 + Math.random() * 25000),
            monthlyEarned: Math.floor(2000 + Math.random() * 3000),
            commissionRate: Math.floor((3.0 + Math.random() * 2.0) * 10) / 10,
            ordersGenerated: Math.floor(150 + Math.random() * 200),
            revenueGenerated: Math.floor(45000 + Math.random() * 60000),
        }));
    };

   

    if (isLoading || !analytics) {
        return (
            <div className="space-y-6" data-oid="ji8vxqe">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="qx4u_m7">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="nsokwi_"
                        ></div>
                    ))}
                </div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-96" data-oid="k_gq1lm"></div>
            </div>
        );
    }

    const chartConfig = {
        revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
        orders: { label: 'Orders', color: 'hsl(var(--chart-2))' },
        doctors: { label: 'Doctors', color: 'hsl(var(--chart-3))' },
    };

    return (
        <div className="space-y-6" data-oid="y7v1v3c">
            <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as any)}
                className="w-full"
                data-oid="a3_ainc"
            >
                <TabsList
                    className="grid w-full grid-cols-4 bg-white rounded-xl shadow-sm border border-gray-100 p-1"
                    data-oid="6:kubi."
                >
                    <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-2"
                        data-oid="b45w4no"
                    >
                        <BarChart3 className="h-4 w-4" data-oid="eysc85a" />
                        Analytics Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="doctors"
                        className="flex items-center gap-2"
                        data-oid="z:esxxx"
                    >
                        <Stethoscope className="h-4 w-4" data-oid="2jec3oc" />
                        Doctor Management
                    </TabsTrigger>
                    <TabsTrigger
                        value="revenue"
                        className="flex items-center gap-2"
                        data-oid="v9q-aby"
                    >
                        <CreditCard className="h-4 w-4" data-oid="rzcp8qd" />
                        Revenue & Commissions
                    </TabsTrigger>
                    <TabsTrigger
                        value="performance"
                        className="flex items-center gap-2"
                        data-oid="v7fspx_"
                    >
                        <TrendingUpIcon className="h-4 w-4" data-oid="i_7d7n6" />
                        Performance Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-6" data-oid="j9mlrth">
                    {/* Header */}
                    <div className="flex items-center justify-between" data-oid="l.3hnva">
                        <div data-oid="2z3gefq">
                            <h1 className="text-3xl font-bold text-gray-900" data-oid="n3c_65v">
                                Doctor Analytics Overview
                            </h1>
                            <p className="text-gray-600 mt-2" data-oid="uslm-se">
                                Comprehensive analytics for doctor performance and revenue
                            </p>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="7p2xdf_">
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value as any)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cura-primary"
                                data-oid="_:ugp7t"
                            >
                                <option value="7d" data-oid="gd_5c5e">
                                    Last 7 Days
                                </option>
                                <option value="30d" data-oid="f4c4pcs">
                                    Last 30 Days
                                </option>
                                <option value="90d" data-oid="bxck4.f">
                                    Last 90 Days
                                </option>
                                <option value="1y" data-oid="18ft:8x">
                                    Last Year
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Main KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="yn8khav">
                        <Card
                            className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20 hover:shadow-lg transition-all duration-300"
                            data-oid="tk74rrg"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="jzlgvi:"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-cura-primary"
                                    data-oid=".nw1vi5"
                                >
                                    Total Doctors
                                </CardTitle>
                                <div
                                    className="p-2 bg-cura-primary/10 rounded-lg"
                                    data-oid="xwj1e4f"
                                >
                                    <Stethoscope
                                        className="h-5 w-5 text-cura-primary"
                                        data-oid="36vf:b2"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="jmlbzm7">
                                <div
                                    className="text-3xl font-bold text-cura-secondary mb-1"
                                    data-oid="b5e-c7q"
                                >
                                    {analytics.totalDoctors.toString()}
                                </div>
                                <p
                                    className="text-xs text-cura-primary flex items-center gap-1"
                                    data-oid="0w3tij0"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid="_a2c22-" />+
                                    {analytics.doctorGrowth.percentage}% from last month
                                </p>
                                <p className="text-xs text-cura-accent mt-1" data-oid="27o9l9d">
                                    {analytics.activeDoctors} active, {analytics.offlineDoctors}{' '}
                                    offline
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300"
                            data-oid="s.3d_sg"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="zsjo99z"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-emerald-700"
                                    data-oid="rj:q8-1"
                                >
                                    Monthly Revenue
                                </CardTitle>
                                <div className="p-2 bg-emerald-100 rounded-lg" data-oid=".:fypaw">
                                    <DollarSign
                                        className="h-5 w-5 text-emerald-600"
                                        data-oid="0sntzf3"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="sm5ukxy">
                                <div
                                    className="text-3xl font-bold text-emerald-800 mb-1"
                                    data-oid="da-:w3l"
                                >
                                    EGP {analytics.revenueFromDoctors.monthly.toLocaleString()}
                                </div>
                                <p
                                    className="text-xs text-emerald-600 flex items-center gap-1"
                                    data-oid="51t_vvt"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid="2t_cq3_" />
                                    +15.8% from last month
                                </p>
                                <p className="text-xs text-emerald-600 mt-1" data-oid="oq7vdhu">
                                    Total: EGP{' '}
                                    {(analytics.revenueFromDoctors.total / 1000000).toFixed(1)}M
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-cura-accent/10 to-cura-accent/20 border-cura-accent/30 hover:shadow-lg transition-all duration-300"
                            data-oid="6_iopup"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="wbvb2dq"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-cura-accent"
                                    data-oid="9po8wfu"
                                >
                                    Referral Orders
                                </CardTitle>
                                <div
                                    className="p-2 bg-cura-accent/20 rounded-lg"
                                    data-oid="llkyz54"
                                >
                                    <ShoppingBag
                                        className="h-5 w-5 text-cura-accent"
                                        data-oid="oxqn740"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="rjnjhm1">
                                <div
                                    className="text-3xl font-bold text-cura-secondary mb-1"
                                    data-oid="o9si0lh"
                                >
                                    {analytics.referralSystem.monthlyOrders.toLocaleString()}
                                </div>
                                <p
                                    className="text-xs text-cura-accent flex items-center gap-1"
                                    data-oid=":ku0v20"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid="zu_1kgj" />
                                    +12.3% from last month
                                </p>
                                <p className="text-xs text-cura-accent mt-1" data-oid="1xrtfzn">
                                    {analytics.referralSystem.conversionRate}% conversion rate
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-cura-light/20 to-cura-light/30 border-cura-light/40 hover:shadow-lg transition-all duration-300"
                            data-oid="1vxok:p"
                        >
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2"
                                data-oid="_6gst.t"
                            >
                                <CardTitle
                                    className="text-sm font-semibold text-cura-secondary"
                                    data-oid="2fzsgad"
                                >
                                    Customer Retention
                                </CardTitle>
                                <div className="p-2 bg-cura-light/30 rounded-lg" data-oid="mjdg8la">
                                    <Repeat
                                        className="h-5 w-5 text-cura-secondary"
                                        data-oid="ktr3ud5"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent data-oid="se81p:o">
                                <div
                                    className="text-3xl font-bold text-cura-secondary mb-1"
                                    data-oid="gmztbqa"
                                >
                                    {analytics.customerRetention.retentionRate.toFixed(1)}%
                                </div>
                                <p
                                    className="text-xs text-cura-accent flex items-center gap-1"
                                    data-oid="m0._-g0"
                                >
                                    <TrendingUp className="h-3 w-3" data-oid="u_gqth5" />
                                    +5.2% from last month
                                </p>
                                <p className="text-xs text-cura-accent mt-1" data-oid=":505urh">
                                    {analytics.customerRetention.repeatOrderRate.toFixed(1)}% repeat
                                    orders
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="dar2b8b">
                        <Card data-oid="u:jskv_">
                            <CardHeader data-oid="zcuease">
                                <CardTitle data-oid="6i.4udl">Monthly Revenue Trends</CardTitle>
                                <CardDescription data-oid="fpopbut">
                                    Revenue generated from doctor referrals over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent data-oid="if.5aes">
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[300px] w-full"
                                    data-oid="ydt-ce0"
                                >
                                    <AreaChart
                                        data={analytics.revenueFromDoctors.monthlyTrend}
                                        data-oid="29a95qz"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" data-oid="83ytqlp" />
                                        <XAxis dataKey="month" data-oid="zvnorp." />
                                        <YAxis data-oid="mjevg6n" />
                                        <ChartTooltip
                                            content={<ChartTooltipContent data-oid="bq0ad_c" />}
                                            data-oid="l3ueof:"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="var(--color-revenue)"
                                            fill="var(--color-revenue)"
                                            fillOpacity={0.6}
                                            data-oid="jjyanp7"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card data-oid="in-50l_">
                            <CardHeader data-oid="o4bdy_h">
                                <CardTitle data-oid="gzzrj29">Top Referral Sources</CardTitle>
                                <CardDescription data-oid="1ddp3t5">
                                    Most effective channels for doctor referrals
                                </CardDescription>
                            </CardHeader>
                            <CardContent data-oid="tw5wdrk">
                                <div className="space-y-4" data-oid="13bnug-">
                                    {analytics.referralSystem.topReferralSources.map(
                                        (source, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                data-oid="0yl7tn5"
                                            >
                                                <div data-oid="23o1ocp">
                                                    <p
                                                        className="font-medium text-gray-900"
                                                        data-oid="8w6ha1b"
                                                    >
                                                        {source.source}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="q.1nzqx"
                                                    >
                                                        {source.orders} orders •{' '}
                                                        {source.conversionRate}% conversion
                                                    </p>
                                                </div>
                                                <div className="text-right" data-oid="flwzqct">
                                                    <p
                                                        className="font-bold text-[#1F1F6F]"
                                                        data-oid="s_o.dlp"
                                                    >
                                                        EGP {source.revenue.toLocaleString()}
                                                    </p>
                                                    <p
                                                        className="text-sm text-green-600"
                                                        data-oid="bby.3-c"
                                                    >
                                                        Revenue
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="d0enodc">
                        <Card data-oid="dgyqxwq">
                            <CardHeader data-oid="ss7x8ja">
                                <CardTitle data-oid="0iyxq.k">Revenue Summary</CardTitle>
                            </CardHeader>
                            <CardContent data-oid="jou5ajp">
                                <div className="space-y-4" data-oid="ljb-fdd">
                                    <div
                                        className="flex justify-between items-center"
                                        data-oid="f2:pw4:"
                                    >
                                        <span className="text-gray-600" data-oid="4m-:k:9">
                                            Total Revenue
                                        </span>
                                        <span
                                            className="font-bold text-[#1F1F6F]"
                                            data-oid=".glu4b3"
                                        >
                                            EGP{' '}
                                            {analytics.revenueFromDoctors.total.toLocaleString()}
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-oid="a5:0rkq"
                                    >
                                        <span className="text-gray-600" data-oid="o6zdbyh">
                                            Commission Paid
                                        </span>
                                        <span className="font-bold text-red-600" data-oid=":4n9vp5">
                                            -EGP{' '}
                                            {analytics.commissionBreakdown.totalCommissionPaid.toLocaleString()}
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center border-t pt-2"
                                        data-oid="0tqwtk_"
                                    >
                                        <span
                                            className="text-gray-900 font-medium"
                                            data-oid=".0zvh_v"
                                        >
                                            Net Revenue
                                        </span>
                                        <span
                                            className="font-bold text-green-600"
                                            data-oid=":9zlwrr"
                                        >
                                            EGP{' '}
                                            {analytics.commissionBreakdown.platformRevenue.afterCommissions.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card data-oid="8ooj0wz">
                            <CardHeader data-oid="oauqili">
                                <CardTitle data-oid="9a9vi-i">Doctor Metrics</CardTitle>
                            </CardHeader>
                            <CardContent data-oid="pumqpo:">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                    data-oid="xhe2b6d"
                                >
                                    <div
                                        className="bg-gradient-to-br from-[#14274E]/10 to-[#14274E]/20 p-4 rounded-lg border border-[#14274E]/30"
                                        data-oid="0aoj8.n"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="ec22tnw"
                                        >
                                            <div data-oid="023gkie">
                                                <p
                                                    className="text-[#14274E] text-sm font-medium"
                                                    data-oid="efw1e96"
                                                >
                                                    Total Customers From Doctors
                                                </p>
                                                <p
                                                    className="text-2xl font-bold text-[#14274E]"
                                                    data-oid="lis0_jh"
                                                >
                                                    3,247
                                                </p>
                                                <p
                                                    className="text-xs text-[#394867]"
                                                    data-oid="ntjbuac"
                                                >
                                                    +15.3% from last month
                                                </p>
                                            </div>
                                            <Users
                                                className="h-8 w-8 text-[#14274E]"
                                                data-oid="h4efi.u"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-[#14274E]/10 to-[#14274E]/20 p-4 rounded-lg border border-[#14274E]/30"
                                        data-oid="cizmbr1"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="je5c4q:"
                                        >
                                            <div data-oid="31qg086">
                                                <p
                                                    className="text-[#14274E] text-sm font-medium"
                                                    data-oid="vq-.4qs"
                                                >
                                                    Repeat Purchase Customers
                                                </p>
                                                <p
                                                    className="text-2xl font-bold text-[#14274E]"
                                                    data-oid="sce:z55"
                                                >
                                                    1,542
                                                </p>
                                                <p
                                                    className="text-xs text-[#394867]"
                                                    data-oid="9dmub0n"
                                                >
                                                    47.5% of total customers
                                                </p>
                                            </div>
                                            <Repeat
                                                className="h-8 w-8 text-[#14274E]"
                                                data-oid="-eebywg"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-[#14274E]/10 to-[#14274E]/20 p-4 rounded-lg border border-[#14274E]/30"
                                        data-oid="30:4k5h"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="9l:6wu2"
                                        >
                                            <div data-oid="g2mx965">
                                                <p
                                                    className="text-[#14274E] text-sm font-medium"
                                                    data-oid="h3-:h02"
                                                >
                                                    Multiple Purchase Customers
                                                </p>
                                                <p
                                                    className="text-2xl font-bold text-[#14274E]"
                                                    data-oid="avq7xy8"
                                                >
                                                    689
                                                </p>
                                                <p
                                                    className="text-xs text-[#394867]"
                                                    data-oid="k.s.d7."
                                                >
                                                    21.2% of total customers
                                                </p>
                                            </div>
                                            <ShoppingBag
                                                className="h-8 w-8 text-[#14274E]"
                                                data-oid="q73qyt1"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-[#14274E]/10 to-[#14274E]/20 p-4 rounded-lg border border-[#14274E]/30"
                                        data-oid="gyx945x"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="remdebk"
                                        >
                                            <div data-oid="_yumhkc">
                                                <p
                                                    className="text-[#14274E] text-sm font-medium"
                                                    data-oid="cm771wx"
                                                >
                                                    Subscription Customers
                                                </p>
                                                <p
                                                    className="text-2xl font-bold text-[#14274E]"
                                                    data-oid="p237n_2"
                                                >
                                                    423
                                                </p>
                                                <p
                                                    className="text-xs text-[#394867]"
                                                    data-oid="mn74amw"
                                                >
                                                    13.0% of total customers
                                                </p>
                                            </div>
                                            <UserCheck
                                                className="h-8 w-8 text-[#14274E]"
                                                data-oid="oc8ypj."
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-[#14274E]/10 to-[#14274E]/20 p-4 rounded-lg border border-[#14274E]/30"
                                        data-oid="eq2.gfk"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="pb2n7ds"
                                        >
                                            <div data-oid="haoka:w">
                                                <p
                                                    className="text-[#14274E] text-sm font-medium"
                                                    data-oid="8n9gbgl"
                                                >
                                                    Prescription Customers
                                                </p>
                                                <p
                                                    className="text-2xl font-bold text-[#14274E]"
                                                    data-oid="axuog3v"
                                                >
                                                    1,987
                                                </p>
                                                <p
                                                    className="text-xs text-[#394867]"
                                                    data-oid="ic0c5iy"
                                                >
                                                    61.2% of total customers
                                                </p>
                                            </div>
                                            <FileText
                                                className="h-8 w-8 text-[#14274E]"
                                                data-oid="wholihl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="doctors" className="space-y-6" data-oid="vycemm3">
                    <div className="flex justify-between items-center" data-oid="5ncmzht">
                        <div data-oid="loovhuu">
                            <h2 className="text-2xl font-bold text-gray-900" data-oid="_zkd26q">
                                Doctor Management
                            </h2>
                            <p className="text-gray-600" data-oid=":h8pfu3">
                                Manage all doctors and their performance metrics
                            </p>
                        </div>
                    </div>

                    {/* Doctor Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="rmj1wes">
                        <Card
                            className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20"
                            data-oid="pb7k:g2"
                        >
                            <CardContent className="p-6" data-oid="le15yse">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="-7njo8d"
                                >
                                    <div data-oid="4rruvso">
                                        <p
                                            className="text-cura-primary text-sm font-medium"
                                            data-oid="58vk.1s"
                                        >
                                            Active Doctors
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-secondary mb-1"
                                            data-oid="vo0qeds"
                                        >
                                            {analytics.activeDoctors}
                                        </p>
                                        <p className="text-xs text-cura-accent" data-oid="ek7ez57">
                                            {Math.round(
                                                (analytics.activeDoctors / analytics.totalDoctors) *
                                                    100,
                                            )}
                                            % of total
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-primary/10 rounded-lg"
                                        data-oid="so6rvsy"
                                    >
                                        <UserCheck
                                            className="h-8 w-8 text-cura-primary"
                                            data-oid="ko.ws24"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                            data-oid="vt:tx1r"
                        >
                            <CardContent className="p-6" data-oid=".f_w5nf">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="t0tqg2k"
                                >
                                    <div data-oid="c974_ty">
                                        <p
                                            className="text-amber-600 text-sm font-medium"
                                            data-oid="0sm8b9c"
                                        >
                                            Pending Approvals
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-amber-800 mb-1"
                                            data-oid="pmmntsl"
                                        >
                                            {
                                                doctorData.filter((d) => d.status === 'pending')
                                                    .length
                                            }
                                        </p>
                                        <p className="text-xs text-amber-600" data-oid="q:5_18z">
                                            Awaiting verification
                                        </p>
                                    </div>
                                    <div className="p-3 bg-amber-100 rounded-lg" data-oid=".rptxil">
                                        <Clock
                                            className="h-8 w-8 text-amber-600"
                                            data-oid="9ooboc8"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                            data-oid="78kinwa"
                        >
                            <CardContent className="p-6" data-oid="w6m.5pw">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="llwqo6q"
                                >
                                    <div data-oid="t:_j52e">
                                        <p
                                            className="text-emerald-600 text-sm font-medium"
                                            data-oid="g3-p8ey"
                                        >
                                            Total Referrals
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-emerald-800 mb-1"
                                            data-oid="49a.qk-"
                                        >
                                            {analytics.referralSystem.totalOrders.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-emerald-600" data-oid="3z8vk2r">
                                            All time referrals
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-emerald-100 rounded-lg"
                                        data-oid="7ihdsts"
                                    >
                                        <Target
                                            className="h-8 w-8 text-emerald-600"
                                            data-oid="e0i:ytl"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-cura-accent/10 to-cura-accent/20 border-cura-accent/30"
                            data-oid="d-rjj8z"
                        >
                            <CardContent className="p-6" data-oid="so5o056">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="pccnar_"
                                >
                                    <div data-oid="vm56:gc">
                                        <p
                                            className="text-cura-accent text-sm font-medium"
                                            data-oid="u20ya7p"
                                        >
                                            Total Earnings
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-secondary mb-1"
                                            data-oid="0gneufk"
                                        >
                                            EGP{' '}
                                            {analytics.commissionBreakdown.totalCommissionPaid.toLocaleString()}
                                        </p>
                                        <p
                                            className="text-xs text-cura-accent mt-1"
                                            data-oid=":nz.0nb"
                                        >
                                            Commission paid
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-accent/20 rounded-lg"
                                        data-oid="aqpv49t"
                                    >
                                        <CreditCard
                                            className="h-8 w-8 text-cura-accent"
                                            data-oid="caf.avd"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* All Doctors - Simplified Layout */}
                    <Card className="border border-gray-200 shadow-sm" data-oid="xe24omc">
                        <CardHeader
                            className="bg-white border-b border-gray-100 px-6 py-4"
                            data-oid="nme2te7"
                        >
                            <div className="flex items-center justify-between" data-oid=".ly8k1u">
                                <div data-oid="t431ia:">
                                    <CardTitle
                                        className="text-xl font-semibold text-gray-900"
                                        data-oid="l_p04f-"
                                    >
                                        All Doctors
                                    </CardTitle>
                                    <CardDescription
                                        className="text-gray-600 mt-1"
                                        data-oid="3y2:d5e"
                                    >
                                        Manage and view all registered doctors
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-3" data-oid="qzq8f.k">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center space-x-2 border-cura-primary text-cura-primary hover:bg-cura-primary hover:text-white transition-all duration-200"
                                        onClick={exportToCSV}
                                        data-oid="n-zuok2"
                                    >
                                        <FileText className="h-4 w-4" data-oid="r4tj9.t" />
                                        <span data-oid=":g-5bxn">Export CSV</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex items-center space-x-2 bg-cura-secondary text-white hover:bg-cura-accent transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={exportToExcel}
                                        data-oid="vzvyxbw"
                                    >
                                        <Download className="h-4 w-4" data-oid="ca6y:fr" />
                                        <span data-oid="qn44xkx">Export Excel</span>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6" data-oid="8-v5f6h">
                            {/* Column Headers */}
                            <div className="mb-6" data-oid="gjc.8zm">
                                <div
                                    className="grid grid-cols-6 gap-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100"
                                    data-oid="40sawzf"
                                >
                                    <div
                                        className="flex items-center justify-center space-x-2"
                                        data-oid="btolp9l"
                                    >
                                        <Stethoscope className="h-4 w-4" data-oid="ys-rv7-" />
                                        <span data-oid="qpzlvsa">Doctor Info</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-center space-x-2"
                                        data-oid="5xnylg8"
                                    >
                                        <Phone className="h-4 w-4" data-oid="e4k7cui" />
                                        <span data-oid="c41vz-7">Contact Details</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-center space-x-2"
                                        data-oid="lb-8eey"
                                    >
                                        <MapPin className="h-4 w-4" data-oid="t4zca_t" />
                                        <span data-oid="kjh9k3e">Practice & Location</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-center space-x-2"
                                        data-oid="i7-dtfe"
                                    >
                                        <Target className="h-4 w-4" data-oid="o8a.se1" />
                                        <span data-oid="3t4udkk">Referral Statistics</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-center space-x-2"
                                        data-oid="nhnct-z"
                                    >
                                        <Badge className="h-4 w-4" data-oid="uje6lgf" />
                                        <span data-oid="1rmtg2o">Specialization & Performance</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-center space-x-2"
                                        data-oid="0tero5:"
                                    >
                                        <Activity className="h-4 w-4" data-oid="9u7qxup" />
                                        <span data-oid="bn3j8u1">Status & Activity</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4" data-oid="3f2k9zb">
                                {doctorData.slice(0, 12).map((doctor:any, index) => (
                                    <div
                                        key={doctor.id}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-white hover:shadow-md transition-all duration-200"
                                        data-oid="qv3eeuh"
                                    >
                                        <div className="grid grid-cols-6 gap-4" data-oid="s7d7nea">
                                            {/* Doctor Info */}
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="n7by8mj"
                                            >
                                                <Avatar
                                                    className="h-10 w-10 border-2 border-cura-primary/30"
                                                    data-oid=":cg_o7p"
                                                >
                                                    <AvatarFallback
                                                        className="bg-cura-primary text-white text-sm font-bold"
                                                        data-oid="hi26krs"
                                                    >
                                                        {doctor.name
                                                            .split(' ')
                                                            .map((n:any) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div data-oid="8zyk_v9">
                                                    <h4
                                                        className="font-semibold text-gray-900 text-sm"
                                                        data-oid="mbyzm_j"
                                                    >
                                                        {doctor.name}
                                                    </h4>
                                                    <p
                                                        className="text-xs text-gray-500"
                                                        data-oid="9sbhsgo"
                                                    >
                                                        {doctor.id}
                                                    </p>
                                                    <p
                                                        className="text-xs text-gray-400"
                                                        data-oid="13or8fl"
                                                    >
                                                        Registered:{' '}
                                                        {new Date(
                                                            doctor.joinedDate,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Contact Details */}
                                            <div className="space-y-2" data-oid="tds_i3:">
                                                <div
                                                    className="flex items-center text-sm text-gray-600"
                                                    data-oid="1st6u81"
                                                >
                                                    <Mail
                                                        className="h-4 w-4 mr-2 text-cura-light"
                                                        data-oid="5.d_umo"
                                                    />

                                                    <span className="truncate" data-oid=":3r5e_4">
                                                        {doctor.email}
                                                    </span>
                                                </div>
                                                <div
                                                    className="flex items-center text-sm text-gray-600"
                                                    data-oid="foxs.2l"
                                                >
                                                    <Phone
                                                        className="h-4 w-4 mr-2 text-cura-light"
                                                        data-oid="4co4vvc"
                                                    />

                                                    <span data-oid="_k53kix">{doctor.phone}</span>
                                                </div>
                                                <div
                                                    className="flex items-center text-sm text-cura-accent"
                                                    data-oid=":4yagux"
                                                >
                                                    <Phone
                                                        className="h-4 w-4 mr-2 text-cura-accent"
                                                        data-oid="vivw3_i"
                                                    />

                                                    <span data-oid="frh:a1d">
                                                        +20{' '}
                                                        {Math.floor(
                                                            Math.random() * 900000000 + 100000000,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Practice & Location */}
                                            <div className="space-y-2" data-oid="ys.q9o9">
                                                <div className="text-sm" data-oid="mcz2kbz">
                                                    <p className="text-gray-600" data-oid="fo75rzm">
                                                        {Math.floor(Math.random() * 500) + 100}{' '}
                                                        {
                                                            [
                                                                'El Tahrir St.',
                                                                'Nile Corniche',
                                                                'Zamalek St.',
                                                                'Maadi St.',
                                                            ][Math.floor(Math.random() * 4)]
                                                        }
                                                        ,
                                                    </p>
                                                    <p className="text-gray-600" data-oid="2z1mil6">
                                                        Building{' '}
                                                        {Math.floor(Math.random() * 50) + 1},{' '}
                                                        {doctor.specialization}
                                                    </p>
                                                </div>
                                                <div
                                                    className="flex items-center text-sm text-gray-600"
                                                    data-oid="v02:g21"
                                                >
                                                    <MapPin
                                                        className="h-4 w-4 mr-2 text-cura-light"
                                                        data-oid="i:16ga2"
                                                    />

                                                    <span data-oid="hk.6pjq">
                                                        {
                                                            [
                                                                'Cairo',
                                                                'Giza',
                                                                'Alexandria',
                                                                'Mansoura',
                                                            ][Math.floor(Math.random() * 4)]
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Referral Statistics */}
                                            <div className="space-y-2" data-oid="ljmul6t">
                                                <div
                                                    className="flex items-center text-sm"
                                                    data-oid="coipg:h"
                                                >
                                                    <ShoppingBag
                                                        className="h-4 w-4 mr-2 text-cura-primary"
                                                        data-oid="m195yzq"
                                                    />

                                                    <span
                                                        className="font-semibold text-cura-primary"
                                                        data-oid="a7hdx01"
                                                    >
                                                        {doctor.totalReferrals} referrals
                                                    </span>
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="hh6_nft"
                                                >
                                                    <p data-oid="gv7kwhd">
                                                        EGP{' '}
                                                        {(doctor.totalEarnings / 1000).toFixed(1)}K
                                                    </p>
                                                    <p data-oid=".kqp1ym">
                                                        Avg: EGP{' '}
                                                        {Math.floor(
                                                            doctor.totalEarnings /
                                                                doctor.totalReferrals,
                                                        )}
                                                    </p>
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="ftt9bsu"
                                                >
                                                    <p data-oid="60czf4m">
                                                        {(Math.random() * 2 + 1).toFixed(1)}/month
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Specialization & Performance */}
                                            <div className="space-y-2" data-oid="_.hd22w">
                                                <div className="text-sm" data-oid="ep7tau6">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-cura-primary/5 text-cura-primary border-cura-primary/20"
                                                        data-oid="g7-42bb"
                                                    >
                                                        {doctor.specialization}
                                                    </Badge>
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="lscyqeg"
                                                >
                                                    <div
                                                        className="flex justify-between items-center"
                                                        data-oid="u4rpf.h"
                                                    >
                                                        <span
                                                            className="text-xs text-gray-500"
                                                            data-oid="0bw-z5r"
                                                        >
                                                            Performance:
                                                        </span>
                                                        <span
                                                            className="text-xs font-medium text-cura-primary"
                                                            data-oid="nosdnu0"
                                                        >
                                                            {doctor.conversionRate.toFixed(1)}%
                                                            conversion
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="flex justify-between items-center mt-1"
                                                        data-oid="4i9gz52"
                                                    >
                                                        <span
                                                            className="text-xs text-gray-500"
                                                            data-oid="k4b7i05"
                                                        >
                                                            Commission Rate:
                                                        </span>
                                                        <span
                                                            className="text-xs font-medium text-cura-accent"
                                                            data-oid="uf9.d5u"
                                                        >
                                                            {doctor.commission.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status & Activity */}
                                            <div className="space-y-2" data-oid="jzxg8de">
                                                <Badge
                                                    className={`text-xs px-2 py-1 font-medium ${
                                                        doctor.status === 'active'
                                                            ? 'bg-cura-primary/10 text-cura-primary border-cura-primary/30'
                                                            : doctor.status === 'pending'
                                                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                                                              : 'bg-red-100 text-red-800 border-red-300'
                                                    }`}
                                                    data-oid="7j6tweu"
                                                >
                                                    {doctor.status.charAt(0).toUpperCase() +
                                                        doctor.status.slice(1)}
                                                </Badge>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="w8uccip"
                                                >
                                                    <p data-oid="t.yl5gr">Last Referral:</p>
                                                    <p className="text-xs" data-oid="b86g47u">
                                                        {new Date(
                                                            doctor.lastActive,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <p
                                                        className="text-xs text-gray-500"
                                                        data-oid="7k_4c7k"
                                                    >
                                                        {Math.floor(
                                                            (Date.now() -
                                                                new Date(
                                                                    doctor.lastActive,
                                                                ).getTime()) /
                                                                (1000 * 60 * 60 * 24),
                                                        )}{' '}
                                                        days ago
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            <div className="flex justify-center mt-8" data-oid="9:1f1gl">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-2 text-sm font-medium border-cura-primary text-cura-primary hover:bg-cura-primary hover:text-white"
                                    data-oid="39whg.j"
                                >
                                    Load More Doctors
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="revenue" className="space-y-6" data-oid="ssmtd6s">
                    <div className="flex justify-between items-center" data-oid="54.80zn">
                        <div data-oid="r:k5n0v">
                            <h2 className="text-2xl font-bold text-gray-900" data-oid="o0io0ck">
                                Revenue & Commissions
                            </h2>
                            <p className="text-gray-600" data-oid="8e-vluf">
                                Track revenue generated from doctors and commission payments
                            </p>
                        </div>
                        <div className="flex space-x-3" data-oid="o-jk.lu">
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 border-cura-primary text-cura-primary hover:bg-cura-primary hover:text-white transition-all duration-200"
                                onClick={exportToCSV}
                                data-oid="_htuzmv"
                            >
                                <FileText className="h-4 w-4" data-oid="9jrw84y" />
                                <span data-oid="6q.hw7j">Export CSV</span>
                            </Button>
                            <Button
                                className="flex items-center space-x-2 bg-cura-secondary text-white hover:bg-cura-accent transition-all duration-200 shadow-md hover:shadow-lg"
                                onClick={exportToExcel}
                                data-oid="u9ior8a"
                            >
                                <Download className="h-4 w-4" data-oid="mimd.f_" />
                                <span data-oid="oo.m_jg">Export Excel</span>
                            </Button>
                        </div>
                    </div>

                    {/* Revenue Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-oid="tt9.p4-">
                        <Card
                            className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20 hover:shadow-lg transition-all duration-300"
                            data-oid="55ilh3i"
                        >
                            <CardContent className="p-6" data-oid="wjtwm1t">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="n7dejsr"
                                >
                                    <div data-oid="_-ddymt">
                                        <p
                                            className="text-cura-primary text-sm font-medium"
                                            data-oid="t1n081o"
                                        >
                                            Platform Revenue
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-secondary mb-1"
                                            data-oid="l7d_87s"
                                        >
                                            EGP{' '}
                                            {analytics.commissionBreakdown.platformRevenue.monthly.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-cura-accent" data-oid="te36n6i">
                                            {analytics.commissionBreakdown.platformRevenue.profitMargin.toFixed(
                                                1,
                                            )}
                                            % profit margin
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-primary/10 rounded-lg"
                                        data-oid="qdd_9d8"
                                    >
                                        <TrendingUp
                                            className="h-8 w-8 text-cura-primary"
                                            data-oid="iaey45c"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-cura-secondary/5 to-cura-secondary/10 border-cura-secondary/20 hover:shadow-lg transition-all duration-300"
                            data-oid="j-::u3."
                        >
                            <CardContent className="p-6" data-oid="d3-tf7l">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="-ot8rxs"
                                >
                                    <div data-oid=".071:_t">
                                        <p
                                            className="text-cura-secondary text-sm font-medium"
                                            data-oid="t8m0qj5"
                                        >
                                            Commission Paid
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-secondary mb-1"
                                            data-oid="7y:on2z"
                                        >
                                            EGP{' '}
                                            {analytics.commissionBreakdown.monthlyCommission.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-cura-accent" data-oid="04c_863">
                                            {analytics.commissionBreakdown.averageCommissionRate.toFixed(
                                                1,
                                            )}
                                            % avg rate
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-secondary/10 rounded-lg"
                                        data-oid="m4ekttf"
                                    >
                                        <CreditCard
                                            className="h-8 w-8 text-cura-secondary"
                                            data-oid="yejz5wk"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-cura-accent/5 to-cura-accent/10 border-cura-accent/20 hover:shadow-lg transition-all duration-300"
                            data-oid="pkd-6xm"
                        >
                            <CardContent className="p-6" data-oid=":ki08kj">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="pf9zn_c"
                                >
                                    <div data-oid="n3oghnt">
                                        <p
                                            className="text-cura-accent text-sm font-medium"
                                            data-oid="t76:_mx"
                                        >
                                            Total Revenue
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-secondary mb-1"
                                            data-oid="7yv1-g."
                                        >
                                            EGP{' '}
                                            {analytics.revenueFromDoctors.monthly.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-cura-accent" data-oid="3-l2c5-">
                                            Before commissions
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-accent/10 rounded-lg"
                                        data-oid="jyl:54f"
                                    >
                                        <DollarSign
                                            className="h-8 w-8 text-cura-accent"
                                            data-oid="kxjzj62"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Doctor Earnings Breakdown */}
                    <Card data-oid="dvw8s.z">
                        <CardHeader data-oid="_f8v9m0">
                            <CardTitle data-oid="upul:wj">Doctor Earnings Breakdown</CardTitle>
                            <CardDescription data-oid="hp7fo6a">
                                Individual doctor commission and revenue data
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="flnqec1">
                            <div className="space-y-4" data-oid="90ojjyx">
                                {analytics.commissionBreakdown.doctorEarnings.map(
                                    (doctor, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-cura-primary/5 to-cura-secondary/5 border border-cura-primary/10 rounded-lg hover:shadow-md transition-all duration-200"
                                            data-oid="f.anga-"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid=".ekdr94"
                                            >
                                                <div
                                                    className="w-10 h-10 bg-cura-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                                                    data-oid="9z:-04_"
                                                >
                                                    {index + 1}
                                                </div>
                                                <div data-oid="7.zwf9p">
                                                    <p
                                                        className="font-medium text-cura-secondary"
                                                        data-oid="rhjd9.m"
                                                    >
                                                        {doctor.doctorName}
                                                    </p>
                                                    <p
                                                        className="text-sm text-cura-accent"
                                                        data-oid="2hts97j"
                                                    >
                                                        {doctor.ordersGenerated} orders •{' '}
                                                        {doctor.commissionRate.toFixed(1)}% rate
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right" data-oid="j9xyvo0">
                                                <p
                                                    className="font-bold text-cura-primary"
                                                    data-oid="5z3byvq"
                                                >
                                                    EGP {doctor.monthlyEarned.toLocaleString()}
                                                </p>
                                                <p
                                                    className="text-sm text-cura-light"
                                                    data-oid="u3.gmqh"
                                                >
                                                    Monthly earnings
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6" data-oid="i_ms52x">
                    <div className="flex justify-between items-center" data-oid="ue9ag3v">
                        <div data-oid="pt2ce0y">
                            <h2 className="text-2xl font-bold text-gray-900" data-oid="o60juf4">
                                Performance Analytics
                            </h2>
                            <p className="text-gray-600" data-oid="o1au8ta">
                                Detailed performance metrics and user activity analysis
                            </p>
                        </div>
                        <div className="flex space-x-3" data-oid="e03r9c2">
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 border-cura-primary text-cura-primary hover:bg-cura-primary hover:text-white transition-all duration-200"
                                onClick={exportToCSV}
                                data-oid=".zyz7fb"
                            >
                                <FileText className="h-4 w-4" data-oid="bt6e9q_" />
                                <span data-oid="4cwmw21">Export CSV</span>
                            </Button>
                            <Button
                                className="flex items-center space-x-2 bg-cura-secondary text-white hover:bg-cura-accent transition-all duration-200 shadow-md hover:shadow-lg"
                                onClick={exportToExcel}
                                data-oid="9u54mvm"
                            >
                                <Download className="h-4 w-4" data-oid="j5hyv.y" />
                                <span data-oid="m-fgep.">Export Excel</span>
                            </Button>
                        </div>
                    </div>

                    {/* Performance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="1kn6cta">
                        <Card
                            className="bg-gradient-to-br from-cura-primary/5 to-cura-primary/10 border-cura-primary/20 hover:shadow-lg transition-all duration-300"
                            data-oid="xqxnnle"
                        >
                            <CardContent className="p-6" data-oid="rns9cr1">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="mbs_82j"
                                >
                                    <div data-oid="tp1s107">
                                        <p
                                            className="text-cura-primary text-sm font-medium"
                                            data-oid="psb_bbb"
                                        >
                                            User Activity
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-secondary mb-1"
                                            data-oid="32z28zf"
                                        >
                                            {analytics.userActivity.activeUsers.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-cura-accent" data-oid="245t_qt">
                                            {analytics.userActivity.dailyActiveUsers.toLocaleString()}{' '}
                                            daily active
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-primary/10 rounded-lg"
                                        data-oid="438fbn1"
                                    >
                                        <Activity
                                            className="h-8 w-8 text-cura-primary"
                                            data-oid="zr5x_zb"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="bg-gradient-to-br from-cura-secondary/5 to-cura-secondary/10 border-cura-secondary/20 hover:shadow-lg transition-all duration-300"
                            data-oid="mf8t.ve"
                        >
                            <CardContent className="p-6" data-oid="yh0mwg:">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="l-ivuxh"
                                >
                                    <div data-oid="o45-49l">
                                        <p
                                            className="text-cura-secondary text-sm font-medium"
                                            data-oid="xs9i_at"
                                        >
                                            Customer Retention
                                        </p>
                                        <p
                                            className="text-3xl font-bold text-cura-secondary mb-1"
                                            data-oid="x_4fb:u"
                                        >
                                            {analytics.customerRetention.retentionRate.toFixed(1)}%
                                        </p>
                                        <p className="text-xs text-cura-accent" data-oid="qtzvbas">
                                            {analytics.customerRetention.repeatOrderRate.toFixed(1)}
                                            % repeat orders
                                        </p>
                                    </div>
                                    <div
                                        className="p-3 bg-cura-secondary/10 rounded-lg"
                                        data-oid="2qmpre8"
                                    >
                                        <Repeat
                                            className="h-8 w-8 text-cura-secondary"
                                            data-oid="cajy_az"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User Activity by Doctor */}
                    <Card data-oid="f.kzvsg">
                        <CardHeader data-oid="_8vz.gd">
                            <CardTitle data-oid="lybs5ln">User Activity by Doctor</CardTitle>
                            <CardDescription data-oid=":xo6rzm">
                                Track active and offline users for each doctor
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="x_:q4sx">
                            <div className="overflow-x-auto" data-oid="m-okf2h">
                                <table
                                    className="min-w-full divide-y divide-gray-200"
                                    data-oid="p.jsnrr"
                                >
                                    <thead className="bg-gray-50" data-oid="w5ge6y.">
                                        <tr data-oid="7i8jp84">
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="y.mkj.n"
                                            >
                                                Doctor
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="sh6haol"
                                            >
                                                Total Users
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="pkf8h_o"
                                            >
                                                Active Users
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="w-1hx4i"
                                            >
                                                Offline Users
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="1g:kzfm"
                                            >
                                                Activity Rate
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="b3se72v"
                                            >
                                                Last Active
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="wngfqb9"
                                    >
                                        {analytics.userActivity.usersByDoctor.map(
                                            (doctor, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-cura-primary/5 transition-colors duration-200"
                                                    data-oid="k_t5hk."
                                                >
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="34mbmqi"
                                                    >
                                                        <div
                                                            className="flex items-center"
                                                            data-oid="6gbgy_t"
                                                        >
                                                            <div
                                                                className="w-10 h-10 bg-cura-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                                                                data-oid="a-n-83e"
                                                            >
                                                                {doctor.doctorName
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')}
                                                            </div>
                                                            <div
                                                                className="ml-4"
                                                                data-oid="9:h0g01"
                                                            >
                                                                <div
                                                                    className="text-sm font-medium text-cura-secondary"
                                                                    data-oid="rwnhm9o"
                                                                >
                                                                    {doctor.doctorName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-cura-secondary font-medium"
                                                        data-oid="uk.u5c:"
                                                    >
                                                        {doctor.totalUsers.toLocaleString()}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="4u9cptz"
                                                    >
                                                        <span
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cura-primary/10 text-cura-primary border border-cura-primary/20"
                                                            data-oid="eaxv4a2"
                                                        >
                                                            {doctor.activeUsers.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="qnuzs.:"
                                                    >
                                                        <span
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cura-light/20 text-cura-accent border border-cura-light/30"
                                                            data-oid="upmcb:q"
                                                        >
                                                            {doctor.offlineUsers.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-cura-secondary font-medium"
                                                        data-oid="fg0g.vm"
                                                    >
                                                        {(
                                                            (doctor.activeUsers /
                                                                doctor.totalUsers) *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-cura-accent"
                                                        data-oid="5va12f_"
                                                    >
                                                        {new Date(
                                                            doctor.lastActiveDate,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Doctor Retention Performance */}
                    <Card data-oid="866:j7c">
                        <CardHeader data-oid="j6p1_rl">
                            <CardTitle data-oid="4r:-eai">Doctor Retention Performance</CardTitle>
                            <CardDescription data-oid="k54k4sd">
                                Customer retention rates and repeat orders by doctor
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="ecmg0_p">
                            <div className="space-y-4" data-oid="36i6vhv">
                                {analytics.customerRetention.repeatOrdersByDoctor.map(
                                    (doctor:any, index:number) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-cura-secondary/5 to-cura-accent/5 border border-cura-secondary/10 rounded-lg hover:shadow-md transition-all duration-200"
                                            data-oid="jqs9gr8"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="ginqxcu"
                                            >
                                                <div
                                                    className="w-10 h-10 bg-cura-secondary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                                                    data-oid="jav9vij"
                                                >
                                                    {index + 1}
                                                </div>
                                                <div data-oid="rwu:bkv">
                                                    <p
                                                        className="font-medium text-cura-secondary"
                                                        data-oid="z7j4x8:"
                                                    >
                                                        {doctor.doctorName}
                                                    </p>
                                                    <p
                                                        className="text-sm text-cura-accent"
                                                        data-oid="78122z."
                                                    >
                                                        {doctor.totalCustomers} customers •{' '}
                                                        {doctor.repeatOrders} repeat orders
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right" data-oid="6qq24qh">
                                                <p
                                                    className="font-bold text-cura-primary"
                                                    data-oid="2dnltfx"
                                                >
                                                    {doctor.retentionRate.toFixed(1)}%
                                                </p>
                                                <p
                                                    className="text-sm text-cura-light"
                                                    data-oid="d:_km9u"
                                                >
                                                    Retention rate
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
