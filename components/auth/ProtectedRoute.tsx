'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/lib/contexts/AuthContext';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
    redirectTo?: string;
    requireAuth?: boolean;
}

export function ProtectedRoute({
    children,
    allowedRoles,
    redirectTo,
    requireAuth = true,
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // If authentication is required but user is not authenticated
        if (requireAuth && !isAuthenticated) {
            console.log('ProtectedRoute: User not authenticated, redirecting to login');
            router.push(redirectTo || '/auth/login');
            return;
        }

        // If user is authenticated but doesn't have required role
        if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role)) {
            console.log(
                `ProtectedRoute: User ${user.email} with role ${user.role} denied access. Required roles:`,
                allowedRoles,
            );
            // Redirect to their appropriate dashboard
            const userDashboard = getDashboardRoute(user.role);
            console.log('ProtectedRoute: Redirecting to dashboard:', userDashboard);
            router.push(userDashboard);
            return;
        }

        console.log(
            'ProtectedRoute: Access granted for user:',
            user?.email,
            'role:',
            user?.role,
            'required roles:',
            allowedRoles,
        );
    }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo, requireAuth, router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50"
                data-oid="yh7ntvb"
            >
                <div className="text-center" data-oid="sr0ffwb">
                    <div
                        className="w-16 h-16 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="so0d.5h"
                    ></div>
                    <p className="text-gray-600" data-oid="olf.gdh">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    // If authentication is required but user is not authenticated, don't render children
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    // If user doesn't have required role, don't render children
    if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    // Render children if all checks pass
    return <>{children}</>;
}

// Convenience wrapper for admin-only routes
export function AdminRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['admin']} data-oid="59q9ctk">
            {children}
        </ProtectedRoute>
    );
}

// Convenience wrapper for pharmacy-only routes
export function PharmacyRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['pharmacy']} data-oid="vs7wwe2">
            {children}
        </ProtectedRoute>
    );
}

// Convenience wrapper for customer-only routes
export function CustomerRoute({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['customer']} data-oid="_o1r-2u">
            {children}
        </ProtectedRoute>
    );
}

// Convenience wrapper for multiple roles
export function MultiRoleRoute({ children, roles }: { children: ReactNode; roles: UserRole[] }) {
    return (
        <ProtectedRoute allowedRoles={roles} data-oid="4xyql34">
            {children}
        </ProtectedRoute>
    );
}
