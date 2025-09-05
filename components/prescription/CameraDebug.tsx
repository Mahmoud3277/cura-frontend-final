'use client';
import { useState, useRef, useEffect } from 'react';

interface CameraDebugProps {
    onClose: () => void;
    isOpen: boolean;
}

export function CameraDebug({ onClose, isOpen }: CameraDebugProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);

    const addDebugInfo = (info: string) => {
        setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
    };

    const startCamera = async () => {
        try {
            addDebugInfo('Starting camera...');
            setError(null);

            // Check if getUserMedia is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }

            addDebugInfo('getUserMedia is available');

            // Get available devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            addDebugInfo(`Found ${videoDevices.length} video devices`);

            // Simple constraints
            const constraints = {
                video: true,
                audio: false,
            };

            addDebugInfo('Requesting camera access...');
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            addDebugInfo('Camera access granted');

            setStream(newStream);

            if (videoRef.current) {
                addDebugInfo('Setting video source...');
                videoRef.current.srcObject = newStream;

                videoRef.current.onloadedmetadata = () => {
                    addDebugInfo('Video metadata loaded');
                    if (videoRef.current) {
                        videoRef.current
                            .play()
                            .then(() => addDebugInfo('Video playing'))
                            .catch((err) => addDebugInfo(`Video play error: ${err.message}`));
                    }
                };

                videoRef.current.oncanplay = () => {
                    addDebugInfo('Video can play');
                };

                videoRef.current.onerror = (e) => {
                    addDebugInfo(`Video error: ${e}`);
                };
            }
        } catch (err: any) {
            addDebugInfo(`Camera error: ${err.message}`);
            setError(err.message);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            addDebugInfo('Camera stopped');
        }
    };

    useEffect(() => {
        if (isOpen) {
            addDebugInfo('Camera debug opened');
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" data-oid="ats80mu">
            {/* Header */}
            <div
                className="bg-gray-800 p-4 flex items-center justify-between text-white"
                data-oid="bvus688"
            >
                <h2 className="text-lg font-semibold" data-oid="30ss8eb">
                    Camera Debug
                </h2>
                <button
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                    data-oid="fcm4:ke"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 flex" data-oid="rshn:9z">
                {/* Video Area */}
                <div
                    className="flex-1 bg-black flex items-center justify-center"
                    data-oid="xv_9pti"
                >
                    {error ? (
                        <div className="text-center text-white p-8" data-oid="zvqlc6b">
                            <h3 className="text-xl font-semibold mb-2" data-oid="0hoin2-">
                                Error
                            </h3>
                            <p className="text-red-400" data-oid="9tl-:9b">
                                {error}
                            </p>
                            <button
                                onClick={startCamera}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                data-oid="4he0sqh"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="max-w-full max-h-full"
                            style={{ border: '2px solid red' }}
                            data-oid="p61o3we"
                        />
                    )}
                </div>

                {/* Debug Info */}
                <div className="w-80 bg-gray-900 text-white p-4 overflow-y-auto" data-oid="07lkv-a">
                    <h3 className="font-semibold mb-2" data-oid="vrg5xsk">
                        Debug Info:
                    </h3>
                    <div className="text-xs space-y-1" data-oid="_kz.p0e">
                        {debugInfo.map((info, index) => (
                            <div key={index} className="text-green-400" data-oid="506v3ir">
                                {info}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4" data-oid="a1ai:yu">
                        <h4 className="font-semibold mb-2" data-oid="lwhc:_a">
                            Stream Info:
                        </h4>
                        {stream && (
                            <div className="text-xs" data-oid="iabx8i2">
                                <div data-oid="e:vuamo">Active: {stream.active ? 'Yes' : 'No'}</div>
                                <div data-oid="w0knz4y">Tracks: {stream.getTracks().length}</div>
                                {stream.getVideoTracks().map((track, i) => (
                                    <div key={i} data-oid="7bk:-dp">
                                        Track {i}: {track.label} ({track.readyState})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
