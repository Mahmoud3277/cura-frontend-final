'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarProvider, useSidebar } from '@/lib/contexts/SidebarContext';
import { CustomerMobileSideNavigation } from '@/components/mobile/CustomerMobileSideNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserRole } from '@/lib/types';

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
    userType: UserRole;
    allowedRoles?: UserRole[];
}

function DashboardContent({
    children,
    title,
    userType,
}: Omit<DashboardLayoutProps, 'allowedRoles'>) {
    const { isCollapsed } = useSidebar();
    const isMobile = useIsMobile();

    // Calculate margin based on sidebar state, user type, and device
    const getMarginLeft = () => {
        if (userType === 'customer' && isMobile) {
            return 'ml-16'; // Fixed margin for mobile side navigation (collapsed state)
        } else if (userType === 'customer') {
            return isCollapsed ? 'ml-20' : 'ml-80';
        } else {
            return isCollapsed ? 'ml-16' : 'ml-64';
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50"
            data-oid="75c3ofo"
        >
            {/* Conditional Header - hide on mobile for customers to save space */}
            {!(userType === 'customer' && isMobile) && <Header data-oid="o.8r:v." />}

            <div className="flex" data-oid="_szjt7:">
                {/* Conditional Navigation - Always use CustomerMobileSideNavigation for customers on mobile */}
                {userType === 'customer' && isMobile ? (
                    <CustomerMobileSideNavigation data-oid="3hbfnn6" />
                ) : (
                    <Sidebar userType={userType} data-oid="uhx49g0" />
                )}

                {/* Main content with dynamic margin based on sidebar state */}
                <main
                    className={`flex-1 transition-[margin-left] duration-300 ease-in-out ${getMarginLeft()} ${
                        userType === 'customer' && isMobile ? 'pt-4' : 'pt-0'
                    }`}
                    data-oid="q43124g"
                >
                    <div className="p-4 sm:p-6" data-oid="8gnqd.k">
                        <div className="w-full" data-oid="w225fdy">
                            {/* Page Header */}
                            <div className="mb-6 sm:mb-8" data-oid="6bihwno">
                                <h1
                                    className="text-3xl font-bold text-gray-900 mb-2"
                                    data-oid="popuu0:"
                                >
                                    {title}
                                </h1>
                                <div
                                    className="h-1 w-20 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full"
                                    data-oid="2461le1"
                                ></div>
                            </div>

                            {/* Page Content */}
                            <div className="space-y-6" data-oid="ckb3a:7">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export function DashboardLayout({ children, title, userType, allowedRoles }: DashboardLayoutProps) {
    // If allowedRoles is not provided, default to the userType
    const roles = allowedRoles || [userType];

    // Database-input users have their own custom layout, don't render DashboardLayout
    if (userType === 'database-input') {
        return (
            <ProtectedRoute allowedRoles={roles} data-oid="4fz_x9z">
                {children}
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={roles} data-oid="jab_n8w">
            <SidebarProvider data-oid="6lweuq:">
                <DashboardContent title={title} userType={userType} data-oid="8zk6gee">
                    {children}
                </DashboardContent>
            </SidebarProvider>
        </ProtectedRoute>
    );
}

// Convenience wrappers for specific dashboard types
export function AdminDashboardLayout({ children, title }: { children: ReactNode; title: string }) {
    return (
        <DashboardLayout title={title} userType="admin" allowedRoles={['admin']} data-oid="-b9fhsi">
            {children}
        </DashboardLayout>
    );
}

export function PharmacyDashboardLayout({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    return (
        <DashboardLayout
            title={title}
            userType="pharmacy"
            allowedRoles={['pharmacy']}
            data-oid="_nies3d"
        >
            {children}
        </DashboardLayout>
    );
}

export function DoctorDashboardLayout({ children, title }: { children: ReactNode; title: string }) {
    return (
        <DashboardLayout
            title={title}
            userType="doctor"
            allowedRoles={['doctor']}
            data-oid="joquh4n"
        >
            {children}
        </DashboardLayout>
    );
}

export function VendorDashboardLayout({ children, title }: { children: ReactNode; title: string }) {
    return (
        <DashboardLayout
            title={title}
            userType="vendor"
            allowedRoles={['vendor']}
            data-oid="cgp9200"
        >
            {children}
        </DashboardLayout>
    );
}

export function PrescriptionReaderDashboardLayout({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    return (
        <DashboardLayout
            title={title}
            userType="prescription-reader"
            allowedRoles={['prescription-reader']}
            data-oid="fxexud4"
        >
            {children}
        </DashboardLayout>
    );
}

export function DatabaseInputDashboardLayout({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    // Database-input uses its own custom layout, just return children with protection
    return (
        <ProtectedRoute allowedRoles={['database-input']} data-oid="6.s3t.3">
            {children}
        </ProtectedRoute>
    );
}
