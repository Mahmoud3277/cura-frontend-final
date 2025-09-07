'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, ShoppingCart, Pill, FileText, Clipboard } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { ClientOnly } from '@/components/common/ClientOnly';
import { PrescriptionUploadModal } from '@/components/prescription/PrescriptionUploadModal';
import { PrescriptionViewModal } from '@/components/prescription/PrescriptionViewModal';
import { prescriptionAPIService } from '@/lib/data/prescriptionWorkflow';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getAuthToken } from '@/lib/utils/cookies';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function CustomerPrescriptionsPage() {
    const router = useRouter();
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const {user} = useAuth();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>('');
    const [selectedPrescriptionData, setSelectedPrescriptionData] = useState<any>(null);

    // Helper function to translate medicine frequencies
    const translateFrequency = (frequency: string): string => {
        if (locale === 'ar') {
            const frequencyMap: { [key: string]: string } = {
                'Once daily': 'مرة واحدة يومياً',
                'Twice daily': 'مرتين يومياً',
                'Three times daily': 'ثلاث مرات يومياً',
                'As needed': 'عند الحاجة',
                'Every 8 hours': 'كل 8 ساعات',
                'Every 12 hours': 'كل 12 ساعة',
                'Before meals': 'قبل الوجبات',
                'After meals': 'بعد الوجبات',
                'At bedtime': 'عند النوم',
            };
            return frequencyMap[frequency] || frequency;
        }
        return frequency;
    };

    // Handler functions for button actions

    const handleViewPrescription = (prescriptionId: string) => {
        console.log('Viewing prescription document:', prescriptionId);
        const prescription = prescriptions.find((p) => p.id === prescriptionId);
        setSelectedPrescriptionId(prescriptionId);
        setSelectedPrescriptionData(prescription);
        setIsViewModalOpen(true);
    };

    const handleBuyAgain = (prescriptionId: string) => {
        console.log('Reordering prescription:', prescriptionId);
        // Navigate to medicine selection page for reordering
        router.push(`/prescription/medicines/${prescriptionId}`);
    };

    const handleSelectMedicines = (prescriptionId: string) => {
        console.log('Selecting medicines for prescription:', prescriptionId);
        // Navigate to medicine selection page
        router.push(`/prescription/medicines/${prescriptionId}`);
    };

    const handleUploadPrescription = () => {
        console.log('Opening prescription upload modal');
        setIsUploadModalOpen(true);
    };

    const handleUploadComplete = (files: any[], formData: any) => {
        console.log('Upload completed:', files, formData);
        // Handle successful upload
        setIsUploadModalOpen(false);
    };
    const getUser = async():Promise<string | undefined>=>{
        let token;
        if (typeof window !== 'undefined') {
            token = getAuthToken();
        }
        const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`,{
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
        if(user){
            const data = await user.json()
            console.log(data)
            return data.data.user._id;
        }
        return undefined;
    }
    const [prescriptions, setprescriptions] = useState<any[]>([]);
    const fetchPrescriptions = async()=>{
        console.log('fetching the prescriptions')
        const customerId = await getUser()
        if(customerId){
            const data = await prescriptionAPIService.getAllPrescriptions({customerId})
            if(data.data){
                console.log(data)
                setprescriptions(data.data)
            }
            else{
                console.log('error')
            }   
        }
    }
    useEffect(() => {
        if (user) {
            console.log(user);
            fetchPrescriptions();
        } else {
            console.log('no user');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <style jsx data-oid="w9hu20d">{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            {/* Mobile Layout */}
            <div className="block md:hidden min-h-screen bg-gray-50" data-oid="mobile-layout">
                <ResponsiveHeader data-oid="mobile-header" />

                <div className="px-4 py-6" data-oid="mobile-content">
                    <div className="mb-6" data-oid="mobile-title">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-oid="mobile-h1">
                            {tCustomer('prescriptions.title')}
                        </h1>
                        <div
                            className="h-1 w-16 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full"
                            data-oid="mobile-divider"
                        ></div>
                    </div>

                    {/* Mobile Summary */}
                    <div
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
                        data-oid="mobile-summary"
                    >
                        <div
                            className="flex items-center justify-between"
                            data-oid="mobile-summary-content"
                        >
                            <div data-oid="mobile-summary-text">
                                <p
                                    className="text-sm text-gray-600"
                                    data-oid="mobile-summary-label"
                                >
                                    {tCustomer('prescriptions.totalPrescriptions')}
                                </p>
                                <p
                                    className="text-xl font-bold text-[#1F1F6F]"
                                    data-oid="mobile-summary-count"
                                >
                                    {prescriptions.length}
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                                data-oid="mobile-summary-icon"
                            >
                                <Clipboard
                                    className="w-5 h-5 text-blue-600"
                                    data-oid="mobile-clipboard"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Upload Section */}
                    <div
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-4 rounded-xl mb-6"
                        data-oid="mobile-upload"
                    >
                        <div className="text-center" data-oid="mobile-upload-content">
                            <h2 className="text-lg font-bold mb-2" data-oid="mobile-upload-title">
                                {tCustomer('prescriptions.needUpload')}
                            </h2>
                            <p className="opacity-90 text-sm mb-4" data-oid="mobile-upload-desc">
                                {tCustomer('prescriptions.uploadDescription')}
                            </p>
                            <button
                                className="bg-white text-[#1F1F6F] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                                onClick={handleUploadPrescription}
                                data-oid="mobile-upload-btn"
                            >
                                {tCustomer('prescriptions.uploadPrescription')}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Prescriptions List */}
                    <div className="space-y-6" data-oid="mobile-prescriptions">
                        {prescriptions.map((prescription, index) => (
                            <div
                                key={prescription._id}
                                className="relative"
                                data-oid="mobile-prescription-wrapper"
                            >
                                {/* Mobile Prescription Number Badge */}
                                <div
                                    className="absolute -top-2 left-4 z-10"
                                    data-oid="mobile-prescription-badge"
                                >
                                    <span
                                        className="bg-[#1F1F6F] text-white px-2 py-1 rounded-full text-xs font-semibold"
                                        data-oid="mobile-badge-text"
                                    >
                                        #{index + 1}
                                    </span>
                                </div>

                                {/* Mobile Prescription Card */}
                                <div
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleViewPrescription(prescription.id)}
                                    data-oid="mobile-prescription-card"
                                >
                                    {/* Mobile Card Header */}
                                    <div
                                        className="flex items-start justify-between mb-4"
                                        data-oid="mobile-card-header"
                                    >
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="mobile-header-left"
                                        >
                                            <div
                                                className="w-10 h-10 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-lg flex items-center justify-center"
                                                data-oid="mobile-prescription-icon"
                                            >
                                                <FileText
                                                    className="w-5 h-5 text-white"
                                                    data-oid="mobile-file-icon"
                                                />
                                            </div>
                                            <div data-oid="mobile-prescription-info">
                                                <h3
                                                    className="text-base font-bold text-gray-900"
                                                    data-oid="mobile-prescription-id"
                                                >
                                                    {prescription.prescriptionNumber || prescription._id}
                                                </h3>
                                                <p
                                                    className="text-xs text-gray-600"
                                                    data-oid="mobile-prescription-date"
                                                >
                                                    {new Date(prescription.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right" data-oid="mobile-header-right">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    prescription.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : prescription.status === 'delivered'
                                                          ? 'bg-blue-100 text-blue-800'
                                                          : prescription.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                }`}
                                                data-oid="mobile-status-badge"
                                            >
                                                {tCustomer(
                                                    `prescriptions.statuses.${prescription.status}`,
                                                )}
                                            </span>
                                            <p
                                                className="text-sm font-bold text-[#1F1F6F] mt-1"
                                                data-oid="mobile-prescription-total"
                                            >
                                                {prescription.totalPrice ? `${prescription.totalPrice.toFixed(2)} EGP` : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mobile Medicines Preview */}
                                    <div className="mb-4" data-oid="mobile-medicines-preview">
                                        <div
                                            className="flex items-center space-x-2 mb-3"
                                            data-oid="mobile-medicines-header"
                                        >
                                            <Pill
                                                className="w-4 h-4 text-[#1F1F6F]"
                                                data-oid="mobile-pill-icon"
                                            />

                                            <span
                                                className="text-sm font-medium text-gray-700"
                                                data-oid="mobile-medicines-label"
                                            >
                                                {prescription?.medicines}{' '}
                                                {tCustomer('prescriptions.medicines')}
                                            </span>
                                        </div>

                                        {/* Mobile Medicine Cards - Horizontal Scrollable */}
                                        <div
                                            className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar"
                                            data-oid="mobile-medicines-scroll"
                                        >
                                            {prescription?.medications?.map((medicine, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex-shrink-0 w-32 bg-white p-2 rounded-lg border border-gray-200"
                                                    data-oid="mobile-medicine-card"
                                                >
                                                    <div
                                                        className="w-8 h-8 bg-gray-100 rounded-md overflow-hidden mx-auto mb-2"
                                                        data-oid="vaig_xl"
                                                    >
                                                        {medicine.image ? (
                                                            <img
                                                                src={medicine.image}
                                                                alt={medicine.name}
                                                                className="w-full h-full object-cover rounded"
                                                                onError={(e) => {
                                                                    // Hide the image and show fallback emoji on error
                                                                    const img = e.currentTarget;
                                                                    img.style.display = 'none';
                                                                    const container = img.parentElement;
                                                                    if (container) {
                                                                        const fallback = container.querySelector('.medicine-fallback-mobile');
                                                                        if (fallback) {
                                                                            (fallback as HTMLElement).style.display = 'flex';
                                                                        }
                                                                    }
                                                                }}
                                                                onLoad={(e) => {
                                                                    // Ensure fallback is hidden when image loads successfully
                                                                    const img = e.currentTarget;
                                                                    const container = img.parentElement;
                                                                    if (container) {
                                                                        const fallback = container.querySelector('.medicine-fallback-mobile');
                                                                        if (fallback) {
                                                                            (fallback as HTMLElement).style.display = 'none';
                                                                        }
                                                                    }
                                                                }}
                                                                data-oid="xvqlpj3"
                                                            />
                                                        ) : null}
                                                        <div
                                                            className="medicine-fallback-mobile w-full h-full bg-gray-200 rounded flex items-center justify-center"
                                                            style={{
                                                                display: medicine.image ? 'none' : 'flex'
                                                            }}
                                                        >
                                                            <span className="text-xs">💊</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center" data-oid="u3q643e">
                                                        <p
                                                            className="text-xs font-medium text-gray-900 truncate mb-1"
                                                            data-oid="8uv1bk3"
                                                        >
                                                            {medicine.name}
                                                        </p>
                                                        <p
                                                            className="text-xs text-gray-500 mb-1"
                                                            data-oid="f:afp02"
                                                        >
                                                            {medicine.duration}
                                                        </p>
                                                        <p
                                                            className="text-xs font-semibold text-[#1F1F6F]"
                                                            data-oid="1r51srs"
                                                        >
                                                            {medicine?.price?.toFixed(0)} EGP
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mobile Action Buttons */}
                                    <div
                                        className="flex justify-between items-center pt-3 border-t border-gray-100"
                                        data-oid="mobile-actions"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewPrescription(prescription.id);
                                            }}
                                            className="flex items-center space-x-1 text-[#1F1F6F] hover:text-[#14274E] font-medium text-sm"
                                            data-oid="mobile-view-btn"
                                        >
                                            <Eye className="w-4 h-4" data-oid="mobile-eye-icon" />
                                            <span data-oid="mobile-view-text">View</span>
                                        </button>
                                        {prescription.currentStatus === 'approved' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectMedicines(prescription._id);
                                                }}
                                                className="flex items-center space-x-1 bg-[#1F1F6F] text-white px-3 py-1.5 rounded-lg hover:bg-[#14274E] transition-colors text-sm"
                                                data-oid="mobile-select-btn"
                                            >
                                                <ShoppingCart
                                                    className="w-4 h-4"
                                                    data-oid="mobile-cart-icon"
                                                />

                                                <span data-oid="mobile-select-text">Select</span>
                                            </button>
                                        )}
                                        {prescription.currentStatus === 'Delivered' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBuyAgain(prescription._id);
                                                }}
                                                className="flex items-center space-x-1 bg-[#1F1F6F] text-white px-3 py-1.5 rounded-lg hover:bg-[#14274E] transition-colors text-sm"
                                                data-oid="mobile-buy-again-btn"
                                            >
                                                <ShoppingCart
                                                    className="w-4 h-4"
                                                    data-oid="mobile-buy-cart-icon"
                                                />

                                                <span data-oid="mobile-buy-again-text">
                                                    Buy Again
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Bottom Padding - reduced since no floating nav */}
                <div className="h-4 md:hidden" data-oid="mobile-bottom-padding"></div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block" data-oid="desktop-layout">
                <DashboardLayout
                    title={tCustomer('prescriptions.title')}
                    userType="customer"
                    data-oid="jupf9ey"
                >
                    <div className="space-y-6" data-oid="9gqjm.u">
                        {/* Summary card with just total prescriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6" data-oid="c6drc-a">
                            <div
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                                data-oid="k.0q_:8"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="asl1bf_"
                                >
                                    <div data-oid="naise:l">
                                        <p className="text-sm text-gray-600" data-oid="9zm75xz">
                                            {tCustomer('prescriptions.totalPrescriptions')}
                                        </p>
                                        <p
                                            className="text-2xl font-bold text-[#1F1F6F]"
                                            data-oid="gvibvr5"
                                        >
                                            {prescriptions.length}
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                                        data-oid="by3jk2n"
                                    >
                                        <Clipboard
                                            className="w-6 h-6 text-blue-600"
                                            data-oid="tmtu_tc"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload New Prescription */}
                        <div
                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-6 rounded-xl"
                            data-oid="0sd6x-c"
                        >
                            <div className="flex items-center justify-between" data-oid="c1-s4ru">
                                <div data-oid="9hzsxnx">
                                    <h2 className="text-xl font-bold mb-2" data-oid="etj54la">
                                        {tCustomer('prescriptions.needUpload')}
                                    </h2>
                                    <p className="opacity-90" data-oid="y1m8i-8">
                                        {tCustomer('prescriptions.uploadDescription')}
                                    </p>
                                </div>
                                <button
                                    className="bg-white text-[#1F1F6F] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    onClick={handleUploadPrescription}
                                    data-oid="sol.xf1"
                                >
                                    {tCustomer('prescriptions.uploadPrescription')}
                                </button>
                            </div>
                        </div>

                        {/* Filter Header */}
                        <div
                            className="bg-white rounded-xl shadow-sm border border-gray-100"
                            data-oid="sgf-wvv"
                        >
                            <div className="p-6 border-b border-gray-100" data-oid="1g4f5w8">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="xi1_iui"
                                >
                                    <h2
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="-_1ognt"
                                    >
                                        {tCustomer('prescriptions.prescriptionHistory')}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Prescriptions List - Each prescription as separate card */}
                        <div className="space-y-8" data-oid="qeuav2v">
                            {prescriptions.map((prescription, index) => {
                                return (
                                    <div
                                        key={prescription.id}
                                        className="relative"
                                        data-oid="0kmhews"
                                    >
                                        {/* Prescription Number Badge */}
                                        <div
                                            className="absolute -top-3 left-6 z-10"
                                            data-oid="-fvaisp"
                                        >
                                            <span
                                                className="bg-[#1F1F6F] text-white px-3 py-1 rounded-full text-xs font-semibold"
                                                data-oid="9alw_75"
                                            >
                                                {tCustomer(
                                                    'prescriptions.prescriptionNumber',
                                                ).replace('{number}', (index + 1).toString())}
                                            </span>
                                        </div>

                                        {/* Prescription Card */}
                                        <div
                                            className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:shadow-xl hover:border-[#1F1F6F]/20 transition-all duration-300 relative cursor-pointer"
                                            onClick={() =>
                                            handleViewPrescription(prescription.id)}
                                            data-oid="4mf_s8p"
                                        >
                                            <div className="p-8" data-oid="zr41m09">
                                                {/* Decorative Corner */}
                                                <div
                                                    className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#1F1F6F]/10 to-transparent rounded-tr-2xl"
                                                    data-oid="g1bquvj"
                                                ></div>

                                                {/* Prescription Header */}
                                                <div
                                                    className="flex items-center justify-between mb-6 relative z-10"
                                                    data-oid="ohhv_09"
                                                >
                                                    <div
                                                        className="flex items-center space-x-4"
                                                        data-oid="3fypm59"
                                                    >
                                                        <div
                                                            className="w-14 h-14 bg-gradient-to-br from-[#1F1F6F] to-[#14274E] rounded-xl flex items-center justify-center shadow-lg"
                                                            data-oid=".vukr_8"
                                                        >
                                                            <FileText
                                                                className="w-7 h-7 text-white"
                                                                data-oid="_oidc-d"
                                                            />
                                                        </div>
                                                        <div data-oid="tf:43qx">
                                                            <div
                                                                className="flex items-center space-x-2 mb-1"
                                                                data-oid="_-8kg18"
                                                            >
                                                                <h3
                                                                    className="text-xl font-bold text-gray-900"
                                                                    data-oid="-1:l7pl"
                                                                >
                                                                    {prescription.id}
                                                                </h3>
                                                                <span
                                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                        prescription.currentStatus ===
                                                                        'Processed'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : prescription.currentStatus ===
                                                                                'Delivered'
                                                                              ? 'bg-blue-100 text-blue-800'
                                                                              : prescription.currentStatus ===
                                                                                  'Pending'
                                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                                : 'bg-gray-100 text-gray-800'
                                                                    }`}
                                                                    data-oid="ose481y"
                                                                >
                                                                    {tCustomer(
                                                                        `prescriptions.statuses.${prescription.currentStatus.toLowerCase()}`,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p
                                                                className="text-sm text-gray-600 font-medium"
                                                                data-oid="a6ruioa"
                                                            >
                                                                {prescription.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right" data-oid="enrw7k2">
                                                        <p
                                                            className="text-2xl font-bold text-[#1F1F6F]"
                                                            data-oid="al_8oy2"
                                                        >
                                                            {prescription.total}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Main Content Grid - Prescription Image and Medicines */}
                                                <div
                                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
                                                    data-oid="av86-sx"
                                                >
                                                    {/* Prescription Images */}
                                                    <div className="space-y-4" data-oid="npyixtq">
                                                        <h4
                                                            className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                                            data-oid="sicb14o"
                                                        >
                                                            {tCustomer(
                                                                'prescriptions.prescriptionDocument',
                                                            )}
                                                            {prescription.files
                                                                .length > 1
                                                                ? locale === 'ar'
                                                                    ? 'ات'
                                                                    : 's'
                                                                : ''}
                                                            {prescription.files
                                                                .length > 1 && (
                                                                <span
                                                                    className="ml-2 text-xs bg-[#1F1F6F] text-white px-2 py-1 rounded-full"
                                                                    data-oid="ns9a8rz"
                                                                >
                                                                    {
                                                                        prescription
                                                                            .files
                                                                            .length
                                                                    }{' '}
                                                                    {tCustomer(
                                                                        'prescriptions.photos',
                                                                    )}
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <div
                                                            className="space-y-3 max-h-96 overflow-y-auto"
                                                            data-oid="ub61cvv"
                                                        >
                                                            {prescription.files.map(
                                                                (image, imageIndex) => (
                                                                    <div
                                                                        key={imageIndex}
                                                                        className="relative group"
                                                                        data-oid="ra5018i"
                                                                    >
                                                                        <div
                                                                            className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#1F1F6F]/30 transition-colors"
                                                                            data-oid="p2qid2v"
                                                                        >
                                                                            <img
                                                                                src={image.url}
                                                                                alt={`Prescription ${prescription.id} - Photo ${imageIndex + 1}`}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                                onError={(e) => {
                                                                                    e.currentTarget.src =
                                                                                        '/images/prescriptions/default-prescription.jpg';
                                                                                }}
                                                                                data-oid="87n1zca"
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center"
                                                                            data-oid="_l:h51m"
                                                                        >
                                                                            <div
                                                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                data-oid=":zlhqgz"
                                                                            >
                                                                                <Eye
                                                                                    className="w-8 h-8 text-white drop-shadow-lg"
                                                                                    data-oid="7a4r5l2"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {prescription
                                                                            .files
                                                                            .length > 1 && (
                                                                            <div
                                                                                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full"
                                                                                data-oid="x:7dlp4"
                                                                            >
                                                                                {imageIndex + 1}/
                                                                                {
                                                                                    prescription
                                                                                        .files
                                                                                        .length
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Prescribed Medicines */}
                                                    <div className="space-y-4" data-oid="00wi8j:">
                                                        <div
                                                            className="flex items-center space-x-2"
                                                            data-oid="o1yurwz"
                                                        >
                                                            <Pill
                                                                className="w-5 h-5 text-[#1F1F6F]"
                                                                data-oid="ex3cw9g"
                                                            />

                                                            <h4
                                                                className="text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                                                data-oid="vtm-l4g"
                                                            >
                                                                {tCustomer(
                                                                    'prescriptions.prescribedMedicines',
                                                                )}
                                                            </h4>
                                                        </div>
                                                        <div
                                                            className="space-y-3 max-h-96 overflow-y-auto"
                                                            data-oid="vxk2_ou"
                                                        >
                                                            {prescription?.medications?.map(
                                                                (medicine) => (
                                                                    <div
                                                                        key={medicine.name}
                                                                        className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1F1F6F]/30 hover:shadow-md transition-all duration-200"
                                                                        data-oid=".ng73h9"
                                                                    >
                                                                        <div
                                                                            className="flex items-start space-x-4"
                                                                            data-oid="qe3jx-:"
                                                                        >
                                                                            <div
                                                                                className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                                                                                data-oid="pjh3i70"
                                                                            >
                                                                                {medicine.image ? (
                                                                                    <img
                                                                                        src={
                                                                                            medicine.image
                                                                                        }
                                                                                        alt={
                                                                                            medicine.name
                                                                                        }
                                                                                        className="w-full h-full object-cover rounded-lg"
                                                                                        onError={(e) => {
                                                                                            // Hide the image and show fallback emoji on error
                                                                                            const img = e.currentTarget;
                                                                                            img.style.display = 'none';
                                                                                            const container = img.parentElement;
                                                                                            if (container) {
                                                                                                const fallback = container.querySelector('.medicine-fallback-desktop');
                                                                                                if (fallback) {
                                                                                                    (fallback as HTMLElement).style.display = 'flex';
                                                                                                }
                                                                                            }
                                                                                        }}
                                                                                        onLoad={(e) => {
                                                                                            // Ensure fallback is hidden when image loads successfully
                                                                                            const img = e.currentTarget;
                                                                                            const container = img.parentElement;
                                                                                            if (container) {
                                                                                                const fallback = container.querySelector('.medicine-fallback-desktop');
                                                                                                if (fallback) {
                                                                                                    (fallback as HTMLElement).style.display = 'none';
                                                                                                }
                                                                                            }
                                                                                        }}
                                                                                        data-oid="uuapu_x"
                                                                                    />
                                                                                ) : null}
                                                                                <div
                                                                                    className="medicine-fallback-desktop w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"
                                                                                    style={{
                                                                                        display: medicine.image ? 'none' : 'flex'
                                                                                    }}
                                                                                >
                                                                                    <span className="text-sm">💊</span>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="flex-1 min-w-0"
                                                                                data-oid="xpw-ar0"
                                                                            >
                                                                                <h5
                                                                                    className="font-semibold text-gray-900 text-sm mb-1 truncate"
                                                                                    data-oid="26iz_yi"
                                                                                >
                                                                                    {medicine.name}
                                                                                </h5>
                                                                                <div
                                                                                    className="space-y-1 text-xs text-gray-600"
                                                                                    data-oid="haac69g"
                                                                                >
                                                                                    <p data-oid="v0y_.r:">
                                                                                        <span
                                                                                            className="font-medium"
                                                                                            data-oid="-pf3rg9"
                                                                                        >
                                                                                            {tCustomer(
                                                                                                'prescriptions.dosage',
                                                                                            )}
                                                                                        </span>
                                                                                        {locale ===
                                                                                        'ar'
                                                                                            ? ' '
                                                                                            : ': '}
                                                                                        {
                                                                                            medicine.duration
                                                                                        }
                                                                                    </p>
                                                                                    <p data-oid="3v70loz">
                                                                                        <span
                                                                                            className="font-medium"
                                                                                            data-oid="_mf85l."
                                                                                        >
                                                                                            {tCustomer(
                                                                                                'prescriptions.frequency',
                                                                                            )}
                                                                                        </span>
                                                                                        {locale ===
                                                                                        'ar'
                                                                                            ? ' '
                                                                                            : ': '}
                                                                                        {translateFrequency(
                                                                                            medicine.frequency,
                                                                                        )}
                                                                                    </p>
                                                                                    <p data-oid="::-audi">
                                                                                        <span
                                                                                            className="font-medium"
                                                                                            data-oid="ffj:li6"
                                                                                        >
                                                                                            {tCustomer(
                                                                                                'prescriptions.qty',
                                                                                            )}
                                                                                        </span>
                                                                                        {locale ===
                                                                                        'ar'
                                                                                            ? ' '
                                                                                            : ': '}
                                                                                        {
                                                                                            medicine.quantity
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div
                                                                                    className="mt-2"
                                                                                    data-oid="6zpv6y0"
                                                                                >
                                                                                    <span
                                                                                        className="text-sm font-bold text-[#1F1F6F]"
                                                                                        data-oid=".rpmfdf"
                                                                                    >
                                                                                        {medicine?.price?.toFixed(
                                                                                            2,
                                                                                        )}{' '}
                                                                                        {tCustomer(
                                                                                            'prescriptions.egp',
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="px-8 pb-8" data-oid="un_9t5c">
                                                <div
                                                    className="flex items-center justify-end pt-4 border-t border-gray-200"
                                                    data-oid="xvd3jzs"
                                                >
                                                    <div
                                                        className="flex space-x-3"
                                                        data-oid="8w-aco2"
                                                    >
                                                        {prescription.currentStatus == 'approved' && (
                                                            <button
                                                                className="px-6 py-3 bg-[#1F1F6F] text-white rounded-xl hover:bg-[#14274E] transition-all text-sm font-semibold shadow-lg flex items-center space-x-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectMedicines(
                                                                        prescription._id,
                                                                    );
                                                                }}
                                                                data-oid="7w17a89"
                                                            >
                                                                <ShoppingCart
                                                                    className="w-4 h-4"
                                                                    data-oid="5.8dgl5"
                                                                />

                                                                <span data-oid="3uifg8f">
                                                                    {tCustomer(
                                                                        'prescriptions.selectMedicines',
                                                                    )}
                                                                </span>
                                                            </button>
                                                        )}
                                                        {prescription.currentStatus == 'Delivered' && (
                                                            <button
                                                                className="px-6 py-3 bg-[#1F1F6F] text-white rounded-xl hover:bg-[#14274E] transition-all text-sm font-semibold shadow-lg flex items-center space-x-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleBuyAgain(prescription.id);
                                                                }}
                                                                data-oid="c6bnuqu"
                                                            >
                                                                <ShoppingCart
                                                                    className="w-4 h-4"
                                                                    data-oid="m5lg-26"
                                                                />

                                                                <span data-oid="6od.see">
                                                                    {tCustomer(
                                                                        'prescriptions.buyAgain',
                                                                    )}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Separator for extra visual separation */}
                                        {index < prescriptions.length - 1 && (
                                            <div
                                                className="mt-8 flex items-center justify-center"
                                                data-oid="ixun2vz"
                                            >
                                                <div
                                                    className="w-32 h-1 bg-gradient-to-r from-transparent via-[#1F1F6F]/20 to-transparent rounded-full"
                                                    data-oid="2_p:m97"
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DashboardLayout>
            </div>

            {/* Modals */}
            <PrescriptionUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadComplete={handleUploadComplete}
                data-oid="gdex6po"
            />

            <PrescriptionViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                prescriptionId={selectedPrescriptionId}
                prescriptionData={selectedPrescriptionData}
                data-oid="20oc9lv"
            />
        </>
    );
}
