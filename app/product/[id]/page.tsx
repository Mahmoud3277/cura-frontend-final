'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { Footer } from '@/components/layout/Footer';
import { CategoriesBar } from '@/components/layout/CategoriesBar';
import { ClientOnly } from '@/components/common/ClientOnly';
import { ProductCard } from '@/components/product/ProductCard';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useCity } from '@/lib/contexts/CityContext';
import { useCart } from '@/lib/contexts/CartContext';

// Import all necessary functions from the new centralized API file
import { fetchMedicineById, filterProducts, sortProducts, Medicine, fetchRelatedProducts } from '@/lib/data/medicineData';

export default function ProductDetailPage() {
        const params = useParams();
        const router = useRouter();
        const { locale } = useLanguage();
        const { t } = useTranslation(locale);
        const { selectedCity } = useCity();
        const { addItem, isInCart, getItemQuantity, loadCartFromServer } = useCart();
    
        // API-based state
        const [product, setProduct] = useState<Medicine | null>(null);
        const [relatedProducts, setRelatedProducts] = useState<Medicine[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [cartLoaded, setCartLoaded] = useState(false);
    
        // UI state
        const [selectedImage, setSelectedImage] = useState(0);
        const [purchaseOption, setPurchaseOption] = useState<'blister' | 'box'>('blister');
        const [quantity, setQuantity] = useState(1);
        const [activeTab, setActiveTab] = useState('description');
        const [selectedProvider, setSelectedProvider] = useState<string>('');
        const [addingToCart, setAddingToCart] = useState(false);
        const [showAllPharmacies, setShowAllPharmacies] = useState(false);
    
        // Touch/Swipe state
        const [touchStart, setTouchStart] = useState<number | null>(null);
        const [touchEnd, setTouchEnd] = useState<number | null>(null);
    
        // Filter states
        const [sortOption, setSortOption] = useState('name');
        const [inStockOnly, setInStockOnly] = useState(false);
        const [prescriptionOnly, setPrescriptionOnly] = useState(false);
        const [minRating, setMinRating] = useState(0);
    
        const id = params.id as string;
    
        // Convert Medicine to Product type for CartContext compatibility
        const convertMedicineToProduct = (medicine: Medicine, provider: any) => {
            return {
                _id: medicine._id,
                name: medicine.name,
                nameAr: medicine.nameAr || '',
                activeIngredient: medicine.activeIngredient || '',
                activeIngredientAr: medicine.activeIngredientAr || '',
                category: medicine.category,
                subcategory: medicine.category, // Use category as subcategory for now
                manufacturer: medicine.manufacturer || '',
                manufacturerAr: medicine.manufacturerAr || '',
                genericName: medicine.genericName || '',
                strength: medicine.strength || '',
                dosage: medicine.form || '',
                dosageAr: '',
                form: medicine.form,
                unit: 'piece', // Default unit
                packSize: medicine.packSize || '',
                pricePerBlister: (medicine as any).pricePerBlister,
                pricePerBox: (medicine as any).pricePerBox,
                route: '',
                frequency: '',
                instructions: medicine.description || '',
                description: medicine.description || '',
                descriptionAr: medicine.descriptionAr || '',
                images: medicine.images || [],
                barcode: '', // Default empty barcode
                registrationNumber: '',
                requiresPrescription: medicine.requiresPrescription,
                prescriptionClass: '',
                controlledSubstance: false,
                therapeuticClass: '',
                indication: [],
                contraindications: [],
                sideEffects: [],
                drugInteractions: [],
                warnings: [],
                specialInstructions: [],
                timing: [],
                keywords: [],
                tags: medicine.tags || [],
                searchTerms: [],
                productType: 'medicine',
                isActive: medicine.isActive || true,
                isPopular: false,
                isGloballyAvailable: false,
                approvalStatus: 'approved',
                rating: medicine.rating || 0,
                reviewCount: medicine.reviews || 0,
                cityId: medicine.cityId || '',
                governorateId: medicine.governorateId || '',
                overallAvailability: medicine.inStock ? 'in-stock' : 'out-of-stock',
                overallAvailabilityPercentage: medicine.inStock ? 100 : 0,
                overallLowestPrice: provider?.price || 0,
                overallHighestPrice: provider?.originalPrice || provider?.price || 0,
                overallAveragePrice: provider?.price || 0,
                pharmacyAvailabilityPercentage: provider?.providerType === 'pharmacy' ? 100 : 0,
                pharmacyLowestPrice: provider?.providerType === 'pharmacy' ? provider?.price : 0,
                pharmacyHighestPrice: provider?.providerType === 'pharmacy' ? provider?.originalPrice || provider?.price : 0,
                pharmacyAveragePrice: provider?.providerType === 'pharmacy' ? provider?.price : 0,
                vendorAvailabilityPercentage: provider?.providerType === 'vendor' ? 100 : 0,
                vendorLowestPrice: provider?.providerType === 'vendor' ? provider?.price : 0,
                vendorHighestPrice: provider?.providerType === 'vendor' ? provider?.originalPrice || provider?.price : 0,
                vendorAveragePrice: provider?.providerType === 'vendor' ? provider?.price : 0,
                totalPharmacies: provider?.providerType === 'pharmacy' ? 1 : 0,
                totalVendors: provider?.providerType === 'vendor' ? 1 : 0,
                pharmacyStocks: provider?.providerType === 'pharmacy' ? [{
                    pharmacyId: provider.id,
                    pharmacyName: provider.providerName,
                    pharmacyNameAr: provider.providerName,
                    price: provider.price,
                    originalPrice: provider.originalPrice,
                    pricePerBlister: provider.pricePerBlister || (medicine as any).pricePerBlister,
                    pricePerBox: provider.pricePerBox || (medicine as any).pricePerBox,
                    quantity: provider.quantity || 99,
                    inStock: provider.inStock,
                    deliveryFee: provider.deliveryFee || 15,
                    estimatedDeliveryTime: provider.estimatedDeliveryTime || '2-3 hours',
                    lastUpdated: new Date().toISOString()
                }] : [],
                vendorStocks: provider?.providerType === 'vendor' ? [{
                    pharmacyId: provider.id,
                    pharmacyName: provider.providerName,
                    pharmacyNameAr: provider.providerName,
                    price: provider.price,
                    originalPrice: provider.originalPrice,
                    pricePerBlister: provider.pricePerBlister || (medicine as any).pricePerBlister,
                    pricePerBox: provider.pricePerBox || (medicine as any).pricePerBox,
                    quantity: provider.quantity || 99,
                    inStock: provider.inStock,
                    deliveryFee: provider.deliveryFee || 15,
                    estimatedDeliveryTime: provider.estimatedDeliveryTime || '2-3 hours',
                    lastUpdated: new Date().toISOString()
                }] : [],
                alternatives: [],
                genericAlternatives: [],
                brandAlternatives: [],
                strengthAlternatives: [],
                packagingOptions: [],
                expiryWarningDays: 30,
                masterDatabaseId: medicine._id,
                addedBy: '',
                createdAt: medicine.createdAt || new Date().toISOString(),
                updatedAt: medicine.updatedAt || new Date().toISOString(),
                __v: 0
            };
        };
    
        // Load cart from server when component mounts
        useEffect(() => {
            const loadCart = async () => {
                try {
                    // Only load cart from server if not already loaded to preserve promo codes
                    if (!cartLoaded) {
                        await loadCartFromServer();
                    }
                    setCartLoaded(true);
                } catch (error) {
                    console.error('Error loading cart from server:', error);
                    setCartLoaded(true);
                }
            };
            
            loadCart();
        }, [loadCartFromServer, cartLoaded]);
    
        // API fetching logic - Fixed
        useEffect(() => {
            const fetchProductAndRelated = async () => {
                if (!id) return;
                setLoading(true);
                setError(null); // Reset error state
                try {
                    // Fetch the main product
                    const fetchedProduct = await fetchMedicineById(id);
                    if (!fetchedProduct) {
                        setError('Product not found.');
                        setLoading(false);
                        return;
                    }
                    console.log(fetchedProduct, 'fetchedProduct')
                    // Set product with proper prescription flag
                    let fetchedProduct2 = { ...fetchedProduct, requiresPrescription: false };
                    setProduct(fetchedProduct2);
                    
                    // Fetch related products
                    const related = await fetchRelatedProducts(id);
                    
                    // Sort the related products
                    const sortedRelated = sortProducts(related, sortOption);
                    setRelatedProducts(sortedRelated);
    
                } catch (err: any) {
                    console.error('Error fetching data:', err);
                    setError('Failed to fetch product details or related items.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProductAndRelated();
        }, [id, inStockOnly, prescriptionOnly, minRating, sortOption]); // Added dependencies for filtering
    
        // Set default provider when product loads - Fixed
        useEffect(() => {
            if (product && !selectedProvider) {
                const allProviders = [...(product.pharmacyStocks || []), ...(product.vendorStocks || [])];
                if (allProviders.length > 0) {
                    setSelectedProvider(allProviders[0].id);
                }
            }
        }, [product, selectedProvider]);
    
        // Generate product images from R2 images array
        const productImages = useMemo(() => {
            if (!product) return [];
            
            // Use R2 images if available
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                return product.images.map(img => img.url);
            }
            
            // Final fallback
            return ['/placeholder-medicine.png'];
        }, [product]);
    
        // Get all providers - Fixed
        const allProviders = product ? [...(product.pharmacyStocks || []), ...(product.vendorStocks || [])] : [];
        
        // Get current provider - Fixed logic
        const currentProvider = allProviders.find(provider => provider.id === selectedProvider) || allProviders[0];
    
        const handleAddToCart = async () => {
            if (!product || !currentProvider) return;
            
            if (product.requiresPrescription) {
                router.push('/prescription/upload');
                return;
            }
            
            setAddingToCart(true);
            try {
                // Convert Medicine to Product type for CartContext compatibility
                const productForCart = convertMedicineToProduct(product, currentProvider);
                
                const stockData = {
                    pharmacyId: currentProvider.id,
                    pharmacyName: currentProvider.providerName,
                    pharmacyNameAr: currentProvider.providerName,
                    price: getUnitPrice(),
                    originalPrice: currentProvider.originalPrice,
                    pricePerBlister: (currentProvider as any).pricePerBlister,
                    pricePerBox: (currentProvider as any).pricePerBox,
                    quantity: currentProvider.quantity || 99,
                    inStock: currentProvider.inStock,
                    deliveryFee: currentProvider.deliveryFee || 15,
                    estimatedDeliveryTime: currentProvider.estimatedDeliveryTime || '2-3 hours',
                    lastUpdated: new Date().toISOString()
                };

                await addItem(productForCart, stockData, quantity);
                await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (error) {
                console.error('Error adding to cart:', error);
            } finally {
                setAddingToCart(false);
            }
        };

        // Calculate discount percentage - Fixed
        const discountPercentage = (currentProvider?.originalPrice && currentProvider?.price)
            ? Math.round(
                  ((currentProvider.originalPrice - currentProvider.price) /
                      currentProvider.originalPrice) *
                      100,
              )
            : 0;
    
        // Calculate price based on quantity and purchase option - Fixed
        const getUnitPrice = (option?: 'blister' | 'box') => {
            const purchaseOpt = option || purchaseOption;
            if (!currentProvider?.price) return 0;
            console.log('current proider', currentProvider)
            if (purchaseOpt === 'blister' && currentProvider?.pricePerBlister) {
                    
                    return currentProvider?.pricePerBlister;
                }
                // For box: assume a box contains 10 blisters, so price is higher
            if (purchaseOpt === 'box' && currentProvider?.pricePerBox) {
                    return currentProvider?.pricePerBox; // Box price = blister price * 10
                }
            
            // For non-medicine products, use regular pricing
            return currentProvider.pricePerBlister;
        };

        const getBlisterPrice = () => getUnitPrice('blister');
        const getBoxPrice = () => getUnitPrice('box');
    
        const getTotalPrice = () => {
            return getUnitPrice() * quantity;
        };
    
        // Check if item is already in cart (only after cart is loaded from server)
        const itemInCart = cartLoaded && product ? isInCart(product._id, selectedProvider) : false;
        const cartQuantity = cartLoaded && product ? getItemQuantity(product._id, selectedProvider) : 0;
    
        // Swipe functionality - Fixed bounds checking
        const minSwipeDistance = 50;
        const onTouchStart = (e: React.TouchEvent) => {
            setTouchEnd(null);
            setTouchStart(e.targetTouches[0].clientX);
        };
    
        const onTouchMove = (e: React.TouchEvent) => {
            setTouchEnd(e.targetTouches[0].clientX);
        };
    
        const onTouchEnd = () => {
            if (!touchStart || !touchEnd) return;
            const distance = touchStart - touchEnd;
            const isLeftSwipe = distance > minSwipeDistance;
            const isRightSwipe = distance < -minSwipeDistance;
    
            if (isLeftSwipe && selectedImage < productImages.length - 1) {
                setSelectedImage(selectedImage + 1);
            }
            if (isRightSwipe && selectedImage > 0) {
                setSelectedImage(selectedImage - 1);
            }
        };
    
        // Keyboard navigation - Fixed bounds checking
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && selectedImage > 0) {
                setSelectedImage(selectedImage - 1);
            }
            if (e.key === 'ArrowRight' && selectedImage < productImages.length - 1) {
                setSelectedImage(selectedImage + 1);
            }
        };
    
        // Reset selected image when productImages change
        useEffect(() => {
            setSelectedImage(0);
        }, [product]);
    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
                <ResponsiveHeader />
                <div className="hidden md:block">
                    <ClientOnly fallback={<div style={{ height: '60px' }} />}>
                        <CategoriesBar />
                    </ClientOnly>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1F6F] mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Product...</h1>
                    <p className="text-gray-600">Please wait while we fetch the product details.</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
                <ResponsiveHeader />
                <div className="hidden md:block">
                    <ClientOnly fallback={<div style={{ height: '60px' }} />}>
                        <CategoriesBar />
                    </ClientOnly>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Product Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {error || "The product you're looking for doesn't exist or has been removed."}
                    </p>
                    <Link
                        href="/shop"
                        className="bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#14274E] hover:to-[#394867] transition-all duration-300"
                    >
                        Back to Shop
                    </Link>
                </div>
                <div className="hidden md:block">
                    <ClientOnly>
                        <Footer />
                    </ClientOnly>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
            <ResponsiveHeader />
            {/* Desktop Categories Bar - Only show on desktop */}
            <div className="hidden md:block">
                <ClientOnly fallback={<div style={{ height: '60px' }} />}>
                    <CategoriesBar />
                </ClientOnly>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="px-4 py-6 space-y-6">
                    {/* Product Title - Mobile First */}
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 mb-1">
                            {locale === 'ar' ? product.nameAr : product.name}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {locale === 'ar' ? product.name : product.nameAr}
                        </p>
                    </div>

                    {/* Compact Product Image - Mobile */}
                    <div className="space-y-3">
                        {/* Main Product Image - Smaller for mobile with swipe */}
                        <div
                            className="aspect-[4/3] bg-white rounded-xl shadow-sm overflow-hidden max-w-sm mx-auto relative"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            onKeyDown={handleKeyDown}
                            tabIndex={0}
                        >
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Image counter only */}
                            {productImages.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                    {selectedImage + 1} / {productImages.length}
                                </div>
                            )}
                        </div>

                        {/* Compact Image Thumbnails - Mobile */}
                        {productImages.length > 1 && (
                            <div className="flex justify-center space-x-2 overflow-x-auto px-4">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === index
                                                ? 'border-[#1F1F6F] ring-1 ring-[#1F1F6F] ring-opacity-50 scale-110'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product badges - Mobile */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {product.requiresPrescription && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                Prescription Required
                            </span>
                        )}
                        {(product.pharmacyEligible && product.pharmacyStocks?.[0]?.inStock) || (product.vendorEligible && product.vendorStocks?.[0]?.inStock) ?  (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                In Stock
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                Out of Stock
                            </span>
                        )}
                        {discountPercentage > 0 && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                {discountPercentage}% OFF
                            </span>
                        )}
                        {product.rating && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                                ⭐ {product.rating}
                            </span>
                        )}
                    </div>

                    {/* Purchase Options - Mobile Compact */}
                    {product && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900">
                                Purchase Option:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setPurchaseOption('blister')}
                                    className={`p-3 border-2 rounded-lg transition-all ${
                                        purchaseOption === 'blister'
                                            ? 'border-[#1F1F6F] bg-blue-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-lg mb-1">💊</div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            Per Blister
                                        </div>
                                        <div className="text-xs text-[#1F1F6F] font-medium">
                                            EGP {getBlisterPrice().toFixed(2)}
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setPurchaseOption('box')}
                                    className={`p-3 border-2 rounded-lg transition-all ${
                                        purchaseOption === 'box'
                                            ? 'border-[#1F1F6F] bg-blue-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-lg mb-1">📦</div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            Per Box
                                        </div>
                                        <div className="text-xs text-[#1F1F6F] font-medium">
                                            EGP {getBoxPrice().toFixed(2)}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quantity Selection - Mobile Compact */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-900">
                            Quantity:
                        </label>
                        <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white transition-all duration-200 flex items-center justify-center font-bold"
                            >
                                -
                            </button>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#1F1F6F]">
                                    {quantity}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {product.category === 'otc' ||
                                    product.category === 'prescription'
                                        ? `${purchaseOption === 'blister' ? 'Blister(s)' : 'Box(es)'}`
                                        : 'Unit(s)'}
                                </div>
                            </div>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white transition-all duration-200 flex items-center justify-center font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Price Display - Mobile Compact */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {product.category === 'otc' || product.category === 'prescription'
                                    ? `Price per ${purchaseOption === 'blister' ? 'Blister' : 'Box'}:`
                                    : 'Unit Price:'}
                            </span>
                            <span className="font-semibold text-gray-900">
                                EGP {getUnitPrice().toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">
                                Total Price:
                            </span>
                            <span className="font-bold text-xl text-[#1F1F6F]">
                                EGP {getTotalPrice().toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Provider Selection - Mobile Compact */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-900">
                            Choose Provider:
                        </h3>
                        {allProviders.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {allProviders.map((provider) => (
                                    <label
                                        key={provider.id}
                                        className={`block p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                            selectedProvider === provider.id
                                                ? 'border-[#1F1F6F] bg-blue-50'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="provider"
                                            value={provider.id}
                                            checked={selectedProvider == provider.id}
                                            onChange={(e) => {console.log(e.target.value),setSelectedProvider(e.target.value)}}
                                            className="sr-only"
                                        />

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        {provider.providerName}
                                                    </h4>
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            provider.providerType === 'pharmacy'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {provider.providerType === 'pharmacy'
                                                            ? 'Pharmacy'
                                                            : 'Vendor'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-[#1F1F6F]">
                                                    EGP {provider.pricePerBlister}
                                                </div>
                                                {provider.originalPrice && (
                                                    <div className="text-xs text-gray-500 line-through">
                                                        EGP {provider.originalPrice}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-yellow-400 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-yellow-800">
                                            Not Available in {selectedCity?.nameEn}
                                        </p>
                                        <p className="text-xs text-yellow-700">
                                            This medicine is currently out of stock.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add to Cart Button - Mobile */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!currentProvider?.inStock || addingToCart || allProviders.length === 0}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                            itemInCart
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : currentProvider?.inStock && !addingToCart && allProviders.length > 0
                                  ? 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white hover:from-[#14274E] hover:to-[#394867]'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {addingToCart ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Adding...</span>
                            </div>
                        ) : itemInCart ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>In Cart ({cartQuantity})</span>
                            </div>
                        ) : allProviders.length === 0 ? (
                            'Not Available'
                        ) : product.requiresPrescription ? (
                            'Upload Prescription Required'
                        ) : !currentProvider?.inStock ? (
                            'Out of Stock'
                        ) : (
                            `Add ${quantity} ${
                                product.category === 'otc' || product.category === 'prescription'
                                    ? purchaseOption === 'blister'
                                        ? 'Blister(s)'
                                        : 'Box(es)'
                                    : 'Unit(s)'
                            } - EGP ${getTotalPrice()}`
                        )}
                    </button>

                    {/* Product Description - Mobile */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Description
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-700">
                                {locale === 'ar' ? product.descriptionAr : product.description}
                            </p>
                            <p className="text-xs text-gray-600">
                                {locale === 'ar' ? product.description : product.descriptionAr}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout - Complete Implementation */}
            <div className="hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Images and Details */}
                        <div className="space-y-6 group">
                            {/* Main Product Image with swipe support */}
                            <div
                                className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden relative"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                onKeyDown={handleKeyDown}
                                tabIndex={0}
                            >
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Desktop navigation arrows */}
                                {productImages.length > 1 && (
                                    <>
                                        {/* Left arrow */}
                                        {selectedImage > 0 && (
                                            <button
                                                onClick={() => setSelectedImage(selectedImage - 1)}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 19l-7-7 7-7"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                        {/* Right arrow */}
                                        {selectedImage < productImages.length - 1 && (
                                            <button
                                                onClick={() => setSelectedImage(selectedImage + 1)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                        {/* Image counter for desktop */}
                                        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                                            {selectedImage + 1} / {productImages.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Image Thumbnails */}
                            {productImages.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-[#1F1F6F] ring-2 ring-[#1F1F6F] ring-opacity-50 scale-110'
                                                    : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Product badges */}
                            <div className="flex flex-wrap gap-2">
                                {product.prescriptionRequired && (
                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                        Prescription Required
                                    </span>
                                )}
                                {product.inStock !== false ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                        Out of Stock
                                    </span>
                                )}
                                {discountPercentage > 0 && (
                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                                        {discountPercentage}% OFF
                                    </span>
                                )}
                                {product.rating && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center">
                                        ⭐ {product.rating} ({product.reviews || 0} reviews)
                                    </span>
                                )}
                            </div>

                            {/* Product Details Tabs */}
                            <div className="border-t pt-6">
                                <div className="flex space-x-8 border-b">
                                    {[{ id: 'description', label: 'Description' }].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === tab.id
                                                    ? 'border-[#1F1F6F] text-[#1F1F6F]'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="py-4">
                                    {activeTab === 'description' && (
                                        <div className="space-y-4">
                                            <p className="text-gray-700">
                                                {locale === 'ar' ? product.descriptionAr : product.description}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                {locale === 'ar' ? product.description : product.descriptionAr}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Purchase Options */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {locale === 'ar' ? product.nameAr : product.name}
                                </h1>
                                <p className="text-lg text-gray-600">
                                    {locale === 'ar' ? product.name : product.nameAr}
                                </p>
                            </div>

                            {/* Purchase Options - Per Blister/Per Box (Only for Medicine Products) */}
                            {product && (
                                <div className="space-y-3">
                                    <label className="text-lg font-medium text-gray-900">
                                        Purchase Option:
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setPurchaseOption('blister')}
                                            className={`p-4 border-2 rounded-xl transition-all ${
                                                purchaseOption === 'blister'
                                                    ? 'border-[#1F1F6F] bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">💊</div>
                                                <div className="font-semibold text-gray-900">
                                                    Per Blister
                                                </div>
                                                <div className="text-sm text-[#1F1F6F] font-medium">
                                                    EGP {getBlisterPrice().toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Individual strips
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setPurchaseOption('box')}
                                            className={`p-4 border-2 rounded-xl transition-all ${
                                                purchaseOption === 'box'
                                                    ? 'border-[#1F1F6F] bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">📦</div>
                                                <div className="font-semibold text-gray-900">
                                                    Per Box
                                                </div>
                                                <div className="text-sm text-[#1F1F6F] font-medium">
                                                    EGP {getBoxPrice().toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Complete package
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selection */}
                            <div className="space-y-3">
                                <label className="text-lg font-medium text-gray-900">
                                    Quantity:
                                </label>
                                <div className="flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white transition-all duration-200 flex items-center justify-center font-bold text-xl"
                                    >
                                        -
                                    </button>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#1F1F6F]">
                                            {quantity}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {product.category === 'otc' ||
                                            product.category === 'prescription'
                                                ? `${purchaseOption === 'blister' ? 'Blister(s)' : 'Box(es)'}`
                                                : 'Unit(s)'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 rounded-full border-2 border-[#1F1F6F] text-[#1F1F6F] hover:bg-[#1F1F6F] hover:text-white transition-all duration-200 flex items-center justify-center font-bold text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Price Display */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        {product.category === 'otc' ||
                                        product.category === 'prescription'
                                            ? `Price per ${purchaseOption === 'blister' ? 'Blister' : 'Box'}:`
                                            : 'Unit Price:'}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        EGP {getUnitPrice().toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-medium text-gray-900">
                                        Total Price:
                                    </span>
                                    <span className="font-bold text-2xl text-[#1F1F6F]">
                                        EGP {getTotalPrice().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Provider Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Choose Provider:
                                </h3>
                                {allProviders.length > 0 ? (
                                    <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                                        {allProviders.map((provider) => (
                                            <label
                                                key={provider.id}
                                                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                    selectedProvider === provider.id
                                                        ? 'border-[#1F1F6F] bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="provider"
                                                    value={provider.id}
                                                    checked={
                                                        selectedProvider === provider.id
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedProvider(e.target.value)
                                                    }
                                                    className="sr-only"
                                                />

                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {provider.providerName}
                                                            </h4>
                                                            <span
                                                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                                    provider.providerType ===
                                                                    'pharmacy'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-blue-100 text-blue-800'
                                                                }`}
                                                            >
                                                                {provider.providerType ===
                                                                'pharmacy'
                                                                    ? 'Pharmacy'
                                                                    : 'Vendor'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-[#1F1F6F]">
                                                            EGP {provider.pricePerBlister}
                                                        </div>
                                                        {provider.originalPrice && (
                                                            <div className="text-sm text-gray-500 line-through">
                                                                EGP{' '}
                                                                {provider.originalPrice}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-yellow-400 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-yellow-800">
                                                    Not Available in {selectedCity?.nameEn}
                                                </p>
                                                <p className="text-sm text-yellow-700">
                                                    This medicine is currently out of stock from all
                                                    providers in your selected city.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={
                                    currentProvider && !currentProvider.inStock || addingToCart || allProviders.length === 0
                                }
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                                    itemInCart
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : currentProvider && currentProvider.inStock &&
                                            !addingToCart &&
                                            allProviders.length > 0
                                          ? 'bg-gradient-to-r from-[#1F1F6F] to-[#14274E] text-white hover:from-[#14274E] hover:to-[#394867] transform hover:scale-105'
                                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {addingToCart ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Adding to Cart...</span>
                                    </div>
                                ) : itemInCart ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>In Cart ({cartQuantity})</span>
                                    </div>
                                ) : allProviders.length === 0 ? (
                                    'Not Available in Your City'
                                ) : product.requiresPrescription ? (
                                    'Upload Prescription Required'
                                ) : currentProvider && !currentProvider.inStock ? (
                                    'Out of Stock'
                                ) : (
                                    `Add ${quantity} ${
                                        product.category === 'otc' ||
                                        product.category === 'prescription'
                                            ? purchaseOption === 'blister'
                                                ? 'Blister(s)'
                                                : 'Box(es)'
                                            : 'Unit(s)'
                                    } to Cart - EGP ${getTotalPrice()}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-8">
                        Related Products
                    </h2>

                    {/* Filter and Sort Controls - Desktop Only */}
                    <div className="hidden md:block mb-6">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-4">
                                <label className="text-gray-600">
                                    {t('sort_by')}:
                                </label>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="border rounded-md px-2 py-1"
                                >
                                    <option value="name">Name</option>
                                    <option value="price-low">Price (Low to High)</option>
                                    <option value="price-high">Price (High to Low)</option>
                                    <option value="rating">Rating</option>
                                    <option value="reviews">Reviews</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="rounded"
                                    />
                                    <span>{t('in_stock_only')}</span>
                                </label>
                                <label className="flex items-center space-x-2 text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={prescriptionOnly}
                                        onChange={(e) => setPrescriptionOnly(e.target.checked)}
                                        className="rounded"
                                    />
                                    <span>{t('prescription_only')}</span>
                                </label>
                                <div>
                                    <label className="text-gray-600 mr-2">
                                        {t('min_rating')}:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        value={minRating}
                                        onChange={(e) => setMinRating(parseInt(e.target.value) || 0)}
                                        className="w-16 text-center border rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Related Products - Compact Grid */}
                    <div className="md:hidden">
                        <div className="grid grid-cols-2 gap-3">
                            {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                <div
                                    key={relatedProduct._id}
                                    onClick={() =>
                                        (window.location.href = `/product/${relatedProduct._id}`)
                                    }
                                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2">
                                        {relatedProduct.images?.[0]?.url ? (
                                            <img
                                                src={relatedProduct.images[0].url}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <div className="text-xs font-semibold text-gray-500 bg-gray-200 rounded px-2 py-1">
                                                {relatedProduct.category === 'medications'
                                                    ? 'MED'
                                                    : relatedProduct.category === 'otc'
                                                      ? 'OTC'
                                                      : 'PROD'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <h4 className="font-semibold text-gray-900 text-xs mb-1 leading-tight line-clamp-2">
                                            {locale === 'ar' ? relatedProduct.nameAr : relatedProduct.name}
                                        </h4>
                                        <div className="text-xs font-bold text-[#1F1F6F]">
                                            EGP {relatedProduct.price || '0.00'}
                                        </div>
                                        {relatedProduct.rating && (
                                            <div className="text-xs text-yellow-500 flex items-center mt-1">
                                                ⭐ {relatedProduct.rating}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Related Products - Original Layout */}
                    <div className="hidden md:block">
                        {relatedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <ProductCard
                                        key={relatedProduct._id}
                                        product={relatedProduct}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No related products found with these filters.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Desktop Footer */}
            <div className="hidden md:block">
                <ClientOnly>
                    <Footer />
                </ClientOnly>
            </div>

            {/* Mobile Floating Navigation */}
            <div className="block md:hidden">
                <ClientOnly>
                    <FloatingNavigation />
                </ClientOnly>
            </div>

            {/* Mobile Bottom Padding */}
            <div className="h-20 md:hidden"></div>
        </div>
    );
}