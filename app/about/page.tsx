'use client';

import Link from 'next/link';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { ClientOnly } from '@/components/common/ClientOnly';
import { FloatingNavigation } from '@/components/FloatingNavigation';
export default function AboutPage() {
    const teamMembers = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Chief Medical Officer',
            image: '/api/placeholder/300/300',
            bio: 'Board-certified pharmacist with 15+ years of experience in clinical pharmacy and patient care.',
        },
        {
            name: 'Michael Chen',
            role: 'CEO & Founder',
            image: '/api/placeholder/300/300',
            bio: 'Healthcare technology entrepreneur passionate about making healthcare accessible to everyone.',
        },
        {
            name: 'Dr. Emily Rodriguez',
            role: 'Head of Pharmacy Operations',
            image: '/api/placeholder/300/300',
            bio: 'Licensed pharmacist specializing in medication therapy management and patient counseling.',
        },
        {
            name: 'David Kim',
            role: 'CTO',
            image: '/api/placeholder/300/300',
            bio: 'Technology leader with expertise in healthcare systems and secure data management.',
        },
    ];

    const stats = [
        { number: '50,000+', label: 'Patients Served' },
        { number: '500+', label: 'Partner Pharmacies' },
        { number: '99.9%', label: 'Uptime Reliability' },
        { number: '24/7', label: 'Customer Support' },
    ];

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50"
            data-oid="3qrjfif"
        >
            <ResponsiveHeader data-oid="mcwobv2" />

            {/* Hero Section */}
            <section
                className="py-20 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white"
                data-oid="6usrf:r"
            >
                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    data-oid="55i6x:h"
                >
                    <h1 className="text-5xl font-bold mb-6" data-oid="q47du7o">
                        About CURA
                    </h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto" data-oid="nqwwj.t">
                        We{"'"}re revolutionizing healthcare delivery by connecting patients with
                        trusted pharmacies through our innovative digital platform, making quality
                        healthcare accessible to everyone.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16" data-oid="56_4ck6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="2a._ilo">
                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        data-oid="v4eph1e"
                    >
                        <div data-oid="93ng-5g">
                            <h2
                                className="text-3xl font-bold text-gray-900 mb-6"
                                data-oid="3y_ppjn"
                            >
                                Our Mission
                            </h2>
                            <p className="text-lg text-gray-600 mb-6" data-oid="uz60t.b">
                                At CURA, we believe that everyone deserves access to quality
                                healthcare and medications. Our mission is to bridge the gap between
                                patients and pharmacies through technology, ensuring safe,
                                convenient, and affordable healthcare delivery.
                            </p>
                            <p className="text-lg text-gray-600 mb-8" data-oid="4qgmnwy">
                                We work exclusively with licensed pharmacies and certified
                                healthcare professionals to maintain the highest standards of safety
                                and quality in every interaction.
                            </p>
                            <div className="flex space-x-4" data-oid="jkjqkvz">
                                <div className="bg-blue-100 p-4 rounded-xl" data-oid="e_tg.:x">
                                    <h3
                                        className="font-semibold text-blue-900 mb-2"
                                        data-oid="rig.gng"
                                    >
                                        Safety First
                                    </h3>
                                    <p className="text-sm text-blue-800" data-oid="sv5.tjh">
                                        All medications verified by licensed pharmacists
                                    </p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-xl" data-oid="tmfuvox">
                                    <h3
                                        className="font-semibold text-green-900 mb-2"
                                        data-oid="u0tw33_"
                                    >
                                        Convenience
                                    </h3>
                                    <p className="text-sm text-green-800" data-oid="88btn72">
                                        Order from home, delivered to your door
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 text-center"
                            data-oid=":gg.evc"
                        >
                            <div className="text-6xl mb-4" data-oid="kh0qxdt">
                                🏥
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-900 mb-4"
                                data-oid="9s_xyir"
                            >
                                Healthcare Innovation
                            </h3>
                            <p className="text-gray-600" data-oid="5wq3wm7">
                                Combining traditional pharmacy expertise with modern technology to
                                create a seamless healthcare experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white" data-oid=".9sjkm9">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="vczuaq9">
                    <h2
                        className="text-3xl font-bold text-center text-gray-900 mb-12"
                        data-oid="m2fpxhu"
                    >
                        Our Impact
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-oid="wibbj70">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center" data-oid="wonwbe8">
                                <div
                                    className="text-4xl font-bold text-[#1F1F6F] mb-2"
                                    data-oid="461mwzt"
                                >
                                    {stat.number}
                                </div>
                                <div className="text-gray-600" data-oid=":u2lmxz">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16" data-oid="yku3ghp">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="8o6jvu_">
                    <h2
                        className="text-3xl font-bold text-center text-gray-900 mb-12"
                        data-oid="ww96qz:"
                    >
                        Meet Our Team
                    </h2>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        data-oid="kyksykc"
                    >
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                                data-oid="v7u2nw_"
                            >
                                <div
                                    className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                                    data-oid="tyj:f1r"
                                >
                                    <span className="text-gray-400" data-oid="v3w:gsd">
                                        Team Photo
                                    </span>
                                </div>
                                <div className="p-6" data-oid="l2qhy_c">
                                    <h3 className="font-bold text-gray-900 mb-1" data-oid="glbzd_4">
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-[#1F1F6F] font-medium mb-3"
                                        data-oid="g9v72-v"
                                    >
                                        {member.role}
                                    </p>
                                    <p className="text-sm text-gray-600" data-oid="kozrdun">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white" data-oid="kul8a5_">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="wefya0d">
                    <h2
                        className="text-3xl font-bold text-center text-gray-900 mb-12"
                        data-oid="xyflxtp"
                    >
                        Our Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-oid="311ntkt">
                        <div className="text-center p-6" data-oid="ppe37h9">
                            <div
                                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="p3b5u.e"
                            >
                                <span className="text-2xl" data-oid=":a5bpw5">
                                    🛡️
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3" data-oid="t_4d3tg">
                                Trust & Safety
                            </h3>
                            <p className="text-gray-600" data-oid="j6oja3o">
                                We prioritize patient safety above all else, working only with
                                licensed professionals and maintaining strict quality standards.
                            </p>
                        </div>
                        <div className="text-center p-6" data-oid="cf6zmpq">
                            <div
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="h5-xmkc"
                            >
                                <span className="text-2xl" data-oid="6jbxr2m">
                                    💡
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3" data-oid="_4:i82-">
                                Innovation
                            </h3>
                            <p className="text-gray-600" data-oid="j6z7y1:">
                                We continuously innovate to improve healthcare accessibility and
                                create better experiences for patients and pharmacies.
                            </p>
                        </div>
                        <div className="text-center p-6" data-oid="ii_oonz">
                            <div
                                className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                data-oid="nxx0e85"
                            >
                                <span className="text-2xl" data-oid="bxv2oxj">
                                    ❤️
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3" data-oid="apt6rwz">
                                Compassion
                            </h3>
                            <p className="text-gray-600" data-oid="gem4d6t">
                                We understand that healthcare is personal, and we approach every
                                interaction with empathy and understanding.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                className="py-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white"
                data-oid="-ad25v5"
            >
                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    data-oid="w-3pwrm"
                >
                    <h2 className="text-3xl font-bold mb-6" data-oid="1bskfo0">
                        Ready to Experience Better Healthcare?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto" data-oid="7o.ptrv">
                        Join thousands of patients who trust CURA for their healthcare needs.
                    </p>
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        data-oid="5ozwksr"
                    >
                        <Link
                            href="/auth/register"
                            className="bg-white text-[#1F1F6F] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300"
                            data-oid="gvota5q"
                        >
                            Get Started Today
                        </Link>
                        <Link
                            href="/contact"
                            className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#1F1F6F] transition-all duration-300"
                            data-oid="z2t231-"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="xrfntc:">
                <ClientOnly data-oid="urj_ql5">
                    <Footer data-oid="tat6wul" />
                </ClientOnly>
            </div>

            {/* Mobile Floating Navigation - Only for Mobile */}
            <div className="block md:hidden" data-oid="h8n6djx">
                <ClientOnly data-oid="xgf-nye">
                    <FloatingNavigation data-oid="frbry:_" />
                </ClientOnly>
            </div>

            {/* Mobile Bottom Padding - Only for Mobile */}
            <div className="h-20 md:hidden" data-oid="-x5jb05"></div>
        </div>
    );
}
