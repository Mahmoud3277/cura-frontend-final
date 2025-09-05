'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { doctorManagementService, DoctorDetails } from '@/lib/services/doctorManagementService';
import { DoctorAnalyticsDashboard } from '@/components/analytics/DoctorAnalyticsDashboard';

export default function DoctorAnalyticsPage() {
    const { user } = useAuth();
    const [doctorData, setDoctorData] = useState<DoctorDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDoctorData();
    }, []);

    const loadDoctorData = async () => {
        try {
            setIsLoading(true);
            const doctorId = 'dr-ahmed-hassan'; // Mock doctor ID
            const doctor = doctorManagementService.getDoctorById(doctorId);
            setDoctorData(doctor || null);
        } catch (error) {
            console.error('Error loading doctor data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid=".8l_lij"
            >
                <div className="text-center" data-oid=".ncvi-a">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="a16w45p"
                    ></div>
                    <span className="text-gray-600" data-oid="bn9ueym">
                        Loading analytics...
                    </span>
                </div>
            </div>
        );
    }

    if (!doctorData) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="fopbg69"
            >
                <div className="text-center p-8" data-oid="ccf9hue">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="844d85x">
                        Doctor Profile Not Found
                    </h3>
                    <p className="text-gray-600" data-oid="xb-ns4n">
                        Unable to load doctor profile. Please contact support.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="7nj:pfy">
            {/* Header */}
            <div data-oid="92sh978">
                <h1 className="text-3xl font-bold text-gray-900" data-oid="mz:l.-_">
                    Analytics & Reports
                </h1>
                <p className="text-gray-600 mt-1" data-oid="p90o23j">
                    Comprehensive analytics for your referral performance and earnings
                </p>
            </div>

            {/* Analytics Dashboard */}
            <DoctorAnalyticsDashboard data-oid="x_:v3xr" />
        </div>
    );
}
