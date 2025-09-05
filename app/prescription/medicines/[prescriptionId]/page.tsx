'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Footer } from '@/components/layout/Footer';
import { prescriptionAPIService, PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';
import { PrescriptionWorkflowService } from '@/lib/services/prescriptionWorkflowService';
import MedicineSelectionInterface from '@/components/prescription/MedicineSelectionInterface';
import { MedicineSelectionProvider } from '@/lib/contexts/MedicineSelectionContext';
import { ClientOnly } from '@/components/common/ClientOnly';

// Interface for pharmacy medicine data
interface PharmacyMedicineData {
    batchNumber?: string;
    bulkPricing?: any[];
    deliveryAvailable?: boolean;
    deliveryFee?: number;
    deliveryTime?: string;
    expiryDate?: string;
    id?: string;
    inStock?: boolean;
    lastUpdated?: string;
    pharmacyNameAr?: string;
    price?: number;
    providerId?: string;
    providerName?: string;
    providerType?: string;
    stockLevel?: string;
    stockQuantity?: number;
}

// Safe mapping function for pharmacy medicine data
const safeMapPharmacyData = (data: any): PharmacyMedicineData => {
    return {
        batchNumber: data?.batchNumber || '',
        bulkPricing: Array.isArray(data?.bulkPricing) ? data.bulkPricing : [],
        deliveryAvailable: Boolean(data?.deliveryAvailable),
        deliveryFee: typeof data?.deliveryFee === 'number' ? data.deliveryFee : 0,
        deliveryTime: data?.deliveryTime || '',
        expiryDate: data?.expiryDate || '',
        id: data?.id || '',
        inStock: Boolean(data?.inStock),
        lastUpdated: data?.lastUpdated || '',
        pharmacyNameAr: data?.pharmacyNameAr || '',
        price: typeof data?.price === 'number' ? data.price : 0,
        providerId: data?.providerId || '',
        providerName: data?.providerName || '',
        providerType: data?.providerType || '',
        stockLevel: data?.stockLevel || 'unknown',
        stockQuantity: typeof data?.stockQuantity === 'number' ? data.stockQuantity : 0,
    };
};

// Helper function to format date safely
const formatDateSafely = (dateString?: string): string => {
    if (!dateString) return '';
    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(dateString));
    } catch {
        return dateString;
    }
};

// Helper function to get stock level display
const getStockLevelDisplay = (stockLevel?: string, locale?: string): string => {
    if (!stockLevel) return '';
    
    const stockLevels: Record<string, Record<string, string>> = {
        en: {
            high: 'High Stock',
            medium: 'Medium Stock', 
            low: 'Low Stock',
            out: 'Out of Stock'
        },
        ar: {
            high: 'مخزون عالي',
            medium: 'مخزون متوسط',
            low: 'مخزون منخفض', 
            out: 'نفد المخزون'
        }
    };
    
    return stockLevels[locale || 'en']?.[stockLevel] || stockLevel;
};

export default function MedicineSelectionPage() {
    const params = useParams();
    const prescriptionId = params.prescriptionId as string;
    const [prescription, setPrescription] = useState<PrescriptionWorkflow | null>(null);
    const [pharmacyMedicineData, setPharmacyMedicineData] = useState<PharmacyMedicineData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');

    useEffect(() => {
        // Only run when we have both prescriptionId and user
        if (prescriptionId && user) {
            loadPrescription();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prescriptionId, user]); // Re-run when user becomes available

    const loadPrescription = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // This check is now redundant due to useEffect condition, but keeping for safety
            if (!user) {
                console.log('User not loaded yet, waiting...');
                // Keep loading state true instead of setting to false
                return;
            }

            console.log('Loading prescription for user:', user._id);
            console.log('Prescription ID:', prescriptionId);

            const response = await prescriptionAPIService.getPrescriptionById(prescriptionId);
            console.log('API Response:', response);
            
            if (!response?.success || !response.data) {
                console.log('Prescription not found or API failed:', {
                    response,
                    success: response?.success,
                    hasData: !!response?.data,
                    prescriptionId
                });
                setError('notFound');
                return;
            }

            const prescriptionData = response.data;
            console.log('Prescription loaded successfully:', {
                prescriptionId: prescriptionData._id,
                customerId: prescriptionData.customerId,
                currentUserId: user._id,
                status: prescriptionData.currentStatus
            });

            // Enhanced user access check with better string comparison
            let prescriptionCustomerId;
            if (typeof prescriptionData.customerId === 'object' && prescriptionData.customerId) {
                prescriptionCustomerId = prescriptionData.customerId._id || prescriptionData.customerId.toString();
            } else {
                prescriptionCustomerId = prescriptionData.customerId;
            }

            // Convert both IDs to strings for comparison to avoid ObjectId vs string issues
            const userIdStr = user._id.toString();
            const prescriptionCustomerIdStr = prescriptionCustomerId?.toString();
                
            if (prescriptionCustomerIdStr !== userIdStr) {
                console.log('Access denied: prescription customerId does not match user ID');
                console.log('Expected (user):', userIdStr, 'Got (prescription):', prescriptionCustomerIdStr);
                console.log('Types:', typeof userIdStr, typeof prescriptionCustomerIdStr);
                setError('accessDenied');
                return;
            }

            // Check if prescription is ready for medicine selection
            if (prescriptionData.currentStatus !== 'approved') {
                console.log('Prescription not ready for medicine selection:', prescriptionData.currentStatus);
                setError('notReady');
                return;
            }

            console.log('Prescription validation successful, setting prescription data');
            setPrescription(prescriptionData);
        } catch (error) {
            console.error('Error loading prescription:', error);
            setError('loadFailed');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to safely handle pharmacy medicine data
    const handlePharmacyMedicineData = (rawData: any) => {
        try {
            if (!rawData) {
                console.log('No pharmacy medicine data provided');
                return;
            }
            
            const mappedData = safeMapPharmacyData(rawData);
            setPharmacyMedicineData(mappedData);
            console.log('Pharmacy medicine data mapped successfully:', mappedData);
        } catch (error) {
            console.error('Error mapping pharmacy medicine data:', error);
        }
    };

    // Example usage: Call this function when you receive the data
    // handlePharmacyMedicineData(yourDataObject);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    // Show loading state if we're loading prescription data OR waiting for user auth
    if (isLoading || !user) {
        return (
            <div
                className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-gray-50 md:to-blue-50"
                data-oid=":9cygyt"
            >
                {/* Mobile Header */}
                <div className="block md:hidden" data-oid="0vvfub_">
                    <ClientOnly data-oid="zn97vll">
                        <MobileHeader data-oid="-1pcdzf" />
                    </ClientOnly>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block" data-oid="vm1m0qm">
                    <Header data-oid="ba5g_b-" />
                </div>

                <div
                    className="flex flex-col items-center justify-center py-8 md:py-20 px-4"
                    data-oid=":08mwl3"
                >
                    <div
                        className="w-8 h-8 md:w-12 md:h-12 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mb-4"
                        data-oid="_ly3z8c"
                    ></div>
                    <p
                        className="text-gray-600 text-base md:text-lg text-center"
                        data-oid="3p_tr0y"
                    >
                        {tCustomer('medicineSelection.loading')}
                    </p>
                </div>
                <Footer data-oid="hg.5zj5" />
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-gray-50 md:to-blue-50"
                data-oid="3_53m50"
            >
                {/* Mobile Header */}
                <div className="block md:hidden" data-oid="v-ewz1k">
                    <ClientOnly data-oid="tx6fww2">
                        <MobileHeader data-oid="rjfq-ek" />
                    </ClientOnly>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block" data-oid="penf88i">
                    <Header data-oid="-pa.byx" />
                </div>

                <div className="max-w-2xl mx-auto px-4 py-8 md:py-20" data-oid="rgx5dkb">
                    <div
                        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center"
                        data-oid="fdk8.hz"
                    >
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
                            data-oid="gzuopcu"
                        >
                            <span className="text-2xl md:text-3xl" data-oid="up7182i">
                                ❌
                            </span>
                        </div>
                        <h1
                            className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4"
                            data-oid="86xx8j_"
                        >
                            {error === 'notFound' && tCustomer('medicineSelection.errors.notFound')}
                            {error === 'accessDenied' &&
                                tCustomer('medicineSelection.errors.accessDenied')}
                            {error === 'notReady' && tCustomer('medicineSelection.errors.notReady')}
                            {error === 'loadFailed' &&
                                tCustomer('medicineSelection.errors.loadFailed')}
                        </h1>
                        <p
                            className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base"
                            data-oid="am86iwj"
                        >
                            {error === 'notFound' &&
                                tCustomer('medicineSelection.errors.notFoundDesc')}
                            {error === 'accessDenied' &&
                                tCustomer('medicineSelection.errors.accessDeniedDesc')}
                            {error === 'notReady' &&
                                tCustomer('medicineSelection.errors.notReadyDesc')}
                            {error === 'loadFailed' &&
                                tCustomer('medicineSelection.errors.loadFailedDesc')}
                        </p>
                        <a
                            href="/prescription/status"
                            className="inline-block bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 text-sm md:text-base"
                            data-oid="0cli39p"
                        >
                            {tCustomer('medicineSelection.backToPrescriptions')}
                        </a>
                    </div>
                </div>
                <Footer data-oid="d2j:pz2" />
            </div>
        );
    }

    // Pharmacy Medicine Info Component for safe display
    const PharmacyMedicineInfo = ({ data }: { data: PharmacyMedicineData }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'معلومات الصيدلية' : 'Pharmacy Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Provider Info */}
                {data.providerName && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'اسم المزود' : 'Provider Name'}
                        </p>
                        <p className="text-sm text-gray-900">{data.providerName}</p>
                        {data.pharmacyNameAr && locale === 'ar' && (
                            <p className="text-sm text-gray-600">({data.pharmacyNameAr})</p>
                        )}
                    </div>
                )}

                {/* Price */}
                {data.price !== undefined && data.price > 0 && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'السعر' : 'Price'}
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">
                            {data.price} {locale === 'ar' ? 'ج.م' : 'EGP'}
                        </p>
                    </div>
                )}

                {/* Stock Level */}
                {data.stockLevel && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'مستوى المخزون' : 'Stock Level'}
                        </p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            data.stockLevel === 'high' ? 'bg-green-100 text-green-800' :
                            data.stockLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            data.stockLevel === 'low' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {getStockLevelDisplay(data.stockLevel, locale)}
                        </span>
                    </div>
                )}

                {/* Stock Quantity */}
                {data.stockQuantity !== undefined && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'الكمية المتاحة' : 'Available Quantity'}
                        </p>
                        <p className="text-sm text-gray-900">{data.stockQuantity}</p>
                    </div>
                )}

                {/* Delivery Info */}
                {data.deliveryAvailable && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'التوصيل' : 'Delivery'}
                        </p>
                        <div className="text-sm text-gray-900">
                            <span className="text-green-600">✓ {locale === 'ar' ? 'متاح' : 'Available'}</span>
                            {data.deliveryTime && (
                                <span className="block text-gray-600">
                                    {locale === 'ar' ? 'الوقت: ' : 'Time: '}{data.deliveryTime}
                                </span>
                            )}
                            {data.deliveryFee !== undefined && (
                                <span className="block text-gray-600">
                                    {locale === 'ar' ? 'الرسوم: ' : 'Fee: '}{data.deliveryFee} {locale === 'ar' ? 'ج.م' : 'EGP'}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Batch & Expiry */}
                {data.batchNumber && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'رقم الدفعة' : 'Batch Number'}
                        </p>
                        <p className="text-sm text-gray-900">{data.batchNumber}</p>
                    </div>
                )}

                {data.expiryDate && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                        </p>
                        <p className="text-sm text-gray-900">{formatDateSafely(data.expiryDate)}</p>
                    </div>
                )}

                {/* Last Updated */}
                {data.lastUpdated && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                            {locale === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                        </p>
                        <p className="text-sm text-gray-600">{formatDateSafely(data.lastUpdated)}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-gray-50 md:to-blue-50"
            data-oid="qzxgg6x"
        >
            {/* Mobile Header */}
            <div className="block md:hidden" data-oid="2km.7bn">
                <ClientOnly data-oid="sptevxy">
                    <MobileHeader data-oid="7:.l7z8" />
                </ClientOnly>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block" data-oid="82f40jq">
                <Header data-oid="bpky2i_" />
            </div>

            {/* Page Header - Mobile Optimized */}
            <div className="bg-white border-b border-gray-100" data-oid="6o6-vof">
                <div className="max-w-6xl mx-auto px-4 py-4 md:py-6" data-oid="xq5m4a1">
                    <div className="text-center" data-oid="6nz5:u4">
                        <h1
                            className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2"
                            data-oid="x4w3gqt"
                        >
                            {tCustomer('medicineSelection.title')}
                        </h1>
                        <p className="text-sm md:text-base text-gray-600" data-oid="10y.31i">
                            {tCustomer('medicineSelection.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Prescription Info - Mobile Optimized */}
            {prescription && (
                <div className="max-w-6xl mx-auto px-4 py-4 md:py-6" data-oid="_5f6f_7">
                    <div
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8"
                        data-oid="et.yqt3"
                    >
                        <div
                            className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
                            data-oid="vryuwrk"
                        >
                            <div data-oid="89kxlnt">
                                <h2
                                    className="text-lg md:text-xl font-semibold text-gray-900"
                                    data-oid="w1jbffe"
                                >
                                    {tCustomer('medicineSelection.prescriptionNumber').replace(
                                        '{number}',
                                        prescription._id || prescription.prescriptionNumber || '',
                                    )}
                                </h2>
                                <p
                                    className="text-sm md:text-base text-gray-600"
                                    data-oid="shle7bn"
                                >
                                    {tCustomer('medicineSelection.patient')}{' '}
                                    {prescription.patientName} •{' '}
                                    {tCustomer('medicineSelection.date')}{' '}
                                    {prescription.createdAt ? 
                                        formatDateSafely(prescription.createdAt.toString()) :
                                        ''
                                    }
                                </p>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="a1gj.41">
                                <span
                                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800"
                                    data-oid="nm-y0hi"
                                >
                                    ✅ {tCustomer('medicineSelection.approved')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pharmacy Medicine Information - Mobile Optimized */}
            {pharmacyMedicineData && (
                <div className="max-w-6xl mx-auto px-4" data-oid="pharmacy-medicine-data">
                    <PharmacyMedicineInfo data={pharmacyMedicineData} />
                </div>
            )}

            {/* Medicine Selection Interface - Mobile Optimized */}
            <div className="max-w-6xl mx-auto px-4 pb-6 md:pb-8" data-oid="-uad8pt">
                <MedicineSelectionProvider data-oid="7knhjdl">
                    <MedicineSelectionInterface
                        prescriptionId={prescriptionId}
                        data-oid="5-t4pwg"
                    />
                </MedicineSelectionProvider>
            </div>

            <Footer data-oid="qmgxzi0" />

            {/* Mobile Bottom Padding */}
            <div className="h-20 md:hidden" data-oid="m6vxmwc"></div>
        </div>
    );
}
