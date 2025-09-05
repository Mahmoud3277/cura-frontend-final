'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import {
    PrescriptionWorkflow,
    PrescriptionWorkflowManager,
    PrescriptionStatus,
    PrescriptionUrgency,
} from '@/lib/data/prescriptionWorkflow';

export default function CompletedPrescriptionsPage() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWorkflow | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '' as PrescriptionStatus | '',
        urgency: '' as PrescriptionUrgency | '',
        search: '',
        dateFrom: '',
        dateTo: '',
    });
    const [sortBy, setSortBy] = useState<'date' | 'status' | 'urgency'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        loadCompletedPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        applyFiltersAndSort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prescriptions, filters, sortBy, sortOrder]);

    const loadCompletedPrescriptions = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const data = await PrescriptionWorkflowService.getPrescriptions(
                'prescription-reader',
                user.id,
            );

            // Filter for completed prescriptions (approved, rejected, delivered)
            const completedPrescriptions = data.filter((p) =>
                [
                    'approved',
                    'rejected',
                    'preparing',
                    'ready',
                    'out-for-delivery',
                    'delivered',
                    'cancelled',
                ].includes(p.currentStatus),
            );

            setPrescriptions(completedPrescriptions);
        } catch (error) {
            console.error('Error loading completed prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...prescriptions];

        // Apply filters
        if (filters.status) {
            filtered = filtered.filter((p) => p.currentStatus === filters.status);
        }

        if (filters.urgency) {
            filtered = filtered.filter((p) => p.urgency === filters.urgency);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.id.toLowerCase().includes(searchTerm) ||
                    p.patientName.toLowerCase().includes(searchTerm) ||
                    p.customerName.toLowerCase().includes(searchTerm) ||
                    p.doctorName?.toLowerCase().includes(searchTerm) ||
                    p.notes?.toLowerCase().includes(searchTerm),
            );
        }

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter((p) => p.createdAt >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter((p) => p.createdAt <= toDate);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'urgency':
                    const urgencyOrder = { urgent: 3, normal: 2, routine: 1 };
                    comparison = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
                    break;
                case 'date':
                    comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
                    break;
                case 'status':
                    comparison = a.currentStatus.localeCompare(b.currentStatus);
                    break;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        setFilteredPrescriptions(filtered);
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            urgency: '',
            search: '',
            dateFrom: '',
            dateTo: '',
        });
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

    const getUrgencyColor = (urgency: PrescriptionUrgency) => {
        switch (urgency) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'routine':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCompletionStats = () => {
        const total = filteredPrescriptions.length;
        const approved = filteredPrescriptions.filter((p) =>
            ['approved', 'preparing', 'ready', 'out-for-delivery', 'delivered'].includes(
                p.currentStatus,
            ),
        ).length;
        const rejected = filteredPrescriptions.filter((p) => p.currentStatus === 'rejected').length;
        const delivered = filteredPrescriptions.filter(
            (p) => p.currentStatus === 'delivered',
        ).length;

        return { total, approved, rejected, delivered };
    };

    const stats = getCompletionStats();

    if (isLoading && prescriptions.length === 0) {
        return (
            <DashboardLayout
                title="Completed Prescriptions"
                userType="prescription-reader"
                data-oid="zekp6cr"
            >
                <div className="flex items-center justify-center p-8" data-oid="0lm-hd2">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                        data-oid="--1g376"
                    ></div>
                    <span className="ml-3 text-gray-600" data-oid=":g7atow">
                        Loading completed prescriptions...
                    </span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Completed Prescriptions"
            userType="prescription-reader"
            data-oid="7_46y.i"
        >
            <div className="space-y-6" data-oid="g_cgwew">
                {/* Completion Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="q.xo8ah">
                    <div
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-6 rounded-xl"
                        data-oid="z_wzas4"
                    >
                        <div className="flex items-center justify-between" data-oid="gb_doqd">
                            <div data-oid="g0rgu9u">
                                <h3 className="text-lg font-semibold mb-2" data-oid="2mows8w">
                                    Total Completed
                                </h3>
                                <p className="text-3xl font-bold" data-oid="uaisrkm">
                                    {stats.total}
                                </p>
                                <p className="text-sm opacity-80" data-oid="-dkq3an">
                                    All processed
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="67ykq6f">
                                📊
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
                        data-oid="i:4x-r9"
                    >
                        <div className="flex items-center justify-between" data-oid="_w7pahy">
                            <div data-oid="8yud:q0">
                                <h3 className="text-lg font-semibold mb-2" data-oid=":q8u:g4">
                                    Approved
                                </h3>
                                <p className="text-3xl font-bold" data-oid="p7fckav">
                                    {stats.approved}
                                </p>
                                <p className="text-sm opacity-80" data-oid="da84wqs">
                                    Successfully processed
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="dgujmf.">
                                ✅
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl"
                        data-oid="-csl-vw"
                    >
                        <div className="flex items-center justify-between" data-oid="b4nctut">
                            <div data-oid="j-v7gt8">
                                <h3 className="text-lg font-semibold mb-2" data-oid="0qsgijm">
                                    Rejected
                                </h3>
                                <p className="text-3xl font-bold" data-oid="3_bbygs">
                                    {stats.rejected}
                                </p>
                                <p className="text-sm opacity-80" data-oid="b.is8t5">
                                    Required clarification
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="d7ae7r9">
                                ❌
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
                        data-oid="a52-ps1"
                    >
                        <div className="flex items-center justify-between" data-oid="yyoh:.8">
                            <div data-oid="89dv9b1">
                                <h3 className="text-lg font-semibold mb-2" data-oid="dpka0ff">
                                    Delivered
                                </h3>
                                <p className="text-3xl font-bold" data-oid="av-yv0t">
                                    {stats.delivered}
                                </p>
                                <p className="text-sm opacity-80" data-oid=":jzbnl6">
                                    Fully completed
                                </p>
                            </div>
                            <div className="text-3xl opacity-80" data-oid="1e:u5jx">
                                🚚
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                    data-oid="t7j_yql"
                >
                    <div className="flex items-center justify-between mb-4" data-oid="-3l6f5l">
                        <h3 className="text-lg font-semibold text-gray-900" data-oid="x6a-inx">
                            Filters & Search
                        </h3>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            data-oid="tq3nhlw"
                        >
                            Clear All Filters
                        </button>
                    </div>

                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                        data-oid="wb_8_91"
                    >
                        <div data-oid="ju1-xg9">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="lyt.lm:"
                            >
                                Search
                            </label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                                }
                                placeholder="ID, patient, customer, doctor..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="rc4ix23"
                            />
                        </div>

                        <div data-oid="evr1ad6">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="nuiwk57"
                            >
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: e.target.value as PrescriptionStatus | '',
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="cvgzocv"
                            >
                                <option value="" data-oid="jfe2j9u">
                                    All Statuses
                                </option>
                                <option value="approved" data-oid="d.1jf1m">
                                    Approved
                                </option>
                                <option value="rejected" data-oid="etijvy-">
                                    Rejected
                                </option>
                                <option value="preparing" data-oid="e7-_-xk">
                                    Preparing
                                </option>
                                <option value="ready" data-oid="j:6xl-9">
                                    Ready
                                </option>
                                <option value="out-for-delivery" data-oid="ca449-s">
                                    Out for Delivery
                                </option>
                                <option value="delivered" data-oid="m3ejzpe">
                                    Delivered
                                </option>
                                <option value="cancelled" data-oid="ol70pag">
                                    Cancelled
                                </option>
                            </select>
                        </div>

                        <div data-oid="12e.h5o">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="_:3hqv."
                            >
                                Urgency
                            </label>
                            <select
                                value={filters.urgency}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        urgency: e.target.value as PrescriptionUrgency | '',
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="ze4ias0"
                            >
                                <option value="" data-oid="91q-09u">
                                    All Urgencies
                                </option>
                                <option value="urgent" data-oid="evk.3mf">
                                    Urgent
                                </option>
                                <option value="normal" data-oid="m1zc-9:">
                                    Normal
                                </option>
                                <option value="routine" data-oid="xclm5vv">
                                    Routine
                                </option>
                            </select>
                        </div>

                        <div data-oid="r0h5i9n">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="07s-qpr"
                            >
                                From Date
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="7zu-eww"
                            />
                        </div>

                        <div data-oid="qvcltt0">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="-0:xtl9"
                            >
                                To Date
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="fz79zhe"
                            />
                        </div>
                    </div>
                </div>

                {/* Sorting */}
                <div
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    data-oid="2f.mjgp"
                >
                    <div className="flex items-center justify-between" data-oid="05xfl0i">
                        <div className="flex items-center space-x-4" data-oid="0ec63vs">
                            <div className="flex items-center space-x-2" data-oid="7hi1-eq">
                                <label
                                    className="text-sm font-medium text-gray-700"
                                    data-oid="in2u166"
                                >
                                    Sort by:
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(e.target.value as 'date' | 'status' | 'urgency')
                                    }
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="-xpc3.p"
                                >
                                    <option value="date" data-oid=".svrnex">
                                        Completion Date
                                    </option>
                                    <option value="status" data-oid="6vcs51i">
                                        Status
                                    </option>
                                    <option value="urgency" data-oid="6zu4wbc">
                                        Urgency
                                    </option>
                                </select>
                                <button
                                    onClick={() =>
                                        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                                    }
                                    className="p-1 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                    data-oid="8wgw9p:"
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={loadCompletedPrescriptions}
                            disabled={isLoading}
                            className="px-3 py-1 bg-[#1F1F6F] hover:bg-[#14274E] text-white text-sm rounded-lg transition-colors duration-200 disabled:opacity-50"
                            data-oid="f5scfh6"
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {/* Completed Prescriptions List */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                    data-oid="xu8:zvw"
                >
                    <div className="p-6 border-b border-gray-200" data-oid="lwx31i-">
                        <h3 className="text-lg font-semibold text-gray-900" data-oid="_xrr-0y">
                            Completed Prescriptions ({filteredPrescriptions.length})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1" data-oid="73f9fx:">
                            {filteredPrescriptions.length === prescriptions.length
                                ? 'Showing all completed prescriptions'
                                : `Filtered from ${prescriptions.length} total completed prescriptions`}
                        </p>
                    </div>

                    <div className="p-6" data-oid="zt5-p6p">
                        {filteredPrescriptions.length === 0 ? (
                            <div className="text-center py-12" data-oid="_.9yeys">
                                <div
                                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    data-oid="tow9afb"
                                >
                                    <span className="text-2xl" data-oid="jrcapk5">
                                        📋
                                    </span>
                                </div>
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="becu.cb"
                                >
                                    No Completed Prescriptions Found
                                </h3>
                                <p className="text-gray-600" data-oid="c2c2x8s">
                                    {prescriptions.length === 0
                                        ? "You haven't completed any prescriptions yet."
                                        : 'No completed prescriptions match your current filters.'}
                                </p>
                                {prescriptions.length > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 text-[#1F1F6F] hover:text-[#14274E] font-medium transition-colors duration-200"
                                        data-oid="2i5:roe"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4" data-oid="utz2j_t">
                                {filteredPrescriptions.map((prescription) => (
                                    <div
                                        key={prescription.id}
                                        className={`border rounded-lg p-4 transition-all duration-200 ${
                                            selectedPrescription?.id === prescription.id
                                                ? 'border-[#1F1F6F] bg-blue-50'
                                                : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                                        }`}
                                        data-oid="g14.r02"
                                    >
                                        <div
                                            className="flex items-start justify-between mb-3"
                                            data-oid="wnjir8w"
                                        >
                                            <div data-oid="sf10uhu">
                                                <h4
                                                    className="font-semibold text-gray-900"
                                                    data-oid=":ymwa5t"
                                                >
                                                    {prescription.id}
                                                </h4>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="49-tbp-"
                                                >
                                                    Patient: {prescription.patientName}
                                                </p>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="wkglo-r"
                                                >
                                                    Customer: {prescription.customerName}
                                                </p>
                                            </div>
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="5-hzym-"
                                            >
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(prescription.urgency)}`}
                                                    data-oid="soi.dc."
                                                >
                                                    {prescription.urgency.charAt(0).toUpperCase() +
                                                        prescription.urgency.slice(1)}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${PrescriptionWorkflowManager.getStatusColor(prescription.currentStatus)}`}
                                                    data-oid="522djlz"
                                                >
                                                    {PrescriptionWorkflowManager.getStatusIcon(
                                                        prescription.currentStatus,
                                                    )}{' '}
                                                    {prescription.currentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3"
                                            data-oid="vxua0yr"
                                        >
                                            <div data-oid="ywfj94i">
                                                <span className="font-medium" data-oid="6xqqi2c">
                                                    Submitted:
                                                </span>{' '}
                                                {formatDate(prescription.createdAt)}
                                            </div>
                                            <div data-oid="1f_qsv1">
                                                <span className="font-medium" data-oid="junqnz7">
                                                    Completed:
                                                </span>{' '}
                                                {formatDate(prescription.updatedAt)}
                                            </div>
                                            {prescription.doctorName && (
                                                <div data-oid="5jdb2_7">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="c2uy32:"
                                                    >
                                                        Doctor:
                                                    </span>{' '}
                                                    {prescription.doctorName}
                                                </div>
                                            )}
                                            <div data-oid="62qp29g">
                                                <span className="font-medium" data-oid="cuzzt9e">
                                                    Files:
                                                </span>{' '}
                                                {prescription.files.length} file(s)
                                            </div>
                                        </div>

                                        {prescription.processedMedicines &&
                                            prescription.processedMedicines.length > 0 && (
                                                <div
                                                    className="bg-gray-50 rounded-lg p-3 mb-3"
                                                    data-oid="jlpzqrq"
                                                >
                                                    <h5
                                                        className="font-medium text-gray-900 mb-2"
                                                        data-oid="s8rxm26"
                                                    >
                                                        Processed Medicines (
                                                        {prescription.processedMedicines.length})
                                                    </h5>
                                                    <div className="space-y-1" data-oid="3oxjpud">
                                                        {prescription.processedMedicines
                                                            .slice(0, 3)
                                                            .map((medicine) => (
                                                                <div
                                                                    key={medicine.id}
                                                                    className="flex items-center justify-between text-sm"
                                                                    data-oid="-91zc6o"
                                                                >
                                                                    <span
                                                                        className="text-gray-700"
                                                                        data-oid="qi9gai-"
                                                                    >
                                                                        {medicine.productName}
                                                                    </span>
                                                                    <span
                                                                        className="text-gray-600"
                                                                        data-oid=":vlfuz0"
                                                                    >
                                                                        Qty: {medicine.quantity}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        {prescription.processedMedicines.length >
                                                            3 && (
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="qz:3d81"
                                                            >
                                                                +
                                                                {prescription.processedMedicines
                                                                    .length - 3}{' '}
                                                                more medicines
                                                            </p>
                                                        )}
                                                    </div>
                                                    {prescription.totalAmount && (
                                                        <div
                                                            className="mt-2 pt-2 border-t border-gray-200"
                                                            data-oid="wyr6l5b"
                                                        >
                                                            <div
                                                                className="flex items-center justify-between"
                                                                data-oid="o7_73:8"
                                                            >
                                                                <span
                                                                    className="font-medium text-gray-900"
                                                                    data-oid="9p.dq5t"
                                                                >
                                                                    Total Amount:
                                                                </span>
                                                                <span
                                                                    className="font-bold text-[#1F1F6F]"
                                                                    data-oid="owb7iwp"
                                                                >
                                                                    EGP{' '}
                                                                    {prescription.totalAmount.toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {prescription.rejectionReason && (
                                            <div
                                                className="bg-red-50 rounded-lg p-3 mb-3"
                                                data-oid="68hu3lg"
                                            >
                                                <h5
                                                    className="font-medium text-red-900 mb-1"
                                                    data-oid="gqp_2wd"
                                                >
                                                    Rejection Reason
                                                </h5>
                                                <p
                                                    className="text-sm text-red-700"
                                                    data-oid="qi4oeu-"
                                                >
                                                    {prescription.rejectionReason}
                                                </p>
                                            </div>
                                        )}

                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="mlzt-uy"
                                        >
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="clngxp_"
                                            >
                                                {prescription.currentStatus === 'delivered' && (
                                                    <span
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                        data-oid="ez7ylps"
                                                    >
                                                        ✅ Delivered
                                                    </span>
                                                )}
                                                {prescription.currentStatus === 'rejected' && (
                                                    <span
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                        data-oid="fu3jkmt"
                                                    >
                                                        ❌ Rejected
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setSelectedPrescription(
                                                        selectedPrescription?.id === prescription.id
                                                            ? null
                                                            : prescription,
                                                    )
                                                }
                                                className="text-[#1F1F6F] hover:text-[#14274E] font-medium text-sm transition-colors duration-200"
                                                data-oid="jp8hxzy"
                                            >
                                                {selectedPrescription?.id === prescription.id
                                                    ? 'Hide Details'
                                                    : 'View Details'}
                                            </button>
                                        </div>

                                        {/* Expanded Details */}
                                        {selectedPrescription?.id === prescription.id && (
                                            <div
                                                className="mt-4 pt-4 border-t border-gray-200"
                                                data-oid=".6dhwwi"
                                            >
                                                <h5
                                                    className="font-medium text-gray-900 mb-3"
                                                    data-oid="6rnxfju"
                                                >
                                                    Status History
                                                </h5>
                                                <div className="space-y-3" data-oid="w1n9_v5">
                                                    {prescription.statusHistory.map(
                                                        (entry, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-start space-x-3"
                                                                data-oid="__7i1xd"
                                                            >
                                                                <div
                                                                    className="w-8 h-8 bg-[#1F1F6F] rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                                    data-oid="tw4atuq"
                                                                >
                                                                    {index + 1}
                                                                </div>
                                                                <div
                                                                    className="flex-1"
                                                                    data-oid="qbre8ow"
                                                                >
                                                                    <div
                                                                        className="flex items-center justify-between"
                                                                        data-oid=".nwfgqt"
                                                                    >
                                                                        <p
                                                                            className="font-medium text-gray-900"
                                                                            data-oid=".b_atzk"
                                                                        >
                                                                            {entry.status.replace(
                                                                                '-',
                                                                                ' ',
                                                                            )}
                                                                        </p>
                                                                        <p
                                                                            className="text-sm text-gray-600"
                                                                            data-oid="4-d2lil"
                                                                        >
                                                                            {formatDate(
                                                                                entry.timestamp,
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <p
                                                                        className="text-sm text-gray-600"
                                                                        data-oid="sg8l96d"
                                                                    >
                                                                        By: {entry.userName} (
                                                                        {entry.userRole})
                                                                    </p>
                                                                    {entry.notes && (
                                                                        <p
                                                                            className="text-sm text-gray-600 mt-1"
                                                                            data-oid="ewln_.x"
                                                                        >
                                                                            {entry.notes}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
