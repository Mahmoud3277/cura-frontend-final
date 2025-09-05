'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QRCodeGenerator } from './QRCodeGenerator';
import { DoctorDetails } from '@/lib/services/doctorManagementService';
import { Download, Copy, Share2, QrCode, Link, FileText, Printer } from 'lucide-react';

interface EnhancedQRCodeManagerProps {
    doctor: DoctorDetails;
}

export function EnhancedQRCodeManager({ doctor }: EnhancedQRCodeManagerProps) {
    const [qrCodeType, setQrCodeType] = useState<'code' | 'link' | 'custom'>('code');
    const [customData, setCustomData] = useState('');
    const [qrSize, setQrSize] = useState(200);
    const [includeMessage, setIncludeMessage] = useState(false);
    const [customMessage, setCustomMessage] = useState(doctor.referralSystem.customMessage || '');
    const [qrCanvas, setQrCanvas] = useState<HTMLCanvasElement | null>(null);

    // Callback to get canvas reference from QRCodeGenerator
    const handleCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
        setQrCanvas(canvas);
    }, []);

    const getQRData = () => {
        switch (qrCodeType) {
            case 'code':
                return doctor.referralSystem.referralCode;
            case 'link':
                return doctor.referralSystem.referralLink;
            case 'custom':
                return customData || doctor.referralSystem.referralCode;
            default:
                return doctor.referralSystem.referralCode;
        }
    };

    const getQRDataWithMessage = () => {
        const baseData = getQRData();
        if (includeMessage && customMessage) {
            return `${baseData}\n\n${customMessage}`;
        }
        return baseData;
    };

    const generateBusinessCard = () => {
        const businessCardData = `BEGIN:VCARD
VERSION:3.0
FN:${doctor.name}
ORG:${doctor.clinicHospital}
TITLE:${doctor.specialization}
TEL:${doctor.phone}
EMAIL:${doctor.email}
ADR:;;${doctor.address};${doctor.cityName};;;Egypt
URL:${doctor.referralSystem.referralLink}
NOTE:${customMessage || 'Trusted medical referrals'}
END:VCARD`;

        return businessCardData;
    };

    const copyReferralLink = async () => {
        try {
            await navigator.clipboard.writeText(doctor.referralSystem.referralLink);
            alert('Referral link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
            alert('Failed to copy link. Please try again.');
        }
    };

    const shareReferral = async () => {
        const shareData = {
            title: `${doctor.name} - Medical Referral`,
            text: `Get your medicines delivered with ${doctor.name}'s trusted recommendation. ${customMessage || ''}`,
            url: doctor.referralSystem.referralLink,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                alert('Referral information copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy:', error);
                alert('Failed to share. Please try again.');
            }
        }
    };

    const downloadQRAsPDF = () => {
        if (!qrCanvas) {
            alert('QR code is not ready yet. Please wait a moment and try again.');
            return;
        }

        try {
            const qrDataUrl = qrCanvas.toDataURL('image/png');
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>QR Code - ${doctor.name}</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; margin: 0; background: white; }
                            .header { margin-bottom: 30px; border-bottom: 2px solid #1F1F6F; padding-bottom: 20px; }
                            .qr-container { margin: 30px 0; text-align: center; }
                            .qr-image { border: 2px solid #1F1F6F; border-radius: 10px; padding: 20px; display: inline-block; background: white; }
                            .referral-code { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 18px; margin: 10px 0; text-align: center; }
                            h1 { color: #1F1F6F; margin: 0; }
                            h2 { color: #394867; margin: 10px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${doctor.name}</h1>
                            <h2>${doctor.specialization}</h2>
                            <p><strong>${doctor.clinicHospital}</strong></p>
                        </div>
                        <div class="qr-container">
                            <div class="qr-image">
                                <img src="${qrDataUrl}" alt="QR Code" style="max-width: 300px; height: auto;" />
                            </div>
                            <div class="referral-code">Referral Code: ${doctor.referralSystem.referralCode}</div>
                        </div>
                        <script>window.onload = function() { setTimeout(function() { window.print(); }, 1000); }</script>
                    </body>
                    </html>
                `);
                printWindow.document.close();
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const downloadQRImage = () => {
        if (!qrCanvas) {
            alert('QR code is not ready yet. Please wait a moment and try again.');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = `qr-code-${doctor.referralSystem.referralCode}.png`;
            link.href = qrCanvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('Failed to download image. Please try again.');
        }
    };

    return (
        <div className="space-y-6" data-oid="nd1d8:l">
            {/* Quick Actions Header */}
            <Card data-oid="fxc_:ze">
                <CardHeader data-oid="v9xr5eo">
                    <CardTitle className="flex items-center gap-2" data-oid=":4hk57v">
                        <QrCode className="h-5 w-5" data-oid="w-oxnk8" />
                        QR Code & Referral Manager
                    </CardTitle>
                    <CardDescription data-oid="9.zp122">
                        Generate and manage your referral QR codes and links
                    </CardDescription>
                </CardHeader>
                <CardContent data-oid="p0thlk5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="byex:co">
                        <Button
                            onClick={copyReferralLink}
                            variant="outline"
                            className="flex items-center gap-2"
                            data-oid="50k2e2h"
                        >
                            <Copy className="h-4 w-4" data-oid="6tbqpti" />
                            Copy Link
                        </Button>
                        <Button
                            onClick={shareReferral}
                            variant="outline"
                            className="flex items-center gap-2"
                            data-oid="y0h8rxj"
                        >
                            <Share2 className="h-4 w-4" data-oid="k04b_y_" />
                            Share Referral
                        </Button>
                        <Button
                            onClick={downloadQRAsPDF}
                            variant="outline"
                            className="flex items-center gap-2"
                            data-oid="x9-t1.j"
                        >
                            <Download className="h-4 w-4" data-oid="n2pd744" />
                            Download PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Referral Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="vn_58fi">
                <Card data-oid="4b3_l7s">
                    <CardHeader data-oid="u2cpnws">
                        <CardTitle className="flex items-center gap-2" data-oid="f9mb_-:">
                            <Link className="h-5 w-5" data-oid="uzwo6xy" />
                            Referral Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="8tawl9q">
                        <div data-oid="5nt33bn">
                            <Label className="text-sm font-medium" data-oid="-cgm.v3">
                                Referral Code
                            </Label>
                            <div className="flex items-center gap-2 mt-1" data-oid=":irbg0_">
                                <Input
                                    value={doctor.referralSystem.referralCode}
                                    readOnly
                                    className="font-mono"
                                    data-oid="0w_1j5b"
                                />

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            doctor.referralSystem.referralCode,
                                        )
                                    }
                                    data-oid="4qmj16w"
                                >
                                    <Copy className="h-4 w-4" data-oid="4ohhfag" />
                                </Button>
                            </div>
                        </div>

                        <div data-oid=".48vkee">
                            <Label className="text-sm font-medium" data-oid="wfmaqji">
                                Referral Link
                            </Label>
                            <div className="flex items-center gap-2 mt-1" data-oid="u-tkk48">
                                <Input
                                    value={doctor.referralSystem.referralLink}
                                    readOnly
                                    className="text-sm"
                                    data-oid="gtrqfju"
                                />

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={copyReferralLink}
                                    data-oid=".tuec_f"
                                >
                                    <Copy className="h-4 w-4" data-oid="h2mtp7k" />
                                </Button>
                            </div>
                        </div>

                        <div data-oid="l4kd8jw">
                            <Label className="text-sm font-medium" data-oid="qi506je">
                                Custom Message
                            </Label>
                            <Textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Add a custom message for your referrals..."
                                className="mt-1"
                                rows={3}
                                data-oid="b5rhh12"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card data-oid="sneq1l-">
                    <CardHeader data-oid="q53nnbd">
                        <CardTitle data-oid="c38hxvr">QR Code Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="cqaqr8p">
                        <div data-oid="6yet2kj">
                            <Label className="text-sm font-medium" data-oid="9ch8dj8">
                                QR Code Type
                            </Label>
                            <Select
                                value={qrCodeType}
                                onValueChange={(value: any) => setQrCodeType(value)}
                                data-oid="dslr8-o"
                            >
                                <SelectTrigger className="mt-1" data-oid="e87xb8u">
                                    <SelectValue data-oid="ftlb8y_" />
                                </SelectTrigger>
                                <SelectContent data-oid="do7bji9">
                                    <SelectItem value="code" data-oid=":-n2pe5">
                                        Referral Code Only
                                    </SelectItem>
                                    <SelectItem value="link" data-oid="olexg95">
                                        Referral Link
                                    </SelectItem>
                                    <SelectItem value="custom" data-oid="225o17z">
                                        Custom Data
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {qrCodeType === 'custom' && (
                            <div data-oid="3jpy0yd">
                                <Label className="text-sm font-medium" data-oid="_t6c9w6">
                                    Custom Data
                                </Label>
                                <Textarea
                                    value={customData}
                                    onChange={(e) => setCustomData(e.target.value)}
                                    placeholder="Enter custom data for QR code..."
                                    className="mt-1"
                                    rows={3}
                                    data-oid="k9qh1t8"
                                />
                            </div>
                        )}

                        <div data-oid="uji:exb">
                            <Label className="text-sm font-medium" data-oid="7r.m23j">
                                Size
                            </Label>
                            <Select
                                value={qrSize.toString()}
                                onValueChange={(value) => setQrSize(Number(value))}
                                data-oid="fr317bz"
                            >
                                <SelectTrigger className="mt-1" data-oid="0t9pt04">
                                    <SelectValue data-oid="vwy5cqx" />
                                </SelectTrigger>
                                <SelectContent data-oid="56165pl">
                                    <SelectItem value="150" data-oid="tm-b0va">
                                        Small (150px)
                                    </SelectItem>
                                    <SelectItem value="200" data-oid="l6waj.k">
                                        Medium (200px)
                                    </SelectItem>
                                    <SelectItem value="300" data-oid="v12wk38">
                                        Large (300px)
                                    </SelectItem>
                                    <SelectItem value="400" data-oid="f5ybq06">
                                        Extra Large (400px)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2" data-oid="5dgy.5.">
                            <input
                                type="checkbox"
                                id="includeMessage"
                                checked={includeMessage}
                                onChange={(e) => setIncludeMessage(e.target.checked)}
                                className="rounded"
                                data-oid="1kcsj7f"
                            />

                            <Label htmlFor="includeMessage" className="text-sm" data-oid="y0xpvob">
                                Include custom message in QR code
                            </Label>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* QR Code Display */}
            <Card data-oid="wrxzhu5">
                <CardHeader data-oid="tio-z0y">
                    <CardTitle data-oid="bqqhg9-">Your Referral QR Code</CardTitle>
                    <CardDescription data-oid="hb8iqpc">
                        Share this QR code with patients to earn referral commissions
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center" data-oid="p:-qx-4">
                    <QRCodeGenerator
                        data={getQRDataWithMessage()}
                        size={qrSize}
                        backgroundColor="#FFFFFF"
                        foregroundColor="#1F1F6F"
                        onCanvasRef={handleCanvasRef}
                        data-oid="48z8j3m"
                    />
                </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card data-oid="53a229l">
                <CardHeader data-oid=".io.l24">
                    <CardTitle className="flex items-center gap-2" data-oid="glaof9a">
                        <FileText className="h-5 w-5" data-oid="pkkgruz" />
                        Usage Instructions
                    </CardTitle>
                </CardHeader>
                <CardContent data-oid="5q08obz">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="gw9b2.6">
                        <div data-oid="pl9nilm">
                            <h4 className="font-medium text-gray-900 mb-3" data-oid="504jxcy">
                                Referral QR Code
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-2" data-oid="gf.3doh">
                                <li className="flex items-start gap-2" data-oid="2ug60vd">
                                    <Badge variant="outline" className="mt-0.5" data-oid="c:kjkla">
                                        1
                                    </Badge>
                                    Display in your clinic waiting area
                                </li>
                                <li className="flex items-start gap-2" data-oid="s_3y-az">
                                    <Badge variant="outline" className="mt-0.5" data-oid="_q.jlxw">
                                        2
                                    </Badge>
                                    Include in prescription notes
                                </li>
                                <li className="flex items-start gap-2" data-oid="tnwheja">
                                    <Badge variant="outline" className="mt-0.5" data-oid="wgizbrd">
                                        3
                                    </Badge>
                                    Share on social media platforms
                                </li>
                                <li className="flex items-start gap-2" data-oid="_70161.">
                                    <Badge variant="outline" className="mt-0.5" data-oid="ok.bijm">
                                        4
                                    </Badge>
                                    Add to email signatures
                                </li>
                            </ul>
                        </div>
                        <div data-oid="4s0zldg">
                            <h4 className="font-medium text-gray-900 mb-3" data-oid="_719eju">
                                Business Card QR Code
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-2" data-oid="atxi:t5">
                                <li className="flex items-start gap-2" data-oid="fqec:8q">
                                    <Badge variant="outline" className="mt-0.5" data-oid="9l0.g19">
                                        1
                                    </Badge>
                                    Add to physical business cards
                                </li>
                                <li className="flex items-start gap-2" data-oid=".i6q2xi">
                                    <Badge variant="outline" className="mt-0.5" data-oid="of7toog">
                                        2
                                    </Badge>
                                    Include in conference materials
                                </li>
                                <li className="flex items-start gap-2" data-oid="bs92b0-">
                                    <Badge variant="outline" className="mt-0.5" data-oid="k_70:m4">
                                        3
                                    </Badge>
                                    Share at medical events
                                </li>
                                <li className="flex items-start gap-2" data-oid="hhvhm..">
                                    <Badge variant="outline" className="mt-0.5" data-oid="et4z8po">
                                        4
                                    </Badge>
                                    Use for professional networking
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
