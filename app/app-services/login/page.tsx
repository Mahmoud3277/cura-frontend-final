'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppServicesLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);

        // Simulate login
        const user = {
            id: '8',
            name: 'App Services Agent',
            email: 'appservices@cura.com',
            role: 'app-services',
            isActive: true,
            createdAt: '2024-01-01',
        };

        // Set localStorage
        localStorage.setItem('cura_user', JSON.stringify(user));

        // Set cookie
        const userString = JSON.stringify(user);
        const encodedUser = encodeURIComponent(userString);
        document.cookie = `cura_user=${encodedUser}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        // Redirect to app services
        setTimeout(() => {
            window.location.href = '/app-services';
        }, 1000);
    };

    return (
        <div
            className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
            data-oid="x35bvyw"
        >
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8" data-oid="c1w2:zk">
                <div className="text-center mb-8" data-oid="uv:afgw">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" data-oid=":6in_rk">
                        🎧 App Services
                    </h1>
                    <p className="text-gray-600" data-oid="i.m_n2c">
                        Quick access to App Services Dashboard
                    </p>
                </div>

                <div className="space-y-4" data-oid=".gtk4ew">
                    <div
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                        data-oid="1s4v_h0"
                    >
                        <h3 className="font-semibold text-blue-800 mb-2" data-oid="i0fh-9w">
                            Login Credentials:
                        </h3>
                        <p className="text-sm text-blue-700" data-oid="fozq3q6">
                            <strong data-oid="jl60u2i">Email:</strong> appservices@cura.com
                            <br data-oid="ybndrl0" />
                            <strong data-oid="t:4uwx6">Password:</strong> password
                        </p>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        data-oid="a_984c-"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center" data-oid="zz4cmuy">
                                <div
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                    data-oid="ntnzph7"
                                ></div>
                                Logging in...
                            </div>
                        ) : (
                            '🚀 Quick Login to App Services'
                        )}
                    </button>

                    <div className="text-center" data-oid="kl0_8cc">
                        <a
                            href="/auth/login"
                            className="text-sm text-gray-600 hover:text-gray-800"
                            data-oid="bz-9t9u"
                        >
                            Or use the main login page
                        </a>
                    </div>
                </div>

                <div
                    className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg"
                    data-oid="-rsi0ld"
                >
                    <h4 className="font-semibold text-green-800 mb-2" data-oid="u8oci9m">
                        What you{"'"}ll get access to:
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1" data-oid=":s69215">
                        <li data-oid="_4___cv">• Suspended Orders Management</li>
                        <li data-oid="jw_ifwp">• Customer Service Tickets</li>
                        <li data-oid=".v6bj3a">• Pharmacy Coordination</li>
                        <li data-oid="9b.-y14">• Order Management Tools</li>
                        <li data-oid="wb49h:q">• Analytics & Reporting</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
