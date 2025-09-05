'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EmergencyMedicineLocator } from '@/components/emergency/EmergencyMedicineLocator';

export default function EmergencyMedicinePage() {
    return (
        <div className="min-h-screen bg-gray-50" data-oid="x4qrw9y">
            <Header data-oid="7b0jv:d" />

            <main className="pt-20" data-oid="vte0-9e">
                {/* Hero Section */}
                <div
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16"
                    data-oid="ymjn:sw"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="_gb1kxa">
                        <div className="text-center" data-oid="scjo5f.">
                            <h1 className="text-4xl font-bold mb-4" data-oid="na:v_9l">
                                Emergency Medicine Locator
                            </h1>
                            <p
                                className="text-xl text-red-100 max-w-3xl mx-auto"
                                data-oid="2gx91nl"
                            >
                                Find critical medicines quickly when every minute counts. Locate
                                nearby pharmacies with emergency medicines in stock.
                            </p>
                            <div className="mt-6 flex justify-center" data-oid="jtycq1g">
                                <div
                                    className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-4 max-w-2xl"
                                    data-oid="nh5gsqp"
                                >
                                    <p className="text-red-100 text-sm" data-oid="cbqm.5u">
                                        <strong data-oid="eioaweb">⚠️ Medical Emergency:</strong> If
                                        this is a life-threatening emergency, call{' '}
                                        <strong data-oid="5zylsf-">123</strong> immediately. This
                                        tool supplements but does not replace emergency medical
                                        care.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="euaj-.7">
                    <EmergencyMedicineLocator data-oid="fuu9a0n" />
                </div>
            </main>

            <Footer data-oid="ucj._eo" />
        </div>
    );
}
