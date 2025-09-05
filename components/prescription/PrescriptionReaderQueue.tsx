'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import {
    PrescriptionWorkflow,
    PrescriptionWorkflowManager,
    PrescriptionStatus,
    PrescriptionUrgency,
} from '@/lib/data/prescriptionWorkflow';

interface PrescriptionReaderQueueProps {
    onPrescriptionSelect?: (prescription: PrescriptionWorkflow) => void;
    maxItems?: number;
}

export function PrescriptionReaderQueue({
    onPrescriptionSelect,
    maxItems,
}: PrescriptionReaderQueueProps) {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<{
        status?: PrescriptionStatus;
        urgency?: PrescriptionUrgency;
    }>({});

    useEffect(() => {
        loadPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, filter]);

    const loadPrescriptions = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const data = await PrescriptionWorkflowService.getPrescriptions(
                'prescription-reader',
                user.id,
                filter,
            );

            // Filter for prescriptions that need reader attention
            const readerPrescriptions = data.filter((p) =>
                ['submitted', 'reviewing'].includes(p.currentStatus),
            );

            // Sort by urgency and creation date
            readerPrescriptions.sort((a, b) => {
                // Urgent prescriptions first
                if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
                if (b.urgency === 'urgent' && a.urgency !== 'urgent') return 1;

                // Then by creation date (oldest first)
                return a.createdAt.getTime() - b.createdAt.getTime();
            });

            const limitedPrescriptions = maxItems
                ? readerPrescriptions.slice(0, maxItems)
                : readerPrescriptions;

            setPrescriptions(limitedPrescriptions);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
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

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8" data-oid="pkafhys">
                <div
                    className="w-6 h-6 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                    data-oid="pcr0qqb"
                ></div>
                <span className="ml-3 text-gray-600" data-oid="qsvsr6m">
                    Loading queue...
                </span>
            </div>
        );
    }

    if (prescriptions.length === 0) {
        return (
            <div className="text-center py-8" data-oid="k.9z_u3">
                <div
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    data-oid="p-9u0jl"
                >
                    <span className="text-xl" data-oid="-8_2d1d">
                        📋
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="z8wprju">
                    No Prescriptions in Queue
                </h3>
                <p className="text-gray-600" data-oid="gbq_iw3">
                    All prescriptions have been processed.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4" data-oid="_ofoqzu">
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-4" data-oid="ef8i:nh">
                <select
                    value={filter.urgency || ''}
                    onChange={(e) =>
                        setFilter((prev) => ({
                            ...prev,
                            urgency: (e.target.value as PrescriptionUrgency) || undefined,
                        }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                    data-oid="1l2h.ev"
                >
                    <option value="" data-oid="ve1p4te">
                        All Urgencies
                    </option>
                    <option value="urgent" data-oid="e0bn0g8">
                        Urgent
                    </option>
                    <option value="normal" data-oid="cb-d15p">
                        Normal
                    </option>
                    <option value="routine" data-oid="7sa.fxn">
                        Routine
                    </option>
                </select>

                <select
                    value={filter.status || ''}
                    onChange={(e) =>
                        setFilter((prev) => ({
                            ...prev,
                            status: (e.target.value as PrescriptionStatus) || undefined,
                        }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                    data-oid="g_3bflk"
                >
                    <option value="" data-oid="wi1fsq2">
                        All Statuses
                    </option>
                    <option value="submitted" data-oid="9o.n.g0">
                        Submitted
                    </option>
                    <option value="reviewing" data-oid="71zmqhn">
                        Under Review
                    </option>
                </select>

                {(filter.urgency || filter.status) && (
                    <button
                        onClick={() => setFilter({})}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        data-oid=".9coh.7"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Prescription List */}
            <div className="space-y-3" data-oid="_n5208v">
                {prescriptions.map((prescription) => (
                    <div
                        key={prescription.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => onPrescriptionSelect?.(prescription)}
                        data-oid="vla3z12"
                    >
                        <div className="flex items-start justify-between mb-3" data-oid="kfjeukl">
                            <div data-oid="50an_9n">
                                <h4 className="font-semibold text-gray-900" data-oid=".4tnx7w">
                                    {prescription.id}
                                </h4>
                                <p className="text-sm text-gray-600" data-oid="e:_lshc">
                                    Patient: {prescription.patientName}
                                </p>
                                <p className="text-sm text-gray-600" data-oid="r1te36o">
                                    Customer: {prescription.customerName}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="8mgn8rz">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(prescription.urgency)}`}
                                    data-oid="1ik0af3"
                                >
                                    {prescription.urgency.charAt(0).toUpperCase() +
                                        prescription.urgency.slice(1)}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${PrescriptionWorkflowManager.getStatusColor(prescription.currentStatus)}`}
                                    data-oid="-s-nk7k"
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
                            data-oid="9f:im94"
                        >
                            <div data-oid="f9x_ld4">
                                <span className="font-medium" data-oid=":x.kmm7">
                                    Submitted:
                                </span>{' '}
                                {formatDate(prescription.createdAt)}
                            </div>
                            <div data-oid="x9_e-n:">
                                <span className="font-medium" data-oid="d7-iip9">
                                    Time ago:
                                </span>{' '}
                                {getTimeAgo(prescription.createdAt)}
                            </div>
                            {prescription.doctorName && (
                                <div data-oid="4dq--bg">
                                    <span className="font-medium" data-oid="u3b-aj9">
                                        Doctor:
                                    </span>{' '}
                                    {prescription.doctorName}
                                </div>
                            )}
                            <div data-oid="9.8166-">
                                <span className="font-medium" data-oid="vzp9__a">
                                    Files:
                                </span>{' '}
                                {prescription.files.length} file(s)
                            </div>
                        </div>

                        {prescription.notes && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3" data-oid="mlfo._b">
                                <p className="text-sm text-gray-700" data-oid="2e4y6rz">
                                    <span className="font-medium" data-oid="-wtc5_:">
                                        Notes:
                                    </span>{' '}
                                    {prescription.notes}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between" data-oid="2ww8c4d">
                            <div className="flex items-center space-x-2" data-oid="3ru:k06">
                                {prescription.urgency === 'urgent' && (
                                    <span
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                        data-oid="bl44ywz"
                                    >
                                        🚨 Urgent
                                    </span>
                                )}
                                {prescription.currentStatus === 'submitted' && (
                                    <span
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        data-oid="xfw8py."
                                    >
                                        📝 New
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPrescriptionSelect?.(prescription);
                                }}
                                className="text-[#1F1F6F] hover:text-[#14274E] font-medium text-sm transition-colors duration-200"
                                data-oid="x_xh9yu"
                            >
                                Process →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {maxItems && prescriptions.length >= maxItems && (
                <div className="text-center pt-4" data-oid="ciomkob">
                    <button
                        onClick={() => (window.location.href = '/prescription-reader/queue')}
                        className="text-[#1F1F6F] hover:text-[#14274E] font-medium text-sm transition-colors duration-200"
                        data-oid="fhzytc7"
                    >
                        View All Prescriptions →
                    </button>
                </div>
            )}
        </div>
    );
}
