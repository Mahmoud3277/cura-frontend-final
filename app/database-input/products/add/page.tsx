'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct, MasterProduct } from '@/lib/database/masterProductDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { createProduct } from '@/lib/data/products';
import { getAuthToken } from '@/lib/utils/cookies';

interface ProductForm {
    name: string;
    nameAr: string;
    category: string;
    subcategory: string;
    productType: string;
    manufacturer: string;
    brand: string;
    brandAr: string;
    activeIngredient: string;
    activeIngredientAr: string;
    dosage: string;
    dosageAr: string;
    form: string;
    formAr: string;
    descriptionShort: string;
    descriptionDetailed: string;
    descriptionArabicShort: string;
    descriptionArabicDetailed: string;
    usesIndications: string;
    sideEffects: string;
    contraindications: string;
    prescriptionRequired: boolean;
    packSize: string;
    packSizeAr: string;
    unit: string;
    unitAr: string;
    volumeWeight: string;
    volumeWeightAr: string;
    pillsPerBlister: string;
    pillsPerBlisterAr: string;
    blistersPerBox: string;
    blistersPerBoxAr: string;
    imagePrimary: string;
    imageSecondary: string;
    registrationNumber: string;
    barcode: string;
    therapeuticClass: string;
    priceReference: string;
    pricePerBlisters: string;
    pricePerBox: string;
    currency: string;
    ageGroup: string;
    pregnancyCategory: string;
    expiryDate: string;
    storageConditions: string;
    storageConditionsAr: string;
    pharmacyEligible: boolean;
    vendorEligible: boolean;
    tags: string[];
    keywords: string[];
}

export default function AddProductPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<{file: File, preview: string}[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [currentTag, setCurrentTag] = useState('');
    const [currentKeyword, setCurrentKeyword] = useState('');

    const [formData, setFormData] = useState<ProductForm>({
        name: '',
        nameAr: '',
        category: '',
        subcategory: '',
        productType: '',
        manufacturer: '',
        brand: '',
        brandAr: '',
        activeIngredient: '',
        activeIngredientAr: '',
        dosage: '',
        dosageAr: '',
        form: '',
        formAr: '',
        descriptionShort: '',
        descriptionDetailed: '',
        descriptionArabicShort: '',
        descriptionArabicDetailed: '',
        usesIndications: '',
        sideEffects: '',
        contraindications: '',
        prescriptionRequired: false,
        packSize: '',
        packSizeAr: '',
        unit: '',
        unitAr: '',
        volumeWeight: '',
        volumeWeightAr: '',
        pillsPerBlister: '',
        pillsPerBlisterAr: '',
        blistersPerBox: '',
        blistersPerBoxAr: '',
        imagePrimary: '',
        imageSecondary: '',
        registrationNumber: '',
        barcode: Math.random().toString(),
        therapeuticClass: '',
        priceReference: '',
        pricePerBlisters: '',
        pricePerBox: '',
        currency: 'EGP',
        ageGroup: '',
        pregnancyCategory: '',
        expiryDate: '',
        storageConditions: '',
        storageConditionsAr: '',
        pharmacyEligible: false,
        vendorEligible: false,
        tags: [],
        keywords: [],
    });

    const categories = [
        'medicines',
        'skincare',
        'supplements',
        'vitamins',
        'medical_supplies',
        'baby_care',
        'hygiene',
    ];

    const productTypes = [
        'otc',
        'prescription',
        'supplement',
        'baby-product',
        'cosmetic',
        'medical-device',
        'hygiene-supply',
    ];

    const currencies = ['EGP'];

    const handleInputChange = (field: keyof ProductForm, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;
        
        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setUploadedImages((prev) => [...prev, {
                            file: file,
                            preview: e.target!.result as string
                        }]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            handleInputChange('tags', [...formData.tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const removeTag = (tag: string) => {
        handleInputChange(
            'tags',
            formData.tags.filter((t) => t !== tag),
        );
    };

    const addKeyword = () => {
        if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
            handleInputChange('keywords', [...formData.keywords, currentKeyword.trim()]);
            setCurrentKeyword('');
        }
    };

    const removeKeyword = (keyword: string) => {
        handleInputChange(
            'keywords',
            formData.keywords.filter((k) => k !== keyword),
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Extract file objects from uploaded images
            const imageFiles = uploadedImages.map(img => img.file);
            let token;
            if (typeof window !== 'undefined') {
                token = getAuthToken()
            }
            let product;
            if(token){
                product = await createProduct(
                    formData, 
                  token,
                    imageFiles
                );
            }
            
            if (product) {
                toast({
                    title: 'Success!',
                    description: 'Product added successfully.',
                    variant: 'default',
                });
                // Redirect after a short delay to allow the toast to be seen
                setTimeout(() => {
                    // router.push('/database-input/products?refresh=true');
                }, 1500);
            } else {
                throw new Error('Failed to create product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
                title: 'Error',
                description: 'Failed to add product. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.name &&
            formData.nameAr &&
            formData.category &&
            formData.productType &&
            formData.manufacturer &&
            (formData.pharmacyEligible || formData.vendorEligible)
        );
    };

    return (
        <div className="max-w-none">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-none">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">
                                    Product Name (English) *
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="e.g., Paracetamol 500mg, Baby Shampoo, Face Cream"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="nameAr">
                                    Product Name (Arabic) *
                                </Label>
                                <Input
                                    id="nameAr"
                                    value={formData.nameAr}
                                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                                    placeholder="e.g., باراسيتامول ٥٠٠ مجم، شامبو أطفال، كريم وجه"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="category">
                                    Category *
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleInputChange('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category
                                                    .replace('_', ' ')
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    category.replace('_', ' ').slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="subcategory">
                                    Subcategory
                                </Label>
                                <Input
                                    id="subcategory"
                                    value={formData.subcategory}
                                    onChange={(e) =>
                                        handleInputChange('subcategory', e.target.value)
                                    }
                                    placeholder="e.g., pain-relief"
                                />
                            </div>
                            <div>
                                <Label htmlFor="type">
                                    Type *
                                </Label>
                                <Select
                                    value={formData.productType}
                                    onValueChange={(value) => handleInputChange('productType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace('-', ' ').charAt(0).toUpperCase() +
                                                    type.replace('-', ' ').slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="manufacturer">
                                    Manufacturer/Brand Owner *
                                </Label>
                                <Input
                                    id="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={(e) =>
                                        handleInputChange('manufacturer', e.target.value)
                                    }
                                    placeholder="e.g., PharmaCorp, Johnson & Johnson, L'Oréal"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="brand">
                                    Brand Name
                                </Label>
                                <Input
                                    id="brand"
                                    value={formData.brand}
                                    onChange={(e) => handleInputChange('brand', e.target.value)}
                                    placeholder="e.g., Panadol, Johnson's Baby, Nivea"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="brandAr">
                                    Brand Name (Arabic)
                                </Label>
                                <Input
                                    id="brandAr"
                                    value={formData.brandAr}
                                    onChange={(e) => handleInputChange('brandAr', e.target.value)}
                                    placeholder="e.g., بانادول، جونسون بيبي، نيفيا"
                                />
                            </div>
                            <div>
                                <Label htmlFor="therapeuticClass">
                                    Product Category/Class
                                </Label>
                                <Input
                                    id="therapeuticClass"
                                    value={formData.therapeuticClass}
                                    onChange={(e) =>
                                        handleInputChange('therapeuticClass', e.target.value)
                                    }
                                    placeholder="e.g., Analgesics, Baby Care, Skincare, Vitamins"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="descriptionShort">
                                    Description Short (English)
                                </Label>
                                <Textarea
                                    id="descriptionShort"
                                    value={formData.descriptionShort}
                                    onChange={(e) =>
                                        handleInputChange('descriptionShort', e.target.value)
                                    }
                                    placeholder="Short product description in English"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label htmlFor="descriptionArabicShort">
                                    Description Short (Arabic)
                                </Label>
                                <Textarea
                                    id="descriptionArabicShort"
                                    value={formData.descriptionArabicShort}
                                    onChange={(e) =>
                                        handleInputChange('descriptionArabicShort', e.target.value)
                                    }
                                    placeholder="Short product description in Arabic"
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="descriptionDetailed">
                                    Description Detailed (English)
                                </Label>
                                <Textarea
                                    id="descriptionDetailed"
                                    value={formData.descriptionDetailed}
                                    onChange={(e) =>
                                        handleInputChange('descriptionDetailed', e.target.value)
                                    }
                                    placeholder="Detailed product description in English"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="descriptionArabicDetailed">
                                    Description Detailed (Arabic)
                                </Label>
                                <Textarea
                                    id="descriptionArabicDetailed"
                                    value={formData.descriptionArabicDetailed}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'descriptionArabicDetailed',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Detailed product description in Arabic"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Specifications */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="activeIngredient">
                                    Key Ingredient/Component (English)
                                </Label>
                                <Input
                                    id="activeIngredient"
                                    value={formData.activeIngredient}
                                    onChange={(e) =>
                                        handleInputChange('activeIngredient', e.target.value)
                                    }
                                    placeholder="e.g., Paracetamol, Vitamin C, Aloe Vera, Zinc Oxide"
                                />
                            </div>
                            <div>
                                <Label htmlFor="activeIngredientAr">
                                    Key Ingredient/Component (Arabic)
                                </Label>
                                <Input
                                    id="activeIngredientAr"
                                    value={formData.activeIngredientAr}
                                    onChange={(e) =>
                                        handleInputChange('activeIngredientAr', e.target.value)
                                    }
                                    placeholder="e.g., باراسيتامول، فيتامين سي، الصبار، أكسيد الزنك"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dosage">
                                    Strength/Concentration (English)
                                </Label>
                                <Input
                                    id="dosage"
                                    value={formData.dosage}
                                    onChange={(e) => handleInputChange('dosage', e.target.value)}
                                    placeholder="e.g., 500mg, 50ml, 2%, SPF 30"
                                />
                            </div>
                            <div>
                                <Label htmlFor="dosageAr">
                                    Strength/Concentration (Arabic)
                                </Label>
                                <Input
                                    id="dosageAr"
                                    value={formData.dosageAr}
                                    onChange={(e) => handleInputChange('dosageAr', e.target.value)}
                                    placeholder="e.g., ٥٠٠ مجم، ٥٠ مل، ٢٪، عامل حماية ٣٠"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="form">
                                    Product Form (English)
                                </Label>
                                <Input
                                    id="form"
                                    value={formData.form}
                                    onChange={(e) => handleInputChange('form', e.target.value)}
                                    placeholder="e.g., Tablet, Cream, Liquid, Powder, Capsule"
                                />
                            </div>
                            <div>
                                <Label htmlFor="formAr">
                                    Product Form (Arabic)
                                </Label>
                                <Input
                                    id="formAr"
                                    value={formData.formAr}
                                    onChange={(e) => handleInputChange('formAr', e.target.value)}
                                    placeholder="e.g., قرص، كريم، سائل، بودرة، كبسولة"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="usesIndications">
                                    Uses & Benefits
                                </Label>
                                <Textarea
                                    id="usesIndications"
                                    value={formData.usesIndications}
                                    onChange={(e) =>
                                        handleInputChange('usesIndications', e.target.value)
                                    }
                                    placeholder="e.g., Pain relief, Moisturizes skin, Supports immune system, Gentle cleansing"
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="sideEffects">
                                    Warnings/Side Effects
                                </Label>
                                <Textarea
                                    id="sideEffects"
                                    value={formData.sideEffects}
                                    onChange={(e) =>
                                        handleInputChange('sideEffects', e.target.value)
                                    }
                                    placeholder="e.g., May cause drowsiness, Avoid contact with eyes, For external use only"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label htmlFor="contraindications">
                                    Precautions/Contraindications
                                </Label>
                                <Textarea
                                    id="contraindications"
                                    value={formData.contraindications}
                                    onChange={(e) =>
                                        handleInputChange('contraindications', e.target.value)
                                    }
                                    placeholder="e.g., Not suitable for children under 2, Avoid if allergic to ingredients"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing & Regulatory Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing & Regulatory Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="priceReference">
                                    Price Reference
                                </Label>
                                <Input
                                    id="priceReference"
                                    type="number"
                                    step="0.01"
                                    value={formData.priceReference}
                                    onChange={(e) =>
                                        handleInputChange('priceReference', e.target.value)
                                    }
                                    placeholder="e.g., 5.50"
                                />
                            </div>
                            <div>
                                <Label htmlFor="currency">
                                    Currency
                                </Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) => handleInputChange('currency', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency} value={currency}>
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="pricePerBlisters">
                                    Price Per Blister
                                </Label>
                                <Input
                                    id="pricePerBlisters"
                                    type="number"
                                    step="0.01"
                                    value={formData.pricePerBlisters}
                                    onChange={(e) =>
                                        handleInputChange('pricePerBlisters', e.target.value)
                                    }
                                    placeholder="e.g., 2.50"
                                />
                            </div>
                            <div>
                                <Label htmlFor="pricePerBox">
                                    Price Per Box
                                </Label>
                                <Input
                                    id="pricePerBox"
                                    type="number"
                                    step="0.01"
                                    value={formData.pricePerBox}
                                    onChange={(e) =>
                                        handleInputChange('pricePerBox', e.target.value)
                                    }
                                    placeholder="e.g., 15.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                                    Product Access Control *
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <Checkbox
                                            id="pharmacyEligible"
                                            checked={formData.pharmacyEligible}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('pharmacyEligible', checked)
                                            }
                                        />
                                        <div className="flex-1">
                                            <Label
                                                htmlFor="pharmacyEligible"
                                                className="font-medium text-gray-900"
                                            >
                                                Pharmacy Access
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                Allow pharmacies to sell this product
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                        <Checkbox
                                            id="vendorEligible"
                                            checked={formData.vendorEligible}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('vendorEligible', checked)
                                            }
                                        />
                                        <div className="flex-1">
                                            <Label
                                                htmlFor="vendorEligible"
                                                className="font-medium text-gray-900"
                                            >
                                                Vendor Access
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                Allow vendors to sell this product
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {!formData.pharmacyEligible && !formData.vendorEligible && (
                                    <p className="text-sm text-red-600 mt-2">
                                        Please select at least one access type (Pharmacy or Vendor)
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="prescriptionRequired"
                                    checked={formData.prescriptionRequired}
                                    onCheckedChange={(checked) =>
                                        handleInputChange('prescriptionRequired', checked)
                                    }
                                />
                                <Label htmlFor="prescriptionRequired">
                                    Prescription Required
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Package Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Package Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="packSize">
                                    Pack Size (English)
                                </Label>
                                <Input
                                    id="packSize"
                                    value={formData.packSize}
                                    onChange={(e) => handleInputChange('packSize', e.target.value)}
                                    placeholder="e.g., 20 tablets, 100ml bottle, 50g tube"
                                />
                            </div>
                            <div>
                                <Label htmlFor="packSizeAr">
                                    Pack Size (Arabic)
                                </Label>
                                <Input
                                    id="packSizeAr"
                                    value={formData.packSizeAr}
                                    onChange={(e) =>
                                        handleInputChange('packSizeAr', e.target.value)
                                    }
                                    placeholder="e.g., ٢٠ قرص، زجاجة ١٠٠ مل، أنبوب ٥٠ جرام"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="unit">
                                    Unit (English)
                                </Label>
                                <Input
                                    id="unit"
                                    value={formData.unit}
                                    onChange={(e) => handleInputChange('unit', e.target.value)}
                                    placeholder="e.g., tablets"
                                />
                            </div>
                            <div>
                                <Label htmlFor="unitAr">
                                    Unit (Arabic)
                                </Label>
                                <Input
                                    id="unitAr"
                                    value={formData.unitAr}
                                    onChange={(e) => handleInputChange('unitAr', e.target.value)}
                                    placeholder="e.g., أقراص"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="volumeWeight">
                                    Volume/Weight (English)
                                </Label>
                                <Input
                                    id="volumeWeight"
                                    value={formData.volumeWeight}
                                    onChange={(e) =>
                                        handleInputChange('volumeWeight', e.target.value)
                                    }
                                    placeholder="e.g., 250ml or 50g"
                                />
                            </div>
                            <div>
                                <Label htmlFor="volumeWeightAr">
                                    Volume/Weight (Arabic)
                                </Label>
                                <Input
                                    id="volumeWeightAr"
                                    value={formData.volumeWeightAr}
                                    onChange={(e) =>
                                        handleInputChange('volumeWeightAr', e.target.value)
                                    }
                                    placeholder="e.g., ٢٥٠ مل or ٥٠ جرام"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="pillsPerBlister">
                                    Pills Per Blister (English)
                                </Label>
                                <Input
                                    id="pillsPerBlister"
                                    value={formData.pillsPerBlister}
                                    onChange={(e) =>
                                        handleInputChange('pillsPerBlister', e.target.value)
                                    }
                                    placeholder="e.g., 10 (or N/A for non-pills)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="pillsPerBlisterAr">
                                    Pills Per Blister (Arabic)
                                </Label>
                                <Input
                                    id="pillsPerBlisterAr"
                                    value={formData.pillsPerBlisterAr}
                                    onChange={(e) =>
                                        handleInputChange('pillsPerBlisterAr', e.target.value)
                                    }
                                    placeholder="e.g., ١٠ (or غير متاح)"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="blistersPerBox">
                                    Blisters Per Box (English)
                                </Label>
                                <Input
                                    id="blistersPerBox"
                                    value={formData.blistersPerBox}
                                    onChange={(e) =>
                                        handleInputChange('blistersPerBox', e.target.value)
                                    }
                                    placeholder="e.g., 2 (or N/A for non-pills)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="blistersPerBoxAr">
                                    Blisters Per Box (Arabic)
                                </Label>
                                <Input
                                    id="blistersPerBoxAr"
                                    value={formData.blistersPerBoxAr}
                                    onChange={(e) =>
                                        handleInputChange('blistersPerBoxAr', e.target.value)
                                    }
                                    placeholder="e.g., ٢ (or غير متاح)"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="imagePrimary">
                                    Primary Image URL
                                </Label>
                                <Input
                                    id="imagePrimary"
                                    value={formData.imagePrimary}
                                    onChange={(e) =>
                                        handleInputChange('imagePrimary', e.target.value)
                                    }
                                    placeholder="https://example.com/image-primary.jpg"
                                />
                            </div>
                            <div>
                                <Label htmlFor="imageSecondary">
                                    Secondary Image URL
                                </Label>
                                <Input
                                    id="imageSecondary"
                                    value={formData.imageSecondary}
                                    onChange={(e) =>
                                        handleInputChange('imageSecondary', e.target.value)
                                    }
                                    placeholder="https://example.com/image-secondary.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragActive ? 'border-[#1F1F6F] bg-blue-50' : 'border-gray-300'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="text-4xl mb-4">
                                📷
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                Upload Product Images
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Drag and drop images here, or click to select files
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files)}
                                className="hidden"
                                id="image-upload"
                            />
                            <Button
                                type="button"
                                asChild
                                className="bg-cura-gradient text-white hover:opacity-90 transition-opacity"
                            >
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer"
                                >
                                    Choose Images
                                </label>
                            </Button>
                        </div>
                        {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uploadedImages.map((imageObj, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={imageObj.preview}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tags & Keywords */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tags & Keywords</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="tags">
                                Tags
                            </Label>
                            <div className="flex space-x-2 mb-2">
                                <Input
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    placeholder="Add a tag"
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && (e.preventDefault(), addTag())
                                    }
                                />
                                <Button
                                    type="button"
                                    onClick={addTag}
                                    className="bg-cura-gradient text-white hover:opacity-90 transition-opacity"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-blue-100 text-blue-800"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="keywords">
                                Keywords
                            </Label>
                            <div className="flex space-x-2 mb-2">
                                <Input
                                    value={currentKeyword}
                                    onChange={(e) => setCurrentKeyword(e.target.value)}
                                    placeholder="Add a keyword"
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && (e.preventDefault(), addKeyword())
                                    }
                                />
                                <Button
                                    type="button"
                                    onClick={addKeyword}
                                    className="bg-cura-gradient text-white hover:opacity-90 transition-opacity"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.keywords.map((keyword, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-green-100 text-green-800"
                                    >
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => removeKeyword(keyword)}
                                            className="ml-2 text-green-600 hover:text-green-800"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/database-input/products')}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                    >
                        Cancel
                    </Button>
                    <div className="space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={!isFormValid()}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50"
                        >
                            Save as Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isFormValid() || isSubmitting}
                            className="bg-cura-gradient text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
                        >
                            {isSubmitting ? 'Adding Product...' : 'Add Product'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}