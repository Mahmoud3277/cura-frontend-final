'use client';

import { useState } from 'react';
import { useCity } from '@/lib/contexts/CityContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { CitySelector } from './CitySelector';
import { City } from '@/lib/data/cities';

interface CitySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    showOnboarding?: boolean;
}

export function CitySelectionModal({
    isOpen,
    onClose,
    title,
    description,
    showOnboarding = false,
}: CitySelectionModalProps) {
    const { selectedCity } = useCity();
    const { t } = useTranslation();
    const [tempSelectedCity, setTempSelectedCity] = useState<City | null>(selectedCity);

    if (!isOpen) return null;

    const handleCitySelect = (city: City) => {
        setTempSelectedCity(city);
    };

    const handleConfirm = () => {
        if (tempSelectedCity) {
            onClose();
        }
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            data-oid="7mu_8k8"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
                data-oid="3v3o.u8"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200" data-oid="hfs6qc4">
                    <div className="flex justify-between items-start" data-oid="mbqu9l.">
                        <div data-oid="s.paw22">
                            <h2
                                className="text-2xl font-bold text-gray-900 mb-2"
                                data-oid="o-2ztae"
                            >
                                {title || t('city.selectYourCity')}
                            </h2>
                            <p className="text-gray-600" data-oid="3xvc8u4">
                                {description || t('city.citySelectionDescription')}
                            </p>
                        </div>
                        {!showOnboarding && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                data-oid="xf5zvdz"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="a634lgr"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                        data-oid="q2x_1px"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-96" data-oid="8n_th5-">
                    <CitySelector
                        variant="modal"
                        onSelect={handleCitySelect}
                        showStats={true}
                        data-oid=":y6t.cq"
                    />
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50" data-oid="y1yfu7j">
                    <div className="flex space-x-3" data-oid="kwovakt">
                        {showOnboarding ? (
                            <>
                                <button
                                    onClick={handleSkip}
                                    className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                                    data-oid="0cuw7my"
                                >
                                    {t('city.skipForNow')}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!tempSelectedCity}
                                    className="flex-1 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="n0s8ia-"
                                >
                                    {t('city.continue')}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                                    data-oid="fxgyj7j"
                                >
                                    {t('city.cancel')}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!tempSelectedCity}
                                    className="flex-1 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="hbnbtg9"
                                >
                                    {t('city.confirm')}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Onboarding Benefits */}
                {showOnboarding && (
                    <div className="p-6 bg-blue-50 border-t border-blue-100" data-oid=":6y8jmy">
                        <h3 className="font-semibold text-blue-900 mb-3" data-oid="4gwzgqw">
                            {t('city.whySelectCity')}
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800" data-oid="4186m81">
                            <li className="flex items-center" data-oid="kuqcz_v">
                                <svg
                                    className="w-4 h-4 mr-2 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="t0qlzkm"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                        data-oid="s8hzhwd"
                                    />
                                </svg>
                                {t('city.findNearbyPharmacies')}
                            </li>
                            <li className="flex items-center" data-oid=":4v8irc">
                                <svg
                                    className="w-4 h-4 mr-2 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="fhenjty"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                        data-oid="od2-93v"
                                    />
                                </svg>
                                {t('city.fasterDelivery')}
                            </li>
                            <li className="flex items-center" data-oid="24fmo13">
                                <svg
                                    className="w-4 h-4 mr-2 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="r_d4eag"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                        data-oid="d_lb2hf"
                                    />
                                </svg>
                                {t('city.localDoctors')}
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
