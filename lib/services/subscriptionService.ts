import { Subscription, SubscriptionProduct, Product } from '@/lib/types';
import { filterProducts } from '@/lib/data/products';
import { getAuthToken } from '@/lib/utils/cookies';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SUBSCRIPTIONS_ENDPOINT = `${API_BASE_URL}/subscriptions`;

// Helper function for API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    if(!token){
        console.log('no token')
    }
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

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
    // Helper method to get current user ID
    private async getCurrentUserId(): Promise<string | null> {
        try {
            const response = await apiRequest(`${API_BASE_URL}/auth/me`);
            return response.data?.user?._id || null;
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    }

    // Subscription Plans
    async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        try {
            const response = await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/plans`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            return [];
        }
    }

    async getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | undefined> {
        try {
            const response = await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/plans/${planId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription plan:', error);
            return undefined;
        }
    }

    // Create Subscription
    async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
        console.log('Creating subscription with data:', data);

        try {
            // Get current user ID if not provided
            if (!data.customerId) {
                const userId = await this.getCurrentUserId();
                if (!userId) {
                    throw new Error('Unable to get current user ID');
                }
                data.customerId = userId;
            }

            const response = await apiRequest(SUBSCRIPTIONS_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(data),
            });

            console.log('New subscription created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    // Get Subscriptions
    async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
        console.log('Getting subscriptions for customer:', customerId);
        
        try {
            const response = await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/customer/${customerId}`);
            console.log('Customer subscriptions found:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer subscriptions:', error);
            return [];
        }
    }

    async getActiveSubscriptions(customerId: string): Promise<Subscription[]> {
        try {
            const response = await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/customer/${customerId}/active`);
            return response.data;
        } catch (error) {
            console.error('Error fetching active subscriptions:', error);
            return [];
        }
    }

    async getAllSubscriptions(): Promise<Subscription[]> {
        try {
            const response = await apiRequest(SUBSCRIPTIONS_ENDPOINT);
            return response.data;
        } catch (error) {
            console.error('Error fetching all subscriptions:', error);
            return [];
        }
    }

    async getSubscription(subscriptionId: string): Promise<Subscription | undefined> {
        try {
            const response = await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/${subscriptionId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription:', error);
            return undefined;
        }
    }

    // Update Subscription
    async updateSubscription(
        subscriptionId: string,
        updates: Partial<Subscription>,
    ): Promise<Subscription | null> {
        try {
            const response = await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/${subscriptionId}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            return response.data;
        } catch (error) {
            console.error('Error updating subscription:', error);
            return null;
        }
    }

    // Pause/Resume Subscription
    async pauseSubscription(
        subscriptionId: string,
        reason?: string,
        pauseUntil?: Date,
    ): Promise<boolean> {
        try {
            await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/${subscriptionId}/pause`, {
                method: 'POST',
                body: JSON.stringify({ reason, pauseUntil }),
            });
            return true;
        } catch (error) {
            console.error('Error pausing subscription:', error);
            return false;
        }
    }

    async resumeSubscription(subscriptionId: string): Promise<boolean> {
        try {
            await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/${subscriptionId}/resume`, {
                method: 'POST',
            });
            return true;
        } catch (error) {
            console.error('Error resuming subscription:', error);
            return false;
        }
    }

    // Cancel Subscription
    async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
        try {
            await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/${subscriptionId}/cancel`, {
                method: 'POST',
                body: JSON.stringify({ reason }),
            });
            return true;
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            return false;
        }
    }

    // Delivery Management
    async getUpcomingDeliveries(customerId?: string): Promise<Subscription[]> {
        try {
            const url = customerId 
                ? `${SUBSCRIPTIONS_ENDPOINT}/deliveries/upcoming?customerId=${customerId}`
                : `${SUBSCRIPTIONS_ENDPOINT}/deliveries/upcoming`;
            
            const response = await apiRequest(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming deliveries:', error);
            return [];
        }
    }

    async processDelivery(
        subscriptionId: string,
        deliveryData: {
            trackingNumber?: string;
            deliveredBy?: string;
            deliveryNotes?: string;
        },
    ): Promise<boolean> {
        try {
            await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/${subscriptionId}/delivery`, {
                method: 'POST',
                body: JSON.stringify(deliveryData),
            });
            return true;
        } catch (error) {
            console.error('Error processing delivery:', error);
            return false;
        }
    }

    // Analytics
    async getSubscriptionAnalytics(): Promise<SubscriptionAnalytics> {
        try {
            const response = await apiRequest(`${SUBSCRIPTIONS_ENDPOINT}/analytics/overview`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription analytics:', error);
            // Return default analytics on error
            return {
                totalSubscriptions: 0,
                activeSubscriptions: 0,
                pausedSubscriptions: 0,
                cancelledSubscriptions: 0,
                totalRevenue: 0,
                monthlyRecurringRevenue: 0,
                averageOrderValue: 0,
                customerRetentionRate: 0,
                churnRate: 0,
                popularProducts: [],
                frequencyBreakdown: {},
                upcomingDeliveries: 0,
            };
        }
    }

    // Helper Methods
    private async calculateSubscriptionTotal(
        subscriptionProducts: SubscriptionProduct[],
        frequency: string,
    ): Promise<number> {
        try {
            // Get product prices from the products API
            const productPromises = subscriptionProducts.map(async (product) => {
                const products = await filterProducts({
                    page: 1,
                    limit: 1,
                });
                const productData = products.products.find((p) => p._id.toString() === product.productId);
                return (productData?.price || 0) * product.quantity;
            });

            const amounts = await Promise.all(productPromises);
            return amounts.reduce((total, amount) => total + amount, 0);
        } catch (error) {
            console.error('Error calculating subscription total:', error);
            return 0;
        }
    }

    // Product Recommendations
    async getRecommendedProducts(customerId: string): Promise<any[]> {
        try {
            const customerSubscriptions = await this.getCustomerSubscriptions(customerId);
            const subscribedProductIds = customerSubscriptions.flatMap((sub) => sub.products.map((p) => p.productId));

            // Get products from the products API
            const productsResponse = await filterProducts({
                page: 1,
                limit: 50,
            });
            const products = productsResponse.products;

            // Get products from same categories as subscribed products
            const subscribedProducts = products.filter((p) =>
                subscribedProductIds.includes(p._id.toString()),
            );

            const categories = Array.from(new Set(subscribedProducts.map((p) => p.category)));

            return products
                .filter(
                    (p) =>
                        categories.includes(p.category) &&
                        !subscribedProductIds.includes(p._id.toString()) &&
                        p.availability?.inStock,
                )
                .slice(0, 6);
        } catch (error) {
            console.error('Error getting recommended products:', error);
            return [];
        }
    }

    // Subscription Conversion
    async convertCartToSubscription(cartItems: any[], frequency: string): Promise<CreateSubscriptionData> {
        const products: SubscriptionProduct[] = cartItems.map((item) => ({
            productId: item.productId.toString(),
            quantity: item.quantity,
            unitType: 'box',
        }));

        // Get current user ID
        const customerId = await this.getCurrentUserId();
        if (!customerId) {
            throw new Error('Unable to get current user ID');
        }

        return {
            customerId,
            products,
            frequency: frequency as any,
            deliveryAddress: '', // This would be filled by user
        };
    }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
