'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { Footer } from '@/components/layout/Footer';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

export default function PharmacyRegisterPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const isMobile = useIsMobile();
    const [formData, setFormData] = useState({
        pharmacyName: '',
        ownerName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        address: '',
        city: '',
        governorate: '',
        operatingHours: '',
        description: '',
        website: '',
        socialMedia: '',
        category: 'new-application',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create pharmacy application data
            const applicationData = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                status: 'pending',
                type: 'pharmacy_application',
                // User information (if logged in)
                userId: user?.id || null,
                userName: user?.name || formData.ownerName,
                userEmail: user?.email || formData.email,
                userRole: user?.role || 'guest',
                // Pharmacy information
                pharmacyName: formData.pharmacyName,
                ownerName: formData.ownerName,
                email: formData.email,
                phone: formData.phone,
                licenseNumber: formData.licenseNumber,
                address: formData.address,
                city: formData.city,
                governorate: formData.governorate,
                operatingHours: formData.operatingHours,
                description: formData.description,
                website: formData.website,
                socialMedia: formData.socialMedia,
                category: formData.category,
                // Additional metadata
                priority: 'normal',
                source: 'pharmacy_registration_page',
                applicationStep: 'initial_submission',
            };

            // Store in localStorage for admin dashboard
            const existingApplications = JSON.parse(
                localStorage.getItem('pharmacy_applications') || '[]',
            );
            existingApplications.unshift(applicationData);
            localStorage.setItem('pharmacy_applications', JSON.stringify(existingApplications));

            // Also store in admin messages for notification
            const existingMessages = JSON.parse(localStorage.getItem('admin_messages') || '[]');
            const messageData = {
                ...applicationData,
                type: 'pharmacy_application_notification',
                subject: `New Pharmacy Application: ${formData.pharmacyName}`,
                message: `A new pharmacy application has been submitted for ${formData.pharmacyName} in ${formData.city}, ${formData.governorate}. License Number: ${formData.licenseNumber}`,
            };
            existingMessages.unshift(messageData);
            localStorage.setItem('admin_messages', JSON.stringify(existingMessages));

            setIsSubmitting(false);
            alert(
                "Thank you for your application! We'll review it and get back to you within 3-5 business days.",
            );

            // Reset form
            setFormData({
                pharmacyName: '',
                ownerName: '',
                email: '',
                phone: '',
                licenseNumber: '',
                address: '',
                city: '',
                governorate: '',
                operatingHours: '',
                description: '',
                website: '',
                socialMedia: '',
                category: 'new-application',
            });
        } catch (error) {
            setIsSubmitting(false);
            alert('There was an error submitting your application. Please try again.');
        }
    };

    const governorateOptions = [
        'Cairo',
        'Alexandria',
        'Giza',
        'Qalyubia',
        'Port Said',
        'Suez',
        'Luxor',
        'Aswan',
        'Asyut',
        'Beheira',
        'Beni Suef',
        'Dakahlia',
        'Damietta',
        'Fayyum',
        'Gharbia',
        'Ismailia',
        'Kafr el-Sheikh',
        'Matrouh',
        'Minya',
        'Monufia',
        'New Valley',
        'North Sinai',
        'Qena',
        'Red Sea',
        'Sharqia',
        'Sohag',
        'South Sinai',
    ];

    return (
        <div className="min-h-screen bg-white" data-oid="at4aa:f">
            <ResponsiveHeader data-oid="03bh18h" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="pblw60r">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="88l69_y" />}
                    data-oid="s9dx.-p"
                >
                    <CategoriesBar data-oid="vdcbxy4" />
                </ClientOnly>
            </div>

            {/* Hero Section */}
            <section
                className="py-8 md:py-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white"
                data-oid="zi3wh9w"
            >
                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    data-oid="cmz-spl"
                >
                    <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4" data-oid="6:-r0ur">
                        Join CURA Pharmacy Network
                    </h1>
                    <p className="text-base md:text-xl opacity-90 mb-4 md:mb-6" data-oid="jex0qjd">
                        Partner with Egypt{"'"}s leading online pharmacy platform and expand your reach
                    </p>
                    <div
                        className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm"
                        data-oid="3e8uz_0"
                    >
                        <div className="flex items-center space-x-2" data-oid=".p_8kac">
                            <span
                                className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"
                                data-oid="a.t46sj"
                            ></span>
                            <span data-oid="jkek0.4">Increased Customer Base</span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="974owq0">
                            <span
                                className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"
                                data-oid="61xdt66"
                            ></span>
                            <span data-oid="mc61km1">Digital Platform Integration</span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="k4wsraw">
                            <span
                                className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"
                                data-oid="jxfj726"
                            ></span>
                            <span data-oid="ti-w:07">Marketing Support</span>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="njhvvz8">
                            <span
                                className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"
                                data-oid="cnzezbw"
                            ></span>
                            <span data-oid="2ty.eyp">Training & Support</span>
                        </div>
                    </div>
                </div>
            </section>

            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16"
                data-oid="4c15ln."
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12" data-oid="484txwj">
                    {/* Application Form */}
                    <div className="lg:col-span-2" data-oid="zgzqei5">
                        <div
                            className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8"
                            data-oid="ewf6_ca"
                        >
                            <div className="mb-4 md:mb-6" data-oid="04i:6o5">
                                <h2
                                    className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
                                    data-oid="30c3gim"
                                >
                                    Pharmacy Application Form
                                </h2>
                                <p
                                    className="text-gray-600 text-sm md:text-base"
                                    data-oid="f_z035o"
                                >
                                    Please fill out all required information to join our network
                                </p>
                                {isAuthenticated && user && (
                                    <div
                                        className="mt-3 md:mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4"
                                        data-oid="q7f0r0d"
                                    >
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid=".90xsy6"
                                        >
                                            <div
                                                className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                                                data-oid="p3k.fkp"
                                            >
                                                <span
                                                    className="text-blue-600 font-semibold text-sm md:text-base"
                                                    data-oid="lcth6g8"
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1" data-oid="7rn2-g4">
                                                <p
                                                    className="font-medium text-gray-900 text-sm md:text-base truncate"
                                                    data-oid="-_z1fbd"
                                                >
                                                    {user.name}
                                                </p>
                                                <p
                                                    className="text-xs md:text-sm text-gray-600 truncate"
                                                    data-oid="cfm785o"
                                                >
                                                    {user.email}
                                                </p>
                                                <p
                                                    className="text-xs text-blue-600"
                                                    data-oid="flkjji0"
                                                >
                                                    Logged in as {user.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 md:space-y-6"
                                data-oid="kk_iasb"
                            >
                                {/* Basic Information */}
                                <div
                                    className="border-b border-gray-200 pb-4 md:pb-6"
                                    data-oid="cyjwh71"
                                >
                                    <h3
                                        className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4"
                                        data-oid="427vkpo"
                                    >
                                        Basic Information
                                    </h3>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                                        data-oid="oehocgr"
                                    >
                                        <div data-oid="h7b__6p">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="w0as3ek"
                                            >
                                                Pharmacy Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="pharmacyName"
                                                value={formData.pharmacyName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="Enter pharmacy name"
                                                data-oid="ra.x8zk"
                                            />
                                        </div>
                                        <div data-oid="b1a.oix">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="euxj5ps"
                                            >
                                                Owner/Manager Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="ownerName"
                                                value={formData.ownerName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="Enter owner/manager name"
                                                data-oid=".nspz6c"
                                            />
                                        </div>
                                        <div data-oid="5b_ymn0">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="c2a.8gi"
                                            >
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="pharmacy@example.com"
                                                data-oid="itn9ewg"
                                            />
                                        </div>
                                        <div data-oid="9_-8kf6">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="oeq.wf5"
                                            >
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="+20 XXX XXX XXXX"
                                                data-oid="-9c9o12"
                                            />
                                        </div>
                                        <div className="md:col-span-2" data-oid="ns3ms9-">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="xfg7tln"
                                            >
                                                Pharmacy License Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={formData.licenseNumber}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="Enter license number"
                                                data-oid="4-qeuyz"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div
                                    className="border-b border-gray-200 pb-4 md:pb-6"
                                    data-oid="-jl7ywm"
                                >
                                    <h3
                                        className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4"
                                        data-oid="r9i6138"
                                    >
                                        Location Information
                                    </h3>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                                        data-oid="uzc.20q"
                                    >
                                        <div className="md:col-span-2" data-oid="ff84r7o">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="go.1ksu"
                                            >
                                                Full Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="Street address, building number, etc."
                                                data-oid="wrt-x90"
                                            />
                                        </div>
                                        <div data-oid="mfsq_xf">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="26hx_ea"
                                            >
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="Enter city"
                                                data-oid="qpd7kqs"
                                            />
                                        </div>
                                        <div data-oid="od31yt_">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="7ad_e:i"
                                            >
                                                Governorate *
                                            </label>
                                            <select
                                                name="governorate"
                                                value={formData.governorate}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                data-oid="jrww112"
                                            >
                                                <option value="" data-oid="xoq7_lo">
                                                    Select Governorate
                                                </option>
                                                {governorateOptions.map((gov) => (
                                                    <option
                                                        key={gov}
                                                        value={gov}
                                                        data-oid="4qum56g"
                                                    >
                                                        {gov}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2" data-oid="7.zg97_">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="a.yom2a"
                                            >
                                                Operating Hours *
                                            </label>
                                            <input
                                                type="text"
                                                name="operatingHours"
                                                value={formData.operatingHours}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="e.g., Mon-Fri: 8AM-10PM, Sat-Sun: 9AM-9PM"
                                                data-oid="sx96l-c"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Business Information */}
                                <div
                                    className="border-b border-gray-200 pb-4 md:pb-6"
                                    data-oid="jtydhjs"
                                >
                                    <h3
                                        className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4"
                                        data-oid="eze3kc_"
                                    >
                                        Business Information
                                    </h3>
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                                        data-oid="8n7ifme"
                                    >
                                        <div data-oid="13loajn">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="z227-x7"
                                            >
                                                Website (Optional)
                                            </label>
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="https://yourpharmacy.com"
                                                data-oid="digkyxq"
                                            />
                                        </div>
                                        <div data-oid="n9o9:wy">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                data-oid="53fxqub"
                                            >
                                                Social Media (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="socialMedia"
                                                value={formData.socialMedia}
                                                onChange={handleInputChange}
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300"
                                                placeholder="Facebook, Instagram, etc."
                                                data-oid="xo-6wzj"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div data-oid="-ng_lje">
                                    <h3
                                        className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4"
                                        data-oid="s2luqak"
                                    >
                                        Additional Information
                                    </h3>
                                    <div data-oid="y:rks2g">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                            data-oid="h2osltj"
                                        >
                                            Tell us about your pharmacy
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] transition-all duration-300 resize-none"
                                            placeholder="Describe your pharmacy, specializations, years in business, etc."
                                            data-oid="fry1xwv"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-6 rounded-lg md:rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                    data-oid="4:wlrqy"
                                >
                                    {isSubmitting ? (
                                        <div
                                            className="flex items-center justify-center"
                                            data-oid="84mum7i"
                                        >
                                            <div
                                                className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                                data-oid=".0dcq_1"
                                            ></div>
                                            Submitting Application...
                                        </div>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Benefits & Information */}
                    <div className="space-y-6 md:space-y-8" data-oid="w27j29t">
                        {/* Contact Information */}
                        <div
                            className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6"
                            data-oid="-8i4x-m"
                        >
                            <h3
                                className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4"
                                data-oid="rl5a-7r"
                            >
                                Need Help?
                            </h3>
                            <div className="space-y-3" data-oid="jne6u8o">
                                <div className="flex items-center space-x-3" data-oid="gpc291_">
                                    <span
                                        className="text-xl md:text-2xl flex-shrink-0"
                                        data-oid="jvg4j7v"
                                    >
                                        📞
                                    </span>
                                    <div className="min-w-0 flex-1" data-oid="pc77csj">
                                        <p
                                            className="font-semibold text-gray-900 text-sm md:text-base"
                                            data-oid="k23rwww"
                                        >
                                            Partnership Support
                                        </p>
                                        <p
                                            className="text-xs md:text-sm text-gray-600"
                                            data-oid="q6q5wuj"
                                        >
                                            +20 XXX XXX XXXX
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3" data-oid="gs3xa-p">
                                    <span
                                        className="text-xl md:text-2xl flex-shrink-0"
                                        data-oid="0yqtf4_"
                                    >
                                        ✉️
                                    </span>
                                    <div className="min-w-0 flex-1" data-oid="vh_ms9f">
                                        <p
                                            className="font-semibold text-gray-900 text-sm md:text-base"
                                            data-oid="w4r9iat"
                                        >
                                            Email Support
                                        </p>
                                        <p
                                            className="text-xs md:text-sm text-gray-600 break-all md:break-normal"
                                            data-oid="qr.j0dk"
                                        >
                                            cura.healthcare.servic@gmail.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="x24reo-">
                <ClientOnly data-oid="9ty0obk">
                    <Footer data-oid="39rez4_" />
                </ClientOnly>
            </div>

            {/* Mobile Bottom Padding */}
            <div className="h-20 md:hidden" data-oid="d6q:wpl"></div>
        </div>
    );
}
