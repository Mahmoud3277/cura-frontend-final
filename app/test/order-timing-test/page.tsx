'use client';

import { OrderTimingAnalytics } from '@/components/admin/OrderTimingAnalytics';

export default function OrderTimingTestPage() {
    const handleExportCSV = () => {
        console.log('Exporting CSV...');
        alert('CSV export functionality would be implemented here');
    };

    const handleExportExcel = () => {
        console.log('Exporting Excel...');
        alert('Excel export functionality would be implemented here');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" data-oid="gy.y8t4">
            <div className="max-w-7xl mx-auto" data-oid="_76u5m9">
                <div className="mb-6" data-oid="ghmuxtc">
                    <h1 className="text-3xl font-bold text-gray-900" data-oid=":ryy749">
                        Order Timing Analytics Test
                    </h1>
                    <p className="text-gray-600" data-oid="-i_8_9g">
                        Testing the Order Timing Analytics component
                    </p>
                </div>

                <OrderTimingAnalytics
                    onExportCSV={handleExportCSV}
                    onExportExcel={handleExportExcel}
                    data-oid="7mn7ci9"
                />
            </div>
        </div>
    );
}
