'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard, cardGradients } from '@/components/dashboard/DashboardCard';
import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import {
    databaseInputUserManagementService,
    DatabaseInputUserDetails,
    DatabaseInputUserFilters,
    DatabaseInputUserStats,
    DatabaseInputTask,
} from '@/lib/services/databaseInputUserManagementService';

export default function AdminDatabaseUsersPage() {
    const [activeTab, setActiveTab] = useState<
        'overview' | 'users' | 'tasks' | 'performance' | 'training'
    >('overview');
    const [users, setUsers] = useState<DatabaseInputUserDetails[]>([]);
    const [stats, setStats] = useState<DatabaseInputUserStats | null>(null);
    const [tasks, setTasks] = useState<DatabaseInputTask[]>([]);
    const [filters, setFilters] = useState<DatabaseInputUserFilters>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const loadData = async () => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUsers(databaseInputUserManagementService.getDatabaseInputUsers(filters));
        setStats(databaseInputUserManagementService.getDatabaseInputUserStats());
        setTasks(databaseInputUserManagementService.getTasks());

        setIsLoading(false);
    };

    const handleStatusChange = async (
        userId: string,
        newStatus: DatabaseInputUserDetails['status'],
        reason?: string,
    ) => {
        const success = databaseInputUserManagementService.updateUserStatus(
            userId,
            newStatus,
            reason,
        );
        if (success) {
            await loadData();
        }
    };

    const handlePermissionUpdate = async (
        userId: string,
        permissions: Partial<DatabaseInputUserDetails['permissions']>,
    ) => {
        const success = databaseInputUserManagementService.updateUserPermissions(
            userId,
            permissions,
        );
        if (success) {
            await loadData();
        }
    };

    const handleBulkAction = async (action: string) => {
        // Implement bulk actions
        console.log(`Bulk action: ${action} for users:`, selectedUsers);
        setSelectedUsers([]);
        await loadData();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'suspended':
                return 'bg-orange-100 text-orange-800';
            case 'training':
                return 'bg-blue-100 text-blue-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return '✅';
            case 'pending':
                return '⏳';
            case 'suspended':
                return '⚠️';
            case 'training':
                return '📚';
            case 'inactive':
                return '⚪';
            default:
                return '⚪';
        }
    };

    const getAccessLevelIcon = (level: string) => {
        switch (level) {
            case 'basic':
                return '👤';
            case 'advanced':
                return '👨‍💼';
            case 'supervisor':
                return '👨‍💻';
            case 'manager':
                return '👨‍💼';
            default:
                return '👤';
        }
    };

    const getTaskPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTaskStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'on_hold':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading || !stats) {
        return (
            <DashboardLayout
                title="Database Input User Management"
                userType="admin"
                data-oid="x.ete8h"
            >
                <div className="space-y-6" data-oid="e6s4s.4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="tp0_ld5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-gray-200 animate-pulse rounded-xl h-32"
                                data-oid="lmwwe4h"
                            ></div>
                        ))}
                    </div>
                    <div
                        className="bg-gray-200 animate-pulse rounded-xl h-96"
                        data-oid="uhz3a.p"
                    ></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Database Input User Management" userType="admin" data-oid="6abk0sf">
            <div className="space-y-6" data-oid="iie_k0-">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200" data-oid="jkc.7q6">
                    <nav className="-mb-px flex space-x-8" data-oid="n0xu6r.">
                        {[
                            { id: 'overview', label: 'Overview', icon: '📊' },
                            { id: 'users', label: 'Users', icon: '👥' },
                            { id: 'tasks', label: 'Tasks', icon: '📋' },
                            { id: 'performance', label: 'Performance', icon: '📈' },
                            { id: 'training', label: 'Training', icon: '📚' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                data-oid="dgw31y4"
                            >
                                <span className="mr-2" data-oid=":7-old_">
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6" data-oid="yudgw3y">
                        {/* Main KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="rnhxn5y">
                            <DashboardCard
                                title="Total Users"
                                value={stats.total.toString()}
                                subtitle={`${stats.active} active users`}
                                gradient={cardGradients.primary}
                                trend={{ value: `+${stats.growth}%`, isPositive: true }}
                                icon="👥"
                                data-oid="n-9aubi"
                            />

                            <DashboardCard
                                title="Products Processed"
                                value={stats.totalProductsProcessed.toLocaleString()}
                                subtitle="All time total"
                                gradient={cardGradients.secondary}
                                trend={{ value: `+${stats.totalTasksCompleted}`, isPositive: true }}
                                icon="📦"
                                data-oid="pfgr-l5"
                            />

                            <DashboardCard
                                title="Average Productivity"
                                value={`${stats.averageProductivity.toFixed(1)}%`}
                                subtitle="Team performance"
                                gradient={cardGradients.tertiary}
                                trend={{ value: '+5.2%', isPositive: true }}
                                icon="📈"
                                data-oid=":a47qga"
                            />

                            <DashboardCard
                                title="Average Accuracy"
                                value={`${stats.averageAccuracy.toFixed(1)}%`}
                                subtitle="Data quality"
                                gradient={cardGradients.quaternary}
                                trend={{ value: '+2.1%', isPositive: true }}
                                icon="🎯"
                                data-oid="3ar:opf"
                            />
                        </div>

                        {/* Secondary KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-oid="bdorr0u">
                            <DashboardCard
                                title="In Training"
                                value={stats.byStatus.training.toString()}
                                subtitle="Users in training"
                                gradient={cardGradients.info}
                                trend={{ value: `+${stats.recentHires}`, isPositive: true }}
                                icon="📚"
                                data-oid="5-sg2j4"
                            />

                            <DashboardCard
                                title="Monthly Targets"
                                value={`${stats.monthlyTargets.percentage.toFixed(1)}%`}
                                subtitle="Target achievement"
                                gradient={cardGradients.success}
                                trend={{
                                    value: `${stats.monthlyTargets.achieved}/${stats.monthlyTargets.totalTargets}`,
                                    isPositive: true,
                                }}
                                icon="🎯"
                                data-oid="9mb1csi"
                            />

                            <DashboardCard
                                title="Tasks Completed"
                                value={stats.totalTasksCompleted.toString()}
                                subtitle="This month"
                                gradient={cardGradients.warning}
                                trend={{ value: '+15.3%', isPositive: true }}
                                icon="✅"
                                data-oid="pd:4yxs"
                            />
                        </div>

                        {/* Performance Analytics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="3f_:0ys">
                            {/* Top Performers */}
                            <DashboardWidget title="Top Performers" data-oid="g244gl0">
                                <div className="space-y-4" data-oid="2pc5:8t">
                                    {stats.topPerformers.map((user, index) => (
                                        <div
                                            key={user.userId}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            data-oid="s7oddvv"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="v79xo15"
                                            >
                                                <div
                                                    className="w-8 h-8 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center text-sm font-bold"
                                                    data-oid="g5jviur"
                                                >
                                                    {index + 1}
                                                </div>
                                                <div data-oid="twbmsrc">
                                                    <p
                                                        className="font-medium text-gray-900"
                                                        data-oid="qy0:uvu"
                                                    >
                                                        {user.userName}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="iw2_kz2"
                                                    >
                                                        {user.specialization} •{' '}
                                                        {user.tasksCompleted} tasks
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right" data-oid="o2rjc41">
                                                <p
                                                    className="font-bold text-[#1F1F6F]"
                                                    data-oid="ryhvavt"
                                                >
                                                    {user.productivity.toFixed(1)}%
                                                </p>
                                                <p
                                                    className="text-sm text-green-600"
                                                    data-oid="n7_jnr2"
                                                >
                                                    {user.accuracy.toFixed(1)}% accuracy
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardWidget>

                            {/* Access Level Breakdown */}
                            <DashboardWidget title="Users by Access Level" data-oid="p:lt4_r">
                                <div className="space-y-4" data-oid="6n3wun4">
                                    {stats.byAccessLevel.map((level) => (
                                        <div
                                            key={level.level}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            data-oid="_nh7tlk"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="ppf_3xh"
                                            >
                                                <span className="text-2xl" data-oid="6azqxtc">
                                                    {getAccessLevelIcon(level.level)}
                                                </span>
                                                <div data-oid="j93yyqa">
                                                    <p
                                                        className="font-medium text-gray-900 capitalize"
                                                        data-oid="qh-4o4f"
                                                    >
                                                        {level.level}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="hqgsifu"
                                                    >
                                                        {level.count} users •{' '}
                                                        {level.productivity.toFixed(1)}%
                                                        productivity
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right" data-oid="bfk2ykp">
                                                <p
                                                    className="font-bold text-[#1F1F6F]"
                                                    data-oid="ofzm3_2"
                                                >
                                                    {level.accuracy.toFixed(1)}%
                                                </p>
                                                <p
                                                    className="text-sm text-green-600"
                                                    data-oid=":jhf05w"
                                                >
                                                    Accuracy
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardWidget>
                        </div>

                        {/* Department Performance */}
                        <DashboardWidget title="Performance by Department" data-oid="vix6iyi">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="0za_g49"
                            >
                                {stats.byDepartment.map((dept) => (
                                    <div
                                        key={dept.department}
                                        className="p-4 border border-gray-200 rounded-lg"
                                        data-oid="jyvjs0j"
                                    >
                                        <h4
                                            className="font-medium text-gray-900"
                                            data-oid=":mc2888"
                                        >
                                            {dept.department}
                                        </h4>
                                        <div className="mt-2 space-y-1" data-oid="e82siyg">
                                            <p className="text-sm text-gray-600" data-oid="vielvq.">
                                                {dept.count} users
                                            </p>
                                            <p className="text-sm text-gray-600" data-oid="tf4q3ae">
                                                {dept.tasksCompleted} tasks completed
                                            </p>
                                            <p
                                                className="text-sm font-medium text-[#1F1F6F]"
                                                data-oid="dm:zb9d"
                                            >
                                                {dept.productivity.toFixed(1)}% productivity
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>

                        {/* Specialization Performance */}
                        <DashboardWidget title="Performance by Specialization" data-oid="eb2s-d0">
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                data-oid="lrmdy91"
                            >
                                {stats.bySpecialization.map((spec) => (
                                    <div
                                        key={spec.specialization}
                                        className="p-4 border border-gray-200 rounded-lg"
                                        data-oid="o6hhqhl"
                                    >
                                        <h4
                                            className="font-medium text-gray-900 capitalize"
                                            data-oid="p1_r6.u"
                                        >
                                            {spec.specialization.replace('_', ' ')}
                                        </h4>
                                        <div className="mt-2 space-y-1" data-oid="ca1xr40">
                                            <p className="text-sm text-gray-600" data-oid="h3v:n49">
                                                {spec.userCount} users
                                            </p>
                                            <p className="text-sm text-gray-600" data-oid="jl55gks">
                                                {spec.productsProcessed} products
                                            </p>
                                            <p
                                                className="text-sm font-medium text-[#1F1F6F]"
                                                data-oid="ozez2.r"
                                            >
                                                {spec.accuracy.toFixed(1)}% accuracy
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6" data-oid="lt:j0qd">
                        {/* Filters and Search */}
                        <div
                            className="bg-white p-6 rounded-lg border border-gray-200"
                            data-oid="c-m2904"
                        >
                            <div
                                className="grid grid-cols-1 md:grid-cols-5 gap-4"
                                data-oid="m9lgb.u"
                            >
                                <div data-oid="-dl:cii">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="770i9kc"
                                    >
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F1F6F]"
                                        value={filters.search || ''}
                                        onChange={(e) =>
                                            setFilters({ ...filters, search: e.target.value })
                                        }
                                        data-oid="jddrlkj"
                                    />
                                </div>
                                <div data-oid="csk-b4e">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="wivm6br"
                                    >
                                        Status
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F1F6F]"
                                        value={filters.status || ''}
                                        onChange={(e) =>
                                            setFilters({ ...filters, status: e.target.value })
                                        }
                                        data-oid="5apbly9"
                                    >
                                        <option value="" data-oid="v-7vn.h">
                                            All Statuses
                                        </option>
                                        <option value="active" data-oid="td5njth">
                                            Active
                                        </option>
                                        <option value="pending" data-oid="wjx46f.">
                                            Pending
                                        </option>
                                        <option value="suspended" data-oid="j-i963k">
                                            Suspended
                                        </option>
                                        <option value="training" data-oid="2n-cwyd">
                                            Training
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="jf.xuav">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="em804yf"
                                    >
                                        Access Level
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F1F6F]"
                                        value={filters.accessLevel || ''}
                                        onChange={(e) =>
                                            setFilters({ ...filters, accessLevel: e.target.value })
                                        }
                                        data-oid="jnh:fhx"
                                    >
                                        <option value="" data-oid="2b4zmk1">
                                            All Levels
                                        </option>
                                        {databaseInputUserManagementService
                                            .getAccessLevels()
                                            .map((level) => (
                                                <option
                                                    key={level.value}
                                                    value={level.value}
                                                    data-oid="v50x1yy"
                                                >
                                                    {level.label}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div data-oid="k3o2-fn">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="3e8hejl"
                                    >
                                        Department
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F1F6F]"
                                        value={filters.department || ''}
                                        onChange={(e) =>
                                            setFilters({ ...filters, department: e.target.value })
                                        }
                                        data-oid="uucg:ur"
                                    >
                                        <option value="" data-oid="cp1qz7v">
                                            All Departments
                                        </option>
                                        {databaseInputUserManagementService
                                            .getDepartments()
                                            .map((dept) => (
                                                <option
                                                    key={dept.value}
                                                    value={dept.label}
                                                    data-oid="ifjm9oz"
                                                >
                                                    {dept.label}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex items-end" data-oid="bq-pi--">
                                    <button
                                        onClick={() => setFilters({})}
                                        className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                        data-oid="z4wvqlf"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedUsers.length > 0 && (
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                data-oid="i3ogs:w"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    data-oid=".n3rzj_"
                                >
                                    <span className="text-sm text-blue-800" data-oid="tk33bd8">
                                        {selectedUsers.length} user(s) selected
                                    </span>
                                    <div className="space-x-2" data-oid="1gkiib8">
                                        <button
                                            onClick={() => handleBulkAction('activate')}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                            data-oid=":qfnppc"
                                        >
                                            Activate
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('suspend')}
                                            className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                                            data-oid="msgak34"
                                        >
                                            Suspend
                                        </button>
                                        <button
                                            onClick={() => setSelectedUsers([])}
                                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                                            data-oid="6sb0bv9"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Table */}
                        <div
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                            data-oid="y8ck88x"
                        >
                            <div className="overflow-x-auto" data-oid="7mz1m_o">
                                <table
                                    className="min-w-full divide-y divide-gray-200"
                                    data-oid="uuob18f"
                                >
                                    <thead className="bg-gray-50" data-oid="yszkzmj">
                                        <tr data-oid=":g.ikrc">
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="u_hq:9o"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.length === users.length}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedUsers(
                                                                users.map((u) => u.id),
                                                            );
                                                        } else {
                                                            setSelectedUsers([]);
                                                        }
                                                    }}
                                                    data-oid="o_00oyi"
                                                />
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="a800f3i"
                                            >
                                                User
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="qikziqi"
                                            >
                                                Role & Access
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid=".xdduef"
                                            >
                                                Performance
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="pp1ptwu"
                                            >
                                                Specializations
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="e48ppn4"
                                            >
                                                Status
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                data-oid="tx0-.49"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-gray-200"
                                        data-oid="sbrc:9c"
                                    >
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50"
                                                data-oid="i0jdk0c"
                                            >
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="3dnucqq"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedUsers([
                                                                    ...selectedUsers,
                                                                    user.id,
                                                                ]);
                                                            } else {
                                                                setSelectedUsers(
                                                                    selectedUsers.filter(
                                                                        (id) => id !== user.id,
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                        data-oid="nkpsg8w"
                                                    />
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="7h.c6uh"
                                                >
                                                    <div
                                                        className="flex items-center"
                                                        data-oid="h9stw9g"
                                                    >
                                                        <div
                                                            className="w-10 h-10 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center text-sm font-bold"
                                                            data-oid="pwxrhyi"
                                                        >
                                                            {user.name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')}
                                                        </div>
                                                        <div className="ml-4" data-oid="bgp0ey3">
                                                            <div
                                                                className="text-sm font-medium text-gray-900"
                                                                data-oid="dxsd.ym"
                                                            >
                                                                {user.name}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="ej5fqf-"
                                                            >
                                                                {user.email}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="6gabhz2"
                                                            >
                                                                {user.employeeId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="bmswjou"
                                                >
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="-6ryst6"
                                                    >
                                                        <span
                                                            className="text-lg"
                                                            data-oid="3rrfwzp"
                                                        >
                                                            {getAccessLevelIcon(user.accessLevel)}
                                                        </span>
                                                        <div data-oid="dcnaf6s">
                                                            <div
                                                                className="text-sm text-gray-900"
                                                                data-oid="68v5514"
                                                            >
                                                                {user.position}
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500 capitalize"
                                                                data-oid="63aqq_e"
                                                            >
                                                                {user.accessLevel} •{' '}
                                                                {user.department}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="pca08b5"
                                                >
                                                    <div
                                                        className="text-sm text-gray-900"
                                                        data-oid="vi2hcjw"
                                                    >
                                                        {user.performance.productivityScore.toFixed(
                                                            1,
                                                        )}
                                                        % productivity
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="oumva9j"
                                                    >
                                                        {user.performance.accuracyRate.toFixed(1)}%
                                                        accuracy
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-500"
                                                        data-oid="k8v3okv"
                                                    >
                                                        {user.performance.totalProductsAdded +
                                                            user.performance
                                                                .totalProductsEdited}{' '}
                                                        products
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="57g_aqg"
                                                >
                                                    <div
                                                        className="flex flex-wrap gap-1"
                                                        data-oid="cw46w6:"
                                                    >
                                                        {user.specializations
                                                            .slice(0, 2)
                                                            .map((spec) => (
                                                                <span
                                                                    key={spec}
                                                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                                    data-oid="4izz3o."
                                                                >
                                                                    {spec.replace('_', ' ')}
                                                                </span>
                                                            ))}
                                                        {user.specializations.length > 2 && (
                                                            <span
                                                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                                                data-oid="u3lv0v:"
                                                            >
                                                                +{user.specializations.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap"
                                                    data-oid="xxj6pse"
                                                >
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                                                        data-oid="8y0pzkd"
                                                    >
                                                        {getStatusIcon(user.status)} {user.status}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                                    data-oid="88jo6mm"
                                                >
                                                    <div
                                                        className="flex space-x-2"
                                                        data-oid="1dlw4sq"
                                                    >
                                                        {user.status === 'pending' && (
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        user.id,
                                                                        'active',
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900"
                                                                data-oid="y6c2ld3"
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                        {user.status === 'active' && (
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        user.id,
                                                                        'suspended',
                                                                        'Suspended by admin',
                                                                    )
                                                                }
                                                                className="text-orange-600 hover:text-orange-900"
                                                                data-oid=":cgnwv:"
                                                            >
                                                                Suspend
                                                            </button>
                                                        )}
                                                        {user.status === 'suspended' && (
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        user.id,
                                                                        'active',
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900"
                                                                data-oid="h.:d6sd"
                                                            >
                                                                Reactivate
                                                            </button>
                                                        )}
                                                        <button
                                                            className="text-[#1F1F6F] hover:text-[#14274E]"
                                                            data-oid="h9biv89"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between" data-oid="8pg7dkp">
                            <div className="text-sm text-gray-700" data-oid="h2.afsv">
                                Showing {users.length} of {stats.total} users
                            </div>
                            <div className="flex space-x-2" data-oid="gr3.4mn">
                                <button
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                                    data-oid="8neuyj4"
                                >
                                    Previous
                                </button>
                                <button
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                                    data-oid="m8pulh1"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="space-y-6" data-oid="ihw9b_k">
                        <DashboardWidget title="Active Tasks" data-oid="k8ch9-y">
                            <div className="space-y-4" data-oid="8j_.boi">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="border border-gray-200 rounded-lg p-4"
                                        data-oid="1a6pwvs"
                                    >
                                        <div
                                            className="flex items-start justify-between"
                                            data-oid="byq-2m_"
                                        >
                                            <div className="flex-1" data-oid="u_6al.b">
                                                <div
                                                    className="flex items-center space-x-3"
                                                    data-oid="7.2-1ge"
                                                >
                                                    <h3
                                                        className="text-lg font-medium text-gray-900"
                                                        data-oid="l_.c_zu"
                                                    >
                                                        {task.title}
                                                    </h3>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskPriorityColor(task.priority)}`}
                                                        data-oid="f-bsp7x"
                                                    >
                                                        {task.priority}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}
                                                        data-oid="sh7d2d4"
                                                    >
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-sm text-gray-600 mt-1"
                                                    data-oid="-u8ix4:"
                                                >
                                                    {task.description}
                                                </p>

                                                <div
                                                    className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4"
                                                    data-oid="fda_pvy"
                                                >
                                                    <div data-oid="v49ynrj">
                                                        <h4
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="wmxdq3k"
                                                        >
                                                            Assigned To
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="5tga_ri"
                                                        >
                                                            {users.find(
                                                                (u) => u.id === task.assignedTo,
                                                            )?.name || 'Unknown'}
                                                        </p>
                                                    </div>
                                                    <div data-oid="vq0.4qr">
                                                        <h4
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="c9k2db8"
                                                        >
                                                            Category
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600 capitalize"
                                                            data-oid="0tw2bh2"
                                                        >
                                                            {task.category}
                                                        </p>
                                                    </div>
                                                    <div data-oid="7g48_p5">
                                                        <h4
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="xjeuo52"
                                                        >
                                                            Due Date
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="vx7d7.s"
                                                        >
                                                            {new Date(
                                                                task.dueDate,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div data-oid="n67qj_5">
                                                        <h4
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="bcz7-7o"
                                                        >
                                                            Progress
                                                        </h4>
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="q81h15t"
                                                        >
                                                            <div
                                                                className="flex-1 bg-gray-200 rounded-full h-2"
                                                                data-oid="fy0l73u"
                                                            >
                                                                <div
                                                                    className="bg-[#1F1F6F] h-2 rounded-full"
                                                                    style={{
                                                                        width: `${task.progress}%`,
                                                                    }}
                                                                    data-oid="17hts49"
                                                                ></div>
                                                            </div>
                                                            <span
                                                                className="text-sm text-gray-600"
                                                                data-oid="qwwgmos"
                                                            >
                                                                {task.progress}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-3" data-oid="t-q8bt7">
                                                    <h4
                                                        className="text-sm font-medium text-gray-700"
                                                        data-oid="sh-_swx"
                                                    >
                                                        Requirements
                                                    </h4>
                                                    <div
                                                        className="mt-1 flex flex-wrap gap-1"
                                                        data-oid="8rbv627"
                                                    >
                                                        {task.requirements.map((req, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                                                data-oid="r6k.w1a"
                                                            >
                                                                {req}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="ml-6 flex flex-col space-y-2"
                                                data-oid="dbsdnmx"
                                            >
                                                {task.status === 'pending' && (
                                                    <button
                                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                        data-oid="eswxvv5"
                                                    >
                                                        Start Task
                                                    </button>
                                                )}
                                                {task.status === 'in_progress' && (
                                                    <button
                                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                        data-oid="w3c:wgc"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                <button
                                                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                                                    data-oid="lgd3q.q"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {tasks.length === 0 && (
                                    <div className="text-center py-8" data-oid="k3r.w4p">
                                        <p className="text-gray-500" data-oid="bwqgdi0">
                                            No active tasks
                                        </p>
                                    </div>
                                )}
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                    <div className="space-y-6" data-oid="_3plau2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="b-fmy9h">
                            <DashboardWidget title="Individual Performance" data-oid="5qduwc_">
                                <div className="space-y-4" data-oid="g3xn68i">
                                    {users
                                        .filter((u) => u.status === 'active')
                                        .map((user) => (
                                            <div
                                                key={user.id}
                                                className="p-4 border border-gray-200 rounded-lg"
                                                data-oid="d9dah-4"
                                            >
                                                <div
                                                    className="flex items-center justify-between"
                                                    data-oid="cdm6y8i"
                                                >
                                                    <div data-oid="86xlvvi">
                                                        <h4
                                                            className="font-medium text-gray-900"
                                                            data-oid="onw-ci6"
                                                        >
                                                            {user.name}
                                                        </h4>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="x.2vuu-"
                                                        >
                                                            {user.position}
                                                        </p>
                                                    </div>
                                                    <div className="text-right" data-oid="fghsxql">
                                                        <p
                                                            className="font-bold text-[#1F1F6F]"
                                                            data-oid="h3fcn98"
                                                        >
                                                            {user.performance.productivityScore.toFixed(
                                                                1,
                                                            )}
                                                            %
                                                        </p>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="qj252hn"
                                                        >
                                                            Productivity
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="mt-3 grid grid-cols-3 gap-4 text-sm"
                                                    data-oid="rci5tt:"
                                                >
                                                    <div data-oid="bo3t1-s">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="jwldln9"
                                                        >
                                                            Accuracy
                                                        </p>
                                                        <p
                                                            className="font-medium"
                                                            data-oid="uvh3ti-"
                                                        >
                                                            {user.performance.accuracyRate.toFixed(
                                                                1,
                                                            )}
                                                            %
                                                        </p>
                                                    </div>
                                                    <div data-oid="cn_:v8z">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="j314gd6"
                                                        >
                                                            Products
                                                        </p>
                                                        <p
                                                            className="font-medium"
                                                            data-oid="_r0l50l"
                                                        >
                                                            {user.performance.totalProductsAdded +
                                                                user.performance
                                                                    .totalProductsEdited}
                                                        </p>
                                                    </div>
                                                    <div data-oid="7mbjrx-">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="582fgr-"
                                                        >
                                                            Avg Time
                                                        </p>
                                                        <p
                                                            className="font-medium"
                                                            data-oid="jq64b6o"
                                                        >
                                                            {user.performance.averageProcessingTime.toFixed(
                                                                1,
                                                            )}
                                                            m
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </DashboardWidget>

                            <DashboardWidget title="Quality Metrics" data-oid="u017-1k">
                                <div className="space-y-4" data-oid="ltfwp4z">
                                    {users
                                        .filter((u) => u.status === 'active')
                                        .map((user) => (
                                            <div
                                                key={user.id}
                                                className="p-4 border border-gray-200 rounded-lg"
                                                data-oid="8:niaog"
                                            >
                                                <h4
                                                    className="font-medium text-gray-900 mb-3"
                                                    data-oid="f8w790r"
                                                >
                                                    {user.name}
                                                </h4>
                                                <div
                                                    className="grid grid-cols-2 gap-4 text-sm"
                                                    data-oid="tdjj4e-"
                                                >
                                                    <div data-oid="b0iwj:x">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="wtd0biu"
                                                        >
                                                            Data Accuracy
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="k9-trw2"
                                                        >
                                                            <div
                                                                className="flex-1 bg-gray-200 rounded-full h-2"
                                                                data-oid="xcda94t"
                                                            >
                                                                <div
                                                                    className="bg-green-500 h-2 rounded-full"
                                                                    style={{
                                                                        width: `${user.performance.qualityMetrics.dataAccuracy}%`,
                                                                    }}
                                                                    data-oid="k2wiy5p"
                                                                ></div>
                                                            </div>
                                                            <span
                                                                className="text-xs"
                                                                data-oid="45n312s"
                                                            >
                                                                {user.performance.qualityMetrics.dataAccuracy.toFixed(
                                                                    1,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-oid="l2:zbku">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="s4vz8tj"
                                                        >
                                                            Completeness
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="rest-g1"
                                                        >
                                                            <div
                                                                className="flex-1 bg-gray-200 rounded-full h-2"
                                                                data-oid="q2icty5"
                                                            >
                                                                <div
                                                                    className="bg-blue-500 h-2 rounded-full"
                                                                    style={{
                                                                        width: `${user.performance.qualityMetrics.completenessScore}%`,
                                                                    }}
                                                                    data-oid="pmss1i_"
                                                                ></div>
                                                            </div>
                                                            <span
                                                                className="text-xs"
                                                                data-oid="bmouv19"
                                                            >
                                                                {user.performance.qualityMetrics.completenessScore.toFixed(
                                                                    1,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-oid="yk_t5hm">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="hnxb-f_"
                                                        >
                                                            Consistency
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="w48vnzt"
                                                        >
                                                            <div
                                                                className="flex-1 bg-gray-200 rounded-full h-2"
                                                                data-oid="m:h-::_"
                                                            >
                                                                <div
                                                                    className="bg-purple-500 h-2 rounded-full"
                                                                    style={{
                                                                        width: `${user.performance.qualityMetrics.consistencyScore}%`,
                                                                    }}
                                                                    data-oid="qshp7np"
                                                                ></div>
                                                            </div>
                                                            <span
                                                                className="text-xs"
                                                                data-oid="v1gu8wl"
                                                            >
                                                                {user.performance.qualityMetrics.consistencyScore.toFixed(
                                                                    1,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-oid=":yynlad">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="8u7krf."
                                                        >
                                                            Error Rate
                                                        </p>
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="7on663e"
                                                        >
                                                            <div
                                                                className="flex-1 bg-gray-200 rounded-full h-2"
                                                                data-oid="cw1n8w4"
                                                            >
                                                                <div
                                                                    className="bg-red-500 h-2 rounded-full"
                                                                    style={{
                                                                        width: `${user.performance.qualityMetrics.errorRate}%`,
                                                                    }}
                                                                    data-oid="m40qje."
                                                                ></div>
                                                            </div>
                                                            <span
                                                                className="text-xs"
                                                                data-oid="y7myiw6"
                                                            >
                                                                {user.performance.qualityMetrics.errorRate.toFixed(
                                                                    1,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </DashboardWidget>
                        </div>
                    </div>
                )}

                {/* Training Tab */}
                {activeTab === 'training' && (
                    <div className="space-y-6" data-oid="4de:yt0">
                        <DashboardWidget title="Training Status" data-oid="jxscrf6">
                            <div className="space-y-4" data-oid="c3bd9w_">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="border border-gray-200 rounded-lg p-4"
                                        data-oid="54m35.c"
                                    >
                                        <div
                                            className="flex items-start justify-between"
                                            data-oid="04.1ie4"
                                        >
                                            <div className="flex-1" data-oid="3nz:v38">
                                                <div
                                                    className="flex items-center space-x-3"
                                                    data-oid="qknkbx2"
                                                >
                                                    <h3
                                                        className="text-lg font-medium text-gray-900"
                                                        data-oid="n7jt::m"
                                                    >
                                                        {user.name}
                                                    </h3>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                                                        data-oid="o49gszh"
                                                    >
                                                        {user.status}
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="0hhe2n6"
                                                >
                                                    {user.position} • {user.department}
                                                </p>

                                                <div
                                                    className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4"
                                                    data-oid="jvpm3nj"
                                                >
                                                    <div data-oid="_px2b2n">
                                                        <h4
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="jmlc0c9"
                                                        >
                                                            Completed Training
                                                        </h4>
                                                        <div
                                                            className="mt-1 flex flex-wrap gap-1"
                                                            data-oid="16bi59l"
                                                        >
                                                            {user.trainingInfo.completedTraining.map(
                                                                (training, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                                                        data-oid="2xpupgx"
                                                                    >
                                                                        {training}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div data-oid="x-qjvh6">
                                                        <h4
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="lfc3iy9"
                                                        >
                                                            Pending Training
                                                        </h4>
                                                        <div
                                                            className="mt-1 flex flex-wrap gap-1"
                                                            data-oid="j4pgxz-"
                                                        >
                                                            {user.trainingInfo.pendingTraining.map(
                                                                (training, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                                                        data-oid="ru99dtm"
                                                                    >
                                                                        {training}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div data-oid=".e-bcja">
                                                        <h4
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="_rpa5b4"
                                                        >
                                                            Certifications
                                                        </h4>
                                                        <div
                                                            className="mt-1 flex flex-wrap gap-1"
                                                            data-oid="l7aaq11"
                                                        >
                                                            {user.trainingInfo.certifications.map(
                                                                (cert, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                                        data-oid="ei.8e0k"
                                                                    >
                                                                        {cert}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="mt-3 grid grid-cols-3 gap-4 text-sm"
                                                    data-oid="9h881ip"
                                                >
                                                    <div data-oid="kwh1t-f">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="i1.iewl"
                                                        >
                                                            Training Score
                                                        </p>
                                                        <p
                                                            className="font-medium"
                                                            data-oid="p_t8jtc"
                                                        >
                                                            {user.trainingInfo.trainingScore.toFixed(
                                                                1,
                                                            )}
                                                            %
                                                        </p>
                                                    </div>
                                                    <div data-oid="z3h90hr">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="angi1gf"
                                                        >
                                                            Last Training
                                                        </p>
                                                        <p
                                                            className="font-medium"
                                                            data-oid="xwsye.q"
                                                        >
                                                            {user.trainingInfo.lastTrainingDate
                                                                ? new Date(
                                                                      user.trainingInfo.lastTrainingDate,
                                                                  ).toLocaleDateString()
                                                                : 'None'}
                                                        </p>
                                                    </div>
                                                    <div data-oid="uegidrb">
                                                        <p
                                                            className="text-gray-600"
                                                            data-oid="h0dr2v_"
                                                        >
                                                            Next Due
                                                        </p>
                                                        <p
                                                            className="font-medium"
                                                            data-oid="kshwdsp"
                                                        >
                                                            {new Date(
                                                                user.trainingInfo.nextTrainingDue,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="ml-6 flex flex-col space-y-2"
                                                data-oid="xagpj9r"
                                            >
                                                <button
                                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                    data-oid="mh080q6"
                                                >
                                                    Schedule Training
                                                </button>
                                                <button
                                                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                                                    data-oid="v88e158"
                                                >
                                                    View Progress
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
