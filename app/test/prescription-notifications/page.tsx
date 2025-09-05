'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PrescriptionNotificationDemo } from '@/components/demo/PrescriptionNotificationDemo';

export default function PrescriptionNotificationsTestPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Prescription Notifications Test
                    </h1>
                    <p className="text-gray-600">
                        This page allows you to test the prescription notification system. Create
                        sample notifications and see how they appear in the notification bell.
                    </p>
                </div>

                <div className="grid gap-6">
                    <PrescriptionNotificationDemo />

                    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start space-x-3">
                                <span className="text-green-500 font-bold">1.</span>
                                <p>
                                    When a prescription is approved, customers receive a
                                    high-priority notification
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-blue-500 font-bold">2.</span>
                                <p>
                                    The notification appears in the notification bell with a badge
                                    count
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-purple-500 font-bold">3.</span>
                                <p>
                                    Clicking on an approved prescription notification navigates
                                    directly to medicine selection
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-orange-500 font-bold">4.</span>
                                <p>
                                    Other prescription notifications navigate to the prescription
                                    status page
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                            Mobile Design Features
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>• Notifications are optimized for mobile viewing</li>
                            <li>
                                • Prescription notifications show special {'"'}Select Medicines{'"'} badges
                            </li>
                            <li>• Smooth navigation to medicine selection page</li>
                            <li>• Visual feedback with hover states and animations</li>
                            <li>• Automatic notification sound for high-priority prescriptions</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
