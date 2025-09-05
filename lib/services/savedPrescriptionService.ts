// Mock service for managing saved prescriptions
export interface SavedPrescription {
    id: string;
    patientName: string;
    doctorName: string;
    uploadDate: Date;
    medicines: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }[];
    status: 'active' | 'expired';
    originalOrderId?: string;
}

class SavedPrescriptionService {
    private prescriptions: SavedPrescription[] = [
        {
            id: 'RX-001',
            patientName: 'John Customer',
            doctorName: 'Dr. Ahmed Hassan',
            uploadDate: new Date('2024-01-15'),
            medicines: [
                {
                    name: 'Paracetamol 500mg',
                    dosage: '500mg',
                    frequency: 'Every 6 hours',
                    duration: '7 days',
                },
                {
                    name: 'Vitamin D3 1000IU',
                    dosage: '1000IU',
                    frequency: 'Once daily',
                    duration: '30 days',
                },
            ],
            status: 'active',
            originalOrderId: 'CTH-89765',
        },
        {
            id: 'RX-002',
            patientName: 'John Customer',
            doctorName: 'Dr. Sarah Mohamed',
            uploadDate: new Date('2024-01-05'),
            medicines: [
                {
                    name: 'Amoxicillin 250mg',
                    dosage: '250mg',
                    frequency: 'Every 8 hours',
                    duration: '10 days',
                },
            ],
            status: 'active',
            originalOrderId: 'CTH-23451',
        },
    ];

    async getPrescriptionById(id: string): Promise<SavedPrescription | null> {
        return this.prescriptions.find((p) => p.id === id) || null;
    }

    async getCustomerPrescriptions(customerId: string): Promise<SavedPrescription[]> {
        // In a real app, filter by customerId
        return this.prescriptions.filter((p) => p.status === 'active');
    }

    async savePrescription(prescription: Omit<SavedPrescription, 'id'>): Promise<string> {
        const id = `RX-${Date.now()}`;
        const newPrescription: SavedPrescription = {
            ...prescription,
            id,
        };
        this.prescriptions.push(newPrescription);
        return id;
    }
}

export const savedPrescriptionService = new SavedPrescriptionService(); // Mock service for managing saved prescriptions
export interface SavedPrescription {
    id: string;
    patientName: string;
    doctorName: string;
    uploadDate: Date;
    medicines: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }[];
    status: 'active' | 'expired';
    originalOrderId?: string;
}

class SavedPrescriptionService {
    private prescriptions: SavedPrescription[] = [
        {
            id: 'RX-001',
            patientName: 'John Customer',
            doctorName: 'Dr. Ahmed Hassan',
            uploadDate: new Date('2024-01-15'),
            medicines: [
                {
                    name: 'Paracetamol 500mg',
                    dosage: '500mg',
                    frequency: 'Every 6 hours',
                    duration: '7 days',
                },
                {
                    name: 'Vitamin D3 1000IU',
                    dosage: '1000IU',
                    frequency: 'Once daily',
                    duration: '30 days',
                },
            ],
            status: 'active',
            originalOrderId: 'CTH-89765',
        },
        {
            id: 'RX-002',
            patientName: 'John Customer',
            doctorName: 'Dr. Sarah Mohamed',
            uploadDate: new Date('2024-01-05'),
            medicines: [
                {
                    name: 'Amoxicillin 250mg',
                    dosage: '250mg',
                    frequency: 'Every 8 hours',
                    duration: '10 days',
                },
            ],
            status: 'active',
            originalOrderId: 'CTH-23451',
        },
    ];

    async getPrescriptionById(id: string): Promise<SavedPrescription | null> {
        return this.prescriptions.find((p) => p.id === id) || null;
    }

    async getCustomerPrescriptions(customerId: string): Promise<SavedPrescription[]> {
        // In a real app, filter by customerId
        return this.prescriptions.filter((p) => p.status === 'active');
    }

    async savePrescription(prescription: Omit<SavedPrescription, 'id'>): Promise<string> {
        const id = `RX-${Date.now()}`;
        const newPrescription: SavedPrescription = {
            ...prescription,
            id,
        };
        this.prescriptions.push(newPrescription);
        return id;
    }
}

export const savedPrescriptionService = new SavedPrescriptionService();
