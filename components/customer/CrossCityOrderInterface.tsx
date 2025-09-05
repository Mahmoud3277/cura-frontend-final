'use client';

import { useState, useEffect } from 'react';
import { useCity } from '@/lib/contexts/CityContext';
import { crossCityOrderingService } from '@/lib/services/crossCityOrderingService';
import { pharmacies, getPharmaciesByCity } from '@/lib/data/pharmacies';
import { cities } from '@/lib/data/cities';

interface CrossCityPharmacy {
    pharmacyId: string;
    pharmacyName: string;
    pharmacyCity: string;
    deliveryFee: number;
    estimatedTime: string;
    minOrderAmount: number;
    rating: number;
    specialties: string[];
}

interface CrossCityOrderInterfaceProps {
    onPharmacySelect?: (pharmacyId: string) => void;
    orderType?: 'regular' | 'prescription' | 'emergency';
    className?: string;
}

export function CrossCityOrderInterface({
    onPharmacySelect,
    orderType = 'regular',
    className = '',
}: CrossCityOrderInterfaceProps) {
    const { selectedCity } = useCity();
    const [availablePharmacies, setAvailablePharmacies] = useState<CrossCityPharmacy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCity2, setSelectedCity2] = useState<string>('');
    const [crossCityEnabled, setCrossCityEnabled] = useState(false);

    useEffect(() => {
        loadCrossCityData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity, selectedCity2, orderType]);

    const loadCrossCityData = async () => {
        setIsLoading(true);

        // Check if cross-city ordering is enabled
        const globalSettings = crossCityOrderingService.getGlobalCrossCitySettings();
        setCrossCityEnabled(globalSettings.globalCrossCityEnabled);

        if (!globalSettings.globalCrossCityEnabled || !selectedCity) {
            setAvailablePharmacies([]);
            setIsLoading(false);
            return;
        }

        // Get available cross-city pharmacies
        const crossCityPharmacies = crossCityOrderingService.getAvailableCrossCityPharmacies(
            selectedCity.id,
        );

        // Map to our interface format
        const mappedPharmacies: CrossCityPharmacy[] = crossCityPharmacies
            .map((item) => {
                const pharmacy = pharmacies.find((p) => p.id === item.pharmacyId);
                if (!pharmacy) return null;

                // Check if pharmacy can deliver to customer's city
                const canDeliver = crossCityOrderingService.canDeliverCrossCity(
                    pharmacy.id,
                    pharmacy.cityId,
                    selectedCity.id,
                    orderType,
                );

                if (!canDeliver) return null;

                return {
                    pharmacyId: pharmacy.id,
                    pharmacyName: pharmacy.name,
                    pharmacyCity: pharmacy.cityName,
                    deliveryFee: item.deliveryFee,
                    estimatedTime: item.estimatedTime,
                    minOrderAmount: item.minOrderAmount,
                    rating: pharmacy.rating,
                    specialties: pharmacy.specialties,
                };
            })
            .filter(Boolean) as CrossCityPharmacy[];

        // Filter by selected city if specified
        let filteredPharmacies = mappedPharmacies;
        if (selectedCity2) {
            const cityPharmacies = getPharmaciesByCity(selectedCity2);
            filteredPharmacies = mappedPharmacies.filter((cp) =>
                cityPharmacies.some((p) => p.id === cp.pharmacyId),
            );
        }

        setAvailablePharmacies(filteredPharmacies);
        setIsLoading(false);
    };

    const getOrderTypeIcon = (type: string) => {
        switch (type) {
            case 'prescription':
                return '💊';
            case 'emergency':
                return '🚨';
            default:
                return '🛒';
        }
    };

    const getSpecialtyIcon = (specialty: string) => {
        switch (specialty) {
            case 'prescription':
                return '💊';
            case 'skincare':
                return '🧴';
            case 'supplements':
                return '💪';
            case 'vitamins':
                return '🍊';
            case 'baby':
                return '👶';
            case 'medical':
                return '🏥';
            default:
                return '💊';
        }
    };

    if (!crossCityEnabled) {
        return (
            <div
                className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className}`}
                data-oid="j15_o5j"
            >
                <div className="flex items-center" data-oid=":rwnjhb">
                    <div className="text-2xl mr-3" data-oid="1g_ey.l">
                        🚫
                    </div>
                    <div data-oid="15lon04">
                        <h3 className="font-medium text-yellow-800" data-oid="6je07.7">
                            Cross-City Orders Disabled
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1" data-oid="kvd7jei">
                            Cross-city ordering is currently not available. Please select a pharmacy
                            in your city.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedCity) {
        return (
            <div
                className={`bg-blue-50 border border-blue-200 rounded-lg p-6 ${className}`}
                data-oid="72oiv5a"
            >
                <div className="flex items-center" data-oid=".njfp40">
                    <div className="text-2xl mr-3" data-oid="_ju3kem">
                        📍
                    </div>
                    <div data-oid="qd-grvx">
                        <h3 className="font-medium text-blue-800" data-oid="4pkppq_">
                            Select Your City
                        </h3>
                        <p className="text-sm text-blue-700 mt-1" data-oid="9d.a-oh">
                            Please select your city to see available cross-city pharmacies.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`} data-oid="popusee">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-lg p-6 text-white"
                data-oid="gy4.7c5"
            >
                <div className="flex items-center justify-between" data-oid="6g5-g2z">
                    <div data-oid="c2.0n0g">
                        <h2 className="text-xl font-bold" data-oid="9q.:f61">
                            Cross-City Pharmacies
                        </h2>
                        <p className="text-blue-100 mt-1" data-oid="x68_e_:">
                            Order from pharmacies in other cities • Delivering to{' '}
                            {selectedCity.nameEn}
                        </p>
                    </div>
                    <div className="text-3xl" data-oid="ejql.y_">
                        {getOrderTypeIcon(orderType)}
                    </div>
                </div>
            </div>

            {/* City Filter */}
            <div className="bg-white border border-gray-200 rounded-lg p-4" data-oid="hxcr4yc">
                <label className="block text-sm font-medium text-gray-700 mb-2" data-oid="qbliy8x">
                    Filter by Pharmacy City (Optional)
                </label>
                <select
                    value={selectedCity2}
                    onChange={(e) => setSelectedCity2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                    data-oid="p1lbkl2"
                >
                    <option value="" data-oid="6g5p9c8">
                        All Cities
                    </option>
                    {cities
                        .filter((city) => city.id !== selectedCity.id)
                        .map((city) => (
                            <option key={city.id} value={city.id} data-oid="u41k7_y">
                                {city.nameEn} ({city.governorateName})
                            </option>
                        ))}
                </select>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-4" data-oid="s7_o48p">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 animate-pulse rounded-lg h-32"
                            data-oid="0j7i.nh"
                        ></div>
                    ))}
                </div>
            )}

            {/* Available Pharmacies */}
            {!isLoading && availablePharmacies.length > 0 && (
                <div className="space-y-4" data-oid="3odrzc8">
                    <h3 className="text-lg font-medium text-gray-900" data-oid="pnxf4wi">
                        Available Pharmacies ({availablePharmacies.length})
                    </h3>

                    {availablePharmacies.map((pharmacy) => (
                        <div
                            key={pharmacy.pharmacyId}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            data-oid="weufagr"
                        >
                            <div className="flex items-start justify-between" data-oid="r3wxvf8">
                                <div className="flex-1" data-oid="-c1o0_c">
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="4b6emz0"
                                    >
                                        <h4
                                            className="text-lg font-medium text-gray-900"
                                            data-oid="b3ikns2"
                                        >
                                            {pharmacy.pharmacyName}
                                        </h4>
                                        <span
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            data-oid="rrngh2g"
                                        >
                                            {pharmacy.pharmacyCity}
                                        </span>
                                        <div className="flex items-center" data-oid="yh8x8jd">
                                            <span
                                                className="text-yellow-400 mr-1"
                                                data-oid="j0ne:-s"
                                            >
                                                ⭐
                                            </span>
                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="efygao."
                                            >
                                                {pharmacy.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                                        data-oid="-dc0j.n"
                                    >
                                        <div data-oid="f3cq8qf">
                                            <p className="text-sm text-gray-600" data-oid="5w0a25x">
                                                Delivery Fee
                                            </p>
                                            <p
                                                className="font-medium text-gray-900"
                                                data-oid="ptibzo-"
                                            >
                                                EGP {pharmacy.deliveryFee}
                                            </p>
                                        </div>
                                        <div data-oid="m3pygst">
                                            <p className="text-sm text-gray-600" data-oid="-vc5i5e">
                                                Estimated Time
                                            </p>
                                            <p
                                                className="font-medium text-gray-900"
                                                data-oid="ihqp_0w"
                                            >
                                                {pharmacy.estimatedTime}
                                            </p>
                                        </div>
                                        <div data-oid="ycd20b7">
                                            <p className="text-sm text-gray-600" data-oid="w4l-3r6">
                                                Minimum Order
                                            </p>
                                            <p
                                                className="font-medium text-gray-900"
                                                data-oid="v_m9ckg"
                                            >
                                                EGP {pharmacy.minOrderAmount}
                                            </p>
                                        </div>
                                    </div>

                                    <div data-oid="4c4doil">
                                        <p
                                            className="text-sm text-gray-600 mb-2"
                                            data-oid="18oltns"
                                        >
                                            Specialties
                                        </p>
                                        <div className="flex flex-wrap gap-2" data-oid="nq6:4ly">
                                            {pharmacy.specialties.map((specialty) => (
                                                <span
                                                    key={specialty}
                                                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                                    data-oid="p5n-xxq"
                                                >
                                                    <span className="mr-1" data-oid="8.6.7it">
                                                        {getSpecialtyIcon(specialty)}
                                                    </span>
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-6" data-oid="tycfgb6">
                                    <button
                                        onClick={() => onPharmacySelect?.(pharmacy.pharmacyId)}
                                        className="px-6 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                        data-oid="7v6d57y"
                                    >
                                        Select Pharmacy
                                    </button>
                                </div>
                            </div>

                            {/* Cross-City Notice */}
                            <div
                                className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                                data-oid="5mt.x4p"
                            >
                                <div className="flex items-start" data-oid="b1b2-v0">
                                    <div className="text-yellow-600 mr-2" data-oid="dwyf_lr">
                                        ℹ️
                                    </div>
                                    <div className="text-sm text-yellow-800" data-oid="8o13r:7">
                                        <p className="font-medium" data-oid="y0nr8:z">
                                            Cross-City Delivery Notice:
                                        </p>
                                        <p data-oid=":hrvt_7">
                                            This pharmacy is located in {pharmacy.pharmacyCity}.
                                            Additional delivery time and fees apply for cross-city
                                            orders.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Pharmacies Available */}
            {!isLoading && availablePharmacies.length === 0 && (
                <div
                    className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"
                    data-oid=":m_3is:"
                >
                    <div className="text-4xl mb-4" data-oid="c.c0n5k">
                        🏥
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="n1ttdy_">
                        No Cross-City Pharmacies Available
                    </h3>
                    <p className="text-gray-600 mb-4" data-oid="pzae693">
                        {selectedCity2
                            ? `No pharmacies in ${cities.find((c) => c.id === selectedCity2)?.nameEn} can deliver to your city.`
                            : `No pharmacies from other cities can deliver to ${selectedCity.nameEn} at the moment.`}
                    </p>
                    <button
                        onClick={() => setSelectedCity2('')}
                        className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                        data-oid="z-f54ek"
                    >
                        Clear City Filter
                    </button>
                </div>
            )}
        </div>
    );
}
