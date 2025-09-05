'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import { Users, TrendingUp, Package, Activity, Clock, CheckCircle } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    productsAdded: number;
    lastActive: string;
    status: 'active' | 'inactive';
    joinDate: string;
    avatar?: string;
}

interface ProductGrowthData {
    date: string;
    products: number;
    users: number;
}

interface UserActivity {
    userId: string;
    userName: string;
    productName: string;
    category: string;
    addedAt: string;
    status: 'approved' | 'pending' | 'rejected';
}

const chartConfig = {
    products: {
        label: 'Products',
        color: '#1F1F6F',
    },
    users: {
        label: 'Active Users',
        color: '#14274E',
    },
};

export default function AdminDataInputPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [productGrowthData, setProductGrowthData] = useState<ProductGrowthData[]>([]);
    const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeUsersCount, setActiveUsersCount] = useState(0);
    const [totalProductsAdded, setTotalProductsAdded] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive'>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for active users
        const mockActiveUsers: User[] = [
            {
                id: 'U-001',
                name: 'Ahmed Hassan',
                email: 'ahmed.hassan@cura.com',
                role: 'Senior Data Specialist',
                productsAdded: 156,
                lastActive: '2024-01-15T11:30:00Z',
                status: 'active',
                joinDate: '2023-06-15',
            },
            {
                id: 'U-002',
                name: 'Sarah Ahmed',
                email: 'sarah.ahmed@cura.com',
                role: 'Product Manager',
                productsAdded: 89,
                lastActive: '2024-01-15T10:45:00Z',
                status: 'active',
                joinDate: '2023-08-20',
            },
            {
                id: 'U-003',
                name: 'Omar Khaled',
                email: 'omar.khaled@cura.com',
                role: 'Data Entry Specialist',
                productsAdded: 234,
                lastActive: '2024-01-15T09:15:00Z',
                status: 'active',
                joinDate: '2023-05-10',
            },
            {
                id: 'U-004',
                name: 'Fatima Hassan',
                email: 'fatima.hassan@cura.com',
                role: 'Quality Analyst',
                productsAdded: 67,
                lastActive: '2024-01-15T08:30:00Z',
                status: 'active',
                joinDate: '2023-09-05',
            },
            {
                id: 'U-005',
                name: 'Mohamed Ali',
                email: 'mohamed.ali@cura.com',
                role: 'Data Coordinator',
                productsAdded: 123,
                lastActive: '2024-01-14T16:20:00Z',
                status: 'active',
                joinDate: '2023-07-12',
            },
        ];

        // Mock data for all users (including inactive)
        const mockAllUsers: User[] = [
            ...mockActiveUsers,
            {
                id: 'U-006',
                name: 'Layla Mahmoud',
                email: 'layla.mahmoud@cura.com',
                role: 'Data Entry Specialist',
                productsAdded: 45,
                lastActive: '2024-01-10T14:20:00Z',
                status: 'inactive',
                joinDate: '2023-11-01',
            },
            {
                id: 'U-007',
                name: 'Youssef Ibrahim',
                email: 'youssef.ibrahim@cura.com',
                role: 'Junior Analyst',
                productsAdded: 23,
                lastActive: '2024-01-08T12:15:00Z',
                status: 'inactive',
                joinDate: '2023-12-15',
            },
        ];

        // Mock product growth data
        const mockGrowthData: ProductGrowthData[] = [
            { date: '2024-01-01', products: 2650, users: 8 },
            { date: '2024-01-02', products: 2678, users: 9 },
            { date: '2024-01-03', products: 2701, users: 10 },
            { date: '2024-01-04', products: 2725, users: 11 },
            { date: '2024-01-05', products: 2756, users: 12 },
            { date: '2024-01-06', products: 2789, users: 12 },
            { date: '2024-01-07', products: 2812, users: 13 },
            { date: '2024-01-08', products: 2834, users: 11 },
            { date: '2024-01-09', products: 2847, users: 12 },
            { date: '2024-01-10', products: 2863, users: 10 },
            { date: '2024-01-11', products: 2881, users: 11 },
            { date: '2024-01-12', products: 2905, users: 12 },
            { date: '2024-01-13', products: 2928, users: 13 },
            { date: '2024-01-14', products: 2951, users: 12 },
            { date: '2024-01-15', products: 2975, users: 12 },
        ];

        // Mock user activity
        const mockActivity: UserActivity[] = [
            {
                userId: 'U-001',
                userName: 'Ahmed Hassan',
                productName: 'Panadol Extra 500mg',
                category: 'Pain Relief',
                addedAt: '2024-01-15T11:30:00Z',
                status: 'approved',
            },
            {
                userId: 'U-003',
                userName: 'Omar Khaled',
                productName: 'Vitamin D3 1000 IU',
                category: 'Vitamins',
                addedAt: '2024-01-15T10:45:00Z',
                status: 'approved',
            },
            {
                userId: 'U-002',
                userName: 'Sarah Ahmed',
                productName: 'Omega 3 Fish Oil',
                category: 'Supplements',
                addedAt: '2024-01-15T09:20:00Z',
                status: 'pending',
            },
            {
                userId: 'U-004',
                userName: 'Fatima Hassan',
                productName: 'Calcium Tablets',
                category: 'Supplements',
                addedAt: '2024-01-15T08:15:00Z',
                status: 'approved',
            },
            {
                userId: 'U-005',
                userName: 'Mohamed Ali',
                productName: 'Aspirin 100mg',
                category: 'Pain Relief',
                addedAt: '2024-01-15T07:30:00Z',
                status: 'approved',
            },
        ];

        setUsers(mockActiveUsers);
        setAllUsers(mockAllUsers);
        setProductGrowthData(mockGrowthData);
        setUserActivity(mockActivity);
        setActiveUsersCount(mockActiveUsers.length);
        setTotalProductsAdded(mockAllUsers.reduce((sum, user) => sum + user.productsAdded, 0));
        setIsLoading(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <Badge
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                        data-oid="j7q4ea7"
                    >
                        Active
                    </Badge>
                );

            case 'inactive':
                return (
                    <Badge variant="secondary" data-oid="oih4b1e">
                        Inactive
                    </Badge>
                );

            case 'approved':
                return (
                    <Badge
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                        data-oid="2rtedxt"
                    >
                        Approved
                    </Badge>
                );

            case 'pending':
                return (
                    <Badge
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        data-oid="lpvk9ou"
                    >
                        Pending
                    </Badge>
                );

            case 'rejected':
                return (
                    <Badge variant="destructive" data-oid="uj746l:">
                        Rejected
                    </Badge>
                );

            default:
                return (
                    <Badge variant="secondary" data-oid="p064t9h">
                        {status}
                    </Badge>
                );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-6" data-oid="-7y.b5m">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="sodv4uj">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="eo5ot7r"
                        ></div>
                    ))}
                </div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-96" data-oid="3bkugv9"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 min-h-screen" data-oid="v6vumj8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="rj-_0y_">
                <Card
                    className="border-0 shadow-lg bg-gradient-to-br from-cura-primary to-cura-secondary text-white hover:shadow-xl transition-shadow"
                    data-oid="1j2cy74"
                >
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="kapp:w6"
                    >
                        <CardTitle className="text-sm font-medium text-white/90" data-oid="-tln1iq">
                            Active Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-white/80" data-oid="07gy4jq" />
                    </CardHeader>
                    <CardContent data-oid="k5-gfun">
                        <div className="text-2xl font-bold" data-oid="hs8d_xo">
                            {activeUsersCount}
                        </div>
                        <p className="text-xs text-white/70" data-oid="v-d3:s3">
                            Currently online
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="border-0 shadow-lg bg-gradient-to-br from-cura-secondary to-cura-accent text-white hover:shadow-xl transition-shadow"
                    data-oid="xcm-3e4"
                >
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="ckmabgq"
                    >
                        <CardTitle className="text-sm font-medium text-white/90" data-oid="8h:pjbu">
                            Total Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-white/80" data-oid="7pozsc8" />
                    </CardHeader>
                    <CardContent data-oid="ia4kg:2">
                        <div className="text-2xl font-bold" data-oid="bsnhz2.">
                            {totalProductsAdded}
                        </div>
                        <p className="text-xs text-white/70" data-oid="d9eyba2">
                            Products added
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="border-0 shadow-lg bg-gradient-to-br from-cura-accent to-cura-light text-white hover:shadow-xl transition-shadow"
                    data-oid="nk2_-iq"
                >
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="os.y5::"
                    >
                        <CardTitle className="text-sm font-medium text-white/90" data-oid="l.e0_k1">
                            Growth Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-white/80" data-oid="-jy1t8b" />
                    </CardHeader>
                    <CardContent data-oid="c7w7wpk">
                        <div className="text-2xl font-bold" data-oid="vma78bx">
                            +12.5%
                        </div>
                        <p className="text-xs text-white/70" data-oid="7w-m4xu">
                            This month
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="border-0 shadow-lg bg-gradient-to-br from-cura-primary via-cura-secondary to-cura-accent text-white hover:shadow-xl transition-shadow"
                    data-oid="oj0n-hg"
                >
                    <CardHeader
                        className="flex flex-row items-center justify-between space-y-0 pb-2"
                        data-oid="1u0-znv"
                    >
                        <CardTitle className="text-sm font-medium text-white/90" data-oid="vli_a:5">
                            Avg. Daily
                        </CardTitle>
                        <Activity className="h-4 w-4 text-white/80" data-oid="1lwt8lc" />
                    </CardHeader>
                    <CardContent data-oid="5w_1a5k">
                        <div className="text-2xl font-bold" data-oid="p-3__zl">
                            24
                        </div>
                        <p className="text-xs text-white/70" data-oid="q_51p09">
                            Products/day
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="wlfb8fx">
                {/* Product Growth Chart */}
                <Card className="border-0 shadow-lg" data-oid="0x7-:cv">
                    <CardHeader data-oid="gq99i0.">
                        <CardTitle className="text-cura-primary" data-oid="eeoz_f:">
                            Product Growth Analytics
                        </CardTitle>
                        <CardDescription data-oid="8x_o1b:">
                            Track product additions and user activity over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="8ay::7q">
                        <ChartContainer
                            config={chartConfig}
                            className="h-[300px]"
                            data-oid="hq0_kvu"
                        >
                            <ResponsiveContainer width="100%" height="100%" data-oid="j5_cygy">
                                <LineChart data={productGrowthData} data-oid="z58kv7r">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                        data-oid="3w63j84"
                                    />

                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) =>
                                            new Date(value).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })
                                        }
                                        stroke="#666"
                                        data-oid="10fbai."
                                    />

                                    <YAxis stroke="#666" data-oid="ksn8hv8" />
                                    <ChartTooltip
                                        content={<ChartTooltipContent data-oid="h-0-mdx" />}
                                        data-oid="0b6g-ru"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="products"
                                        stroke="#1F1F6F"
                                        strokeWidth={3}
                                        dot={{ fill: '#1F1F6F', strokeWidth: 2, r: 4 }}
                                        data-oid="2amtbqd"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#14274E"
                                        strokeWidth={2}
                                        dot={{ fill: '#14274E', strokeWidth: 2, r: 3 }}
                                        data-oid="3z1l-r2"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* User Activity Chart */}
                <Card className="border-0 shadow-lg" data-oid="6e5y7gk">
                    <CardHeader data-oid="p50-p3q">
                        <CardTitle className="text-cura-primary" data-oid="pblm3cu">
                            User Productivity
                        </CardTitle>
                        <CardDescription data-oid="cqru2.8">
                            Products added by each active user
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="a9mou1-">
                        <ChartContainer
                            config={chartConfig}
                            className="h-[300px]"
                            data-oid="f5c804m"
                        >
                            <ResponsiveContainer width="100%" height="100%" data-oid="0mqe30n">
                                <BarChart data={users} data-oid=":9t:be5">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                        data-oid="69t6w:5"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tickFormatter={(value) => value.split(' ')[0]}
                                        stroke="#666"
                                        data-oid="bcva7.k"
                                    />

                                    <YAxis stroke="#666" data-oid="ekb.gfy" />
                                    <ChartTooltip
                                        content={<ChartTooltipContent data-oid="0txjrrn" />}
                                        data-oid="fzen:gv"
                                    />

                                    <Bar
                                        dataKey="productsAdded"
                                        fill="#1F1F6F"
                                        radius={[4, 4, 0, 0]}
                                        data-oid="giopgd8"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Combined Users Table */}
            <Card className="border-0 shadow-lg" data-oid="ujc2xmg">
                <CardHeader data-oid="ox:co.3">
                    <div className="flex items-center justify-between" data-oid="ieyg8d1">
                        <div data-oid="g-landx">
                            <CardTitle
                                className="text-cura-primary flex items-center gap-2"
                                data-oid=".9vxdc3"
                            >
                                <Users className="h-5 w-5" data-oid="2o.08zm" />
                                User Management
                            </CardTitle>
                            <CardDescription data-oid="y0w0f:m">
                                Manage all team members and their contributions
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2" data-oid="8ik4910">
                            <button
                                onClick={() => setUserFilter('all')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    userFilter === 'all'
                                        ? 'bg-cura-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                data-oid="6nedhzt"
                            >
                                All ({allUsers.length})
                            </button>
                            <button
                                onClick={() => setUserFilter('active')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    userFilter === 'active'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                data-oid="hkh4em1"
                            >
                                Active ({allUsers.filter((u) => u.status === 'active').length})
                            </button>
                            <button
                                onClick={() => setUserFilter('inactive')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    userFilter === 'inactive'
                                        ? 'bg-gray-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                data-oid="sd7b5yu"
                            >
                                Inactive ({allUsers.filter((u) => u.status === 'inactive').length})
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent data-oid="4648lf9">
                    <Table data-oid="guxcsh2">
                        <TableHeader data-oid="kbb87y-">
                            <TableRow data-oid="zvj0mfo">
                                <TableHead data-oid="ntxtizr">User</TableHead>
                                <TableHead data-oid="x.8h2r9">Products Added</TableHead>
                                <TableHead data-oid="wbdpijh">Join Date</TableHead>
                                <TableHead data-oid="ux7.t80">Last Active</TableHead>
                                <TableHead data-oid=".s0ew0k">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody data-oid="n2gdqk7">
                            {allUsers
                                .filter((user) => {
                                    if (userFilter === 'active') return user.status === 'active';
                                    if (userFilter === 'inactive')
                                        return user.status === 'inactive';
                                    return true;
                                })
                                .map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-slate-50"
                                        data-oid=".men759"
                                    >
                                        <TableCell className="font-medium" data-oid="d0xg-dd">
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="_zfp9.i"
                                            >
                                                <div
                                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                                                        user.status === 'active'
                                                            ? 'bg-cura-primary'
                                                            : 'bg-gray-400'
                                                    }`}
                                                    data-oid="mqxzj9w"
                                                >
                                                    {user.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </div>
                                                <div data-oid="n3i440:">
                                                    <div className="font-medium" data-oid="y.ck88i">
                                                        {user.name}
                                                    </div>
                                                    <div
                                                        className="text-sm text-muted-foreground"
                                                        data-oid="s--cu5l"
                                                    >
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid="chch.81">
                                            <div
                                                className="flex items-center gap-2"
                                                data-oid="x2:dos:"
                                            >
                                                <span
                                                    className={`font-semibold ${
                                                        user.status === 'active'
                                                            ? 'text-cura-primary'
                                                            : 'text-gray-500'
                                                    }`}
                                                    data-oid="tu2q7e1"
                                                >
                                                    {user.productsAdded}
                                                </span>
                                                <Package
                                                    className="h-4 w-4 text-muted-foreground"
                                                    data-oid="-f3qh7a"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid="enhig6p">
                                            {new Date(user.joinDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell data-oid="0e3wvio">
                                            <div
                                                className="flex items-center gap-2"
                                                data-oid="hc7gp1j"
                                            >
                                                <Clock
                                                    className="h-4 w-4 text-muted-foreground"
                                                    data-oid="_eyq-5c"
                                                />

                                                {formatDate(user.lastActive)}
                                            </div>
                                        </TableCell>
                                        <TableCell data-oid="rik9zn5">
                                            {getStatusBadge(user.status)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
