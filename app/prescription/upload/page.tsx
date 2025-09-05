'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PrescriptionUpload } from '@/components/prescription/PrescriptionUpload';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function PrescriptionUploadPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const handleUploadComplete = async (files: any[], formData: any) => {
        setIsSubmitting(true);

        try {
            // Simulate API call to submit prescription
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // In a real app, you would send the data to your backend
            console.log('Prescription submitted:', { files, formData });

            // Redirect to success page or dashboard
            router.push('/prescription/status?success=true');
        } catch (error) {
            console.error('Failed to submit prescription:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50"
            data-oid="nyh:nm:"
        >
            <Header data-oid="b75w.tw" />

            <main className="py-12" data-oid="9v5rpi1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="ss77.eg">
                    {/* Breadcrumb */}
                    <nav className="mb-8" data-oid="l7ddu68">
                        <ol
                            className="flex items-center space-x-2 text-sm text-gray-500"
                            data-oid="bjbk64b"
                        >
                            <li data-oid="q0peft8">
                                <a
                                    href="/"
                                    className="hover:text-[#1F1F6F] transition-colors duration-200"
                                    data-oid="7.6dxbw"
                                >
                                    Home
                                </a>
                            </li>
                            <li data-oid="5rhukd9">
                                <span className="mx-2" data-oid="mrqfsy0">
                                    /
                                </span>
                            </li>
                            <li className="text-[#1F1F6F] font-medium" data-oid="q6e_z8z">
                                Upload Prescription
                            </li>
                        </ol>
                    </nav>

                    {/* Auth Check */}
                    {!user && (
                        <div
                            className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl"
                            data-oid="50ckph0"
                        >
                            <div className="flex items-center space-x-3" data-oid="zjwmj:4">
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid=".glv19m"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                        data-oid="td-t022"
                                    />
                                </svg>
                                <div data-oid="n79a-on">
                                    <h3
                                        className="font-semibold text-blue-900 mb-1"
                                        data-oid="8b14d4h"
                                    >
                                        Sign in for a better experience
                                    </h3>
                                    <p className="text-blue-800 text-sm" data-oid="5rhcn3z">
                                        Create an account to track your prescriptions and orders
                                        easily.
                                    </p>
                                    <div className="mt-3 space-x-3" data-oid="73mqukz">
                                        <a
                                            href="/auth/login"
                                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                                            data-oid="b8cgpzj"
                                        >
                                            Sign In
                                        </a>
                                        <a
                                            href="/auth/register"
                                            className="inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200"
                                            data-oid="t11c5bf"
                                        >
                                            Create Account
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upload Component */}
                    <PrescriptionUpload
                        onUploadComplete={handleUploadComplete}
                        className="mb-12"
                        data-oid="gq-_:bd"
                    />
                </div>
            </main>

            <Footer data-oid="m4vbi6_" />

            {/* Loading Overlay */}
            {isSubmitting && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                    data-oid="0_e0vf9"
                >
                    <div
                        className="bg-white rounded-2xl p-8 text-center shadow-2xl"
                        data-oid="nf0s6ww"
                    >
                        <div
                            className="w-16 h-16 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                            data-oid="f1-pzi3"
                        ></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="e-356o2">
                            Submitting Prescription
                        </h3>
                        <p className="text-gray-600" data-oid="8.myniw">
                            Please wait while we process your prescription...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
