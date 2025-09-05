'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import { PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PrescriptionImageViewer } from './PrescriptionImageViewer';

interface PrescriptionReaderWorkflowProps {
    onPrescriptionUpdate: () => void;
}

export function PrescriptionReaderWorkflow({
    onPrescriptionUpdate,
}: PrescriptionReaderWorkflowProps) {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<PrescriptionWorkflow[]>([]);
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWorkflow | null>(
        null,
    );

    const [processingNotes, setProcessingNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        loadPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadPrescriptions = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const data = await PrescriptionWorkflowService.getPrescriptions(
                'prescription-reader',
                user.id,
            );

            // Filter for prescriptions that need reader attention
            const readerPrescriptions = data.filter((p) =>
                ['submitted', 'reviewing'].includes(p.currentStatus),
            );

            // Sort by urgency and creation date
            readerPrescriptions.sort((a, b) => {
                if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
                if (b.urgency === 'urgent' && a.urgency !== 'urgent') return 1;
                return a.createdAt.getTime() - b.createdAt.getTime();
            });

            setPrescriptions(readerPrescriptions);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrescriptionSelect = (prescription: PrescriptionWorkflow) => {
        setSelectedPrescription(prescription);
        setProcessingNotes('');
    };

    const handleSubmitPrescription = async (status: 'approved' | 'rejected') => {
        if (!selectedPrescription || !user) return;

        try {
            setIsProcessing(true);

            await PrescriptionWorkflowService.updatePrescriptionStatus(
                selectedPrescription.id,
                status,
                user.id,
                user.role,
                user.name,
                processingNotes,
            );

            // Reset state
            setSelectedPrescription(null);
            setProcessingNotes('');

            // Reload prescriptions and notify parent
            await loadPrescriptions();
            onPrescriptionUpdate();
        } catch (error) {
            console.error('Error submitting prescription:', error);
            alert('Failed to submit prescription. Please try again.');
        } finally {
            setIsProcessing(false);
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

    const getUrgencyColor = (urgency: string) => {
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
            <div className="flex items-center justify-center p-8" data-oid="7ar.f4h">
                <div
                    className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                    data-oid="01j64_j"
                ></div>
                <span className="ml-3 text-gray-600" data-oid="u47b.:c">
                    Loading prescriptions...
                </span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-oid="1mix3s4">
            {/* Prescription Queue */}
            <div className="lg:col-span-1" data-oid="5n.yhfl">
                <Card data-oid="0iqhaum">
                    <CardHeader data-oid="fyr4-11">
                        <CardTitle className="flex items-center justify-between" data-oid="pb3ubgg">
                            Prescription Queue
                            <Badge variant="outline" data-oid="j.a4ppi">
                                {prescriptions.length}
                            </Badge>
                        </CardTitle>
                        <CardDescription data-oid="fqibzb:">
                            Select a prescription to start processing
                        </CardDescription>
                    </CardHeader>
                    <CardContent data-oid="-4j4itt">
                        {prescriptions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500" data-oid="p0v2-br">
                                <div
                                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    data-oid="1:_8.o4"
                                >
                                    <span className="text-xl" data-oid="bed5qpx">
                                        📋
                                    </span>
                                </div>
                                <p className="font-medium" data-oid="ex5e:gz">
                                    No Prescriptions
                                </p>
                                <p className="text-sm" data-oid="4p_sfgm">
                                    All prescriptions have been processed.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto" data-oid="1h_6.vc">
                                {prescriptions.map((prescription) => (
                                    <div
                                        key={prescription.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                            selectedPrescription?.id === prescription.id
                                                ? 'border-[#1F1F6F] bg-[#1F1F6F]/5'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                        onClick={() => handlePrescriptionSelect(prescription)}
                                        data-oid="c6idjuh"
                                    >
                                        <div
                                            className="flex items-start justify-between mb-2"
                                            data-oid="ws.ys8c"
                                        >
                                            <div data-oid="3hq1.2f">
                                                <h4
                                                    className="font-semibold text-gray-900"
                                                    data-oid="22l:kjj"
                                                >
                                                    {prescription.id}
                                                </h4>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="nto8xom"
                                                >
                                                    {prescription.patientName}
                                                </p>
                                            </div>
                                            <Badge
                                                className={getUrgencyColor(prescription.urgency)}
                                                variant="outline"
                                                data-oid="hpj.utg"
                                            >
                                                {prescription.urgency}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-gray-500" data-oid="qf0y:16">
                                            <p data-oid="rdz4drm">
                                                Customer: {prescription.customerName}
                                            </p>
                                            <p data-oid="_nrbacy">
                                                Submitted: {formatDate(prescription.createdAt)}
                                            </p>
                                            <p data-oid=":htuzv.">
                                                Files: {prescription.files.length}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Main Processing Area */}
            <div className="lg:col-span-2" data-oid="xdh_3kf">
                {selectedPrescription ? (
                    <div className="space-y-6" data-oid="7cbobty">
                        {/* Prescription Details */}
                        <Card data-oid="igdau8.">
                            <CardHeader data-oid="318d7wi">
                                <CardTitle
                                    className="flex items-center justify-between"
                                    data-oid="gm.2vnd"
                                >
                                    Processing: {selectedPrescription.id}
                                    <Badge
                                        className={getUrgencyColor(selectedPrescription.urgency)}
                                        variant="outline"
                                        data-oid="-9ax8e7"
                                    >
                                        {selectedPrescription.urgency}
                                    </Badge>
                                </CardTitle>
                                <CardDescription data-oid="r0ah0wf">
                                    Review prescription details and process medicines
                                </CardDescription>
                            </CardHeader>
                            <CardContent data-oid="bk.n6tu">
                                <div className="grid grid-cols-2 gap-4 text-sm" data-oid="yc7-sls">
                                    <div data-oid="3sta.v1">
                                        <Label
                                            className="font-medium text-gray-700"
                                            data-oid="g7ga5s2"
                                        >
                                            Patient
                                        </Label>
                                        <p className="text-gray-900" data-oid="liuclra">
                                            {selectedPrescription.patientName}
                                        </p>
                                    </div>
                                    <div data-oid="3m8m0ay">
                                        <Label
                                            className="font-medium text-gray-700"
                                            data-oid="7gy82y1"
                                        >
                                            Customer
                                        </Label>
                                        <p className="text-gray-900" data-oid="fjeo4:2">
                                            {selectedPrescription.customerName}
                                        </p>
                                    </div>
                                    <div data-oid="rt34eh8">
                                        <Label
                                            className="font-medium text-gray-700"
                                            data-oid="yq0k:sm"
                                        >
                                            Phone
                                        </Label>
                                        <p className="text-gray-900" data-oid="3iaghxq">
                                            {selectedPrescription.customerPhone}
                                        </p>
                                    </div>
                                    <div data-oid="ci3zc3o">
                                        <Label
                                            className="font-medium text-gray-700"
                                            data-oid="mct.u2u"
                                        >
                                            Submitted
                                        </Label>
                                        <p className="text-gray-900" data-oid="pn:30ef">
                                            {formatDate(selectedPrescription.createdAt)}
                                        </p>
                                    </div>
                                    {selectedPrescription.doctorName && (
                                        <div data-oid="jj-hg30">
                                            <Label
                                                className="font-medium text-gray-700"
                                                data-oid="hb9xiki"
                                            >
                                                Doctor
                                            </Label>
                                            <p className="text-gray-900" data-oid="vazqd1g">
                                                {selectedPrescription.doctorName}
                                            </p>
                                        </div>
                                    )}
                                    {selectedPrescription.hospitalClinic && (
                                        <div data-oid="iuyj70x">
                                            <Label
                                                className="font-medium text-gray-700"
                                                data-oid="2s9_qb8"
                                            >
                                                Hospital/Clinic
                                            </Label>
                                            <p className="text-gray-900" data-oid="0eyu:d5">
                                                {selectedPrescription.hospitalClinic}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {selectedPrescription.notes && (
                                    <div
                                        className="mt-4 p-3 bg-blue-50 rounded-lg"
                                        data-oid="1yuen7g"
                                    >
                                        <Label
                                            className="font-medium text-gray-700"
                                            data-oid="nutych-"
                                        >
                                            Customer Notes
                                        </Label>
                                        <p className="text-gray-900 mt-1" data-oid="n69n6ye">
                                            {selectedPrescription.notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Prescription Images */}
                        <Card data-oid="m:w9irm">
                            <CardHeader data-oid="pc0cvs7">
                                <CardTitle
                                    className="flex items-center justify-between"
                                    data-oid="1q6p4oc"
                                >
                                    Prescription Files
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowImageViewer(true)}
                                        data-oid=".4:n5rm"
                                    >
                                        View Full Screen
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent data-oid="zowxq43">
                                <div
                                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                    data-oid="bbx-377"
                                >
                                    {selectedPrescription.files.map((file, index) => (
                                        <div
                                            key={file.id}
                                            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                                            onClick={() => {
                                                setSelectedImageIndex(index);
                                                setShowImageViewer(true);
                                            }}
                                            data-oid="yu0o-ck"
                                        >
                                            <div
                                                className="flex items-center space-x-3"
                                                data-oid="qi5po_."
                                            >
                                                <div
                                                    className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                                                    data-oid="k5ps3ca"
                                                >
                                                    <span
                                                        className="text-blue-600"
                                                        data-oid="65obx1."
                                                    >
                                                        {file.type === 'pdf' ? '📄' : '🖼️'}
                                                    </span>
                                                </div>
                                                <div className="flex-1" data-oid="_yynlhx">
                                                    <p
                                                        className="font-medium text-gray-900 text-sm"
                                                        data-oid="c9igi4x"
                                                    >
                                                        {file.name}
                                                    </p>
                                                    <p
                                                        className="text-xs text-gray-600"
                                                        data-oid="4zclq:l"
                                                    >
                                                        {file.type.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card data-oid="on2g6oe">
                            <CardContent className="pt-6" data-oid="buwj6s1">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="cnvhw05"
                                >
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleSubmitPrescription('rejected')}
                                        disabled={isProcessing}
                                        data-oid="sd:wrz0"
                                    >
                                        Reject Prescription
                                    </Button>

                                    <div className="flex items-center space-x-3" data-oid="a8jvc39">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                // Save as draft functionality
                                                setProcessingNotes('Draft saved');
                                            }}
                                            disabled={isProcessing}
                                            data-oid="iyp10_y"
                                        >
                                            Save as Draft
                                        </Button>
                                        <Button
                                            onClick={() => handleSubmitPrescription('approved')}
                                            disabled={isProcessing}
                                            className="bg-green-600 hover:bg-green-700"
                                            data-oid="pfpmq0w"
                                        >
                                            {isProcessing
                                                ? 'Processing...'
                                                : 'Approve & Send to Customer'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card data-oid="7hnud10">
                        <CardContent className="pt-6" data-oid="1-e7vh:">
                            <div className="text-center py-12" data-oid="ndi.h7i">
                                <div
                                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    data-oid="f15eskk"
                                >
                                    <span className="text-2xl" data-oid="8vycbka">
                                        📋
                                    </span>
                                </div>
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="5fev7e4"
                                >
                                    No Prescription Selected
                                </h3>
                                <p className="text-gray-600" data-oid="wbpmsy2">
                                    Select a prescription from the queue to start processing
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Image Viewer Modal */}
            {showImageViewer && selectedPrescription && (
                <PrescriptionImageViewer
                    files={selectedPrescription.files}
                    selectedIndex={selectedImageIndex}
                    onClose={() => setShowImageViewer(false)}
                    onIndexChange={setSelectedImageIndex}
                    data-oid="meovg-v"
                />
            )}
        </div>
    );
}
