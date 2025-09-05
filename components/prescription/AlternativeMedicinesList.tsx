'use client';

// Alternative Medicines List Component
// Task 4.1: Build Medicine Card Interface - Alternatives Display

import React, { useState } from 'react';
import { ExtendedMedicine, MedicineAlternative } from '../../lib/data/medicineData';
import { pharmacyAvailabilityService } from '../../lib/services/pharmacyAvailabilityService';

export interface AlternativeMedicinesListProps {
    originalMedicine: ExtendedMedicine;
    alternatives: MedicineAlternative[];
    selectedAlternative?: ExtendedMedicine | null;
    onAlternativeSelect: (alternative: ExtendedMedicine | null) => void;
    cityId?: string;
    disabled?: boolean;
    showPricing?: boolean;
    showAvailability?: boolean;
    compact?: boolean;
    className?: string;
    onPharmacyOptionsUpdate?: (medicineId: string) => void;
}

export default function AlternativeMedicinesList({
    originalMedicine,
    alternatives,
    selectedAlternative,
    onAlternativeSelect,
    cityId,
    disabled = false,
    showPricing = true,
    showAvailability = true,
    compact = false,
    className = '',
    onPharmacyOptionsUpdate,
}: AlternativeMedicinesListProps) {
    const [expandedAlternative, setExpandedAlternative] = useState<string | null>(null);

    const handleAlternativeSelect = (alternativeId: string) => {
        if (disabled) return;

        if (alternativeId === originalMedicine.id) {
            onAlternativeSelect(null);
        } else {
            const alternative = alternatives.find((alt) => alt.id === alternativeId);
            if (alternative) {
                // Convert MedicineAlternative to ExtendedMedicine format
                const extendedAlternative: ExtendedMedicine = {
                    ...originalMedicine,
                    id: alternative.id,
                    name: alternative.name,
                    genericName: alternative.genericName,
                    activeIngredient: alternative.activeIngredient,
                    strength: alternative.strength,
                    form: alternative.form,
                    manufacturer: alternative.manufacturer,
                    description: alternative.description,
                    image: alternative.image,
                };
                onAlternativeSelect(extendedAlternative);
            }
        }

        // Notify parent component that pharmacy options need to be updated
        if (onPharmacyOptionsUpdate) {
            onPharmacyOptionsUpdate(
                alternativeId === originalMedicine.id ? originalMedicine.id : alternativeId,
            );
        }
    };

    const toggleExpanded = (alternativeId: string) => {
        setExpandedAlternative(expandedAlternative === alternativeId ? null : alternativeId);
    };

    const getAvailabilityInfo = (alternativeId: string) => {
        if (!showAvailability) return null;

        try {
            const report = pharmacyAvailabilityService.getMedicineAvailabilityReport(
                alternativeId,
                cityId,
            );
            return report;
        } catch {
            return null;
        }
    };

    const getAvailabilityBadge = (availability: string) => {
        const badges = {
            'in-stock': 'bg-green-100 text-green-800',
            'low-stock': 'bg-yellow-100 text-yellow-800',
            'out-of-stock': 'bg-red-100 text-red-800',
        };
        return badges[availability as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    if (alternatives.length === 0) {
        return (
            <div className={`p-4 text-center text-gray-500 ${className}`} data-oid="l3y-v0c">
                <span className="text-2xl mb-2 block" data-oid="rkv7ef0">
                    🔍
                </span>
                <p className="text-sm" data-oid="ev06g28">
                    No alternatives available for this medicine.
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`} data-oid="2mtnn7k">
            <div className="flex items-center justify-between" data-oid="hf5lyj7">
                <h4 className="text-sm font-medium text-gray-900" data-oid="83qts_5">
                    Available Alternatives ({alternatives.length + 1})
                </h4>
                <span className="text-xs text-gray-500" data-oid="x.241uw">
                    Select if original is not available
                </span>
            </div>

            <div className="space-y-2" data-oid="zq8otgj">
                {/* Original Medicine Option */}
                <div
                    className={`border rounded-lg transition-all ${
                        !selectedAlternative
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                    } ${disabled ? 'opacity-60' : ''}`}
                    data-oid="ldcop0w"
                >
                    <label className="flex items-start gap-3 p-3 cursor-pointer" data-oid="fzh9czh">
                        <input
                            type="radio"
                            name={`alternative-${originalMedicine.id}`}
                            value={originalMedicine.id}
                            checked={!selectedAlternative}
                            onChange={() => handleAlternativeSelect(originalMedicine.id)}
                            disabled={disabled}
                            className="mt-1 text-blue-600"
                            data-oid="9k3kwd0"
                        />

                        <div className="flex-1 min-w-0" data-oid="u1o5ld2">
                            <div className="flex items-center gap-2 mb-1" data-oid="g0j7o_6">
                                <span className="font-medium text-gray-900" data-oid="q0xeqzs">
                                    {originalMedicine.name}
                                </span>
                                <span
                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                    data-oid="0111-hf"
                                >
                                    Original
                                </span>
                                {!selectedAlternative && (
                                    <span
                                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                        data-oid="z_go476"
                                    >
                                        ✓ Selected
                                    </span>
                                )}
                            </div>

                            <div className="text-sm text-gray-600 space-y-1" data-oid=".:iqb-n">
                                <p data-oid="i_i2ruc">{originalMedicine.manufacturer}</p>
                                <p className="text-xs" data-oid="158-7e7">
                                    {originalMedicine.strength} • {originalMedicine.form}
                                </p>
                            </div>

                            {showPricing && (
                                <div className="mt-2 text-sm" data-oid="94k:6qu">
                                    <span className="text-gray-700" data-oid="tkgl85u">
                                        Price:{' '}
                                        {originalMedicine.pharmacyMapping.lowestPrice.toFixed(2)} -{' '}
                                        {originalMedicine.pharmacyMapping.highestPrice.toFixed(2)}{' '}
                                        EGP
                                    </span>
                                </div>
                            )}
                        </div>
                    </label>
                </div>

                {/* Alternative Options */}
                {alternatives.map((alternative) => {
                    const isSelected = selectedAlternative?.id === alternative.id;
                    const isExpanded = expandedAlternative === alternative.id;
                    const availabilityInfo = getAvailabilityInfo(alternative.id);

                    return (
                        <div
                            key={alternative.id}
                            className={`border rounded-lg transition-all ${
                                isSelected
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            } ${disabled ? 'opacity-60' : ''}`}
                            data-oid=".4jsqyk"
                        >
                            <label
                                className="flex items-start gap-3 p-3 cursor-pointer"
                                data-oid="z-agl94"
                            >
                                <input
                                    type="radio"
                                    name={`alternative-${originalMedicine.id}`}
                                    value={alternative.id}
                                    checked={isSelected}
                                    onChange={() => handleAlternativeSelect(alternative.id)}
                                    disabled={disabled}
                                    className="mt-1 text-blue-600"
                                    data-oid="5lfc04p"
                                />

                                <div className="flex-1 min-w-0" data-oid="v9xjlz8">
                                    <div
                                        className="flex items-center gap-2 mb-1"
                                        data-oid="61tr_wg"
                                    >
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid="_z4zrmw"
                                        >
                                            {alternative.name}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${getAvailabilityBadge(alternative.availability)}`}
                                            data-oid="vlt6.vt"
                                        >
                                            {alternative.availability.replace('-', ' ')}
                                        </span>
                                        {isSelected && (
                                            <span
                                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                                data-oid="mmfw8ay"
                                            >
                                                ✓ Selected
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className="text-sm text-gray-600 space-y-1"
                                        data-oid="l3d_3by"
                                    >
                                        <p data-oid="b6jr_5d">{alternative.manufacturer}</p>
                                        <p className="text-xs" data-oid="-1qqlle">
                                            {alternative.strength} • {alternative.form}
                                        </p>
                                        {alternative.description && (
                                            <p className="text-xs text-gray-500" data-oid="sl7p_tq">
                                                {alternative.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pricing Information */}
                                    {showPricing && (
                                        <div
                                            className="mt-2 flex items-center justify-between"
                                            data-oid="ze51b90"
                                        >
                                            <span
                                                className="text-sm text-gray-700"
                                                data-oid="qzqpszv"
                                            >
                                                Avg: {alternative.averagePrice.toFixed(2)} EGP
                                            </span>
                                            <span
                                                className="text-xs text-gray-500"
                                                data-oid="r9j3x6p"
                                            >
                                                {alternative.pharmacyCount} pharmacies
                                            </span>
                                        </div>
                                    )}

                                    {/* Availability Information */}
                                    {showAvailability && availabilityInfo && (
                                        <div
                                            className="mt-2 text-xs text-gray-600"
                                            data-oid="8di57pt"
                                        >
                                            Available at {availabilityInfo.availablePharmacies} of{' '}
                                            {availabilityInfo.totalPharmacies} pharmacies (
                                            {availabilityInfo.availabilityPercentage.toFixed(1)}%)
                                        </div>
                                    )}

                                    {/* Advantages/Considerations Preview */}
                                    {!compact &&
                                        (alternative.advantages || alternative.considerations) && (
                                            <div className="mt-2" data-oid="op-h3qf">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleExpanded(alternative.id);
                                                    }}
                                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    data-oid="_v1_1bb"
                                                >
                                                    <span data-oid="0.s.mvr">
                                                        {isExpanded ? '▼' : '▶'}
                                                    </span>
                                                    <span data-oid="edwbkw6">
                                                        {isExpanded ? 'Hide' : 'Show'} details
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </label>

                            {/* Expanded Details */}
                            {!compact && isExpanded && (
                                <div
                                    className="px-3 pb-3 border-t border-gray-200 mt-2 pt-3"
                                    data-oid="srgwjd2"
                                >
                                    {/* Advantages */}
                                    {alternative.advantages &&
                                        alternative.advantages.length > 0 && (
                                            <div className="mb-3" data-oid="f-qqa47">
                                                <h5
                                                    className="text-xs font-medium text-green-700 mb-1"
                                                    data-oid="3z51mkq"
                                                >
                                                    Advantages:
                                                </h5>
                                                <ul className="space-y-1" data-oid="rmt.v5v">
                                                    {alternative.advantages.map(
                                                        (advantage, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="text-xs text-green-600 flex items-start gap-1"
                                                                data-oid="2kupj0x"
                                                            >
                                                                <span
                                                                    className="text-green-500 mt-0.5"
                                                                    data-oid="fadn505"
                                                                >
                                                                    ✓
                                                                </span>
                                                                <span data-oid="b38e_u6">
                                                                    {advantage}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                    {/* Considerations */}
                                    {alternative.considerations &&
                                        alternative.considerations.length > 0 && (
                                            <div className="mb-3" data-oid="u:bp003">
                                                <h5
                                                    className="text-xs font-medium text-orange-700 mb-1"
                                                    data-oid="et626e:"
                                                >
                                                    Considerations:
                                                </h5>
                                                <ul className="space-y-1" data-oid=":niu27a">
                                                    {alternative.considerations.map(
                                                        (consideration, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="text-xs text-orange-600 flex items-start gap-1"
                                                                data-oid="176:782"
                                                            >
                                                                <span
                                                                    className="text-orange-500 mt-0.5"
                                                                    data-oid="w9h2yxc"
                                                                >
                                                                    ⚠
                                                                </span>
                                                                <span data-oid="fr0sd20">
                                                                    {consideration}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                    {/* Equivalent Dose */}
                                    {alternative.equivalentDose && (
                                        <div className="text-xs text-gray-600" data-oid="ddq10o7">
                                            <span className="font-medium" data-oid="ijoweb9">
                                                Equivalent dose:
                                            </span>{' '}
                                            {alternative.equivalentDose}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selection Summary */}
            {selectedAlternative && (
                <div
                    className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                    data-oid=":67fht:"
                >
                    <div className="flex items-start gap-2" data-oid="g_alx8:">
                        <span className="text-blue-600" data-oid="_l9:xu.">
                            🔄
                        </span>
                        <div className="flex-1" data-oid="sp8b__f">
                            <p className="text-sm font-medium text-blue-900" data-oid=":epsdkc">
                                Alternative Selected: {selectedAlternative.name}
                            </p>
                            <p className="text-xs text-blue-700 mt-1" data-oid="77tu.:l">
                                This will replace {originalMedicine.name} in your order. Please
                                consult your pharmacist if you have any questions.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* No Selection Warning */}
            {alternatives.length > 0 &&
                !selectedAlternative &&
                originalMedicine.pharmacyMapping.availabilityPercentage < 50 && (
                    <div
                        className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                        data-oid=":awldgz"
                    >
                        <div className="flex items-start gap-2" data-oid="v06th1h">
                            <span className="text-yellow-600" data-oid="o927gtp">
                                ⚠️
                            </span>
                            <div className="flex-1" data-oid="ntt9pp9">
                                <p
                                    className="text-sm font-medium text-yellow-900"
                                    data-oid=":awsv0f"
                                >
                                    Limited Availability
                                </p>
                                <p className="text-xs text-yellow-700 mt-1" data-oid="3xlu_jc">
                                    The original medicine has limited availability. Consider
                                    selecting an alternative to ensure faster delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

// Compact alternative selector for smaller spaces
export function CompactAlternativeSelector({
    originalMedicine,
    alternatives,
    selectedAlternative,
    onAlternativeSelect,
    disabled = false,
    className = '',
}: {
    originalMedicine: ExtendedMedicine;
    alternatives: MedicineAlternative[];
    selectedAlternative?: ExtendedMedicine | null;
    onAlternativeSelect: (alternative: ExtendedMedicine | null) => void;
    disabled?: boolean;
    className?: string;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;

        if (selectedId === originalMedicine.id) {
            onAlternativeSelect(null);
        } else {
            const alternative = alternatives.find((alt) => alt.id === selectedId);
            if (alternative) {
                const extendedAlternative: ExtendedMedicine = {
                    ...originalMedicine,
                    id: alternative.id,
                    name: alternative.name,
                    genericName: alternative.genericName,
                    activeIngredient: alternative.activeIngredient,
                    strength: alternative.strength,
                    form: alternative.form,
                    manufacturer: alternative.manufacturer,
                    description: alternative.description,
                    image: alternative.image,
                };
                onAlternativeSelect(extendedAlternative);
            }
        }
    };

    return (
        <div className={`space-y-2 ${className}`} data-oid="e:59lg-">
            <label className="block text-sm font-medium text-gray-700" data-oid="xjusssj">
                Medicine Selection
            </label>
            <select
                value={selectedAlternative?.id || originalMedicine.id}
                onChange={handleChange}
                disabled={disabled}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                data-oid="w8d5.8q"
            >
                <option value={originalMedicine.id} data-oid="9hiznxp">
                    {originalMedicine.name} (Original)
                </option>
                {alternatives.map((alternative) => (
                    <option key={alternative.id} value={alternative.id} data-oid="efrj9e4">
                        {alternative.name} - {alternative.manufacturer}
                    </option>
                ))}
            </select>

            {selectedAlternative && (
                <p className="text-xs text-blue-600" data-oid="mz5ga7:">
                    ℹ️ Alternative selected: {selectedAlternative.name}
                </p>
            )}
        </div>
    );
}
