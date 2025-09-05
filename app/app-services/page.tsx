'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppServicesPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard
        router.replace('/app-services/dashboard');
    }, [router]);

    return (
        <div
            className="min-h-screen bg-gray-50 flex items-center justify-center"
            data-oid="36:qyk0"
        >
            <div className="text-center" data-oid="pz.lin3">
                <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F] mx-auto mb-4"
                    data-oid="ia76_gw"
                ></div>
                <p className="text-gray-600" data-oid="xew64mx">
                    Redirecting to App Services Dashboard...
                </p>
            </div>
        </div>
    );
}
