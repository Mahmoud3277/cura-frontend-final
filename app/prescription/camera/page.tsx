'use client';

import { useState } from 'react';
import { CameraCapture } from '@/components/prescription/CameraCapture';
import { useRouter } from 'next/navigation';

export default function CameraPage() {
    const [showCamera, setShowCamera] = useState(true);
    const router = useRouter();

    const handleCameraCapture = (file: File) => {
        console.log('Prescription captured:', file);
        // Handle the captured file - upload it, process it, etc.
        router.push('/prescription/status?success=true');
    };

    const handleCameraClose = () => {
        setShowCamera(false);
        router.back();
    };

    return (
        <div className="min-h-screen bg-black" data-oid="w813t.:">
            <CameraCapture
                isOpen={showCamera}
                onCapture={handleCameraCapture}
                onClose={handleCameraClose}
                data-oid="-ldyn1p"
            />
        </div>
    );
}
