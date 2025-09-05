import { PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';
import { mockPrescriptionWorkflows } from '@/lib/data/prescriptionWorkflow';

export interface SuspendedPrescriptionSummary {
    id: string;
    customerName: string;
    patientName: string;
    suspensionCategory: string;
    suspensionReason: string;
    suspendedBy: string;
    suspendedAt: Date;
    urgency: string;
    filesCount: number;
    medicinesCount: number;
    estimatedResolutionTime: Date;
}

export class SuspendedPrescriptionService {
    // Get all suspended prescriptions for App Services dashboard
    static async getSuspendedPrescriptions(): Promise<SuspendedPrescriptionSummary[]> {
        // In production, this would be an API call to get suspended prescriptions
        const suspendedPrescriptions = mockPrescriptionWorkflows.filter(
            (p) => p.currentStatus === 'suspended',
        );

        return suspendedPrescriptions.map((prescription) => ({
            id: prescription.id,
            customerName: prescription.customerName,
            patientName: prescription.patientName,
            suspensionCategory: prescription.suspensionData?.category || 'Unknown',
            suspensionReason: prescription.suspensionData?.reason || 'No reason provided',
            suspendedBy: prescription.suspensionData?.suspendedBy || 'Unknown',
            suspendedAt: prescription.suspensionData?.suspendedAt || prescription.updatedAt,
            urgency: prescription.urgency,
            filesCount: prescription.files.length,
            medicinesCount: prescription.suspensionData?.processedMedicines?.length || 0,
            estimatedResolutionTime: this.calculateResolutionTime(
                prescription.suspensionData?.suspendedAt || prescription.updatedAt,
                prescription.suspensionData?.category || 'other',
            ),
        }));
    }

    // Get suspended prescription by ID with full details
    static async getSuspendedPrescriptionById(
        prescriptionId: string,
    ): Promise<PrescriptionWorkflow | null> {
        const prescription = mockPrescriptionWorkflows.find(
            (p) => p.id === prescriptionId && p.currentStatus === 'suspended',
        );
        return prescription || null;
    }

    // Resolve suspended prescription (move back to reviewing)
    static async resolveSuspendedPrescription(
        prescriptionId: string,
        resolutionNotes: string,
        resolvedBy: string,
        resolvedById: string,
    ): Promise<PrescriptionWorkflow> {
        const prescriptionIndex = mockPrescriptionWorkflows.findIndex(
            (p) => p.id === prescriptionId,
        );

        if (prescriptionIndex === -1) {
            throw new Error('Prescription not found');
        }

        const prescription = mockPrescriptionWorkflows[prescriptionIndex];

        if (prescription.currentStatus !== 'suspended') {
            throw new Error('Prescription is not suspended');
        }

        // Update prescription status back to reviewing
        const updatedPrescription: PrescriptionWorkflow = {
            ...prescription,
            currentStatus: 'reviewing',
            updatedAt: new Date(),
            statusHistory: [
                ...prescription.statusHistory,
                {
                    status: 'reviewing',
                    timestamp: new Date(),
                    userId: resolvedById,
                    userRole: 'app-services',
                    userName: resolvedBy,
                    notes: `Suspension resolved: ${resolutionNotes}`,
                },
            ],
        };

        // Update the mock data
        mockPrescriptionWorkflows[prescriptionIndex] = updatedPrescription;

        return updatedPrescription;
    }

    // Get suspension statistics
    static async getSuspensionStats(): Promise<{
        total: number;
        byCategory: Record<string, number>;
        byUrgency: Record<string, number>;
        avgResolutionTime: number; // in hours
        pendingCount: number;
    }> {
        const suspendedPrescriptions = mockPrescriptionWorkflows.filter(
            (p) => p.currentStatus === 'suspended',
        );

        const byCategory: Record<string, number> = {};
        const byUrgency: Record<string, number> = {};

        suspendedPrescriptions.forEach((prescription) => {
            const category = prescription.suspensionData?.category || 'other';
            const urgency = prescription.urgency;

            byCategory[category] = (byCategory[category] || 0) + 1;
            byUrgency[urgency] = (byUrgency[urgency] || 0) + 1;
        });

        return {
            total: suspendedPrescriptions.length,
            byCategory,
            byUrgency,
            avgResolutionTime: 4, // Mock average resolution time
            pendingCount: suspendedPrescriptions.length,
        };
    }

    // Calculate estimated resolution time based on suspension category
    private static calculateResolutionTime(suspendedAt: Date, category: string): Date {
        const resolutionHours: Record<string, number> = {
            'medicine-unavailable': 24,
            'dosage-unclear': 4,
            'prescription-illegible': 8,
            'drug-interaction': 6,
            'patient-allergy': 6,
            'insurance-issue': 48,
            'doctor-verification': 24,
            'technical-issue': 2,
            other: 12,
        };

        const hours = resolutionHours[category] || 12;
        const resolutionTime = new Date(suspendedAt);
        resolutionTime.setHours(resolutionTime.getHours() + hours);

        return resolutionTime;
    }

    // Add note to suspended prescription
    static async addNoteToSuspendedPrescription(
        prescriptionId: string,
        note: string,
        addedBy: string,
        addedById: string,
    ): Promise<PrescriptionWorkflow> {
        const prescriptionIndex = mockPrescriptionWorkflows.findIndex(
            (p) => p.id === prescriptionId,
        );

        if (prescriptionIndex === -1) {
            throw new Error('Prescription not found');
        }

        const prescription = mockPrescriptionWorkflows[prescriptionIndex];

        // Add note to status history
        const updatedPrescription: PrescriptionWorkflow = {
            ...prescription,
            updatedAt: new Date(),
            statusHistory: [
                ...prescription.statusHistory,
                {
                    status: prescription.currentStatus,
                    timestamp: new Date(),
                    userId: addedById,
                    userRole: 'app-services',
                    userName: addedBy,
                    notes: `App Services Note: ${note}`,
                },
            ],
        };

        // Update the mock data
        mockPrescriptionWorkflows[prescriptionIndex] = updatedPrescription;

        return updatedPrescription;
    }
}
