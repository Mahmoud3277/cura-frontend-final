'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { subscriptionService, SubscriptionPlan } from '@/lib/services/subscriptionService';
import { products } from '@/lib/data/products';
import { Product } from '@/lib/types';

interface DeliveryAddress {
    firstName: string;
    lastName: string;
    phone: string;
    whatsapp?: string;
    governorate: string;
    city: string;
    area: string;
    street: string;
    building: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    notes?: string;
}

interface CreateSubscriptionModalProps {
    customerId: string;
    plans: SubscriptionPlan[];
    onClose: () => void;
    onSuccess: () => void;
}

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
        <div className="text-xs text-gray-500" data-oid="xj2jmk5">
            <div className="text-sm font-semibold text-[#1F1F6F]" data-oid=".yetqrf">
                Avg: {avgPrice.toFixed(2)} EGP
            </div>
            {sameProducts.length > 1 && (
                <div data-oid="ng941aj">
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
        <div className="text-xs text-gray-500" data-oid="sbxs8:_">
            <div className="text-sm font-semibold text-[#1F1F6F]" data-oid="x1c2m0m">
                Avg: {avgUnitPrice.toFixed(2)} EGP per {isMedicine ? unitType : 'item'}
            </div>
        </div>
    );
}

export function CreateSubscriptionModal({
    customerId,
    plans,
    onClose,
    onSuccess,
}: CreateSubscriptionModalProps) {
    console.log('CreateSubscriptionModal initialized with:', {
        customerId,
        plansLength: plans.length,
        plans: plans.map((p) => ({ id: p.id, name: p.name, minOrderValue: p.minOrderValue })),
    });

    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const [step, setStep] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState<
        Array<{
            productId: string;
            pharmacyId: string;
            quantity: number;
            product: Product;
            unitType: 'blister' | 'box';
        }>
    >([]);
    const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'>(
        'monthly',
    );
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
        firstName: '',
        lastName: '',
        phone: '',
        whatsapp: '',
        governorate: '',
        city: '',
        area: '',
        street: '',
        building: '',
        floor: '',
        apartment: '',
        landmark: '',
        notes: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
    const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>('');
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Helper functions
    const isMedicine = (product: Product): boolean => {
        // Only OTC and prescription medicines can have quantity and unit type changes
        return ['otc', 'prescription'].includes(product.category);
    };

    const getUnitPrice = (product: Product, unitType: 'blister' | 'box'): number => {
        if (isMedicine(product) && unitType === 'blister') {
            return product.price * 0.4; // Blister is 40% of box price
        }
        return product.price;
    };

    const getMedicineDetails = (product: Product) => {
        // Default medicine packaging details - in a real app, this would come from the product data
        const medicineDetails = {
            pillsPerBlister: 10,
            blistersPerBox: 2,
        };

        // You can customize this based on specific medicines
        if (product.name.toLowerCase().includes('paracetamol')) {
            return { pillsPerBlister: 10, blistersPerBox: 2 };
        } else if (product.name.toLowerCase().includes('amoxicillin')) {
            return { pillsPerBlister: 7, blistersPerBox: 3 };
        } else if (product.name.toLowerCase().includes('ibuprofen')) {
            return { pillsPerBlister: 10, blistersPerBox: 2 };
        }

        return medicineDetails;
    };

    const availableProducts = products.filter(
        (product) =>
            product.availability?.inStock &&
            (searchQuery === '' ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.nameAr.includes(searchQuery)),
    );

    const subtotal = selectedProducts.reduce(
        (sum, item) => sum + getUnitPrice(item.product, item.unitType) * item.quantity,
        0,
    );
    const totalMedicineCount = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
    const medicineDiscount = selectedPlan ? selectedPlan.medicineDiscount * totalMedicineCount : 0;
    const orderDiscount = selectedPlan ? selectedPlan.orderDiscount : 0;
    const monthlyFee = selectedPlan ? selectedPlan.monthlyFee : 0;
    const finalTotal = subtotal - orderDiscount + monthlyFee;
    const totalSavings = orderDiscount - monthlyFee;

    useEffect(() => {
        console.log('Plan selection useEffect triggered:', {
            selectedPlan: selectedPlan?.id,
            plansLength: plans.length,
            subtotal,
            plans: plans.map((p) => ({ id: p.id, minOrderValue: p.minOrderValue })),
        });

        if (!selectedPlan && plans.length > 0) {
            const availablePlan = plans.find((plan) => subtotal >= plan.minOrderValue);
            console.log('Available plan found:', availablePlan?.id);
            if (availablePlan) {
                setSelectedPlan(availablePlan);
                console.log('Selected plan set to:', availablePlan.id);
            }
        }
    }, [selectedPlan, plans, subtotal]);

    useEffect(() => {
        const savedAddressesKey = `cura_addresses_${customerId}`;
        const saved = localStorage.getItem(savedAddressesKey);
        if (saved) {
            try {
                const addresses = JSON.parse(saved);
                setSavedAddresses(addresses);
                setShowAddressForm(addresses.length === 0);
                if (addresses.length > 0) {
                    setDeliveryAddress(addresses[0]);
                    setSelectedSavedAddress('0');
                }
            } catch (error) {
                console.error('Error loading saved addresses:', error);
                setShowAddressForm(true);
            }
        } else {
            setShowAddressForm(true);
        }
    }, [customerId]);

    const addProduct = (product: Product) => {
        const existing = selectedProducts.find((item) => item.productId === product.id.toString());
        if (existing) {
            // Allow quantity increase for all products
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
                    unitType: isMedicine(product) ? 'box' : 'box', // Default to box for all products
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
                    // Allow quantity changes for all products
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
                    // Only allow unit type changes for medicines
                    if (isMedicine(item.product)) {
                        return { ...item, unitType };
                    }
                }
                return item;
            }),
        );
    };

    const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
        setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
        if (selectedSavedAddress) {
            setSelectedSavedAddress('');
        }
    };

    const resetAddressForm = () => {
        setDeliveryAddress({
            firstName: '',
            lastName: '',
            phone: '',
            whatsapp: '',
            governorate: '',
            city: '',
            area: '',
            street: '',
            building: '',
            floor: '',
            apartment: '',
            landmark: '',
            notes: '',
        });
        setSelectedSavedAddress('');
    };

    const saveCurrentAddress = () => {
        if (!validateAddress()) return;
        const addressToSave = { ...deliveryAddress };
        const savedAddressesKey = `cura_addresses_${customerId}`;
        const existingIndex = savedAddresses.findIndex(
            (addr) =>
                addr.street === addressToSave.street &&
                addr.building === addressToSave.building &&
                addr.area === addressToSave.area &&
                addr.city === addressToSave.city &&
                addr.governorate === addressToSave.governorate,
        );

        let updatedAddresses;
        if (existingIndex >= 0) {
            updatedAddresses = [...savedAddresses];
            updatedAddresses[existingIndex] = addressToSave;
        } else {
            updatedAddresses = [addressToSave, ...savedAddresses].slice(0, 5);
        }
        setSavedAddresses(updatedAddresses);
        localStorage.setItem(savedAddressesKey, JSON.stringify(updatedAddresses));
    };

    const loadSavedAddress = (index: number) => {
        if (savedAddresses[index]) {
            setDeliveryAddress(savedAddresses[index]);
            setSelectedSavedAddress(index.toString());
            setShowAddressForm(false);
        }
    };

    const deleteSavedAddress = (index: number) => {
        const updatedAddresses = savedAddresses.filter((_, i) => i !== index);
        setSavedAddresses(updatedAddresses);
        const savedAddressesKey = `cura_addresses_${customerId}`;
        localStorage.setItem(savedAddressesKey, JSON.stringify(updatedAddresses));
        if (selectedSavedAddress === index.toString()) {
            setSelectedSavedAddress('');
        }
        if (updatedAddresses.length === 0) {
            setShowAddressForm(true);
        }
    };

    const getAddressDisplayName = (address: DeliveryAddress) => {
        return `${address.building} ${address.street}, ${address.area}, ${address.city}`;
    };

    const validateAddress = (): boolean => {
        if (selectedSavedAddress && !showAddressForm) {
            return true;
        }
        return !!(
            deliveryAddress.firstName &&
            deliveryAddress.lastName &&
            deliveryAddress.phone &&
            deliveryAddress.whatsapp &&
            deliveryAddress.governorate &&
            deliveryAddress.city &&
            deliveryAddress.area &&
            deliveryAddress.street &&
            deliveryAddress.building
        );
    };

    const handleCreateSubscription = async () => {
        if (selectedProducts.length === 0 || !validateAddress()) {
            return;
        }
        saveCurrentAddress();
        setLoading(true);
        try {
            const addressString = `${deliveryAddress.building} ${deliveryAddress.street}, ${deliveryAddress.area}, ${deliveryAddress.city}, ${deliveryAddress.governorate}`;
            await subscriptionService.createSubscription({
                customerId,
                products: selectedProducts.map((item) => ({
                    productId: item.productId,
                    pharmacyId: item.pharmacyId,
                    quantity: item.quantity,
                    unitType: item.unitType,
                })),
                frequency,
                deliveryAddress: addressString,
                deliveryInstructions: undefined,
            });
            onSuccess();
        } catch (error) {
            console.error('Error creating subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            data-oid="bdqhf9k"
        >
            <div
                className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                data-oid="10:p9v5"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200" data-oid="iys-u.h">
                    <div className="flex justify-between items-center" data-oid="4chpree">
                        <h2 className="text-2xl font-bold text-gray-900" data-oid="ydc4ybb">
                            {t('subscription.create.title')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            data-oid="5i9tryk"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="x4e48n3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                    data-oid="52658ne"
                                />
                            </svg>
                        </button>
                    </div>
                    {/* Progress Steps */}
                    <div className="flex items-center mt-6" data-oid="55d9k-x">
                        {[
                            { number: 1, label: t('subscription.create.step1') },
                            { number: 2, label: t('subscription.create.choosePlan') },
                            { number: 3, label: t('subscription.create.confirmOrder') },
                        ].map((stepInfo, index) => (
                            <div
                                key={stepInfo.number}
                                className="flex items-center"
                                data-oid="_tzws82"
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step >= stepInfo.number
                                            ? 'bg-[#1F1F6F] text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                    data-oid="d:0z1ml"
                                >
                                    {stepInfo.number}
                                </div>
                                <span
                                    className={`ml-2 text-sm ${
                                        step >= stepInfo.number
                                            ? 'text-[#1F1F6F] font-medium'
                                            : 'text-gray-500'
                                    }`}
                                    data-oid="__789z6"
                                >
                                    {stepInfo.label}
                                </span>
                                {index < 2 && (
                                    <div
                                        className={`w-12 h-0.5 mx-4 ${
                                            step > stepInfo.number ? 'bg-[#1F1F6F]' : 'bg-gray-200'
                                        }`}
                                        data-oid="yr4.l85"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]" data-oid="vnc6.ka">
                    {/* Step 1: Select Products */}
                    {step === 1 && (
                        <div className="space-y-6" data-oid="3_a99iv">
                            <div data-oid="zldsw7:">
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="1kxeg0w"
                                >
                                    {t('subscription.create.selectProducts')}
                                </h3>
                                {/* Search */}
                                <div className="mb-4" data-oid="h:mtjrl">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('subscription.create.searchProducts')}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        data-oid="4ewz2:r"
                                    />
                                </div>
                                {/* Selected Products */}
                                {selectedProducts.length > 0 && (
                                    <div className="mb-6" data-oid="lbbp5g6">
                                        <h4
                                            className="font-medium text-gray-900 mb-3"
                                            data-oid="12s47p3"
                                        >
                                            {t('subscription.create.selectedProducts')} (
                                            {selectedProducts.length})
                                        </h4>
                                        <div className="space-y-2" data-oid="n9ju-y-">
                                            {selectedProducts.map((item) => (
                                                <div
                                                    key={item.productId}
                                                    className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                                                    data-oid="ke_k7bw"
                                                >
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="w-12 h-12 object-cover rounded-lg"
                                                        data-oid="k5t_b4m"
                                                    />

                                                    <div className="flex-1" data-oid="3mpw6m:">
                                                        <h5
                                                            className="font-medium text-gray-900"
                                                            data-oid="za_j81n"
                                                        >
                                                            {locale === 'ar'
                                                                ? item.product.nameAr
                                                                : item.product.name}
                                                        </h5>
                                                        <div
                                                            className="space-y-1"
                                                            data-oid=".m8woyb"
                                                        >
                                                            <SelectedProductPriceInfo
                                                                productName={item.product.name}
                                                                isMedicine={isMedicine(
                                                                    item.product,
                                                                )}
                                                                unitType={item.unitType}
                                                                data-oid="167fj36"
                                                            />
                                                        </div>
                                                        {isMedicine(item.product) && (
                                                            <div
                                                                className="mt-3"
                                                                data-oid="purchase-options"
                                                            >
                                                                <p
                                                                    className="text-xs font-medium text-gray-700 mb-2"
                                                                    data-oid="enhkokn"
                                                                >
                                                                    {t(
                                                                        'subscription.create.purchaseOption',
                                                                    )}
                                                                    :
                                                                </p>
                                                                <div
                                                                    className="flex gap-2"
                                                                    data-oid="b7care:"
                                                                >
                                                                    <div
                                                                        className={`flex-1 p-2 border rounded-lg cursor-pointer transition-all ${
                                                                            item.unitType ===
                                                                            'blister'
                                                                                ? 'border-[#1F1F6F] bg-blue-50'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                        }`}
                                                                        onClick={() =>
                                                                            updateQuantityUnit(
                                                                                item.productId,
                                                                                'blister',
                                                                            )
                                                                        }
                                                                        data-oid="it0__jx"
                                                                    >
                                                                        <div
                                                                            className="text-center"
                                                                            data-oid="d4ll71k"
                                                                        >
                                                                            <div
                                                                                className="text-lg mb-1"
                                                                                data-oid="1by0:__"
                                                                            >
                                                                                💊
                                                                            </div>
                                                                            <div
                                                                                className="text-xs font-medium text-gray-900"
                                                                                data-oid="v:q9hw0"
                                                                            >
                                                                                {t(
                                                                                    'subscription.create.purchaseOptions.perBlister',
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                className="text-xs text-gray-600"
                                                                                data-oid="lk_i.-f"
                                                                            >
                                                                                EGP{' '}
                                                                                {(
                                                                                    item.product
                                                                                        .price * 0.4
                                                                                ).toFixed(1)}
                                                                            </div>
                                                                            <div
                                                                                className="text-xs text-gray-500"
                                                                                data-oid=".hdqs53"
                                                                            >
                                                                                {
                                                                                    getMedicineDetails(
                                                                                        item.product,
                                                                                    )
                                                                                        .pillsPerBlister
                                                                                }{' '}
                                                                                {t(
                                                                                    'subscription.create.purchaseOptions.pillsPerBlister',
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={`flex-1 p-2 border rounded-lg cursor-pointer transition-all ${
                                                                            item.unitType === 'box'
                                                                                ? 'border-[#1F1F6F] bg-blue-50'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                        }`}
                                                                        onClick={() =>
                                                                            updateQuantityUnit(
                                                                                item.productId,
                                                                                'box',
                                                                            )
                                                                        }
                                                                        data-oid="ms40t2u"
                                                                    >
                                                                        <div
                                                                            className="text-center"
                                                                            data-oid="bqj3va7"
                                                                        >
                                                                            <div
                                                                                className="text-lg mb-1"
                                                                                data-oid="ksmpemz"
                                                                            >
                                                                                📦
                                                                            </div>
                                                                            <div
                                                                                className="text-xs font-medium text-gray-900"
                                                                                data-oid="uie2_h-"
                                                                            >
                                                                                {t(
                                                                                    'subscription.create.purchaseOptions.perBox',
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                className="text-xs text-gray-600"
                                                                                data-oid="i9tstq7"
                                                                            >
                                                                                EGP{' '}
                                                                                {item.product.price.toFixed(
                                                                                    1,
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                className="text-xs text-gray-500"
                                                                                data-oid="vncii2i"
                                                                            >
                                                                                {
                                                                                    getMedicineDetails(
                                                                                        item.product,
                                                                                    ).blistersPerBox
                                                                                }{' '}
                                                                                {t(
                                                                                    'subscription.create.purchaseOptions.blistersPerBox',
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="flex flex-col items-end gap-2"
                                                        data-oid="4k7on4q"
                                                    >
                                                        <div
                                                            className="flex flex-col items-center"
                                                            data-oid="osrt.qe"
                                                        >
                                                            <p
                                                                className="text-xs font-medium text-gray-700 mb-1"
                                                                data-oid="4n6telk"
                                                            >
                                                                {t(
                                                                    'subscription.create.purchaseOptions.quantity',
                                                                )}
                                                                :
                                                            </p>
                                                            <div
                                                                className="flex items-center gap-2"
                                                                data-oid="94b9r6w"
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.productId,
                                                                            item.quantity - 1,
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] flex items-center justify-center hover:bg-[#1F1F6F] hover:text-white transition-colors"
                                                                    data-oid="x.gh8f1"
                                                                >
                                                                    -
                                                                </button>
                                                                <div
                                                                    className="flex flex-col items-center"
                                                                    data-oid="wg-a8e1"
                                                                >
                                                                    <span
                                                                        className="text-lg font-bold text-[#1F1F6F]"
                                                                        data-oid="_._l-ft"
                                                                    >
                                                                        {item.quantity}
                                                                    </span>
                                                                    <span
                                                                        className="text-xs text-gray-500"
                                                                        data-oid="l3jv.xe"
                                                                    >
                                                                        {isMedicine(item.product)
                                                                            ? item.unitType ===
                                                                              'blister'
                                                                                ? t(
                                                                                      'subscription.create.purchaseOptions.blistersUnit',
                                                                                  )
                                                                                : t(
                                                                                      'subscription.create.purchaseOptions.boxesUnit',
                                                                                  )
                                                                            : t(
                                                                                  'subscription.create.purchaseOptions.itemsUnit',
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
                                                                    className="w-8 h-8 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] flex items-center justify-center hover:bg-[#1F1F6F] hover:text-white transition-colors"
                                                                    data-oid="_t.su4:"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            removeProduct(item.productId)
                                                        }
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        data-oid="6.vmld5"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            data-oid="z-il.5i"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                data-oid="7cp_iud"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Available Products */}
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    data-oid="k907y-r"
                                >
                                    {availableProducts.slice(0, 8).map((product) => (
                                        <div
                                            key={product.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            data-oid="m-p-ixt"
                                        >
                                            <div
                                                className="flex items-center gap-4"
                                                data-oid="bi67y_q"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                    data-oid="1bla0nn"
                                                />

                                                <div className="flex-1" data-oid="a6l9xzx">
                                                    <div
                                                        className="flex items-center gap-2 mb-1"
                                                        data-oid="sd:ft68"
                                                    >
                                                        <h5
                                                            className="font-medium text-gray-900"
                                                            data-oid="bcozyc5"
                                                        >
                                                            {locale === 'ar'
                                                                ? product.nameAr
                                                                : product.name}
                                                        </h5>
                                                        {isMedicine(product) && (
                                                            <span
                                                                className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
                                                                data-oid="e0sjx80"
                                                            >
                                                                Medicine
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1" data-oid="zlfvpkb">
                                                        <PriceInfo
                                                            productName={product.name}
                                                            data-oid="_tmaejw"
                                                        />
                                                    </div>
                                                    <p
                                                        className="text-xs text-gray-500 mt-1"
                                                        data-oid="24355y:"
                                                    >
                                                        {isMedicine(product)
                                                            ? 'Quantity adjustable • Unit: Box/Blister'
                                                            : 'Quantity adjustable'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => addProduct(product)}
                                                    className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors"
                                                    data-oid="9p:o7.4"
                                                >
                                                    {t('subscription.create.add')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Choose Plan */}
                    {step === 2 && (
                        <div className="space-y-6" data-oid="wa4xf_i">
                            <div data-oid="3cd8jpm">
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="4.1ewxx"
                                >
                                    Choose Your Subscription Plan
                                </h3>
                                {/* Plan Selection */}
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                                    data-oid="ljtlsnd"
                                >
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                                                selectedPlan?.id === plan.id
                                                    ? 'border-[#1F1F6F] bg-blue-50 shadow-lg'
                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                            }`}
                                            onClick={() => setSelectedPlan(plan)}
                                            data-oid="zmg0dww"
                                        >
                                            {plan.isPopular && (
                                                <div
                                                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                                                    data-oid="-zqzr89"
                                                >
                                                    <span
                                                        className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium"
                                                        data-oid=":2y8zf3"
                                                    >
                                                        Most Popular
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-center mb-4" data-oid="nz:no7d">
                                                <h4
                                                    className="text-xl font-bold text-gray-900 mb-2"
                                                    data-oid="8qzk6wv"
                                                >
                                                    {locale === 'ar' ? plan.nameAr : plan.name}
                                                </h4>
                                                <p
                                                    className="text-gray-600 text-sm"
                                                    data-oid="uzs.q0q"
                                                >
                                                    {locale === 'ar'
                                                        ? plan.descriptionAr
                                                        : plan.description}
                                                </p>
                                            </div>
                                            {/* Pricing Display */}
                                            <div
                                                className="text-center mb-4 p-4 bg-white rounded-lg border"
                                                data-oid="cr58ptl"
                                            >
                                                <div
                                                    className="text-3xl font-bold text-[#1F1F6F] mb-1"
                                                    data-oid="i3hcj4a"
                                                >
                                                    {plan.monthlyFee} EGP
                                                </div>
                                                <div
                                                    className="text-sm text-gray-500 mb-2"
                                                    data-oid="g0o:zfl"
                                                >
                                                    Monthly subscription fee
                                                </div>
                                                <div
                                                    className="text-lg font-semibold text-green-600"
                                                    data-oid="vcwuy88"
                                                >
                                                    Save {plan.medicineDiscount} EGP per medicine
                                                </div>
                                            </div>
                                            {/* Features */}
                                            <ul className="space-y-2 mb-4" data-oid="h2pwrrt">
                                                {(locale === 'ar' ? plan.featuresAr : plan.features)
                                                    .slice(0, 4)
                                                    .map((feature, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-center gap-2 text-sm text-gray-600"
                                                            data-oid="7j1n8uk"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 text-green-500 flex-shrink-0"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                data-oid="75oplxn"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 13l4 4L19 7"
                                                                    data-oid="0x7co.1"
                                                                />
                                                            </svg>
                                                            {feature}
                                                        </li>
                                                    ))}
                                            </ul>
                                            {/* Medicine Guarantee */}
                                            <div
                                                className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4"
                                                data-oid="ryzaz_y"
                                            >
                                                <div
                                                    className="flex items-center gap-2 text-green-800"
                                                    data-oid="uw3sm5o"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        data-oid="8kvq4kh"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            data-oid="zhz_65l"
                                                        />
                                                    </svg>
                                                    <span
                                                        className="text-sm font-medium"
                                                        data-oid="gr6-tix"
                                                    >
                                                        Medicine Availability Guarantee
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-xs text-green-700 mt-1"
                                                    data-oid="q_7ke68"
                                                >
                                                    CURA will provide the exact medicine when
                                                    possible. If unavailable, we{"'"}ll call you to
                                                    offer alternatives.
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Order Summary */}
                                <div className="bg-gray-50 rounded-lg p-4 mt-6" data-oid=".9pogzu">
                                    <h4
                                        className="font-medium text-gray-900 mb-3"
                                        data-oid="q201n8d"
                                    >
                                        Monthly Order Summary
                                    </h4>
                                    <div className="space-y-2 text-sm" data-oid="7hzv3tk">
                                        <div className="flex justify-between" data-oid="armx5o8">
                                            <span data-oid="oh-50ib">Medicine cost:</span>
                                            <span data-oid="y6hg4w0">
                                                {' '}
                                                {subtotal.toFixed(2)} EGP{' '}
                                            </span>
                                        </div>
                                        {selectedPlan && (
                                            <>
                                                <div
                                                    className="flex justify-between text-green-600"
                                                    data-oid="kitam4i"
                                                >
                                                    <span data-oid="qmlpdy2">Order discount:</span>
                                                    <span data-oid="mi8hn_z">
                                                        {' '}
                                                        -{orderDiscount.toFixed(2)} EGP{' '}
                                                    </span>
                                                </div>
                                                <div
                                                    className="flex justify-between text-gray-600"
                                                    data-oid="oz_vfna"
                                                >
                                                    <span data-oid="mp4ueaw">
                                                        {' '}
                                                        Subscription fee:{' '}
                                                    </span>
                                                    <span data-oid="5me:f3a">
                                                        {' '}
                                                        +{monthlyFee.toFixed(2)} EGP{' '}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        <div
                                            className="flex justify-between font-medium text-lg border-t pt-2"
                                            data-oid="p4f882."
                                        >
                                            <span data-oid="w3429qu">Total to pay:</span>
                                            <span data-oid="8fyy4:2">
                                                {' '}
                                                {finalTotal.toFixed(2)} EGP{' '}
                                            </span>
                                        </div>
                                        {selectedPlan && totalSavings > 0 && (
                                            <div
                                                className="bg-green-100 rounded-lg p-2 mt-2"
                                                data-oid="oewts.:"
                                            >
                                                <div
                                                    className="flex justify-between text-green-800 font-medium"
                                                    data-oid="i2uldy."
                                                >
                                                    <span data-oid="zozokif">
                                                        {' '}
                                                        You save this month:{' '}
                                                    </span>
                                                    <span data-oid="v1s:.yo">
                                                        {' '}
                                                        {totalSavings.toFixed(2)} EGP{' '}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm the Order */}
                    {step === 3 && (
                        <div className="space-y-6" data-oid="z6bt3d5">
                            <div data-oid="0_s7sq4">
                                <h3
                                    className="text-lg font-semibold text-gray-900 mb-4"
                                    data-oid="8u7amew"
                                >
                                    Confirm the Order
                                </h3>
                                {/* Delivery Address Management */}
                                <div
                                    className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
                                    data-oid="_593a51"
                                >
                                    <div
                                        className="flex items-center justify-between mb-6"
                                        data-oid="nkp3qo:"
                                    >
                                        <h4
                                            className="text-lg font-semibold text-gray-900"
                                            data-oid="9_sbdky"
                                        >
                                            Delivery Address
                                        </h4>
                                        {!showAddressForm && savedAddresses.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    resetAddressForm();
                                                    setShowAddressForm(true);
                                                }}
                                                className="text-[#1F1F6F] text-sm hover:underline font-medium"
                                                data-oid="fa5k1.-"
                                            >
                                                Add New Address
                                            </button>
                                        )}
                                    </div>
                                    {/* Current Selected Address Display */}
                                    {!showAddressForm && deliveryAddress.firstName && (
                                        <div
                                            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
                                            data-oid="hz4hi4q"
                                        >
                                            <div
                                                className="flex items-start justify-between"
                                                data-oid="i214exr"
                                            >
                                                <div data-oid="r4p-xqf">
                                                    <h5
                                                        className="font-medium text-gray-900 mb-1"
                                                        data-oid="9dj2674"
                                                    >
                                                        Selected Address:
                                                    </h5>
                                                    <p className="text-gray-700" data-oid="bhn33a3">
                                                        <strong data-oid="rbi42ei">
                                                            {deliveryAddress.firstName}{' '}
                                                            {deliveryAddress.lastName}
                                                        </strong>
                                                    </p>
                                                    <p
                                                        className="text-gray-600 text-sm"
                                                        data-oid="h_c4wiy"
                                                    >
                                                        {deliveryAddress.building}{' '}
                                                        {deliveryAddress.street},{' '}
                                                        {deliveryAddress.area}
                                                    </p>
                                                    <p
                                                        className="text-gray-600 text-sm"
                                                        data-oid="gv9z-ru"
                                                    >
                                                        {deliveryAddress.city},{' '}
                                                        {deliveryAddress.governorate}
                                                    </p>
                                                    <p
                                                        className="text-gray-500 text-sm"
                                                        data-oid="_lxkr5f"
                                                    >
                                                        📞 {deliveryAddress.phone}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        resetAddressForm();
                                                        setShowAddressForm(true);
                                                    }}
                                                    className="text-[#1F1F6F] text-sm hover:underline font-medium"
                                                    data-oid="um6pesz"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/* Address Selection Interface */}
                                    {(showAddressForm || !deliveryAddress.firstName) && (
                                        <div className="space-y-4" data-oid="986dt2x">
                                            {/* Saved Addresses */}
                                            {savedAddresses.length > 0 && (
                                                <div data-oid="z_.hhej">
                                                    <h5
                                                        className="text-sm font-medium text-gray-900 mb-2"
                                                        data-oid="dsk6f0h"
                                                    >
                                                        Saved Addresses
                                                    </h5>
                                                    <div className="space-y-2" data-oid="f44lj54">
                                                        {savedAddresses.map((address, index) => (
                                                            <div
                                                                key={index}
                                                                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                                                    selectedSavedAddress ===
                                                                    index.toString()
                                                                        ? 'border-[#1F1F6F] bg-blue-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                                onClick={() => {
                                                                    setDeliveryAddress(address);
                                                                    setSelectedSavedAddress(
                                                                        index.toString(),
                                                                    );
                                                                    setShowAddressForm(false);
                                                                }}
                                                                data-oid="w-aezi2"
                                                            >
                                                                <div
                                                                    className="flex items-center flex-1"
                                                                    data-oid="7jgws8h"
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                                            selectedSavedAddress ===
                                                                            index.toString()
                                                                                ? 'border-[#1F1F6F] bg-[#1F1F6F]'
                                                                                : 'border-gray-300'
                                                                        }`}
                                                                        data-oid="mxyt8rp"
                                                                    >
                                                                        {selectedSavedAddress ===
                                                                            index.toString() && (
                                                                            <div
                                                                                className="w-2 h-2 bg-white rounded-full"
                                                                                data-oid="-.rg31t"
                                                                            ></div>
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="flex-1"
                                                                        data-oid="v5-fryz"
                                                                    >
                                                                        <p
                                                                            className="font-medium text-gray-900"
                                                                            data-oid="a_lff66"
                                                                        >
                                                                            {address.firstName}{' '}
                                                                            {address.lastName}
                                                                        </p>
                                                                        <p
                                                                            className="text-sm text-gray-600"
                                                                            data-oid="2ai5b3_"
                                                                        >
                                                                            {address.building}{' '}
                                                                            {address.street},{' '}
                                                                            {address.area},{' '}
                                                                            {address.city}
                                                                        </p>
                                                                        <p
                                                                            className="text-sm text-gray-500"
                                                                            data-oid="r7a1l_e"
                                                                        >
                                                                            {address.phone}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Add New Address Form */}
                                            <div data-oid="g-ffq.5">
                                                <h5
                                                    className="text-lg font-medium text-gray-900 mb-4"
                                                    data-oid="v8ya347"
                                                >
                                                    Add New Address
                                                </h5>
                                                <div
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                    data-oid="hb1:8c1"
                                                >
                                                    <div data-oid="7iwk2m-">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="orybzlz"
                                                        >
                                                            First Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={deliveryAddress.firstName}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'firstName',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="Enter first name"
                                                            data-oid="kktrpbg"
                                                        />
                                                    </div>
                                                    <div data-oid="vg3f._0">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="u_:9dbe"
                                                        >
                                                            Last Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={deliveryAddress.lastName}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'lastName',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="Enter last name"
                                                            data-oid="jqspsbi"
                                                        />
                                                    </div>
                                                    <div data-oid="3ykxhyu">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="6:aj3yo"
                                                        >
                                                            Phone *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={deliveryAddress.phone}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'phone',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="+20 1XX XXX XXXX"
                                                            data-oid="476_wz6"
                                                        />
                                                    </div>
                                                    <div data-oid="g8bz64u">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="rxqqu8e"
                                                        >
                                                            WhatsApp *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={deliveryAddress.whatsapp}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'whatsapp',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="+20 1XX XXX XXXX"
                                                            data-oid="1_b89ja"
                                                        />
                                                    </div>
                                                    <div data-oid="qy-6m-7">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="30iv_tf"
                                                        >
                                                            Governorate *
                                                        </label>
                                                        <select
                                                            value={deliveryAddress.governorate}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'governorate',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            data-oid="ra5yxf0"
                                                        >
                                                            <option value="" data-oid="vtkiy8g">
                                                                Select Governorate
                                                            </option>
                                                            <option
                                                                value="Ismailia"
                                                                data-oid="npvxek."
                                                            >
                                                                Ismailia
                                                            </option>
                                                            <option
                                                                value="Cairo"
                                                                data-oid="bucqh7j"
                                                            >
                                                                Cairo
                                                            </option>
                                                            <option
                                                                value="Alexandria"
                                                                data-oid="0ibsnhi"
                                                            >
                                                                Alexandria
                                                            </option>
                                                            <option value="Giza" data-oid="zz6lo.q">
                                                                Giza
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div data-oid="k.cbzit">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="d287xsc"
                                                        >
                                                            City *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={deliveryAddress.city}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'city',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="Enter city"
                                                            data-oid="qwohkhp"
                                                        />
                                                    </div>
                                                    <div data-oid="s961uoc">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="m2y1uri"
                                                        >
                                                            Area *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={deliveryAddress.area}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'area',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="Enter area"
                                                            data-oid="hw:lnby"
                                                        />
                                                    </div>
                                                    <div data-oid="i7mrax7">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="jojcl9d"
                                                        >
                                                            Street *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={deliveryAddress.street}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'street',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="Enter street"
                                                            data-oid="7.1zdly"
                                                        />
                                                    </div>
                                                    <div data-oid="c91mhy0">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid="lmi4370"
                                                        >
                                                            Building *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={deliveryAddress.building}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'building',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="Building number"
                                                            data-oid="36cf:r1"
                                                        />
                                                    </div>
                                                    <div data-oid="f:568fl">
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                            data-oid=".eg.ihz"
                                                        >
                                                            Floor (Optional)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={deliveryAddress.floor || ''}
                                                            onChange={(e) =>
                                                                handleAddressChange(
                                                                    'floor',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F]"
                                                            placeholder="Floor number"
                                                            data-oid="wt8dr4e"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 pt-4" data-oid="2a:xzd7">
                                                <button
                                                    onClick={() => {
                                                        if (validateAddress()) {
                                                            saveCurrentAddress();
                                                            setShowAddressForm(false);
                                                        }
                                                    }}
                                                    disabled={!validateAddress()}
                                                    className="px-6 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    data-oid="m1_hvtt"
                                                >
                                                    Save & Use This Address
                                                </button>
                                                {savedAddresses.length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setShowAddressForm(false);
                                                            // Restore the first saved address when canceling
                                                            if (savedAddresses.length > 0) {
                                                                setDeliveryAddress(
                                                                    savedAddresses[0],
                                                                );
                                                                setSelectedSavedAddress('0');
                                                            }
                                                        }}
                                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                        data-oid=".cnhc_c"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Final Summary */}
                                <div className="bg-blue-50 rounded-lg p-4 mt-6" data-oid="p-jpfkx">
                                    <h4
                                        className="font-medium text-blue-900 mb-3"
                                        data-oid="qlc91x4"
                                    >
                                        {t('subscription.create.finalSummary')}
                                    </h4>
                                    <div
                                        className="space-y-2 text-sm text-blue-800"
                                        data-oid="dffgfp4"
                                    >
                                        <div className="flex justify-between" data-oid="dir.h_j">
                                            <span data-oid="a094jc6">
                                                {' '}
                                                {t('subscription.create.products')}:{' '}
                                            </span>
                                            <span data-oid=".tv1e30">
                                                {' '}
                                                {selectedProducts.length}{' '}
                                                {t('subscription.create.items')}{' '}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid="e2g9hc9">
                                            <span data-oid=".sc2tkw">
                                                {' '}
                                                {t('subscription.create.frequency')}:{' '}
                                            </span>
                                            <span data-oid="c7xlr9b">
                                                {' '}
                                                {t(`subscription.frequency.${frequency}`)}{' '}
                                            </span>
                                        </div>
                                        <div className="flex justify-between" data-oid="jgr_cvm">
                                            <span data-oid="022qpp0">Total to pay:</span>
                                            <span className="font-medium" data-oid="pmjbvhn">
                                                {' '}
                                                {finalTotal.toFixed(2)} EGP{' '}
                                            </span>
                                        </div>
                                        {selectedPlan && (
                                            <>
                                                <div
                                                    className="flex justify-between"
                                                    data-oid="rh5zcrf"
                                                >
                                                    <span data-oid="_vt6pa:">Plan:</span>
                                                    <span data-oid="t5v3d06">
                                                        {' '}
                                                        {locale === 'ar'
                                                            ? selectedPlan.nameAr
                                                            : selectedPlan.name}{' '}
                                                    </span>
                                                </div>
                                                {totalSavings > 0 && (
                                                    <div
                                                        className="flex justify-between text-green-600"
                                                        data-oid="lz-mxq1"
                                                    >
                                                        <span data-oid="mhw5q8z">
                                                            Monthly savings:
                                                        </span>
                                                        <span data-oid="eamg::l">
                                                            {' '}
                                                            +{totalSavings.toFixed(2)} EGP{' '}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="p-6 border-t border-gray-200" data-oid="nf_3_cj">
                    <div className="flex justify-between" data-oid="ys-ix22">
                        <div className="flex gap-3" data-oid="t8oe_yb">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    data-oid="uos523a"
                                >
                                    {t('subscription.create.previous')}
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3" data-oid="phdptj1">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                data-oid=":xyd0vr"
                            >
                                {t('common.cancel')}
                            </button>
                            {step < 3 ? (
                                <button
                                    onClick={() => {
                                        console.log('Next button clicked, current step:', step);
                                        console.log('Step validation:', {
                                            step1Valid: step !== 1 || selectedProducts.length > 0,
                                            step2Valid: step !== 2 || !!selectedPlan,
                                            selectedProductsLength: selectedProducts.length,
                                            selectedPlan: selectedPlan?.id,
                                        });
                                        setStep(step + 1);
                                    }}
                                    disabled={
                                        (step === 1 && selectedProducts.length === 0) ||
                                        (step === 2 && !selectedPlan)
                                    }
                                    className="px-6 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="v3_dyk2"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreateSubscription}
                                    disabled={
                                        loading ||
                                        selectedProducts.length === 0 ||
                                        !validateAddress()
                                    }
                                    className="px-6 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    data-oid="ab:c2o7"
                                >
                                    {loading
                                        ? t('subscription.create.creating')
                                        : t('subscription.create.create')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
