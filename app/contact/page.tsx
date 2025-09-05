'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { Footer } from '@/components/layout/Footer';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function ContactPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const { locale } = useLanguage();
    const { t: tContact } = useTranslation(locale, 'contact');
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        category: 'general',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?redirect=/contact');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to send a message.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Send message to admin dashboard with user information
            const messageData = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                status: 'unread',
                type: 'contact_form',
                // User information
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
                userPhone: user.phone || 'Not provided',
                userRole: user.role,
                userCreatedAt: user.createdAt,
                userIsActive: user.isActive,
                // Message content
                subject: formData.subject,
                message: formData.message,
                category: formData.category,
                // Additional metadata
                priority: formData.category === 'urgent' ? 'high' : 'normal',
                source: 'contact_page',
            };

            // Store in localStorage for admin dashboard
            if (typeof window !== 'undefined') {
                const existingMessages = JSON.parse(localStorage.getItem('admin_messages') || '[]');
                existingMessages.unshift(messageData);
                localStorage.setItem('admin_messages', JSON.stringify(existingMessages));
            }

            setIsSubmitting(false);
            alert("Thank you for your message! We'll get back to you within 24 hours.");
            setFormData({
                subject: '',
                message: '',
                category: 'general',
            });
        } catch (error) {
            setIsSubmitting(false);
            alert('There was an error sending your message. Please try again.');
        }
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-white flex items-center justify-center"
                data-oid="fw58:m7"
            >
                <div className="text-center" data-oid="yc:0u6j">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="-dhhwz1"
                    ></div>
                    <p className="text-gray-600" data-oid="4u.fas9">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white" data-oid="v1fao_m">
                <ResponsiveHeader data-oid="0xpkat." />

                {/* Desktop Categories Bar - Only show on desktop */}
                <div className="hidden md:block" data-oid="m6_33j_">
                    <ClientOnly
                        fallback={<div style={{ height: '60px' }} data-oid="e7bka8r" />}
                        data-oid="4-onabp"
                    >
                        <CategoriesBar data-oid="7gqlp3t" />
                    </ClientOnly>
                </div>
                <div
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 text-center"
                    data-oid="5j765kx"
                >
                    <div
                        className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
                        data-oid="46jnw.g"
                    >
                        <div className="text-4xl md:text-6xl mb-4 md:mb-6" data-oid="u9xk1o.">
                            🔒
                        </div>
                        <h1
                            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4"
                            data-oid="3jd172s"
                        >
                            {tContact('title')} Required
                        </h1>
                        <p
                            className="text-base md:text-lg text-gray-600 mb-6 md:mb-8"
                            data-oid="cy2xi_q"
                        >
                            You need to be logged in to send us a message. This helps us provide you
                            with personalized support and track your inquiries.
                        </p>
                        <div
                            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
                            data-oid="0dtr49p"
                        >
                            <Link
                                href="/auth/login?redirect=/contact"
                                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 text-sm md:text-base"
                                data-oid="j5o1cy2"
                            >
                                Login to Continue
                            </Link>
                            <Link
                                href="/auth/register?redirect=/contact"
                                className="border border-[#1F1F6F] text-[#1F1F6F] px-6 py-3 rounded-lg font-semibold hover:bg-[#1F1F6F] hover:text-white transition-all duration-300 text-sm md:text-base"
                                data-oid="uobuvct"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Desktop Footer */}
                <div className="hidden md:block" data-oid="kv._4w3">
                    <ClientOnly data-oid=":82acrf">
                        <Footer data-oid="xaz-w:u" />
                    </ClientOnly>
                </div>
            </div>
        );
    }

    const contactInfo = [
        {
            icon: '📞',
            title: 'Phone Support',
            details: '+1 (555) 123-CURA',
            description: 'Available 24/7 for urgent inquiries',
        },
        {
            icon: '✉️',
            title: 'Email Support',
            details: 'cura.healthcare.service@gmail.com', // Fixed email address
            description: 'We respond within 24 hours',
        },
    ];

    return (
        <div className="min-h-screen bg-white" data-oid="if.1n3s">
            <ResponsiveHeader data-oid="c.b1njv" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="b6tqgel">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="1_55jpc" />}
                    data-oid="mh6lqit"
                >
                    <CategoriesBar data-oid="rfgng7o" />
                </ClientOnly>
            </div>

            {/* Hero Section */}
            <section
                className="py-8 md:py-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white"
                data-oid="epyoqo9"
            >
                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    data-oid="rzjockl"
                >
                    <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4" data-oid="vrs22cz">
                        {tContact('title')}
                    </h1>
                    <p className="text-base md:text-xl opacity-90" data-oid="9kerr:4">
                        We{"'"}re here to help with all your healthcare needs. Reach out anytime!
                    </p>
                </div>
            </section>

            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16"
                data-oid="8w8o:74"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12" data-oid="e5s.5.e">
                    {/* Contact Form */}
                    <div
                        className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8"
                        data-oid="bboxdmj"
                    >
                        <div className="mb-4 md:mb-6" data-oid="4g:ve85">
                            <h2
                                className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
                                data-oid="eebpp34"
                            >
                                Send us a Message
                            </h2>
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4"
                                data-oid=".-ndcq:"
                            >
                                <div className="flex items-center space-x-3" data-oid=":gu4qjx">
                                    <div
                                        className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                                        data-oid="a2ju9-t"
                                    >
                                        <span
                                            className="text-blue-600 font-semibold text-sm md:text-base"
                                            data-oid="7ckbb-a"
                                        >
                                            {user?.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1" data-oid="6..:g2u">
                                        <p
                                            className="font-medium text-gray-900 text-sm md:text-base truncate"
                                            data-oid="lole.d_"
                                        >
                                            {user?.name}
                                        </p>
                                        <p
                                            className="text-xs md:text-sm text-gray-600 truncate"
                                            data-oid="t7mbyz2"
                                        >
                                            {user?.email}
                                        </p>
                                        <p
                                            className="text-xs text-blue-600 capitalize"
                                            data-oid="e47eh68"
                                        >
                                            {user?.role} Account
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 md:space-y-6"
                            data-oid="-zl7dv7"
                        >
                            <div data-oid="copmqfs">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="417a0hg"
                                >
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                    data-oid="ahx3vht"
                                >
                                    <option value="general" data-oid="iz8ax07">
                                        General Inquiry
                                    </option>
                                    <option value="prescription" data-oid="qx5q5g3">
                                        Prescription Help
                                    </option>
                                    <option value="order" data-oid="soiupla">
                                        Order Support
                                    </option>
                                    <option value="technical" data-oid="zji5plg">
                                        Technical Issue
                                    </option>
                                    <option value="pharmacy" data-oid="a5mi-d:">
                                        Pharmacy Partnership
                                    </option>
                                    <option value="urgent" data-oid="0qzo2rp">
                                        Urgent Issue
                                    </option>
                                </select>
                            </div>

                            <div data-oid="w-kvmw0">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="3i47ihk"
                                >
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                    placeholder="Brief description of your inquiry"
                                    data-oid=".c80-:s"
                                />
                            </div>

                            <div data-oid="5f4wxe7">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="2a:hy_w"
                                >
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300 resize-none"
                                    placeholder="Please provide details about your inquiry..."
                                    data-oid="1or3cy_"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-6 rounded-lg md:rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                data-oid="3r04mf2"
                            >
                                {isSubmitting ? (
                                    <div
                                        className="flex items-center justify-center"
                                        data-oid="q3y9mz_"
                                    >
                                        <div
                                            className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                            data-oid="bi-u:v5"
                                        ></div>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6 md:space-y-8" data-oid="_5uk_dp">
                        {/* Contact Methods */}
                        <div
                            className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8"
                            data-oid="28j1uhy"
                        >
                            <h2
                                className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6"
                                data-oid="qs7vyb2"
                            >
                                Get in Touch
                            </h2>
                            <div className="space-y-4 md:space-y-6" data-oid="qmxexla">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3 md:space-x-4"
                                        data-oid="13qvwe3"
                                    >
                                        <div
                                            className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                                            data-oid="ubeg-v2"
                                        >
                                            <span className="text-lg md:text-xl" data-oid="dv2q-gj">
                                                {info.icon}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1" data-oid="pzobmtl">
                                            <h3
                                                className="font-semibold text-gray-900 text-sm md:text-base"
                                                data-oid="bzig_1y"
                                            >
                                                {info.title}
                                            </h3>
                                            <p
                                                className="text-[#1F1F6F] font-medium text-sm md:text-base break-all md:break-normal"
                                                data-oid="wu9h31_"
                                            >
                                                {info.details}
                                            </p>
                                            <p
                                                className="text-xs md:text-sm text-gray-600"
                                                data-oid="hqzjm3-"
                                            >
                                                {info.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="czw06i9">
                <ClientOnly data-oid="kie7000">
                    <Footer data-oid="f-ort8o" />
                </ClientOnly>
            </div>

            {/* Mobile Bottom Padding */}
            <div className="h-20 md:hidden" data-oid="hz5laxg"></div>
        </div>
    );
}
