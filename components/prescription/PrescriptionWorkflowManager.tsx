'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
    PrescriptionWorkflow,
    PrescriptionStatus,
    PrescriptionUrgency,
    PrescriptionWorkflowManager as WorkflowManager,
} from '@/lib/data/prescriptionWorkflow';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';

interface PrescriptionWorkflowManagerProps {
    userRole: string;
    userId: string;
    onPrescriptionUpdate?: (prescription: PrescriptionWorkflow) => void;
}

export function PrescriptionWorkflowManagerComponent({
    userRole,
    userId,
    onPrescriptionUpdate,
}: PrescriptionWorkflowManagerProps) {
    const [prescriptions, setPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWorkflow | null>(
        null,
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const [filters, setFilters] = useState<{
        status?: PrescriptionStatus;
        urgency?: PrescriptionUrgency;
    }>({});

    const { user } = useAuth();

    useEffect(() => {
        loadPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole, userId, filters]);

    const loadPrescriptions = async () => {
        try {
            setIsLoading(true);
            const data = await PrescriptionWorkflowService.getPrescriptions(
                userRole,
                userId,
                filters,
            );
            setPrescriptions(data);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (
        prescriptionId: string,
        newStatus: PrescriptionStatus,
        notes?: string,
    ) => {
        if (!user) return;

        try {
            setIsUpdating(true);
            const updatedPrescription = await PrescriptionWorkflowService.updatePrescriptionStatus(
                prescriptionId,
                newStatus,
                user.id,
                user.role,
                user.name,
                notes,
            );

            // Update local state
            setPrescriptions((prev) =>
                prev.map((p) => (p.id === prescriptionId ? updatedPrescription : p)),
            );

            if (selectedPrescription?.id === prescriptionId) {
                setSelectedPrescription(updatedPrescription);
            }

            onPrescriptionUpdate?.(updatedPrescription);
        } catch (error) {
            console.error('Error updating prescription status:', error);
            alert('Failed to update prescription status');
        } finally {
            setIsUpdating(false);
        }
    };

    const getAvailableActions = (prescription: PrescriptionWorkflow) => {
        return WorkflowManager.getNextPossibleSteps(prescription.currentStatus, userRole);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8" data-oid="mq9h-8b">
                <div
                    className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                    data-oid="6qawowh"
                ></div>
                <span className="ml-3 text-gray-600" data-oid="whyv59i">
                    Loading prescriptions...
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="g6j.alf">
            {/* Filters */}
            <div
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                data-oid="20br-u_"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="qsm-rw9">
                    Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="dg9-x_7">
                    <div data-oid="a60y8-z">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="7jc7d6z"
                        >
                            Status
                        </label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: (e.target.value as PrescriptionStatus) || undefined,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="-d2ga4c"
                        >
                            <option value="" data-oid="k0zpz0d">
                                All Statuses
                            </option>
                            <option value="submitted" data-oid="rr.-p4o">
                                Submitted
                            </option>
                            <option value="reviewing" data-oid="61ixx5.">
                                Under Review
                            </option>
                            <option value="approved" data-oid="sf61:hl">
                                Approved
                            </option>
                            <option value="rejected" data-oid="74:2yy7">
                                Rejected
                            </option>
                            <option value="preparing" data-oid="qi62xqy">
                                Preparing
                            </option>
                            <option value="ready" data-oid="ifa7htk">
                                Ready
                            </option>
                            <option value="out-for-delivery" data-oid="x4094xm">
                                Out for Delivery
                            </option>
                            <option value="delivered" data-oid="s2i.kv8">
                                Delivered
                            </option>
                        </select>
                    </div>
                    <div data-oid="tjq.5a:">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="lnb9u21"
                        >
                            Urgency
                        </label>
                        <select
                            value={filters.urgency || ''}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    urgency: (e.target.value as PrescriptionUrgency) || undefined,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="tw20xlt"
                        >
                            <option value="" data-oid="j8l5_z1">
                                All Urgencies
                            </option>
                            <option value="urgent" data-oid=":m767.y">
                                Urgent
                            </option>
                            <option value="normal" data-oid="1wdppjq">
                                Normal
                            </option>
                            <option value="routine" data-oid="5x0b7n_">
                                Routine
                            </option>
                        </select>
                    </div>
                    <div className="flex items-end" data-oid="2vqhil.">
                        <button
                            onClick={() => setFilters({})}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            data-oid="t5ea09w"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4" data-oid="sprl2kh">
                {prescriptions.length === 0 ? (
                    <div
                        className="text-center py-12 bg-white rounded-lg border border-gray-200"
                        data-oid="-2_f0pq"
                    >
                        <div
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="ui0ojdr"
                        >
                            <span className="text-2xl" data-oid="i461okk">
                                📋
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="81iwrw_">
                            No Prescriptions Found
                        </h3>
                        <p className="text-gray-600" data-oid="yuk.idx">
                            No prescriptions match your current filters.
                        </p>
                    </div>
                ) : (
                    prescriptions.map((prescription) => (
                        <div
                            key={prescription.id}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                            data-oid="gcc37_a"
                        >
                            <div className="p-6" data-oid="ju1ore_">
                                {/* Header */}
                                <div
                                    className="flex items-start justify-between mb-4"
                                    data-oid="3ouyaq3"
                                >
                                    <div data-oid="0livrey">
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="8mkmshg"
                                        >
                                            {prescription.id}
                                        </h3>
                                        <p className="text-sm text-gray-600" data-oid="gbkvx80">
                                            Patient: {prescription.patientName}
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="07m_dpu">
                                            Submitted: {formatDate(prescription.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="z0ogtb6">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(prescription.urgency)}`}
                                            data-oid="uobvc9f"
                                        >
                                            {prescription.urgency.charAt(0).toUpperCase() +
                                                prescription.urgency.slice(1)}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${WorkflowManager.getStatusColor(prescription.currentStatus)}`}
                                            data-oid=".4:lns0"
                                        >
                                            {WorkflowManager.getStatusIcon(
                                                prescription.currentStatus,
                                            )}{' '}
                                            {prescription.currentStatus.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4" data-oid="6.q292_">
                                    <div
                                        className="flex items-center justify-between text-sm text-gray-600 mb-2"
                                        data-oid="z38lxmf"
                                    >
                                        <span data-oid="jjp6yk0">Progress</span>
                                        <span data-oid="lytco_y">
                                            {WorkflowManager.getWorkflowProgress(
                                                prescription.currentStatus,
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-2"
                                        data-oid="opg85nu"
                                    >
                                        <div
                                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${WorkflowManager.getWorkflowProgress(prescription.currentStatus)}%`,
                                            }}
                                            data-oid="yi-_r8h"
                                        ></div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                                    data-oid="bfpbin4"
                                >
                                    <div data-oid="h9p2yza">
                                        <h4
                                            className="font-medium text-gray-900 mb-2"
                                            data-oid=":obtdu0"
                                        >
                                            Customer Information
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="zc.vcde">
                                            Name: {prescription.customerName}
                                        </p>
                                        <p className="text-sm text-gray-600" data-oid="0sr7g.8">
                                            Phone: {prescription.customerPhone}
                                        </p>
                                        {prescription.doctorName && (
                                            <p className="text-sm text-gray-600" data-oid="8.q7o64">
                                                Doctor: {prescription.doctorName}
                                            </p>
                                        )}
                                    </div>
                                    <div data-oid="o_8-mbh">
                                        <h4
                                            className="font-medium text-gray-900 mb-2"
                                            data-oid="332vp7s"
                                        >
                                            Processing Information
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="67xg_lu">
                                            Estimated Completion:{' '}
                                            {formatDate(prescription.estimatedCompletion)}
                                        </p>
                                        {prescription.assignedReaderId && (
                                            <p className="text-sm text-gray-600" data-oid="kque53z">
                                                Assigned Reader: {prescription.assignedReaderId}
                                            </p>
                                        )}
                                        {prescription.assignedPharmacyId && (
                                            <p className="text-sm text-gray-600" data-oid="9:lsxnj">
                                                Assigned Pharmacy: {prescription.assignedPharmacyId}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                {prescription.notes && (
                                    <div
                                        className="mb-4 p-3 bg-gray-50 rounded-lg"
                                        data-oid="i.96d2c"
                                    >
                                        <h4
                                            className="font-medium text-gray-900 mb-1"
                                            data-oid="jc6cap7"
                                        >
                                            Notes
                                        </h4>
                                        <p className="text-sm text-gray-600" data-oid="081uh3b">
                                            {prescription.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Processed Medicines */}
                                {prescription.processedMedicines &&
                                    prescription.processedMedicines.length > 0 && (
                                        <div className="mb-4" data-oid="ccyytt:">
                                            <h4
                                                className="font-medium text-gray-900 mb-2"
                                                data-oid="qv7_z:1"
                                            >
                                                Processed Medicines
                                            </h4>
                                            <div className="space-y-2" data-oid="7ya:0p4">
                                                {prescription.processedMedicines.map((medicine) => (
                                                    <div
                                                        key={medicine.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        data-oid="b4rjamu"
                                                    >
                                                        <div data-oid="2hh7c89">
                                                            <p
                                                                className="font-medium text-gray-900"
                                                                data-oid="7uveeow"
                                                            >
                                                                {medicine.productName}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="f8-rkd4"
                                                            >
                                                                Quantity: {medicine.quantity} |
                                                                Instructions:{' '}
                                                                {medicine.instructions}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className="text-right"
                                                            data-oid="b--_n06"
                                                        >
                                                            <p
                                                                className="font-medium text-gray-900"
                                                                data-oid="y2xn31b"
                                                            >
                                                                EGP {medicine.price.toFixed(2)}
                                                            </p>
                                                            <p
                                                                className={`text-sm ${medicine.isAvailable ? 'text-green-600' : 'text-red-600'}`}
                                                                data-oid="wv4oye7"
                                                            >
                                                                {medicine.isAvailable
                                                                    ? 'Available'
                                                                    : 'Out of Stock'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {prescription.totalAmount && (
                                                <div
                                                    className="mt-3 pt-3 border-t border-gray-200"
                                                    data-oid="bo40_gj"
                                                >
                                                    <div
                                                        className="flex items-center justify-between"
                                                        data-oid="jtdeyao"
                                                    >
                                                        <span
                                                            className="font-medium text-gray-900"
                                                            data-oid="63lv5n6"
                                                        >
                                                            Total Amount:
                                                        </span>
                                                        <span
                                                            className="font-bold text-lg text-[#1F1F6F]"
                                                            data-oid="zqv.h1d"
                                                        >
                                                            EGP{' '}
                                                            {prescription.totalAmount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {/* Actions */}
                                <div
                                    className="flex items-center justify-between pt-4 border-t border-gray-200"
                                    data-oid="-b8z6jg"
                                >
                                    <button
                                        onClick={() =>
                                            setSelectedPrescription(
                                                selectedPrescription?.id === prescription.id
                                                    ? null
                                                    : prescription,
                                            )
                                        }
                                        className="text-[#1F1F6F] hover:text-[#14274E] font-medium transition-colors duration-200"
                                        data-oid="x-fr2yq"
                                    >
                                        {selectedPrescription?.id === prescription.id
                                            ? 'Hide Details'
                                            : 'View Details'}
                                    </button>

                                    <div className="flex items-center space-x-2" data-oid="9ol0qra">
                                        {getAvailableActions(prescription).map((action) => (
                                            <button
                                                key={action}
                                                onClick={() =>
                                                    handleStatusUpdate(prescription.id, action)
                                                }
                                                disabled={isUpdating}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                    action === 'approved'
                                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                                        : action === 'rejected' ||
                                                          action === 'cancelled'
                                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                                        : 'bg-[#1F1F6F] hover:bg-[#14274E] text-white'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                data-oid="bicwzk9"
                                            >
                                                {isUpdating
                                                    ? 'Updating...'
                                                    : action.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {selectedPrescription?.id === prescription.id && (
                                    <div
                                        className="mt-6 pt-6 border-t border-gray-200"
                                        data-oid="x1m5nz8"
                                    >
                                        <h4
                                            className="font-medium text-gray-900 mb-4"
                                            data-oid="_mlz_vn"
                                        >
                                            Status History
                                        </h4>
                                        <div className="space-y-3" data-oid="cv4im64">
                                            {prescription.statusHistory.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start space-x-3"
                                                    data-oid="ye2pjti"
                                                >
                                                    <div
                                                        className="w-8 h-8 bg-[#1F1F6F] rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                        data-oid="z:uzhyv"
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1" data-oid="v-dg9qk">
                                                        <div
                                                            className="flex items-center justify-between"
                                                            data-oid="ss0bywr"
                                                        >
                                                            <p
                                                                className="font-medium text-gray-900"
                                                                data-oid="27d5a.:"
                                                            >
                                                                {entry.status.replace('-', ' ')}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-600"
                                                                data-oid="jrobfwi"
                                                            >
                                                                {formatDate(entry.timestamp)}
                                                            </p>
                                                        </div>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="b9ba03q"
                                                        >
                                                            By: {entry.userName} ({entry.userRole})
                                                        </p>
                                                        {entry.notes && (
                                                            <p
                                                                className="text-sm text-gray-600 mt-1"
                                                                data-oid="m6d1:b6"
                                                            >
                                                                {entry.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}