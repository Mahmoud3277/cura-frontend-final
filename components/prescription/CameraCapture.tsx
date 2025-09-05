'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
    isOpen: boolean;
}

export function CameraCapture({ onCapture, onClose, isOpen }: CameraCaptureProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    // Check for multiple cameras
    const checkCameras = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setHasMultipleCameras(videoDevices.length > 1);
        } catch (err) {
            console.error('Error checking cameras:', err);
        }
    }, []);

    // Start camera stream
    const startCamera = useCallback(async () => {
        try {
            setError(null);

            // Stop existing stream
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }

            // Simplified constraints for better compatibility
            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 },
                },
                audio: false,
            };

            console.log('Requesting camera with constraints:', constraints);
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Camera stream obtained:', newStream);

            setStream(newStream);

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;

                // Wait for video to load
                videoRef.current.onloadedmetadata = () => {
                    console.log('Video metadata loaded');
                    if (videoRef.current) {
                        videoRef.current.play().catch(console.error);
                    }
                };
            }
        } catch (err: any) {
            console.error('Error accessing camera:', err);
            setError(
                err.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow camera permissions and try again.'
                    : err.name === 'NotFoundError'
                      ? 'No camera found on this device.'
                      : err.name === 'OverconstrainedError'
                        ? 'Camera constraints not supported. Trying with basic settings...'
                        : 'Failed to access camera. Please try again.',
            );

            // Try with basic constraints if overconstrained
            if (err.name === 'OverconstrainedError') {
                try {
                    const basicConstraints = {
                        video: { facingMode: facingMode },
                        audio: false,
                    };
                    const basicStream = await navigator.mediaDevices.getUserMedia(basicConstraints);
                    setStream(basicStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = basicStream;
                        videoRef.current.onloadedmetadata = () => {
                            if (videoRef.current) {
                                videoRef.current.play().catch(console.error);
                            }
                        };
                    }
                    setError(null);
                } catch (basicErr) {
                    console.error('Basic camera access also failed:', basicErr);
                }
            }
        }
    }, [facingMode, stream]);

    // Stop camera stream
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    }, [stream]);

    // Capture photo
    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsCapturing(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const file = new File([blob], `prescription-${timestamp}.jpg`, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });

                    onCapture(file);
                    stopCamera();
                    onClose();
                }
                setIsCapturing(false);
            },
            'image/jpeg',
            0.9,
        );
    }, [onCapture, stopCamera, onClose]);

    // Switch camera (front/back)
    const switchCamera = useCallback(() => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    }, []);

    // Initialize camera when modal opens
    useEffect(() => {
        if (isOpen) {
            checkCameras();
            // Add small delay to ensure DOM is ready
            setTimeout(() => {
                startCamera();
            }, 100);
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Restart camera when facing mode changes
    useEffect(() => {
        if (isOpen) {
            startCamera();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" data-oid="hk7_b0z">
            {/* Close button - responsive positioning */}
            <button
                onClick={onClose}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-200 text-white z-20 text-sm sm:text-base"
                data-oid="lrb6j3g"
            >
                ✕
            </button>

            {/* Camera View */}
            <div
                className="flex-1 relative bg-black flex items-center justify-center"
                data-oid="c2a87l6"
            >
                {error ? (
                    <div className="text-center text-white p-8" data-oid="2.e4w47">
                        <div
                            className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                            data-oid="xlk_ez6"
                        >
                            <span className="text-2xl" data-oid="-fru.y7">
                                ⚠️
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2" data-oid="3xq.sa8">
                            Camera Error
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-md" data-oid="e9_gvx6">
                            {error}
                        </p>
                        <div className="space-y-3" data-oid=".easb_9">
                            <button
                                onClick={startCamera}
                                className="bg-[#1F1F6F] hover:bg-[#14274E] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                data-oid="4q-l4:x"
                            >
                                Try Again
                            </button>
                            <br data-oid="-yjifzs" />
                            <button
                                onClick={onClose}
                                className="text-gray-300 hover:text-white transition-colors duration-200"
                                data-oid="a04yf4_"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            data-oid="z:1jsc."
                        />

                        {/* Overlay Guide */}
                        <div className="absolute inset-0 pointer-events-none" data-oid="3re9re8">
                            {/* Corner guides */}
                            <div className="absolute top-1/4 left-1/4 w-16 h-16" data-oid="k7p1apm">
                                <div
                                    className="absolute top-0 left-0 w-8 h-1 bg-white/80"
                                    data-oid="8s1ixn8"
                                ></div>
                                <div
                                    className="absolute top-0 left-0 w-1 h-8 bg-white/80"
                                    data-oid="ojf3zq6"
                                ></div>
                            </div>
                            <div
                                className="absolute top-1/4 right-1/4 w-16 h-16"
                                data-oid="1uj-cfx"
                            >
                                <div
                                    className="absolute top-0 right-0 w-8 h-1 bg-white/80"
                                    data-oid="pq8c303"
                                ></div>
                                <div
                                    className="absolute top-0 right-0 w-1 h-8 bg-white/80"
                                    data-oid="qy-8zig"
                                ></div>
                            </div>
                            <div
                                className="absolute bottom-1/4 left-1/4 w-16 h-16"
                                data-oid="9e4d1-:"
                            >
                                <div
                                    className="absolute bottom-0 left-0 w-8 h-1 bg-white/80"
                                    data-oid="lts23z1"
                                ></div>
                                <div
                                    className="absolute bottom-0 left-0 w-1 h-8 bg-white/80"
                                    data-oid="66qnbtm"
                                ></div>
                            </div>
                            <div
                                className="absolute bottom-1/4 right-1/4 w-16 h-16"
                                data-oid="shjj16v"
                            >
                                <div
                                    className="absolute bottom-0 right-0 w-8 h-1 bg-white/80"
                                    data-oid="28uubgx"
                                ></div>
                                <div
                                    className="absolute bottom-0 right-0 w-1 h-8 bg-white/80"
                                    data-oid="hknqae."
                                ></div>
                            </div>

                            {/* Center guide text - responsive positioning */}
                            <div
                                className="absolute top-4 sm:top-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs sm:text-sm"
                                data-oid="zvpr1wt"
                            >
                                Position prescription within the guides
                            </div>

                            {/* Bottom instruction text - responsive positioning */}
                            <div
                                className="absolute bottom-24 sm:bottom-32 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs sm:text-sm text-center max-w-xs"
                                data-oid="mfr7q9x"
                            >
                                📋 Ensure prescription is well-lit and all text is clearly visible
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Controls - Responsive floating buttons */}
            {!error && stream && (
                <div
                    className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                    data-oid="bggpl1_"
                >
                    <div
                        className="flex items-center justify-center space-x-4 sm:space-x-8"
                        data-oid="cnnaevm"
                    >
                        {/* Switch Camera Button */}
                        {hasMultipleCameras && (
                            <button
                                onClick={switchCamera}
                                className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200 backdrop-blur-sm"
                                title="Switch Camera"
                                data-oid="03is4ai"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="69ls3z."
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        data-oid="4avcop1"
                                    />
                                </svg>
                            </button>
                        )}

                        {/* Capture Button */}
                        <button
                            onClick={capturePhoto}
                            disabled={isCapturing || !stream}
                            className="w-20 h-20 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                            data-oid="gffmkls"
                        >
                            {isCapturing ? (
                                <div
                                    className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                                    data-oid=".cv1u1x"
                                ></div>
                            ) : (
                                <div
                                    className="w-16 h-16 bg-[#1F1F6F] rounded-full flex items-center justify-center"
                                    data-oid="jsi0.lf"
                                >
                                    <span className="text-2xl text-white" data-oid="l91oa8k">
                                        📷
                                    </span>
                                </div>
                            )}
                        </button>

                        {/* Cancel Button */}
                        <button
                            onClick={onClose}
                            className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200 backdrop-blur-sm"
                            title="Cancel"
                            data-oid=":9:82vk"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="srmlcol"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid="d_-4g0l"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" data-oid="29wxxmm" />
        </div>
    );
}
