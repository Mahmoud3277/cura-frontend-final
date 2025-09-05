'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { masterProductDatabase } from '@/lib/database/masterProductDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductAnalysisWidget } from '@/components/dashboard/ProductAnalysisWidget';
import { filterProducts } from '@/lib/data/products';
export default function DatabaseInputDashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProductsLength: 0,
        todayAdded: 'NA',
        thisWeekAdded: 'Na',
        thisMonthAdded: 'NA',
        growthRate: 'NA',
        categoriesCount: 'NA',
        pendingReviews: 'NA',
    });

    // Simulated growth data for the last 7 days
    const [growthData] = useState([
        { day: 'Mon', products: 12 },
        { day: 'Tue', products: 8 },
        { day: 'Wed', products: 15 },
        { day: 'Thu', products: 22 },
        { day: 'Fri', products: 18 },
        { day: 'Sat', products: 6 },
        { day: 'Sun', products: 9 },
    ]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);

            // Calculate stats from master database
            const totalProducts = await filterProducts({});
            const categories = 'NA'

            // Simulated daily/weekly/monthly data
            const todayAdded = 'NA'
            const thisWeekAdded = 'NA'
            const thisMonthAdded = 'NA'
            const growthRate = 'NA'
            const pendingReviews = 'NA'
            const totalProductsLength = totalProducts.total
            setStats({
                totalProductsLength,
                todayAdded,
                thisWeekAdded,
                thisMonthAdded,
                growthRate,
                categoriesCount: categories,
                pendingReviews,
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid="tpgb53d">
                <div className="text-center" data-oid="46_5ced">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="i1fak2:"
                    ></div>
                    <p className="text-gray-600" data-oid="5yxkymy">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Stats Cards */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                data-oid="bwekpq_"
            >
                <Card data-oid="59xenx9">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="px7kklt"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="3m:w.bp">
                            Total Products
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                            data-oid="an6z_aw"
                        >
                            <svg
                                className="w-5 h-5 text-[#1F1F6F]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="dk8gl6b"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    data-oid="8yn.ild"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="syprbhb">
                        <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="8632o:o">
                            {stats.totalProductsLength}
                        </div>
                        <p className="text-xs text-gray-500" data-oid="0nla.az">
                            In database
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="wt9qfwl">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="ivvxg49"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="3ct.vln">
                            Today Added
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#14274E]/10 rounded-lg flex items-center justify-center"
                            data-oid="e97nm4:"
                        >
                            <svg
                                className="w-5 h-5 text-[#14274E]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="ujlau1x"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    data-oid="4x_z:gb"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="0336lmf">
                        <div className="text-2xl font-bold text-[#14274E]" data-oid="qes:a5f">
                            {stats.todayAdded}
                        </div>
                        <p className="text-xs text-gray-500" data-oid="z.u20es">
                            Products added today
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="9lnj4q8">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="drpx:mc"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="m4f068-">
                            This Week
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                            data-oid="5:8vss9"
                        >
                            <svg
                                className="w-5 h-5 text-[#1F1F6F]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="cyabo5k"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    data-oid="x7joqfv"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="dg.6sk5">
                        <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="vld9y28">
                            {stats.thisWeekAdded}
                        </div>
                        <div className="flex items-center space-x-1" data-oid="msdj-rh">
                            <span
                                className={`text-xs ${stats.growthRate >= 0 ? 'text-[#14274E]' : 'text-gray-500'}`}
                                data-oid="8p-jx1:"
                            >
                                {stats.growthRate >= 0 ? '↗' : '↘'}{' '}
                                {Math.abs(stats.growthRate).toFixed(1)}%
                            </span>
                            <span className="text-xs text-gray-500" data-oid="s9-:epi">
                                vs last week
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="mh7udcy">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="0.tgge4"
                    >
                        <CardTitle className="text-sm font-medium text-gray-700" data-oid="hgx82d3">
                            Categories
                        </CardTitle>
                        <div
                            className="w-8 h-8 bg-[#14274E]/10 rounded-lg flex items-center justify-center"
                            data-oid="gs9zrpi"
                        >
                            <svg
                                className="w-5 h-5 text-[#14274E]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="1f6ixr5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    data-oid="b5be35q"
                                />
                            </svg>
                        </div>
                    </CardHeader>
                    <CardContent data-oid="8lc2if7">
                        <div className="text-2xl font-bold text-[#14274E]" data-oid="rkzw2kc">
                            {stats.categoriesCount}
                        </div>
                        <p className="text-xs text-gray-500" data-oid="ubsc2.e">
                            Product categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6" data-oid=":wzv_qf">
                <TabsList className="grid w-full grid-cols-3" data-oid="eeaxjz8">
                    <TabsTrigger value="overview" data-oid="46g9kwk">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="analysis" data-oid="x-yry3_">
                        Data Analysis
                    </TabsTrigger>
                    <TabsTrigger value="growth" data-oid="vu7xhlq">
                        Growth Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6" data-oid="upy9n14">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="sj.le0m">
                        {/* Monthly Progress */}
                        <Card data-oid="b42mwxs">
                            <CardHeader data-oid="ppwus.0">
                                <CardTitle className="text-gray-800" data-oid="3aha6e5">
                                    Monthly Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4" data-oid="ms.s92.">
                                <div data-oid="ba_4r1c">
                                    <div
                                        className="flex justify-between text-sm mb-2"
                                        data-oid=":9rjq:a"
                                    >
                                        <span className="text-gray-700" data-oid="ng-s86c">
                                            Products Added
                                        </span>
                                        <span
                                            className="text-[#1F1F6F] font-medium"
                                            data-oid="mzen_ip"
                                        >
                                            {stats.thisMonthAdded} / 500
                                        </span>
                                    </div>
                                    <Progress
                                        value={(stats.thisMonthAdded / 500) * 100}
                                        className="h-2"
                                        data-oid=":c6-s5k"
                                    />
                                </div>
                                <div data-oid="1ron-.t">
                                    <div
                                        className="flex justify-between text-sm mb-2"
                                        data-oid="z4xs061"
                                    >
                                        <span className="text-gray-700" data-oid="3nmq86z">
                                            Reviews Completed
                                        </span>
                                        <span
                                            className="text-[#14274E] font-medium"
                                            data-oid="v6_dq6w"
                                        >
                                            {stats.thisMonthAdded - stats.pendingReviews} /{' '}
                                            {stats.thisMonthAdded}
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            ((stats.thisMonthAdded - stats.pendingReviews) /
                                                stats.thisMonthAdded) *
                                            100
                                        }
                                        className="h-2"
                                        data-oid="yawr446"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card data-oid="jhmzncn">
                            <CardHeader data-oid="4r0m1m2">
                                <CardTitle className="text-gray-800" data-oid="tkvx106">
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent data-oid="p20clxz">
                                <div className="space-y-4" data-oid="hnuty72">
                                    <div
                                        className="flex items-center space-x-3 p-3 bg-[#1F1F6F]/5 rounded-lg border border-[#1F1F6F]/10"
                                        data-oid="vk_8isc"
                                    >
                                        <div
                                            className="w-8 h-8 bg-[#1F1F6F]/10 rounded-full flex items-center justify-center"
                                            data-oid="b5fx9_5"
                                        >
                                            <svg
                                                className="w-4 h-4 text-[#1F1F6F]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="9ejy9gq"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                    data-oid="vymz3n:"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1" data-oid="nsp7.wi">
                                            <p
                                                className="font-medium text-gray-900"
                                                data-oid="nf0yy.r"
                                            >
                                                Added 12 new medicines
                                            </p>
                                            <p className="text-sm text-gray-500" data-oid="_3h-9e9">
                                                2 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center space-x-3 p-3 bg-[#14274E]/5 rounded-lg border border-[#14274E]/10"
                                        data-oid="l1:xemq"
                                    >
                                        <div
                                            className="w-8 h-8 bg-[#14274E]/10 rounded-full flex items-center justify-center"
                                            data-oid="18pvv4r"
                                        >
                                            <svg
                                                className="w-4 h-4 text-[#14274E]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="tdohfd6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    data-oid="m0s4q7d"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1" data-oid="05vwgqh">
                                            <p
                                                className="font-medium text-gray-900"
                                                data-oid="3awdeey"
                                            >
                                                Bulk imported 50 products
                                            </p>
                                            <p className="text-sm text-gray-500" data-oid="biwf0rq">
                                                5 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        data-oid="kgy_7gx"
                                    >
                                        <div
                                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                                            data-oid=".e1wjk-"
                                        >
                                            <svg
                                                className="w-4 h-4 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="37xh6v1"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    data-oid="9pq2a:x"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1" data-oid="4.myodu">
                                            <p
                                                className="font-medium text-gray-900"
                                                data-oid="w.3h9tc"
                                            >
                                                Reviewed medical devices
                                            </p>
                                            <p className="text-sm text-gray-500" data-oid="6jwtu3p">
                                                Yesterday
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6" data-oid="qn::h6n">
                    <ProductAnalysisWidget data-oid="cskuosr" />
                </TabsContent>

                <TabsContent value="growth" className="space-y-6" data-oid="p6dgny.">
                    <Card data-oid="w2pkew8">
                        <CardHeader data-oid="5mlvbiy">
                            <CardTitle className="text-gray-800" data-oid="atyfb3z">
                                Weekly Growth Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent data-oid="0lw_ptj">
                            <div className="space-y-4" data-oid="nh0l01j">
                                {growthData.map((day, index) => (
                                    <div
                                        key={day.day}
                                        className="flex items-center space-x-4"
                                        data-oid="e1uk0qw"
                                    >
                                        <div
                                            className="w-12 text-sm font-medium text-gray-700"
                                            data-oid="c0bf:gk"
                                        >
                                            {day.day}
                                        </div>
                                        <div className="flex-1" data-oid="lqq4u1c">
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="xf217kx"
                                            >
                                                <div
                                                    className="flex-1 bg-gray-200 rounded-full h-2"
                                                    data-oid="57aot_6"
                                                >
                                                    <div
                                                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${(day.products / 25) * 100}%`,
                                                        }}
                                                        data-oid="nl.lyvl"
                                                    ></div>
                                                </div>
                                                <span
                                                    className="text-sm font-medium text-[#1F1F6F] w-8"
                                                    data-oid=":0mfmfg"
                                                >
                                                    {day.products}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                className="mt-6 p-4 bg-[#1F1F6F]/5 rounded-lg border border-[#1F1F6F]/10"
                                data-oid="3k4dbi3"
                            >
                                <h4 className="font-medium text-[#1F1F6F] mb-2" data-oid="i_aqcsp">
                                    Growth Insights
                                </h4>
                                <ul className="text-sm text-gray-700 space-y-1" data-oid="x:i.sfz">
                                    <li data-oid="a-_g60e">
                                        • Peak productivity on Thursday with 22 products added
                                    </li>
                                    <li data-oid="ev6iq6y">
                                        • Weekend activity remains steady with 15 total products
                                    </li>
                                    <li data-oid="j2pt8zi">
                                        • {stats.growthRate >= 0 ? 'Positive' : 'Negative'} growth
                                        trend this week
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}
