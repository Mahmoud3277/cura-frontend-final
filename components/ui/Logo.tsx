'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'gradient' | 'solid' | 'white';
    showIcon?: boolean;
}

const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
};

const variantClasses = {
    gradient: 'text-cura-gradient',
    solid: 'text-[#1F1F6F]',
    white: 'text-white',
};

export function Logo({ className, size = 'md', variant = 'gradient', showIcon = true }: LogoProps) {
    return (
        <Link
            href="/"
            className={cn(
                'flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer group',
                className,
            )}
            data-oid="xckq_co"
        >
            {showIcon && (
                <img
                    src="/images/cura-logo.png"
                    alt="Cura Logo"
                    className={cn(
                        'transition-all duration-300 group-hover:scale-110 h-auto',
                        size === 'sm' && 'w-14',
                        size === 'md' && 'w-20',
                        size === 'lg' && 'w-25',
                        size === 'xl' && 'w-28',
                    )}
                    data-oid="k.-nx1q"
                />
            )}
        </Link>
    );
}

// Alternative minimalist version
export function LogoMinimal({ className, size = 'md', variant = 'gradient' }: LogoProps) {
    return (
        <Link
            href="/"
            className={cn(
                'font-black tracking-tighter hover:scale-105 transition-all duration-300 cursor-pointer relative group',
                sizeClasses[size],
                variantClasses[variant],
                className,
            )}
            data-oid="oko2r3z"
        >
            CURA
            <div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] group-hover:w-full transition-all duration-300"
                data-oid="72wtucs"
            ></div>
        </Link>
    );
}

// Icon only version
export function LogoIcon({
    className,
    size = 'md',
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
    return (
        <Link
            href="/"
            className={cn(
                'flex items-center justify-center rounded-xl hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl',
                size === 'sm' && 'w-14 h-14',
                size === 'md' && 'w-20 h-20',
                size === 'lg' && 'w-25 h-25',
                size === 'xl' && 'w-28 h-28',
                className,
            )}
            data-oid="dp7s5hj"
        >
            <img
                src="/images/cura-logo.png"
                alt="Cura Logo"
                className={cn('w-full h-full object-contain')}
                data-oid="cy688rj"
            />
        </Link>
    );
}
