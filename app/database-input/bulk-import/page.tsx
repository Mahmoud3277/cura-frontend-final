'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the expected template structure - Universal for all product types
interface ProductData {
    Name: string;
    Name_Arabic: string;
    Category: string;
    Subcategory?: string;
    Type: string;
    Manufacturer: string;
    Brand?: string;
    Brand_Arabic?: string;
    Key_Ingredient?: string;
    Key_Ingredient_Arabic?: string;
    Strength_Concentration?: string;
    Strength_Concentration_Arabic?: string;
    Form?: string;
    Form_Arabic?: string;
    Description_Short?: string;
    Description_Detailed?: string;
    Description_Arabic_Short?: string;
    Description_Arabic_Detailed?: string;
    Uses_Benefits?: string;
    Warnings?: string;
    Precautions?: string;
    Prescription_Required?: string;
    Pack_Size?: string;
    Pack_Size_Arabic?: string;
    Unit?: string;
    Unit_Arabic?: string;
    Volume_Weight?: string;
    Volume_Weight_Arabic?: string;
    Pills_Per_Blister?: string;
    Pills_Per_Blister_Arabic?: string;
    Blisters_Per_Box?: string;
    Blisters_Per_Box_Arabic?: string;
    Image_Primary?: string;
    Image_Secondary?: string;

    Therapeutic_Class?: string;
    Price_Reference?: string;
    Currency?: string;

    Pregnancy_Category?: string;
}

interface ProcessedProduct extends ProductData {
    status: 'valid' | 'error' | 'warning';
    error?: string;
    warnings?: string[];
    rowNumber: number;
}

// Required fields that must be present and not empty
const REQUIRED_FIELDS = ['Name', 'Name_Arabic', 'Category', 'Type', 'Manufacturer'];

// Expected template headers in exact order - Universal for all product types
const TEMPLATE_HEADERS = [
    'Name',
    'Name_Arabic',
    'Category',
    'Subcategory',
    'Type',
    'Manufacturer',
    'Brand',
    'Brand_Arabic',
    'Key_Ingredient',
    'Key_Ingredient_Arabic',
    'Strength_Concentration',
    'Strength_Concentration_Arabic',
    'Form',
    'Form_Arabic',
    'Description_Short',
    'Description_Detailed',
    'Description_Arabic_Short',
    'Description_Arabic_Detailed',
    'Uses_Benefits',
    'Warnings',
    'Precautions',
    'Prescription_Required',
    'Pack_Size',
    'Pack_Size_Arabic',
    'Unit',
    'Unit_Arabic',
    'Volume_Weight',
    'Volume_Weight_Arabic',
    'Pills_Per_Blister',
    'Pills_Per_Blister_Arabic',
    'Blisters_Per_Box',
    'Blisters_Per_Box_Arabic',
    'Image_Primary',
    'Image_Secondary',

    'Therapeutic_Class',
    'Price_Reference',
    'Currency',

    'Pregnancy_Category',
];

export default function BulkImportPage() {
    const router = useRouter();
    const [uploadStep, setUploadStep] = useState<
        'select' | 'upload' | 'preview' | 'importing' | 'complete'
    >('select');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ProcessedProduct[]>([]);
    const [importResults, setImportResults] = useState({
        total: 0,
        successful: 0,
        failed: 0,
        warnings: 0,
        errors: [] as string[],
    });
    const [fileValidation, setFileValidation] = useState<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>({ isValid: true, errors: [], warnings: [] });

    // CSV Parser function
    const parseCSV = (csvText: string): string[][] => {
        const lines = csvText.split('\n');
        const result: string[][] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const row: string[] = [];
            let current = '';
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    row.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }

            row.push(current.trim());
            result.push(row);
        }

        return result;
    };

    // Enhanced file structure validation
    const validateFileStructure = (
        headers: string[],
    ): { isValid: boolean; errors: string[]; warnings: string[] } => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check if we have the minimum required headers
        const missingRequired = REQUIRED_FIELDS.filter((field) => !headers.includes(field));
        if (missingRequired.length > 0) {
            errors.push(`Missing required columns: ${missingRequired.join(', ')}`);
        }

        // Check for extra columns not in template
        const extraColumns = headers.filter((header) => !TEMPLATE_HEADERS.includes(header));
        if (extraColumns.length > 0) {
            warnings.push(`Extra columns found (will be ignored): ${extraColumns.join(', ')}`);
        }

        // Check for recommended fields that are missing
        const recommendedFields = ['Brand', 'Brand_Arabic', 'Volume_Weight'];

        const missingRecommended = recommendedFields.filter((field) => !headers.includes(field));
        if (missingRecommended.length > 0) {
            warnings.push(
                `Recommended columns missing: ${missingRecommended.join(', ')}. These fields enhance product data quality.`,
            );
        }

        // Check for new universal fields
        const newUniversalFields = [
            'Volume_Weight',
            'Volume_Weight_Arabic',
            'Pills_Per_Blister',
            'Pills_Per_Blister_Arabic',
            'Blisters_Per_Box',
            'Blisters_Per_Box_Arabic',
        ];

        const foundNewFields = newUniversalFields.filter((field) => headers.includes(field));
        if (foundNewFields.length > 0) {
            warnings.push(
                `✅ Universal template detected with enhanced fields: ${foundNewFields.join(', ')}`,
            );
        }

        // Check column order (warning only)
        const expectedOrder = TEMPLATE_HEADERS.filter((header) => headers.includes(header));
        const actualOrder = headers.filter((header) => TEMPLATE_HEADERS.includes(header));

        if (JSON.stringify(expectedOrder) !== JSON.stringify(actualOrder)) {
            warnings.push(
                'Column order differs from template. Data will still be processed correctly.',
            );
        }

        // Provide template version feedback
        const hasAllNewFields = newUniversalFields.every((field) => headers.includes(field));
        if (hasAllNewFields) {
            warnings.push('✅ Using latest universal template with all enhanced fields');
        } else if (foundNewFields.length > 0) {
            warnings.push(
                '⚠️ Using partial universal template. Download latest template for all features',
            );
        } else {
            warnings.push(
                'ℹ️ Using basic template. Consider downloading the universal template for enhanced features',
            );
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    };

    // Enhanced validation for all product types
    const validateProduct = (
        product: Partial<ProductData>,
        rowNumber: number,
    ): ProcessedProduct => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check required fields
        REQUIRED_FIELDS.forEach((field) => {
            const value = product[field as keyof ProductData];
            if (!value || value.toString().trim() === '') {
                errors.push(`${field} is required`);
            }
        });

        // Get category for category-specific validations
        const category = product.Category?.toLowerCase().replace(/[-_\s]/g, '');

        // Category-specific validations
        if (category === 'medicines' || category === 'medicine') {
            // Medicine-specific recommendations
            if (
                !product.Key_Ingredient ||
                product.Key_Ingredient.trim() === '' ||
                product.Key_Ingredient.toLowerCase() === 'n/a'
            ) {
                warnings.push('Key_Ingredient is recommended for medicines');
            }
            if (
                !product.Strength_Concentration ||
                product.Strength_Concentration.trim() === '' ||
                product.Strength_Concentration.toLowerCase() === 'n/a'
            ) {
                warnings.push('Strength_Concentration is recommended for medicines');
            }
            if (
                !product.Therapeutic_Class ||
                product.Therapeutic_Class.trim() === '' ||
                product.Therapeutic_Class.toLowerCase() === 'n/a'
            ) {
                warnings.push('Therapeutic_Class is recommended for medicines');
            }
        }

        if (category === 'babycare' || category === 'baby') {
            // Baby care specific validations
            if (
                !product.Volume_Weight ||
                product.Volume_Weight.trim() === '' ||
                product.Volume_Weight.toLowerCase() === 'n/a'
            ) {
                warnings.push('Volume_Weight is recommended for baby products');
            }
        }

        if (category === 'skincare') {
            // Skincare specific validations
            if (
                !product.Volume_Weight ||
                product.Volume_Weight.trim() === '' ||
                product.Volume_Weight.toLowerCase() === 'n/a'
            ) {
                warnings.push('Volume_Weight is recommended for skincare products');
            }
        }

        if (category === 'vitamins' || category === 'supplements') {
            // Vitamins/supplements specific validations
            if (
                !product.Key_Ingredient ||
                product.Key_Ingredient.trim() === '' ||
                product.Key_Ingredient.toLowerCase() === 'n/a'
            ) {
                warnings.push('Key_Ingredient is recommended for vitamins/supplements');
            }
            if (
                !product.Strength_Concentration ||
                product.Strength_Concentration.trim() === '' ||
                product.Strength_Concentration.toLowerCase() === 'n/a'
            ) {
                warnings.push('Strength_Concentration is recommended for vitamins/supplements');
            }
        }

        // Validate boolean fields
        const booleanFields = ['Prescription_Required'];
        booleanFields.forEach((field) => {
            const value = product[field as keyof ProductData];
            if (
                value &&
                value.trim() !== '' &&
                !['true', 'false', '1', '0', 'yes', 'no', 'n/a'].includes(value.toLowerCase())
            ) {
                warnings.push(`${field} should be true/false, yes/no, 1/0, or N/A`);
            }
        });

        // Validate Type/Prescription_Required consistency
        if (product.Type && product.Prescription_Required) {
            const type = product.Type.toLowerCase().trim();
            const prescriptionRequired = product.Prescription_Required.toLowerCase().trim();

            // Convert prescription required to boolean
            const isPrescriptionRequired = ['true', '1', 'yes'].includes(prescriptionRequired);

            // Check for conflicts
            if (type === 'otc' && isPrescriptionRequired) {
                errors.push('Conflict: Type "otc" cannot have Prescription_Required as true');
            }

            if (type === 'prescription' && !isPrescriptionRequired) {
                warnings.push(
                    'Warning: Type "prescription" should typically have Prescription_Required as true',
                );
            }

            // Additional type validations
            const nonPrescriptionTypes = [
                'supplement',
                'baby-product',
                'cosmetic',
                'hygiene-supply',
            ];

            if (nonPrescriptionTypes.includes(type) && isPrescriptionRequired) {
                errors.push(`Conflict: Type "${type}" should not require prescription`);
            }
        }

        // Validate URL fields
        const urlFields = ['Image_Primary', 'Image_Secondary'];
        urlFields.forEach((field) => {
            const value = product[field as keyof ProductData];
            if (value && value.trim() !== '' && value.toLowerCase() !== 'n/a') {
                try {
                    new URL(value);
                } catch {
                    warnings.push(`${field} appears to be an invalid URL`);
                }
            }
        });

        // Validate price
        if (
            product.Price_Reference &&
            product.Price_Reference.trim() !== '' &&
            product.Price_Reference.toLowerCase() !== 'n/a'
        ) {
            const price = parseFloat(product.Price_Reference);
            if (isNaN(price) || price < 0) {
                warnings.push('Price_Reference should be a valid positive number');
            }
        }

        // Validate currency - default to EGP if not specified
        if (
            product.Currency &&
            product.Currency.trim() !== '' &&
            product.Currency.toLowerCase() !== 'n/a'
        ) {
            const validCurrencies = ['EGP', 'USD', 'EUR', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'];
            if (!validCurrencies.includes(product.Currency.toUpperCase())) {
                warnings.push(
                    `Currency "${product.Currency}" is not supported. Using EGP as default. Supported currencies: ${validCurrencies.join(', ')}`,
                );
            }
        } else {
            // Set default currency to EGP if not provided
            product.Currency = 'EGP';
        }

        // Validate category against known categories
        if (product.Category && product.Category.trim() !== '') {
            const validCategories = [
                'medicines',
                'skincare',
                'supplements',
                'vitamins',
                'medical_supplies',
                'baby_care',
                'hygiene',
            ];

            const normalizedCategory = product.Category.toLowerCase().replace(/[-_\s]/g, '');
            const categoryMatch = validCategories.some(
                (cat) => cat.replace(/[-_\s]/g, '') === normalizedCategory,
            );

            if (!categoryMatch) {
                warnings.push(
                    `Category "${product.Category}" might not match system categories. Consider using: ${validCategories.join(', ')}`,
                );
            }
        }

        // Check for brand information
        if (
            (!product.Brand ||
                product.Brand.trim() === '' ||
                product.Brand.toLowerCase() === 'n/a') &&
            (!product.Brand_Arabic ||
                product.Brand_Arabic.trim() === '' ||
                product.Brand_Arabic.toLowerCase() === 'غير متاح')
        ) {
            warnings.push('Brand information is recommended for better product identification');
        }

        // Validate that at least one description field is filled
        const hasDescription = [
            product.Description_Short,
            product.Description_Detailed,
            product.Description_Arabic_Short,
            product.Description_Arabic_Detailed,
        ].some(
            (desc) =>
                desc &&
                desc.trim() !== '' &&
                desc.toLowerCase() !== 'n/a' &&
                desc.toLowerCase() !== 'غير متاح',
        );

        if (!hasDescription) {
            warnings.push(
                'At least one description field is recommended for better product information',
            );
        }

        // Check for Arabic translations
        const hasArabicTranslations = [
            product.Name_Arabic,
            product.Description_Arabic_Short || product.Description_Arabic_Detailed,
        ].every((field) => field && field.trim() !== '' && field.toLowerCase() !== 'n/a');

        if (!hasArabicTranslations) {
            warnings.push('Arabic translations are recommended for better accessibility');
        }

        return {
            ...(product as ProductData),
            status: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid',
            error: errors.length > 0 ? errors.join('; ') : undefined,
            warnings: warnings.length > 0 ? warnings : undefined,
            rowNumber,
        };
    };

    // Process CSV data
    const processCSVData = (csvData: string[][]): ProcessedProduct[] => {
        if (csvData.length === 0) return [];

        const headers = csvData[0];
        const dataRows = csvData.slice(1);

        return dataRows
            .map((row, index) => {
                const product: Partial<ProductData> = {};

                // Map row data to product object based on headers
                headers.forEach((header, headerIndex) => {
                    if (TEMPLATE_HEADERS.includes(header)) {
                        product[header as keyof ProductData] = row[headerIndex] || '';
                    }
                });

                return validateProduct(product, index + 2); // +2 because row 1 is headers and we're 0-indexed
            })
            .filter((product) => {
                // Filter out completely empty rows
                const hasData = Object.values(product).some(
                    (value) => value && typeof value === 'string' && value.trim() !== '',
                );
                return hasData;
            });
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadStep('upload');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setUploadStep('preview');

            // Read file content
            const fileContent = await selectedFile.text();

            // Parse CSV
            const csvData = parseCSV(fileContent);

            if (csvData.length === 0) {
                setFileValidation({
                    isValid: false,
                    errors: ['File appears to be empty or invalid'],
                    warnings: [],
                });
                setPreviewData([]);
                return;
            }

            // Validate file structure
            const headers = csvData[0];
            const validation = validateFileStructure(headers);
            setFileValidation(validation);

            if (!validation.isValid) {
                setPreviewData([]);
                return;
            }

            // Process data
            const processedData = processCSVData(csvData);
            setPreviewData(processedData);
        } catch (error) {
            console.error('Error processing file:', error);
            setFileValidation({
                isValid: false,
                errors: ['Error reading file. Please ensure it is a valid CSV file.'],
                warnings: [],
            });
            setPreviewData([]);
        }
    };

    const handleImport = async () => {
        setUploadStep('importing');

        // Simulate import process with realistic progress
        const validProducts = previewData.filter(
            (p) => p.status === 'valid' || p.status === 'warning',
        );
        const totalToImport = validProducts.length;

        for (let i = 0; i <= totalToImport; i++) {
            const progress = Math.round((i / totalToImport) * 100);
            setUploadProgress(progress);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Calculate final results
        const successful = previewData.filter(
            (p) => p.status === 'valid' || p.status === 'warning',
        ).length;
        const failed = previewData.filter((p) => p.status === 'error').length;
        const warnings = previewData.filter((p) => p.status === 'warning').length;
        const errors = previewData
            .filter((p) => p.status === 'error')
            .map((p) => `Row ${p.rowNumber}: ${p.error}`);

        setImportResults({
            total: previewData.length,
            successful,
            failed,
            warnings,
            errors,
        });

        setUploadStep('complete');
    };

    const downloadTemplate = () => {
        const csvContent = `Name,Name_Arabic,Category,Subcategory,Type,Manufacturer,Brand,Brand_Arabic,Key_Ingredient,Key_Ingredient_Arabic,Strength_Concentration,Strength_Concentration_Arabic,Form,Form_Arabic,Description_Short,Description_Detailed,Description_Arabic_Short,Description_Arabic_Detailed,Uses_Benefits,Warnings,Precautions,Prescription_Required,Pack_Size,Pack_Size_Arabic,Unit,Unit_Arabic,Volume_Weight,Volume_Weight_Arabic,Pills_Per_Blister,Pills_Per_Blister_Arabic,Blisters_Per_Box,Blisters_Per_Box_Arabic,Image_Primary,Image_Secondary,Therapeutic_Class,Price_Reference,Currency,Pregnancy_Category
Paracetamol 500mg,باراسيتامول ٥٠٠ مجم,medicines,pain-relief,otc,PharmaCorp,Panadol,بانادول,Paracetamol,باراسيتامول,500mg,٥٠٠ مجم,Tablet,قرص,Pain reliever,Effective pain reliever and fever reducer for adults and children,مسكن للألم,مسكن فعال للألم وخافض للحرارة للبالغين والأطفال,Pain relief and fever reduction,May cause nausea in rare cases,Not suitable for liver disease patients,false,20 tablets,٢٠ قرص,tablets,أقراص,N/A,غير متاح,10,١٠,2,٢,https://example.com/paracetamol-primary.jpg,https://example.com/paracetamol-secondary.jpg,Analgesics,25.50,EGP,Category A
Baby Shampoo 250ml,شامبو الأطفال ٢٥٠ مل,baby_care,hair-care,baby-product,BabyCare Co,Johnson's,جونسون,Chamomile Extract,مستخلص البابونج,Gentle Formula,تركيبة لطيفة,Liquid,سائل,Gentle baby shampoo,Tear-free gentle shampoo for delicate baby hair and scalp,شامبو الأطفال اللطيف,شامبو لطيف خالي من الدموع لشعر وفروة رأس الأطفال الحساسة,Daily hair cleansing for babies,Avoid contact with eyes,For external use only,false,250ml bottle,زجاجة ٢٥٠ مل,bottle,زجاجة,250ml,٢٥٠ مل,N/A,غير متاح,N/A,غير متاح,https://example.com/babyshampoo-primary.jpg,https://example.com/babyshampoo-secondary.jpg,Baby Care,35.99,EGP,Safe for pregnancy
Vitamin C 1000mg,فيتامين سي ١٠٠٠ مجم,vitamins,immune-support,supplement,VitaHealth,Nature Made,نيتشر ميد,Ascorbic Acid,حمض الأسكوربيك,1000mg,١٠٠٠ مجم,Tablet,قرص,Vitamin C supplement,High potency vitamin C for immune system support and antioxidant protection,مكمل فيتامين سي,فيتامين سي عالي الفعالية لدعم جهاز المناعة والحماية من الأكسدة,Immune support and antioxidant benefits,May cause stomach upset if taken on empty stomach,Consult doctor if taking blood thinners,false,60 tablets,٦٠ قرص,tablets,أقراص,N/A,غير متاح,N/A,غير متاح,N/A,غير متاح,https://example.com/vitaminc-primary.jpg,https://example.com/vitaminc-secondary.jpg,Vitamins,89.50,EGP,Category A
Face Moisturizer 50ml,مرطب الوجه ٥٠ مل,skincare,moisturizer,cosmetic,SkinCare Pro,Nivea,نيفيا,Hyaluronic Acid,حمض الهيالورونيك,2%,٢٪,Cream,كريم,Daily face moisturizer,Hydrating daily moisturizer for all skin types with SPF protection,مرطب الوجه اليومي,مرطب يومي مرطب لجميع أنواع البشرة مع حماية من أشعة الشمس,Daily hydration and sun protection,May cause mild irritation on sensitive skin,Patch test recommended for sensitive skin,false,50ml tube,أنبوب ٥٠ مل,tube,أنبوب,50ml,٥٠ مل,N/A,غير متاح,N/A,غير متاح,https://example.com/moisturizer-primary.jpg,https://example.com/moisturizer-secondary.jpg,Skincare,125.99,EGP,Safe for pregnancy
Hand Sanitizer 100ml,معقم اليدين ١٠٠ مل,hygiene,sanitizer,hygiene-supply,CleanCare,Dettol,ديتول,Ethyl Alcohol,كحول إيثيلي,70%,٧٠٪,Gel,جل,Antibacterial hand sanitizer,Fast-acting hand sanitizer that kills 99.9% of germs without water,معقم اليدين المضاد للبكتيريا,معقم اليدين سريع المفعول يقتل ٩٩.٩٪ من الجراثيم بدون ماء,Kills germs and bacteria on hands,Flammable - keep away from heat,For external use only - avoid contact with eyes,false,100ml bottle,زجاجة ١٠٠ مل,bottle,زجاجة,100ml,١٠٠ مل,N/A,غير متاح,N/A,غير متاح,https://example.com/sanitizer-primary.jpg,https://example.com/sanitizer-secondary.jpg,Hygiene,18.50,EGP,Safe for pregnancy`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'universal_product_import_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            {/* Step Indicator */}
            <div className="mb-8" data-oid="36es:-d">
                <div className="flex items-center justify-between" data-oid="vip1h.3">
                    {['select', 'upload', 'preview', 'importing', 'complete'].map((step, index) => {
                        const stepNames = [
                            'Select File',
                            'Upload',
                            'Preview',
                            'Import',
                            'Complete',
                        ];

                        const currentStepIndex = [
                            'select',
                            'upload',
                            'preview',
                            'importing',
                            'complete',
                        ].indexOf(uploadStep);
                        const isActive = currentStepIndex === index;
                        const isCompleted = currentStepIndex > index;
                        const isUpcoming = currentStepIndex < index;

                        return (
                            <div
                                key={step}
                                className="flex flex-col items-center flex-1"
                                data-oid="-4vn4tf"
                            >
                                <div className="flex items-center w-full" data-oid="9.1asc3">
                                    {index > 0 && (
                                        <div
                                            className={`flex-1 h-1 ${
                                                isCompleted ? 'bg-[#1F1F6F]' : 'bg-gray-200'
                                            }`}
                                            data-oid="33aa:ux"
                                        />
                                    )}
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mx-2 ${
                                            isActive
                                                ? 'bg-[#1F1F6F] text-white ring-4 ring-blue-100'
                                                : isCompleted
                                                  ? 'bg-[#1F1F6F] text-white'
                                                  : 'bg-gray-200 text-gray-600'
                                        }`}
                                        data-oid="fvo103m"
                                    >
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    {index < 4 && (
                                        <div
                                            className={`flex-1 h-1 ${
                                                isCompleted ? 'bg-[#1F1F6F]' : 'bg-gray-200'
                                            }`}
                                            data-oid="v5xv4lx"
                                        />
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-medium ${
                                        isActive
                                            ? 'text-[#1F1F6F]'
                                            : isCompleted
                                              ? 'text-gray-700'
                                              : 'text-gray-500'
                                    }`}
                                    data-oid="c7ef0fa"
                                >
                                    {stepNames[index]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            {uploadStep === 'select' && (
                <div className="space-y-6" data-oid="e2-u2rh">
                    <Card data-oid="l3ygfpp">
                        <CardHeader data-oid="26dz-0n">
                            <CardTitle data-oid="d8u2.3d">Step 1: Download Template</CardTitle>
                        </CardHeader>
                        <CardContent data-oid="weuv85m">
                            <div className="text-center p-8" data-oid="kkf_m.g">
                                <div className="mb-4" data-oid="cav-o4i">
                                    <svg
                                        className="w-16 h-16 mx-auto text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="v7-.y:-"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            data-oid="sd8g93h"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2" data-oid="yu77k1c">
                                    Download Import Template
                                </h3>
                                <p className="text-gray-600 mb-4" data-oid="l8zynts">
                                    Start by downloading our CSV template with all required columns
                                    and sample data.
                                </p>
                                <Button
                                    onClick={downloadTemplate}
                                    className="bg-cura-gradient text-white hover:opacity-90 transition-opacity shadow-md"
                                    data-oid="nn5t2bl"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="bvdv_zg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-4-4m4 4l4-4m5-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z"
                                            data-oid="4tocxvp"
                                        />
                                    </svg>
                                    Download Template
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card data-oid="5-afoej">
                        <CardHeader data-oid="bvewtd-">
                            <CardTitle data-oid="u9tjv-o">Step 2: Upload Your File</CardTitle>
                        </CardHeader>
                        <CardContent data-oid="sj0oy.:">
                            <div
                                className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg"
                                data-oid=".kb5s0z"
                            >
                                <div className="mb-4" data-oid="e3vtftm">
                                    <svg
                                        className="w-16 h-16 mx-auto text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="v0z35ce"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            data-oid="zo2wnli"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2" data-oid="6qfvvnp">
                                    Upload Product File
                                </h3>
                                <p className="text-gray-600 mb-4" data-oid="z4knvzg">
                                    Upload your completed CSV or Excel file with product data and
                                    image URLs.
                                </p>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                    data-oid="g.d.221"
                                />

                                <label htmlFor="file-upload" data-oid="c8a:eov">
                                    <Button
                                        asChild
                                        className="bg-cura-gradient text-white hover:opacity-90 transition-opacity shadow-md"
                                        data-oid="xomh7xa"
                                    >
                                        <span className="cursor-pointer" data-oid="g89_bfr">
                                            <svg
                                                className="w-4 h-4 mr-2 inline"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="ba1b_6i"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    data-oid="h7txu3p"
                                                />
                                            </svg>
                                            Choose File
                                        </span>
                                    </Button>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {uploadStep === 'upload' && (
                <Card data-oid="pyokjev">
                    <CardHeader data-oid=":sf7q-0">
                        <CardTitle data-oid="b3fyl.-">
                            File Selected: {selectedFile?.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent data-oid="mvmgp_7">
                        <div className="text-center p-8" data-oid="41qz:-g">
                            <div className="mb-4" data-oid=".jxhd:9">
                                <svg
                                    className="w-16 h-16 mx-auto text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="m1.4w5i"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        data-oid="g55i_wn"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2" data-oid="35p:p17">
                                Ready to Process
                            </h3>
                            <p className="text-gray-600 mb-4" data-oid="r5haq8t">
                                File size:{' '}
                                {selectedFile ? (selectedFile.size / 1024).toFixed(2) : 0} KB
                            </p>
                            <div className="flex justify-center space-x-4" data-oid="tiahnf6">
                                <Button
                                    variant="outline"
                                    onClick={() => setUploadStep('select')}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                                    data-oid="n01i6o_"
                                >
                                    Choose Different File
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    className="bg-cura-gradient text-white hover:opacity-90 transition-opacity shadow-md"
                                    data-oid="94qqrjc"
                                >
                                    Process File
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {uploadStep === 'preview' && (
                <div className="space-y-6" data-oid="33e_ecz">
                    {/* File Validation Results */}
                    {(!fileValidation.isValid || fileValidation.warnings.length > 0) && (
                        <Card data-oid="lz28gkm">
                            <CardHeader data-oid=".ul_79v">
                                <CardTitle data-oid="uiy267g">File Validation Results</CardTitle>
                            </CardHeader>
                            <CardContent data-oid="rnlmcyx">
                                {!fileValidation.isValid && (
                                    <Alert
                                        className="mb-4 border-red-200 bg-red-50"
                                        data-oid="c97t:5r"
                                    >
                                        <AlertDescription data-oid="7q7n_0i">
                                            <strong className="text-red-800" data-oid="2p4m1-6">
                                                Errors found:
                                            </strong>
                                            <ul
                                                className="mt-2 list-disc list-inside text-red-700"
                                                data-oid="zesv-uy"
                                            >
                                                {fileValidation.errors.map((error, index) => (
                                                    <li key={index} data-oid=":hywxmb">
                                                        {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {fileValidation.warnings.length > 0 && (
                                    <Alert
                                        className="border-yellow-200 bg-yellow-50"
                                        data-oid="nri3zzm"
                                    >
                                        <AlertDescription data-oid="8oacbd1">
                                            <strong className="text-yellow-800" data-oid="1uwj6-q">
                                                Warnings:
                                            </strong>
                                            <ul
                                                className="mt-2 list-disc list-inside text-yellow-700"
                                                data-oid="q21f:un"
                                            >
                                                {fileValidation.warnings.map((warning, index) => (
                                                    <li key={index} data-oid="rcqq6c3">
                                                        {warning}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {fileValidation.isValid && (
                        <Card data-oid="4apnsj0">
                            <CardHeader data-oid="53bwgki">
                                <div
                                    className="flex items-center justify-between"
                                    data-oid="kocjw6m"
                                >
                                    <CardTitle data-oid="zqrhgrw">Preview Import Data</CardTitle>
                                    <div className="flex space-x-2" data-oid="m26k27n">
                                        <Badge
                                            className="bg-green-100 text-green-800"
                                            data-oid="3fn1x6e"
                                        >
                                            {previewData.filter((p) => p.status === 'valid').length}{' '}
                                            Valid
                                        </Badge>
                                        <Badge
                                            className="bg-yellow-100 text-yellow-800"
                                            data-oid="8g5v9_c"
                                        >
                                            {
                                                previewData.filter((p) => p.status === 'warning')
                                                    .length
                                            }{' '}
                                            Warnings
                                        </Badge>
                                        <Badge
                                            className="bg-red-100 text-red-800"
                                            data-oid="3q1t2yz"
                                        >
                                            {previewData.filter((p) => p.status === 'error').length}{' '}
                                            Errors
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent data-oid="li6:a3m">
                                {/* Field Detection Summary */}
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg" data-oid="m.0--hp">
                                    <h4
                                        className="font-semibold text-blue-800 mb-2"
                                        data-oid="fq8i4n:"
                                    >
                                        Detected Fields Summary
                                    </h4>
                                    <div
                                        className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm"
                                        data-oid="tshb-6x"
                                    >
                                        {previewData.length > 0 &&
                                            Object.keys(previewData[0])
                                                .filter(
                                                    (key) =>
                                                        ![
                                                            'status',
                                                            'error',
                                                            'warnings',
                                                            'rowNumber',
                                                        ].includes(key),
                                                )
                                                .filter(
                                                    (key) =>
                                                        previewData[0][key as keyof ProductData] &&
                                                        previewData[0][key as keyof ProductData]
                                                            ?.toString()
                                                            .trim() !== '' &&
                                                        previewData[0][key as keyof ProductData]
                                                            ?.toString()
                                                            .toLowerCase() !== 'n/a',
                                                )
                                                .map((field) => (
                                                    <div
                                                        key={field}
                                                        className="flex items-center space-x-1"
                                                        data-oid="p9mx:q7"
                                                    >
                                                        <span
                                                            className="w-2 h-2 bg-green-500 rounded-full"
                                                            data-oid=".raf7ic"
                                                        ></span>
                                                        <span
                                                            className="text-blue-700"
                                                            data-oid="7ft4l67"
                                                        >
                                                            {field.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                ))}
                                    </div>
                                </div>

                                <div className="overflow-x-auto" data-oid="6zs5s_k">
                                    <table
                                        className="w-full border-collapse border border-gray-200"
                                        data-oid="p598nfy"
                                    >
                                        <thead data-oid="f:qmyqq">
                                            <tr className="bg-gray-50" data-oid="_8w82ad">
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid="q_4h1_f"
                                                >
                                                    Row
                                                </th>
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid="2bvg4mg"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid="l2jvy97"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid=".73:-38"
                                                >
                                                    Category
                                                </th>
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid="fxz_1-4"
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid="4njrr_0"
                                                >
                                                    Brand
                                                </th>
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid="99-t-o1"
                                                >
                                                    Manufacturer
                                                </th>
                                                <th
                                                    className="border border-gray-200 px-4 py-2 text-left"
                                                    data-oid="x7h85um"
                                                >
                                                    Issues
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody data-oid=":q9got4">
                                            {previewData.map((product, index) => (
                                                <tr
                                                    key={index}
                                                    className={
                                                        product.status === 'error'
                                                            ? 'bg-red-50'
                                                            : product.status === 'warning'
                                                              ? 'bg-yellow-50'
                                                              : 'bg-white'
                                                    }
                                                    data-oid="703r-2e"
                                                >
                                                    <td
                                                        className="border border-gray-200 px-4 py-2 text-sm text-gray-600"
                                                        data-oid="-34yti5"
                                                    >
                                                        {product.rowNumber}
                                                    </td>
                                                    <td
                                                        className="border border-gray-200 px-4 py-2"
                                                        data-oid="pphcgz4"
                                                    >
                                                        {product.status === 'valid' ? (
                                                            <Badge
                                                                className="bg-green-100 text-green-800"
                                                                data-oid="y80srwf"
                                                            >
                                                                ✓ Valid
                                                            </Badge>
                                                        ) : product.status === 'warning' ? (
                                                            <Badge
                                                                className="bg-yellow-100 text-yellow-800"
                                                                data-oid="327hnqs"
                                                            >
                                                                ⚠ Warning
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                className="bg-red-100 text-red-800"
                                                                data-oid="uh1ktea"
                                                            >
                                                                ✗ Error
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td
                                                        className="border border-gray-200 px-4 py-2"
                                                        data-oid="aoneday"
                                                    >
                                                        {product.Name}
                                                    </td>
                                                    <td
                                                        className="border border-gray-200 px-4 py-2"
                                                        data-oid="bn7-g2m"
                                                    >
                                                        {product.Category}
                                                    </td>
                                                    <td
                                                        className="border border-gray-200 px-4 py-2"
                                                        data-oid="wa276xk"
                                                    >
                                                        {product.Type}
                                                    </td>
                                                    <td
                                                        className="border border-gray-200 px-4 py-2"
                                                        data-oid="ywe5g5h"
                                                    >
                                                        {product.Brand || 'N/A'}
                                                    </td>
                                                    <td
                                                        className="border border-gray-200 px-4 py-2"
                                                        data-oid="5g9p3yr"
                                                    >
                                                        {product.Manufacturer}
                                                    </td>
                                                    <td
                                                        className="border border-gray-200 px-4 py-2 text-sm"
                                                        data-oid="g-l50nx"
                                                    >
                                                        {product.error && (
                                                            <div
                                                                className="text-red-600 mb-1"
                                                                data-oid="t92ydpa"
                                                            >
                                                                <strong data-oid="u85n2gw">
                                                                    Error:
                                                                </strong>{' '}
                                                                {product.error}
                                                            </div>
                                                        )}
                                                        {product.warnings &&
                                                            product.warnings.length > 0 && (
                                                                <div
                                                                    className="text-yellow-600"
                                                                    data-oid="qmw5yaw"
                                                                >
                                                                    <strong data-oid="zl0_w2b">
                                                                        Warnings:
                                                                    </strong>
                                                                    <ul
                                                                        className="list-disc list-inside mt-1"
                                                                        data-oid="gdx4.gb"
                                                                    >
                                                                        {product.warnings.map(
                                                                            (warning, wIndex) => (
                                                                                <li
                                                                                    key={wIndex}
                                                                                    className="text-xs"
                                                                                    data-oid="-_6q0wl"
                                                                                >
                                                                                    {warning}
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        {!product.error &&
                                                            (!product.warnings ||
                                                                product.warnings.length === 0) && (
                                                                <span
                                                                    className="text-green-600"
                                                                    data-oid="6ya5bfk"
                                                                >
                                                                    No issues
                                                                </span>
                                                            )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-between mt-6" data-oid="x3y5sld">
                                    <Button
                                        variant="outline"
                                        onClick={() => setUploadStep('upload')}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                                        data-oid="d.yq7an"
                                    >
                                        Back to Upload
                                    </Button>
                                    <Button
                                        onClick={handleImport}
                                        disabled={
                                            !fileValidation.isValid ||
                                            previewData.filter(
                                                (p) =>
                                                    p.status === 'valid' || p.status === 'warning',
                                            ).length === 0
                                        }
                                        className="bg-cura-gradient text-white hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
                                        data-oid="7o:8o18"
                                    >
                                        Import{' '}
                                        {
                                            previewData.filter(
                                                (p) =>
                                                    p.status === 'valid' || p.status === 'warning',
                                            ).length
                                        }{' '}
                                        Products
                                        {previewData.filter((p) => p.status === 'warning').length >
                                            0 && (
                                            <span className="ml-1 text-xs" data-oid="4b2ke7b">
                                                (with warnings)
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {uploadStep === 'importing' && (
                <Card data-oid="8r:tr40">
                    <CardHeader data-oid="hyurc85">
                        <CardTitle data-oid="gih994:">Importing Products...</CardTitle>
                    </CardHeader>
                    <CardContent data-oid="bqr48s7">
                        <div className="text-center p-8" data-oid=".z1c194">
                            <div className="mb-4" data-oid="hcxkupg">
                                <svg
                                    className="w-16 h-16 mx-auto text-blue-500 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="ms77ijs"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        data-oid="3270_kh"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2" data-oid="wb8zflf">
                                Processing Import
                            </h3>
                            <p className="text-gray-600 mb-4" data-oid="wqhom9_">
                                Please wait while we import your products into the database.
                            </p>
                            <div className="max-w-md mx-auto" data-oid="vbgss1a">
                                <Progress
                                    value={uploadProgress}
                                    className="mb-2"
                                    data-oid="ai7oxet"
                                />

                                <p className="text-sm text-gray-600" data-oid="mxztu16">
                                    {uploadProgress}% Complete
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {uploadStep === 'complete' && (
                <div className="space-y-6" data-oid="_k2awv.">
                    <Card data-oid=".ntu8-b">
                        <CardHeader data-oid="l9-rphe">
                            <CardTitle data-oid="qk5k.15">Import Complete!</CardTitle>
                        </CardHeader>
                        <CardContent data-oid="udf8nnb">
                            <div className="text-center p-8" data-oid="rp._y1-">
                                <div className="mb-4" data-oid="k_tpklt">
                                    <svg
                                        className="w-16 h-16 mx-auto text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        data-oid="gyoz4nz"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="vrbbvd:"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-2" data-oid=".1hxpv_">
                                    Import Successful
                                </h3>
                                <p className="text-gray-600 mb-6" data-oid=".tm.:57">
                                    Your products have been successfully imported into the database.
                                </p>

                                <div
                                    className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-6"
                                    data-oid="o_.j-68"
                                >
                                    <div className="text-center" data-oid="u2raah6">
                                        <div
                                            className="text-2xl font-bold text-blue-600"
                                            data-oid="xvy3-1j"
                                        >
                                            {importResults.total}
                                        </div>
                                        <div className="text-sm text-gray-600" data-oid="ow_._cx">
                                            Total
                                        </div>
                                    </div>
                                    <div className="text-center" data-oid="a-ivghu">
                                        <div
                                            className="text-2xl font-bold text-green-600"
                                            data-oid="4ijiq:u"
                                        >
                                            {importResults.successful}
                                        </div>
                                        <div className="text-sm text-gray-600" data-oid="jvtfin_">
                                            Successful
                                        </div>
                                    </div>
                                    <div className="text-center" data-oid="5tf8w0z">
                                        <div
                                            className="text-2xl font-bold text-yellow-600"
                                            data-oid="sxb1r7m"
                                        >
                                            {importResults.warnings}
                                        </div>
                                        <div className="text-sm text-gray-600" data-oid="o9snscl">
                                            Warnings
                                        </div>
                                    </div>
                                    <div className="text-center" data-oid="llzpjtu">
                                        <div
                                            className="text-2xl font-bold text-red-600"
                                            data-oid="b4b0u3p"
                                        >
                                            {importResults.failed}
                                        </div>
                                        <div className="text-sm text-gray-600" data-oid="a.ruz10">
                                            Failed
                                        </div>
                                    </div>
                                </div>

                                {importResults.errors.length > 0 && (
                                    <Alert className="mb-6" data-oid="bvqb6jx">
                                        <AlertDescription data-oid="xm77msr">
                                            <strong data-oid="184jw9z">Errors encountered:</strong>
                                            <ul
                                                className="mt-2 list-disc list-inside"
                                                data-oid="zqv:tl4"
                                            >
                                                {importResults.errors.map((error, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-sm"
                                                        data-oid="m0o29b6"
                                                    >
                                                        {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-center space-x-4" data-oid="5:xo_12">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push('/database-input/products')}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                                        data-oid="v.5jwtw"
                                    >
                                        View All Products
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setUploadStep('select');
                                            setSelectedFile(null);
                                            setPreviewData([]);
                                            setUploadProgress(0);
                                        }}
                                        className="bg-cura-gradient text-white hover:opacity-90 transition-opacity shadow-md"
                                        data-oid="-nrac7p"
                                    >
                                        Import More Products
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
