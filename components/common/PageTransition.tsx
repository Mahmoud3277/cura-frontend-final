'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <div className={`page-transition ${className}`} data-oid="jxj8pgp">
            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center" data-oid="te-7m89">
                    <div className="text-center" data-oid="d-fl7-2">
                        <div
                            className="w-16 h-16 border-4 border-cura-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
                            data-oid="7zw6jd."
                        ></div>
                        <p className="text-gray-600 animate-pulse" data-oid="ve.y:3g">
                            Loading...
                        </p>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in-up" data-oid="3ee10i.">
                    {children}
                </div>
            )}
        </div>
    );
}

export function SmoothPageTransition({ children }: { children: ReactNode }) {
    return (
        <div className="page-enter page-enter-active" data-oid="eluaerx">
            {children}
        </div>
    );
}
