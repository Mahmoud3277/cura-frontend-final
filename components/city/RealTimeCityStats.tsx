'use client';

import { useState, useEffect } from 'react';
import { CityWithStatus } from '@/lib/services/cityManagementService';

interface RealTimeCityStatsProps {
    city: CityWithStatus;
}

interface CityStats {
    pharmacies: number;
    doctors: number;
    vendors: number;
    customers: number;
}

export function RealTimeCityStats({ city }: RealTimeCityStatsProps) {
    const [stats, setStats] = useState<CityStats>({
        pharmacies: city.pharmacyCount,
        doctors: city.doctorCount,
        vendors: Math.floor(city.pharmacyCount * 0.3),
        customers: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRealTimeStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city.id]);

    const loadRealTimeStats = async () => {
        try {
            setLoading(true);

            // Import the integrated account service
            const { integratedAccountService } = await import(
                '@/lib/services/integratedAccountService'
            );

            // Get real-time statistics for this city
            const cityStats = integratedAccountService.getCityStatistics(city.nameEn);

            if (cityStats) {
                setStats({
                    pharmacies: cityStats.totalPharmacies,
                    doctors: cityStats.totalDoctors,
                    vendors: cityStats.totalVendors,
                    customers: cityStats.totalCustomers,
                });
            }
        } catch (error) {
            console.error('Error loading real-time stats:', error);
            // Keep the fallback stats
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="text-center" data-oid="9msrlob">
                <div
                    className={`text-sm font-semibold ${loading ? 'text-blue-600' : 'text-gray-900'}`}
                    data-oid="zjb9ht8"
                >
                    {loading ? '...' : stats.pharmacies}
                </div>
                <div className="text-xs text-gray-500" data-oid="vft673u">
                    Pharmacies
                </div>
            </div>
            <div className="text-center" data-oid="fs6yceg">
                <div
                    className={`text-sm font-semibold ${loading ? 'text-blue-600' : 'text-gray-900'}`}
                    data-oid="pxyramt"
                >
                    {loading ? '...' : stats.doctors}
                </div>
                <div className="text-xs text-gray-500" data-oid="n7sxzw:">
                    Doctors
                </div>
            </div>
            <div className="text-center" data-oid="sz7fu4c">
                <div
                    className={`text-sm font-semibold ${loading ? 'text-blue-600' : 'text-gray-900'}`}
                    data-oid="iis.hua"
                >
                    {loading ? '...' : stats.vendors}
                </div>
                <div className="text-xs text-gray-500" data-oid="7qkh1p4">
                    Vendors
                </div>
            </div>
            <div className="text-center" data-oid="9xo0kvz">
                <div
                    className={`text-sm font-semibold ${loading ? 'text-blue-600' : 'text-gray-900'}`}
                    data-oid="q4bjrqt"
                >
                    {loading ? '...' : stats.customers}
                </div>
                <div className="text-xs text-gray-500" data-oid="uhnwyck">
                    Customers
                </div>
            </div>
        </>
    );
}
