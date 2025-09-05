'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface NotificationProps {
    notification: Notification;
    onRemove: (id: string) => void;
}

function NotificationComponent({ notification, onRemove }: NotificationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(notification.id);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
    }, [notification.id, notification.duration, onRemove]);

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" data-oid="xmklm.6" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-600" data-oid="hdk-jyq" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-600" data-oid="k8fy8bh" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-600" data-oid="5ub_gru" />;
        }
    };

    const getBackgroundColor = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div
            className={`min-w-80 max-w-md w-full border rounded-lg shadow-lg p-4 ${getBackgroundColor()}`}
            data-oid="e7h9_q1"
        >
            <div className="flex items-start space-x-3" data-oid="ep_fyph">
                <div className="flex-shrink-0" data-oid=".srgj0o">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0" data-oid="pvvidum">
                    <p className="text-sm font-medium text-gray-900 break-words" data-oid="c2u5751">
                        {notification.title}
                    </p>
                    {notification.message && (
                        <p
                            className="mt-1 text-sm text-gray-500 break-words leading-relaxed"
                            data-oid="5esoopg"
                        >
                            {notification.message}
                        </p>
                    )}
                </div>
                <div className="flex-shrink-0" data-oid="cp3_eq5">
                    <button
                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none p-1 transition-colors"
                        onClick={() => onRemove(notification.id)}
                        data-oid="hwzkq0d"
                        title="Close notification"
                    >
                        <X className="w-4 h-4" data-oid="2xkickm" />
                    </button>
                </div>
            </div>
        </div>
    );
}

interface NotificationContainerProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md" data-oid=":3yiy4s">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="animate-in slide-in-from-right-full duration-300"
                    data-oid="46cp4_2"
                >
                    <NotificationComponent
                        notification={notification}
                        onRemove={onRemove}
                        data-oid="3u2p-fj"
                    />
                </div>
            ))}
        </div>
    );
}

// Hook for managing notifications
export function useNotification() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { ...notification, id }]);
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    const showSuccess = (title: string, message?: string) => {
        addNotification({ type: 'success', title, message, duration: 4000 });
    };

    const showError = (title: string, message?: string) => {
        addNotification({ type: 'error', title, message, duration: 6000 });
    };

    const showWarning = (title: string, message?: string) => {
        addNotification({ type: 'warning', title, message, duration: 5000 });
    };

    const showInfo = (title: string, message?: string) => {
        addNotification({ type: 'info', title, message, duration: 4000 });
    };

    return {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}
