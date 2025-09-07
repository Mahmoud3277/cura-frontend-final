'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { CameraCapture } from './CameraCapture';
import { CameraDebug } from './CameraDebug';
import { prescriptionAPIService } from '@/lib/data/prescriptionWorkflow';

interface UploadedFile {
    id: string;
    file: File;
    preview: string;
    type: 'image' | 'pdf';
    size: string;
}

interface PrescriptionUploadProps {
    onUploadComplete?: (files: UploadedFile[], formData: any) => void;
    maxFiles?: number;
    maxFileSize?: number; // in MB
    className?: string;
}

export function PrescriptionUpload({
    onUploadComplete,
    maxFiles = 5,
    maxFileSize = 10,
    className = '',
}: PrescriptionUploadProps) {
    const router = useRouter();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [step, setStep] = useState<'upload' | 'success'>('upload');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { locale } = useLanguage();
    const { t, isLoading: translationsLoading } = useTranslation(locale);
    const { user } = useAuth();

    // Create formData object with user info when available
    const formData = {
        patientName: user?.name || '',
        patientAge: '',
        patientGender: 'male' as 'male' | 'female',
        doctorName: '',
        doctorSpecialty: '',
        hospitalClinic: '',
        prescriptionDate: '',
        deliveryAddress: '',
        notes: '',
        urgency: 'normal' as 'urgent' | 'normal' | 'routine',
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return 'Only JPG, PNG, and PDF files are allowed';
        }

        // Check file size
        const maxSizeBytes = maxFileSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `File size must be less than ${maxFileSize}MB`;
        }

        return null;
    };

    const processFiles = useCallback(
        async (files: FileList) => {
            const newErrors: string[] = [];
            const newFiles: UploadedFile[] = [];

            // Check total files limit
            if (uploadedFiles.length + files.length > maxFiles) {
                newErrors.push(`Maximum ${maxFiles} files allowed`);
                setErrors(newErrors);
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
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
                        file,
                        preview,
                        type: file.type.startsWith('image/') ? 'image' : 'pdf',
                        size: formatFileSize(file.size),
                    };

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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [uploadedFiles.length, maxFiles, maxFileSize],
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
                patientName: formData.patientName || '',
                patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
                patientGender: formData.patientGender as 'male' | 'female' | undefined,
                doctorName: formData.doctorName || '',
                doctorSpecialty: formData.doctorSpecialty || '',
                hospitalClinic: formData.hospitalClinic || '',
                prescriptionDate: formData.prescriptionDate || '',
                urgency: formData.urgency as 'urgent' | 'normal' | 'routine',
                notes: formData.notes || '',
                deliveryAddress: formData.deliveryAddress || ''
            };

            // Extract the actual File objects from uploadedFiles
            const fileObjects: File[] = uploadedFiles.map(uploadedFile => uploadedFile.file);

            console.log('Files being sent to API:', fileObjects.map(f => ({ name: f.name, size: f.size, type: f.type })));

            // Create prescription via API
            const response = await prescriptionAPIService.createPrescription(prescriptionData, fileObjects);

            if (response.success && response.data) {
                setIsUploading(false);
                setStep('success');

                // Call the completion callback with the uploaded files (not API response files)
                onUploadComplete?.(uploadedFiles, {
                    ...formData,
                    prescriptionId: response.data._id,
                    prescriptionNumber: response.data.prescriptionNumber,
                    currentStatus: response.data.currentStatus,
                    estimatedCompletion: response.data.estimatedCompletion
                });

                // Redirect to prescription status page with the new prescription ID
                setTimeout(() => {
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

    const handleCameraCapture = useCallback(
        (file: File) => {
            const fileList = new DataTransfer();
            fileList.items.add(file);
            processFiles(fileList.files);
        },
        [processFiles],
    );

    const openCamera = () => {
        setIsCameraOpen(true);
    };

    const closeCamera = () => {
        setIsCameraOpen(false);
    };

    return (
        <div className={`max-w-4xl mx-auto ${className}`} data-oid="264:onx">
            {/* Header */}
            <div className="text-center mb-8" data-oid="fw8zo5g">
                <div
                    className="w-20 h-20 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center mx-auto mb-4"
                    data-oid="3tm4xhr"
                >
                    <svg
                        className="w-10 h-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        data-oid="7_iv8yp"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                            data-oid="z2:endy"
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2" data-oid="bkc8m06">
                    {t('prescription.upload.title')}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto" data-oid=".0rpb1t">
                    {t('prescription.upload.description')}
                </p>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
                <div
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    data-oid="2u32iax"
                >
                    <div className="flex items-center mb-2" data-oid="dmzbi55">
                        <svg
                            className="w-5 h-5 text-red-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            data-oid="omh64k-"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                                data-oid="0jyd85r"
                            />
                        </svg>
                        <h4 className="text-red-800 font-semibold" data-oid="s6-0.s2">
                            Upload Errors
                        </h4>
                    </div>
                    <ul className="text-red-700 text-sm space-y-1" data-oid="al8-yhl">
                        {errors.map((error, index) => (
                            <li key={index} data-oid="8y7n311">
                                • {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Upload Area */}
            <div className="mb-8" data-oid="_50ye-_">
                <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                        isDragOver
                            ? 'border-[#1F1F6F] bg-[#1F1F6F]/5 scale-105'
                            : 'border-gray-300 hover:border-[#1F1F6F] hover:bg-[#1F1F6F]/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    data-oid="cqimy2y"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        data-oid="ufazk60"
                    />

                    {isUploading ? (
                        <div className="space-y-4" data-oid="p9cls15">
                            <div
                                className="w-16 h-16 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto"
                                data-oid="2p03c68"
                            ></div>
                            <p className="text-gray-600" data-oid="mndkd7g">
                                Uploading files...
                            </p>
                            <div
                                className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto"
                                data-oid="paqx1b8"
                            >
                                <div
                                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                    data-oid="882ar8w"
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6" data-oid="pglpysa">
                            <svg
                                className="w-16 h-16 text-gray-400 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="25_1z94"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    data-oid="wogh67h"
                                />
                            </svg>
                            <div data-oid="4cgtq_7">
                                <p
                                    className="text-lg font-semibold text-gray-700 mb-2"
                                    data-oid="s0-sm7p"
                                >
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-gray-500 mb-4" data-oid="v71x_24">
                                    PNG, JPG, PDF up to {maxFileSize}MB each (Max {maxFiles} files)
                                </p>

                                {/* Camera Button */}
                                <div
                                    className="flex items-center justify-center space-x-4"
                                    data-oid="h1bmisn"
                                >
                                    <div
                                        className="flex items-center space-x-2 text-gray-400"
                                        data-oid="5ai8yuh"
                                    >
                                        <div
                                            className="h-px bg-gray-300 w-16"
                                            data-oid="_m.4i5e"
                                        ></div>
                                        <span className="text-sm" data-oid="f3x9:o9">
                                            or
                                        </span>
                                        <div
                                            className="h-px bg-gray-300 w-16"
                                            data-oid="o06tjhw"
                                        ></div>
                                    </div>
                                </div>
                                <button
                                    onClick={openCamera}
                                    className="mt-4 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
                                    data-oid="uw5c-tt"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="rrlzn1h"
                                    >
                                        <path
                                            d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7S17 9.24 17 12S14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15S15 13.66 15 12S13.66 9 12 9Z"
                                            data-oid="f.34:.a"
                                        />
                                    </svg>
                                    <span data-oid="ftd1i._">Take Photo</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
                <div className="mb-8" data-oid="9uj_bl6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" data-oid="d7:980-">
                        Uploaded Files ({uploadedFiles.length})
                    </h3>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        data-oid="dmro60a"
                    >
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                data-oid=":71nje."
                            >
                                <div
                                    className="flex items-start justify-between mb-3"
                                    data-oid="6j..i-z"
                                >
                                    <div className="flex items-center space-x-2" data-oid=".orp4ee">
                                        {file.type === 'image' ? (
                                            <svg
                                                className="w-6 h-6 text-blue-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid="f_q2vz."
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                    clipRule="evenodd"
                                                    data-oid="awkgf-r"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-6 h-6 text-red-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid="oxj2rr0"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                    clipRule="evenodd"
                                                    data-oid="g_jz4zl"
                                                />
                                            </svg>
                                        )}
                                        <div data-oid="hwlakdu">
                                            <p
                                                className="font-medium text-gray-900 text-sm truncate max-w-32"
                                                data-oid="_-r8i9_"
                                            >
                                                {file.file.name}
                                            </p>
                                            <p className="text-xs text-gray-500" data-oid="tcx7-nz">
                                                {file.size}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                        data-oid="7pmn:m7"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            data-oid="ylc9b-q"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                                data-oid="on9flcp"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {file.type === 'image' && (
                                    <div
                                        className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
                                        data-oid="vb5wct1"
                                    >
                                        <img
                                            src={file.preview}
                                            alt="Prescription preview"
                                            className="w-full h-full object-cover"
                                            data-oid="fj.3fjo"
                                        />
                                    </div>
                                )}
                                {file.type === 'pdf' && (
                                    <div
                                        className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center"
                                        data-oid="ekf7rxc"
                                    >
                                        <div className="text-center" data-oid="a-qk-.2">
                                            <svg
                                                className="w-12 h-12 text-red-500 mb-2 mx-auto"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid="69g_w.s"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                    clipRule="evenodd"
                                                    data-oid="oggzrlj"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-600" data-oid="p_zrz_p">
                                                PDF Document
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="text-center" data-oid="sx_65sg">
                <button
                    onClick={handleSubmit}
                    disabled={uploadedFiles.length === 0 || isUploading}
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    data-oid="d-cyrhw"
                >
                    {isUploading ? 'Processing...' : 'Submit Prescription'}
                </button>
            </div>

            {/* Camera Capture Modal */}
            <CameraCapture
                isOpen={isCameraOpen}
                onCapture={handleCameraCapture}
                onClose={closeCamera}
                data-oid="zuj_dsx"
            />
        </div>
    );
}
