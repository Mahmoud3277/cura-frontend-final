'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SuspendedItem {
    id: string;
    customer: string;
    type: 'Order' | 'Prescription';
    reason: string;
    date: string;
    status: 'pending_verification' | 'insurance_pending' | 'expired' | 'payment_pending';
    details: string;
    doctor?: string;
    medication?: string;
    items?: string;
    total?: string;
}

export default function AppServicesDashboard() {
    const [suspendedItems, setSuspendedItems] = useState<SuspendedItem[]>([
        {
            id: 'ORD-240115-001',
            customer: 'Omar Hassan',
            type: 'Order',
            reason: 'Payment verification required',
            date: '2024-01-15',
            status: 'payment_pending',
            details: 'Metformin 500mg x30, Lisinopril 10mg x30',
            items: 'Metformin 500mg x30, Lisinopril 10mg x30',
            total: 'SAR 245.50',
        },
        {
            id: 'RX-240115-001',
            customer: 'Ahmed Mohamed',
            type: 'Prescription',
            reason: 'Doctor verification needed',
            date: '2024-01-15',
            status: 'pending_verification',
            details: 'Metformin 500mg',
            doctor: 'Dr. Sarah Ahmed',
            medication: 'Metformin 500mg',
        },
        {
            id: 'ORD-240115-002',
            customer: 'Fatima Ali',
            type: 'Order',
            reason: 'Insurance approval pending',
            date: '2024-01-14',
            status: 'insurance_pending',
            details: 'Atorvastatin 20mg x30',
            items: 'Atorvastatin 20mg x30',
            total: 'SAR 89.00',
        },
        {
            id: 'RX-240115-002',
            customer: 'Fatima Ali',
            type: 'Prescription',
            reason: 'Insurance pre-authorization required',
            date: '2024-01-14',
            status: 'insurance_pending',
            details: 'Lisinopril 10mg',
            doctor: 'Dr. Omar Hassan',
            medication: 'Lisinopril 10mg',
        },
        {
            id: 'RX-240115-003',
            customer: 'Omar Hassan',
            type: 'Prescription',
            reason: 'Prescription expired',
            date: '2024-01-13',
            status: 'expired',
            details: 'Atorvastatin 20mg',
            doctor: 'Dr. Mona Khalil',
            medication: 'Atorvastatin 20mg',
        },
    ]);

    const [activeFilter, setActiveFilter] = useState('all');
    const [editingItem, setEditingItem] = useState<SuspendedItem | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<SuspendedItem>>({});

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending_verification':
                return 'secondary';
            case 'insurance_pending':
                return 'default';
            case 'expired':
                return 'destructive';
            case 'payment_pending':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending_verification':
                return 'Pending Verification';
            case 'insurance_pending':
                return 'Insurance Pending';
            case 'expired':
                return 'Expired';
            case 'payment_pending':
                return 'Payment Pending';
            default:
                return status;
        }
    };

    const handleDeleteItem = (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setSuspendedItems((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const handleContactPharmacy = (item: SuspendedItem) => {
        alert(`Contacting pharmacy for ${item.type.toLowerCase()} ${item.id} - ${item.details}`);
    };

    const handleContactCustomer = (item: SuspendedItem) => {
        alert(`Contacting customer ${item.customer} for ${item.type.toLowerCase()} ${item.id}`);
    };

    const handleEditItem = (item: SuspendedItem) => {
        setEditingItem(item);
        setEditFormData(item);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editingItem || !editFormData) return;

        setSuspendedItems((prev) =>
            prev.map((item) => (item.id === editingItem.id ? { ...item, ...editFormData } : item)),
        );

        setIsEditDialogOpen(false);
        setEditingItem(null);
        setEditFormData({});
    };

    const handleCancelEdit = () => {
        setIsEditDialogOpen(false);
        setEditingItem(null);
        setEditFormData({});
    };

    const filteredItems =
        activeFilter === 'all'
            ? suspendedItems
            : activeFilter === 'orders'
              ? suspendedItems.filter((item) => item.type === 'Order')
              : activeFilter === 'prescriptions'
                ? suspendedItems.filter((item) => item.type === 'Prescription')
                : suspendedItems.filter((item) => item.status === activeFilter);

    const getFilterCount = (filter: string) => {
        if (filter === 'all') return suspendedItems.length;
        if (filter === 'orders')
            return suspendedItems.filter((item) => item.type === 'Order').length;
        if (filter === 'prescriptions')
            return suspendedItems.filter((item) => item.type === 'Prescription').length;
        return suspendedItems.filter((item) => item.status === filter).length;
    };

    const totalOrders = suspendedItems.filter((item) => item.type === 'Order').length;
    const totalPrescriptions = suspendedItems.filter((item) => item.type === 'Prescription').length;

    return (
        <div
            className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen"
            data-oid="vada8lt"
        >
            {/* Header Section */}
            <Card
                className="border-0 shadow-xl bg-gradient-to-r from-[#1F1F6F] to-[#2D4A9E] text-white"
                data-oid="v96hmqb"
            >
                <CardHeader className="pb-8" data-oid="j5-sd3a">
                    <div className="flex items-center justify-between" data-oid="ff2d:9q">
                        <div className="flex items-center space-x-4" data-oid="g5y71ql">
                            <div
                                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                                data-oid="24d0nrx"
                            >
                                <span className="text-3xl" data-oid="_p:yem4">
                                    ⏸️
                                </span>
                            </div>
                            <div data-oid="28xn4wg">
                                <CardTitle
                                    className="text-3xl font-bold text-white mb-2"
                                    data-oid="jbiinbv"
                                >
                                    Suspended Items Management
                                </CardTitle>
                                <CardDescription
                                    className="text-blue-100 text-lg"
                                    data-oid="q8h9hkk"
                                >
                                    Manage suspended orders and prescriptions in one place
                                </CardDescription>
                            </div>
                        </div>
                        <div className="text-right" data-oid="uux7fmy">
                            <div className="text-blue-100 text-sm font-medium" data-oid="1c2nxpt">
                                Total Suspended
                            </div>
                            <div className="text-4xl font-bold text-white" data-oid="tba.mqs">
                                {suspendedItems.length}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="nd-fhoa">
                <Card className="shadow-lg border-0" data-oid="-o.2k8_">
                    <CardContent className="p-6" data-oid="fyvwe-f">
                        <div className="flex items-center justify-between" data-oid="u-p6pwg">
                            <div data-oid="elvoqy4">
                                <p className="text-sm font-medium text-gray-600" data-oid="1toyg7i">
                                    Suspended Orders
                                </p>
                                <p className="text-3xl font-bold text-red-600" data-oid="34veobd">
                                    {totalOrders}
                                </p>
                            </div>
                            <div
                                className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
                                data-oid="b4nce8d"
                            >
                                <span className="text-2xl" data-oid="yrhbmwl">
                                    📦
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-0" data-oid="al2mfko">
                    <CardContent className="p-6" data-oid="r:4rzo7">
                        <div className="flex items-center justify-between" data-oid="j7_do.w">
                            <div data-oid="m1i-8b1">
                                <p className="text-sm font-medium text-gray-600" data-oid="5zw-bds">
                                    Suspended Prescriptions
                                </p>
                                <p
                                    className="text-3xl font-bold text-orange-600"
                                    data-oid="c8sxzxo"
                                >
                                    {totalPrescriptions}
                                </p>
                            </div>
                            <div
                                className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
                                data-oid="j.y.zur"
                            >
                                <span className="text-2xl" data-oid="cue0n6v">
                                    📋
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <Card className="shadow-lg border-0" data-oid="ypf8rt1">
                <CardContent className="p-6" data-oid="zt9h:.3">
                    <div className="flex flex-wrap gap-3" data-oid="3qgf8wh">
                        <Button
                            variant={activeFilter === 'all' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('all')}
                            className="rounded-full"
                            data-oid="7u1_0cb"
                        >
                            All ({getFilterCount('all')})
                        </Button>
                        <Button
                            variant={activeFilter === 'orders' ? 'destructive' : 'outline'}
                            onClick={() => setActiveFilter('orders')}
                            className="rounded-full"
                            data-oid="91udn5p"
                        >
                            📦 Orders ({getFilterCount('orders')})
                        </Button>
                        <Button
                            variant={activeFilter === 'prescriptions' ? 'secondary' : 'outline'}
                            onClick={() => setActiveFilter('prescriptions')}
                            className="rounded-full"
                            data-oid="ap_hx0v"
                        >
                            📋 Prescriptions ({getFilterCount('prescriptions')})
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Items List */}
            <Card className="shadow-xl border-0" data-oid="4dh46te">
                <CardHeader
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-b"
                    data-oid="im.blv6"
                >
                    <CardTitle className="text-xl text-gray-800" data-oid="d:9wggc">
                        Suspended Items ({filteredItems.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0" data-oid="pc6lezk">
                    <div className="divide-y divide-gray-100" data-oid="47hcz6a">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                data-oid="tjodd_y"
                            >
                                <div
                                    className="flex items-start justify-between"
                                    data-oid="qyln-gm"
                                >
                                    <div className="flex-1 space-y-4" data-oid="4g9-6.e">
                                        {/* Type, Status and ID */}
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="3qmm4m0"
                                        >
                                            <Badge
                                                variant={
                                                    item.type === 'Order'
                                                        ? 'destructive'
                                                        : 'secondary'
                                                }
                                                className="flex items-center gap-1"
                                                data-oid="fzyd0hc"
                                            >
                                                {item.type === 'Order' ? '📦' : '📋'}
                                                {item.type}
                                            </Badge>
                                            <Badge
                                                variant={getStatusVariant(item.status)}
                                                className="flex items-center gap-1"
                                                data-oid="t6o.170"
                                            >
                                                {item.status === 'pending_verification' && '⏰'}
                                                {item.status === 'insurance_pending' && '🔄'}
                                                {item.status === 'expired' && '❌'}
                                                {item.status === 'payment_pending' && '💳'}
                                                {getStatusText(item.status)}
                                            </Badge>
                                            <span
                                                className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full"
                                                data-oid="4jpqcx0"
                                            >
                                                {item.id}
                                            </span>
                                        </div>

                                        {/* Item Info Grid */}
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                            data-oid="yy32xtc"
                                        >
                                            <div className="space-y-1" data-oid="r4tspws">
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid=".jdzqjs"
                                                >
                                                    <span
                                                        className="text-blue-600"
                                                        data-oid="ilq.nzi"
                                                    >
                                                        👤
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium text-gray-500"
                                                        data-oid="q9z61ep"
                                                    >
                                                        Customer
                                                    </span>
                                                </div>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="1n01vq4"
                                                >
                                                    {item.customer}
                                                </p>
                                            </div>
                                            <div className="space-y-1" data-oid="4ky7vob">
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="17cn5_1"
                                                >
                                                    <span
                                                        className="text-green-600"
                                                        data-oid="1e7avan"
                                                    >
                                                        {item.type === 'Order' ? '📦' : '💊'}
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium text-gray-500"
                                                        data-oid="pjl2xw0"
                                                    >
                                                        {item.type === 'Order'
                                                            ? 'Items'
                                                            : 'Medication'}
                                                    </span>
                                                </div>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="3-f6-wq"
                                                >
                                                    {item.details}
                                                </p>
                                            </div>
                                            <div className="space-y-1" data-oid="wmrqak9">
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="d7vat8e"
                                                >
                                                    <span
                                                        className="text-purple-600"
                                                        data-oid="_5foh8:"
                                                    >
                                                        {item.type === 'Order' ? '💰' : '👨‍⚕️'}
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium text-gray-500"
                                                        data-oid="to5jqew"
                                                    >
                                                        {item.type === 'Order' ? 'Total' : 'Doctor'}
                                                    </span>
                                                </div>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="2r1ce70"
                                                >
                                                    {item.type === 'Order'
                                                        ? item.total
                                                        : item.doctor}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Reason and Date */}
                                        <div
                                            className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                                            data-oid="_7zvmve"
                                        >
                                            <p
                                                className="text-sm text-amber-800"
                                                data-oid="xt5r-vo"
                                            >
                                                <span className="font-semibold" data-oid="z6k213h">
                                                    Suspension Reason:
                                                </span>{' '}
                                                {item.reason}
                                            </p>
                                            <p
                                                className="text-xs text-amber-600 mt-1"
                                                data-oid="xdj7:v3"
                                            >
                                                Suspended on{' '}
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div
                                        className="flex flex-col space-y-2 ml-6"
                                        data-oid="9w_8noj"
                                    >
                                        <Button
                                            onClick={() => handleContactPharmacy(item)}
                                            variant="outline"
                                            size="sm"
                                            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                                            data-oid="ptu6dad"
                                        >
                                            📞 Contact Pharmacy
                                        </Button>
                                        <Button
                                            onClick={() => handleContactCustomer(item)}
                                            variant="outline"
                                            size="sm"
                                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                            data-oid="fucjuk4"
                                        >
                                            👤 Contact Customer
                                        </Button>
                                        <Button
                                            onClick={() => handleEditItem(item)}
                                            variant="outline"
                                            size="sm"
                                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                            data-oid="3xt_3b2"
                                        >
                                            ✏️ Edit {item.type}
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteItem(item.id)}
                                            variant="outline"
                                            size="sm"
                                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                            data-oid="h:1ggv1"
                                        >
                                            🗑️ Delete {item.type}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card
                className="shadow-xl border-0 bg-gradient-to-r from-slate-50 to-blue-50"
                data-oid="rxdj_a5"
            >
                <CardHeader data-oid="5fa:ofo">
                    <CardTitle className="text-xl text-gray-800" data-oid="8tvmu1.">
                        Quick Actions
                    </CardTitle>
                    <CardDescription data-oid="kjbn7_j">
                        Perform bulk operations on suspended items
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="6rws28u">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="9mrdls7">
                        <Button
                            variant="outline"
                            className="h-20 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:scale-105 transition-all duration-200"
                            data-oid="svmaqqn"
                        >
                            <div className="text-center" data-oid="dz0x8og">
                                <div className="text-3xl mb-2" data-oid="ycs0v66">
                                    🏥
                                </div>
                                <div className="font-semibold" data-oid="typsywb">
                                    Contact All Pharmacies
                                </div>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                            data-oid="csxpli7"
                        >
                            <div className="text-center" data-oid="jsq-gj7">
                                <div className="text-3xl mb-2" data-oid="h._l..o">
                                    👥
                                </div>
                                <div className="font-semibold" data-oid="vvz_8.l">
                                    Contact All Customers
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} data-oid="fr0m:ve">
                <DialogContent className="max-w-2xl" data-oid="fhs9ra1">
                    <DialogHeader data-oid="hqcx36b">
                        <DialogTitle data-oid="vvg.wfr">
                            Edit {editingItem?.type} - {editingItem?.id}
                        </DialogTitle>
                        <DialogDescription data-oid="ferncjz">
                            Update the details for this {editingItem?.type?.toLowerCase()}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4" data-oid="pq:algv">
                        <div className="grid grid-cols-4 items-center gap-4" data-oid="nwewm.d">
                            <Label htmlFor="customer" className="text-right" data-oid="6j377m3">
                                Customer
                            </Label>
                            <Input
                                id="customer"
                                value={editFormData.customer || ''}
                                onChange={(e) =>
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        customer: e.target.value,
                                    }))
                                }
                                className="col-span-3"
                                data-oid="3cbamt5"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4" data-oid="yco7st5">
                            <Label htmlFor="status" className="text-right" data-oid="q9438oj">
                                Status
                            </Label>
                            <Select
                                value={editFormData.status || ''}
                                onValueChange={(value) =>
                                    setEditFormData((prev) => ({ ...prev, status: value as any }))
                                }
                                data-oid="_trx4b:"
                            >
                                <SelectTrigger className="col-span-3" data-oid="8vvln3:">
                                    <SelectValue placeholder="Select status" data-oid="1u1vtd." />
                                </SelectTrigger>
                                <SelectContent data-oid="whkbe_y">
                                    <SelectItem value="pending_verification" data-oid=".audu8q">
                                        Pending Verification
                                    </SelectItem>
                                    <SelectItem value="insurance_pending" data-oid="-.qj_5z">
                                        Insurance Pending
                                    </SelectItem>
                                    <SelectItem value="expired" data-oid="wqgy29w">
                                        Expired
                                    </SelectItem>
                                    <SelectItem value="payment_pending" data-oid="mioyp9k">
                                        Payment Pending
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4" data-oid="n_28zj7">
                            <Label htmlFor="details" className="text-right" data-oid="b2.1_u4">
                                {editingItem?.type === 'Order' ? 'Items' : 'Medication'}
                            </Label>
                            <Input
                                id="details"
                                value={editFormData.details || ''}
                                onChange={(e) =>
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        details: e.target.value,
                                    }))
                                }
                                className="col-span-3"
                                data-oid="05vb02h"
                            />
                        </div>

                        {editingItem?.type === 'Order' && (
                            <div className="grid grid-cols-4 items-center gap-4" data-oid="o6c2brc">
                                <Label htmlFor="total" className="text-right" data-oid="qpesqe3">
                                    Total
                                </Label>
                                <Input
                                    id="total"
                                    value={editFormData.total || ''}
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({
                                            ...prev,
                                            total: e.target.value,
                                        }))
                                    }
                                    className="col-span-3"
                                    data-oid="68o2t2."
                                />
                            </div>
                        )}

                        {editingItem?.type === 'Prescription' && (
                            <div className="grid grid-cols-4 items-center gap-4" data-oid=".:mw1ar">
                                <Label htmlFor="doctor" className="text-right" data-oid="o7ar2oc">
                                    Doctor
                                </Label>
                                <Input
                                    id="doctor"
                                    value={editFormData.doctor || ''}
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({
                                            ...prev,
                                            doctor: e.target.value,
                                        }))
                                    }
                                    className="col-span-3"
                                    data-oid="q0ccz-d"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-4 items-start gap-4" data-oid="tiuc-ke">
                            <Label htmlFor="reason" className="text-right pt-2" data-oid="vjvww_z">
                                Suspension Reason
                            </Label>
                            <Textarea
                                id="reason"
                                value={editFormData.reason || ''}
                                onChange={(e) =>
                                    setEditFormData((prev) => ({ ...prev, reason: e.target.value }))
                                }
                                className="col-span-3"
                                rows={3}
                                data-oid="izgeae1"
                            />
                        </div>
                    </div>

                    <DialogFooter data-oid="h37pvw5">
                        <Button variant="outline" onClick={handleCancelEdit} data-oid="t9cws-e">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} data-oid="c_vhk6k">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
