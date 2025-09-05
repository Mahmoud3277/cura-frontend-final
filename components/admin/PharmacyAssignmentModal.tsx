'use client';

import { useState, useEffect } from 'react';
import {
    pharmacyCityAssignmentService,
    PharmacyCityAssignment,
    NewAssignmentRequest,
} from '@/lib/services/pharmacyCityAssignmentService';

interface PharmacyAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment?: PharmacyCityAssignment | null;
    onSave: () => void;
}

export function PharmacyAssignmentModal({
    isOpen,
    onClose,
    assignment,
    onSave,
}: PharmacyAssignmentModalProps) {
    const [formData, setFormData] = useState<NewAssignmentRequest>({
        pharmacyId: '',
        cityId: '',
        isPrimary: false,
        deliveryRadius: 10,
        deliveryFee: 15,
        minimumOrderAmount: 50,
        estimatedDeliveryTime: '30-45 min',
        commissionRate: 12,
        coverageAreas: [],
        workingHours: {
            monday: { open: '08:00', close: '22:00', is24Hours: false },
            tuesday: { open: '08:00', close: '22:00', is24Hours: false },
            wednesday: { open: '08:00', close: '22:00', is24Hours: false },
            thursday: { open: '08:00', close: '22:00', is24Hours: false },
            friday: { open: '08:00', close: '22:00', is24Hours: false },
            saturday: { open: '08:00', close: '22:00', is24Hours: false },
            sunday: { open: '10:00', close: '20:00', is24Hours: false },
        },
    });

    const [availablePharmacies, setAvailablePharmacies] = useState<any[]>([]);
    const [availableCities, setAvailableCities] = useState<any[]>([]);
    const [coverageAreaInput, setCoverageAreaInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadData();
            if (assignment) {
                setFormData({
                    pharmacyId: assignment.pharmacyId,
                    cityId: assignment.cityId,
                    isPrimary: assignment.isPrimary,
                    deliveryRadius: assignment.deliveryRadius,
                    deliveryFee: assignment.deliveryFee,
                    minimumOrderAmount: assignment.minimumOrderAmount,
                    estimatedDeliveryTime: assignment.estimatedDeliveryTime,
                    commissionRate: assignment.commissionRate,
                    coverageAreas: assignment.coverageAreas,
                    workingHours: assignment.workingHours,
                });
                setCoverageAreaInput(assignment.coverageAreas.join(', '));
            } else {
                resetForm();
            }
        }
    }, [isOpen, assignment]);

    const loadData = () => {
        const pharmacies = pharmacyCityAssignmentService.getAvailablePharmacies();
        const cities = pharmacyCityAssignmentService.getAvailableCities();
        setAvailablePharmacies(pharmacies);
        setAvailableCities(cities);
    };

    const resetForm = () => {
        setFormData({
            pharmacyId: '',
            cityId: '',
            isPrimary: false,
            deliveryRadius: 10,
            deliveryFee: 15,
            minimumOrderAmount: 50,
            estimatedDeliveryTime: '30-45 min',
            commissionRate: 12,
            coverageAreas: [],
            workingHours: {
                monday: { open: '08:00', close: '22:00', is24Hours: false },
                tuesday: { open: '08:00', close: '22:00', is24Hours: false },
                wednesday: { open: '08:00', close: '22:00', is24Hours: false },
                thursday: { open: '08:00', close: '22:00', is24Hours: false },
                friday: { open: '08:00', close: '22:00', is24Hours: false },
                saturday: { open: '08:00', close: '22:00', is24Hours: false },
                sunday: { open: '10:00', close: '20:00', is24Hours: false },
            },
        });
        setCoverageAreaInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const assignmentData = {
                ...formData,
                coverageAreas: coverageAreaInput
                    .split(',')
                    .map((area) => area.trim())
                    .filter((area) => area.length > 0),
            };

            if (assignment) {
                // Update existing assignment
                const success = pharmacyCityAssignmentService.updateAssignment(
                    assignment.id,
                    assignmentData,
                );
                if (success) {
                    onSave();
                    onClose();
                }
            } else {
                // Create new assignment
                const newId = pharmacyCityAssignmentService.createAssignment(assignmentData);
                if (newId) {
                    onSave();
                    onClose();
                }
            }
        } catch (error) {
            console.error('Error saving assignment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWorkingHoursChange = (
        day: keyof typeof formData.workingHours,
        field: 'open' | 'close' | 'is24Hours',
        value: string | boolean,
    ) => {
        setFormData((prev) => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    [field]: value,
                },
            },
        }));
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            data-oid="9f:hm3w"
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                data-oid="dixbv1k"
            >
                <div className="flex items-center justify-between mb-6" data-oid="w28c5-v">
                    <h2 className="text-xl font-semibold text-gray-900" data-oid="f31ktjr">
                        {assignment ? 'Edit Assignment' : 'Create New Assignment'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                        data-oid="cswk9hc"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="zcc8on8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                                data-oid="3qt2tm4"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" data-oid="25612:_">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="9lffwuu">
                        <div data-oid="lqjuhk_">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="fxrc7xe"
                            >
                                Pharmacy *
                            </label>
                            <select
                                required
                                value={formData.pharmacyId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, pharmacyId: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                disabled={!!assignment}
                                data-oid="pl2xpe."
                            >
                                <option value="" data-oid="42amavi">
                                    Select Pharmacy
                                </option>
                                {availablePharmacies.map((pharmacy) => (
                                    <option
                                        key={pharmacy.id}
                                        value={pharmacy.id}
                                        data-oid="8.s1byl"
                                    >
                                        {pharmacy.name} - {pharmacy.cityName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div data-oid="5n7o0oo">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid=":dzl6fe"
                            >
                                City *
                            </label>
                            <select
                                required
                                value={formData.cityId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, cityId: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                disabled={!!assignment}
                                data-oid="0w8i:_7"
                            >
                                <option value="" data-oid="akq3con">
                                    Select City
                                </option>
                                {availableCities.map((city) => (
                                    <option key={city.id} value={city.id} data-oid="_gbccu0">
                                        {city.nameEn} - {city.governorateName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Assignment Type */}
                    <div data-oid="x9-2_fj">
                        <label className="flex items-center space-x-2" data-oid=":9sx26z">
                            <input
                                type="checkbox"
                                checked={formData.isPrimary}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isPrimary: e.target.checked,
                                    }))
                                }
                                className="rounded border-gray-300 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                data-oid="usk:e87"
                            />

                            <span className="text-sm font-medium text-gray-700" data-oid="y--mbl_">
                                Primary Location for Pharmacy
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1" data-oid="yimmup3">
                            Check if this is the main location for this pharmacy
                        </p>
                    </div>

                    {/* Delivery Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-oid="vxbih3i">
                        <div data-oid="qi23nn2">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="n308u1f"
                            >
                                Delivery Radius (km) *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="50"
                                value={formData.deliveryRadius}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        deliveryRadius: parseFloat(e.target.value),
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid=":0db0kb"
                            />
                        </div>

                        <div data-oid="pd3_v_i">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="xpo3yiu"
                            >
                                Delivery Fee (EGP) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.deliveryFee}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        deliveryFee: parseFloat(e.target.value),
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="2_qyvlb"
                            />
                        </div>

                        <div data-oid="osk2eu3">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="fs5sj3u"
                            >
                                Min Order Amount (EGP) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.minimumOrderAmount}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        minimumOrderAmount: parseFloat(e.target.value),
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="-1.-yna"
                            />
                        </div>

                        <div data-oid="6s9d_pw">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="q3hvjld"
                            >
                                Commission Rate (%) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="50"
                                step="0.1"
                                value={formData.commissionRate}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        commissionRate: parseFloat(e.target.value),
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="lvccs8_"
                            />
                        </div>
                    </div>

                    {/* Delivery Time */}
                    <div data-oid="023dibh">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="syprgu4"
                        >
                            Estimated Delivery Time *
                        </label>
                        <select
                            required
                            value={formData.estimatedDeliveryTime}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    estimatedDeliveryTime: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="ajii0j."
                        >
                            <option value="15-30 min" data-oid="lw-ta5.">
                                15-30 minutes
                            </option>
                            <option value="20-35 min" data-oid="914t9ks">
                                20-35 minutes
                            </option>
                            <option value="25-40 min" data-oid="8oy:caz">
                                25-40 minutes
                            </option>
                            <option value="30-45 min" data-oid="4iex24t">
                                30-45 minutes
                            </option>
                            <option value="35-50 min" data-oid="dpedcv6">
                                35-50 minutes
                            </option>
                            <option value="40-60 min" data-oid="dzuxrbt">
                                40-60 minutes
                            </option>
                            <option value="45-75 min" data-oid="1chu6r_">
                                45-75 minutes
                            </option>
                            <option value="60-90 min" data-oid="wd.x94i">
                                60-90 minutes
                            </option>
                        </select>
                    </div>

                    {/* Coverage Areas */}
                    <div data-oid="uwxrqw.">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            data-oid="1idq3of"
                        >
                            Coverage Areas
                        </label>
                        <input
                            type="text"
                            placeholder="Enter areas separated by commas (e.g., Downtown, District 1, Area 2)"
                            value={coverageAreaInput}
                            onChange={(e) => setCoverageAreaInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                            data-oid="-vlto-6"
                        />

                        <p className="text-xs text-gray-500 mt-1" data-oid="uu1k:6x">
                            Specific areas within the city that this pharmacy covers
                        </p>
                    </div>

                    {/* Working Hours */}
                    <div data-oid="rmp65le">
                        <h3 className="text-lg font-medium text-gray-900 mb-4" data-oid="gbwq5o:">
                            Working Hours
                        </h3>
                        <div className="space-y-3" data-oid="o00v.oa">
                            {Object.entries(formData.workingHours).map(([day, hours]) => (
                                <div
                                    key={day}
                                    className="grid grid-cols-4 gap-4 items-center"
                                    data-oid="ju:n:wb"
                                >
                                    <div
                                        className="font-medium text-gray-700 capitalize"
                                        data-oid="2ks2ynd"
                                    >
                                        {day}
                                    </div>
                                    <div data-oid="dvla5vm">
                                        <input
                                            type="time"
                                            value={hours.open}
                                            onChange={(e) =>
                                                handleWorkingHoursChange(
                                                    day as keyof typeof formData.workingHours,
                                                    'open',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={hours.is24Hours}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent disabled:bg-gray-100"
                                            data-oid="mtem9__"
                                        />
                                    </div>
                                    <div data-oid="3rod-2e">
                                        <input
                                            type="time"
                                            value={hours.close}
                                            onChange={(e) =>
                                                handleWorkingHoursChange(
                                                    day as keyof typeof formData.workingHours,
                                                    'close',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={hours.is24Hours}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent disabled:bg-gray-100"
                                            data-oid="p-kiquc"
                                        />
                                    </div>
                                    <div data-oid="lmxby-p">
                                        <label
                                            className="flex items-center space-x-2"
                                            data-oid="sk27ney"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={hours.is24Hours}
                                                onChange={(e) =>
                                                    handleWorkingHoursChange(
                                                        day as keyof typeof formData.workingHours,
                                                        'is24Hours',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded border-gray-300 text-[#1F1F6F] focus:ring-[#1F1F6F]"
                                                data-oid="5y_89n3"
                                            />

                                            <span
                                                className="text-sm text-gray-600"
                                                data-oid="iggho9-"
                                            >
                                                24 Hours
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div
                        className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200"
                        data-oid="o5:bohr"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            data-oid="00uny7v"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] disabled:opacity-50"
                            data-oid="f4s1pe7"
                        >
                            {isLoading
                                ? 'Saving...'
                                : assignment
                                  ? 'Update Assignment'
                                  : 'Create Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
