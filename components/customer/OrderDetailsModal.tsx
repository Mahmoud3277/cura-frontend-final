'use client';
import { useState } from 'react';
import { X, Package, MapPin, Calendar, Banknote, FileText, Upload, Check } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
interface OrderItem {
    name: string;
    quantity: number;
    image: string;
}
interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    total: string;
    status: string;
    pharmacy: string;
    deliveryAddress: string;
    estimatedDate: string;
    cancelReason?: string;
    prescriptionRequired?: boolean;
    prescriptionId?: string;
}
interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onBuyAgain?: (order: Order) => void;
    onReturnOrder?: (order: Order) => void;
}
export function OrderDetailsModal({
    order,
    isOpen,
    onClose,
    onBuyAgain,
    onReturnOrder,
}: OrderDetailsModalProps) {
    console.log(order)
    const { locale } = useLanguage();
    const { t: tCustomer } = useTranslation(locale, 'customer');
    const [activeTab, setActiveTab] = useState<'details' | 'prescription' | 'tracking'>('details');

    // Helper function to normalize image field (convert string to object if needed)
    const normalizeImage = (image: any): string => {
        if (typeof image === 'string') {
            // Check if the string looks like a JSON object (starts with '{' and contains 'url')
            if (image.trim().startsWith('{') && image.includes('url')) {
                // First, try regex extraction as it's more reliable for malformed JSON
                const urlMatch = image.match(/url:\s*['"]([^'"]+)['"]/);
                if (urlMatch) {
                    return urlMatch[1];
                }

                // If regex fails, try to fix and parse JSON
                try {
                    // Handle malformed JSON (single quotes, no quotes around keys, etc.)
                    let jsonString = image.trim();

                    // Replace single quotes with double quotes for property values
                    jsonString = jsonString.replace(/'([^']*)'/g, '"$1"');

                    // Add double quotes around property names
                    jsonString = jsonString.replace(/(\w+):/g, '"$1":');

                    // Handle ObjectId format
                    jsonString = jsonString.replace(/"_id":\s*new ObjectId\("([^"]+)"\)/g, '"_id": "$1"');

                    // Handle date format
                    jsonString = jsonString.replace(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/g, '"$1"');

                    console.log('Attempting to parse JSON:', jsonString);

                    // Try to parse the corrected JSON string
                    const parsedImage = JSON.parse(jsonString);
                    if (parsedImage && parsedImage.url) {
                        return parsedImage.url;
                    }
                } catch (error) {
                    console.warn('Failed to parse image JSON string:', error, 'Original:', image);
                }
            }
            // If it's not JSON or parsing failed, return as is (regular URL string)
            return image;
        } else if (typeof image === 'object' && image !== null) {
            // If it's an object, try to extract the URL
            if (image.url) {
                return image.url;
            } else if (image.src) {
                return image.src;
            } else if (Array.isArray(image) && image.length > 0) {
                // If it's an array, take the first item
                if (typeof image[0] === 'string') {
                    return image[0];
                } else if (image[0] && image[0].url) {
                    return image[0].url;
                }
            }
        }
        // Fallback to empty string if we can't extract a URL
        return '';
    };

    // Helper function to get image source with fallback
    const getImageSource = (imageUrl: string | undefined) => {
        if (!imageUrl || imageUrl.trim() === '') {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
        }
        return imageUrl;
    };
    if (!isOpen || !order) return null;
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
            data-oid="r8d3xvf"
        >
            {' '}
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                data-oid="4b-wwl0"
            >
                {' '}
                {/* Header */}{' '}
                <div
                    className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white p-6"
                    data-oid=":c.6ixl"
                >
                    {' '}
                    <div className="flex items-center justify-between" data-oid="-3:l15g">
                        {' '}
                        <div className="flex items-center space-x-4" data-oid="c7x7s67">
                            {' '}
                            <div
                                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                                data-oid="htbj9-v"
                            >
                                {' '}
                                <Package className="w-6 h-6" data-oid="8.dq7gx" />{' '}
                            </div>{' '}
                            <div data-oid="j26:o6n">
                                {' '}
                                <h2 className="text-2xl font-bold" data-oid="sy7knxt">
                                    {' '}
                                    {tCustomer('orderDetails.title')}{' '}
                                </h2>{' '}
                                <p className="text-blue-100" data-oid="-ftn9qa">
                                    {' '}
                                    {order._id}{' '}
                                </p>{' '}
                            </div>{' '}
                        </div>{' '}
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            data-oid="im4c.pd"
                        >
                            {' '}
                            <X className="w-5 h-5" data-oid="cty0niy" />{' '}
                        </button>{' '}
                    </div>{' '}
                </div>{' '}
                {/* Tabs */}{' '}
                <div className="border-b border-gray-200" data-oid="wj_fpq-">
                    {' '}
                    <nav className="flex space-x-8 px-6" data-oid="7m50725">
                        {' '}
                        {[
                            {
                                id: 'details',
                                label: tCustomer('orderDetails.tabs.details'),
                                icon: Package,
                            },
                            {
                                id: 'prescription',
                                label: tCustomer('orderDetails.tabs.prescription'),
                                icon: FileText,
                            },
                            {
                                id: 'tracking',
                                label: tCustomer('orderDetails.tabs.tracking'),
                                icon: MapPin,
                            },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${activeTab === tab.id ? 'border-[#1F1F6F] text-[#1F1F6F]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                    data-oid=":ogabbb"
                                >
                                    {' '}
                                    <Icon className="w-4 h-4" data-oid="3_v7i69" />{' '}
                                    <span data-oid="d:u_1qw">{tab.label}</span>{' '}
                                </button>
                            );
                        })}{' '}
                    </nav>{' '}
                </div>{' '}
                {/* Content */}{' '}
                <div className="p-6 max-h-[60vh] overflow-y-auto" data-oid="j0fxtu8">
                    {' '}
                    {activeTab === 'details' && (
                        <div className="space-y-6" data-oid="uu8x-2p">
                            {' '}
                            {/* Order Info Grid */}{' '}
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                data-oid="31:02.x"
                            >
                                {' '}
                                <div className="bg-gray-50 rounded-xl p-4" data-oid="ovfqirp">
                                    {' '}
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="o42wcsu"
                                    >
                                        {' '}
                                        <Calendar
                                            className="w-5 h-5 text-[#1F1F6F]"
                                            data-oid="ka3wphv"
                                        />{' '}
                                        <h3
                                            className="font-semibold text-gray-900"
                                            data-oid="fmyvyha"
                                        >
                                            {' '}
                                            {tCustomer('orderDetails.fields.orderDate')}{' '}
                                        </h3>{' '}
                                    </div>{' '}
                                    <p className="text-gray-700" data-oid="t0dbj:n">
                                        {' '}
                                        {order.date}{' '}
                                    </p>{' '}
                                    <p className="text-sm text-gray-500 mt-1" data-oid=".i946q1">
                                        {' '}
                                        {order.estimatedDate}{' '}
                                    </p>{' '}
                                </div>{' '}
                                <div className="bg-gray-50 rounded-xl p-4" data-oid="qt4plyc">
                                    {' '}
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="xli2.mq"
                                    >
                                        {' '}
                                        <MapPin
                                            className="w-5 h-5 text-[#1F1F6F]"
                                            data-oid="tlx2ctr"
                                        />{' '}
                                        <h3
                                            className="font-semibold text-gray-900"
                                            data-oid="3:8nmmb"
                                        >
                                            {' '}
                                            {tCustomer('orderDetails.fields.pharmacy')}{' '}
                                        </h3>{' '}
                                    </div>{' '}
                                    <p className="text-gray-700" data-oid="l8sutqy">
                                        {' '}
                                        {order.pharmacyName}{' '}
                                    </p>{' '}
                                    <p className="text-sm text-gray-500 mt-1" data-oid="pckudf2">
                                        {' '}
                                        {order.deliveryAddress.street + order.deliveryAddress.city}{' '}
                                    </p>{' '}
                                </div>{' '}
                                <div className="bg-gray-50 rounded-xl p-4" data-oid="9ampj5v">
                                    {' '}
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="um52j9x"
                                    >
                                        {' '}
                                        <Banknote
                                            className="w-5 h-5 text-[#1F1F6F]"
                                            data-oid="evg198."
                                        />{' '}
                                        <h3
                                            className="font-semibold text-gray-900"
                                            data-oid="j.z05vu"
                                        >
                                            {' '}
                                            {tCustomer('orderDetails.fields.totalAmount')}{' '}
                                        </h3>{' '}
                                    </div>{' '}
                                    <p
                                        className="text-2xl font-bold text-[#1F1F6F]"
                                        data-oid="s38h2q1"
                                    >
                                        {' '}
                                        {order.totalAmount}{' '} EGP
                                    </p>{' '}
                                    {order.prescriptionRequired && (
                                        <div
                                            className="mt-3 pt-3 border-t border-gray-200"
                                            data-oid="b.kncie"
                                        >
                                            {' '}
                                            <span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                data-oid="3.ar4ub"
                                            >
                                                {' '}
                                                📋 Prescription Order{' '}
                                            </span>{' '}
                                            {order.prescriptionId && (
                                                <p
                                                    className="text-xs text-gray-600 mt-1"
                                                    data-oid="g81gqp."
                                                >
                                                    {' '}
                                                    Prescription ID: {order.prescriptionId}{' '}
                                                </p>
                                            )}{' '}
                                        </div>
                                    )}{' '}
                                </div>{' '}
                                <div className="bg-gray-50 rounded-xl p-4" data-oid="evq4oxt">
                                    {' '}
                                    <div
                                        className="flex items-center space-x-3 mb-3"
                                        data-oid="yjoivft"
                                    >
                                        {' '}
                                        <Package
                                            className="w-5 h-5 text-[#1F1F6F]"
                                            data-oid="j5emem9"
                                        />{' '}
                                        <h3
                                            className="font-semibold text-gray-900"
                                            data-oid="51i1j6."
                                        >
                                            {' '}
                                            {tCustomer('orderDetails.fields.status')}{' '}
                                        </h3>{' '}
                                    </div>{' '}
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}
                                        data-oid="85:i4f:"
                                    >
                                        {' '}
                                        {order.status}{' '}
                                    </span>{' '}
                                    {order.cancelReason && (
                                        <p className="text-sm text-red-600 mt-2" data-oid="sqc034r">
                                            {' '}
                                            Reason: {order.cancelReason}{' '}
                                        </p>
                                    )}{' '}
                                </div>{' '}
                            </div>{' '}
                            {/* Order Items */}{' '}
                            <div data-oid="s5fi7m0">
                                {' '}
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="v3y1tjr"
                                >
                                    {' '}
                                    {tCustomer('orderDetails.fields.orderItems')}{' '}
                                </h3>{' '}
                                <div className="space-y-3" data-oid="k9g4ou1">
                                    {' '}
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                                            data-oid="i4b:hu-"
                                        >
                                            {' '}
                                            <div
                                                className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0"
                                                data-oid="l6hcgf-"
                                            >
                                                <img
                                                    src={getImageSource(normalizeImage(item.image))}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Fallback to a default image if the product image fails to load
                                                        e.currentTarget.src =
                                                            '/images/products/default-medicine.jpg';
                                                    }}
                                                    data-oid="_6957bt"
                                                />
                                            </div>{' '}
                                            <div className="flex-1" data-oid="hls-kye">
                                                {' '}
                                                <h4
                                                    className="font-semibold text-gray-900"
                                                    data-oid="adsyyk."
                                                >
                                                    {' '}
                                                    {item.productName}{' '}
                                                </h4>{' '}
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="yhz78em"
                                                >
                                                    {' '}
                                                    {tCustomer(
                                                        'orderDetails.fields.quantity',
                                                    )}: {item.quantity}{' '}
                                                </p>{' '}
                                            </div>{' '}
                                        </div>
                                    ))}{' '}
                                </div>{' '}
                            </div>{' '}
                        </div>
                    )}{' '}
                    {activeTab === 'prescription' && order.prescriptionRequired ? (
                        <div className="space-y-6" data-oid="xdxtu.u">
                            {' '}
                            <div className="text-center py-8" data-oid="f7v2dlo">
                                {' '}
                                <div
                                    className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    data-oid="b.4lz23"
                                >
                                    {' '}
                                    <FileText
                                        className="w-10 h-10 text-[#1F1F6F]"
                                        data-oid="0m92bq5"
                                    />{' '}
                                </div>{' '}
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="27sh4ox"
                                >
                                    {' '}
                                    {tCustomer('orderDetails.prescription.title')}{' '}
                                </h3>{' '}
                                <p className="text-gray-600 mb-6" data-oid="utg-c-v">
                                    {' '}
                                    {tCustomer('orderDetails.prescription.description')}{' '}
                                </p>{' '}
                            </div>{' '}
                            {/* Prescription Verification Status */}{' '}
                            <div
                                className="bg-green-50 border border-green-200 rounded-xl p-4"
                                data-oid="ap2k4v5"
                            >
                                {' '}
                                <div className="flex items-center space-x-3" data-oid="h15exjc">
                                    {' '}
                                    <div
                                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                                        data-oid="ases62:"
                                    >
                                        {' '}
                                        <Check
                                            className="w-4 h-4 text-white"
                                            data-oid="3r72fnz"
                                        />{' '}
                                    </div>{' '}
                                    <div data-oid="elz5pmt">
                                        {' '}
                                        <h4
                                            className="font-semibold text-green-800"
                                            data-oid="6gnr9h1"
                                        >
                                            {' '}
                                            {tCustomer('orderDetails.prescription.verified')}{' '}
                                        </h4>{' '}
                                        <p className="text-sm text-green-700" data-oid="l0:gnpm">
                                            {' '}
                                            {tCustomer(
                                                'orderDetails.prescription.verifiedDesc',
                                            )}{' '}
                                        </p>{' '}
                                    </div>{' '}
                                </div>{' '}
                            </div>{' '}
                            {/* Prescription Items */}{' '}
                            {order.prescriptionRequired ? <div
                                className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                                data-oid="e:zz7fg"
                            >
                                {' '}
                                <h4
                                    className="font-semibold text-amber-800 mb-2"
                                    data-oid="ounih0:"
                                >
                                    {' '}
                                    {tCustomer('orderDetails.prescription.itemsInOrder')}{' '}
                                </h4>{' '}
                                <div className="space-y-2" data-oid="c994v7s">
  {order.items.map((item, index) => (
    <div
      key={index}
      className="flex items-center space-x-2"
      data-oid="g5-kgv1"
    >
      <span className="text-amber-700" data-oid="c1c.5q4">
        •
      </span>
      <span className="text-amber-800" data-oid="vs0v45d">
        {item.prescription.prescriptionNumber} {item.quantity}: {item.productName})
      </span>
    </div>
  ))}
</div>
                            </div>:<p>no precription</p>}
                        </div>
                    ):<p>no prescription</p>}
                    {activeTab === 'tracking' && order.statusHistory ? (
                        <div className="space-y-6" data-oid="9-uwp19">
                            {' '}
                            <div className="text-center py-4" data-oid="4fvcr:h">
                                {' '}
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-2"
                                    data-oid="_.-x33i"
                                >
                                    {' '}
                                    {tCustomer('orderDetails.tracking.title')}{' '}
                                </h3>{' '}
                                <p className="text-gray-600" data-oid="-hgp9rf">
                                    {' '}
                                    {tCustomer('orderDetails.tracking.description')}{' '}
                                </p>{' '}
                            </div>{' '}
                            {/* Tracking Timeline */}{' '}
                            <div className="space-y-4" data-oid="2j99k_j">
                                {' '}
                                {[
                                    {
                                        status: tCustomer('orderDetails.tracking.orderPlaced'),
                                        date: order.date,
                                        completed: true,
                                        description: tCustomer(
                                            'orderDetails.tracking.orderPlacedDesc',
                                        ),
                                    },
                                    {
                                        status: tCustomer('orderDetails.tracking.processing'),
                                        date: order.date,
                                        completed: order.status !== 'cancelled',
                                        description: tCustomer(
                                            'orderDetails.tracking.processingDesc',
                                        ),
                                    },
                                    {
                                        status: tCustomer('orderDetails.tracking.outForDelivery'),
                                        date: order.status === 'Delivered' ? order.date : '',
                                        completed: order.status === 'delivered',
                                        description: tCustomer(
                                            'orderDetails.tracking.outForDeliveryDesc',
                                        ),
                                    },
                                    {
                                        status: tCustomer('orderDetails.tracking.delivered'),
                                        date:
                                            order.status === 'delivered' ? order.estimatedDate : '',
                                        completed: order.status === 'delivered',
                                        description: tCustomer(
                                            'orderDetails.tracking.deliveredDesc',
                                        ),
                                    },
                                ].map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4"
                                        data-oid="9x-0w8h"
                                    >
                                        {' '}
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                                            data-oid="nasmw1_"
                                        >
                                            {' '}
                                            {step.completed ? (
                                                <Check className="w-4 h-4" data-oid="817b198" />
                                            ) : (
                                                <span
                                                    className="text-xs font-bold"
                                                    data-oid="jf.-cce"
                                                >
                                                    {' '}
                                                    {index + 1}{' '}
                                                </span>
                                            )}{' '}
                                        </div>{' '}
                                        <div className="flex-1" data-oid="-.026d2">
                                            {' '}
                                            <h4
                                                className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}
                                                data-oid="bd0gmq0"
                                            >
                                                {' '}
                                                {step.status}{' '}
                                            </h4>{' '}
                                            <p className="text-sm text-gray-600" data-oid="uh87co3">
                                                {' '}
                                                {step.description}{' '}
                                            </p>{' '}
                                            {step.date && (
                                                <p
                                                    className="text-xs text-gray-500 mt-1"
                                                    data-oid="e8039q0"
                                                >
                                                    {' '}
                                                    {step.date}{' '}
                                                </p>
                                            )}{' '}
                                        </div>{' '}
                                    </div>
                                ))}{' '}
                            </div>{' '}
                            {/* Delivery Info */}{' '}
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                                data-oid="w-ji_rw"
                            >
                                {' '}
                                <h4 className="font-semibold text-blue-800 mb-2" data-oid="jmj9hhr">
                                    {' '}
                                    {tCustomer('orderDetails.tracking.deliveryInfo')}{' '}
                                </h4>{' '}
                                <div className="space-y-1 text-sm text-blue-700" data-oid="zus7r.a">
                                    {' '}
                                    <p data-oid="odpsq3m">
                                        {' '}
                                        <strong data-oid="wgylds:">
                                            {tCustomer('orderDetails.tracking.address')}:
                                        </strong>{' '}
                                        {order.deliveryAddress.street}{' '}
                                    </p>{' '}
                                    <p data-oid="d081_vw">
                                        {' '}
                                        <strong data-oid="zwl23n2">
                                            {tCustomer('orderDetails.tracking.estimatedTime')}:
                                        </strong>{' '}
                                        {order.estimatedDate}{' '}
                                    </p>{' '}
                                    <p data-oid="fmm96zh">
                                        {' '}
                                        <strong data-oid="1r6.7k9">
                                            {tCustomer('orderDetails.tracking.deliveryMethod')}:
                                        </strong>{' '}
                                        {tCustomer('orderDetails.tracking.standardDelivery')}{' '}
                                    </p>{' '}
                                </div>{' '}
                            </div>{' '}
                        </div>
                    ):<p>No tracking Information</p>}{' '}
                </div>
                {/* Footer */}{' '}
                <div className="border-t border-gray-200 p-6" data-oid="dfppcip">
                    {' '}
                    <div className="flex justify-between" data-oid="3ilfw04">
                        {' '}
                        <div className="flex space-x-3" data-oid="-vbqrt.">
                            {order.status === 'delivered' && onReturnOrder && !order.returnInfo && (
                                <button
                                    onClick={() => {
                                        onReturnOrder(order);
                                        onClose();
                                    }}
                                    className="px-6 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                    data-oid="kyy1qu0"
                                >
                                    {tCustomer('orderDetails.buttons.returnOrder')}
                                </button>
                            )}
                            {order.returnInfo && (
                                <div
                                    className="flex items-center space-x-2 text-sm"
                                    data-oid=".-gzc26"
                                >
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            order.returnInfo.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : order.returnInfo.status === 'approved'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : order.returnInfo.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                        data-oid="0ke3whc"
                                    >
                                        Return {order.returnInfo.status}
                                    </span>
                                    {order.returnInfo.status === 'completed' && (
                                        <span
                                            className="text-green-600 font-medium"
                                            data-oid="1yt5851"
                                        >
                                            Refunded: {order.returnInfo.refundAmount.toFixed(2)} EGP
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-3" data-oid="g7-goy5">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                data-oid="7df.yk8"
                            >
                                {' '}
                                {tCustomer('orderDetails.buttons.close')}{' '}
                            </button>{' '}
                            {(order.status === 'delivered' || order.status === 'processing') &&
                                onBuyAgain && (
                                    <button
                                        onClick={() => {
                                            onBuyAgain(order);
                                            onClose();
                                        }}
                                        className="px-6 py-2 bg-[#1F1F6F] text-white rounded-xl hover:bg-[#14274E] transition-colors"
                                        data-oid="68wexyk"
                                    >
                                        {' '}
                                        {order.prescriptionRequired
                                            ? 'Reorder with Prescription'
                                            : tCustomer('orderDetails.buttons.buyAgain')}{' '}
                                    </button>
                                )}{' '}
                        </div>
                    </div>{' '}
                </div>{' '}
            </div>{' '}
        </div>
    );
}
