'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard, cardGradients } from '@/components/dashboard/DashboardCard';
import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import {
    pharmacyCityAssignmentService,
    PharmacyCityAssignment,
    AssignmentFilters,
    PharmacyCoverageStats,
    NewAssignmentRequest,
} from '@/lib/services/pharmacyCityAssignmentService';
import { PharmacyAssignmentModal } from '@/components/admin/PharmacyAssignmentModal';

export default function PharmacyCityAssignmentPage() {
    const [activeTab, setActiveTab] = useState<
        'overview' | 'assignments' | 'coverage' | 'commission'
    >('overview');
    const [assignments, setAssignments] = useState<PharmacyCityAssignment[]>([]);
    const [stats, setStats] = useState<PharmacyCoverageStats | null>(null);
    const [filters, setFilters] = useState<AssignmentFilters>({});
    const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<PharmacyCityAssignment | null>(
        null,
    );

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const loadData = async () => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const filteredAssignments = pharmacyCityAssignmentService.getAssignments(filters);
        const coverageStats = pharmacyCityAssignmentService.getCoverageStats();

        setAssignments(filteredAssignments);
        setStats(coverageStats);
        setIsLoading(false);
    };

    const handleFilterChange = (key: keyof AssignmentFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '' ? undefined : value,
        }));
    };

    const handleToggleStatus = async (assignmentId: string) => {
        const success = pharmacyCityAssignmentService.toggleAssignmentStatus(assignmentId);
        if (success) {
            loadData();
        }
    };

    const handleBulkCommissionUpdate = async () => {
        if (selectedAssignments.length === 0) return;

        const newRate = prompt('Enter new commission rate (%):');
        if (newRate && !isNaN(parseFloat(newRate))) {
            const applyToGovernorate = window.confirm(
                'Apply to all pharmacies in the same governorate?',
            );
            const success = pharmacyCityAssignmentService.bulkUpdateCommissionRates(
                selectedAssignments,
                parseFloat(newRate),
                applyToGovernorate,
            );
            if (success) {
                setSelectedAssignments([]);
                loadData();
            }
        }
    };

    const handleDeleteAssignment = async (assignmentId: string) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            const success = pharmacyCityAssignmentService.deleteAssignment(assignmentId);
            if (success) {
                loadData();
            }
        }
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const formatCurrency = (amount: number) => {
        return `EGP ${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'assignments', label: 'Assignments', icon: '🏥' },
        { id: 'coverage', label: 'Coverage Areas', icon: '🗺️' },
        { id: 'commission', label: 'Commission Management', icon: '💰' },
    ];

    if (isLoading && !stats) {
        return (
            <DashboardLayout title="Pharmacy-City Assignments" userType="admin" data-oid="61f2fw-">
                <div className="space-y-6" data-oid="ksv-3o6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="ndojf_p">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-gray-200 animate-pulse rounded-xl h-32"
                                data-oid="vdf.ztz"
                            ></div>
                        ))}
                    </div>
                    <div
                        className="bg-gray-200 animate-pulse rounded-xl h-96"
                        data-oid="_etgwro"
                    ></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Pharmacy-City Assignments" userType="admin" data-oid="ak--62f">
            <div className="space-y-6" data-oid="o7-svc4">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid=".9sdwl4">
                        <DashboardCard
                            title="Total Assignments"
                            value={stats.totalAssignments.toString()}
                            subtitle={`${stats.activeCities} active cities`}
                            gradient={cardGradients.primary}
                            trend={{ value: `${stats.activeCities}`, isPositive: true }}
                            icon="🏥"
                            data-oid="cu.3k.y"
                        />

                        <DashboardCard
                            title="Coverage Area"
                            value={`${stats.totalCoverageArea.toFixed(0)} km²`}
                            subtitle="Total delivery coverage"
                            gradient={cardGradients.success}
                            trend={{ value: '+12.5%', isPositive: true }}
                            icon="🗺️"
                            data-oid="-b90x9c"
                        />

                        <DashboardCard
                            title="Avg Delivery Time"
                            value={`${stats.averageDeliveryTime.toFixed(0)} min`}
                            subtitle="Average across all areas"
                            gradient={cardGradients.warning}
                            trend={{ value: '-5 min', isPositive: true }}
                            icon="⏱️"
                            data-oid="7_35ptr"
                        />

                        <DashboardCard
                            title="Avg Commission"
                            value={`${stats.averageCommissionRate.toFixed(1)}%`}
                            subtitle="Across all assignments"
                            gradient={cardGradients.info}
                            trend={{ value: '+0.5%', isPositive: true }}
                            icon="💰"
                            data-oid="q_q:qae"
                        />
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="border-b border-gray-200" data-oid="xdxp:ak">
                    <nav className="flex space-x-8" data-oid="lpt2_hk">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="lluh_x9"
                            >
                                <span className="mr-2" data-oid="9o9e1ab">
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && stats && (
                    <div className="space-y-6" data-oid="me_.8kj">
                        {/* City Coverage Stats */}
                        <DashboardWidget title="Coverage by City" data-oid="1rabwkr">
                            <div className="space-y-3" data-oid="du2095w">
                                {stats.byCityStats.map((city) => (
                                    <div
                                        key={city.cityId}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        data-oid="n3lr3g3"
                                    >
                                        <div data-oid="c.erni9">
                                            <div
                                                className="font-medium text-gray-900"
                                                data-oid="8zzpouc"
                                            >
                                                {city.cityName}
                                            </div>
                                            <div
                                                className="text-sm text-gray-600"
                                                data-oid="8jf_1vh"
                                            >
                                                {city.pharmacyCount} pharmacies •{' '}
                                                {city.averageCommission.toFixed(1)}% avg commission
                                            </div>
                                        </div>
                                        <div className="text-right" data-oid="r65dz_t">
                                            <div
                                                className="font-semibold text-[#1F1F6F]"
                                                data-oid="32ny-4:"
                                            >
                                                {formatCurrency(city.revenue)}
                                            </div>
                                            <div
                                                className="text-xs text-gray-500"
                                                data-oid="wn7k0:s"
                                            >
                                                {city.totalOrders} orders
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>

                        {/* Governorate Coverage Stats */}
                        <DashboardWidget title="Coverage by Governorate" data-oid="e8hmh3l">
                            <div className="space-y-3" data-oid="oe5ieyz">
                                {stats.byGovernorateStats.map((governorate) => (
                                    <div
                                        key={governorate.governorateId}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        data-oid="n59ty85"
                                    >
                                        <div data-oid="rdayb3.">
                                            <div
                                                className="font-medium text-gray-900"
                                                data-oid="q0ls5t:"
                                            >
                                                {governorate.governorateName}
                                            </div>
                                            <div
                                                className="text-sm text-gray-600"
                                                data-oid="ye50jke"
                                            >
                                                {governorate.pharmacyCount} pharmacies in{' '}
                                                {governorate.cityCount} cities
                                            </div>
                                        </div>
                                        <div className="text-right" data-oid="2fmt9y2">
                                            <div
                                                className="font-semibold text-[#1F1F6F]"
                                                data-oid="9zznr9l"
                                            >
                                                {formatCurrency(governorate.totalRevenue)}
                                            </div>
                                            <div
                                                className="text-xs text-gray-500"
                                                data-oid="cl7l8ze"
                                            >
                                                {governorate.averageCommission.toFixed(1)}% avg
                                                commission
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-6" data-oid="zmq5ut1">
                        <DashboardWidget title="Pharmacy-City Assignments" data-oid="xhc__y5">
                            <div className="space-y-4" data-oid="i6w8iyk">
                                {/* Filters */}
                                <div
                                    className="grid grid-cols-1 md:grid-cols-6 gap-4"
                                    data-oid="bna0dw6"
                                >
                                    <div data-oid="_7iy0od">
                                        <input
                                            type="text"
                                            placeholder="Search assignments..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            value={filters.search || ''}
                                            onChange={(e) =>
                                                handleFilterChange('search', e.target.value)
                                            }
                                            data-oid="p1cmphi"
                                        />
                                    </div>
                                    <div data-oid="-g5r6yp">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            value={filters.status || ''}
                                            onChange={(e) =>
                                                handleFilterChange('status', e.target.value)
                                            }
                                            data-oid="ocmxk25"
                                        >
                                            <option value="" data-oid="fo1kbku">
                                                All Statuses
                                            </option>
                                            <option value="active" data-oid="h0c1eg0">
                                                Active
                                            </option>
                                            <option value="inactive" data-oid="mtpf2n6">
                                                Inactive
                                            </option>
                                        </select>
                                    </div>
                                    <div data-oid="ix6n0vp">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            value={filters.governorateId || ''}
                                            onChange={(e) =>
                                                handleFilterChange('governorateId', e.target.value)
                                            }
                                            data-oid="2rmpzs5"
                                        >
                                            <option value="" data-oid="_jo0o_9">
                                                All Governorates
                                            </option>
                                            {pharmacyCityAssignmentService
                                                .getAvailableGovernorates()
                                                .map((gov) => (
                                                    <option
                                                        key={gov.id}
                                                        value={gov.id}
                                                        data-oid="t_x3s9i"
                                                    >
                                                        {gov.nameEn}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div data-oid="mklb34m">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            value={filters.isPrimary?.toString() || ''}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'isPrimary',
                                                    e.target.value === ''
                                                        ? undefined
                                                        : e.target.value === 'true',
                                                )
                                            }
                                            data-oid="iskc_7o"
                                        >
                                            <option value="" data-oid=":e1g0to">
                                                All Types
                                            </option>
                                            <option value="true" data-oid="g4j6z5c">
                                                Primary Only
                                            </option>
                                            <option value="false" data-oid="d.31iqq">
                                                Secondary Only
                                            </option>
                                        </select>
                                    </div>
                                    <div data-oid="72_jsm-">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            value={filters.sortBy || ''}
                                            onChange={(e) =>
                                                handleFilterChange('sortBy', e.target.value)
                                            }
                                            data-oid="whsd.j7"
                                        >
                                            <option value="" data-oid="81exzbu">
                                                Sort By
                                            </option>
                                            <option value="pharmacy" data-oid="rrpa2ib">
                                                Pharmacy
                                            </option>
                                            <option value="city" data-oid="zma9.dl">
                                                City
                                            </option>
                                            <option value="commission" data-oid="e8fzw92">
                                                Commission
                                            </option>
                                            <option value="deliveryTime" data-oid="s8mandq">
                                                Delivery Time
                                            </option>
                                            <option value="createdAt" data-oid="3cn-fpm">
                                                Created Date
                                            </option>
                                        </select>
                                    </div>
                                    <div className="flex space-x-2" data-oid="hfq22ew">
                                        <button
                                            onClick={() => setFilters({})}
                                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            data-oid="x83yo.p"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={() => setShowAssignmentModal(true)}
                                            className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E]"
                                            data-oid="he30y:9"
                                        >
                                            Add Assignment
                                        </button>
                                    </div>
                                </div>

                                {/* Bulk Actions */}
                                {selectedAssignments.length > 0 && (
                                    <div
                                        className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg"
                                        data-oid="mlkdn-0"
                                    >
                                        <span className="text-sm text-blue-800" data-oid="o.jqdln">
                                            {selectedAssignments.length} assignments selected
                                        </span>
                                        <div className="flex space-x-2" data-oid="ripv0mo">
                                            <button
                                                onClick={handleBulkCommissionUpdate}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                data-oid="ogauei2"
                                            >
                                                Update Commission
                                            </button>
                                            <button
                                                onClick={() => {
                                                    selectedAssignments.forEach((id) =>
                                                        handleToggleStatus(id),
                                                    );
                                                    setSelectedAssignments([]);
                                                }}
                                                className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                                                data-oid="tqwwczt"
                                            >
                                                Toggle Status
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Assignments Table */}
                                <div className="overflow-x-auto" data-oid="6ybor3k">
                                    <table className="w-full border-collapse" data-oid="8glwjd-">
                                        <thead data-oid="kkdor2t">
                                            <tr
                                                className="border-b border-gray-200"
                                                data-oid="y:30vfq"
                                            >
                                                <th className="text-left p-3" data-oid="kqkme3.">
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedAssignments(
                                                                    assignments.map((a) => a.id),
                                                                );
                                                            } else {
                                                                setSelectedAssignments([]);
                                                            }
                                                        }}
                                                        checked={
                                                            selectedAssignments.length ===
                                                                assignments.length &&
                                                            assignments.length > 0
                                                        }
                                                        data-oid="25gw8cr"
                                                    />
                                                </th>
                                                <th
                                                    className="text-left p-3 font-semibold text-gray-900"
                                                    data-oid="p00pw5a"
                                                >
                                                    Pharmacy
                                                </th>
                                                <th
                                                    className="text-left p-3 font-semibold text-gray-900"
                                                    data-oid="-7w5o-n"
                                                >
                                                    Location
                                                </th>
                                                <th
                                                    className="text-left p-3 font-semibold text-gray-900"
                                                    data-oid="vp4b7ql"
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    className="text-left p-3 font-semibold text-gray-900"
                                                    data-oid="rr3eiax"
                                                >
                                                    Coverage
                                                </th>
                                                <th
                                                    className="text-left p-3 font-semibold text-gray-900"
                                                    data-oid=".149dty"
                                                >
                                                    Commission
                                                </th>
                                                <th
                                                    className="text-left p-3 font-semibold text-gray-900"
                                                    data-oid="2_d-hh4"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    className="text-left p-3 font-semibold text-gray-900"
                                                    data-oid="yx5feti"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody data-oid="_hrm3qi">
                                            {isLoading ? (
                                                Array.from({ length: 5 }).map((_, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-gray-100"
                                                        data-oid="61yh5uv"
                                                    >
                                                        <td
                                                            colSpan={8}
                                                            className="p-3"
                                                            data-oid="pxfo.dc"
                                                        >
                                                            <div
                                                                className="bg-gray-200 animate-pulse h-12 rounded"
                                                                data-oid="7vazton"
                                                            ></div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : assignments.length === 0 ? (
                                                <tr data-oid="mw5v9px">
                                                    <td
                                                        colSpan={8}
                                                        className="text-center p-8 text-gray-500"
                                                        data-oid="ha1xdol"
                                                    >
                                                        No assignments found matching your criteria
                                                    </td>
                                                </tr>
                                            ) : (
                                                assignments.map((assignment) => (
                                                    <tr
                                                        key={assignment.id}
                                                        className="border-b border-gray-100 hover:bg-gray-50"
                                                        data-oid="7zunx2g"
                                                    >
                                                        <td className="p-3" data-oid="vng5v8:">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedAssignments.includes(
                                                                    assignment.id,
                                                                )}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedAssignments([
                                                                            ...selectedAssignments,
                                                                            assignment.id,
                                                                        ]);
                                                                    } else {
                                                                        setSelectedAssignments(
                                                                            selectedAssignments.filter(
                                                                                (id) =>
                                                                                    id !==
                                                                                    assignment.id,
                                                                            ),
                                                                        );
                                                                    }
                                                                }}
                                                                data-oid="5f2sf0a"
                                                            />
                                                        </td>
                                                        <td className="p-3" data-oid="tz_kr4b">
                                                            <div
                                                                className="flex items-center space-x-3"
                                                                data-oid="aama8p."
                                                            >
                                                                <div
                                                                    className="w-10 h-10 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center text-sm font-bold"
                                                                    data-oid="8:ly1v9"
                                                                >
                                                                    {assignment.pharmacyName.charAt(
                                                                        0,
                                                                    )}
                                                                </div>
                                                                <div data-oid="6-ejjpw">
                                                                    <div
                                                                        className="font-medium text-gray-900"
                                                                        data-oid="mocs.9s"
                                                                    >
                                                                        {assignment.pharmacyName}
                                                                    </div>
                                                                    <div
                                                                        className="text-sm text-gray-600"
                                                                        data-oid="dv-0oub"
                                                                    >
                                                                        ID: {assignment.pharmacyId}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3" data-oid="atjua:i">
                                                            <div
                                                                className="text-sm"
                                                                data-oid="0_c9n0k"
                                                            >
                                                                <div
                                                                    className="font-medium"
                                                                    data-oid="vi2:dwv"
                                                                >
                                                                    {assignment.cityName}
                                                                </div>
                                                                <div
                                                                    className="text-gray-600"
                                                                    data-oid="t-erh:r"
                                                                >
                                                                    {assignment.governorateName}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3" data-oid="5q1smga">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    assignment.isPrimary
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                                data-oid="-ru_ygw"
                                                            >
                                                                {assignment.isPrimary
                                                                    ? 'Primary'
                                                                    : 'Secondary'}
                                                            </span>
                                                        </td>
                                                        <td className="p-3" data-oid="fzdayyp">
                                                            <div
                                                                className="text-sm"
                                                                data-oid="kx-wwy_"
                                                            >
                                                                <div
                                                                    className="font-medium"
                                                                    data-oid="_r:mhg9"
                                                                >
                                                                    {assignment.deliveryRadius} km
                                                                    radius
                                                                </div>
                                                                <div
                                                                    className="text-gray-600"
                                                                    data-oid="dz.o-xh"
                                                                >
                                                                    {
                                                                        assignment.estimatedDeliveryTime
                                                                    }
                                                                </div>
                                                                <div
                                                                    className="text-xs text-gray-500"
                                                                    data-oid="gob_caz"
                                                                >
                                                                    {formatCurrency(
                                                                        assignment.deliveryFee,
                                                                    )}{' '}
                                                                    delivery fee
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3" data-oid="ygcrda3">
                                                            <div
                                                                className="text-sm"
                                                                data-oid="pdahrvg"
                                                            >
                                                                <div
                                                                    className="font-semibold text-[#1F1F6F]"
                                                                    data-oid="wkhwy0b"
                                                                >
                                                                    {assignment.commissionRate}%
                                                                </div>
                                                                <div
                                                                    className="text-xs text-gray-500"
                                                                    data-oid="rm0yw9j"
                                                                >
                                                                    Min order:{' '}
                                                                    {formatCurrency(
                                                                        assignment.minimumOrderAmount,
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3" data-oid="qk:hiat">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.isActive)}`}
                                                                data-oid="9oz02m_"
                                                            >
                                                                {assignment.isActive
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="p-3" data-oid="91wjkqo">
                                                            <div
                                                                className="flex space-x-2"
                                                                data-oid="p_zdwkg"
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedAssignment(
                                                                            assignment,
                                                                        );
                                                                        setShowAssignmentModal(
                                                                            true,
                                                                        );
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                                    data-oid="n2l1chs"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleToggleStatus(
                                                                            assignment.id,
                                                                        )
                                                                    }
                                                                    className="text-orange-600 hover:text-orange-800 text-sm"
                                                                    data-oid="ah8nu6u"
                                                                >
                                                                    {assignment.isActive
                                                                        ? 'Deactivate'
                                                                        : 'Activate'}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteAssignment(
                                                                            assignment.id,
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                                    data-oid="9ui0wqx"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div
                                    className="flex items-center justify-between pt-4"
                                    data-oid="iq513z_"
                                >
                                    <div className="text-sm text-gray-600" data-oid="wap8gmw">
                                        Showing {assignments.length} of{' '}
                                        {stats?.totalAssignments || 0} assignments
                                    </div>
                                    <div className="flex space-x-2" data-oid="zfw-tg-">
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                                            data-oid="rf6c5:2"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-[#1F1F6F] text-white rounded text-sm"
                                            data-oid="3cee-kl"
                                        >
                                            1
                                        </button>
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                                            data-oid="zkkt7s-"
                                        >
                                            2
                                        </button>
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                                            data-oid="zvcb06o"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {activeTab === 'coverage' && (
                    <div className="space-y-6" data-oid="e2_dxwf">
                        <DashboardWidget title="Coverage Area Management" data-oid="_mozeu0">
                            <div className="space-y-4" data-oid="mzlh8bb">
                                <div className="text-center p-8 text-gray-500" data-oid="t2t1xul">
                                    <div className="text-6xl mb-4" data-oid="ctwd8a5">
                                        🗺️
                                    </div>
                                    <h3
                                        className="text-lg font-medium text-gray-900 mb-2"
                                        data-oid="fz_y1gz"
                                    >
                                        Coverage Area Visualization
                                    </h3>
                                    <p className="text-gray-600" data-oid="4lh8u6r">
                                        Interactive map showing pharmacy coverage areas will be
                                        implemented here. This will include delivery zones, radius
                                        visualization, and area management tools.
                                    </p>
                                </div>
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {activeTab === 'commission' && (
                    <div className="space-y-6" data-oid="f8ncd8b">
                        <DashboardWidget title="Commission Management" data-oid="y7tyy7l">
                            <div className="space-y-4" data-oid="tusw780">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    data-oid="7:ejpo_"
                                >
                                    {/* Commission by City */}
                                    <div className="bg-gray-50 rounded-lg p-4" data-oid="v0mvo-w">
                                        <h4
                                            className="font-medium text-gray-900 mb-3"
                                            data-oid="7uxt.37"
                                        >
                                            Commission Rates by City
                                        </h4>
                                        <div className="space-y-2" data-oid="sz_16ki">
                                            {stats?.byCityStats.map((city) => (
                                                <div
                                                    key={city.cityId}
                                                    className="flex items-center justify-between"
                                                    data-oid="tzcf4fi"
                                                >
                                                    <span
                                                        className="text-sm text-gray-600"
                                                        data-oid="a_ldjbl"
                                                    >
                                                        {city.cityName}
                                                    </span>
                                                    <span
                                                        className="font-medium text-[#1F1F6F]"
                                                        data-oid="p.hh0wg"
                                                    >
                                                        {city.averageCommission.toFixed(1)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Commission by Governorate */}
                                    <div className="bg-gray-50 rounded-lg p-4" data-oid="gngjeoe">
                                        <h4
                                            className="font-medium text-gray-900 mb-3"
                                            data-oid="ig.2.r2"
                                        >
                                            Commission Rates by Governorate
                                        </h4>
                                        <div className="space-y-2" data-oid="ga_7pmf">
                                            {stats?.byGovernorateStats.map((governorate) => (
                                                <div
                                                    key={governorate.governorateId}
                                                    className="flex items-center justify-between"
                                                    data-oid="9x8gtfd"
                                                >
                                                    <span
                                                        className="text-sm text-gray-600"
                                                        data-oid=".o6b6en"
                                                    >
                                                        {governorate.governorateName}
                                                    </span>
                                                    <span
                                                        className="font-medium text-[#1F1F6F]"
                                                        data-oid="k_nij-i"
                                                    >
                                                        {governorate.averageCommission.toFixed(1)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Commission Update Tools */}
                                <div className="bg-blue-50 rounded-lg p-4" data-oid="m.0:p52">
                                    <h4
                                        className="font-medium text-gray-900 mb-3"
                                        data-oid="yd7phq:"
                                    >
                                        Bulk Commission Updates
                                    </h4>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        data-oid="exz_8yu"
                                    >
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            data-oid="6too_9k"
                                        >
                                            Update by City
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            data-oid="9b5271q"
                                        >
                                            Update by Governorate
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                            data-oid="zx1ccq5"
                                        >
                                            Update by Pharmacy Type
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* Assignment Modal */}
                <PharmacyAssignmentModal
                    isOpen={showAssignmentModal}
                    onClose={() => {
                        setShowAssignmentModal(false);
                        setSelectedAssignment(null);
                    }}
                    assignment={selectedAssignment}
                    onSave={loadData}
                    data-oid="1p_ni-u"
                />
            </div>
        </DashboardLayout>
    );
}
