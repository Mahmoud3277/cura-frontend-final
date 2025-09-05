'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    mockPrescriptionWorkflows,
    PrescriptionWorkflow,
    PrescriptionStatus,
} from '@/lib/data/prescriptionWorkflow';

import {
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Activity,
    User,
    Pill,
    FileText,
    Timer,
    BarChart3,
    PieChart,
    Calendar,
} from 'lucide-react';

interface ReaderStats {
    totalProcessed: number;
    approved: number;
    rejected: number;
    suspended: number;
    averageProcessingTime: number;
    currentlyProcessing: number;
    todayProcessed: number;
    weeklyProcessed: number;
    approvalRate: number;
    rejectionRate: number;
    suspensionRate: number;
}

interface ReaderActivity {
    id: string;
    prescriptionId: string;
    action: string;
    timestamp: Date;
    status: PrescriptionStatus;
    processingTime?: number;
}

export function PrescriptionReaderAnalytics() {
    const [stats, setStats] = useState<ReaderStats>({
        totalProcessed: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
        averageProcessingTime: 0,
        currentlyProcessing: 0,
        todayProcessed: 0,
        weeklyProcessed: 0,
        approvalRate: 0,
        rejectionRate: 0,
        suspensionRate: 0,
    });

    const [recentActivity, setRecentActivity] = useState<ReaderActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        calculateStats();
        generateRecentActivity();
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateStats = () => {
        // Filter prescriptions that have been processed by prescription readers
        const processedPrescriptions = mockPrescriptionWorkflows.filter(
            (p) =>
                p.assignedReaderId &&
                ['approved', 'rejected', 'suspended'].includes(p.currentStatus),
        );

        const currentlyProcessing = mockPrescriptionWorkflows.filter(
            (p) => p.assignedReaderId && p.currentStatus === 'reviewing',
        ).length;

        // Calculate today's processed prescriptions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayProcessed = processedPrescriptions.filter(
            (p) => new Date(p.updatedAt) >= today,
        ).length;

        // Calculate this week's processed prescriptions
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weeklyProcessed = processedPrescriptions.filter(
            (p) => new Date(p.updatedAt) >= weekStart,
        ).length;

        const approved = processedPrescriptions.filter(
            (p) => p.currentStatus === 'approved',
        ).length;
        const rejected = processedPrescriptions.filter(
            (p) => p.currentStatus === 'rejected',
        ).length;
        const suspended = processedPrescriptions.filter(
            (p) => p.currentStatus === 'suspended',
        ).length;

        const total = processedPrescriptions.length;
        const approvalRate = total > 0 ? (approved / total) * 100 : 0;
        const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;
        const suspensionRate = total > 0 ? (suspended / total) * 100 : 0;

        // Calculate average processing time (mock calculation)
        const averageProcessingTime = 2.5; // hours

        setStats({
            totalProcessed: total,
            approved,
            rejected,
            suspended,
            averageProcessingTime,
            currentlyProcessing,
            todayProcessed,
            weeklyProcessed,
            approvalRate,
            rejectionRate,
            suspensionRate,
        });
    };

    const generateRecentActivity = () => {
        // Generate mock recent activity based on prescription history
        const activities: ReaderActivity[] = [];

        mockPrescriptionWorkflows
            .filter((p) => p.assignedReaderId)
            .slice(0, 10)
            .forEach((prescription) => {
                const latestStatus =
                    prescription.statusHistory[prescription.statusHistory.length - 1];
                if (
                    latestStatus &&
                    ['approved', 'rejected', 'suspended', 'reviewing'].includes(latestStatus.status)
                ) {
                    activities.push({
                        id: `activity-${prescription.id}`,
                        prescriptionId: prescription.id,
                        action: getActionText(latestStatus.status),
                        timestamp: latestStatus.timestamp,
                        status: latestStatus.status,
                        processingTime: Math.random() * 4 + 0.5, // Random processing time between 0.5-4.5 hours
                    });
                }
            });

        // Sort by timestamp (newest first)
        activities.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        setRecentActivity(activities);
    };

    const getActionText = (status: PrescriptionStatus): string => {
        switch (status) {
            case 'approved':
                return 'Approved prescription';
            case 'rejected':
                return 'Rejected prescription';
            case 'suspended':
                return 'Suspended prescription';
            case 'reviewing':
                return 'Started reviewing';
            default:
                return 'Updated prescription';
        }
    };

    const getStatusIcon = (status: PrescriptionStatus) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-600" data-oid="ji.6gi." />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-600" data-oid="uxbt298" />;
            case 'suspended':
                return <AlertCircle className="w-4 h-4 text-orange-600" data-oid="e2nhaaa" />;
            case 'reviewing':
                return <Eye className="w-4 h-4 text-blue-600" data-oid="ewx0rp2" />;
            default:
                return <FileText className="w-4 h-4 text-gray-600" data-oid="u-zux9p" />;
        }
    };

    const getStatusColor = (status: PrescriptionStatus) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'suspended':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'reviewing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatTime = (hours: number): string => {
        if (hours < 1) {
            return `${Math.round(hours * 60)}m`;
        }
        return `${hours.toFixed(1)}h`;
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8" data-oid="ef__nlq">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                    data-oid="dhh630w"
                ></div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="lw3gxz9">
            {/* Header */}
            <div className="flex items-center justify-between" data-oid="ysk0:gd">
                <div data-oid="58q93y_">
                    <h2 className="text-2xl font-bold text-gray-900" data-oid="alja4fx">
                        Prescription Reader Analytics
                    </h2>
                    <p className="text-gray-600" data-oid="jb9kps-">
                        Monitor prescription reader performance and workflow
                    </p>
                </div>
                <div className="flex items-center space-x-2" data-oid="-j3__vy">
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                        data-oid="jv-cr_h"
                    >
                        <Activity className="w-3 h-3 mr-1" data-oid="wb:w8pe" />
                        Live Data
                    </Badge>
                </div>
            </div>

            {/* Key Metrics */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="1eo.r4b"
            >
                <Card data-oid="w4dbsft">
                    <CardContent className="p-4" data-oid="5e55:5:">
                        <div className="flex items-center justify-between" data-oid="kaej_dk">
                            <div data-oid=".-qtko.">
                                <p className="text-sm font-medium text-gray-600" data-oid=".lq28sj">
                                    Total Processed
                                </p>
                                <p className="text-2xl font-bold text-gray-900" data-oid="trhwmu_">
                                    {stats.totalProcessed}
                                </p>
                                <p className="text-xs text-gray-500" data-oid="278i8:n">
                                    All time
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                                data-oid="faa.1or"
                            >
                                <FileText className="w-5 h-5 text-blue-600" data-oid="dfieo-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="a6npmua">
                    <CardContent className="p-4" data-oid="ftdu-fx">
                        <div className="flex items-center justify-between" data-oid="lade-_3">
                            <div data-oid="e678a55">
                                <p className="text-sm font-medium text-gray-600" data-oid="hrr78d7">
                                    Currently Processing
                                </p>
                                <p
                                    className="text-2xl font-bold text-yellow-600"
                                    data-oid="05hxhav"
                                >
                                    {stats.currentlyProcessing}
                                </p>
                                <p className="text-xs text-gray-500" data-oid="b1ky6q-">
                                    Active now
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                                data-oid="4omp.nm"
                            >
                                <Eye className="w-5 h-5 text-yellow-600" data-oid="ly:74pq" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="r:ykb19">
                    <CardContent className="p-4" data-oid="06vhcj8">
                        <div className="flex items-center justify-between" data-oid="7gevcpb">
                            <div data-oid="o135gjc">
                                <p className="text-sm font-medium text-gray-600" data-oid="8l9z9:4">
                                    Avg Processing Time
                                </p>
                                <p
                                    className="text-2xl font-bold text-purple-600"
                                    data-oid=".lu:m6h"
                                >
                                    {formatTime(stats.averageProcessingTime)}
                                </p>
                                <p className="text-xs text-gray-500" data-oid="mizuu6t">
                                    Per prescription
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                                data-oid="y:1mpyy"
                            >
                                <Timer className="w-5 h-5 text-purple-600" data-oid="ha8z-d_" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="fl0h227">
                    <CardContent className="p-4" data-oid="zy4dyvv">
                        <div className="flex items-center justify-between" data-oid="uv7bq8j">
                            <div data-oid=":_avty9">
                                <p className="text-sm font-medium text-gray-600" data-oid="dbcmzg4">
                                    Approval Rate
                                </p>
                                <p className="text-2xl font-bold text-green-600" data-oid="l2s.yuf">
                                    {stats.approvalRate.toFixed(1)}%
                                </p>
                                <p className="text-xs text-gray-500" data-oid="r-b8sil">
                                    Success rate
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                                data-oid="zgrvdx2"
                            >
                                <CheckCircle
                                    className="w-5 h-5 text-green-600"
                                    data-oid="mwtbkre"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="4g9bau8">
                {/* Status Distribution */}
                <Card data-oid=".rsa8a2">
                    <CardHeader data-oid=".1h4co:">
                        <CardTitle className="flex items-center space-x-2" data-oid="ypfj6y5">
                            <PieChart className="w-5 h-5" data-oid="axh7s:c" />
                            <span data-oid="xcx8qkl">Status Distribution</span>
                        </CardTitle>
                        <CardDescription data-oid="ftgbdti">
                            Breakdown of prescription processing outcomes
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="lm1m3ok">
                        <div className="space-y-4" data-oid="_paegjt">
                            <div className="flex items-center justify-between" data-oid="oztz:2q">
                                <div className="flex items-center space-x-3" data-oid="161cn1n">
                                    <div
                                        className="w-3 h-3 bg-green-500 rounded-full"
                                        data-oid="26l53du"
                                    ></div>
                                    <span className="text-sm font-medium" data-oid="xvhgt5j">
                                        Approved
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2" data-oid="ne3v5fg">
                                    <span className="text-sm text-gray-600" data-oid="m5-0q7k">
                                        {stats.approved}
                                    </span>
                                    <span className="text-sm font-medium" data-oid="i70tj0s">
                                        {stats.approvalRate.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <Progress
                                value={stats.approvalRate}
                                className="h-2"
                                data-oid="l1msnf8"
                            />

                            <div className="flex items-center justify-between" data-oid="m1:sqpy">
                                <div className="flex items-center space-x-3" data-oid="v4992gz">
                                    <div
                                        className="w-3 h-3 bg-red-500 rounded-full"
                                        data-oid="2t55p_y"
                                    ></div>
                                    <span className="text-sm font-medium" data-oid="2hu006i">
                                        Rejected
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2" data-oid="2q_55hf">
                                    <span className="text-sm text-gray-600" data-oid="5nh7pgk">
                                        {stats.rejected}
                                    </span>
                                    <span className="text-sm font-medium" data-oid="l-ebu.f">
                                        {stats.rejectionRate.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <Progress
                                value={stats.rejectionRate}
                                className="h-2"
                                data-oid="kvcz11v"
                            />

                            <div className="flex items-center justify-between" data-oid="2su0_hw">
                                <div className="flex items-center space-x-3" data-oid="xwe9ldj">
                                    <div
                                        className="w-3 h-3 bg-orange-500 rounded-full"
                                        data-oid="m3jvlq5"
                                    ></div>
                                    <span className="text-sm font-medium" data-oid="735eg8j">
                                        Suspended
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2" data-oid="x20oo6g">
                                    <span className="text-sm text-gray-600" data-oid="rb-_l5w">
                                        {stats.suspended}
                                    </span>
                                    <span className="text-sm font-medium" data-oid="h_0:3k:">
                                        {stats.suspensionRate.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <Progress
                                value={stats.suspensionRate}
                                className="h-2"
                                data-oid="4q-g2ul"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Timeline */}
                <Card data-oid="zmcjed:">
                    <CardHeader data-oid="jc6f4np">
                        <CardTitle className="flex items-center space-x-2" data-oid="0aomumk">
                            <BarChart3 className="w-5 h-5" data-oid="kddp391" />
                            <span data-oid="mh2vfi-">Processing Activity</span>
                        </CardTitle>
                        <CardDescription data-oid="94gi12b">
                            Recent prescription reader activity
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="181j0xr">
                        <div className="space-y-3" data-oid="vj8o7:x">
                            <div className="grid grid-cols-2 gap-4 mb-4" data-oid="dlyr0-z">
                                <div
                                    className="text-center p-3 bg-blue-50 rounded-lg"
                                    data-oid="ufh5y-o"
                                >
                                    <p
                                        className="text-2xl font-bold text-blue-600"
                                        data-oid="c43-74-"
                                    >
                                        {stats.todayProcessed}
                                    </p>
                                    <p className="text-xs text-blue-700" data-oid="syn.1ak">
                                        Today
                                    </p>
                                </div>
                                <div
                                    className="text-center p-3 bg-purple-50 rounded-lg"
                                    data-oid=".l_95p_"
                                >
                                    <p
                                        className="text-2xl font-bold text-purple-600"
                                        data-oid="v.witoc"
                                    >
                                        {stats.weeklyProcessed}
                                    </p>
                                    <p className="text-xs text-purple-700" data-oid="yq:wbat">
                                        This Week
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto" data-oid="50cj9cr">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                                        data-oid="icoqo6f"
                                    >
                                        <div className="flex-shrink-0" data-oid="4vb-0x9">
                                            {getStatusIcon(activity.status)}
                                        </div>
                                        <div className="flex-1 min-w-0" data-oid="_tuvoxw">
                                            <p
                                                className="text-sm font-medium text-gray-900 truncate"
                                                data-oid="sv776eb"
                                            >
                                                {activity.action}
                                            </p>
                                            <div
                                                className="flex items-center space-x-2 text-xs text-gray-600"
                                                data-oid="8b3yjb_"
                                            >
                                                <span data-oid=".2ca7u4">
                                                    {activity.prescriptionId}
                                                </span>
                                                {activity.processingTime && (
                                                    <>
                                                        <span data-oid="ahtav6:">•</span>
                                                        <span data-oid="evmp7jc">
                                                            {formatTime(activity.processingTime)}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className="flex-shrink-0 text-xs text-gray-500"
                                            data-oid="zojiil4"
                                        >
                                            {formatDate(activity.timestamp)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <Card data-oid="wdj3248">
                <CardHeader data-oid="s_av4hj">
                    <CardTitle data-oid="p0si9p.">Prescription Reader Workflow Analysis</CardTitle>
                    <CardDescription data-oid="qvp9le8">
                        Detailed insights into prescription processing workflow and reader
                        performance
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="7l5en6j">
                    <Tabs defaultValue="workflow" className="w-full" data-oid="7voslhl">
                        <TabsList className="grid w-full grid-cols-3" data-oid="-c81h6s">
                            <TabsTrigger value="workflow" data-oid="juox7j2">
                                Workflow Analysis
                            </TabsTrigger>
                            <TabsTrigger value="medicines" data-oid="q:m6ckm">
                                Medicine Processing
                            </TabsTrigger>
                            <TabsTrigger value="orders" data-oid="hjdu-db">
                                Order Conversion
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="workflow" className="mt-6" data-oid="67apqis">
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                data-oid=":agsaxh"
                            >
                                <div
                                    className="p-4 border border-gray-200 rounded-lg"
                                    data-oid="4_p30h3"
                                >
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="s4zql-."
                                    >
                                        <FileText
                                            className="w-5 h-5 text-blue-600"
                                            data-oid="g:bg4fe"
                                        />

                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="k13px:a"
                                        >
                                            Submission to Review
                                        </h4>
                                    </div>
                                    <p
                                        className="text-2xl font-bold text-blue-600"
                                        data-oid="k8mx0n4"
                                    >
                                        15m
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="5tccl7.">
                                        Average time to start review
                                    </p>
                                </div>

                                <div
                                    className="p-4 border border-gray-200 rounded-lg"
                                    data-oid="tsv0gi1"
                                >
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="6ckq0jt"
                                    >
                                        <Eye
                                            className="w-5 h-5 text-yellow-600"
                                            data-oid="pngvpht"
                                        />

                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="-_6w19d"
                                        >
                                            Review Duration
                                        </h4>
                                    </div>
                                    <p
                                        className="text-2xl font-bold text-yellow-600"
                                        data-oid="ctdc987"
                                    >
                                        {formatTime(stats.averageProcessingTime)}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="pwo4jih">
                                        Average review time
                                    </p>
                                </div>

                                <div
                                    className="p-4 border border-gray-200 rounded-lg"
                                    data-oid="b09jhfp"
                                >
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="_:t-x6e"
                                    >
                                        <CheckCircle
                                            className="w-5 h-5 text-green-600"
                                            data-oid="un:4l6b"
                                        />

                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="ed:cdp:"
                                        >
                                            Total Processing
                                        </h4>
                                    </div>
                                    <p
                                        className="text-2xl font-bold text-green-600"
                                        data-oid="079on-p"
                                    >
                                        3.2h
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="s7_b2i0">
                                        End-to-end processing
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="medicines" className="mt-6" data-oid="-y5.rry">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="5va9-80"
                            >
                                <div data-oid="0qefg6-">
                                    <h4
                                        className="font-semibold text-gray-900 mb-3"
                                        data-oid="tw7rp_g"
                                    >
                                        Medicine Identification Accuracy
                                    </h4>
                                    <div className="space-y-3" data-oid="x6s01fx">
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="xax-_as"
                                        >
                                            <span className="text-sm" data-oid="b2x-igd">
                                                Correctly Identified
                                            </span>
                                            <span
                                                className="text-sm font-medium"
                                                data-oid="-gfboo_"
                                            >
                                                94.2%
                                            </span>
                                        </div>
                                        <Progress value={94.2} className="h-2" data-oid="fci5dsx" />

                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="v:-w_nf"
                                        >
                                            <span className="text-sm" data-oid="r3vkc39">
                                                Dosage Accuracy
                                            </span>
                                            <span
                                                className="text-sm font-medium"
                                                data-oid="7bo_52f"
                                            >
                                                91.8%
                                            </span>
                                        </div>
                                        <Progress value={91.8} className="h-2" data-oid="oq5x7u9" />

                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="78hw5fg"
                                        >
                                            <span className="text-sm" data-oid=".4wmh4b">
                                                Instructions Clarity
                                            </span>
                                            <span
                                                className="text-sm font-medium"
                                                data-oid="t5rpbfo"
                                            >
                                                88.5%
                                            </span>
                                        </div>
                                        <Progress value={88.5} className="h-2" data-oid="qdwxrwj" />
                                    </div>
                                </div>

                                <div data-oid="dhhvvp1">
                                    <h4
                                        className="font-semibold text-gray-900 mb-3"
                                        data-oid=":igc0:u"
                                    >
                                        Common Medicine Categories
                                    </h4>
                                    <div className="space-y-2" data-oid="vixz3l0">
                                        <div
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            data-oid="bavb8mb"
                                        >
                                            <span className="text-sm" data-oid="_n0.fwt">
                                                Pain Relief
                                            </span>
                                            <Badge variant="outline" data-oid="6hi2chl">
                                                32%
                                            </Badge>
                                        </div>
                                        <div
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            data-oid="f5pen-c"
                                        >
                                            <span className="text-sm" data-oid="v4h9tz1">
                                                Antibiotics
                                            </span>
                                            <Badge variant="outline" data-oid="1_m7juc">
                                                24%
                                            </Badge>
                                        </div>
                                        <div
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            data-oid="6bhq5.1"
                                        >
                                            <span className="text-sm" data-oid="vqmsw6o">
                                                Vitamins
                                            </span>
                                            <Badge variant="outline" data-oid="jj8e0kr">
                                                18%
                                            </Badge>
                                        </div>
                                        <div
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            data-oid="wlv:27c"
                                        >
                                            <span className="text-sm" data-oid="eyn.nt4">
                                                Chronic Care
                                            </span>
                                            <Badge variant="outline" data-oid="z7-3bgz">
                                                15%
                                            </Badge>
                                        </div>
                                        <div
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            data-oid="wdjh-uj"
                                        >
                                            <span className="text-sm" data-oid="i3-aeem">
                                                Other
                                            </span>
                                            <Badge variant="outline" data-oid="0zgxj6d">
                                                11%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="orders" className="mt-6" data-oid="y9i035y">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="tf74t7y"
                            >
                                <div data-oid="ojil5c7">
                                    <h4
                                        className="font-semibold text-gray-900 mb-3"
                                        data-oid="pwtwt5c"
                                    >
                                        Order Conversion Rates
                                    </h4>
                                    <div className="space-y-4" data-oid="72wuwfr">
                                        <div
                                            className="p-4 border border-gray-200 rounded-lg"
                                            data-oid="q_.k1e6"
                                        >
                                            <div
                                                className="flex items-center justify-between mb-2"
                                                data-oid="74ei4dv"
                                            >
                                                <span
                                                    className="text-sm font-medium"
                                                    data-oid="bd:v:np"
                                                >
                                                    Approved → Order Placed
                                                </span>
                                                <span
                                                    className="text-lg font-bold text-green-600"
                                                    data-oid=".op5za:"
                                                >
                                                    78.5%
                                                </span>
                                            </div>
                                            <Progress
                                                value={78.5}
                                                className="h-2"
                                                data-oid="6wcxkgb"
                                            />

                                            <p
                                                className="text-xs text-gray-600 mt-1"
                                                data-oid="x:lj4:."
                                            >
                                                Customers who place orders after approval
                                            </p>
                                        </div>

                                        <div
                                            className="p-4 border border-gray-200 rounded-lg"
                                            data-oid="95cv._b"
                                        >
                                            <div
                                                className="flex items-center justify-between mb-2"
                                                data-oid="_of0eof"
                                            >
                                                <span
                                                    className="text-sm font-medium"
                                                    data-oid="-ui48f1"
                                                >
                                                    Average Order Value
                                                </span>
                                                <span
                                                    className="text-lg font-bold text-blue-600"
                                                    data-oid="uxk36g6"
                                                >
                                                    EGP 156
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600" data-oid="6qza6iw">
                                                From processed prescriptions
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div data-oid="e8-1sah">
                                    <h4
                                        className="font-semibold text-gray-900 mb-3"
                                        data-oid="km0kxfq"
                                    >
                                        Customer Behavior
                                    </h4>
                                    <div className="space-y-3" data-oid="62d1quc">
                                        <div
                                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                                            data-oid="fktknnq"
                                        >
                                            <div data-oid="c-g_a:g">
                                                <p
                                                    className="text-sm font-medium text-green-800"
                                                    data-oid="up:pxky"
                                                >
                                                    Used Prescription
                                                </p>
                                                <p
                                                    className="text-xs text-green-600"
                                                    data-oid="::d9ulm"
                                                >
                                                    Placed order with medicines
                                                </p>
                                            </div>
                                            <span
                                                className="text-lg font-bold text-green-600"
                                                data-oid="2gg2sco"
                                            >
                                                {stats.approved}
                                            </span>
                                        </div>

                                        <div
                                            className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                                            data-oid="wuyiwnd"
                                        >
                                            <div data-oid="7yt:kkz">
                                                <p
                                                    className="text-sm font-medium text-orange-800"
                                                    data-oid=":8-dvz0"
                                                >
                                                    Pending Orders
                                                </p>
                                                <p
                                                    className="text-xs text-orange-600"
                                                    data-oid="ves.7gz"
                                                >
                                                    Approved but no order yet
                                                </p>
                                            </div>
                                            <span
                                                className="text-lg font-bold text-orange-600"
                                                data-oid="av4bb2:"
                                            >
                                                {Math.round(stats.approved * 0.215)}
                                            </span>
                                        </div>

                                        <div
                                            className="mt-4 p-3 bg-blue-50 rounded-lg"
                                            data-oid="d28ylvz"
                                        >
                                            <p
                                                className="text-sm font-medium text-blue-800 mb-1"
                                                data-oid="bvoo284"
                                            >
                                                Time to Order
                                            </p>
                                            <p className="text-xs text-blue-600" data-oid="kf1r7b0">
                                                Average: 2.3 hours after approval
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
