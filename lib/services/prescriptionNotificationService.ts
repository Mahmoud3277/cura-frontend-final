import { NotificationService, NotificationData } from './notificationService';
import { UserRole } from '@/lib/types';

export interface PrescriptionNotificationData {
    prescriptionId: string;
    patientName: string;
    customerId: string;
    status: 'approved' | 'rejected' | 'under_review';
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;
    medicinesCount?: number;
}

export class PrescriptionNotificationService {
    /**
     * Create a notification when a prescription is approved
     */
    static async createPrescriptionApprovedNotification(
        prescriptionData: PrescriptionNotificationData,
    ): Promise<NotificationData> {
        const notification = await NotificationService.createNotification({
            userId: prescriptionData.customerId,
            userRole: 'customer' as UserRole,
            type: 'prescription',
            priority: 'high',
            title: 'Prescription Ready',
            message: `Your prescription RX-${prescriptionData.prescriptionId} is ready for pickup/delivery`,
            isRead: false,
            isArchived: false,
            actionUrl: `/prescription/medicines/${prescriptionData.prescriptionId}`,
            actionLabel: 'Select Medicines',
            data: {
                prescriptionId: prescriptionData.prescriptionId,
                patientName: prescriptionData.patientName,
                status: prescriptionData.status,
                approvedAt: prescriptionData.approvedAt,
                medicinesCount: prescriptionData.medicinesCount,
                canSelectMedicines: true,
            },
        });

        // No notification sound as per user requirements
        console.log('Created prescription approved notification:', {
            prescriptionId: prescriptionData.prescriptionId,
            customerId: prescriptionData.customerId,
            notificationId: notification.id,
        });

        return notification;
    }

    /**
     * Create a notification when a prescription is rejected
     */
    static async createPrescriptionRejectedNotification(
        prescriptionData: PrescriptionNotificationData,
    ): Promise<NotificationData> {
        const notification = await NotificationService.createNotification({
            userId: prescriptionData.customerId,
            userRole: 'customer' as UserRole,
            type: 'prescription',
            priority: 'high',
            title: 'Prescription Update Required',
            message: `Your prescription RX-${prescriptionData.prescriptionId} requires attention`,
            isRead: false,
            isArchived: false,
            actionUrl: `/prescription/status`,
            actionLabel: 'View Details',
            data: {
                prescriptionId: prescriptionData.prescriptionId,
                patientName: prescriptionData.patientName,
                status: prescriptionData.status,
                rejectedAt: prescriptionData.rejectedAt,
                rejectionReason: prescriptionData.rejectionReason,
                canSelectMedicines: false,
            },
        });

        // No notification sound as per user requirements
        return notification;
    }

    /**
     * Create a notification when a prescription is under review
     */
    static async createPrescriptionUnderReviewNotification(
        prescriptionData: PrescriptionNotificationData,
    ): Promise<NotificationData> {
        const notification = await NotificationService.createNotification({
            userId: prescriptionData.customerId,
            userRole: 'customer' as UserRole,
            type: 'prescription',
            priority: 'medium',
            title: 'Prescription Under Review',
            message: `Your prescription RX-${prescriptionData.prescriptionId} is being reviewed by our pharmacist`,
            isRead: false,
            isArchived: false,
            actionUrl: `/prescription/status`,
            actionLabel: 'Track Status',
            data: {
                prescriptionId: prescriptionData.prescriptionId,
                patientName: prescriptionData.patientName,
                status: prescriptionData.status,
                canSelectMedicines: false,
            },
        });

        return notification;
    }

    /**
     * Simulate prescription approval workflow for demo purposes
     */
    static startPrescriptionWorkflowSimulation(): void {
        console.log('Starting prescription workflow simulation...');

        // Simulate prescription approvals every 30 seconds for demo
        setInterval(() => {
            // Get current user from localStorage to create notifications for them
            let currentUserId = '1'; // default to customer

            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    currentUserId = user.id;
                }
            } catch (error) {
                console.log('Could not get current user from localStorage');
            }

            // Only create prescription notifications for customers
            const shouldCreatePrescriptionNotification = Math.random() > 0.7; // 30% chance

            if (shouldCreatePrescriptionNotification) {
                const prescriptionId = `RX-${Date.now().toString().slice(-6)}`;
                const patientNames = ['Ahmed Hassan', 'Fatima Ali', 'Mohamed Omar', 'Sara Ahmed'];
                const randomPatientName =
                    patientNames[Math.floor(Math.random() * patientNames.length)];

                // Only create approved prescription notifications (100% approval for demo)
                // This ensures customers only get notifications when they can select medicines
                const prescriptionData: PrescriptionNotificationData = {
                    prescriptionId,
                    patientName: randomPatientName,
                    customerId: currentUserId,
                    status: 'approved',
                    approvedAt: new Date(),
                    medicinesCount: Math.floor(Math.random() * 5) + 1,
                };

                this.createPrescriptionApprovedNotification(prescriptionData);
                console.log(`Created prescription approved notification for ${prescriptionId}`);
            }
        }, 30000); // Every 30 seconds for demo purposes
    }

    /**
     * Get prescription-specific notifications for a user
     */
    static async getPrescriptionNotifications(
        userId: string,
        userRole: UserRole,
        limit: number = 10,
    ): Promise<NotificationData[]> {
        const allNotifications = await NotificationService.getNotifications(userId, userRole, {
            type: 'prescription',
            limit,
            isArchived: false,
        });

        return allNotifications;
    }

    /**
     * Mark prescription notification as read and handle navigation
     */
    static async handlePrescriptionNotificationClick(
        notificationId: string,
        prescriptionId: string,
    ): Promise<string> {
        // Mark notification as read
        await NotificationService.markAsRead(notificationId);

        // Return the appropriate navigation URL
        return `/prescription/medicines/${prescriptionId}`;
    }
}
