'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface OrderSummary {
    orderId: string;
    items: any[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    estimatedDelivery: string;
    paymentMethod: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    let prescriptionParam;
    if(searchParams.get('prescription')){
        prescriptionParam = searchParams.get('prescription');
    }
    const { locale } = useLanguage();
    const { t } = useTranslation(locale);
    const { user, isAuthenticated } = useAuth();
    const isMobile = useIsMobile();
    const {
        items,
        totalItems,
        subtotal,
        deliveryFee,
        discount,
        total,
        appliedPromo,
        clearCart,
        hasPrescriptionItems,
        getPharmacyGroups,
        getPrescriptionItems,
        prescriptionMetadata,
        createOrder
    } = useCart();

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
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
    const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
    const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: user?.email || '',
        phone: '',
        whatsapp: '',
        preferredContact: 'phone' as 'phone' | 'whatsapp' | 'email',
    });
    const [deliveryPreferences, setDeliveryPreferences] = useState({
        timeSlot: 'anytime',
        specialInstructions: '',
        leaveAtDoor: false,
        callBeforeDelivery: true,
    });

    // Redirect if cart is empty
    useEffect(() => {
        setTimeout(() => {
            if (items.length === 0 && !orderPlaced) {
                router.push('/cart');
            }
        }, 5000);
    }, [items.length, orderPlaced, router]);

    // Load saved addresses on mount
    useEffect(() => {
        if (isAuthenticated && user) {
            const savedAddressesKey = `cura_addresses_${user._id}`;
            let saved;
            if (typeof window !== 'undefined') {
                saved = localStorage.getItem(savedAddressesKey);
            }
            if (saved) {
                try {
                    const addresses = JSON.parse(saved);
                    setSavedAddresses(addresses);
                    // Show form only if no saved addresses exist
                    setShowAddressForm(addresses.length === 0);
                } catch (error) {
                    console.error('Error loading saved addresses:', error);
                    setShowAddressForm(true);
                }
            } else {
                // No saved addresses, show form
                setShowAddressForm(true);
            }
        }
    }, [isAuthenticated, user]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/checkout');
        }
    }, [isAuthenticated, router]);

    const prescriptionItems = items.filter((item) => item.requiresPrescription || item?.prescription?.length>0);
    const regularItems = items.filter((item) => !item.requiresPrescription && !item?.prescription);
    const uniquePharmacies = new Set(items.map((item) => item.pharmacy));
    const pharmacyGroups = getPharmacyGroups();
    const isPrescriptionOrder = prescriptionItems.length > 0 || hasPrescriptionItems();
    const isMultiPharmacyOrder = Object.keys(pharmacyGroups).length > 1;
    const estimatedDeliveryTime = isPrescriptionOrder ? '2-6 hours' : '2-4 hours';

    // Get prescription-specific items if prescription parameter is provided
    const currentPrescriptionItems = prescriptionParam
        ? getPrescriptionItems(prescriptionParam)
        : [];
    const currentPrescriptionMetadata = prescriptionParam
        ? prescriptionMetadata[prescriptionParam]
        : null;
    const isFromPrescriptionSelection = !!prescriptionParam && currentPrescriptionItems.length > 0;

    const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
        setDeliveryAddress((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear selected saved address when manually editing
        if (selectedSavedAddress) {
            setSelectedSavedAddress('');
        }
    };

    const saveCurrentAddress = () => {
        if (!user || !validateStep(1)) return;
        const addressToSave = { ...deliveryAddress };
        const savedAddressesKey = `cura_addresses_${user._id}`;

        // Check if address already exists
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
            // Update existing address
            updatedAddresses = [...savedAddresses];
            updatedAddresses[existingIndex] = addressToSave;
        } else {
            // Add new address (limit to 5 addresses)
            updatedAddresses = [addressToSave, ...savedAddresses].slice(0, 5);
        }

        setSavedAddresses(updatedAddresses);
        localStorage.setItem(savedAddressesKey, JSON.stringify(updatedAddresses));
    };

    const loadSavedAddress = (index: number) => {
        if (savedAddresses[index]) {
            setDeliveryAddress(savedAddresses[index]);
            setSelectedSavedAddress(index.toString());
            setShowAddressForm(false); // Hide form when selecting saved address
        }
    };

    const deleteSavedAddress = (index: number) => {
        if (!user) return;
        const updatedAddresses = savedAddresses.filter((_, i) => i !== index);
        setSavedAddresses(updatedAddresses);
        const savedAddressesKey = `cura_addresses_${user._id}`;
        // Fixed the extra parenthesis here
        if (typeof window !== 'undefined') {
            localStorage.setItem(savedAddressesKey, JSON.stringify(updatedAddresses));
        }
        if (selectedSavedAddress === index.toString()) {
            setSelectedSavedAddress('');
        }
        // If no addresses left, show the form
        if (updatedAddresses.length === 0) {
            setShowAddressForm(true);
        }
    };

    const getAddressDisplayName = (address: DeliveryAddress) => {
        return `${address.building} ${address.street}, ${address.area}, ${address.city}`;
    };

    const handleContactChange = (field: string, value: string) => {
        setContactInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                // If using saved address, just check if one is selected
                if (selectedSavedAddress && !showAddressForm) {
                    return true;
                }
                // If using new address form, validate all fields
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

            case 2:
                return true;
            default:
                return false;
        }
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep === 1) {
                // Save address when moving to next step
                saveCurrentAddress();
            }
            setCurrentStep((prev) => Math.min(prev + 1, 2));
        }
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handlePlaceOrder = async () => {
        if (!validateStep(currentStep)) return;
        setIsLoading(true);
        
        try {
            // Get the current delivery address (either from saved address or form)
            const currentDeliveryAddress = selectedSavedAddress && !showAddressForm 
                ? savedAddresses[parseInt(selectedSavedAddress)]
                : deliveryAddress;
                
            // For now, credits usage is 0 (you can add this as a state later)
            const useCredits = 0;
            
            const result = await createOrder(currentDeliveryAddress, useCredits);
            
            if (result.success) {
                const orderId = result.order.id || `CURA-${Date.now()}`;
                const summary: OrderSummary = {
                    orderId,
                    items: [...items],
                    subtotal,
                    deliveryFee,
                    discount,
                    total,
                    estimatedDelivery: estimatedDeliveryTime,
                    paymentMethod: 'Cash on Delivery',
                };
                setOrderSummary(summary);
                setOrderPlaced(true);
                // Note: clearCart() is handled by createOrder function
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (orderPlaced && orderSummary) {
        return (
            <div
                className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
                data-oid="vs4ewb."
            >
                {/* Mobile Header */}
                <div className="block md:hidden" data-oid="06ql7i2">
                    <ClientOnly data-oid=":ov3uld">
                        <MobileHeader data-oid="nnurfny" />
                    </ClientOnly>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block" data-oid="bkpvt65">
                    <Header data-oid="kw4o.gr" />
                </div>

                <div
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8"
                    data-oid="nl72lgg"
                >
                    <div className="text-center py-8 md:py-16" data-oid="bqf2omd">
                        <div
                            className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
                            data-oid="d-h4_uv"
                        >
                            <svg
                                className="w-10 h-10 md:w-12 md:h-12 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="i:-n5es"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                    data-oid="dz4--zf"
                                />
                            </svg>
                        </div>
                        <h1
                            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4"
                            data-oid="knzoimt"
                        >
                            Order Placed Successfully!
                        </h1>
                        <p
                            className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base px-4"
                            data-oid="iz-mt3k"
                        >
                            Thank you for your order. We{"'"}ll prepare your medicines and deliver them
                            soon.
                        </p>
                        <div
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6 md:mb-8 text-left"
                            data-oid="x-l:5al"
                        >
                            <h2
                                className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4"
                                data-oid="2u80xd-"
                            >
                                Order Summary
                            </h2>
                            <div className="space-y-2 text-xs md:text-sm" data-oid="qgld5cv">
                                <div className="flex justify-between" data-oid=".h9icmo">
                                    <span className="text-gray-600" data-oid="345zgy2">
                                        Order ID:
                                    </span>
                                    <span className="font-semibold" data-oid="qc6xzlm">
                                        {orderSummary.orderId}
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid=":7.-y1g">
                                    <span className="text-gray-600" data-oid="z5ur7cc">
                                        Items:
                                    </span>
                                    <span data-oid="0jdl-nt">
                                        {orderSummary.items.length} items
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid="fs7y95k">
                                    <span className="text-gray-600" data-oid="53s8l3h">
                                        Total Amount:
                                    </span>
                                    <span className="font-bold text-[#1F1F6F]" data-oid=".-cr-vl">
                                        EGP {orderSummary.total.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between" data-oid="_4zxrlj">
                                    <span className="text-gray-600" data-oid="uv2pq2g">
                                        Payment Method:
                                    </span>
                                    <span data-oid="u6p9e-y">{orderSummary.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between" data-oid="c0lk75x">
                                    <span className="text-gray-600" data-oid="y:rjo9t">
                                        Estimated Delivery:
                                    </span>
                                    <span data-oid="xs9c4v.">{orderSummary.estimatedDelivery}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
                            data-oid="n6pzgpa"
                        >
                            <Link
                                href="/shop"
                                className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 text-sm md:text-base"
                                data-oid=":x10a6l"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer data-oid="xhyue9u" />

                {/* Mobile Bottom Padding */}
                <div className="h-20 md:hidden" data-oid="0tl:0n_"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div
            className="min-h-screen bg-gray-50 md:bg-gradient-to-br md:from-slate-50 md:via-white md:to-gray-50"
            data-oid="9:om819"
        >
            {/* Mobile Header */}
            <div className="block md:hidden" data-oid="j40flnc">
                <ClientOnly data-oid="3.2_grv">
                    <MobileHeader data-oid="ipa.kxr" />
                </ClientOnly>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block" data-oid="0a4gd-4">
                <Header data-oid="g9p5q7c" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8" data-oid="2lq4tf1">
                {/* Breadcrumb - Hidden on mobile */}
                {!isMobile && (
                    <nav
                        className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
                        data-oid="-v-900d"
                    >
                        <Link
                            href="/"
                            className="hover:text-[#1F1F6F] transition-colors"
                            data-oid="xpxip7m"
                        >
                            Home
                        </Link>
                        <span data-oid="w5:-9uj">›</span>
                        <Link
                            href="/cart"
                            className="hover:text-[#1F1F6F] transition-colors"
                            data-oid=".pueadk"
                        >
                            Cart
                        </Link>
                        <span data-oid="pkdm0fy">›</span>
                        <span className="text-gray-900 font-medium" data-oid="9pfgbzn">
                            Checkout
                        </span>
                    </nav>
                )}

                <div className="mb-6 md:mb-8" data-oid="i_f0_zk">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900" data-oid="l3yeioc">
                        Checkout
                    </h1>
                    <p
                        className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base"
                        data-oid="m9auehn"
                    >
                        Complete your order • {totalItems} items • EGP {total.toFixed(2)}
                    </p>
                </div>

                {/* Prescription-specific notice - Mobile Optimized */}
                {isFromPrescriptionSelection && currentPrescriptionMetadata && (
                    <div
                        className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4 mb-4 md:mb-6"
                        data-oid="sjclu2."
                    >
                        <div className="flex items-start" data-oid="._-mfep">
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 mr-2 md:mr-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="0jsspdg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    data-oid="we47_20"
                                />
                            </svg>
                            <div className="flex-1 min-w-0" data-oid="seg7jry">
                                <h4
                                    className="font-semibold text-blue-800 text-sm md:text-base"
                                    data-oid="a48wudq"
                                >
                                    Prescription Order:{' '}
                                    {currentPrescriptionMetadata.prescriptionReference}
                                </h4>
                                <p
                                    className="text-blue-700 text-xs md:text-sm mt-1"
                                    data-oid="x22168x"
                                >
                                    You have {currentPrescriptionItems.length} medicine(s) from your
                                    approved prescription.{' '}
                                    {currentPrescriptionMetadata.hasAlternatives &&
                                        ' Some items are alternative medicines.'}{' '}
                                    {currentPrescriptionMetadata.requiresPharmacistConsultation &&
                                        ' Pharmacist consultation required.'}
                                </p>
                                {currentPrescriptionMetadata.specialInstructions &&
                                    currentPrescriptionMetadata.specialInstructions.length > 0 && (
                                        <div className="mt-2" data-oid="9noi5z7">
                                            <ul
                                                className="text-blue-600 text-xs md:text-sm mt-1 space-y-1"
                                                data-oid="las6e4r"
                                            >
                                                {currentPrescriptionMetadata.specialInstructions
                                                    .filter(
                                                        (instruction: string) =>
                                                            !instruction
                                                                .toLowerCase()
                                                                .includes(
                                                                    'order will be split across',
                                                                ) &&
                                                            !instruction
                                                                .toLowerCase()
                                                                .includes('pharmacies'),
                                                    )
                                                    .map((instruction: string, index: number) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-1"
                                                            data-oid="rp1-7t."
                                                        >
                                                            <span
                                                                className="text-blue-500 mt-0.5"
                                                                data-oid="ezc22zq"
                                                            >
                                                                •
                                                            </span>
                                                            {instruction}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {/* General prescription notice - Mobile Optimized */}
                {prescriptionItems.length > 0 && !isFromPrescriptionSelection && (
                    <div
                        className="bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4 mb-4 md:mb-6"
                        data-oid="9il.a20"
                    >
                        <div className="flex items-start" data-oid="9w.dwpg">
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5 text-amber-600 mt-0.5 mr-2 md:mr-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="vk155fb"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    data-oid="7_0wfy_"
                                />
                            </svg>
                            <div className="flex-1 min-w-0" data-oid="1wzn8u_">
                                <h4
                                    className="font-semibold text-amber-800 text-sm md:text-base"
                                    data-oid="84:ll5m"
                                >
                                    Prescription Order
                                </h4>
                                <p
                                    className="text-amber-700 text-xs md:text-sm mt-1"
                                    data-oid="b87ouq9"
                                >
                                    You have {prescriptionItems.length} prescription item(s) from
                                    your approved prescription.{' '}
                                    {isMultiPharmacyOrder &&
                                        ` This order spans ${
                                            Object.keys(pharmacyGroups).length
                                        } pharmacies.`}{' '}
                                    {prescriptionItems.some((item) =>
                                        item.id.includes('alternative'),
                                    ) && ' Some items are alternative medicines.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Steps - Mobile Optimized */}
                <div className="mb-6 md:mb-8" data-oid="pabfjzk">
                    <div
                        className="flex items-center justify-center space-x-4 md:space-x-8"
                        data-oid="lvshk_e"
                    >
                        {[1, 2].map((step) => (
                            <div key={step} className="flex items-center" data-oid="8c1g-t:">
                                <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base ${
                                        step <= currentStep
                                            ? 'bg-[#1F1F6F] text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                    data-oid="m4gw74i"
                                >
                                    {step}
                                </div>
                                <span
                                    className={`ml-1 md:ml-2 font-medium text-xs md:text-sm ${
                                        step <= currentStep ? 'text-[#1F1F6F]' : 'text-gray-500'
                                    }`}
                                    data-oid="dxg6u-4"
                                >
                                    {step === 1 && (
                                        <span className="hidden sm:inline" data-oid=".0vya6o">
                                            Delivery Address
                                        </span>
                                    )}
                                    {step === 1 && (
                                        <span className="sm:hidden" data-oid="yjj8x96">
                                            Address
                                        </span>
                                    )}
                                    {step === 2 && (
                                        <span className="hidden sm:inline" data-oid="ybonmaq">
                                            Review & Place Order
                                        </span>
                                    )}
                                    {step === 2 && (
                                        <span className="sm:hidden" data-oid="3ylv-pe">
                                            Review
                                        </span>
                                    )}
                                </span>
                                {step < 2 && (
                                    <div
                                        className={`w-8 md:w-16 h-0.5 ml-2 md:ml-4 ${
                                            step < currentStep ? 'bg-[#1F1F6F]' : 'bg-gray-200'
                                        }`}
                                        data-oid="57.x3a-"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8" data-oid="kundzyr">
                    <div className="lg:col-span-2" data-oid="07hif89">
                        {currentStep === 1 && (
                            <div
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6"
                                data-oid="36s96w."
                            >
                                <div
                                    className="flex items-center justify-between mb-4 md:mb-6"
                                    data-oid="9.95blo"
                                >
                                    <h2
                                        className="text-lg md:text-xl font-semibold text-gray-900"
                                        data-oid="_pyanae"
                                    >
                                        Delivery Address
                                    </h2>
                                </div>

                                {/* Saved Addresses Section - Mobile Optimized */}
                                {savedAddresses.length > 0 && (
                                    <div className="mb-4 md:mb-6" data-oid=":dfzahj">
                                        <h3
                                            className="text-sm font-semibold text-gray-900 mb-2 md:mb-3"
                                            data-oid="hu44rlg"
                                        >
                                            Saved Addresses
                                        </h3>
                                        <div className="space-y-2 md:space-y-3" data-oid="4v4w:27">
                                            {savedAddresses.map((address, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
                                                        selectedSavedAddress === index.toString()
                                                            ? 'border-[#1F1F6F] bg-blue-50 ring-2 ring-blue-100'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => loadSavedAddress(index)}
                                                    data-oid="i:skqlt"
                                                >
                                                    <div
                                                        className="flex items-center flex-1"
                                                        data-oid="35zb-oo"
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 ${
                                                                selectedSavedAddress ===
                                                                index.toString()
                                                                    ? 'border-[#1F1F6F] bg-[#1F1F6F]'
                                                                    : 'border-gray-300'
                                                            }`}
                                                            data-oid="si9tn68"
                                                        >
                                                            {selectedSavedAddress ===
                                                                index.toString() && (
                                                                <div
                                                                    className="w-2 h-2 bg-white rounded-full"
                                                                    data-oid="5zqlpxj"
                                                                ></div>
                                                            )}
                                                        </div>
                                                        <div
                                                            className="flex-1 min-w-0"
                                                            data-oid="fslq0gv"
                                                        >
                                                            <p
                                                                className="font-medium text-gray-900 text-sm md:text-base"
                                                                data-oid="ib6.3ft"
                                                            >
                                                                {address.firstName}{' '}
                                                                {address.lastName}
                                                            </p>
                                                            <p
                                                                className="text-xs md:text-sm text-gray-600 truncate"
                                                                data-oid="5l_h4o7"
                                                            >
                                                                {getAddressDisplayName(address)}
                                                            </p>
                                                            <p
                                                                className="text-xs md:text-sm text-gray-500"
                                                                data-oid="b0kgcaf"
                                                            >
                                                                {address.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteSavedAddress(index);
                                                        }}
                                                        className="ml-2 text-red-500 hover:text-red-700 text-xs md:text-sm px-2 py-1 rounded hover:bg-red-50 self-end md:self-center mt-2 md:mt-0"
                                                        data-oid="84xuo4n"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add New Address Button - Mobile Optimized */}
                                {!showAddressForm && (
                                    <div className="mb-4 md:mb-6" data-oid="8lz..ht">
                                        <button
                                            onClick={() => {
                                                setSelectedSavedAddress('');
                                                setShowAddressForm(true);
                                                setDeliveryAddress({
                                                    firstName: user?.name?.split(' ')[0] || '',
                                                    lastName: user?.name?.split(' ')[1] || '',
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
                                            }}
                                            className="w-full p-3 md:p-4 border-2 border-dashed border-gray-300 rounded-lg text-[#1F1F6F] font-medium hover:border-[#1F1F6F] hover:bg-blue-50 transition-colors flex items-center justify-center text-sm md:text-base"
                                            data-oid="53fjtwt"
                                        >
                                            <svg
                                                className="w-4 h-4 md:w-5 md:h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="o7lodyu"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                    data-oid="b57c.bq"
                                                />
                                            </svg>
                                            Add New Address
                                        </button>
                                    </div>
                                )}

                                {/* Address Form - Mobile Optimized */}
                                {showAddressForm && (
                                    <div data-oid="989n9ql">
                                        <div
                                            className="flex items-center justify-between mb-3 md:mb-4"
                                            data-oid="19:mutg"
                                        >
                                            <h3
                                                className="text-base md:text-lg font-medium text-gray-900"
                                                data-oid="s3x.1-0"
                                            >
                                                New Address
                                            </h3>
                                            {savedAddresses.length > 0 && (
                                                <button
                                                    onClick={() => {
                                                        setShowAddressForm(false);
                                                        setSelectedSavedAddress('');
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700 text-xs md:text-sm"
                                                    data-oid="j.ndnj0"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                                            data-oid="n5x883v"
                                        >
                                            <div data-oid="kjgrzf9">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="p_13gj_"
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="Enter first name"
                                                    data-oid="3rmshwa"
                                                />
                                            </div>
                                            <div data-oid="yulbjsl">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="4y0e_8n"
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="Enter last name"
                                                    data-oid="kal72p."
                                                />
                                            </div>
                                            <div data-oid="7bw1n4q">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="0v:4iju"
                                                >
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={deliveryAddress.phone}
                                                    onChange={(e) =>
                                                        handleAddressChange('phone', e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="+20 1XX XXX XXXX"
                                                    data-oid="o9cfgxq"
                                                />
                                            </div>
                                            <div data-oid="6d..s0w">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="9ownzsr"
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="+20 1XX XXX XXXX"
                                                    data-oid="fmp5ipa"
                                                />
                                            </div>
                                            <div data-oid="_v8djgp">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="4owpx4l"
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    data-oid="78cgj6u"
                                                >
                                                    <option value="" data-oid="22qugh8">
                                                        Select Governorate
                                                    </option>
                                                    <option value="Ismailia" data-oid="np60zes">
                                                        Ismailia
                                                    </option>
                                                    <option value="Cairo" data-oid="erzqdt.">
                                                        Cairo
                                                    </option>
                                                    <option value="Alexandria" data-oid="5wli.nq">
                                                        Alexandria
                                                    </option>
                                                    <option value="Giza" data-oid="3g81ne0">
                                                        Giza
                                                    </option>
                                                </select>
                                            </div>
                                            <div data-oid="tokmuxq">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="7u-p8k0"
                                                >
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={deliveryAddress.city}
                                                    onChange={(e) =>
                                                        handleAddressChange('city', e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="Enter city"
                                                    data-oid="gap7b8q"
                                                />
                                            </div>
                                            <div data-oid="vca9i9w">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="llzqmzg"
                                                >
                                                    Area/District *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={deliveryAddress.area}
                                                    onChange={(e) =>
                                                        handleAddressChange('area', e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="Enter area or district"
                                                    data-oid="kx:yot8"
                                                />
                                            </div>
                                            <div data-oid="z2g9_yd">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="bf9f3oq"
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="Enter street name"
                                                    data-oid="cu9dmvy"
                                                />
                                            </div>
                                            <div data-oid="nn616cy">
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2"
                                                    data-oid="p-wjavx"
                                                >
                                                    Building Number *
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-[#1F1F6F] text-sm md:text-base"
                                                    placeholder="Building number"
                                                    data-oid="qaoxcg3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4 md:space-y-6" data-oid="u2_kfxl">
                                {/* Order Summary - Mobile First */}
                                {isMobile && (
                                    <div
                                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6"
                                        data-oid="mobile-order-summary"
                                    >
                                        <h3
                                            className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4"
                                            data-oid="mobile-summary-title"
                                        >
                                            Order Summary
                                        </h3>
                                        <div
                                            className="mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg"
                                            data-oid="mobile-summary-items"
                                        >
                                            <div
                                                className="flex justify-between text-xs md:text-sm"
                                                data-oid="mobile-items-count"
                                            >
                                                <span
                                                    className="text-gray-600"
                                                    data-oid="mobile-items-label"
                                                >
                                                    Items:
                                                </span>
                                                <span data-oid="mobile-items-value">
                                                    {totalItems} items
                                                </span>
                                            </div>
                                            {uniquePharmacies.size > 1 && (
                                                <div
                                                    className="flex justify-between text-xs md:text-sm mt-1"
                                                    data-oid="mobile-pharmacies-count"
                                                >
                                                    <span
                                                        className="text-gray-600"
                                                        data-oid="mobile-pharmacies-label"
                                                    >
                                                        Pharmacies:
                                                    </span>
                                                    <span data-oid="mobile-pharmacies-value">
                                                        {uniquePharmacies.size} pharmacies
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="space-y-2 md:space-y-3 mb-4 md:mb-6"
                                            data-oid="mobile-price-breakdown"
                                        >
                                            <div
                                                className="flex justify-between text-sm md:text-base"
                                                data-oid="mobile-subtotal"
                                            >
                                                <span
                                                    className="text-gray-600"
                                                    data-oid="mobile-subtotal-label"
                                                >
                                                    Subtotal
                                                </span>
                                                <span
                                                    className="font-semibold"
                                                    data-oid="mobile-subtotal-value"
                                                >
                                                    EGP {subtotal.toFixed(2)}
                                                </span>
                                            </div>
                                            {discount > 0 && (
                                                <div
                                                    className="flex justify-between text-green-600 text-sm md:text-base"
                                                    data-oid="mobile-discount"
                                                >
                                                    <span data-oid="mobile-discount-label">
                                                        Discount ({appliedPromo?.code})
                                                    </span>
                                                    <span data-oid="mobile-discount-value">
                                                        -EGP {discount.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className="flex justify-between text-sm md:text-base"
                                                data-oid="mobile-delivery"
                                            >
                                                <span
                                                    className="text-gray-600"
                                                    data-oid="mobile-delivery-label"
                                                >
                                                    Delivery Fee
                                                </span>
                                                <span
                                                    className="font-semibold"
                                                    data-oid="mobile-delivery-value"
                                                >
                                                    {deliveryFee === 0
                                                        ? 'FREE'
                                                        : `EGP ${deliveryFee.toFixed(2)}`}
                                                </span>
                                            </div>
                                            <div
                                                className="border-t border-gray-200 pt-2 md:pt-3"
                                                data-oid="mobile-total-section"
                                            >
                                                <div
                                                    className="flex justify-between"
                                                    data-oid="mobile-total"
                                                >
                                                    <span
                                                        className="text-base md:text-lg font-semibold"
                                                        data-oid="mobile-total-label"
                                                    >
                                                        Total
                                                    </span>
                                                    <span
                                                        className="text-base md:text-lg font-bold text-[#1F1F6F]"
                                                        data-oid="mobile-total-value"
                                                    >
                                                        EGP {total.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="p-2 md:p-3 bg-blue-50 rounded-lg mb-3 md:mb-4"
                                            data-oid="mobile-delivery-time"
                                        >
                                            <div
                                                className="flex items-center text-xs md:text-sm text-blue-800"
                                                data-oid="mobile-delivery-estimate"
                                            >
                                                <svg
                                                    className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    data-oid="mobile-clock-icon"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        data-oid="mobile-clock-path"
                                                    />
                                                </svg>
                                                Estimated delivery: {estimatedDeliveryTime}
                                            </div>
                                        </div>
                                        <div
                                            className="p-2 md:p-3 bg-gray-50 rounded-lg"
                                            data-oid="mobile-security"
                                        >
                                            <div
                                                className="flex items-center text-xs md:text-sm text-gray-600"
                                                data-oid="mobile-security-text"
                                            >
                                                <svg
                                                    className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    data-oid="mobile-lock-icon"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                        data-oid="mobile-lock-path"
                                                    />
                                                </svg>
                                                Secure checkout • Cash on delivery
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6"
                                    data-oid="j4u1hek"
                                >
                                    <h2
                                        className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4"
                                        data-oid="p2cqt__"
                                    >
                                        Order Items ({totalItems} items)
                                        {isMultiPharmacyOrder && (
                                            <span
                                                className="ml-2 text-xs md:text-sm font-normal text-gray-600"
                                                data-oid="2des4i:"
                                            >
                                                • {Object.keys(pharmacyGroups).length} pharmacies
                                            </span>
                                        )}
                                    </h2>
                                    {isMultiPharmacyOrder ? (
                                        // Group by pharmacy - Mobile Optimized
                                        <div className="space-y-4 md:space-y-6" data-oid="71b_veb">
                                            {Object.entries(pharmacyGroups).map(
                                                ([pharmacyId, pharmacyItems], index) => (
                                                    <div
                                                        key={pharmacyId}
                                                        className="border border-gray-200 rounded-lg p-3 md:p-4"
                                                        data-oid="tetms8y"
                                                    >
                                                        <h3
                                                            className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center text-sm md:text-base"
                                                            data-oid="0z2uy9k"
                                                        >
                                                            <span
                                                                className="w-5 h-5 md:w-6 md:h-6 bg-[#1F1F6F] text-white rounded-full flex items-center justify-center text-xs md:text-sm mr-2"
                                                                data-oid="jrgyy01"
                                                            >
                                                                {index + 1}
                                                            </span>
                                                            🏥 {pharmacyItems[0].pharmacy}
                                                            <span
                                                                className="ml-2 text-xs md:text-sm font-normal text-gray-600"
                                                                data-oid="cksmv3a"
                                                            >
                                                                ({pharmacyItems.length} items)
                                                            </span>
                                                        </h3>
                                                        <div
                                                            className="space-y-2 md:space-y-3"
                                                            data-oid="pmv33.."
                                                        >
                                                            {pharmacyItems.map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex items-center space-x-3 md:space-x-4 p-2 md:p-3 bg-gray-50 rounded-lg"
                                                                    data-oid="cy51-43"
                                                                >
                                                                    <div
                                                                        className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
                                                                        data-oid="fw5lnmv"
                                                                    >
                                                                        <span
                                                                            className="text-base md:text-lg"
                                                                            data-oid="11a6160"
                                                                        >
                                                                            {item.prescription
                                                                                ? '💊'
                                                                                : item.category ===
                                                                                    'supplements'
                                                                                  ? '🍿'
                                                                                  : item.category ===
                                                                                      'skincare'
                                                                                    ? '🧴'
                                                                                    : '💊'}
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="flex-1 min-w-0"
                                                                        data-oid="x7bm0td"
                                                                    >
                                                                        <h4
                                                                            className="font-medium text-gray-900 text-sm md:text-base truncate"
                                                                            data-oid="_5m:bmg"
                                                                        >
                                                                            {item.name}
                                                                            {item.prescription &&
                                                                                item.id.includes(
                                                                                    'alternative',
                                                                                ) && (
                                                                                    <span
                                                                                        className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                                                                        data-oid="k1az49."
                                                                                    >
                                                                                        Alt
                                                                                    </span>
                                                                                )}
                                                                        </h4>
                                                                        <p
                                                                            className="text-xs md:text-sm text-gray-600"
                                                                            data-oid="hgopyuu"
                                                                        >
                                                                            Qty: {item.quantity} •
                                                                            EGP{' '}
                                                                            {item.price.toFixed(2)}{' '}
                                                                            each
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className="text-right"
                                                                        data-oid=".4487s0"
                                                                    >
                                                                        <p
                                                                            className="font-bold text-[#1F1F6F] text-sm md:text-base"
                                                                            data-oid="cbfzs_7"
                                                                        >
                                                                            EGP{' '}
                                                                            {(
                                                                                item.price *
                                                                                item.quantity
                                                                            ).toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div
                                                            className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200 text-right"
                                                            data-oid="8vp3ldf"
                                                        >
                                                            <p
                                                                className="text-xs md:text-sm text-gray-600"
                                                                data-oid="lm4r-35"
                                                            >
                                                                Pharmacy subtotal: EGP{' '}
                                                                {pharmacyItems
                                                                    .reduce(
                                                                        (sum, item) =>
                                                                            sum +
                                                                            item.price *
                                                                                item.quantity,
                                                                        0,
                                                                    )
                                                                    .toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        // Single pharmacy or mixed items - Mobile Optimized
                                        <div className="space-y-3 md:space-y-4" data-oid="tlhsfqx">
                                            {items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 border border-gray-100 rounded-lg"
                                                    data-oid="rjucx57"
                                                >
                                                    <div
                                                        className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        data-oid="eyf4qs."
                                                    >
                                                        <span
                                                            className="text-lg md:text-2xl"
                                                            data-oid="gwglunp"
                                                        >
                                                            {item.prescription
                                                                ? '💊'
                                                                : item.category === 'supplements'
                                                                  ? '🍿'
                                                                  : item.category === 'skincare'
                                                                    ? '🧴'
                                                                    : '💊'}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-0"
                                                        data-oid="u089llj"
                                                    >
                                                        <h3
                                                            className="font-semibold text-gray-900 text-sm md:text-base truncate"
                                                            data-oid="elri4bf"
                                                        >
                                                            {item.name}
                                                            {item.prescription &&
                                                                item.id.includes('alternative') && (
                                                                    <span
                                                                        className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                                                        data-oid="x.up_09"
                                                                    >
                                                                        Alt
                                                                    </span>
                                                                )}
                                                        </h3>
                                                        <p
                                                            className="text-xs md:text-sm text-gray-600 truncate"
                                                            data-oid="4szy4r."
                                                        >
                                                            🏥 {item.pharmacy} • {item.cityName}
                                                        </p>
                                                        <p
                                                            className="text-xs md:text-sm text-gray-500"
                                                            data-oid="qbita79"
                                                        >
                                                            Qty: {item.quantity} • EGP{' '}
                                                            {item.price.toFixed(2)} each
                                                        </p>
                                                    </div>
                                                    <div className="text-right" data-oid="x2s9-jz">
                                                        <p
                                                            className="font-bold text-[#1F1F6F] text-sm md:text-base"
                                                            data-oid="c4i2y14"
                                                        >
                                                            EGP{' '}
                                                            {(item.price * item.quantity).toFixed(
                                                                2,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6"
                                    data-oid="4.j94:v"
                                >
                                    <h2
                                        className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4"
                                        data-oid="7n-gsjb"
                                    >
                                        Delivery Address
                                    </h2>
                                    <div
                                        className="text-xs md:text-sm text-gray-600 space-y-1"
                                        data-oid="d5twfy4"
                                    >
                                        <p
                                            className="font-semibold text-gray-900 text-sm md:text-base"
                                            data-oid="u5sxn2i"
                                        >
                                            {deliveryAddress.firstName} {deliveryAddress.lastName}
                                        </p>
                                        <p data-oid="i4sj-65">{deliveryAddress.phone}</p>
                                        <p data-oid="zwt6erq">
                                            {deliveryAddress.building} {deliveryAddress.street},{' '}
                                            {deliveryAddress.area}
                                        </p>
                                        <p data-oid="a31.58v">
                                            {deliveryAddress.city}, {deliveryAddress.governorate}
                                        </p>
                                        {deliveryAddress.landmark && (
                                            <p className="text-gray-500" data-oid="4s9o0_j">
                                                Near: {deliveryAddress.landmark}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="mt-2 md:mt-3 text-[#1F1F6F] text-xs md:text-sm hover:underline"
                                        data-oid="n7id6o0"
                                    >
                                        Edit Address
                                    </button>
                                </div>

                                {/* Payment Method - Moved after Order Summary on Mobile */}
                                <div
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6"
                                    data-oid="bodq0ju"
                                >
                                    <h2
                                        className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4"
                                        data-oid="_a9907z"
                                    >
                                        Payment Method
                                    </h2>
                                    <div
                                        className="flex items-center p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50"
                                        data-oid="2p-y8.b"
                                    >
                                        <div
                                            className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 md:mr-4 flex-shrink-0"
                                            data-oid="e-40j8i"
                                        >
                                            <svg
                                                className="w-5 h-5 md:w-6 md:h-6 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="0ksrg0b"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                    data-oid="fbpzesq"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0" data-oid="_3k1_iv">
                                            <h3
                                                className="font-semibold text-gray-900 text-sm md:text-base"
                                                data-oid="_yh.otl"
                                            >
                                                Cash on Delivery
                                            </h3>
                                            <p
                                                className="text-xs md:text-sm text-gray-600"
                                                data-oid="2m02ejp"
                                            >
                                                Pay when your order is delivered
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-6 md:mt-8 gap-3" data-oid="ygr92vr">
                            <button
                                onClick={handlePrevStep}
                                disabled={currentStep === 1}
                                className="px-4 md:px-6 py-2.5 md:py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                data-oid="c:_au16"
                            >
                                Previous
                            </button>
                            {currentStep < 2 ? (
                                <button
                                    onClick={handleNextStep}
                                    disabled={!validateStep(currentStep)}
                                    className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                    data-oid="p:0675n"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isLoading || !validateStep(currentStep)}
                                    className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm md:text-base"
                                    data-oid="af:4k_2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div
                                                className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                                data-oid="cfha-xl"
                                            ></div>
                                            <span className="hidden sm:inline" data-oid="i88egoj">
                                                Placing Order...
                                            </span>
                                            <span className="sm:hidden" data-oid="_--j3xx">
                                                Placing...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline" data-oid="btn46y7">
                                                Place Order
                                            </span>
                                            <span className="sm:hidden" data-oid="_5i9r_m">
                                                Place Order
                                            </span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Order Summary - Hidden on Mobile */}
                    {!isMobile && (
                        <div className="lg:col-span-1" data-oid="7a000cl">
                            <div
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 sticky top-4 md:top-24"
                                data-oid="6a9k8g9"
                            >
                                <h3
                                    className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4"
                                    data-oid="hc5_zo9"
                                >
                                    Order Summary
                                </h3>
                                <div
                                    className="mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg"
                                    data-oid="cgjcmg8"
                                >
                                    <div
                                        className="flex justify-between text-xs md:text-sm"
                                        data-oid="5vp9.3a"
                                    >
                                        <span className="text-gray-600" data-oid="22k.u6d">
                                            Items:
                                        </span>
                                        <span data-oid="frhmxor">{totalItems} items</span>
                                    </div>
                                    {uniquePharmacies.size > 1 && (
                                        <div
                                            className="flex justify-between text-xs md:text-sm mt-1"
                                            data-oid="ruv3u0s"
                                        >
                                            <span className="text-gray-600" data-oid="yvvi64k">
                                                Pharmacies:
                                            </span>
                                            <span data-oid="t9-8:fb">
                                                {uniquePharmacies.size} pharmacies
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="space-y-2 md:space-y-3 mb-4 md:mb-6"
                                    data-oid="x3ib83l"
                                >
                                    <div
                                        className="flex justify-between text-sm md:text-base"
                                        data-oid="mcsfd02"
                                    >
                                        <span className="text-gray-600" data-oid="d83f:4l">
                                            Subtotal
                                        </span>
                                        <span className="font-semibold" data-oid="7vs4-4x">
                                            EGP {subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div
                                            className="flex justify-between text-green-600 text-sm md:text-base"
                                            data-oid=":a6o_dr"
                                        >
                                            <span data-oid="0-05tsc">
                                                Discount ({appliedPromo?.code})
                                            </span>
                                            <span data-oid="oig5n50">
                                                -EGP {discount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        className="flex justify-between text-sm md:text-base"
                                        data-oid="x3vhly4"
                                    >
                                        <span className="text-gray-600" data-oid="aa58ci4">
                                            Delivery Fee
                                        </span>
                                        <span className="font-semibold" data-oid="6av2:if">
                                            {deliveryFee === 0
                                                ? 'FREE'
                                                : `EGP ${deliveryFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div
                                        className="border-t border-gray-200 pt-2 md:pt-3"
                                        data-oid="ug3l9sd"
                                    >
                                        <div className="flex justify-between" data-oid="o3y5tr7">
                                            <span
                                                className="text-base md:text-lg font-semibold"
                                                data-oid="-4uds_p"
                                            >
                                                Total
                                            </span>
                                            <span
                                                className="text-base md:text-lg font-bold text-[#1F1F6F]"
                                                data-oid="wpgznsr"
                                            >
                                                EGP {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="p-2 md:p-3 bg-blue-50 rounded-lg mb-3 md:mb-4"
                                    data-oid="ldhosu3"
                                >
                                    <div
                                        className="flex items-center text-xs md:text-sm text-blue-800"
                                        data-oid="_kg8gk."
                                    >
                                        <svg
                                            className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="vhqvpig"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                data-oid="zr-9kyz"
                                            />
                                        </svg>
                                        Estimated delivery: {estimatedDeliveryTime}
                                    </div>
                                </div>
                                <div
                                    className="p-2 md:p-3 bg-gray-50 rounded-lg"
                                    data-oid="f7kjqwj"
                                >
                                    <div
                                        className="flex items-center text-xs md:text-sm text-gray-600"
                                        data-oid="sdq0-a4"
                                    >
                                        <svg
                                            className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="mme49.p"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                data-oid="-66rxwn"
                                            />
                                        </svg>
                                        Secure checkout • Cash on delivery
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer data-oid="n6y.r.c" />

            {/* Mobile Bottom Padding */}
            <div className="h-20 md:hidden" data-oid="n6qg1d2"></div>
        </div>
    );
}
