'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import {
    PrescriptionWorkflow,
    PrescriptionStatus,
    PrescriptionUrgency,
    mockPrescriptionWorkflows,
} from '@/lib/data/prescriptionWorkflow';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrescriptionImageViewer } from '@/components/admin/PrescriptionImageViewer';

import {
    FileText,
    Clock,
    User,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Search,
    Filter,
    RefreshCw,
    TrendingUp,
    Users,
    Activity,
    Pill,
    MapPin,
    Building,
    Stethoscope,
    ShoppingCart,
    Package,
    Timer,
    Star,
    AlertTriangle,
    Info,
    Download,
    MoreHorizontal,
    Maximize2,
} from 'lucide-react';

interface PrescriptionStats {
    total: number;
    submitted: number;
    reviewing: number;
    approved: number;
    rejected: number;
    suspended: number;
    withOrders: number;
    withoutOrders: number;
}

interface PrescriptionFilters {
    status?: PrescriptionStatus;
    urgency?: PrescriptionUrgency;
    hasOrder?: boolean;
    dateFrom?: string;
    dateTo?: string;
    searchQuery?: string;
}

export default function AdminPrescriptionsPage() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWorkflow | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<PrescriptionStats>({
        total: 0,
        submitted: 0,
        reviewing: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
        withOrders: 0,
        withoutOrders: 0,
    });

    const [filters, setFilters] = useState<PrescriptionFilters>({});
    const [activeTab, setActiveTab] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load prescriptions data
    const loadPrescriptions = async () => {
        try {
            setIsLoading(true);
            // Get all prescriptions for admin view
            const data = mockPrescriptionWorkflows;
            if(data){
                // Sort by creation date (newest first)
                const sortedData = [...data].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
    
                setPrescriptions(sortedData);
    
                // Calculate stats
                const newStats: PrescriptionStats = {
                    total: sortedData.length,
                    submitted: sortedData.filter((p) => p.currentStatus === 'submitted').length,
                    reviewing: sortedData.filter((p) => p.currentStatus === 'reviewing').length,
                    approved: sortedData.filter((p) => p.currentStatus === 'approved').length,
                    rejected: sortedData.filter((p) => p.currentStatus === 'rejected').length,
                    suspended: sortedData.filter((p) => p.currentStatus === 'suspended').length,
                    withOrders: sortedData.filter(
                        (p) => p.processedMedicines && p.processedMedicines.length > 0,
                    ).length,
                    withoutOrders: sortedData.filter(
                        (p) => !p.processedMedicines || p.processedMedicines.length === 0,
                    ).length,
                };
    
                setStats(newStats);
            }
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Apply filters to prescriptions
    const applyFilters = () => {
        let filtered = [...prescriptions];

        // Tab filter
        if (activeTab !== 'all') {
            switch (activeTab) {
                case 'pending':
                    filtered = filtered.filter((p) =>
                        ['submitted', 'reviewing'].includes(p.currentStatus),
                    );
                    break;
                case 'completed':
                    filtered = filtered.filter((p) => p.currentStatus === 'approved');
                    break;
                case 'issues':
                    filtered = filtered.filter((p) =>
                        ['rejected', 'suspended'].includes(p.currentStatus),
                    );
                    break;
                case 'with-orders':
                    filtered = filtered.filter(
                        (p) => p.processedMedicines && p.processedMedicines.length > 0,
                    );
                    break;
            }
        }

        // Status filter
        if (filters.status) {
            filtered = filtered.filter((p) => p.currentStatus === filters.status);
        }

        // Urgency filter
        if (filters.urgency) {
            filtered = filtered.filter((p) => p.urgency === filters.urgency);
        }

        // Has order filter
        if (filters.hasOrder !== undefined) {
            if (filters.hasOrder) {
                filtered = filtered.filter(
                    (p) => p.processedMedicines && p.processedMedicines.length > 0,
                );
            } else {
                filtered = filtered.filter(
                    (p) => !p.processedMedicines || p.processedMedicines.length === 0,
                );
            }
        }

        // Search filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.id.toLowerCase().includes(query) ||
                    p.customerName.toLowerCase().includes(query) ||
                    p.patientName.toLowerCase().includes(query) ||
                    p.customerPhone.includes(query) ||
                    (p.assignedReaderId && 'dr. sarah mohamed'.includes(query)),
            );
        }

        // Date filters
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter((p) => new Date(p.createdAt) >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter((p) => new Date(p.createdAt) <= toDate);
        }

        setFilteredPrescriptions(filtered);
    };

    // Auto-refresh functionality
    useEffect(() => {
        if (autoRefresh) {
            refreshIntervalRef.current = setInterval(() => {
                loadPrescriptions();
            }, 30000); // Refresh every 30 seconds
        } else {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [autoRefresh]);

    // Initial load and filter application
    useEffect(() => {
        loadPrescriptions();
    }, []);

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prescriptions, filters, activeTab]);

    // Utility functions
    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(d);
    };

    const getStatusColor = (status: PrescriptionStatus) => {
        const colors = {
            submitted: 'bg-[#F1F6F9] text-[#14274E] border-[#9BA4B4]',
            reviewing: 'bg-amber-100 text-amber-800 border-amber-200',
            approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            rejected: 'bg-rose-100 text-rose-800 border-rose-200',
            cancelled: 'bg-[#F1F6F9] text-[#9BA4B4] border-[#9BA4B4]',
            suspended: 'bg-orange-100 text-orange-800 border-orange-200',
        };
        return colors[status] || 'bg-[#F1F6F9] text-[#9BA4B4] border-[#9BA4B4]';
    };

    const getUrgencyColor = (urgency: PrescriptionUrgency) => {
        const colors = {
            urgent: 'bg-rose-100 text-rose-800 border-rose-200',
            normal: 'bg-[#F1F6F9] text-[#14274E] border-[#9BA4B4]',
            routine: 'bg-[#F1F6F9] text-[#9BA4B4] border-[#9BA4B4]',
        };
        return colors[urgency] || 'bg-[#F1F6F9] text-[#9BA4B4] border-[#9BA4B4]';
    };

    const getStatusIcon = (status: PrescriptionStatus) => {
        switch (status) {
            case 'submitted':
                return <FileText className="w-4 h-4" data-oid="t0b_n1u" />;
            case 'reviewing':
                return <Eye className="w-4 h-4" data-oid="iikhsun" />;
            case 'approved':
                return <CheckCircle className="w-4 h-4" data-oid="2-cs:nz" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" data-oid="p-axxzn" />;
            case 'suspended':
                return <AlertCircle className="w-4 h-4" data-oid="8wzilm-" />;
            default:
                return <FileText className="w-4 h-4" data-oid="-mryy98" />;
        }
    };

    const clearFilters = () => {
        setFilters({});
        setActiveTab('all');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]" data-oid="3e4bfmk">
                <div className="text-center" data-oid="0mc39x9">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                        data-oid="_i53uu8"
                    ></div>
                    <p className="text-gray-600" data-oid=":28by87">
                        Loading prescriptions...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="1:hacqg">
            {/* Header */}
            <div className="flex items-center justify-between" data-oid="_v8xah4">
                <div data-oid="-h8c6d1">
                    <h1 className="text-2xl font-bold text-[#14274E]" data-oid="uqm3k:e">
                        Prescription Management
                    </h1>
                    <p className="text-[#394867]" data-oid="pbmgk.1">
                        Monitor and manage all prescription workflows
                    </p>
                </div>
                <div className="flex items-center space-x-3" data-oid="if-odgn">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={
                            autoRefresh ? 'bg-[#F1F6F9] border-[#394867] text-[#14274E]' : ''
                        }
                        data-oid="c0tokzq"
                    >
                        <RefreshCw
                            className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`}
                            data-oid="no5npjb"
                        />
                        Auto Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadPrescriptions}
                        data-oid="mo.pecy"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" data-oid="50ckawm" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="8s4_mtc"
            >
                <Card data-oid="d0x83eh">
                    <CardContent className="p-4" data-oid="d31ug22">
                        <div className="flex items-center justify-between" data-oid="nfmdl.6">
                            <div data-oid="flwxm9.">
                                <p
                                    className="text-sm font-medium text-[#9BA4B4]"
                                    data-oid="r3u5:ki"
                                >
                                    Total Prescriptions
                                </p>
                                <p className="text-2xl font-bold text-[#14274E]" data-oid="sv5pfcm">
                                    {stats.total}
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-[#F1F6F9] rounded-lg flex items-center justify-center"
                                data-oid="7hy4d7."
                            >
                                <FileText className="w-5 h-5 text-[#14274E]" data-oid="e6i57h0" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="d-pj740">
                    <CardContent className="p-4" data-oid="zo7rnig">
                        <div className="flex items-center justify-between" data-oid=".6j43dh">
                            <div data-oid="c960t3h">
                                <p
                                    className="text-sm font-medium text-[#9BA4B4]"
                                    data-oid="eqw8e5s"
                                >
                                    Pending Review
                                </p>
                                <p className="text-2xl font-bold text-[#394867]" data-oid="lr5568k">
                                    {stats.submitted + stats.reviewing}
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-[#F1F6F9] rounded-lg flex items-center justify-center"
                                data-oid="9ej9lxq"
                            >
                                <Clock className="w-5 h-5 text-[#394867]" data-oid="-9:6pok" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="purx..5">
                    <CardContent className="p-4" data-oid="w9paym:">
                        <div className="flex items-center justify-between" data-oid="6xfhxch">
                            <div data-oid="5qh25:1">
                                <p
                                    className="text-sm font-medium text-[#9BA4B4]"
                                    data-oid=":et69-b"
                                >
                                    Approved
                                </p>
                                <p
                                    className="text-2xl font-bold text-emerald-600"
                                    data-oid="4u8f_o6"
                                >
                                    {stats.approved}
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
                                data-oid="8k88ccc"
                            >
                                <CheckCircle
                                    className="w-5 h-5 text-emerald-600"
                                    data-oid="_w7fh95"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="iq31l2p">
                    <CardContent className="p-4" data-oid="-9gu.h4">
                        <div className="flex items-center justify-between" data-oid="6c.vu94">
                            <div data-oid="yukzhgb">
                                <p
                                    className="text-sm font-medium text-[#9BA4B4]"
                                    data-oid="_g:8le_"
                                >
                                    With Orders
                                </p>
                                <p className="text-2xl font-bold text-[#14274E]" data-oid="wves51-">
                                    {stats.withOrders}
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-[#F1F6F9] rounded-lg flex items-center justify-center"
                                data-oid="dqz5grk"
                            >
                                <ShoppingCart
                                    className="w-5 h-5 text-[#14274E]"
                                    data-oid="wc1hxwi"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card data-oid=":s8tb7x">
                <CardContent className="p-4" data-oid="528csg.">
                    <div className="flex flex-col lg:flex-row gap-4" data-oid="k:4ton6">
                        {/* Search */}
                        <div className="flex-1" data-oid="3.mu0_h">
                            <div className="relative" data-oid="uhs_mlm">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9BA4B4] w-4 h-4"
                                    data-oid="dtsosc-"
                                />

                                <Input
                                    placeholder="Search by ID, customer, patient, phone, or prescription reader..."
                                    value={filters.searchQuery || ''}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            searchQuery: e.target.value,
                                        }))
                                    }
                                    className="pl-10"
                                    data-oid="iaq313z"
                                />
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center space-x-2" data-oid="8qny:nq">
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status:
                                            value === 'all'
                                                ? undefined
                                                : (value as PrescriptionStatus),
                                    }))
                                }
                                data-oid="drb-ujj"
                            >
                                <SelectTrigger className="w-40" data-oid="tkd-9nd">
                                    <SelectValue placeholder="Status" data-oid="ag209:j" />
                                </SelectTrigger>
                                <SelectContent data-oid="de9j1:n">
                                    <SelectItem value="all" data-oid="ht.:ya6">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="submitted" data-oid="klm6oav">
                                        Submitted
                                    </SelectItem>
                                    <SelectItem value="reviewing" data-oid="e58uhc:">
                                        Reviewing
                                    </SelectItem>
                                    <SelectItem value="approved" data-oid="en.ezzg">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="rejected" data-oid="vu70dl1">
                                        Rejected
                                    </SelectItem>
                                    <SelectItem value="suspended" data-oid="_f4bp-.">
                                        Suspended
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.urgency || 'all'}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        urgency:
                                            value === 'all'
                                                ? undefined
                                                : (value as PrescriptionUrgency),
                                    }))
                                }
                                data-oid=".-_g0ke"
                            >
                                <SelectTrigger className="w-32" data-oid="a1mrx_l">
                                    <SelectValue placeholder="Urgency" data-oid="hfr3cz7" />
                                </SelectTrigger>
                                <SelectContent data-oid="n3g8k:e">
                                    <SelectItem value="all" data-oid="y8sz_ea">
                                        All
                                    </SelectItem>
                                    <SelectItem value="urgent" data-oid="gqvg0ep">
                                        Urgent
                                    </SelectItem>
                                    <SelectItem value="normal" data-oid="i78cf0f">
                                        Normal
                                    </SelectItem>
                                    <SelectItem value="routine" data-oid="lxotb:p">
                                        Routine
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                data-oid="p-v_-m9"
                            >
                                <Filter className="w-4 h-4 mr-2" data-oid=":xvzdyy" />
                                More Filters
                            </Button>

                            {(filters.status ||
                                filters.urgency ||
                                filters.hasOrder !== undefined ||
                                filters.dateFrom ||
                                filters.dateTo ||
                                filters.searchQuery) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    data-oid="g66t.lh"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Extended Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200" data-oid="t2._l2y">
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                data-oid="ol6n.j7"
                            >
                                <div data-oid="v2qf-n-">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="mkxmcfu"
                                    >
                                        Has Order
                                    </label>
                                    <Select
                                        value={
                                            filters.hasOrder === undefined
                                                ? 'all'
                                                : filters.hasOrder
                                                  ? 'yes'
                                                  : 'no'
                                        }
                                        onValueChange={(value) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                hasOrder:
                                                    value === 'all' ? undefined : value === 'yes',
                                            }))
                                        }
                                        data-oid="0g36hl8"
                                    >
                                        <SelectTrigger data-oid="ykbohsl">
                                            <SelectValue data-oid="fg5crgn" />
                                        </SelectTrigger>
                                        <SelectContent data-oid="h2xo0_l">
                                            <SelectItem value="all" data-oid="8hj7901">
                                                All
                                            </SelectItem>
                                            <SelectItem value="yes" data-oid="r_1edin">
                                                With Orders
                                            </SelectItem>
                                            <SelectItem value="no" data-oid="4wn5j21">
                                                Without Orders
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div data-oid=":ep0m-w">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="f3heusc"
                                    >
                                        Date From
                                    </label>
                                    <Input
                                        type="date"
                                        value={filters.dateFrom || ''}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                dateFrom: e.target.value,
                                            }))
                                        }
                                        data-oid="902o.rv"
                                    />
                                </div>

                                <div data-oid="5kcasbh">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid=":h7z30a"
                                    >
                                        Date To
                                    </label>
                                    <Input
                                        type="date"
                                        value={filters.dateTo || ''}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                dateTo: e.target.value,
                                            }))
                                        }
                                        data-oid="n87gd_i"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} data-oid="6mty9b:">
                <TabsList className="grid w-full grid-cols-5" data-oid="6h7dsso">
                    <TabsTrigger value="all" data-oid="09hx7o:">
                        All ({stats.total})
                    </TabsTrigger>
                    <TabsTrigger value="pending" data-oid="uc7fuxf">
                        Pending ({stats.submitted + stats.reviewing})
                    </TabsTrigger>
                    <TabsTrigger value="completed" data-oid="x8zj25u">
                        Approved ({stats.approved})
                    </TabsTrigger>
                    <TabsTrigger value="issues" data-oid="u-yg20.">
                        Issues ({stats.rejected + stats.suspended})
                    </TabsTrigger>
                    <TabsTrigger value="with-orders" data-oid="d5x6vr1">
                        With Orders ({stats.withOrders})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6" data-oid="n:-hz58">
                    {/* Prescriptions List */}
                    <Card data-oid="i8.7574">
                        <CardHeader data-oid="ggs3sog">
                            <CardTitle
                                className="flex items-center justify-between"
                                data-oid="dak9uae"
                            >
                                <span data-oid="w8sv_nj">
                                    Prescriptions ({filteredPrescriptions.length})
                                </span>
                                <div className="flex items-center space-x-2" data-oid="smqz-28">
                                    {autoRefresh && (
                                        <Badge
                                            variant="outline"
                                            className="bg-[#F1F6F9] text-[#14274E] border-[#394867]"
                                            data-oid="73qy:.m"
                                        >
                                            <Activity className="w-3 h-3 mr-1" data-oid="8-fk983" />
                                            Live
                                        </Badge>
                                    )}
                                </div>
                            </CardTitle>
                            <CardDescription data-oid="lj:vnoz">
                                Real-time prescription monitoring and management
                            </CardDescription>
                        </CardHeader>
                        <CardContent data-oid=".51lufm">
                            {filteredPrescriptions.length === 0 ? (
                                <div className="text-center py-12" data-oid="sadn0le">
                                    <FileText
                                        className="w-12 h-12 text-[#9BA4B4] mx-auto mb-4"
                                        data-oid="u96yxje"
                                    />

                                    <h3
                                        className="text-lg font-semibold text-[#14274E] mb-2"
                                        data-oid="-roc.cb"
                                    >
                                        No prescriptions found
                                    </h3>
                                    <p className="text-[#394867]" data-oid="9jvnv8z">
                                        Try adjusting your filters or search criteria
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4" data-oid="dqatklp">
                                    {filteredPrescriptions.map((prescription) => (
                                        <div
                                            key={prescription.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                                            onClick={() => {
                                                setSelectedPrescription(prescription);
                                                setShowPrescriptionModal(true);
                                            }}
                                            data-oid="tnnwc2r"
                                        >
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid="q1t4uag"
                                            >
                                                <div className="flex-1" data-oid="0b81mv.">
                                                    <div
                                                        className="flex items-center space-x-3 mb-2"
                                                        data-oid="5nzxemu"
                                                    >
                                                        <h3
                                                            className="text-lg font-semibold text-[#14274E]"
                                                            data-oid="5a:beb_"
                                                        >
                                                            {prescription.id}
                                                        </h3>
                                                        <Badge
                                                            className={getStatusColor(
                                                                prescription.currentStatus,
                                                            )}
                                                            data-oid="vdmhe1m"
                                                        >
                                                            {getStatusIcon(
                                                                prescription.currentStatus,
                                                            )}
                                                            <span
                                                                className="ml-1"
                                                                data-oid="s0gw:b6"
                                                            >
                                                                {prescription.currentStatus}
                                                            </span>
                                                        </Badge>
                                                    </div>

                                                    <div
                                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm"
                                                        data-oid="rpeprr_"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="_2muy6x"
                                                        >
                                                            <User
                                                                className="w-4 h-4 text-[#9BA4B4]"
                                                                data-oid="x04l9-k"
                                                            />

                                                            <div data-oid="k-5ujmw">
                                                                <p
                                                                    className="font-medium text-[#14274E]"
                                                                    data-oid="2won9ap"
                                                                >
                                                                    {prescription.patientName}
                                                                </p>
                                                                <p
                                                                    className="text-[#394867]"
                                                                    data-oid="ti96h4d"
                                                                >
                                                                    Patient
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="tc0:xnu"
                                                        >
                                                            <Phone
                                                                className="w-4 h-4 text-[#9BA4B4]"
                                                                data-oid="ie2cyhj"
                                                            />

                                                            <div data-oid="0v:-btm">
                                                                <p
                                                                    className="font-medium text-[#14274E]"
                                                                    data-oid="pasc9qp"
                                                                >
                                                                    {prescription.customerName}
                                                                </p>
                                                                <p
                                                                    className="text-[#394867]"
                                                                    data-oid="tx8m:od"
                                                                >
                                                                    {prescription.customerPhone}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {prescription.assignedReaderId && (
                                                            <div
                                                                className="flex items-center space-x-2"
                                                                data-oid="r7uav3r"
                                                            >
                                                                <Stethoscope
                                                                    className="w-4 h-4 text-[#9BA4B4]"
                                                                    data-oid="8sk8y2v"
                                                                />

                                                                <div data-oid="kffphwu">
                                                                    <p
                                                                        className="font-medium text-[#14274E]"
                                                                        data-oid="4v4g0ji"
                                                                    >
                                                                        Dr. Sarah Mohamed
                                                                    </p>
                                                                    <p
                                                                        className="text-[#394867]"
                                                                        data-oid="06z4e3b"
                                                                    >
                                                                        Prescription Reader
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="6exciv8"
                                                        >
                                                            <Clock
                                                                className="w-4 h-4 text-[#9BA4B4]"
                                                                data-oid="z:pl7.b"
                                                            />

                                                            <div data-oid="c:e7iwp">
                                                                <p
                                                                    className="font-medium text-[#14274E]"
                                                                    data-oid="im3ah7:"
                                                                >
                                                                    {formatDate(
                                                                        prescription.createdAt,
                                                                    )}
                                                                </p>
                                                                <p
                                                                    className="text-[#394867]"
                                                                    data-oid=":6ie5of"
                                                                >
                                                                    Submitted
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Prescription Reader Info */}
                                                    {prescription.assignedReaderId && (
                                                        <div
                                                            className="mt-3 p-3 bg-[#F1F6F9] rounded-lg"
                                                            data-oid="npgn7n3"
                                                        >
                                                            <div
                                                                className="flex items-center justify-between"
                                                                data-oid="z_a8r:4"
                                                            >
                                                                <div
                                                                    className="flex items-center space-x-2"
                                                                    data-oid="4m:jx_g"
                                                                >
                                                                    <Eye
                                                                        className="w-4 h-4 text-[#394867]"
                                                                        data-oid="l4nvzib"
                                                                    />

                                                                    <span
                                                                        className="text-sm font-medium text-[#14274E]"
                                                                        data-oid="bk_-2c6"
                                                                    >
                                                                        Prescription Reader Analysis
                                                                    </span>
                                                                </div>
                                                                {prescription.processedMedicines &&
                                                                    prescription.processedMedicines
                                                                        .length > 0 && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                            data-oid="j-5y_pq"
                                                                        >
                                                                            {
                                                                                prescription
                                                                                    .processedMedicines
                                                                                    .length
                                                                            }{' '}
                                                                            medicines processed
                                                                        </Badge>
                                                                    )}
                                                            </div>

                                                            {prescription.processedMedicines &&
                                                                prescription.processedMedicines
                                                                    .length > 0 && (
                                                                    <div
                                                                        className="mt-2 space-y-1"
                                                                        data-oid="4pilnt9"
                                                                    >
                                                                        {prescription.processedMedicines
                                                                            .slice(0, 3)
                                                                            .map(
                                                                                (
                                                                                    medicine,
                                                                                    index,
                                                                                ) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        className="flex items-center justify-between text-xs"
                                                                                        data-oid="ky2muq8"
                                                                                    >
                                                                                        <div
                                                                                            className="flex items-center space-x-2"
                                                                                            data-oid="85wht.w"
                                                                                        >
                                                                                            <div
                                                                                                className="w-6 h-6 bg-[#F1F6F9] rounded overflow-hidden flex-shrink-0"
                                                                                                data-oid="un_50:k"
                                                                                            >
                                                                                                <img
                                                                                                    src={`https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop&crop=center`}
                                                                                                    alt={
                                                                                                        medicine.productName
                                                                                                    }
                                                                                                    className="w-full h-full object-cover"
                                                                                                    onError={(
                                                                                                        e,
                                                                                                    ) => {
                                                                                                        const target =
                                                                                                            e.target as HTMLImageElement;
                                                                                                        target.style.display =
                                                                                                            'none';
                                                                                                        const parent =
                                                                                                            target.parentElement;
                                                                                                        if (
                                                                                                            parent
                                                                                                        ) {
                                                                                                            parent.innerHTML =
                                                                                                                '<div class="w-full h-full flex items-center justify-center"><svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>';
                                                                                                        }
                                                                                                    }}
                                                                                                    data-oid="kqbzl5z"
                                                                                                />
                                                                                            </div>

                                                                                            <span
                                                                                                className="font-medium"
                                                                                                data-oid=":c.6:lb"
                                                                                            >
                                                                                                {
                                                                                                    medicine.productName
                                                                                                }
                                                                                            </span>
                                                                                            <span
                                                                                                className="text-[#394867]"
                                                                                                data-oid="dzg016j"
                                                                                            >
                                                                                                x
                                                                                                {
                                                                                                    medicine.quantity
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <span
                                                                                            className="text-emerald-600 font-medium"
                                                                                            data-oid="q1kbij3"
                                                                                        >
                                                                                            EGP{' '}
                                                                                            {medicine.price.toFixed(
                                                                                                2,
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        {prescription
                                                                            .processedMedicines
                                                                            .length > 3 && (
                                                                            <p
                                                                                className="text-xs text-[#394867] mt-1"
                                                                                data-oid="fqqyfhm"
                                                                            >
                                                                                +
                                                                                {prescription
                                                                                    .processedMedicines
                                                                                    .length -
                                                                                    3}{' '}
                                                                                more medicines
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div
                                                    className="flex flex-col items-end space-y-2"
                                                    data-oid="zrt8_.4"
                                                >
                                                    <div
                                                        className="flex flex-col space-y-2"
                                                        data-oid="b2f1sv6"
                                                    >
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="lzhv9me"
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                                data-oid="ocbn.rg"
                                                            >
                                                                {prescription.files.length} files
                                                            </Badge>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedPrescription(
                                                                        prescription,
                                                                    );
                                                                    setShowPrescriptionModal(true);
                                                                }}
                                                                data-oid="6-tbs4-"
                                                            >
                                                                <Eye
                                                                    className="w-4 h-4"
                                                                    data-oid="4o8w3pi"
                                                                />
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedPrescription(
                                                                    prescription,
                                                                );
                                                                setShowImageViewer(true);
                                                            }}
                                                            data-oid="54ksun5"
                                                        >
                                                            <FileText
                                                                className="w-3 h-3 mr-1"
                                                                data-oid="t40e0av"
                                                            />
                                                            View Images
                                                        </Button>
                                                    </div>

                                                    {prescription.totalAmount && (
                                                        <div
                                                            className="text-right"
                                                            data-oid="-pci318"
                                                        >
                                                            <p
                                                                className="text-lg font-bold text-emerald-600"
                                                                data-oid="xov8nep"
                                                            >
                                                                EGP{' '}
                                                                {prescription.totalAmount.toFixed(
                                                                    2,
                                                                )}
                                                            </p>
                                                            <p
                                                                className="text-xs text-[#394867]"
                                                                data-oid="j4yhyub"
                                                            >
                                                                Total Amount
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Prescription Detail Modal */}
            <Dialog
                open={showPrescriptionModal}
                onOpenChange={setShowPrescriptionModal}
                data-oid="8dqw_57"
            >
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto"
                    data-oid="an2fry8"
                >
                    <DialogHeader data-oid="rsabgi8">
                        <DialogTitle className="flex items-center space-x-3" data-oid="ek4wu44">
                            <span data-oid="_87_3je">
                                Prescription Details: {selectedPrescription?.id}
                            </span>
                            {selectedPrescription && (
                                <Badge
                                    className={getStatusColor(selectedPrescription.currentStatus)}
                                    data-oid="jx-h8w3"
                                >
                                    {getStatusIcon(selectedPrescription.currentStatus)}
                                    <span className="ml-1" data-oid="6fh9jt_">
                                        {selectedPrescription.currentStatus}
                                    </span>
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription data-oid="rpahzqg">
                            Complete prescription information and workflow history
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPrescription && (
                        <div className="space-y-6" data-oid="71xo-re">
                            {/* Basic Information */}
                            <Card data-oid="zwsqclz">
                                <CardHeader data-oid="-ncxjx.">
                                    <CardTitle className="text-lg" data-oid="r72p-nh">
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent data-oid="ybygxzd">
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        data-oid="mlpr0-i"
                                    >
                                        <div data-oid="0m-wnpq">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="8-hzrq0"
                                            >
                                                Patient Name
                                            </label>
                                            <p className="text-gray-900" data-oid="41qx7p8">
                                                {selectedPrescription.patientName}
                                            </p>
                                        </div>
                                        <div data-oid="jw:v.e7">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="m:ktyla"
                                            >
                                                Customer Name
                                            </label>
                                            <p className="text-gray-900" data-oid="z.n2kx6">
                                                {selectedPrescription.customerName}
                                            </p>
                                        </div>
                                        <div data-oid="zes1db4">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                data-oid="q9u-t1l"
                                            >
                                                Phone Number
                                            </label>
                                            <p className="text-gray-900" data-oid="9ts:tve">
                                                {selectedPrescription.customerPhone}
                                            </p>
                                        </div>

                                        {selectedPrescription.assignedReaderId && (
                                            <div data-oid=":fees8o">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                    data-oid="4fohu56"
                                                >
                                                    Prescription Reader
                                                </label>
                                                <p className="text-gray-900" data-oid="p59-lol">
                                                    Dr. Sarah Mohamed
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prescription Files */}
                            <Card data-oid="bzaro:d">
                                <CardHeader data-oid="8iznulk">
                                    <CardTitle className="text-lg" data-oid="kai59t_">
                                        Prescription Files
                                    </CardTitle>
                                </CardHeader>
                                <CardContent data-oid="4r-hkuu">
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        data-oid="p8dwmdh"
                                    >
                                        {selectedPrescription.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="border border-gray-200 rounded-lg p-4"
                                                data-oid="9g7tape"
                                            >
                                                <div className="space-y-3" data-oid="o1qi-m4">
                                                    <div
                                                        className="flex items-center space-x-3"
                                                        data-oid="gxj0dt3"
                                                    >
                                                        <div
                                                            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                                                            data-oid="yygh-30"
                                                        >
                                                            <FileText
                                                                className="w-5 h-5 text-blue-600"
                                                                data-oid="ork7zk2"
                                                            />
                                                        </div>
                                                        <div className="flex-1" data-oid="xn:qh:j">
                                                            <p
                                                                className="font-medium text-gray-900"
                                                                data-oid="wldxob:"
                                                            >
                                                                {file.name}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="24-p69z"
                                                            >
                                                                {file.type.toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowImageViewer(true);
                                                        }}
                                                        data-oid="wxhpj7s"
                                                    >
                                                        <Eye
                                                            className="w-4 h-4 mr-2"
                                                            data-oid="3.wi4h6"
                                                        />
                                                        View Prescription
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prescription Reader Analysis */}
                            {selectedPrescription.processedMedicines &&
                                selectedPrescription.processedMedicines.length > 0 && (
                                    <Card data-oid="_d35-av">
                                        <CardHeader data-oid="lqz55od">
                                            <CardTitle
                                                className="text-lg flex items-center space-x-2"
                                                data-oid="_c:jizq"
                                            >
                                                <Eye className="w-5 h-5" data-oid="7vi.d62" />
                                                <span data-oid="tc5bnx8">
                                                    Prescription Reader Analysis
                                                </span>
                                            </CardTitle>
                                            <CardDescription data-oid="up3acw3">
                                                Medicines identified and processed by the
                                                prescription reader
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent data-oid="6.zzord">
                                            <div className="space-y-4" data-oid="69:0pfp">
                                                {selectedPrescription.processedMedicines.map(
                                                    (medicine, index) => (
                                                        <div
                                                            key={index}
                                                            className="border border-gray-200 rounded-lg p-4"
                                                            data-oid="set_wd6"
                                                        >
                                                            <div
                                                                className="flex items-start justify-between"
                                                                data-oid=":bq1zx7"
                                                            >
                                                                <div
                                                                    className="flex items-start space-x-4 flex-1"
                                                                    data-oid="zqw:_d9"
                                                                >
                                                                    <div
                                                                        className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                                                                        data-oid="y5u8h05"
                                                                    >
                                                                        <img
                                                                            src={`https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center`}
                                                                            alt={
                                                                                medicine.productName
                                                                            }
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                const target =
                                                                                    e.target as HTMLImageElement;
                                                                                target.style.display =
                                                                                    'none';
                                                                                const parent =
                                                                                    target.parentElement;
                                                                                if (parent) {
                                                                                    parent.innerHTML =
                                                                                        '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>';
                                                                                }
                                                                            }}
                                                                            data-oid="o-58f6w"
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="flex-1"
                                                                        data-oid="kazau2u"
                                                                    >
                                                                        <div
                                                                            className="flex items-center space-x-3 mb-2"
                                                                            data-oid="qf3vmjs"
                                                                        >
                                                                            <h4
                                                                                className="font-semibold text-gray-900"
                                                                                data-oid="4:gqoqy"
                                                                            >
                                                                                {
                                                                                    medicine.productName
                                                                                }
                                                                            </h4>
                                                                            <Badge
                                                                                variant="outline"
                                                                                data-oid="f:x9hmc"
                                                                            >
                                                                                x{medicine.quantity}
                                                                            </Badge>
                                                                        </div>
                                                                        <div
                                                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                                                                            data-oid="vxnqia3"
                                                                        >
                                                                            <div data-oid="-oimolj">
                                                                                <label
                                                                                    className="block text-xs font-medium text-gray-600 mb-1"
                                                                                    data-oid="whoggt0"
                                                                                >
                                                                                    Dosage
                                                                                </label>
                                                                                <p
                                                                                    className="text-gray-900"
                                                                                    data-oid="gqkcd35"
                                                                                >
                                                                                    {
                                                                                        medicine.dosage
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            <div data-oid="3vziugr">
                                                                                <label
                                                                                    className="block text-xs font-medium text-gray-600 mb-1"
                                                                                    data-oid="lp9g1qt"
                                                                                >
                                                                                    Instructions
                                                                                </label>
                                                                                <p
                                                                                    className="text-gray-900"
                                                                                    data-oid="5:2croi"
                                                                                >
                                                                                    {
                                                                                        medicine.instructions
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="text-right"
                                                                    data-oid="whl6hi8"
                                                                >
                                                                    <p
                                                                        className="text-lg font-bold text-green-600"
                                                                        data-oid="ae-_.qz"
                                                                    >
                                                                        EGP{' '}
                                                                        {medicine.price.toFixed(2)}
                                                                    </p>
                                                                    <p
                                                                        className="text-xs text-gray-600"
                                                                        data-oid="8m7bsy:"
                                                                    >
                                                                        per unit
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}

                                                {selectedPrescription.totalAmount && (
                                                    <div
                                                        className="border-t border-gray-200 pt-4"
                                                        data-oid="2d4pb0w"
                                                    >
                                                        <div
                                                            className="flex items-center justify-between"
                                                            data-oid="7vat5qw"
                                                        >
                                                            <span
                                                                className="text-lg font-semibold text-gray-900"
                                                                data-oid="m-5w506"
                                                            >
                                                                Total Amount
                                                            </span>
                                                            <span
                                                                className="text-2xl font-bold text-green-600"
                                                                data-oid="9ov00pm"
                                                            >
                                                                EGP{' '}
                                                                {selectedPrescription.totalAmount.toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Status History */}
                            <Card data-oid="aug.cue">
                                <CardHeader data-oid="hv1-yoy">
                                    <CardTitle className="text-lg" data-oid="yqnmpc6">
                                        Status History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent data-oid="m.-bbb3">
                                    <div className="space-y-4" data-oid="wse4536">
                                        {selectedPrescription.statusHistory.map((entry, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start space-x-3"
                                                data-oid="xwn:nv4"
                                            >
                                                <div
                                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0"
                                                    data-oid="orqg5co"
                                                >
                                                    {getStatusIcon(entry.status)}
                                                </div>
                                                <div className="flex-1" data-oid="mjviwsn">
                                                    <div
                                                        className="flex items-center space-x-2"
                                                        data-oid="yzibj8j"
                                                    >
                                                        <Badge
                                                            className={getStatusColor(entry.status)}
                                                            data-oid="ng.qrnx"
                                                        >
                                                            {entry.status}
                                                        </Badge>
                                                        <span
                                                            className="text-sm text-gray-600"
                                                            data-oid="oxg6ep8"
                                                        >
                                                            by {entry.userName} ({entry.userRole})
                                                        </span>
                                                        <span
                                                            className="text-sm text-gray-500"
                                                            data-oid="66mw_lv"
                                                        >
                                                            {formatDate(entry.timestamp)}
                                                        </span>
                                                    </div>
                                                    {entry.notes && (
                                                        <p
                                                            className="text-sm text-gray-700 mt-1"
                                                            data-oid="c2v2qg-"
                                                        >
                                                            {entry.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Information */}
                            {selectedPrescription.processedMedicines &&
                                selectedPrescription.processedMedicines.length > 0 && (
                                    <Card data-oid="r6.qetw">
                                        <CardHeader data-oid="fx_fky1">
                                            <CardTitle
                                                className="text-lg flex items-center space-x-2"
                                                data-oid="-:ih:ea"
                                            >
                                                <ShoppingCart
                                                    className="w-5 h-5"
                                                    data-oid="vfb4rd4"
                                                />

                                                <span data-oid=":ghwj26">Order Information</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent data-oid=".qfj.c3">
                                            <div
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                data-oid="9w7_o5_"
                                            >
                                                <div data-oid="_68mo0t">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                        data-oid="hba:nmq"
                                                    >
                                                        Customer Used Prescription
                                                    </label>
                                                    <Badge
                                                        className="bg-green-100 text-green-800 border-green-200"
                                                        data-oid="qw9tz97"
                                                    >
                                                        <CheckCircle
                                                            className="w-3 h-3 mr-1"
                                                            data-oid="a3aq3_u"
                                                        />
                                                        Yes - Order Placed
                                                    </Badge>
                                                </div>
                                                {selectedPrescription.deliveryAddress && (
                                                    <div data-oid="w0rzsjc">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="jd4.bo1"
                                                        >
                                                            Delivery Address
                                                        </label>
                                                        <p
                                                            className="text-gray-900"
                                                            data-oid="ekr1.h-"
                                                        >
                                                            {selectedPrescription.deliveryAddress}
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedPrescription.deliveryFee && (
                                                    <div data-oid="xn4la7n">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid=".bkzckm"
                                                        >
                                                            Delivery Fee
                                                        </label>
                                                        <p
                                                            className="text-gray-900"
                                                            data-oid="rq0krco"
                                                        >
                                                            EGP{' '}
                                                            {selectedPrescription.deliveryFee.toFixed(
                                                                2,
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* No Order Information */}
                            {(!selectedPrescription.processedMedicines ||
                                selectedPrescription.processedMedicines.length === 0) &&
                                selectedPrescription.currentStatus === 'approved' && (
                                    <Card data-oid=":j.wzlz">
                                        <CardHeader data-oid="-mbezk0">
                                            <CardTitle
                                                className="text-lg flex items-center space-x-2"
                                                data-oid="4:1i2ub"
                                            >
                                                <AlertTriangle
                                                    className="w-5 h-5 text-orange-600"
                                                    data-oid=":3big22"
                                                />

                                                <span data-oid=":7y-okb">Order Status</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent data-oid="6t_o-q7">
                                            <div
                                                className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg"
                                                data-oid="mg.p6xv"
                                            >
                                                <AlertTriangle
                                                    className="w-5 h-5 text-orange-600"
                                                    data-oid="ty-am9i"
                                                />

                                                <div data-oid="jh8s7rh">
                                                    <p
                                                        className="font-medium text-orange-800"
                                                        data-oid="vp3vm:y"
                                                    >
                                                        Customer hasn{"'"}t placed an order yet
                                                    </p>
                                                    <p
                                                        className="text-sm text-orange-700"
                                                        data-oid="8m7n7_s"
                                                    >
                                                        The prescription was approved but the
                                                        customer hasn{"'"}t used it to place an order.
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Prescription Image Viewer */}
            <PrescriptionImageViewer
                prescription={selectedPrescription}
                isOpen={showImageViewer}
                onClose={() => setShowImageViewer(false)}
                data-oid="htr8r31"
            />
        </div>
    );
}
