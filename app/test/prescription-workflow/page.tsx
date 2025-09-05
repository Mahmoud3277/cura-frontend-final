'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
    PrescriptionWorkflow,
    PrescriptionStatus,
    PrescriptionUrgency,
    PrescriptionWorkflowManager,
} from '@/lib/data/prescriptionWorkflow';

// Mock prescription data for testing
const mockPrescription: PrescriptionWorkflow = {
    id: 'RX-TEST-001',
    customerId: 'customer-1',
    customerName: 'Ahmed Hassan',
    customerPhone: '+20 123 456 7890',
    files: [
        {
            id: 'file-1',
            name: 'prescription-test.jpg',
            url: '/images/prescription-test.jpg',
            type: 'image',
        },
    ],

    patientName: 'Ahmed Hassan',
    doctorName: 'Dr. Mohamed Ali',
    hospitalClinic: 'Cairo Medical Center',
    prescriptionDate: '2024-01-15',
    urgency: 'normal',
    notes: 'Test prescription for workflow demonstration',
    currentStatus: 'submitted',
    estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    statusHistory: [
        {
            status: 'submitted',
            timestamp: new Date(),
            userId: 'customer-1',
            userRole: 'customer',
            userName: 'Ahmed Hassan',
            notes: 'Test prescription submitted',
        },
    ],

    createdAt: new Date(),
    updatedAt: new Date(),
};

export default function PrescriptionWorkflowTestPage() {
    const [prescription, setPrescription] = useState<PrescriptionWorkflow>(mockPrescription);
    const [selectedRole, setSelectedRole] = useState<string>('customer');
    const [testResults, setTestResults] = useState<string[]>([]);

    const addTestResult = (result: string) => {
        setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
    };

    const testStatusTransition = (newStatus: PrescriptionStatus) => {
        const canTransition = PrescriptionWorkflowManager.canTransitionTo(
            prescription.currentStatus,
            newStatus,
            selectedRole,
        );

        if (canTransition) {
            const newEstimatedCompletion = PrescriptionWorkflowManager.calculateEstimatedCompletion(
                newStatus,
                prescription.urgency,
            );

            const newHistoryEntry = PrescriptionWorkflowManager.createStatusHistoryEntry(
                newStatus,
                'test-user',
                selectedRole,
                `Test ${selectedRole}`,
                `Transitioned to ${newStatus} for testing`,
            );

            const updatedPrescription: PrescriptionWorkflow = {
                ...prescription,
                currentStatus: newStatus,
                estimatedCompletion: newEstimatedCompletion,
                statusHistory: [...prescription.statusHistory, newHistoryEntry],
                updatedAt: new Date(),
            };

            setPrescription(updatedPrescription);
            addTestResult(
                `✅ Successfully transitioned from ${prescription.currentStatus} to ${newStatus} as ${selectedRole}`,
            );
        } else {
            addTestResult(
                `❌ Cannot transition from ${prescription.currentStatus} to ${newStatus} as ${selectedRole}`,
            );
        }
    };

    const resetPrescription = () => {
        setPrescription(mockPrescription);
        setTestResults([]);
        addTestResult('🔄 Prescription reset to initial state');
    };

    const testWorkflowProgress = () => {
        const progress = PrescriptionWorkflowManager.getWorkflowProgress(
            prescription.currentStatus,
        );
        addTestResult(`📊 Current workflow progress: ${progress}%`);
    };

    const testAvailableActions = () => {
        const availableActions = PrescriptionWorkflowManager.getNextPossibleSteps(
            prescription.currentStatus,
            selectedRole,
        );
        addTestResult(
            `🎯 Available actions for ${selectedRole}: ${availableActions.join(', ') || 'None'}`,
        );
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

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50"
            data-oid="xt7s6v3"
        >
            <Header data-oid="5_0bwi5" />

            <main className="py-12" data-oid="m3qu-e5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="yrwyt6t">
                    {/* Header */}
                    <div className="text-center mb-8" data-oid="m7x405k">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-oid="tcw1gtp">
                            T5.3 - Prescription Workflow Test
                        </h1>
                        <p className="text-gray-600" data-oid="ucs1k50">
                            Test the prescription processing workflow system
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="xj78ldp">
                        {/* Left Column - Prescription Details */}
                        <div className="space-y-6" data-oid="ss-bb.r">
                            {/* Prescription Card */}
                            <div
                                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                                data-oid="bhec42h"
                            >
                                <h2
                                    className="text-xl font-semibold text-gray-900 mb-4"
                                    data-oid="cd4:t32"
                                >
                                    Current Prescription
                                </h2>

                                <div className="space-y-4" data-oid="qtk6_tr">
                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="ar-q5a1"
                                    >
                                        <span
                                            className="font-medium text-gray-700"
                                            data-oid="6ci0w1s"
                                        >
                                            ID:
                                        </span>
                                        <span className="text-gray-900" data-oid="-82e8zn">
                                            {prescription.id}
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="yc:2m.v"
                                    >
                                        <span
                                            className="font-medium text-gray-700"
                                            data-oid="jz5rvnw"
                                        >
                                            Patient:
                                        </span>
                                        <span className="text-gray-900" data-oid="lwfzd1o">
                                            {prescription.patientName}
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="qi8bd:v"
                                    >
                                        <span
                                            className="font-medium text-gray-700"
                                            data-oid="3ujjtel"
                                        >
                                            Status:
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${PrescriptionWorkflowManager.getStatusColor(prescription.currentStatus)}`}
                                            data-oid="xoh06zy"
                                        >
                                            {PrescriptionWorkflowManager.getStatusIcon(
                                                prescription.currentStatus,
                                            )}{' '}
                                            {prescription.currentStatus}
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="1y.t7j-"
                                    >
                                        <span
                                            className="font-medium text-gray-700"
                                            data-oid="etyavnv"
                                        >
                                            Urgency:
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                prescription.urgency === 'urgent'
                                                    ? 'bg-red-100 text-red-800'
                                                    : prescription.urgency === 'normal'
                                                      ? 'bg-blue-100 text-blue-800'
                                                      : 'bg-gray-100 text-gray-800'
                                            }`}
                                            data-oid="x8x-50t"
                                        >
                                            {prescription.urgency}
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="153icf6"
                                    >
                                        <span
                                            className="font-medium text-gray-700"
                                            data-oid="-g699fb"
                                        >
                                            Progress:
                                        </span>
                                        <span className="text-gray-900" data-oid="rmuda:k">
                                            {PrescriptionWorkflowManager.getWorkflowProgress(
                                                prescription.currentStatus,
                                            )}
                                            %
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center justify-between"
                                        data-oid="exnjp53"
                                    >
                                        <span
                                            className="font-medium text-gray-700"
                                            data-oid="2yg:qpz"
                                        >
                                            Est. Completion:
                                        </span>
                                        <span className="text-gray-900 text-sm" data-oid="iwm_p.d">
                                            {formatDate(prescription.estimatedCompletion)}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6" data-oid="v15akr8">
                                    <div
                                        className="flex items-center justify-between text-sm text-gray-600 mb-2"
                                        data-oid="raxz-:f"
                                    >
                                        <span data-oid="nxy4mwt">Workflow Progress</span>
                                        <span data-oid=":uza_2u">
                                            {PrescriptionWorkflowManager.getWorkflowProgress(
                                                prescription.currentStatus,
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div
                                        className="w-full bg-gray-200 rounded-full h-3"
                                        data-oid="8.vl3cv"
                                    >
                                        <div
                                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-3 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${PrescriptionWorkflowManager.getWorkflowProgress(prescription.currentStatus)}%`,
                                            }}
                                            data-oid="gvv_r.r"
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Status History */}
                            <div
                                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                                data-oid="3k2y18c"
                            >
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="x25chz:"
                                >
                                    Status History
                                </h3>
                                <div className="space-y-3" data-oid="vn8nb3f">
                                    {prescription.statusHistory.map((entry, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3"
                                            data-oid="6oual3."
                                        >
                                            <div
                                                className="w-8 h-8 bg-[#1F1F6F] rounded-full flex items-center justify-center text-white text-sm font-medium"
                                                data-oid="l18:rd9"
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1" data-oid=":emwmyj">
                                                <div
                                                    className="flex items-center justify-between"
                                                    data-oid="bho.08w"
                                                >
                                                    <p
                                                        className="font-medium text-gray-900"
                                                        data-oid="iq_rv_y"
                                                    >
                                                        {entry.status.replace('-', ' ')}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="2s4eq93"
                                                    >
                                                        {formatDate(entry.timestamp)}
                                                    </p>
                                                </div>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="_u_3o-w"
                                                >
                                                    By: {entry.userName} ({entry.userRole})
                                                </p>
                                                {entry.notes && (
                                                    <p
                                                        className="text-sm text-gray-600 mt-1"
                                                        data-oid="7_c1b1a"
                                                    >
                                                        {entry.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Test Controls */}
                        <div className="space-y-6" data-oid="3f:5xyz">
                            {/* Role Selection */}
                            <div
                                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                                data-oid="k.09sg7"
                            >
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="h:vz-z4"
                                >
                                    Test as Role
                                </h3>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="u3_z-0i"
                                >
                                    <option value="customer" data-oid="._xu6:j">
                                        Customer
                                    </option>
                                    <option value="prescription-reader" data-oid="9m0ikn.">
                                        Prescription Reader
                                    </option>
                                    <option value="pharmacy" data-oid="qi.h5vo">
                                        Pharmacy
                                    </option>
                                    <option value="admin" data-oid="i4xgl1g">
                                        Admin
                                    </option>
                                </select>
                            </div>

                            {/* Test Actions */}
                            <div
                                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                                data-oid="o5teifp"
                            >
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid=":fztak8"
                                >
                                    Test Actions
                                </h3>
                                <div className="space-y-3" data-oid="dh78e4h">
                                    <button
                                        onClick={testAvailableActions}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                        data-oid="_q9z.4p"
                                    >
                                        Check Available Actions
                                    </button>

                                    <button
                                        onClick={testWorkflowProgress}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                        data-oid="8-oys4q"
                                    >
                                        Check Progress
                                    </button>

                                    <button
                                        onClick={resetPrescription}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                        data-oid="seo62w4"
                                    >
                                        Reset Prescription
                                    </button>
                                </div>
                            </div>

                            {/* Status Transitions */}
                            <div
                                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                                data-oid="mer.q.c"
                            >
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid=":wgzwzi"
                                >
                                    Test Status Transitions
                                </h3>
                                <div className="grid grid-cols-2 gap-3" data-oid="h198bzp">
                                    {(
                                        [
                                            'submitted',
                                            'reviewing',
                                            'approved',
                                            'rejected',
                                            'preparing',
                                            'ready',
                                            'out-for-delivery',
                                            'delivered',
                                            'cancelled',
                                        ] as PrescriptionStatus[]
                                    ).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => testStatusTransition(status)}
                                            disabled={status === prescription.currentStatus}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                status === prescription.currentStatus
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-[#1F1F6F] hover:bg-[#14274E] text-white'
                                            }`}
                                            data-oid="ht6pt6c"
                                        >
                                            {status.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Test Results */}
                            <div
                                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
                                data-oid="0u7vfto"
                            >
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="gcnsuvj"
                                >
                                    Test Results
                                </h3>
                                <div
                                    className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto"
                                    data-oid="_ba8_hm"
                                >
                                    {testResults.length === 0 ? (
                                        <p className="text-gray-500 text-sm" data-oid="k9szdvw">
                                            No test results yet. Try some actions above!
                                        </p>
                                    ) : (
                                        <div className="space-y-2" data-oid=":3dnxa1">
                                            {testResults.map((result, index) => (
                                                <div
                                                    key={index}
                                                    className="text-sm font-mono text-gray-700"
                                                    data-oid="cuc7f18"
                                                >
                                                    {result}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {testResults.length > 0 && (
                                    <button
                                        onClick={() => setTestResults([])}
                                        className="mt-3 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                        data-oid="s_ooju6"
                                    >
                                        Clear Results
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer data-oid="3smn6v4" />
        </div>
    );
}
