'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BrandedDashboardCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

const variantStyles = {
    primary: {
        card: 'border-cura-primary/20 bg-gradient-to-br from-cura-primary/5 to-cura-secondary/5',
        header: 'text-cura-primary',
        value: 'text-cura-primary',
        icon: 'text-cura-primary/70',
        badge: 'bg-cura-primary/10 text-cura-primary border-cura-primary/20',
    },
    success: {
        card: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
        header: 'text-green-700',
        value: 'text-green-800',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-700 border-green-200',
    },
    warning: {
        card: 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50',
        header: 'text-orange-700',
        value: 'text-orange-800',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    info: {
        card: 'border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50',
        header: 'text-blue-700',
        value: 'text-blue-800',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    secondary: {
        card: 'border-cura-accent/20 bg-gradient-to-br from-cura-accent/5 to-cura-light/5',
        header: 'text-cura-accent',
        value: 'text-cura-secondary',
        icon: 'text-cura-accent/70',
        badge: 'bg-cura-accent/10 text-cura-accent border-cura-accent/20',
    },
};

export function BrandedDashboardCard({
    title,
    value,
    subtitle,
    icon,
    variant = 'primary',
    trend,
    className = '',
}: BrandedDashboardCardProps) {
    const styles = variantStyles[variant];

    return (
        <Card
            className={cn(
                'transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2',
                styles.card,
                className,
            )}
            data-oid=":zz758p"
        >
            <CardHeader className="pb-3" data-oid="r031qi9">
                <div className="flex items-center justify-between" data-oid="wnarrr2">
                    <h3
                        className={cn('text-sm font-medium tracking-wide', styles.header)}
                        data-oid="h99q08i"
                    >
                        {title}
                    </h3>
                    {icon && (
                        <div className={cn('text-2xl', styles.icon)} data-oid=":ixd.qh">
                            {icon}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0" data-oid="gv_cz0y">
                <div className="space-y-3" data-oid="axjg5:l">
                    <div
                        className={cn('text-3xl font-bold tracking-tight', styles.value)}
                        data-oid="l31cky9"
                    >
                        {value}
                    </div>

                    <div className="flex items-center justify-between" data-oid="45a7fzg">
                        {subtitle && (
                            <p className="text-sm text-muted-foreground" data-oid="j1c2w:r">
                                {subtitle}
                            </p>
                        )}
                        {trend && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    'text-xs font-medium',
                                    trend.isPositive
                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
                                )}
                                data-oid="bb5wt2x"
                            >
                                <span className="mr-1" data-oid="nm:8rw-">
                                    {trend.isPositive ? '↗' : '↘'}
                                </span>
                                {trend.value}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Icon components for consistency
export const DashboardIcons = {
    Users: () => (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="8ylvdb5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                data-oid="bif1yt:"
            />
        </svg>
    ),

    Activity: () => (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="kv8quzz"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
                data-oid="d.x3b1z"
            />
        </svg>
    ),

    Document: () => (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="kk5dcmu"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                data-oid="lgfv77k"
            />
        </svg>
    ),

    Target: () => (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="or06r58"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                data-oid="pts5z9q"
            />
        </svg>
    ),
};
