'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
    doctorManagementService,
    DoctorDetails,
    DoctorReferral,
} from '@/lib/services/doctorManagementService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    Users,
    TrendingUp,
    DollarSign,
    Search,
    Filter,
    Download,
    Eye,
    Calendar,
    CheckCircle,
    Clock,
    XCircle,
} from 'lucide-react';

export default function DoctorReferralsPage() {
    const { user } = useAuth();
    const [doctorData, setDoctorData] = useState<DoctorDetails | null>(null);
    const [referrals, setReferrals] = useState<DoctorReferral[]>([]);
    const [filteredReferrals, setFilteredReferrals] = useState<DoctorReferral[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        loadDoctorData();
    }, []);

    useEffect(() => {
        filterReferrals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referrals, searchTerm, statusFilter, dateFilter]);

    const loadDoctorData = async () => {
        try {
            setIsLoading(true);
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

    const filterReferrals = () => {
        let filtered = [...referrals];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (referral) =>
                    referral.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    referral.customerPhone.includes(searchTerm),
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((referral) => referral.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(
                        (referral) => new Date(referral.createdAt) >= filterDate,
                    );
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(
                        (referral) => new Date(referral.createdAt) >= filterDate,
                    );
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(
                        (referral) => new Date(referral.createdAt) >= filterDate,
                    );
                    break;
            }
        }

        setFilteredReferrals(filtered);
    };

    const formatCurrency = (amount: number) => {
        return `EGP ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'converted':
                return <CheckCircle className="h-4 w-4 text-green-500" data-oid="h_-i88j" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" data-oid="basldzi" />;
            case 'expired':
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-500" data-oid="ftcr4mh" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" data-oid="8t1r5lm" />;
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'converted':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'expired':
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const exportReferrals = () => {
        const csvContent = [
            [
                'Customer Name',
                'Phone',
                'Status',
                'Order Value',
                'Commission',
                'Date',
                'Source',
            ].join(','),
            ...filteredReferrals.map((referral) =>
                [
                    referral.customerName,
                    referral.customerPhone,
                    referral.status,
                    referral.orderValue || 0,
                    referral.commissionAmount || 0,
                    new Date(referral.createdAt).toLocaleDateString(),
                    referral.referralSource,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `referrals-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="pp.6_a5"
            >
                <div className="text-center" data-oid="ojlolyd">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="d_v83zl"
                    ></div>
                    <span className="text-gray-600" data-oid="9:7fie7">
                        Loading referrals...
                    </span>
                </div>
            </div>
        );
    }

    if (!doctorData) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="nf2.x-8"
            >
                <div className="text-center p-8" data-oid="6_fm0fw">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="alyt11-">
                        Doctor Profile Not Found
                    </h3>
                    <p className="text-gray-600" data-oid="n66m59_">
                        Unable to load doctor profile. Please contact support.
                    </p>
                </div>
            </div>
        );
    }

    // Calculate summary stats
    const totalReferrals = filteredReferrals.length;
    const successfulReferrals = filteredReferrals.filter((r) => r.status === 'converted').length;
    const pendingReferrals = filteredReferrals.filter((r) => r.status === 'pending').length;
    const totalCommission = filteredReferrals.reduce(
        (sum, r) => sum + (r.commissionAmount || 0),
        0,
    );
    const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0;

    return (
        <div className="space-y-6" data-oid="vpk7i0.">
            {/* Header */}
            <div data-oid="6cq.keu">
                <h1 className="text-3xl font-bold text-gray-900" data-oid="y80crvk">
                    Referral Management
                </h1>
                <p className="text-gray-600 mt-1" data-oid="zpn_cm9">
                    Track and manage your patient referrals and commissions
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="h_pokx4">
                <Card data-oid="j75y--v">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="hy3emhs"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="z0c-vt2">
                            Total Referrals
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" data-oid="d953kmz" />
                    </CardHeader>
                    <CardContent data-oid="x7b-y2e">
                        <div className="text-2xl font-bold text-[#1F1F6F]" data-oid="bql55.z">
                            {totalReferrals}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid="duuc:a.">
                            {filteredReferrals.length !== referrals.length
                                ? 'Filtered'
                                : 'All time'}
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="965o1yg">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="wgjy75_"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="m62ln.p">
                            Successful
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" data-oid="37ccf.8" />
                    </CardHeader>
                    <CardContent data-oid="uu3v4lg">
                        <div className="text-2xl font-bold text-green-600" data-oid="i89uouq">
                            {successfulReferrals}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid="7tn7fym">
                            {conversionRate.toFixed(1)}% conversion rate
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="4e3uywy">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="y3j32:_"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="pd.b9gb">
                            Pending
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" data-oid="c8:glo9" />
                    </CardHeader>
                    <CardContent data-oid="4bfi45o">
                        <div className="text-2xl font-bold text-yellow-600" data-oid="urd7enm">
                            {pendingReferrals}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid=":ii.04m">
                            Awaiting conversion
                        </p>
                    </CardContent>
                </Card>

                <Card data-oid="sbg_l39">
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="uv21qty"
                    >
                        <CardTitle className="text-sm font-medium" data-oid="u.62b1c">
                            Total Commission
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" data-oid="qt58w22" />
                    </CardHeader>
                    <CardContent data-oid="gefl9xa">
                        <div className="text-2xl font-bold text-[#394867]" data-oid="_8azyxh">
                            {formatCurrency(totalCommission)}
                        </div>
                        <p className="text-xs text-muted-foreground" data-oid="zkr8ykc">
                            From filtered results
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card data-oid="49xta4:">
                <CardHeader data-oid="gi90:ik">
                    <CardTitle className="flex items-center gap-2" data-oid=":d9nvyp">
                        <Filter className="h-5 w-5" data-oid="2yzt561" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent data-oid="6gcgqvv">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-oid="-gr95mr">
                        <div className="relative" data-oid="ss4238f">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                                data-oid="6jdqqs6"
                            />

                            <Input
                                placeholder="Search by name or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                data-oid="6ropu.-"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                            data-oid="sh46ka9"
                        >
                            <SelectTrigger data-oid="33jf8ie">
                                <SelectValue placeholder="Filter by status" data-oid="tycll4h" />
                            </SelectTrigger>
                            <SelectContent data-oid="ypvkea8">
                                <SelectItem value="all" data-oid="qu309b-">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="converted" data-oid="f2101m2">
                                    Converted
                                </SelectItem>
                                <SelectItem value="pending" data-oid="86.cx_w">
                                    Pending
                                </SelectItem>
                                <SelectItem value="expired" data-oid="nkpq0.3">
                                    Expired
                                </SelectItem>
                                <SelectItem value="cancelled" data-oid="-69c:ya">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={dateFilter} onValueChange={setDateFilter} data-oid="z3:8xjc">
                            <SelectTrigger data-oid="3_g2j9r">
                                <SelectValue placeholder="Filter by date" data-oid="_r1hh.." />
                            </SelectTrigger>
                            <SelectContent data-oid="nkv92uf">
                                <SelectItem value="all" data-oid="ujb1hlv">
                                    All Time
                                </SelectItem>
                                <SelectItem value="today" data-oid="5whrfge">
                                    Today
                                </SelectItem>
                                <SelectItem value="week" data-oid="1jhm1re">
                                    Last 7 Days
                                </SelectItem>
                                <SelectItem value="month" data-oid="cb-cou4">
                                    Last 30 Days
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setDateFilter('all');
                            }}
                            data-oid="92uz6g2"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Referrals Table */}
            <Card data-oid="_q5y5p9">
                <CardHeader data-oid="ks8seyj">
                    <CardTitle data-oid="p:fb368">Referrals List</CardTitle>
                    <CardDescription data-oid="odlsc-q">
                        {filteredReferrals.length} of {referrals.length} referrals
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="1gvl5_:">
                    {filteredReferrals.length === 0 ? (
                        <div className="text-center py-8" data-oid="91qw69s">
                            <div
                                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="xtrj9zr"
                            >
                                <Users className="h-8 w-8 text-gray-400" data-oid="f9d00f1" />
                            </div>
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-2"
                                data-oid="3bex81y"
                            >
                                {referrals.length === 0
                                    ? 'No Referrals Yet'
                                    : 'No Matching Referrals'}
                            </h3>
                            <p className="text-gray-600" data-oid="deyijsv">
                                {referrals.length === 0
                                    ? 'Start sharing your referral code to earn commissions!'
                                    : 'Try adjusting your filters to see more results.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto" data-oid="n1wx59a">
                            <Table data-oid="::.z6ee">
                                <TableHeader data-oid="0mo-4u:">
                                    <TableRow data-oid="pr-qb58">
                                        <TableHead data-oid="u4q8xxw">Customer</TableHead>
                                        <TableHead data-oid="xl57j7n">Status</TableHead>
                                        <TableHead data-oid="roghdbr">Source</TableHead>
                                        <TableHead data-oid="hcworq0">Order Value</TableHead>
                                        <TableHead data-oid="53dl:d6">Commission</TableHead>
                                        <TableHead data-oid="3su-_l7">Date</TableHead>
                                        <TableHead data-oid="7.ar0j.">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody data-oid="cvr4e..">
                                    {filteredReferrals.map((referral) => (
                                        <TableRow key={referral.id} data-oid="z92i9i6">
                                            <TableCell data-oid="5n00ie6">
                                                <div data-oid="4:xfjhg">
                                                    <div
                                                        className="font-medium text-gray-900"
                                                        data-oid="7vmwnge"
                                                    >
                                                        {referral.customerName}
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="n7werd9"
                                                    >
                                                        {referral.customerPhone}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="85g7gvy">
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="3uy_5x3"
                                                >
                                                    {getStatusIcon(referral.status)}
                                                    <Badge
                                                        variant={getStatusVariant(referral.status)}
                                                        data-oid="0mi49x."
                                                    >
                                                        {referral.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="si:eoi6">
                                                <Badge variant="outline" data-oid="k5-5v32">
                                                    {referral.referralSource.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell data-oid="mgsn8jm">
                                                {referral.orderValue
                                                    ? formatCurrency(referral.orderValue)
                                                    : '-'}
                                            </TableCell>
                                            <TableCell data-oid="rp.6k57">
                                                <span
                                                    className={
                                                        referral.commissionAmount
                                                            ? 'font-medium text-green-600'
                                                            : 'text-gray-400'
                                                    }
                                                    data-oid="6uuif7o"
                                                >
                                                    {referral.commissionAmount
                                                        ? formatCurrency(referral.commissionAmount)
                                                        : '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell data-oid="4gmyng4">
                                                <div className="text-sm" data-oid="hf_z4ay">
                                                    {new Date(
                                                        referral.createdAt,
                                                    ).toLocaleDateString()}
                                                </div>
                                                <div
                                                    className="text-xs text-gray-500"
                                                    data-oid="9fezkj5"
                                                >
                                                    {new Date(
                                                        referral.createdAt,
                                                    ).toLocaleTimeString()}
                                                </div>
                                            </TableCell>
                                            <TableCell data-oid="mo0_xt8">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    data-oid="vm.y3s3"
                                                >
                                                    <Eye className="h-4 w-4" data-oid="c4xmbo3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
