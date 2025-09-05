'use client';

import { useState, useRef, useEffect } from 'react';

interface QRCodeGeneratorProps {
    data: string;
    size?: number;
    logoUrl?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    className?: string;
    onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

export function QRCodeGenerator({
    data,
    size = 200,
    logoUrl,
    backgroundColor = '#FFFFFF',
    foregroundColor = '#1F1F6F',
    className = '',
    onCanvasReady,
}: QRCodeGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        generateQRCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, size, backgroundColor, foregroundColor]);

    useEffect(() => {
        if (onCanvasReady && canvasRef.current) {
            onCanvasReady(canvasRef.current);
        }
    }, [onCanvasReady]);

    useEffect(() => {
        if (onCanvasReady && canvasRef.current) {
            onCanvasReady(canvasRef.current);
        }
    }, [onCanvasReady]);

    const generateQRCode = async () => {
        if (!canvasRef.current || !data) return;

        setIsGenerating(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Set canvas size
        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, size, size);

        // Simple QR code pattern generation (mock implementation)
        // In a real implementation, you would use a proper QR code library
        const moduleSize = size / 25; // 25x25 grid
        const modules = generateQRPattern(data);

        // Draw QR code modules
        ctx.fillStyle = foregroundColor;
        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 25; col++) {
                if (modules[row][col]) {
                    ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
                }
            }
        }

        // Add finder patterns (corner squares)
        drawFinderPattern(ctx, 0, 0, moduleSize);
        drawFinderPattern(ctx, 18 * moduleSize, 0, moduleSize);
        drawFinderPattern(ctx, 0, 18 * moduleSize, moduleSize);

        // Add logo if provided
        if (logoUrl) {
            try {
                const logo = new Image();
                logo.crossOrigin = 'anonymous';
                logo.onload = () => {
                    const logoSize = size * 0.2; // 20% of QR code size
                    const logoX = (size - logoSize) / 2;
                    const logoY = (size - logoSize) / 2;

                    // Draw white background for logo
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

                    // Draw logo
                    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                };
                logo.src = logoUrl;
            } catch (error) {
                console.error('Error loading logo:', error);
            }
        }

        setIsGenerating(false);
    };

    const generateQRPattern = (text: string): boolean[][] => {
        // Simple pattern generation based on text hash
        // In a real implementation, use a proper QR code algorithm
        const hash = simpleHash(text);
        const pattern: boolean[][] = Array(25)
            .fill(null)
            .map(() => Array(25).fill(false));

        // Generate pseudo-random pattern based on hash
        let seed = hash;
        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 25; col++) {
                // Skip finder pattern areas
                if (isFinderPatternArea(row, col)) continue;

                seed = (seed * 1103515245 + 12345) & 0x7fffffff;
                pattern[row][col] = seed % 100 < 45; // ~45% fill rate
            }
        }

        return pattern;
    };

    const simpleHash = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    };

    const isFinderPatternArea = (row: number, col: number): boolean => {
        // Top-left finder pattern
        if (row < 9 && col < 9) return true;
        // Top-right finder pattern
        if (row < 9 && col > 15) return true;
        // Bottom-left finder pattern
        if (row > 15 && col < 9) return true;
        return false;
    };

    const drawFinderPattern = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        moduleSize: number,
    ) => {
        // Outer square (7x7)
        ctx.fillStyle = foregroundColor;
        ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);

        // Inner white square (5x5)
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);

        // Center square (3x3)
        ctx.fillStyle = foregroundColor;
        ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    const downloadQRCode = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `qr-code-${data.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const copyQRCodeToClipboard = async () => {
        if (!canvasRef.current) return;

        try {
            const canvas = canvasRef.current;
            canvas.toBlob(async (blob) => {
                if (blob) {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    alert('QR code copied to clipboard!');
                }
            });
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            alert('Failed to copy QR code to clipboard');
        }
    };

    return (
        <div className={`flex flex-col items-center space-y-4 ${className}`} data-oid="r:nkuc8">
            <div className="relative" data-oid="qdnt5af">
                <canvas
                    ref={canvasRef}
                    className="border border-gray-200 rounded-lg shadow-sm"
                    data-oid="ojq2r5:"
                />

                {isGenerating && (
                    <div
                        className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
                        data-oid="cbsd2yu"
                    >
                        <div
                            className="w-6 h-6 border-2 border-[#1F1F6F] border-t-transparent rounded-full animate-spin"
                            data-oid="gbu0435"
                        ></div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center" data-oid="718orv:">
                <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm bg-white"
                    data-oid="g3ctrjj"
                >
                    Download PNG
                </button>
                <button
                    onClick={copyQRCodeToClipboard}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm bg-white"
                    data-oid="v3tg3jt"
                >
                    Copy to Clipboard
                </button>
            </div>

            <div className="text-center" data-oid="_sl.1fp">
                <p className="text-sm text-gray-600" data-oid="2-n9nxm">
                    Data: {data}
                </p>
                <p className="text-xs text-gray-500" data-oid="6e:b0m2">
                    Size: {size}x{size}px
                </p>
            </div>
        </div>
    );
}
