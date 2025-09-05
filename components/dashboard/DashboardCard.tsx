'use client';

import { ReactNode } from 'react';

interface DashboardCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    gradient?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

export function DashboardCard({
    title,
    value,
    subtitle,
    icon,
    gradient = 'from-[#1F1F6F] to-[#14274E]',
    trend,
    className = '',
}: DashboardCardProps) {
    return (
        <div
            className={`bg-gradient-to-r ${gradient} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
            data-oid="8a2xmti"
        >
            <div className="flex items-center justify-between mb-2" data-oid=".qok80p">
                <h3 className="text-lg font-semibold" data-oid="cm8ok4:">
                    {title}
                </h3>
                {icon && (
                    <div className="text-2xl opacity-80" data-oid="4tmp1ri">
                        {icon}
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold mb-1" data-oid="dcs-b-i">
                {value}
            </p>
            <div className="flex items-center justify-between" data-oid="n6a4uf8">
                {subtitle && (
                    <p className="text-sm opacity-80" data-oid="fyt4gna">
                        {subtitle}
                    </p>
                )}
                {trend && (
                    <span
                        className={`text-sm px-2 py-1 rounded-full ${
                            trend.isPositive
                                ? 'bg-green-500/20 text-green-100'
                                : 'bg-red-500/20 text-red-100'
                        }`}
                        data-oid="10p9wm."
                    >
                        {trend.isPositive ? '↗' : '↘'} {trend.value}
                    </span>
                )}
            </div>
        </div>
    );
}

// Predefined gradient variants
export const cardGradients = {
    primary: 'from-[#1F1F6F] to-[#14274E]',
    secondary: 'from-[#14274E] to-[#394867]',
    tertiary: 'from-[#394867] to-[#9BA4B4]',
    quaternary: 'from-[#9BA4B4] to-[#1F1F6F]',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
};
