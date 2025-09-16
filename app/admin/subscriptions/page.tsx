'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Package } from 'lucide-react';
import { getAuthToken } from '@/lib/utils/cookies';
import { apiRequest, API_ENDPOINTS } from '@/lib/config/api';
import { pharmacyManagementService } from '@/lib/services/pharmacyManagementService';
import { Subscription as BackendSubscription } from '@/lib/types';
import { SubscriptionDetailsModal } from '@/components/admin/SubscriptionDetailsModal';
import { EnhancedPharmacySelector } from '@/components/admin/EnhancedPharmacySelector';

interface Subscription {
    id: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    products: {
        productId: string;
        pharmacyId: string;
        quantity: number;
        unitType: string;
        productName?: string;
        productNameAr?: string;
        pricePerBox?: number;
        images?: string[];
        manufacturer?: string;
        category?: string;
    }[];
    frequency: string;
    nextDelivery: Date;
    isActive: boolean;
    totalAmount: number;
    deliveryAddress: string;
    status: string;
    planId?: string;
    createdAt: Date;
    deliveryHistory: any[];
}

interface OrderPlacementModal {
    subscription: Subscription | null;
    isOpen: boolean;
}

interface DetailsModal {
    subscription: Subscription | null;
    isOpen: boolean;
}

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>(
        'all',
    );
    const [orderModal, setOrderModal] = useState<OrderPlacementModal>({
        subscription: null,
        isOpen: false,
    });
    const [detailsModal, setDetailsModal] = useState<DetailsModal>({
        subscription: null,
        isOpen: false,
    });
    const [orderNotes, setOrderNotes] = useState('');
    const [placingOrder, setPlacingOrder] = useState(false);
    const [deliveryType, setDeliveryType] = useState<'customer' | 'custom'>('customer');
    const [customAddress, setCustomAddress] = useState('');
    const [productPharmacies, setProductPharmacies] = useState<Record<string, {
        pharmacyId: string;
        pharmacyName: string;
        price: number;
        total?: number;
    }>>({});
    const [pharmacies, setPharmacies] = useState<{
        id: string;
        name: string;
        address: string;
        phone: string;
        cityName: string;
        deliveryTime: string;
        deliveryFee: number;
        isActive: boolean;
        workingHours: { open: string; close: string; is24Hours: boolean };
        specialties?: string[];
        isVerified?: boolean;
        email?: string;
        inventory?: Array<{
            productId: string;
            productName: string;
            price: number;
            inStock: boolean;
            stockQuantity: number;
        }>;
        productStatistics?: {
            Inventory?: Array<{
                productId: {
                    _id: string;
                    name: string;
                    nameAr: string;
                    images: string[];
                    pricePerBox: number;
                    manufacturer: string;
                    category: string;
                };
                inStock: boolean;
                stockQuantity: number;
                price: number;
            }>;
        };
    }[]>([]);
    const [loadingPharmacies, setLoadingPharmacies] = useState(false);

    useEffect(() => {
        loadSubscriptions();
        loadPharmacies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Use useMemo to filter subscriptions instead of useEffect to avoid render warnings
    const filteredSubscriptions = useMemo(() => {
        let filtered = subscriptions;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (sub) =>
                    sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.customerPhone.includes(searchTerm),
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((sub) => sub.status === statusFilter);
        }

        return filtered;
    }, [subscriptions, searchTerm, statusFilter]);

    const calculateNextDelivery = (frequency: string, lastDelivery?: Date) => {
        const baseDate = lastDelivery || new Date();
        const nextDelivery = new Date(baseDate);

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
            default:
                nextDelivery.setMonth(nextDelivery.getMonth() + 1);
        }

        return nextDelivery;
    };

    const loadSubscriptions = async () => {
        try {
            setLoading(true);

            // Get auth token for authorization
            const token = getAuthToken();

            // Fetch subscriptions from backend API using centralized API config
            const apiResponse = await apiRequest(API_ENDPOINTS.ADMIN.SUBSCRIPTIONS, {
                method: 'GET',
            });

            console.log('API Response:', apiResponse);

            const backendSubscriptions: BackendSubscription[] = apiResponse.data || apiResponse;

            console.log('Backend subscriptions:', backendSubscriptions);
            console.log('Number of subscriptions:', backendSubscriptions.length);

            // Debug customer data structure
            if (backendSubscriptions.length > 0) {
                console.log('First subscription customerId structure:', backendSubscriptions[0].customerId);
                console.log('First subscription raw data:', backendSubscriptions[0]);
            }

            // Transform backend subscriptions to match frontend interface
            const transformedSubscriptions = backendSubscriptions.map((sub: any) => {
                // Calculate accurate next delivery based on frequency and last delivery
                const lastDeliveryDate =
                    sub.deliveryHistory && sub.deliveryHistory.length > 0
                        ? new Date(sub.deliveryHistory[sub.deliveryHistory.length - 1].deliveryDate)
                        : new Date(sub.createdAt);

                const accurateNextDelivery = calculateNextDelivery(sub.frequency, lastDeliveryDate);

                // Debug the customer data for this subscription
                console.log('Processing subscription:', sub._id);
                console.log('Customer ID object:', sub.customerId);
                console.log('Customer name from object:', sub.customerId?.name);
                console.log('Customer phone from object:', sub.customerId?.phone);

                return {
                    id: sub._id || sub.id || '',
                    customerId: sub.customerId?._id || sub.customerId || '',
                    customerName: sub.customerId?.name || sub.customerName || 'Unknown Customer',
                    customerPhone: sub.customerId?.phone || sub.customerPhone || '',
                    products: sub.products?.map((p: any) => ({
                        productId: typeof p.productId === 'string' ? p.productId : String(p.productId._id || p.productId.id || ''),
                        pharmacyId: p.pharmacyId || '',
                        quantity: p.quantity || 1,
                        unitType: p.unitType || 'box',
                        // Extract populated product data if available
                        productName: typeof p.productId === 'object' ? p.productId.name : undefined,
                        productNameAr: typeof p.productId === 'object' ? p.productId.nameAr : undefined,
                        pricePerBox: typeof p.productId === 'object' ? p.productId.pricePerBox : undefined,
                        images: typeof p.productId === 'object' ? p.productId.images : undefined,
                        manufacturer: typeof p.productId === 'object' ? p.productId.manufacturer : undefined,
                        category: typeof p.productId === 'object' ? p.productId.category : undefined,
                    })) || [],
                    frequency: sub.frequency,
                    nextDelivery: accurateNextDelivery,
                    isActive: sub.isActive,
                    totalAmount: sub.totalAmount,
                    deliveryAddress: sub.deliveryAddress,
                    status: sub.status,
                    planId: sub.planId,
                    createdAt: new Date(sub.createdAt),
                    deliveryHistory: sub.deliveryHistory || [],
                };
            });

            // Sort by next delivery date (closest first)
            transformedSubscriptions.sort(
                (a, b) => new Date(a.nextDelivery).getTime() - new Date(b.nextDelivery).getTime(),
            );

            console.log('Transformed subscriptions:', transformedSubscriptions);
            console.log('Setting subscriptions state...');
            setSubscriptions(transformedSubscriptions);
        } catch (error) {
            console.error('Error loading subscriptions:', error);
            // Show empty state with error message instead of mock data
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    const loadPharmacies = async () => {
        try {
            setLoadingPharmacies(true);
            const response = await pharmacyManagementService.getPharmacies();
            console.log('Pharmacies loaded:', response.data);

            // Transform PharmacyDetails to match EnhancedPharmacySelector interface
            const transformedPharmacies = response.data.map(pharmacy => ({
                id: pharmacy.id,
                name: pharmacy.name,
                address: pharmacy.address,
                phone: pharmacy.phone,
                cityName: pharmacy.cityName,
                deliveryTime: '30-45 mins',
                deliveryFee: 0,
                isActive: pharmacy.isActive, // Use the actual isActive field from backend
                workingHours: { open: '09:00', close: '21:00', is24Hours: false },
                specialties: pharmacy.specialties || [],
                isVerified: pharmacy.isVerified, // Use the actual isVerified field from backend
                email: pharmacy.email,
                inventory: pharmacy.inventory || [], // Include inventory data
                productStatistics: (pharmacy as any).productStatistics || { Inventory: [] } // Include product statistics with inventory
            }));

            setPharmacies(transformedPharmacies);
        } catch (error) {
            console.error('Error loading pharmacies:', error);
            setPharmacies([]);
        } finally {
            setLoadingPharmacies(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!orderModal.subscription) return;

        // Validate that all products have pharmacies selected
        const allProductsHavePharmacies = orderModal.subscription.products.every(
            (product, index) => productPharmacies[`${product.productId}-${index}`],
        );

        if (!allProductsHavePharmacies) {
            alert('Please select a pharmacy for each product.');
            return;
        }

        // Validate delivery address
        if (deliveryType === 'custom' && !customAddress.trim()) {
            alert('Please enter a custom delivery address.');
            return;
        }

        setPlacingOrder(true);
        try {
            // Prepare pharmacy selections for backend
            const pharmacySelections: Record<string, any> = {};
            let orderTotalAmount = 0;
            orderModal.subscription.products.forEach((product, index) => {
                const productKey = `${product.productId}-${index}`;
                const selection = productPharmacies[productKey];
                if (selection) {
                    const totalPrice = selection.total || (selection.price * product.quantity);
                    pharmacySelections[productKey] = {
                        pharmacyId: selection.pharmacyId,
                        pharmacyName: selection.pharmacyName,
                        unitPrice: selection.price,
                        totalPrice: totalPrice
                    };
                    orderTotalAmount += totalPrice;
                }
            });

            // Prepare delivery address
            const finalDeliveryAddress = deliveryType === 'customer'
                ? orderModal.subscription.deliveryAddress
                : customAddress;

            console.log('Sending pharmacy selections to backend:', pharmacySelections);
            console.log('Pharmacy selections keys:', Object.keys(pharmacySelections));
            console.log('Product pharmacies state:', productPharmacies);
            console.log('Order modal subscription products:', orderModal.subscription.products);
            console.log('Calculated order total amount:', orderTotalAmount);

            // Make API call to place order
            const response = await apiRequest(`/admin/placeOrder/${orderModal.subscription.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    pharmacySelections,
                    deliveryAddress: finalDeliveryAddress,
                    notes: orderNotes
                })
            });

            if (response.success) {
                // Update subscription's next delivery date from server response
                const updatedSubscriptions = subscriptions.map((sub) => {
                    if (sub.id === orderModal.subscription!.id) {
                        return {
                            ...sub,
                            nextDelivery: response.data.nextDelivery,
                        };
                    }
                    return sub;
                });

                setSubscriptions(updatedSubscriptions);

                // Reset form
                setProductPharmacies({});
                setOrderNotes('');
                setCustomAddress('');
                setDeliveryType('customer');
                setOrderModal({ subscription: null, isOpen: false });

                alert(`Order placed successfully! Order ID: ${response.data.order.orderNumber}. Next delivery: ${new Date(response.data.nextDelivery).toLocaleDateString()}`);
            } else {
                throw new Error(response.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleUpdateSubscriptionStatus = async (
        subscriptionId: string,
        status: 'active' | 'paused' | 'cancelled',
    ) => {
        try {
            // Update subscription status
            const updatedSubscriptions = subscriptions.map((sub) => {
                if (sub.id === subscriptionId) {
                    return {
                        ...sub,
                        status,
                        isActive: status === 'active',
                        updatedAt: new Date(),
                    };
                }
                return sub;
            });

            setSubscriptions(updatedSubscriptions);

            // Close the details modal
            setDetailsModal({ subscription: null, isOpen: false });

            alert(`Subscription ${status} successfully!`);
        } catch (error) {
            console.error('Error updating subscription status:', error);
            alert('Failed to update subscription status. Please try again.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getFrequencyText = (frequency: string) => {
        switch (frequency) {
            case 'weekly':
                return 'Weekly';
            case 'bi-weekly':
                return 'Bi-weekly';
            case 'monthly':
                return 'Monthly';
            case 'quarterly':
                return 'Quarterly';
            default:
                return frequency;
        }
    };

    const getDaysUntilDelivery = (deliveryDate: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        const delivery = new Date(deliveryDate);
        delivery.setHours(0, 0, 0, 0);
        const diffTime = delivery.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getUrgencyColor = (daysUntil: number) => {
        if (daysUntil < 0) return 'text-red-700 font-bold'; // Overdue
        if (daysUntil === 0) return 'text-red-600 font-bold'; // Today
        if (daysUntil <= 2) return 'text-orange-600 font-semibold'; // Within 2 days
        if (daysUntil <= 7) return 'text-yellow-600 font-medium'; // Within a week
        return 'text-gray-600';
    };

    const getUrgencyBadge = (daysUntil: number) => {
        if (daysUntil < 0)
            return { text: 'OVERDUE', class: 'bg-red-100 text-red-800 border-red-200' };
        if (daysUntil === 0)
            return { text: 'TODAY', class: 'bg-red-100 text-red-800 border-red-200' };
        if (daysUntil === 1)
            return { text: 'TOMORROW', class: 'bg-orange-100 text-orange-800 border-orange-200' };
        if (daysUntil <= 3)
            return { text: 'URGENT', class: 'bg-orange-100 text-orange-800 border-orange-200' };
        if (daysUntil <= 7)
            return { text: 'SOON', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        return null;
    };

    const formatDeliveryDate = (date: Date | string, daysUntil: number) => {
        const dateObj = new Date(date);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: dateObj.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        };

        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        if (daysUntil < 0) return `${formattedDate} (${Math.abs(daysUntil)} days overdue)`;
        if (daysUntil === 0) return `${formattedDate} (Today)`;
        if (daysUntil === 1) return `${formattedDate} (Tomorrow)`;
        return `${formattedDate} (${daysUntil} days)`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F]"
                ></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg">
                            <svg
                                className="w-6 h-6 text-[#394867]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[#9BA4B4]">
                                Total Subscriptions
                            </p>
                            <p className="text-2xl font-bold text-[#14274E]">
                                {subscriptions.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[#9BA4B4]">
                                Active
                            </p>
                            <p className="text-2xl font-bold text-[#14274E]">
                                {subscriptions.filter((s) => s.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg">
                            <svg
                                className="w-6 h-6 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[#9BA4B4]">
                                Due Soon
                            </p>
                            <p className="text-2xl font-bold text-[#394867]">
                                {
                                    subscriptions.filter(
                                        (s) => getDaysUntilDelivery(s.nextDelivery) <= 3,
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center">
                        <div className="p-2 bg-[#F1F6F9] rounded-lg">
                            <svg
                                className="w-6 h-6 text-[#394867]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[#9BA4B4]">
                                Total Value
                            </p>
                            <p className="text-2xl font-bold text-[#14274E]">
                                {subscriptions
                                    .reduce((sum, s) => sum + s.totalAmount, 0)
                                    .toFixed(0)}{' '}
                                EGP
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by customer name, ID, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                        >
                            <option value="all">
                                All Status
                            </option>
                            <option value="active">
                                Active
                            </option>
                            <option value="paused">
                                Paused
                            </option>
                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscriptions List */}
            <div className="space-y-4">
                {filteredSubscriptions.map((subscription) => {
                    const daysUntil = getDaysUntilDelivery(subscription.nextDelivery);
                    const subscriptionProducts = subscription.products;

                    return (
                        <div
                            key={subscription.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div
                                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                            >
                                {/* Subscription Info */}
                                <div className="flex-1">
                                    <div
                                        className="flex items-center gap-3 mb-3"
                                    >
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                        >
                                            {subscription.customerName}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}
                                        >
                                            {subscription.status.charAt(0).toUpperCase() +
                                                subscription.status.slice(1)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ID: {subscription.id}
                                        </span>
                                    </div>

                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm"
                                    >
                                        <div>
                                            <span className="text-gray-500">
                                                Phone:
                                            </span>
                                            <div className="font-medium">
                                                {subscription.customerPhone}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Frequency:
                                            </span>
                                            <div className="font-medium">
                                                {getFrequencyText(subscription.frequency)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Next Delivery:
                                            </span>
                                            <div
                                                className="flex items-center gap-2 mt-1"
                                            >
                                                <div
                                                    className={`font-medium ${getUrgencyColor(daysUntil)}`}
                                                >
                                                    {formatDeliveryDate(
                                                        subscription.nextDelivery,
                                                        daysUntil,
                                                    )}
                                                </div>
                                                {getUrgencyBadge(daysUntil) && (
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                                            getUrgencyBadge(daysUntil)!.class
                                                        }`}
                                                    >
                                                        {getUrgencyBadge(daysUntil)!.text}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Total Amount:
                                            </span>
                                            <div
                                                className="font-medium text-[#1F1F6F]"
                                            >
                                                {subscription.totalAmount.toFixed(2)} EGP
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div className="mt-3">
                                        <span className="text-gray-500 text-sm">
                                            Products:
                                        </span>
                                        <div
                                            className="flex flex-wrap gap-3 mt-2"
                                        >
                                            {subscriptionProducts.map((product, index) => {
                                                const unitText =
                                                    product.unitType === 'box' ? 'box' : 'unit';

                                                // Use populated product name if available
                                                const displayName = product.productName || 'Unknown Product';

                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        {/* Product Image */}
                                                        {product.images && product.images.length > 0 && (
                                                            <img
                                                                src={product.images[0].url || product.images[0]}
                                                                alt={displayName}
                                                                className="w-12 h-12 object-cover rounded-md border border-gray-200"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {displayName}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {product.quantity} {unitText}
                                                                </span>
                                                            </div>
                                                            {product.pricePerBox && (
                                                                <span className="text-xs text-green-600 font-medium">
                                                                    {product.pricePerBox} EGP/box
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                                        <button
                                            onClick={() =>
                                                setOrderModal({ subscription, isOpen: true })
                                            }
                                            className="flex items-center gap-2 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                        >
                                            <Package className="h-4 w-4" />
                                            Place Order
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDetailsModal({ subscription, isOpen: true })
                                            }
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredSubscriptions.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            {subscriptions.length === 0 ? 'Failed to load subscriptions from server' : 'No subscriptions found'}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                            {subscriptions.length === 0 ? 'Please check your connection and try refreshing the page' : 'Try adjusting your search or filter criteria'}
                        </div>
                        {subscriptions.length === 0 && (
                            <button
                                onClick={loadSubscriptions}
                                className="mt-4 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                            >
                                Retry Loading
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Order Placement Modal */}
            {orderModal.isOpen && orderModal.subscription && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <div
                        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Place Order for {orderModal.subscription.customerName}
                            </h3>

                            {/* Subscription Details */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Subscription Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">
                                            Subscription ID:
                                        </span>
                                        <div className="font-medium">
                                            {orderModal.subscription.id}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Total Amount:
                                        </span>
                                        <div
                                            className="font-medium text-[#1F1F6F]"
                                        >
                                            {orderModal.subscription.totalAmount.toFixed(2)} EGP
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products with Enhanced Pharmacy Selection */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Products & Pharmacy Selection
                                </h4>
                                {orderModal.subscription.products.map((product, index) => {
                                    const productKey = `${product.productId}-${index}`;

                                    const enhancedProduct = {
                                        productId: product.productId,
                                        quantity: product.quantity,
                                        unitType: product.unitType,
                                        name: product.productName || 'Unknown Product',
                                        price: product.pricePerBox,
                                        packSize: undefined,
                                        image: product.images?.[0],
                                    };

                                    // Filter pharmacies that have this product in stock
                                    console.log(pharmacies);
                                    const availablePharmacies = pharmacies.filter((pharmacy: any) => {
                                        const hasProduct = pharmacy.productStatistics?.Inventory?.some((item: any) =>
                                            item.productId._id === product.productId &&
                                            item.inStock &&
                                            item.stockQuantity > 0
                                        );
                                        return hasProduct;
                                    });

                                    return (
                                        <EnhancedPharmacySelector
                                            key={index}
                                            product={enhancedProduct}
                                            productIndex={index}
                                            pharmacies={availablePharmacies}
                                            selectedPharmacyId={productPharmacies[productKey]?.pharmacyId}
                                            onPharmacySelect={(pharmacyId: string) => {
                                                const selectedPharmacy = availablePharmacies.find((p: any) => p.id === pharmacyId);
                                                if (selectedPharmacy) {
                                                    // Find the product's price from this pharmacy's inventory
                                                    const productInventory = selectedPharmacy.productStatistics?.Inventory?.find(
                                                        (inv: any) => inv.productId._id === product.productId
                                                    );
                                                    
                                                    setProductPharmacies((prev) => ({
                                                        ...prev,
                                                        [productKey]: {
                                                            pharmacyId: selectedPharmacy.id,
                                                            pharmacyName: selectedPharmacy.name,
                                                            price: productInventory?.price || 0,
                                                            total: prev[productKey]?.total || 0
                                                        },
                                                    }));
                                                }
                                            }}
                                            onTotalCalculated={(total: number) => {
                                                setProductPharmacies((prev) => {
                                                    // Only update if the total has actually changed
                                                    if (prev[productKey]?.total !== total) {
                                                        return {
                                                            ...prev,
                                                            [productKey]: {
                                                                ...prev[productKey],
                                                                total: total
                                                            }
                                                        };
                                                    }
                                                    return prev;
                                                });
                                            }}
                                            data-oid="8che3ey"
                                        />
                                    );
                                })}
                            </div>

                            {/* Delivery Address Selection */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Delivery Address
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                value="customer"
                                                checked={deliveryType === 'customer'}
                                                onChange={(e) =>
                                                    setDeliveryType(
                                                        e.target.value as 'customer' | 'custom',
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            Customer Address
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                value="custom"
                                                checked={deliveryType === 'custom'}
                                                onChange={(e) =>
                                                    setDeliveryType(
                                                        e.target.value as 'customer' | 'custom',
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            Custom Address
                                        </label>
                                    </div>

                                    {deliveryType === 'customer' ? (
                                        <div
                                            className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700"
                                        >
                                            <strong>Customer Address:</strong>
                                            <br />
                                            {orderModal.subscription.deliveryAddress}
                                        </div>
                                    ) : (
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Enter Custom Delivery Address:
                                            </label>
                                            <textarea
                                                value={customAddress}
                                                onChange={(e) => setCustomAddress(e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                                placeholder="Enter the delivery address..."
                                                required={deliveryType === 'custom'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="mb-6">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Order Notes (Optional)
                                </label>
                                <textarea
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    placeholder="Any special instructions for the pharmacies..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setOrderModal({ subscription: null, isOpen: false });
                                        setProductPharmacies({});
                                        setDeliveryType('customer');
                                        setCustomAddress('');
                                        setOrderNotes('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={placingOrder}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placingOrder}
                                    className="flex-1 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {placingOrder ? (
                                        <div
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                                            ></div>
                                            Placing Order...
                                        </div>
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription Details Modal */}
            <SubscriptionDetailsModal
                subscription={detailsModal.subscription}
                isOpen={detailsModal.isOpen}
                onClose={() => setDetailsModal({ subscription: null, isOpen: false })}
                onUpdateStatus={handleUpdateSubscriptionStatus}
            />
        </div>
    );
}