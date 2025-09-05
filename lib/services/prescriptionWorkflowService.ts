import {
    PrescriptionWorkflow,
    PrescriptionStatus,
    PrescriptionUrgency,
    PrescriptionWorkflowManager,
    ProcessedMedicine,
    APIResponse,
    PaginatedResponse,
} from '@/lib/data/prescriptionWorkflow';

export class PrescriptionWorkflowService {
    private baseURL: string;
    private authToken: string | null = null;

    constructor(baseURL: string = `${process.env.NEXT_PUBLIC_API_URL}/prescriptions`) {
        this.baseURL = baseURL;
    }

    setAuthToken(token: string) {
        this.authToken = token;
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        
        if (this.authToken) {
            headers['authorization'] = `Bearer ${this.authToken}`;
        }
        
        return headers;
    }

    private getFileUploadHeaders(): HeadersInit {
        const headers: HeadersInit = {};
        
        if (this.authToken) {
            headers['authorization'] = `Bearer ${this.authToken}`;
        }
        
        return headers;
    }

    // Get prescriptions based on user role and filters
    public async getPrescriptions(
        userRole: string,
        userId: string,
        filters?: {
            status?: PrescriptionStatus;
            urgency?: PrescriptionUrgency;
            dateFrom?: string;
            dateTo?: string;
        },
    ): Promise<PrescriptionWorkflow[]> {
        try {
            const searchParams = new URLSearchParams();
            
            if (filters?.status) searchParams.append('status', filters.status);
            if (filters?.urgency) searchParams.append('urgency', filters.urgency);
            if (userRole === 'customer') searchParams.append('customerId', userId);
            if (userRole === 'prescription-reader') searchParams.append('assignedReaderId', userId);

            const url = `${this.baseURL}?${searchParams.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(response, 'prescriptions');

            const result: PaginatedResponse<PrescriptionWorkflow> = await response.json();
            
            let prescriptions = result.data || [];

            // Apply additional filters
            if (filters?.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                prescriptions = prescriptions.filter((p) => new Date(p.createdAt) >= fromDate);
            }

            if (filters?.dateTo) {
                const toDate = new Date(filters.dateTo);
                prescriptions = prescriptions.filter((p) => new Date(p.createdAt) <= toDate);
            }

            // Sort by creation date (newest first)
            prescriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return prescriptions;
        } catch (error) {
            console.error('API call failed, falling back to mock data:', error);
            
            // Fallback to mock data logic
            let prescriptions = mockPrescriptionWorkflows;
            
            if (userRole === 'customer') {
                prescriptions = prescriptions.filter(p => p.customerId === userId);
            }
            if (userRole === 'prescription-reader') {
                prescriptions = prescriptions.filter(p => p.assignedReaderId === userId);
            }
            if (filters?.status) {
                prescriptions = prescriptions.filter(p => p.currentStatus === filters.status);
            }
            if (filters?.urgency) {
                prescriptions = prescriptions.filter(p => p.urgency === filters.urgency);
            }
            if (filters?.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                prescriptions = prescriptions.filter(p => new Date(p.createdAt) >= fromDate);
            }
            if (filters?.dateTo) {
                const toDate = new Date(filters.dateTo);
                prescriptions = prescriptions.filter(p => new Date(p.createdAt) <= toDate);
            }

            prescriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return prescriptions;
        }
    }

    // Get a specific prescription by ID
    public async getPrescriptionById(prescriptionId: string): Promise<PrescriptionWorkflow | null> {
        try {
            const response = await fetch(`${this.baseURL}/${prescriptionId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow> = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('API call failed, falling back to mock data:', error);
            
            // Fallback to mock data
            const prescription = mockPrescriptionWorkflows.find((p) => p.id === prescriptionId);
            return prescription || null;
        }
    }

    // Get mock prescriptions for non-authenticated users
    public async getMockPrescriptions(): Promise<PrescriptionWorkflow[]> {
        // Return a subset of mock data for demo purposes
        return mockPrescriptionWorkflows.slice(0, 2);
    }

    // Update prescription status
    public async updatePrescriptionStatus(
        prescriptionId: string,
        newStatus: PrescriptionStatus,
        userId: string,
        userRole: string,
        userName: string,
        notes?: string,
        additionalData?: any,
    ): Promise<PrescriptionWorkflow> {
        try {
            const response = await fetch(`${this.baseURL}/${prescriptionId}/status`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ newStatus, notes }),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow> = await response.json();
            if (!result.data) {
                throw new Error('No data returned from API');
            }
            
            return result.data;
        } catch (error) {
            console.error('API call failed, falling back to mock data:', error);
            
            // Fallback to mock data logic
            const prescriptionIndex = mockPrescriptionWorkflows.findIndex(
                (p) => p.id === prescriptionId,
            );

            if (prescriptionIndex === -1) {
                throw new Error('Prescription not found');
            }

            const prescription = mockPrescriptionWorkflows[prescriptionIndex];

            // Validate transition
            if (
                !PrescriptionWorkflowManager.canTransitionTo(
                    prescription.currentStatus,
                    newStatus,
                    userRole,
                )
            ) {
                console.error('Invalid transition:', {
                    from: prescription.currentStatus,
                    to: newStatus,
                    userRole: userRole,
                    prescriptionId: prescriptionId,
                });
                throw new Error(
                    `Invalid status transition from ${prescription.currentStatus} to ${newStatus} for role ${userRole}`,
                );
            }

            // Update prescription
            const updatedPrescription: PrescriptionWorkflow = {
                ...prescription,
                currentStatus: newStatus,
                updatedAt: new Date(),
                estimatedCompletion: PrescriptionWorkflowManager.calculateEstimatedCompletion(
                    newStatus,
                    prescription.urgency,
                ),
                statusHistory: [
                    ...prescription.statusHistory,
                    PrescriptionWorkflowManager.createStatusHistoryEntry(
                        newStatus,
                        userId,
                        userRole,
                        userName,
                        notes,
                    ),
                ],
                // Add suspension data if status is suspended
                ...(newStatus === 'suspended' && additionalData
                    ? { suspensionData: additionalData }
                    : {}),
            };

            // Update the mock data
            mockPrescriptionWorkflows[prescriptionIndex] = updatedPrescription;

            return updatedPrescription;
        }
    }

    // Create a new prescription
    public async createPrescription(
        prescriptionData: Partial<PrescriptionWorkflow>,
        files?: File[]
    ): Promise<PrescriptionWorkflow> {
        try {
            const formData = new FormData();
            
            // Append text data
            Object.entries(prescriptionData).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (typeof value === 'object' && value !== null) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
            
            // Append files
            if (files) {
                files.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: this.getFileUploadHeaders(),
                body: formData,
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow> = await response.json();
            if (!result.data) {
                throw new Error('No data returned from API');
            }
            
            return result.data;
        } catch (error) {
            console.error('API call failed, falling back to mock data:', error);
            
            // Fallback to mock data logic
            const newPrescription: PrescriptionWorkflow = {
                id: `RX-${Date.now()}`,
                customerId: prescriptionData.customerId || 'customer-1',
                customerName: prescriptionData.customerName || 'New Customer',
                customerPhone: prescriptionData.customerPhone || '+20 123 456 7890',
                files: prescriptionData.files || [],
                patientName: prescriptionData.patientName || 'Patient Name',
                doctorName: prescriptionData.doctorName,
                hospitalClinic: prescriptionData.hospitalClinic,
                prescriptionDate: prescriptionData.prescriptionDate,
                urgency: prescriptionData.urgency || 'normal',
                notes: prescriptionData.notes,
                currentStatus: 'submitted',
                estimatedCompletion: PrescriptionWorkflowManager.calculateEstimatedCompletion(
                    'submitted',
                    prescriptionData.urgency || 'normal',
                ),
                statusHistory: [
                    PrescriptionWorkflowManager.createStatusHistoryEntry(
                        'submitted',
                        prescriptionData.customerId || 'customer-1',
                        'customer',
                        prescriptionData.customerName || 'New Customer',
                        'Prescription uploaded',
                    ),
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Add to mock data
            mockPrescriptionWorkflows.push(newPrescription);

            return newPrescription;
        }
    }

    // Assign prescription to pharmacy/reader
    public async assignPrescription(
        prescriptionId: string,
        assignmentData: {
            assignedPharmacyId?: string;
            assignedReaderId?: string;
            assignedPharmacistId?: string;
        }
    ): Promise<PrescriptionWorkflow> {
        try {
            const response = await fetch(`${this.baseURL}/${prescriptionId}/assign`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(assignmentData),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow> = await response.json();
            if (!result.data) {
                throw new Error('No data returned from API');
            }
            
            return result.data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Add processed medicines
    public async addProcessedMedicines(
        prescriptionId: string,
        processedMedicines: ProcessedMedicine[]
    ): Promise<PrescriptionWorkflow> {
        try {
            const response = await fetch(`${this.baseURL}/${prescriptionId}/medicines`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ processedMedicines }),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow> = await response.json();
            if (!result.data) {
                throw new Error('No data returned from API');
            }
            
            return result.data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Update prescription files
    public async updatePrescriptionFiles(
        prescriptionId: string,
        files: File[],
        replaceAll: boolean = false
    ): Promise<PrescriptionWorkflow> {
        try {
            const formData = new FormData();
            
            files.forEach(file => {
                formData.append('files', file);
            });
            
            formData.append('replaceAll', replaceAll.toString());

            const response = await fetch(`${this.baseURL}/${prescriptionId}/files`, {
                method: 'PUT',
                headers: this.getFileUploadHeaders(),
                body: formData,
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow> = await response.json();
            if (!result.data) {
                throw new Error('No data returned from API');
            }
            
            return result.data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Delete specific file from prescription
    public async deletePrescriptionFile(
        prescriptionId: string,
        fileKey: string
    ): Promise<PrescriptionWorkflow> {
        try {
            const response = await fetch(`${this.baseURL}/${prescriptionId}/files/${encodeURIComponent(fileKey)}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow> = await response.json();
            if (!result.data) {
                throw new Error('No data returned from API');
            }
            
            return result.data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Search prescriptions
    public async searchPrescriptions(query: string): Promise<PrescriptionWorkflow[]> {
        try {
            const response = await fetch(`${this.baseURL}/search`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ query }),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: APIResponse<PrescriptionWorkflow[]> = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('API call failed:', error);
            return [];
        }
    }

    // Delete prescription
    public async deletePrescription(prescriptionId: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseURL}/${prescriptionId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Get prescription statistics
    public async getPrescriptionStats(
        userRole: string,
        userId: string,
    ): Promise<{
        total: number;
        submitted: number;
        reviewing: number;
        approved: number;
        rejected: number;
        suspended: number;
    }> {
        const prescriptions = await this.getPrescriptions(userRole, userId);

        return {
            total: prescriptions.length,
            submitted: prescriptions.filter((p) => p.currentStatus === 'submitted').length,
            reviewing: prescriptions.filter((p) => p.currentStatus === 'reviewing').length,
            approved: prescriptions.filter((p) => p.currentStatus === 'approved').length,
            rejected: prescriptions.filter((p) => p.currentStatus === 'rejected').length,
            suspended: prescriptions.filter((p) => p.currentStatus === 'suspended').length,
        };
    }

    // Get urgent prescriptions
    public async getUrgentPrescriptions(
        userRole: string,
        userId: string,
    ): Promise<PrescriptionWorkflow[]> {
        const prescriptions = await this.getPrescriptions(userRole, userId, { urgency: 'urgent' });
        return prescriptions.filter(
            (p) => !['approved', 'rejected', 'cancelled', 'suspended'].includes(p.currentStatus),
        );
    }

    // Simulate real-time notifications
    public async getNotifications(userRole: string, userId: string): Promise<string[]> {
        // In production, this would connect to WebSocket or Server-Sent Events
        const prescriptions = await this.getPrescriptions(userRole, userId);
        const notifications: string[] = [];

        // Check for status updates in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        prescriptions.forEach((prescription) => {
            const recentUpdate = prescription.statusHistory.find(
                (entry) => new Date(entry.timestamp) > fiveMinutesAgo,
            );

            if (recentUpdate) {
                switch (recentUpdate.status) {
                    case 'approved':
                        notifications.push(
                            'Your prescription has been approved - you can now select medicines',
                        );
                        break;
                    case 'reviewing':
                        notifications.push('Your prescription is now under review');
                        break;
                    case 'rejected':
                        notifications.push('Your prescription was rejected - please check details');
                        break;
                    case 'suspended':
                        notifications.push(
                            'Your prescription has been suspended - App Services will contact you',
                        );
                        break;
                    default:
                        notifications.push('Prescription status updated');
                }
            }
        });

        return notifications;
    }
}

export const prescriptionAPIService = new PrescriptionWorkflowService();

import { getAuthToken } from '../utils/cookies';

const authToken = getAuthToken();

// Check if the token is not null before setting it
if (authToken) {
    prescriptionAPIService.setAuthToken(authToken);
} else {
    // Handle the case where the token doesn't exist
    console.log("No auth token found in cookies.");
}
