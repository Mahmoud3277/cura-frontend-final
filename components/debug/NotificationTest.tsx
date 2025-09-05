'use client';

import { NotificationService } from '@/lib/services/notificationService';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useNotification } from '@/components/ui/notification';

export function NotificationTest() {
    const { user } = useAuth();
    const { showSuccess, showError, showWarning, showInfo } = useNotification();

    if (!user) return null;

    const createTestNotification = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
        NotificationService.createNotification({
            userId: user.id,
            userRole: user.role,
            type: 'order',
            priority,
            title: `Test ${priority} Priority Notification`,
            message: `This is a test notification with ${priority} priority created at ${new Date().toLocaleTimeString()}`,
            actionUrl: '/customer/dashboard',
            actionLabel: 'View Dashboard',
            isRead: false,
            isArchived: false,
        });
    };

    const testUINotifications = () => {
        showSuccess(
            'City Successfully Deleted',
            'Abu Hammam has been permanently removed from the system. All associated data has been cleared.',
        );

        setTimeout(() => {
            showError(
                'Failed to Delete City',
                'The city could not be deleted. Please check if there are active dependencies and try again.',
            );
        }, 1000);

        setTimeout(() => {
            showWarning(
                'City Cannot Be Deleted',
                'Cairo cannot be deleted: This city has active pharmacies and doctors. Please resolve these dependencies first.',
            );
        }, 2000);

        setTimeout(() => {
            showInfo(
                'City Status Updated',
                'Alexandria has been enabled and is now available to customers.',
            );
        }, 3000);
    };

    return (
        <div
            className="fixed bottom-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border"
            data-oid="r1.6w72"
        >
            <h3 className="text-sm font-semibold mb-2" data-oid="finkq.e">
                Notification Test
            </h3>
            <div className="space-y-2" data-oid="lozmz73">
                <button
                    onClick={testUINotifications}
                    className="block w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    data-oid="test-ui-notifications"
                >
                    Test UI Notifications
                </button>
                <button
                    onClick={() => createTestNotification('low')}
                    className="block w-full text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    data-oid="rvi6ys-"
                >
                    Low Priority
                </button>
                <button
                    onClick={() => createTestNotification('medium')}
                    className="block w-full text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    data-oid="1aayl:f"
                >
                    Medium Priority
                </button>
                <button
                    onClick={() => createTestNotification('high')}
                    className="block w-full text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                    data-oid="fabl2pt"
                >
                    High Priority (Sound)
                </button>
                <button
                    onClick={() => createTestNotification('urgent')}
                    className="block w-full text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    data-oid="m.i03ss"
                >
                    Urgent Priority (Sound)
                </button>
            </div>
        </div>
    );
}
