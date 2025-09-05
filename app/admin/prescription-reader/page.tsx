'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Search,
    Filter,
    Users,
    Activity,
    Clock,
    Eye,
    MoreVertical,
    X,
    User,
    Stethoscope,
    CheckCircle,
    Pill,
    FileText,
    Image as ImageIcon,
    Calendar,
    TrendingUp,
    Download,
} from 'lucide-react';
import { MedicineImage } from '@/components/ui/medicine-image';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface PrescriptionReaderUser {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'busy';
    processedPrescriptions: number;
    accuracyRate: number;
    currentPrescriptions: number;
    lastActive: string;
    specializations: string[];
    joinedDate: string;
    avatar?: string;
}

interface Medicine {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    image?: string;
    activeIngredient?: string;
    manufacturer?: string;
}

interface LivePrescription {
    id: string;
    patientName: string;
    doctorName: string;
    status: 'approved' | 'processing' | 'completed';
    medicines: Medicine[];
    readBy: string;
    readerName: string;
    processedAt: string;
    confidence: number;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    prescriptionImage?: string;
}

interface PrescriptionReaderStats {
    totalUsers: number;
    activeUsers: number;
    processedPrescriptionsToday: StringIterator;
    averageAccuracy: string;
}

type FilterType = 'all' | 'active' | 'inactive';
import axios from 'axios';
export default function AdminPrescriptionReaderPage() {
    const [selectedUser, setSelectedUser] = useState<PrescriptionReaderUser | null>(null);
    const [selectedPrescription, setSelectedPrescription] = useState<LivePrescription | null>(null);
    const [stats, setStats] = useState<PrescriptionReaderStats | null>(null);
    const [users, setUsers] = useState<PrescriptionReaderUser[]>([]);
    const [livePrescriptions, setLivePrescriptions] = useState<LivePrescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<'name' | 'accuracy' | 'processed' | 'workload'>('name');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [prescriptionFilter, setPrescriptionFilter] = useState<
        'all' | 'processing' | 'completed'
    >('all');

    // Chart data for analytics
    const dailyProcessingData = [
        { date: 'Jan 15', processed: 45, accuracy: 94.2, readers: 3 },
        { date: 'Jan 16', processed: 52, accuracy: 95.1, readers: 4 },
        { date: 'Jan 17', processed: 48, accuracy: 96.3, readers: 4 },
        { date: 'Jan 18', processed: 61, accuracy: 94.8, readers: 5 },
        { date: 'Jan 19', processed: 58, accuracy: 95.7, readers: 4 },
        { date: 'Jan 20', processed: 156, accuracy: 95.5, readers: 4 },
    ];

    const enhancedMonthlyData = [
        {
            month: 'Jan 2024',
            prescriptions: 1840,
            readers: 3,
            avgTime: 3.1,
            completed: 1752,
            pending: 88,
            growthRate: 0,
            efficiency: 85.2,
        },
        {
            month: 'Feb 2024',
            prescriptions: 2120,
            readers: 4,
            avgTime: 2.9,
            completed: 2009,
            pending: 111,
            growthRate: 15.2,
            efficiency: 87.8,
        },
        {
            month: 'Mar 2024',
            prescriptions: 2340,
            readers: 4,
            avgTime: 2.7,
            completed: 2223,
            pending: 117,
            growthRate: 10.4,
            efficiency: 89.1,
        },
        {
            month: 'Apr 2024',
            prescriptions: 2180,
            readers: 4,
            avgTime: 2.6,
            completed: 2071,
            pending: 109,
            growthRate: -6.8,
            efficiency: 90.3,
        },
        {
            month: 'May 2024',
            prescriptions: 2450,
            readers: 5,
            avgTime: 2.5,
            completed: 2328,
            pending: 122,
            growthRate: 12.4,
            efficiency: 91.5,
        },
        {
            month: 'Jun 2024',
            prescriptions: 2680,
            readers: 5,
            avgTime: 2.4,
            completed: 2546,
            pending: 134,
            growthRate: 9.4,
            efficiency: 92.7,
        },
        {
            month: 'Jul 2024',
            prescriptions: 2890,
            readers: 5,
            avgTime: 2.3,
            completed: 2748,
            pending: 142,
            growthRate: 7.8,
            efficiency: 93.8,
        },
        {
            month: 'Aug 2024',
            prescriptions: 2740,
            readers: 5,
            avgTime: 2.3,
            completed: 2603,
            pending: 137,
            growthRate: -5.2,
            efficiency: 94.1,
        },
        {
            month: 'Sep 2024',
            prescriptions: 2980,
            readers: 6,
            avgTime: 2.2,
            completed: 2831,
            pending: 149,
            growthRate: 8.8,
            efficiency: 94.6,
        },
        {
            month: 'Oct 2024',
            prescriptions: 3120,
            readers: 6,
            avgTime: 2.1,
            completed: 2964,
            pending: 156,
            growthRate: 4.7,
            efficiency: 95.2,
        },
        {
            month: 'Nov 2024',
            prescriptions: 3080,
            readers: 7,
            avgTime: 2.0,
            completed: 2926,
            pending: 154,
            growthRate: -1.3,
            efficiency: 95.8,
        },
        {
            month: 'Dec 2024',
            prescriptions: 3245,
            readers: 7,
            avgTime: 1.9,
            completed: 3084,
            pending: 161,
            growthRate: 5.4,
            efficiency: 96.2,
        },
    ];

    // Export functions
    const exportToCSV = (data: any[], filename: string) => {
        // Create comprehensive export data
        const exportData = data.map((item) => ({
            Month: item.month,
            'Total Prescriptions': item.prescriptions,
            'Active Readers': item.readers,
            'Completed Prescriptions': item.completed,
            'Pending Prescriptions': item.pending,
            'Average Processing Time (minutes)': item.avgTime,
            'Monthly Growth Rate (%)': item.growthRate,
            'Processing Efficiency (%)': item.efficiency,
            'Completion Rate (%)': ((item.completed / item.prescriptions) * 100).toFixed(1),
            'Prescriptions per Reader': Math.round(item.prescriptions / item.readers),
        }));

        const csvContent = [
            Object.keys(exportData[0]).join(','),
            ...exportData.map((row) => Object.values(row).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = (data: any[], filename: string) => {
        // Create comprehensive export data
        const exportData = data.map((item) => ({
            Month: item.month,
            'Total Prescriptions': item.prescriptions,
            'Active Readers': item.readers,
            'Completed Prescriptions': item.completed,
            'Pending Prescriptions': item.pending,
            'Average Processing Time (minutes)': item.avgTime,
            'Monthly Growth Rate (%)': item.growthRate,
            'Processing Efficiency (%)': item.efficiency,
            'Completion Rate (%)': ((item.completed / item.prescriptions) * 100).toFixed(1),
            'Prescriptions per Reader': Math.round(item.prescriptions / item.readers),
        }));

        const csvContent = [
            Object.keys(exportData[0]).join('\t'),
            ...exportData.map((row) => Object.values(row).join('\t')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.xlsx`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadLivePrescriptions, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`);
        const fetchedUsers = response.data;
        let filteredUsers = fetchedUsers;
        const newUsers = filteredUsers.filter(
            (user) => user.role == 'prescription-reader'
          );
        setUsers(newUsers)
        setStats({
            totalUsers: newUsers.length,
            activeUsers: newUsers.filter((u) => u.status === 'active' || u.status === 'busy')
                .length,
            processedPrescriptionsToday: "NA",
            averageAccuracy:"NA",
        });
        await loadLivePrescriptions();
        setIsLoading(false);
    };

    const loadLivePrescriptions = async () => {
        const mockLivePrescriptions: LivePrescription[] = [
            {
                id: 'RX-2024-001',
                patientName: 'Ahmed Hassan',
                doctorName: 'Dr. Khaled Mostafa',
                status: 'approved',
                medicines: [
                    {
                        name: 'Metformin 500mg',
                        dosage: '500mg',
                        frequency: 'Twice daily',
                        duration: '30 days',
                        image: '/images/medicines/metformin-500mg.jpg',
                        activeIngredient: 'Metformin HCl',
                        manufacturer: 'Pharco Pharmaceuticals',
                    },
                    {
                        name: 'Lisinopril 10mg',
                        dosage: '10mg',
                        frequency: 'Once daily',
                        duration: '30 days',
                        image: '/images/medicines/lisinopril-10mg.jpg',
                        activeIngredient: 'Lisinopril',
                        manufacturer: 'Hikma Pharmaceuticals',
                    },
                ],

                readBy: 'reader-1',
                readerName: 'Dr. Sarah Ahmed',
                processedAt: '2024-01-20T14:30:00Z',
                confidence: 97.2,
                urgency: 'medium',
                prescriptionImage: '/images/prescriptions/rx-2024-001.jpg',
            },
            {
                id: 'RX-2024-002',
                patientName: 'Fatima Ali',
                doctorName: 'Dr. Amira Farouk',
                status: 'processing',
                medicines: [
                    {
                        name: 'Amoxicillin 250mg',
                        dosage: '250mg',
                        frequency: 'Three times daily',
                        duration: '7 days',
                        image: '/images/medicines/amoxicillin-250mg.jpg',
                        activeIngredient: 'Amoxicillin',
                        manufacturer: 'Hikma Pharmaceuticals',
                    },
                ],

                readBy: 'reader-2',
                readerName: 'Dr. Mohamed Hassan',
                processedAt: '2024-01-20T14:28:00Z',
                confidence: 89.5,
                urgency: 'high',
                prescriptionImage: '/images/prescriptions/rx-2024-002.jpg',
            },
            {
                id: 'RX-2024-003',
                patientName: 'Omar Mahmoud',
                doctorName: 'Dr. Yasmin Nour',
                status: 'completed',
                medicines: [
                    {
                        name: 'Ibuprofen 400mg',
                        dosage: '400mg',
                        frequency: 'As needed',
                        duration: '14 days',
                        image: '/images/medicines/ibuprofen-400mg.jpg',
                        activeIngredient: 'Ibuprofen',
                        manufacturer: 'Eva Pharma',
                    },
                    {
                        name: 'Omeprazole 20mg',
                        dosage: '20mg',
                        frequency: 'Once daily',
                        duration: '14 days',
                        image: '/images/medicines/omeprazole-20mg.jpg',
                        activeIngredient: 'Omeprazole',
                        manufacturer: 'Amoun Pharmaceutical',
                    },
                    {
                        name: 'Vitamin D3 1000IU',
                        dosage: '1000IU',
                        frequency: 'Once daily',
                        duration: '90 days',
                        image: '/images/medicines/vitamin-d3-1000iu.jpg',
                        activeIngredient: 'Cholecalciferol',
                        manufacturer: 'Eva Pharma',
                    },
                ],

                readBy: 'reader-3',
                readerName: 'Dr. Fatima Ali',
                processedAt: '2024-01-20T14:25:00Z',
                confidence: 98.1,
                urgency: 'low',
                prescriptionImage: '/images/prescriptions/rx-2024-003.jpg',
            },
        ];

        setLivePrescriptions(mockLivePrescriptions);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                        data-oid="cnb2tx8"
                    />
                );

            case 'busy':
                return (
                    <div
                        className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
                        data-oid="0qqkts7"
                    />
                );

            case 'inactive':
                return <div className="w-2 h-2 bg-gray-400 rounded-full" data-oid="4:7w1ue" />;
            default:
                return <div className="w-2 h-2 bg-gray-400 rounded-full" data-oid="v_qtv-n" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredUsers = users
        .filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' &&
                    (user?.currentStatus === 'active' || user?.currentStatus === 'busy')) ||
                (statusFilter === 'inactive' && user?.currentStatus === 'inactive');
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'accuracy':
                    return b.accuracyRate - a.accuracyRate;
                case 'processed':
                    return b.processedPrescriptions - a.processedPrescriptions;
                case 'workload':
                    return b.currentPrescriptions - a.currentPrescriptions;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const getFilterCount = (filter: FilterType) => {
        switch (filter) {
            case 'all':
                return users.length;
            case 'active':
                return users.filter((u) => u.status === 'active' || u.status === 'busy').length;
            case 'inactive':
                return users.filter((u) => u.status === 'inactive').length;
            default:
                return 0;
        }
    };

    const handleActivityPrescriptionClick = (prescriptionId: string) => {
        // Find the prescription in the livePrescriptions array
        const prescription = livePrescriptions.find((p) => p.id === prescriptionId);
        if (prescription) {
            setSelectedPrescription(prescription);
            setIsPrescriptionModalOpen(true);
        }
    };

    if (isLoading || !stats) {
        return (
            <div className="space-y-6" data-oid="6ki2vbx">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-oid="z2eqf-v">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-xl h-32"
                            data-oid="ogwd-hg"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="hjg2keh">
            <Tabs defaultValue="overview" className="w-full" data-oid="yiucge.">
                <TabsList
                    className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-100 p-1 h-12 rounded-xl border border-gray-200 shadow-sm"
                    data-oid="e-69cq_"
                >
                    <TabsTrigger
                        value="overview"
                        className="flex items-center gap-2 data-[state=active]:bg-cura-gradient data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium text-sm transition-all duration-200"
                        data-oid="hogo.p:"
                    >
                        <TrendingUp className="w-4 h-4" data-oid="4wquf83" /> Analytics Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="users"
                        className="flex items-center gap-2 data-[state=active]:bg-cura-gradient data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium text-sm transition-all duration-200"
                        data-oid="-w4klgm"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="ttkzu5q"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                data-oid="13_e4dp"
                            />
                        </svg>
                        Reader Accounts
                    </TabsTrigger>
                    <TabsTrigger
                        value="workflow"
                        className="flex items-center gap-2 data-[state=active]:bg-cura-gradient data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-medium text-sm transition-all duration-200"
                        data-oid="fhi83s0"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="wkc93:0"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                data-oid="vc74r8y"
                            />
                        </svg>
                        Live Workflow
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6 mt-6" data-oid="zo-ljhb">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-oid="5cvy6mo">
                        <Card
                            className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cura-primary via-cura-secondary to-cura-accent"
                            data-oid="e-20-8h"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"
                                data-oid="tet-40x"
                            />

                            <CardContent className="relative p-6 text-white" data-oid="dvu31.o">
                                <div
                                    className="flex items-center justify-between mb-4"
                                    data-oid="66::xu:"
                                >
                                    <div
                                        className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                                        data-oid="n5hu.it"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid=".q4.n0c"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                                data-oid="s_bck7b"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-right" data-oid="p7g7or2">
                                        <div className="text-3xl font-bold mb-1" data-oid="z5bw7u1">
                                            {stats.totalUsers}
                                        </div>
                                        <div className="text-sm opacity-90" data-oid="t34_10r">
                                            Total Readers
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="qv_1vvg"
                                >
                                    <span className="text-sm font-medium" data-oid="jgt1qzr">
                                        Registered users
                                    </span>
                                    <div
                                        className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"
                                        data-oid="wkgt_lv"
                                    >
                                        <TrendingUp className="w-3 h-3" data-oid="h4bp5rm" />
                                        <span className="text-xs font-semibold" data-oid="fp5-jt2">
                                            +2
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cura-secondary via-cura-accent to-cura-light"
                            data-oid="80f-tw7"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"
                                data-oid="f7lu07h"
                            />

                            <CardContent className="relative p-6 text-white" data-oid="0n9k_.s">
                                <div
                                    className="flex items-center justify-between mb-4"
                                    data-oid="oaag0mo"
                                >
                                    <div
                                        className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                                        data-oid="wn:cb8i"
                                    >
                                        <Activity className="w-6 h-6" data-oid="h4w1pa." />
                                    </div>
                                    <div className="text-right" data-oid="n0571.h">
                                        <div className="text-3xl font-bold mb-1" data-oid="4:a89qv">
                                            {stats.activeUsers}
                                        </div>
                                        <div className="text-sm opacity-90" data-oid="jp_5onh">
                                            Active Now
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="c49pv0f"
                                >
                                    <span className="text-sm font-medium" data-oid="huh5q6y">
                                        Currently online
                                    </span>
                                    <div
                                        className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"
                                        data-oid="wp9dct2"
                                    >
                                        <TrendingUp className="w-3 h-3" data-oid="ofcqyx." />
                                        <span className="text-xs font-semibold" data-oid="d3uqnbt">
                                            {Math.round(
                                                (stats.activeUsers / stats.totalUsers) * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-600 via-slate-700 to-gray-800"
                            data-oid="1crknh9"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"
                                data-oid="-jjlok7"
                            />

                            <CardContent className="relative p-6 text-white" data-oid="tqz5dc_">
                                <div
                                    className="flex items-center justify-between mb-4"
                                    data-oid="p_5hmk5"
                                >
                                    <div
                                        className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                                        data-oid="a-rz11h"
                                    >
                                        <FileText className="w-6 h-6" data-oid="zwf-cr0" />
                                    </div>
                                    <div className="text-right" data-oid="2lps3ft">
                                        <div className="text-3xl font-bold mb-1" data-oid=".l2_kry">
                                            {stats.processedPrescriptionsToday}
                                        </div>
                                        <div className="text-sm opacity-90" data-oid="u.zzugl">
                                            Processed Today
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="uf0_ofv"
                                >
                                    <span className="text-sm font-medium" data-oid="ohpgmca">
                                        Prescriptions read
                                    </span>
                                    <div
                                        className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"
                                        data-oid="kh50pxp"
                                    >
                                        <TrendingUp className="w-3 h-3" data-oid="irj78e4" />
                                        <span className="text-xs font-semibold" data-oid="n_sz_xw">
                                            +18
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Monthly Growth Chart - Full Width */}
                    <div className="mb-6" data-oid="u70x-2t">
                        <Card
                            className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-cura-primary/5 hover:shadow-3xl transition-all duration-500"
                            data-oid="k70hkad"
                        >
                            <CardHeader
                                className="pb-6 border-b border-cura-light/20"
                                data-oid="r_p:-ad"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="8052:cv"
                                >
                                    <div className="flex items-center gap-4" data-oid="h7kk-3f">
                                        <div
                                            className="p-3 bg-cura-gradient rounded-xl shadow-lg"
                                            data-oid="ia1k3j3"
                                        >
                                            <TrendingUp
                                                className="w-7 h-7 text-white"
                                                data-oid="gfvmwy-"
                                            />
                                        </div>
                                        <div data-oid="vvf:c8y">
                                            <CardTitle
                                                className="text-2xl font-bold bg-gradient-to-r from-cura-primary to-cura-secondary bg-clip-text text-transparent"
                                                data-oid=".iq1q3b"
                                            >
                                                Prescription Processing Analytics
                                            </CardTitle>
                                            <CardDescription
                                                className="text-cura-accent text-lg mt-1"
                                                data-oid="b-4efvi"
                                            >
                                                Comprehensive 12-month prescription volume and
                                                performance trends
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-3" data-oid="z927x.j">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                exportToCSV(
                                                    enhancedMonthlyData,
                                                    'enhanced-monthly-analytics',
                                                )
                                            }
                                            className="border-cura-primary/30 text-cura-primary hover:bg-cura-primary hover:text-white transition-all duration-300"
                                            data-oid="oaxl:a1"
                                        >
                                            <Download className="w-4 h-4 mr-2" data-oid="m2zoibz" />
                                            Export CSV
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                exportToExcel(
                                                    enhancedMonthlyData,
                                                    'enhanced-monthly-analytics',
                                                )
                                            }
                                            className="border-cura-secondary/30 text-cura-secondary hover:bg-cura-secondary hover:text-white transition-all duration-300"
                                            data-oid="g1nwsxr"
                                        >
                                            <Download className="w-4 h-4 mr-2" data-oid="c6qemy:" />
                                            Export Excel
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8" data-oid="rzg77k2">
                                {/* Key Metrics Row */}
                                <div
                                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                                    data-oid=".q.wggq"
                                >
                                    <div
                                        className="bg-gradient-to-br from-cura-primary/10 to-cura-primary/5 p-6 rounded-xl border border-cura-primary/20"
                                        data-oid="wichgk9"
                                    >
                                        <div
                                            className="flex items-center gap-3 mb-2"
                                            data-oid="2qtdbip"
                                        >
                                            <div
                                                className="p-2 bg-cura-primary/20 rounded-lg"
                                                data-oid="t8hie6r"
                                            >
                                                <FileText
                                                    className="w-5 h-5 text-cura-primary"
                                                    data-oid="qcjjb:w"
                                                />
                                            </div>
                                            <span
                                                className="text-sm font-medium text-cura-accent"
                                                data-oid="h1ph-6e"
                                            >
                                                Total Volume
                                            </span>
                                        </div>
                                        <div
                                            className="text-2xl font-bold text-cura-primary"
                                            data-oid="vtlo_.l"
                                        >
                                            {enhancedMonthlyData
                                                .reduce((sum, item) => sum + item.prescriptions, 0)
                                                .toLocaleString()}
                                        </div>
                                        <div
                                            className="text-xs text-cura-light mt-1"
                                            data-oid="60duv5p"
                                        >
                                            Last 12 months
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-cura-secondary/10 to-cura-secondary/5 p-6 rounded-xl border border-cura-secondary/20"
                                        data-oid="ac.36.u"
                                    >
                                        <div
                                            className="flex items-center gap-3 mb-2"
                                            data-oid="30.id:v"
                                        >
                                            <div
                                                className="p-2 bg-cura-secondary/20 rounded-lg"
                                                data-oid="fbappy0"
                                            >
                                                <TrendingUp
                                                    className="w-5 h-5 text-cura-secondary"
                                                    data-oid="00kcfkz"
                                                />
                                            </div>
                                            <span
                                                className="text-sm font-medium text-cura-accent"
                                                data-oid="mdefs5:"
                                            >
                                                Growth Rate
                                            </span>
                                        </div>
                                        <div
                                            className="text-2xl font-bold text-cura-secondary"
                                            data-oid="h6pnz8p"
                                        >
                                            +24.5%
                                        </div>
                                        <div
                                            className="text-xs text-cura-light mt-1"
                                            data-oid="xejqzw-"
                                        >
                                            Year over year
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-cura-accent/10 to-cura-accent/5 p-6 rounded-xl border border-cura-accent/20"
                                        data-oid="kx7:wq-"
                                    >
                                        <div
                                            className="flex items-center gap-3 mb-2"
                                            data-oid="ytbb_p6"
                                        >
                                            <div
                                                className="p-2 bg-cura-accent/20 rounded-lg"
                                                data-oid="vc58:y7"
                                            >
                                                <Users
                                                    className="w-5 h-5 text-cura-accent"
                                                    data-oid=":0h5:j1"
                                                />
                                            </div>
                                            <span
                                                className="text-sm font-medium text-cura-accent"
                                                data-oid="z_aqz8s"
                                            >
                                                Active Readers
                                            </span>
                                        </div>
                                        <div
                                            className="text-2xl font-bold text-cura-accent"
                                            data-oid="e:x506n"
                                        >
                                            7
                                        </div>
                                        <div
                                            className="text-xs text-cura-light mt-1"
                                            data-oid="_th_0h2"
                                        >
                                            Current team size
                                        </div>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-xl border border-green-500/20"
                                        data-oid=".9-apmk"
                                    >
                                        <div
                                            className="flex items-center gap-3 mb-2"
                                            data-oid="j8v_718"
                                        >
                                            <div
                                                className="p-2 bg-green-500/20 rounded-lg"
                                                data-oid="jixs7ns"
                                            >
                                                <Clock
                                                    className="w-5 h-5 text-green-600"
                                                    data-oid="c4w84cv"
                                                />
                                            </div>
                                            <span
                                                className="text-sm font-medium text-cura-accent"
                                                data-oid="3r:1m69"
                                            >
                                                Avg Time
                                            </span>
                                        </div>
                                        <div
                                            className="text-2xl font-bold text-green-600"
                                            data-oid="ndm-ahn"
                                        >
                                            2.3m
                                        </div>
                                        <div
                                            className="text-xs text-cura-light mt-1"
                                            data-oid="sd1z.-q"
                                        >
                                            Per prescription
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Chart */}
                                <ResponsiveContainer width="100%" height={500} data-oid="vngedd3">
                                    <AreaChart
                                        data={enhancedMonthlyData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                        data-oid="8.w55l5"
                                    >
                                        <defs data-oid="jb:h3i1">
                                            <linearGradient
                                                id="prescriptionsGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                                data-oid="40try99"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#1F1F6F"
                                                    stopOpacity={0.8}
                                                    data-oid="6-y8m1w"
                                                />

                                                <stop
                                                    offset="95%"
                                                    stopColor="#1F1F6F"
                                                    stopOpacity={0.1}
                                                    data-oid="u5t:e.l"
                                                />
                                            </linearGradient>

                                            <linearGradient
                                                id="readersGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                                data-oid="s8thmkh"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#394867"
                                                    stopOpacity={0.8}
                                                    data-oid="q.--2.:"
                                                />

                                                <stop
                                                    offset="95%"
                                                    stopColor="#394867"
                                                    stopOpacity={0.1}
                                                    data-oid="rd-7smd"
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#9BA4B4"
                                            opacity={0.3}
                                            data-oid="dcq:ga4"
                                        />

                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: '#394867', fontSize: 12 }}
                                            axisLine={{ stroke: '#9BA4B4' }}
                                            data-oid="ftin5s-"
                                        />

                                        <YAxis
                                            tick={{ fill: '#394867', fontSize: 12 }}
                                            axisLine={{ stroke: '#9BA4B4' }}
                                            data-oid="83a-16p"
                                        />

                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #9BA4B4',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                            data-oid="t6gk4pu"
                                        />

                                        <Legend data-oid="t.rwt.s" />
                                        <Area
                                            type="monotone"
                                            dataKey="prescriptions"
                                            stroke="#1F1F6F"
                                            strokeWidth={3}
                                            fill="url(#prescriptionsGradient)"
                                            name="Prescriptions Processed"
                                            data-oid="xypecyd"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="readers"
                                            stroke="#394867"
                                            strokeWidth={2}
                                            fill="url(#readersGradient)"
                                            name="Active Readers"
                                            data-oid="x35205t"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>

                                {/* Additional Insights */}
                                <div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                                    data-oid="1mr6fie"
                                >
                                    <div
                                        className="bg-gradient-to-br from-cura-primary/5 to-transparent p-6 rounded-xl border border-cura-primary/10"
                                        data-oid="327ver1"
                                    >
                                        <h4
                                            className="font-semibold text-cura-primary mb-3"
                                            data-oid="iebkg6i"
                                        >
                                            Peak Performance
                                        </h4>
                                        <p
                                            className="text-sm text-cura-accent mb-2"
                                            data-oid="aq20svt"
                                        >
                                            Highest monthly volume:{' '}
                                            <span
                                                className="font-bold text-cura-primary"
                                                data-oid="-g5:su9"
                                            >
                                                3,245 prescriptions
                                            </span>
                                        </p>
                                        <p className="text-xs text-cura-light" data-oid="tzngvk.">
                                            Achieved in December 2024
                                        </p>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-cura-secondary/5 to-transparent p-6 rounded-xl border border-cura-secondary/10"
                                        data-oid="989ts1-"
                                    >
                                        <h4
                                            className="font-semibold text-cura-secondary mb-3"
                                            data-oid="3h1mh5m"
                                        >
                                            Processing Efficiency
                                        </h4>
                                        <p
                                            className="text-sm text-cura-accent mb-2"
                                            data-oid="s0hx2-z"
                                        >
                                            Average processing time:{' '}
                                            <span
                                                className="font-bold text-cura-secondary"
                                                data-oid="uys:-5f"
                                            >
                                                1.9 minutes
                                            </span>
                                        </p>
                                        <p className="text-xs text-cura-light" data-oid="m6jn4:9">
                                            Fastest processing time achieved
                                        </p>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-cura-accent/5 to-transparent p-6 rounded-xl border border-cura-accent/10"
                                        data-oid="vatqk63"
                                    >
                                        <h4
                                            className="font-semibold text-cura-accent mb-3"
                                            data-oid="g9aytnw"
                                        >
                                            Team Growth
                                        </h4>
                                        <p
                                            className="text-sm text-cura-accent mb-2"
                                            data-oid="h07977y"
                                        >
                                            Reader team expanded:{' '}
                                            <span
                                                className="font-bold text-cura-accent"
                                                data-oid="6d.fd7q"
                                            >
                                                +40%
                                            </span>
                                        </p>
                                        <p className="text-xs text-cura-light" data-oid="64hqzku">
                                            From 5 to 7 active readers
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="users" className="space-y-6" data-oid="i:z2vee">
                    <Card
                        className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50"
                        data-oid="4k4.xvf"
                    >
                        <CardContent className="p-6" data-oid="io_xsip">
                            <div
                                className="flex flex-col lg:flex-row gap-4 items-center justify-between"
                                data-oid="ecb.wk5"
                            >
                                <div className="relative flex-1 max-w-md" data-oid="ifxbq5q">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                        data-oid="ypeuy:q"
                                    />

                                    <Input
                                        placeholder="Search readers by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border-gray-200 focus:border-cura-primary focus:ring-cura-primary/20"
                                        data-oid="wlbbyt4"
                                    />
                                </div>
                                <div className="flex gap-2" data-oid="yssq1aq">
                                    <Button
                                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                                        onClick={() => setStatusFilter('all')}
                                        className={`${statusFilter === 'all' ? 'bg-cura-primary hover:bg-cura-secondary' : 'hover:bg-cura-primary/10'}`}
                                        data-oid="o-d_lva"
                                    >
                                        All Users ({getFilterCount('all')})
                                    </Button>
                                    <Button
                                        variant={statusFilter === 'active' ? 'default' : 'outline'}
                                        onClick={() => setStatusFilter('active')}
                                        className={`${statusFilter === 'active' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-700'}`}
                                        data-oid="5oo6ta_"
                                    >
                                        Active ({getFilterCount('active')})
                                    </Button>
                                    <Button
                                        variant={
                                            statusFilter === 'inactive' ? 'default' : 'outline'
                                        }
                                        onClick={() => setStatusFilter('inactive')}
                                        className={`${statusFilter === 'inactive' ? 'bg-gray-600 hover:bg-gray-700' : 'hover:bg-gray-50 hover:text-gray-700'}`}
                                        data-oid="t59.z9x"
                                    >
                                        Offline ({getFilterCount('inactive')})
                                    </Button>
                                </div>
                                <Select
                                    value={sortBy}
                                    onValueChange={(value) => setSortBy(value as any)}
                                    data-oid="hjopjxb"
                                >
                                    <SelectTrigger
                                        className="w-48 border-gray-200"
                                        data-oid="_f5a-bk"
                                    >
                                        <Filter className="w-4 h-4 mr-2" data-oid="t7n-.qh" />
                                        <SelectValue placeholder="Sort by..." data-oid="i71ndg5" />
                                    </SelectTrigger>
                                    <SelectContent data-oid="alte8z_">
                                        <SelectItem value="name" data-oid="tka:30h">
                                            Name (A-Z)
                                        </SelectItem>
                                        <SelectItem value="accuracy" data-oid="6d7ft9_">
                                            Accuracy Rate
                                        </SelectItem>
                                        <SelectItem value="processed" data-oid="qr0g0py">
                                            Total Processed
                                        </SelectItem>
                                        <SelectItem value="workload" data-oid="cvxmk1o">
                                            Current Workload
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
                        data-oid="nlh6:px"
                    >
                        <CardContent className="p-0" data-oid=":1y2c9g">
                            <div className="overflow-x-auto" data-oid="zn.k0ob">
                                <table className="w-full" data-oid="g2tobkh">
                                    <thead data-oid="wt5efy7">
                                        <tr
                                            className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
                                            data-oid="cg4o7u:"
                                        >
                                            <th
                                                className="text-left p-4 font-semibold text-gray-700"
                                                data-oid="7jae8eh"
                                            >
                                                Reader
                                            </th>
                                            <th
                                                className="text-left p-4 font-semibold text-gray-700"
                                                data-oid="b6412ek"
                                            >
                                                Status
                                            </th>
                                            <th
                                                className="text-left p-4 font-semibold bg-gradient-to-r from-cura-primary to-cura-secondary bg-clip-text text-transparent"
                                                data-oid="ybdphtv"
                                            >
                                                Current Workload
                                            </th>
                                            <th
                                                className="text-left p-4 font-semibold bg-gradient-to-r from-cura-primary to-cura-secondary bg-clip-text text-transparent"
                                                data-oid="lyw1m0g"
                                            >
                                                Total Processed
                                            </th>
                                            <th
                                                className="text-left p-4 font-semibold text-gray-700"
                                                data-oid="kh3jqws"
                                            >
                                                Last Active
                                            </th>
                                            <th
                                                className="text-left p-4 font-semibold text-gray-700"
                                                data-oid="2yo-lyo"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody data-oid="_tcowu-">
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-cura-primary/5 hover:to-cura-secondary/5 transition-all duration-200 cursor-pointer ${selectedUser?.id === user.id ? 'bg-cura-primary/10' : ''}`}
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsUserModalOpen(true);
                                                }}
                                                data-oid="by:wq.b"
                                            >
                                                <td className="p-4" data-oid="kgkel4g">
                                                    <div
                                                        className="flex items-center gap-3"
                                                        data-oid="86s5oc8"
                                                    >
                                                        <Avatar
                                                            className="w-10 h-10 ring-2 ring-white shadow-md"
                                                            data-oid="g3xelzd"
                                                        >
                                                            <AvatarImage
                                                                src={user.avatar}
                                                                data-oid="e-rn75c"
                                                            />

                                                            <AvatarFallback
                                                                className="bg-gradient-to-br from-cura-primary to-cura-secondary text-white font-bold text-sm"
                                                                data-oid="w-5.qyr"
                                                            >
                                                                {user.name
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div data-oid="89zbrge">
                                                            <h3
                                                                className="font-semibold text-gray-900 hover:text-cura-primary transition-colors"
                                                                data-oid="n4sbapf"
                                                            >
                                                                {user.name}
                                                            </h3>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="8l_3dl-"
                                                            >
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4" data-oid=".6u8-s4">
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="scypz-6"
                                                    >
                                                        {getStatusIcon(user?.currentStatus)}
                                                        <Badge
                                                            className={`${getStatusColor(user?.currentStatus)} border font-medium`}
                                                            data-oid="m2n.clj"
                                                        >
                                                            {user?.currentStatus.charAt(0).toUpperCase() +
                                                                user?.currentStatus.slice(1)}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="p-4" data-oid="ob9_23x">
                                                    <div data-oid="b7e5_e4">
                                                        <div
                                                            className="text-xl font-bold bg-gradient-to-r from-cura-primary to-cura-secondary bg-clip-text text-transparent"
                                                            data-oid="trpbr0:"
                                                        >
                                                            {user.currentPrescriptions}
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-500 font-medium"
                                                            data-oid="kckkk_3"
                                                        >
                                                            active tasks
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4" data-oid="9zkmojn">
                                                    <div
                                                        className="text-xl font-bold bg-gradient-to-r from-cura-primary to-cura-secondary bg-clip-text text-transparent"
                                                        data-oid="pk48q-5"
                                                    >
                                                        {user.processedPrescriptions.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="p-4" data-oid="2.58bqi">
                                                    <div
                                                        className="text-sm text-gray-600"
                                                        data-oid="3l-y2d3"
                                                    >
                                                        {new Date(
                                                            user.lastActive,
                                                        ).toLocaleDateString()}
                                                        <br data-oid="0sx6cts" />
                                                        <span
                                                            className="text-xs text-gray-500"
                                                            data-oid="6jy:dkm"
                                                        >
                                                            {new Date(
                                                                user.lastActive,
                                                            ).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4" data-oid="4za.qqd">
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="9-qi189"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:bg-cura-primary/10 hover:text-cura-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedUser(user);
                                                                setIsUserModalOpen(true);
                                                            }}
                                                            data-oid="w69b9.n"
                                                        >
                                                            <Eye
                                                                className="w-4 h-4"
                                                                data-oid="29e-r89"
                                                            />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:bg-gray-100"
                                                            onClick={(e) => e.stopPropagation()}
                                                            data-oid="tf.cwpx"
                                                        >
                                                            <MoreVertical
                                                                className="w-4 h-4"
                                                                data-oid="w3eom61"
                                                            />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    {filteredUsers.length === 0 && (
                        <Card className="border-0 shadow-lg" data-oid="cfxueo3">
                            <CardContent className="p-12 text-center" data-oid="tl.xvgw">
                                <div
                                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    data-oid="36pc5-q"
                                >
                                    <Search className="w-8 h-8 text-gray-400" data-oid="_fy:ame" />
                                </div>
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="nkftuqk"
                                >
                                    No readers found
                                </h3>
                                <p className="text-gray-600" data-oid="u-e10pc">
                                    Try adjusting your search or filter criteria
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    <Dialog
                        open={isUserModalOpen}
                        onOpenChange={setIsUserModalOpen}
                        data-oid="gh:7hlh"
                    >
                        <DialogContent className="max-w-2xl p-0 bg-white" data-oid="ts9aa02">
                            {selectedUser && (
                                <>
                                    <div
                                        className="bg-gradient-to-r from-cura-primary to-cura-secondary text-white p-6"
                                        data-oid="5t2x:h1"
                                    >
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="ozw3xl7"
                                        >
                                            <div
                                                className="flex items-center gap-4"
                                                data-oid="sfekmm0"
                                            >
                                                <Avatar
                                                    className="w-16 h-16 ring-2 ring-white/30"
                                                    data-oid="_m8id3m"
                                                >
                                                    <AvatarImage
                                                        src={selectedUser.avatar}
                                                        data-oid="bizkvtr"
                                                    />

                                                    <AvatarFallback
                                                        className="bg-white/20 text-white font-bold text-lg"
                                                        data-oid="g_glv09"
                                                    >
                                                        {selectedUser.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div data-oid="p8zhuzf">
                                                    <DialogTitle
                                                        className="text-2xl font-bold mb-1"
                                                        data-oid="ph9qj-9"
                                                    >
                                                        {selectedUser.name}
                                                    </DialogTitle>
                                                    <p className="text-white/90" data-oid="_z.5ekd">
                                                        {selectedUser.email}
                                                    </p>
                                                    <div
                                                        className="flex items-center gap-2 mt-2"
                                                        data-oid="y0i602z"
                                                    >
                                                        {getStatusIcon(selecteduser?.currentStatus)}
                                                        <Badge
                                                            className={`${getStatusColor(selecteduser?.currentStatus)} border font-medium`}
                                                            data-oid="h0juits"
                                                        >
                                                            {selecteduser?.currentStatus
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                selecteduser?.currentStatus.slice(1)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setIsUserModalOpen(false);
                                                    setSelectedUser(null);
                                                }}
                                                className="text-white hover:bg-white/20"
                                                data-oid="pwh8.t8"
                                            >
                                                <X className="w-5 h-5" data-oid="tu52vy:" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-6" data-oid="u5_xxp6">
                                        <div
                                            className="grid grid-cols-2 gap-4 mb-6"
                                            data-oid="_ltuex:"
                                        >
                                            <Card
                                                className="text-center p-4 border-cura-primary/20"
                                                data-oid=".fe4d7e"
                                            >
                                                <div
                                                    className="text-2xl font-bold text-cura-primary mb-1"
                                                    data-oid="gbrme7s"
                                                >
                                                    {selectedUser.currentPrescriptions}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="8co:530"
                                                >
                                                    Current Workload
                                                </div>
                                            </Card>
                                            <Card
                                                className="text-center p-4 border-blue-200"
                                                data-oid="ec51avi"
                                            >
                                                <div
                                                    className="text-2xl font-bold text-blue-600 mb-1"
                                                    data-oid="dk92s7v"
                                                >
                                                    {selectedUser.processedPrescriptions}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="tgp1-zo"
                                                >
                                                    Total Processed
                                                </div>
                                            </Card>
                                        </div>
                                        <Card className="p-6" data-oid="g1mh7px">
                                            <div className="space-y-4" data-oid=".xist1.">
                                                <div
                                                    className="flex justify-between items-center py-2 border-b border-gray-100"
                                                    data-oid="nlvs2.g"
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="ylhtv4y"
                                                    >
                                                        Joined Date
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid="t2y42n_"
                                                    >
                                                        {new Date(
                                                            selectedUser.joinedDate,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div
                                                    className="flex justify-between items-center py-2 border-b border-gray-100"
                                                    data-oid="qn-v_rk"
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="-3w99_s"
                                                    >
                                                        Last Active
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        data-oid="tf93:cp"
                                                    >
                                                        {new Date(
                                                            selectedUser.lastActive,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div
                                                    className="flex justify-between items-center py-2"
                                                    data-oid="2ubqu:u"
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="tu3u-.n"
                                                    >
                                                        Performance Rating
                                                    </span>
                                                    <Badge
                                                        className="bg-green-100 text-green-800 border-green-200"
                                                        data-oid="5g_fdzh"
                                                    >
                                                        {selectedUser.accuracyRate >= 95
                                                            ? 'Excellent'
                                                            : selectedUser.accuracyRate >= 90
                                                              ? 'Good'
                                                              : selectedUser.accuracyRate >= 80
                                                                ? 'Average'
                                                                : 'Needs Improvement'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card>
                                        <div className="flex justify-end mt-6" data-oid="fp.3rwp">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsUserModalOpen(false);
                                                    setSelectedUser(null);
                                                }}
                                                data-oid="3osqnz5"
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </TabsContent>
                <TabsContent value="workflow" className="space-y-6" data-oid="okp7j-b">
                    <Card
                        className="border-0 shadow-lg bg-gradient-to-r from-cura-primary to-cura-secondary text-white"
                        data-oid="kppg.hv"
                    >
                        <CardContent className="p-6" data-oid="ko7c865">
                            <div className="flex items-center justify-between" data-oid="sutdnm3">
                                <div className="flex items-center gap-3" data-oid="xc3sfgt">
                                    <div
                                        className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                                        data-oid="2dbpdqh"
                                    ></div>
                                    <div data-oid=":ot5num">
                                        <h2 className="text-xl font-bold" data-oid="6yn4m1k">
                                            Live Prescription Workflow
                                        </h2>
                                        <p className="text-white/90" data-oid="espgio2">
                                            Real-time prescription processing status
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right" data-oid="l78yrkt">
                                    <div className="text-2xl font-bold" data-oid="7s.cu9k">
                                        {livePrescriptions.length}
                                    </div>
                                    <div className="text-sm text-white/90" data-oid="mpk.:i7">
                                        Active Prescriptions
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg" data-oid="cc1acu:">
                        <CardContent className="p-4" data-oid="5oq23ir">
                            <div className="flex items-center gap-4" data-oid="gqtgn6h">
                                <h3
                                    className="text-sm font-medium text-gray-700"
                                    data-oid="ud3yyg9"
                                >
                                    Filter by Status:
                                </h3>
                                <div className="flex gap-2" data-oid=".kxng.q">
                                    <Button
                                        variant={
                                            prescriptionFilter === 'all' ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setPrescriptionFilter('all')}
                                        data-oid="gux0lh1"
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={
                                            prescriptionFilter === 'processing'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setPrescriptionFilter('processing')}
                                        data-oid="97abipw"
                                    >
                                        Processing
                                    </Button>
                                    <Button
                                        variant={
                                            prescriptionFilter === 'completed'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setPrescriptionFilter('completed')}
                                        data-oid="6z_0svj"
                                    >
                                        Completed
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-6" data-oid="_dg60c:">
                        <div className="flex-1 space-y-4" data-oid="pfwi0sx">
                            {livePrescriptions
                                .filter((prescription) => {
                                    if (prescriptionFilter === 'all') return true;
                                    if (prescriptionFilter === 'processing')
                                        return prescription.status === 'processing';
                                    if (prescriptionFilter === 'completed')
                                        return (
                                            prescription.status === 'approved' ||
                                            prescription.status === 'completed'
                                        );

                                    return true;
                                })
                                .map((prescription) => (
                                    <Card
                                        key={prescription.id}
                                        className={`border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${prescription.status === 'approved' ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-white' : prescription.status === 'processing' ? 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white' : 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-white'}`}
                                        data-oid="st0x:3x"
                                    >
                                        <CardContent className="p-6" data-oid="b1.bk4l">
                                            <div
                                                className="flex items-center justify-between mb-4"
                                                data-oid="it:.fvb"
                                            >
                                                <div
                                                    className="flex items-center gap-4"
                                                    data-oid="y3ysggp"
                                                >
                                                    <div
                                                        className="p-3 bg-cura-primary/10 rounded-lg"
                                                        data-oid="2nro2mb"
                                                    >
                                                        <svg
                                                            className="w-6 h-6 text-cura-primary"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="fxrnbv."
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                data-oid="pa2.npr"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div data-oid="qq.hpjx">
                                                        <h3
                                                            className="text-lg font-bold text-gray-900"
                                                            data-oid="09spyrl"
                                                        >
                                                            {prescription.id}
                                                        </h3>
                                                        <div
                                                            className="flex items-center gap-4 text-sm text-gray-600"
                                                            data-oid="qn6w75h"
                                                        >
                                                            <div
                                                                className="flex items-center gap-2"
                                                                data-oid="nn:9.8o"
                                                            >
                                                                <User
                                                                    className="w-4 h-4 text-cura-primary"
                                                                    data-oid=".9ewbc1"
                                                                />

                                                                <span data-oid="9hasoob">
                                                                    Patient:{' '}
                                                                    <strong data-oid="5ktaija">
                                                                        {prescription.patientName}
                                                                    </strong>
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="flex items-center gap-2"
                                                                data-oid="h1:_vg4"
                                                            >
                                                                <Stethoscope
                                                                    className="w-4 h-4 text-cura-primary"
                                                                    data-oid="7ed3dn1"
                                                                />

                                                                <span data-oid="y-j:m_j">
                                                                    Doctor:{' '}
                                                                    <strong data-oid="3ua:wz-">
                                                                        {prescription.doctorName}
                                                                    </strong>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex flex-col gap-2"
                                                    data-oid="odnl0ak"
                                                >
                                                    <Badge
                                                        className={`${prescription.status === 'approved' || prescription.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} font-semibold px-3 py-1 flex items-center gap-1`}
                                                        data-oid="v:p2tsj"
                                                    >
                                                        {prescription.status === 'approved' ||
                                                        prescription.status === 'completed' ? (
                                                            <CheckCircle
                                                                className="w-3 h-3"
                                                                data-oid="dnav9fv"
                                                            />
                                                        ) : (
                                                            <Clock
                                                                className="w-3 h-3"
                                                                data-oid=".jkdv.5"
                                                            />
                                                        )}
                                                        {prescription.status === 'approved' ||
                                                        prescription.status === 'completed'
                                                            ? 'COMPLETED'
                                                            : 'PROCESSING'}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs"
                                                        onClick={() => {
                                                            setSelectedPrescription(prescription);
                                                            setIsPrescriptionModalOpen(true);
                                                        }}
                                                        data-oid="mw_.mdg"
                                                    >
                                                        <Eye
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="h5aoxph"
                                                        />
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="mb-4" data-oid="o9:07fc">
                                                <div
                                                    className="flex items-center gap-2 mb-3"
                                                    data-oid="17mfpwy"
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-cura-primary"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="_n.enzq"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                                            data-oid=".s-17c0"
                                                        />
                                                    </svg>
                                                    <h4
                                                        className="font-semibold text-gray-900"
                                                        data-oid="q_.2r2f"
                                                    >
                                                        Prescribed Medicines
                                                    </h4>
                                                </div>
                                                <div className="grid gap-3" data-oid="x65uz28">
                                                    {prescription.medicines.map(
                                                        (medicine, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                                                data-oid="l7asnlh"
                                                            >
                                                                <div
                                                                    className="flex items-start gap-4"
                                                                    data-oid="urprudg"
                                                                >
                                                                    <div
                                                                        className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0"
                                                                        data-oid="e307kv6"
                                                                    >
                                                                        <MedicineImage
                                                                            src={medicine.image}
                                                                            alt={medicine.name}
                                                                            className="w-full h-full object-cover"
                                                                            fallbackClassName="w-8 h-8 text-gray-400"
                                                                            data-oid="lzx7ffc"
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="flex-1"
                                                                        data-oid="170szl:"
                                                                    >
                                                                        <h5
                                                                            className="font-bold text-cura-primary text-lg mb-1"
                                                                            data-oid="9225xv-"
                                                                        >
                                                                            {medicine.name}
                                                                        </h5>
                                                                        {medicine.activeIngredient && (
                                                                            <p
                                                                                className="text-sm text-gray-600 mb-1"
                                                                                data-oid="adsbf29"
                                                                            >
                                                                                Active:{' '}
                                                                                {
                                                                                    medicine.activeIngredient
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {medicine.manufacturer && (
                                                                            <p
                                                                                className="text-xs text-gray-500 mb-3"
                                                                                data-oid="npj58pj"
                                                                            >
                                                                                Mfg:{' '}
                                                                                {
                                                                                    medicine.manufacturer
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        <div
                                                                            className="grid grid-cols-3 gap-4 text-sm"
                                                                            data-oid="h3c6ndm"
                                                                        >
                                                                            <div data-oid="nty70pb">
                                                                                <span
                                                                                    className="text-gray-500 block"
                                                                                    data-oid="ehmrfar"
                                                                                >
                                                                                    Dosage:
                                                                                </span>
                                                                                <div
                                                                                    className="font-semibold text-gray-900"
                                                                                    data-oid="16mhu4f"
                                                                                >
                                                                                    {
                                                                                        medicine.dosage
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div data-oid="c803zd1">
                                                                                <span
                                                                                    className="text-gray-500 block"
                                                                                    data-oid="adlrgbh"
                                                                                >
                                                                                    Frequency:
                                                                                </span>
                                                                                <div
                                                                                    className="font-semibold text-gray-900"
                                                                                    data-oid="modhl3s"
                                                                                >
                                                                                    {
                                                                                        medicine.frequency
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div data-oid="xp-ngq:">
                                                                                <span
                                                                                    className="text-gray-500 block"
                                                                                    data-oid="f95n:1v"
                                                                                >
                                                                                    Duration:
                                                                                </span>
                                                                                <div
                                                                                    className="font-semibold text-gray-900"
                                                                                    data-oid="_m87mhh"
                                                                                >
                                                                                    {
                                                                                        medicine.duration
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                                data-oid="oipcg1_"
                                            >
                                                <div
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                    data-oid="k8g:u:i"
                                                >
                                                    <div
                                                        className="flex items-center gap-3"
                                                        data-oid="-7-ld6g"
                                                    >
                                                        <div
                                                            className="p-2 bg-cura-primary/10 rounded-lg"
                                                            data-oid="zf.vnpg"
                                                        >
                                                            <svg
                                                                className="w-5 h-5 text-cura-primary"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="lx77ng2"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                    data-oid="7ube._y"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div data-oid="w-_zt3l">
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="24.ckp:"
                                                            >
                                                                Read by
                                                            </div>
                                                            <div
                                                                className="font-semibold text-gray-900"
                                                                data-oid="h2hbl58"
                                                            >
                                                                {prescription.readerName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-3"
                                                        data-oid=":wzab7l"
                                                    >
                                                        <div
                                                            className="p-2 bg-blue-100 rounded-lg"
                                                            data-oid="_f.hacz"
                                                        >
                                                            <svg
                                                                className="w-5 h-5 text-blue-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="gnjlin1"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    data-oid="m-xm5-_"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div data-oid="at63agh">
                                                            <div
                                                                className="text-sm text-gray-500"
                                                                data-oid="0g:p0ne"
                                                            >
                                                                Processed at
                                                            </div>
                                                            <div
                                                                className="font-semibold text-gray-900"
                                                                data-oid="6f4v9:k"
                                                            >
                                                                {new Date(
                                                                    prescription.processedAt,
                                                                ).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            {livePrescriptions.length === 0 && (
                                <Card className="border-0 shadow-lg" data-oid="xnx3v6c">
                                    <CardContent className="p-12 text-center" data-oid="v.1b-3:">
                                        <div
                                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            data-oid="dn12w2k"
                                        >
                                            <Activity
                                                className="w-8 h-8 text-gray-400"
                                                data-oid="9s:r7px"
                                            />
                                        </div>
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-2"
                                            data-oid="m9xwabf"
                                        >
                                            No Active Prescriptions
                                        </h3>
                                        <p className="text-gray-600" data-oid="4crtju9">
                                            All prescriptions have been processed
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        <div className="w-80 space-y-4" data-oid="2sy1n:3">
                            <Card
                                className="border-0 shadow-lg bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10"
                                data-oid="j_y3prn"
                            >
                                <CardContent className="p-4" data-oid=":hqdbck">
                                    <div
                                        className="flex items-center justify-between mb-2"
                                        data-oid="x-pi:0q"
                                    >
                                        <h3
                                            className="text-lg font-semibold text-cura-primary"
                                            data-oid="_re9qi0"
                                        >
                                            Today{"'"}s Prescriptions
                                        </h3>
                                        <Badge
                                            variant="secondary"
                                            className="bg-cura-primary/10 text-cura-primary border-cura-primary/20"
                                            data-oid="fq-7swz"
                                        >
                                            {new Date().toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-cura-accent" data-oid="z1hqyqo">
                                        All prescriptions processed today
                                    </p>
                                </CardContent>
                            </Card>
                            <Card
                                className="border-0 shadow-lg bg-gradient-to-br from-cura-primary/10 to-cura-secondary/10"
                                data-oid="kme0e3g"
                            >
                                <CardContent className="p-4" data-oid="l57wpli">
                                    <h4
                                        className="text-sm font-semibold text-cura-primary mb-3"
                                        data-oid="_tx9x_f"
                                    >
                                        Daily Overview
                                    </h4>
                                    <div className="space-y-2" data-oid="ir8.6kj">
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="l67pji2"
                                        >
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="_ukpk.p"
                                            >
                                                <div
                                                    className="w-2 h-2 bg-cura-accent rounded-full"
                                                    data-oid="kfign0l"
                                                ></div>
                                                <span
                                                    className="text-xs text-cura-accent"
                                                    data-oid="rrag84q"
                                                >
                                                    Approved
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-cura-accent/10 text-cura-accent border-cura-accent/20"
                                                data-oid="e78faol"
                                            >
                                                3
                                            </Badge>
                                        </div>
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="hhrvkcw"
                                        >
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="m3ewq:b"
                                            >
                                                <div
                                                    className="w-2 h-2 bg-cura-secondary rounded-full"
                                                    data-oid="2hockd4"
                                                ></div>
                                                <span
                                                    className="text-xs text-cura-secondary"
                                                    data-oid="04x06nq"
                                                >
                                                    Processing
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-cura-secondary/10 text-cura-secondary border-cura-secondary/20"
                                                data-oid="7twm67c"
                                            >
                                                2
                                            </Badge>
                                        </div>
                                        <div
                                            className="flex items-center justify-between"
                                            data-oid="l1z67n5"
                                        >
                                            <div
                                                className="flex items-center space-x-2"
                                                data-oid="7cforer"
                                            >
                                                <div
                                                    className="w-2 h-2 bg-cura-primary rounded-full"
                                                    data-oid="_y.knq3"
                                                ></div>
                                                <span
                                                    className="text-xs text-cura-primary"
                                                    data-oid="ene:3r2"
                                                >
                                                    Completed
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-cura-primary/10 text-cura-primary border-cura-primary/20"
                                                data-oid="_6jy10_"
                                            >
                                                5
                                            </Badge>
                                        </div>
                                        <div
                                            className="pt-2 border-t border-cura-light/30"
                                            data-oid="i4e1k9g"
                                        >
                                            <div
                                                className="flex items-center justify-between"
                                                data-oid="x2pnnzq"
                                            >
                                                <span
                                                    className="text-sm font-medium text-cura-primary"
                                                    data-oid="pla5:9q"
                                                >
                                                    Total Today
                                                </span>
                                                <Badge
                                                    className="bg-cura-gradient text-white"
                                                    data-oid="9cgx0y6"
                                                >
                                                    10
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card
                                className="border-0 shadow-lg bg-gradient-to-br from-cura-primary/5 to-cura-secondary/5"
                                data-oid="woebhiz"
                            >
                                <CardContent className="p-4" data-oid="g5e.-gk">
                                    <h4
                                        className="text-sm font-semibold text-cura-primary mb-3"
                                        data-oid="qbo40:p"
                                    >
                                        Today{"'"}s Activity
                                    </h4>
                                    <div
                                        className="space-y-3 max-h-96 overflow-y-auto"
                                        data-oid="6:gdl3i"
                                    >
                                        {livePrescriptions.map((prescription) => (
                                            <Card
                                                key={prescription.id}
                                                className="hover:shadow-md transition-all duration-200 cursor-pointer border-cura-light/30 hover:border-cura-primary/50"
                                                onClick={() =>
                                                    handleActivityPrescriptionClick(prescription.id)
                                                }
                                                data-oid="wa5euk."
                                            >
                                                <CardContent className="p-3" data-oid="fs-_9ba">
                                                    <div
                                                        className="flex items-start justify-between mb-2"
                                                        data-oid="ht-12_p"
                                                    >
                                                        <div
                                                            className="flex-1 min-w-0"
                                                            data-oid="7rp5vz:"
                                                        >
                                                            <h5
                                                                className="text-sm font-semibold text-cura-primary truncate"
                                                                data-oid="z:sd9qp"
                                                            >
                                                                {prescription.id}
                                                            </h5>
                                                            <p
                                                                className="text-xs text-cura-accent truncate"
                                                                data-oid="7e3-v4v"
                                                            >
                                                                {prescription.patientName}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="flex flex-col items-end space-y-1"
                                                            data-oid="u:va17n"
                                                        >
                                                            <span
                                                                className="text-xs font-medium text-cura-light"
                                                                data-oid="2zsuxow"
                                                            >
                                                                {new Date(
                                                                    prescription.processedAt,
                                                                ).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: false,
                                                                })}
                                                            </span>
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${prescription.status === 'completed' ? 'bg-cura-primary' : prescription.status === 'approved' ? 'bg-cura-accent' : 'bg-cura-secondary'}`}
                                                                data-oid=".oz2o:-"
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex items-center justify-between"
                                                        data-oid="0shwrw3"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="xk0.rtv"
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${prescription.status === 'completed' ? 'bg-cura-primary/10 text-cura-primary border-cura-primary/20' : prescription.status === 'approved' ? 'bg-cura-accent/10 text-cura-accent border-cura-accent/20' : 'bg-cura-secondary/10 text-cura-secondary border-cura-secondary/20'}`}
                                                                data-oid="sdqtk6s"
                                                            >
                                                                {prescription.status}
                                                            </Badge>
                                                        </div>
                                                        <span
                                                            className="text-xs text-cura-light"
                                                            data-oid="u_t_pq0"
                                                        >
                                                            {prescription.medicines.length} med
                                                            {prescription.medicines.length !== 1
                                                                ? 's'
                                                                : ''}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="mt-2 pt-2 border-t border-cura-light/20"
                                                        data-oid="06cxt:s"
                                                    >
                                                        <p
                                                            className="text-xs text-cura-light truncate"
                                                            data-oid="2sk:b:-"
                                                        >
                                                            {prescription.doctorName}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            {/* Prescription Details Modal */}
            <Dialog
                open={isPrescriptionModalOpen}
                onOpenChange={setIsPrescriptionModalOpen}
                data-oid="lp55f8c"
            >
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white"
                    data-oid="ad97jbi"
                >
                    {selectedPrescription && (
                        <>
                            <div className="bg-cura-gradient text-white p-6" data-oid="5id.74l">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="70871xi"
                                >
                                    <div className="flex items-center gap-4" data-oid="gox8p9d">
                                        <div
                                            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                                            data-oid=":5nexh0"
                                        >
                                            <FileText className="w-6 h-6" data-oid="1xk9m66" />
                                        </div>
                                        <div data-oid="2d1:hzm">
                                            <DialogTitle
                                                className="text-2xl font-bold mb-1"
                                                data-oid="mzep_c7"
                                            >
                                                {selectedPrescription.id}
                                            </DialogTitle>
                                            <p className="text-white/90" data-oid="h3ub4_7">
                                                Prescription Details
                                            </p>
                                            <div
                                                className="flex items-center gap-4 mt-2 text-sm"
                                                data-oid="tth5k.9"
                                            >
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="1-q8mn3"
                                                >
                                                    <User className="w-4 h-4" data-oid="8xc6uj:" />
                                                    <span data-oid=".7_ijta">
                                                        {selectedPrescription.patientName}
                                                    </span>
                                                </div>
                                                <div
                                                    className="flex items-center gap-2"
                                                    data-oid="0xcesj2"
                                                >
                                                    <Stethoscope
                                                        className="w-4 h-4"
                                                        data-oid="9ac3dvl"
                                                    />

                                                    <span data-oid="05ybgcx">
                                                        {selectedPrescription.doctorName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setIsPrescriptionModalOpen(false);
                                            setSelectedPrescription(null);
                                        }}
                                        className="text-white hover:bg-white/20"
                                        data-oid="3rsyh5b"
                                    >
                                        <X className="w-5 h-5" data-oid="33se1lk" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6" data-oid="khejs2q">
                                <div
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                    data-oid="24y04pt"
                                >
                                    {/* Prescription Image */}
                                    <div data-oid="r0_cczz">
                                        <div
                                            className="flex items-center gap-2 mb-4"
                                            data-oid="i76:bv:"
                                        >
                                            <ImageIcon
                                                className="w-5 h-5 text-cura-primary"
                                                data-oid="geazpco"
                                            />

                                            <h3
                                                className="text-lg font-semibold text-gray-900"
                                                data-oid="n8bd90q"
                                            >
                                                Original Prescription
                                            </h3>
                                        </div>
                                        <div
                                            className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                            onClick={() =>
                                                selectedPrescription.prescriptionImage &&
                                                setIsImageModalOpen(true)
                                            }
                                            data-oid="vkg:nhh"
                                        >
                                            {selectedPrescription.prescriptionImage ? (
                                                <div className="relative group" data-oid="67.mpms">
                                                    <img
                                                        src={selectedPrescription.prescriptionImage}
                                                        alt="Prescription"
                                                        className="w-full h-auto max-h-96 object-contain hover:scale-105 transition-transform duration-200"
                                                        data-oid="m1qmplk"
                                                    />

                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                                                        data-oid=":-l_p0u"
                                                    >
                                                        <div
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2"
                                                            data-oid="5_ax:yx"
                                                        >
                                                            <svg
                                                                className="w-6 h-6 text-gray-700"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="yex1uj:"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                                                    data-oid="hlnolh0"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="h-96 flex items-center justify-center"
                                                    data-oid="3pnzytp"
                                                >
                                                    <div className="text-center" data-oid="3kb_9_0">
                                                        <ImageIcon
                                                            className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                                            data-oid=".o.fawz"
                                                        />

                                                        <p
                                                            className="text-gray-500"
                                                            data-oid="kpnogwi"
                                                        >
                                                            No image available
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Processing Info */}
                                        <div
                                            className="mt-4 p-4 bg-gray-50 rounded-lg"
                                            data-oid="r.jtwnn"
                                        >
                                            <div
                                                className="grid grid-cols-2 gap-4 text-sm"
                                                data-oid="55q4jya"
                                            >
                                                <div data-oid="1a3zk6l">
                                                    <span
                                                        className="text-gray-500 block"
                                                        data-oid="31gzca7"
                                                    >
                                                        Processed by:
                                                    </span>
                                                    <span
                                                        className="font-semibold text-gray-900"
                                                        data-oid="4ktnkzg"
                                                    >
                                                        {selectedPrescription.readerName}
                                                    </span>
                                                </div>
                                                <div data-oid="hhoi:ld">
                                                    <span
                                                        className="text-gray-500 block"
                                                        data-oid="9lfr63r"
                                                    >
                                                        Status:
                                                    </span>
                                                    <Badge
                                                        className={`${
                                                            selectedPrescription.status ===
                                                                'approved' ||
                                                            selectedPrescription.status ===
                                                                'completed'
                                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}
                                                        data-oid="lrpqfz3"
                                                    >
                                                        {selectedPrescription.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <div data-oid="5v.0yu.">
                                                    <span
                                                        className="text-gray-500 block"
                                                        data-oid="8f43jaw"
                                                    >
                                                        Processed at:
                                                    </span>
                                                    <span
                                                        className="font-semibold text-gray-900"
                                                        data-oid="::tf:8o"
                                                    >
                                                        {new Date(
                                                            selectedPrescription.processedAt,
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Medicines List */}
                                    <div data-oid="1b388lw">
                                        <div
                                            className="flex items-center gap-2 mb-4"
                                            data-oid="_itu8z6"
                                        >
                                            <Pill
                                                className="w-5 h-5 text-cura-primary"
                                                data-oid="u-3kxwu"
                                            />

                                            <h3
                                                className="text-lg font-semibold text-gray-900"
                                                data-oid="v8:3-ll"
                                            >
                                                Prescribed Medicines (
                                                {selectedPrescription.medicines.length})
                                            </h3>
                                        </div>
                                        <div
                                            className="space-y-4 max-h-96 overflow-y-auto"
                                            data-oid="ss221z1"
                                        >
                                            {selectedPrescription.medicines.map(
                                                (medicine, index) => (
                                                    <div
                                                        key={index}
                                                        className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                                                        data-oid=".czgtkc"
                                                    >
                                                        <div
                                                            className="flex items-start gap-4"
                                                            data-oid="wwqv.80"
                                                        >
                                                            <div
                                                                className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0"
                                                                data-oid="0f8lee7"
                                                            >
                                                                <MedicineImage
                                                                    src={medicine.image}
                                                                    alt={medicine.name}
                                                                    className="w-full h-full object-cover"
                                                                    fallbackClassName="w-8 h-8 text-gray-400"
                                                                    data-oid=":6q...n"
                                                                />
                                                            </div>
                                                            <div
                                                                className="flex-1"
                                                                data-oid="ksd1gq6"
                                                            >
                                                                <h4
                                                                    className="font-bold text-cura-primary text-lg mb-1"
                                                                    data-oid="w9ai:44"
                                                                >
                                                                    {medicine.name}
                                                                </h4>
                                                                {medicine.activeIngredient && (
                                                                    <p
                                                                        className="text-sm text-gray-600 mb-1"
                                                                        data-oid="7fe:77e"
                                                                    >
                                                                        <span
                                                                            className="font-medium"
                                                                            data-oid="fagoqoo"
                                                                        >
                                                                            Active:
                                                                        </span>{' '}
                                                                        {medicine.activeIngredient}
                                                                    </p>
                                                                )}
                                                                {medicine.manufacturer && (
                                                                    <p
                                                                        className="text-xs text-gray-500 mb-3"
                                                                        data-oid="a:wt:0n"
                                                                    >
                                                                        <span
                                                                            className="font-medium"
                                                                            data-oid="pgca74d"
                                                                        >
                                                                            Manufacturer:
                                                                        </span>{' '}
                                                                        {medicine.manufacturer}
                                                                    </p>
                                                                )}
                                                                <div
                                                                    className="grid grid-cols-1 gap-2 text-sm"
                                                                    data-oid="l.6jdbt"
                                                                >
                                                                    <div
                                                                        className="flex justify-between"
                                                                        data-oid="3e1jmjn"
                                                                    >
                                                                        <span
                                                                            className="text-gray-500"
                                                                            data-oid="qqnxp80"
                                                                        >
                                                                            Dosage:
                                                                        </span>
                                                                        <span
                                                                            className="font-semibold text-gray-900"
                                                                            data-oid="l..i67g"
                                                                        >
                                                                            {medicine.dosage}
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="flex justify-between"
                                                                        data-oid="a9r9:fs"
                                                                    >
                                                                        <span
                                                                            className="text-gray-500"
                                                                            data-oid="jkcd0xa"
                                                                        >
                                                                            Frequency:
                                                                        </span>
                                                                        <span
                                                                            className="font-semibold text-gray-900"
                                                                            data-oid="7wjg1dx"
                                                                        >
                                                                            {medicine.frequency}
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="flex justify-between"
                                                                        data-oid="jv2_7bv"
                                                                    >
                                                                        <span
                                                                            className="text-gray-500"
                                                                            data-oid="k90vj:n"
                                                                        >
                                                                            Duration:
                                                                        </span>
                                                                        <span
                                                                            className="font-semibold text-gray-900"
                                                                            data-oid="yfds1ob"
                                                                        >
                                                                            {medicine.duration}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex justify-end mt-6 pt-6 border-t border-gray-200"
                                    data-oid="k2cksrn"
                                >
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsPrescriptionModalOpen(false);
                                            setSelectedPrescription(null);
                                        }}
                                        data-oid="fsm4g6b"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            {/* Image Modal for Prescription Viewing */}
            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen} data-oid="32o8vgq">
                <DialogContent
                    className="max-w-7xl max-h-[95vh] p-2 bg-black/90"
                    data-oid="1yvvkh9"
                >
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        data-oid="cw.vy07"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 bg-black/50"
                            data-oid="yk5ylf."
                        >
                            <X className="w-6 h-6" data-oid="1sfpu2d" />
                        </Button>
                        {selectedPrescription?.prescriptionImage && (
                            <img
                                src={selectedPrescription.prescriptionImage}
                                alt="Prescription - Full View"
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                                data-oid="tl3y3d2"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
