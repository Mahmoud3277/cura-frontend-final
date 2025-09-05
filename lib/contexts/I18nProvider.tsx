'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createI18nInstance } from '@/lib/i18n/client';

interface I18nProviderProps {
    children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [i18n, setI18n] = useState<any>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const i18nInstance = createI18nInstance();
            setI18n(i18nInstance);
            setIsHydrated(true);
        }
    }, []);

    // During SSR or before hydration, render children without i18n context
    // This prevents hydration mismatches
    if (!i18n || !isHydrated) {
        return <div data-oid="6do.b6t">{children}</div>;
    }

    return (
        <I18nextProvider i18n={i18n} data-oid=":lgn.g:">
            {children}
        </I18nextProvider>
    );
}
