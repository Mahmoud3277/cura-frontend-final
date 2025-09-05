'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import { PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';
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
import { prescriptionAPIService } from '@/lib/data/prescriptionWorkflow';
export function CompletedPrescriptionsView() {
    const { user } = useAuth();
    const [completedPrescriptions, setCompletedPrescriptions] = useState<PrescriptionWorkflow[]>(
        [],
    );
    const [filteredPrescriptions, setFilteredPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWorkflow | null>(
        null,
    );

    useEffect(() => {
        loadCompletedPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        filterPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completedPrescriptions, searchQuery, statusFilter, dateFilter]);

    const loadCompletedPrescriptions = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const data = await prescriptionAPIService.getAllPrescriptions(
            );

            // Filter for completed prescriptions (approved, suspended, cancelled)
            const completed = data.data.filter((p) =>
                ['approved', 'suspended', 'cancelled'].includes(p.currentStatus),
            );

            // Sort by most recent first
            completed.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

            setCompletedPrescriptions(completed);
        } catch (error) {
            console.error('Error loading completed prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterPrescriptions = () => {
        let filtered = [...completedPrescriptions];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (p) =>
                    p._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((p) => p.currentStatus === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter((p) => p.updatedAt >= filterDate);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter((p) => p.updatedAt >= filterDate);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter((p) => p.updatedAt >= filterDate);
                    break;
            }
        }

        setFilteredPrescriptions(filtered);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-cura-primary/10 text-cura-primary border-cura-primary/20';
            case 'suspended':
                return 'bg-cura-secondary/10 text-cura-secondary border-cura-secondary/20';
            case 'cancelled':
                return 'bg-cura-light/10 text-cura-light border-cura-light/20';
            default:
                return 'bg-cura-light/10 text-cura-light border-cura-light/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="o0y.o30"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                            data-oid="le_dq_3"
                        />
                    </svg>
                );

            case 'suspended':
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="hickg2i"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            data-oid="sxd9ud0"
                        />
                    </svg>
                );

            case 'cancelled':
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="xno3f__"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            data-oid="1zu0_1:"
                        />
                    </svg>
                );

            default:
                return (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="vfejhcl"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            data-oid="09xa7s-"
                        />
                    </svg>
                );
        }
    };

    const getStats = () => {
        const total = completedPrescriptions.length;
        const approved = completedPrescriptions.filter(
            (p) => p.currentStatus === 'approved',
        ).length;
        const suspended = completedPrescriptions.filter(
            (p) => p.currentStatus === 'suspended',
        ).length;

        return { total, approved, suspended };
    };

    const stats = getStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8" data-oid="jvwvxkm">
                <div
                    className="w-8 h-8 border-4 border-cura-primary border-t-transparent rounded-full animate-spin"
                    data-oid=".bcbt9j"
                ></div>
                <span className="ml-3 text-gray-600" data-oid="v_gafa6">
                    Loading completed prescriptions...
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="e.p1r3g">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="2oxr9sl">
                <Card data-oid="hevhkl2">
                    <CardContent className="p-4" data-oid="fnbjw-b">
                        <div className="flex items-center justify-between" data-oid="ey0p8dw">
                            <div data-oid="mx_ezym">
                                <p className="text-sm font-medium text-gray-600" data-oid="o.2wo55">
                                    Total Completed
                                </p>
                                <p
                                    className="text-2xl font-bold text-cura-primary"
                                    data-oid="hlyo3-c"
                                >
                                    {stats.total}
                                </p>
                            </div>
                            <div
                                className="w-8 h-8 bg-cura-primary/10 rounded-lg flex items-center justify-center"
                                data-oid="h9crq:3"
                            >
                                <svg
                                    className="w-5 h-5 text-cura-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="ier46ki"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        data-oid="j89fpz1"
                                    />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="qp2f32z">
                    <CardContent className="p-4" data-oid="rvv.vb6">
                        <div className="flex items-center justify-between" data-oid="5iq2oh0">
                            <div data-oid="l8f4ksm">
                                <p className="text-sm font-medium text-gray-600" data-oid=":ts0:0k">
                                    Approved
                                </p>
                                <p
                                    className="text-2xl font-bold text-cura-primary"
                                    data-oid="mza:ege"
                                >
                                    {stats.approved}
                                </p>
                            </div>
                            <div
                                className="w-8 h-8 bg-cura-primary/10 rounded-lg flex items-center justify-center"
                                data-oid="6_n-1l5"
                            >
                                <svg
                                    className="w-5 h-5 text-cura-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="2_y2pve"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                        data-oid="w7294z:"
                                    />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid=".xf:kr6">
                    <CardContent className="p-4" data-oid="2k:hvg4">
                        <div className="flex items-center justify-between" data-oid=".41xg8j">
                            <div data-oid="rfpyrs9">
                                <p className="text-sm font-medium text-gray-600" data-oid="t8icofp">
                                    Suspended
                                </p>
                                <p
                                    className="text-2xl font-bold text-cura-secondary"
                                    data-oid="fp5wsu6"
                                >
                                    {stats.suspended}
                                </p>
                            </div>
                            <div
                                className="w-8 h-8 bg-cura-secondary/10 rounded-lg flex items-center justify-center"
                                data-oid="otd2w9m"
                            >
                                <svg
                                    className="w-5 h-5 text-cura-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="25a1ffb"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        data-oid="62gze49"
                                    />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card data-oid="shnb1a2">
                <CardHeader data-oid="9oadims">
                    <CardTitle data-oid="iw285a5">Filter Prescriptions</CardTitle>
                </CardHeader>
                <CardContent data-oid="0sq0wl9">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="rwzuzr7">
                        <div data-oid="cohc:3t">
                            <Input
                                placeholder="Search by ID, patient, or customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                data-oid=":9trx42"
                            />
                        </div>
                        <div data-oid="fz4lxyl">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                                data-oid="ljzllj_"
                            >
                                <SelectTrigger data-oid="hf2p:rd">
                                    <SelectValue
                                        placeholder="Filter by status"
                                        data-oid="hmzqfdh"
                                    />
                                </SelectTrigger>
                                <SelectContent data-oid="-k7p2q4">
                                    <SelectItem value="all" data-oid="sy..-5v">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="approved" data-oid="p_wr81z">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="suspended" data-oid="z00e38k">
                                        Suspended
                                    </SelectItem>
                                    <SelectItem value="cancelled" data-oid="e1fqt8i">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div data-oid="l5gv76i">
                            <Select
                                value={dateFilter}
                                onValueChange={setDateFilter}
                                data-oid="s7r:d0a"
                            >
                                <SelectTrigger data-oid="1su5erx">
                                    <SelectValue placeholder="Filter by date" data-oid="sth52_u" />
                                </SelectTrigger>
                                <SelectContent data-oid="j.4-aky">
                                    <SelectItem value="all" data-oid="syl.-x-">
                                        All Time
                                    </SelectItem>
                                    <SelectItem value="today" data-oid="bt1vjhz">
                                        Today
                                    </SelectItem>
                                    <SelectItem value="week" data-oid="i3w7641">
                                        Last Week
                                    </SelectItem>
                                    <SelectItem value="month" data-oid=":3:a1t_">
                                        Last Month
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Prescriptions List */}
            <Card data-oid="4_k_3es">
                <CardHeader data-oid="67gdnqp">
                    <CardTitle className="flex items-center justify-between" data-oid="xnces4m">
                        Completed Prescriptions
                        <Badge variant="outline" data-oid="x8103kc">
                            {filteredPrescriptions.length}
                        </Badge>
                    </CardTitle>
                    <CardDescription data-oid="_wue6gn">
                        View and manage your completed prescription processing history
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid=":4dilq3">
                    {filteredPrescriptions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500" data-oid="m-3t58u">
                            <div
                                className="w-16 h-16 bg-cura-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="vh:ptdt"
                            >
                                <svg
                                    className="w-8 h-8 text-cura-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="6k1i1km"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        data-oid="gixa09k"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-2"
                                data-oid="smq98h_"
                            >
                                No Completed Prescriptions
                            </h3>
                            <p className="text-gray-600" data-oid="ebnshkq">
                                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                                    ? 'No prescriptions match your current filters.'
                                    : "You haven't completed any prescriptions yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto" data-oid="fz.7:o_">
                            {filteredPrescriptions.map((prescription) => (
                                <div
                                    key={prescription.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                    data-oid="vxmtvne"
                                >
                                    <div
                                        className="flex items-start justify-between mb-3"
                                        data-oid="0omb3y."
                                    >
                                        <div data-oid="gqvs3:z">
                                            <h4
                                                className="font-semibold text-gray-900"
                                                data-oid="bqpomhn"
                                            >
                                                {prescription.id}
                                            </h4>
                                            <p className="text-sm text-gray-600" data-oid="rezio7l">
                                                Patient: {prescription.patientName}
                                            </p>
                                            <p className="text-sm text-gray-600" data-oid="ltcnya5">
                                                Customer: {prescription.customerName}
                                            </p>
                                        </div>
                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="..7n_mp"
                                        >
                                            <Badge
                                                className={getStatusColor(
                                                    prescription.currentStatus,
                                                )}
                                                variant="outline"
                                                data-oid="_x401ep"
                                            >
                                                <span
                                                    className="flex items-center gap-1"
                                                    data-oid="3t:62u3"
                                                >
                                                    {getStatusIcon(prescription.currentStatus)}
                                                    {prescription.currentStatus}
                                                </span>
                                            </Badge>
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3"
                                        data-oid="-besg6-"
                                    >
                                        <div data-oid="99:2p19">
                                            <span className="font-medium" data-oid="f398m04">
                                                Submitted:
                                            </span>
                                            <p data-oid="6xfq.1p">
                                                {(prescription.createdAt)}
                                            </p>
                                        </div>
                                        <div data-oid="vaj:rtm">
                                            <span className="font-medium" data-oid="-p_.kgu">
                                                Completed:
                                            </span>
                                            <p data-oid="_1owkls">
                                                {(prescription.updatedAt)}
                                            </p>
                                        </div>
                                        <div data-oid="6:dhj55">
                                            <span className="font-medium" data-oid="wvc4d6:">
                                                Urgency:
                                            </span>
                                            <p className="capitalize" data-oid="p:ick88">
                                                {prescription.urgency}
                                            </p>
                                        </div>
                                        <div data-oid="7v9_icp">
                                            <span className="font-medium" data-oid="-ocyezi">
                                                Files:
                                            </span>
                                            <p data-oid="y58cqym">
                                                {prescription.files.length} file(s)
                                            </p>
                                        </div>
                                    </div>

                                    {prescription.processedMedicines &&
                                        prescription.processedMedicines.length > 0 && (
                                            <div
                                                className="bg-gray-50 rounded-lg p-3 mb-3"
                                                data-oid="b2jfal:"
                                            >
                                                <span
                                                    className="font-medium text-gray-700"
                                                    data-oid="rzf:1r0"
                                                >
                                                    Processed Medicines:
                                                </span>
                                                <div className="mt-2 space-y-1" data-oid="wlpbfh1">
                                                    {prescription.processedMedicines
                                                        .slice(0, 3)
                                                        .map((medicine, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="text-sm text-gray-600"
                                                                data-oid="v0n0luz"
                                                            >
                                                                • {medicine.productName} -{' '}
                                                                {medicine.instructions}
                                                            </div>
                                                        ))}
                                                    {prescription.processedMedicines.length > 3 && (
                                                        <div
                                                            className="text-sm text-gray-500"
                                                            data-oid="_qfsdv8"
                                                        >
                                                            +
                                                            {prescription.processedMedicines
                                                                .length - 3}{' '}
                                                            more medicines
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="h9yfeg0"
                                    >
                                        <div className="text-sm text-gray-500" data-oid="6f:qldb">
                                            Processed by: {user?.name}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedPrescription(prescription)}
                                            data-oid="72y:xzj"
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Prescription Details Modal */}
            {selectedPrescription && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="dr6_4tu"
                >
                    <Card
                        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4"
                        data-oid="ylm7bkk"
                    >
                        <CardHeader data-oid="_es-.7l">
                            <CardTitle
                                className="flex items-center justify-between"
                                data-oid="wkdj5d3"
                            >
                                Prescription Details: {selectedPrescription.id}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPrescription(null)}
                                    data-oid="7bo9:j."
                                >
                                    Close
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4" data-oid="z5y67j3">
                            <div className="grid grid-cols-2 gap-4 text-sm" data-oid="9jp44ik">
                                <div data-oid="z35rvbp">
                                    <span className="font-medium text-gray-700" data-oid="5h6--h3">
                                        Patient:
                                    </span>
                                    <p className="text-gray-900" data-oid="2a.fapa">
                                        {selectedPrescription.patientName}
                                    </p>
                                </div>
                                <div data-oid="zvc:_ab">
                                    <span className="font-medium text-gray-700" data-oid="jgwwrcf">
                                        Customer:
                                    </span>
                                    <p className="text-gray-900" data-oid=":ntydzi">
                                        {selectedPrescription.customerName}
                                    </p>
                                </div>
                                <div data-oid=":owd.6x">
                                    <span className="font-medium text-gray-700" data-oid="7xsjebm">
                                        Phone:
                                    </span>
                                    <p className="text-gray-900" data-oid="s.am007">
                                        {selectedPrescription.customerPhone}
                                    </p>
                                </div>
                                <div data-oid="krl-0y8">
                                    <span className="font-medium text-gray-700" data-oid="3w1_b9y">
                                        Status:
                                    </span>
                                    <Badge
                                        className={getStatusColor(
                                            selectedPrescription.currentStatus,
                                        )}
                                        data-oid="yfn-z73"
                                    >
                                        <span
                                            className="flex items-center gap-1"
                                            data-oid="0uxnlhz"
                                        >
                                            {getStatusIcon(selectedPrescription.currentStatus)}
                                            {selectedPrescription.currentStatus}
                                        </span>
                                    </Badge>
                                </div>
                            </div>

                            {selectedPrescription.processedMedicines &&
                                selectedPrescription.processedMedicines.length > 0 && (
                                    <div data-oid="xs9qvau">
                                        <h4
                                            className="font-semibold text-gray-900 mb-2"
                                            data-oid="r8-7i_v"
                                        >
                                            Processed Medicines
                                        </h4>
                                        <div className="space-y-2" data-oid="ieu:kew">
                                            {selectedPrescription.processedMedicines.map(
                                                (medicine, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gray-50 rounded-lg p-3"
                                                        data-oid="2cq9_vw"
                                                    >
                                                        <div
                                                            className="flex items-center justify-between"
                                                            data-oid="zmb::c-"
                                                        >
                                                            <div data-oid="yblyxnc">
                                                                <p
                                                                    className="font-medium"
                                                                    data-oid="glrbjq:"
                                                                >
                                                                    {medicine.productName}
                                                                </p>
                                                                <p
                                                                    className="text-sm text-gray-600"
                                                                    data-oid="de.kqt5"
                                                                >
                                                                    {medicine.instructions}
                                                                </p>
                                                            </div>
                                                            <div
                                                                className="text-right"
                                                                data-oid="1s43gv_"
                                                            >
                                                                <p
                                                                    className="font-semibold"
                                                                    data-oid="7x-u6ps"
                                                                >
                                                                    EGP{' '}
                                                                    {(
                                                                        medicine.price *
                                                                        medicine.quantity
                                                                    ).toFixed(2)}
                                                                </p>
                                                                <p
                                                                    className="text-sm text-gray-600"
                                                                    data-oid="p3n3w6b"
                                                                >
                                                                    Qty: {medicine.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            <div className="grid grid-cols-2 gap-4 text-sm" data-oid="j376r.2">
                                <div data-oid="k8:5eyj">
                                    <span className="font-medium text-gray-700" data-oid="qlr0yww">
                                        Submitted:
                                    </span>
                                    <p className="text-gray-900" data-oid="gapr0tv">
                                        {(selectedPrescription.createdAt)}
                                    </p>
                                </div>
                                <div data-oid="ebm1v-i">
                                    <span className="font-medium text-gray-700" data-oid="qq:138b">
                                        Completed:
                                    </span>
                                    <p className="text-gray-900" data-oid="g:416r6">
                                        {(selectedPrescription.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
