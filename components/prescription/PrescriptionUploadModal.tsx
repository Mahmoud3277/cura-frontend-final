'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ClientOnly } from '@/components/common/ClientOnly';
import { CameraCapture } from './CameraCapture';
import { prescriptionAPIService } from '@/lib/data/prescriptionWorkflow';
interface UploadedFile {
    id: string;
    file: File;
    preview: string;
    type: 'image' | 'pdf';
    size: string;
}

interface PrescriptionUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete?: (files: UploadedFile[], formData: any) => void;
}

export function PrescriptionUploadModal({
    isOpen,
    onClose,
    onUploadComplete,
}: PrescriptionUploadModalProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);
    const { locale } = useLanguage();
    const { t, isLoading: translationsLoading } = useTranslation(locale);
    const { user } = useAuth();

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);
    const [step, setStep] = useState<'upload' | 'success'>('upload');
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Create formData object with user info when available
    const formData = {
        patientName: user?.name || '',
        doctorName: '',
        hospitalClinic: '',
        prescriptionDate: '',
        notes: '',
        urgency: 'normal' as 'urgent' | 'normal' | 'routine',
    };

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return 'Only JPG, PNG, and PDF files are allowed';
        }

        const maxSizeBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeBytes) {
            return 'File size must be less than 10MB';
        }

        return null;
    };

    // The main issue is in the handleSubmit function. Here's the corrected version:

const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
        setErrors(['Please upload at least one prescription file']);
        return;
    }

    // Clear previous errors
    setErrors([]);
    setIsUploading(true);

    try {
        // Prepare the prescription data
        const prescriptionData = {
            patientName: formData.patientName,
            patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
            patientGender: formData.patientGender as 'male' | 'female' | undefined,
            doctorName: formData.doctorName,
            doctorSpecialty: formData.doctorSpecialty,
            hospitalClinic: formData.hospitalClinic,
            prescriptionDate: formData.prescriptionDate,
            urgency: formData.urgency as PrescriptionUrgency,
            notes: formData.notes,
            deliveryAddress: formData.deliveryAddress,
            medications: formData.medications?.map(med => ({
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency
            }))
        };

        // FIXED: Extract the actual File objects from uploadedFiles
        const fileObjects: File[] = uploadedFiles.map(uploadedFile => uploadedFile.file);

        console.log('Files being sent to API:', fileObjects.map(f => ({ name: f.name, size: f.size, type: f.type })));

        // Create prescription via API
        const response = await prescriptionAPIService.createPrescription(prescriptionData, fileObjects);

        if (response.success && response.data) {
            setIsUploading(false);
            setStep('success');
            
            // Call the completion callback with the API response data
            onUploadComplete?.(response.data.files, {
                ...formData,
                prescriptionId: response.data._id,
                prescriptionNumber: response.data.prescriptionNumber,
                currentStatus: response.data.currentStatus,
                estimatedCompletion: response.data.estimatedCompletion
            });

            // Redirect to prescription status page with the new prescription ID
            setTimeout(() => {
                handleClose();
                router.push(`/prescription/status`);
            }, 2000);
        } else {
            // Handle API error response
            throw new Error(response.error || 'Failed to create prescription');
        }
    } catch (error) {
        console.error('Error creating prescription:', error);
        setIsUploading(false);
        
        // Display error message to user
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to submit prescription. Please try again.';
            
        setErrors([errorMessage]);
        
        // Optionally show more specific error messages based on error type
        if (error instanceof Error && error.message.includes('network')) {
            setErrors(['Network error. Please check your internet connection and try again.']);
        } else if (error instanceof Error && error.message.includes('401')) {
            setErrors(['Authentication failed. Please login and try again.']);
        } else if (error instanceof Error && error.message.includes('413')) {
            setErrors(['Files are too large. Please reduce file size and try again.']);
        }
    }
};

// Also, let's add some debugging to the processFiles function:
const processFiles = useCallback(
    async (files: FileList) => {
        const newErrors: string[] = [];
        const newFiles: UploadedFile[] = [];

        if (uploadedFiles.length + files.length > 5) {
            newErrors.push('Maximum 5 files allowed');
            setErrors(newErrors);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log('Processing file:', { name: file.name, size: file.size, type: file.type });
            
            const error = validateFile(file);

            if (error) {
                newErrors.push(`${file.name}: ${error}`);
                continue;
            }

            try {
                const preview = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const uploadedFile: UploadedFile = {
                    id: `${Date.now()}-${i}`,
                    file, // This is the actual File object - make sure it's preserved
                    preview,
                    type: file.type.startsWith('image/') ? 'image' : 'pdf',
                    size: formatFileSize(file.size),
                };

                console.log('Created uploadedFile:', { 
                    id: uploadedFile.id, 
                    fileName: uploadedFile.file.name,
                    fileSize: uploadedFile.file.size,
                    fileType: uploadedFile.file.type,
                    isFileObject: uploadedFile.file instanceof File
                });

                newFiles.push(uploadedFile);
                setUploadProgress(((i + 1) / files.length) * 100);
            } catch (error) {
                newErrors.push(`${file.name}: Failed to process file`);
            }
        }

        setUploadedFiles((prev) => [...prev, ...newFiles]);
        setErrors(newErrors);
        setIsUploading(false);
        setUploadProgress(0);

        // Clear any previous errors if files uploaded successfully
        if (newFiles.length > 0 && newErrors.length === 0) {
            setErrors([]);
        }
    },
    [uploadedFiles.length],
);

// Also, let's check the handleCameraCapture function to ensure it's working correctly:
const handleCameraCapture = useCallback(
    (file: File) => {
        console.log('Camera captured file:', { name: file.name, size: file.size, type: file.type });
        
        const fileList = new DataTransfer();
        fileList.items.add(file);
        processFiles(fileList.files);
        // Don't auto-close camera so user can take multiple photos
        // setIsCameraOpen(false);
    },
    [processFiles],
);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    const removeFile = (fileId: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    };

    

    const resetModal = () => {
        setUploadedFiles([]);
        setErrors([]);
        setStep('upload');
        setIsCameraOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
    };

    

    const openCamera = () => {
        setIsCameraOpen(true);
    };

    const closeCamera = () => {
        setIsCameraOpen(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;
    if (!mounted) return null;

    // Show loading if translations aren't ready yet
    if (translationsLoading) {
        const loadingContent = (
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                data-oid="hcyyx9p"
            >
                <div className="bg-white rounded-3xl p-8 shadow-2xl" data-oid="rq0evku">
                    <div className="flex items-center justify-center" data-oid="jkw:kh9">
                        <div
                            className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                            data-oid="wcu7z8w"
                        ></div>
                        <span className="ml-3 text-gray-600" data-oid=":38xra7">
                            Loading...
                        </span>
                    </div>
                </div>
            </div>
        );

        return createPortal(
            <ClientOnly fallback={null} data-oid="bgrqu_8">
                {loadingContent}
            </ClientOnly>,
            document.body,
        );
    }

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
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
            data-oid="yoxhev7"
        >
            <div
                className="bg-white w-full h-full md:rounded-3xl md:max-w-4xl md:w-full md:min-h-[600px] md:max-h-[95vh] md:my-4 overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
                data-oid="3-5d-bb"
            >
                {/* Header */}
                <div
                    className="bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 py-4 md:py-6 md:rounded-t-3xl"
                    data-oid="njkw08v"
                >
                    <div className="flex items-center justify-between" data-oid=":ep9pjn">
                        <div
                            className="flex items-center space-x-3 md:space-x-4"
                            data-oid="d5cknbw"
                        >
                            <div
                                className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center"
                                data-oid="8bsumrj"
                            >
                                <svg
                                    className="w-5 h-5 md:w-6 md:h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="n.vx2lw"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        data-oid="aalp2rp"
                                    />
                                </svg>
                            </div>
                            <div data-oid="goq_c2f">
                                <h2
                                    className="text-lg md:text-2xl font-bold text-gray-900"
                                    data-oid="mcsugpf"
                                >
                                    Upload Prescription
                                </h2>
                                <p
                                    className="text-sm md:text-base text-gray-600"
                                    data-oid="zvl3r_s"
                                >
                                    {step === 'upload' && 'Upload your prescription files'}
                                    {step === 'success' && 'Prescription submitted successfully'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            data-oid="ttyu:mb"
                        >
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="oek8jp3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid="dfl4znr"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div
                        className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-6"
                        data-oid="2.evi:v"
                    >
                        <div
                            className={`flex items-center space-x-1 md:space-x-2 ${step === 'upload' ? 'text-[#1F1F6F]' : 'text-green-600'}`}
                            data-oid="_::n.70"
                        >
                            <div
                                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold ${
                                    step === 'upload' ? 'bg-[#1F1F6F]' : 'bg-green-600'
                                }`}
                                data-oid="1b4f8_l"
                            >
                                {step === 'upload' ? '1' : '✓'}
                            </div>
                            <span className="font-medium text-sm md:text-base" data-oid="rasl5xn">
                                Upload Files
                            </span>
                        </div>
                        <div
                            className={`w-4 md:w-8 h-1 rounded-full ${step === 'success' ? 'bg-green-600' : 'bg-gray-300'}`}
                            data-oid="qptzagd"
                        ></div>
                        <div
                            className={`flex items-center space-x-1 md:space-x-2 ${step === 'success' ? 'text-green-600' : 'text-gray-400'}`}
                            data-oid="u2l0ly4"
                        >
                            <div
                                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold ${
                                    step === 'success' ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                                data-oid="nv-2h2c"
                            >
                                {step === 'success' ? '✓' : '2'}
                            </div>
                            <span className="font-medium text-sm md:text-base" data-oid="s62edxh">
                                Complete
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 lg:p-8 flex-1" data-oid="1asls8.">
                    {/* Error Messages */}
                    {errors.length > 0 && (
                        <div
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                            data-oid="q_wwglm"
                        >
                            <div className="flex items-center mb-2" data-oid="d7-n_r1">
                                <svg
                                    className="w-5 h-5 text-red-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="8-43eww"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        data-oid="n0oqp4q"
                                    />
                                </svg>
                                <h4 className="text-red-800 font-semibold" data-oid="h.iqanj">
                                    Upload Errors
                                </h4>
                            </div>
                            <ul className="text-red-700 text-sm space-y-1" data-oid="9sg.1xj">
                                {errors.map((error, index) => (
                                    <li key={index} data-oid="xbx1lz7">
                                        • {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Step 1: Upload Files */}
                    {step === 'upload' && (
                        <div className="space-y-6" data-oid="xhammuk">
                            <div
                                className={`border-2 border-dashed rounded-2xl p-6 md:p-12 text-center transition-all duration-300 cursor-pointer ${
                                    isDragOver
                                        ? 'border-[#1F1F6F] bg-[#1F1F6F]/5 scale-105'
                                        : 'border-gray-300 hover:border-[#1F1F6F] hover:bg-[#1F1F6F]/5'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                data-oid="ulrqetm"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    data-oid="9mdtt_c"
                                />

                                {isUploading ? (
                                    <div className="space-y-4" data-oid="-o5l-dx">
                                        <div
                                            className="w-16 h-16 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto"
                                            data-oid="156:iv:"
                                        ></div>
                                        <p className="text-gray-600" data-oid="40vfqdy">
                                            Uploading files...
                                        </p>
                                        <div
                                            className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto"
                                            data-oid="6si:cb2"
                                        >
                                            <div
                                                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                                data-oid="vw0c6it"
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 md:space-y-6" data-oid="63t7o9j">
                                        <svg
                                            className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="c3bgbua"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                data-oid="i9tbe.m"
                                            />
                                        </svg>
                                        <div data-oid="xj8lno6">
                                            <p
                                                className="text-base md:text-lg font-semibold text-gray-700 mb-2"
                                                data-oid="n:r:snc"
                                            >
                                                Click to upload or drag and drop
                                            </p>
                                            <p
                                                className="text-sm md:text-base text-gray-500 mb-4 md:mb-6"
                                                data-oid=".rox_lx"
                                            >
                                                PNG, JPG, PDF up to 10MB each (Max 5 files per
                                                prescription)
                                            </p>

                                            {/* Camera Button */}
                                            <div
                                                className="flex flex-col items-center justify-center space-y-3 md:space-y-4"
                                                data-oid="18fu2s2"
                                            >
                                                <div
                                                    className="flex items-center space-x-2 md:space-x-4 text-gray-400"
                                                    data-oid="l1:lxes"
                                                >
                                                    <div
                                                        className="h-px bg-gray-300 w-12 md:w-20"
                                                        data-oid="aa_46-j"
                                                    ></div>
                                                    <span
                                                        className="text-sm font-medium"
                                                        data-oid="4s_8ojt"
                                                    >
                                                        or
                                                    </span>
                                                    <div
                                                        className="h-px bg-gray-300 w-12 md:w-20"
                                                        data-oid="8las8e4"
                                                    ></div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openCamera();
                                                    }}
                                                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 md:space-x-3"
                                                    data-oid="jtnmeey"
                                                >
                                                    <svg
                                                        className="w-4 h-4 md:w-5 md:h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="b60zbp."
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                            data-oid="t_xb5lf"
                                                        />

                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                            data-oid="ux6cgtd"
                                                        />
                                                    </svg>
                                                    <span
                                                        className="text-sm md:text-base"
                                                        data-oid="ul97ew7"
                                                    >
                                                        Take Photo
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {uploadedFiles.length === 0 && (
                                <div className="text-center py-4" data-oid="-vrc.ik">
                                    <div
                                        className="flex items-center justify-center space-x-2"
                                        data-oid="942bxcy"
                                    >
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="yql:th."
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                                data-oid="x1ul14q"
                                            />
                                        </svg>
                                        <p className="text-gray-500 text-sm" data-oid="veg-b0e">
                                            No files uploaded yet. Upload multiple images of your
                                            prescription for better accuracy.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {uploadedFiles.length > 0 && (
                                <div data-oid="35.kwzs">
                                    <div
                                        className="flex items-center justify-between mb-4"
                                        data-oid="zd9-icu"
                                    >
                                        <h3
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="vt5cpqf"
                                        >
                                            Prescription Images ({uploadedFiles.length}/5)
                                        </h3>
                                        <div
                                            className="flex items-center space-x-2 text-sm text-gray-600"
                                            data-oid="m8rdoyw"
                                        >
                                            <span
                                                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                                                data-oid="l-_lxq9"
                                            >
                                                Multiple images help ensure accuracy
                                            </span>
                                        </div>
                                    </div>

                                    {/* Image Gallery Grid */}
                                    <div
                                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
                                        data-oid="m7qgv6-"
                                    >
                                        {uploadedFiles.map((file, index) => (
                                            <div
                                                key={file.id}
                                                className="relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-all duration-200"
                                                data-oid="ybkj1-i"
                                            >
                                                {/* File Number Badge */}
                                                <div
                                                    className="absolute top-2 left-2 z-10 bg-[#1F1F6F] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                                                    data-oid="vf3g:nn"
                                                >
                                                    {index + 1}
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    data-oid="i1ec9df"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        data-oid="8j5k3q2"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                            data-oid="hr1_e0h"
                                                        />
                                                    </svg>
                                                </button>

                                                {file.type === 'image' && (
                                                    <div
                                                        className="aspect-square bg-white overflow-hidden"
                                                        data-oid="--n_apj"
                                                    >
                                                        <img
                                                            src={file.preview}
                                                            alt={`Prescription image ${index + 1}`}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                            data-oid="i:b3m3v"
                                                        />
                                                    </div>
                                                )}
                                                {file.type === 'pdf' && (
                                                    <div
                                                        className="aspect-square bg-white flex items-center justify-center"
                                                        data-oid="4vrfud7"
                                                    >
                                                        <div
                                                            className="text-center"
                                                            data-oid="wdtsvno"
                                                        >
                                                            <svg
                                                                className="w-8 h-8 text-red-500 mb-1 mx-auto"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="zc-41c6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    data-oid="309z1z8"
                                                                />
                                                            </svg>
                                                            <p
                                                                className="text-xs text-gray-600"
                                                                data-oid=":lq7.ou"
                                                            >
                                                                PDF
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* File Info Overlay */}
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2"
                                                    data-oid="-vf5w:o"
                                                >
                                                    <p
                                                        className="text-white text-xs font-medium truncate"
                                                        data-oid="2jthioo"
                                                    >
                                                        {file.file.name}
                                                    </p>
                                                    <p
                                                        className="text-white/80 text-xs"
                                                        data-oid="z90c6a5"
                                                    >
                                                        {file.size}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add More Button */}
                                        {uploadedFiles.length < 5 && (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1F1F6F] hover:bg-[#1F1F6F]/5 transition-all duration-200 group"
                                                data-oid="add-more-btn"
                                            >
                                                <div className="text-center" data-oid="s.gqudo">
                                                    <div
                                                        className="w-8 h-8 bg-gray-300 group-hover:bg-[#1F1F6F] rounded-full flex items-center justify-center mb-2 transition-colors duration-200"
                                                        data-oid=".-0_jpg"
                                                    >
                                                        <svg
                                                            className="w-4 h-4 text-gray-600 group-hover:text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="06t2ip-"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 4v16m8-8H4"
                                                                data-oid="uywbjly"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p
                                                        className="text-xs text-gray-600 group-hover:text-[#1F1F6F] font-medium"
                                                        data-oid="grjjt8g"
                                                    >
                                                        Add More
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Progress Info */}
                                    <div
                                        className="mt-4 flex items-center justify-between text-sm"
                                        data-oid="em9s243"
                                    >
                                        <div
                                            className="flex items-center space-x-2 text-gray-600"
                                            data-oid="gwf0:21"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="qu_eg2w"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    data-oid="cw3vzlu"
                                                />
                                            </svg>
                                            <span data-oid="h:i:w15">
                                                {
                                                    uploadedFiles.filter((f) => f.type === 'image')
                                                        .length
                                                }{' '}
                                                image(s),{' '}
                                                {
                                                    uploadedFiles.filter((f) => f.type === 'pdf')
                                                        .length
                                                }{' '}
                                                PDF(s)
                                            </span>
                                        </div>
                                        <div className="text-gray-500" data-oid="wr57s00">
                                            {5 - uploadedFiles.length} more files allowed
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Success */}
                    {step === 'success' && (
                        <div className="text-center space-y-6" data-oid="wb16_ln">
                            <div
                                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                data-oid="2ducqdj"
                            >
                                <svg
                                    className="w-12 h-12 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="pg3fhm2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="gl4u_yj"
                                    />
                                </svg>
                            </div>
                            <div data-oid="gq.wcjy">
                                <h3
                                    className="text-2xl font-bold text-gray-900 mb-2"
                                    data-oid="rpvnf:l"
                                >
                                    Prescription Submitted Successfully!
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto" data-oid="j.yabz1">
                                    Your prescription has been received and will be reviewed by our
                                    licensed pharmacists within 24 hours.
                                </p>
                            </div>
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                data-oid="k4pwufr"
                            >
                                <h4 className="font-semibold text-blue-900 mb-2" data-oid="kapf:1z">
                                    What happens next?
                                </h4>
                                <ul
                                    className="text-blue-800 text-sm space-y-1 text-left"
                                    data-oid=":_h-cl9"
                                >
                                    <li data-oid="r1.o3xd">
                                        • Pharmacist reviews your prescription
                                    </li>
                                    <li data-oid="n4b:vl_">
                                        • You{"'"}ll receive a call to confirm details
                                    </li>
                                    <li data-oid="3y2l2-8">
                                        • Medicines are prepared and dispatched
                                    </li>
                                    <li data-oid="1sbyyj1">• Track your order in real-time</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="bg-gray-50 border-t border-gray-200 px-4 md:px-6 lg:px-8 py-4 md:py-6 md:rounded-b-3xl"
                    data-oid="wed47ab"
                >
                    <div
                        className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0"
                        data-oid="moa.m_6"
                    >
                        {step === 'upload' && (
                            <>
                                <button
                                    onClick={handleClose}
                                    className="w-full md:w-auto px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 order-2 md:order-1"
                                    data-oid="l8nxl4u"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={uploadedFiles.length === 0 || isUploading}
                                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 order-1 md:order-2"
                                    data-oid="u_n-_le"
                                >
                                    {isUploading
                                        ? 'Submitting...'
                                        : `Submit Prescription (${uploadedFiles.length} files)`}
                                </button>
                            </>
                        )}
                        {step === 'success' && (
                            <div
                                className="w-full flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4"
                                data-oid="p55_smd"
                            >
                                <button
                                    onClick={() => {
                                        handleClose();
                                        router.push('/prescription/status');
                                    }}
                                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    data-oid="-_u7ix:"
                                >
                                    View Status
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full md:w-auto px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                                    data-oid="d7k_etf"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Camera Capture Modal */}
            {isCameraOpen && (
                <CameraCapture
                    isOpen={isCameraOpen}
                    onCapture={handleCameraCapture}
                    onClose={closeCamera}
                    data-oid="xzoj2nd"
                />
            )}
        </div>
    );

    // Use portal to render modal at document body level
    return createPortal(
        <ClientOnly fallback={null} data-oid="9vs8q1m">
            {modalContent}
        </ClientOnly>,
        document.body,
    );
}
