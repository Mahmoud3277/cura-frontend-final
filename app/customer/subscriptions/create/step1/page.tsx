'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { products } from '@/lib/data/products';
import { Product } from '@/lib/types';
import Link from 'next/link';

// Helper component for price information
function PriceInfo({ productName }: { productName: string }) {
    const sameProducts = products.filter(
        (product) => product.name === productName && product.availability?.inStock,
    );

    if (sameProducts.length === 0) return null;

    const totalPrice = sameProducts.reduce((sum, product) => sum + product.price, 0);
    const avgPrice = totalPrice / sameProducts.length;
    const prices = sameProducts.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return (
        <div className="text-xs text-gray-500" data-oid="xv6te6o">
            <div className="text-sm font-semibold text-[#1F1F6F]" data-oid="h1ze_hu">
                Avg: {avgPrice.toFixed(2)} EGP
            </div>
            {sameProducts.length > 1 && (
                <div data-oid="eqvdq4w">
                    Range: {minPrice.toFixed(2)} - {maxPrice.toFixed(2)} EGP
                </div>
            )}
        </div>
    );
}

// Helper component for selected product price info
function SelectedProductPriceInfo({
    productName,
    isMedicine,
    unitType,
}: {
    productName: string;
    isMedicine: boolean;
    unitType: 'blister' | 'box';
}) {
    const sameProducts = products.filter(
        (product) => product.name === productName && product.availability?.inStock,
    );

    if (sameProducts.length === 0) return null;

    const totalPrice = sameProducts.reduce((sum, product) => sum + product.price, 0);
    const avgPrice = totalPrice / sameProducts.length;
    const avgUnitPrice = isMedicine && unitType === 'blister' ? avgPrice * 0.4 : avgPrice;

    return (
        <div className="text-xs text-gray-500" data-oid=":of_ej5">
            <div className="text-sm font-semibold text-[#1F1F6F]" data-oid="2fnf9-o">
                Avg: {avgUnitPrice.toFixed(2)} EGP per {isMedicine ? unitType : 'item'}
            </div>
        </div>
    );
}

export default function CreateSubscriptionStep1() {
    const router = useRouter();
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);

    const [selectedProducts, setSelectedProducts] = useState<
        Array<{
            productId: string;
            pharmacyId: string;
            quantity: number;
            product: Product;
            unitType: 'blister' | 'box';
        }>
    >([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [availableProducts, setavailableProducts] = useState([]);
    // Load saved data from localStorage on mount
    useEffect(() => {
        let savedData;
        if (typeof window !== 'undefined') {
            savedData = localStorage.getItem('subscription_step1_data');
        }
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                setSelectedProducts(data.selectedProducts || []);
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }, []);

    // Save data to localStorage whenever selectedProducts changes
    useEffect(() => {
        const dataToSave = {
            selectedProducts,
        };
        if (typeof window !== 'undefined') {
            localStorage.setItem('subscription_step1_data', JSON.stringify(dataToSave));
        }
    }, [selectedProducts]);

    // Helper functions
    const isMedicine = (product: Product): boolean => {
        return ['otc', 'prescription'].includes(product.category);
    };
    if(products){
        const productsAvailable = products.filter(
            (product) =>
                product.availability?.inStock &&
                (searchQuery === '' ||
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.nameAr.includes(searchQuery)),
        );
        if(productsAvailable){
            setavailableProducts(productsAvailable)
        }
    }

    const addProduct = (product: Product) => {
        const existing = selectedProducts.find((item) => item.productId === product.id.toString());
        if (existing) {
            setSelectedProducts((prev) =>
                prev.map((item) =>
                    item.productId === product.id.toString()
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                ),
            );
        } else {
            setSelectedProducts((prev) => [
                ...prev,
                {
                    productId: product.id.toString(),
                    pharmacyId: product.pharmacyId,
                    quantity: 1,
                    product,
                    unitType: isMedicine(product) ? 'box' : 'box',
                },
            ]);
        }
    };

    const removeProduct = (productId: string) => {
        setSelectedProducts((prev) => prev.filter((item) => item.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeProduct(productId);
            return;
        }
        setSelectedProducts((prev) =>
            prev.map((item) => {
                if (item.productId === productId) {
                    return { ...item, quantity };
                }
                return item;
            }),
        );
    };

    const updateQuantityUnit = (productId: string, unitType: 'blister' | 'box') => {
        setSelectedProducts((prev) =>
            prev.map((item) => {
                if (item.productId === productId) {
                    if (isMedicine(item.product)) {
                        return { ...item, unitType };
                    }
                }
                return item;
            }),
        );
    };

    const handleNext = () => {
        if (selectedProducts.length > 0) {
            router.push('/customer/subscriptions/create/step2');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" data-oid="zb0.spm">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10" data-oid="-ceodvy">
                <div className="flex items-center justify-between px-4 py-3" data-oid="bx0gohb">
                    <div className="flex items-center space-x-3" data-oid="zzds1.j">
                        <Link
                            href="/customer/subscriptions"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            data-oid="in_vlf4"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="owzjy75"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                    data-oid="_ynp4hw"
                                />
                            </svg>
                        </Link>
                        <h1 className="text-lg font-semibold text-gray-900" data-oid="1k.cmp:">
                            {t('subscription.create.title')}
                        </h1>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center px-4 pb-3" data-oid="504n-yq">
                    {[
                        { number: 1, label: t('subscription.create.step1') },
                        { number: 2, label: t('subscription.create.choosePlan') },
                        { number: 3, label: t('subscription.create.confirmOrder') },
                    ].map((stepInfo, index) => (
                        <div key={stepInfo.number} className="flex items-center" data-oid="n9.x-b-">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    1 >= stepInfo.number
                                        ? 'bg-[#1F1F6F] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                                data-oid="9v9krmd"
                            >
                                {stepInfo.number}
                            </div>
                            <span
                                className={`ml-1 text-xs ${
                                    1 >= stepInfo.number
                                        ? 'text-[#1F1F6F] font-medium'
                                        : 'text-gray-500'
                                }`}
                                data-oid="y80zq78"
                            >
                                {stepInfo.label}
                            </span>
                            {index < 2 && (
                                <div
                                    className={`w-6 h-0.5 mx-2 ${
                                        1 > stepInfo.number ? 'bg-[#1F1F6F]' : 'bg-gray-200'
                                    }`}
                                    data-oid="f_y-2-a"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-24" data-oid="2nnyyp-">
                <div className="space-y-4" data-oid="y4rpef7">
                    <div data-oid="xz03otk">
                        <h3
                            className="text-base font-semibold text-gray-900 mb-4"
                            data-oid="murg.a4"
                        >
                            {t('subscription.create.selectProducts')}
                        </h3>

                        {/* Search */}
                        <div className="mb-4" data-oid="wdu.unu">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('subscription.create.searchProducts')}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                data-oid="0-e2ow3"
                            />
                        </div>

                        {/* Selected Products */}
                        {selectedProducts.length > 0 && (
                            <div className="mb-4" data-oid="8tgk62j">
                                <h4
                                    className="text-sm font-medium text-gray-900 mb-3"
                                    data-oid="-5n1463"
                                >
                                    {t('subscription.create.selectedProducts')} (
                                    {selectedProducts.length})
                                </h4>
                                <div className="space-y-2" data-oid="s_62p01">
                                    {selectedProducts.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                                            data-oid="na8levx"
                                        >
                                            {/* Top Row: Image, Product Info, and Controls */}
                                            <div
                                                className="flex items-start gap-3 mb-3"
                                                data-oid="1yc219j"
                                            >
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                                    data-oid="e.s:w12"
                                                />

                                                <div className="flex-1 min-w-0" data-oid="7o1p9q4">
                                                    <h5
                                                        className="text-sm font-medium text-gray-900 mb-1"
                                                        data-oid="i4rzne:"
                                                    >
                                                        {locale === 'ar'
                                                            ? item.product.nameAr
                                                            : item.product.name}
                                                    </h5>
                                                    <SelectedProductPriceInfo
                                                        productName={item.product.name}
                                                        isMedicine={isMedicine(item.product)}
                                                        unitType={item.unitType}
                                                        data-oid="ylwi6wc"
                                                    />
                                                </div>

                                                <div
                                                    className="flex items-center gap-2 flex-shrink-0"
                                                    data-oid="4yh8et3"
                                                >
                                                    <div
                                                        className="flex flex-col items-center"
                                                        data-oid=".g5x48a"
                                                    >
                                                        <p
                                                            className="text-xs font-medium text-gray-700 mb-1"
                                                            data-oid="k240tlk"
                                                        >
                                                            {t(
                                                                'subscription.create.purchaseOptions.quantity',
                                                            )}
                                                            :
                                                        </p>
                                                        <div
                                                            className="flex items-center gap-1"
                                                            data-oid="1hwe9cx"
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.productId,
                                                                        item.quantity - 1,
                                                                    )
                                                                }
                                                                className="w-6 h-6 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] flex items-center justify-center hover:bg-[#1F1F6F] hover:text-white transition-colors text-xs"
                                                                data-oid="3e2jac7"
                                                            >
                                                                -
                                                            </button>
                                                            <div
                                                                className="flex flex-col items-center min-w-[25px]"
                                                                data-oid="bdy:os2"
                                                            >
                                                                <span
                                                                    className="text-sm font-bold text-[#1F1F6F]"
                                                                    data-oid="r-by4.a"
                                                                >
                                                                    {item.quantity}
                                                                </span>
                                                                <span
                                                                    className="text-xs text-gray-500"
                                                                    data-oid="8wwj_aj"
                                                                >
                                                                    {isMedicine(item.product)
                                                                        ? item.unitType ===
                                                                          'blister'
                                                                            ? t(
                                                                                  'subscription.create.purchaseOptions.blisterUnit',
                                                                              )
                                                                            : t(
                                                                                  'subscription.create.purchaseOptions.boxUnit',
                                                                              )
                                                                        : t(
                                                                              'subscription.create.purchaseOptions.itemUnit',
                                                                          )}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.productId,
                                                                        item.quantity + 1,
                                                                    )
                                                                }
                                                                className="w-6 h-6 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] flex items-center justify-center hover:bg-[#1F1F6F] hover:text-white transition-colors text-xs"
                                                                data-oid="p69sl8c"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            removeProduct(item.productId)
                                                        }
                                                        className="w-7 h-7 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                                        data-oid=":r8oz_t"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="r-nifcq"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                data-oid="xpdppcw"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Bottom Row: Medicine Options */}
                                            {isMedicine(item.product) && (
                                                <div data-oid="djl:pgg">
                                                    <p
                                                        className="text-xs font-medium text-gray-700 mb-2"
                                                        data-oid="mnjtktb"
                                                    >
                                                        {t('subscription.create.purchaseOption')}:
                                                    </p>
                                                    <div className="flex gap-2" data-oid="thc::v_">
                                                        <div
                                                            className={`flex-1 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                                                                item.unitType === 'blister'
                                                                    ? 'border-[#1F1F6F] bg-blue-50 shadow-sm'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                            }`}
                                                            onClick={() =>
                                                                updateQuantityUnit(
                                                                    item.productId,
                                                                    'blister',
                                                                )
                                                            }
                                                            data-oid="pdst33b"
                                                        >
                                                            <div
                                                                className="flex items-center justify-start gap-2"
                                                                data-oid="dktuh1h"
                                                            >
                                                                <div
                                                                    className="text-base"
                                                                    data-oid="f3ma33v"
                                                                >
                                                                    💊
                                                                </div>
                                                                <div
                                                                    className="flex flex-col"
                                                                    data-oid="y77k5lk"
                                                                >
                                                                    <div
                                                                        className="text-xs font-semibold text-gray-900"
                                                                        data-oid="r7srt25"
                                                                    >
                                                                        {t(
                                                                            'subscription.create.purchaseOptions.perBlister',
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="text-xs text-gray-600 font-medium"
                                                                        data-oid="ieqtia9"
                                                                    >
                                                                        {(
                                                                            item.product.price * 0.4
                                                                        ).toFixed(1)}{' '}
                                                                        EGP
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`flex-1 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                                                                item.unitType === 'box'
                                                                    ? 'border-[#1F1F6F] bg-blue-50 shadow-sm'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                            }`}
                                                            onClick={() =>
                                                                updateQuantityUnit(
                                                                    item.productId,
                                                                    'box',
                                                                )
                                                            }
                                                            data-oid="wh_ig:q"
                                                        >
                                                            <div
                                                                className="flex items-center justify-start gap-2"
                                                                data-oid="p:811k2"
                                                            >
                                                                <div
                                                                    className="text-base"
                                                                    data-oid="awnc3.e"
                                                                >
                                                                    📦
                                                                </div>
                                                                <div
                                                                    className="flex flex-col"
                                                                    data-oid="9058a0."
                                                                >
                                                                    <div
                                                                        className="text-xs font-semibold text-gray-900"
                                                                        data-oid="w0p:ht."
                                                                    >
                                                                        {t(
                                                                            'subscription.create.purchaseOptions.perBox',
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="text-xs text-gray-600 font-medium"
                                                                        data-oid="cs._dro"
                                                                    >
                                                                        {item.product.price.toFixed(
                                                                            1,
                                                                        )}{' '}
                                                                        EGP
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Products */}
                        <div className="grid grid-cols-1 gap-3" data-oid="bchm4oc">
                            {availableProducts.slice(0, 8).map((product) => (
                                <div
                                    key={product.id}
                                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                                    data-oid="3pbvusm"
                                >
                                    <div className="flex items-center gap-3" data-oid="ajl:.tq">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                            data-oid="1u8bkbf"
                                        />

                                        <div className="flex-1" data-oid="1rfmwhz">
                                            <div
                                                className="flex items-center gap-1 mb-1"
                                                data-oid="fmtvi-f"
                                            >
                                                <h5
                                                    className="text-sm font-medium text-gray-900"
                                                    data-oid=":uq1ekx"
                                                >
                                                    {locale === 'ar'
                                                        ? product.nameAr
                                                        : product.name}
                                                </h5>
                                                {isMedicine(product) && (
                                                    <span
                                                        className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
                                                        data-oid="7rq9bob"
                                                    >
                                                        Medicine
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-1" data-oid="zf9eq0_">
                                                <PriceInfo
                                                    productName={product.name}
                                                    data-oid="t-0e0em"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => addProduct(product)}
                                            className="px-3 py-1.5 text-sm bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                            data-oid="v84h-nt"
                                        >
                                            {t('subscription.create.add')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3"
                data-oid="0qtnrch"
            >
                <div className="flex gap-2" data-oid="uzncq5e">
                    <Link
                        href="/customer/subscriptions"
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm text-center"
                        data-oid="ra0zi.f"
                    >
                        {t('common.cancel')}
                    </Link>
                    <button
                        onClick={handleNext}
                        disabled={selectedProducts.length === 0}
                        className="flex-1 px-4 py-2.5 text-sm bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="35lrw4q"
                    >
                        {t('subscription.create.next')}
                    </button>
                </div>
            </div>
        </div>
    );
}
