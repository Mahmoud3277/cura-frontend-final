'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import { MedicineDatabaseService, Medicine } from '@/lib/services/medicineDatabaseService';
import {
    MedicineInteractionService,
    MedicineForInteractionCheck,
} from '@/lib/services/medicineInteractionService';
import {
    PrescriptionWorkflow,
    PrescriptionWorkflowManager,
    ProcessedMedicine,
} from '@/lib/data/prescriptionWorkflow';
import { MedicineSearchModal } from '@/components/prescription/MedicineSearchModal';

interface EnhancedPrescriptionProcessingInterfaceProps {
    prescription: PrescriptionWorkflow;
    onUpdate: () => void;
}

interface DrugInteraction {
    medicine1: string;
    medicine2: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
}

interface ProcessingTemplate {
    id: string;
    name: string;
    description: string;
    medicines: Partial<ProcessedMedicine>[];
}

const commonTemplates: ProcessingTemplate[] = [
    {
        id: 'pain-relief',
        name: 'Pain Relief Package',
        description: 'Common pain relief medications',
        medicines: [
            {
                productName: 'Paracetamol 500mg',
                quantity: 20,
                instructions: 'Take 1-2 tablets every 6 hours as needed for pain',
                price: 25.0,
            },
            {
                productName: 'Ibuprofen 400mg',
                quantity: 14,
                instructions: 'Take 1 tablet every 8 hours with food',
                price: 30.0,
            },
        ],
    },
    {
        id: 'cold-flu',
        name: 'Cold & Flu Treatment',
        description: 'Standard cold and flu medications',
        medicines: [
            {
                productName: 'Paracetamol 500mg',
                quantity: 20,
                instructions: 'Take 1-2 tablets every 6 hours for fever',
                price: 25.0,
            },
            {
                productName: 'Cetirizine 10mg',
                quantity: 10,
                instructions: 'Take 1 tablet daily for allergic symptoms',
                price: 20.0,
            },
        ],
    },
    {
        id: 'diabetes-starter',
        name: 'Diabetes Management',
        description: 'Basic diabetes medications',
        medicines: [
            {
                productName: 'Metformin 500mg',
                quantity: 60,
                instructions: 'Take 1 tablet twice daily with meals',
                price: 40.0,
            },
        ],
    },
];

export function EnhancedPrescriptionProcessingInterface({
    prescription,
    onUpdate,
}: EnhancedPrescriptionProcessingInterfaceProps) {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedMedicines, setProcessedMedicines] = useState<ProcessedMedicine[]>(
        prescription.processedMedicines || [],
    );
    const [notes, setNotes] = useState('');
    const [showMedicineSearch, setShowMedicineSearch] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);
    const [alternativeSuggestions, setAlternativeSuggestions] = useState<Medicine[]>([]);
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [qualityChecks, setQualityChecks] = useState({
        prescriptionClear: false,
        dosageVerified: false,
        interactionsChecked: false,
        patientInfoConfirmed: false,
    });

    useEffect(() => {
        if (processedMedicines.length > 1) {
            checkDrugInteractions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processedMedicines]);

    const checkDrugInteractions = async () => {
        try {
            // Convert processed medicines to interaction check format
            const medicinesForCheck: MedicineForInteractionCheck[] = processedMedicines.map(
                (med) => ({
                    id: med.productId,
                    name: med.productName,
                    activeIngredient: med.productName.split(' ')[0], // Simple extraction
                    category: 'Unknown',
                }),
            );

            if (medicinesForCheck.length >= 2) {
                const result =
                    await MedicineInteractionService.checkInteractions(medicinesForCheck);

                // Convert to our interaction format
                const interactions: DrugInteraction[] = result.interactions.map((interaction) => ({
                    medicine1: interaction.medicine1,
                    medicine2: interaction.medicine2,
                    severity: interaction.severity,
                    description: interaction.description,
                }));

                setDrugInteractions(interactions);
            }
        } catch (error) {
            console.error('Error checking drug interactions:', error);
        }
    };

    const loadAlternativeSuggestions = async (medicine: ProcessedMedicine) => {
        try {
            // Search for alternatives in the same category
            const result = await MedicineDatabaseService.searchMedicines({
                category: 'Pain Relief', // This would be determined from the medicine
            });
            setAlternativeSuggestions(result.medicines.filter((m) => m.id !== medicine.productId));
            setShowAlternatives(true);
        } catch (error) {
            console.error('Error loading alternatives:', error);
        }
    };

    const applyTemplate = (templateId: string) => {
        const template = commonTemplates.find((t) => t.id === templateId);
        if (!template) return;

        const newMedicines: ProcessedMedicine[] = template.medicines.map((med, index) => ({
            id: `med-${Date.now()}-${index}`,
            productId: `template-${templateId}-${index}`,
            productName: med.productName || '',
            quantity: med.quantity || 1,
            dosage: '500mg', // Default
            instructions: med.instructions || '',
            price: med.price || 0,
            pharmacyId: 'pharmacy-1',
            isAvailable: true,
        }));

        setProcessedMedicines((prev) => [...prev, ...newMedicines]);
        setSelectedTemplate('');
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

    const handleStatusUpdate = async (newStatus: 'approved' | 'rejected' | 'reviewing') => {
        if (!user) return;

        // Validate quality checks for approval
        if (newStatus === 'approved') {
            const allChecksComplete = Object.values(qualityChecks).every((check) => check);
            if (!allChecksComplete) {
                alert('Please complete all quality checks before approving the prescription.');
                return;
            }
        }

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
            pharmacyId: 'pharmacy-1',
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
            processedMedicines.every((m) => m.instructions.trim() !== '') &&
            Object.values(qualityChecks).every((check) => check)
        );
    };

    const getInteractionSeverityColor = (severity: string) => {
        switch (severity) {
            case 'severe':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'moderate':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'mild':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6" data-oid="zcn_fne">
            {/* Prescription Details */}
            <div className="bg-gray-50 rounded-lg p-4" data-oid="rke-57p">
                <h4 className="font-semibold text-gray-900 mb-3" data-oid="7e2fl-d">
                    Prescription Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm" data-oid="jhqij.p">
                    <div data-oid="2d32xga">
                        <span className="font-medium text-gray-700" data-oid="g5zrhxe">
                            Patient:
                        </span>
                        <p className="text-gray-900" data-oid="735l.re">
                            {prescription.patientName}
                        </p>
                    </div>
                    <div data-oid="1dqpwbq">
                        <span className="font-medium text-gray-700" data-oid="yagspma">
                            Customer:
                        </span>
                        <p className="text-gray-900" data-oid="g7lcij3">
                            {prescription.customerName}
                        </p>
                    </div>
                    <div data-oid="aa3zxun">
                        <span className="font-medium text-gray-700" data-oid="vxe5m6p">
                            Phone:
                        </span>
                        <p className="text-gray-900" data-oid="y6c4rpj">
                            {prescription.customerPhone}
                        </p>
                    </div>
                    <div data-oid="3q6jyi1">
                        <span className="font-medium text-gray-700" data-oid="bw9e3:s">
                            Submitted:
                        </span>
                        <p className="text-gray-900" data-oid="z825occ">
                            {formatDate(prescription.createdAt)}
                        </p>
                    </div>
                    {prescription.doctorName && (
                        <div data-oid="qzl2_tr">
                            <span className="font-medium text-gray-700" data-oid="kv2lx8r">
                                Doctor:
                            </span>
                            <p className="text-gray-900" data-oid="54xsnj1">
                                {prescription.doctorName}
                            </p>
                        </div>
                    )}
                    {prescription.hospitalClinic && (
                        <div data-oid="l.3ltm.">
                            <span className="font-medium text-gray-700" data-oid="awshmsu">
                                Hospital/Clinic:
                            </span>
                            <p className="text-gray-900" data-oid="-x_.i67">
                                {prescription.hospitalClinic}
                            </p>
                        </div>
                    )}
                </div>

                {prescription.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg" data-oid="apikqbl">
                        <span className="font-medium text-gray-700" data-oid="b..vk7.">
                            Customer Notes:
                        </span>
                        <p className="text-gray-900 mt-1" data-oid="jwz58:d">
                            {prescription.notes}
                        </p>
                    </div>
                )}
            </div>

            {/* Enhanced Prescription Files with Image Viewer */}
            <div data-oid="alxp_.a">
                <div className="flex items-center justify-between mb-3" data-oid="8yf7dmq">
                    <h4 className="font-semibold text-gray-900" data-oid=".rh5_7o">
                        Prescription Files
                    </h4>
                    <button
                        onClick={() => setShowImageViewer(true)}
                        className="text-[#1F1F6F] hover:text-[#14274E] text-sm font-medium transition-colors duration-200"
                        data-oid="icz8j:z"
                    >
                        View Full Screen
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4" data-oid="_ij1rua">
                    {prescription.files.map((file, index) => (
                        <div
                            key={file.id}
                            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                            onClick={() => {
                                setSelectedImageIndex(index);
                                setShowImageViewer(true);
                            }}
                            data-oid="-e:5ooi"
                        >
                            <div className="flex items-center space-x-3" data-oid="jld6.ii">
                                <div
                                    className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                                    data-oid="w04fzod"
                                >
                                    <span className="text-blue-600" data-oid="xu6:_1f">
                                        {file.type === 'pdf' ? '📄' : '🖼️'}
                                    </span>
                                </div>
                                <div className="flex-1" data-oid="9ae34ra">
                                    <p className="font-medium text-gray-900" data-oid="l9m.zwp">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="aak6.__">
                                        {file.type.toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    className="text-[#1F1F6F] hover:text-[#14274E] text-sm font-medium"
                                    data-oid=".5mjj2a"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quality Control Checklist */}
            <div className="bg-white border border-gray-200 rounded-lg p-4" data-oid="bi3:miu">
                <h4 className="font-semibold text-gray-900 mb-3" data-oid="_fw8.xl">
                    Quality Control Checklist
                </h4>
                <div className="space-y-3" data-oid="75_jzz2">
                    {Object.entries(qualityChecks).map(([key, checked]) => (
                        <label key={key} className="flex items-center space-x-3" data-oid="wiycdnc">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                    setQualityChecks((prev) => ({
                                        ...prev,
                                        [key]: e.target.checked,
                                    }))
                                }
                                className="rounded border-gray-300 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                data-oid="jq0d4mh"
                            />

                            <span className="text-sm text-gray-700" data-oid="4jj44fh">
                                {key === 'prescriptionClear' && 'Prescription is clear and legible'}
                                {key === 'dosageVerified' && 'Dosage and instructions verified'}
                                {key === 'interactionsChecked' && 'Drug interactions checked'}
                                {key === 'patientInfoConfirmed' && 'Patient information confirmed'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Processing Templates */}
            <div className="bg-white border border-gray-200 rounded-lg p-4" data-oid="5x-wt_a">
                <h4 className="font-semibold text-gray-900 mb-3" data-oid="hnb5nh5">
                    Quick Templates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3" data-oid="8fvuo8j">
                    {commonTemplates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => applyTemplate(template.id)}
                            className="text-left p-3 border border-gray-200 rounded-lg hover:border-[#1F1F6F] hover:bg-blue-50 transition-all duration-200"
                            data-oid=":lu8wau"
                        >
                            <h5 className="font-medium text-gray-900" data-oid="rmg4-6n">
                                {template.name}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1" data-oid="6bmdueo">
                                {template.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-2" data-oid="2gqwdqm">
                                {template.medicines.length} medicines
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Drug Interactions Alert */}
            {drugInteractions.length > 0 && (
                <div
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                    data-oid="bjpya0s"
                >
                    <div className="flex items-start space-x-3" data-oid="0r1koyg">
                        <div className="text-yellow-600 text-xl" data-oid="m0ecr_.">
                            ⚠️
                        </div>
                        <div className="flex-1" data-oid="h-u7l:.">
                            <h4 className="font-semibold text-yellow-800 mb-2" data-oid=".i8uaug">
                                Drug Interactions Detected
                            </h4>
                            <div className="space-y-2" data-oid="e92jvkq">
                                {drugInteractions.map((interaction, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded border ${getInteractionSeverityColor(interaction.severity)}`}
                                        data-oid="5q7cpza"
                                    >
                                        <p className="text-sm font-medium" data-oid="bhq7aza">
                                            {interaction.medicine1} ↔ {interaction.medicine2}
                                        </p>
                                        <p className="text-xs mt-1" data-oid="66a13km">
                                            {interaction.description}
                                        </p>
                                        <span
                                            className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-white"
                                            data-oid="cfqil:w"
                                        >
                                            {interaction.severity.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Processed Medicines */}
            <div data-oid="408j94a">
                <div className="flex items-center justify-between mb-3" data-oid="9e-bk6d">
                    <h4 className="font-semibold text-gray-900" data-oid="gtzy2gi">
                        Processed Medicines
                    </h4>
                    <button
                        onClick={() => setShowMedicineSearch(true)}
                        className="bg-[#1F1F6F] hover:bg-[#14274E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        data-oid="jw0:03g"
                    >
                        + Add Medicine
                    </button>
                </div>

                {processedMedicines.length === 0 ? (
                    <div
                        className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
                        data-oid="fnwdwhp"
                    >
                        <div
                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="w1xpfx:"
                        >
                            <span className="text-xl" data-oid="kupx86l">
                                💊
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="50g6uga">
                            No Medicines Added
                        </h3>
                        <p className="text-gray-600 mb-4" data-oid="vhgtdpm">
                            Add medicines from the prescription to continue processing
                        </p>
                        <div
                            className="flex items-center justify-center space-x-3"
                            data-oid="8bph9q0"
                        >
                            <button
                                onClick={() => setShowMedicineSearch(true)}
                                className="bg-[#1F1F6F] hover:bg-[#14274E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                data-oid="5topi5b"
                            >
                                Add Medicine
                            </button>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => {
                                    setSelectedTemplate(e.target.value);
                                    if (e.target.value) applyTemplate(e.target.value);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="0:7r88t"
                            >
                                <option value="" data-oid="fqd9_92">
                                    Use Template
                                </option>
                                {commonTemplates.map((template) => (
                                    <option
                                        key={template.id}
                                        value={template.id}
                                        data-oid="7uf.za1"
                                    >
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4" data-oid="u9ygmsk">
                        {processedMedicines.map((medicine) => (
                            <div
                                key={medicine.id}
                                className="border border-gray-200 rounded-lg p-4"
                                data-oid="0x2ed95"
                            >
                                <div
                                    className="flex items-start justify-between mb-3"
                                    data-oid="4h6iacn"
                                >
                                    <div data-oid="f6xyimw">
                                        <h5
                                            className="font-semibold text-gray-900"
                                            data-oid="_tumf0z"
                                        >
                                            {medicine.productName}
                                        </h5>
                                        <p className="text-sm text-gray-600" data-oid="b2on1bh">
                                            Dosage: {medicine.dosage}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2" data-oid="lym499r">
                                        <button
                                            onClick={() => loadAlternativeSuggestions(medicine)}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                            data-oid="qtbh6km"
                                        >
                                            Alternatives
                                        </button>
                                        <button
                                            onClick={() => handleRemoveMedicine(medicine.id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                            data-oid="yw49_d1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4" data-oid="pkwd3jl">
                                    <div data-oid="v.vf3mj">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="tw2kydw"
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
                                            data-oid="hw:uwc1"
                                        />
                                    </div>
                                    <div data-oid="m86lud:">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            data-oid="gtbj4jc"
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
                                            data-oid="u_1zsmj"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4" data-oid="iw4ccvw">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        data-oid="qpkn3fe"
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
                                        data-oid="45cfn-b"
                                    />
                                </div>

                                <div
                                    className="mt-3 flex items-center justify-between"
                                    data-oid="chop__j"
                                >
                                    <span className="text-sm text-gray-600" data-oid="won6s_z">
                                        Total: EGP {(medicine.price * medicine.quantity).toFixed(2)}
                                    </span>
                                    <div className="flex items-center space-x-2" data-oid="k3o5dyb">
                                        <input
                                            type="checkbox"
                                            checked={medicine.isAvailable}
                                            onChange={(e) =>
                                                handleUpdateMedicine(medicine.id, {
                                                    isAvailable: e.target.checked,
                                                })
                                            }
                                            className="rounded border-gray-300 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                            data-oid="4h8bi_."
                                        />

                                        <span className="text-sm text-gray-700" data-oid="j8axn32">
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {processedMedicines.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4" data-oid="o7j9jv.">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="fh10e-r"
                                >
                                    <span
                                        className="font-semibold text-gray-900"
                                        data-oid="8cad_gt"
                                    >
                                        Total Amount:
                                    </span>
                                    <span
                                        className="font-bold text-lg text-[#1F1F6F]"
                                        data-oid="5j2lkob"
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
            <div data-oid="uht5tsm">
                <label className="block text-sm font-medium text-gray-700 mb-2" data-oid="f7x1:ix">
                    Processing Notes
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about the prescription processing..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                    rows={3}
                    data-oid="fsw31mb"
                />
            </div>

            {/* Action Buttons */}
            <div
                className="flex items-center justify-between pt-4 border-t border-gray-200"
                data-oid="l-37jk:"
            >
                <button
                    onClick={() => setShowRejectionModal(true)}
                    disabled={isProcessing}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-oid="ciyk:yo"
                >
                    Reject Prescription
                </button>

                <div className="flex items-center space-x-3" data-oid="kcu:jkr">
                    <button
                        onClick={() => handleStatusUpdate('reviewing')}
                        disabled={isProcessing}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="hr3ig80"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('approved')}
                        disabled={isProcessing || !canApprove()}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                            !canApprove()
                                ? 'Complete all quality checks and add medicines with instructions'
                                : ''
                        }
                        data-oid="m-ir4_r"
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
                    data-oid="sphqm6e"
                />
            )}

            {/* Image Viewer Modal */}
            {showImageViewer && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    data-oid="l.pb34m"
                >
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4"
                        data-oid="ye3uzwv"
                    >
                        <button
                            onClick={() => setShowImageViewer(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
                            data-oid="nxz.:f_"
                        >
                            ✕
                        </button>

                        <div
                            className="bg-white rounded-lg p-4 max-w-4xl max-h-full overflow-auto"
                            data-oid="1fxvo5w"
                        >
                            <div
                                className="flex items-center justify-between mb-4"
                                data-oid="b60dm:b"
                            >
                                <h3 className="text-lg font-semibold" data-oid=".iu8r96">
                                    {prescription.files[selectedImageIndex]?.name}
                                </h3>
                                <div className="flex items-center space-x-2" data-oid="xte961v">
                                    <button
                                        onClick={() =>
                                            setSelectedImageIndex((prev) =>
                                                prev > 0 ? prev - 1 : prescription.files.length - 1,
                                            )
                                        }
                                        disabled={prescription.files.length <= 1}
                                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                                        data-oid="9ja4k:-"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600" data-oid="i9l930l">
                                        {selectedImageIndex + 1} of {prescription.files.length}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setSelectedImageIndex((prev) =>
                                                prev < prescription.files.length - 1 ? prev + 1 : 0,
                                            )
                                        }
                                        disabled={prescription.files.length <= 1}
                                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                                        data-oid="cdart17"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            <div
                                className="flex items-center justify-center bg-gray-100 rounded-lg p-8"
                                data-oid="h5e8vof"
                            >
                                <div className="text-center" data-oid="i16.8nn">
                                    <div
                                        className="w-32 h-32 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                                        data-oid="lc15p0k"
                                    >
                                        <span className="text-4xl text-blue-600" data-oid="hrjw5h4">
                                            {prescription.files[selectedImageIndex]?.type === 'pdf'
                                                ? '📄'
                                                : '🖼️'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600" data-oid="0ymi5:y">
                                        {prescription.files[selectedImageIndex]?.type === 'pdf'
                                            ? 'PDF Document'
                                            : 'Prescription Image'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2" data-oid="p7hsuu:">
                                        Image viewer would display the actual prescription file here
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="agh_adb"
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-md" data-oid="lxi1k_.">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="7gchyic">
                            Reject Prescription
                        </h3>

                        <div className="mb-4" data-oid="8dek-w8">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="t6gbe97"
                            >
                                Rejection Reason *
                            </label>
                            <select
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="me6vjnt"
                            >
                                <option value="" data-oid="k7.nqo5">
                                    Select reason
                                </option>
                                <option value="Unclear prescription" data-oid="v1lajsw">
                                    Unclear prescription
                                </option>
                                <option value="Missing information" data-oid="h:-iqjv">
                                    Missing information
                                </option>
                                <option value="Invalid prescription" data-oid="q0:op.r">
                                    Invalid prescription
                                </option>
                                <option value="Expired prescription" data-oid="3.0u6:i">
                                    Expired prescription
                                </option>
                                <option value="Controlled substance issue" data-oid="_q.x0ny">
                                    Controlled substance issue
                                </option>
                                <option value="Drug interaction concern" data-oid="01ayqe3">
                                    Drug interaction concern
                                </option>
                                <option value="Dosage concern" data-oid="hvlse4h">
                                    Dosage concern
                                </option>
                                <option value="Other" data-oid="2_l40nq">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="mb-6" data-oid="v8fciuu">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="tmzv6il"
                            >
                                Additional Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Provide additional details about the rejection..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                rows={3}
                                data-oid="7j8x5dx"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3" data-oid=".lx4neu">
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                data-oid="lz75dmj"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('rejected')}
                                disabled={!rejectionReason || isProcessing}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="-xnon97"
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
