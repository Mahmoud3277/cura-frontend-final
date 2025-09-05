'use client';

// Medicine Instructions Component
// Task 4.1: Build Medicine Card Interface - Instructions Display

import React, { useState } from 'react';
import { ExtendedMedicine, ProcessedMedicine } from '../../lib/data/medicineData';
import { useTranslation } from '@/lib/hooks/useTranslation';

export interface MedicineInstructionsProps {
    medicine: ExtendedMedicine;
    prescriptionMedicine?: ProcessedMedicine;
    showFullDetails?: boolean;
    compact?: boolean;
    className?: string;
}

export default function MedicineInstructions({
    medicine,
    prescriptionMedicine,
    showFullDetails = false,
    compact = false,
    className = '',
}: MedicineInstructionsProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    const isExpanded = (section: string) => expandedSections.has(section);

    // Get instructions from prescription or medicine data
    const instructions = prescriptionMedicine?.instructions || medicine.instructions;
    const dosage = prescriptionMedicine?.dosage || medicine.dosage;

    if (compact) {
        return (
            <div className={`space-y-2 ${className}`} data-oid="15ghqfe">
                {/* Basic Instructions */}
                {instructions && (
                    <div
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                        data-oid="-3vhx7i"
                    >
                        <div className="flex items-start gap-2" data-oid="5xy:p:p">
                            <span className="text-blue-600 text-sm" data-oid="u1gvapd">
                                💊
                            </span>
                            <div className="flex-1" data-oid="dglt-.:">
                                <p className="text-sm text-blue-900 font-medium" data-oid="6ssyx8f">
                                    Instructions
                                </p>
                                <p className="text-sm text-blue-800" data-oid=":votr2o">
                                    {instructions}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Basic Dosage Info */}
                {(dosage || medicine.frequency) && (
                    <div className="grid grid-cols-2 gap-2 text-xs" data-oid="308-jj1">
                        {dosage && (
                            <div className="flex items-center gap-1" data-oid="66epfiv">
                                <span className="text-gray-500" data-oid="02n0zwu">
                                    💊
                                </span>
                                <span className="text-gray-700" data-oid="hpse81_">
                                    Dose: {dosage}
                                </span>
                            </div>
                        )}
                        {medicine.frequency && (
                            <div className="flex items-center gap-1" data-oid="8p17.ct">
                                <span className="text-gray-500" data-oid="e.:9zy3">
                                    ⏰
                                </span>
                                <span className="text-gray-700" data-oid="ueu-c-y">
                                    {medicine.frequency}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`} data-oid="avbkjnt">
            {/* Primary Instructions */}
            {instructions && (
                <div
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                    data-oid="9bcv_ft"
                >
                    <div className="flex items-start gap-3" data-oid="gjffoiv">
                        <div
                            className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                            data-oid="s2x3fh8"
                        >
                            <span className="text-blue-600" data-oid="iqd6ulc">
                                💊
                            </span>
                        </div>
                        <div className="flex-1" data-oid="i-hkndo">
                            <h4
                                className="text-sm font-semibold text-blue-900 mb-2"
                                data-oid="plauiz."
                            >
                                How to Take This Medicine
                            </h4>
                            <p className="text-sm text-blue-800 leading-relaxed" data-oid="ouminxr">
                                {instructions}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Dosage Information */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                data-oid="vc76tzo"
            >
                {dosage && (
                    <div className="p-3 bg-gray-50 rounded-lg" data-oid="r59fm_m">
                        <div className="flex items-center gap-2 mb-1" data-oid="kpqrtil">
                            <span className="text-gray-600" data-oid="8lv:pf7">
                                💊
                            </span>
                            <span className="text-xs font-medium text-gray-700" data-oid="cvla3a:">
                                DOSAGE
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900" data-oid="ty8nw_6">
                            {dosage}
                        </p>
                    </div>
                )}

                {medicine.frequency && (
                    <div className="p-3 bg-gray-50 rounded-lg" data-oid="kpevb0m">
                        <div className="flex items-center gap-2 mb-1" data-oid="46k8goj">
                            <span className="text-gray-600" data-oid="j-x_s7i">
                                ⏰
                            </span>
                            <span className="text-xs font-medium text-gray-700" data-oid="l1fev6-">
                                FREQUENCY
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900" data-oid="-l41ql3">
                            {medicine.frequency}
                        </p>
                    </div>
                )}

                {medicine.duration && (
                    <div className="p-3 bg-gray-50 rounded-lg" data-oid="secoci1">
                        <div className="flex items-center gap-2 mb-1" data-oid="-f:s.v5">
                            <span className="text-gray-600" data-oid="2503pi4">
                                📅
                            </span>
                            <span className="text-xs font-medium text-gray-700" data-oid="vz6arog">
                                DURATION
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900" data-oid="t3_ksbk">
                            {medicine.duration}
                        </p>
                    </div>
                )}

                {medicine.route && (
                    <div className="p-3 bg-gray-50 rounded-lg" data-oid="74-yze1">
                        <div className="flex items-center gap-2 mb-1" data-oid="or9x7g5">
                            <span className="text-gray-600" data-oid="hd2dnrm">
                                🎯
                            </span>
                            <span className="text-xs font-medium text-gray-700" data-oid="rp52u7:">
                                ROUTE
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900" data-oid="hh816na">
                            {medicine.route}
                        </p>
                    </div>
                )}
            </div>

            {/* Timing Information */}
            {medicine.timing && medicine.timing.length > 0 && (
                <div
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                    data-oid="ak.kk27"
                >
                    <div className="flex items-start gap-3" data-oid="gw:gfmb">
                        <div
                            className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                            data-oid="dg6ozt8"
                        >
                            <span className="text-green-600" data-oid="x6upirs">
                                ⏰
                            </span>
                        </div>
                        <div className="flex-1" data-oid="jjhly_r">
                            <h4
                                className="text-sm font-semibold text-green-900 mb-2"
                                data-oid="5a1-g1f"
                            >
                                Best Times to Take
                            </h4>
                            <div className="flex flex-wrap gap-2" data-oid=":4epnmc">
                                {medicine.timing.map((time, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                                        data-oid="w3m5y-j"
                                    >
                                        {time}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Food Instructions */}
            {medicine.foodInstructions && (
                <div
                    className="p-4 bg-orange-50 rounded-lg border border-orange-200"
                    data-oid="a9pua7x"
                >
                    <div className="flex items-start gap-3" data-oid="h.p:913">
                        <div
                            className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"
                            data-oid="tqrm2lt"
                        >
                            <span className="text-orange-600" data-oid="epp7c8-">
                                🍽️
                            </span>
                        </div>
                        <div className="flex-1" data-oid="5n-x4ox">
                            <h4
                                className="text-sm font-semibold text-orange-900 mb-2"
                                data-oid="8iiqvmg"
                            >
                                Food Instructions
                            </h4>
                            <p className="text-sm text-orange-800" data-oid="0f6i82:">
                                {medicine.foodInstructions}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Special Instructions */}
            {medicine.specialInstructions && medicine.specialInstructions.length > 0 && (
                <div
                    className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                    data-oid="f6srvzs"
                >
                    <div className="flex items-start gap-3" data-oid="0n85bfh">
                        <div
                            className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
                            data-oid="bhl7dc-"
                        >
                            <span className="text-purple-600" data-oid="qgf0bk7">
                                ⚠️
                            </span>
                        </div>
                        <div className="flex-1" data-oid="h5j5:gh">
                            <h4
                                className="text-sm font-semibold text-purple-900 mb-2"
                                data-oid="86i6t2_"
                            >
                                Special Instructions
                            </h4>
                            <ul className="space-y-1" data-oid="oegpb.7">
                                {medicine.specialInstructions.map((instruction, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-purple-800 flex items-start gap-2"
                                        data-oid=".qii6yf"
                                    >
                                        <span className="text-purple-600 mt-0.5" data-oid="ckm1qq:">
                                            •
                                        </span>
                                        <span data-oid="ohr42zv">{instruction}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Expandable Sections for Full Details */}
            {showFullDetails && (
                <div className="space-y-3" data-oid="c8c:dt6">
                    {/* Warnings */}
                    {medicine.warnings && medicine.warnings.length > 0 && (
                        <div className="border border-gray-200 rounded-lg" data-oid=".4ui:w_">
                            <button
                                type="button"
                                onClick={() => toggleSection('warnings')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                                data-oid="_e2m_yl"
                            >
                                <div className="flex items-center gap-3" data-oid="isb_a_e">
                                    <span className="text-red-600" data-oid="lb7:lvp">
                                        ⚠️
                                    </span>
                                    <span className="font-medium text-gray-900" data-oid="m4skazc">
                                        Warnings
                                    </span>
                                    <span className="text-xs text-gray-500" data-oid=".:sd2bb">
                                        ({medicine.warnings.length})
                                    </span>
                                </div>
                                <span className="text-gray-400" data-oid="yr66hee">
                                    {isExpanded('warnings') ? '▼' : '▶'}
                                </span>
                            </button>
                            {isExpanded('warnings') && (
                                <div className="px-4 pb-4" data-oid="tn_8k_9">
                                    <ul className="space-y-2" data-oid="taf-vei">
                                        {medicine.warnings.map((warning, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-red-800 flex items-start gap-2"
                                                data-oid="krq4_lg"
                                            >
                                                <span
                                                    className="text-red-600 mt-0.5"
                                                    data-oid="gs143ja"
                                                >
                                                    ⚠️
                                                </span>
                                                <span data-oid="wl9mv5n">{warning}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Side Effects */}
                    {medicine.sideEffects && medicine.sideEffects.length > 0 && (
                        <div className="border border-gray-200 rounded-lg" data-oid="8ci.o:a">
                            <button
                                type="button"
                                onClick={() => toggleSection('sideEffects')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                                data-oid="4lo.zyo"
                            >
                                <div className="flex items-center gap-3" data-oid="kc84_.t">
                                    <span className="text-yellow-600" data-oid="woh-g4o">
                                        ⚡
                                    </span>
                                    <span className="font-medium text-gray-900" data-oid="u46n9xg">
                                        Possible Side Effects
                                    </span>
                                    <span className="text-xs text-gray-500" data-oid="brhkfd5">
                                        ({medicine.sideEffects.length})
                                    </span>
                                </div>
                                <span className="text-gray-400" data-oid="-e7albw">
                                    {isExpanded('sideEffects') ? '▼' : '▶'}
                                </span>
                            </button>
                            {isExpanded('sideEffects') && (
                                <div className="px-4 pb-4" data-oid="getnw-h">
                                    <ul className="space-y-2" data-oid="-nr:.ct">
                                        {medicine.sideEffects.map((effect, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-yellow-800 flex items-start gap-2"
                                                data-oid="4_ccsv1"
                                            >
                                                <span
                                                    className="text-yellow-600 mt-0.5"
                                                    data-oid="8tcvs._"
                                                >
                                                    •
                                                </span>
                                                <span data-oid="u02vw_5">{effect}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Drug Interactions */}
                    {medicine.drugInteractions && medicine.drugInteractions.length > 0 && (
                        <div className="border border-gray-200 rounded-lg" data-oid="cyc2jh6">
                            <button
                                type="button"
                                onClick={() => toggleSection('interactions')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                                data-oid="-_70lvd"
                            >
                                <div className="flex items-center gap-3" data-oid="qckd690">
                                    <span className="text-orange-600" data-oid="ft20t53">
                                        🔄
                                    </span>
                                    <span className="font-medium text-gray-900" data-oid="d-3.k2r">
                                        Drug Interactions
                                    </span>
                                    <span className="text-xs text-gray-500" data-oid="ja2ke:s">
                                        ({medicine.drugInteractions.length})
                                    </span>
                                </div>
                                <span className="text-gray-400" data-oid=":095r-.">
                                    {isExpanded('interactions') ? '▼' : '▶'}
                                </span>
                            </button>
                            {isExpanded('interactions') && (
                                <div className="px-4 pb-4" data-oid="yh2-5rs">
                                    <ul className="space-y-2" data-oid="yvlooe5">
                                        {medicine.drugInteractions.map((interaction, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-orange-800 flex items-start gap-2"
                                                data-oid="p7:j9jv"
                                            >
                                                <span
                                                    className="text-orange-600 mt-0.5"
                                                    data-oid="obof06i"
                                                >
                                                    ⚠️
                                                </span>
                                                <span data-oid="gco50he">{interaction}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Storage Instructions */}
                    {medicine.storageInstructions && (
                        <div className="border border-gray-200 rounded-lg" data-oid="._s5opx">
                            <button
                                type="button"
                                onClick={() => toggleSection('storage')}
                                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                                data-oid="nvohd1a"
                            >
                                <div className="flex items-center gap-3" data-oid="qu_e0d0">
                                    <span className="text-blue-600" data-oid="hpq3u-q">
                                        📦
                                    </span>
                                    <span className="font-medium text-gray-900" data-oid="ikpexdd">
                                        Storage Instructions
                                    </span>
                                </div>
                                <span className="text-gray-400" data-oid="psyuv-:">
                                    {isExpanded('storage') ? '▼' : '▶'}
                                </span>
                            </button>
                            {isExpanded('storage') && (
                                <div className="px-4 pb-4" data-oid="jybuexj">
                                    <p className="text-sm text-blue-800" data-oid="ch_7zc6">
                                        {medicine.storageInstructions}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Simplified instructions component for quick display
export function QuickInstructions({
    medicine,
    prescriptionMedicine,
    className = '',
}: {
    medicine: ExtendedMedicine;
    prescriptionMedicine?: ProcessedMedicine;
    className?: string;
}) {
    const instructions = prescriptionMedicine?.instructions || medicine.instructions;
    const dosage = prescriptionMedicine?.dosage || medicine.dosage;

    return (
        <div
            className={`flex items-start gap-3 p-3 bg-blue-50 rounded-lg ${className}`}
            data-oid="0p:w5vi"
        >
            <span className="text-blue-600 text-lg" data-oid="tb0p2x6">
                💊
            </span>
            <div className="flex-1 min-w-0" data-oid="3xe6un6">
                {dosage && (
                    <p className="text-sm font-medium text-blue-900 mb-1" data-oid="517g.bq">
                        {dosage} • {medicine.frequency}
                    </p>
                )}
                {instructions && (
                    <p className="text-sm text-blue-800 line-clamp-2" data-oid="tcbrm3n">
                        {instructions}
                    </p>
                )}
            </div>
        </div>
    );
}

// Renamed component to avoid name conflict
export function MedicineInstructionsCard({
    medicineName,
    instructions,
    dosage,
    frequency,
    duration,
    timing = [],
    foodInstructions,
    specialInstructions = [],
    warnings = [],
    sideEffects = [],
    contraindications = [],
    storageInstructions,
    expandable = true,
    showWarnings = true,
}: {
    medicineName: string;
    instructions: string;
    dosage: string;
    frequency: string;
    duration?: string;
    timing?: string[];
    foodInstructions?: string;
    specialInstructions?: string[];
    warnings?: string[];
    sideEffects?: string[];
    contraindications?: string[];
    storageInstructions?: string;
    expandable?: boolean;
    showWarnings?: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(!expandable);
    const [activeTab, setActiveTab] = useState<'instructions' | 'warnings' | 'storage'>(
        'instructions',
    );
    const { t } = useTranslation();

    const formatInstructions = (text: string) => {
        return text.split('\n').map((line, index) => (
            <p key={index} className="mb-2 last:mb-0" data-oid="polzv-9">
                {line}
            </p>
        ));
    };

    return (
        <div
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            data-oid="8naaqb-"
        >
            {/* Header */}
            <div className="bg-blue-50 px-4 py-3 border-b border-gray-200" data-oid="g5-rn91">
                <div className="flex items-center justify-between" data-oid="7hejka:">
                    <div className="flex items-center space-x-2" data-oid="q5qq6ab">
                        <span className="text-blue-600 text-lg" data-oid="pnl_v5_">
                            📋
                        </span>
                        <h3 className="font-semibold text-gray-900" data-oid=".toaq5z">
                            Usage Instructions - {medicineName}
                        </h3>
                    </div>
                    {expandable && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            data-oid="45tnnca"
                        >
                            {isExpanded ? '−' : '+'}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="p-4" data-oid="1s.h-gx">
                    {/* Tabs */}
                    <div
                        className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1"
                        data-oid="ormih4:"
                    >
                        <button
                            onClick={() => setActiveTab('instructions')}
                            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'instructions'
                                    ? 'bg-white text-[#1F1F6F] shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                            data-oid="5pvb-vm"
                        >
                            Instructions
                        </button>
                        {showWarnings &&
                            (warnings.length > 0 ||
                                sideEffects.length > 0 ||
                                contraindications.length > 0) && (
                                <button
                                    onClick={() => setActiveTab('warnings')}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        activeTab === 'warnings'
                                            ? 'bg-white text-[#1F1F6F] shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    data-oid="boe0neo"
                                >
                                    Warnings
                                </button>
                            )}
                        {storageInstructions && (
                            <button
                                onClick={() => setActiveTab('storage')}
                                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'storage'
                                        ? 'bg-white text-[#1F1F6F] shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                                data-oid="pw.ha:h"
                            >
                                Storage
                            </button>
                        )}
                    </div>

                    {/* Instructions Tab */}
                    {activeTab === 'instructions' && (
                        <div className="space-y-4" data-oid="x7s.xfg">
                            {/* Basic Instructions */}
                            <div
                                className="bg-green-50 border border-green-200 rounded-lg p-4"
                                data-oid="r9-796v"
                            >
                                <h4
                                    className="font-medium text-green-800 mb-2 flex items-center"
                                    data-oid="g_9gpay"
                                >
                                    <span className="mr-2" data-oid="t6:.y2w">
                                        ✅
                                    </span>
                                    How to Take This Medicine
                                </h4>
                                <div className="text-sm text-green-700" data-oid="9nsm1:7">
                                    {formatInstructions(instructions)}
                                </div>
                            </div>

                            {/* Dosage Information */}
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="yqw.4q0"
                            >
                                <div className="bg-gray-50 rounded-lg p-4" data-oid="82ef3ju">
                                    <h5
                                        className="font-medium text-gray-900 mb-2"
                                        data-oid="5v0rvvv"
                                    >
                                        Dosage
                                    </h5>
                                    <p className="text-sm text-gray-700" data-oid="wk50p1e">
                                        {dosage}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4" data-oid="ws4fyg7">
                                    <h5
                                        className="font-medium text-gray-900 mb-2"
                                        data-oid="j69iqzm"
                                    >
                                        Frequency
                                    </h5>
                                    <p className="text-sm text-gray-700" data-oid="1696huw">
                                        {frequency}
                                    </p>
                                </div>
                                {duration && (
                                    <div className="bg-gray-50 rounded-lg p-4" data-oid="z::-b7r">
                                        <h5
                                            className="font-medium text-gray-900 mb-2"
                                            data-oid="t6joyat"
                                        >
                                            Duration
                                        </h5>
                                        <p className="text-sm text-gray-700" data-oid="a2cvkr1">
                                            {duration}
                                        </p>
                                    </div>
                                )}
                                {timing.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-4" data-oid="22gzfy5">
                                        <h5
                                            className="font-medium text-gray-900 mb-2"
                                            data-oid=".20j.bt"
                                        >
                                            Best Times
                                        </h5>
                                        <div className="flex flex-wrap gap-1" data-oid="xvmn0zi">
                                            {timing.map((time, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                    data-oid="nvez-87"
                                                >
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Food Instructions */}
                            {foodInstructions && (
                                <div
                                    className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                                    data-oid="7d8vzmf"
                                >
                                    <h5
                                        className="font-medium text-orange-800 mb-2 flex items-center"
                                        data-oid="p9-zfk0"
                                    >
                                        <span className="mr-2" data-oid="99os2vm">
                                            🍽️
                                        </span>
                                        Food Instructions
                                    </h5>
                                    <p className="text-sm text-orange-700" data-oid="loh9q.v">
                                        {foodInstructions}
                                    </p>
                                </div>
                            )}

                            {/* Special Instructions */}
                            {specialInstructions.length > 0 && (
                                <div
                                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                    data-oid="1xv4542"
                                >
                                    <h5
                                        className="font-medium text-blue-800 mb-2 flex items-center"
                                        data-oid="3saju9:"
                                    >
                                        <span className="mr-2" data-oid="gtkfpgm">
                                            ℹ️
                                        </span>
                                        Special Instructions
                                    </h5>
                                    <ul
                                        className="text-sm text-blue-700 space-y-1"
                                        data-oid="3x_qgnh"
                                    >
                                        {specialInstructions.map((instruction, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start"
                                                data-oid="y00wj7d"
                                            >
                                                <span className="mr-2 mt-0.5" data-oid="f:i800v">
                                                    •
                                                </span>
                                                {instruction}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Warnings Tab */}
                    {activeTab === 'warnings' && showWarnings && (
                        <div className="space-y-4" data-oid="tbqyzv7">
                            {/* Warnings */}
                            {warnings.length > 0 && (
                                <div
                                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                                    data-oid="4-l9be5"
                                >
                                    <h5
                                        className="font-medium text-red-800 mb-2 flex items-center"
                                        data-oid="a5peyz0"
                                    >
                                        <span className="mr-2" data-oid="h_2_tc5">
                                            ⚠️
                                        </span>
                                        Important Warnings
                                    </h5>
                                    <ul
                                        className="text-sm text-red-700 space-y-1"
                                        data-oid="n4:qmns"
                                    >
                                        {warnings.map((warning, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start"
                                                data-oid="tr.kwz0"
                                            >
                                                <span className="mr-2 mt-0.5" data-oid="ylk34qi">
                                                    •
                                                </span>
                                                {warning}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Side Effects */}
                            {sideEffects.length > 0 && (
                                <div
                                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                                    data-oid="iz4.d01"
                                >
                                    <h5
                                        className="font-medium text-yellow-800 mb-2 flex items-center"
                                        data-oid="t6s2ohm"
                                    >
                                        <span className="mr-2" data-oid="p83-w_f">
                                            ⚡
                                        </span>
                                        Possible Side Effects
                                    </h5>
                                    <ul
                                        className="text-sm text-yellow-700 space-y-1"
                                        data-oid="yv53tvr"
                                    >
                                        {sideEffects.map((effect, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start"
                                                data-oid="jqku42_"
                                            >
                                                <span className="mr-2 mt-0.5" data-oid="sqogo5t">
                                                    •
                                                </span>
                                                {effect}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-yellow-600 mt-2" data-oid="c-l_ji7">
                                        Contact your doctor if you experience any severe or
                                        persistent side effects.
                                    </p>
                                </div>
                            )}

                            {/* Contraindications */}
                            {contraindications.length > 0 && (
                                <div
                                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                                    data-oid="q9mu2do"
                                >
                                    <h5
                                        className="font-medium text-red-800 mb-2 flex items-center"
                                        data-oid="cyp9q64"
                                    >
                                        <span className="mr-2" data-oid="u..amyp">
                                            🚫
                                        </span>
                                        Do Not Use If
                                    </h5>
                                    <ul
                                        className="text-sm text-red-700 space-y-1"
                                        data-oid="e_6-kpc"
                                    >
                                        {contraindications.map((contraindication, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start"
                                                data-oid="aalwyl8"
                                            >
                                                <span className="mr-2 mt-0.5" data-oid="lllgb5s">
                                                    •
                                                </span>
                                                {contraindication}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Storage Tab */}
                    {activeTab === 'storage' && storageInstructions && (
                        <div
                            className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                            data-oid="wd58zal"
                        >
                            <h5
                                className="font-medium text-purple-800 mb-2 flex items-center"
                                data-oid="hy:91b1"
                            >
                                <span className="mr-2" data-oid="79x.emh">
                                    🏠
                                </span>
                                Storage Instructions
                            </h5>
                            <div className="text-sm text-purple-700" data-oid="jd00o_k">
                                {formatInstructions(storageInstructions)}
                            </div>
                        </div>
                    )}

                    {/* Footer Disclaimer */}
                    <div className="mt-6 pt-4 border-t border-gray-200" data-oid="hchksav">
                        <p className="text-xs text-gray-500 text-center" data-oid="x.w5lju">
                            This information is for reference only. Always follow your doctor{"'"}s
                            instructions and consult with your pharmacist if you have any questions
                            about your medication.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
