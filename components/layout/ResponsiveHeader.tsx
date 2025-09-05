'use client';

import { Header } from '@/components/layout/Header';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { ClientOnly } from '@/components/common/ClientOnly';

interface ResponsiveHeaderProps {
    variant?: 'default' | 'dashboard';
    className?: string;
}

export function ResponsiveHeader({ variant = 'default', className = '' }: ResponsiveHeaderProps) {
    return (
        <>
            {/* Mobile Header */}
            <div className="block md:hidden" data-oid=".be3thg">
                <ClientOnly
                    fallback={<div style={{ height: '64px' }} data-oid=":bu29w0" />}
                    data-oid="y9h330c"
                >
                    <MobileHeader data-oid="z8e-wlg" />
                </ClientOnly>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block" data-oid="xl:b:n4">
                <ClientOnly
                    fallback={<div style={{ height: '80px' }} data-oid="-vlu7f5" />}
                    data-oid="qkk63nn"
                >
                    <Header variant={variant} className={className} data-oid="ks1b428" />
                </ClientOnly>
            </div>
        </>
    );
}
