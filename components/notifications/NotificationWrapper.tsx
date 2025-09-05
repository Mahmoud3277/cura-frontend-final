'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { NotificationToast } from './NotificationToast';

export function NotificationWrapper() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return null;
    }

    return <NotificationToast userId={user.id} userRole={user.role} data-oid="o36xd_-" />;
}
