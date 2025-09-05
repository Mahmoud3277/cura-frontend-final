import { UserRole } from '@/lib/types';

// Route configuration interface
export interface RouteConfig {
    path: string;
    allowedRoles: UserRole[];
    requireAuth: boolean;
    redirectTo?: string;
    title?: string;
    description?: string;
}

// Define all application routes with their permissions
export const routes: RouteConfig[] = [
    // Public routes
    {
        path: '/',
        allowedRoles: [],
        requireAuth: false,
        title: 'CURA - Online Pharmacy',
        description: 'Your trusted online pharmacy platform',
    },
    {
        path: '/shop',
        allowedRoles: [],
        requireAuth: false,
        title: 'Shop - CURA',
        description: 'Browse our wide selection of medicines and health products',
    },
    {
        path: '/about',
        allowedRoles: [],
        requireAuth: false,
        title: 'About Us - CURA',
        description: 'Learn more about CURA and our mission',
    },

    // Authentication routes
    {
        path: '/auth/login',
        allowedRoles: [],
        requireAuth: false,
        title: 'Login - CURA',
        description: 'Sign in to your CURA account',
    },
    {
        path: '/auth/register',
        allowedRoles: [],
        requireAuth: false,
        title: 'Register - CURA',
        description: 'Create your CURA account',
    },
    {
        path: '/auth/forgot-password',
        allowedRoles: [],
        requireAuth: false,
        title: 'Forgot Password - CURA',
        description: 'Reset your CURA account password',
    },

    // Customer routes
    {
        path: '/profile',
        allowedRoles: [
            'customer',
            'admin',
            'pharmacy',
            'doctor',
            'vendor',
            'prescription-reader',
            'database-input',
        ],
        requireAuth: true,
        title: 'Profile - CURA',
        description: 'Manage your profile settings',
    },
    {
        path: '/cart',
        allowedRoles: ['customer'],
        requireAuth: true,
        title: 'Shopping Cart - CURA',
        description: 'Review your selected items',
    },
    {
        path: '/checkout',
        allowedRoles: ['customer'],
        requireAuth: true,
        title: 'Checkout - CURA',
        description: 'Complete your order',
    },
    {
        path: '/orders',
        allowedRoles: ['customer'],
        requireAuth: true,
        title: 'My Orders - CURA',
        description: 'View your order history',
    },

    // Admin routes
    {
        path: '/admin/dashboard',
        allowedRoles: ['admin'],
        requireAuth: true,
        title: 'Admin Dashboard - CURA',
        description: 'Administrative control panel',
    },
    {
        path: '/admin/users',
        allowedRoles: ['admin'],
        requireAuth: true,
        title: 'User Management - CURA',
        description: 'Manage platform users',
    },
    {
        path: '/admin/pharmacies',
        allowedRoles: ['admin'],
        requireAuth: true,
        title: 'Pharmacy Management - CURA',
        description: 'Manage registered pharmacies',
    },
    {
        path: '/admin/doctors',
        allowedRoles: ['admin'],
        requireAuth: true,
        title: 'Doctor Management - CURA',
        description: 'Manage registered doctors',
    },
    {
        path: '/admin/vendors',
        allowedRoles: ['admin'],
        requireAuth: true,
        title: 'Vendor Management - CURA',
        description: 'Manage platform vendors',
    },
    {
        path: '/admin/analytics',
        allowedRoles: ['admin'],
        requireAuth: true,
        title: 'Analytics - CURA',
        description: 'Platform analytics and insights',
    },

    // Pharmacy routes
    {
        path: '/pharmacy/dashboard',
        allowedRoles: ['pharmacy'],
        requireAuth: true,
        title: 'Pharmacy Dashboard - CURA',
        description: 'Manage your pharmacy operations',
    },
    {
        path: '/pharmacy/orders',
        allowedRoles: ['pharmacy'],
        requireAuth: true,
        title: 'Orders - CURA',
        description: 'Manage incoming orders',
    },
    {
        path: '/pharmacy/inventory',
        allowedRoles: ['pharmacy'],
        requireAuth: true,
        title: 'Inventory - CURA',
        description: 'Manage your product inventory',
    },
    {
        path: '/pharmacy/analytics',
        allowedRoles: ['pharmacy'],
        requireAuth: true,
        title: 'Analytics - CURA',
        description: 'View your pharmacy analytics',
    },

    // Doctor routes
    {
        path: '/doctor/dashboard',
        allowedRoles: ['doctor'],
        requireAuth: true,
        title: 'Doctor Dashboard - CURA',
        description: 'Manage your referrals and patients',
    },
    {
        path: '/doctor/referrals',
        allowedRoles: ['doctor'],
        requireAuth: true,
        title: 'Referrals - CURA',
        description: 'Manage patient referrals',
    },
    {
        path: '/doctor/analytics',
        allowedRoles: ['doctor'],
        requireAuth: true,
        title: 'Analytics - CURA',
        description: 'View your referral analytics',
    },

    // Prescription Reader routes
    {
        path: '/prescription-reader/dashboard',
        allowedRoles: ['prescription-reader'],
        requireAuth: true,
        title: 'Prescription Reader Dashboard - CURA',
        description: 'Process prescription requests',
    },
    {
        path: '/prescription-reader/queue',
        allowedRoles: ['prescription-reader'],
        requireAuth: true,
        title: 'Prescription Queue - CURA',
        description: 'View pending prescriptions',
    },
    {
        path: '/prescription-reader/completed',
        allowedRoles: ['prescription-reader'],
        requireAuth: true,
        title: 'Completed Prescriptions - CURA',
        description: 'View processed prescriptions',
    },

    // Vendor routes
    {
        path: '/vendor/dashboard',
        allowedRoles: ['vendor'],
        requireAuth: true,
        title: 'Vendor Dashboard - CURA',
        description: 'Manage your products and sales',
    },
    {
        path: '/vendor/products',
        allowedRoles: ['vendor'],
        requireAuth: true,
        title: 'Products - CURA',
        description: 'Manage your product catalog',
    },
    {
        path: '/vendor/analytics',
        allowedRoles: ['vendor'],
        requireAuth: true,
        title: 'Analytics - CURA',
        description: 'View your sales analytics',
    },

    // Database Input routes
    {
        path: '/database-input/dashboard',
        allowedRoles: ['database-input'],
        requireAuth: true,
        title: 'Database Dashboard - CURA',
        description: 'Manage product database',
    },
    {
        path: '/database-input/products',
        allowedRoles: ['database-input'],
        requireAuth: true,
        title: 'Product Management - CURA',
        description: 'Add and edit product information',
    },
    {
        path: '/database-input/categories',
        allowedRoles: ['database-input'],
        requireAuth: true,
        title: 'Category Management - CURA',
        description: 'Manage product categories',
    },
];

// Helper functions for route management
export function getRouteConfig(path: string): RouteConfig | undefined {
    return routes.find((route) => route.path === path);
}

export function isRouteAllowed(path: string, userRole: UserRole | null): boolean {
    const route = getRouteConfig(path);
    if (!route) return true; // Allow unknown routes by default

    if (!route.requireAuth) return true; // Public route
    if (!userRole) return false; // Auth required but no user

    return route.allowedRoles.length === 0 || route.allowedRoles.includes(userRole);
}

export function getRedirectRoute(userRole: UserRole): string {
    switch (userRole) {
        case 'customer':
            return '/';
        case 'admin':
            return '/admin/dashboard';
        case 'pharmacy':
            return '/pharmacy/dashboard';
        case 'prescription-reader':
            return '/prescription-reader/dashboard';
        case 'doctor':
            return '/doctor/dashboard';
        case 'vendor':
            return '/vendor/dashboard';
        case 'database-input':
            return '/database-input/dashboard';
        default:
            return '/';
    }
}

export function getRoutesByRole(userRole: UserRole): RouteConfig[] {
    return routes.filter(
        (route) =>
            !route.requireAuth ||
            route.allowedRoles.length === 0 ||
            route.allowedRoles.includes(userRole),
    );
}
