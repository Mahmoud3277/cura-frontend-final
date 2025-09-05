import { UserRole } from '@/lib/types';

export type NotificationType =
    | 'order'
    | 'prescription'
    | 'inventory'
    | 'system'
    | 'commission'
    | 'user'
    | 'pharmacy'
    | 'doctor'
    | 'vendor';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationData {
    id: string;
    userId: string;
    userRole: UserRole;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    isRead: boolean;
    isArchived: boolean;
    actionUrl?: string;
    actionLabel?: string;
    data?: any;
    createdAt: Date;
    readAt?: Date;
    expiresAt?: Date;
}

export interface NotificationSettings {
    userId: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    soundEnabled: boolean;
    notificationTypes: {
        [key in NotificationType]: boolean;
    };
}

// Mock notification data for development
const mockNotifications: NotificationData[] = [
    // Admin notifications
    {
        id: 'notif-1',
        userId: '2',
        userRole: 'admin',
        type: 'order',
        priority: 'high',
        title: 'New Order Received',
        message: 'Order #ORD-2024-001 has been placed by Ahmed Hassan for EGP 250.00',
        isRead: false,
        isArchived: false,
        actionUrl: '/admin/orders',
        actionLabel: 'View Order',
        data: { orderId: 'ORD-2024-001', amount: 250.0 },
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
        id: 'notif-2',
        userId: '2',
        userRole: 'admin',
        type: 'prescription',
        priority: 'urgent',
        title: 'Urgent Prescription Submitted',
        message: 'Urgent prescription RX-2024-003 requires immediate review',
        isRead: false,
        isArchived: false,
        actionUrl: '/admin/prescriptions',
        actionLabel: 'Review Prescription',
        data: { prescriptionId: 'RX-2024-003', urgency: 'urgent' },
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
    {
        id: 'notif-3',
        userId: '2',
        userRole: 'admin',
        type: 'pharmacy',
        priority: 'medium',
        title: 'New Pharmacy Application',
        message: 'Al-Nour Pharmacy has submitted an application for approval',
        isRead: true,
        isArchived: false,
        actionUrl: '/admin/pharmacies',
        actionLabel: 'Review Application',
        data: { pharmacyId: 'pharmacy-new-1' },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        readAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
        id: 'notif-4',
        userId: '2',
        userRole: 'admin',
        type: 'system',
        priority: 'low',
        title: 'Daily Analytics Report',
        message: 'Your daily analytics report is ready for review',
        isRead: false,
        isArchived: false,
        actionUrl: '/admin/analytics',
        actionLabel: 'View Report',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },

    // Pharmacy notifications
    {
        id: 'notif-5',
        userId: '3',
        userRole: 'pharmacy',
        type: 'order',
        priority: 'high',
        title: 'New Order Assignment',
        message: 'Order #ORD-2024-002 has been assigned to your pharmacy',
        isRead: false,
        isArchived: false,
        actionUrl: '/pharmacy/orders',
        actionLabel: 'View Order',
        data: { orderId: 'ORD-2024-002' },
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
        id: 'notif-6',
        userId: '3',
        userRole: 'pharmacy',
        type: 'inventory',
        priority: 'medium',
        title: 'Low Stock Alert',
        message: 'Paracetamol 500mg is running low (5 units remaining)',
        isRead: false,
        isArchived: false,
        actionUrl: '/pharmacy/inventory',
        actionLabel: 'Manage Inventory',
        data: { productId: 'product-1', stock: 5 },
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },

    // Customer notifications
    {
        id: 'notif-7',
        userId: '1',
        userRole: 'customer',
        type: 'prescription',
        priority: 'high',
        title: 'Prescription Ready',
        message: 'Your prescription RX-2024-001 is ready for pickup/delivery',
        isRead: false,
        isArchived: false,
        actionUrl: '/prescription/medicines/RX-2024-001',
        actionLabel: 'Select Medicines',
        data: {
            prescriptionId: 'RX-2024-001',
            patientName: 'Ahmed Hassan',
            status: 'approved',
            canSelectMedicines: true,
            medicinesCount: 3,
            approvedAt: new Date(Date.now() - 20 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    },
    {
        id: 'notif-8',
        userId: '1',
        userRole: 'customer',
        type: 'order',
        priority: 'medium',
        title: 'Order Delivered',
        message: 'Your order #ORD-2024-001 has been successfully delivered',
        isRead: true,
        isArchived: false,
        actionUrl: '/customer/dashboard',
        actionLabel: 'View Order',
        data: { orderId: 'ORD-2024-001' },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        readAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },

    // Doctor notifications
    {
        id: 'notif-9',
        userId: '4',
        userRole: 'doctor',
        type: 'commission',
        priority: 'medium',
        title: 'Commission Payment',
        message: 'Your monthly commission of EGP 1,250.00 has been processed',
        isRead: false,
        isArchived: false,
        actionUrl: '/doctor/analytics',
        actionLabel: 'View Details',
        data: { amount: 1250.0, period: 'January 2024' },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },

    // Prescription Reader notifications
    {
        id: 'notif-10',
        userId: 'reader-1',
        userRole: 'prescription-reader',
        type: 'prescription',
        priority: 'high',
        title: 'New Prescription to Review',
        message: 'Prescription RX-2024-004 has been assigned for your review',
        isRead: false,
        isArchived: false,
        actionUrl: '/prescription-reader/queue',
        actionLabel: 'Review Now',
        data: { prescriptionId: 'RX-2024-004' },
        createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    },
];

export class NotificationService {
    private static notifications: NotificationData[] = [...mockNotifications];
    private static listeners: Map<string, (notifications: NotificationData[]) => void> = new Map();

    // Initialize with some notifications for any user
    static initializeForUser(userId: string, userRole: UserRole) {
        // Check if user already has notifications
        const existingNotifications = this.notifications.filter(
            (n) => n.userId === userId && n.userRole === userRole,
        );

        if (existingNotifications.length === 0) {
            // Create some sample notifications for this user
            const sampleNotifications: NotificationData[] = [
                {
                    id: `welcome-${userId}`,
                    userId,
                    userRole,
                    type: 'system',
                    priority: 'medium',
                    title: 'Welcome to CURA!',
                    message:
                        'Thank you for joining CURA. Explore our features and start managing your health.',
                    isRead: false,
                    isArchived: false,
                    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
                },
                {
                    id: `info-${userId}`,
                    userId,
                    userRole,
                    type: 'system',
                    priority: 'low',
                    title: 'Platform Update',
                    message: 'We have updated our platform with new features and improvements.',
                    isRead: false,
                    isArchived: false,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                },
            ];

            this.notifications.push(...sampleNotifications);
            console.log('Created sample notifications for user:', userId, userRole);
        }
    }

    // Get notifications for a specific user
    static async getNotifications(
        userId: string,
        userRole: UserRole,
        filters?: {
            type?: NotificationType;
            priority?: NotificationPriority;
            isRead?: boolean;
            isArchived?: boolean;
            limit?: number;
            offset?: number;
        },
    ): Promise<NotificationData[]> {
        console.log('NotificationService.getNotifications called with:', {
            userId,
            userRole,
            totalNotifications: this.notifications.length,
        });

        let userNotifications = this.notifications.filter(
            (notification) => notification.userId === userId && notification.userRole === userRole,
        );

        console.log('Filtered notifications for user:', userNotifications.length);

        // Apply filters
        if (filters?.type) {
            userNotifications = userNotifications.filter((n) => n.type === filters.type);
        }
        if (filters?.priority) {
            userNotifications = userNotifications.filter((n) => n.priority === filters.priority);
        }
        if (filters?.isRead !== undefined) {
            userNotifications = userNotifications.filter((n) => n.isRead === filters.isRead);
        }
        if (filters?.isArchived !== undefined) {
            userNotifications = userNotifications.filter(
                (n) => n.isArchived === filters.isArchived,
            );
        }

        // Sort by creation date (newest first)
        userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Apply pagination
        if (filters?.offset || filters?.limit) {
            const offset = filters.offset || 0;
            const limit = filters.limit || 50;
            userNotifications = userNotifications.slice(offset, offset + limit);
        }

        return userNotifications;
    }

    // Get unread notification count
    static async getUnreadCount(userId: string, userRole: UserRole): Promise<number> {
        const unreadNotifications = this.notifications.filter(
            (notification) =>
                notification.userId === userId &&
                notification.userRole === userRole &&
                !notification.isRead &&
                !notification.isArchived,
        );
        return unreadNotifications.length;
    }

    // Mark notification as read
    static async markAsRead(notificationId: string): Promise<void> {
        console.log('NotificationService: Marking notification as read:', notificationId);
        const notificationIndex = this.notifications.findIndex((n) => n.id === notificationId);
        if (notificationIndex !== -1) {
            console.log('NotificationService: Found notification at index:', notificationIndex);
            console.log(
                'NotificationService: Before - isRead:',
                this.notifications[notificationIndex].isRead,
            );
            this.notifications[notificationIndex].isRead = true;
            this.notifications[notificationIndex].readAt = new Date();
            console.log(
                'NotificationService: After - isRead:',
                this.notifications[notificationIndex].isRead,
            );
            this.notifyListeners();
            console.log('NotificationService: Notified all listeners');
        } else {
            console.log('NotificationService: Notification not found:', notificationId);
        }
    }

    // Mark all notifications as read for a user
    static async markAllAsRead(userId: string, userRole: UserRole): Promise<void> {
        this.notifications.forEach((notification) => {
            if (
                notification.userId === userId &&
                notification.userRole === userRole &&
                !notification.isRead
            ) {
                notification.isRead = true;
                notification.readAt = new Date();
            }
        });
        this.notifyListeners();
    }

    // Archive notification
    static async archiveNotification(notificationId: string): Promise<void> {
        const notificationIndex = this.notifications.findIndex((n) => n.id === notificationId);
        if (notificationIndex !== -1) {
            this.notifications[notificationIndex].isArchived = true;
            this.notifyListeners();
        }
    }

    // Delete notification
    static async deleteNotification(notificationId: string): Promise<void> {
        this.notifications = this.notifications.filter((n) => n.id !== notificationId);
        this.notifyListeners();
    }

    // Create new notification
    static async createNotification(
        notification: Omit<NotificationData, 'id' | 'createdAt'>,
    ): Promise<NotificationData> {
        const newNotification: NotificationData = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
        };

        console.log('Creating new notification:', {
            id: newNotification.id,
            title: newNotification.title,
            priority: newNotification.priority,
            userId: newNotification.userId,
            userRole: newNotification.userRole,
            createdAt: newNotification.createdAt,
        });

        this.notifications.unshift(newNotification);
        this.notifyListeners();

        return newNotification;
    }

    // Subscribe to notification updates
    static subscribe(
        userId: string,
        callback: (notifications: NotificationData[]) => void,
    ): () => void {
        this.listeners.set(userId, callback);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(userId);
        };
    }

    // Notify all listeners
    private static notifyListeners(): void {
        console.log('NotificationService: Notifying', this.listeners.size, 'listeners');
        this.listeners.forEach((callback, key) => {
            console.log('NotificationService: Notifying listener:', key);
            callback([...this.notifications]);
        });
    }

    // Notification sound functionality removed as per user requirements
    static playNotificationSound(priority: NotificationPriority = 'medium'): void {
        // Sound functionality disabled - notifications are silent
        console.log(`Silent notification created with ${priority} priority`);
    }

    // Get notification statistics
    static async getNotificationStats(
        userId: string,
        userRole: UserRole,
    ): Promise<{
        total: number;
        unread: number;
        byType: Record<NotificationType, number>;
        byPriority: Record<NotificationPriority, number>;
    }> {
        const userNotifications = this.notifications.filter(
            (notification) =>
                notification.userId === userId &&
                notification.userRole === userRole &&
                !notification.isArchived,
        );

        const stats = {
            total: userNotifications.length,
            unread: userNotifications.filter((n) => !n.isRead).length,
            byType: {} as Record<NotificationType, number>,
            byPriority: {} as Record<NotificationPriority, number>,
        };

        // Count by type
        userNotifications.forEach((notification) => {
            stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
            stats.byPriority[notification.priority] =
                (stats.byPriority[notification.priority] || 0) + 1;
        });

        return stats;
    }

    // Simulate real-time notifications (for demo purposes)
    static startRealTimeSimulation(): void {
        console.log('Starting real-time notification simulation');

        setInterval(() => {
            // Get current user from localStorage to create notifications for them
            let currentUserId = '1'; // default to customer
            let currentUserRole: UserRole = 'customer';

            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    currentUserId = user.id;
                    currentUserRole = user.role;
                }
            } catch (error) {
                console.log('Could not get current user from localStorage');
            }

            // Create notifications for current user 60% of the time, others 40%
            const shouldCreateForCurrentUser = Math.random() > 0.4;

            let userId: string;
            let userRole: UserRole;

            if (shouldCreateForCurrentUser) {
                userId = currentUserId;
                userRole = currentUserRole;
            } else {
                // Randomly create for other users
                const randomUser = Math.random();
                if (randomUser < 0.25) {
                    userId = '2';
                    userRole = 'admin';
                } else if (randomUser < 0.5) {
                    userId = '3';
                    userRole = 'pharmacy';
                } else if (randomUser < 0.75) {
                    userId = 'reader-1';
                    userRole = 'prescription-reader';
                } else {
                    userId = '4';
                    userRole = 'doctor';
                }
            }

            const notificationTypes: NotificationType[] = [
                'order',
                'prescription',
                'inventory',
                'system',
            ];
            // Increase chance of high priority notifications for better testing
            const priorities: NotificationPriority[] = ['medium', 'high', 'high', 'urgent'];

            const randomType =
                notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
            const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

            const sampleNotifications = {
                order: {
                    title: 'New Order Received',
                    message: `Order #ORD-${Date.now().toString().slice(-6)} has been placed`,
                    actionUrl:
                        userRole === 'admin'
                            ? '/admin/orders'
                            : userRole === 'pharmacy'
                              ? '/pharmacy/orders'
                              : '/customer/dashboard',
                    actionLabel: 'View Order',
                    data: {},
                },
                prescription: {
                    title: 'Prescription Ready',
                    message: `Prescription RX-${Date.now().toString().slice(-6)} is ready for pickup/delivery`,
                    actionUrl:
                        userRole === 'admin'
                            ? '/admin/prescriptions'
                            : `/prescription/medicines/RX-${Date.now().toString().slice(-6)}`,
                    actionLabel: 'Select Medicines',
                    data: {
                        prescriptionId: `RX-${Date.now().toString().slice(-6)}`,
                        patientName: 'Ahmed Hassan',
                        status: 'approved',
                        canSelectMedicines: userRole === 'customer',
                        medicinesCount: Math.floor(Math.random() * 5) + 1,
                        approvedAt: new Date(),
                    },
                },
                inventory: {
                    title: 'Inventory Alert',
                    message: `Low stock alert for Paracetamol 500mg`,
                    actionUrl:
                        userRole === 'pharmacy' ? '/pharmacy/inventory' : '/admin/pharmacies',
                    actionLabel: 'Check Inventory',
                    data: {},
                },
                system: {
                    title: 'System Notification',
                    message: `System maintenance completed successfully`,
                    actionUrl: userRole === 'admin' ? '/admin/dashboard' : '/customer/dashboard',
                    actionLabel: 'View Dashboard',
                    data: {},
                },
            };

            console.log(
                `Creating notification for user ${userId} (${userRole}) - Type: ${randomType}, Priority: ${randomPriority}`,
            );

            this.createNotification({
                userId,
                userRole,
                type: randomType,
                priority: randomPriority,
                title: sampleNotifications[randomType].title,
                message: sampleNotifications[randomType].message,
                actionUrl: sampleNotifications[randomType].actionUrl,
                actionLabel: sampleNotifications[randomType].actionLabel,
                data: sampleNotifications[randomType].data,
                isRead: false,
                isArchived: false,
            });
        }, 15000); // Create notification every 15 seconds for better testing
    }
}
