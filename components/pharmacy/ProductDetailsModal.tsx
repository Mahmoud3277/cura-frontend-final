'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Product {
    id: number;
    name: string;
    nameAr: string;
    category: string;
    manufacturer: string;
    description: string;
    activeIngredient: string;
    dosage: string;
    form: string;
    prescriptionRequired: boolean;
    price: number;
    stock?: number;
    expiryDate?: string;
    batchNumber?: string;
    location?: string;
    minStockThreshold?: number;
    supplier?: string;
    notes?: string;
    isInInventory?: boolean;
    sku?: string;
}

interface ProductDetailsModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
    if (!product) return null;

    const getStockStatus = (product: Product): string => {
        if (!product.stock || product.stock === 0) return 'out';
        if (product.stock <= (product.minStockThreshold || 10)) return 'low';
        if (product.stock <= (product.minStockThreshold || 10) * 2) return 'medium';
        return 'high';
    };

    const getStockBadgeColor = (status: string) => {
        switch (status) {
            case 'high':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'low':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            case 'out':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    const stockStatus = getStockStatus(product);

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="c_:m6j4">
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-oid="120cxlu">
                <DialogHeader data-oid="ecjd5wl">
                    <DialogTitle className="flex items-center gap-3" data-oid="w1w9d-1">
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                            data-oid="y:5dtd_"
                        >
                            <span className="text-blue-600 text-lg" data-oid="_:ort2a">
                                💊
                            </span>
                        </div>
                        <div data-oid="6.u01kv">
                            <div className="text-xl font-bold text-gray-900" data-oid="ahtpjmd">
                                {product.name}
                            </div>
                            <div className="text-sm text-gray-500 font-normal" data-oid="imjwhbl">
                                {product.nameAr}
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6" data-oid="x:h-hsl">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="qyjpi2w">
                        <div className="space-y-3" data-oid="b7:3_.o">
                            <div data-oid=":gef4sf">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="jmxuz_i"
                                >
                                    SKU
                                </label>
                                <div className="mt-1" data-oid="wb0p5p2">
                                    <code
                                        className="text-sm bg-gray-100 px-2 py-1 rounded font-mono"
                                        data-oid="c4rd274"
                                    >
                                        {product.sku}
                                    </code>
                                </div>
                            </div>

                            <div data-oid="89_vhnx">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="e-ytd5t"
                                >
                                    Category
                                </label>
                                <div className="mt-1" data-oid="53i7iwm">
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700"
                                        data-oid="k8tpq4v"
                                    >
                                        {product.category.replace('-', ' ')}
                                    </Badge>
                                </div>
                            </div>

                            <div data-oid="gf8e6_:">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="7-u4hg9"
                                >
                                    Manufacturer
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="iw_wjzh">
                                    {product.manufacturer}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3" data-oid="k7-2e.x">
                            <div data-oid="w1wpro_">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="stk.tkf"
                                >
                                    Price
                                </label>
                                <div
                                    className="mt-1 text-lg font-semibold text-green-600"
                                    data-oid="nqgp1yg"
                                >
                                    EGP {product.price.toFixed(2)}
                                </div>
                            </div>

                            <div data-oid="qut0bio">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="8bhu3-j"
                                >
                                    Stock Status
                                </label>
                                <div className="mt-1 flex items-center gap-2" data-oid="009ba26">
                                    <span
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="ylw4g82"
                                    >
                                        {product.stock}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={getStockBadgeColor(stockStatus)}
                                        data-oid="9ejwdqn"
                                    >
                                        {stockStatus.charAt(0).toUpperCase() + stockStatus.slice(1)}{' '}
                                        Stock
                                    </Badge>
                                </div>
                            </div>

                            <div data-oid="ifam2nq">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="jfre1zz"
                                >
                                    Location
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="y7z2sw8">
                                    {product.location || 'Not specified'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator data-oid="hy2ip01" />

                    {/* Medical Information */}
                    <div data-oid="tf93_z7">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3" data-oid="k1f3n_u">
                            Medical Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="ung7h_p">
                            <div data-oid="3f-qm4n">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="lpqzpe7"
                                >
                                    Active Ingredient
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="dl8s4l1">
                                    {product.activeIngredient}
                                </div>
                            </div>

                            <div data-oid="340z01.">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="e6e4iq3"
                                >
                                    Dosage
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="hw3eefx">
                                    {product.dosage}
                                </div>
                            </div>

                            <div data-oid="e9f5yh8">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="d_r.eh3"
                                >
                                    Form
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="2i3seim">
                                    {product.form}
                                </div>
                            </div>

                            <div data-oid="xr9lod_">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="t-v.:6z"
                                >
                                    Prescription Required
                                </label>
                                <div className="mt-1" data-oid=":1wis4j">
                                    {product.prescriptionRequired ? (
                                        <Badge
                                            variant="outline"
                                            className="bg-red-50 text-red-700"
                                            data-oid="06w6pvh"
                                        >
                                            Prescription Required
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700"
                                            data-oid="_fg:0u4"
                                        >
                                            Over the Counter
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {product.description && (
                            <div className="mt-4" data-oid="x:dcy6.">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="329v7lh"
                                >
                                    Description
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid=".7ytj.s">
                                    {product.description}
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator data-oid="7pc4bm9" />

                    {/* Inventory Details */}
                    <div data-oid="iob0uab">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3" data-oid="vbee3o_">
                            Inventory Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="x8ugvo9">
                            <div data-oid="j9r-g0g">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="94a94j5"
                                >
                                    Batch Number
                                </label>
                                <div className="mt-1" data-oid="qvm-.wx">
                                    <code
                                        className="text-sm bg-gray-100 px-2 py-1 rounded font-mono"
                                        data-oid="w9:o7kq"
                                    >
                                        {product.batchNumber || 'Not specified'}
                                    </code>
                                </div>
                            </div>

                            <div data-oid=".y7wen1">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="dsjg:24"
                                >
                                    Expiry Date
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="wh.vlyn">
                                    {product.expiryDate
                                        ? new Date(product.expiryDate).toLocaleDateString()
                                        : 'Not specified'}
                                </div>
                            </div>

                            <div data-oid="p9u5y.g">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="p_fw82t"
                                >
                                    Supplier
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="6.2thr2">
                                    {product.supplier || 'Not specified'}
                                </div>
                            </div>

                            <div data-oid=":2ermin">
                                <label
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="pbuvde."
                                >
                                    Min Stock Threshold
                                </label>
                                <div className="mt-1 text-sm text-gray-900" data-oid="3fo1via">
                                    {product.minStockThreshold || 'Not set'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Level Indicator */}
                    <div className="bg-gray-50 rounded-lg p-4" data-oid="mhrtbd4">
                        <div className="flex items-center justify-between mb-2" data-oid="jzfoxyn">
                            <span className="text-sm font-medium text-gray-700" data-oid="u_y18nv">
                                Stock Level
                            </span>
                            <span className="text-sm text-gray-500" data-oid="mvjifxw">
                                {product.stock} / {(product.minStockThreshold || 10) * 3} units
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2" data-oid="ar6vgnu">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    stockStatus === 'high'
                                        ? 'bg-green-500'
                                        : stockStatus === 'medium'
                                          ? 'bg-yellow-500'
                                          : stockStatus === 'low'
                                            ? 'bg-orange-500'
                                            : 'bg-red-500'
                                }`}
                                style={{
                                    width: `${Math.min(100, ((product.stock || 0) / ((product.minStockThreshold || 10) * 3)) * 100)}%`,
                                }}
                                data-oid="3ezx.3p"
                            ></div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
