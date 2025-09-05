'use client';

import { ReactNode } from 'react';

interface DashboardWidgetProps {
    title: string;
    children: ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function DashboardWidget({ title, children, action, className = '' }: DashboardWidgetProps) {
    return (
        <div
            className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${className}`}
            data-oid="r5zu-3w"
        >
            <div className="flex justify-between items-center mb-4" data-oid="lkrzqnw">
                <h3 className="text-xl font-semibold text-gray-900" data-oid="kg62u-r">
                    {title}
                </h3>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="text-[#1F1F6F] hover:text-[#14274E] font-medium text-sm transition-colors"
                        data-oid="3etvll-"
                    >
                        {action.label}
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}

interface ActivityItemProps {
    title: string;
    subtitle?: string;
    time: string;
    status?: {
        label: string;
        variant: 'success' | 'warning' | 'danger' | 'info';
    };
    value?: string;
}

export function ActivityItem({ title, subtitle, time, status, value }: ActivityItemProps) {
    const statusColors = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
    };

    return (
        <div
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            data-oid="0-3y5fr"
        >
            <div className="flex-1" data-oid="0:lt5ju">
                <p className="font-medium text-gray-900" data-oid="gbixq3v">
                    {title}
                </p>
                {subtitle && (
                    <p className="text-sm text-gray-600" data-oid="-c:yv74">
                        {subtitle}
                    </p>
                )}
                <p className="text-xs text-gray-500" data-oid="jj:3:rv">
                    {time}
                </p>
            </div>
            <div className="text-right" data-oid="0stmb5z">
                {value && (
                    <p className="font-bold text-[#1F1F6F] mb-1" data-oid="d8saiuw">
                        {value}
                    </p>
                )}
                {status && (
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${statusColors[status.variant]}`}
                        data-oid="dn.a50y"
                    >
                        {status.label}
                    </span>
                )}
            </div>
        </div>
    );
}
