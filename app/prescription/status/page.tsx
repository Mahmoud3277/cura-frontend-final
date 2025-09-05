'use client';
import { useSearchParams } from 'next/navigation';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { PrescriptionStatusTracker } from '@/components/prescription/PrescriptionStatusTracker';

export default function PrescriptionStatusPage() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { t } = useTranslation();
    const success = searchParams.get('success');
    
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50"
            data-oid="v5kat-7"
        >
            <ResponsiveHeader data-oid="-x2ulhu" />

            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block" data-oid="v9026j-">
                <ClientOnly
                    fallback={<div style={{ height: '60px' }} data-oid="4-v42fy" />}
                    data-oid="ssnq:a-"
                >
                    <CategoriesBar data-oid="qe4-2y3" />
                </ClientOnly>
            </div>

            <main className="py-6 md:py-12" data-oid="tieoecb">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="w1e8x.:">
                    {/* Breadcrumb - Hidden on mobile */}
                    <nav className="mb-4 md:mb-8 hidden md:block" data-oid="d609b8i">
                        <ol
                            className="flex items-center space-x-2 text-sm text-gray-500"
                            data-oid="bwez9qm"
                        >
                            <li data-oid="ksge.9:">
                                <a
                                    href="/"
                                    className="hover:text-[#1F1F6F] transition-colors duration-200"
                                    data-oid="3m6n0-z"
                                >
                                    {t('navigation.home')}
                                </a>
                            </li>
                            <li data-oid="vtxt4rp">
                                <span className="mx-2" data-oid="r0:q3b-">
                                    /
                                </span>
                            </li>
                            <li className="text-[#1F1F6F] font-medium" data-oid="qqh29f6">
                                {t('prescription.status.breadcrumb')}
                            </li>
                        </ol>
                    </nav>

                    {/* Success Message */}
                    {success && (
                        <div
                            className="mb-4 md:mb-8 p-4 md:p-6 bg-green-50 border border-green-200 rounded-xl md:rounded-2xl"
                            data-oid="yjiv4kk"
                        >
                            <div className="flex items-center space-x-3" data-oid="9.ls1wu">
                                <svg
                                    className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid="iw87umd"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                        data-oid="atw:dm-"
                                    />
                                </svg>
                                <div data-oid="win3fka">
                                    <h3
                                        className="font-semibold text-green-900 mb-1 text-sm md:text-base"
                                        data-oid="q.dp2:0"
                                    >
                                        {t('prescription.status.successMessage.title')}
                                    </h3>
                                    <p
                                        className="text-green-800 text-xs md:text-sm"
                                        data-oid="-g8-o3."
                                    >
                                        {t('prescription.status.successMessage.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-6 md:mb-12" data-oid="3o8tow3">
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                            data-oid="s2qh72."
                        >
                            <svg
                                className="w-8 h-8 md:w-10 md:h-10 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                data-oid="gf0a-p7"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                                    clipRule="evenodd"
                                    data-oid="gr.rmm3"
                                />

                                <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6h-3a2 2 0 00-2 2v3H6a2 2 0 01-2-2V5zm8 8a1 1 0 011-1h3v2a2 2 0 01-2 2h-2v-3z"
                                    clipRule="evenodd"
                                    data-oid="1po.d8z"
                                />
                            </svg>
                        </div>
                        <h1
                            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                            data-oid="u0cd1.j"
                        >
                            {t('prescription.status.title')}
                        </h1>
                        <p
                            className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4"
                            data-oid="978u2ur"
                        >
                            {t('prescription.status.description')}
                        </p>
                    </div>

                    {/* Auth Check */}
                    {!user && (
                        <div
                            className="mb-4 md:mb-8 p-4 md:p-6 bg-blue-50 border border-blue-200 rounded-xl md:rounded-2xl"
                            data-oid="yb-5y7b"
                        >
                            <div
                                className="flex items-start md:items-center space-x-3"
                                data-oid="ce0:2r."
                            >
                                <svg
                                    className="w-5 h-5 md:w-6 md:h-6 text-blue-500 flex-shrink-0 mt-0.5 md:mt-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    data-oid="2yj.z4h"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                        data-oid="2p_557c"
                                    />
                                </svg>
                                <div data-oid="ab29gym">
                                    <h3
                                        className="font-semibold text-blue-900 mb-1 text-sm md:text-base"
                                        data-oid="anhs7i:"
                                    >
                                        {t('prescription.status.authPrompt.title')}
                                    </h3>
                                    <p
                                        className="text-blue-800 text-xs md:text-sm mb-3"
                                        data-oid="8v4g9m6"
                                    >
                                        {t('prescription.status.authPrompt.description')}
                                    </p>
                                    <div
                                        className="flex flex-col sm:flex-row gap-2 sm:gap-3"
                                        data-oid="z5v_12h"
                                    >
                                        <a
                                            href="/auth/login"
                                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                                            data-oid="tn85u9-"
                                        >
                                            {t('prescription.status.authPrompt.signIn')}
                                        </a>
                                        <a
                                            href="/auth/register"
                                            className="inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 text-center"
                                            data-oid="09i626n"
                                        >
                                            {t('prescription.status.authPrompt.createAccount')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Prescription Status Tracker */}
                    <PrescriptionStatusTracker showFilters={true} data-oid="nptbklf" />

                    {/* Help Section */}
                    <div
                        className="mt-6 md:mt-12 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
                        data-oid="44a.as2"
                    >
                        <h2
                            className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 text-center"
                            data-oid="dmlt.pc"
                        >
                            {t('prescription.status.help.title')}
                        </h2>
                        <div
                            className="grid grid-cols-2 gap-4 md:gap-8 max-w-md mx-auto"
                            data-oid="4km1b8l"
                        >
                            <div className="text-center" data-oid="ozjy8o9">
                                <div
                                    className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3"
                                    data-oid="7xst74-"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="w3-0def"
                                    >
                                        <path
                                            d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                                            data-oid=":2lh:db"
                                        />
                                    </svg>
                                </div>
                                <h3
                                    className="font-medium text-gray-900 mb-1 text-sm"
                                    data-oid="0o.7_nf"
                                >
                                    {t('prescription.status.help.callUs')}
                                </h3>
                                <p className="text-gray-600 text-xs" data-oid="czawn42">
                                    {t('prescription.status.help.phone')}
                                </p>
                            </div>

                            <div className="text-center" data-oid="vx-axk1">
                                <div
                                    className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3"
                                    data-oid="m4j_5:u"
                                >
                                    <svg
                                        className="w-5 h-5 text-purple-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="110.7xi"
                                    >
                                        <path
                                            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                                            data-oid="hn20azj"
                                        />

                                        <path
                                            d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                                            data-oid="7u-cm5b"
                                        />
                                    </svg>
                                </div>
                                <h3
                                    className="font-medium text-gray-900 mb-1 text-sm"
                                    data-oid="xztzdlf"
                                >
                                    {t('prescription.status.help.email')}
                                </h3>
                                <p className="text-gray-600 text-xs" data-oid="5vf4tqd">
                                    {t('prescription.status.help.emailAddress')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Desktop Footer */}
            <div className="hidden md:block" data-oid="kj_t02m">
                <ClientOnly data-oid="i4du4vt">
                    <Footer data-oid="oddenpt" />
                </ClientOnly>
            </div>

            {/* Mobile Footer */}
            <div className="block md:hidden" data-oid="mobile-footer">
                <footer
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-8 px-4"
                    data-oid="irfg6:b"
                >
                    <div className="max-w-sm mx-auto" data-oid="ldt86ev">
                        <div className="grid grid-cols-3 gap-6 mb-6" data-oid="pani:qr">
                            {/* CURA Brand */}
                            <div data-oid="xobfoa3">
                                <h3 className="text-lg font-bold mb-3" data-oid="e472n6m">
                                    CURA
                                </h3>
                            </div>

                            {/* Quick Links */}
                            <div data-oid="lwq6:g.">
                                <h4 className="text-sm font-semibold mb-3" data-oid="mveh2lu">
                                    {t('footer.quickLinks')}
                                </h4>
                                <ul className="space-y-2" data-oid="qdhbhkk">
                                    <li data-oid="qc-sih1">
                                        <a
                                            href="/contact"
                                            className="text-xs text-gray-300 hover:text-white transition-colors"
                                            data-oid="dp3w.x2"
                                        >
                                            {t('navigation.contact')}
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Categories */}
                            <div data-oid="al48w_a">
                                <h4 className="text-sm font-semibold mb-3" data-oid="1ysmubp">
                                    {t('footer.categories')}
                                </h4>
                                <ul className="space-y-2" data-oid="m8_nin2">
                                    <li data-oid="giea_8e">
                                        <a
                                            href="/medicine"
                                            className="text-xs text-gray-300 hover:text-white transition-colors"
                                            data-oid="ifgyu9i"
                                        >
                                            {t('footer.medicines')}
                                        </a>
                                    </li>
                                    <li data-oid="xadmz6e">
                                        <a
                                            href="/vitamins"
                                            className="text-xs text-gray-300 hover:text-white transition-colors"
                                            data-oid="kh1rsd-"
                                        >
                                            Vitamins
                                        </a>
                                    </li>
                                    <li data-oid="6_0jln:">
                                        <a
                                            href="/skincare"
                                            className="text-xs text-gray-300 hover:text-white transition-colors"
                                            data-oid="7dk9yxn"
                                        >
                                            Skin Care
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* For Pharmacies */}
                        <div className="mb-6" data-oid="nqu30yf">
                            <h4 className="text-sm font-semibold mb-3" data-oid="sirk1k1">
                                {t('footer.forPharmacies')}
                            </h4>
                            <a
                                href="/register-pharmacy"
                                className="text-xs text-gray-300 hover:text-white transition-colors"
                                data-oid="c5q8vfx"
                            >
                                {t('footer.registerPharmacy')}
                            </a>
                        </div>

                        {/* Copyright */}
                        <div className="pt-4 border-t border-gray-600" data-oid="vgdq3h.">
                            <p className="text-xs text-gray-300 text-center" data-oid=".-uqgxr">
                                {t('footer.copyright')}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
