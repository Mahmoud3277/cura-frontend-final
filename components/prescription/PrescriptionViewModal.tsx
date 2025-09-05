'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, X } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface PrescriptionFile {
    filename: string;
    originalName: string;
    url: string;
    type: string;
    size: number;
    key?: string;
    uploadedAt?: string;
}

interface CustomerInfo {
    _id: string;
    name: string;
    email: string;
    phone: string;
    workingHours?: any;
}

interface PrescriptionViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    prescriptionId: string;
    prescriptionData?: {
        _id: string;
        prescriptionNumber: string;
        patientName: string;
        customerName: string;
        customerPhone: string;
        customerId: CustomerInfo;
        currentStatus: string;
        urgency: string;
        notes: string;
        doctorName: string;
        hospitalClinic: string;
        prescriptionDate: string | null;
        createdAt: string;
        updatedAt: string;
        estimatedCompletion: string;
        assignedReaderId: string;
        files: PrescriptionFile[];
        allergies: string[];
        medications: string[];
        medicalHistory: string[];
        processedMedicines: any[];
        statusHistory: any[];
        deliveryFee: number;
        orderCreated: boolean;
        qualityChecked: boolean;
        // Legacy support
        id?: string;
        date?: string;
        status?: string;
        prescriptionImages?: string[];
    };
}

export function PrescriptionViewModal({
    isOpen,
    onClose,
    prescriptionId,
    prescriptionData,
}: PrescriptionViewModalProps) {
    console.log('prescription data', prescriptionData)
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            loadPrescriptionImage();
            setSelectedImageIndex(0); // Reset to first image when modal opens
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, prescriptionId]);

    const loadPrescriptionImage = async () => {
        setIsLoading(true);
        // Simulate API call to load prescription image
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    if (!isOpen) return null;
    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            style={{
                zIndex: 99999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
            data-oid="0lcij:f"
        >
            <div
                className="bg-white rounded-3xl max-w-4xl w-full min-h-[600px] max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 my-4"
                onClick={(e) => e.stopPropagation()}
                data-oid="ubraku8"
            >
                {/* Header */}
                <div
                    className="bg-white border-b border-gray-200 px-6 sm:px-8 py-4 sm:py-6 rounded-t-3xl"
                    data-oid="yc8d_64"
                >
                    <div className="flex items-center justify-between" data-oid="flf5ecy">
                        <div className="flex items-center space-x-4" data-oid="_npr:s-">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center"
                                data-oid="9j.hf4k"
                            >
                                <FileText className="w-6 h-6 text-white" data-oid="6p0lf6g" />
                            </div>
                            <div data-oid="f9sjnsm">
                                <h2 className="text-2xl font-bold text-gray-900" data-oid="23mw5-p">
                                    {tCustomer('prescriptionView.title')}
                                </h2>
                                <p className="text-gray-600" data-oid="n9pzel9">
                                    {tCustomer('prescriptionView.prescriptionNumber').replace(
                                        '{number}',
                                        prescriptionData?.prescriptionNumber,
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            data-oid="jkm-2yf"
                        >
                            <X className="w-5 h-5 text-gray-600" data-oid="g20eqgr" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1" data-oid="tun5x6n">
                    {isLoading ? (
                        <div
                            className="flex flex-col items-center justify-center py-20"
                            data-oid="5n.av--"
                        >
                            <div
                                className="w-12 h-12 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mb-4"
                                data-oid="7hf:fah"
                            ></div>
                            <p className="text-gray-600 text-lg" data-oid=".nstam1">
                                {tCustomer('prescriptionView.loading')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6" data-oid="p0frecx">
                            {/* Prescription Images */}
                            <div className="bg-gray-50 rounded-xl p-6" data-oid="m5j-3fd">
                                <div className="mb-4" data-oid="b-fe4h:">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2"
                                        data-oid="gr_u5jl"
                                    >
                                        {tCustomer('prescriptionView.prescriptionDocuments')}
                                    </h3>
                                    {(prescriptionData?.files || prescriptionData?.prescriptionImages) &&
                                        ((prescriptionData.files && prescriptionData.files.length > 1) || 
                                         (prescriptionData.prescriptionImages && prescriptionData.prescriptionImages.length > 1)) && (
                                            <span
                                                className="text-sm bg-[#1F1F6F] text-white px-3 py-1 rounded-full"
                                                data-oid="_35yc4d"
                                            >
                                                {prescriptionData.files?.length || prescriptionData.prescriptionImages?.length || 0}{' '}
                                                {tCustomer('prescriptionView.photos')}
                                            </span>
                                        )}
                                </div>

                                {/* Image Thumbnails */}
                                {((prescriptionData?.files && prescriptionData.files.length > 1) ||
                                  (prescriptionData?.prescriptionImages && prescriptionData.prescriptionImages.length > 1)) && (
                                        <div
                                            className="flex space-x-3 mb-4 overflow-x-auto pb-2"
                                            data-oid="kvp.rcv"
                                        >
                                            {(prescriptionData.files || prescriptionData.prescriptionImages || []).map(
                                                (file, index) => {
                                                    const imageUrl = typeof file === 'string' ? file : file?.url;
                                                    return (
                                                    <div
                                                        key={index}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleImageClick(index);
                                                        }}
                                                        className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                                            selectedImageIndex === index
                                                                ? 'border-[#1F1F6F] ring-2 ring-[#1F1F6F]/20'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                        data-oid="rsm3g.r"
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover pointer-events-none"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    'https://via.placeholder.com/64x80/f8f9fa/6c757d?text=' +
                                                                    (index + 1);
                                                            }}
                                                            data-oid="jy2l65j"
                                                        />

                                                        <div
                                                            className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded pointer-events-none"
                                                            data-oid="z1y_9la"
                                                        >
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}

                                {/* Main Image Display */}
                                <div
                                    className="bg-white rounded-lg shadow-lg p-4 text-center"
                                    data-oid="20amx_6"
                                >
                                    {(prescriptionData?.files || prescriptionData?.prescriptionImages) ? (
                                        <div className="relative" data-oid="n4mz-cn">
                                            <img
                                                src={
                                                    prescriptionData.files
                                                        ? prescriptionData.files[selectedImageIndex]?.url
                                                        : prescriptionData.prescriptionImages?.[selectedImageIndex]
                                                }
                                                alt={`Prescription Document ${selectedImageIndex + 1}`}
                                                className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
                                                style={{ maxHeight: '500px' }}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        'https://via.placeholder.com/600x800/f8f9fa/6c757d?text=Prescription+Document';
                                                }}
                                                data-oid="4i_bmcl"
                                            />

                                            {((prescriptionData.files && prescriptionData.files.length > 1) ||
                                              (prescriptionData.prescriptionImages && prescriptionData.prescriptionImages.length > 1)) && (
                                                <div
                                                    className="absolute top-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full"
                                                    data-oid="j3sqyxq"
                                                >
                                                    {selectedImageIndex + 1}/
                                                    {prescriptionData.files?.length || prescriptionData.prescriptionImages?.length}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/600x800/f8f9fa/6c757d?text=Prescription+Document"
                                            alt="Prescription Document"
                                            className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
                                            style={{ maxHeight: '500px' }}
                                            data-oid="0jn1q:g"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Prescription Info */}
                            <div
                                className="bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 p-6 rounded-xl"
                                data-oid="fjz7zqg"
                            >
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="9bfq8q0"
                                >
                                    {tCustomer('prescriptionView.prescriptionInformation')}
                                </h3>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    data-oid="ycoqmfq"
                                >
                                    <div data-oid="e47cnb8">
                                        <span
                                            className="text-sm text-gray-600 font-medium"
                                            data-oid="1gjpwlr"
                                        >
                                            {tCustomer('prescriptionView.prescriptionId')}
                                            {locale === 'ar' ? '' : ':'}
                                        </span>
                                        <p
                                            className="font-semibold text-gray-900"
                                            data-oid="2a3haim"
                                        >
                                            {prescriptionData?.prescriptionNumber || prescriptionId}
                                        </p>
                                    </div>
                                    <div data-oid="5bx5zxp">
                                        <span
                                            className="text-sm text-gray-600 font-medium"
                                            data-oid="ydfjobm"
                                        >
                                            {tCustomer('prescriptionView.uploadDate')}
                                            {locale === 'ar' ? '' : ':'}
                                        </span>
                                        <p
                                            className="font-semibold text-gray-900"
                                            data-oid="zhge2_l"
                                        >
                                            {prescriptionData?.createdAt 
                                                ? new Date(prescriptionData.createdAt).toLocaleDateString()
                                                : prescriptionData?.date || 'N/A'}
                                        </p>
                                    </div>
                                    <div data-oid="y:kn6jg">
                                        <span
                                            className="text-sm text-gray-600 font-medium"
                                            data-oid="-gun59r"
                                        >
                                            {tCustomer('prescriptionView.status')}
                                            {locale === 'ar' ? '' : ':'}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                                                (prescriptionData?.currentStatus || prescriptionData?.status) === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : (prescriptionData?.currentStatus || prescriptionData?.status) === 'reviewing'
                                                      ? 'bg-blue-100 text-blue-800'
                                                      : (prescriptionData?.currentStatus || prescriptionData?.status) === 'submitted'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : (prescriptionData?.currentStatus || prescriptionData?.status) === 'rejected'
                                                          ? 'bg-red-100 text-red-800'
                                                          : 'bg-gray-100 text-gray-800'
                                            }`}
                                            data-oid="gdzgjr8"
                                        >
                                            {(prescriptionData?.currentStatus || prescriptionData?.status || 'Unknown').charAt(0).toUpperCase() + 
                                             (prescriptionData?.currentStatus || prescriptionData?.status || 'unknown').slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Prescription Details */}
                            {(prescriptionData?.patientName || prescriptionData?.customerPhone || 
                              prescriptionData?.urgency || prescriptionData?.notes) && (
                                <div className="bg-blue-50 p-6 rounded-xl mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Patient & Additional Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {prescriptionData?.patientName && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Patient Name:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.patientName}
                                                </p>
                                            </div>
                                        )}
                                        {prescriptionData?.customerPhone && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Contact Phone:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.customerPhone}
                                                </p>
                                            </div>
                                        )}
                                        {prescriptionData?.urgency && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Urgency:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.urgency.charAt(0).toUpperCase() + prescriptionData.urgency.slice(1)}
                                                </p>
                                            </div>
                                        )}
                                        {prescriptionData?.estimatedCompletion && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Estimated Completion:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(prescriptionData.estimatedCompletion).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        {prescriptionData?.notes && (
                                            <div className="md:col-span-2">
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Notes:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Medical Information */}
                            {(prescriptionData?.doctorName || prescriptionData?.hospitalClinic || 
                              (prescriptionData?.allergies && prescriptionData.allergies.length > 0) ||
                              (prescriptionData?.medications && prescriptionData.medications.length > 0)) && (
                                <div className="bg-green-50 p-6 rounded-xl mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Medical Information
                                    </h3>
                                    <div className="space-y-4">
                                        {prescriptionData?.doctorName && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Doctor Name:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.doctorName}
                                                </p>
                                            </div>
                                        )}
                                        {prescriptionData?.hospitalClinic && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Hospital/Clinic:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.hospitalClinic}
                                                </p>
                                            </div>
                                        )}
                                        {prescriptionData?.allergies && prescriptionData.allergies.length > 0 && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Known Allergies:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.allergies.join(', ')}
                                                </p>
                                            </div>
                                        )}
                                        {prescriptionData?.medications && prescriptionData.medications.length > 0 && (
                                            <div>
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Current Medications:
                                                </span>
                                                <p className="font-semibold text-gray-900">
                                                    {prescriptionData.medications.join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Processing Status */}
                            <div className="bg-gray-50 p-6 rounded-xl mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Processing Status
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full mr-2 ${
                                            prescriptionData?.qualityChecked ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></span>
                                        <span className="text-sm text-gray-600">
                                            Quality Checked: {prescriptionData?.qualityChecked ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full mr-2 ${
                                            prescriptionData?.orderCreated ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></span>
                                        <span className="text-sm text-gray-600">
                                            Order Created: {prescriptionData?.orderCreated ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full mr-2 ${
                                            prescriptionData?.assignedReaderId ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></span>
                                        <span className="text-sm text-gray-600">
                                            Assigned to Reader: {prescriptionData?.assignedReaderId ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                {prescriptionData?.deliveryFee !== undefined && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span className="text-sm text-gray-600 font-medium">
                                            Delivery Fee: 
                                        </span>
                                        <span className="font-semibold text-gray-900 ml-2">
                                            EGP {prescriptionData.deliveryFee}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-b-3xl"
                    data-oid="uf7n:rt"
                >
                    <div className="flex justify-end" data-oid="t6vkzk2">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            data-oid="xmse57q"
                        >
                            {tCustomer('prescriptionView.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
