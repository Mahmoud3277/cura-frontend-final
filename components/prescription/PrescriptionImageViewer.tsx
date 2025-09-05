'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PrescriptionFile {
    id: string;
    name: string;
    type: string;
    url?: string;
}

interface PrescriptionImageViewerProps {
    files: PrescriptionFile[];
    selectedIndex: number;
    onClose: () => void;
    onIndexChange: (index: number) => void;
}

export function PrescriptionImageViewer({
    files,
    selectedIndex,
    onClose,
    onIndexChange,
}: PrescriptionImageViewerProps) {
    const currentFile = files[selectedIndex];

    const handlePrevious = () => {
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : files.length - 1;
        onIndexChange(newIndex);
    };

    const handleNext = () => {
        const newIndex = selectedIndex < files.length - 1 ? selectedIndex + 1 : 0;
        onIndexChange(newIndex);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            data-oid=":4d2.d3"
        >
            <div
                className="relative w-full h-full flex items-center justify-center p-4"
                data-oid="cs6q.5z"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                    data-oid="hcfbu21"
                >
                    ✕
                </button>

                {/* Navigation Buttons */}
                {files.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                            data-oid="tlnmf.p"
                        >
                            ‹
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                            data-oid="7shznij"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Main Content */}
                <Card
                    className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto"
                    data-oid="zksm0-1"
                >
                    <CardContent className="p-6" data-oid=".:aqyo5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4" data-oid="i3e5_uf">
                            <h3 className="text-lg font-semibold" data-oid="4cfc3.8">
                                {currentFile?.name}
                            </h3>
                            <div className="flex items-center space-x-2" data-oid="509qmc4">
                                {files.length > 1 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrevious}
                                            disabled={files.length <= 1}
                                            data-oid="z.sdl0_"
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm text-gray-600" data-oid="c92t20z">
                                            {selectedIndex + 1} of {files.length}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNext}
                                            disabled={files.length <= 1}
                                            data-oid="lse1_b9"
                                        >
                                            Next
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* File Content */}
                        <div
                            className="flex items-center justify-center bg-gray-100 rounded-lg p-8 min-h-96"
                            data-oid="4.x6l04"
                        >
                            <div className="text-center" data-oid="f4:clmo">
                                <div
                                    className="w-32 h-32 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                                    data-oid="4ui03hs"
                                >
                                    <span className="text-4xl text-blue-600" data-oid="u70h27o">
                                        {currentFile?.type === 'pdf' ? '📄' : '🖼️'}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-lg font-medium" data-oid="fd02:2a">
                                    {currentFile?.type === 'pdf'
                                        ? 'PDF Document'
                                        : 'Prescription Image'}
                                </p>
                                <p className="text-sm text-gray-500 mt-2" data-oid="iyoi-xr">
                                    {currentFile?.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-4" data-oid="fyx1bfd">
                                    Image viewer would display the actual prescription file here
                                </p>

                                {/* Mock prescription content for demonstration */}
                                <div
                                    className="mt-6 p-4 bg-white rounded border text-left max-w-md mx-auto"
                                    data-oid="17poh3l"
                                >
                                    <div className="text-sm space-y-2" data-oid="yfnucdh">
                                        <div className="border-b pb-2 mb-2" data-oid="zcv5tg-">
                                            <p className="font-semibold" data-oid="py910hi">
                                                Dr. Ahmed Hassan
                                            </p>
                                            <p className="text-xs text-gray-600" data-oid="uy.df5:">
                                                Internal Medicine Specialist
                                            </p>
                                        </div>
                                        <div className="space-y-1" data-oid="-73kx6c">
                                            <p data-oid="-h9ff_a">
                                                <span className="font-medium" data-oid="mnqsrgq">
                                                    Patient:
                                                </span>{' '}
                                                Sarah Mohamed
                                            </p>
                                            <p data-oid="p3s:o2m">
                                                <span className="font-medium" data-oid="5pawccm">
                                                    Date:
                                                </span>{' '}
                                                {new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="border-t pt-2 mt-2" data-oid="jsax_tk">
                                            <p className="font-medium mb-1" data-oid="2vo-td5">
                                                Prescription:
                                            </p>
                                            <div className="text-xs space-y-1" data-oid=".oe2afr">
                                                <p data-oid="m7obm8s">
                                                    1. Paracetamol 500mg - Take 1 tablet every 6
                                                    hours
                                                </p>
                                                <p data-oid="-tyz2e:">
                                                    2. Amoxicillin 500mg - Take 1 capsule 3 times
                                                    daily
                                                </p>
                                                <p data-oid="vxbnt60">
                                                    3. Vitamin D3 1000IU - Take 1 capsule daily
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Navigation Thumbnails */}
                        {files.length > 1 && (
                            <div
                                className="mt-4 flex items-center justify-center space-x-2"
                                data-oid="qnc4oym"
                            >
                                {files.map((file, index) => (
                                    <button
                                        key={file.id}
                                        onClick={() => onIndexChange(index)}
                                        className={`w-12 h-12 rounded border-2 flex items-center justify-center text-xs transition-all ${
                                            index === selectedIndex
                                                ? 'border-[#1F1F6F] bg-[#1F1F6F]/10'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        data-oid="r_ch8l-"
                                    >
                                        {file.type === 'pdf' ? '📄' : '🖼️'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
