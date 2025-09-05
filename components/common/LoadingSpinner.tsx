'use client';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'white' | 'gray';
    className?: string;
}

export function LoadingSpinner({
    size = 'md',
    color = 'primary',
    className = '',
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    const colorClasses = {
        primary: 'border-cura-primary border-t-transparent',
        secondary: 'border-cura-secondary border-t-transparent',
        white: 'border-white border-t-transparent',
        gray: 'border-gray-300 border-t-transparent',
    };

    return (
        <div
            className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin ${className}`}
            data-oid="jhqa3f1"
        />
    );
}
