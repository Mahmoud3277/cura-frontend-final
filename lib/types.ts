// User Types
export type UserRole =
    | 'customer'
    | 'admin'
    | 'pharmacy'
    | 'prescription-reader'
    | 'database-input'
    | 'doctor'
    | 'vendor'
    | 'app-services';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    phone?: string;
    whatsappNumber?: string;
    city?: string;
    isActive: boolean;
    createdAt: string;
    // Role-specific data
    pharmacyId?: string;
    doctorLicense?: string;
    vendorId?: string;
    permissions?: string[];
}

// Authentication Types
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    role: UserRole;
    pharmacyName?: string;
    pharmacyLicense?: string;
    doctorLicense?: string;
    vendorCompany?: string;
}

export interface Customer extends User {
    role: 'customer';
    address?: string;
    prescriptions: Prescription[];
    orders: Order[];
    subscriptions: Subscription[];
}

export interface Pharmacy extends User {
    role: 'pharmacy';
    nameAr: string;
    nameEn: string;
    commission: number; // percentage
    workingHours: {
        open: string;
        close: string;
    };
    isOpen: boolean;
    city: string;
    products: PharmacyProduct[];
}

export interface Doctor extends User {
    role: 'doctor';
    commission: number; // percentage
    referralLink: string;
    qrCode: string;
    referrals: Referral[];
}

// Product Types
export interface Product {
    id: string;
    name: string;
    nameAr: string;
    brand: string;
    category: string;
    description: string;
    descriptionAr: string;
    sideEffects: string;
    sideEffectsAr: string;
    contraindications: string;
    contraindicationsAr: string;
    activeIngredients: string[];
    images: string[];
    alternatives: string[]; // product IDs
}

export interface PharmacyProduct {
    productId: string;
    pharmacyId: string;
    price: number;
    quantity: number;
    expiryDate: Date;
    isAvailable: boolean;
}

// Order Types
export interface Order {
    id: string;
    customerId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    prescriptionId?: string;
    deliveryAddress: string;
    city: string;
    createdAt: Date;
    updatedAt: Date;
    returnInfo?: OrderReturn;
}

export interface OrderReturn {
    id: string;
    orderId: string;
    customerId: string;
    reason: string;
    description?: string;
    status: 'requested' | 'approved' | 'rejected' | 'processing' | 'completed';
    requestedAt: Date;
    processedAt?: Date;
    refundAmount: number;
    refundMethod: 'original_payment' | 'store_credit' | 'bank_transfer';
    returnItems: ReturnItem[];
    adminNotes?: string;
    customerNotes?: string;
}

export interface ReturnItem {
    orderItemId: string;
    productId: string;
    quantity: number;
    reason: string;
    condition: 'unopened' | 'opened' | 'damaged' | 'expired';
    refundAmount: number;
}

export interface OrderItem {
    productId: string;
    pharmacyId: string;
    quantity: number;
    price: number;
    unitType: 'box' | 'strip' | 'piece';
}

// Prescription Types
export interface Prescription {
    id: string;
    customerId: string;
    imageUrl: string;
    status: string;
    processedBy?: string; // prescription reader ID
    medicines: PrescriptionMedicine[];
    instructions: string;
    createdAt: Date;
    processedAt?: Date;
}

export interface PrescriptionMedicine {
    productId: string;
    quantity: number;
    instructions: string;
    alternatives: string[]; // product IDs
}

// Subscription Types
export interface Subscription {
    id: string;
    customerId: string;
    products: SubscriptionProduct[];
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
    nextDelivery: Date;
    isActive: boolean;
    totalAmount: number;
    createdAt: Date;
    updatedAt?: Date;
    deliveryAddress: string;
    deliveryInstructions?: string;
    planId?: string;
    discount?: number;
    status: 'active' | 'paused' | 'cancelled';
    pauseReason?: string;
    pausedUntil?: Date;
    cancelReason?: string;
    cancelledAt?: Date;
    deliveryHistory?: SubscriptionDelivery[];
}

export interface SubscriptionDelivery {
    id: string;
    deliveryDate: Date;
    status: 'pending' | 'out-for-delivery' | 'delivered' | 'failed';
    trackingNumber?: string;
    deliveredBy?: string;
    notes?: string;
}

export interface SubscriptionProduct {
    productId: string;
    pharmacyId: string;
    quantity: number;
    unitType: 'box' | 'blister' | 'piece';
}

// Analytics Types
export interface KPIData {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    prescriptionUploadRate: number;
    customerRetentionRate: number;
    activePharmacies: number;
    activeCustomers: number;
}

export interface PharmacyAnalytics {
    pharmacyId: string;
    totalSales: number;
    totalOrders: number;
    commission: number;
    revenue: number;
    topProducts: string[];
}

// Referral Types
export interface Referral {
    id: string;
    doctorId: string;
    customerId: string;
    orderId: string;
    commission: number;
    createdAt: Date;
}

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    type: 'order' | 'prescription' | 'inventory' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    data?: any;
}

// Health Profile Types
export interface HealthProfile {
    id: string;
    customerId: string;
    personalInfo: PersonalHealthInfo;
    medicalHistory: MedicalHistory;
    allergies: Allergy[];
    currentMedications: CurrentMedication[];
    chronicConditions: ChronicCondition[];
    emergencyContacts: EmergencyContact[];
    healthGoals: HealthGoal[];
    preferences: HealthPreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface PersonalHealthInfo {
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    height: number; // in cm
    weight: number; // in kg
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
    smokingStatus: 'never' | 'former' | 'current' | 'unknown';
    alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy' | 'unknown';
    exerciseFrequency: 'none' | 'rarely' | 'weekly' | 'daily' | 'unknown';
    occupation?: string;
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
    whatsappNumber?: string;
}

export interface MedicalHistory {
    surgeries: Surgery[];
    hospitalizations: Hospitalization[];
    familyHistory: FamilyHistory[];
    vaccinations: Vaccination[];
    labResults: LabResult[];
}

export interface Surgery {
    id: string;
    procedure: string;
    date: Date;
    hospital: string;
    surgeon?: string;
    complications?: string;
    notes?: string;
}

export interface Hospitalization {
    id: string;
    reason: string;
    admissionDate: Date;
    dischargeDate: Date;
    hospital: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
}

export interface FamilyHistory {
    id: string;
    relation: 'parent' | 'sibling' | 'grandparent' | 'aunt-uncle' | 'cousin' | 'other';
    condition: string;
    ageOfOnset?: number;
    notes?: string;
}

export interface Vaccination {
    id: string;
    vaccine: string;
    date: Date;
    provider: string;
    batchNumber?: string;
    nextDue?: Date;
    notes?: string;
}

export interface LabResult {
    id: string;
    testName: string;
    date: Date;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
    provider: string;
    notes?: string;
}

export interface Allergy {
    id: string;
    allergen: string;
    type: 'drug' | 'food' | 'environmental' | 'other';
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
    symptoms: string[];
    firstOccurrence?: Date;
    lastOccurrence?: Date;
    treatment?: string;
    notes?: string;
}

export interface CurrentMedication {
    id: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'other';
    startDate: Date;
    endDate?: Date;
    prescribedBy: string;
    indication: string;
    sideEffects?: string[];
    adherence?: number; // percentage
    notes?: string;
}

export interface ChronicCondition {
    id: string;
    condition: string;
    diagnosisDate: Date;
    diagnosedBy: string;
    severity: 'mild' | 'moderate' | 'severe';
    status: 'active' | 'controlled' | 'remission' | 'resolved';
    medications: string[];
    lastCheckup?: Date;
    nextCheckup?: Date;
    notes?: string;
}

export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    isPrimary: boolean;
}

export interface HealthGoal {
    id: string;
    title: string;
    description: string;
    category: 'weight' | 'exercise' | 'medication' | 'nutrition' | 'lifestyle' | 'other';
    targetValue?: number;
    currentValue?: number;
    unit?: string;
    targetDate?: Date;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    progress: number; // percentage
    milestones: HealthMilestone[];
    createdAt: Date;
}

export interface HealthMilestone {
    id: string;
    title: string;
    date: Date;
    value?: number;
    notes?: string;
    achieved: boolean;
}

export interface HealthPreferences {
    reminderSettings: {
        medicationReminders: boolean;
        appointmentReminders: boolean;
        healthTips: boolean;
        goalReminders: boolean;
    };
    privacySettings: {
        shareWithDoctors: boolean;
        shareWithPharmacies: boolean;
        allowResearch: boolean;
        allowMarketing: boolean;
    };
    communicationPreferences: {
        preferredLanguage: 'en' | 'ar';
        preferredContactMethod: 'email' | 'sms' | 'phone' | 'app';
        timeZone: string;
    };
    healthDataSharing: {
        emergencyAccess: boolean;
        familyAccess: boolean;
        doctorAccess: boolean;
        pharmacyAccess: boolean;
    };
}

// Cart Types
export interface CartItem {
    id: string;
    productId: number;
    name: string;
    nameAr: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    pharmacy: string;
    pharmacyId: string;
    cityId: string;
    cityName: string;
    image: string;
    prescription: boolean;
    inStock: boolean;
    category: string;
    manufacturer: string;
    activeIngredient: string;
    dosage?: string;
    packSize: string;
    deliveryFee: number;
    estimatedDeliveryTime: string;
    maxQuantity?: number;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    appliedPromo?: PromoCode;
    prescriptionMetadata?: Record<string, any>;
}

export interface PromoCode {
    id: string;
    name: string;
    code: string;
    discount: number; // percentage (0.1 = 10%)
    description: string;
    minOrderAmount?: number;
    maxDiscount?: number;
    validUntil?: Date;
    status: 'active' | 'expired';
    redemptions: number;
}

// Wallet Types
export interface Wallet {
    id: string;
    customerId: string;
    balance: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface WalletTransaction {
    id: string;
    walletId: string;
    customerId: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    reference?: string; // Order ID, Return ID, etc.
    referenceType?: 'order' | 'return' | 'refund' | 'topup' | 'withdrawal';
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    createdAt: Date;
    processedAt?: Date;
    metadata?: Record<string, any>;
}

export interface WalletBalance {
    available: number;
    pending: number;
    total: number;
    currency: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Form Types
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    city: string;
}

export interface PharmacyRegistrationForm {
    nameEn: string;
    nameAr: string;
    email: string;
    password: string;
    phone: string;
    whatsappNumber: string;
    city: string;
    commission: number;
    workingHours: {
        open: string;
        close: string;
    };
}
