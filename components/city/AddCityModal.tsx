'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface AddCityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (cityData: {
        nameEn: string;
        nameAr: string;
        governorateId: string;
        coordinates: { lat: number; lng: number };
        estimatedPharmacyCount: number;
        estimatedDoctorCount: number;
    }) => void;
    governorates:any[]
}

export function AddCityModal({ isOpen, onClose, onSubmit, governorates }: AddCityModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        governorateId: '',
        lat: 0,
        lng: 0,
        estimatedPharmacyCount: 0,
        estimatedDoctorCount: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nameEn.trim()) {
            newErrors.nameEn = 'English name is required';
        }
        if (!formData.nameAr.trim()) {
            newErrors.nameAr = 'Arabic name is required';
        }
        if (!formData.governorateId) {
            newErrors.governorateId = 'Governorate is required';
        }
        if (formData.lat === 0 || formData.lng === 0) {
            newErrors.coordinates = 'Valid coordinates are required';
        }
        if (formData.estimatedPharmacyCount < 0) {
            newErrors.estimatedPharmacyCount = 'Pharmacy count must be positive';
        }
        if (formData.estimatedDoctorCount < 0) {
            newErrors.estimatedDoctorCount = 'Doctor count must be positive';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                nameEn: formData.nameEn,
                nameAr: formData.nameAr,
                governorateId: formData.governorateId,
                coordinates: { lat: formData.lat, lng: formData.lng },
                estimatedPharmacyCount: formData.estimatedPharmacyCount,
                estimatedDoctorCount: formData.estimatedDoctorCount,
            });

            // Reset form
            setFormData({
                nameEn: '',
                nameAr: '',
                governorateId: '',
                lat: 0,
                lng: 0,
                estimatedPharmacyCount: 0,
                estimatedDoctorCount: 0,
            });
            setErrors({});
            onClose();
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            data-oid="c0m5-h9"
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
                data-oid="7xx.7xl"
            >
                <div className="flex items-center justify-between mb-6" data-oid="1xggu5w">
                    <h2 className="text-xl font-bold text-gray-900" data-oid="sya2a5b">
                        Add New City
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        data-oid="xhi1mzh"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="lxpikmq"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                                data-oid="8k0e:-o"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" data-oid=":anmmyf">
                    {/* English Name */}
                    <div data-oid="ed6yu54">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            data-oid="8ddgm67"
                        >
                            City Name (English) *
                        </label>
                        <input
                            type="text"
                            value={formData.nameEn}
                            onChange={(e) => handleInputChange('nameEn', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent ${
                                errors.nameEn ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., New Cairo"
                            data-oid="ymn7ce_"
                        />

                        {errors.nameEn && (
                            <p className="text-red-500 text-sm mt-1" data-oid="f20w534">
                                {errors.nameEn}
                            </p>
                        )}
                    </div>

                    {/* Arabic Name */}
                    <div data-oid="55c_mlf">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            data-oid="3lgg7:2"
                        >
                            City Name (Arabic) *
                        </label>
                        <input
                            type="text"
                            value={formData.nameAr}
                            onChange={(e) => handleInputChange('nameAr', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent ${
                                errors.nameAr ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="مثال: القاهرة الجديدة"
                            dir="rtl"
                            data-oid="8o6vc99"
                        />

                        {errors.nameAr && (
                            <p className="text-red-500 text-sm mt-1" data-oid="mv0gr2e">
                                {errors.nameAr}
                            </p>
                        )}
                    </div>

                    {/* Governorate */}
                    <div data-oid="s426qve">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            data-oid="x:z.vgn"
                        >
                            Governorate *
                        </label>
                        <select
                            value={formData.governorateId}
                            onChange={(e) => handleInputChange('governorateId', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent ${
                                errors.governorateId ? 'border-red-300' : 'border-gray-300'
                            }`}
                            data-oid="vo-c1fp"
                        >
                            <option value="" data-oid="5_ugt9m">
                                Select Governorate
                            </option>
                            {governorates.map((gov) => (
                                <option key={gov._id} value={gov._id} data-oid="_kf2fqt">
                                    {gov.nameEn} ({gov.nameAr})
                                </option>
                            ))}
                        </select>
                        {errors.governorateId && (
                            <p className="text-red-500 text-sm mt-1" data-oid="7qs249c">
                                {errors.governorateId}
                            </p>
                        )}
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4" data-oid="ti5baqe">
                        <div data-oid=".adc6ds">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="xniuqog"
                            >
                                Latitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.lat}
                                onChange={(e) =>
                                    handleInputChange('lat', parseFloat(e.target.value) || 0)
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent ${
                                    errors.coordinates ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="30.0444"
                                data-oid="ko2mf2w"
                            />
                        </div>
                        <div data-oid="--5plp7">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="hljfhau"
                            >
                                Longitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.lng}
                                onChange={(e) =>
                                    handleInputChange('lng', parseFloat(e.target.value) || 0)
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent ${
                                    errors.coordinates ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="31.2357"
                                data-oid="d8ommd1"
                            />
                        </div>
                        {errors.coordinates && (
                            <p className="text-red-500 text-sm mt-1 col-span-2" data-oid="5oa:4o6">
                                {errors.coordinates}
                            </p>
                        )}
                    </div>

                    {/* Estimated Counts */}
                    <div className="grid grid-cols-2 gap-4" data-oid="jb-0v62">
                        <div data-oid="boa2b.n">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="g202.sf"
                            >
                                Estimated Pharmacies
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.estimatedPharmacyCount}
                                onChange={(e) =>
                                    handleInputChange(
                                        'estimatedPharmacyCount',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent ${
                                    errors.estimatedPharmacyCount
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                }`}
                                placeholder="50"
                                data-oid="dcbvsg1"
                            />

                            {errors.estimatedPharmacyCount && (
                                <p className="text-red-500 text-sm mt-1" data-oid="ro9tkze">
                                    {errors.estimatedPharmacyCount}
                                </p>
                            )}
                        </div>
                        <div data-oid="wpnp4hj">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                data-oid="3xu7dmj"
                            >
                                Estimated Doctors
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.estimatedDoctorCount}
                                onChange={(e) =>
                                    handleInputChange(
                                        'estimatedDoctorCount',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent ${
                                    errors.estimatedDoctorCount
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                }`}
                                placeholder="40"
                                data-oid="r6em9zi"
                            />

                            {errors.estimatedDoctorCount && (
                                <p className="text-red-500 text-sm mt-1" data-oid="vq97wye">
                                    {errors.estimatedDoctorCount}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4" data-oid="njen56f">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            data-oid="3uef1io"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                            data-oid="l.3kebk"
                        >
                            Add City
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
