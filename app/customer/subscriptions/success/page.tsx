'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubscriptionSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Auto redirect after 5 seconds
        const timer = setTimeout(() => {
            router.push('/customer/subscriptions');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
            data-oid="uuj2jsb"
        >
            <div
                className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg"
                data-oid="io:fwib"
            >
                {/* Success Icon */}
                <div
                    className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
                    data-oid="q..t3.k"
                >
                    <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="2-6te49"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                            data-oid="5v0kvcj"
                        />
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-xl font-bold text-gray-900 mb-2" data-oid="t25jrfs">
                    Subscription Created!
                </h1>
                <p className="text-gray-600 text-sm mb-6" data-oid="syx:_km">
                    Your subscription has been successfully created. You{"'"}ll receive your first
                    delivery according to your selected schedule.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3" data-oid="recywkd">
                    <Link
                        href="/customer/subscriptions"
                        className="w-full px-4 py-2.5 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors text-sm font-medium block"
                        data-oid="k_l6f--"
                    >
                        View My Subscriptions
                    </Link>
                    <Link
                        href="/customer/mobile-dashboard"
                        className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm block"
                        data-oid="wxe.ch8"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Auto redirect notice */}
                <p className="text-xs text-gray-500 mt-4" data-oid="5bty:.0">
                    Redirecting to subscriptions in 5 seconds...
                </p>
            </div>
        </div>
    );
}
