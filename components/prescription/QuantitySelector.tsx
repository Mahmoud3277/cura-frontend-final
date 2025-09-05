'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

// First QuantitySelector Component
export interface QuantitySelectorProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    prescribedQuantity?: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showPrescribedIndicator?: boolean;
    showMaxIndicator?: boolean;
}

export default function QuantitySelector({
    value,
    min = 1,
    max = 999,
    step = 1,
    unit = 'units',
    prescribedQuantity,
    onChange,
    disabled = false,
    size = 'md',
    showPrescribedIndicator = true,
    showMaxIndicator = true,
}: QuantitySelectorProps) {
    const handleIncrement = () => {
        if (disabled || value >= max) return;
        onChange(Math.min(value + step, max));
    };

    const handleDecrement = () => {
        if (disabled || value <= min) return;
        onChange(Math.max(value - step, min));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        const newValue = parseInt(e.target.value) || min;
        const clampedValue = Math.max(min, Math.min(newValue, max));
        onChange(clampedValue);
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    button: 'px-2 py-1 text-sm',
                    input: 'w-12 px-1 py-1 text-sm',
                    text: 'text-xs',
                };
            case 'lg':
                return {
                    button: 'px-4 py-3 text-lg',
                    input: 'w-20 px-3 py-3 text-lg',
                    text: 'text-sm',
                };
            default:
                return {
                    button: 'px-3 py-2',
                    input: 'w-16 px-2 py-2',
                    text: 'text-sm',
                };
        }
    };

    const sizeClasses = getSizeClasses();
    const isModified = prescribedQuantity && value !== prescribedQuantity;
    const isAtMax = value >= max;
    const isAtMin = value <= min;

    return (
        <div className="space-y-2" data-oid="zhqhy.v">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2" data-oid="utgyawu">
                <div
                    className="flex items-center border border-gray-300 rounded-md bg-white"
                    data-oid="ayj7zuv"
                >
                    <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={disabled || isAtMin}
                        className={`${sizeClasses.button} text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-gray-300`}
                        aria-label="Decrease quantity"
                        data-oid="dh67kx4"
                    >
                        −
                    </button>

                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className={`${sizeClasses.input} text-center border-0 focus:ring-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500`}
                        aria-label="Quantity"
                        data-oid="cx8up73"
                    />

                    <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={disabled || isAtMax}
                        className={`${sizeClasses.button} text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-l border-gray-300`}
                        aria-label="Increase quantity"
                        data-oid="k6d4fth"
                    >
                        +
                    </button>
                </div>

                {/* Unit Display */}
                <span
                    className={`${sizeClasses.text} text-gray-600 font-medium`}
                    data-oid="j005jm2"
                >
                    {unit}
                </span>

                {/* Status Indicators */}
                <div className="flex items-center gap-2" data-oid="6gcozdk">
                    {isModified && showPrescribedIndicator && (
                        <span
                            className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full flex items-center gap-1"
                            data-oid="hmefdqb"
                        >
                            <span data-oid="byorxzt">⚠️</span>
                            <span data-oid="si4rdi6">Modified</span>
                        </span>
                    )}

                    {isAtMax && showMaxIndicator && max < 999 && (
                        <span
                            className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1"
                            data-oid="y:zbsxb"
                        >
                            <span data-oid="_wu3qlf">🚫</span>
                            <span data-oid="zc7ajp:">Max reached</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Additional Information */}
            <div
                className="flex items-center justify-between text-xs text-gray-500"
                data-oid=".uvys5u"
            >
                <div className="flex items-center gap-4" data-oid="7ic6ta3">
                    {prescribedQuantity && showPrescribedIndicator && (
                        <span data-oid="3igkzpd">
                            📋 Prescribed: {prescribedQuantity} {unit}
                        </span>
                    )}

                    {max < 999 && showMaxIndicator && (
                        <span data-oid="vaxh-2h">
                            📦 Available: {max} {unit}
                        </span>
                    )}
                </div>

                {/* Quick Set Buttons */}
                {prescribedQuantity && value !== prescribedQuantity && (
                    <button
                        type="button"
                        onClick={() => onChange(prescribedQuantity)}
                        disabled={disabled}
                        className="text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="f9-qqp9"
                    >
                        Reset to prescribed
                    </button>
                )}
            </div>

            {/* Validation Messages */}
            {value > max && (
                <div
                    className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200"
                    data-oid="sqhcyyh"
                >
                    ⚠️ Quantity exceeds available stock ({max} {unit})
                </div>
            )}

            {value < min && (
                <div
                    className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200"
                    data-oid="wzvqfh9"
                >
                    ⚠️ Minimum quantity is {min} {unit}
                </div>
            )}

            {isModified &&
                prescribedQuantity &&
                Math.abs(value - prescribedQuantity) > prescribedQuantity * 0.5 && (
                    <div
                        className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200"
                        data-oid="dzzbh1i"
                    >
                        ⚠️ Quantity significantly different from prescribed amount. Please consult
                        your doctor if needed.
                    </div>
                )}
        </div>
    );
}

// Preset quantity buttons component
export function QuantityPresets({
    currentValue,
    prescribedQuantity,
    maxQuantity,
    unit = 'units',
    onChange,
    disabled = false,
}: {
    currentValue: number;
    prescribedQuantity?: number;
    maxQuantity: number;
    unit?: string;
    onChange: (value: number) => void;
    disabled?: boolean;
}) {
    const presets = [
        ...(prescribedQuantity ? [{ label: 'Prescribed', value: prescribedQuantity }] : []),
        { label: '1 Week', value: Math.min(7, maxQuantity) },
        { label: '2 Weeks', value: Math.min(14, maxQuantity) },
        { label: '1 Month', value: Math.min(30, maxQuantity) },
        { label: 'Max', value: maxQuantity },
    ].filter(
        (preset, index, arr) =>
            // Remove duplicates and invalid presets
            preset.value <= maxQuantity && arr.findIndex((p) => p.value === preset.value) === index,
    );

    if (presets.length <= 1) return null;

    return (
        <div className="space-y-2" data-oid="j6kyha8">
            <label className="text-xs font-medium text-gray-700" data-oid="2y-egiz">
                Quick Select:
            </label>
            <div className="flex flex-wrap gap-2" data-oid="8ne3v28">
                {presets.map((preset) => (
                    <button
                        key={preset.label}
                        type="button"
                        onClick={() => onChange(preset.value)}
                        disabled={disabled}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            currentValue === preset.value
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        data-oid="95c0a3b"
                    >
                        {preset.label}
                        {preset.value !== currentValue && (
                            <span className="ml-1 text-gray-500" data-oid="3szfrd8">
                                ({preset.value})
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Second QuantitySelector Component (renamed to avoid conflict)
interface PrescriptionQuantitySelectorProps {
    prescribedQuantity: number;
    selectedQuantity: number;
    onQuantityChange: (quantity: number) => void;
    minQuantity?: number;
    maxQuantity?: number;
    unit?: string;
    showPrescribedInfo?: boolean;
    disabled?: boolean;
}

export function PrescriptionQuantitySelector({
    prescribedQuantity,
    selectedQuantity,
    onQuantityChange,
    minQuantity = 1,
    maxQuantity = 999,
    unit = 'units',
    showPrescribedInfo = true,
    disabled = false,
}: PrescriptionQuantitySelectorProps) {
    const [inputValue, setInputValue] = useState(selectedQuantity.toString());
    const { t } = useTranslation();

    const handleDecrease = () => {
        if (disabled) return;
        const newQuantity = Math.max(minQuantity, selectedQuantity - 1);
        onQuantityChange(newQuantity);
        setInputValue(newQuantity.toString());
    };

    const handleIncrease = () => {
        if (disabled) return;
        const newQuantity = Math.min(maxQuantity, selectedQuantity + 1);
        onQuantityChange(newQuantity);
        setInputValue(newQuantity.toString());
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        const numValue = parseInt(value) || minQuantity;
        const clampedValue = Math.max(minQuantity, Math.min(maxQuantity, numValue));
        onQuantityChange(clampedValue);
    };

    const handleInputBlur = () => {
        setInputValue(selectedQuantity.toString());
    };

    const getQuantityStatus = () => {
        if (selectedQuantity < prescribedQuantity) {
            return {
                type: 'warning',
                message: `Less than prescribed (${prescribedQuantity} ${unit})`,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
            };
        } else if (selectedQuantity > prescribedQuantity) {
            return {
                type: 'info',
                message: `More than prescribed (${prescribedQuantity} ${unit})`,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
            };
        } else {
            return {
                type: 'success',
                message: `Matches prescribed quantity`,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
            };
        }
    };

    const status = getQuantityStatus();

    return (
        <div className="space-y-3" data-oid="-do5zen">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3" data-oid="t49f2qm">
                <label className="text-sm font-medium text-gray-700" data-oid="4f0_ta6">
                    Quantity:
                </label>

                <div className="flex items-center space-x-2" data-oid="33bj71q">
                    {/* Decrease Button */}
                    <button
                        onClick={handleDecrease}
                        disabled={disabled || selectedQuantity <= minQuantity}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                            disabled || selectedQuantity <= minQuantity
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                        data-oid="tikgy10"
                    >
                        <span className="text-lg leading-none" data-oid="t2awxpt">
                            −
                        </span>
                    </button>

                    {/* Quantity Input */}
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={handleInputBlur}
                        disabled={disabled}
                        min={minQuantity}
                        max={maxQuantity}
                        className={`w-20 px-3 py-2 border rounded-lg text-center font-medium focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent transition-colors duration-200 ${
                            disabled
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 text-gray-900'
                        }`}
                        data-oid="28st2la"
                    />

                    {/* Increase Button */}
                    <button
                        onClick={handleIncrease}
                        disabled={disabled || selectedQuantity >= maxQuantity}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                            disabled || selectedQuantity >= maxQuantity
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                        data-oid="ifhm8x5"
                    >
                        <span className="text-lg leading-none" data-oid="7_j0:b3">
                            +
                        </span>
                    </button>

                    <span className="text-sm text-gray-600 ml-2" data-oid="o5opdla">
                        {unit}
                    </span>
                </div>
            </div>

            {/* Prescribed Quantity Info */}
            {showPrescribedInfo && (
                <div className="flex items-center justify-between text-sm" data-oid="4alxq8r">
                    <span className="text-gray-600" data-oid="c3fnsne">
                        Prescribed quantity: {prescribedQuantity} {unit}
                    </span>

                    {/* Quick Set Buttons */}
                    <div className="flex items-center space-x-2" data-oid="ejav.5f">
                        <button
                            onClick={() => {
                                onQuantityChange(prescribedQuantity);
                                setInputValue(prescribedQuantity.toString());
                            }}
                            disabled={disabled}
                            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                                selectedQuantity === prescribedQuantity
                                    ? 'bg-[#1F1F6F] text-white'
                                    : disabled
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            data-oid="7cs:wzh"
                        >
                            Use Prescribed
                        </button>

                        {prescribedQuantity * 2 <= maxQuantity && (
                            <button
                                onClick={() => {
                                    const doubleQuantity = prescribedQuantity * 2;
                                    onQuantityChange(doubleQuantity);
                                    setInputValue(doubleQuantity.toString());
                                }}
                                disabled={disabled}
                                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                                    selectedQuantity === prescribedQuantity * 2
                                        ? 'bg-[#1F1F6F] text-white'
                                        : disabled
                                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                data-oid="g126018"
                            >
                                Double (2x)
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Quantity Status */}
            <div
                className={`p-3 rounded-lg border ${status.bgColor} ${status.borderColor}`}
                data-oid="r.2ejg6"
            >
                <div className="flex items-center space-x-2" data-oid="i6_el8j">
                    <span className="text-lg" data-oid="ot73hx6">
                        {status.type === 'success' && '✅'}
                        {status.type === 'warning' && '⚠️'}
                        {status.type === 'info' && 'ℹ️'}
                    </span>
                    <span className={`text-sm font-medium ${status.color}`} data-oid="mrf_ykw">
                        {status.message}
                    </span>
                </div>

                {status.type === 'warning' && (
                    <p className="text-xs text-yellow-600 mt-1" data-oid="j1gxp:v">
                        Consider ordering the full prescribed amount for complete treatment.
                    </p>
                )}

                {status.type === 'info' && (
                    <p className="text-xs text-blue-600 mt-1" data-oid="fxtpx:t">
                        You{"'"}re ordering more than prescribed. Consult your doctor if needed.
                    </p>
                )}
            </div>

            {/* Range Indicator */}
            <div className="flex items-center space-x-2 text-xs text-gray-500" data-oid="m_pv32k">
                <span data-oid="l7zobng">Min: {minQuantity}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full relative" data-oid="ms_0_e9">
                    <div
                        className="h-1 bg-[#1F1F6F] rounded-full"
                        style={{
                            width: `${Math.min(100, (selectedQuantity / maxQuantity) * 100)}%`,
                        }}
                        data-oid="_7esx0e"
                    />

                    {/* Prescribed quantity marker */}
                    <div
                        className="absolute top-0 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2"
                        style={{
                            left: `${Math.min(100, (prescribedQuantity / maxQuantity) * 100)}%`,
                        }}
                        title={`Prescribed: ${prescribedQuantity}`}
                        data-oid="76vyqoy"
                    />
                </div>
                <span data-oid="k-5r7cs">Max: {maxQuantity}</span>
            </div>
        </div>
    );
}
