'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, getDashboardRoute } from '@/lib/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');
    const { login, isLoading, isAuthenticated, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect');

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                const dashboardRoute = getDashboardRoute(user.role);
                router.push(dashboardRoute);
            }
        }
    }, [isAuthenticated, user, router, redirectTo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await login({
                email: formData.email,
                password: formData.password,
            });

            if (result.success) {
                // The `user` state from the AuthContext should be updated automatically.
                if (user) {
                    if (redirectTo) {
                        router.push(redirectTo);
                    } else {
                        const dashboardRoute = getDashboardRoute(user.role);
                        router.push(dashboardRoute);
                    }
                }
            } else {
                setError(result.error || 'Invalid email or password.');
            }
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || 'Login failed. Please try again.';
            setError(errorMessage);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4"
            data-oid="xxcfizk"
        >
            <div className="max-w-md w-full" data-oid="xnp.b0n">
                {/* Header */}
                <div className="text-center mb-8" data-oid="6eceg76">
                    <div className="flex justify-center mb-4" data-oid="logo-container">
                        <Logo
                            size="md"
                            variant="gradient"
                            showIcon={true}
                            className="[&_img]:!w-32"
                            data-oid="m1ffj5l"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4" data-oid="3p0slwe">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 mt-2" data-oid="_fl2.yx">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Form */}
                <div
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    data-oid="j0w22xs"
                >
                    <form onSubmit={handleSubmit} className="space-y-6" data-oid="am1l54w">
                        {/* Error Message */}
                        {error && (
                            <div
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center"
                                data-oid="s.-x49a"
                            >
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div data-oid="_5lw5b5">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid=".-5hd6c"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                placeholder="Enter your email"
                                data-oid="o4:vr16"
                            />
                        </div>

                        {/* Password Field */}
                        <div data-oid="qug5fp-">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="uti78b8"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                placeholder="Enter your password"
                                data-oid="1cfqwn_"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between" data-oid="ryw97fv">
                            <label className="flex items-center" data-oid="0s_ujbn">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#1F1F6F] border-gray-300 rounded focus:ring-[#1F1F6F]"
                                    data-oid="8k_7-ih"
                                />
                                <span className="ml-2 text-sm text-gray-600" data-oid="cxlg3a3">
                                    Remember me
                                </span>
                            </label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-[#1F1F6F] hover:text-[#14274E] transition-colors"
                                data-oid="jgbgj:4"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            data-oid="ibpnwwj"
                        >
                            {isLoading ? (
                                <div
                                    className="flex items-center justify-center"
                                    data-oid=".rki1y0"
                                >
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                        data-oid="mt-awd9"
                                    ></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 mb-6" data-oid="z-.z4f6">
                        <div className="relative" data-oid="r.9r4-v">
                            <div className="absolute inset-0 flex items-center" data-oid="3syrvxs">
                                <div
                                    className="w-full border-t border-gray-300"
                                    data-oid="12sc1q-"
                                ></div>
                            </div>
                            <div
                                className="relative flex justify-center text-sm"
                                data-oid="pa_7kvh"
                            >
                                <span className="px-2 bg-white text-gray-500" data-oid="olw0uc2">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3" data-oid=":lswl3t">
                        <button
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            data-oid="jj9wrn1"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" data-oid="3zpg0dq">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    data-oid="5r0c_25"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    data-oid="b64zxvt"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    data-oid="yu1h.md"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    data-oid="8rvipvp"
                                />
                            </svg>
                            Google
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            data-oid="zbjcw:a"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="#1877F2"
                                viewBox="0 0 24 24"
                                data-oid="gi11ukm"
                            >
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                    data-oid="mpyg8yq"
                                />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center" data-oid="vp0a-9n">
                        <p className="text-gray-600" data-oid="vgmtk1t">
                            Don't have an account?{' '}
                            <Link
                                href={`/auth/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                                className="text-[#1F1F6F] hover:text-[#14274E] font-semibold transition-colors"
                                data-oid="dnx:diu"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}