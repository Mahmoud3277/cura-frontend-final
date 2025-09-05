'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Medicine {
    id: string;
    name: string;
    strength: string;
    form: string;
    quantity: number;
    instructions: string;
    price: number;
}

interface PrescriptionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    prescriptionId: string;
}

export function PrescriptionDetailsModal({
    isOpen,
    onClose,
    prescriptionId,
}: PrescriptionDetailsModalProps) {
    const [mounted, setMounted] = useState(false);
    const [prescription, setPrescription] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            loadPrescriptionDetails();
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, prescriptionId]);

    const loadPrescriptionDetails = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockPrescription = {
                id: prescriptionId,
                date: '2024-01-12',
                doctor: 'Dr. Ahmed Hassan',
                status: 'Processed',
                pharmacy: 'Al-Shifa Pharmacy',
                urgency: 'Normal',
                total: '1,365.00 EGP',
                patientName: 'John Customer',
                medicines: [
                    {
                        id: '1',
                        name: 'Paracetamol 500mg',
                        strength: '500mg',
                        form: 'Tablet',
                        quantity: 20,
                        instructions: 'Take 1 tablet every 6 hours as needed for pain',
                        price: 15.5,
                    },
                    {
                        id: '2',
                        name: 'Amoxicillin 250mg',
                        strength: '250mg',
                        form: 'Capsule',
                        quantity: 21,
                        instructions: 'Take 1 capsule 3 times daily with food',
                        price: 25.0,
                    },
                    {
                        id: '3',
                        name: 'Vitamin D3 1000IU',
                        strength: '1000IU',
                        form: 'Tablet',
                        quantity: 30,
                        instructions: 'Take 1 tablet daily with breakfast',
                        price: 5.0,
                    },
                ],
            };
            setPrescription(mockPrescription);
            setIsLoading(false);
        }, 1000);
    };

    if (!isOpen) return null;
    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            style={{
                zIndex: 99999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
            data-oid="o23x4kz"
        >
            <div
                className="bg-white rounded-3xl max-w-4xl w-full min-h-[600px] max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 my-4"
                onClick={(e) => e.stopPropagation()}
                data-oid="yw_nswz"
            >
                {/* Header */}
                <div
                    className="bg-white border-b border-gray-200 px-6 sm:px-8 py-4 sm:py-6 rounded-t-3xl"
                    data-oid="m8c6n9i"
                >
                    <div className="flex items-center justify-between" data-oid="qs:x8xm">
                        <div className="flex items-center space-x-4" data-oid="8u8c0m-">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] rounded-full flex items-center justify-center"
                                data-oid="r-3nbfy"
                            >
                                <span className="text-xl" data-oid="oz9346h">
                                    📋
                                </span>
                            </div>
                            <div data-oid=".el2c1x">
                                <h2 className="text-2xl font-bold text-gray-900" data-oid="9zpysx0">
                                    Prescription Details
                                </h2>
                                <p className="text-gray-600" data-oid="gw.h0_l">
                                    View complete prescription information
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            data-oid="k96kl3b"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1" data-oid="5ramilg">
                    {isLoading ? (
                        <div
                            className="flex flex-col items-center justify-center py-20"
                            data-oid="n:1v2:s"
                        >
                            <div
                                className="w-12 h-12 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mb-4"
                                data-oid="9il38-d"
                            ></div>
                            <p className="text-gray-600 text-lg" data-oid="390tto0">
                                Loading prescription details...
                            </p>
                        </div>
                    ) : prescription ? (
                        <div className="space-y-6" data-oid="-xj--91">
                            {/* Prescription Info */}
                            <div
                                className="bg-gradient-to-r from-[#1F1F6F]/5 to-[#14274E]/5 p-6 rounded-xl"
                                data-oid="ehratva"
                            >
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    data-oid="if1j.hm"
                                >
                                    <div data-oid="i99iey4">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-4"
                                            data-oid="agdh3o2"
                                        >
                                            Prescription Information
                                        </h3>
                                        <div className="space-y-3" data-oid="3lnnap2">
                                            <div data-oid="ipg5fmx">
                                                <span
                                                    className="text-sm text-gray-600 font-medium"
                                                    data-oid="5w_mj-2"
                                                >
                                                    Prescription ID:
                                                </span>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="znyh6yp"
                                                >
                                                    {prescription.id}
                                                </p>
                                            </div>
                                            <div data-oid="bk1iatm">
                                                <span
                                                    className="text-sm text-gray-600 font-medium"
                                                    data-oid="gpal85c"
                                                >
                                                    Patient Name:
                                                </span>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="n-vuo7r"
                                                >
                                                    {prescription.patientName}
                                                </p>
                                            </div>
                                            <div data-oid="cfty47.">
                                                <span
                                                    className="text-sm text-gray-600 font-medium"
                                                    data-oid="3hsigx9"
                                                >
                                                    Date:
                                                </span>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="k1ngvhm"
                                                >
                                                    {prescription.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div data-oid="ba3a98_">
                                        <h3
                                            className="text-lg font-semibold text-gray-900 mb-4"
                                            data-oid="52:ed.s"
                                        >
                                            Doctor & Pharmacy
                                        </h3>
                                        <div className="space-y-3" data-oid="u.hej5l">
                                            <div data-oid="zb71:hh">
                                                <span
                                                    className="text-sm text-gray-600 font-medium"
                                                    data-oid="cai74ok"
                                                >
                                                    Prescribed by:
                                                </span>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="x9-9-dm"
                                                >
                                                    {prescription.doctor}
                                                </p>
                                            </div>
                                            <div data-oid="o-zc6fv">
                                                <span
                                                    className="text-sm text-gray-600 font-medium"
                                                    data-oid="wswsoap"
                                                >
                                                    Pharmacy:
                                                </span>
                                                <p
                                                    className="font-semibold text-gray-900"
                                                    data-oid="rs:4ykz"
                                                >
                                                    {prescription.pharmacy}
                                                </p>
                                            </div>
                                            <div data-oid="cztqdwb">
                                                <span
                                                    className="text-sm text-gray-600 font-medium"
                                                    data-oid="i_t7d8j"
                                                >
                                                    Status:
                                                </span>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                                                        prescription.status === 'Processed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : prescription.status === 'Delivered'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : prescription.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                    data-oid="9whlum-"
                                                >
                                                    {prescription.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medicines List */}
                            <div data-oid="tn3bhs7">
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="g8n49jm"
                                >
                                    Prescribed Medicines ({prescription.medicines.length} items)
                                </h3>
                                <div className="space-y-4" data-oid="xh62r:8">
                                    {prescription.medicines.map(
                                        (medicine: Medicine, index: number) => (
                                            <div
                                                key={medicine.id}
                                                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                                                data-oid="97sk4v9"
                                            >
                                                <div
                                                    className="flex items-start justify-between"
                                                    data-oid="ca:9ztb"
                                                >
                                                    <div className="flex-1" data-oid="bwuhg-g">
                                                        <div
                                                            className="flex items-center gap-3 mb-3"
                                                            data-oid="qb4dnsa"
                                                        >
                                                            <div
                                                                className="w-10 h-10 bg-[#1F1F6F]/10 rounded-lg flex items-center justify-center"
                                                                data-oid="e3v4.c7"
                                                            >
                                                                <span
                                                                    className="text-lg"
                                                                    data-oid="zf835.3"
                                                                >
                                                                    💊
                                                                </span>
                                                            </div>
                                                            <div data-oid="ggsfbr8">
                                                                <h4
                                                                    className="text-lg font-semibold text-gray-900"
                                                                    data-oid="g5est0x"
                                                                >
                                                                    {medicine.name}
                                                                </h4>
                                                                <p
                                                                    className="text-sm text-gray-600"
                                                                    data-oid="4m3.mpm"
                                                                >
                                                                    {medicine.strength} •{' '}
                                                                    {medicine.form}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                                                            data-oid="eoh9qa7"
                                                        >
                                                            <div data-oid="wv9pjvf">
                                                                <span
                                                                    className="text-sm text-gray-600 font-medium"
                                                                    data-oid="zzyf9u_"
                                                                >
                                                                    Quantity:
                                                                </span>
                                                                <p
                                                                    className="font-semibold text-gray-900"
                                                                    data-oid="dcby72c"
                                                                >
                                                                    {medicine.quantity}{' '}
                                                                    {medicine.form.toLowerCase()}s
                                                                </p>
                                                            </div>
                                                            <div data-oid="-lzgm9-">
                                                                <span
                                                                    className="text-sm text-gray-600 font-medium"
                                                                    data-oid="r8htmg8"
                                                                >
                                                                    Price:
                                                                </span>
                                                                <p
                                                                    className="font-semibold text-gray-900"
                                                                    data-oid="os89x50"
                                                                >
                                                                    ${medicine.price.toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div data-oid="07_-f57">
                                                            <span
                                                                className="text-sm text-gray-600 font-medium"
                                                                data-oid="-::u9f7"
                                                            >
                                                                Instructions:
                                                            </span>
                                                            <p
                                                                className="text-gray-900 mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200"
                                                                data-oid="cbc7d1_"
                                                            >
                                                                {medicine.instructions}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Total */}
                            <div
                                className="bg-gray-50 border border-gray-200 rounded-xl p-6"
                                data-oid="m5j8vl8"
                            >
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="beuev3r"
                                >
                                    <span
                                        className="text-lg font-semibold text-gray-900"
                                        data-oid="4jy3z1s"
                                    >
                                        Total Amount:
                                    </span>
                                    <span
                                        className="text-2xl font-bold text-[#1F1F6F]"
                                        data-oid="gaoryry"
                                    >
                                        {prescription.total}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20" data-oid="tn.81-c">
                            <div
                                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                data-oid="z5jl88r"
                            >
                                <span className="text-3xl" data-oid="w8vm3a6">
                                    ❌
                                </span>
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-900 mb-4"
                                data-oid="-7rmd7b"
                            >
                                Failed to Load Details
                            </h3>
                            <p className="text-gray-600 mb-8" data-oid="7_9y0y1">
                                Unable to load prescription details. Please try again.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-b-3xl"
                    data-oid="hxk3gnk"
                >
                    <div className="flex justify-end" data-oid="fy_3hye">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            data-oid="pc7:h3-"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
