'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext'; // Import useAuth to get the user ID

export default function CustomerSubscriptionsPage() {
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { user } = useAuth(); // Get the current authenticated user

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            setShowSuccessMessage(true);
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    // Handle case where user is not yet loaded
    if (!user) {
        return <div>Loading...</div>; // Or a more sophisticated loading state
    }

    const customerId = user._id; // Use the authenticated user's ID

    if (isMobile) {
        return (
            <div className="min-h-screen bg-gray-50" data-oid="mobile-layout">
                {/* Mobile Header */}
                <div
                    className="bg-white border-b border-gray-200 sticky top-0 z-10"
                    data-oid="mobile-header"
                >
                    <div className="flex items-center justify-between px-4 py-3" data-oid="tenxs73">
                        <div className="flex items-center space-x-3" data-oid="s:zyk:b">
                            <Link
                                href="/customer/mobile-dashboard"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                data-oid="back-button"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="uw1-122"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                        data-oid="heu9qus"
                                    />
                                </svg>
                            </Link>
                            <h1 className="text-lg font-semibold text-gray-900" data-oid="9tqsrtn">
                                My Subscriptions
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="px-4 py-6" data-oid="mobile-content">
                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div
                            className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                            data-oid="7--j1sp"
                        >
                            <div className="flex items-center" data-oid="29:xs9p">
                                <svg
                                    className="w-5 h-5 text-green-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="i7:m35u"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                        data-oid="ponx:2f"
                                    />
                                </svg>
                                <p
                                    className="text-green-800 font-medium text-sm"
                                    data-oid="-x79qr0"
                                >
                                    Subscription created successfully!
                                </p>
                            </div>
                        </div>
                    )}
                    <SubscriptionManager
                        customerId={customerId}
                        data-oid="mobile-subscription-manager"
                    />
                </div>
                {/* Mobile Bottom Padding */}
                <div className="h-8" data-oid="mobile-bottom-padding"></div>
            </div>
        );
    }

    // Desktop Layout
    return (
        <DashboardLayout
            title="My Subscriptions"
            userType="customer"
            data-oid="desktop-subscriptions"
        >
            <SubscriptionManager
                customerId={customerId}
                data-oid="desktop-subscription-manager"
            />
        </DashboardLayout>
    );
}