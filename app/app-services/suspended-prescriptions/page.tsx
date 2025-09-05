'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SuspendedPrescriptionsPage() {
    const [suspendedPrescriptions, setSuspendedPrescriptions] = useState([
        {
            id: 'RX-240115-001',
            patient: 'Ahmed Mohamed',
            medication: 'Metformin 500mg',
            doctor: 'Dr. Sarah Ahmed',
            reason: 'Doctor verification needed',
            date: '2024-01-15',
            status: 'pending_verification',
        },
        {
            id: 'RX-240115-002',
            patient: 'Fatima Ali',
            medication: 'Lisinopril 10mg',
            doctor: 'Dr. Omar Hassan',
            reason: 'Insurance pre-authorization required',
            date: '2024-01-14',
            status: 'insurance_pending',
        },
        {
            id: 'RX-240115-003',
            patient: 'Omar Hassan',
            medication: 'Atorvastatin 20mg',
            doctor: 'Dr. Mona Khalil',
            reason: 'Prescription expired',
            date: '2024-01-13',
            status: 'expired',
        },
    ]);

    const [activeFilter, setActiveFilter] = useState('all');

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending_verification':
                return 'secondary';
            case 'insurance_pending':
                return 'default';
            case 'expired':
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
            default:
                return status;
        }
    };

    const handleDeletePrescription = (id: string) => {
        if (confirm('Are you sure you want to delete this prescription?')) {
            setSuspendedPrescriptions((prev) =>
                prev.filter((prescription) => prescription.id !== id),
            );
        }
    };

    const handleContactPharmacy = (prescription: any) => {
        alert(
            `Contacting pharmacy for prescription ${prescription.id} - ${prescription.medication}`,
        );
    };

    const handleContactCustomer = (prescription: any) => {
        alert(`Contacting customer ${prescription.patient} for prescription ${prescription.id}`);
    };

    const handleEditOrder = (prescription: any) => {
        alert(`Opening edit form for prescription ${prescription.id}`);
    };

    const filteredPrescriptions =
        activeFilter === 'all'
            ? suspendedPrescriptions
            : suspendedPrescriptions.filter((p) => p.status === activeFilter);

    const getFilterCount = (status: string) => {
        if (status === 'all') return suspendedPrescriptions.length;
        return suspendedPrescriptions.filter((p) => p.status === status).length;
    };

    return (
        <div
            className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen"
            data-oid="ef0jhci"
        >
            {/* Header Section */}
            <Card
                className="border-0 shadow-xl bg-gradient-to-r from-[#1F1F6F] to-[#2D4A9E] text-white"
                data-oid="91sb5fr"
            >
                <CardHeader className="pb-8" data-oid="0u6o_7-">
                    <div className="flex items-center justify-between" data-oid="3aex74v">
                        <div className="flex items-center space-x-4" data-oid="eby25o0">
                            <div
                                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                                data-oid="ea-xd:j"
                            >
                                <span className="text-3xl" data-oid="kalktog">
                                    🏥
                                </span>
                            </div>
                            <div data-oid="8gsmrhm">
                                <CardTitle
                                    className="text-3xl font-bold text-white mb-2"
                                    data-oid="w3x84r0"
                                >
                                    Suspended Prescriptions
                                </CardTitle>
                                <CardDescription
                                    className="text-blue-100 text-lg"
                                    data-oid="4cdv-uf"
                                >
                                    Manage prescriptions requiring immediate attention
                                </CardDescription>
                            </div>
                        </div>
                        <div className="text-right" data-oid="hsees5v">
                            <div className="text-blue-100 text-sm font-medium" data-oid="l3xqql5">
                                Total Suspended
                            </div>
                            <div className="text-4xl font-bold text-white" data-oid="88pntjd">
                                {suspendedPrescriptions.length}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Filter Section */}
            <Card className="shadow-lg border-0" data-oid="zmho2x5">
                <CardContent className="p-6" data-oid="_-71fni">
                    <div className="flex flex-wrap gap-3" data-oid="xvlcnt7">
                        <Button
                            variant={activeFilter === 'all' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('all')}
                            className="rounded-full"
                            data-oid="ht6pqo5"
                        >
                            All ({getFilterCount('all')})
                        </Button>
                        <Button
                            variant={
                                activeFilter === 'pending_verification' ? 'secondary' : 'outline'
                            }
                            onClick={() => setActiveFilter('pending_verification')}
                            className="rounded-full"
                            data-oid="zf1v-c5"
                        >
                            ⏰ Pending Verification ({getFilterCount('pending_verification')})
                        </Button>
                        <Button
                            variant={activeFilter === 'insurance_pending' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('insurance_pending')}
                            className="rounded-full"
                            data-oid="jdurgh1"
                        >
                            🔄 Insurance Pending ({getFilterCount('insurance_pending')})
                        </Button>
                        <Button
                            variant={activeFilter === 'expired' ? 'destructive' : 'outline'}
                            onClick={() => setActiveFilter('expired')}
                            className="rounded-full"
                            data-oid="lvamdvi"
                        >
                            ❌ Expired ({getFilterCount('expired')})
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Prescriptions List */}
            <Card className="shadow-xl border-0" data-oid="53c.r1b">
                <CardHeader
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border-b"
                    data-oid="87xg_s7"
                >
                    <CardTitle className="text-xl text-gray-800" data-oid="qqe8a1l">
                        Prescription Management ({filteredPrescriptions.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0" data-oid="vpys.p2">
                    <div className="divide-y divide-gray-100" data-oid="i12peb6">
                        {filteredPrescriptions.map((prescription, index) => (
                            <div
                                key={prescription.id}
                                className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                                data-oid="0_v5m2n"
                            >
                                <div
                                    className="flex items-start justify-between"
                                    data-oid="kc77lyv"
                                >
                                    <div className="flex-1 space-y-4" data-oid="x-l5n2:">
                                        {/* Status and ID */}
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="txam4uz"
                                        >
                                            <Badge
                                                variant={getStatusVariant(prescription.status)}
                                                className="flex items-center gap-1"
                                                data-oid="s2te0sk"
                                            >
                                                {prescription.status === 'pending_verification' &&
                                                    '⏰'}
                                                {prescription.status === 'insurance_pending' &&
                                                    '🔄'}
                                                {prescription.status === 'expired' && '❌'}
                                                {getStatusText(prescription.status)}
                                            </Badge>
                                            <span
                                                className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full"
                                                data-oid="t2kwwf0"
                                            >
                                                {prescription.id}
                                            </span>
                                        </div>

                                        {/* Patient Info Grid */}
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                            data-oid="5ulcond"
                                        >
                                            <div className="space-y-1" data-oid="kdp0037">
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="bus0-gy"
                                                >
                                                    <span
                                                        className="text-blue-600"
                                                        data-oid=":6j0wtt"
                                                    >
                                                        👤
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium text-gray-500"
                                                        data-oid="u_wzqy-"
                                                    >
                                                        Patient
                                                    </span>
                                                </div>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="-tamdjs"
                                                >
                                                    {prescription.patient}
                                                </p>
                                            </div>
                                            <div className="space-y-1" data-oid="zc_zrr4">
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="6diaiq-"
                                                >
                                                    <span
                                                        className="text-green-600"
                                                        data-oid="xkcf.90"
                                                    >
                                                        💊
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium text-gray-500"
                                                        data-oid="m5mo7bf"
                                                    >
                                                        Medication
                                                    </span>
                                                </div>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="tj1r07j"
                                                >
                                                    {prescription.medication}
                                                </p>
                                            </div>
                                            <div className="space-y-1" data-oid="jg519x9">
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="rrwxip1"
                                                >
                                                    <span
                                                        className="text-purple-600"
                                                        data-oid="6sm-i58"
                                                    >
                                                        👨‍⚕️
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium text-gray-500"
                                                        data-oid="c-i4br-"
                                                    >
                                                        Prescribing Doctor
                                                    </span>
                                                </div>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="8g2173w"
                                                >
                                                    {prescription.doctor}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Reason and Date */}
                                        <div
                                            className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                                            data-oid="1z15457"
                                        >
                                            <p
                                                className="text-sm text-amber-800"
                                                data-oid="db44pzd"
                                            >
                                                <span className="font-semibold" data-oid="mfomseq">
                                                    Suspension Reason:
                                                </span>{' '}
                                                {prescription.reason}
                                            </p>
                                            <p
                                                className="text-xs text-amber-600 mt-1"
                                                data-oid="ekfe7p:"
                                            >
                                                Suspended on{' '}
                                                {new Date(prescription.date).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    },
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div
                                        className="flex flex-col space-y-2 ml-6"
                                        data-oid="e24.r-t"
                                    >
                                        <Button
                                            onClick={() => handleContactPharmacy(prescription)}
                                            variant="outline"
                                            size="sm"
                                            className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                                            data-oid="tudho57"
                                        >
                                            📞 Contact Pharmacy
                                        </Button>
                                        <Button
                                            onClick={() => handleContactCustomer(prescription)}
                                            variant="outline"
                                            size="sm"
                                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                            data-oid="vskrzbj"
                                        >
                                            👤 Contact Customer
                                        </Button>
                                        <Button
                                            onClick={() => handleEditOrder(prescription)}
                                            variant="outline"
                                            size="sm"
                                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                            data-oid="8-yh72z"
                                        >
                                            ✏️ Edit Order
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDeletePrescription(prescription.id)
                                            }
                                            variant="outline"
                                            size="sm"
                                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                            data-oid="kk4i94z"
                                        >
                                            🗑️ Delete Order
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
                data-oid="2812e8z"
            >
                <CardHeader data-oid="_h.2_9i">
                    <CardTitle className="text-xl text-gray-800" data-oid="mh_1e_d">
                        Quick Actions
                    </CardTitle>
                    <CardDescription data-oid="a83qnp1">
                        Perform bulk operations on all prescriptions
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="mrh-o4x">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid=".m-0535">
                        <Button
                            variant="outline"
                            className="h-20 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:scale-105 transition-all duration-200"
                            data-oid="ov1zkpa"
                        >
                            <div className="text-center" data-oid="1_qa34_">
                                <div className="text-3xl mb-2" data-oid=".4y8xgh">
                                    🏥
                                </div>
                                <div className="font-semibold" data-oid="yje8msl">
                                    Contact All Pharmacies
                                </div>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                            data-oid="t3.59nn"
                        >
                            <div className="text-center" data-oid="td246e5">
                                <div className="text-3xl mb-2" data-oid="2uxj0-o">
                                    👥
                                </div>
                                <div className="font-semibold" data-oid="5pxvk_c">
                                    Contact All Customers
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
