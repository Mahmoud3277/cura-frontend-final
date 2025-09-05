'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrescriptionWorkflow } from '@/lib/data/prescriptionWorkflow';
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Maximize,
    X,
    ChevronLeft,
    ChevronRight,
    FileText,
    Calendar,
    User,
    Stethoscope,
} from 'lucide-react';

interface PrescriptionImageViewerProps {
    prescription: PrescriptionWorkflow | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PrescriptionImageViewer({
    prescription,
    isOpen,
    onClose,
}: PrescriptionImageViewerProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!prescription) return null;

    // Mock prescription images - in real app, these would come from prescription.files
    const prescriptionImages = [
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop',
    ];

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 25, 300));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 25, 25));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleReset = () => {
        setZoom(100);
        setRotation(0);
    };

    const handleDownload = () => {
        // In a real app, this would download the actual prescription file
        const link = document.createElement('a');
        link.href = prescriptionImages[currentImageIndex];
        link.download = `prescription_${prescription.id}_${currentImageIndex + 1}.jpg`;
        link.click();
    };

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? prescriptionImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev === prescriptionImages.length - 1 ? 0 : prev + 1));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="e-g:1dp">
            <DialogContent
                className={`${isFullscreen ? 'max-w-[98vw] max-h-[98vh]' : 'max-w-[92vw] max-h-[96vh]'} p-0 w-full h-full`}
                data-oid="-pk555s"
            >
                <DialogHeader className="p-3 lg:p-4 pb-3 border-b flex-shrink-0" data-oid="epkk0:n">
                    <DialogTitle
                        className="flex items-center justify-between flex-wrap gap-2"
                        data-oid="rq_.1l5"
                    >
                        <div className="flex items-center space-x-3" data-oid=":zf3uqn">
                            <div
                                className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"
                                data-oid="789hsp9"
                            >
                                <FileText className="w-5 h-5" data-oid="bx-:-dd" />
                            </div>
                            <div data-oid="ec1p6iv">
                                <h2 className="text-xl font-bold" data-oid="_k0kpoy">
                                    Prescription Viewer
                                </h2>
                                <p className="text-sm text-gray-600" data-oid="sgh27md">
                                    Prescription ID: {prescription.id}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2" data-oid="8vl_k15">
                            <Badge className="bg-blue-100 text-blue-800" data-oid="cgg8r-x">
                                {prescription.currentStatus.toUpperCase()}
                            </Badge>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div
                    className="flex flex-1 overflow-hidden flex-col lg:flex-row"
                    data-oid="cndaa78"
                >
                    {/* Sidebar with prescription details */}
                    <div
                        className="w-full lg:w-80 lg:border-r border-b lg:border-b-0 bg-gray-50 p-4 lg:p-6 overflow-y-auto flex-shrink-0 max-h-72 lg:max-h-none"
                        data-oid="fa7hcq6"
                    >
                        <div className="space-y-6" data-oid="78cx_ht">
                            {/* Patient Information */}
                            <div data-oid="g2ih408">
                                <h3
                                    className="font-semibold text-gray-900 mb-3 flex items-center"
                                    data-oid="16ylu91"
                                >
                                    <User className="w-4 h-4 mr-2" data-oid="neyitd3" />
                                    Patient Information
                                </h3>
                                <div className="space-y-2 text-sm" data-oid="rmi.pyy">
                                    <div data-oid="w:b4axf">
                                        <span className="text-gray-600" data-oid="npc0xfu">
                                            Name:
                                        </span>
                                        <p className="font-medium" data-oid="z1i6yo1">
                                            {prescription.patientName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Prescription Details */}
                            <div data-oid="zchi70b">
                                <h3
                                    className="font-semibold text-gray-900 mb-3 flex items-center"
                                    data-oid="v8-ebie"
                                >
                                    <Calendar className="w-4 h-4 mr-2" data-oid="kp_t3ke" />
                                    Prescription Details
                                </h3>
                                <div className="space-y-2 text-sm" data-oid="no7v:kz">
                                    <div data-oid="jbn5zw0">
                                        <span className="text-gray-600" data-oid="ulw-hma">
                                            Date Issued:
                                        </span>
                                        <p className="font-medium" data-oid="zdycdt-">
                                            {formatDate(prescription.createdAt)}
                                        </p>
                                    </div>
                                    <div data-oid="fwjh-ca">
                                        <span className="text-gray-600" data-oid="xu_t6w6">
                                            Status:
                                        </span>
                                        <Badge
                                            className="ml-2 text-xs bg-blue-100 text-blue-800"
                                            data-oid="r8.m4gv"
                                        >
                                            {prescription.currentStatus.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div data-oid="e3:mim2">
                                        <span className="text-gray-600" data-oid="2bk1wml">
                                            Files:
                                        </span>
                                        <p className="font-medium" data-oid="dpleva4">
                                            {prescriptionImages.length} image(s)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Medications */}
                            <div data-oid="xq.9bu7">
                                <h3 className="font-semibold text-gray-900 mb-3" data-oid="w:fc0cu">
                                    Medications
                                </h3>
                                <div className="space-y-3" data-oid="cih-mhl">
                                    {(() => {
                                        // Enhanced medication list with 5 medications
                                        const medications = [
                                            {
                                                name: 'Losartan 50mg',
                                                dosage: '50mg',
                                                frequency: 'Once daily',
                                            },
                                            {
                                                name: 'Hydrochlorothiazide 25mg',
                                                dosage: '25mg',
                                                frequency: 'Once daily',
                                            },
                                            {
                                                name: 'Amlodipine 5mg',
                                                dosage: '5mg',
                                                frequency: 'Once daily in the morning',
                                            },
                                            {
                                                name: 'Metformin 500mg',
                                                dosage: '500mg',
                                                frequency: 'Twice daily with meals',
                                            },
                                            {
                                                name: 'Aspirin 75mg',
                                                dosage: '75mg',
                                                frequency: 'Once daily after dinner',
                                            },
                                        ];

                                        // Mock product images - in real app, these would come from the medication data
                                        const productImages = [
                                            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
                                            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
                                            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop',
                                            'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop',
                                            'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&h=200&fit=crop',
                                        ];

                                        return medications.map((med, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-3 rounded-lg border text-sm flex items-start space-x-3"
                                                data-oid="cgkpcln"
                                            >
                                                {/* Product Image */}
                                                <div className="flex-shrink-0" data-oid="um3173t">
                                                    <img
                                                        src={productImages[index]}
                                                        alt={med.name}
                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                        data-oid="o20cdd:"
                                                    />
                                                </div>

                                                {/* Medication Details */}
                                                <div className="flex-1 min-w-0" data-oid="ih5swpd">
                                                    <p
                                                        className="font-medium truncate"
                                                        data-oid="dtkokxi"
                                                    >
                                                        {med.name}
                                                    </p>
                                                    <p
                                                        className="text-gray-600 text-xs"
                                                        data-oid="ykou24j"
                                                    >
                                                        {med.dosage}
                                                    </p>
                                                    <p
                                                        className="text-gray-600 text-xs"
                                                        data-oid="o._6g1a"
                                                    >
                                                        {med.frequency}
                                                    </p>
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main image viewer */}
                    <div className="flex-1 flex flex-col" data-oid=":gsjmh9">
                        {/* Toolbar */}
                        <div
                            className="border-b p-2 lg:p-4 flex items-center justify-between bg-white flex-wrap gap-2"
                            data-oid="dbzsz6n"
                        >
                            <div
                                className="flex items-center space-x-1 lg:space-x-2"
                                data-oid="ypw29m."
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleZoomOut}
                                    disabled={zoom <= 25}
                                    data-oid="nn7v:7h"
                                >
                                    <ZoomOut className="w-4 h-4" data-oid="t2bux62" />
                                </Button>
                                <span
                                    className="text-sm font-medium min-w-[60px] text-center"
                                    data-oid="7rd2fru"
                                >
                                    {zoom}%
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleZoomIn}
                                    disabled={zoom >= 300}
                                    data-oid=":nxzyqx"
                                >
                                    <ZoomIn className="w-4 h-4" data-oid="w8aqkvh" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRotate}
                                    data-oid="7:qfz99"
                                >
                                    <RotateCw className="w-4 h-4" data-oid="_p3xdib" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    data-oid="s4qb0e-"
                                >
                                    Reset
                                </Button>
                            </div>

                            <div
                                className="flex items-center space-x-1 lg:space-x-2"
                                data-oid="hl6qgdx"
                            >
                                <span
                                    className="text-xs lg:text-sm text-gray-600"
                                    data-oid="__5a5p:"
                                >
                                    {currentImageIndex + 1} of {prescriptionImages.length}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                    data-oid="kbzh_3v"
                                >
                                    <Download className="w-4 h-4 mr-1" data-oid="9riawij" />
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    data-oid="y1v9xnk"
                                >
                                    <Maximize className="w-4 h-4" data-oid="7-iboin" />
                                </Button>
                            </div>
                        </div>

                        {/* Image container */}
                        <div
                            className="flex-1 relative bg-gray-100 overflow-hidden"
                            data-oid="ptru9gc"
                        >
                            <div
                                className="absolute inset-0 flex items-center justify-center p-4"
                                data-oid="kxgsl6y"
                            >
                                <div
                                    className="relative transition-transform duration-200 ease-in-out"
                                    style={{
                                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                                    }}
                                    data-oid="6xn70ev"
                                >
                                    <img
                                        src={prescriptionImages[currentImageIndex]}
                                        alt={`Prescription ${currentImageIndex + 1}`}
                                        className="max-w-full max-h-full h-auto shadow-lg object-contain"
                                        style={{
                                            maxHeight: isFullscreen ? '92vh' : '85vh',
                                            maxWidth: isFullscreen ? '90vw' : '70vw',
                                        }}
                                        data-oid="n.8uvj:"
                                    />
                                </div>
                            </div>

                            {/* Navigation arrows */}
                            {prescriptionImages.length > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                                        onClick={handlePrevious}
                                        data-oid="-dq5rhu"
                                    >
                                        <ChevronLeft className="w-4 h-4" data-oid="9_pk5vh" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                                        onClick={handleNext}
                                        data-oid="vvcnk2f"
                                    >
                                        <ChevronRight className="w-4 h-4" data-oid="d8z0n8k" />
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Image tabs */}
                        {prescriptionImages.length > 1 && (
                            <div className="border-t p-4 bg-white" data-oid="p224kua">
                                <div className="flex space-x-2 justify-center" data-oid=".wuko6:">
                                    {prescriptionImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-16 h-12 rounded border-2 overflow-hidden transition-colors ${
                                                index === currentImageIndex
                                                    ? 'border-blue-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            data-oid="1f5qetr"
                                        >
                                            <img
                                                src={prescriptionImages[index]}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                data-oid="7cl8ojv"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
