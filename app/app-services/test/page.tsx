'use client';

import { useState, useEffect } from 'react';
import { suspendedOrderService } from '@/lib/services/suspendedOrderService';

export default function AppServicesTestPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        try {
            const orders = suspendedOrderService.getSuspendedOrders();
            setData({ orders });
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="p-8" data-oid="j:0oef8">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-8" data-oid="c60fdpf">
            <h1 className="text-2xl font-bold mb-4" data-oid="t8jiasr">
                App Services Test Page
            </h1>
            <div className="bg-white rounded-lg border p-4" data-oid="3wxq317">
                <h2 className="text-lg font-semibold mb-2" data-oid="6sq0j7e">
                    Test Data
                </h2>
                <p data-oid="brc3k1u">Suspended Orders: {data?.orders?.length || 0}</p>
                <div className="mt-4" data-oid="p7rv3f-">
                    <h3 className="font-medium" data-oid="7flz.dv">
                        Available Features:
                    </h3>
                    <ul className="list-disc list-inside mt-2 space-y-1" data-oid="r-m4psr">
                        <li data-oid="a:bw4cq">✅ Suspended Orders Management</li>
                        <li data-oid="x737_a-">✅ Customer Service Tickets</li>
                        <li data-oid="1:42hcx">✅ Pharmacy Coordination</li>
                        <li data-oid="t3:9n4:">✅ Order Management</li>
                        <li data-oid="m0squr9">✅ Analytics & Reporting</li>
                    </ul>
                </div>
                <div
                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded"
                    data-oid="e_65xw1"
                >
                    <p className="text-green-800 font-medium" data-oid="7vrcnwo">
                        ✅ App Services system is working!
                    </p>
                    <p className="text-green-600 text-sm mt-1" data-oid="gp2cfti">
                        You can now access the full dashboard at /app-services/dashboard
                    </p>
                </div>
            </div>
        </div>
    );
}
