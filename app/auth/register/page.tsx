'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@/lib/types';
import { useAuth, getDashboardRoute } from '@/lib/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register, isLoading, isAuthenticated, user } = useAuth();
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        // Show success toast
        toast.success('Account created successfully!', {
          description: 'Welcome to CURA. Your account has been created.',
          duration: 4000,
        });
        
        // Check if there's a redirect parameter
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          // The `useAuth` hook should already have the updated user state.
          // This ensures consistency without needing to read from localStorage.
          if (user) {
            const dashboardRoute = getDashboardRoute(user.role);
            router.push(dashboardRoute);
          }
        }
      } else {
        setErrors({ general: result.error || 'Registration failed. Email may already be in use.' });
        toast.error('Registration failed', {
          description: result.error || 'Please check your information and try again.',
        });
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
      toast.error('Registration failed', {
        description: errorMessage,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4"
      data-oid="ee4fuk_"
    >
      <div className="max-w-md w-full" data-oid="mghey_s">
        {/* Header */}
        <div className="text-center mb-8" data-oid="4gyf6q_">
          <div className="flex justify-center mb-4" data-oid="logo-container">
            <Logo
              size="md"
              variant="gradient"
              showIcon={true}
              className="[&_img]:!w-32"
              data-oid="hf94qf4"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4" data-oid=".l_34ir">
            Create Account
          </h2>
          <p className="text-gray-600 mt-2" data-oid="cfxnwqu">
            Join CURA for convenient healthcare delivery
          </p>
        </div>

        {/* Registration Form */}
        <div
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          data-oid="g9xlw2f"
        >
          <form onSubmit={handleSubmit} className="space-y-6" data-oid="y_d32em">
            {/* General Error Message */}
            {errors.general && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                data-oid=":69x4d6"
              >
                {errors.general}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4" data-oid="oj6._ql">
              <div data-oid=":14g:ws">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  data-oid="3280mkk"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                  placeholder="First name"
                  data-oid="e.m7095"
                />
              </div>
              <div data-oid="zqb8zlw">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  data-oid="0o7olxe"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                  placeholder="Last name"
                  data-oid="v9tw7ww"
                />
              </div>
            </div>

            {/* Email Field */}
            <div data-oid="1r8._-7">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
                data-oid="th6oc::"
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
                data-oid="bmg.z6g"
              />
            </div>

            {/* Phone Field */}
            <div data-oid="w:fzf87">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
                data-oid="3pvdnb_"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                placeholder="Enter your phone number"
                data-oid="4g4fxqa"
              />
            </div>

            {/* WhatsApp Field */}
            <div data-oid="whatsapp-field">
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-gray-700 mb-2"
                data-oid="whatsapp-label"
              >
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                placeholder="Enter your WhatsApp number"
                data-oid="whatsapp-input"
              />
            </div>

            {/* Password Fields */}
            <div data-oid=":luqw41">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
                data-oid="ez.8uku"
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
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a password"
                data-oid="qj0pybj"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1" data-oid="uf18ne1">
                  {errors.password}
                </p>
              )}
            </div>

            <div data-oid="x1g_siy">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
                data-oid="qq.lfur"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                data-oid="20ij4fq"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1" data-oid="d2hdmom">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              data-oid="_7p2x:s"
            >
              {isLoading ? (
                <div className="flex items-center justify-center" data-oid="x30y6gt">
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                    data-oid="3iqd3lg"
                  ></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center" data-oid="gqp2813">
            <p className="text-gray-600" data-oid="p:wixz.">
              Already have an account?{' '}
              <Link
                href={`/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-[#1F1F6F] hover:text-[#14274E] font-semibold transition-colors"
                data-oid="zvrqhd."
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}