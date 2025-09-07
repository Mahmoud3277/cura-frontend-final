'use client';

import { useState, useEffect } from 'react';
import { X, Package, AlertCircle, CheckCircle, DollarSign, FileText } from 'lucide-react';
import { Order, OrderReturn } from '@/lib/types';
import { orderReturnService, ReturnRequest } from '@/lib/services/orderReturnService';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReturnOrderModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onReturnSubmitted?: (returnId: string) => void;
}

interface ReturnItemForm {
    orderItemId: string;
    productId: string;
    productName: string;
    originalQuantity: number;
    returnQuantity: number;
    reason: string;
    condition: 'unopened' | 'opened' | 'damaged' | 'expired';
    price: number;
}

export function ReturnOrderModal({
    order,
    isOpen,
    onClose,
    onReturnSubmitted,
}: ReturnOrderModalProps) {
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');
    const isMobile = useIsMobile();
    const [step, setStep] = useState<'eligibility' | 'items' | 'details' | 'confirmation'>(
        'eligibility',
    );

    // Helper functions to map the complex order object structure
    const getCustomerInfo = (order: any) => ({
        id: order.customerId?._id || order.customerId,
        name: order.customerId?.name || order.customerName,
        email: order.customerId?.email || order.customerEmail,
        phone: order.customerId?.phone || order.customerPhone,
    });

    const getOrderItems = (order: any) => {
        return order.items?.map((item: any) => ({
            id: item._id,
            productId: item.productId?._id || item.productId,
            productName: item.productName || item.productId?.name || 'Unknown Product',
            productNameAr: item.productNameAr || item.productId?.nameAr || '',
            quantity: item.quantity,
            unitPrice: item.unitPrice || item.price || 0,
            totalPrice: item.totalPrice || (item.unitPrice * item.quantity) || 0,
            image: getProductImage(item),
            category: item.category || item.productId?.category || '',
            manufacturer: item.manufacturer || item.productId?.manufacturer || '',
        })) || [];
    };

    const getProductImage = (item: any) => {
        // Try multiple sources for the image
        if (item.image) {
            // If image is a JSON string, parse it
            if (typeof item.image === 'string' && item.image.trim().startsWith('{')) {
                try {
                    const parsedImage = JSON.parse(item.image);
                    if (parsedImage.url) {
                        return parsedImage.url;
                    }
                } catch (e) {
                    console.warn('Failed to parse image JSON:', item.image);
                }
            }
            // If image is already a URL string
            if (typeof item.image === 'string' && item.image.startsWith('http')) {
                return item.image;
            }
        }

        // Try productId images array
        if (item.productId?.images?.length > 0) {
            return item.productId.images[0].url;
        }

        // Return empty string if no image found
        return '';
    };

    const getImageSource = (imageUrl: string) => {
        if (!imageUrl || imageUrl.trim() === '') {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
        }
        return imageUrl;
    };

    // Helper function to translate return reasons
    const translateReason = (reason: string): string => {
        const reasonMap: { [key: string]: string } = {
            'Product damaged/defective': tCustomer('returnOrder.content.reasons.productDamaged'),
            'Wrong item received': tCustomer('returnOrder.content.reasons.wrongItem'),
            'Product expired': tCustomer('returnOrder.content.reasons.productExpired'),
            'No longer needed': tCustomer('returnOrder.content.reasons.noLongerNeeded'),
            'Doctor changed prescription': tCustomer('returnOrder.content.reasons.doctorChanged'),
            Other: tCustomer('returnOrder.content.reasons.other'),
        };
        return reasonMap[reason] || reason;
    };
    const [returnItems, setReturnItems] = useState<ReturnItemForm[]>([]);
    const [returnReason, setReturnReason] = useState('');
    const [returnDescription, setReturnDescription] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [eligibilityCheck, setEligibilityCheck] = useState<{
        canReturn: boolean;
        reason?: string;
    } | null>(null);
    const [estimatedRefund, setEstimatedRefund] = useState(0);

    const returnPolicy = orderReturnService.getReturnPolicy();

    useEffect(() => {
        if (isOpen && order) {
            console.log('🔄 Opening return modal with order:', order);
            console.log('📦 Order structure:', {
                id: order.id,
                customerId: order.customerId,
                items: order.items,
                totalAmount: order.totalAmount,
                status: order.status,
            });

            // Check eligibility
            const eligibility = orderReturnService.canReturnOrder(order);
            setEligibilityCheck(eligibility);

            if (eligibility.canReturn) {
                // Initialize return items using the mapped order data
                const mappedItems = getOrderItems(order);
                console.log('📋 Mapped order items:', mappedItems);

                const items: ReturnItemForm[] = mappedItems.map((item, index) => ({
                    orderItemId: item.id || `item-${index}`,
                    productId: item.productId,
                    productName: item.productName,
                    originalQuantity: item.quantity,
                    returnQuantity: item.quantity,
                    reason: '',
                    condition: 'unopened',
                    price: item.unitPrice,
                }));
                console.log('🎯 Return items initialized:', items);
                setReturnItems(items);
            }
        }
    }, [isOpen, order]);

    useEffect(() => {
        // Calculate estimated refund
        if (returnItems.length > 0) {
            const total = returnItems.reduce((sum, item) => {
                if (item.returnQuantity > 0 && item.reason) {
                    const itemTotal = item.price * item.returnQuantity;
                    const refundPercentage = returnPolicy.refundPercentages[item.condition];
                    return sum + (itemTotal * refundPercentage) / 100;
                }
                return sum;
            }, 0);
            setEstimatedRefund(Math.round(total * 100) / 100);
        }
    }, [returnItems, returnPolicy.refundPercentages]);

    const handleItemChange = (index: number, field: keyof ReturnItemForm, value: any) => {
        const updatedItems = [...returnItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setReturnItems(updatedItems);
    };

    const handleSubmitReturn = async () => {
        if (!order) return;

        setIsSubmitting(true);

        const validReturnItems = returnItems.filter(
            (item) => item.returnQuantity > 0 && item.reason,
        );

        const returnRequest: ReturnRequest = {
            orderId: order._id,
            customerId: getCustomerInfo(order).id,
            reason: returnReason,
            description: returnDescription,
            returnItems: validReturnItems.map((item) => ({
                orderItemId: item.orderItemId,
                productId: item.productId,
                quantity: item.returnQuantity,
                reason: item.reason,
                condition: item.condition,
            })),
            customerNotes,
        };

        try {
            const result = await orderReturnService.submitReturnRequest(returnRequest);

            if (result.success && result.returnId) {
                setStep('confirmation');
                onReturnSubmitted?.(result.returnId);
            } else {
                alert(result.error || 'Failed to submit return request');
            }
        } catch (error) {
            console.error('Error submitting return:', error);
            alert('Failed to submit return request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModal = () => {
        setStep('eligibility');
        setReturnItems([]);
        setReturnReason('');
        setReturnDescription('');
        setCustomerNotes('');
        setEstimatedRefund(0);
        setEligibilityCheck(null);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen || !order) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Mobile-specific layout
    if (isMobile) {
        return (
            <div
                className="fixed inset-0 bg-white z-50 flex flex-col"
                data-oid="mobile-return-modal"
            >
                {/* Mobile Header */}
                <div
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 flex items-center justify-between"
                    data-oid="mobile-header"
                >
                    <div className="flex items-center space-x-3" data-oid="5gu2fw6">
                        <div
                            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
                            data-oid="mobile-icon"
                        >
                            <Package className="w-4 h-4" data-oid="ytyfe8s" />
                        </div>
                        <div data-oid="41-j2vq">
                            <h2 className="text-lg font-bold" data-oid="r_apub2">
                                {tCustomer('returnOrder.title')}
                            </h2>
                            <p className="text-red-100 text-sm" data-oid="qkk7zkw">
                                {order._id || order.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        data-oid="mobile-close"
                    >
                        <X className="w-4 h-4" data-oid="4c.-aj3" />
                    </button>
                </div>

                {/* Mobile Progress Steps */}
                <div className="border-b border-gray-200 px-4 py-3" data-oid="mobile-progress">
                    <div className="flex items-center justify-between" data-oid="z9in5.q">
                        {[
                            { id: 'eligibility', num: 1 },
                            { id: 'items', num: 2 },
                            { id: 'details', num: 3 },
                            { id: 'confirmation', num: 4 },
                        ].map((stepItem, index) => (
                            <div key={stepItem.id} className="flex items-center" data-oid="mf8b_tx">
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                        step === stepItem.id
                                            ? 'bg-red-600 text-white'
                                            : [
                                                    'eligibility',
                                                    'items',
                                                    'details',
                                                    'confirmation',
                                                ].indexOf(step) > index
                                              ? 'bg-green-500 text-white'
                                              : 'bg-gray-200 text-gray-600'
                                    }`}
                                    data-oid="ysajy9x"
                                >
                                    {['eligibility', 'items', 'details', 'confirmation'].indexOf(
                                        step,
                                    ) > index ? (
                                        <CheckCircle className="w-3 h-3" data-oid="-_rr0wb" />
                                    ) : (
                                        stepItem.num
                                    )}
                                </div>
                                {index < 3 && (
                                    <div className="w-4 h-px bg-gray-300 mx-2" data-oid="r9b1pcg" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2" data-oid=":2yne_6">
                        <span className="text-sm font-medium text-red-600" data-oid="owu64u5">
                            {step === 'eligibility' && tCustomer('returnOrder.steps.eligibility')}
                            {step === 'items' && tCustomer('returnOrder.steps.selectItems')}
                            {step === 'details' && tCustomer('returnOrder.steps.returnDetails')}
                            {step === 'confirmation' && tCustomer('returnOrder.steps.confirmation')}
                        </span>
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4" data-oid="mobile-content">
                    {step === 'eligibility' && (
                        <div
                            className={`space-y-${isMobile ? '4' : '6'}`}
                            data-oid="eligibility-content"
                        >
                            {!isMobile && (
                                <div className="text-center" data-oid="desktop-title">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-4"
                                        data-oid="qbqyz0e"
                                    >
                                        {tCustomer('returnOrder.eligibilityCheck.title')}
                                    </h3>
                                </div>
                            )}

                            {eligibilityCheck?.canReturn ? (
                                <div
                                    className={`bg-green-50 border border-green-200 rounded-xl ${isMobile ? 'p-4' : 'p-6'}`}
                                    data-oid="eligible-card"
                                >
                                    <div
                                        className={`flex items-${isMobile ? 'start' : 'center'} space-x-3 mb-4`}
                                        data-oid="eligible-header"
                                    >
                                        <CheckCircle
                                            className={`${isMobile ? 'w-6 h-6 mt-1' : 'w-8 h-8'} text-green-600`}
                                            data-oid="check-icon"
                                        />

                                        <div data-oid="eligible-text">
                                            <h4
                                                className={`font-semibold text-green-800 ${isMobile ? 'text-base' : ''}`}
                                                data-oid="eligible-title"
                                            >
                                                {tCustomer('returnOrder.content.orderEligible')}
                                            </h4>
                                            <p
                                                className={`text-green-700 ${isMobile ? 'text-sm' : ''}`}
                                                data-oid="eligible-desc"
                                            >
                                                {tCustomer('returnOrder.content.orderEligibleDesc')}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-1 gap-4 mt-4"
                                        data-oid="return-info"
                                    >
                                        <div
                                            className={`bg-white rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}
                                            data-oid="return-window"
                                        >
                                            <h5
                                                className={`font-medium text-gray-900 mb-2 ${isMobile ? 'text-sm' : ''}`}
                                                data-oid="window-title"
                                            >
                                                {tCustomer('returnOrder.content.returnWindow')}
                                            </h5>
                                            <p
                                                className="text-sm text-gray-600"
                                                data-oid="window-desc"
                                            >
                                                {locale === 'ar'
                                                    ? tCustomer(
                                                          'returnOrder.content.daysFromDelivery',
                                                      )
                                                    : `${returnPolicy.maxReturnDays} ${tCustomer('returnOrder.content.daysFromDelivery')}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`bg-red-50 border border-red-200 rounded-xl ${isMobile ? 'p-4' : 'p-6'}`}
                                    data-oid="not-eligible-card"
                                >
                                    <div
                                        className={`flex items-${isMobile ? 'start' : 'center'} space-x-3`}
                                        data-oid="not-eligible-header"
                                    >
                                        <AlertCircle
                                            className={`${isMobile ? 'w-6 h-6 mt-1' : 'w-8 h-8'} text-red-600`}
                                            data-oid="alert-icon"
                                        />

                                        <div data-oid="not-eligible-text">
                                            <h4
                                                className={`font-semibold text-red-800 ${isMobile ? 'text-base' : ''}`}
                                                data-oid="not-eligible-title"
                                            >
                                                {tCustomer(
                                                    'returnOrder.eligibilityCheck.notEligible',
                                                )}
                                            </h4>
                                            <p
                                                className={`text-red-700 ${isMobile ? 'text-sm' : ''}`}
                                                data-oid="not-eligible-reason"
                                            >
                                                {eligibilityCheck?.reason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'items' && (
                        <div className={`space-y-${isMobile ? '4' : '6'}`} data-oid="items-content">
                            {!isMobile && (
                                <div data-oid="desktop-items-header">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-4"
                                        data-oid="kqqzqt4"
                                    >
                                        {tCustomer('returnOrder.content.selectItemsTitle')}
                                    </h3>
                                    <p className="text-gray-600 mb-6" data-oid="vh1.we9">
                                        {tCustomer('returnOrder.content.selectItemsDesc')}
                                    </p>
                                </div>
                            )}

                            <div
                                className={`space-y-${isMobile ? '3' : '4'}`}
                                data-oid="items-list"
                            >
                                {returnItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`border border-gray-200 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}
                                        data-oid="item-card"
                                    >
                                        <div
                                            className={`flex items-start ${isMobile ? 'space-x-3' : 'space-x-4'}`}
                                            data-oid="item-header"
                                        >
                                            <div
                                                className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden`}
                                                data-oid="item-image-container"
                                            >
                                                {(() => {
                                                    const mappedItems = getOrderItems(order);
                                                    const currentItem = mappedItems[index];
                                                    const imageUrl = currentItem?.image || '';
                                                    return (
                                                        <img
                                                            src={getImageSource(imageUrl)}
                                                            alt={item.productName}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                // Fallback to a placeholder image if the product image fails to load
                                                                e.currentTarget.src =
                                                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
                                                            }}
                                                            data-oid="item-image"
                                                        />
                                                    );
                                                })()}
                                            </div>
                                            <div
                                                className={`flex-1 space-y-${isMobile ? '3' : '4'}`}
                                                data-oid="item-details"
                                            >
                                                <div data-oid="item-info">
                                                    <h4
                                                        className={`font-medium text-gray-900 ${isMobile ? 'text-sm' : ''}`}
                                                        data-oid="8i..gw1"
                                                    >
                                                        {item.productName}
                                                    </h4>
                                                    <p
                                                        className="text-xs text-gray-600"
                                                        data-oid="jipjv68"
                                                    >
                                                        Original quantity: {item.originalQuantity} •
                                                        Price: {item.total} EGP
                                                    </p>
                                                </div>

                                                <div
                                                    className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}
                                                    data-oid="item-controls"
                                                >
                                                    <div data-oid="quantity-control">
                                                        <label
                                                            className="block text-xs font-medium text-gray-700 mb-1"
                                                            data-oid="t5uo.fm"
                                                        >
                                                            {tCustomer(
                                                                'returnOrder.content.returnQuantity',
                                                            )}
                                                        </label>
                                                        <select
                                                            value={item.returnQuantity}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'returnQuantity',
                                                                    parseInt(e.target.value),
                                                                )
                                                            }
                                                            className={`w-full border border-gray-300 rounded-lg px-3 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                                                            data-oid="rhuchk2"
                                                        >
                                                            {Array.from(
                                                                {
                                                                    length:
                                                                        item.originalQuantity + 1,
                                                                },
                                                                (_, i) => (
                                                                    <option
                                                                        key={i}
                                                                        value={i}
                                                                        data-oid="kd._gvx"
                                                                    >
                                                                        {i}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>

                                                    <div data-oid="condition-control">
                                                        <label
                                                            className="block text-xs font-medium text-gray-700 mb-1"
                                                            data-oid="5.a89s4"
                                                        >
                                                            {tCustomer(
                                                                'returnOrder.content.condition',
                                                            )}
                                                        </label>
                                                        <select
                                                            value={item.condition}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'condition',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className={`w-full border border-gray-300 rounded-lg px-3 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                                                            data-oid="ibrdqcm"
                                                        >
                                                            <option
                                                                value="unopened"
                                                                data-oid="i1b3o6n"
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.unopened',
                                                                )}
                                                            </option>
                                                            <option
                                                                value="opened"
                                                                data-oid="5tg91nb"
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.opened',
                                                                )}
                                                            </option>
                                                            <option
                                                                value="damaged"
                                                                data-oid=":i0wi.7"
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.damaged',
                                                                )}
                                                            </option>
                                                            <option
                                                                value="expired"
                                                                data-oid="q4h_82m"
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.expired',
                                                                )}
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div data-oid="reason-control">
                                                        <label
                                                            className="block text-xs font-medium text-gray-700 mb-1"
                                                            data-oid="22r-yd7"
                                                        >
                                                            {tCustomer(
                                                                'returnOrder.content.reason',
                                                            )}
                                                        </label>
                                                        <select
                                                            value={item.reason}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'reason',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className={`w-full border border-gray-300 rounded-lg px-3 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                                                            data-oid="ti_n0.w"
                                                        >
                                                            <option value="" data-oid="0mphkwg">
                                                                {tCustomer(
                                                                    'returnOrder.content.selectReason',
                                                                )}
                                                            </option>
                                                            {returnPolicy.allowedReasons.map(
                                                                (reason) => (
                                                                    <option
                                                                        key={reason}
                                                                        value={reason}
                                                                        data-oid="pod3m04"
                                                                    >
                                                                        {translateReason(reason)}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Estimated Refund */}
                            <div
                                className={`bg-blue-50 border border-blue-200 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}
                                data-oid="refund-estimate"
                            >
                                <div
                                    className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'}`}
                                    data-oid="wlein9t"
                                >
                                    <DollarSign
                                        className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-600`}
                                        data-oid="kafwssq"
                                    />

                                    <div data-oid="fyaep1t">
                                        <h4
                                            className={`font-semibold text-blue-800 ${isMobile ? 'text-sm' : ''}`}
                                            data-oid="m1za-4f"
                                        >
                                            {tCustomer('returnOrder.content.estimatedRefund')}
                                        </h4>
                                        <p
                                            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-blue-900`}
                                            data-oid="r2-8-o-"
                                        >
                                            {isNaN(estimatedRefund)
                                                ? '0.00'
                                                : estimatedRefund.toFixed(2)}{' '}
                                            EGP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'details' && (
                        <div
                            className={`space-y-${isMobile ? '4' : '6'}`}
                            data-oid="details-content"
                        >
                            {!isMobile && (
                                <div data-oid="desktop-details-header">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-4"
                                        data-oid="2evwj_e"
                                    >
                                        {tCustomer('returnOrder.content.details.title')}
                                    </h3>
                                    <p className="text-gray-600 mb-6" data-oid="ll4j8pl">
                                        {tCustomer('returnOrder.content.details.description')}
                                    </p>
                                </div>
                            )}

                            <div
                                className={`space-y-${isMobile ? '3' : '4'}`}
                                data-oid="details-form"
                            >
                                <div data-oid="primary-reason">
                                    <label
                                        className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}
                                        data-oid="lh_b.91"
                                    >
                                        {tCustomer('returnOrder.content.primaryReturnReason')}
                                    </label>
                                    <select
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        className={`w-full border border-gray-300 rounded-lg px-3 ${isMobile ? 'py-2 text-sm' : 'py-2'}`}
                                        required
                                        data-oid="3bvsqg9"
                                    >
                                        <option value="" data-oid="0r._qzw">
                                            {tCustomer(
                                                'returnOrder.content.details.selectPrimaryReason',
                                            )}
                                        </option>
                                        {returnPolicy.allowedReasons.map((reason) => (
                                            <option key={reason} value={reason} data-oid="kg_cw21">
                                                {translateReason(reason)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div data-oid="description-field">
                                    <label
                                        className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}
                                        data-oid="tgppj3m"
                                    >
                                        {tCustomer('returnOrder.content.additionalNotes')}
                                    </label>
                                    <textarea
                                        value={returnDescription}
                                        onChange={(e) => setReturnDescription(e.target.value)}
                                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${isMobile ? 'h-20 text-sm' : 'h-24'}`}
                                        placeholder={tCustomer(
                                            'returnOrder.content.details.detailsPlaceholder',
                                        )}
                                        data-oid="9x4dii9"
                                    />
                                </div>

                                <div data-oid="customer-notes">
                                    <label
                                        className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}
                                        data-oid="06yyd:r"
                                    >
                                        {tCustomer('returnOrder.content.additionalNotes')}
                                    </label>
                                    <textarea
                                        value={customerNotes}
                                        onChange={(e) => setCustomerNotes(e.target.value)}
                                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${isMobile ? 'h-20 text-sm' : 'h-24'}`}
                                        placeholder={tCustomer(
                                            'returnOrder.content.details.additionalNotesPlaceholder',
                                        )}
                                        data-oid="wz8pfkb"
                                    />
                                </div>
                            </div>

                            {/* Return Summary */}
                            <div
                                className={`bg-gray-50 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}
                                data-oid="return-summary"
                            >
                                <h4
                                    className={`font-semibold text-gray-900 mb-3 ${isMobile ? 'text-sm' : ''}`}
                                    data-oid="m9cewau"
                                >
                                    {tCustomer('returnOrder.content.details.returnSummary')}
                                </h4>
                                <div
                                    className={`space-y-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
                                    data-oid="-fufprc"
                                >
                                    <div className="flex justify-between" data-oid="qy8f0.e">
                                        <span data-oid="cd._gqn">
                                            {tCustomer('returnOrder.content.details.itemsToReturn')}
                                        </span>
                                        <span data-oid="kl-wzvm">
                                            {
                                                returnItems.filter(
                                                    (item) => item.returnQuantity > 0,
                                                ).length
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="an8mv-p">
                                        <span data-oid="dadlipm">
                                            {tCustomer('returnOrder.content.details.totalQuantity')}
                                        </span>
                                        <span data-oid="wsbrp3p">
                                            {returnItems.reduce(
                                                (sum, item) => sum + item.returnQuantity,
                                                0,
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between font-semibold"
                                        data-oid="flchgzs"
                                    >
                                        <span data-oid="0umo1a-">
                                            {tCustomer('returnOrder.content.details.totalRefund')}
                                        </span>
                                        <span data-oid="xvj2z0y">
                                            {isNaN(estimatedRefund)
                                                ? '0.00'
                                                : estimatedRefund.toFixed(2)}{' '}
                                            EGP
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'confirmation' && (
                        <div
                            className={`text-center space-y-${isMobile ? '4' : '6'}`}
                            data-oid="confirmation-content"
                        >
                            <div
                                className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-green-100 rounded-full flex items-center justify-center mx-auto`}
                                data-oid="success-icon"
                            >
                                <CheckCircle
                                    className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-green-600`}
                                    data-oid="3oh4kpd"
                                />
                            </div>
                            <div data-oid="success-message">
                                <h3
                                    className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-2`}
                                    data-oid="kd2.ufn"
                                >
                                    Return Request Submitted
                                </h3>
                                <p
                                    className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}
                                    data-oid="ov54s-i"
                                >
                                    Your return request has been submitted successfully. We{"'"}ll
                                    review it and get back to you within 1-2 business days.
                                </p>
                            </div>
                            <div
                                className={`bg-blue-50 border border-blue-200 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}
                                data-oid="next-steps"
                            >
                                <h4
                                    className={`font-semibold text-blue-800 mb-2 ${isMobile ? 'text-sm' : ''}`}
                                    data-oid="0o7-waq"
                                >
                                    What happens next?
                                </h4>
                                <ul
                                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-700 space-y-1 text-left`}
                                    data-oid="fzgj-:8"
                                >
                                    <li data-oid="wwelvqd">• We{"'"}ll review your return request</li>
                                    <li data-oid="96piqks">
                                        • You{"'"}ll receive an email with return instructions
                                    </li>
                                    <li data-oid="f33vb8k">
                                        • Package and send the items back to us
                                    </li>
                                    <li data-oid=":kb0zup">
                                        • Refund will be processed within 3-5 business days
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Footer */}
                {isMobile && (
                    <div className="border-t border-gray-200 p-4 bg-white" data-oid="mobile-footer">
                        <div className="flex flex-col space-y-3" data-oid="jixi4:z">
                            {step !== 'eligibility' && step !== 'confirmation' && (
                                <button
                                    onClick={() => {
                                        const steps = [
                                            'eligibility',
                                            'items',
                                            'details',
                                            'confirmation',
                                        ];

                                        const currentIndex = steps.indexOf(step);
                                        if (currentIndex > 0) {
                                            setStep(steps[currentIndex - 1] as any);
                                        }
                                    }}
                                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                                    data-oid="0ghwrxa"
                                >
                                    {tCustomer('returnOrder.buttons.back')}
                                </button>
                            )}

                            {step === 'eligibility' && eligibilityCheck?.canReturn && (
                                <button
                                    onClick={() => setStep('items')}
                                    className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                                    data-oid="f1.t2es"
                                >
                                    {tCustomer('returnOrder.buttons.continue')}
                                </button>
                            )}

                            {step === 'items' && (
                                <button
                                    onClick={() => setStep('details')}
                                    disabled={
                                        returnItems.filter(
                                            (item) => item.returnQuantity > 0 && item.reason,
                                        ).length === 0
                                    }
                                    className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                                    data-oid="znjac.4"
                                >
                                    {tCustomer('returnOrder.buttons.continue')}
                                </button>
                            )}

                            {step === 'details' && (
                                <button
                                    onClick={handleSubmitReturn}
                                    disabled={!returnReason || isSubmitting}
                                    className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                                    data-oid="19tnkl0"
                                >
                                    {isSubmitting
                                        ? tCustomer('returnOrder.content.details.submitting')
                                        : tCustomer('returnOrder.content.details.submitRequest')}
                                </button>
                            )}

                            <button
                                onClick={handleClose}
                                className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                                data-oid=":d:l1:3"
                            >
                                {step === 'confirmation'
                                    ? tCustomer('orderDetails.buttons.close')
                                    : tCustomer('returnOrder.buttons.cancel')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Desktop layout (unchanged)
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
            data-oid="desktop-return-modal"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                data-oid="desktop-modal-content"
            >
                {/* Header */}
                <div
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6"
                    data-oid="desktop-header"
                >
                    <div className="flex items-center justify-between" data-oid="fk194rs">
                        <div className="flex items-center space-x-4" data-oid="-3d:17n">
                            <div
                                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                                data-oid="i0ofg7s"
                            >
                                <Package className="w-6 h-6" data-oid="xh-fhrt" />
                            </div>
                            <div data-oid="rx07fj0">
                                <h2 className="text-2xl font-bold" data-oid="if.i73y">
                                    {tCustomer('returnOrder.title')}
                                </h2>
                                <p className="text-red-100" data-oid="llsnpk4">
                                    {order.id}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            data-oid="yoijd8r"
                        >
                            <X className="w-5 h-5" data-oid="dohiz3l" />
                        </button>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="border-b border-gray-200 px-6 py-4" data-oid="-2b0jl0">
                    <div className="flex items-center space-x-4" data-oid="nl763pa">
                        {[
                            {
                                id: 'eligibility',
                                label: tCustomer('returnOrder.steps.eligibility'),
                            },
                            { id: 'items', label: tCustomer('returnOrder.steps.selectItems') },
                            { id: 'details', label: tCustomer('returnOrder.steps.returnDetails') },
                            {
                                id: 'confirmation',
                                label: tCustomer('returnOrder.steps.confirmation'),
                            },
                        ].map((stepItem, index) => (
                            <div key={stepItem.id} className="flex items-center" data-oid="is07cai">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step === stepItem.id
                                            ? 'bg-red-600 text-white'
                                            : [
                                                    'eligibility',
                                                    'items',
                                                    'details',
                                                    'confirmation',
                                                ].indexOf(step) > index
                                              ? 'bg-green-500 text-white'
                                              : 'bg-gray-200 text-gray-600'
                                    }`}
                                    data-oid="vvimloa"
                                >
                                    {['eligibility', 'items', 'details', 'confirmation'].indexOf(
                                        step,
                                    ) > index ? (
                                        <CheckCircle className="w-4 h-4" data-oid="s2x.1q2" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span
                                    className={`ml-2 text-sm ${
                                        step === stepItem.id
                                            ? 'text-red-600 font-medium'
                                            : 'text-gray-600'
                                    }`}
                                    data-oid="n7ukb0."
                                >
                                    {stepItem.label}
                                </span>
                                {index < 3 && (
                                    <div className="w-8 h-px bg-gray-300 mx-4" data-oid="x4xfxob" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto" data-oid="4tt86_b">
                    {step === 'eligibility' && (
                        <div className="space-y-6" data-oid="j5ne_di">
                            <div className="text-center" data-oid="80r-d.5">
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="3dsaqe1"
                                >
                                    {tCustomer('returnOrder.eligibilityCheck.title')}
                                </h3>
                            </div>

                            {eligibilityCheck?.canReturn ? (
                                <div
                                    className="bg-green-50 border border-green-200 rounded-xl p-6"
                                    data-oid="3zbzqcy"
                                >
                                    <div
                                        className="flex items-center space-x-3 mb-4"
                                        data-oid="7gd43kf"
                                    >
                                        <CheckCircle
                                            className="w-8 h-8 text-green-600"
                                            data-oid="xkfz4cl"
                                        />

                                        <div data-oid="y.-eaoj">
                                            <h4
                                                className="font-semibold text-green-800"
                                                data-oid="h_i68:z"
                                            >
                                                {tCustomer('returnOrder.content.orderEligible')}
                                            </h4>
                                            <p className="text-green-700" data-oid="w59tfzn">
                                                {tCustomer('returnOrder.content.orderEligibleDesc')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 mt-4" data-oid="kaop9.z">
                                        <div className="bg-white rounded-lg p-4" data-oid="w2dpftx">
                                            <h5
                                                className="font-medium text-gray-900 mb-2"
                                                data-oid="99pvz3_"
                                            >
                                                {tCustomer('returnOrder.content.returnWindow')}
                                            </h5>
                                            <p className="text-sm text-gray-600" data-oid="r80h.37">
                                                {locale === 'ar'
                                                    ? tCustomer(
                                                          'returnOrder.content.daysFromDelivery',
                                                      )
                                                    : `${returnPolicy.maxReturnDays} ${tCustomer('returnOrder.content.daysFromDelivery')}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="bg-red-50 border border-red-200 rounded-xl p-6"
                                    data-oid="b7p2lw1"
                                >
                                    <div className="flex items-center space-x-3" data-oid="pgd79-v">
                                        <AlertCircle
                                            className="w-8 h-8 text-red-600"
                                            data-oid="vx-_i1e"
                                        />

                                        <div data-oid="991kle_">
                                            <h4
                                                className="font-semibold text-red-800"
                                                data-oid="x.druy5"
                                            >
                                                {tCustomer(
                                                    'returnOrder.eligibilityCheck.notEligible',
                                                )}
                                            </h4>
                                            <p className="text-red-700" data-oid="mh-661k">
                                                {eligibilityCheck?.reason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'items' && (
                        <div className="space-y-6" data-oid="kuv9w0a">
                            <div data-oid="4zg-e1i">
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="b.5:7c-"
                                >
                                    {tCustomer('returnOrder.content.selectItemsTitle')}
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="_cb4k:o">
                                    {tCustomer('returnOrder.content.selectItemsDesc')}
                                </p>
                            </div>

                            <div className="space-y-4" data-oid="zajjh6d">
                                {returnItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl p-4"
                                        data-oid="wwxuwmd"
                                    >
                                        <div
                                            className="flex items-start space-x-4"
                                            data-oid="_76tblo"
                                        >
                                            <div
                                                className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                                                data-oid="1u8:m6."
                                            >
                                                <Package
                                                    className="w-8 h-8 text-gray-400"
                                                    data-oid="xjjb7s."
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4" data-oid="i9wc4_-">
                                                <div data-oid="f-yk2w_">
                                                    <h4
                                                        className="font-medium text-gray-900"
                                                        data-oid="3h7756e"
                                                    >
                                                        {item.productName}
                                                    </h4>
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        data-oid="_badeif"
                                                    >
                                                        Original quantity: {item.originalQuantity} •
                                                        Price: {item.price} EGP
                                                    </p>
                                                </div>

                                                <div
                                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                                    data-oid=":xii8ds"
                                                >
                                                    <div data-oid=":-toalj">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="exf-q64"
                                                        >
                                                            {tCustomer(
                                                                'returnOrder.content.returnQuantity',
                                                            )}
                                                        </label>
                                                        <select
                                                            value={item.returnQuantity}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'returnQuantity',
                                                                    parseInt(e.target.value),
                                                                )
                                                            }
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                            data-oid=".p7cu7_"
                                                        >
                                                            {Array.from(
                                                                {
                                                                    length:
                                                                        item.originalQuantity + 1,
                                                                },
                                                                (_, i) => (
                                                                    <option
                                                                        key={i}
                                                                        value={i}
                                                                        data-oid="_i4q-dm"
                                                                    >
                                                                        {i}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>

                                                    <div data-oid="rvt3kx:">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="drk3qpx"
                                                        >
                                                            {tCustomer(
                                                                'returnOrder.content.condition',
                                                            )}
                                                        </label>
                                                        <select
                                                            value={item.condition}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'condition',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                            data-oid="18nhz.-"
                                                        >
                                                            <option
                                                                value="unopened"
                                                                data-oid="i0izyum"
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.unopened',
                                                                )}
                                                            </option>
                                                            <option
                                                                value="opened"
                                                                data-oid="xllyzyq"
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.opened',
                                                                )}
                                                            </option>
                                                            <option
                                                                value="damaged"
                                                                data-oid="p.5y_b_"
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.damaged',
                                                                )}
                                                            </option>
                                                            <option
                                                                value="expired"
                                                                data-oid="007p3k."
                                                            >
                                                                {tCustomer(
                                                                    'returnOrder.content.expired',
                                                                )}
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div data-oid="dc3rzlr">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="i2e-z2r"
                                                        >
                                                            {tCustomer(
                                                                'returnOrder.content.reason',
                                                            )}
                                                        </label>
                                                        <select
                                                            value={item.reason}
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    'reason',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                            data-oid="2z3rsbf"
                                                        >
                                                            <option value="" data-oid="8gd9sa6">
                                                                {tCustomer(
                                                                    'returnOrder.content.selectReason',
                                                                )}
                                                            </option>
                                                            {returnPolicy.allowedReasons.map(
                                                                (reason) => (
                                                                    <option
                                                                        key={reason}
                                                                        value={reason}
                                                                        data-oid="h0tqks8"
                                                                    >
                                                                        {translateReason(reason)}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Estimated Refund */}
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                                data-oid="wfdwva0"
                            >
                                <div className="flex items-center space-x-3" data-oid="wax8.1p">
                                    <DollarSign
                                        className="w-6 h-6 text-blue-600"
                                        data-oid="30rkraj"
                                    />

                                    <div data-oid="51ty:xn">
                                        <h4
                                            className="font-semibold text-blue-800"
                                            data-oid="v4.hrbp"
                                        >
                                            {tCustomer('returnOrder.content.estimatedRefund')}
                                        </h4>
                                        <p
                                            className="text-2xl font-bold text-blue-900"
                                            data-oid="bs1hx7l"
                                        >
                                            {isNaN(estimatedRefund)
                                                ? '0.00'
                                                : estimatedRefund.toFixed(2)}{' '}
                                            EGP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'details' && (
                        <div className="space-y-6" data-oid="7d-pber">
                            <div data-oid="r5kxnb1">
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="efhozdq"
                                >
                                    {tCustomer('returnOrder.content.details.title')}
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid="7tq.pr:">
                                    {tCustomer('returnOrder.content.details.description')}
                                </p>
                            </div>

                            <div className="space-y-4" data-oid="d8k4:o8">
                                <div data-oid=".6h:gpe">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="cxu3np."
                                    >
                                        {tCustomer('returnOrder.content.primaryReturnReason')}
                                    </label>
                                    <select
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                        data-oid="3kq3mc6"
                                    >
                                        <option value="" data-oid="2adqh.k">
                                            {tCustomer(
                                                'returnOrder.content.details.selectPrimaryReason',
                                            )}
                                        </option>
                                        {returnPolicy.allowedReasons.map((reason) => (
                                            <option key={reason} value={reason} data-oid="yrw5fgb">
                                                {translateReason(reason)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div data-oid="xzmybd9">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid=":ca:l.r"
                                    >
                                        {tCustomer('returnOrder.content.additionalNotes')}
                                    </label>
                                    <textarea
                                        value={returnDescription}
                                        onChange={(e) => setReturnDescription(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                                        placeholder={tCustomer(
                                            'returnOrder.content.details.detailsPlaceholder',
                                        )}
                                        data-oid="pjdalfr"
                                    />
                                </div>

                                <div data-oid="ejtv2gq">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="qpc-jki"
                                    >
                                        {tCustomer('returnOrder.content.additionalNotes')}
                                    </label>
                                    <textarea
                                        value={customerNotes}
                                        onChange={(e) => setCustomerNotes(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                                        placeholder={tCustomer(
                                            'returnOrder.content.details.additionalNotesPlaceholder',
                                        )}
                                        data-oid="3rlndj1"
                                    />
                                </div>
                            </div>

                            {/* Return Summary */}
                            <div className="bg-gray-50 rounded-xl p-4" data-oid="g4nr4zw">
                                <h4 className="font-semibold text-gray-900 mb-3" data-oid="swcrdux">
                                    {tCustomer('returnOrder.content.details.returnSummary')}
                                </h4>
                                <div className="space-y-2 text-sm" data-oid="9hk.m5x">
                                    <div className="flex justify-between" data-oid="9k_tviu">
                                        <span data-oid="u7vab32">
                                            {tCustomer('returnOrder.content.details.itemsToReturn')}
                                        </span>
                                        <span data-oid="-:cjzx0">
                                            {
                                                returnItems.filter(
                                                    (item) => item.returnQuantity > 0,
                                                ).length
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between" data-oid="kd0qzkb">
                                        <span data-oid="5pr:ilf">
                                            {tCustomer('returnOrder.content.details.totalQuantity')}
                                        </span>
                                        <span data-oid="epl971p">
                                            {returnItems.reduce(
                                                (sum, item) => sum + item.returnQuantity,
                                                0,
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between font-semibold"
                                        data-oid="3.sprno"
                                    >
                                        <span data-oid="0uac1g9">
                                            {tCustomer('returnOrder.content.details.totalRefund')}
                                        </span>
                                        <span data-oid="0m48jld">
                                            {isNaN(estimatedRefund)
                                                ? '0.00'
                                                : estimatedRefund.toFixed(2)}{' '}
                                            EGP
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'confirmation' && (
                        <div className="text-center space-y-6" data-oid="mecdxhg">
                            <div
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                data-oid="-uue9hv"
                            >
                                <CheckCircle
                                    className="w-10 h-10 text-green-600"
                                    data-oid="__w-yn."
                                />
                            </div>
                            <div data-oid="8bob0xl">
                                <h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    data-oid="qftoyqx"
                                >
                                    Return Request Submitted
                                </h3>
                                <p className="text-gray-600" data-oid="l-5peh1">
                                    Your return request has been submitted successfully. We{"'"}ll
                                    review it and get back to you within 1-2 business days.
                                </p>
                            </div>
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                                data-oid="8esputc"
                            >
                                <h4 className="font-semibold text-blue-800 mb-2" data-oid="ztb4y89">
                                    What happens next?
                                </h4>
                                <ul
                                    className="text-sm text-blue-700 space-y-1 text-left"
                                    data-oid="j1ur2v."
                                >
                                    <li data-oid="iyp.ia6">• We{"'"}ll review your return request</li>
                                    <li data-oid="ri3-97.">
                                        • You{"'"}ll receive an email with return instructions
                                    </li>
                                    <li data-oid="7cldn-k">
                                        • Package and send the items back to us
                                    </li>
                                    <li data-oid="60zv::8">
                                        • Refund will be processed within 3-5 business days
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Footer */}
                <div className="border-t border-gray-200 p-6" data-oid=".gfau..">
                    <div className="flex justify-between" data-oid="amh0n82">
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            data-oid="niw3c7w"
                        >
                            {step === 'confirmation'
                                ? tCustomer('orderDetails.buttons.close')
                                : tCustomer('returnOrder.buttons.cancel')}
                        </button>

                        <div className="flex space-x-3" data-oid="fr3l62m">
                            {step !== 'eligibility' && step !== 'confirmation' && (
                                <button
                                    onClick={() => {
                                        const steps = [
                                            'eligibility',
                                            'items',
                                            'details',
                                            'confirmation',
                                        ];

                                        const currentIndex = steps.indexOf(step);
                                        if (currentIndex > 0) {
                                            setStep(steps[currentIndex - 1] as any);
                                        }
                                    }}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                    data-oid=":guihx_"
                                >
                                    {tCustomer('returnOrder.buttons.back')}
                                </button>
                            )}

                            {step === 'eligibility' && eligibilityCheck?.canReturn && (
                                <button
                                    onClick={() => setStep('items')}
                                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                    data-oid="eb16t5y"
                                >
                                    {tCustomer('returnOrder.buttons.continue')}
                                </button>
                            )}

                            {step === 'items' && (
                                <button
                                    onClick={() => setStep('details')}
                                    disabled={
                                        returnItems.filter(
                                            (item) => item.returnQuantity > 0 && item.reason,
                                        ).length === 0
                                    }
                                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    data-oid="f9ude.l"
                                >
                                    {tCustomer('returnOrder.buttons.continue')}
                                </button>
                            )}

                            {step === 'details' && (
                                <button
                                    onClick={handleSubmitReturn}
                                    disabled={!returnReason || isSubmitting}
                                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    data-oid="5nznqs:"
                                >
                                    {isSubmitting
                                        ? tCustomer('returnOrder.content.details.submitting')
                                        : tCustomer('returnOrder.content.details.submitRequest')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
