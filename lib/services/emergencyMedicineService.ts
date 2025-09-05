export interface EmergencyMedicine {
    id: string;
    name: string;
    genericName: string;
    activeIngredient: string;
    category:
        | 'cardiac'
        | 'respiratory'
        | 'neurological'
        | 'allergic'
        | 'diabetic'
        | 'pain'
        | 'infection'
        | 'gastrointestinal';
    urgencyLevel: 'critical' | 'high' | 'moderate';
    description: string;
    indications: string[];
    contraindications: string[];
    dosage: string;
    administration: string;
    sideEffects: string[];
    warnings: string[];
    storageRequirements: string;
    shelfLife: string;
    prescriptionRequired: boolean;
    controlledSubstance: boolean;
    alternativeNames: string[];
    emergencyUse: {
        conditions: string[];
        dosing: string;
        administration: string;
        monitoring: string[];
        contraindications: string[];
    };
}

export interface PharmacyAvailability {
    pharmacyId: string;
    pharmacyName: string;
    address: string;
    phone: string;
    city: string;
    governorate: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    distance: number; // in km
    isOpen: boolean;
    openingHours: {
        [key: string]: { open: string; close: string } | null;
    };
    emergencyContact: string;
    hasStock: boolean;
    stockLevel: 'high' | 'medium' | 'low' | 'critical';
    lastUpdated: Date;
    estimatedAvailability: string;
    price: number;
    deliveryAvailable: boolean;
    estimatedDeliveryTime: string;
    specialInstructions?: string;
}

export interface EmergencySearchResult {
    medicine: EmergencyMedicine;
    availablePharmacies: PharmacyAvailability[];
    nearestPharmacy: PharmacyAvailability | null;
    totalPharmaciesWithStock: number;
    averageDistance: number;
    emergencyAlternatives: EmergencyMedicine[];
    urgencyRecommendations: string[];
}

export interface EmergencySearchFilters {
    city?: string;
    governorate?: string;
    maxDistance?: number; // in km
    openNow?: boolean;
    hasDelivery?: boolean;
    stockLevel?: 'any' | 'medium' | 'high';
    urgencyLevel?: 'critical' | 'high' | 'moderate';
}

// Emergency medicines database
const emergencyMedicinesDatabase: EmergencyMedicine[] = [
    // Cardiac Emergency Medicines
    {
        id: 'em-001',
        name: 'Aspirin 300mg',
        genericName: 'Acetylsalicylic Acid',
        activeIngredient: 'Acetylsalicylic Acid',
        category: 'cardiac',
        urgencyLevel: 'critical',
        description:
            'Emergency antiplatelet therapy for acute coronary syndrome and stroke prevention',
        indications: [
            'Acute myocardial infarction',
            'Unstable angina',
            'Acute stroke',
            'Suspected heart attack',
        ],
        contraindications: ['Active bleeding', 'Severe liver disease', 'Allergy to aspirin'],
        dosage: '300mg chewed immediately, then 75-100mg daily',
        administration: 'Oral, chew tablet for faster absorption in emergency',
        sideEffects: ['Stomach upset', 'Bleeding', 'Tinnitus'],
        warnings: ['Risk of bleeding', 'Not for children under 16'],
        storageRequirements: 'Store below 25°C in dry place',
        shelfLife: '3 years',
        prescriptionRequired: false,
        controlledSubstance: false,
        alternativeNames: ['Aspocid', 'Cardiopirin', 'Emergency Aspirin'],
        emergencyUse: {
            conditions: ['Chest pain', 'Heart attack symptoms', 'Stroke symptoms'],
            dosing: '300mg immediately, chew tablet',
            administration: 'Chew tablet, do not swallow whole',
            monitoring: ['Blood pressure', 'Signs of bleeding', 'Symptom relief'],
            contraindications: ['Active bleeding', 'Recent surgery', 'Severe hypertension'],
        },
    },
    {
        id: 'em-002',
        name: 'Nitroglycerin 0.5mg',
        genericName: 'Glyceryl Trinitrate',
        activeIngredient: 'Nitroglycerin',
        category: 'cardiac',
        urgencyLevel: 'critical',
        description: 'Rapid-acting vasodilator for angina and acute heart failure',
        indications: ['Acute angina', 'Chest pain', 'Heart failure', 'Hypertensive crisis'],
        contraindications: ['Hypotension', 'Recent sildenafil use', 'Severe anemia'],
        dosage: '0.5mg sublingual, repeat every 5 minutes up to 3 doses',
        administration: 'Sublingual tablet under tongue',
        sideEffects: ['Headache', 'Dizziness', 'Hypotension', 'Flushing'],
        warnings: ['May cause severe hypotension', 'Sit down before taking'],
        storageRequirements: 'Store in original container, protect from light',
        shelfLife: '2 years unopened, 6 months after opening',
        prescriptionRequired: true,
        controlledSubstance: false,
        alternativeNames: ['GTN', 'Nitrostat', 'Angised'],
        emergencyUse: {
            conditions: ['Chest pain', 'Angina attack', 'Acute heart failure'],
            dosing: '0.5mg under tongue, repeat if needed',
            administration: 'Place under tongue, do not swallow',
            monitoring: ['Blood pressure', 'Heart rate', 'Symptom relief'],
            contraindications: ['Blood pressure <90/60', 'Recent ED medication use'],
        },
    },

    // Respiratory Emergency Medicines
    {
        id: 'em-003',
        name: 'Salbutamol Inhaler',
        genericName: 'Salbutamol',
        activeIngredient: 'Salbutamol Sulfate',
        category: 'respiratory',
        urgencyLevel: 'critical',
        description: 'Fast-acting bronchodilator for acute asthma and COPD exacerbations',
        indications: [
            'Acute asthma attack',
            'COPD exacerbation',
            'Bronchospasm',
            'Breathing difficulties',
        ],
        contraindications: ['Hypersensitivity to salbutamol'],
        dosage: '2-4 puffs every 4-6 hours, up to 8 puffs in emergency',
        administration: 'Metered dose inhaler, use spacer if available',
        sideEffects: ['Tremor', 'Palpitations', 'Headache', 'Muscle cramps'],
        warnings: [
            'Seek immediate medical help if no improvement',
            'Do not exceed recommended dose',
        ],
        storageRequirements: 'Store below 25°C, do not freeze',
        shelfLife: '2 years',
        prescriptionRequired: true,
        controlledSubstance: false,
        alternativeNames: ['Ventolin', 'ProAir', 'Airomir'],
        emergencyUse: {
            conditions: ['Asthma attack', 'Severe breathlessness', 'Wheezing'],
            dosing: '4 puffs immediately, repeat every 20 minutes if needed',
            administration: 'Shake inhaler, breathe out, inhale deeply while pressing',
            monitoring: ['Breathing improvement', 'Heart rate', 'Oxygen saturation'],
            contraindications: ['Known allergy to salbutamol'],
        },
    },

    // Allergic Emergency Medicines
    {
        id: 'em-004',
        name: 'Epinephrine Auto-Injector',
        genericName: 'Epinephrine',
        activeIngredient: 'Epinephrine',
        category: 'allergic',
        urgencyLevel: 'critical',
        description: 'Life-saving treatment for severe allergic reactions and anaphylaxis',
        indications: ['Anaphylaxis', 'Severe allergic reaction', 'Angioedema', 'Severe asthma'],
        contraindications: ['None in life-threatening situations'],
        dosage: '0.3mg (adult) or 0.15mg (child) intramuscular',
        administration: 'Auto-injector into outer thigh muscle',
        sideEffects: ['Rapid heartbeat', 'Anxiety', 'Tremor', 'Headache'],
        warnings: ['Call emergency services immediately after use', 'May need second dose'],
        storageRequirements: 'Store at room temperature, protect from light',
        shelfLife: '18 months',
        prescriptionRequired: true,
        controlledSubstance: false,
        alternativeNames: ['EpiPen', 'Adrenaline', 'Emergency Epinephrine'],
        emergencyUse: {
            conditions: [
                'Anaphylaxis',
                'Severe allergic reaction',
                'Difficulty breathing from allergy',
            ],
            dosing: '0.3mg intramuscular, may repeat in 15 minutes',
            administration: 'Inject into outer thigh through clothing if necessary',
            monitoring: ['Breathing', 'Blood pressure', 'Consciousness level'],
            contraindications: ['None in anaphylaxis'],
        },
    },
    {
        id: 'em-005',
        name: 'Diphenhydramine 50mg',
        genericName: 'Diphenhydramine',
        activeIngredient: 'Diphenhydramine HCl',
        category: 'allergic',
        urgencyLevel: 'high',
        description: 'Antihistamine for allergic reactions and anaphylaxis support',
        indications: ['Allergic reactions', 'Urticaria', 'Angioedema', 'Anaphylaxis support'],
        contraindications: ['Narrow-angle glaucoma', 'Severe asthma', 'Newborns'],
        dosage: '25-50mg every 6-8 hours, max 300mg/day',
        administration: 'Oral or intramuscular injection',
        sideEffects: ['Drowsiness', 'Dry mouth', 'Blurred vision', 'Confusion'],
        warnings: ['May cause severe drowsiness', 'Do not drive after taking'],
        storageRequirements: 'Store below 25°C, protect from light',
        shelfLife: '3 years',
        prescriptionRequired: false,
        controlledSubstance: false,
        alternativeNames: ['Benadryl', 'Allermax', 'Emergency Antihistamine'],
        emergencyUse: {
            conditions: ['Allergic reactions', 'Hives', 'Swelling'],
            dosing: '50mg immediately, may repeat in 6 hours',
            administration: 'Oral preferred, IM if severe',
            monitoring: ['Symptom improvement', 'Drowsiness level'],
            contraindications: ['Severe respiratory depression'],
        },
    },

    // Diabetic Emergency Medicines
    {
        id: 'em-006',
        name: 'Glucose Tablets',
        genericName: 'Dextrose',
        activeIngredient: 'Glucose',
        category: 'diabetic',
        urgencyLevel: 'critical',
        description: 'Fast-acting glucose for hypoglycemic emergencies',
        indications: ['Hypoglycemia', 'Low blood sugar', 'Diabetic emergency'],
        contraindications: ['Hyperglycemia', 'Unconscious patient'],
        dosage: '15-20g (3-4 tablets), repeat in 15 minutes if needed',
        administration: 'Oral, chew or dissolve in mouth',
        sideEffects: ['Nausea', 'Stomach upset'],
        warnings: ['Check blood sugar before and after', 'Seek medical help if no improvement'],
        storageRequirements: 'Store in dry place below 25°C',
        shelfLife: '2 years',
        prescriptionRequired: false,
        controlledSubstance: false,
        alternativeNames: ['Dextrose tablets', 'Glucose gel', 'Hypo treatment'],
        emergencyUse: {
            conditions: ['Low blood sugar symptoms', 'Diabetic hypoglycemia'],
            dosing: '15g immediately, recheck in 15 minutes',
            administration: 'Chew tablets or squeeze gel into mouth',
            monitoring: ['Blood glucose level', 'Symptom improvement'],
            contraindications: ['Unconsciousness', 'Unable to swallow'],
        },
    },
    {
        id: 'em-007',
        name: 'Glucagon Emergency Kit',
        genericName: 'Glucagon',
        activeIngredient: 'Glucagon',
        category: 'diabetic',
        urgencyLevel: 'critical',
        description: 'Emergency hormone for severe hypoglycemia when patient cannot swallow',
        indications: ['Severe hypoglycemia', 'Unconscious diabetic', 'Unable to take oral glucose'],
        contraindications: ['Pheochromocytoma', 'Insulinoma'],
        dosage: '1mg intramuscular or subcutaneous',
        administration: 'Injection kit, mix powder with diluent',
        sideEffects: ['Nausea', 'Vomiting', 'Headache'],
        warnings: ['Call emergency services', 'Patient may vomit upon awakening'],
        storageRequirements: 'Store below 25°C, do not freeze',
        shelfLife: '2 years',
        prescriptionRequired: true,
        controlledSubstance: false,
        alternativeNames: ['Emergency Glucagon', 'Hypo kit'],
        emergencyUse: {
            conditions: ['Unconscious hypoglycemia', 'Severe low blood sugar'],
            dosing: '1mg injection, may repeat in 20 minutes',
            administration: 'Intramuscular injection in thigh or arm',
            monitoring: ['Consciousness level', 'Blood glucose', 'Vital signs'],
            contraindications: ['Known glucagon allergy'],
        },
    },

    // Pain Emergency Medicines
    {
        id: 'em-008',
        name: 'Morphine 10mg',
        genericName: 'Morphine Sulfate',
        activeIngredient: 'Morphine',
        category: 'pain',
        urgencyLevel: 'high',
        description: 'Strong opioid analgesic for severe pain management',
        indications: ['Severe pain', 'Post-operative pain', 'Cancer pain', 'Trauma pain'],
        contraindications: ['Respiratory depression', 'Severe asthma', 'Paralytic ileus'],
        dosage: '5-10mg every 4 hours as needed',
        administration: 'Oral, intramuscular, or intravenous',
        sideEffects: ['Drowsiness', 'Constipation', 'Nausea', 'Respiratory depression'],
        warnings: ['Risk of addiction', 'May cause respiratory depression', 'Controlled substance'],
        storageRequirements: 'Secure storage, controlled substance requirements',
        shelfLife: '3 years',
        prescriptionRequired: true,
        controlledSubstance: true,
        alternativeNames: ['MST', 'Oramorph', 'Emergency Morphine'],
        emergencyUse: {
            conditions: ['Severe trauma pain', 'Post-surgical pain', 'Cancer pain crisis'],
            dosing: '5-10mg, titrate to effect',
            administration: 'Oral or injection as appropriate',
            monitoring: ['Pain level', 'Respiratory rate', 'Consciousness'],
            contraindications: ['Respiratory rate <12', 'Severe respiratory disease'],
        },
    },

    // Neurological Emergency Medicines
    {
        id: 'em-009',
        name: 'Diazepam 10mg',
        genericName: 'Diazepam',
        activeIngredient: 'Diazepam',
        category: 'neurological',
        urgencyLevel: 'critical',
        description: 'Benzodiazepine for seizures and severe anxiety',
        indications: ['Status epilepticus', 'Seizures', 'Severe anxiety', 'Muscle spasms'],
        contraindications: ['Severe respiratory depression', 'Myasthenia gravis', 'Sleep apnea'],
        dosage: '5-10mg, repeat as needed',
        administration: 'Oral, rectal, or intravenous',
        sideEffects: ['Drowsiness', 'Confusion', 'Muscle weakness', 'Respiratory depression'],
        warnings: [
            'Risk of dependence',
            'May cause respiratory depression',
            'Controlled substance',
        ],
        storageRequirements: 'Secure storage, controlled substance requirements',
        shelfLife: '5 years',
        prescriptionRequired: true,
        controlledSubstance: true,
        alternativeNames: ['Valium', 'Emergency Diazepam', 'Seizure medication'],
        emergencyUse: {
            conditions: ['Active seizures', 'Status epilepticus', 'Severe agitation'],
            dosing: '10mg, may repeat in 10-15 minutes',
            administration: 'Rectal gel or IV if available',
            monitoring: ['Seizure activity', 'Respiratory rate', 'Consciousness'],
            contraindications: ['Severe respiratory depression'],
        },
    },

    // Infection Emergency Medicines
    {
        id: 'em-010',
        name: 'Amoxicillin 875mg',
        genericName: 'Amoxicillin',
        activeIngredient: 'Amoxicillin',
        category: 'infection',
        urgencyLevel: 'moderate',
        description: 'Broad-spectrum antibiotic for bacterial infections',
        indications: ['Bacterial infections', 'Pneumonia', 'UTI', 'Skin infections'],
        contraindications: ['Penicillin allergy', 'Severe kidney disease'],
        dosage: '875mg twice daily for 7-10 days',
        administration: 'Oral with or without food',
        sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Allergic reactions'],
        warnings: ['Complete full course', 'Watch for allergic reactions'],
        storageRequirements: 'Store below 25°C in dry place',
        shelfLife: '3 years',
        prescriptionRequired: true,
        controlledSubstance: false,
        alternativeNames: ['Augmentin', 'Emergency Antibiotic'],
        emergencyUse: {
            conditions: ['Severe bacterial infection', 'Pneumonia', 'Sepsis risk'],
            dosing: '875mg twice daily, start immediately',
            administration: 'Oral, with food to reduce stomach upset',
            monitoring: ['Infection symptoms', 'Allergic reactions', 'Kidney function'],
            contraindications: ['Known penicillin allergy'],
        },
    },
];

// Mock pharmacy data with emergency medicine availability
const emergencyPharmacyData = [
    {
        pharmacyId: 'ph-001',
        pharmacyName: 'City Emergency Pharmacy',
        address: '123 Main Street, Downtown',
        phone: '+20 123 456 7890',
        city: 'Ismailia',
        governorate: 'Ismailia',
        coordinates: { lat: 30.5965, lng: 32.2715 },
        emergencyContact: '+20 123 456 7891',
        openingHours: {
            monday: { open: '00:00', close: '23:59' },
            tuesday: { open: '00:00', close: '23:59' },
            wednesday: { open: '00:00', close: '23:59' },
            thursday: { open: '00:00', close: '23:59' },
            friday: { open: '00:00', close: '23:59' },
            saturday: { open: '00:00', close: '23:59' },
            sunday: { open: '00:00', close: '23:59' },
        },
        deliveryAvailable: true,
    },
    {
        pharmacyId: 'ph-002',
        pharmacyName: 'Central Medical Pharmacy',
        address: '456 Hospital Road, Medical District',
        phone: '+20 123 456 7892',
        city: 'Ismailia',
        governorate: 'Ismailia',
        coordinates: { lat: 30.5875, lng: 32.2625 },
        emergencyContact: '+20 123 456 7893',
        openingHours: {
            monday: { open: '06:00', close: '22:00' },
            tuesday: { open: '06:00', close: '22:00' },
            wednesday: { open: '06:00', close: '22:00' },
            thursday: { open: '06:00', close: '22:00' },
            friday: { open: '06:00', close: '22:00' },
            saturday: { open: '08:00', close: '20:00' },
            sunday: { open: '08:00', close: '20:00' },
        },
        deliveryAvailable: true,
    },
    {
        pharmacyId: 'ph-003',
        pharmacyName: '24/7 Emergency Pharmacy',
        address: '789 Emergency Avenue, Hospital Zone',
        phone: '+20 123 456 7894',
        city: 'Ismailia',
        governorate: 'Ismailia',
        coordinates: { lat: 30.6055, lng: 32.2805 },
        emergencyContact: '+20 123 456 7895',
        openingHours: {
            monday: { open: '00:00', close: '23:59' },
            tuesday: { open: '00:00', close: '23:59' },
            wednesday: { open: '00:00', close: '23:59' },
            thursday: { open: '00:00', close: '23:59' },
            friday: { open: '00:00', close: '23:59' },
            saturday: { open: '00:00', close: '23:59' },
            sunday: { open: '00:00', close: '23:59' },
        },
        deliveryAvailable: true,
    },
];

export class EmergencyMedicineService {
    // Search for emergency medicines
    static async searchEmergencyMedicines(query: string): Promise<EmergencyMedicine[]> {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const searchTerm = query.toLowerCase();
        return emergencyMedicinesDatabase.filter(
            (medicine) =>
                medicine.name.toLowerCase().includes(searchTerm) ||
                medicine.genericName.toLowerCase().includes(searchTerm) ||
                medicine.activeIngredient.toLowerCase().includes(searchTerm) ||
                medicine.alternativeNames.some((name) => name.toLowerCase().includes(searchTerm)) ||
                medicine.indications.some((indication) =>
                    indication.toLowerCase().includes(searchTerm),
                ) ||
                medicine.emergencyUse.conditions.some((condition) =>
                    condition.toLowerCase().includes(searchTerm),
                ),
        );
    }

    // Find emergency medicine by condition
    static async findMedicinesByCondition(condition: string): Promise<EmergencyMedicine[]> {
        await new Promise((resolve) => setTimeout(resolve, 200));

        const conditionLower = condition.toLowerCase();
        return emergencyMedicinesDatabase.filter(
            (medicine) =>
                medicine.indications.some((indication) =>
                    indication.toLowerCase().includes(conditionLower),
                ) ||
                medicine.emergencyUse.conditions.some((emergencyCondition) =>
                    emergencyCondition.toLowerCase().includes(conditionLower),
                ),
        );
    }

    // Get emergency medicine availability
    static async getEmergencyMedicineAvailability(
        medicineId: string,
        userLocation?: { lat: number; lng: number },
        filters: EmergencySearchFilters = {},
    ): Promise<EmergencySearchResult | null> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const medicine = emergencyMedicinesDatabase.find((m) => m.id === medicineId);
        if (!medicine) return null;

        // Calculate distances and generate availability data
        const availablePharmacies: PharmacyAvailability[] = emergencyPharmacyData
            .map((pharmacy) => {
                const distance = userLocation
                    ? this.calculateDistance(userLocation, pharmacy.coordinates)
                    : Math.random() * 10 + 1; // Random distance for demo

                const isOpen = this.isPharmacyOpen(pharmacy.openingHours);
                const stockLevel = this.generateStockLevel(medicine.urgencyLevel);
                const hasStock = stockLevel !== 'critical';

                return {
                    ...pharmacy,
                    distance,
                    isOpen,
                    hasStock,
                    stockLevel,
                    lastUpdated: new Date(),
                    estimatedAvailability: hasStock ? 'Available now' : 'Out of stock',
                    price: this.generatePrice(medicine),
                    estimatedDeliveryTime: isOpen ? '30-45 minutes' : 'Next business day',
                    specialInstructions: medicine.controlledSubstance
                        ? 'Prescription required - Controlled substance'
                        : undefined,
                };
            })
            .filter((pharmacy) => {
                // Apply filters
                if (filters.city && pharmacy.city !== filters.city) return false;
                if (filters.governorate && pharmacy.governorate !== filters.governorate)
                    return false;
                if (filters.maxDistance && pharmacy.distance > filters.maxDistance) return false;
                if (filters.openNow && !pharmacy.isOpen) return false;
                if (filters.hasDelivery && !pharmacy.deliveryAvailable) return false;
                if (filters.stockLevel && filters.stockLevel !== 'any') {
                    if (filters.stockLevel === 'medium' && pharmacy.stockLevel === 'low')
                        return false;
                    if (
                        filters.stockLevel === 'high' &&
                        ['low', 'medium'].includes(pharmacy.stockLevel)
                    )
                        return false;
                }
                return true;
            })
            .sort((a, b) => {
                // Sort by: stock availability, then open status, then distance
                if (a.hasStock !== b.hasStock) return a.hasStock ? -1 : 1;
                if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
                return a.distance - b.distance;
            });

        const nearestPharmacy =
            availablePharmacies.find((p) => p.hasStock && p.isOpen) ||
            availablePharmacies[0] ||
            null;
        const totalPharmaciesWithStock = availablePharmacies.filter((p) => p.hasStock).length;
        const averageDistance =
            availablePharmacies.length > 0
                ? availablePharmacies.reduce((sum, p) => sum + p.distance, 0) /
                  availablePharmacies.length
                : 0;

        // Get emergency alternatives
        const emergencyAlternatives = emergencyMedicinesDatabase
            .filter(
                (alt) =>
                    alt.id !== medicine.id &&
                    alt.category === medicine.category &&
                    alt.urgencyLevel === medicine.urgencyLevel,
            )
            .slice(0, 3);

        // Generate urgency recommendations
        const urgencyRecommendations = this.generateUrgencyRecommendations(
            medicine,
            availablePharmacies,
        );

        return {
            medicine,
            availablePharmacies,
            nearestPharmacy,
            totalPharmaciesWithStock,
            averageDistance,
            emergencyAlternatives,
            urgencyRecommendations,
        };
    }

    // Get all emergency medicines by category
    static async getEmergencyMedicinesByCategory(
        category: EmergencyMedicine['category'],
    ): Promise<EmergencyMedicine[]> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return emergencyMedicinesDatabase.filter((medicine) => medicine.category === category);
    }

    // Get emergency medicine by ID
    static async getEmergencyMedicineById(id: string): Promise<EmergencyMedicine | null> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return emergencyMedicinesDatabase.find((medicine) => medicine.id === id) || null;
    }

    // Get emergency categories
    static async getEmergencyCategories(): Promise<
        Array<{
            category: EmergencyMedicine['category'];
            name: string;
            description: string;
            medicineCount: number;
            urgencyLevel: 'critical' | 'high' | 'moderate';
        }>
    > {
        const categories = [
            {
                category: 'cardiac' as const,
                name: 'Cardiac Emergency',
                description: 'Heart attack, chest pain, cardiac arrest',
                urgencyLevel: 'critical' as const,
            },
            {
                category: 'respiratory' as const,
                name: 'Respiratory Emergency',
                description: 'Asthma, breathing difficulties, COPD',
                urgencyLevel: 'critical' as const,
            },
            {
                category: 'allergic' as const,
                name: 'Allergic Reactions',
                description: 'Anaphylaxis, severe allergies, hives',
                urgencyLevel: 'critical' as const,
            },
            {
                category: 'neurological' as const,
                name: 'Neurological Emergency',
                description: 'Seizures, stroke, severe headache',
                urgencyLevel: 'critical' as const,
            },
            {
                category: 'diabetic' as const,
                name: 'Diabetic Emergency',
                description: 'Low/high blood sugar, diabetic coma',
                urgencyLevel: 'critical' as const,
            },
            {
                category: 'pain' as const,
                name: 'Severe Pain',
                description: 'Trauma, post-operative, chronic pain',
                urgencyLevel: 'high' as const,
            },
            {
                category: 'infection' as const,
                name: 'Severe Infections',
                description: 'Sepsis, pneumonia, severe bacterial infections',
                urgencyLevel: 'moderate' as const,
            },
            {
                category: 'gastrointestinal' as const,
                name: 'GI Emergency',
                description: 'Severe nausea, dehydration, GI bleeding',
                urgencyLevel: 'moderate' as const,
            },
        ];

        return categories.map((cat) => ({
            ...cat,
            medicineCount: emergencyMedicinesDatabase.filter((m) => m.category === cat.category)
                .length,
        }));
    }

    // Helper methods
    private static calculateDistance(
        point1: { lat: number; lng: number },
        point2: { lat: number; lng: number },
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
        const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((point1.lat * Math.PI) / 180) *
                Math.cos((point2.lat * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static isPharmacyOpen(openingHours: any): boolean {
        const now = new Date();
        const day =
            now.toLocaleLowerCase().substring(0, 3) +
            ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
                now.getDay()
            ].substring(3);
        const currentTime = now.getHours() * 100 + now.getMinutes();

        const todayHours = openingHours[day];
        if (!todayHours) return false;

        const openTime = parseInt(todayHours.open.replace(':', ''));
        const closeTime = parseInt(todayHours.close.replace(':', ''));

        if (openTime === 0 && closeTime === 2359) return true; // 24/7

        return currentTime >= openTime && currentTime <= closeTime;
    }

    private static generateStockLevel(
        urgencyLevel: string,
    ): 'high' | 'medium' | 'low' | 'critical' {
        const random = Math.random();
        if (urgencyLevel === 'critical') {
            return random > 0.8
                ? 'critical'
                : random > 0.5
                  ? 'low'
                  : random > 0.2
                    ? 'medium'
                    : 'high';
        }
        return random > 0.7 ? 'low' : random > 0.3 ? 'medium' : 'high';
    }

    private static generatePrice(medicine: EmergencyMedicine): number {
        const basePrices = {
            cardiac: 50,
            respiratory: 75,
            allergic: 100,
            neurological: 80,
            diabetic: 30,
            pain: 60,
            infection: 45,
            gastrointestinal: 25,
        };

        const basePrice = basePrices[medicine.category];
        const urgencyMultiplier =
            medicine.urgencyLevel === 'critical' ? 1.5 : medicine.urgencyLevel === 'high' ? 1.2 : 1;
        const controlledMultiplier = medicine.controlledSubstance ? 1.3 : 1;

        return Math.round(
            basePrice * urgencyMultiplier * controlledMultiplier * (0.8 + Math.random() * 0.4),
        );
    }

    private static generateUrgencyRecommendations(
        medicine: EmergencyMedicine,
        pharmacies: PharmacyAvailability[],
    ): string[] {
        const recommendations: string[] = [];

        if (medicine.urgencyLevel === 'critical') {
            recommendations.push('🚨 CRITICAL: Seek immediate medical attention');
            recommendations.push('📞 Call emergency services (123) if life-threatening');
        }

        if (pharmacies.length === 0) {
            recommendations.push('⚠️ No pharmacies found with this medicine in stock');
            recommendations.push('🏥 Contact nearest hospital emergency department');
        } else {
            const openPharmacies = pharmacies.filter((p) => p.isOpen && p.hasStock);
            if (openPharmacies.length === 0) {
                recommendations.push('🕐 No pharmacies currently open with stock');
                recommendations.push('📞 Call emergency pharmacy numbers for urgent needs');
            } else {
                recommendations.push(
                    `✅ ${openPharmacies.length} pharmacy(ies) currently available`,
                );
                recommendations.push(
                    '🚗 Contact pharmacy before traveling to confirm availability',
                );
            }
        }

        if (medicine.prescriptionRequired) {
            recommendations.push('📋 Prescription required - contact your doctor');
        }

        if (medicine.controlledSubstance) {
            recommendations.push('🔒 Controlled substance - special prescription needed');
        }

        return recommendations;
    }

    // Get emergency contact information
    static async getEmergencyContacts(): Promise<{
        emergencyServices: string;
        poisonControl: string;
        medicalEmergency: string;
        pharmacyHotline: string;
        mentalHealthCrisis: string;
    }> {
        return {
            emergencyServices: '123',
            poisonControl: '+20 2 2684 4444',
            medicalEmergency: '+20 123 456 7890',
            pharmacyHotline: '+20 123 456 7891',
            mentalHealthCrisis: '+20 123 456 7892',
        };
    }

    // Report emergency medicine shortage
    static async reportShortage(
        medicineId: string,
        pharmacyId: string,
        details: string,
    ): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 300));
        // In real implementation, this would send to backend
        console.log('Emergency medicine shortage reported:', { medicineId, pharmacyId, details });
        return true;
    }
}
