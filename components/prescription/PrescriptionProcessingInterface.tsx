'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import {
    PrescriptionWorkflow,
    PrescriptionWorkflowManager,
    ProcessedMedicine,
} from '@/lib/data/prescriptionWorkflow';
import { MedicineSearchModal } from '@/components/prescription/MedicineSearchModal';

interface PrescriptionProcessingInterfaceProps {
    prescription: PrescriptionWorkflow;
    onUpdate: () => void;
}

export function PrescriptionProcessingInterface({
    prescription,
    onUpdate,
}: PrescriptionProcessingInterfaceProps) {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedMedicines, setProcessedMedicines] = useState<ProcessedMedicine[]>(
        prescription.processedMedicines || [],
    );
    const [notes, setNotes] = useState('');
    const [showMedicineSearch, setShowMedicineSearch] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const handleStatusUpdate = async (newStatus: 'approved' | 'rejected' | 'reviewing') => {
        if (!user) return;

        try {
            setIsProcessing(true);

            let updateNotes = notes;
            if (newStatus === 'rejected' && rejectionReason) {
                updateNotes = `Rejected: ${rejectionReason}${notes ? ` - ${notes}` : ''}`;
            }

            await PrescriptionWorkflowService.updatePrescriptionStatus(
                prescription.id,
                newStatus,
                user.id,
                user.role,
                user.name,
                updateNotes,
            );

            onUpdate();
        } catch (error) {
            console.error('Error updating prescription status:', error);
            alert('Failed to update prescription status');
        } finally {
            setIsProcessing(false);
            setShowRejectionModal(false);
            setRejectionReason('');
            setNotes('');
        }
    };

    const handleAddMedicine = (medicine: any) => {
        const newMedicine: ProcessedMedicine = {
            id: `med-${Date.now()}`,
            productId: medicine.id,
            productName: medicine.name,
            quantity: 1,
            dosage: medicine.dosage || '',
            frequency: medicine.frequency || '', // Added frequency field
            duration: medicine.duration || '',   // Added duration field
            instructions: '',
            price: medicine.price || 0,
            pharmacyId: 'pharmacy-1', // This would be selected
            isAvailable: true,
        };

        setProcessedMedicines((prev) => [...prev, newMedicine]);
        setShowMedicineSearch(false);
    };

    const handleRemoveMedicine = (medicineId: string) => {
        setProcessedMedicines((prev) => prev.filter((m) => m.id !== medicineId));
    };

    const handleUpdateMedicine = (medicineId: string, updates: Partial<ProcessedMedicine>) => {
        setProcessedMedicines((prev) =>
            prev.map((m) => (m.id === medicineId ? { ...m, ...updates } : m)),
        );
    };

    const getTotalAmount = () => {
        return processedMedicines.reduce(
            (total, medicine) => total + medicine.price * medicine.quantity,
            0,
        );
    };

    const canApprove = () => {
        return (
            processedMedicines.length > 0 &&
            processedMedicines.every((m) => 
                m.instructions.trim() !== '' &&
                m.frequency.trim() !== '' &&
                m.duration.trim() !== '' &&
                m.dosage.trim() !== ''
            )
        );
    };

    return (
        <div className="space-y-6" data-oid="x:t-kqg">
            {/* Prescription Details */}
            <div className="bg-gray-50 rounded-lg p-4" data-oid="p2ojoap">
                <h4 className="font-semibold text-gray-900 mb-3" data-oid="tggi840">
                    Prescription Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm" data-oid="-oclqs.">
                    <div data-oid="bmbaqdn">
                        <span className="font-medium text-gray-700" data-oid="hx6wzth">
                            Patient:
                        </span>
                        <p className="text-gray-900" data-oid="td-nrvn">
                            {prescription.patientName}
                        </p>
                    </div>
                    <div data-oid="9z23j4k">
                        <span className="font-medium text-gray-700" data-oid="3w6t6r_">
                            Customer:
                        </span>
                        <p className="text-gray-900" data-oid="42p_uzf">
                            {prescription.customerName}
                        </p>
                    </div>
                    <div data-oid="70na:yh">
                        <span className="font-medium text-gray-700" data-oid="p_1kdh7">
                            Phone:
                        </span>
                        <p className="text-gray-900" data-oid="c1pbv03">
                            {prescription.customerPhone}
                        </p>
                    </div>
                    <div data-oid="nlu094j">
                        <span className="font-medium text-gray-700" data-oid="4c60o3w">
                            Submitted:
                        </span>
                        <p className="text-gray-900" data-oid="0xe_p33">
                            {formatDate(prescription.createdAt)}
                        </p>
                    </div>
                    {prescription.doctorName && (
                        <div data-oid="rtnhru3">
                            <span className="font-medium text-gray-700" data-oid="y80wxby">
                                Doctor:
                            </span>
                            <p className="text-gray-900" data-oid="-jq8ihf">
                                {prescription.doctorName}
                            </p>
                        </div>
                    )}
                    {prescription.hospitalClinic && (
                        <div data-oid="h5lls:x">
                            <span className="font-medium text-gray-700" data-oid="6qebsd4">
                                Hospital/Clinic:
                            </span>
                            <p className="text-gray-900" data-oid="q8deeyr">
                                {prescription.hospitalClinic}
                            </p>
                        </div>
                    )}
                </div>

                {prescription.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg" data-oid="g:ddsgj">
                        <span className="font-medium text-gray-700" data-oid="b09xqzj">
                            Customer Notes:
                        </span>
                        <p className="text-gray-900 mt-1" data-oid="ae8b2qv">
                            {prescription.notes}
                        </p>
                    </div>
                )}
            </div>

            {/* Prescription Files */}
            <div data-oid="t1ggtm4">
                <h4 className="font-semibold text-gray-900 mb-3" data-oid="_y9g_7c">
                    Prescription Files
                </h4>
                <div className="grid grid-cols-2 gap-4" data-oid="shm.j8f">
                    {prescription.files.map((file) => (
                        <div
                            key={file.id}
                            className="border border-gray-200 rounded-lg p-4"
                            data-oid="0c:it69"
                        >
                            <div className="flex items-center space-x-3" data-oid="1il5raq">
                                <div
                                    className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                                    data-oid="vcoiehy"
                                >
                                    <span className="text-blue-600" data-oid="t8q6928">
                                        {file.type === 'pdf' ? '📄' : '🖼️'}
                                    </span>
                                </div>
                                <div className="flex-1" data-oid="3ipbk-v">
                                    <p className="font-medium text-gray-900" data-oid="wc27e0a">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="q3zsrmc">
                                        {file.type.toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    className="text-[#1F1F6F] hover:text-[#14274E] text-sm font-medium"
                                    data-oid="1.rd6il"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Processed Medicines */}
            <div data-oid="us8gvlh">
                <div className="flex items-center justify-between mb-3" data-oid="7er2t5:">
                    <h4 className="font-semibold text-gray-900" data-oid="-0a4ha9">
                        Processed Medicines
                    </h4>
                    <button
                        onClick={() => setShowMedicineSearch(true)}
                        className="bg-[#1F1F6F] hover:bg-[#14274E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        data-oid="ixvq7fw"
                    >
                        + Add Medicine
                    </button>
                </div>

                {processedMedicines.length === 0 ? (
                    <div
                        className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
                        data-oid="w456-1m"
                    >
                        <div
                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="052f77n"
                        >
                            <span className="text-xl" data-oid="w9lwi-i">
                                💊
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="70r_47w">
                            No Medicines Added
                        </h3>
                        <p className="text-gray-600 mb-4" data-oid="l1lad_j">
                            Add medicines from the prescription to continue processing
                        </p>
                        <button
                            onClick={() => setShowMedicineSearch(true)}
                            className="bg-[#1F1F6F] hover:bg-[#14274E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                            data-oid="zlx:-.8"
                        >
                            Add First Medicine
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4" data-oid="2dw_6jx">
                        {processedMedicines.map((medicine) => (
                            <div
                                key={medicine.id}
                                className="border border-gray-200 rounded-lg p-4"
                                data-oid=":dcy3i1"
                            >
                                <div
                                    className="flex items-start justify-between mb-3"
                                    data-oid="t23-l-s"
                                >
                                    <div data-oid="7iji4ny">
                                        <h5
                                            className="font-semibold text-gray-900"
                                            data-oid="o6mk..s"
                                        >
                                            {medicine.productName}
                                        </h5>
                                        <p className="text-sm text-gray-600" data-oid="bbw116r">
                                            Dosage: {medicine.dosage}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveMedicine(medicine.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                        data-oid="h3947nk"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4" data-oid="nd_wv5l">
                                    <div data-oid="ihvvb0d">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="banjfzy"
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={medicine.quantity}
                                            onChange={(e) =>
                                                handleUpdateMedicine(medicine.id, {
                                                    quantity: parseInt(e.target.value) || 1,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            data-oid="en8xrkr"
                                        />
                                    </div>
                                    <div data-oid="xshscp3">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="p.f5ouz"
                                        >
                                            Price (EGP)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={medicine.price}
                                            onChange={(e) =>
                                                handleUpdateMedicine(medicine.id, {
                                                    price: parseFloat(e.target.value) || 0,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            data-oid="bk.v19j"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4" data-oid="h070imq">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="taxl:xz"
                                    >
                                        Instructions *
                                    </label>
                                    <textarea
                                        value={medicine.instructions}
                                        onChange={(e) =>
                                            handleUpdateMedicine(medicine.id, {
                                                instructions: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Take 1 tablet twice daily after meals"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        rows={2}
                                        data-oid="yov4q_7"
                                    />
                                </div>

                                <div
                                    className="mt-3 flex items-center justify-between"
                                    data-oid="5vqh54l"
                                >
                                    <span className="text-sm text-gray-600" data-oid="jc:epz:">
                                        Total: EGP {(medicine.price * medicine.quantity).toFixed(2)}
                                    </span>
                                    <div className="flex items-center space-x-2" data-oid="pwjf2xf">
                                        <input
                                            type="checkbox"
                                            checked={medicine.isAvailable}
                                            onChange={(e) =>
                                                handleUpdateMedicine(medicine.id, {
                                                    isAvailable: e.target.checked,
                                                })
                                            }
                                            className="rounded border-gray-300 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                            data-oid="0ev7z_u"
                                        />

                                        <span className="text-sm text-gray-700" data-oid="wwht.g6">
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {processedMedicines.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4" data-oid=".sz.qqr">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="7teo3ci"
                                >
                                    <span
                                        className="font-semibold text-gray-900"
                                        data-oid="ps6p5.6"
                                    >
                                        Total Amount:
                                    </span>
                                    <span
                                        className="font-bold text-lg text-[#1F1F6F]"
                                        data-oid="fx63:ds"
                                    >
                                        EGP {getTotalAmount().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Processing Notes */}
            <div data-oid="5tjhhlc">
                <label className="block text-sm font-medium text-gray-700 mb-2" data-oid="k7c2zws">
                    Processing Notes
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about the prescription processing..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                    rows={3}
                    data-oid="-w13r-m"
                />
            </div>

            {/* Action Buttons */}
            <div
                className="flex items-center justify-between pt-4 border-t border-gray-200"
                data-oid="_cmd.i7"
            >
                <button
                    onClick={() => setShowRejectionModal(true)}
                    disabled={isProcessing}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-oid="vtj294w"
                >
                    Reject Prescription
                </button>

                <div className="flex items-center space-x-3" data-oid="76h9vhc">
                    <button
                        onClick={() => handleStatusUpdate('reviewing')}
                        disabled={isProcessing}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="tbgoxia"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('approved')}
                        disabled={isProcessing || !canApprove()}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="1qn7t2:"
                    >
                        {isProcessing ? 'Processing...' : 'Approve Prescription'}
                    </button>
                </div>
            </div>

            {/* Medicine Search Modal */}
            {showMedicineSearch && (
                <MedicineSearchModal
                    onSelect={handleAddMedicine}
                    onClose={() => setShowMedicineSearch(false)}
                    data-oid="-i_k3:6"
                />
            )}

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="mn0xwm:"
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-md" data-oid="7hhw5zq">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid=":avu9s9">
                            Reject Prescription
                        </h3>

                        <div className="mb-4" data-oid="r4mz6dc">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="m3cn9cu"
                            >
                                Rejection Reason *
                            </label>
                            <select
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="0tk1ji7"
                            >
                                <option value="" data-oid="r5dvj.h">
                                    Select reason
                                </option>
                                <option value="Unclear prescription" data-oid="7wkyv76">
                                    Unclear prescription
                                </option>
                                <option value="Missing information" data-oid="rcd32d0">
                                    Missing information
                                </option>
                                <option value="Invalid prescription" data-oid="9q7xfwg">
                                    Invalid prescription
                                </option>
                                <option value="Expired prescription" data-oid="eu-d68t">
                                    Expired prescription
                                </option>
                                <option value="Controlled substance issue" data-oid="wvdg.z2">
                                    Controlled substance issue
                                </option>
                                <option value="Other" data-oid="lskuug1">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="mb-6" data-oid="-pe3fx5">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="e99sn7y"
                            >
                                Additional Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Provide additional details about the rejection..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                rows={3}
                                data-oid="v6sv2nk"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3" data-oid="jcd8je6">
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                data-oid="87bak6y"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('rejected')}
                                disabled={!rejectionReason || isProcessing}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="ypdoy1v"
                            >
                                {isProcessing ? 'Processing...' : 'Reject Prescription'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
