'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { isRouteAllowed, getRedirectRoute } from '@/lib/routing/routes';

export function useRouteGuard() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // Check if current route is allowed for the user
        const allowed = isRouteAllowed(pathname, user?.role || null);

        if (!allowed) {
            if (!isAuthenticated) {
                // Redirect to login if not authenticated
                router.push('/auth/login');
            } else if (user) {
                // Redirect to appropriate dashboard if wrong role
                const redirectRoute = getRedirectRoute(user.role);
                router.push(redirectRoute);
            }
        }
    }, [user, isAuthenticated, isLoading, pathname, router]);

    return {
        isAllowed: isRouteAllowed(pathname, user?.role || null),
        isLoading,
        user,
        isAuthenticated,
    };
}
