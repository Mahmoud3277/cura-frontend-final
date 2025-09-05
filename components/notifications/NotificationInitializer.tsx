'use client';

import { useEffect } from 'react';
import { NotificationService } from '@/lib/services/notificationService';

export function NotificationInitializer() {
    useEffect(() => {
        try {
            console.log('NotificationInitializer: Starting real-time simulation');
            // Start real-time notification simulation
            NotificationService.startRealTimeSimulation();
            console.log('NotificationInitializer: Real-time simulation started successfully');
        } catch (error) {
            console.error('NotificationInitializer: Error starting real-time simulation:', error);
        }
    }, []);

    return null;
}
