'use client';

import React from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import SelectionSummary from './SelectionSummary';
import CompactSelectionSummary from './CompactSelectionSummary';

interface SelectionSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    prescriptionId: string;
    onProceedToCheckout?: () => void;
    compact?: boolean;
}

export default function SelectionSummaryModal({
    isOpen,
    onClose,
    prescriptionId,
    onProceedToCheckout,
    compact = false,
}: SelectionSummaryModalProps) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            data-oid="_rhcoh_"
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                data-oid="a7hitl0"
            >
                {/* Modal Header */}
                <div
                    className="flex items-center justify-between p-6 border-b border-gray-200"
                    data-oid="xqcj73h"
                >
                    <h2 className="text-xl font-semibold text-gray-900" data-oid="53n6xn-">
                        Selection Summary
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        data-oid="-yztph0"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="2-23ly8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                                data-oid="fhhwd4z"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6" data-oid="2wv91l0">
                    {compact ? (
                        <CompactSelectionSummary
                            showPricing={true}
                            showProgress={true}
                            data-oid="8eyex:n"
                        />
                    ) : (
                        <SelectionSummary
                            showEditOptions={false}
                            showDeliveryInfo={true}
                            showValidationMessages={true}
                            compact={false}
                            onProceedToCheckout={onProceedToCheckout}
                            className="border-0 shadow-none"
                            data-oid="48qby4r"
                        />
                    )}
                </div>

                {/* Modal Footer */}
                <div
                    className="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
                    data-oid="5mqhu_w"
                >
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        data-oid="_um9dwo"
                    >
                        Close
                    </button>
                    {onProceedToCheckout && (
                        <button
                            onClick={() => {
                                onProceedToCheckout();
                                onClose();
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-lg hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                            data-oid="9wbx.cu"
                        >
                            Proceed to Checkout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
