// Brand Colors
export const BRAND_COLORS = {
    primary: '#1F1F6F',
    secondary: '#14274E',
    accent: '#394867',
    light: '#9BA4B4',
} as const;

// User Roles
export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    PHARMACY: 'pharmacy',
    PRESCRIPTION_READER: 'prescription_reader',
    DATABASE_INPUT: 'database_input',
    DOCTOR: 'doctor',
    VENDOR: 'vendor',
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = {
    MEDICINES: 'medicines',
    SKINCARE: 'skincare',
    SUPPLEMENTS: 'supplements',
    VITAMINS: 'vitamins',
    MEDICAL_SUPPLIES: 'medical_supplies',
    BABY_CARE: 'baby_care',
} as const;

// Order Status
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
} as const;

// Prescription Status
export const PRESCRIPTION_STATUS = {
    UPLOADED: 'uploaded',
    UNDER_REVIEW: 'under_review',
    PROCESSED: 'processed',
    READY_FOR_ORDER: 'ready_for_order',
    REJECTED: 'rejected',
} as const;

// Egyptian Cities (sample)
export const CITIES = [
    'Cairo',
    'Alexandria',
    'Giza',
    'Ismailia',
    'Suez',
    'Port Said',
    'Mansoura',
    'Tanta',
    'Aswan',
    'Luxor',
] as const;

// Real-time Feature Priorities
export const REALTIME_PRIORITIES = {
    HIGH: ['order_notifications', 'prescription_status', 'inventory_alerts'],
    MEDIUM: ['analytics_updates', 'user_registrations', 'commission_updates'],
    LOW: ['chat_support', 'maintenance_notifications'],
} as const;
