'use client';

import { useState, useEffect } from 'react';
import { pharmacyOrderService } from '@/lib/services/pharmacyOrderService';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface RealTimeOrderIndicatorProps {
    className?: string;
}

export function RealTimeOrderIndicator({ className = '' }: RealTimeOrderIndicatorProps) {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        newOrders: 0,
        urgentOrders: 0,
        preparingOrders: 0,
        readyOrders: 0,
    });
    const [isBlinking, setIsBlinking] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        const updateStats = () => {
            const orderStats = pharmacyOrderService.getOrderStats();
            const urgentOrders = pharmacyOrderService.getUrgentOrders();

            const newStats = {
                newOrders: orderStats.newOrders,
                urgentOrders: urgentOrders.length,
                preparingOrders: orderStats.preparingOrders,
                readyOrders: orderStats.readyOrders,
            };

            // Check if there are new orders to trigger blinking
            if (
                newStats.newOrders > stats.newOrders ||
                newStats.urgentOrders > stats.urgentOrders
            ) {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 3000);
            }

            setStats(newStats);
            setLastUpdate(new Date());
        };

        // Initial load
        updateStats();

        // Subscribe to order updates
        const unsubscribe = pharmacyOrderService.subscribe(() => {
            updateStats();
        });

        // Update every 30 seconds
        const interval = setInterval(updateStats, 30000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [stats.newOrders, stats.urgentOrders]);

    const formatLastUpdate = () => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);

        if (diffInSeconds < 30) return 'Just updated';
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    };

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
            data-oid="jjfsvlm"
        >
            <div className="flex items-center justify-between mb-3" data-oid="uac:99_">
                <h3 className="font-semibold text-gray-900 flex items-center" data-oid="luou610">
                    <span
                        className={`w-2 h-2 rounded-full mr-2 ${isBlinking ? 'animate-pulse bg-red-500' : 'bg-green-500'}`}
                        data-oid="dnbm.4w"
                    ></span>
                    Live Order Status
                </h3>
                <span className="text-xs text-gray-500" data-oid="fz35wnn">
                    {formatLastUpdate()}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-oid="_fqa9-z">
                {/* New Orders */}
                <div
                    className={`text-center p-3 rounded-lg border-2 transition-all duration-300 ${
                        stats.newOrders > 0
                            ? 'border-red-200 bg-red-50' + (isBlinking ? ' animate-pulse' : '')
                            : 'border-gray-200 bg-gray-50'
                    }`}
                    data-oid="-a2rgi."
                >
                    <div
                        className={`text-2xl font-bold ${stats.newOrders > 0 ? 'text-red-600' : 'text-gray-400'}`}
                        data-oid="o6ffy1:"
                    >
                        {stats.newOrders}
                    </div>
                    <div className="text-xs text-gray-600 mt-1" data-oid="69sl4gt">
                        New Orders
                    </div>
                    {stats.newOrders > 0 && (
                        <div className="mt-1" data-oid="5hvsvti">
                            <span
                                className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"
                                data-oid="l2smjtl"
                            ></span>
                        </div>
                    )}
                </div>

                {/* Urgent Orders */}
                <div
                    className={`text-center p-3 rounded-lg border-2 transition-all duration-300 ${
                        stats.urgentOrders > 0
                            ? 'border-orange-200 bg-orange-50' +
                              (isBlinking ? ' animate-pulse' : '')
                            : 'border-gray-200 bg-gray-50'
                    }`}
                    data-oid="i6cp9:c"
                >
                    <div
                        className={`text-2xl font-bold ${stats.urgentOrders > 0 ? 'text-orange-600' : 'text-gray-400'}`}
                        data-oid="hpxp12y"
                    >
                        {stats.urgentOrders}
                    </div>
                    <div className="text-xs text-gray-600 mt-1" data-oid="qtp4u:v">
                        Urgent
                    </div>
                    {stats.urgentOrders > 0 && (
                        <div className="mt-1" data-oid="d8_5idv">
                            <span
                                className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-ping"
                                data-oid="xcbyb8c"
                            ></span>
                        </div>
                    )}
                </div>

                {/* Preparing Orders */}
                <div
                    className="text-center p-3 rounded-lg border-2 border-gray-200 bg-gray-50"
                    data-oid="n5b:m-w"
                >
                    <div
                        className={`text-2xl font-bold ${stats.preparingOrders > 0 ? 'text-blue-600' : 'text-gray-400'}`}
                        data-oid="pu42xl0"
                    >
                        {stats.preparingOrders}
                    </div>
                    <div className="text-xs text-gray-600 mt-1" data-oid="tf1o36l">
                        Preparing
                    </div>
                </div>

                {/* Ready Orders */}
                <div
                    className="text-center p-3 rounded-lg border-2 border-gray-200 bg-gray-50"
                    data-oid="v0h19sg"
                >
                    <div
                        className={`text-2xl font-bold ${stats.readyOrders > 0 ? 'text-green-600' : 'text-gray-400'}`}
                        data-oid="qiw2uco"
                    >
                        {stats.readyOrders}
                    </div>
                    <div className="text-xs text-gray-600 mt-1" data-oid="k4s6yml">
                        Ready
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {(stats.newOrders > 0 || stats.urgentOrders > 0) && (
                <div className="mt-4 flex gap-2" data-oid="nvap_9v">
                    {stats.newOrders > 0 && (
                        <button
                            onClick={() =>
                                (window.location.href = '/pharmacy/orders?status=pending')
                            }
                            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            data-oid="6c:13a1"
                        >
                            Process New Orders
                        </button>
                    )}
                    {stats.urgentOrders > 0 && (
                        <button
                            onClick={() =>
                                (window.location.href = '/pharmacy/orders?priority=urgent')
                            }
                            className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                            data-oid="fsg1m:i"
                        >
                            Handle Urgent
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
