'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    masterProductDatabase,
    MasterProduct,
} from '@/lib/database/masterProductDatabase';
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
import { getProductById, updateProduct } from '@/lib/data/products';
import { getAuthToken } from '@/lib/utils/cookies';
interface ExtendedProductForm {
    name: string;
    nameAr: string;
    category: string;
    subcategory: string;
    type: string;
    manufacturer: string;
    brand: string;
    brandAr: string;
    activeIngredient: string;
    activeIngredientAr: string;
    dosage: string;
    dosageAr: string;
    form: string;
    formAr: string;
    description: string;
    descriptionAr: string;
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
    image: string;
    imagePrimary: string;
    imageSecondary: string;
    registrationNumber: string;
    barcode: string;
    therapeuticClass: string;
    priceReference: string;
    currency: string;
    genericAvailable: boolean;
    ageGroup: string;
    pregnancyCategory: string;
    expiryDate: string;
    storageConditions: string;
    storageConditionsAr: string;
    tags: string[];
    keywords: string[];
    pharmacyEligible: boolean;
    vendorEligible: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;
    const { toast } = useToast();
    const [product, setProduct] = useState<ExtendedProductForm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [currentTag, setCurrentTag] = useState('');
    const [currentKeyword, setCurrentKeyword] = useState('');

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

    const currencies = ['USD', 'EUR', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'EGP'];

    useEffect(() => {
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const loadProduct = async() => {
        const foundProduct = await getProductById(productId);
        if (foundProduct) {
            // Convert the MasterProduct to ExtendedProductForm with default values for missing fields
            const extendedProduct: ExtendedProductForm = {
                name: foundProduct.name || '',
                nameAr: foundProduct.nameAr || '',
                category: foundProduct.category || '',
                subcategory: '',
                type: foundProduct.type || '',
                manufacturer: foundProduct.manufacturer || '',
                brand: '',
                brandAr: '',
                activeIngredient: foundProduct.activeIngredient || '',
                activeIngredientAr: '',
                dosage: foundProduct.dosage || '',
                dosageAr: '',
                form: foundProduct.form || '',
                formAr: '',
                description: foundProduct.description || '',
                descriptionAr: foundProduct.descriptionAr || '',
                descriptionShort: '',
                descriptionDetailed: '',
                descriptionArabicShort: '',
                descriptionArabicDetailed: '',
                usesIndications: '',
                sideEffects: '',
                contraindications: '',
                prescriptionRequired: foundProduct.prescriptionRequired || false,
                packSize: foundProduct.packSize || '',
                packSizeAr: foundProduct.packSizeAr || '',
                unit: foundProduct.unit || '',
                unitAr: foundProduct.unitAr || '',
                volumeWeight: '',
                volumeWeightAr: '',
                pillsPerBlister: '',
                pillsPerBlisterAr: '',
                blistersPerBox: '',
                blistersPerBoxAr: '',
                image: foundProduct.image || '',
                imagePrimary: foundProduct.images?.[0] || '',
                imageSecondary: foundProduct.images?.[1] || '',
                registrationNumber: foundProduct.registrationNumber || '',
                barcode: foundProduct.barcode || '',
                therapeuticClass: '',
                priceReference: '',
                currency: 'USD',
                genericAvailable: false,
                ageGroup: '',
                pregnancyCategory: '',
                expiryDate: '',
                storageConditions: '',
                storageConditionsAr: '',
                tags: foundProduct.tags || [],
                keywords: foundProduct.keywords || [],
                pharmacyEligible: foundProduct.pharmacyEligible || false,
                vendorEligible: foundProduct.vendorEligible || false,
            };
            setProduct(extendedProduct);
        }
        setIsLoading(false);
    };

    const handleInputChange = (field: keyof ExtendedProductForm, value: any) => {
        if (product) {
            setProduct({
                ...product,
                [field]: value,
            });
        }
    };

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setUploadedImages((prev) => [...prev, e.target!.result as string]);
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
        if (currentTag.trim() && product && !product.tags.includes(currentTag.trim())) {
            handleInputChange('tags', [...product.tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const removeTag = (tag: string) => {
        if (product) {
            handleInputChange(
                'tags',
                product.tags.filter((t) => t !== tag),
            );
        }
    };

    const addKeyword = () => {
        if (currentKeyword.trim() && product && !product.keywords.includes(currentKeyword.trim())) {
            handleInputChange('keywords', [...product.keywords, currentKeyword.trim()]);
            setCurrentKeyword('');
        }
    };

    const removeKeyword = (keyword: string) => {
        if (product) {
            handleInputChange(
                'keywords',
                product.keywords.filter((k) => k !== keyword),
            );
        }
    };

    const handleSave = async () => {
        if (!product) return;
        setIsSaving(true);
        try {
            const savedProduct = await updateProduct(productId, product, getAuthToken())
            console.log(savedProduct)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save product. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.push('/database-input/products');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64" data-oid=".h115uh">
                <div className="text-center" data-oid="xui1eh:">
                    <div
                        className="w-8 h-8 border-4 border-[#1F1F6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        data-oid="g12vx_t"
                    ></div>
                    <p className="text-gray-600" data-oid=":wsft62">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12" data-oid="50-prc8">
                <div
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    data-oid="7s9zoq7"
                >
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="lab7:_u"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            data-oid="x:w:71e"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="wh1twae">
                    Product Not Found
                </h3>
                <p className="text-gray-600 mb-4" data-oid="_8vabkd">
                    The product you{"'"}re looking for doesn{"'"}t exist.
                </p>
                <Button onClick={handleCancel} data-oid="qmx1_o3">
                    Back to Products
                </Button>
            </div>
        );
    }

    return (
        <>
            <form className="space-y-6" data-oid="wzoujd6">
                {/* Header */}
                <div className="flex items-center justify-between" data-oid="bkzen1_">
                    <div data-oid="rf2:8_h">
                        <h1 className="text-2xl font-bold text-gray-900" data-oid="bf8qwsm">
                            Edit Product
                        </h1>
                        <p className="text-gray-600" data-oid="jes7w8-">
                            Update product information and details
                        </p>
                    </div>
                    <div className="flex items-center space-x-3" data-oid="f1_ckdj">
                        <Button variant="outline" onClick={handleCancel} data-oid="6wj-jlq">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#1F1F6F] hover:bg-[#14274E] text-white"
                            data-oid="dl4.8ro"
                        >
                            {isSaving ? (
                                <>
                                    <div
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                        data-oid="jadhnce"
                                    ></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Basic Information */}
                <Card data-oid="isj61ug">
                    <CardHeader data-oid=":2wt2b9">
                        <CardTitle data-oid="ydr3yir">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="k-crgx2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid=":mxjk0v">
                            <div data-oid="qr8747d">
                                <Label htmlFor="name" data-oid="urr-j-b">
                                    Product Name (English) *
                                </Label>
                                <Input
                                    id="name"
                                    value={product.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="e.g., Paracetamol 500mg"
                                    required
                                    data-oid="r:8ybw:"
                                />
                            </div>
                            <div data-oid="g4-feg8">
                                <Label htmlFor="nameAr" data-oid="bj5fm-8">
                                    Product Name (Arabic) *
                                </Label>
                                <Input
                                    id="nameAr"
                                    value={product.nameAr}
                                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                                    placeholder="e.g., باراسيتامول ٥٠٠ مجم"
                                    required
                                    data-oid="9tvyg0y"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="m7.imry">
                            <div data-oid="c:0x49l">
                                <Label htmlFor="category" data-oid="zo3f613">
                                    Category *
                                </Label>
                                <Select
                                    value={product.category}
                                    onValueChange={(value) => handleInputChange('category', value)}
                                    data-oid="tx2vijo"
                                >
                                    <SelectTrigger data-oid="pgpw7xl">
                                        <SelectValue
                                            placeholder="Select category"
                                            data-oid="ub0lwxf"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="efttxia">
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                                data-oid="sf2a10y"
                                            >
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
                            <div data-oid=":zfvkev">
                                <Label htmlFor="subcategory" data-oid="neunhpw">
                                    Subcategory
                                </Label>
                                <Input
                                    id="subcategory"
                                    value={product.subcategory}
                                    onChange={(e) =>
                                        handleInputChange('subcategory', e.target.value)
                                    }
                                    placeholder="e.g., pain-relief"
                                    data-oid="kz_md69"
                                />
                            </div>
                            <div data-oid="u10tpw0">
                                <Label htmlFor="type" data-oid="obyggu9">
                                    Type *
                                </Label>
                                <Select
                                    value={product.type}
                                    onValueChange={(value) => handleInputChange('type', value)}
                                    data-oid="xcf.lbp"
                                >
                                    <SelectTrigger data-oid="gs0cpk5">
                                        <SelectValue placeholder="Select type" data-oid="5:8y6xm" />
                                    </SelectTrigger>
                                    <SelectContent data-oid="29n.4:7">
                                        {productTypes.map((type) => (
                                            <SelectItem key={type} value={type} data-oid="s7u_lwk">
                                                {type.replace('-', ' ').charAt(0).toUpperCase() +
                                                    type.replace('-', ' ').slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="7_3vu0-">
                            <div data-oid="tgiz4_i">
                                <Label htmlFor="manufacturer" data-oid="n25aq51">
                                    Manufacturer *
                                </Label>
                                <Input
                                    id="manufacturer"
                                    value={product.manufacturer}
                                    onChange={(e) =>
                                        handleInputChange('manufacturer', e.target.value)
                                    }
                                    placeholder="e.g., PharmaCorp"
                                    required
                                    data-oid="-3s5y58"
                                />
                            </div>
                            <div data-oid="wav6l50">
                                <Label htmlFor="brand" data-oid="j5mc9xz">
                                    Brand
                                </Label>
                                <Input
                                    id="brand"
                                    value={product.brand}
                                    onChange={(e) => handleInputChange('brand', e.target.value)}
                                    placeholder="e.g., Panadol"
                                    data-oid="dyj6i-7"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="7ccp3u9">
                            <div data-oid="iz4z-_o">
                                <Label htmlFor="brandAr" data-oid="a23rkcg">
                                    Brand (Arabic)
                                </Label>
                                <Input
                                    id="brandAr"
                                    value={product.brandAr}
                                    onChange={(e) => handleInputChange('brandAr', e.target.value)}
                                    placeholder="e.g., بانادول"
                                    data-oid="sl59ske"
                                />
                            </div>
                            <div data-oid="zef65xz">
                                <Label htmlFor="therapeuticClass" data-oid="jmagzuh">
                                    Therapeutic Class
                                </Label>
                                <Input
                                    id="therapeuticClass"
                                    value={product.therapeuticClass}
                                    onChange={(e) =>
                                        handleInputChange('therapeuticClass', e.target.value)
                                    }
                                    placeholder="e.g., Analgesics"
                                    data-oid="sk0acn:"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="_vyxpd6">
                            <div data-oid="09036_k">
                                <Label htmlFor="descriptionShort" data-oid=":c2o:6w">
                                    Description Short (English)
                                </Label>
                                <Textarea
                                    id="descriptionShort"
                                    value={product.descriptionShort}
                                    onChange={(e) =>
                                        handleInputChange('descriptionShort', e.target.value)
                                    }
                                    placeholder="Short product description in English"
                                    rows={2}
                                    data-oid="77u1hgl"
                                />
                            </div>
                            <div data-oid="x9.fger">
                                <Label htmlFor="descriptionArabicShort" data-oid="5mcw42d">
                                    Description Short (Arabic)
                                </Label>
                                <Textarea
                                    id="descriptionArabicShort"
                                    value={product.descriptionArabicShort}
                                    onChange={(e) =>
                                        handleInputChange('descriptionArabicShort', e.target.value)
                                    }
                                    placeholder="Short product description in Arabic"
                                    rows={2}
                                    data-oid=".opzrjq"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="7k7nzuj">
                            <div data-oid="5xwlcti">
                                <Label htmlFor="descriptionDetailed" data-oid="e:gcq_p">
                                    Description Detailed (English)
                                </Label>
                                <Textarea
                                    id="descriptionDetailed"
                                    value={product.descriptionDetailed}
                                    onChange={(e) =>
                                        handleInputChange('descriptionDetailed', e.target.value)
                                    }
                                    placeholder="Detailed product description in English"
                                    rows={3}
                                    data-oid="s64glwx"
                                />
                            </div>
                            <div data-oid="lp85c15">
                                <Label htmlFor="descriptionArabicDetailed" data-oid="hidf.84">
                                    Description Detailed (Arabic)
                                </Label>
                                <Textarea
                                    id="descriptionArabicDetailed"
                                    value={product.descriptionArabicDetailed}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'descriptionArabicDetailed',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Detailed product description in Arabic"
                                    rows={3}
                                    data-oid="4_xt6vs"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Medical Information */}
                <Card data-oid="p0g65j1">
                    <CardHeader data-oid="i.2g5k7">
                        <CardTitle data-oid="z73nn7j">Medical Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="819fx72">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="hr4njy1">
                            <div data-oid="ern7afp">
                                <Label htmlFor="activeIngredient" data-oid="-n8ycob">
                                    Active Ingredient (English)
                                </Label>
                                <Input
                                    id="activeIngredient"
                                    value={product.activeIngredient}
                                    onChange={(e) =>
                                        handleInputChange('activeIngredient', e.target.value)
                                    }
                                    placeholder="e.g., Paracetamol"
                                    data-oid="znuf._p"
                                />
                            </div>
                            <div data-oid="k6lfk03">
                                <Label htmlFor="activeIngredientAr" data-oid="pf2mmmk">
                                    Active Ingredient (Arabic)
                                </Label>
                                <Input
                                    id="activeIngredientAr"
                                    value={product.activeIngredientAr}
                                    onChange={(e) =>
                                        handleInputChange('activeIngredientAr', e.target.value)
                                    }
                                    placeholder="e.g., باراسيتامول"
                                    data-oid="g.4z99n"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="n-kn.g7">
                            <div data-oid="xnkznv_">
                                <Label htmlFor="dosage" data-oid="yy7:3vc">
                                    Dosage (English)
                                </Label>
                                <Input
                                    id="dosage"
                                    value={product.dosage}
                                    onChange={(e) => handleInputChange('dosage', e.target.value)}
                                    placeholder="e.g., 500mg"
                                    data-oid="to59dqu"
                                />
                            </div>
                            <div data-oid="y1f9ah_">
                                <Label htmlFor="dosageAr" data-oid="s3ptqg:">
                                    Dosage (Arabic)
                                </Label>
                                <Input
                                    id="dosageAr"
                                    value={product.dosageAr}
                                    onChange={(e) => handleInputChange('dosageAr', e.target.value)}
                                    placeholder="e.g., ٥٠٠ مجم"
                                    data-oid="3jc4.3l"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="ws9vmn8">
                            <div data-oid="ncd44x6">
                                <Label htmlFor="form" data-oid="26ho6b_">
                                    Form (English)
                                </Label>
                                <Input
                                    id="form"
                                    value={product.form}
                                    onChange={(e) => handleInputChange('form', e.target.value)}
                                    placeholder="e.g., Tablet"
                                    data-oid="atm3ysy"
                                />
                            </div>
                            <div data-oid="1px4-6x">
                                <Label htmlFor="formAr" data-oid="g2cwhyx">
                                    Form (Arabic)
                                </Label>
                                <Input
                                    id="formAr"
                                    value={product.formAr}
                                    onChange={(e) => handleInputChange('formAr', e.target.value)}
                                    placeholder="e.g., قرص"
                                    data-oid=":uyp9pk"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4" data-oid="eypv2y_">
                            <div data-oid="1xf7v7o">
                                <Label htmlFor="usesIndications" data-oid="h.t_wlq">
                                    Uses & Indications
                                </Label>
                                <Textarea
                                    id="usesIndications"
                                    value={product.usesIndications}
                                    onChange={(e) =>
                                        handleInputChange('usesIndications', e.target.value)
                                    }
                                    placeholder="e.g., Pain relief and fever reduction"
                                    rows={2}
                                    data-oid="4bcifjf"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="d3gxe5d">
                            <div data-oid="h0-:xte">
                                <Label htmlFor="sideEffects" data-oid="wb7mr7m">
                                    Side Effects
                                </Label>
                                <Textarea
                                    id="sideEffects"
                                    value={product.sideEffects}
                                    onChange={(e) =>
                                        handleInputChange('sideEffects', e.target.value)
                                    }
                                    placeholder="e.g., Nausea in rare cases"
                                    rows={2}
                                    data-oid="7f9nc1e"
                                />
                            </div>
                            <div data-oid="0f.z6m7">
                                <Label htmlFor="contraindications" data-oid="js_-24w">
                                    Contraindications
                                </Label>
                                <Textarea
                                    id="contraindications"
                                    value={product.contraindications}
                                    onChange={(e) =>
                                        handleInputChange('contraindications', e.target.value)
                                    }
                                    placeholder="e.g., Liver disease"
                                    rows={2}
                                    data-oid="9krpylj"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing & Regulatory Information */}
                <Card data-oid="r42xq48">
                    <CardHeader data-oid="56zzeu7">
                        <CardTitle data-oid="mmyk4cl">Pricing & Regulatory Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="94h06bh">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-oid="aayv04j">
                            <div data-oid="ut88ky2">
                                <Label htmlFor="priceReference" data-oid="5jaggst">
                                    Price Reference
                                </Label>
                                <Input
                                    id="priceReference"
                                    type="number"
                                    step="0.01"
                                    value={product.priceReference}
                                    onChange={(e) =>
                                        handleInputChange('priceReference', e.target.value)
                                    }
                                    placeholder="e.g., 5.50"
                                    data-oid="9fg.19c"
                                />
                            </div>
                            <div data-oid=".52nnmb">
                                <Label htmlFor="currency" data-oid="ncr4um6">
                                    Currency
                                </Label>
                                <Select
                                    value={product.currency}
                                    onValueChange={(value) => handleInputChange('currency', value)}
                                    data-oid="ul_iu2_"
                                >
                                    <SelectTrigger data-oid="3diek:w">
                                        <SelectValue
                                            placeholder="Select currency"
                                            data-oid="8pe3qpw"
                                        />
                                    </SelectTrigger>
                                    <SelectContent data-oid="0g-0y1p">
                                        {currencies.map((currency) => (
                                            <SelectItem
                                                key={currency}
                                                value={currency}
                                                data-oid="wjap.g3"
                                            >
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div data-oid="9hla8:b">
                                <Label htmlFor="ageGroup" data-oid="8:2mkz6">
                                    Age Group
                                </Label>
                                <Input
                                    id="ageGroup"
                                    value={product.ageGroup}
                                    onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                                    placeholder="e.g., Adults and Children 6+"
                                    data-oid="2em6wtt"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="hu7.ldh">
                            <div data-oid="m6lta3r">
                                <Label htmlFor="pregnancyCategory" data-oid="_7:_ti6">
                                    Pregnancy Category
                                </Label>
                                <Input
                                    id="pregnancyCategory"
                                    value={product.pregnancyCategory}
                                    onChange={(e) =>
                                        handleInputChange('pregnancyCategory', e.target.value)
                                    }
                                    placeholder="e.g., Category A or N/A"
                                    data-oid="9djjq6j"
                                />
                            </div>
                            <div data-oid="308_2t2">
                                <Label htmlFor="expiryDate" data-oid="a3w97q1">
                                    Expiry Date
                                </Label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    value={product.expiryDate}
                                    onChange={(e) =>
                                        handleInputChange('expiryDate', e.target.value)
                                    }
                                    data-oid="xxio59t"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="c.vhers">
                            <div data-oid="s5b75xm">
                                <Label htmlFor="storageConditions" data-oid="uy3l2o3">
                                    Storage Conditions (English)
                                </Label>
                                <Input
                                    id="storageConditions"
                                    value={product.storageConditions}
                                    onChange={(e) =>
                                        handleInputChange('storageConditions', e.target.value)
                                    }
                                    placeholder="e.g., Store below 25°C"
                                    data-oid="p:sw50o"
                                />
                            </div>
                            <div data-oid="orv._6b">
                                <Label htmlFor="storageConditionsAr" data-oid="l9xrd-0">
                                    Storage Conditions (Arabic)
                                </Label>
                                <Input
                                    id="storageConditionsAr"
                                    value={product.storageConditionsAr}
                                    onChange={(e) =>
                                        handleInputChange('storageConditionsAr', e.target.value)
                                    }
                                    placeholder="e.g., يحفظ تحت 25 درجة مئوية"
                                    data-oid="shg9ky0"
                                />
                            </div>
                        </div>
                        <div className="space-y-3" data-oid="qnkw7xh">
                            <div className="flex items-center space-x-2" data-oid="t_u.nkm">
                                <Checkbox
                                    id="prescriptionRequired"
                                    checked={product.prescriptionRequired}
                                    onCheckedChange={(checked) =>
                                        handleInputChange('prescriptionRequired', checked)
                                    }
                                    data-oid=".h08ktw"
                                />

                                <Label htmlFor="prescriptionRequired" data-oid="ad_gppr">
                                    Prescription Required
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="2hrl8k.">
                                <Checkbox
                                    id="genericAvailable"
                                    checked={product.genericAvailable}
                                    onCheckedChange={(checked) =>
                                        handleInputChange('genericAvailable', checked)
                                    }
                                    data-oid="bf4.l3_"
                                />

                                <Label htmlFor="genericAvailable" data-oid="98zjsd7">
                                    Generic Available
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="lrii45v">
                                <Checkbox
                                    id="pharmacyEligible"
                                    checked={product.pharmacyEligible}
                                    onCheckedChange={(checked) =>
                                        handleInputChange('pharmacyEligible', checked)
                                    }
                                    data-oid="iusfmbg"
                                />

                                <Label htmlFor="pharmacyEligible" data-oid="g7:61lg">
                                    Pharmacy Eligible
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2" data-oid="o3egov-">
                                <Checkbox
                                    id="vendorEligible"
                                    checked={product.vendorEligible}
                                    onCheckedChange={(checked) =>
                                        handleInputChange('vendorEligible', checked)
                                    }
                                    data-oid="7-2f4gi"
                                />

                                <Label htmlFor="vendorEligible" data-oid="v_tfjub">
                                    Vendor Eligible
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Package Information */}
                <Card data-oid="r2mdko:">
                    <CardHeader data-oid="pm28q95">
                        <CardTitle data-oid="g9l0st.">Package Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="cki0jwt">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="ynyfw13">
                            <div data-oid="q2nd5hp">
                                <Label htmlFor="packSize" data-oid="mr9wntu">
                                    Pack Size (English)
                                </Label>
                                <Input
                                    id="packSize"
                                    value={product.packSize}
                                    onChange={(e) => handleInputChange('packSize', e.target.value)}
                                    placeholder="e.g., 20 tablets"
                                    data-oid="78ji85d"
                                />
                            </div>
                            <div data-oid="xqhttx2">
                                <Label htmlFor="packSizeAr" data-oid="6at90ck">
                                    Pack Size (Arabic)
                                </Label>
                                <Input
                                    id="packSizeAr"
                                    value={product.packSizeAr}
                                    onChange={(e) =>
                                        handleInputChange('packSizeAr', e.target.value)
                                    }
                                    placeholder="e.g., ٢٠ قرص"
                                    data-oid="p1g00jc"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="7458_qr">
                            <div data-oid="m0rtnoz">
                                <Label htmlFor="unit" data-oid="a-1cgt4">
                                    Unit (English)
                                </Label>
                                <Input
                                    id="unit"
                                    value={product.unit}
                                    onChange={(e) => handleInputChange('unit', e.target.value)}
                                    placeholder="e.g., tablets"
                                    data-oid="2l.gf44"
                                />
                            </div>
                            <div data-oid="ij2gbwo">
                                <Label htmlFor="unitAr" data-oid="nehn_8.">
                                    Unit (Arabic)
                                </Label>
                                <Input
                                    id="unitAr"
                                    value={product.unitAr}
                                    onChange={(e) => handleInputChange('unitAr', e.target.value)}
                                    placeholder="e.g., أقراص"
                                    data-oid="fd8yr.:"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="fjsu.w7">
                            <div data-oid="cib5oi.">
                                <Label htmlFor="volumeWeight" data-oid="92b3egf">
                                    Volume/Weight (English)
                                </Label>
                                <Input
                                    id="volumeWeight"
                                    value={product.volumeWeight}
                                    onChange={(e) =>
                                        handleInputChange('volumeWeight', e.target.value)
                                    }
                                    placeholder="e.g., 250ml or 50g"
                                    data-oid="evfh.kl"
                                />
                            </div>
                            <div data-oid="_6m0ct-">
                                <Label htmlFor="volumeWeightAr" data-oid="w7bv.1e">
                                    Volume/Weight (Arabic)
                                </Label>
                                <Input
                                    id="volumeWeightAr"
                                    value={product.volumeWeightAr}
                                    onChange={(e) =>
                                        handleInputChange('volumeWeightAr', e.target.value)
                                    }
                                    placeholder="e.g., ٢٥٠ مل or ٥٠ جرام"
                                    data-oid="0mopo78"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="ms9pvzr">
                            <div data-oid="hfjb43k">
                                <Label htmlFor="pillsPerBlister" data-oid="y4wr3-9">
                                    Pills Per Blister (English)
                                </Label>
                                <Input
                                    id="pillsPerBlister"
                                    value={product.pillsPerBlister}
                                    onChange={(e) =>
                                        handleInputChange('pillsPerBlister', e.target.value)
                                    }
                                    placeholder="e.g., 10 (or N/A for non-pills)"
                                    data-oid="o684jvp"
                                />
                            </div>
                            <div data-oid="qvt2d5e">
                                <Label htmlFor="pillsPerBlisterAr" data-oid="2jr8p6:">
                                    Pills Per Blister (Arabic)
                                </Label>
                                <Input
                                    id="pillsPerBlisterAr"
                                    value={product.pillsPerBlisterAr}
                                    onChange={(e) =>
                                        handleInputChange('pillsPerBlisterAr', e.target.value)
                                    }
                                    placeholder="e.g., ١٠ (or غير متاح)"
                                    data-oid="hscujgr"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="_z5xkcu">
                            <div data-oid=":lfb0_7">
                                <Label htmlFor="blistersPerBox" data-oid="ely-lhb">
                                    Blisters Per Box (English)
                                </Label>
                                <Input
                                    id="blistersPerBox"
                                    value={product.blistersPerBox}
                                    onChange={(e) =>
                                        handleInputChange('blistersPerBox', e.target.value)
                                    }
                                    placeholder="e.g., 2 (or N/A for non-pills)"
                                    data-oid="sei.dw2"
                                />
                            </div>
                            <div data-oid="cus1zr3">
                                <Label htmlFor="blistersPerBoxAr" data-oid="a3ts_bv">
                                    Blisters Per Box (Arabic)
                                </Label>
                                <Input
                                    id="blistersPerBoxAr"
                                    value={product.blistersPerBoxAr}
                                    onChange={(e) =>
                                        handleInputChange('blistersPerBoxAr', e.target.value)
                                    }
                                    placeholder="e.g., ٢ (or غير متاح)"
                                    data-oid="3.2e-4y"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="fa39f-a">
                            <div data-oid="gkbhgun">
                                <Label htmlFor="barcode" data-oid="uevkd_-">
                                    Barcode
                                </Label>
                                <Input
                                    id="barcode"
                                    value={product.barcode}
                                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                                    placeholder="e.g., 6221234567890"
                                    data-oid="c:7e-3."
                                />
                            </div>
                            <div data-oid="xn7yeac">
                                <Label htmlFor="registrationNumber" data-oid="o0zddtf">
                                    Registration Number
                                </Label>
                                <Input
                                    id="registrationNumber"
                                    value={product.registrationNumber}
                                    onChange={(e) =>
                                        handleInputChange('registrationNumber', e.target.value)
                                    }
                                    placeholder="e.g., REG123456"
                                    data-oid="ul4rv_v"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Images */}
                <Card data-oid="ng21oam">
                    <CardHeader data-oid="tfanr7_">
                        <CardTitle data-oid="r286n53">Product Images</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="q400x:5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-oid="4:mz-v2">
                            <div data-oid="0pketm9">
                                <Label htmlFor="imagePrimary" data-oid="gld64q-">
                                    Primary Image URL
                                </Label>
                                <Input
                                    id="imagePrimary"
                                    value={product.imagePrimary}
                                    onChange={(e) =>
                                        handleInputChange('imagePrimary', e.target.value)
                                    }
                                    placeholder="https://example.com/image-primary.jpg"
                                    data-oid="ao-ylrt"
                                />
                            </div>
                            <div data-oid="152vj-d">
                                <Label htmlFor="imageSecondary" data-oid="x86k828">
                                    Secondary Image URL
                                </Label>
                                <Input
                                    id="imageSecondary"
                                    value={product.imageSecondary}
                                    onChange={(e) =>
                                        handleInputChange('imageSecondary', e.target.value)
                                    }
                                    placeholder="https://example.com/image-secondary.jpg"
                                    data-oid="gt106rx"
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
                            data-oid="_mr-d.f"
                        >
                            <div className="text-4xl mb-4" data-oid="fu7llyg">
                                📷
                            </div>
                            <h3 className="text-lg font-semibold mb-2" data-oid="7v4ntl1">
                                Upload Product Images
                            </h3>
                            <p className="text-gray-600 mb-4" data-oid="-:yu9p.">
                                Drag and drop images here, or click to select files
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files)}
                                className="hidden"
                                id="image-upload"
                                data-oid="71d92:v"
                            />

                            <label htmlFor="image-upload" data-oid="2:yzk-c">
                                <Button type="button" as="span" data-oid="-po9zjr">
                                    Choose Images
                                </Button>
                            </label>
                        </div>
                        {uploadedImages.length > 0 && (
                            <div
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                data-oid="ck2q0ry"
                            >
                                {uploadedImages.map((image, index) => (
                                    <div key={index} className="relative" data-oid="u2l3cv9">
                                        <img
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border"
                                            data-oid="hsg622j"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                                            data-oid="gp6r.s7"
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
                <Card data-oid="zz58f.r">
                    <CardHeader data-oid="_oy0fp_">
                        <CardTitle data-oid="q_2xyfv">Tags & Keywords</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" data-oid="5sw07nc">
                        <div data-oid=":a4ey:m">
                            <Label htmlFor="tags" data-oid="gqtdqwg">
                                Tags
                            </Label>
                            <div className="flex space-x-2 mb-2" data-oid="a8sy_w.">
                                <Input
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    placeholder="Add a tag"
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && (e.preventDefault(), addTag())
                                    }
                                    data-oid="b775_-."
                                />

                                <Button type="button" onClick={addTag} data-oid="q-d-dr0">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2" data-oid="5-9vd:1">
                                {product.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-blue-100 text-blue-800"
                                        data-oid=".xzekkr"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                            data-oid=":-z94_e"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div data-oid="euzw1b6">
                            <Label htmlFor="keywords" data-oid="k0ht3oq">
                                Keywords
                            </Label>
                            <div className="flex space-x-2 mb-2" data-oid="bnvvpnh">
                                <Input
                                    value={currentKeyword}
                                    onChange={(e) => setCurrentKeyword(e.target.value)}
                                    placeholder="Add a keyword"
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && (e.preventDefault(), addKeyword())
                                    }
                                    data-oid="glh9iyc"
                                />

                                <Button type="button" onClick={addKeyword} data-oid="oy-.-9x">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2" data-oid="vl78ec.">
                                {product.keywords.map((keyword, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-green-100 text-green-800"
                                        data-oid="z2t-a1t"
                                    >
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => removeKeyword(keyword)}
                                            className="ml-2 text-green-600 hover:text-green-800"
                                            data-oid="l1mppjm"
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
                <div className="flex justify-between" data-oid="viw_l2x">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        data-oid="ynnfo8g"
                    >
                        Cancel
                    </Button>
                    <div className="space-x-2" data-oid="bmx-r7.">
                        <Button type="button" variant="outline" data-oid="u79:t23">
                            Save as Draft
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            data-oid="jibsa.5"
                        >
                            {isSaving ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}
