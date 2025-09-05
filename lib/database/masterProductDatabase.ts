// Master Product Database - Single source of truth for all products
// This represents what would be in your actual database

export interface MasterProduct {
    id: number;
    name: string;
    nameAr: string;
    category: string;
    type: 'medicine' | 'medical-supply' | 'hygiene-supply' | 'medical-device';
    manufacturer: string;
    description: string;
    descriptionAr: string;
    activeIngredient: string;
    activeIngredientAr: string;
    dosage: string;
    dosageAr: string;
    form: string;
    formAr: string;
    prescriptionRequired: boolean;
    vendorEligible: boolean; // Can vendors sell this?
    pharmacyEligible: boolean; // Can pharmacies sell this?
    regulatoryStatus: 'approved' | 'restricted' | 'controlled';
    image?: string;
    images?: string[];
    barcode?: string;
    registrationNumber?: string;
    packSize: string;
    packSizeAr: string;
    unit: string;
    unitAr: string;
    tags: string[];
    keywords: string[];
    createdAt: string;
    updatedAt: string;
}

// Business-specific inventory interface
export interface BusinessInventory {
    id: string;
    productId: number;
    businessId: string;
    businessType: 'pharmacy' | 'vendor';
    stock: number;
    price: number;
    originalPrice?: number;
    expiryDate?: string;
    batchNumber?: string;
    sku: string;
    minStockThreshold: number;
    maxStockCapacity: number;
    location: string;
    supplier: string;
    supplierContact: string;
    costPrice: number;
    discount?: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'discontinued';
    lastRestocked: string;
    lastSold?: string;
    totalSold: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Business information interface
export interface Business {
    id: string;
    name: string;
    nameAr: string;
    type: 'pharmacy' | 'vendor';
    licenseNumber: string;
    email: string;
    phone: string;
    whatsapp?: string;
    address: string;
    cityId: string;
    cityName: string;
    governorateId: string;
    governorateName: string;
    workingHours: {
        open: string;
        close: string;
    };
    isActive: boolean;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    commission: number; // percentage
    permissions: string[];
    specializations?: string[]; // for pharmacies: 'general', 'pediatric', 'geriatric', etc.
    certifications?: string[]; // for vendors: 'medical-devices', 'hygiene-products', etc.
    deliveryOptions: {
        homeDelivery: boolean;
        pickupAvailable: boolean;
        emergencyDelivery: boolean;
        deliveryFee: number;
        freeDeliveryThreshold?: number;
        estimatedDeliveryTime: string;
    };
    paymentMethods: string[];
    createdAt: string;
    updatedAt: string;
}

// Master database containing ALL products
export const masterProductDatabase: MasterProduct[] = [
    // MEDICINES (Pharmacy Only) - Vendors CANNOT sell these
    {
        id: 1001,
        name: 'Paracetamol 500mg',
        nameAr: 'باراسيتامول ٥٠٠ مجم',
        category: 'analgesics',
        type: 'medicine',
        manufacturer: 'PharmaCorp',
        description: 'Pain reliever and fever reducer',
        descriptionAr: 'مسكن للألم وخافض للحرارة',
        activeIngredient: 'Paracetamol',
        activeIngredientAr: 'باراسيتامول',
        dosage: '500mg',
        dosageAr: '٥٠٠ مجم',
        form: 'Tablet',
        formAr: 'قرص',
        prescriptionRequired: false,
        vendorEligible: false, // ❌ Vendors cannot sell medicines
        pharmacyEligible: true, // ✅ Pharmacies can sell medicines
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567890',
        registrationNumber: 'EG-PAR-500-2024',
        packSize: '20 tablets',
        packSizeAr: '٢٠ قرص',
        unit: 'tablets',
        unitAr: 'أقراص',
        tags: ['pain-relief', 'fever', 'headache', 'otc'],
        keywords: ['paracetamol', 'acetaminophen', 'pain', 'fever', 'headache'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 1002,
        name: 'Amoxicillin 250mg',
        nameAr: 'أموكسيسيلين ٢٥٠ مجم',
        category: 'antibiotics',
        type: 'medicine',
        manufacturer: 'MediPharm',
        description: 'Antibiotic for bacterial infections',
        descriptionAr: 'مضاد حيوي للعدوى البكتيرية',
        activeIngredient: 'Amoxicillin',
        activeIngredientAr: 'أموكسيسيلين',
        dosage: '250mg',
        dosageAr: '٢٥٠ مجم',
        form: 'Capsule',
        formAr: 'كبسولة',
        prescriptionRequired: true,
        vendorEligible: false, // ❌ Vendors cannot sell prescription medicines
        pharmacyEligible: true, // ✅ Pharmacies can sell prescription medicines
        regulatoryStatus: 'controlled',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567891',
        registrationNumber: 'EG-AMX-250-2024',
        packSize: '21 capsules',
        packSizeAr: '٢١ كبسولة',
        unit: 'capsules',
        unitAr: 'كبسولات',
        tags: ['antibiotic', 'prescription', 'infection', 'bacterial'],
        keywords: ['amoxicillin', 'antibiotic', 'infection', 'bacterial', 'prescription'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 1003,
        name: 'Insulin Injection',
        nameAr: 'حقن الأنسولين',
        category: 'diabetes',
        type: 'medicine',
        manufacturer: 'DiabetesCare',
        description: 'Insulin for diabetes management',
        descriptionAr: 'أنسولين لإدارة السكري',
        activeIngredient: 'Human Insulin',
        activeIngredientAr: 'أنسولين بشري',
        dosage: '100 IU/ml',
        dosageAr: '١٠٠ وحدة دولية/مل',
        form: 'Injection',
        formAr: 'حقن',
        prescriptionRequired: true,
        vendorEligible: false, // ❌ Vendors cannot sell insulin
        pharmacyEligible: true, // ✅ Pharmacies can sell insulin
        regulatoryStatus: 'controlled',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567892',
        registrationNumber: 'EG-INS-100-2024',
        packSize: '10ml vial',
        packSizeAr: 'قارورة ١٠ مل',
        unit: 'vial',
        unitAr: 'قارورة',
        tags: ['insulin', 'diabetes', 'prescription', 'injection'],
        keywords: ['insulin', 'diabetes', 'injection', 'blood sugar', 'prescription'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },

    // MEDICAL SUPPLIES (Both Pharmacy & Vendor) - Both can sell these
    {
        id: 2001,
        name: 'Hand Sanitizer 500ml',
        nameAr: 'معقم اليدين ٥٠٠ مل',
        category: 'hygiene',
        type: 'hygiene-supply',
        manufacturer: 'MedClean',
        description: 'Alcohol-based hand sanitizer with 70% ethanol',
        descriptionAr: 'معقم يدين كحولي يحتوي على ٧٠٪ إيثانول',
        activeIngredient: 'Ethanol 70%',
        activeIngredientAr: 'إيثانول ٧٠٪',
        dosage: '500ml',
        dosageAr: '٥٠٠ مل',
        form: 'Gel',
        formAr: 'جل',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell hygiene supplies
        pharmacyEligible: true, // ✅ Pharmacies can also sell hygiene supplies
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567893',
        registrationNumber: 'EG-SAN-500-2024',
        packSize: '500ml bottle',
        packSizeAr: 'زجاجة ٥٠٠ مل',
        unit: 'bottle',
        unitAr: 'زجاجة',
        tags: ['sanitizer', 'hygiene', 'alcohol', 'disinfectant', 'covid'],
        keywords: ['hand sanitizer', 'alcohol', 'disinfectant', 'hygiene', 'covid'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2002,
        name: 'Disposable Face Masks (50 pcs)',
        nameAr: 'كمامات طبية يمكن التخلص منها (٥٠ قطعة)',
        category: 'medical-supplies',
        type: 'medical-supply',
        manufacturer: 'SafeGuard',
        description: '3-layer disposable surgical face masks',
        descriptionAr: 'كمامات جراحية ثلاثية الطبقات يمكن التخلص منها',
        activeIngredient: 'Non-woven fabric',
        activeIngredientAr: 'قماش غير منسوج',
        dosage: '50 pieces',
        dosageAr: '٥٠ قطعة',
        form: 'Mask',
        formAr: 'كمامة',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell medical supplies
        pharmacyEligible: true, // ✅ Pharmacies can also sell medical supplies
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567894',
        registrationNumber: 'EG-MSK-50-2024',
        packSize: '50 pieces box',
        packSizeAr: 'علبة ٥٠ قطعة',
        unit: 'pieces',
        unitAr: 'قطع',
        tags: ['masks', 'protection', 'medical-supply', 'covid', 'surgical'],
        keywords: ['face masks', 'surgical masks', 'protection', 'covid', 'medical'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2003,
        name: 'Digital Thermometer',
        nameAr: 'ترمومتر رقمي',
        category: 'medical-devices',
        type: 'medical-device',
        manufacturer: 'TempCheck',
        description: 'Digital infrared thermometer for body temperature',
        descriptionAr: 'ترمومتر رقمي بالأشعة تحت الحمراء لقياس درجة حرارة الجسم',
        activeIngredient: 'Digital sensor',
        activeIngredientAr: 'مستشعر رقمي',
        dosage: 'Single unit',
        dosageAr: 'وحدة واحدة',
        form: 'Device',
        formAr: 'جهاز',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell medical devices
        pharmacyEligible: true, // ✅ Pharmacies can also sell medical devices
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567895',
        registrationNumber: 'EG-THM-DIG-2024',
        packSize: '1 device + case',
        packSizeAr: 'جهاز واحد + حافظة',
        unit: 'device',
        unitAr: 'جهاز',
        tags: ['thermometer', 'temperature', 'medical-device', 'digital', 'infrared'],
        keywords: ['thermometer', 'temperature', 'fever', 'digital', 'infrared'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2004,
        name: 'Sterile Gauze Bandages (10 pcs)',
        nameAr: 'ضمادات شاش معقمة (١٠ قطع)',
        category: 'wound-care',
        type: 'medical-supply',
        manufacturer: 'WoundCare Pro',
        description: 'Sterile gauze bandages for wound dressing',
        descriptionAr: 'ضمادات شاش معقمة لتضميد الجروح',
        activeIngredient: 'Cotton gauze',
        activeIngredientAr: 'شاش قطني',
        dosage: '10cm x 10cm',
        dosageAr: '١٠ سم × ١٠ سم',
        form: 'Bandage',
        formAr: 'ضمادة',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell wound care supplies
        pharmacyEligible: true, // ✅ Pharmacies can also sell wound care supplies
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567896',
        registrationNumber: 'EG-GAU-10-2024',
        packSize: '10 pieces pack',
        packSizeAr: 'عبوة ١٠ قطع',
        unit: 'pieces',
        unitAr: 'قطع',
        tags: ['bandage', 'wound-care', 'sterile', 'gauze', 'medical-supply'],
        keywords: ['bandage', 'gauze', 'wound care', 'sterile', 'dressing'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2005,
        name: 'Blood Pressure Monitor',
        nameAr: 'جهاز قياس ضغط الدم',
        category: 'medical-devices',
        type: 'medical-device',
        manufacturer: 'HealthMonitor',
        description: 'Automatic digital blood pressure monitor',
        descriptionAr: 'جهاز قياس ضغط الدم الرقمي الأوتوماتيكي',
        activeIngredient: 'Digital measurement',
        activeIngredientAr: 'قياس رقمي',
        dosage: 'Single unit',
        dosageAr: 'وحدة واحدة',
        form: 'Device',
        formAr: 'جهاز',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell medical devices
        pharmacyEligible: true, // ✅ Pharmacies can also sell medical devices
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567897',
        registrationNumber: 'EG-BPM-AUTO-2024',
        packSize: '1 monitor + cuff + case',
        packSizeAr: 'جهاز واحد + كفة + حقيبة',
        unit: 'device',
        unitAr: 'جهاز',
        tags: ['blood-pressure', 'monitor', 'medical-device', 'digital', 'automatic'],
        keywords: ['blood pressure', 'monitor', 'hypertension', 'digital', 'automatic'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2006,
        name: 'Antiseptic Wipes (100 pcs)',
        nameAr: 'مناديل مطهرة (١٠٠ قطعة)',
        category: 'hygiene',
        type: 'hygiene-supply',
        manufacturer: 'CleanCare',
        description: 'Alcohol-based antiseptic wipes for surface cleaning',
        descriptionAr: 'مناديل مطهرة كحولية لتنظيف الأسطح',
        activeIngredient: 'Isopropyl alcohol 70%',
        activeIngredientAr: 'كحول إيزوبروبيل ٧٠٪',
        dosage: '100 pieces',
        dosageAr: '١٠٠ قطعة',
        form: 'Wipes',
        formAr: 'مناديل',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell hygiene supplies
        pharmacyEligible: true, // ✅ Pharmacies can also sell hygiene supplies
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567898',
        registrationNumber: 'EG-WIP-100-2024',
        packSize: '100 wipes pack',
        packSizeAr: 'عبوة ١٠٠ منديل',
        unit: 'pieces',
        unitAr: 'قطع',
        tags: ['wipes', 'antiseptic', 'hygiene', 'alcohol', 'disinfectant'],
        keywords: ['antiseptic wipes', 'disinfectant', 'alcohol', 'hygiene', 'cleaning'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2007,
        name: 'Latex Gloves (100 pcs)',
        nameAr: 'قفازات لاتكس (١٠٠ قطعة)',
        category: 'medical-supplies',
        type: 'medical-supply',
        manufacturer: 'SafeHands',
        description: 'Disposable latex examination gloves',
        descriptionAr: 'قفازات فحص لاتكس يمكن التخلص منها',
        activeIngredient: 'Natural latex',
        activeIngredientAr: 'لاتكس طبيعي',
        dosage: 'Size M',
        dosageAr: 'مقاس متوسط',
        form: 'Gloves',
        formAr: 'قفازات',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell medical supplies
        pharmacyEligible: true, // ✅ Pharmacies can also sell medical supplies
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567899',
        registrationNumber: 'EG-GLV-LAT-2024',
        packSize: '100 gloves box',
        packSizeAr: 'علبة ١٠٠ قفاز',
        unit: 'pieces',
        unitAr: 'قطع',
        tags: ['gloves', 'latex', 'medical-supply', 'examination', 'disposable'],
        keywords: [
            'latex gloves',
            'examination gloves',
            'medical gloves',
            'disposable',
            'protection',
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2008,
        name: 'First Aid Kit',
        nameAr: 'حقيبة إسعافات أولية',
        category: 'emergency-care',
        type: 'medical-supply',
        manufacturer: 'EmergencyCare',
        description: 'Complete first aid kit with essential medical supplies',
        descriptionAr: 'حقيبة إسعافات أولية كاملة مع المستلزمات الطبية الأساسية',
        activeIngredient: 'Mixed supplies',
        activeIngredientAr: 'مستلزمات متنوعة',
        dosage: 'Complete kit',
        dosageAr: 'حقيبة كاملة',
        form: 'Kit',
        formAr: 'حقيبة',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell emergency care supplies
        pharmacyEligible: true, // ✅ Pharmacies can also sell emergency care supplies
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567900',
        registrationNumber: 'EG-FAK-COMP-2024',
        packSize: 'Complete kit',
        packSizeAr: 'حقيبة كاملة',
        unit: 'kit',
        unitAr: 'حقيبة',
        tags: ['first-aid', 'emergency', 'medical-supply', 'kit', 'safety'],
        keywords: ['first aid kit', 'emergency', 'medical supplies', 'safety', 'bandages'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },

    // Additional medicines for comprehensive coverage
    {
        id: 1004,
        name: 'Ibuprofen 400mg',
        nameAr: 'إيبوبروفين ٤٠٠ مجم',
        category: 'analgesics',
        type: 'medicine',
        manufacturer: 'PainRelief Corp',
        description: 'Anti-inflammatory pain reliever',
        descriptionAr: 'مسكن للألم مضاد للالتهابات',
        activeIngredient: 'Ibuprofen',
        activeIngredientAr: 'إيبوبروفين',
        dosage: '400mg',
        dosageAr: '٤٠٠ مجم',
        form: 'Tablet',
        formAr: 'قرص',
        prescriptionRequired: false,
        vendorEligible: false, // ❌ Vendors cannot sell medicines
        pharmacyEligible: true, // ✅ Pharmacies can sell medicines
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567901',
        registrationNumber: 'EG-IBU-400-2024',
        packSize: '30 tablets',
        packSizeAr: '٣٠ قرص',
        unit: 'tablets',
        unitAr: 'أقراص',
        tags: ['pain-relief', 'anti-inflammatory', 'fever', 'otc'],
        keywords: ['ibuprofen', 'pain relief', 'anti-inflammatory', 'fever', 'headache'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 1005,
        name: 'Vitamin D3 1000IU',
        nameAr: 'فيتامين د٣ ١٠٠٠ وحدة دولية',
        category: 'vitamins',
        type: 'medicine',
        manufacturer: 'VitaHealth',
        description: 'Essential vitamin D3 supplement for bone health',
        descriptionAr: 'مكمل فيتامين د٣ الأساسي لصحة العظام',
        activeIngredient: 'Cholecalciferol',
        activeIngredientAr: 'كولي كالسيفيرول',
        dosage: '1000IU',
        dosageAr: '١٠٠٠ وحدة دولية',
        form: 'Capsule',
        formAr: 'كبسولة',
        prescriptionRequired: false,
        vendorEligible: false, // ❌ Vendors cannot sell medicines
        pharmacyEligible: true, // ✅ Pharmacies can sell medicines
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567902',
        registrationNumber: 'EG-VD3-1000-2024',
        packSize: '60 capsules',
        packSizeAr: '٦٠ كبسولة',
        unit: 'capsules',
        unitAr: 'كبسولات',
        tags: ['vitamin', 'supplement', 'bone-health', 'immunity', 'otc'],
        keywords: ['vitamin d3', 'cholecalciferol', 'bone health', 'immunity', 'supplement'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },

    // Additional medical supplies and devices
    {
        id: 2009,
        name: 'Pulse Oximeter',
        nameAr: 'جهاز قياس الأكسجين',
        category: 'medical-devices',
        type: 'medical-device',
        manufacturer: 'OxyCheck',
        description: 'Fingertip pulse oximeter for oxygen saturation monitoring',
        descriptionAr: 'جهاز قياس الأكسجين للإصبع لمراقبة تشبع الأكسجين',
        activeIngredient: 'Digital sensor technology',
        activeIngredientAr: 'تقنية المستشعر الرقمي',
        dosage: 'Single unit',
        dosageAr: 'وحدة واحدة',
        form: 'Device',
        formAr: 'جهاز',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell medical devices
        pharmacyEligible: true, // ✅ Pharmacies can also sell medical devices
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567903',
        registrationNumber: 'EG-POX-FT-2024',
        packSize: '1 device + case + batteries',
        packSizeAr: 'جهاز واحد + حافظة + بطاريات',
        unit: 'device',
        unitAr: 'جهاز',
        tags: ['pulse-oximeter', 'oxygen-monitoring', 'medical-device', 'fingertip', 'covid'],
        keywords: ['pulse oximeter', 'oxygen saturation', 'SpO2', 'fingertip', 'covid'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 2010,
        name: 'Glucose Test Strips (50 pcs)',
        nameAr: 'شرائط اختبار الجلوكوز (٥٠ قطعة)',
        category: 'medical-devices',
        type: 'medical-device',
        manufacturer: 'DiabetesCheck',
        description: 'Accurate blood glucose test strips for diabetes monitoring',
        descriptionAr: 'شرائط اختبار الجلوكوز الدقيقة لمراقبة السكري',
        activeIngredient: 'Glucose oxidase enzyme',
        activeIngredientAr: 'إنزيم أكسيداز الجلوكوز',
        dosage: '50 strips',
        dosageAr: '٥٠ شريط',
        form: 'Test strips',
        formAr: 'شرائط اختبار',
        prescriptionRequired: false,
        vendorEligible: true, // ✅ Vendors can sell medical devices
        pharmacyEligible: true, // ✅ Pharmacies can also sell medical devices
        regulatoryStatus: 'approved',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        images: [
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center',
        ],
        barcode: '6221234567904',
        registrationNumber: 'EG-GTS-50-2024',
        packSize: '50 test strips',
        packSizeAr: '٥٠ شريط اختبار',
        unit: 'strips',
        unitAr: 'شرائط',
        tags: ['glucose', 'diabetes', 'test-strips', 'medical-device', 'monitoring'],
        keywords: ['glucose test strips', 'diabetes', 'blood sugar', 'monitoring', 'test'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

// Sample business data
export const businessDatabase: Business[] = [
    // Pharmacies
    {
        id: 'healthplus-ismailia',
        name: 'HealthPlus Pharmacy',
        nameAr: 'صيدلية هيلث بلس',
        type: 'pharmacy',
        licenseNumber: 'PH-ISM-001-2024',
        email: 'healthplus@pharmacy.com',
        phone: '+20 64 123 4567',
        whatsapp: '+20 10 123 4567',
        address: '123 Main Street, Ismailia City',
        cityId: 'ismailia-city',
        cityName: 'Ismailia City',
        governorateId: 'ismailia',
        governorateName: 'Ismailia',
        workingHours: {
            open: '08:00',
            close: '22:00',
        },
        isActive: true,
        isVerified: true,
        rating: 4.8,
        reviewCount: 124,
        commission: 15, // 15%
        permissions: ['sell-medicines', 'sell-medical-supplies', 'prescription-handling'],
        specializations: ['general', 'pediatric', 'chronic-diseases'],
        deliveryOptions: {
            homeDelivery: true,
            pickupAvailable: true,
            emergencyDelivery: true,
            deliveryFee: 15,
            freeDeliveryThreshold: 200,
            estimatedDeliveryTime: '30-45 min',
        },
        paymentMethods: ['cash', 'card', 'mobile-wallet'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 'wellcare-ismailia',
        name: 'WellCare Pharmacy',
        nameAr: 'صيدلية ويل كير',
        type: 'pharmacy',
        licenseNumber: 'PH-ISM-002-2024',
        email: 'wellcare@pharmacy.com',
        phone: '+20 64 234 5678',
        whatsapp: '+20 10 234 5678',
        address: '456 Health Avenue, Ismailia City',
        cityId: 'ismailia-city',
        cityName: 'Ismailia City',
        governorateId: 'ismailia',
        governorateName: 'Ismailia',
        workingHours: {
            open: '09:00',
            close: '21:00',
        },
        isActive: true,
        isVerified: true,
        rating: 4.6,
        reviewCount: 89,
        commission: 12, // 12%
        permissions: ['sell-medicines', 'sell-medical-supplies', 'prescription-handling'],
        specializations: ['general', 'dermatology'],
        deliveryOptions: {
            homeDelivery: true,
            pickupAvailable: true,
            emergencyDelivery: false,
            deliveryFee: 12,
            freeDeliveryThreshold: 150,
            estimatedDeliveryTime: '25-40 min',
        },
        paymentMethods: ['cash', 'card'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    // Vendors
    {
        id: 'medtech-vendor',
        name: 'MedTech Supplies',
        nameAr: 'مستلزمات ميد تك',
        type: 'vendor',
        licenseNumber: 'VD-CAI-001-2024',
        email: 'medtech@vendor.com',
        phone: '+20 2 345 6789',
        whatsapp: '+20 11 345 6789',
        address: '789 Industrial Zone, Cairo',
        cityId: 'cairo-city',
        cityName: 'Cairo City',
        governorateId: 'cairo',
        governorateName: 'Cairo',
        workingHours: {
            open: '08:00',
            close: '18:00',
        },
        isActive: true,
        isVerified: true,
        rating: 4.7,
        reviewCount: 156,
        commission: 8, // 8%
        permissions: ['sell-medical-supplies', 'sell-medical-devices', 'bulk-orders'],
        certifications: ['medical-devices', 'hygiene-products', 'emergency-supplies'],
        deliveryOptions: {
            homeDelivery: true,
            pickupAvailable: true,
            emergencyDelivery: true,
            deliveryFee: 25,
            freeDeliveryThreshold: 500,
            estimatedDeliveryTime: '1-2 hours',
        },
        paymentMethods: ['cash', 'card', 'bank-transfer', 'mobile-wallet'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 'hygiene-plus-vendor',
        name: 'Hygiene Plus Supplies',
        nameAr: 'مستلزمات النظافة بلس',
        type: 'vendor',
        licenseNumber: 'VD-ALX-001-2024',
        email: 'hygieneplus@vendor.com',
        phone: '+20 3 456 7890',
        whatsapp: '+20 12 456 7890',
        address: '321 Supply District, Alexandria',
        cityId: 'alexandria-city',
        cityName: 'Alexandria City',
        governorateId: 'alexandria',
        governorateName: 'Alexandria',
        workingHours: {
            open: '07:00',
            close: '19:00',
        },
        isActive: true,
        isVerified: true,
        rating: 4.5,
        reviewCount: 203,
        commission: 10, // 10%
        permissions: ['sell-hygiene-supplies', 'sell-medical-supplies', 'bulk-orders'],
        certifications: ['hygiene-products', 'disinfectants', 'personal-care'],
        deliveryOptions: {
            homeDelivery: true,
            pickupAvailable: true,
            emergencyDelivery: false,
            deliveryFee: 20,
            freeDeliveryThreshold: 300,
            estimatedDeliveryTime: '45-90 min',
        },
        paymentMethods: ['cash', 'card', 'mobile-wallet'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

// Utility functions to filter products based on business type
export const getProductsForPharmacy = (): MasterProduct[] => {
    return masterProductDatabase.filter((product) => product.pharmacyEligible);
};

export const getProductsForVendor = (): MasterProduct[] => {
    return masterProductDatabase.filter(
        (product) =>
            product.vendorEligible && product.type !== 'medicine' && !product.prescriptionRequired,
    );
};

export const getMedicinesOnly = (): MasterProduct[] => {
    return masterProductDatabase.filter((product) => product.type === 'medicine');
};

export const getMedicalSuppliesOnly = (): MasterProduct[] => {
    return masterProductDatabase.filter(
        (product) =>
            product.type === 'medical-supply' ||
            product.type === 'hygiene-supply' ||
            product.type === 'medical-device',
    );
};

// Product management functions
export const updateProduct = (productId: number, updatedData: Partial<MasterProduct>): boolean => {
    const productIndex = masterProductDatabase.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return false; // Product not found
    }

    // Update the product with new data and set updatedAt timestamp
    masterProductDatabase[productIndex] = {
        ...masterProductDatabase[productIndex],
        ...updatedData,
        updatedAt: new Date().toISOString(),
    };

    return true; // Successfully updated
};

export const addProduct = (
    productData: Omit<MasterProduct, 'id' | 'createdAt' | 'updatedAt'>,
): MasterProduct => {
    // Generate new ID (in real app, this would be handled by the database)
    const newId = Math.max(...masterProductDatabase.map((p) => p.id)) + 1;

    const newProduct: MasterProduct = {
        ...productData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    masterProductDatabase.push(newProduct);
    return newProduct;
};

export const deleteProduct = (productId: number): boolean => {
    const productIndex = masterProductDatabase.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return false; // Product not found
    }

    masterProductDatabase.splice(productIndex, 1);
    return true; // Successfully deleted
};

export const getProductById = (productId: number): MasterProduct | undefined => {
    return masterProductDatabase.find((product) => product.id === productId);
};
