'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsEmailSent(true);
        }, 2000);
    };

    if (isEmailSent) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4"
                data-oid="f4c8-ai"
            >
                <div className="max-w-md w-full" data-oid="_:2gvxo">
                    <div className="text-center mb-8" data-oid="mbtzax.">
                        <Link href="/" className="inline-block" data-oid="f8_bw.e">
                            <h1
                                className="text-3xl font-bold bg-gradient-to-r from-[#1F1F6F] to-[#14274E] bg-clip-text text-transparent"
                                data-oid="3becc.z"
                            >
                                CURA
                            </h1>
                        </Link>
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center"
                        data-oid="zt3ox04"
                    >
                        <div
                            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="e.nvdmz"
                        >
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="bxp20t5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    data-oid="lgmyafi"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4" data-oid="1khb5jy">
                            Check Your Email
                        </h2>
                        <p className="text-gray-600 mb-6" data-oid="cu4a487">
                            We{"'"}ve sent a password reset link to{' '}
                            <strong data-oid="03oihzz">{email}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mb-6" data-oid="wdwyx9d">
                            Didn{"'"}t receive the email? Check your spam folder or try again.
                        </p>
                        <div className="space-y-3" data-oid="j_n_r9d">
                            <button
                                onClick={() => setIsEmailSent(false)}
                                className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                                data-oid="lui4tlb"
                            >
                                Try Different Email
                            </button>
                            <Link
                                href="/auth/login"
                                className="block w-full text-center text-gray-600 hover:text-[#1F1F6F] transition-colors"
                                data-oid="jtoeffd"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4"
            data-oid="35v-mue"
        >
            <div className="max-w-md w-full" data-oid="u2zcee8">
                <div className="text-center mb-8" data-oid="f843ifb">
                    <Link href="/" className="inline-block" data-oid="qb:kpc6">
                        <h1
                            className="text-3xl font-bold bg-gradient-to-r from-[#1F1F6F] to-[#14274E] bg-clip-text text-transparent"
                            data-oid="xsy0p.v"
                        >
                            CURA
                        </h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4" data-oid="2g0ydcd">
                        Reset Password
                    </h2>
                    <p className="text-gray-600 mt-2" data-oid="2dv-4t6">
                        Enter your email to receive a reset link
                    </p>
                </div>

                <div
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    data-oid="8nj1:hf"
                >
                    <form onSubmit={handleSubmit} className="space-y-6" data-oid="xsq8om5">
                        <div data-oid="o7356jw">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="_iu8i0w"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                placeholder="Enter your email address"
                                data-oid="868dt-3"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="3ygobed"
                        >
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center"
                                    data-oid="s9jtl:4"
                                >
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                        data-oid="o1pa11d"
                                    ></div>
                                    Sending Reset Link...
                                </div>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center" data-oid="-s8tsci">
                        <Link
                            href="/auth/login"
                            className="text-[#1F1F6F] hover:text-[#14274E] font-semibold transition-colors"
                            data-oid="638r5-0"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
