'use client';

import React from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import {
    useMedicineSelection,
    MedicineSelectionUtils,
} from '@/lib/contexts/MedicineSelectionContext';

interface SelectionSummaryProps {
    showEditOptions?: boolean;
    showDeliveryInfo?: boolean;
    showValidationMessages?: boolean;
    compact?: boolean;
    onEditSelection?: (medicineId: string) => void;
    onClearAll?: () => void;
    onProceedToCheckout?: () => void;
    className?: string;
}

export default function SelectionSummary({
    showEditOptions = true,
    showDeliveryInfo = true,
    showValidationMessages = true,
    compact = false,
    onEditSelection,
    onClearAll,
    onProceedToCheckout,
    className = '',
}: SelectionSummaryProps) {
    const { t } = useTranslation();
    const { state, actions } = useMedicineSelection();

    const summary = actions.getSelectionSummary();
    const completedSelections = actions.getCompletedSelections();
    const incompleteSelections = actions.getIncompleteSelections();
    const canProceed = actions.canProceedToCheckout();

    // Calculate delivery fees by pharmacy
    const deliveryFeesByPharmacy = MedicineSelectionUtils.calculateDeliveryFeesByPharmacy(
        state.selections,
    );

    // Get selection statistics
    const stats = MedicineSelectionUtils.getSelectionStats(state.selections);

    if (Object.keys(state.selections).length === 0) {
        return (
            <div
                className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}
                data-oid="8z3i8ss"
            >
                <div className="text-center py-8 text-gray-500" data-oid="7kwll22">
                    <div
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        data-oid="cf-o.fd"
                    >
                        <span className="text-2xl" data-oid="wrwdkmi">
                            📋
                        </span>
                    </div>
                    <p className="text-lg font-medium" data-oid="1p1ib4l">
                        No Medicine Selections
                    </p>
                    <p className="text-sm" data-oid="mkb0985">
                        Start selecting medicines to see your summary here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
            data-oid="yz.50dl"
        >
            {/* Header */}
            <div
                className="bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 px-6 py-4 border-b border-gray-100"
                data-oid=":sx4y:i"
            >
                <div className="flex items-center justify-between" data-oid="q2.27qi">
                    <h3 className="text-lg font-semibold text-gray-900" data-oid=":rakbtx">
                        {t('prescription.medicineSelection.summary.title')}
                    </h3>
                    <div className="flex items-center gap-2" data-oid="g_snrox">
                        <span className="text-sm text-gray-600" data-oid="5pi2y69">
                            {summary.completedSelections} of {summary.totalSelections} completed
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2" data-oid="xakepmg">
                            <div
                                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${(summary.completedSelections / summary.totalSelections) * 100}%`,
                                }}
                                data-oid="rbm0:g."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6" data-oid="n5--ax6">
                {/* Validation Messages */}
                {showValidationMessages && (
                    <>
                        {summary.validationErrors.length > 0 && (
                            <div
                                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                                data-oid="zc4sxf4"
                            >
                                <div className="flex items-start gap-2" data-oid="yil:d83">
                                    <span className="text-red-500 mt-0.5" data-oid="mbjn26w">
                                        ⚠
                                    </span>
                                    <div className="flex-1" data-oid="q8w82_7">
                                        <h4
                                            className="text-sm font-medium text-red-800 mb-2"
                                            data-oid="8mt753."
                                        >
                                            Issues to resolve:
                                        </h4>
                                        <ul
                                            className="text-sm text-red-700 space-y-1"
                                            data-oid="qwe7wig"
                                        >
                                            {summary.validationErrors.map((error, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                    data-oid="ir.mkf:"
                                                >
                                                    <span
                                                        className="text-red-500 mt-0.5"
                                                        data-oid="luxwejh"
                                                    >
                                                        •
                                                    </span>
                                                    {error}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {summary.validationWarnings.length > 0 && (
                            <div
                                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                                data-oid="tjjbb8y"
                            >
                                <div className="flex items-start gap-2" data-oid="6i8yvaj">
                                    <span className="text-yellow-500 mt-0.5" data-oid="hp0mg-v">
                                        ⚠
                                    </span>
                                    <div className="flex-1" data-oid="34xlagq">
                                        <h4
                                            className="text-sm font-medium text-yellow-800 mb-2"
                                            data-oid="v.:pc-p"
                                        >
                                            Warnings:
                                        </h4>
                                        <ul
                                            className="text-sm text-yellow-700 space-y-1"
                                            data-oid="vvxjonp"
                                        >
                                            {summary.validationWarnings.map((warning, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                    data-oid="1n7p_t9"
                                                >
                                                    <span
                                                        className="text-yellow-500 mt-0.5"
                                                        data-oid="vedgg9."
                                                    >
                                                        ⚠
                                                    </span>
                                                    {warning}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Summary Statistics */}
                {!compact && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-oid="a:3-nj9">
                        <div className="text-center p-3 bg-gray-50 rounded-lg" data-oid="6r:ovfo">
                            <div className="text-2xl font-bold text-gray-900" data-oid="7wpny8i">
                                {stats.total}
                            </div>
                            <div className="text-sm text-gray-600" data-oid="prv8a7y">
                                Total Medicines
                            </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg" data-oid=":wz0qlh">
                            <div className="text-2xl font-bold text-green-600" data-oid="iq32it:">
                                {stats.completed}
                            </div>
                            <div className="text-sm text-gray-600" data-oid="kshnlu6">
                                Completed
                            </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg" data-oid="nup60ou">
                            <div className="text-2xl font-bold text-blue-600" data-oid="--4zv7t">
                                {summary.pharmaciesInvolved.length}
                            </div>
                            <div className="text-sm text-gray-600" data-oid="ffy65ml">
                                Pharmacies
                            </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg" data-oid="0hotzf7">
                            <div className="text-2xl font-bold text-purple-600" data-oid="1nwbtu5">
                                {stats.completionPercentage.toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-600" data-oid="2s0l64:">
                                Complete
                            </div>
                        </div>
                    </div>
                )}

                {/* Selected Items Overview */}
                <div className="space-y-3" data-oid="w1bchgn">
                    <h4 className="text-md font-semibold text-gray-900" data-oid="dfobso:">
                        Selected Medicines
                    </h4>

                    {completedSelections.length > 0 ? (
                        <div className="space-y-2" data-oid="tyi7c6g">
                            {completedSelections.map((selection) => (
                                <div
                                    key={selection.medicineId}
                                    className="flex items-center justify-between py-3 px-4 bg-green-50 border border-green-200 rounded-lg"
                                    data-oid="p52y46z"
                                >
                                    <div className="flex-1" data-oid="b3hl54s">
                                        <div className="flex items-center gap-2" data-oid="zhrgct1">
                                            <span
                                                className="font-medium text-gray-900"
                                                data-oid="1wpyq:k"
                                            >
                                                {selection.selectedMedicine.name}
                                            </span>
                                            {selection.selectedAlternative && (
                                                <span
                                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                                    data-oid="03hihj8"
                                                >
                                                    Alternative
                                                </span>
                                            )}
                                            <span className="text-green-500" data-oid="4jobtgu">
                                                ✓
                                            </span>
                                        </div>
                                        <div
                                            className="text-sm text-gray-600 mt-1"
                                            data-oid="011y0jw"
                                        >
                                            Quantity: {selection.selectedQuantity}{' '}
                                            {selection.selectedMedicine.unit}
                                            {selection.selectedPharmacy && (
                                                <span className="ml-2" data-oid="su2c77u">
                                                    • {selection.selectedPharmacy.pharmacyName}
                                                </span>
                                            )}
                                            {selection.notes && (
                                                <span
                                                    className="ml-2 text-blue-600"
                                                    data-oid="j3685r_"
                                                >
                                                    • Has notes
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3" data-oid="9kuw_63">
                                        <div className="text-right" data-oid="hjy7es7">
                                            {selection.selectedPharmacy && (
                                                <span
                                                    className="font-semibold text-gray-900"
                                                    data-oid="ng.2ujx"
                                                >
                                                    {(
                                                        selection.selectedPharmacy.stockInfo.price *
                                                        selection.selectedQuantity
                                                    ).toFixed(2)}{' '}
                                                    EGP
                                                </span>
                                            )}
                                        </div>
                                        {showEditOptions && onEditSelection && (
                                            <button
                                                onClick={() =>
                                                    onEditSelection(selection.medicineId)
                                                }
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                data-oid=":vytrmi"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500" data-oid="o528r72">
                            <p className="text-sm" data-oid="vdf0z:.">
                                No medicines selected yet
                            </p>
                        </div>
                    )}

                    {/* Incomplete Selections */}
                    {incompleteSelections.length > 0 && (
                        <div className="space-y-2" data-oid="vwt43n.">
                            <h5 className="text-sm font-medium text-gray-700" data-oid="mmxovsn">
                                Pending Selections
                            </h5>
                            {incompleteSelections.map((selection) => (
                                <div
                                    key={selection.medicineId}
                                    className="flex items-center justify-between py-3 px-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                                    data-oid="pn4d.2t"
                                >
                                    <div className="flex-1" data-oid="lypuq--">
                                        <div className="flex items-center gap-2" data-oid=".n9:dtw">
                                            <span
                                                className="font-medium text-gray-900"
                                                data-oid="s05s-00"
                                            >
                                                {selection.selectedMedicine.name}
                                            </span>
                                            <span className="text-yellow-500" data-oid="8y:5g13">
                                                ⚠
                                            </span>
                                        </div>
                                        <div
                                            className="text-sm text-gray-600 mt-1"
                                            data-oid="bpsu3b1"
                                        >
                                            {selection.validationErrors.join(', ')}
                                        </div>
                                    </div>
                                    {showEditOptions && onEditSelection && (
                                        <button
                                            onClick={() => onEditSelection(selection.medicineId)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            data-oid="17u.b5l"
                                        >
                                            Complete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Delivery Information Summary */}
                {showDeliveryInfo && summary.pharmaciesInvolved.length > 0 && (
                    <div className="space-y-3" data-oid="wyo5sw5">
                        <h4 className="text-md font-semibold text-gray-900" data-oid="vyfqbbd">
                            Delivery Information
                        </h4>

                        {/* Pharmacy Breakdown */}
                        <div className="space-y-2" data-oid="s2ddrpv">
                            {Object.entries(deliveryFeesByPharmacy).map(([pharmacyId, info]) => (
                                <div
                                    key={pharmacyId}
                                    className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg"
                                    data-oid="x__qg41"
                                >
                                    <div data-oid="5sewox8">
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid="8d0cl.9"
                                        >
                                            {info.pharmacyName}
                                        </span>
                                        <span
                                            className="text-sm text-gray-600 ml-2"
                                            data-oid="ogj-fif"
                                        >
                                            ({info.itemCount} item{info.itemCount !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                    <span
                                        className="text-sm font-medium text-gray-900"
                                        data-oid="bw7lq13"
                                    >
                                        {info.fee.toFixed(2)} EGP delivery
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Estimated Delivery Time */}
                        {summary.estimatedDeliveryTime && (
                            <div
                                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                                data-oid="31nkdlz"
                            >
                                <span
                                    className="text-sm font-medium text-gray-700"
                                    data-oid="_qkbqve"
                                >
                                    Estimated Delivery Time:
                                </span>
                                <span
                                    className="text-sm font-semibold text-gray-900"
                                    data-oid="vkqjuik"
                                >
                                    {summary.estimatedDeliveryTime}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Pricing Breakdown */}
                <div className="space-y-3" data-oid="p92fgak">
                    <h4 className="text-md font-semibold text-gray-900" data-oid="q-d:0m_">
                        Price Breakdown
                    </h4>
                    <div className="space-y-2" data-oid="tap9nt_">
                        <div className="flex justify-between text-sm" data-oid="s-jzz65">
                            <span data-oid=":45112.">Medicines Total:</span>
                            <span data-oid="164jh02">{summary.totalPrice.toFixed(2)} EGP</span>
                        </div>
                        <div className="flex justify-between text-sm" data-oid="3zb8ywv">
                            <span data-oid="c8m90m9">
                                Delivery Fees ({summary.pharmaciesInvolved.length} pharmacy/ies):
                            </span>
                            <span data-oid="wt.rr19">
                                {summary.totalDeliveryFees.toFixed(2)} EGP
                            </span>
                        </div>
                        <div
                            className="flex justify-between text-lg font-semibold border-t pt-2"
                            data-oid="c.9s9b8"
                        >
                            <span data-oid="hrqhps_">Grand Total:</span>
                            <span className="text-[#1F1F6F]" data-oid="ltxe8s5">
                                {summary.grandTotal.toFixed(2)} EGP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {showEditOptions && (
                    <div
                        className="flex items-center justify-between pt-4 border-t border-gray-200"
                        data-oid="9s37_l-"
                    >
                        <div data-oid="r5l8zmb">
                            <p className="text-sm text-gray-600" data-oid="_jv2n-8">
                                {summary.completedSelections} of {summary.totalSelections} medicines
                                selected
                            </p>
                            {state.isDirty && (
                                <p className="text-xs text-orange-600 mt-1" data-oid="_ggrhet">
                                    ⚠ You have unsaved changes
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3" data-oid="jqasz2f">
                            {onClearAll && (
                                <button
                                    onClick={onClearAll}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    data-oid="f.ljnm9"
                                >
                                    Clear All
                                </button>
                            )}
                            {onProceedToCheckout && (
                                <button
                                    onClick={onProceedToCheckout}
                                    disabled={!canProceed}
                                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                        canProceed
                                            ? 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white hover:from-[#14274E] hover:to-[#394867]'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    data-oid="4h6cjht"
                                >
                                    {canProceed ? 'Proceed to Checkout' : 'Complete All Selections'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {!compact && (
                    <div className="pt-4 border-t border-gray-200" data-oid="i857zzz">
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600"
                            data-oid="h_bz9xk"
                        >
                            <div data-oid="y9c:::g">
                                <span className="font-medium" data-oid="1bpxu3c">
                                    With Alternatives:
                                </span>
                                <span className="ml-1" data-oid="-d2lfcn">
                                    {stats.withAlternatives}
                                </span>
                            </div>
                            <div data-oid="k_cyx55">
                                <span className="font-medium" data-oid=":_32sp6">
                                    With Notes:
                                </span>
                                <span className="ml-1" data-oid="-duxxa6">
                                    {stats.withNotes}
                                </span>
                            </div>
                            <div data-oid="d1.ia2u">
                                <span className="font-medium" data-oid="ihksi5s">
                                    Invalid Selections:
                                </span>
                                <span className="ml-1" data-oid="beu3dd1">
                                    {stats.invalid}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
