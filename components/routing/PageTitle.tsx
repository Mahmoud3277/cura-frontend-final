'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getRouteConfig } from '@/lib/routing/routes';

interface PageTitleProps {
    title?: string;
    description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
    const pathname = usePathname();

    useEffect(() => {
        // Get route config for current path
        const routeConfig = getRouteConfig(pathname);

        // Use provided title or fallback to route config
        const pageTitle = title || routeConfig?.title || 'CURA - Online Pharmacy';
        const pageDescription =
            description || routeConfig?.description || 'Your trusted online pharmacy platform';

        // Update document title
        document.title = pageTitle;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', pageDescription);
    }, [pathname, title, description]);

    return null; // This component doesn't render anything
}
