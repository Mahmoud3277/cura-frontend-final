import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their allowed roles
const routePermissions: Record<string, string[]> = {
    // Customer routes
    '/customer': ['customer'],
    '/customer/dashboard': ['customer'],
    '/customer/orders': ['customer'],
    '/customer/prescriptions': ['customer'],
    '/customer/subscriptions': ['customer'],
    '/customer/profile': ['customer'],
    '/customer/settings': ['customer'],
    '/customer/wallet': ['customer'],

    // Admin routes
    '/admin': ['admin'],
    '/admin/dashboard': ['admin'],
    '/admin/users': ['admin'],
    '/admin/pharmacies': ['admin'],
    '/admin/doctors': ['admin'],
    '/admin/vendors': ['admin'],
    '/admin/analytics': ['admin'],

    // Pharmacy routes
    '/pharmacy': ['pharmacy'],
    '/pharmacy/dashboard': ['pharmacy'],
    '/pharmacy/orders': ['pharmacy'],
    '/pharmacy/inventory': ['pharmacy'],
    '/pharmacy/analytics': ['pharmacy'],

    // Doctor routes
    '/doctor': ['doctor'],
    '/doctor/dashboard': ['doctor'],
    '/doctor/referrals': ['doctor'],
    '/doctor/analytics': ['doctor'],

    // Prescription Reader routes
    '/prescription-reader': ['prescription-reader'],
    '/prescription-reader/queue': ['prescription-reader'],
    '/prescription-reader/completed': ['prescription-reader'],

    // Vendor routes
    '/vendor': ['vendor'],
    '/vendor/dashboard': ['vendor'],
    '/vendor/products': ['vendor'],
    '/vendor/analytics': ['vendor'],

    // Database Input routes
    '/database-input': ['database-input'],
    '/database-input/dashboard': ['database-input'],
    '/database-input/products': ['database-input'],
    '/database-input/products/add': ['database-input'],
    '/database-input/categories': ['database-input'],

    // App Services routes
    '/app-services': ['app-services'],
    '/app-services/dashboard': ['app-services'],
    '/app-services/suspended-orders': ['app-services'],
    '/app-services/customer-service': ['app-services'],
    '/app-services/pharmacy-coordination': ['app-services'],
    '/app-services/order-management': ['app-services'],
    '/app-services/prescription-issues': ['app-services'],
    '/app-services/analytics': ['app-services'],
    '/app-services/agents': ['app-services'],
};

// Public routes that don't require authentication
const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/shop',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/pharmacy/register',
    '/medicine',
    '/haircare',
    '/skincare',
    '/daily-essentials',
    '/baby-essentials',
    '/vitamins',
    '/sexual-wellness',
    '/search',
    '/store-locator',
    '/emergency-medicine',
];

// Routes that require authentication but are accessible to all authenticated users
const authenticatedRoutes = [
    '/profile',
    '/settings',
    '/cart',
    '/checkout',
    '/orders',
    '/medicine',
    '/haircare',
    '/skincare',
    '/daily-essentials',
    '/baby-essentials',
    '/vitamins',
    '/sexual-wellness',
    '/shop',
    '/search',
    '/prescription/upload',
    '/prescription/status',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname.startsWith('/favicon')
    ) {
        return NextResponse.next();
    }

    // Check if route is public first
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Check for authentication token
    const authToken = request.cookies.get('authToken');
    const isAuthenticated = !!authToken;

    console.log('Middleware: Path:', pathname, 'Has authToken:', isAuthenticated);

    // Check if user needs authentication for protected routes
    if (!isAuthenticated) {
        // Redirect to login for protected routes
        if (
            pathname.startsWith('/admin') ||
            pathname.startsWith('/pharmacy') ||
            pathname.startsWith('/doctor') ||
            pathname.startsWith('/prescription-reader') ||
            pathname.startsWith('/vendor') ||
            pathname.startsWith('/database-input') ||
            pathname.startsWith('/app-services') ||
            pathname.startsWith('/customer') ||
            authenticatedRoutes.includes(pathname)
        ) {
            console.log('Middleware: Redirecting unauthenticated user to login from:', pathname);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        return NextResponse.next();
    }

    // User is authenticated, continue
    console.log('Middleware: User authenticated, allowing access to:', pathname);

    // Role-based permissions will be handled by the frontend components
    // since we can't decode user data from JWT in middleware without server-side access
    
    // Check if authenticated user is trying to access auth pages
    if (pathname.startsWith('/auth/') && isAuthenticated) {
        console.log('Middleware: Authenticated user accessing auth page, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Helper function to get dashboard route for user role
function getDashboardRouteForRole(role: string): string {
    switch (role) {
        case 'customer':
            return '/customer/dashboard';
        case 'admin':
            return '/admin/dashboard';
        case 'pharmacy':
            return '/pharmacy/dashboard';
        case 'prescription-reader':
            return '/prescription-reader/queue';
        case 'doctor':
            return '/doctor/dashboard';
        case 'vendor':
            return '/vendor/dashboard';
        case 'database-input':
            return '/database-input/dashboard';
        case 'app-services':
            return '/app-services/dashboard';
        default:
            return '/customer/dashboard';
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};