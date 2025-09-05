'use client';
import { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface Pharmacy {
    id: string;
    name: string;
    address: string;
    phone: string;
    rating: number;
    reviewCount: number;
    distance: string;
    deliveryTime: string;
    deliveryFee: number;
    isOpen: boolean;
    workingHours: string;
    specialties: string[];
    features: string[];
}

interface PharmacyOptionSelectorProps {
    pharmacies: Pharmacy[];
    selectedPharmacy?: string;
    onPharmacySelect: (pharmacyId: string) => void;
    showDetails?: boolean;
}

export function PharmacyOptionSelector({
    pharmacies,
    selectedPharmacy,
    onPharmacySelect,
    showDetails = false,
}: PharmacyOptionSelectorProps) {
    const [expandedPharmacy, setExpandedPharmacy] = useState<string | null>(null);
    const { t } = useTranslation();

    const togglePharmacyDetails = (pharmacyId: string) => {
        setExpandedPharmacy(expandedPharmacy === pharmacyId ? null : pharmacyId);
    };

    return (
        <div className="space-y-3" data-oid="bfg1z82">
            {pharmacies.map((pharmacy) => (
                <div
                    key={pharmacy.id}
                    className={`border rounded-lg transition-all duration-200 ${
                        selectedPharmacy === pharmacy.id
                            ? 'border-[#1F1F6F] bg-[#1F1F6F]/5 ring-2 ring-[#1F1F6F]/20'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                    data-oid="b3-1ajx"
                >
                    {/* Main Pharmacy Info */}
                    <div
                        className="p-4 cursor-pointer"
                        onClick={() => onPharmacySelect(pharmacy.id)}
                        data-oid="gau3e36"
                    >
                        <div className="flex items-start justify-between" data-oid="55mr5po">
                            <div className="flex items-start space-x-3" data-oid="rd5idjf">
                                <input
                                    type="radio"
                                    checked={selectedPharmacy === pharmacy.id}
                                    onChange={() => onPharmacySelect(pharmacy.id)}
                                    className="w-4 h-4 text-[#1F1F6F] focus:ring-[#1F1F6F] mt-1"
                                    data-oid="e8gz2bu"
                                />

                                <div className="flex-1" data-oid="vv3:fjv">
                                    <div className="flex items-center space-x-2" data-oid="v6s:8th">
                                        <h4
                                            className="font-semibold text-gray-900"
                                            data-oid="ht_x04."
                                        >
                                            {pharmacy.name}
                                        </h4>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                pharmacy.isOpen
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                            data-oid="_4urn9w"
                                        >
                                            {pharmacy.isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center space-x-4 mt-1 text-sm text-gray-600"
                                        data-oid="7of76aq"
                                    >
                                        <span className="flex items-center" data-oid="f.8j98w">
                                            ⭐ {pharmacy.rating} ({pharmacy.reviewCount} reviews)
                                        </span>
                                        <span className="flex items-center" data-oid="9_4l3w0">
                                            📍 {pharmacy.distance}
                                        </span>
                                        <span className="flex items-center" data-oid="0fd4:wk">
                                            🚚 {pharmacy.deliveryTime}
                                        </span>
                                    </div>

                                    {pharmacy.specialties.length > 0 && (
                                        <div
                                            className="flex items-center space-x-2 mt-2"
                                            data-oid="jd-uqrv"
                                        >
                                            {pharmacy.specialties
                                                .slice(0, 3)
                                                .map((specialty, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                        data-oid="r7bb23l"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            {pharmacy.specialties.length > 3 && (
                                                <span
                                                    className="text-xs text-gray-500"
                                                    data-oid="kvmkh7i"
                                                >
                                                    +{pharmacy.specialties.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-right" data-oid="56k-22w">
                                <p className="text-sm text-gray-600" data-oid="vh.380e">
                                    Delivery Fee
                                </p>
                                <p className="font-semibold text-gray-900" data-oid=".dogdy_">
                                    EGP {pharmacy.deliveryFee.toFixed(2)}
                                </p>
                                {showDetails && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePharmacyDetails(pharmacy.id);
                                        }}
                                        className="text-sm text-[#1F1F6F] hover:text-[#14274E] mt-1"
                                        data-oid="kc9pq82"
                                    >
                                        {expandedPharmacy === pharmacy.id
                                            ? 'Hide Details'
                                            : 'View Details'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expanded Details */}
                    {showDetails && expandedPharmacy === pharmacy.id && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50" data-oid="fo29m_o">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="_fcc0.l"
                            >
                                {/* Contact Information */}
                                <div data-oid="x0sl-ht">
                                    <h5
                                        className="font-medium text-gray-900 mb-2"
                                        data-oid="lkd1dpn"
                                    >
                                        Contact Information
                                    </h5>
                                    <div
                                        className="space-y-1 text-sm text-gray-600"
                                        data-oid="j-2tusx"
                                    >
                                        <p data-oid="11mezv7">📍 {pharmacy.address}</p>
                                        <p data-oid="4jqa:pt">📞 {pharmacy.phone}</p>
                                        <p data-oid="z.k:i9a">🕒 {pharmacy.workingHours}</p>
                                    </div>
                                </div>

                                {/* Features & Services */}
                                <div data-oid="nie7ahz">
                                    <h5
                                        className="font-medium text-gray-900 mb-2"
                                        data-oid="wbgpq23"
                                    >
                                        Features & Services
                                    </h5>
                                    <div className="flex flex-wrap gap-1" data-oid=":0jy7y3">
                                        {pharmacy.features.map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                                data-oid="vc.bumu"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div
                                className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200"
                                data-oid="sl70wmd"
                            >
                                <a
                                    href={`tel:${pharmacy.phone}`}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                    data-oid="7oeo4wj"
                                >
                                    <span data-oid="i6:rf0r">📞</span>
                                    <span className="text-sm font-medium" data-oid="ysu-qqc">
                                        Call
                                    </span>
                                </a>
                                <button
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                    data-oid="l7p2:dy"
                                >
                                    <span data-oid="5gr7gd_">🗺️</span>
                                    <span className="text-sm font-medium" data-oid="he1ldx9">
                                        Directions
                                    </span>
                                </button>
                                {selectedPharmacy === pharmacy.id && (
                                    <button
                                        className="flex items-center space-x-2 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors duration-200"
                                        data-oid="xcwy_so"
                                    >
                                        <span data-oid="jyy6tq4">✓</span>
                                        <span className="text-sm font-medium" data-oid="8b5t:.4">
                                            Selected
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {pharmacies.length === 0 && (
                <div className="text-center py-8 text-gray-500" data-oid="9tc27ij">
                    <div
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="-rccdgz"
                    >
                        <span className="text-2xl" data-oid="hjad2m.">
                            🏪
                        </span>
                    </div>
                    <p className="text-lg font-medium" data-oid="ep28k4b">
                        No Pharmacies Available
                    </p>
                    <p className="text-sm" data-oid="ceu557i">
                        No pharmacies have this medicine in stock in your area.
                    </p>
                </div>
            )}
        </div>
    );
}
