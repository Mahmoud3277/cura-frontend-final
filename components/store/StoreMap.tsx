'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Pharmacy } from '@/lib/data/pharmacies';
import { City } from '@/lib/data/cities';

interface StoreMapProps {
    pharmacies: Pharmacy[];
    selectedPharmacy: string | null;
    onPharmacySelect: (pharmacyId: string) => void;
    selectedCity?: City | null;
}

export function StoreMap({
    pharmacies,
    selectedPharmacy,
    onPharmacySelect,
    selectedCity,
}: StoreMapProps) {
    const { t } = useTranslation();
    const [mapCenter, setMapCenter] = useState({ lat: 30.0444, lng: 31.2357 }); // Default to Cairo

    useEffect(() => {
        if (selectedCity) {
            setMapCenter(selectedCity.coordinates);
        } else if (pharmacies.length > 0) {
            // Center on first pharmacy if no city selected
            setMapCenter(pharmacies[0].coordinates);
        }
    }, [selectedCity, pharmacies]);

    const getPharmacyIcon = (pharmacy: Pharmacy) => {
        if (pharmacy.id === selectedPharmacy) return '🏥';
        if (pharmacy.workingHours.is24Hours) return '🟢';

        const now = new Date();
        const currentHour = now.getHours();
        const openHour = parseInt(pharmacy.workingHours.open.split(':')[0]);
        const closeHour = parseInt(pharmacy.workingHours.close.split(':')[0]);
        const isOpen = currentHour >= openHour && currentHour < closeHour;

        return isOpen ? '🟢' : '🔴';
    };

    const getPharmacyStatus = (pharmacy: Pharmacy) => {
        if (pharmacy.workingHours.is24Hours)
            return t('subscription.storeLocator.pharmacy.open24Hours');

        const now = new Date();
        const currentHour = now.getHours();
        const openHour = parseInt(pharmacy.workingHours.open.split(':')[0]);
        const closeHour = parseInt(pharmacy.workingHours.close.split(':')[0]);
        const isOpen = currentHour >= openHour && currentHour < closeHour;

        return isOpen
            ? t('subscription.storeLocator.pharmacy.open')
            : t('subscription.storeLocator.pharmacy.closed');
    };

    return (
        <div className="h-96 bg-gray-100 rounded-lg relative overflow-hidden" data-oid="s.tdgnb">
            {/* Map Placeholder */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center"
                data-oid="t0ny-7k"
            >
                <div className="text-center" data-oid="ni_9c8f">
                    <div className="text-4xl mb-4" data-oid="a:cknry">
                        🗺️
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="8jcwh:l">
                        {t('subscription.storeLocator.map.title')}
                    </h3>
                    <p className="text-gray-600 mb-4" data-oid="3ga1c_b">
                        {t('subscription.storeLocator.map.description')}
                    </p>
                    <div className="text-sm text-gray-500" data-oid="gflpo:2">
                        {t('subscription.storeLocator.map.centerLocation')}:{' '}
                        {selectedCity?.nameEn || t('subscription.storeLocator.map.defaultLocation')}
                    </div>
                </div>
            </div>

            {/* Pharmacy Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none" data-oid="k:aa9an">
                {pharmacies.slice(0, 10).map((pharmacy, index) => (
                    <div
                        key={pharmacy.id}
                        className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            left: `${20 + (index % 5) * 15}%`,
                            top: `${20 + Math.floor(index / 5) * 20}%`,
                        }}
                        onClick={() => onPharmacySelect(pharmacy.id)}
                        data-oid="me.ssv2"
                    >
                        <div
                            className={`relative group ${
                                pharmacy.id === selectedPharmacy ? 'z-10' : 'z-0'
                            }`}
                            data-oid="l1wgpgj"
                        >
                            <div
                                className={`text-2xl transition-transform duration-200 ${
                                    pharmacy.id === selectedPharmacy
                                        ? 'scale-125'
                                        : 'hover:scale-110'
                                }`}
                                data-oid="qkaf3zc"
                            >
                                {getPharmacyIcon(pharmacy)}
                            </div>

                            {/* Tooltip */}
                            <div
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                                data-oid=".2n7ob4"
                            >
                                <div
                                    className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap"
                                    data-oid="7rpgwlu"
                                >
                                    <div className="font-medium" data-oid="woos.vw">
                                        {pharmacy.name}
                                    </div>
                                    <div className="text-gray-300" data-oid="z0vwulq">
                                        {getPharmacyStatus(pharmacy)}
                                    </div>
                                    <div className="text-gray-300" data-oid="3.fsda_">
                                        ⭐ {pharmacy.rating}
                                    </div>
                                    <div
                                        className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"
                                        data-oid="wf3a8qv"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map Legend */}
            <div
                className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs"
                data-oid="waqwy:6"
            >
                <div className="font-medium text-gray-900 mb-2" data-oid="11c::l5">
                    {t('subscription.storeLocator.map.legend')}
                </div>
                <div className="space-y-1" data-oid="763yg99">
                    <div className="flex items-center space-x-2" data-oid="fh53-f_">
                        <span data-oid="9c92qfv">🟢</span>
                        <span className="text-gray-700" data-oid="23t9uii">
                            {t('subscription.storeLocator.map.openPharmacy')}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2" data-oid="4eg9jfq">
                        <span data-oid="xz8359o">🔴</span>
                        <span className="text-gray-700" data-oid="v6-s::t">
                            {t('subscription.storeLocator.map.closedPharmacy')}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2" data-oid="mqbsh:q">
                        <span data-oid="r83:c2w">🏥</span>
                        <span className="text-gray-700" data-oid="i5pm2ug">
                            {t('subscription.storeLocator.map.selectedPharmacy')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Map Controls */}
            <div
                className="absolute top-4 right-4 bg-white rounded-lg shadow-lg"
                data-oid="v:_ejh9"
            >
                <button
                    className="p-2 hover:bg-gray-50 transition-colors border-b border-gray-200"
                    data-oid="7mh.qxp"
                >
                    ➕
                </button>
                <button className="p-2 hover:bg-gray-50 transition-colors" data-oid="jwmjdx3">
                    ➖
                </button>
            </div>

            {/* Selected Pharmacy Info */}
            {selectedPharmacy && (
                <div
                    className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs"
                    data-oid="x3ena5y"
                >
                    {(() => {
                        const pharmacy = pharmacies.find((p) => p.id === selectedPharmacy);
                        if (!pharmacy) return null;

                        return (
                            <div data-oid="mm.o0tc">
                                <h4 className="font-medium text-gray-900 mb-1" data-oid="y6bkh_5">
                                    {pharmacy.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2" data-oid="btop9v9">
                                    {pharmacy.address}
                                </p>
                                <div
                                    className="flex items-center justify-between text-xs"
                                    data-oid="5402hq8"
                                >
                                    <span className="text-gray-500" data-oid="ejx2pyw">
                                        {getPharmacyStatus(pharmacy)}
                                    </span>
                                    <span className="text-yellow-600" data-oid="opu.vqe">
                                        ⭐ {pharmacy.rating}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onPharmacySelect('')}
                                    className="mt-2 text-xs text-cura-primary hover:text-cura-primary/80 transition-colors"
                                    data-oid="c.g.qtx"
                                >
                                    {t('subscription.storeLocator.map.closeInfo')}
                                </button>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
