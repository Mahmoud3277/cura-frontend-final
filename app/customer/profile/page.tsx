'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function CustomerProfilePage() {
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');

    return (
        <>
            {/* Mobile Layout */}
            <div className="block md:hidden min-h-screen bg-gray-50" data-oid="mobile-layout">
                <ResponsiveHeader data-oid="mobile-header" />

                <div className="px-4 py-6" data-oid="mobile-content">
                    <div className="mb-6" data-oid="mobile-title">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="mobile-h1">
                            {tCustomer('profile.title') || 'My Profile'}
                        </h1>
                        <div
                            className="h-1 w-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full"
                            data-oid="mobile-divider"
                        ></div>
                    </div>

                    <CustomerDashboard data-oid="mobile-dashboard" />
                </div>

                {/* Mobile Bottom Padding */}
                <div className="h-4 md:hidden" data-oid="mobile-bottom-padding"></div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block" data-oid="desktop-layout">
                <DashboardLayout title="My Profile" userType="customer" data-oid="dashboard-layout">
                    <CustomerDashboard data-oid="dashboard" />
                </DashboardLayout>
            </div>
        </>
    );
}
