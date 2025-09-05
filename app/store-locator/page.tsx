'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCity } from '@/lib/contexts/CityContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { StoreLocator } from '@/components/store/StoreLocator';

export default function StoreLocatorPage() {
    const { t } = useTranslation();
    const { selectedCity, availableCities } = useCity();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50" data-oid="fvcbbtj">
                <Header data-oid="67qah5g" />
                <div className="flex items-center justify-center min-h-[60vh]" data-oid="lnuunxd">
                    <div className="text-center" data-oid=":zsrxxv">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-cura-primary mx-auto mb-4"
                            data-oid="blr8yyv"
                        ></div>
                        <p className="text-gray-600" data-oid="zaqzvt1">
                            {t('subscription.storeLocator.loading')}
                        </p>
                    </div>
                </div>
                <Footer data-oid="ezy-ip2" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="_cp866-">
            <Header data-oid="_..0jnh" />

            {/* Page Header */}
            <div className="bg-white border-b border-gray-200" data-oid="dn:mvhd">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="b:64c1h">
                    <div className="text-center" data-oid="_7audb-">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4" data-oid="v232aw3">
                            {t('subscription.storeLocator.title')}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-oid="5b5b:ak">
                            {t('subscription.storeLocator.description')}
                        </p>
                        {selectedCity && (
                            <div
                                className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cura-primary/10 text-cura-primary"
                                data-oid="nj4_88p"
                            >
                                📍 {t('subscription.storeLocator.currentLocation')}:{' '}
                                {selectedCity.nameEn}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Store Locator Component */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="04l-xvt">
                <StoreLocator data-oid="asz7buw" />
            </div>

            <Footer data-oid="57kykjs" />
        </div>
    );
}
