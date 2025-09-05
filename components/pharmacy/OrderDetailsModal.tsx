'use client';

import { useState } from 'react';
import { PharmacyOrder } from '@/lib/services/pharmacyOrderService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: PharmacyOrder | null;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    const [prescriptionZoomed, setPrescriptionZoomed] = useState(false);
    const [selectedImageZoom, setSelectedImageZoom] = useState<string | null>(null);

    if (!order) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'preparing':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ready':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'out-for-delivery':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const openImageZoom = (imageSrc: string) => {
        setSelectedImageZoom(imageSrc);
    };

    const closeImageZoom = () => {
        setSelectedImageZoom(null);
    };

    const openPrescriptionZoom = () => {
        setPrescriptionZoomed(true);
    };

    const closePrescriptionZoom = () => {
        setPrescriptionZoomed(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose} data-oid="cdb9511">
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto"
                    data-oid="bumeq8o"
                >
                    <DialogHeader data-oid="6_wopmo">
                        <DialogTitle
                            className="flex items-center justify-between"
                            data-oid="bjmiq4c"
                        >
                            <span className="text-xl font-bold" data-oid="_d_vsa4">
                                Order Details
                            </span>
                            <Badge
                                className={`${getStatusColor(order.status)} border`}
                                data-oid="l5ecpb_"
                            >
                                {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1).replace('-', ' ')}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6" data-oid="nza2uu0">
                        {/* Order Header */}
                        <div className="bg-gray-50 rounded-lg p-4" data-oid="6vx1s8-">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="pb6ga8c"
                            >
                                <div data-oid="t9ikdkg">
                                    <h3
                                        className="font-semibold text-lg text-gray-900"
                                        data-oid="cvc2k4c"
                                    >
                                        {order.orderNumber}
                                    </h3>
                                    <p className="text-gray-600" data-oid="0-7jvtn">
                                        Order ID: {order.id}
                                    </p>
                                    <p className="text-gray-600" data-oid="7fm.cz.">
                                        Created: {formatDate(order.createdAt)}
                                    </p>
                                    {order.updatedAt !== order.createdAt && (
                                        <p className="text-gray-600" data-oid="r11zau5">
                                            Updated: {formatDate(order.updatedAt)}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right" data-oid="0o4b59h">
                                    <p
                                        className="text-2xl font-bold text-gray-900"
                                        data-oid="e5jf1.x"
                                    >
                                        EGP {order.totalAmount.toFixed(2)}
                                    </p>
                                    <p className="text-gray-600" data-oid="f0jvpwu">
                                        Payment: {order.paymentMethod}
                                    </p>
                                    <p className="text-gray-600" data-oid="5pazokm">
                                        Status: {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div data-oid="c3nvw-1">
                            <h4 className="font-semibold text-gray-900 mb-3" data-oid="y2pdpfe">
                                Customer Information
                            </h4>
                            <div
                                className="bg-white border border-gray-200 rounded-lg p-4"
                                data-oid="j_fm.71"
                            >
                                <div data-oid="5r8xw9i">
                                    <p className="font-medium text-gray-900" data-oid="0c_a9un">
                                        {order.customerName}
                                    </p>
                                    <p className="text-gray-600" data-oid="npbgoek">
                                        {order.customerPhone}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div data-oid="15pfj6x">
                            <h4 className="font-semibold text-gray-900 mb-3" data-oid="7m7rmv.">
                                Delivery Address
                            </h4>
                            <div
                                className="bg-white border border-gray-200 rounded-lg p-4"
                                data-oid="4-w3v-."
                            >
                                <div className="flex items-start space-x-3" data-oid="1zf6bfz">
                                    <svg
                                        className="w-5 h-5 text-blue-600 mt-0.5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        data-oid="8500r_y"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                            data-oid="0cxa69w"
                                        />
                                    </svg>
                                    <div data-oid="ko4zldl">
                                        <p className="font-medium text-gray-900" data-oid="mtp:gzh">
                                            {order.deliveryAddress.street}
                                        </p>
                                        <p className="text-gray-600" data-oid="dx6_mr.">
                                            {order.deliveryAddress.city},{' '}
                                            {order.deliveryAddress.governorate}
                                        </p>
                                        <p className="text-gray-600" data-oid="hoeurz5">
                                            Phone: {order.deliveryAddress.phone}
                                        </p>
                                        {order.deliveryAddress.notes && (
                                            <p
                                                className="text-gray-600 mt-2 italic"
                                                data-oid="o-fwioo"
                                            >
                                                Note: {order.deliveryAddress.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prescription Section */}
                        {order.prescriptionId && (
                            <div data-oid="csi-_oq">
                                <h4 className="font-semibold text-gray-900 mb-3" data-oid="udqd9g1">
                                    Prescription Information
                                </h4>
                                <div
                                    className={`border rounded-lg p-4 ${
                                        order.prescriptionRequired && order.prescriptionVerified === true
                                            ? 'bg-green-50 border-green-200'
                                            : order.prescriptionRequired && order.prescriptionVerified === false
                                              ? 'bg-red-50 border-red-200'
                                              : 'bg-yellow-50 border-yellow-200'
                                    }`}
                                    data-oid="tj_ic0w"
                                >
                                    <div
                                        className="flex items-center justify-between mb-4"
                                        data-oid="crmngoh"
                                    >
                                        <div
                                            className="flex items-center space-x-3"
                                            data-oid="_cm66px"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                data-oid="wth:vet"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z"
                                                    clipRule="evenodd"
                                                    data-oid="lv49mlz"
                                                />
                                            </svg>
                                            <span
                                                className="font-medium text-gray-900"
                                                data-oid="96_qz9h"
                                            >
                                                Prescription ID: {order.prescriptionId}
                                            </span>
                                            <Badge
                                                className={`${
                                                    order.prescriptionRequired && order.prescriptionVerified === true
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.prescriptionRequired && order.prescriptionVerified === false
                                                          ? 'bg-red-100 text-red-800'
                                                          : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                                data-oid="frlxow."
                                            >
                                                {order.prescriptionRequired && order.prescriptionVerified === true
                                                    ? 'Verified'
                                                    : order.prescriptionRequired && order.prescriptionVerified === false
                                                      ? 'Rejected'
                                                      : 'Pending Review'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Prescription Image */}
                                    <div
                                        className="relative bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
                                        data-oid="xzkx2jp"
                                    >
                                        <div
                                            className="aspect-[4/3] max-h-64 flex items-center justify-center p-4"
                                            data-oid="gyo3bmi"
                                        >
                                            <img
                                                src={`https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&crop=center`}
                                                alt={`Prescription ${order.prescriptionId}`}
                                                className="max-w-full max-h-full object-contain rounded-lg shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
                                                onClick={openPrescriptionZoom}
                                                data-oid="5cmioxr"
                                            />
                                        </div>
                                        <div
                                            className="absolute bottom-2 right-2"
                                            data-oid="42igy_a"
                                        >
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={openPrescriptionZoom}
                                                className="bg-white bg-opacity-90 hover:bg-opacity-100"
                                                data-oid="n1c9glf"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    data-oid="dth78:v"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                                                        clipRule="evenodd"
                                                        data-oid="gfrb5r4"
                                                    />
                                                </svg>
                                                Zoom
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div data-oid=".qi6h6.">
                            <h4 className="font-semibold text-gray-900 mb-3" data-oid="tbb5qb3">
                                Order Items ({order.items.length})
                            </h4>
                            <div className="space-y-3" data-oid="c:aus6h">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray-200 rounded-lg p-4"
                                        data-oid="dro37yc"
                                    >
                                        <div
                                            className="flex items-center space-x-4"
                                            data-oid="l-p4oi-"
                                        >
                                            {/* Product Image */}
                                            <div
                                                className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() =>
                                                    openImageZoom(
                                                        item.image ||
                                                            `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center`,
                                                    )
                                                }
                                                data-oid="zct33uk"
                                            >
                                                <img
                                                    src={
                                                        item.image ||
                                                        `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center`
                                                    }
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center`;
                                                    }}
                                                    data-oid="26cg7tv"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1" data-oid="2g8on9y">
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid="p7knz:d"
                                                >
                                                    <div data-oid="cnl8vdv">
                                                        <h5
                                                            className="font-semibold text-gray-900"
                                                            data-oid=":w842bg"
                                                        >
                                                            {item.productName}
                                                        </h5>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid=":erewvr"
                                                        >
                                                            {item.manufacturer}
                                                        </p>
                                                        <p
                                                            className="text-sm text-gray-500"
                                                            data-oid="8_0:9hp"
                                                        >
                                                            Category: {item.category}
                                                        </p>
                                                    </div>
                                                    <div className="text-right" data-oid="b4v2can">
                                                        <p
                                                            className="font-semibold text-gray-900"
                                                            data-oid="isq3cu_"
                                                        >
                                                            EGP {item.unitPrice}
                                                        </p>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid=":bh4y6_"
                                                        >
                                                            Qty: {item.quantity}
                                                        </p>
                                                        <p
                                                            className="text-sm font-medium text-green-600"
                                                            data-oid="5-o2sva"
                                                        >
                                                            Total: EGP {item.totalPrice}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Prescription Badge */}
                                                {item.prescription && (
                                                    <div className="mt-2" data-oid="o59jtde">
                                                        <Badge
                                                            className="bg-red-100 text-red-800"
                                                            data-oid="tun0.:r"
                                                        >
                                                            <svg
                                                                className="w-3 h-3 mr-1"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                                data-oid="jjugw3j"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                                    clipRule="evenodd"
                                                                    data-oid="t1mlnnz"
                                                                />
                                                            </svg>
                                                            Prescription Required
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div data-oid="981rgi9">
                            <h4 className="font-semibold text-gray-900 mb-3" data-oid="uiuzyux">
                                Order Summary
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4" data-oid="xwpm1yi">
                                <div className="space-y-2" data-oid="xg293zx">
                                    <div className="flex justify-between" data-oid="89mw7_.">
                                        <span className="text-gray-600" data-oid="suw.qgn">
                                            Subtotal:
                                        </span>
                                        <span className="font-medium" data-oid="92powqj">
                                            EGP {order.subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="1i_u-lz">
                                        <span className="text-gray-600" data-oid="-3fsbu5">
                                            Delivery Fee:
                                        </span>
                                        <span className="font-medium" data-oid="vax0.na">
                                            EGP {order.deliveryFee.toFixed(2)}
                                        </span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between" data-oid="zpaywo7">
                                            <span className="text-gray-600" data-oid="d-n3u28">
                                                Discount:
                                            </span>
                                            <span
                                                className="font-medium text-green-600"
                                                data-oid="s5avjdg"
                                            >
                                                -EGP {order.discount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <Separator data-oid="iqnkua3" />
                                    <div
                                        className="flex justify-between text-lg font-bold"
                                        data-oid="c:qe:tm"
                                    >
                                        <span data-oid="l26cr76">Total:</span>
                                        <span data-oid="gbcv3hg">
                                            EGP {order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        {order.statusHistory && order.statusHistory.length > 0 && (
                            <div data-oid="mg424ym">
                                <h4 className="font-semibold text-gray-900 mb-3" data-oid="24do.dx">
                                    Order Timeline
                                </h4>
                                <div className="space-y-3" data-oid="s4m-6x5">
                                    {order.statusHistory.map((history, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3"
                                            data-oid=":o6tkv:"
                                        >
                                            <div
                                                className="w-2 h-2 bg-blue-600 rounded-full mt-2"
                                                data-oid="n14ngnz"
                                            ></div>
                                            <div className="flex-1" data-oid="1eexea_">
                                                <p
                                                    className="font-medium text-gray-900"
                                                    data-oid=":y6b:8l"
                                                >
                                                    {history.status.charAt(0).toUpperCase() +
                                                        history.status.slice(1).replace('-', ' ')}
                                                </p>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="ja3audh"
                                                >
                                                    {formatDate(history.timestamp)}
                                                </p>
                                                {history.notes && (
                                                    <p
                                                        className="text-sm text-gray-500 mt-1"
                                                        data-oid="jintcc1"
                                                    >
                                                        {history.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Prescription Zoom Modal */}
            {prescriptionZoomed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                    data-oid="a9w2lhe"
                >
                    <div className="relative max-w-full max-h-full" data-oid="rsijf_i">
                        <img
                            src={`https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=900&fit=crop&crop=center`}
                            alt={`Prescription ${order.prescriptionId}`}
                            className="max-w-full max-h-full object-contain"
                            data-oid="4hrg19."
                        />

                        <button
                            onClick={closePrescriptionZoom}
                            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                            data-oid="gj7eq16"
                        >
                            ×
                        </button>
                        <div
                            className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded"
                            data-oid="my62oi-"
                        >
                            Prescription ID: {order.prescriptionId}
                        </div>
                    </div>
                </div>
            )}

            {/* Product Image Zoom Modal */}
            {selectedImageZoom && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                    data-oid="7e5gs.k"
                >
                    <div className="relative max-w-full max-h-full" data-oid="livp-un">
                        <img
                            src={selectedImageZoom}
                            alt="Product"
                            className="max-w-full max-h-full object-contain"
                            data-oid="d3k3fpk"
                        />

                        <button
                            onClick={closeImageZoom}
                            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                            data-oid="enlmhnq"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
