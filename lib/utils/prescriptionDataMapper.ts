/**
 * Comprehensive Safe Prescription Data Mapping Utility
 * 
 * This utility provides type-safe mapping for prescription data structures
 * and ensures all fields are properly handled with fallbacks.
 */

// Safe getter utility
const safeGet = (obj: any, path: string, defaultValue: any = null) => {
    try {
        return path.split('.').reduce((current, key) => {
            if (current && typeof current === 'object' && key in current) {
                return current[key];
            }
            return undefined;
        }, obj) ?? defaultValue;
    } catch {
        return defaultValue;
    }
};

// Safe number conversion
const safeNumber = (value: any, defaultValue: number = 0): number => {
    if (value === null || value === undefined) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
};

// Safe string conversion
const safeString = (value: any, defaultValue: string = ''): string => {
    if (value === null || value === undefined) return defaultValue;
    return String(value).trim();
};

// Safe boolean conversion
const safeBoolean = (value: any, defaultValue: boolean = false): boolean => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
};

// Safe array conversion
const safeArray = <T>(value: any, defaultValue: T[] = []): T[] => {
    return Array.isArray(value) ? value : defaultValue;
};

// Safe date conversion
const safeDate = (value: any): string => {
    if (!value) return '';
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? '' : date.toISOString();
    } catch {
        return '';
    }
};

/**
 * Safely maps pharmacy stock data
 */
export const mapPharmacyStock = (stock: any) => {
    return {
        providerId: safeString(stock?.providerId || stock?.pharmacyId || stock?.id),
        providerName: safeString(stock?.providerName || stock?.pharmacyName || stock?.name),
        providerType: safeString(stock?.providerType, 'pharmacy'),
        price: safeNumber(stock?.price),
        originalPrice: safeNumber(stock?.originalPrice || stock?.price),
        discount: safeNumber(stock?.discount),
        discountPercentage: safeNumber(stock?.discountPercentage),
        inStock: safeBoolean(stock?.inStock, true),
        stockQuantity: safeNumber(stock?.stockQuantity || stock?.quantity),
        stockLevel: safeString(stock?.stockLevel, stock?.inStock ? 'in-stock' : 'out-of-stock'),
        deliveryAvailable: safeBoolean(stock?.deliveryAvailable, true),
        deliveryFee: safeNumber(stock?.deliveryFee),
        deliveryTime: safeString(stock?.deliveryTime, '30-45 min'),
        deliveryTimeMinutes: safeNumber(stock?.deliveryTimeMinutes, 30),
        isOpen: safeBoolean(stock?.isOpen, true),
        rating: safeNumber(stock?.rating),
        reviewCount: safeNumber(stock?.reviewCount),
        lastUpdated: safeDate(stock?.lastUpdated),
        batchNumber: safeString(stock?.batchNumber),
        expiryDate: safeDate(stock?.expiryDate),
        manufacturer: safeString(stock?.manufacturer),
        
        // Location data
        address: safeString(stock?.address),
        cityId: safeString(stock?.cityId),
        governorateId: safeString(stock?.governorateId),
        coordinates: stock?.coordinates ? {
            lat: safeNumber(stock.coordinates.lat),
            lng: safeNumber(stock.coordinates.lng)
        } : null,
        distance: safeNumber(stock?.distance),
        
        // Additional metadata
        priority: safeNumber(stock?.priority, 1),
        verified: safeBoolean(stock?.verified, true),
        featured: safeBoolean(stock?.featured, false)
    };
};

/**
 * Safely maps medication data from prescription
 */
export const mapMedicationData = (medication: any) => {
    const productData = medication?.id || {};
    const pharmacyStocks = safeArray(productData.pharmacyStocks).map(mapPharmacyStock);
    
    // Get primary pharmacy pricing
    const primaryStock = pharmacyStocks.find(stock => stock.inStock && stock.stockQuantity > 0) || pharmacyStocks[0];
    const pharmacyPrice = primaryStock?.price || safeNumber(productData.pharmacyAveragePrice) || safeNumber(productData.overallAveragePrice);

    return {
        // Prescription-specific medication fields
        prescriptionFields: {
            duration: safeString(medication?.duration),
            frequency: safeString(medication?.frequency),
            instructions: safeString(medication?.instructions),
            dosage: safeString(medication?.dosage || productData?.dosage),
            notes: safeString(medication?.notes),
            packagingUnit: safeString(medication?.packagingUnit || productData?.packSize),
            quantity: safeNumber(medication?.quantity, 1)
        },

        // Product information
        product: {
            _id: safeString(productData._id),
            name: safeString(productData.name || medication?.name),
            nameAr: safeString(productData.nameAr),
            genericName: safeString(productData.genericName),
            brand: safeString(productData.brand),
            manufacturer: safeString(productData.manufacturer),
            manufacturerAr: safeString(productData.manufacturerAr),
            
            // Active ingredients and composition
            activeIngredient: safeString(productData.activeIngredient),
            activeIngredientAr: safeString(productData.activeIngredientAr),
            strength: safeString(productData.strength || productData.dosage),
            form: safeString(productData.form || productData.productType),
            unit: safeString(productData.unit),
            packSize: safeString(productData.packSize),
            
            // Pricing information (pharmacy-based)
            price: pharmacyPrice,
            originalPrice: safeNumber(productData.originalPrice || pharmacyPrice),
            currency: safeString(productData.currency, 'EGP'),
            
            // Availability
            inStock: productData.overallAvailability === 'in-stock' || safeBoolean(productData.inStock),
            stockLevel: safeString(productData.overallAvailability, 'unknown'),
            availabilityPercentage: safeNumber(productData.overallAvailabilityPercentage),
            
            // Images and media
            image: safeString(productData.images?.[0]?.url || medication?.image),
            images: safeArray(productData.images).map((img: any) => ({
                url: safeString(img?.url),
                alt: safeString(img?.alt),
                type: safeString(img?.type, 'product')
            })),
            
            // Categories and classification
            category: safeString(productData.category),
            subcategory: safeString(productData.subcategory),
            therapeuticClass: safeString(productData.therapeuticClass),
            productType: safeString(productData.productType),
            
            // Regulatory information
            requiresPrescription: safeBoolean(productData.requiresPrescription || productData.prescriptionRequired),
            controlledSubstance: safeBoolean(productData.controlledSubstance),
            approvalStatus: safeString(productData.approvalStatus),
            registrationNumber: safeString(productData.registrationNumber),
            barcode: safeString(productData.barcode),
            
            // Medical information
            indication: safeArray(productData.indication),
            contraindications: safeArray(productData.contraindications),
            warnings: safeArray(productData.warnings),
            sideEffects: safeArray(productData.sideEffects),
            drugInteractions: safeArray(productData.drugInteractions),
            specialInstructions: safeArray(productData.specialInstructions),
            timing: safeArray(productData.timing),
            
            // Storage and handling
            storageConditions: safeString(productData.storageConditions),
            storageConditionsAr: safeString(productData.storageConditionsAr),
            expiryWarningDays: safeNumber(productData.expiryWarningDays, 90),
            
            // Alternatives
            genericAlternatives: safeArray(productData.genericAlternatives),
            brandAlternatives: safeArray(productData.brandAlternatives),
            strengthAlternatives: safeArray(productData.strengthAlternatives),
            
            // Packaging details
            blistersPerBox: safeString(productData.blistersPerBox),
            pillsPerBlister: safeString(productData.pillsPerBlister),
            packagingOptions: safeArray(productData.packagingOptions),
            volumeWeight: safeString(productData.volumeWeight),
            
            // Ratings and popularity
            rating: safeNumber(productData.rating),
            reviewCount: safeNumber(productData.reviewCount),
            isPopular: safeBoolean(productData.isPopular),
            salesRank: safeNumber(productData.salesRank),
            
            // Search and discovery
            keywords: safeArray(productData.keywords),
            searchTerms: safeArray(productData.searchTerms),
            tags: safeArray(productData.tags),
            
            // System fields
            isActive: safeBoolean(productData.isActive, true),
            isGloballyAvailable: safeBoolean(productData.isGloballyAvailable, true),
            masterDatabaseId: safeString(productData.masterDatabaseId),
            createdAt: safeDate(productData.createdAt),
            updatedAt: safeDate(productData.updatedAt)
        },

        // Pharmacy availability
        pharmacyStocks: pharmacyStocks,
        
        // Pricing summaries
        pricing: {
            // Overall market pricing
            overallAveragePrice: safeNumber(productData.overallAveragePrice),
            overallHighestPrice: safeNumber(productData.overallHighestPrice),
            overallLowestPrice: safeNumber(productData.overallLowestPrice),
            overallAvailabilityPercentage: safeNumber(productData.overallAvailabilityPercentage),
            
            // Pharmacy-specific pricing
            pharmacyAveragePrice: safeNumber(productData.pharmacyAveragePrice),
            pharmacyHighestPrice: safeNumber(productData.pharmacyHighestPrice),
            pharmacyLowestPrice: safeNumber(productData.pharmacyLowestPrice),
            pharmacyAvailabilityPercentage: safeNumber(productData.pharmacyAvailabilityPercentage),
            
            // Vendor pricing (if applicable)
            vendorAveragePrice: safeNumber(productData.vendorAveragePrice),
            vendorHighestPrice: safeNumber(productData.vendorHighestPrice),
            vendorLowestPrice: safeNumber(productData.vendorLowestPrice),
            vendorAvailabilityPercentage: safeNumber(productData.vendorAvailabilityPercentage),
            
            // Counts
            totalPharmacies: safeNumber(productData.totalPharmacies),
            totalVendors: safeNumber(productData.totalVendors)
        },

        // Display helpers
        displayName: safeString(productData.name || medication?.name),
        displayImage: safeString(productData.images?.[0]?.url || medication?.image),
        displayPrice: pharmacyPrice,
        hasPrescriptionData: Boolean(medication?.duration || medication?.frequency || medication?.instructions || medication?.dosage)
    };
};

/**
 * Safely maps customer data
 */
export const mapCustomerData = (customer: any) => {
    return {
        _id: safeString(customer?._id || customer?.id),
        name: safeString(customer?.name),
        email: safeString(customer?.email),
        phone: safeString(customer?.phone),
        phoneVerified: safeBoolean(customer?.phoneVerified),
        emailVerified: safeBoolean(customer?.emailVerified),
        avatar: safeString(customer?.avatar),
        dateOfBirth: safeDate(customer?.dateOfBirth),
        gender: safeString(customer?.gender),
        preferredLanguage: safeString(customer?.preferredLanguage, 'en'),
        createdAt: safeDate(customer?.createdAt),
        updatedAt: safeDate(customer?.updatedAt)
    };
};

/**
 * Safely maps assigned reader data
 */
export const mapAssignedReaderData = (reader: any) => {
    if (!reader) return null;
    
    return {
        _id: safeString(reader._id),
        name: safeString(reader.name),
        email: safeString(reader.email),
        phone: safeString(reader.phone),
        specialization: safeString(reader.specialization),
        licenseNumber: safeString(reader.licenseNumber),
        rating: safeNumber(reader.rating),
        totalAssigned: safeNumber(reader.totalAssigned),
        processedPrescriptions: safeNumber(reader.processedPrescriptions),
        currentPrescriptions: safeNumber(reader.currentPrescriptions),
        averageProcessingTime: safeNumber(reader.averageProcessingTime),
        createdAt: safeDate(reader.createdAt)
    };
};

/**
 * Safely maps status history entries
 */
export const mapStatusHistory = (statusHistory: any[]) => {
    return safeArray(statusHistory).map(entry => ({
        status: safeString(entry?.status),
        timestamp: safeDate(entry?.timestamp),
        userId: safeString(entry?.userId),
        userRole: safeString(entry?.userRole),
        userName: safeString(entry?.userName),
        notes: safeString(entry?.notes),
        estimatedCompletion: safeDate(entry?.estimatedCompletion),
        _id: safeString(entry?._id)
    }));
};

/**
 * Safely maps prescription files
 */
export const mapPrescriptionFiles = (files: any[]) => {
    return safeArray(files).map(file => ({
        filename: safeString(file?.filename),
        originalName: safeString(file?.originalName),
        url: safeString(file?.url),
        type: safeString(file?.type),
        size: safeNumber(file?.size),
        uploadedAt: safeDate(file?.uploadedAt),
        _id: safeString(file?._id)
    }));
};

/**
 * Main prescription data mapping function
 */
export const mapPrescriptionData = (rawData: any) => {
    const mappedData = {
        // Basic prescription info
        _id: safeString(rawData._id),
        prescriptionNumber: safeString(rawData.prescriptionNumber),
        
        // Customer information
        customer: mapCustomerData(rawData.customerId),
        customerName: safeString(rawData.customerName),
        customerPhone: safeString(rawData.customerPhone),
        
        // Status and workflow
        currentStatus: safeString(rawData.currentStatus, 'submitted'),
        urgency: safeString(rawData.urgency, 'normal'),
        
        // Patient information
        patientName: safeString(rawData.patientName),
        patientAge: safeNumber(rawData.patientAge),
        patientGender: safeString(rawData.patientGender),
        patientWeight: safeNumber(rawData.patientWeight),
        patientHeight: safeNumber(rawData.patientHeight),
        
        // Doctor information
        doctorName: safeString(rawData.doctorName),
        doctorSpecialty: safeString(rawData.doctorSpecialty),
        doctorLicense: safeString(rawData.doctorLicense),
        hospitalClinic: safeString(rawData.hospitalClinic),
        prescriptionDate: safeDate(rawData.prescriptionDate),
        
        // Medications with comprehensive mapping
        medications: safeArray(rawData.medications).map(mapMedicationData),
        
        // Medical information
        diagnosis: safeString(rawData.diagnosis),
        allergies: safeArray(rawData.allergies),
        medicalHistory: safeArray(rawData.medicalHistory),
        specialInstructions: safeString(rawData.specialInstructions),
        
        // Assignment information
        assignedReader: mapAssignedReaderData(rawData.assignedReaderId),
        assignedPharmacyId: safeString(rawData.assignedPharmacyId),
        assignedPharmacistId: safeString(rawData.assignedPharmacistId),
        
        // Processing information
        processedMedicines: safeArray(rawData.processedMedicines),
        rejectionReason: safeString(rawData.rejectionReason),
        
        // Delivery and location
        deliveryAddress: safeString(rawData.deliveryAddress),
        deliveryFee: safeNumber(rawData.deliveryFee),
        cityId: safeString(rawData.cityId),
        governorateId: safeString(rawData.governorateId),
        
        // Financial information
        totalAmount: safeNumber(rawData.totalAmount),
        estimatedAmount: safeNumber(rawData.estimatedAmount),
        
        // Timing information
        estimatedCompletion: safeDate(rawData.estimatedCompletion),
        actualCompletion: safeDate(rawData.actualCompletion),
        processingStartedAt: safeDate(rawData.processingStartedAt),
        processingCompletedAt: safeDate(rawData.processingCompletedAt),
        reviewDuration: safeNumber(rawData.reviewDuration),
        
        // Files and documents
        files: mapPrescriptionFiles(rawData.files),
        
        // Status tracking
        statusHistory: mapStatusHistory(rawData.statusHistory),
        
        // Notes and comments
        notes: safeString(rawData.notes),
        pharmacyNotes: safeString(rawData.pharmacyNotes),
        readerNotes: safeString(rawData.readerNotes),
        internalNotes: safeString(rawData.internalNotes),
        
        // Quality control
        qualityChecked: safeBoolean(rawData.qualityChecked),
        qualityCheckedBy: safeString(rawData.qualityCheckedBy),
        qualityCheckedAt: safeDate(rawData.qualityCheckedAt),
        qualityNotes: safeString(rawData.qualityNotes),
        
        // Order integration
        orderId: safeString(rawData.orderId),
        orderCreated: safeBoolean(rawData.orderCreated),
        
        // System fields
        createdAt: safeDate(rawData.createdAt),
        updatedAt: safeDate(rawData.updatedAt),
        __v: safeNumber(rawData.__v),
        
        // Computed fields
        hasActiveMedications: safeArray(rawData.medications).length > 0,
        hasPharmacyStocks: safeArray(rawData.medications).some((med: any) => 
            safeArray(med?.id?.pharmacyStocks).length > 0
        ),
        totalMedicines: safeArray(rawData.medications).length,
        isComplete: ['approved', 'rejected'].includes(safeString(rawData.currentStatus))
    };

    return mappedData;
};

/**
 * Validation helper to check if essential fields are present
 */
export const validateMappedPrescription = (mappedData: ReturnType<typeof mapPrescriptionData>) => {
    const issues: string[] = [];
    
    if (!mappedData._id) issues.push('Missing prescription ID');
    if (!mappedData.customer._id) issues.push('Missing customer information');
    if (!mappedData.patientName) issues.push('Missing patient name');
    if (mappedData.medications.length === 0) issues.push('No medications found');
    
    // Check medication completeness
    mappedData.medications.forEach((med, index) => {
        if (!med.product._id) issues.push(`Medication ${index + 1}: Missing product ID`);
        if (!med.product.name) issues.push(`Medication ${index + 1}: Missing product name`);
        if (med.pharmacyStocks.length === 0) issues.push(`Medication ${index + 1}: No pharmacy stocks available`);
    });

    return {
        isValid: issues.length === 0,
        issues,
        warnings: []
    };
};

/**
 * Export utility functions
 */
export {
    safeGet,
    safeNumber,
    safeString,
    safeBoolean,
    safeArray,
    safeDate
};
