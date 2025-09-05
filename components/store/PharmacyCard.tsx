'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Pharmacy } from '@/lib/data/pharmacies';
import { City } from '@/lib/data/cities';

interface PharmacyCardProps {
    pharmacy: Pharmacy;
    isSelected: boolean;
    onSelect: () => void;
    showDistance?: boolean;
    selectedCity?: City | null;
}

export function PharmacyCard({
    pharmacy,
    isSelected,
    onSelect,
    showDistance = false,
    selectedCity,
}: PharmacyCardProps) {
    const { t } = useTranslation();
    const [showDetails, setShowDetails] = useState(false);

    // Mock distance calculation (in a real app, this would use actual coordinates)
    const calculateDistance = () => {
        if (!selectedCity || !showDistance) return null;
        if (pharmacy.cityId === selectedCity.id) return Math.floor(Math.random() * 10) + 1;
        return Math.floor(Math.random() * 50) + 10;
    };

    const distance = calculateDistance();

    const isOpen = () => {
        if (pharmacy.workingHours.is24Hours) return true;
        const now = new Date();
        const currentHour = now.getHours();
        const openHour = parseInt(pharmacy.workingHours.open.split(':')[0]);
        const closeHour = parseInt(pharmacy.workingHours.close.split(':')[0]);
        return currentHour >= openHour && currentHour < closeHour;
    };

    const formatWorkingHours = () => {
        if (pharmacy.workingHours.is24Hours) {
            return t('subscription.storeLocator.pharmacy.open24Hours');
        }
        return `${pharmacy.workingHours.open} - ${pharmacy.workingHours.close}`;
    };

    const getSpecialtyIcon = (specialty: string) => {
        const icons: { [key: string]: string } = {
            prescription: '💊',
            otc: '🏥',
            supplements: '🌿',
            skincare: '✨',
            baby: '👶',
            medical: '🩺',
            vitamins: '💪',
            cosmetics: '💄',
        };
        return icons[specialty] || '🏪';
    };

    const getFeatureIcon = (feature: string) => {
        const icons: { [key: string]: string } = {
            home_delivery: '🚚',
            consultation: '👨‍⚕️',
            prescription_reading: '📋',
            emergency: '🚨',
            '24_hours': '🕐',
            baby_care: '👶',
            nutrition_advice: '🥗',
            beauty_consultation: '💅',
        };
        return icons[feature] || '✅';
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
                isSelected
                    ? 'border-cura-primary ring-2 ring-cura-primary/20'
                    : 'border-gray-200 hover:border-gray-300'
            }`}
            data-oid="er:06ky"
        >
            <div className="p-6" data-oid="rhsnjm9">
                {/* Header */}
                <div className="flex items-start justify-between mb-4" data-oid="j_2kxlh">
                    <div className="flex-1" data-oid="blf7dcu">
                        <div className="flex items-center space-x-3 mb-2" data-oid="khp8j87">
                            <h3 className="text-lg font-semibold text-gray-900" data-oid="-k3z9:1">
                                {pharmacy.name}
                            </h3>
                            <div className="flex items-center space-x-1" data-oid="3spyx-b">
                                <span className="text-yellow-400" data-oid="cw-j7q7">
                                    ⭐
                                </span>
                                <span
                                    className="text-sm font-medium text-gray-700"
                                    data-oid="hx_rfbv"
                                >
                                    {pharmacy.rating}
                                </span>
                                <span className="text-sm text-gray-500" data-oid="gpcdrov">
                                    ({pharmacy.reviewCount}{' '}
                                    {t('subscription.storeLocator.pharmacy.reviews')})
                                </span>
                            </div>
                        </div>
                        <div
                            className="flex items-center space-x-4 text-sm text-gray-600"
                            data-oid="6xahbst"
                        >
                            <span className="flex items-center" data-oid="tdviae4">
                                📍 {pharmacy.cityName}
                            </span>
                            {distance && (
                                <span className="flex items-center" data-oid="w30r8.j">
                                    📏 {distance} km {t('subscription.storeLocator.pharmacy.away')}
                                </span>
                            )}
                            <span
                                className={`flex items-center ${isOpen() ? 'text-green-600' : 'text-red-600'}`}
                                data-oid="wwq2hxf"
                            >
                                🕐{' '}
                                {isOpen()
                                    ? t('subscription.storeLocator.pharmacy.open')
                                    : t('subscription.storeLocator.pharmacy.closed')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onSelect}
                        className="text-cura-primary hover:text-cura-primary/80 transition-colors"
                        data-oid="foj5_c-"
                    >
                        {isSelected ? '▼' : '▶'}
                    </button>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4" data-oid="5sba084">
                    <div className="text-center p-3 bg-gray-50 rounded-lg" data-oid="fb_oznc">
                        <div className="text-sm font-medium text-gray-900" data-oid="5wdv9pv">
                            {t('subscription.storeLocator.pharmacy.deliveryTime')}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="y5fiizf">
                            {pharmacy.deliveryTime}
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg" data-oid="vadbpk4">
                        <div className="text-sm font-medium text-gray-900" data-oid="fqjn6ir">
                            {t('subscription.storeLocator.pharmacy.deliveryFee')}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="2nk82q9">
                            {pharmacy.deliveryFee} {t('common.currency')}
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg" data-oid="4r39wol">
                        <div className="text-sm font-medium text-gray-900" data-oid="r1ap1_:">
                            {t('subscription.storeLocator.pharmacy.minOrder')}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="e4u9i2q">
                            {pharmacy.minOrderAmount} {t('common.currency')}
                        </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg" data-oid="lf4qzjn">
                        <div className="text-sm font-medium text-gray-900" data-oid="npsmqxc">
                            {t('subscription.storeLocator.pharmacy.workingHours')}
                        </div>
                        <div className="text-sm text-gray-600" data-oid="wth-by5">
                            {formatWorkingHours()}
                        </div>
                    </div>
                </div>

                {/* Specialties */}
                <div className="mb-4" data-oid="rpvko80">
                    <div className="text-sm font-medium text-gray-700 mb-2" data-oid="cfp63k3">
                        {t('subscription.storeLocator.pharmacy.specialties')}
                    </div>
                    <div className="flex flex-wrap gap-2" data-oid="as4-pxg">
                        {pharmacy.specialties.slice(0, 4).map((specialty) => (
                            <span
                                key={specialty}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cura-primary/10 text-cura-primary"
                                data-oid="mih24_x"
                            >
                                {getSpecialtyIcon(specialty)}{' '}
                                {t(`subscription.storeLocator.filters.specialties.${specialty}`)}
                            </span>
                        ))}
                        {pharmacy.specialties.length > 4 && (
                            <span
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                                data-oid=".0oqfum"
                            >
                                +{pharmacy.specialties.length - 4}{' '}
                                {t('subscription.storeLocator.pharmacy.more')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3" data-oid="p6ggwdd">
                    <a
                        href={`tel:${pharmacy.phone}`}
                        className="flex items-center px-4 py-2 bg-cura-primary text-white rounded-lg hover:bg-cura-primary/90 transition-colors text-sm font-medium"
                        data-oid="sbjbkm."
                    >
                        📞 {t('subscription.storeLocator.pharmacy.call')}
                    </a>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        data-oid="l4ntb7w"
                    >
                        ℹ️{' '}
                        {showDetails
                            ? t('subscription.storeLocator.pharmacy.hideDetails')
                            : t('subscription.storeLocator.pharmacy.showDetails')}
                    </button>
                    <button
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        data-oid="3t:wflf"
                    >
                        🗺️ {t('subscription.storeLocator.pharmacy.directions')}
                    </button>
                    {pharmacy.features.includes('home_delivery') && (
                        <button
                            className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                            data-oid="3qqlgf5"
                        >
                            🚚 {t('subscription.storeLocator.pharmacy.orderDelivery')}
                        </button>
                    )}
                </div>

                {/* Detailed Information */}
                {showDetails && (
                    <div
                        className="mt-6 pt-6 border-t border-gray-200 space-y-4"
                        data-oid="xguwhd8"
                    >
                        <div data-oid="i2y4npx">
                            <h4
                                className="text-sm font-medium text-gray-900 mb-2"
                                data-oid="63p3cgg"
                            >
                                {t('subscription.storeLocator.pharmacy.contactInfo')}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600" data-oid="dwwv6_j">
                                <div data-oid="vuqadhp">📍 {pharmacy.address}</div>
                                <div data-oid="kmr7tku">📞 {pharmacy.phone}</div>
                                <div data-oid="sv4as3b">📧 {pharmacy.email}</div>
                            </div>
                        </div>

                        <div data-oid="mvwrb.w">
                            <h4
                                className="text-sm font-medium text-gray-900 mb-2"
                                data-oid="4bw8i4b"
                            >
                                {t('subscription.storeLocator.pharmacy.features')}
                            </h4>
                            <div className="flex flex-wrap gap-2" data-oid="srd8yxg">
                                {pharmacy.features.map((feature) => (
                                    <span
                                        key={feature}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                                        data-oid="ppf32z_"
                                    >
                                        {getFeatureIcon(feature)}{' '}
                                        {t(`subscription.storeLocator.filters.features.${feature}`)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div data-oid="tbozpqn">
                            <h4
                                className="text-sm font-medium text-gray-900 mb-2"
                                data-oid="bd0ykux"
                            >
                                {t('subscription.storeLocator.pharmacy.allSpecialties')}
                            </h4>
                            <div className="flex flex-wrap gap-2" data-oid="zn.n.y8">
                                {pharmacy.specialties.map((specialty) => (
                                    <span
                                        key={specialty}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                                        data-oid="tla0joh"
                                    >
                                        {getSpecialtyIcon(specialty)}{' '}
                                        {t(
                                            `subscription.storeLocator.filters.specialties.${specialty}`,
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
