'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function CustomerDashboardPage() {
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');

    return (
        <DashboardLayout
            title={tCustomer('dashboard.title')}
            userType="customer"
            data-oid="dashboard-layout"
        >
            <CustomerDashboard data-oid="dashboard" />
        </DashboardLayout>
    );
}
