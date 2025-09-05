'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';

interface PharmacyCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (pharmacyData: PharmacyFormData) => void;
    editingPharmacy?: any;
}

interface PharmacyFormData {
    nameEn: string;
    nameAr: string;
    email: string;
    password: string;
    phone: string;
    whatsapp: string;
    address: string;
    addressAr: string;
    cityId: string;
    governorateId: string;
    licenseNumber: string;
    licenseExpiry: string;
    taxId: string;
    commissionRate: number;
    commissionType: 'fixed' | 'tiered';
    minimumOrder: number;
    workingHours: {
        monday: { open: string; close: string; is24Hours: boolean };
        tuesday: { open: string; close: string; is24Hours: boolean };
        wednesday: { open: string; close: string; is24Hours: boolean };
        thursday: { open: string; close: string; is24Hours: boolean };
        friday: { open: string; close: string; is24Hours: boolean };
        saturday: { open: string; close: string; is24Hours: boolean };
        sunday: { open: string; close: string; is24Hours: boolean };
    };
    features: string[];
    specialties: string[];
    bankAccount: {
        accountNumber: string;
        bankName: string;
        iban: string;
    };
    contactPerson: {
        name: string;
        nameAr: string;
        position: string;
        phone: string;
        email: string;
    };
}

const defaultWorkingHours = {
    monday: { open: '08:00', close: '22:00', is24Hours: false },
    tuesday: { open: '08:00', close: '22:00', is24Hours: false },
    wednesday: { open: '08:00', close: '22:00', is24Hours: false },
    thursday: { open: '08:00', close: '22:00', is24Hours: false },
    friday: { open: '08:00', close: '22:00', is24Hours: false },
    saturday: { open: '08:00', close: '22:00', is24Hours: false },
    sunday: { open: '10:00', close: '20:00', is24Hours: false },
};

export function PharmacyCreationModal({
    isOpen,
    onClose,
    onSubmit,
    editingPharmacy,
}: PharmacyCreationModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<PharmacyFormData>({
        nameEn: editingPharmacy?.name || '',
        nameAr: editingPharmacy?.nameAr || '',
        email: editingPharmacy?.email || '',
        password: '',
        phone: editingPharmacy?.phone || '',
        whatsapp: editingPharmacy?.phone || '',
        address: editingPharmacy?.address || '',
        addressAr: editingPharmacy?.addressAr || '',
        cityId: editingPharmacy?.cityId || '',
        governorateId: editingPharmacy?.governorateId || '',
        licenseNumber: editingPharmacy?.licenseNumber || '',
        licenseExpiry: editingPharmacy?.licenseExpiry || '',
        taxId: editingPharmacy?.taxId || '',
        commissionRate: editingPharmacy?.commission?.rate || 10,
        commissionType: editingPharmacy?.commission?.type || 'fixed',
        minimumOrder: editingPharmacy?.commission?.minimumOrder || 50,
        workingHours: editingPharmacy?.workingHours || defaultWorkingHours,
        features: editingPharmacy?.features || [],
        specialties: editingPharmacy?.specialties || [],
        bankAccount: editingPharmacy?.bankAccount || {
            accountNumber: '',
            bankName: '',
            iban: '',
        },
        contactPerson: editingPharmacy?.contactPerson || {
            name: '',
            nameAr: '',
            position: '',
            phone: '',
            email: '',
        },
    });

    const cities = [
        { id: 'cairo-city', name: 'Cairo City', governorateId: 'cairo' },
        { id: 'ismailia-city', name: 'Ismailia City', governorateId: 'ismailia' },
        { id: 'alexandria-city', name: 'Alexandria City', governorateId: 'alexandria' },
        { id: 'giza-city', name: 'Giza City', governorateId: 'giza' },
    ];

    const governorates = [
        { id: 'cairo', name: 'Cairo' },
        { id: 'ismailia', name: 'Ismailia' },
        { id: 'alexandria', name: 'Alexandria' },
        { id: 'giza', name: 'Giza' },
    ];

    const availableFeatures = [
        { id: 'home_delivery', label: 'Home Delivery', labelAr: 'التوصيل المنزلي' },
        { id: 'consultation', label: 'Consultation', labelAr: 'الاستشارة' },
        { id: 'prescription_reading', label: 'Prescription Reading', labelAr: 'قراءة الوصفات' },
        { id: 'emergency', label: 'Emergency Service', labelAr: 'خدمة الطوارئ' },
        { id: '24_hours', label: '24 Hours Service', labelAr: 'خدمة 24 ساعة' },
        { id: 'baby_care', label: 'Baby Care', labelAr: 'رعاية الأطفال' },
        { id: 'nutrition_advice', label: 'Nutrition Advice', labelAr: 'نصائح التغذية' },
        { id: 'beauty_consultation', label: 'Beauty Consultation', labelAr: 'استشارة التجميل' },
    ];

    const availableSpecialties = [
        { id: 'prescription', label: 'Prescription Medicines', labelAr: 'الأدوية بوصفة طبية' },
        { id: 'otc', label: 'Over-the-Counter', labelAr: 'أدوية بدون وصفة' },
        { id: 'supplements', label: 'Supplements', labelAr: 'المكملات الغذائية' },
        { id: 'vitamins', label: 'Vitamins', labelAr: 'الفيتامينات' },
        { id: 'skincare', label: 'Skincare', labelAr: 'العناية بالبشرة' },
        { id: 'medical', label: 'Medical Equipment', labelAr: 'المعدات الطبية' },
        { id: 'baby', label: 'Baby Care', labelAr: 'رعاية الأطفال' },
        { id: 'emergency', label: 'Emergency Medicines', labelAr: 'أدوية الطوارئ' },
    ];

    const banks = [
        'National Bank of Egypt',
        'Banque Misr',
        'Commercial International Bank',
        'Arab African International Bank',
        'HSBC Egypt',
        'Crédit Agricole Egypt',
        'Banque du Caire',
        'Export Development Bank of Egypt',
    ];

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNestedInputChange = (parent: string, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent as keyof PharmacyFormData],
                [field]: value,
            },
        }));
    };

    const handleWorkingHoursChange = (day: string, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day as keyof typeof prev.workingHours],
                    [field]: value,
                },
            },
        }));
    };

    const handleFeatureToggle = (featureId: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.includes(featureId)
                ? prev.features.filter((f) => f !== featureId)
                : [...prev.features, featureId],
        }));
    };

    const handleSpecialtyToggle = (specialtyId: string) => {
        setFormData((prev) => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyId)
                ? prev.specialties.filter((s) => s !== specialtyId)
                : [...prev.specialties, specialtyId],
        }));
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData((prev) => ({ ...prev, password }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
        setCurrentStep(1);
        setFormData({
            nameEn: '',
            nameAr: '',
            email: '',
            password: '',
            phone: '',
            whatsapp: '',
            address: '',
            addressAr: '',
            cityId: '',
            governorateId: '',
            licenseNumber: '',
            licenseExpiry: '',
            taxId: '',
            commissionRate: 10,
            commissionType: 'fixed',
            minimumOrder: 50,
            workingHours: defaultWorkingHours,
            features: [],
            specialties: [],
            bankAccount: {
                accountNumber: '',
                bankName: '',
                iban: '',
            },
            contactPerson: {
                name: '',
                nameAr: '',
                position: '',
                phone: '',
                email: '',
            },
        });
    };

    const steps = [
        { id: 1, title: 'Basic Information', icon: '🏥' },
        { id: 2, title: 'Location & Contact', icon: '📍' },
        { id: 3, title: 'Legal & Financial', icon: '📄' },
        { id: 4, title: 'Commission & Terms', icon: '💰' },
        { id: 5, title: 'Working Hours', icon: '🕒' },
        { id: 6, title: 'Services & Features', icon: '⚙️' },
        { id: 7, title: 'Contact Person', icon: '👤' },
    ];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            data-oid="44asg76"
        >
            <div
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                data-oid="6qdufdc"
            >
                {/* Header */}
                <div className="bg-[#1F1F6F] text-white p-6" data-oid="q0wobj3">
                    <div className="flex items-center justify-between" data-oid="ti8ltmj">
                        <h2 className="text-xl font-bold" data-oid="1wb1996">
                            {editingPharmacy ? 'Edit Pharmacy' : 'Add New Pharmacy'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-300 text-2xl"
                            data-oid="wnekm_f"
                        >
                            ×
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div
                        className="flex items-center space-x-2 mt-4 overflow-x-auto"
                        data-oid="v1qs6zi"
                    >
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center" data-oid="1jyce6x">
                                <div
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                                        currentStep === step.id
                                            ? 'bg-white text-[#1F1F6F]'
                                            : currentStep > step.id
                                              ? 'bg-green-500 text-white'
                                              : 'bg-[#14274E] text-gray-300'
                                    }`}
                                    data-oid="ylja334"
                                >
                                    <span data-oid="hme6mmc">{step.icon}</span>
                                    <span className="hidden md:inline" data-oid="opykl3o">
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className="w-4 h-0.5 bg-gray-400 mx-1"
                                        data-oid="syda5w6"
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]" data-oid="9c5w8_i">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4" data-oid="vpxfh..">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="i8-sqfc"
                            >
                                Basic Information
                            </h3>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="-j_ljed"
                            >
                                <div data-oid="9a6_o.9">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="524a9ie"
                                    >
                                        Pharmacy Name (English) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nameEn}
                                        onChange={(e) =>
                                            handleInputChange('nameEn', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="Enter pharmacy name in English"
                                        required
                                        data-oid="eijvtu-"
                                    />
                                </div>

                                <div data-oid="x1mh-zl">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="tn7.eb1"
                                    >
                                        Pharmacy Name (Arabic) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nameAr}
                                        onChange={(e) =>
                                            handleInputChange('nameAr', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="أدخل اسم الصيدلية بالعربية"
                                        dir="rtl"
                                        required
                                        data-oid="5gnek_g"
                                    />
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="r_oxxc5"
                            >
                                <div data-oid="yh:26na">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="kuu2qnx"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="pharmacy@example.com"
                                        required
                                        data-oid="6jiqnwq"
                                    />
                                </div>

                                <div data-oid="tn7657h">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="gj-72-p"
                                    >
                                        Password *
                                    </label>
                                    <div className="flex space-x-2" data-oid="fzkg619">
                                        <input
                                            type="text"
                                            value={formData.password}
                                            onChange={(e) =>
                                                handleInputChange('password', e.target.value)
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            placeholder="Enter password"
                                            required
                                            data-oid="h_s6ffb"
                                        />

                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                                            data-oid="z1afe9_"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid=":kd87m8"
                            >
                                <div data-oid="i5_k79i">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid=".y1e32a"
                                    >
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="+20 XX XXX XXXX"
                                        required
                                        data-oid="hlc7gdx"
                                    />
                                </div>

                                <div data-oid="w.dg3vo">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="8ce2mek"
                                    >
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.whatsapp}
                                        onChange={(e) =>
                                            handleInputChange('whatsapp', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="+20 XX XXX XXXX"
                                        data-oid="i.hnnxx"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location & Contact */}
                    {currentStep === 2 && (
                        <div className="space-y-4" data-oid="lup9cc_">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="v8v-958"
                            >
                                Location & Contact
                            </h3>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="91o:c44"
                            >
                                <div data-oid="v_ze55g">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="cwjhn0g"
                                    >
                                        Governorate *
                                    </label>
                                    <select
                                        value={formData.governorateId}
                                        onChange={(e) => {
                                            handleInputChange('governorateId', e.target.value);
                                            handleInputChange('cityId', ''); // Reset city when governorate changes
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        data-oid="wz1lnge"
                                    >
                                        <option value="" data-oid="y_.2788">
                                            Select Governorate
                                        </option>
                                        {governorates.map((gov) => (
                                            <option key={gov.id} value={gov.id} data-oid="y072j80">
                                                {gov.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div data-oid="yyrgql6">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="0yyb4:a"
                                    >
                                        City *
                                    </label>
                                    <select
                                        value={formData.cityId}
                                        onChange={(e) =>
                                            handleInputChange('cityId', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        disabled={!formData.governorateId}
                                        data-oid="8b8hvkf"
                                    >
                                        <option value="" data-oid="polpmw0">
                                            Select City
                                        </option>
                                        {cities
                                            .filter(
                                                (city) =>
                                                    city.governorateId === formData.governorateId,
                                            )
                                            .map((city) => (
                                                <option
                                                    key={city.id}
                                                    value={city.id}
                                                    data-oid="b21g_em"
                                                >
                                                    {city.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div data-oid="mds5wua">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="tme8z_0"
                                >
                                    Address (English) *
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    rows={3}
                                    placeholder="Enter full address in English"
                                    required
                                    data-oid="rqt1wyk"
                                />
                            </div>

                            <div data-oid="y.yney.">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="jt3-uvz"
                                >
                                    Address (Arabic) *
                                </label>
                                <textarea
                                    value={formData.addressAr}
                                    onChange={(e) => handleInputChange('addressAr', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    rows={3}
                                    placeholder="أدخل العنوان الكامل بالعربية"
                                    dir="rtl"
                                    required
                                    data-oid="50f4x48"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Legal & Financial */}
                    {currentStep === 3 && (
                        <div className="space-y-4" data-oid="d-gt55q">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid=".scs8y-"
                            >
                                Legal & Financial Information
                            </h3>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="7:e1b22"
                            >
                                <div data-oid="zfrdtvc">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="pn_v7w_"
                                    >
                                        Pharmacy License Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.licenseNumber}
                                        onChange={(e) =>
                                            handleInputChange('licenseNumber', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="PH-XXX-XXXX-XXX"
                                        required
                                        data-oid="_q-s8x9"
                                    />
                                </div>

                                <div data-oid="2mpfxue">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="d8y_wsz"
                                    >
                                        License Expiry Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.licenseExpiry}
                                        onChange={(e) =>
                                            handleInputChange('licenseExpiry', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        data-oid="t_x5fhg"
                                    />
                                </div>
                            </div>

                            <div data-oid="mczq6uv">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="r17luy:"
                                >
                                    Tax ID Number *
                                </label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    placeholder="TAX-XXXXXXXXX"
                                    required
                                    data-oid="y1..ya_"
                                />
                            </div>

                            <div className="space-y-4" data-oid="m:yyusk">
                                <h4 className="font-medium text-gray-900" data-oid="qkjqsnb">
                                    Bank Account Information
                                </h4>

                                <div data-oid="_7sote1">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="c2.h965"
                                    >
                                        Bank Name *
                                    </label>
                                    <select
                                        value={formData.bankAccount.bankName}
                                        onChange={(e) =>
                                            handleNestedInputChange(
                                                'bankAccount',
                                                'bankName',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        data-oid="l7i0wli"
                                    >
                                        <option value="" data-oid="v.70ag4">
                                            Select Bank
                                        </option>
                                        {banks.map((bank) => (
                                            <option key={bank} value={bank} data-oid="a.uvvgp">
                                                {bank}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    data-oid="uj0pp8y"
                                >
                                    <div data-oid="y6-:.em">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                            data-oid="4qs1u4t"
                                        >
                                            Account Number *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.bankAccount.accountNumber}
                                            onChange={(e) =>
                                                handleNestedInputChange(
                                                    'bankAccount',
                                                    'accountNumber',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            placeholder="XXXXXXXXXX"
                                            required
                                            data-oid="obq2yf7"
                                        />
                                    </div>

                                    <div data-oid="t45faom">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                            data-oid="lejtc8_"
                                        >
                                            IBAN *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.bankAccount.iban}
                                            onChange={(e) =>
                                                handleNestedInputChange(
                                                    'bankAccount',
                                                    'iban',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                            placeholder="EG380003000000000001234567890"
                                            required
                                            data-oid="0zmod3f"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Commission & Terms */}
                    {currentStep === 4 && (
                        <div className="space-y-4" data-oid="9_ej:ps">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="8fba3yl"
                            >
                                Commission & Terms
                            </h3>

                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                data-oid="2fhi6.-"
                            >
                                <div data-oid="xwnwef3">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="p5he3h9"
                                    >
                                        Commission Rate (%) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.commissionRate}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'commissionRate',
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        min="0"
                                        max="50"
                                        step="0.1"
                                        required
                                        data-oid="zn8p5qv"
                                    />

                                    <p className="text-xs text-gray-500 mt-1" data-oid="gfn-2ue">
                                        Percentage of each order that CURA will take as commission
                                    </p>
                                </div>

                                <div data-oid="v8cxxle">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="uj4rad6"
                                    >
                                        Commission Type *
                                    </label>
                                    <select
                                        value={formData.commissionType}
                                        onChange={(e) =>
                                            handleInputChange('commissionType', e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        required
                                        data-oid="q0kc93-"
                                    >
                                        <option value="fixed" data-oid="9vjcl7.">
                                            Fixed Rate
                                        </option>
                                        <option value="tiered" data-oid="r8e-qgn">
                                            Tiered Rate
                                        </option>
                                    </select>
                                </div>

                                <div data-oid="0a_6mdg">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="3w2yyvk"
                                    >
                                        Minimum Order (EGP) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.minimumOrder}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'minimumOrder',
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        min="0"
                                        required
                                        data-oid="4rxuefi"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg" data-oid="g67l139">
                                <h4 className="font-medium text-blue-900 mb-2" data-oid="4i29x6i">
                                    Commission Calculation Example
                                </h4>
                                <div className="text-sm text-blue-800" data-oid=":v19nc:">
                                    <p data-oid="nj.ezcd">• Order Value: EGP 100</p>
                                    <p data-oid="9jra7g2">
                                        • Commission ({formData.commissionRate}%): EGP{' '}
                                        {((100 * formData.commissionRate) / 100).toFixed(2)}
                                    </p>
                                    <p data-oid="1e6myx2">
                                        • Pharmacy Revenue: EGP{' '}
                                        {(100 - (100 * formData.commissionRate) / 100).toFixed(2)}
                                    </p>
                                    <p data-oid="uj41tp6">
                                        • CURA Platform Revenue: EGP{' '}
                                        {((100 * formData.commissionRate) / 100).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Working Hours */}
                    {currentStep === 5 && (
                        <div className="space-y-4" data-oid="66o1kyf">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="1mbqga3"
                            >
                                Working Hours
                            </h3>

                            <div className="space-y-4" data-oid="4e.l83x">
                                {Object.entries(formData.workingHours).map(([day, hours]) => (
                                    <div
                                        key={day}
                                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                                        data-oid="5bl8hg3"
                                    >
                                        <div
                                            className="w-20 font-medium capitalize"
                                            data-oid="fjcik65"
                                        >
                                            {day}
                                        </div>

                                        <div
                                            className="flex items-center space-x-2"
                                            data-oid="l6t0avw"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={hours.is24Hours}
                                                onChange={(e) =>
                                                    handleWorkingHoursChange(
                                                        day,
                                                        'is24Hours',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded"
                                                data-oid="szo30dt"
                                            />

                                            <label className="text-sm" data-oid="tw0x67g">
                                                24 Hours
                                            </label>
                                        </div>

                                        {!hours.is24Hours && (
                                            <>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="-kv.bz0"
                                                >
                                                    <label className="text-sm" data-oid="9x061mp">
                                                        Open:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={hours.open}
                                                        onChange={(e) =>
                                                            handleWorkingHoursChange(
                                                                day,
                                                                'open',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="px-2 py-1 border border-gray-300 rounded"
                                                        data-oid="y746gbc"
                                                    />
                                                </div>

                                                <div
                                                    className="flex items-center space-x-2"
                                                    data-oid="9dnvur4"
                                                >
                                                    <label className="text-sm" data-oid="_y6a20i">
                                                        Close:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={hours.close}
                                                        onChange={(e) =>
                                                            handleWorkingHoursChange(
                                                                day,
                                                                'close',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="px-2 py-1 border border-gray-300 rounded"
                                                        data-oid="rtszv6t"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 6: Services & Features */}
                    {currentStep === 6 && (
                        <div className="space-y-6" data-oid="yhkrrll">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="m3f5j97"
                            >
                                Services & Features
                            </h3>

                            <div data-oid="k3p1zrp">
                                <h4 className="font-medium text-gray-900 mb-3" data-oid="i2cu:ec">
                                    Available Features
                                </h4>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                    data-oid="gw0_5z_"
                                >
                                    {availableFeatures.map((feature) => (
                                        <div
                                            key={feature.id}
                                            className="flex items-center space-x-3"
                                            data-oid="agmhsn3"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.features.includes(feature.id)}
                                                onChange={() => handleFeatureToggle(feature.id)}
                                                className="rounded"
                                                data-oid="sdg08z7"
                                            />

                                            <div data-oid="lf-wh-3">
                                                <div className="font-medium" data-oid=".t0b:u5">
                                                    {feature.label}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid="0432-xn"
                                                >
                                                    {feature.labelAr}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div data-oid="ckk3_hm">
                                <h4 className="font-medium text-gray-900 mb-3" data-oid="ghexqr5">
                                    Specialties
                                </h4>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                    data-oid="_dbfjwa"
                                >
                                    {availableSpecialties.map((specialty) => (
                                        <div
                                            key={specialty.id}
                                            className="flex items-center space-x-3"
                                            data-oid="hp5:y-i"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.specialties.includes(
                                                    specialty.id,
                                                )}
                                                onChange={() => handleSpecialtyToggle(specialty.id)}
                                                className="rounded"
                                                data-oid="m1vk::c"
                                            />

                                            <div data-oid="7kdt8-z">
                                                <div className="font-medium" data-oid="j8dqn48">
                                                    {specialty.label}
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600"
                                                    data-oid=":rzxatn"
                                                >
                                                    {specialty.labelAr}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: Contact Person */}
                    {currentStep === 7 && (
                        <div className="space-y-4" data-oid="cz-6wq:">
                            <h3
                                className="text-lg font-semibold text-gray-900 mb-4"
                                data-oid="4jp9ddw"
                            >
                                Contact Person
                            </h3>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="7vj9nw."
                            >
                                <div data-oid="z_l0ys.">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="44lo_we"
                                    >
                                        Full Name (English) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson.name}
                                        onChange={(e) =>
                                            handleNestedInputChange(
                                                'contactPerson',
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="Dr. Ahmed Hassan"
                                        required
                                        data-oid="rm_-7q3"
                                    />
                                </div>

                                <div data-oid="rkp.dv5">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="q-aouxa"
                                    >
                                        Full Name (Arabic) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson.nameAr}
                                        onChange={(e) =>
                                            handleNestedInputChange(
                                                'contactPerson',
                                                'nameAr',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="د. أحمد حسن"
                                        dir="rtl"
                                        required
                                        data-oid="y.n_cl3"
                                    />
                                </div>
                            </div>

                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="co7g3vt"
                            >
                                <div data-oid="kxail_v">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="0r.ish."
                                    >
                                        Position *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson.position}
                                        onChange={(e) =>
                                            handleNestedInputChange(
                                                'contactPerson',
                                                'position',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="Pharmacy Manager"
                                        required
                                        data-oid="6m0pz7a"
                                    />
                                </div>

                                <div data-oid="3vngpg8">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="ahr19rr"
                                    >
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactPerson.phone}
                                        onChange={(e) =>
                                            handleNestedInputChange(
                                                'contactPerson',
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                        placeholder="+20 XX XXX XXXX"
                                        required
                                        data-oid="_f9_4z3"
                                    />
                                </div>
                            </div>

                            <div data-oid="i5:bjhb">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="o:u3ety"
                                >
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.contactPerson.email}
                                    onChange={(e) =>
                                        handleNestedInputChange(
                                            'contactPerson',
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F1F6F] focus:border-transparent"
                                    placeholder="contact@pharmacy.com"
                                    required
                                    data-oid="z5hx6vz"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="bg-gray-50 px-6 py-4 flex items-center justify-between"
                    data-oid="fhqp_bs"
                >
                    <div className="text-sm text-gray-600" data-oid="678s4qs">
                        Step {currentStep} of {steps.length}
                    </div>

                    <div className="flex space-x-3" data-oid="zkbathx">
                        {currentStep > 1 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                data-oid="_um1q--"
                            >
                                Previous
                            </button>
                        )}

                        {currentStep < steps.length ? (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="px-4 py-2 bg-[#1F1F6F] text-white rounded-lg hover:bg-[#14274E]"
                                data-oid="c.bzthe"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                data-oid="2bkxpr_"
                            >
                                {editingPharmacy ? 'Update Pharmacy' : 'Create Pharmacy'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
