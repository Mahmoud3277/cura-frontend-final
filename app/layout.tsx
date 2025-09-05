export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/contexts/I18nProvider';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { CityProvider } from '@/lib/contexts/CityContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { CartProvider } from '@/lib/contexts/CartContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
    title: 'CURA - Your Trusted Online Pharmacy',
    description:
        'Multi-vendor online pharmacy platform for medicines, supplements, and healthcare products',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid="cbq6gh_">
            <head data-oid=".kk_l-h">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                    data-oid="r36fo_:"
                />
            </head>
            <body className="" data-oid="z7xeoyb">
                <ErrorBoundary data-oid="wd31crp">
                    <I18nProvider data-oid="539sioo">
                        <LanguageProvider data-oid="kwtyg1a">
                            <CityProvider data-oid="3ybtfr8">
                                <AuthProvider data-oid="hy_ohc5">
                                    <CartProvider data-oid="jftj9y8">
                                        {children}
                                        <Toaster data-oid="f_owa4y" />
                                    </CartProvider>
                                </AuthProvider>
                            </CityProvider>
                        </LanguageProvider>
                    </I18nProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
