'use client';

import { useState } from 'react';
import { QRCodeGenerator } from './QRCodeGenerator';
import { DoctorDetails } from '@/lib/services/doctorManagementService';

interface DoctorQRCodeManagerProps {
    doctor: DoctorDetails;
}

export function DoctorQRCodeManager({ doctor }: DoctorQRCodeManagerProps) {
    const [qrCodeType, setQrCodeType] = useState<'code' | 'link' | 'custom'>('code');
    const [customData, setCustomData] = useState('');
    const [qrSize, setQrSize] = useState(200);
    const [includeMessage, setIncludeMessage] = useState(false);

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
        if (includeMessage && doctor.referralSystem.customMessage) {
            return `${baseData}\n\n${doctor.referralSystem.customMessage}`;
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
NOTE:${doctor.referralSystem.customMessage || 'Trusted medical referrals'}
END:VCARD`;

        return businessCardData;
    };

    const qrCodeOptions = [
        {
            id: 'code',
            label: 'Referral Code Only',
            description: 'Simple referral code for quick scanning',
        },
        { id: 'link', label: 'Referral Link', description: 'Full URL link for web access' },
        { id: 'custom', label: 'Custom Data', description: 'Enter your own custom data' },
    ];

    const sizeOptions = [
        { value: 150, label: 'Small (150px)' },
        { value: 200, label: 'Medium (200px)' },
        { value: 300, label: 'Large (300px)' },
        { value: 400, label: 'Extra Large (400px)' },
    ];

    return (
        <div className="space-y-6" data-oid="zhti3g7">
            {/* QR Code Configuration */}
            <div className="bg-gray-50 rounded-lg p-6" data-oid="usvd..b">
                <h4 className="text-lg font-semibold text-gray-900 mb-4" data-oid="m9g7m4s">
                    QR Code Configuration
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="fyi8h:l">
                    {/* QR Code Type */}
                    <div data-oid="5xdn70q">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-3"
                            data-oid="sn3i.gz"
                        >
                            QR Code Type
                        </label>
                        <div className="space-y-2" data-oid="orj53a2">
                            {qrCodeOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className="flex items-start space-x-3 cursor-pointer"
                                    data-oid="re5n22."
                                >
                                    <input
                                        type="radio"
                                        name="qrType"
                                        value={option.id}
                                        checked={qrCodeType === option.id}
                                        onChange={(e) => setQrCodeType(e.target.value as any)}
                                        className="mt-1 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                        data-oid="qf5p3-_"
                                    />

                                    <div data-oid="rgapeip">
                                        <div
                                            className="text-sm font-medium text-gray-900"
                                            data-oid="siy66rj"
                                        >
                                            {option.label}
                                        </div>
                                        <div className="text-xs text-gray-500" data-oid="3u72-kr">
                                            {option.description}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {qrCodeType === 'custom' && (
                            <div className="mt-3" data-oid="-cxtfi8">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="ur-g.zr"
                                >
                                    Custom Data
                                </label>
                                <textarea
                                    value={customData}
                                    onChange={(e) => setCustomData(e.target.value)}
                                    placeholder="Enter custom data for QR code..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="_x84ur8"
                                />
                            </div>
                        )}
                    </div>

                    {/* QR Code Settings */}
                    <div data-oid="kmnzs86">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-3"
                            data-oid="n1wpnu0"
                        >
                            QR Code Settings
                        </label>

                        <div className="space-y-4" data-oid="t.hr-bf">
                            {/* Size Selection */}
                            <div data-oid="06ex-5v">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    data-oid="mebab:y"
                                >
                                    Size
                                </label>
                                <select
                                    value={qrSize}
                                    onChange={(e) => setQrSize(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    data-oid="k2grta4"
                                >
                                    {sizeOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                            data-oid=".r17o49"
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Include Message */}
                            <div data-oid="lcsn5y7">
                                <label
                                    className="flex items-center space-x-2 cursor-pointer"
                                    data-oid="o6r-:m8"
                                >
                                    <input
                                        type="checkbox"
                                        checked={includeMessage}
                                        onChange={(e) => setIncludeMessage(e.target.checked)}
                                        className="text-[#1F1F6F] focus:ring-[#1F1F6F] rounded"
                                        data-oid="9m61fk:"
                                    />

                                    <span
                                        className="text-sm font-medium text-gray-700"
                                        data-oid="ystq3me"
                                    >
                                        Include custom message
                                    </span>
                                </label>
                                {includeMessage && doctor.referralSystem.customMessage && (
                                    <p className="text-xs text-gray-500 mt-1" data-oid="lwi97ov">
                                        {'"'}{doctor.referralSystem.customMessage}{"'"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="jqk9_u3">
                {/* Main QR Code */}
                <div className="bg-white rounded-lg border border-gray-200 p-6" data-oid="oxwnb3p">
                    <h4
                        className="text-lg font-semibold text-gray-900 mb-4 text-center"
                        data-oid="n3benai"
                    >
                        Your Referral QR Code
                    </h4>
                    <QRCodeGenerator
                        data={getQRDataWithMessage()}
                        size={qrSize}
                        backgroundColor="#FFFFFF"
                        foregroundColor="#1F1F6F"
                        className="w-full"
                        data-oid="hmqt22y"
                    />
                </div>

                {/* Business Card QR Code */}
                <div className="bg-white rounded-lg border border-gray-200 p-6" data-oid="byji1dr">
                    <h4
                        className="text-lg font-semibold text-gray-900 mb-4 text-center"
                        data-oid="pt902ma"
                    >
                        Digital Business Card
                    </h4>
                    <QRCodeGenerator
                        data={generateBusinessCard()}
                        size={qrSize}
                        backgroundColor="#FFFFFF"
                        foregroundColor="#1F1F6F"
                        className="w-full"
                        data-oid="kdyxnnn"
                    />

                    <p className="text-xs text-gray-500 text-center mt-2" data-oid="low7b_7">
                        Scan to save contact information
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg p-6" data-oid="o6xnc15">
                <h4 className="text-lg font-semibold text-blue-900 mb-4" data-oid="0yo4u1n">
                    Quick Actions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="_7qrwza">
                    <button
                        onClick={() => {
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                                printWindow.document.write(`
                                    <html>
                                        <head>
                                            <title>QR Code - ${doctor.name}</title>
                                            <style>
                                                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                                                .qr-container { margin: 20px 0; }
                                                .doctor-info { margin-bottom: 20px; }
                                                .instructions { margin-top: 20px; font-size: 12px; color: #666; }
                                            </style>
                                        </head>
                                        <body>
                                            <div class="doctor-info">
                                                <h2>${doctor.name}</h2>
                                                <p>${doctor.specialization}</p>
                                                <p>${doctor.clinicHospital}</p>
                                                <p>Referral Code: ${doctor.referralSystem.referralCode}</p>
                                            </div>
                                            <div class="qr-container">
                                                <canvas id="printQR"></canvas>
                                            </div>
                                            <div class="instructions">
                                                <p>Scan this QR code to access my referral link and get your medicines delivered.</p>
                                                <p>${doctor.referralSystem.customMessage || ''}</p>
                                            </div>
                                        </body>
                                    </html>
                                `);
                                printWindow.document.close();
                                printWindow.print();
                            }
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        data-oid="qriauku"
                    >
                        <span data-oid="p17ith:">🖨️</span>
                        <span data-oid="g-q2v7w">Print Poster</span>
                    </button>

                    <button
                        onClick={() => {
                            const shareData = {
                                title: `${doctor.name} - Medical Referral`,
                                text: `Get your medicines delivered with ${doctor.name}'s trusted recommendation. ${doctor.referralSystem.customMessage || ''}`,
                                url: doctor.referralSystem.referralLink,
                            };

                            if (navigator.share) {
                                navigator.share(shareData);
                            } else {
                                navigator.clipboard.writeText(
                                    `${shareData.text}\n${shareData.url}`,
                                );
                                alert('Referral information copied to clipboard!');
                            }
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        data-oid="bwm_o6r"
                    >
                        <span data-oid="z1k9pjw">📱</span>
                        <span data-oid="hgkv3pk">Share Referral</span>
                    </button>

                    <button
                        onClick={() => {
                            const emailSubject = encodeURIComponent(
                                `Medical Referral from ${doctor.name}`,
                            );
                            const emailBody = encodeURIComponent(
                                `
Hello,

I recommend using CURA for your medicine delivery needs. You can use my referral code for trusted service:

Referral Code: ${doctor.referralSystem.referralCode}
Referral Link: ${doctor.referralSystem.referralLink}

${doctor.referralSystem.customMessage || ''}

Best regards,
${doctor.name}
${doctor.specialization}
${doctor.clinicHospital}
                            `.trim(),
                            );

                            window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        data-oid="d:.p55t"
                    >
                        <span data-oid="44e27js">📧</span>
                        <span data-oid="ritmmf.">Email Template</span>
                    </button>
                </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-gray-50 rounded-lg p-6" data-oid="q9fjv1x">
                <h4 className="text-lg font-semibold text-gray-900 mb-4" data-oid="1asb.w1">
                    📋 How to Use Your QR Codes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="jw-o7h8">
                    <div data-oid="i3v3e:w">
                        <h5 className="font-medium text-gray-900 mb-2" data-oid="w3ugnne">
                            Referral QR Code
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1" data-oid=":i3w:o0">
                            <li data-oid="khw5uyp">• Display in your clinic waiting area</li>
                            <li data-oid="6csgu88">• Include in prescription notes</li>
                            <li data-oid="pyl8-vr">• Share on social media</li>
                            <li data-oid="sm6w5xx">• Add to email signatures</li>
                        </ul>
                    </div>
                    <div data-oid="ule-9ns">
                        <h5 className="font-medium text-gray-900 mb-2" data-oid="-..maaj">
                            Business Card QR Code
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1" data-oid="nj-lb_-">
                            <li data-oid="hv5d3ga">• Add to business cards</li>
                            <li data-oid="88qjzkd">• Include in conference materials</li>
                            <li data-oid="rhzafb:">• Share at medical events</li>
                            <li data-oid=":fu35ro">• Use for networking</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
