'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { doctorManagementService, DoctorDetails } from '@/lib/services/doctorManagementService';
import { EnhancedQRCodeManager } from '@/components/doctor/EnhancedQRCodeManager';

export default function DoctorQRCodesPage() {
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
                data-oid="7qb.7vd"
            >
                <div className="text-center" data-oid="01kn7w8">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="hjr13ah"
                    ></div>
                    <span className="text-gray-600" data-oid="f.1lxgh">
                        Loading QR code manager...
                    </span>
                </div>
            </div>
        );
    }

    if (!doctorData) {
        return (
            <div
                className="min-h-screen bg-gray-50 flex items-center justify-center"
                data-oid="5jtuyn."
            >
                <div className="text-center p-8" data-oid="1-9hbzj">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="01tpdhl">
                        Doctor Profile Not Found
                    </h3>
                    <p className="text-gray-600" data-oid="hsm.0g_">
                        Unable to load doctor profile. Please contact support.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-oid="e7-zpmd">
            {/* Header */}
            <div data-oid="p_1fk8o">
                <h1 className="text-3xl font-bold text-gray-900" data-oid="c67b:lf">
                    QR Code Manager
                </h1>
                <p className="text-gray-600 mt-1" data-oid="956_hqc">
                    Generate, customize, and manage your referral QR codes
                </p>
            </div>

            {/* QR Code Manager */}
            <EnhancedQRCodeManager doctor={doctorData} data-oid="mcytxv5" />
        </div>
    );
}
