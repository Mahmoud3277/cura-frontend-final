'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { PharmacyRevenueAnalytics } from '@/components/pharmacy/PharmacyRevenueAnalytics';
import {
    pharmacyManagementService,
    PharmacyDetails,
    PharmacyFilters,
    PharmacyStats,
} from '@/lib/services/pharmacyManagementService';
import { orderMonitoringService, Order } from '@/lib/services/orderMonitoringService';
import { orderReturnService } from '@/lib/services/orderReturnService';
import { ReturnDetailsModal } from '@/components/admin/ReturnDetailsModal';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { OrderReturn } from '@/lib/types';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    DollarSign,
    TrendingUp,
    Clock,
    Package,
    AlertCircle,
    Eye,
    Trash2,
    RefreshCw,
    Search,
    Filter,
    Download,
    Plus,
    X,
    Star,
    Users,
    ShoppingCart,
    RotateCcw,
    FileText,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Percent,
} from 'lucide-react';
import { providerOrderService } from '@/lib/services/pharmacyOrderService';

interface PharmacyDashboardClientProps {
    initialPharmacies: PharmacyDetails[];
    initialStats: PharmacyStats;
}

// Simple Pharmacy Details Modal Component
const PharmacyDetailsModal = ({ pharmacy, isOpen, onClose, onViewOrderDetails, onViewReturnDetails }: {
    pharmacy: PharmacyDetails | null;
    isOpen: boolean;
    onClose: () => void;
    onViewOrderDetails: (order: Order) => void;
    onViewReturnDetails: (returnItem: OrderReturn) => void;
}) => {
    if (!pharmacy) return null;
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {pharmacy.name} - Details
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Contact Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{pharmacy.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{pharmacy.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span>{pharmacy.address}, {pharmacy.cityName}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Status & Verification</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span>Status:</span>
                                    <Badge className={
                                        pharmacy.status === 'active' ? 'bg-green-100 text-green-800' :
                                        pharmacy.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        pharmacy.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                                        'bg-red-100 text-red-800'
                                    }>
                                        {pharmacy.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function PharmacyDashboardClient({ initialPharmacies, initialStats }: PharmacyDashboardClientProps) {
    const [pharmacies, setPharmacies] = useState<PharmacyDetails[]>(initialPharmacies);
    const [stats, setStats] = useState<PharmacyStats | null>(initialStats);
    const [filters, setFilters] = useState<PharmacyFilters>({
        status: 'all',
        city: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState<'management' | 'analytics'>('management');
    const [timeframe, setTimeframe] = useState('30d');
    const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyDetails | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<OrderReturn | null>(null);
    const [showReturnDetails, setShowReturnDetails] = useState(false);

    // Handle filter changes
    const handleFilterChange = (filterType: keyof PharmacyFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value || undefined
        }));
    };
    // This useEffect is now only for client-side filtering, not initial data fetching
    useEffect(() => {
        const getPharmacies = async () => {
            const response = await pharmacyManagementService.getPharmacies(filters);
            console.log('in client', response)
            if(response){
                setPharmacies(response.data);
            }
        };
        getPharmacies();
    }, [filters]);

    // Memoize the filtered list to prevent unnecessary re-calculations
    const filteredAndSearchedPharmacies = useMemo(() => {
        if(pharmacies){
            return pharmacies.filter(
                (pharmacy) =>
                    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pharmacy.cityName.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }
    }, [pharmacies, searchTerm]);

    const handleViewPharmacy = (pharmacy: PharmacyDetails) => {
        setSelectedPharmacy(pharmacy);
        setShowDetailsModal(true);
    };

    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleViewReturnDetails = (returnItem: OrderReturn) => {
        setSelectedReturn(returnItem);
        setShowReturnDetails(true);
    };

    // The rest of the component's JSX remains the same, but now it uses state
    // variables and handlers defined here.
    // ... (All the JSX from the original file starting with the return statement)
    return (
        <div className="space-y-6">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'management' | 'analytics')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    <TabsTrigger value="management" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Pharmacy Management
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" /> Pharmacy Analytics
                    </TabsTrigger>
                </TabsList>

                {/* Management Tab Content */}
                <TabsContent value="management" className="space-y-6">
                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium opacity-90">Total Pharmacies</CardTitle>
                                    <Building2 className="h-4 w-4 opacity-90" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total}</div>
                                    <div className="flex items-center space-x-2 text-xs opacity-90">
                                        <span>+{stats.growth}% from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-700">My Total Commission</CardTitle>
                                    <DollarSign className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{`EGP ${stats.totalCommission.toLocaleString()}`}</div>
                                    <div className="flex items-center space-x-2 text-xs text-green-600">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span>{stats.commissionGrowth}% from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-700">Total Sales</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{`EGP ${stats.totalSales.toLocaleString()}`}</div>
                                    <div className="flex items-center space-x-2 text-xs text-green-600">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span>{stats.totalSalesGrowth}% from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border border-gray-200 hover:border-blue-300 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-700">Total Returns</CardTitle>
                                    <RotateCcw className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalReturns}</div>
                                    <div className="flex items-center space-x-2 text-xs text-red-600">
                                        <ArrowDownRight className="h-4 w-4" />
                                        <span>{stats.returnsGrowth}% from last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {/* Search and Filter Section */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search pharmacies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            onValueChange={(value) => handleFilterChange('status', value)}
                            value={filters.status || 'all'}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            onValueChange={(value) => handleFilterChange('city', value)}
                            value={filters.city || 'all'}
                        >
                            <SelectTrigger className="w-[180px]">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Filter by City" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="cairo">Cairo</SelectItem>
                                <SelectItem value="giza">Giza</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pharmacy Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Building2 className="h-5 w-5" />
                                    <span>All Pharmacies</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {filteredAndSearchedPharmacies &&filteredAndSearchedPharmacies.length} pharmacies found
                                </div>
                            </CardTitle>
                            <CardDescription>
                                A list of all registered pharmacies and their key details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="sticky top-0 bg-white z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pharmacy</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredAndSearchedPharmacies && filteredAndSearchedPharmacies.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                                    No pharmacies match your search or filter criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAndSearchedPharmacies && filteredAndSearchedPharmacies.map((pharmacy) => (
                                                <tr key={pharmacy.id} onClick={() => handleViewPharmacy(pharmacy)} className="cursor-pointer hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                                    {pharmacy.name.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{pharmacy.name}</div>
                                                                <div className="text-sm text-gray-500">{pharmacy.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{pharmacy.cityName}</div>
                                                        <div className="text-sm text-gray-500">{pharmacy.address}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{pharmacy.contactPerson?.name || 'N/A'}</div>
                                                        <div className="text-sm text-gray-500">{pharmacy.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            className={`${
                                                                pharmacy.status === 'active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : pharmacy.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : pharmacy.status === 'suspended'
                                                                            ? 'bg-orange-100 text-orange-800'
                                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                        >
                                                            {pharmacy.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewPharmacy(pharmacy); }}>
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Modals for Details */}
                    {showDetailsModal && (
                        <PharmacyDetailsModal
                            pharmacy={selectedPharmacy}
                            isOpen={showDetailsModal}
                            onClose={() => setShowDetailsModal(false)}
                            onViewOrderDetails={handleViewOrderDetails}
                            onViewReturnDetails={handleViewReturnDetails}
                        />
                    )}
                    {showReturnDetails && (
                        <ReturnDetailsModal
                            returnItem={selectedReturn}
                            isOpen={showReturnDetails}
                            onClose={() => setShowReturnDetails(false)}
                        />
                    )}
                    {showOrderDetails && (
                        <OrderDetailsModal
                            order={selectedOrder}
                            isOpen={showOrderDetails}
                            onClose={() => setShowOrderDetails(false)}
                        />
                    )}
                </TabsContent>

                {/* Analytics Tab Content */}
                <TabsContent value="analytics" className="space-y-6">
                    {/* Timeframe Select */}
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold">Analytics Overview</h2>
                        <div className="ml-auto flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Timeframe:</span>
                            <Select
                                onValueChange={setTimeframe}
                                value={timeframe}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Select timeframe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 Days</SelectItem>
                                    <SelectItem value="30d">Last 30 Days</SelectItem>
                                    <SelectItem value="3m">Last 3 Months</SelectItem>
                                    <SelectItem value="6m">Last 6 Months</SelectItem>
                                    <SelectItem value="1y">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <PharmacyRevenueAnalytics pharmacy={null} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Revenue Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">EGP 2,548,230</div>
                                <p className="text-xs text-green-500 mt-1 flex items-center">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span className="ml-1">+15.2% from last period</span>
                                </p>
                                <div className="h-[80px] mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[{ period: 'Week 1', revenue: 1000 }, { period: 'Week 2', revenue: 1200 }, { period: 'Week 3', revenue: 1500 }, { period: 'Week 4', revenue: 1800 }]}>
                                            <defs>
                                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip />
                                            <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#revenueGradient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        {/* More analytics cards would be here, following the same pattern */}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}