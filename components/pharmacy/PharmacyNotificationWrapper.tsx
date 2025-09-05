'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PharmacyNotificationSystem } from './PharmacyNotificationSystem';
import { NotificationToast } from '@/components/notifications/NotificationToast';
import { NotificationService } from '@/lib/services/notificationService';

export function PharmacyNotificationWrapper() {
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role === 'pharmacy') {
            // Initialize notification service for pharmacy user
            NotificationService.initializeForUser(user.id, user.role);

            // Start real-time simulation if not already started
            NotificationService.startRealTimeSimulation();

            console.log('Pharmacy notification system initialized for user:', user.id);
        }
    }, [user]);

    if (!user || user.role !== 'pharmacy') {
        return null;
    }

    return (
        <>
            {/* Enhanced pharmacy-specific notification system */}
            <PharmacyNotificationSystem userId={user.id} userRole={user.role} data-oid="ph33_ls" />

            {/* General notification toasts */}
            <NotificationToast userId={user.id} userRole={user.role} data-oid="6r_hi2q" />
        </>
    );
}
