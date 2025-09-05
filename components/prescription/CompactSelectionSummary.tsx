'use client';

import React from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useMedicineSelection } from '@/lib/contexts/MedicineSelectionContext';

interface CompactSelectionSummaryProps {
    showPricing?: boolean;
    showProgress?: boolean;
    className?: string;
}

export default function CompactSelectionSummary({
    showPricing = true,
    showProgress = true,
    className = '',
}: CompactSelectionSummaryProps) {
    const { t } = useTranslation();
    const { state, actions } = useMedicineSelection();

    const summary = actions.getSelectionSummary();

    if (Object.keys(state.selections).length === 0) {
        return (
            <div className={`bg-gray-50 rounded-lg p-4 ${className}`} data-oid="wki30g2">
                <div className="text-center text-gray-500" data-oid="434d20r">
                    <div
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2"
                        data-oid="d8ovo8t"
                    >
                        <span className="text-sm" data-oid="jtn_uvm">
                            📋
                        </span>
                    </div>
                    <p className="text-sm" data-oid="7hcrvmw">
                        No selections yet
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${className}`}
            data-oid="6q7hu93"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3" data-oid=":82_84-">
                <h4 className="text-md font-semibold text-gray-900" data-oid="cxxq6m6">
                    Medicine Selection
                </h4>
                <span className="text-xs text-gray-500" data-oid="3ii0tpc">
                    {summary.completedSelections}/{summary.totalSelections}
                </span>
            </div>

            {/* Progress Bar */}
            {showProgress && (
                <div className="mb-3" data-oid="7c4lspk">
                    <div className="w-full bg-gray-200 rounded-full h-1.5" data-oid=":c-ugbf">
                        <div
                            className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-1.5 rounded-full transition-all duration-300"
                            style={{
                                width: `${(summary.completedSelections / summary.totalSelections) * 100}%`,
                            }}
                            data-oid="7xl-go5"
                        />
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3" data-oid="d2j.ag-">
                <div className="text-center p-2 bg-gray-50 rounded" data-oid="swq1mlf">
                    <div className="text-lg font-bold text-gray-900" data-oid="90s4flz">
                        {summary.totalSelections}
                    </div>
                    <div className="text-xs text-gray-600" data-oid="730l0ha">
                        Medicines
                    </div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded" data-oid="rzbwm0w">
                    <div className="text-lg font-bold text-green-600" data-oid="zg94755">
                        {summary.completedSelections}
                    </div>
                    <div className="text-xs text-gray-600" data-oid="83axc-p">
                        Selected
                    </div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded" data-oid="qvqyp_w">
                    <div className="text-lg font-bold text-blue-600" data-oid="jgcve.6">
                        {summary.pharmaciesInvolved.length}
                    </div>
                    <div className="text-xs text-gray-600" data-oid="xnueqfd">
                        Pharmacies
                    </div>
                </div>
            </div>

            {/* Validation Status */}
            {summary.validationErrors.length > 0 && (
                <div
                    className="mb-3 p-2 bg-red-50 border border-red-200 rounded"
                    data-oid="4i-di9h"
                >
                    <div className="flex items-center gap-1" data-oid="q6:ahvr">
                        <span className="text-red-500 text-sm" data-oid="imy5q1g">
                            ⚠
                        </span>
                        <span className="text-xs text-red-700 font-medium" data-oid="._om53n">
                            {summary.validationErrors.length} issue
                            {summary.validationErrors.length !== 1 ? 's' : ''} to resolve
                        </span>
                    </div>
                </div>
            )}

            {summary.validationWarnings.length > 0 && (
                <div
                    className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded"
                    data-oid="7l:h10y"
                >
                    <div className="flex items-center gap-1" data-oid="mc2-fsj">
                        <span className="text-yellow-500 text-sm" data-oid="l_.5hh5">
                            ⚠
                        </span>
                        <span className="text-xs text-yellow-700 font-medium" data-oid="33l_hhn">
                            {summary.validationWarnings.length} warning
                            {summary.validationWarnings.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            )}

            {/* Pricing Summary */}
            {showPricing && summary.completedSelections > 0 && (
                <div className="space-y-1 pt-2 border-t border-gray-200" data-oid="15cx_sm">
                    <div className="flex justify-between text-xs" data-oid="1h_z6jf">
                        <span className="text-gray-600" data-oid="nd77p2g">
                            Medicines:
                        </span>
                        <span className="text-gray-900" data-oid="3j9jo-4">
                            {summary.totalPrice.toFixed(2)} EGP
                        </span>
                    </div>
                    <div className="flex justify-between text-xs" data-oid=":_8q:mk">
                        <span className="text-gray-600" data-oid="3:ahrao">
                            Delivery:
                        </span>
                        <span className="text-gray-900" data-oid="j6r-rng">
                            {summary.totalDeliveryFees.toFixed(2)} EGP
                        </span>
                    </div>
                    <div
                        className="flex justify-between text-sm font-semibold border-t pt-1"
                        data-oid="t_wg8o-"
                    >
                        <span className="text-gray-900" data-oid="-z6lwd6">
                            Total:
                        </span>
                        <span className="text-[#1F1F6F]" data-oid="ml3ygwm">
                            {summary.grandTotal.toFixed(2)} EGP
                        </span>
                    </div>
                </div>
            )}

            {/* Delivery Time */}
            {summary.estimatedDeliveryTime && (
                <div className="mt-2 pt-2 border-t border-gray-200" data-oid="dsdl.ke">
                    <div className="flex items-center justify-between text-xs" data-oid="zl8057a">
                        <span className="text-gray-600" data-oid="8xnssjv">
                            Estimated delivery:
                        </span>
                        <span className="text-gray-900 font-medium" data-oid="813l5:1">
                            {summary.estimatedDeliveryTime}
                        </span>
                    </div>
                </div>
            )}

            {/* Completion Status */}
            <div className="mt-3 pt-2 border-t border-gray-200" data-oid=".j4xe7-">
                {summary.isComplete ? (
                    <div className="flex items-center gap-2 text-green-600" data-oid="vn692o-">
                        <span className="text-sm" data-oid="yuntk4p">
                            ✓
                        </span>
                        <span className="text-xs font-medium" data-oid="9jqmh_o">
                            Ready for checkout
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500" data-oid="917rfiy">
                        <span className="text-sm" data-oid="8p.rv5y">
                            ⏳
                        </span>
                        <span className="text-xs" data-oid="c6ogp8d">
                            {summary.incompleteSelections} medicine
                            {summary.incompleteSelections !== 1 ? 's' : ''} pending
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
