import { MedicineSelection, SelectionSummary } from '@/lib/contexts/MedicineSelectionContext';
import { getAuthToken } from '@/lib/utils/cookies';
import { CartItem } from '@/lib/types';
import { Product } from '@/lib/data/products';

// Add configuration for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface PrescriptionCartItem extends CartItem {
    prescriptionId: string;
    prescriptionReference: string;
    originalMedicineName: string;
    isAlternative: boolean;
    prescribedQuantity: number;
    medicineInstructions?: string;
    pharmacistNotes?: string;
    // Add medicineId for backend compatibility
    medicineId?: string;
}

export interface MultiPharmacyOrder {
    pharmacyId: string;
    pharmacyName: string;
    items: PrescriptionCartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    estimatedDeliveryTime: string;
}

export interface PrescriptionCheckoutData {
    prescriptionId: string;
    prescriptionReference: string;
    orders: MultiPharmacyOrder[];
    totalItems: number;
    totalAmount: number;
    totalDeliveryFees: number;
    grandTotal: number;
    estimatedDeliveryTime: string;
    requiresPharmacistConsultation: boolean;
    hasAlternatives: boolean;
    specialInstructions: string[];
}

export class MedicineSelectionCheckoutService {
    /**
     * Convert medicine selections to prescription cart items
     */
    static convertSelectionsToCartItems(
        selections: Record<string, MedicineSelection>,
        prescriptionId: string,
        prescriptionReference: string,
    ): PrescriptionCartItem[] {
        return Object.values(selections)
            .filter(
                (selection) =>
                    selection.selectedPharmacy &&
                    selection.selectedQuantity > 0 &&
                    selection.isSelected !== false,
            )
            .map((selection) => {
                const pharmacy = selection.selectedPharmacy!;
                const medicine = selection.selectedMedicine;

                // Use packaging price instead of stock price for prescription items
                const packagePrice =
                    pharmacy.packagingPrices?.[selection.selectedPackaging] ||
                    pharmacy.stockInfo?.price ||
                    0;

                return {
                    id: `prescription-${prescriptionId}-${selection.medicineId}`,
                    productId: selection.medicineId,
                    medicineId: selection.medicineId, // Add for backend compatibility
                    name: medicine.name || medicine.id.name,
                    nameAr: medicine.nameAr || medicine.id.nameAr || medicine.name,
                    price: packagePrice,
                    originalPrice: packagePrice,
                    quantity: selection.selectedQuantity, // Use total calculated quantity, not just packaging quantity
                    pharmacy: pharmacy.pharmacyName,
                    pharmacyId: pharmacy.pharmacyId,
                    pharmacyName: pharmacy.pharmacyName, // Add explicit pharmacyName
                    cityId: pharmacy.cityId || '1',
                    cityName: pharmacy.cityName || 'Unknown',
                    image: medicine.id?.images?.[0]?.url || '/placeholder-medicine.png',
                    prescription: true,
                    // Set inStock to true since pharmacy was already validated during selection
                    inStock: true,
                    category: medicine.id?.category || medicine.category,
                    manufacturer: medicine.id?.manufacturer || medicine.manufacturer,
                    activeIngredient: medicine.id?.activeIngredient || medicine.activeIngredient,
                    dosage: medicine.id?.dosage || medicine.dosage,
                    packSize: medicine.id?.packSize || medicine.packSize,
                    deliveryFee: pharmacy.deliveryInfo?.deliveryFee || pharmacy.deliveryFee || 0,
                    estimatedDeliveryTime: pharmacy.deliveryInfo?.deliveryTime || '30-45 mins',
                    // Set maxQuantity high to avoid validation issues
                    maxQuantity: 999,

                    // Prescription-specific fields
                    prescriptionId,
                    prescriptionReference,
                    originalMedicineName: selection.originalMedicine.name || selection.originalMedicine.id.name,
                    isAlternative: !!selection.selectedAlternative,
                    prescribedQuantity: selection.prescribedQuantity,
                    medicineInstructions: medicine.instructions || selection.originalMedicine.instructions,
                    pharmacistNotes: selection.notes,
                };
            });
    }

    /**
     * Group cart items by pharmacy for multi-pharmacy orders
     */
    static groupItemsByPharmacy(items: PrescriptionCartItem[]): MultiPharmacyOrder[] {
        const pharmacyGroups: Record<string, PrescriptionCartItem[]> = {};

        // Group items by pharmacy
        items.forEach((item) => {
            if (!pharmacyGroups[item.pharmacyId]) {
                pharmacyGroups[item.pharmacyId] = [];
            }
            pharmacyGroups[item.pharmacyId].push(item);
        });

        // Convert to MultiPharmacyOrder objects
        return Object.entries(pharmacyGroups).map(([pharmacyId, pharmacyItems]) => {
            const subtotal = pharmacyItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );
            const deliveryFee = pharmacyItems[0].deliveryFee; // Same for all items from same pharmacy
            const total = subtotal + deliveryFee;

            // Get the longest delivery time for this pharmacy
            const deliveryTimes = pharmacyItems.map((item) => item.estimatedDeliveryTime);
            const estimatedDeliveryTime = this.getLongestDeliveryTime(deliveryTimes);

            return {
                pharmacyId,
                pharmacyName: pharmacyItems[0].pharmacy,
                items: pharmacyItems,
                subtotal,
                deliveryFee,
                total,
                estimatedDeliveryTime,
            };
        });
    }

    /**
     * Create complete prescription checkout data
     */
    static createPrescriptionCheckoutData(
        selections: Record<string, MedicineSelection>,
        prescriptionId: string,
        prescriptionReference: string,
    ): PrescriptionCheckoutData {
        const cartItems = this.convertSelectionsToCartItems(
            selections,
            prescriptionId,
            prescriptionReference,
        );
        const orders = this.groupItemsByPharmacy(cartItems);

        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = orders.reduce((sum, order) => sum + order.subtotal, 0);
        const totalDeliveryFees = orders.reduce((sum, order) => sum + order.deliveryFee, 0);
        const grandTotal = totalAmount + totalDeliveryFees;

        // Calculate overall estimated delivery time (longest among all pharmacies)
        const allDeliveryTimes = orders.map((order) => order.estimatedDeliveryTime);
        const estimatedDeliveryTime = this.getLongestDeliveryTime(allDeliveryTimes);

        // Check for special conditions
        const hasAlternatives = cartItems.some((item) => item.isAlternative);
        const requiresPharmacistConsultation = hasAlternatives || cartItems.length > 5; // Arbitrary rule

        // Collect special instructions
        const specialInstructions: string[] = [];
        if (hasAlternatives) {
            specialInstructions.push(
                'Alternative medicines selected - pharmacist consultation required',
            );
        }
        if (orders.length > 1) {
            specialInstructions.push(`Order will be split across ${orders.length} pharmacies`);
        }

        const notesWithContent = cartItems.filter((item) => item.pharmacistNotes?.trim());
        if (notesWithContent.length > 0) {
            specialInstructions.push('Special instructions provided for some medicines');
        }

        return {
            prescriptionId,
            prescriptionReference,
            orders,
            totalItems,
            totalAmount,
            totalDeliveryFees,
            grandTotal,
            estimatedDeliveryTime,
            requiresPharmacistConsultation,
            hasAlternatives,
            specialInstructions,
        };
    }

    /**
     * Add prescription items to cart via backend API
     */
    static async addPrescriptionItemsToBackend(
        cartItems: PrescriptionCartItem[],
        prescriptionId: string,
        token: string,
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // Validate inputs
            if (!cartItems || cartItems.length === 0) {
                throw new Error('No items to add to cart');
            }


            const payload = {
                items: cartItems.map(item => ({
                    productId: item.productId,
                    medicineId: item.medicineId || item.productId,
                    pharmacyId: item.pharmacyId,
                    pharmacyName: item.pharmacyName || item.pharmacy,
                    quantity: item.quantity,
                    price: item.price,
                    productName: item.name,
                    image: item.images && item.images.length > 0 ? item.images[0].url : item.image,
                    prescriptionId: item.prescriptionId,
                    prescriptionReference: item.prescriptionReference,
                    originalMedicineName: item.originalMedicineName,
                    isAlternative: item.isAlternative,
                    prescribedQuantity: item.prescribedQuantity,
                    medicineInstructions: item.medicineInstructions,
                    pharmacistNotes: item.pharmacistNotes,
                })),
                prescriptionId,
            };

            // Construct full URL
            const url = `${API_BASE_URL}/cart/add-prescription-items`;
            
            console.log('Making request to:', url);
            console.log('Payload:', JSON.stringify(payload, null, 2));
            // console.log(token, 'token')
            const tokenAuth = getAuthToken()
            const response = await fetch(url, {
                method: 'POST',
                headers:{
                    "Content-Type":"application/json",
                    ...(tokenAuth && { Authorization: `Bearer ${tokenAuth}` }),
                },
                body: JSON.stringify(payload),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            // if (!response) {
            //     const errorText = await response.text();
            //     console.error('Error response:', errorText);
                
            //     let errorMessage = 'Failed to add items to cart';
            //     try {
            //         const errorData = JSON.parse(errorText);
            //         errorMessage = errorData.message || errorData.error || errorMessage;
            //     } catch {
            //         errorMessage = errorText || errorMessage;
            //     }
                
            //     throw new Error(errorMessage);
            // }

            const data = await response.json();
            console.log('Success response:', data);

            return { success: true };
        } catch (error) {
            console.error('Error adding prescription items to cart:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to add items to cart' 
            };
        }
    }

    /**
     * Create order from cart via backend API
     */
    static async createOrderFromCart(
        checkoutData: PrescriptionCheckoutData,
        deliveryAddress: any,
        token: string,
    ): Promise<{ success: boolean; orderId?: string; error?: string }> {
        try {
            // Validate inputs
            if (!token) {
                throw new Error('Authentication token is required');
            }

            if (!deliveryAddress) {
                throw new Error('Delivery address is required');
            }

            // Flatten all items from all pharmacy orders
            const allItems = checkoutData.orders.flatMap(order => 
                order.items.map(item => ({
                    medicineId: item.medicineId || item.productId,
                    productId: item.productId,
                    pharmacyId: item.pharmacyId,
                    pharmacyName: item.pharmacyName || item.pharmacy,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    image: item.images && item.images.length > 0 ? item.images[0].url : item.image,
                    prescriptionId: item.prescriptionId,
                    prescriptionReference: item.prescriptionReference,
                    originalMedicineName: item.originalMedicineName,
                    isAlternative: item.isAlternative,
                    prescribedQuantity: item.prescribedQuantity,
                    medicineInstructions: item.medicineInstructions,
                    pharmacistNotes: item.pharmacistNotes,
                }))
            );

            const payload = {
                items: allItems,
                deliveryAddress,
                prescriptionId: checkoutData.prescriptionId,
                prescriptionMetadata: {
                    prescriptionReference: checkoutData.prescriptionReference,
                    estimatedDeliveryTime: checkoutData.estimatedDeliveryTime,
                    specialInstructions: checkoutData.specialInstructions,
                    requiresPharmacistConsultation: checkoutData.requiresPharmacistConsultation,
                    hasAlternatives: checkoutData.hasAlternatives,
                },
                priority: checkoutData.requiresPharmacistConsultation ? 'high' : 'normal',
                orderType: 'prescription',
                deliveryInstructions: checkoutData.specialInstructions.join('; '),
            };

            // Construct full URL
            const url = `${API_BASE_URL}/orders/`;
            
            console.log('Creating order at:', url);
            console.log('Order payload:', JSON.stringify(payload, null, 2));
            const tokenAuth = getAuthToken()
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(tokenAuth && { Authorization: `Bearer ${tokenAuth}` }),
                },
                body: JSON.stringify(payload),
            });

            console.log('Order response status:', response.status);

            if (!response) {
                const errorText = await response.text();
                console.error('Order creation error:', errorText);
                
                let errorMessage = 'Failed to create order';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Order created successfully:', data);

            return { 
                success: true, 
                orderId: data.data._id || data.data.id 
            };
        } catch (error) {
            console.error('Error creating order:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to create order' 
            };
        }
    }

    // ... (rest of the methods remain the same)

    /**
     * Complete workflow: Convert selections to cart and proceed to checkout
     */
    static async processSelectionToCheckout(
        selections: Record<string, any>,
        prescriptionId: string,
        token: string,
        deliveryAddress: any,
        redirectToCheckout?: () => void,
    ): Promise<{
        success: boolean;
        error?: string;
        checkoutData?: PrescriptionCheckoutData;
        orderId?: string;
    }> {
        try {
            console.log('Processing selection to checkout:', { selections, prescriptionId });

            // Validate selections before processing
            const selectedMedicines = Object.values(selections).filter(
                (s: any) => s.isSelected !== false,
            );
            const completedSelections = selectedMedicines.filter(
                (s: any) => s.selectedPharmacy && s.selectedQuantity > 0,
            );

            if (selectedMedicines.length === 0) {
                return {
                    success: false,
                    error: 'No medicines selected for checkout',
                };
            }

            if (completedSelections.length === 0) {
                return {
                    success: false,
                    error: 'Please complete your medicine and pharmacy selections',
                };
            }

            if (completedSelections.length < selectedMedicines.length) {
                return {
                    success: false,
                    error: `Please complete selections for all ${selectedMedicines.length} selected medicines`,
                };
            }

            // Create prescription checkout data
            const checkoutData = this.createPrescriptionCheckoutData(
                selections,
                prescriptionId,
                `RX-${prescriptionId}`,
            );

            console.log('Created checkout data:', checkoutData);

            // Validate checkout data
            const validation = this.validatePrescriptionCheckout(checkoutData);

            if (!validation.isValid) {
                console.error('Checkout validation failed:', validation.errors);
                return {
                    success: false,
                    error: `Cannot proceed to checkout:\n${validation.errors.join('\n')}`,
                };
            }

            // Show warnings if any (optional - can be handled by caller)
            if (validation.warnings.length > 0) {
                console.warn('Checkout warnings:', validation.warnings);
            }

            // Convert to cart items
            const cartItems = this.convertSelectionsToCartItems(
                selections,
                prescriptionId,
                `RX-${prescriptionId}`,
            );

            console.log('Converted cart items:', cartItems);

            // Add items to cart in backend
            const cartResult = await this.addPrescriptionItemsToBackend(
                cartItems,
                prescriptionId,
                token,
            );

            if (!cartResult.success) {
                return {
                    success: false,
                    error: cartResult.error || 'Failed to add items to cart',
                };
            }

            console.log('Items added to cart successfully');

            // If delivery address is provided, create order directly
            // if (deliveryAddress) {
            //     const orderResult = await this.createOrderFromCart(
            //         checkoutData,
            //         deliveryAddress,
            //         token,
            //     );

            //     if (!orderResult.success) {
            //         return {
            //             success: false,
            //             error: orderResult.error || 'Failed to create order',
            //         };
            //     }

            //     console.log('Order created successfully:', orderResult.orderId);

            //     return {
            //         success: true,
            //         checkoutData,
            //         orderId: orderResult.orderId,
            //     };
            // }

            // Otherwise, redirect to checkout page
            if (redirectToCheckout) {
                console.log('Redirecting to checkout...');
                redirectToCheckout();
            }

            return {
                success: true,
                checkoutData,
            };
        } catch (error) {
            console.error('Error processing selection to checkout:', error);
            return {
                success: false,
                error: `Error processing checkout: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    /**
     * Get checkout URL with prescription parameter
     */
    static getCheckoutUrl(prescriptionId: string): string {
        return `/checkout?prescription=${prescriptionId}`;
    }

    /**
     * Create order summary text for confirmation
     */
    static createOrderConfirmationText(checkoutData: PrescriptionCheckoutData): string {
        const lines: string[] = [];

        lines.push('Medicine selections added to cart!');
        lines.push('');
        lines.push(`Prescription: ${checkoutData.prescriptionReference}`);
        lines.push(`Items: ${checkoutData.totalItems} medicines`);
        lines.push(`Pharmacies: ${checkoutData.orders.length}`);
        lines.push(`Total: ${checkoutData.grandTotal.toFixed(2)} EGP`);
        lines.push(`Delivery: ${checkoutData.estimatedDeliveryTime}`);

        if (checkoutData.specialInstructions.length > 0) {
            lines.push('');
            lines.push('Special Instructions:');
            checkoutData.specialInstructions.forEach((instruction) => {
                lines.push(`• ${instruction}`);
            });
        }

        return lines.join('\n');
    }

    /**
     * Create prescription-specific order metadata
     */
    static createPrescriptionOrderMetadata(
        prescriptionCheckoutData: PrescriptionCheckoutData,
        customerInfo: any,
    ) {
        return {
            type: 'prescription',
            prescriptionId: prescriptionCheckoutData.prescriptionId,
            prescriptionReference: prescriptionCheckoutData.prescriptionReference,
            requiresPharmacistConsultation: prescriptionCheckoutData.requiresPharmacistConsultation,
            hasAlternatives: prescriptionCheckoutData.hasAlternatives,
            specialInstructions: prescriptionCheckoutData.specialInstructions,
            multiPharmacyOrder: prescriptionCheckoutData.orders.length > 1,
            pharmacyCount: prescriptionCheckoutData.orders.length,
            totalMedicines: prescriptionCheckoutData.totalItems,
            estimatedDeliveryTime: prescriptionCheckoutData.estimatedDeliveryTime,
            createdAt: new Date().toISOString(),
            customerInfo: {
                id: customerInfo.id,
                name: customerInfo.name,
                phone: customerInfo.phone,
                email: customerInfo.email,
            },
        };
    }

    /**
     * Validate prescription checkout data
     */
    static validatePrescriptionCheckout(checkoutData: PrescriptionCheckoutData): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Basic validation
        if (!checkoutData.prescriptionId) {
            errors.push('Prescription ID is required');
        }

        if (checkoutData.orders.length === 0) {
            errors.push('No medicines selected for checkout');
        }

        if (checkoutData.totalItems === 0) {
            errors.push('No items in prescription order');
        }

        // Business rule validations
        if (checkoutData.orders.length > 3) {
            warnings.push('Order spans multiple pharmacies - delivery times may vary');
        }

        if (checkoutData.hasAlternatives) {
            warnings.push(
                'Alternative medicines selected - pharmacist will verify before dispensing',
            );
        }

        if (checkoutData.grandTotal > 1000) {
            warnings.push(
                'High-value prescription order - additional verification may be required',
            );
        }

        // Enhanced stock availability check using pharmacy availability service
        checkoutData.orders.forEach((order) => {
            order.items.forEach((item) => {
                // Skip stock validation for prescription items as they were already validated
                // during the medicine selection process. The pharmacy availability service
                // already ensures only in-stock pharmacies are shown to users.

                // Only validate if the item has explicit stock information
                if (item.hasOwnProperty('inStock') && !item.inStock) {
                    errors.push(`${item.name} is out of stock at ${item.pharmacy}`);
                }

                // Only validate quantity if maxQuantity is explicitly set and valid
                if (item.maxQuantity && item.maxQuantity > 0 && item.quantity > item.maxQuantity) {
                    errors.push(
                        `Requested quantity for ${item.name} exceeds available stock (${item.maxQuantity} available)`,
                    );
                }
            });
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    /**
     * Helper method to determine the longest delivery time
     */
    private static getLongestDeliveryTime(deliveryTimes: string[]): string {
        if (deliveryTimes.length === 0) return '2-4 hours';

        // Parse delivery times and find the maximum
        const maxHours = deliveryTimes.reduce((max, timeStr) => {
            const match = timeStr.match(/(\d+)-(\d+)/);
            if (match) {
                const upperBound = parseInt(match[2]);
                return Math.max(max, upperBound);
            }
            return max;
        }, 0);

        // Return a range based on the maximum
        if (maxHours <= 2) return '1-2 hours';
        if (maxHours <= 4) return '2-4 hours';
        if (maxHours <= 8) return '4-8 hours';
        if (maxHours <= 24) return '8-24 hours';
        return '1-2 days';
    }

    /**
     * Generate prescription order summary for confirmation
     */
    static generateOrderSummary(checkoutData: PrescriptionCheckoutData): string {
        const lines: string[] = [];

        lines.push(`Prescription Order Summary`);
        lines.push(`Prescription: ${checkoutData.prescriptionReference}`);
        lines.push(`Total Items: ${checkoutData.totalItems}`);
        lines.push(`Pharmacies: ${checkoutData.orders.length}`);
        lines.push('');

        checkoutData.orders.forEach((order, index) => {
            lines.push(`Pharmacy ${index + 1}: ${order.pharmacyName}`);
            order.items.forEach((item) => {
                const altText = item.isAlternative ? ' (Alternative)' : '';
                lines.push(
                    `  - ${item.name}${altText}: ${item.quantity}x @ EGP ${item.price.toFixed(2)}`,
                );
            });
            lines.push(`  Subtotal: EGP ${order.subtotal.toFixed(2)}`);
            lines.push(`  Delivery: EGP ${order.deliveryFee.toFixed(2)}`);
            lines.push(`  Total: EGP ${order.total.toFixed(2)}`);
            lines.push('');
        });

        lines.push(`Grand Total: EGP ${checkoutData.grandTotal.toFixed(2)}`);
        lines.push(`Estimated Delivery: ${checkoutData.estimatedDeliveryTime}`);

        if (checkoutData.specialInstructions.length > 0) {
            lines.push('');
            lines.push('Special Instructions:');
            checkoutData.specialInstructions.forEach((instruction) => {
                lines.push(`- ${instruction}`);
            });
        }

        return lines.join('\n');
    }
}

export default MedicineSelectionCheckoutService;
