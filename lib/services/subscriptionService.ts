import { Subscription, SubscriptionProduct, Product } from '@/lib/types';
import { products } from '@/lib/data/products';

export interface SubscriptionPlan {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    type: 'standard' | 'premium';
    minOrderValue: number;
    features: string[];
    featuresAr: string[];
    monthlyFee: number; // Monthly subscription fee in EGP
    orderDiscount: number; // Fixed discount amount per order in EGP
    medicineDiscount: number; // Discount per medicine in EGP
    isPopular?: boolean;
}

export interface CreateSubscriptionData {
    customerId: string;
    products: SubscriptionProduct[];
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
    deliveryAddress: string;
    deliveryInstructions?: string;
    startDate?: Date;
}

export interface SubscriptionAnalytics {
    totalSubscriptions: number;
    activeSubscriptions: number;
    pausedSubscriptions: number;
    cancelledSubscriptions: number;
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageOrderValue: number;
    customerRetentionRate: number;
    churnRate: number;
    popularProducts: Array<{
        productId: string;
        name: string;
        subscriptionCount: number;
        revenue: number;
    }>;
    frequencyBreakdown: Record<string, number>;
    upcomingDeliveries: number;
}

class SubscriptionService {
    private subscriptions: Subscription[] = [];
    private subscriptionPlans: SubscriptionPlan[] = [];

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        // Initialize subscription plans
        this.subscriptionPlans = [
            {
                id: 'standard-plan',
                name: 'Standard Subscription',
                nameAr: 'الاشتراك العادي',
                description:
                    'Monthly medicine delivery with fixed discount - prices may vary based on current medicine costs',
                descriptionAr:
                    'توصيل شهري للأدوية مع خصم ثابت - قد تتغير الأسعار حسب تكلفة الأدوية الحالية',
                type: 'standard',
                minOrderValue: 50,
                monthlyFee: 25,
                orderDiscount: 5, // 5 EGP discount per order
                medicineDiscount: 2, // 2 EGP discount per medicine
                features: [
                    'Monthly delivery',
                    '5 EGP discount per order',
                    'Free delivery',
                    'Medicine availability guarantee',
                    'Alternative medicine consultation',
                    'Customer support',
                    'Dynamic pricing based on current medicine costs',
                ],
                featuresAr: [
                    'توصيل شهري',
                    'خصم 5 جنيه على كل طلب',
                    'توصيل مجاني',
                    'ضمان توفر الأدوية',
                    'استشارة الأدوية البديلة',
                    'دعم العملاء',
                    'أسعار ديناميكية حسب تكلفة الأدوية الحالية',
                ],
            },
            {
                id: 'premium-plan',
                name: 'Premium Subscription',
                nameAr: 'الاشتراك المميز',
                description:
                    'Premium monthly medicine delivery with higher discount - prices may vary based on current medicine costs',
                descriptionAr:
                    'توصيل شهري مميز للأدوية مع خصم أعلى - قد تتغير الأسعار حسب تكلفة الأدوية الحالية',
                type: 'premium',
                minOrderValue: 100,
                monthlyFee: 35,
                orderDiscount: 10, // 10 EGP discount per order
                medicineDiscount: 5, // 5 EGP discount per medicine
                isPopular: true,
                features: [
                    'Monthly delivery',
                    '10 EGP discount per order',
                    'Free delivery',
                    'Medicine availability guarantee',
                    'Alternative medicine consultation',
                    'Priority customer support',
                    'Health consultations',
                    'Medicine reminders',
                    'Chronic disease management',
                    'Dynamic pricing based on current medicine costs',
                    'Price protection for 3 months',
                ],
                featuresAr: [
                    'توصيل شهري',
                    'خصم 10 جنيه على كل طلب',
                    'توصيل مجاني',
                    'ضمان توفر الأدوية',
                    'استشارة الأدوية البديلة',
                    'دعم عملاء أولوية',
                    'استشارات صحية',
                    'تذكير بالأدوية',
                    'إدارة الأمراض المزمنة',
                    'أسعار ديناميكية حسب تكلفة الأدوية الحالية',
                    'حماية السعر لمدة 3 أشهر',
                ],
            },
        ];

        // Initialize mock subscriptions with current dates
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        const inTwoDays = new Date(today);
        inTwoDays.setDate(today.getDate() + 2);

        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 14);

        this.subscriptions = [
            {
                id: 'SUB-001',
                customerId: 'customer-001',
                products: [
                    {
                        productId: '1',
                        pharmacyId: 'healthplus-ismailia',
                        quantity: 2,
                        unitType: 'box',
                    },
                    {
                        productId: '2',
                        pharmacyId: 'wellcare-ismailia',
                        quantity: 1,
                        unitType: 'box',
                    },
                ],
                frequency: 'monthly',
                nextDelivery: nextMonth,
                isActive: true,
                totalAmount: 95.0,
                createdAt: lastMonth,
                deliveryAddress: '123 Main St, Ismailia, Egypt',
                deliveryInstructions: 'Leave at front door',
                planId: 'premium-plan',
                discount: 12,
                status: 'active',
                deliveryHistory: [
                    {
                        id: 'DEL-001',
                        deliveryDate: lastMonth,
                        status: 'delivered',
                        trackingNumber: 'TRK-001',
                        deliveredBy: 'Ahmed Hassan',
                    },
                ],
            },
            {
                id: 'SUB-002',
                customerId: 'customer-001',
                products: [
                    {
                        productId: '2',
                        pharmacyId: 'wellcare-ismailia',
                        quantity: 2,
                        unitType: 'box',
                    },
                ],
                frequency: 'monthly',
                nextDelivery: inTwoDays,
                isActive: true,
                totalAmount: 41.4, // 45 * 0.92 (8% discount)
                createdAt: twoWeeksAgo,
                deliveryAddress: '123 Main St, Ismailia, Egypt',
                planId: 'standard-plan',
                discount: 8,
                status: 'active',
                deliveryHistory: [
                    {
                        id: 'DEL-002',
                        deliveryDate: twoWeeksAgo,
                        status: 'delivered',
                        trackingNumber: 'TRK-002',
                        deliveredBy: 'Mohamed Ali',
                    },
                ],
            },
            {
                id: 'SUB-003',
                customerId: 'customer-002',
                products: [
                    {
                        productId: '4',
                        pharmacyId: 'medicare-cairo',
                        quantity: 1,
                        unitType: 'box',
                    },
                ],
                frequency: 'monthly',
                nextDelivery: nextWeek,
                isActive: false,
                totalAmount: 57.2, // 65 * 0.88 (12% discount)
                createdAt: lastMonth,
                deliveryAddress: '456 Nile St, Cairo, Egypt',
                planId: 'premium-plan',
                discount: 12,
                status: 'paused',
                pauseReason: 'Temporary travel',
                pausedUntil: nextMonth,
                deliveryHistory: [],
            },
        ];
    }

    // Subscription Plans
    getSubscriptionPlans(): SubscriptionPlan[] {
        return this.subscriptionPlans;
    }

    getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
        return this.subscriptionPlans.find((plan) => plan.id === planId);
    }

    // Create Subscription
    async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
        console.log('Creating subscription with data:', data);

        const newSubscription: Subscription = {
            id: `SUB-${String(this.subscriptions.length + 1).padStart(3, '0')}`,
            customerId: data.customerId,
            products: data.products,
            frequency: data.frequency,
            nextDelivery: data.startDate || this.calculateNextDelivery(data.frequency),
            isActive: true,
            totalAmount: this.calculateSubscriptionTotal(data.products, data.frequency),
            createdAt: new Date(),
            deliveryAddress: data.deliveryAddress,
            deliveryInstructions: data.deliveryInstructions,
            status: 'active',
            deliveryHistory: [],
        };

        // Add plan details if applicable
        const plan = this.getRecommendedPlan(newSubscription.totalAmount, data.frequency);
        if (plan) {
            newSubscription.planId = plan.id;
            newSubscription.discount = plan.orderDiscount;
            // Apply order discount
            newSubscription.totalAmount = Math.max(
                0,
                newSubscription.totalAmount - plan.orderDiscount + plan.monthlyFee,
            );
        }

        console.log('New subscription created:', newSubscription);
        this.subscriptions.push(newSubscription);
        console.log('Total subscriptions after creation:', this.subscriptions.length);
        console.log(
            'All subscriptions:',
            this.subscriptions.map((s) => ({
                id: s.id,
                customerId: s.customerId,
                status: s.status,
            })),
        );

        return newSubscription;
    }

    // Get Subscriptions
    getCustomerSubscriptions(customerId: string): Subscription[] {
        console.log('Getting subscriptions for customer:', customerId);
        console.log(
            'All subscriptions:',
            this.subscriptions.map((s) => ({
                id: s.id,
                customerId: s.customerId,
                status: s.status,
            })),
        );
        const customerSubs = this.subscriptions.filter((sub) => sub.customerId === customerId);
        console.log(
            'Customer subscriptions found:',
            customerSubs.map((s) => ({ id: s.id, status: s.status })),
        );
        return customerSubs;
    }

    getActiveSubscriptions(customerId: string): Subscription[] {
        return this.subscriptions.filter(
            (sub) => sub.customerId === customerId && sub.isActive && sub.status === 'active',
        );
    }

    getAllSubscriptions(): Subscription[] {
        return this.subscriptions;
    }

    getSubscription(subscriptionId: string): Subscription | undefined {
        return this.subscriptions.find((sub) => sub.id === subscriptionId);
    }

    // Update Subscription
    async updateSubscription(
        subscriptionId: string,
        updates: Partial<Subscription>,
    ): Promise<Subscription | null> {
        const index = this.subscriptions.findIndex((sub) => sub.id === subscriptionId);
        if (index === -1) return null;

        this.subscriptions[index] = {
            ...this.subscriptions[index],
            ...updates,
            updatedAt: new Date(),
        };

        // Recalculate total if products or frequency changed
        if (updates.products || updates.frequency) {
            const subscription = this.subscriptions[index];
            subscription.totalAmount = this.calculateSubscriptionTotal(
                subscription.products,
                subscription.frequency,
            );

            // Apply plan discount
            if (subscription.planId) {
                const plan = this.getSubscriptionPlan(subscription.planId);
                if (plan) {
                    subscription.totalAmount = Math.max(
                        0,
                        subscription.totalAmount - plan.orderDiscount + plan.monthlyFee,
                    );
                }
            }
        }

        return this.subscriptions[index];
    }

    // Pause/Resume Subscription
    async pauseSubscription(
        subscriptionId: string,
        reason?: string,
        pauseUntil?: Date,
    ): Promise<boolean> {
        const subscription = this.getSubscription(subscriptionId);
        if (!subscription) return false;

        subscription.status = 'paused';
        subscription.pauseReason = reason;
        subscription.pausedUntil = pauseUntil;
        subscription.updatedAt = new Date();

        return true;
    }

    async resumeSubscription(subscriptionId: string): Promise<boolean> {
        const subscription = this.getSubscription(subscriptionId);
        if (!subscription) return false;

        subscription.status = 'active';
        subscription.pauseReason = undefined;
        subscription.pausedUntil = undefined;
        subscription.nextDelivery = this.calculateNextDelivery(subscription.frequency);
        subscription.updatedAt = new Date();

        return true;
    }

    // Cancel Subscription
    async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
        const subscription = this.getSubscription(subscriptionId);
        if (!subscription) return false;

        subscription.isActive = false;
        subscription.status = 'cancelled';
        subscription.cancelReason = reason;
        subscription.cancelledAt = new Date();
        subscription.updatedAt = new Date();

        return true;
    }

    // Delivery Management
    getUpcomingDeliveries(customerId?: string): Subscription[] {
        let subscriptions = this.subscriptions.filter(
            (sub) => sub.isActive && sub.status === 'active',
        );

        if (customerId) {
            subscriptions = subscriptions.filter((sub) => sub.customerId === customerId);
        }

        return subscriptions
            .filter((sub) => sub.nextDelivery && sub.nextDelivery > new Date())
            .sort((a, b) => a.nextDelivery!.getTime() - b.nextDelivery!.getTime());
    }

    async processDelivery(
        subscriptionId: string,
        deliveryData: {
            trackingNumber?: string;
            deliveredBy?: string;
            deliveryNotes?: string;
        },
    ): Promise<boolean> {
        const subscription = this.getSubscription(subscriptionId);
        if (!subscription) return false;

        // Add to delivery history
        const delivery = {
            id: `DEL-${Date.now()}`,
            deliveryDate: new Date(),
            status: 'delivered' as const,
            trackingNumber: deliveryData.trackingNumber,
            deliveredBy: deliveryData.deliveredBy,
            notes: deliveryData.deliveryNotes,
        };

        if (!subscription.deliveryHistory) {
            subscription.deliveryHistory = [];
        }
        subscription.deliveryHistory.push(delivery);

        // Calculate next delivery
        subscription.nextDelivery = this.calculateNextDelivery(subscription.frequency);
        subscription.updatedAt = new Date();

        return true;
    }

    // Analytics
    getSubscriptionAnalytics(): SubscriptionAnalytics {
        const activeSubscriptions = this.subscriptions.filter((sub) => sub.isActive);
        const pausedSubscriptions = this.subscriptions.filter((sub) => sub.status === 'paused');
        const cancelledSubscriptions = this.subscriptions.filter(
            (sub) => sub.status === 'cancelled',
        );

        const totalRevenue = this.subscriptions.reduce((sum, sub) => sum + sub.totalAmount, 0);
        const monthlyRevenue = activeSubscriptions
            .filter((sub) => sub.frequency === 'monthly')
            .reduce((sum, sub) => sum + sub.totalAmount, 0);

        const frequencyBreakdown = this.subscriptions.reduce(
            (acc, sub) => {
                acc[sub.frequency] = (acc[sub.frequency] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        // Calculate popular products
        const productCounts = new Map<string, { count: number; revenue: number; name: string }>();
        this.subscriptions.forEach((sub) => {
            sub.products.forEach((product) => {
                const productData = products.find((p) => p.id.toString() === product.productId);
                if (productData) {
                    const existing = productCounts.get(product.productId) || {
                        count: 0,
                        revenue: 0,
                        name: productData.name,
                    };
                    existing.count += product.quantity;
                    existing.revenue += productData.price * product.quantity;
                    existing.name = productData.name;
                    productCounts.set(product.productId, existing);
                }
            });
        });

        const popularProducts = Array.from(productCounts.entries())
            .map(([productId, data]) => ({
                productId,
                name: data.name,
                subscriptionCount: data.count,
                revenue: data.revenue,
            }))
            .sort((a, b) => b.subscriptionCount - a.subscriptionCount)
            .slice(0, 5);

        return {
            totalSubscriptions: this.subscriptions.length,
            activeSubscriptions: activeSubscriptions.length,
            pausedSubscriptions: pausedSubscriptions.length,
            cancelledSubscriptions: cancelledSubscriptions.length,
            totalRevenue,
            monthlyRecurringRevenue: monthlyRevenue,
            averageOrderValue: totalRevenue / this.subscriptions.length || 0,
            customerRetentionRate: 85.5,
            churnRate: 14.5,
            popularProducts,
            frequencyBreakdown,
            upcomingDeliveries: this.getUpcomingDeliveries().length,
        };
    }

    // Helper Methods
    private calculateSubscriptionTotal(
        subscriptionProducts: SubscriptionProduct[],
        frequency: string,
    ): number {
        return subscriptionProducts.reduce((total, product) => {
            const productData = products.find((p) => p.id.toString() === product.productId);
            return total + (productData?.price || 0) * product.quantity;
        }, 0);
    }

    private calculateNextDelivery(frequency: string, fromDate: Date = new Date()): Date {
        const nextDelivery = new Date(fromDate);

        switch (frequency) {
            case 'weekly':
                nextDelivery.setDate(nextDelivery.getDate() + 7);
                break;
            case 'bi-weekly':
                nextDelivery.setDate(nextDelivery.getDate() + 14);
                break;
            case 'monthly':
                nextDelivery.setMonth(nextDelivery.getMonth() + 1);
                break;
            case 'quarterly':
                nextDelivery.setMonth(nextDelivery.getMonth() + 3);
                break;
        }

        return nextDelivery;
    }

    private getRecommendedPlan(
        orderValue: number,
        frequency: string,
    ): SubscriptionPlan | undefined {
        return this.subscriptionPlans.find((plan) => orderValue >= plan.minOrderValue);
    }

    // Product Recommendations
    getRecommendedProducts(customerId: string): Product[] {
        const customerSubscriptions = this.getCustomerSubscriptions(customerId);
        const subscribedProductIds = new Set(
            customerSubscriptions.flatMap((sub) => sub.products.map((p) => p.productId)),
        );

        // Get products from same categories as subscribed products
        const subscribedProducts = products.filter((p) =>
            subscribedProductIds.has(p.id.toString()),
        );

        const categories = [...new Set(subscribedProducts.map((p) => p.category))];

        return products
            .filter(
                (p) =>
                    categories.includes(p.category) &&
                    !subscribedProductIds.has(p.id.toString()) &&
                    p.availability.inStock,
            )
            .slice(0, 6);
    }

    // Subscription Conversion
    convertCartToSubscription(cartItems: any[], frequency: string): CreateSubscriptionData {
        const products: SubscriptionProduct[] = cartItems.map((item) => ({
            productId: item.productId.toString(),
            pharmacyId: item.pharmacyId,
            quantity: item.quantity,
            unitType: 'box',
        }));

        return {
            customerId: 'customer-001', // This would come from auth context
            products,
            frequency: frequency as any,
            deliveryAddress: '', // This would be filled by user
        };
    }

    // Debug method to test subscription creation
    debugCreateTestSubscription(customerId: string): Subscription {
        console.log('Creating test subscription for customer:', customerId);
        const testData: CreateSubscriptionData = {
            customerId,
            products: [
                {
                    productId: '1',
                    pharmacyId: 'healthplus-ismailia',
                    quantity: 1,
                    unitType: 'box',
                },
            ],
            frequency: 'monthly',
            deliveryAddress: 'Test Address',
        };

        const subscription = this.createSubscription(testData);
        console.log('Test subscription created:', subscription);
        return subscription as any; // Cast to avoid async issues in debug
    }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
