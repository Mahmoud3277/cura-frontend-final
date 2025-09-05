'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { reportExportService, ExportData } from '@/lib/utils/reportExport';
import {
    Clock,
    Calendar,
    BarChart3,
    TrendingUp,
    FileText,
    Download,
    ShoppingBag,
} from 'lucide-react';

interface OrderTimingData {
    peakHour: {
        time: string;
        orderCount: number;
        description: string;
    };
    peakDay: {
        day: string;
        orderCount: number;
        description: string;
    };
    peakMonth: {
        month: string;
        orderCount: number;
        description: string;
    };
    hourlyDistribution: {
        hour: number;
        orders: number;
    }[];
    dailyDistribution: {
        day: string;
        orders: number;
    }[];
    monthlyTrends: {
        month: string;
        orders: number;
        revenue: number;
    }[];
}

interface OrderTimingAnalyticsProps {
    data?: OrderTimingData;
    onExportCSV: () => void;
    onExportExcel: () => void;
}

// Mock data for demonstration
const mockData: OrderTimingData = {
    peakHour: {
        time: '18:00',
        orderCount: 240,
        description: 'Most orders placed',
    },
    peakDay: {
        day: 'Saturday',
        orderCount: 2200,
        description: 'Highest order volume',
    },
    peakMonth: {
        month: 'June',
        orderCount: 18500,
        description: 'Best performing month',
    },
    hourlyDistribution: [
        { hour: 8, orders: 45 },
        { hour: 9, orders: 120 },
        { hour: 10, orders: 150 },
        { hour: 11, orders: 90 },
        { hour: 12, orders: 65 },
        { hour: 13, orders: 125 },
        { hour: 14, orders: 180 },
        { hour: 15, orders: 200 },
        { hour: 16, orders: 220 },
        { hour: 17, orders: 240 },
        { hour: 18, orders: 180 },
        { hour: 19, orders: 160 },
        { hour: 20, orders: 140 },
        { hour: 21, orders: 95 },
        { hour: 22, orders: 45 },
    ],

    dailyDistribution: [
        { day: 'Monday', orders: 1200 },
        { day: 'Tuesday', orders: 1450 },
        { day: 'Wednesday', orders: 1350 },
        { day: 'Thursday', orders: 1600 },
        { day: 'Friday', orders: 1850 },
        { day: 'Saturday', orders: 2200 },
        { day: 'Sunday', orders: 1900 },
    ],

    monthlyTrends: [
        { month: 'Jan', orders: 15200, revenue: 456000 },
        { month: 'Feb', orders: 14800, revenue: 444000 },
        { month: 'Mar', orders: 16500, revenue: 495000 },
        { month: 'Apr', orders: 17200, revenue: 516000 },
        { month: 'May', orders: 18000, revenue: 540000 },
        { month: 'Jun', orders: 18500, revenue: 555000 },
    ],
};

export function OrderTimingAnalytics({
    data = mockData,
    onExportCSV,
    onExportExcel,
}: OrderTimingAnalyticsProps) {
    const maxHourlyOrders = Math.max(...data.hourlyDistribution.map((h) => h.orders));
    const maxDailyOrders = Math.max(...data.dailyDistribution.map((d) => d.orders));

    const exportAllData = async (format: 'csv' | 'excel') => {
        // Calculate totals
        const totalOrders = data.monthlyTrends.reduce((sum, month) => sum + month.orders, 0);
        const totalRevenue = data.monthlyTrends.reduce((sum, month) => sum + month.revenue, 0);
        const avgMonthlyOrders = Math.round(totalOrders / data.monthlyTrends.length);
        const avgMonthlyRevenue = Math.round(totalRevenue / data.monthlyTrends.length);

        // Prepare comprehensive export data
        const exportData: ExportData = {
            title: 'CURA Order Timing Analytics Report',
            subtitle: 'CURA Customer Management - Understanding when customers place their orders',
            generatedAt: new Date().toISOString(),
            generatedBy: 'CURA Administrative Control Panel',
            data: {
                summary: {
                    peakHour: `${data.peakHour.time} (${data.peakHour.orderCount} orders)`,
                    peakDay: `${data.peakDay.day} (${data.peakDay.orderCount.toLocaleString()} orders)`,
                    peakMonth: `${data.peakMonth.month} (${data.peakMonth.orderCount.toLocaleString()} orders)`,
                    totalOrders: totalOrders.toLocaleString(),
                    totalRevenue: `EGP ${totalRevenue.toLocaleString()}`,
                    averageMonthlyOrders: avgMonthlyOrders.toLocaleString(),
                    averageMonthlyRevenue: `EGP ${avgMonthlyRevenue.toLocaleString()}`,
                },
                hourlyDistribution: data.hourlyDistribution.map((item) => ({
                    hour: `${item.hour}:00`,
                    orders: item.orders,
                    percentage: `${((item.orders / data.hourlyDistribution.reduce((sum, h) => sum + h.orders, 0)) * 100).toFixed(1)}%`,
                })),
                dailyDistribution: data.dailyDistribution.map((item) => ({
                    day: item.day,
                    orders: item.orders,
                    percentage: `${((item.orders / data.dailyDistribution.reduce((sum, d) => sum + d.orders, 0)) * 100).toFixed(1)}%`,
                })),
                monthlyTrends: data.monthlyTrends.map((item) => ({
                    month: item.month,
                    orders: item.orders,
                    revenue: `EGP ${item.revenue.toLocaleString()}`,
                    averageOrderValue: `EGP ${Math.round(item.revenue / item.orders).toLocaleString()}`,
                })),
            },
            metadata: {
                reportType: 'Order Timing Analytics',
                dateRange: 'Last 6 months',
                totalDataPoints:
                    data.hourlyDistribution.length +
                    data.dailyDistribution.length +
                    data.monthlyTrends.length,
                peakHourOrders: data.peakHour.orderCount,
                peakDayOrders: data.peakDay.orderCount,
                peakMonthOrders: data.peakMonth.orderCount,
            },
        };

        try {
            await reportExportService.exportReport(exportData, {
                format: format,
                filename: `cura-order-timing-analytics-${new Date().toISOString().split('T')[0]}`,
                includeMetadata: true,
                includeCharts: false,
            });

            // Also call the original handlers for any additional processing
            if (format === 'csv') {
                onExportCSV();
            } else {
                onExportExcel();
            }
        } catch (error) {
            console.error('Export failed:', error);
            // Fallback to original export methods
            if (format === 'csv') {
                onExportCSV();
            } else {
                onExportExcel();
            }
        }
    };

    return (
        <div className="space-y-6" data-oid="97m6_ou">
            {/* Header */}
            <div className="flex items-center justify-between" data-oid="07p30.r">
                <div data-oid="7dk83_y">
                    <div className="flex items-center gap-2 mb-1" data-oid="mqz78..">
                        <div
                            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                            data-oid=":5ou3i."
                        >
                            <span className="text-white font-bold text-sm" data-oid="_h.49_i">
                                C
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900" data-oid="0jilwtc">
                            <span className="text-blue-600 font-bold" data-oid="7x2do:t">
                                CURA
                            </span>{' '}
                            Order Timing Analytics
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500" data-oid="xri84fh">
                        CURA Customer Management - Understanding when customers place their orders
                    </p>
                </div>
                <div className="flex gap-2" data-oid="w-eydht">
                    <Button
                        onClick={() => exportAllData('csv')}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        data-oid="xze4v08"
                    >
                        <FileText className="h-4 w-4" data-oid="z3:qv:5" />
                        Export CSV
                    </Button>
                    <Button
                        onClick={() => exportAllData('excel')}
                        size="sm"
                        className="flex items-center gap-2"
                        data-oid="wiwdo6x"
                    >
                        <Download className="h-4 w-4" data-oid="eouj8ig" />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Peak Times Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-oid="_mijlwv">
                <Card className="border-l-4 border-l-purple-500" data-oid="u83rsa-">
                    <CardHeader className="pb-3" data-oid="_pb:td4">
                        <div className="flex items-center justify-between" data-oid="xu0w2ir">
                            <div className="flex items-center gap-2" data-oid="l0s.kxu">
                                <Clock className="h-5 w-5 text-purple-600" data-oid="-q298:i" />
                                <span
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="i211.fb"
                                >
                                    Peak Hour
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="n5.a81l">
                        <div className="text-3xl font-bold text-gray-900" data-oid="dmv0jz:">
                            {data.peakHour.time}
                        </div>
                        <p className="text-sm text-gray-600 mt-1" data-oid="bxldpf_">
                            {data.peakHour.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2" data-oid=".scc39x">
                            <ShoppingBag className="h-4 w-4 text-gray-400" data-oid="it:m71k" />
                            <span className="text-sm font-semibold" data-oid="yejeon5">
                                {data.peakHour.orderCount} orders
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500" data-oid="109p9p5">
                    <CardHeader className="pb-3" data-oid="tf7uqo2">
                        <div className="flex items-center justify-between" data-oid="ep5ul13">
                            <div className="flex items-center gap-2" data-oid="b89t-gk">
                                <Calendar className="h-5 w-5 text-green-600" data-oid="b:xkxvk" />
                                <span
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="z58ikge"
                                >
                                    Peak Day
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="ppxq3vj">
                        <div className="text-3xl font-bold text-gray-900" data-oid="ks9ue3d">
                            {data.peakDay.day}
                        </div>
                        <p className="text-sm text-gray-600 mt-1" data-oid="wa5ty43">
                            {data.peakDay.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2" data-oid="7tzpxb3">
                            <ShoppingBag className="h-4 w-4 text-gray-400" data-oid="13telvb" />
                            <span className="text-sm font-semibold" data-oid="0e1a4eh">
                                {data.peakDay.orderCount.toLocaleString()} orders
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500" data-oid="7hh.ncj">
                    <CardHeader className="pb-3" data-oid="yw7h6ut">
                        <div className="flex items-center justify-between" data-oid="oulaeup">
                            <div className="flex items-center gap-2" data-oid="t.kw.-o">
                                <TrendingUp
                                    className="h-5 w-5 text-orange-600"
                                    data-oid="f2lobgh"
                                />

                                <span
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="zgwtpc8"
                                >
                                    Peak Month
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="cxbg5.n">
                        <div className="text-3xl font-bold text-gray-900" data-oid="9nw.914">
                            {data.peakMonth.month}
                        </div>
                        <p className="text-sm text-gray-600 mt-1" data-oid="d3nu1hu">
                            {data.peakMonth.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2" data-oid="wf9xvsu">
                            <ShoppingBag className="h-4 w-4 text-gray-400" data-oid="cr:b:4w" />
                            <span className="text-sm font-semibold" data-oid="6rq68wf">
                                {data.peakMonth.orderCount.toLocaleString()} orders
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="u87wpp5">
                {/* Hourly Distribution */}
                <Card data-oid="w:iziue">
                    <CardHeader data-oid="1mv7b3f">
                        <CardTitle className="flex items-center gap-2" data-oid="_g-w5-i">
                            <BarChart3 className="h-5 w-5" data-oid="tx.zj6j" />
                            Hourly Order Distribution
                        </CardTitle>
                        <CardDescription data-oid="x993k_y">
                            Orders placed throughout the day
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="b0gesm-">
                        <div className="space-y-3" data-oid="pcj:78i">
                            {data.hourlyDistribution.map((item) => (
                                <div
                                    key={item.hour}
                                    className="flex items-center gap-3"
                                    data-oid="oi9w7:q"
                                >
                                    <div
                                        className="w-8 text-sm text-gray-600 font-medium"
                                        data-oid="8tfahly"
                                    >
                                        {item.hour}:00
                                    </div>
                                    <div
                                        className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                        data-oid="5nwk146"
                                    >
                                        <div
                                            className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                                            style={{
                                                width: `${(item.orders / maxHourlyOrders) * 100}%`,
                                            }}
                                            data-oid="qw3zjwm"
                                        >
                                            <span
                                                className="text-white text-xs font-medium"
                                                data-oid="akztyyz"
                                            >
                                                {item.orders}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Daily Distribution */}
                <Card data-oid="m47m3_u">
                    <CardHeader data-oid="orwuqka">
                        <CardTitle className="flex items-center gap-2" data-oid="_ot.0md">
                            <BarChart3 className="h-5 w-5" data-oid=".0o.x95" />
                            Daily Order Distribution
                        </CardTitle>
                        <CardDescription data-oid=".xxomux">
                            Orders placed throughout the week
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="yna69wu">
                        <div className="space-y-3" data-oid="sreoomi">
                            {data.dailyDistribution.map((item) => (
                                <div
                                    key={item.day}
                                    className="flex items-center gap-3"
                                    data-oid="j7jnmw5"
                                >
                                    <div
                                        className="w-20 text-sm text-gray-600 font-medium"
                                        data-oid="algy0u1"
                                    >
                                        {item.day}
                                    </div>
                                    <div
                                        className="flex-1 bg-gray-200 rounded-full h-6 relative"
                                        data-oid="hw9h_yi"
                                    >
                                        <div
                                            className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                                            style={{
                                                width: `${(item.orders / maxDailyOrders) * 100}%`,
                                            }}
                                            data-oid="s2wrafg"
                                        >
                                            <span
                                                className="text-white text-xs font-medium"
                                                data-oid="i2303r9"
                                            >
                                                {item.orders.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Trends */}
            <Card data-oid="ilust1k">
                <CardHeader data-oid="b03fxy_">
                    <CardTitle className="flex items-center gap-2" data-oid=".jiw4y3">
                        <TrendingUp className="h-5 w-5" data-oid="xqw89cy" />
                        Monthly Order Trends
                    </CardTitle>
                    <CardDescription data-oid="3e.l2lg">
                        Order volume across different months
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="2pibl15">
                    <div className="space-y-4" data-oid="_j-yat2">
                        {data.monthlyTrends.map((item, index) => (
                            <div
                                key={item.month}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                data-oid="foq7.cd"
                            >
                                <div className="flex items-center gap-4" data-oid="ori306w">
                                    <div
                                        className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold"
                                        data-oid="eb-6ij5"
                                    >
                                        {index + 1}
                                    </div>
                                    <div data-oid="ud.fk_q">
                                        <div
                                            className="font-semibold text-gray-900"
                                            data-oid="r.oh32w"
                                        >
                                            {item.month}
                                        </div>
                                        <div className="text-sm text-gray-600" data-oid="37cjuai">
                                            {item.orders.toLocaleString()} orders
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right" data-oid="ofz:ah:">
                                    <div className="font-semibold text-blue-600" data-oid="nj:7sbk">
                                        EGP {item.revenue.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500" data-oid="8juvdp.">
                                        Revenue
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
