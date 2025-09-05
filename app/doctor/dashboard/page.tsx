'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
    doctorManagementService,
    DoctorDetails,
    DoctorReferral,
} from '@/lib/services/doctorManagementService';
import { DoctorAnalyticsDashboard } from '@/components/analytics/DoctorAnalyticsDashboard';
import { EnhancedQRCodeManager } from '@/components/doctor/EnhancedQRCodeManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Share2, TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export default function DoctorDashboardPage() {
    const { user } = useAuth();
    const [doctorData, setDoctorData] = useState<DoctorDetails | null>(null);
    const [referrals, setReferrals] = useState<DoctorReferral[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDoctorData();
    }, []);

    const loadDoctorData = async () => {
        try {
            setIsLoading(true);
            // In real app, get doctor ID from user context
            const doctorId = 'dr-ahmed-hassan'; // Mock doctor ID
            const doctor = doctorManagementService.getDoctorById(doctorId);
            const doctorReferrals = doctorManagementService.getReferrals(doctorId);

            setDoctorData(doctor || null);
            setReferrals(doctorReferrals);
        } catch (error) {
            console.error('Error loading doctor data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyReferralLink = async () => {
        if (doctorData) {
            try {
                await navigator.clipboard.writeText(doctorData.referralSystem.referralLink);
                alert('Referral link copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy link:', error);
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return `EGP ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="7ah-vfk"
            >
                <div className="text-center" data-oid="t2oaa54">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="n3-me30"
                    ></div>
                    <span className="text-gray-600" data-oid="n03b1:y">
                        Loading dashboard...
                    </span>
                </div>
            </div>
        );
    }

    if (!doctorData) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="uamv22d"
            >
                <div className="text-center p-8" data-oid="q0.5tiz">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="wsgjxzx">
                        Doctor Profile Not Found
                    </h3>
                    <p className="text-gray-600" data-oid="dpekbf-">
                        Unable to load doctor profile. Please contact support.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="43fa.6g">
            {/* Header with Doctor Info */}
            <Card
                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white border-0"
                data-oid="v7-kg_s"
            >
                <CardContent className="p-6" data-oid="eyp.qe2">
                    <div className="flex items-center justify-between" data-oid="h.1rnh9">
                        <div data-oid="kl-2s.q">
                            <h1 className="text-2xl font-bold mb-2" data-oid="bnv5_7z">
                                Welcome, {doctorData.name}
                            </h1>
                            <p className="text-lg opacity-90" data-oid="m127s:p">
                                {doctorData.specialization}
                            </p>
                            <p className="text-sm opacity-80" data-oid=".7.hk8:">
                                {doctorData.clinicHospital} • {doctorData.cityName}
                            </p>
                        </div>
                        <div className="text-right" data-oid="xhw-:td">
                            <Badge
                                variant={doctorData.status === 'active' ? 'default' : 'secondary'}
                                className={
                                    doctorData.status === 'active'
                                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                }
                                data-oid="0fskthg"
                            >
                                {doctorData.status === 'active' ? 'Active' : 'Pending'}
                            </Badge>
                            <p className="text-sm opacity-80 mt-2" data-oid="k1f.:us">
                                Code: {doctorData.referralSystem.referralCode}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="u6ba-i7">
                <Card data-oid="eyqlcme">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="-mp4lvb"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="p0q24pw">
                            Total Referrals
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" data-oid="ewfzp::" />
                    </CardHeader>
                    <CardContent data-oid="::nhzl_">
                        <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="_09g9or">
                            {doctorData.performance.totalReferrals}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid="rmx_vnr">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="m3vam8s">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="wqzde-i"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="xz2ox93">
                            Successful Referrals
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" data-oid="b7i52ib" />
                    </CardHeader>
                    <CardContent data-oid="0oswdiv">
                        <div className="text-2xl font-bold text-green-600" data-oid="huq2rhl">
                            {doctorData.performance.successfulReferrals}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid="28mtthw">
                            {doctorData.performance.conversionRate.toFixed(1)}% conversion
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="8jxgn1n">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="33v.04v"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="aeu2oil">
                            Commission Earned
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" data-oid="zx713tr" />
                    </CardHeader>
                    <CardContent data-oid="ijaodbt">
                        <div className="text-2xl font-bold text-[#394867]" data-oid="b5vq3sv">
                            {formatCurrency(doctorData.performance.totalCommissionEarned)}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid="nvembkn">
                            {doctorData.commission.rate}% rate
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="tud3543">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="-ayl_d9"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="u1qpqaq">
                            This Month
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" data-oid="1dk-vfd" />
                    </CardHeader>
                    <CardContent data-oid=".m1uvd0">
                        <div className="text-2xl font-bold text-[#9BA4B4]" data-oid="jwhk2-j">
                            {doctorData.performance.monthlyReferrals}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid="akhgymb">
                            New referrals
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card data-oid="p:4m0it">
                <CardHeader data-oid="9ebpbjf">
                    <CardTitle data-oid="0y6nd6q">Quick Actions</CardTitle>
                    <CardDescription data-oid="wodbnjy">
                        Manage your referral system and share your code
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="p8pkh-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="mp.fc9f">
                        <Button
                            onClick={copyReferralLink}
                            variant="outline"
                            className="flex items-center gap-2"
                            data-oid="gw6dze2"
                        >
                            <Copy className="h-4 w-4" data-oid="36m1mi5" />
                            Copy Referral Link
                        </Button>
                        <Button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `${doctorData.name} - Medical Referral`,
                                        text: `Get your medicines delivered with ${doctorData.name}'s trusted recommendation.`,
                                        url: doctorData.referralSystem.referralLink,
                                    });
                                }
                            }}
                            variant="outline"
                            className="flex items-center gap-2"
                            data-oid=".dszhe6"
                        >
                            <Share2 className="h-4 w-4" data-oid="_uv4.oe" />
                            Share Referral
                        </Button>
                        <Button
                            onClick={() =>
                                window.open(
                                    `mailto:?subject=Medical Referral from ${doctorData.name}&body=Get your medicines delivered with my trusted recommendation: ${doctorData.referralSystem.referralLink}`,
                                )
                            }
                            variant="outline"
                            data-oid="7ksi2tz"
                        >
                            Email Template
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="analytics" className="space-y-6" data-oid="y8xhqkw">
                <TabsList className="grid w-full grid-cols-3" data-oid="zgayeld">
                    <TabsTrigger value="analytics" data-oid="5.-y1pm">
                        Analytics Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="qr-codes" data-oid="5p4ibt3">
                        QR Code Manager
                    </TabsTrigger>
                    <TabsTrigger value="referrals" data-oid="w1q54ik">
                        Referral Details
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" data-oid=".s-3gir">
                    <DoctorAnalyticsDashboard data-oid="f2a6_y-" />
                </TabsContent>

                <TabsContent value="qr-codes" data-oid=".-d5j6q">
                    <EnhancedQRCodeManager doctor={doctorData} data-oid="f2s-_34" />
                </TabsContent>

                <TabsContent value="referrals" data-oid="4b3cwpx">
                    <Card data-oid="v:briqr">
                        <CardHeader data-oid="zhdy0hj">
                            <CardTitle data-oid="kzhh-21">Recent Referrals</CardTitle>
                            <CardDescription data-oid="deac7k6">
                                Track your referral performance and commissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid="s:vtnje">
                            {referrals.length === 0 ? (
                                <div className="text-center py-8" data-oid="ana9hhe">
                                    <div
                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                        data-oid="yqedspl"
                                    >
                                        <Users
                                            className="h-8 w-8 text-gray-400"
                                            data-oid="m02ml7h"
                                        />
                                    </div>
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="5.leb2q"
                                    >
                                        No Referrals Yet
                                    </h3>
                                    <p className="text-gray-600" data-oid="1ijtko_">
                                        Start sharing your referral code to earn commissions!
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto" data-oid="-9._1l:">
                                    <table className="w-full" data-oid="9h3yqkn">
                                        <thead className="bg-gray-50" data-oid="do3a6sm">
                                            <tr data-oid="76w:l::">
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid=".6gg-e1"
                                                >
                                                    Customer
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="ssf_tnf"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="9il2_:2"
                                                >
                                                    Order Value
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="p_2r9up"
                                                >
                                                    Commission
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    data-oid="7m-:atz"
                                                >
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            className="bg-white divide-y divide-gray-200"
                                            data-oid=":f26pfi"
                                        >
                                            {referrals.map((referral) => (
                                                <tr key={referral.id} data-oid="cms1x-y">
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="8zuk73o"
                                                    >
                                                        <div data-oid="e-g3b.w">
                                                            <div
                                                                className="text-sm font-medium text-gray-900"
                                                                data-oid="a_x_u26"
                                                            >
                                                                {referral.customerName}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="d1wv:c4"
                                                            >
                                                                {referral.customerPhone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        data-oid="hdr5a2h"
                                                    >
                                                        <Badge
                                                            variant={
                                                                referral.status === 'converted'
                                                                    ? 'default'
                                                                    : referral.status === 'pending'
                                                                      ? 'secondary'
                                                                      : 'outline'
                                                            }
                                                            data-oid="rgza9g7"
                                                        >
                                                            {referral.status}
                                                        </Badge>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                        data-oid="c.l-872"
                                                    >
                                                        {referral.orderValue
                                                            ? formatCurrency(referral.orderValue)
                                                            : '-'}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                        data-oid="evpwuwh"
                                                    >
                                                        {referral.commissionAmount
                                                            ? formatCurrency(
                                                                  referral.commissionAmount,
                                                              )
                                                            : '-'}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                        data-oid="wx0uw6n"
                                                    >
                                                        {new Date(
                                                            referral.createdAt,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
