export interface Medicine {
    id: string;
    name: string;
    genericName?: string;
    brandNames: string[];
    dosage: string;
    form: string;
    manufacturer: string;
    price: number;
    category: string;
    subCategory?: string;
    description: string;
    activeIngredient: string;
    strength: string;
    indications: string[];
    contraindications: string[];
    sideEffects: string[];
    interactions: string[];
    dosageInstructions: string;
    storageConditions: string;
    prescriptionRequired: boolean;
    availability: 'available' | 'limited' | 'out-of-stock';
    expiryDate?: string;
    batchNumber?: string;
    barcode?: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface MedicineSearchFilters {
    search?: string;
    category?: string;
    subCategory?: string;
    manufacturer?: string;
    form?: string;
    prescriptionRequired?: boolean;
    availability?: 'available' | 'limited' | 'out-of-stock';
    priceMin?: number;
    priceMax?: number;
}

export interface MedicineSearchResult {
    medicines: Medicine[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Comprehensive medicine database
const mockMedicineDatabase: Medicine[] = [
    {
        id: 'med-001',
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        brandNames: ['Panadol', 'Tylenol', 'Cetal'],
        dosage: '500mg',
        form: 'Tablet',
        manufacturer: 'Pharco Pharmaceuticals',
        price: 25.0,
        category: 'Pain Relief',
        subCategory: 'Analgesics',
        description:
            'Pain reliever and fever reducer. Effective for mild to moderate pain and fever.',
        activeIngredient: 'Paracetamol',
        strength: '500mg',
        indications: ['Pain relief', 'Fever reduction', 'Headache', 'Muscle pain'],
        contraindications: ['Severe liver disease', 'Allergy to paracetamol'],
        sideEffects: ['Nausea', 'Skin rash (rare)', 'Liver damage (overdose)'],
        interactions: ['Warfarin', 'Alcohol'],
        dosageInstructions: 'Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.',
        storageConditions: 'Store below 25°C in a dry place',
        prescriptionRequired: false,
        availability: 'available',
        images: ['/images/medicines/paracetamol.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-002',
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        brandNames: ['Amoxil', 'Trimox', 'Moxatag'],
        dosage: '500mg',
        form: 'Capsule',
        manufacturer: 'EIPICO',
        price: 45.0,
        category: 'Antibiotics',
        subCategory: 'Penicillins',
        description: 'Broad-spectrum antibiotic used to treat bacterial infections.',
        activeIngredient: 'Amoxicillin',
        strength: '500mg',
        indications: [
            'Bacterial infections',
            'Respiratory tract infections',
            'Urinary tract infections',
            'Skin infections',
        ],
        contraindications: ['Penicillin allergy', 'Severe kidney disease'],
        sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Allergic reactions'],
        interactions: ['Methotrexate', 'Oral contraceptives', 'Warfarin'],
        dosageInstructions: 'Adults: 500mg every 8 hours for 7-10 days or as prescribed.',
        storageConditions: 'Store below 25°C. Keep in original container.',
        prescriptionRequired: true,
        availability: 'available',
        images: ['/images/medicines/amoxicillin.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-003',
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen',
        brandNames: ['Advil', 'Motrin', 'Brufen'],
        dosage: '400mg',
        form: 'Tablet',
        manufacturer: 'Eva Pharma',
        price: 30.0,
        category: 'Pain Relief',
        subCategory: 'NSAIDs',
        description: 'Non-steroidal anti-inflammatory drug for pain, inflammation, and fever.',
        activeIngredient: 'Ibuprofen',
        strength: '400mg',
        indications: ['Pain relief', 'Inflammation', 'Fever', 'Arthritis', 'Menstrual pain'],
        contraindications: [
            'Peptic ulcer',
            'Severe heart failure',
            'Severe kidney disease',
            'Aspirin allergy',
        ],
        sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness', 'Headache'],
        interactions: ['Warfarin', 'ACE inhibitors', 'Lithium', 'Methotrexate'],
        dosageInstructions: 'Adults: 400mg every 6-8 hours with food. Maximum 1200mg daily.',
        storageConditions: 'Store below 25°C. Protect from moisture.',
        prescriptionRequired: false,
        availability: 'available',
        images: ['/images/medicines/ibuprofen.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-004',
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole',
        brandNames: ['Prilosec', 'Losec', 'Zegerid'],
        dosage: '20mg',
        form: 'Capsule',
        manufacturer: 'Sedico',
        price: 55.0,
        category: 'Gastric',
        subCategory: 'Proton Pump Inhibitors',
        description: 'Proton pump inhibitor for acid reflux and peptic ulcers.',
        activeIngredient: 'Omeprazole',
        strength: '20mg',
        indications: [
            'GERD',
            'Peptic ulcers',
            'Zollinger-Ellison syndrome',
            'H. pylori eradication',
        ],
        contraindications: ['Hypersensitivity to omeprazole', 'Severe liver disease'],
        sideEffects: ['Headache', 'Diarrhea', 'Abdominal pain', 'Nausea'],
        interactions: ['Clopidogrel', 'Warfarin', 'Digoxin', 'Atazanavir'],
        dosageInstructions: 'Adults: 20mg once daily before breakfast for 4-8 weeks.',
        storageConditions: 'Store below 25°C. Protect from light and moisture.',
        prescriptionRequired: true,
        availability: 'available',
        images: ['/images/medicines/omeprazole.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-005',
        name: 'Metformin 500mg',
        genericName: 'Metformin HCl',
        brandNames: ['Glucophage', 'Fortamet', 'Riomet'],
        dosage: '500mg',
        form: 'Tablet',
        manufacturer: 'CID',
        price: 40.0,
        category: 'Diabetes',
        subCategory: 'Biguanides',
        description: 'First-line medication for type 2 diabetes management.',
        activeIngredient: 'Metformin HCl',
        strength: '500mg',
        indications: ['Type 2 diabetes', 'Prediabetes', 'PCOS'],
        contraindications: ['Severe kidney disease', 'Metabolic acidosis', 'Severe heart failure'],
        sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Vitamin B12 deficiency'],
        interactions: ['Contrast agents', 'Alcohol', 'Cimetidine'],
        dosageInstructions: 'Adults: 500mg twice daily with meals. May increase gradually.',
        storageConditions: 'Store below 25°C in a dry place.',
        prescriptionRequired: true,
        availability: 'available',
        images: ['/images/medicines/metformin.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-006',
        name: 'Atorvastatin 20mg',
        genericName: 'Atorvastatin',
        brandNames: ['Lipitor', 'Torvast', 'Atorlip'],
        dosage: '20mg',
        form: 'Tablet',
        manufacturer: 'Pfizer',
        price: 85.0,
        category: 'Cardiovascular',
        subCategory: 'Statins',
        description: 'HMG-CoA reductase inhibitor for cholesterol management.',
        activeIngredient: 'Atorvastatin',
        strength: '20mg',
        indications: [
            'High cholesterol',
            'Cardiovascular disease prevention',
            'Familial hypercholesterolemia',
        ],
        contraindications: ['Active liver disease', 'Pregnancy', 'Breastfeeding'],
        sideEffects: ['Muscle pain', 'Headache', 'Nausea', 'Liver enzyme elevation'],
        interactions: ['Cyclosporine', 'Gemfibrozil', 'Warfarin', 'Digoxin'],
        dosageInstructions: 'Adults: 20mg once daily in the evening.',
        storageConditions: 'Store below 25°C. Protect from light.',
        prescriptionRequired: true,
        availability: 'available',
        images: ['/images/medicines/atorvastatin.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-007',
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine HCl',
        brandNames: ['Zyrtec', 'Reactine', 'Alerid'],
        dosage: '10mg',
        form: 'Tablet',
        manufacturer: 'Spimaco',
        price: 20.0,
        category: 'Antihistamine',
        subCategory: 'H1 Antagonists',
        description: 'Second-generation antihistamine for allergy relief.',
        activeIngredient: 'Cetirizine HCl',
        strength: '10mg',
        indications: ['Allergic rhinitis', 'Urticaria', 'Hay fever', 'Skin allergies'],
        contraindications: ['Severe kidney disease', 'Hypersensitivity to cetirizine'],
        sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue', 'Headache'],
        interactions: ['Alcohol', 'CNS depressants', 'Theophylline'],
        dosageInstructions: 'Adults: 10mg once daily, preferably in the evening.',
        storageConditions: 'Store below 25°C. Keep in original container.',
        prescriptionRequired: false,
        availability: 'available',
        images: ['/images/medicines/cetirizine.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-008',
        name: 'Vitamin D3 1000IU',
        genericName: 'Cholecalciferol',
        brandNames: ['D-Cure', 'Vigantol', 'Devarol'],
        dosage: '1000IU',
        form: 'Capsule',
        manufacturer: 'Mepaco',
        price: 35.0,
        category: 'Vitamins',
        subCategory: 'Fat-soluble Vitamins',
        description: 'Vitamin D supplement for bone health and immune function.',
        activeIngredient: 'Cholecalciferol',
        strength: '1000IU',
        indications: [
            'Vitamin D deficiency',
            'Osteoporosis prevention',
            'Bone health',
            'Immune support',
        ],
        contraindications: ['Hypercalcemia', 'Vitamin D toxicity', 'Kidney stones'],
        sideEffects: ['Nausea', 'Vomiting', 'Weakness', 'Kidney problems (overdose)'],
        interactions: ['Thiazide diuretics', 'Digoxin', 'Calcium supplements'],
        dosageInstructions: 'Adults: 1000IU daily with food or as directed.',
        storageConditions: 'Store below 25°C. Protect from light.',
        prescriptionRequired: false,
        availability: 'available',
        images: ['/images/medicines/vitamin-d3.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-009',
        name: 'Losartan 50mg',
        genericName: 'Losartan Potassium',
        brandNames: ['Cozaar', 'Hyzaar', 'Losacor'],
        dosage: '50mg',
        form: 'Tablet',
        manufacturer: 'Novartis',
        price: 65.0,
        category: 'Cardiovascular',
        subCategory: 'ARBs',
        description: 'Angiotensin receptor blocker for hypertension and heart failure.',
        activeIngredient: 'Losartan Potassium',
        strength: '50mg',
        indications: ['Hypertension', 'Heart failure', 'Diabetic nephropathy', 'Stroke prevention'],
        contraindications: ['Pregnancy', 'Bilateral renal artery stenosis', 'Hyperkalemia'],
        sideEffects: ['Dizziness', 'Fatigue', 'Hyperkalemia', 'Cough (rare)'],
        interactions: ['ACE inhibitors', 'Potassium supplements', 'NSAIDs', 'Lithium'],
        dosageInstructions: 'Adults: 50mg once daily. May increase to 100mg if needed.',
        storageConditions: 'Store below 25°C. Protect from moisture.',
        prescriptionRequired: true,
        availability: 'available',
        images: ['/images/medicines/losartan.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-010',
        name: 'Salbutamol Inhaler',
        genericName: 'Salbutamol',
        brandNames: ['Ventolin', 'ProAir', 'Airomir'],
        dosage: '100mcg/dose',
        form: 'Inhaler',
        manufacturer: 'GSK',
        price: 75.0,
        category: 'Respiratory',
        subCategory: 'Bronchodilators',
        description: 'Short-acting beta2-agonist for asthma and COPD.',
        activeIngredient: 'Salbutamol',
        strength: '100mcg/dose',
        indications: ['Asthma', 'COPD', 'Exercise-induced bronchospasm', 'Acute bronchospasm'],
        contraindications: ['Hypersensitivity to salbutamol', 'Severe cardiovascular disease'],
        sideEffects: ['Tremor', 'Palpitations', 'Headache', 'Muscle cramps'],
        interactions: ['Beta-blockers', 'MAO inhibitors', 'Tricyclic antidepressants'],
        dosageInstructions: 'Adults: 1-2 puffs every 4-6 hours as needed. Maximum 8 puffs daily.',
        storageConditions: 'Store below 25°C. Do not freeze or puncture.',
        prescriptionRequired: true,
        availability: 'available',
        images: ['/images/medicines/salbutamol.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    // Additional medicines for comprehensive database
    {
        id: 'med-011',
        name: 'Aspirin 75mg',
        genericName: 'Acetylsalicylic Acid',
        brandNames: ['Aspocid', 'Cardiopirin', 'Juspirin'],
        dosage: '75mg',
        form: 'Tablet',
        manufacturer: 'Bayer',
        price: 15.0,
        category: 'Cardiovascular',
        subCategory: 'Antiplatelet',
        description: 'Low-dose aspirin for cardiovascular protection.',
        activeIngredient: 'Acetylsalicylic Acid',
        strength: '75mg',
        indications: ['Cardiovascular protection', 'Stroke prevention', 'Heart attack prevention'],
        contraindications: ['Active bleeding', 'Severe liver disease', 'Children under 16'],
        sideEffects: ['Stomach upset', 'Bleeding', 'Tinnitus', 'Allergic reactions'],
        interactions: ['Warfarin', 'Methotrexate', 'ACE inhibitors'],
        dosageInstructions: 'Adults: 75mg once daily with food.',
        storageConditions: 'Store below 25°C in a dry place.',
        prescriptionRequired: false,
        availability: 'available',
        images: ['/images/medicines/aspirin.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        id: 'med-012',
        name: 'Insulin Glargine',
        genericName: 'Insulin Glargine',
        brandNames: ['Lantus', 'Basaglar', 'Toujeo'],
        dosage: '100 units/mL',
        form: 'Injection',
        manufacturer: 'Sanofi',
        price: 250.0,
        category: 'Diabetes',
        subCategory: 'Long-acting Insulin',
        description: 'Long-acting insulin for diabetes management.',
        activeIngredient: 'Insulin Glargine',
        strength: '100 units/mL',
        indications: ['Type 1 diabetes', 'Type 2 diabetes', 'Insulin-dependent diabetes'],
        contraindications: ['Hypoglycemia', 'Hypersensitivity to insulin glargine'],
        sideEffects: ['Hypoglycemia', 'Injection site reactions', 'Weight gain', 'Lipodystrophy'],
        interactions: ['Oral antidiabetics', 'Beta-blockers', 'ACE inhibitors'],
        dosageInstructions: 'Individualized dosing. Inject subcutaneously once daily.',
        storageConditions: 'Refrigerate 2-8°C. Do not freeze.',
        prescriptionRequired: true,
        availability: 'limited',
        images: ['/images/medicines/insulin-glargine.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
    },
];

export class MedicineDatabaseService {
    // Search medicines with filters and pagination
    static async searchMedicines(
        filters: MedicineSearchFilters = {},
        page: number = 1,
        limit: number = 20,
    ): Promise<MedicineSearchResult> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        let filtered = [...mockMedicineDatabase];

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(
                (medicine) =>
                    medicine.name.toLowerCase().includes(searchTerm) ||
                    medicine.genericName?.toLowerCase().includes(searchTerm) ||
                    medicine.activeIngredient.toLowerCase().includes(searchTerm) ||
                    medicine.manufacturer.toLowerCase().includes(searchTerm) ||
                    medicine.brandNames.some((brand) => brand.toLowerCase().includes(searchTerm)) ||
                    medicine.indications.some((indication) =>
                        indication.toLowerCase().includes(searchTerm),
                    ),
            );
        }

        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter((medicine) => medicine.category === filters.category);
        }

        // Apply sub-category filter
        if (filters.subCategory) {
            filtered = filtered.filter((medicine) => medicine.subCategory === filters.subCategory);
        }

        // Apply manufacturer filter
        if (filters.manufacturer) {
            filtered = filtered.filter(
                (medicine) => medicine.manufacturer === filters.manufacturer,
            );
        }

        // Apply form filter
        if (filters.form) {
            filtered = filtered.filter((medicine) => medicine.form === filters.form);
        }

        // Apply prescription required filter
        if (filters.prescriptionRequired !== undefined) {
            filtered = filtered.filter(
                (medicine) => medicine.prescriptionRequired === filters.prescriptionRequired,
            );
        }

        // Apply availability filter
        if (filters.availability) {
            filtered = filtered.filter(
                (medicine) => medicine.availability === filters.availability,
            );
        }

        // Apply price range filter
        if (filters.priceMin !== undefined) {
            filtered = filtered.filter((medicine) => medicine.price >= filters.priceMin!);
        }

        if (filters.priceMax !== undefined) {
            filtered = filtered.filter((medicine) => medicine.price <= filters.priceMax!);
        }

        // Calculate pagination
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const medicines = filtered.slice(startIndex, endIndex);

        return {
            medicines,
            total,
            page,
            limit,
            totalPages,
        };
    }

    // Get medicine by ID
    static async getMedicineById(id: string): Promise<Medicine | null> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return mockMedicineDatabase.find((medicine) => medicine.id === id) || null;
    }

    // Get all categories
    static async getCategories(): Promise<string[]> {
        const categories = Array.from(new Set(mockMedicineDatabase.map((m) => m.category))).sort();
        return categories;
    }

    // Get sub-categories by category
    static async getSubCategories(category?: string): Promise<string[]> {
        let medicines = mockMedicineDatabase;
        if (category) {
            medicines = medicines.filter((m) => m.category === category);
        }
        const subCategories = Array.from(
            new Set(medicines.map((m) => m.subCategory).filter(Boolean)),
        ).sort();
        return subCategories as string[];
    }

    // Get all manufacturers
    static async getManufacturers(): Promise<string[]> {
        const manufacturers = Array.from(
            new Set(mockMedicineDatabase.map((m) => m.manufacturer)),
        ).sort();
        return manufacturers;
    }

    // Get all forms
    static async getForms(): Promise<string[]> {
        const forms = Array.from(new Set(mockMedicineDatabase.map((m) => m.form))).sort();
        return forms;
    }

    // Get medicine interactions
    static async getMedicineInteractions(medicineIds: string[]): Promise<{
        interactions: string[];
        warnings: string[];
    }> {
        await new Promise((resolve) => setTimeout(resolve, 200));

        const medicines = mockMedicineDatabase.filter((m) => medicineIds.includes(m.id));
        const allInteractions = medicines.flatMap((m) => m.interactions);
        const uniqueInteractions = Array.from(new Set(allInteractions));

        // Check for potential interactions between selected medicines
        const warnings: string[] = [];
        for (let i = 0; i < medicines.length; i++) {
            for (let j = i + 1; j < medicines.length; j++) {
                const med1 = medicines[i];
                const med2 = medicines[j];

                // Check if medicines interact with each other
                if (
                    med1.interactions.some(
                        (interaction) =>
                            med2.name.toLowerCase().includes(interaction.toLowerCase()) ||
                            med2.activeIngredient.toLowerCase().includes(interaction.toLowerCase()),
                    )
                ) {
                    warnings.push(`Potential interaction between ${med1.name} and ${med2.name}`);
                }
            }
        }

        return {
            interactions: uniqueInteractions,
            warnings,
        };
    }

    // Get medicine statistics
    static async getMedicineStats(): Promise<{
        total: number;
        byCategory: Record<string, number>;
        byAvailability: Record<string, number>;
        prescriptionRequired: number;
        overTheCounter: number;
    }> {
        const total = mockMedicineDatabase.length;

        const byCategory = mockMedicineDatabase.reduce(
            (acc, medicine) => {
                acc[medicine.category] = (acc[medicine.category] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        const byAvailability = mockMedicineDatabase.reduce(
            (acc, medicine) => {
                acc[medicine.availability] = (acc[medicine.availability] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        const prescriptionRequired = mockMedicineDatabase.filter(
            (m) => m.prescriptionRequired,
        ).length;
        const overTheCounter = mockMedicineDatabase.filter((m) => !m.prescriptionRequired).length;

        return {
            total,
            byCategory,
            byAvailability,
            prescriptionRequired,
            overTheCounter,
        };
    }
}
