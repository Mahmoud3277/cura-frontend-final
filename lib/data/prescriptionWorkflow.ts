// Prescription Workflow Management System - API Integration
export type PrescriptionStatus =
    | 'submitted'
    | 'reviewing'
    | 'approved'
    | 'rejected'
    | 'cancelled'
    | 'suspended';

export type PrescriptionUrgency = 'routine' | 'normal' | 'urgent';

export interface PrescriptionFile {
    url: string;
    key: string;
    originalName: string;
    type: 'image' | 'pdf';
    size: number;
}

export interface PrescriptionWorkflowStep {
    status: PrescriptionStatus;
    title: string;
    description: string;
    allowedRoles: string[];
    nextSteps: PrescriptionStatus[];
    estimatedDuration: number; // in hours
    requiresApproval: boolean;
    notificationTriggers: string[];
}

export interface ProcessedMedicine {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    dosage: string;
    frequency: string; // Added: How often to take (e.g., "3 times daily")
    duration: string;  // Added: How long to take (e.g., "7 days")
    instructions: string;
    price: number;
    pharmacyId: string;
    image?: string; // URL of the product image
    alternatives?: Array<{
        productId: string;
        productName: string;
        price: number;
        image?: string; // URL of the alternative product image
    }>;
    isAvailable: boolean;
}

export interface StatusHistoryEntry {
    status: PrescriptionStatus;
    timestamp: Date;
    userId: string;
    userRole: string;
    userName: string;
    notes?: string;
    estimatedCompletion?: Date;
}

export interface PrescriptionWorkflow {
    _id: string;
    prescriptionNumber?: string;
    customerId: string | { _id: string; name: string; phone: string; email: string };
    customerName: string;
    customerPhone: string;
    files: PrescriptionFile[];
    patientName: string;
    patientAge?: number;
    patientGender?: 'male' | 'female';
    doctorName?: string;
    doctorSpecialty?: string;
    hospitalClinic?: string;
    prescriptionDate?: string;
    urgency: PrescriptionUrgency;
    notes?: string;
    currentStatus: PrescriptionStatus;
    assignedPharmacyId?: string;
    assignedPharmacistId?: string;
    assignedReaderId?: string;
    processedMedicines?: ProcessedMedicine[];
    medications?: Array<{
        name: string;
        dosage: string;
        frequency: string;
        image?: string; // URL of the product image
    }>;
    rejectionReason?: string;
    suspensionData?: {
        category: string;
        reason: string;
        suspendedBy: string;
        suspendedById: string;
        suspendedAt: Date;
        processedMedicines?: any[];
        processingNotes?: string;
    };
    estimatedCompletion: Date;
    actualCompletion?: Date;
    deliveryAddress?: string;
    deliveryFee?: number;
    totalAmount?: number;
    statusHistory: StatusHistoryEntry[];
    createdAt: Date;
    updatedAt: Date;
}

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        current: number;
        total: number;
        count: number;
        totalRecords: number;
    };
}

export interface PrescriptionAnalytics {
    total: number;
    statusCounts: Record<PrescriptionStatus, number>;
    urgencyCounts: Record<PrescriptionUrgency, number>;
    averageProcessingTime: number;
    completionRate: number;
}

// Workflow Configuration
export const PRESCRIPTION_WORKFLOW_STEPS: Record<PrescriptionStatus, PrescriptionWorkflowStep> = {
    submitted: {
        status: 'submitted',
        title: 'Prescription Submitted',
        description: 'Prescription has been uploaded and is waiting for review',
        allowedRoles: ['customer'],
        nextSteps: ['reviewing', 'approved', 'cancelled', 'suspended'],
        estimatedDuration: 0,
        requiresApproval: false,
        notificationTriggers: ['pharmacy', 'prescription-reader', 'admin'],
    },
    reviewing: {
        status: 'reviewing',
        title: 'Under Review',
        description: 'Prescription is being reviewed by a licensed pharmacist',
        allowedRoles: ['prescription-reader', 'pharmacy', 'admin'],
        nextSteps: ['approved', 'rejected', 'suspended'],
        estimatedDuration: 2,
        requiresApproval: true,
        notificationTriggers: ['customer'],
    },
    approved: {
        status: 'approved',
        title: 'Prescription Approved',
        description: 'Prescription has been approved and ready for medicine selection',
        allowedRoles: ['prescription-reader', 'pharmacy', 'admin'],
        nextSteps: ['cancelled'],
        estimatedDuration: 0,
        requiresApproval: false,
        notificationTriggers: ['customer', 'pharmacy'],
    },
    rejected: {
        status: 'rejected',
        title: 'Prescription Rejected',
        description: 'Prescription has been rejected and requires customer action',
        allowedRoles: ['prescription-reader', 'pharmacy', 'admin'],
        nextSteps: ['submitted'],
        estimatedDuration: 0,
        requiresApproval: false,
        notificationTriggers: ['customer'],
    },
    cancelled: {
        status: 'cancelled',
        title: 'Cancelled',
        description: 'Prescription has been cancelled',
        allowedRoles: ['customer', 'pharmacy', 'admin'],
        nextSteps: [],
        estimatedDuration: 0,
        requiresApproval: false,
        notificationTriggers: ['customer', 'pharmacy', 'admin'],
    },
    suspended: {
        status: 'suspended',
        title: 'Suspended',
        description: 'Prescription has been suspended and requires App Services attention',
        allowedRoles: ['prescription-reader', 'pharmacy', 'admin'],
        nextSteps: ['reviewing', 'approved', 'rejected'],
        estimatedDuration: 4,
        requiresApproval: true,
        notificationTriggers: ['customer', 'app-services', 'admin'],
    },
};

// Urgency-based time adjustments
export const URGENCY_TIME_MULTIPLIERS: Record<PrescriptionUrgency, number> = {
    routine: 1.5,
    normal: 1.0,
    urgent: 0.5,
};

// Workflow Helper Functions
export class PrescriptionWorkflowManager {
    static calculateEstimatedCompletion(
        currentStatus: PrescriptionStatus,
        urgency: PrescriptionUrgency,
        startTime: Date = new Date(),
    ): Date {
        const step = PRESCRIPTION_WORKFLOW_STEPS[currentStatus];
        const baseHours = step.estimatedDuration;
        const multiplier = URGENCY_TIME_MULTIPLIERS[urgency];
        const adjustedHours = baseHours * multiplier;

        const completion = new Date(startTime);
        completion.setHours(completion.getHours() + adjustedHours);
        return completion;
    }

    static canTransitionTo(
        currentStatus: PrescriptionStatus,
        newStatus: PrescriptionStatus,
        userRole: string,
    ): boolean {
        const currentStep = PRESCRIPTION_WORKFLOW_STEPS[currentStatus];
        const newStep = PRESCRIPTION_WORKFLOW_STEPS[newStatus];

        if (!currentStep || !newStep) return false;

        return currentStep.nextSteps.includes(newStatus) && 
               newStep.allowedRoles.includes(userRole);
    }

    static getNextPossibleSteps(
        currentStatus: PrescriptionStatus,
        userRole: string,
    ): PrescriptionStatus[] {
        const currentStep = PRESCRIPTION_WORKFLOW_STEPS[currentStatus];
        return currentStep.nextSteps.filter((nextStatus) => {
            const nextStep = PRESCRIPTION_WORKFLOW_STEPS[nextStatus];
            return nextStep.allowedRoles.includes(userRole);
        });
    }

    static getWorkflowProgress(currentStatus: PrescriptionStatus): number {
        const statusOrder: PrescriptionStatus[] = ['submitted', 'reviewing', 'approved'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        if (currentIndex === -1) return 0;
        return Math.round((currentIndex / (statusOrder.length - 1)) * 100);
    }

    static getStatusColor(status: PrescriptionStatus): string {
        const colors: Record<PrescriptionStatus, string> = {
            submitted: 'bg-blue-100 text-blue-800',
            reviewing: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
            suspended: 'bg-orange-100 text-orange-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    static getStatusIcon(status: PrescriptionStatus): string {
        const icons: Record<PrescriptionStatus, string> = {
            submitted: '📝',
            reviewing: '👨‍⚕️',
            approved: '✅',
            rejected: '❌',
            cancelled: '🚫',
            suspended: '⚠️',
        };
        return icons[status] || '📋';
    }
}

// API Service Class
export class PrescriptionAPIService {
    private baseURL: string;
    private authToken: string | null = null;

    constructor(baseURL: string = `${process.env.NEXT_PUBLIC_API_URL}/prescriptions`) {
        this.baseURL = baseURL;
    }

    setAuthToken(token: string) {
        this.authToken = token;
    }

    // Method to ensure auth token is current
    ensureAuthToken(): void {
        if (typeof window !== 'undefined' && !this.authToken) {
            try {
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('authToken='));
                if (cookieValue) {
                    this.authToken = cookieValue.split('=')[1];
                }
            } catch (e) {
                console.warn('Failed to read auth token from cookies:', e);
            }
        }
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Always try to get the latest auth token
        let token = this.authToken;
        
        // If no token is set, try to get it from cookies/localStorage (browser environment)
        if (!token && typeof window !== 'undefined') {
            // Try to get from cookies using js-cookie approach
            try {
                // Direct cookie reading approach
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('authToken='));
                if (cookieValue) {
                    token = cookieValue.split('=')[1];
                }
            } catch (e) {
                console.warn('Failed to read auth token from cookies:', e);
            }
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private getFileUploadHeaders(): HeadersInit {
        const headers: HeadersInit = {};
        
        // Always try to get the latest auth token
        let token = this.authToken;
        
        // If no token is set, try to get it from cookies (browser environment)
        if (!token && typeof window !== 'undefined') {
            try {
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('authToken='));
                if (cookieValue) {
                    token = cookieValue.split('=')[1];
                }
            } catch (e) {
                console.warn('Failed to read auth token from cookies:', e);
            }
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // GET all prescriptions with pagination and filters
    async getAllPrescriptions(params?: {
        status?: PrescriptionStatus;
        urgency?: PrescriptionUrgency;
        customerId?: string;
        assignedReaderId?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<PrescriptionWorkflow>> {
        const searchParams = new URLSearchParams();
        
        if (params?.status) searchParams.append('status', params.status);
        if (params?.urgency) searchParams.append('urgency', params.urgency);
        if (params?.customerId) searchParams.append('customerId', params.customerId);
        if (params?.assignedReaderId) searchParams.append('assignedReaderId', params.assignedReaderId);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());

        const url = `${this.baseURL}?${searchParams.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        console.log(data)
        return data;
    }

    // GET prescription by ID
    async getPrescriptionById(id: string): Promise<APIResponse<PrescriptionWorkflow>> {
        // Ensure we have the latest auth token
        this.ensureAuthToken();
        
        const url = `${this.baseURL}/search/${id}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, body:`, errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // The backend returns { success: true, data: prescription }
        // So we return the full response, not just data.data
        return data;
    }

    // GET prescriptions by customer ID
    async getPrescriptionsByCustomerId(customerId: string): Promise<APIResponse<PrescriptionWorkflow[]>> {
        const response = await fetch(`${this.baseURL}/customer/${customerId}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // GET prescriptions by status
    async getPrescriptionsByStatus(status: PrescriptionStatus): Promise<APIResponse<PrescriptionWorkflow[]>> {
        const response = await fetch(`${this.baseURL}/status/${status}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // POST create new prescription with files
    async createPrescription(data: {
        patientName: string;
        patientAge?: number;
        patientGender?: 'male' | 'female';
        doctorName?: string;
        doctorSpecialty?: string;
        hospitalClinic?: string;
        prescriptionDate?: string;
        urgency: PrescriptionUrgency;
        notes?: string;
        deliveryAddress?: string;
        medications?: Array<{
            name: string;
            dosage: string;
            frequency: string;
        }>;
    }, files: File[]): Promise<APIResponse<PrescriptionWorkflow>> {
        const formData = new FormData();
        
        // Append text data
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });
        
        // Append files
        files.forEach((file, index) => {
            formData.append('files', file);
        });

        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: this.getFileUploadHeaders(),
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // PUT update prescription status
    // Updated API function to match your component's usage
// Updated API function to handle processed medicines
async updatePrescriptionStatus(
    id: string, 
    newStatus: PrescriptionStatus, 
    userId: string,
    userRole: string,
    userName: string,
    notes?: string,
    processedMedicines?: ProcessedMedicine[], // Add this parameter
    additionalData?: any
): Promise<APIResponse<PrescriptionWorkflow>> {
    try {
        
        const requestBody = {
            newStatus,
            userId,
            userRole,
            userName,
            notes,
            processedMedicines, // Include processed medicines in the request body
            ...additionalData // Spread any additional data like suspensionData
        };
        
        console.log('Updating prescription status:', {
            id,
            newStatus,
            userId,
            userRole,
            userName,
            notes,
            processedMedicines: processedMedicines?.length || 0
        });

        const response = await fetch(`${this.baseURL}/${id}/status`, {
            method: 'PUT',
            headers: {
                ...this.getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Better error handling
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP error! status: ${response.status}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Prescription status updated successfully:', result);
        return result;

    } catch (error) {
        console.error('Error updating prescription status:', error);
        throw error; // Re-throw to be handled by the calling code
    }
}

    // PUT assign prescription to pharmacy/reader
    async assignPrescription(
        id: string,
        assignmentData: {
            assignedPharmacyId?: string;
            assignedReaderId?: string;
            assignedPharmacistId?: string;
        }
    ): Promise<APIResponse<PrescriptionWorkflow>> {
        const response = await fetch(`${this.baseURL}/${id}/assign`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(assignmentData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // PUT add processed medicines
    async addProcessedMedicines(
        id: string,
        processedMedicines: ProcessedMedicine[]
    ): Promise<APIResponse<PrescriptionWorkflow>> {
        const response = await fetch(`${this.baseURL}/${id}/medicines`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ processedMedicines }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // PUT update prescription files
    async updatePrescriptionFiles(
        id: string,
        files: File[],
        replaceAll: boolean = false
    ): Promise<APIResponse<PrescriptionWorkflow>> {
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('files', file);
        });
        
        formData.append('replaceAll', replaceAll.toString());

        const response = await fetch(`${this.baseURL}/${id}/files`, {
            method: 'PUT',
            headers: this.getFileUploadHeaders(),
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // DELETE specific file from prescription
    async deletePrescriptionFile(
        id: string,
        fileKey: string
    ): Promise<APIResponse<PrescriptionWorkflow>> {
        const response = await fetch(`${this.baseURL}/${id}/files/${encodeURIComponent(fileKey)}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // POST search prescriptions
    async searchPrescriptions(query: string): Promise<APIResponse<PrescriptionWorkflow[]>> {
        const response = await fetch(`${this.baseURL}/search`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // GET prescription analytics
    async getPrescriptionAnalytics(): Promise<APIResponse<PrescriptionAnalytics>> {
        const response = await fetch(`${this.baseURL}/analytics/summary`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // DELETE prescription (admin only)
    async deletePrescription(id: string): Promise<APIResponse<any>> {
        const response = await fetch(`${this.baseURL}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}

// Export singleton instance
export const prescriptionAPIService = new PrescriptionAPIService();

import { getAuthToken } from '../utils/cookies';

const authToken = getAuthToken();

// Check if the token is not null before setting it
if (authToken) {
  prescriptionAPIService.setAuthToken(authToken);
} else {
  // Handle the case where the token doesn't exist
  console.log("No auth token found in cookies.");
}
// Hook for React applications
export const usePrescriptionAPI = () => {
    return prescriptionAPIService;
};

// Utility functions for common operations
export const PrescriptionUtils = {
    // Format file size
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validate file type
    isValidFileType(file: File): boolean {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        return validTypes.includes(file.type);
    },

    // Format prescription date
    formatDate(date: string | Date): string {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    },

    // Calculate time difference
    getTimeAgo(date: string | Date): string {
        const now = new Date();
        const then = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [unit, seconds] of Object.entries(intervals)) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }

        return 'Just now';
    },

    // Generate prescription number
    generatePrescriptionNumber(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `RX-${year}${month}${day}-${random}`;
    },

    // Calculate total medicine cost
    calculateTotalAmount(medicines: ProcessedMedicine[]): number {
        return medicines.reduce((total, medicine) => {
            return total + (medicine.price * medicine.quantity);
        }, 0);
    },

    // Check if prescription is overdue
    isOverdue(estimatedCompletion: Date): boolean {
        return new Date() > new Date(estimatedCompletion);
    },

    // Get urgency color
    getUrgencyColor(urgency: PrescriptionUrgency): string {
        const colors: Record<PrescriptionUrgency, string> = {
            routine: 'bg-blue-100 text-blue-800',
            normal: 'bg-green-100 text-green-800',
            urgent: 'bg-red-100 text-red-800',
        };
        return colors[urgency];
    },
};
